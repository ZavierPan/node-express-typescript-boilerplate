/**
 * Common API Response type definitions
 */

/** HTTP Status Code enum */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/** Base success response interface */
export interface BaseSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/** Base failure response interface */
export interface BaseFailureResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/** Unified API response type */
export type ApiResponse<T = any> = BaseSuccessResponse<T> | BaseFailureResponse;

/** Pagination info interface */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Paginated response interface */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * API Response Builder
 */
export class ApiResponseBuilder {
  /**
   * Create success response
   */
  static success<T>(data: T, message?: string): BaseSuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create failure response
   */
  static failure(
    code: string,
    message: string,
    details?: any
  ): BaseFailureResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create paginated success response
   */
  static paginatedSuccess<T>(
    items: T[],
    pagination: PaginationInfo,
    message?: string
  ): BaseSuccessResponse<PaginatedResponse<T>> {
    return this.success({ items, pagination }, message);
  }

  /** Common error response - Bad Request */
  static badRequest(
    message: string = 'Bad Request',
    details?: any
  ): BaseFailureResponse {
    return this.failure('BAD_REQUEST', message, details);
  }

  /** Common error response - Unauthorized */
  static unauthorized(message: string = 'Unauthorized'): BaseFailureResponse {
    return this.failure('UNAUTHORIZED', message);
  }

  /** Common error response - Forbidden */
  static forbidden(message: string = 'Forbidden'): BaseFailureResponse {
    return this.failure('FORBIDDEN', message);
  }

  /** Common error response - Not Found */
  static notFound(message: string = 'Not Found'): BaseFailureResponse {
    return this.failure('NOT_FOUND', message);
  }

  /** Common error response - Internal Server Error */
  static internalError(
    message: string = 'Internal Server Error',
    details?: any
  ): BaseFailureResponse {
    return this.failure('INTERNAL_SERVER_ERROR', message, details);
  }
}
