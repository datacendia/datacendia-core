// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Government Vertical - Expanded Decision Schemas
 * 8 additional decision schema classes (12 total)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  PersonnelActionDecision,
  RegulatoryActionDecision,
  ITInvestmentDecision,
  ContractModificationDecision,
  FOIARequestDecision,
  IGAuditResponseDecision,
  EmergencyDeclarationDecision,
  InteragencyAgreementDecision,
} from './GovernmentDecisionTypesExpanded.js';

// ============================================================================
// SCHEMA 5: PERSONNEL ACTION
// ============================================================================

export class PersonnelActionSchema extends DecisionSchema<PersonnelActionDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'personnel-action';
  readonly requiredFields = ['inputs.actionId', 'inputs.actionType', 'inputs.positionTitle', 'outcome.approved'];
  readonly requiredApprovers = ['hr-director', 'supervisor'];

  validate(decision: Partial<PersonnelActionDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.actionId) errors.push('Action ID required');
    if (!decision.inputs?.actionType) errors.push('Action type required');
    if (!decision.inputs?.positionTitle) errors.push('Position title required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.inputs?.meritSystemPrinciples) {
      errors.push('Merit system principles compliance required');
    }
    if (!decision.inputs?.eeocCompliance) {
      errors.push('EEOC compliance verification required');
    }
    if (decision.inputs?.actionType === 'security-clearance' && !decision.inputs?.backgroundInvestigation) {
      errors.push('Background investigation required for security clearance');
    }
    if (decision.inputs?.actionType === 'termination' && !decision.outcome?.legalReview) {
      warnings.push('Legal review recommended for termination actions');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: PersonnelActionDecision, signerId: string, signerRole: string, privateKey: string): Promise<PersonnelActionDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: PersonnelActionDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { action: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 6: REGULATORY ACTION
// ============================================================================

export class RegulatoryActionSchema extends DecisionSchema<RegulatoryActionDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'regulatory-action';
  readonly requiredFields = ['inputs.ruleId', 'inputs.ruleType', 'inputs.economicAnalysis', 'outcome.approved'];
  readonly requiredApprovers = ['agency-head', 'general-counsel', 'oira-reviewer'];

  validate(decision: Partial<RegulatoryActionDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.ruleId) errors.push('Rule ID required');
    if (!decision.inputs?.ruleType) errors.push('Rule type required');
    if (!decision.inputs?.economicAnalysis) errors.push('Economic analysis required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.significantRule && !decision.outcome?.oiraReview) {
      errors.push('Significant rules require OIRA review');
    }
    if (decision.inputs?.economicAnalysis?.netBenefit && decision.inputs.economicAnalysis.netBenefit < 0) {
      warnings.push('Negative net benefit - additional justification required');
    }
    if (decision.inputs?.publicCommentPeriod && decision.inputs.publicCommentPeriod < 30) {
      warnings.push('Public comment period less than 30 days - ensure APA compliance');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: RegulatoryActionDecision, signerId: string, signerRole: string, privateKey: string): Promise<RegulatoryActionDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: RegulatoryActionDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { rule: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 7: IT INVESTMENT
// ============================================================================

export class ITInvestmentSchema extends DecisionSchema<ITInvestmentDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'it-investment';
  readonly requiredFields = ['inputs.investmentId', 'inputs.estimatedCost', 'inputs.businessCase', 'outcome.approved'];
  readonly requiredApprovers = ['cio', 'cfo', 'cybersecurity-officer'];

  validate(decision: Partial<ITInvestmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.investmentId) errors.push('Investment ID required');
    if (typeof decision.inputs?.estimatedCost !== 'number') errors.push('Estimated cost required');
    if (!decision.inputs?.businessCase) errors.push('Business case required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.fedrampRequired && !decision.outcome?.ato) {
      errors.push('FedRAMP-required system must have ATO before approval');
    }
    if (decision.inputs?.cybersecurityRisk === 'high' && !decision.outcome?.cybersecurityApproval) {
      errors.push('High cybersecurity risk requires explicit cybersecurity approval');
    }
    if (decision.inputs?.estimatedCost && decision.inputs.estimatedCost > 10000000) {
      warnings.push('Major IT investment (>$10M) requires OMB approval');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ITInvestmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<ITInvestmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ITInvestmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { investment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 8: CONTRACT MODIFICATION
// ============================================================================

export class ContractModificationSchema extends DecisionSchema<ContractModificationDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'contract-modification';
  readonly requiredFields = ['inputs.contractNumber', 'inputs.modificationType', 'outcome.approved'];
  readonly requiredApprovers = ['contracting-officer', 'legal-counsel'];

  validate(decision: Partial<ContractModificationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.contractNumber) errors.push('Contract number required');
    if (!decision.inputs?.modificationType) errors.push('Modification type required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.costImpact && decision.inputs.costImpact !== 0 && !decision.inputs?.fundingAvailable) {
      errors.push('Cost impact requires available funding');
    }
    if (decision.outcome?.approved && !decision.outcome?.fundsCertified) {
      errors.push('Cannot approve modification without certified funds');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ContractModificationDecision, signerId: string, signerRole: string, privateKey: string): Promise<ContractModificationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ContractModificationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { modification: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 9: FOIA REQUEST
// ============================================================================

export class FOIARequestSchema extends DecisionSchema<FOIARequestDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'foia-request';
  readonly requiredFields = ['inputs.requestId', 'inputs.requestDescription', 'outcome.disposition'];
  readonly requiredApprovers = ['foia-officer', 'general-counsel'];

  validate(decision: Partial<FOIARequestDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.requestId) errors.push('Request ID required');
    if (!decision.inputs?.requestDescription) errors.push('Request description required');
    if (!decision.outcome?.disposition) errors.push('Disposition required');
    const daysSinceRequest = decision.inputs?.requestDate ? (Date.now() - new Date(decision.inputs.requestDate).getTime()) / (1000 * 60 * 60 * 24) : 0;
    if (daysSinceRequest > 20) {
      warnings.push('FOIA response exceeds 20 business day requirement');
    }
    if (decision.outcome?.disposition === 'full-denial' && !decision.outcome?.exemptionsApplied?.length) {
      errors.push('Full denial requires exemption citations');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: FOIARequestDecision, signerId: string, signerRole: string, privateKey: string): Promise<FOIARequestDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: FOIARequestDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { request: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 6 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 10: IG AUDIT RESPONSE
// ============================================================================

export class IGAuditResponseSchema extends DecisionSchema<IGAuditResponseDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'ig-audit-response';
  readonly requiredFields = ['inputs.auditId', 'inputs.findings', 'inputs.correctiveActionPlan', 'outcome.responseApproved'];
  readonly requiredApprovers = ['agency-head', 'cfo', 'general-counsel'];

  validate(decision: Partial<IGAuditResponseDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.auditId) errors.push('Audit ID required');
    if (!decision.inputs?.findings?.length) errors.push('Audit findings required');
    if (!decision.inputs?.correctiveActionPlan?.length) errors.push('Corrective action plan required');
    if (typeof decision.outcome?.responseApproved !== 'boolean') errors.push('Response approval required');
    const materialWeaknesses = decision.inputs?.findings?.filter(f => f.severity === 'material-weakness') || [];
    if (materialWeaknesses.length > 0 && !decision.outcome?.executiveReview) {
      warnings.push('Material weaknesses require executive review');
    }
    if (decision.outcome?.concurrence === 'non-concur') {
      warnings.push('Non-concurrence with IG requires detailed justification');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: IGAuditResponseDecision, signerId: string, signerRole: string, privateKey: string): Promise<IGAuditResponseDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: IGAuditResponseDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { audit: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 11: EMERGENCY DECLARATION
// ============================================================================

export class EmergencyDeclarationSchema extends DecisionSchema<EmergencyDeclarationDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'emergency-declaration';
  readonly requiredFields = ['inputs.emergencyId', 'inputs.emergencyType', 'inputs.severity', 'outcome.declared'];
  readonly requiredApprovers = ['agency-head', 'general-counsel'];

  validate(decision: Partial<EmergencyDeclarationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.emergencyId) errors.push('Emergency ID required');
    if (!decision.inputs?.emergencyType) errors.push('Emergency type required');
    if (!decision.inputs?.severity) errors.push('Severity assessment required');
    if (typeof decision.outcome?.declared !== 'boolean') errors.push('Declaration decision required');
    if (!decision.inputs?.legalBasis) {
      errors.push('Legal basis for emergency declaration required');
    }
    if (decision.inputs?.severity === 'catastrophic' && !decision.inputs?.presidentialDeclaration) {
      warnings.push('Catastrophic emergency may require presidential declaration');
    }
    if (decision.outcome?.declared && !decision.outcome?.congressNotification) {
      warnings.push('Emergency declaration should be reported to Congress');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EmergencyDeclarationDecision, signerId: string, signerRole: string, privateKey: string): Promise<EmergencyDeclarationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EmergencyDeclarationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { emergency: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 12: INTERAGENCY AGREEMENT
// ============================================================================

export class InteragencyAgreementSchema extends DecisionSchema<InteragencyAgreementDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'interagency-agreement';
  readonly requiredFields = ['inputs.agreementId', 'inputs.partnerAgency', 'inputs.estimatedValue', 'outcome.approved'];
  readonly requiredApprovers = ['agency-head', 'general-counsel', 'cfo'];

  validate(decision: Partial<InteragencyAgreementDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.agreementId) errors.push('Agreement ID required');
    if (!decision.inputs?.partnerAgency) errors.push('Partner agency required');
    if (typeof decision.inputs?.estimatedValue !== 'number') errors.push('Estimated value required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.fundingMechanism === 'reimbursable' && !decision.outcome?.fundingCertified) {
      errors.push('Reimbursable agreement requires certified funding');
    }
    if (!decision.inputs?.authorityBasis) {
      errors.push('Legal authority basis required for interagency agreement');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: InteragencyAgreementDecision, signerId: string, signerRole: string, privateKey: string): Promise<InteragencyAgreementDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: InteragencyAgreementDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { agreement: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}
