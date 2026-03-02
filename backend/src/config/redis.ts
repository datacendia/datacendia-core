// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import Redis from 'ioredis';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('connect', () => {
  logger.info('Redis client connected');
});

redis.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redis.on('close', () => {
  logger.warn('Redis client connection closed');
});

// Cache helper functions
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  async incr(key: string): Promise<number> {
    return redis.incr(key);
  },

  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  },
};

// Pub/Sub for real-time events
const pubsubSubscriber = new Redis(config.redisUrl);
const pubsubPublisher = new Redis(config.redisUrl);

pubsubSubscriber.on('connect', () => {
  logger.info('Redis pubsub subscriber connected');
});

pubsubSubscriber.on('error', (err) => {
  logger.error('Redis pubsub subscriber error:', err);
});

pubsubSubscriber.on('close', () => {
  logger.warn('Redis pubsub subscriber connection closed');
});

pubsubPublisher.on('connect', () => {
  logger.info('Redis pubsub publisher connected');
});

pubsubPublisher.on('error', (err) => {
  logger.error('Redis pubsub publisher error:', err);
});

pubsubPublisher.on('close', () => {
  logger.warn('Redis pubsub publisher connection closed');
});

export const pubsub = {
  subscriber: pubsubSubscriber,
  publisher: pubsubPublisher,

  async publish(channel: string, message: unknown): Promise<void> {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    await this.publisher.publish(channel, payload);
  },

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  },

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  },
};

export default redis;
