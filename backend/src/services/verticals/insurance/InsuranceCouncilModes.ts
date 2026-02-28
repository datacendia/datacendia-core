// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA INSURANCE COUNCIL MODES
 * 
 * 40+ specialized deliberation modes for the Insurance Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 * 
 * Regulatory Frameworks: State Insurance Laws, NAIC Model Laws, Unfair Claims Practices
 * Standards: ACORD, ISO, AAIS
 */

// =============================================================================
// TYPES
// =============================================================================

export type InsuranceModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'underwriting'    // Underwriting decision modes
  | 'claims'          // Claims processing modes
  | 'actuarial'       // Actuarial and pricing modes
  | 'compliance'      // Regulatory compliance modes
  | 'specialized';    // Specialized insurance modes

export interface InsuranceCouncilMode {
  id: string;
  name: string;
  category: InsuranceModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  regulatoryFrameworks: string[];
  fairnessTestRequired: boolean;
  auditTrailRequired: boolean;
  accordSchemaRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_INSURANCE_MODES: InsuranceCouncilMode[] = [
  {
    id: 'underwriting-committee',
    name: 'Underwriting Committee',
    category: 'major',
    purpose: 'Full underwriting committee for large/complex risks. Multi-factor risk assessment with fairness validation.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'Large commercial risks, unusual exposures, authority limit exceptions',
    defaultAgents: ['underwriting-ai', 'actuarial-engine', 'claims-processor', 'fraud-detector'],
    optionalAgents: ['reinsurance-specialist', 'loss-control-engineer', 'legal-counsel'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['State Rating Laws', 'NAIC Model Laws', 'Unfair Trade Practices'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Risk accurately assessed. Fairness validated. Pricing actuarially sound.',
    toneKeywords: ['risk-focused', 'fair', 'actuarially-sound', 'compliant'],
    outputFormat: ['risk_assessment', 'fairness_validation', 'pricing_recommendation', 'terms_conditions', 'approval_decision'],
  },
  {
    id: 'claims-review-board',
    name: 'Claims Review Board',
    category: 'major',
    purpose: 'Complex claims adjudication with coverage analysis. Large loss review, litigation management.',
    leadAgent: 'claims-processor',
    whenToUse: 'Large losses, coverage disputes, litigation, bad faith exposure',
    defaultAgents: ['claims-processor', 'fraud-detector', 'underwriting-ai', 'actuarial-engine'],
    optionalAgents: ['legal-counsel', 'subrogation-specialist', 'reinsurance-coordinator'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['Unfair Claims Practices', 'State Claims Handling', 'Bad Faith Laws'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Coverage accurately determined. Claim fairly handled. Exposure managed.',
    toneKeywords: ['coverage-focused', 'fair-handling', 'exposure-aware', 'documented'],
    outputFormat: ['coverage_analysis', 'liability_assessment', 'reserve_recommendation', 'handling_strategy', 'decision'],
  },
  {
    id: 'fraud-investigation-council',
    name: 'Fraud Investigation Council',
    category: 'major',
    purpose: 'SIU-level fraud investigation and referral decisions. Evidence analysis, prosecution referral.',
    leadAgent: 'fraud-detector',
    whenToUse: 'Suspected fraud, SIU referrals, prosecution decisions',
    defaultAgents: ['fraud-detector', 'claims-processor', 'underwriting-ai'],
    optionalAgents: ['siu-investigator', 'legal-counsel', 'data-analyst'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['State Fraud Reporting', 'NICB', 'Federal Insurance Fraud Laws'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Fraud indicators documented. Evidence preserved. Referral decision defensible.',
    toneKeywords: ['investigative', 'evidence-based', 'documented', 'defensible'],
    outputFormat: ['fraud_indicators', 'evidence_summary', 'investigation_findings', 'referral_recommendation'],
  },
  {
    id: 'catastrophe-response-council',
    name: 'Catastrophe Response Council',
    category: 'major',
    purpose: 'CAT event response coordination. Claims surge, vendor deployment, communication strategy.',
    leadAgent: 'claims-processor',
    whenToUse: 'Declared catastrophes, major events, claims surge',
    defaultAgents: ['claims-processor', 'actuarial-engine', 'underwriting-ai', 'fraud-detector'],
    optionalAgents: ['cat-coordinator', 'vendor-manager', 'communications-lead'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State CAT Response Requirements', 'DOI Emergency Orders'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Rapid response. Fair treatment. Consistent handling.',
    toneKeywords: ['rapid', 'coordinated', 'fair', 'consistent'],
    outputFormat: ['event_assessment', 'response_plan', 'resource_deployment', 'communication_strategy'],
  },
  {
    id: 'reinsurance-placement-council',
    name: 'Reinsurance Placement Council',
    category: 'major',
    purpose: 'Reinsurance treaty and facultative placement strategy. Capacity optimization, credit analysis.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Treaty renewals, facultative placements, capacity needs',
    defaultAgents: ['actuarial-engine', 'underwriting-ai', 'claims-processor'],
    optionalAgents: ['reinsurance-broker', 'credit-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NAIC Credit for Reinsurance', 'Collateral Requirements'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Capacity secured. Credit quality verified. Terms optimized.',
    toneKeywords: ['capacity', 'credit-quality', 'optimized', 'secured'],
    outputFormat: ['capacity_analysis', 'credit_review', 'placement_strategy', 'terms_comparison'],
  },
];

// =============================================================================
// UNDERWRITING MODES
// =============================================================================

export const UNDERWRITING_MODES: InsuranceCouncilMode[] = [
  {
    id: 'risk-selection',
    name: 'Risk Selection',
    category: 'underwriting',
    purpose: 'Individual risk selection with automated scoring and fairness checks.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'New business submissions, renewals, endorsements',
    defaultAgents: ['underwriting-ai', 'fraud-detector'],
    optionalAgents: ['actuarial-engine', 'loss-control-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State Rating Laws', 'Unfair Discrimination Prohibition'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Risk accurately scored. Fairness validated. Decision documented.',
    toneKeywords: ['risk-selection', 'fair', 'scored', 'documented'],
    outputFormat: ['risk_score', 'fairness_check', 'selection_decision', 'documentation'],
  },
  {
    id: 'pricing-review',
    name: 'Pricing Review',
    category: 'underwriting',
    purpose: 'Individual account pricing with rate adequacy and competitive analysis.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Schedule rating, experience rating, pricing exceptions',
    defaultAgents: ['actuarial-engine', 'underwriting-ai'],
    optionalAgents: ['competitive-analyst'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State Rating Laws', 'Rate Filing Requirements'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Rate adequate. Competitive. Properly documented.',
    toneKeywords: ['pricing', 'adequate', 'competitive', 'documented'],
    outputFormat: ['pricing_analysis', 'rate_components', 'competitive_position', 'approval'],
  },
  {
    id: 'loss-control-review',
    name: 'Loss Control Review',
    category: 'underwriting',
    purpose: 'Loss control inspection review and recommendation implementation.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'Post-inspection review, recommendation follow-up, risk improvement',
    defaultAgents: ['underwriting-ai', 'claims-processor'],
    optionalAgents: ['loss-control-engineer', 'risk-consultant'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['OSHA Standards', 'Fire Codes', 'Industry Best Practices'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Hazards identified. Recommendations actionable. Follow-up tracked.',
    toneKeywords: ['loss-control', 'hazard-focused', 'actionable', 'tracked'],
    outputFormat: ['inspection_summary', 'recommendations', 'action_plan', 'follow_up_schedule'],
  },
  {
    id: 'appetite-exception',
    name: 'Appetite Exception',
    category: 'underwriting',
    purpose: 'Out-of-appetite risk evaluation and exception approval.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'Outside guidelines, new class of business, unique exposures',
    defaultAgents: ['underwriting-ai', 'actuarial-engine', 'claims-processor'],
    optionalAgents: ['product-manager', 'reinsurance-coordinator'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Underwriting Guidelines', 'Reinsurance Treaties'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Exception justified. Risk mitigated. Authority documented.',
    toneKeywords: ['exception', 'justified', 'mitigated', 'authorized'],
    outputFormat: ['exception_request', 'risk_analysis', 'mitigation_plan', 'authority_approval'],
  },
];

// =============================================================================
// CLAIMS MODES
// =============================================================================

export const CLAIMS_MODES: InsuranceCouncilMode[] = [
  {
    id: 'coverage-determination',
    name: 'Coverage Determination',
    category: 'claims',
    purpose: 'Policy coverage analysis for complex claims. Exclusion review, conditions analysis.',
    leadAgent: 'claims-processor',
    whenToUse: 'Coverage questions, exclusion applicability, policy interpretation',
    defaultAgents: ['claims-processor', 'underwriting-ai'],
    optionalAgents: ['legal-counsel', 'coverage-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Unfair Claims Practices', 'State Case Law', 'Policy Forms'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Coverage accurately determined. Policyholder fairly treated. Decision documented.',
    toneKeywords: ['coverage', 'fair', 'documented', 'defensible'],
    outputFormat: ['coverage_analysis', 'policy_provisions', 'exclusion_review', 'determination'],
  },
  {
    id: 'reserve-setting',
    name: 'Reserve Setting',
    category: 'claims',
    purpose: 'Case reserve establishment and review. IBNR considerations, large loss reserves.',
    leadAgent: 'claims-processor',
    whenToUse: 'New claims, reserve changes, large losses, litigation',
    defaultAgents: ['claims-processor', 'actuarial-engine'],
    optionalAgents: ['legal-counsel', 'reinsurance-coordinator'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['SAP Reserve Requirements', 'State Reserve Regulations'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Reserves adequate. Basis documented. Changes explained.',
    toneKeywords: ['reserve', 'adequate', 'documented', 'explained'],
    outputFormat: ['reserve_analysis', 'reserve_recommendation', 'basis_documentation', 'approval'],
  },
  {
    id: 'subrogation-review',
    name: 'Subrogation Review',
    category: 'claims',
    purpose: 'Subrogation opportunity identification and pursuit strategy.',
    leadAgent: 'claims-processor',
    whenToUse: 'Third-party liability claims, recovery opportunities',
    defaultAgents: ['claims-processor', 'fraud-detector'],
    optionalAgents: ['subrogation-specialist', 'legal-counsel'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['Subrogation Rights', 'Made Whole Doctrine', 'State Laws'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Recovery opportunities identified. Pursuit cost-effective. Rights preserved.',
    toneKeywords: ['subrogation', 'recovery', 'cost-effective', 'timely'],
    outputFormat: ['liability_analysis', 'recovery_potential', 'pursuit_strategy', 'recommendation'],
  },
  {
    id: 'settlement-authority',
    name: 'Settlement Authority',
    category: 'claims',
    purpose: 'Settlement authority requests for claims exceeding adjuster authority.',
    leadAgent: 'claims-processor',
    whenToUse: 'Over-authority settlements, negotiated settlements, mediation',
    defaultAgents: ['claims-processor', 'actuarial-engine', 'fraud-detector'],
    optionalAgents: ['legal-counsel', 'claims-manager'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['Authority Guidelines', 'Settlement Best Practices'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Settlement fair. Authority proper. Documentation complete.',
    toneKeywords: ['settlement', 'authority', 'fair', 'documented'],
    outputFormat: ['claim_summary', 'settlement_analysis', 'authority_request', 'approval'],
  },
  {
    id: 'litigation-management',
    name: 'Litigation Management',
    category: 'claims',
    purpose: 'Litigated claim strategy and defense counsel management.',
    leadAgent: 'claims-processor',
    whenToUse: 'Lawsuits, attorney involvement, trial preparation',
    defaultAgents: ['claims-processor', 'actuarial-engine'],
    optionalAgents: ['legal-counsel', 'defense-counsel-manager'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Bad Faith Laws', 'Litigation Guidelines', 'Fee Arrangements'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Defense strategy sound. Costs controlled. Exposure managed.',
    toneKeywords: ['litigation', 'strategy', 'controlled', 'managed'],
    outputFormat: ['case_assessment', 'defense_strategy', 'budget_projection', 'recommendation'],
  },
];

// =============================================================================
// ACTUARIAL MODES
// =============================================================================

export const ACTUARIAL_MODES: InsuranceCouncilMode[] = [
  {
    id: 'rate-filing-review',
    name: 'Rate Filing Review',
    category: 'actuarial',
    purpose: 'Rate filing preparation and regulatory submission support.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Rate changes, new products, regulatory filings',
    defaultAgents: ['actuarial-engine', 'underwriting-ai'],
    optionalAgents: ['regulatory-specialist', 'product-manager'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['State Rate Filing Requirements', 'SERFF', 'Prior Approval States'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Rates actuarially sound. Filing complete. Approval likely.',
    toneKeywords: ['rate-filing', 'actuarial', 'compliant', 'supported'],
    outputFormat: ['rate_indication', 'filing_components', 'regulatory_support', 'approval_strategy'],
  },
  {
    id: 'loss-reserve-review',
    name: 'Loss Reserve Review',
    category: 'actuarial',
    purpose: 'Quarterly/annual loss reserve analysis. IBNR, development patterns, adequacy testing.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Quarterly reviews, annual statements, auditor requests',
    defaultAgents: ['actuarial-engine', 'claims-processor'],
    optionalAgents: ['external-actuary', 'audit-coordinator'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['SAP', 'Actuarial Standards of Practice', 'State Requirements'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Reserves adequate. Methods appropriate. Opinion supportable.',
    toneKeywords: ['reserves', 'adequate', 'methods', 'supportable'],
    outputFormat: ['reserve_analysis', 'development_triangles', 'adequacy_testing', 'opinion_support'],
  },
  {
    id: 'predictive-model-review',
    name: 'Predictive Model Review',
    category: 'actuarial',
    purpose: 'Predictive model validation and bias testing for pricing/underwriting.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'New models, model updates, regulatory inquiries',
    defaultAgents: ['actuarial-engine', 'underwriting-ai', 'fraud-detector'],
    optionalAgents: ['data-scientist', 'compliance-analyst'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['State AI/ML Regulations', 'Unfair Discrimination', 'Actuarial Standards'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Model validated. Bias tested. Regulatory requirements met.',
    toneKeywords: ['model', 'validated', 'fair', 'compliant'],
    outputFormat: ['model_documentation', 'validation_results', 'bias_testing', 'regulatory_compliance'],
  },
  {
    id: 'cat-modeling-review',
    name: 'CAT Modeling Review',
    category: 'actuarial',
    purpose: 'Catastrophe model evaluation and exposure management.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Annual CAT reviews, model updates, capacity planning',
    defaultAgents: ['actuarial-engine', 'underwriting-ai'],
    optionalAgents: ['cat-modeler', 'reinsurance-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NAIC Cat Model Guidelines', 'Rating Agency Requirements'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Exposure quantified. PML understood. Capacity adequate.',
    toneKeywords: ['cat-modeling', 'pml', 'exposure', 'capacity'],
    outputFormat: ['exposure_summary', 'pml_analysis', 'model_comparison', 'capacity_recommendation'],
  },
];

// =============================================================================
// COMPLIANCE MODES
// =============================================================================

export const COMPLIANCE_MODES: InsuranceCouncilMode[] = [
  {
    id: 'market-conduct-prep',
    name: 'Market Conduct Prep',
    category: 'compliance',
    purpose: 'Market conduct examination preparation and response.',
    leadAgent: 'claims-processor',
    whenToUse: 'Exam notifications, self-audits, remediation',
    defaultAgents: ['claims-processor', 'underwriting-ai', 'fraud-detector'],
    optionalAgents: ['compliance-officer', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NAIC Market Conduct', 'State Exam Procedures'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Practices compliant. Documentation ready. Gaps remediated.',
    toneKeywords: ['market-conduct', 'compliant', 'prepared', 'remediated'],
    outputFormat: ['exam_scope', 'documentation_review', 'gap_analysis', 'remediation_plan'],
  },
  {
    id: 'complaint-review',
    name: 'Complaint Review',
    category: 'compliance',
    purpose: 'DOI complaint analysis and response preparation.',
    leadAgent: 'claims-processor',
    whenToUse: 'DOI complaints, BBB escalations, complaint trends',
    defaultAgents: ['claims-processor', 'underwriting-ai'],
    optionalAgents: ['compliance-officer', 'legal-counsel'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State Complaint Handling', 'NAIC Complaint Database'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Root cause identified. Response timely. Remediation appropriate.',
    toneKeywords: ['complaint', 'root-cause', 'response', 'remediation'],
    outputFormat: ['complaint_analysis', 'root_cause', 'response_draft', 'remediation'],
  },
  {
    id: 'licensing-review',
    name: 'Licensing Review',
    category: 'compliance',
    purpose: 'Producer licensing and appointment compliance.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'New appointments, renewals, licensing audits',
    defaultAgents: ['underwriting-ai', 'claims-processor'],
    optionalAgents: ['licensing-coordinator', 'compliance-officer'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State Licensing Laws', 'NAIC Producer Model Act'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Licenses current. Appointments valid. Compliance verified.',
    toneKeywords: ['licensing', 'compliant', 'current', 'verified'],
    outputFormat: ['licensing_status', 'appointment_review', 'compliance_check', 'action_items'],
  },
  {
    id: 'form-filing-review',
    name: 'Form Filing Review',
    category: 'compliance',
    purpose: 'Policy form filing and approval tracking.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'New forms, form changes, regulatory filings',
    defaultAgents: ['underwriting-ai', 'claims-processor', 'actuarial-engine'],
    optionalAgents: ['product-manager', 'regulatory-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State Form Filing Requirements', 'SERFF', 'Readability Standards'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Forms compliant. Filing complete. Approval tracked.',
    toneKeywords: ['form-filing', 'compliant', 'readable', 'approved'],
    outputFormat: ['form_review', 'filing_checklist', 'regulatory_requirements', 'approval_status'],
  },
];

// =============================================================================
// SPECIALIZED INSURANCE MODES
// =============================================================================

export const SPECIALIZED_INSURANCE_MODES: InsuranceCouncilMode[] = [
  {
    id: 'cyber-risk-review',
    name: 'Cyber Risk Review',
    category: 'specialized',
    purpose: 'Cyber insurance underwriting and incident response. Security assessment, coverage adequacy.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'Cyber applications, security assessments, incident notification',
    defaultAgents: ['underwriting-ai', 'claims-processor', 'fraud-detector'],
    optionalAgents: ['cyber-specialist', 'security-consultant'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State Cyber Insurance Laws', 'Data Breach Notification', 'NAIC Cyber Model'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Security assessed. Coverage adequate. Response ready.',
    toneKeywords: ['cyber', 'security', 'coverage', 'incident-ready'],
    outputFormat: ['security_assessment', 'coverage_analysis', 'pricing_recommendation', 'response_protocol'],
  },
  {
    id: 'professional-liability-review',
    name: 'Professional Liability Review',
    category: 'specialized',
    purpose: 'Professional liability underwriting for E&O, D&O, professional classes.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'Professional liability applications, claims-made issues',
    defaultAgents: ['underwriting-ai', 'claims-processor', 'actuarial-engine'],
    optionalAgents: ['specialty-underwriter', 'legal-counsel'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Professional Liability Standards', 'Claims-Made Provisions'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Professional exposure assessed. Coverage terms appropriate. Retroactive date managed.',
    toneKeywords: ['professional-liability', 'claims-made', 'exposure', 'retroactive'],
    outputFormat: ['exposure_analysis', 'coverage_recommendation', 'pricing', 'terms_conditions'],
  },
  {
    id: 'workers-comp-review',
    name: 'Workers Comp Review',
    category: 'specialized',
    purpose: 'Workers compensation underwriting and claims management.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'WC applications, experience rating, return-to-work programs',
    defaultAgents: ['underwriting-ai', 'claims-processor', 'actuarial-engine'],
    optionalAgents: ['wc-specialist', 'medical-management'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['NCCI', 'State WC Laws', 'Experience Rating Plans'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Classification accurate. Experience rating correct. Return-to-work emphasized.',
    toneKeywords: ['workers-comp', 'classification', 'experience-rating', 'return-to-work'],
    outputFormat: ['classification_review', 'experience_mod', 'loss_control', 'pricing'],
  },
  {
    id: 'parametric-product-review',
    name: 'Parametric Product Review',
    category: 'specialized',
    purpose: 'Parametric insurance product evaluation. Index selection, basis risk, payout structure.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Parametric products, index triggers, basis risk assessment',
    defaultAgents: ['actuarial-engine', 'underwriting-ai', 'claims-processor'],
    optionalAgents: ['parametric-specialist', 'data-scientist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['State Parametric Regulations', 'Index Insurance Standards'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Index appropriate. Basis risk understood. Payout structure fair.',
    toneKeywords: ['parametric', 'index', 'basis-risk', 'transparent'],
    outputFormat: ['index_analysis', 'basis_risk_assessment', 'payout_structure', 'recommendation'],
  },
  {
    id: 'insurtech-partnership-review',
    name: 'Insurtech Partnership Review',
    category: 'specialized',
    purpose: 'Insurtech partnership evaluation. MGA agreements, API integrations, compliance.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'MGA partnerships, insurtech integrations, embedded insurance',
    defaultAgents: ['underwriting-ai', 'claims-processor', 'actuarial-engine', 'fraud-detector'],
    optionalAgents: ['legal-counsel', 'technology-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['MGA Model Act', 'TPM Guidelines', 'State Requirements'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Partnership compliant. Controls adequate. Integration secure.',
    toneKeywords: ['insurtech', 'partnership', 'compliant', 'integrated'],
    outputFormat: ['partnership_assessment', 'compliance_review', 'integration_requirements', 'recommendation'],
  },
  {
    id: 'climate-risk-review',
    name: 'Climate Risk Review',
    category: 'specialized',
    purpose: 'Climate risk assessment and disclosure. Physical risk, transition risk, TCFD alignment.',
    leadAgent: 'actuarial-engine',
    whenToUse: 'Climate scenario analysis, regulatory disclosure, portfolio assessment',
    defaultAgents: ['actuarial-engine', 'underwriting-ai', 'claims-processor'],
    optionalAgents: ['climate-specialist', 'sustainability-analyst'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NAIC Climate Risk Disclosure', 'TCFD', 'State Climate Requirements'],
    fairnessTestRequired: false,
    auditTrailRequired: true,
    accordSchemaRequired: false,
    primeDirective: 'Climate risk quantified. Scenarios analyzed. Disclosure ready.',
    toneKeywords: ['climate', 'tcfd', 'scenario', 'disclosure'],
    outputFormat: ['risk_assessment', 'scenario_analysis', 'disclosure_draft', 'action_plan'],
  },
  {
    id: 'telematics-review',
    name: 'Telematics Review',
    category: 'specialized',
    purpose: 'Telematics program evaluation. Data usage, pricing impact, privacy compliance.',
    leadAgent: 'underwriting-ai',
    whenToUse: 'UBI programs, telematics pricing, data partnerships',
    defaultAgents: ['underwriting-ai', 'actuarial-engine', 'fraud-detector'],
    optionalAgents: ['telematics-specialist', 'privacy-officer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State Telematics Laws', 'CCPA/Privacy Laws', 'Rating Regulations'],
    fairnessTestRequired: true,
    auditTrailRequired: true,
    accordSchemaRequired: true,
    primeDirective: 'Data used appropriately. Pricing actuarially sound. Privacy protected.',
    toneKeywords: ['telematics', 'ubi', 'privacy', 'actuarial'],
    outputFormat: ['program_assessment', 'data_usage_review', 'pricing_validation', 'privacy_compliance'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_INSURANCE_MODES: InsuranceCouncilMode[] = [
  ...MAJOR_INSURANCE_MODES,
  ...UNDERWRITING_MODES,
  ...CLAIMS_MODES,
  ...ACTUARIAL_MODES,
  ...COMPLIANCE_MODES,
  ...SPECIALIZED_INSURANCE_MODES,
];

export const INSURANCE_MODE_MAP: Map<string, InsuranceCouncilMode> = new Map(
  ALL_INSURANCE_MODES.map(mode => [mode.id, mode])
);

/**
 * Get an insurance mode by ID
 */
export function getInsuranceMode(modeId: string): InsuranceCouncilMode | undefined {
  return INSURANCE_MODE_MAP.get(modeId);
}

/**
 * Get all insurance modes by category
 */
export function getInsuranceModesByCategory(category: InsuranceModeCategory): InsuranceCouncilMode[] {
  return ALL_INSURANCE_MODES.filter(mode => mode.category === category);
}

/**
 * Get all insurance modes requiring fairness testing
 */
export function getFairnessModes(): InsuranceCouncilMode[] {
  return ALL_INSURANCE_MODES.filter(mode => mode.fairnessTestRequired);
}

/**
 * Get all insurance modes requiring ACORD schema
 */
export function getAccordModes(): InsuranceCouncilMode[] {
  return ALL_INSURANCE_MODES.filter(mode => mode.accordSchemaRequired);
}

/**
 * Get insurance modes by regulatory framework
 */
export function getInsuranceModesByFramework(framework: string): InsuranceCouncilMode[] {
  return ALL_INSURANCE_MODES.filter(mode => 
    mode.regulatoryFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

/**
 * Get insurance modes by lead agent
 */
export function getInsuranceModesByLeadAgent(leadAgent: string): InsuranceCouncilMode[] {
  return ALL_INSURANCE_MODES.filter(mode => mode.leadAgent === leadAgent);
}

// Summary stats
export const INSURANCE_MODES_SUMMARY = {
  totalModes: ALL_INSURANCE_MODES.length,
  majorModes: MAJOR_INSURANCE_MODES.length,
  underwritingModes: UNDERWRITING_MODES.length,
  claimsModes: CLAIMS_MODES.length,
  actuarialModes: ACTUARIAL_MODES.length,
  complianceModes: COMPLIANCE_MODES.length,
  specializedModes: SPECIALIZED_INSURANCE_MODES.length,
  fairnessModes: ALL_INSURANCE_MODES.filter(m => m.fairnessTestRequired).length,
  accordModes: ALL_INSURANCE_MODES.filter(m => m.accordSchemaRequired).length,
};
