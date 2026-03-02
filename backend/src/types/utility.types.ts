// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Utility Types for Type Safety
 * 
 * Common utility types to replace 'any' usage throughout the codebase
 */

// =============================================================================
// GENERIC UTILITY TYPES
// =============================================================================

/** Generic JSON-compatible value */
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

/** Generic JSON object */
export type JsonObject = Record<string, JsonValue>;

/** Unknown record for safe object handling */
export type UnknownRecord = Record<string, unknown>;

/** Nullable type helper */
export type Nullable<T> = T | null;

/** Optional type helper */
export type Optional<T> = T | undefined;

/** Maybe type (nullable and optional) */
export type Maybe<T> = T | null | undefined;

// =============================================================================
// PRISMA HELPERS
// =============================================================================

/** Prisma JSON field type (safer than 'any') */
export type PrismaJson = JsonValue;

/** Prisma where clause type */
export type PrismaWhere<T> = {
  [K in keyof T]?: T[K] | { equals?: T[K]; not?: T[K]; in?: T[K][] };
};

/** Prisma orderBy type */
export type PrismaOrderBy<T> = {
  [K in keyof T]?: 'asc' | 'desc';
};

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/** Standard API success response */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: UnknownRecord;
  };
}

/** Combined API response type */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// =============================================================================
// FUNCTION TYPES
// =============================================================================

/** Async function that returns a promise */
export type AsyncFunction<T = void> = () => Promise<T>;

/** Async function with arguments */
export type AsyncFunctionWithArgs<TArgs extends unknown[], TReturn = void> = 
  (...args: TArgs) => Promise<TReturn>;

/** Callback function type */
export type Callback<T = void> = (error: Error | null, result?: T) => void;

/** Event handler type */
export type EventHandler<T = Event> = (event: T) => void;

// =============================================================================
// DATABASE RECORD TYPES
// =============================================================================

/** Base database record with common fields */
export interface BaseRecord {
  id: string;
  created_at: Date;
  updated_at: Date;
}

/** Soft-deletable record */
export interface SoftDeletableRecord extends BaseRecord {
  deleted_at: Date | null;
}

/** Organization-scoped record */
export interface OrganizationRecord extends BaseRecord {
  organization_id: string;
}

// =============================================================================
// REQUEST/RESPONSE TYPES
// =============================================================================

/** Express request with typed body */
export interface TypedRequestBody<T> {
  body: T;
}

/** Express request with typed params */
export interface TypedRequestParams<T> {
  params: T;
}

/** Express request with typed query */
export interface TypedRequestQuery<T> {
  query: T;
}

/** Pagination query params */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Search query params */
export interface SearchParams extends PaginationParams {
  q?: string;
  search?: string;
  filter?: string;
}

// =============================================================================
// SERVICE TYPES
// =============================================================================

/** Service method options */
export interface ServiceOptions {
  userId?: string;
  organizationId?: string;
  skipValidation?: boolean;
  skipAudit?: boolean;
}

/** Batch operation result */
export interface BatchResult<T> {
  success: T[];
  failed: Array<{
    item: unknown;
    error: string;
  }>;
  total: number;
  successCount: number;
  failedCount: number;
}

// =============================================================================
// LLM TYPES
// =============================================================================

/** LLM generation options */
export interface LLMGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

/** LLM response */
export interface LLMResponse {
  content: string;
  model: string;
  tokenCount?: number;
  finishReason?: string;
  raw?: UnknownRecord;
}

/** Chat message */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/** Check if value is a non-null object */
export function isObject(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Check if value is a non-empty string */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Check if value is a valid number */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/** Check if value is a valid date */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/** Check if value is an array */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/** Safe JSON parse */
export function safeJsonParse<T = JsonValue>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Safe object access */
export function safeGet<T>(obj: UnknownRecord, path: string, fallback: T): T {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (!isObject(current) || !(key in current)) {
      return fallback;
    }
    current = (current as UnknownRecord)[key];
  }
  
  return current as T;
}
