import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  message: string;
  statusCode: number;
  details?: any;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // Handle TSOA validation errors (will be enabled after TSOA setup)
  if (err.name === 'ValidateError') {
    console.warn(`Caught Validation Error for ${req.path}:`, (err as any).fields);
    const errorResponse: ErrorResponse = {
      message: 'Validation Failed',
      statusCode: 422,
      details: (err as any)?.fields,
    };
    return res.status(422).json(errorResponse);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    const errorResponse: ErrorResponse = {
      message: err.message,
      statusCode: err.statusCode,
    };
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle unknown errors
  console.error('Unknown error:', err);
  const errorResponse: ErrorResponse = {
    message: 'Internal Server Error',
    statusCode: 500,
  };

  return res.status(500).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): Response {
  const errorResponse: ErrorResponse = {
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  };
  return res.status(404).json(errorResponse);
}