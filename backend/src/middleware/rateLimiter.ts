/**
 * Middleware — Rate Limiter
 *
 * Express middleware for request processing pipeline.
 *
 * @exports rateLimiter, endpointRateLimiter, getRateLimitStatus, aiRateLimiter, deliberationRateLimiter, uploadRateLimiter
 * @module middleware/rateLimiter
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
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
import { redis } from '../config/redis.js';

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

// Redis-backed rate limit store — survives restarts and works across multiple instances
const REDIS_RL_PREFIX = 'rl:tier:';
const REDIS_BURST_PREFIX = 'rl:burst:';


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
 * Main rate limiter middleware — Redis-backed for multi-instance consistency (CC7.1)
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const tier = getUserTier(req);
  const baseKey = getRateLimitKey(req);
  const cfg = TIER_LIMITS[tier];
  const now = Date.now();

  const hourlyKey = `${REDIS_RL_PREFIX}${baseKey}`;
  const burstKey  = `${REDIS_BURST_PREFIX}${baseKey}`;

  // Redis pipeline: INCR + PEXPIRE for both windows atomically
  Promise.all([
    redis.multi()
      .incr(hourlyKey)
      .pexpire(hourlyKey, cfg.windowMs)
      .exec(),
    redis.multi()
      .incr(burstKey)
      .pexpire(burstKey, 60_000)
      .exec(),
  ]).then(([hourlyResults, burstResults]) => {
    const hourlyCount = (hourlyResults?.[0]?.[1] as number) ?? 1;
    const burstCount  = (burstResults?.[0]?.[1]  as number) ?? 1;

    if (burstCount > cfg.burstLimit) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Burst limit exceeded. Please slow down.',
        retryAfter: 60,
        tier,
        limit: cfg.burstLimit,
        window: '1 minute',
      });
      return;
    }

    if (cfg.maxRequests !== Infinity && hourlyCount > cfg.maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: cfg.message,
        retryAfter: Math.ceil(cfg.windowMs / 1000),
        tier,
        limit: cfg.maxRequests,
        remaining: 0,
      });
      return;
    }

    // Set informational headers
    res.setHeader('X-RateLimit-Tier', tier);
    res.setHeader('X-RateLimit-Limit', cfg.maxRequests === Infinity ? 'unlimited' : cfg.maxRequests);
    res.setHeader('X-RateLimit-Remaining', cfg.maxRequests === Infinity ? 'unlimited' : Math.max(0, cfg.maxRequests - hourlyCount));
    res.setHeader('X-RateLimit-Burst-Limit', cfg.burstLimit);
    res.setHeader('X-RateLimit-Burst-Remaining', Math.max(0, cfg.burstLimit - burstCount));

    next();
  }).catch(() => {
    // Redis unavailable — fail open with a warning (availability over security for tier limiting)
    next();
  });
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
 * Get current rate limit status for a user (async — reads from Redis)
 */
export async function getRateLimitStatus(userId: string): Promise<{
  tier: SubscriptionTier;
  hourlyLimit: number;
  hourlyUsed: number;
  hourlyRemaining: number;
}> {
  const tier: SubscriptionTier = 'foundation'; // Would be looked up from user record
  const cfg = TIER_LIMITS[tier];
  const raw = await redis.get(`${REDIS_RL_PREFIX}user:${userId}`);
  const used = raw ? parseInt(raw, 10) : 0;

  return {
    tier,
    hourlyLimit: cfg.maxRequests,
    hourlyUsed: used,
    hourlyRemaining: cfg.maxRequests === Infinity ? Infinity : Math.max(0, cfg.maxRequests - used),
  };
}

export default rateLimiter;
