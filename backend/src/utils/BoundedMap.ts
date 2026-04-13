// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * A Map with a maximum size limit and LRU eviction policy.
 * When the map exceeds maxSize, the oldest entries (by insertion/update order) are evicted.
 * Optionally supports TTL-based expiry.
 *
 * Drop-in replacement for Map<K, V> with bounded memory usage.
 */
export class BoundedMap<K, V> {
  private map = new Map<K, { value: V; expiresAt?: number }>();
  private readonly maxSize: number;
  private readonly ttlMs?: number;

  constructor(opts: { maxSize: number; ttlMs?: number }) {
    this.maxSize = opts.maxSize;
    this.ttlMs = opts.ttlMs;
  }

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    // Move to end (most recently used)
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key: K, value: V): this {
    // Delete first to reset insertion order
    this.map.delete(key);
    const expiresAt = this.ttlMs ? Date.now() + this.ttlMs : undefined;
    this.map.set(key, { value, expiresAt });
    this.evict();
    return this;
  }

  has(key: K): boolean {
    const entry = this.map.get(key);
    if (!entry) return false;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return false;
    }
    return true;
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }

  values(): IterableIterator<V> {
    const self = this;
    return (function* () {
      for (const [key, entry] of self.map) {
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          self.map.delete(key);
          continue;
        }
        yield entry.value;
      }
    })();
  }

  keys(): IterableIterator<K> {
    return this.map.keys();
  }

  entries(): IterableIterator<[K, V]> {
    const self = this;
    return (function* () {
      for (const [key, entry] of self.map) {
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          self.map.delete(key);
          continue;
        }
        yield [key, entry.value] as [K, V];
      }
    })();
  }

  forEach(callbackfn: (value: V, key: K, map: BoundedMap<K, V>) => void): void {
    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  readonly [Symbol.toStringTag] = 'BoundedMap';

  private evict(): void {
    while (this.map.size > this.maxSize) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) {
        this.map.delete(oldest);
      } else {
        break;
      }
    }
  }
}
