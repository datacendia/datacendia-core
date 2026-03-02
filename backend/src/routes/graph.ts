// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { graph } from '../config/neo4j.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import crypto from 'crypto';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router = Router();

router.use(devAuth);

function getSelectedDataSourceId(req: Request): string | undefined {
  const raw = req.get('X-Data-Source-Id') || req.get('x-data-source-id');
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

const entityQuerySchema = z.object({
  type: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

const createEntitySchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  properties: z.record(z.unknown()).optional(),
});

const createRelationshipSchema = z.object({
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  type: z.string().min(1),
  properties: z.record(z.unknown()).optional(),
});

const neighborQuerySchema = z.object({
  direction: z.enum(['incoming', 'outgoing', 'both']).default('both'),
  relationshipType: z.string().optional(),
  depth: z.coerce.number().min(1).max(5).default(1),
});

const graphQuerySchema = z.object({
  query: z.string().min(1),
  parameters: z.record(z.unknown()).optional(),
});

/**
 * GET /api/v1/graph/entities
 * List entities in the knowledge graph
 */
router.get('/entities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, search, page, pageSize } = entityQuerySchema.parse(req.query);
    const orgId = req.organizationId!;
    const dataSourceId = getSelectedDataSourceId(req);

    let cypher = `
      MATCH (e)
      WHERE e.organizationId = $orgId
    `;
    const params: Record<string, unknown> = { orgId };

    if (dataSourceId) {
      cypher += ` AND e.dataSourceId = $dataSourceId`;
      params.dataSourceId = dataSourceId;
    }

    if (type) {
      cypher += ` AND e:${type}`;
    }

    if (search) {
      cypher += ` AND (e.name =~ $searchPattern OR e.description =~ $searchPattern)`;
      params.searchPattern = `(?i).*${search}.*`;
    }

    // Get total count
    const countResult = await graph.read<{ count: unknown }>(
      cypher + ' RETURN count(e) as count',
      params
    );

    const rawCount = countResult[0]?.count ?? 0;
    let total: number;
    if (typeof rawCount === 'bigint') {
      total = Number(rawCount);
    } else if (typeof rawCount === 'number') {
      total = rawCount;
    } else if (rawCount && typeof (rawCount as any).toNumber === 'function') {
      total = (rawCount as any).toNumber();
    } else {
      total = Number(rawCount) || 0;
    }

    // Get paginated results
    cypher += ` RETURN e ORDER BY e.name SKIP toInteger($skip) LIMIT toInteger($limit)`;
    params.skip = Math.max(0, (page - 1) * pageSize);
    params.limit = pageSize;

    const entities = await graph.read<{ e: Record<string, unknown> }>(cypher, params);

    res.json({
      success: true,
      data: entities.map(r => r.e),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/entities/:id
 * Get single entity
 */
router.get('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSourceId = getSelectedDataSourceId(req);
    const result = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (result.length === 0) {
      throw errors.notFound('Entity');
    }

    const entity = result[0].e;
    if (entity.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    if (dataSourceId && entity.dataSourceId !== dataSourceId) {
      throw errors.forbidden();
    }

    // Get connection counts
    const connections = await graph.read<{ incoming: number; outgoing: number }>(
      `MATCH (e {id: $id})
       OPTIONAL MATCH (e)<-[in]-()
       OPTIONAL MATCH (e)-[out]->()
       RETURN count(DISTINCT in) as incoming, count(DISTINCT out) as outgoing`,
      { id: req.params.id }
    );

    res.json({
      success: true,
      data: {
        ...entity,
        connections: connections[0] || { incoming: 0, outgoing: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/entities
 * Create new entity
 */
router.post('/entities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, properties } = createEntitySchema.parse(req.body);
    const orgId = req.organizationId!;
    const dataSourceId = getSelectedDataSourceId(req);

    const id = `ent_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 9)}`;

    const entity = await graph.createNode(type, {
      id,
      name,
      organizationId: orgId,
      ...(dataSourceId ? { dataSourceId } : {}),
      ...properties,
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'entity.create',
        resource_type: 'entity',
        resource_id: id,
        details: { type, name },
      },
    });

    res.status(201).json({
      success: true,
      data: entity,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/graph/entities/:id
 * Update entity
 */
router.put('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, properties } = req.body;

    // Check exists and ownership
    const existing = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (existing.length === 0) {
      throw errors.notFound('Entity');
    }

    if (existing[0].e.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (name) updates.name = name;
    if (properties) Object.assign(updates, properties);

    const result = await graph.write<{ e: Record<string, unknown> }>(
      `MATCH (e {id: $id})
       SET e += $updates
       RETURN e`,
      { id: req.params.id, updates }
    );

    res.json({
      success: true,
      data: result[0]?.e,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/graph/entities/:id
 * Delete entity
 */
router.delete('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check exists and ownership
    const existing = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (existing.length === 0) {
      throw errors.notFound('Entity');
    }

    if (existing[0].e.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Delete with all relationships
    await graph.write(
      'MATCH (e {id: $id}) DETACH DELETE e',
      { id: req.params.id }
    );

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'entity.delete',
        resource_type: 'entity',
        resource_id: req.params.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Entity deleted' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/entities/:id/neighbors
 * Get entity neighbors
 */
router.get('/entities/:id/neighbors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direction, relationshipType, depth } = neighborQuerySchema.parse(req.query);

    const dataSourceId = getSelectedDataSourceId(req);

    const neighbors = await graph.getNeighbors(
      req.params.id,
      direction,
      relationshipType,
      depth
    );

    const filtered = dataSourceId
      ? neighbors.filter((n) => n.node?.dataSourceId === dataSourceId)
      : neighbors;

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/relationships
 * Create relationship between entities
 */
router.post('/relationships', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sourceId, targetId, type, properties } = createRelationshipSchema.parse(req.body);

    // Verify both entities exist and belong to org
    const entities = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e) WHERE e.id IN $ids RETURN e',
      { ids: [sourceId, targetId] }
    );

    if (entities.length !== 2) {
      throw errors.notFound('One or both entities');
    }

    for (const entity of entities) {
      if (entity.e.organizationId !== req.organizationId) {
        throw errors.forbidden();
      }
    }

    await graph.createRelationship(sourceId, targetId, type, properties || {});

    res.status(201).json({
      success: true,
      data: { sourceId, targetId, type, properties },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/query
 * Execute custom graph query
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, parameters } = graphQuerySchema.parse(req.body);

    // Security: only allow read queries
    const normalizedQuery = query.trim().toUpperCase();
    if (
      normalizedQuery.includes('CREATE') ||
      normalizedQuery.includes('DELETE') ||
      normalizedQuery.includes('SET') ||
      normalizedQuery.includes('REMOVE') ||
      normalizedQuery.includes('MERGE')
    ) {
      throw errors.forbidden('Only read queries are allowed');
    }

    // Inject organization filter
    const orgParams = {
      ...parameters,
      _orgId: req.organizationId,
    };

    const result = await graph.read(query, orgParams);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/search
 * Search entities
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const type = req.query.type as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;
    const orgId = req.organizationId!;
    const dataSourceId = getSelectedDataSourceId(req);

    if (!q || q.length < 2) {
      throw errors.badRequest('Search query must be at least 2 characters');
    }

    const pattern = `(?i).*${q}.*`;
    let cypher = `
      MATCH (n)
      WHERE n.organizationId = $orgId
        AND (n.name =~ $pattern OR n.description =~ $pattern)
    `;

    const params: Record<string, unknown> = {
      orgId,
      pattern,
      limit,
    };

    if (type) {
      cypher += ` AND n:${type}`;
    }

    if (dataSourceId) {
      cypher += ` AND n.dataSourceId = $dataSourceId`;
      params.dataSourceId = dataSourceId;
    }

    cypher += ` RETURN n LIMIT $limit`;

    const results = await graph.read<{ n: Record<string, unknown> }>(cypher, params);
    const filtered = results.map((r) => r.n);

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/stats
 * Get real-time knowledge graph statistics from Neo4j
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const dataSourceId = getSelectedDataSourceId(req);

    const baseNodeFilterParts: string[] = [];
    if (orgId) baseNodeFilterParts.push('n.organizationId = $orgId');
    if (dataSourceId) baseNodeFilterParts.push('n.dataSourceId = $dataSourceId');

    const baseNodeWhere = baseNodeFilterParts.length > 0 ? `WHERE ${baseNodeFilterParts.join(' AND ')}` : '';

    const relFilterParts: string[] = [];
    if (orgId) relFilterParts.push('n.organizationId = $orgId', 'm.organizationId = $orgId');
    if (dataSourceId) relFilterParts.push('n.dataSourceId = $dataSourceId', 'm.dataSourceId = $dataSourceId');

    const relWhere = relFilterParts.length > 0 ? `WHERE ${relFilterParts.join(' AND ')}` : '';

    const params: Record<string, unknown> = { orgId, dataSourceId };
    
    // Query Neo4j for real statistics
    const [entitiesResult, relationshipsResult, labelsResult, propertiesResult] = await Promise.all([
      // Count all entities
      graph.read<{ count: unknown }>(
        `MATCH (n) ${baseNodeWhere} RETURN count(n) as count`,
        params
      ),
      // Count all relationships
      graph.read<{ count: unknown }>(
        `MATCH (n)-[r]->(m) ${relWhere} RETURN count(r) as count`,
        params
      ),
      // Get distinct labels (entity types)
      graph.read<{ labels: string[] }>(
        'CALL db.labels() YIELD label RETURN collect(label) as labels',
        {}
      ),
      // Count total properties (data points)
      graph.read<{ count: unknown }>(
        `MATCH (n) ${baseNodeWhere} RETURN sum(size(keys(n))) as count`,
        params
      ),
    ]);

    // Extract counts (handle BigInt from Neo4j)
    const toNumber = (val: unknown): number => {
      if (typeof val === 'bigint') return Number(val);
      if (typeof val === 'number') return val;
      if (val && typeof val === 'object' && 'low' in val) {
        return Number((val as { low: number }).low);
      }
      return 0;
    };

    const entities = toNumber(entitiesResult[0]?.count);
    const relationships = toNumber(relationshipsResult[0]?.count);
    const labels = labelsResult[0]?.labels || [];
    const dataPoints = toNumber(propertiesResult[0]?.count);

    // Calculate freshness based on most recent update
    const freshnessResult = await graph.read<{ latest: unknown }>(
      orgId
        ? 'MATCH (n) WHERE n.organizationId = $orgId AND n.updatedAt IS NOT NULL RETURN max(n.updatedAt) as latest'
        : 'MATCH (n) WHERE n.updatedAt IS NOT NULL RETURN max(n.updatedAt) as latest',
      { orgId }
    );

    let freshness = 100;
    const latestUpdate = freshnessResult[0]?.latest;
    if (latestUpdate) {
      const updateTime = new Date(latestUpdate as string).getTime();
      const now = Date.now();
      const hoursSinceUpdate = (now - updateTime) / (1000 * 60 * 60);
      // Freshness decays: 100% at 0h, ~95% at 24h, ~85% at 1 week
      freshness = Math.max(0, Math.min(100, 100 - (hoursSinceUpdate / 24) * 5));
    }

    // Get entity type breakdown
    const typeBreakdownResult = await graph.read<{ label: string; count: unknown }>(
      orgId
        ? `MATCH (n) WHERE n.organizationId = $orgId 
           UNWIND labels(n) as label 
           RETURN label, count(*) as count 
           ORDER BY count DESC LIMIT 10`
        : `MATCH (n) 
           UNWIND labels(n) as label 
           RETURN label, count(*) as count 
           ORDER BY count DESC LIMIT 10`,
      { orgId }
    );

    const entityTypes = typeBreakdownResult.map(r => ({
      type: r.label,
      count: toNumber(r.count),
    }));

    logger.info('[Graph Stats] Retrieved:', { entities, relationships, dataPoints, freshness });

    res.json({
      success: true,
      data: {
        entities,
        relationships,
        dataPoints,
        freshness: Math.round(freshness * 10) / 10,
        labels,
        entityTypes,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('[Graph Stats] Failed:', error);
    
    // Return fallback data if Neo4j is unavailable
    res.json({
      success: true,
      data: {
        entities: 0,
        relationships: 0,
        dataPoints: 0,
        freshness: 0,
        labels: [],
        entityTypes: [],
        timestamp: new Date().toISOString(),
        note: 'Neo4j unavailable - showing zero state',
      },
    });
  }
});

/**
 * GET /api/v1/graph/stats/history
 * Get historical graph statistics (for Chronos time-travel)
 * Note: Historical snapshots would be stored by a scheduled job
 */
router.get('/stats/history', async (_req: Request, res: Response, _next: NextFunction) => {
  // Historical snapshots would be captured by a scheduled job
  // For now, return empty array - real implementation would query a snapshots table
  res.json({
    success: true,
    data: [],
    note: 'Historical snapshots require scheduled capture job',
  });
});

export default router;
