/**
 * CendiaGateway™ Browser Extension — Shared Interceptor Logic
 *
 * This file contains the core AI governance logic shared across
 * Chrome, Firefox, Safari, Edge, Brave, and Arc extensions.
 *
 * It monitors AI website forms, intercepts prompt submissions,
 * sends them to CendiaGateway for PII scanning + policy enforcement,
 * and blocks/warns before sensitive data reaches AI providers.
 *
 * @module browser-extension/shared/gateway-interceptor
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

// =============================================================================
// AI SITE CONFIGURATIONS — What to monitor on each AI website
// =============================================================================

const AI_SITES = [
  {
    domain: 'chat.openai.com',
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea, textarea[data-id="root"]',
    submitSelector: 'button[data-testid="send-button"], button[aria-label="Send"]',
    formSelector: 'form',
  },
  {
    domain: 'chatgpt.com',
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea, textarea[data-id="root"]',
    submitSelector: 'button[data-testid="send-button"], button[aria-label="Send"]',
    formSelector: 'form',
  },
  {
    domain: 'claude.ai',
    name: 'Claude',
    inputSelector: '[contenteditable="true"], textarea',
    submitSelector: 'button[aria-label="Send Message"], button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'gemini.google.com',
    name: 'Gemini',
    inputSelector: '.ql-editor, textarea, [contenteditable="true"]',
    submitSelector: 'button[aria-label="Send message"], .send-button',
    formSelector: 'form',
  },
  {
    domain: 'copilot.microsoft.com',
    name: 'Microsoft Copilot',
    inputSelector: '#searchbox, textarea, [contenteditable="true"]',
    submitSelector: 'button[aria-label="Submit"]',
    formSelector: 'form',
  },
  {
    domain: 'www.bing.com',
    name: 'Bing Chat',
    inputSelector: '#searchbox, textarea',
    submitSelector: 'button[aria-label="Submit"]',
    formSelector: 'form',
  },
  {
    domain: 'perplexity.ai',
    name: 'Perplexity',
    inputSelector: 'textarea',
    submitSelector: 'button[aria-label="Submit"], button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'www.perplexity.ai',
    name: 'Perplexity',
    inputSelector: 'textarea',
    submitSelector: 'button[aria-label="Submit"], button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'poe.com',
    name: 'Poe',
    inputSelector: 'textarea',
    submitSelector: 'button[class*="send"]',
    formSelector: 'form',
  },
  {
    domain: 'you.com',
    name: 'You.com',
    inputSelector: 'textarea, input[type="text"]',
    submitSelector: 'button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'pi.ai',
    name: 'Pi',
    inputSelector: 'textarea',
    submitSelector: 'button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'chat.deepseek.com',
    name: 'DeepSeek',
    inputSelector: 'textarea',
    submitSelector: 'button[type="submit"], button[class*="send"]',
    formSelector: 'form',
  },
  {
    domain: 'deepseek.com',
    name: 'DeepSeek',
    inputSelector: 'textarea',
    submitSelector: 'button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'huggingface.co',
    name: 'HuggingFace',
    inputSelector: 'textarea',
    submitSelector: 'button[type="submit"]',
    formSelector: 'form',
  },
  {
    domain: 'aistudio.google.com',
    name: 'Google AI Studio',
    inputSelector: 'textarea, [contenteditable="true"]',
    submitSelector: 'button[aria-label="Run"], button[type="submit"]',
    formSelector: 'form',
  },
];

// =============================================================================
// PII PATTERNS — Client-side pre-screening (fast, before server call)
// =============================================================================

const PII_PATTERNS = {
  ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/,
  credit_card: /\b(?:\d{4}[-\s]?){3}\d{4}\b/,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  phone: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  passport: /\b[A-Z]{1,2}\d{6,9}\b/,
};

// =============================================================================
// CORE INTERCEPTOR CLASS
// =============================================================================

class GatewayInterceptor {
  constructor() {
    this.gatewayUrl = null;
    this.enabled = true;
    this.userId = null;
    this.organizationId = null;
    this.stats = { scanned: 0, blocked: 0, warned: 0, allowed: 0 };
    this.currentSite = null;
    this.observers = [];
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  async init() {
    // Load configuration from extension storage
    const config = await this.loadConfig();
    this.gatewayUrl = config.gatewayUrl || 'http://localhost:3001/api/v1/gateway';
    this.enabled = config.enabled !== false;
    this.userId = config.userId || 'browser-user';
    this.organizationId = config.organizationId || 'default';

    // Detect current AI site
    const hostname = window.location.hostname;
    this.currentSite = AI_SITES.find(s => hostname === s.domain || hostname.endsWith('.' + s.domain));

    if (!this.currentSite) {
      return; // Not an AI site — do nothing
    }

    if (!this.enabled) {
      console.log('[CendiaGateway] Extension disabled by policy');
      return;
    }

    console.log(`[CendiaGateway] Monitoring ${this.currentSite.name} (${hostname})`);
    this.attachInterceptors();
    this.injectBanner();
  }

  // ---------------------------------------------------------------------------
  // FORM INTERCEPTION — Monitor AI site input fields
  // ---------------------------------------------------------------------------

  attachInterceptors() {
    // Strategy: intercept form submissions and button clicks
    // Use MutationObserver to handle dynamically loaded content (SPA)

    const observe = () => {
      this.interceptForms();
      this.interceptButtons();
      this.interceptKeyboard();
    };

    // Initial attach
    observe();

    // Re-attach on DOM changes (SPAs load content dynamically)
    const observer = new MutationObserver(() => {
      observe();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    this.observers.push(observer);
  }

  interceptForms() {
    if (!this.currentSite) return;

    const forms = document.querySelectorAll(this.currentSite.formSelector);
    forms.forEach(form => {
      if (form.dataset.cendiaIntercepted) return;
      form.dataset.cendiaIntercepted = 'true';

      form.addEventListener('submit', async (e) => {
        const text = this.getInputText();
        if (text && text.trim().length > 0) {
          const result = await this.scanAndEnforce(text);
          if (result.blocked) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }
      }, true); // Capture phase — fires before the site's handler
    });
  }

  interceptButtons() {
    if (!this.currentSite) return;

    const buttons = document.querySelectorAll(this.currentSite.submitSelector);
    buttons.forEach(btn => {
      if (btn.dataset.cendiaIntercepted) return;
      btn.dataset.cendiaIntercepted = 'true';

      btn.addEventListener('click', async (e) => {
        const text = this.getInputText();
        if (text && text.trim().length > 0) {
          const result = await this.scanAndEnforce(text);
          if (result.blocked) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }
      }, true);
    });
  }

  interceptKeyboard() {
    // Intercept Enter key in text areas (common submit method)
    document.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const active = document.activeElement;
        if (!active) return;

        const isInput = active.tagName === 'TEXTAREA' ||
          active.getAttribute('contenteditable') === 'true' ||
          active.matches(this.currentSite?.inputSelector || '');

        if (isInput) {
          const text = this.getInputText();
          if (text && text.trim().length > 0) {
            const result = await this.scanAndEnforce(text);
            if (result.blocked) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            }
          }
        }
      }
    }, true);
  }

  // ---------------------------------------------------------------------------
  // TEXT EXTRACTION — Get the current prompt text from the AI site
  // ---------------------------------------------------------------------------

  getInputText() {
    if (!this.currentSite) return '';

    const elements = document.querySelectorAll(this.currentSite.inputSelector);
    for (const el of elements) {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        if (el.value && el.value.trim()) return el.value;
      }
      if (el.getAttribute('contenteditable') === 'true') {
        if (el.textContent && el.textContent.trim()) return el.textContent;
      }
    }
    return '';
  }

  // ---------------------------------------------------------------------------
  // PII SCANNING + POLICY ENFORCEMENT
  // ---------------------------------------------------------------------------

  async scanAndEnforce(text) {
    this.stats.scanned++;

    // Step 1: Fast client-side PII pre-screen
    const clientPII = this.clientSidePIIScan(text);

    // Step 2: If PII found client-side, block immediately (no network round-trip)
    if (clientPII.hasCriticalPII) {
      this.stats.blocked++;
      this.showBlockedNotification(clientPII.types, text);
      this.logInteraction(text, 'block', clientPII.types);
      return { blocked: true, reason: 'Critical PII detected', types: clientPII.types };
    }

    // Step 3: Send to gateway server for full scan + policy evaluation (if configured)
    if (this.gatewayUrl) {
      try {
        const serverResult = await this.serverSideScan(text);
        if (serverResult.blocked) {
          this.stats.blocked++;
          this.showBlockedNotification(serverResult.piiTypes || [], text);
          return { blocked: true, reason: serverResult.reason, types: serverResult.piiTypes };
        }
        if (serverResult.warned) {
          this.stats.warned++;
          this.showWarningNotification(serverResult.reason);
        }
      } catch (err) {
        // Gateway unreachable — fall back to client-side only
        console.warn('[CendiaGateway] Server unreachable, using client-side scan only');
      }
    }

    // Step 4: If PII detected (non-critical), warn but allow
    if (clientPII.hasPII) {
      this.stats.warned++;
      this.showWarningNotification(`PII detected: ${clientPII.types.join(', ')}`);
      this.logInteraction(text, 'warn', clientPII.types);
      return { blocked: false, warned: true, types: clientPII.types };
    }

    this.stats.allowed++;
    this.logInteraction(text, 'allow', []);
    return { blocked: false };
  }

  clientSidePIIScan(text) {
    const types = [];
    const criticalTypes = ['ssn', 'credit_card', 'passport'];
    let hasCriticalPII = false;

    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
      if (pattern.test(text)) {
        types.push(type);
        if (criticalTypes.includes(type)) hasCriticalPII = true;
      }
    }

    return { hasPII: types.length > 0, hasCriticalPII, types };
  }

  async serverSideScan(text) {
    const resp = await fetch(`${this.gatewayUrl}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source: 'browser-extension',
        domain: window.location.hostname,
        userId: this.userId,
        organizationId: this.organizationId,
      }),
    });

    if (!resp.ok) throw new Error(`Gateway returned ${resp.status}`);
    return resp.json();
  }

  // ---------------------------------------------------------------------------
  // UI NOTIFICATIONS — Show block/warn overlays on the AI site
  // ---------------------------------------------------------------------------

  showBlockedNotification(piiTypes, text) {
    const overlay = document.createElement('div');
    overlay.id = 'cendia-gateway-block';
    overlay.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(220,38,38,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
        <div style="background:white;border-radius:12px;padding:40px;max-width:500px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
          <div style="font-size:48px;margin-bottom:16px;">🛡️</div>
          <h2 style="color:#dc2626;margin:0 0 12px;font-size:24px;">CendiaGateway — Request Blocked</h2>
          <p style="color:#374151;margin:0 0 16px;font-size:16px;">
            Your message contains <strong>${piiTypes.join(', ')}</strong> that violates your organization's AI usage policy.
          </p>
          <p style="color:#6b7280;margin:0 0 24px;font-size:14px;">
            Remove the sensitive data and try again. This interaction has been logged.
          </p>
          <button onclick="this.closest('#cendia-gateway-block').remove()" style="background:#dc2626;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:16px;cursor:pointer;font-weight:600;">
            Understood
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Auto-dismiss after 10 seconds
    setTimeout(() => overlay.remove(), 10000);
  }

  showWarningNotification(reason) {
    const banner = document.createElement('div');
    banner.id = 'cendia-gateway-warn';
    banner.innerHTML = `
      <div style="position:fixed;top:16px;right:16px;background:#fbbf24;color:#92400e;padding:16px 24px;border-radius:8px;z-index:999998;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:20px;">⚠️</span>
          <strong>CendiaGateway Warning</strong>
          <button onclick="this.closest('#cendia-gateway-warn').remove()" style="margin-left:auto;background:none;border:none;font-size:18px;cursor:pointer;color:#92400e;">✕</button>
        </div>
        <p style="margin:8px 0 0;font-size:13px;">${reason}</p>
      </div>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 5000);
  }

  // ---------------------------------------------------------------------------
  // GOVERNANCE BANNER — Shows "Governed by CendiaGateway" on AI sites
  // ---------------------------------------------------------------------------

  injectBanner() {
    if (document.getElementById('cendia-gateway-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cendia-gateway-banner';
    banner.innerHTML = `
      <div style="position:fixed;bottom:16px;left:16px;background:rgba(22,163,74,0.9);color:white;padding:8px 16px;border-radius:6px;z-index:999997;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
        <span>🛡️</span>
        <span>Governed by <strong>CendiaGateway™</strong></span>
        <span style="opacity:0.7;">| ${this.currentSite?.name}</span>
      </div>
    `;
    document.body.appendChild(banner);
  }

  // ---------------------------------------------------------------------------
  // LOGGING — Send interaction records to gateway for audit trail
  // ---------------------------------------------------------------------------

  async logInteraction(text, action, piiTypes) {
    if (!this.gatewayUrl) return;

    try {
      await fetch(`${this.gatewayUrl}/browser-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'browser-extension',
          domain: window.location.hostname,
          siteName: this.currentSite?.name,
          userId: this.userId,
          organizationId: this.organizationId,
          action,
          piiTypes,
          promptLength: text.length,
          // Do NOT send the actual prompt text to the log endpoint
          // — that would defeat the purpose of blocking PII
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Fire and forget — don't block on logging failures
    }
  }

  // ---------------------------------------------------------------------------
  // CONFIGURATION
  // ---------------------------------------------------------------------------

  async loadConfig() {
    // Use browser extension storage API (works across Chrome, Firefox, Safari)
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['gatewayUrl', 'enabled', 'userId', 'organizationId'], resolve);
      } else if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.sync.get(['gatewayUrl', 'enabled', 'userId', 'organizationId']).then(resolve);
      } else {
        resolve({});
      }
    });
  }

  async saveConfig(config) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(config, resolve);
      } else if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.sync.set(config).then(resolve);
      } else {
        resolve();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  destroy() {
    this.observers.forEach(o => o.disconnect());
    const block = document.getElementById('cendia-gateway-block');
    const warn = document.getElementById('cendia-gateway-warn');
    const banner = document.getElementById('cendia-gateway-banner');
    if (block) block.remove();
    if (warn) warn.remove();
    if (banner) banner.remove();
  }
}

// =============================================================================
// EXPORTS — Used by browser-specific entry points
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GatewayInterceptor, AI_SITES, PII_PATTERNS };
}
if (typeof window !== 'undefined') {
  window.GatewayInterceptor = GatewayInterceptor;
}
