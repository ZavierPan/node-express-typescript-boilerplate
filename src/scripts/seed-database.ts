import 'reflect-metadata';
import { initializeDatabase, closeDatabase } from '../config/database';
import { UserService } from '../services/UserService';

/**
 * Database seeding script
 * Creates initial admin and demo users for development
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database connection
    await initializeDatabase();

    const userService = new UserService();

    // Check if admin user already exists
    const existingAdmin = await userService.findByEmail('admin@example.com');
    if (existingAdmin) {
      console.log('👤 Admin user already exists, skipping creation');
    } else {
      // Create admin user
      const adminUser = await userService.createUser({
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin user created:', adminUser.email);
    }

    // Check if demo user already exists
    const existingUser = await userService.findByEmail('user@example.com');
    if (existingUser) {
      console.log('👤 Demo user already exists, skipping creation');
    } else {
      // Create demo user
      const demoUser = await userService.createUser({
        email: 'user@example.com',
        name: 'Demo User',
        password: 'password123',
        role: 'user',
      });
      console.log('👤 Demo user created:', demoUser.email);
    }

    // Get user statistics
    const stats = await userService.getUserCountByRole();
    console.log('📊 User statistics:', stats);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
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
