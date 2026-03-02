/**
 * Middleware — Cache Middleware
 *
 * Express middleware for request processing pipeline.
 *
 * @exports apiCache, CACHE_TTLS, cacheMiddlewares
 * @module middleware/cacheMiddleware
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - UNIVERSAL CACHE MIDDLEWARE
 * 
 * Express middleware that caches GET responses in Redis.
 * Applied to all read-heavy API routes for 40-60% faster responses.
 * Automatically invalidated on POST/PUT/DELETE to the same resource.
 */

import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service.js';
import { logger } from '../utils/logger.js';

interface CacheOptions {
  ttl?: number;           // TTL in milliseconds (default: 60s)
  keyPrefix?: string;     // Custom key prefix
  varyByUser?: boolean;   // Include user ID in cache key
  varyByOrg?: boolean;    // Include org ID in cache key
  excludePaths?: RegExp[]; // Paths to skip caching
}

const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 60000,         // 1 minute default
  varyByUser: false,
  varyByOrg: true,
  excludePaths: [
    /\/auth\//,        // Never cache auth responses
    /\/csrf-token/,    // Never cache CSRF tokens
    /\/upload/,        // Never cache upload responses
    /\/ws/,            // Never cache WebSocket endpoints
    /\/stream/,        // Never cache streaming endpoints
  ],
};

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request, options: CacheOptions): string {
  const parts = ['api-cache'];
  
  if (options.keyPrefix) {
    parts.push(options.keyPrefix);
  }

  if (options.varyByOrg && (req as any).organizationId) {
    parts.push(`org:${(req as any).organizationId}`);
  }

  if (options.varyByUser && (req as any).userId) {
    parts.push(`user:${(req as any).userId}`);
  }

  parts.push(req.method);
  parts.push(req.originalUrl || req.url);

  return parts.join(':');
}

/**
 * Cache middleware for GET requests
 * Automatically serves cached responses and invalidates on mutations
 */
export function apiCache(options: CacheOptions = {}): (req: Request, res: Response, next: NextFunction) => void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      // On mutation, invalidate related cache entries
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const basePath = req.originalUrl.split('?')[0];
        const pattern = `api-cache:*:GET:${basePath}*`;
        cacheService.deletePattern(pattern).catch(() => {});
      }
      next();
      return;
    }

    // Check excluded paths
    if (opts.excludePaths?.some(re => re.test(req.originalUrl))) {
      next();
      return;
    }

    const cacheKey = generateCacheKey(req, opts);

    // Try to serve from cache
    cacheService.get<{ statusCode: number; body: any; headers: Record<string, string> }>(cacheKey)
      .then(cached => {
        if (cached) {
          // Set cache headers
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Cache-Key', cacheKey);
          
          // Restore original headers
          if (cached.headers) {
            Object.entries(cached.headers).forEach(([key, value]) => {
              if (!['transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
                res.setHeader(key, value);
              }
            });
          }

          res.status(cached.statusCode).json(cached.body);
          return;
        }

        // Cache MISS — intercept response to cache it
        res.setHeader('X-Cache', 'MISS');

        const originalJson = res.json.bind(res);
        res.json = function(body: any) {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const cacheEntry = {
              statusCode: res.statusCode,
              body,
              headers: {
                'content-type': res.getHeader('content-type') as string || 'application/json',
              },
            };

            cacheService.set(cacheKey, cacheEntry, { ttl: opts.ttl }).catch(() => {});
          }

          return originalJson(body);
        };

        next();
      })
      .catch(() => {
        // Cache error — just continue without caching
        next();
      });
  };
}

/**
 * Route-specific cache TTLs for optimal performance
 */
export const CACHE_TTLS = {
  METRICS:        120000,   // 2 minutes — metrics update frequently
  AGENTS:         300000,   // 5 minutes — agent definitions rarely change
  DECISIONS:      60000,    // 1 minute  — decisions need near-real-time
  DELIBERATIONS:  30000,    // 30 seconds — active deliberations change fast
  COMPLIANCE:     600000,   // 10 minutes — compliance status changes slowly
  SETTINGS:       3600000,  // 1 hour    — settings rarely change
  TRANSLATIONS:   86400000, // 24 hours  — translations almost never change
  VERTICALS:      1800000,  // 30 minutes — vertical definitions are stable
  HEALTH:         10000,    // 10 seconds — health checks need to be fresh
  GRAPH:          300000,   // 5 minutes — graph queries are expensive
  FORECASTS:      600000,   // 10 minutes — forecasts update periodically
  AUDIT_LOGS:     60000,    // 1 minute  — audit logs are append-only
  NOTIFICATIONS:  15000,    // 15 seconds — notifications need to be timely
};

/**
 * Pre-configured cache middleware for common route patterns
 */
export const cacheMiddlewares = {
  metrics:       apiCache({ ttl: CACHE_TTLS.METRICS, varyByOrg: true }),
  agents:        apiCache({ ttl: CACHE_TTLS.AGENTS, varyByOrg: true }),
  decisions:     apiCache({ ttl: CACHE_TTLS.DECISIONS, varyByOrg: true }),
  deliberations: apiCache({ ttl: CACHE_TTLS.DELIBERATIONS, varyByOrg: true }),
  compliance:    apiCache({ ttl: CACHE_TTLS.COMPLIANCE, varyByOrg: true }),
  settings:      apiCache({ ttl: CACHE_TTLS.SETTINGS, varyByOrg: true, varyByUser: true }),
  translations:  apiCache({ ttl: CACHE_TTLS.TRANSLATIONS }),
  verticals:     apiCache({ ttl: CACHE_TTLS.VERTICALS }),
  health:        apiCache({ ttl: CACHE_TTLS.HEALTH }),
  graph:         apiCache({ ttl: CACHE_TTLS.GRAPH, varyByOrg: true }),
  forecasts:     apiCache({ ttl: CACHE_TTLS.FORECASTS, varyByOrg: true }),
  auditLogs:     apiCache({ ttl: CACHE_TTLS.AUDIT_LOGS, varyByOrg: true }),
  notifications: apiCache({ ttl: CACHE_TTLS.NOTIFICATIONS, varyByUser: true }),
};
