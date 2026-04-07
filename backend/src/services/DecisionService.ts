// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DECISION SERVICE (Community Edition — In-Memory)
// Full lifecycle management for enterprise decisions.
// =============================================================================

import crypto from 'crypto';
import { withFallback } from './_serviceProxy.js';

interface Decision {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  budget?: number;
  timeframe?: string;
  deadline?: Date;
  stakeholders?: string[];
  constraints?: string[];
  status: string;
  context: { description: string; stakeholders: string[] };
  analyses: any[];
  timeline: any[];
  createdAt: string;
  updatedAt: string;
}

const store = new Map<string, Decision>();

export const decisionService: any = withFallback({
  async createDecision(data: any): Promise<Decision> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const decision: Decision = {
      id,
      organizationId: data.organizationId || 'demo',
      userId: data.userId || 'demo-user',
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority || 'medium',
      budget: data.budget,
      timeframe: data.timeframe,
      deadline: data.deadline,
      stakeholders: data.stakeholders || [],
      constraints: data.constraints || [],
      status: 'draft',
      context: { description: data.description, stakeholders: data.stakeholders || [] },
      analyses: [],
      timeline: [{ event: 'created', timestamp: now, userId: data.userId }],
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, decision);
    return decision;
  },

  async getDecisions(
    orgId?: string,
    opts?: { status?: string; category?: string; limit?: number; offset?: number },
  ): Promise<Decision[]> {
    let items = [...store.values()];
    if (orgId) items = items.filter(d => d.organizationId === orgId);
    if (opts?.status) items = items.filter(d => d.status === opts.status);
    if (opts?.category) items = items.filter(d => d.category === opts.category);
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const offset = opts?.offset || 0;
    const limit = opts?.limit || 50;
    return items.slice(offset, offset + limit);
  },

  async getDecision(id: string): Promise<Decision | null> {
    return store.get(id) || null;
  },

  async updateDecision(id: string, userId: string, updates: Partial<Decision>): Promise<Decision | null> {
    const existing = store.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString(),
      timeline: [...existing.timeline, { event: 'updated', timestamp: new Date().toISOString(), userId }],
    };
    store.set(id, updated);
    return updated;
  },

  async addAnalysis(id: string, analysis: any): Promise<Decision | null> {
    const existing = store.get(id);
    if (!existing) return null;
    existing.analyses.push({ ...analysis, timestamp: new Date().toISOString() });
    existing.timeline.push({ event: 'analysis_added', timestamp: new Date().toISOString(), type: analysis.type });
    existing.updatedAt = new Date().toISOString();
    return existing;
  },

  async deleteDecision(id: string): Promise<boolean> {
    return store.delete(id);
  },
});

export const sportsDecisionService: any = withFallback({
  async analyze(data: any): Promise<any> {
    return { id: crypto.randomUUID(), type: 'sports', ...data, score: 85, createdAt: new Date().toISOString() };
  },
});

export class Player { [key: string]: any; }
export class Club { [key: string]: any; }
