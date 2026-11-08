import { prisma } from '../config/database.js';
import { aiQuestionService } from '../services/aiQuestionService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const mockTestController = {
  /**
   * Generates a new personalized AI practice mock test
   */
  async generateMockTest(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        streamId,
        subjectName = 'Data Structures',
        topicName = 'Trees',
        numberOfQuestions = 10,
        durationMinutes = 20,
        difficulty = 'MEDIUM',
        questionType = 'MCQ'
      } = req.body;

      // Validate difficulty enum for MySQL Prisma schema (EASY, MEDIUM, HARD)
      const validDifficulty = ['EASY', 'MEDIUM', 'HARD'].includes(String(difficulty).toUpperCase())
        ? String(difficulty).toUpperCase()
        : 'MEDIUM';

      // Synthesize questions using AI
      const questions = await aiQuestionService.generateQuestions({
        subjectName,
        topicName,
        numberOfQuestions: Number(numberOfQuestions),
        difficulty: validDifficulty,
        questionType
      });

      const mockTest = await prisma.mockTest.create({
        data: {
          userId,
          title: `AI Practice Drill: ${subjectName} (${topicName})`,
          streamId: streamId || null,
          topicName,
          difficulty: validDifficulty,
          questionType,
          durationMinutes: Number(durationMinutes),
          totalQuestions: questions.length,
          questionsData: questions
        }
      });

      const populatedQuestions = questions.map((q, idx) => ({
        id: `mock_q_${Date.now()}_${idx + 1}`,
        orderNumber: idx + 1,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        marks: q.defaultMarks || 2,
        negativeMarks: q.negativeMarks || 0,
        options: (q.options || []).map((o) => ({
          id: o.optionKey,
          optionKey: o.optionKey,
          text: o.text
        })),
        correctAnswer: q.options?.find((o) => o.isCorrect)?.optionKey || 'A',
        explanation: q.explanation || `Comprehensive solution derivation for ${topicName}.`
      }));

      return successResponse(
        res,
        'AI practice drill created successfully.',
        {
          ...mockTest,
          subject: subjectName,
          topic: topicName,
          durationMinutes: Number(durationMinutes),
          totalQuestions: populatedQuestions.length,
          totalMarks: populatedQuestions.length * 2,
          isMock: true,
          populatedQuestions
        },
        201
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Starts a practice mock test attempt
   */
  async startMockTest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const mockTest = await prisma.mockTest.findUnique({
        where: { id }
      });

      if (!mockTest || mockTest.userId !== userId) {
        return errorResponse(res, 'Mock test drill not found.', 404);
      }

      const attempt = await prisma.mockTestAttempt.create({
        data: {
          mockTestId: mockTest.id,
          userId,
          answersData: {},
          startedAt: new Date()
        }
      });

      // Strip correct answers for the test session
      const sanitizedQuestions = (mockTest.questionsData || []).map((q, idx) => ({
        id: `mock_q_${idx + 1}`,
        orderNumber: idx + 1,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        marks: q.defaultMarks || 2,
        options: (q.options || []).map(o => ({
          id: o.optionKey,
          optionKey: o.optionKey,
          text: o.text
        }))
      }));

      return successResponse(res, 'Mock test started.', {
        attemptId: attempt.id,
        mockTestId: mockTest.id,
        title: mockTest.title,
        durationMinutes: mockTest.durationMinutes,
        questions: sanitizedQuestions
      }, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Evaluates mock test submission with instant explanations
   */
  async submitMockTest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { attemptId, answers = {} } = req.body;

      const mockTest = await prisma.mockTest.findUnique({ where: { id } });
      if (!mockTest || mockTest.userId !== userId) {
        return errorResponse(res, 'Mock test not found.', 404);
      }

      const questions = mockTest.questionsData || [];
      let correctCount = 0;
      let totalMarks = 0;
      let obtainedMarks = 0;

      const itemReview = questions.map((q, idx) => {
        const qId = `mock_q_${idx + 1}`;
        const submitted = answers[qId];
        const correctKeys = (q.options || []).filter(o => o.isCorrect).map(o => o.optionKey);

        const qMarks = q.defaultMarks || 2;
        totalMarks += qMarks;

        let isCorrect = false;
        if (submitted != null) {
          if (Array.isArray(submitted)) {
            isCorrect = submitted.sort().join(',') === correctKeys.sort().join(',');
          } else {
            isCorrect = correctKeys.includes(String(submitted));
          }
        }

        if (isCorrect) {
          correctCount++;
          obtainedMarks += qMarks;
        }

        return {
          questionId: qId,
          text: q.text,
          studentAns: submitted,
          correctAnswer: correctKeys,
          isCorrect,
          marksAwarded: isCorrect ? qMarks : 0,
          explanation: q.explanation || 'Verified conceptual answer by Quentrix AI.'
        };
      });

      const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 1000) / 10 : 0;

      const resultData = {
        correctCount,
        totalQuestions: questions.length,
        obtainedMarks,
        totalMarks,
        percentage,
        itemReview
      };

      if (attemptId) {
        await prisma.mockTestAttempt.update({
          where: { id: attemptId },
          data: {
            submittedAt: new Date(),
            score: obtainedMarks,
            maxMarks: totalMarks,
            percentage,
            answersData: answers,
            resultData
          }
        });
      }

      return successResponse(res, 'Practice test submitted and evaluated.', resultData);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Retrieves a mock test by ID with fully populated questions
   */
  async getMockTestById(req, res, next) {
    try {
      const { id } = req.params;
      const mockTest = await prisma.mockTest.findUnique({
        where: { id }
      });

      if (!mockTest) {
        return errorResponse(res, 'Mock test drill not found.', 404);
      }

      const questions = mockTest.questionsData || [];
      const populatedQuestions = questions.map((q, idx) => ({
        id: `mock_q_${idx + 1}`,
        orderNumber: idx + 1,
        text: q.text || q.questionText,
        type: q.type === 'MULTIPLE_SELECT' ? 'Multiple select' : q.type === 'TRUE_FALSE' ? 'True/False' : q.type === 'PROGRAMMING' ? 'Programming' : (q.type || 'MCQ'),
        difficulty: q.difficulty || mockTest.difficulty || 'Medium',
        marks: q.defaultMarks || 2,
        negativeMarks: q.negativeMarks || 0,
        options: (q.options || []).map((o, oIdx) => ({
          id: o.optionKey || String.fromCharCode(65 + oIdx),
          optionKey: o.optionKey || String.fromCharCode(65 + oIdx),
          text: typeof o === 'string' ? o : o.text
        })),
        correctAnswer: (q.options || []).find((o) => o.isCorrect)?.optionKey || 'A',
        explanation: q.explanation || `Comprehensive solution derivation for ${mockTest.topicName}.`
      }));

      return successResponse(res, 'Mock test drill loaded successfully.', {
        ...mockTest,
        durationMinutes: mockTest.durationMinutes || 20,
        totalQuestions: populatedQuestions.length,
        totalMarks: populatedQuestions.reduce((acc, q) => acc + (q.marks || 2), 0),
        isMock: true,
        populatedQuestions
      });
    } catch (err) {
      next(err);
    }
  }
};

