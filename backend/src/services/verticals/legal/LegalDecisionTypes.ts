// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Legal Vertical - Decision Types
 * 12 legal decision types following 6-layer VerticalPattern
 */

import { BaseDecision } from '../core/VerticalPattern.js';

// ============================================================================
// LEGAL-SPECIFIC TYPES
// ============================================================================

export type MatterType = 
  | 'litigation'
  | 'transactional'
  | 'regulatory'
  | 'advisory'
  | 'investigation'
  | 'ip'
  | 'employment'
  | 'real-estate';

export type PrivilegeLevel = 
  | 'attorney-client'
  | 'work-product'
  | 'common-interest'
  | 'confidential'
  | 'public';

export interface MatterContext {
  matterId: string;
  matterNumber: string;
  clientId: string;
  matterType: MatterType;
  practiceArea: string;
  responsibleAttorney: string;
  privilegeLevel: PrivilegeLevel;
  conflictsCleared: boolean;
}

// ============================================================================
// DECISION TYPE 1: CONTRACT REVIEW
// ============================================================================

export interface ContractReviewDecision extends BaseDecision {
  type: 'contract-review';
  inputs: {
    matter: MatterContext;
    contractType: 'purchase' | 'sale' | 'service' | 'employment' | 'nda' | 'license' | 'lease' | 'partnership';
    counterparty: string;
    contractValue: number;
    jurisdiction: string;
    governingLaw: string;
    keyTerms: { term: string; provision: string; risk: 'low' | 'medium' | 'high' }[];
    redFlags: string[];
    priorDealings: boolean;
    urgency: 'routine' | 'expedited' | 'emergency';
  };
  outcome: {
    approved: boolean;
    redlines: { section: string; original: string; proposed: string; rationale: string }[];
    riskAssessment: { risk: string; severity: 'low' | 'medium' | 'high' | 'critical'; mitigation: string }[];
    recommendedChanges: string[];
    dealBreakers: string[];
    clientAdvice: string;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 2: LITIGATION STRATEGY
// ============================================================================

export interface LitigationStrategyDecision extends BaseDecision {
  type: 'litigation-strategy';
  inputs: {
    matter: MatterContext;
    caseStage: 'pre-filing' | 'pleadings' | 'discovery' | 'motions' | 'trial-prep' | 'trial' | 'appeal';
    claims: { claim: string; strength: number; damages: number }[];
    defenses: { defense: string; viability: number }[];
    evidence: { type: string; strength: 'strong' | 'moderate' | 'weak'; admissibility: 'likely' | 'uncertain' | 'unlikely' }[];
    opposingCounsel: string;
    venue: string;
    judge?: string;
    settlementDemand?: number;
    trialBudget: number;
  };
  outcome: {
    recommendedStrategy: 'aggressive-litigation' | 'settlement-focused' | 'motion-to-dismiss' | 'summary-judgment' | 'alternative-dispute-resolution';
    motionsToFile: { motion: string; timing: string; probability: number }[];
    discoveryPlan: { request: string; priority: number }[];
    settlementRange: { low: number; high: number; recommended: number };
    trialTheme: string;
    keyWitnesses: string[];
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 3: SETTLEMENT APPROVAL
// ============================================================================

export interface SettlementApprovalDecision extends BaseDecision {
  type: 'settlement-approval';
  inputs: {
    matter: MatterContext;
    settlementAmount: number;
    settlementTerms: string[];
    confidentialityClause: boolean;
    releaseScope: 'narrow' | 'broad' | 'mutual';
    clientApproval: boolean;
    insuranceCoverage: number;
    trialRisk: { winProbability: number; expectedVerdict: number; trialCost: number };
    appealRisk: number;
    reputationalImpact: 'positive' | 'neutral' | 'negative';
  };
  outcome: {
    approved: boolean;
    recommendation: 'accept' | 'counter-offer' | 'reject' | 'mediation';
    counterOfferAmount?: number;
    conditions: string[];
    clientCounsel: string;
    boardApprovalRequired: boolean;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 4: PRIVILEGE DETERMINATION
// ============================================================================

export interface PrivilegeDeterminationDecision extends BaseDecision {
  type: 'privilege-determination';
  inputs: {
    matter: MatterContext;
    documentId: string;
    documentType: string;
    author: string;
    recipients: string[];
    dateCreated: Date;
    subject: string;
    contentSummary: string;
    attorneyInvolved: boolean;
    legalAdviceSought: boolean;
    businessPurpose: boolean;
    thirdPartyDisclosure: boolean;
  };
  outcome: {
    privilegeLevel: PrivilegeLevel;
    privilegeType: 'attorney-client' | 'work-product' | 'both' | 'none';
    producible: boolean;
    redactionRequired: boolean;
    redactionGuidance?: string;
    privilegeLogEntry: string;
    reviewedBy: string;
    reviewedAt: Date;
  };
}

// ============================================================================
// DECISION TYPE 5: EDISCOVERY PRODUCTION
// ============================================================================

export interface EDiscoveryProductionDecision extends BaseDecision {
  type: 'ediscovery-production';
  inputs: {
    matter: MatterContext;
    productionRequest: string;
    custodians: string[];
    dateRange: { start: Date; end: Date };
    searchTerms: string[];
    estimatedDocuments: number;
    privilegeReviewComplete: boolean;
    responsiveDocuments: number;
    privilegedDocuments: number;
    productionDeadline: Date;
  };
  outcome: {
    approved: boolean;
    documentsToProduct: number;
    privilegeLog: { documentId: string; basis: string }[];
    redactions: { documentId: string; reason: string }[];
    productionFormat: 'native' | 'tiff' | 'pdf';
    loadFile: boolean;
    certificationRequired: boolean;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 6: REGULATORY RESPONSE
// ============================================================================

export interface RegulatoryResponseDecision extends BaseDecision {
  type: 'regulatory-response';
  inputs: {
    matter: MatterContext;
    regulator: 'SEC' | 'DOJ' | 'FTC' | 'State-AG' | 'EPA' | 'OSHA' | 'Other';
    inquiryType: 'subpoena' | 'cid' | 'information-request' | 'investigation' | 'audit';
    subject: string;
    responseDeadline: Date;
    voluntaryDisclosure: boolean;
    potentialViolations: string[];
    internalInvestigationComplete: boolean;
    privilegeIssues: boolean;
  };
  outcome: {
    responseStrategy: 'full-cooperation' | 'limited-cooperation' | 'assert-privilege' | 'negotiate-scope';
    documentsToProduct: number;
    privilegeAssertions: string[];
    narrativeResponse: boolean;
    counselPresent: boolean;
    extensionRequested: boolean;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 7: M&A DUE DILIGENCE
// ============================================================================

export interface MADueDiligenceDecision extends BaseDecision {
  type: 'ma-due-diligence';
  inputs: {
    matter: MatterContext;
    transactionType: 'acquisition' | 'merger' | 'asset-purchase' | 'stock-purchase';
    targetCompany: string;
    transactionValue: number;
    dueDiligenceScope: string[];
    dataRoom: { documents: number; reviewed: number };
    redFlags: { category: string; description: string; severity: 'low' | 'medium' | 'high' | 'deal-breaker' }[];
    hsrFiling: boolean;
    foreignInvestment: boolean;
  };
  outcome: {
    recommendation: 'proceed' | 'proceed-with-conditions' | 'renegotiate' | 'walk-away';
    materialIssues: { issue: string; impact: number; mitigation: string }[];
    representationsRequired: string[];
    indemnificationScope: string[];
    escrowRecommendation: number;
    closingConditions: string[];
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 8: EMPLOYMENT DISPUTE
// ============================================================================

export interface EmploymentDisputeDecision extends BaseDecision {
  type: 'employment-dispute';
  inputs: {
    matter: MatterContext;
    disputeType: 'discrimination' | 'harassment' | 'wrongful-termination' | 'wage-hour' | 'retaliation' | 'disability';
    employee: { name: string; title: string; tenure: number; protectedClass?: string };
    allegations: string[];
    evidence: { type: string; strength: 'strong' | 'moderate' | 'weak' }[];
    internalInvestigation: boolean;
    eeocCharge: boolean;
    stateClaim: boolean;
  };
  outcome: {
    recommendation: 'settle' | 'litigate' | 'mediate' | 'arbitrate';
    liabilityAssessment: { claim: string; probability: number; exposure: number }[];
    settlementRange: { low: number; high: number };
    defensiveStrategy: string[];
    policyChanges: string[];
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 9: IP PROTECTION
// ============================================================================

export interface IPProtectionDecision extends BaseDecision {
  type: 'ip-protection';
  inputs: {
    matter: MatterContext;
    ipType: 'patent' | 'trademark' | 'copyright' | 'trade-secret';
    asset: string;
    description: string;
    protectionStrategy: 'file-application' | 'maintain-secret' | 'defensive-publication' | 'license';
    priorArt?: string[];
    competitorActivity: string[];
    commercialValue: number;
    disclosureRisk: 'low' | 'medium' | 'high';
  };
  outcome: {
    approved: boolean;
    recommendedProtection: string[];
    filingStrategy?: { jurisdiction: string; timing: string; claims: string[] };
    tradeSecretMeasures?: string[];
    enforcementPlan: string[];
    estimatedCost: number;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 10: DATA PRIVACY COMPLIANCE
// ============================================================================

export interface DataPrivacyComplianceDecision extends BaseDecision {
  type: 'data-privacy-compliance';
  inputs: {
    matter: MatterContext;
    dataType: 'personal' | 'sensitive' | 'financial' | 'health' | 'biometric';
    dataSubjects: number;
    jurisdictions: string[];
    processingPurpose: string;
    legalBasis: string;
    thirdPartySharing: boolean;
    retentionPeriod: number;
    securityMeasures: string[];
    breachRisk: 'low' | 'medium' | 'high';
  };
  outcome: {
    compliant: boolean;
    applicableRegulations: string[];
    requiredNotices: string[];
    consentMechanism: string;
    dataProtectionMeasures: string[];
    breachResponsePlan: boolean;
    dpoReview: boolean;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 11: CONFLICT CHECK
// ============================================================================

export interface ConflictCheckDecision extends BaseDecision {
  type: 'conflict-check';
  inputs: {
    matter: MatterContext;
    proposedClient: string;
    opposingParties: string[];
    relatedEntities: string[];
    practiceArea: string;
    conflictSearchResults: { entity: string; relationship: string; matterIds: string[] }[];
    waiverPossible: boolean;
    screeningAvailable: boolean;
  };
  outcome: {
    cleared: boolean;
    conflicts: { type: 'current-client' | 'former-client' | 'imputed' | 'personal'; entity: string; severity: 'waivable' | 'non-waivable' }[];
    waiverRequired: boolean;
    waiverObtained?: boolean;
    screeningRequired: boolean;
    ethicsOpinionRequired: boolean;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// DECISION TYPE 12: EXPERT ENGAGEMENT
// ============================================================================

export interface ExpertEngagementDecision extends BaseDecision {
  type: 'expert-engagement';
  inputs: {
    matter: MatterContext;
    expertType: 'technical' | 'economic' | 'medical' | 'forensic' | 'industry' | 'damages';
    expertise: string;
    proposedExpert: { name: string; credentials: string[]; priorTestimony: number; daubert: boolean };
    scope: string;
    estimatedFees: number;
    disclosureDeadline: Date;
    opposingExpert?: string;
    conflictCheck: boolean;
  };
  outcome: {
    approved: boolean;
    engagementTerms: string[];
    retentionAgreement: boolean;
    workProductProtection: boolean;
    disclosureStrategy: 'testifying' | 'consulting-only';
    budgetApproved: number;
    privilegeProtected: boolean;
  };
}

// ============================================================================
// UNION TYPE FOR ALL LEGAL DECISIONS
// ============================================================================

export type LegalDecision =
  | ContractReviewDecision
  | LitigationStrategyDecision
  | SettlementApprovalDecision
  | PrivilegeDeterminationDecision
  | EDiscoveryProductionDecision
  | RegulatoryResponseDecision
  | MADueDiligenceDecision
  | EmploymentDisputeDecision
  | IPProtectionDecision
  | DataPrivacyComplianceDecision
  | ConflictCheckDecision
  | ExpertEngagementDecision;
