/**
 * Comprehensive Error Handling Tests
 * Tests network failures, timeouts, authentication errors, and edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../components/dcii-evidence-viewer.js';
import '../components/cendia-pii-scanner.js';
import '../components/council-status-badge.js';
import type { DciiEvidenceViewer } from '../components/dcii-evidence-viewer.js';
import type { CendiaPiiScanner } from '../components/cendia-pii-scanner.js';
import type { CouncilStatusBadge } from '../components/council-status-badge.js';

// Mock fetch for error testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Error Handling - Network Failures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('evidence viewer handles 404 not found', async () => {
    mockFetch.mockRejectedValueOnce(new Error('HTTP 404'));
    
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'nonexistent';
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    expect(root.querySelector('.error')?.textContent).toContain('Decision packet not found');
  });

  it('evidence viewer handles 403 authentication error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Access denied - check API key'));
    
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'test-123';
    el.apiKey = 'invalid-key';
    document.body.appendChild(el);
    await el.updateComplete;

    const root = el.shadowRoot!;
    expect(root.querySelector('.error')?.textContent).toContain('Access denied');
  });

  it('evidence viewer handles 500 server error with retry', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Server error (500) - retrying...'));
    mockFetch.mockRejectedValueOnce(new Error('Server error (500) - retrying...'));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: MOCK_PACKET })
    });

    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'test-123';
    el.retryAttempts = 3;
    document.body.appendChild(el);
    await el.updateComplete;

    // Wait for retries
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(el.shadowRoot!.querySelector('.error')).toBeNull();
  });

  it('PII scanner handles rate limiting', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Rate limit exceeded - please wait'));
    
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('textarea')!;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));

    // Wait for scan
    await new Promise(resolve => setTimeout(resolve, 100));

    const root = el.shadowRoot!;
    expect(root.querySelector('.error')?.textContent).toContain('Rate limit exceeded');
  });

  it('PII scanner handles authentication failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Authentication failed - check API key'));
    
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    el.apiKey = 'invalid';
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('textarea')!;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    const root = el.shadowRoot!;
    expect(root.querySelector('.error')?.textContent).toContain('Authentication failed');
  });

  it('council badge handles WebSocket connection failure', async () => {
    const mockWebSocket = vi.fn();
    mockWebSocket.mockImplementation(() => {
      const error = new Error('WebSocket connection failed');
      throw error;
    });
    // Add required WebSocket constants
    (mockWebSocket as any).CONNECTING = 0;
    (mockWebSocket as any).OPEN = 1;
    (mockWebSocket as any).CLOSING = 2;
    (mockWebSocket as any).CLOSED = 3;
    global.WebSocket = mockWebSocket as any;

    const el = document.createElement('council-status-badge') as CouncilStatusBadge;
    el.wsUrl = 'wss://api.test.com';
    el.deliberationId = 'delib-123';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('WebSocket connection error');
  });
});

describe('Error Handling - Timeouts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('evidence viewer handles fetch timeout', async () => {
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => {
        setTimeout(() => reject(new DOMException('AbortError')), 100);
      })
    );

    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://slow-api.test.com';
    el.packetId = 'test-123';
    document.body.appendChild(el);
    await el.updateComplete;

    // Wait for timeout
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(el.shadowRoot!.querySelector('.error')).toBeTruthy();
  });

  it('PII scanner handles scan timeout', async () => {
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => {
        setTimeout(() => reject(new DOMException('AbortError')), 100);
      })
    );

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://slow-api.test.com';
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('textarea')!;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(el.shadowRoot!.querySelector('.error')).toBeTruthy();
  });
});

describe('Error Handling - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('evidence viewer handles malformed JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Unexpected token in JSON');
      }
    });

    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'test-123';
    document.body.appendChild(el);
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.shadowRoot!.querySelector('.error')).toBeTruthy();
  });

  it('PII scanner handles empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    document.body.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('textarea')!;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(el.shadowRoot!.querySelector('.status')?.textContent).toContain('No PII detected');
  });

  it('council badge handles missing WebSocket URL', async () => {
    const el = document.createElement('council-status-badge') as CouncilStatusBadge;
    el.deliberationId = 'delib-123';
    // No wsUrl set
    document.body.appendChild(el);
    await el.updateComplete;

    // Should not throw error, just not connect
    expect(el.shadowRoot!.querySelector('.error')).toBeNull();
  });
});

describe('Error Events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('evidence viewer emits dcii-error event on failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    el.apiUrl = 'https://api.test.com';
    el.packetId = 'test-123';
    document.body.appendChild(el);
    await el.updateComplete;

    const errorSpy = vi.fn();
    el.addEventListener('dcii-error', errorSpy);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(errorSpy).toHaveBeenCalled();
    const event = errorSpy.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toHaveProperty('error');
    expect(event.detail).toHaveProperty('type');
  });

  it('PII scanner emits pii-scan-error event on failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API error'));
    
    const el = document.createElement('cendia-pii-scanner') as CendiaPiiScanner;
    el.apiUrl = 'https://api.test.com';
    document.body.appendChild(el);
    await el.updateComplete;

    const errorSpy = vi.fn();
    el.addEventListener('pii-scan-error', errorSpy);

    const input = el.shadowRoot!.querySelector('textarea')!;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(errorSpy).toHaveBeenCalled();
    const event = errorSpy.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toHaveProperty('error');
    expect(event.detail).toHaveProperty('input');
  });

  it('council badge emits WebSocket error events', async () => {
    const mockWebSocket = vi.fn();
    mockWebSocket.mockImplementation(() => ({
      close: vi.fn(),
      send: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: 3, // CLOSED
      code: 1006,
      reason: 'Connection failed'
    }));
    // Add required WebSocket constants
    (mockWebSocket as any).CONNECTING = 0;
    (mockWebSocket as any).OPEN = 1;
    (mockWebSocket as any).CLOSING = 2;
    (mockWebSocket as any).CLOSED = 3;
    global.WebSocket = mockWebSocket as any;

    const el = document.createElement('council-status-badge') as CouncilStatusBadge;
    el.wsUrl = 'wss://api.test.com';
    el.deliberationId = 'delib-123';
    document.body.appendChild(el);
    await el.updateComplete;

    const wsErrorSpy = vi.fn();
    el.addEventListener('council-ws-error', wsErrorSpy);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wsErrorSpy).toHaveBeenCalled();
  });
});

// Mock data for tests
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
