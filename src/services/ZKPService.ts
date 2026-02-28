// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaZKP™ Frontend Service
 * 
 * Zero-Knowledge Proofs for Compliance
 */

import { api } from '@/lib/api/client';

// Types
export type ProofType = 
  | 'compliance'
  | 'fairness'
  | 'accuracy'
  | 'data_governance'
  | 'audit_trail'
  | 'human_oversight'
  | 'consent';

export type ProofStatus = 'generating' | 'valid' | 'invalid' | 'expired' | 'revoked';

export interface ProofTypeInfo {
  type: ProofType;
  description: string;
  requirements: string[];
}

export interface ZKProofRequest {
  id: string;
  type: ProofType;
  claim: string;
  decisionId?: string;
  deliberationId?: string;
  workflowId?: string;
  organizationId: string;
  framework?: string;
  witnessHash: string;
  requestedAt: string;
  requestedBy: string;
}

export interface ZKProof {
  id: string;
  requestId: string;
  type: ProofType;
  proof: string;
  publicInputs: string[];
  commitment: string;
  verificationKey: string;
  status: ProofStatus;
  claim: string;
  framework?: string;
  generatedAt: string;
  expiresAt: string;
  verificationCount: number;
  lastVerifiedAt?: string;
  lastVerifiedBy?: string;
}

export interface ProofVerificationResult {
  valid: boolean;
  proofId: string;
  claim: string;
  verifiedAt: string;
  verifiedBy: string;
  publicInputsMatch: boolean;
  signatureValid: boolean;
  notExpired: boolean;
  notRevoked: boolean;
  certificateId?: string;
  certificateUrl?: string;
}

export interface ComplianceCertificate {
  id: string;
  proofId: string;
  claim: string;
  framework: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  verificationUrl: string;
  qrCode: string;
  hash: string;
  signature: string;
}

// API Functions
export const ZKPService = {
  async getHealth() {
    const response = await api.get<any>('/api/v1/zkp/health');
    return response.data;
  },

  async getProofTypes(): Promise<ProofTypeInfo[]> {
    const response = await api.get<any>('/api/v1/zkp/proof-types');
    return response.data.data;
  },

  async requestProof(params: {
    type: ProofType;
    claim: string;
    decisionId?: string;
    deliberationId?: string;
    workflowId?: string;
    organizationId: string;
    framework?: string;
    privateWitness: Record<string, unknown>;
    requestedBy: string;
  }): Promise<ZKProofRequest> {
    const response = await api.post<any>('/api/v1/zkp/request', params);
    return response.data.data;
  },

  async generateProof(requestId: string): Promise<ZKProof> {
    const response = await api.post<any>(`/api/v1/zkp/generate/${requestId}`);
    return response.data.data;
  },

  async verifyProof(proofId: string, verifiedBy: string): Promise<ProofVerificationResult> {
    const response = await api.post<any>(`/api/v1/zkp/verify/${proofId}`, { verifiedBy });
    return response.data.data;
  },

  async getProof(id: string): Promise<ZKProof> {
    const response = await api.get<any>(`/api/v1/zkp/proofs/${id}`);
    return response.data.data;
  },

  async getProofsByOrganization(orgId: string): Promise<ZKProof[]> {
    const response = await api.get<any>(`/api/v1/zkp/proofs/organization/${orgId}`);
    return response.data.data;
  },

  async revokeProof(proofId: string, reason: string): Promise<void> {
    await api.post<any>(`/api/v1/zkp/revoke/${proofId}`, { reason });
  },

  async getCertificate(id: string): Promise<ComplianceCertificate> {
    const response = await api.get<any>(`/api/v1/zkp/certificates/${id}`);
    return response.data.data;
  },
};

export default ZKPService;
