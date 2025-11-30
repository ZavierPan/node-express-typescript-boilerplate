import { Controller, Get, Route, Tags, Security, Request, Response } from 'tsoa';
import { AuthenticatedRequest } from '../middleware/authentication';
import { ApiError } from '../middleware/errorHandler';

/**
 * User profile interface
 */
interface UserProfile {
  id: string;
  email: string;
  role: string;
  lastLogin?: string;
}

/**
 * Error response interface
 */
interface ErrorResponse {
  message: string;
  statusCode: number;
}

/**
 * User controller
 * Handles user-related operations that require authentication
 */
@Route('users')
@Tags('User Management')
export class UserController extends Controller {
  /**
   * Get current user profile
   * @summary Get authenticated user's profile information
   * @param request Express request object with authenticated user
   * @returns User profile information
   */
  @Get('/profile')
  @Security('jwt')
  @Response<ErrorResponse>(401, 'Unauthorized - Invalid or missing token')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async getCurrentUser(@Request() request: AuthenticatedRequest): Promise<UserProfile> {
    const user = request.user;

    // In a real application, you would fetch additional user data from the database
    // For now, we'll return the information from the JWT token
    return {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      lastLogin: new Date().toISOString(),
    };
  }

  /**
   * Get all users (admin only)
   * @summary Get list of all users (requires admin role)
   * @param request Express request object with authenticated user
   * @returns List of users
   */
  @Get('/')
  @Security('jwt', ['admin'])
  @Response<ErrorResponse>(401, 'Unauthorized - Invalid or missing token')
  @Response<ErrorResponse>(403, 'Forbidden - Admin role required')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async getAllUsers(@Request() request: AuthenticatedRequest): Promise<UserProfile[]> {
    const currentUser = request.user;

    // Check if user has admin role (additional check, though TSOA should handle this)
    if (currentUser.role !== 'admin') {
      throw new ApiError(403, 'Access denied. Admin role required.');
    }

    // TODO: Replace with actual database query
    // Mock data for demonstration
    const mockUsers: UserProfile[] = [
      {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
        lastLogin: '2023-12-01T10:00:00Z',
      },
      {
        id: '2',
        email: 'user@example.com',
        role: 'user',
        lastLogin: '2023-12-01T09:30:00Z',
      },
      {
        id: '3',
        email: 'john@example.com',
        role: 'user',
        lastLogin: '2023-11-30T15:45:00Z',
      },
    ];

    return mockUsers;
  }

  /**
   * Get user dashboard data
   * @summary Get dashboard information for authenticated user
   * @param request Express request object with authenticated user
   * @returns Dashboard data
   */
  @Get('/dashboard')
  @Security('jwt')
  @Response<ErrorResponse>(401, 'Unauthorized - Invalid or missing token')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async getDashboard(@Request() request: AuthenticatedRequest): Promise<{
    user: UserProfile;
    stats: {
      totalLogins: number;
      lastActivity: string;
      accountCreated: string;
    };
    permissions: string[];
  }> {
    const user = request.user;

    // Mock dashboard data
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
      },
      stats: {
        totalLogins: 42,
        lastActivity: new Date().toISOString(),
        accountCreated: '2023-01-15T08:00:00Z',
      },
      permissions: user.role === 'admin' 
        ? ['read', 'write', 'delete', 'admin'] 
        : ['read', 'write'],
    };
  }
}