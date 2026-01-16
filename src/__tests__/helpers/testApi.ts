/**
 * Test API helper functions
 * Provides utilities for API testing with authentication
 */

import request from 'supertest';
import app from '../../index';
import { generateToken } from '../../middleware/authentication';

/**
 * Get supertest request instance
 */
export function getApiClient() {
  return request(app);
}

/**
 * Generate test JWT token
 */
export function generateTestToken(payload: {
  id: string;
  email: string;
  role: 'admin' | 'user';
}): string {
  return generateToken(payload);
}

/**
 * Login and get JWT token
 */
export async function loginAndGetToken(
  email: string,
  password: string
): Promise<string> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);

  return response.body.data.token;
}

/**
 * Make authenticated GET request
 */
export async function authenticatedGet(
  url: string,
  token: string
): Promise<request.Response> {
  return request(app)
    .get(url)
    .set('Authorization', `Bearer ${token}`);
}

/**
 * Make authenticated POST request
 */
export async function authenticatedPost(
  url: string,
  token: string,
  data?: string | object
): Promise<request.Response> {
  return request(app)
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

/**
 * Make authenticated PUT request
 */
export async function authenticatedPut(
  url: string,
  token: string,
  data?: string | object
): Promise<request.Response> {
  return request(app)
    .put(url)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

/**
 * Make authenticated DELETE request
 */
export async function authenticatedDelete(
  url: string,
  token: string
): Promise<request.Response> {
  return request(app)
    .delete(url)
    .set('Authorization', `Bearer ${token}`);
}

/**
 * Assert API response structure
 */
export function assertApiResponse(
  response: request.Response,
  expectedStatus: number
): void {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success');
  expect(response.body).toHaveProperty('timestamp');
}

/**
 * Assert successful API response
 */
export function assertSuccessResponse(
  response: request.Response,
  expectedStatus = 200
): void {
  assertApiResponse(response, expectedStatus);
  expect(response.body.success).toBe(true);
  expect(response.body).toHaveProperty('data');
}

/**
 * Assert error API response
 */
export function assertErrorResponse(
  response: request.Response,
  expectedStatus: number
): void {
  assertApiResponse(response, expectedStatus);
  expect(response.body.success).toBe(false);
  expect(response.body).toHaveProperty('error');
}
