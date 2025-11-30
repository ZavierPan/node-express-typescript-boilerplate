import { Request, Response, NextFunction } from 'express';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
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
  // Handle TSOA validation errors
  if (err.name === 'ValidateError') {
    console.warn(
      `Caught Validation Error for ${req.path}:`,
      (err as any).fields
    );
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation Failed',
        details: (err as any)?.fields,
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(422).json(errorResponse);
  }

  // Handle authentication errors (from TSOA expressAuthentication)
  if (err.name === 'AuthError' && (err as any).statusCode) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: err.message,
      },
      timestamp: new Date().toISOString(),
    };
    return res.status((err as any).statusCode).json(errorResponse);
  }

  // Handle unknown errors
  console.error('Unknown error:', err);
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal Server Error',
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
