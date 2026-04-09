/**
 * <dcii-evidence-viewer> — Framework-Agnostic Web Component
 *
 * Renders a Datacendia Decision Packet with cryptographic verification status.
 * Shows SHA-256 artifact hashes, Ed25519 signature, Merkle tree root, and
 * overall integrity state. Designed for embedding in Angular, Vue, React, or
 * vanilla HTML dashboards.
 *
 * @example
 * ```html
 * <dcii-evidence-viewer
 *   api-url="https://app.datacendia.com/api/v1"
 *   packet-id="pkt-abc123"
 * ></dcii-evidence-viewer>
 * ```
 *
 * @module @datacendia/widgets/evidence-viewer
 * @license Apache-2.0
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ---------------------------------------------------------------------------
// Types (mirrors backend DecisionPacket, kept minimal for the widget)
// ---------------------------------------------------------------------------

export interface SignatureInfo {
  algorithm: string;
  keyId: string;
  signature: string;
  provider: string;
  signedAt?: string;
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  agentRole: string;
  phase: string;
  statement: string;
  confidence: number;
  timestamp: string;
}

export interface EvidencePacket {
  id: string;
  runId: string;
  version: number;
  question: string;
  recommendation: string;
  confidence: number;
  confidenceBounds: { lower: number; upper: number };
  consensusReached: boolean;
  artifactHashes: Record<string, string>;
  merkleRoot: string;
  signature?: SignatureInfo;
  agentContributions: AgentContribution[];
  regulatoryFrameworks: string[];
  createdAt: string;
  retentionUntil: string;
}

export interface VerificationResult {
  integrityValid: boolean;
  signatureValid: boolean;
  merkleRoot: string;
  verifiedAt: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement('dcii-evidence-viewer')
export class DciiEvidenceViewer extends LitElement {
  /** Base URL of the Datacendia API (no trailing slash) */
  @property({ attribute: 'api-url' }) apiUrl = '';

  /** Decision packet ID to load */
  @property({ attribute: 'packet-id' }) packetId = '';

  /** Or pass a packet object directly (JSON string or object) */
  @property({ attribute: false }) packet: EvidencePacket | null = null;

  /** Show the full agent contributions panel */
  @property({ type: Boolean, attribute: 'show-agents' }) showAgents = false;

  /** Compact mode — hides details, shows only verification badge */
  @property({ type: Boolean }) compact = false;

  /** Theme: 'dark' | 'light' */
  @property() theme: 'dark' | 'light' = 'dark';

  @state() private _packet: EvidencePacket | null = null;
  @state() private _verification: VerificationResult | null = null;
  @state() private _loading = false;
  @state() private _error = '';
  @state() private _verifying = false;
  @state() private _expandedHash: string | null = null;

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    if (this.packet) {
      this._packet = this.packet;
    } else if (this.apiUrl && this.packetId) {
      this._fetchPacket();
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('packet') && this.packet) {
      this._packet = this.packet;
    }
    if ((changed.has('apiUrl') || changed.has('packetId')) && this.apiUrl && this.packetId) {
      this._fetchPacket();
    }
  }

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  private async _fetchPacket() {
    if (!this.apiUrl || !this.packetId) return;
    this._loading = true;
    this._error = '';
    try {
      const res = await fetch(`${this.apiUrl}/council-packets/${this.packetId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this._packet = json.data ?? json;
    } catch (e) {
      this._error = (e as Error).message;
    } finally {
      this._loading = false;
    }
  }

  private async _verify() {
    if (!this.apiUrl || !this.packetId) return;
    this._verifying = true;
    try {
      const res = await fetch(`${this.apiUrl}/council-packets/${this.packetId}/verify`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this._verification = json.data ?? json;
      this.dispatchEvent(new CustomEvent('dcii-verified', { detail: this._verification, bubbles: true, composed: true }));
    } catch (e) {
      this._error = (e as Error).message;
    } finally {
      this._verifying = false;
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private _short(hash: string, len = 12): string {
    return hash.length > len ? hash.slice(0, len) + '…' : hash;
  }

  private _copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  private _confidenceColor(c: number): string {
    if (c >= 0.8) return 'var(--dcii-success, #22c55e)';
    if (c >= 0.6) return 'var(--dcii-warning, #eab308)';
    return 'var(--dcii-danger, #ef4444)';
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  override render() {
    if (this._loading) return html`<div class="dcii-root loading">Loading packet…</div>`;
    if (this._error) return html`<div class="dcii-root error">⚠ ${this._error}</div>`;
    if (!this._packet) return html`<div class="dcii-root empty">No packet loaded</div>`;

    const p = this._packet;
    const v = this._verification;

    if (this.compact) {
      return html`
        <div class="dcii-root compact ${this.theme}">
          <span class="badge ${v?.integrityValid ? 'valid' : v ? 'invalid' : 'unverified'}">
            ${v?.integrityValid ? '✓ Verified' : v ? '✗ Invalid' : '● Unverified'}
          </span>
          <span class="run-id">${p.runId}</span>
          <span class="merkle" title="${p.merkleRoot}">${this._short(p.merkleRoot)}</span>
        </div>
      `;
    }

    return html`
      <div class="dcii-root ${this.theme}">
        <!-- Header -->
        <div class="header">
          <div class="title-row">
            <span class="logo">◆</span>
            <span class="title">DCII Evidence Packet</span>
            <span class="version">v${p.version}</span>
          </div>
          <div class="run-id">${p.runId}</div>
        </div>

        <!-- Decision summary -->
        <div class="section">
          <div class="section-label">Decision</div>
          <div class="question">${p.question}</div>
          <div class="recommendation">${p.recommendation}</div>
          <div class="confidence-row">
            <span class="confidence-label">Confidence</span>
            <span class="confidence-bar">
              <span class="confidence-fill" style="width:${p.confidence * 100}%; background:${this._confidenceColor(p.confidence)}"></span>
            </span>
            <span class="confidence-value" style="color:${this._confidenceColor(p.confidence)}">${Math.round(p.confidence * 100)}%</span>
          </div>
          <div class="consensus ${p.consensusReached ? 'yes' : 'no'}">
            ${p.consensusReached ? '✓ Consensus reached' : '✗ No consensus'}
          </div>
        </div>

        <!-- Cryptographic integrity -->
        <div class="section">
          <div class="section-label">Cryptographic Integrity</div>

          <div class="crypto-row merkle-row">
            <span class="crypto-label">Merkle Root</span>
            <code class="hash" @click=${() => this._copyToClipboard(p.merkleRoot)} title="Click to copy">${p.merkleRoot}</code>
          </div>

          <div class="hash-grid">
            ${Object.entries(p.artifactHashes).map(([key, hash]) => html`
              <div class="hash-item" @click=${() => { this._expandedHash = this._expandedHash === key ? null : key; }}>
                <span class="hash-key">${key}</span>
                <code class="hash-value">${this._expandedHash === key ? hash : this._short(hash)}</code>
                <span class="hash-algo">SHA-256</span>
              </div>
            `)}
          </div>

          ${p.signature ? html`
            <div class="crypto-row signature-row">
              <span class="crypto-label">Signature</span>
              <div class="sig-details">
                <span class="sig-algo">${p.signature.algorithm}</span>
                <span class="sig-provider">${p.signature.provider}</span>
                <code class="sig-value">${this._short(p.signature.signature, 24)}</code>
              </div>
            </div>
          ` : html`
            <div class="crypto-row unsigned">
              <span class="crypto-label">Signature</span>
              <span class="unsigned-label">Unsigned</span>
            </div>
          `}
        </div>

        <!-- Verification -->
        <div class="section verify-section">
          ${v ? html`
            <div class="verify-result ${v.integrityValid && v.signatureValid ? 'valid' : 'invalid'}">
              <div class="verify-icon">${v.integrityValid && v.signatureValid ? '✓' : '✗'}</div>
              <div class="verify-details">
                <div>Integrity: ${v.integrityValid ? '✓ Valid' : '✗ Tampered'}</div>
                <div>Signature: ${v.signatureValid ? '✓ Valid' : '✗ Invalid'}</div>
                <div class="verify-time">Verified ${new Date(v.verifiedAt).toLocaleString()}</div>
              </div>
            </div>
          ` : nothing}
          ${this.apiUrl && this.packetId ? html`
            <button class="verify-btn" @click=${this._verify} ?disabled=${this._verifying}>
              ${this._verifying ? 'Verifying…' : v ? 'Re-verify' : 'Verify Integrity'}
            </button>
          ` : nothing}
          <div class="openssl-hint">
            <code>openssl dgst -sha256 -verify pubkey.pem -signature sig.bin packet.json</code>
          </div>
        </div>

        <!-- Regulatory frameworks -->
        ${p.regulatoryFrameworks.length > 0 ? html`
          <div class="section">
            <div class="section-label">Regulatory Frameworks</div>
            <div class="framework-tags">
              ${p.regulatoryFrameworks.map(f => html`<span class="tag">${f}</span>`)}
            </div>
          </div>
        ` : nothing}

        <!-- Agent contributions (expandable) -->
        ${this.showAgents && p.agentContributions?.length > 0 ? html`
          <div class="section">
            <div class="section-label">Agent Contributions (${p.agentContributions.length})</div>
            <div class="agents-list">
              ${p.agentContributions.map(a => html`
                <div class="agent-row">
                  <div class="agent-header">
                    <span class="agent-name">${a.agentName || a.agentId}</span>
                    <span class="agent-role">${a.agentRole}</span>
                    <span class="agent-confidence" style="color:${this._confidenceColor(a.confidence)}">${Math.round(a.confidence * 100)}%</span>
                  </div>
                  <div class="agent-statement">${a.statement?.substring(0, 200)}${(a.statement?.length ?? 0) > 200 ? '…' : ''}</div>
                </div>
              `)}
            </div>
          </div>
        ` : nothing}

        <!-- Footer -->
        <div class="footer">
          <span>Created ${new Date(p.createdAt).toLocaleDateString()}</span>
          <span>Retention until ${new Date(p.retentionUntil).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static override styles = css`
    :host {
      display: block;
      font-family: var(--dcii-font, 'Inter', system-ui, sans-serif);
      --bg: var(--dcii-bg, #0a0a0f);
      --surface: var(--dcii-surface, #141420);
      --border: var(--dcii-border, #2a2a3a);
      --text: var(--dcii-text, #e4e4e7);
      --text-dim: var(--dcii-text-dim, #71717a);
      --accent: var(--dcii-accent, #c9a84c);
      --success: var(--dcii-success, #22c55e);
      --danger: var(--dcii-danger, #ef4444);
      --warning: var(--dcii-warning, #eab308);
      --radius: var(--dcii-radius, 12px);
    }

    .dcii-root { background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .dcii-root.light { --bg: #ffffff; --surface: #f4f4f5; --border: #e4e4e7; --text: #18181b; --text-dim: #71717a; }
    .dcii-root.loading, .dcii-root.error, .dcii-root.empty { padding: 24px; text-align: center; color: var(--text-dim); }
    .dcii-root.error { color: var(--danger); }

    /* Compact mode */
    .dcii-root.compact { display: flex; align-items: center; gap: 12px; padding: 8px 16px; font-size: 13px; }
    .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge.valid { background: #052e16; color: var(--success); }
    .badge.invalid { background: #450a0a; color: var(--danger); }
    .badge.unverified { background: #1a1a2e; color: var(--text-dim); }
    .compact .run-id { color: var(--text-dim); font-family: monospace; font-size: 12px; }
    .compact .merkle { color: var(--accent); font-family: monospace; font-size: 12px; }

    /* Header */
    .header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
    .title-row { display: flex; align-items: center; gap: 8px; }
    .logo { color: var(--accent); font-size: 18px; }
    .title { font-size: 16px; font-weight: 600; }
    .version { font-size: 11px; color: var(--text-dim); background: var(--surface); padding: 2px 8px; border-radius: 4px; }
    .header .run-id { font-family: monospace; font-size: 12px; color: var(--text-dim); margin-top: 4px; }

    /* Sections */
    .section { padding: 16px 24px; border-bottom: 1px solid var(--border); }
    .section:last-of-type { border-bottom: none; }
    .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 12px; }

    /* Decision */
    .question { font-size: 14px; color: var(--text); margin-bottom: 8px; font-weight: 500; }
    .recommendation { font-size: 13px; color: var(--text-dim); line-height: 1.5; margin-bottom: 12px; }
    .confidence-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .confidence-label { font-size: 12px; color: var(--text-dim); min-width: 70px; }
    .confidence-bar { flex: 1; height: 6px; background: var(--surface); border-radius: 3px; overflow: hidden; }
    .confidence-fill { display: block; height: 100%; border-radius: 3px; transition: width 0.3s; }
    .confidence-value { font-size: 14px; font-weight: 700; min-width: 40px; text-align: right; }
    .consensus { font-size: 12px; font-weight: 500; }
    .consensus.yes { color: var(--success); }
    .consensus.no { color: var(--warning); }

    /* Crypto */
    .crypto-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .crypto-label { font-size: 12px; color: var(--text-dim); min-width: 90px; padding-top: 2px; }
    code.hash { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 11px; color: var(--accent); background: var(--surface); padding: 4px 8px; border-radius: 4px; word-break: break-all; cursor: pointer; line-height: 1.5; }
    code.hash:hover { background: var(--border); }

    .hash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin-bottom: 12px; }
    .hash-item { background: var(--surface); padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
    .hash-item:hover { background: var(--border); }
    .hash-key { display: block; font-size: 11px; color: var(--text-dim); margin-bottom: 2px; text-transform: capitalize; }
    .hash-value { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--accent); word-break: break-all; }
    .hash-algo { font-size: 9px; color: var(--text-dim); float: right; margin-top: 2px; }

    .sig-details { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .sig-algo, .sig-provider { font-size: 11px; background: var(--surface); padding: 2px 8px; border-radius: 4px; color: var(--text-dim); }
    .sig-value { font-family: monospace; font-size: 10px; color: var(--text-dim); }
    .unsigned-label { font-size: 12px; color: var(--warning); font-style: italic; }

    /* Verify */
    .verify-section { text-align: center; }
    .verify-result { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
    .verify-result.valid { background: #052e16; }
    .verify-result.invalid { background: #450a0a; }
    .verify-icon { font-size: 28px; }
    .verify-result.valid .verify-icon { color: var(--success); }
    .verify-result.invalid .verify-icon { color: var(--danger); }
    .verify-details { text-align: left; font-size: 13px; line-height: 1.6; }
    .verify-time { font-size: 11px; color: var(--text-dim); }
    .verify-btn { background: var(--accent); color: #000; border: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    .verify-btn:hover { opacity: 0.9; }
    .verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .openssl-hint { margin-top: 12px; }
    .openssl-hint code { font-size: 10px; color: var(--text-dim); background: var(--surface); padding: 6px 12px; border-radius: 4px; display: inline-block; word-break: break-all; }

    /* Frameworks */
    .framework-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { font-size: 11px; padding: 3px 10px; border-radius: 4px; background: var(--surface); color: var(--text-dim); border: 1px solid var(--border); }

    /* Agents */
    .agents-list { display: flex; flex-direction: column; gap: 8px; }
    .agent-row { background: var(--surface); padding: 12px; border-radius: 8px; }
    .agent-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .agent-name { font-size: 13px; font-weight: 600; }
    .agent-role { font-size: 11px; color: var(--text-dim); background: var(--bg); padding: 1px 6px; border-radius: 3px; }
    .agent-confidence { font-size: 12px; font-weight: 700; margin-left: auto; }
    .agent-statement { font-size: 12px; color: var(--text-dim); line-height: 1.5; }

    /* Footer */
    .footer { display: flex; justify-content: space-between; padding: 12px 24px; font-size: 11px; color: var(--text-dim); background: var(--surface); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dcii-evidence-viewer': DciiEvidenceViewer;
  }
}
