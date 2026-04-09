/**
 * <council-status-badge> — Framework-Agnostic Web Component
 *
 * Lightweight inline badge showing Council deliberation status, confidence
 * score, and agent count. Designed for embedding in CRM views, ticketing
 * systems, or external dashboards.
 *
 * @example
 * ```html
 * <council-status-badge
 *   api-url="https://app.datacendia.com/api/v1"
 *   deliberation-id="del-abc123"
 * ></council-status-badge>
 * ```
 *
 * Or with static data:
 * ```html
 * <council-status-badge
 *   status="completed"
 *   confidence="0.82"
 *   agent-count="6"
 *   label="CRE Acquisition Review"
 * ></council-status-badge>
 * ```
 *
 * @module @datacendia/widgets/council-badge
 * @license Apache-2.0
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeliberationStatus =
  | 'pending'
  | 'in_progress'
  | 'deliberating'
  | 'cross_examination'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface DeliberationSummary {
  id: string;
  question: string;
  status: DeliberationStatus;
  confidence: number;
  agentCount: number;
  consensusReached: boolean;
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement('council-status-badge')
export class CouncilStatusBadge extends LitElement {
  /** Base URL of the Datacendia API (no trailing slash) */
  @property({ attribute: 'api-url' }) apiUrl = '';

  /** Deliberation ID to poll */
  @property({ attribute: 'deliberation-id' }) deliberationId = '';

  /** Static status override (if not using API) */
  @property() status: DeliberationStatus = 'pending';

  /** Static confidence override (0-1) */
  @property({ type: Number }) confidence = 0;

  /** Static agent count override */
  @property({ type: Number, attribute: 'agent-count' }) agentCount = 0;

  /** Label text */
  @property() label = '';

  /** Poll interval in ms (0 = no polling) */
  @property({ type: Number, attribute: 'poll-ms' }) pollMs = 0;

  /** Display variant: 'badge' | 'card' | 'inline' */
  @property() variant: 'badge' | 'card' | 'inline' = 'badge';

  /** Theme: 'dark' | 'light' */
  @property() theme: 'dark' | 'light' = 'dark';

  /** Show confidence as a progress bar */
  @property({ type: Boolean, attribute: 'show-bar' }) showBar = false;

  @state() private _data: DeliberationSummary | null = null;
  @state() private _loading = false;
  @state() private _error = '';
  @state() private _pollTimer: ReturnType<typeof setInterval> | null = null;

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    if (this.apiUrl && this.deliberationId) {
      this._fetch();
      if (this.pollMs > 0) {
        this._pollTimer = setInterval(() => this._fetch(), this.pollMs);
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  // -------------------------------------------------------------------------
  // Data
  // -------------------------------------------------------------------------

  private async _fetch() {
    if (!this.apiUrl || !this.deliberationId) return;
    this._loading = true;
    try {
      const res = await fetch(`${this.apiUrl}/council/deliberations/${this.deliberationId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const d = json.data ?? json;
      this._data = {
        id: d.id,
        question: d.question,
        status: d.status?.toLowerCase() ?? 'pending',
        confidence: Number(d.confidence) || 0,
        agentCount: d.agent_contributions?.length ?? d.agentCount ?? 0,
        consensusReached: d.consensus_reached ?? d.consensusReached ?? false,
        createdAt: d.created_at ?? d.createdAt,
        completedAt: d.completed_at ?? d.completedAt,
        durationMs: d.duration_ms ?? d.durationMs,
      };
      this._error = '';

      // Stop polling if completed or failed
      if (['completed', 'failed', 'cancelled'].includes(this._data.status) && this._pollTimer) {
        clearInterval(this._pollTimer);
        this._pollTimer = null;
      }

      this.dispatchEvent(new CustomEvent('council-status-update', {
        detail: this._data,
        bubbles: true,
        composed: true,
      }));
    } catch (e) {
      this._error = (e as Error).message;
    } finally {
      this._loading = false;
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private get _status(): DeliberationStatus {
    return this._data?.status ?? this.status;
  }

  private get _confidence(): number {
    return this._data?.confidence ?? this.confidence;
  }

  private get _agentCount(): number {
    return this._data?.agentCount ?? this.agentCount;
  }

  private get _label(): string {
    return this.label || this._data?.question?.substring(0, 60) || '';
  }

  private _statusColor(): string {
    switch (this._status) {
      case 'completed': return 'var(--council-success, #22c55e)';
      case 'deliberating':
      case 'cross_examination':
      case 'in_progress': return 'var(--council-active, #3b82f6)';
      case 'failed': return 'var(--council-danger, #ef4444)';
      case 'cancelled': return 'var(--council-dim, #71717a)';
      default: return 'var(--council-warning, #eab308)';
    }
  }

  private _statusIcon(): string {
    switch (this._status) {
      case 'completed': return '✓';
      case 'deliberating':
      case 'cross_examination':
      case 'in_progress': return '◉';
      case 'failed': return '✗';
      case 'cancelled': return '—';
      default: return '○';
    }
  }

  private _statusLabel(): string {
    switch (this._status) {
      case 'completed': return 'Completed';
      case 'deliberating': return 'Deliberating';
      case 'cross_examination': return 'Cross-Exam';
      case 'in_progress': return 'In Progress';
      case 'failed': return 'Failed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  }

  private _confidenceColor(): string {
    const c = this._confidence;
    if (c >= 0.8) return 'var(--council-success, #22c55e)';
    if (c >= 0.6) return 'var(--council-warning, #eab308)';
    return 'var(--council-danger, #ef4444)';
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  override render() {
    if (this._error && !this._data && !this.status) {
      return html`<span class="error ${this.theme}" title=${this._error}>⚠</span>`;
    }

    if (this.variant === 'inline') return this._renderInline();
    if (this.variant === 'card') return this._renderCard();
    return this._renderBadge();
  }

  private _renderBadge() {
    return html`
      <span class="badge-root ${this.theme}" title="${this._label}">
        <span class="status-dot" style="background:${this._statusColor()}"></span>
        <span class="status-label">${this._statusLabel()}</span>
        ${this._confidence > 0 ? html`
          <span class="conf" style="color:${this._confidenceColor()}">${Math.round(this._confidence * 100)}%</span>
        ` : nothing}
        ${this._agentCount > 0 ? html`
          <span class="agents">👥 ${this._agentCount}</span>
        ` : nothing}
        ${this._loading ? html`<span class="pulse"></span>` : nothing}
      </span>
    `;
  }

  private _renderInline() {
    return html`
      <span class="inline-root ${this.theme}">
        <span class="status-icon" style="color:${this._statusColor()}">${this._statusIcon()}</span>
        ${this._confidence > 0 ? html`
          <span style="color:${this._confidenceColor()}">${Math.round(this._confidence * 100)}%</span>
        ` : nothing}
      </span>
    `;
  }

  private _renderCard() {
    return html`
      <div class="card-root ${this.theme}">
        <div class="card-header">
          <span class="status-dot" style="background:${this._statusColor()}"></span>
          <span class="status-label">${this._statusLabel()}</span>
          ${this._loading ? html`<span class="pulse"></span>` : nothing}
        </div>
        ${this._label ? html`<div class="card-label">${this._label}</div>` : nothing}
        <div class="card-metrics">
          ${this._confidence > 0 ? html`
            <div class="metric">
              <span class="metric-label">Confidence</span>
              ${this.showBar ? html`
                <div class="conf-bar">
                  <div class="conf-fill" style="width:${this._confidence * 100}%; background:${this._confidenceColor()}"></div>
                </div>
              ` : nothing}
              <span class="metric-value" style="color:${this._confidenceColor()}">${Math.round(this._confidence * 100)}%</span>
            </div>
          ` : nothing}
          ${this._agentCount > 0 ? html`
            <div class="metric">
              <span class="metric-label">Agents</span>
              <span class="metric-value">${this._agentCount}</span>
            </div>
          ` : nothing}
          ${this._data?.durationMs ? html`
            <div class="metric">
              <span class="metric-label">Duration</span>
              <span class="metric-value">${(this._data.durationMs / 1000).toFixed(1)}s</span>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static override styles = css`
    :host { display: inline-block; font-family: var(--council-font, 'Inter', system-ui, sans-serif); }

    /* Shared vars */
    .badge-root, .card-root, .inline-root, .error {
      --bg: var(--council-bg, #0a0a0f);
      --surface: var(--council-surface, #141420);
      --border: var(--council-border, #2a2a3a);
      --text: var(--council-text, #e4e4e7);
      --text-dim: var(--council-text-dim, #71717a);
      --accent: var(--council-accent, #c9a84c);
    }
    .light {
      --bg: #ffffff; --surface: #f4f4f5; --border: #e4e4e7; --text: #18181b; --text-dim: #71717a;
    }

    /* Badge */
    .badge-root {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      padding: 6px 14px; border-radius: 20px; font-size: 12px; white-space: nowrap;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .status-label { font-weight: 600; }
    .conf { font-weight: 700; font-size: 13px; }
    .agents { color: var(--text-dim); font-size: 11px; }

    /* Inline */
    .inline-root { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; }
    .status-icon { font-size: 14px; }

    /* Card */
    .card-root {
      background: var(--bg); color: var(--text); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px; min-width: 200px;
    }
    .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .card-label { font-size: 13px; color: var(--text-dim); margin-bottom: 12px; line-height: 1.4; }
    .card-metrics { display: flex; flex-direction: column; gap: 8px; }
    .metric { display: flex; align-items: center; gap: 8px; }
    .metric-label { font-size: 11px; color: var(--text-dim); min-width: 70px; }
    .metric-value { font-size: 14px; font-weight: 700; }
    .conf-bar { flex: 1; height: 5px; background: var(--surface); border-radius: 3px; overflow: hidden; }
    .conf-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

    /* Loading pulse */
    .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    /* Error */
    .error { color: var(--council-danger, #ef4444); font-size: 14px; cursor: help; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'council-status-badge': CouncilStatusBadge;
  }
}
