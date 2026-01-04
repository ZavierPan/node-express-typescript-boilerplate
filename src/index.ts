import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import config from './config/index';
import Logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { httpLoggingMiddleware } from './middleware/logging';
import {
  initializeDatabase,
  closeDatabase,
  runMigrations,
} from './config/database';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging middleware (should be early in the middleware chain)
app.use(httpLoggingMiddleware);

// Swagger documentation (configurable via environment)
if (config.api.swaggerEnabled) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerDocument = require('./swagger/swagger.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    Logger.startup('Swagger documentation available at /api-docs');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Logger.warn(
      'Swagger spec not found. Run "npm run swagger" to generate it.'
    );
  }
} else {
  Logger.startup('Swagger documentation disabled in production environment');
}

// API routes (will be available after TSOA generates routes)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { RegisterRoutes } = require('./routes/routes');

  // Create API router
  const apiRouter = express.Router();
  RegisterRoutes(apiRouter);
  app.use(config.api.prefix, apiRouter);

  Logger.startup(`TSOA routes registered at ${config.api.prefix}`);
} catch (error) {
  Logger.warn('TSOA routes not found. Run "npm run swagger" to generate them.');
  Logger.debug('TSOA routes error details', { error });
}

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World! Node.js Express TypeScript Boilerplate is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Run pending migrations
    await runMigrations();

    // Start server
    app.listen(config.port, () => {
      Logger.startup(`Server is running on port ${config.port}`);
      Logger.startup(`Environment: ${config.nodeEnv}`);
      Logger.startup(`URL: http://localhost:${config.port}`);
      if (config.nodeEnv === 'development') {
        Logger.startup(
          `API Documentation: http://localhost:${config.port}/api-docs`
        );
      }
      Logger.startup(
        `Health Check: http://localhost:${config.port}${config.api.prefix}/health`
      );
    });
  } catch (error) {
    Logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  Logger.shutdown('SIGTERM received, shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  Logger.shutdown('SIGINT received, shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

// Start the application
startServer();

export default app;
