// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Manufacturing Vertical - Expanded Decision Types
 * 8 additional decision types (12 total)
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// ============================================================================
// DECISION TYPE 5: PRODUCT LAUNCH
// ============================================================================

export interface ProductLaunchDecision extends BaseDecision {
  type: 'product-launch';
  inputs: {
    productId: string;
    productName: string;
    customer: string;
    apqpPhase: 'planning' | 'design' | 'process' | 'validation' | 'launch';
    ppapLevel: 1 | 2 | 3 | 4 | 5;
    designFMEA: { rpn: number; criticalItems: number };
    processFMEA: { rpn: number; criticalItems: number };
    processCapability: { characteristic: string; cpk: number }[];
    firstArticleInspection: boolean;
    productionTrialRun: { quantity: number; defectRate: number };
    customerApproval: boolean;
  };
  outcome: {
    approved: boolean;
    launchDate?: Date;
    ppapSubmissionStatus: 'approved' | 'conditional' | 'rejected';
    openIssues: { issue: string; severity: string; dueDate: Date }[];
    productionReadiness: number;
    qualityGatesPassed: string[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 6: SUPPLIER QUALIFICATION
// ============================================================================

export interface SupplierQualificationDecision extends BaseDecision {
  type: 'supplier-qualification';
  inputs: {
    supplierId: string;
    supplierName: string;
    commodityType: string;
    qualificationType: 'new' | 'requalification' | 'expansion';
    auditScore: number;
    certifications: string[];
    qualityMetrics: { metric: string; value: number; benchmark: number }[];
    deliveryPerformance: { onTimeRate: number; leadTime: number };
    financialStability: 'strong' | 'adequate' | 'weak';
    riskAssessment: { category: string; risk: 'low' | 'medium' | 'high' }[];
  };
  outcome: {
    qualified: boolean;
    approvedStatus: 'approved' | 'conditional' | 'rejected';
    approvedCommodities: string[];
    conditions: string[];
    auditFrequency: 'annual' | 'semi-annual' | 'quarterly';
    developmentPlan?: string[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 7: PROCESS CHANGE
// ============================================================================

export interface ProcessChangeDecision extends BaseDecision {
  type: 'process-change';
  inputs: {
    changeId: string;
    processId: string;
    changeType: 'parameter' | 'equipment' | 'material' | 'method' | 'major';
    description: string;
    justification: string;
    impactAssessment: { area: string; impact: 'none' | 'minor' | 'moderate' | 'major' }[];
    validationRequired: boolean;
    customerNotification: boolean;
    ppapResubmission: boolean;
    currentCapability: { cpk: number };
    projectedCapability: { cpk: number };
  };
  outcome: {
    approved: boolean;
    implementationDate?: Date;
    validationPlan?: string[];
    requalificationRequired: boolean;
    customerApprovalObtained: boolean;
    riskMitigation: string[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 8: EQUIPMENT QUALIFICATION
// ============================================================================

export interface EquipmentQualificationDecision extends BaseDecision {
  type: 'equipment-qualification';
  inputs: {
    equipmentId: string;
    equipmentType: string;
    qualificationType: 'IQ' | 'OQ' | 'PQ' | 'requalification';
    manufacturer: string;
    criticalProcess: boolean;
    calibrationStatus: boolean;
    maintenanceHistory: { date: Date; type: string; findings: string }[];
    operatorTraining: boolean;
    safetyAssessment: { hazard: string; mitigation: string }[];
  };
  outcome: {
    qualified: boolean;
    qualificationLevel: 'IQ' | 'OQ' | 'PQ' | 'full';
    deviations: { deviation: string; disposition: string }[];
    requalificationDate: Date;
    operationalLimits: { parameter: string; min: number; max: number }[];
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 9: NCR DISPOSITION
// ============================================================================

export interface NCRDispositionDecision extends BaseDecision {
  type: 'ncr-disposition';
  inputs: {
    ncrId: string;
    partNumber: string;
    quantity: number;
    defectType: string;
    defectDescription: string;
    severity: 'critical' | 'major' | 'minor';
    rootCause: string;
    customerImpact: boolean;
    regulatoryImpact: boolean;
    costOfScrap: number;
    costOfRework: number;
  };
  outcome: {
    disposition: 'use-as-is' | 'rework' | 'repair' | 'scrap' | 'return-to-supplier';
    approved: boolean;
    engineeringJustification?: string;
    customerWaiver?: boolean;
    correctiveAction: string;
    preventiveAction: string;
    capaRequired: boolean;
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 10: ENVIRONMENTAL PERMIT
// ============================================================================

export interface EnvironmentalPermitDecision extends BaseDecision {
  type: 'environmental-permit';
  inputs: {
    permitId: string;
    permitType: 'air' | 'water' | 'waste' | 'stormwater';
    facilityId: string;
    emissionLimits: { pollutant: string; limit: number; projected: number }[];
    dischargeLimits?: { parameter: string; limit: number; projected: number }[];
    monitoringPlan: string;
    complianceHistory: { year: number; violations: number };
    neighborhoodImpact: boolean;
  };
  outcome: {
    approved: boolean;
    permitNumber?: string;
    expirationDate?: Date;
    specialConditions: string[];
    monitoringRequirements: string[];
    reportingFrequency: 'monthly' | 'quarterly' | 'annual';
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 11: WORKFORCE TRAINING
// ============================================================================

export interface WorkforceTrainingDecision extends BaseDecision {
  type: 'workforce-training';
  inputs: {
    trainingId: string;
    trainingType: 'safety' | 'quality' | 'technical' | 'regulatory';
    targetEmployees: { employeeId: string; currentSkillLevel: number }[];
    trainingProvider: string;
    duration: number;
    cost: number;
    regulatoryRequirement: boolean;
    certificationOffered: boolean;
    competencyGap: { skill: string; currentLevel: number; targetLevel: number }[];
  };
  outcome: {
    approved: boolean;
    scheduledDate?: Date;
    approvedBudget: number;
    expectedOutcome: { skill: string; projectedLevel: number }[];
    certificationPlan: boolean;
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 12: CAPITAL INVESTMENT
// ============================================================================

export interface CapitalInvestmentDecision extends BaseDecision {
  type: 'capital-investment';
  inputs: {
    investmentId: string;
    investmentType: 'equipment' | 'facility' | 'automation' | 'expansion';
    estimatedCost: number;
    justification: string;
    roi: { paybackPeriod: number; npv: number; irr: number };
    capacityIncrease: number;
    qualityImprovement: number;
    safetyImprovement: string[];
    environmentalImpact: { aspect: string; impact: string }[];
    alternatives: { description: string; cost: number; benefits: string }[];
  };
  outcome: {
    approved: boolean;
    approvedAmount?: number;
    conditions: string[];
    implementationPlan: { phase: string; duration: number; cost: number }[];
    performanceMetrics: { metric: string; target: number }[];
    denyReason?: string;
  };
}

// ============================================================================
// UNION TYPE FOR ALL EXPANDED DECISIONS
// ============================================================================

export type ExpandedManufacturingDecision =
  | ProductLaunchDecision
  | SupplierQualificationDecision
  | ProcessChangeDecision
  | EquipmentQualificationDecision
  | NCRDispositionDecision
  | EnvironmentalPermitDecision
  | WorkforceTrainingDecision
  | CapitalInvestmentDecision;
