// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA MANUFACTURING COUNCIL MODES
 *
 * Specialized deliberation modes for the Manufacturing Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Standards: ISO 9001, IATF 16949, ISO 14001, OSHA, Six Sigma
 */

export type ManufacturingModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'quality'         // Quality management
  | 'production'      // Production operations
  | 'safety'          // Safety and EHS
  | 'supply-chain'    // Supply chain decisions
  | 'specialized';    // Specialized manufacturing modes

export interface ManufacturingCouncilMode {
  id: string;
  name: string;
  category: ManufacturingModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  standards: string[];
  safetyGate: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_MANUFACTURING_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'production-crisis-council',
    name: 'Production Crisis Council',
    category: 'major',
    purpose: 'Critical production issues requiring immediate cross-functional response. Line stoppages, major quality escapes, supply disruptions.',
    leadAgent: 'plant-manager',
    whenToUse: 'Line down, critical quality issue, supply emergency, customer escalation',
    defaultAgents: ['plant-manager', 'quality-engineer', 'maintenance-engineer', 'supply-chain-manager'],
    optionalAgents: ['safety-officer', 'process-engineer'],
    maxDeliberationRounds: 6,
    standards: ['ISO 9001', 'Customer Requirements'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Contain the issue. Restore production safely. Identify root cause.',
    toneKeywords: ['urgent', 'contained', 'root-cause', 'recovery'],
    outputFormat: ['situation_assessment', 'containment_actions', 'recovery_plan', 'root_cause_analysis'],
  },
  {
    id: 'quality-review-board',
    name: 'Quality Review Board',
    category: 'major',
    purpose: 'Major quality decisions including MRB dispositions, supplier quality issues, and corrective action effectiveness.',
    leadAgent: 'quality-engineer',
    whenToUse: 'MRB decisions, CAPA reviews, supplier quality escalations, customer complaints',
    defaultAgents: ['quality-engineer', 'process-engineer', 'plant-manager', 'compliance-specialist'],
    optionalAgents: ['materials-engineer', 'supply-chain-manager'],
    maxDeliberationRounds: 8,
    standards: ['ISO 9001', 'IATF 16949', 'AS9100'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Protect the customer. Determine true root cause. Prevent recurrence.',
    toneKeywords: ['quality-focused', 'root-cause', 'prevention', 'documented'],
    outputFormat: ['quality_assessment', 'mrb_disposition', 'corrective_action', 'effectiveness_review'],
  },
  {
    id: 'safety-incident-council',
    name: 'Safety Incident Council',
    category: 'major',
    purpose: 'Safety incident investigation and corrective action. Recordable injuries, near-misses, hazard identification.',
    leadAgent: 'safety-officer',
    whenToUse: 'Safety incidents, near-misses, OSHA inspections, safety audits',
    defaultAgents: ['safety-officer', 'plant-manager', 'process-engineer', 'maintenance-engineer'],
    optionalAgents: ['industrial-engineer', 'compliance-specialist'],
    maxDeliberationRounds: 8,
    standards: ['OSHA', 'ISO 45001', 'Company Safety Standards'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Protect workers. Find root cause. Prevent all future incidents.',
    toneKeywords: ['safety-first', 'root-cause', 'prevention', 'zero-harm'],
    outputFormat: ['incident_report', 'investigation_findings', 'corrective_actions', 'prevention_measures'],
  },
  {
    id: 'new-product-launch-council',
    name: 'New Product Launch Council',
    category: 'major',
    purpose: 'NPI gate reviews and launch readiness decisions. APQP progression, PPAP approval, production readiness.',
    leadAgent: 'new-product-engineer',
    whenToUse: 'APQP gates, PPAP submissions, launch decisions, production trials',
    defaultAgents: ['new-product-engineer', 'quality-engineer', 'process-engineer', 'production-planner'],
    optionalAgents: ['materials-engineer', 'cost-accountant', 'supply-chain-manager'],
    maxDeliberationRounds: 10,
    standards: ['APQP', 'PPAP', 'IATF 16949'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Launch only when ready. No quality compromises. Meet all requirements.',
    toneKeywords: ['launch-ready', 'gate-compliant', 'quality-assured', 'on-schedule'],
    outputFormat: ['gate_review', 'readiness_assessment', 'ppap_status', 'launch_decision'],
  },
];

// =============================================================================
// QUALITY MODES
// =============================================================================

export const QUALITY_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'root-cause-analysis',
    name: 'Root Cause Analysis',
    category: 'quality',
    purpose: '8D/A3 problem solving for quality issues. Systematic root cause identification and corrective action.',
    leadAgent: 'quality-engineer',
    whenToUse: 'Customer complaints, internal NCRs, repetitive defects, audit findings',
    defaultAgents: ['quality-engineer', 'process-engineer'],
    optionalAgents: ['materials-engineer', 'maintenance-engineer'],
    maxDeliberationRounds: 8,
    standards: ['8D', 'A3', 'DMAIC'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Find the true root cause. Verify with data. Implement permanent fix.',
    toneKeywords: ['systematic', 'data-driven', 'verified', 'permanent'],
    outputFormat: ['8d_report', 'root_cause_verification', 'corrective_action', 'effectiveness_metrics'],
  },
  {
    id: 'process-capability-review',
    name: 'Process Capability Review',
    category: 'quality',
    purpose: 'SPC analysis and process capability assessment. Cpk/Ppk improvement initiatives.',
    leadAgent: 'quality-engineer',
    whenToUse: 'Process capability studies, SPC alerts, customer Cpk requirements',
    defaultAgents: ['quality-engineer', 'process-engineer'],
    optionalAgents: ['industrial-engineer', 'automation-engineer'],
    maxDeliberationRounds: 6,
    standards: ['ISO 9001', 'SPC', 'MSA'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Understand process variation. Improve capability. Sustain gains.',
    toneKeywords: ['statistical', 'capable', 'controlled', 'improved'],
    outputFormat: ['capability_study', 'control_charts', 'improvement_actions', 'sustainability_plan'],
  },
  {
    id: 'supplier-quality-council',
    name: 'Supplier Quality Council',
    category: 'quality',
    purpose: 'Supplier quality management decisions. SCAR reviews, supplier development, qualification.',
    leadAgent: 'quality-engineer',
    whenToUse: 'Supplier quality issues, new supplier qualification, supplier development',
    defaultAgents: ['quality-engineer', 'supply-chain-manager', 'process-engineer'],
    optionalAgents: ['materials-engineer', 'compliance-specialist'],
    maxDeliberationRounds: 6,
    standards: ['ISO 9001', 'IATF 16949', 'Supplier Quality Manual'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Hold suppliers accountable. Develop capability. Protect production.',
    toneKeywords: ['supplier-focused', 'accountable', 'development', 'quality-assured'],
    outputFormat: ['supplier_assessment', 'scar_response', 'development_plan', 'qualification_status'],
  },
];

// =============================================================================
// PRODUCTION MODES
// =============================================================================

export const PRODUCTION_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'production-planning-council',
    name: 'Production Planning Council',
    category: 'production',
    purpose: 'Weekly/monthly production planning and scheduling. S&OP alignment, capacity optimization.',
    leadAgent: 'production-planner',
    whenToUse: 'Weekly planning, S&OP cycles, capacity constraints, schedule changes',
    defaultAgents: ['production-planner', 'plant-manager', 'supply-chain-manager'],
    optionalAgents: ['maintenance-engineer', 'process-engineer'],
    maxDeliberationRounds: 6,
    standards: ['S&OP', 'Lean', 'Demand Planning'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Create executable plans. Balance capacity. Meet customer demand.',
    toneKeywords: ['planned', 'balanced', 'achievable', 'responsive'],
    outputFormat: ['production_schedule', 'capacity_analysis', 'material_requirements', 'risk_assessment'],
  },
  {
    id: 'equipment-reliability-council',
    name: 'Equipment Reliability Council',
    category: 'production',
    purpose: 'Equipment reliability improvement and maintenance strategy. TPM implementation, asset lifecycle.',
    leadAgent: 'maintenance-engineer',
    whenToUse: 'OEE reviews, major breakdown analysis, PM optimization, capital planning',
    defaultAgents: ['maintenance-engineer', 'plant-manager', 'process-engineer'],
    optionalAgents: ['automation-engineer', 'cost-accountant'],
    maxDeliberationRounds: 6,
    standards: ['TPM', 'RCM', 'Asset Management'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Maximize availability. Prevent failures. Optimize maintenance cost.',
    toneKeywords: ['reliable', 'proactive', 'optimized', 'predictive'],
    outputFormat: ['oee_analysis', 'failure_analysis', 'maintenance_strategy', 'investment_plan'],
  },
  {
    id: 'continuous-improvement-council',
    name: 'Continuous Improvement Council',
    category: 'production',
    purpose: 'Kaizen and lean improvement initiatives. Value stream optimization, waste elimination.',
    leadAgent: 'process-engineer',
    whenToUse: 'Kaizen events, VSM exercises, improvement prioritization, lean deployment',
    defaultAgents: ['process-engineer', 'plant-manager', 'quality-engineer'],
    optionalAgents: ['industrial-engineer', 'cost-accountant'],
    maxDeliberationRounds: 8,
    standards: ['Lean', 'Six Sigma', 'Kaizen'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Eliminate waste. Improve flow. Engage everyone in improvement.',
    toneKeywords: ['lean', 'improved', 'waste-free', 'engaged'],
    outputFormat: ['current_state_vsm', 'improvement_opportunities', 'kaizen_plan', 'results_tracking'],
  },
];

// =============================================================================
// SAFETY MODES
// =============================================================================

export const SAFETY_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'hazard-assessment-council',
    name: 'Hazard Assessment Council',
    category: 'safety',
    purpose: 'Job hazard analysis and risk assessment. New process safety review, hazard identification.',
    leadAgent: 'safety-officer',
    whenToUse: 'New processes, job hazard analysis, risk assessments, change management',
    defaultAgents: ['safety-officer', 'process-engineer', 'industrial-engineer'],
    optionalAgents: ['environmental-engineer', 'maintenance-engineer'],
    maxDeliberationRounds: 6,
    standards: ['OSHA', 'ISO 45001', 'Hierarchy of Controls'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Identify all hazards. Assess risks. Implement effective controls.',
    toneKeywords: ['hazard-aware', 'controlled', 'protected', 'verified'],
    outputFormat: ['jha_report', 'risk_assessment', 'control_measures', 'verification_plan'],
  },
  {
    id: 'environmental-compliance-council',
    name: 'Environmental Compliance Council',
    category: 'safety',
    purpose: 'Environmental compliance and sustainability decisions. Permit compliance, emission controls.',
    leadAgent: 'environmental-engineer',
    whenToUse: 'Permit renewals, emission exceedances, waste management, sustainability initiatives',
    defaultAgents: ['environmental-engineer', 'compliance-specialist', 'plant-manager'],
    optionalAgents: ['process-engineer', 'cost-accountant'],
    maxDeliberationRounds: 6,
    standards: ['EPA', 'ISO 14001', 'State Environmental Regulations'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Maintain compliance. Minimize environmental impact. Drive sustainability.',
    toneKeywords: ['compliant', 'sustainable', 'responsible', 'proactive'],
    outputFormat: ['compliance_status', 'environmental_metrics', 'improvement_plan', 'regulatory_filings'],
  },
];

// =============================================================================
// SUPPLY CHAIN MODES
// =============================================================================

export const SUPPLY_CHAIN_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'supply-risk-council',
    name: 'Supply Risk Council',
    category: 'supply-chain',
    purpose: 'Supply chain risk assessment and mitigation. Supplier disruptions, single source risks.',
    leadAgent: 'supply-chain-manager',
    whenToUse: 'Supplier disruptions, risk assessments, dual-sourcing decisions, geopolitical risks',
    defaultAgents: ['supply-chain-manager', 'production-planner', 'quality-engineer'],
    optionalAgents: ['cost-accountant', 'compliance-specialist'],
    maxDeliberationRounds: 6,
    standards: ['Supply Chain Risk Management', 'Business Continuity'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Identify risks early. Develop mitigation strategies. Ensure continuity.',
    toneKeywords: ['risk-aware', 'mitigated', 'resilient', 'prepared'],
    outputFormat: ['risk_assessment', 'mitigation_strategies', 'contingency_plans', 'monitoring_plan'],
  },
  {
    id: 'inventory-optimization-council',
    name: 'Inventory Optimization Council',
    category: 'supply-chain',
    purpose: 'Inventory strategy and optimization. Safety stock levels, obsolescence management.',
    leadAgent: 'supply-chain-manager',
    whenToUse: 'Inventory reviews, working capital optimization, obsolescence risk, stockout prevention',
    defaultAgents: ['supply-chain-manager', 'production-planner', 'cost-accountant'],
    optionalAgents: ['plant-manager', 'quality-engineer'],
    maxDeliberationRounds: 5,
    standards: ['Inventory Management', 'Lean', 'Working Capital'],
    safetyGate: false,
    auditTrailRequired: true,
    primeDirective: 'Right inventory, right place, right time. Minimize waste and cost.',
    toneKeywords: ['optimized', 'lean', 'available', 'cost-effective'],
    outputFormat: ['inventory_analysis', 'safety_stock_review', 'obsolescence_plan', 'optimization_actions'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_MANUFACTURING_MODES: ManufacturingCouncilMode[] = [
  {
    id: 'automation-investment-council',
    name: 'Automation Investment Council',
    category: 'specialized',
    purpose: 'Automation and Industry 4.0 investment decisions. ROI analysis, technology selection.',
    leadAgent: 'automation-engineer',
    whenToUse: 'Capital requests, automation projects, technology evaluation, Industry 4.0 initiatives',
    defaultAgents: ['automation-engineer', 'plant-manager', 'process-engineer', 'cost-accountant'],
    optionalAgents: ['maintenance-engineer', 'safety-officer'],
    maxDeliberationRounds: 8,
    standards: ['Industry 4.0', 'ROI Analysis', 'Technology Roadmap'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Invest in proven value. Integrate effectively. Enable workforce.',
    toneKeywords: ['roi-positive', 'integrated', 'scalable', 'workforce-enabled'],
    outputFormat: ['investment_case', 'technology_assessment', 'implementation_plan', 'roi_analysis'],
  },
  {
    id: 'product-recall-council',
    name: 'Product Recall Council',
    category: 'specialized',
    purpose: 'Product recall and field action decisions. Customer notification, remediation strategy.',
    leadAgent: 'quality-engineer',
    whenToUse: 'Potential recalls, field failures, safety concerns, regulatory notifications',
    defaultAgents: ['quality-engineer', 'plant-manager', 'compliance-specialist', 'supply-chain-manager'],
    optionalAgents: ['safety-officer', 'cost-accountant'],
    maxDeliberationRounds: 6,
    standards: ['Recall Procedures', 'Regulatory Requirements', 'Customer Communication'],
    safetyGate: true,
    auditTrailRequired: true,
    primeDirective: 'Protect customers. Act decisively. Communicate transparently.',
    toneKeywords: ['customer-first', 'decisive', 'transparent', 'compliant'],
    outputFormat: ['recall_assessment', 'notification_plan', 'remediation_strategy', 'communication_plan'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_MANUFACTURING_MODES: ManufacturingCouncilMode[] = [
  ...MAJOR_MANUFACTURING_MODES,
  ...QUALITY_MODES,
  ...PRODUCTION_MODES,
  ...SAFETY_MODES,
  ...SUPPLY_CHAIN_MODES,
  ...SPECIALIZED_MANUFACTURING_MODES,
];

export const MANUFACTURING_MODE_MAP: Map<string, ManufacturingCouncilMode> = new Map(
  ALL_MANUFACTURING_MODES.map(mode => [mode.id, mode])
);

export function getManufacturingMode(modeId: string): ManufacturingCouncilMode | undefined {
  return MANUFACTURING_MODE_MAP.get(modeId);
}

export function getManufacturingModesByCategory(category: ManufacturingModeCategory): ManufacturingCouncilMode[] {
  return ALL_MANUFACTURING_MODES.filter(mode => mode.category === category);
}

export const MANUFACTURING_MODE_STATS = {
  total: ALL_MANUFACTURING_MODES.length,
  byCategory: {
    major: MAJOR_MANUFACTURING_MODES.length,
    quality: QUALITY_MODES.length,
    production: PRODUCTION_MODES.length,
    safety: SAFETY_MODES.length,
    'supply-chain': SUPPLY_CHAIN_MODES.length,
    specialized: SPECIALIZED_MANUFACTURING_MODES.length,
  },
};
