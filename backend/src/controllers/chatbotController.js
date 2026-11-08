import { chatbotService } from '../services/chatbotService.js';
import { successResponse } from '../utils/apiResponse.js';

export const chatbotController = {
  /**
   * Process academic chat query
   */
  async sendMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const { message, conversationId, language = 'en' } = req.body;

      const result = await chatbotService.processQuery({
        userId,
        message,
        conversationId,
        language
      });

      return successResponse(res, 'Assistant response synthesized.', result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Retrieve student conversation history
   */
  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.query;

      const history = await chatbotService.getConversationHistory(userId, conversationId);
      return successResponse(res, 'Chat history retrieved.', history);
    } catch (err) {
      next(err);
    }
  }
};

