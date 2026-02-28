// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Insurance Decision Types - Expanded
 * 
 * Additional decision types beyond the core Underwriting, Claim, Fraud, Reinsurance.
 * Covers rate review, policy issuance, reserve estimation, catastrophe modeling,
 * subrogation, policy cancellation, premium audit, and coverage dispute.
 */

import { BaseDecision } from '../core/VerticalPattern.js';
import { FairnessAuditResult } from './InsuranceVertical.js';

// ============================================================================
// EXPANDED INSURANCE DECISION TYPES
// ============================================================================

export interface RateReviewDecision extends BaseDecision {
  type: 'rate-review';
  inputs: {
    lineOfBusiness: string;
    state: string;
    currentRate: number;
    proposedRate: number;
    changePercentage: number;
    actuarialJustification: string;
    lossExperience: {
      year: number;
      premiumEarned: number;
      lossesIncurred: number;
      lossRatio: number;
    }[];
    competitiveAnalysis: {
      competitor: string;
      rate: number;
      marketShare: number;
    }[];
    impactedPolicies: number;
  };
  outcome: {
    approved: boolean;
    approvedRate?: number;
    approvedChange?: number;
    conditions?: string[];
    regulatoryFilingRequired: boolean;
    effectiveDate?: Date;
    actuarialSignOff: boolean;
    fairnessAudit: FairnessAuditResult;
  };
}

export interface PolicyIssuanceDecision extends BaseDecision {
  type: 'policy-issuance';
  inputs: {
    applicationId: string;
    applicantId: string;
    lineOfBusiness: string;
    coverageRequested: {
      coverageType: string;
      limit: number;
      deductible: number;
    }[];
    underwritingResult: {
      decision: 'accept' | 'conditional-accept';
      riskClass: string;
      premium: number;
    };
    endorsements: { code: string; description: string; premium: number }[];
    effectiveDate: Date;
    expirationDate: Date;
  };
  outcome: {
    policyIssued: boolean;
    policyNumber?: string;
    totalPremium: number;
    paymentPlan: string;
    specialConditions?: string[];
    bindingAuthority: string;
    issuanceTimestamp: Date;
  };
}

export interface ReserveEstimationDecision extends BaseDecision {
  type: 'reserve-estimation';
  inputs: {
    evaluationDate: Date;
    lineOfBusiness: string;
    claimGroup: string;
    openClaims: number;
    currentReserve: number;
    paidToDate: number;
    actuarialMethods: {
      method: string;
      estimate: number;
      confidence: number;
    }[];
    developmentFactors: {
      age: number;
      factor: number;
    }[];
    ibnrEstimate: number;
  };
  outcome: {
    recommendedReserve: number;
    changeFromCurrent: number;
    selectedMethod: string;
    adequacyAssessment: 'adequate' | 'marginally-adequate' | 'inadequate' | 'redundant';
    managementAdjustment?: number;
    actuarialOpinion: string;
    boardApprovalRequired: boolean;
  };
}

export interface CatastropheModelingDecision extends BaseDecision {
  type: 'catastrophe-modeling';
  inputs: {
    peril: 'hurricane' | 'earthquake' | 'flood' | 'wildfire' | 'tornado' | 'cyber' | 'pandemic';
    region: string;
    exposedPolicies: number;
    totalInsuredValue: number;
    modelVendor: string;
    modelVersion: string;
    returnPeriods: {
      returnPeriod: number;
      grossLoss: number;
      netLoss: number;
    }[];
    reinsuranceProgram: {
      layerName: string;
      attachment: number;
      limit: number;
      rate: number;
    }[];
  };
  outcome: {
    pml100Year: number;
    pml250Year: number;
    tvl500Year: number;
    reinsuranceAdequacy: 'adequate' | 'marginal' | 'inadequate';
    capitalAtRisk: number;
    recommendedActions: string[];
    retentionStrategy: string;
    modelUncertainty: number;
  };
}

export interface SubrogationDecision extends BaseDecision {
  type: 'subrogation';
  inputs: {
    claimNumber: string;
    claimAmount: number;
    paidAmount: number;
    thirdPartyLiability: {
      partyName: string;
      liabilityPercentage: number;
      insurerName?: string;
      policyNumber?: string;
    }[];
    evidenceStrength: 'strong' | 'moderate' | 'weak';
    statueOfLimitations: Date;
    jurisdictionState: string;
    recoveryPotential: number;
  };
  outcome: {
    pursueSubrogation: boolean;
    estimatedRecovery: number;
    recoveryMethod: 'demand-letter' | 'arbitration' | 'litigation' | 'intercompany';
    assignedTo?: string;
    priority: 'high' | 'medium' | 'low';
    costBenefitRatio: number;
    deadline: Date;
  };
}

export interface PolicyCancellationDecision extends BaseDecision {
  type: 'policy-cancellation';
  inputs: {
    policyNumber: string;
    cancellationReason: 'nonpayment' | 'material-misrepresentation' | 'risk-change' | 'insured-request' | 'underwriting' | 'fraud';
    policyEffectiveDate: Date;
    requestedCancellationDate: Date;
    premiumEarned: number;
    premiumRefund: number;
    outstandingClaims: { claimNumber: string; status: string; reserve: number }[];
    noticeProvided: boolean;
    noticeDays: number;
    stateRequirements: {
      minimumNoticeDays: number;
      restrictedReasons: string[];
      regulatoryApprovalRequired: boolean;
    };
  };
  outcome: {
    cancellationApproved: boolean;
    effectiveDate: Date;
    refundAmount: number;
    refundMethod: 'pro-rata' | 'short-rate';
    noticeCompliant: boolean;
    regulatoryFilingRequired: boolean;
    claimsDisposition: string;
    alternativeOffered?: string;
  };
}

export interface PremiumAuditDecision extends BaseDecision {
  type: 'premium-audit';
  inputs: {
    policyNumber: string;
    auditPeriod: { start: Date; end: Date };
    estimatedPremium: number;
    auditType: 'physical' | 'voluntary' | 'telephone' | 'mail';
    exposureBasis: string;
    reportedExposures: { classCode: string; reported: number; audited: number; difference: number }[];
    experienceModification: number;
    scheduleCreditDebit: number;
  };
  outcome: {
    auditedPremium: number;
    premiumAdjustment: number;
    adjustmentDirection: 'additional' | 'return' | 'none';
    classCodeChanges: { oldCode: string; newCode: string; reason: string }[];
    disputeRisk: 'high' | 'medium' | 'low';
    collectionPlan?: string;
    auditAccepted: boolean;
  };
}

export interface CoverageDisputeDecision extends BaseDecision {
  type: 'coverage-dispute';
  inputs: {
    claimNumber: string;
    policyNumber: string;
    disputeType: 'coverage-denial' | 'coverage-limitation' | 'exclusion-application' | 'policy-interpretation' | 'late-notice';
    claimantPosition: string;
    insurerPosition: string;
    policyLanguage: string;
    precedentCases: { caseName: string; jurisdiction: string; outcome: string; relevance: number }[];
    regulatoryGuidance?: string;
    claimAmount: number;
  };
  outcome: {
    resolution: 'coverage-affirmed' | 'coverage-denied' | 'partial-coverage' | 'settlement' | 'escalate-to-litigation';
    coveredAmount?: number;
    rationale: string;
    reserveImpact: number;
    regulatoryReportable: boolean;
    precedentWeight: number;
    appealRisk: 'high' | 'medium' | 'low';
  };
}

export type ExpandedInsuranceDecision =
  | RateReviewDecision
  | PolicyIssuanceDecision
  | ReserveEstimationDecision
  | CatastropheModelingDecision
  | SubrogationDecision
  | PolicyCancellationDecision
  | PremiumAuditDecision
  | CoverageDisputeDecision;
