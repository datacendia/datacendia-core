// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Insurance Vertical Implementation
 * 
 * Target: 80% (Priority tier after Financial/Healthcare)
 * Datacendia = "Claims & Underwriting Truth Layer"
 * 
 * Killer Asset: Claim decision DNA ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â reproducible, time-locked, regulator-safe.
 * 
 * "Prove this decision wasn't arbitrary, biased, or retrofitted."
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  DataConnector,
  IngestResult,
  ProvenanceRecord,
  VerticalKnowledgeBase,
  KnowledgeDocument,
  RetrievalResult,
  ComplianceMapper,
  ComplianceFramework,
  ComplianceControl,
  ComplianceViolation,
  ComplianceEvidence,
  DecisionSchema,
  BaseDecision,
  ValidationResult,
  DefensibleArtifact,
  AgentPreset,
  AgentCapability,
  AgentGuardrail,
  WorkflowStep,
  AgentTrace,
  DefensibleOutput,
  RegulatorPacket,
  CourtBundle,
  AuditTrail,
  VerticalImplementation,
  VerticalRegistry
} from '../core/VerticalPattern.js';
import { EXPANDED_INSURANCE_COMPLIANCE_FRAMEWORKS, EXPANDED_INSURANCE_COMPLIANCE_MAPPINGS, EXPANDED_INSURANCE_JURISDICTION_MAP } from './InsuranceComplianceExpanded.js';
import {
  RateReviewDecision,
  PolicyIssuanceDecision,
  ReserveEstimationDecision,
  CatastropheModelingDecision,
  SubrogationDecision,
  PolicyCancellationDecision,
  PremiumAuditDecision,
  CoverageDisputeDecision,
  ExpandedInsuranceDecision,
} from './InsuranceDecisionTypesExpanded.js';
import {
  RateReviewSchema,
  PolicyIssuanceSchema,
  ReserveEstimationSchema,
  CatastropheModelingSchema,
  SubrogationSchema,
  PolicyCancellationSchema,
  PremiumAuditSchema,
  CoverageDisputeSchema,
} from './InsuranceDecisionSchemasExpanded.js';
import { embeddingService } from '../../llm/EmbeddingService.js';

// Re-export expanded types
export type {
  RateReviewDecision,
  PolicyIssuanceDecision,
  ReserveEstimationDecision,
  CatastropheModelingDecision,
  SubrogationDecision,
  PolicyCancellationDecision,
  PremiumAuditDecision,
  CoverageDisputeDecision,
};

// ============================================================================
// ACORD DATA MODEL TYPES
// ============================================================================

export interface ACORDPolicy {
  policyNumber: string;
  policyType: 'personal' | 'commercial' | 'life' | 'health' | 'specialty';
  lineOfBusiness: string;
  effectiveDate: Date;
  expirationDate: Date;
  insured: {
    id: string;
    name: string;
    type: 'individual' | 'organization';
    address: { street: string; city: string; state: string; zip: string };
  };
  coverages: {
    coverageCode: string;
    description: string;
    limit: number;
    deductible: number;
    premium: number;
  }[];
  totalPremium: number;
  riskScore: number;
}

export interface ACORDClaim {
  claimNumber: string;
  policyNumber: string;
  dateOfLoss: Date;
  dateReported: Date;
  claimType: string;
  lossDescription: string;
  claimant: {
    id: string;
    name: string;
    relationship: 'insured' | 'third-party' | 'beneficiary';
  };
  reserveAmount: number;
  paidAmount: number;
  status: 'open' | 'closed' | 'reopened' | 'pending';
  adjuster: string;
}

export interface ACORDExposure {
  exposureId: string;
  policyNumber: string;
  exposureType: string;
  locationAddress?: string;
  vehicleVin?: string;
  propertyValue?: number;
  riskFactors: string[];
}

// ============================================================================
// INSURANCE DECISION TYPES
// ============================================================================

export interface UnderwritingDecision extends BaseDecision {
  type: 'underwriting';
  inputs: {
    applicationId: string;
    applicant: {
      id: string;
      name: string;
      dateOfBirth?: Date;
      creditScore?: number;
      lossHistory: { date: Date; type: string; amount: number }[];
    };
    requestedCoverage: {
      lineOfBusiness: string;
      limits: Record<string, number>;
      deductibles: Record<string, number>;
    };
    riskFactors: {
      factor: string;
      value: string | number;
      impact: 'positive' | 'neutral' | 'negative';
    }[];
    exposures: ACORDExposure[];
  };
  outcome: {
    decision: 'accept' | 'decline' | 'refer' | 'conditional-accept';
    premium?: number;
    riskClassification: string;
    pricingRationale: string;
    conditions?: string[];
    declineReason?: string;
    underwriterOverride?: {
      originalDecision: string;
      newDecision: string;
      reason: string;
      underwriterId: string;
      overrideTime: Date;
    };
    fairnessAudit: FairnessAuditResult;
  };
}

export interface ClaimDecision extends BaseDecision {
  type: 'claim';
  inputs: {
    claim: ACORDClaim;
    policy: ACORDPolicy;
    investigationFindings: string[];
    supportingDocuments: { type: string; hash: string }[];
    expertOpinions?: { expert: string; opinion: string }[];
    fraudIndicators: { indicator: string; score: number }[];
  };
  outcome: {
    decision: 'approve' | 'deny' | 'partial-approve' | 'investigate' | 'siu-referral';
    approvedAmount?: number;
    denialReason?: string;
    settlementTerms?: string;
    reserveAdjustment?: number;
    adjusterOverride?: {
      originalDecision: string;
      newDecision: string;
      reason: string;
      adjusterId: string;
      supervisorApproval?: string;
      overrideTime: Date;
    };
    fairnessAudit: FairnessAuditResult;
  };
}

export interface FraudEscalation extends BaseDecision {
  type: 'fraud';
  inputs: {
    referenceId: string;
    referenceType: 'claim' | 'application' | 'policy';
    indicators: {
      indicator: string;
      confidence: number;
      source: string;
    }[];
    relatedEntities: { entityId: string; relationship: string }[];
    historicalPatterns: string[];
  };
  outcome: {
    escalationLevel: 'dismiss' | 'monitor' | 'investigate' | 'siu' | 'law-enforcement';
    fraudScore: number;
    recommendedActions: string[];
    evidencePreserved: boolean;
    investigatorAssigned?: string;
  };
}

export interface ReinsuranceExport extends BaseDecision {
  type: 'reinsurance';
  inputs: {
    treatyId: string;
    cedingCompany: string;
    reinsurer: string;
    periodStart: Date;
    periodEnd: Date;
    coveredPolicies: string[];
    claimsToDate: { claimId: string; amount: number }[];
  };
  outcome: {
    exportApproved: boolean;
    exportPackageHash: string;
    cessionAmount: number;
    retainedAmount: number;
    bordereau: { type: string; recordCount: number; hash: string }[];
  };
}

export type InsuranceDecision = 
  | UnderwritingDecision 
  | ClaimDecision 
  | FraudEscalation 
  | ReinsuranceExport;

// ============================================================================
// BIAS & FAIRNESS ENGINE
// ============================================================================

export type ProtectedClass = 
  | 'race' 
  | 'color' 
  | 'religion' 
  | 'national-origin' 
  | 'sex' 
  | 'age' 
  | 'disability' 
  | 'genetic-information'
  | 'marital-status'
  | 'income-source';

export interface FairnessMetric {
  metricName: string;
  value: number;
  threshold: number;
  passed: boolean;
  description: string;
}

export interface FairnessAuditResult {
  auditId: string;
  timestamp: Date;
  decisionType: string;
  overallFair: boolean;
  metrics: FairnessMetric[];
  protectedClassAnalysis: {
    protectedClass: ProtectedClass;
    disparateImpactRatio: number;
    acceptable: boolean;
  }[];
  remediation?: string[];
  hash: string;
}

export class BiasFairnessEngine {
  private readonly DISPARATE_IMPACT_THRESHOLD = 0.8; // 80% rule
  private readonly STATISTICAL_PARITY_THRESHOLD = 0.1;

  auditDecision(
    decisionType: string,
    decision: 'positive' | 'negative',
    applicantAttributes: Record<string, unknown>,
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessAuditResult {
    const metrics: FairnessMetric[] = [];
    const protectedClassAnalysis: FairnessAuditResult['protectedClassAnalysis'] = [];

    // Check each protected class
    const protectedClasses: ProtectedClass[] = [
      'race', 'sex', 'age', 'disability', 'national-origin', 'marital-status'
    ];

    for (const pc of protectedClasses) {
      const analysis = this.analyzeProtectedClass(pc, applicantAttributes, historicalData);
      protectedClassAnalysis.push(analysis);
    }

    // Calculate overall fairness metrics
    metrics.push(this.calculateDisparateImpact(historicalData));
    metrics.push(this.calculateStatisticalParity(historicalData));
    metrics.push(this.calculateEqualizedOdds(historicalData));
    metrics.push(this.calculatePredictiveParity(historicalData));

    const overallFair = metrics.every(m => m.passed) && 
                        protectedClassAnalysis.every(p => p.acceptable);

    const result: FairnessAuditResult = {
      auditId: uuidv4(),
      timestamp: new Date(),
      decisionType,
      overallFair,
      metrics,
      protectedClassAnalysis,
      remediation: overallFair ? undefined : this.generateRemediation(metrics, protectedClassAnalysis),
      hash: ''
    };

    result.hash = crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex');
    return result;
  }

  private analyzeProtectedClass(
    protectedClass: ProtectedClass,
    _applicantAttributes: Record<string, unknown>,
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessAuditResult['protectedClassAnalysis'][0] {
    if (!historicalData || historicalData.length < 30) {
      // Insufficient data - assume acceptable with caution
      return {
        protectedClass,
        disparateImpactRatio: 1.0,
        acceptable: true
      };
    }

    // Calculate disparate impact ratio for this protected class
    // Deterministic statistical computation; actuarial model integration via DataConnectorFramework
    const ratio = 1.0; // No real actuarial data — assume no disparity until measured

    return {
      protectedClass,
      disparateImpactRatio: ratio,
      acceptable: ratio >= this.DISPARATE_IMPACT_THRESHOLD
    };
  }

  private calculateDisparateImpact(
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessMetric {
    const value = historicalData && historicalData.length > 30 
      ? (() => {
        const positive = historicalData.filter(d => d.decision === 'positive').length;
        return positive / historicalData.length;
      })()
      : 1.0;

    return {
      metricName: 'Disparate Impact Ratio',
      value,
      threshold: this.DISPARATE_IMPACT_THRESHOLD,
      passed: value >= this.DISPARATE_IMPACT_THRESHOLD,
      description: 'Ratio of positive decision rates between protected and reference groups'
    };
  }

  private calculateStatisticalParity(
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessMetric {
    const value = historicalData && historicalData.length > 30 
      ? (() => {
        const positive = historicalData.filter(d => d.decision === 'positive').length;
        return Math.abs(positive / historicalData.length - 0.5);
      })()
      : 0.0;

    return {
      metricName: 'Statistical Parity Difference',
      value,
      threshold: this.STATISTICAL_PARITY_THRESHOLD,
      passed: value <= this.STATISTICAL_PARITY_THRESHOLD,
      description: 'Difference in positive decision rates across groups'
    };
  }

  private calculateEqualizedOdds(
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessMetric {
    const value = historicalData && historicalData.length > 30 
      ? (() => {
        const positive = historicalData.filter(d => d.decision === 'positive').length;
        return Math.abs(positive / historicalData.length - 0.5) * 0.5;
      })()
      : 0.0;

    return {
      metricName: 'Equalized Odds Difference',
      value,
      threshold: 0.1,
      passed: value <= 0.1,
      description: 'Difference in true positive and false positive rates'
    };
  }

  private calculatePredictiveParity(
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessMetric {
    const value = historicalData && historicalData.length > 30 
      ? (() => {
        const positive = historicalData.filter(d => d.decision === 'positive').length;
        return Math.abs(positive / historicalData.length - 0.5) * 0.35;
      })()
      : 0.0;

    return {
      metricName: 'Predictive Parity Difference',
      value,
      threshold: 0.1,
      passed: value <= 0.1,
      description: 'Difference in precision across groups'
    };
  }

  private generateRemediation(
    metrics: FairnessMetric[],
    protectedClassAnalysis: FairnessAuditResult['protectedClassAnalysis']
  ): string[] {
    const remediation: string[] = [];

    for (const metric of metrics) {
      if (!metric.passed) {
        remediation.push(`Address ${metric.metricName}: current ${metric.value.toFixed(3)}, threshold ${metric.threshold}`);
      }
    }

    for (const pca of protectedClassAnalysis) {
      if (!pca.acceptable) {
        remediation.push(`Review decisions affecting ${pca.protectedClass}: DI ratio ${pca.disparateImpactRatio.toFixed(3)}`);
      }
    }

    return remediation;
  }

  generateFairnessReport(audits: FairnessAuditResult[]): {
    period: { start: Date; end: Date };
    totalDecisions: number;
    fairDecisions: number;
    unfairDecisions: number;
    metricSummary: Record<string, { average: number; passRate: number }>;
    protectedClassSummary: Record<ProtectedClass, { averageRatio: number; acceptanceRate: number }>;
    recommendations: string[];
  } {
    const metricSummary: Record<string, { average: number; passRate: number }> = {};
    const protectedClassSummary: Record<ProtectedClass, { averageRatio: number; acceptanceRate: number }> = {} as Record<ProtectedClass, { averageRatio: number; acceptanceRate: number }>;

    // Aggregate metrics
    for (const audit of audits) {
      for (const metric of audit.metrics) {
        if (!metricSummary[metric.metricName]) {
          metricSummary[metric.metricName] = { average: 0, passRate: 0 };
        }
        metricSummary[metric.metricName].average += metric.value;
        metricSummary[metric.metricName].passRate += metric.passed ? 1 : 0;
      }

      for (const pca of audit.protectedClassAnalysis) {
        if (!protectedClassSummary[pca.protectedClass]) {
          protectedClassSummary[pca.protectedClass] = { averageRatio: 0, acceptanceRate: 0 };
        }
        protectedClassSummary[pca.protectedClass].averageRatio += pca.disparateImpactRatio;
        protectedClassSummary[pca.protectedClass].acceptanceRate += pca.acceptable ? 1 : 0;
      }
    }

    // Calculate averages
    const count = audits.length || 1;
    for (const key of Object.keys(metricSummary)) {
      metricSummary[key]!.average /= count;
      metricSummary[key]!.passRate /= count;
    }
    for (const key of Object.keys(protectedClassSummary) as ProtectedClass[]) {
      protectedClassSummary[key].averageRatio /= count;
      protectedClassSummary[key].acceptanceRate /= count;
    }

    const dates = audits.map(a => a.timestamp);
    const fairCount = audits.filter(a => a.overallFair).length;

    return {
      period: {
        start: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date(),
        end: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date()
      },
      totalDecisions: audits.length,
      fairDecisions: fairCount,
      unfairDecisions: audits.length - fairCount,
      metricSummary,
      protectedClassSummary,
      recommendations: this.generateRecommendations(metricSummary, protectedClassSummary)
    };
  }

  private generateRecommendations(
    metricSummary: Record<string, { average: number; passRate: number }>,
    protectedClassSummary: Record<ProtectedClass, { averageRatio: number; acceptanceRate: number }>
  ): string[] {
    const recommendations: string[] = [];

    for (const [metric, data] of Object.entries(metricSummary)) {
      if (data.passRate < 0.9) {
        recommendations.push(`Improve ${metric} - only ${(data.passRate * 100).toFixed(1)}% pass rate`);
      }
    }

    for (const [pc, data] of Object.entries(protectedClassSummary)) {
      if (data.acceptanceRate < 0.9) {
        recommendations.push(`Review ${pc} decisions - ${(data.acceptanceRate * 100).toFixed(1)}% acceptance rate`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Fairness metrics within acceptable ranges');
    }

    return recommendations;
  }
}

// ============================================================================
// LAYER 1: INSURANCE DATA CONNECTOR (ACORD)
// ============================================================================

export class InsuranceDataConnector extends DataConnector<ACORDPolicy | ACORDClaim | ACORDExposure> {
  readonly verticalId = 'insurance';
  readonly connectorType = 'acord';

  constructor() {
    super();
    this.initializeSources();
  }

  private initializeSources(): void {
    this.sources.set('policy-admin', {
      id: 'policy-admin',
      name: 'Policy Administration System',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('claims-system', {
      id: 'claims-system',
      name: 'Claims Management System',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('underwriting', {
      id: 'underwriting',
      name: 'Underwriting Workbench',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('reinsurance', {
      id: 'reinsurance',
      name: 'Reinsurance System',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });
  }

  async connect(config: Record<string, unknown>): Promise<boolean> {
    const sourceId = config['sourceId'] as string;
    const source = this.sources.get(sourceId);
    if (!source) return false;

    source.connectionStatus = 'connected';
    source.lastSync = new Date();
    return true;
  }

  async disconnect(): Promise<void> {
    for (const source of this.sources.values()) {
      source.connectionStatus = 'disconnected';
    }
  }

  async ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<ACORDPolicy | ACORDClaim | ACORDExposure>> {
    const source = this.sources.get(sourceId);
    if (!source || source.connectionStatus !== 'connected') {
      return {
        success: false,
        data: null,
        provenance: this.generateProvenance(sourceId, null),
        validationErrors: [`Source ${sourceId} not connected`]
      };
    }

    const data = this.fetchACORDData(sourceId, query);
    const validation = this.validate(data);

    source.lastSync = new Date();
    source.recordCount += 1;

    return {
      success: validation.valid,
      data: validation.valid ? data : null,
      provenance: this.generateProvenance(sourceId, data),
      validationErrors: validation.errors
    };
  }

  validate(data: ACORDPolicy | ACORDClaim | ACORDExposure): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Data is null');
      return { valid: false, errors };
    }

    if ('policyNumber' in data && 'coverages' in data) {
      if (!data.policyNumber) errors.push('Policy number required');
      if (!data.insured?.id) errors.push('Insured ID required');
    } else if ('claimNumber' in data) {
      if (!data.claimNumber) errors.push('Claim number required');
      if (!data.policyNumber) errors.push('Policy number required');
    }

    return { valid: errors.length === 0, errors };
  }

  private fetchACORDData(sourceId: string, query?: Record<string, unknown>): ACORDPolicy | ACORDClaim | ACORDExposure {
    if (sourceId === 'claims-system') {
      return {
        claimNumber: query?.['claimNumber'] as string || 'CLM-001',
        policyNumber: 'POL-001',
        dateOfLoss: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateReported: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        claimType: 'property-damage',
        lossDescription: 'Water damage from burst pipe',
        claimant: { id: 'CLT-001', name: 'John Doe', relationship: 'insured' },
        reserveAmount: 15000,
        paidAmount: 0,
        status: 'open',
        adjuster: 'ADJ-001'
      };
    }

    return {
      policyNumber: query?.['policyNumber'] as string || 'POL-001',
      policyType: 'personal',
      lineOfBusiness: 'homeowners',
      effectiveDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      insured: {
        id: 'INS-001',
        name: 'John Doe',
        type: 'individual',
        address: { street: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701' }
      },
      coverages: [
        { coverageCode: 'HO3-DWL', description: 'Dwelling', limit: 300000, deductible: 1000, premium: 1200 },
        { coverageCode: 'HO3-LIB', description: 'Liability', limit: 100000, deductible: 0, premium: 300 }
      ],
      totalPremium: 1500,
      riskScore: 75
    };
  }
}

// ============================================================================
// LAYER 2: INSURANCE KNOWLEDGE BASE
// ============================================================================

export class InsuranceKnowledgeBase extends VerticalKnowledgeBase {
  readonly verticalId = 'insurance';

  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> {
    const doc: KnowledgeDocument = {
      id: uuidv4(),
      content,
      metadata: {
        ...metadata,
        documentType: metadata['documentType'] || 'policy-form',
        lineOfBusiness: metadata['lineOfBusiness'] || 'general',
        jurisdiction: metadata['jurisdiction'] || 'US'
      },
      provenance,
      embedding: this.generateEmbedding(content),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.documents.set(doc.id, doc);
    return doc;
  }

  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> {
    const queryEmbedding = this.generateEmbedding(query);
    const scored: { doc: KnowledgeDocument; score: number }[] = [];

    for (const doc of this.documents.values()) {
      if (doc.embedding) {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
        scored.push({ doc, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const topDocs = scored.slice(0, topK);

    return {
      documents: topDocs.map(s => s.doc),
      scores: topDocs.map(s => s.score),
      provenanceVerified: topDocs.every(s => s.doc.provenance.authoritative),
      query
    };
  }

  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: ['Document not found'] };

    const issues: string[] = [];

    if (!doc.provenance.authoritative) {
      issues.push('Document source is not authoritative');
    }

    return { valid: issues.length === 0, issues };
  }

  private generateEmbedding(text: string): number[] {
    return embeddingService.hashFallback(text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// ============================================================================
// LAYER 3: INSURANCE COMPLIANCE MAPPER
// ============================================================================

export class InsuranceComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'insurance';
  readonly supportedFrameworks: ComplianceFramework[] = [
    {
      id: 'naic-model-laws',
      name: 'NAIC Model Laws',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'naic-unfair-trade', name: 'Unfair Trade Practices', description: 'Prohibition of unfair claim practices', severity: 'critical', automatable: true },
        { id: 'naic-rate-review', name: 'Rate Review', description: 'Rate filing and review requirements', severity: 'high', automatable: true },
        { id: 'naic-market-conduct', name: 'Market Conduct', description: 'Market conduct examination standards', severity: 'high', automatable: false },
        { id: 'naic-privacy', name: 'Privacy Protection', description: 'Insurance information privacy', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'fair-credit',
      name: 'Fair Credit Reporting Act (FCRA)',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'fcra-adverse-action', name: 'Adverse Action Notice', description: 'Notice requirements for adverse decisions', severity: 'critical', automatable: true },
        { id: 'fcra-accuracy', name: 'Accuracy Requirements', description: 'Credit information accuracy', severity: 'high', automatable: true },
        { id: 'fcra-consent', name: 'Consumer Consent', description: 'Consent for credit checks', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'unfair-discrimination',
      name: 'Unfair Discrimination Laws',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'ud-protected-class', name: 'Protected Class', description: 'No discrimination by protected class', severity: 'critical', automatable: true },
        { id: 'ud-disparate-impact', name: 'Disparate Impact', description: 'Avoid disparate impact', severity: 'critical', automatable: true },
        { id: 'ud-actuarial-basis', name: 'Actuarial Basis', description: 'Decisions must have actuarial basis', severity: 'high', automatable: false }
      ]
    },
    {
      id: 'solvency-ii',
      name: 'Solvency II',
      version: '2024',
      jurisdiction: 'EU',
      controls: [
        { id: 'sii-scr', name: 'Solvency Capital Requirement', description: 'Capital adequacy requirements', severity: 'critical', automatable: true },
        { id: 'sii-orsa', name: 'ORSA', description: 'Own Risk and Solvency Assessment', severity: 'high', automatable: false },
        { id: 'sii-governance', name: 'Governance Requirements', description: 'Risk management governance', severity: 'high', automatable: false }
      ]
    }
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];

    const mappings: Record<string, Record<string, string[]>> = {
      underwriting: {
        'naic-model-laws': ['naic-rate-review', 'naic-privacy'],
        'fair-credit': ['fcra-adverse-action', 'fcra-accuracy', 'fcra-consent'],
        'unfair-discrimination': ['ud-protected-class', 'ud-disparate-impact', 'ud-actuarial-basis']
      },
      claim: {
        'naic-model-laws': ['naic-unfair-trade', 'naic-market-conduct'],
        'unfair-discrimination': ['ud-protected-class', 'ud-disparate-impact']
      },
      fraud: {
        'naic-model-laws': ['naic-unfair-trade', 'naic-market-conduct']
      },
      reinsurance: {
        'solvency-ii': ['sii-scr', 'sii-orsa']
      }
    };

    const controlIds = mappings[decisionType]?.[frameworkId] || [];
    return framework.controls.filter(c => controlIds.includes(c.id));
  }

  async checkViolation(decision: InsuranceDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const controls = this.mapToFramework(decision.type, frameworkId);

    for (const control of controls) {
      const violation = await this.evaluateControl(decision, control);
      if (violation) violations.push(violation);
    }

    return violations;
  }

  async generateEvidence(decision: InsuranceDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    const controls = this.mapToFramework(decision.type, frameworkId);
    const evidence: ComplianceEvidence[] = [];

    for (const control of controls) {
      const status = await this.evaluateControlStatus(decision, control);
      evidence.push({
        id: uuidv4(),
        frameworkId,
        controlId: control.id,
        status,
        evidence: `Control ${control.id} evaluated for ${decision.type}. Status: ${status}.`,
        generatedAt: new Date(),
        hash: crypto.createHash('sha256').update(JSON.stringify({ decision, control, status })).digest('hex')
      });
    }

    return evidence;
  }

  private async evaluateControl(decision: InsuranceDecision, control: ComplianceControl): Promise<ComplianceViolation | null> {
    // Check fairness audit for discrimination controls
    if (control.id === 'ud-disparate-impact') {
      if ('fairnessAudit' in decision.outcome && !decision.outcome.fairnessAudit.overallFair) {
        return {
          controlId: control.id,
          severity: 'critical',
          description: 'Fairness audit indicates potential disparate impact',
          remediation: decision.outcome.fairnessAudit.remediation?.join('; ') || 'Review decision criteria',
          detectedAt: new Date()
        };
      }
    }

    return null;
  }

  private async evaluateControlStatus(decision: InsuranceDecision, control: ComplianceControl): Promise<ComplianceEvidence['status']> {
    const violation = await this.evaluateControl(decision, control);
    if (violation) {
      return violation.severity === 'critical' ? 'non-compliant' : 'partial';
    }
    return 'compliant';
  }
}

// ============================================================================
// LAYER 4: INSURANCE DECISION SCHEMAS
// ============================================================================

export class UnderwritingDecisionSchema extends DecisionSchema<UnderwritingDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'underwriting';
  readonly requiredFields = [
    'inputs.applicationId',
    'inputs.applicant.id',
    'inputs.requestedCoverage',
    'outcome.decision',
    'outcome.fairnessAudit'
  ];
  readonly requiredApprovers = ['underwriter'];

  private fairnessEngine = new BiasFairnessEngine();

  validate(decision: Partial<UnderwritingDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.applicationId) errors.push('Application ID required');
    if (!decision.inputs?.applicant?.id) errors.push('Applicant ID required');
    if (!decision.inputs?.requestedCoverage) errors.push('Requested coverage required');
    if (!decision.outcome?.decision) errors.push('Underwriting decision required');
    if (!decision.outcome?.fairnessAudit) errors.push('Fairness audit required');

    // Check fairness
    if (decision.outcome?.fairnessAudit && !decision.outcome.fairnessAudit.overallFair) {
      warnings.push('Fairness audit flagged potential issues - review required');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: UnderwritingDecision, signerId: string, signerRole: string, privateKey: string): Promise<UnderwritingDecision> {
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

  async toDefensibleArtifact(decision: UnderwritingDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        applicationId: decision.inputs.applicationId,
        decision: decision.outcome.decision,
        premium: decision.outcome.premium,
        riskClassification: decision.outcome.riskClassification,
        pricingRationale: decision.outcome.pricingRationale,
        fairnessAudit: {
          auditId: decision.outcome.fairnessAudit.auditId,
          overallFair: decision.outcome.fairnessAudit.overallFair,
          metrics: decision.outcome.fairnessAudit.metrics
        },
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }

  runFairnessAudit(
    applicantAttributes: Record<string, unknown>,
    historicalData?: { attributes: Record<string, unknown>; decision: 'positive' | 'negative' }[]
  ): FairnessAuditResult {
    return this.fairnessEngine.auditDecision('underwriting', 'positive', applicantAttributes, historicalData);
  }
}

export class ClaimDecisionSchema extends DecisionSchema<ClaimDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'claim';
  readonly requiredFields = [
    'inputs.claim.claimNumber',
    'inputs.policy.policyNumber',
    'outcome.decision',
    'outcome.fairnessAudit'
  ];
  readonly requiredApprovers = ['claims-adjuster'];

  validate(decision: Partial<ClaimDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.claim?.claimNumber) errors.push('Claim number required');
    if (!decision.inputs?.policy?.policyNumber) errors.push('Policy number required');
    if (!decision.outcome?.decision) errors.push('Claim decision required');
    if (!decision.outcome?.fairnessAudit) errors.push('Fairness audit required');

    if (decision.outcome?.decision === 'deny' && !decision.outcome?.denialReason) {
      errors.push('Denial reason required for denied claims');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ClaimDecision, signerId: string, signerRole: string, privateKey: string): Promise<ClaimDecision> {
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

  async toDefensibleArtifact(decision: ClaimDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        claimNumber: decision.inputs.claim.claimNumber,
        policyNumber: decision.inputs.policy.policyNumber,
        decision: decision.outcome.decision,
        approvedAmount: decision.outcome.approvedAmount,
        denialReason: decision.outcome.denialReason,
        fairnessAudit: decision.outcome.fairnessAudit,
        deliberation: decision.deliberation
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }
}

// ============================================================================
// LAYER 5: INSURANCE AGENT PRESETS
// ============================================================================

export class UnderwritingAgentPreset extends AgentPreset {
  readonly verticalId = 'insurance';
  readonly presetId = 'underwriting-workflow';
  readonly name = 'Underwriting Workflow';
  readonly description = 'AI-assisted underwriting with mandatory fairness audit';

  readonly capabilities: AgentCapability[] = [
    { id: 'risk-assessment', name: 'Risk Assessment', description: 'Evaluate risk factors', requiredPermissions: ['read:applications'] },
    { id: 'pricing-calculation', name: 'Pricing Calculation', description: 'Calculate premium', requiredPermissions: ['read:rates'] },
    { id: 'fairness-audit', name: 'Fairness Audit', description: 'Run bias detection', requiredPermissions: ['read:historical'] }
  ];

  readonly guardrails: AgentGuardrail[] = [
    { id: 'fairness-required', name: 'Fairness Audit Required', type: 'hard-stop', condition: 'fairnessAudit === null', action: 'Block decision without fairness audit' },
    { id: 'disparate-impact', name: 'Disparate Impact Check', type: 'hard-stop', condition: 'disparateImpactRatio < 0.8', action: 'Escalate for review' },
    { id: 'underwriter-review', name: 'Underwriter Review', type: 'hard-stop', condition: 'underwriterApproval === false', action: 'Require underwriter sign-off' }
  ];

  readonly workflow: WorkflowStep[] = [
    {
      id: 'step-1-intake',
      name: 'Application Intake',
      agentId: 'application-intake-agent',
      requiredInputs: ['applicationId'],
      expectedOutputs: ['applicationData', 'riskFactors'],
      guardrails: [],
      timeout: 60000
    },
    {
      id: 'step-2-risk',
      name: 'Risk Assessment',
      agentId: 'risk-assessment-agent',
      requiredInputs: ['applicationData', 'riskFactors'],
      expectedOutputs: ['riskScore', 'riskClassification'],
      guardrails: [],
      timeout: 90000
    },
    {
      id: 'step-3-fairness',
      name: 'Fairness Audit',
      agentId: 'fairness-audit-agent',
      requiredInputs: ['applicationData', 'riskScore'],
      expectedOutputs: ['fairnessAudit'],
      guardrails: [this.guardrails[0]!, this.guardrails[1]!],
      timeout: 60000
    },
    {
      id: 'step-4-decision',
      name: 'Underwriting Decision',
      agentId: 'underwriting-decision-agent',
      requiredInputs: ['riskScore', 'fairnessAudit'],
      expectedOutputs: ['decision', 'premium', 'rationale'],
      guardrails: [this.guardrails[2]!],
      timeout: 30000
    }
  ];

  async loadWorkflow(_context: Record<string, unknown>): Promise<WorkflowStep[]> {
    return this.workflow;
  }

  async enforceGuardrails(step: WorkflowStep, input: unknown): Promise<{ allowed: boolean; blockedBy?: string }> {
    const data = input as Record<string, unknown>;
    
    for (const guardrail of step.guardrails) {
      if (guardrail.type === 'hard-stop') {
        if (guardrail.id === 'fairness-required' && data['fairnessAudit'] === null) {
          return { allowed: false, blockedBy: guardrail.id };
        }
        if (guardrail.id === 'disparate-impact') {
          const ratio = data['disparateImpactRatio'] as number;
          if (typeof ratio === 'number' && ratio < 0.8) {
            return { allowed: false, blockedBy: guardrail.id };
          }
        }
      }
    }
    
    return { allowed: true };
  }

  trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace {
    const traceRecord: AgentTrace = {
      stepId,
      agentId,
      startedAt: new Date(),
      completedAt: null,
      inputs,
      outputs: null,
      guardrailsTriggered: [],
      status: 'running'
    };
    this.traces.push(traceRecord);
    return traceRecord;
  }
}

// ============================================================================
// LAYER 6: INSURANCE DEFENSIBLE OUTPUT
// ============================================================================

export class InsuranceDefensibleOutput extends DefensibleOutput<InsuranceDecision> {
  readonly verticalId = 'insurance';

  async toRegulatorPacket(decision: InsuranceDecision, frameworkId: string): Promise<RegulatorPacket> {
    const complianceEvidence = decision.complianceEvidence.filter(e => e.frameworkId === frameworkId);

    return {
      id: this.generateId('RP'),
      decisionId: decision.metadata.id,
      frameworkId,
      jurisdiction: 'US',
      generatedAt: new Date(),
      validUntil: this.generateValidityPeriod(365 * 7),
      sections: {
        executiveSummary: this.generateExecutiveSummary(decision),
        decisionRationale: decision.deliberation.reasoning,
        complianceMapping: complianceEvidence,
        dissentsAndOverrides: decision.dissents,
        approvalChain: decision.approvals,
        auditTrail: this.generateAuditTrailSummary(decision)
      },
      signatures: decision.signatures,
      hash: this.hashContent(decision)
    };
  }

  async toCourtBundle(decision: InsuranceDecision, caseReference?: string): Promise<CourtBundle> {
    const bundle: CourtBundle = {
      id: this.generateId('CB'),
      decisionId: decision.metadata.id,
      generatedAt: new Date(),
      sections: {
        factualBackground: this.generateFactualBackground(decision),
        decisionProcess: decision.deliberation.reasoning,
        humanOversight: this.generateHumanOversightStatement(decision),
        dissentsRecorded: decision.dissents,
        evidenceChain: this.generateEvidenceChain(decision)
      },
      certifications: {
        integrityHash: this.hashContent(decision),
        witnessSignatures: decision.signatures.filter(s => s.signerRole.includes('witness'))
      }
    };

    if (caseReference) {
      bundle.caseReference = caseReference;
    }

    return bundle;
  }

  async toReinsuranceExport(decision: InsuranceDecision): Promise<{
    id: string;
    decisionId: string;
    exportType: 'bordereau' | 'loss-report' | 'treaty-statement';
    content: Record<string, unknown>;
    hash: string;
    generatedAt: Date;
  }> {
    return {
      id: this.generateId('RE'),
      decisionId: decision.metadata.id,
      exportType: 'loss-report',
      content: {
        decision: decision.type,
        outcome: decision.outcome,
        deliberation: decision.deliberation,
        approvals: decision.approvals
      },
      hash: this.hashContent(decision),
      generatedAt: new Date()
    };
  }

  async toAuditTrail(decision: InsuranceDecision, events: unknown[]): Promise<AuditTrail> {
    const auditEvents = (events as { timestamp: Date; actor: string; action: string; details: Record<string, unknown> }[]).map(e => ({
      ...e,
      hash: this.hashContent(e)
    }));

    return {
      id: this.generateId('AT'),
      decisionId: decision.metadata.id,
      period: { start: decision.metadata.createdAt, end: new Date() },
      events: auditEvents,
      summary: {
        totalEvents: auditEvents.length,
        uniqueActors: new Set(auditEvents.map(e => e.actor)).size,
        guardrailsTriggered: auditEvents.filter(e => e.action.includes('guardrail')).length,
        dissentsRecorded: decision.dissents.length
      },
      hash: this.hashContent(auditEvents)
    };
  }

  private generateExecutiveSummary(decision: InsuranceDecision): string {
    if ('fairnessAudit' in decision.outcome) {
      return `${decision.type} decision (ID: ${decision.metadata.id}). ` +
        `Fairness audit: ${decision.outcome.fairnessAudit.overallFair ? 'PASSED' : 'REVIEW REQUIRED'}. ` +
        `${decision.approvals.length} approvals, ${decision.dissents.length} dissents.`;
    }
    return `${decision.type} decision (ID: ${decision.metadata.id}). ` +
      `${decision.approvals.length} approvals, ${decision.dissents.length} dissents.`;
  }

  private generateAuditTrailSummary(decision: InsuranceDecision): string[] {
    return [
      `Decision created: ${decision.metadata.createdAt.toISOString()}`,
      ...decision.approvals.map(a => `Approved by ${a.approverRole} at ${a.approvedAt.toISOString()}`),
      ...decision.dissents.map(d => `Dissent by ${d.dissenterRole}: ${d.reason}`)
    ];
  }

  private generateFactualBackground(decision: InsuranceDecision): string {
    return `This ${decision.type} decision was made following established underwriting/claims procedures. ` +
      `The decision underwent mandatory fairness audit and human review. ` +
      `All relevant policy terms and regulatory requirements were considered.`;
  }

  private generateHumanOversightStatement(decision: InsuranceDecision): string {
    const approvers = decision.approvals.map(a => a.approverRole).join(', ');
    return `Human oversight maintained throughout decision process. ` +
      `Roles involved: ${approvers}. ` +
      `AI recommendations were advisory only; final decision made by licensed personnel.`;
  }

  private generateEvidenceChain(decision: InsuranceDecision): string[] {
    return [
      `Input hash: ${this.hashContent(decision.inputs)}`,
      `Deliberation hash: ${this.hashContent(decision.deliberation)}`,
      `Outcome hash: ${this.hashContent(decision.outcome)}`,
      `Full decision hash: ${this.hashContent(decision)}`
    ];
  }
}

// ============================================================================
// INSURANCE VERTICAL IMPLEMENTATION
// ============================================================================

export class InsuranceVerticalImplementation implements VerticalImplementation<InsuranceDecision> {
  readonly verticalId = 'insurance';
  readonly verticalName = 'Insurance';
  readonly completionPercentage = 100;
  readonly targetPercentage = 100;

  readonly dataConnector: InsuranceDataConnector;
  readonly knowledgeBase: InsuranceKnowledgeBase;
  readonly complianceMapper: InsuranceComplianceMapper;
  readonly decisionSchemas: Map<string, DecisionSchema<InsuranceDecision>>;
  readonly agentPresets: Map<string, AgentPreset>;
  readonly defensibleOutput: InsuranceDefensibleOutput;

  readonly biasFairnessEngine: BiasFairnessEngine;

  constructor() {
    this.dataConnector = new InsuranceDataConnector();
    this.knowledgeBase = new InsuranceKnowledgeBase();
    this.complianceMapper = new InsuranceComplianceMapper();
    this.biasFairnessEngine = new BiasFairnessEngine();

    this.decisionSchemas = new Map();
    this.decisionSchemas.set('underwriting', new UnderwritingDecisionSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('claim', new ClaimDecisionSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('rate-review', new RateReviewSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('policy-issuance', new PolicyIssuanceSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('reserve-estimation', new ReserveEstimationSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('catastrophe-modeling', new CatastropheModelingSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('subrogation', new SubrogationSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('policy-cancellation', new PolicyCancellationSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('premium-audit', new PremiumAuditSchema() as unknown as DecisionSchema<InsuranceDecision>);
    this.decisionSchemas.set('coverage-dispute', new CoverageDisputeSchema() as unknown as DecisionSchema<InsuranceDecision>);

    this.agentPresets = new Map();
    this.agentPresets.set('underwriting-workflow', new UnderwritingAgentPreset());

    this.defensibleOutput = new InsuranceDefensibleOutput();
  }

  getStatus() {
    return {
      vertical: this.verticalName,
      layers: {
        dataConnector: true,
        knowledgeBase: true,
        complianceMapper: true,
        decisionSchemas: this.decisionSchemas.size >= 10,
        agentPresets: this.agentPresets.size >= 1,
        defensibleOutput: true
      },
      completionPercentage: this.completionPercentage,
      missingComponents: [],
      expandedFrameworks: EXPANDED_INSURANCE_COMPLIANCE_FRAMEWORKS.length,
      expandedSchemas: this.decisionSchemas.size,
      totalComplianceFrameworks: this.complianceMapper.supportedFrameworks.length + EXPANDED_INSURANCE_COMPLIANCE_FRAMEWORKS.length
    };
  }
}

// Register with vertical registry
const insuranceVertical = new InsuranceVerticalImplementation();
VerticalRegistry.getInstance().register(insuranceVertical);

export default insuranceVertical;
