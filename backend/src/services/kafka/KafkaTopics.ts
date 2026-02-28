// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA KAFKA TOPIC REGISTRY
// Defines all Kafka topics, partition strategies, and retention policies.
// =============================================================================

export interface TopicConfig {
  /** Topic name (dot-delimited namespace) */
  name: string;
  /** Number of partitions (determines parallelism) */
  partitions: number;
  /** Replication factor (must be ≤ broker count) */
  replicationFactor: number;
  /** Retention period in milliseconds (-1 = forever) */
  retentionMs: number;
  /** Cleanup policy: 'delete' | 'compact' | 'compact,delete' */
  cleanupPolicy: string;
  /** Human-readable description */
  description: string;
  /** Partition key strategy hint */
  partitionKey: string;
}

// =============================================================================
// TOPIC DEFINITIONS
// =============================================================================

/**
 * All platform Kafka topics.
 * Naming convention: datacendia.<domain>.<event-category>
 */
export const KAFKA_TOPICS: Record<string, TopicConfig> = {
  // ── Decision Governance ────────────────────────────────────────────────
  DELIBERATION_EVENTS: {
    name: 'datacendia.council.deliberations',
    partitions: 6,
    replicationFactor: 2,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    description: 'Council deliberation lifecycle events (created, phase changes, completed)',
    partitionKey: 'deliberationId',
  },

  DECISION_EVENTS: {
    name: 'datacendia.governance.decisions',
    partitions: 6,
    replicationFactor: 2,
    retentionMs: -1, // Indefinite — regulatory retention
    cleanupPolicy: 'delete',
    description: 'All decision events across all primitives (Horizon, Predict, Recall, etc.)',
    partitionKey: 'decisionId',
  },

  AGENT_MESSAGES: {
    name: 'datacendia.agents.messages',
    partitions: 12,
    replicationFactor: 2,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    description: 'Agent chat messages and inference requests/responses',
    partitionKey: 'sessionId',
  },

  // ── Compliance & Audit ─────────────────────────────────────────────────
  AUDIT_LOG: {
    name: 'datacendia.compliance.audit',
    partitions: 6,
    replicationFactor: 3,
    retentionMs: -1, // Indefinite — regulatory
    cleanupPolicy: 'delete',
    description: 'Immutable audit log of all platform actions',
    partitionKey: 'organizationId',
  },

  SENTRY_EVENTS: {
    name: 'datacendia.compliance.sentry',
    partitions: 3,
    replicationFactor: 2,
    retentionMs: 90 * 24 * 60 * 60 * 1000, // 90 days
    cleanupPolicy: 'delete',
    description: 'CendiaSentry policy evaluation results and guardrail events',
    partitionKey: 'organizationId',
  },

  COMPLIANCE_ALERTS: {
    name: 'datacendia.compliance.alerts',
    partitions: 3,
    replicationFactor: 2,
    retentionMs: 365 * 24 * 60 * 60 * 1000, // 1 year
    cleanupPolicy: 'delete',
    description: 'Compliance violation alerts and remediation tracking',
    partitionKey: 'organizationId',
  },

  // ── Platform Operations ────────────────────────────────────────────────
  CHRONOS_TIMELINE: {
    name: 'datacendia.platform.chronos',
    partitions: 6,
    replicationFactor: 2,
    retentionMs: 90 * 24 * 60 * 60 * 1000, // 90 days
    cleanupPolicy: 'delete',
    description: 'Chronos platform timeline events (mirrors ChronosEventBus)',
    partitionKey: 'organizationId',
  },

  INFERENCE_TELEMETRY: {
    name: 'datacendia.platform.inference',
    partitions: 6,
    replicationFactor: 1,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    description: 'Inference provider telemetry (latency, tokens, model usage)',
    partitionKey: 'provider',
  },

  HEALTH_METRICS: {
    name: 'datacendia.platform.health',
    partitions: 3,
    replicationFactor: 1,
    retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    cleanupPolicy: 'delete',
    description: 'System health metrics and status changes',
    partitionKey: 'service',
  },

  // ── Workflow Orchestration ─────────────────────────────────────────────
  WORKFLOW_EVENTS: {
    name: 'datacendia.workflows.events',
    partitions: 6,
    replicationFactor: 2,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    description: 'Workflow execution lifecycle events',
    partitionKey: 'executionId',
  },

  // ── Verticals ──────────────────────────────────────────────────────────
  VERTICAL_EVENTS: {
    name: 'datacendia.verticals.events',
    partitions: 6,
    replicationFactor: 2,
    retentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    cleanupPolicy: 'delete',
    description: 'Vertical-specific domain events (financial, healthcare, etc.)',
    partitionKey: 'verticalId',
  },

  // ── Dead Letter Queue ──────────────────────────────────────────────────
  DEAD_LETTER: {
    name: 'datacendia.platform.dlq',
    partitions: 3,
    replicationFactor: 2,
    retentionMs: -1, // Keep forever for investigation
    cleanupPolicy: 'compact',
    description: 'Dead letter queue for failed event processing',
    partitionKey: 'originalTopic',
  },
} as const;

/**
 * Get all topic names as an array.
 */
export function getAllTopicNames(): string[] {
  return Object.values(KAFKA_TOPICS).map(t => t.name);
}

/**
 * Get topic config by name.
 */
export function getTopicByName(name: string): TopicConfig | undefined {
  return Object.values(KAFKA_TOPICS).find(t => t.name === name);
}
