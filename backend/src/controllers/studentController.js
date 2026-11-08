import { prisma } from '../config/database.js';
import { analyticsService } from '../services/analyticsService.js';
import { successResponse } from '../utils/apiResponse.js';

export const studentController = {
  /**
   * Student personalized overview dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.id;

      const [availableExams, upcomingExams, recentResults, analytics] = await Promise.all([
        prisma.exam.findMany({
          where: { status: 'ACTIVE' },
          include: {
            subject: { select: { name: true } },
            stream: { select: { name: true } },
            _count: { select: { examQuestions: true } }
          },
          take: 5
        }),
        prisma.exam.findMany({
          where: { status: 'SCHEDULED' },
          include: {
            subject: { select: { name: true } },
            stream: { select: { name: true } }
          },
          take: 5
        }),
        prisma.result.findMany({
          where: { userId },
          include: {
            exam: {
              select: { title: true, subject: { select: { name: true } } }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),
        analyticsService.getStudentAnalytics(userId)
      ]);

      const formattedActive = availableExams.map(e => ({
        id: e.id,
        title: e.title,
        stream: e.stream.name,
        subject: e.subject.name,
        topic: e.topicName || 'General',
        durationMinutes: e.durationMinutes,
        totalQuestions: e._count.examQuestions,
        totalMarks: e.totalMarks,
        difficulty: e.difficulty,
        status: 'active',
        startDate: e.startDate,
        endDate: e.endDate,
        maxAttempts: e.maxAttempts
      }));

      return successResponse(res, 'Student dashboard retrieved.', {
        user: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email,
          rank: 4,
          totalPoints: 2840,
          averageScore: analytics.overallScore,
          examsCompleted: recentResults.length
        },
        availableExams: formattedActive,
        upcomingExams,
        recentResults,
        analytics
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Available active examinations list
   */
  async getExams(req, res, next) {
    try {
      const { streamId, search = '' } = req.query;

      const exams = await prisma.exam.findMany({
        where: {
          status: { in: ['ACTIVE', 'SCHEDULED', 'COMPLETED'] },
          AND: [
            streamId ? { streamId: String(streamId) } : undefined,
            search ? {
              OR: [
                { title: { contains: String(search) } },
                { subject: { name: { contains: String(search) } } }
              ]
            } : undefined
          ].filter(Boolean)
        },
        include: {
          subject: { select: { name: true } },
          stream: { select: { name: true } },
          _count: { select: { examQuestions: true, attempts: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = exams.map(e => ({
        id: e.id,
        title: e.title,
        stream: e.stream.name,
        subject: e.subject.name,
        topic: e.topicName || 'Core Curriculum',
        durationMinutes: e.durationMinutes,
        totalQuestions: e._count.examQuestions,
        totalMarks: e.totalMarks,
        negativeMarking: e.negativeMarking,
        negativeMarks: e.negativeMarks,
        difficulty: e.difficulty,
        status: e.status.toLowerCase(),
        startDate: e.startDate,
        endDate: e.endDate,
        maxAttempts: e.maxAttempts,
        attemptsAllowed: e.maxAttempts,
        attemptsMade: 0
      }));

      return successResponse(res, 'Available examinations retrieved.', formatted);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Student result history
   */
  async getResults(req, res, next) {
    try {
      const userId = req.user.id;
      const results = await prisma.result.findMany({
        where: { userId },
        include: {
          exam: {
            include: { subject: true, stream: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return successResponse(res, 'Student examination results retrieved.', results);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Detailed student performance telemetry
   */
  async getPerformance(req, res, next) {
    try {
      const userId = req.user.id;
      const analytics = await analyticsService.getStudentAnalytics(userId);
      return successResponse(res, 'Cognitive performance diagnostics retrieved.', analytics);
    } catch (err) {
      next(err);
    }
  }
};

