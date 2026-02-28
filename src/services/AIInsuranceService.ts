// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaInsure™ Frontend Service
 * 
 * AI Insurance Integration
 */

import { api } from '@/lib/api/client';

// Types
export type CoverageType = 
  | 'errors_omissions'
  | 'cyber_liability'
  | 'product_liability'
  | 'professional'
  | 'general_liability'
  | 'directors_officers';

export type PolicyStatus = 'quoted' | 'bound' | 'active' | 'expired' | 'cancelled' | 'claimed';
export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface CoverageTypeInfo {
  type: CoverageType;
  name: string;
  description: string;
  basePremium: number;
}

export interface InsuranceQuote {
  id: string;
  organizationId: string;
  coverageType: CoverageType;
  requestedLimit: number;
  premium: number;
  deductible: number;
  riskScore: number;
  riskTier: RiskTier;
  termMonths: number;
  exclusions: string[];
  conditions: string[];
  quotedAt: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  coverageType: CoverageType;
  coverageLimit: number;
  deductible: number;
  premium: number;
  organizationId: string;
  verticalId?: string;
  coveredSystems: string[];
  coveredDecisionTypes: string[];
  effectiveDate: string;
  expirationDate: string;
  status: PolicyStatus;
  riskScore: number;
  riskTier: RiskTier;
  underwritingNotes: string[];
  certificateUrl?: string;
  createdAt: string;
  createdBy: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface DecisionCoverage {
  id: string;
  policyId: string;
  policyNumber: string;
  decisionId: string;
  deliberationId?: string;
  decisionType: string;
  decisionValue: number;
  coverageAmount: number;
  deductible: number;
  premiumAllocation: number;
  riskScore: number;
  riskFactors: RiskFactor[];
  certificateId: string;
  certificateUrl: string;
  coveredAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'claimed';
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  incidentDate: string;
  incidentDescription: string;
  decisionId?: string;
  claimAmount: number;
  claimType: string;
  status: 'filed' | 'under_review' | 'approved' | 'denied' | 'paid' | 'closed';
  filedAt: string;
  resolvedAt?: string;
  approvedAmount?: number;
  denialReason?: string;
  supportingDocuments: string[];
}

export interface CoverageCertificate {
  id: string;
  policyId: string;
  policyNumber: string;
  decisionId?: string;
  insured: string;
  coverageType: CoverageType;
  coverageLimit: number;
  deductible: number;
  effectiveDate: string;
  expirationDate: string;
  verificationCode: string;
  verificationUrl: string;
  qrCode: string;
  hash: string;
  signature: string;
  issuedAt: string;
}

// API Functions
export const AIInsuranceService = {
  async getHealth() {
    const response = await api.get<any>('/api/v1/ai-insurance/health');
    return response.data;
  },

  async getCoverageTypes(): Promise<CoverageTypeInfo[]> {
    const response = await api.get<any>('/api/v1/ai-insurance/coverage-types');
    return response.data.data;
  },

  async requestQuote(params: {
    organizationId: string;
    coverageType: CoverageType;
    requestedLimit: number;
    verticalId?: string;
    coveredSystems?: string[];
    termMonths?: number;
  }): Promise<InsuranceQuote> {
    const response = await api.post<any>('/api/v1/ai-insurance/quotes', params);
    return response.data.data;
  },

  async bindPolicy(params: {
    quoteId: string;
    coveredSystems: string[];
    coveredDecisionTypes: string[];
    createdBy: string;
  }): Promise<InsurancePolicy> {
    const response = await api.post<any>('/api/v1/ai-insurance/policies', params);
    return response.data.data;
  },

  async getPolicy(id: string): Promise<InsurancePolicy> {
    const response = await api.get<any>(`/api/v1/ai-insurance/policies/${id}`);
    return response.data.data;
  },

  async getPoliciesByOrganization(orgId: string): Promise<InsurancePolicy[]> {
    const response = await api.get<any>(`/api/v1/ai-insurance/policies/organization/${orgId}`);
    return response.data.data;
  },

  async coverDecision(params: {
    policyId: string;
    decisionId: string;
    deliberationId?: string;
    decisionType: string;
    decisionValue: number;
    riskFactors?: RiskFactor[];
  }): Promise<DecisionCoverage> {
    const response = await api.post<any>('/api/v1/ai-insurance/cover-decision', params);
    return response.data.data;
  },

  async getCoverageByDecision(decisionId: string): Promise<DecisionCoverage> {
    const response = await api.get<any>(`/api/v1/ai-insurance/coverage/decision/${decisionId}`);
    return response.data.data;
  },

  async fileClaim(params: {
    policyId: string;
    incidentDate: Date;
    incidentDescription: string;
    decisionId?: string;
    claimAmount: number;
    claimType: string;
    supportingDocuments?: string[];
  }): Promise<Claim> {
    const response = await api.post<any>('/api/v1/ai-insurance/claims', {
      ...params,
      incidentDate: params.incidentDate.toISOString(),
    });
    return response.data.data;
  },

  async verifyCertificate(id: string): Promise<{ valid: boolean; certificate?: CoverageCertificate; reason?: string }> {
    const response = await api.get<any>(`/api/v1/ai-insurance/certificates/${id}/verify`);
    return response.data.data;
  },
};

export default AIInsuranceService;
