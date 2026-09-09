import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  otpSendSchema,
  otpVerifySchema,
  passkeyVerifySchema,
} from '../validators/auth.validator.js';

const router = Router();

// Apply auth rate limiter across all auth endpoints
router.use(authLimiter);

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new Patient, Pharmacist, or Trust Officer
 * @access Public
 */
router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

/**
 * @route POST /api/v1/auth/login
 * @desc Authenticate with email and password
 * @access Public
 */
router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

/**
 * @route POST /api/v1/auth/otp/send
 * @desc Send 4-digit SMS OTP to target phone
 * @access Public
 */
router.post('/otp/send', validate(otpSendSchema), (req, res, next) =>
  authController.sendOtp(req, res, next)
);

/**
 * @route POST /api/v1/auth/otp/verify
 * @desc Verify 4-digit SMS OTP and issue session JWT
 * @access Public
 */
router.post('/otp/verify', validate(otpVerifySchema), (req, res, next) =>
  authController.verifyOtp(req, res, next)
);

/**
 * @route POST /api/v1/auth/passkey/verify
 * @desc WebAuthn / FIDO2 hardware biometric passkey verification
 * @access Public
 */
router.post('/passkey/verify', validate(passkeyVerifySchema), (req, res, next) =>
  authController.verifyPasskey(req, res, next)
);

/**
 * @route GET /api/v1/auth/me
 * @desc Retrieve current authenticated session profile
 * @access Authenticated (Bearer Token)
 */
router.get('/me', requireAuth, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
