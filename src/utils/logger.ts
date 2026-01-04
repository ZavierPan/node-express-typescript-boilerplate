import logger from '../config/logger';

/**
 * Logger utility class with structured logging methods
 * Provides a convenient interface for logging throughout the application
 */
class Logger {
  /**
   * Log an error message
   * @param message - Error message
   * @param meta - Additional metadata
   */
  static error(message: string, meta?: unknown): void {
    logger.error(message, meta);
  }

  /**
   * Log a warning message
   * @param message - Warning message
   * @param meta - Additional metadata
   */
  static warn(message: string, meta?: unknown): void {
    logger.warn(message, meta);
  }

  /**
   * Log an info message
   * @param message - Info message
   * @param meta - Additional metadata
   */
  static info(message: string, meta?: unknown): void {
    logger.info(message, meta);
  }

  /**
   * Log an HTTP request/response
   * @param message - HTTP message
   * @param meta - Additional metadata
   */
  static http(message: string, meta?: unknown): void {
    logger.http(message, meta);
  }

  /**
   * Log a debug message
   * @param message - Debug message
   * @param meta - Additional metadata
   */
  static debug(message: string, meta?: unknown): void {
    logger.debug(message, meta);
  }

  /**
   * Log database operations
   * @param operation - Database operation type
   * @param table - Table name
   * @param meta - Additional metadata
   */
  static database(
    operation: string,
    table: string,
    meta?: Record<string, unknown>
  ): void {
    logger.info(`Database ${operation}`, {
      operation,
      table,
      ...(meta || {}),
    });
  }

  /**
   * Log authentication events
   * @param event - Authentication event type
   * @param userId - User ID
   * @param meta - Additional metadata
   */
  static auth(
    event: string,
    userId?: string,
    meta?: Record<string, unknown>
  ): void {
    logger.info(`Auth ${event}`, {
      event,
      userId,
      ...(meta || {}),
    });
  }

  /**
   * Log API requests
   * @param method - HTTP method
   * @param url - Request URL
   * @param statusCode - Response status code
   * @param responseTime - Response time in ms
   * @param userId - User ID (if authenticated)
   * @param meta - Additional metadata
   */
  static api(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    meta?: Record<string, unknown>
  ): void {
    logger.http('API Request', {
      method,
      url,
      statusCode,
      responseTime,
      userId,
      ...(meta || {}),
    });
  }

  /**
   * Log application startup events
   * @param event - Startup event
   * @param meta - Additional metadata
   */
  static startup(event: string, meta?: unknown): void {
    logger.info(`Startup: ${event}`, meta);
  }

  /**
   * Log application shutdown events
   * @param event - Shutdown event
   * @param meta - Additional metadata
   */
  static shutdown(event: string, meta?: unknown): void {
    logger.info(`Shutdown: ${event}`, meta);
  }

  /**
   * Log security events
   * @param event - Security event
   * @param meta - Additional metadata
   */
  static security(event: string, meta?: unknown): void {
    logger.warn(`Security: ${event}`, meta);
  }

  /**
   * Log performance metrics
   * @param metric - Performance metric name
   * @param value - Metric value
   * @param unit - Metric unit
   * @param meta - Additional metadata
   */
  static performance(
    metric: string,
    value: number,
    unit: string,
    meta?: Record<string, unknown>
  ): void {
    logger.info(`Performance: ${metric}`, {
      metric,
      value,
      unit,
      ...(meta || {}),
    });
  }
}

export default Logger;
