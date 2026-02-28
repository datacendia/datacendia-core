// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Frontend Service for Football/Soccer DDGI
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import { api } from '../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface Player {
  id?: string;
  name: string;
  dateOfBirth?: string;
  nationality?: string;
  position?: string;
  currentClub?: string;
  contractExpiry?: string;
  marketValue?: number;
}

export interface Club {
  id?: string;
  name: string;
  country?: string;
  league?: string;
  tier?: number;
}

export interface ScoutingAssessment {
  matchesObserved: number;
  videoAnalysisComplete: boolean;
  dataProfile: string;
  characterReferences: number;
  recommendation: 'strong_buy' | 'buy' | 'conditional' | 'pass';
}

export interface Valuation {
  methodology: string;
  marketComparables: string;
  internalValuation: number;
  dataValuation?: number;
  negotiatedFee: number;
  premium: number;
}

export interface Alternative {
  playerName: string;
  reason: string;
  whyNotSelected: string;
}

export interface Approval {
  role: string;
  userId: string;
  userName: string;
  decision: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

export interface ComplianceCheck {
  framework: string;
  status: 'passed' | 'failed' | 'pending' | 'not_applicable';
  notes?: string;
}

export interface TimelineEvent {
  timestamp: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
}

export interface TransferDecision {
  id: string;
  organizationId: string;
  templateId: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lockedAt?: string;
  auditHash?: string;
  transactionType: 'inbound' | 'outbound' | 'loan_out' | 'loan_in';
  player: Player;
  counterpartyClub: Club;
  transferFee: number;
  addOns: number;
  agentFee: number;
  wages?: {
    weekly: number;
    contractLength: number;
    totalValue: number;
  };
  sellOnClause?: number;
  buybackClause?: number;
  scoutingAssessment: ScoutingAssessment;
  valuation: Valuation;
  alternativesConsidered: Alternative[];
  approvals: Approval[];
  complianceChecks: ComplianceCheck[];
  evidenceAttachments: Array<{
    id: string;
    type: string;
    filename: string;
    uploadedAt: string;
    uploadedBy: string;
    hash: string;
  }>;
  timeline: TimelineEvent[];
}

export interface ContractDecision {
  id: string;
  organizationId: string;
  templateId: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  contractType: 'new' | 'renewal' | 'termination';
  player: Player;
  currentContract?: {
    weeklyWage: number;
    expiryDate: string;
    remainingValue: number;
  };
  proposedContract: {
    weeklyWage: number;
    lengthYears: number;
    signingBonus?: number;
    loyaltyBonus?: number;
    performanceBonuses?: string;
    releaseClause?: number;
    totalValue: number;
  };
  justification: {
    performanceAssessment: string;
    marketBenchmarking: string;
    strategicRationale: string;
  };
  approvals: Approval[];
  timeline: TimelineEvent[];
}

export interface DecisionTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  requiredFieldsCount: number;
  optionalFieldsCount: number;
  complianceFrameworks: string[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  governingBody: string;
  region: string;
  requirementsCount: number;
}

export interface FFPAssessment {
  decisionId: string;
  assessedAt: string;
  currentBreakEvenPosition: number;
  currentSquadCostRatio: number;
  immediateImpact: {
    cashOutflow: number;
    annualWageCost: number;
    amortizationPerYear: number;
    ffpChargeYear1: number;
  };
  projectedBreakEvenPosition: number;
  projectedSquadCostRatio: number;
  remainingHeadroom: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

// =============================================================================
// SERVICE
// =============================================================================

const BASE_URL = '/api/v1/sports';

export const SportsService = {
  // ---------------------------------------------------------------------------
  // Status & Configuration
  // ---------------------------------------------------------------------------

  async getStatus() {
    const response = await api.get(`${BASE_URL}/status`);
    return response.data as { service: string; version: string; status: string; details: Record<string, unknown> };
  },

  async getTemplates() {
    const response = await api.get(`${BASE_URL}/templates`);
    return response.data as { templates: DecisionTemplate[]; count: number };
  },

  async getTemplate(id: string) {
    const response = await api.get(`${BASE_URL}/templates/${id}`);
    return response.data as { template: DecisionTemplate };
  },

  async getComplianceFrameworks() {
    const response = await api.get(`${BASE_URL}/compliance-frameworks`);
    return response.data as { frameworks: ComplianceFramework[]; count: number };
  },

  async getComplianceFramework(id: string) {
    const response = await api.get(`${BASE_URL}/compliance-frameworks/${id}`);
    return response.data as { framework: ComplianceFramework };
  },

  // ---------------------------------------------------------------------------
  // Transfer Decisions
  // ---------------------------------------------------------------------------

  async createTransferDecision(params: {
    organizationId: string;
    userId: string;
    templateId?: string;
    transactionType?: 'inbound' | 'outbound' | 'loan_out' | 'loan_in';
    player: Player;
    counterpartyClub: Club;
    transferFee?: number;
    addOns?: number;
    agentFee?: number;
  }) {
    const response = await api.post(`${BASE_URL}/transfers`, params);
    return response.data as { decision: TransferDecision };
  },

  async getTransferDecision(id: string) {
    const response = await api.get(`${BASE_URL}/transfers/${id}`);
    return response.data as { decision: TransferDecision };
  },

  async updateTransferDecision(id: string, userId: string, updates: Partial<TransferDecision>) {
    const response = await api.patch(`${BASE_URL}/transfers/${id}`, { userId, ...updates });
    return response.data as { decision: TransferDecision };
  },

  async addScoutingAssessment(id: string, userId: string, assessment: ScoutingAssessment) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/scouting`, { userId, assessment });
    return response.data as { decision: TransferDecision };
  },

  async addValuation(id: string, userId: string, valuation: Valuation) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/valuation`, { userId, valuation });
    return response.data as { decision: TransferDecision };
  },

  async addAlternative(id: string, userId: string, alternative: Alternative) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/alternatives`, { userId, alternative });
    return response.data as { decision: TransferDecision };
  },

  async submitForApproval(id: string, userId: string) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/submit`, { userId });
    return response.data as { decision: TransferDecision };
  },

  async recordApproval(
    id: string,
    userId: string,
    userName: string,
    role: string,
    approved: boolean,
    comments?: string
  ) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/approve`, {
      userId,
      userName,
      role,
      approved,
      comments,
    });
    return response.data as { decision: TransferDecision };
  },

  async completeDecision(id: string, userId: string) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/complete`, { userId });
    return response.data as { decision: TransferDecision };
  },

  async assessFFPImpact(
    id: string,
    currentBreakEvenPosition: number,
    currentSquadCostRatio?: number
  ) {
    const response = await api.post(`${BASE_URL}/transfers/${id}/ffp-assessment`, {
      currentBreakEvenPosition,
      currentSquadCostRatio,
    });
    return response.data as { assessment: FFPAssessment };
  },

  async exportDecisionRecord(id: string) {
    const response = await api.get(`${BASE_URL}/transfers/${id}/export`);
    return response.data as {
      decision: TransferDecision | ContractDecision;
      complianceMapping: Record<string, ComplianceFramework>;
      integrityVerified: boolean;
    };
  },

  // ---------------------------------------------------------------------------
  // Organization Decisions
  // ---------------------------------------------------------------------------

  async getOrganizationDecisions(
    orgId: string,
    options?: { type?: 'transfer' | 'contract'; status?: string; limit?: number }
  ) {
    const params = new URLSearchParams();
    if (options?.type) {params.append('type', options.type);}
    if (options?.status) {params.append('status', options.status);}
    if (options?.limit) {params.append('limit', options.limit.toString());}
    
    const response = await api.get(`${BASE_URL}/organizations/${orgId}/decisions?${params.toString()}`);
    return response.data as { decisions: Array<TransferDecision | ContractDecision>; count: number };
  },

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  formatCurrency(amount: number, currency = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return 'gray';
      case 'pending_approval': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      case 'withdrawn': return 'gray';
      default: return 'gray';
    }
  },

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  },

  getRecommendationLabel(rec: string): string {
    switch (rec) {
      case 'strong_buy': return 'Strong Buy';
      case 'buy': return 'Buy';
      case 'conditional': return 'Conditional';
      case 'pass': return 'Pass';
      default: return rec;
    }
  },
};

export default SportsService;
