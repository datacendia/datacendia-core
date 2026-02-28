// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Datacendia-for-Datacendia Internal Dogfooding Service
 * 
 * "When an investor asks 'Do you use this yourself?'
 * Your answer becomes lethal."
 * 
 * Internal Setup:
 * - Every roadmap decision logged
 * - Investor outreach deliberated by Council
 * - GTM strategy debated by Dissent agents
 * - Marketing copy audited for claims risk
 * - Fundraising decisions time-locked
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  BaseDecision,
  DecisionSchema,
  ValidationResult,
  DefensibleArtifact
} from '../core/VerticalPattern.js';

// ============================================================================
// INTERNAL DECISION TYPES
// ============================================================================

export interface RoadmapDecision extends BaseDecision {
  type: 'roadmap';
  inputs: {
    featureId: string;
    featureName: string;
    priority: 'p0' | 'p1' | 'p2' | 'p3';
    requestedBy: string;
    businessCase: string;
    estimatedEffort: string;
    dependencies: string[];
    verticalImpact: string[];
  };
  outcome: {
    approved: boolean;
    targetRelease: string;
    assignedTeam: string;
    conditions?: string[];
    deferReason?: string;
  };
}

export interface InvestorOutreachDecision extends BaseDecision {
  type: 'investor-outreach';
  inputs: {
    investorName: string;
    firmName: string;
    stage: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';
    verticalFocus: string[];
    checkSize: { min: number; max: number };
    introSource: string;
    previousInteractions: { date: Date; notes: string }[];
  };
  outcome: {
    proceed: boolean;
    outreachStrategy: string;
    keyMessages: string[];
    risksIdentified: string[];
    nextSteps: string[];
    ownerAssigned: string;
  };
}

export interface GTMStrategyDecision extends BaseDecision {
  type: 'gtm-strategy';
  inputs: {
    strategyId: string;
    vertical: string;
    targetSegment: string;
    proposedApproach: string;
    competitorAnalysis: string;
    pricingModel: string;
    channelStrategy: string;
  };
  outcome: {
    approved: boolean;
    pilotMarket?: string;
    launchDate?: string;
    successMetrics: string[];
    riskMitigations: string[];
    dissentsAddressed: string[];
  };
}

export interface MarketingClaimAudit extends BaseDecision {
  type: 'marketing-claim';
  inputs: {
    claimId: string;
    claimText: string;
    context: 'website' | 'deck' | 'email' | 'social' | 'press-release';
    targetAudience: string;
    supportingEvidence: string[];
  };
  outcome: {
    approved: boolean;
    riskLevel: 'safe' | 'caution' | 'high-risk' | 'rejected';
    modifications?: string[];
    requiredDisclaimers?: string[];
    legalReview: boolean;
    auditNotes: string;
  };
}

export interface FundraisingDecision extends BaseDecision {
  type: 'fundraising';
  inputs: {
    roundType: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge';
    targetAmount: number;
    preMoneyValuation: number;
    leadInvestor?: string;
    termSheetReceived: boolean;
    keyTerms: Record<string, string>;
  };
  outcome: {
    proceed: boolean;
    negotiationStrategy: string;
    redLines: string[];
    counterTerms?: Record<string, string>;
    timeLockUntil?: Date; // Embargoed until this date
    boardApprovalRequired: boolean;
  };
}

export type InternalDecision = 
  | RoadmapDecision 
  | InvestorOutreachDecision 
  | GTMStrategyDecision 
  | MarketingClaimAudit 
  | FundraisingDecision;

// ============================================================================
// MARKETING CLAIM RISK DETECTOR
// ============================================================================

export class MarketingClaimRiskDetector {
  private riskyPatterns = [
    { pattern: /\b(guaranteed|100%|always|never fails)\b/i, risk: 'absolute-claim', severity: 'high-risk' as const },
    { pattern: /\b(best|#1|leading|top|only)\b/i, risk: 'superlative', severity: 'caution' as const },
    { pattern: /\b(ai|artificial intelligence|machine learning)\b/i, risk: 'ai-claim', severity: 'caution' as const },
    { pattern: /\b(compliant|certified|approved)\b/i, risk: 'compliance-claim', severity: 'caution' as const },
    { pattern: /\b(patent|proprietary|unique)\b/i, risk: 'ip-claim', severity: 'caution' as const },
    { pattern: /\b(save|reduce|increase|improve)\s+\d+%/i, risk: 'quantified-benefit', severity: 'caution' as const },
    { pattern: /\b(secure|encrypted|protected)\b/i, risk: 'security-claim', severity: 'caution' as const },
    { pattern: /\b(hipaa|soc2|gdpr|iso|fedramp)\b/i, risk: 'framework-claim', severity: 'high-risk' as const }
  ];

  private competitorMisrepresentationPatterns = [
    { pattern: /competitor(s)?\s+(can't|cannot|don't|doesn't|lack|fail)/i, risk: 'competitor-disparagement' },
    { pattern: /unlike\s+(other|traditional|legacy)/i, risk: 'implicit-comparison' }
  ];

  analyze(claimText: string): {
    overallRisk: 'safe' | 'caution' | 'high-risk' | 'rejected';
    findings: { risk: string; severity: string; match: string }[];
    recommendations: string[];
    regulatorSafePhrasing?: string;
  } {
    const findings: { risk: string; severity: string; match: string }[] = [];
    
    // Check risky patterns
    for (const { pattern, risk, severity } of this.riskyPatterns) {
      const match = claimText.match(pattern);
      if (match) {
        findings.push({ risk, severity, match: match[0] });
      }
    }

    // Check competitor misrepresentation
    for (const { pattern, risk } of this.competitorMisrepresentationPatterns) {
      const match = claimText.match(pattern);
      if (match) {
        findings.push({ risk, severity: 'high-risk', match: match[0] });
      }
    }

    // Determine overall risk
    let overallRisk: 'safe' | 'caution' | 'high-risk' | 'rejected' = 'safe';
    if (findings.some(f => f.severity === 'high-risk')) {
      overallRisk = findings.filter(f => f.severity === 'high-risk').length > 2 ? 'rejected' : 'high-risk';
    } else if (findings.some(f => f.severity === 'caution')) {
      overallRisk = 'caution';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(findings);
    const regulatorSafePhrasing = overallRisk !== 'safe' ? this.generateSafePhrasing(claimText, findings) : undefined;

    const result: {
      overallRisk: 'safe' | 'caution' | 'high-risk' | 'rejected';
      findings: { risk: string; severity: string; match: string }[];
      recommendations: string[];
      regulatorSafePhrasing?: string;
    } = { overallRisk, findings, recommendations };
    
    if (regulatorSafePhrasing) {
      result.regulatorSafePhrasing = regulatorSafePhrasing;
    }
    
    return result;
  }

  private generateRecommendations(findings: { risk: string; severity: string; match: string }[]): string[] {
    const recommendations: string[] = [];
    
    for (const finding of findings) {
      switch (finding.risk) {
        case 'absolute-claim':
          recommendations.push(`Replace "${finding.match}" with qualified language (e.g., "designed to", "helps to")`);
          break;
        case 'superlative':
          recommendations.push(`Add substantiation for "${finding.match}" or use comparative language`);
          break;
        case 'ai-claim':
          recommendations.push('Ensure AI claims align with EU AI Act transparency requirements');
          break;
        case 'compliance-claim':
          recommendations.push(`Verify ${finding.match} status and add appropriate disclaimers`);
          break;
        case 'framework-claim':
          recommendations.push(`Confirm certification status for ${finding.match}; add "designed to support" if not certified`);
          break;
        case 'quantified-benefit':
          recommendations.push('Provide citation or study supporting quantified claim');
          break;
        case 'competitor-disparagement':
          recommendations.push('Remove competitor disparagement to avoid legal risk');
          break;
      }
    }

    return [...new Set(recommendations)];
  }

  private generateSafePhrasing(original: string, findings: { risk: string; match: string }[]): string {
    let safe = original;
    
    for (const finding of findings) {
      switch (finding.risk) {
        case 'absolute-claim':
          safe = safe.replace(/guaranteed/gi, 'designed to help');
          safe = safe.replace(/100%/gi, 'comprehensive');
          safe = safe.replace(/always/gi, 'consistently');
          safe = safe.replace(/never fails/gi, 'highly reliable');
          break;
        case 'superlative':
          safe = safe.replace(/best/gi, 'industry-recognized');
          safe = safe.replace(/#1|leading/gi, 'trusted');
          safe = safe.replace(/only/gi, 'specialized');
          break;
      }
    }

    return safe;
  }

  checkNarrativeConsistency(claims: string[]): {
    consistent: boolean;
    conflicts: { claim1: string; claim2: string; issue: string }[];
  } {
    const conflicts: { claim1: string; claim2: string; issue: string }[] = [];
    
    // Check for contradictory claims
    for (let i = 0; i < claims.length; i++) {
      for (let j = i + 1; j < claims.length; j++) {
        const claim1 = claims[i]!.toLowerCase();
        const claim2 = claims[j]!.toLowerCase();
        
        // Check for conflicting quantifications
        const nums1 = claim1.match(/\d+%/g) || [];
        const nums2 = claim2.match(/\d+%/g) || [];
        if (nums1.length > 0 && nums2.length > 0) {
          // If both mention percentages for same thing, flag for review
          if (claim1.includes('save') && claim2.includes('save') && nums1[0] !== nums2[0]) {
            conflicts.push({
              claim1: claims[i]!,
              claim2: claims[j]!,
              issue: 'Conflicting percentage claims'
            });
          }
        }
      }
    }

    return {
      consistent: conflicts.length === 0,
      conflicts
    };
  }
}

// ============================================================================
// INTERNAL DECISION SCHEMAS
// ============================================================================

export class RoadmapDecisionSchema extends DecisionSchema<RoadmapDecision> {
  readonly verticalId = 'internal';
  readonly decisionType = 'roadmap';
  readonly requiredFields = [
    'inputs.featureId',
    'inputs.featureName',
    'inputs.priority',
    'inputs.businessCase',
    'outcome.approved'
  ];
  readonly requiredApprovers = ['product-lead', 'engineering-lead'];

  validate(decision: Partial<RoadmapDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.featureId) errors.push('Feature ID required');
    if (!decision.inputs?.featureName) errors.push('Feature name required');
    if (!decision.inputs?.priority) errors.push('Priority required');
    if (!decision.inputs?.businessCase) errors.push('Business case required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');

    if (decision.inputs?.priority === 'p0' && !decision.inputs?.estimatedEffort) {
      warnings.push('P0 features should have effort estimates');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: RoadmapDecision, signerId: string, signerRole: string, privateKey: string): Promise<RoadmapDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: RoadmapDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        feature: decision.inputs.featureName,
        priority: decision.inputs.priority,
        businessCase: decision.inputs.businessCase,
        approved: decision.outcome.approved,
        targetRelease: decision.outcome.targetRelease,
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }
}

export class MarketingClaimAuditSchema extends DecisionSchema<MarketingClaimAudit> {
  readonly verticalId = 'internal';
  readonly decisionType = 'marketing-claim';
  readonly requiredFields = [
    'inputs.claimId',
    'inputs.claimText',
    'inputs.context',
    'outcome.approved',
    'outcome.riskLevel'
  ];
  readonly requiredApprovers = ['marketing-lead'];

  private riskDetector = new MarketingClaimRiskDetector();

  validate(decision: Partial<MarketingClaimAudit>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.claimId) errors.push('Claim ID required');
    if (!decision.inputs?.claimText) errors.push('Claim text required');
    if (!decision.inputs?.context) errors.push('Context required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskLevel) errors.push('Risk level required');

    // Auto-analyze claim
    if (decision.inputs?.claimText) {
      const analysis = this.riskDetector.analyze(decision.inputs.claimText);
      if (analysis.overallRisk === 'rejected') {
        errors.push('Claim contains unacceptable risk patterns');
      } else if (analysis.overallRisk === 'high-risk') {
        warnings.push('Claim requires legal review before publication');
      }
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: MarketingClaimAudit, signerId: string, signerRole: string, privateKey: string): Promise<MarketingClaimAudit> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: MarketingClaimAudit, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        claim: decision.inputs.claimText,
        context: decision.inputs.context,
        riskLevel: decision.outcome.riskLevel,
        approved: decision.outcome.approved,
        modifications: decision.outcome.modifications,
        disclaimers: decision.outcome.requiredDisclaimers,
        auditNotes: decision.outcome.auditNotes
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }

  analyzeClaimRisk(claimText: string) {
    return this.riskDetector.analyze(claimText);
  }
}

// ============================================================================
// INTERNAL DOGFOODING SERVICE
// ============================================================================

export class DatacendiaInternalService {
  private static instance: DatacendiaInternalService;
  
  private decisions: Map<string, InternalDecision> = new Map();
  private claimAudits: Map<string, MarketingClaimAudit> = new Map();
  
  readonly roadmapSchema = new RoadmapDecisionSchema();
  readonly marketingSchema = new MarketingClaimAuditSchema();
  readonly claimRiskDetector = new MarketingClaimRiskDetector();

  private constructor() {
    this.seedSampleDecisions();
  }

  static getInstance(): DatacendiaInternalService {
    if (!DatacendiaInternalService.instance) {
      DatacendiaInternalService.instance = new DatacendiaInternalService();
    }
    return DatacendiaInternalService.instance;
  }

  private seedSampleDecisions(): void {
    // Sample roadmap decisions
    const roadmapDecision: RoadmapDecision = {
      type: 'roadmap',
      metadata: {
        id: uuidv4(),
        type: 'roadmap',
        verticalId: 'internal',
        createdAt: new Date(),
        createdBy: 'stuart@datacendia.com',
        organizationId: 'datacendia'
      },
      inputs: {
        featureId: 'FEAT-001',
        featureName: 'Financial Services Vertical Completion',
        priority: 'p0',
        requestedBy: 'Product Strategy',
        businessCase: 'Financial services is the next priority after Legal vertical completion. Strong enterprise demand.',
        estimatedEffort: '4-6 weeks',
        dependencies: ['Universal Vertical Pattern'],
        verticalImpact: ['financial']
      },
      deliberation: {
        reasoning: 'Financial services vertical has highest enterprise demand and builds on Legal vertical foundation.',
        alternatives: ['Healthcare vertical first', 'Horizontal feature expansion'],
        riskAssessment: 'Medium - requires compliance expertise for Basel/SR 11-7 mappings'
      },
      outcome: {
        approved: true,
        targetRelease: 'Q1 2026',
        assignedTeam: 'Platform Engineering'
      },
      signatures: [],
      dissents: [],
      approvals: [
        { approverId: 'stuart', approverRole: 'product-lead', approvedAt: new Date() }
      ],
      complianceEvidence: []
    };

    this.decisions.set(roadmapDecision.metadata.id, roadmapDecision);
  }

  // ============================================================================
  // ROADMAP DECISIONS
  // ============================================================================

  createRoadmapDecision(input: Omit<RoadmapDecision, 'metadata' | 'signatures' | 'dissents' | 'approvals' | 'complianceEvidence'>): RoadmapDecision {
    const decision: RoadmapDecision = {
      ...input,
      metadata: {
        id: uuidv4(),
        type: 'roadmap',
        verticalId: 'internal',
        createdAt: new Date(),
        createdBy: 'system',
        organizationId: 'datacendia'
      },
      signatures: [],
      dissents: [],
      approvals: [],
      complianceEvidence: []
    };

    const validation = this.roadmapSchema.validate(decision);
    if (!validation.valid) {
      throw new Error(`Invalid roadmap decision: ${validation.errors.join(', ')}`);
    }

    this.decisions.set(decision.metadata.id, decision);
    return decision;
  }

  getRoadmapDecisions(): RoadmapDecision[] {
    return Array.from(this.decisions.values())
      .filter((d): d is RoadmapDecision => d.type === 'roadmap')
      .sort((a, b) => {
        const priorityOrder = { p0: 0, p1: 1, p2: 2, p3: 3 };
        return priorityOrder[a.inputs.priority] - priorityOrder[b.inputs.priority];
      });
  }

  // ============================================================================
  // MARKETING CLAIM AUDITS
  // ============================================================================

  auditMarketingClaim(claimText: string, context: MarketingClaimAudit['inputs']['context']): {
    analysis: ReturnType<MarketingClaimRiskDetector['analyze']>;
    decision: MarketingClaimAudit;
  } {
    const analysis = this.claimRiskDetector.analyze(claimText);
    
    const decision: MarketingClaimAudit = {
      type: 'marketing-claim',
      metadata: {
        id: uuidv4(),
        type: 'marketing-claim',
        verticalId: 'internal',
        createdAt: new Date(),
        createdBy: 'claim-audit-agent',
        organizationId: 'datacendia'
      },
      inputs: {
        claimId: `CLAIM-${Date.now()}`,
        claimText,
        context,
        targetAudience: 'enterprise',
        supportingEvidence: []
      },
      deliberation: {
        reasoning: `Automated claim risk analysis detected ${analysis.findings.length} risk patterns.`,
        alternatives: analysis.regulatorSafePhrasing ? [analysis.regulatorSafePhrasing] : [],
        riskAssessment: `Overall risk level: ${analysis.overallRisk}`
      },
      outcome: {
        approved: analysis.overallRisk === 'safe',
        riskLevel: analysis.overallRisk,
        legalReview: analysis.overallRisk === 'high-risk',
        auditNotes: analysis.recommendations.join('; ')
      },
      signatures: [],
      dissents: [],
      approvals: [],
      complianceEvidence: []
    };

    this.claimAudits.set(decision.metadata.id, decision);
    this.decisions.set(decision.metadata.id, decision);

    return { analysis, decision };
  }

  batchAuditClaims(claims: { text: string; context: MarketingClaimAudit['inputs']['context'] }[]): {
    results: { claim: string; risk: string; approved: boolean }[];
    consistencyCheck: ReturnType<MarketingClaimRiskDetector['checkNarrativeConsistency']>;
  } {
    const results = claims.map(c => {
      const { analysis } = this.auditMarketingClaim(c.text, c.context);
      return {
        claim: c.text,
        risk: analysis.overallRisk,
        approved: analysis.overallRisk === 'safe'
      };
    });

    const consistencyCheck = this.claimRiskDetector.checkNarrativeConsistency(claims.map(c => c.text));

    return { results, consistencyCheck };
  }

  getClaimAudits(): MarketingClaimAudit[] {
    return Array.from(this.claimAudits.values())
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  // ============================================================================
  // INVESTOR DECISION SUPPORT
  // ============================================================================

  prepareInvestorOutreach(input: InvestorOutreachDecision['inputs']): InvestorOutreachDecision {
    const decision: InvestorOutreachDecision = {
      type: 'investor-outreach',
      metadata: {
        id: uuidv4(),
        type: 'investor-outreach',
        verticalId: 'internal',
        createdAt: new Date(),
        createdBy: 'system',
        organizationId: 'datacendia'
      },
      inputs: input,
      deliberation: {
        reasoning: `Evaluating outreach to ${input.investorName} at ${input.firmName}`,
        alternatives: ['Different intro path', 'Wait for traction milestone'],
        riskAssessment: this.assessInvestorFit(input)
      },
      outcome: {
        proceed: true,
        outreachStrategy: this.generateOutreachStrategy(input),
        keyMessages: this.generateKeyMessages(input),
        risksIdentified: this.identifyRisks(input),
        nextSteps: ['Schedule intro call', 'Prepare tailored deck', 'Research recent investments'],
        ownerAssigned: 'founder'
      },
      signatures: [],
      dissents: [],
      approvals: [],
      complianceEvidence: []
    };

    this.decisions.set(decision.metadata.id, decision);
    return decision;
  }

  private assessInvestorFit(input: InvestorOutreachDecision['inputs']): string {
    const fitFactors: string[] = [];
    
    if (input.verticalFocus.includes('enterprise') || input.verticalFocus.includes('b2b')) {
      fitFactors.push('Strong enterprise focus alignment');
    }
    if (input.verticalFocus.includes('ai') || input.verticalFocus.includes('governance')) {
      fitFactors.push('AI/governance thesis match');
    }
    if (input.checkSize.min >= 1000000) {
      fitFactors.push('Check size appropriate for stage');
    }

    return fitFactors.length > 0 
      ? `Good fit: ${fitFactors.join(', ')}`
      : 'Moderate fit - requires tailored approach';
  }

  private generateOutreachStrategy(input: InvestorOutreachDecision['inputs']): string {
    if (input.introSource === 'warm') {
      return 'Leverage warm intro, focus on vertical depth and compliance differentiation';
    }
    return 'Cold outreach via LinkedIn/email, lead with sovereign AI angle and enterprise traction';
  }

  private generateKeyMessages(input: InvestorOutreachDecision['inputs']): string[] {
    const messages = [
      'Decision infrastructure, not AI platform',
      'Regulator-grade audit trails',
      'Sovereign deployment model'
    ];

    if (input.verticalFocus.includes('fintech')) {
      messages.push('Basel/SR 11-7 compliance built-in');
    }
    if (input.verticalFocus.includes('healthcare')) {
      messages.push('HIPAA-ready clinical decision support');
    }

    return messages;
  }

  private identifyRisks(input: InvestorOutreachDecision['inputs']): string[] {
    const risks: string[] = [];
    
    if (input.stage === 'series-c' || input.stage === 'growth') {
      risks.push('May be too early stage for their typical check');
    }
    if (!input.verticalFocus.some(v => ['enterprise', 'b2b', 'ai', 'governance'].includes(v))) {
      risks.push('Thesis alignment unclear');
    }

    return risks;
  }

  // ============================================================================
  // STATISTICS & REPORTING
  // ============================================================================

  getDogfoodingStats(): {
    totalDecisions: number;
    byType: Record<string, number>;
    claimAudits: {
      total: number;
      approved: number;
      rejected: number;
      riskBreakdown: Record<string, number>;
    };
    roadmapItems: {
      total: number;
      approved: number;
      byPriority: Record<string, number>;
    };
  } {
    const decisions = Array.from(this.decisions.values());
    const claimAudits = Array.from(this.claimAudits.values());
    const roadmapDecisions = decisions.filter((d): d is RoadmapDecision => d.type === 'roadmap');

    const byType: Record<string, number> = {};
    for (const d of decisions) {
      byType[d.type] = (byType[d.type] || 0) + 1;
    }

    const riskBreakdown: Record<string, number> = {};
    for (const audit of claimAudits) {
      riskBreakdown[audit.outcome.riskLevel] = (riskBreakdown[audit.outcome.riskLevel] || 0) + 1;
    }

    const byPriority: Record<string, number> = {};
    for (const rd of roadmapDecisions) {
      byPriority[rd.inputs.priority] = (byPriority[rd.inputs.priority] || 0) + 1;
    }

    return {
      totalDecisions: decisions.length,
      byType,
      claimAudits: {
        total: claimAudits.length,
        approved: claimAudits.filter(a => a.outcome.approved).length,
        rejected: claimAudits.filter(a => !a.outcome.approved).length,
        riskBreakdown
      },
      roadmapItems: {
        total: roadmapDecisions.length,
        approved: roadmapDecisions.filter(r => r.outcome.approved).length,
        byPriority
      }
    };
  }
}

export const datacendiaInternalService = DatacendiaInternalService.getInstance();
export default datacendiaInternalService;
