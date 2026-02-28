// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Industrial Services Vertical - Expanded Decision Types
 * 10 additional decision types (15 total)
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// ============================================================================
// DECISION TYPE 6: WORKFORCE DEPLOYMENT
// ============================================================================

export interface WorkforceDeploymentDecision extends BaseDecision {
  type: 'workforce-deployment';
  inputs: {
    deploymentId: string;
    projectId: string;
    siteLocation: string;
    requiredRoles: { role: string; count: number; certifications: string[]; minExperience: number }[];
    startDate: Date;
    endDate: Date;
    siteHazards: string[];
    altitude?: number;
    shiftPattern: string;
    accommodationRequired: boolean;
    travelRequirements: string;
  };
  outcome: {
    approved: boolean;
    assignedPersonnel: { name: string; role: string; certifications: string[]; medicalClearance: boolean }[];
    gapAnalysis: { role: string; gap: number; mitigation: string }[];
    estimatedCost: number;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 7: MAINTENANCE SCHEDULE
// ============================================================================

export interface MaintenanceScheduleDecision extends BaseDecision {
  type: 'maintenance-schedule';
  inputs: {
    scheduleId: string;
    equipmentId: string;
    equipmentType: string;
    maintenanceType: 'preventive' | 'predictive' | 'corrective' | 'shutdown';
    currentCondition: { overallScore: number; criticalFindings: string[]; corrosionRate?: number; remainingLife?: number };
    lastMaintenance: Date;
    operatingHours: number;
    regulatoryRequirement: boolean;
    productionImpact: { downtime: number; revenueAtRisk: number; alternativeAvailable: boolean };
    inspectionReports: { date: Date; inspector: string; findings: string[]; recommendation: string }[];
  };
  outcome: {
    approved: boolean;
    scheduledDate: Date;
    maintenanceScope: string[];
    estimatedDuration: number;
    estimatedCost: number;
    partsRequired: { part: string; quantity: number; leadTime: number; cost: number }[];
    riskOfDeferral: 'low' | 'medium' | 'high' | 'critical';
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 8: INCIDENT INVESTIGATION
// ============================================================================

export interface IncidentInvestigationDecision extends BaseDecision {
  type: 'incident-investigation';
  inputs: {
    investigationId: string;
    incidentId: string;
    incidentType: 'fatality' | 'lost-time' | 'medical-treatment' | 'first-aid' | 'near-miss' | 'property-damage' | 'environmental';
    incidentDate: Date;
    location: string;
    description: string;
    injuredPersons: { name: string; role: string; injuryType: string; severity: string }[];
    witnesses: { name: string; statement: string }[];
    immediateActions: string[];
    rootCauseMethod: 'fishbone' | '5-why' | 'fault-tree' | 'bowtie' | 'taproot';
    rootCauses: { cause: string; category: 'human' | 'equipment' | 'process' | 'environment' | 'management'; evidence: string }[];
  };
  outcome: {
    classification: string;
    rootCauseFindings: string[];
    correctiveActions: { action: string; responsible: string; dueDate: Date; priority: 'immediate' | 'short-term' | 'long-term'; status: string }[];
    preventiveActions: string[];
    lessonsLearned: string[];
    regulatoryReportRequired: boolean;
    regulatoryBodies: string[];
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 9: TRAINING & CERTIFICATION
// ============================================================================

export interface TrainingCertificationDecision extends BaseDecision {
  type: 'training-certification';
  inputs: {
    trainingId: string;
    trainingType: 'safety-induction' | 'competency' | 'certification-renewal' | 'specialized' | 'regulatory-required';
    courseName: string;
    provider: string;
    targetPersonnel: { name: string; currentCertifications: string[]; expiringCertifications: { cert: string; expiryDate: Date }[] }[];
    regulatoryRequirement: boolean;
    requiredFrameworks: string[];
    estimatedCost: number;
    duration: number;
    deliveryMethod: 'classroom' | 'online' | 'on-the-job' | 'blended';
  };
  outcome: {
    approved: boolean;
    scheduledDate: Date;
    approvedBudget: number;
    complianceGapsClosed: string[];
    certificationOutcomes: { person: string; certification: string; validUntil: Date }[];
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 10: CHANGE ORDER
// ============================================================================

export interface ChangeOrderDecision extends BaseDecision {
  type: 'change-order';
  inputs: {
    changeOrderId: string;
    projectId: string;
    clientName: string;
    changeDescription: string;
    changeType: 'scope-addition' | 'scope-reduction' | 'design-change' | 'schedule-change' | 'force-majeure';
    requestedBy: 'client' | 'contractor' | 'regulatory';
    originalValue: number;
    changeValue: number;
    scheduleImpact: number;
    safetyImplications: string[];
    qualityImplications: string[];
    contractClause: string;
  };
  outcome: {
    approved: boolean;
    approvedValue: number;
    scheduleExtension: number;
    conditions: string[];
    revisedMargin: number;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 11: INSURANCE CLAIM
// ============================================================================

export interface InsuranceClaimDecision extends BaseDecision {
  type: 'insurance-claim';
  inputs: {
    claimId: string;
    policyNumber: string;
    incidentId: string;
    claimType: 'workers-comp' | 'liability' | 'property' | 'equipment' | 'professional-indemnity' | 'environmental';
    incidentDate: Date;
    claimAmount: number;
    description: string;
    supportingDocuments: { documentId: string; type: string; description: string }[];
    thirdPartyInvolved: boolean;
    regulatoryNotificationRequired: boolean;
  };
  outcome: {
    filed: boolean;
    estimatedRecovery: number;
    deductible: number;
    timelineEstimate: number;
    legalCounselRequired: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 12: ENVIRONMENTAL ASSESSMENT
// ============================================================================

export interface EnvironmentalAssessmentDecision extends BaseDecision {
  type: 'environmental-assessment';
  inputs: {
    assessmentId: string;
    projectId: string;
    siteLocation: string;
    assessmentType: 'initial' | 'periodic' | 'closure' | 'emergency';
    environmentalAspects: { aspect: string; impact: string; significance: 'negligible' | 'minor' | 'moderate' | 'major' | 'critical' }[];
    emissionsData: { pollutant: string; measured: number; limit: number; unit: string }[];
    wasteGeneration: { wasteType: string; classification: 'hazardous' | 'non-hazardous' | 'special'; quantity: number; disposalMethod: string }[];
    waterUsage: { source: string; consumption: number; discharge: number; quality: string };
    protectedAreas: boolean;
    communityImpact: string;
  };
  outcome: {
    approved: boolean;
    overallRating: 'compliant' | 'minor-non-conformance' | 'major-non-conformance' | 'critical';
    mitigationMeasures: { measure: string; cost: number; timeline: string }[];
    monitoringPlan: { parameter: string; frequency: string; method: string }[];
    regulatorySubmission: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 13: QUALITY NON-CONFORMANCE REPORT
// ============================================================================

export interface QualityNCRDecision extends BaseDecision {
  type: 'quality-ncr';
  inputs: {
    ncrId: string;
    projectId: string;
    ncrType: 'material' | 'welding' | 'dimensional' | 'surface' | 'coating' | 'documentation' | 'process';
    description: string;
    detectedBy: string;
    detectedAt: string;
    referenceStandard: string;
    affectedQuantity: number;
    severity: 'minor' | 'major' | 'critical';
    photographicEvidence: string[];
    rootCause: string;
    previousOccurrences: number;
  };
  outcome: {
    disposition: 'use-as-is' | 'repair' | 'rework' | 'scrap' | 'return-to-vendor';
    approved: boolean;
    repairProcedure?: string;
    reinspectionRequired: boolean;
    costImpact: number;
    scheduleImpact: number;
    preventiveAction: string;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 14: EMERGENCY RESPONSE
// ============================================================================

export interface EmergencyResponseDecision extends BaseDecision {
  type: 'emergency-response';
  inputs: {
    emergencyId: string;
    emergencyType: 'fire' | 'explosion' | 'chemical-spill' | 'structural-collapse' | 'medical' | 'natural-disaster' | 'security';
    location: string;
    severity: 'level-1' | 'level-2' | 'level-3';
    personnelAtRisk: number;
    currentStatus: string;
    resourcesDeployed: string[];
    externalAgenciesNotified: string[];
    evacuationRequired: boolean;
    environmentalImpact: boolean;
  };
  outcome: {
    responseActivated: boolean;
    commandStructure: { role: string; person: string; contact: string }[];
    evacuationStatus: string;
    casualtyReport: { fatalities: number; injured: number; missing: number };
    containmentActions: string[];
    regulatoryNotifications: string[];
    estimatedRecoveryTime: number;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// DECISION TYPE 15: JOINT VENTURE / PARTNERSHIP
// ============================================================================

export interface JointVentureDecision extends BaseDecision {
  type: 'joint-venture';
  inputs: {
    ventureId: string;
    partnerName: string;
    ventureType: 'joint-venture' | 'consortium' | 'subcontracting-partnership' | 'strategic-alliance';
    projectScope: string;
    estimatedValue: number;
    currency: string;
    duration: number;
    partnerAssessment: {
      financialStability: 'strong' | 'adequate' | 'weak';
      safetyRecord: { trir: number; fatalities: number; emr: number };
      qualityCertifications: string[];
      reputation: number;
      previousPartnership: boolean;
    };
    riskSharing: { category: string; ourShare: number; partnerShare: number }[];
    governanceStructure: string;
    exitStrategy: string;
  };
  outcome: {
    approved: boolean;
    recommendation: 'proceed' | 'proceed-with-conditions' | 'decline' | 'negotiate';
    conditions: string[];
    financialTerms: { revenueShare: number; costShare: number; liabilityShare: number };
    keyRisks: { risk: string; severity: string; mitigation: string }[];
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

// ============================================================================
// UNION TYPE FOR ALL EXPANDED DECISIONS
// ============================================================================

export type ExpandedIndustrialServicesDecision =
  | WorkforceDeploymentDecision
  | MaintenanceScheduleDecision
  | IncidentInvestigationDecision
  | TrainingCertificationDecision
  | ChangeOrderDecision
  | InsuranceClaimDecision
  | EnvironmentalAssessmentDecision
  | QualityNCRDecision
  | EmergencyResponseDecision
  | JointVentureDecision;
