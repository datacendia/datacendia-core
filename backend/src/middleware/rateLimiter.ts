// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Rate Limiting Middleware for Datacendia API
 * 
 * 3-Tier Architecture rate limits:
 * - Pilot:       1,000 requests/hour
 * - Foundation:  10,000 requests/hour
 * - Enterprise:  100,000 requests/hour
 * - Strategic:   Unlimited (fair use policy)
 * - Custom:      Unlimited (fair use policy)
 */

import { Request, Response, NextFunction } from 'express';
import type { SubscriptionTier } from '../core/subscriptions/SubscriptionTiers.js';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  burstLimit: number;
  message: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
  burstCount: number;
  burstResetAt: number;
}

const TIER_LIMITS: Record<SubscriptionTier, RateLimitConfig> = {
  pilot: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
    burstLimit: 20,
    message: 'Rate limit exceeded. Upgrade to Foundation for higher limits.',
  },
  foundation: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 10000,
    burstLimit: 100,
    message: 'Rate limit exceeded. Upgrade to Enterprise for higher limits.',
  },
  enterprise: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 100000,
    burstLimit: 500,
    message: 'Rate limit exceeded. Contact support for limit increase.',
  },
  strategic: {
    windowMs: 60 * 60 * 1000,
    maxRequests: Infinity,
    burstLimit: 1000,
    message: 'Burst limit exceeded. Please reduce request frequency.',
  },
  custom: {
    windowMs: 60 * 60 * 1000,
    maxRequests: Infinity,
    burstLimit: 1000,
    message: 'Burst limit exceeded. Please reduce request frequency.',
  },
};

// In-memory store; production upgrade: use Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now && entry.burstResetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get user's subscription tier from request
 */
function getUserTier(req: Request): SubscriptionTier {
  // Production upgrade: extract from JWT token or database
  const user = (req as any).user;
  return user?.tier || 'pilot';
}

/**
 * Get rate limit key (user ID or IP for anonymous)
 */
function getRateLimitKey(req: Request): string {
  const user = (req as any).user;
  if (user?.id) {
    return `user:${user.id}`;
  }
  // Fallback to IP for anonymous requests
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return `ip:${ip}`;
}

/**
 * Main rate limiter middleware
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const tier = getUserTier(req);
  const key = getRateLimitKey(req);
  const config = TIER_LIMITS[tier];
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
      burstCount: 0,
      burstResetAt: now + 60000, // 1 minute burst window
    };
  }

  // Reset burst counter if window passed
  if (entry.burstResetAt < now) {
    entry.burstCount = 0;
    entry.burstResetAt = now + 60000;
  }

  // Check burst limit
  if (entry.burstCount >= config.burstLimit) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Burst limit exceeded. Please slow down.',
      retryAfter: Math.ceil((entry.burstResetAt - now) / 1000),
      tier,
      limit: config.burstLimit,
      window: '1 minute',
    });
    return;
  }

  // Check hourly limit
  if (entry.count >= config.maxRequests) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: config.message,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      tier,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: new Date(entry.resetAt).toISOString(),
    });
    return;
  }

  // Increment counters
  entry.count++;
  entry.burstCount++;
  rateLimitStore.set(key, entry);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Tier', tier);
  res.setHeader('X-RateLimit-Limit', config.maxRequests === Infinity ? 'unlimited' : config.maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));
  res.setHeader('X-RateLimit-Burst-Limit', config.burstLimit);
  res.setHeader('X-RateLimit-Burst-Remaining', Math.max(0, config.burstLimit - entry.burstCount));

  next();
}

/**
 * Endpoint-specific rate limiter for expensive operations
 */
export function endpointRateLimiter(
  maxRequests: number,
  windowMs: number = 60000
) {
  const endpointStore = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${getRateLimitKey(req)}:${req.path}`;
    const now = Date.now();

    let entry = endpointStore.get(key);
    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs };
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: `This endpoint is limited to ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
      return;
    }

    entry.count++;
    endpointStore.set(key, entry);
    next();
  };
}

/**
 * Rate limiter for AI/LLM operations (more restrictive)
 */
export const aiRateLimiter = endpointRateLimiter(10, 60000); // 10 AI calls per minute

/**
 * Rate limiter for deliberation starts
 */
export const deliberationRateLimiter = endpointRateLimiter(5, 60000); // 5 deliberations per minute

/**
 * Rate limiter for file uploads
 */
export const uploadRateLimiter = endpointRateLimiter(20, 60000); // 20 uploads per minute

/**
 * Get current rate limit status for a user
 */
export function getRateLimitStatus(userId: string): {
  tier: SubscriptionTier;
  hourlyLimit: number;
  hourlyUsed: number;
  hourlyRemaining: number;
  resetAt: Date | null;
} {
  const key = `user:${userId}`;
  const entry = rateLimitStore.get(key);
  const tier: SubscriptionTier = 'foundation'; // Would be looked up from user record
  const config = TIER_LIMITS[tier];

  return {
    tier,
    hourlyLimit: config.maxRequests,
    hourlyUsed: entry?.count || 0,
    hourlyRemaining: Math.max(0, config.maxRequests - (entry?.count || 0)),
    resetAt: entry ? new Date(entry.resetAt) : null,
  };
}

export default rateLimiter;
