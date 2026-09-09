import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import app from '../src/app.js';
import { db } from '../src/config/database.js';
import { requireAuth } from '../src/middlewares/auth.middleware.js';
import { requireRole } from '../src/middlewares/rbac.middleware.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { ROLES } from '../src/constants/roles.js';

describe('Phase 4: Authentication & Role Governance (/api/v1/auth)', () => {
  beforeEach(async () => {
    await db.reset();
  });

  describe('1. User Registration (POST /api/v1/auth/register)', () => {
    it('should register a new patient and return 201 with JWT and sanitized user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Connor',
          email: 'john.connor@example.com',
          password: 'SecurePassword!123',
          phone: '+1 (555) 992-1049',
          role: 'PATIENT',
          hipaaConsented: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('john.connor@example.com');
      expect(res.body.data.user.role).toBe('PATIENT');
      expect(res.body.data.user.tenantId).toBe('tenant_central_04');
      expect(res.body.data.user.password_hash).toBeUndefined();
    });

    it('should reject duplicate email with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Sarah Connor Duplicate',
          email: 'sarah.connor@example.com', // already seeded
          password: 'SecurePassword!123',
          hipaaConsented: true,
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('CONFLICT');
      expect(res.body.message).toContain('already exists');
    });

    it('should reject pharmacist registration if licenseNumber or pharmacyName is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Pharmacist Incomplete',
          email: 'pharm.incomplete@example.com',
          password: 'SecurePassword!123',
          role: 'PHARMACIST',
          hipaaConsented: true,
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'pharmacyName' }),
          expect.objectContaining({ field: 'licenseNumber' }),
        ])
      );
    });

    it('should register a pharmacist with WellSpring Meds and map to tenant_east_04', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Dr. James Wilson, PharmD',
          email: 'james.wilson@wellspringmeds.com',
          password: 'SecurePassword!123',
          role: 'PHARMACIST',
          pharmacyName: 'WellSpring Meds North',
          licenseNumber: 'RPH-99120-IL',
          hipaaConsented: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.tenantId).toBe('tenant_east_04');
      expect(res.body.data.user.licenseNumber).toBe('RPH-99120-IL');
    });
  });

  describe('2. User Login (POST /api/v1/auth/login)', () => {
    it('should authenticate valid user and return 200 with JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'sarah.connor@example.com',
          password: 'SecurePassword!123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.id).toBe('USR-PAT-7741');
      expect(res.body.data.user.name).toBe('Sarah Connor');
    });

    it('should reject incorrect password with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'sarah.connor@example.com',
          password: 'WrongPassword!123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject non-existent email with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nobody.exists@example.com',
          password: 'SecurePassword!123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('3. Multi-Factor Phone OTP Flow', () => {
    it('POST /api/v1/auth/otp/send should transmit SMS verification token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/otp/send')
        .send({ phone: '+1 (555) 018-9921' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Verification token transmitted via SMS');
    });

    it('POST /api/v1/auth/otp/verify should reject invalid OTP with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/otp/verify')
        .send({ phone: '+1 (555) 018-9921', code: '0000' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('POST /api/v1/auth/otp/verify should authenticate with valid 4892 code and issue JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/otp/verify')
        .send({ phone: '+1 (555) 018-9921', code: '4892' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('sarah.connor@example.com');
    });
  });

  describe('4. WebAuthn / FIDO2 Passkey Verification', () => {
    it('should verify Trust Officer hardware passkey and issue token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/passkey/verify')
        .send({
          role: 'TRUST_OFFICER',
          tenantSchema: 'public_core',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.name).toBe('Elena Vance');
      expect(res.body.data.user.role).toBe('TRUST_OFFICER');
      expect(res.body.data.user.fido2Verified).toBe(true);
    });

    it('should verify Pharmacist PIC passkey for WellSpring Meds (tenant_east_04)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/passkey/verify')
        .send({
          role: 'PHARMACIST',
          tenantSchema: 'tenant_east_04',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toContain('Kimberly Young');
      expect(res.body.data.user.tenantId).toBe('tenant_east_04');
    });
  });

  describe('5. Authenticated Session Profile & RBAC (GET /api/v1/auth/me)', () => {
    it('GET /api/v1/auth/me should reject request missing Bearer token with 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('AUTH_REQUIRED');
    });

    it('GET /api/v1/auth/me should return current user profile when authenticated', async () => {
      // Login first
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'sarah.connor@example.com',
          password: 'SecurePassword!123',
        });

      const token = loginRes.body.data.token;

      const meRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.user.id).toBe('USR-PAT-7741');
      expect(meRes.body.data.user.email).toBe('sarah.connor@example.com');
      expect(meRes.body.data.user.role).toBe('PATIENT');
    });

    it('RBAC middleware should enforce role restrictions', async () => {
      // Create an isolated test route protected by requireRole(TRUST_OFFICER)
      const testRbacApp = express();
      testRbacApp.use(express.json());
      testRbacApp.get(
        '/api/v1/test-trustops-only',
        requireAuth,
        requireRole(ROLES.TRUST_OFFICER),
        (req, res) => {
          res.status(200).json({ success: true, message: 'Welcome Trust Officer' });
        }
      );
      testRbacApp.use(errorHandler);

      // 1. Patient attempts access -> 403 FORBIDDEN
      const patientLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'sarah.connor@example.com',
          password: 'SecurePassword!123',
        });
      const patientToken = patientLogin.body.data.token;

      const forbiddenRes = await request(testRbacApp)
        .get('/api/v1/test-trustops-only')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(forbiddenRes.status).toBe(403);
      expect(forbiddenRes.body.success).toBe(false);
      expect(forbiddenRes.body.code).toBe('FORBIDDEN');

      // 2. Trust Officer attempts access -> 200 OK
      const trustLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'elena.vance@trustops.internal',
          password: 'SecurePassword!123',
        });
      const trustToken = trustLogin.body.data.token;

      const allowedRes = await request(testRbacApp)
        .get('/api/v1/test-trustops-only')
        .set('Authorization', `Bearer ${trustToken}`);

      expect(allowedRes.status).toBe(200);
      expect(allowedRes.body.success).toBe(true);
      expect(allowedRes.body.message).toBe('Welcome Trust Officer');
    });
  });
});
