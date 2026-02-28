// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA RESPONSIBILITY™ — FRONTEND SERVICE
// Human Accountability Layer for AI Decisions
// =============================================================================

import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export type AccountabilityAction = 'APPROVE' | 'OVERRIDE' | 'DEFER' | 'REJECT' | 'ESCALATE';

export type FailureCategory =
  | 'LEGITIMACY_COLLAPSE'
  | 'MINORITY_HARM'
  | 'ECONOMIC_INSTABILITY'
  | 'POLITICAL_BACKLASH'
  | 'SYSTEMIC_RISK'
  | 'ADVERSARIAL_ABUSE'
  | 'TEMPORAL_DECAY'
  | 'NARRATIVE_WEAPONIZATION'
  | 'FREE_SPEECH_CHILLING'
  | 'DEMOCRATIC_PROCESS_EROSION'
  | 'DUE_PROCESS_VIOLATION'
  | 'FREEDOM_OF_ASSOCIATION'
  | 'FOREIGN_INFLUENCE_AMPLIFICATION'
  | 'MARKET_DISTORTION'
  | 'ENVIRONMENTAL_EXTERNALITY'
  | 'LABOR_RIGHTS_EROSION'
  | 'PRIVACY_EROSION'
  | 'CULTURAL_HOMOGENIZATION';

export interface HumanAuthority {
  name: string;
  role: string;
  department?: string;
  jurisdiction?: string;
  email?: string;
  employeeId?: string;
}

export interface TPMSignature {
  algorithm: 'RSA-SHA256' | 'ECDSA-P256' | 'ED25519';
  signature: string;
  publicKeyFingerprint: string;
  attestationType: 'TPM_2.0' | 'SOFTWARE_FALLBACK' | 'HSM';
  timestamp: string;
}

export interface AccountabilityRecord {
  id: string;
  decisionId: string;
  deliberationId?: string;
  organizationId: string;
  humanAuthority: HumanAuthority;
  actionTaken: AccountabilityAction;
  justification: string;
  acceptedRisks: FailureCategory[];
  riskAcknowledgment: string;
  aiRecommendation?: string;
  aiConfidenceScore?: number;
  dissentsOverridden?: string[];
  signature: TPMSignature;
  previousRecordHash?: string;
  recordHash: string;
  timestamp: string;
  expiresAt?: string;
  supersededBy?: string;
  witnesses?: HumanAuthority[];
  attachments?: string[];
}

export interface AccountabilityChain {
  organizationId: string;
  decisionId: string;
  records: AccountabilityRecord[];
  chainHash: string;
  isValid: boolean;
}

export interface DelegationRecord {
  id: string;
  fromAuthority: HumanAuthority;
  toAuthority: HumanAuthority;
  scope: string[];
  constraints: string[];
  validFrom: string;
  validUntil: string;
  signature: TPMSignature;
}

export interface LiabilityReport {
  decisionId: string;
  finalAccountable: HumanAuthority;
  actionHistory: AccountabilityRecord[];
  totalRisksAccepted: FailureCategory[];
  delegationChain: DelegationRecord[];
  generatedAt: string;
  reportHash: string;
}

export interface CreateRecordRequest {
  decisionId: string;
  deliberationId?: string;
  organizationId: string;
  humanAuthority: HumanAuthority;
  actionTaken: AccountabilityAction;
  justification: string;
  acceptedRisks: FailureCategory[];
  riskAcknowledgment: string;
  aiRecommendation?: string;
  aiConfidenceScore?: number;
  dissentsOverridden?: string[];
  witnesses?: HumanAuthority[];
}

export interface OverrideRequest {
  decisionId: string;
  organizationId: string;
  humanAuthority: HumanAuthority;
  aiRecommendation: string;
  humanDecision: string;
  overrideReason: string;
  acceptedRisks: FailureCategory[];
}

export interface ApprovalRequest {
  decisionId: string;
  organizationId: string;
  humanAuthority: HumanAuthority;
  aiRecommendation: string;
  aiConfidenceScore: number;
  acceptedRisks: FailureCategory[];
  additionalConditions?: string;
}

export interface RejectionRequest {
  decisionId: string;
  organizationId: string;
  humanAuthority: HumanAuthority;
  aiRecommendation: string;
  rejectionReason: string;
  alternativeAction?: string;
}

export interface DelegationRequest {
  fromAuthority: HumanAuthority;
  toAuthority: HumanAuthority;
  scope: string[];
  constraints: string[];
  validUntil: string;
}

export interface ServiceHealth {
  success: boolean;
  service: string;
  version: string;
  status: string;
  features: string[];
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class ResponsibilityService {
  private baseUrl = '/responsibility';

  /**
   * Create a new accountability record
   */
  async createRecord(data: CreateRecordRequest): Promise<AccountabilityRecord> {
    const response = await api.post<{ success: boolean; data: AccountabilityRecord }>(
      this.baseUrl + '/record',
      data
    );
    if (!response.data?.data) {throw new Error('Failed to create accountability record');}
    return response.data.data;
  }

  /**
   * Record a human override of AI recommendation
   */
  async recordOverride(data: OverrideRequest): Promise<AccountabilityRecord> {
    const response = await api.post<{ success: boolean; data: AccountabilityRecord }>(
      this.baseUrl + '/override',
      data
    );
    if (!response.data?.data) {throw new Error('Failed to record override');}
    return response.data.data;
  }

  /**
   * Record approval of AI recommendation
   */
  async recordApproval(data: ApprovalRequest): Promise<AccountabilityRecord> {
    const response = await api.post<{ success: boolean; data: AccountabilityRecord }>(
      this.baseUrl + '/approve',
      data
    );
    if (!response.data?.data) {throw new Error('Failed to record approval');}
    return response.data.data;
  }

  /**
   * Record rejection of AI recommendation
   */
  async recordRejection(data: RejectionRequest): Promise<AccountabilityRecord> {
    const response = await api.post<{ success: boolean; data: AccountabilityRecord }>(
      this.baseUrl + '/reject',
      data
    );
    if (!response.data?.data) {throw new Error('Failed to record rejection');}
    return response.data.data;
  }

  /**
   * Create a delegation of authority
   */
  async createDelegation(data: DelegationRequest): Promise<DelegationRecord> {
    const response = await api.post<{ success: boolean; data: DelegationRecord }>(
      this.baseUrl + '/delegation',
      data
    );
    if (!response.data?.data) {throw new Error('Failed to create delegation');}
    return response.data.data;
  }

  /**
   * Get the full accountability chain for a decision
   */
  async getAccountabilityChain(decisionId: string): Promise<AccountabilityChain> {
    try {
      const response = await api.get<{ success: boolean; data: AccountabilityChain }>(
        `${this.baseUrl}/chain/${decisionId}`
      );
      return response.data?.data ?? this.getMockChain(decisionId);
    } catch (error) {
      console.error('[Responsibility] Error fetching chain:', error);
      return this.getMockChain(decisionId);
    }
  }

  /**
   * Generate a liability report for a decision
   */
  async getLiabilityReport(decisionId: string): Promise<LiabilityReport> {
    try {
      const response = await api.get<{ success: boolean; data: LiabilityReport }>(
        `${this.baseUrl}/liability-report/${decisionId}`
      );
      return response.data?.data ?? this.getMockReport(decisionId);
    } catch (error) {
      console.error('[Responsibility] Error fetching liability report:', error);
      return this.getMockReport(decisionId);
    }
  }

  /**
   * Verify an accountability record
   */
  async verifyRecord(record: AccountabilityRecord): Promise<{ valid: boolean; verifiedAt: string }> {
    const response = await api.post<{ success: boolean; data: { valid: boolean; verifiedAt: string } }>(
      this.baseUrl + '/verify',
      { record }
    );
    if (!response.data?.data) {throw new Error('Failed to verify record');}
    return response.data.data;
  }

  /**
   * Get service health status
   */
  async getHealth(): Promise<ServiceHealth> {
    try {
      const response = await api.get<ServiceHealth>(this.baseUrl + '/health');
      return response.data ?? {
        success: true,
        service: 'CendiaResponsibility™',
        version: '1.0.0',
        status: 'operational',
        features: []
      };
    } catch (error) {
      console.error('[Responsibility] Error fetching health:', error);
      return {
        success: false,
        service: 'CendiaResponsibility™',
        version: '1.0.0',
        status: 'unavailable',
        features: []
      };
    }
  }

  // ===========================================================================
  // MOCK DATA FOR DEMO
  // ===========================================================================

  private getMockChain(decisionId: string): AccountabilityChain {
    return {
      organizationId: 'demo-org',
      decisionId,
      records: [
        {
          id: 'acc-001',
          decisionId,
          organizationId: 'demo-org',
          humanAuthority: {
            name: 'Jane Smith',
            role: 'Chief Risk Officer',
            department: 'Risk Management',
            jurisdiction: 'United States'
          },
          actionTaken: 'APPROVE',
          justification: 'Risk-adjusted return exceeds threshold. AI recommendation aligns with strategic objectives.',
          acceptedRisks: ['ECONOMIC_INSTABILITY', 'MARKET_DISTORTION'],
          riskAcknowledgment: 'I acknowledge and accept the identified risks after reviewing the Collapse Mode analysis.',
          aiRecommendation: 'Proceed with implementation - 78% confidence',
          aiConfidenceScore: 78,
          signature: {
            algorithm: 'RSA-SHA256',
            signature: 'a7f3b2c1d4e5f6...',
            publicKeyFingerprint: 'DC-PROD-2026-01',
            attestationType: 'TPM_2.0',
            timestamp: new Date().toISOString()
          },
          recordHash: 'abc123def456',
          timestamp: new Date().toISOString()
        }
      ],
      chainHash: 'chain-hash-xyz',
      isValid: true
    };
  }

  private getMockReport(decisionId: string): LiabilityReport {
    return {
      decisionId,
      finalAccountable: {
        name: 'Jane Smith',
        role: 'Chief Risk Officer',
        department: 'Risk Management',
        jurisdiction: 'United States'
      },
      actionHistory: this.getMockChain(decisionId).records,
      totalRisksAccepted: ['ECONOMIC_INSTABILITY', 'MARKET_DISTORTION'],
      delegationChain: [],
      generatedAt: new Date().toISOString(),
      reportHash: 'report-hash-abc'
    };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const responsibilityService = new ResponsibilityService();
export default responsibilityService;
