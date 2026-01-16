/**
 * User Flow E2E Tests
 * Tests complete user workflows from login to accessing protected resources
 */

import request from 'supertest';
import app from '../../src/index';
import {
  initTestDatabase,
  closeTestDatabase,
  clearDatabase,
  createTestUser,
  createTestAdmin,
} from '../helpers/testDatabase';
import { assertSuccessResponse, assertErrorResponse } from '../helpers/testApi';

describe('User Flow E2E Tests', () => {
  // Setup before each test
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Complete User Authentication Flow', () => {
    it('should complete full user journey: login -> get profile -> get dashboard', async () => {
      // Step 1: Create test user
      await createTestUser({
        email: 'journey@example.com',
        password: 'password123',
        name: 'Journey User',
      });

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'journey@example.com',
          password: 'password123',
        })
        .expect(200);

      assertSuccessResponse(loginResponse);
      const token = loginResponse.body.data.token;
      expect(token).toBeDefined();

      // Step 3: Get user profile with token
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      assertSuccessResponse(profileResponse);
      expect(profileResponse.body.data.email).toBe('journey@example.com');
      expect(profileResponse.body.data.username).toBe('Journey User');

      // Step 4: Get user dashboard
      const dashboardResponse = await request(app)
        .get('/api/users/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      assertSuccessResponse(dashboardResponse);
      expect(dashboardResponse.body.data).toHaveProperty('user');
      expect(dashboardResponse.body.data).toHaveProperty('stats');
      expect(dashboardResponse.body.data).toHaveProperty('recentActivity');
    });

    it('should reject access to protected routes without token', async () => {
      // Try to access profile without token
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .expect(401);

      assertErrorResponse(profileResponse, 401);
    });

    it('should reject access with invalid token', async () => {
      const invalidToken = 'invalid.jwt.token';

      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      assertErrorResponse(profileResponse, 401);
    });
  });

  describe('Admin Access Control Flow', () => {
    it('should allow admin to access admin-only endpoints', async () => {
      // Create admin user
      await createTestAdmin({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
      });

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(200);

      const adminToken = loginResponse.body.data.token;

      // Access admin-only endpoint (get all users)
      const usersResponse = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assertSuccessResponse(usersResponse);
      expect(Array.isArray(usersResponse.body.data.items)).toBe(true);
    });

    it('should deny regular user access to admin-only endpoints', async () => {
      // Create regular user
      await createTestUser({
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User',
      });

      // Login as regular user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        })
        .expect(200);

      const userToken = loginResponse.body.data.token;

      // Try to access admin-only endpoint
      const usersResponse = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      assertErrorResponse(usersResponse, 403);
    });
  });

  describe('Multiple Users Pagination Flow', () => {
    it('should handle pagination correctly with multiple users', async () => {
      // Create admin user
      const admin = await createTestAdmin({
        email: 'admin@example.com',
        password: 'admin123',
      });

      // Create multiple regular users
      for (let i = 1; i <= 5; i++) {
        await createTestUser({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
      }

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(200);

      const adminToken = loginResponse.body.data.token;

      // Get first page (limit 3)
      const page1Response = await request(app)
        .get('/api/users/?page=1&limit=3')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assertSuccessResponse(page1Response);
      expect(page1Response.body.data.items).toHaveLength(3);
      expect(page1Response.body.data.pagination.total).toBe(6); // 5 users + 1 admin
      expect(page1Response.body.data.pagination.totalPages).toBe(2);

      // Get second page
      const page2Response = await request(app)
        .get('/api/users/?page=2&limit=3')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assertSuccessResponse(page2Response);
      expect(page2Response.body.data.items).toHaveLength(3);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle login failures gracefully', async () => {
      // Try to login with non-existent user
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      assertErrorResponse(response1, 401);

      // Create user and try wrong password
      await createTestUser({
        email: 'test@example.com',
        password: 'correctpassword',
      });

      const response2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      assertErrorResponse(response2, 401);
    });

    it('should handle missing required fields', async () => {
      // Missing password
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      assertErrorResponse(response1, 400);

      // Missing email
      const response2 = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      assertErrorResponse(response2, 400);
    });
  });
});
