// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * SOVEREIGN ADAPTER ARCHITECTURE
 * =============================================================================
 * 5 Universal Adapters instead of 156 vendor-specific connectors.
 * 
 * Philosophy:
 * - "We provide the socket; the client brings the plug"
 * - BYO-Gateway: Client's existing middleware handles compliance
 * - Standard Protocols only: FHIR, FIX, MQTT - not proprietary APIs
 * - No Bloomberg/Epic/SWIFT direct integration (liability trap)
 * - Hardware protocols (ARINC 429) via file export, not direct bus access
 * 
 * Risk Tiers:
 * - Tier 0: Public data (NOAA, Census) - low risk
 * - Tier 1: Enterprise SaaS via client gateway - moderate risk
 * - Tier 2: Financial/Healthcare regulated - high risk, BYO-keys required
 * - Tier 3: Defense/Export-controlled - disabled by default
 */

import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import crypto from 'crypto';

// =============================================================================
// TYPES & ENUMS
// =============================================================================

export enum RiskTier {
  PUBLIC = 0,      // Public APIs, open data
  ENTERPRISE = 1,  // Enterprise SaaS, client-managed
  REGULATED = 2,   // Financial/Healthcare, BYO-keys required
  RESTRICTED = 3,  // Defense/Export-controlled, disabled by default
}

export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  REGULATED = 'regulated',        // HIPAA, PCI, SOX
  EXPORT_CONTROLLED = 'export_controlled', // ITAR, EAR
}

export interface AdapterCapabilities {
  transportTypes: string[];
  supportsStreaming: boolean;
  supportsBatch: boolean;
  supportsWriteBack: boolean;  // Most should be FALSE
  cachingAllowed: boolean;
  defaultDataClass: DataClassification;
  requiresBYOKeys: boolean;
  exportControlled: boolean;
}

export interface AdapterConfig {
  id: string;
  name: string;
  description: string;
  riskTier: RiskTier;
  capabilities: AdapterCapabilities;
  
  // Egress controls
  allowedHosts?: string[];      // Whitelist for outbound
  maxRequestsPerMinute?: number;
  maxBudgetPerDay?: number;     // Cost cap in cents
  
  // Retention controls
  retentionTTLSeconds?: number;
  noCache?: boolean;
  noPersist?: boolean;
  
  // Evidence hooks
  enableEvidenceLogging?: boolean;
  signIngests?: boolean;
}

export interface IngestRecord {
  id: string;
  adapterId: string;
  timestamp: Date;
  sourceId: string;
  dataClassification: DataClassification;
  contentHash: string;
  size: number;
  metadata: Record<string, unknown>;
  evidenceSignature?: string;
}

export interface AdapterHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'disabled';
  lastCheck: Date;
  uptime: number;
  errorRate: number;
  latencyP50: number;
  latencyP99: number;
  messagesProcessed: number;
  bytesProcessed: number;
}

export interface AdapterMetrics {
  requestCount: number;
  errorCount: number;
  bytesIngested: number;
  costAccumulated: number;
  lastActivity: Date;
  quotaRemaining: {
    requests: number;
    budget: number;
  };
}

// =============================================================================
// ABSTRACT SOVEREIGN ADAPTER
// =============================================================================

export abstract class SovereignAdapter extends EventEmitter {
  protected config: AdapterConfig;
  protected health: AdapterHealth;
  protected metrics: AdapterMetrics;
  protected isRunning = false;

  constructor(config: AdapterConfig) {
    super();
    this.config = config;
    this.health = {
      status: 'healthy',
      lastCheck: new Date(),
      uptime: 0,
      errorRate: 0,
      latencyP50: 0,
      latencyP99: 0,
      messagesProcessed: 0,
      bytesProcessed: 0,
    };
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      bytesIngested: 0,
      costAccumulated: 0,
      lastActivity: new Date(),
      quotaRemaining: {
        requests: config.maxRequestsPerMinute || Infinity,
        budget: config.maxBudgetPerDay || Infinity,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // CORE INTERFACE
  // ---------------------------------------------------------------------------

  /**
   * Initialize the adapter (connect, authenticate, etc.)
   */
  abstract start(): Promise<void>;

  /**
   * Graceful shutdown
   */
  abstract stop(): Promise<void>;

  /**
   * Ingest data from a stream (universal entry point)
   */
  abstract ingest(stream: Readable, sourceId: string, metadata?: Record<string, unknown>): Promise<IngestRecord>;

  /**
   * Validate incoming data against schema/policy
   */
  abstract validate(data: unknown): Promise<{ valid: boolean; errors?: string[] }>;

  /**
   * Health check
   */
  async healthCheck(): Promise<AdapterHealth> {
    this.health.lastCheck = new Date();
    return this.health;
  }

  /**
   * Get current metrics
   */
  getMetrics(): AdapterMetrics {
    return { ...this.metrics };
  }

  /**
   * Get capabilities
   */
  getCapabilities(): AdapterCapabilities {
    return { ...this.config.capabilities };
  }

  /**
   * Get risk tier
   */
  getRiskTier(): RiskTier {
    return this.config.riskTier;
  }

  // ---------------------------------------------------------------------------
  // EVIDENCE & AUDIT
  // ---------------------------------------------------------------------------

  /**
   * Create evidence record for an ingest operation
   */
  protected createIngestRecord(
    sourceId: string,
    content: Buffer,
    metadata: Record<string, unknown> = {}
  ): IngestRecord {
    const record: IngestRecord = {
      id: crypto.randomUUID(),
      adapterId: this.config.id,
      timestamp: new Date(),
      sourceId,
      dataClassification: this.config.capabilities.defaultDataClass,
      contentHash: crypto.createHash('sha256').update(content).digest('hex'),
      size: content.length,
      metadata,
    };

    if (this.config.signIngests) {
      record.evidenceSignature = this.signRecord(record);
    }

    return record;
  }

  /**
   * Sign an ingest record for tamper evidence
   */
  protected signRecord(record: IngestRecord): string {
    const payload = JSON.stringify({
      id: record.id,
      adapterId: record.adapterId,
      timestamp: record.timestamp.toISOString(),
      contentHash: record.contentHash,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  // ---------------------------------------------------------------------------
  // QUOTA & BUDGET CONTROLS
  // ---------------------------------------------------------------------------

  /**
   * Check if request is within quota
   */
  protected checkQuota(): boolean {
    if (this.metrics.quotaRemaining.requests <= 0) {
      this.emit('quota:exceeded', { type: 'requests' });
      return false;
    }
    if (this.metrics.quotaRemaining.budget <= 0) {
      this.emit('quota:exceeded', { type: 'budget' });
      return false;
    }
    return true;
  }

  /**
   * Consume quota
   */
  protected consumeQuota(requests = 1, cost = 0): void {
    this.metrics.requestCount += requests;
    this.metrics.costAccumulated += cost;
    this.metrics.quotaRemaining.requests -= requests;
    this.metrics.quotaRemaining.budget -= cost;
    this.metrics.lastActivity = new Date();
  }

  /**
   * Reset daily quotas (call from scheduler)
   */
  resetDailyQuota(): void {
    this.metrics.quotaRemaining = {
      requests: this.config.maxRequestsPerMinute || Infinity,
      budget: this.config.maxBudgetPerDay || Infinity,
    };
  }

  // ---------------------------------------------------------------------------
  // EGRESS CONTROLS
  // ---------------------------------------------------------------------------

  /**
   * Check if a host is allowed for outbound requests
   */
  protected isHostAllowed(host: string): boolean {
    if (!this.config.allowedHosts || this.config.allowedHosts.length === 0) {
      return true; // No whitelist = allow all (for public adapters)
    }
    return this.config.allowedHosts.some(allowed => {
      if (allowed.startsWith('*.')) {
        return host.endsWith(allowed.slice(1));
      }
      return host === allowed;
    });
  }

  // ---------------------------------------------------------------------------
  // LOGGING
  // ---------------------------------------------------------------------------

  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void {
    this.emit('log', {
      level,
      adapterId: this.config.id,
      message,
      timestamp: new Date(),
      ...meta,
    });
  }
}

// =============================================================================
// ADAPTER REGISTRY
// =============================================================================

export interface AdapterRegistration {
  type: string;
  factory: (config: AdapterConfig) => SovereignAdapter;
  description: string;
  defaultRiskTier: RiskTier;
  defaultCapabilities: AdapterCapabilities;
}

class AdapterRegistry {
  private adapters = new Map<string, AdapterRegistration>();
  private instances = new Map<string, SovereignAdapter>();

  /**
   * Register an adapter type
   */
  register(registration: AdapterRegistration): void {
    this.adapters.set(registration.type, registration);
  }

  /**
   * Create an adapter instance
   */
  create(type: string, config: Partial<AdapterConfig>): SovereignAdapter {
    const registration = this.adapters.get(type);
    if (!registration) {
      throw new Error(`Unknown adapter type: ${type}`);
    }

    // Merge defaults with provided config
    const fullConfig: AdapterConfig = {
      id: config.id || `${type}-${crypto.randomUUID().slice(0, 8)}`,
      name: config.name || registration.description,
      description: config.description || registration.description,
      riskTier: config.riskTier ?? registration.defaultRiskTier,
      capabilities: { ...registration.defaultCapabilities, ...config.capabilities },
      ...config,
    };

    // Risk tier validation
    if (fullConfig.riskTier === RiskTier.RESTRICTED && !config.capabilities?.exportControlled) {
      throw new Error('Restricted adapters require explicit export control acknowledgment');
    }

    const adapter = registration.factory(fullConfig);
    this.instances.set(fullConfig.id, adapter);

    return adapter;
  }

  /**
   * Get an existing instance
   */
  getInstance(id: string): SovereignAdapter | undefined {
    return this.instances.get(id);
  }

  /**
   * List all registered adapter types
   */
  listTypes(): { type: string; description: string; riskTier: RiskTier }[] {
    return Array.from(this.adapters.entries()).map(([type, reg]) => ({
      type,
      description: reg.description,
      riskTier: reg.defaultRiskTier,
    }));
  }

  /**
   * List all instances
   */
  listInstances(): { id: string; type: string; status: string }[] {
    return Array.from(this.instances.entries()).map(([id, adapter]) => ({
      id,
      type: adapter.constructor.name,
      status: adapter['health']?.status || 'unknown',
    }));
  }

  /**
   * Destroy an instance
   */
  async destroy(id: string): Promise<void> {
    const adapter = this.instances.get(id);
    if (adapter) {
      await adapter.stop();
      this.instances.delete(id);
    }
  }

  /**
   * Destroy all instances
   */
  async destroyAll(): Promise<void> {
    for (const [id] of this.instances) {
      await this.destroy(id);
    }
  }
}

// Singleton registry
export const adapterRegistry = new AdapterRegistry();
