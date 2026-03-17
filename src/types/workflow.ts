/**
 * Workflow Builder Types & Schemas
 *
 * Type definitions for the visual workflow builder — drag-and-drop
 * service orchestration with persistent storage.
 *
 * @module types/workflow
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SERVICE REGISTRY
// =============================================================================

export type ServiceCategory =
  | 'council'
  | 'intelligence'
  | 'dcii'
  | 'compliance'
  | 'governance'
  | 'crypto'
  | 'graph'
  | 'pulse'
  | 'bridge'
  | 'gateway'
  | 'crown'
  | 'enterprise'
  | 'sovereign'
  | 'verticals';

export type ServiceTier = 'foundation' | 'enterprise' | 'strategic';

export interface ServiceDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: ServiceCategory;
  tier: ServiceTier;
  icon: string;           // Lucide icon name
  color: string;          // Tailwind color class e.g. 'blue', 'emerald'
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  configSchema: ConfigField[];
}

export interface PortDefinition {
  id: string;
  name: string;
  type: 'decision' | 'data' | 'score' | 'report' | 'alert' | 'evidence' | 'any';
  description?: string;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea';
  defaultValue?: string | number | boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

// =============================================================================
// WORKFLOW DEFINITION
// =============================================================================

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  runCount: number;
  status: 'draft' | 'ready' | 'running' | 'completed' | 'failed';
  tags: string[];
}

export interface WorkflowStep {
  id: string;
  serviceId: string;
  label: string;
  config: Record<string, string | number | boolean>;
  position: { x: number; y: number };
  status?: 'idle' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: WorkflowStepResult;
}

export interface WorkflowStepResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  duration?: number;
  timestamp: string;
}

export interface WorkflowConnection {
  id: string;
  fromStepId: string;
  fromPortId: string;
  toStepId: string;
  toPortId: string;
}

// =============================================================================
// PERSISTENCE
// =============================================================================

export interface WorkflowListItem {
  id: string;
  name: string;
  description: string;
  stepCount: number;
  status: Workflow['status'];
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  runCount: number;
  tags: string[];
}

export interface WorkflowRunLog {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  stepResults: { stepId: string; result: WorkflowStepResult }[];
}
