// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaRegulatorySandbox™ Frontend Service
 * 
 * Test Against Proposed Regulations
 */

import { api } from '@/lib/api/client';

// Types
export type RegulationStatus = 
  | 'proposed' 
  | 'draft' 
  | 'public_comment' 
  | 'final_draft' 
  | 'adopted' 
  | 'effective' 
  | 'amended'
  | 'withdrawn';

export type Jurisdiction = 
  | 'EU' 
  | 'US-Federal' 
  | 'US-California' 
  | 'US-Colorado' 
  | 'US-Virginia' 
  | 'US-Texas'
  | 'US-Connecticut'
  | 'UK' 
  | 'Canada' 
  | 'Australia'
  | 'Singapore'
  | 'Japan'
  | 'China'
  | 'Global';

export interface RegulationRequirement {
  id: string;
  article: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  deadline?: string;
  penalties?: string;
}

export interface ProposedRegulation {
  id: string;
  code: string;
  name: string;
  fullName: string;
  jurisdiction: Jurisdiction;
  status: RegulationStatus;
  proposedDate: string;
  expectedAdoptionDate?: string;
  expectedEffectiveDate?: string;
  publicCommentDeadline?: string;
  summary: string;
  keyRequirements: RegulationRequirement[];
  affectedVerticals: string[];
  affectedAISystems: string[];
  estimatedComplianceCost: string;
  officialUrl?: string;
  lastUpdated: string;
  confidence: number;
}

export interface RequirementTestResult {
  requirementId: string;
  article: string;
  title: string;
  status: 'pass' | 'fail' | 'partial' | 'not_applicable';
  score: number;
  evidence: string;
  gaps: string[];
}

export interface ComplianceGap {
  id: string;
  requirementId: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentState: string;
  requiredState: string;
  affectedComponents: string[];
}

export interface RemediationRecommendation {
  id: string;
  gapId: string;
  title: string;
  description: string;
  priority: number;
  effort: 'low' | 'medium' | 'high' | 'very_high';
  estimatedDays: number;
  dependencies: string[];
}

export interface SandboxTestResult {
  overallScore: number;
  readinessLevel: 'compliant' | 'mostly_compliant' | 'partial' | 'non_compliant';
  requirementResults: RequirementTestResult[];
  gaps: ComplianceGap[];
  recommendations: RemediationRecommendation[];
  estimatedRemediationEffort: string;
  estimatedRemediationCost: string;
  hash: string;
  testedAt: string;
}

export interface SandboxTest {
  id: string;
  name: string;
  description: string;
  regulationId: string;
  regulationName: string;
  requirements: string[];
  decisionId?: string;
  workflowId?: string;
  systemDescription: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  results?: SandboxTestResult;
}

export interface RegulatoryTimeline {
  upcoming: ProposedRegulation[];
  recentlyEffective: ProposedRegulation[];
  inDraft: ProposedRegulation[];
}

// API Functions
export const RegulatorySandboxService = {
  async getHealth() {
    const response = await api.get<any>('/api/v1/regulatory-sandbox/health');
    return response.data;
  },

  async getRegulations(filters?: {
    jurisdiction?: Jurisdiction;
    status?: RegulationStatus;
  }): Promise<ProposedRegulation[]> {
    const params = new URLSearchParams();
    if (filters?.jurisdiction) {params.append('jurisdiction', filters.jurisdiction);}
    if (filters?.status) {params.append('status', filters.status);}
    
    const response = await api.get<any>(`/api/v1/regulatory-sandbox/regulations?${params.toString()}`);
    return response.data.data;
  },

  async getRegulation(id: string): Promise<ProposedRegulation> {
    const response = await api.get<any>(`/api/v1/regulatory-sandbox/regulations/${id}`);
    return response.data.data;
  },

  async getTimeline(): Promise<RegulatoryTimeline> {
    const response = await api.get<any>('/api/v1/regulatory-sandbox/timeline');
    return response.data.data;
  },

  async createTest(params: {
    name: string;
    description?: string;
    regulationId: string;
    requirements?: string[];
    decisionId?: string;
    workflowId?: string;
    systemDescription: string;
  }): Promise<SandboxTest> {
    const response = await api.post<any>('/api/v1/regulatory-sandbox/tests', params);
    return response.data.data;
  },

  async runTest(testId: string): Promise<SandboxTestResult> {
    const response = await api.post<any>(`/api/v1/regulatory-sandbox/tests/${testId}/run`);
    return response.data.data;
  },

  async getTest(id: string): Promise<SandboxTest> {
    const response = await api.get<any>(`/api/v1/regulatory-sandbox/tests/${id}`);
    return response.data.data;
  },

  async getAllTests(): Promise<SandboxTest[]> {
    const response = await api.get<any>('/api/v1/regulatory-sandbox/tests');
    return response.data.data;
  },
};

export default RegulatorySandboxService;
