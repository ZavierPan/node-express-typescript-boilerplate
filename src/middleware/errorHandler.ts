import { Request, Response, NextFunction } from 'express';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Custom error type for validation errors
 */
interface ValidationError extends Error {
  fields?: Record<string, unknown>;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  // Handle TSOA validation errors
  if (err.name === 'ValidateError') {
    console.warn(
      `Caught Validation Error for ${req.path}:`,
      (err as ValidationError).fields
    );
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation Failed',
        details: (err as ValidationError).fields,
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(422).json(errorResponse);
  }

  // Handle authentication errors
  if (err.name === 'AuthError') {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: err.message || 'Authentication failed',
      },
      timestamp: new Date().toISOString(),
    };
    return res
      .status((err as unknown as { statusCode: number }).statusCode || 401)
      .json(errorResponse);
  }

  // Default error handler
  console.error('Unhandled error:', err);
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(500).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): Response {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(404).json(errorResponse);
}
