/**
 * Tests for backend/src/utils/errors.ts
 * Covers: getErrorMessage, getErrorStack, isError, ensureError, getErrorCode, isErrorWithCode, createErrorResponse
 */

import { describe, it, expect } from 'vitest';
import {
  getErrorMessage,
  getErrorStack,
  isError,
  ensureError,
  getErrorCode,
  isErrorWithCode,
  createErrorResponse,
} from '../../src/utils/errors.js';

describe('getErrorMessage', () => {
  it('should extract message from Error instance', () => {
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('should return string errors directly', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('should extract message from object with message property', () => {
    expect(getErrorMessage({ message: 'object error' })).toBe('object error');
  });

  it('should return default message for unknown types', () => {
    expect(getErrorMessage(42)).toBe('An unknown error occurred');
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
  });
});

describe('getErrorStack', () => {
  it('should extract stack from Error', () => {
    const error = new Error('test');
    expect(getErrorStack(error)).toContain('Error: test');
  });

  it('should return undefined for non-Error', () => {
    expect(getErrorStack('string')).toBeUndefined();
    expect(getErrorStack(null)).toBeUndefined();
  });
});

describe('isError', () => {
  it('should identify Error instances', () => {
    expect(isError(new Error())).toBe(true);
    expect(isError(new TypeError())).toBe(true);
  });

  it('should reject non-Error values', () => {
    expect(isError('string')).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError({ message: 'fake' })).toBe(false);
  });
});

describe('ensureError', () => {
  it('should return Error unchanged', () => {
    const err = new Error('test');
    expect(ensureError(err)).toBe(err);
  });

  it('should wrap strings', () => {
    const result = ensureError('string error');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });

  it('should wrap unknown types', () => {
    const result = ensureError(42);
    expect(result).toBeInstanceOf(Error);
  });
});

describe('getErrorCode', () => {
  it('should extract code from error-like object', () => {
    expect(getErrorCode({ code: 'P2002' })).toBe('P2002');
  });

  it('should return undefined when no code', () => {
    expect(getErrorCode(new Error('no code'))).toBeUndefined();
    expect(getErrorCode('string')).toBeUndefined();
    expect(getErrorCode(null)).toBeUndefined();
  });

  it('should convert non-string codes to string', () => {
    expect(getErrorCode({ code: 42 })).toBe('42');
  });
});

describe('isErrorWithCode', () => {
  it('should match specific error codes', () => {
    expect(isErrorWithCode({ code: 'P2002' }, 'P2002')).toBe(true);
    expect(isErrorWithCode({ code: 'P2002' }, 'P2003')).toBe(false);
  });

  it('should return false for errors without code', () => {
    expect(isErrorWithCode(new Error('test'), 'P2002')).toBe(false);
  });
});

describe('createErrorResponse', () => {
  it('should create standard error response from Error', () => {
    const response = createErrorResponse(new Error('Something went wrong'));
    expect(response).toEqual({
      success: false,
      error: 'Something went wrong',
    });
  });

  it('should include error code when available', () => {
    const response = createErrorResponse({ message: 'Duplicate', code: 'P2002' });
    expect(response).toEqual({
      success: false,
      error: 'Duplicate',
      code: 'P2002',
    });
  });

  it('should handle unknown errors', () => {
    const response = createErrorResponse(42);
    expect(response.success).toBe(false);
    expect(response.error).toBe('An unknown error occurred');
  });
});
