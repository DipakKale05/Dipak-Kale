import { AppError } from '../utils/errors.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Handle syntax error for malformed JSON request bodies
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body',
      code: 'BAD_REQUEST',
      errors: [],
      timestamp: new Date().toISOString(),
    });
  }

  // Handle AppError and its subclasses
  if (err instanceof AppError) {
    logger.warn(`Handled application error: [${err.code}] ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
      path: req.originalUrl,
      method: req.method,
      errors: err.errors,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors || [],
      timestamp: new Date().toISOString(),
    });
  }

  // Handle ZodError if thrown directly
  if (err.name === 'ZodError' && Array.isArray(err.errors)) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }

  // Unhandled server errors (500)
  logger.error(`Unhandled server error: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const isProduction = env.NODE_ENV === 'production';

  return res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
    errors: isProduction ? [] : [{ message: err.message, stack: err.stack }],
    timestamp: new Date().toISOString(),
  });
}
