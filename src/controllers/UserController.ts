import {
  Controller,
  Get,
  Route,
  Tags,
  Security,
  Request,
  Query,
  Response,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import {
  ApiResponseBuilder,
  HttpStatusCode,
  BaseFailureResponse,
} from './response/common.res';
import {
  UserProfile,
  UserDashboard,
  UserListItem,
  GetProfileApiResponse,
  GetDashboardApiResponse,
  GetUsersApiResponse,
} from './response/user.res';

/**
 * User controller
 * Handles user-related operations
 */
@Route('users')
@Tags('Users')
export class UserController extends Controller {
  /**
   * Get current user profile
   * @summary Get authenticated user's profile information
   * @returns User profile data
   */
  @Get('/profile')
  @Security('jwt')
  @Response<BaseFailureResponse>(401, 'Unauthorized')
  @Response<BaseFailureResponse>(500, 'Internal server error')
  public async getProfile(
    @Request() request: ExpressRequest
  ): Promise<GetProfileApiResponse> {
    try {
      const user = (request as any).user;

      if (!user) {
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      // Mock user profile data
      const userProfile: UserProfile = {
        id: user.id,
        username: user.email.split('@')[0],
        email: user.email,
        role: user.role,
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Software developer passionate about creating amazing applications.',
          phone: '+1234567890',
        },
        preferences: {
          language: 'zh-TW',
          timezone: 'Asia/Taipei',
          notifications: true,
        },
      };

      return ApiResponseBuilder.success(
        userProfile,
        'Profile retrieved successfully'
      );
    } catch (error) {
      return ApiResponseBuilder.internalError('Failed to retrieve profile');
    }
  }

  /**
   * Get user dashboard
   * @summary Get user dashboard with stats and recent activity
   * @returns User dashboard data
   */
  @Get('/dashboard')
  @Security('jwt')
  @Response<BaseFailureResponse>(401, 'Unauthorized')
  @Response<BaseFailureResponse>(500, 'Internal server error')
  public async getDashboard(
    @Request() request: ExpressRequest
  ): Promise<GetDashboardApiResponse> {
    try {
      const user = (request as any).user;

      if (!user) {
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      // Mock dashboard data
      const dashboard: UserDashboard = {
        user: {
          id: user.id,
          username: user.email.split('@')[0],
          email: user.email,
          role: user.role,
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
        },
        stats: {
          loginCount: 42,
          lastLoginAt: new Date().toISOString(),
          accountAge: 365,
        },
        recentActivity: [
          {
            id: '1',
            type: 'login',
            description: 'User logged in',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'profile_update',
            description: 'Profile information updated',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        notifications: [
          {
            id: '1',
            title: 'Welcome!',
            message: 'Welcome to the application!',
            type: 'info',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      return ApiResponseBuilder.success(
        dashboard,
        'Dashboard data retrieved successfully'
      );
    } catch (error) {
      return ApiResponseBuilder.internalError(
        'Failed to retrieve dashboard data'
      );
    }
  }

  /**
   * Get all users (admin only)
   * @summary Get paginated list of all users
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @returns Paginated list of users
   */
  @Get('/')
  @Security('jwt', ['admin'])
  @Response<BaseFailureResponse>(401, 'Unauthorized')
  @Response<BaseFailureResponse>(403, 'Forbidden - Admin access required')
  @Response<BaseFailureResponse>(500, 'Internal server error')
  public async getUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Request() request: ExpressRequest
  ): Promise<GetUsersApiResponse> {
    try {
      const user = (request as any).user;

      if (!user) {
        // this.setStatus(HttpStatusCode.UNAUTHORIZED);
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      if (user.role !== 'admin') {
        // this.setStatus(HttpStatusCode.FORBIDDEN);
        return ApiResponseBuilder.forbidden('Admin access required');
      }

      // Mock users data
      const mockUsers: UserListItem[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
        },
        {
          id: '2',
          username: 'user',
          email: 'user@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-02T00:00:00Z',
          lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      // Simple pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = mockUsers.slice(startIndex, endIndex);

      const paginationInfo = {
        page,
        limit,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / limit),
      };

      return ApiResponseBuilder.paginatedSuccess(
        paginatedUsers,
        paginationInfo,
        'Users retrieved successfully'
      );
    } catch (error) {
      return ApiResponseBuilder.internalError('Failed to retrieve users');
    }
  }
}
