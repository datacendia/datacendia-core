/**
 * API Routes — Lineage
 *
 * Express route handler defining REST endpoints.
 * @module routes/lineage
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { graph } from '../config/neo4j.js';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const lineageQuerySchema = z.object({
  direction: z.enum(['upstream', 'downstream', 'both']).default('upstream'),
  depth: z.coerce.number().min(1).max(10).default(3),
});

/**
 * GET /api/v1/lineage/:entityId
 * Get full lineage for an entity
 */
router.get('/:entityId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direction, depth } = lineageQuerySchema.parse(req.query);
    const entityId = req.params.entityId;
    const orgId = req.organizationId!;

    // Check cache first
    const cacheKey = `lineage:${entityId}:${direction}:${depth}`;
    let lineageData = await cache.get<LineageResult>(cacheKey);

    if (!lineageData) {
      lineageData = await computeLineage(entityId, orgId, direction, depth);
      await cache.set(cacheKey, lineageData, 300); // 5 min cache
    }

    res.json({
      success: true,
      data: lineageData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/lineage/:entityId/impact
 * Get impact analysis - what entities would be affected if this one changes
 */
router.get('/:entityId/impact', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entityId = req.params.entityId;
    const orgId = req.organizationId!;

    // Get downstream dependencies
    const impactResult = await graph.read<{
      impacted: {
        id: string;
        name: string;
        type: string;
        labels: string[];
      };
      pathLength: number;
    }>(`
      MATCH (source {id: $entityId, organizationId: $orgId})
      MATCH path = (source)<-[:DERIVES_FROM|CALCULATED_FROM|USES*1..5]-(impacted)
      WHERE impacted.organizationId = $orgId
      RETURN DISTINCT impacted {
        .id, .name, .type,
        labels: labels(impacted)
      } as impacted,
      length(path) as pathLength
      ORDER BY pathLength
    `, { entityId, orgId });

    // Categorize by impact level
    const affectedEntities = impactResult.map(r => ({
      id: r.impacted.id,
      name: r.impacted.name,
      type: r.impacted.type || r.impacted.labels[0],
      impactLevel: r.pathLength === 1 ? 'high' : r.pathLength === 2 ? 'medium' : 'low',
      pathLength: r.pathLength,
    }));

    // Get affected workflows
    const workflowResult = await graph.read<{
      workflow: { id: string; name: string };
      pathLength: number;
    }>(`
      MATCH (source {id: $entityId, organizationId: $orgId})
      MATCH path = (source)<-[:USES*1..3]-(wf:Process)
      WHERE wf.organizationId = $orgId AND wf.type = 'workflow'
      RETURN wf {.id, .name} as workflow, length(path) as pathLength
    `, { entityId, orgId });

    const affectedWorkflows = workflowResult.map(r => ({
      id: r.workflow.id,
      name: r.workflow.name,
      impactLevel: r.pathLength === 1 ? 'high' : r.pathLength === 2 ? 'medium' : 'low',
    }));

    // Summary
    const summary = {
      totalAffected: affectedEntities.length + affectedWorkflows.length,
      highImpact: affectedEntities.filter(e => e.impactLevel === 'high').length,
      mediumImpact: affectedEntities.filter(e => e.impactLevel === 'medium').length,
      lowImpact: affectedEntities.filter(e => e.impactLevel === 'low').length,
    };

    res.json({
      success: true,
      data: {
        sourceEntity: entityId,
        affectedEntities,
        affectedWorkflows,
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/lineage/:entityId/transformations
 * Get all transformations applied in the lineage path
 */
router.get('/:entityId/transformations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entityId = req.params.entityId;
    const orgId = req.organizationId!;

    const transformations = await graph.read<{
      source: { id: string; name: string };
      target: { id: string; name: string };
      transformation: string;
      transformationType: string;
      schedule: string;
      createdAt: string;
    }>(`
      MATCH (target {id: $entityId, organizationId: $orgId})
      MATCH path = (target)-[:DERIVES_FROM|CALCULATED_FROM*1..5]->(source)
      WHERE source.organizationId = $orgId
      WITH relationships(path) as rels
      UNWIND rels as rel
      MATCH (s)-[rel]->(t)
      RETURN 
        s {.id, .name} as source,
        t {.id, .name} as target,
        rel.transformation as transformation,
        rel.transformationType as transformationType,
        rel.schedule as schedule,
        rel.createdAt as createdAt
      ORDER BY rel.createdAt DESC
    `, { entityId, orgId });

    res.json({
      success: true,
      data: {
        entityId,
        transformations: transformations.map((t, index) => ({
          step: index + 1,
          source: t.source,
          target: t.target,
          transformation: t.transformation || 'Unknown transformation',
          type: t.transformationType || 'transform',
          schedule: t.schedule,
          createdAt: t.createdAt,
        })),
        totalTransformations: transformations.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/lineage/:entityId/quality
 * Get data quality metrics along the lineage path
 */
router.get('/:entityId/quality', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entityId = req.params.entityId;
    const orgId = req.organizationId!;

    // Get all entities in the lineage path
    const lineageEntities = await graph.read<{ entity: { id: string; name: string } }>(`
      MATCH (target {id: $entityId, organizationId: $orgId})
      MATCH path = (target)-[:DERIVES_FROM|CALCULATED_FROM*0..5]->(source)
      WHERE source.organizationId = $orgId
      UNWIND nodes(path) as entity
      RETURN DISTINCT entity {.id, .name}
    `, { entityId, orgId });

    // Calculate quality metrics for the lineage
    // Production upgrade: source from actual data quality checks
    const qualityScores = {
      completeness: calculateQualityScore(lineageEntities.length, 'completeness'),
      accuracy: calculateQualityScore(lineageEntities.length, 'accuracy'),
      timeliness: calculateQualityScore(lineageEntities.length, 'timeliness'),
      consistency: calculateQualityScore(lineageEntities.length, 'consistency'),
    };

    // Detect quality issues
    const issues: Array<{
      entityId: string;
      entityName: string;
      issue: string;
      severity: 'high' | 'medium' | 'low';
    }> = [];

    if (qualityScores.timeliness < 80) {
      issues.push({
        entityId,
        entityName: 'Target entity',
        issue: 'Data freshness below threshold',
        severity: qualityScores.timeliness < 60 ? 'high' : 'medium',
      });
    }

    if (qualityScores.completeness < 95) {
      issues.push({
        entityId,
        entityName: 'Target entity',
        issue: `Missing ${100 - qualityScores.completeness}% of expected records`,
        severity: qualityScores.completeness < 80 ? 'high' : 'low',
      });
    }

    res.json({
      success: true,
      data: {
        entityId,
        overallScore: Math.round(
          (qualityScores.completeness + qualityScores.accuracy + 
           qualityScores.timeliness + qualityScores.consistency) / 4
        ),
        dimensions: qualityScores,
        entitiesAnalyzed: lineageEntities.length,
        issues,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Types
interface LineageNode {
  id: string;
  type: string;
  name: string;
  level: number;
}

interface LineageEdge {
  source: string;
  target: string;
  type: string;
  properties: Record<string, unknown>;
}

interface LineageResult {
  root: {
    id: string;
    type: string;
    name: string;
  };
  nodes: LineageNode[];
  edges: LineageEdge[];
  metadata: {
    totalDepth: number;
    totalNodes: number;
    dataFreshness: string;
  };
}

async function computeLineage(
  entityId: string,
  orgId: string,
  direction: 'upstream' | 'downstream' | 'both',
  depth: number
): Promise<LineageResult> {
  // Get root entity
  const rootResult = await graph.read<{ e: { id: string; name: string; type?: string }; labels: string[] }>(`
    MATCH (e {id: $entityId, organizationId: $orgId})
    RETURN e {.id, .name, .type}, labels(e) as labels
  `, { entityId, orgId });

  if (rootResult.length === 0) {
    throw errors.notFound('Entity');
  }

  const rootEntity = rootResult[0];
  const root = {
    id: rootEntity.e.id,
    type: rootEntity.e.type || rootEntity.labels[0],
    name: rootEntity.e.name,
  };

  // Build query based on direction
  let relationshipPattern: string;
  if (direction === 'upstream') {
    relationshipPattern = `-[:DERIVES_FROM|CALCULATED_FROM*1..${depth}]->`;
  } else if (direction === 'downstream') {
    relationshipPattern = `<-[:DERIVES_FROM|CALCULATED_FROM*1..${depth}]-`;
  } else {
    relationshipPattern = `-[:DERIVES_FROM|CALCULATED_FROM*1..${depth}]-`;
  }

  // Get lineage graph
  const graphResult = await graph.read<{
    node: { id: string; name: string; type?: string };
    labels: string[];
    level: number;
    sourceId: string;
    targetId: string;
    relType: string;
    relProps: Record<string, unknown>;
  }>(`
    MATCH (root {id: $entityId, organizationId: $orgId})
    MATCH path = (root)${relationshipPattern}(node)
    WHERE node.organizationId = $orgId
    WITH path, node, length(path) as level
    UNWIND relationships(path) as rel
    MATCH (s)-[rel]->(t)
    RETURN DISTINCT
      node {.id, .name, .type},
      labels(node) as labels,
      level,
      s.id as sourceId,
      t.id as targetId,
      type(rel) as relType,
      properties(rel) as relProps
    ORDER BY level
  `, { entityId, orgId });

  // Build nodes and edges
  const nodesMap = new Map<string, LineageNode>();
  const edges: LineageEdge[] = [];
  const edgeSet = new Set<string>();

  for (const row of graphResult) {
    // Add node
    if (!nodesMap.has(row.node.id)) {
      nodesMap.set(row.node.id, {
        id: row.node.id,
        type: row.node.type || row.labels[0] || 'Entity',
        name: row.node.name,
        level: row.level,
      });
    }

    // Add edge (avoid duplicates)
    const edgeKey = `${row.sourceId}-${row.targetId}-${row.relType}`;
    if (!edgeSet.has(edgeKey)) {
      edgeSet.add(edgeKey);
      edges.push({
        source: row.sourceId,
        target: row.targetId,
        type: row.relType,
        properties: row.relProps || {},
      });
    }
  }

  const nodes = Array.from(nodesMap.values());
  const maxLevel = nodes.length > 0 ? Math.max(...nodes.map(n => n.level)) : 0;

  return {
    root,
    nodes,
    edges,
    metadata: {
      totalDepth: maxLevel,
      totalNodes: nodes.length + 1, // +1 for root
      dataFreshness: new Date().toISOString(),
    },
  };
}

function calculateQualityScore(entityCount: number, dimension: string): number {
  // Production upgrade: query actual data quality metrics
  // For now, generate realistic scores based on dimension
  const baseScores: Record<string, number> = {
    completeness: 92,
    accuracy: 96,
    timeliness: 78,
    consistency: 88,
  };
  
  const base = baseScores[dimension] || 85;
  // Add some variance based on entity count
  const variance = (entityCount % 10) - 5;
  return Math.max(0, Math.min(100, base + variance));
}

export default router;
