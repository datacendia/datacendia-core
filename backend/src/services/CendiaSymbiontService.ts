// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA SYMBIONT SERVICE — Human-AI Collaboration & Entity Relationship Engine
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicFloat } from '../utils/deterministic.js';

interface Entity {
  id: string;
  organizationId: string;
  name: string;
  entityType: string;
  domain: string;
  health: number;
  metadata: Record<string, any>;
  createdAt: string;
}

interface Relationship {
  id: string;
  organizationId: string;
  sourceId: string;
  targetId: string;
  type: string;
  strength: number;
  description: string;
}

interface Opportunity {
  id: string;
  organizationId: string;
  entityId: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  potentialValue: number;
  detectedAt: string;
}

class CendiaSymbiontServiceImpl {
  private entities = new Map<string, Entity>();
  private relationships = new Map<string, Relationship>();
  private opportunities = new Map<string, Opportunity>();
  private allianceSimulations = new Map<string, any[]>();

  async addEntity(orgId: string, data: any): Promise<Entity> {
    const id = `ent-${crypto.randomUUID().slice(0, 8)}`;
    const entity: Entity = {
      id, organizationId: orgId,
      name: data.name || 'Unnamed Entity',
      entityType: data.entityType || 'agent',
      domain: data.domain || 'general',
      health: data.health ?? deterministicPercentage(75, 15, `health-${id}`),
      metadata: data.metadata || {},
      createdAt: new Date().toISOString(),
    };
    this.entities.set(id, entity);
    return entity;
  }

  async getEntities(orgId: string, filters: { entityType?: string; domain?: string; minHealth?: number }): Promise<Entity[]> {
    let results = [...this.entities.values()].filter(e => e.organizationId === orgId);
    if (filters.entityType) results = results.filter(e => e.entityType === filters.entityType);
    if (filters.domain) results = results.filter(e => e.domain === filters.domain);
    if (filters.minHealth) results = results.filter(e => e.health >= filters.minHealth!);
    return results;
  }

  async detectOpportunities(orgId: string, entityId: string): Promise<Opportunity[]> {
    const entity = this.entities.get(entityId);
    if (!entity || entity.organizationId !== orgId) throw new Error(`Entity ${entityId} not found`);
    const seed = `opp-${orgId}-${entityId}`;
    const types = ['optimization', 'collaboration', 'risk-reduction', 'automation', 'knowledge-transfer'];
    const detected: Opportunity[] = [];
    for (let i = 0; i < 3; i++) {
      const opp: Opportunity = {
        id: `opp-${crypto.randomUUID().slice(0, 8)}`,
        organizationId: orgId, entityId,
        type: deterministicPick(types, seed, `type-${i}`),
        title: `${deterministicPick(['Optimize', 'Enhance', 'Automate', 'Integrate', 'Improve'], seed, `title-${i}`)} ${entity.domain} ${deterministicPick(['workflow', 'process', 'collaboration', 'analysis'], seed, `suffix-${i}`)}`,
        description: `Opportunity detected for ${entity.name} in ${entity.domain} domain`,
        priority: deterministicPick(['low', 'medium', 'high'], seed, `pri-${i}`),
        status: 'detected',
        potentialValue: Math.round(deterministicFloat(seed, `val-${i}`) * 100000),
        detectedAt: new Date().toISOString(),
      };
      this.opportunities.set(opp.id, opp);
      detected.push(opp);
    }
    return detected;
  }

  async getOpportunities(orgId: string, status?: string): Promise<Opportunity[]> {
    let results = [...this.opportunities.values()].filter(o => o.organizationId === orgId);
    if (status) results = results.filter(o => o.status === status);
    return results;
  }

  async updateOpportunityStatus(orgId: string, oppId: string, status: string): Promise<Opportunity> {
    const opp = this.opportunities.get(oppId);
    if (!opp || opp.organizationId !== orgId) throw new Error(`Opportunity ${oppId} not found`);
    opp.status = status;
    return opp;
  }

  async simulateAlliance(orgId: string, oppId: string, simulationType?: string) {
    const opp = this.opportunities.get(oppId);
    if (!opp || opp.organizationId !== orgId) throw new Error(`Opportunity ${oppId} not found`);
    const seed = `alliance-${orgId}-${oppId}`;
    const sim = {
      id: `asim-${crypto.randomUUID().slice(0, 8)}`,
      opportunityId: oppId, simulationType: simulationType || 'partnership',
      outcome: deterministicPick(['synergistic', 'neutral', 'competitive', 'transformative'], seed),
      projectedValue: Math.round(deterministicFloat(seed, 'val') * 200000),
      riskLevel: deterministicPick(['low', 'medium', 'high'], seed, 'risk'),
      simulatedAt: new Date().toISOString(),
    };
    if (!this.allianceSimulations.has(oppId)) this.allianceSimulations.set(oppId, []);
    this.allianceSimulations.get(oppId)!.push(sim);
    return sim;
  }

  async getSimulations(orgId: string, oppId: string): Promise<any[]> {
    const opp = this.opportunities.get(oppId);
    if (opp && opp.organizationId !== orgId) throw new Error(`Opportunity ${oppId} not found`);
    return this.allianceSimulations.get(oppId) || [];
  }

  async createRelationship(orgId: string, entityId: string, relatedEntityId: string, relationshipType: string): Promise<Relationship> {
    return this.addRelationship(orgId, { sourceId: entityId, targetId: relatedEntityId, type: relationshipType });
  }

  async updateRelationshipHealth(orgId: string, relId: string, data: any): Promise<Relationship> {
    const rel = this.relationships.get(relId);
    if (!rel || rel.organizationId !== orgId) throw new Error(`Relationship ${relId} not found`);
    if (data.strength !== undefined) rel.strength = data.strength;
    if (data.description) rel.description = data.description;
    return rel;
  }

  async addRelationship(orgId: string, data: any): Promise<Relationship> {
    const id = `rel-${crypto.randomUUID().slice(0, 8)}`;
    const rel: Relationship = {
      id, organizationId: orgId,
      sourceId: data.sourceId, targetId: data.targetId,
      type: data.type || 'collaborates-with',
      strength: data.strength ?? deterministicFloat(`str-${id}`) * 0.5 + 0.5,
      description: data.description || '',
    };
    this.relationships.set(id, rel);
    return rel;
  }

  async getRelationships(orgId: string): Promise<Relationship[]> {
    return [...this.relationships.values()].filter(r => r.organizationId === orgId);
  }

  async getEntityRelationships(entityId: string): Promise<Relationship[]> {
    return [...this.relationships.values()].filter(r => r.sourceId === entityId || r.targetId === entityId);
  }

  async getEntity(entityId: string): Promise<Entity | undefined> {
    return this.entities.get(entityId);
  }

  async getDashboard(orgId: string) {
    const entities = await this.getEntities(orgId, {});
    const opportunities = await this.getOpportunities(orgId);
    const relationships = await this.getRelationships(orgId);
    return {
      entityCount: entities.length,
      opportunityCount: opportunities.length,
      relationshipCount: relationships.length,
      averageHealth: entities.length > 0
        ? Math.round(entities.reduce((s, e) => s + e.health, 0) / entities.length * 100) / 100
        : 0,
      topOpportunities: opportunities.sort((a, b) => b.potentialValue - a.potentialValue).slice(0, 5),
    };
  }
}

export const cendiaSymbiontService = new CendiaSymbiontServiceImpl();
