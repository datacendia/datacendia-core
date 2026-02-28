// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DISSENT™ — FRONTEND SERVICE
// The Right to Formally, Safely, Immutably Disagree
// =============================================================================

import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export type DissentType =
  | 'factual'
  | 'risk'
  | 'ethical'
  | 'process'
  | 'strategic'
  | 'resource'
  | 'other';
export type DissentSeverity = 'advisory' | 'formal_objection' | 'blocking';
export type DissentStatus =
  | 'pending'
  | 'acknowledged'
  | 'accepted'
  | 'overruled'
  | 'clarification_requested'
  | 'escalated';
export type ResponseType =
  | 'accept'
  | 'partial_accept'
  | 'acknowledge_proceed'
  | 'request_clarification'
  | 'escalate_together';

export interface Dissent {
  id: string;
  organizationId: string;
  decisionId: string;
  decisionTitle: string;
  decisionDate: Date;
  decisionOwner: string;
  dissentType: DissentType;
  severity: DissentSeverity;
  statement: string;
  supportingEvidence?: string[];
  isAnonymous: boolean;
  dissenterId: string;
  dissenterName: string;
  dissenterRole?: string;
  dissenterDepartment?: string;
  status: DissentStatus;
  responseDeadline: Date;
  response?: DissentResponse;
  outcomeVerified: boolean;
  dissenterWasRight?: boolean;
  outcomeVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  ledgerHash: string;
  ledgerTimestamp: Date;
}

export interface DissentResponse {
  id: string;
  dissentId: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  responseType: ResponseType;
  reasoning: string;
  mitigatingActions?: string[];
  createdAt: Date;
  ledgerHash: string;
}

export interface DissenterProfile {
  userId: string;
  userName: string;
  isAnonymous: boolean;
  totalDissents: number;
  acknowledged: number;
  acceptedDissents: number;
  overruledDissents: number;
  dissentAccuracy: number;
  verifiedOutcomes: number;
  correctPredictions: number;
  isHighAccuracy: boolean;
  byType: Record<string, number>;
}

export interface OrganizationDissentMetrics {
  organizationId: string;
  totalDissents: number;
  activeDissents: number;
  responseRate: number;
  avgResponseTime: number;
  acceptanceRate: number;
  overallAccuracy: number;
  retaliationFlags: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  byDepartment: DepartmentDissentMetrics[];
  highAccuracyDissenters: DissenterProfile[];
  trend: Array<{ date: string; count: number; accuracy: number }>;
}

export interface DepartmentDissentMetrics {
  department: string;
  totalDissents: number;
  acceptedRate: number;
  accuracy: number;
  trend: 'up' | 'stable' | 'down';
}

export interface RetaliationFlag {
  id: string;
  dissentId: string;
  dissenterId: string;
  dissenterName: string;
  flagType:
    | 'performance_review'
    | 'compensation'
    | 'role_change'
    | 'access_revocation'
    | 'meeting_exclusion'
    | 'communication_pattern';
  description: string;
  detectedAt: Date;
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  escalatedToBoard: boolean;
  escalatedAt?: Date;
}

export interface DissentConfig {
  responseDeadline: number;
  escalationPath: string[];
  anonymousAllowed: boolean;
  retaliationMonitoringDuration: number;
  highAccuracyThreshold: number;
  blockingDissentAllowed: boolean;
  minimumDissentsForAccuracy: number;
}

export interface FileDissentRequest {
  decisionId: string;
  decisionTitle: string;
  decisionOwner: string;
  dissentType: DissentType;
  severity: DissentSeverity;
  statement: string;
  supportingEvidence?: string[];
  isAnonymous: boolean;
  dissenterId: string;
  dissenterName: string;
  dissenterRole?: string;
  dissenterDepartment?: string;
}

export interface RespondToDissentRequest {
  responderId: string;
  responderName: string;
  responderRole: string;
  responseType: ResponseType;
  reasoning: string;
  mitigatingActions?: string[];
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class DissentService {
  private baseUrl = '/dissent';

  /**
   * File a new dissent
   */
  async fileDissent(data: FileDissentRequest): Promise<Dissent> {
    const response = await api.post<Dissent>(this.baseUrl, data);
    if (!response.data) {throw new Error('Failed to file dissent');}
    return response.data;
  }

  /**
   * Get all dissents
   */
  async getDissents(
    options: {
      status?: DissentStatus;
      userId?: string;
      decisionId?: string;
      limit?: number;
    } = {}
  ): Promise<Dissent[]> {
    try {
      const params = new URLSearchParams();
      if (options.status) {params.append('status', options.status);}
      if (options.userId) {params.append('userId', options.userId);}
      if (options.decisionId) {params.append('decisionId', options.decisionId);}
      if (options.limit) {params.append('limit', options.limit.toString());}

      const response = await api.get<Dissent[]>(`${this.baseUrl}?${params.toString()}`);
      return response.data ?? this.getMockDissents();
    } catch (error) {
      console.error('[Dissent] Error fetching dissents:', error);
      return this.getMockDissents();
    }
  }

  /**
   * Get active dissents requiring response
   */
  async getActiveDissents(): Promise<Dissent[]> {
    try {
      const response = await api.get<Dissent[]>(`${this.baseUrl}/active`);
      return response.data ?? this.getMockDissents().filter((d) => d.status === 'pending');
    } catch (error) {
      console.error('[Dissent] Error fetching active dissents:', error);
      return this.getMockDissents().filter((d) => d.status === 'pending');
    }
  }

  /**
   * Get dissent by ID
   */
  async getDissentById(id: string): Promise<Dissent | null> {
    try {
      const response = await api.get<Dissent>(`${this.baseUrl}/${id}`);
      return response.data ?? null;
    } catch (error) {
      console.error('[Dissent] Error fetching dissent:', error);
      return null;
    }
  }

  /**
   * Respond to a dissent
   */
  async respondToDissent(id: string, data: RespondToDissentRequest): Promise<Dissent> {
    const response = await api.post<Dissent>(`${this.baseUrl}/${id}/respond`, data);
    if (!response.data) {throw new Error('Failed to respond to dissent');}
    return response.data;
  }

  /**
   * Get dissenter profile
   */
  async getDissenterProfile(userId: string): Promise<DissenterProfile> {
    try {
      const response = await api.get<DissenterProfile>(`${this.baseUrl}/profile/${userId}`);
      return response.data ?? this.getMockProfile();
    } catch (error) {
      console.error('[Dissent] Error fetching profile:', error);
      return this.getMockProfile();
    }
  }

  /**
   * Get organization metrics
   */
  async getOrganizationMetrics(): Promise<OrganizationDissentMetrics> {
    try {
      const response = await api.get<OrganizationDissentMetrics>(
        `${this.baseUrl}/metrics/organization`
      );
      return response.data ?? this.getMockMetrics();
    } catch (error) {
      console.error('[Dissent] Error fetching metrics:', error);
      return this.getMockMetrics();
    }
  }

  /**
   * Get retaliation flags
   */
  async getRetaliationFlags(): Promise<RetaliationFlag[]> {
    try {
      const response = await api.get<RetaliationFlag[]>(`${this.baseUrl}/retaliation-flags`);
      return response.data ?? [];
    } catch (error) {
      console.error('[Dissent] Error fetching retaliation flags:', error);
      return [];
    }
  }

  /**
   * Report potential retaliation
   */
  async reportRetaliation(
    dissentId: string,
    flagType: RetaliationFlag['flagType'],
    description: string
  ): Promise<RetaliationFlag> {
    const response = await api.post<RetaliationFlag>(
      `${this.baseUrl}/${dissentId}/report-retaliation`,
      {
        flagType,
        description,
      }
    );
    if (!response.data) {throw new Error('Failed to report retaliation');}
    return response.data;
  }

  /**
   * Record outcome verification
   */
  async recordOutcomeVerification(id: string, wasRight: boolean, notes?: string): Promise<Dissent> {
    const response = await api.post<Dissent>(`${this.baseUrl}/${id}/verify-outcome`, {
      wasRight,
      notes,
    });
    if (!response.data) {throw new Error('Failed to record outcome');}
    return response.data;
  }

  /**
   * Check if there are blocking dissents for a decision
   */
  async checkDissentBlock(decisionId: string): Promise<{ blocked: boolean; dissents: Dissent[] }> {
    try {
      const response = await api.get<{ blocked: boolean; dissents: Dissent[] }>(
        `${this.baseUrl}/check-block/${decisionId}`
      );
      return response.data ?? { blocked: false, dissents: [] };
    } catch (error) {
      console.error('[Dissent] Error checking dissent block:', error);
      return { blocked: false, dissents: [] };
    }
  }

  /**
   * Get configuration
   */
  async getConfig(): Promise<DissentConfig> {
    try {
      const response = await api.get<DissentConfig>(`${this.baseUrl}/config`);
      return response.data ?? this.getDefaultConfig();
    } catch (error) {
      console.error('[Dissent] Error fetching config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Update configuration
   */
  async updateConfig(config: Partial<DissentConfig>): Promise<DissentConfig> {
    const response = await api.put<DissentConfig>(`${this.baseUrl}/config`, config);
    return response.data ?? this.getDefaultConfig();
  }

  /**
   * Initialize demo data
   */
  async initializeDemoData(): Promise<void> {
    await api.post(`${this.baseUrl}/init-demo`, {});
  }

  // ===========================================================================
  // MOCK DATA FOR DEMO
  // ===========================================================================

  private getMockDissents(): Dissent[] {
    return [
      {
        id: 'dissent-1',
        organizationId: 'demo-org',
        decisionId: 'dec-4821',
        decisionTitle: 'Q1 Product Roadmap Approval',
        decisionDate: new Date('2024-12-08'),
        decisionOwner: 'Product Council',
        dissentType: 'ethical',
        severity: 'formal_objection',
        statement:
          'The timeline for Feature X is unrealistic and sets the team up for burnout. We committed to sustainable pace in our engineering values. This decision violates that commitment.',
        isAnonymous: false,
        dissenterId: 'user-sarah',
        dissenterName: 'Sarah Chen',
        dissenterRole: 'Engineering Lead',
        dissenterDepartment: 'Engineering',
        status: 'pending',
        responseDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        outcomeVerified: false,
        createdAt: new Date('2024-12-08T14:32:00'),
        updatedAt: new Date('2024-12-08T14:32:00'),
        ledgerHash: 'abc123',
        ledgerTimestamp: new Date('2024-12-08T14:32:00'),
      },
      {
        id: 'dissent-2',
        organizationId: 'demo-org',
        decisionId: 'dec-4750',
        decisionTitle: 'Vendor Selection - Cloud Infrastructure',
        decisionDate: new Date('2024-11-15'),
        decisionOwner: 'CTO',
        dissentType: 'risk',
        severity: 'formal_objection',
        statement:
          'Concentrating 100% of cloud spend with a single vendor creates unacceptable lock-in risk.',
        isAnonymous: false,
        dissenterId: 'user-james',
        dissenterName: 'James Wilson',
        dissenterRole: 'CFO',
        dissenterDepartment: 'Finance',
        status: 'accepted',
        responseDeadline: new Date('2024-11-18'),
        response: {
          id: 'resp-1',
          dissentId: 'dissent-2',
          responderId: 'user-cto',
          responderName: 'Michael Torres',
          responderRole: 'CTO',
          responseType: 'accept',
          reasoning: 'Valid concern. We will maintain 20% Azure presence.',
          createdAt: new Date('2024-11-17'),
          ledgerHash: 'def456',
        },
        outcomeVerified: true,
        dissenterWasRight: true,
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-17'),
        ledgerHash: 'ghi789',
        ledgerTimestamp: new Date('2024-11-15'),
      },
      {
        id: 'dissent-3',
        organizationId: 'demo-org',
        decisionId: 'dec-4680',
        decisionTitle: 'Q3 Hiring Freeze',
        decisionDate: new Date('2024-09-01'),
        decisionOwner: 'Executive Team',
        dissentType: 'strategic',
        severity: 'formal_objection',
        statement: 'A complete freeze will set us back 6 months on critical projects.',
        isAnonymous: false,
        dissenterId: 'user-sarah',
        dissenterName: 'Sarah Chen',
        dissenterRole: 'Engineering Lead',
        dissenterDepartment: 'Engineering',
        status: 'overruled',
        responseDeadline: new Date('2024-09-04'),
        response: {
          id: 'resp-2',
          dissentId: 'dissent-3',
          responderId: 'user-ceo',
          responderName: 'Alex Rivera',
          responderRole: 'CEO',
          responseType: 'acknowledge_proceed',
          reasoning: 'Cash preservation is critical. Freeze stands but will be reviewed monthly.',
          createdAt: new Date('2024-09-03'),
          ledgerHash: 'jkl012',
        },
        outcomeVerified: true,
        dissenterWasRight: true,
        outcomeVerifiedAt: new Date('2024-12-01'),
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-03'),
        ledgerHash: 'mno345',
        ledgerTimestamp: new Date('2024-09-01'),
      },
    ];
  }

  private getMockProfile(): DissenterProfile {
    return {
      userId: 'user-sarah',
      userName: 'Sarah Chen',
      isAnonymous: false,
      totalDissents: 7,
      acknowledged: 7,
      acceptedDissents: 3,
      overruledDissents: 4,
      dissentAccuracy: 71,
      verifiedOutcomes: 7,
      correctPredictions: 5,
      isHighAccuracy: true,
      byType: {
        ethical: 2,
        risk: 2,
        strategic: 2,
        resource: 1,
      },
    };
  }

  private getMockMetrics(): OrganizationDissentMetrics {
    return {
      organizationId: 'demo-org',
      totalDissents: 55,
      activeDissents: 12,
      responseRate: 100,
      avgResponseTime: 36,
      acceptanceRate: 43,
      overallAccuracy: 67,
      retaliationFlags: 0,
      healthStatus: 'healthy',
      byDepartment: [
        {
          department: 'Engineering',
          totalDissents: 23,
          acceptedRate: 39,
          accuracy: 71,
          trend: 'up',
        },
        { department: 'Sales', totalDissents: 8, acceptedRate: 25, accuracy: 50, trend: 'stable' },
        { department: 'Finance', totalDissents: 12, acceptedRate: 58, accuracy: 83, trend: 'up' },
        {
          department: 'Marketing',
          totalDissents: 5,
          acceptedRate: 20,
          accuracy: 40,
          trend: 'down',
        },
        {
          department: 'Operations',
          totalDissents: 7,
          acceptedRate: 57,
          accuracy: 57,
          trend: 'stable',
        },
      ],
      highAccuracyDissenters: [
        {
          userId: 'user-sarah',
          userName: 'Sarah Chen',
          isAnonymous: false,
          totalDissents: 7,
          acknowledged: 7,
          acceptedDissents: 3,
          overruledDissents: 4,
          dissentAccuracy: 71,
          verifiedOutcomes: 7,
          correctPredictions: 5,
          isHighAccuracy: true,
          byType: {},
        },
        {
          userId: 'user-james',
          userName: 'James Wilson',
          isAnonymous: false,
          totalDissents: 5,
          acknowledged: 5,
          acceptedDissents: 4,
          overruledDissents: 1,
          dissentAccuracy: 80,
          verifiedOutcomes: 5,
          correctPredictions: 4,
          isHighAccuracy: true,
          byType: {},
        },
      ],
      trend: [
        { date: '2024-06', count: 6, accuracy: 55 },
        { date: '2024-07', count: 8, accuracy: 58 },
        { date: '2024-08', count: 7, accuracy: 62 },
        { date: '2024-09', count: 10, accuracy: 65 },
        { date: '2024-10', count: 9, accuracy: 64 },
        { date: '2024-11', count: 8, accuracy: 68 },
        { date: '2024-12', count: 7, accuracy: 67 },
      ],
    };
  }

  private getDefaultConfig(): DissentConfig {
    return {
      responseDeadline: 72,
      escalationPath: ['manager', 'vp', 'board'],
      anonymousAllowed: true,
      retaliationMonitoringDuration: 12,
      highAccuracyThreshold: 60,
      blockingDissentAllowed: true,
      minimumDissentsForAccuracy: 3,
    };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const dissentService = new DissentService();
export default dissentService;
