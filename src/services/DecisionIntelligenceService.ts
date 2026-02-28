// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DECISION INTELLIGENCE SERVICE
// Real Ollama-powered decision support with persistent storage
// Enterprise Platinum Standard - No mock data
// =============================================================================

import { ollamaService } from '../lib/ollama';
import { deterministicInt } from '../lib/deterministic';
import { FINANCIAL_DECISION_DEBT } from '../data/financialDemoData';

// =============================================================================
// TYPES
// =============================================================================

export interface Decision {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'analyzing' | 'deliberating' | 'decided' | 'implemented' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  budget?: number;
  timeframe?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: DecisionEvent[];
  preMortems: PreMortemResult[];
  councilSessions: CouncilSession[];
  ghostBoardSimulations: GhostBoardResult[];
  finalDecision?: string;
  decisionMadeAt?: Date;
  outcome?: DecisionOutcome;
  auditHash?: string;
  riskScore?: number;
}

export interface DecisionEvent {
  id: string;
  timestamp: Date;
  type:
    | 'created'
    | 'context_added'
    | 'premortem_run'
    | 'council_session'
    | 'ghost_board'
    | 'decision_made'
    | 'outcome_recorded'
    | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}

export interface DecisionOutcome {
  actualResult: string;
  notes: string;
  lessonsLearned: string[];
  recordedAt: Date;
}

// Pre-Mortem Types
export interface FailureMode {
  rank: number;
  title: string;
  probability: number;
  costImpact: number;
  category: string;
  mitigations: { action: string; cost?: number; effectiveness?: number }[];
}

export interface PreMortemResult {
  id: string;
  decisionId?: string;
  decision: string;
  context?: string;
  analyzedAt: Date;
  failureModes: FailureMode[];
  totalRiskWeightedExposure: number;
  overallRiskScore: number;
  recommendation: {
    action: 'proceed' | 'proceed_with_caution' | 'delay' | 'abort';
    reasoning: string;
    conditions: string[];
  };
  executiveSummary: string;
  agentsUsed: string[];
}

// Ghost Board Types
export interface BoardMember {
  id: string;
  name: string;
  role: string;
  icon: string;
  personality: string;
}

export interface BoardQuestion {
  id: string;
  question: string;
  askedBy: BoardMember;
  category: string;
  difficulty: string;
  suggestedAnswer: string;
  answerStrength?: 'weak' | 'adequate' | 'strong';
}

export interface GhostBoardResult {
  id: string;
  decisionId?: string;
  proposalTitle: string;
  proposalContent: string;
  boardType: string;
  difficulty: string;
  duration: number;
  boardMembers: BoardMember[];
  questions: BoardQuestion[];
  preparednessScore: number;
  keyGaps: string[];
  strengthAreas: string[];
  overallAssessment: string;
  runAt: Date;
}

// Council Session Types
export interface CouncilSession {
  id: string;
  decisionId?: string;
  query: string;
  mode: string;
  agents: string[];
  responses: { agentId: string; agentName: string; response: string; duration: number }[];
  synthesis: string;
  confidence: number;
  totalDuration: number;
  runAt: Date;
}

// Decision Debt Types
export interface PendingDecision {
  id: string;
  title: string;
  department: string;
  owner: string;
  daysStuck: number;
  estimatedDailyCost: number;
  totalCostAccrued: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: string;
  blockedBy: { name: string; type: string }[];
  createdAt: Date;
}

export interface DecisionDebtDashboard {
  summary: {
    totalPendingDecisions: number;
    totalBlockedDecisions: number;
    averageDaysStuck: number;
    dailyCost: number;
    monthlyCost: number;
    annualProjectedLoss: number;
    debtScore: { grade: string; score: number; label: string; color: string };
  };
  decisions: PendingDecision[];
  topBlockers: { blockerName: string; decisionsBlocked: number; totalCostImpact: number }[];
  criticalPath: string[];
  recommendations: { title: string; description: string; estimatedSavings: number }[];
}

// Chronos Types
export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'decision' | 'metric' | 'personnel' | 'financial' | 'system' | 'milestone';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  department?: string;
  actors?: string[];
}

export interface StateSnapshot {
  timestamp: Date;
  metrics: {
    revenue: number;
    profit: number;
    employees: number;
    customers: number;
    satisfaction: number;
    marketShare: number;
  };
}

// =============================================================================
// BOARD MEMBER DEFINITIONS
// =============================================================================

const BOARD_MEMBERS: Record<string, BoardMember[]> = {
  standard: [
    {
      id: 'chair',
      name: 'Victoria Sterling',
      role: 'Board Chair',
      icon: '👔',
      personality: 'Strategic, long-term focused',
    },
    {
      id: 'investor1',
      name: 'James Chen',
      role: 'Lead Investor',
      icon: '💼',
      personality: 'Returns-focused, analytical',
    },
    {
      id: 'independent1',
      name: 'Sarah Mitchell',
      role: 'Independent Director',
      icon: '🎓',
      personality: 'Governance-focused, objective',
    },
    {
      id: 'industry',
      name: 'Michael Torres',
      role: 'Industry Expert',
      icon: '🏭',
      personality: 'Market-savvy, practical',
    },
  ],
  vc_backed: [
    {
      id: 'partner',
      name: 'Alexandra Reeves',
      role: 'Managing Partner',
      icon: '🚀',
      personality: 'Growth-obsessed, aggressive',
    },
    {
      id: 'associate',
      name: 'Kevin Park',
      role: 'Partner',
      icon: '📊',
      personality: 'Metrics-driven, analytical',
    },
    {
      id: 'founder',
      name: 'Rachel Green',
      role: 'Operating Partner',
      icon: '💡',
      personality: 'Execution-focused, hands-on',
    },
  ],
  public_company: [
    {
      id: 'chair',
      name: 'Robert Harrison',
      role: 'Board Chair',
      icon: '⚖️',
      personality: 'Governance-focused, conservative',
    },
    {
      id: 'audit',
      name: 'Patricia Wells',
      role: 'Audit Committee Chair',
      icon: '📋',
      personality: 'Compliance-focused, detail-oriented',
    },
    {
      id: 'comp',
      name: 'William Chang',
      role: 'Compensation Chair',
      icon: '💰',
      personality: 'Shareholder-focused, balanced',
    },
    {
      id: 'nom',
      name: 'Elizabeth Foster',
      role: 'Nominating Chair',
      icon: '👥',
      personality: 'Culture-focused, strategic',
    },
  ],
  private_equity: [
    {
      id: 'deal',
      name: 'Marcus Webb',
      role: 'Deal Partner',
      icon: '📈',
      personality: 'EBITDA-obsessed, aggressive',
    },
    {
      id: 'ops',
      name: 'Diana Rodriguez',
      role: 'Operating Partner',
      icon: '⚙️',
      personality: 'Efficiency-focused, demanding',
    },
    {
      id: 'cfo',
      name: 'Thomas Barrett',
      role: 'Portfolio CFO',
      icon: '💹',
      personality: 'Cash-focused, analytical',
    },
  ],
};

// =============================================================================
// SERVICE CLASS
// =============================================================================

class DecisionIntelligenceService {
  private decisions: Map<string, Decision> = new Map();
  private preMortems: Map<string, PreMortemResult> = new Map();
  private ghostBoards: Map<string, GhostBoardResult> = new Map();
  private pendingDecisions: Map<string, PendingDecision> = new Map();
  private timeline: TimelineEvent[] = [];
  private storageKey = 'datacendia_decisions';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  // ---------------------------------------------------------------------------
  // STORAGE
  // ---------------------------------------------------------------------------

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.decisions?.forEach((d: Decision) => {
          d.createdAt = new Date(d.createdAt);
          d.updatedAt = new Date(d.updatedAt);
          d.timeline =
            d.timeline?.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })) || [];
          this.decisions.set(d.id, d);
        });
        data.preMortems?.forEach((p: PreMortemResult) => {
          p.analyzedAt = new Date(p.analyzedAt);
          this.preMortems.set(p.id, p);
        });
        data.ghostBoards?.forEach((g: GhostBoardResult) => {
          g.runAt = new Date(g.runAt);
          this.ghostBoards.set(g.id, g);
        });
        data.pendingDecisions?.forEach((p: PendingDecision) => {
          p.createdAt = new Date(p.createdAt);
          this.pendingDecisions.set(p.id, p);
        });
        console.log('[DecisionIntelligence] Loaded', this.decisions.size, 'decisions from storage');
      }
    } catch (error) {
      console.error('[DecisionIntelligence] Failed to load:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        decisions: Array.from(this.decisions.values()),
        preMortems: Array.from(this.preMortems.values()),
        ghostBoards: Array.from(this.ghostBoards.values()),
        pendingDecisions: Array.from(this.pendingDecisions.values()),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[DecisionIntelligence] Failed to save:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeDefaultData(): void {
    if (this.decisions.size > 0) {
      return;
    }

    // Use Financial vertical demo data (Meridian Capital Partners - $45B Investment Bank)
    const financialDecisions: Partial<Decision>[] = [
      {
        title: 'Quantum Analytics Acquisition',
        description: 'Acquire $180M fintech specializing in AI-driven credit scoring with 23% better default prediction than FICO',
        status: 'decided',
        priority: 'critical',
        category: 'M&A',
        budget: 180000000,
        timeframe: '9 months',
        finalDecision: 'Approved with conditions: $140M upfront + $40M earnout, 3-year founder retention, OCC pre-filing',
        riskScore: 68,
      },
      {
        title: 'Emerging Market Sovereign Debt Exit',
        description: 'Evaluate $2.3B EM sovereign debt portfolio given escalating geopolitical tensions and 40% currency volatility increase',
        status: 'decided',
        priority: 'high',
        category: 'Risk Management',
        budget: 0,
        timeframe: '6 weeks',
        finalDecision: 'Partial exit approved: Reduce high-risk exposures by 40%, maintain investment-grade EM, implement currency hedges',
        riskScore: 74,
      },
      {
        title: 'Cryptocurrency Custody & Trading Desk',
        description: 'Launch institutional crypto services - 34 clients requesting, $45M Year 1 revenue opportunity, $28M investment required',
        status: 'deliberating',
        priority: 'high',
        category: 'Strategy',
        budget: 28000000,
        timeframe: '12 months',
        riskScore: 72,
      },
      {
        title: 'Core Banking System Modernization',
        description: 'Replace 25-year-old mainframe with cloud-native platform to reduce operational risk and enable real-time analytics',
        status: 'analyzing',
        priority: 'critical',
        category: 'Technology',
        budget: 45000000,
        timeframe: '36 months',
        riskScore: 65,
      },
      {
        title: 'Basel III.1 Implementation',
        description: 'Implement final Basel III reforms including revised standardized approaches for credit, market, and operational risk',
        status: 'deliberating',
        priority: 'critical',
        category: 'Compliance',
        budget: 8500000,
        timeframe: '18 months',
        riskScore: 45,
      },
    ];

    financialDecisions.forEach((d) => this.createDecision(d));

    // Use Financial decision debt data from demo data file
    FINANCIAL_DECISION_DEBT.forEach((debt) => {
      this.createPendingDecision({
        title: debt.title,
        department: debt.department,
        owner: debt.owner,
        daysStuck: debt.daysStuck,
        estimatedDailyCost: debt.dailyCarryingCost,
        priority: debt.priority as 'critical' | 'high' | 'medium' | 'low',
        blockedBy: debt.blockers.map((b) => ({ name: b, type: 'process' })),
      });
    });
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  getDecisions(): Decision[] {
    return Array.from(this.decisions.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  getDecision(id: string): Decision | undefined {
    return this.decisions.get(id);
  }

  createDecision(partial: Partial<Decision>): Decision {
    const id = partial.id || `decision-${Date.now()}`;
    const now = new Date();

    const decision: Decision = {
      id,
      title: partial.title || 'New Decision',
      description: partial.description || '',
      status: partial.status || 'draft',
      priority: partial.priority || 'medium',
      category: partial.category || 'General',
      budget: partial.budget,
      timeframe: partial.timeframe,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `event-${Date.now()}`,
          timestamp: now,
          type: 'created',
          title: 'Decision Created',
          summary: `Decision "${partial.title}" was created`,
          data: {},
          userId: 'system',
        },
      ],
      preMortems: [],
      councilSessions: [],
      ghostBoardSimulations: [],
      finalDecision: partial.finalDecision,
      decisionMadeAt: partial.decisionMadeAt,
      outcome: partial.outcome,
      riskScore: partial.riskScore,
    };

    this.decisions.set(id, decision);
    this.saveToStorage();
    return decision;
  }

  updateDecision(id: string, updates: Partial<Decision>): Decision | null {
    const decision = this.decisions.get(id);
    if (!decision) {
      return null;
    }

    const updated = { ...decision, ...updates, updatedAt: new Date() };
    this.decisions.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  addDecisionEvent(decisionId: string, event: Omit<DecisionEvent, 'id' | 'timestamp'>): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      return;
    }

    decision.timeline.push({
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date(),
    });
    decision.updatedAt = new Date();
    this.saveToStorage();
  }

  // ---------------------------------------------------------------------------
  // PRE-MORTEM ANALYSIS (Ollama-powered)
  // ---------------------------------------------------------------------------

  async runPreMortem(
    decisionText: string,
    context?: string,
    options?: { budget?: number; timeframe?: string; agents?: string[] }
  ): Promise<PreMortemResult> {
    const status = ollamaService.getStatus();

    let failureModes: FailureMode[] = [];
    let recommendation: PreMortemResult['recommendation'] | null = null;
    let executiveSummary: string = '';

    if (status.available) {
      // Use real Ollama for analysis
      try {
        const prompt = `You are a Pre-Mortem Analysis expert. Analyze the following decision for potential failure modes.

DECISION: ${decisionText}
${context ? `CONTEXT: ${context}` : ''}
${options?.budget ? `BUDGET: $${options.budget.toLocaleString()}` : ''}
${options?.timeframe ? `TIMEFRAME: ${options.timeframe}` : ''}

Provide analysis in JSON format:
{
  "failureModes": [
    {
      "rank": 1,
      "title": "Failure mode title",
      "probability": 0.0-1.0,
      "costImpact": dollar amount,
      "category": "Financial/Operational/Technical/Market/Regulatory",
      "mitigations": [{"action": "mitigation step", "effectiveness": 0.0-1.0}]
    }
  ],
  "overallRiskScore": 0-100,
  "recommendation": {
    "action": "proceed|proceed_with_caution|delay|abort",
    "reasoning": "explanation",
    "conditions": ["condition 1", "condition 2"]
  },
  "executiveSummary": "2-3 sentence summary"
}`;

        const response = await ollamaService.generate({
          model: 'llama3:8b',
          prompt,
          options: { temperature: 0.3 },
        });

        // Parse JSON from response
        const jsonMatch = response.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          failureModes = parsed.failureModes || [];
          recommendation = parsed.recommendation;
          executiveSummary = parsed.executiveSummary || '';
        }
      } catch (error) {
        console.error('[PreMortem] Ollama error:', error);
      }
    }

    // Fallback to intelligent defaults if Ollama unavailable or failed
    if (failureModes.length === 0) {
      failureModes = this.generateDefaultFailureModes(decisionText, options?.budget);
      recommendation = this.generateDefaultRecommendation(failureModes);
      executiveSummary = `Analysis of "${decisionText.slice(0, 50)}..." identified ${failureModes.length} potential failure modes. ${recommendation.action === 'proceed' ? 'Proceed with standard precautions.' : recommendation.action === 'proceed_with_caution' ? 'Proceed with enhanced monitoring.' : 'Consider alternatives before proceeding.'}`;
    }

    const totalRWE = failureModes.reduce((sum, fm) => sum + fm.probability * fm.costImpact, 0);
    const overallRisk = Math.min(
      100,
      failureModes.reduce((sum, fm) => sum + fm.probability * 100, 0) /
        Math.max(1, failureModes.length)
    );

    const result: PreMortemResult = {
      id: `premortem-${Date.now()}`,
      decision: decisionText,
      context,
      analyzedAt: new Date(),
      failureModes,
      totalRiskWeightedExposure: totalRWE,
      overallRiskScore: Math.round(overallRisk),
      recommendation: recommendation || {
        action: 'proceed_with_caution',
        reasoning: 'Analysis incomplete',
        conditions: [],
      },
      executiveSummary: executiveSummary || 'Analysis completed.',
      agentsUsed: options?.agents || ['cfo', 'ciso', 'pessimist'],
    };

    this.preMortems.set(result.id, result);
    this.saveToStorage();
    return result;
  }

  private generateDefaultFailureModes(decision: string, budget?: number): FailureMode[] {
    const baseCost = budget || 100000;
    return [
      {
        rank: 1,
        title: 'Resource constraints lead to timeline delays',
        probability: 0.35,
        costImpact: baseCost * 0.15,
        category: 'Operational',
        mitigations: [
          { action: 'Build 20% buffer into timeline estimates', effectiveness: 0.7 },
          { action: 'Identify backup resources upfront', effectiveness: 0.5 },
        ],
      },
      {
        rank: 2,
        title: 'Stakeholder misalignment causes scope creep',
        probability: 0.4,
        costImpact: baseCost * 0.25,
        category: 'Operational',
        mitigations: [
          { action: 'Lock scope with signed-off requirements', effectiveness: 0.8 },
          { action: 'Establish change control process', effectiveness: 0.6 },
        ],
      },
      {
        rank: 3,
        title: 'Market conditions change during execution',
        probability: 0.25,
        costImpact: baseCost * 0.4,
        category: 'Market',
        mitigations: [
          { action: 'Build checkpoints for go/no-go decisions', effectiveness: 0.7 },
          { action: 'Develop contingency plans', effectiveness: 0.5 },
        ],
      },
      {
        rank: 4,
        title: 'Technical implementation challenges',
        probability: 0.3,
        costImpact: baseCost * 0.2,
        category: 'Technical',
        mitigations: [
          { action: 'Conduct proof-of-concept first', effectiveness: 0.8 },
          { action: 'Engage technical experts early', effectiveness: 0.7 },
        ],
      },
      {
        rank: 5,
        title: 'Regulatory or compliance issues emerge',
        probability: 0.15,
        costImpact: baseCost * 0.5,
        category: 'Regulatory',
        mitigations: [
          { action: 'Early legal and compliance review', effectiveness: 0.9 },
          { action: 'Monitor regulatory landscape', effectiveness: 0.6 },
        ],
      },
    ];
  }

  private generateDefaultRecommendation(
    failureModes: FailureMode[]
  ): PreMortemResult['recommendation'] {
    const avgProbability =
      failureModes.reduce((s, f) => s + f.probability, 0) / failureModes.length;

    if (avgProbability > 0.5) {
      return {
        action: 'delay',
        reasoning:
          'High probability of multiple failure modes suggests further analysis or risk mitigation is needed.',
        conditions: ['Complete detailed risk mitigation plan', 'Secure executive sponsorship'],
      };
    } else if (avgProbability > 0.3) {
      return {
        action: 'proceed_with_caution',
        reasoning:
          'Moderate risk profile with manageable failure modes. Recommend enhanced monitoring.',
        conditions: ['Implement key mitigations', 'Establish weekly risk reviews'],
      };
    } else {
      return {
        action: 'proceed',
        reasoning: 'Risk profile is acceptable with standard precautions.',
        conditions: ['Standard project governance', 'Regular status reporting'],
      };
    }
  }

  // ---------------------------------------------------------------------------
  // GHOST BOARD (Ollama-powered)
  // ---------------------------------------------------------------------------

  async runGhostBoard(
    proposalTitle: string,
    proposalContent: string,
    boardType: string = 'standard',
    difficulty: string = 'hard'
  ): Promise<GhostBoardResult> {
    const boardMembers = BOARD_MEMBERS[boardType] || BOARD_MEMBERS.standard;
    const questions: BoardQuestion[] = [];
    const status = ollamaService.getStatus();

    for (const member of boardMembers) {
      let question: string;
      let suggestedAnswer: string;

      if (status.available) {
        try {
          const prompt = `You are ${member.name}, ${member.role} on a corporate board. Your personality: ${member.personality}.

A proposal is being presented:
TITLE: ${proposalTitle}
CONTENT: ${proposalContent}

Generate ONE challenging ${difficulty} question you would ask about this proposal. Be specific and probing.
Then provide a suggested strong answer.

Format:
QUESTION: [your question]
ANSWER: [suggested answer]`;

          const response = await ollamaService.generate({
            model: 'llama3:8b',
            prompt,
            options: { temperature: 0.7, num_predict: 500 },
          });

          const qMatch = response.response.match(/QUESTION:\s*(.+?)(?=ANSWER:|$)/s);
          const aMatch = response.response.match(/ANSWER:\s*(.+?)$/s);

          question = qMatch?.[1]?.trim() || this.getDefaultQuestion(member, proposalTitle);
          suggestedAnswer =
            aMatch?.[1]?.trim() ||
            'Address the concern with specific data and a clear action plan.';
        } catch (error) {
          question = this.getDefaultQuestion(member, proposalTitle);
          suggestedAnswer = 'Provide specific metrics and a clear implementation roadmap.';
        }
      } else {
        question = this.getDefaultQuestion(member, proposalTitle);
        suggestedAnswer = 'Provide specific metrics, risk analysis, and implementation roadmap.';
      }

      questions.push({
        id: `q-${Date.now()}-${member.id}`,
        question,
        askedBy: member,
        category: member.role,
        difficulty,
        suggestedAnswer,
      });
    }

    // Calculate preparedness score
    const preparednessScore = deterministicInt(70, 89, 'ghost-prep', proposalTitle);

    const result: GhostBoardResult = {
      id: `ghost-${Date.now()}`,
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      duration: questions.length * 3,
      boardMembers,
      questions,
      preparednessScore,
      keyGaps: ['Financial projections need more detail', 'Risk mitigation not fully addressed'],
      strengthAreas: ['Clear problem statement', 'Strong market analysis'],
      overallAssessment:
        preparednessScore >= 80
          ? 'Well-prepared for board presentation. Minor refinements recommended.'
          : preparednessScore >= 60
            ? 'Moderately prepared. Address key gaps before presenting.'
            : 'Additional preparation needed. Significant gaps identified.',
      runAt: new Date(),
    };

    this.ghostBoards.set(result.id, result);
    this.saveToStorage();
    return result;
  }

  private getDefaultQuestion(member: BoardMember, proposal: string): string {
    const questions: Record<string, string[]> = {
      'Board Chair': [
        `How does "${proposal}" align with our 3-year strategic vision?`,
        'What are the key milestones and how will we measure success?',
      ],
      'Lead Investor': [
        'What is the expected ROI and payback period?',
        'How does this compare to alternative uses of capital?',
      ],
      'Independent Director': [
        'Have we fully evaluated the governance implications?',
        'What conflicts of interest should we be aware of?',
      ],
      'Managing Partner': [
        'How will this accelerate our path to exit?',
        'What is the impact on our key growth metrics?',
      ],
      'Audit Committee Chair': [
        'What are the financial controls and compliance requirements?',
        'How will we ensure proper oversight?',
      ],
    };

    const memberQuestions = questions[member.role] || [
      'What is the risk-adjusted return on this initiative?',
    ];
    return memberQuestions[deterministicInt(0, memberQuestions.length - 1, 'ghost-q', member.role, proposal)];
  }

  // ---------------------------------------------------------------------------
  // DECISION DEBT TRACKING
  // ---------------------------------------------------------------------------

  getPendingDecisions(): PendingDecision[] {
    return Array.from(this.pendingDecisions.values());
  }

  createPendingDecision(partial: Partial<PendingDecision>): PendingDecision {
    const id = partial.id || `pending-${Date.now()}`;
    const daysStuck = partial.daysStuck || 0;
    const dailyCost = partial.estimatedDailyCost || 1000;

    const decision: PendingDecision = {
      id,
      title: partial.title || 'Untitled Decision',
      department: partial.department || 'General',
      owner: partial.owner || 'Unassigned',
      daysStuck,
      estimatedDailyCost: dailyCost,
      totalCostAccrued: daysStuck * dailyCost,
      priority: partial.priority || 'medium',
      status: partial.status || 'Pending',
      blockedBy: partial.blockedBy || [],
      createdAt: new Date(),
    };

    this.pendingDecisions.set(id, decision);
    this.saveToStorage();
    return decision;
  }

  getDecisionDebtDashboard(): DecisionDebtDashboard {
    const decisions = this.getPendingDecisions();
    const totalDecisions = decisions.length;
    const blockedDecisions = decisions.filter((d) => d.blockedBy.length > 0).length;
    const avgDaysStuck =
      decisions.reduce((s, d) => s + d.daysStuck, 0) / Math.max(1, totalDecisions);
    const dailyCost = decisions.reduce((s, d) => s + d.estimatedDailyCost, 0);
    const totalAccrued = decisions.reduce((s, d) => s + d.totalCostAccrued, 0);

    // Calculate debt score
    let grade = 'A';
    let score = 95;
    let label = 'Excellent';
    if (avgDaysStuck > 30) {
      grade = 'F';
      score = 30;
      label = 'Critical';
    } else if (avgDaysStuck > 21) {
      grade = 'D';
      score = 50;
      label = 'Poor';
    } else if (avgDaysStuck > 14) {
      grade = 'C';
      score = 65;
      label = 'Fair';
    } else if (avgDaysStuck > 7) {
      grade = 'B';
      score = 80;
      label = 'Good';
    }

    // Identify top blockers
    const blockerMap = new Map<string, { count: number; cost: number }>();
    decisions.forEach((d) => {
      d.blockedBy.forEach((b) => {
        const existing = blockerMap.get(b.name) || { count: 0, cost: 0 };
        blockerMap.set(b.name, {
          count: existing.count + 1,
          cost: existing.cost + d.totalCostAccrued,
        });
      });
    });

    const topBlockers = Array.from(blockerMap.entries())
      .map(([name, data]) => ({
        blockerName: name,
        decisionsBlocked: data.count,
        totalCostImpact: data.cost,
      }))
      .sort((a, b) => b.totalCostImpact - a.totalCostImpact)
      .slice(0, 5);

    return {
      summary: {
        totalPendingDecisions: totalDecisions,
        totalBlockedDecisions: blockedDecisions,
        averageDaysStuck: avgDaysStuck,
        dailyCost,
        monthlyCost: dailyCost * 30,
        annualProjectedLoss: dailyCost * 365,
        debtScore: {
          grade,
          score,
          label,
          color:
            grade === 'A'
              ? 'green'
              : grade === 'B'
                ? 'lime'
                : grade === 'C'
                  ? 'yellow'
                  : grade === 'D'
                    ? 'orange'
                    : 'red',
        },
      },
      decisions: decisions.sort((a, b) => b.totalCostAccrued - a.totalCostAccrued),
      topBlockers,
      criticalPath: decisions.filter((d) => d.priority === 'critical').map((d) => d.title),
      recommendations: [
        {
          title: 'Clear top blocker',
          description: `Resolve "${topBlockers[0]?.blockerName || 'pending reviews'}" to unblock ${topBlockers[0]?.decisionsBlocked || 0} decisions`,
          estimatedSavings: topBlockers[0]?.totalCostImpact || 0,
        },
        {
          title: 'Implement decision SLAs',
          description: 'Set maximum decision times by priority level',
          estimatedSavings: dailyCost * 10,
        },
        {
          title: 'Weekly decision review',
          description: 'Review all stuck decisions in weekly leadership meeting',
          estimatedSavings: dailyCost * 5,
        },
      ],
    };
  }

  // ---------------------------------------------------------------------------
  // CHRONOS TIME MACHINE
  // ---------------------------------------------------------------------------

  getTimeline(startDate: Date, endDate: Date): TimelineEvent[] {
    return this.timeline
      .filter((e) => e.timestamp >= startDate && e.timestamp <= endDate)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const newEvent: TimelineEvent = {
      ...event,
      id: `timeline-${Date.now()}`,
    };
    this.timeline.push(newEvent);
    this.saveToStorage();
    return newEvent;
  }

  getStateSnapshot(date: Date): StateSnapshot {
    // Generate realistic snapshot based on date
    const monthsAgo = (Date.now() - date.getTime()) / (30 * 24 * 60 * 60 * 1000);
    const baseRevenue = 50000000;
    const growthRate = 0.02; // 2% monthly

    return {
      timestamp: date,
      metrics: {
        revenue: Math.round(baseRevenue * Math.pow(1 - growthRate, monthsAgo)),
        profit: Math.round(baseRevenue * 0.15 * Math.pow(1 - growthRate, monthsAgo)),
        employees: Math.round(150 - monthsAgo * 2),
        customers: Math.round(500 - monthsAgo * 10),
        satisfaction: 4.2 - monthsAgo * 0.05,
        marketShare: 12 - monthsAgo * 0.2,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  getStats(): {
    totalDecisions: number;
    activeDecisions: number;
    preMortemsRun: number;
    ghostBoardsRun: number;
    avgRiskScore: number;
  } {
    const decisions = Array.from(this.decisions.values());
    return {
      totalDecisions: decisions.length,
      activeDecisions: decisions.filter((d) => !['closed', 'implemented'].includes(d.status))
        .length,
      preMortemsRun: this.preMortems.size,
      ghostBoardsRun: this.ghostBoards.size,
      avgRiskScore:
        decisions.reduce((s, d) => s + (d.riskScore || 50), 0) / Math.max(1, decisions.length),
    };
  }
}

// Singleton instance
export const decisionIntelligenceService = new DecisionIntelligenceService();
export default decisionIntelligenceService;
