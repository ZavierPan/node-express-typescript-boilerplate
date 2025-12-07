import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables based on NODE_ENV
 * Priority: .env.local > .env.{NODE_ENV}
 */
function loadEnvironmentVariables() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Load environment-specific file
  if (nodeEnv === 'development') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });
  } else if (nodeEnv === 'production') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
  } else if (nodeEnv === 'staging') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.staging') });
  }
  
  // Load local overrides (highest priority)
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

// Load environment variables
loadEnvironmentVariables();

/**
 * Application configuration
 * Centralized configuration management for the application
 */
export const config = {
  // Application Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // API Configuration
  api: {
    prefix: process.env.API_PREFIX || '/api',
    swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
  },
};

export default config;
