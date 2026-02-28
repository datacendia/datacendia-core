// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LLM Response Cache
 * Caches AI responses to save cost and speed up repeated queries
 */

import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry {
  queryHash: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  response: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  temperature: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  byModel: Record<string, number>;
  avgLatencySaved: number;
}

// ============================================================================
// CACHE SERVICE
// ============================================================================

export class LLMCacheService {
  private ttlHours: number = 24; // Default cache TTL

  /**
   * Generate cache key from prompt parameters
   */
  generateKey(prompt: string, model: string, systemPrompt?: string, temperature: number = 0.7): string {
    const input = `${prompt}|${model}|${systemPrompt || ''}|${temperature}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Get cached response
   */
  async get(key: string): Promise<string | null> {
    try {
      const entry = await prisma.llm_cache.findUnique({
        where: { query_hash: key },
      });

      if (!entry) return null;

      // Check if expired
      if (entry.expires_at < new Date()) {
        await this.delete(key);
        return null;
      }

      // Update hit count and last accessed
      await prisma.llm_cache.update({
        where: { query_hash: key },
        data: {
          hit_count: { increment: 1 },
          last_accessed_at: new Date(),
        },
      });

      return entry.response;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store response in cache
   */
  async set(entry: CacheEntry): Promise<void> {
    const expiresAt = new Date(Date.now() + this.ttlHours * 60 * 60 * 1000);

    try {
      await prisma.llm_cache.upsert({
        where: { query_hash: entry.queryHash },
        update: {
          response: entry.response,
          tokens_in: entry.tokensIn,
          tokens_out: entry.tokensOut,
          latency_ms: entry.latencyMs,
          hit_count: { increment: 1 },
          last_accessed_at: new Date(),
          expires_at: expiresAt,
        },
        create: {
          id: crypto.randomUUID(),
          query_hash: entry.queryHash,
          model: entry.model,
          prompt: entry.prompt,
          system_prompt: entry.systemPrompt,
          response: entry.response,
          tokens_in: entry.tokensIn,
          tokens_out: entry.tokensOut,
          latency_ms: entry.latencyMs,
          temperature: entry.temperature,
          expires_at: expiresAt,
        },
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached entry
   */
  async delete(key: string): Promise<void> {
    try {
      await prisma.llm_cache.delete({
        where: { query_hash: key },
      });
    } catch (error) {
      // Entry may not exist
    }
  }

  /**
   * Clear expired entries
   */
  async clearExpired(): Promise<number> {
    const result = await prisma.llm_cache.deleteMany({
      where: {
        expires_at: { lt: new Date() },
      },
    });
    return result.count;
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<number> {
    const result = await prisma.llm_cache.deleteMany({});
    return result.count;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const entries = await prisma.llm_cache.findMany({
      select: {
        model: true,
        hit_count: true,
        latency_ms: true,
      },
    });

    const totalEntries = entries.length;
    const totalHits = entries.reduce((sum: number, e: { hit_count: number }) => sum + e.hit_count, 0);
    const avgLatency = entries.length > 0
      ? entries.reduce((sum: number, e: { latency_ms: number }) => sum + e.latency_ms, 0) / entries.length
      : 0;

    const byModel: Record<string, number> = {};
    for (const entry of entries) {
      byModel[entry.model] = (byModel[entry.model] || 0) + 1;
    }

    return {
      totalEntries,
      hitRate: totalEntries > 0 ? (totalHits - totalEntries) / totalHits : 0,
      totalHits,
      byModel,
      avgLatencySaved: avgLatency,
    };
  }

  /**
   * Set cache TTL in hours
   */
  setTTL(hours: number): void {
    this.ttlHours = hours;
  }
}

export const llmCache = new LLMCacheService();
