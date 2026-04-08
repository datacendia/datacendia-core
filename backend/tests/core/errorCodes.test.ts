/**
 * Tests for backend/src/core/errorCodes.ts
 * Covers: ErrorCodes, ErrorCodeToStatus, ErrorMessages, helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  ErrorCodes,
  ErrorCodeToStatus,
  ErrorMessages,
  getStatusForCode,
  getMessageForCode,
  isClientError,
  isServerError,
  isRetryable,
} from '../../src/core/errorCodes.js';

describe('ErrorCodes', () => {
  it('should define authentication error codes', () => {
    expect(ErrorCodes.AUTH_INVALID_CREDENTIALS).toBe('AUTH_INVALID_CREDENTIALS');
    expect(ErrorCodes.AUTH_TOKEN_EXPIRED).toBe('AUTH_TOKEN_EXPIRED');
    expect(ErrorCodes.AUTH_TOKEN_INVALID).toBe('AUTH_TOKEN_INVALID');
    expect(ErrorCodes.AUTH_TOKEN_MISSING).toBe('AUTH_TOKEN_MISSING');
  });

  it('should define authorization error codes', () => {
    expect(ErrorCodes.FORBIDDEN).toBe('FORBIDDEN');
    expect(ErrorCodes.INSUFFICIENT_PERMISSIONS).toBe('INSUFFICIENT_PERMISSIONS');
    expect(ErrorCodes.TIER_UPGRADE_REQUIRED).toBe('TIER_UPGRADE_REQUIRED');
  });

  it('should define validation error codes', () => {
    expect(ErrorCodes.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
    expect(ErrorCodes.INVALID_INPUT).toBe('INVALID_INPUT');
    expect(ErrorCodes.MISSING_REQUIRED_FIELD).toBe('MISSING_REQUIRED_FIELD');
  });

  it('should define resource error codes', () => {
    expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCodes.ALREADY_EXISTS).toBe('ALREADY_EXISTS');
    expect(ErrorCodes.CONFLICT).toBe('CONFLICT');
  });

  it('should define system error codes', () => {
    expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(ErrorCodes.SERVICE_UNAVAILABLE).toBe('SERVICE_UNAVAILABLE');
    expect(ErrorCodes.TIMEOUT).toBe('TIMEOUT');
  });
});

describe('ErrorCodeToStatus', () => {
  it('should map auth errors to 401', () => {
    expect(ErrorCodeToStatus[ErrorCodes.AUTH_INVALID_CREDENTIALS]).toBe(401);
    expect(ErrorCodeToStatus[ErrorCodes.AUTH_TOKEN_EXPIRED]).toBe(401);
    expect(ErrorCodeToStatus[ErrorCodes.AUTH_TOKEN_MISSING]).toBe(401);
  });

  it('should map authorization errors to 403', () => {
    expect(ErrorCodeToStatus[ErrorCodes.FORBIDDEN]).toBe(403);
    expect(ErrorCodeToStatus[ErrorCodes.INSUFFICIENT_PERMISSIONS]).toBe(403);
  });

  it('should map validation errors to 400', () => {
    expect(ErrorCodeToStatus[ErrorCodes.VALIDATION_FAILED]).toBe(400);
    expect(ErrorCodeToStatus[ErrorCodes.INVALID_INPUT]).toBe(400);
  });

  it('should map not found to 404', () => {
    expect(ErrorCodeToStatus[ErrorCodes.NOT_FOUND]).toBe(404);
    expect(ErrorCodeToStatus[ErrorCodes.USER_NOT_FOUND]).toBe(404);
  });

  it('should map conflict to 409', () => {
    expect(ErrorCodeToStatus[ErrorCodes.ALREADY_EXISTS]).toBe(409);
    expect(ErrorCodeToStatus[ErrorCodes.DUPLICATE_EMAIL]).toBe(409);
  });

  it('should map business errors to 422', () => {
    expect(ErrorCodeToStatus[ErrorCodes.BUSINESS_RULE_VIOLATION]).toBe(422);
    expect(ErrorCodeToStatus[ErrorCodes.INVALID_STATE_TRANSITION]).toBe(422);
  });

  it('should map internal errors to 500', () => {
    expect(ErrorCodeToStatus[ErrorCodes.INTERNAL_ERROR]).toBe(500);
    expect(ErrorCodeToStatus[ErrorCodes.UNEXPECTED_ERROR]).toBe(500);
  });

  it('should map rate limiting to 429', () => {
    expect(ErrorCodeToStatus[ErrorCodes.RATE_LIMITED]).toBe(429);
    expect(ErrorCodeToStatus[ErrorCodes.LLM_RATE_LIMITED]).toBe(429);
  });

  it('should have mapping for every ErrorCode', () => {
    for (const code of Object.values(ErrorCodes)) {
      expect(ErrorCodeToStatus[code]).toBeDefined();
      expect(typeof ErrorCodeToStatus[code]).toBe('number');
    }
  });
});

describe('ErrorMessages', () => {
  it('should have a message for every ErrorCode', () => {
    for (const code of Object.values(ErrorCodes)) {
      expect(ErrorMessages[code]).toBeDefined();
      expect(typeof ErrorMessages[code]).toBe('string');
      expect(ErrorMessages[code].length).toBeGreaterThan(0);
    }
  });

  it('should have meaningful messages', () => {
    expect(ErrorMessages[ErrorCodes.AUTH_INVALID_CREDENTIALS]).toBe('Invalid email or password');
    expect(ErrorMessages[ErrorCodes.NOT_FOUND]).toBe('Resource not found');
    expect(ErrorMessages[ErrorCodes.RATE_LIMITED]).toContain('Too many requests');
  });
});

describe('getStatusForCode', () => {
  it('should return correct HTTP status for known codes', () => {
    expect(getStatusForCode(ErrorCodes.NOT_FOUND)).toBe(404);
    expect(getStatusForCode(ErrorCodes.INTERNAL_ERROR)).toBe(500);
    expect(getStatusForCode(ErrorCodes.FORBIDDEN)).toBe(403);
  });

  it('should return 500 for unknown codes', () => {
    expect(getStatusForCode('NONEXISTENT_CODE' as any)).toBe(500);
  });
});

describe('getMessageForCode', () => {
  it('should return message for known codes', () => {
    expect(getMessageForCode(ErrorCodes.AUTH_TOKEN_EXPIRED)).toBe('Authentication token has expired');
  });

  it('should return generic message for unknown codes', () => {
    expect(getMessageForCode('NONEXISTENT_CODE' as any)).toBe('An error occurred');
  });
});

describe('isClientError', () => {
  it('should return true for 4xx status codes', () => {
    expect(isClientError(ErrorCodes.NOT_FOUND)).toBe(true);
    expect(isClientError(ErrorCodes.VALIDATION_FAILED)).toBe(true);
    expect(isClientError(ErrorCodes.FORBIDDEN)).toBe(true);
    expect(isClientError(ErrorCodes.RATE_LIMITED)).toBe(true);
  });

  it('should return false for 5xx status codes', () => {
    expect(isClientError(ErrorCodes.INTERNAL_ERROR)).toBe(false);
    expect(isClientError(ErrorCodes.DATABASE_ERROR)).toBe(false);
  });
});

describe('isServerError', () => {
  it('should return true for 5xx status codes', () => {
    expect(isServerError(ErrorCodes.INTERNAL_ERROR)).toBe(true);
    expect(isServerError(ErrorCodes.DATABASE_ERROR)).toBe(true);
    expect(isServerError(ErrorCodes.SERVICE_UNAVAILABLE)).toBe(true);
  });

  it('should return false for 4xx status codes', () => {
    expect(isServerError(ErrorCodes.NOT_FOUND)).toBe(false);
    expect(isServerError(ErrorCodes.FORBIDDEN)).toBe(false);
  });
});

describe('isRetryable', () => {
  it('should return true for retryable error codes', () => {
    expect(isRetryable(ErrorCodes.TIMEOUT)).toBe(true);
    expect(isRetryable(ErrorCodes.SERVICE_UNAVAILABLE)).toBe(true);
    expect(isRetryable(ErrorCodes.LLM_TIMEOUT)).toBe(true);
    expect(isRetryable(ErrorCodes.LLM_RATE_LIMITED)).toBe(true);
    expect(isRetryable(ErrorCodes.RATE_LIMITED)).toBe(true);
    expect(isRetryable(ErrorCodes.DATABASE_ERROR)).toBe(true);
    expect(isRetryable(ErrorCodes.CACHE_ERROR)).toBe(true);
  });

  it('should return false for non-retryable error codes', () => {
    expect(isRetryable(ErrorCodes.NOT_FOUND)).toBe(false);
    expect(isRetryable(ErrorCodes.FORBIDDEN)).toBe(false);
    expect(isRetryable(ErrorCodes.VALIDATION_FAILED)).toBe(false);
    expect(isRetryable(ErrorCodes.INTERNAL_ERROR)).toBe(false);
  });
});
