import 'reflect-metadata';
import { initializeDatabase, closeDatabase } from '../config/database';
import { UserService } from '../services/UserService';
import Logger from '../utils/logger';

/**
 * Database seeding script
 * Creates initial admin and demo users for development
 */
async function seedDatabase() {
  try {
    Logger.info('🌱 Starting database seeding...');

    // Initialize database connection
    await initializeDatabase();

    const userService = new UserService();

    // Check if admin user already exists
    const existingAdmin = await userService.findByEmail('admin@example.com');
    if (existingAdmin) {
      Logger.info('👤 Admin user already exists, skipping creation');
    } else {
      // Create admin user
      const adminUser = await userService.createUser({
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'admin',
      });
      Logger.info('👤 Admin user created', { email: adminUser.email });
    }

    // Check if demo user already exists
    const existingUser = await userService.findByEmail('user@example.com');
    if (existingUser) {
      Logger.info('👤 Demo user already exists, skipping creation');
    } else {
      // Create demo user
      const demoUser = await userService.createUser({
        email: 'user@example.com',
        name: 'Demo User',
        password: 'password123',
        role: 'user',
      });
      Logger.info('👤 Demo user created', { email: demoUser.email });
    }

    // Get user statistics
    const stats = await userService.getUserCountByRole();
    Logger.info('📊 User statistics', { stats });

    Logger.info('✅ Database seeding completed successfully!');
  } catch (error) {
    Logger.error('❌ Database seeding failed', { error });
    process.exit(1);
  } finally {
    // Close database connection
    await closeDatabase();
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
