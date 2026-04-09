import type { Meta, StoryObj } from '@storybook/web-components';
import './dcii-evidence-viewer.js';
import type { DciiEvidenceViewer, EvidencePacket } from './dcii-evidence-viewer.js';

const meta: Meta<DciiEvidenceViewer> = {
  title: 'Components/DciiEvidenceViewer',
  component: 'dcii-evidence-viewer',
  tags: ['autodocs'],
  argTypes: {
    apiUrl: { control: 'text', description: 'Base URL of the Datacendia API' },
    packetId: { control: 'text', description: 'Decision packet ID to load' },
    apiKey: { control: 'text', description: 'API key for authentication' },
    retryAttempts: { control: { type: 'number', min: 0, max: 10, step: 1 }, description: 'Number of retry attempts' },
    showAgents: { control: 'boolean', description: 'Show agent contributions panel' },
    compact: { control: 'boolean', description: 'Compact mode - verification badge only' },
    theme: { control: 'select', options: ['dark', 'light'], description: 'Color theme' },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
          { id: 'aria-labels', enabled: true },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<DciiEvidenceViewer>;

// Sample evidence packet
const SAMPLE_PACKET: EvidencePacket = {
  id: 'pkt-demo-001',
  runId: 'RUN-LR8K42-A3F7E1C9',
  version: 1,
  question: 'Should Meridian Capital proceed with the $1.7B commercial real estate acquisition of Harbor Point Tower?',
  recommendation: 'Proceed with enhanced due diligence. The acquisition presents favorable long-term value but requires additional environmental assessment.',
  confidence: 0.82,
  confidenceBounds: { lower: 0.72, upper: 0.89 },
  consensusReached: true,
  artifactHashes: {
    question: 'a7f3c9b1d4e6f8a2c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1',
    context: 'b8e4d2c6f0a3e5d7c9b1a3f5e7d9c1b3a5f7e9d1c3b5a7f9e1d3c5b7a9f1e3d5',
    recommendation: 'c9f5e3d7a1b4f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c8b0a2f4e6',
  },
  merkleRoot: '9e4a7f2c8b1d5e3a6f9c2b7d4e8a1f5c3b6d9e2a5f8c1b4d7e0a3f6c9b2d5e8',
  signature: {
    algorithm: 'Ed25519',
    keyId: 'key-governance-primary-2026',
    signature: '4d8a2f6c9e1b5d3a7f0c4e8b2d6a9f3c7e1b5d9a3f7c0e4b8d2a6f0c3e7b1d5a9f3c7e1b4d8a2f6c0e4b8d2a6f9c3e7b1d5',
    provider: 'datacendia-kms',
    signedAt: '2026-04-09T14:32:18Z',
  },
  agentContributions: [
    {
      agentId: 'cfo-agent',
      agentName: 'CFO Agent',
      agentRole: 'Financial Analysis',
      phase: 'analysis',
      statement: 'At $1.7B, the cap rate is below the 10-year average. However, below-market rents provide upside.',
      confidence: 0.78,
      timestamp: '2026-04-09T14:28:00Z',
    },
    {
      agentId: 'ciso-agent',
      agentName: 'CISO Agent',
      agentRole: 'Security Assessment',
      phase: 'analysis',
      statement: 'Building management systems use legacy BACnet without encryption. Recommend $2.4M security retrofit.',
      confidence: 0.85,
      timestamp: '2026-04-09T14:29:00Z',
    },
  ],
  regulatoryFrameworks: ['EU AI Act', 'NIST AI RMF', 'ISO 42001'],
  createdAt: '2026-04-09T14:32:18Z',
  retentionUntil: '2033-04-09T14:32:18Z',
};

export const Default: Story = {
  args: {
    packet: SAMPLE_PACKET,
    showAgents: true,
    theme: 'dark',
  },
};

export const Compact: Story = {
  args: {
    packet: SAMPLE_PACKET,
    compact: true,
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    packet: SAMPLE_PACKET,
    showAgents: true,
    theme: 'light',
  },
};

export const Unsigned: Story = {
  args: {
    packet: { ...SAMPLE_PACKET, signature: undefined },
    showAgents: true,
    theme: 'dark',
  },
};

export const LowConfidence: Story = {
  args: {
    packet: { ...SAMPLE_PACKET, confidence: 0.42, consensusReached: false },
    showAgents: true,
    theme: 'dark',
  },
};

export const WithAPI: Story = {
  args: {
    apiUrl: 'https://app.datacendia.com/api/v1',
    packetId: 'pkt-demo-001',
    apiKey: 'demo-key',
    retryAttempts: 3,
    theme: 'dark',
  },
};
