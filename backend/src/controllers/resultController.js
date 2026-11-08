import { prisma } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const resultController = {
  /**
   * Retrieves specific examination result record with question reviews
   */
  async getResultById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      const result = await prisma.result.findUnique({
        where: { id },
        include: {
          exam: {
            include: {
              subject: true,
              stream: true,
              examQuestions: {
                include: {
                  question: {
                    include: { options: true }
                  }
                }
              }
            }
          },
          attempt: {
            include: {
              answers: true
            }
          },
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      });

      if (!result) {
        return errorResponse(res, 'Result record not found.', 404);
      }

      // Check authorization (only candidate or admin can view)
      if (result.userId !== userId && !isAdmin) {
        return errorResponse(res, 'Access denied. You can only view your own examination results.', 403);
      }

      // Build pedagogical review
      const answersMap = {};
      for (const ans of result.attempt.answers) {
        answersMap[ans.questionId] = {
          selected: ans.selectedOptionIds || ans.codeResponse || ans.textResponse,
          isCorrect: ans.isCorrect,
          marks: ans.marksAwarded
        };
      }

      const questionReview = result.exam.examQuestions.map(eq => {
        const q = eq.question;
        const studentInfo = answersMap[q.id] || { selected: null, isCorrect: false, marks: 0 };
        const correctKeys = q.options.filter(o => o.isCorrect).map(o => o.optionKey);

        return {
          questionId: q.id,
          text: q.text,
          type: q.type,
          options: q.options.map(o => ({
            id: o.id,
            optionKey: o.optionKey,
            text: o.text,
            isCorrect: o.isCorrect
          })),
          studentAns: studentInfo.selected,
          correctAnswer: correctKeys,
          status: !studentInfo.selected ? 'unanswered' : (studentInfo.isCorrect ? 'correct' : 'incorrect'),
          marksAwarded: studentInfo.marks,
          explanation: q.explanation || 'Verified derivation by Quentrix AI Academic Engine.'
        };
      });

      return successResponse(res, 'Examination result retrieved.', {
        id: result.id,
        examId: result.examId,
        examTitle: result.exam.title,
        subject: result.exam.subject.name,
        candidateName: `${result.user.firstName} ${result.user.lastName}`,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        unansweredCount: result.unansweredCount,
        totalMarks: result.totalMarks,
        obtainedMarks: result.obtainedMarks,
        totalScore: result.obtainedMarks,
        maxMarks: result.totalMarks,
        percentage: result.percentage,
        isPassed: result.isPassed,
        timeSpentMinutes: Math.round(result.timeTakenSeconds / 60) || 1,
        timeTakenSeconds: result.timeTakenSeconds,
        topicAccuracy: result.topicAccuracy,
        aiAnalysis: result.aiAnalysis,
        submittedAt: result.createdAt,
        questionReview
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin view of all candidate scores for an exam
   */
  async getExamResults(req, res, next) {
    try {
      const { examId } = req.params;

      const results = await prisma.result.findMany({
        where: { examId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              studentProfile: { select: { rollNumber: true } }
            }
          },
          exam: { select: { title: true } }
        },
        orderBy: { obtainedMarks: 'desc' }
      });

      const formatted = results.map(r => ({
        id: r.id,
        student: `${r.user.firstName} ${r.user.lastName}`,
        email: r.user.email,
        rollNo: r.user.studentProfile?.rollNumber || 'N/A',
        exam: r.exam.title,
        score: r.obtainedMarks,
        max: r.totalMarks,
        percentage: r.percentage,
        time: `${Math.round(r.timeTakenSeconds / 60)}m`,
        status: r.isPassed ? 'Passed' : 'Review',
        date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));

      return successResponse(res, 'Exam submissions roster retrieved.', formatted);
    } catch (err) {
      next(err);
    }
  }
};

