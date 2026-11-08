import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { examService } from '../services/examService.js';
import { gradingService } from '../services/gradingService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const examController = {
  /**
   * List available/active examinations
   */
  async getAllExams(req, res, next) {
    try {
      const { status, streamId, search } = req.query;

      const where = {
        AND: [
          status && status !== 'all' ? { status: status.toUpperCase() } : undefined,
          streamId && streamId !== 'all' ? { streamId: String(streamId) } : undefined,
          search ? {
            OR: [
              { title: { contains: String(search) } },
              { subject: { name: { contains: String(search) } } },
              { topicName: { contains: String(search) } }
            ]
          } : undefined
        ].filter(Boolean)
      };

      const exams = await prisma.exam.findMany({
        where,
        include: {
          subject: { select: { id: true, name: true } },
          stream: { select: { id: true, name: true } },
          _count: { select: { examQuestions: true, attempts: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = exams.map((e) => ({
        id: e.id,
        title: e.title,
        stream: e.stream?.name || 'Engineering',
        streamId: e.streamId,
        subject: e.subject?.name || 'General',
        subjectId: e.subjectId,
        topic: e.topicName || 'General',
        durationMinutes: e.durationMinutes,
        totalQuestions: e._count?.examQuestions || 0,
        totalMarks: e.totalMarks,
        negativeMarking: e.negativeMarking,
        negativeMarks: e.negativeMarks,
        difficulty: e.difficulty,
        status: e.status.toLowerCase(),
        startDate: e.startDate,
        endDate: e.endDate,
        maxAttempts: e.maxAttempts,
        attemptsMade: e._count?.attempts || 0
      }));

      return successResponse(res, 'Examinations list retrieved.', formatted);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Retrieve single examination with questions
   */
  async getExamById(req, res, next) {
    try {
      const { id } = req.params;
      const isAdmin = req.user?.role === 'ADMIN';

      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          subject: true,
          stream: true,
          examQuestions: {
            include: {
              question: {
                include: {
                  options: true
                }
              }
            },
            orderBy: { orderNumber: 'asc' }
          }
        }
      });

      if (!exam) {
        return errorResponse(res, 'Examination not found.', 404);
      }

      // If non-admin and exam is not active, deny access
      if (!isAdmin && exam.status !== 'ACTIVE') {
        return errorResponse(res, 'This examination is not currently open.', 403);
      }

      const populatedQuestions = exam.examQuestions.map((eq) => {
        const q = eq.question;
        return {
          id: q.id,
          text: q.text,
          type: q.type,
          difficulty: q.difficulty,
          marks: eq.marks || q.defaultMarks,
          negativeMarks: eq.negativeMarks || q.negativeMarks,
          explanation: isAdmin ? q.explanation : undefined,
          correctAnswer: isAdmin ? q.options.find(o => o.isCorrect)?.id : undefined,
          options: q.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            isCorrect: isAdmin ? opt.isCorrect : undefined
          }))
        };
      });

      return successResponse(res, 'Examination details retrieved.', {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        stream: exam.stream?.name || 'Engineering',
        streamId: exam.streamId,
        subject: exam.subject?.name || 'General',
        subjectId: exam.subjectId,
        topic: exam.topicName || 'General',
        durationMinutes: exam.durationMinutes,
        totalQuestions: populatedQuestions.length,
        totalMarks: exam.totalMarks,
        negativeMarking: exam.negativeMarking,
        negativeMarks: exam.negativeMarks,
        difficulty: exam.difficulty,
        status: exam.status.toLowerCase(),
        startDate: exam.startDate,
        endDate: exam.endDate,
        maxAttempts: exam.maxAttempts,
        populatedQuestions
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Start an examination attempt
   */
  async startExam(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const attemptData = await examService.startExamAttempt(id, userId);
      return successResponse(res, 'Examination room ready. Timer started.', attemptData, 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  },

  /**
   * Retrieve active attempt
   */
  async getAttempt(req, res, next) {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      const attemptData = await examService.getAttemptForStudent(attemptId, userId);
      return successResponse(res, 'Attempt state retrieved.', attemptData);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  },

  /**
   * Real-time server-side autosave
   */
  async saveAnswers(req, res, next) {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;
      const { answers = {}, markedForReview = {} } = req.body;

      const result = await examService.saveStudentAnswers(attemptId, userId, answers, markedForReview);
      return successResponse(res, 'Responses saved.', result);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  },

  /**
   * Final submission and deterministic grading
   */
  async submitExam(req, res, next) {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;
      const { answers = null } = req.body;

      const result = await gradingService.submitAndGradeAttempt(attemptId, userId, answers);
      return successResponse(res, 'Examination submitted and evaluated successfully.', result);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  },

  /**
   * Admin publishes a new academic examination with full relational MySQL persistence
   */
  async createExam(req, res, next) {
    try {
      const {
        title,
        description,
        stream,
        streamName,
        subject,
        topic,
        numberOfQuestions,
        duration,
        durationMinutes,
        marksPerQuestion = 2,
        negativeMarking = false,
        negativeMarks = 0.0,
        difficulty = 'MEDIUM',
        questionType = 'MCQ',
        startDate,
        endDate,
        maxAttempts = 1,
        questions = []
      } = req.body;

      // 1. Resolve or create Stream record
      let streamRecord = null;
      if (stream) {
        streamRecord = await prisma.stream.findFirst({
          where: {
            OR: [
              { id: String(stream) },
              { code: String(stream).toUpperCase() },
              { name: { contains: String(streamName || stream) } }
            ]
          }
        });
      }
      if (!streamRecord) {
        streamRecord = (await prisma.stream.findFirst()) || (await prisma.stream.create({
          data: {
            name: String(streamName || 'Computer Science and Engineering'),
            code: String(stream || 'CSE').toUpperCase().slice(0, 10),
            description: 'Core Engineering Stream'
          }
        }));
      }

      // 2. Resolve or create Subject record
      let subjectRecord = null;
      if (subject) {
        subjectRecord = await prisma.subject.findFirst({
          where: {
            streamId: streamRecord.id,
            OR: [
              { id: String(subject) },
              { name: String(subject) },
              { name: { contains: String(subject) } }
            ]
          }
        });
      }
      if (!subjectRecord) {
        const subName = String(subject || 'Core Engineering');
        const subCode = subName.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase() || 'CORE';
        subjectRecord = await prisma.subject.create({
          data: {
            name: subName,
            code: `${subCode}_${Date.now().toString().slice(-4)}`,
            streamId: streamRecord.id,
            description: `Curriculum subject for ${subName}`
          }
        });
      }

      // 3. Normalize Difficulty & Question Type
      const validDifficulty = ['EASY', 'MEDIUM', 'HARD'].includes(String(difficulty).toUpperCase())
        ? String(difficulty).toUpperCase()
        : 'MEDIUM';
      const validQuestionType = String(questionType || 'MCQ').toUpperCase();

      const qList = Array.isArray(questions) ? questions : [];
      const totalMarksVal =
        qList.reduce((acc, q) => acc + (Number(q.marks || marksPerQuestion) || 2), 0) ||
        (qList.length * 2) ||
        50;
      const passMarksVal = Math.round(totalMarksVal * 0.4);

      // 4. Create Exam in MySQL - ACTIVE by default so immediately accessible in portals
      const exam = await prisma.exam.create({
        data: {
          title: title || `${subjectRecord.name} - ${topic || 'Comprehensive'} Examination`,
          description: description || `Official curriculum examination for ${subjectRecord.name} (${topic || 'General'}).`,
          streamId: streamRecord.id,
          subjectId: subjectRecord.id,
          topicName: topic || null,
          durationMinutes: Number(duration || durationMinutes) || 45,
          totalMarks: totalMarksVal,
          passMarks: passMarksVal,
          negativeMarking: Boolean(negativeMarking),
          negativeMarks: Number(negativeMarks) || 0.0,
          difficulty: validDifficulty,
          questionType: validQuestionType,
          status: 'ACTIVE',
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 14 * 86400000),
          maxAttempts: Number(maxAttempts) || 1,
          shuffleQuestions: true,
          shuffleOptions: true,
          createdById: req.user?.id || null
        }
      });

      // 5. Populate Questions in MySQL
      const populatedQuestions = [];
      for (let idx = 0; idx < qList.length; idx++) {
        const q = qList[idx];
        const questionText = q.text || q.questionText || `Question ${idx + 1}`;
        const contentHash = crypto.createHash('sha256').update(questionText.toLowerCase().trim()).digest('hex');
        const normText = questionText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();

        let questionRecord = await prisma.question.findUnique({
          where: { contentHash },
          include: { options: true }
        });

        if (!questionRecord) {
          const qType =
            q.type === 'Multiple select' || q.type === 'MULTIPLE_SELECT'
              ? 'MULTIPLE_SELECT'
              : q.type === 'True/False' || q.type === 'TRUE_FALSE'
              ? 'TRUE_FALSE'
              : q.type === 'Programming' || q.type === 'PROGRAMMING'
              ? 'PROGRAMMING'
              : 'MCQ';

          const qDiff = ['EASY', 'MEDIUM', 'HARD'].includes(String(q.difficulty).toUpperCase())
            ? String(q.difficulty).toUpperCase()
            : validDifficulty;

          const marks = Number(q.marks || marksPerQuestion) || 2;
          const negMarks = Number(q.negativeMarks || negativeMarks) || 0;
          const rawOptions = Array.isArray(q.options) ? q.options : [];

          questionRecord = await prisma.question.create({
            data: {
              text: questionText,
              type: qType,
              difficulty: qDiff,
              defaultMarks: marks,
              negativeMarks: negMarks,
              explanation: q.explanation || `Comprehensive solution for ${subjectRecord.name}.`,
              contentHash,
              normalizedText: normText,
              isApproved: true,
              isAiGenerated: true,
              streamId: streamRecord.id,
              subjectId: subjectRecord.id,
              options: {
                create: rawOptions.map((opt, oIdx) => {
                  const optionKey =
                    typeof opt === 'object' && opt !== null
                      ? opt.id || opt.optionKey || String.fromCharCode(65 + oIdx)
                      : String.fromCharCode(65 + oIdx);
                  const optText =
                    typeof opt === 'object' && opt !== null ? opt.text || opt.title || '' : String(opt);
                  const isCorrect = Array.isArray(q.correctAnswer)
                    ? q.correctAnswer.includes(optionKey)
                    : q.correctAnswer === optionKey || q.correctAnswer === optText;
                  return {
                    optionKey,
                    text: optText,
                    isCorrect: Boolean(isCorrect),
                    sortOrder: oIdx
                  };
                })
              }
            },
            include: { options: true }
          });
        }

        // Link into ExamQuestion
        await prisma.examQuestion.create({
          data: {
            examId: exam.id,
            questionId: questionRecord.id,
            orderNumber: idx + 1,
            marks: Number(q.marks || marksPerQuestion) || 2,
            negativeMarks: Number(q.negativeMarks || negativeMarks) || 0
          }
        });

        populatedQuestions.push({
          id: questionRecord.id,
          text: questionRecord.text,
          type:
            questionRecord.type === 'MULTIPLE_SELECT'
              ? 'Multiple select'
              : questionRecord.type === 'TRUE_FALSE'
              ? 'True/False'
              : questionRecord.type === 'PROGRAMMING'
              ? 'Programming'
              : 'MCQ',
          difficulty: questionRecord.difficulty,
          marks: Number(q.marks || marksPerQuestion) || 2,
          negativeMarks: Number(q.negativeMarks || negativeMarks) || 0,
          options: (questionRecord.options || []).map((o) => ({
            id: o.optionKey,
            optionKey: o.optionKey,
            text: o.text
          })),
          correctAnswer: questionRecord.options?.find((o) => o.isCorrect)?.optionKey || 'A',
          explanation: questionRecord.explanation
        });
      }

      const responseData = {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        stream: streamRecord.name,
        streamId: streamRecord.id,
        subject: subjectRecord.name,
        subjectId: subjectRecord.id,
        topic: exam.topicName || 'General',
        durationMinutes: exam.durationMinutes,
        totalQuestions: populatedQuestions.length,
        totalMarks: exam.totalMarks,
        negativeMarking: exam.negativeMarking,
        negativeMarks: exam.negativeMarks,
        difficulty: exam.difficulty,
        status: exam.status.toLowerCase(),
        startDate: exam.startDate,
        endDate: exam.endDate,
        maxAttempts: exam.maxAttempts,
        attemptsMade: 0,
        totalEnrolled: 120,
        participated: 0,
        averageScore: 0,
        highestScore: 0,
        populatedQuestions
      };

      return successResponse(res, 'Examination created and published successfully.', responseData, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update examination details or status
   */
  async updateExam(req, res, next) {
    try {
      const { id } = req.params;
      const { status, title, description, durationMinutes, maxAttempts } = req.body;

      const data = {};
      if (status) data.status = status.toUpperCase();
      if (title) data.title = title;
      if (description !== undefined) data.description = description;
      if (durationMinutes) data.durationMinutes = Number(durationMinutes);
      if (maxAttempts) data.maxAttempts = Number(maxAttempts);

      const updated = await prisma.exam.update({
        where: { id },
        data
      });

      return successResponse(res, 'Exam updated successfully.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Publish an examination to ACTIVE status
   */
  async publishExam(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await prisma.exam.update({
        where: { id },
        data: { status: 'ACTIVE' }
      });
      return successResponse(res, 'Exam published and active.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete an examination
   */
  async deleteExam(req, res, next) {
    try {
      const { id } = req.params;
      await prisma.exam.delete({ where: { id } });
      return successResponse(res, 'Exam deleted successfully.');
    } catch (err) {
      next(err);
    }
  }
};
