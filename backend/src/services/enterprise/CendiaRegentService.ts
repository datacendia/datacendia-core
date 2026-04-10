// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list } from './_base.js';

export interface Advisor {
  id: string;
  name: string;
  archetype: string;
  expertise: string[];
  decisionStyle: string;
  famousFor: string;
  isCustom: boolean;
  createdAt: string;
}

export interface RegentSession {
  id: string;
  question: string;
  context?: string;
  advisorIds: string[];
  perspectives: { advisorId: string; advisorName: string; perspective: string; recommendation: string; confidence: number }[];
  synthesis: string;
  decision?: string;
  createdAt: string;
}

const SN = 'CendiaRegent';

const BUILT_IN_ADVISORS: Advisor[] = [
  { id: 'ra-bezos', name: 'The Customer Obsessor', archetype: 'Customer-Centric CEO', expertise: ['long-term thinking', 'customer experience', 'scale'], decisionStyle: 'Work backwards from customer outcomes', famousFor: 'Day 1 mentality, 6-pager memos', isCustom: false, createdAt: now() },
  { id: 'ra-grove', name: 'The Intel Strategist', archetype: 'Paranoid Operator', expertise: ['competitive strategy', 'operational excellence', 'crisis management'], decisionStyle: 'Only the paranoid survive — data over intuition', famousFor: 'Strategic inflection points framework', isCustom: false, createdAt: now() },
  { id: 'ra-jobs', name: 'The Simplifier', archetype: 'Product Visionary', expertise: ['product design', 'brand', 'simplicity'], decisionStyle: 'Say no to 1000 things', famousFor: 'Insanely great product focus', isCustom: false, createdAt: now() },
  { id: 'ra-buffett', name: 'The Value Allocator', archetype: 'Capital Disciplinarian', expertise: ['capital allocation', 'moats', 'long-term value'], decisionStyle: 'Price is what you pay, value is what you get', famousFor: 'Compounding and patience', isCustom: false, createdAt: now() },
  { id: 'ra-iger', name: 'The Brand Builder', archetype: 'Creative CEO', expertise: ['M&A integration', 'brand extension', 'creative strategy'], decisionStyle: 'Optimism is a strategy', famousFor: 'Pixar, Marvel, Star Wars acquisitions', isCustom: false, createdAt: now() },
];

const customAdvisors: Advisor[] = [];
const sessions: RegentSession[] = [];

class CendiaRegentService {
  getAdvisors(): Advisor[] {
    return [...BUILT_IN_ADVISORS, ...customAdvisors];
  }

  addCustomAdvisor(input: Partial<Advisor>): Advisor {
    const advisor: Advisor = {
      id: generateId(), name: input.name || 'Custom Advisor', archetype: input.archetype || 'Strategic Advisor',
      expertise: input.expertise || [], decisionStyle: input.decisionStyle || 'Evidence-based', famousFor: input.famousFor || '',
      isCustom: true, createdAt: now(),
    };
    customAdvisors.push(advisor);
    sr_create(SN, 'advisor', advisor).catch(() => {});
    return advisor;
  }

  async consultCouncil(question: string, context: string, advisorIds?: string[]): Promise<RegentSession> {
    const allAdvisors = this.getAdvisors();
    const selected = advisorIds?.length ? allAdvisors.filter((a) => advisorIds.includes(a.id)) : allAdvisors.slice(0, 3);
    const perspectives = selected.map((advisor) => ({
      advisorId: advisor.id,
      advisorName: advisor.name,
      perspective: `From a ${advisor.archetype} lens: this decision requires careful consideration of ${advisor.expertise[0]} and ${advisor.expertise[1] ?? 'execution'}. ${advisor.decisionStyle}.`,
      recommendation: `Apply the ${advisor.famousFor} principle. Start with a clear hypothesis, gather data, and make a reversible decision first.`,
      confidence: Math.round(70 + Math.random() * 25),
    }));
    const session: RegentSession = {
      id: generateId(), question, context, advisorIds: selected.map((a) => a.id), perspectives,
      synthesis: `Council synthesis: The majority perspective recommends a phased approach, prioritizing ${perspectives[0]?.recommendation ?? 'data-driven decision-making'}. Consider reversible decisions first before committing resources.`,
      createdAt: now(),
    };
    sessions.push(session);
    sr_create(SN, 'session', session).catch(() => {});
    return session;
  }

  async revealMirrorTruth(topic: string, ceoBeliefs: string[], data: Record<string, any>): Promise<{ blindSpots: string[]; challengingQuestions: string[]; uncomfortableTruths: string[]; alternativeFramings: string[] }> {
    return {
      blindSpots: ['Confirmation bias in market data interpretation', 'Availability bias toward recent wins', 'Overconfidence in execution speed'],
      challengingQuestions: [`What evidence would change your view on ${topic}?`, 'What are your most vocal critics saying that might be right?', 'If this decision fails, what will the post-mortem say?'],
      uncomfortableTruths: ['The team agrees in meetings but disagrees privately', 'Customer NPS masks a segment that is deeply unhappy', 'Growth is masking structural margin compression'],
      alternativeFramings: ['Pre-mortem: design for failure first', 'Inversion: what would you do if you wanted this to fail?', 'Steel-man the opposition argument'],
    };
  }

  async getDailyMirror(recentDecisions: string[], metrics: Record<string, any>): Promise<{ insight: string; watchItems: string[]; energyFocus: string }> {
    return {
      insight: `Based on recent decisions (${recentDecisions.slice(0, 2).join(', ')}), the pattern suggests over-indexing on short-term metrics. The council recommends a quarterly review cadence reset.`,
      watchItems: ['Customer churn in enterprise segment trending up', 'Burn rate acceleration vs plan', 'Engineering velocity slowdown in core product'],
      energyFocus: 'Protect strategic planning time — operational tasks are crowding the calendar.',
    };
  }

  getSessions(limit: number): RegentSession[] {
    return sessions.slice(-limit).reverse();
  }
}

export const cendiaRegentService = new CendiaRegentService();
