/**
 * Application configuration
 * Centralized configuration management for the application
 */

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Database configuration (placeholder for future use)
  // database: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: parseInt(process.env.DB_PORT || '3306'),
  //   name: process.env.DB_NAME || 'app_db',
  //   user: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || '',
  // },
};

export default config;
