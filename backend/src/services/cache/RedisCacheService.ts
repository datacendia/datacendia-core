// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * REDIS CACHE SERVICE - Enterprise Caching Layer
 * =============================================================================
 * Provides caching for frequently accessed data
 */

import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

export class RedisCacheService {
  private defaultTTL = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      if (!cached) return null;
      return JSON.parse(cached) as T;
    } catch (error) {
      logger.warn(`Redis get failed for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, serialized);
      } else {
        await redis.setex(key, this.defaultTTL, serialized);
      }
      return true;
    } catch (error) {
      logger.warn(`Redis set failed for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.warn(`Redis del failed for key ${key}:`, error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      await redis.del(...keys);
      return keys.length;
    } catch (error) {
      logger.warn(`Redis invalidate pattern failed for ${pattern}:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.warn(`Redis exists failed for key ${key}:`, error);
      return false;
    }
  }
}

export const cacheService = new RedisCacheService();
