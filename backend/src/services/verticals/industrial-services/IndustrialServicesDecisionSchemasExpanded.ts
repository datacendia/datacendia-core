// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Industrial Services Vertical - Expanded Decision Schemas
 * 10 additional decision schema classes (15 total)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  WorkforceDeploymentDecision,
  MaintenanceScheduleDecision,
  IncidentInvestigationDecision,
  TrainingCertificationDecision,
  ChangeOrderDecision,
  InsuranceClaimDecision,
  EnvironmentalAssessmentDecision,
  QualityNCRDecision,
  EmergencyResponseDecision,
  JointVentureDecision,
} from './IndustrialServicesDecisionTypesExpanded.js';

// ============================================================================
// SCHEMA 6: WORKFORCE DEPLOYMENT
// ============================================================================

export class WorkforceDeploymentSchema extends DecisionSchema<WorkforceDeploymentDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'workforce-deployment';
  readonly requiredFields = ['inputs.deploymentId', 'inputs.projectId', 'inputs.requiredRoles', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['operations-director', 'safety-officer', 'hr-manager'];

  validate(decision: Partial<WorkforceDeploymentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.deploymentId) errors.push('Deployment ID required');
    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.requiredRoles?.length) errors.push('At least one required role must be specified');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.altitude && decision.inputs.altitude > 3000) {
      warnings.push('High altitude deployment (>3000m) requires enhanced medical clearance per SUNAFIL Art. 49f');
    }
    if (decision.outcome?.gapAnalysis?.some(g => g.gap > 0)) {
      warnings.push('Personnel gaps identified — recruitment or reallocation needed');
    }
    if (decision.outcome?.assignedPersonnel?.some(p => !p.medicalClearance)) {
      warnings.push('Personnel without medical clearance assigned');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: WorkforceDeploymentDecision, signerId: string, signerRole: string, privateKey: string): Promise<WorkforceDeploymentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: WorkforceDeploymentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { deployment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 7: MAINTENANCE SCHEDULE
// ============================================================================

export class MaintenanceScheduleSchema extends DecisionSchema<MaintenanceScheduleDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'maintenance-schedule';
  readonly requiredFields = ['inputs.scheduleId', 'inputs.equipmentId', 'inputs.maintenanceType', 'inputs.currentCondition', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['maintenance-manager', 'operations-director'];

  validate(decision: Partial<MaintenanceScheduleDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.scheduleId) errors.push('Schedule ID required');
    if (!decision.inputs?.equipmentId) errors.push('Equipment ID required');
    if (!decision.inputs?.maintenanceType) errors.push('Maintenance type required');
    if (!decision.inputs?.currentCondition) errors.push('Current condition assessment required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.currentCondition?.overallScore !== undefined && decision.inputs.currentCondition.overallScore < 40) {
      warnings.push('Equipment condition score below 40% — urgent maintenance recommended');
    }
    if (decision.inputs?.currentCondition?.remainingLife !== undefined && decision.inputs.currentCondition.remainingLife < 12) {
      warnings.push('Remaining life less than 12 months — plan for replacement');
    }
    if (decision.inputs?.regulatoryRequirement && !decision.outcome?.approved) {
      errors.push('Cannot defer regulatory-required maintenance');
    }
    if (decision.outcome?.riskOfDeferral === 'critical') {
      errors.push('Cannot approve deferral with critical risk of deferral');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: MaintenanceScheduleDecision, signerId: string, signerRole: string, privateKey: string): Promise<MaintenanceScheduleDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: MaintenanceScheduleDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { schedule: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 8: INCIDENT INVESTIGATION
// ============================================================================

export class IncidentInvestigationSchema extends DecisionSchema<IncidentInvestigationDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'incident-investigation';
  readonly requiredFields = ['inputs.investigationId', 'inputs.incidentId', 'inputs.incidentType', 'inputs.rootCauses', 'outcome.correctiveActions', 'outcome.riskRating'];
  readonly requiredApprovers = ['safety-officer', 'operations-director', 'general-manager'];

  validate(decision: Partial<IncidentInvestigationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.investigationId) errors.push('Investigation ID required');
    if (!decision.inputs?.incidentId) errors.push('Incident ID required');
    if (!decision.inputs?.incidentType) errors.push('Incident type required');
    if (!decision.inputs?.rootCauses?.length) errors.push('At least one root cause must be identified');
    if (!decision.outcome?.correctiveActions?.length) errors.push('At least one corrective action required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.incidentType === 'fatality') {
      if (!decision.outcome?.regulatoryReportRequired) {
        errors.push('Fatality incidents MUST be reported to regulatory bodies');
      }
      warnings.push('Fatality investigation requires independent third-party review');
    }
    if (decision.inputs?.incidentType === 'lost-time' && !decision.outcome?.regulatoryReportRequired) {
      warnings.push('Lost-time injuries should be reported to SUNAFIL within 24 hours');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: IncidentInvestigationDecision, signerId: string, signerRole: string, privateKey: string): Promise<IncidentInvestigationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: IncidentInvestigationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { investigation: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 30 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 9: TRAINING & CERTIFICATION
// ============================================================================

export class TrainingCertificationSchema extends DecisionSchema<TrainingCertificationDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'training-certification';
  readonly requiredFields = ['inputs.trainingId', 'inputs.trainingType', 'inputs.courseName', 'inputs.targetPersonnel', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['safety-officer', 'hr-manager'];

  validate(decision: Partial<TrainingCertificationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.trainingId) errors.push('Training ID required');
    if (!decision.inputs?.trainingType) errors.push('Training type required');
    if (!decision.inputs?.courseName) errors.push('Course name required');
    if (!decision.inputs?.targetPersonnel?.length) errors.push('Target personnel required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.regulatoryRequirement && !decision.outcome?.approved) {
      errors.push('Cannot reject regulatory-required training');
    }
    const expiring = decision.inputs?.targetPersonnel?.flatMap(p => p.expiringCertifications || []) || [];
    const expired = expiring.filter(c => new Date(c.expiryDate) < new Date());
    if (expired.length > 0) {
      warnings.push(`${expired.length} certification(s) already expired — immediate action required`);
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: TrainingCertificationDecision, signerId: string, signerRole: string, privateKey: string): Promise<TrainingCertificationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: TrainingCertificationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { training: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 10: CHANGE ORDER
// ============================================================================

export class ChangeOrderSchema extends DecisionSchema<ChangeOrderDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'change-order';
  readonly requiredFields = ['inputs.changeOrderId', 'inputs.projectId', 'inputs.changeDescription', 'inputs.changeValue', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['project-director', 'finance-controller', 'client-representative'];

  validate(decision: Partial<ChangeOrderDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.changeOrderId) errors.push('Change order ID required');
    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.changeDescription) errors.push('Change description required');
    if (typeof decision.inputs?.changeValue !== 'number') errors.push('Change value required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.changeValue && decision.inputs?.originalValue) {
      const ratio = Math.abs(decision.inputs.changeValue) / decision.inputs.originalValue;
      if (ratio > 0.2) warnings.push('Change order exceeds 20% of original contract value — requires senior approval');
      if (ratio > 0.5) errors.push('Change order exceeds 50% of original value — new contract recommended');
    }
    if (decision.inputs?.safetyImplications?.length) {
      warnings.push(`${decision.inputs.safetyImplications.length} safety implication(s) identified — requires safety review`);
    }
    if (decision.outcome?.revisedMargin !== undefined && decision.outcome.revisedMargin < 0.05) {
      warnings.push('Revised margin below 5% — financial viability concern');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ChangeOrderDecision, signerId: string, signerRole: string, privateKey: string): Promise<ChangeOrderDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: ChangeOrderDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { changeOrder: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 11: INSURANCE CLAIM
// ============================================================================

export class InsuranceClaimSchema extends DecisionSchema<InsuranceClaimDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'insurance-claim';
  readonly requiredFields = ['inputs.claimId', 'inputs.policyNumber', 'inputs.claimType', 'inputs.claimAmount', 'outcome.filed', 'outcome.riskRating'];
  readonly requiredApprovers = ['finance-controller', 'legal-counsel'];

  validate(decision: Partial<InsuranceClaimDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.claimId) errors.push('Claim ID required');
    if (!decision.inputs?.policyNumber) errors.push('Policy number required');
    if (!decision.inputs?.claimType) errors.push('Claim type required');
    if (typeof decision.inputs?.claimAmount !== 'number') errors.push('Claim amount required');
    if (typeof decision.outcome?.filed !== 'boolean') errors.push('Filing decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.claimAmount && decision.inputs.claimAmount > 500000) {
      warnings.push('High-value claim (>$500K) — legal counsel review mandatory');
    }
    if (decision.inputs?.regulatoryNotificationRequired && !decision.inputs?.supportingDocuments?.length) {
      warnings.push('Regulatory notification required but no supporting documents attached');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: InsuranceClaimDecision, signerId: string, signerRole: string, privateKey: string): Promise<InsuranceClaimDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: InsuranceClaimDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { claim: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 12: ENVIRONMENTAL ASSESSMENT
// ============================================================================

export class EnvironmentalAssessmentSchema extends DecisionSchema<EnvironmentalAssessmentDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'environmental-assessment';
  readonly requiredFields = ['inputs.assessmentId', 'inputs.projectId', 'inputs.assessmentType', 'inputs.environmentalAspects', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['environmental-officer', 'operations-director'];

  validate(decision: Partial<EnvironmentalAssessmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.assessmentId) errors.push('Assessment ID required');
    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.assessmentType) errors.push('Assessment type required');
    if (!decision.inputs?.environmentalAspects?.length) errors.push('Environmental aspects must be identified');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    const criticalAspects = decision.inputs?.environmentalAspects?.filter(a => a.significance === 'critical') || [];
    if (criticalAspects.length > 0) {
      errors.push(`${criticalAspects.length} critical environmental impact(s) require immediate mitigation`);
    }
    const exceedances = decision.inputs?.emissionsData?.filter(e => e.measured > e.limit) || [];
    if (exceedances.length > 0) {
      errors.push(`${exceedances.length} emission(s) exceed regulatory limits`);
    }
    if (decision.inputs?.protectedAreas) {
      warnings.push('Project near protected area — enhanced environmental monitoring required');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EnvironmentalAssessmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<EnvironmentalAssessmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EnvironmentalAssessmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { assessment: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 13: QUALITY NCR
// ============================================================================

export class QualityNCRSchema extends DecisionSchema<QualityNCRDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'quality-ncr';
  readonly requiredFields = ['inputs.ncrId', 'inputs.ncrType', 'inputs.description', 'inputs.severity', 'outcome.disposition', 'outcome.riskRating'];
  readonly requiredApprovers = ['quality-manager', 'project-director'];

  validate(decision: Partial<QualityNCRDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.ncrId) errors.push('NCR ID required');
    if (!decision.inputs?.ncrType) errors.push('NCR type required');
    if (!decision.inputs?.description) errors.push('Description required');
    if (!decision.inputs?.severity) errors.push('Severity required');
    if (!decision.outcome?.disposition) errors.push('Disposition required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.severity === 'critical' && decision.outcome?.disposition === 'use-as-is') {
      errors.push('Critical NCR cannot be dispositioned as use-as-is without engineering justification');
    }
    if (decision.inputs?.previousOccurrences !== undefined && decision.inputs.previousOccurrences >= 3) {
      warnings.push('Recurring NCR (3+ occurrences) — systemic corrective action required');
    }
    if (decision.inputs?.ncrType === 'welding' && !decision.outcome?.reinspectionRequired) {
      warnings.push('Welding NCRs typically require reinspection per ASME IX');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: QualityNCRDecision, signerId: string, signerRole: string, privateKey: string): Promise<QualityNCRDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: QualityNCRDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { ncr: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 14: EMERGENCY RESPONSE
// ============================================================================

export class EmergencyResponseSchema extends DecisionSchema<EmergencyResponseDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'emergency-response';
  readonly requiredFields = ['inputs.emergencyId', 'inputs.emergencyType', 'inputs.severity', 'outcome.responseActivated', 'outcome.riskRating'];
  readonly requiredApprovers = ['emergency-commander', 'safety-officer', 'general-manager'];

  validate(decision: Partial<EmergencyResponseDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.emergencyId) errors.push('Emergency ID required');
    if (!decision.inputs?.emergencyType) errors.push('Emergency type required');
    if (!decision.inputs?.severity) errors.push('Severity level required');
    if (typeof decision.outcome?.responseActivated !== 'boolean') errors.push('Response activation status required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (decision.inputs?.severity === 'level-3' && !decision.outcome?.responseActivated) {
      errors.push('Level 3 emergency MUST activate full emergency response');
    }
    if (decision.inputs?.evacuationRequired && !decision.outcome?.evacuationStatus) {
      errors.push('Evacuation required but no evacuation status reported');
    }
    if (decision.inputs?.environmentalImpact && !decision.outcome?.regulatoryNotifications?.length) {
      warnings.push('Environmental impact detected — regulatory notification may be required');
    }
    if (decision.inputs?.personnelAtRisk && decision.inputs.personnelAtRisk > 50) {
      warnings.push('Large number of personnel at risk (>50) — mutual aid activation recommended');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EmergencyResponseDecision, signerId: string, signerRole: string, privateKey: string): Promise<EmergencyResponseDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: EmergencyResponseDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { emergency: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 30 * 365 * 24 * 60 * 60 * 1000) };
  }
}

// ============================================================================
// SCHEMA 15: JOINT VENTURE
// ============================================================================

export class JointVentureSchema extends DecisionSchema<JointVentureDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'joint-venture';
  readonly requiredFields = ['inputs.ventureId', 'inputs.partnerName', 'inputs.ventureType', 'inputs.estimatedValue', 'outcome.approved', 'outcome.riskRating'];
  readonly requiredApprovers = ['general-manager', 'legal-counsel', 'finance-controller', 'safety-officer'];

  validate(decision: Partial<JointVentureDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.ventureId) errors.push('Venture ID required');
    if (!decision.inputs?.partnerName) errors.push('Partner name required');
    if (!decision.inputs?.ventureType) errors.push('Venture type required');
    if (typeof decision.inputs?.estimatedValue !== 'number') errors.push('Estimated value required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if ((decision.inputs?.partnerAssessment?.safetyRecord?.fatalities ?? 0) > 0) {
      errors.push('Partner has fatality on record — requires board-level safety review');
    }
    if (decision.inputs?.partnerAssessment?.financialStability === 'weak') {
      warnings.push('Partner financial stability is weak — enhanced financial due diligence required');
    }
    if ((decision.inputs?.partnerAssessment?.safetyRecord?.emr ?? 0) > 1.0) {
      warnings.push('Partner EMR exceeds 1.0 — elevated insurance risk');
    }
    if (!decision.inputs?.exitStrategy) {
      warnings.push('No exit strategy defined — legal risk');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: JointVentureDecision, signerId: string, signerRole: string, privateKey: string): Promise<JointVentureDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: JointVentureDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { venture: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation, approvals: decision.approvals, dissents: decision.dissents };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) };
  }
}
