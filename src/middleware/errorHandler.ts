import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

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
    Logger.warn(`Validation Error for ${req.path}`, {
      path: req.path,
      method: req.method,
      fields: (err as ValidationError).fields,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
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
    Logger.security('Authentication Error', {
      path: req.path,
      method: req.method,
      message: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
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
  Logger.error('Unhandled error', {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    request: {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
  });
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
  Logger.warn('Route not found', {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

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
