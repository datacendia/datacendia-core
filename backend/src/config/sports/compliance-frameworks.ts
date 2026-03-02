/**
 * Configuration — Compliance Frameworks
 *
 * Application configuration and service initialization.
 *
 * @exports getFrameworkById, getFrameworksByRegion, getRequiredDocumentationForTransaction, UEFA_FFP, UEFA_CLUB_LICENSING, FIFA_AGENT_REGS, PREMIER_LEAGUE_PSR, EFL_PS
 * @module config/sports/compliance-frameworks
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Compliance Framework Mappings for Football/Soccer
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  governingBody: string;
  region: 'global' | 'europe' | 'uk' | 'spain' | 'germany' | 'france' | 'italy' | 'domestic';
  description: string;
  effectiveDate: string;
  requirements: ComplianceRequirement[];
  documentationRequirements: DocumentationRequirement[];
  auditFrequency: 'annual' | 'seasonal' | 'continuous' | 'on_demand';
  retentionYears: number;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'sporting' | 'legal' | 'infrastructure' | 'personnel' | 'administrative';
  evidenceTypes: string[];
  mandatory: boolean;
}

export interface DocumentationRequirement {
  id: string;
  name: string;
  description: string;
  frequency: 'per_transaction' | 'monthly' | 'quarterly' | 'annual' | 'seasonal';
  format: string[];
}

// =============================================================================
// UEFA FINANCIAL FAIR PLAY
// =============================================================================

export const UEFA_FFP: ComplianceFramework = {
  id: 'UEFA_FFP',
  name: 'UEFA Financial Fair Play Regulations',
  shortName: 'FFP',
  governingBody: 'UEFA',
  region: 'europe',
  description: 'UEFA regulations ensuring clubs operate within their means and promote sustainable football',
  effectiveDate: '2011-06-01',
  
  requirements: [
    {
      id: 'ffp-break-even',
      name: 'Break-even Requirement',
      description: 'Clubs must not have relevant expenses exceed relevant income by more than acceptable deviation',
      category: 'financial',
      evidenceTypes: ['financial_statements', 'transfer_records', 'wage_records'],
      mandatory: true,
    },
    {
      id: 'ffp-no-overdue',
      name: 'No Overdue Payables',
      description: 'Clubs must have no overdue payables towards other clubs, employees, or tax authorities',
      category: 'financial',
      evidenceTypes: ['payment_records', 'tax_certificates', 'creditor_confirmations'],
      mandatory: true,
    },
    {
      id: 'ffp-going-concern',
      name: 'Going Concern',
      description: 'Clubs must demonstrate ability to continue as going concern',
      category: 'financial',
      evidenceTypes: ['auditor_report', 'cash_flow_projections'],
      mandatory: true,
    },
    {
      id: 'ffp-related-party',
      name: 'Related Party Transactions',
      description: 'Related party transactions must be at fair value',
      category: 'financial',
      evidenceTypes: ['related_party_disclosure', 'fair_value_assessment', 'independent_valuation'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'ffp-doc-transfer',
      name: 'Transfer Documentation',
      description: 'Complete records of all transfer transactions',
      frequency: 'per_transaction',
      format: ['decision_record', 'contract', 'payment_evidence'],
    },
    {
      id: 'ffp-doc-wage',
      name: 'Wage Documentation',
      description: 'Records of all player and staff remuneration',
      frequency: 'monthly',
      format: ['payroll_records', 'contract_summaries'],
    },
    {
      id: 'ffp-doc-commercial',
      name: 'Commercial Agreement Documentation',
      description: 'All commercial and sponsorship agreements',
      frequency: 'per_transaction',
      format: ['contract', 'valuation_evidence', 'decision_record'],
    },
  ],
  
  auditFrequency: 'annual',
  retentionYears: 10,
};

// =============================================================================
// UEFA CLUB LICENSING
// =============================================================================

export const UEFA_CLUB_LICENSING: ComplianceFramework = {
  id: 'UEFA_CLUB_LICENSING',
  name: 'UEFA Club Licensing and Financial Sustainability Regulations',
  shortName: 'Club Licensing',
  governingBody: 'UEFA',
  region: 'europe',
  description: 'Regulations governing club eligibility for UEFA competitions',
  effectiveDate: '2022-06-01',
  
  requirements: [
    {
      id: 'ucl-sporting',
      name: 'Sporting Criteria',
      description: 'Youth development, medical, anti-doping requirements',
      category: 'sporting',
      evidenceTypes: ['youth_program_docs', 'medical_facilities', 'anti_doping_compliance'],
      mandatory: true,
    },
    {
      id: 'ucl-infrastructure',
      name: 'Infrastructure Criteria',
      description: 'Stadium and training facility requirements',
      category: 'infrastructure',
      evidenceTypes: ['stadium_certificate', 'facility_inspection'],
      mandatory: true,
    },
    {
      id: 'ucl-personnel',
      name: 'Personnel and Administrative Criteria',
      description: 'Required personnel and administrative structures',
      category: 'personnel',
      evidenceTypes: ['org_chart', 'staff_qualifications', 'governance_docs'],
      mandatory: true,
    },
    {
      id: 'ucl-legal',
      name: 'Legal Criteria',
      description: 'Legal entity requirements and ownership transparency',
      category: 'legal',
      evidenceTypes: ['registration_docs', 'ownership_disclosure'],
      mandatory: true,
    },
    {
      id: 'ucl-financial',
      name: 'Financial Criteria',
      description: 'Financial reporting and sustainability requirements',
      category: 'financial',
      evidenceTypes: ['audited_accounts', 'budget_projections', 'no_overdue_statement'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'ucl-doc-annual',
      name: 'Annual License Application',
      description: 'Complete licensing dossier',
      frequency: 'annual',
      format: ['license_application', 'supporting_evidence'],
    },
  ],
  
  auditFrequency: 'annual',
  retentionYears: 7,
};

// =============================================================================
// FIFA AGENT REGULATIONS
// =============================================================================

export const FIFA_AGENT_REGS: ComplianceFramework = {
  id: 'FIFA_AGENT_REGS',
  name: 'FIFA Football Agent Regulations',
  shortName: 'Agent Regs',
  governingBody: 'FIFA',
  region: 'global',
  description: 'FIFA regulations governing football agent activities and fees',
  effectiveDate: '2023-01-01',
  
  requirements: [
    {
      id: 'far-fee-caps',
      name: 'Service Fee Caps',
      description: 'Agent fees must not exceed regulatory caps (3%/6%/10% based on representation)',
      category: 'financial',
      evidenceTypes: ['agent_contract', 'fee_calculation', 'payment_records'],
      mandatory: true,
    },
    {
      id: 'far-disclosure',
      name: 'Fee Disclosure',
      description: 'All agent fees must be disclosed to FIFA via TMS',
      category: 'administrative',
      evidenceTypes: ['tms_submission', 'disclosure_form'],
      mandatory: true,
    },
    {
      id: 'far-no-dual',
      name: 'No Dual Representation Conflict',
      description: 'Agents cannot represent both buyer and seller without consent',
      category: 'legal',
      evidenceTypes: ['representation_agreement', 'conflict_disclosure'],
      mandatory: true,
    },
    {
      id: 'far-licensed',
      name: 'Licensed Agent Only',
      description: 'Clubs must only work with FIFA-licensed agents',
      category: 'legal',
      evidenceTypes: ['agent_license_verification'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'far-doc-engagement',
      name: 'Agent Engagement Documentation',
      description: 'Record of all agent engagements per transaction',
      frequency: 'per_transaction',
      format: ['engagement_letter', 'fee_agreement', 'payment_evidence'],
    },
  ],
  
  auditFrequency: 'on_demand',
  retentionYears: 10,
};

// =============================================================================
// PREMIER LEAGUE PSR
// =============================================================================

export const PREMIER_LEAGUE_PSR: ComplianceFramework = {
  id: 'PREMIER_LEAGUE_PSR',
  name: 'Premier League Profitability and Sustainability Rules',
  shortName: 'PL PSR',
  governingBody: 'Premier League',
  region: 'uk',
  description: 'Premier League regulations on club financial sustainability',
  effectiveDate: '2023-06-01',
  
  requirements: [
    {
      id: 'psr-loss-limit',
      name: 'Permitted Loss Threshold',
      description: 'Maximum permitted losses over rolling 3-year period (£105M)',
      category: 'financial',
      evidenceTypes: ['audited_accounts', 'psr_calculation', 'exclusion_evidence'],
      mandatory: true,
    },
    {
      id: 'psr-squad-cost',
      name: 'Squad Cost Ratio',
      description: 'Squad costs must not exceed percentage of revenue',
      category: 'financial',
      evidenceTypes: ['wage_records', 'revenue_records', 'ratio_calculation'],
      mandatory: true,
    },
    {
      id: 'psr-amortization',
      name: 'Transfer Amortization',
      description: 'Proper amortization of transfer fees',
      category: 'financial',
      evidenceTypes: ['transfer_records', 'amortization_schedule'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'psr-doc-submission',
      name: 'PSR Submission',
      description: 'Annual PSR compliance submission',
      frequency: 'annual',
      format: ['psr_return', 'audited_accounts', 'supporting_schedules'],
    },
  ],
  
  auditFrequency: 'annual',
  retentionYears: 7,
};

// =============================================================================
// EFL PROFITABILITY AND SUSTAINABILITY
// =============================================================================

export const EFL_PS: ComplianceFramework = {
  id: 'EFL_PS',
  name: 'EFL Profitability and Sustainability Regulations',
  shortName: 'EFL P&S',
  governingBody: 'English Football League',
  region: 'uk',
  description: 'EFL regulations on financial sustainability for Championship, League One, League Two',
  effectiveDate: '2023-06-01',
  
  requirements: [
    {
      id: 'efl-loss-limit',
      name: 'Permitted Loss Threshold',
      description: 'Maximum permitted losses (varies by division)',
      category: 'financial',
      evidenceTypes: ['audited_accounts', 'ps_calculation'],
      mandatory: true,
    },
    {
      id: 'efl-scmp',
      name: 'Salary Cost Management Protocol',
      description: 'Player wage costs as percentage of turnover',
      category: 'financial',
      evidenceTypes: ['wage_records', 'revenue_records'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'efl-doc-submission',
      name: 'P&S Submission',
      description: 'Annual submission to EFL',
      frequency: 'annual',
      format: ['ps_return', 'audited_accounts'],
    },
  ],
  
  auditFrequency: 'annual',
  retentionYears: 7,
};

// =============================================================================
// FA EPPP (YOUTH ACADEMY)
// =============================================================================

export const FA_EPPP: ComplianceFramework = {
  id: 'FA_EPPP',
  name: 'Elite Player Performance Plan',
  shortName: 'EPPP',
  governingBody: 'The FA / Premier League',
  region: 'uk',
  description: 'Regulations governing youth academy operations and player development',
  effectiveDate: '2012-07-01',
  
  requirements: [
    {
      id: 'eppp-category',
      name: 'Academy Category Compliance',
      description: 'Meeting requirements for academy category status',
      category: 'sporting',
      evidenceTypes: ['audit_report', 'facility_assessment', 'staffing_records'],
      mandatory: true,
    },
    {
      id: 'eppp-welfare',
      name: 'Player Welfare',
      description: 'Safeguarding and welfare requirements for young players',
      category: 'personnel',
      evidenceTypes: ['welfare_policy', 'safeguarding_records', 'dbs_checks'],
      mandatory: true,
    },
    {
      id: 'eppp-education',
      name: 'Education Integration',
      description: 'Education and vocational training requirements',
      category: 'administrative',
      evidenceTypes: ['education_plans', 'school_partnerships'],
      mandatory: true,
    },
    {
      id: 'eppp-compensation',
      name: 'Training Compensation',
      description: 'Proper documentation for training compensation',
      category: 'financial',
      evidenceTypes: ['compensation_agreements', 'tribunal_records'],
      mandatory: true,
    },
  ],
  
  documentationRequirements: [
    {
      id: 'eppp-doc-player',
      name: 'Player Documentation',
      description: 'Complete records for each academy player',
      frequency: 'per_transaction',
      format: ['registration', 'consent', 'education_plan', 'development_record'],
    },
  ],
  
  auditFrequency: 'annual',
  retentionYears: 15,
};

// =============================================================================
// FRAMEWORK REGISTRY
// =============================================================================

export const SPORTS_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  UEFA_FFP,
  UEFA_CLUB_LICENSING,
  FIFA_AGENT_REGS,
  PREMIER_LEAGUE_PSR,
  EFL_PS,
  FA_EPPP,
];

export function getFrameworkById(id: string): ComplianceFramework | undefined {
  return SPORTS_COMPLIANCE_FRAMEWORKS.find(f => f.id === id);
}

export function getFrameworksByRegion(region: ComplianceFramework['region']): ComplianceFramework[] {
  return SPORTS_COMPLIANCE_FRAMEWORKS.filter(f => f.region === region || f.region === 'global');
}

export function getRequiredDocumentationForTransaction(
  transactionType: 'transfer' | 'contract' | 'commercial' | 'youth',
  frameworkIds: string[]
): DocumentationRequirement[] {
  const docs: DocumentationRequirement[] = [];
  
  for (const fwId of frameworkIds) {
    const framework = getFrameworkById(fwId);
    if (framework) {
      docs.push(...framework.documentationRequirements.filter(d => d.frequency === 'per_transaction'));
    }
  }
  
  return docs;
}
