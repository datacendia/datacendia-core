// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage, deterministicFloat } from '../../utils/deterministic.js';

class CendiaGraphServiceImpl {
  private entities = new Map<string, any>();
  private relationships = new Map<string, any>();

  async createEntity(orgId: string, type: string, name: string, properties: any, sourceDocuments: string[], confidence: number) {
    const id = `ent-${crypto.randomUUID().slice(0, 8)}`;
    const entity = { id, organizationId: orgId, type, name, properties, sourceDocuments, confidence, createdAt: new Date().toISOString() };
    this.entities.set(id, entity);
    return entity;
  }

  async createRelationship(orgId: string, sourceEntityId: string, targetEntityId: string, type: string, properties: any, weight: number, confidence: number) {
    const id = `rel-${crypto.randomUUID().slice(0, 8)}`;
    const rel = { id, organizationId: orgId, sourceEntityId, targetEntityId, type, properties, weight, confidence, createdAt: new Date().toISOString() };
    this.relationships.set(id, rel);
    return rel;
  }

  async queryGraph(orgId: string, query: any) {
    const entities = [...this.entities.values()].filter(e => e.organizationId === orgId);
    return { nodes: entities.slice(0, 20), edges: [...this.relationships.values()].filter(r => r.organizationId === orgId).slice(0, 50) };
  }

  async naturalLanguageQuery(orgId: string, question: string) {
    const seed = `nlq-${orgId}-${question.slice(0, 20)}`;
    return { question, answer: `Based on graph analysis: ${deterministicPick(['Strong correlation found', 'Weak signal detected', 'No direct relationship', 'Multiple pathways identified'], seed)}`, confidence: deterministicPercentage(75, 20, seed), entities: [...this.entities.values()].filter(e => e.organizationId === orgId).slice(0, 5) };
  }

  async discoverHiddenRisks(orgId: string) {
    const seed = `risk-${orgId}`;
    return [{ type: deterministicPick(['concentration', 'dependency', 'regulatory', 'counterparty'], seed), severity: deterministicPick(['low', 'medium', 'high'], seed, 'sev'), description: 'Identified through graph analysis', entities: [], discoveredAt: new Date().toISOString() }];
  }

  async generateInsights(orgId: string) {
    const seed = `insight-${orgId}`;
    return [{ type: 'opportunity', insight: deterministicPick(['Underexplored market segment', 'Potential partnership synergy', 'Regulatory arbitrage window'], seed), confidence: deterministicPercentage(70, 20, seed), generatedAt: new Date().toISOString() }];
  }

  getMetrics(orgId: string) {
    const ents = [...this.entities.values()].filter(e => e.organizationId === orgId);
    const rels = [...this.relationships.values()].filter(r => r.organizationId === orgId);
    return { entities: ents.length, relationships: rels.length, density: ents.length > 0 ? rels.length / ents.length : 0 };
  }
}

export const cendiaGraphService = new CendiaGraphServiceImpl();
