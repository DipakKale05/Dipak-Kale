import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { tenantMiddleware } from './middlewares/tenant.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration supporting frontend ports
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = Array.isArray(env.CORS_ORIGIN) ? env.CORS_ORIGIN : [env.CORS_ORIGIN];
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Tenant-ID'],
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tenant Context Propagation
app.use(tenantMiddleware);

// Audit & Telemetry Request Logger
app.use(requestLogger);

// Rate limiter for general API routes
app.use('/api', generalLimiter);

// API v1 root router
app.use('/api/v1', apiRouter);

// Root fallback
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'medicalbydk Clinical Governance & Bioequivalent Platform',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
