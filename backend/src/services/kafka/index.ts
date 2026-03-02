/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/kafka/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA KAFKA INFRASTRUCTURE — Barrel Exports
// =============================================================================

// Topic registry
export { KAFKA_TOPICS, getAllTopicNames, getTopicByName } from './KafkaTopics.js';
export type { TopicConfig } from './KafkaTopics.js';

// Core Kafka service
export { kafka, default } from './KafkaService.js';
export type {
  KafkaMessage,
  KafkaProducerRecord,
  KafkaConsumerConfig,
  ConsumedMessage,
  KafkaHealthStatus,
} from './KafkaService.js';

// Event bridge (connects existing event systems to Kafka)
export { kafkaEventBridge } from './KafkaEventBridge.js';
export type { BridgeConfig } from './KafkaEventBridge.js';
