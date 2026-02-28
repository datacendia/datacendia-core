// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Cortex Core API Client
 * Single gateway for all Services to access organizational data
 * Enforces: Sources → Pillars → Cortex → Services
 */

import { api } from './client';

// =============================================================================
// TYPES
// =============================================================================

export type PillarName = 'helm' | 'lineage' | 'predict' | 'flow' | 'health' | 'guard' | 'ethics' | 'agents';

export interface QueryContext {
  organizationId?: string;
  userId?: string;
  timeRange?: { start: string; end: string };
}

export interface QuerySource {
  pillar: PillarName;
  entities: number;
  executionMs: number;
}

// Query Types
export interface StructuredQuery {
  entity: string;
  fields?: string[];
  filter?: Record<string, any>;
  sort?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface QueryParams {
  intent: 'natural_language' | 'structured';
  query: string | StructuredQuery;
  pillars?: PillarName[];
  context?: QueryContext;
}

export interface QueryResponse {
  success: boolean;
  data: any;
  sources: QuerySource[];
  confidence?: number;
  executionMs: number;
}

// Analyze Types
export type AnalysisType = 'impact' | 'risk' | 'trend' | 'anomaly' | 'premortem' | 'cascade' | 'correlation';

export interface AnalyzeParams {
  type: AnalysisType;
  subject: { entityType: string; entityId?: string; data?: any };
  parameters?: { depth?: number; horizon?: string; scenarios?: any[]; threshold?: number };
  context?: QueryContext;
}

export interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  affectedEntities?: string[];
}

export interface Recommendation {
  id: string;
  priority: number;
  action: string;
  rationale: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: {
    summary: string;
    findings: Finding[];
    recommendations: Recommendation[];
    visualizationData?: any;
    score?: number;
  };
  pillarsConsulted: PillarName[];
  modelUsed?: string;
  executionMs: number;
}

// Simulate Types
export type SimulationType = 'forecast' | 'scenario' | 'monte_carlo' | 'stress_test' | 'what_if';

export interface SimulateParams {
  type: SimulationType;
  baseline: { entityType: string; entityId?: string; currentState?: any };
  changes: Array<{ variable: string; newValue: any; confidence?: number }>;
  horizon: string;
  iterations?: number;
  context?: QueryContext;
}

export interface Outcome {
  scenario: string;
  probability: number;
  impact: number;
  metrics: Record<string, number>;
  timeline?: Array<{ date: string; value: number }>;
}

export interface SimulateResponse {
  success: boolean;
  simulation: {
    outcomes: Outcome[];
    probabilityDistribution?: { mean: number; stdDev: number; percentiles: Record<string, number> };
    sensitivityAnalysis?: Array<{ variable: string; sensitivity: number }>;
    confidence: number;
    baselineValue?: number;
    projectedValue?: number;
  };
  pillarsConsulted: PillarName[];
  executionMs: number;
}

// Govern Types
export type GovernAction = 'check' | 'approve' | 'reject' | 'escalate' | 'audit';
export type GovernanceType = 'compliance' | 'ethics' | 'policy' | 'access' | 'risk';

export interface GovernParams {
  action: GovernAction;
  subject: { entityType: string; entityId: string; data?: any };
  governanceType: GovernanceType;
  parameters?: { frameworks?: string[]; policies?: string[]; approvers?: string[]; threshold?: number };
  context?: QueryContext;
  reason?: string;
}

export interface Violation {
  id: string;
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediation?: string;
}

export interface GovernResponse {
  success: boolean;
  result: {
    status: 'approved' | 'rejected' | 'pending' | 'escalated' | 'compliant' | 'non_compliant';
    violations: Violation[];
    requiredActions: Array<{ action: string; assignee?: string; deadline?: string }>;
    auditTrail: Array<{ timestamp: string; actor: string; action: string; details?: string }>;
    score?: number;
  };
  pillarsConsulted: PillarName[];
  executionMs: number;
}

// Context Types
export interface ContextOptions {
  depth?: number;
  include?: PillarName[];
  exclude?: PillarName[];
}

export interface ContextResponse {
  success: boolean;
  entity: { id: string; type: string; name: string; attributes: Record<string, any> };
  context: {
    helm?: { metrics: any[]; health: number; trends: any[] };
    lineage?: { upstream: any[]; downstream: any[]; quality: number };
    predict?: { forecasts: any[]; confidence: number };
    flow?: { workflows: any[]; executions: any[] };
    health?: { status: string; alerts: any[]; score: number };
    guard?: { riskScore: number; compliance: any; threats: any[] };
    ethics?: { lastReview: any; score: number; principles: any[] };
    agents?: { relevant: any[]; recommendations: any[] };
  };
  relationships: Array<{ type: string; targetId: string; targetName: string }>;
  timeline: Array<{ timestamp: string; event: string; pillar: PillarName }>;
  executionMs: number;
}

// Pillar Info
export interface PillarInfo {
  name: PillarName;
  description: string;
  status: 'active' | 'inactive' | 'degraded';
}

export interface CortexStatus {
  success: boolean;
  status: 'operational' | 'degraded' | 'down';
  version: string;
  engines: {
    query: string;
    analyze: string;
    simulate: string;
    govern: string;
    context: string;
  };
  timestamp: string;
}

// =============================================================================
// CORTEX API CLIENT
// =============================================================================

export const cortexApi = {
  /**
   * Query Engine - Universal query interface
   */
  query: async (params: QueryParams): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/cortex/query', params);
    return response.data || { success: false, data: null, sources: [], executionMs: 0 };
  },

  /**
   * Natural Language Query - Ask questions in plain English
   */
  ask: async (question: string, organizationId?: string): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/cortex/natural-language', { question, organizationId });
    return response.data || { success: false, data: null, sources: [], executionMs: 0 };
  },

  /**
   * Structured Query - Query specific pillars with filters
   */
  queryStructured: async (
    entity: string,
    options?: { pillars?: PillarName[]; filter?: Record<string, any>; limit?: number; context?: QueryContext }
  ): Promise<QueryResponse> => {
    return cortexApi.query({
      intent: 'structured',
      query: { entity, filter: options?.filter, limit: options?.limit },
      pillars: options?.pillars,
      context: options?.context,
    });
  },

  /**
   * Analyze Engine - AI-powered analysis
   */
  analyze: async (params: AnalyzeParams): Promise<AnalyzeResponse> => {
    const response = await api.post<AnalyzeResponse>('/cortex/analyze', params);
    return response.data || { success: false, analysis: { summary: '', findings: [], recommendations: [] }, pillarsConsulted: [], executionMs: 0 };
  },

  /**
   * Risk Analysis - Shortcut for risk analysis
   */
  analyzeRisk: async (entityType: string, entityId?: string, context?: QueryContext): Promise<AnalyzeResponse> => {
    return cortexApi.analyze({ type: 'risk', subject: { entityType, entityId }, context });
  },

  /**
   * Impact Analysis - Shortcut for impact analysis
   */
  analyzeImpact: async (entityType: string, entityId: string, depth?: number, context?: QueryContext): Promise<AnalyzeResponse> => {
    return cortexApi.analyze({ type: 'impact', subject: { entityType, entityId }, parameters: { depth }, context });
  },

  /**
   * Cascade Analysis - Analyze butterfly effects
   */
  analyzeCascade: async (change: any, depth?: number, context?: QueryContext): Promise<AnalyzeResponse> => {
    return cortexApi.analyze({ type: 'cascade', subject: { entityType: 'change', data: change }, parameters: { depth }, context });
  },

  /**
   * Simulate Engine - Run simulations
   */
  simulate: async (params: SimulateParams): Promise<SimulateResponse> => {
    const response = await api.post<SimulateResponse>('/cortex/simulate', params);
    return response.data || { success: false, simulation: { outcomes: [], confidence: 0 }, pillarsConsulted: [], executionMs: 0 };
  },

  /**
   * Forecast - Shortcut for forecasting
   */
  forecast: async (entityType: string, horizon: string, context?: QueryContext): Promise<SimulateResponse> => {
    return cortexApi.simulate({ type: 'forecast', baseline: { entityType }, changes: [], horizon, context });
  },

  /**
   * What-If Analysis - Test changes
   */
  whatIf: async (changes: Array<{ variable: string; newValue: any }>, horizon: string, context?: QueryContext): Promise<SimulateResponse> => {
    return cortexApi.simulate({ type: 'what_if', baseline: { entityType: 'scenario' }, changes, horizon, context });
  },

  /**
   * Govern Engine - Governance checks
   */
  govern: async (params: GovernParams): Promise<GovernResponse> => {
    const response = await api.post<GovernResponse>('/cortex/govern', params);
    return response.data || { success: false, result: { status: 'rejected', violations: [], requiredActions: [], auditTrail: [] }, pillarsConsulted: [], executionMs: 0 };
  },

  /**
   * Check Compliance - Shortcut for compliance check
   */
  checkCompliance: async (entityType: string, entityId: string, frameworks?: string[], context?: QueryContext): Promise<GovernResponse> => {
    return cortexApi.govern({ action: 'check', subject: { entityType, entityId }, governanceType: 'compliance', parameters: { frameworks }, context });
  },

  /**
   * Check Ethics - Shortcut for ethics check
   */
  checkEthics: async (entityType: string, entityId: string, context?: QueryContext): Promise<GovernResponse> => {
    return cortexApi.govern({ action: 'check', subject: { entityType, entityId }, governanceType: 'ethics', context });
  },

  /**
   * Context Engine - Get entity context
   */
  getContext: async (entityType: string, entityId: string, options?: ContextOptions): Promise<ContextResponse> => {
    const params = new URLSearchParams();
    if (options?.depth) {params.append('depth', options.depth.toString());}
    if (options?.include) {params.append('include', options.include.join(','));}
    if (options?.exclude) {params.append('exclude', options.exclude.join(','));}
    
    const url = `/cortex/context/${entityType}/${entityId}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get<ContextResponse>(url);
    return response.data || { success: false, entity: { id: '', type: '', name: '', attributes: {} }, context: {}, relationships: [], timeline: [], executionMs: 0 };
  },

  /**
   * Get available pillars
   */
  getPillars: async (): Promise<{ success: boolean; pillars: PillarInfo[] }> => {
    const response = await api.get<{ success: boolean; pillars: PillarInfo[] }>('/cortex/pillars');
    return response.data || { success: false, pillars: [] };
  },

  /**
   * Get Cortex status
   */
  getStatus: async (): Promise<CortexStatus> => {
    const response = await api.get<CortexStatus>('/cortex/status');
    return response.data || { success: false, status: 'down', version: '0.0.0', engines: { query: 'down', analyze: 'down', simulate: 'down', govern: 'down', context: 'down' }, timestamp: new Date().toISOString() };
  },
};

// Export default
export default cortexApi;
