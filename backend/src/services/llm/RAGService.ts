// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Enables the Council to "read" and recall documents
 */

import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';

// ============================================================================
// TYPES
// ============================================================================

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  sourceType: string;
  sourceId: string;
}

export interface ChunkResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}

export interface RAGContext {
  query: string;
  relevantChunks: ChunkResult[];
  augmentedPrompt: string;
}

// ============================================================================
// EMBEDDING UTILITIES
// ============================================================================

/**
 * Call Ollama to generate embeddings
 */
async function generateEmbedding(text: string, model: string = 'qwen3-embedding:4b'): Promise<number[]> {
  const response = await fetch('http://127.0.0.1:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),
  });

  if (!response.ok) {
    throw new Error(`Embedding generation failed: ${response.statusText}`);
  }

  const data = await response.json() as { embedding: number[] };
  return data.embedding;
}

/**
 * Convert float array to bytes for storage
 */
function embeddingToBytes(embedding: number[]): Buffer {
  const buffer = Buffer.alloc(embedding.length * 4);
  embedding.forEach((val, i) => buffer.writeFloatLE(val, i * 4));
  return buffer;
}

/**
 * Convert bytes back to float array
 */
function bytesToEmbedding(buffer: Buffer): number[] {
  const embedding: number[] = [];
  for (let i = 0; i < buffer.length; i += 4) {
    embedding.push(buffer.readFloatLE(i));
  }
  return embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Generate content hash
 */
function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// ============================================================================
// TEXT CHUNKING
// ============================================================================

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  separator?: string;
}

/**
 * Split text into chunks for embedding
 */
function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const { maxChunkSize = 512, overlap = 50, separator = '\n\n' } = options;
  
  // First split by separator
  const paragraphs = text.split(separator).filter(p => p.trim());
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        // Keep overlap from end of current chunk
        const words = currentChunk.split(' ');
        currentChunk = words.slice(-Math.floor(overlap / 5)).join(' ') + ' ';
      }
    }
    currentChunk += para + ' ';
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Handle case where text has no separators
  if (chunks.length === 0 && text.length > 0) {
    // Split by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let chunk = '';
    for (const sentence of sentences) {
      if (chunk.length + sentence.length > maxChunkSize) {
        if (chunk) chunks.push(chunk.trim());
        chunk = '';
      }
      chunk += sentence + ' ';
    }
    if (chunk.trim()) chunks.push(chunk.trim());
  }

  return chunks;
}

// ============================================================================
// RAG SERVICE CLASS
// ============================================================================

export class RAGService {
  private embeddingModel: string = 'qwen3-embedding:4b';
  private dimensions: number = 2560;

  /**
   * Index a document for retrieval
   */
  async indexDocument(doc: Document): Promise<{ chunksCreated: number; errors: string[] }> {
    const chunks = chunkText(doc.content);
    const errors: string[] = [];
    let created = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const contentHash = hashContent(chunk);

      try {
        // Check if already exists
        const existing = await prisma.embeddings.findUnique({
          where: { content_hash: contentHash },
        });

        if (existing) {
          continue; // Skip duplicate
        }

        // Generate embedding
        const embedding = await generateEmbedding(chunk, this.embeddingModel);
        const embeddingBytes = embeddingToBytes(embedding);

        // Store in database
        await prisma.embeddings.create({
          data: {
            id: crypto.randomUUID(),
            source_type: doc.sourceType,
            source_id: doc.sourceId,
            content: chunk,
            content_hash: contentHash,
            embedding: embeddingBytes,
            embedding_model: this.embeddingModel,
            dimensions: this.dimensions,
            metadata: {
              ...doc.metadata,
              chunkIndex: i,
              totalChunks: chunks.length,
              documentId: doc.id,
            },
          },
        });

        created++;
      } catch (error) {
        errors.push(`Chunk ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { chunksCreated: created, errors };
  }

  /**
   * Search for relevant chunks
   */
  async search(query: string, options: { limit?: number; threshold?: number; sourceType?: string } = {}): Promise<ChunkResult[]> {
    const { limit = 5, threshold = 0.5, sourceType } = options;

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query, this.embeddingModel);

    // Get all embeddings (pgvector similarity search when configured)
    const whereClause: any = {};
    if (sourceType) {
      whereClause.source_type = sourceType;
    }

    const embeddings = await prisma.embeddings.findMany({
      where: whereClause,
      take: 1000, // Limit for performance
    });

    // Calculate similarities
    const results: ChunkResult[] = [];

    for (const emb of embeddings) {
      const storedEmbedding = bytesToEmbedding(emb.embedding);
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);

      if (similarity >= threshold) {
        results.push({
          id: emb.id,
          content: emb.content,
          similarity,
          metadata: emb.metadata as Record<string, any>,
        });
      }
    }

    // Sort by similarity and return top results
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  /**
   * Build augmented context for a query
   */
  async buildContext(query: string, options: { limit?: number; sourceType?: string } = {}): Promise<RAGContext> {
    const relevantChunks = await this.search(query, { ...options, threshold: 0.3 });

    // Build context string
    const contextParts = relevantChunks.map((chunk, i) => 
      `[Source ${i + 1}] (relevance: ${(chunk.similarity * 100).toFixed(1)}%)\n${chunk.content}`
    );

    const contextString = contextParts.join('\n\n---\n\n');

    // Build augmented prompt
    const augmentedPrompt = `Use the following context to answer the question. If the context doesn't contain relevant information, say so.

CONTEXT:
${contextString}

QUESTION: ${query}

ANSWER:`;

    return {
      query,
      relevantChunks,
      augmentedPrompt,
    };
  }

  /**
   * Delete embeddings for a source
   */
  async deleteSource(sourceType: string, sourceId: string): Promise<number> {
    const result = await prisma.embeddings.deleteMany({
      where: { source_type: sourceType, source_id: sourceId },
    });
    return result.count;
  }

  /**
   * Get statistics about indexed content
   */
  async getStats(): Promise<{
    totalEmbeddings: number;
    bySourceType: Record<string, number>;
    models: string[];
  }> {
    const total = await prisma.embeddings.count();

    const byType = await prisma.embeddings.groupBy({
      by: ['source_type'],
      _count: true,
    });

    const models = await prisma.embeddings.findMany({
      select: { embedding_model: true },
      distinct: ['embedding_model'],
    });

    return {
      totalEmbeddings: total,
      bySourceType: Object.fromEntries(byType.map((t: { source_type: string; _count: number }) => [t.source_type, t._count])),
      models: models.map((m: { embedding_model: string }) => m.embedding_model),
    };
  }

  /**
   * Index compliance documents
   */
  async indexComplianceDoc(framework: string, content: string, metadata: Record<string, any> = {}): Promise<{ chunksCreated: number; errors: string[] }> {
    return this.indexDocument({
      id: `compliance-${framework}-${Date.now()}`,
      content,
      sourceType: 'compliance',
      sourceId: framework,
      metadata: {
        framework,
        ...metadata,
        indexedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Search compliance knowledge
   */
  async searchCompliance(query: string, framework?: string): Promise<ChunkResult[]> {
    const results = await this.search(query, {
      limit: 5,
      threshold: 0.4,
      sourceType: 'compliance',
    });

    if (framework) {
      return results.filter(r => r.metadata.framework === framework);
    }

    return results;
  }
}

export const ragService = new RAGService();
