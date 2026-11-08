import { prisma } from '../config/database.js';
import { normalizeText, generateContentHash, calculateTextSimilarity } from '../utils/textHasher.js';
import { logger } from '../utils/logger.js';

export const duplicateDetectionService = {
  /**
   * Checks if a question is an exact duplicate based on SHA-256 hash
   */
  async checkExactDuplicate(text) {
    const contentHash = generateContentHash(text);
    const existing = await prisma.question.findUnique({
      where: { contentHash }
    });
    return {
      isDuplicate: !!existing,
      contentHash,
      existingQuestion: existing
    };
  },

  /**
   * Checks similarity against existing questions in the same subject or topic.
   * Returns similarity score and existing match if similarity > threshold.
   */
  async checkSimilarityDuplicate(text, subjectId, topicId, threshold = 0.85) {
    const normalizedInput = normalizeText(text);

    // Fetch existing questions in the same topic or subject to compare
    const existingQuestions = await prisma.question.findMany({
      where: {
        OR: [
          topicId ? { topicId } : undefined,
          subjectId ? { subjectId } : undefined
        ].filter(Boolean)
      },
      select: {
        id: true,
        text: true,
        normalizedText: true,
        difficulty: true,
        type: true
      },
      take: 200
    });

    let highestSimilarity = 0.0;
    let mostSimilarQuestion = null;

    for (const q of existingQuestions) {
      const sim = calculateTextSimilarity(normalizedInput, q.normalizedText || q.text);
      if (sim > highestSimilarity) {
        highestSimilarity = sim;
        mostSimilarQuestion = q;
      }
      if (sim >= threshold) {
        return {
          isDuplicate: true,
          similarity: sim,
          existingQuestion: q
        };
      }
    }

    return {
      isDuplicate: highestSimilarity >= threshold,
      similarity: highestSimilarity,
      existingQuestion: highestSimilarity >= threshold ? mostSimilarQuestion : null
    };
  },

  /**
   * Checks if candidate has already been exposed to the question recently
   */
  async hasStudentSeenQuestion(userId, questionId, daysThreshold = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const exposure = await prisma.questionExposureHistory.findFirst({
      where: {
        userId,
        questionId,
        exposedAt: { gte: cutoffDate }
      }
    });

    return !!exposure;
  },

  /**
   * Logs question exposure for a student
   */
  async recordQuestionExposure(userId, questionIds, examId = null, mockTestId = null) {
    try {
      const records = questionIds.map(qId => ({
        userId,
        questionId: qId,
        examId,
        mockTestId,
        exposedAt: new Date()
      }));

      // Use createMany with skipDuplicates
      await prisma.questionExposureHistory.createMany({
        data: records,
        skipDuplicates: true
      });
    } catch (err) {
      logger.warn('Failed to record question exposure history:', err.message);
    }
  }
};

