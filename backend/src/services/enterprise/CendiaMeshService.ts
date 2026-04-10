// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_get } from './_base.js';

export interface CultureProfile {
  id: string;
  organizationName: string;
  dimensions: {
    hierarchy: number;
    collaboration: number;
    innovation: number;
    stability: number;
    customerFocus: number;
    riskTolerance: number;
  };
  dominantValues: string[];
  communicationStyle: string;
  decisionMakingStyle: string;
  techAdoptionScore: number;
  createdAt: string;
}

export interface IntegrationRoadmap {
  id: string;
  name: string;
  acquirerId: string;
  targetId: string;
  compatibilityScore: number;
  phases: { phase: number; name: string; duration: string; objectives: string[]; risks: string[] }[];
  keyRisks: string[];
  successMetrics: string[];
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

const SN = 'CendiaMesh';
const profiles = new Map<string, CultureProfile>();
const roadmaps = new Map<string, IntegrationRoadmap>();

class CendiaMeshService {
  async assessCulture(data: { organizationName: string; surveyResponses?: Record<string, any> }): Promise<CultureProfile> {
    const profile: CultureProfile = {
      id: generateId(),
      organizationName: data.organizationName,
      dimensions: {
        hierarchy: Math.round(30 + Math.random() * 60),
        collaboration: Math.round(50 + Math.random() * 45),
        innovation: Math.round(40 + Math.random() * 55),
        stability: Math.round(35 + Math.random() * 50),
        customerFocus: Math.round(55 + Math.random() * 40),
        riskTolerance: Math.round(40 + Math.random() * 50),
      },
      dominantValues: ['Customer obsession', 'Ownership', 'Bias for action'].sort(() => Math.random() - 0.5).slice(0, 3),
      communicationStyle: Math.random() > 0.5 ? 'Direct and data-driven' : 'Consensus-oriented with extensive documentation',
      decisionMakingStyle: Math.random() > 0.5 ? 'Decentralized — individual contributors empowered' : 'Centralized — executive approval required',
      techAdoptionScore: Math.round(60 + Math.random() * 35),
      createdAt: now(),
    };
    profiles.set(profile.id, profile);
    await sr_create(SN, 'culture_profile', profile);
    return profile;
  }

  async compareCultures(acquirerId: string, targetId: string): Promise<{ acquirer: CultureProfile; target: CultureProfile; compatibilityScore: number; gaps: string[]; synergies: string[]; integrationComplexity: string }> {
    const acquirer = profiles.get(acquirerId) || { id: acquirerId, organizationName: 'Acquirer', dimensions: { hierarchy: 40, collaboration: 70, innovation: 80, stability: 50, customerFocus: 85, riskTolerance: 65 }, dominantValues: ['Speed', 'Innovation'], communicationStyle: 'Direct', decisionMakingStyle: 'Decentralized', techAdoptionScore: 88, createdAt: now() } as CultureProfile;
    const target = profiles.get(targetId) || { id: targetId, organizationName: 'Target', dimensions: { hierarchy: 75, collaboration: 45, innovation: 55, stability: 80, customerFocus: 60, riskTolerance: 35 }, dominantValues: ['Stability', 'Process'], communicationStyle: 'Formal documentation', decisionMakingStyle: 'Centralized', techAdoptionScore: 55, createdAt: now() } as CultureProfile;
    const compatibilityScore = Math.round(50 + Math.random() * 35);
    return {
      acquirer, target, compatibilityScore,
      gaps: ['Decision-making speed mismatch (decentralized vs centralized)', 'Technology adoption gap (88 vs 55)', 'Risk culture divergence — target is significantly more risk-averse'],
      synergies: ['Complementary customer bases', 'Target brings process maturity', 'Combined talent pool fills key skill gaps'],
      integrationComplexity: compatibilityScore > 70 ? 'Low — cultures align well, focus on process harmonization' : compatibilityScore > 50 ? 'Medium — 12-18 month integration program recommended' : 'High — cultural transformation required, risk of talent attrition is significant',
    };
  }

  async generateIntegrationRoadmap(acquirerId: string, targetId: string, name: string): Promise<IntegrationRoadmap> {
    const roadmap: IntegrationRoadmap = {
      id: generateId(), name, acquirerId, targetId, compatibilityScore: Math.round(55 + Math.random() * 35),
      phases: [
        { phase: 1, name: 'Day 1 Readiness', duration: '0-30 days', objectives: ['Communicate acquisition rationale', 'Retain key talent — sign retention agreements', 'Establish integration governance structure'], risks: ['Key person attrition', 'Communication vacuum creating anxiety'] },
        { phase: 2, name: 'Foundation Building', duration: '30-90 days', objectives: ['Harmonize compensation bands', 'Consolidate tech stacks — identify redundancies', 'Joint OKR alignment'], risks: ['Process conflicts slowing execution', 'Culture shock in target organization'] },
        { phase: 3, name: 'Integration Acceleration', duration: '90-180 days', objectives: ['Merge product roadmaps', 'Cross-pollinate best practices', 'Begin customer migration to unified platform'], risks: ['Customer churn during transition', 'Engineering team context-switching cost'] },
        { phase: 4, name: 'Optimization', duration: '180-365 days', objectives: ['Achieve full operational integration', 'Realize cost synergies', 'Launch combined product to market'], risks: ['Synergy realization below forecast', 'Market window missed due to integration delays'] },
      ],
      keyRisks: ['Talent attrition in first 90 days', 'Customer churn due to uncertainty', 'Technology integration cost overruns'],
      successMetrics: ['<10% voluntary attrition of key talent in Year 1', '>90% customer retention through transition', 'Cost synergies >$2M realized by Month 12'],
      status: 'draft',
      createdAt: now(),
    };
    roadmaps.set(roadmap.id, roadmap);
    await sr_create(SN, 'roadmap', roadmap);
    return roadmap;
  }

  getRoadmap(id: string): IntegrationRoadmap | undefined {
    return roadmaps.get(id);
  }
}

export const cendiaMeshService = new CendiaMeshService();
