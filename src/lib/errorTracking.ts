/**
 * Library — Error Tracking
 *
 * Client-side utility library.
 *
 * @exports initErrorTracking, logError, logComponentError, cleanupErrorTracking
 * @module lib/errorTracking
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ERROR TRACKING SERVICE
// Enterprise-grade error tracking and reporting
// Integrates with backend logging and optional Sentry
// =============================================================================

import { API_BASE_URL, tokenManager } from './api/client';

interface ErrorContext {
  componentStack?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Configuration
const ERROR_API_ENDPOINT = `${API_BASE_URL}/errors/report`;
const ENABLE_CONSOLE_LOGGING = true;
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Error queue for batching
let errorQueue: ErrorReport[] = [];
let flushTimer: NodeJS.Timeout | null = null;

/**
 * Initialize error tracking
 */
export function initErrorTracking(): void {
  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || new Error(String(message)), {
      metadata: { source, lineno, colno },
    });
    return false;
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
      metadata: { type: 'unhandledrejection' },
    });
  };

  // Start flush timer
  flushTimer = setInterval(flushErrors, FLUSH_INTERVAL);

  console.log('[ErrorTracking] Initialized');
}

/**
 * Log an error to the tracking service
 */
export function logError(
  error: Error,
  context: Partial<ErrorContext> = {},
  severity: ErrorReport['severity'] = 'medium'
): void {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    severity,
    context: {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userId: getUserId(),
      ...context,
    },
  };

  // Console logging in development
  if (ENABLE_CONSOLE_LOGGING) {
    console.error('[ErrorTracking]', report.message, {
      stack: report.stack,
      context: report.context,
      severity: report.severity,
    });
  }

  // Add to queue
  errorQueue.push(report);

  // Flush if queue is full or critical
  if (errorQueue.length >= BATCH_SIZE || severity === 'critical') {
    flushErrors();
  }
}

/**
 * Log error from React Error Boundary
 */
export function logComponentError(error: Error, errorInfo: { componentStack?: string }): void {
  logError(
    error,
    {
      componentStack: errorInfo.componentStack,
      metadata: { source: 'ErrorBoundary' },
    },
    'high'
  );
}

/**
 * Flush error queue to backend
 */
async function flushErrors(): Promise<void> {
  if (errorQueue.length === 0) {
    return;
  }

  const errors = [...errorQueue];
  errorQueue = [];

  try {
    // The session lives in tokenManager (sessionStorage), not localStorage; the
    // CSRF token for this write is added by lib/api/fetchAuth.
    const token = tokenManager.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(ERROR_API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ errors }),
    });

    if (response.status >= 500 || response.status === 429 || response.status === 408) {
      // Temporary (server error, rate limit, timeout): put errors back in queue
      errorQueue = [...errors, ...errorQueue];
      console.warn('[ErrorTracking] Failed to send errors, will retry');
    } else if (!response.ok) {
      // Any other 4xx (signed out, or rejected) fails the same way every time;
      // re-queueing it re-sent the same report on every flush for the rest of the session.
      console.warn('[ErrorTracking] Error report rejected with', response.status);
    } else {
      console.log('[ErrorTracking] Sent', errors.length, 'error(s) to server');
    }
  } catch (err) {
    // Put errors back in queue
    errorQueue = [...errors, ...errorQueue];
    console.warn('[ErrorTracking] Network error, will retry');
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('datacendia_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${crypto.randomUUID().slice(0, 9)}`;
    sessionStorage.setItem('datacendia_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get current user ID if logged in
 */
function getUserId(): string | undefined {
  try {
    const token = tokenManager.getAccessToken();
    if (token) {
      // Decode JWT to get user ID (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId;
    }
  } catch {
    // Ignore decode errors
  }
  return undefined;
}

/**
 * Cleanup on unmount
 */
export function cleanupErrorTracking(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  flushErrors(); // Final flush
}

// Export default instance
export default {
  init: initErrorTracking,
  log: logError,
  logComponent: logComponentError,
  cleanup: cleanupErrorTracking,
};
