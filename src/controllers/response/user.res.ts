import {
  BaseSuccessResponse,
  PaginatedResponse,
  ApiResponse,
} from './common.res';

/**
 * User related response type definitions
 */

/** User basic information */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

/** User profile */
export interface UserProfile extends UserInfo {
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: boolean;
  };
}

/** User dashboard data */
export interface UserDashboard {
  user: UserInfo;
  stats: {
    loginCount: number;
    lastLoginAt: string;
    accountAge: number; /** Account age in days */
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    createdAt: string;
  }>;
}

/** User list item */
export interface UserListItem {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

/** API response types (including success and failure) */
export type GetProfileApiResponse = ApiResponse<UserProfile>;
export type GetDashboardApiResponse = ApiResponse<UserDashboard>;
export type GetUsersApiResponse = ApiResponse<PaginatedResponse<UserListItem>>;
