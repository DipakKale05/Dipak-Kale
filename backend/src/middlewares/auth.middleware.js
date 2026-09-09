import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../config/database.js';
import { AuthenticationError } from '../utils/errors.js';
import { userRepository } from '../repositories/user.repository.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authentication token required', 'AUTH_REQUIRED');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AuthenticationError('Authentication session has expired', 'AUTH_REQUIRED');
      }
      throw new AuthenticationError('Invalid authentication token', 'AUTH_REQUIRED');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError('User account not found', 'AUTH_REQUIRED');
    }

    // Attach user profile to request (password hash stripped)
    const { password_hash, ...safeUser } = user;
    req.user = safeUser;

    // Propagate tenant context to database engine
    const activeTenant = decoded.tenantId || user.tenant_id;
    if (activeTenant) {
      db.setTenantContext(activeTenant, user.role);
    }

    res.on('finish', () => db.resetTenantContext());
    res.on('close', () => db.resetTenantContext());

    next();
  } catch (err) {
    next(err);
  }
}
