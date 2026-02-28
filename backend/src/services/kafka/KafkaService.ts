// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA KAFKA SERVICE
// Durable event streaming infrastructure using Apache Kafka.
//
// Provides:
//   - Producer with batching, compression, and idempotent delivery
//   - Consumer groups with at-least-once semantics
//   - Admin operations (topic creation, health checks)
//   - Graceful shutdown with drain support
//
// Configuration via environment:
//   KAFKA_BROKERS        — comma-separated broker list (default: localhost:9092)
//   KAFKA_CLIENT_ID      — client identifier (default: datacendia-platform)
//   KAFKA_SASL_USERNAME  — SASL username (optional)
//   KAFKA_SASL_PASSWORD  — SASL password (optional)
//   KAFKA_SSL_ENABLED    — 'true' to enable TLS (default: false)
//   KAFKA_ENABLED        — 'true' to activate Kafka (default: false, Redis pub/sub used)
// =============================================================================

import { logger } from '../../utils/logger.js';
import { KAFKA_TOPICS, getAllTopicNames, type TopicConfig } from './KafkaTopics.js';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface KafkaMessage {
  key?: string;
  value: string | Buffer;
  headers?: Record<string, string>;
  timestamp?: string;
  partition?: number;
}

export interface KafkaProducerRecord {
  topic: string;
  messages: KafkaMessage[];
}

export interface KafkaConsumerConfig {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
  handler: (payload: ConsumedMessage) => Promise<void>;
  /** Max concurrent message processing per partition */
  concurrency?: number;
  /** Auto-commit interval in ms */
  autoCommitIntervalMs?: number;
}

export interface ConsumedMessage {
  topic: string;
  partition: number;
  offset: string;
  key: string | null;
  value: string;
  headers: Record<string, string>;
  timestamp: string;
}

export interface KafkaHealthStatus {
  enabled: boolean;
  connected: boolean;
  brokerCount: number;
  topicCount: number;
  producerReady: boolean;
  consumerGroups: string[];
  latencyMs?: number;
}

export type CompressionType = 'none' | 'gzip' | 'snappy' | 'lz4' | 'zstd';

// ---------------------------------------------------------------------------
// IN-MEMORY EVENT BUFFER (used when Kafka is disabled)
// ---------------------------------------------------------------------------

interface BufferedEvent {
  topic: string;
  key?: string;
  value: string;
  headers?: Record<string, string>;
  timestamp: Date;
}

class InMemoryEventBuffer {
  private events: BufferedEvent[] = [];
  private maxSize: number;
  private listeners: Map<string, ((event: BufferedEvent) => void)[]> = new Map();

  constructor(maxSize = 10_000) {
    this.maxSize = maxSize;
  }

  push(event: BufferedEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxSize) {
      this.events.shift(); // Drop oldest
    }
    // Notify topic listeners
    const handlers = this.listeners.get(event.topic) || [];
    for (const handler of handlers) {
      try { handler(event); } catch { /* swallow */ }
    }
  }

  subscribe(topic: string, handler: (event: BufferedEvent) => void): void {
    const existing = this.listeners.get(topic) || [];
    existing.push(handler);
    this.listeners.set(topic, existing);
  }

  getEvents(topic?: string, limit = 100): BufferedEvent[] {
    let result = topic ? this.events.filter(e => e.topic === topic) : [...this.events];
    return result.slice(-limit);
  }

  size(): number { return this.events.length; }
  clear(): void { this.events = []; }
}

// ---------------------------------------------------------------------------
// KAFKA SERVICE
// ---------------------------------------------------------------------------

class KafkaService {
  private enabled: boolean;
  private connected = false;
  private kafkaClient: any = null;
  private producer: any = null;
  private consumers: Map<string, any> = new Map();
  private admin: any = null;
  private buffer: InMemoryEventBuffer;
  private consumerConfigs: KafkaConsumerConfig[] = [];

  // Stats
  private messagesSent = 0;
  private messagesReceived = 0;
  private errors = 0;
  private lastError: string | null = null;

  constructor() {
    this.enabled = process.env['KAFKA_ENABLED'] === 'true';
    this.buffer = new InMemoryEventBuffer();

    if (!this.enabled) {
      logger.info('[Kafka] Disabled — using in-memory event buffer. Set KAFKA_ENABLED=true to activate.');
    }
  }

  // ─── Initialization ──────────────────────────────────────────────────

  /**
   * Connect to Kafka cluster and initialize producer.
   * No-op if KAFKA_ENABLED !== 'true'.
   */
  async connect(): Promise<void> {
    if (!this.enabled) return;

    try {
      // Dynamic import of kafkajs (optional dependency)
      const { Kafka, logLevel } = await import('kafkajs');

      const brokers = (process.env['KAFKA_BROKERS'] || 'localhost:9092').split(',').map(b => b.trim());
      const clientId = process.env['KAFKA_CLIENT_ID'] || 'datacendia-platform';

      const kafkaConfig: any = {
        clientId,
        brokers,
        logLevel: logLevel.WARN,
        retry: { initialRetryTime: 300, retries: 10 },
        connectionTimeout: 10_000,
        requestTimeout: 30_000,
      };

      // SASL authentication (optional)
      const saslUser = process.env['KAFKA_SASL_USERNAME'];
      const saslPass = process.env['KAFKA_SASL_PASSWORD'];
      if (saslUser && saslPass) {
        kafkaConfig.sasl = {
          mechanism: 'plain',
          username: saslUser,
          password: saslPass,
        };
      }

      // TLS (optional)
      if (process.env['KAFKA_SSL_ENABLED'] === 'true') {
        kafkaConfig.ssl = true;
      }

      this.kafkaClient = new Kafka(kafkaConfig);
      this.admin = this.kafkaClient.admin();
      await this.admin.connect();

      // Ensure topics exist
      await this.ensureTopics();

      // Initialize idempotent producer
      this.producer = this.kafkaClient.producer({
        idempotent: true,
        maxInFlightRequests: 5,
        transactionalId: `${clientId}-producer`,
      });
      await this.producer.connect();

      this.connected = true;
      logger.info(`[Kafka] Connected to ${brokers.join(', ')} — producer ready`);

      // Drain buffered events from startup window
      await this.drainBuffer();
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : String(error);
      this.errors++;
      logger.error('[Kafka] Connection failed — falling back to in-memory buffer:', error);
      this.connected = false;
    }
  }

  /**
   * Ensure all defined topics exist with correct configuration.
   */
  private async ensureTopics(): Promise<void> {
    if (!this.admin) return;

    try {
      const existingTopics = await this.admin.listTopics();
      const topicsToCreate: Array<{
        topic: string;
        numPartitions: number;
        replicationFactor: number;
        configEntries: Array<{ name: string; value: string }>;
      }> = [];

      for (const config of Object.values(KAFKA_TOPICS)) {
        if (!existingTopics.includes(config.name)) {
          topicsToCreate.push({
            topic: config.name,
            numPartitions: config.partitions,
            replicationFactor: config.replicationFactor,
            configEntries: [
              { name: 'retention.ms', value: String(config.retentionMs) },
              { name: 'cleanup.policy', value: config.cleanupPolicy },
            ],
          });
        }
      }

      if (topicsToCreate.length > 0) {
        await this.admin.createTopics({ topics: topicsToCreate, waitForLeaders: true });
        logger.info(`[Kafka] Created ${topicsToCreate.length} topics: ${topicsToCreate.map(t => t.topic).join(', ')}`);
      }
    } catch (error) {
      logger.warn('[Kafka] Topic creation warning (may already exist):', error);
    }
  }

  /**
   * Drain in-memory buffer into Kafka after connection is established.
   */
  private async drainBuffer(): Promise<void> {
    const events = this.buffer.getEvents(undefined, 10_000);
    if (events.length === 0) return;

    logger.info(`[Kafka] Draining ${events.length} buffered events into Kafka...`);
    let drained = 0;

    for (const event of events) {
      try {
        await this.producer.send({
          topic: event.topic,
          messages: [{
            key: event.key || null,
            value: event.value,
            headers: event.headers || {},
            timestamp: event.timestamp.getTime().toString(),
          }],
        });
        drained++;
      } catch {
        // Skip failed events during drain
      }
    }

    this.buffer.clear();
    logger.info(`[Kafka] Drained ${drained}/${events.length} buffered events`);
  }

  // ─── Producer ─────────────────────────────────────────────────────────

  /**
   * Produce a single message to a topic.
   * Falls back to in-memory buffer if Kafka is disabled/disconnected.
   */
  async produce(topic: string, message: KafkaMessage): Promise<void> {
    const bufferedEvent: BufferedEvent = {
      topic,
      key: message.key,
      value: typeof message.value === 'string' ? message.value : message.value.toString('utf-8'),
      headers: message.headers,
      timestamp: new Date(),
    };

    // Always buffer for in-memory consumers
    this.buffer.push(bufferedEvent);

    if (this.connected && this.producer) {
      try {
        await this.producer.send({
          topic,
          messages: [{
            key: message.key || null,
            value: message.value,
            headers: message.headers || {},
            timestamp: message.timestamp || Date.now().toString(),
          }],
        });
        this.messagesSent++;
      } catch (error) {
        this.errors++;
        this.lastError = error instanceof Error ? error.message : String(error);
        logger.error(`[Kafka] Produce failed for ${topic}:`, error);
      }
    }
  }

  /**
   * Produce a batch of messages to a topic.
   */
  async produceBatch(records: KafkaProducerRecord[]): Promise<void> {
    for (const record of records) {
      for (const msg of record.messages) {
        this.buffer.push({
          topic: record.topic,
          key: msg.key,
          value: typeof msg.value === 'string' ? msg.value : msg.value.toString('utf-8'),
          headers: msg.headers,
          timestamp: new Date(),
        });
      }
    }

    if (this.connected && this.producer) {
      try {
        await this.producer.sendBatch({
          topicMessages: records.map(r => ({
            topic: r.topic,
            messages: r.messages.map(m => ({
              key: m.key || null,
              value: m.value,
              headers: m.headers || {},
              timestamp: m.timestamp || Date.now().toString(),
            })),
          })),
        });
        this.messagesSent += records.reduce((sum, r) => sum + r.messages.length, 0);
      } catch (error) {
        this.errors++;
        this.lastError = error instanceof Error ? error.message : String(error);
        logger.error('[Kafka] Batch produce failed:', error);
      }
    }
  }

  /**
   * High-level helper: produce a typed JSON event.
   */
  async emit(topic: string, key: string, payload: Record<string, unknown>, headers?: Record<string, string>): Promise<void> {
    const enrichedHeaders = {
      'x-source': 'datacendia-platform',
      'x-timestamp': new Date().toISOString(),
      'x-content-type': 'application/json',
      ...headers,
    };

    await this.produce(topic, {
      key,
      value: JSON.stringify(payload),
      headers: enrichedHeaders,
      timestamp: Date.now().toString(),
    });
  }

  // ─── Consumer ─────────────────────────────────────────────────────────

  /**
   * Register a consumer group. Starts consuming when Kafka is connected.
   * Falls back to in-memory buffer subscription if Kafka is disabled.
   */
  async subscribe(config: KafkaConsumerConfig): Promise<void> {
    this.consumerConfigs.push(config);

    if (!this.connected || !this.kafkaClient) {
      // Fallback: subscribe to in-memory buffer
      for (const topic of config.topics) {
        this.buffer.subscribe(topic, async (event) => {
          try {
            await config.handler({
              topic: event.topic,
              partition: 0,
              offset: '0',
              key: event.key || null,
              value: event.value,
              headers: event.headers || {},
              timestamp: event.timestamp.toISOString(),
            });
            this.messagesReceived++;
          } catch (error) {
            this.errors++;
            logger.error(`[Kafka] In-memory consumer error for ${config.groupId}:`, error);
          }
        });
      }
      logger.info(`[Kafka] Registered in-memory consumer: ${config.groupId} → [${config.topics.join(', ')}]`);
      return;
    }

    try {
      const consumer = this.kafkaClient.consumer({
        groupId: config.groupId,
        sessionTimeout: 30_000,
        heartbeatInterval: 3_000,
        maxWaitTimeInMs: 5_000,
        retry: { retries: 5 },
      });

      await consumer.connect();

      for (const topic of config.topics) {
        await consumer.subscribe({ topic, fromBeginning: config.fromBeginning || false });
      }

      await consumer.run({
        autoCommitInterval: config.autoCommitIntervalMs || 5_000,
        eachMessage: async ({ topic, partition, message }: any) => {
          try {
            const consumed: ConsumedMessage = {
              topic,
              partition,
              offset: message.offset,
              key: message.key?.toString() || null,
              value: message.value?.toString() || '',
              headers: Object.fromEntries(
                Object.entries(message.headers || {}).map(([k, v]: [string, any]) => [k, v?.toString() || ''])
              ),
              timestamp: message.timestamp,
            };

            await config.handler(consumed);
            this.messagesReceived++;
          } catch (error) {
            this.errors++;
            this.lastError = error instanceof Error ? error.message : String(error);
            logger.error(`[Kafka] Consumer ${config.groupId} processing error:`, error);

            // Send to DLQ
            await this.sendToDLQ(topic, message, error);
          }
        },
      });

      this.consumers.set(config.groupId, consumer);
      logger.info(`[Kafka] Consumer ${config.groupId} started → [${config.topics.join(', ')}]`);
    } catch (error) {
      logger.error(`[Kafka] Failed to start consumer ${config.groupId}:`, error);
    }
  }

  /**
   * Send a failed message to the Dead Letter Queue.
   */
  private async sendToDLQ(originalTopic: string, message: any, error: unknown): Promise<void> {
    try {
      await this.emit(
        KAFKA_TOPICS.DEAD_LETTER.name,
        originalTopic,
        {
          originalTopic,
          originalKey: message.key?.toString(),
          originalValue: message.value?.toString(),
          error: error instanceof Error ? error.message : String(error),
          failedAt: new Date().toISOString(),
        },
        { 'x-dlq-reason': error instanceof Error ? error.message : 'unknown' },
      );
    } catch {
      logger.error('[Kafka] Failed to send to DLQ');
    }
  }

  // ─── Admin & Health ───────────────────────────────────────────────────

  /**
   * Get Kafka cluster health status.
   */
  async getHealth(): Promise<KafkaHealthStatus> {
    if (!this.enabled) {
      return {
        enabled: false,
        connected: false,
        brokerCount: 0,
        topicCount: 0,
        producerReady: false,
        consumerGroups: [],
      };
    }

    if (!this.connected || !this.admin) {
      return {
        enabled: true,
        connected: false,
        brokerCount: 0,
        topicCount: 0,
        producerReady: false,
        consumerGroups: [...this.consumers.keys()],
        latencyMs: undefined,
      };
    }

    const start = Date.now();
    try {
      const [cluster, topics] = await Promise.all([
        this.admin.describeCluster(),
        this.admin.listTopics(),
      ]);

      return {
        enabled: true,
        connected: true,
        brokerCount: cluster.brokers.length,
        topicCount: topics.length,
        producerReady: !!this.producer,
        consumerGroups: [...this.consumers.keys()],
        latencyMs: Date.now() - start,
      };
    } catch {
      return {
        enabled: true,
        connected: false,
        brokerCount: 0,
        topicCount: 0,
        producerReady: false,
        consumerGroups: [...this.consumers.keys()],
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * Get consumer group lag (how far behind each consumer is).
   */
  async getConsumerLag(groupId: string): Promise<Record<string, number> | null> {
    if (!this.admin) return null;

    try {
      const offsets = await this.admin.fetchOffsets({ groupId });
      const lag: Record<string, number> = {};

      for (const { topic, partitions } of offsets) {
        const topicOffsets = await this.admin.fetchTopicOffsets(topic);
        for (const p of partitions) {
          const latest = topicOffsets.find((to: any) => to.partition === p.partition);
          if (latest) {
            const partitionLag = Number(latest.offset) - Number(p.offset);
            lag[`${topic}:${p.partition}`] = Math.max(0, partitionLag);
          }
        }
      }

      return lag;
    } catch (error) {
      logger.error(`[Kafka] Failed to fetch consumer lag for ${groupId}:`, error);
      return null;
    }
  }

  /**
   * Get service statistics.
   */
  getStats(): {
    enabled: boolean;
    connected: boolean;
    messagesSent: number;
    messagesReceived: number;
    errors: number;
    lastError: string | null;
    bufferSize: number;
    consumerGroups: string[];
  } {
    return {
      enabled: this.enabled,
      connected: this.connected,
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
      errors: this.errors,
      lastError: this.lastError,
      bufferSize: this.buffer.size(),
      consumerGroups: [...this.consumers.keys()],
    };
  }

  /**
   * Get buffered events (when Kafka is disabled).
   */
  getBufferedEvents(topic?: string, limit = 100): BufferedEvent[] {
    return this.buffer.getEvents(topic, limit);
  }

  /**
   * Check if Kafka is enabled and connected.
   */
  isReady(): boolean {
    return this.enabled && this.connected;
  }

  /**
   * Check if Kafka is enabled (may not be connected yet).
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  /**
   * Graceful shutdown: drain producer, disconnect consumers.
   */
  async shutdown(): Promise<void> {
    logger.info('[Kafka] Shutting down...');

    // Disconnect consumers
    for (const [groupId, consumer] of this.consumers) {
      try {
        await consumer.disconnect();
        logger.info(`[Kafka] Consumer ${groupId} disconnected`);
      } catch (error) {
        logger.error(`[Kafka] Error disconnecting consumer ${groupId}:`, error);
      }
    }
    this.consumers.clear();

    // Disconnect producer
    if (this.producer) {
      try {
        await this.producer.disconnect();
        logger.info('[Kafka] Producer disconnected');
      } catch (error) {
        logger.error('[Kafka] Error disconnecting producer:', error);
      }
    }

    // Disconnect admin
    if (this.admin) {
      try {
        await this.admin.disconnect();
      } catch {
        // Ignore
      }
    }

    this.connected = false;
    logger.info('[Kafka] Shutdown complete');
  }
}

// Export singleton
export const kafka = new KafkaService();
export default kafka;
