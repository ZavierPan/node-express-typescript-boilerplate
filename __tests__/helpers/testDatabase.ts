/**
 * Test database helper functions
 * Provides utilities for database setup, cleanup, and test data creation
 */

import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/entities/User';

/**
 * Initialize test database connection
 * Note: With globalSetup, this just ensures the connection is ready
 */
export async function initTestDatabase(): Promise<DataSource> {
  // Connection is already initialized in globalSetup
  // Just return the existing connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

/**
 * Close test database connection
 * Note: With globalTeardown, individual test files should NOT close the connection
 */
export async function closeTestDatabase(): Promise<void> {
  // Do nothing - connection will be closed in globalTeardown
  // This prevents tests from closing the shared connection
}

/**
 * Clear all data from database tables
 */
export async function clearDatabase(): Promise<void> {
  const entities = AppDataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
}

/**
 * Run database migrations
 */
export async function runTestMigrations(): Promise<void> {
  await AppDataSource.runMigrations();
}

/**
 * Revert all database migrations
 */
export async function revertTestMigrations(): Promise<void> {
  await AppDataSource.undoLastMigration();
}

/**
 * Create a test user
 */
export async function createTestUser(
  userData: Partial<User> = {}
): Promise<User> {
  const userRepository = AppDataSource.getRepository(User);

  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    password: 'password123',
    role: 'user' as const,
    isActive: true,
  };

  const user = userRepository.create({
    ...defaultUser,
    ...userData,
  });

  return await userRepository.save(user);
}

/**
 * Create a test admin user
 */
export async function createTestAdmin(
  userData: Partial<User> = {}
): Promise<User> {
  return createTestUser({
    email: `admin-${Date.now()}@example.com`,
    name: 'Test Admin',
    role: 'admin',
    ...userData,
  });
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { email } });
}

/**
 * Get user count
 */
export async function getUserCount(): Promise<number> {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.count();
}
