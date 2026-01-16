/**
 * Jest setup file
 * Runs before each test file
 */

import { AppDataSource } from '../src/config/database';
import logger from '../src/config/logger';

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Initialize database connection once for all test files
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Close database connection and logger after all tests
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  logger.close();
});

// Mock console methods to reduce noise in test output (optional)
// Uncomment if you want to suppress console logs during tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
