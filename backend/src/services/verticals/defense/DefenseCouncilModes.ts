// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA DEFENSE & NATIONAL SECURITY COUNCIL MODES
 *
 * 35+ specialized deliberation modes for the Defense/Government Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Compliance Frameworks: FedRAMP High, CMMC Level 3, ITAR, NIST 800-171, IL4/IL5
 * Doctrine: Joint Publication 5-0, MDMP, JOPP
 */

// =============================================================================
// TYPES
// =============================================================================

export type DefenseModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'operations'      // Operational planning modes
  | 'intelligence'    // Intelligence and threat modes
  | 'acquisition'     // Defense acquisition modes
  | 'cyber'           // Cyber and information warfare modes
  | 'specialized';    // Specialized defense modes

export interface DefenseCouncilMode {
  id: string;
  name: string;
  category: DefenseModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  complianceFrameworks: string[];
  classificationLevel: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  opsecRequired: boolean;
  legalReviewRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_DEFENSE_MODES: DefenseCouncilMode[] = [
  {
    id: 'mission-planning-council',
    name: 'Mission Planning Council',
    category: 'major',
    purpose: 'Full Joint Operation Planning Process (JOPP) deliberation. COA development, wargaming, and decision briefing.',
    leadAgent: 'mission-commander',
    whenToUse: 'Major operations, campaign planning, contingency planning',
    defaultAgents: ['mission-commander', 'threat-analyst', 'opsec-officer', 'logistics-coordinator', 'cyber-warfare-specialist', 'legal-advisor-ucmj', 'force-protection-officer', 'acquisition-specialist'],
    optionalAgents: ['intelligence-analyst', 'targeting-officer', 'fires-coordinator', 'special-operations', 'coalition-liaison'],
    maxDeliberationRounds: 15,
    complianceFrameworks: ['JP 5-0', 'MDMP', 'JOPP', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Develop feasible, acceptable, suitable COAs. Commander\'s intent drives planning.',
    toneKeywords: ['mission-focused', 'joint', 'effects-based', 'risk-informed'],
    outputFormat: ['mission_analysis', 'coa_comparison', 'wargame_results', 'decision_brief', 'opord_draft'],
  },
  {
    id: 'threat-assessment-war-room',
    name: 'Threat Assessment War Room',
    category: 'major',
    purpose: 'Comprehensive threat analysis and intelligence preparation of the operational environment (IPOE).',
    leadAgent: 'threat-analyst',
    whenToUse: 'Pre-mission intelligence, threat updates, strategic warning',
    defaultAgents: ['threat-analyst', 'mission-commander', 'opsec-officer', 'cyber-warfare-specialist', 'force-protection-officer'],
    optionalAgents: ['intelligence-analyst', 'space-operations', 'targeting-officer'],
    maxDeliberationRounds: 12,
    complianceFrameworks: ['JP 2-0', 'IPOE', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Accurate threat assessment with stated confidence levels. Intelligence gaps identified.',
    toneKeywords: ['analytical', 'threat-focused', 'confidence-stated', 'gap-aware'],
    outputFormat: ['threat_assessment', 'ipoe_products', 'collection_requirements', 'warning_indicators'],
  },
  {
    id: 'acquisition-review-board',
    name: 'Acquisition Review Board',
    category: 'major',
    purpose: 'Defense acquisition milestone review. Cost, schedule, performance, and risk assessment.',
    leadAgent: 'acquisition-specialist',
    whenToUse: 'Milestone decisions, contract awards, program reviews',
    defaultAgents: ['acquisition-specialist', 'mission-commander', 'legal-advisor-ucmj', 'logistics-coordinator', 'cyber-warfare-specialist'],
    optionalAgents: ['engineer-planner', 'communications-officer'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['FAR', 'DFARS', 'DoD 5000', 'CMMC', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Deliver capability on time, on budget. Risk-informed decisions.',
    toneKeywords: ['acquisition', 'milestone', 'risk-informed', 'capability-focused'],
    outputFormat: ['acquisition_strategy', 'risk_assessment', 'cost_estimate', 'schedule_analysis', 'decision_memo'],
  },
  {
    id: 'opsec-review-council',
    name: 'OPSEC Review Council',
    category: 'major',
    purpose: 'Operations security review for plans, products, and communications.',
    leadAgent: 'opsec-officer',
    whenToUse: 'Pre-publication review, plan approval, information release',
    defaultAgents: ['opsec-officer', 'mission-commander', 'threat-analyst', 'legal-advisor-ucmj'],
    optionalAgents: ['intelligence-analyst', 'psyop-officer', 'communications-officer'],
    maxDeliberationRounds: 6,
    complianceFrameworks: ['OPSEC Program', 'NIST 800-171', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Protect critical information. Deny adversary decision advantage.',
    toneKeywords: ['opsec', 'critical-info', 'indicator-aware', 'countermeasure'],
    outputFormat: ['opsec_assessment', 'critical_info_list', 'vulnerability_analysis', 'countermeasures'],
  },
  {
    id: 'after-action-review',
    name: 'After Action Review',
    category: 'major',
    purpose: 'Structured review of completed operations. Lessons learned, best practices, corrective actions.',
    leadAgent: 'mission-commander',
    whenToUse: 'Post-operation, exercise completion, incident review',
    defaultAgents: ['mission-commander', 'threat-analyst', 'logistics-coordinator', 'force-protection-officer', 'legal-advisor-ucmj'],
    optionalAgents: ['intelligence-analyst', 'targeting-officer', 'medical-planner'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['AAR Process', 'Lessons Learned', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Honest assessment. What happened, why, how to improve.',
    toneKeywords: ['candid', 'lessons-learned', 'improvement-focused', 'non-attribution'],
    outputFormat: ['aar_summary', 'observations', 'lessons_learned', 'recommendations', 'action_items'],
  },
];

// =============================================================================
// OPERATIONS PLANNING MODES
// =============================================================================

export const OPERATIONS_MODES: DefenseCouncilMode[] = [
  {
    id: 'roe-analysis',
    name: 'Rules of Engagement Analysis',
    category: 'operations',
    purpose: 'Rules of engagement development and analysis. LOAC compliance, self-defense, escalation.',
    leadAgent: 'legal-advisor-ucmj',
    whenToUse: 'ROE development, mission-specific ROE, ROE interpretation',
    defaultAgents: ['legal-advisor-ucmj', 'mission-commander', 'threat-analyst', 'force-protection-officer'],
    optionalAgents: ['targeting-officer', 'special-operations'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['LOAC', 'SROE', 'JP 1-04', 'Geneva Conventions'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'ROE enables mission while ensuring LOAC compliance.',
    toneKeywords: ['legal', 'roe', 'loac-compliant', 'self-defense'],
    outputFormat: ['roe_analysis', 'legal_review', 'scenario_matrix', 'training_requirements'],
  },
  {
    id: 'force-deployment',
    name: 'Force Deployment Planning',
    category: 'operations',
    purpose: 'Time-phased force deployment planning. TPFDD development, strategic lift.',
    leadAgent: 'logistics-coordinator',
    whenToUse: 'Deployment planning, force flow, strategic mobility',
    defaultAgents: ['logistics-coordinator', 'mission-commander', 'force-protection-officer', 'communications-officer'],
    optionalAgents: ['engineer-planner', 'medical-planner', 'air-defense'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 4-0', 'JOPES', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Right forces, right place, right time. Sustainable deployment.',
    toneKeywords: ['deployment', 'force-flow', 'strategic-lift', 'sustainable'],
    outputFormat: ['deployment_plan', 'tpfdd', 'lift_requirements', 'reception_plan'],
  },
  {
    id: 'targeting-council',
    name: 'Targeting Council',
    category: 'operations',
    purpose: 'Joint targeting cycle. Target development, weaponeering, CDE, BDA.',
    leadAgent: 'targeting-officer',
    whenToUse: 'Target nomination, strike planning, BDA review',
    defaultAgents: ['targeting-officer', 'mission-commander', 'legal-advisor-ucmj', 'threat-analyst', 'fires-coordinator'],
    optionalAgents: ['intelligence-analyst', 'special-operations', 'cyber-warfare-specialist'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 3-60', 'LOAC', 'CDE Methodology', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Achieve effects while minimizing collateral damage. Legal review mandatory.',
    toneKeywords: ['targeting', 'effects-based', 'cde', 'legal-review'],
    outputFormat: ['target_package', 'weaponeering', 'cde_estimate', 'legal_review', 'bda_requirements'],
  },
  {
    id: 'crisis-response',
    name: 'Crisis Response Planning',
    category: 'operations',
    purpose: 'Rapid crisis response planning. Time-constrained COA development.',
    leadAgent: 'mission-commander',
    whenToUse: 'Crisis action, time-sensitive planning, rapid response',
    defaultAgents: ['mission-commander', 'threat-analyst', 'logistics-coordinator', 'legal-advisor-ucmj', 'force-protection-officer'],
    optionalAgents: ['special-operations', 'cyber-warfare-specialist', 'medical-planner'],
    maxDeliberationRounds: 6,
    complianceFrameworks: ['CAP', 'JP 5-0', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Speed with acceptable risk. Commander\'s decision authority.',
    toneKeywords: ['crisis', 'rapid', 'time-constrained', 'decisive'],
    outputFormat: ['situation_assessment', 'coa_sketch', 'risk_assessment', 'execution_checklist'],
  },
  {
    id: 'joint-fires-integration',
    name: 'Joint Fires Integration',
    category: 'operations',
    purpose: 'Integration of joint fires. Fire support coordination, deconfliction.',
    leadAgent: 'fires-coordinator',
    whenToUse: 'Fire support planning, joint fires coordination, airspace deconfliction',
    defaultAgents: ['fires-coordinator', 'mission-commander', 'targeting-officer', 'air-defense', 'legal-advisor-ucmj'],
    optionalAgents: ['cyber-warfare-specialist', 'space-operations'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 3-09', 'JFIRE', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Synchronized fires. Deconflicted airspace. Responsive support.',
    toneKeywords: ['fires', 'synchronized', 'deconflicted', 'responsive'],
    outputFormat: ['fire_support_plan', 'airspace_coordination', 'target_list', 'fscm'],
  },
];

// =============================================================================
// INTELLIGENCE MODES
// =============================================================================

export const INTELLIGENCE_MODES: DefenseCouncilMode[] = [
  {
    id: 'intelligence-preparation',
    name: 'Intelligence Preparation',
    category: 'intelligence',
    purpose: 'Intelligence Preparation of the Operational Environment (IPOE).',
    leadAgent: 'threat-analyst',
    whenToUse: 'Pre-mission analysis, area study, threat assessment',
    defaultAgents: ['threat-analyst', 'intelligence-analyst', 'opsec-officer', 'cyber-warfare-specialist'],
    optionalAgents: ['space-operations', 'civil-affairs'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 2-01.3', 'IPOE', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Comprehensive OE understanding. Threat COAs developed.',
    toneKeywords: ['ipoe', 'threat-coa', 'terrain', 'weather'],
    outputFormat: ['area_assessment', 'threat_coas', 'hvt_list', 'collection_plan'],
  },
  {
    id: 'collection-management',
    name: 'Collection Management',
    category: 'intelligence',
    purpose: 'Intelligence collection planning and management. ISR allocation.',
    leadAgent: 'intelligence-analyst',
    whenToUse: 'Collection planning, ISR tasking, gap analysis',
    defaultAgents: ['intelligence-analyst', 'threat-analyst', 'space-operations', 'cyber-warfare-specialist'],
    optionalAgents: ['special-operations', 'communications-officer'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 2-01', 'Collection Management', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Answer PIRs. Optimize collection assets. Close intelligence gaps.',
    toneKeywords: ['collection', 'isr', 'pir', 'gap-closure'],
    outputFormat: ['collection_plan', 'isr_allocation', 'pir_matrix', 'gap_analysis'],
  },
  {
    id: 'counterintelligence',
    name: 'Counterintelligence Assessment',
    category: 'intelligence',
    purpose: 'Counterintelligence threat assessment and countermeasures.',
    leadAgent: 'opsec-officer',
    whenToUse: 'CI threat assessment, insider threat, foreign intelligence',
    defaultAgents: ['opsec-officer', 'threat-analyst', 'intelligence-analyst', 'force-protection-officer'],
    optionalAgents: ['cyber-warfare-specialist', 'legal-advisor-ucmj'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['CI Program', 'Insider Threat', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Identify and counter foreign intelligence threats.',
    toneKeywords: ['counterintelligence', 'insider-threat', 'foreign-intel', 'countermeasures'],
    outputFormat: ['ci_assessment', 'threat_indicators', 'countermeasures', 'reporting_requirements'],
  },
];

// =============================================================================
// ACQUISITION MODES
// =============================================================================

export const ACQUISITION_MODES: DefenseCouncilMode[] = [
  {
    id: 'source-selection',
    name: 'Source Selection',
    category: 'acquisition',
    purpose: 'Competitive source selection. Proposal evaluation, best value determination.',
    leadAgent: 'acquisition-specialist',
    whenToUse: 'Contract competition, proposal evaluation, award decision',
    defaultAgents: ['acquisition-specialist', 'legal-advisor-ucmj', 'mission-commander'],
    optionalAgents: ['engineer-planner', 'cyber-warfare-specialist'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['FAR 15', 'DFARS', 'Source Selection', 'FedRAMP High'],
    classificationLevel: 'CUI',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Fair competition. Best value for the government.',
    toneKeywords: ['source-selection', 'best-value', 'fair-competition', 'documented'],
    outputFormat: ['evaluation_criteria', 'proposal_analysis', 'tradeoff_analysis', 'selection_decision'],
  },
  {
    id: 'supply-chain-security',
    name: 'Supply Chain Security Review',
    category: 'acquisition',
    purpose: 'Defense supply chain risk assessment. SCRM, counterfeit prevention.',
    leadAgent: 'acquisition-specialist',
    whenToUse: 'Supplier vetting, SCRM assessment, counterfeit risk',
    defaultAgents: ['acquisition-specialist', 'opsec-officer', 'cyber-warfare-specialist', 'logistics-coordinator'],
    optionalAgents: ['intelligence-analyst', 'legal-advisor-ucmj'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['SCRM', 'CMMC', 'Section 889', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'CUI',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Secure supply chain. No adversary access to critical systems.',
    toneKeywords: ['scrm', 'supply-chain', 'counterfeit', 'trusted-supplier'],
    outputFormat: ['scrm_assessment', 'supplier_risk', 'counterfeit_risk', 'mitigation_plan'],
  },
  {
    id: 'technology-protection',
    name: 'Technology Protection',
    category: 'acquisition',
    purpose: 'Critical technology protection. Anti-tamper, program protection.',
    leadAgent: 'opsec-officer',
    whenToUse: 'Program protection planning, technology transfer, export control',
    defaultAgents: ['opsec-officer', 'acquisition-specialist', 'cyber-warfare-specialist', 'legal-advisor-ucmj'],
    optionalAgents: ['intelligence-analyst', 'engineer-planner'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['PPP', 'Anti-Tamper', 'ITAR', 'EAR', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Protect critical technology from adversary exploitation.',
    toneKeywords: ['technology-protection', 'anti-tamper', 'export-control', 'cpi'],
    outputFormat: ['ppp', 'cpi_list', 'anti_tamper_plan', 'export_assessment'],
  },
  {
    id: 'diu-rapid-acquisition',
    name: 'DIU Rapid Acquisition',
    category: 'acquisition',
    purpose: 'Defense Innovation Unit rapid acquisition. Commercial solutions for defense.',
    leadAgent: 'acquisition-specialist',
    whenToUse: 'Commercial technology adoption, OTA, rapid prototyping',
    defaultAgents: ['acquisition-specialist', 'mission-commander', 'cyber-warfare-specialist', 'legal-advisor-ucmj'],
    optionalAgents: ['engineer-planner', 'communications-officer'],
    maxDeliberationRounds: 6,
    complianceFrameworks: ['OTA', 'DIU Process', 'CMMC', 'FedRAMP High'],
    classificationLevel: 'CUI',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Rapid capability delivery. Commercial innovation for defense.',
    toneKeywords: ['rapid', 'commercial', 'innovation', 'prototype'],
    outputFormat: ['capability_need', 'market_research', 'ota_strategy', 'prototype_plan'],
  },
];

// =============================================================================
// CYBER MODES
// =============================================================================

export const CYBER_MODES: DefenseCouncilMode[] = [
  {
    id: 'cyber-operations-planning',
    name: 'Cyber Operations Planning',
    category: 'cyber',
    purpose: 'Offensive and defensive cyber operations planning.',
    leadAgent: 'cyber-warfare-specialist',
    whenToUse: 'OCO/DCO planning, cyber effects, network defense',
    defaultAgents: ['cyber-warfare-specialist', 'mission-commander', 'legal-advisor-ucmj', 'threat-analyst', 'opsec-officer'],
    optionalAgents: ['intelligence-analyst', 'targeting-officer', 'communications-officer'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 3-12', 'Cyber Operations', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'TOP_SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Achieve cyber effects. Protect friendly networks. Legal compliance.',
    toneKeywords: ['cyber', 'oco', 'dco', 'effects-based'],
    outputFormat: ['cyber_assessment', 'target_analysis', 'effects_plan', 'legal_review', 'deconfliction'],
  },
  {
    id: 'incident-response',
    name: 'Cyber Incident Response',
    category: 'cyber',
    purpose: 'Cyber incident response and recovery. Breach containment, forensics.',
    leadAgent: 'cyber-warfare-specialist',
    whenToUse: 'Cyber incidents, breaches, malware detection',
    defaultAgents: ['cyber-warfare-specialist', 'opsec-officer', 'communications-officer', 'force-protection-officer'],
    optionalAgents: ['intelligence-analyst', 'legal-advisor-ucmj'],
    maxDeliberationRounds: 6,
    complianceFrameworks: ['CIRT', 'NIST 800-61', 'FedRAMP High', 'NIST 800-171'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: false,
    primeDirective: 'Contain incident. Preserve evidence. Restore operations.',
    toneKeywords: ['incident', 'containment', 'forensics', 'recovery'],
    outputFormat: ['incident_assessment', 'containment_actions', 'forensic_plan', 'recovery_timeline'],
  },
  {
    id: 'information-warfare',
    name: 'Information Warfare Council',
    category: 'cyber',
    purpose: 'Information operations integration. PSYOP, MISO, public affairs.',
    leadAgent: 'psyop-officer',
    whenToUse: 'Information operations, influence campaigns, strategic communications',
    defaultAgents: ['psyop-officer', 'mission-commander', 'legal-advisor-ucmj', 'cyber-warfare-specialist', 'opsec-officer'],
    optionalAgents: ['civil-affairs', 'intelligence-analyst', 'coalition-liaison'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 3-13', 'Information Operations', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Achieve information advantage. Influence target audiences.',
    toneKeywords: ['information-ops', 'influence', 'psyop', 'strategic-comms'],
    outputFormat: ['io_assessment', 'target_audience', 'message_themes', 'dissemination_plan'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_DEFENSE_MODES: DefenseCouncilMode[] = [
  {
    id: 'coalition-coordination',
    name: 'Coalition Coordination',
    category: 'specialized',
    purpose: 'Multinational operations coordination. Interoperability, information sharing.',
    leadAgent: 'coalition-liaison',
    whenToUse: 'Coalition operations, partner coordination, combined planning',
    defaultAgents: ['coalition-liaison', 'mission-commander', 'legal-advisor-ucmj', 'opsec-officer'],
    optionalAgents: ['intelligence-analyst', 'logistics-coordinator', 'communications-officer'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['Coalition Operations', 'Foreign Disclosure', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Unity of effort. Interoperability. Appropriate information sharing.',
    toneKeywords: ['coalition', 'interoperability', 'combined', 'partner'],
    outputFormat: ['coordination_plan', 'interoperability_assessment', 'disclosure_guidance', 'combined_procedures'],
  },
  {
    id: 'personnel-recovery',
    name: 'Personnel Recovery',
    category: 'specialized',
    purpose: 'Personnel recovery planning. CSAR, NEO, hostage rescue.',
    leadAgent: 'force-protection-officer',
    whenToUse: 'PR planning, isolated personnel, NEO',
    defaultAgents: ['force-protection-officer', 'mission-commander', 'special-operations', 'intelligence-analyst', 'medical-planner'],
    optionalAgents: ['legal-advisor-ucmj', 'logistics-coordinator'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 3-50', 'Personnel Recovery', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Return isolated personnel to friendly control.',
    toneKeywords: ['personnel-recovery', 'csar', 'neo', 'isolated-personnel'],
    outputFormat: ['pr_plan', 'evasion_plan', 'recovery_assets', 'authentication'],
  },
  {
    id: 'humanitarian-assistance',
    name: 'Humanitarian Assistance',
    category: 'specialized',
    purpose: 'Humanitarian assistance and disaster relief (HADR) planning.',
    leadAgent: 'civil-affairs',
    whenToUse: 'HADR operations, foreign disaster response, civil support',
    defaultAgents: ['civil-affairs', 'mission-commander', 'logistics-coordinator', 'medical-planner', 'legal-advisor-ucmj'],
    optionalAgents: ['engineer-planner', 'communications-officer', 'coalition-liaison'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 3-29', 'HADR', 'FedRAMP High'],
    classificationLevel: 'UNCLASSIFIED',
    opsecRequired: false,
    legalReviewRequired: true,
    primeDirective: 'Save lives. Alleviate suffering. Support civil authorities.',
    toneKeywords: ['humanitarian', 'disaster-relief', 'civil-support', 'life-saving'],
    outputFormat: ['hadr_plan', 'needs_assessment', 'distribution_plan', 'coordination_matrix'],
  },
  {
    id: 'space-operations-council',
    name: 'Space Operations Council',
    category: 'specialized',
    purpose: 'Space domain operations planning. SSA, counterspace, space support.',
    leadAgent: 'space-operations',
    whenToUse: 'Space operations, satellite coordination, counterspace',
    defaultAgents: ['space-operations', 'mission-commander', 'cyber-warfare-specialist', 'communications-officer'],
    optionalAgents: ['intelligence-analyst', 'targeting-officer'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 3-14', 'Space Operations', 'FedRAMP High'],
    classificationLevel: 'TOP_SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Space superiority. Protect space assets. Deny adversary space advantage.',
    toneKeywords: ['space', 'ssa', 'counterspace', 'satellite'],
    outputFormat: ['space_assessment', 'ssa_products', 'space_support_plan', 'counterspace_options'],
  },
  {
    id: 'special-operations-council',
    name: 'Special Operations Council',
    category: 'specialized',
    purpose: 'Special operations planning. DA, SR, UW, FID integration.',
    leadAgent: 'special-operations',
    whenToUse: 'SOF missions, special operations integration, sensitive activities',
    defaultAgents: ['special-operations', 'mission-commander', 'intelligence-analyst', 'legal-advisor-ucmj', 'opsec-officer'],
    optionalAgents: ['targeting-officer', 'psyop-officer', 'cyber-warfare-specialist'],
    maxDeliberationRounds: 10,
    complianceFrameworks: ['JP 3-05', 'Special Operations', 'FedRAMP High'],
    classificationLevel: 'TOP_SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Surgical precision. Strategic effects. Minimal footprint.',
    toneKeywords: ['special-ops', 'precision', 'strategic-effect', 'sensitive'],
    outputFormat: ['sof_assessment', 'mission_plan', 'risk_assessment', 'integration_plan'],
  },
  {
    id: 'wmd-response',
    name: 'WMD Response Council',
    category: 'specialized',
    purpose: 'Weapons of mass destruction response. CBRN defense, consequence management.',
    leadAgent: 'force-protection-officer',
    whenToUse: 'WMD threat, CBRN incident, consequence management',
    defaultAgents: ['force-protection-officer', 'mission-commander', 'medical-planner', 'intelligence-analyst', 'legal-advisor-ucmj'],
    optionalAgents: ['civil-affairs', 'logistics-coordinator', 'engineer-planner'],
    maxDeliberationRounds: 8,
    complianceFrameworks: ['JP 3-11', 'CBRN Defense', 'FedRAMP High'],
    classificationLevel: 'SECRET',
    opsecRequired: true,
    legalReviewRequired: true,
    primeDirective: 'Protect the force. Contain contamination. Enable continued operations.',
    toneKeywords: ['wmd', 'cbrn', 'consequence-management', 'contamination'],
    outputFormat: ['threat_assessment', 'protection_measures', 'decontamination_plan', 'medical_response'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_DEFENSE_MODES: DefenseCouncilMode[] = [
  ...MAJOR_DEFENSE_MODES,
  ...OPERATIONS_MODES,
  ...INTELLIGENCE_MODES,
  ...ACQUISITION_MODES,
  ...CYBER_MODES,
  ...SPECIALIZED_DEFENSE_MODES,
];

export const DEFENSE_MODE_MAP: Map<string, DefenseCouncilMode> = new Map(
  ALL_DEFENSE_MODES.map(mode => [mode.id, mode])
);

/**
 * Get a defense mode by ID
 */
export function getDefenseMode(modeId: string): DefenseCouncilMode | undefined {
  return DEFENSE_MODE_MAP.get(modeId);
}

/**
 * Get all defense modes by category
 */
export function getDefenseModesByCategory(category: DefenseModeCategory): DefenseCouncilMode[] {
  return ALL_DEFENSE_MODES.filter(mode => mode.category === category);
}

/**
 * Get defense modes by classification level
 */
export function getDefenseModesByClassification(level: DefenseCouncilMode['classificationLevel']): DefenseCouncilMode[] {
  return ALL_DEFENSE_MODES.filter(mode => mode.classificationLevel === level);
}

/**
 * Get defense modes requiring legal review
 */
export function getLegalReviewModes(): DefenseCouncilMode[] {
  return ALL_DEFENSE_MODES.filter(mode => mode.legalReviewRequired);
}

/**
 * Get defense modes by compliance framework
 */
export function getDefenseModesByFramework(framework: string): DefenseCouncilMode[] {
  return ALL_DEFENSE_MODES.filter(mode =>
    mode.complianceFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

/**
 * Get defense modes by lead agent
 */
export function getDefenseModesByLeadAgent(leadAgent: string): DefenseCouncilMode[] {
  return ALL_DEFENSE_MODES.filter(mode => mode.leadAgent === leadAgent);
}

// Summary stats
export const DEFENSE_MODES_SUMMARY = {
  totalModes: ALL_DEFENSE_MODES.length,
  majorModes: MAJOR_DEFENSE_MODES.length,
  operationsModes: OPERATIONS_MODES.length,
  intelligenceModes: INTELLIGENCE_MODES.length,
  acquisitionModes: ACQUISITION_MODES.length,
  cyberModes: CYBER_MODES.length,
  specializedModes: SPECIALIZED_DEFENSE_MODES.length,
  legalReviewRequired: ALL_DEFENSE_MODES.filter(m => m.legalReviewRequired).length,
  topSecretModes: ALL_DEFENSE_MODES.filter(m => m.classificationLevel === 'TOP_SECRET').length,
};
