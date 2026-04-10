// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_get } from './_base.js';

export interface SkillProfile {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  skills: { name: string; currentLevel: number; targetLevel: number; certifiedAt?: string }[];
  overallScore: number;
  lastAssessedAt: string;
  createdAt: string;
}

export interface LearningPath {
  id: string;
  skill: string;
  currentLevel: number;
  targetLevel: number;
  modules: { title: string; type: 'course' | 'workshop' | 'project' | 'mentoring' | 'certification'; estimatedHours: number; priority: 'required' | 'recommended' | 'optional' }[];
  estimatedCompletionWeeks: number;
  createdAt: string;
}

const SN = 'CendiaAcademy';
const profiles = new Map<string, SkillProfile>();

class CendiaAcademyService {
  createProfile(input: Partial<SkillProfile>): SkillProfile {
    const profile: SkillProfile = {
      id: generateId(), employeeId: input.employeeId || generateId(), name: input.name || 'Employee',
      role: input.role || 'IC', department: input.department || 'Engineering',
      skills: input.skills || [
        { name: 'TypeScript', currentLevel: 7, targetLevel: 9 },
        { name: 'System Design', currentLevel: 5, targetLevel: 8 },
        { name: 'Leadership', currentLevel: 4, targetLevel: 7 },
      ],
      overallScore: 0, lastAssessedAt: now(), createdAt: now(),
    };
    profile.overallScore = Math.round(profile.skills.reduce((s, sk) => s + (sk.currentLevel / sk.targetLevel) * 100, 0) / (profile.skills.length || 1));
    profiles.set(profile.id, profile);
    sr_create(SN, 'profile', profile).catch(() => {});
    return profile;
  }

  getProfile(id: string): SkillProfile | undefined {
    return profiles.get(id);
  }

  async analyzeSkillGaps(id: string): Promise<{ profileId: string; gaps: { skill: string; currentLevel: number; targetLevel: number; gap: number; priority: string; businessImpact: string }[]; overallReadiness: number; recommendations: string[] }> {
    const profile = profiles.get(id);
    const skills = profile?.skills || [{ name: 'Unknown', currentLevel: 5, targetLevel: 8 }];
    const gaps = skills.filter((s) => s.currentLevel < s.targetLevel).map((s) => ({
      skill: s.name,
      currentLevel: s.currentLevel,
      targetLevel: s.targetLevel,
      gap: s.targetLevel - s.currentLevel,
      priority: s.targetLevel - s.currentLevel >= 3 ? 'critical' : s.targetLevel - s.currentLevel >= 2 ? 'high' : 'medium',
      businessImpact: `Closing this gap enables ${s.name === 'Leadership' ? 'team growth and succession planning' : `higher-quality ${s.name} delivery`}`,
    }));
    return {
      profileId: id,
      gaps,
      overallReadiness: profile?.overallScore ?? 65,
      recommendations: [
        gaps.length > 0 ? `Prioritize ${gaps[0].skill} — largest gap with highest business impact` : 'All skills at target level',
        'Schedule quarterly skill assessment to track progress',
        'Pair with senior mentor for accelerated growth in leadership competencies',
      ],
    };
  }

  async recommendLearningPath(skill: string, currentLevel: number, targetLevel: number): Promise<LearningPath> {
    const gap = targetLevel - currentLevel;
    const modules = [];
    if (gap >= 1) modules.push({ title: `${skill} Fundamentals Refresher`, type: 'course' as const, estimatedHours: 8, priority: 'required' as const });
    if (gap >= 2) modules.push({ title: `Advanced ${skill} Workshop`, type: 'workshop' as const, estimatedHours: 16, priority: 'required' as const });
    if (gap >= 3) modules.push({ title: `${skill} Real-World Project`, type: 'project' as const, estimatedHours: 40, priority: 'required' as const });
    modules.push({ title: `${skill} Peer Mentoring Sessions`, type: 'mentoring' as const, estimatedHours: 12, priority: 'recommended' as const });
    if (targetLevel >= 8) modules.push({ title: `${skill} Professional Certification`, type: 'certification' as const, estimatedHours: 24, priority: 'recommended' as const });
    const path: LearningPath = {
      id: generateId(), skill, currentLevel, targetLevel, modules,
      estimatedCompletionWeeks: Math.ceil(modules.reduce((s, m) => s + m.estimatedHours, 0) / 10),
      createdAt: now(),
    };
    await sr_create(SN, 'learning_path', path);
    return path;
  }

  async injectJustInTime(employeeId: string, trigger: string, skill: string): Promise<{ employeeId: string; intervention: string; resources: string[]; estimatedMinutes: number; trigger: string }> {
    return {
      employeeId,
      intervention: `Just-in-time ${skill} micro-learning triggered by ${trigger}`,
      resources: [
        `Quick reference: ${skill} best practices (5 min read)`,
        `Interactive ${skill} coding kata (15 min)`,
        `Ask-an-expert: Connect with ${skill} champion in Slack`,
      ],
      estimatedMinutes: 20,
      trigger,
    };
  }
}

export const cendiaAcademyService = new CendiaAcademyService();
