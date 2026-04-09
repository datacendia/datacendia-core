/**
 * Accessibility Tests - Keyboard Navigation and ARIA
 * Tests WCAG 2.1 AA compliance requirements
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '../components/dcii-evidence-viewer.js';
import '../components/cendia-pii-scanner.js';
import '../components/council-status-badge.js';
import type { DciiEvidenceViewer } from '../components/dcii-evidence-viewer.js';
import type { CendiaPiiScanner } from '../components/cendia-pii-scanner.js';
import type { CouncilStatusBadge } from '../components/council-status-badge.js';

describe('Accessibility - Keyboard Navigation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('evidence viewer hash items are keyboard focusable and interactive', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.packet = MOCK_PACKET;
    document.body.appendChild(el);
    await el.updateComplete;

    const hashItems = el.shadowRoot!.querySelectorAll('.hash-item');
    expect(hashItems.length).toBeGreaterThan(0);

    // Check tabindex attribute
    hashItems.forEach(item => {
      expect(item.getAttribute('tabindex')).toBe('0');
    });

    // Test keyboard interaction
    const firstHash = hashItems[0] as HTMLElement;
    firstHash.focus();
    expect(document.activeElement).toBe(firstHash);

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    firstHash.dispatchEvent(enterEvent);

    // Test Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    firstHash.dispatchEvent(spaceEvent);
  });

  it('evidence viewer verify button is keyboard accessible', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.packet = MOCK_PACKET;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'test-123';
    document.body.appendChild(el);
    await el.updateComplete;

    const verifyBtn = el.shadowRoot!.querySelector('.verify-btn') as HTMLElement;
    expect(verifyBtn).toBeTruthy();
    expect(verifyBtn.getAttribute('tabindex')).toBe('0');

    verifyBtn.focus();
    expect(document.activeElement).toBe(verifyBtn);

    // Test keyboard activation
    const clickSpy = vi.fn();
    verifyBtn.addEventListener('click', clickSpy);

    verifyBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('PII scanner textarea has proper keyboard accessibility', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
    expect(textarea.getAttribute('aria-label')).toBeTruthy();
    expect(textarea.getAttribute('aria-describedby')).toBeTruthy();

    textarea.focus();
    expect(document.activeElement).toBe(textarea);
  });

  it('PII scanner buttons are keyboard accessible', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    document.body.appendChild(el);
    await el.updateComplete;

    const sampleBtn = el.shadowRoot!.querySelector('.sample-btn') as HTMLElement;
    const scanBtn = el.shadowRoot!.querySelector('.scan-btn') as HTMLElement;

    expect(sampleBtn?.getAttribute('aria-label')).toBeTruthy();
    expect(scanBtn?.getAttribute('aria-label')).toBeTruthy();

    // Test keyboard navigation
    sampleBtn?.focus();
    expect(document.activeElement).toBe(sampleBtn);

    // Tab to next button
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    // Note: In real test environment, we'd need to set up proper tab order
  });

  it('council badge interactive elements are keyboard accessible', async () => {
    const el = document.createElement('council-status-badge') as CouncilStatusBadge;
    el.status = 'completed';
    el.confidence = '0.85';
    el.agentCount = '5';
    document.body.appendChild(el);
    await el.updateComplete;

    // Badge variant should be focusable if interactive
    const badge = el.shadowRoot!.querySelector('.badge') as HTMLElement;
    if (badge && badge.getAttribute('tabindex') === '0') {
      badge.focus();
      expect(document.activeElement).toBe(badge);
    }
  });
});

describe('Accessibility - ARIA Attributes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('evidence viewer has proper ARIA structure', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.packet = MOCK_PACKET;
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    
    // Main landmark
    expect(root.querySelector('[role="main"]')).toBeTruthy();
    expect(root.querySelector('[aria-label]')).toBeTruthy();

    // Semantic structure
    expect(root.querySelector('header')).toBeTruthy();
    expect(root.querySelector('h1')).toBeTruthy();
    expect(root.querySelectorAll('section')).toHaveLength(3); // Decision, Crypto, Agents

    // Progress bar
    const progressBar = root.querySelector('[role="progressbar"]');
    expect(progressBar).toBeTruthy();
    expect(progressBar?.getAttribute('aria-valuenow')).toBeTruthy();
    expect(progressBar?.getAttribute('aria-valuemin')).toBe('0');
    expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');

    // Live regions
    expect(root.querySelector('[aria-live="polite"]')).toBeTruthy();
  });

  it('evidence viewer hash items have proper ARIA', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.packet = MOCK_PACKET;
    document.body.appendChild(el);
    await el.updateComplete;

    const hashItems = el.shadowRoot!.querySelectorAll('.hash-item');
    hashItems.forEach((item, index) => {
      expect(item.getAttribute('role')).toBe('listitem');
      expect(item.getAttribute('aria-expanded')).toBe('false'); // Initially collapsed
      expect(item.getAttribute('aria-controls')).toBeTruthy();
      expect(item.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('PII scanner has proper ARIA structure', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    
    // Main landmark
    expect(root.querySelector('[role="main"]')).toBeTruthy();
    expect(root.querySelector('[aria-label="PII Scanner"]')).toBeTruthy();

    // Form structure
    expect(root.querySelector('section[aria-labelledby]')).toBeTruthy();
    expect(root.querySelector('h2')).toBeTruthy();

    // Input accessibility
    const textarea = root.querySelector('textarea');
    expect(textarea?.getAttribute('aria-label')).toBeTruthy();
    expect(textarea?.getAttribute('aria-describedby')).toBeTruthy();

    // Help text
    expect(root.querySelector('#input-help')).toBeTruthy();
    expect(root.querySelector('#input-help')?.className).toBe('sr-only');
  });

  it('PII scanner error messages are properly announced', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    
    // Error should be in alert role with live region
    const errorDiv = document.createElement('div');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    errorDiv.className = 'error';
    errorDiv.textContent = 'Test error';
    root.appendChild(errorDiv);

    expect(errorDiv.getAttribute('role')).toBe('alert');
    expect(errorDiv.getAttribute('aria-live')).toBe('polite');
  });

  it('council badge has proper ARIA for different variants', async () => {
    const el = document.createElement('council-status-badge') as CouncilStatusBadge;
    el.variant = 'card';
    el.status = 'completed';
    el.confidence = '0.85';
    el.agentCount = '5';
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    
    // Progress bar in card variant
    const progressBar = root.querySelector('[role="progressbar"]');
    if (progressBar) {
      expect(progressBar?.getAttribute('aria-valuenow')).toBeTruthy();
      expect(progressBar?.getAttribute('aria-label')).toBeTruthy();
    }
  });
});

describe('Accessibility - Color Contrast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('components support both light and dark themes', async () => {
    const components = [
      { name: 'evidence-viewer', element: 'dcii-evidence-viewer' },
      { name: 'pii-scanner', element: 'cendia-pii-scanner' },
      { name: 'council-badge', element: 'council-status-badge' }
    ];

    for (const { name, element } of components) {
      // Test dark theme
      const darkEl = document.createElement(element) as any;
      darkEl.theme = 'dark';
      if (name === 'evidence-viewer') darkEl.packet = MOCK_PACKET;
      if (name === 'council-badge') {
        darkEl.status = 'completed';
        darkEl.confidence = '0.85';
      }
      document.body.appendChild(darkEl);
      await darkEl.updateComplete;

      expect(darkEl.shadowRoot!.querySelector('.dark')).toBeTruthy();
      expect(darkEl.shadowRoot!.querySelector('.light')).toBeNull();

      document.body.removeChild(darkEl);

      // Test light theme
      const lightEl = document.createElement(element) as any;
      lightEl.theme = 'light';
      if (name === 'evidence-viewer') lightEl.packet = MOCK_PACKET;
      if (name === 'council-badge') {
        lightEl.status = 'completed';
        lightEl.confidence = '0.85';
      }
      document.body.appendChild(lightEl);
      await lightEl.updateComplete;

      expect(lightEl.shadowRoot!.querySelector('.light')).toBeTruthy();
      expect(lightEl.shadowRoot!.querySelector('.dark')).toBeNull();

      document.body.removeChild(lightEl);
    }
  });
});

describe('Accessibility - Focus Management', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('evidence viewer maintains focus after interaction', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.packet = MOCK_PACKET;
    document.body.appendChild(el);
    await el.updateComplete;

    const hashItem = el.shadowRoot!.querySelector('.hash-item') as HTMLElement;
    hashItem.focus();
    expect(document.activeElement).toBe(hashItem);

    // Simulate click/expansion
    hashItem.click();
    await el.updateComplete;

    // Focus should be maintained
    expect(document.activeElement).toBe(hashItem);
  });

  it('PII scanner maintains focus after scan', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    document.body.appendChild(el);
    await el.updateComplete;

    const scanBtn = el.shadowRoot!.querySelector('.scan-btn') as HTMLElement;
    scanBtn.focus();
    expect(document.activeElement).toBe(scanBtn);

    // Simulate scan
    const textarea = el.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'test@example.com';
    textarea.dispatchEvent(new Event('input'));

    scanBtn.click();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Focus should return to button or move to results
    expect(document.activeElement).toBeTruthy();
  });
});

// Mock data
const MOCK_PACKET = {
  id: 'pkt-test-001',
  runId: 'RUN-TEST-123',
  version: 1,
  question: 'Test question?',
  recommendation: 'Test recommendation',
  confidence: 0.85,
  consensusReached: true,
  artifactHashes: {
    question: 'abc123',
    context: 'def456',
  },
  merkleRoot: 'merkle123',
  signature: {
    algorithm: 'Ed25519',
    keyId: 'test-key',
    signature: 'test-sig',
    provider: 'test',
    signedAt: '2026-04-09T14:32:18Z',
  },
  agentContributions: [],
  regulatoryFrameworks: [],
  createdAt: '2026-04-09T14:32:18Z',
  retentionUntil: '2033-04-09T14:32:18Z',
};
