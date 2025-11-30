import { Controller, Post, Body, Route, Tags, Example, Response } from 'tsoa';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../middleware/authentication';
import { ApiError } from '../middleware/errorHandler';

/**
 * Login request interface
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

/**
 * Error response interface
 */
interface ErrorResponse {
  message: string;
  statusCode: number;
}

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
  @Response<ErrorResponse>(401, 'Invalid credentials')
  @Response<ErrorResponse>(400, 'Validation error')
  public async login(@Body() loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    // Input validation
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
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
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user.id);

    // Return success response
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  /**
   * Get demo credentials
   * @summary Get demo user credentials for testing
   * @returns Demo credentials
   */
  @Post('/demo-credentials')
  public async getDemoCredentials(): Promise<{
    message: string;
    credentials: Array<{ email: string; password: string; role: string }>;
  }> {
    return {
      message: 'Demo credentials for testing',
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
    };
  }
}