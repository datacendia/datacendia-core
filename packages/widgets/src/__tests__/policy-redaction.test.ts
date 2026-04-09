/**
 * Policy-Based Redaction Tests
 * Tests GDPR, HIPAA, and custom policy edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../components/cendia-pii-scanner.js';
import type { CendiaPiiScanner } from '../components/cendia-pii-scanner.js';
import type { PIIScanResult } from '../components/cendia-pii-scanner.js';

// Mock fetch for policy testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Policy-Based Redaction - GDPR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('redacts all GDPR-required PII types', async () => {
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'person_name', value: 'John Smith', confidence: 0.95, redacted: '[REDACTED_GDPR]', startIndex: 0, endIndex: 10 },
        { type: 'email', value: 'john.smith@example.com', confidence: 0.98, redacted: '[REDACTED_GDPR]', startIndex: 12, endIndex: 34 },
        { type: 'phone', value: '555-867-5309', confidence: 0.92, redacted: '[REDACTED_GDPR]', startIndex: 36, endIndex: 47 },
        { type: 'address', value: '123 Main St, City, State', confidence: 0.88, redacted: '[REDACTED_GDPR]', startIndex: 49, endIndex: 73 },
        { type: 'date_of_birth', value: '01/15/1985', confidence: 0.94, redacted: '[REDACTED_GDPR]', startIndex: 75, endIndex: 85 },
        { type: 'financial_id', value: 'ACC123456789', confidence: 0.96, redacted: '[REDACTED_GDPR]', startIndex: 87, endIndex: 99 }
      ],
      types: ['person_name', 'email', 'phone', 'address', 'date_of_birth', 'financial_id'],
      originalText: 'John Smith, john.smith@example.com, 555-867-5309, 123 Main St, City, State, 01/15/1985, ACC123456789',
      redactedText: '[REDACTED_GDPR], [REDACTED_GDPR], [REDACTED_GDPR], [REDACTED_GDPR], [REDACTED_GDPR], [REDACTED_GDPR], [REDACTED_GDPR]',
      scanDurationMs: 150,
      policy: 'gdpr'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = mockResult.originalText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const status = el.shadowRoot!.querySelector('.status')!;
    expect(status.textContent).toContain('GDPR policy');
    
    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe(mockResult.redactedText);
  });

  it('handles overlapping PII patterns correctly', async () => {
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'email', value: 'john.smith@company.com', confidence: 0.98, redacted: '[REDACTED_GDPR]', startIndex: 15, endIndex: 37 },
        { type: 'person_name', value: 'John Smith', confidence: 0.95, redacted: '[REDACTED_GDPR]', startIndex: 8, endIndex: 18 }
      ],
      types: ['email', 'person_name'],
      originalText: 'Contact John Smith at john.smith@company.com',
      redactedText: 'Contact [REDACTED_GDPR] at [REDACTED_GDPR]',
      scanDurationMs: 120,
      policy: 'gdpr'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = mockResult.originalText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe(mockResult.redactedText);
  });
});

describe('Policy-Based Redaction - HIPAA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('redacts all HIPAA-required PII types', async () => {
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'person_name', value: 'Jane Doe', confidence: 0.95, redacted: '[REDACTED_HIPAA]' },
        { type: 'email', value: 'jane.doe@hospital.com', confidence: 0.98, redacted: '[REDACTED_HIPAA]' },
        { type: 'phone', value: '212-555-0123', confidence: 0.92, redacted: '[REDACTED_HIPAA]' },
        { type: 'date_of_birth', value: '03/22/1978', confidence: 0.94, redacted: '[REDACTED_HIPAA]' },
        { type: 'medical_record', value: 'MRN: 123456789', confidence: 0.96, redacted: '[REDACTED_HIPAA]' },
        { type: 'ssn', value: '123-45-6789', confidence: 0.97, redacted: '[REDACTED_HIPAA]' },
        { type: 'drivers_license', value: 'DL: S1234567', confidence: 0.91, redacted: '[REDACTED_HIPAA]' },
        { type: 'address', value: '456 Medical Blvd, Suite 200', confidence: 0.88, redacted: '[REDACTED_HIPAA]' }
      ],
      types: ['person_name', 'email', 'phone', 'date_of_birth', 'medical_record', 'ssn', 'drivers_license', 'address'],
      originalText: 'Patient Jane Doe, jane.doe@hospital.com, 212-555-0123, DOB: 03/22/1978, MRN: 123456789, SSN: 123-45-6789, DL: S1234567, 456 Medical Blvd, Suite 200',
      redactedText: 'Patient [REDACTED_HIPAA], [REDACTED_HIPAA], [REDACTED_HIPAA], DOB: [REDACTED_HIPAA], MRN: [REDACTED_HIPAA], SSN: [REDACTED_HIPAA], DL: [REDACTED_HIPAA], [REDACTED_HIPAA]',
      scanDurationMs: 180,
      policy: 'hipaa'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'hipaa';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = mockResult.originalText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const status = el.shadowRoot!.querySelector('.status')!;
    expect(status.textContent).toContain('HIPAA policy');
    
    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe(mockResult.redactedText);
  });

  it('prioritizes medical record numbers in HIPAA', async () => {
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'medical_record', value: 'MRN123456', confidence: 0.98, redacted: '[REDACTED_HIPAA]' },
        { type: 'financial_id', value: 'ACC789012', confidence: 0.85, redacted: '[REDACTED_HIPAA]' }
      ],
      types: ['medical_record', 'financial_id'],
      originalText: 'MRN123456 and ACC789012',
      redactedText: '[REDACTED_HIPAA] and [REDACTED_HIPAA]',
      scanDurationMs: 100,
      policy: 'hipaa'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'hipaa';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = mockResult.originalText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const detections = el.shadowRoot!.querySelectorAll('.detection');
    expect(detections.length).toBe(2);
    
    // Medical record should appear first (higher priority)
    expect(detections[0].querySelector('.type')?.textContent).toBe('Medical Record');
    expect(detections[1].querySelector('.type')?.textContent).toBe('Financial ID');
  });
});

describe('Policy-Based Redaction - Custom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('uses original redaction values when policy is custom', async () => {
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'email', value: 'admin@company.com', confidence: 0.98, redacted: '[EMAIL_HIDDEN]' },
        { type: 'ssn', value: '123-45-6789', confidence: 0.97, redacted: '[SSN_HIDDEN]' }
      ],
      types: ['email', 'ssn'],
      originalText: 'Contact admin@company.com, SSN: 123-45-6789',
      redactedText: 'Contact [EMAIL_HIDDEN], SSN: [SSN_HIDDEN]',
      scanDurationMs: 110,
      policy: 'custom'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'custom';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = mockResult.originalText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe(mockResult.redactedText);
    
    // Should not show policy name for custom
    const status = el.shadowRoot!.querySelector('.status')!;
    expect(status.textContent).not.toContain('policy');
  });
});

describe('Policy-Based Redaction - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('handles empty text with policy set', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const status = el.shadowRoot!.querySelector('.status')!;
    expect(status.textContent).toContain('No PII detected');
  });

  it('handles text with no PII under different policies', async () => {
    const policies = ['gdpr', 'hipaa', 'custom'];
    
    for (const policy of policies) {
      const mockResult: PIIScanResult = {
        hasPII: false,
        detections: [],
        types: [],
        originalText: 'This is just regular text with no personal information.',
        redactedText: 'This is just regular text with no personal information.',
        scanDurationMs: 50,
        policy: policy
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult
      });

      const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
      el.apiUrl = 'https://api.test.com';
      el.policy = policy as any;
      document.body.appendChild(el);
      await el.updateComplete;

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = mockResult.originalText;
      textarea.dispatchEvent(new Event('input'));

      await new Promise(resolve => setTimeout(resolve, 100));

      const status = el.shadowRoot!.querySelector('.status')!;
      expect(status.textContent).toContain('No PII detected');
      
      document.body.removeChild(el);
    }
  });

  it('handles policy switching during scan', async () => {
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    // Start with GDPR
    const gdprResult: PIIScanResult = {
      hasPII: true,
      detections: [{ type: 'email', value: 'test@example.com', confidence: 0.98, redacted: '[REDACTED_GDPR]' }],
      types: ['email'],
      originalText: 'test@example.com',
      redactedText: '[REDACTED_GDPR]',
      scanDurationMs: 100,
      policy: 'gdpr'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => gdprResult
    });

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = 'test@example.com';
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    let redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe('[REDACTED_GDPR]');

    // Switch to HIPAA
    el.policy = 'hipaa';
    await el.updateComplete;

    const hipaaResult: PIIScanResult = {
      hasPII: true,
      detections: [{ type: 'email', value: 'test@example.com', confidence: 0.98, redacted: '[REDACTED_HIPAA]' }],
      types: ['email'],
      originalText: 'test@example.com',
      redactedText: '[REDACTED_HIPAA]',
      scanDurationMs: 100,
      policy: 'hipaa'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => hipaaResult
    });

    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe('[REDACTED_HIPAA]');
  });

  it('handles malformed policy response gracefully', async () => {
    const mockResult = {
      hasPII: true,
      detections: [{ type: 'email', value: 'test@example.com', confidence: 0.98, redacted: '[REDACTED]' }],
      types: ['email'],
      originalText: 'test@example.com',
      redactedText: '[REDACTED]',
      scanDurationMs: 100,
      // Missing policy field
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = 'test@example.com';
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    // Should still work without policy field
    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe('[REDACTED]');
  });

  it('handles very long text with multiple PII instances', async () => {
    const longText = 'Contact John Smith at john.smith@example.com or 555-867-5309. '.repeat(50);
    const mockResult: PIIScanResult = {
      hasPII: true,
      detections: [
        { type: 'person_name', value: 'John Smith', confidence: 0.95, redacted: '[REDACTED_GDPR]' },
        { type: 'email', value: 'john.smith@example.com', confidence: 0.98, redacted: '[REDACTED_GDPR]' },
        { type: 'phone', value: '555-867-5309', confidence: 0.92, redacted: '[REDACTED_GDPR]' }
      ],
      types: ['person_name', 'email', 'phone'],
      originalText: longText,
      redactedText: longText.replace(/John Smith/g, '[REDACTED_GDPR]').replace(/john\.smith@example\.com/g, '[REDACTED_GDPR]').replace(/555-867-5309/g, '[REDACTED_GDPR]'),
      scanDurationMs: 500,
      policy: 'gdpr'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.policy = 'gdpr';
    document.body.appendChild(el);
    await el.updateComplete;

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = longText;
    textarea.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 200));

    const redacted = el.shadowRoot!.querySelector('.redacted-text')!;
    expect(redacted.textContent).toBe(mockResult.redactedText);
    
    // Should show detection count
    const status = el.shadowRoot!.querySelector('.status')!;
    expect(status.textContent).toContain('150 PII detections');
  });
});
