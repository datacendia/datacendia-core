// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ERROR HANDLING UTILITIES
// Type-safe error handling for TypeScript strict mode
// =============================================================================

/**
 * Safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

/**
 * Safely extract error stack from unknown error
 */
export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Type guard for checking if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Wrap unknown error in Error instance
 */
export function ensureError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(getErrorMessage(error));
}

/**
 * Extract error code if present (e.g., from Prisma errors)
 */
export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}

/**
 * Check if error is a specific type by code
 */
export function isErrorWithCode(error: unknown, code: string): boolean {
  return getErrorCode(error) === code;
}

/**
 * Create a standardized API error response
 */
export function createErrorResponse(error: unknown): { success: false; error: string; code?: string } {
  const code = getErrorCode(error);
  const response: { success: false; error: string; code?: string } = {
    success: false,
    error: getErrorMessage(error),
  };
  if (code !== undefined) {
    response.code = code;
  }
  return response;
}
