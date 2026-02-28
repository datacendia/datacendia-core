// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaVector™ — Enterprise Vector Database Service
 * 
 * Enterprise Platinum Standard: Production-grade vector search with Qdrant
 * 
 * Capabilities:
 * - Multi-collection management (decisions, agent_memory, evidence, documents)
 * - Automatic embedding generation via Ollama (qwen3-embedding:4b)
 * - Batch indexing with configurable parallelism
 * - Collection lifecycle management (create, optimize, snapshot)
 * - Health monitoring and graceful degradation
 * - Tenant isolation via payload filtering (organizationId)
 * - Embedding cache to avoid redundant Ollama calls
 * - Hybrid search (vector + payload filters)
 * 
 * Integration Points:
 * - DecisionSimilarityService: Replaces TF-IDF with neural embeddings
 * - CendiaMemory™ / Pantheon: Institutional memory retrieval
 * - Council agents: Context-aware agent memory
 * - Evidence Vault: Semantic evidence search
 */

import { logger } from '../../utils/logger.js';
import { ollama } from '../ollama.js';

// =============================================================================
// TYPES
// =============================================================================

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  payload: Record<string, unknown>;
}

export interface CollectionConfig {
  name: string;
  vectorSize: number;
  distance: 'Cosine' | 'Euclid' | 'Dot';
  onDiskPayload?: boolean;
  optimizersConfig?: {
    indexingThreshold?: number;
    memmapThreshold?: number;
  };
}

export interface SearchFilter {
  must?: FilterCondition[];
  must_not?: FilterCondition[];
  should?: FilterCondition[];
}

export interface FilterCondition {
  key: string;
  match?: { value: string | number | boolean };
  range?: { gte?: number; lte?: number; gt?: number; lt?: number };
}

export interface CollectionInfo {
  name: string;
  vectorsCount: number;
  pointsCount: number;
  status: string;
  optimizerStatus: string;
}

export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export type VectorCollectionName = 
  | 'decisions'
  | 'agent_memory'
  | 'evidence'
  | 'documents'
  | 'deliberation_messages';

// =============================================================================
// DEFAULT COLLECTIONS
// =============================================================================

const DEFAULT_COLLECTIONS: CollectionConfig[] = [
  {
    name: 'decisions',
    vectorSize: 2560, // qwen3-embedding:4b default dimension
    distance: 'Cosine',
    onDiskPayload: true,
    optimizersConfig: { indexingThreshold: 20000 },
  },
  {
    name: 'agent_memory',
    vectorSize: 2560,
    distance: 'Cosine',
    onDiskPayload: false,
  },
  {
    name: 'evidence',
    vectorSize: 2560,
    distance: 'Cosine',
    onDiskPayload: true,
    optimizersConfig: { indexingThreshold: 50000 },
  },
  {
    name: 'documents',
    vectorSize: 2560,
    distance: 'Cosine',
    onDiskPayload: true,
  },
  {
    name: 'deliberation_messages',
    vectorSize: 2560,
    distance: 'Cosine',
    onDiskPayload: true,
    optimizersConfig: { indexingThreshold: 100000 },
  },
];

// =============================================================================
// EMBEDDING CACHE
// =============================================================================

interface CachedEmbedding {
  vector: number[];
  createdAt: number;
  model: string;
}

class EmbeddingCache {
  private cache = new Map<string, CachedEmbedding>();
  private maxSize: number;
  private ttlMs: number;

  constructor(maxSize = 10000, ttlMs = 3600000) { // 1 hour TTL
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  private makeKey(text: string, model: string): string {
    // Simple hash for cache key — good enough for dedup
    let hash = 0;
    const str = `${model}:${text}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(36);
  }

  get(text: string, model: string): number[] | null {
    const key = this.makeKey(text, model);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.vector;
  }

  set(text: string, model: string, vector: number[]): void {
    if (this.cache.size >= this.maxSize) {
      // Evict oldest 10%
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].createdAt - b[1].createdAt);
      const evictCount = Math.floor(this.maxSize * 0.1);
      for (let i = 0; i < evictCount; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
    const key = this.makeKey(text, model);
    this.cache.set(key, { vector, createdAt: Date.now(), model });
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// =============================================================================
// SERVICE
// =============================================================================

class VectorDBService {
  private baseUrl: string;
  private embeddingModel: string;
  private embeddingCache: EmbeddingCache;
  private initialized = false;
  private available = false;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.baseUrl = process.env['QDRANT_URL'] || 'http://localhost:6333';
    this.embeddingModel = process.env['EMBEDDING_MODEL'] || 'qwen3-embedding:4b';
    this.embeddingCache = new EmbeddingCache();
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------------

  async initialize(): Promise<boolean> {
    if (this.initialized) return this.available;

    try {
      // Check Qdrant connectivity
      const health = await this.healthCheck();
      if (!health) {
        logger.warn('[CendiaVector] Qdrant not available — vector search disabled, falling back to TF-IDF');
        this.available = false;
        this.initialized = true;
        return false;
      }

      // Ensure all default collections exist
      for (const collectionCfg of DEFAULT_COLLECTIONS) {
        await this.ensureCollection(collectionCfg);
      }

      this.available = true;
      this.initialized = true;

      // Start health monitoring (every 60s)
      this.healthCheckInterval = setInterval(async () => {
        const ok = await this.healthCheck();
        if (this.available && !ok) {
          logger.error('[CendiaVector] Qdrant connection lost — degrading to TF-IDF');
          this.available = false;
        } else if (!this.available && ok) {
          logger.info('[CendiaVector] Qdrant connection restored');
          this.available = true;
        }
      }, 60000);

      logger.info(`[CendiaVector] Initialized — ${DEFAULT_COLLECTIONS.length} collections ready`);
      return true;
    } catch (error) {
      logger.warn('[CendiaVector] Initialization failed — vector search disabled:', error);
      this.available = false;
      this.initialized = true;
      return false;
    }
  }

  async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.embeddingCache.clear();
    this.initialized = false;
    this.available = false;
    logger.info('[CendiaVector] Shutdown complete');
  }

  isAvailable(): boolean {
    return this.available;
  }

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // COLLECTION MANAGEMENT
  // ---------------------------------------------------------------------------

  private async ensureCollection(config: CollectionConfig): Promise<void> {
    try {
      // Check if collection exists
      const response = await fetch(`${this.baseUrl}/collections/${config.name}`, {
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        logger.debug(`[CendiaVector] Collection '${config.name}' already exists`);
        return;
      }

      if (response.status === 404) {
        // Create collection
        const createResponse = await fetch(`${this.baseUrl}/collections/${config.name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vectors: {
              size: config.vectorSize,
              distance: config.distance,
              on_disk: config.onDiskPayload || false,
            },
            optimizers_config: config.optimizersConfig ? {
              indexing_threshold: config.optimizersConfig.indexingThreshold,
              memmap_threshold: config.optimizersConfig.memmapThreshold,
            } : undefined,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create collection '${config.name}': ${errorText}`);
        }

        logger.info(`[CendiaVector] Collection '${config.name}' created (${config.vectorSize}d, ${config.distance})`);
      }
    } catch (error) {
      logger.error(`[CendiaVector] Collection '${config.name}' setup failed:`, error);
      throw error;
    }
  }

  async getCollectionInfo(name: VectorCollectionName): Promise<CollectionInfo | null> {
    if (!this.available) return null;

    try {
      const response = await fetch(`${this.baseUrl}/collections/${name}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return null;

      const data = await response.json() as any;
      return {
        name,
        vectorsCount: data.result?.vectors_count ?? 0,
        pointsCount: data.result?.points_count ?? 0,
        status: data.result?.status ?? 'unknown',
        optimizerStatus: data.result?.optimizer_status?.status ?? 'unknown',
      };
    } catch {
      return null;
    }
  }

  async getAllCollectionStats(): Promise<CollectionInfo[]> {
    const stats: CollectionInfo[] = [];
    for (const col of DEFAULT_COLLECTIONS) {
      const info = await this.getCollectionInfo(col.name as VectorCollectionName);
      if (info) stats.push(info);
    }
    return stats;
  }

  // ---------------------------------------------------------------------------
  // EMBEDDING GENERATION
  // ---------------------------------------------------------------------------

  async embed(text: string, model?: string): Promise<number[]> {
    const embModel = model || this.embeddingModel;

    // Check cache first
    const cached = this.embeddingCache.get(text, embModel);
    if (cached) return cached;

    // Generate via Ollama
    const vector = await ollama.embed(text, embModel);

    // Cache the result
    this.embeddingCache.set(text, embModel, vector);

    return vector;
  }

  async embedBatch(texts: string[], model?: string, concurrency = 5): Promise<number[][]> {
    const results: number[][] = [];

    // Process in batches for controlled parallelism
    for (let i = 0; i < texts.length; i += concurrency) {
      const batch = texts.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(text => this.embed(text, model))
      );
      results.push(...batchResults);
    }

    return results;
  }

  // ---------------------------------------------------------------------------
  // POINT OPERATIONS (CRUD)
  // ---------------------------------------------------------------------------

  async upsertPoint(
    collection: VectorCollectionName,
    id: string,
    text: string,
    payload: Record<string, unknown>,
    model?: string
  ): Promise<boolean> {
    if (!this.available) {
      logger.debug(`[CendiaVector] Skipping upsert — Qdrant unavailable`);
      return false;
    }

    try {
      const vector = await this.embed(text, model);
      return await this.upsertPointRaw(collection, id, vector, payload);
    } catch (error) {
      logger.error(`[CendiaVector] Upsert failed for ${collection}/${id}:`, error);
      return false;
    }
  }

  async upsertPointRaw(
    collection: VectorCollectionName,
    id: string,
    vector: number[],
    payload: Record<string, unknown>
  ): Promise<boolean> {
    if (!this.available) return false;

    try {
      const response = await fetch(`${this.baseUrl}/collections/${collection}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: [{
            id,
            vector,
            payload: {
              ...payload,
              _indexed_at: new Date().toISOString(),
            },
          }],
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Qdrant upsert failed: ${response.status} — ${errorText}`);
      }

      return true;
    } catch (error) {
      logger.error(`[CendiaVector] Raw upsert failed:`, error);
      return false;
    }
  }

  async upsertBatch(
    collection: VectorCollectionName,
    points: { id: string; text: string; payload: Record<string, unknown> }[],
    model?: string,
    batchSize = 100
  ): Promise<{ indexed: number; failed: number }> {
    if (!this.available) return { indexed: 0, failed: points.length };

    let indexed = 0;
    let failed = 0;

    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);

      try {
        // Generate embeddings for batch
        const vectors = await this.embedBatch(
          batch.map(p => p.text),
          model
        );

        // Build Qdrant points
        const qdrantPoints = batch.map((p, idx) => ({
          id: p.id,
          vector: vectors[idx],
          payload: {
            ...p.payload,
            _indexed_at: new Date().toISOString(),
          },
        }));

        const response = await fetch(`${this.baseUrl}/collections/${collection}/points`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: qdrantPoints }),
          signal: AbortSignal.timeout(60000),
        });

        if (response.ok) {
          indexed += batch.length;
        } else {
          failed += batch.length;
          const errorText = await response.text();
          logger.error(`[CendiaVector] Batch upsert failed: ${errorText}`);
        }
      } catch (error) {
        failed += batch.length;
        logger.error(`[CendiaVector] Batch upsert error:`, error);
      }

      // Progress logging for large batches
      if (points.length > batchSize) {
        logger.info(`[CendiaVector] Indexing progress: ${Math.min(i + batchSize, points.length)}/${points.length}`);
      }
    }

    return { indexed, failed };
  }

  async deletePoint(collection: VectorCollectionName, id: string): Promise<boolean> {
    if (!this.available) return false;

    try {
      const response = await fetch(`${this.baseUrl}/collections/${collection}/points/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: [id] }),
        signal: AbortSignal.timeout(10000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async deleteByFilter(collection: VectorCollectionName, filter: SearchFilter): Promise<boolean> {
    if (!this.available) return false;

    try {
      const response = await fetch(`${this.baseUrl}/collections/${collection}/points/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: this.buildQdrantFilter(filter),
        }),
        signal: AbortSignal.timeout(30000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  async search(
    collection: VectorCollectionName,
    queryText: string,
    limit = 10,
    filter?: SearchFilter,
    scoreThreshold?: number,
    model?: string
  ): Promise<VectorSearchResult[]> {
    if (!this.available) {
      logger.debug(`[CendiaVector] Search unavailable — Qdrant offline`);
      return [];
    }

    try {
      const queryVector = await this.embed(queryText, model);
      return await this.searchRaw(collection, queryVector, limit, filter, scoreThreshold);
    } catch (error) {
      logger.error(`[CendiaVector] Search failed:`, error);
      return [];
    }
  }

  async searchRaw(
    collection: VectorCollectionName,
    queryVector: number[],
    limit = 10,
    filter?: SearchFilter,
    scoreThreshold?: number
  ): Promise<VectorSearchResult[]> {
    if (!this.available) return [];

    try {
      const body: Record<string, unknown> = {
        vector: queryVector,
        limit,
        with_payload: true,
      };

      if (filter) {
        body.filter = this.buildQdrantFilter(filter);
      }

      if (scoreThreshold !== undefined) {
        body.score_threshold = scoreThreshold;
      }

      const response = await fetch(`${this.baseUrl}/collections/${collection}/points/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Qdrant search failed: ${response.status} — ${errorText}`);
      }

      const data = await response.json() as any;
      const results: VectorSearchResult[] = (data.result || []).map((hit: any) => ({
        id: String(hit.id),
        score: hit.score,
        payload: hit.payload || {},
      }));

      return results;
    } catch (error) {
      logger.error(`[CendiaVector] Raw search failed:`, error);
      return [];
    }
  }

  /**
   * Search with automatic organization-level tenant isolation
   */
  async searchForOrganization(
    collection: VectorCollectionName,
    queryText: string,
    organizationId: string,
    limit = 10,
    additionalFilter?: SearchFilter,
    scoreThreshold?: number
  ): Promise<VectorSearchResult[]> {
    const orgFilter: SearchFilter = {
      must: [
        { key: 'organizationId', match: { value: organizationId } },
        ...(additionalFilter?.must || []),
      ],
      must_not: additionalFilter?.must_not,
      should: additionalFilter?.should,
    };

    return this.search(collection, queryText, limit, orgFilter, scoreThreshold);
  }

  // ---------------------------------------------------------------------------
  // REINDEX OPERATIONS
  // ---------------------------------------------------------------------------

  async reindexCollection(
    collection: VectorCollectionName,
    dataProvider: () => AsyncGenerator<{ id: string; text: string; payload: Record<string, unknown> }>
  ): Promise<{ indexed: number; failed: number; durationMs: number }> {
    const startTime = Date.now();
    let indexed = 0;
    let failed = 0;
    const batchBuffer: { id: string; text: string; payload: Record<string, unknown> }[] = [];
    const batchSize = 50;

    for await (const item of dataProvider()) {
      batchBuffer.push(item);

      if (batchBuffer.length >= batchSize) {
        const result = await this.upsertBatch(collection, batchBuffer);
        indexed += result.indexed;
        failed += result.failed;
        batchBuffer.length = 0;
      }
    }

    // Flush remaining
    if (batchBuffer.length > 0) {
      const result = await this.upsertBatch(collection, batchBuffer);
      indexed += result.indexed;
      failed += result.failed;
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[CendiaVector] Reindex '${collection}': ${indexed} indexed, ${failed} failed in ${durationMs}ms`);
    return { indexed, failed, durationMs };
  }

  // ---------------------------------------------------------------------------
  // FILTER BUILDER
  // ---------------------------------------------------------------------------

  private buildQdrantFilter(filter: SearchFilter): Record<string, unknown> {
    const qdrantFilter: Record<string, unknown[]> = {};

    if (filter.must && filter.must.length > 0) {
      qdrantFilter.must = filter.must.map(c => this.buildCondition(c));
    }
    if (filter.must_not && filter.must_not.length > 0) {
      qdrantFilter.must_not = filter.must_not.map(c => this.buildCondition(c));
    }
    if (filter.should && filter.should.length > 0) {
      qdrantFilter.should = filter.should.map(c => this.buildCondition(c));
    }

    return qdrantFilter;
  }

  private buildCondition(condition: FilterCondition): Record<string, unknown> {
    if (condition.match) {
      return {
        key: condition.key,
        match: condition.match,
      };
    }
    if (condition.range) {
      return {
        key: condition.key,
        range: condition.range,
      };
    }
    return { key: condition.key };
  }

  // ---------------------------------------------------------------------------
  // DIAGNOSTICS
  // ---------------------------------------------------------------------------

  async getDiagnostics(): Promise<{
    available: boolean;
    url: string;
    embeddingModel: string;
    embeddingCacheSize: number;
    collections: CollectionInfo[];
  }> {
    return {
      available: this.available,
      url: this.baseUrl,
      embeddingModel: this.embeddingModel,
      embeddingCacheSize: this.embeddingCache.size,
      collections: await this.getAllCollectionStats(),
    };
  }
}

// =============================================================================
// SINGLETON
// =============================================================================

export const vectorDB = new VectorDBService();
export default vectorDB;
