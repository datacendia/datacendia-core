// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * WebSocket Event Emitters
 * Utility functions to emit real-time events to connected clients
 */

import { pubsub } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// DELIBERATION EVENTS
// =============================================================================

export interface DeliberationMessage {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  type: 'analysis' | 'question' | 'response' | 'synthesis' | 'recommendation';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DeliberationPhaseUpdate {
  deliberationId: string;
  phase: 'initial_analysis' | 'cross_examination' | 'synthesis' | 'ethics_check' | 'complete';
  progress: number;
  currentAgent?: string;
}

export interface DeliberationResult {
  deliberationId: string;
  summary: string;
  recommendation: string;
  confidence: number;
  dissent?: string;
  supportingData?: Record<string, unknown>[];
}

/**
 * Emit a deliberation message (streaming agent response)
 */
export async function emitDeliberationMessage(
  deliberationId: string,
  message: DeliberationMessage
): Promise<void> {
  const channel = `deliberation:${deliberationId}`;
  const payload = {
    type: 'message',
    data: message,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.debug(`Emitted deliberation message for ${deliberationId}`);
}

/**
 * Emit a deliberation phase update
 */
export async function emitDeliberationPhase(
  update: DeliberationPhaseUpdate
): Promise<void> {
  const channel = `deliberation:${update.deliberationId}`;
  const payload = {
    type: 'phase',
    data: update,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.debug(`Emitted phase update for ${update.deliberationId}: ${update.phase}`);
}

/**
 * Emit deliberation completion with result
 */
export async function emitDeliberationComplete(
  deliberationId: string,
  result: DeliberationResult
): Promise<void> {
  const channel = `deliberation:${deliberationId}`;
  const payload = {
    type: 'complete',
    data: result,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.info(`Emitted deliberation complete for ${deliberationId}`);
}

// =============================================================================
// WORKFLOW EVENTS
// =============================================================================

export interface WorkflowStepUpdate {
  executionId: string;
  workflowId: string;
  stepId: string;
  stepName: string;
  status: 'running' | 'completed' | 'failed' | 'skipped';
  progress: number;
  output?: unknown;
  error?: string;
}

export interface WorkflowExecutionComplete {
  executionId: string;
  workflowId: string;
  status: 'completed' | 'failed';
  duration: number;
  outputs?: Record<string, unknown>;
  error?: string;
}

/**
 * Emit workflow step update
 */
export async function emitWorkflowStep(
  update: WorkflowStepUpdate
): Promise<void> {
  const channel = `workflow:${update.executionId}`;
  const payload = {
    type: 'step',
    data: update,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.debug(`Emitted workflow step for ${update.executionId}: ${update.stepName}`);
}

/**
 * Emit workflow execution complete
 */
export async function emitWorkflowComplete(
  completion: WorkflowExecutionComplete
): Promise<void> {
  const channel = `workflow:${completion.executionId}`;
  const payload = {
    type: 'complete',
    data: completion,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.info(`Emitted workflow complete for ${completion.executionId}`);
}

// =============================================================================
// ALERT EVENTS
// =============================================================================

export interface AlertEvent {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Emit a new alert to organization
 */
export async function emitAlert(
  organizationId: string,
  alert: AlertEvent
): Promise<void> {
  const channel = `alerts:${organizationId}`;
  const payload = {
    type: 'new',
    data: alert,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.info(`Emitted alert for org ${organizationId}: ${alert.title}`);
}

/**
 * Emit alert status change (acknowledged, resolved)
 */
export async function emitAlertUpdate(
  organizationId: string,
  alertId: string,
  status: 'acknowledged' | 'resolved',
  updatedBy?: string
): Promise<void> {
  const channel = `alerts:${organizationId}`;
  const payload = {
    type: 'update',
    data: { id: alertId, status, updatedBy },
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.debug(`Emitted alert update for ${alertId}: ${status}`);
}

// =============================================================================
// HEALTH EVENTS
// =============================================================================

export interface HealthUpdate {
  overall: number;
  dimensions: {
    data: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    operations: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    security: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    people: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
  };
}

/**
 * Emit health score update to organization
 */
export async function emitHealthUpdate(
  organizationId: string,
  health: HealthUpdate
): Promise<void> {
  const channel = `health:${organizationId}`;
  const payload = {
    type: 'update',
    data: health,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
  logger.debug(`Emitted health update for org ${organizationId}`);
}

// =============================================================================
// GENERIC BROADCAST
// =============================================================================

/**
 * Broadcast to all clients in an organization
 */
export async function broadcastToOrganization(
  organizationId: string,
  eventType: string,
  data: unknown
): Promise<void> {
  const channel = `org:${organizationId}`;
  const payload = {
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
  };

  await pubsub.publish(channel, JSON.stringify(payload));
}
