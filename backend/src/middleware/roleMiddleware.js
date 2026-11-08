import { errorResponse } from '../utils/apiResponse.js';

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Requires one of [${allowedRoles.join(', ')}] privileges.`,
        403
      );
    }

    next();
  };
}

export const requireAdmin = authorizeRoles('ADMIN');
export const requireStudent = authorizeRoles('STUDENT');

