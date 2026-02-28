// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA ENERGY/UTILITIES COUNCIL MODES
 * 
 * 40+ specialized deliberation modes for the Energy/Utilities Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 * 
 * Regulatory Frameworks: NERC CIP, FERC, EPA, State PUCs, Nuclear Regulatory Commission
 * Standards: IEEE, NIST, IEC 61850, DNP3
 */

// =============================================================================
// TYPES
// =============================================================================

export type EnergyModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'grid'            // Grid operations modes
  | 'safety'          // Safety and environmental modes
  | 'compliance'      // Regulatory compliance modes
  | 'assets'          // Asset management modes
  | 'specialized';    // Specialized energy modes

export interface EnergyCouncilMode {
  id: string;
  name: string;
  category: EnergyModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  regulatoryFrameworks: string[];
  safetyGateRequired: boolean;
  auditTrailRequired: boolean;
  nercCipRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_ENERGY_MODES: EnergyCouncilMode[] = [
  {
    id: 'grid-emergency-council',
    name: 'Grid Emergency Council',
    category: 'major',
    purpose: 'Real-time grid emergency response and load shedding decisions. System operator support with safety-first protocols.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Grid emergencies, capacity shortfalls, cascading failures, blackstart',
    defaultAgents: ['grid-balancer', 'renewable-optimizer', 'asset-guardian', 'demand-response'],
    optionalAgents: ['system-operator', 'emergency-coordinator', 'communications-lead'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['NERC EOP Standards', 'FERC Order 888', 'State Emergency Protocols'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Safety first. Grid stability paramount. Human operator makes final decision.',
    toneKeywords: ['emergency', 'safety-critical', 'rapid', 'coordinated'],
    outputFormat: ['situation_assessment', 'response_options', 'load_shed_plan', 'communication_protocol', 'human_decision_required'],
  },
  {
    id: 'nerc-cip-council',
    name: 'NERC CIP Council',
    category: 'major',
    purpose: 'NERC CIP compliance review and cybersecurity posture assessment. Critical infrastructure protection.',
    leadAgent: 'asset-guardian',
    whenToUse: 'CIP audits, security incidents, compliance gaps, new BES assets',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['cip-specialist', 'cybersecurity-analyst', 'compliance-officer'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['NERC CIP-002 through CIP-014', 'FERC Order 706', 'DOE Guidelines'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'BES cyber assets protected. Compliance verified. Security posture strong.',
    toneKeywords: ['cip', 'cybersecurity', 'critical-infrastructure', 'compliant'],
    outputFormat: ['compliance_assessment', 'gap_analysis', 'risk_rating', 'remediation_plan', 'audit_readiness'],
  },
  {
    id: 'safety-review-board',
    name: 'Safety Review Board',
    category: 'major',
    purpose: 'Safety incident investigation and root cause analysis. OSHA compliance, safety culture.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Safety incidents, near misses, hazard reports, regulatory inquiries',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['safety-specialist', 'legal-counsel', 'union-representative'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['OSHA 1910', 'NESC', 'State Safety Requirements', 'APPA Safety Manual'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Root cause identified. Corrective actions prevent recurrence. Safety culture reinforced.',
    toneKeywords: ['safety', 'root-cause', 'prevention', 'culture'],
    outputFormat: ['incident_summary', 'root_cause_analysis', 'corrective_actions', 'training_requirements', 'follow_up_plan'],
  },
  {
    id: 'outage-coordination-council',
    name: 'Outage Coordination Council',
    category: 'major',
    purpose: 'Planned outage coordination and restoration prioritization. Reliability impact assessment.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Planned maintenance, storm restoration, equipment replacement',
    defaultAgents: ['grid-balancer', 'asset-guardian', 'renewable-optimizer', 'demand-response'],
    optionalAgents: ['outage-coordinator', 'customer-service', 'vegetation-management'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['NERC FAC Standards', 'State Service Quality', 'Reliability Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Reliability maintained. Customer impact minimized. Safety protected.',
    toneKeywords: ['outage', 'coordination', 'reliability', 'restoration'],
    outputFormat: ['outage_schedule', 'reliability_impact', 'customer_communication', 'restoration_priority'],
  },
  {
    id: 'rate-case-council',
    name: 'Rate Case Council',
    category: 'major',
    purpose: 'Rate case preparation and regulatory testimony support. Cost of service, rate design.',
    leadAgent: 'demand-response',
    whenToUse: 'Rate cases, cost allocation, regulatory hearings',
    defaultAgents: ['demand-response', 'grid-balancer', 'asset-guardian', 'renewable-optimizer'],
    optionalAgents: ['rate-analyst', 'regulatory-specialist', 'legal-counsel'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['State PUC Rules', 'FERC Rate Standards', 'Cost of Service Principles'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Rates just and reasonable. Cost allocation fair. Testimony defensible.',
    toneKeywords: ['rate-case', 'cost-of-service', 'testimony', 'regulatory'],
    outputFormat: ['cost_study', 'rate_design', 'testimony_support', 'regulatory_strategy'],
  },
];

// =============================================================================
// GRID OPERATIONS MODES
// =============================================================================

export const GRID_MODES: EnergyCouncilMode[] = [
  {
    id: 'load-forecast-review',
    name: 'Load Forecast Review',
    category: 'grid',
    purpose: 'Load forecasting analysis and model validation. Weather impacts, demand patterns.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Daily operations, planning studies, model updates',
    defaultAgents: ['grid-balancer', 'renewable-optimizer', 'demand-response'],
    optionalAgents: ['forecasting-specialist', 'weather-analyst'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['NERC MOD Standards', 'Regional Planning Requirements'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Forecast accurate. Uncertainty quantified. Planning supported.',
    toneKeywords: ['forecast', 'accuracy', 'uncertainty', 'planning'],
    outputFormat: ['forecast_results', 'accuracy_metrics', 'uncertainty_range', 'recommendations'],
  },
  {
    id: 'renewable-integration',
    name: 'Renewable Integration',
    category: 'grid',
    purpose: 'Renewable resource integration and intermittency management. Curtailment decisions.',
    leadAgent: 'renewable-optimizer',
    whenToUse: 'Renewable forecasting, curtailment, storage dispatch',
    defaultAgents: ['renewable-optimizer', 'grid-balancer', 'demand-response'],
    optionalAgents: ['storage-specialist', 'market-analyst'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State RPS', 'FERC Order 2222', 'Regional Interconnection Rules'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Renewables maximized. Reliability maintained. Curtailment minimized.',
    toneKeywords: ['renewable', 'integration', 'intermittency', 'optimization'],
    outputFormat: ['renewable_forecast', 'dispatch_recommendation', 'curtailment_analysis', 'storage_strategy'],
  },
  {
    id: 'voltage-var-optimization',
    name: 'Voltage/VAR Optimization',
    category: 'grid',
    purpose: 'Voltage and reactive power optimization. Conservation voltage reduction.',
    leadAgent: 'grid-balancer',
    whenToUse: 'VVO program management, capacitor operations, CVR decisions',
    defaultAgents: ['grid-balancer', 'asset-guardian'],
    optionalAgents: ['power-systems-engineer', 'dms-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['ANSI C84.1', 'State Voltage Standards', 'IEEE 1547'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Voltage within limits. Losses minimized. Equipment protected.',
    toneKeywords: ['voltage', 'var', 'optimization', 'efficiency'],
    outputFormat: ['voltage_analysis', 'var_recommendations', 'cvr_impact', 'equipment_status'],
  },
  {
    id: 'frequency-response',
    name: 'Frequency Response',
    category: 'grid',
    purpose: 'Frequency response and governor control. Primary frequency response obligations.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Frequency events, governor testing, BAL compliance',
    defaultAgents: ['grid-balancer', 'renewable-optimizer', 'asset-guardian'],
    optionalAgents: ['generation-dispatcher', 'compliance-analyst'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['NERC BAL Standards', 'FERC Order 842', 'Regional Requirements'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Frequency stable. Response adequate. Compliance maintained.',
    toneKeywords: ['frequency', 'response', 'stability', 'compliance'],
    outputFormat: ['frequency_analysis', 'response_assessment', 'compliance_status', 'recommendations'],
  },
  {
    id: 'transmission-congestion',
    name: 'Transmission Congestion',
    category: 'grid',
    purpose: 'Transmission congestion management and redispatch decisions.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Congestion events, TLR procedures, market impacts',
    defaultAgents: ['grid-balancer', 'renewable-optimizer', 'demand-response'],
    optionalAgents: ['market-operator', 'transmission-planner'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['NERC FAC Standards', 'FERC Order 890', 'Regional Protocols'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Congestion managed. Reliability protected. Costs minimized.',
    toneKeywords: ['congestion', 'redispatch', 'reliability', 'cost'],
    outputFormat: ['congestion_analysis', 'redispatch_options', 'cost_impact', 'reliability_assessment'],
  },
];

// =============================================================================
// SAFETY AND ENVIRONMENTAL MODES
// =============================================================================

export const SAFETY_MODES: EnergyCouncilMode[] = [
  {
    id: 'arc-flash-review',
    name: 'Arc Flash Review',
    category: 'safety',
    purpose: 'Arc flash hazard analysis and PPE requirements. NFPA 70E compliance.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Arc flash studies, PPE assessments, equipment changes',
    defaultAgents: ['asset-guardian', 'grid-balancer'],
    optionalAgents: ['safety-engineer', 'electrical-engineer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['NFPA 70E', 'OSHA 1910.269', 'IEEE 1584'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Hazards identified. PPE appropriate. Workers protected.',
    toneKeywords: ['arc-flash', 'ppe', 'hazard', 'protection'],
    outputFormat: ['hazard_analysis', 'ppe_requirements', 'label_updates', 'training_needs'],
  },
  {
    id: 'environmental-compliance',
    name: 'Environmental Compliance',
    category: 'safety',
    purpose: 'Environmental permit compliance and emissions management. EPA, state requirements.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Permit renewals, emissions reports, compliance reviews',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['environmental-specialist', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['EPA Clean Air Act', 'Clean Water Act', 'State Environmental Rules'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Permits maintained. Emissions within limits. Compliance documented.',
    toneKeywords: ['environmental', 'compliance', 'emissions', 'permits'],
    outputFormat: ['compliance_status', 'emissions_summary', 'permit_requirements', 'action_items'],
  },
  {
    id: 'dam-safety-review',
    name: 'Dam Safety Review',
    category: 'safety',
    purpose: 'Hydroelectric dam safety assessment. FERC Part 12, emergency action plans.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Dam inspections, EAP updates, FERC compliance',
    defaultAgents: ['asset-guardian', 'grid-balancer'],
    optionalAgents: ['dam-safety-engineer', 'hydrology-specialist', 'emergency-coordinator'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['FERC Part 12', 'State Dam Safety', 'FEMA Guidelines'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Dam safe. EAP current. Inspections complete.',
    toneKeywords: ['dam-safety', 'eap', 'inspection', 'ferc'],
    outputFormat: ['safety_assessment', 'inspection_findings', 'eap_status', 'remediation_plan'],
  },
  {
    id: 'nuclear-operations-review',
    name: 'Nuclear Operations Review',
    category: 'safety',
    purpose: 'Nuclear plant operations oversight. NRC compliance, safety systems.',
    leadAgent: 'asset-guardian',
    whenToUse: 'NRC inspections, safety system reviews, license compliance',
    defaultAgents: ['asset-guardian', 'grid-balancer'],
    optionalAgents: ['nuclear-specialist', 'radiation-safety', 'nrc-liaison'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['NRC 10 CFR', 'Technical Specifications', 'INPO Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Nuclear safety paramount. NRC compliance absolute. Defense in depth maintained.',
    toneKeywords: ['nuclear', 'nrc', 'safety-culture', 'defense-in-depth'],
    outputFormat: ['safety_assessment', 'compliance_status', 'corrective_actions', 'regulatory_interface'],
  },
];

// =============================================================================
// COMPLIANCE MODES
// =============================================================================

export const COMPLIANCE_MODES: EnergyCouncilMode[] = [
  {
    id: 'nerc-audit-prep',
    name: 'NERC Audit Prep',
    category: 'compliance',
    purpose: 'NERC compliance audit preparation. Evidence collection, gap remediation.',
    leadAgent: 'asset-guardian',
    whenToUse: 'NERC audits, spot checks, self-certifications',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['compliance-coordinator', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NERC Standards', 'Regional Entity Requirements', 'CMEP'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Evidence complete. Gaps remediated. Audit ready.',
    toneKeywords: ['nerc', 'audit', 'evidence', 'compliance'],
    outputFormat: ['compliance_status', 'evidence_inventory', 'gap_analysis', 'remediation_plan'],
  },
  {
    id: 'ferc-filing-review',
    name: 'FERC Filing Review',
    category: 'compliance',
    purpose: 'FERC regulatory filing preparation. Tariffs, rate schedules, compliance filings.',
    leadAgent: 'demand-response',
    whenToUse: 'Tariff filings, compliance reports, regulatory submissions',
    defaultAgents: ['demand-response', 'grid-balancer', 'asset-guardian'],
    optionalAgents: ['regulatory-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['FERC Regulations', 'FPA', 'PURPA'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Filing complete. Compliance demonstrated. Deadlines met.',
    toneKeywords: ['ferc', 'filing', 'tariff', 'compliance'],
    outputFormat: ['filing_checklist', 'compliance_demonstration', 'tariff_review', 'submission_strategy'],
  },
  {
    id: 'state-puc-compliance',
    name: 'State PUC Compliance',
    category: 'compliance',
    purpose: 'State public utility commission compliance. Service quality, reporting requirements.',
    leadAgent: 'demand-response',
    whenToUse: 'PUC filings, service quality reports, regulatory inquiries',
    defaultAgents: ['demand-response', 'grid-balancer', 'asset-guardian'],
    optionalAgents: ['regulatory-specialist', 'customer-service-lead'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State PUC Rules', 'Service Quality Standards', 'Reporting Requirements'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Service quality maintained. Reports accurate. Compliance verified.',
    toneKeywords: ['puc', 'service-quality', 'reporting', 'regulatory'],
    outputFormat: ['compliance_report', 'service_metrics', 'regulatory_response', 'action_items'],
  },
  {
    id: 'reliability-standards-review',
    name: 'Reliability Standards Review',
    category: 'compliance',
    purpose: 'Reliability standards compliance assessment. TPL, FAC, PRC standards.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Planning studies, protection reviews, new standard implementation',
    defaultAgents: ['grid-balancer', 'asset-guardian', 'renewable-optimizer'],
    optionalAgents: ['planning-engineer', 'protection-engineer'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['NERC TPL', 'NERC FAC', 'NERC PRC', 'Regional Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Standards met. Studies current. Planning adequate.',
    toneKeywords: ['reliability', 'standards', 'planning', 'protection'],
    outputFormat: ['compliance_assessment', 'study_results', 'gap_identification', 'remediation_plan'],
  },
];

// =============================================================================
// ASSET MANAGEMENT MODES
// =============================================================================

export const ASSET_MODES: EnergyCouncilMode[] = [
  {
    id: 'asset-health-review',
    name: 'Asset Health Review',
    category: 'assets',
    purpose: 'Asset condition assessment and health indexing. Predictive maintenance.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Condition assessments, maintenance planning, capital prioritization',
    defaultAgents: ['asset-guardian', 'grid-balancer'],
    optionalAgents: ['asset-analyst', 'maintenance-planner'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['IEEE Asset Management', 'Industry Best Practices'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Condition assessed. Risks identified. Maintenance optimized.',
    toneKeywords: ['asset-health', 'condition', 'predictive', 'maintenance'],
    outputFormat: ['health_index', 'risk_assessment', 'maintenance_recommendations', 'investment_priority'],
  },
  {
    id: 'capital-planning-review',
    name: 'Capital Planning Review',
    category: 'assets',
    purpose: 'Capital investment planning and project prioritization. Risk-based planning.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Annual planning, project evaluation, budget allocation',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer', 'demand-response'],
    optionalAgents: ['financial-analyst', 'project-manager'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Prudency Standards', 'Rate Recovery Requirements'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Investments prudent. Risks managed. Value delivered.',
    toneKeywords: ['capital', 'investment', 'prioritization', 'value'],
    outputFormat: ['project_portfolio', 'prioritization_matrix', 'risk_analysis', 'budget_recommendation'],
  },
  {
    id: 'fleet-modernization',
    name: 'Fleet Modernization',
    category: 'assets',
    purpose: 'Generation fleet modernization strategy. Retirement, replacement, repowering.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Fleet planning, retirement decisions, new generation',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['generation-planner', 'environmental-specialist', 'market-analyst'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['IRP Requirements', 'Environmental Regulations', 'Reliability Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Fleet optimized. Reliability maintained. Transition planned.',
    toneKeywords: ['fleet', 'modernization', 'transition', 'reliability'],
    outputFormat: ['fleet_assessment', 'retirement_schedule', 'replacement_options', 'transition_plan'],
  },
  {
    id: 'grid-modernization',
    name: 'Grid Modernization',
    category: 'assets',
    purpose: 'Distribution grid modernization and smart grid initiatives. AMI, DER integration.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Smart grid projects, AMI deployment, DER programs',
    defaultAgents: ['grid-balancer', 'asset-guardian', 'renewable-optimizer', 'demand-response'],
    optionalAgents: ['technology-specialist', 'customer-programs'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['State Grid Mod Requirements', 'IEEE 1547', 'Interconnection Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Grid modernized. DER enabled. Customer value delivered.',
    toneKeywords: ['grid-mod', 'smart-grid', 'der', 'modernization'],
    outputFormat: ['initiative_assessment', 'technology_roadmap', 'cost_benefit', 'implementation_plan'],
  },
];

// =============================================================================
// SPECIALIZED ENERGY MODES
// =============================================================================

export const SPECIALIZED_ENERGY_MODES: EnergyCouncilMode[] = [
  {
    id: 'energy-storage-review',
    name: 'Energy Storage Review',
    category: 'specialized',
    purpose: 'Battery storage project evaluation and dispatch optimization.',
    leadAgent: 'renewable-optimizer',
    whenToUse: 'Storage projects, dispatch strategies, market participation',
    defaultAgents: ['renewable-optimizer', 'grid-balancer', 'asset-guardian'],
    optionalAgents: ['storage-specialist', 'market-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FERC Order 841', 'State Storage Mandates', 'IEEE 1547'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Storage optimized. Value stacked. Safety maintained.',
    toneKeywords: ['storage', 'battery', 'dispatch', 'value-stacking'],
    outputFormat: ['project_assessment', 'dispatch_strategy', 'value_analysis', 'safety_review'],
  },
  {
    id: 'ev-infrastructure-review',
    name: 'EV Infrastructure Review',
    category: 'specialized',
    purpose: 'Electric vehicle charging infrastructure planning and rate design.',
    leadAgent: 'demand-response',
    whenToUse: 'EV programs, charging infrastructure, load impacts',
    defaultAgents: ['demand-response', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['ev-specialist', 'rate-analyst', 'customer-programs'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State EV Mandates', 'FERC Rate Requirements', 'Building Codes'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Infrastructure planned. Grid impacts managed. Customer enabled.',
    toneKeywords: ['ev', 'charging', 'infrastructure', 'electrification'],
    outputFormat: ['infrastructure_plan', 'grid_impact', 'rate_design', 'program_recommendations'],
  },
  {
    id: 'hydrogen-project-review',
    name: 'Hydrogen Project Review',
    category: 'specialized',
    purpose: 'Green hydrogen project evaluation. Electrolysis, storage, blending.',
    leadAgent: 'renewable-optimizer',
    whenToUse: 'Hydrogen projects, power-to-gas, decarbonization',
    defaultAgents: ['renewable-optimizer', 'grid-balancer', 'asset-guardian'],
    optionalAgents: ['hydrogen-specialist', 'safety-engineer'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Pipeline Safety', 'DOE Hydrogen Standards', 'State Requirements'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Project viable. Safety addressed. Integration planned.',
    toneKeywords: ['hydrogen', 'green', 'electrolysis', 'decarbonization'],
    outputFormat: ['project_assessment', 'safety_analysis', 'integration_plan', 'economics'],
  },
  {
    id: 'microgrids-review',
    name: 'Microgrids Review',
    category: 'specialized',
    purpose: 'Microgrid project evaluation and islanding capabilities.',
    leadAgent: 'grid-balancer',
    whenToUse: 'Microgrid projects, resiliency programs, community energy',
    defaultAgents: ['grid-balancer', 'renewable-optimizer', 'asset-guardian', 'demand-response'],
    optionalAgents: ['microgrid-specialist', 'protection-engineer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['IEEE 1547', 'State Microgrid Rules', 'Interconnection Standards'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: true,
    primeDirective: 'Islanding safe. Resiliency enhanced. Grid integration seamless.',
    toneKeywords: ['microgrid', 'islanding', 'resiliency', 'integration'],
    outputFormat: ['project_assessment', 'protection_review', 'islanding_protocol', 'interconnection_requirements'],
  },
  {
    id: 'carbon-reduction-council',
    name: 'Carbon Reduction Council',
    category: 'specialized',
    purpose: 'Decarbonization strategy and carbon accounting. Net-zero pathway.',
    leadAgent: 'renewable-optimizer',
    whenToUse: 'Carbon goals, decarbonization planning, reporting',
    defaultAgents: ['renewable-optimizer', 'grid-balancer', 'asset-guardian', 'demand-response'],
    optionalAgents: ['sustainability-specialist', 'environmental-analyst'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['State Carbon Goals', 'EPA Reporting', 'SEC Climate Disclosure'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Carbon measured. Reduction pathway clear. Reliability maintained.',
    toneKeywords: ['carbon', 'decarbonization', 'net-zero', 'sustainability'],
    outputFormat: ['carbon_inventory', 'reduction_pathway', 'investment_plan', 'reporting_framework'],
  },
  {
    id: 'wildfire-mitigation-council',
    name: 'Wildfire Mitigation Council',
    category: 'specialized',
    purpose: 'Wildfire risk assessment and mitigation planning. PSPS decisions.',
    leadAgent: 'asset-guardian',
    whenToUse: 'Fire season planning, PSPS events, vegetation management',
    defaultAgents: ['asset-guardian', 'grid-balancer', 'demand-response'],
    optionalAgents: ['fire-mitigation-specialist', 'meteorologist', 'communications-lead'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State Wildfire Plans', 'CPUC Fire Safety', 'Vegetation Management'],
    safetyGateRequired: true,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Fire risk minimized. Customer impact managed. Safety paramount.',
    toneKeywords: ['wildfire', 'psps', 'vegetation', 'risk-mitigation'],
    outputFormat: ['risk_assessment', 'mitigation_plan', 'psps_protocol', 'customer_communication'],
  },
  {
    id: 'demand-response-review',
    name: 'Demand Response Review',
    category: 'specialized',
    purpose: 'Demand response program evaluation and optimization. Load flexibility.',
    leadAgent: 'demand-response',
    whenToUse: 'DR program design, event dispatch, performance review',
    defaultAgents: ['demand-response', 'grid-balancer', 'renewable-optimizer'],
    optionalAgents: ['program-manager', 'market-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FERC Order 2222', 'State DR Rules', 'Market Rules'],
    safetyGateRequired: false,
    auditTrailRequired: true,
    nercCipRequired: false,
    primeDirective: 'Load flexibility maximized. Customer value delivered. Grid supported.',
    toneKeywords: ['demand-response', 'flexibility', 'dispatch', 'customer'],
    outputFormat: ['program_assessment', 'dispatch_strategy', 'performance_metrics', 'optimization_recommendations'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_ENERGY_MODES: EnergyCouncilMode[] = [
  ...MAJOR_ENERGY_MODES,
  ...GRID_MODES,
  ...SAFETY_MODES,
  ...COMPLIANCE_MODES,
  ...ASSET_MODES,
  ...SPECIALIZED_ENERGY_MODES,
];

export const ENERGY_MODE_MAP: Map<string, EnergyCouncilMode> = new Map(
  ALL_ENERGY_MODES.map(mode => [mode.id, mode])
);

/**
 * Get an energy mode by ID
 */
export function getEnergyMode(modeId: string): EnergyCouncilMode | undefined {
  return ENERGY_MODE_MAP.get(modeId);
}

/**
 * Get all energy modes by category
 */
export function getEnergyModesByCategory(category: EnergyModeCategory): EnergyCouncilMode[] {
  return ALL_ENERGY_MODES.filter(mode => mode.category === category);
}

/**
 * Get all energy modes requiring safety gate
 */
export function getSafetyGateModes(): EnergyCouncilMode[] {
  return ALL_ENERGY_MODES.filter(mode => mode.safetyGateRequired);
}

/**
 * Get all energy modes requiring NERC CIP
 */
export function getNercCipModes(): EnergyCouncilMode[] {
  return ALL_ENERGY_MODES.filter(mode => mode.nercCipRequired);
}

/**
 * Get energy modes by regulatory framework
 */
export function getEnergyModesByFramework(framework: string): EnergyCouncilMode[] {
  return ALL_ENERGY_MODES.filter(mode => 
    mode.regulatoryFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

/**
 * Get energy modes by lead agent
 */
export function getEnergyModesByLeadAgent(leadAgent: string): EnergyCouncilMode[] {
  return ALL_ENERGY_MODES.filter(mode => mode.leadAgent === leadAgent);
}

// Summary stats
export const ENERGY_MODES_SUMMARY = {
  totalModes: ALL_ENERGY_MODES.length,
  majorModes: MAJOR_ENERGY_MODES.length,
  gridModes: GRID_MODES.length,
  safetyModes: SAFETY_MODES.length,
  complianceModes: COMPLIANCE_MODES.length,
  assetModes: ASSET_MODES.length,
  specializedModes: SPECIALIZED_ENERGY_MODES.length,
  safetyGateModes: ALL_ENERGY_MODES.filter(m => m.safetyGateRequired).length,
  nercCipModes: ALL_ENERGY_MODES.filter(m => m.nercCipRequired).length,
};
