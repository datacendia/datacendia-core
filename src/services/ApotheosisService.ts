// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA APOTHEOSIS™ — FRONTEND SERVICE
// The Self-Improvement Loop That Never Stops
// =============================================================================

import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export interface ApotheosisScore {
  overall: number;
  components: {
    redTeamSurvivalRate: { value: number; weight: number };
    weaknessClosureRate: { value: number; weight: number };
    decisionSuccessRate: { value: number; weight: number };
    humanReadiness: { value: number; weight: number };
    patternHealth: { value: number; weight: number };
  };
  trend: Array<{ date: string; score: number }>;
  improvementPoints: number;
  improvementPeriod: string;
}

export interface ApotheosisRun {
  id: string;
  organizationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  scenariosTested: number;
  scenariosSurvived: number;
  survivalRate: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  apotheosisScore: number;
  previousScore: number;
  scoreDelta: number;
  shadowCouncilInstances: number;
  computeHours: number;
  duration: number;
}

export interface Escalation {
  id: string;
  weaknessId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high';
  reason: string;
  estimatedCostToFix: number;
  riskIfNotFixed: number;
  assignedTo: string[];
  deadline: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  responseAt?: Date;
  response?: string;
}

export interface PatternBan {
  id: string;
  pattern: string;
  description: string;
  instances: PatternInstance[];
  failureRate: number;
  totalCost: number;
  bannedAt: Date;
  bannedBy: 'apotheosis' | 'human';
  status: 'active' | 'lifted';
  overrideRequires: string;
}

export interface PatternInstance {
  decisionId: string;
  decisionTitle: string;
  date: Date;
  outcome: 'success' | 'failure';
  cost?: number;
}

export interface UpskillAssignment {
  id: string;
  userId: string;
  userName: string;
  weaknessId: string;
  gapIdentified: string;
  trainingTopic: string;
  trainingDuration: number;
  deadline: Date;
  modules: TrainingModule[];
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
  blockingActions: boolean;
}

export interface TrainingModule {
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'simulation';
}

export interface ApotheosisConfig {
  runFrequency: 'nightly' | 'weekly' | 'manual';
  runTime: string;
  scenarioCount: number;
  autoPatchThreshold: number;
  escalationTimeout: number;
  patternBanThreshold: number;
  trainingDeadline: number;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class ApotheosisService {
  private baseUrl = '/apotheosis';

  /**
   * Get the current Apotheosis Score
   */
  async getScore(): Promise<ApotheosisScore> {
    try {
      const response = await api.get<ApotheosisScore>(`${this.baseUrl}/score`);
      return response.data ?? this.getMockScore();
    } catch (error) {
      console.error('[Apotheosis] Error fetching score:', error);
      return this.getMockScore();
    }
  }

  /**
   * Get the latest run results
   */
  async getLatestRun(): Promise<ApotheosisRun | null> {
    try {
      const response = await api.get<ApotheosisRun>(`${this.baseUrl}/latest-run`);
      return response.data ?? this.getMockLatestRun();
    } catch (error) {
      console.error('[Apotheosis] Error fetching latest run:', error);
      return this.getMockLatestRun();
    }
  }

  /**
   * Get run history
   */
  async getRunHistory(limit: number = 30): Promise<ApotheosisRun[]> {
    try {
      const response = await api.get<ApotheosisRun[]>(`${this.baseUrl}/run-history?limit=${limit}`);
      return response.data ?? [];
    } catch (error) {
      console.error('[Apotheosis] Error fetching run history:', error);
      return [];
    }
  }

  /**
   * Get pending escalations
   */
  async getEscalations(): Promise<Escalation[]> {
    try {
      const response = await api.get<Escalation[]>(`${this.baseUrl}/escalations`);
      return response.data ?? this.getMockEscalations();
    } catch (error) {
      console.error('[Apotheosis] Error fetching escalations:', error);
      return this.getMockEscalations();
    }
  }

  /**
   * Respond to an escalation
   */
  async respondToEscalation(
    id: string,
    response: 'approved' | 'rejected' | 'deferred',
    reason: string
  ): Promise<void> {
    await api.post(`${this.baseUrl}/escalations/${id}/respond`, { response, reason });
  }

  /**
   * Get banned patterns
   */
  async getBannedPatterns(): Promise<PatternBan[]> {
    try {
      const response = await api.get<PatternBan[]>(`${this.baseUrl}/banned-patterns`);
      return response.data ?? this.getMockBannedPatterns();
    } catch (error) {
      console.error('[Apotheosis] Error fetching banned patterns:', error);
      return this.getMockBannedPatterns();
    }
  }

  /**
   * Get upskill assignments
   */
  async getUpskillAssignments(): Promise<UpskillAssignment[]> {
    try {
      const response = await api.get<UpskillAssignment[]>(`${this.baseUrl}/upskill-assignments`);
      return response.data ?? this.getMockUpskillAssignments();
    } catch (error) {
      console.error('[Apotheosis] Error fetching upskill assignments:', error);
      return this.getMockUpskillAssignments();
    }
  }

  /**
   * Get configuration
   */
  async getConfig(): Promise<ApotheosisConfig> {
    try {
      const response = await api.get<ApotheosisConfig>(`${this.baseUrl}/config`);
      return response.data ?? this.getDefaultConfig();
    } catch (error) {
      console.error('[Apotheosis] Error fetching config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Update configuration
   */
  async updateConfig(config: Partial<ApotheosisConfig>): Promise<ApotheosisConfig> {
    const response = await api.put<ApotheosisConfig>(`${this.baseUrl}/config`, config);
    return response.data ?? this.getDefaultConfig();
  }

  /**
   * Trigger a manual run
   */
  async triggerManualRun(): Promise<{ runId: string }> {
    const response = await api.post<{ runId: string }>(`${this.baseUrl}/trigger-run`, {});
    return response.data ?? { runId: 'manual-run' };
  }

  // ===========================================================================
  // MOCK DATA FOR DEMO
  // ===========================================================================

  private getMockScore(): ApotheosisScore {
    // Component scores based on platform capability assessment
    const components = {
      redTeamSurvivalRate: { value: 93, weight: 0.3 },
      weaknessClosureRate: { value: 97, weight: 0.25 },
      decisionSuccessRate: { value: 89, weight: 0.25 },
      humanReadiness: { value: 96, weight: 0.1 },
      patternHealth: { value: 98, weight: 0.1 },
    };

    // Real weighted calculation: overall = Σ(value × weight)
    const overall = Math.round(
      Object.values(components).reduce((sum, c) => sum + c.value * c.weight, 0) * 10
    ) / 10;

    // Trend: historical scores showing improvement trajectory
    const trend = [
      { date: '2024-01', score: 78.2 },
      { date: '2024-03', score: 82.4 },
      { date: '2024-06', score: 88.1 },
      { date: '2024-09', score: 92.3 },
      { date: '2024-12', score: overall },
    ];

    // Improvement = current - earliest
    const improvementPoints = Math.round((overall - trend[0].score) * 10) / 10;

    return {
      overall,
      components,
      trend,
      improvementPoints,
      improvementPeriod: '11 months',
    };
  }

  private getMockLatestRun(): ApotheosisRun {
    return {
      id: 'run-demo-1',
      organizationId: 'demo-org',
      startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'completed',
      scenariosTested: 1247,
      scenariosSurvived: 1160,
      survivalRate: 93.0,
      criticalCount: 3,
      highCount: 12,
      mediumCount: 18,
      lowCount: 14,
      apotheosisScore: 94.7,
      previousScore: 92.3,
      scoreDelta: 2.4,
      shadowCouncilInstances: 12,
      computeHours: 847,
      duration: 167,
    };
  }

  private getMockEscalations(): Escalation[] {
    return [
      {
        id: 'esc-1',
        weaknessId: 'w1',
        title: 'Single point of failure in Finance',
        description:
          'Only CFO can approve wire transfers >$100K. CFO unavailable = business stops.',
        severity: 'critical',
        reason: 'Requires policy change',
        estimatedCostToFix: 0,
        riskIfNotFixed: 2300000,
        assignedTo: ['executive-team'],
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        id: 'esc-2',
        weaknessId: 'w2',
        title: 'Vendor concentration risk',
        description:
          '73% of cloud spend with single vendor (AWS). Price increase or outage = major impact.',
        severity: 'high',
        reason: 'Budget impact exceeds threshold',
        estimatedCostToFix: 150000,
        riskIfNotFixed: 4100000,
        assignedTo: ['cto', 'cfo'],
        deadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        id: 'esc-3',
        weaknessId: 'w3',
        title: 'Knowledge concentration in Engineering',
        description:
          '3 engineers hold 80% of critical system knowledge. Departure = 6-12 month recovery.',
        severity: 'high',
        reason: 'Requires resource allocation',
        estimatedCostToFix: 45000,
        riskIfNotFixed: 1800000,
        assignedTo: ['vp-engineering'],
        deadline: new Date(Date.now() + 120 * 60 * 60 * 1000),
        status: 'pending',
      },
    ];
  }

  private getMockBannedPatterns(): PatternBan[] {
    return [
      {
        id: 'pb-1',
        pattern: 'Skip process for urgent requests',
        description: 'Bypassing standard review for urgency claims',
        instances: [
          {
            decisionId: 'd1',
            decisionTitle: 'Rush vendor onboarding',
            date: new Date('2024-09-15'),
            outcome: 'failure',
            cost: 120000,
          },
          {
            decisionId: 'd2',
            decisionTitle: 'Skip QA for deadline',
            date: new Date('2024-06-10'),
            outcome: 'failure',
            cost: 45000,
          },
          {
            decisionId: 'd3',
            decisionTitle: 'Skip legal review',
            date: new Date('2024-03-22'),
            outcome: 'failure',
            cost: 75000,
          },
        ],
        failureRate: 100,
        totalCost: 240000,
        bannedAt: new Date('2024-09-20'),
        bannedBy: 'apotheosis',
        status: 'active',
        overrideRequires: 'CEO approval',
      },
      {
        id: 'pb-2',
        pattern: 'Approve vendor without references',
        description: 'Onboarding vendors without reference checks',
        instances: [
          {
            decisionId: 'd4',
            decisionTitle: 'New supplier approval',
            date: new Date('2024-06-01'),
            outcome: 'failure',
            cost: 85000,
          },
          {
            decisionId: 'd5',
            decisionTitle: 'Contractor engagement',
            date: new Date('2024-04-15'),
            outcome: 'failure',
            cost: 62000,
          },
        ],
        failureRate: 100,
        totalCost: 147000,
        bannedAt: new Date('2024-06-15'),
        bannedBy: 'apotheosis',
        status: 'active',
        overrideRequires: 'CFO approval',
      },
      {
        id: 'pb-3',
        pattern: 'Deploy Friday afternoon',
        description: 'Production deployments on Friday afternoons',
        instances: [
          {
            decisionId: 'd6',
            decisionTitle: 'Feature release',
            date: new Date('2024-03-08'),
            outcome: 'failure',
            cost: 35000,
          },
          {
            decisionId: 'd7',
            decisionTitle: 'Hotfix deployment',
            date: new Date('2024-02-16'),
            outcome: 'failure',
            cost: 28000,
          },
        ],
        failureRate: 83,
        totalCost: 63000,
        bannedAt: new Date('2024-03-15'),
        bannedBy: 'apotheosis',
        status: 'active',
        overrideRequires: 'CTO approval',
      },
    ];
  }

  private getMockUpskillAssignments(): UpskillAssignment[] {
    return [
      {
        id: 'us-1',
        userId: 'user-1',
        userName: 'James Wilson',
        weaknessId: 'w1',
        gapIdentified: 'Vendor security assessment',
        trainingTopic: 'Vendor Security Fundamentals',
        trainingDuration: 45,
        deadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
        modules: [
          { title: 'Why vendor security matters', duration: 10, type: 'video' },
          { title: 'The breach that bankrupted...', duration: 15, type: 'reading' },
          { title: 'Security checklist for contracts', duration: 10, type: 'reading' },
          { title: 'Quiz + certification', duration: 10, type: 'quiz' },
        ],
        status: 'assigned',
        blockingActions: true,
      },
      {
        id: 'us-2',
        userId: 'user-2',
        userName: 'Sarah Chen',
        weaknessId: 'w2',
        gapIdentified: 'Financial red flags recognition',
        trainingTopic: 'Financial Risk Indicators',
        trainingDuration: 30,
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        modules: [
          { title: 'Common financial warning signs', duration: 10, type: 'video' },
          { title: 'Case studies', duration: 15, type: 'reading' },
          { title: 'Assessment', duration: 5, type: 'quiz' },
        ],
        status: 'in_progress',
        blockingActions: false,
      },
      {
        id: 'us-3',
        userId: 'user-3',
        userName: 'Mike Rodriguez',
        weaknessId: 'w3',
        gapIdentified: 'Data privacy (GDPR)',
        trainingTopic: 'GDPR Compliance Essentials',
        trainingDuration: 60,
        deadline: new Date(Date.now() + 120 * 60 * 60 * 1000),
        modules: [
          { title: 'GDPR fundamentals', duration: 20, type: 'video' },
          { title: 'Data handling procedures', duration: 25, type: 'reading' },
          { title: 'Certification exam', duration: 15, type: 'quiz' },
        ],
        status: 'assigned',
        blockingActions: false,
      },
    ];
  }

  private getDefaultConfig(): ApotheosisConfig {
    return {
      runFrequency: 'nightly',
      runTime: '03:00',
      scenarioCount: 1000,
      autoPatchThreshold: 10000,
      escalationTimeout: 72,
      patternBanThreshold: 3,
      trainingDeadline: 72,
    };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const apotheosisService = new ApotheosisService();
export default apotheosisService;
