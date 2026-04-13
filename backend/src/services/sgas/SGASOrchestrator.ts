/**
 * SGAS™ — Synthetic Governance Agent System
 *
 * Decision verification infrastructure using 5 agent classes:
 *   1. Decision Agents — analyze proposals from domain perspectives
 *   2. Institutional Agents — enforce organizational constraints and authorities
 *   3. Adversarial Agents — probe for exploitation and gaming vectors
 *   4. Observer Agents — monitor process integrity and bias
 *   5. Meta-Governance Agents — govern the governance system itself
 *
 * @module services/sgas/SGASOrchestrator
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import {
  deterministicFloat,
  deterministicInt,
  deterministicScore,
  deterministicPick,
  deterministicBool,
  deterministicPercentage,
} from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export const DecisionType = {
  STRATEGIC: 'strategic',
  OPERATIONAL: 'operational',
  TACTICAL: 'tactical',
  REGULATORY: 'regulatory',
  EMERGENCY: 'emergency',
} as const;

export const ConstraintType = {
  BUDGET: 'budget',
  LEGAL: 'legal',
  REGULATORY: 'regulatory',
  TIMELINE: 'timeline',
  RESOURCE: 'resource',
  POLITICAL: 'political',
  PROCEDURAL: 'procedural',
} as const;

export const InstitutionalState = {
  STABLE: 'stable',
  NORMAL: 'normal',
  TRANSITIONAL: 'transitional',
  CRISIS: 'crisis',
  REFORM: 'reform',
} as const;

export const EnforcementLevel = {
  ADVISORY: 'advisory',
  SOFT: 'soft',
  MODERATE: 'moderate',
  STRICT: 'strict',
  MANDATORY: 'mandatory',
} as const;

export const RiskLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const UrgencyLevel = {
  LOW: 'low',
  ROUTINE: 'routine',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency',
} as const;

export const SensitivityLevel = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted',
} as const;

export interface BudgetContext {
  allocated: number;
  currency: string;
  fiscalYear: string;
  lineItems: any[];
  flexibilityPercent: number;
}

export interface DecisionContext {
  budget: BudgetContext;
  timeframe: {
    start: Date;
    end: Date;
    milestones: any[];
    criticalPath: boolean;
    flexibilityDays: number;
  };
  scope: {
    boundaries: string[];
    exclusions: string[];
    authorities: string[];
    geographicScope: string[];
    organizationalUnits: string[];
  };
  stakeholders: any[];
  dependencies: any[];
  riskTolerance: string;
  institutionalState: string;
}

export interface Constraint {
  id: string;
  type: string;
  name: string;
  description: string;
  source: string;
  enforcementLevel: string;
  parameters: Record<string, any>;
  exceptions: any[];
  effectiveFrom: Date;
}

export interface DecisionProposal {
  id: string;
  timestamp: Date;
  proposer: string;
  title: string;
  description: string;
  type: string;
  context: DecisionContext;
  constraints: Constraint[];
  metadata: {
    version: number;
    previousVersions: any[];
    classifications: string[];
    tags: string[];
    priority: number;
    urgency: string;
    sensitivity: string;
  };
  historicalBaseline?: HistoricalBaseline;
}

export interface HistoricalBaseline {
  precedents: any[];
  successRate: number;
  averageOutcome: number;
  riskProfile: string;
}

// =============================================================================
// AGENT DEFINITIONS
// =============================================================================

interface AgentDefinition {
  id: string;
  name: string;
  objective: string;
  capabilities: string[];
}

interface DecisionAgentDef extends AgentDefinition {
  domain: string;
  biasProfile: string;
}

interface InstitutionalAgentDef extends AgentDefinition {
  institutionType: string;
  authorities: string[];
}

interface AdversarialAgentDef extends AgentDefinition {
  attackProfile: { type: string; sophistication: string };
}

interface ObserverAgentDef extends AgentDefinition {
  observationType: string;
  metrics: string[];
}

interface MetaGovernanceAgentDef extends AgentDefinition {
  detectionPatterns: string[];
  governanceMetrics: string[];
}

const DECISION_AGENTS: DecisionAgentDef[] = [
  {
    id: 'da-financial',
    name: 'Financial Analysis Agent',
    objective: 'Evaluate fiscal viability, ROI projections, and budget impact',
    capabilities: ['cost-benefit analysis', 'risk-adjusted returns', 'budget forecasting', 'capital allocation'],
    domain: 'finance',
    biasProfile: 'conservative-fiscal',
  },
  {
    id: 'da-legal',
    name: 'Legal Compliance Agent',
    objective: 'Assess legal exposure, regulatory compliance, and liability risk',
    capabilities: ['regulatory mapping', 'liability assessment', 'compliance gap analysis', 'precedent research'],
    domain: 'legal',
    biasProfile: 'risk-averse',
  },
  {
    id: 'da-strategic',
    name: 'Strategic Alignment Agent',
    objective: 'Evaluate alignment with organizational mission, vision, and strategic goals',
    capabilities: ['strategy mapping', 'competitive analysis', 'stakeholder alignment', 'mission drift detection'],
    domain: 'strategy',
    biasProfile: 'growth-oriented',
  },
  {
    id: 'da-operations',
    name: 'Operational Feasibility Agent',
    objective: 'Assess implementation capacity, resource requirements, and execution risk',
    capabilities: ['resource planning', 'capacity analysis', 'process mapping', 'bottleneck identification'],
    domain: 'operations',
    biasProfile: 'pragmatic',
  },
  {
    id: 'da-stakeholder',
    name: 'Stakeholder Impact Agent',
    objective: 'Evaluate impact on all stakeholder groups including communities and employees',
    capabilities: ['stakeholder mapping', 'impact assessment', 'sentiment analysis', 'equity evaluation'],
    domain: 'stakeholder',
    biasProfile: 'stakeholder-centric',
  },
];

const INSTITUTIONAL_AGENTS: InstitutionalAgentDef[] = [
  {
    id: 'ia-compliance',
    name: 'Compliance Authority',
    objective: 'Enforce regulatory and policy compliance requirements',
    capabilities: ['compliance verification', 'policy enforcement', 'audit trail generation'],
    institutionType: 'regulatory',
    authorities: ['compliance-veto', 'mandatory-review', 'audit-trigger'],
  },
  {
    id: 'ia-risk',
    name: 'Risk Management Authority',
    objective: 'Enforce risk tolerance boundaries and escalation protocols',
    capabilities: ['risk quantification', 'threshold enforcement', 'escalation management'],
    institutionType: 'risk-management',
    authorities: ['risk-veto', 'mandatory-mitigation', 'escalation-trigger'],
  },
  {
    id: 'ia-ethics',
    name: 'Ethics Committee',
    objective: 'Ensure decisions align with ethical principles and organizational values',
    capabilities: ['ethical review', 'values alignment', 'conflict of interest detection'],
    institutionType: 'ethics',
    authorities: ['ethics-hold', 'mandatory-review', 'values-veto'],
  },
  {
    id: 'ia-governance',
    name: 'Governance Board',
    objective: 'Ensure proper decision-making procedures and authority boundaries',
    capabilities: ['procedure verification', 'authority validation', 'quorum enforcement'],
    institutionType: 'governance',
    authorities: ['procedural-veto', 'quorum-enforcement', 'authority-validation'],
  },
];

const ADVERSARIAL_AGENTS: AdversarialAgentDef[] = [
  {
    id: 'adv-red-team',
    name: 'Red Team Agent',
    objective: 'Identify weaknesses, vulnerabilities, and exploitation vectors in the proposal',
    capabilities: ['attack surface analysis', 'vulnerability scanning', 'exploit identification'],
    attackProfile: { type: 'systematic', sophistication: 'advanced' },
  },
  {
    id: 'adv-devils-advocate',
    name: "Devil's Advocate Agent",
    objective: 'Construct the strongest possible argument against the proposal',
    capabilities: ['counter-argument construction', 'assumption challenging', 'worst-case modeling'],
    attackProfile: { type: 'argumentative', sophistication: 'expert' },
  },
  {
    id: 'adv-gaming',
    name: 'Gaming & Exploitation Agent',
    objective: 'Simulate how actors will game or exploit the decision',
    capabilities: ['game theory analysis', 'incentive modeling', 'loophole detection'],
    attackProfile: { type: 'strategic', sophistication: 'advanced' },
  },
];

const OBSERVER_AGENTS: ObserverAgentDef[] = [
  {
    id: 'obs-bias',
    name: 'Bias Observer',
    objective: 'Monitor deliberation process for cognitive and systemic biases',
    capabilities: ['bias detection', 'groupthink identification', 'anchoring detection'],
    observationType: 'bias-monitoring',
    metrics: ['groupthink-index', 'anchoring-score', 'confirmation-bias-rate', 'availability-heuristic-count'],
  },
  {
    id: 'obs-process',
    name: 'Process Integrity Observer',
    objective: 'Ensure the deliberation process follows proper governance procedures',
    capabilities: ['process verification', 'timeline monitoring', 'quorum tracking'],
    observationType: 'process-integrity',
    metrics: ['procedure-compliance-rate', 'evidence-citation-rate', 'dissent-acknowledgment-rate'],
  },
  {
    id: 'obs-evidence',
    name: 'Evidence Quality Observer',
    objective: 'Assess the quality and sufficiency of evidence used in decision-making',
    capabilities: ['evidence grading', 'source verification', 'data quality assessment'],
    observationType: 'evidence-quality',
    metrics: ['evidence-strength-score', 'source-diversity-index', 'data-recency-score'],
  },
];

const META_GOVERNANCE_AGENTS: MetaGovernanceAgentDef[] = [
  {
    id: 'mg-coherence',
    name: 'Coherence Monitor',
    objective: 'Detect contradictions and inconsistencies across agent outputs',
    capabilities: ['contradiction detection', 'consistency analysis', 'alignment verification'],
    detectionPatterns: ['logical-contradiction', 'recommendation-conflict', 'evidence-mismatch'],
    governanceMetrics: ['coherence-score', 'contradiction-count', 'alignment-index'],
  },
  {
    id: 'mg-capture',
    name: 'Capture Detector',
    objective: 'Detect if any agent or stakeholder has captured the deliberation process',
    capabilities: ['influence mapping', 'capture detection', 'independence verification'],
    detectionPatterns: ['undue-influence', 'information-manipulation', 'agenda-hijacking'],
    governanceMetrics: ['independence-score', 'influence-concentration', 'capture-risk-index'],
  },
  {
    id: 'mg-completeness',
    name: 'Completeness Assessor',
    objective: 'Ensure all relevant perspectives and stakeholders have been considered',
    capabilities: ['coverage analysis', 'blind spot detection', 'stakeholder gap analysis'],
    detectionPatterns: ['missing-perspective', 'stakeholder-exclusion', 'scope-limitation'],
    governanceMetrics: ['coverage-score', 'blind-spot-count', 'stakeholder-representation-rate'],
  },
];

// =============================================================================
// AGENT OUTPUT TYPES
// =============================================================================

interface AgentOutput {
  agentId: string;
  agentName: string;
  recommendation: string;
  confidence: number;
  rationale: string;
  findings: string[];
  risks: Array<{ description: string; severity: string; probability: number }>;
  timestamp: string;
}

interface DeliberationGraph {
  id: string;
  proposalId: string;
  status: string;
  phase: string;
  nodes: Array<{ id: string; type: string; agentId: string; output: AgentOutput }>;
  edges: Array<{ from: string; to: string; type: string }>;
  deterministicHash: string;
  completedAt?: string;
  metadata: Record<string, any>;
}

interface DeliberationResult {
  graph: DeliberationGraph;
  finalStatus: { approved: boolean; blocked: boolean; conditions: string[]; blockers: string[] };
  summary: {
    totalAgents: number;
    approvals: number;
    rejections: number;
    conditions: number;
    overallConfidence: number;
    riskLevel: string;
  };
}

// =============================================================================
// AGENT SERVICE CLASSES
// =============================================================================

class DecisionAgentsService {
  getAgents(): DecisionAgentDef[] { return [...DECISION_AGENTS]; }

  async executeAgent(agentId: string, proposal: DecisionProposal, seed?: number): Promise<AgentOutput> {
    const agent = DECISION_AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error(`Decision agent ${agentId} not found`);

    const s = `${agentId}-${seed || Date.now()}-${proposal.id}`;
    const confidence = deterministicPercentage(72, 18, s, agent.domain);
    const approve = deterministicBool(0.65, s, 'vote');

    return {
      agentId: agent.id,
      agentName: agent.name,
      recommendation: approve ? 'APPROVE' : 'CONDITIONAL_APPROVE',
      confidence,
      rationale: this.generateRationale(agent, proposal, s),
      findings: this.generateFindings(agent, proposal, s),
      risks: this.generateRisks(agent, proposal, s),
      timestamp: new Date().toISOString(),
    };
  }

  private generateRationale(agent: DecisionAgentDef, proposal: DecisionProposal, seed: string): string {
    const rationales: Record<string, string> = {
      finance: `Financial analysis of "${proposal.title}" indicates ${deterministicPick(['favorable', 'moderate', 'cautious'], seed, 'outlook')} ROI projections with ${proposal.context.budget.allocated > 0 ? `$${proposal.context.budget.allocated.toLocaleString()} allocated budget` : 'unspecified budget'}. Risk-adjusted return profile is ${deterministicPick(['acceptable', 'marginal', 'strong'], seed, 'return')}.`,
      legal: `Legal review of "${proposal.title}" identifies ${deterministicInt(1, 4, seed, 'issues')} regulatory touchpoints requiring attention. Liability exposure is ${deterministicPick(['minimal', 'manageable', 'elevated'], seed, 'liability')} given current compliance posture.`,
      strategy: `Strategic alignment assessment of "${proposal.title}" shows ${deterministicPick(['strong', 'moderate', 'partial'], seed, 'alignment')} alignment with organizational objectives. Competitive positioning impact is ${deterministicPick(['positive', 'neutral', 'mixed'], seed, 'competitive')}.`,
      operations: `Operational feasibility analysis of "${proposal.title}" confirms ${deterministicPick(['adequate', 'constrained', 'sufficient'], seed, 'capacity')} implementation capacity. Resource requirements are ${deterministicPick(['within budget', 'near capacity', 'requiring augmentation'], seed, 'resources')}.`,
      stakeholder: `Stakeholder impact assessment of "${proposal.title}" identifies ${proposal.context.stakeholders.length || deterministicInt(2, 6, seed, 'stakeholders')} affected groups. Net stakeholder impact is ${deterministicPick(['positive', 'mixed', 'requires mitigation'], seed, 'impact')}.`,
    };
    return rationales[agent.domain] || `Analysis of "${proposal.title}" from ${agent.domain} perspective completed.`;
  }

  private generateFindings(agent: DecisionAgentDef, proposal: DecisionProposal, seed: string): string[] {
    const count = deterministicInt(2, 4, seed, 'finding-count');
    const findings: string[] = [];
    for (let i = 0; i < count; i++) {
      findings.push(`[${agent.domain.toUpperCase()}] ${deterministicPick([
        `Budget utilization projected at ${deterministicPercentage(78, 15, seed, `f${i}`)}%`,
        `Implementation timeline aligns with ${deterministicPick(['Q1', 'Q2', 'Q3', 'Q4'], seed, `q${i}`)} targets`,
        `Stakeholder engagement gap identified in ${deterministicPick(['community', 'regulatory', 'internal', 'partner'], seed, `gap${i}`)} segment`,
        `Risk mitigation plan covers ${deterministicPercentage(85, 10, seed, `cov${i}`)}% of identified scenarios`,
        `Precedent analysis shows ${deterministicPercentage(72, 15, seed, `prec${i}`)}% success rate for similar proposals`,
        `Compliance mapping identifies ${deterministicInt(1, 3, seed, `comp${i}`)} framework requirements`,
      ], seed, `finding-${i}`)}`);
    }
    return findings;
  }

  private generateRisks(agent: DecisionAgentDef, proposal: DecisionProposal, seed: string): AgentOutput['risks'] {
    const count = deterministicInt(1, 3, seed, 'risk-count');
    const risks: AgentOutput['risks'] = [];
    for (let i = 0; i < count; i++) {
      risks.push({
        description: deterministicPick([
          'Implementation delay beyond projected timeline',
          'Budget overrun due to unforeseen complexity',
          'Stakeholder resistance to proposed changes',
          'Regulatory change affecting compliance requirements',
          'Resource contention with concurrent initiatives',
          'Technology dependency risk for chosen approach',
        ], seed, `risk-${i}`),
        severity: deterministicPick(['low', 'medium', 'high'], seed, `sev-${i}`),
        probability: Math.round(deterministicFloat(seed, `prob-${i}`) * 100) / 100,
      });
    }
    return risks;
  }
}

class InstitutionalAgentsService {
  private state: string = InstitutionalState.NORMAL;

  getAgents(): InstitutionalAgentDef[] { return [...INSTITUTIONAL_AGENTS]; }

  getInstitutionalState(): string { return this.state; }
  setInstitutionalState(state: string): void { this.state = state; }

  async executeAgent(agentId: string, proposal: DecisionProposal, decisionOutputs: AgentOutput[], seed?: number): Promise<AgentOutput> {
    const agent = INSTITUTIONAL_AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error(`Institutional agent ${agentId} not found`);

    const s = `${agentId}-${seed || Date.now()}-${proposal.id}`;
    const avgConfidence = decisionOutputs.reduce((sum, o) => sum + o.confidence, 0) / (decisionOutputs.length || 1);
    const hasBlocking = deterministicBool(0.15, s, 'block');
    const confidence = deterministicPercentage(80, 12, s, agent.institutionType);

    return {
      agentId: agent.id,
      agentName: agent.name,
      recommendation: hasBlocking ? 'BLOCK' : 'APPROVE_WITH_CONDITIONS',
      confidence,
      rationale: `${agent.name} review: ${agent.institutionType} assessment of "${proposal.title}" with ${decisionOutputs.length} decision agent inputs. Institutional state: ${this.state}. ${hasBlocking ? `BLOCKED: Authority ${agent.authorities[0]} triggered.` : `Approved with ${deterministicInt(1, 3, s, 'conditions')} condition(s).`}`,
      findings: [
        `Institutional compliance: ${deterministicPick(['met', 'partially met', 'requires remediation'], s, 'compliance')}`,
        `Authority chain validation: ${deterministicPick(['verified', 'pending verification', 'escalation required'], s, 'authority')}`,
        `Process adherence: ${deterministicPercentage(90, 8, s, 'adherence')}%`,
      ],
      risks: hasBlocking ? [{
        description: `Blocking condition from ${agent.institutionType} authority`,
        severity: 'high',
        probability: 1.0,
      }] : [],
      timestamp: new Date().toISOString(),
    };
  }
}

class AdversarialAgentsService {
  getAgents(): AdversarialAgentDef[] { return [...ADVERSARIAL_AGENTS]; }

  async executeAgent(agentId: string, proposal: DecisionProposal, institutionalOutputs: AgentOutput[], seed?: number): Promise<AgentOutput> {
    const agent = ADVERSARIAL_AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error(`Adversarial agent ${agentId} not found`);

    const s = `${agentId}-${seed || Date.now()}-${proposal.id}`;
    const confidence = deterministicPercentage(68, 20, s, agent.attackProfile.type);

    return {
      agentId: agent.id,
      agentName: agent.name,
      recommendation: 'CAUTION',
      confidence,
      rationale: `${agent.name} adversarial analysis of "${proposal.title}": ${deterministicInt(2, 5, s, 'vulns')} vulnerability vectors identified. Attack sophistication: ${agent.attackProfile.sophistication}. ${institutionalOutputs.filter(o => o.recommendation === 'BLOCK').length} institutional blocks noted.`,
      findings: this.generateAdversarialFindings(agent, proposal, s),
      risks: [
        {
          description: `${deterministicPick(['Gaming vector', 'Exploitation path', 'Manipulation surface', 'Circumvention route'], s, 'attack')} identified in proposal design`,
          severity: deterministicPick(['medium', 'high', 'critical'], s, 'attack-sev'),
          probability: Math.round(deterministicFloat(s, 'attack-prob') * 0.6 * 100) / 100,
        },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  private generateAdversarialFindings(agent: AdversarialAgentDef, proposal: DecisionProposal, seed: string): string[] {
    return [
      `[RED] ${deterministicPick(['Incentive misalignment', 'Information asymmetry exploit', 'Authority boundary weakness', 'Process circumvention path'], seed, 'f1')} detected`,
      `[RED] ${deterministicPick(['Adversarial actor can exploit', 'Gaming opportunity in', 'Loophole identified in', 'Weakness in'], seed, 'f2')} ${deterministicPick(['implementation phase', 'approval process', 'monitoring gap', 'enforcement mechanism'], seed, 'f2b')}`,
      `[RED] Worst-case scenario: ${deterministicPick(['complete policy subversion', 'significant resource diversion', 'stakeholder trust erosion', 'regulatory backlash'], seed, 'f3')}`,
    ];
  }
}

class ObserverAgentsService {
  getAgents(): ObserverAgentDef[] { return [...OBSERVER_AGENTS]; }

  async executeAgent(agentId: string, seed?: number): Promise<AgentOutput> {
    const agent = OBSERVER_AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error(`Observer agent ${agentId} not found`);

    const s = `${agentId}-${seed || Date.now()}`;
    return {
      agentId: agent.id,
      agentName: agent.name,
      recommendation: 'OBSERVATION',
      confidence: deterministicPercentage(85, 10, s, agent.observationType),
      rationale: `Process observation by ${agent.name}: ${agent.observationType} monitoring active. Metrics tracked: ${agent.metrics.join(', ')}.`,
      findings: agent.metrics.map((m, i) => `${m}: ${deterministicPercentage(78, 15, s, `metric-${i}`)}%`),
      risks: [],
      timestamp: new Date().toISOString(),
    };
  }
}

class MetaGovernanceAgentsService {
  private interventionLog: Array<{ agentId: string; type: string; description: string; timestamp: string }> = [];

  getAgents(): MetaGovernanceAgentDef[] { return [...META_GOVERNANCE_AGENTS]; }

  async executeAllAgents(seed?: number): Promise<AgentOutput[]> {
    return Promise.all(META_GOVERNANCE_AGENTS.map(agent => this.executeAgent(agent.id, seed)));
  }

  private async executeAgent(agentId: string, seed?: number): Promise<AgentOutput> {
    const agent = META_GOVERNANCE_AGENTS.find(a => a.id === agentId)!;
    const s = `${agentId}-${seed || Date.now()}`;
    const detectedIssues = deterministicInt(0, 2, s, 'issues');

    if (detectedIssues > 0) {
      this.interventionLog.push({
        agentId: agent.id,
        type: deterministicPick(agent.detectionPatterns, s, 'pattern'),
        description: `${agent.name} detected ${detectedIssues} governance concern(s)`,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      agentId: agent.id,
      agentName: agent.name,
      recommendation: detectedIssues > 0 ? 'INTERVENTION_REQUIRED' : 'GOVERNANCE_HEALTHY',
      confidence: deterministicPercentage(82, 12, s, 'confidence'),
      rationale: `${agent.name}: ${detectedIssues === 0 ? 'No governance concerns detected' : `${detectedIssues} concern(s) detected requiring attention`}. Patterns monitored: ${agent.detectionPatterns.join(', ')}.`,
      findings: agent.governanceMetrics.map((m, i) => `${m}: ${deterministicPercentage(85, 12, s, `gm-${i}`)}%`),
      risks: detectedIssues > 0 ? [{
        description: `Governance integrity concern detected by ${agent.name}`,
        severity: 'medium',
        probability: 0.3 + deterministicFloat(s, 'risk-prob') * 0.4,
      }] : [],
      timestamp: new Date().toISOString(),
    };
  }

  aggregateOutputs(outputs: AgentOutput[]): {
    overallHealth: number;
    interventionsRequired: number;
    criticalIssues: number;
    recommendations: string[];
  } {
    const interventions = outputs.filter(o => o.recommendation === 'INTERVENTION_REQUIRED').length;
    const avgConfidence = outputs.reduce((s, o) => s + o.confidence, 0) / (outputs.length || 1);

    return {
      overallHealth: Math.round(avgConfidence),
      interventionsRequired: interventions,
      criticalIssues: outputs.reduce((s, o) => s + o.risks.filter(r => r.severity === 'critical').length, 0),
      recommendations: interventions > 0
        ? ['Review flagged governance concerns', 'Consider additional deliberation round', 'Engage external oversight']
        : ['Governance processes functioning within normal parameters'],
    };
  }

  getInterventionLog() { return [...this.interventionLog]; }
}

// =============================================================================
// SGAS ORCHESTRATOR
// =============================================================================

class SGASOrchestrator {
  private activeDeliberations = new Map<string, DeliberationGraph>();
  private completedDeliberations = new Map<string, DeliberationResult>();
  private statistics = {
    totalDeliberations: 0,
    totalApproved: 0,
    totalBlocked: 0,
    averageConfidence: 0,
  };

  constructor() {
    logger.info(`🏛️ SGAS: Initialized — ${DECISION_AGENTS.length} decision, ${INSTITUTIONAL_AGENTS.length} institutional, ${ADVERSARIAL_AGENTS.length} adversarial, ${OBSERVER_AGENTS.length} observer, ${META_GOVERNANCE_AGENTS.length} meta-governance agents`);
  }

  async executeDeliberation(
    proposal: DecisionProposal,
    config: Record<string, any>,
    seed?: number,
  ): Promise<DeliberationResult> {
    const actualSeed = seed ?? Date.now();
    const graphId = `SGAS-${crypto.randomUUID().slice(0, 8)}`;
    const s = `${actualSeed}-${proposal.id}`;

    logger.info(`SGAS: Starting deliberation ${graphId} for "${proposal.title}"`);

    // Track active deliberation
    this.activeDeliberations.set(graphId, {
      id: graphId,
      proposalId: proposal.id,
      status: 'in_progress',
      phase: 'decision',
      nodes: [],
      edges: [],
      deterministicHash: '',
      metadata: { seed: actualSeed, proposalTitle: proposal.title },
    } as DeliberationGraph);

    // Phase 1: Decision agents analyze the proposal
    const decisionOutputs = await Promise.all(
      DECISION_AGENTS.map(agent => decisionAgentsService.executeAgent(agent.id, proposal, actualSeed)),
    );

    // Phase 2: Institutional agents review with decision context
    const institutionalOutputs = await Promise.all(
      INSTITUTIONAL_AGENTS.map(agent => institutionalAgentsService.executeAgent(agent.id, proposal, decisionOutputs, actualSeed)),
    );

    // Phase 3: Adversarial agents probe for weaknesses
    const adversarialOutputs = await Promise.all(
      ADVERSARIAL_AGENTS.map(agent => adversarialAgentsService.executeAgent(agent.id, proposal, institutionalOutputs, actualSeed)),
    );

    // Phase 4: Observer agents monitor process integrity
    const observerOutputs = await Promise.all(
      OBSERVER_AGENTS.map(agent => observerAgentsService.executeAgent(agent.id, actualSeed)),
    );

    // Phase 5: Meta-governance agents assess governance health
    const metaOutputs = await metaGovernanceAgentsService.executeAllAgents(actualSeed);

    // Build deliberation graph
    const allOutputs = [...decisionOutputs, ...institutionalOutputs, ...adversarialOutputs, ...observerOutputs, ...metaOutputs];
    const nodes = allOutputs.map((output, i) => ({
      id: `node-${i}`,
      type: output.recommendation === 'OBSERVATION' ? 'observer' : output.recommendation === 'CAUTION' ? 'adversarial' : 'decision',
      agentId: output.agentId,
      output,
    }));

    const edges: Array<{ from: string; to: string; type: string }> = [];
    // Decision → Institutional edges
    for (let i = 0; i < decisionOutputs.length; i++) {
      for (let j = 0; j < institutionalOutputs.length; j++) {
        edges.push({ from: `node-${i}`, to: `node-${decisionOutputs.length + j}`, type: 'feeds-into' });
      }
    }

    const graphHash = crypto.createHash('sha256').update(JSON.stringify(nodes.map(n => n.output))).digest('hex');

    const graph: DeliberationGraph = {
      id: graphId,
      proposalId: proposal.id,
      status: 'completed',
      phase: 'final',
      nodes,
      edges,
      deterministicHash: graphHash,
      completedAt: new Date().toISOString(),
      metadata: { seed: actualSeed, proposalTitle: proposal.title },
    };

    // Determine outcome
    const blockers = institutionalOutputs.filter(o => o.recommendation === 'BLOCK').map(o => o.rationale);
    const approvals = decisionOutputs.filter(o => o.recommendation === 'APPROVE').length;
    const conditions = allOutputs.filter(o => o.recommendation.includes('CONDITION')).map(o => o.rationale);
    const overallConfidence = allOutputs.reduce((sum, o) => sum + o.confidence, 0) / allOutputs.length;

    const result: DeliberationResult = {
      graph,
      finalStatus: {
        approved: blockers.length === 0 && approvals >= Math.ceil(DECISION_AGENTS.length / 2),
        blocked: blockers.length > 0,
        conditions,
        blockers,
      },
      summary: {
        totalAgents: allOutputs.length,
        approvals,
        rejections: decisionOutputs.filter(o => o.recommendation === 'REJECT').length,
        conditions: conditions.length,
        overallConfidence: Math.round(overallConfidence * 100) / 100,
        riskLevel: overallConfidence > 80 ? 'low' : overallConfidence > 60 ? 'medium' : 'high',
      },
    };

    this.activeDeliberations.delete(graphId);
    this.completedDeliberations.set(graphId, result);
    this.statistics.totalDeliberations++;
    if (result.finalStatus.approved) this.statistics.totalApproved++;
    if (result.finalStatus.blocked) this.statistics.totalBlocked++;
    this.statistics.averageConfidence = Math.round(
      ((this.statistics.averageConfidence * (this.statistics.totalDeliberations - 1)) + overallConfidence) /
      this.statistics.totalDeliberations * 100
    ) / 100;

    logger.info(`SGAS: Deliberation ${graphId} complete — ${result.finalStatus.approved ? 'APPROVED' : 'NOT APPROVED'} (confidence: ${overallConfidence.toFixed(1)}%)`);

    return result;
  }

  getActiveDeliberation(id: string): DeliberationGraph | undefined {
    return this.activeDeliberations.get(id);
  }

  getCompletedDeliberation(id: string): DeliberationResult | undefined {
    return this.completedDeliberations.get(id);
  }

  listCompletedDeliberations(): DeliberationResult[] {
    return [...this.completedDeliberations.values()];
  }

  getStatistics() {
    return { ...this.statistics };
  }
}

// =============================================================================
// UTILITIES
// =============================================================================

export function generateSGASId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// =============================================================================
// SINGLETON EXPORTS
// =============================================================================

export const decisionAgentsService = new DecisionAgentsService();
export const institutionalAgentsService = new InstitutionalAgentsService();
export const adversarialAgentsService = new AdversarialAgentsService();
export const observerAgentsService = new ObserverAgentsService();
export const metaGovernanceAgentsService = new MetaGovernanceAgentsService();
export const sgasOrchestrator = new SGASOrchestrator();
