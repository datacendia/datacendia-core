// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Healthcare Vertical - Expanded Decision Types
 * 8 additional decision types (12 total)
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// Re-export patient context types
export type PrivilegeLevel = 'none' | 'limited' | 'full';
export type ConsentStatus = 'obtained' | 'refused' | 'unable' | 'emergency-exception';
export type ClinicalUrgency = 'emergent' | 'urgent' | 'routine' | 'elective';

export interface PatientContext {
  patientId: string;
  age: number;
  sex: 'M' | 'F' | 'O';
  privilegeLevel: PrivilegeLevel;
  consentStatus: ConsentStatus;
  advanceDirectives?: string[];
}

// ============================================================================
// DECISION TYPE 5: SURGERY AUTHORIZATION
// ============================================================================

export interface SurgeryAuthorizationDecision extends BaseDecision {
  type: 'surgery-authorization';
  inputs: {
    patient: PatientContext;
    procedureCode: string;
    procedureName: string;
    surgeon: { id: string; name: string; credentials: string[] };
    indication: string;
    urgency: ClinicalUrgency;
    anesthesiaType: 'general' | 'regional' | 'local' | 'sedation';
    estimatedDuration: number;
    riskFactors: { factor: string; severity: 'low' | 'moderate' | 'high' }[];
    alternativeTreatments: string[];
    insurancePreAuth: boolean;
  };
  outcome: {
    authorized: boolean;
    scheduledDate?: Date;
    conditions: string[];
    requiredConsults: string[];
    surgeonApproval: {
      surgeonId: string;
      approvedAt: Date;
      informedConsentObtained: boolean;
    };
    anesthesiaApproval?: {
      anesthesiologistId: string;
      approvedAt: Date;
      asa: 1 | 2 | 3 | 4 | 5;
    };
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 6: IMAGING ORDER
// ============================================================================

export interface ImagingOrderDecision extends BaseDecision {
  type: 'imaging-order';
  inputs: {
    patient: PatientContext;
    modality: 'CT' | 'MRI' | 'X-Ray' | 'Ultrasound' | 'PET' | 'Nuclear';
    bodyPart: string;
    indication: string;
    urgency: ClinicalUrgency;
    contrast: boolean;
    priorStudies: { date: Date; modality: string; findings: string }[];
    clinicalQuestion: string;
    orderingProvider: { id: string; name: string; specialty: string };
    pregnancyStatus?: boolean;
    renalFunction?: number;
  };
  outcome: {
    approved: boolean;
    appropriatenessScore: number;
    alternativeRecommendation?: string;
    protocolRecommendation: string;
    radiologistReview: boolean;
    starkCompliance: boolean;
    scheduledTime?: Date;
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 7: LAB ORDER
// ============================================================================

export interface LabOrderDecision extends BaseDecision {
  type: 'lab-order';
  inputs: {
    patient: PatientContext;
    tests: { testCode: string; testName: string; urgency: 'stat' | 'routine' | 'timed' }[];
    indication: string;
    orderingProvider: { id: string; name: string };
    collectionTime?: Date;
    fastingRequired: boolean;
    previousResults?: { testCode: string; value: number; date: Date }[];
  };
  outcome: {
    approved: boolean;
    duplicateCheck: { isDuplicate: boolean; lastOrderDate?: Date };
    appropriatenessFlags: string[];
    estimatedCost: number;
    cliaCompliance: boolean;
    collectionInstructions: string[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 8: SPECIALIST REFERRAL
// ============================================================================

export interface SpecialistReferralDecision extends BaseDecision {
  type: 'specialist-referral';
  inputs: {
    patient: PatientContext;
    referringProvider: { id: string; name: string; specialty: string };
    specialty: string;
    reason: string;
    urgency: ClinicalUrgency;
    clinicalSummary: string;
    priorAuthorization: boolean;
    preferredProvider?: { id: string; name: string };
    insurancePlan: string;
  };
  outcome: {
    approved: boolean;
    assignedProvider?: { id: string; name: string; nextAvailable: Date };
    starkCompliance: boolean;
    aksCompliance: boolean;
    insuranceAuthorization: boolean;
    estimatedWaitTime: number;
    alternativeOptions: string[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 9: READMISSION RISK ASSESSMENT
// ============================================================================

export interface ReadmissionRiskDecision extends BaseDecision {
  type: 'readmission-risk';
  inputs: {
    patient: PatientContext;
    dischargeDate: Date;
    primaryDiagnosis: string;
    comorbidities: string[];
    lengthOfStay: number;
    priorAdmissions: { date: Date; diagnosis: string; los: number }[];
    socialDeterminants: {
      housing: 'stable' | 'unstable' | 'homeless';
      transportation: 'adequate' | 'limited' | 'none';
      support: 'strong' | 'moderate' | 'weak';
      healthLiteracy: 'high' | 'medium' | 'low';
    };
    medicationComplexity: number;
    followUpScheduled: boolean;
  };
  outcome: {
    riskScore: number;
    riskCategory: 'low' | 'medium' | 'high' | 'very-high';
    interventions: { intervention: string; priority: number }[];
    followUpPlan: string;
    transitionalCareRequired: boolean;
    homeHealthReferral: boolean;
    estimatedReadmissionProbability: number;
  };
}

// ============================================================================
// DECISION TYPE 10: CLINICAL TRIAL ENROLLMENT
// ============================================================================

export interface ClinicalTrialEnrollmentDecision extends BaseDecision {
  type: 'clinical-trial-enrollment';
  inputs: {
    patient: PatientContext;
    trialId: string;
    trialPhase: 1 | 2 | 3 | 4;
    condition: string;
    inclusionCriteria: { criterion: string; met: boolean }[];
    exclusionCriteria: { criterion: string; violated: boolean }[];
    standardTreatmentOptions: string[];
    informedConsentProcess: boolean;
    irbApproval: boolean;
  };
  outcome: {
    eligible: boolean;
    enrolled: boolean;
    patientConsent: boolean;
    physicianRecommendation: string;
    ethicsReview: boolean;
    alternativeTreatments: string[];
    exclusionReasons: string[];
  };
}

// ============================================================================
// DECISION TYPE 11: END-OF-LIFE CARE PLANNING
// ============================================================================

export interface EndOfLifeCareDecision extends BaseDecision {
  type: 'end-of-life-care';
  inputs: {
    patient: PatientContext;
    prognosis: { condition: string; estimatedSurvival: number; certainty: 'low' | 'moderate' | 'high' };
    currentTreatment: string[];
    advanceDirectives: {
      livingWill: boolean;
      healthcareProxy: boolean;
      dnr: boolean;
      dnh: boolean;
    };
    familyInvolvement: boolean;
    palliativeCareConsult: boolean;
    goalsOfCare: string;
  };
  outcome: {
    recommendedApproach: 'aggressive-treatment' | 'comfort-focused' | 'hospice' | 'palliative';
    careTransition: boolean;
    hospiceReferral: boolean;
    symptomManagementPlan: string[];
    familyMeetingScheduled: boolean;
    ethicsConsultRequired: boolean;
    advanceDirectivesUpdated: boolean;
  };
}

// ============================================================================
// DECISION TYPE 12: BEHAVIORAL HEALTH ASSESSMENT
// ============================================================================

export interface BehavioralHealthAssessmentDecision extends BaseDecision {
  type: 'behavioral-health-assessment';
  inputs: {
    patient: PatientContext;
    screeningTool: 'PHQ-9' | 'GAD-7' | 'AUDIT' | 'CAGE' | 'Columbia-Suicide';
    score: number;
    symptoms: string[];
    duration: string;
    functionalImpairment: 'none' | 'mild' | 'moderate' | 'severe';
    suicidalIdeation: boolean;
    substanceUse: boolean;
    priorPsychiatricHistory: string[];
    currentMedications: string[];
    socialSupport: 'strong' | 'moderate' | 'weak';
  };
  outcome: {
    severity: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
    recommendedLevel: 'self-management' | 'primary-care' | 'outpatient-mh' | 'intensive-outpatient' | 'inpatient';
    immediateRisk: boolean;
    safetyPlan: boolean;
    psychiatryReferral: boolean;
    therapyReferral: boolean;
    medicationRecommendation: boolean;
    followUpInterval: number;
    crisisResources: string[];
  };
}

// ============================================================================
// UNION TYPE FOR ALL EXPANDED DECISIONS
// ============================================================================

export type ExpandedHealthcareDecision =
  | SurgeryAuthorizationDecision
  | ImagingOrderDecision
  | LabOrderDecision
  | SpecialistReferralDecision
  | ReadmissionRiskDecision
  | ClinicalTrialEnrollmentDecision
  | EndOfLifeCareDecision
  | BehavioralHealthAssessmentDecision;
