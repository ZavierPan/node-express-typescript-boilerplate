import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';
import Logger from '../utils/logger';

/**
 * TypeORM DataSource configuration
 * This configuration is used for both application runtime and CLI operations
 */
export const AppDataSource = new DataSource({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [
    // Entity files will be loaded from these patterns
    __dirname + '/../entities/*.{js,ts}',
  ],
  migrations: [
    // Migration files will be loaded from these patterns
    __dirname + '/../migrations/*.{js,ts}',
  ],
  subscribers: [
    // Subscriber files will be loaded from these patterns
    __dirname + '/../subscribers/*.{js,ts}',
  ],
  // CLI specific configuration
  migrationsTableName: 'migrations',
  migrationsRun: false, // Don't auto-run migrations
});

/**
 * Initialize database connection
 * This function should be called during application startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      Logger.database('connection', 'established', { status: 'success' });
    }
  } catch (error) {
    Logger.error('Error during database initialization', { error });
    throw error;
  }
}

/**
 * Close database connection
 * This function should be called during application shutdown
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      Logger.database('connection', 'closed', { status: 'success' });
    }
  } catch (error) {
    Logger.error('Error during database closure', { error });
    throw error;
  }
}

/**
 * Run pending migrations
 * This function should be called before starting the application
 */
export async function runMigrations(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const migrations = await AppDataSource.runMigrations();
    if (migrations.length > 0) {
      Logger.database('migrations', 'completed', {
        count: migrations.length,
        migrationNames: migrations.map((m) => m.name),
      });
    } else {
      Logger.database('migrations', 'none_pending', {});
    }
  } catch (error) {
    Logger.error('Error running migrations', { error });
    throw error;
  }
}
