import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import Logger from '../utils/logger';

/**
 * Simple authentication error for TSOA
 */
class AuthError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

/**
 * User interface for authenticated requests
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
}

/**
 * Extended Request interface with user property
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * JWT payload interface
 */
interface JWTPayload {
  id: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Authentication middleware for TSOA
 * This function will be called by TSOA for routes that require authentication
 *
 * @param request - Express request object
 * @param securityName - Security scheme name (e.g., 'jwt')
 * @param scopes - Required scopes for the endpoint
 * @returns Promise<AuthenticatedUser> - Authenticated user object
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthenticatedUser> {
  if (securityName === 'jwt') {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AuthError(401, 'No authorization header provided');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new AuthError(401, 'No token provided');
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      // Create authenticated user object
      const user: AuthenticatedUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      // Check scopes if provided
      if (scopes && scopes.length > 0) {
        // TODO: Implement scope checking logic based on user role
        // For now, we'll just log the required scopes
        Logger.debug('Checking user permissions', {
          requiredScopes: scopes,
          userRole: user.role,
          userId: user.id,
        });

        // Example scope checking (customize based on your needs)
        if (scopes.includes('admin') && user.role !== 'admin') {
          Logger.security('Insufficient permissions for admin access', {
            userId: user.id,
            userRole: user.role,
            requiredScopes: scopes,
          });
          throw new AuthError(403, 'Insufficient permissions');
        }
      }

      return user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError(401, 'Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError(401, 'Token expired');
      }
      // If it's already an AuthError, re-throw it
      if (error instanceof AuthError) {
        throw error;
      }
      // Otherwise, make it a 401 error
      throw new AuthError(401, 'Authentication failed');
    }
  }

  throw new AuthError(401, `Unknown security scheme: ${securityName}`);
}

/**
 * Simple middleware to extract user from request
 * Can be used for non-TSOA routes
 */
export function authMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await expressAuthentication(req, 'jwt');
      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : 'Unauthorized',
        statusCode: 401,
      });
    }
  };
}

/**
 * Utility function to generate JWT token
 */
export function generateToken(
  user: Omit<AuthenticatedUser, 'id'> & { id: string }
): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
}

/**
 * Utility function to generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  const payload = {
    id: userId,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}
