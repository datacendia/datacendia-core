// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Typed Interfaces for Prisma Json Fields
 * 
 * This file provides strong typing for all Json fields in the Prisma schema,
 * eliminating the need for unsafe 'any' or 'unknown' casts throughout the codebase.
 * 
 * Usage:
 *   import { AgentCapabilities, AlertMetadata } from '@/types/prisma-json.types.js';
 *   const capabilities = agent.capabilities as AgentCapabilities;
 */

// =============================================================================
// AGENT TYPES
// =============================================================================

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export type AgentCapabilities = AgentCapability[];

export interface AgentConstraint {
  type: 'topic' | 'action' | 'data_access' | 'time' | 'budget';
  value: string;
  strict: boolean;
}

export type AgentConstraints = AgentConstraint[];

export interface AgentModelConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPromptOverride?: string;
}

// =============================================================================
// ALERT & METRIC TYPES
// =============================================================================

export interface AlertMetadata {
  threshold?: number;
  currentValue?: number;
  previousValue?: number;
  triggerCondition?: string;
  affectedEntities?: string[];
  relatedMetrics?: string[];
  autoResolvable?: boolean;
  [key: string]: unknown;
}

export interface MetricMetadata {
  unit?: string;
  format?: string;
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'last';
  source?: string;
  formula?: string;
  tags?: string[];
}

// =============================================================================
// API KEY TYPES
// =============================================================================

export type ApiKeyScope = 
  | 'read:all'
  | 'write:all'
  | 'read:decisions'
  | 'write:decisions'
  | 'read:deliberations'
  | 'write:deliberations'
  | 'read:metrics'
  | 'read:council'
  | 'execute:council'
  | 'admin';

export type ApiKeyScopes = ApiKeyScope[];

// =============================================================================
// AUDIT LOG TYPES
// =============================================================================

export interface AuditLogDetails {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  metadata?: Record<string, unknown>;
  changes?: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
}

// =============================================================================
// CHAIN OF THOUGHT TYPES
// =============================================================================

export interface ChainOfThoughtStep {
  stepNumber: number;
  thought: string;
  action?: string;
  observation?: string;
  confidence?: number;
  sources?: string[];
}

export type ChainOfThoughtSteps = ChainOfThoughtStep[];

// =============================================================================
// COUNCIL & DELIBERATION TYPES
// =============================================================================

export interface CouncilQueryContext {
  domain?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  constraints?: string[];
  requiredAgents?: string[];
  excludedAgents?: string[];
  maxDeliberationTime?: number;
  confidenceThreshold?: number;
  additionalContext?: Record<string, unknown>;
}

export interface CouncilQueryResponse {
  recommendation: string;
  confidence: number;
  reasoning: string;
  dissents?: Array<{
    agentId: string;
    reason: string;
  }>;
  supportingEvidence?: string[];
  actionItems?: string[];
}

export interface DeliberationConfig {
  mode?: 'consensus' | 'debate' | 'advisory' | 'voting';
  phases?: string[];
  timeLimit?: number;
  requiredQuorum?: number;
  votingThreshold?: number;
  allowDissent?: boolean;
  requireUnanimity?: boolean;
}

export interface DeliberationContext {
  background?: string;
  objectives?: string[];
  constraints?: string[];
  stakeholders?: string[];
  documents?: Array<{
    id: string;
    title: string;
    summary?: string;
  }>;
  previousDecisions?: string[];
}

export interface DeliberationDecision {
  outcome: string;
  rationale: string;
  confidence: number;
  votingResults?: {
    for: number;
    against: number;
    abstain: number;
  };
  dissents?: Array<{
    agentId: string;
    agentName: string;
    reason: string;
  }>;
  conditions?: string[];
  nextSteps?: string[];
}

// =============================================================================
// DATA SOURCE TYPES
// =============================================================================

export interface DataSourceConfig {
  host?: string;
  port?: number;
  database?: string;
  schema?: string;
  ssl?: boolean;
  poolSize?: number;
  queryTimeout?: number;
  [key: string]: unknown;
}

export interface DataSourceCredentials {
  username?: string;
  password?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  certificate?: string;
  privateKey?: string;
}

export interface DataSourceMetadata {
  tables?: string[];
  lastSchema?: Record<string, unknown>;
  rowCounts?: Record<string, number>;
  lastError?: string;
  syncHistory?: Array<{
    timestamp: Date;
    status: string;
    rowsSynced?: number;
    duration?: number;
  }>;
}

// =============================================================================
// DECISION TYPES
// =============================================================================

export interface DecisionActivityDetails {
  comment?: string;
  previousStatus?: string;
  newStatus?: string;
  attachments?: string[];
  mentions?: string[];
  metadata?: Record<string, unknown>;
}

// =============================================================================
// EMBEDDING TYPES
// =============================================================================

export interface EmbeddingMetadata {
  chunkIndex?: number;
  totalChunks?: number;
  documentTitle?: string;
  section?: string;
  language?: string;
  createdBy?: string;
  tags?: string[];
}

// =============================================================================
// EXECUTION TYPES
// =============================================================================

export interface ExecutionNodeInput {
  [key: string]: unknown;
}

export interface ExecutionNodeOutput {
  result?: unknown;
  logs?: string[];
  metrics?: Record<string, number>;
  artifacts?: string[];
}

// =============================================================================
// EXECUTIVE SUMMARY TYPES
// =============================================================================

export interface KeyPoint {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  category?: string;
}

export type KeyPoints = KeyPoint[];

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export type ActionItems = ActionItem[];

export interface Participant {
  id: string;
  name: string;
  role: string;
  contribution?: string;
}

export type Participants = Participant[];

export interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation?: string;
}

export type Risks = Risk[];

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  expectedOutcome?: string;
}

export type Recommendations = Recommendation[];

export interface NextStep {
  id: string;
  title: string;
  description?: string;
  responsible?: string;
  deadline?: string;
  dependencies?: string[];
}

export type NextSteps = NextStep[];

// =============================================================================
// FORECAST TYPES
// =============================================================================

export interface ForecastHorizon {
  value: number;
  unit: 'days' | 'weeks' | 'months' | 'quarters' | 'years';
}

export interface ForecastFeature {
  name: string;
  importance?: number;
  type: 'numeric' | 'categorical' | 'temporal';
}

export type ForecastFeatures = ForecastFeature[];

export interface ForecastPrediction {
  timestamp: string;
  value: number;
  lowerBound?: number;
  upperBound?: number;
  confidence?: number;
}

export type ForecastPredictions = ForecastPrediction[];

export interface ForecastAccuracy {
  mape?: number;
  rmse?: number;
  mae?: number;
  r2?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  direction?: 'positive' | 'negative';
}

export type FeatureImportances = FeatureImportance[];

// =============================================================================
// HEALTH SCORE TYPES
// =============================================================================

export interface HealthScoreDetails {
  dataQuality?: {
    completeness: number;
    accuracy: number;
    freshness: number;
  };
  operations?: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  security?: {
    vulnerabilities: number;
    compliance: number;
    accessControl: number;
  };
  people?: {
    engagement: number;
    training: number;
    satisfaction: number;
  };
  trends?: {
    overall: 'improving' | 'stable' | 'declining';
    lastChange: number;
  };
}

// =============================================================================
// WORKFLOW TYPES
// =============================================================================

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'approval' | 'notification';
  name: string;
  config: Record<string, unknown>;
  position?: { x: number; y: number };
}

export type WorkflowNodes = WorkflowNode[];

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}

export type WorkflowEdges = WorkflowEdge[];

export interface WorkflowTriggerConfig {
  type: 'manual' | 'schedule' | 'event' | 'webhook';
  schedule?: string;
  event?: string;
  conditions?: string[];
}

export interface WorkflowExecutionContext {
  triggeredBy?: string;
  triggerType?: string;
  inputData?: Record<string, unknown>;
  variables?: Record<string, unknown>;
}

// =============================================================================
// SCENARIO TYPES
// =============================================================================

export interface ScenarioParameters {
  [key: string]: {
    value: number | string | boolean;
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface ScenarioResults {
  outcomes: Array<{
    metric: string;
    baseline: number;
    projected: number;
    change: number;
    changePercent: number;
  }>;
  confidence: number;
  assumptions?: string[];
  risks?: string[];
}

// =============================================================================
// MESSAGE SOURCES TYPES
// =============================================================================

export interface MessageSource {
  type: 'document' | 'metric' | 'decision' | 'external' | 'knowledge_graph';
  id: string;
  title?: string;
  url?: string;
  relevance?: number;
  excerpt?: string;
}

export type MessageSources = MessageSource[];

// =============================================================================
// ORGANIZATION TYPES
// =============================================================================

export interface OrganizationSettings {
  defaultLanguage?: string;
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  features?: Record<string, boolean>;
  branding?: {
    primaryColor?: string;
    logo?: string;
  };
  notifications?: {
    email?: boolean;
    slack?: boolean;
    inApp?: boolean;
  };
  security?: {
    mfaRequired?: boolean;
    sessionTimeout?: number;
    ipWhitelist?: string[];
  };
}

// =============================================================================
// HELPER TYPE GUARDS
// =============================================================================

export function isAgentCapabilities(value: unknown): value is AgentCapabilities {
  return Array.isArray(value) && value.every(
    item => typeof item === 'object' && item !== null && 'name' in item
  );
}

export function isAlertMetadata(value: unknown): value is AlertMetadata {
  return typeof value === 'object' && value !== null;
}

export function isDeliberationConfig(value: unknown): value is DeliberationConfig {
  return typeof value === 'object' && value !== null;
}

// =============================================================================
// TYPE CAST HELPERS
// =============================================================================

/**
 * Safely cast Prisma Json to typed interface with runtime validation
 */
export function castJson<T>(
  value: unknown,
  defaultValue: T,
  validator?: (v: unknown) => v is T
): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (validator && !validator(value)) {
    return defaultValue;
  }
  
  return value as T;
}

/**
 * Parse JSON string to typed object
 */
export function parseJsonField<T>(
  value: string | null | undefined,
  defaultValue: T
): T {
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}
