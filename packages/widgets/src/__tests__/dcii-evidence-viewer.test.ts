/**
 * Tests — <dcii-evidence-viewer>
 *
 * Verifies rendering, attribute binding, and interaction for the
 * DCII Evidence Viewer Web Component.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../components/dcii-evidence-viewer.js';
import type { DciiEvidenceViewer, EvidencePacket } from '../components/dcii-evidence-viewer.js';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const MOCK_PACKET: EvidencePacket = {
  id: 'pkt-test-001',
  runId: 'RUN-TEST-ABC12345',
  version: 1,
  question: 'Should we proceed with the $1.7B CRE acquisition?',
  recommendation: 'Proceed with enhanced due diligence and additional environmental assessment.',
  confidence: 0.82,
  confidenceBounds: { lower: 0.72, upper: 0.92 },
  consensusReached: true,
  artifactHashes: {
    question: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    context: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    recommendation: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  },
  merkleRoot: 'f0e1d2c3b4a5f0e1d2c3b4a5f0e1d2c3b4a5f0e1d2c3b4a5f0e1d2c3b4a5f0e1',
  signature: {
    algorithm: 'Ed25519',
    keyId: 'key-governance-001',
    signature: 'deadbeefcafebabe1234567890abcdef',
    provider: 'local-kms',
    signedAt: '2026-04-09T12:00:00Z',
  },
  agentContributions: [
    {
      agentId: 'cfo-agent',
      agentName: 'CFO Agent',
      agentRole: 'Financial Analysis',
      phase: 'analysis',
      statement: 'The acquisition presents significant financial risk at current valuations.',
      confidence: 0.78,
      timestamp: '2026-04-09T11:55:00Z',
    },
    {
      agentId: 'ciso-agent',
      agentName: 'CISO Agent',
      agentRole: 'Security Assessment',
      phase: 'analysis',
      statement: 'Cybersecurity posture of the target is adequate with minor remediation needed.',
      confidence: 0.85,
      timestamp: '2026-04-09T11:56:00Z',
    },
  ],
  regulatoryFrameworks: ['EU AI Act', 'NIST AI RMF', 'ISO 42001'],
  createdAt: '2026-04-09T12:00:00Z',
  retentionUntil: '2033-04-09T12:00:00Z',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createElement(attrs: Record<string, unknown> = {}): Promise<DciiEvidenceViewer> {
  const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
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

function shadow(el: DciiEvidenceViewer): ShadowRoot {
  return el.shadowRoot!;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('dcii-evidence-viewer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get('dcii-evidence-viewer')).toBeDefined();
  });

  it('renders empty state when no packet is provided', async () => {
    const el = await createElement();
    const root = shadow(el);
    expect(root.querySelector('.empty')).toBeTruthy();
    expect(root.textContent).toContain('No packet loaded');
  });

  it('renders packet data when packet prop is set', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.header')).toBeTruthy();
    expect(root.textContent).toContain('RUN-TEST-ABC12345');
    expect(root.textContent).toContain('DCII Evidence Packet');
  });

  it('displays the decision question and recommendation', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.question')?.textContent).toContain('$1.7B CRE acquisition');
    expect(root.querySelector('.recommendation')?.textContent).toContain('enhanced due diligence');
  });

  it('renders confidence score with correct percentage', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.confidence-value')?.textContent).toContain('82%');
  });

  it('shows consensus status', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    const consensus = root.querySelector('.consensus');
    expect(consensus?.textContent).toContain('Consensus reached');
    expect(consensus?.classList.contains('yes')).toBe(true);
  });

  it('renders Merkle root hash', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    const merkle = root.querySelector('.merkle-row code.hash');
    expect(merkle?.textContent).toContain('f0e1d2c3b4a5');
  });

  it('renders artifact hash grid', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    const hashItems = root.querySelectorAll('.hash-item');
    expect(hashItems.length).toBe(3); // question, context, recommendation
  });

  it('shows signature details when signed', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.signature-row')).toBeTruthy();
    expect(root.textContent).toContain('Ed25519');
    expect(root.textContent).toContain('local-kms');
  });

  it('shows unsigned label when no signature', async () => {
    const unsignedPacket = { ...MOCK_PACKET, signature: undefined };
    const el = await createElement({ packet: unsignedPacket });
    const root = shadow(el);

    expect(root.querySelector('.unsigned-label')).toBeTruthy();
    expect(root.textContent).toContain('Unsigned');
  });

  it('renders regulatory framework tags', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    const tags = root.querySelectorAll('.tag');
    expect(tags.length).toBe(3);
    expect(root.textContent).toContain('EU AI Act');
    expect(root.textContent).toContain('NIST AI RMF');
    expect(root.textContent).toContain('ISO 42001');
  });

  it('hides agent contributions by default', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.agents-list')).toBeNull();
  });

  it('shows agent contributions when show-agents is set', async () => {
    const el = await createElement({ packet: MOCK_PACKET, 'show-agents': '' });
    const root = shadow(el);

    const agents = root.querySelectorAll('.agent-row');
    expect(agents.length).toBe(2);
    expect(root.textContent).toContain('CFO Agent');
    expect(root.textContent).toContain('CISO Agent');
  });

  it('renders compact mode with badge', async () => {
    const el = await createElement({ packet: MOCK_PACKET, compact: '' });
    const root = shadow(el);

    expect(root.querySelector('.compact')).toBeTruthy();
    expect(root.querySelector('.badge')).toBeTruthy();
    expect(root.querySelector('.header')).toBeNull(); // full view not rendered
  });

  it('supports light theme', async () => {
    const el = await createElement({ packet: MOCK_PACKET, theme: 'light' });
    const root = shadow(el);

    expect(root.querySelector('.light')).toBeTruthy();
  });

  it('renders verify button when api-url and packet-id are set', async () => {
    const el = document.createElement('dcii-evidence-viewer') as DciiEvidenceViewer;
    // Set packet prop first to avoid fetch race in jsdom
    el.packet = MOCK_PACKET;
    document.body.appendChild(el);
    await el.updateComplete;

    // Now set api-url and packet-id (verify button depends on these)
    el.setAttribute('api-url', 'https://app.datacendia.com/api/v1');
    el.setAttribute('packet-id', 'pkt-test-001');
    await el.updateComplete;
    // Wait for any re-render triggered by attribute changes
    await el.updateComplete;

    const root = shadow(el);
    const btn = root.querySelector('.verify-btn');
    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain('Verify Integrity');
  });

  it('renders openssl verification hint', async () => {
    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    expect(root.querySelector('.openssl-hint code')?.textContent).toContain('openssl dgst -sha256');
  });

  it('copies hash to clipboard on click', async () => {
    const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.assign(navigator, { clipboard: mockClipboard });

    const el = await createElement({ packet: MOCK_PACKET });
    const root = shadow(el);

    const merkleHash = root.querySelector('.merkle-row code.hash') as HTMLElement;
    merkleHash?.click();

    expect(mockClipboard.writeText).toHaveBeenCalledWith(MOCK_PACKET.merkleRoot);
  });
});
