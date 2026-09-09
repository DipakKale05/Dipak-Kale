import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const createRateLimiter = (options) => {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    // Skip throttling in test environment to avoid flaky integration tests
    skip: () => env.NODE_ENV === 'test',
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        code: 'RATE_LIMITED',
        errors: [],
        timestamp: new Date().toISOString(),
      });
    },
    ...options,
  });
};

// General rate limiter: 100 requests per 15 minutes per IP
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'General API rate limit exceeded.',
});

// Stricter rate limiter for sensitive authentication & OTP endpoints: 20 requests per 15 minutes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Authentication rate limit exceeded.',
});
