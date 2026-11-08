import { codeExecutionService } from '../services/codeExecutionService.js';
import { prisma } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const codingController = {
  /**
   * Run custom code against sample test cases (no grading impact)
   */
  async runCode(req, res, next) {
    try {
      const userId = req.user.id;
      const { problemId, language, sourceCode, customInput } = req.body;

      const result = await codeExecutionService.executeCode({
        userId,
        questionId: problemId,
        language,
        sourceCode,
        customInput
      });

      return successResponse(res, 'Code executed in sandboxed runtime.', result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Submit programming solution against all sample and private hidden test cases
   */
  async submitCode(req, res, next) {
    try {
      const userId = req.user.id;
      const { problemId, language, sourceCode } = req.body;

      const evaluation = await codeExecutionService.evaluateProblemSubmission({
        userId,
        questionId: problemId,
        language,
        sourceCode
      });

      return successResponse(res, 'Code evaluation completed.', evaluation);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get specific submission details
   */
  async getSubmission(req, res, next) {
    try {
      const { id } = req.params;
      const submission = await prisma.codeSubmission.findUnique({
        where: { id }
      });

      if (!submission) {
        return errorResponse(res, 'Submission not found.', 404);
      }

      return successResponse(res, 'Submission details retrieved.', submission);
    } catch (err) {
      next(err);
    }
  }
};

