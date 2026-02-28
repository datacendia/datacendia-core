// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA VETO™ — ADVERSARIAL GOVERNANCE ENGINE
// First veto-based (not just advisory) AI governance system
// Permanent blocking agents with enforceable veto rights
// =============================================================================

import { ollamaService, DomainAgent } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export type VetoAgentRole = 'ciso' | 'ethics' | 'compliance' | 'risk' | 'legal' | 'finance';

export type VetoStatus = 'pending' | 'approved' | 'vetoed' | 'override_requested' | 'escalated';

export type VetoReason =
  | 'security_risk'
  | 'compliance_violation'
  | 'ethical_concern'
  | 'financial_risk'
  | 'legal_liability'
  | 'regulatory_breach'
  | 'reputational_damage'
  | 'data_privacy'
  | 'operational_risk'
  | 'strategic_misalignment';

export interface VetoAgent {
  id: string;
  role: VetoAgentRole;
  name: string;
  title: string;
  avatar: string;
  jurisdiction: string[];
  vetoThreshold: number; // 0-100 risk score threshold
  canBlockAutomatic: boolean;
  requiresHumanOverride: boolean;
  description: string;
}

export interface VetoDecision {
  id: string;
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  submittedBy: string;
  submittedAt: Date;
  status: VetoStatus;

  // Agent reviews
  reviews: VetoReview[];

  // Final outcome
  finalDecision?: 'approved' | 'vetoed';
  decidedAt?: Date;
  decidedBy?: string;

  // Override tracking
  overrideRequested?: boolean;
  overrideRequestedBy?: string;
  overrideReason?: string;
  overrideApproved?: boolean;
  overrideApprovedBy?: string;
}

export interface VetoReview {
  id: string;
  agentId: string;
  agentRole: VetoAgentRole;
  status: 'pending' | 'approved' | 'vetoed' | 'conditional';
  riskScore: number; // 0-100
  confidence: number; // 0-100
  reasoning: string;
  concerns: VetoConcern[];
  conditions?: string[];
  reviewedAt: Date;
  isBlocking: boolean;
}

export interface VetoConcern {
  id: string;
  category: VetoReason;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
  regulatoryReference?: string;
}

export interface VetoPolicy {
  id: string;
  name: string;
  description: string;
  triggerConditions: VetoTrigger[];
  requiredAgents: VetoAgentRole[];
  autoVetoThreshold: number;
  escalationPath: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VetoTrigger {
  type: 'keyword' | 'amount' | 'department' | 'category' | 'risk_score';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'in';
  value: string | number | string[];
  agentToNotify: VetoAgentRole;
}

export interface VetoMetrics {
  totalProposals: number;
  approvedProposals: number;
  vetoedProposals: number;
  pendingProposals: number;
  overrideRequests: number;
  overridesApproved: number;
  avgReviewTime: number; // hours
  vetosByAgent: Record<VetoAgentRole, number>;
  vetosByReason: Record<VetoReason, number>;
  riskScoreDistribution: { range: string; count: number }[];
}

// =============================================================================
// VETO AGENTS
// =============================================================================

export const VETO_AGENTS: VetoAgent[] = [
  {
    id: 'veto-ciso',
    role: 'ciso',
    name: 'CISO Guardian',
    title: 'Chief Information Security Officer',
    avatar: '🛡️',
    jurisdiction: [
      'data_security',
      'cyber_risk',
      'access_control',
      'encryption',
      'incident_response',
    ],
    vetoThreshold: 70,
    canBlockAutomatic: true,
    requiresHumanOverride: true,
    description:
      'Blocks proposals with security vulnerabilities, data exposure risks, or insufficient access controls.',
  },
  {
    id: 'veto-ethics',
    role: 'ethics',
    name: 'Ethics Arbiter',
    title: 'Chief Ethics Officer',
    avatar: '⚖️',
    jurisdiction: ['fairness', 'bias', 'transparency', 'social_impact', 'stakeholder_welfare'],
    vetoThreshold: 60,
    canBlockAutomatic: true,
    requiresHumanOverride: true,
    description: 'Blocks proposals with ethical concerns, bias risks, or negative social impact.',
  },
  {
    id: 'veto-compliance',
    role: 'compliance',
    name: 'Compliance Sentinel',
    title: 'Chief Compliance Officer',
    avatar: '📋',
    jurisdiction: ['gdpr', 'sox', 'hipaa', 'pci_dss', 'regulatory', 'licensing'],
    vetoThreshold: 65,
    canBlockAutomatic: true,
    requiresHumanOverride: true,
    description: 'Blocks proposals violating GDPR, SOX, HIPAA, or other regulatory frameworks.',
  },
  {
    id: 'veto-risk',
    role: 'risk',
    name: 'Risk Assessor',
    title: 'Chief Risk Officer',
    avatar: '📊',
    jurisdiction: [
      'operational_risk',
      'market_risk',
      'credit_risk',
      'liquidity_risk',
      'strategic_risk',
    ],
    vetoThreshold: 75,
    canBlockAutomatic: false,
    requiresHumanOverride: false,
    description: 'Evaluates overall risk exposure and flags high-risk proposals for review.',
  },
  {
    id: 'veto-legal',
    role: 'legal',
    name: 'Legal Counsel',
    title: 'General Counsel',
    avatar: '⚔️',
    jurisdiction: ['contracts', 'liability', 'ip', 'employment_law', 'litigation_risk'],
    vetoThreshold: 70,
    canBlockAutomatic: true,
    requiresHumanOverride: true,
    description: 'Blocks proposals with legal liability, contract violations, or litigation risks.',
  },
  {
    id: 'veto-finance',
    role: 'finance',
    name: 'Financial Guardian',
    title: 'Chief Financial Officer',
    avatar: '💰',
    jurisdiction: ['budget', 'roi', 'cash_flow', 'audit', 'financial_controls'],
    vetoThreshold: 80,
    canBlockAutomatic: false,
    requiresHumanOverride: false,
    description: 'Reviews financial impact and flags proposals exceeding budget or ROI thresholds.',
  },
];

// =============================================================================
// DEFAULT POLICIES
// =============================================================================

const DEFAULT_POLICIES: VetoPolicy[] = [
  {
    id: 'policy-security',
    name: 'Security Review Required',
    description: 'All proposals involving data, systems, or infrastructure must pass CISO review',
    triggerConditions: [
      {
        type: 'keyword',
        operator: 'contains',
        value: ['data', 'system', 'api', 'database', 'cloud', 'server'],
        agentToNotify: 'ciso',
      },
      {
        type: 'category',
        operator: 'in',
        value: ['infrastructure', 'data', 'integration'],
        agentToNotify: 'ciso',
      },
    ],
    requiredAgents: ['ciso'],
    autoVetoThreshold: 85,
    escalationPath: ['ciso', 'cto', 'ceo'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'policy-compliance',
    name: 'Regulatory Compliance Gate',
    description:
      'Proposals affecting customer data or financial operations require compliance review',
    triggerConditions: [
      {
        type: 'keyword',
        operator: 'contains',
        value: ['customer', 'pii', 'financial', 'payment', 'gdpr', 'hipaa'],
        agentToNotify: 'compliance',
      },
      { type: 'amount', operator: 'greater_than', value: 100000, agentToNotify: 'compliance' },
    ],
    requiredAgents: ['compliance', 'legal'],
    autoVetoThreshold: 80,
    escalationPath: ['compliance', 'legal', 'ceo'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'policy-ethics',
    name: 'Ethics Review Gate',
    description: 'AI/ML decisions and workforce changes require ethics review',
    triggerConditions: [
      {
        type: 'keyword',
        operator: 'contains',
        value: ['ai', 'ml', 'algorithm', 'automation', 'layoff', 'termination'],
        agentToNotify: 'ethics',
      },
      {
        type: 'category',
        operator: 'in',
        value: ['ai', 'hr', 'workforce'],
        agentToNotify: 'ethics',
      },
    ],
    requiredAgents: ['ethics'],
    autoVetoThreshold: 70,
    escalationPath: ['ethics', 'chro', 'ceo'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'policy-financial',
    name: 'Financial Approval Gate',
    description: 'High-value proposals require CFO review',
    triggerConditions: [
      { type: 'amount', operator: 'greater_than', value: 500000, agentToNotify: 'finance' },
      {
        type: 'keyword',
        operator: 'contains',
        value: ['acquisition', 'merger', 'investment', 'budget'],
        agentToNotify: 'finance',
      },
    ],
    requiredAgents: ['finance', 'risk'],
    autoVetoThreshold: 90,
    escalationPath: ['finance', 'ceo', 'board'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_veto_service';

// =============================================================================
// VETO SERVICE
// =============================================================================

class VetoService {
  private decisions: Map<string, VetoDecision> = new Map();
  private policies: Map<string, VetoPolicy> = new Map();
  private ollamaAvailable: boolean = false;

  constructor() {
    this.loadFromStorage();
    this.checkOllamaStatus();

    // Initialize default policies if none exist
    if (this.policies.size === 0) {
      DEFAULT_POLICIES.forEach((p) => this.policies.set(p.id, p));
      this.saveToStorage();
    }
  }

  private async checkOllamaStatus(): Promise<void> {
    try {
      this.ollamaAvailable = await ollamaService.checkAvailability();
    } catch {
      this.ollamaAvailable = false;
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        data.decisions?.forEach((d: VetoDecision) => {
          d.submittedAt = new Date(d.submittedAt);
          if (d.decidedAt) {
            d.decidedAt = new Date(d.decidedAt);
          }
          d.reviews.forEach((r) => (r.reviewedAt = new Date(r.reviewedAt)));
          this.decisions.set(d.id, d);
        });
        data.policies?.forEach((p: VetoPolicy) => {
          p.createdAt = new Date(p.createdAt);
          p.updatedAt = new Date(p.updatedAt);
          this.policies.set(p.id, p);
        });
      }
    } catch (error) {
      console.error('Failed to load veto data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        decisions: Array.from(this.decisions.values()),
        policies: Array.from(this.policies.values()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save veto data to storage:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // AGENT RETRIEVAL
  // ---------------------------------------------------------------------------

  getVetoAgents(): VetoAgent[] {
    return VETO_AGENTS;
  }

  getVetoAgent(role: VetoAgentRole): VetoAgent | undefined {
    return VETO_AGENTS.find((a) => a.role === role);
  }

  // ---------------------------------------------------------------------------
  // PROPOSAL SUBMISSION
  // ---------------------------------------------------------------------------

  async submitProposal(
    title: string,
    description: string,
    submittedBy: string,
    category?: string,
    amount?: number
  ): Promise<VetoDecision> {
    const id = `veto-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;

    // Determine which agents need to review based on policies
    const requiredAgents = this.determineRequiredAgents(title, description, category, amount);

    const decision: VetoDecision = {
      id,
      proposalId: id,
      proposalTitle: title,
      proposalDescription: description,
      submittedBy,
      submittedAt: new Date(),
      status: 'pending',
      reviews: [],
    };

    this.decisions.set(id, decision);

    // Automatically run reviews for required agents
    for (const agentRole of requiredAgents) {
      await this.runAgentReview(id, agentRole);
    }

    // Check if any automatic vetoes triggered
    this.evaluateDecision(id);

    this.saveToStorage();
    return this.decisions.get(id)!;
  }

  private determineRequiredAgents(
    title: string,
    description: string,
    category?: string,
    amount?: number
  ): VetoAgentRole[] {
    const required = new Set<VetoAgentRole>();
    const text = `${title} ${description}`.toLowerCase();

    this.policies.forEach((policy) => {
      if (!policy.isActive) {
        return;
      }

      for (const trigger of policy.triggerConditions) {
        let matches = false;

        switch (trigger.type) {
          case 'keyword':
            if (trigger.operator === 'contains' && Array.isArray(trigger.value)) {
              matches = trigger.value.some((kw) => text.includes(kw.toLowerCase()));
            }
            break;
          case 'category':
            if (trigger.operator === 'in' && Array.isArray(trigger.value) && category) {
              matches = trigger.value.includes(category.toLowerCase());
            }
            break;
          case 'amount':
            if (amount !== undefined) {
              if (trigger.operator === 'greater_than' && typeof trigger.value === 'number') {
                matches = amount > trigger.value;
              } else if (trigger.operator === 'less_than' && typeof trigger.value === 'number') {
                matches = amount < trigger.value;
              }
            }
            break;
        }

        if (matches) {
          required.add(trigger.agentToNotify);
        }
      }
    });

    // Always include at least risk assessment
    if (required.size === 0) {
      required.add('risk');
    }

    return Array.from(required);
  }

  // ---------------------------------------------------------------------------
  // AGENT REVIEW
  // ---------------------------------------------------------------------------

  async runAgentReview(decisionId: string, agentRole: VetoAgentRole): Promise<VetoReview> {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    const agent = this.getVetoAgent(agentRole);
    if (!agent) {
      throw new Error('Agent not found');
    }

    let review: VetoReview;

    if (this.ollamaAvailable) {
      review = await this.runOllamaReview(decision, agent);
    } else {
      review = this.runFallbackReview(decision, agent);
    }

    // Add review to decision
    decision.reviews.push(review);
    this.saveToStorage();

    return review;
  }

  private async runOllamaReview(decision: VetoDecision, agent: VetoAgent): Promise<VetoReview> {
    const prompt = `You are the ${agent.title} (${agent.name}) responsible for reviewing proposals.

Your jurisdiction includes: ${agent.jurisdiction.join(', ')}

Review this proposal and provide your assessment:

**Proposal Title:** ${decision.proposalTitle}
**Description:** ${decision.proposalDescription}

Analyze for risks in your jurisdiction. Respond in JSON format:
{
  "riskScore": <0-100>,
  "confidence": <0-100>,
  "status": "<approved|vetoed|conditional>",
  "reasoning": "<your detailed reasoning>",
  "concerns": [
    {
      "category": "<security_risk|compliance_violation|ethical_concern|financial_risk|legal_liability|regulatory_breach|reputational_damage|data_privacy|operational_risk|strategic_misalignment>",
      "severity": "<low|medium|high|critical>",
      "description": "<description of concern>",
      "mitigation": "<suggested mitigation>"
    }
  ],
  "conditions": ["<condition if conditional approval>"]
}`;

    try {
      const response = await ollamaService.generate({ prompt, model: 'llama3.2:latest' });
      const responseText = response.response || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const isBlocking = agent.canBlockAutomatic && parsed.riskScore >= agent.vetoThreshold;

        return {
          id: `review-${Date.now()}`,
          agentId: agent.id,
          agentRole: agent.role,
          status: isBlocking ? 'vetoed' : parsed.status,
          riskScore: parsed.riskScore,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          concerns: parsed.concerns.map((c: any, i: number) => ({
            id: `concern-${i}`,
            ...c,
          })),
          conditions: parsed.conditions,
          reviewedAt: new Date(),
          isBlocking,
        };
      }
    } catch (error) {
      console.error('Ollama review failed:', error);
    }

    return this.runFallbackReview(decision, agent);
  }

  private runFallbackReview(decision: VetoDecision, agent: VetoAgent): VetoReview {
    const text = `${decision.proposalTitle} ${decision.proposalDescription}`.toLowerCase();

    // Intelligent fallback based on keywords
    const riskIndicators: { keyword: string; score: number; category: VetoReason }[] = [
      { keyword: 'delete', score: 30, category: 'data_privacy' },
      { keyword: 'remove', score: 20, category: 'operational_risk' },
      { keyword: 'customer data', score: 40, category: 'data_privacy' },
      { keyword: 'pii', score: 50, category: 'compliance_violation' },
      { keyword: 'gdpr', score: 35, category: 'regulatory_breach' },
      { keyword: 'layoff', score: 45, category: 'ethical_concern' },
      { keyword: 'terminate', score: 40, category: 'legal_liability' },
      { keyword: 'acquisition', score: 35, category: 'financial_risk' },
      { keyword: 'ai', score: 25, category: 'ethical_concern' },
      { keyword: 'automation', score: 20, category: 'operational_risk' },
      { keyword: 'security', score: 30, category: 'security_risk' },
      { keyword: 'password', score: 35, category: 'security_risk' },
      { keyword: 'encrypt', score: 25, category: 'security_risk' },
      { keyword: 'public', score: 20, category: 'reputational_damage' },
      { keyword: 'media', score: 25, category: 'reputational_damage' },
    ];

    let riskScore = 20; // Base risk
    const concerns: VetoConcern[] = [];

    riskIndicators.forEach((indicator, i) => {
      if (text.includes(indicator.keyword)) {
        riskScore += indicator.score;
        if (
          agent.jurisdiction.some(
            (j) => indicator.category.includes(j) || j.includes(indicator.category.split('_')[0])
          )
        ) {
          concerns.push({
            id: `concern-${i}`,
            category: indicator.category,
            severity: indicator.score > 35 ? 'high' : indicator.score > 25 ? 'medium' : 'low',
            description: `Detected "${indicator.keyword}" which may indicate ${indicator.category.replace(/_/g, ' ')}`,
            mitigation: `Review and address ${indicator.category.replace(/_/g, ' ')} before proceeding`,
          });
        }
      }
    });

    riskScore = Math.min(100, riskScore);
    const isBlocking = agent.canBlockAutomatic && riskScore >= agent.vetoThreshold;

    return {
      id: `review-${Date.now()}`,
      agentId: agent.id,
      agentRole: agent.role,
      status: isBlocking ? 'vetoed' : riskScore >= 50 ? 'conditional' : 'approved',
      riskScore,
      confidence: 70,
      reasoning: `${agent.name} reviewed this proposal. Risk score: ${riskScore}/100. ${concerns.length} concerns identified within ${agent.role} jurisdiction.`,
      concerns,
      conditions:
        riskScore >= 50
          ? ['Requires additional documentation', 'Stakeholder sign-off recommended']
          : undefined,
      reviewedAt: new Date(),
      isBlocking,
    };
  }

  // ---------------------------------------------------------------------------
  // DECISION EVALUATION
  // ---------------------------------------------------------------------------

  private evaluateDecision(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      return;
    }

    // Check if any blocking review exists
    const blockingReview = decision.reviews.find((r) => r.isBlocking && r.status === 'vetoed');

    if (blockingReview) {
      decision.status = 'vetoed';
      decision.finalDecision = 'vetoed';
      decision.decidedAt = new Date();
      decision.decidedBy = blockingReview.agentRole;
    } else if (decision.reviews.every((r) => r.status === 'approved')) {
      decision.status = 'approved';
      decision.finalDecision = 'approved';
      decision.decidedAt = new Date();
      decision.decidedBy = 'system';
    }

    this.saveToStorage();
  }

  // ---------------------------------------------------------------------------
  // OVERRIDE WORKFLOW
  // ---------------------------------------------------------------------------

  requestOverride(decisionId: string, requestedBy: string, reason: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.status !== 'vetoed') {
      return null;
    }

    decision.status = 'override_requested';
    decision.overrideRequested = true;
    decision.overrideRequestedBy = requestedBy;
    decision.overrideReason = reason;

    this.saveToStorage();
    return decision;
  }

  approveOverride(decisionId: string, approvedBy: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.status !== 'override_requested') {
      return null;
    }

    decision.status = 'approved';
    decision.finalDecision = 'approved';
    decision.overrideApproved = true;
    decision.overrideApprovedBy = approvedBy;
    decision.decidedAt = new Date();
    decision.decidedBy = approvedBy;

    this.saveToStorage();
    return decision;
  }

  denyOverride(decisionId: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.status !== 'override_requested') {
      return null;
    }

    decision.status = 'vetoed';
    decision.overrideApproved = false;

    this.saveToStorage();
    return decision;
  }

  // ---------------------------------------------------------------------------
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  getDecision(id: string): VetoDecision | undefined {
    return this.decisions.get(id);
  }

  getAllDecisions(): VetoDecision[] {
    return Array.from(this.decisions.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }

  getPendingDecisions(): VetoDecision[] {
    return this.getAllDecisions().filter(
      (d) => d.status === 'pending' || d.status === 'override_requested'
    );
  }

  getVetoedDecisions(): VetoDecision[] {
    return this.getAllDecisions().filter((d) => d.finalDecision === 'vetoed');
  }

  // ---------------------------------------------------------------------------
  // POLICIES
  // ---------------------------------------------------------------------------

  getPolicies(): VetoPolicy[] {
    return Array.from(this.policies.values());
  }

  createPolicy(policy: Omit<VetoPolicy, 'id' | 'createdAt' | 'updatedAt'>): VetoPolicy {
    const id = `policy-${Date.now()}`;
    const newPolicy: VetoPolicy = {
      ...policy,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.policies.set(id, newPolicy);
    this.saveToStorage();
    return newPolicy;
  }

  togglePolicy(policyId: string): VetoPolicy | null {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return null;
    }

    policy.isActive = !policy.isActive;
    policy.updatedAt = new Date();
    this.saveToStorage();
    return policy;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): VetoMetrics {
    const decisions = this.getAllDecisions();

    const vetosByAgent: Record<VetoAgentRole, number> = {
      ciso: 0,
      ethics: 0,
      compliance: 0,
      risk: 0,
      legal: 0,
      finance: 0,
    };

    const vetosByReason: Record<VetoReason, number> = {
      security_risk: 0,
      compliance_violation: 0,
      ethical_concern: 0,
      financial_risk: 0,
      legal_liability: 0,
      regulatory_breach: 0,
      reputational_damage: 0,
      data_privacy: 0,
      operational_risk: 0,
      strategic_misalignment: 0,
    };

    decisions.forEach((d) => {
      if (d.finalDecision === 'vetoed') {
        const blockingReview = d.reviews.find((r) => r.isBlocking);
        if (blockingReview) {
          vetosByAgent[blockingReview.agentRole]++;
          blockingReview.concerns.forEach((c) => {
            if (vetosByReason[c.category] !== undefined) {
              vetosByReason[c.category]++;
            }
          });
        }
      }
    });

    const riskScores = decisions.flatMap((d) => d.reviews.map((r) => r.riskScore));
    const riskDistribution = [
      { range: '0-25', count: riskScores.filter((s) => s <= 25).length },
      { range: '26-50', count: riskScores.filter((s) => s > 25 && s <= 50).length },
      { range: '51-75', count: riskScores.filter((s) => s > 50 && s <= 75).length },
      { range: '76-100', count: riskScores.filter((s) => s > 75).length },
    ];

    const reviewTimes = decisions
      .filter((d) => d.decidedAt)
      .map((d) => (d.decidedAt!.getTime() - d.submittedAt.getTime()) / (1000 * 60 * 60));
    const avgReviewTime =
      reviewTimes.length > 0 ? reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length : 0;

    return {
      totalProposals: decisions.length,
      approvedProposals: decisions.filter((d) => d.finalDecision === 'approved').length,
      vetoedProposals: decisions.filter((d) => d.finalDecision === 'vetoed').length,
      pendingProposals: decisions.filter((d) => d.status === 'pending').length,
      overrideRequests: decisions.filter((d) => d.overrideRequested).length,
      overridesApproved: decisions.filter((d) => d.overrideApproved).length,
      avgReviewTime,
      vetosByAgent,
      vetosByReason,
      riskScoreDistribution: riskDistribution,
    };
  }

  // ---------------------------------------------------------------------------
  // OLLAMA STATUS
  // ---------------------------------------------------------------------------

  isOllamaAvailable(): boolean {
    return this.ollamaAvailable;
  }

  async refreshOllamaStatus(): Promise<boolean> {
    await this.checkOllamaStatus();
    return this.ollamaAvailable;
  }
}

// Singleton
export const vetoService = new VetoService();
export default vetoService;
