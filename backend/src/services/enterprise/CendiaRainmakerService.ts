// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list, sr_get } from './_base.js';

export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  closeDate: string;
  industry: string;
  source: string;
  notes?: string;
  slippingRisk: number;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineMetrics {
  totalDeals: number;
  totalPipelineValue: number;
  weightedValue: number;
  averageDealSize: number;
  winRate: number;
  avgSalesCycleDays: number;
  dealsAtRisk: number;
}

const SN = 'CendiaRainmaker';
const SAMPLE_DEALS: Deal[] = [
  { id: 'deal-1', name: 'Compliance Platform — Acme Corp', company: 'Acme Corp', contact: 'Jane Smith', value: 240000, currency: 'USD', stage: 'negotiation', probability: 70, closeDate: new Date(Date.now() + 25 * 86400000).toISOString(), industry: 'Financial Services', source: 'outbound', slippingRisk: 35, createdAt: new Date(Date.now() - 45 * 86400000).toISOString(), updatedAt: now() },
  { id: 'deal-2', name: 'Enterprise Suite — TechVenture', company: 'TechVenture', contact: 'Bob Lee', value: 480000, currency: 'USD', stage: 'proposal', probability: 45, closeDate: new Date(Date.now() + 50 * 86400000).toISOString(), industry: 'Technology', source: 'inbound', slippingRisk: 60, createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: now() },
];

class CendiaRainmakerService {
  addDeal(input: Partial<Deal>): Deal {
    const deal: Deal = {
      id: generateId(), name: input.name || 'New Deal', company: input.company || '', contact: input.contact || '',
      value: input.value || 0, currency: input.currency || 'USD', stage: input.stage || 'prospecting',
      probability: input.probability || 25, closeDate: input.closeDate || new Date(Date.now() + 90 * 86400000).toISOString(),
      industry: input.industry || 'Other', source: input.source || 'direct', slippingRisk: 10,
      createdAt: now(), updatedAt: now(),
    };
    sr_create(SN, 'deal', deal).catch(() => {});
    return deal;
  }

  async predictDealOutcome(id: string): Promise<{ dealId: string; winProbability: number; riskFactors: string[]; recommendedActions: string[]; predictedCloseDate: string }> {
    const deal = SAMPLE_DEALS.find((d) => d.id === id);
    const winProb = deal ? deal.probability + Math.round((Math.random() - 0.5) * 10) : 50;
    return {
      dealId: id,
      winProbability: Math.max(5, Math.min(95, winProb)),
      riskFactors: ['Decision maker not yet engaged', 'Competitive evaluation underway', 'Budget approval pending'],
      recommendedActions: ['Schedule executive sponsor meeting', 'Provide ROI analysis', 'Offer proof-of-concept extension'],
      predictedCloseDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    };
  }

  async getSlippingDeals(): Promise<Deal[]> {
    const all = [...SAMPLE_DEALS];
    return all.filter((d) => d.slippingRisk > 40);
  }

  async generateExecutiveLetter(dealId: string, purpose: string): Promise<{ subject: string; body: string; tone: string }> {
    const deal = SAMPLE_DEALS.find((d) => d.id === dealId);
    return {
      subject: `Partnership Opportunity — Datacendia Enterprise Platform`,
      body: `Dear ${deal?.contact ?? 'Executive'},\n\nAs CEO of Datacendia, I wanted to personally reach out regarding our ongoing discussions with ${deal?.company ?? 'your organization'}. Our platform has helped industry leaders achieve 40% reduction in compliance overhead...\n\nI'd welcome a 30-minute call to discuss how we can tailor our solution to your specific needs.\n\nBest regards,\nCEO, Datacendia`,
      tone: purpose,
    };
  }

  async analyzeCall(dealId: string, transcript: string, participants: string[]): Promise<{ sentiment: string; keyMoments: string[]; objections: string[]; nextSteps: string[]; coachingTips: string[] }> {
    return {
      sentiment: 'positive',
      keyMoments: ['Customer confirmed budget allocation', 'Competitor mentioned (Vanta)', 'Security requirements discussed in depth'],
      objections: ['Price point vs alternatives', 'Implementation timeline concern'],
      nextSteps: ['Send security whitepaper', 'Schedule technical deep-dive', 'Provide customer reference'],
      coachingTips: ['Address implementation concern proactively in next call', 'Highlight differentiators vs Vanta', 'Bring CSO into next conversation'],
    };
  }

  async getWhisperCoaching(dealId: string, context: string): Promise<{ tips: string[]; urgencyLevel: string; suggestedTalkTracks: string[] }> {
    return {
      tips: ['Lead with business outcomes, not features', 'Reference Acme Corp success story', 'Ask about Q4 budget timeline'],
      urgencyLevel: 'medium',
      suggestedTalkTracks: ['ROI-focused open', 'Competitive differentiation', 'Risk mitigation close'],
    };
  }

  getPipelineMetrics(): PipelineMetrics {
    return { totalDeals: 28, totalPipelineValue: 4_200_000, weightedValue: 1_890_000, averageDealSize: 150_000, winRate: 34, avgSalesCycleDays: 78, dealsAtRisk: 6 };
  }
}

export const cendiaRainmakerService = new CendiaRainmakerService();
