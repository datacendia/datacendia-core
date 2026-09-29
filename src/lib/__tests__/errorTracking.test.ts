/**
 * Library — Error Tracking Test
 *
 * Client-side utility library.
 * @module lib/__tests__/errorTracking.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ERROR TRACKING TESTS
// Unit tests for errorTracking.ts
// =============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock browser APIs
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockFetch = vi.fn();

// Setup global mocks before importing
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage, writable: true });
Object.defineProperty(global, 'sessionStorage', { value: mockSessionStorage, writable: true });
Object.defineProperty(global, 'fetch', { value: mockFetch, writable: true });
Object.defineProperty(global, 'window', {
  value: {
    location: { href: 'http://localhost:3000/test' },
    onerror: null,
    onunhandledrejection: null,
  },
  writable: true,
});
Object.defineProperty(global, 'navigator', {
  value: { userAgent: 'test-user-agent' },
  writable: true,
});

// Import after mocks are set up
import {
  initErrorTracking,
  logError,
  logComponentError,
  cleanupErrorTracking,
} from '../errorTracking';
import { tokenManager } from '../api/client';

// =============================================================================
// TESTS
// =============================================================================

describe('errorTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSessionStorage.getItem.mockReturnValue(null);
    mockLocalStorage.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupErrorTracking();
    // tokenManager is a module-level singleton: don't let one test's session leak into the next
    tokenManager.clearTokens();
    // Nor one test's console spies (clearAllMocks in beforeEach keeps implementations)
    vi.restoreAllMocks();
  });

  describe('initErrorTracking', () => {
    it('should set up global error handler', () => {
      initErrorTracking();
      expect(window.onerror).toBeDefined();
    });

    it('should set up unhandled rejection handler', () => {
      initErrorTracking();
      expect(window.onunhandledrejection).toBeDefined();
    });

    it('should log initialization message', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      initErrorTracking();
      expect(consoleSpy).toHaveBeenCalledWith('[ErrorTracking] Initialized');
      consoleSpy.mockRestore();
    });
  });

  describe('logError', () => {
    it('should log error to console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorTracking]',
        'Test error',
        expect.objectContaining({
          stack: expect.any(String),
          severity: 'medium',
        })
      );
      consoleSpy.mockRestore();
    });

    it('should use default severity of medium', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ severity: 'medium' })
      );
      consoleSpy.mockRestore();
    });

    it('should accept custom severity', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Critical error');

      logError(error, {}, 'critical');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ severity: 'critical' })
      );
      consoleSpy.mockRestore();
    });

    it('should include context in error report', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      const context = { componentStack: 'at Component' };

      logError(error, context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          context: expect.objectContaining({
            componentStack: 'at Component',
          }),
        })
      );
      consoleSpy.mockRestore();
    });

    it('should include URL in context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          context: expect.objectContaining({
            url: 'http://localhost:3000/test',
          }),
        })
      );
      consoleSpy.mockRestore();
    });

    it('should include userAgent in context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          context: expect.objectContaining({
            userAgent: 'test-user-agent',
          }),
        })
      );
      consoleSpy.mockRestore();
    });

    it('should generate session ID if not exists', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionStorage.getItem.mockReturnValue(null);

      logError(new Error('Test'));

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'datacendia_session_id',
        expect.stringContaining('session_')
      );
    });

    it('should reuse existing session ID', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionStorage.getItem.mockReturnValue('existing-session-id');

      logError(new Error('Test'));

      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should extract user ID from the session token', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      // A JWT whose payload is { sub: 'user-123' }; the session lives in tokenManager
      const payload = btoa(JSON.stringify({ sub: 'user-123' }));
      tokenManager.setTokens({ accessToken: `header.${payload}.signature`, refreshToken: 'r', expiresIn: 3600 });

      logError(new Error('Test user id'), {}, 'critical');
      await vi.runAllTimersAsync();

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      const report = body.errors.find((e: { message: string }) => e.message === 'Test user id');
      expect(report.context.userId).toBe('user-123');
    });

    it('should handle invalid JWT gracefully', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      tokenManager.setTokens({ accessToken: 'invalid-token', refreshToken: 'r', expiresIn: 3600 });

      // Should not throw, and the report goes out without a user ID
      expect(() => logError(new Error('Invalid JWT'), {}, 'critical')).not.toThrow();
      await vi.runAllTimersAsync();
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      const report = body.errors.find((e: { message: string }) => e.message === 'Invalid JWT');
      expect(report.context.userId).toBeUndefined();
    });

    it('should flush immediately for critical errors', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});

      logError(new Error('Critical'), {}, 'critical');

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('logComponentError', () => {
    it('should log with high severity', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Component error');

      logComponentError(error, { componentStack: 'at MyComponent' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ severity: 'high' })
      );
      consoleSpy.mockRestore();
    });

    it('should include component stack', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Component error');

      logComponentError(error, { componentStack: 'at MyComponent\nat App' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          context: expect.objectContaining({
            componentStack: 'at MyComponent\nat App',
          }),
        })
      );
      consoleSpy.mockRestore();
    });

    it('should include ErrorBoundary source metadata', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Component error');

      logComponentError(error, {});

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          context: expect.objectContaining({
            metadata: expect.objectContaining({
              source: 'ErrorBoundary',
            }),
          }),
        })
      );
      consoleSpy.mockRestore();
    });
  });

  describe('cleanupErrorTracking', () => {
    it('should flush remaining errors', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});

      // Add an error to queue
      logError(new Error('Test'), {}, 'low');

      // Clear the fetch mock to check cleanup flush
      mockFetch.mockClear();

      cleanupErrorTracking();

      // Should attempt to flush
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('error batching', () => {
    it('should batch errors until BATCH_SIZE is reached', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});

      // Log 9 errors (less than batch size of 10)
      for (let i = 0; i < 9; i++) {
        logError(new Error(`Error ${i}`), {}, 'low');
      }

      // Should not have flushed yet
      expect(mockFetch).not.toHaveBeenCalled();

      // Log 10th error
      logError(new Error('Error 10'), {}, 'low');

      // Should flush now
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('flush error handling', () => {
    it.each([503, 429, 408])('should retry a batch the server could not take (%i)', async (status) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockResolvedValue({ ok: false, status });

      logError(new Error(`Retry ${status}`), {}, 'critical');
      await vi.runAllTimersAsync();
      expect(warnSpy).toHaveBeenCalledWith('[ErrorTracking] Failed to send errors, will retry');

      // The next flush sends the queued report again
      mockFetch.mockClear();
      mockFetch.mockResolvedValue({ ok: true });
      logError(new Error('Next'), {}, 'critical');
      await vi.runAllTimersAsync();
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.errors.map((e: { message: string }) => e.message)).toContain(`Retry ${status}`);
      warnSpy.mockRestore();
    });

    it('should drop a batch the server rejected (4xx) instead of re-sending it', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      logError(new Error('Rejected'), {}, 'critical');
      await vi.runAllTimersAsync();
      expect(warnSpy).toHaveBeenCalledWith('[ErrorTracking] Error report rejected with', 401);

      mockFetch.mockClear();
      mockFetch.mockResolvedValue({ ok: true });
      logError(new Error('Next'), {}, 'critical');
      await vi.runAllTimersAsync();

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.errors.map((e: { message: string }) => e.message)).not.toContain('Rejected');
      warnSpy.mockRestore();
    });

    it('should handle network error gracefully', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      logError(new Error('Test'), {}, 'critical');

      // Wait for async flush
      await vi.runAllTimersAsync();

      expect(warnSpy).toHaveBeenCalledWith('[ErrorTracking] Network error, will retry');
      warnSpy.mockRestore();
    });

    it('should include auth token in request if available', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      tokenManager.setTokens({ accessToken: 'test-access-token', refreshToken: 'r', expiresIn: 3600 });

      logError(new Error('Test'), {}, 'critical');

      await vi.runAllTimersAsync();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-access-token',
          }),
        })
      );
    });
  });
});
