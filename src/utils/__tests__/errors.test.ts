/**
 * Tests for src/utils/errors.ts
 * Covers: getErrorMessage, getErrorStack, isError, ensureError
 */

import { describe, it, expect } from 'vitest';
import { getErrorMessage, getErrorStack, isError, ensureError } from '../errors';

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

  it('should convert non-string message property to string', () => {
    expect(getErrorMessage({ message: 123 })).toBe('123');
  });

  it('should handle empty string', () => {
    expect(getErrorMessage('')).toBe('');
  });

  it('should handle boolean values', () => {
    expect(getErrorMessage(true)).toBe('An unknown error occurred');
  });
});

describe('getErrorStack', () => {
  it('should extract stack from Error instance', () => {
    const error = new Error('test');
    expect(getErrorStack(error)).toBeDefined();
    expect(getErrorStack(error)).toContain('Error: test');
  });

  it('should return undefined for non-Error values', () => {
    expect(getErrorStack('string')).toBeUndefined();
    expect(getErrorStack(42)).toBeUndefined();
    expect(getErrorStack(null)).toBeUndefined();
    expect(getErrorStack({ stack: 'fake stack' })).toBeUndefined();
  });
});

describe('isError', () => {
  it('should return true for Error instances', () => {
    expect(isError(new Error('test'))).toBe(true);
    expect(isError(new TypeError('type error'))).toBe(true);
    expect(isError(new RangeError('range'))).toBe(true);
  });

  it('should return false for non-Error values', () => {
    expect(isError('error string')).toBe(false);
    expect(isError(42)).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError({ message: 'not an error' })).toBe(false);
  });
});

describe('ensureError', () => {
  it('should return Error instance unchanged', () => {
    const original = new Error('original');
    const result = ensureError(original);
    expect(result).toBe(original);
  });

  it('should wrap string in Error', () => {
    const result = ensureError('string error');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });

  it('should wrap object with message in Error', () => {
    const result = ensureError({ message: 'object error' });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('object error');
  });

  it('should wrap unknown types with default message', () => {
    const result = ensureError(42);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('An unknown error occurred');
  });

  it('should wrap null with default message', () => {
    const result = ensureError(null);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('An unknown error occurred');
  });
});
