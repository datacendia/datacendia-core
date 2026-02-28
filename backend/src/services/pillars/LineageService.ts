// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - THE LINEAGE SERVICE
// Data Provenance - Track data origins and transformations
// Enterprise Platinum Intelligence - PostgreSQL Persistent Storage
// =============================================================================

import { PrismaClient, Prisma } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type EntityType = 'dataset' | 'table' | 'column' | 'report' | 'metric' | 'model' | 'pipeline' | 'api';
export type RelationshipType = 'derives_from' | 'transforms_to' | 'depends_on' | 'feeds' | 'uses';
export type DataQualityLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';

export interface LineageEntity {
  id: string;
  organizationId: string;
  name: string;
  type: EntityType;
  description: string;
  source: string;
  schema?: Record<string, string>;
  qualityScore: number;
  qualityLevel: DataQualityLevel;
  lastUpdated: Date;
  recordCount?: number;
  metadata: Record<string, unknown>;
}

export interface LineageRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  transformations?: string[];
  confidence: number;
  createdAt: Date;
}

export interface LineageGraph {
  entities: LineageEntity[];
  relationships: LineageRelationship[];
  rootEntities: string[];
  leafEntities: string[];
}

export interface DataQualityReport {
  entityId: string;
  entityName: string;
  overallScore: number;
  dimensions: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
  };
  issues: DataQualityIssue[];
  lastChecked: Date;
}

export interface DataQualityIssue {
  id: string;
  type: 'missing' | 'invalid' | 'inconsistent' | 'stale' | 'duplicate';
  severity: 'high' | 'medium' | 'low';
  field?: string;
  description: string;
  affectedRecords: number;
  suggestedFix?: string;
}

// Prisma enum mapping
const entityTypeMap: Record<EntityType, string> = {
  dataset: 'DATASET', table: 'TABLE', column: 'COLUMN', report: 'REPORT',
  metric: 'METRIC', model: 'MODEL', pipeline: 'PIPELINE', api: 'API'
};
const reverseEntityTypeMap: Record<string, EntityType> = Object.fromEntries(
  Object.entries(entityTypeMap).map(([k, v]) => [v, k as EntityType])
);
const relTypeMap: Record<RelationshipType, string> = {
  derives_from: 'DERIVES_FROM', transforms_to: 'TRANSFORMS_TO',
  depends_on: 'DEPENDS_ON', feeds: 'FEEDS', uses: 'USES'
};
const reverseRelTypeMap: Record<string, RelationshipType> = Object.fromEntries(
  Object.entries(relTypeMap).map(([k, v]) => [v, k as RelationshipType])
);
const qualityLevelMap: Record<DataQualityLevel, string> = {
  excellent: 'EXCELLENT', good: 'GOOD', fair: 'FAIR', poor: 'POOR', unknown: 'UNKNOWN'
};
const reverseQualityLevelMap: Record<string, DataQualityLevel> = Object.fromEntries(
  Object.entries(qualityLevelMap).map(([k, v]) => [v, k as DataQualityLevel])
);

// =============================================================================
// THE LINEAGE SERVICE - PRISMA BACKED
// =============================================================================

export class LineageService extends BaseService {
  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'lineage-service',
      version: '2.0.0',
      dependencies: ['prisma'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Lineage service initializing with PostgreSQL...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Lineage service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const entityCount = await prisma.lineage_entities.count();
    const relCount = await prisma.lineage_relationships.count();
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { entities: entityCount, relationships: relCount },
    };
  }

  // ===========================================================================
  // ENTITY MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async createEntity(entity: Omit<LineageEntity, 'id' | 'qualityLevel' | 'lastUpdated'>): Promise<LineageEntity> {
    const qualityLevel = this.scoreToLevel(entity.qualityScore);
    
    const created = await prisma.lineage_entities.create({
      data: {
        organization_id: entity.organizationId,
        name: entity.name,
        entity_type: entityTypeMap[entity.type] as any,
        description: entity.description || '',
        source: entity.source,
        schema_def: entity.schema || {},
        quality_score: entity.qualityScore,
        quality_level: qualityLevelMap[qualityLevel] as any,
        record_count: entity.recordCount,
        metadata: (entity.metadata as unknown as Prisma.InputJsonValue) || {},
      },
    });

    return this.mapEntity(created);
  }

  async getEntity(entityId: string): Promise<LineageEntity | null> {
    const entity = await prisma.lineage_entities.findUnique({
      where: { id: entityId },
    });
    return entity ? this.mapEntity(entity) : null;
  }

  async getEntities(organizationId: string, type?: EntityType): Promise<LineageEntity[]> {
    const where: any = { organization_id: organizationId };
    if (type) where.entity_type = entityTypeMap[type];

    const entities = await prisma.lineage_entities.findMany({ where });
    return entities.map((e: any) => this.mapEntity(e));
  }

  async updateEntity(entityId: string, updates: Partial<LineageEntity>): Promise<LineageEntity | null> {
    const data: any = {};
    if (updates.name) data.name = updates.name;
    if (updates.description) data.description = updates.description;
    if (updates.source) data.source = updates.source;
    if (updates.qualityScore !== undefined) {
      data.quality_score = updates.qualityScore;
      data.quality_level = qualityLevelMap[this.scoreToLevel(updates.qualityScore)] as any;
    }
    if (updates.recordCount !== undefined) data.record_count = updates.recordCount;
    if (updates.metadata) {
      data.metadata = updates.metadata as unknown as Prisma.InputJsonValue;
    }

    const updated = await prisma.lineage_entities.update({
      where: { id: entityId },
      data,
    });

    return this.mapEntity(updated);
  }

  // ===========================================================================
  // RELATIONSHIP MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async createRelationship(relationship: Omit<LineageRelationship, 'id' | 'createdAt'>): Promise<LineageRelationship> {
    const created = await prisma.lineage_relationships.create({
      data: {
        source_id: relationship.sourceId,
        target_id: relationship.targetId,
        relationship_type: relTypeMap[relationship.type] as any,
        transformations: relationship.transformations || [],
        confidence: relationship.confidence,
      },
    });

    return this.mapRelationship(created);
  }

  async getUpstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = await prisma.lineage_relationships.findMany({
      where: { target_id: entityId },
      include: { source_entity: true },
    });
    
    return relationships.map((r: any) => this.mapEntity(r.sourceEntity));
  }

  async getDownstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = await prisma.lineage_relationships.findMany({
      where: { source_id: entityId },
      include: { target_entity: true },
    });
    
    return relationships.map((r: any) => this.mapEntity(r.targetEntity));
  }

  // ===========================================================================
  // LINEAGE GRAPH - PRISMA BACKED
  // ===========================================================================

  async getLineageGraph(organizationId: string): Promise<LineageGraph> {
    const entities = await this.getEntities(organizationId);
    const entityIds = entities.map(e => e.id);
    
    const relationships = await prisma.lineage_relationships.findMany({
      where: {
        AND: [
          { source_id: { in: entityIds } },
          { target_id: { in: entityIds } },
        ],
      },
    });

    const rels = relationships.map((r: any) => this.mapRelationship(r));
    const targetIds = new Set(rels.map(r => r.targetId));
    const sourceIds = new Set(rels.map(r => r.sourceId));

    return {
      entities,
      relationships: rels,
      rootEntities: entities.filter(e => !targetIds.has(e.id)).map(e => e.id),
      leafEntities: entities.filter(e => !sourceIds.has(e.id)).map(e => e.id),
    };
  }

  async traceLineage(entityId: string, direction: 'upstream' | 'downstream' | 'both'): Promise<LineageGraph> {
    const visited = new Set<string>();
    const entities: LineageEntity[] = [];
    const relationships: LineageRelationship[] = [];

    const traverse = async (id: string, dir: 'upstream' | 'downstream') => {
      if (visited.has(id)) return;
      visited.add(id);

      const entity = await this.getEntity(id);
      if (!entity) return;
      entities.push(entity);

      const rels = dir === 'upstream'
        ? await prisma.lineage_relationships.findMany({ where: { target_id: id } })
        : await prisma.lineage_relationships.findMany({ where: { source_id: id } });

      for (const rel of rels) {
        relationships.push(this.mapRelationship(rel));
        const nextId = dir === 'upstream' ? rel.source_id : rel.target_id;
        await traverse(nextId, dir);
      }
    };

    if (direction === 'upstream' || direction === 'both') {
      await traverse(entityId, 'upstream');
    }
    
    visited.clear();
    
    if (direction === 'downstream' || direction === 'both') {
      await traverse(entityId, 'downstream');
    }

    return { entities, relationships, rootEntities: [], leafEntities: [] };
  }

  // ===========================================================================
  // DATA QUALITY - PRISMA BACKED
  // ===========================================================================

  async checkDataQuality(entityId: string): Promise<DataQualityReport> {
    const entity = await this.getEntity(entityId);
    if (!entity) throw new Error('Entity not found');

    // Real quality check would analyze actual data
    // For now, we compute based on entity metadata patterns
    const hasSchema = entity.schema && Object.keys(entity.schema).length > 0;
    const hasRecordCount = entity.recordCount && entity.recordCount > 0;
    
    const completeness = hasSchema ? 95 : 80;
    const accuracy = hasRecordCount ? 92 : 85;
    const consistency = 90;
    const timeliness = entity.lastUpdated > new Date(Date.now() - 86400000) ? 95 : 75;
    const validity = hasSchema ? 93 : 82;

    const overallScore = (completeness + accuracy + consistency + timeliness + validity) / 5;
    const issues: DataQualityIssue[] = [];

    if (completeness < 90) {
      issues.push({
        id: `issue-${Date.now()}-1`,
        type: 'missing',
        severity: 'medium',
        description: 'Schema definition incomplete',
        affectedRecords: 0,
        suggestedFix: 'Add schema definition to entity',
      });
    }

    // Store report in database (manual upsert by entity_id)
    const existingReport = await prisma.data_quality_reports.findFirst({
      where: { entity_id: entityId },
    });

    const data = {
      overall_score: overallScore,
      completeness,
      accuracy,
      consistency,
      timeliness,
      validity,
      issues: issues as unknown as Prisma.InputJsonValue,
      checked_at: new Date(),
    };

    if (existingReport) {
      await prisma.data_quality_reports.update({
        where: { id: existingReport.id },
        data,
      });
    } else {
      await prisma.data_quality_reports.create({
        data: {
          entity_id: entityId,
          ...data,
        },
      });
    }

    return {
      entityId,
      entityName: entity.name,
      overallScore: Math.round(overallScore),
      dimensions: { completeness, accuracy, consistency, timeliness, validity },
      issues,
      lastChecked: new Date(),
    };
  }

  async getQualityReport(entityId: string): Promise<DataQualityReport | null> {
    const report = await prisma.data_quality_reports.findFirst({
      where: { entity_id: entityId },
      include: { entity: true },
    });
    
    if (!report) return null;

    return {
      entityId: report.entity_id,
      entityName: (report as any).entity?.name || 'Unknown',
      overallScore: report.overall_score,
      dimensions: {
        completeness: report.completeness,
        accuracy: report.accuracy,
        consistency: report.consistency,
        timeliness: report.timeliness,
        validity: report.validity,
      },
      issues: (report.issues as any) || [],
      lastChecked: report.checked_at,
    };
  }

  async getQualityOverview(organizationId: string): Promise<{
    avgScore: number;
    totalEntities: number;
    byLevel: Record<DataQualityLevel, number>;
    recentIssues: DataQualityIssue[];
  }> {
    const entities = await this.getEntities(organizationId);
    const byLevel: Record<DataQualityLevel, number> = {
      excellent: 0, good: 0, fair: 0, poor: 0, unknown: 0
    };

    let totalScore = 0;
    const recentIssues: DataQualityIssue[] = [];

    for (const entity of entities) {
      byLevel[entity.qualityLevel]++;
      totalScore += entity.qualityScore;
    }

    // Get recent quality reports with issues
    const reports = await prisma.data_quality_reports.findMany({
      where: { entity_id: { in: entities.map(e => e.id) } },
      orderBy: { checked_at: 'desc' },
      take: 10,
    });

    for (const report of reports) {
      const issues = (report.issues as any[]) || [];
      recentIssues.push(...issues);
    }

    return {
      avgScore: entities.length > 0 ? Math.round(totalScore / entities.length) : 0,
      totalEntities: entities.length,
      byLevel,
      recentIssues: recentIssues.slice(0, 10),
    };
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private scoreToLevel(score: number): DataQualityLevel {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 50) return 'poor';
    return 'unknown';
  }

  private mapEntity(e: any): LineageEntity {
    return {
      id: e.id,
      organizationId: e.organizationId,
      name: e.name,
      type: reverseEntityTypeMap[e.entityType] || 'dataset',
      description: e.description || '',
      source: e.source,
      schema: e.schemaDef as Record<string, string>,
      qualityScore: e.qualityScore,
      qualityLevel: reverseQualityLevelMap[e.qualityLevel] || 'unknown',
      lastUpdated: e.updatedAt,
      recordCount: e.recordCount,
      metadata: e.metadata as Record<string, unknown>,
    };
  }

  private mapRelationship(r: any): LineageRelationship {
    return {
      id: r.id,
      sourceId: r.sourceId,
      targetId: r.targetId,
      type: reverseRelTypeMap[r.relationshipType] || 'depends_on',
      transformations: r.transformations as string[],
      confidence: r.confidence,
      createdAt: r.createdAt,
    };
  }

  // No seed method - Enterprise Platinum standard
  // Data is created only through real API operations

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getDataSources(organizationId: string): Promise<LineageEntity[]> {
    return this.getEntities(organizationId, 'dataset');
  }

  async traceDataFlow(sourceId: string): Promise<{ upstream: LineageEntity[]; downstream: LineageEntity[] }> {
    const upstream = await this.getUpstream(sourceId);
    const downstream = await this.getDownstream(sourceId);
    return { upstream, downstream };
  }

  // ===========================================================================
  // IMPACT ANALYSIS
  // ===========================================================================

  async analyzeImpact(entityId: string): Promise<{
    sourceEntity: LineageEntity;
    directDownstream: LineageEntity[];
    transitiveDownstream: LineageEntity[];
    impactedReports: LineageEntity[];
    impactedModels: LineageEntity[];
    impactedPipelines: LineageEntity[];
    riskAssessment: {
      totalAffected: number;
      highQualityAffected: number;
      lowQualityAffected: number;
      criticalPathLength: number;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
    };
    recommendations: string[];
  }> {
    const entity = await this.getEntity(entityId);
    if (!entity) throw new Error('Entity not found');

    // Get full downstream graph
    const graph = await this.traceLineage(entityId, 'downstream');
    const allDownstream = graph.entities.filter(e => e.id !== entityId);

    // Direct downstream
    const directDownstream = await this.getDownstream(entityId);

    // Categorize affected entities
    const impactedReports = allDownstream.filter(e => e.type === 'report');
    const impactedModels = allDownstream.filter(e => e.type === 'model');
    const impactedPipelines = allDownstream.filter(e => e.type === 'pipeline');

    // Risk assessment
    const highQuality = allDownstream.filter(e => e.qualityScore >= 85);
    const lowQuality = allDownstream.filter(e => e.qualityScore < 70);

    // Calculate critical path length (longest dependency chain)
    let criticalPathLength = 0;
    const visited = new Set<string>();
    const measureDepth = async (id: string, depth: number): Promise<number> => {
      if (visited.has(id)) return depth;
      visited.add(id);
      const downstream = await this.getDownstream(id);
      if (downstream.length === 0) return depth;
      let maxDepth = depth;
      for (const d of downstream) {
        const childDepth = await measureDepth(d.id, depth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
      return maxDepth;
    };
    criticalPathLength = await measureDepth(entityId, 0);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (allDownstream.length > 20 || impactedReports.length > 5) riskLevel = 'critical';
    else if (allDownstream.length > 10 || impactedModels.length > 2) riskLevel = 'high';
    else if (allDownstream.length > 3) riskLevel = 'medium';

    const recommendations: string[] = [];
    if (riskLevel === 'critical') recommendations.push(`Changes to "${entity.name}" will affect ${allDownstream.length} downstream entities — coordinate with all stakeholders`);
    if (impactedModels.length > 0) recommendations.push(`${impactedModels.length} ML model(s) depend on this data — validate model accuracy after changes`);
    if (impactedReports.length > 0) recommendations.push(`${impactedReports.length} report(s) will be affected — schedule report regeneration`);
    if (lowQuality.length > 0) recommendations.push(`${lowQuality.length} downstream entity/entities already have low quality scores — prioritize quality improvements`);
    if (criticalPathLength > 5) recommendations.push(`Deep dependency chain (${criticalPathLength} levels) — consider breaking long chains`);
    if (recommendations.length === 0) recommendations.push('Low impact — changes can proceed with standard validation');

    return {
      sourceEntity: entity,
      directDownstream,
      transitiveDownstream: allDownstream,
      impactedReports,
      impactedModels,
      impactedPipelines,
      riskAssessment: {
        totalAffected: allDownstream.length,
        highQualityAffected: highQuality.length,
        lowQualityAffected: lowQuality.length,
        criticalPathLength,
        riskLevel,
      },
      recommendations,
    };
  }

  // ===========================================================================
  // CHANGE PROPAGATION
  // ===========================================================================

  async trackChangePropagation(entityId: string, changeType: 'schema' | 'data' | 'quality' | 'source'): Promise<{
    entityId: string;
    changeType: string;
    propagationPath: Array<{ entityId: string; entityName: string; entityType: EntityType; depth: number; estimatedImpact: 'none' | 'low' | 'medium' | 'high' }>;
    totalAffected: number;
    notificationsRequired: string[];
  }> {
    const entity = await this.getEntity(entityId);
    if (!entity) throw new Error('Entity not found');

    const graph = await this.traceLineage(entityId, 'downstream');
    const propagationPath: Array<{
      entityId: string; entityName: string; entityType: EntityType;
      depth: number; estimatedImpact: 'none' | 'low' | 'medium' | 'high';
    }> = [];

    // BFS to track propagation with depth
    const queue: Array<{ id: string; depth: number }> = [{ id: entityId, depth: 0 }];
    const visited = new Set<string>([entityId]);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      const downstream = await this.getDownstream(id);

      for (const d of downstream) {
        if (visited.has(d.id)) continue;
        visited.add(d.id);

        let estimatedImpact: 'none' | 'low' | 'medium' | 'high' = 'low';
        if (changeType === 'schema') estimatedImpact = d.type === 'model' ? 'high' : 'medium';
        else if (changeType === 'data') estimatedImpact = depth < 2 ? 'high' : 'medium';
        else if (changeType === 'quality') estimatedImpact = d.qualityScore < 70 ? 'high' : 'low';

        propagationPath.push({
          entityId: d.id,
          entityName: d.name,
          entityType: d.type,
          depth: depth + 1,
          estimatedImpact,
        });

        queue.push({ id: d.id, depth: depth + 1 });
      }
    }

    const notificationsRequired = propagationPath
      .filter(p => p.estimatedImpact === 'high')
      .map(p => `High impact on ${p.entityType} "${p.entityName}" at depth ${p.depth}`);

    return {
      entityId,
      changeType,
      propagationPath,
      totalAffected: propagationPath.length,
      notificationsRequired,
    };
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    serviceName: string;
    status: string;
    entities: { total: number; byType: Record<string, number>; avgQuality: number };
    relationships: { total: number; byType: Record<string, number> };
    quality: { avgScore: number; byLevel: Record<string, number>; issueCount: number };
    graph: { rootEntities: number; leafEntities: number; maxDepth: number };
    recentUpdates: Array<{ id: string; name: string; type: string; qualityScore: number; lastUpdated: Date }>;
    insights: string[];
  }> {
    const entities = await this.getEntities(organizationId);
    const graph = await this.getLineageGraph(organizationId);
    const qualityOverview = await this.getQualityOverview(organizationId);

    const byType: Record<string, number> = {};
    for (const e of entities) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    }

    const relByType: Record<string, number> = {};
    for (const r of graph.relationships) {
      relByType[r.type] = (relByType[r.type] || 0) + 1;
    }

    const recentUpdates = entities
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 10)
      .map(e => ({ id: e.id, name: e.name, type: e.type, qualityScore: e.qualityScore, lastUpdated: e.lastUpdated }));

    const insights: string[] = [];
    const poorQuality = entities.filter(e => e.qualityLevel === 'poor');
    if (poorQuality.length > 0) insights.push(`${poorQuality.length} entity/entities with poor data quality — remediation recommended`);
    if (graph.rootEntities.length === 0 && entities.length > 0) insights.push('No root data sources identified — verify lineage completeness');
    const staleEntities = entities.filter(e => e.lastUpdated.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (staleEntities.length > 0) insights.push(`${staleEntities.length} entity/entities not updated in 7+ days`);
    if (insights.length === 0) insights.push('Data lineage tracking is up to date');

    return {
      serviceName: 'Lineage',
      status: poorQuality.length > 0 ? 'attention' : 'healthy',
      entities: {
        total: entities.length,
        byType,
        avgQuality: qualityOverview.avgScore,
      },
      relationships: {
        total: graph.relationships.length,
        byType: relByType,
      },
      quality: {
        avgScore: qualityOverview.avgScore,
        byLevel: qualityOverview.byLevel as unknown as Record<string, number>,
        issueCount: qualityOverview.recentIssues.length,
      },
      graph: {
        rootEntities: graph.rootEntities.length,
        leafEntities: graph.leafEntities.length,
        maxDepth: 0, // Would require full graph traversal
      },
      recentUpdates,
      insights,
    };
  }
}

export const lineageService = new LineageService();
