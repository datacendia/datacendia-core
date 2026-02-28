// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PILLARS API CLIENT
// Frontend API service for the 8 Foundational Data Layers
// =============================================================================

const API_BASE = '/api/v1/pillars';

// =============================================================================
// HELM API
// =============================================================================

export const helmApi = {
  getDashboard: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/helm/dashboard?organizationId=${organizationId}`);
    return res.json();
  },

  getMetrics: async (organizationId: string = 'demo', category?: string) => {
    const url = category
      ? `${API_BASE}/helm/metrics?organizationId=${organizationId}&category=${category}`
      : `${API_BASE}/helm/metrics?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },

  getMetricHistory: async (metricId: string, days: number = 30) => {
    const res = await fetch(`${API_BASE}/helm/metrics/${metricId}/history?days=${days}`);
    return res.json();
  },

  updateMetric: async (metricId: string, value: number) => {
    const res = await fetch(`${API_BASE}/helm/metrics/${metricId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return res.json();
  },

  getAlerts: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/helm/alerts?organizationId=${organizationId}`);
    return res.json();
  },

  acknowledgeAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/helm/alerts/${alertId}/acknowledge`, { method: 'POST' });
    return res.json();
  },
};

// =============================================================================
// LINEAGE API
// =============================================================================

export const lineageApi = {
  getGraph: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/lineage/graph?organizationId=${organizationId}`);
    return res.json();
  },

  getEntities: async (organizationId: string = 'demo', type?: string) => {
    const url = type
      ? `${API_BASE}/lineage/entities?organizationId=${organizationId}&type=${type}`
      : `${API_BASE}/lineage/entities?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },

  traceLineage: async (
    entityId: string,
    direction: 'upstream' | 'downstream' | 'both' = 'both'
  ) => {
    const res = await fetch(
      `${API_BASE}/lineage/entities/${entityId}/trace?direction=${direction}`
    );
    return res.json();
  },

  getQualityOverview: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/lineage/quality?organizationId=${organizationId}`);
    return res.json();
  },

  checkQuality: async (entityId: string) => {
    const res = await fetch(`${API_BASE}/lineage/entities/${entityId}/quality-check`, {
      method: 'POST',
    });
    return res.json();
  },
};

// =============================================================================
// PREDICT API
// =============================================================================

export const predictApi = {
  getModels: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/models?organizationId=${organizationId}`);
    return res.json();
  },

  getModel: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}`);
    return res.json();
  },

  getFeatureImportance: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/features`);
    return res.json();
  },

  predict: async (modelId: string, input: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    return res.json();
  },

  trainModel: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/train`, { method: 'POST' });
    return res.json();
  },

  getForecasts: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/forecasts?organizationId=${organizationId}`);
    return res.json();
  },

  getInsights: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/insights?organizationId=${organizationId}`);
    return res.json();
  },
};

// =============================================================================
// FLOW API
// =============================================================================

export const flowApi = {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/flow/stats?organizationId=${organizationId}`);
    return res.json();
  },

  getWorkflows: async (organizationId: string = 'demo', status?: string) => {
    const url = status
      ? `${API_BASE}/flow/workflows?organizationId=${organizationId}&status=${status}`
      : `${API_BASE}/flow/workflows?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },

  getWorkflow: async (workflowId: string) => {
    const res = await fetch(`${API_BASE}/flow/workflows/${workflowId}`);
    return res.json();
  },

  executeWorkflow: async (
    workflowId: string,
    triggeredBy: string = 'user',
    input?: Record<string, unknown>
  ) => {
    const res = await fetch(`${API_BASE}/flow/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggeredBy, input }),
    });
    return res.json();
  },

  getExecutions: async (organizationId: string = 'demo', limit: number = 50) => {
    const res = await fetch(
      `${API_BASE}/flow/executions?organizationId=${organizationId}&limit=${limit}`
    );
    return res.json();
  },

  getApprovals: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/flow/approvals?organizationId=${organizationId}`);
    return res.json();
  },

  processApproval: async (
    approvalId: string,
    approved: boolean,
    decidedBy: string,
    reason?: string
  ) => {
    const res = await fetch(`${API_BASE}/flow/approvals/${approvalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved, decidedBy, reason }),
    });
    return res.json();
  },
};

// =============================================================================
// HEALTH API
// =============================================================================

export const healthPillarApi = {
  getStatus: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/health/status?organizationId=${organizationId}`);
    return res.json();
  },

  getAlerts: async (organizationId: string = 'demo', includeResolved: boolean = false) => {
    const res = await fetch(
      `${API_BASE}/health/alerts?organizationId=${organizationId}&includeResolved=${includeResolved}`
    );
    return res.json();
  },

  acknowledgeAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/health/alerts/${alertId}/acknowledge`, { method: 'POST' });
    return res.json();
  },

  resolveAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/health/alerts/${alertId}/resolve`, { method: 'POST' });
    return res.json();
  },

  getTrends: async (organizationId: string = 'demo', hours: number = 24) => {
    const res = await fetch(
      `${API_BASE}/health/trends?organizationId=${organizationId}&hours=${hours}`
    );
    return res.json();
  },
};

// =============================================================================
// GUARD API
// =============================================================================

export const guardApi = {
  getPosture: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/guard/posture?organizationId=${organizationId}`);
    return res.json();
  },

  getThreats: async (organizationId: string = 'demo', includeResolved: boolean = false) => {
    const res = await fetch(
      `${API_BASE}/guard/threats?organizationId=${organizationId}&includeResolved=${includeResolved}`
    );
    return res.json();
  },

  updateThreatStatus: async (threatId: string, status: string) => {
    const res = await fetch(`${API_BASE}/guard/threats/${threatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  getPolicies: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/guard/policies?organizationId=${organizationId}`);
    return res.json();
  },

  togglePolicy: async (policyId: string, enabled: boolean) => {
    const res = await fetch(`${API_BASE}/guard/policies/${policyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    return res.json();
  },

  getAuditLogs: async (organizationId: string = 'demo', limit: number = 100) => {
    const res = await fetch(
      `${API_BASE}/guard/audit?organizationId=${organizationId}&limit=${limit}`
    );
    return res.json();
  },
};

// =============================================================================
// ETHICS API
// =============================================================================

export const ethicsApi = {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/ethics/stats?organizationId=${organizationId}`);
    return res.json();
  },

  getPrinciples: async (organizationId: string = 'demo', status?: string) => {
    const url = status
      ? `${API_BASE}/ethics/principles?organizationId=${organizationId}&status=${status}`
      : `${API_BASE}/ethics/principles?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },

  getReviews: async (organizationId: string = 'demo', result?: string) => {
    const url = result
      ? `${API_BASE}/ethics/reviews?organizationId=${organizationId}&result=${result}`
      : `${API_BASE}/ethics/reviews?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },

  requestReview: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/ethics/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  submitReviewDecision: async (
    reviewId: string,
    result: string,
    notes?: string,
    violations?: string[]
  ) => {
    const res = await fetch(`${API_BASE}/ethics/reviews/${reviewId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, notes, violations }),
    });
    return res.json();
  },

  getBiasChecks: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/ethics/bias-checks?organizationId=${organizationId}`);
    return res.json();
  },

  performBiasCheck: async (organizationId: string = 'demo', modelId: string, modelName: string) => {
    const res = await fetch(`${API_BASE}/ethics/bias-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, modelId, modelName }),
    });
    return res.json();
  },
};

// =============================================================================
// AGENTS API
// =============================================================================

export const agentsApi = {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/agents/stats?organizationId=${organizationId}`);
    return res.json();
  },

  getAgents: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/agents?organizationId=${organizationId}`);
    return res.json();
  },

  getAgent: async (agentId: string) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}`);
    return res.json();
  },

  updateAgentStatus: async (agentId: string, status: string) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  updateAgentConfig: async (agentId: string, config: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/config`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  getInteractions: async (agentId: string, limit: number = 50) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/interactions?limit=${limit}`);
    return res.json();
  },

  recordInteraction: async (agentId: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  rateInteraction: async (interactionId: string, rating: number, feedback?: string) => {
    const res = await fetch(`${API_BASE}/agents/interactions/${interactionId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback }),
    });
    return res.json();
  },
};

// =============================================================================
// INITIALIZE PILLARS
// =============================================================================

export const initializePillars = async (organizationId: string = 'demo') => {
  const res = await fetch(`${API_BASE}/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organizationId }),
  });
  return res.json();
};

// Export all as pillarsApi
export const pillarsApi = {
  helm: helmApi,
  lineage: lineageApi,
  predict: predictApi,
  flow: flowApi,
  health: healthPillarApi,
  guard: guardApi,
  ethics: ethicsApi,
  agents: agentsApi,
  initialize: initializePillars,
};

export default pillarsApi;
