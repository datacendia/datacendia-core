/**
 * Tests for backend/src/middleware/errorHandler.ts
 * Covers: AppError class, error factories, errorHandler middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { AppError, errors, errorHandler } from '../../src/middleware/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';

function createMockReq(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    path: '/test',
    method: 'GET',
    ...overrides,
  };
}

function createMockRes(): Partial<Response> & { _status: number; _json: unknown } {
  const res: any = {
    _status: 0,
    _json: null,
    status: vi.fn().mockImplementation(function(code: number) {
      res._status = code;
      return res;
    }),
    json: vi.fn().mockImplementation(function(body: unknown) {
      res._json = body;
      return res;
    }),
  };
  return res;
}

describe('AppError', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Something failed');
    expect(error.message).toBe('Something failed');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should create an AppError with custom values', () => {
    const error = new AppError('Not found', 404, 'NOT_FOUND', true, { resource: 'user' });
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.details).toEqual({ resource: 'user' });
  });

  it('should create a non-operational error', () => {
    const error = new AppError('DB crash', 500, 'INTERNAL_ERROR', false);
    expect(error.isOperational).toBe(false);
  });

  it('should have proper prototype chain', () => {
    const error = new AppError('test');
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});

describe('error factories', () => {
  it('should create badRequest error', () => {
    const error = errors.badRequest('Invalid data', { field: 'email' });
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Invalid data');
    expect(error.details).toEqual({ field: 'email' });
  });

  it('should create unauthorized error', () => {
    const error = errors.unauthorized();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('Authentication required');
  });

  it('should create unauthorized error with custom message', () => {
    const error = errors.unauthorized('Token expired');
    expect(error.message).toBe('Token expired');
  });

  it('should create forbidden error', () => {
    const error = errors.forbidden();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
  });

  it('should create notFound error', () => {
    const error = errors.notFound('User');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('User not found');
  });

  it('should create conflict error', () => {
    const error = errors.conflict('Already exists');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('CONFLICT');
  });

  it('should create validationError', () => {
    const error = errors.validationError({ email: 'required' });
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toEqual({ email: 'required' });
  });

  it('should create rateLimited error', () => {
    const error = errors.rateLimited();
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
  });

  it('should create internal error', () => {
    const error = errors.internal('Database failed');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(false);
  });
});

describe('errorHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: ReturnType<typeof createMockRes>;
  const mockNext: NextFunction = vi.fn();

  beforeEach(() => {
    mockReq = createMockReq();
    mockRes = createMockRes();
    vi.clearAllMocks();
  });

  it('should handle AppError correctly', () => {
    const error = errors.notFound('User');
    errorHandler(error, mockReq as Request, mockRes as unknown as Response, mockNext);

    expect(mockRes._status).toBe(404);
    expect(mockRes._json).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
      },
    });
  });

  it('should include details in AppError response', () => {
    const error = errors.validationError({ email: 'required', name: 'too short' });
    errorHandler(error, mockReq as Request, mockRes as unknown as Response, mockNext);

    expect(mockRes._status).toBe(400);
    expect((mockRes._json as any).error.details).toEqual({ email: 'required', name: 'too short' });
  });

  it('should handle unknown errors with 500 status', () => {
    const error = new Error('Unexpected crash');
    errorHandler(error, mockReq as Request, mockRes as unknown as Response, mockNext);

    expect(mockRes._status).toBe(500);
    expect((mockRes._json as any).error.code).toBe('INTERNAL_ERROR');
  });

  it('should hide error message in production for unknown errors', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Secret internal details');
    errorHandler(error, mockReq as Request, mockRes as unknown as Response, mockNext);

    expect((mockRes._json as any).error.message).toBe('An unexpected error occurred');

    process.env.NODE_ENV = originalEnv;
  });
});
