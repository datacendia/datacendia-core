/**
 * Configuration — Decision Templates
 *
 * Application configuration and service initialization.
 *
 * @exports getTemplateById, getTemplatesByCategory, TRANSFER_INBOUND_TEMPLATE, TRANSFER_OUTBOUND_TEMPLATE, TRANSFER_LOAN_TEMPLATE, CONTRACT_NEW_TEMPLATE, CONTRACT_RENEWAL_TEMPLATE, COMMERCIAL_SPONSORSHIP_TEMPLATE
 * @module config/sports/decision-templates
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Decision Templates for Football/Soccer Clubs
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

// =============================================================================
// TYPES
// =============================================================================

export interface DecisionTemplate {
  id: string;
  name: string;
  category: DecisionCategory;
  subcategory: string;
  description: string;
  requiredFields: TemplateField[];
  optionalFields: TemplateField[];
  approvalThresholds: ApprovalThreshold[];
  complianceFrameworks: string[];
  retentionYears: number;
  evidenceRequirements: EvidenceRequirement[];
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'select' | 'multiselect' | 'textarea' | 'file' | 'player' | 'club' | 'agent';
  description: string;
  options?: string[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: string;
}

export interface ApprovalThreshold {
  condition: string;
  approvers: string[];
  quorum?: number;
}

export interface EvidenceRequirement {
  type: string;
  description: string;
  mandatory: boolean;
}

export type DecisionCategory = 
  | 'transfer_inbound'
  | 'transfer_outbound'
  | 'transfer_loan'
  | 'contract_new'
  | 'contract_renewal'
  | 'contract_termination'
  | 'commercial_sponsorship'
  | 'commercial_partnership'
  | 'football_ops_manager'
  | 'football_ops_staff'
  | 'youth_academy'
  | 'infrastructure';

// =============================================================================
// TRANSFER TEMPLATES
// =============================================================================

export const TRANSFER_INBOUND_TEMPLATE: DecisionTemplate = {
  id: 'transfer-inbound-v1',
  name: 'Player Acquisition (Inbound Transfer)',
  category: 'transfer_inbound',
  subcategory: 'permanent',
  description: 'Decision record for acquiring a player from another club',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'player_dob',
      name: 'Date of Birth',
      type: 'date',
      description: 'Player date of birth',
    },
    {
      id: 'player_position',
      name: 'Position',
      type: 'select',
      description: 'Primary playing position',
      options: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
    },
    {
      id: 'selling_club',
      name: 'Selling Club',
      type: 'club',
      description: 'Club selling the player',
    },
    {
      id: 'transfer_fee',
      name: 'Transfer Fee',
      type: 'currency',
      description: 'Base transfer fee agreed',
      validation: { min: 0 },
    },
    {
      id: 'add_ons',
      name: 'Add-ons / Performance Bonuses',
      type: 'currency',
      description: 'Maximum additional payments based on performance',
      validation: { min: 0 },
    },
    {
      id: 'agent_involved',
      name: 'Agent(s) Involved',
      type: 'agent',
      description: 'Agent(s) representing player or facilitating deal',
    },
    {
      id: 'agent_fee',
      name: 'Agent Fee',
      type: 'currency',
      description: 'Total agent commission/fee',
      validation: { min: 0 },
    },
    {
      id: 'weekly_wage',
      name: 'Weekly Wage',
      type: 'currency',
      description: 'Agreed weekly salary',
    },
    {
      id: 'contract_length',
      name: 'Contract Length (Years)',
      type: 'number',
      description: 'Duration of contract in years',
      validation: { min: 1, max: 7 },
    },
    {
      id: 'scouting_summary',
      name: 'Scouting Assessment Summary',
      type: 'textarea',
      description: 'Summary of scouting department assessment',
    },
    {
      id: 'valuation_methodology',
      name: 'Valuation Methodology',
      type: 'textarea',
      description: 'How the valuation/fee was determined',
    },
  ],
  
  optionalFields: [
    {
      id: 'sell_on_percentage',
      name: 'Sell-on Clause (%)',
      type: 'number',
      description: 'Percentage of future sale owed to selling club',
      validation: { min: 0, max: 50 },
    },
    {
      id: 'buyback_clause',
      name: 'Buyback Clause',
      type: 'currency',
      description: 'Buyback option amount (if any)',
    },
    {
      id: 'release_clause',
      name: 'Release Clause',
      type: 'currency',
      description: 'Release clause in new contract',
    },
    {
      id: 'signing_bonus',
      name: 'Signing Bonus',
      type: 'currency',
      description: 'One-time signing bonus to player',
    },
    {
      id: 'loyalty_bonus',
      name: 'Loyalty Bonus',
      type: 'currency',
      description: 'Loyalty bonus over contract term',
    },
    {
      id: 'image_rights',
      name: 'Image Rights Arrangement',
      type: 'textarea',
      description: 'Details of image rights structure',
    },
    {
      id: 'alternatives_considered',
      name: 'Alternative Players Considered',
      type: 'textarea',
      description: 'Other players considered for this role',
    },
    {
      id: 'medical_notes',
      name: 'Medical Assessment Summary',
      type: 'textarea',
      description: 'Summary of pre-signing medical (non-confidential)',
    },
    {
      id: 'character_references',
      name: 'Character References',
      type: 'textarea',
      description: 'Summary of character/background checks',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'transfer_fee + agent_fee + (weekly_wage * 52 * contract_length) > 50000000',
      approvers: ['board'],
      quorum: 3,
    },
    {
      condition: 'transfer_fee + agent_fee + (weekly_wage * 52 * contract_length) > 20000000',
      approvers: ['ceo', 'cfo', 'sporting_director'],
      quorum: 2,
    },
    {
      condition: 'transfer_fee + agent_fee + (weekly_wage * 52 * contract_length) > 5000000',
      approvers: ['sporting_director', 'cfo'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['sporting_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'UEFA_CLUB_LICENSING', 'FIFA_AGENT_REGS', 'DOMESTIC_PSR'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'scouting_report', description: 'Detailed scouting report(s)', mandatory: true },
    { type: 'data_analysis', description: 'Statistical/data analysis', mandatory: true },
    { type: 'valuation_analysis', description: 'Market valuation analysis', mandatory: true },
    { type: 'agent_engagement', description: 'Agent engagement documentation', mandatory: true },
    { type: 'medical_report', description: 'Pre-signing medical report', mandatory: true },
    { type: 'board_minutes', description: 'Board approval minutes (if threshold met)', mandatory: false },
    { type: 'video_analysis', description: 'Video analysis summary', mandatory: false },
  ],
};

export const TRANSFER_OUTBOUND_TEMPLATE: DecisionTemplate = {
  id: 'transfer-outbound-v1',
  name: 'Player Sale (Outbound Transfer)',
  category: 'transfer_outbound',
  subcategory: 'permanent',
  description: 'Decision record for selling a player to another club',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'buying_club',
      name: 'Buying Club',
      type: 'club',
      description: 'Club purchasing the player',
    },
    {
      id: 'transfer_fee',
      name: 'Transfer Fee',
      type: 'currency',
      description: 'Base transfer fee agreed',
    },
    {
      id: 'add_ons',
      name: 'Add-ons Receivable',
      type: 'currency',
      description: 'Potential additional payments',
    },
    {
      id: 'sell_on_payable',
      name: 'Sell-on Payment Due',
      type: 'currency',
      description: 'Amount owed to previous club from sell-on clause',
    },
    {
      id: 'net_proceeds',
      name: 'Net Proceeds',
      type: 'currency',
      description: 'Net amount after sell-on and fees',
    },
    {
      id: 'book_value',
      name: 'Current Book Value',
      type: 'currency',
      description: 'Amortized value on balance sheet',
    },
    {
      id: 'valuation_rationale',
      name: 'Valuation Rationale',
      type: 'textarea',
      description: 'Justification for accepted fee',
    },
    {
      id: 'sale_rationale',
      name: 'Rationale for Sale',
      type: 'textarea',
      description: 'Why the club is selling this player',
    },
  ],
  
  optionalFields: [
    {
      id: 'buyback_clause',
      name: 'Buyback Clause Secured',
      type: 'currency',
      description: 'Buyback option secured (if any)',
    },
    {
      id: 'sell_on_secured',
      name: 'Sell-on Clause Secured (%)',
      type: 'number',
      description: 'Sell-on percentage secured on future sale',
    },
    {
      id: 'alternative_offers',
      name: 'Alternative Offers Received',
      type: 'textarea',
      description: 'Other offers considered',
    },
    {
      id: 'player_preference',
      name: 'Player Preference',
      type: 'textarea',
      description: 'Player preference and its impact on decision',
    },
    {
      id: 'contract_remaining',
      name: 'Contract Remaining',
      type: 'text',
      description: 'Time remaining on current contract',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'transfer_fee > 30000000',
      approvers: ['board'],
      quorum: 3,
    },
    {
      condition: 'transfer_fee > 10000000',
      approvers: ['ceo', 'sporting_director'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['sporting_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'UEFA_CLUB_LICENSING', 'DOMESTIC_PSR'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'valuation_analysis', description: 'Market valuation analysis', mandatory: true },
    { type: 'offer_documentation', description: 'Formal offer(s) received', mandatory: true },
    { type: 'player_consent', description: 'Evidence of player agreement', mandatory: true },
    { type: 'sell_on_calculation', description: 'Sell-on clause calculation', mandatory: false },
  ],
};

export const TRANSFER_LOAN_TEMPLATE: DecisionTemplate = {
  id: 'transfer-loan-v1',
  name: 'Player Loan',
  category: 'transfer_loan',
  subcategory: 'loan_out',
  description: 'Decision record for loaning a player to another club',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'loan_club',
      name: 'Loan Destination Club',
      type: 'club',
      description: 'Club receiving the player on loan',
    },
    {
      id: 'loan_duration',
      name: 'Loan Duration',
      type: 'text',
      description: 'Duration of loan (e.g., "6 months", "Season 2025/26")',
    },
    {
      id: 'loan_fee',
      name: 'Loan Fee',
      type: 'currency',
      description: 'Fee received for loan',
    },
    {
      id: 'wage_contribution',
      name: 'Wage Contribution',
      type: 'text',
      description: 'Wage split arrangement (e.g., "100% loan club", "50/50")',
    },
    {
      id: 'development_rationale',
      name: 'Development Rationale',
      type: 'textarea',
      description: 'How this loan benefits player development',
    },
  ],
  
  optionalFields: [
    {
      id: 'option_to_buy',
      name: 'Option to Buy',
      type: 'currency',
      description: 'Purchase option amount (if applicable)',
    },
    {
      id: 'obligation_to_buy',
      name: 'Obligation to Buy',
      type: 'currency',
      description: 'Purchase obligation amount and conditions',
    },
    {
      id: 'recall_clause',
      name: 'Recall Clause',
      type: 'text',
      description: 'Conditions under which player can be recalled',
    },
    {
      id: 'playing_time_clause',
      name: 'Playing Time Requirements',
      type: 'textarea',
      description: 'Minimum playing time stipulations',
    },
    {
      id: 'alternative_destinations',
      name: 'Alternative Loan Destinations',
      type: 'textarea',
      description: 'Other clubs considered for loan',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'option_to_buy > 20000000 OR obligation_to_buy > 0',
      approvers: ['sporting_director', 'ceo'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['sporting_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'FIFA_LOAN_REGS'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'development_plan', description: 'Player development plan', mandatory: true },
    { type: 'loan_club_assessment', description: 'Assessment of loan club suitability', mandatory: true },
    { type: 'player_consent', description: 'Player agreement to loan', mandatory: true },
  ],
};

// =============================================================================
// CONTRACT TEMPLATES
// =============================================================================

export const CONTRACT_NEW_TEMPLATE: DecisionTemplate = {
  id: 'contract-new-v1',
  name: 'New Player Contract',
  category: 'contract_new',
  subcategory: 'first_contract',
  description: 'Decision record for signing a new player contract (free agent or academy)',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'contract_type',
      name: 'Contract Type',
      type: 'select',
      description: 'Type of contract',
      options: ['Professional', 'Scholar', 'Youth', 'First Professional'],
    },
    {
      id: 'weekly_wage',
      name: 'Weekly Wage',
      type: 'currency',
      description: 'Agreed weekly salary',
    },
    {
      id: 'contract_length',
      name: 'Contract Length (Years)',
      type: 'number',
      description: 'Duration of contract',
      validation: { min: 1, max: 7 },
    },
    {
      id: 'total_value',
      name: 'Total Contract Value',
      type: 'currency',
      description: 'Total value including all guaranteed payments',
    },
    {
      id: 'wage_justification',
      name: 'Wage Justification',
      type: 'textarea',
      description: 'Rationale for wage level',
    },
  ],
  
  optionalFields: [
    {
      id: 'signing_bonus',
      name: 'Signing Bonus',
      type: 'currency',
      description: 'One-time signing payment',
    },
    {
      id: 'loyalty_bonus',
      name: 'Loyalty Bonus',
      type: 'currency',
      description: 'Loyalty bonus structure',
    },
    {
      id: 'performance_bonuses',
      name: 'Performance Bonuses',
      type: 'textarea',
      description: 'Performance-based bonus structure',
    },
    {
      id: 'release_clause',
      name: 'Release Clause',
      type: 'currency',
      description: 'Release clause amount',
    },
    {
      id: 'market_benchmarking',
      name: 'Market Benchmarking',
      type: 'textarea',
      description: 'Comparison to market rates',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'weekly_wage > 100000',
      approvers: ['board', 'ceo'],
      quorum: 2,
    },
    {
      condition: 'weekly_wage > 50000',
      approvers: ['ceo', 'sporting_director'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['sporting_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'EMPLOYMENT_LAW'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'wage_analysis', description: 'Wage benchmarking analysis', mandatory: true },
    { type: 'player_assessment', description: 'Current player assessment', mandatory: true },
  ],
};

export const CONTRACT_RENEWAL_TEMPLATE: DecisionTemplate = {
  id: 'contract-renewal-v1',
  name: 'Contract Renewal',
  category: 'contract_renewal',
  subcategory: 'renewal',
  description: 'Decision record for renewing an existing player contract',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'current_wage',
      name: 'Current Weekly Wage',
      type: 'currency',
      description: 'Existing weekly salary',
    },
    {
      id: 'new_wage',
      name: 'New Weekly Wage',
      type: 'currency',
      description: 'Proposed new weekly salary',
    },
    {
      id: 'wage_increase_percentage',
      name: 'Wage Increase (%)',
      type: 'number',
      description: 'Percentage increase',
    },
    {
      id: 'current_contract_expiry',
      name: 'Current Contract Expiry',
      type: 'date',
      description: 'When current contract expires',
    },
    {
      id: 'new_contract_length',
      name: 'New Contract Length (Years)',
      type: 'number',
      description: 'Duration of new contract',
    },
    {
      id: 'performance_assessment',
      name: 'Performance Assessment',
      type: 'textarea',
      description: 'Assessment of player performance',
    },
    {
      id: 'renewal_rationale',
      name: 'Renewal Rationale',
      type: 'textarea',
      description: 'Why the club is renewing this contract',
    },
  ],
  
  optionalFields: [
    {
      id: 'alternative_scenarios',
      name: 'Alternative Scenarios Considered',
      type: 'textarea',
      description: 'Other options considered (sell, let run down, etc.)',
    },
    {
      id: 'market_interest',
      name: 'Known Market Interest',
      type: 'textarea',
      description: 'Interest from other clubs',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'new_wage > 100000 OR wage_increase_percentage > 50',
      approvers: ['ceo', 'cfo', 'sporting_director'],
      quorum: 2,
    },
    {
      condition: 'new_wage > 50000',
      approvers: ['sporting_director', 'cfo'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['sporting_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'EMPLOYMENT_LAW'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'performance_data', description: 'Performance statistics', mandatory: true },
    { type: 'wage_benchmarking', description: 'Market wage comparison', mandatory: true },
    { type: 'valuation_analysis', description: 'Current player valuation', mandatory: false },
  ],
};

// =============================================================================
// COMMERCIAL TEMPLATES
// =============================================================================

export const COMMERCIAL_SPONSORSHIP_TEMPLATE: DecisionTemplate = {
  id: 'commercial-sponsorship-v1',
  name: 'Sponsorship Agreement',
  category: 'commercial_sponsorship',
  subcategory: 'sponsorship',
  description: 'Decision record for entering into a sponsorship agreement',
  
  requiredFields: [
    {
      id: 'sponsor_name',
      name: 'Sponsor Name',
      type: 'text',
      description: 'Name of sponsoring entity',
    },
    {
      id: 'sponsorship_type',
      name: 'Sponsorship Type',
      type: 'select',
      description: 'Category of sponsorship',
      options: ['Principal/Title', 'Kit Manufacturer', 'Sleeve', 'Training Wear', 'Stadium Naming', 'Official Partner', 'Regional Partner', 'Supplier'],
    },
    {
      id: 'annual_value',
      name: 'Annual Value',
      type: 'currency',
      description: 'Guaranteed annual payment',
    },
    {
      id: 'contract_term',
      name: 'Contract Term (Years)',
      type: 'number',
      description: 'Duration of agreement',
    },
    {
      id: 'total_value',
      name: 'Total Contract Value',
      type: 'currency',
      description: 'Total guaranteed value',
    },
    {
      id: 'brand_assessment',
      name: 'Brand Alignment Assessment',
      type: 'textarea',
      description: 'Assessment of brand fit and reputation risk',
    },
    {
      id: 'valuation_rationale',
      name: 'Valuation Rationale',
      type: 'textarea',
      description: 'How the deal value was determined',
    },
  ],
  
  optionalFields: [
    {
      id: 'performance_bonuses',
      name: 'Performance Bonuses',
      type: 'textarea',
      description: 'Additional payments based on performance',
    },
    {
      id: 'exclusivity_terms',
      name: 'Exclusivity Terms',
      type: 'textarea',
      description: 'Category exclusivity granted',
    },
    {
      id: 'alternative_sponsors',
      name: 'Alternative Sponsors Considered',
      type: 'textarea',
      description: 'Other sponsors approached or considered',
    },
    {
      id: 'termination_terms',
      name: 'Termination Terms',
      type: 'textarea',
      description: 'Break clauses and termination rights',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'total_value > 50000000',
      approvers: ['board'],
      quorum: 3,
    },
    {
      condition: 'total_value > 10000000',
      approvers: ['ceo', 'cfo'],
      quorum: 2,
    },
    {
      condition: 'default',
      approvers: ['commercial_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['UEFA_FFP', 'RELATED_PARTY_REGS'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'valuation_report', description: 'Independent valuation (for major deals)', mandatory: false },
    { type: 'brand_due_diligence', description: 'Brand/reputation due diligence', mandatory: true },
    { type: 'market_comparison', description: 'Comparable deal analysis', mandatory: true },
  ],
};

// =============================================================================
// FOOTBALL OPERATIONS TEMPLATES
// =============================================================================

export const MANAGER_APPOINTMENT_TEMPLATE: DecisionTemplate = {
  id: 'manager-appointment-v1',
  name: 'Manager/Head Coach Appointment',
  category: 'football_ops_manager',
  subcategory: 'appointment',
  description: 'Decision record for appointing a new manager or head coach',
  
  requiredFields: [
    {
      id: 'candidate_name',
      name: 'Candidate Name',
      type: 'text',
      description: 'Name of appointed manager',
    },
    {
      id: 'previous_role',
      name: 'Previous Role',
      type: 'text',
      description: 'Most recent managerial position',
    },
    {
      id: 'annual_salary',
      name: 'Annual Salary',
      type: 'currency',
      description: 'Agreed annual compensation',
    },
    {
      id: 'contract_length',
      name: 'Contract Length (Years)',
      type: 'number',
      description: 'Duration of contract',
    },
    {
      id: 'selection_rationale',
      name: 'Selection Rationale',
      type: 'textarea',
      description: 'Why this candidate was selected',
    },
    {
      id: 'performance_targets',
      name: 'Performance Targets',
      type: 'textarea',
      description: 'Key performance expectations',
    },
  ],
  
  optionalFields: [
    {
      id: 'compensation_paid',
      name: 'Compensation Paid to Previous Club',
      type: 'currency',
      description: 'Amount paid to release from previous contract',
    },
    {
      id: 'alternative_candidates',
      name: 'Other Candidates Considered',
      type: 'textarea',
      description: 'Other managers interviewed or considered',
    },
    {
      id: 'severance_terms',
      name: 'Severance Terms',
      type: 'textarea',
      description: 'Termination payment structure',
    },
    {
      id: 'backroom_staff',
      name: 'Backroom Staff Requirements',
      type: 'textarea',
      description: 'Additional staff appointments required',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'always',
      approvers: ['board'],
      quorum: 3,
    },
  ],
  
  complianceFrameworks: ['EMPLOYMENT_LAW', 'UEFA_CLUB_LICENSING'],
  retentionYears: 10,
  
  evidenceRequirements: [
    { type: 'interview_notes', description: 'Interview records', mandatory: true },
    { type: 'reference_checks', description: 'Reference checks completed', mandatory: true },
    { type: 'performance_analysis', description: 'Analysis of previous record', mandatory: true },
    { type: 'board_minutes', description: 'Board approval minutes', mandatory: true },
  ],
};

// =============================================================================
// YOUTH ACADEMY TEMPLATES
// =============================================================================

export const YOUTH_SCHOLARSHIP_TEMPLATE: DecisionTemplate = {
  id: 'youth-scholarship-v1',
  name: 'Youth Scholarship Offer',
  category: 'youth_academy',
  subcategory: 'scholarship',
  description: 'Decision record for offering a scholarship to a youth player',
  
  requiredFields: [
    {
      id: 'player_name',
      name: 'Player Name',
      type: 'text',
      description: 'Full name of the player',
    },
    {
      id: 'player_dob',
      name: 'Date of Birth',
      type: 'date',
      description: 'Player date of birth',
    },
    {
      id: 'current_age_group',
      name: 'Current Age Group',
      type: 'select',
      description: 'Current academy age group',
      options: ['U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U21', 'U23'],
    },
    {
      id: 'scholarship_type',
      name: 'Scholarship Type',
      type: 'select',
      description: 'Type of scholarship offered',
      options: ['Two-year Scholarship', 'One-year Scholarship', 'Extended Scholarship'],
    },
    {
      id: 'assessment_summary',
      name: 'Academy Assessment',
      type: 'textarea',
      description: 'Academy staff assessment of player potential',
    },
    {
      id: 'development_pathway',
      name: 'Development Pathway',
      type: 'textarea',
      description: 'Planned development trajectory',
    },
  ],
  
  optionalFields: [
    {
      id: 'education_plan',
      name: 'Education Plan',
      type: 'textarea',
      description: 'Academic/vocational education alongside football',
    },
    {
      id: 'welfare_considerations',
      name: 'Welfare Considerations',
      type: 'textarea',
      description: 'Any welfare or safeguarding notes',
    },
  ],
  
  approvalThresholds: [
    {
      condition: 'default',
      approvers: ['academy_director'],
      quorum: 1,
    },
  ],
  
  complianceFrameworks: ['FA_EPPP', 'SAFEGUARDING', 'EMPLOYMENT_LAW'],
  retentionYears: 15,
  
  evidenceRequirements: [
    { type: 'player_assessment', description: 'Detailed player assessment', mandatory: true },
    { type: 'education_plan', description: 'Education and welfare plan', mandatory: true },
    { type: 'parent_consent', description: 'Parental consent documentation', mandatory: true },
  ],
};

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================

export const SPORTS_DECISION_TEMPLATES: DecisionTemplate[] = [
  TRANSFER_INBOUND_TEMPLATE,
  TRANSFER_OUTBOUND_TEMPLATE,
  TRANSFER_LOAN_TEMPLATE,
  CONTRACT_NEW_TEMPLATE,
  CONTRACT_RENEWAL_TEMPLATE,
  COMMERCIAL_SPONSORSHIP_TEMPLATE,
  MANAGER_APPOINTMENT_TEMPLATE,
  YOUTH_SCHOLARSHIP_TEMPLATE,
];

export function getTemplateById(id: string): DecisionTemplate | undefined {
  return SPORTS_DECISION_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: DecisionCategory): DecisionTemplate[] {
  return SPORTS_DECISION_TEMPLATES.filter(t => t.category === category);
}
