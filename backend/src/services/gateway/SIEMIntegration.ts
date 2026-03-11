import { logger } from '../../utils/logger.js';
/**
 * CendiaGateway™ — SIEM Integration Layer
 *
 * Forwards structured security events to enterprise SIEM platforms:
 *   - Splunk (HEC — HTTP Event Collector)
 *   - Microsoft Sentinel (Log Analytics Data Collector API)
 *   - Datadog (Log Management API)
 *   - Elastic/ELK (Elasticsearch bulk API)
 *   - Generic Syslog (CEF format over HTTP)
 *
 * Events are formatted per platform's expected schema and shipped
 * asynchronously via batch buffering to minimize latency impact.
 *
 * Zero external dependencies — uses native fetch().
 *
 * @module services/gateway/SIEMIntegration
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SIEMConfig {
  id: string;
  name: string;
  enabled: boolean;
  platform: 'splunk' | 'sentinel' | 'datadog' | 'elastic' | 'syslog_cef';

  // Connection
  endpoint: string;             // Platform-specific endpoint URL
  authToken: string;            // API key / HEC token / workspace key
  authSecret?: string;          // Secondary auth (Sentinel shared key, etc.)

  // Batching
  batchSize: number;            // Max events per batch
  flushIntervalMs: number;      // Max delay before flush

  // Filtering
  eventTypes: SIEMEventType[];  // Which events to forward
  minSeverity: 'info' | 'warning' | 'critical';
  includePIIDetails: boolean;   // Whether to include PII type info
  includePromptHash: boolean;   // Include SHA-256 of prompt (not raw text)

  // Metadata
  sourceType?: string;          // Splunk sourcetype
  index?: string;               // Splunk index / Sentinel custom log name
  tags?: string[];              // Additional tags
}

export type SIEMEventType =
  | 'gateway_request'           // Every request (high volume)
  | 'pii_detection'             // PII detected
  | 'pii_block'                 // PII blocked
  | 'policy_violation'          // Policy enforcement triggered
  | 'shadow_ai'                 // Shadow AI detection
  | 'rate_limit'                // Rate limit exceeded
  | 'provider_error'            // Upstream provider error
  | 'authentication_failure'    // Invalid API key or JWT
  | 'manifest_generated'        // AI Manifest created
  | 'config_change';            // Policy/config modified

export interface SIEMEvent {
  timestamp: string;            // ISO 8601
  eventType: SIEMEventType;
  severity: 'info' | 'warning' | 'critical';
  source: 'CendiaGateway';
  version: '1.0.0';

  // Identity
  organizationId: string;
  userId: string;
  userEmail: string;
  userDepartment: string;

  // Request
  provider?: string;
  model?: string;
  endpoint?: string;
  interactionId?: string;

  // Governance
  piiDetected?: boolean;
  piiTypes?: string[];
  policyAction?: string;
  policyId?: string;
  policyReason?: string;

  // Performance
  latencyMs?: number;
  statusCode?: number;
  tokensUsed?: number;
  estimatedCostUsd?: number;

  // Integrity
  integrityHash?: string;
  promptHash?: string;          // SHA-256 of prompt (never raw text)

  // Metadata
  metadata?: Record<string, any>;
}

// =============================================================================
// SIEM INTEGRATION
// =============================================================================

class SIEMIntegration {
  private configs: SIEMConfig[] = [];
  private buffers: Map<string, SIEMEvent[]> = new Map();
  private flushTimers: Map<string, NodeJS.Timeout> = new Map();
  private stats = {
    totalEventsSent: 0,
    totalBatchesSent: 0,
    totalErrors: 0,
    lastError: null as string | null,
    lastSentAt: null as Date | null,
  };

  constructor(configs?: SIEMConfig[]) {
    if (configs) {
      for (const config of configs) {
        this.addConfig(config);
      }
    }
  }

  /**
   * Ingest a security event. Buffers it and flushes when batch is full
   * or flush interval expires.
   */
  ingest(event: SIEMEvent): void {
    for (const config of this.configs) {
      if (!config.enabled) continue;
      if (!config.eventTypes.includes(event.eventType)) continue;
      if (!this.meetsSeverityThreshold(event.severity, config.minSeverity)) continue;

      // Sanitize event per config
      const sanitized = this.sanitizeEvent(event, config);

      // Add to buffer
      if (!this.buffers.has(config.id)) {
        this.buffers.set(config.id, []);
      }
      const buffer = this.buffers.get(config.id)!;
      buffer.push(sanitized);

      // Flush if buffer is full
      if (buffer.length >= config.batchSize) {
        this.flush(config.id).catch(() => {});
      }

      // Ensure flush timer is running
      if (!this.flushTimers.has(config.id)) {
        const timer = setInterval(() => {
          this.flush(config.id).catch(() => {});
        }, config.flushIntervalMs);
        this.flushTimers.set(config.id, timer);
      }
    }
  }

  /**
   * Flush buffered events for a specific SIEM config.
   */
  async flush(configId: string): Promise<void> {
    const config = this.configs.find(c => c.id === configId);
    if (!config) return;

    const buffer = this.buffers.get(configId);
    if (!buffer || buffer.length === 0) return;

    const batch = buffer.splice(0, config.batchSize);

    try {
      await this.sendBatch(config, batch);
      this.stats.totalEventsSent += batch.length;
      this.stats.totalBatchesSent++;
      this.stats.lastSentAt = new Date();
    } catch (err: unknown) {
      this.stats.totalErrors++;
      this.stats.lastError = (err as Error).message;
      // Re-queue on failure (bounded)
      if (buffer.length < 10_000) {
        buffer.unshift(...batch);
      }
      logger.error(`[CendiaGateway] SIEM "${config.name}" flush failed (${batch.length} events):`, (err as Error).message);
    }
  }

  // =========================================================================
  // PLATFORM-SPECIFIC SENDERS
  // =========================================================================

  private async sendBatch(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    switch (config.platform) {
      case 'splunk':
        return this.sendSplunk(config, events);
      case 'sentinel':
        return this.sendSentinel(config, events);
      case 'datadog':
        return this.sendDatadog(config, events);
      case 'elastic':
        return this.sendElastic(config, events);
      case 'syslog_cef':
        return this.sendCEF(config, events);
    }
  }

  private async sendSplunk(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    // Splunk HEC expects newline-delimited JSON events
    const body = events.map(e => JSON.stringify({
      time: new Date(e.timestamp).getTime() / 1000,
      host: 'cendia-gateway',
      source: 'cendia_gateway',
      sourcetype: config.sourceType || 'cendia:gateway:event',
      index: config.index || 'main',
      event: e,
    })).join('\n');

    const resp = await fetch(`${config.endpoint}/services/collector/event`, {
      method: 'POST',
      headers: {
        'Authorization': `Splunk ${config.authToken}`,
        'Content-Type': 'application/json',
      },
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) throw new Error(`Splunk HEC: ${resp.status} ${await resp.text().catch(() => '')}`);
  }

  private async sendSentinel(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    // Microsoft Sentinel Log Analytics Data Collector API
    const logType = config.index || 'CendiaGateway';
    const body = JSON.stringify(events);
    const contentLength = Buffer.byteLength(body, 'utf8');
    const dateStr = new Date().toUTCString();

    // Build authorization signature
    const crypto = await import('crypto');
    const stringToHash = `POST\n${contentLength}\napplication/json\nx-ms-date:${dateStr}\n/api/logs`;
    const decodedKey = Buffer.from(config.authSecret || '', 'base64');
    const hmac = crypto.createHmac('sha256', decodedKey).update(stringToHash, 'utf8').digest('base64');
    const authorization = `SharedKey ${config.authToken}:${hmac}`;

    const resp = await fetch(`${config.endpoint}/api/logs?api-version=2016-04-01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Log-Type': logType,
        'x-ms-date': dateStr,
        'Authorization': authorization,
      },
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) throw new Error(`Sentinel: ${resp.status} ${await resp.text().catch(() => '')}`);
  }

  private async sendDatadog(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    const logs = events.map(e => ({
      ddsource: 'cendia-gateway',
      ddtags: (config.tags || []).join(','),
      hostname: 'cendia-gateway',
      service: 'cendia-gateway',
      status: e.severity,
      message: JSON.stringify(e),
    }));

    const resp = await fetch(`${config.endpoint}/api/v2/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': config.authToken,
      },
      body: JSON.stringify(logs),
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) throw new Error(`Datadog: ${resp.status} ${await resp.text().catch(() => '')}`);
  }

  private async sendElastic(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    // Elasticsearch bulk API format
    const index = config.index || 'cendia-gateway';
    const lines: string[] = [];
    for (const e of events) {
      lines.push(JSON.stringify({ index: { _index: index } }));
      lines.push(JSON.stringify({ ...e, '@timestamp': e.timestamp }));
    }
    const body = lines.join('\n') + '\n';

    const resp = await fetch(`${config.endpoint}/_bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Authorization': `ApiKey ${config.authToken}`,
      },
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) throw new Error(`Elastic: ${resp.status} ${await resp.text().catch(() => '')}`);
  }

  private async sendCEF(config: SIEMConfig, events: SIEMEvent[]): Promise<void> {
    // Common Event Format (CEF) for generic SIEM ingestion
    const cefEvents = events.map(e => {
      const severity = { info: 3, warning: 6, critical: 9 }[e.severity] || 5;
      const ext = [
        `src=${e.userEmail}`,
        `suser=${e.userId}`,
        `cs1=${e.provider || 'unknown'}`,
        `cs1Label=AIProvider`,
        `cs2=${e.model || 'unknown'}`,
        `cs2Label=AIModel`,
        `cs3=${e.policyAction || 'allow'}`,
        `cs3Label=PolicyAction`,
        `cn1=${e.latencyMs || 0}`,
        `cn1Label=LatencyMs`,
        `cn2=${e.tokensUsed || 0}`,
        `cn2Label=TokensUsed`,
        e.integrityHash ? `fileHash=${e.integrityHash}` : '',
      ].filter(Boolean).join(' ');

      return `CEF:0|Datacendia|CendiaGateway|1.0|${e.eventType}|${e.eventType}|${severity}|${ext}`;
    });

    const resp = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        ...(config.authToken ? { 'Authorization': `Bearer ${config.authToken}` } : {}),
      },
      body: cefEvents.join('\n'),
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) throw new Error(`CEF: ${resp.status} ${await resp.text().catch(() => '')}`);
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  private sanitizeEvent(event: SIEMEvent, config: SIEMConfig): SIEMEvent {
    const sanitized = { ...event };
    if (!config.includePIIDetails) {
      delete sanitized.piiTypes;
    }
    if (!config.includePromptHash) {
      delete sanitized.promptHash;
    }
    return sanitized;
  }

  private meetsSeverityThreshold(eventSeverity: string, minSeverity: string): boolean {
    const levels = { info: 0, warning: 1, critical: 2 };
    return (levels[eventSeverity as keyof typeof levels] ?? 0) >= (levels[minSeverity as keyof typeof levels] ?? 0);
  }

  // =========================================================================
  // CONFIG & STATS
  // =========================================================================

  getConfigs(): SIEMConfig[] { return this.configs; }

  addConfig(config: SIEMConfig): void {
    this.configs.push(config);
    this.buffers.set(config.id, []);
  }

  updateConfig(id: string, updates: Partial<SIEMConfig>): SIEMConfig | null {
    const idx = this.configs.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.configs[idx] = { ...this.configs[idx]!, ...updates };
    return this.configs[idx]!;
  }

  removeConfig(id: string): boolean {
    const idx = this.configs.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.configs.splice(idx, 1);
    const timer = this.flushTimers.get(id);
    if (timer) clearInterval(timer);
    this.flushTimers.delete(id);
    this.buffers.delete(id);
    return true;
  }

  getStats() {
    return {
      ...this.stats,
      bufferSizes: Object.fromEntries(
        Array.from(this.buffers.entries()).map(([k, v]) => [k, v.length])
      ),
      activeConfigs: this.configs.filter(c => c.enabled).length,
    };
  }

  /**
   * Flush all buffers and stop timers. Call on shutdown.
   */
  async shutdown(): Promise<void> {
    for (const [id, timer] of this.flushTimers.entries()) {
      clearInterval(timer);
      await this.flush(id).catch(() => {});
    }
    this.flushTimers.clear();
  }
}

export default SIEMIntegration;
