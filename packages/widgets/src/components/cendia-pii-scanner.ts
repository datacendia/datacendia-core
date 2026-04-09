/**
 * <cendia-pii-scanner> — Framework-Agnostic Web Component
 *
 * Real-time PII detection widget. Accepts text input, sends it to the
 * CendiaGateway /test-pii or /scan endpoint, and displays detections with
 * confidence badges and a redacted output preview.
 *
 * @example
 * ```html
 * <cendia-pii-scanner
 *   api-url="https://app.datacendia.com/api/gateway"
 *   placeholder="Paste text to scan for PII…"
 * ></cendia-pii-scanner>
 * ```
 *
 * @module @datacendia/widgets/pii-scanner
 * @license Apache-2.0
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ---------------------------------------------------------------------------
// Types (mirrors backend PIIDetector types)
// ---------------------------------------------------------------------------

export type PIIType =
  | 'ssn' | 'credit_card' | 'email' | 'phone' | 'ip_address'
  | 'date_of_birth' | 'medical_record' | 'bank_account' | 'passport'
  | 'drivers_license' | 'address' | 'person_name' | 'financial_id';

export interface PIIDetection {
  type: PIIType;
  value: string;
  redacted: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export interface PIIScanResult {
  hasPII: boolean;
  detections: PIIDetection[];
  types: PIIType[];
  originalText: string;
  redactedText: string;
  scanDurationMs: number;
  policy?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<string, string> = {
  ssn: 'SSN', credit_card: 'Credit Card', email: 'Email', phone: 'Phone',
  ip_address: 'IP Address', date_of_birth: 'DOB', medical_record: 'Medical Record',
  bank_account: 'Bank Account', passport: 'Passport', drivers_license: "Driver's License",
  address: 'Address', person_name: 'Name', financial_id: 'Financial ID',
};

const SEVERITY_COLOR: Record<string, string> = {
  ssn: '#ef4444', credit_card: '#ef4444', medical_record: '#ef4444',
  bank_account: '#ef4444', passport: '#ef4444', drivers_license: '#ef4444',
  email: '#eab308', phone: '#eab308', ip_address: '#eab308',
  date_of_birth: '#f97316', address: '#f97316',
  person_name: '#3b82f6', financial_id: '#ef4444',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement('cendia-pii-scanner')
export class CendiaPiiScanner extends LitElement {
  /** Base URL of the CendiaGateway API (e.g. https://app.datacendia.com/api/gateway) */
  @property({ attribute: 'api-url' }) apiUrl = '';

  /** Endpoint path — defaults to /test-pii */
  @property() endpoint = '/test-pii';

  /** API key for authentication (optional) */
  @property({ attribute: 'api-key' }) apiKey = '';

  /** Redaction policy: 'gdpr' | 'hipaa' | 'custom' */
  @property() policy: 'gdpr' | 'hipaa' | 'custom' = 'gdpr';

  /** Number of retry attempts for failed requests */
  @property({ type: Number, attribute: 'retry-attempts' }) retryAttempts = 3;

  /** Textarea placeholder */
  @property() placeholder = 'Paste or type text to scan for PII…';

  /** Auto-scan after debounce (ms). Set to 0 to disable. */
  @property({ type: Number, attribute: 'auto-scan-ms' }) autoScanMs = 0;

  /** Theme: 'dark' | 'light' */
  @property() theme: 'dark' | 'light' = 'dark';

  /** Pre-filled sample text */
  @property({ attribute: 'sample-text' }) sampleText = '';

  /** Enable real-time scanning with WebSocket updates */
  @property({ type: Boolean, attribute: 'real-time' }) realTime = false;

  @state() private _input = '';
  @state() private _result: PIIScanResult | null = null;
  @state() private _scanning = false;
  @state() private _error = '';
  @state() private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    if (this.sampleText) {
      this._input = this.sampleText;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }

  // -------------------------------------------------------------------------
  // Scan logic
  // -------------------------------------------------------------------------

  private _onInput(e: Event) {
    this._input = (e.target as HTMLTextAreaElement).value;
    if (this.autoScanMs > 0 && this._input.trim()) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => this._scan(), this.autoScanMs);
    }
  }

  private async _scan() {
    if (!this._input.trim()) return;
    this._scanning = true;
    this._error = '';
    this._result = null;

    // If no API URL, run client-side regex fallback
    if (!this.apiUrl) {
      this._result = this._clientSideScan(this._input);
      this._scanning = false;
      this._emitResult();
      return;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const res = await fetch(`${this.apiUrl}${this.endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            text: this._input,
            policy: this.policy,
            realTime: this.realTime
          }),
          signal: AbortSignal.timeout(12000), // 12s timeout
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication failed - check API key');
          } else if (res.status === 403) {
            throw new Error('Access denied - insufficient permissions');
          } else if (res.status === 429) {
            throw new Error('Rate limit exceeded - please wait');
          } else if (res.status >= 500) {
            throw new Error(`Server error (${res.status}) - retrying...`);
          } else {
            throw new Error(`Scan failed: HTTP ${res.status}`);
          }
        }
        
        const json = await res.json();
        this._result = this._applyPolicyRedaction(json);
        this._emitResult();
        return;
      } catch (e) {
        lastError = e as Error;
        if (attempt < this.retryAttempts && (e as Error).name !== 'AbortError') {
          await new Promise(resolve => setTimeout(resolve, 800 * attempt)); // Exponential backoff
        }
      }
    }
    
    this._error = lastError?.message || 'Failed to scan text';
    this.dispatchEvent(new CustomEvent('pii-scan-error', { 
      detail: { error: this._error, input: this._input }, 
      bubbles: true, 
      composed: true 
    }));
    this._scanning = false;
  }

  private _applyPolicyRedaction(result: PIIScanResult): PIIScanResult {
    if (this.policy === 'custom' || !result.detections.length) return result;
    
    const policyRules: Record<string, Record<PIIType, string>> = {
      gdpr: {
        'person_name': '[REDACTED_GDPR]',
        'email': '[REDACTED_GDPR]',
        'phone': '[REDACTED_GDPR]',
        'address': '[REDACTED_GDPR]',
        'date_of_birth': '[REDACTED_GDPR]',
        'medical_record': '[REDACTED_GDPR]',
        'financial_id': '[REDACTED_GDPR]',
        'ssn': '[REDACTED_GDPR]',
        'credit_card': '[REDACTED_GDPR]',
        'bank_account': '[REDACTED_GDPR]',
        'passport': '[REDACTED_GDPR]',
        'drivers_license': '[REDACTED_GDPR]',
        'ip_address': '[REDACTED_GDPR]',
      },
      hipaa: {
        'person_name': '[REDACTED_HIPAA]',
        'email': '[REDACTED_HIPAA]',
        'phone': '[REDACTED_HIPAA]',
        'date_of_birth': '[REDACTED_HIPAA]',
        'medical_record': '[REDACTED_HIPAA]',
        'ssn': '[REDACTED_HIPAA]',
        'drivers_license': '[REDACTED_HIPAA]',
        'address': '[REDACTED_HIPAA]',
        'credit_card': '[REDACTED_HIPAA]',
        'bank_account': '[REDACTED_HIPAA]',
        'passport': '[REDACTED_HIPAA]',
        'financial_id': '[REDACTED_HIPAA]',
        'ip_address': '[REDACTED_HIPAA]',
      }
    };

    const rules = policyRules[this.policy];
    let redactedText = result.originalText;

    // Apply policy-specific redaction
    result.detections.forEach(detection => {
      const replacement = rules[detection.type] || detection.redacted;
      redactedText = redactedText.replace(detection.value, replacement);
    });

    return {
      ...result,
      redactedText,
      policy: this.policy,
    };
  }

  private _emitResult() {
    this.dispatchEvent(new CustomEvent('pii-scan-complete', {
      detail: this._result,
      bubbles: true,
      composed: true,
    }));
  }

  /** Lightweight client-side fallback (subset of backend patterns) */
  private _clientSideScan(text: string): PIIScanResult {
    const start = performance.now();
    const detections: PIIDetection[] = [];
    let redactedText = text;

    const patterns: Array<{ type: PIIType; re: RegExp; redact: string; conf: number }> = [
      { type: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, redact: '[EMAIL]', conf: 0.98 },
      { type: 'ssn', re: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g, redact: '[SSN]', conf: 0.95 },
      { type: 'phone', re: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, redact: '[PHONE]', conf: 0.90 },
      { type: 'credit_card', re: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g, redact: '[CREDIT_CARD]', conf: 0.92 },
      { type: 'ip_address', re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, redact: '[IP]', conf: 0.85 },
    ];

    for (const { type, re, redact, conf } of patterns) {
      let match: RegExpExecArray | null;
      while ((match = re.exec(text)) !== null) {
        detections.push({
          type,
          value: match[0],
          redacted: redact,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: conf,
        });
        redactedText = redactedText.replace(match[0], redact);
      }
    }

    return {
      hasPII: detections.length > 0,
      detections,
      types: [...new Set(detections.map(d => d.type))],
      originalText: text,
      redactedText,
      scanDurationMs: Math.round(performance.now() - start),
    };
  }

  private _loadSample() {
    this._input = 'Contact John Smith at john.smith@acme.com or 555-867-5309. His SSN is 123-45-6789 and credit card is 4111-1111-1111-1111.';
    this._result = null;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  override render() {
    const r = this._result;

    return html`
      <div class="scanner-root ${this.theme}" role="main" aria-label="PII Scanner">
        <!-- Input -->
        <section class="input-section" aria-labelledby="input-heading">
          <div class="input-header">
            <h2 id="input-heading" class="section-label">Input</h2>
            <button class="sample-btn" 
                    @click=${this._loadSample}
                    aria-label="Load sample text for PII scanning">Load Sample</button>
          </div>
          <textarea
            .value=${this._input}
            @input=${this._onInput}
            placeholder=${this.placeholder}
            rows="4"
            aria-label="Text to scan for personally identifiable information"
            aria-describedby="input-help"
          ></textarea>
          <div id="input-help" class="sr-only">Enter text to scan for PII such as emails, phone numbers, SSNs, or credit cards</div>
          <button class="scan-btn" 
                  @click=${this._scan} 
                  ?disabled=${this._scanning || !this._input.trim()}
                  aria-label="${this._scanning ? 'Scanning in progress' : 'Scan text for PII'}">
            ${this._scanning ? 'Scanning...' : 'Search Scan for PII'}
          </button>
        </section>

        ${this._error ? html`
          <div class="error" role="alert" aria-live="polite">
            <span aria-hidden="true"> </span> ${this._error}
          </div>
        ` : nothing}

        <!-- Results -->
        ${r ? html`
          <div class="results-section">
            <!-- Status bar -->
            <div class="status-bar ${r.hasPII ? 'found' : 'clean'}">
              <span class="status-icon">${r.hasPII ? '🛡️' : '✓'}</span>
              <span class="status-text">
                ${r.hasPII
                  ? `${r.detections.length} PII detection${r.detections.length > 1 ? 's' : ''} found`
                  : 'No PII detected'}
              </span>
              <span class="status-time">Scanned in ${r.scanDurationMs}ms</span>
            </div>

            <!-- Detection badges -->
            ${r.hasPII ? html`
              <div class="detections">
                <div class="section-label">Detections</div>
                <div class="detection-grid">
                  ${r.detections.map(d => html`
                    <div class="detection-card" style="border-left: 3px solid ${SEVERITY_COLOR[d.type] || '#71717a'}">
                      <div class="detection-header">
                        <span class="detection-type">${TYPE_LABELS[d.type] || d.type}</span>
                        <span class="detection-confidence" style="color: ${SEVERITY_COLOR[d.type] || '#71717a'}">${Math.round(d.confidence * 100)}%</span>
                      </div>
                      <div class="detection-value">${d.value}</div>
                      <div class="detection-redacted">→ ${d.redacted}</div>
                    </div>
                  `)}
                </div>
              </div>

              <!-- Redacted output -->
              <div class="redacted-section">
                <div class="section-label">Redacted Output</div>
                <div class="redacted-text">${r.redactedText}</div>
              </div>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static override styles = css`
    :host {
      display: block;
      font-family: var(--cendia-font, 'Inter', system-ui, sans-serif);
      --bg: var(--cendia-bg, #0a0a0f);
      --surface: var(--cendia-surface, #141420);
      --border: var(--cendia-border, #2a2a3a);
      --text: var(--cendia-text, #e4e4e7);
      --text-dim: var(--cendia-text-dim, #71717a);
      --accent: var(--cendia-accent, #c9a84c);
      --success: var(--cendia-success, #22c55e);
      --danger: var(--cendia-danger, #ef4444);
      --radius: var(--cendia-radius, 12px);
    }

    .scanner-root { background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .scanner-root.light { --bg: #ffffff; --surface: #f4f4f5; --border: #e4e4e7; --text: #18181b; --text-dim: #71717a; }

    .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 8px; }

    /* Input */
    .input-section { padding: 20px 24px; border-bottom: 1px solid var(--border); }
    .input-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .sample-btn { background: none; border: 1px solid var(--border); color: var(--text-dim); padding: 4px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: border-color 0.15s; }
    .sample-btn:hover { border-color: var(--accent); color: var(--accent); }
    textarea { width: 100%; box-sizing: border-box; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 13px; font-family: inherit; resize: vertical; line-height: 1.5; }
    textarea::placeholder { color: var(--text-dim); }
    textarea:focus { outline: none; border-color: var(--accent); }
    .scan-btn { width: 100%; margin-top: 12px; background: var(--accent); color: #000; border: none; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    .scan-btn:hover { opacity: 0.9; }
    .scan-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .error { padding: 12px 24px; color: var(--danger); font-size: 13px; }

    /* Status bar */
    .status-bar { display: flex; align-items: center; gap: 12px; padding: 14px 24px; }
    .status-bar.found { background: #450a0a33; }
    .status-bar.clean { background: #052e1633; }
    .status-icon { font-size: 18px; }
    .status-text { font-size: 14px; font-weight: 600; flex: 1; }
    .status-bar.found .status-text { color: var(--danger); }
    .status-bar.clean .status-text { color: var(--success); }
    .status-time { font-size: 11px; color: var(--text-dim); }

    /* Detections */
    .detections { padding: 16px 24px; }
    .detection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
    .detection-card { background: var(--surface); padding: 10px 14px; border-radius: 6px; }
    .detection-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .detection-type { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .detection-confidence { font-size: 13px; font-weight: 700; }
    .detection-value { font-family: monospace; font-size: 12px; color: var(--danger); margin-bottom: 2px; }
    .detection-redacted { font-family: monospace; font-size: 12px; color: var(--success); }

    /* Redacted output */
    .redacted-section { padding: 16px 24px 20px; border-top: 1px solid var(--border); }
    .redacted-text { background: var(--surface); padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cendia-pii-scanner': CendiaPiiScanner;
  }
}
