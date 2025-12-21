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
import { ApiResponseBuilder, BaseFailureResponse } from './response/common.res';
import {
  UserProfile,
  UserDashboard,
  UserListItem,
  GetProfileApiResponse,
  GetDashboardApiResponse,
  GetUsersApiResponse,
} from './response/user.res';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../middleware/authentication';

/**
 * User controller
 * Handles user-related operations
 */
@Route('users')
@Tags('Users')
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }
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
      const user = (request as AuthenticatedRequest).user;

      if (!user) {
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      // Get user from database
      const dbUser = await this.userService.findById(parseInt(user.id));
      if (!dbUser) {
        return ApiResponseBuilder.notFound('User not found');
      }

      // Build user profile data
      const userProfile: UserProfile = {
        id: dbUser.id.toString(),
        username: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        createdAt: dbUser.createdAt.toISOString(),
        lastLoginAt: dbUser.lastLoginAt?.toISOString(),
        profile: {
          firstName: dbUser.name.split(' ')[0] || dbUser.name,
          lastName: dbUser.name.split(' ').slice(1).join(' ') || '',
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
      console.error('Get profile error:', error);
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
      const user = (request as AuthenticatedRequest).user;

      if (!user) {
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      // Get user from database
      const dbUser = await this.userService.findById(parseInt(user.id));
      if (!dbUser) {
        return ApiResponseBuilder.notFound('User not found');
      }

      // Calculate account age in days
      const accountAge = Math.floor(
        (new Date().getTime() - dbUser.createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Build dashboard data
      const dashboard: UserDashboard = {
        user: {
          id: dbUser.id.toString(),
          username: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          createdAt: dbUser.createdAt.toISOString(),
          lastLoginAt: dbUser.lastLoginAt?.toISOString(),
        },
        stats: {
          loginCount: 42, // TODO: Implement login count tracking
          lastLoginAt:
            dbUser.lastLoginAt?.toISOString() || new Date().toISOString(),
          accountAge,
        },
        recentActivity: [
          {
            id: '1',
            type: 'login',
            description: 'User logged in',
            timestamp:
              dbUser.lastLoginAt?.toISOString() || new Date().toISOString(),
          },
          {
            id: '2',
            type: 'account_created',
            description: 'Account created',
            timestamp: dbUser.createdAt.toISOString(),
          },
        ],
        notifications: [
          {
            id: '1',
            title: 'Welcome!',
            message: 'Welcome to the application!',
            type: 'info',
            read: false,
            createdAt: dbUser.createdAt.toISOString(),
          },
        ],
      };

      return ApiResponseBuilder.success(
        dashboard,
        'Dashboard data retrieved successfully'
      );
    } catch (error) {
      console.error('Get dashboard error:', error);
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
    @Query() page?: number,
    @Query() limit?: number,
    @Query() role?: string,
    @Request() request?: ExpressRequest
  ): Promise<GetUsersApiResponse> {
    try {
      const user = (request as AuthenticatedRequest)?.user;

      if (!user) {
        return ApiResponseBuilder.unauthorized('User not authenticated');
      }

      if (user.role !== 'admin') {
        return ApiResponseBuilder.forbidden('Admin access required');
      }

      // Get users from database with pagination
      const result = await this.userService.findAll(page, limit);

      // Transform users to UserListItem format
      const userList: UserListItem[] = result.users.map((dbUser) => ({
        id: dbUser.id.toString(),
        username: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.isActive ? 'active' : 'inactive',
        createdAt: dbUser.createdAt.toISOString(),
        lastLoginAt: dbUser.lastLoginAt?.toISOString(),
      }));

      const paginationInfo = {
        page: result.page,
        limit: limit || 10,
        total: result.total,
        totalPages: result.totalPages,
      };

      return ApiResponseBuilder.paginatedSuccess(
        userList,
        paginationInfo,
        'Users retrieved successfully'
      );
    } catch (error) {
      console.error('Get users error:', error);
      return ApiResponseBuilder.internalError('Failed to retrieve users');
    }
  }
}
