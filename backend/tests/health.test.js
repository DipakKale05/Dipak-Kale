import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import app from '../src/app.js';
import { z } from 'zod';
import { validate } from '../src/middlewares/validate.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { BusinessRuleError } from '../src/utils/errors.js';

describe('Phase 2 Infrastructure & Health Checks', () => {
  it('GET /api/v1/health should return 200 and healthy status metadata', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.service).toBe('genricmed-backend');
    expect(res.body.data.version).toBe('1.0.0');
    expect(res.body.data.database).toBeDefined();
    expect(res.body.data.database.driver).toBe('sqlite_in_memory_tenant_engine');
    expect(res.body.data.database.connected).toBe(true);
    expect(res.body.data.memory).toBeDefined();
    expect(res.body.data.uptime).toBeTypeOf('number');
  });

  it('GET /api/v1/health/ready should return 200 and readiness status', async () => {
    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ready');
    expect(res.body.data.database).toBe('connected');
    expect(res.body.data.rls_engine).toBe('initialized');
  });

  it('GET /api/v1/unknown-endpoint should return 404 with standardized error JSON', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('NOT_FOUND');
    expect(res.body.message).toContain('Route not found');
    expect(res.body.errors).toEqual([]);
    expect(res.body.timestamp).toBeDefined();
  });

  it('Zod validation middleware should format validation errors into uniform 422 response', async () => {
    const testApp = express();
    testApp.use(express.json());

    const testSchema = z.object({
      email: z.string().email('Invalid email address'),
      count: z.number().min(1, 'Count must be at least 1'),
    });

    testApp.post('/test-validation', validate(testSchema), (req, res) => {
      res.status(200).json({ success: true, data: req.body });
    });
    testApp.use(errorHandler);

    const invalidRes = await request(testApp)
      .post('/test-validation')
      .send({ email: 'not-an-email', count: 0 });

    expect(invalidRes.status).toBe(422);
    expect(invalidRes.body.success).toBe(false);
    expect(invalidRes.body.code).toBe('VALIDATION_ERROR');
    expect(invalidRes.body.errors).toHaveLength(2);
    expect(invalidRes.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'Invalid email address' }),
        expect.objectContaining({ field: 'count', message: 'Count must be at least 1' }),
      ])
    );

    const validRes = await request(testApp)
      .post('/test-validation')
      .send({ email: 'user@example.com', count: 5 });

    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);
    expect(validRes.body.data.count).toBe(5);
  });

  it('Custom AppError should be caught and formatted with correct code and HTTP status', async () => {
    const testApp = express();

    testApp.get('/test-error', (req, res, next) => {
      next(new BusinessRuleError('APAP daily threshold breached', 'APAP_CEILING_EXCEEDED'));
    });
    testApp.use(errorHandler);

    const res = await request(testApp).get('/test-error');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('APAP_CEILING_EXCEEDED');
    expect(res.body.message).toBe('APAP daily threshold breached');
    expect(res.body.timestamp).toBeDefined();
  });
});
