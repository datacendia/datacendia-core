import { logger } from '../../utils/logger.js';
/**
 * CendiaGateway™ — Webhook Notification Service
 *
 * Sends real-time alerts to Slack, Microsoft Teams, email (via SMTP webhook),
 * and generic HTTP endpoints when governance events occur (PII blocks,
 * policy violations, shadow AI detections, etc.).
 *
 * Zero external dependencies — uses native fetch().
 *
 * @module services/gateway/WebhookNotifier
 */

// =============================================================================
// TYPES
// =============================================================================

export interface WebhookConfig {
  id: string;
  name: string;
  enabled: boolean;
  type: 'slack' | 'teams' | 'email' | 'generic' | 'pagerduty';
  url: string;
  secret?: string;              // HMAC secret for generic webhooks
  events: WebhookEventType[];   // Which events trigger this webhook
  severityFilter?: ('info' | 'warning' | 'critical')[];
  rateLimitPerMinute: number;   // Max notifications per minute
  includePromptText: boolean;   // Whether to include prompt text (security-sensitive)
}

export type WebhookEventType =
  | 'pii_blocked'
  | 'pii_redacted'
  | 'policy_blocked'
  | 'shadow_ai_critical'
  | 'shadow_ai_warning'
  | 'rate_limit_exceeded'
  | 'manifest_generated'
  | 'provider_error'
  | 'circuit_breaker_open';

export interface WebhookPayload {
  event: WebhookEventType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: 'CendiaGateway';
  organization?: string;
  user?: string;
  department?: string;
  provider?: string;
  model?: string;
  interactionId?: string;
  piiTypes?: string[];
  policyName?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// DEFAULT CONFIGS
// =============================================================================

const DEFAULT_WEBHOOKS: WebhookConfig[] = [];

// =============================================================================
// NOTIFIER
// =============================================================================

class WebhookNotifier {
  private webhooks: WebhookConfig[] = [];
  private rateLimitCounters: Map<string, { count: number; windowStart: number }> = new Map();

  constructor(webhooks?: WebhookConfig[]) {
    this.webhooks = webhooks || [...DEFAULT_WEBHOOKS];
  }

  /**
   * Send a notification to all matching webhooks.
   * Non-blocking — fires and forgets, logs errors.
   */
  async notify(payload: WebhookPayload): Promise<void> {
    const matchingWebhooks = this.webhooks.filter(w =>
      w.enabled &&
      w.events.includes(payload.event) &&
      (!w.severityFilter || w.severityFilter.includes(payload.severity)) &&
      this.checkRateLimit(w)
    );

    const promises = matchingWebhooks.map(webhook =>
      this.send(webhook, payload).catch(err =>
        logger.error(`[CendiaGateway] Webhook "${webhook.name}" failed:`, (err as Error).message)
      )
    );

    await Promise.allSettled(promises);
  }

  /**
   * Send to a specific webhook, formatting for the target platform.
   */
  private async send(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
    let body: any;
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };

    switch (webhook.type) {
      case 'slack':
        body = this.formatSlack(payload);
        break;
      case 'teams':
        body = this.formatTeams(payload);
        break;
      case 'pagerduty':
        body = this.formatPagerDuty(payload);
        break;
      case 'generic':
      default:
        body = payload;
        if (webhook.secret) {
          const crypto = await import('crypto');
          const sig = crypto.createHmac('sha256', webhook.secret)
            .update(JSON.stringify(payload))
            .digest('hex');
          headers['X-Cendia-Signature'] = `sha256=${sig}`;
        }
        break;
    }

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text().catch(() => 'unknown')}`);
    }
  }

  // =========================================================================
  // PLATFORM-SPECIFIC FORMATTERS
  // =========================================================================

  private formatSlack(payload: WebhookPayload): any {
    const severityEmoji: Record<string, string> = {
      info: ':information_source:',
      warning: ':warning:',
      critical: ':rotating_light:',
    };

    const blocks: any[] = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${severityEmoji[payload.severity] || ''} ${payload.title}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: payload.message },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Event:*\n${payload.event}` },
          { type: 'mrkdwn', text: `*Severity:*\n${payload.severity.toUpperCase()}` },
          ...(payload.user ? [{ type: 'mrkdwn', text: `*User:*\n${payload.user}` }] : []),
          ...(payload.department ? [{ type: 'mrkdwn', text: `*Department:*\n${payload.department}` }] : []),
          ...(payload.provider ? [{ type: 'mrkdwn', text: `*Provider:*\n${payload.provider}` }] : []),
          ...(payload.model ? [{ type: 'mrkdwn', text: `*Model:*\n${payload.model}` }] : []),
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `CendiaGateway | ${payload.timestamp}${payload.interactionId ? ` | ID: ${payload.interactionId}` : ''}` },
        ],
      },
    ];

    if (payload.piiTypes && payload.piiTypes.length > 0) {
      blocks.splice(2, 0, {
        type: 'section',
        text: { type: 'mrkdwn', text: `*PII Types Detected:* ${payload.piiTypes.join(', ')}` },
      });
    }

    return { blocks };
  }

  private formatTeams(payload: WebhookPayload): any {
    const severityColor: Record<string, string> = {
      info: '0078D4',
      warning: 'FFA500',
      critical: 'DC2626',
    };

    return {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: severityColor[payload.severity] || '0078D4',
      summary: payload.title,
      sections: [
        {
          activityTitle: payload.title,
          activitySubtitle: `CendiaGateway — ${payload.severity.toUpperCase()}`,
          facts: [
            { name: 'Event', value: payload.event },
            { name: 'Severity', value: payload.severity.toUpperCase() },
            ...(payload.user ? [{ name: 'User', value: payload.user }] : []),
            ...(payload.department ? [{ name: 'Department', value: payload.department }] : []),
            ...(payload.provider ? [{ name: 'Provider', value: payload.provider }] : []),
            ...(payload.model ? [{ name: 'Model', value: payload.model }] : []),
            ...(payload.piiTypes ? [{ name: 'PII Types', value: payload.piiTypes.join(', ') }] : []),
          ],
          markdown: true,
          text: payload.message,
        },
      ],
    };
  }

  private formatPagerDuty(payload: WebhookPayload): any {
    const severityMap: Record<string, string> = {
      info: 'info',
      warning: 'warning',
      critical: 'critical',
    };

    return {
      routing_key: '', // Set via webhook URL or config
      event_action: 'trigger',
      payload: {
        summary: `[CendiaGateway] ${payload.title}`,
        severity: severityMap[payload.severity] || 'warning',
        source: 'CendiaGateway',
        component: 'ai-governance-gateway',
        group: payload.department || 'unknown',
        class: payload.event,
        custom_details: {
          message: payload.message,
          user: payload.user,
          provider: payload.provider,
          model: payload.model,
          piiTypes: payload.piiTypes,
          interactionId: payload.interactionId,
        },
      },
    };
  }

  // =========================================================================
  // RATE LIMITING
  // =========================================================================

  private checkRateLimit(webhook: WebhookConfig): boolean {
    const now = Date.now();
    const minuteMs = 60_000;
    const counter = this.rateLimitCounters.get(webhook.id);

    if (!counter || (now - counter.windowStart) > minuteMs) {
      this.rateLimitCounters.set(webhook.id, { count: 1, windowStart: now });
      return true;
    }

    if (counter.count >= webhook.rateLimitPerMinute) {
      return false;
    }

    counter.count++;
    return true;
  }

  // =========================================================================
  // WEBHOOK MANAGEMENT
  // =========================================================================

  getWebhooks(): WebhookConfig[] { return this.webhooks; }

  addWebhook(config: WebhookConfig): void {
    this.webhooks.push(config);
  }

  updateWebhook(id: string, updates: Partial<WebhookConfig>): WebhookConfig | null {
    const idx = this.webhooks.findIndex(w => w.id === id);
    if (idx === -1) return null;
    this.webhooks[idx] = { ...this.webhooks[idx]!, ...updates };
    return this.webhooks[idx]!;
  }

  removeWebhook(id: string): boolean {
    const idx = this.webhooks.findIndex(w => w.id === id);
    if (idx === -1) return false;
    this.webhooks.splice(idx, 1);
    return true;
  }

  /**
   * Test a webhook by sending a test notification.
   */
  async testWebhook(id: string): Promise<{ success: boolean; error?: string }> {
    const webhook = this.webhooks.find(w => w.id === id);
    if (!webhook) return { success: false, error: 'Webhook not found' };

    try {
      await this.send(webhook, {
        event: 'pii_blocked',
        severity: 'info',
        title: 'CendiaGateway Test Notification',
        message: 'This is a test notification from CendiaGateway. If you see this, webhook integration is working correctly.',
        timestamp: new Date().toISOString(),
        source: 'CendiaGateway',
      });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}

export default WebhookNotifier;
