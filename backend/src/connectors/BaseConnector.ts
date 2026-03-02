// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * BASE CONNECTOR - Abstract Foundation for All Data Connectors
 * =============================================================================
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'rate_limited';
export type DataFormat = 'json' | 'xml' | 'csv' | 'binary' | 'protobuf' | 'avro' | 'parquet';
export type AuthType = 'none' | 'api_key' | 'oauth2' | 'basic' | 'certificate' | 'saml' | 'jwt';

export interface ConnectorConfig {
  id: string;
  name: string;
  description: string;
  vertical: string;
  category: string;
  baseUrl: string;
  authType: AuthType;
  credentials?: Record<string, string>;
  rateLimit?: { requests: number; windowMs: number };
  timeout?: number;
  retryAttempts?: number;
  dataFormat?: DataFormat;
  enabled?: boolean;
}

/**
 * Compatibility truth labels - prevents misrepresentation in sales cycles
 * - native_protocol: Direct protocol support (FHIR, FIX, MQTT, HL7)
 * - client_gateway: Requires client's gateway/proxy (SWIFT, vendor platforms)
 * - file_ingestion: File export ingestion via Sovereign Adapters (avionics, defense buses)
 * - license_required: BYO keys / client licensing required (Bloomberg, Refinitiv, OPTA)
 * - public_api: Publicly available API, no special licensing
 */
export type CompatibilityLabel = 
  | 'native_protocol'
  | 'client_gateway'
  | 'file_ingestion'
  | 'license_required'
  | 'public_api';

export interface ConnectorMetadata {
  id: string;
  name: string;
  description: string;
  vertical: string;
  category: string;
  provider: string;
  region: string;
  dataTypes: string[];
  updateFrequency: string;
  documentationUrl?: string;
  apiVersion?: string;
  requiredCredentials: string[];
  optionalCredentials?: string[];
  complianceFrameworks?: string[];
  /** Compatibility truth label - required for procurement transparency */
  compatibilityLabel?: CompatibilityLabel;
  /** Additional notes about integration requirements */
  integrationNotes?: string;
}

export interface DataIngestionResult {
  connectorId: string;
  timestamp: Date;
  recordsIngested: number;
  bytesProcessed: number;
  durationMs: number;
  errors: string[];
  warnings: string[];
  checksum: string;
}

export abstract class BaseConnector extends EventEmitter {
  protected config: ConnectorConfig;
  protected status: ConnectorStatus = 'disconnected';
  protected lastError?: Error;
  protected requestCount = 0;
  protected windowStart = Date.now();

  constructor(config: ConnectorConfig) {
    super();
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      dataFormat: 'json',
      enabled: true,
      ...config,
    };
  }

  abstract getMetadata(): ConnectorMetadata;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract testConnection(): Promise<boolean>;
  abstract fetchData(params?: Record<string, any>): Promise<any>;

  getId(): string {
    return this.config.id;
  }

  getName(): string {
    return this.config.name;
  }

  getStatus(): ConnectorStatus {
    return this.status;
  }

  isEnabled(): boolean {
    return this.config.enabled ?? true;
  }

  protected async checkRateLimit(): Promise<boolean> {
    if (!this.config.rateLimit) return true;

    const now = Date.now();
    if (now - this.windowStart > this.config.rateLimit.windowMs) {
      this.windowStart = now;
      this.requestCount = 0;
    }

    if (this.requestCount >= this.config.rateLimit.requests) {
      this.status = 'rate_limited';
      return false;
    }

    this.requestCount++;
    return true;
  }

  protected generateChecksum(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  protected log(level: 'info' | 'warn' | 'error', message: string, meta?: any): void {
    const logMessage = `[${this.config.name}] ${message}`;
    if (level === 'error') {
      logger.error(logMessage, meta);
    } else if (level === 'warn') {
      logger.warn(logMessage, meta);
    } else {
      logger.info(logMessage, meta);
    }
  }
}
