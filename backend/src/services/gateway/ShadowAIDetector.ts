/**
 * CendiaGateway™ — Shadow AI Detection Engine
 *
 * Discovers and tracks unauthorized AI tool usage across the organization.
 * Monitors for unknown providers, unapproved models, unusual usage patterns,
 * and data exfiltration indicators.
 *
 * Shadow AI = any AI tool usage that bypasses approved governance channels.
 *
 * @module services/gateway/ShadowAIDetector
 */

import { EventEmitter } from 'events';

// =============================================================================
// TYPES
// =============================================================================

export interface ShadowAIEvent {
  id: string;
  type: ShadowAIEventType;
  severity: 'info' | 'warning' | 'critical';
  userId: string;
  userEmail: string;
  userDepartment: string;
  organizationId: string;
  details: string;
  metadata: Record<string, any>;
  detectedAt: Date;
  acknowledged: boolean;
}

export type ShadowAIEventType =
  | 'unknown_provider'        // Request to unregistered AI provider
  | 'unapproved_model'        // Known provider, but model not in approved list
  | 'unusual_volume'          // User sending abnormally many requests
  | 'off_hours_usage'         // AI usage outside business hours
  | 'new_user_burst'          // New user with sudden high volume
  | 'data_exfiltration'       // Unusually large prompts (potential data dump)
  | 'api_key_sharing'         // Multiple users with same API key pattern
  | 'bypass_attempt'          // Direct-to-provider request detected (browser ext)
  | 'model_hopping'           // Rapidly switching between many models (probing)
  | 'department_anomaly';     // Department usage significantly deviates from norm

export interface ShadowAIConfig {
  enabled: boolean;
  approvedProviders: string[];
  approvedModels: string[];
  maxRequestsPerUserPerHour: number;
  maxPromptLengthChars: number;
  businessHoursStart: number;   // 0-23 UTC
  businessHoursEnd: number;     // 0-23 UTC
  businessDays: number[];       // 0=Sun, 1=Mon, ..., 6=Sat
  alertOnNewProvider: boolean;
  alertOnOffHours: boolean;
  alertOnLargePrompts: boolean;
}

export interface ShadowAIReport {
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  organizationId: string;
  totalEvents: number;
  criticalEvents: number;
  warningEvents: number;
  byType: Record<string, number>;
  byUser: Record<string, number>;
  byDepartment: Record<string, number>;
  topOffenders: Array<{ userEmail: string; eventCount: number; types: string[] }>;
  unknownProviders: string[];
  unapprovedModels: string[];
  recommendations: string[];
}

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

const DEFAULT_CONFIG: ShadowAIConfig = {
  enabled: true,
  approvedProviders: ['openai', 'anthropic', 'google', 'ollama', 'azure-openai', 'bedrock', 'mistral', 'cohere', 'groq'],
  approvedModels: [], // Empty = all models from approved providers are OK
  maxRequestsPerUserPerHour: 100,
  maxPromptLengthChars: 50_000,
  businessHoursStart: 8,
  businessHoursEnd: 20,
  businessDays: [1, 2, 3, 4, 5], // Mon-Fri
  alertOnNewProvider: true,
  alertOnOffHours: false, // Default off — many legitimate off-hours uses
  alertOnLargePrompts: true,
};

// =============================================================================
// DETECTOR
// =============================================================================

class ShadowAIDetector extends EventEmitter {
  private config: ShadowAIConfig;
  private events: ShadowAIEvent[] = [];
  private userRequestCounts: Map<string, { count: number; windowStart: number }> = new Map();
  private userModelHistory: Map<string, Set<string>> = new Map();
  private knownProviders: Set<string> = new Set();
  private maxEvents = 50_000;

  constructor(config?: Partial<ShadowAIConfig>) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.config.approvedProviders.forEach(p => this.knownProviders.add(p));
  }

  /**
   * Analyze a gateway interaction for shadow AI indicators.
   * Called after every processRequest in CendiaGatewayService.
   */
  analyze(params: {
    provider: string;
    model: string;
    userId: string;
    userEmail: string;
    userDepartment: string;
    organizationId: string;
    promptLength: number;
    headers: Record<string, string>;
  }): ShadowAIEvent[] {
    if (!this.config.enabled) return [];

    const detected: ShadowAIEvent[] = [];
    const now = new Date();

    // 1. Unknown provider detection
    if (!this.knownProviders.has(params.provider)) {
      detected.push(this.createEvent({
        type: 'unknown_provider',
        severity: 'critical',
        details: `Request to unregistered AI provider: "${params.provider}"`,
        metadata: { provider: params.provider, model: params.model },
        ...params, now,
      }));
    }

    // 2. Unapproved model detection
    if (this.config.approvedModels.length > 0 && !this.config.approvedModels.includes(params.model)) {
      detected.push(this.createEvent({
        type: 'unapproved_model',
        severity: 'warning',
        details: `Request to unapproved model: "${params.model}" on provider "${params.provider}"`,
        metadata: { provider: params.provider, model: params.model },
        ...params, now,
      }));
    }

    // 3. Unusual volume detection (sliding window)
    const userKey = `${params.organizationId}:${params.userId}`;
    const hourMs = 60 * 60 * 1000;
    const userCount = this.userRequestCounts.get(userKey);
    if (userCount && (now.getTime() - userCount.windowStart) < hourMs) {
      userCount.count++;
      if (userCount.count > this.config.maxRequestsPerUserPerHour) {
        detected.push(this.createEvent({
          type: 'unusual_volume',
          severity: 'warning',
          details: `User exceeded ${this.config.maxRequestsPerUserPerHour} requests/hour (current: ${userCount.count})`,
          metadata: { count: userCount.count, limit: this.config.maxRequestsPerUserPerHour },
          ...params, now,
        }));
      }
    } else {
      this.userRequestCounts.set(userKey, { count: 1, windowStart: now.getTime() });
    }

    // 4. Off-hours usage detection
    if (this.config.alertOnOffHours) {
      const hour = now.getUTCHours();
      const day = now.getUTCDay();
      const isBusinessHours = this.config.businessDays.includes(day) &&
        hour >= this.config.businessHoursStart &&
        hour < this.config.businessHoursEnd;

      if (!isBusinessHours) {
        detected.push(this.createEvent({
          type: 'off_hours_usage',
          severity: 'info',
          details: `AI usage outside business hours (${hour}:00 UTC, day ${day})`,
          metadata: { hour, day, timezone: 'UTC' },
          ...params, now,
        }));
      }
    }

    // 5. Data exfiltration indicator (unusually large prompts)
    if (this.config.alertOnLargePrompts && params.promptLength > this.config.maxPromptLengthChars) {
      detected.push(this.createEvent({
        type: 'data_exfiltration',
        severity: 'critical',
        details: `Unusually large prompt detected (${params.promptLength.toLocaleString()} chars, limit: ${this.config.maxPromptLengthChars.toLocaleString()})`,
        metadata: { promptLength: params.promptLength, limit: this.config.maxPromptLengthChars },
        ...params, now,
      }));
    }

    // 6. Model hopping detection (rapid switching)
    const modelKey = `${params.organizationId}:${params.userId}:models`;
    if (!this.userModelHistory.has(modelKey)) {
      this.userModelHistory.set(modelKey, new Set());
    }
    const models = this.userModelHistory.get(modelKey)!;
    models.add(params.model);
    if (models.size > 8) {
      detected.push(this.createEvent({
        type: 'model_hopping',
        severity: 'warning',
        details: `User has accessed ${models.size} different models — possible API probing`,
        metadata: { models: Array.from(models), count: models.size },
        ...params, now,
      }));
    }

    // Store and emit events
    for (const event of detected) {
      this.events.push(event);
      this.emit('shadow_ai:detected', event);
      if (event.severity === 'critical') {
        this.emit('shadow_ai:critical', event);
      }
    }

    // Prune old events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    return detected;
  }

  // =========================================================================
  // REPORTING
  // =========================================================================

  getEvents(params?: {
    organizationId?: string;
    type?: ShadowAIEventType;
    severity?: string;
    userId?: string;
    limit?: number;
  }): ShadowAIEvent[] {
    let results = [...this.events];

    if (params?.organizationId) results = results.filter(e => e.organizationId === params.organizationId);
    if (params?.type) results = results.filter(e => e.type === params.type);
    if (params?.severity) results = results.filter(e => e.severity === params.severity);
    if (params?.userId) results = results.filter(e => e.userId === params.userId);

    results.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());

    if (params?.limit) results = results.slice(0, params.limit);
    return results;
  }

  generateReport(organizationId: string, periodDays: number = 30): ShadowAIReport {
    const now = new Date();
    const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const periodEvents = this.events.filter(e =>
      e.organizationId === organizationId && e.detectedAt >= periodStart
    );

    const byType: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const unknownProviders = new Set<string>();
    const unapprovedModels = new Set<string>();

    for (const e of periodEvents) {
      byType[e.type] = (byType[e.type] || 0) + 1;
      byUser[e.userEmail] = (byUser[e.userEmail] || 0) + 1;
      byDepartment[e.userDepartment] = (byDepartment[e.userDepartment] || 0) + 1;
      if (e.type === 'unknown_provider') unknownProviders.add(e.metadata.provider);
      if (e.type === 'unapproved_model') unapprovedModels.add(e.metadata.model);
    }

    const topOffenders = Object.entries(byUser)
      .map(([email, count]) => ({
        userEmail: email,
        eventCount: count,
        types: [...new Set(periodEvents.filter(e => e.userEmail === email).map(e => e.type))],
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    const recommendations: string[] = [];
    if (unknownProviders.size > 0) {
      recommendations.push(`Block or onboard ${unknownProviders.size} unknown AI provider(s): ${Array.from(unknownProviders).join(', ')}`);
    }
    if (byType['data_exfiltration']) {
      recommendations.push(`Investigate ${byType['data_exfiltration']} potential data exfiltration events — large prompts may contain sensitive documents`);
    }
    if (byType['unusual_volume']) {
      recommendations.push(`Review rate limits for users with excessive AI usage — consider per-department quotas`);
    }
    if (byType['model_hopping']) {
      recommendations.push(`Users accessing many different models may be probing API capabilities — review for authorized use`);
    }

    return {
      generatedAt: now,
      periodStart,
      periodEnd: now,
      organizationId,
      totalEvents: periodEvents.length,
      criticalEvents: periodEvents.filter(e => e.severity === 'critical').length,
      warningEvents: periodEvents.filter(e => e.severity === 'warning').length,
      byType,
      byUser,
      byDepartment,
      topOffenders,
      unknownProviders: Array.from(unknownProviders),
      unapprovedModels: Array.from(unapprovedModels),
      recommendations,
    };
  }

  acknowledgeEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;
    event.acknowledged = true;
    return true;
  }

  getConfig(): ShadowAIConfig { return { ...this.config }; }

  updateConfig(updates: Partial<ShadowAIConfig>): void {
    this.config = { ...this.config, ...updates };
    if (updates.approvedProviders) {
      this.knownProviders = new Set(this.config.approvedProviders);
    }
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private createEvent(params: {
    type: ShadowAIEventType;
    severity: 'info' | 'warning' | 'critical';
    details: string;
    metadata: Record<string, any>;
    userId: string;
    userEmail: string;
    userDepartment: string;
    organizationId: string;
    now: Date;
  }): ShadowAIEvent {
    return {
      id: `shadow-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: params.type,
      severity: params.severity,
      userId: params.userId,
      userEmail: params.userEmail,
      userDepartment: params.userDepartment,
      organizationId: params.organizationId,
      details: params.details,
      metadata: params.metadata,
      detectedAt: params.now,
      acknowledged: false,
    };
  }
}

export default ShadowAIDetector;
