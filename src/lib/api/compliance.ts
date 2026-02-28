// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance API Client
 * Five Rings of Sovereignty - Frontend API
 */

import { api } from './client';

const API_BASE = '/compliance';

export type ComplianceDomain =
  | 'ethical_ai'
  | 'cybersecurity'
  | 'privacy'
  | 'governance'
  | 'industry';
export type PillarId =
  | 'helm'
  | 'lineage'
  | 'predict'
  | 'flow'
  | 'health'
  | 'guard'
  | 'ethics'
  | 'agents';

export interface ComplianceFramework {
  id: string;
  code: string;
  name: string;
  fullName: string;
  domain: ComplianceDomain;
  description: string;
  version: string;
  jurisdiction: string[];
  industries: string[];
  pillars: PillarId[];
  controlCount: number;
  lastUpdated: string;
  status: 'active' | 'deprecated' | 'draft';
}

export interface Ring {
  ring: number;
  domain: ComplianceDomain;
  name: string;
  description: string;
  frameworks: ComplianceFramework[];
  totalControls: number;
}

export interface ComplianceSummary {
  overallScore: number;
  fiveRings: Ring[];
  findings: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    open: number;
  };
  assessments: {
    total: number;
  };
}

export interface ComplianceAssessment {
  id: string;
  organizationId: string;
  frameworkId: string;
  pillarId: PillarId;
  domain: ComplianceDomain;
  assessmentDate: string;
  assessor: string;
  overallScore: number;
  controlResults: ControlResult[];
  findings: Finding[];
  recommendations: string[];
  nextAssessmentDate: string;
  status: 'in_progress' | 'completed' | 'expired';
}

export interface ControlResult {
  controlId: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  score: number;
  evidence: string[];
  gaps: string[];
  automatedTestResult?: boolean;
  lastTestedAt?: string;
}

export interface Finding {
  id: string;
  controlId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

export interface BundleFile {
  path: string;
  name: string;
  format: 'json' | 'pdf' | 'csv' | 'xlsx' | 'yaml' | 'txt';
  size: number;
  hash: string;
}

export interface ComplianceBundle {
  id: string;
  organizationId: string;
  generatedAt: string;
  generatedBy: string;
  frameworks: string[];
  pillars: PillarId[];
  domains: ComplianceDomain[];
  fileCount: number;
  files: BundleFile[];
  merkleRoot: string;
  bundleHash: string;
  expiresAt: string;
}

// API Functions
export const complianceApi = {
  // Frameworks
  async getFrameworks(filters?: {
    domain?: ComplianceDomain;
    pillar?: PillarId;
    industry?: string;
  }) {
    const params: Record<string, string> = {};
    if (filters?.domain) {
      params.domain = filters.domain;
    }
    if (filters?.pillar) {
      params.pillar = filters.pillar;
    }
    if (filters?.industry) {
      params.industry = filters.industry;
    }

    return api.get<ComplianceFramework[]>(`${API_BASE}/frameworks`, params);
  },

  async getFramework(id: string) {
    return api.get<ComplianceFramework>(`${API_BASE}/frameworks/${id}`);
  },

  // Five Rings
  async getFiveRings() {
    return api.get<{ rings: Ring[] }>(`${API_BASE}/five-rings`);
  },

  // Pillar Mapping
  async getPillarMapping(pillarId: PillarId) {
    return api.get<unknown>(`${API_BASE}/pillars/${pillarId}/mapping`);
  },

  // Assessments
  async runPillarAssessment(organizationId: string, pillarId: PillarId, assessor: string) {
    return api.post<ComplianceAssessment>(`${API_BASE}/assessments/pillar`, {
      organizationId,
      pillarId,
      assessor,
    });
  },

  async runFrameworkAssessment(
    organizationId: string,
    frameworkId: string,
    pillarId: PillarId,
    assessor: string
  ) {
    return api.post<ComplianceAssessment>(`${API_BASE}/assessments/framework`, {
      organizationId,
      frameworkId,
      pillarId,
      assessor,
    });
  },

  async getAssessment(id: string) {
    return api.get<ComplianceAssessment>(`${API_BASE}/assessments/${id}`);
  },

  async getAssessments(
    organizationId: string,
    filters?: { domain?: ComplianceDomain; pillarId?: PillarId }
  ) {
    const params: Record<string, string> = { organizationId };
    if (filters?.domain) {
      params.domain = filters.domain;
    }
    if (filters?.pillarId) {
      params.pillarId = filters.pillarId;
    }

    return api.get<ComplianceAssessment[]>(`${API_BASE}/assessments`, params);
  },

  // Bundles
  async generateBundle(options: {
    organizationId: string;
    generatedBy: string;
    frameworks?: string[];
    pillars?: PillarId[];
    domains?: ComplianceDomain[];
  }) {
    return api.post<ComplianceBundle>(`${API_BASE}/bundles/generate`, options);
  },

  async getBundle(id: string) {
    return api.get<ComplianceBundle>(`${API_BASE}/bundles/${id}`);
  },

  async downloadBundle(id: string) {
    return api.get<unknown>(`${API_BASE}/bundles/${id}/download`);
  },

  async getBundleFile(bundleId: string, filePath: string) {
    return api.get<unknown>(`${API_BASE}/bundles/${bundleId}/files/${filePath}`);
  },

  // Summary
  async getSummary(organizationId: string) {
    return api.get<ComplianceSummary>(`${API_BASE}/summary`, { organizationId });
  },

  // ========================================
  // ACTIVE ENFORCEMENT
  // ========================================

  async enforce(agentId: string, action: string, description: string, dataTypes?: string[]) {
    return api.post<unknown>(`${API_BASE}/enforce`, {
      agentId,
      action,
      description,
      dataTypes,
    });
  },

  async checkCompliance(context: {
    action: string;
    description: string;
    dataTypes?: string[];
    pillar?: PillarId;
    userId?: string;
    agentId?: string;
  }) {
    return api.post<unknown>(`${API_BASE}/check`, context);
  },

  async getRules(filters?: { domain?: ComplianceDomain; framework?: string }) {
    const params: Record<string, string> = {};
    if (filters?.domain) {
      params.domain = filters.domain;
    }
    if (filters?.framework) {
      params.framework = filters.framework;
    }
    return api.get<unknown>(`${API_BASE}/rules`, params);
  },

  // ========================================
  // COUNCIL INTEGRATION
  // ========================================

  async evaluateCouncilProposal(proposal: {
    id?: string;
    agentId?: string;
    action: string;
    description: string;
    dataTypes?: string[];
    targetSystems?: string[];
    affectedData?: string[];
    rationale?: string;
  }) {
    return api.post<unknown>(`${API_BASE}/council/evaluate`, proposal);
  },

  async getCouncilHistory(limit = 100) {
    return api.get<unknown>(`${API_BASE}/council/history`, { limit });
  },

  async getCouncilStatistics() {
    return api.get<unknown>(`${API_BASE}/council/statistics`);
  },
};

export default complianceApi;
