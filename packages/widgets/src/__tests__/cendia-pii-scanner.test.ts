/**
 * Tests — <cendia-pii-scanner>
 *
 * Verifies rendering, client-side PII detection fallback, and interaction
 * for the CendiaGateway PII Scanner Web Component.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '../components/cendia-pii-scanner.js';
import type { CendiaPiiScanner } from '../components/cendia-pii-scanner.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createElement(attrs: Record<string, unknown> = {}): Promise<CendiaPiiScanner> {
  const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
  for (const [key, val] of Object.entries(attrs)) {
    if (typeof val === 'object') {
      (el as any)[key] = val;
    } else {
      el.setAttribute(key, String(val));
    }
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function shadow(el: CendiaPiiScanner): ShadowRoot {
  return el.shadowRoot!;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('cendia-pii-scanner', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get('cendia-pii-scanner')).toBeDefined();
  });

  it('renders input section with textarea and scan button', async () => {
    const el = await createElement();
    const root = shadow(el);

    expect(root.querySelector('textarea')).toBeTruthy();
    expect(root.querySelector('.scan-btn')).toBeTruthy();
  });

  it('shows placeholder text', async () => {
    const el = await createElement({ placeholder: 'Enter text here' });
    const root = shadow(el);

    const textarea = root.querySelector('textarea');
    expect(textarea?.getAttribute('placeholder')).toBe('Enter text here');
  });

  it('shows Load Sample button', async () => {
    const el = await createElement();
    const root = shadow(el);

    const sampleBtn = root.querySelector('.sample-btn');
    expect(sampleBtn).toBeTruthy();
    expect(sampleBtn?.textContent).toContain('Load Sample');
  });

  it('loads sample text when Load Sample is clicked', async () => {
    const el = await createElement();
    const root = shadow(el);

    const sampleBtn = root.querySelector('.sample-btn') as HTMLElement;
    sampleBtn?.click();
    await el.updateComplete;

    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.value).toContain('john.smith@acme.com');
    expect(textarea?.value).toContain('123-45-6789');
  });

  it('disables scan button when input is empty', async () => {
    const el = await createElement();
    const root = shadow(el);

    const btn = root.querySelector('.scan-btn') as HTMLButtonElement;
    expect(btn?.disabled).toBe(true);
  });

  it('runs client-side scan when no api-url is set', async () => {
    const el = await createElement();
    const root = shadow(el);

    // Load sample text
    const sampleBtn = root.querySelector('.sample-btn') as HTMLElement;
    sampleBtn?.click();
    await el.updateComplete;

    // Click scan
    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    // Should show results
    expect(root.querySelector('.status-bar')).toBeTruthy();
    expect(root.querySelector('.status-bar.found')).toBeTruthy();
  });

  it('detects email addresses in client-side mode', async () => {
    const el = await createElement({ 'sample-text': 'Contact me at test@example.com' });
    const root = shadow(el);

    // Scan
    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(root.textContent).toContain('Email');
    expect(root.textContent).toContain('98%');
  });

  it('detects SSN in client-side mode', async () => {
    const el = await createElement({ 'sample-text': 'SSN: 123-45-6789' });
    const root = shadow(el);

    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(root.textContent).toContain('SSN');
    expect(root.textContent).toContain('95%');
  });

  it('detects phone numbers in client-side mode', async () => {
    const el = await createElement({ 'sample-text': 'Call 555-867-5309' });
    const root = shadow(el);

    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(root.textContent).toContain('Phone');
  });

  it('shows redacted output after scan', async () => {
    const el = await createElement({ 'sample-text': 'Email: test@example.com' });
    const root = shadow(el);

    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    const redacted = root.querySelector('.redacted-text');
    expect(redacted?.textContent).toContain('[EMAIL]');
  });

  it('shows clean status when no PII is found', async () => {
    const el = await createElement({ 'sample-text': 'This text has no personal information.' });
    const root = shadow(el);

    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(root.querySelector('.status-bar.clean')).toBeTruthy();
    expect(root.textContent).toContain('No PII detected');
  });

  it('shows scan duration', async () => {
    const el = await createElement({ 'sample-text': 'test@example.com' });
    const root = shadow(el);

    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(root.textContent).toMatch(/Scanned in \d+ms/);
  });

  it('emits pii-scan-complete event', async () => {
    const el = await createElement({ 'sample-text': 'test@example.com' });

    let eventDetail: any = null;
    el.addEventListener('pii-scan-complete', ((e: CustomEvent) => {
      eventDetail = e.detail;
    }) as EventListener);

    const root = shadow(el);
    const scanBtn = root.querySelector('.scan-btn') as HTMLElement;
    scanBtn?.click();
    await el.updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.hasPII).toBe(true);
    expect(eventDetail.detections.length).toBeGreaterThan(0);
  });

  it('supports light theme', async () => {
    const el = await createElement({ theme: 'light' });
    const root = shadow(el);

    expect(root.querySelector('.light')).toBeTruthy();
  });
});
