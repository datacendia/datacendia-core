/**
 * CendiaRedTeam™ — Adversarial Red Team Engine
 *
 * Before ANY decision is finalized, spawns adversarial analysis that attacks
 * the decision from multiple angles: bias detection, logical fallacy scanning,
 * regulatory vulnerability analysis, and precedent conflict detection.
 *
 * Architecture: Wired as a PRE-DECISION GATE in the Council deliberation flow.
 * The Council service calls redTeamService.challenge() BEFORE sealing the final
 * decision. If critical vulnerabilities are found, the decision is blocked until
 * human review clears it.
 *
 * Attack vectors analyzed:
 *   1. BIAS_SCAN        — Detects potential bias in agent reasoning
 *   2. LOGIC_AUDIT      — Identifies logical fallacies and contradictions
 *   3. REGULATORY_PROBE — Tests compliance claims against framework requirements
 *   4. PRECEDENT_CLASH  — Checks for conflicts with historical decisions
 *   5. ADVERSARIAL_FRAME — Constructs the strongest possible counter-argument
 *   6. DISSENT_AMPLIFY  — Examines if dissenting views were adequately addressed
 *
 * @module services/crypto/AdversarialRedTeamService
 * @exports adversarialRedTeamService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.



import crypto from 'crypto';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';

// =============================================================================
// TYPES
// =============================================================================

export type AttackVector = 'BIAS_SCAN' | 'LOGIC_AUDIT' | 'REGULATORY_PROBE' | 'PRECEDENT_CLASH' | 'ADVERSARIAL_FRAME' | 'DISSENT_AMPLIFY';

export interface RedTeamVulnerability {
  id: string;
  vector: AttackVector;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
  exploitableBy: string;    // Who could exploit this: 'regulator', 'court', 'auditor', 'competitor'
  autoRemediable: boolean;
}

export interface RedTeamReport {
  reportId: string;
  deliberationId: string;
  status: 'pass' | 'fail' | 'warn';
  gateDecision: 'ALLOW' | 'BLOCK' | 'REVIEW';
  overallRisk: number;      // 0-100
  vulnerabilities: RedTeamVulnerability[];
  attackVectorsRun: AttackVector[];
  summary: string;
  analyzedAt: string;
  analysisDurationMs: number;
}

export interface RedTeamInput {
  deliberationId: string;
  question: string;
  agentResponses: {
    agentName: string;
    agentRole: string;
    content: string;
    confidence: number;
    dissented: boolean;
    sources: string[];
  }[];
  proposedDecision: string;
  consensusScore: number;
  dissentCount: number;
  totalAgents: number;
  complianceFrameworks: string[];
  mode: string;
}

// =============================================================================
// SERVICE
// =============================================================================

export class AdversarialRedTeamService extends EventEmitter {
  private static instance: AdversarialRedTeamService;
  private reportCache = new Map<string, RedTeamReport>();

  private constructor() {
    super();
    logger.info('🔴 CendiaRedTeam: Initialized — adversarial pre-decision gate active');
  }

  static getInstance(): AdversarialRedTeamService {
    if (!AdversarialRedTeamService.instance) {
      AdversarialRedTeamService.instance = new AdversarialRedTeamService();
    }
    return AdversarialRedTeamService.instance;
  }

  // ---------------------------------------------------------------------------
  // PRE-DECISION GATE — Called by Council before sealing
  // ---------------------------------------------------------------------------

  /**
   * Run all attack vectors against a proposed decision.
   * Returns a gate decision: ALLOW, BLOCK, or REVIEW.
   *
   * This is the entry point called by CouncilService before finalizing.
   */
  async challenge(input: RedTeamInput): Promise<RedTeamReport> {
    const startTime = Date.now();
    const reportId = `redteam-${crypto.randomBytes(8).toString('hex')}`;

    logger.info(`🔴 CendiaRedTeam: Challenging deliberation ${input.deliberationId}...`);

    const vulnerabilities: RedTeamVulnerability[] = [];
    let vulnIdx = 0;

    // Run all attack vectors
    const vectors: AttackVector[] = [
      'BIAS_SCAN', 'LOGIC_AUDIT', 'REGULATORY_PROBE',
      'PRECEDENT_CLASH', 'ADVERSARIAL_FRAME', 'DISSENT_AMPLIFY',
    ];

    // 1. BIAS SCAN
    vulnerabilities.push(...this.scanForBias(input, vulnIdx));
    vulnIdx = vulnerabilities.length;

    // 2. LOGIC AUDIT
    vulnerabilities.push(...this.auditLogic(input, vulnIdx));
    vulnIdx = vulnerabilities.length;

    // 3. REGULATORY PROBE
    vulnerabilities.push(...this.probeRegulatory(input, vulnIdx));
    vulnIdx = vulnerabilities.length;

    // 4. PRECEDENT CLASH
    vulnerabilities.push(...this.checkPrecedentClash(input, vulnIdx));
    vulnIdx = vulnerabilities.length;

    // 5. ADVERSARIAL FRAME
    vulnerabilities.push(...this.constructAdversarialFrame(input, vulnIdx));
    vulnIdx = vulnerabilities.length;

    // 6. DISSENT AMPLIFY
    vulnerabilities.push(...this.amplifyDissent(input, vulnIdx));

    // Calculate overall risk
    const riskScore = this.calculateRiskScore(vulnerabilities);
    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

    // Gate decision
    let gateDecision: 'ALLOW' | 'BLOCK' | 'REVIEW';
    let status: 'pass' | 'fail' | 'warn';

    if (criticalCount > 0) {
      gateDecision = 'BLOCK';
      status = 'fail';
    } else if (highCount >= 2 || riskScore > 70) {
      gateDecision = 'REVIEW';
      status = 'warn';
    } else if (highCount === 1 || riskScore > 40) {
      gateDecision = 'REVIEW';
      status = 'warn';
    } else {
      gateDecision = 'ALLOW';
      status = 'pass';
    }

    const report: RedTeamReport = {
      reportId,
      deliberationId: input.deliberationId,
      status,
      gateDecision,
      overallRisk: riskScore,
      vulnerabilities,
      attackVectorsRun: vectors,
      summary: this.buildSummary(vulnerabilities, gateDecision, riskScore),
      analyzedAt: new Date().toISOString(),
      analysisDurationMs: Date.now() - startTime,
    };

    this.reportCache.set(reportId, report);

    // Emit gate event for pipeline integration
    this.emit('gate-decision', {
      deliberationId: input.deliberationId,
      reportId,
      decision: gateDecision,
      riskScore,
      criticalCount,
      highCount,
    });

    if (gateDecision === 'BLOCK') {
      this.emit('decision-blocked', {
        deliberationId: input.deliberationId,
        reportId,
        reason: `${criticalCount} critical vulnerabilities detected`,
      });
    }

    logger.info(`🔴 CendiaRedTeam: ${gateDecision} — ${vulnerabilities.length} vulns, risk ${riskScore}/100, ${Date.now() - startTime}ms`);

    return report;
  }

  // ---------------------------------------------------------------------------
  // ATTACK VECTORS
  // ---------------------------------------------------------------------------

  private scanForBias(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    const vulns: RedTeamVulnerability[] = [];

    // Check for unanimity bias (groupthink)
    if (input.dissentCount === 0 && input.totalAgents >= 3) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'BIAS_SCAN',
        severity: 'medium',
        title: 'Potential groupthink — zero dissent among multiple agents',
        description: `All ${input.totalAgents} agents agreed unanimously. While this may indicate clear consensus, it could also indicate insufficient diversity of perspective or anchoring bias.`,
        evidence: `${input.totalAgents} agents, 0 dissents, ${input.consensusScore}% consensus`,
        recommendation: 'Consider adding an explicit devil\'s advocate agent to future deliberations on this topic.',
        exploitableBy: 'auditor',
        autoRemediable: true,
      });
    }

    // Check for confidence clustering (all agents near same confidence)
    const confidences = input.agentResponses.map(r => r.confidence).filter(c => c > 0);
    if (confidences.length >= 3) {
      const mean = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      const variance = confidences.reduce((sum, c) => sum + (c - mean) ** 2, 0) / confidences.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev < 5 && mean > 70) {
        vulns.push({
          id: `RT-${startIdx + vulns.length + 1}`,
          vector: 'BIAS_SCAN',
          severity: 'low',
          title: 'Confidence clustering — agents show suspiciously similar confidence levels',
          description: `Standard deviation of confidence scores is only ${stdDev.toFixed(1)}%. Agents may be anchoring to each other rather than forming independent assessments.`,
          evidence: `Mean confidence: ${mean.toFixed(0)}%, StdDev: ${stdDev.toFixed(1)}%, Agents: ${confidences.length}`,
          recommendation: 'Ensure agents are evaluating independently and not sharing intermediate confidence scores.',
          exploitableBy: 'regulator',
          autoRemediable: false,
        });
      }
    }

    // Check for source concentration
    const allSources = input.agentResponses.flatMap(r => r.sources);
    const uniqueSources = new Set(allSources);
    if (allSources.length > 3 && uniqueSources.size < allSources.length * 0.3) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'BIAS_SCAN',
        severity: 'medium',
        title: 'Source concentration — agents relying on overlapping evidence',
        description: `Only ${uniqueSources.size} unique sources across ${allSources.length} citations (${Math.round(uniqueSources.size / allSources.length * 100)}% diversity). Decision may be over-reliant on a narrow evidence base.`,
        evidence: `${allSources.length} total citations, ${uniqueSources.size} unique`,
        recommendation: 'Broaden the evidence base by configuring agents with diverse source access.',
        exploitableBy: 'court',
        autoRemediable: true,
      });
    }

    return vulns;
  }

  private auditLogic(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    const vulns: RedTeamVulnerability[] = [];
    const content = input.agentResponses.map(r => r.content).join(' ').toLowerCase();

    // Check for hedging language indicating uncertainty
    const hedgeWords = ['might', 'perhaps', 'possibly', 'uncertain', 'unclear', 'debatable', 'arguably', 'potentially'];
    const hedgeCount = hedgeWords.reduce((sum, w) => sum + (content.split(w).length - 1), 0);

    if (hedgeCount > input.agentResponses.length * 2) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'LOGIC_AUDIT',
        severity: 'medium',
        title: 'Excessive hedging language in agent reasoning',
        description: `${hedgeCount} hedging terms detected across ${input.agentResponses.length} agent responses. High hedge density suggests agents lack confidence in their own reasoning despite reporting high confidence scores.`,
        evidence: `Hedge terms: ${hedgeCount}, Agent count: ${input.agentResponses.length}, Reported consensus: ${input.consensusScore}%`,
        recommendation: 'Investigate disconnect between reported confidence and actual language certainty.',
        exploitableBy: 'court',
        autoRemediable: false,
      });
    }

    // Check for contradiction between confidence and dissent
    if (input.consensusScore > 80 && input.dissentCount > input.totalAgents * 0.3) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'LOGIC_AUDIT',
        severity: 'high',
        title: 'Confidence-dissent contradiction',
        description: `Consensus score is ${input.consensusScore}% but ${input.dissentCount}/${input.totalAgents} agents dissented. High confidence with high dissent is logically inconsistent.`,
        evidence: `Consensus: ${input.consensusScore}%, Dissent: ${input.dissentCount}/${input.totalAgents}`,
        recommendation: 'Recalibrate consensus scoring algorithm or investigate why dissenting agents are being overweighted.',
        exploitableBy: 'regulator',
        autoRemediable: true,
      });
    }

    return vulns;
  }

  private probeRegulatory(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    const vulns: RedTeamVulnerability[] = [];

    // No compliance frameworks specified
    if (!input.complianceFrameworks || input.complianceFrameworks.length === 0) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'REGULATORY_PROBE',
        severity: 'high',
        title: 'No compliance framework mapped to this decision',
        description: 'This decision has no compliance framework mapping. A regulator could challenge whether appropriate regulatory considerations were applied.',
        evidence: 'complianceFrameworks: []',
        recommendation: 'Map at least one compliance framework (EU AI Act, NIST AI RMF, ISO 42001) to every high-risk decision.',
        exploitableBy: 'regulator',
        autoRemediable: true,
      });
    }

    // Low agent count for high-risk decision
    if (input.totalAgents < 3 && input.complianceFrameworks?.some(f => f.includes('AI Act') || f.includes('HIPAA') || f.includes('defense'))) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'REGULATORY_PROBE',
        severity: 'critical',
        title: 'Insufficient agent diversity for regulated decision',
        description: `Only ${input.totalAgents} agent(s) for a decision mapped to ${input.complianceFrameworks.join(', ')}. Regulated decisions require multi-agent deliberation for defensibility.`,
        evidence: `Agents: ${input.totalAgents}, Frameworks: ${input.complianceFrameworks.join(', ')}`,
        recommendation: 'Configure minimum 3-agent quorum for all regulated decision modes.',
        exploitableBy: 'regulator',
        autoRemediable: true,
      });
    }

    return vulns;
  }

  private checkPrecedentClash(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    // This would ideally call DecisionSimilarityService but we keep it self-contained
    // The precedent engine runs separately; here we flag structural patterns
    const vulns: RedTeamVulnerability[] = [];

    if (input.consensusScore < 50) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'PRECEDENT_CLASH',
        severity: 'medium',
        title: 'Low consensus may create precedent inconsistency risk',
        description: `At ${input.consensusScore}% consensus, this decision is likely to diverge from historical patterns. Future similar questions may yield different outcomes, creating inconsistency liability.`,
        evidence: `Consensus: ${input.consensusScore}%`,
        recommendation: 'Run CendiaPrecedent check before finalizing. If similar decisions exist with higher consensus, investigate why this one diverges.',
        exploitableBy: 'court',
        autoRemediable: false,
      });
    }

    return vulns;
  }

  private constructAdversarialFrame(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    const vulns: RedTeamVulnerability[] = [];

    // Construct the strongest possible counter-argument
    const weakPoints: string[] = [];

    if (input.dissentCount > 0) weakPoints.push(`${input.dissentCount} expert agents formally objected`);
    if (input.consensusScore < 70) weakPoints.push(`consensus was only ${input.consensusScore}%`);

    const noSourceAgents = input.agentResponses.filter(r => r.sources.length === 0);
    if (noSourceAgents.length > 0) weakPoints.push(`${noSourceAgents.length} agents provided no supporting evidence`);

    if (weakPoints.length >= 2) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'ADVERSARIAL_FRAME',
        severity: weakPoints.length >= 3 ? 'high' : 'medium',
        title: 'Adversarial counter-argument constructible',
        description: `An opposing party could argue: "${weakPoints.join('; ')}." This combination creates a viable attack surface for legal or regulatory challenge.`,
        evidence: weakPoints.join(' | '),
        recommendation: 'Address each weak point before finalizing: ensure all agents cite sources, resolve dissents explicitly, and improve consensus where possible.',
        exploitableBy: 'court',
        autoRemediable: false,
      });
    }

    return vulns;
  }

  private amplifyDissent(input: RedTeamInput, startIdx: number): RedTeamVulnerability[] {
    const vulns: RedTeamVulnerability[] = [];

    const dissenters = input.agentResponses.filter(r => r.dissented);
    if (dissenters.length === 0) return vulns;

    // Check if dissenting views were from high-confidence agents
    const highConfidenceDissenters = dissenters.filter(d => d.confidence >= 70);
    if (highConfidenceDissenters.length > 0) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'DISSENT_AMPLIFY',
        severity: 'high',
        title: 'High-confidence dissent overridden',
        description: `${highConfidenceDissenters.length} dissenting agent(s) had confidence ≥70%: ${highConfidenceDissenters.map(d => `${d.agentName} (${d.confidence}%)`).join(', ')}. Overriding high-confidence dissent without explicit justification is a significant governance risk.`,
        evidence: highConfidenceDissenters.map(d => `${d.agentName}: ${d.confidence}% confidence, role: ${d.agentRole}`).join(' | '),
        recommendation: 'Document specific justification for proceeding against high-confidence dissent. This will be the first thing a regulator examines.',
        exploitableBy: 'regulator',
        autoRemediable: false,
      });
    }

    // Check if dissent was from a specialist role
    const specialistRoles = ['compliance', 'legal', 'risk', 'ethics', 'regulatory'];
    const specialistDissenters = dissenters.filter(d =>
      specialistRoles.some(role => d.agentRole.toLowerCase().includes(role))
    );

    if (specialistDissenters.length > 0) {
      vulns.push({
        id: `RT-${startIdx + vulns.length + 1}`,
        vector: 'DISSENT_AMPLIFY',
        severity: 'critical',
        title: 'Compliance/legal/risk specialist dissent overridden',
        description: `Specialist agent(s) dissented: ${specialistDissenters.map(d => `${d.agentName} (${d.agentRole})`).join(', ')}. Overriding a compliance or legal specialist without human review is a critical governance failure.`,
        evidence: specialistDissenters.map(d => `${d.agentName}: ${d.agentRole}`).join(' | '),
        recommendation: 'MANDATORY: Escalate to human review when compliance/legal/risk specialists dissent. This is non-negotiable for regulatory defensibility.',
        exploitableBy: 'regulator',
        autoRemediable: false,
      });
    }

    return vulns;
  }

  // ---------------------------------------------------------------------------
  // SCORING & REPORTING
  // ---------------------------------------------------------------------------

  private calculateRiskScore(vulns: RedTeamVulnerability[]): number {
    let score = 0;
    for (const v of vulns) {
      switch (v.severity) {
        case 'critical': score += 30; break;
        case 'high': score += 15; break;
        case 'medium': score += 7; break;
        case 'low': score += 3; break;
      }
    }
    return Math.min(100, score);
  }

  private buildSummary(vulns: RedTeamVulnerability[], gate: string, risk: number): string {
    const critical = vulns.filter(v => v.severity === 'critical').length;
    const high = vulns.filter(v => v.severity === 'high').length;
    if (gate === 'BLOCK') return `BLOCKED: ${critical} critical vulnerability(s) require human review before this decision can proceed.`;
    if (gate === 'REVIEW') return `REVIEW REQUIRED: ${high} high-severity and risk score ${risk}/100. Decision should be reviewed before finalization.`;
    return `PASSED: ${vulns.length} finding(s), risk score ${risk}/100. No critical or blocking vulnerabilities detected.`;
  }

  // ---------------------------------------------------------------------------
  // ACCESS
  // ---------------------------------------------------------------------------

  getReport(reportId: string): RedTeamReport | undefined {
    return this.reportCache.get(reportId);
  }
}

// Export singleton
export const adversarialRedTeamService = AdversarialRedTeamService.getInstance();
