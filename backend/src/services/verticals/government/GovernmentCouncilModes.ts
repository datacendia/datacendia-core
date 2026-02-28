// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA GOVERNMENT COUNCIL MODES
 *
 * Specialized deliberation modes for the Government/Public Sector Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Regulatory Frameworks: FAR/DFARS, FISMA, OMB Circulars, GPRA, APA
 */

export type GovernmentModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'procurement'     // Acquisition and contracting
  | 'policy'          // Policy development
  | 'compliance'      // Regulatory compliance
  | 'operations'      // Program operations
  | 'specialized';    // Specialized government modes

export interface GovernmentCouncilMode {
  id: string;
  name: string;
  category: GovernmentModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  regulatoryFrameworks: string[];
  securityLevel: 'public' | 'sensitive' | 'classified';
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_GOVERNMENT_MODES: GovernmentCouncilMode[] = [
  {
    id: 'source-selection-council',
    name: 'Source Selection Council',
    category: 'major',
    purpose: 'Full source selection evaluation for major acquisitions. Multi-factor evaluation per FAR Part 15 with best value determination.',
    leadAgent: 'procurement-officer',
    whenToUse: 'Major acquisitions over $10M, competitive procurements, best value selections',
    defaultAgents: ['procurement-officer', 'legal-counsel', 'program-manager', 'budget-analyst'],
    optionalAgents: ['it-security-officer', 'compliance-officer'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['FAR Part 15', 'DFARS', 'Competition in Contracting Act'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Evaluate per stated criteria. Document rationale. Ensure fair competition.',
    toneKeywords: ['far-compliant', 'best-value', 'documented', 'competitive'],
    outputFormat: ['evaluation_report', 'scoring_matrix', 'price_analysis', 'selection_decision', 'rationale'],
  },
  {
    id: 'budget-review-council',
    name: 'Budget Review Council',
    category: 'major',
    purpose: 'Annual budget formulation and justification. OMB submission preparation with program performance linkage.',
    leadAgent: 'budget-analyst',
    whenToUse: 'Annual budget cycle, supplemental requests, continuing resolution planning',
    defaultAgents: ['budget-analyst', 'program-manager', 'policy-analyst', 'compliance-officer'],
    optionalAgents: ['communications-director', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['OMB Circular A-11', 'GPRA Modernization Act', 'Budget Control Act'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Justify investments with outcomes. Align with strategic priorities. Document trade-offs.',
    toneKeywords: ['justified', 'outcome-focused', 'strategic', 'fiscally-responsible'],
    outputFormat: ['budget_justification', 'performance_linkage', 'trade_off_analysis', 'spend_plan'],
  },
  {
    id: 'policy-development-council',
    name: 'Policy Development Council',
    category: 'major',
    purpose: 'Major policy development with stakeholder analysis. Regulatory impact assessment and public comment response.',
    leadAgent: 'policy-analyst',
    whenToUse: 'New regulations, policy changes, executive orders implementation',
    defaultAgents: ['policy-analyst', 'legal-counsel', 'communications-director', 'compliance-officer'],
    optionalAgents: ['environmental-analyst', 'tribal-liaison', 'data-officer'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['Administrative Procedure Act', 'Executive Order 12866', 'Regulatory Flexibility Act'],
    securityLevel: 'public',
    auditTrailRequired: true,
    primeDirective: 'Evidence-based policy. Stakeholder engagement. Clear implementation path.',
    toneKeywords: ['evidence-based', 'stakeholder-engaged', 'implementable', 'transparent'],
    outputFormat: ['policy_analysis', 'stakeholder_impact', 'regulatory_assessment', 'implementation_plan'],
  },
  {
    id: 'cybersecurity-war-room',
    name: 'Cybersecurity War Room',
    category: 'major',
    purpose: 'Cybersecurity incident response and threat assessment. FISMA compliance and FedRAMP authorization decisions.',
    leadAgent: 'it-security-officer',
    whenToUse: 'Security incidents, ATO decisions, major vulnerability findings, breach response',
    defaultAgents: ['it-security-officer', 'compliance-officer', 'legal-counsel', 'communications-director'],
    optionalAgents: ['program-manager', 'data-officer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FISMA', 'FedRAMP', 'NIST 800-53', 'CISA Directives', 'OMB M-22-09'],
    securityLevel: 'classified',
    auditTrailRequired: true,
    primeDirective: 'Contain threats. Maintain operations. Meet reporting requirements. Document response.',
    toneKeywords: ['urgent', 'contained', 'compliant', 'documented'],
    outputFormat: ['incident_report', 'threat_assessment', 'remediation_plan', 'notification_decision'],
  },
  {
    id: 'ig-audit-response-council',
    name: 'IG Audit Response Council',
    category: 'major',
    purpose: 'Inspector General audit response coordination. Finding remediation and management response development.',
    leadAgent: 'compliance-officer',
    whenToUse: 'IG audit findings, GAO recommendations, management challenges',
    defaultAgents: ['compliance-officer', 'legal-counsel', 'program-manager', 'budget-analyst'],
    optionalAgents: ['it-security-officer', 'human-capital-officer'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Inspector General Act', 'GPRA', 'FMFIA', 'DATA Act'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Address findings constructively. Develop credible corrective actions. Track to closure.',
    toneKeywords: ['responsive', 'corrective', 'credible', 'tracked'],
    outputFormat: ['management_response', 'corrective_action_plan', 'milestone_tracker', 'evidence_package'],
  },
];

// =============================================================================
// PROCUREMENT MODES
// =============================================================================

export const PROCUREMENT_MODES: GovernmentCouncilMode[] = [
  {
    id: 'acquisition-planning',
    name: 'Acquisition Planning',
    category: 'procurement',
    purpose: 'Pre-solicitation acquisition strategy development. Market research and requirements definition.',
    leadAgent: 'procurement-officer',
    whenToUse: 'New requirements, acquisition strategy development, market research',
    defaultAgents: ['procurement-officer', 'program-manager', 'budget-analyst'],
    optionalAgents: ['legal-counsel', 'it-security-officer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FAR Part 7', 'FAR Part 10', 'OFPP Policy Letters'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Define requirements clearly. Research market thoroughly. Plan for competition.',
    toneKeywords: ['strategic', 'market-informed', 'competitive', 'well-planned'],
    outputFormat: ['acquisition_plan', 'market_research', 'requirements_document', 'strategy_memo'],
  },
  {
    id: 'contract-modification-review',
    name: 'Contract Modification Review',
    category: 'procurement',
    purpose: 'Contract modification approval and documentation. Scope change and equitable adjustment analysis.',
    leadAgent: 'procurement-officer',
    whenToUse: 'Contract modifications, scope changes, cost adjustments, option exercises',
    defaultAgents: ['procurement-officer', 'program-manager', 'legal-counsel'],
    optionalAgents: ['budget-analyst', 'compliance-officer'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['FAR Part 43', 'DFARS', 'Changes Clause'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Document scope changes. Justify costs. Maintain contract integrity.',
    toneKeywords: ['documented', 'justified', 'fair', 'compliant'],
    outputFormat: ['modification_justification', 'price_analysis', 'scope_assessment', 'approval_decision'],
  },
  {
    id: 'contractor-performance-council',
    name: 'Contractor Performance Council',
    category: 'procurement',
    purpose: 'Contractor performance evaluation and CPARS documentation. Performance improvement planning.',
    leadAgent: 'program-manager',
    whenToUse: 'Annual performance reviews, CPARS input, performance issues, award decisions',
    defaultAgents: ['program-manager', 'procurement-officer', 'compliance-officer'],
    optionalAgents: ['legal-counsel', 'it-security-officer'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['FAR Part 42', 'CPARS', 'Past Performance Information'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Evaluate fairly. Document objectively. Support contractor improvement.',
    toneKeywords: ['objective', 'fair', 'documented', 'constructive'],
    outputFormat: ['performance_evaluation', 'cpars_narrative', 'improvement_plan', 'recommendation'],
  },
  {
    id: 'protest-response-council',
    name: 'Protest Response Council',
    category: 'procurement',
    purpose: 'GAO or COFC protest response coordination. Agency report development and corrective action.',
    leadAgent: 'legal-counsel',
    whenToUse: 'Bid protests, GAO recommendations, corrective action decisions',
    defaultAgents: ['legal-counsel', 'procurement-officer', 'program-manager'],
    optionalAgents: ['communications-director', 'compliance-officer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['GAO Bid Protest Regulations', 'CICA', 'FAR Part 33'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Defend decisions with record. Consider corrective action merits. Meet deadlines.',
    toneKeywords: ['defensible', 'record-based', 'timely', 'reasoned'],
    outputFormat: ['agency_report', 'corrective_action_analysis', 'decision_memo', 'timeline'],
  },
];

// =============================================================================
// POLICY MODES
// =============================================================================

export const POLICY_MODES: GovernmentCouncilMode[] = [
  {
    id: 'regulatory-impact-analysis',
    name: 'Regulatory Impact Analysis',
    category: 'policy',
    purpose: 'Cost-benefit analysis for proposed regulations. Economic impact and alternative analysis.',
    leadAgent: 'policy-analyst',
    whenToUse: 'Significant regulatory actions, OMB review preparation, economic analysis',
    defaultAgents: ['policy-analyst', 'budget-analyst', 'legal-counsel'],
    optionalAgents: ['data-officer', 'environmental-analyst'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Executive Order 12866', 'OMB Circular A-4', 'Regulatory Flexibility Act'],
    securityLevel: 'public',
    auditTrailRequired: true,
    primeDirective: 'Quantify costs and benefits. Analyze alternatives. Support informed decision-making.',
    toneKeywords: ['quantified', 'analytical', 'alternatives-considered', 'transparent'],
    outputFormat: ['cost_benefit_analysis', 'alternatives_analysis', 'regulatory_impact_statement'],
  },
  {
    id: 'public-comment-analysis',
    name: 'Public Comment Analysis',
    category: 'policy',
    purpose: 'Systematic analysis of public comments on proposed rules. Response development and rule modification.',
    leadAgent: 'policy-analyst',
    whenToUse: 'Comment period closure, final rule development, public input synthesis',
    defaultAgents: ['policy-analyst', 'legal-counsel', 'communications-director'],
    optionalAgents: ['data-officer', 'tribal-liaison'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Administrative Procedure Act', 'E-Government Act', 'APA Section 553'],
    securityLevel: 'public',
    auditTrailRequired: true,
    primeDirective: 'Consider all significant comments. Explain responses. Modify rule as warranted.',
    toneKeywords: ['responsive', 'considered', 'explained', 'transparent'],
    outputFormat: ['comment_summary', 'response_document', 'rule_modifications', 'preamble_language'],
  },
  {
    id: 'executive-order-implementation',
    name: 'Executive Order Implementation',
    category: 'policy',
    purpose: 'Agency implementation planning for executive orders. Timeline, resource, and policy alignment.',
    leadAgent: 'policy-analyst',
    whenToUse: 'New executive orders, implementation deadlines, policy alignment requirements',
    defaultAgents: ['policy-analyst', 'legal-counsel', 'program-manager', 'compliance-officer'],
    optionalAgents: ['budget-analyst', 'communications-director'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Specific EO Requirements', 'OMB Implementation Memos'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Interpret requirements correctly. Plan implementation realistically. Meet deadlines.',
    toneKeywords: ['compliant', 'timely', 'resourced', 'coordinated'],
    outputFormat: ['implementation_plan', 'resource_requirements', 'timeline', 'status_reporting'],
  },
];

// =============================================================================
// COMPLIANCE MODES
// =============================================================================

export const COMPLIANCE_GOVERNMENT_MODES: GovernmentCouncilMode[] = [
  {
    id: 'foia-review-council',
    name: 'FOIA Review Council',
    category: 'compliance',
    purpose: 'Freedom of Information Act request review. Disclosure determination and exemption application.',
    leadAgent: 'legal-counsel',
    whenToUse: 'FOIA requests, disclosure decisions, exemption determinations, appeals',
    defaultAgents: ['legal-counsel', 'compliance-officer', 'communications-director'],
    optionalAgents: ['it-security-officer', 'data-officer'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['FOIA', 'Privacy Act', 'Executive Order 13526'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Maximize disclosure. Apply exemptions narrowly. Meet deadlines.',
    toneKeywords: ['transparent', 'timely', 'reasoned', 'documented'],
    outputFormat: ['disclosure_determination', 'exemption_analysis', 'response_letter', 'vaughn_index'],
  },
  {
    id: 'ethics-review-council',
    name: 'Ethics Review Council',
    category: 'compliance',
    purpose: 'Ethics and conflict of interest review. Financial disclosure analysis and recusal decisions.',
    leadAgent: 'legal-counsel',
    whenToUse: 'Financial disclosures, conflict reviews, outside activity requests, post-employment',
    defaultAgents: ['legal-counsel', 'compliance-officer', 'human-capital-officer'],
    optionalAgents: ['policy-analyst'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['Ethics in Government Act', 'OGE Regulations', 'Agency Ethics Rules'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Identify conflicts early. Recommend mitigation. Protect integrity.',
    toneKeywords: ['impartial', 'protective', 'preventive', 'documented'],
    outputFormat: ['ethics_determination', 'conflict_analysis', 'mitigation_plan', 'recusal_memo'],
  },
  {
    id: 'records-management-council',
    name: 'Records Management Council',
    category: 'compliance',
    purpose: 'Federal records management decisions. Retention scheduling and disposition authority.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Records scheduling, disposition requests, litigation holds, NARA coordination',
    defaultAgents: ['compliance-officer', 'legal-counsel', 'data-officer'],
    optionalAgents: ['it-security-officer', 'program-manager'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['Federal Records Act', 'NARA Regulations', 'Litigation Hold Requirements'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Preserve what matters. Dispose appropriately. Maintain accessibility.',
    toneKeywords: ['compliant', 'preserved', 'accessible', 'documented'],
    outputFormat: ['retention_schedule', 'disposition_authority', 'hold_notice', 'transfer_plan'],
  },
];

// =============================================================================
// OPERATIONS MODES
// =============================================================================

export const OPERATIONS_MODES: GovernmentCouncilMode[] = [
  {
    id: 'program-review-council',
    name: 'Program Review Council',
    category: 'operations',
    purpose: 'Quarterly program performance review. GPRA metrics analysis and corrective action.',
    leadAgent: 'program-manager',
    whenToUse: 'Quarterly reviews, performance gaps, strategic planning, OMB review prep',
    defaultAgents: ['program-manager', 'budget-analyst', 'policy-analyst', 'compliance-officer'],
    optionalAgents: ['data-officer', 'communications-director'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['GPRA Modernization Act', 'OMB Circular A-11 Part 6', 'Agency Strategic Plan'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Measure what matters. Address gaps. Drive improvement.',
    toneKeywords: ['outcome-focused', 'data-driven', 'improvement-oriented', 'accountable'],
    outputFormat: ['performance_report', 'gap_analysis', 'corrective_actions', 'strategic_alignment'],
  },
  {
    id: 'workforce-planning-council',
    name: 'Workforce Planning Council',
    category: 'operations',
    purpose: 'Strategic workforce planning and resource allocation. Hiring prioritization and skills gaps.',
    leadAgent: 'human-capital-officer',
    whenToUse: 'Annual workforce planning, hiring priorities, reorganization, skills assessment',
    defaultAgents: ['human-capital-officer', 'program-manager', 'budget-analyst'],
    optionalAgents: ['legal-counsel', 'policy-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['OPM Strategic Human Capital Management', 'Federal Workforce Flexibility Act'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Align workforce with mission. Address skills gaps. Plan succession.',
    toneKeywords: ['strategic', 'mission-aligned', 'skills-focused', 'proactive'],
    outputFormat: ['workforce_plan', 'skills_gap_analysis', 'hiring_priorities', 'succession_plan'],
  },
  {
    id: 'continuity-planning-council',
    name: 'Continuity Planning Council',
    category: 'operations',
    purpose: 'Continuity of operations planning and testing. Essential functions and succession planning.',
    leadAgent: 'emergency-manager',
    whenToUse: 'Annual COOP updates, exercises, emergency activation, lessons learned',
    defaultAgents: ['emergency-manager', 'it-security-officer', 'program-manager', 'communications-director'],
    optionalAgents: ['human-capital-officer', 'compliance-officer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FEMA COOP Guidance', 'FCD-1', 'National Security Presidential Directive'],
    securityLevel: 'classified',
    auditTrailRequired: true,
    primeDirective: 'Maintain essential functions. Test plans regularly. Learn from exercises.',
    toneKeywords: ['prepared', 'tested', 'resilient', 'essential'],
    outputFormat: ['coop_plan', 'essential_functions', 'exercise_report', 'improvement_plan'],
  },
];

// =============================================================================
// SPECIALIZED GOVERNMENT MODES
// =============================================================================

export const SPECIALIZED_GOVERNMENT_MODES: GovernmentCouncilMode[] = [
  {
    id: 'tribal-consultation-council',
    name: 'Tribal Consultation Council',
    category: 'specialized',
    purpose: 'Government-to-government tribal consultation. Treaty obligations and cultural preservation.',
    leadAgent: 'tribal-liaison',
    whenToUse: 'Actions affecting tribes, treaty implications, cultural resource impacts',
    defaultAgents: ['tribal-liaison', 'policy-analyst', 'legal-counsel', 'environmental-analyst'],
    optionalAgents: ['communications-director', 'program-manager'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Executive Order 13175', 'NHPA Section 106', 'Treaty Obligations'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Consult meaningfully. Respect sovereignty. Honor obligations.',
    toneKeywords: ['respectful', 'meaningful', 'sovereign', 'relationship-focused'],
    outputFormat: ['consultation_record', 'tribal_concerns', 'accommodation_analysis', 'commitment_tracking'],
  },
  {
    id: 'environmental-review-council',
    name: 'Environmental Review Council',
    category: 'specialized',
    purpose: 'NEPA environmental review and impact assessment. Categorical exclusions to EIS decisions.',
    leadAgent: 'environmental-analyst',
    whenToUse: 'Major federal actions, environmental impacts, NEPA documentation',
    defaultAgents: ['environmental-analyst', 'policy-analyst', 'legal-counsel', 'program-manager'],
    optionalAgents: ['tribal-liaison', 'communications-director'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['NEPA', 'CEQ Regulations', 'Agency NEPA Procedures'],
    securityLevel: 'public',
    auditTrailRequired: true,
    primeDirective: 'Assess impacts thoroughly. Consider alternatives. Inform decisions.',
    toneKeywords: ['thorough', 'alternatives-focused', 'science-based', 'transparent'],
    outputFormat: ['nepa_determination', 'environmental_assessment', 'impact_analysis', 'mitigation_measures'],
  },
  {
    id: 'interagency-coordination-council',
    name: 'Interagency Coordination Council',
    category: 'specialized',
    purpose: 'Cross-agency policy and operational coordination. Shared services and joint initiatives.',
    leadAgent: 'policy-analyst',
    whenToUse: 'Multi-agency initiatives, shared services, policy coordination, joint operations',
    defaultAgents: ['policy-analyst', 'program-manager', 'budget-analyst', 'legal-counsel'],
    optionalAgents: ['communications-director', 'data-officer'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['OMB Circulars', 'Cross-Agency Priority Goals', 'Shared Services Policy'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Align efforts across agencies. Reduce duplication. Achieve shared goals.',
    toneKeywords: ['coordinated', 'collaborative', 'efficient', 'outcome-focused'],
    outputFormat: ['coordination_plan', 'roles_responsibilities', 'shared_metrics', 'governance_structure'],
  },
  {
    id: 'grants-award-council',
    name: 'Grants Award Council',
    category: 'specialized',
    purpose: 'Grant application review and award decisions. Merit review and funding allocation.',
    leadAgent: 'grants-manager',
    whenToUse: 'Grant competitions, merit review, funding decisions, appeals',
    defaultAgents: ['grants-manager', 'program-manager', 'budget-analyst', 'compliance-officer'],
    optionalAgents: ['legal-counsel', 'policy-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['2 CFR 200', 'Agency Grant Regulations', 'NOFO Requirements'],
    securityLevel: 'sensitive',
    auditTrailRequired: true,
    primeDirective: 'Award based on merit. Document decisions. Ensure compliance.',
    toneKeywords: ['merit-based', 'fair', 'documented', 'compliant'],
    outputFormat: ['merit_review_summary', 'award_recommendation', 'funding_allocation', 'negotiation_memo'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_GOVERNMENT_MODES: GovernmentCouncilMode[] = [
  ...MAJOR_GOVERNMENT_MODES,
  ...PROCUREMENT_MODES,
  ...POLICY_MODES,
  ...COMPLIANCE_GOVERNMENT_MODES,
  ...OPERATIONS_MODES,
  ...SPECIALIZED_GOVERNMENT_MODES,
];

export const GOVERNMENT_MODE_MAP: Map<string, GovernmentCouncilMode> = new Map(
  ALL_GOVERNMENT_MODES.map(mode => [mode.id, mode])
);

export function getGovernmentMode(modeId: string): GovernmentCouncilMode | undefined {
  return GOVERNMENT_MODE_MAP.get(modeId);
}

export function getGovernmentModesByCategory(category: GovernmentModeCategory): GovernmentCouncilMode[] {
  return ALL_GOVERNMENT_MODES.filter(mode => mode.category === category);
}

export function getGovernmentModesByFramework(framework: string): GovernmentCouncilMode[] {
  return ALL_GOVERNMENT_MODES.filter(mode => 
    mode.regulatoryFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

// Summary stats
export const GOVERNMENT_MODE_STATS = {
  total: ALL_GOVERNMENT_MODES.length,
  byCategory: {
    major: MAJOR_GOVERNMENT_MODES.length,
    procurement: PROCUREMENT_MODES.length,
    policy: POLICY_MODES.length,
    compliance: COMPLIANCE_GOVERNMENT_MODES.length,
    operations: OPERATIONS_MODES.length,
    specialized: SPECIALIZED_GOVERNMENT_MODES.length,
  },
};
