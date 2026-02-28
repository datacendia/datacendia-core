// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA APACHE FLINK CEP SERVICE
// Real-time Complex Event Processing for compliance drift detection,
// cross-stream pattern correlation, anomaly detection, and IISS scoring.
//
// Configuration:
//   FLINK_ENABLED     — 'true' to activate (default: false)
//   FLINK_URL         — Flink JobManager REST API (default: http://localhost:8081)
//   FLINK_MODE        — 'cluster' | 'embedded' (default: embedded)
// =============================================================================

import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface CEPEvent {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  payload: Record<string, unknown>;
  organizationId?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface CEPRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  eventTypes: string[];
  windowSec: number;
  threshold: number;
  condition: CEPCondition;
  action: CEPAction;
  complianceFrameworks: string[];
  priority: number;
}

export type CEPCondition =
  | { type: 'count_exceeds'; count: number }
  | { type: 'distinct_sources_exceed'; count: number }
  | { type: 'severity_escalation'; from: string; to: string }
  | { type: 'pattern_sequence'; sequence: string[] }
  | { type: 'field_threshold'; field: string; operator: '>' | '<' | '>=' | '<=' | '=='; value: number }
  | { type: 'absence'; eventType: string; withinSec: number }
  | { type: 'custom'; evaluator: (events: CEPEvent[]) => boolean };

export type CEPAction =
  | { type: 'alert'; severity: string; message: string }
  | { type: 'kafka'; topic: string; payload?: Record<string, unknown> }
  | { type: 'webhook'; url: string; method?: string }
  | { type: 'escalate'; to: string }
  | { type: 'log'; level: string };

export interface CEPAlert {
  alertId: string;
  ruleId: string;
  ruleName: string;
  triggeredAt: Date;
  windowStart: Date;
  windowEnd: Date;
  matchedEvents: number;
  severity: string;
  message: string;
  action: CEPAction;
  organizationId?: string;
  acknowledged: boolean;
}

export interface FlinkHealth {
  enabled: boolean;
  mode: string;
  connected: boolean;
  activeRules: number;
  totalAlerts: number;
  eventsProcessed: number;
  latencyMs?: number;
}

// ---------------------------------------------------------------------------
// DEFAULT CEP RULES
// ---------------------------------------------------------------------------

const DEFAULT_RULES: CEPRule[] = [
  {
    id: 'compliance-drift-burst',
    name: 'Compliance Drift Burst',
    description: 'Detects multiple compliance violations within a short window',
    enabled: true,
    eventTypes: ['compliance.violation', 'compliance.drift'],
    windowSec: 600,
    threshold: 3,
    condition: { type: 'count_exceeds', count: 3 },
    action: { type: 'alert', severity: 'critical', message: 'Compliance drift burst detected' },
    complianceFrameworks: ['SOX', 'DORA', 'Basel-III'],
    priority: 1,
  },
  {
    id: 'cross-department-violation',
    name: 'Cross-Department Violation Pattern',
    description: 'Detects compliance violations spanning multiple departments',
    enabled: true,
    eventTypes: ['compliance.violation'],
    windowSec: 1800,
    threshold: 2,
    condition: { type: 'distinct_sources_exceed', count: 2 },
    action: { type: 'escalate', to: 'compliance-officer' },
    complianceFrameworks: ['SOX', 'GDPR'],
    priority: 2,
  },
  {
    id: 'security-escalation',
    name: 'Security Severity Escalation',
    description: 'Detects rapid escalation from warning to critical',
    enabled: true,
    eventTypes: ['security.alert', 'security.incident'],
    windowSec: 300,
    threshold: 1,
    condition: { type: 'severity_escalation', from: 'warning', to: 'critical' },
    action: { type: 'alert', severity: 'critical', message: 'Security severity escalation detected' },
    complianceFrameworks: ['NIST-800-53', 'ISO27001'],
    priority: 1,
  },
  {
    id: 'guardrail-trigger-storm',
    name: 'Guardrail Trigger Storm',
    description: 'Detects excessive guardrail triggers indicating possible attack',
    enabled: true,
    eventTypes: ['sentry.block', 'sentry.flag', 'guardrail.triggered'],
    windowSec: 120,
    threshold: 10,
    condition: { type: 'count_exceeds', count: 10 },
    action: { type: 'alert', severity: 'critical', message: 'Guardrail trigger storm — possible jailbreak attack' },
    complianceFrameworks: ['EU-AI-Act'],
    priority: 1,
  },
  {
    id: 'data-exfiltration-pattern',
    name: 'Data Exfiltration Pattern',
    description: 'Detects multiple data export events from same source',
    enabled: true,
    eventTypes: ['data.export', 'data.download', 'data.bulk_access'],
    windowSec: 600,
    threshold: 5,
    condition: { type: 'count_exceeds', count: 5 },
    action: { type: 'alert', severity: 'critical', message: 'Possible data exfiltration detected' },
    complianceFrameworks: ['GDPR', 'HIPAA', 'SOX'],
    priority: 1,
  },
  {
    id: 'iiss-score-drop',
    name: 'IISS Score Drop',
    description: 'Detects rapid drop in Institutional Intelligence Safety Score',
    enabled: true,
    eventTypes: ['iiss.score_update'],
    windowSec: 1800,
    threshold: 2,
    condition: { type: 'field_threshold', field: 'payload.scoreDelta', operator: '<', value: -10 },
    action: { type: 'escalate', to: 'governance-board' },
    complianceFrameworks: ['EU-AI-Act', 'NIST-AI-RMF'],
    priority: 2,
  },
];

// ---------------------------------------------------------------------------
// FLINK CEP SERVICE
// ---------------------------------------------------------------------------

class FlinkCEPService {
  private enabled: boolean;
  private mode: 'cluster' | 'embedded';
  private serverUrl: string;
  private rules: Map<string, CEPRule> = new Map();
  private alerts: CEPAlert[] = [];
  private eventWindows: Map<string, CEPEvent[]> = new Map();

  private eventsProcessed = 0;
  private alertsTriggered = 0;
  private rulesEvaluated = 0;

  constructor() {
    this.enabled = process.env['FLINK_ENABLED'] === 'true';
    this.mode = (process.env['FLINK_MODE'] as 'cluster' | 'embedded') || 'embedded';
    this.serverUrl = process.env['FLINK_URL'] || 'http://localhost:8081';

    for (const rule of DEFAULT_RULES) {
      this.rules.set(rule.id, rule);
    }

    if (this.enabled) {
      logger.info('[Flink CEP] Enabled in ' + this.mode + ' mode — ' + this.rules.size + ' rules loaded');
    } else {
      logger.info('[Flink CEP] Disabled — set FLINK_ENABLED=true for real-time stream processing');
    }
  }

  async ingestEvent(event: CEPEvent): Promise<CEPAlert[]> {
    this.eventsProcessed++;
    if (!this.enabled) return [];

    if (this.mode === 'cluster') {
      try {
        const response = await fetch(this.serverUrl + '/v1/events/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json() as any;
          return data.alerts || [];
        }
      } catch {
        // Fall through to embedded
      }
    }

    return this.ingestEmbedded(event);
  }

  async ingestBatch(events: CEPEvent[]): Promise<CEPAlert[]> {
    const allAlerts: CEPAlert[] = [];
    for (const event of events) {
      const alerts = await this.ingestEvent(event);
      allAlerts.push(...alerts);
    }
    return allAlerts;
  }

  private ingestEmbedded(event: CEPEvent): CEPAlert[] {
    const triggered: CEPAlert[] = [];

    const applicable = Array.from(this.rules.values())
      .filter(r => r.enabled && r.eventTypes.some(t => event.type.includes(t) || t === '*'))
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicable) {
      if (!this.eventWindows.has(rule.id)) this.eventWindows.set(rule.id, []);
      const window = this.eventWindows.get(rule.id)!;
      window.push(event);

      const windowStart = new Date(Date.now() - rule.windowSec * 1000);
      const active = window.filter(e => e.timestamp >= windowStart);
      this.eventWindows.set(rule.id, active);

      this.rulesEvaluated++;
      if (this.evaluateCondition(rule.condition, active)) {
        const alert = this.createAlert(rule, active, windowStart);
        triggered.push(alert);
        this.alerts.push(alert);
        this.alertsTriggered++;
        this.executeAction(rule.action, alert).catch(() => {});
        this.eventWindows.set(rule.id, []);
      }
    }

    return triggered;
  }

  private evaluateCondition(condition: CEPCondition, events: CEPEvent[]): boolean {
    switch (condition.type) {
      case 'count_exceeds':
        return events.length >= condition.count;
      case 'distinct_sources_exceed':
        return new Set(events.map(e => e.source)).size >= condition.count;
      case 'severity_escalation':
        return events.some(e => e.severity === condition.from) && events.some(e => e.severity === condition.to);
      case 'pattern_sequence': {
        let idx = 0;
        for (const e of events) {
          if (e.type.includes(condition.sequence[idx]!)) { idx++; if (idx >= condition.sequence.length) return true; }
        }
        return false;
      }
      case 'field_threshold': {
        for (const e of events) {
          const val = condition.field.split('.').reduce((o: any, k) => o?.[k], e);
          if (typeof val !== 'number') continue;
          if (condition.operator === '>' && val > condition.value) return true;
          if (condition.operator === '<' && val < condition.value) return true;
          if (condition.operator === '>=' && val >= condition.value) return true;
          if (condition.operator === '<=' && val <= condition.value) return true;
          if (condition.operator === '==' && val === condition.value) return true;
        }
        return false;
      }
      case 'absence':
        return events.filter(e => e.type === condition.eventType).length === 0 && events.length > 0;
      case 'custom':
        return condition.evaluator(events);
      default:
        return false;
    }
  }

  private createAlert(rule: CEPRule, events: CEPEvent[], windowStart: Date): CEPAlert {
    const msg = (rule.action as any).message || 'Rule ' + rule.name + ' triggered';
    return {
      alertId: 'cep-' + Date.now() + '-' + crypto.randomUUID().slice(0, 8),
      ruleId: rule.id,
      ruleName: rule.name,
      triggeredAt: new Date(),
      windowStart,
      windowEnd: new Date(),
      matchedEvents: events.length,
      severity: (rule.action as any).severity || 'warning',
      message: msg,
      action: rule.action,
      organizationId: events[0]?.organizationId,
      acknowledged: false,
    };
  }

  private async executeAction(action: CEPAction, alert: CEPAlert): Promise<void> {
    if (action.type === 'alert') {
      logger.warn('[Flink CEP ALERT] [' + alert.severity + '] ' + alert.message);
    } else if (action.type === 'escalate') {
      logger.warn('[Flink CEP ESCALATE] ' + alert.ruleName + ' -> ' + (action as any).to);
    }
    try {
      const { kafkaEventBridge } = await import('../kafka/KafkaEventBridge.js');
      await kafkaEventBridge.emitAudit({
        organizationId: alert.organizationId || 'system',
        userId: 'flink-cep',
        action: 'cep.alert.' + alert.severity,
        resourceType: 'cep-rule',
        resourceId: alert.ruleId,
        details: { alertId: alert.alertId, message: alert.message },
      });
    } catch { /* Kafka not critical */ }
  }

  // ─── Rule Management ──────────────────────────────────────────────────

  addRule(rule: CEPRule): void { this.rules.set(rule.id, rule); }
  removeRule(ruleId: string): boolean { this.eventWindows.delete(ruleId); return this.rules.delete(ruleId); }
  setRuleEnabled(ruleId: string, enabled: boolean): boolean {
    const r = this.rules.get(ruleId); if (!r) return false; r.enabled = enabled; return true;
  }
  getRules(): CEPRule[] { return Array.from(this.rules.values()); }
  getRule(ruleId: string): CEPRule | undefined { return this.rules.get(ruleId); }

  // ─── Alert Management ─────────────────────────────────────────────────

  getAlerts(limit = 100): CEPAlert[] { return this.alerts.slice(-limit).reverse(); }
  acknowledgeAlert(alertId: string): boolean {
    const a = this.alerts.find(x => x.alertId === alertId); if (!a) return false; a.acknowledged = true; return true;
  }
  getUnacknowledgedAlerts(): CEPAlert[] { return this.alerts.filter(a => !a.acknowledged); }

  // ─── Health & Stats ───────────────────────────────────────────────────

  async checkHealth(): Promise<FlinkHealth> {
    if (!this.enabled) return { enabled: false, mode: this.mode, connected: false, activeRules: 0, totalAlerts: 0, eventsProcessed: 0 };
    if (this.mode === 'cluster') {
      try {
        const s = Date.now();
        const r = await fetch(this.serverUrl + '/overview', { signal: AbortSignal.timeout(3000) });
        return { enabled: true, mode: 'cluster', connected: r.ok, activeRules: Array.from(this.rules.values()).filter(x => x.enabled).length, totalAlerts: this.alerts.length, eventsProcessed: this.eventsProcessed, latencyMs: Date.now() - s };
      } catch { return { enabled: true, mode: 'cluster', connected: false, activeRules: 0, totalAlerts: 0, eventsProcessed: 0 }; }
    }
    return { enabled: true, mode: 'embedded', connected: true, activeRules: Array.from(this.rules.values()).filter(x => x.enabled).length, totalAlerts: this.alerts.length, eventsProcessed: this.eventsProcessed };
  }

  getStats(): { enabled: boolean; mode: string; totalRules: number; activeRules: number; eventsProcessed: number; rulesEvaluated: number; alertsTriggered: number; unacknowledgedAlerts: number } {
    return {
      enabled: this.enabled, mode: this.mode,
      totalRules: this.rules.size,
      activeRules: Array.from(this.rules.values()).filter(r => r.enabled).length,
      eventsProcessed: this.eventsProcessed,
      rulesEvaluated: this.rulesEvaluated,
      alertsTriggered: this.alertsTriggered,
      unacknowledgedAlerts: this.alerts.filter(a => !a.acknowledged).length,
    };
  }

  isEnabled(): boolean { return this.enabled; }
}

export const flinkCEP = new FlinkCEPService();
export default flinkCEP;
