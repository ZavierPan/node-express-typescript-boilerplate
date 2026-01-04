import { Controller, Post, Body, Route, Tags, Example, Response } from 'tsoa';
import {
  generateToken,
  generateRefreshToken,
} from '../middleware/authentication';
import Logger from '../utils/logger';
import { ApiResponseBuilder, BaseFailureResponse } from './response/common.res';
import {
  LoginRequest,
  LoginResponse,
  DemoCredentialsResponse,
} from './response/auth.res';
import { UserService } from '../services/UserService';

/**
 * Authentication controller
 * Handles user authentication and token management
 */
@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }
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

    try {
      // Find user by email (including password for authentication)
      const user = await this.userService.findByEmailWithPassword(email);
      if (!user) {
        Logger.security('Login failed - user not found', { email });
        return ApiResponseBuilder.unauthorized('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        Logger.security('Login failed - account deactivated', {
          email,
          userId: user.id,
        });
        return ApiResponseBuilder.unauthorized('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        Logger.security('Login failed - invalid password', {
          email,
          userId: user.id,
        });
        return ApiResponseBuilder.unauthorized('Invalid email or password');
      }

      // Update last login timestamp
      await this.userService.updateLastLogin(user.id);

      // Log successful login
      Logger.auth('login_success', user.id.toString(), {
        email: user.email,
        role: user.role,
      });

      // Generate tokens
      const token = generateToken({
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken(user.id.toString());

      // Return success response
      return ApiResponseBuilder.success(
        {
          user: {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
        'Login successful'
      );
    } catch (error) {
      Logger.error('Login error', { error, email });
      return ApiResponseBuilder.internalError('An error occurred during login');
    }
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
