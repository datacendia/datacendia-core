// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Insurance Decision Schemas - Expanded
 * 
 * Schema implementations for the 8 expanded decision types.
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  DecisionSchema,
  ValidationResult,
  DefensibleArtifact
} from '../core/VerticalPattern.js';
import {
  RateReviewDecision,
  PolicyIssuanceDecision,
  ReserveEstimationDecision,
  CatastropheModelingDecision,
  SubrogationDecision,
  PolicyCancellationDecision,
  PremiumAuditDecision,
  CoverageDisputeDecision
} from './InsuranceDecisionTypesExpanded.js';

// ============================================================================
// RATE REVIEW SCHEMA
// ============================================================================

export class RateReviewSchema extends DecisionSchema<RateReviewDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'rate-review';
  readonly requiredFields = [
    'inputs.lineOfBusiness', 'inputs.state', 'inputs.currentRate',
    'inputs.proposedRate', 'inputs.actuarialJustification',
    'outcome.approved', 'outcome.fairnessAudit'
  ];
  readonly requiredApprovers = ['chief-actuary', 'compliance-officer'];

  validate(decision: Partial<RateReviewDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.lineOfBusiness) errors.push('Line of business required');
    if (!decision.inputs?.state) errors.push('State required');
    if (typeof decision.inputs?.currentRate !== 'number') errors.push('Current rate required');
    if (typeof decision.inputs?.proposedRate !== 'number') errors.push('Proposed rate required');
    if (!decision.inputs?.actuarialJustification) errors.push('Actuarial justification required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.changePercentage && Math.abs(decision.inputs.changePercentage) > 25) {
      warnings.push('Rate change exceeds 25% — regulatory scrutiny likely');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: RateReviewDecision, signerId: string, signerRole: string, privateKey: string): Promise<RateReviewDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId, signerRole, signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: RateReviewDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(), decisionId: decision.metadata.id, type: artifactType,
      content: { lineOfBusiness: decision.inputs.lineOfBusiness, state: decision.inputs.state, currentRate: decision.inputs.currentRate, proposedRate: decision.inputs.proposedRate, approved: decision.outcome.approved, actuarialJustification: decision.inputs.actuarialJustification, fairnessAudit: decision.outcome.fairnessAudit, deliberation: decision.deliberation },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }
}

// ============================================================================
// POLICY ISSUANCE SCHEMA
// ============================================================================

export class PolicyIssuanceSchema extends DecisionSchema<PolicyIssuanceDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'policy-issuance';
  readonly requiredFields = [
    'inputs.applicationId', 'inputs.lineOfBusiness',
    'inputs.underwritingResult', 'outcome.policyIssued'
  ];
  readonly requiredApprovers = ['underwriter'];

  validate(decision: Partial<PolicyIssuanceDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.applicationId) errors.push('Application ID required');
    if (!decision.inputs?.lineOfBusiness) errors.push('Line of business required');
    if (!decision.inputs?.underwritingResult) errors.push('Underwriting result required');
    if (typeof decision.outcome?.policyIssued !== 'boolean') errors.push('Issuance decision required');
    if (decision.inputs?.effectiveDate && decision.inputs.effectiveDate < new Date()) {
      warnings.push('Policy effective date is in the past');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: PolicyIssuanceDecision, signerId: string, signerRole: string, privateKey: string): Promise<PolicyIssuanceDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: PolicyIssuanceDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { applicationId: decision.inputs.applicationId, policyIssued: decision.outcome.policyIssued, policyNumber: decision.outcome.policyNumber, totalPremium: decision.outcome.totalPremium, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// RESERVE ESTIMATION SCHEMA
// ============================================================================

export class ReserveEstimationSchema extends DecisionSchema<ReserveEstimationDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'reserve-estimation';
  readonly requiredFields = [
    'inputs.evaluationDate', 'inputs.lineOfBusiness',
    'inputs.currentReserve', 'inputs.actuarialMethods',
    'outcome.recommendedReserve', 'outcome.adequacyAssessment'
  ];
  readonly requiredApprovers = ['appointed-actuary', 'cfo'];

  validate(decision: Partial<ReserveEstimationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.evaluationDate) errors.push('Evaluation date required');
    if (!decision.inputs?.lineOfBusiness) errors.push('Line of business required');
    if (typeof decision.inputs?.currentReserve !== 'number') errors.push('Current reserve required');
    if (!decision.inputs?.actuarialMethods?.length) errors.push('At least one actuarial method required');
    if (typeof decision.outcome?.recommendedReserve !== 'number') errors.push('Recommended reserve required');
    if (!decision.outcome?.adequacyAssessment) errors.push('Adequacy assessment required');
    if (decision.outcome?.adequacyAssessment === 'inadequate') {
      warnings.push('Reserve inadequacy — immediate action required');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ReserveEstimationDecision, signerId: string, signerRole: string, privateKey: string): Promise<ReserveEstimationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ReserveEstimationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { evaluationDate: decision.inputs.evaluationDate, lineOfBusiness: decision.inputs.lineOfBusiness, currentReserve: decision.inputs.currentReserve, recommendedReserve: decision.outcome.recommendedReserve, adequacy: decision.outcome.adequacyAssessment, methods: decision.inputs.actuarialMethods, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// CATASTROPHE MODELING SCHEMA
// ============================================================================

export class CatastropheModelingSchema extends DecisionSchema<CatastropheModelingDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'catastrophe-modeling';
  readonly requiredFields = [
    'inputs.peril', 'inputs.region', 'inputs.totalInsuredValue',
    'inputs.modelVendor', 'outcome.pml100Year', 'outcome.reinsuranceAdequacy'
  ];
  readonly requiredApprovers = ['chief-actuary', 'cro'];

  validate(decision: Partial<CatastropheModelingDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.peril) errors.push('Peril type required');
    if (!decision.inputs?.region) errors.push('Region required');
    if (typeof decision.inputs?.totalInsuredValue !== 'number') errors.push('Total insured value required');
    if (!decision.inputs?.modelVendor) errors.push('Model vendor required');
    if (typeof decision.outcome?.pml100Year !== 'number') errors.push('100-year PML required');
    if (decision.outcome?.reinsuranceAdequacy === 'inadequate') {
      warnings.push('Reinsurance program inadequate for modeled losses');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: CatastropheModelingDecision, signerId: string, signerRole: string, privateKey: string): Promise<CatastropheModelingDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: CatastropheModelingDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { peril: decision.inputs.peril, region: decision.inputs.region, tiv: decision.inputs.totalInsuredValue, pml100: decision.outcome.pml100Year, pml250: decision.outcome.pml250Year, reinsuranceAdequacy: decision.outcome.reinsuranceAdequacy, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// SUBROGATION SCHEMA
// ============================================================================

export class SubrogationSchema extends DecisionSchema<SubrogationDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'subrogation';
  readonly requiredFields = [
    'inputs.claimNumber', 'inputs.claimAmount', 'inputs.evidenceStrength',
    'outcome.pursueSubrogation', 'outcome.estimatedRecovery'
  ];
  readonly requiredApprovers = ['subrogation-specialist'];

  validate(decision: Partial<SubrogationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.claimNumber) errors.push('Claim number required');
    if (typeof decision.inputs?.claimAmount !== 'number') errors.push('Claim amount required');
    if (!decision.inputs?.evidenceStrength) errors.push('Evidence strength assessment required');
    if (typeof decision.outcome?.pursueSubrogation !== 'boolean') errors.push('Subrogation decision required');
    if (decision.inputs?.statueOfLimitations && new Date(decision.inputs.statueOfLimitations) < new Date()) {
      errors.push('Statute of limitations has expired');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SubrogationDecision, signerId: string, signerRole: string, privateKey: string): Promise<SubrogationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: SubrogationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { claimNumber: decision.inputs.claimNumber, pursueSubrogation: decision.outcome.pursueSubrogation, estimatedRecovery: decision.outcome.estimatedRecovery, recoveryMethod: decision.outcome.recoveryMethod, costBenefitRatio: decision.outcome.costBenefitRatio, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// POLICY CANCELLATION SCHEMA
// ============================================================================

export class PolicyCancellationSchema extends DecisionSchema<PolicyCancellationDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'policy-cancellation';
  readonly requiredFields = [
    'inputs.policyNumber', 'inputs.cancellationReason',
    'inputs.stateRequirements', 'outcome.cancellationApproved'
  ];
  readonly requiredApprovers = ['underwriting-manager', 'compliance-officer'];

  validate(decision: Partial<PolicyCancellationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.policyNumber) errors.push('Policy number required');
    if (!decision.inputs?.cancellationReason) errors.push('Cancellation reason required');
    if (typeof decision.outcome?.cancellationApproved !== 'boolean') errors.push('Cancellation decision required');
    if (decision.inputs?.stateRequirements?.restrictedReasons?.includes(decision.inputs?.cancellationReason || '')) {
      errors.push('Cancellation reason restricted by state law');
    }
    if (decision.inputs?.noticeDays !== undefined && decision.inputs?.stateRequirements?.minimumNoticeDays !== undefined) {
      if (decision.inputs.noticeDays < decision.inputs.stateRequirements.minimumNoticeDays) {
        errors.push(`Notice period (${decision.inputs.noticeDays} days) below state minimum (${decision.inputs.stateRequirements.minimumNoticeDays} days)`);
      }
    }
    if (decision.inputs?.outstandingClaims?.some(c => c.status === 'open')) {
      warnings.push('Open claims exist on policy — review claim disposition');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: PolicyCancellationDecision, signerId: string, signerRole: string, privateKey: string): Promise<PolicyCancellationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: PolicyCancellationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { policyNumber: decision.inputs.policyNumber, reason: decision.inputs.cancellationReason, approved: decision.outcome.cancellationApproved, effectiveDate: decision.outcome.effectiveDate, refundAmount: decision.outcome.refundAmount, noticeCompliant: decision.outcome.noticeCompliant, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// PREMIUM AUDIT SCHEMA
// ============================================================================

export class PremiumAuditSchema extends DecisionSchema<PremiumAuditDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'premium-audit';
  readonly requiredFields = [
    'inputs.policyNumber', 'inputs.auditPeriod',
    'inputs.estimatedPremium', 'outcome.auditedPremium'
  ];
  readonly requiredApprovers = ['premium-auditor'];

  validate(decision: Partial<PremiumAuditDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.policyNumber) errors.push('Policy number required');
    if (!decision.inputs?.auditPeriod) errors.push('Audit period required');
    if (typeof decision.inputs?.estimatedPremium !== 'number') errors.push('Estimated premium required');
    if (typeof decision.outcome?.auditedPremium !== 'number') errors.push('Audited premium required');
    if (decision.outcome?.disputeRisk === 'high') {
      warnings.push('High dispute risk — document thoroughly');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: PremiumAuditDecision, signerId: string, signerRole: string, privateKey: string): Promise<PremiumAuditDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: PremiumAuditDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { policyNumber: decision.inputs.policyNumber, estimatedPremium: decision.inputs.estimatedPremium, auditedPremium: decision.outcome.auditedPremium, adjustment: decision.outcome.premiumAdjustment, direction: decision.outcome.adjustmentDirection, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// COVERAGE DISPUTE SCHEMA
// ============================================================================

export class CoverageDisputeSchema extends DecisionSchema<CoverageDisputeDecision> {
  readonly verticalId = 'insurance';
  readonly decisionType = 'coverage-dispute';
  readonly requiredFields = [
    'inputs.claimNumber', 'inputs.policyNumber', 'inputs.disputeType',
    'inputs.policyLanguage', 'outcome.resolution', 'outcome.rationale'
  ];
  readonly requiredApprovers = ['coverage-counsel', 'claims-manager'];

  validate(decision: Partial<CoverageDisputeDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.claimNumber) errors.push('Claim number required');
    if (!decision.inputs?.policyNumber) errors.push('Policy number required');
    if (!decision.inputs?.disputeType) errors.push('Dispute type required');
    if (!decision.inputs?.policyLanguage) errors.push('Policy language required');
    if (!decision.outcome?.resolution) errors.push('Resolution required');
    if (!decision.outcome?.rationale) errors.push('Rationale required');
    if (decision.outcome?.appealRisk === 'high') {
      warnings.push('High appeal risk — consider external counsel review');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: CoverageDisputeDecision, signerId: string, signerRole: string, privateKey: string): Promise<CoverageDisputeDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: CoverageDisputeDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content: { claimNumber: decision.inputs.claimNumber, policyNumber: decision.inputs.policyNumber, disputeType: decision.inputs.disputeType, resolution: decision.outcome.resolution, coveredAmount: decision.outcome.coveredAmount, rationale: decision.outcome.rationale, precedentWeight: decision.outcome.precedentWeight, deliberation: decision.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'), generatedAt: new Date() };
  }
}
