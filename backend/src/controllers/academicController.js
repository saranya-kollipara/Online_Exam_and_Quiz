import { prisma } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const academicController = {
  async getStreams(req, res, next) {
    try {
      const streams = await prisma.stream.findMany({
        include: {
          _count: { select: { subjects: true, questions: true } }
        },
        orderBy: { name: 'asc' }
      });
      return successResponse(res, 'Academic streams retrieved.', streams);
    } catch (err) {
      next(err);
    }
  },

  async createStream(req, res, next) {
    try {
      const { name, code, description } = req.body;
      const stream = await prisma.stream.create({
        data: { name, code: code.toUpperCase(), description }
      });
      return successResponse(res, 'Stream created successfully.', stream, 201);
    } catch (err) {
      next(err);
    }
  },

  async getSubjects(req, res, next) {
    try {
      const { streamId } = req.query;
      const subjects = await prisma.subject.findMany({
        where: streamId ? { streamId: String(streamId) } : undefined,
        include: {
          stream: { select: { name: true, code: true } },
          units: { include: { topics: true } }
        },
        orderBy: { name: 'asc' }
      });
      return successResponse(res, 'Subjects retrieved.', subjects);
    } catch (err) {
      next(err);
    }
  },

  async createSubject(req, res, next) {
    try {
      const { name, code, streamId, description } = req.body;
      const subject = await prisma.subject.create({
        data: { name, code: code.toUpperCase(), streamId, description }
      });
      return successResponse(res, 'Subject created.', subject, 201);
    } catch (err) {
      next(err);
    }
  },

  async getTopics(req, res, next) {
    try {
      const { unitId, subjectId } = req.query;
      const topics = await prisma.topic.findMany({
        where: {
          AND: [
            unitId ? { unitId: String(unitId) } : undefined,
            subjectId ? { unit: { subjectId: String(subjectId) } } : undefined
          ].filter(Boolean)
        },
        include: {
          unit: {
            include: { subject: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      return successResponse(res, 'Topics retrieved.', topics);
    } catch (err) {
      next(err);
    }
  }
};

