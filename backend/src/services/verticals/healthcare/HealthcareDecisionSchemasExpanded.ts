// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Healthcare Vertical - Expanded Decision Schemas
 * 8 additional decision schema classes (12 total)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  SurgeryAuthorizationDecision,
  ImagingOrderDecision,
  LabOrderDecision,
  SpecialistReferralDecision,
  ReadmissionRiskDecision,
  ClinicalTrialEnrollmentDecision,
  EndOfLifeCareDecision,
  BehavioralHealthAssessmentDecision,
} from './HealthcareDecisionTypesExpanded.js';

// ============================================================================
// SCHEMA 5: SURGERY AUTHORIZATION
// ============================================================================

export class SurgeryAuthorizationSchema extends DecisionSchema<SurgeryAuthorizationDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'surgery-authorization';
  readonly requiredFields = ['inputs.patient', 'inputs.procedureCode', 'inputs.surgeon', 'outcome.authorized'];
  readonly requiredApprovers = ['surgeon', 'anesthesiologist'];

  validate(decision: Partial<SurgeryAuthorizationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.procedureCode) errors.push('Procedure code required');
    if (!decision.inputs?.surgeon) errors.push('Surgeon information required');
    if (typeof decision.outcome?.authorized !== 'boolean') errors.push('Authorization decision required');
    if (decision.outcome?.authorized && !decision.outcome?.surgeonApproval?.informedConsentObtained) {
      errors.push('Informed consent must be obtained before surgery authorization');
    }
    if (decision.inputs?.urgency === 'emergent' && !decision.inputs?.insurancePreAuth) {
      warnings.push('Emergency surgery without pre-authorization - document medical necessity');
    }
    if (decision.inputs?.riskFactors?.some(r => r.severity === 'high')) {
      warnings.push('High-risk factors identified - ensure appropriate perioperative planning');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SurgeryAuthorizationDecision, signerId: string, signerRole: string, privateKey: string): Promise<SurgeryAuthorizationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: SurgeryAuthorizationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { surgery: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 6: IMAGING ORDER
// ============================================================================

export class ImagingOrderSchema extends DecisionSchema<ImagingOrderDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'imaging-order';
  readonly requiredFields = ['inputs.patient', 'inputs.modality', 'inputs.indication', 'outcome.approved', 'outcome.starkCompliance'];
  readonly requiredApprovers = ['ordering-provider', 'radiologist'];

  validate(decision: Partial<ImagingOrderDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.modality) errors.push('Imaging modality required');
    if (!decision.inputs?.indication) errors.push('Clinical indication required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (typeof decision.outcome?.starkCompliance !== 'boolean') errors.push('Stark Law compliance check required');
    if (decision.outcome?.approved && !decision.outcome?.starkCompliance) {
      errors.push('Cannot approve imaging order with Stark Law violation');
    }
    if (decision.inputs?.contrast && decision.inputs?.renalFunction && decision.inputs.renalFunction < 30) {
      warnings.push('Contrast use with eGFR <30 - consider alternative or prophylaxis');
    }
    if (decision.inputs?.modality === 'CT' && decision.inputs?.patient?.age < 18) {
      warnings.push('CT in pediatric patient - ensure ALARA principles');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ImagingOrderDecision, signerId: string, signerRole: string, privateKey: string): Promise<ImagingOrderDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ImagingOrderDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { imaging: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 7: LAB ORDER
// ============================================================================

export class LabOrderSchema extends DecisionSchema<LabOrderDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'lab-order';
  readonly requiredFields = ['inputs.patient', 'inputs.tests', 'inputs.indication', 'outcome.approved', 'outcome.cliaCompliance'];
  readonly requiredApprovers = ['ordering-provider'];

  validate(decision: Partial<LabOrderDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.tests?.length) errors.push('At least one test required');
    if (!decision.inputs?.indication) errors.push('Clinical indication required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (typeof decision.outcome?.cliaCompliance !== 'boolean') errors.push('CLIA compliance check required');
    if (decision.outcome?.duplicateCheck?.isDuplicate) {
      warnings.push(`Duplicate test ordered - last order: ${decision.outcome.duplicateCheck.lastOrderDate?.toISOString()}`);
    }
    if (decision.outcome?.estimatedCost && decision.outcome.estimatedCost > 1000) {
      warnings.push('High-cost lab panel - ensure medical necessity documented');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: LabOrderDecision, signerId: string, signerRole: string, privateKey: string): Promise<LabOrderDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: LabOrderDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { lab: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 8: SPECIALIST REFERRAL
// ============================================================================

export class SpecialistReferralSchema extends DecisionSchema<SpecialistReferralDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'specialist-referral';
  readonly requiredFields = ['inputs.patient', 'inputs.specialty', 'inputs.reason', 'outcome.approved', 'outcome.starkCompliance', 'outcome.aksCompliance'];
  readonly requiredApprovers = ['referring-provider', 'compliance-officer'];

  validate(decision: Partial<SpecialistReferralDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.specialty) errors.push('Specialty required');
    if (!decision.inputs?.reason) errors.push('Referral reason required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (typeof decision.outcome?.starkCompliance !== 'boolean') errors.push('Stark Law compliance check required');
    if (typeof decision.outcome?.aksCompliance !== 'boolean') errors.push('Anti-Kickback Statute compliance check required');
    if (decision.outcome?.approved && (!decision.outcome?.starkCompliance || !decision.outcome?.aksCompliance)) {
      errors.push('Cannot approve referral with Stark Law or AKS violation');
    }
    if (!decision.outcome?.insuranceAuthorization && decision.inputs?.priorAuthorization) {
      warnings.push('Prior authorization required but not obtained');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SpecialistReferralDecision, signerId: string, signerRole: string, privateKey: string): Promise<SpecialistReferralDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: SpecialistReferralDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { referral: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 9: READMISSION RISK
// ============================================================================

export class ReadmissionRiskSchema extends DecisionSchema<ReadmissionRiskDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'readmission-risk';
  readonly requiredFields = ['inputs.patient', 'inputs.primaryDiagnosis', 'outcome.riskScore', 'outcome.riskCategory'];
  readonly requiredApprovers = ['case-manager', 'discharge-planner'];

  validate(decision: Partial<ReadmissionRiskDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.primaryDiagnosis) errors.push('Primary diagnosis required');
    if (typeof decision.outcome?.riskScore !== 'number') errors.push('Risk score required');
    if (!decision.outcome?.riskCategory) errors.push('Risk category required');
    if (decision.outcome?.riskCategory === 'high' || decision.outcome?.riskCategory === 'very-high') {
      if (!decision.outcome?.transitionalCareRequired) {
        warnings.push('High readmission risk without transitional care - consider intervention');
      }
      if (!decision.inputs?.followUpScheduled) {
        errors.push('High-risk patient must have follow-up scheduled before discharge');
      }
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ReadmissionRiskDecision, signerId: string, signerRole: string, privateKey: string): Promise<ReadmissionRiskDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ReadmissionRiskDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { risk: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 10: CLINICAL TRIAL ENROLLMENT
// ============================================================================

export class ClinicalTrialEnrollmentSchema extends DecisionSchema<ClinicalTrialEnrollmentDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'clinical-trial-enrollment';
  readonly requiredFields = ['inputs.patient', 'inputs.trialId', 'inputs.irbApproval', 'outcome.eligible', 'outcome.patientConsent'];
  readonly requiredApprovers = ['principal-investigator', 'ethics-committee'];

  validate(decision: Partial<ClinicalTrialEnrollmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.trialId) errors.push('Trial ID required');
    if (!decision.inputs?.irbApproval) errors.push('IRB approval required for clinical trial');
    if (typeof decision.outcome?.eligible !== 'boolean') errors.push('Eligibility determination required');
    if (typeof decision.outcome?.patientConsent !== 'boolean') errors.push('Patient consent status required');
    if (decision.outcome?.enrolled && !decision.outcome?.patientConsent) {
      errors.push('Cannot enroll patient without informed consent');
    }
    if (decision.inputs?.exclusionCriteria?.some(c => c.violated)) {
      errors.push('Patient violates exclusion criteria - ineligible for enrollment');
    }
    if (decision.inputs?.inclusionCriteria?.some(c => !c.met)) {
      warnings.push('Patient does not meet all inclusion criteria');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ClinicalTrialEnrollmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<ClinicalTrialEnrollmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ClinicalTrialEnrollmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { trial: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 15 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 11: END-OF-LIFE CARE
// ============================================================================

export class EndOfLifeCareSchema extends DecisionSchema<EndOfLifeCareDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'end-of-life-care';
  readonly requiredFields = ['inputs.patient', 'inputs.prognosis', 'inputs.advanceDirectives', 'outcome.recommendedApproach'];
  readonly requiredApprovers = ['attending-physician', 'palliative-care-specialist', 'ethics-consultant'];

  validate(decision: Partial<EndOfLifeCareDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.prognosis) errors.push('Prognosis required');
    if (!decision.inputs?.advanceDirectives) errors.push('Advance directives status required');
    if (!decision.outcome?.recommendedApproach) errors.push('Recommended approach required');
    if (!decision.inputs?.advanceDirectives?.livingWill && !decision.inputs?.advanceDirectives?.healthcareProxy) {
      warnings.push('No advance directives on file - ensure goals of care discussion');
    }
    if (decision.outcome?.recommendedApproach === 'hospice' && !decision.inputs?.palliativeCareConsult) {
      warnings.push('Hospice recommendation without palliative care consult');
    }
    if (!decision.inputs?.familyInvolvement) {
      warnings.push('Family not involved in end-of-life care planning');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EndOfLifeCareDecision, signerId: string, signerRole: string, privateKey: string): Promise<EndOfLifeCareDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EndOfLifeCareDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { eol: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 12: BEHAVIORAL HEALTH ASSESSMENT
// ============================================================================

export class BehavioralHealthAssessmentSchema extends DecisionSchema<BehavioralHealthAssessmentDecision> {
  readonly verticalId = 'healthcare';
  readonly decisionType = 'behavioral-health-assessment';
  readonly requiredFields = ['inputs.patient', 'inputs.screeningTool', 'inputs.score', 'outcome.severity', 'outcome.recommendedLevel'];
  readonly requiredApprovers = ['behavioral-health-specialist'];

  validate(decision: Partial<BehavioralHealthAssessmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.patient) errors.push('Patient context required');
    if (!decision.inputs?.screeningTool) errors.push('Screening tool required');
    if (typeof decision.inputs?.score !== 'number') errors.push('Screening score required');
    if (!decision.outcome?.severity) errors.push('Severity assessment required');
    if (!decision.outcome?.recommendedLevel) errors.push('Recommended level of care required');
    if (decision.inputs?.suicidalIdeation && !decision.outcome?.immediateRisk) {
      errors.push('Suicidal ideation reported - immediate risk assessment required');
    }
    if (decision.outcome?.immediateRisk && !decision.outcome?.safetyPlan) {
      errors.push('Immediate risk identified - safety plan required');
    }
    if (decision.outcome?.severity === 'severe' || decision.outcome?.severity === 'moderately-severe') {
      if (!decision.outcome?.psychiatryReferral) {
        warnings.push('Severe symptoms without psychiatry referral');
      }
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: BehavioralHealthAssessmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<BehavioralHealthAssessmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: BehavioralHealthAssessmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { assessment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}
