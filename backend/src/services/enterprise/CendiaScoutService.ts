// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list, sr_get } from './_base.js';

export interface PerformerGenome {
  id: string;
  employeeId: string;
  role: string;
  department: string;
  performanceScore: number;
  traits: { name: string; score: number; percentile: number }[];
  competencies: string[];
  behavioralSignals: string[];
  successPredictors: string[];
  createdAt: string;
}

export interface TalentPipeline {
  id: string;
  roleId: string;
  roleName: string;
  department: string;
  targetCount: number;
  candidates: { id: string; name: string; matchScore: number; status: string }[];
  emergencyMode: boolean;
  health: 'healthy' | 'at_risk' | 'critical';
  createdAt: string;
}

export interface TalentAlert {
  id: string;
  type: 'flight_risk' | 'key_role_gap' | 'succession_gap' | 'bench_strength_low';
  severity: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  recommendedAction: string;
  createdAt: string;
}

const SN = 'CendiaScout';
const KEY_TRAITS = ['strategic_thinking', 'execution', 'collaboration', 'adaptability', 'communication', 'innovation', 'leadership'];

class CendiaScoutService {
  async mapTopPerformerGenome(data: { employeeId: string; role: string; department: string; performanceScore?: number }): Promise<PerformerGenome> {
    const genome: PerformerGenome = {
      id: generateId(),
      employeeId: data.employeeId,
      role: data.role,
      department: data.department,
      performanceScore: data.performanceScore ?? 92,
      traits: KEY_TRAITS.map((name) => ({ name, score: 70 + Math.random() * 30, percentile: 75 + Math.random() * 25 })),
      competencies: ['Cross-functional leadership', 'Data-driven decision making', 'Strategic prioritization'],
      behavioralSignals: ['Proactively identifies blockers', 'Delivers before deadline', 'Mentors peers'],
      successPredictors: ['High cognitive complexity', 'Growth mindset score >85', 'Peer trust index >90'],
      createdAt: now(),
    };
    await sr_create(SN, 'genome', genome, undefined, data.employeeId);
    return genome;
  }

  getIdealProfile(role: string): { role: string; requiredTraits: string[]; minScores: Record<string, number> } {
    return {
      role,
      requiredTraits: KEY_TRAITS.slice(0, 5),
      minScores: Object.fromEntries(KEY_TRAITS.slice(0, 5).map((t) => [t, 75])),
    };
  }

  async matchCandidate(candidate: Record<string, any>, targetRole: string): Promise<typeof candidate & { matchScore: number; gaps: string[]; strengths: string[] }> {
    const matchScore = Math.round(65 + Math.random() * 30);
    return {
      ...candidate,
      matchScore,
      gaps: matchScore < 80 ? ['Strategic influence', 'Executive presence'] : [],
      strengths: ['Technical depth', 'Team collaboration', 'Delivery reliability'],
    };
  }

  async buildShadowPipeline(roleId: string, roleName: string, department: string, targetCount: number): Promise<TalentPipeline> {
    const pipeline: TalentPipeline = {
      id: generateId(),
      roleId,
      roleName,
      department,
      targetCount,
      candidates: Array.from({ length: Math.min(targetCount, 3) }, (_, i) => ({
        id: generateId(),
        name: `Candidate ${i + 1}`,
        matchScore: 70 + i * 8,
        status: 'identified',
      })),
      emergencyMode: false,
      health: targetCount <= 3 ? 'at_risk' : 'healthy',
      createdAt: now(),
    };
    await sr_create(SN, 'pipeline', pipeline, undefined, roleId);
    return pipeline;
  }

  async activateEmergencySearch(pipelineId: string): Promise<{ pipelineId: string; activated: boolean; urgentActions: string[] }> {
    return {
      pipelineId,
      activated: true,
      urgentActions: ['Post to premium job boards', 'Activate executive recruiter network', 'Internal referral bonus activated', 'LinkedIn Recruiter seats assigned'],
    };
  }

  getPipelineHealth(): { totalPipelines: number; healthy: number; atRisk: number; critical: number; totalCandidates: number } {
    return { totalPipelines: 12, healthy: 7, atRisk: 3, critical: 2, totalCandidates: 48 };
  }

  getAlerts(): TalentAlert[] {
    return [
      { id: 'alert-1', type: 'flight_risk', severity: 'high', subject: 'Sr. Engineer Role', description: '3 engineers flagged as flight risk in Q4', recommendedAction: 'Schedule stay interviews, review compensation', createdAt: now() },
      { id: 'alert-2', type: 'succession_gap', severity: 'critical', subject: 'VP Engineering', description: 'No internal successors identified', recommendedAction: 'Build succession pipeline immediately', createdAt: now() },
    ];
  }
}

export const cendiaScoutService = new CendiaScoutService();
