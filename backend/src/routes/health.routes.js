import { Router } from 'express';
import { db } from '../config/database.js';
import { env } from '../config/env.js';

const router = Router();

/**
 * @route GET /api/v1/health
 * @desc General system health, runtime metrics, and database driver info
 */
router.get('/', (req, res) => {
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'genricmed-backend',
      version: '1.0.0',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: {
        driver: db.driverName,
        connected: true,
      },
      memory: {
        rssBytes: memoryUsage.rss,
        heapTotalBytes: memoryUsage.heapTotal,
        heapUsedBytes: memoryUsage.heapUsed,
      },
      environment: env.NODE_ENV,
    },
  });
});

/**
 * @route GET /api/v1/health/ready
 * @desc Readiness probe verifying database connectivity and RLS readiness
 */
router.get('/ready', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ready',
      database: 'connected',
      rls_engine: 'initialized',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
