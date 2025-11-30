import { Controller, Get, Route, Tags } from 'tsoa';

/**
 * Health check response interface
 */
interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

/**
 * Health check controller
 * Provides endpoints for monitoring application health
 */
@Route('health')
@Tags('Health')
export class HealthController extends Controller {
  /**
   * Get application health status
   * @summary Check if the application is running
   * @returns Health status information
   */
  @Get('/')
  public async getHealth(): Promise<HealthResponse> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  /**
   * Simple ping endpoint
   * @summary Ping the server
   * @returns Simple pong response
   */
  @Get('/ping')
  public async ping(): Promise<{ message: string }> {
    return { message: 'pong' };
  }
}
