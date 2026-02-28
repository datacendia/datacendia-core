// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Government Vertical - Expanded Decision Types
 * 8 additional decision types (12 total)
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// ============================================================================
// DECISION TYPE 5: PERSONNEL ACTION
// ============================================================================

export interface PersonnelActionDecision extends BaseDecision {
  type: 'personnel-action';
  inputs: {
    actionId: string;
    actionType: 'hire' | 'promotion' | 'reassignment' | 'discipline' | 'termination' | 'security-clearance';
    employeeId?: string;
    positionTitle: string;
    gradeLevel: string;
    justification: string;
    meritSystemPrinciples: boolean;
    veteranPreference?: boolean;
    eeocCompliance: boolean;
    securityClearanceLevel?: 'confidential' | 'secret' | 'top-secret' | 'ts-sci';
    backgroundInvestigation: boolean;
  };
  outcome: {
    approved: boolean;
    effectiveDate?: Date;
    conditions: string[];
    hrReview: boolean;
    legalReview: boolean;
    securityReview?: boolean;
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 6: REGULATORY ACTION
// ============================================================================

export interface RegulatoryActionDecision extends BaseDecision {
  type: 'regulatory-action';
  inputs: {
    ruleId: string;
    ruleType: 'proposed-rule' | 'final-rule' | 'interim-final' | 'direct-final';
    cfr: string;
    regulatoryAgenda: boolean;
    economicAnalysis: { costs: number; benefits: number; netBenefit: number; uncertainties: string[] };
    smallBusinessImpact: boolean;
    environmentalImpact: boolean;
    publicCommentPeriod: number;
    commentsReceived: number;
    significantRule: boolean;
  };
  outcome: {
    approved: boolean;
    publicationDate?: Date;
    effectiveDate?: Date;
    oiraReview: boolean;
    modifications: string[];
    responseToBriefComments: string;
    regulatoryImpactAnalysis: boolean;
  };
}

// ============================================================================
// DECISION TYPE 7: IT INVESTMENT
// ============================================================================

export interface ITInvestmentDecision extends BaseDecision {
  type: 'it-investment';
  inputs: {
    investmentId: string;
    projectName: string;
    estimatedCost: number;
    lifecycle: 'development' | 'modernization' | 'steady-state' | 'disposition';
    businessCase: string;
    alternatives: { alternative: string; cost: number; benefits: string }[];
    cybersecurityRisk: 'low' | 'moderate' | 'high';
    fedrampRequired: boolean;
    cloudDeployment: boolean;
    performanceMetrics: { metric: string; baseline: number; target: number }[];
  };
  outcome: {
    approved: boolean;
    fundingAmount?: number;
    conditions: string[];
    cioReview: boolean;
    cybersecurityApproval: boolean;
    ato?: { level: 'low' | 'moderate' | 'high'; expiresAt: Date };
    milestones: { milestone: string; dueDate: Date }[];
  };
}

// ============================================================================
// DECISION TYPE 8: CONTRACT MODIFICATION
// ============================================================================

export interface ContractModificationDecision extends BaseDecision {
  type: 'contract-modification';
  inputs: {
    contractNumber: string;
    modificationNumber: number;
    modificationType: 'administrative' | 'supplemental-agreement' | 'change-order' | 'termination';
    description: string;
    costImpact: number;
    scheduleImpact: number;
    justification: string;
    contractorRequest: boolean;
    fundingAvailable: boolean;
  };
  outcome: {
    approved: boolean;
    approvedAmount?: number;
    effectiveDate?: Date;
    coApproval: boolean;
    legalReview: boolean;
    fundsCertified: boolean;
    denyReason?: string;
  };
}

// ============================================================================
// DECISION TYPE 9: FOIA REQUEST
// ============================================================================

export interface FOIARequestDecision extends BaseDecision {
  type: 'foia-request';
  inputs: {
    requestId: string;
    requester: string;
    requestDate: Date;
    requestDescription: string;
    recordsRequested: string[];
    feeCategory: 'commercial' | 'educational' | 'media' | 'other';
    expeditedProcessing: boolean;
    estimatedPages: number;
  };
  outcome: {
    disposition: 'full-grant' | 'partial-grant' | 'full-denial' | 'no-records';
    exemptionsApplied: string[];
    pagesReleased: number;
    pagesWithheld: number;
    estimatedFees: number;
    responseDate: Date;
    appealRights: string;
  };
}

// ============================================================================
// DECISION TYPE 10: IG AUDIT RESPONSE
// ============================================================================

export interface IGAuditResponseDecision extends BaseDecision {
  type: 'ig-audit-response';
  inputs: {
    auditId: string;
    auditTitle: string;
    findings: { findingNumber: string; description: string; severity: 'material-weakness' | 'significant-deficiency' | 'deficiency' }[];
    recommendations: { recNumber: string; recommendation: string; targetDate: Date }[];
    managementResponse: string;
    correctiveActionPlan: { action: string; responsible: string; dueDate: Date; status: string }[];
  };
  outcome: {
    responseApproved: boolean;
    concurrence: 'concur' | 'partially-concur' | 'non-concur';
    revisedTargetDates: { recNumber: string; newDate: Date; justification: string }[];
    additionalActions: string[];
    executiveReview: boolean;
  };
}

// ============================================================================
// DECISION TYPE 11: EMERGENCY DECLARATION
// ============================================================================

export interface EmergencyDeclarationDecision extends BaseDecision {
  type: 'emergency-declaration';
  inputs: {
    emergencyId: string;
    emergencyType: 'natural-disaster' | 'cyber-incident' | 'public-health' | 'national-security' | 'other';
    affectedArea: string;
    severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
    estimatedImpact: { casualties?: number; economicLoss: number; duration: number };
    requestedAuthorities: string[];
    legalBasis: string;
    presidentialDeclaration: boolean;
  };
  outcome: {
    declared: boolean;
    declarationLevel: 'agency' | 'department' | 'presidential';
    activatedAuthorities: string[];
    fundingAuthorized: number;
    duration: number;
    reportingRequirements: string[];
    congressNotification: boolean;
  };
}

// ============================================================================
// DECISION TYPE 12: INTERAGENCY AGREEMENT
// ============================================================================

export interface InteragencyAgreementDecision extends BaseDecision {
  type: 'interagency-agreement';
  inputs: {
    agreementId: string;
    agreementType: 'mou' | 'moa' | 'iaa' | 'isa';
    partnerAgency: string;
    purpose: string;
    scope: string;
    estimatedValue: number;
    duration: number;
    fundingMechanism: 'direct-cite' | 'reimbursable' | 'non-reimbursable';
    authorityBasis: string;
    resourcesRequired: { resource: string; quantity: number; cost: number }[];
  };
  outcome: {
    approved: boolean;
    signedDate?: Date;
    expirationDate?: Date;
    fundingCertified: boolean;
    legalReview: boolean;
    executiveApproval: boolean;
    reportingRequirements: string[];
    denyReason?: string;
  };
}

// ============================================================================
// UNION TYPE FOR ALL EXPANDED DECISIONS
// ============================================================================

export type ExpandedGovernmentDecision =
  | PersonnelActionDecision
  | RegulatoryActionDecision
  | ITInvestmentDecision
  | ContractModificationDecision
  | FOIARequestDecision
  | IGAuditResponseDecision
  | EmergencyDeclarationDecision
  | InteragencyAgreementDecision;
