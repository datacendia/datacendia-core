// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA KAFKA EVENT BRIDGE
// Connects existing in-process event systems to Kafka durable streaming.
//
// Bridges:
//   EventBus (core/events)    → Kafka topics  (publish)
//   ChronosEventBus           → Kafka topics  (publish)
//   Redis pub/sub             → Kafka topics  (publish)
//   Kafka topics              → EventBus      (consume, optional)
//
// The bridge is non-intrusive: existing consumers continue to work via
// EventBus/Redis. Kafka provides durability, replay, and cross-service delivery.
// =============================================================================

import { logger } from '../../utils/logger.js';
import { kafka } from './KafkaService.js';
import { KAFKA_TOPICS } from './KafkaTopics.js';
import type { ConsumedMessage } from './KafkaService.js';

// ---------------------------------------------------------------------------
// BRIDGE CONFIGURATION
// ---------------------------------------------------------------------------

export interface BridgeConfig {
  /** Bridge EventBus → Kafka */
  bridgeEventBus: boolean;
  /** Bridge ChronosEventBus → Kafka */
  bridgeChronos: boolean;
  /** Bridge audit log writes → Kafka */
  bridgeAudit: boolean;
  /** Bridge inference telemetry → Kafka */
  bridgeInference: boolean;
  /** Bridge sentry/guardrail events → Kafka */
  bridgeSentry: boolean;
}

const DEFAULT_CONFIG: BridgeConfig = {
  bridgeEventBus: true,
  bridgeChronos: true,
  bridgeAudit: true,
  bridgeInference: true,
  bridgeSentry: true,
};

// ---------------------------------------------------------------------------
// EVENT BRIDGE
// ---------------------------------------------------------------------------

class KafkaEventBridge {
  private initialized = false;
  private config: BridgeConfig;
  private subscriptionIds: string[] = [];

  constructor(config: Partial<BridgeConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize all configured bridges.
   * Safe to call even if Kafka is disabled — bridges become no-ops.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    logger.info('[KafkaEventBridge] Initializing event bridges...');

    if (this.config.bridgeEventBus) await this.bridgeEventBus();
    if (this.config.bridgeChronos) await this.bridgeChronos();
    if (this.config.bridgeAudit) await this.bridgeAudit();
    if (this.config.bridgeInference) await this.bridgeInference();
    if (this.config.bridgeSentry) await this.bridgeSentry();

    logger.info('[KafkaEventBridge] All bridges initialized');
  }

  // ─── EventBus Bridge ──────────────────────────────────────────────────

  /**
   * Subscribe to the in-process EventBus and forward events to Kafka.
   */
  private async bridgeEventBus(): Promise<void> {
    try {
      const { eventBus } = await import('../../core/events/EventBus.js');

      // Forward all decision-related events
      const decisionTypes = [
        'decision.*', 'horizon.*', 'predict.*', 'recall.*',
        'deliberation.*', 'council.*', 'dissent.*',
      ];

      for (const pattern of decisionTypes) {
        const subId = eventBus.subscribePattern(pattern, async (event) => {
          const p = event.payload as any;
          await kafka.emit(
            KAFKA_TOPICS.DECISION_EVENTS.name,
            p?.decisionId || event.id,
            {
              eventId: event.id,
              eventType: event.type,
              source: event.source,
              timestamp: event.timestamp.toISOString(),
              correlationId: event.correlationId,
              causationId: event.causationId,
              version: event.version,
              payload: event.payload,
              metadata: event.metadata,
            },
            { 'x-bridge': 'eventbus', 'x-event-type': event.type },
          );
        }, { priority: 999 }); // Low priority = runs after all other handlers

        this.subscriptionIds.push(subId);
      }

      // Forward workflow events
      const workflowSubId = eventBus.subscribePattern('workflow.*', async (event) => {
        const p = event.payload as any;
        await kafka.emit(
          KAFKA_TOPICS.WORKFLOW_EVENTS.name,
          p?.executionId || event.id,
          {
            eventId: event.id,
            eventType: event.type,
            source: event.source,
            timestamp: event.timestamp.toISOString(),
            payload: event.payload,
          },
          { 'x-bridge': 'eventbus', 'x-event-type': event.type },
        );
      }, { priority: 999 });
      this.subscriptionIds.push(workflowSubId);

      // Forward agent messages
      const agentSubId = eventBus.subscribePattern('agent.*', async (event) => {
        const p = event.payload as any;
        await kafka.emit(
          KAFKA_TOPICS.AGENT_MESSAGES.name,
          p?.sessionId || event.id,
          {
            eventId: event.id,
            eventType: event.type,
            source: event.source,
            timestamp: event.timestamp.toISOString(),
            payload: event.payload,
          },
          { 'x-bridge': 'eventbus', 'x-event-type': event.type },
        );
      }, { priority: 999 });
      this.subscriptionIds.push(agentSubId);

      logger.info('[KafkaEventBridge] EventBus → Kafka bridge active');
    } catch (error) {
      logger.warn('[KafkaEventBridge] Failed to bridge EventBus:', error);
    }
  }

  // ─── Chronos Bridge ───────────────────────────────────────────────────

  /**
   * Subscribe to ChronosEventBus and forward timeline events to Kafka.
   */
  private async bridgeChronos(): Promise<void> {
    try {
      const { chronosEventBus } = await import('../ChronosEventBus.js');

      chronosEventBus.on('chronos:event', async (record: any) => {
        try {
          await kafka.emit(
            KAFKA_TOPICS.CHRONOS_TIMELINE.name,
            record.organizationId || 'system',
            {
              id: record.id,
              organizationId: record.organizationId,
              eventType: record.eventType,
              category: record.category,
              severity: record.severity,
              title: record.title,
              description: record.description,
              actor: record.actor,
              actorType: record.actorType,
              resourceType: record.resourceType,
              resourceId: record.resourceId,
              magnitude: record.magnitude,
              metadata: record.metadata,
              createdAt: record.createdAt?.toISOString?.() || new Date().toISOString(),
            },
            { 'x-bridge': 'chronos', 'x-category': record.category || 'unknown' },
          );
        } catch (error) {
          logger.error('[KafkaEventBridge] Chronos → Kafka failed:', error);
        }
      });

      // Forward high-severity events with urgency header
      chronosEventBus.on('chronos:high-severity', async (record: any) => {
        try {
          await kafka.emit(
            KAFKA_TOPICS.COMPLIANCE_ALERTS.name,
            record.organizationId || 'system',
            {
              id: record.id,
              severity: record.severity,
              title: record.title,
              description: record.description,
              category: record.category,
              eventType: record.eventType,
              actor: record.actor,
              metadata: record.metadata,
              createdAt: record.createdAt?.toISOString?.() || new Date().toISOString(),
            },
            { 'x-bridge': 'chronos', 'x-priority': 'high' },
          );
        } catch {
          // Non-critical
        }
      });

      logger.info('[KafkaEventBridge] ChronosEventBus → Kafka bridge active');
    } catch (error) {
      logger.warn('[KafkaEventBridge] Failed to bridge ChronosEventBus:', error);
    }
  }

  // ─── Audit Bridge ─────────────────────────────────────────────────────

  /**
   * Provides a method to emit audit events to Kafka.
   * Called by routes/services that create audit_logs entries.
   */
  private async bridgeAudit(): Promise<void> {
    // The audit bridge exposes a helper method rather than subscribing to an emitter,
    // because audit logs are written directly to Prisma in routes.
    // Services can call kafkaEventBridge.emitAudit(...) alongside Prisma writes.
    logger.info('[KafkaEventBridge] Audit → Kafka bridge active (call emitAudit())');
  }

  /**
   * Emit an audit event to the Kafka audit topic.
   */
  async emitAudit(data: {
    organizationId: string;
    userId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, unknown>;
  }): Promise<void> {
    await kafka.emit(
      KAFKA_TOPICS.AUDIT_LOG.name,
      data.organizationId,
      {
        ...data,
        timestamp: new Date().toISOString(),
      },
      { 'x-bridge': 'audit', 'x-action': data.action },
    );
  }

  // ─── Inference Telemetry Bridge ────────────────────────────────────────

  /**
   * Bridge for inference provider telemetry events.
   */
  private async bridgeInference(): Promise<void> {
    logger.info('[KafkaEventBridge] Inference → Kafka bridge active (call emitInferenceTelemetry())');
  }

  /**
   * Emit inference telemetry to Kafka.
   */
  async emitInferenceTelemetry(data: {
    provider: string;
    model: string;
    operation: 'generate' | 'chat' | 'embed' | 'stream';
    latencyMs: number;
    promptTokens?: number;
    completionTokens?: number;
    success: boolean;
    error?: string;
  }): Promise<void> {
    await kafka.emit(
      KAFKA_TOPICS.INFERENCE_TELEMETRY.name,
      data.provider,
      {
        ...data,
        timestamp: new Date().toISOString(),
      },
      { 'x-bridge': 'inference', 'x-provider': data.provider },
    );
  }

  // ─── Sentry Bridge ────────────────────────────────────────────────────

  /**
   * Bridge for CendiaSentry guardrail events.
   */
  private async bridgeSentry(): Promise<void> {
    logger.info('[KafkaEventBridge] Sentry → Kafka bridge active (call emitSentryEvent())');
  }

  /**
   * Emit a sentry/guardrail evaluation event to Kafka.
   */
  async emitSentryEvent(data: {
    organizationId: string;
    policyId: string;
    input: string;
    verdict: 'allow' | 'block' | 'flag' | 'modify';
    reason?: string;
    riskScore?: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await kafka.emit(
      KAFKA_TOPICS.SENTRY_EVENTS.name,
      data.organizationId,
      {
        ...data,
        timestamp: new Date().toISOString(),
      },
      { 'x-bridge': 'sentry', 'x-verdict': data.verdict },
    );
  }

  // ─── Vertical Events ──────────────────────────────────────────────────

  /**
   * Emit a vertical-specific domain event.
   */
  async emitVerticalEvent(data: {
    verticalId: string;
    organizationId: string;
    eventType: string;
    payload: Record<string, unknown>;
  }): Promise<void> {
    await kafka.emit(
      KAFKA_TOPICS.VERTICAL_EVENTS.name,
      data.verticalId,
      {
        ...data,
        timestamp: new Date().toISOString(),
      },
      { 'x-bridge': 'vertical', 'x-vertical': data.verticalId },
    );
  }

  // ─── Consumer Registration ────────────────────────────────────────────

  /**
   * Register a consumer for a specific topic.
   * Convenience wrapper around kafka.subscribe().
   */
  async registerConsumer(
    groupId: string,
    topics: string[],
    handler: (message: ConsumedMessage) => Promise<void>,
    options?: { fromBeginning?: boolean }
  ): Promise<void> {
    await kafka.subscribe({
      groupId,
      topics,
      handler,
      fromBeginning: options?.fromBeginning,
    });
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  /**
   * Tear down bridges.
   */
  async shutdown(): Promise<void> {
    try {
      const { eventBus } = await import('../../core/events/EventBus.js');
      for (const subId of this.subscriptionIds) {
        eventBus.unsubscribe(subId);
      }
    } catch {
      // EventBus may not be available
    }
    this.subscriptionIds = [];
    this.initialized = false;
    logger.info('[KafkaEventBridge] Bridges torn down');
  }
}

// Export singleton
export const kafkaEventBridge = new KafkaEventBridge();
export default kafkaEventBridge;
