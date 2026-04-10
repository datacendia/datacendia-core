// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list, sr_get } from './_base.js';

export type InvestorType = 'institutional' | 'venture' | 'angel' | 'strategic' | 'retail' | 'insider';

export interface Investor {
  id: string;
  name: string;
  firm?: string;
  type: InvestorType;
  ownershipPercent: number;
  sharesHeld: number;
  investedCapital: number;
  currentValue: number;
  unrealizedGain: number;
  lastContactDate?: string;
  sentiment: 'bullish' | 'neutral' | 'cautious' | 'bearish';
  leadInvestor: boolean;
  boardSeat: boolean;
  createdAt: string;
}

export interface IREvent {
  id: string;
  type: 'earnings_call' | 'investor_day' | 'roadshow' | 'board_meeting' | 'sec_filing' | 'analyst_call';
  title: string;
  date: string;
  description: string;
  participants: string[];
  status: 'upcoming' | 'completed' | 'canceled';
}

const SN = 'CendiaEquity';
const investors = new Map<string, Investor>();

const SAMPLE_INVESTORS: Investor[] = [
  { id: 'inv-1', name: 'Sequoia Capital', firm: 'Sequoia Capital', type: 'venture', ownershipPercent: 18.5, sharesHeld: 4625000, investedCapital: 12000000, currentValue: 46250000, unrealizedGain: 34250000, lastContactDate: new Date(Date.now() - 15 * 86400000).toISOString(), sentiment: 'bullish', leadInvestor: true, boardSeat: true, createdAt: now() },
  { id: 'inv-2', name: 'Andreessen Horowitz', firm: 'a16z', type: 'venture', ownershipPercent: 12.2, sharesHeld: 3050000, investedCapital: 8000000, currentValue: 30500000, unrealizedGain: 22500000, lastContactDate: new Date(Date.now() - 7 * 86400000).toISOString(), sentiment: 'bullish', leadInvestor: false, boardSeat: true, createdAt: now() },
  { id: 'inv-3', name: 'Tiger Global', firm: 'Tiger Global Management', type: 'institutional', ownershipPercent: 7.8, sharesHeld: 1950000, investedCapital: 15000000, currentValue: 19500000, unrealizedGain: 4500000, lastContactDate: new Date(Date.now() - 30 * 86400000).toISOString(), sentiment: 'neutral', leadInvestor: false, boardSeat: false, createdAt: now() },
];

class CendiaEquityService {
  addInvestor(input: Partial<Investor>): Investor {
    const investor: Investor = {
      id: generateId(), name: input.name || 'New Investor', firm: input.firm, type: input.type || 'institutional',
      ownershipPercent: input.ownershipPercent || 0, sharesHeld: input.sharesHeld || 0,
      investedCapital: input.investedCapital || 0, currentValue: input.currentValue || 0,
      unrealizedGain: (input.currentValue || 0) - (input.investedCapital || 0),
      sentiment: 'neutral', leadInvestor: input.leadInvestor || false, boardSeat: input.boardSeat || false,
      createdAt: now(),
    };
    investors.set(investor.id, investor);
    sr_create(SN, 'investor', investor).catch(() => {});
    return investor;
  }

  getInvestor(id: string): Investor | undefined {
    if (investors.size === 0) SAMPLE_INVESTORS.forEach((i) => investors.set(i.id, i));
    return investors.get(id) || SAMPLE_INVESTORS.find((i) => i.id === id);
  }

  getUpcomingEvents(days: number): IREvent[] {
    const cutoff = new Date(Date.now() + days * 86400000);
    const events: IREvent[] = [
      { id: 'ev-1', type: 'earnings_call', title: 'Q4 Earnings Call', date: new Date(Date.now() + 21 * 86400000).toISOString(), description: 'Q4 and FY earnings release', participants: ['CEO', 'CFO', 'Investor Relations'], status: 'upcoming' },
      { id: 'ev-2', type: 'investor_day', title: 'Annual Investor Day', date: new Date(Date.now() + 65 * 86400000).toISOString(), description: 'Strategic roadmap and product vision presentation', participants: ['Leadership Team', 'Top 20 investors'], status: 'upcoming' },
      { id: 'ev-3', type: 'board_meeting', title: 'Q1 Board Meeting', date: new Date(Date.now() + 14 * 86400000).toISOString(), description: 'Quarterly board review', participants: ['Board Members', 'CEO', 'CFO'], status: 'upcoming' },
    ];
    return events.filter((e) => new Date(e.date) <= cutoff);
  }

  async prepareEarningsCall(quarterEnd: string, metrics: Record<string, any>): Promise<{ script: string; keyMessages: string[]; anticipatedQuestions: string[]; riskTopics: string[] }> {
    return {
      script: `Good morning and thank you for joining Datacendia's Q${metrics.quarter ?? 4} earnings call. I'm pleased to report another quarter of strong execution...`,
      keyMessages: [
        `ARR grew ${metrics.arrGrowth ?? 42}% YoY, demonstrating continued market momentum`,
        `Net Revenue Retention of ${metrics.nrr ?? 118}% confirms our land-and-expand strategy`,
        `Enterprise customer count increased ${metrics.enterpriseGrowth ?? 28}% — validating our upmarket motion`,
        'Path to profitability remains on track for H2 next fiscal year',
      ],
      anticipatedQuestions: [
        'How are macro headwinds impacting your pipeline?',
        'What is your competitive positioning vs Vanta and OneTrust?',
        'When do you expect to reach free cash flow break-even?',
        'What is your international expansion timeline?',
      ],
      riskTopics: ['Customer concentration risk', 'Burn rate vs growth trade-off', 'Regulatory compliance market saturation'],
    };
  }

  async simulateEarningsPhrase(phrase: string): Promise<{ phrase: string; perceivedSentiment: string; analystImpact: string; suggestedAlternative: string; legalRisk: string }> {
    const hasPositiveWords = /growth|strong|momentum|record/i.test(phrase);
    return {
      phrase,
      perceivedSentiment: hasPositiveWords ? 'positive' : 'neutral/cautious',
      analystImpact: hasPositiveWords ? 'Likely viewed as confident guidance — could set high bar for next quarter' : 'Could signal concern — analysts may read downside risk',
      suggestedAlternative: hasPositiveWords ? phrase : `We remain focused on disciplined execution and are seeing ${phrase.toLowerCase().replace('we expect', 'early indicators of')}`,
      legalRisk: 'Forward-looking statement — ensure Safe Harbor language is present. Avoid specific numeric projections without proper qualification.',
    };
  }
}

export const cendiaEquityService = new CendiaEquityService();
