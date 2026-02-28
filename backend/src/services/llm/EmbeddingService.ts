// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaEmbeddings - Shared Embedding Service
 * 
 * IMPLEMENTATION STATUS: REAL EMBEDDINGS via Ollama (qwen3-embedding:4b)
 * 
 * - Primary: Ollama qwen3-embedding:4b (2560-dim dense vectors)
 * - Fallback: Deterministic hash-based embeddings (384-dim) when Ollama unavailable
 * - Cosine similarity search built-in
 * - Singleton service shared across all verticals
 * 
 * The fallback uses SHA-256 expansion for deterministic pseudo-embeddings.
 * These are NOT semantic — they only provide exact/near-exact match.
 * Real semantic search requires the Ollama model.
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { ollama } from '../ollama.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

export const EMBEDDING_DIM_OLLAMA = 2560;
export const EMBEDDING_DIM_FALLBACK = 384;

class EmbeddingService {
  private ollamaAvailable: boolean | null = null;
  private embeddingModel: string = 'qwen3-embedding:4b';
  private cache: Map<string, number[]> = new Map();
  private maxCacheSize = 10_000;

  constructor() {
    // Probe Ollama availability on first use (lazy)
    logger.info('[CendiaEmbeddings] Shared Embedding Service initialized (Ollama qwen3-embedding:4b + hash fallback)');


    this.loadFromDB().catch(() => {});
  }

  /**
   * Generate an embedding vector for the given text.
   * Uses Ollama if available, otherwise falls back to deterministic hash-based embedding.
   */
  async embed(text: string): Promise<number[]> {
    // Check cache first
    const cacheKey = text.length > 200 ? crypto.createHash('sha256').update(text).digest('hex') : text;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // Try Ollama first
    if (this.ollamaAvailable === null) {
      await this.probeOllama();
    }

    let embedding: number[];
    if (this.ollamaAvailable) {
      try {
        embedding = await ollama.embed(text, this.embeddingModel);
        this.setCached(cacheKey, embedding);
        return embedding;
      } catch (err) {
        logger.warn('[CendiaEmbeddings] Ollama embed failed, using hash fallback:', err);
        this.ollamaAvailable = false;
      }
    }

    // Fallback: deterministic hash-based embedding
    embedding = this.hashFallback(text);
    this.setCached(cacheKey, embedding);
    return embedding;
  }

  /**
   * Compute cosine similarity between two embedding vectors.
   */
  cosineSimilarity(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    let dot = 0, nA = 0, nB = 0;
    for (let i = 0; i < len; i++) {
      dot += (a[i] ?? 0) * (b[i] ?? 0);
      nA += (a[i] ?? 0) ** 2;
      nB += (b[i] ?? 0) ** 2;
    }
    const denom = Math.sqrt(nA) * Math.sqrt(nB);
    return denom === 0 ? 0 : dot / denom;
  }

  /**
   * Check if real (Ollama) embeddings are available.
   */
  isOllamaAvailable(): boolean {
    return this.ollamaAvailable === true;
  }

  /**
   * Get the current embedding dimension.
   */
  getDimension(): number {
    return this.ollamaAvailable ? EMBEDDING_DIM_OLLAMA : EMBEDDING_DIM_FALLBACK;
  }

  /**
   * Force re-probe of Ollama availability.
   */
  async reprobeOllama(): Promise<boolean> {
    this.ollamaAvailable = null;
    return this.probeOllama();
  }

  // ---------------------------------------------------------------------------
  // RAG RETRIEVAL — In-memory vector store with top-K cosine search
  // ---------------------------------------------------------------------------

  private vectorStore: Map<string, { text: string; embedding: number[]; metadata?: Record<string, unknown> }> = new Map();

  /**
   * Index a document into the in-memory vector store for later retrieval.
   */
  async addDocument(id: string, text: string, metadata?: Record<string, unknown>): Promise<void> {
    const embedding = await this.embed(text);
    this.vectorStore.set(id, { text, embedding, metadata });
  }

  /**
   * Batch-index multiple documents.
   */
  async addDocuments(docs: Array<{ id: string; text: string; metadata?: Record<string, unknown> }>): Promise<number> {
    let count = 0;
    for (const doc of docs) {
      await this.addDocument(doc.id, doc.text, doc.metadata);
      count++;
    }
    return count;
  }

  /**
   * Search the vector store for the top-K most similar documents to the query.
   * Returns results sorted by descending similarity.
   */
  async search(query: string, topK = 5, minScore = 0.0): Promise<Array<{
    id: string;
    text: string;
    score: number;
    metadata?: Record<string, unknown>;
  }>> {
    if (this.vectorStore.size === 0) return [];

    const queryEmbedding = await this.embed(query);
    const results: Array<{ id: string; text: string; score: number; metadata?: Record<string, unknown> }> = [];

    for (const [id, doc] of this.vectorStore) {
      const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
      if (score >= minScore) {
        results.push({ id, text: doc.text, score, metadata: doc.metadata });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  /**
   * Get the number of indexed documents.
   */
  getIndexSize(): number {
    return this.vectorStore.size;
  }

  /**
   * Clear the vector index.
   */
  clearIndex(): void {
    this.vectorStore.clear();
  }

  // ---------------------------------------------------------------------------
  // PRIVATE
  // ---------------------------------------------------------------------------

  private async probeOllama(): Promise<boolean> {
    try {
      const available = await ollama.isAvailable();
      this.ollamaAvailable = available;
      if (available) {
        logger.info('[CendiaEmbeddings] Ollama available — using real qwen3-embedding:4b embeddings');
      } else {
        logger.warn('[CendiaEmbeddings] Ollama not available — using deterministic hash-based fallback');
      }
      return available;
    } catch {
      this.ollamaAvailable = false;
      logger.warn('[CendiaEmbeddings] Ollama probe failed — using deterministic hash-based fallback');
      return false;
    }
  }

  /**
   * Deterministic hash-based embedding fallback.
   * Expands SHA-256 hash into a 384-dim vector via repeated HMAC.
   * NOT semantic — only provides exact/near-exact match capability.
   * Public so verticals can use it synchronously when async is not feasible.
   */
  hashFallback(text: string): number[] {
    const embedding: number[] = [];
    const baseHash = crypto.createHash('sha256').update(text.toLowerCase().trim()).digest();

    // Generate 384 dimensions by expanding with HMAC-SHA256 chunks
    for (let chunk = 0; embedding.length < EMBEDDING_DIM_FALLBACK; chunk++) {
      const hmac = crypto.createHmac('sha256', baseHash)
        .update(Buffer.from([chunk]))
        .digest();
      for (let i = 0; i < hmac.length && embedding.length < EMBEDDING_DIM_FALLBACK; i++) {
        // Normalize byte to [-1, 1] range
        embedding.push((hmac[i]! / 127.5) - 1.0);
      }
    }

    // L2 normalize
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    if (norm > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] = embedding[i]! / norm;
      }
    }

    return embedding;
  }

  private setCached(key: string, embedding: number[]): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Evict oldest 10%
      const keys = Array.from(this.cache.keys());
      for (let i = 0; i < keys.length * 0.1; i++) {
        this.cache.delete(keys[i]!);
      }
    }
    this.cache.set(key, embedding);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Embedding', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.cache.has(d.id)) this.cache.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[EmbeddingService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[EmbeddingService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const embeddingService = new EmbeddingService();
export default embeddingService;
