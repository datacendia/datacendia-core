// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Datacendia API - Main Export
 * Unified API client for all Datacendia services
 */

import { api, tokenManager, onAuthChange } from './client';
import type * as Types from './types';

// Re-export types
export * from './types';
export { api, tokenManager, onAuthChange };

// ============================================================================
// AUTH API
// ============================================================================
export const authApi = {
  async login(credentials: Types.LoginRequest) {
    const response = await api.post<Types.LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }
    return response;
  },

  async register(data: Types.RegisterRequest) {
    const response = await api.post<Types.LoginResponse>('/auth/register', data);
    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }
    return response;
  },

  async logout() {
    await api.post('/auth/logout');
    tokenManager.clearTokens();
  },

  async getCurrentUser() {
    return api.get<Types.User>('/auth/me');
  },

  isAuthenticated: () => tokenManager.isAuthenticated(),
};

// ============================================================================
// GRAPH API
// ============================================================================
const mapGraphEntity = (raw: any): Types.GraphEntity => {
  const props = (raw.properties ?? raw ?? {}) as any;

  const id = String(
    props.id ?? raw.id ?? raw.elementId ?? `node-${crypto.randomUUID().slice(0, 8)}`
  );

  const rawType = (props.type ??
    raw.type ??
    (Array.isArray(raw.labels) ? raw.labels[0] : 'entity')) as string;
  const type = (rawType || 'entity').toString().toLowerCase();

  const name = (props.name ?? props.table ?? id ?? 'Unnamed') as string;

  const createdAtVal = (props.createdAt ?? raw.createdAt) as string | undefined;
  const updatedAtVal = (props.updatedAt ?? raw.updatedAt ?? createdAtVal) as string | undefined;

  const now = new Date().toISOString();

  return {
    id,
    type,
    name,
    properties: props,
    createdAt: createdAtVal && typeof createdAtVal === 'string' ? createdAtVal : now,
    updatedAt: updatedAtVal && typeof updatedAtVal === 'string' ? updatedAtVal : now,
  };
};

export const graphApi = {
  async getEntities(params?: { type?: string; search?: string; page?: number; pageSize?: number }) {
    const response = await api.get<any[]>('/graph/entities', params);

    if (response.success && response.data) {
      const mapped = response.data.map(mapGraphEntity);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async getEntity(id: string) {
    return api.get<Types.GraphEntity>(`/graph/entities/${id}`);
  },

  async createEntity(data: { type: string; name: string; properties?: Record<string, unknown> }) {
    return api.post<Types.GraphEntity>('/graph/entities', data);
  },

  async updateEntity(id: string, data: { name?: string; properties?: Record<string, unknown> }) {
    return api.put<Types.GraphEntity>(`/graph/entities/${id}`, data);
  },

  async deleteEntity(id: string) {
    return api.delete(`/graph/entities/${id}`);
  },

  async getNeighbors(
    id: string,
    params?: { direction?: 'incoming' | 'outgoing' | 'both'; depth?: number }
  ) {
    return api.get<Types.GraphEntity[]>(`/graph/entities/${id}/neighbors`, params);
  },

  async createRelationship(data: {
    sourceId: string;
    targetId: string;
    type: string;
    properties?: Record<string, unknown>;
  }) {
    return api.post<Types.GraphRelationship>('/graph/relationships', data);
  },

  async search(query: string) {
    const response = await api.get<any[]>('/graph/search', { q: query });

    if (response.success && response.data) {
      const mapped = response.data.map(mapGraphEntity);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async executeQuery(cypher: string, parameters?: Record<string, unknown>) {
    return api.post<unknown>('/graph/query', { query: cypher, parameters });
  },

  /**
   * Get real-time knowledge graph statistics from Neo4j
   */
  async getStats() {
    return api.get<{
      entities: number;
      relationships: number;
      dataPoints: number;
      freshness: number;
      labels: string[];
      entityTypes: Array<{ type: string; count: number }>;
      timestamp: string;
    }>('/graph/stats');
  },
};

// ============================================================================
// LINEAGE API
// ============================================================================
export const lineageApi = {
  async getLineage(
    entityId: string,
    params?: { direction?: 'upstream' | 'downstream' | 'both'; depth?: number }
  ) {
    return api.get<Types.LineageResult>(`/lineage/${entityId}`, params);
  },

  async getImpact(entityId: string) {
    return api.get<Types.ImpactAnalysis>(`/lineage/${entityId}/impact`);
  },

  async getTransformations(entityId: string) {
    return api.get<{ entityId: string; transformations: unknown[]; totalTransformations: number }>(
      `/lineage/${entityId}/transformations`
    );
  },

  async getQuality(entityId: string) {
    return api.get<{
      entityId: string;
      overallScore: number;
      dimensions: Record<string, number>;
      issues: unknown[];
    }>(`/lineage/${entityId}/quality`);
  },
};

// ============================================================================
// COUNCIL API (AI Agents)
// ============================================================================
const mapDeliberation = (d: any): Types.Deliberation => {
  const rawStatus = String(d.status ?? 'PENDING').toUpperCase();
  let status: Types.Deliberation['status'];
  switch (rawStatus) {
    case 'IN_PROGRESS':
      status = 'in_progress';
      break;
    case 'COMPLETED':
      status = 'completed';
      break;
    case 'CANCELLED':
      status = 'cancelled';
      break;
    case 'PENDING':
    default:
      status = 'pending';
      break;
  }

  const phase = (d.current_phase ?? 'initial_analysis') as Types.Deliberation['phase'];

  const result = d.decision
    ? {
        decision: typeof d.decision === 'string' ? d.decision : JSON.stringify(d.decision),
        confidence: d.confidence ?? 0,
        dissent: undefined,
      }
    : undefined;

  return {
    id: d.id,
    question: d.question,
    status,
    phase,
    progress: typeof d.progress === 'number' ? d.progress : 0,
    agents: Array.isArray(d.agents) ? d.agents : [],
    result,
    startedAt: (d.started_at ?? d.created_at ?? new Date().toISOString()) as string,
    completedAt: d.completed_at ?? undefined,
  };
};

const mapDeliberationMessage = (phase: string, m: any): Types.DeliberationMessage => ({
  id: m.id,
  agentId: m.agent?.id ?? m.agentId ?? m.agent_id,
  phase,
  content: m.content,
  sources: (m.sources ?? []) as Array<{ entityId: string; name: string; relevance: number }>,
  confidence: m.confidence ?? 0,
  timestamp: (m.timestamp ?? m.created_at ?? new Date().toISOString()) as string,
});

export const councilApi = {
  async getAgents() {
    return api.get<Types.Agent[]>('/council/agents');
  },

  async getAgentStatus(agentId: string) {
    return api.get<{ status: 'online' | 'offline' | 'busy' }>(`/council/agents/${agentId}/status`);
  },

  async submitQuery(data: {
    query: string;
    agents?: string[];
    context?: Record<string, unknown>;
    language?: string;
  }) {
    return api.post<Types.CouncilQuery>('/council/query', data);
  },

  async startDeliberation(data: {
    question: string;
    agents: string[];
    config?: { maxDuration?: number; requireConsensus?: boolean };
    language?: string;
  }) {
    // Backend returns a lightweight status object; keep return type untyped for now.
    return api.post<any>('/council/deliberations', data);
  },

  async getDeliberation(id: string) {
    const response = await api.get<any>(`/council/deliberations/${id}`);

    if (response.success && response.data) {
      const mapped = mapDeliberation(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response as any;
  },

  async getDeliberationTranscript(id: string) {
    const response = await api.get<any>(`/council/deliberations/${id}/transcript`);

    if (response.success && response.data && response.data.phases) {
      const phasesObj = response.data.phases as Record<string, any[]>;
      const phases = Object.entries(phasesObj).map(([phaseKey, msgs]) => ({
        phase: phaseKey,
        messages: (msgs ?? []).map((m) => mapDeliberationMessage(phaseKey, m)),
      }));

      return { ...response, data: { phases } } as typeof response;
    }

    return response as any;
  },

  async controlDeliberation(
    id: string,
    action: 'pause' | 'resume' | 'skip_to_synthesis' | 'cancel'
  ) {
    return api.post(`/council/deliberations/${id}/control`, { action });
  },

  async getActiveDeliberations() {
    return api.get<Types.Deliberation[]>('/council/deliberations/active');
  },

  async getAllDeliberations(limit?: number, status?: string) {
    const params: Record<string, string | number> = {};
    if (limit) {params.limit = limit;}
    if (status) {params.status = status;}
    return api.get<Types.Deliberation[]>('/council/deliberations', params);
  },

  async getRecentDecisions(limit?: number) {
    return api.get<Types.CouncilDecisionSummary[]>(
      '/council/decisions/recent',
      limit ? { limit } : undefined
    );
  },

  async addUserIntervention(
    deliberationId: string,
    data: {
      role: { code: string; title: string; department: string; icon: string };
      content: string;
      type: string;
    }
  ) {
    return api.post(`/council/deliberations/${deliberationId}/intervention`, data);
  },

  async saveDeliberation(data: {
    question: string;
    mode: string;
    agentResponses: unknown[];
    crossExaminations: unknown[];
    synthesis: string;
    confidence: number;
  }) {
    return api.post<any>('/council/deliberations/save', data);
  },

  async generateExecutiveSummary(deliberationId: string) {
    return api.post<any>(`/council/deliberations/${deliberationId}/summary`);
  },

  async generateMinutes(deliberationId: string) {
    return api.post<any>(`/council/deliberations/${deliberationId}/minutes`);
  },
};

// ============================================================================
// METRICS API
// ============================================================================
const mapMetricDefinition = (m: any): Types.MetricDefinition => ({
  id: m.id,
  code: m.code,
  name: m.name,
  description: m.description ?? undefined,
  formula: m.formula ?? {},
  unit: m.unit ?? undefined,
  category: m.category ?? undefined,
  thresholds: (m.thresholds ?? {}) as { warning?: number; critical?: number },
  ownerId: m.owner_id ?? undefined,
  refreshSchedule: m.refresh_schedule ?? undefined,
  createdAt: m.created_at,
});

export const metricsApi = {
  async getMetrics(params?: { organizationId?: string; category?: string; search?: string; page?: number }) {
    const response = await api.get<any[]>('/metrics', params);

    if (response.success && response.data) {
      const mapped = response.data.map(mapMetricDefinition);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async getKeyMetrics() {
    return api.get<Array<Types.MetricDefinition & { currentValue: number; change: number }>>(
      '/metrics/key'
    );
  },

  async getMetric(id: string) {
    return api.get<Types.MetricDefinition>(`/metrics/${id}`);
  },

  async createMetric(data: Partial<Types.MetricDefinition>) {
    return api.post<Types.MetricDefinition>('/metrics', data);
  },

  async calculateMetric(
    id: string,
    params?: { startDate?: string; endDate?: string; granularity?: string }
  ) {
    return api.get<Types.MetricCalculation>(`/metrics/${id}/calculate`, params);
  },

  async getMetricHistory(
    id: string,
    params?: { startDate?: string; endDate?: string; granularity?: string }
  ) {
    return api.get<Types.MetricValue[]>(`/metrics/${id}/history`, params);
  },
};

// ============================================================================
// HEALTH API
// ============================================================================
export const healthApi = {
  async getScore() {
    return api.get<Types.HealthScore>('/health/score');
  },

  async getDimensions() {
    return api.get<Types.HealthScore['dimensions']>('/health/dimensions');
  },

  async getTrend(days?: number) {
    return api.get<Array<{ date: string; score: number }>>(
      '/health/trend',
      days ? { days } : undefined
    );
  },

  async getSystemStatus() {
    return api.get<Array<{ name: string; status: string; latency: string | null }>>(
      '/health/systems/status'
    );
  },
};

// ============================================================================
// ALERTS API
// ============================================================================
const mapAlert = (a: any): Types.Alert => ({
  id: a.id,
  severity: String(a.severity || 'INFO').toLowerCase() as 'critical' | 'warning' | 'info',
  status: String(a.status || 'ACTIVE').toLowerCase() as 'active' | 'acknowledged' | 'resolved',
  source: a.source,
  sourceId: a.metric_id,
  title: a.title,
  message: a.message,
  metadata: a.metadata ?? undefined,
  acknowledgedBy: a.acknowledged_by ?? undefined,
  acknowledgedAt: a.acknowledged_at ?? undefined,
  resolvedBy: a.resolved_by ?? undefined,
  resolvedAt: a.resolved_at ?? undefined,
  resolution: a.resolution ?? undefined,
  createdAt: a.created_at,
});

export const alertsApi = {
  async getAlerts(params?: { severity?: string; status?: string; page?: number }) {
    const response = await api.get<any[]>('/alerts', params);

    if (response.success && response.data) {
      const mapped = response.data.map(mapAlert);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async getSummary() {
    const response = await api.get<any>('/alerts/summary');

    if (response.success && response.data) {
      const { critical, warning, info, active, acknowledged } = response.data as any;
      const mapped: Types.AlertSummary = {
        total: (critical ?? 0) + (warning ?? 0) + (info ?? 0),
        bySeverity: { critical: critical ?? 0, warning: warning ?? 0, info: info ?? 0 },
        byStatus: { active: active ?? 0, acknowledged: acknowledged ?? 0 },
      };
      return { ...response, data: mapped } as typeof response;
    }

    return response as any;
  },

  async getAlert(id: string) {
    const response = await api.get<any>(`/alerts/${id}`);

    if (response.success && response.data) {
      const mapped = mapAlert(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async acknowledgeAlert(id: string, note?: string) {
    const response = await api.post<any>(`/alerts/${id}/acknowledge`, { note });

    if (response.success && response.data) {
      const mapped = mapAlert(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async resolveAlert(id: string, data: { resolution: string; rootCause?: string }) {
    const response = await api.post<any>(`/alerts/${id}/resolve`, data);

    if (response.success && response.data) {
      const mapped = mapAlert(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },
};

// ============================================================================
// WORKFLOWS API
// ============================================================================
const mapWorkflow = (w: any): Types.Workflow => {
  const trigger = (w.trigger ?? {}) as any;
  const rawTriggerType = String(trigger.type ?? 'manual').toLowerCase();
  const triggerType = (
    rawTriggerType === 'schedule' || rawTriggerType === 'event' || rawTriggerType === 'webhook'
      ? rawTriggerType
      : 'manual'
  ) as Types.Workflow['triggerType'];

  const { type: _removedType, ...triggerConfig } = trigger ?? {};

  const rawStatus = String(w.status ?? 'DRAFT').toUpperCase();
  const status = (
    rawStatus === 'ACTIVE'
      ? 'active'
      : rawStatus === 'PAUSED'
        ? 'paused'
        : rawStatus === 'ARCHIVED'
          ? 'archived'
          : 'draft'
  ) as Types.Workflow['status'];

  return {
    id: w.id,
    name: w.name,
    description: w.description ?? undefined,
    category: w.category ?? undefined,
    status,
    triggerType,
    triggerConfig: (triggerConfig ?? {}) as Record<string, unknown>,
    definition: (w.definition ?? { nodes: [], edges: [] }) as Types.WorkflowDefinition,
    version: typeof w.version === 'number' ? w.version : 1,
    createdAt: w.created_at,
    updatedAt: w.updated_at,
  };
};

const mapWorkflowExecution = (e: any): Types.WorkflowExecution => {
  const rawStatus = String(e.status ?? 'PENDING').toUpperCase();
  let status: Types.WorkflowExecution['status'];
  switch (rawStatus) {
    case 'RUNNING':
      status = 'running';
      break;
    case 'COMPLETED':
      status = 'completed';
      break;
    case 'FAILED':
      status = 'failed';
      break;
    case 'CANCELLED':
      status = 'cancelled';
      break;
    case 'SKIPPED':
      status = 'completed';
      break;
    case 'AWAITING_APPROVAL':
    case 'PENDING':
    default:
      status = 'pending';
      break;
  }

  const rawNodeStates = (e.nodeStates ?? e.execution_nodes ?? []) as any[];
  const nodeStates: Types.WorkflowExecution['nodeStates'] = {};
  rawNodeStates.forEach((ns) => {
    const key = ns.node_id ?? ns.id;
    if (!key) {
      return;
    }
    nodeStates[key] = {
      status: String(ns.status ?? 'COMPLETED').toLowerCase(),
      duration: ns.duration ?? undefined,
      output: ns.output ?? undefined,
    };
  });

  return {
    id: e.id,
    workflowId: e.workflow_id,
    status,
    currentNode: e.current_node ?? undefined,
    progress: typeof e.progress === 'number' ? e.progress : 0,
    nodeStates,
    outputs: (e.outputs ?? {}) as Record<string, unknown>,
    error: e.error ? { message: String(e.error), nodeId: undefined } : undefined,
    startedAt: (e.started_at ?? e.created_at ?? new Date().toISOString()) as string,
    completedAt: e.completed_at ?? undefined,
  };
};

const buildWorkflowPayload = (data: Partial<Types.Workflow>): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) {
    payload.name = data.name;
  }
  if (data.description !== undefined) {
    payload.description = data.description;
  }
  if (data.category !== undefined) {
    payload.category = data.category;
  }

  if (data.triggerType !== undefined || data.triggerConfig !== undefined) {
    payload.trigger = {
      type: data.triggerType ?? 'manual',
      ...(data.triggerConfig ?? {}),
    };
  }

  if (data.definition !== undefined) {
    payload.definition = data.definition as Types.WorkflowDefinition;
  }

  return payload;
};

export const workflowsApi = {
  async getWorkflows(params?: { status?: string; category?: string; search?: string }) {
    const response = await api.get<any[]>('/workflows', params);

    if (response.success && response.data) {
      const mapped = response.data.map(mapWorkflow);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async getWorkflow(id: string) {
    const response = await api.get<any>(`/workflows/${id}`);

    if (response.success && response.data) {
      const mapped = mapWorkflow(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async createWorkflow(data: Partial<Types.Workflow>) {
    const payload = buildWorkflowPayload(data);
    const response = await api.post<any>('/workflows', payload);

    if (response.success && response.data) {
      const mapped = mapWorkflow(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async updateWorkflow(id: string, data: Partial<Types.Workflow>) {
    const payload = buildWorkflowPayload(data);
    const response = await api.put<any>(`/workflows/${id}`, payload);

    if (response.success && response.data) {
      const mapped = mapWorkflow(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async deleteWorkflow(id: string) {
    return api.delete(`/workflows/${id}`);
  },

  async activateWorkflow(id: string) {
    return api.post(`/workflows/${id}/activate`);
  },

  async executeWorkflow(id: string, params?: Record<string, unknown>) {
    // Backend may return either a small async-ack object or a full execution row; keep this untyped for now
    return api.post<any>(`/workflows/${id}/execute`, { parameters: params });
  },

  async getExecution(executionId: string) {
    const response = await api.get<any>(`/workflows/executions/${executionId}`);

    if (response.success && response.data) {
      const mapped = mapWorkflowExecution(response.data);
      return { ...response, data: mapped } as typeof response;
    }

    return response;
  },

  async getExecutions(params?: { workflowId?: string; status?: string; page?: number }) {
    // NOTE: Backend currently exposes /workflows/:id/executions; this helper still calls the
    // existing route without normalization to avoid breaking BridgePage's fallback usage.
    return api.get<any[]>('/workflows/executions', params as any);
  },
};

// ============================================================================
// FORECASTS API
// ============================================================================
export const forecastsApi = {
  async getForecasts(params?: { status?: string; page?: number }) {
    return api.get<Types.Forecast[]>('/predict/forecasts', params);
  },

  async getForecast(id: string) {
    return api.get<Types.Forecast>(`/predict/forecasts/${id}`);
  },

  async createForecast(data: {
    name: string;
    targetMetric: string;
    horizon: { value: number; unit: string };
    model?: string;
    features?: string[];
  }) {
    return api.post<Types.Forecast>('/predict/forecasts', data);
  },

  async getScenarios(params?: { page?: number }) {
    return api.get<Types.Scenario[]>('/predict/scenarios', params);
  },

  async getScenario(id: string) {
    return api.get<Types.Scenario>(`/predict/scenarios/${id}`);
  },

  async createScenario(data: Partial<Types.Scenario>) {
    return api.post<Types.Scenario>('/predict/scenarios', data);
  },

  async compareScenarios(
    scenarioIds: string[],
    metrics: string[],
    timeRange?: { start: string; end: string }
  ) {
    return api.post<{
      scenarios: Array<{ id: string; name: string; values: Record<string, number[]> }>;
    }>('/predict/scenarios/compare', { scenarioIds, metrics, timeRange });
  },
};

// ============================================================================
// FRED FORECASTING API (Real Economic Data)
// ============================================================================
export interface FREDSeries {
  key: string;
  id: string;
  name: string;
  frequency: string;
  unit: string;
}

export interface FREDDataPoint {
  date: string;
  value: number;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface AccuracyMetrics {
  mape: number;
  rmse: number;
  mae: number;
  r2: number;
  trainSize: number;
  testSize: number;
}

export interface ForecastResult {
  seriesId: string;
  seriesName: string;
  historicalData: FREDDataPoint[];
  predictions: ForecastPoint[];
  accuracy: AccuracyMetrics;
  model: {
    type: string;
    parameters: Record<string, number>;
    trainedOn: string;
    dataSource: string;
  };
  generatedAt: string;
}

export const fredForecastingApi = {
  async getSeries() {
    return api.get<{ series: FREDSeries[]; count: number; source: string }>('/forecasting/series');
  },

  async getSeriesData(seriesId: string) {
    return api.get<{
      seriesId: string;
      name: string;
      observations: FREDDataPoint[];
    }>(`/forecasting/series/${seriesId}/data`);
  },

  async forecast(seriesId: string, periodsAhead: number = 12, confidenceLevel: number = 0.95) {
    return api.post<ForecastResult>('/forecasting/forecast', {
      seriesId,
      periodsAhead,
      confidenceLevel,
    });
  },

  async forecastBatch(seriesIds: string[], periodsAhead: number = 12) {
    return api.post<{ forecasts: Record<string, ForecastResult>; count: number }>('/forecasting/forecast/batch', {
      seriesIds,
      periodsAhead,
    });
  },

  async getAccuracy() {
    return api.get<{
      summary: {
        averageMAPE: number;
        averageAccuracy: number;
        modelType: string;
        dataSource: string;
        disclaimer: string;
      };
      byIndicator: Array<{
        seriesId: string;
        seriesName: string;
        mape: number;
        rmse: number;
        r2: number;
      }>;
    }>('/forecasting/accuracy');
  },

  async getStatus() {
    return api.get<{
      status: string;
      dataSource: string;
      hasApiKey: boolean;
      availableSeries: number;
      modelType: string;
    }>('/forecasting/status');
  },
};

// ============================================================================
// USERS API
// ============================================================================
export const usersApi = {
  async getUsers(params?: { search?: string; role?: string; page?: number }) {
    return api.get<Types.User[]>('/users', params);
  },

  async getCurrentUser() {
    return api.get<Types.User>('/users/me');
  },

  async updateCurrentUser(data: Partial<Types.User>) {
    return api.put<Types.User>('/users/me', data);
  },

  async inviteUser(data: { email: string; role: string; teams?: string[]; message?: string }) {
    return api.post<Types.User>('/users/invite', data);
  },

  async updateUserRole(userId: string, role: string) {
    return api.put<Types.User>(`/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string) {
    return api.delete(`/users/${userId}`);
  },
};

// ============================================================================
// ORGANIZATIONS API
// ============================================================================
export const organizationsApi = {
  async getCurrent() {
    return api.get<Types.Organization>('/organizations/current');
  },

  async updateCurrent(data: Partial<Types.Organization>) {
    return api.put<Types.Organization>('/organizations/current', data);
  },

  async getTeams() {
    return api.get<Array<{ id: string; name: string; memberCount: number }>>(
      '/organizations/current/teams'
    );
  },

  async createTeam(data: { name: string; description?: string }) {
    return api.post<{ id: string; name: string }>('/organizations/current/teams', data);
  },

  async getActivity(params?: { page?: number; limit?: number }) {
    return api.get<Array<{ id: string; action: string; user: string; timestamp: string }>>(
      '/organizations/current/activity',
      params
    );
  },
};

// ============================================================================
// DATA SOURCES API
// ============================================================================
export const dataSourcesApi = {
  async getDataSources() {
    return api.get<any[]>('/data-sources');
  },

  async getDataSource(id: string) {
    return api.get<any>(`/data-sources/${id}`);
  },

  async testConnection(id: string) {
    return api.post<{ success: boolean; message: string }>(`/data-sources/${id}/test`);
  },

  async sync(id: string) {
    return api.post<{ message: string }>(`/data-sources/${id}/sync`);
  },
};

// ============================================================================
// INTEGRATIONS API
// ============================================================================
export const integrationsApi = {
  async getIntegrations() {
    return api.get<{ available: Types.Integration[]; connected: Types.IntegrationConnection[] }>(
      '/integrations'
    );
  },

  async getIntegration(id: string) {
    return api.get<Types.Integration & { configSchema: Record<string, unknown> }>(
      `/integrations/${id}`
    );
  },

  async connect(integrationId: string, data: { name: string; config: Record<string, unknown> }) {
    return api.post<{ connectionId?: string; authUrl?: string; method?: string }>(
      `/integrations/${integrationId}/connect`,
      data
    );
  },

  async getConnection(connectionId: string) {
    return api.get<Types.IntegrationConnection>(`/integrations/connections/${connectionId}`);
  },

  async testConnection(connectionId: string) {
    return api.post<{ success: boolean; message: string; latency?: number }>(
      `/integrations/connections/${connectionId}/test`
    );
  },

  async syncConnection(connectionId: string) {
    return api.post<{ message: string }>(`/integrations/connections/${connectionId}/sync`);
  },

  async disconnectConnection(connectionId: string) {
    return api.delete(`/integrations/connections/${connectionId}`);
  },

  async getConnectionSchema(connectionId: string) {
    return api.get<{ objects: Array<{ name: string; type: string; fields: unknown[] }> }>(
      `/integrations/connections/${connectionId}/schema`
    );
  },
};

// ============================================================================
// MESH API (CendiaMesh™)
// ============================================================================
export const meshApi = {
  async getStats() {
    return api.get<{
      total_participants: number;
      active_today: number;
      data_points_shared: number;
      insights_generated: number;
      avg_response_ms: number;
      privacy_score: number;
      uptime_percent: number;
    }>('/mesh/stats');
  },

  async getParticipants(params?: { industry?: string; region?: string; limit?: number }) {
    return api.get<unknown[]>('/mesh/participants', params);
  },

  async getBenchmarks(params?: { industry?: string; category?: string }) {
    return api.get<unknown[]>('/mesh/benchmarks', params);
  },

  async getRiskSignals(params?: { severity?: string; category?: string; active?: boolean }) {
    return api.get<unknown[]>('/mesh/signals', params);
  },

  async createSignal(data: {
    title: string;
    description: string;
    category: string;
    severity: string;
    affected_industries?: string[];
    affected_regions?: string[];
    confidence?: number;
    sources?: number;
  }) {
    return api.post<unknown>('/mesh/signals', data);
  },
};

// ============================================================================
// PERSONA API (PersonaForge™)
// ============================================================================
export const personaApi = {
  async getTwins(params?: { organization_id?: string }) {
    return api.get<unknown[]>('/persona/twins', params);
  },

  async getTwin(id: string) {
    return api.get<unknown>(`/persona/twins/${id}`);
  },

  async createTwin(data: {
    organization_id: string;
    name: string;
    role: string;
    department?: string;
    personality_config?: Record<string, unknown>;
    knowledge_domains?: string[];
  }) {
    return api.post<unknown>('/persona/twins', data);
  },

  async addConversation(
    twinId: string,
    data: { user_id: string; messages: unknown[]; satisfaction?: number; duration_ms?: number }
  ) {
    return api.post<unknown>(`/persona/twins/${twinId}/conversation`, data);
  },
};

// ============================================================================
// AUTOPILOT API (CendiaAutopilot™)
// ============================================================================
export const autopilotApi = {
  async getRules(params?: { organization_id?: string; enabled?: boolean }) {
    return api.get<unknown[]>('/autopilot/rules', params);
  },

  async createRule(data: {
    organization_id: string;
    name: string;
    trigger_type: string;
    trigger_config?: Record<string, unknown>;
    action_type: string;
    action_config?: Record<string, unknown>;
  }) {
    return api.post<unknown>('/autopilot/rules', data);
  },

  async executeRule(ruleId: string, data?: { duration_ms?: number }) {
    return api.post<unknown>(`/autopilot/rules/${ruleId}/execute`, data);
  },

  async getExecutions(params?: { rule_id?: string }) {
    return api.get<unknown[]>('/autopilot/executions', params);
  },
};

// ============================================================================
// GOVERN API (CendiaGovern™)
// ============================================================================
export const governApi = {
  async getPolicies(params?: { organization_id?: string; status?: string; category?: string }) {
    return api.get<unknown[]>('/govern/policies', params);
  },

  async createPolicy(data: {
    organization_id: string;
    name: string;
    description: string;
    category: string;
    rules?: unknown[];
    created_by: string;
  }) {
    return api.post<unknown>('/govern/policies', data);
  },

  async getAudits(params?: { organization_id?: string; status?: string }) {
    return api.get<unknown[]>('/govern/audits', params);
  },

  async createAudit(data: {
    organization_id: string;
    policy_id?: string;
    audit_type: string;
    findings?: unknown[];
    risk_score?: number;
  }) {
    return api.post<unknown>('/govern/audits', data);
  },
};

// ============================================================================
// DECISION INTELLIGENCE API
// ============================================================================
export const decisionIntelApi = {
  // Chronos
  async getChronosSnapshots(params?: { organization_id?: string; snapshot_type?: string }) {
    return api.get<unknown[]>('/decision-intel/chronos/snapshots', params);
  },

  async createChronosSnapshot(data: {
    organization_id: string;
    snapshot_type: string;
    name: string;
    data?: Record<string, unknown>;
    metrics?: Record<string, unknown>;
    created_by: string;
  }) {
    return api.post<unknown>('/decision-intel/chronos/snapshots', data);
  },

  // Chronos AI - Powered by Ollama
  async detectPivotalMoments(data: {
    organization_id?: string;
    events: unknown[];
    limit?: number;
    department?: string;
  }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/pivotal-moments', data);
  },

  async analyzeCausalChain(data: {
    organization_id?: string;
    root_event: unknown;
    all_events: unknown[];
  }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/causal-chain', data);
  },

  async generateFutureScenarios(data: {
    organization_id?: string;
    current_metrics: Record<string, number>;
    recent_events: unknown[];
    time_horizon?: string;
  }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/future-scenarios', data);
  },

  async getTimelineInsight(data: {
    organization_id?: string;
    start_date: string;
    end_date: string;
    events: unknown[];
    metrics?: Record<string, number>;
  }) {
    return api.post<unknown>('/decision-intel/chronos/ai/timeline-insight', data);
  },

  async analyzeWhatIf(data: {
    organization_id?: string;
    event: unknown;
    alternative_action: string;
  }) {
    return api.post<unknown>('/decision-intel/chronos/ai/what-if', data);
  },

  // Ghost Board
  async getGhostBoardSessions(params?: { organization_id?: string; status?: string }) {
    return api.get<unknown[]>('/decision-intel/ghost-board/sessions', params);
  },

  async createGhostBoardSession(data: {
    organization_id: string;
    title: string;
    scenario: string;
    board_composition?: unknown[];
    created_by: string;
  }) {
    return api.post<unknown>('/decision-intel/ghost-board/sessions', data);
  },

  // Pre-Mortem
  async getPreMortemAnalyses(params?: {
    organization_id?: string;
    decision_id?: string;
    status?: string;
  }) {
    return api.get<unknown[]>('/decision-intel/pre-mortem/analyses', params);
  },

  async createPreMortemAnalysis(data: {
    organization_id: string;
    decision_id?: string;
    title: string;
    failure_modes?: unknown[];
    risk_factors?: unknown[];
    mitigations?: unknown[];
    overall_risk?: number;
    created_by: string;
  }) {
    return api.post<unknown>('/decision-intel/pre-mortem/analyses', data);
  },

  // Regulatory
  async getRegulatoryItems(params?: {
    organization_id?: string;
    jurisdiction?: string;
    status?: string;
  }) {
    return api.get<unknown[]>('/decision-intel/regulatory/items', params);
  },

  async createRegulatoryItem(data: {
    organization_id: string;
    regulation_id: string;
    title: string;
    description: string;
    jurisdiction: string;
    category: string;
    impact_level?: string;
    required_actions?: unknown[];
  }) {
    return api.post<unknown>('/decision-intel/regulatory/items', data);
  },
};

// ============================================================================
// ECHO API - Decision Outcome Engine
// ============================================================================
export const echoApi = {
  async linkOutcome(data: {
    deliberationId: string;
    actualRevenue?: number;
    actualProfit?: number;
    actualHeadcount?: number;
    actualRisk?: number;
    actualSatisfaction?: number;
    actualMarketShare?: number;
    notes?: string;
  }) {
    return api.post<unknown>('/echo/outcomes', data);
  },

  async getOutcome(deliberationId: string) {
    return api.get<unknown>(`/echo/outcomes/${deliberationId}`);
  },

  async getLeaderboard(params?: { limit?: number; period?: string; sortBy?: string }) {
    return api.get<unknown[]>('/echo/leaderboard', params);
  },

  async getAccuracyReport() {
    return api.get<unknown>('/echo/accuracy');
  },

  async getOutcomeReport(deliberationId: string) {
    return api.get<unknown>(`/echo/report/${deliberationId}`);
  },

  async getDashboard() {
    return api.get<unknown>('/echo/dashboard');
  },

  async getPendingDecisions(params?: { olderThanDays?: number; limit?: number }) {
    return api.get<unknown[]>('/echo/pending', params);
  },

  async getWeightHistory(params?: { agentId?: string; limit?: number }) {
    return api.get<unknown[]>('/echo/weight-history', params);
  },

  async scheduleCollection(data: {
    deliberationId: string;
    collectionDelayDays?: number;
    dataSourceIds?: string[];
    metricKeys?: string[];
  }) {
    return api.post<unknown>('/echo/collections/schedule', data);
  },

  async getCollectionJobs(params?: { status?: string; limit?: number }) {
    return api.get<unknown[]>('/echo/collections', params);
  },

  async approveCollection(jobId: string, overrides?: {
    actualRevenue?: number;
    actualProfit?: number;
    actualHeadcount?: number;
    actualRisk?: number;
    actualSatisfaction?: number;
    actualMarketShare?: number;
    notes?: string;
  }) {
    return api.post<unknown>(`/echo/collections/${jobId}/approve`, overrides || {});
  },

  async cancelCollection(jobId: string) {
    return api.delete<unknown>(`/echo/collections/${jobId}`);
  },

  async processCollections() {
    return api.post<unknown>('/echo/collections/process', {});
  },
};

// ============================================================================
// REDTEAM API - Adversarial Security Engine
// ============================================================================
export const redteamApi = {
  async runSimulation(options?: {
    adversaryProfile?: string;
    targetObjective?: string;
    maxIterations?: number;
  }) {
    return api.post<unknown>('/redteam/simulate', options);
  },

  async getScore() {
    return api.get<unknown>('/redteam/score');
  },

  async getWeaknessReport() {
    return api.get<unknown>('/redteam/weakness-report');
  },

  async getExploits() {
    return api.get<unknown[]>('/redteam/exploits');
  },

  async applyPatch(patchId: string) {
    return api.post<unknown>(`/redteam/patches/${patchId}/apply`, {});
  },

  async rollbackPatch(patchId: string) {
    return api.post<unknown>(`/redteam/patches/${patchId}/rollback`, {});
  },

  async getDashboard() {
    return api.get<unknown>('/redteam/dashboard');
  },

  async getEvilTwin() {
    return api.get<unknown>('/redteam/evil-twin');
  },
};

// ============================================================================
// GNOSIS API - Education Engine
// ============================================================================
export const gnosisApi = {
  async generateFromDecision(deliberationId: string) {
    return api.post<unknown>('/gnosis/generate-from-decision', { deliberationId });
  },

  async createPath(data: {
    title: string;
    description: string;
    skills: string[];
    sourceDecision?: string;
    targetRole?: string;
    urgency?: string;
  }) {
    return api.post<unknown>('/gnosis/paths', data);
  },

  async getPath(pathId: string) {
    return api.get<unknown>(`/gnosis/paths/${pathId}`);
  },

  async updateProgress(pathId: string, moduleId: string, completed: boolean, score?: number) {
    return api.put<unknown>(`/gnosis/paths/${pathId}/progress`, { moduleId, completed, score });
  },

  async getProfile() {
    return api.get<unknown>('/gnosis/profile');
  },

  async getAnalytics() {
    return api.get<unknown>('/gnosis/analytics');
  },

  async startAssessment(skill: string) {
    return api.post<unknown>('/gnosis/assessments', { skill });
  },

  async submitAssessment(assessmentId: string, answers: Record<string, string>) {
    return api.post<unknown>(`/gnosis/assessments/${assessmentId}/submit`, { answers });
  },

  async getDashboard() {
    return api.get<unknown>('/gnosis/dashboard');
  },

  async getDecisionReadiness() {
    return api.get<unknown>('/gnosis/decision-readiness');
  },
};

// ============================================================================
// DRUID API - Analytics for CendiaChronos™, CendiaWitness™, CendiaPulse™
// ============================================================================
export const druidApi = {
  // Health check
  async health() {
    return api.get<{ available: boolean; datasources: string[] }>('/druid/health');
  },

  // Chronos - Decision Timeline
  async getDecisions(params?: {
    startTime?: string;
    endTime?: string;
    limit?: number;
    riskLevel?: string;
    department?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.startTime) {query.append('startTime', params.startTime);}
    if (params?.endTime) {query.append('endTime', params.endTime);}
    if (params?.limit) {query.append('limit', String(params.limit));}
    if (params?.riskLevel) {query.append('riskLevel', params.riskLevel);}
    if (params?.department) {query.append('department', params.department);}
    return api.get<any>(`/druid/chronos/decisions?${query.toString()}`);
  },

  async getTimeline(params?: {
    startDate?: string;
    endDate?: string;
    granularity?: 'hour' | 'day' | 'week';
  }) {
    const query = new URLSearchParams();
    if (params?.startDate) {query.append('startDate', params.startDate);}
    if (params?.endDate) {query.append('endDate', params.endDate);}
    if (params?.granularity) {query.append('granularity', params.granularity);}
    return api.get<any>(`/druid/chronos/timeline?${query.toString()}`);
  },

  async getRiskTrend(days?: number) {
    return api.get<any>(`/druid/chronos/risk-trend?days=${days || 30}`);
  },

  async getDepartments() {
    return api.get<any>('/druid/chronos/departments');
  },

  // Witness - Audit Trail
  async getAuditTrail(params?: {
    resourceType?: string;
    resourceId?: string;
    actorId?: string;
    startTime?: string;
    endTime?: string;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.resourceType) {query.append('resourceType', params.resourceType);}
    if (params?.resourceId) {query.append('resourceId', params.resourceId);}
    if (params?.actorId) {query.append('actorId', params.actorId);}
    if (params?.startTime) {query.append('startTime', params.startTime);}
    if (params?.endTime) {query.append('endTime', params.endTime);}
    if (params?.limit) {query.append('limit', String(params.limit));}
    return api.get<any>(`/druid/witness/audit?${query.toString()}`);
  },

  async getActivitySummary() {
    return api.get<any>('/druid/witness/activity-summary');
  },

  // Pulse - Agent & System Metrics
  async getAgentMetrics(params?: {
    agentId?: string;
    granularity?: 'minute' | 'hour' | 'day';
    startTime?: string;
    endTime?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.agentId) {query.append('agentId', params.agentId);}
    if (params?.granularity) {query.append('granularity', params.granularity);}
    if (params?.startTime) {query.append('startTime', params.startTime);}
    if (params?.endTime) {query.append('endTime', params.endTime);}
    return api.get<any>(`/druid/pulse/agents?${query.toString()}`);
  },

  async getSystemHealth() {
    return api.get<any>('/druid/pulse/system');
  },

  async getAlerts(params?: { severity?: string; resolved?: boolean; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.severity) {query.append('severity', params.severity);}
    if (params?.resolved !== undefined) {query.append('resolved', String(params.resolved));}
    if (params?.limit) {query.append('limit', String(params.limit));}
    return api.get<any>(`/druid/pulse/alerts?${query.toString()}`);
  },

  // Seeding
  async seedData() {
    return api.post<any>('/druid/seed', {});
  },

  // Raw query (admin)
  async query(sql: string) {
    return api.post<any>('/druid/query', { sql });
  },
};

// ============================================================================
// CORTEX CORE API (Intelligence Gateway)
// ============================================================================
export { cortexApi } from './cortex';
export type {
  PillarName,
  QueryParams,
  QueryResponse,
  AnalyzeParams,
  AnalyzeResponse,
  SimulateParams,
  SimulateResponse,
  GovernParams,
  GovernResponse,
  ContextResponse,
} from './cortex';

// Default export with all APIs
export default {
  auth: authApi,
  graph: graphApi,
  lineage: lineageApi,
  council: councilApi,
  metrics: metricsApi,
  health: healthApi,
  alerts: alertsApi,
  workflows: workflowsApi,
  dataSources: dataSourcesApi,
  forecasts: forecastsApi,
  users: usersApi,
  organizations: organizationsApi,
  integrations: integrationsApi,
  mesh: meshApi,
  persona: personaApi,
  autopilot: autopilotApi,
  govern: governApi,
  decisionIntel: decisionIntelApi,
  echo: echoApi,
  redteam: redteamApi,
  gnosis: gnosisApi,
  druid: druidApi,
  cortex: {} as typeof import('./cortex').cortexApi, // Lazy reference
};
