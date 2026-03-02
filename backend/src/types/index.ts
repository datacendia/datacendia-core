/**
 * Type Definitions — Index
 *
 * TypeScript type definitions and interfaces.
 * @module types/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Central type exports for the backend
 */

// Prisma JSON field types
export * from './prisma-json.types.js';

// Utility types (safer alternatives to 'any')
export * from './utility.types.js';

// Re-export types from files that exist
export type { Result, ServiceError, ServiceErrorCode } from '../services/core/BaseService.js';
