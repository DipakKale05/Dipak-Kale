import { ForbiddenError, AuthenticationError } from '../utils/errors.js';

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Enforces that req.user.role is one of the allowed roles.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required', 'AUTH_REQUIRED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden: Role '${req.user.role}' is not authorized to access this resource`,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}
