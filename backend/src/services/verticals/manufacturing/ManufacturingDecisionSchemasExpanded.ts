// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Manufacturing Vertical - Expanded Decision Schemas
 * 8 additional decision schema classes (12 total)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  ProductLaunchDecision,
  SupplierQualificationDecision,
  ProcessChangeDecision,
  EquipmentQualificationDecision,
  NCRDispositionDecision,
  EnvironmentalPermitDecision,
  WorkforceTrainingDecision,
  CapitalInvestmentDecision,
} from './ManufacturingDecisionTypesExpanded.js';

export class ProductLaunchSchema extends DecisionSchema<ProductLaunchDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'product-launch';
  readonly requiredFields = ['inputs.productId', 'inputs.ppapLevel', 'outcome.approved', 'outcome.ppapSubmissionStatus'];
  readonly requiredApprovers = ['quality-manager', 'plant-manager', 'customer-representative'];

  validate(decision: Partial<ProductLaunchDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.productId) errors.push('Product ID required');
    if (!decision.inputs?.ppapLevel) errors.push('PPAP level required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.ppapSubmissionStatus) errors.push('PPAP submission status required');
    const lowCpk = decision.inputs?.processCapability?.filter(c => c.cpk < 1.33) || [];
    if (lowCpk.length > 0) errors.push(`${lowCpk.length} characteristic(s) below Cpk 1.33 - cannot launch`);
    if (!decision.inputs?.customerApproval) warnings.push('Customer approval not yet obtained');
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ProductLaunchDecision, signerId: string, signerRole: string, privateKey: string): Promise<ProductLaunchDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ProductLaunchDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { launch: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 15 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class SupplierQualificationSchema extends DecisionSchema<SupplierQualificationDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'supplier-qualification';
  readonly requiredFields = ['inputs.supplierId', 'inputs.auditScore', 'outcome.qualified'];
  readonly requiredApprovers = ['procurement-manager', 'quality-manager'];

  validate(decision: Partial<SupplierQualificationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.supplierId) errors.push('Supplier ID required');
    if (typeof decision.inputs?.auditScore !== 'number') errors.push('Audit score required');
    if (typeof decision.outcome?.qualified !== 'boolean') errors.push('Qualification decision required');
    if (decision.inputs?.auditScore !== undefined && decision.inputs.auditScore < 70) {
      errors.push('Audit score below 70% - cannot qualify supplier');
    }
    if (decision.inputs?.financialStability === 'weak') {
      warnings.push('Weak financial stability - enhanced monitoring recommended');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SupplierQualificationDecision, signerId: string, signerRole: string, privateKey: string): Promise<SupplierQualificationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: SupplierQualificationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { supplier: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class ProcessChangeSchema extends DecisionSchema<ProcessChangeDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'process-change';
  readonly requiredFields = ['inputs.changeId', 'inputs.changeType', 'outcome.approved'];
  readonly requiredApprovers = ['process-engineer', 'quality-manager'];

  validate(decision: Partial<ProcessChangeDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.changeId) errors.push('Change ID required');
    if (!decision.inputs?.changeType) errors.push('Change type required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.changeType === 'major' && !decision.inputs?.validationRequired) {
      errors.push('Major process changes require validation');
    }
    if (decision.inputs?.ppapResubmission && !decision.outcome?.customerApprovalObtained) {
      errors.push('PPAP resubmission requires customer approval');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ProcessChangeDecision, signerId: string, signerRole: string, privateKey: string): Promise<ProcessChangeDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ProcessChangeDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { change: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class EquipmentQualificationSchema extends DecisionSchema<EquipmentQualificationDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'equipment-qualification';
  readonly requiredFields = ['inputs.equipmentId', 'inputs.qualificationType', 'outcome.qualified'];
  readonly requiredApprovers = ['quality-engineer', 'maintenance-manager'];

  validate(decision: Partial<EquipmentQualificationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.equipmentId) errors.push('Equipment ID required');
    if (!decision.inputs?.qualificationType) errors.push('Qualification type required');
    if (typeof decision.outcome?.qualified !== 'boolean') errors.push('Qualification decision required');
    if (!decision.inputs?.calibrationStatus) errors.push('Calibration status required');
    if (decision.inputs?.criticalProcess && decision.outcome?.qualificationLevel !== 'full') {
      errors.push('Critical process equipment requires full qualification (IQ+OQ+PQ)');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EquipmentQualificationDecision, signerId: string, signerRole: string, privateKey: string): Promise<EquipmentQualificationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EquipmentQualificationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { equipment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class NCRDispositionSchema extends DecisionSchema<NCRDispositionDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'ncr-disposition';
  readonly requiredFields = ['inputs.ncrId', 'inputs.severity', 'outcome.disposition', 'outcome.capaRequired'];
  readonly requiredApprovers = ['quality-manager', 'engineering-manager'];

  validate(decision: Partial<NCRDispositionDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.ncrId) errors.push('NCR ID required');
    if (!decision.inputs?.severity) errors.push('Severity required');
    if (!decision.outcome?.disposition) errors.push('Disposition required');
    if (typeof decision.outcome?.capaRequired !== 'boolean') errors.push('CAPA requirement determination required');
    if (decision.inputs?.severity === 'critical' && decision.outcome?.disposition === 'use-as-is') {
      errors.push('Critical NCR cannot be dispositioned as use-as-is without engineering justification');
    }
    if (decision.inputs?.customerImpact && !decision.outcome?.customerWaiver) {
      warnings.push('Customer impact identified - customer waiver may be required');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: NCRDispositionDecision, signerId: string, signerRole: string, privateKey: string): Promise<NCRDispositionDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: NCRDispositionDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { ncr: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class EnvironmentalPermitSchema extends DecisionSchema<EnvironmentalPermitDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'environmental-permit';
  readonly requiredFields = ['inputs.permitId', 'inputs.permitType', 'outcome.approved'];
  readonly requiredApprovers = ['environmental-manager', 'plant-manager'];

  validate(decision: Partial<EnvironmentalPermitDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.permitId) errors.push('Permit ID required');
    if (!decision.inputs?.permitType) errors.push('Permit type required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    const exceedances = decision.inputs?.emissionLimits?.filter(e => e.projected > e.limit) || [];
    if (exceedances.length > 0) {
      errors.push(`${exceedances.length} emission limit(s) projected to be exceeded`);
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EnvironmentalPermitDecision, signerId: string, signerRole: string, privateKey: string): Promise<EnvironmentalPermitDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EnvironmentalPermitDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { permit: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class WorkforceTrainingSchema extends DecisionSchema<WorkforceTrainingDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'workforce-training';
  readonly requiredFields = ['inputs.trainingId', 'inputs.trainingType', 'outcome.approved'];
  readonly requiredApprovers = ['hr-manager', 'plant-manager'];

  validate(decision: Partial<WorkforceTrainingDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.trainingId) errors.push('Training ID required');
    if (!decision.inputs?.trainingType) errors.push('Training type required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.regulatoryRequirement && !decision.outcome?.approved) {
      errors.push('Cannot reject regulatory-required training');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: WorkforceTrainingDecision, signerId: string, signerRole: string, privateKey: string): Promise<WorkforceTrainingDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: WorkforceTrainingDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { training: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class CapitalInvestmentSchema extends DecisionSchema<CapitalInvestmentDecision> {
  readonly verticalId = 'manufacturing';
  readonly decisionType = 'capital-investment';
  readonly requiredFields = ['inputs.investmentId', 'inputs.estimatedCost', 'inputs.roi', 'outcome.approved'];
  readonly requiredApprovers = ['plant-manager', 'cfo', 'vp-operations'];

  validate(decision: Partial<CapitalInvestmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.investmentId) errors.push('Investment ID required');
    if (typeof decision.inputs?.estimatedCost !== 'number') errors.push('Estimated cost required');
    if (!decision.inputs?.roi) errors.push('ROI analysis required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.roi?.paybackPeriod && decision.inputs.roi.paybackPeriod > 5) {
      warnings.push('Payback period exceeds 5 years - enhanced justification required');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: CapitalInvestmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<CapitalInvestmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: CapitalInvestmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { investment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}
