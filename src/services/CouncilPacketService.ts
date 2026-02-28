// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL DECISION PACKET SERVICE (Frontend)
// Real API calls for cryptographically-signed decision packets - NO FAKES
// =============================================================================

import { api } from '../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface SignatureResult {
  signature: string;
  algorithm: string;
  keyId: string;
  timestamp: string;
  provider: string;
}

export interface EvidenceCitation {
  id: string;
  sourceType: 'document' | 'database' | 'api' | 'retrieval' | 'user_input';
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  content: string;
  relevanceScore: number;
  retrievedAt: string;
  hash: string;
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  agentRole: string;
  phase: string;
  statement: string;
  confidence: number;
  citations: string[];
  toolCalls: string[];
  timestamp: string;
  signature?: SignatureResult;
}

export interface Dissent {
  id: string;
  agentId: string;
  agentName: string;
  reason: string;
  severity: 'advisory' | 'formal_objection' | 'blocking';
  evidence: string[];
  timestamp: string;
  resolved: boolean;
  resolution?: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, unknown>;
  result?: unknown;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  success: boolean;
  error?: string;
}

export interface DecisionPacket {
  id: string;
  runId: string;
  version: number;
  organizationId: string;
  sessionId: string;
  userId?: string;
  question: string;
  context?: string;
  recommendation: string;
  confidence: number;
  confidenceBounds: { lower: number; upper: number };
  keyAssumptions: string[];
  thresholds: Record<string, number>;
  conditionsForChange: string[];
  citations: EvidenceCitation[];
  agentContributions: AgentContribution[];
  dissents: Dissent[];
  consensusReached: boolean;
  toolCalls: ToolCall[];
  approvals: Array<{
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    comment?: string;
    timestamp: string;
    signature?: SignatureResult;
  }>;
  policyGates: Array<{
    id: string;
    policyId: string;
    policyName: string;
    status: string;
    evaluatedAt: string;
    details?: string;
  }>;
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
  artifactHashes: Record<string, string>;
  merkleRoot: string;
  signature?: SignatureResult;
  regulatoryFrameworks: string[];
  retentionUntil: string;
  exportedAt?: string;
}

export interface BuildPacketRequest {
  deliberationId: string;
  regulatoryFrameworks?: string[];
  retentionYears?: number;
}

export interface VerificationResult {
  packetId: string;
  runId: string;
  integrityValid: boolean;
  signatureValid: boolean;
  hasSignature: boolean;
  merkleRoot: string;
  verifiedAt: string;
}

export interface PublicKeyInfo {
  fingerprint: string;
  algorithm: string;
  keySpec: string;
}

// =============================================================================
// API SERVICE
// =============================================================================

const BASE_URL = '/council-packets';

export const councilPacketApi = {
  /**
   * Build a decision packet from a completed deliberation
   */
  async buildPacket(request: BuildPacketRequest): Promise<DecisionPacket> {
    const response = await api.post<{ success: boolean; data: DecisionPacket }>(
      `${BASE_URL}/build`,
      request
    );
    if (!response.data?.data) {throw new Error('Failed to build packet');}
    return response.data.data;
  },

  /**
   * Sign a decision packet with KMS
   */
  async signPacket(packetId: string): Promise<DecisionPacket> {
    const response = await api.post<{ success: boolean; data: DecisionPacket }>(
      `${BASE_URL}/${packetId}/sign`
    );
    if (!response.data?.data) {throw new Error('Failed to sign packet');}
    return response.data.data;
  },

  /**
   * Verify a decision packet's signature and integrity
   */
  async verifyPacket(packetId: string): Promise<VerificationResult> {
    const response = await api.post<{ success: boolean; data: VerificationResult }>(
      `${BASE_URL}/${packetId}/verify`
    );
    if (!response.data?.data) {throw new Error('Failed to verify packet');}
    return response.data.data;
  },

  /**
   * Get a decision packet by ID
   */
  async getPacket(packetId: string): Promise<DecisionPacket> {
    const response = await api.get<{ success: boolean; data: DecisionPacket }>(
      `${BASE_URL}/${packetId}`
    );
    if (!response.data?.data) {throw new Error('Packet not found');}
    return response.data.data;
  },

  /**
   * Export a decision packet as JSON file
   */
  async exportPacket(packetId: string): Promise<Blob> {
    const response = await api.get<Blob>(
      `${BASE_URL}/${packetId}/export`,
      { responseType: 'blob' }
    );
    return response.data as Blob;
  },

  /**
   * Get packets for a deliberation
   */
  async getPacketsByDeliberation(deliberationId: string): Promise<DecisionPacket[]> {
    const response = await api.get<{ success: boolean; data: DecisionPacket[] }>(
      `${BASE_URL}/by-deliberation/${deliberationId}`
    );
    return response.data?.data || [];
  },

  /**
   * Get public key fingerprint for verification
   */
  async getPublicKey(): Promise<PublicKeyInfo> {
    const response = await api.get<{ success: boolean; data: PublicKeyInfo }>(
      `${BASE_URL}/public-key`
    );
    if (!response.data?.data) {throw new Error('Failed to get public key');}
    return response.data.data;
  },

  /**
   * Sign data directly with the KMS (for individual agent signatures)
   */
  async signData(data: string): Promise<SignatureResult> {
    const response = await api.post<{ success: boolean; data: SignatureResult }>(
      '/kms/sign',
      { data }
    );
    if (!response.data?.data) {throw new Error('Failed to sign data');}
    return response.data.data;
  },

  /**
   * Verify a signature
   */
  async verifySignature(data: string, signature: string): Promise<boolean> {
    const response = await api.post<{ success: boolean; data: { valid: boolean } }>(
      '/kms/verify',
      { data, signature }
    );
    return response.data?.data?.valid || false;
  },
};

export default councilPacketApi;
