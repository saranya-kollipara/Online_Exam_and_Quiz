import { prisma } from '../config/database.js';
import { duplicateDetectionService } from './duplicateDetectionService.js';
import { logger } from '../utils/logger.js';

export const examService = {
  /**
   * Helper to shuffle array with Fisher-Yates algorithm
   */
  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Student starts an examination attempt
   */
  async startExamAttempt(examId, userId) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
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
      throw new Error('Examination not found.');
    }

    if (exam.status !== 'ACTIVE') {
      throw new Error(`Examination is not currently active. Current status: ${exam.status}`);
    }

    const now = new Date();
    if (exam.startDate && now < new Date(exam.startDate)) {
      throw new Error(`Examination has not opened yet. Starts at ${exam.startDate}`);
    }
    if (exam.endDate && now > new Date(exam.endDate)) {
      throw new Error('Examination window has closed.');
    }

    // Check existing attempts
    const existingAttempts = await prisma.examAttempt.findMany({
      where: { examId, userId },
      orderBy: { attemptNumber: 'desc' }
    });

    // Check if an attempt is already IN_PROGRESS and not expired
    const activeAttempt = existingAttempts.find(a => a.status === 'IN_PROGRESS');
    if (activeAttempt) {
      if (now < new Date(activeAttempt.expiresAt)) {
        // Return existing in-progress attempt
        return this.getAttemptForStudent(activeAttempt.id, userId);
      } else {
        // Mark as TIMED_OUT
        await prisma.examAttempt.update({
          where: { id: activeAttempt.id },
          data: { status: 'TIMED_OUT' }
        });
      }
    }

    // Verify max attempts limit
    const completedCount = existingAttempts.filter(a => a.status === 'SUBMITTED' || a.status === 'TIMED_OUT').length;
    if (completedCount >= exam.maxAttempts) {
      throw new Error(`Maximum attempts reached (${completedCount}/${exam.maxAttempts}).`);
    }

    const nextAttemptNumber = existingAttempts.length + 1;
    const durationMs = exam.durationMinutes * 60 * 1000;
    const expiresAt = new Date(now.getTime() + durationMs);

    // Prepare randomized question & option ordering
    let questionsList = exam.examQuestions.map(eq => eq.question);
    if (exam.shuffleQuestions) {
      questionsList = this._shuffle(questionsList);
    }

    const shuffledMap = questionsList.map((q, idx) => {
      let optionsList = q.options.map(o => ({
        id: o.id,
        optionKey: o.optionKey,
        text: o.text
      }));

      if (exam.shuffleOptions && q.type !== 'TRUE_FALSE') {
        optionsList = this._shuffle(optionsList);
      }

      return {
        questionId: q.id,
        displayOrder: idx + 1,
        optionsOrder: optionsList.map(o => o.id)
      };
    });

    // Create Attempt record in transaction
    const newAttempt = await prisma.$transaction(async (tx) => {
      const attempt = await tx.examAttempt.create({
        data: {
          examId,
          userId,
          attemptNumber: nextAttemptNumber,
          status: 'IN_PROGRESS',
          startedAt: now,
          expiresAt,
          shuffledQuestionsOrder: shuffledMap
        }
      });

      // Initialize empty StudentAnswer rows
      const studentAnswerRows = questionsList.map(q => ({
        attemptId: attempt.id,
        questionId: q.id,
        isAnswered: false,
        isMarkedForReview: false
      }));

      await tx.studentAnswer.createMany({
        data: studentAnswerRows
      });

      return attempt;
    });

    // Log exposure history for duplicate prevention
    await duplicateDetectionService.recordQuestionExposure(
      userId,
      questionsList.map(q => q.id),
      examId
    );

    return this.getAttemptForStudent(newAttempt.id, userId);
  },

  /**
   * Retrieves attempt for student, sanitizing and stripping all correct answers & explanations!
   */
  async getAttemptForStudent(attemptId, userId) {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            subject: { select: { name: true } },
            stream: { select: { name: true } },
            topicName: true,
            durationMinutes: true,
            totalMarks: true,
            negativeMarking: true,
            negativeMarks: true,
            questionType: true,
            difficulty: true
          }
        },
        answers: true
      }
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Attempt not found or unauthorized.');
    }

    // Check timer expiration on server
    const now = new Date();
    const isExpired = now > new Date(attempt.expiresAt);

    // Fetch questions
    const questionIds = (attempt.shuffledQuestionsOrder || []).map(item => item.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        text: true,
        type: true,
        difficulty: true,
        defaultMarks: true,
        negativeMarks: true,
        codeProblemDetails: true,
        options: {
          select: {
            id: true,
            optionKey: true,
            text: true,
            sortOrder: true
            // isCorrect is STRICTLY excluded!
          }
        }
      }
    });

    // Reconstruct in exact shuffled order
    const orderedQuestions = (attempt.shuffledQuestionsOrder || []).map((meta, idx) => {
      const q = questions.find(item => item.id === meta.questionId);
      if (!q) return null;

      // Reorder options according to shuffled order
      let orderedOptions = q.options;
      if (meta.optionsOrder && meta.optionsOrder.length > 0) {
        orderedOptions = meta.optionsOrder
          .map(optId => q.options.find(o => o.id === optId))
          .filter(Boolean);
      }

      return {
        ...q,
        orderNumber: idx + 1,
        options: orderedOptions
      };
    }).filter(Boolean);

    // Map existing answers
    const answersMap = {};
    const markedMap = {};
    for (const ans of attempt.answers) {
      if (ans.isAnswered) {
        answersMap[ans.questionId] = ans.codeResponse || ans.selectedOptionIds || ans.textResponse;
      }
      if (ans.isMarkedForReview) {
        markedMap[ans.questionId] = true;
      }
    }

    const timeRemainingSeconds = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - now.getTime()) / 1000));

    return {
      attemptId: attempt.id,
      examId: attempt.examId,
      exam: attempt.exam,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      timeRemainingSeconds,
      isExpired,
      questions: orderedQuestions,
      savedAnswers: answersMap,
      markedForReview: markedMap
    };
  },

  /**
   * Autosaves student answers in real-time
   */
  async saveStudentAnswers(attemptId, userId, answers = {}, markedForReview = {}) {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId }
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Attempt not found or unauthorized.');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error('Cannot update an attempt that is no longer in progress.');
    }

    // Check timer expiration
    if (new Date() > new Date(attempt.expiresAt)) {
      throw new Error('Examination time has expired.');
    }

    // Upsert answers
    for (const [questionId, value] of Object.entries(answers)) {
      const isMarked = !!markedForReview[questionId];
      let selectedOptionIds = null;
      let textResponse = null;
      let codeResponse = null;
      let isAnswered = false;

      if (value != null && value !== '') {
        isAnswered = true;
        if (Array.isArray(value)) {
          selectedOptionIds = value;
        } else if (typeof value === 'string' && (value.includes('{') || value.includes('function') || value.includes('def '))) {
          codeResponse = value;
        } else if (typeof value === 'string') {
          selectedOptionIds = [value];
          textResponse = value;
        } else {
          selectedOptionIds = [String(value)];
        }
      }

      await prisma.studentAnswer.upsert({
        where: {
          attemptId_questionId: {
            attemptId,
            questionId
          }
        },
        create: {
          attemptId,
          questionId,
          selectedOptionIds,
          textResponse,
          codeResponse,
          isAnswered,
          isMarkedForReview: isMarked
        },
        update: {
          selectedOptionIds,
          textResponse,
          codeResponse,
          isAnswered,
          isMarkedForReview: isMarked,
          savedAt: new Date()
        }
      });
    }

    return { success: true, savedAt: new Date().toISOString() };
  }
};

