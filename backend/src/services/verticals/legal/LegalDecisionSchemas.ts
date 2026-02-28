// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Legal Vertical - Decision Schemas
 * 12 decision schema classes with legal-specific validation
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  ContractReviewDecision,
  LitigationStrategyDecision,
  SettlementApprovalDecision,
  PrivilegeDeterminationDecision,
  EDiscoveryProductionDecision,
  RegulatoryResponseDecision,
  MADueDiligenceDecision,
  EmploymentDisputeDecision,
  IPProtectionDecision,
  DataPrivacyComplianceDecision,
  ConflictCheckDecision,
  ExpertEngagementDecision,
} from './LegalDecisionTypes.js';

export class ContractReviewSchema extends DecisionSchema<ContractReviewDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'contract-review';
  readonly requiredFields = ['inputs.matter', 'inputs.contractType', 'outcome.approved', 'outcome.privilegeProtected'];
  readonly requiredApprovers = ['responsible-attorney', 'partner'];

  validate(decision: Partial<ContractReviewDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (!decision.inputs?.contractType) errors.push('Contract type required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (typeof decision.outcome?.privilegeProtected !== 'boolean') errors.push('Privilege protection status required');
    if (!decision.inputs?.matter?.conflictsCleared) {
      errors.push('Conflicts must be cleared before contract review');
    }
    if (decision.inputs?.redFlags?.length && !decision.outcome?.dealBreakers?.length) {
      warnings.push('Red flags identified but no deal-breakers specified');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ContractReviewDecision, signerId: string, signerRole: string, privateKey: string): Promise<ContractReviewDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ContractReviewDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { contract: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class LitigationStrategySchema extends DecisionSchema<LitigationStrategyDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'litigation-strategy';
  readonly requiredFields = ['inputs.matter', 'inputs.caseStage', 'outcome.recommendedStrategy', 'outcome.privilegeProtected'];
  readonly requiredApprovers = ['responsible-attorney', 'litigation-partner'];

  validate(decision: Partial<LitigationStrategyDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (!decision.inputs?.caseStage) errors.push('Case stage required');
    if (!decision.outcome?.recommendedStrategy) errors.push('Strategy recommendation required');
    if (typeof decision.outcome?.privilegeProtected !== 'boolean') errors.push('Privilege protection status required');
    if (decision.outcome?.privilegeProtected === false) {
      errors.push('Litigation strategy must be privilege-protected');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: LitigationStrategyDecision, signerId: string, signerRole: string, privateKey: string): Promise<LitigationStrategyDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: LitigationStrategyDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { strategy: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class SettlementApprovalSchema extends DecisionSchema<SettlementApprovalDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'settlement-approval';
  readonly requiredFields = ['inputs.matter', 'inputs.settlementAmount', 'inputs.clientApproval', 'outcome.approved'];
  readonly requiredApprovers = ['responsible-attorney', 'client-representative'];

  validate(decision: Partial<SettlementApprovalDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (typeof decision.inputs?.settlementAmount !== 'number') errors.push('Settlement amount required');
    if (!decision.inputs?.clientApproval) errors.push('Client approval required for settlement');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.outcome?.approved && !decision.inputs?.clientApproval) {
      errors.push('Cannot approve settlement without client approval');
    }
    if (decision.outcome?.boardApprovalRequired && decision.outcome?.approved) {
      warnings.push('Board approval required - ensure obtained before finalizing');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SettlementApprovalDecision, signerId: string, signerRole: string, privateKey: string): Promise<SettlementApprovalDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: SettlementApprovalDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { settlement: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class PrivilegeDeterminationSchema extends DecisionSchema<PrivilegeDeterminationDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'privilege-determination';
  readonly requiredFields = ['inputs.documentId', 'outcome.privilegeLevel', 'outcome.producible'];
  readonly requiredApprovers = ['privilege-officer', 'responsible-attorney'];

  validate(decision: Partial<PrivilegeDeterminationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.documentId) errors.push('Document ID required');
    if (!decision.outcome?.privilegeLevel) errors.push('Privilege level determination required');
    if (typeof decision.outcome?.producible !== 'boolean') errors.push('Producibility determination required');
    if (decision.inputs?.thirdPartyDisclosure && decision.outcome?.privilegeType !== 'none') {
      warnings.push('Third-party disclosure may waive privilege');
    }
    if (decision.outcome?.producible && decision.outcome?.privilegeLevel !== 'public') {
      warnings.push('Producing privileged document - ensure waiver is intentional');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: PrivilegeDeterminationDecision, signerId: string, signerRole: string, privateKey: string): Promise<PrivilegeDeterminationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: PrivilegeDeterminationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { privilege: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class EDiscoveryProductionSchema extends DecisionSchema<EDiscoveryProductionDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'ediscovery-production';
  readonly requiredFields = ['inputs.matter', 'inputs.productionRequest', 'inputs.privilegeReviewComplete', 'outcome.approved'];
  readonly requiredApprovers = ['privilege-officer', 'responsible-attorney'];

  validate(decision: Partial<EDiscoveryProductionDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (!decision.inputs?.productionRequest) errors.push('Production request required');
    if (!decision.inputs?.privilegeReviewComplete) {
      errors.push('Privilege review must be complete before production');
    }
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.privilegedDocuments && decision.inputs.privilegedDocuments > 0 && !decision.outcome?.privilegeLog?.length) {
      errors.push('Privileged documents require privilege log');
    }
    const daysUntilDeadline = decision.inputs?.productionDeadline ? (new Date(decision.inputs.productionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24) : 999;
    if (daysUntilDeadline < 5) {
      warnings.push('Production deadline within 5 days - expedite review');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EDiscoveryProductionDecision, signerId: string, signerRole: string, privateKey: string): Promise<EDiscoveryProductionDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EDiscoveryProductionDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { ediscovery: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class RegulatoryResponseSchema extends DecisionSchema<RegulatoryResponseDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'regulatory-response';
  readonly requiredFields = ['inputs.matter', 'inputs.regulator', 'outcome.responseStrategy'];
  readonly requiredApprovers = ['responsible-attorney', 'regulatory-partner'];

  validate(decision: Partial<RegulatoryResponseDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (!decision.inputs?.regulator) errors.push('Regulator identification required');
    if (!decision.outcome?.responseStrategy) errors.push('Response strategy required');
    if (!decision.inputs?.internalInvestigationComplete) {
      warnings.push('Internal investigation should be complete before responding');
    }
    if (decision.inputs?.privilegeIssues && !decision.outcome?.privilegeAssertions?.length) {
      warnings.push('Privilege issues identified but no assertions documented');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: RegulatoryResponseDecision, signerId: string, signerRole: string, privateKey: string): Promise<RegulatoryResponseDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: RegulatoryResponseDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { regulatory: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class MADueDiligenceSchema extends DecisionSchema<MADueDiligenceDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'ma-due-diligence';
  readonly requiredFields = ['inputs.matter', 'inputs.transactionValue', 'outcome.recommendation'];
  readonly requiredApprovers = ['responsible-attorney', 'ma-partner', 'client-representative'];

  validate(decision: Partial<MADueDiligenceDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.matter) errors.push('Matter context required');
    if (typeof decision.inputs?.transactionValue !== 'number') errors.push('Transaction value required');
    if (!decision.outcome?.recommendation) errors.push('Recommendation required');
    const dealBreakers = decision.inputs?.redFlags?.filter(r => r.severity === 'deal-breaker') || [];
    if (dealBreakers.length > 0 && decision.outcome?.recommendation === 'proceed') {
      errors.push('Cannot recommend proceeding with deal-breaker issues unresolved');
    }
    if (decision.inputs?.hsrFiling && decision.inputs.transactionValue > 111400000) {
      warnings.push('HSR filing required for transactions >$111.4M');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: MADueDiligenceDecision, signerId: string, signerRole: string, privateKey: string): Promise<MADueDiligenceDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: MADueDiligenceDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { ma: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class ConflictCheckSchema extends DecisionSchema<ConflictCheckDecision> {
  readonly verticalId = 'legal';
  readonly decisionType = 'conflict-check';
  readonly requiredFields = ['inputs.proposedClient', 'outcome.cleared'];
  readonly requiredApprovers = ['conflicts-officer', 'ethics-partner'];

  validate(decision: Partial<ConflictCheckDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.proposedClient) errors.push('Proposed client required');
    if (typeof decision.outcome?.cleared !== 'boolean') errors.push('Clearance decision required');
    const nonWaivable = decision.outcome?.conflicts?.filter(c => c.severity === 'non-waivable') || [];
    if (nonWaivable.length > 0 && decision.outcome?.cleared) {
      errors.push('Cannot clear non-waivable conflicts');
    }
    if (decision.outcome?.waiverRequired && !decision.outcome?.waiverObtained) {
      warnings.push('Waiver required but not yet obtained');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ConflictCheckDecision, signerId: string, signerRole: string, privateKey: string): Promise<ConflictCheckDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ConflictCheckDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { conflict: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}
