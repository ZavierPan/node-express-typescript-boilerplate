import {
  BaseSuccessResponse,
  BaseFailureResponse,
  ApiResponse,
} from './common.res';

/**
 * Authentication related response type definitions
 */

/** Login request interface */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login success response data */
export interface LoginData {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

/** Login API response */
export type LoginResponse = ApiResponse<LoginData>;

/** Demo credentials data */
export interface DemoCredentialsData {
  credentials: Array<{
    email: string;
    password: string;
    role: string;
  }>;
}

/** Demo credentials response */
export type DemoCredentialsResponse = BaseSuccessResponse<DemoCredentialsData>;
