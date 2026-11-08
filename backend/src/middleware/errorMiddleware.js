import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.url} - Error:`, err);

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? `Duplicate value for field: ${err.meta.target}` : 'A unique constraint was violated.';
    return errorResponse(res, target, 409);
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return errorResponse(res, 'Requested database record not found.', 404);
  }

  // Prisma foreign key constraint failure (P2003)
  if (err.code === 'P2003') {
    return errorResponse(res, 'Referenced relational entity does not exist.', 400);
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    return errorResponse(res, 'Request validation failed.', 400, err.errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Invalid or expired authentication credentials.', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';
  return errorResponse(res, message, statusCode);
}

export function notFoundHandler(req, res) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

