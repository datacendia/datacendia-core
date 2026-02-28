// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaConstitutionalCourt™ Frontend Service
 * 
 * AI Dispute Resolution with Precedent Tracking
 */

import { api } from '@/lib/api/client';

// Types
export type DisputeStatus = 
  | 'filed' 
  | 'under_review' 
  | 'hearing_scheduled' 
  | 'deliberating' 
  | 'opinion_drafted' 
  | 'resolved' 
  | 'appealed' 
  | 'appeal_resolved';

export type DisputeCategory =
  | 'confidence_conflict'
  | 'methodology_dispute'
  | 'data_interpretation'
  | 'ethical_conflict'
  | 'compliance_disagreement'
  | 'risk_assessment'
  | 'recommendation_conflict';

export interface ConstitutionalPrinciple {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'fairness' | 'transparency' | 'accountability' | 'privacy' | 'accuracy';
  weight: number;
  adoptedAt: string;
}

export interface DisputeParty {
  agentId: string;
  agentName: string;
  role: 'petitioner' | 'respondent';
  position: string;
  confidence: number;
  evidence: string[];
  citations: string[];
}

export interface CourtOpinion {
  id: string;
  caseNumber: string;
  title: string;
  ruling: 'petitioner' | 'respondent' | 'partial_petitioner' | 'partial_respondent' | 'remanded';
  summary: string;
  rationale: string;
  principlesApplied: string[];
  holdings: string[];
  precedentStrength: 'binding' | 'persuasive' | 'distinguishable' | 'overruled';
  draftedAt: string;
  finalizedAt?: string;
  authoringJudge: string;
  hash: string;
  signature?: string;
}

export interface Dispute {
  id: string;
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  status: DisputeStatus;
  petitioner: DisputeParty;
  respondent: DisputeParty;
  deliberationId?: string;
  verticalId?: string;
  organizationId: string;
  filedAt: string;
  hearingAt?: string;
  resolvedAt?: string;
  opinion?: CourtOpinion;
  precedentsApplied: string[];
  appealFiled?: boolean;
  appealReason?: string;
}

export interface PrecedentSearchResult {
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  holdings: string[];
  relevanceScore: number;
  strength: string;
  resolvedAt: string;
}

export interface CourtStatistics {
  totalDisputes: number;
  resolved: number;
  pending: number;
  appealed: number;
  byCategory: Record<DisputeCategory, number>;
  avgResolutionDays: number;
}

// API Functions
export const ConstitutionalCourtService = {
  async getHealth() {
    const response = await api.get<any>('/api/v1/constitutional-court/health');
    return response.data;
  },

  async getPrinciples(): Promise<ConstitutionalPrinciple[]> {
    const response = await api.get<any>('/api/v1/constitutional-court/principles');
    return response.data.data;
  },

  async getStatistics(): Promise<CourtStatistics> {
    const response = await api.get<any>('/api/v1/constitutional-court/statistics');
    return response.data.data;
  },

  async fileDispute(params: {
    title: string;
    category: DisputeCategory;
    petitioner: Omit<DisputeParty, 'role'>;
    respondent: Omit<DisputeParty, 'role'>;
    deliberationId?: string;
    verticalId?: string;
    organizationId: string;
  }): Promise<Dispute> {
    const response = await api.post<any>('/api/v1/constitutional-court/disputes', params);
    return response.data.data;
  },

  async getDispute(id: string): Promise<Dispute> {
    const response = await api.get<any>(`/api/v1/constitutional-court/disputes/${id}`);
    return response.data.data;
  },

  async getDisputeByCaseNumber(caseNumber: string): Promise<Dispute> {
    const response = await api.get<any>(`/api/v1/constitutional-court/disputes/case/${caseNumber}`);
    return response.data.data;
  },

  async getDisputesByOrganization(orgId: string): Promise<Dispute[]> {
    const response = await api.get<any>(`/api/v1/constitutional-court/disputes/organization/${orgId}`);
    return response.data.data;
  },

  async scheduleHearing(disputeId: string, hearingDate: Date): Promise<Dispute> {
    const response = await api.post<any>(`/api/v1/constitutional-court/disputes/${disputeId}/schedule-hearing`, {
      hearingDate: hearingDate.toISOString(),
    });
    return response.data.data;
  },

  async beginDeliberation(disputeId: string): Promise<Dispute> {
    const response = await api.post<any>(`/api/v1/constitutional-court/disputes/${disputeId}/begin-deliberation`);
    return response.data.data;
  },

  async draftOpinion(disputeId: string, params: {
    ruling: CourtOpinion['ruling'];
    summary: string;
    rationale: string;
    holdings: string[];
    principlesApplied?: string[];
    authoringJudge: string;
  }): Promise<CourtOpinion> {
    const response = await api.post<any>(`/api/v1/constitutional-court/disputes/${disputeId}/draft-opinion`, params);
    return response.data.data;
  },

  async resolveDispute(disputeId: string): Promise<Dispute> {
    const response = await api.post<any>(`/api/v1/constitutional-court/disputes/${disputeId}/resolve`);
    return response.data.data;
  },

  async fileAppeal(disputeId: string, reason: string): Promise<Dispute> {
    const response = await api.post<any>(`/api/v1/constitutional-court/disputes/${disputeId}/appeal`, { reason });
    return response.data.data;
  },

  async searchPrecedents(params: {
    category?: DisputeCategory;
    keywords?: string[];
    limit?: number;
  }): Promise<PrecedentSearchResult[]> {
    const response = await api.post<any>('/api/v1/constitutional-court/precedents/search', params);
    return response.data.data;
  },
};

export default ConstitutionalCourtService;
