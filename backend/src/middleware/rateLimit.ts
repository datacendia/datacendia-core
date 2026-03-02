/**
 * Middleware — Rate Limit
 *
 * Express middleware for request processing pipeline.
 * @module middleware/rateLimit
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Rate Limiting Middleware — Re-export shim
 *
 * CONSOLIDATED: All rate-limiting logic lives in ./rateLimiter.ts.
 * This file re-exports everything so existing imports keep working.
 */

export {
  rateLimiter,
  rateLimiter as default,
  endpointRateLimiter,
  aiRateLimiter,
  deliberationRateLimiter,
  uploadRateLimiter,
  getRateLimitStatus,
} from './rateLimiter.js';

// Convenience aliases matching the old preset names
export {
  endpointRateLimiter as rateLimit,
} from './rateLimiter.js';
