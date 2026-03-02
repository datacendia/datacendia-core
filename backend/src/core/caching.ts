// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Caching Utilities for High-Traffic Services
 * 
 * Provides consistent caching patterns across the application.
 */

import { cache, redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

export const CacheTTL = {
  /** Short-lived cache for frequently changing data (1 minute) */
  SHORT: 60,
  /** Medium cache for semi-static data (5 minutes) */
  MEDIUM: 300,
  /** Long cache for rarely changing data (30 minutes) */
  LONG: 1800,
  /** Extended cache for static data (2 hours) */
  EXTENDED: 7200,
  /** Daily cache for reference data (24 hours) */
  DAILY: 86400,
} as const;

export const CachePrefix = {
  AGENT: 'agent:',
  AGENTS_LIST: 'agents:list:',
  DELIBERATION: 'deliberation:',
  USER: 'user:',
  ORG: 'org:',
  METRICS: 'metrics:',
  DASHBOARD: 'dashboard:',
  GRAPH: 'graph:',
  FRAMEWORK: 'framework:',
  CONFIG: 'config:',
  SESSION: 'session:',
} as const;

// =============================================================================
// CACHE FUNCTIONS
// =============================================================================

/**
 * Get a value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    return await cache.get<T>(key);
  } catch (error) {
    logger.warn('Cache get failed:', { key, error });
    return null;
  }
}

/**
 * Set a value in cache
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = CacheTTL.MEDIUM
): Promise<boolean> {
  try {
    await cache.set(key, value, ttlSeconds);
    return true;
  } catch (error) {
    logger.warn('Cache set failed:', { key, error });
    return false;
  }
}

/**
 * Delete a value from cache
 */
export async function cacheDelete(key: string): Promise<boolean> {
  try {
    await cache.del(key);
    return true;
  } catch (error) {
    logger.warn('Cache delete failed:', { key, error });
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function cacheDeletePattern(pattern: string): Promise<number> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      return keys.length;
    }
    return 0;
  } catch (error) {
    logger.warn('Cache delete pattern failed:', { pattern, error });
    return 0;
  }
}

/**
 * Get or set a value in cache (cache-aside pattern)
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache (fire and forget)
  cacheSet(key, data, ttlSeconds).catch(() => {});
  
  return data;
}

/**
 * Invalidate cache entries when data changes
 */
export async function invalidateCache(
  ...keys: string[]
): Promise<void> {
  await Promise.all(keys.map(key => cacheDelete(key)));
}

// =============================================================================
// CACHE KEY BUILDERS
// =============================================================================

export const CacheKeys = {
  agent: (id: string) => `${CachePrefix.AGENT}${id}`,
  agentsList: (orgId: string) => `${CachePrefix.AGENTS_LIST}${orgId}`,
  deliberation: (id: string) => `${CachePrefix.DELIBERATION}${id}`,
  user: (id: string) => `${CachePrefix.USER}${id}`,
  organization: (id: string) => `${CachePrefix.ORG}${id}`,
  metrics: (orgId: string, category?: string) => 
    `${CachePrefix.METRICS}${orgId}:${category || 'all'}`,
  dashboard: (orgId: string) => `${CachePrefix.DASHBOARD}${orgId}`,
  graphStats: (orgId: string) => `${CachePrefix.GRAPH}stats:${orgId}`,
  framework: (code: string) => `${CachePrefix.FRAMEWORK}${code}`,
  orgConfig: (orgId: string) => `${CachePrefix.CONFIG}org:${orgId}`,
  session: (userId: string) => `${CachePrefix.SESSION}${userId}`,
};

// =============================================================================
// CACHE DECORATORS (for class methods)
// =============================================================================

/**
 * Method decorator for caching results
 * Usage: @cached('prefix', ttl)
 */
export function cached(keyPrefix: string, ttlSeconds: number = CacheTTL.MEDIUM) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = `${keyPrefix}:${propertyKey}:${JSON.stringify(args)}`;
      
      // Try cache first
      const cachedResult = await cacheGet(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Call original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cacheSet(cacheKey, result, ttlSeconds);
      
      return result;
    };

    return descriptor;
  };
}

// =============================================================================
// BATCH CACHING
// =============================================================================

/**
 * Get multiple values from cache
 */
export async function cacheGetMany<T>(keys: string[]): Promise<Map<string, T>> {
  const results = new Map<string, T>();
  
  if (keys.length === 0) return results;

  try {
    const values = await redis.mget(keys);
    
    keys.forEach((key, index) => {
      const value = values[index];
      if (value) {
        try {
          results.set(key, JSON.parse(value) as T);
        } catch {
          // Skip invalid JSON
        }
      }
    });
  } catch (error) {
    logger.warn('Cache mget failed:', { error });
  }

  return results;
}

/**
 * Set multiple values in cache
 */
export async function cacheSetMany<T>(
  entries: Array<{ key: string; value: T; ttl?: number }>
): Promise<void> {
  if (entries.length === 0) return;

  try {
    // Use Promise.all with individual sets since pipeline may not be available
    await Promise.all(
      entries.map(entry => 
        cache.set(entry.key, entry.value, entry.ttl ?? CacheTTL.MEDIUM)
      )
    );
  } catch (error) {
    logger.warn('Cache mset failed:', { error });
  }
}

// =============================================================================
// CACHE STATISTICS
// =============================================================================

/**
 * Get cache statistics for monitoring
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keyCount: number;
  memoryUsage: string;
  hitRate?: number;
}> {
  try {
    const info = await redis.info('memory');
    const keyCount = await redis.dbsize();
    
    // Parse memory usage from info string
    const memoryMatch = info.match(/used_memory_human:(\S+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1] : 'unknown';

    return {
      connected: true,
      keyCount,
      memoryUsage,
    };
  } catch {
    return {
      connected: false,
      keyCount: 0,
      memoryUsage: 'unknown',
    };
  }
}

// =============================================================================
// CACHE WARMING
// =============================================================================

/**
 * Warm cache with frequently accessed data
 */
export async function warmCache(
  orgId: string,
  warmFunctions: Array<{
    key: string;
    fetch: () => Promise<unknown>;
    ttl: number;
  }>
): Promise<void> {
  logger.info(`Warming cache for org ${orgId}`);
  
  await Promise.all(
    warmFunctions.map(async ({ key, fetch, ttl }) => {
      try {
        const data = await fetch();
        await cacheSet(key, data, ttl);
        logger.debug(`Warmed cache key: ${key}`);
      } catch (error) {
        logger.warn(`Failed to warm cache key: ${key}`, { error });
      }
    })
  );
}

export default {
  get: cacheGet,
  set: cacheSet,
  delete: cacheDelete,
  deletePattern: cacheDeletePattern,
  getOrSet: cacheGetOrSet,
  invalidate: invalidateCache,
  keys: CacheKeys,
  ttl: CacheTTL,
  prefix: CachePrefix,
  getMany: cacheGetMany,
  setMany: cacheSetMany,
  getStats: getCacheStats,
  warmCache,
};
