/**
 * Data Adapter — Protocol Adapters
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports FHIRAdapter, FIXAdapter, MQTTAdapter, FHIRAdapterConfig, FHIRSubscription, FHIRResource, FIXAdapterConfig, FIXMessage
 * @module adapters/sovereign/ProtocolAdapters
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * STANDARD PROTOCOL ADAPTERS
 * =============================================================================
 * Only open standards - NOT proprietary APIs.
 * 
 * "We speak the universal language of your industry. If your system speaks
 * FHIR, we understand it."
 * 
 * Protocols:
 * - HL7 FHIR R4 (Healthcare)
 * - FIX Protocol (Financial)
 * - MQTT (IoT/Energy)
 * 
 * NOT included (liability traps):
 * - Bloomberg Terminal API (licensing)
 * - Epic proprietary APIs (BAA required)
 * - SWIFT direct (CSP compliance)
 * - ARINC 429 (hardware protocol)
 */

import { Readable } from 'stream';
import crypto from 'crypto';
import {
  SovereignAdapter,
  AdapterConfig,
  IngestRecord,
  RiskTier,
  DataClassification,
  adapterRegistry,
} from './SovereignAdapter.js';

// =============================================================================
// FHIR ADAPTER (Healthcare Standard)
// =============================================================================

export interface FHIRAdapterConfig extends AdapterConfig {
  fhirServerUrl: string;
  fhirVersion: 'R4' | 'STU3' | 'DSTU2';
  authType: 'none' | 'basic' | 'bearer' | 'smart';
  clientId?: string;
  clientSecret?: string;
  tokenUrl?: string;
  scope?: string;
  resourceTypes?: string[];
  subscriptions?: FHIRSubscription[];
}

export interface FHIRSubscription {
  id: string;
  resourceType: string;
  criteria?: string;
  channel: 'rest-hook' | 'websocket' | 'email';
}

export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
  };
  [key: string]: unknown;
}

/**
 * HL7 FHIR R4 Adapter
 * Standard healthcare interoperability protocol
 */
export class FHIRAdapter extends SovereignAdapter {
  private fhirConfig: FHIRAdapterConfig;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(config: FHIRAdapterConfig) {
    super(config);
    this.fhirConfig = {
      resourceTypes: ['Patient', 'Observation', 'Condition', 'MedicationRequest'],
      ...config,
      fhirVersion: config.fhirVersion || 'R4',
      authType: config.authType || 'none',
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Authenticate if required
    if (this.fhirConfig.authType !== 'none') {
      await this.authenticate();
    }

    // Verify server capability
    await this.fetchCapabilityStatement();

    this.isRunning = true;
    this.log('info', 'FHIR adapter started', { 
      server: this.fhirConfig.fhirServerUrl,
      version: this.fhirConfig.fhirVersion,
    });
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.accessToken = undefined;
    this.isRunning = false;
    this.log('info', 'FHIR adapter stopped');
  }

  private async authenticate(): Promise<void> {
    if (this.fhirConfig.authType === 'smart' && this.fhirConfig.tokenUrl) {
      // SMART on FHIR backend services authentication
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.fhirConfig.clientId || '',
        client_secret: this.fhirConfig.clientSecret || '',
        scope: this.fhirConfig.scope || 'system/*.read',
      });

      const response = await fetch(this.fhirConfig.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`FHIR authentication failed: ${response.status}`);
      }

      const data = await response.json() as { access_token: string; expires_in: number };
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
    }
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
    };

    if (this.accessToken) {
      // Check token expiry
      if (this.tokenExpiry && this.tokenExpiry < new Date()) {
        await this.authenticate();
      }
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  async fetchCapabilityStatement(): Promise<FHIRResource> {
    const response = await fetch(`${this.fhirConfig.fhirServerUrl}/metadata`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CapabilityStatement: ${response.status}`);
    }

    return response.json() as Promise<FHIRResource>;
  }

  async searchResources(resourceType: string, params?: Record<string, string>): Promise<FHIRResource[]> {
    if (!this.checkQuota()) {
      throw new Error('Quota exceeded');
    }

    const url = new URL(`${this.fhirConfig.fhirServerUrl}/${resourceType}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    const response = await fetch(url.toString(), {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`FHIR search failed: ${response.status}`);
    }

    const bundle = await response.json() as { entry?: Array<{ resource: FHIRResource }> };
    this.consumeQuota(1, 0);

    return (bundle.entry || []).map(e => e.resource);
  }

  async readResource(resourceType: string, id: string): Promise<FHIRResource> {
    if (!this.checkQuota()) {
      throw new Error('Quota exceeded');
    }

    const response = await fetch(`${this.fhirConfig.fhirServerUrl}/${resourceType}/${id}`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`FHIR read failed: ${response.status}`);
    }

    this.consumeQuota(1, 0);
    return response.json() as Promise<FHIRResource>;
  }

  async ingest(stream: Readable, sourceId: string, metadata?: Record<string, unknown>): Promise<IngestRecord> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks);

    const record = this.createIngestRecord(sourceId, content, {
      ...metadata,
      protocol: 'fhir',
      version: this.fhirConfig.fhirVersion,
    });

    this.metrics.bytesIngested += content.length;
    this.health.messagesProcessed++;
    this.health.bytesProcessed += content.length;

    const data = JSON.parse(content.toString());
    this.emit('data', { record, data });

    return record;
  }

  async validate(data: unknown): Promise<{ valid: boolean; errors?: string[] }> {
    const resource = data as FHIRResource;
    if (!resource.resourceType) {
      return { valid: false, errors: ['Missing resourceType'] };
    }
    return { valid: true };
  }
}

// =============================================================================
// FIX PROTOCOL ADAPTER (Financial Standard)
// =============================================================================

export interface FIXAdapterConfig extends AdapterConfig {
  fixVersion: '4.2' | '4.4' | '5.0';
  senderCompId: string;
  targetCompId: string;
  host: string;
  port: number;
  useTLS?: boolean;
  heartbeatInterval?: number;
  resetSeqNum?: boolean;
}

export interface FIXMessage {
  msgType: string;
  fields: Record<number, string>;
  raw?: string;
}

/**
 * FIX Protocol Adapter
 * Standard financial messaging protocol (NOT Bloomberg/Refinitiv proprietary)
 */
export class FIXAdapter extends SovereignAdapter {
  private fixConfig: FIXAdapterConfig;
  private messageQueue: FIXMessage[] = [];
  private inSeqNum = 1;
  private outSeqNum = 1;

  constructor(config: FIXAdapterConfig) {
    super(config);
    this.fixConfig = {
      heartbeatInterval: 30,
      resetSeqNum: true,
      useTLS: true,
      ...config,
      fixVersion: config.fixVersion || '4.4',
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    // FIX session would connect here
    // Production upgrade: use proper FIX engine
    this.log('info', 'FIX adapter started (session management ready)', {
      version: this.fixConfig.fixVersion,
      sender: this.fixConfig.senderCompId,
      target: this.fixConfig.targetCompId,
    });

    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    // Production upgrade: send logout message
    this.isRunning = false;
    this.log('info', 'FIX adapter stopped');
  }

  /**
   * Parse a raw FIX message
   */
  parseMessage(raw: string): FIXMessage {
    const fields: Record<number, string> = {};
    const parts = raw.split('\x01').filter(p => p);

    for (const part of parts) {
      const [tagStr, value] = part.split('=');
      if (tagStr && value !== undefined) {
        fields[parseInt(tagStr, 10)] = value;
      }
    }

    return {
      msgType: fields[35] || '',
      fields,
      raw,
    };
  }

  /**
   * Build a FIX message
   */
  buildMessage(msgType: string, fields: Record<number, string>): string {
    const version = this.getBeginString();
    const body: string[] = [];

    // Standard header
    body.push(`35=${msgType}`);
    body.push(`49=${this.fixConfig.senderCompId}`);
    body.push(`56=${this.fixConfig.targetCompId}`);
    body.push(`34=${this.outSeqNum++}`);
    body.push(`52=${this.getTimestamp()}`);

    // Message fields
    for (const [tag, value] of Object.entries(fields)) {
      body.push(`${tag}=${value}`);
    }

    const bodyStr = body.join('\x01') + '\x01';
    const header = `8=${version}\x019=${bodyStr.length}\x01`;
    
    // Calculate checksum
    const fullMessage = header + bodyStr;
    let sum = 0;
    for (let i = 0; i < fullMessage.length; i++) {
      sum += fullMessage.charCodeAt(i);
    }
    const checksum = String(sum % 256).padStart(3, '0');

    return `${fullMessage}10=${checksum}\x01`;
  }

  private getBeginString(): string {
    switch (this.fixConfig.fixVersion) {
      case '4.2': return 'FIX.4.2';
      case '4.4': return 'FIX.4.4';
      case '5.0': return 'FIXT.1.1';
      default: return 'FIX.4.4';
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace('T', '-').replace('Z', '').replace(/[:-]/g, '').slice(0, -4);
  }

  async ingest(stream: Readable, sourceId: string, metadata?: Record<string, unknown>): Promise<IngestRecord> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks);

    const record = this.createIngestRecord(sourceId, content, {
      ...metadata,
      protocol: 'fix',
      version: this.fixConfig.fixVersion,
    });

    this.metrics.bytesIngested += content.length;
    this.health.messagesProcessed++;
    this.health.bytesProcessed += content.length;

    // Parse FIX message
    const message = this.parseMessage(content.toString());
    this.messageQueue.push(message);
    this.emit('data', { record, data: message });

    return record;
  }

  async validate(data: unknown): Promise<{ valid: boolean; errors?: string[] }> {
    const msg = data as FIXMessage;
    if (!msg.msgType) {
      return { valid: false, errors: ['Missing MsgType (tag 35)'] };
    }
    return { valid: true };
  }

  getQueuedMessages(): FIXMessage[] {
    return [...this.messageQueue];
  }
}

// =============================================================================
// MQTT ADAPTER (IoT/Energy Standard)
// =============================================================================

export interface MQTTAdapterConfig extends AdapterConfig {
  brokerUrl: string;
  clientId?: string;
  username?: string;
  password?: string;
  useTLS?: boolean;
  topics: string[];
  qos?: 0 | 1 | 2;
  cleanSession?: boolean;
}

export interface MQTTMessage {
  topic: string;
  payload: Buffer | string;
  qos: number;
  retain: boolean;
  timestamp: Date;
}

/**
 * MQTT Adapter
 * Standard IoT/Energy messaging protocol
 */
export class MQTTAdapter extends SovereignAdapter {
  private mqttConfig: MQTTAdapterConfig;
  private messageQueue: MQTTMessage[] = [];

  constructor(config: MQTTAdapterConfig) {
    super(config);
    this.mqttConfig = {
      qos: 1,
      cleanSession: true,
      clientId: `datacendia-${crypto.randomUUID().slice(0, 8)}`,
      ...config,
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    // MQTT client would connect here
    // Production upgrade: use mqtt.js
    this.log('info', 'MQTT adapter started (subscription ready)', {
      broker: this.mqttConfig.brokerUrl,
      topics: this.mqttConfig.topics,
    });

    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    // Disconnect from broker
    this.isRunning = false;
    this.log('info', 'MQTT adapter stopped');
  }

  /**
   * Handle incoming MQTT message
   */
  handleMessage(topic: string, payload: Buffer): void {
    const message: MQTTMessage = {
      topic,
      payload,
      qos: this.mqttConfig.qos || 1,
      retain: false,
      timestamp: new Date(),
    };

    this.messageQueue.push(message);
    
    // Limit queue size
    if (this.messageQueue.length > 10000) {
      this.messageQueue.shift();
    }

    this.emit('message', message);
  }

  async ingest(stream: Readable, sourceId: string, metadata?: Record<string, unknown>): Promise<IngestRecord> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks);

    const record = this.createIngestRecord(sourceId, content, {
      ...metadata,
      protocol: 'mqtt',
      broker: this.mqttConfig.brokerUrl,
    });

    this.metrics.bytesIngested += content.length;
    this.health.messagesProcessed++;
    this.health.bytesProcessed += content.length;

    this.emit('data', { record, data: content });

    return record;
  }

  async validate(data: unknown): Promise<{ valid: boolean; errors?: string[] }> {
    return { valid: true };
  }

  getQueuedMessages(): MQTTMessage[] {
    return [...this.messageQueue];
  }
}

// =============================================================================
// REGISTER ADAPTERS
// =============================================================================

adapterRegistry.register({
  type: 'fhir',
  factory: (config) => new FHIRAdapter(config as FHIRAdapterConfig),
  description: 'HL7 FHIR R4 for healthcare interoperability (NOT Epic/Cerner proprietary)',
  defaultRiskTier: RiskTier.REGULATED,
  defaultCapabilities: {
    transportTypes: ['http', 'fhir'],
    supportsStreaming: false,
    supportsBatch: true,
    supportsWriteBack: false,
    cachingAllowed: false, // PHI - no caching
    defaultDataClass: DataClassification.REGULATED,
    requiresBYOKeys: true,
    exportControlled: false,
  },
});

adapterRegistry.register({
  type: 'fix',
  factory: (config) => new FIXAdapter(config as FIXAdapterConfig),
  description: 'FIX Protocol for financial messaging (NOT Bloomberg/Refinitiv)',
  defaultRiskTier: RiskTier.REGULATED,
  defaultCapabilities: {
    transportTypes: ['tcp', 'fix'],
    supportsStreaming: true,
    supportsBatch: false,
    supportsWriteBack: false,
    cachingAllowed: true,
    defaultDataClass: DataClassification.CONFIDENTIAL,
    requiresBYOKeys: true,
    exportControlled: false,
  },
});

adapterRegistry.register({
  type: 'mqtt',
  factory: (config) => new MQTTAdapter(config as MQTTAdapterConfig),
  description: 'MQTT for IoT and energy grid data',
  defaultRiskTier: RiskTier.ENTERPRISE,
  defaultCapabilities: {
    transportTypes: ['mqtt', 'tcp'],
    supportsStreaming: true,
    supportsBatch: false,
    supportsWriteBack: false,
    cachingAllowed: true,
    defaultDataClass: DataClassification.INTERNAL,
    requiresBYOKeys: true,
    exportControlled: false,
  },
});
