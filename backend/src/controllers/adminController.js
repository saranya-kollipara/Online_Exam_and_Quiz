import { prisma } from '../config/database.js';
import { analyticsService } from '../services/analyticsService.js';
import { aiQuestionService } from '../services/aiQuestionService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const adminController = {
  /**
   * Admin dashboard summary metrics and telemetry
   */
  async getDashboard(req, res, next) {
    try {
      const data = await analyticsService.getAdminPlatformAnalytics();
      return successResponse(res, 'Admin dashboard metrics retrieved.', data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all exams for admin (including drafts, active, scheduled, completed)
   */
  async getExams(req, res, next) {
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

      return successResponse(res, 'Admin examination roster retrieved.', formatted);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create a new examination (in DRAFT status)
   */
  async createExam(req, res, next) {
    try {
      const {
        title,
        description,
        streamId,
        subjectId,
        topicName,
        numberOfQuestions,
        durationMinutes,
        totalMarks,
        passMarks,
        difficulty,
        questionType,
        negativeMarking,
        negativeMarks,
        startDate,
        endDate,
        maxAttempts,
        shuffleQuestions,
        shuffleOptions,
        questionIds
      } = req.body;

      const createdById = req.user.id;

      const newExam = await prisma.$transaction(async (tx) => {
        const exam = await tx.exam.create({
          data: {
            title,
            description,
            streamId,
            subjectId,
            topicName,
            durationMinutes: Number(durationMinutes) || 45,
            totalMarks: Number(totalMarks) || 50,
            passMarks: Number(passMarks) || (Number(totalMarks) || 50) * 0.4,
            difficulty: difficulty || 'MEDIUM',
            questionType: questionType || 'MIXED',
            negativeMarking: Boolean(negativeMarking),
            negativeMarks: Number(negativeMarks) || 0.0,
            status: 'DRAFT',
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            maxAttempts: Number(maxAttempts) || 1,
            shuffleQuestions: shuffleQuestions !== false,
            shuffleOptions: shuffleOptions !== false,
            createdById
          }
        });

        // Link any selected initial questions
        if (questionIds && questionIds.length > 0) {
          const links = questionIds.map((qId, idx) => ({
            examId: exam.id,
            questionId: qId,
            orderNumber: idx + 1,
            marks: Number(totalMarks) / questionIds.length || 2.0,
            negativeMarks: negativeMarking ? Number(negativeMarks) || 0.5 : 0.0
          }));

          await tx.examQuestion.createMany({
            data: links,
            skipDuplicates: true
          });
        }

        return exam;
      });

      return successResponse(res, 'Examination draft created successfully.', newExam, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update scheduled examination
   */
  async updateExam(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      // Prevent updating completed or archived exams
      const existing = await prisma.exam.findUnique({ where: { id } });
      if (!existing) {
        return errorResponse(res, 'Examination not found.', 404);
      }
      if (existing.status === 'COMPLETED' || existing.status === 'ARCHIVED') {
        return errorResponse(res, 'Cannot modify completed or archived examinations.', 400);
      }

      delete updateData.id;
      delete updateData.createdById;
      delete updateData.questionIds;

      const updated = await prisma.exam.update({
        where: { id },
        data: updateData
      });

      return successResponse(res, 'Examination updated successfully.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete draft examination
   */
  async deleteExam(req, res, next) {
    try {
      const { id } = req.params;
      const exam = await prisma.exam.findUnique({ where: { id } });

      if (!exam) {
        return errorResponse(res, 'Examination not found.', 404);
      }

      if (exam.status === 'ACTIVE') {
        return errorResponse(res, 'Cannot delete an active ongoing examination. Please deactivate it first.', 400);
      }

      await prisma.exam.delete({ where: { id } });
      return successResponse(res, 'Examination removed from system.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Synthesize AI questions for a specific exam
   */
  async generateExamQuestions(req, res, next) {
    try {
      const { id } = req.params;
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: { subject: true, stream: true }
      });

      if (!exam) {
        return errorResponse(res, 'Examination not found.', 404);
      }

      const count = Number(req.body.numberOfQuestions) || 5;

      const generated = await aiQuestionService.generateQuestions({
        streamName: exam.stream.name,
        subjectName: exam.subject.name,
        topicName: exam.topicName || 'General',
        numberOfQuestions: count,
        difficulty: req.body.difficulty || exam.difficulty,
        questionType: req.body.questionType || exam.questionType,
        marksPerQuestion: exam.negativeMarks > 0 ? 2 : 2,
        negativeMarks: exam.negativeMarks
      });

      // Insert questions into database with isApproved = false (Mandatory review guardrail)
      const createdQuestions = await prisma.$transaction(async (tx) => {
        const saved = [];
        for (const q of generated) {
          const newQ = await tx.question.create({
            data: {
              text: q.text,
              type: q.type,
              difficulty: q.difficulty,
              defaultMarks: q.defaultMarks,
              negativeMarks: q.negativeMarks,
              explanation: q.explanation,
              contentHash: q.contentHash,
              normalizedText: q.normalizedText,
              isApproved: false, // Strict review requirement
              isAiGenerated: true,
              streamId: exam.streamId,
              subjectId: exam.subjectId,
              codeProblemDetails: q.codeProblemDetails,
              options: {
                create: q.options
              }
            },
            include: { options: true }
          });

          // Link to exam
          await tx.examQuestion.create({
            data: {
              examId: exam.id,
              questionId: newQ.id,
              marks: q.defaultMarks,
              negativeMarks: q.negativeMarks
            }
          });

          saved.push(newQ);
        }
        return saved;
      });

      return successResponse(
        res,
        `Synthesized ${createdQuestions.length} questions. Faculty review & approval required before publishing.`,
        createdQuestions,
        201
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Approve synthesized questions for an exam
   */
  async approveExamQuestions(req, res, next) {
    try {
      const { id } = req.params;
      const { questionIds } = req.body;

      if (!questionIds || questionIds.length === 0) {
        // Approve all questions for this exam
        const examQuestions = await prisma.examQuestion.findMany({
          where: { examId: id },
          select: { questionId: true }
        });
        const allIds = examQuestions.map(eq => eq.questionId);

        await prisma.question.updateMany({
          where: { id: { in: allIds } },
          data: { isApproved: true }
        });

        return successResponse(res, `All ${allIds.length} examination questions approved.`);
      }

      await prisma.question.updateMany({
        where: { id: { in: questionIds } },
        data: { isApproved: true }
      });

      return successResponse(res, `Approved ${questionIds.length} selected questions.`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Publish examination
   * Strict Guardrail: Cannot publish if any question remains unapproved!
   */
  async publishExam(req, res, next) {
    try {
      const { id } = req.params;
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          examQuestions: {
            include: { question: true }
          }
        }
      });

      if (!exam) {
        return errorResponse(res, 'Examination not found.', 404);
      }

      if (exam.examQuestions.length === 0) {
        return errorResponse(res, 'Cannot publish an examination with zero assigned questions.', 400);
      }

      // Check unapproved questions
      const unapproved = exam.examQuestions.filter(eq => !eq.question.isApproved);
      if (unapproved.length > 0) {
        return errorResponse(
          res,
          `Academic Integrity Guardrail: ${unapproved.length} question(s) have not been verified and approved. Please approve all questions before publishing.`,
          400
        );
      }

      // Determine new status: ACTIVE if start date is now/past or null, else SCHEDULED
      const now = new Date();
      let nextStatus = 'ACTIVE';
      if (exam.startDate && new Date(exam.startDate) > now) {
        nextStatus = 'SCHEDULED';
      }

      const published = await prisma.exam.update({
        where: { id },
        data: {
          status: nextStatus
        }
      });

      return successResponse(res, `Examination published successfully with status: ${nextStatus}.`, published);
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all students with search and pagination
   */
  async getStudents(req, res, next) {
    try {
      const { search = '', streamId, page = 1, limit = 50 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        role: 'STUDENT',
        AND: [
          search ? {
            OR: [
              { firstName: { contains: String(search) } },
              { lastName: { contains: String(search) } },
              { email: { contains: String(search) } }
            ]
          } : undefined,
          streamId ? {
            studentProfile: { streamId: String(streamId) }
          } : undefined
        ].filter(Boolean)
      };

      const [students, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            studentProfile: {
              include: { stream: true }
            },
            _count: {
              select: { examAttempts: true, results: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.user.count({ where })
      ]);

      const formatted = students.map(s => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        institution: s.studentProfile?.institution || 'N/A',
        year: s.studentProfile?.yearOfStudy || 'N/A',
        stream: s.studentProfile?.stream?.name || 'Computer Science & Engineering',
        examsTaken: s._count.results || 0,
        status: s.isActive ? 'Active' : 'Inactive',
        lastActive: 'Recently'
      }));

      return successResponse(res, 'Student cohort retrieved.', {
        students: formatted,
        pagination: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
