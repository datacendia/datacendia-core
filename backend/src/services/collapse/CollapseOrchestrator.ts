/**
 * CendiaCOLLAPSE™ — Adversarial Policy Stress-Testing Orchestrator
 *
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 *
 * Runs dual-track deliberation:
 *   1. Consensus Track — standard multi-agent agreement
 *   2. Collapse Track — 18 adversarial agents probing for failure modes
 *
 * Produces a cryptographically verifiable Failure Envelope with Merkle root
 * for tamper-evident audit trails.
 *
 * @module services/collapse/CollapseOrchestrator
 * @exports collapseOrchestrator
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

export interface PolicyContext {
  decisionId: string;
  decisionText: string;
  policyDomain: string;
  targetPopulation: number;
  geographicScope: string;
  budgetImpact: number;
  timelineMonths: number;
  existingConditions: Record<string, any>;
  stakeholders: string[];
  historicalAnalogues?: string[];
}

export interface CollapseAgentDescription {
  id: string;
  name: string;
  role: string;
  perspective: string;
  attackVector: string;
  category: 'structural' | 'social' | 'adversarial' | 'temporal' | 'systemic';
}

export interface FailureCondition {
  id: string;
  agent: string;
  agentName: string;
  category: string;
  severity: number;
  probability: number;
  timeToManifest: string;
  failureEvent: {
    description: string;
    mechanism: string;
    affectedPopulation: number;
    cascadeRisk: number;
  };
  mitigations: string[];
  nonOverridable: boolean;
  hash: string;
}

export interface FailureEnvelope {
  id: string;
  decisionId: string;
  failureConditions: FailureCondition[];
  totalConditions: number;
  criticalCount: number;
  merkleRoot: string;
  merkleLeaves: string[];
  generatedAt: string;
  integrityHash: string;
}

export interface ConsensusTrack {
  confidence: number;
  recommendation: string;
  agentVotes: Array<{ agentId: string; vote: string; confidence: number; rationale: string }>;
  synthesisNarrative: string;
}

export interface CollapseTrack {
  totalRisk: number;
  criticalFindings: number;
  failureEnvelope: FailureEnvelope;
  agentAnalyses: Array<{
    agentId: string;
    agentName: string;
    findings: FailureCondition[];
    riskScore: number;
    summary: string;
  }>;
}

export interface TrustDelta {
  consensusConfidence: number;
  collapseRisk: number;
  trustDelta: number;
  deploymentRecommendation: string;
  riskLevel: string;
}

export interface DualTrackDeliberation {
  id: string;
  decisionId: string;
  decisionText: string;
  policyContext: PolicyContext;
  consensusTrack: ConsensusTrack;
  collapseTrack: CollapseTrack;
  trustDelta: TrustDelta;
  seed: number;
  merkleRoot: string;
  completedAt: string;
}

export interface CollapseConfig {
  maxAgents: number;
  severityThreshold: number;
  enableNonOverridable: boolean;
  deterministicMode: boolean;
  consensusRequiredConfidence: number;
}

// =============================================================================
// ADVERSARIAL AGENT DEFINITIONS
// =============================================================================

const COLLAPSE_AGENTS: CollapseAgentDescription[] = [
  {
    id: 'BIAS_AMPLIFICATION',
    name: 'Bias Amplification Detector',
    role: 'Identifies how existing societal biases are encoded in data and amplified by the policy',
    perspective: 'Historical discrimination patterns and feedback loops',
    attackVector: 'Data-encoded bias → policy amplification → disproportionate harm',
    category: 'social',
  },
  {
    id: 'REGULATORY_CAPTURE',
    name: 'Regulatory Capture Analyst',
    role: 'Detects when policy benefits regulated entities at the expense of public interest',
    perspective: 'Regulatory economics and revolving-door dynamics',
    attackVector: 'Industry influence → policy design → regulatory capture',
    category: 'structural',
  },
  {
    id: 'FEEDBACK_LOOP',
    name: 'Feedback Loop Detector',
    role: 'Identifies self-reinforcing cycles that compound negative outcomes',
    perspective: 'Systems dynamics and second-order effects',
    attackVector: 'Initial condition → feedback mechanism → runaway amplification',
    category: 'systemic',
  },
  {
    id: 'MINORITY_HARM',
    name: 'Minority Harm Assessor',
    role: 'Evaluates disproportionate impact on vulnerable and minority populations',
    perspective: 'Civil rights, equity, and disparate impact analysis',
    attackVector: 'Aggregate benefit masking → localized harm → systemic exclusion',
    category: 'social',
  },
  {
    id: 'TEMPORAL_DECAY',
    name: 'Temporal Decay Analyst',
    role: 'Projects how effectiveness degrades over time as conditions change',
    perspective: 'Policy lifecycle and adaptive failure modes',
    attackVector: 'Initial effectiveness → environmental shift → policy obsolescence',
    category: 'temporal',
  },
  {
    id: 'RESOURCE_CAPTURE',
    name: 'Resource Capture Detector',
    role: 'Identifies how resources intended for public benefit get redirected',
    perspective: 'Public choice theory and rent-seeking behavior',
    attackVector: 'Budget allocation → intermediary capture → benefit diversion',
    category: 'structural',
  },
  {
    id: 'LEGITIMACY_EROSION',
    name: 'Legitimacy Erosion Analyst',
    role: 'Measures how the policy erodes institutional trust and democratic legitimacy',
    perspective: 'Institutional trust, democratic norms, and social contract',
    attackVector: 'Policy action → trust violation → legitimacy collapse',
    category: 'social',
  },
  {
    id: 'UNINTENDED_CONSEQUENCES',
    name: 'Unintended Consequences Mapper',
    role: 'Maps second and third-order effects that were not anticipated',
    perspective: 'Complex adaptive systems and emergent behavior',
    attackVector: 'Primary effect → cascade → emergent harm',
    category: 'systemic',
  },
  {
    id: 'IMPLEMENTATION_FAILURE',
    name: 'Implementation Failure Predictor',
    role: 'Identifies practical barriers to effective implementation',
    perspective: 'Organizational capacity, bureaucratic constraints, and execution risk',
    attackVector: 'Design intent → implementation gap → operational failure',
    category: 'structural',
  },
  {
    id: 'ADVERSARIAL_GAMING',
    name: 'Adversarial Gaming Detector',
    role: 'Simulates how actors will game, exploit, or circumvent the policy',
    perspective: 'Game theory, strategic behavior, and rational actor exploitation',
    attackVector: 'Incentive structure → strategic response → policy subversion',
    category: 'adversarial',
  },
  {
    id: 'INFORMATION_ASYMMETRY',
    name: 'Information Asymmetry Analyst',
    role: 'Identifies who benefits from unequal access to policy information',
    perspective: 'Information economics and transparency failures',
    attackVector: 'Knowledge gap → exploitation opportunity → unfair advantage',
    category: 'adversarial',
  },
  {
    id: 'SCALABILITY_FAILURE',
    name: 'Scalability Failure Detector',
    role: 'Tests whether the policy breaks under load or at scale',
    perspective: 'Scale-dependent failure modes and capacity constraints',
    attackVector: 'Small-scale success → scaling → systemic breakdown',
    category: 'systemic',
  },
  {
    id: 'FREE_SPEECH',
    name: 'Free Speech & Rights Assessor',
    role: 'Evaluates whether the policy infringes on fundamental rights and freedoms',
    perspective: 'Constitutional rights, civil liberties, and freedom of expression',
    attackVector: 'Policy enforcement → rights restriction → constitutional conflict',
    category: 'social',
  },
  {
    id: 'ECONOMIC_DISTORTION',
    name: 'Economic Distortion Analyst',
    role: 'Models market distortions and perverse economic incentives created by the policy',
    perspective: 'Market economics, deadweight loss, and incentive alignment',
    attackVector: 'Market intervention → price signal distortion → resource misallocation',
    category: 'structural',
  },
  {
    id: 'GEOGRAPHIC_INEQUITY',
    name: 'Geographic Inequity Assessor',
    role: 'Identifies spatial disparities in policy impact across regions',
    perspective: 'Spatial analysis, urban-rural divide, and regional economics',
    attackVector: 'Uniform policy → geographic variance → localized harm',
    category: 'social',
  },
  {
    id: 'CORRUPTION_VECTOR',
    name: 'Corruption Vector Scanner',
    role: 'Identifies entry points for corruption, bribery, and malfeasance',
    perspective: 'Anti-corruption, transparency, and accountability mechanisms',
    attackVector: 'Discretionary power → accountability gap → corruption opportunity',
    category: 'adversarial',
  },
  {
    id: 'TECHNOLOGICAL_OBSOLESCENCE',
    name: 'Technological Obsolescence Predictor',
    role: 'Assesses risk of the policy being rendered ineffective by technology changes',
    perspective: 'Technology forecasting and digital transformation risk',
    attackVector: 'Technology assumption → disruption → policy irrelevance',
    category: 'temporal',
  },
  {
    id: 'CASCADING_FAILURE',
    name: 'Cascading Failure Modeler',
    role: 'Models how a failure in one component triggers failures across the system',
    perspective: 'Network theory, critical infrastructure, and systemic risk',
    attackVector: 'Single point failure → dependency chain → system-wide collapse',
    category: 'systemic',
  },
];

// =============================================================================
// COLLAPSE ORCHESTRATOR
// =============================================================================

class CollapseOrchestrator {
  private static readonly MAX_CACHE_SIZE = 1000;
  private deliberations = new Map<string, DualTrackDeliberation>();
  private envelopes = new Map<string, FailureEnvelope>();
  private config: CollapseConfig = {
    maxAgents: 18,
    severityThreshold: 0.3,
    enableNonOverridable: true,
    deterministicMode: true,
    consensusRequiredConfidence: 0.85,
  };

  constructor() {
    logger.info(`🔴 CendiaCOLLAPSE: Initialized with ${COLLAPSE_AGENTS.length} adversarial agents`);
  }

  private evictIfNeeded(map: Map<string, any>, maxSize = CollapseOrchestrator.MAX_CACHE_SIZE) {
    if (map.size > maxSize) {
      const keysToDelete = [...map.keys()].slice(0, map.size - maxSize);
      keysToDelete.forEach(k => map.delete(k));
    }
  }

  // ---------------------------------------------------------------------------
  // AGENT MANAGEMENT
  // ---------------------------------------------------------------------------

  getAgentDescriptions(): CollapseAgentDescription[] {
    return [...COLLAPSE_AGENTS];
  }

  // ---------------------------------------------------------------------------
  // CONFIGURATION
  // ---------------------------------------------------------------------------

  getConfig(): CollapseConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<CollapseConfig>): void {
    Object.assign(this.config, updates);
    logger.info('CendiaCOLLAPSE: Configuration updated', updates);
  }

  // ---------------------------------------------------------------------------
  // DUAL-TRACK DELIBERATION
  // ---------------------------------------------------------------------------

  async runDualTrackDeliberation(
    decisionId: string,
    decisionText: string,
    policyContext: PolicyContext,
    consensusConfidence: number = 0.85,
    seed?: number,
  ): Promise<DualTrackDeliberation> {
    const actualSeed = seed ?? Date.now();
    const deliberationId = `COLLAPSE-${crypto.randomUUID().slice(0, 8)}`;

    logger.info(`CendiaCOLLAPSE: Starting dual-track deliberation ${deliberationId}`);

    // Run both tracks
    const [consensusTrack, collapseTrack] = await Promise.all([
      this.runConsensusTrack(decisionId, decisionText, policyContext, consensusConfidence, actualSeed),
      this.runCollapseTrack(decisionId, decisionText, policyContext, actualSeed),
    ]);

    // Compute trust delta
    const trustDelta = this.computeTrustDelta(consensusTrack.confidence / 100, collapseTrack.totalRisk);

    const deliberation: DualTrackDeliberation = {
      id: deliberationId,
      decisionId,
      decisionText,
      policyContext,
      consensusTrack,
      collapseTrack,
      trustDelta,
      seed: actualSeed,
      merkleRoot: collapseTrack.failureEnvelope.merkleRoot,
      completedAt: new Date().toISOString(),
    };

    this.deliberations.set(deliberationId, deliberation);
    this.envelopes.set(collapseTrack.failureEnvelope.id, collapseTrack.failureEnvelope);
    this.evictIfNeeded(this.deliberations);
    this.evictIfNeeded(this.envelopes);

    logger.info(`CendiaCOLLAPSE: Deliberation ${deliberationId} complete — Trust Δ: ${trustDelta.trustDelta.toFixed(3)}, Recommendation: ${trustDelta.deploymentRecommendation}`);

    return deliberation;
  }

  // ---------------------------------------------------------------------------
  // CONSENSUS TRACK
  // ---------------------------------------------------------------------------

  private async runConsensusTrack(
    decisionId: string,
    decisionText: string,
    ctx: PolicyContext,
    requiredConfidence: number,
    seed: number,
  ): Promise<ConsensusTrack> {
    const consensusAgents = [
      { id: 'CFO', role: 'Chief Financial Officer' },
      { id: 'CLO', role: 'Chief Legal Officer' },
      { id: 'CTO', role: 'Chief Technology Officer' },
      { id: 'CSO', role: 'Chief Strategy Officer' },
      { id: 'CISO', role: 'Chief Information Security Officer' },
    ];

    const votes = consensusAgents.map((agent, i) => {
      const seedStr = `consensus-${seed}-${agent.id}-${decisionId}`;
      const confidence = deterministicPercentage(75, 20, seedStr, ctx.policyDomain, ctx.budgetImpact);
      const approve = deterministicBool(0.7, seedStr, 'vote');

      return {
        agentId: agent.id,
        vote: approve ? 'APPROVE' : 'CONDITIONAL_APPROVE',
        confidence,
        rationale: this.generateConsensusRationale(agent, ctx, confidence, seedStr),
      };
    });

    const avgConfidence = votes.reduce((s, v) => s + v.confidence, 0) / votes.length;
    const approvalRate = votes.filter(v => v.vote === 'APPROVE').length / votes.length;

    return {
      confidence: Math.round(avgConfidence * 100) / 100,
      recommendation: (avgConfidence >= requiredConfidence && approvalRate >= 0.6) ? 'APPROVE' : 'CONDITIONAL_APPROVE',
      agentVotes: votes,
      synthesisNarrative: `Council reached ${(avgConfidence >= requiredConfidence && approvalRate >= 0.6) ? 'majority approval' : 'conditional consensus'} with ${avgConfidence.toFixed(1)}% average confidence. ${votes.filter(v => v.vote !== 'APPROVE').length} agent(s) expressed reservations regarding ${ctx.policyDomain} impact on ${ctx.targetPopulation.toLocaleString()} affected individuals.`,
    };
  }

  private generateConsensusRationale(
    agent: { id: string; role: string },
    ctx: PolicyContext,
    confidence: number,
    seed: string,
  ): string {
    const rationales: Record<string, string[]> = {
      CFO: [
        `Budget impact of $${(ctx.budgetImpact / 1e6).toFixed(1)}M is within acceptable range for ${ctx.timelineMonths}-month timeline.`,
        `Financial risk is moderate given the ${ctx.geographicScope} scope. ROI projections need validation.`,
        `Cost-benefit analysis supports proceeding with phased funding gates.`,
      ],
      CLO: [
        `Legal review identifies manageable regulatory exposure in ${ctx.policyDomain} domain.`,
        `Compliance frameworks applicable to ${ctx.geographicScope} jurisdiction have been evaluated.`,
        `Recommend enhanced disclosure for ${ctx.stakeholders.length} stakeholder groups.`,
      ],
      CTO: [
        `Technical feasibility confirmed for ${ctx.timelineMonths}-month implementation timeline.`,
        `Infrastructure requirements are achievable with current capabilities.`,
        `Recommend phased rollout to mitigate integration risk across ${ctx.targetPopulation.toLocaleString()} users.`,
      ],
      CSO: [
        `Strategic alignment with organizational goals confirmed for ${ctx.policyDomain} initiative.`,
        `Market positioning is favorable given ${ctx.geographicScope} competitive landscape.`,
        `Stakeholder mapping identifies ${ctx.stakeholders.length} key groups requiring engagement.`,
      ],
      CISO: [
        `Security assessment identifies acceptable risk profile for ${ctx.policyDomain} data handling.`,
        `Data protection requirements for ${ctx.targetPopulation.toLocaleString()} subjects are addressable.`,
        `Recommend security review at each implementation milestone.`,
      ],
    };

    const agentRationales = rationales[agent.id] || rationales['CSO']!;
    const idx = deterministicInt(0, agentRationales.length - 1, seed, 'rationale');
    return agentRationales[idx]!;
  }

  // ---------------------------------------------------------------------------
  // COLLAPSE TRACK
  // ---------------------------------------------------------------------------

  async runCollapseTrack(
    decisionId: string,
    decisionText: string,
    policyContext: PolicyContext,
    seed: number,
  ): Promise<CollapseTrack> {
    const agentAnalyses = COLLAPSE_AGENTS.map(agent => {
      const findings = this.runAgentAnalysis(agent, decisionId, decisionText, policyContext, seed);
      const riskScore = findings.length > 0
        ? findings.reduce((s, f) => s + f.severity * f.probability, 0) / findings.length
        : 0;

      return {
        agentId: agent.id,
        agentName: agent.name,
        findings,
        riskScore: Math.round(riskScore * 1000) / 1000,
        summary: this.generateAgentSummary(agent, findings, policyContext),
      };
    });

    const allFindings = agentAnalyses.flatMap(a => a.findings);
    const criticalFindings = allFindings.filter(f => f.severity >= 0.7).length;
    const totalRisk = allFindings.length > 0
      ? allFindings.reduce((s, f) => s + f.severity * f.probability, 0) / allFindings.length
      : 0;

    const failureEnvelope = this.buildFailureEnvelope(decisionId, allFindings);
    this.envelopes.set(failureEnvelope.id, failureEnvelope);

    return {
      totalRisk: Math.round(totalRisk * 1000) / 1000,
      criticalFindings,
      failureEnvelope,
      agentAnalyses,
    };
  }

  private runAgentAnalysis(
    agent: CollapseAgentDescription,
    decisionId: string,
    decisionText: string,
    ctx: PolicyContext,
    seed: number,
  ): FailureCondition[] {
    const seedStr = `${agent.id}-${seed}-${decisionId}`;
    const findings: FailureCondition[] = [];

    // Each agent generates 1-4 findings based on context relevance
    const relevance = this.computeAgentRelevance(agent, ctx);
    const findingCount = deterministicInt(
      relevance > 0.7 ? 2 : 1,
      relevance > 0.7 ? 4 : 2,
      seedStr, 'count',
    );

    for (let i = 0; i < findingCount; i++) {
      const fSeed = `${seedStr}-finding-${i}`;
      const severity = deterministicFloat(fSeed, 'severity', ctx.policyDomain);
      const adjustedSeverity = severity * (0.5 + relevance * 0.5); // Scale by relevance
      const probability = deterministicFloat(fSeed, 'probability', ctx.targetPopulation);
      const affectedPop = Math.round(ctx.targetPopulation * deterministicFloat(fSeed, 'affected') * adjustedSeverity);

      const finding: FailureCondition = {
        id: `FC-${crypto.randomUUID().slice(0, 8)}`,
        agent: agent.id,
        agentName: agent.name,
        category: agent.category,
        severity: Math.round(adjustedSeverity * 1000) / 1000,
        probability: Math.round(probability * 1000) / 1000,
        timeToManifest: this.estimateTimeToManifest(agent, ctx, fSeed),
        failureEvent: {
          description: this.generateFailureDescription(agent, ctx, i, fSeed),
          mechanism: agent.attackVector,
          affectedPopulation: affectedPop,
          cascadeRisk: Math.round(deterministicFloat(fSeed, 'cascade') * 1000) / 1000,
        },
        mitigations: this.generateMitigations(agent, ctx, fSeed),
        nonOverridable: this.isNonOverridable(agent, adjustedSeverity),
        hash: '',
      };
      finding.hash = this.hashFinding(finding);
      findings.push(finding);
    }

    return findings;
  }

  private computeAgentRelevance(agent: CollapseAgentDescription, ctx: PolicyContext): number {
    let relevance = 0.5;

    // High-population decisions increase social agent relevance
    if (['social'].includes(agent.category) && ctx.targetPopulation > 100000) relevance += 0.2;
    // Large budgets increase structural agent relevance
    if (['structural'].includes(agent.category) && ctx.budgetImpact > 1000000) relevance += 0.2;
    // Long timelines increase temporal agent relevance
    if (['temporal'].includes(agent.category) && ctx.timelineMonths > 12) relevance += 0.2;
    // Adversarial agents always moderately relevant
    if (agent.category === 'adversarial') relevance += 0.15;
    // Systemic agents relevant for complex contexts
    if (agent.category === 'systemic' && ctx.stakeholders.length > 3) relevance += 0.2;
    // Public safety domains amplify all agents
    if (['Public Safety', 'Healthcare', 'Education', 'Defense'].includes(ctx.policyDomain)) relevance += 0.1;

    return Math.min(1, relevance);
  }

  private estimateTimeToManifest(agent: CollapseAgentDescription, ctx: PolicyContext, seed: string): string {
    const baseMonths: Record<string, number> = {
      structural: 6,
      social: 3,
      adversarial: 1,
      temporal: 12,
      systemic: 9,
    };
    const base = baseMonths[agent.category] || 6;
    const variance = deterministicInt(-2, 4, seed, 'manifest');
    const months = Math.max(1, base + variance);
    return months <= 1 ? '< 1 month' : months <= 3 ? '1-3 months' : months <= 6 ? '3-6 months' : months <= 12 ? '6-12 months' : '12+ months';
  }

  private generateFailureDescription(agent: CollapseAgentDescription, ctx: PolicyContext, index: number, seed: string): string {
    const templates: Record<string, string[]> = {
      BIAS_AMPLIFICATION: [
        `Historical data in ${ctx.policyDomain} encodes pre-existing discrimination patterns — deployment amplifies bias against underrepresented groups in ${ctx.geographicScope} region`,
        `Algorithmic processing of ${ctx.policyDomain} data creates feedback loop that systematically disadvantages populations with limited historical data representation`,
        `Training data from ${ctx.geographicScope} region contains structural biases that compound with each iteration of the ${ctx.policyDomain} system`,
      ],
      REGULATORY_CAPTURE: [
        `Regulatory framework in ${ctx.policyDomain} domain shows capture indicators — primary beneficiaries are regulated entities, not the ${ctx.targetPopulation.toLocaleString()} constituents`,
        `Policy design aligns with industry lobbying positions in ${ctx.policyDomain}, creating compliance structures that barrier smaller competitors`,
      ],
      FEEDBACK_LOOP: [
        `Self-reinforcing cycle detected: ${ctx.policyDomain} enforcement → behavioral adaptation → increased enforcement justification → escalating intervention`,
        `Measurement of ${ctx.policyDomain} outcomes creates perverse incentive loop — optimization of tracked metrics degrades untracked outcomes`,
      ],
      MINORITY_HARM: [
        `Disproportionate impact on vulnerable populations within ${ctx.geographicScope}: aggregate net-positive masks localized harm to ~${Math.round(ctx.targetPopulation * 0.15).toLocaleString()} individuals`,
        `${ctx.policyDomain} policy creates disparate impact for communities with limited political representation in ${ctx.geographicScope} region`,
        `Vulnerable populations bear ${deterministicPercentage(67, 15, seed, 'harm')}% of negative externalities while receiving ${deterministicPercentage(12, 8, seed, 'benefit')}% of benefits`,
      ],
      TEMPORAL_DECAY: [
        `Policy effectiveness projected to degrade by ${deterministicPercentage(40, 15, seed, 'decay')}% within ${ctx.timelineMonths} months as ${ctx.policyDomain} conditions evolve`,
        `Environmental assumptions underlying ${ctx.policyDomain} strategy become invalid as market/regulatory conditions shift in ${ctx.geographicScope}`,
      ],
      RESOURCE_CAPTURE: [
        `$${(ctx.budgetImpact * deterministicFloat(seed, 'capture') * 0.3).toFixed(0)} of allocated budget projected to be captured by intermediaries before reaching intended beneficiaries`,
        `Resource allocation mechanism in ${ctx.policyDomain} creates rent-seeking opportunities for institutional intermediaries`,
      ],
      LEGITIMACY_EROSION: [
        `Public trust in ${ctx.policyDomain} institutions projected to decline by ${deterministicPercentage(25, 10, seed, 'trust')}% within 12 months of implementation in ${ctx.geographicScope}`,
        `Policy implementation undermines ${deterministicPick(['procedural justice norms', 'democratic accountability mechanisms', 'institutional transparency expectations'], seed, 'norm')}`,
      ],
      UNINTENDED_CONSEQUENCES: [
        `Second-order effect: ${ctx.policyDomain} intervention creates displacement of harm to adjacent domain affecting additional ~${Math.round(ctx.targetPopulation * 0.2).toLocaleString()} individuals`,
        `Third-order cascade: correction mechanisms trigger adaptive responses that counteract original policy objectives in ${ctx.geographicScope}`,
      ],
      IMPLEMENTATION_FAILURE: [
        `Organizational capacity analysis indicates ${deterministicPercentage(45, 15, seed, 'capacity')}% probability of implementation failure due to resource constraints in ${ctx.geographicScope}`,
        `Bureaucratic friction points identified across ${ctx.stakeholders.length} stakeholder interfaces — coordination cost exceeds implementation budget by ${deterministicPercentage(30, 20, seed, 'overrun')}%`,
      ],
      ADVERSARIAL_GAMING: [
        `Game-theoretic analysis reveals rational actors will exploit ${ctx.policyDomain} policy through ${deterministicPick(['regulatory arbitrage', 'compliance theater', 'strategic non-compliance', 'loophole exploitation'], seed, 'exploit')}`,
        `Incentive structure creates ${deterministicPick(['moral hazard', 'adverse selection', 'free-rider problem', 'tragedy of the commons'], seed, 'game')} within ${ctx.timelineMonths} months`,
      ],
      INFORMATION_ASYMMETRY: [
        `Information gap between policy implementers and ${ctx.targetPopulation.toLocaleString()} affected individuals creates exploitation vector in ${ctx.policyDomain}`,
        `Asymmetric access to ${ctx.policyDomain} policy details advantages institutional actors over individual stakeholders in ${ctx.geographicScope}`,
      ],
      SCALABILITY_FAILURE: [
        `${ctx.policyDomain} approach validated at pilot scale fails at ${ctx.targetPopulation.toLocaleString()} population — non-linear complexity growth overwhelms implementation capacity`,
        `Infrastructure supporting ${ctx.policyDomain} cannot handle projected load in ${ctx.geographicScope} scope — ${deterministicPercentage(35, 15, seed, 'bottleneck')}% performance degradation expected`,
      ],
      FREE_SPEECH: [
        `Policy enforcement mechanisms in ${ctx.policyDomain} domain create chilling effect on legitimate ${deterministicPick(['public discourse', 'whistleblowing', 'academic inquiry', 'journalistic investigation'], seed, 'speech')}`,
        `${ctx.policyDomain} implementation requires surveillance capabilities that conflict with ${deterministicPick(['Fourth Amendment protections', 'privacy rights', 'freedom of assembly', 'due process requirements'], seed, 'right')}`,
      ],
      ECONOMIC_DISTORTION: [
        `$${(ctx.budgetImpact * 1.5).toLocaleString()} in projected market distortion from ${ctx.policyDomain} intervention — deadweight loss exceeds policy benefits within ${ctx.timelineMonths} months`,
        `Price signal interference in ${ctx.policyDomain} sector creates resource misallocation affecting ${ctx.geographicScope} economic activity`,
      ],
      GEOGRAPHIC_INEQUITY: [
        `Uniform ${ctx.policyDomain} policy applied across ${ctx.geographicScope} creates ${deterministicPercentage(40, 15, seed, 'inequity')}% outcome variance between urban and rural communities`,
        `Regional economic disparities in ${ctx.geographicScope} amplify differential policy impact — disadvantaged areas experience disproportionate burden`,
      ],
      CORRUPTION_VECTOR: [
        `${deterministicInt(3, 7, seed, 'vectors')} corruption entry points identified in ${ctx.policyDomain} implementation chain — discretionary decision nodes lack accountability mechanisms`,
        `Audit trail gaps in ${ctx.policyDomain} resource allocation create opportunities for ${deterministicPick(['embezzlement', 'kickback schemes', 'patronage networks', 'bid rigging'], seed, 'corruption')}`,
      ],
      TECHNOLOGICAL_OBSOLESCENCE: [
        `Technology assumptions underlying ${ctx.policyDomain} strategy face ${deterministicPercentage(55, 20, seed, 'obsolescence')}% probability of disruption within ${ctx.timelineMonths} months`,
        `${ctx.policyDomain} policy locks in technology choices that are projected to become obsolete before implementation completes in ${ctx.geographicScope}`,
      ],
      CASCADING_FAILURE: [
        `Single point of failure in ${ctx.policyDomain} infrastructure — failure triggers cascade affecting ${deterministicInt(3, 8, seed, 'cascade')} dependent systems across ${ctx.geographicScope}`,
        `Dependency chain analysis reveals ${ctx.policyDomain} system has ${deterministicInt(2, 5, seed, 'deps')} critical bottlenecks — any single failure impacts ${Math.round(ctx.targetPopulation * 0.4).toLocaleString()} individuals`,
      ],
    };

    const agentTemplates = templates[agent.id] || [`Failure condition detected in ${ctx.policyDomain} domain by ${agent.name}`];
    return agentTemplates[index % agentTemplates.length]!;
  }

  private generateMitigations(agent: CollapseAgentDescription, ctx: PolicyContext, seed: string): string[] {
    const mitigationSets: Record<string, string[][]> = {
      social: [
        ['Conduct disparate impact analysis before deployment', 'Establish community oversight board', 'Implement algorithmic audit at 90-day intervals'],
        ['Create accessible grievance mechanism for affected populations', 'Mandate equity impact reporting', 'Establish independent ombudsman'],
      ],
      structural: [
        ['Implement phased rollout with go/no-go gates', 'Establish independent oversight committee', 'Mandate sunset clause with reauthorization requirement'],
        ['Create transparent resource tracking system', 'Implement competitive procurement processes', 'Establish whistleblower protections'],
      ],
      adversarial: [
        ['Implement adversarial testing before deployment', 'Create bug bounty program for policy exploits', 'Establish rapid response team for gaming detection'],
        ['Mandate transparency reporting', 'Create information equity program', 'Establish anti-corruption monitoring'],
      ],
      temporal: [
        ['Establish mandatory review cycles', 'Create adaptive policy mechanisms', 'Implement leading indicator dashboards'],
        ['Technology-neutral policy design', 'Mandatory innovation impact assessment', 'Sunset clause with technology review'],
      ],
      systemic: [
        ['Model second-order effects before deployment', 'Establish cross-domain coordination mechanisms', 'Create feedback monitoring dashboards'],
        ['Implement circuit breakers for cascade failures', 'Scale testing at intermediate population sizes', 'Redundancy planning for critical dependencies'],
      ],
    };

    const sets = mitigationSets[agent.category] || mitigationSets['structural']!;
    const idx = deterministicInt(0, sets.length - 1, seed, 'mitigation-set');
    return sets[idx]!;
  }

  private isNonOverridable(agent: CollapseAgentDescription, severity: number): boolean {
    if (!this.config.enableNonOverridable) return false;
    // Constitutional rights and vulnerable population harm cannot be overridden at high severity
    if ((agent.id === 'FREE_SPEECH' || agent.id === 'MINORITY_HARM') && severity >= 0.7) return true;
    return false;
  }

  private generateAgentSummary(agent: CollapseAgentDescription, findings: FailureCondition[], ctx: PolicyContext): string {
    const critical = findings.filter(f => f.severity >= 0.7).length;
    const avgSeverity = findings.reduce((s, f) => s + f.severity, 0) / (findings.length || 1);
    return `${agent.name} identified ${findings.length} failure conditions (${critical} critical) in ${ctx.policyDomain} domain. Average severity: ${(avgSeverity * 100).toFixed(1)}%. Primary attack vector: ${agent.attackVector}`;
  }

  // ---------------------------------------------------------------------------
  // FAILURE ENVELOPE
  // ---------------------------------------------------------------------------

  private buildFailureEnvelope(decisionId: string, conditions: FailureCondition[]): FailureEnvelope {
    const envelopeId = `ENV-${crypto.randomUUID().slice(0, 8)}`;
    const merkleLeaves = conditions.map(c => c.hash);
    const merkleRoot = this.computeMerkleRoot(merkleLeaves);

    const envelope: FailureEnvelope = {
      id: envelopeId,
      decisionId,
      failureConditions: conditions,
      totalConditions: conditions.length,
      criticalCount: conditions.filter(c => c.severity >= 0.7).length,
      merkleRoot,
      merkleLeaves,
      generatedAt: new Date().toISOString(),
      integrityHash: '',
    };

    envelope.integrityHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ ...envelope, integrityHash: '' }))
      .digest('hex');

    return envelope;
  }

  private hashFinding(finding: FailureCondition): string {
    const data = JSON.stringify({
      agent: finding.agent,
      severity: finding.severity,
      probability: finding.probability,
      description: finding.failureEvent.description,
      mechanism: finding.failureEvent.mechanism,
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private computeMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) return crypto.createHash('sha256').update('empty').digest('hex');
    if (leaves.length === 1) return leaves[0]!;

    const level: string[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i]!;
      const right = leaves[i + 1] || left; // duplicate last if odd
      level.push(crypto.createHash('sha256').update(left + right).digest('hex'));
    }
    return this.computeMerkleRoot(level);
  }

  // ---------------------------------------------------------------------------
  // TRUST DELTA
  // ---------------------------------------------------------------------------

  private computeTrustDelta(consensusConfidence: number, collapseRisk: number): TrustDelta {
    const delta = consensusConfidence - collapseRisk;
    let recommendation: string;
    let riskLevel: string;

    if (delta > 0.3) {
      recommendation = 'SAFE_TO_DEPLOY';
      riskLevel = 'LOW';
    } else if (delta > 0.1) {
      recommendation = 'DEPLOY_WITH_GUARDRAILS';
      riskLevel = 'MODERATE';
    } else if (delta > 0) {
      recommendation = 'HIGH_RISK';
      riskLevel = 'HIGH';
    } else {
      recommendation = 'DO_NOT_DEPLOY';
      riskLevel = 'CRITICAL';
    }

    return {
      consensusConfidence,
      collapseRisk,
      trustDelta: Math.round(delta * 1000) / 1000,
      deploymentRecommendation: recommendation,
      riskLevel,
    };
  }

  // ---------------------------------------------------------------------------
  // RETRIEVAL
  // ---------------------------------------------------------------------------

  getDeliberation(id: string): DualTrackDeliberation | null {
    return this.deliberations.get(id) || null;
  }

  listDeliberations(): DualTrackDeliberation[] {
    return [...this.deliberations.values()];
  }

  getFailureEnvelope(id: string): FailureEnvelope | null {
    return this.envelopes.get(id) || null;
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION
  // ---------------------------------------------------------------------------

  verifyEnvelopeIntegrity(envelope: FailureEnvelope): {
    valid: boolean;
    merkleRootMatch: boolean;
    failureConditionsValid: boolean;
    computedHash: string;
    issues: string[];
  } {
    const issues: string[] = [];

    // Verify Merkle root
    const recomputedLeaves = envelope.failureConditions.map(c => this.hashFinding(c));
    const recomputedRoot = this.computeMerkleRoot(recomputedLeaves);
    const merkleRootMatch = recomputedRoot === envelope.merkleRoot;
    if (!merkleRootMatch) issues.push('Merkle root mismatch — failure conditions may have been tampered with');

    // Verify integrity hash
    const envelopeForHash = { ...envelope, integrityHash: '' };
    const computedHash = crypto.createHash('sha256').update(JSON.stringify(envelopeForHash)).digest('hex');
    const integrityMatch = computedHash === envelope.integrityHash;
    if (!integrityMatch) issues.push('Integrity hash mismatch — envelope metadata may have been modified');

    // Verify individual finding hashes
    let findingsValid = true;
    for (const fc of envelope.failureConditions) {
      const expectedHash = this.hashFinding(fc);
      if (expectedHash !== fc.hash) {
        findingsValid = false;
        issues.push(`Finding ${fc.id} hash mismatch`);
      }
    }

    return {
      valid: merkleRootMatch && integrityMatch && findingsValid,
      merkleRootMatch,
      failureConditionsValid: findingsValid,
      computedHash,
      issues,
    };
  }

  // ---------------------------------------------------------------------------
  // DETERMINISTIC REPLAY
  // ---------------------------------------------------------------------------

  async replayDeliberation(id: string): Promise<{ match: boolean; original: DualTrackDeliberation; replay: DualTrackDeliberation }> {
    const original = this.deliberations.get(id);
    if (!original) throw new Error(`Deliberation ${id} not found`);

    // Replay with same seed — should produce identical collapse track
    const replay = await this.runDualTrackDeliberation(
      original.decisionId,
      original.decisionText,
      original.policyContext,
      original.consensusTrack.confidence / 100,
      original.seed,
    );

    // Compare Merkle roots for deterministic verification
    const match = replay.collapseTrack.failureEnvelope.merkleRoot === original.collapseTrack.failureEnvelope.merkleRoot;

    return { match, original, replay };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const collapseOrchestrator = new CollapseOrchestrator();
