// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Energy Vertical - Expanded Decision Types
 * 8 additional decision types (12 total)
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// Re-export core types
export interface GridState {
  frequency: number;
  voltage: number;
  load: number;
  generation: number;
  reserves: number;
}

export interface GridAsset {
  assetId: string;
  assetType: 'generator' | 'transformer' | 'transmission-line' | 'substation';
  capacity: number;
  age: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SafetyReviewResult {
  overallSafe: boolean;
  hazards: string[];
  mitigations?: string[];
  reviewedBy: string;
  reviewedAt: Date;
}

// ============================================================================
// DECISION TYPE 5: GENERATION DISPATCH
// ============================================================================

export interface GenerationDispatchDecision extends BaseDecision {
  type: 'generation-dispatch';
  inputs: {
    dispatchId: string;
    timeHorizon: 'real-time' | 'hour-ahead' | 'day-ahead';
    demandForecast: { hour: number; load: number }[];
    availableUnits: { unitId: string; capacity: number; heatRate: number; fuelCost: number; minUpTime: number; minDownTime: number }[];
    transmissionConstraints: { line: string; limit: number }[];
    renewableGeneration: { source: string; forecast: number; variability: number }[];
    emissionLimits: { pollutant: string; limit: number }[];
  };
  outcome: {
    dispatchSchedule: { unitId: string; output: number; startTime: Date; duration: number }[];
    totalCost: number;
    emissionsProjected: { pollutant: string; amount: number }[];
    reliabilityMargin: number;
    operatorApproval: boolean;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 6: OUTAGE PLANNING
// ============================================================================

export interface OutagePlanningDecision extends BaseDecision {
  type: 'outage-planning';
  inputs: {
    outageId: string;
    asset: GridAsset;
    outageType: 'planned' | 'forced' | 'maintenance';
    proposedStart: Date;
    proposedDuration: number;
    workScope: string[];
    customerImpact: number;
    systemReliability: { n1: boolean; contingencies: string[] };
    weatherForecast: string;
    resourceAvailability: boolean;
  };
  outcome: {
    approved: boolean;
    scheduledStart?: Date;
    scheduledDuration?: number;
    conditions: string[];
    contingencyPlan: string[];
    customerNotification: boolean;
    regulatorNotification: boolean;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 7: RENEWABLE INTEGRATION
// ============================================================================

export interface RenewableIntegrationDecision extends BaseDecision {
  type: 'renewable-integration';
  inputs: {
    projectId: string;
    renewableType: 'solar' | 'wind' | 'hydro' | 'battery-storage';
    capacity: number;
    location: string;
    interconnectionStudy: { voltage: string; distance: number; upgrades: string[] };
    variabilityProfile: { hour: number; capacity: number }[];
    gridImpact: { frequency: number; voltage: number; stability: string };
    costEstimate: number;
    incentives: { type: string; amount: number }[];
  };
  outcome: {
    approved: boolean;
    interconnectionApproval: boolean;
    requiredUpgrades: { upgrade: string; cost: number; timeline: number }[];
    operatingLimits: { parameter: string; limit: number }[];
    estimatedAnnualGeneration: number;
    lcoe: number;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 8: DEMAND RESPONSE
// ============================================================================

export interface DemandResponseDecision extends BaseDecision {
  type: 'demand-response';
  inputs: {
    eventId: string;
    eventType: 'economic' | 'emergency' | 'ancillary-services';
    targetReduction: number;
    duration: number;
    participants: { customerId: string; enrolledLoad: number; baselineLoad: number }[];
    marketPrice: number;
    incentiveRate: number;
    weatherConditions: string;
    gridConditions: GridState;
  };
  outcome: {
    dispatched: boolean;
    actualReduction: number;
    participantPerformance: { customerId: string; reduction: number; payment: number }[];
    gridImpact: { frequency: number; voltage: number };
    costSavings: number;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 9: TRANSMISSION UPGRADE
// ============================================================================

export interface TransmissionUpgradeDecision extends BaseDecision {
  type: 'transmission-upgrade';
  inputs: {
    projectId: string;
    upgradeType: 'capacity' | 'reliability' | 'voltage-support' | 'interconnection';
    affectedLines: string[];
    estimatedCost: number;
    driverType: 'load-growth' | 'generation-integration' | 'reliability' | 'aging-infrastructure';
    benefitAnalysis: { benefit: string; value: number }[];
    alternatives: { description: string; cost: number; benefits: string }[];
    environmentalPermits: string[];
    rightOfWay: boolean;
  };
  outcome: {
    approved: boolean;
    approvedBudget?: number;
    projectTimeline: { phase: string; duration: number }[];
    regulatoryApprovals: string[];
    costRecovery: 'rate-base' | 'formula-rate' | 'incentive';
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 10: FUEL PROCUREMENT
// ============================================================================

export interface FuelProcurementDecision extends BaseDecision {
  type: 'fuel-procurement';
  inputs: {
    procurementId: string;
    fuelType: 'natural-gas' | 'coal' | 'nuclear' | 'oil' | 'biomass';
    quantity: number;
    deliveryPeriod: { start: Date; end: Date };
    suppliers: { supplierId: string; price: number; quality: string; reliability: number }[];
    hedgingStrategy: 'fixed' | 'indexed' | 'collar' | 'none';
    storageCapacity: number;
    emissionCompliance: boolean;
  };
  outcome: {
    awarded: boolean;
    selectedSupplier?: string;
    contractPrice: number;
    deliverySchedule: { month: string; quantity: number }[];
    hedgePosition: { instrument: string; volume: number }[];
    estimatedCost: number;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 11: ENVIRONMENTAL COMPLIANCE
// ============================================================================

export interface EnvironmentalComplianceDecision extends BaseDecision {
  type: 'environmental-compliance';
  inputs: {
    complianceId: string;
    regulationType: 'air' | 'water' | 'waste' | 'multi-media';
    facilityId: string;
    emissionsData: { pollutant: string; measured: number; limit: number; unit: string }[];
    dischargeData?: { parameter: string; measured: number; limit: number }[];
    wasteManagement: { wasteType: string; quantity: number; disposal: string }[];
    violations: { date: Date; type: string; severity: string }[];
    correctiveActions: string[];
  };
  outcome: {
    compliant: boolean;
    exceedances: { parameter: string; amount: number; action: string }[];
    reportingRequired: boolean;
    penaltyRisk: number;
    remediationPlan: { action: string; cost: number; timeline: string }[];
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// DECISION TYPE 12: ASSET RETIREMENT
// ============================================================================

export interface AssetRetirementDecision extends BaseDecision {
  type: 'asset-retirement';
  inputs: {
    assetId: string;
    asset: GridAsset;
    retirementReason: 'end-of-life' | 'uneconomic' | 'environmental' | 'reliability';
    remainingLife: number;
    decommissioningCost: number;
    replacementPlan: { option: string; cost: number; timeline: number }[];
    customerImpact: number;
    environmentalRemediation: { activity: string; cost: number }[];
    regulatoryApproval: boolean;
  };
  outcome: {
    approved: boolean;
    retirementDate?: Date;
    selectedReplacement?: string;
    totalCost: number;
    rateRecovery: { mechanism: string; amount: number }[];
    environmentalClearance: boolean;
    safetyReview: SafetyReviewResult;
  };
}

// ============================================================================
// UNION TYPE FOR ALL EXPANDED DECISIONS
// ============================================================================

export type ExpandedEnergyDecision =
  | GenerationDispatchDecision
  | OutagePlanningDecision
  | RenewableIntegrationDecision
  | DemandResponseDecision
  | TransmissionUpgradeDecision
  | FuelProcurementDecision
  | EnvironmentalComplianceDecision
  | AssetRetirementDecision;
