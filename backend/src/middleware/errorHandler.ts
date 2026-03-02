/**
 * Middleware — Error Handler
 *
 * Express middleware for request processing pipeline.
 *
 * @exports AppError, errors, errorHandler
 * @module middleware/errorHandler
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
export const errors = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new AppError(message, 400, 'BAD_REQUEST', true, details),
  
  unauthorized: (message: string = 'Authentication required') =>
    new AppError(message, 401, 'UNAUTHORIZED', true),
  
  forbidden: (message: string = 'Access denied') =>
    new AppError(message, 403, 'FORBIDDEN', true),
  
  notFound: (resource: string = 'Resource') =>
    new AppError(`${resource} not found`, 404, 'NOT_FOUND', true),
  
  conflict: (message: string) =>
    new AppError(message, 409, 'CONFLICT', true),
  
  validationError: (details: Record<string, unknown>) =>
    new AppError('Validation failed', 400, 'VALIDATION_ERROR', true, details),
  
  rateLimited: () =>
    new AppError('Too many requests', 429, 'RATE_LIMITED', true),
  
  internal: (message: string = 'Internal server error') =>
    new AppError(message, 500, 'INTERNAL_ERROR', false),
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      });
    } else {
      logger.warn('Operational error:', {
        code: err.code,
        message: err.message,
        path: req.path,
        method: req.method,
      });
    }
  } else {
    logger.error('Unhandled error:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
    },
  });
};

export default errorHandler;
