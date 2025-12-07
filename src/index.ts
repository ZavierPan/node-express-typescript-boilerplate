import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import config from './config/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation (configurable via environment)
if (config.api.swaggerEnabled) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerDocument = require('./swagger/swagger.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('📚 Swagger documentation available at /api-docs');
  } catch (error) {
    console.log(
      '📚 Swagger spec not found. Run "npm run swagger" to generate it.'
    );
  }
} else {
  console.log('📚 Swagger documentation disabled in production environment');
}

// API routes (will be available after TSOA generates routes)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { RegisterRoutes } = require('./routes/routes');

  // Create API router
  const apiRouter = express.Router();
  RegisterRoutes(apiRouter);
  app.use(config.api.prefix, apiRouter);

  console.log(`🛣️  TSOA routes registered at ${config.api.prefix}`);
} catch (error) {
  console.log(
    '🛣️  TSOA routes not found. Run "npm run swagger" to generate them.'
  );
  console.log(error);
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

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 URL: http://localhost:${config.port}`);
  if (config.nodeEnv === 'development') {
    console.log(
      `📚 API Documentation: http://localhost:${config.port}/api-docs`
    );
  }
  console.log(`❤️  Health Check: http://localhost:${config.port}${config.api.prefix}/health`);
});

export default app;
