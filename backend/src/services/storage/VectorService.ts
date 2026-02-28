// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// VECTOR SERVICE - pgvector for AI Memory (CendiaGnosis� RAG)
// =============================================================================
// Uses PostgreSQL's pgvector extension for semantic search.
// Powers: Document retrieval, Decision memory, Agent long-term context
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// Embedding dimensions (match your embedding model)
const EMBEDDING_DIMENSIONS = {
  OLLAMA_NOMIC: 2560,       // qwen3-embedding:4b
  OLLAMA_MXBAI: 1024,       // mxbai-embed-large
  OPENAI_ADA: 1536,         // text-embedding-ada-002
  OPENAI_3_SMALL: 1536,     // text-embedding-3-small
  OPENAI_3_LARGE: 3072,     // text-embedding-3-large
} as const;

// Current embedding model dimension
const CURRENT_DIMENSION = EMBEDDING_DIMENSIONS.OPENAI_ADA; // Default for compatibility

// Search result types
export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata?: Record<string, any>;
}

export interface DocumentChunk {
  documentId: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
  metadata?: Record<string, any>;
}

export interface DecisionContext {
  decisionId: string;
  content: string;
  outcome?: string;
  embedding?: number[];
  confidence?: number;
}

export interface AgentMemoryEntry {
  agentId: string;
  memoryType: 'episodic' | 'semantic' | 'procedural';
  content: string;
  embedding?: number[];
  importance?: number;
  expiresAt?: Date;
}

class VectorService {
  private prisma: PrismaClient;
  private isInitialized: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Initialize the vector service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('[Vector] Initializing pgvector service...');

    // Verify pgvector extension is available
    try {
      await this.prisma.$executeRaw`SELECT 'vector'::regtype`;
      logger.info('[Vector] pgvector extension verified');
    } catch (error) {
      console.error('[Vector] pgvector extension not found. Run: CREATE EXTENSION vector;');
      throw error;
    }

    this.isInitialized = true;
  }

  /**
   * Generate embedding using Ollama (local)
   */
  async generateEmbedding(text: string, model: string = 'qwen3-embedding:4b'): Promise<number[]> {
    try {
      const response = await fetch(`${process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`Embedding generation failed: ${response.statusText}`);
      }

      const data = await response.json() as { embedding: number[] };
      return data.embedding;
    } catch (error: unknown) {
      console.error('[Vector] Embedding generation error:', getErrorMessage(error));
      throw error;
    }
  }

  /**
   * Store a document chunk with embedding
   */
  async storeDocumentChunk(
    organizationId: string,
    chunk: DocumentChunk
  ): Promise<string> {
    const embedding = chunk.embedding || await this.generateEmbedding(chunk.content);
    const vectorString = `[${embedding.join(',')}]`;

    const result = await this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO document_embeddings (
        organization_id,
        document_id,
        chunk_index,
        content,
        embedding,
        metadata
      ) VALUES (
        ${organizationId},
        ${chunk.documentId},
        ${chunk.chunkIndex},
        ${chunk.content},
        ${vectorString}::vector,
        ${JSON.stringify(chunk.metadata || {})}::jsonb
      )
      RETURNING id::text
    `;

    return result[0]?.id || '';
  }

  /**
   * Search for similar documents
   */
  async searchDocuments(
    organizationId: string,
    query: string,
    options: {
      limit?: number;
      threshold?: number;
      documentIds?: string[];
    } = {}
  ): Promise<VectorSearchResult[]> {
    const { limit = 5, threshold = 0.7, documentIds } = options;

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    let sql = `
      SELECT 
        id::text,
        document_id,
        content,
        metadata,
        1 - (embedding <=> '${vectorString}'::vector) as similarity
      FROM document_embeddings
      WHERE organization_id = $1
        AND 1 - (embedding <=> '${vectorString}'::vector) > $2
    `;

    const params: any[] = [organizationId, threshold];

    if (documentIds && documentIds.length > 0) {
      sql += ` AND document_id = ANY($3)`;
      params.push(documentIds);
    }

    sql += ` ORDER BY embedding <=> '${vectorString}'::vector LIMIT $${params.length + 1}`;
    params.push(limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(sql, ...params);

    return results.map(r => ({
      id: r.id,
      content: r.content,
      similarity: parseFloat(r.similarity),
      metadata: {
        documentId: r.document_id,
        ...r.metadata,
      },
    }));
  }

  /**
   * Store a decision context for memory
   */
  async storeDecisionContext(
    organizationId: string,
    context: DecisionContext
  ): Promise<string> {
    const embedding = context.embedding || await this.generateEmbedding(context.content);
    const vectorString = `[${embedding.join(',')}]`;

    const result = await this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO decision_embeddings (
        organization_id,
        decision_id,
        content,
        embedding,
        outcome,
        confidence
      ) VALUES (
        ${organizationId},
        ${context.decisionId},
        ${context.content},
        ${vectorString}::vector,
        ${context.outcome || null},
        ${context.confidence || null}
      )
      RETURNING id::text
    `;

    return result[0]?.id || '';
  }

  /**
   * Search for similar past decisions
   */
  async searchDecisions(
    organizationId: string,
    query: string,
    options: {
      limit?: number;
      threshold?: number;
      outcomeFilter?: string;
    } = {}
  ): Promise<VectorSearchResult[]> {
    const { limit = 5, threshold = 0.6, outcomeFilter } = options;

    const queryEmbedding = await this.generateEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    let sql = `
      SELECT 
        id::text,
        decision_id,
        content,
        outcome,
        confidence,
        1 - (embedding <=> '${vectorString}'::vector) as similarity
      FROM decision_embeddings
      WHERE organization_id = $1
        AND 1 - (embedding <=> '${vectorString}'::vector) > $2
    `;

    const params: any[] = [organizationId, threshold];

    if (outcomeFilter) {
      sql += ` AND outcome = $3`;
      params.push(outcomeFilter);
    }

    sql += ` ORDER BY embedding <=> '${vectorString}'::vector LIMIT $${params.length + 1}`;
    params.push(limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(sql, ...params);

    return results.map(r => ({
      id: r.id,
      content: r.content,
      similarity: parseFloat(r.similarity),
      metadata: {
        decisionId: r.decision_id,
        outcome: r.outcome,
        confidence: r.confidence,
      },
    }));
  }

  /**
   * Store agent memory
   */
  async storeAgentMemory(
    organizationId: string,
    agentId: string,
    memory: AgentMemoryEntry
  ): Promise<string> {
    const embedding = memory.embedding || await this.generateEmbedding(memory.content);
    const vectorString = `[${embedding.join(',')}]`;

    const result = await this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO agent_memory (
        organization_id,
        agent_id,
        memory_type,
        content,
        embedding,
        importance,
        expires_at
      ) VALUES (
        ${organizationId},
        ${agentId},
        ${memory.memoryType},
        ${memory.content},
        ${vectorString}::vector,
        ${memory.importance || 0.5},
        ${memory.expiresAt || null}
      )
      RETURNING id::text
    `;

    return result[0]?.id || '';
  }

  /**
   * Retrieve relevant agent memories
   */
  async retrieveAgentMemory(
    organizationId: string,
    agentId: string,
    context: string,
    options: {
      limit?: number;
      memoryTypes?: ('episodic' | 'semantic' | 'procedural')[];
    } = {}
  ): Promise<VectorSearchResult[]> {
    const { limit = 10, memoryTypes } = options;

    const contextEmbedding = await this.generateEmbedding(context);
    const vectorString = `[${contextEmbedding.join(',')}]`;

    let sql = `
      SELECT 
        id::text,
        memory_type,
        content,
        importance,
        access_count,
        1 - (embedding <=> '${vectorString}'::vector) as similarity
      FROM agent_memory
      WHERE organization_id = $1
        AND agent_id = $2
        AND (expires_at IS NULL OR expires_at > NOW())
    `;

    const params: any[] = [organizationId, agentId];

    if (memoryTypes && memoryTypes.length > 0) {
      sql += ` AND memory_type = ANY($3)`;
      params.push(memoryTypes);
    }

    sql += ` ORDER BY 
      importance DESC,
      embedding <=> '${vectorString}'::vector
    LIMIT $${params.length + 1}`;
    params.push(limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(sql, ...params);

    // Update access counts
    if (results.length > 0) {
      const ids = results.map(r => r.id);
      await this.prisma.$executeRaw`
        UPDATE agent_memory 
        SET access_count = access_count + 1, 
            last_accessed = NOW()
        WHERE id::text = ANY(${ids})
      `;
    }

    return results.map(r => ({
      id: r.id,
      content: r.content,
      similarity: parseFloat(r.similarity),
      metadata: {
        memoryType: r.memory_type,
        importance: r.importance,
        accessCount: r.access_count,
      },
    }));
  }

  /**
   * Delete document chunks
   */
  async deleteDocumentChunks(organizationId: string, documentId: string): Promise<number> {
    const result = await this.prisma.$executeRaw`
      DELETE FROM document_embeddings
      WHERE organization_id = ${organizationId}
        AND document_id = ${documentId}
    `;
    return result;
  }

  /**
   * Consolidate agent memories (remove low-importance, rarely accessed)
   */
  async consolidateAgentMemory(
    organizationId: string,
    agentId: string,
    options: {
      maxMemories?: number;
      minImportance?: number;
      minAccessCount?: number;
    } = {}
  ): Promise<number> {
    const { maxMemories = 1000, minImportance = 0.2, minAccessCount = 0 } = options;

    // Delete expired memories
    await this.prisma.$executeRaw`
      DELETE FROM agent_memory
      WHERE organization_id = ${organizationId}
        AND agent_id = ${agentId}
        AND expires_at < NOW()
    `;

    // Delete low-quality memories if over limit
    const result = await this.prisma.$executeRaw`
      DELETE FROM agent_memory
      WHERE id IN (
        SELECT id FROM agent_memory
        WHERE organization_id = ${organizationId}
          AND agent_id = ${agentId}
          AND importance < ${minImportance}
          AND access_count <= ${minAccessCount}
        ORDER BY importance ASC, access_count ASC
        OFFSET ${maxMemories}
      )
    `;

    return result;
  }

  /**
   * Get statistics
   */
  async getStats(organizationId: string): Promise<{
    documentChunks: number;
    decisions: number;
    agentMemories: number;
  }> {
    const [docCount, decisionCount, memoryCount] = await Promise.all([
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) FROM document_embeddings WHERE organization_id = ${organizationId}
      `,
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) FROM decision_embeddings WHERE organization_id = ${organizationId}
      `,
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) FROM agent_memory WHERE organization_id = ${organizationId}
      `,
    ]);

    return {
      documentChunks: Number(docCount[0]?.count || 0),
      decisions: Number(decisionCount[0]?.count || 0),
      agentMemories: Number(memoryCount[0]?.count || 0),
    };
  }
}

// Singleton instance
export const vectorService = new VectorService();

export default vectorService;
