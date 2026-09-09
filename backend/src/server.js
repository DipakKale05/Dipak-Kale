import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { db } from './config/database.js';

await db.init();

const server = app.listen(env.PORT, () => {
  logger.info(`GenricMed Backend Server successfully started`, {
    port: env.PORT,
    environment: env.NODE_ENV,
    databaseDriver: db.driverName,
    healthEndpoint: `http://localhost:${env.PORT}/api/v1/health`,
  });
});

// Process crash safety
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception thrown: ${err.message}`, {
    stack: err.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`, {
    reason,
  });
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10s timeout
  setTimeout(() => {
    logger.error('Forcefully terminating process after 10s shutdown timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
