import { prisma } from '../config/database.js';
import { duplicateDetectionService } from '../services/duplicateDetectionService.js';
import { generateContentHash, normalizeText } from '../utils/textHasher.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const questionController = {
  /**
   * List questions with search, pagination, and filters
   */
  async getQuestions(req, res, next) {
    try {
      const {
        search = '',
        streamId,
        subjectId,
        difficulty,
        type,
        page = 1,
        limit = 50
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        AND: [
          search ? {
            OR: [
              { text: { contains: String(search) } },
              { explanation: { contains: String(search) } }
            ]
          } : undefined,
          streamId && streamId !== 'all' ? { streamId: String(streamId) } : undefined,
          subjectId && subjectId !== 'all' ? { subjectId: String(subjectId) } : undefined,
          difficulty && difficulty !== 'all' ? { difficulty: String(difficulty) } : undefined,
          type && type !== 'all' ? { type: String(type) } : undefined
        ].filter(Boolean)
      };

      const [questions, total] = await Promise.all([
        prisma.question.findMany({
          where,
          include: {
            options: true,
            subject: { select: { name: true } },
            stream: { select: { name: true } },
            topic: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.question.count({ where })
      ]);

      const formatted = questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        marks: q.defaultMarks,
        negativeMarks: q.negativeMarks,
        explanation: q.explanation,
        stream: q.stream?.name || 'General',
        subject: q.subject?.name || 'General',
        topic: q.topic?.name || 'General',
        isApproved: q.isApproved,
        timesUsed: q.timesUsed,
        options: q.options.map(o => ({
          id: o.id,
          optionKey: o.optionKey,
          text: o.text,
          isCorrect: o.isCorrect
        })),
        correctAnswer: q.options.filter(o => o.isCorrect).map(o => o.optionKey)
      }));

      return successResponse(res, 'Question repository retrieved.', {
        questions: formatted,
        pagination: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Add question manually
   */
  async createQuestion(req, res, next) {
    try {
      const {
        text,
        type = 'MCQ',
        difficulty = 'MEDIUM',
        defaultMarks = 2,
        negativeMarks = 0,
        explanation,
        streamId,
        subjectId,
        topicId,
        options = [],
        codeProblemDetails
      } = req.body;

      // Duplicate detection
      const dupCheck = await duplicateDetectionService.checkExactDuplicate(text);
      if (dupCheck.isDuplicate) {
        return errorResponse(res, 'Duplicate question rejected: exact matching question exists in repository.', 409);
      }

      const contentHash = generateContentHash(text);
      const normalizedText = normalizeText(text);

      const newQuestion = await prisma.question.create({
        data: {
          text,
          type,
          difficulty,
          defaultMarks: Number(defaultMarks),
          negativeMarks: Number(negativeMarks),
          explanation,
          contentHash,
          normalizedText,
          isApproved: true, // Manually entered questions are approved by default
          streamId: streamId || null,
          subjectId: subjectId || null,
          topicId: topicId || null,
          codeProblemDetails: codeProblemDetails || null,
          options: {
            create: options.map((opt, idx) => ({
              optionKey: opt.optionKey || String.fromCharCode(65 + idx),
              text: opt.text,
              isCorrect: Boolean(opt.isCorrect),
              sortOrder: idx
            }))
          }
        },
        include: { options: true }
      });

      return successResponse(res, 'Question added to question repository.', newQuestion, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update question
   */
  async updateQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const { text, difficulty, defaultMarks, negativeMarks, explanation, options, isApproved } = req.body;

      const updated = await prisma.$transaction(async (tx) => {
        let contentHash = undefined;
        let normalizedText = undefined;

        if (text) {
          contentHash = generateContentHash(text);
          normalizedText = normalizeText(text);
        }

        const q = await tx.question.update({
          where: { id },
          data: {
            text,
            difficulty,
            defaultMarks: defaultMarks ? Number(defaultMarks) : undefined,
            negativeMarks: negativeMarks != null ? Number(negativeMarks) : undefined,
            explanation,
            contentHash,
            normalizedText,
            isApproved
          }
        });

        // Update options if provided
        if (options && Array.isArray(options)) {
          await tx.questionOption.deleteMany({ where: { questionId: id } });
          await tx.questionOption.createMany({
            data: options.map((opt, idx) => ({
              questionId: id,
              optionKey: opt.optionKey || String.fromCharCode(65 + idx),
              text: opt.text,
              isCorrect: Boolean(opt.isCorrect),
              sortOrder: idx
            }))
          });
        }

        return tx.question.findUnique({
          where: { id },
          include: { options: true }
        });
      });

      return successResponse(res, 'Question updated successfully.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete question
   */
  async deleteQuestion(req, res, next) {
    try {
      const { id } = req.params;
      await prisma.question.delete({ where: { id } });
      return successResponse(res, 'Question removed from bank.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Batch import questions
   */
  async importQuestions(req, res, next) {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
        return errorResponse(res, 'Invalid payload. Provide an array of questions.', 400);
      }

      let importedCount = 0;
      let duplicateCount = 0;

      for (const item of questions) {
        const hash = generateContentHash(item.text);
        const dup = await prisma.question.findUnique({ where: { contentHash: hash } });
        if (dup) {
          duplicateCount++;
          continue;
        }

        await prisma.question.create({
          data: {
            text: item.text,
            type: item.type || 'MCQ',
            difficulty: item.difficulty || 'MEDIUM',
            defaultMarks: Number(item.defaultMarks) || 2,
            negativeMarks: Number(item.negativeMarks) || 0,
            explanation: item.explanation || 'Imported curriculum question.',
            contentHash: hash,
            normalizedText: normalizeText(item.text),
            isApproved: true,
            streamId: item.streamId || null,
            subjectId: item.subjectId || null,
            options: {
              create: (item.options || []).map((o, idx) => ({
                optionKey: o.optionKey || String.fromCharCode(65 + idx),
                text: o.text,
                isCorrect: Boolean(o.isCorrect),
                sortOrder: idx
              }))
            }
          }
        });
        importedCount++;
      }

      return successResponse(res, `Batch import complete: ${importedCount} added, ${duplicateCount} duplicates skipped.`, {
        imported: importedCount,
        duplicatesSkipped: duplicateCount
      });
    } catch (err) {
      next(err);
    }
  }
};

