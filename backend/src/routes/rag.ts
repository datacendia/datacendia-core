/**
 * API Routes — Rag
 *
 * Express route handler defining REST endpoints.
 * @module routes/rag
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - RAG (Retrieval Augmented Generation) ROUTES
// Endpoints for managing knowledge base and document embeddings
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { requireOrgScope } from '../middleware/tenantIsolation.js';
import { enhancedLLM } from '../services/EnhancedLLMService.js';

const router = Router();

// Health endpoint (before auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'rag', timestamp: new Date().toISOString() } });
});

// All routes require authentication
router.use(devAuth);
router.use(requireOrgScope);

// =============================================================================
// SCHEMAS
// =============================================================================

const storeDocumentSchema = z.object({
  content: z.string().min(1).max(50000),
  source: z.string().min(1).max(500),
  collection: z.string().optional().default('knowledge_base'),
  metadata: z.record(z.any()).optional(),
});

const storeBatchSchema = z.object({
  documents: z.array(z.object({
    content: z.string().min(1).max(50000),
    source: z.string().min(1).max(500),
    metadata: z.record(z.any()).optional(),
  })),
  collection: z.string().optional().default('knowledge_base'),
});

const searchSchema = z.object({
  query: z.string().min(1).max(2000),
  collection: z.string().optional().default('knowledge_base'),
  topK: z.number().optional().default(5),
  minSimilarity: z.number().optional().default(0.7),
});

// =============================================================================
// ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/rag/collections
 * List all RAG collections
 */
router.get('/collections', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await prisma.$queryRaw<Array<{
      collection: string;
      count: bigint;
      avg_length: number;
    }>>`
      SELECT 
        collection,
        COUNT(*) as count,
        AVG(LENGTH(content)) as avg_length
      FROM embeddings
      GROUP BY collection
      ORDER BY collection
    `;

    res.json({
      success: true,
      data: collections.map(c => ({
        name: c.collection,
        documentCount: Number(c.count),
        avgContentLength: Math.round(c.avg_length),
      })),
    });
  } catch (error) {
    // Table might not exist yet
    logger.warn('Collections query failed, embeddings table may not exist:', error);
    res.json({
      success: true,
      data: [],
      message: 'Embeddings table not yet created. Run migrations first.',
    });
  }
});

/**
 * POST /api/v1/rag/documents
 * Store a single document with embedding
 */
router.post('/documents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, source, collection, metadata } = storeDocumentSchema.parse(req.body);

    await enhancedLLM.storeDocument(content, source, collection, metadata);

    res.status(201).json({
      success: true,
      message: `Document stored in collection '${collection}'`,
      data: {
        source,
        collection,
        contentLength: content.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/rag/documents/batch
 * Store multiple documents with embeddings
 */
router.post('/documents/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documents, collection } = storeBatchSchema.parse(req.body);

    const results = await Promise.allSettled(
      documents.map(doc => 
        enhancedLLM.storeDocument(doc.content, doc.source, collection, doc.metadata)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(201).json({
      success: true,
      message: `Stored ${successful}/${documents.length} documents in collection '${collection}'`,
      data: {
        collection,
        total: documents.length,
        successful,
        failed,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/rag/search
 * Search for similar documents
 */
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, collection, topK, minSimilarity } = searchSchema.parse(req.body);

    const results = await enhancedLLM.retrieveContext(query, collection, topK, minSimilarity);

    res.json({
      success: true,
      data: {
        query,
        collection,
        results: results.map(r => ({
          content: r.content,
          source: r.source,
          similarity: Math.round(r.similarity * 1000) / 1000,
          metadata: r.metadata,
        })),
        totalFound: results.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/rag/collections/:collection
 * Delete all documents in a collection
 */
router.delete('/collections/:collection', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { collection } = req.params;

    const result = await prisma.$executeRaw`
      DELETE FROM embeddings WHERE collection = ${collection}
    `;

    res.json({
      success: true,
      message: `Deleted all documents from collection '${collection}'`,
      data: {
        collection,
        deletedCount: result,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/rag/stats
 * Get RAG system statistics
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await prisma.$queryRaw<Array<{
      total_documents: bigint;
      total_collections: bigint;
      total_size_bytes: bigint;
      oldest_document: Date;
      newest_document: Date;
    }>>`
      SELECT 
        COUNT(*) as total_documents,
        COUNT(DISTINCT collection) as total_collections,
        SUM(LENGTH(content)) as total_size_bytes,
        MIN(created_at) as oldest_document,
        MAX(created_at) as newest_document
      FROM embeddings
    `;

    const cacheStats = await prisma.$queryRaw<Array<{
      cached_responses: bigint;
      avg_response_size: number;
    }>>`
      SELECT 
        COUNT(*) as cached_responses,
        AVG(LENGTH(response)) as avg_response_size
      FROM llm_cache
      WHERE expires_at > NOW()
    `.catch(() => [{ cached_responses: 0n, avg_response_size: 0 }]);

    res.json({
      success: true,
      data: {
        embeddings: {
          totalDocuments: Number(stats[0]?.total_documents || 0),
          totalCollections: Number(stats[0]?.total_collections || 0),
          totalSizeKB: Math.round(Number(stats[0]?.total_size_bytes || 0) / 1024),
          oldestDocument: stats[0]?.oldest_document,
          newestDocument: stats[0]?.newest_document,
        },
        cache: {
          cachedResponses: Number(cacheStats[0]?.cached_responses || 0),
          avgResponseSize: Math.round(cacheStats[0]?.avg_response_size || 0),
        },
      },
    });
  } catch (error) {
    // Tables might not exist yet
    logger.warn('Stats query failed:', error);
    res.json({
      success: true,
      data: {
        embeddings: {
          totalDocuments: 0,
          totalCollections: 0,
          totalSizeKB: 0,
        },
        cache: {
          cachedResponses: 0,
          avgResponseSize: 0,
        },
        message: 'Tables not yet created. Run migrations first.',
      },
    });
  }
});

/**
 * POST /api/v1/rag/ingest/url
 * Ingest content from a URL
 */
router.post('/ingest/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, collection } = z.object({
      url: z.string().url(),
      collection: z.string().optional().default('web_content'),
    }).parse(req.body);

    // Fetch content from URL
    const response = await fetch(url);
    if (!response.ok) {
      throw errors.badRequest(`Failed to fetch URL: HTTP ${response.status}`);
    }

    const content = await response.text();
    
    // Extract text content (basic HTML stripping)
    const textContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000);  // Limit size

    await enhancedLLM.storeDocument(textContent, url, collection, {
      type: 'web',
      fetchedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: `Ingested content from ${url}`,
      data: {
        url,
        collection,
        contentLength: textContent.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
