import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';

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
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
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
      console.log('✅ Database connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error during database closure:', error);
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
      console.log(
        `✅ Ran ${migrations.length} migration(s):`,
        migrations.map((m) => m.name)
      );
    } else {
      console.log('✅ No pending migrations to run');
    }
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}
