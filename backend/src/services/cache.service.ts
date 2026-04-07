// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// IN-MEMORY CACHE SERVICE (Community Edition)
// Production deployments should use Redis via REDIS_URL env var.
// This in-memory fallback provides correct cache semantics when Redis
// is unavailable, with automatic TTL expiration and LRU-style eviction.
// =============================================================================

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const MAX_ENTRIES = 10_000;
const store = new Map<string, CacheEntry>();

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

export const cacheService = {
  async get(key: string): Promise<any | null> {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: any, ttlOrOpts: number | { ttl?: number } = 60_000): Promise<void> {
    const ttlMs = typeof ttlOrOpts === 'number' ? ttlOrOpts : (ttlOrOpts.ttl || 60_000);
    if (store.size >= MAX_ENTRIES) evictExpired();
    if (store.size >= MAX_ENTRIES) {
      // LRU-style: delete oldest entry
      const oldest = store.keys().next().value;
      if (oldest) store.delete(oldest);
    }
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  },

  async del(key: string): Promise<void> {
    store.delete(key);
  },

  async delByPrefix(prefix: string): Promise<number> {
    let count = 0;
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) {
        store.delete(key);
        count++;
      }
    }
    return count;
  },

  async flush(): Promise<void> {
    store.clear();
  },

  async keys(pattern?: string): Promise<string[]> {
    if (!pattern) return [...store.keys()];
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return [...store.keys()].filter(k => regex.test(k));
  },

  async deletePattern(pattern: string): Promise<number> {
    const prefix = pattern.replace(/\*/g, '');
    return this.delByPrefix(prefix);
  },

  async stats(): Promise<{ size: number; maxEntries: number }> {
    evictExpired();
    return { size: store.size, maxEntries: MAX_ENTRIES };
  },
};
