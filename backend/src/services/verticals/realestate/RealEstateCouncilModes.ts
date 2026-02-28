// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA REAL ESTATE COUNCIL MODES
 *
 * Specialized deliberation modes for the Real Estate Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Standards: RESPA, TILA, ECOA, Fair Housing Act, USPAP, HMDA
 */

export type RealEstateModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'valuation'       // Appraisal and valuation
  | 'underwriting'    // Loan underwriting
  | 'compliance'      // Regulatory compliance
  | 'transaction'     // Transaction processing
  | 'specialized';    // Specialized real estate modes

export interface RealEstateCouncilMode {
  id: string;
  name: string;
  category: RealEstateModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  standards: string[];
  fairLendingGate: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_REAL_ESTATE_MODES: RealEstateCouncilMode[] = [
  {
    id: 'credit-committee',
    name: 'Credit Committee',
    category: 'major',
    purpose: 'Major lending decisions. Policy exceptions, large loans, complex transactions.',
    leadAgent: 'underwriting-manager',
    whenToUse: 'Policy exceptions, jumbo loans, complex structures, high-risk borrowers',
    defaultAgents: ['underwriting-manager', 'chief-appraiser', 'compliance-officer', 'market-analyst'],
    optionalAgents: ['legal-counsel', 'secondary-market-analyst'],
    maxDeliberationRounds: 10,
    standards: ['Underwriting Guidelines', 'Fair Lending', 'ECOA'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Make sound credit decisions. Document rationale. Ensure fairness.',
    toneKeywords: ['sound', 'fair', 'documented', 'risk-aware'],
    outputFormat: ['credit_analysis', 'risk_assessment', 'fair_lending_review', 'decision_rationale'],
  },
  {
    id: 'valuation-review-board',
    name: 'Valuation Review Board',
    category: 'major',
    purpose: 'Appraisal disputes and complex valuations. Reconsiderations of value, methodology disputes.',
    leadAgent: 'chief-appraiser',
    whenToUse: 'ROV requests, appraisal disputes, methodology questions, bias allegations',
    defaultAgents: ['chief-appraiser', 'market-analyst', 'compliance-officer', 'underwriting-manager'],
    optionalAgents: ['legal-counsel'],
    maxDeliberationRounds: 8,
    standards: ['USPAP', 'ECOA', 'Appraisal Independence'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Fair, unbiased valuations. Independence preserved. Methodology sound.',
    toneKeywords: ['independent', 'unbiased', 'methodology-sound', 'documented'],
    outputFormat: ['valuation_analysis', 'rov_response', 'methodology_review', 'bias_assessment'],
  },
  {
    id: 'fair-lending-council',
    name: 'Fair Lending Council',
    category: 'major',
    purpose: 'Fair lending review and remediation. HMDA analysis, pattern detection, corrective action.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Fair lending exams, HMDA review, discrimination allegations, pattern detection',
    defaultAgents: ['compliance-officer', 'underwriting-manager', 'chief-appraiser', 'legal-counsel'],
    optionalAgents: ['market-analyst'],
    maxDeliberationRounds: 10,
    standards: ['ECOA', 'Fair Housing Act', 'HMDA', 'CRA'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Detect and remediate fair lending issues. Protect all applicants.',
    toneKeywords: ['fair', 'protective', 'remedial', 'proactive'],
    outputFormat: ['fair_lending_analysis', 'pattern_review', 'corrective_action', 'monitoring_plan'],
  },
  {
    id: 'default-management-council',
    name: 'Default Management Council',
    category: 'major',
    purpose: 'Default and loss mitigation decisions. Workout strategies, foreclosure alternatives.',
    leadAgent: 'servicing-manager',
    whenToUse: 'Delinquent loans, workout decisions, foreclosure review, loss mitigation',
    defaultAgents: ['servicing-manager', 'underwriting-manager', 'compliance-officer', 'legal-counsel'],
    optionalAgents: ['chief-appraiser'],
    maxDeliberationRounds: 8,
    standards: ['CFPB Servicing Rules', 'Loss Mitigation Requirements', 'Fair Debt Collection'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Exhaust alternatives. Treat borrowers fairly. Minimize losses.',
    toneKeywords: ['fair', 'alternatives-exhausted', 'documented', 'compliant'],
    outputFormat: ['delinquency_analysis', 'workout_options', 'decision_rationale', 'compliance_review'],
  },
];

// =============================================================================
// VALUATION MODES
// =============================================================================

export const VALUATION_MODES: RealEstateCouncilMode[] = [
  {
    id: 'appraisal-review-council',
    name: 'Appraisal Review Council',
    category: 'valuation',
    purpose: 'Appraisal quality review. USPAP compliance, methodology verification, data accuracy.',
    leadAgent: 'chief-appraiser',
    whenToUse: 'Appraisal review, quality control, methodology questions',
    defaultAgents: ['chief-appraiser', 'market-analyst'],
    optionalAgents: ['compliance-officer'],
    maxDeliberationRounds: 5,
    standards: ['USPAP', 'Appraisal Review Standards'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Ensure appraisal quality. Verify methodology. Maintain independence.',
    toneKeywords: ['quality', 'compliant', 'independent', 'accurate'],
    outputFormat: ['review_findings', 'methodology_assessment', 'data_verification', 'compliance_status'],
  },
  {
    id: 'market-analysis-council',
    name: 'Market Analysis Council',
    category: 'valuation',
    purpose: 'Market condition assessment. Trend analysis, comparable selection, neighborhood factors.',
    leadAgent: 'market-analyst',
    whenToUse: 'Market assessments, trend analysis, comparable verification',
    defaultAgents: ['market-analyst', 'chief-appraiser'],
    optionalAgents: ['commercial-specialist'],
    maxDeliberationRounds: 5,
    standards: ['Market Analysis Standards', 'USPAP'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Accurate market analysis. Objective comparable selection. Fair neighborhood assessment.',
    toneKeywords: ['objective', 'data-driven', 'fair', 'current'],
    outputFormat: ['market_analysis', 'comparable_selection', 'trend_assessment', 'neighborhood_review'],
  },
  {
    id: 'commercial-valuation-council',
    name: 'Commercial Valuation Council',
    category: 'valuation',
    purpose: 'Commercial property valuation. Income analysis, cap rate selection, tenant quality.',
    leadAgent: 'commercial-specialist',
    whenToUse: 'Commercial appraisals, income property analysis, cap rate discussions',
    defaultAgents: ['commercial-specialist', 'chief-appraiser', 'market-analyst'],
    optionalAgents: ['underwriting-manager'],
    maxDeliberationRounds: 6,
    standards: ['USPAP', 'Commercial Valuation Standards'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Sound commercial valuations. Supportable cap rates. Thorough income analysis.',
    toneKeywords: ['income-focused', 'market-supported', 'thorough', 'defensible'],
    outputFormat: ['income_analysis', 'cap_rate_support', 'tenant_review', 'valuation_conclusion'],
  },
];

// =============================================================================
// UNDERWRITING MODES
// =============================================================================

export const UNDERWRITING_MODES: RealEstateCouncilMode[] = [
  {
    id: 'credit-review-council',
    name: 'Credit Review Council',
    category: 'underwriting',
    purpose: 'Borrower credit analysis. Credit history, capacity, collateral assessment.',
    leadAgent: 'underwriting-manager',
    whenToUse: 'Credit decisions, policy exceptions, complex borrower situations',
    defaultAgents: ['underwriting-manager', 'loan-processor', 'compliance-officer'],
    optionalAgents: ['chief-appraiser'],
    maxDeliberationRounds: 6,
    standards: ['Underwriting Guidelines', 'ECOA', 'Ability to Repay'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Sound credit decisions. Fair treatment. Complete documentation.',
    toneKeywords: ['sound', 'fair', 'documented', 'consistent'],
    outputFormat: ['credit_analysis', 'capacity_assessment', 'collateral_review', 'decision_recommendation'],
  },
  {
    id: 'condition-clearing-council',
    name: 'Condition Clearing Council',
    category: 'underwriting',
    purpose: 'Underwriting condition review and clearing. Document verification, condition satisfaction.',
    leadAgent: 'loan-processor',
    whenToUse: 'Condition review, document questions, clearing complex conditions',
    defaultAgents: ['loan-processor', 'underwriting-manager'],
    optionalAgents: ['compliance-officer', 'title-officer'],
    maxDeliberationRounds: 4,
    standards: ['Underwriting Guidelines', 'Documentation Requirements'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Verify conditions met. Maintain file integrity. Clear efficiently.',
    toneKeywords: ['verified', 'complete', 'efficient', 'compliant'],
    outputFormat: ['condition_status', 'verification_results', 'outstanding_items', 'clearing_decision'],
  },
  {
    id: 'construction-draw-council',
    name: 'Construction Draw Council',
    category: 'underwriting',
    purpose: 'Construction draw approval. Progress verification, budget tracking, completion assessment.',
    leadAgent: 'construction-analyst',
    whenToUse: 'Draw requests, construction progress, budget concerns, completion risk',
    defaultAgents: ['construction-analyst', 'underwriting-manager', 'property-inspector'],
    optionalAgents: ['chief-appraiser'],
    maxDeliberationRounds: 5,
    standards: ['Construction Lending Guidelines', 'Draw Management'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Verify progress. Manage budget. Protect collateral.',
    toneKeywords: ['verified', 'budget-aware', 'progress-tracked', 'protected'],
    outputFormat: ['progress_assessment', 'budget_status', 'draw_recommendation', 'completion_outlook'],
  },
];

// =============================================================================
// COMPLIANCE MODES
// =============================================================================

export const COMPLIANCE_REAL_ESTATE_MODES: RealEstateCouncilMode[] = [
  {
    id: 'respa-tila-review',
    name: 'RESPA/TILA Review Council',
    category: 'compliance',
    purpose: 'RESPA and TILA compliance review. Disclosure accuracy, fee tolerance, timing requirements.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Disclosure review, tolerance issues, compliance questions',
    defaultAgents: ['compliance-officer', 'loan-processor', 'closing-coordinator'],
    optionalAgents: ['legal-counsel'],
    maxDeliberationRounds: 5,
    standards: ['RESPA', 'TILA', 'TRID'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Accurate disclosures. Proper timing. Fee transparency.',
    toneKeywords: ['accurate', 'timely', 'transparent', 'compliant'],
    outputFormat: ['disclosure_review', 'tolerance_analysis', 'timing_verification', 'compliance_status'],
  },
  {
    id: 'hmda-review-council',
    name: 'HMDA Review Council',
    category: 'compliance',
    purpose: 'HMDA data quality and analysis. Reporting accuracy, pattern analysis, fair lending indicators.',
    leadAgent: 'compliance-officer',
    whenToUse: 'HMDA submission, data quality review, fair lending analysis',
    defaultAgents: ['compliance-officer', 'underwriting-manager'],
    optionalAgents: ['legal-counsel', 'market-analyst'],
    maxDeliberationRounds: 6,
    standards: ['HMDA', 'Regulation C', 'Fair Lending'],
    fairLendingGate: true,
    auditTrailRequired: true,
    primeDirective: 'Accurate HMDA data. Pattern awareness. Fair lending vigilance.',
    toneKeywords: ['accurate', 'pattern-aware', 'fair', 'vigilant'],
    outputFormat: ['data_quality_review', 'pattern_analysis', 'fair_lending_indicators', 'submission_readiness'],
  },
  {
    id: 'state-licensing-council',
    name: 'State Licensing Council',
    category: 'compliance',
    purpose: 'State licensing and regulatory compliance. MLO licensing, state-specific requirements.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Licensing renewals, state audits, new state entry',
    defaultAgents: ['compliance-officer', 'legal-counsel'],
    optionalAgents: ['underwriting-manager'],
    maxDeliberationRounds: 4,
    standards: ['SAFE Act', 'State Licensing Requirements'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Maintain licenses. Meet state requirements. Avoid unlicensed activity.',
    toneKeywords: ['licensed', 'compliant', 'state-aware', 'current'],
    outputFormat: ['licensing_status', 'state_requirements', 'compliance_gaps', 'remediation_plan'],
  },
];

// =============================================================================
// TRANSACTION MODES
// =============================================================================

export const TRANSACTION_MODES: RealEstateCouncilMode[] = [
  {
    id: 'closing-review-council',
    name: 'Closing Review Council',
    category: 'transaction',
    purpose: 'Pre-closing review and approval. Document completeness, fund verification, recording prep.',
    leadAgent: 'closing-coordinator',
    whenToUse: 'Pre-closing review, closing preparation, document verification',
    defaultAgents: ['closing-coordinator', 'title-officer', 'loan-processor'],
    optionalAgents: ['compliance-officer'],
    maxDeliberationRounds: 4,
    standards: ['Closing Procedures', 'Recording Requirements'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Complete files. Verified funds. Smooth closings.',
    toneKeywords: ['complete', 'verified', 'prepared', 'coordinated'],
    outputFormat: ['closing_checklist', 'fund_verification', 'document_status', 'closing_authorization'],
  },
  {
    id: 'title-review-council',
    name: 'Title Review Council',
    category: 'transaction',
    purpose: 'Title issues and resolution. Lien resolution, title defects, clearing requirements.',
    leadAgent: 'title-officer',
    whenToUse: 'Title issues, lien resolution, title defects, exception clearing',
    defaultAgents: ['title-officer', 'legal-counsel', 'closing-coordinator'],
    optionalAgents: ['underwriting-manager'],
    maxDeliberationRounds: 5,
    standards: ['Title Standards', 'Title Insurance Requirements'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Clear title. Resolve issues. Protect all parties.',
    toneKeywords: ['clear', 'resolved', 'protected', 'insurable'],
    outputFormat: ['title_status', 'issue_identification', 'resolution_plan', 'insurance_commitment'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_REAL_ESTATE_MODES: RealEstateCouncilMode[] = [
  {
    id: 'environmental-review-council',
    name: 'Environmental Review Council',
    category: 'specialized',
    purpose: 'Environmental risk assessment. Phase I findings, contamination risk, remediation needs.',
    leadAgent: 'environmental-specialist',
    whenToUse: 'Environmental concerns, Phase I findings, contamination issues',
    defaultAgents: ['environmental-specialist', 'underwriting-manager', 'legal-counsel'],
    optionalAgents: ['chief-appraiser'],
    maxDeliberationRounds: 6,
    standards: ['ASTM E1527', 'EPA Standards', 'Environmental Regulations'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Identify risks. Assess remediation. Protect collateral.',
    toneKeywords: ['risk-identified', 'assessed', 'protected', 'documented'],
    outputFormat: ['environmental_assessment', 'risk_analysis', 'remediation_requirements', 'lending_recommendation'],
  },
  {
    id: 'secondary-market-council',
    name: 'Secondary Market Council',
    category: 'specialized',
    purpose: 'Loan sale decisions. GSE eligibility, pricing, investor requirements, delivery.',
    leadAgent: 'secondary-market-analyst',
    whenToUse: 'Loan sales, GSE delivery, investor questions, pricing decisions',
    defaultAgents: ['secondary-market-analyst', 'underwriting-manager', 'compliance-officer'],
    optionalAgents: ['loan-processor'],
    maxDeliberationRounds: 5,
    standards: ['GSE Guidelines', 'Investor Requirements', 'Rep and Warrant'],
    fairLendingGate: false,
    auditTrailRequired: true,
    primeDirective: 'Saleable loans. Met requirements. Optimal pricing.',
    toneKeywords: ['saleable', 'compliant', 'priced', 'delivered'],
    outputFormat: ['eligibility_review', 'pricing_analysis', 'delivery_requirements', 'sale_recommendation'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_REAL_ESTATE_MODES: RealEstateCouncilMode[] = [
  ...MAJOR_REAL_ESTATE_MODES,
  ...VALUATION_MODES,
  ...UNDERWRITING_MODES,
  ...COMPLIANCE_REAL_ESTATE_MODES,
  ...TRANSACTION_MODES,
  ...SPECIALIZED_REAL_ESTATE_MODES,
];

export const REAL_ESTATE_MODE_MAP: Map<string, RealEstateCouncilMode> = new Map(
  ALL_REAL_ESTATE_MODES.map(mode => [mode.id, mode])
);

export function getRealEstateMode(modeId: string): RealEstateCouncilMode | undefined {
  return REAL_ESTATE_MODE_MAP.get(modeId);
}

export function getRealEstateModesByCategory(category: RealEstateModeCategory): RealEstateCouncilMode[] {
  return ALL_REAL_ESTATE_MODES.filter(mode => mode.category === category);
}

export const REAL_ESTATE_MODE_STATS = {
  total: ALL_REAL_ESTATE_MODES.length,
  byCategory: {
    major: MAJOR_REAL_ESTATE_MODES.length,
    valuation: VALUATION_MODES.length,
    underwriting: UNDERWRITING_MODES.length,
    compliance: COMPLIANCE_REAL_ESTATE_MODES.length,
    transaction: TRANSACTION_MODES.length,
    specialized: SPECIALIZED_REAL_ESTATE_MODES.length,
  },
};
