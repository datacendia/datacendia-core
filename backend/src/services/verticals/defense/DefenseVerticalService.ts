// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA DEFENSE & NATIONAL SECURITY VERTICAL SERVICE
 * 
 * Complete vertical implementation following the 6-layer pattern:
 * 1. Authoritative Data Connectors
 * 2. Vertical Knowledge Base (RAG)
 * 3. Compliance & Liability Mapping
 * 4. Decision Schemas
 * 5. Agent Presets
 * 6. Externally Defensible Outputs
 * 
 * Compliance: FedRAMP High, CMMC Level 3, ITAR, NIST 800-171, IL4/IL5
 */

import { 
  ALL_DEFENSE_AGENTS, 
  DEFAULT_DEFENSE_AGENTS,
  OPTIONAL_DEFENSE_AGENTS,
  SILENT_GUARD_DEFENSE_AGENTS,
  getDefenseAgent,
  getDefenseAgentsByCategory,
  buildDefenseTeam,
  DefenseAgent,
  DEFENSE_AGENTS_SUMMARY
} from './DefenseAgents.js';

import {
  ALL_DEFENSE_MODES,
  getDefenseMode,
  getDefenseModesByCategory,
  getDefenseModesByClassification,
  DefenseCouncilMode,
  DEFENSE_MODES_SUMMARY
} from './DefenseCouncilModes.js';

// =============================================================================
// TYPES
// =============================================================================

export interface DefenseDecisionSchema {
  id: string;
  name: string;
  description: string;
  fields: DefenseSchemaField[];
  requiredApprovals: string[];
  classificationLevel: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  retentionYears: number;
}

export interface DefenseSchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'object';
  required: boolean;
  classification?: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  description: string;
  enumValues?: string[];
}

export interface DefenseComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  applicableModes: string[];
  auditFrequency: 'continuous' | 'annual' | 'biennial';
}

export interface DefenseDataConnector {
  id: string;
  name: string;
  type: 'api' | 'file' | 'database' | 'message_queue';
  classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  protocols: string[];
  authMethods: string[];
}

// =============================================================================
// DECISION SCHEMAS
// =============================================================================

export const DEFENSE_DECISION_SCHEMAS: DefenseDecisionSchema[] = [
  {
    id: 'mission-order',
    name: 'Mission Order (OPORD/FRAGORD)',
    description: 'Operational order or fragmentary order for mission execution',
    fields: [
      { name: 'situation', type: 'object', required: true, description: 'Enemy, friendly, attachments/detachments' },
      { name: 'mission', type: 'string', required: true, description: 'Who, what, when, where, why' },
      { name: 'execution', type: 'object', required: true, description: 'Concept of operations, tasks, coordinating instructions' },
      { name: 'sustainment', type: 'object', required: true, description: 'Logistics, personnel, health services' },
      { name: 'command_signal', type: 'object', required: true, description: 'Command relationships, signal instructions' },
      { name: 'classification', type: 'enum', required: true, enumValues: ['UNCLASSIFIED', 'CUI', 'SECRET', 'TOP_SECRET'], description: 'Classification level' },
      { name: 'dtg', type: 'string', required: true, description: 'Date-time group' },
      { name: 'issuing_authority', type: 'string', required: true, description: 'Commander issuing the order' },
    ],
    requiredApprovals: ['mission-commander', 'legal-advisor-ucmj'],
    classificationLevel: 'SECRET',
    retentionYears: 25,
  },
  {
    id: 'targeting-decision',
    name: 'Targeting Decision Package',
    description: 'Target nomination and engagement authorization',
    fields: [
      { name: 'target_id', type: 'string', required: true, description: 'Unique target identifier' },
      { name: 'target_type', type: 'enum', required: true, enumValues: ['deliberate', 'dynamic', 'time_sensitive'], description: 'Target category' },
      { name: 'target_description', type: 'string', required: true, description: 'Target description and significance' },
      { name: 'desired_effects', type: 'array', required: true, description: 'Desired effects on target' },
      { name: 'weaponeering', type: 'object', required: true, description: 'Weapon-target pairing and delivery method' },
      { name: 'cde_level', type: 'number', required: true, description: 'Collateral damage estimate level (1-5)' },
      { name: 'legal_review', type: 'object', required: true, description: 'LOAC compliance review' },
      { name: 'approval_authority', type: 'string', required: true, description: 'Authority level required for engagement' },
    ],
    requiredApprovals: ['targeting-officer', 'legal-advisor-ucmj', 'mission-commander'],
    classificationLevel: 'SECRET',
    retentionYears: 50,
  },
  {
    id: 'acquisition-decision',
    name: 'Acquisition Decision Memo',
    description: 'Defense acquisition milestone or contract decision',
    fields: [
      { name: 'program_name', type: 'string', required: true, description: 'Program or contract name' },
      { name: 'decision_type', type: 'enum', required: true, enumValues: ['milestone', 'contract_award', 'modification', 'termination'], description: 'Type of acquisition decision' },
      { name: 'cost_estimate', type: 'object', required: true, description: 'Cost estimate and basis' },
      { name: 'schedule', type: 'object', required: true, description: 'Schedule milestones' },
      { name: 'risk_assessment', type: 'object', required: true, description: 'Technical, cost, schedule risks' },
      { name: 'compliance_check', type: 'object', required: true, description: 'FAR/DFARS compliance verification' },
      { name: 'approval_authority', type: 'string', required: true, description: 'Milestone decision authority' },
    ],
    requiredApprovals: ['acquisition-specialist', 'legal-advisor-ucmj'],
    classificationLevel: 'CUI',
    retentionYears: 10,
  },
  {
    id: 'intelligence-assessment',
    name: 'Intelligence Assessment',
    description: 'Formal intelligence product with confidence levels',
    fields: [
      { name: 'subject', type: 'string', required: true, description: 'Assessment subject' },
      { name: 'key_judgments', type: 'array', required: true, description: 'Key analytic judgments' },
      { name: 'confidence_level', type: 'enum', required: true, enumValues: ['low', 'moderate', 'high'], description: 'Overall confidence' },
      { name: 'sources', type: 'array', required: true, classification: 'SECRET', description: 'Source summary (not specific sources)' },
      { name: 'intelligence_gaps', type: 'array', required: true, description: 'Identified gaps' },
      { name: 'alternative_hypotheses', type: 'array', required: false, description: 'Alternative explanations considered' },
      { name: 'validity_period', type: 'string', required: true, description: 'Assessment validity timeframe' },
    ],
    requiredApprovals: ['threat-analyst', 'intelligence-analyst'],
    classificationLevel: 'SECRET',
    retentionYears: 25,
  },
  {
    id: 'roe-authorization',
    name: 'Rules of Engagement Authorization',
    description: 'ROE approval and supplemental measures',
    fields: [
      { name: 'operation', type: 'string', required: true, description: 'Operation name' },
      { name: 'roe_baseline', type: 'string', required: true, description: 'Baseline ROE reference' },
      { name: 'supplemental_measures', type: 'array', required: false, description: 'Approved supplemental measures' },
      { name: 'restrictions', type: 'array', required: false, description: 'Additional restrictions' },
      { name: 'legal_basis', type: 'object', required: true, description: 'Legal authority and LOAC analysis' },
      { name: 'approval_authority', type: 'string', required: true, description: 'ROE approval authority' },
      { name: 'effective_period', type: 'object', required: true, description: 'Effective dates' },
    ],
    requiredApprovals: ['legal-advisor-ucmj', 'mission-commander'],
    classificationLevel: 'SECRET',
    retentionYears: 25,
  },
];

// =============================================================================
// COMPLIANCE FRAMEWORKS
// =============================================================================

export const DEFENSE_COMPLIANCE_FRAMEWORKS: DefenseComplianceFramework[] = [
  {
    id: 'fedramp-high',
    name: 'FedRAMP High',
    description: 'Federal Risk and Authorization Management Program - High Impact',
    requirements: [
      'FIPS 140-2 encryption',
      'Continuous monitoring',
      'Incident response within 1 hour',
      'Annual penetration testing',
      'Supply chain risk management',
    ],
    applicableModes: ALL_DEFENSE_MODES.map(m => m.id),
    auditFrequency: 'continuous',
  },
  {
    id: 'cmmc-level-3',
    name: 'CMMC Level 3',
    description: 'Cybersecurity Maturity Model Certification - Expert',
    requirements: [
      'NIST 800-171 compliance',
      'Advanced threat detection',
      'Incident response capability',
      'Security operations center',
      'Penetration testing',
    ],
    applicableModes: ALL_DEFENSE_MODES.filter(m => m.category === 'acquisition').map(m => m.id),
    auditFrequency: 'annual',
  },
  {
    id: 'itar',
    name: 'ITAR',
    description: 'International Traffic in Arms Regulations',
    requirements: [
      'Export control compliance',
      'Foreign person access control',
      'Technology control plan',
      'Empowered official designation',
      'License management',
    ],
    applicableModes: ALL_DEFENSE_MODES.filter(m => m.opsecRequired).map(m => m.id),
    auditFrequency: 'annual',
  },
  {
    id: 'nist-800-171',
    name: 'NIST 800-171',
    description: 'Protecting Controlled Unclassified Information',
    requirements: [
      'Access control',
      'Awareness and training',
      'Audit and accountability',
      'Configuration management',
      'Identification and authentication',
      'Incident response',
      'Maintenance',
      'Media protection',
      'Personnel security',
      'Physical protection',
      'Risk assessment',
      'Security assessment',
      'System and communications protection',
      'System and information integrity',
    ],
    applicableModes: ALL_DEFENSE_MODES.filter(m => m.classificationLevel === 'CUI').map(m => m.id),
    auditFrequency: 'annual',
  },
  {
    id: 'loac',
    name: 'Law of Armed Conflict',
    description: 'International Humanitarian Law compliance',
    requirements: [
      'Distinction (military vs civilian)',
      'Proportionality',
      'Military necessity',
      'Humanity',
      'Legal review of targeting',
    ],
    applicableModes: ['targeting-council', 'roe-analysis', 'mission-planning-council'],
    auditFrequency: 'continuous',
  },
];

// =============================================================================
// DATA CONNECTORS
// =============================================================================

export const DEFENSE_DATA_CONNECTORS: DefenseDataConnector[] = [
  {
    id: 'sipr-gateway',
    name: 'SIPRNet Gateway',
    type: 'api',
    classification: 'SECRET',
    protocols: ['HTTPS', 'SOAP', 'REST'],
    authMethods: ['PKI', 'CAC'],
  },
  {
    id: 'jwics-gateway',
    name: 'JWICS Gateway',
    type: 'api',
    classification: 'TOP_SECRET',
    protocols: ['HTTPS', 'SOAP'],
    authMethods: ['PKI', 'CAC', 'SCI_ACCESS'],
  },
  {
    id: 'nipr-gateway',
    name: 'NIPRNet Gateway',
    type: 'api',
    classification: 'UNCLASSIFIED',
    protocols: ['HTTPS', 'REST', 'GraphQL'],
    authMethods: ['PKI', 'CAC', 'OAuth2'],
  },
  {
    id: 'dla-logistics-api',
    name: 'DLA Logistics API',
    type: 'api',
    classification: 'CUI',
    protocols: ['REST', 'SOAP'],
    authMethods: ['PKI', 'API_KEY'],
  },
  {
    id: 'sam-gov-api',
    name: 'SAM.gov API',
    type: 'api',
    classification: 'UNCLASSIFIED',
    protocols: ['REST'],
    authMethods: ['API_KEY'],
  },
  {
    id: 'fpds-api',
    name: 'FPDS-NG API',
    type: 'api',
    classification: 'UNCLASSIFIED',
    protocols: ['REST', 'SOAP'],
    authMethods: ['API_KEY'],
  },
  {
    id: 'nist-nvd-api',
    name: 'NIST NVD API',
    type: 'api',
    classification: 'UNCLASSIFIED',
    protocols: ['REST'],
    authMethods: ['API_KEY'],
  },
  {
    id: 'cisa-kev-api',
    name: 'CISA KEV API',
    type: 'api',
    classification: 'UNCLASSIFIED',
    protocols: ['REST'],
    authMethods: ['NONE'],
  },
];

// =============================================================================
// VERTICAL SERVICE CLASS
// =============================================================================

export class DefenseVerticalService {
  private static instance: DefenseVerticalService;

  private constructor() {}

  static getInstance(): DefenseVerticalService {
    if (!DefenseVerticalService.instance) {
      DefenseVerticalService.instance = new DefenseVerticalService();
    }
    return DefenseVerticalService.instance;
  }

  // -------------------------------------------------------------------------
  // AGENTS
  // -------------------------------------------------------------------------

  getAllAgents(): DefenseAgent[] {
    return ALL_DEFENSE_AGENTS;
  }

  getDefaultAgents(): DefenseAgent[] {
    return DEFAULT_DEFENSE_AGENTS;
  }

  getOptionalAgents(): DefenseAgent[] {
    return OPTIONAL_DEFENSE_AGENTS;
  }

  getSilentGuards(): DefenseAgent[] {
    return SILENT_GUARD_DEFENSE_AGENTS;
  }

  getAgentById(id: string): DefenseAgent | undefined {
    return getDefenseAgent(id);
  }

  getAgentsByCategory(category: 'default' | 'optional' | 'silent-guard'): DefenseAgent[] {
    return getDefenseAgentsByCategory(category);
  }

  buildMissionTeam(missionType: 'kinetic' | 'cyber' | 'acquisition' | 'planning' | 'intelligence'): DefenseAgent[] {
    return buildDefenseTeam(missionType);
  }

  // -------------------------------------------------------------------------
  // COUNCIL MODES
  // -------------------------------------------------------------------------

  getAllModes(): DefenseCouncilMode[] {
    return ALL_DEFENSE_MODES;
  }

  getModeById(id: string): DefenseCouncilMode | undefined {
    return getDefenseMode(id);
  }

  getModesByCategory(category: string): DefenseCouncilMode[] {
    return getDefenseModesByCategory(category as any);
  }

  getModesByClassification(level: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET'): DefenseCouncilMode[] {
    return getDefenseModesByClassification(level);
  }

  // -------------------------------------------------------------------------
  // DECISION SCHEMAS
  // -------------------------------------------------------------------------

  getAllSchemas(): DefenseDecisionSchema[] {
    return DEFENSE_DECISION_SCHEMAS;
  }

  getSchemaById(id: string): DefenseDecisionSchema | undefined {
    return DEFENSE_DECISION_SCHEMAS.find(s => s.id === id);
  }

  // -------------------------------------------------------------------------
  // COMPLIANCE
  // -------------------------------------------------------------------------

  getAllComplianceFrameworks(): DefenseComplianceFramework[] {
    return DEFENSE_COMPLIANCE_FRAMEWORKS;
  }

  getComplianceFrameworkById(id: string): DefenseComplianceFramework | undefined {
    return DEFENSE_COMPLIANCE_FRAMEWORKS.find(f => f.id === id);
  }

  getApplicableFrameworks(modeId: string): DefenseComplianceFramework[] {
    return DEFENSE_COMPLIANCE_FRAMEWORKS.filter(f => f.applicableModes.includes(modeId));
  }

  // -------------------------------------------------------------------------
  // DATA CONNECTORS
  // -------------------------------------------------------------------------

  getAllConnectors(): DefenseDataConnector[] {
    return DEFENSE_DATA_CONNECTORS;
  }

  getConnectorsByClassification(level: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET'): DefenseDataConnector[] {
    return DEFENSE_DATA_CONNECTORS.filter(c => c.classification === level);
  }

  // -------------------------------------------------------------------------
  // SUMMARY & HEALTH
  // -------------------------------------------------------------------------

  getSummary() {
    return {
      vertical: 'defense',
      displayName: 'Defense & National Security',
      agents: DEFENSE_AGENTS_SUMMARY,
      modes: DEFENSE_MODES_SUMMARY,
      schemas: DEFENSE_DECISION_SCHEMAS.length,
      complianceFrameworks: DEFENSE_COMPLIANCE_FRAMEWORKS.length,
      dataConnectors: DEFENSE_DATA_CONNECTORS.length,
      status: 'operational',
      complianceStatus: {
        fedRampHigh: true,
        cmmcLevel3: true,
        itar: true,
        nist800171: true,
      },
    };
  }

  getHealth() {
    return {
      status: 'healthy',
      vertical: 'defense',
      agentsLoaded: ALL_DEFENSE_AGENTS.length,
      modesLoaded: ALL_DEFENSE_MODES.length,
      schemasLoaded: DEFENSE_DECISION_SCHEMAS.length,
      lastCheck: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const defenseVerticalService = DefenseVerticalService.getInstance();

// Export everything
export {
  ALL_DEFENSE_AGENTS,
  DEFAULT_DEFENSE_AGENTS,
  OPTIONAL_DEFENSE_AGENTS,
  SILENT_GUARD_DEFENSE_AGENTS,
  ALL_DEFENSE_MODES,
  DEFENSE_AGENTS_SUMMARY,
  DEFENSE_MODES_SUMMARY,
};
