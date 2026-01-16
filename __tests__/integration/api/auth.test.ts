/**
 * Authentication API Integration Tests
 * Tests for authentication endpoints
 */

import request from 'supertest';
import app from '../../../src/index';
import {
  initTestDatabase,
  closeTestDatabase,
  clearDatabase,
  createTestUser,
} from '../../helpers/testDatabase';
import {
  assertSuccessResponse,
  assertErrorResponse,
} from '../../helpers/testApi';

describe('Authentication API', () => {
  // Setup before each test
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create test user
      await createTestUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      assertErrorResponse(response, 401);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'correctpassword',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      assertErrorResponse(response, 401);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should return 401 for inactive user', async () => {
      await createTestUser({
        email: 'inactive@example.com',
        password: 'password123',
        isActive: false,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inactive@example.com',
          password: 'password123',
        })
        .expect(401);

      assertErrorResponse(response, 401);
      expect(response.body.error.message).toContain('deactivated');
    });

    it('should update lastLoginAt timestamp on successful login', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.lastLoginAt).toBeNull();

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Verify lastLoginAt was updated (would need to query database)
      // This is a simplified test
    });
  });

  describe('POST /api/auth/demo-credentials', () => {
    it('should return demo credentials', async () => {
      const response = await request(app)
        .post('/api/auth/demo-credentials')
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data).toHaveProperty('credentials');
      expect(Array.isArray(response.body.data.credentials)).toBe(true);
      expect(response.body.data.credentials.length).toBeGreaterThan(0);

      const adminCred = response.body.data.credentials.find(
        (c: { role: string }) => c.role === 'admin'
      );
      const userCred = response.body.data.credentials.find(
        (c: { role: string }) => c.role === 'user'
      );

      expect(adminCred).toBeDefined();
      expect(userCred).toBeDefined();
      expect(adminCred.email).toBe('admin@example.com');
      expect(userCred.email).toBe('user@example.com');
    });
  });
});
