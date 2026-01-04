import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';
import config from '../config';
import { AuthenticatedRequest } from './authentication';

/**
 * HTTP request logging middleware
 * Logs all incoming HTTP requests with response details
 */
export const httpLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip logging if HTTP logging is disabled
  if (!config.logging.enableHttpLogging) {
    next();
    return;
  }

  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Get user ID from request if authenticated
  const userId = (req as AuthenticatedRequest).user?.id;

  // Log the incoming request
  Logger.http('Incoming Request', {
    method,
    url,
    ip,
    userAgent,
    userId,
    timestamp: new Date().toISOString(),
  });

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function (...args: unknown[]): Response {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;
    const contentLength = res.get('Content-Length') || '0';

    // Log the response
    Logger.api(method, url, statusCode, responseTime, userId, {
      ip,
      userAgent,
      contentLength,
      timestamp: new Date().toISOString(),
    });

    // Call the original end method
    originalEnd.apply(this, args as Parameters<typeof originalEnd>);
    return this;
  };

  next();
};

/**
 * Error logging middleware
 * Logs errors that occur during request processing
 */
export const errorLoggingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const userId = (req as AuthenticatedRequest).user?.id;

  Logger.error('Request Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method,
      url,
      ip,
      userAgent,
      userId,
    },
    timestamp: new Date().toISOString(),
  });

  next(error);
};

/**
 * Security event logging middleware
 * Logs security-related events like authentication failures
 */
export const securityLoggingMiddleware = {
  /**
   * Log authentication attempts
   */
  logAuthAttempt: (
    email: string,
    success: boolean,
    ip: string,
    userAgent: string
  ): void => {
    const event = success ? 'Login Success' : 'Login Failed';
    Logger.security(event, {
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log unauthorized access attempts
   */
  logUnauthorizedAccess: (req: Request, reason: string): void => {
    const { method, url, ip } = req;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const userId = (req as AuthenticatedRequest).user?.id;

    Logger.security('Unauthorized Access', {
      reason,
      request: {
        method,
        url,
        ip,
        userAgent,
        userId,
      },
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log suspicious activities
   */
  logSuspiciousActivity: (
    activity: string,
    details: Record<string, unknown>
  ): void => {
    Logger.security('Suspicious Activity', {
      activity,
      details,
      timestamp: new Date().toISOString(),
    });
  },
};
