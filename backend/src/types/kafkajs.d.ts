/**
 * Type Definitions — Kafkajs D
 *
 * TypeScript type definitions and interfaces.
 *
 * @exports Kafka, KafkaConfig, ProducerConfig, ConsumerConfig, ProducerRecord, ProducerBatch, EachMessagePayload, Producer
 * @module types/kafkajs.d
 */

// Type stub for kafkajs — optional dependency, dynamically imported at runtime.
// Install with: npm install kafkajs
declare module 'kafkajs' {
  export enum logLevel {
    NOTHING = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 4,
    DEBUG = 5,
  }

  export interface KafkaConfig {
    clientId?: string;
    brokers: string[];
    logLevel?: logLevel;
    ssl?: boolean | object;
    sasl?: { mechanism: string; username: string; password: string };
    retry?: { initialRetryTime?: number; retries?: number };
    connectionTimeout?: number;
    requestTimeout?: number;
  }

  export interface ProducerConfig {
    idempotent?: boolean;
    maxInFlightRequests?: number;
    transactionalId?: string;
  }

  export interface ConsumerConfig {
    groupId: string;
    sessionTimeout?: number;
    heartbeatInterval?: number;
    maxWaitTimeInMs?: number;
    retry?: { retries?: number };
  }

  export interface ProducerRecord {
    topic: string;
    messages: Array<{
      key?: string | null;
      value: string | Buffer;
      headers?: Record<string, string>;
      timestamp?: string;
    }>;
  }

  export interface ProducerBatch {
    topicMessages: ProducerRecord[];
  }

  export interface EachMessagePayload {
    topic: string;
    partition: number;
    message: {
      key: Buffer | null;
      value: Buffer | null;
      headers: Record<string, Buffer>;
      offset: string;
      timestamp: string;
    };
  }

  export interface Producer {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(record: ProducerRecord): Promise<any>;
    sendBatch(batch: ProducerBatch): Promise<any>;
  }

  export interface Consumer {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(opts: { topic: string; fromBeginning?: boolean }): Promise<void>;
    run(opts: { autoCommitInterval?: number; eachMessage: (payload: EachMessagePayload) => Promise<void> }): Promise<void>;
  }

  export interface Admin {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    listTopics(): Promise<string[]>;
    createTopics(opts: { topics: Array<{ topic: string; numPartitions: number; replicationFactor: number; configEntries?: Array<{ name: string; value: string }> }>; waitForLeaders?: boolean }): Promise<boolean>;
    describeCluster(): Promise<{ brokers: Array<{ nodeId: number; host: string; port: number }>; controller: number; clusterId: string }>;
    fetchOffsets(opts: { groupId: string }): Promise<Array<{ topic: string; partitions: Array<{ partition: number; offset: string }> }>>;
    fetchTopicOffsets(topic: string): Promise<Array<{ partition: number; offset: string }>>;
  }

  export class Kafka {
    constructor(config: KafkaConfig);
    producer(config?: ProducerConfig): Producer;
    consumer(config: ConsumerConfig): Consumer;
    admin(): Admin;
  }
}
