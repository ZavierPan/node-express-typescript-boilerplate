/**
 * UserService Unit Tests
 * Tests for user service business logic
 */

import { UserService } from '../../../services/UserService';
import {
  initTestDatabase,
  closeTestDatabase,
  clearDatabase,
  createTestUser,
} from '../../helpers/testDatabase';

describe('UserService', () => {
  let userService: UserService;

  // Setup before each test
  beforeEach(async () => {
    await clearDatabase();
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
        role: 'user' as const,
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
    });

    it('should create user with default role "user"', async () => {
      const userData = {
        email: 'defaultrole@example.com',
        name: 'Default Role User',
        password: 'password123',
      };

      const user = await userService.createUser(userData);

      expect(user.role).toBe('user');
    });

    it('should create admin user when role is specified', async () => {
      const userData = {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'password123',
        role: 'admin' as const,
      };

      const user = await userService.createUser(userData);

      expect(user.role).toBe('admin');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const testUser = await createTestUser({
        email: 'findme@example.com',
        name: 'Find Me',
      });

      const foundUser = await userService.findByEmail('findme@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await userService.findByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });

    it('should not include password in result', async () => {
      await createTestUser({
        email: 'nopassword@example.com',
      });

      const foundUser = await userService.findByEmail('nopassword@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.password).toBeUndefined();
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should find user with password included', async () => {
      await createTestUser({
        email: 'withpassword@example.com',
        password: 'testpassword',
      });

      const foundUser = await userService.findByEmailWithPassword(
        'withpassword@example.com'
      );

      expect(foundUser).toBeDefined();
      expect(foundUser?.password).toBeDefined();
      expect(foundUser?.password).toContain('$2b$'); // Bcrypt hash prefix
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const testUser = await createTestUser({
        email: 'findbyid@example.com',
      });

      const foundUser = await userService.findById(testUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return null for non-existent ID', async () => {
      const foundUser = await userService.findById(99999);

      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Create multiple test users
      await createTestUser({ email: 'user1@example.com', name: 'User 1' });
      await createTestUser({ email: 'user2@example.com', name: 'User 2' });
      await createTestUser({ email: 'user3@example.com', name: 'User 3' });

      const result = await userService.findAll(1, 10);

      expect(result.users).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should handle pagination correctly', async () => {
      // Create 5 test users
      for (let i = 1; i <= 5; i++) {
        await createTestUser({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
      }

      // Get first page with limit 2
      const page1 = await userService.findAll(1, 2);
      expect(page1.users).toHaveLength(2);
      expect(page1.total).toBe(5);
      expect(page1.totalPages).toBe(3);

      // Get second page
      const page2 = await userService.findAll(2, 2);
      expect(page2.users).toHaveLength(2);
      expect(page2.page).toBe(2);
    });

    it('should return users ordered by creation date (newest first)', async () => {
      const user1 = await createTestUser({ email: 'first@example.com' });
      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const user2 = await createTestUser({ email: 'second@example.com' });

      const result = await userService.findAll(1, 10);

      expect(result.users[0].id).toBe(user2.id); // Newest first
      expect(result.users[1].id).toBe(user1.id);
    });
  });

  describe('updateLastLogin', () => {
    it('should update user last login timestamp', async () => {
      const testUser = await createTestUser({
        email: 'lastlogin@example.com',
      });

      expect(testUser.lastLoginAt).toBeNull();

      await userService.updateLastLogin(testUser.id);

      const updatedUser = await userService.findById(testUser.id);
      expect(updatedUser?.lastLoginAt).toBeDefined();
      expect(updatedUser?.lastLoginAt).toBeInstanceOf(Date);
    });
  });

  describe('getUserCountByRole', () => {
    it('should return correct user counts by role', async () => {
      await createTestUser({ email: 'user1@example.com', role: 'user' });
      await createTestUser({ email: 'user2@example.com', role: 'user' });
      await createTestUser({ email: 'admin1@example.com', role: 'admin' });

      const counts = await userService.getUserCountByRole();

      expect(counts.user).toBe(2);
      expect(counts.admin).toBe(1);
      expect(counts.total).toBe(3);
    });

    it('should return zero counts when no users exist', async () => {
      const counts = await userService.getUserCountByRole();

      expect(counts.user).toBe(0);
      expect(counts.admin).toBe(0);
      expect(counts.total).toBe(0);
    });
  });
});
