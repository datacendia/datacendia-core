// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA VERTICAL CUSTOMIZATION SYSTEM
 * 
 * Enterprise Platinum Standard - Makes each deployment fully customized per vertical
 * Each vertical gets its own branding, agents, services, compliance, and UI configuration
 */

// =============================================================================
// TYPES
// =============================================================================

export interface VerticalBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  icon: string;
  logo?: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface VerticalCompliance {
  frameworks: string[];
  certifications: string[];
  dataResidency: string[];
  retentionPolicies: {
    default: number; // days
    audit: number;
    legal: number;
  };
  requiredApprovals: string[];
}

export interface VerticalAgentPreset {
  id: string;
  name: string;
  description: string;
  defaultAgents: string[];
  optionalAgents: string[];
  requiredApprovals: string[];
  maxDeliberationRounds: number;
}

export interface VerticalIntegration {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeline: string;
  notes: string;
  required: boolean;
}

export interface VerticalUseCase {
  id: string;
  name: string;
  description: string;
  services: string[];
  category: string;
  roi?: string;
}

export interface VerticalPricing {
  pilot: { price: string; includes: string };
  professional: { price: string; includes: string };
  enterprise: { price: string; includes: string };
  sovereign: { price: string; includes: string };
}

export interface VerticalCustomization {
  id: string;
  name: string;
  shortName: string;
  tier: 'priority' | 'growth' | 'coming-soon';
  status: 'ga' | 'beta' | 'coming-soon';
  
  // Branding
  branding: VerticalBranding;
  
  // Services
  coreServices: string[];
  recommendedServices: string[];
  excludedServices: string[];
  
  // Agents
  defaultAgents: string[];
  optionalAgents: string[];
  agentPresets: VerticalAgentPreset[];
  
  // Compliance
  compliance: VerticalCompliance;
  
  // Integrations
  integrations: VerticalIntegration[];
  
  // Use Cases
  useCases: VerticalUseCase[];
  
  // Pricing
  pricing: VerticalPricing;
  
  // UI Customization
  dashboardWidgets: string[];
  navigationItems: string[];
  featureFlags: Record<string, boolean>;
  
  // Data Ingestion
  supportedDataSources: string[];
  dataIngestionPipelines: string[];
}

// =============================================================================
// LEGAL VERTICAL CUSTOMIZATION
// =============================================================================

export const legalVerticalCustomization: VerticalCustomization = {
  id: 'legal',
  name: 'Legal / Law Firms',
  shortName: 'Legal',
  tier: 'priority',
  status: 'ga',
  
  branding: {
    primaryColor: '#D97706', // Amber
    secondaryColor: '#92400E',
    accentColor: '#FCD34D',
    icon: '⚖️',
    tagline: 'Privilege-preserving AI with audit-grade decision packets',
    heroTitle: 'The AI Lawyers Are Actually Allowed to Use',
    heroSubtitle: 'On-premise legal decision intelligence with defensible audit trails',
  },
  
  coreServices: [
    'council',
    'ledger',
    'evidence-vault',
    'chronos',
    'veto',
  ],
  
  recommendedServices: [
    'crucible',
    'panopticon',
    'bridge',
    'graph',
    'sovereign',
    'omnitranslate',
  ],
  
  excludedServices: [],
  
  defaultAgents: [
    'matter-lead',
    'research-counsel',
    'contract-counsel',
    'litigation-strategist',
    'risk-counsel',
    'opposing-counsel',
    'privilege-officer',
    'evidence-officer',
  ],
  
  optionalAgents: [
    'regulatory-counsel',
    'employment-counsel',
    'ip-counsel',
    'tax-counsel',
    'antitrust-counsel',
    'commercial-advisor',
  ],
  
  agentPresets: [
    {
      id: 'contract-review',
      name: 'Contract Review (Standard)',
      description: 'Standard contract review and redlining',
      defaultAgents: ['matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['commercial-advisor'],
      requiredApprovals: ['privilege-officer'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'high-stakes-negotiation',
      name: 'High-Stakes Negotiation',
      description: 'Major deal negotiations with adversarial testing',
      defaultAgents: ['matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'opposing-counsel', 'commercial-advisor', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['tax-counsel', 'antitrust-counsel'],
      requiredApprovals: ['privilege-officer', 'matter-lead'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'litigation-prep',
      name: 'Litigation Prep',
      description: 'Case strategy, depositions, trial prep',
      defaultAgents: ['matter-lead', 'research-counsel', 'litigation-strategist', 'opposing-counsel', 'risk-counsel', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['employment-counsel', 'ip-counsel'],
      requiredApprovals: ['privilege-officer'],
      maxDeliberationRounds: 10,
    },
    {
      id: 'regulatory-response',
      name: 'Regulatory Response / Audit',
      description: 'Regulatory inquiries, audits, compliance responses',
      defaultAgents: ['matter-lead', 'regulatory-counsel', 'research-counsel', 'privilege-officer', 'evidence-officer', 'risk-counsel'],
      optionalAgents: ['employment-counsel'],
      requiredApprovals: ['privilege-officer', 'regulatory-counsel'],
      maxDeliberationRounds: 6,
    },
  ],
  
  compliance: {
    frameworks: [
      'ABA Model Rules',
      'Rule 1.1 (Competence)',
      'Rule 1.6 (Confidentiality)',
      'Rule 5.1/5.3 (Supervision)',
      'SRA (UK)',
      'EU AI Act',
      'GDPR',
      'State Bar Rules',
    ],
    certifications: [
      'Attorney-Client Privilege',
      'Work Product Doctrine',
      'Common Interest Privilege',
    ],
    dataResidency: ['US', 'EU', 'UK', 'Client-Specified'],
    retentionPolicies: {
      default: 2555, // 7 years
      audit: 3650,   // 10 years
      legal: 7300,   // 20 years (for litigation holds)
    },
    requiredApprovals: ['privilege-officer', 'matter-lead'],
  },
  
  integrations: [
    {
      id: 'imanage',
      name: 'iManage',
      category: 'Document Management',
      difficulty: 'easy',
      timeline: '2-4 weeks',
      notes: 'Standard API connectors, matter-level sync',
      required: false,
    },
    {
      id: 'netdocuments',
      name: 'NetDocuments',
      category: 'Document Management',
      difficulty: 'easy',
      timeline: '2-4 weeks',
      notes: 'REST API, workspace sync',
      required: false,
    },
    {
      id: 'relativity',
      name: 'Relativity',
      category: 'eDiscovery',
      difficulty: 'medium',
      timeline: '4-8 weeks',
      notes: 'Export/import workflows, production set integration',
      required: false,
    },
    {
      id: 'nuix',
      name: 'Nuix',
      category: 'eDiscovery',
      difficulty: 'medium',
      timeline: '4-8 weeks',
      notes: 'Processing integration, analytics export',
      required: false,
    },
    {
      id: 'clio',
      name: 'Clio',
      category: 'Practice Management',
      difficulty: 'easy',
      timeline: '2-3 weeks',
      notes: 'Matter sync, time entry integration',
      required: false,
    },
    {
      id: 'westlaw',
      name: 'Westlaw',
      category: 'Legal Research',
      difficulty: 'medium',
      timeline: '4-6 weeks',
      notes: 'Citation verification, case law ingestion pipelines',
      required: false,
    },
    {
      id: 'lexisnexis',
      name: 'LexisNexis',
      category: 'Legal Research',
      difficulty: 'medium',
      timeline: '4-6 weeks',
      notes: 'Research integration, precedent library sync',
      required: false,
    },
    {
      id: 'ironclad',
      name: 'Ironclad',
      category: 'Contract Lifecycle',
      difficulty: 'easy',
      timeline: '2-4 weeks',
      notes: 'Playbook sync, clause library integration',
      required: false,
    },
  ],
  
  useCases: [
    // Contract & Deal Pack
    { id: 'contract-review', name: 'Contract Review & Redlining', description: 'Multi-agent review with playbook enforcement', services: ['council', 'lens', 'evidence-vault', 'veto'], category: 'contract', roi: '40% faster' },
    { id: 'clause-risk', name: 'Clause Risk Scoring', description: 'Playbook-driven risk scoring with fallback suggestions', services: ['veto', 'lens', 'graph', 'council'], category: 'contract' },
    { id: 'negotiation-prep', name: 'Negotiation Strategy Prep', description: 'Scenario planning with adversarial testing', services: ['council', 'crucible', 'chronos', 'evidence-vault'], category: 'contract' },
    { id: 'ma-dd', name: 'M&A Due Diligence', description: 'Data room summarization and risk flagging', services: ['bridge', 'lens', 'graph', 'council', 'evidence-vault'], category: 'contract', roi: '40% faster DD' },
    { id: 'reps-warranties', name: 'Reps & Warranties Risk Map', description: 'Missing disclosure detection', services: ['lens', 'graph', 'council', 'evidence-vault'], category: 'contract' },
    { id: 'policy-drafting', name: 'Policy-Aware Drafting', description: 'Firm style and risk constraints enforced', services: ['veto', 'lens', 'council'], category: 'contract' },
    // Litigation Pack
    { id: 'fact-chronology', name: 'Litigation Fact Chronology', description: 'Events, exhibits, witnesses mapped', services: ['chronos', 'bridge', 'graph', 'lens'], category: 'litigation' },
    { id: 'case-theory', name: 'Case Theory Stress Test', description: "Devil's advocate with documented dissent", services: ['crucible', 'council', 'evidence-vault'], category: 'litigation' },
    { id: 'deposition-outline', name: 'Deposition Outline Drafting', description: 'Grounded in record with citation enforcement', services: ['lens', 'evidence-vault', 'veto'], category: 'litigation' },
    { id: 'discovery-response', name: 'Discovery Request Response', description: 'Response drafting with exhibit mapping', services: ['lens', 'graph', 'council', 'evidence-vault'], category: 'litigation' },
    { id: 'ediscovery-packet', name: 'eDiscovery Defensibility Packet', description: 'Audit-grade documentation', services: ['ledger', 'chronos', 'evidence-vault', 'veto'], category: 'litigation' },
    { id: 'expert-prep', name: 'Expert Witness Prep', description: 'Cross-examination simulation', services: ['crucible', 'council', 'chronos'], category: 'litigation' },
    // Governance Pack
    { id: 'regulators-receipt', name: "Regulator's Receipt", description: 'Defensible work product trail', services: ['chronos', 'ledger', 'evidence-vault', 'veto'], category: 'governance' },
    { id: 'privilege-review', name: 'Privilege & Confidentiality Review', description: 'Triage with approvals and logging', services: ['veto', 'ledger', 'evidence-vault', 'bridge'], category: 'governance' },
    { id: 'conflicts-check', name: 'Conflicts Check Augmentation', description: 'Entity and relationship mapping', services: ['graph', 'bridge', 'veto', 'ledger'], category: 'governance' },
    { id: 'security-questionnaire', name: 'Security Questionnaire Response', description: 'Outside counsel guidelines pack', services: ['panopticon', 'evidence-vault', 'ledger', 'sovereign'], category: 'governance' },
    { id: 'regulatory-monitoring', name: 'Regulatory Change Monitoring', description: 'Alerts to legal impact memo', services: ['panopticon', 'lens', 'council', 'chronos'], category: 'governance' },
    { id: 'compliance-evidence', name: 'Compliance Evidence Assembly', description: 'SOC2/ISO/NIST mapping', services: ['panopticon', 'evidence-vault', 'ledger', 'graph'], category: 'governance' },
    { id: 'matter-postmortem', name: 'Matter Post-Mortem', description: 'Lessons learned with audit trail', services: ['chronos', 'council', 'ledger', 'lens'], category: 'governance' },
    { id: 'precedent-kb', name: 'Precedent Knowledge Base', description: 'Search with relevance context', services: ['bridge', 'lens', 'graph', 'sovereign'], category: 'governance' },
  ],
  
  pricing: {
    pilot: { price: '$35,000', includes: 'One matter end-to-end, 10 business days' },
    professional: { price: '$120,000–$250,000/year', includes: 'Core Suite + 8 Legal Agents + Case Law Ingestion' },
    enterprise: { price: '$300,000–$750,000/year', includes: '+ All specialists, unlimited matters, on-prem option' },
    sovereign: { price: '$1,000,000+', includes: '+ SCIF-ready, custom models, dedicated support' },
  },
  
  dashboardWidgets: [
    'active-matters',
    'pending-approvals',
    'recent-deliberations',
    'privilege-alerts',
    'compliance-status',
    'case-law-updates',
    'deadline-tracker',
    'billing-summary',
  ],
  
  navigationItems: [
    'council',
    'matters',
    'case-library',
    'contracts',
    'discovery',
    'compliance',
    'reports',
    'settings',
  ],
  
  featureFlags: {
    caseLibraryIngestion: true,
    privilegeGate: true,
    citationEnforcement: true,
    matterWorkspaces: true,
    billingIntegration: true,
    conflictsCheck: true,
    deadlineTracking: true,
    courtFilingIntegration: false, // Roadmap
  },
  
  supportedDataSources: [
    'case-law-exports',
    'document-management-systems',
    'practice-management',
    'ediscovery-platforms',
    'contract-repositories',
    'firm-precedent-library',
    'regulatory-feeds',
  ],
  
  dataIngestionPipelines: [
    'westlaw-case-import',
    'lexis-case-import',
    'imanage-sync',
    'netdocuments-sync',
    'relativity-export',
    'clio-matter-sync',
  ],
};

// =============================================================================
// HEALTHCARE VERTICAL CUSTOMIZATION
// =============================================================================

export const healthcareVerticalCustomization: VerticalCustomization = {
  id: 'healthcare',
  name: 'Healthcare / Health Systems',
  shortName: 'Healthcare',
  tier: 'priority',
  status: 'ga',
  
  branding: {
    primaryColor: '#2563EB', // Blue
    secondaryColor: '#1E40AF',
    accentColor: '#60A5FA',
    icon: '🏥',
    tagline: 'HIPAA-compliant clinical decision intelligence',
    heroTitle: 'AI That Protects Patient Data',
    heroSubtitle: 'Full data sovereignty with CMS AI transparency compliance',
  },
  
  coreServices: ['council', 'ledger', 'evidence-vault', 'chronos', 'veto', 'aegis'],
  recommendedServices: ['panopticon', 'eternal', 'predict', 'bridge', 'sovereign'],
  excludedServices: [],
  
  defaultAgents: ['cmio', 'patient-safety', 'healthcare-compliance', 'clinical-ops'],
  optionalAgents: ['revenue-cycle', 'quality-officer', 'nursing-informatics'],
  
  agentPresets: [
    {
      id: 'clinical-decision',
      name: 'Clinical Decision Support',
      description: 'Patient care decisions with safety checks',
      defaultAgents: ['cmio', 'patient-safety', 'clinical-ops'],
      optionalAgents: ['quality-officer'],
      requiredApprovals: ['patient-safety'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'compliance-review',
      name: 'Compliance Review',
      description: 'CMS, Joint Commission, HIPAA compliance',
      defaultAgents: ['healthcare-compliance', 'quality-officer', 'cmio'],
      optionalAgents: ['revenue-cycle'],
      requiredApprovals: ['healthcare-compliance'],
      maxDeliberationRounds: 6,
    },
  ],
  
  compliance: {
    frameworks: ['HIPAA', 'HITECH', 'Joint Commission', 'CMS CoPs', 'Stark Law', 'Anti-Kickback', '21st Century Cures Act'],
    certifications: ['HITRUST', 'SOC 2 Type II'],
    dataResidency: ['US-Only', 'HIPAA-Compliant Regions'],
    retentionPolicies: { default: 2190, audit: 2555, legal: 3650 },
    requiredApprovals: ['patient-safety', 'healthcare-compliance'],
  },
  
  integrations: [
    { id: 'epic', name: 'Epic EHR', category: 'EHR', difficulty: 'medium', timeline: '6-12 weeks', notes: 'FHIR R4 APIs', required: false },
    { id: 'cerner', name: 'Cerner EHR', category: 'EHR', difficulty: 'medium', timeline: '6-12 weeks', notes: 'FHIR R4 APIs', required: false },
  ],
  
  useCases: [
    { id: 'discharge-planning', name: 'Discharge Planning', description: 'Accelerate discharge decisions', services: ['council', 'chronos', 'evidence-vault'], category: 'clinical', roi: '34% faster' },
    { id: 'cms-compliance', name: 'CMS Compliance Monitoring', description: 'CoP violation detection', services: ['panopticon', 'ledger', 'evidence-vault'], category: 'compliance' },
  ],
  
  pricing: {
    pilot: { price: '$100,000', includes: '8 Pillars + 4 Healthcare Agents' },
    professional: { price: '$1,200,000/year', includes: '+ Aegis, Panopticon, Eternal' },
    enterprise: { price: '$5,000,000/year', includes: '+ Full Guardian Suite' },
    sovereign: { price: '$12,000,000+', includes: '+ Air-gapped, custom models' },
  },
  
  dashboardWidgets: ['patient-census', 'quality-metrics', 'compliance-alerts', 'capacity-forecast'],
  navigationItems: ['council', 'clinical', 'compliance', 'quality', 'reports'],
  featureFlags: { phiProtection: true, clinicalDecisionSupport: true, cmsTransparency: true },
  supportedDataSources: ['ehr-fhir', 'hl7-v2', 'claims-data', 'quality-measures'],
  dataIngestionPipelines: ['epic-fhir-sync', 'cerner-fhir-sync', 'claims-import'],
};

// =============================================================================
// FINANCIAL SERVICES VERTICAL CUSTOMIZATION
// =============================================================================

export const financialVerticalCustomization: VerticalCustomization = {
  id: 'financial',
  name: 'Financial Services',
  shortName: 'Financial',
  tier: 'priority',
  status: 'ga',
  
  branding: {
    primaryColor: '#059669', // Emerald
    secondaryColor: '#047857',
    accentColor: '#34D399',
    icon: '💰',
    tagline: 'Regulatory-compliant AI for financial decisions',
    heroTitle: 'AI That Passes the Audit',
    heroSubtitle: 'SOX, Basel III/IV, and AML/BSA compliant decision intelligence',
  },
  
  coreServices: ['council', 'ledger', 'evidence-vault', 'chronos', 'veto', 'panopticon'],
  recommendedServices: ['crucible', 'predict', 'aegis', 'bridge', 'sovereign'],
  excludedServices: [],
  
  defaultAgents: ['risk-sentinel', 'alpha-hunter', 'compliance-guardian', 'market-pulse'],
  optionalAgents: ['credit-analyst', 'treasury-ops', 'fraud-detector'],
  
  agentPresets: [
    {
      id: 'credit-decision',
      name: 'Credit Decision',
      description: 'Loan approval with risk assessment',
      defaultAgents: ['risk-sentinel', 'compliance-guardian', 'credit-analyst'],
      optionalAgents: ['fraud-detector'],
      requiredApprovals: ['compliance-guardian'],
      maxDeliberationRounds: 5,
    },
  ],
  
  compliance: {
    frameworks: ['SOX', 'Basel III/IV', 'GDPR', 'AML/BSA', 'CFPB', 'Dodd-Frank', 'MiFID II'],
    certifications: ['SOC 2 Type II', 'PCI-DSS'],
    dataResidency: ['US', 'EU', 'UK', 'Singapore', 'Hong Kong'],
    retentionPolicies: { default: 2555, audit: 2555, legal: 3650 },
    requiredApprovals: ['compliance-guardian', 'risk-sentinel'],
  },
  
  integrations: [
    { id: 'bloomberg', name: 'Bloomberg Terminal', category: 'Market Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Via client adapter', required: false },
  ],
  
  useCases: [
    { id: 'fraud-detection', name: 'Fraud Detection', description: 'Real-time transaction monitoring', services: ['council', 'aegis', 'chronos'], category: 'risk', roi: '40% reduction' },
  ],
  
  pricing: {
    pilot: { price: '$150,000', includes: '8 Pillars + 4 Financial Agents' },
    professional: { price: '$1,500,000/year', includes: '+ Panopticon, Aegis, Predict' },
    enterprise: { price: '$8,000,000/year', includes: '+ Full Guardian Suite' },
    sovereign: { price: '$25,000,000+', includes: '+ Air-gapped, custom models' },
  },
  
  dashboardWidgets: ['risk-exposure', 'compliance-status', 'market-alerts', 'portfolio-summary'],
  navigationItems: ['council', 'risk', 'compliance', 'trading', 'reports'],
  featureFlags: { realTimeRisk: true, tradeSurveillance: true, amlScreening: true },
  supportedDataSources: ['market-feeds', 'transaction-data', 'customer-data', 'regulatory-filings'],
  dataIngestionPipelines: ['market-data-sync', 'transaction-import', 'kyc-data-sync'],
};

// =============================================================================
// GOVERNMENT VERTICAL CUSTOMIZATION
// =============================================================================

export const governmentVerticalCustomization: VerticalCustomization = {
  id: 'government',
  name: 'Government',
  shortName: 'Government',
  tier: 'priority',
  status: 'ga',
  
  branding: {
    primaryColor: '#7C3AED', // Purple
    secondaryColor: '#6D28D9',
    accentColor: '#A78BFA',
    icon: '🏛️',
    tagline: 'Sovereign AI for public sector intelligence',
    heroTitle: 'AI That Serves the Public',
    heroSubtitle: 'FedRAMP-ready, FISMA-compliant decision intelligence',
  },
  
  coreServices: ['council', 'ledger', 'evidence-vault', 'chronos', 'veto', 'sovereign'],
  recommendedServices: ['panopticon', 'aegis', 'bridge'],
  excludedServices: [],
  
  defaultAgents: ['policy-analyst', 'procurement-officer', 'ethics-officer', 'compliance-lead'],
  optionalAgents: ['budget-analyst', 'security-officer'],
  
  agentPresets: [
    {
      id: 'procurement-decision',
      name: 'Procurement Decision',
      description: 'Vendor evaluation and contract award',
      defaultAgents: ['procurement-officer', 'compliance-lead', 'ethics-officer'],
      optionalAgents: ['budget-analyst'],
      requiredApprovals: ['ethics-officer', 'compliance-lead'],
      maxDeliberationRounds: 6,
    },
  ],
  
  compliance: {
    frameworks: ['FedRAMP', 'FISMA', 'EU AI Act', 'FOIA', 'ADA Section 508', 'NIST 800-53'],
    certifications: ['FedRAMP High', 'IL4/IL5', 'StateRAMP'],
    dataResidency: ['US-Only', 'GovCloud'],
    retentionPolicies: { default: 2555, audit: 3650, legal: 7300 },
    requiredApprovals: ['ethics-officer', 'compliance-lead'],
  },
  
  integrations: [],
  
  useCases: [
    { id: 'contract-review', name: 'Contract Review', description: 'Government contract analysis', services: ['council', 'lens', 'evidence-vault'], category: 'procurement', roi: '60% faster' },
  ],
  
  pricing: {
    pilot: { price: '$150,000', includes: '8 Pillars + 4 Gov Agents' },
    professional: { price: '$1,500,000/year', includes: '+ Panopticon, Aegis, Ledger' },
    enterprise: { price: '$8,000,000/year', includes: '+ Full Guardian Suite' },
    sovereign: { price: '$25,000,000+', includes: '+ Nation-scale, SCIF-ready' },
  },
  
  dashboardWidgets: ['policy-tracker', 'procurement-status', 'compliance-alerts', 'foia-queue'],
  navigationItems: ['council', 'policy', 'procurement', 'compliance', 'reports'],
  featureFlags: { foiaCompliance: true, section508: true, fedrampControls: true },
  supportedDataSources: ['policy-documents', 'procurement-data', 'regulatory-feeds'],
  dataIngestionPipelines: ['policy-import', 'contract-sync'],
};

// =============================================================================
// VERTICAL REGISTRY
// =============================================================================

export const VERTICAL_CUSTOMIZATIONS: Record<string, VerticalCustomization> = {
  legal: legalVerticalCustomization,
  healthcare: healthcareVerticalCustomization,
  financial: financialVerticalCustomization,
  government: governmentVerticalCustomization,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getVerticalCustomization = (verticalId: string): VerticalCustomization | undefined => {
  return VERTICAL_CUSTOMIZATIONS[verticalId];
};

export const getVerticalBranding = (verticalId: string): VerticalBranding | undefined => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.branding;
};

export const getVerticalAgentPresets = (verticalId: string): VerticalAgentPreset[] => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.agentPresets || [];
};

export const getVerticalCompliance = (verticalId: string): VerticalCompliance | undefined => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.compliance;
};

export const getVerticalUseCases = (verticalId: string): VerticalUseCase[] => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.useCases || [];
};

export const getVerticalIntegrations = (verticalId: string): VerticalIntegration[] => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.integrations || [];
};

export const isFeatureEnabled = (verticalId: string, featureFlag: string): boolean => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.featureFlags[featureFlag] ?? false;
};

export const getVerticalDashboardWidgets = (verticalId: string): string[] => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.dashboardWidgets || [];
};

export const getVerticalNavigationItems = (verticalId: string): string[] => {
  return VERTICAL_CUSTOMIZATIONS[verticalId]?.navigationItems || [];
};

export default VERTICAL_CUSTOMIZATIONS;
