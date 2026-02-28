// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * BaseService - Standardized service foundation with consistent error handling
 * 
 * All services should extend this base class to ensure:
 * - Consistent error handling patterns
 * - Automatic logging
 * - Common utility methods
 * - Type-safe result patterns
 */

import { logger } from '../../utils/logger.js';
import { AppError, errors } from '../../middleware/errorHandler.js';

// =============================================================================
// RESULT PATTERN - Type-safe success/failure handling
// =============================================================================

export type Result<T, E = ServiceError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  cause?: Error;
}

// =============================================================================
// SERVICE ERROR CODES - Standardized across all services
// =============================================================================

export const ServiceErrorCodes = {
  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // External
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  LLM_ERROR: 'LLM_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAVAILABLE: 'UNAVAILABLE',
} as const;

export type ServiceErrorCode = typeof ServiceErrorCodes[keyof typeof ServiceErrorCodes];

// =============================================================================
// BASE SERVICE CLASS
// =============================================================================

export abstract class BaseService {
  protected readonly serviceName: string;
  protected readonly logger: typeof logger;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = logger;
  }

  // ---------------------------------------------------------------------------
  // Result Helpers - Create type-safe results
  // ---------------------------------------------------------------------------

  protected success<T>(data: T): Result<T> {
    return { success: true, data };
  }

  protected failure<T>(
    code: ServiceErrorCode,
    message: string,
    details?: Record<string, unknown>,
    cause?: Error
  ): Result<T> {
    this.logger.warn(`[${this.serviceName}] ${code}: ${message}`, { details });
    return {
      success: false,
      error: { code, message, details, cause },
    };
  }

  // ---------------------------------------------------------------------------
  // Error Conversion - Convert ServiceError to AppError for HTTP responses
  // ---------------------------------------------------------------------------

  protected toAppError(error: ServiceError): AppError {
    const statusMap: Record<ServiceErrorCode, number> = {
      [ServiceErrorCodes.VALIDATION_FAILED]: 400,
      [ServiceErrorCodes.INVALID_INPUT]: 400,
      [ServiceErrorCodes.MISSING_REQUIRED_FIELD]: 400,
      [ServiceErrorCodes.NOT_FOUND]: 404,
      [ServiceErrorCodes.ALREADY_EXISTS]: 409,
      [ServiceErrorCodes.CONFLICT]: 409,
      [ServiceErrorCodes.UNAUTHORIZED]: 401,
      [ServiceErrorCodes.FORBIDDEN]: 403,
      [ServiceErrorCodes.INSUFFICIENT_PERMISSIONS]: 403,
      [ServiceErrorCodes.EXTERNAL_SERVICE_ERROR]: 502,
      [ServiceErrorCodes.DATABASE_ERROR]: 500,
      [ServiceErrorCodes.LLM_ERROR]: 502,
      [ServiceErrorCodes.CACHE_ERROR]: 500,
      [ServiceErrorCodes.BUSINESS_RULE_VIOLATION]: 422,
      [ServiceErrorCodes.OPERATION_NOT_ALLOWED]: 422,
      [ServiceErrorCodes.RATE_LIMITED]: 429,
      [ServiceErrorCodes.QUOTA_EXCEEDED]: 429,
      [ServiceErrorCodes.INTERNAL_ERROR]: 500,
      [ServiceErrorCodes.TIMEOUT]: 504,
      [ServiceErrorCodes.UNAVAILABLE]: 503,
    };

    const statusCode = statusMap[error.code as ServiceErrorCode] || 500;
    return new AppError(error.message, statusCode, error.code, true, error.details);
  }

  // ---------------------------------------------------------------------------
  // Safe Execution - Wrap async operations with error handling
  // ---------------------------------------------------------------------------

  protected async safeExecute<T>(
    operation: () => Promise<T>,
    errorCode: ServiceErrorCode = ServiceErrorCodes.INTERNAL_ERROR,
    errorMessage: string = 'Operation failed'
  ): Promise<Result<T>> {
    try {
      const data = await operation();
      return this.success(data);
    } catch (error) {
      const cause = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`[${this.serviceName}] ${errorMessage}`, { 
        error: cause.message, 
        stack: cause.stack 
      });
      return this.failure(errorCode, errorMessage, undefined, cause);
    }
  }

  // ---------------------------------------------------------------------------
  // Validation Helpers
  // ---------------------------------------------------------------------------

  protected validateRequired<T extends Record<string, unknown>>(
    data: T,
    requiredFields: (keyof T)[]
  ): Result<T> {
    const missing = requiredFields.filter(
      field => data[field] === undefined || data[field] === null || data[field] === ''
    );

    if (missing.length > 0) {
      return this.failure(
        ServiceErrorCodes.MISSING_REQUIRED_FIELD,
        `Missing required fields: ${missing.join(', ')}`,
        { missingFields: missing as string[] }
      );
    }

    return this.success(data);
  }

  protected validateId(id: string | undefined | null, entityName: string = 'Entity'): Result<string> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return this.failure(
        ServiceErrorCodes.INVALID_INPUT,
        `Invalid ${entityName} ID`,
        { field: 'id', value: id }
      );
    }
    return this.success(id.trim());
  }

  // ---------------------------------------------------------------------------
  // Logging Helpers
  // ---------------------------------------------------------------------------

  protected logInfo(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(`[${this.serviceName}] ${message}`, meta);
  }

  protected logWarn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(`[${this.serviceName}] ${message}`, meta);
  }

  protected logError(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.logger.error(`[${this.serviceName}] ${message}`, {
      ...meta,
      error: error?.message,
      stack: error?.stack,
    });
  }

  protected logDebug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(`[${this.serviceName}] ${message}`, meta);
  }

  // ---------------------------------------------------------------------------
  // Timing Helpers
  // ---------------------------------------------------------------------------

  protected startTimer(): () => number {
    const start = performance.now();
    return () => Math.round(performance.now() - start);
  }

  protected async withTiming<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; durationMs: number }> {
    const getElapsed = this.startTimer();
    const result = await operation();
    const durationMs = getElapsed();
    this.logDebug(`${operationName} completed`, { durationMs });
    return { result, durationMs };
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Unwrap a Result, throwing AppError if failed
 */
export function unwrapResult<T>(result: Result<T>, serviceName: string = 'Service'): T {
  if (result.success) {
    return result.data;
  }
  
  const statusMap: Record<string, number> = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    VALIDATION_FAILED: 400,
    INVALID_INPUT: 400,
  };
  
  const statusCode = statusMap[result.error.code] || 500;
  throw new AppError(
    result.error.message,
    statusCode,
    result.error.code,
    true,
    result.error.details
  );
}

/**
 * Check if a result is successful (type guard)
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Check if a result is a failure (type guard)
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}

export default BaseService;
