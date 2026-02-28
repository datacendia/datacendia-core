// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Datacendia API Types
 * Comprehensive type definitions for all API interactions
 */

// Base Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
  industry?: string;
  companySize?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'VIEWER' | 'ANALYST' | 'ADMIN' | 'SUPER_ADMIN' | 'OWNER';
  organizationId: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  preferences?: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: boolean;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  companySize?: string;
  settings?: OrganizationSettings;
  createdAt: string;
}

export interface OrganizationSettings {
  timezone?: string;
  dateFormat?: string;
  currency?: string;
}

// Graph Types
export interface GraphEntity {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GraphRelationship {
  source: string;
  target: string;
  type: string;
  properties?: Record<string, unknown>;
}

export interface LineageResult {
  root: {
    id: string;
    type: string;
    name: string;
  };
  nodes: Array<{
    id: string;
    type: string;
    name: string;
    level: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string;
    properties: Record<string, unknown>;
  }>;
  metadata: {
    totalDepth: number;
    totalNodes: number;
    dataFreshness: string;
  };
}

export interface ImpactAnalysis {
  sourceEntity: string;
  affectedEntities: Array<{
    id: string;
    name: string;
    type: string;
    impactLevel: 'high' | 'medium' | 'low';
    pathLength: number;
  }>;
  affectedWorkflows: Array<{
    id: string;
    name: string;
    impactLevel: 'high' | 'medium' | 'low';
  }>;
  summary: {
    totalAffected: number;
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
  };
}

// Council/Agent Types
export interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  constraints?: string[];
}

export interface CouncilQuery {
  id: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  response?: {
    summary: string;
    confidence: number;
    agents: Array<{
      agentId: string;
      analysis: string;
      sources: Array<{ entityId: string; name: string; relevance: number }>;
    }>;
    followUpQuestions: string[];
  };
  processingTime?: number;
  createdAt?: string;
}

export interface CouncilDecisionSummary {
  id: string;
  query: string;
  confidence?: number;
  completedAt?: string;
}

export interface Deliberation {
  id: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: 'initial_analysis' | 'cross_examination' | 'synthesis' | 'ethics_check';
  progress: number;
  agents: string[];
  result?: {
    decision: string;
    confidence: number;
    dissent?: string[];
  };
  startedAt: string;
  completedAt?: string;
}

export interface DeliberationMessage {
  id: string;
  agentId: string;
  phase: string;
  content: string;
  sources: Array<{ entityId: string; name: string; relevance: number }>;
  confidence: number;
  timestamp: string;
}

// Metrics Types
export interface MetricDefinition {
  id: string;
  code: string;
  name: string;
  description?: string;
  formula: Record<string, unknown>;
  unit?: string;
  category?: string;
  thresholds?: {
    warning?: number;
    critical?: number;
  };
  ownerId?: string;
  refreshSchedule?: string;
  createdAt: string;
}

export interface MetricValue {
  timestamp: string;
  value: number;
  dimensions?: Record<string, string>;
  confidence?: number;
}

export interface MetricCalculation {
  metricId: string;
  metricName: string;
  timeRange: { start: string; end: string };
  values: MetricValue[];
  summary: {
    current: number;
    previous: number;
    change: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  calculatedAt: string;
}

// Health Types
export interface HealthScore {
  overall: number;
  dimensions: {
    data: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    operations: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    security: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    people: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
  };
  calculatedAt: string;
}

// Alert Types
export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  source: string;
  sourceId?: string;
  title: string;
  message?: string;
  metadata?: Record<string, unknown>;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
}

export interface AlertSummary {
  total: number;
  bySeverity: {
    critical: number;
    warning: number;
    info: number;
  };
  byStatus: {
    active: number;
    acknowledged: number;
  };
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  triggerType: 'schedule' | 'event' | 'webhook' | 'manual';
  triggerConfig: Record<string, unknown>;
  definition: WorkflowDefinition;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'query' | 'transform' | 'condition' | 'action' | 'approval' | 'notification';
  config: Record<string, unknown>;
  position?: { x: number; y: number };
  inputs?: string[];
  outputs?: string[];
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
  on?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentNode?: string;
  progress: number;
  nodeStates: Record<string, { status: string; duration?: number; output?: unknown }>;
  outputs: Record<string, unknown>;
  error?: { message: string; nodeId?: string };
  startedAt: string;
  completedAt?: string;
}

// Forecast Types
export interface Forecast {
  id: string;
  name: string;
  targetMetric: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  horizon: { value: number; unit: 'days' | 'weeks' | 'months' };
  model: string;
  predictions?: Array<{
    timestamp: string;
    value: number;
    confidenceIntervals?: Record<string, { lower: number; upper: number }>;
  }>;
  accuracy?: { mape: number; rmse: number };
  featureImportance?: Array<{ feature: string; importance: number }>;
  createdAt: string;
}

export interface Scenario {
  id: string;
  name: string;
  baselineId?: string;
  assumptions: Array<{
    variable: string;
    baseValue: unknown;
    scenarioValue: unknown;
  }>;
  metricsToProject: string[];
  results?: Record<string, Array<{ timestamp: string; value: number }>>;
  createdAt: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  category: string;
  authType: string;
  logo: string;
  status?: 'available' | 'connected';
}

export interface IntegrationConnection {
  id: string;
  integrationId: string;
  name: string;
  status: 'active' | 'pending' | 'error' | 'syncing';
  lastSync?: string;
  lastSyncStatus?: string;
  createdAt: string;
}
