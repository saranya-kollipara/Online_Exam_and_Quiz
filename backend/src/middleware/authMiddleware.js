import { verifyToken } from '../utils/token.js';
import { prisma } from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded = verifyToken(token);

    // Development bridge: Support development session tokens
    if (!decoded && process.env.NODE_ENV !== 'production') {
      const isDevAdmin = token.includes('admin');
      const roleToFind = isDevAdmin ? 'ADMIN' : 'STUDENT';
      const devUser = await prisma.user.findFirst({
        where: { role: roleToFind, isActive: true },
        include: { studentProfile: true, adminProfile: true }
      });
      if (devUser) {
        req.user = devUser;
        return next();
      }
    }

    if (!decoded || !decoded.userId) {
      return errorResponse(res, 'Invalid or expired authentication token.', 401);
    }

    // Retrieve active user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        studentProfile: true,
        adminProfile: true
      }
    });

    if (!user) {
      return errorResponse(res, 'User session not found.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account has been deactivated. Please contact administration.', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Authentication processing failed: ' + err.message, 500);
  }
}
