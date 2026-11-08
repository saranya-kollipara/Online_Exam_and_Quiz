import { analyticsService } from '../services/analyticsService.js';
import { prisma } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const analyticsController = {
  /**
   * Platform-wide analytics
   */
  async getAdminAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getAdminPlatformAnalytics();
      return successResponse(res, 'Admin platform analytics retrieved.', data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Student cognitive performance telemetry
   */
  async getStudentAnalytics(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await analyticsService.getStudentAnalytics(userId);
      return successResponse(res, 'Student performance analytics retrieved.', data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * AI Analysis interpretation of a specific result
   */
  async getResultAnalysis(req, res, next) {
    try {
      const { resultId } = req.params;
      const result = await prisma.result.findUnique({
        where: { id: resultId }
      });

      if (!result) {
        return errorResponse(res, 'Result not found.', 404);
      }

      return successResponse(res, 'AI diagnostic analysis retrieved.', {
        resultId: result.id,
        percentage: result.percentage,
        topicAccuracy: result.topicAccuracy,
        aiAnalysis: result.aiAnalysis
      });
    } catch (err) {
      next(err);
    }
  }
};

