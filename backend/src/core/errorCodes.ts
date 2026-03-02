// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Standardized Error Codes for Datacendia API
 * 
 * All services should use these codes for consistent error handling.
 * Codes are organized by category and include HTTP status mappings.
 */

// =============================================================================
// ERROR CODE DEFINITIONS
// =============================================================================

export const ErrorCodes = {
  // ---------------------------------------------------------------------------
  // Authentication Errors (401)
  // ---------------------------------------------------------------------------
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_REFRESH_TOKEN_INVALID: 'AUTH_REFRESH_TOKEN_INVALID',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_MFA_REQUIRED: 'AUTH_MFA_REQUIRED',
  AUTH_MFA_INVALID: 'AUTH_MFA_INVALID',

  // ---------------------------------------------------------------------------
  // Authorization Errors (403)
  // ---------------------------------------------------------------------------
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_ACCESS_DENIED: 'RESOURCE_ACCESS_DENIED',
  ORGANIZATION_ACCESS_DENIED: 'ORGANIZATION_ACCESS_DENIED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
  TIER_UPGRADE_REQUIRED: 'TIER_UPGRADE_REQUIRED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  RATE_LIMITED: 'RATE_LIMITED',

  // ---------------------------------------------------------------------------
  // Validation Errors (400)
  // ---------------------------------------------------------------------------
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  INVALID_ENUM_VALUE: 'INVALID_ENUM_VALUE',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',

  // ---------------------------------------------------------------------------
  // Resource Errors (404/409)
  // ---------------------------------------------------------------------------
  NOT_FOUND: 'NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ORGANIZATION_NOT_FOUND: 'ORGANIZATION_NOT_FOUND',
  DELIBERATION_NOT_FOUND: 'DELIBERATION_NOT_FOUND',
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  METRIC_NOT_FOUND: 'METRIC_NOT_FOUND',
  WORKFLOW_NOT_FOUND: 'WORKFLOW_NOT_FOUND',
  DATA_SOURCE_NOT_FOUND: 'DATA_SOURCE_NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  CONFLICT: 'CONFLICT',
  RESOURCE_IN_USE: 'RESOURCE_IN_USE',
  VERSION_CONFLICT: 'VERSION_CONFLICT',

  // ---------------------------------------------------------------------------
  // Business Logic Errors (422)
  // ---------------------------------------------------------------------------
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INVALID_STATE_TRANSITION: 'INVALID_STATE_TRANSITION',
  DELIBERATION_ALREADY_COMPLETE: 'DELIBERATION_ALREADY_COMPLETE',
  DELIBERATION_CANCELLED: 'DELIBERATION_CANCELLED',
  WORKFLOW_ALREADY_RUNNING: 'WORKFLOW_ALREADY_RUNNING',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
  VETO_ACTIVE: 'VETO_ACTIVE',
  DEPENDENCY_FAILED: 'DEPENDENCY_FAILED',

  // ---------------------------------------------------------------------------
  // External Service Errors (502/503)
  // ---------------------------------------------------------------------------
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  LLM_ERROR: 'LLM_ERROR',
  LLM_TIMEOUT: 'LLM_TIMEOUT',
  LLM_RATE_LIMITED: 'LLM_RATE_LIMITED',
  GRAPH_DB_ERROR: 'GRAPH_DB_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  EMAIL_DELIVERY_FAILED: 'EMAIL_DELIVERY_FAILED',
  WEBHOOK_DELIVERY_FAILED: 'WEBHOOK_DELIVERY_FAILED',
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',

  // ---------------------------------------------------------------------------
  // System Errors (500)
  // ---------------------------------------------------------------------------
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// =============================================================================
// HTTP STATUS MAPPINGS
// =============================================================================

export const ErrorCodeToStatus: Record<ErrorCode, number> = {
  // 401 Unauthorized
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 401,
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 401,
  [ErrorCodes.AUTH_TOKEN_INVALID]: 401,
  [ErrorCodes.AUTH_TOKEN_MISSING]: 401,
  [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID]: 401,
  [ErrorCodes.AUTH_SESSION_EXPIRED]: 401,
  [ErrorCodes.AUTH_MFA_REQUIRED]: 401,
  [ErrorCodes.AUTH_MFA_INVALID]: 401,

  // 403 Forbidden
  [ErrorCodes.FORBIDDEN]: 403,
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 403,
  [ErrorCodes.RESOURCE_ACCESS_DENIED]: 403,
  [ErrorCodes.ORGANIZATION_ACCESS_DENIED]: 403,
  [ErrorCodes.FEATURE_NOT_AVAILABLE]: 403,
  [ErrorCodes.TIER_UPGRADE_REQUIRED]: 403,
  [ErrorCodes.QUOTA_EXCEEDED]: 403,
  [ErrorCodes.RATE_LIMITED]: 429,

  // 400 Bad Request
  [ErrorCodes.VALIDATION_FAILED]: 400,
  [ErrorCodes.INVALID_INPUT]: 400,
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCodes.INVALID_FORMAT]: 400,
  [ErrorCodes.INVALID_EMAIL]: 400,
  [ErrorCodes.INVALID_PASSWORD]: 400,
  [ErrorCodes.INVALID_DATE_RANGE]: 400,
  [ErrorCodes.INVALID_ENUM_VALUE]: 400,
  [ErrorCodes.PAYLOAD_TOO_LARGE]: 413,

  // 404 Not Found
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.USER_NOT_FOUND]: 404,
  [ErrorCodes.ORGANIZATION_NOT_FOUND]: 404,
  [ErrorCodes.DELIBERATION_NOT_FOUND]: 404,
  [ErrorCodes.AGENT_NOT_FOUND]: 404,
  [ErrorCodes.METRIC_NOT_FOUND]: 404,
  [ErrorCodes.WORKFLOW_NOT_FOUND]: 404,
  [ErrorCodes.DATA_SOURCE_NOT_FOUND]: 404,

  // 409 Conflict
  [ErrorCodes.ALREADY_EXISTS]: 409,
  [ErrorCodes.DUPLICATE_EMAIL]: 409,
  [ErrorCodes.DUPLICATE_RESOURCE]: 409,
  [ErrorCodes.CONFLICT]: 409,
  [ErrorCodes.RESOURCE_IN_USE]: 409,
  [ErrorCodes.VERSION_CONFLICT]: 409,

  // 422 Unprocessable Entity
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: 422,
  [ErrorCodes.OPERATION_NOT_ALLOWED]: 422,
  [ErrorCodes.INVALID_STATE_TRANSITION]: 422,
  [ErrorCodes.DELIBERATION_ALREADY_COMPLETE]: 422,
  [ErrorCodes.DELIBERATION_CANCELLED]: 422,
  [ErrorCodes.WORKFLOW_ALREADY_RUNNING]: 422,
  [ErrorCodes.APPROVAL_REQUIRED]: 422,
  [ErrorCodes.VETO_ACTIVE]: 422,
  [ErrorCodes.DEPENDENCY_FAILED]: 422,

  // 502/503 Service Errors
  [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorCodes.DATABASE_ERROR]: 503,
  [ErrorCodes.CACHE_ERROR]: 503,
  [ErrorCodes.LLM_ERROR]: 502,
  [ErrorCodes.LLM_TIMEOUT]: 504,
  [ErrorCodes.LLM_RATE_LIMITED]: 429,
  [ErrorCodes.GRAPH_DB_ERROR]: 503,
  [ErrorCodes.STORAGE_ERROR]: 503,
  [ErrorCodes.EMAIL_DELIVERY_FAILED]: 502,
  [ErrorCodes.WEBHOOK_DELIVERY_FAILED]: 502,
  [ErrorCodes.INTEGRATION_ERROR]: 502,

  // 500 Internal Server Error
  [ErrorCodes.INTERNAL_ERROR]: 500,
  [ErrorCodes.UNEXPECTED_ERROR]: 500,
  [ErrorCodes.TIMEOUT]: 504,
  [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
  [ErrorCodes.MAINTENANCE_MODE]: 503,
  [ErrorCodes.CONFIGURATION_ERROR]: 500,
};

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ErrorMessages: Record<ErrorCode, string> = {
  // Auth
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.AUTH_TOKEN_MISSING]: 'Authentication token required',
  [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID]: 'Invalid refresh token',
  [ErrorCodes.AUTH_SESSION_EXPIRED]: 'Session has expired, please login again',
  [ErrorCodes.AUTH_MFA_REQUIRED]: 'Multi-factor authentication required',
  [ErrorCodes.AUTH_MFA_INVALID]: 'Invalid MFA code',

  // Authorization
  [ErrorCodes.FORBIDDEN]: 'Access denied',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action',
  [ErrorCodes.RESOURCE_ACCESS_DENIED]: 'Access to this resource is denied',
  [ErrorCodes.ORGANIZATION_ACCESS_DENIED]: 'Access to this organization is denied',
  [ErrorCodes.FEATURE_NOT_AVAILABLE]: 'This feature is not available on your plan',
  [ErrorCodes.TIER_UPGRADE_REQUIRED]: 'Please upgrade your plan to access this feature',
  [ErrorCodes.QUOTA_EXCEEDED]: 'You have exceeded your usage quota',
  [ErrorCodes.RATE_LIMITED]: 'Too many requests, please try again later',

  // Validation
  [ErrorCodes.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCodes.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 'Required field is missing',
  [ErrorCodes.INVALID_FORMAT]: 'Invalid format',
  [ErrorCodes.INVALID_EMAIL]: 'Invalid email format',
  [ErrorCodes.INVALID_PASSWORD]: 'Password does not meet requirements',
  [ErrorCodes.INVALID_DATE_RANGE]: 'Invalid date range',
  [ErrorCodes.INVALID_ENUM_VALUE]: 'Invalid value for this field',
  [ErrorCodes.PAYLOAD_TOO_LARGE]: 'Request payload is too large',

  // Resources
  [ErrorCodes.NOT_FOUND]: 'Resource not found',
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.ORGANIZATION_NOT_FOUND]: 'Organization not found',
  [ErrorCodes.DELIBERATION_NOT_FOUND]: 'Deliberation not found',
  [ErrorCodes.AGENT_NOT_FOUND]: 'Agent not found',
  [ErrorCodes.METRIC_NOT_FOUND]: 'Metric not found',
  [ErrorCodes.WORKFLOW_NOT_FOUND]: 'Workflow not found',
  [ErrorCodes.DATA_SOURCE_NOT_FOUND]: 'Data source not found',
  [ErrorCodes.ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCodes.DUPLICATE_EMAIL]: 'An account with this email already exists',
  [ErrorCodes.DUPLICATE_RESOURCE]: 'A resource with this identifier already exists',
  [ErrorCodes.CONFLICT]: 'Resource conflict',
  [ErrorCodes.RESOURCE_IN_USE]: 'Resource is currently in use',
  [ErrorCodes.VERSION_CONFLICT]: 'Resource has been modified, please refresh',

  // Business Logic
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: 'Business rule violation',
  [ErrorCodes.OPERATION_NOT_ALLOWED]: 'This operation is not allowed',
  [ErrorCodes.INVALID_STATE_TRANSITION]: 'Invalid state transition',
  [ErrorCodes.DELIBERATION_ALREADY_COMPLETE]: 'Deliberation has already been completed',
  [ErrorCodes.DELIBERATION_CANCELLED]: 'Deliberation has been cancelled',
  [ErrorCodes.WORKFLOW_ALREADY_RUNNING]: 'Workflow is already running',
  [ErrorCodes.APPROVAL_REQUIRED]: 'This action requires approval',
  [ErrorCodes.VETO_ACTIVE]: 'A veto is currently active on this decision',
  [ErrorCodes.DEPENDENCY_FAILED]: 'A required dependency failed',

  // External Services
  [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 'External service error',
  [ErrorCodes.DATABASE_ERROR]: 'Database error occurred',
  [ErrorCodes.CACHE_ERROR]: 'Cache service error',
  [ErrorCodes.LLM_ERROR]: 'AI service error',
  [ErrorCodes.LLM_TIMEOUT]: 'AI service timed out',
  [ErrorCodes.LLM_RATE_LIMITED]: 'AI service rate limited',
  [ErrorCodes.GRAPH_DB_ERROR]: 'Knowledge graph error',
  [ErrorCodes.STORAGE_ERROR]: 'Storage service error',
  [ErrorCodes.EMAIL_DELIVERY_FAILED]: 'Failed to send email',
  [ErrorCodes.WEBHOOK_DELIVERY_FAILED]: 'Failed to deliver webhook',
  [ErrorCodes.INTEGRATION_ERROR]: 'Integration error',

  // System
  [ErrorCodes.INTERNAL_ERROR]: 'An internal error occurred',
  [ErrorCodes.UNEXPECTED_ERROR]: 'An unexpected error occurred',
  [ErrorCodes.TIMEOUT]: 'Request timed out',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ErrorCodes.MAINTENANCE_MODE]: 'System is under maintenance',
  [ErrorCodes.CONFIGURATION_ERROR]: 'Configuration error',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get HTTP status code for an error code
 */
export function getStatusForCode(code: ErrorCode): number {
  return ErrorCodeToStatus[code] ?? 500;
}

/**
 * Get default message for an error code
 */
export function getMessageForCode(code: ErrorCode): string {
  return ErrorMessages[code] ?? 'An error occurred';
}

/**
 * Check if error code is a client error (4xx)
 */
export function isClientError(code: ErrorCode): boolean {
  const status = getStatusForCode(code);
  return status >= 400 && status < 500;
}

/**
 * Check if error code is a server error (5xx)
 */
export function isServerError(code: ErrorCode): boolean {
  const status = getStatusForCode(code);
  return status >= 500;
}

/**
 * Check if error is retryable
 */
export function isRetryable(code: ErrorCode): boolean {
  const retryableCodes: ErrorCode[] = [
    ErrorCodes.TIMEOUT,
    ErrorCodes.SERVICE_UNAVAILABLE,
    ErrorCodes.LLM_TIMEOUT,
    ErrorCodes.LLM_RATE_LIMITED,
    ErrorCodes.RATE_LIMITED,
    ErrorCodes.DATABASE_ERROR,
    ErrorCodes.CACHE_ERROR,
  ];
  return retryableCodes.includes(code);
}
