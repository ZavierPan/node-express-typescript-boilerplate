import { Controller, Post, Body, Route, Tags, Example, Response } from 'tsoa';
import bcrypt from 'bcryptjs';
import {
  generateToken,
  generateRefreshToken,
} from '../middleware/authentication';
import {
  ApiResponseBuilder,
  HttpStatusCode,
  BaseFailureResponse,
} from './response/common.res';
import {
  LoginRequest,
  LoginData,
  LoginResponse,
  DemoCredentialsData,
  DemoCredentialsResponse,
} from './response/auth.res';

/**
 * Authentication controller
 * Handles user authentication and token management
 */
@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  /**
   * User login endpoint
   * @summary Authenticate user and return JWT token
   * @param loginData User login credentials
   * @returns Authentication response with JWT token
   */
  @Post('/login')
  @Example<LoginRequest>({
    email: 'user@example.com',
    password: 'password123',
  })
  @Example<LoginRequest>({
    email: 'admin@example.com',
    password: 'admin123',
  })
  @Response<BaseFailureResponse>(401, 'Invalid credentials')
  @Response<BaseFailureResponse>(400, 'Validation error')
  public async login(@Body() loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    // Input validation
    if (!email || !password) {
      return ApiResponseBuilder.badRequest('Email and password are required');
    }

    // TODO: Replace with actual database lookup
    // For now, we'll use mock data for demonstration
    const mockUsers = [
      {
        id: '1',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10), // hashed password
        role: 'admin',
      },
      {
        id: '2',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10), // hashed password
        role: 'user',
      },
    ];

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return ApiResponseBuilder.unauthorized('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponseBuilder.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user.id);

    // Return success response
    return ApiResponseBuilder.success(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      },
      'Login successful'
    );
  }

  /**
   * Get demo credentials
   * @summary Get demo user credentials for testing
   * @returns Demo credentials
   */
  @Post('/demo-credentials')
  public async getDemoCredentials(): Promise<DemoCredentialsResponse> {
    return ApiResponseBuilder.success(
      {
        credentials: [
          {
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
          },
          {
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
          },
        ],
      },
      'Demo credentials for testing'
    );
  }
}
