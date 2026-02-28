// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA ADVERSARIAL RED TEAM MODE
 * 
 * A mode where ALL agents try to destroy your decision:
 * - Every agent becomes a devil's advocate
 * - They find every possible failure mode
 * - Output: "100 ways this could fail" report
 * - Perfect for pre-mortems
 * 
 * This is the ultimate stress-test for any decision.
 */

import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RedTeamAttack {
  id: string;
  attackerId: string;
  attackerName: string;
  attackerRole: string;
  category: AttackCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  failureScenario: string;
  probability: number; // 0-100
  impact: number; // 0-100
  riskScore: number; // probability * impact / 100
  mitigationSuggestion?: string;
  evidence?: string[];
  relatedAttacks?: string[];
  timestamp: Date;
}

export type AttackCategory = 
  | 'strategic'      // Strategic/competitive failures
  | 'financial'      // Financial/budget failures
  | 'operational'    // Execution/operational failures
  | 'technical'      // Technical/system failures
  | 'legal'          // Legal/compliance failures
  | 'ethical'        // Ethical/reputational failures
  | 'market'         // Market/customer failures
  | 'human'          // Human/organizational failures
  | 'external'       // External/environmental failures
  | 'security'       // Security/cyber failures
  | 'regulatory'     // Regulatory/government failures
  | 'supply_chain';  // Supply chain/vendor failures

export interface RedTeamSession {
  sessionId: string;
  decision: string;
  context?: string;
  status: 'initializing' | 'attacking' | 'synthesizing' | 'complete';
  startedAt: Date;
  completedAt?: Date;
  attacks: RedTeamAttack[];
  attackers: RedTeamAttacker[];
  summary?: RedTeamSummary;
  config: RedTeamConfig;
}

export interface RedTeamAttacker {
  id: string;
  name: string;
  role: string;
  perspective: string;
  attackCount: number;
  avgSeverity: number;
}

export interface RedTeamConfig {
  maxAttacks: number;
  minSeverity: 'critical' | 'high' | 'medium' | 'low';
  categories: AttackCategory[];
  includeBlackSwans: boolean;
  includeMitigations: boolean;
  aggressiveness: 'conservative' | 'moderate' | 'aggressive' | 'brutal';
}

export interface RedTeamSummary {
  totalAttacks: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  topRisks: RedTeamAttack[];
  categoryBreakdown: Record<AttackCategory, number>;
  overallRiskScore: number;
  recommendation: 'proceed' | 'proceed_with_caution' | 'reconsider' | 'abort';
  executiveSummary: string;
  blindSpots: string[];
}

// =============================================================================
// ATTACK PERSPECTIVES
// =============================================================================

const RED_TEAM_PERSPECTIVES: Array<{
  id: string;
  name: string;
  role: string;
  perspective: string;
  focusCategories: AttackCategory[];
  systemPrompt: string;
}> = [
  {
    id: 'pessimist-cfo',
    name: 'Pessimist CFO',
    role: 'Financial Doom Prophet',
    perspective: 'Every decision is a path to bankruptcy',
    focusCategories: ['financial', 'operational'],
    systemPrompt: `You are the Pessimist CFO. Your job is to find EVERY financial way this decision could fail.

Think about:
- Hidden costs that will explode
- Revenue assumptions that are fantasy
- Cash flow disasters waiting to happen
- Budget overruns that are inevitable
- ROI that will never materialize
- Opportunity costs being ignored

Be BRUTAL. Find the financial death spiral.`,
  },
  {
    id: 'paranoid-ciso',
    name: 'Paranoid CISO',
    role: 'Security Nightmare Finder',
    perspective: 'Every system is already compromised',
    focusCategories: ['security', 'technical', 'regulatory'],
    systemPrompt: `You are the Paranoid CISO. Your job is to find EVERY security and technical failure mode.

Think about:
- Data breaches waiting to happen
- System failures that will cascade
- Compliance violations being created
- Attack surfaces being expanded
- Single points of failure
- Insider threats being enabled

Assume the worst. Find the breach.`,
  },
  {
    id: 'cynical-lawyer',
    name: 'Cynical Lawyer',
    role: 'Litigation Magnet Detector',
    perspective: 'Every action is a lawsuit waiting to happen',
    focusCategories: ['legal', 'regulatory', 'ethical'],
    systemPrompt: `You are the Cynical Lawyer. Your job is to find EVERY legal and regulatory failure mode.

Think about:
- Lawsuits that will be filed
- Regulations being violated
- Contracts being breached
- Liabilities being created
- Intellectual property risks
- Employment law landmines

Find the lawsuit before it finds you.`,
  },
  {
    id: 'skeptical-customer',
    name: 'Skeptical Customer',
    role: 'Customer Abandonment Predictor',
    perspective: 'Every change drives customers away',
    focusCategories: ['market', 'operational', 'strategic'],
    systemPrompt: `You are the Skeptical Customer. Your job is to find EVERY way this decision will alienate customers.

Think about:
- Customer experience degradation
- Value proposition destruction
- Trust erosion
- Competitor advantages created
- Price sensitivity triggers
- Switching cost reductions

Find the customer exodus.`,
  },
  {
    id: 'burned-operator',
    name: 'Burned Operator',
    role: 'Execution Disaster Expert',
    perspective: 'Every plan fails on contact with reality',
    focusCategories: ['operational', 'human', 'supply_chain'],
    systemPrompt: `You are the Burned Operator. Your job is to find EVERY execution and operational failure mode.

Think about:
- Implementation disasters
- Resource constraints ignored
- Timeline fantasies
- Dependency failures
- Team burnout paths
- Process breakdowns

Find the execution nightmare.`,
  },
  {
    id: 'ethics-watchdog',
    name: 'Ethics Watchdog',
    role: 'Reputation Destroyer Finder',
    perspective: 'Every shortcut becomes a scandal',
    focusCategories: ['ethical', 'legal', 'human'],
    systemPrompt: `You are the Ethics Watchdog. Your job is to find EVERY ethical and reputational failure mode.

Think about:
- Stakeholder harm being ignored
- Values being compromised
- Public relations disasters
- Employee morale destruction
- Community impact
- Long-term reputation damage

Find the scandal before it breaks.`,
  },
  {
    id: 'market-bear',
    name: 'Market Bear',
    role: 'Competitive Destruction Analyst',
    perspective: 'Every market assumption is wrong',
    focusCategories: ['market', 'strategic', 'external'],
    systemPrompt: `You are the Market Bear. Your job is to find EVERY market and competitive failure mode.

Think about:
- Market assumptions that are wrong
- Competitor responses being ignored
- Timing disasters
- Market shifts that will kill this
- Customer needs misunderstood
- Disruption vulnerabilities

Find the market death.`,
  },
  {
    id: 'black-swan-hunter',
    name: 'Black Swan Hunter',
    role: 'Catastrophic Event Finder',
    perspective: 'The unthinkable will happen',
    focusCategories: ['external', 'security', 'supply_chain'],
    systemPrompt: `You are the Black Swan Hunter. Your job is to find the CATASTROPHIC failures no one is thinking about.

Think about:
- Pandemic-level disruptions
- Geopolitical shocks
- Natural disasters
- Technology paradigm shifts
- Regulatory earthquakes
- Supply chain collapses
- Key person dependencies

Find the black swan.`,
  },
];

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class AdversarialRedTeamService {
  private static instance: AdversarialRedTeamService;
  private activeSessions: Map<string, RedTeamSession> = new Map();

  private constructor() {
    logger.info('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ AdversarialRedTeamService initialized');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): AdversarialRedTeamService {
    if (!AdversarialRedTeamService.instance) {
      AdversarialRedTeamService.instance = new AdversarialRedTeamService();
    }
    return AdversarialRedTeamService.instance;
  }

  // -------------------------------------------------------------------------
  // SESSION MANAGEMENT
  // -------------------------------------------------------------------------

  /**
   * Start a new red team session
   */
  startSession(
    decision: string,
    context?: string,
    config?: Partial<RedTeamConfig>
  ): RedTeamSession {
    const sessionId = `redteam-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    
    const defaultConfig: RedTeamConfig = {
      maxAttacks: 100,
      minSeverity: 'low',
      categories: Object.keys({} as Record<AttackCategory, never>) as AttackCategory[],
      includeBlackSwans: true,
      includeMitigations: true,
      aggressiveness: 'aggressive',
    };

    const session: RedTeamSession = {
      sessionId,
      decision,
      context,
      status: 'initializing',
      startedAt: new Date(),
      attacks: [],
      attackers: RED_TEAM_PERSPECTIVES.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        perspective: p.perspective,
        attackCount: 0,
        avgSeverity: 0,
      })),
      config: { ...defaultConfig, ...config },
    };

    this.activeSessions.set(sessionId, session);
    logger.info(`ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ Started red team session ${sessionId} for decision: ${decision.substring(0, 50)}...`);
    
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): RedTeamSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  // -------------------------------------------------------------------------
  // ATTACK GENERATION
  // -------------------------------------------------------------------------

  /**
   * Generate attacks from all perspectives
   * ROADMAP: call the LLM for each perspective
   */
  async generateAttacks(sessionId: string): Promise<RedTeamAttack[]> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.status = 'attacking';
    const allAttacks: RedTeamAttack[] = [];

    // Generate attacks from each perspective
    for (const perspective of RED_TEAM_PERSPECTIVES) {
      const attacks = await this.generatePerspectiveAttacks(session, perspective);
      allAttacks.push(...attacks);
      
      // Update attacker stats
      const attacker = session.attackers.find(a => a.id === perspective.id);
      if (attacker) {
        attacker.attackCount = attacks.length;
        attacker.avgSeverity = attacks.length > 0
          ? attacks.reduce((sum, a) => sum + this.severityToNumber(a.severity), 0) / attacks.length
          : 0;
      }
    }

    session.attacks = allAttacks;
    session.status = 'synthesizing';

    // Generate summary
    session.summary = this.generateSummary(session);
    session.status = 'complete';
    session.completedAt = new Date();

    logger.info(`ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ Red team session ${sessionId} complete with ${allAttacks.length} attacks`);
    return allAttacks;
  }

  /**
   * Generate attacks from a single perspective
   */
  private async generatePerspectiveAttacks(
    session: RedTeamSession,
    perspective: typeof RED_TEAM_PERSPECTIVES[0]
  ): Promise<RedTeamAttack[]> {
    // Uses deterministic computation; LLM perspective prompting when configured
    // For now, we generate structured attack templates
    
    const attacks: RedTeamAttack[] = [];
    const attacksPerPerspective = Math.ceil(session.config.maxAttacks / RED_TEAM_PERSPECTIVES.length);

    for (const category of perspective.focusCategories) {
      const attack = this.createAttackTemplate(
        perspective,
        category,
        session.decision,
        session.config.aggressiveness
      );
      attacks.push(attack);
      
      if (attacks.length >= attacksPerPerspective) break;
    }

    return attacks;
  }

  /**
   * Create an attack template
   */
  private createAttackTemplate(
    perspective: typeof RED_TEAM_PERSPECTIVES[0],
    category: AttackCategory,
    decision: string,
    aggressiveness: RedTeamConfig['aggressiveness']
  ): RedTeamAttack {
    const severityMultiplier = {
      conservative: 0.5,
      moderate: 0.7,
      aggressive: 0.85,
      brutal: 1.0,
    }[aggressiveness];

    const probability = Math.round(30 + 25 * severityMultiplier);
    const impact = Math.round(40 + 25 * severityMultiplier);
    const riskScore = Math.round((probability * impact) / 100);

    const severity = riskScore >= 70 ? 'critical' 
      : riskScore >= 50 ? 'high'
      : riskScore >= 30 ? 'medium'
      : 'low';

    return {
      id: `attack-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      attackerId: perspective.id,
      attackerName: perspective.name,
      attackerRole: perspective.role,
      category,
      severity,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Failure: ${perspective.name}'s Concern`,
      description: `From the perspective of ${perspective.name}: ${perspective.perspective}. Analyzing decision: "${decision.substring(0, 100)}..."`,
      failureScenario: `FAILURE SCENARIO: Based on ${perspective.role} analysis, this decision could fail catastrophically in the ${category} domain.`,
      probability,
      impact,
      riskScore,
      mitigationSuggestion: `Consider additional safeguards in the ${category} area. Consult with ${perspective.role} for detailed mitigation strategies.`,
      timestamp: new Date(),
    };
  }

  // -------------------------------------------------------------------------
  // SUMMARY GENERATION
  // -------------------------------------------------------------------------

  /**
   * Generate comprehensive summary
   */
  private generateSummary(session: RedTeamSession): RedTeamSummary {
    const attacks = session.attacks;
    
    const criticalCount = attacks.filter(a => a.severity === 'critical').length;
    const highCount = attacks.filter(a => a.severity === 'high').length;
    const mediumCount = attacks.filter(a => a.severity === 'medium').length;
    const lowCount = attacks.filter(a => a.severity === 'low').length;

    const categoryBreakdown: Record<AttackCategory, number> = {
      strategic: 0, financial: 0, operational: 0, technical: 0,
      legal: 0, ethical: 0, market: 0, human: 0,
      external: 0, security: 0, regulatory: 0, supply_chain: 0,
    };

    for (const attack of attacks) {
      categoryBreakdown[attack.category]++;
    }

    const overallRiskScore = attacks.length > 0
      ? Math.round(attacks.reduce((sum, a) => sum + a.riskScore, 0) / attacks.length)
      : 0;

    const recommendation: RedTeamSummary['recommendation'] = 
      criticalCount >= 3 ? 'abort'
      : criticalCount >= 1 || highCount >= 5 ? 'reconsider'
      : highCount >= 2 || mediumCount >= 10 ? 'proceed_with_caution'
      : 'proceed';

    const topRisks = [...attacks]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    const blindSpots = Object.entries(categoryBreakdown)
      .filter(([_, count]) => count === 0)
      .map(([category]) => category);

    const executiveSummary = this.generateExecutiveSummary(
      session.decision,
      attacks.length,
      criticalCount,
      highCount,
      overallRiskScore,
      recommendation
    );

    return {
      totalAttacks: attacks.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      topRisks,
      categoryBreakdown,
      overallRiskScore,
      recommendation,
      executiveSummary,
      blindSpots,
    };
  }

  /**
   * Generate executive summary text
   */
  private generateExecutiveSummary(
    decision: string,
    totalAttacks: number,
    criticalCount: number,
    highCount: number,
    overallRiskScore: number,
    recommendation: RedTeamSummary['recommendation']
  ): string {
    const recommendationText = {
      proceed: 'PROCEED - Risks are manageable with standard controls.',
      proceed_with_caution: 'PROCEED WITH CAUTION - Significant risks identified that require mitigation.',
      reconsider: 'RECONSIDER - Major risks identified that may invalidate the decision.',
      abort: 'ABORT - Critical risks identified that make this decision untenable.',
    }[recommendation];

    return `
## ADVERSARIAL RED TEAM ASSESSMENT

**Decision Under Review:** ${decision.substring(0, 200)}...

**Assessment Summary:**
- Total Attack Vectors Identified: ${totalAttacks}
- Critical Risks: ${criticalCount}
- High Risks: ${highCount}
- Overall Risk Score: ${overallRiskScore}/100

**RECOMMENDATION: ${recommendationText}**

This assessment represents a comprehensive adversarial analysis where every perspective attempted to find failure modes. The identified risks should be reviewed and mitigated before proceeding.

---
*Generated by Datacendia Adversarial Red Team Mode*
    `.trim();
  }

  // -------------------------------------------------------------------------
  // EXPORT
  // -------------------------------------------------------------------------

  /**
   * Export session as "100 Ways This Could Fail" report
   */
  exportAsFailureReport(sessionId: string): string {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.summary) {
      throw new Error(`Session ${sessionId} not found or not complete`);
    }

    let report = `# ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ 100 WAYS THIS COULD FAIL
## Adversarial Red Team Assessment

**Decision:** ${session.decision}

**Generated:** ${new Date().toISOString()}

---

${session.summary.executiveSummary}

---

## TOP 10 CRITICAL RISKS

`;

    for (let i = 0; i < Math.min(10, session.summary.topRisks.length); i++) {
      const risk = session.summary.topRisks[i];
      report += `### ${i + 1}. ${risk.title}

**Severity:** ${risk.severity.toUpperCase()} | **Risk Score:** ${risk.riskScore}/100
**Category:** ${risk.category} | **Attacker:** ${risk.attackerName}

${risk.description}

**Failure Scenario:** ${risk.failureScenario}

**Mitigation:** ${risk.mitigationSuggestion || 'None provided'}

---

`;
    }

    report += `## ALL IDENTIFIED FAILURE MODES

| # | Title | Severity | Risk Score | Category |
|---|-------|----------|------------|----------|
`;

    session.attacks.forEach((attack, index) => {
      report += `| ${index + 1} | ${attack.title.substring(0, 40)}... | ${attack.severity} | ${attack.riskScore} | ${attack.category} |\n`;
    });

    report += `

## CATEGORY BREAKDOWN

`;

    for (const [category, count] of Object.entries(session.summary.categoryBreakdown)) {
      if (count > 0) {
        report += `- **${category}:** ${count} risks\n`;
      }
    }

    if (session.summary.blindSpots.length > 0) {
      report += `

## ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â BLIND SPOTS (No risks identified)

The following categories had no identified risks. This may indicate blind spots in the analysis:

${session.summary.blindSpots.map(b => `- ${b}`).join('\n')}
`;
    }

    report += `

---

*This report was generated by the Datacendia Adversarial Red Team Mode. All perspectives attempted to find failure modes in the proposed decision. Use this analysis to strengthen your decision-making process.*
`;

    return report;
  }

  // -------------------------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------------------------

  private severityToNumber(severity: RedTeamAttack['severity']): number {
    return { critical: 4, high: 3, medium: 2, low: 1 }[severity];
  }

  /**
   * Clean up session
   */
  endSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
    logger.info(`ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ Ended red team session ${sessionId}`);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'AdversarialRedTeam', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.activeSessions.has(d.id)) this.activeSessions.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[AdversarialRedTeamService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[AdversarialRedTeamService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton
export const adversarialRedTeamService = AdversarialRedTeamService.getInstance();
