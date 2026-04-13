/**
 * Configuration — Vertical Customization
 *
 * Frontend configuration constants and environment bindings.
 *
 * @exports legalVerticalCustomization, healthcareVerticalCustomization, financialVerticalCustomization, governmentVerticalCustomization, VERTICAL_CUSTOMIZATIONS, getVerticalCustomization, getVerticalBranding, getVerticalAgentPresets
 * @module config/verticalCustomization
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
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
      description: 'Patient care decisions with safety checks and evidence trails',
      defaultAgents: ['cmio', 'patient-safety', 'clinical-ops', 'healthcare-compliance'],
      optionalAgents: ['quality-officer', 'nursing-informatics'],
      requiredApprovals: ['patient-safety'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'compliance-review',
      name: 'Compliance Review',
      description: 'CMS, Joint Commission, HIPAA compliance assessment',
      defaultAgents: ['healthcare-compliance', 'quality-officer', 'cmio'],
      optionalAgents: ['revenue-cycle'],
      requiredApprovals: ['healthcare-compliance'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'care-coordination',
      name: 'Care Coordination',
      description: 'Multi-disciplinary care planning with readmission risk scoring',
      defaultAgents: ['cmio', 'clinical-ops', 'nursing-informatics', 'patient-safety'],
      optionalAgents: ['quality-officer'],
      requiredApprovals: ['cmio'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'revenue-integrity',
      name: 'Revenue Integrity Audit',
      description: 'Coding accuracy, denial prevention, and revenue cycle optimization',
      defaultAgents: ['revenue-cycle', 'healthcare-compliance', 'quality-officer'],
      optionalAgents: ['cmio'],
      requiredApprovals: ['healthcare-compliance', 'revenue-cycle'],
      maxDeliberationRounds: 6,
    },
  ],
  
  compliance: {
    frameworks: ['HIPAA', 'HITECH', 'Joint Commission', 'CMS CoPs', 'Stark Law', 'Anti-Kickback', '21st Century Cures Act', 'FDA 21 CFR Part 11'],
    certifications: ['HITRUST CSF', 'SOC 2 Type II', 'HIPAA Attestation'],
    dataResidency: ['US-Only', 'HIPAA-Compliant Regions'],
    retentionPolicies: { default: 2190, audit: 2555, legal: 3650 },
    requiredApprovals: ['patient-safety', 'healthcare-compliance'],
  },
  
  integrations: [
    { id: 'epic', name: 'Epic EHR', category: 'EHR', difficulty: 'medium', timeline: '6-12 weeks', notes: 'FHIR R4 APIs, patient data sync', required: false },
    { id: 'cerner', name: 'Oracle Health (Cerner)', category: 'EHR', difficulty: 'medium', timeline: '6-12 weeks', notes: 'FHIR R4 APIs, Millennium integration', required: false },
    { id: 'meditech', name: 'MEDITECH Expanse', category: 'EHR', difficulty: 'medium', timeline: '8-12 weeks', notes: 'FHIR API, BCA integration', required: false },
    { id: 'athenahealth', name: 'athenahealth', category: 'EHR / PM', difficulty: 'easy', timeline: '4-6 weeks', notes: 'REST APIs, billing integration', required: false },
    { id: 'tableau-health', name: 'Tableau (Healthcare)', category: 'Analytics', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Quality dashboards, outcome analytics', required: false },
    { id: 'nuance-dax', name: 'Nuance DAX', category: 'Clinical Documentation', difficulty: 'medium', timeline: '4-8 weeks', notes: 'Ambient clinical intelligence, note generation', required: false },
    { id: 'healthgorilla', name: 'Health Gorilla', category: 'Health Data Exchange', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Nationwide health data network, ADT feeds', required: false },
    { id: 'redox', name: 'Redox Engine', category: 'Integration Platform', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Universal healthcare API, HL7/FHIR translation', required: false },
  ],
  
  useCases: [
    // Clinical Pack
    { id: 'discharge-planning', name: 'Discharge Planning', description: 'Accelerate discharge with readmission risk scoring and follow-up scheduling', services: ['council', 'chronos', 'evidence-vault', 'predict'], category: 'clinical', roi: '34% faster discharge' },
    { id: 'clinical-pathway', name: 'Clinical Pathway Optimization', description: 'Evidence-based care pathway recommendations with variance tracking', services: ['council', 'predict', 'chronos', 'evidence-vault'], category: 'clinical', roi: '12% LOS reduction' },
    { id: 'medication-reconciliation', name: 'Medication Reconciliation', description: 'Multi-agent review of medication lists with interaction checking', services: ['council', 'veto', 'evidence-vault'], category: 'clinical' },
    { id: 'clinical-trial-matching', name: 'Clinical Trial Matching', description: 'Patient eligibility screening against active clinical trials', services: ['council', 'bridge', 'predict'], category: 'clinical', roi: '3x enrollment rate' },
    { id: 'sepsis-early-warning', name: 'Sepsis Early Warning', description: 'Real-time sepsis risk scoring with escalation protocols', services: ['predict', 'council', 'chronos'], category: 'clinical', roi: '18% mortality reduction' },
    { id: 'care-gap-identification', name: 'Care Gap Identification', description: 'Preventive care and chronic disease management gap detection', services: ['panopticon', 'predict', 'council'], category: 'clinical' },
    // Compliance Pack
    { id: 'cms-compliance', name: 'CMS Compliance Monitoring', description: 'Condition of Participation violation detection and remediation', services: ['panopticon', 'ledger', 'evidence-vault'], category: 'compliance' },
    { id: 'hipaa-audit', name: 'HIPAA Audit Readiness', description: 'Automated HIPAA compliance evidence assembly and gap analysis', services: ['panopticon', 'evidence-vault', 'ledger', 'veto'], category: 'compliance', roi: '100% audit readiness' },
    { id: 'joint-commission-prep', name: 'Joint Commission Survey Prep', description: 'Standards compliance verification and evidence packaging', services: ['panopticon', 'evidence-vault', 'chronos', 'ledger'], category: 'compliance' },
    { id: 'stark-anti-kickback', name: 'Stark/Anti-Kickback Review', description: 'Physician arrangement compliance analysis', services: ['council', 'veto', 'evidence-vault', 'ledger'], category: 'compliance' },
    // Operations Pack
    { id: 'capacity-forecasting', name: 'Capacity Forecasting', description: 'Bed management and surgical scheduling optimization', services: ['predict', 'chronos', 'council'], category: 'operations', roi: '15% throughput increase' },
    { id: 'staffing-optimization', name: 'Staffing Optimization', description: 'Nurse-to-patient ratio optimization with acuity scoring', services: ['predict', 'council', 'chronos'], category: 'operations' },
    { id: 'supply-chain', name: 'Supply Chain Intelligence', description: 'Medical supply forecasting and shortage early warning', services: ['predict', 'panopticon', 'council'], category: 'operations' },
    // Revenue Pack
    { id: 'denial-prevention', name: 'Denial Prevention', description: 'Pre-submission claim analysis with denial risk scoring', services: ['predict', 'veto', 'evidence-vault'], category: 'revenue', roi: '25% denial reduction' },
    { id: 'coding-accuracy', name: 'Clinical Coding Accuracy', description: 'AI-assisted ICD-10/CPT code validation with documentation gaps', services: ['council', 'evidence-vault', 'veto'], category: 'revenue' },
    { id: 'payer-negotiation', name: 'Payer Contract Analysis', description: 'Reimbursement optimization and contract term analysis', services: ['council', 'predict', 'evidence-vault', 'bridge'], category: 'revenue' },
    // Quality Pack
    { id: 'quality-measures', name: 'Quality Measure Reporting', description: 'Automated CMS quality measure calculation and submission', services: ['panopticon', 'evidence-vault', 'ledger', 'chronos'], category: 'quality', roi: '60% faster reporting' },
    { id: 'patient-safety-events', name: 'Patient Safety Event Analysis', description: 'Root cause analysis with contributing factor identification', services: ['council', 'chronos', 'evidence-vault', 'bridge'], category: 'quality' },
  ],
  
  pricing: {
    pilot: { price: '$75,000', includes: 'One department end-to-end, 30 days' },
    professional: { price: '$350,000–$800,000/year', includes: 'Core Suite + 7 Healthcare Agents + EHR Integration' },
    enterprise: { price: '$1,000,000–$3,000,000/year', includes: '+ All specialists, enterprise EHR, unlimited departments' },
    sovereign: { price: '$5,000,000+', includes: '+ Air-gapped, custom clinical models, dedicated support' },
  },
  
  dashboardWidgets: ['patient-census', 'quality-metrics', 'compliance-alerts', 'capacity-forecast', 'readmission-risk', 'sepsis-alerts', 'denial-rate', 'staffing-ratio'],
  navigationItems: ['council', 'clinical', 'compliance', 'quality', 'operations', 'revenue', 'reports', 'settings'],
  featureFlags: { phiProtection: true, clinicalDecisionSupport: true, cmsTransparency: true, sepsisAlerts: true, denialPrevention: true, capacityForecasting: true, qualityReporting: true, clinicalTrialMatching: false },
  supportedDataSources: ['ehr-fhir', 'hl7-v2', 'claims-data', 'quality-measures', 'lab-results', 'pharmacy-data', 'radiology-data'],
  dataIngestionPipelines: ['epic-fhir-sync', 'cerner-fhir-sync', 'claims-import', 'adt-feed', 'lab-results-sync', 'redox-bridge'],
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
      description: 'Loan approval with multi-factor risk assessment and adverse action documentation',
      defaultAgents: ['risk-sentinel', 'compliance-guardian', 'credit-analyst'],
      optionalAgents: ['fraud-detector'],
      requiredApprovals: ['compliance-guardian'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'trading-surveillance',
      name: 'Trading Surveillance',
      description: 'Real-time trade monitoring with market abuse detection and regulatory reporting',
      defaultAgents: ['risk-sentinel', 'market-pulse', 'compliance-guardian', 'fraud-detector'],
      optionalAgents: ['treasury-ops'],
      requiredApprovals: ['compliance-guardian', 'risk-sentinel'],
      maxDeliberationRounds: 4,
    },
    {
      id: 'aml-investigation',
      name: 'AML Investigation',
      description: 'Suspicious activity analysis with SAR generation and evidence packaging',
      defaultAgents: ['compliance-guardian', 'fraud-detector', 'risk-sentinel'],
      optionalAgents: ['credit-analyst'],
      requiredApprovals: ['compliance-guardian'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'portfolio-risk',
      name: 'Portfolio Risk Assessment',
      description: 'Multi-asset risk analysis with stress testing and VaR calculations',
      defaultAgents: ['risk-sentinel', 'alpha-hunter', 'market-pulse'],
      optionalAgents: ['treasury-ops', 'compliance-guardian'],
      requiredApprovals: ['risk-sentinel'],
      maxDeliberationRounds: 6,
    },
  ],
  
  compliance: {
    frameworks: ['SOX', 'Basel III/IV', 'GDPR', 'AML/BSA', 'CFPB', 'Dodd-Frank', 'MiFID II', 'FINRA Rules'],
    certifications: ['SOC 2 Type II', 'PCI-DSS', 'ISO 27001'],
    dataResidency: ['US', 'EU', 'UK', 'Singapore', 'Hong Kong'],
    retentionPolicies: { default: 2555, audit: 2555, legal: 3650 },
    requiredApprovals: ['compliance-guardian', 'risk-sentinel'],
  },
  
  integrations: [
    { id: 'bloomberg', name: 'Bloomberg Terminal', category: 'Market Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Real-time market data, analytics, news feeds', required: false },
    { id: 'refinitiv', name: 'Refinitiv Eikon', category: 'Market Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Market data, analytics, trade execution', required: false },
    { id: 'factset', name: 'FactSet', category: 'Financial Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Portfolio analytics, company data, screening', required: false },
    { id: 'fis', name: 'FIS Global', category: 'Core Banking', difficulty: 'hard', timeline: '8-16 weeks', notes: 'Core banking system integration, payment processing', required: false },
    { id: 'temenos', name: 'Temenos T24', category: 'Core Banking', difficulty: 'hard', timeline: '8-16 weeks', notes: 'Core banking, wealth management', required: false },
    { id: 'salesforce-fs', name: 'Salesforce Financial Services', category: 'CRM', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Client relationship management, opportunity tracking', required: false },
    { id: 'actimize', name: 'NICE Actimize', category: 'Financial Crime', difficulty: 'medium', timeline: '6-10 weeks', notes: 'AML, fraud detection, trade surveillance', required: false },
    { id: 'swift', name: 'SWIFT Network', category: 'Payments', difficulty: 'hard', timeline: '8-12 weeks', notes: 'International payment messaging, sanctions screening', required: false },
  ],
  
  useCases: [
    // Risk Pack
    { id: 'fraud-detection', name: 'Transaction Fraud Detection', description: 'Real-time transaction monitoring with anomaly scoring', services: ['council', 'aegis', 'chronos', 'predict'], category: 'risk', roi: '40% fraud reduction' },
    { id: 'credit-scoring', name: 'AI Credit Scoring', description: 'Multi-factor credit assessment with explainable decisions', services: ['council', 'predict', 'evidence-vault', 'veto'], category: 'risk', roi: '25% default reduction' },
    { id: 'portfolio-risk', name: 'Portfolio Risk Analytics', description: 'VaR, stress testing, and concentration risk analysis', services: ['predict', 'council', 'panopticon'], category: 'risk' },
    { id: 'counterparty-risk', name: 'Counterparty Risk Assessment', description: 'Real-time counterparty exposure monitoring with early warning', services: ['predict', 'panopticon', 'council', 'evidence-vault'], category: 'risk' },
    { id: 'market-risk', name: 'Market Risk Monitoring', description: 'Real-time P&L attribution and risk factor sensitivity', services: ['predict', 'panopticon', 'chronos'], category: 'risk' },
    // Compliance Pack
    { id: 'aml-screening', name: 'AML/KYC Screening', description: 'Automated customer due diligence with sanctions checking', services: ['council', 'bridge', 'evidence-vault', 'aegis'], category: 'compliance', roi: '60% faster onboarding' },
    { id: 'trade-surveillance', name: 'Trade Surveillance', description: 'Market abuse detection with MiFID II/Dodd-Frank reporting', services: ['panopticon', 'council', 'chronos', 'evidence-vault'], category: 'compliance' },
    { id: 'regulatory-reporting', name: 'Regulatory Reporting', description: 'Automated regulatory filing with accuracy verification', services: ['panopticon', 'evidence-vault', 'ledger', 'veto'], category: 'compliance', roi: '70% faster filing' },
    { id: 'sox-evidence', name: 'SOX Compliance Evidence', description: 'Internal controls testing with audit-grade evidence packaging', services: ['panopticon', 'evidence-vault', 'ledger', 'chronos'], category: 'compliance', roi: '100% audit readiness' },
    { id: 'adverse-action', name: 'Adverse Action Documentation', description: 'ECOA/CFPB-compliant denial reason generation', services: ['council', 'evidence-vault', 'veto', 'ledger'], category: 'compliance' },
    // Trading Pack
    { id: 'algo-governance', name: 'Algorithmic Trading Governance', description: 'Pre-trade risk checks with kill switch and audit trails', services: ['council', 'veto', 'ledger', 'chronos'], category: 'trading' },
    { id: 'best-execution', name: 'Best Execution Analysis', description: 'Order routing optimization with TCA reporting', services: ['predict', 'evidence-vault', 'council'], category: 'trading' },
    // Wealth Pack
    { id: 'suitability-review', name: 'Investment Suitability', description: 'Client suitability assessment with regulation-aware recommendations', services: ['council', 'predict', 'evidence-vault', 'veto'], category: 'wealth' },
    { id: 'client-reporting', name: 'Client Performance Reporting', description: 'GIPS-compliant performance attribution and reporting', services: ['predict', 'evidence-vault', 'chronos'], category: 'wealth', roi: '50% faster reporting' },
    // Operations Pack
    { id: 'reconciliation', name: 'Automated Reconciliation', description: 'Cross-system trade and position reconciliation with break detection', services: ['panopticon', 'bridge', 'chronos'], category: 'operations', roi: '80% break reduction' },
    { id: 'liquidity-management', name: 'Liquidity Management', description: 'Cash flow forecasting and liquidity buffer optimization', services: ['predict', 'council', 'chronos'], category: 'operations' },
  ],
  
  pricing: {
    pilot: { price: '$100,000', includes: 'One business line end-to-end, 30 days' },
    professional: { price: '$400,000–$1,000,000/year', includes: 'Core Suite + 7 Financial Agents + Market Data Integration' },
    enterprise: { price: '$1,500,000–$5,000,000/year', includes: '+ All specialists, unlimited desks, on-prem option' },
    sovereign: { price: '$8,000,000+', includes: '+ Air-gapped, custom models, dedicated quant support' },
  },
  
  dashboardWidgets: ['risk-exposure', 'compliance-status', 'market-alerts', 'portfolio-summary', 'fraud-alerts', 'aml-queue', 'pnl-attribution', 'liquidity-forecast'],
  navigationItems: ['council', 'risk', 'compliance', 'trading', 'wealth', 'operations', 'reports', 'settings'],
  featureFlags: { realTimeRisk: true, tradeSurveillance: true, amlScreening: true, creditScoring: true, algoGovernance: true, bestExecution: true, regulatoryReporting: true, adverseAction: false },
  supportedDataSources: ['market-feeds', 'transaction-data', 'customer-data', 'regulatory-filings', 'trade-data', 'position-data', 'reference-data'],
  dataIngestionPipelines: ['market-data-sync', 'transaction-import', 'kyc-data-sync', 'trade-feed', 'position-sync', 'swift-messages'],
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
// CLIMATE RISK AI GOVERNANCE VERTICAL
// =============================================================================

export const climateRiskVerticalCustomization: VerticalCustomization = {
  id: 'climate-risk',
  name: 'Climate Risk AI Governance',
  shortName: 'Climate Risk',
  tier: 'growth',
  status: 'ga',

  branding: {
    primaryColor: '#059669', // Emerald green
    secondaryColor: '#047857',
    accentColor: '#34D399',
    icon: '🌍',
    tagline: 'Decision evidence for climate risk AI models',
    heroTitle: 'AI Governance for Climate Risk',
    heroSubtitle: 'Cryptographic audit trails for ESG scoring, climate stress tests, and sustainability disclosures',
  },

  coreServices: ['council', 'ledger', 'evidence-vault', 'chronos', 'predict', 'panopticon'],
  recommendedServices: ['crucible', 'bridge', 'sovereign', 'veto'],
  excludedServices: [],

  defaultAgents: [
    'climate-risk-analyst',
    'esg-compliance-officer',
    'sustainability-auditor',
    'scenario-modeler',
  ],
  optionalAgents: [
    'biodiversity-analyst',
    'carbon-accounting-officer',
    'transition-risk-analyst',
    'physical-risk-modeler',
  ],

  agentPresets: [
    {
      id: 'climate-stress-test',
      name: 'Climate Stress Test Governance',
      description: 'Decision evidence for climate scenario analysis and stress testing',
      defaultAgents: ['climate-risk-analyst', 'scenario-modeler', 'esg-compliance-officer', 'sustainability-auditor'],
      optionalAgents: ['transition-risk-analyst', 'physical-risk-modeler'],
      requiredApprovals: ['esg-compliance-officer'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'esg-scoring-audit',
      name: 'ESG Scoring Audit',
      description: 'Fairness and transparency evidence for AI-driven ESG ratings',
      defaultAgents: ['esg-compliance-officer', 'sustainability-auditor', 'climate-risk-analyst'],
      optionalAgents: ['carbon-accounting-officer'],
      requiredApprovals: ['sustainability-auditor'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'tcfd-tnfd-disclosure',
      name: 'TCFD/TNFD Disclosure Pack',
      description: 'Generate audit-grade evidence packages for climate and nature-related disclosures',
      defaultAgents: ['sustainability-auditor', 'climate-risk-analyst', 'esg-compliance-officer', 'scenario-modeler'],
      optionalAgents: ['biodiversity-analyst'],
      requiredApprovals: ['esg-compliance-officer', 'sustainability-auditor'],
      maxDeliberationRounds: 8,
    },
  ],

  compliance: {
    frameworks: ['TCFD', 'TNFD', 'EU CSRD', 'IFRS S1', 'IFRS S2', 'ECB Climate Risk Guide', 'ISO 14001', 'Basel III Pillar 3 ESG'],
    certifications: ['TCFD Aligned', 'CSRD Compliant', 'ISSB Compliant'],
    dataResidency: ['EU', 'US', 'Global', 'Client-Specified'],
    retentionPolicies: {
      default: 2555, // 7 years
      audit: 3650,   // 10 years
      legal: 7300,   // 20 years (climate litigation)
    },
    requiredApprovals: ['esg-compliance-officer', 'sustainability-auditor'],
  },

  integrations: [
    { id: 'bloomberg-esg', name: 'Bloomberg ESG Data', category: 'ESG Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'ESG scores, carbon data, climate scenarios', required: false },
    { id: 'msci-esg', name: 'MSCI ESG Ratings', category: 'ESG Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'ESG ratings integration for portfolio climate risk', required: false },
    { id: 'cdp', name: 'CDP (Carbon Disclosure Project)', category: 'Disclosure', difficulty: 'easy', timeline: '2-4 weeks', notes: 'CDP questionnaire response automation', required: false },
    { id: 'gresb', name: 'GRESB', category: 'Real Assets ESG', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Real estate and infrastructure ESG benchmarking', required: false },
  ],

  useCases: [
    { id: 'climate-stress-test', name: 'Climate Stress Test Evidence', description: 'Cryptographic audit trail for climate scenario analysis models', services: ['council', 'predict', 'evidence-vault', 'chronos'], category: 'climate', roi: '100% audit readiness' },
    { id: 'esg-scoring-governance', name: 'ESG Scoring Governance', description: 'Decision evidence for AI-driven ESG ratings and scoring', services: ['council', 'ledger', 'evidence-vault', 'veto'], category: 'esg' },
    { id: 'tcfd-disclosure-pack', name: 'TCFD/TNFD Disclosure Pack', description: 'Automated evidence packages for climate and nature disclosures', services: ['panopticon', 'evidence-vault', 'chronos', 'ledger'], category: 'disclosure', roi: '60% faster reporting' },
    { id: 'transition-risk-audit', name: 'Transition Risk Model Audit', description: 'Governance evidence for AI models predicting carbon transition impacts', services: ['predict', 'council', 'evidence-vault', 'crucible'], category: 'climate' },
    { id: 'green-lending-evidence', name: 'Green Lending Decision Evidence', description: 'Audit trails for AI-assisted green bond and sustainability-linked loan decisions', services: ['council', 'ledger', 'evidence-vault', 'predict'], category: 'lending' },
    { id: 'carbon-accounting-audit', name: 'Carbon Accounting AI Audit', description: 'Evidence for AI-assisted Scope 1/2/3 emissions calculations', services: ['ledger', 'evidence-vault', 'chronos', 'panopticon'], category: 'carbon' },
  ],

  pricing: {
    pilot: { price: '$50,000', includes: 'One climate risk model audit, 30 days' },
    professional: { price: '$200,000-$500,000/year', includes: 'Core Suite + 4 Climate Agents + TCFD/TNFD packs' },
    enterprise: { price: '$500,000-$1,500,000/year', includes: '+ All specialists, portfolio-wide climate governance' },
    sovereign: { price: '$2,000,000+', includes: '+ Central bank grade, multi-jurisdiction, on-prem' },
  },

  dashboardWidgets: ['climate-risk-score', 'esg-compliance-status', 'disclosure-deadlines', 'scenario-results', 'carbon-metrics'],
  navigationItems: ['council', 'climate-risk', 'esg-scoring', 'disclosures', 'scenarios', 'compliance', 'reports'],
  featureFlags: { climateStressTest: true, esgScoring: true, tcfdDisclosure: true, tnfdDisclosure: true, carbonAccounting: true },
  supportedDataSources: ['esg-ratings', 'carbon-data', 'climate-scenarios', 'emissions-data', 'sustainability-reports'],
  dataIngestionPipelines: ['bloomberg-esg-sync', 'msci-esg-sync', 'cdp-import', 'emissions-import'],
};

// =============================================================================
// FAIRNESS & GENDER AI GOVERNANCE VERTICAL
// =============================================================================

export const fairnessAIVerticalCustomization: VerticalCustomization = {
  id: 'fairness-ai',
  name: 'Fairness & Gender AI Governance',
  shortName: 'Fairness AI',
  tier: 'growth',
  status: 'ga',

  branding: {
    primaryColor: '#8B5CF6', // Violet
    secondaryColor: '#7C3AED',
    accentColor: '#C4B5FD',
    icon: '⚖️',
    tagline: 'Bias detection and fairness evidence for AI decisions',
    heroTitle: 'AI That Proves Fairness',
    heroSubtitle: 'Cryptographic evidence of bias testing, demographic impact analysis, and equitable AI outcomes',
  },

  coreServices: ['council', 'ledger', 'evidence-vault', 'predict', 'veto', 'ethics'],
  recommendedServices: ['crucible', 'panopticon', 'bridge', 'chronos'],
  excludedServices: [],

  defaultAgents: [
    'bias-auditor',
    'fairness-analyst',
    'demographic-impact-assessor',
    'ethics-compliance-officer',
  ],
  optionalAgents: [
    'gender-equity-analyst',
    'disparate-impact-tester',
    'accessibility-officer',
    'inclusion-metrics-analyst',
  ],

  agentPresets: [
    {
      id: 'lending-fairness-audit',
      name: 'Lending Fairness Audit',
      description: 'Bias detection and fairness evidence for AI credit scoring and lending decisions',
      defaultAgents: ['bias-auditor', 'fairness-analyst', 'demographic-impact-assessor', 'ethics-compliance-officer'],
      optionalAgents: ['disparate-impact-tester', 'gender-equity-analyst'],
      requiredApprovals: ['ethics-compliance-officer'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'hiring-fairness-audit',
      name: 'Hiring Algorithm Fairness',
      description: 'Gender and demographic fairness testing for AI-assisted hiring and HR decisions',
      defaultAgents: ['bias-auditor', 'fairness-analyst', 'gender-equity-analyst', 'ethics-compliance-officer'],
      optionalAgents: ['disparate-impact-tester'],
      requiredApprovals: ['ethics-compliance-officer', 'gender-equity-analyst'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'model-bias-assessment',
      name: 'Model Bias Assessment',
      description: 'Comprehensive bias testing across protected classes with fairness evidence generation',
      defaultAgents: ['bias-auditor', 'fairness-analyst', 'demographic-impact-assessor', 'ethics-compliance-officer'],
      optionalAgents: ['inclusion-metrics-analyst'],
      requiredApprovals: ['bias-auditor', 'ethics-compliance-officer'],
      maxDeliberationRounds: 10,
    },
  ],

  compliance: {
    frameworks: ['ECOA', 'CFPB AI Guidance', 'EU AI Act Art. 10', 'ISO/IEC TR 24027', 'NIST AI RMF', 'Title VII Civil Rights Act', 'EEOC AI Guidance'],
    certifications: ['ISO 42001 (Fairness)', 'Fairness Audit Certificate'],
    dataResidency: ['US', 'EU', 'Global', 'Client-Specified'],
    retentionPolicies: {
      default: 2555, // 7 years
      audit: 3650,   // 10 years
      legal: 7300,   // 20 years (discrimination litigation)
    },
    requiredApprovals: ['ethics-compliance-officer', 'bias-auditor'],
  },

  integrations: [
    { id: 'aequitas', name: 'Aequitas (Bias Toolkit)', category: 'Bias Detection', difficulty: 'easy', timeline: '2-3 weeks', notes: 'Open-source bias and fairness audit toolkit', required: false },
    { id: 'fairlearn', name: 'Fairlearn', category: 'Fairness Library', difficulty: 'easy', timeline: '2-3 weeks', notes: 'Microsoft fairness assessment library integration', required: false },
    { id: 'ai-fairness-360', name: 'AI Fairness 360', category: 'Bias Detection', difficulty: 'easy', timeline: '2-3 weeks', notes: 'IBM open-source bias detection toolkit', required: false },
    { id: 'hr-systems', name: 'HR / ATS Systems', category: 'HR Data', difficulty: 'medium', timeline: '4-8 weeks', notes: 'Workday, SAP SuccessFactors, Greenhouse', required: false },
  ],

  useCases: [
    { id: 'lending-bias-audit', name: 'Lending Bias Audit', description: 'Detect and evidence gender/racial bias in AI credit scoring', services: ['council', 'predict', 'evidence-vault', 'veto'], category: 'lending', roi: 'Regulatory compliance' },
    { id: 'hiring-fairness', name: 'Hiring Algorithm Fairness', description: 'Gender and demographic impact assessment for AI-assisted hiring', services: ['council', 'predict', 'evidence-vault', 'crucible'], category: 'hr' },
    { id: 'disparate-impact-test', name: 'Disparate Impact Testing', description: 'Automated four-fifths rule testing with cryptographic evidence', services: ['predict', 'evidence-vault', 'ledger'], category: 'compliance', roi: '100% audit readiness' },
    { id: 'gender-disaggregated-audit', name: 'Gender-Disaggregated Impact Audit', description: 'Evidence of AI decision outcomes broken down by gender with fairness metrics', services: ['predict', 'evidence-vault', 'ledger', 'panopticon'], category: 'gender' },
    { id: 'adverse-action-evidence', name: 'Adverse Action Evidence Pack', description: 'ECOA/CFPB-compliant explanation evidence for AI-driven credit denials', services: ['council', 'evidence-vault', 'ledger', 'veto'], category: 'lending' },
    { id: 'model-fairness-certificate', name: 'Model Fairness Certificate', description: 'Cryptographically signed fairness assessment with demographic parity metrics', services: ['predict', 'evidence-vault', 'ledger', 'council'], category: 'certification' },
  ],

  pricing: {
    pilot: { price: '$35,000', includes: 'One model fairness audit, 15 days' },
    professional: { price: '$150,000-$400,000/year', includes: 'Core Suite + 4 Fairness Agents + bias testing' },
    enterprise: { price: '$400,000-$1,000,000/year', includes: '+ All specialists, portfolio-wide fairness governance' },
    sovereign: { price: '$1,500,000+', includes: '+ Regulator-grade, multi-jurisdiction, on-prem' },
  },

  dashboardWidgets: ['fairness-score', 'bias-alerts', 'demographic-parity', 'disparate-impact-metrics', 'audit-status'],
  navigationItems: ['council', 'bias-audit', 'fairness-testing', 'demographics', 'compliance', 'reports'],
  featureFlags: { biasDetection: true, fairnessMetrics: true, genderDisaggregation: true, disparateImpactTest: true, adverseActionEvidence: true },
  supportedDataSources: ['model-predictions', 'demographic-data', 'credit-decisions', 'hiring-data', 'hr-records'],
  dataIngestionPipelines: ['model-output-import', 'demographic-sync', 'credit-decision-import', 'ats-sync'],
};

// =============================================================================
// INSURANCE VERTICAL CUSTOMIZATION
// =============================================================================

export const insuranceVerticalCustomization: VerticalCustomization = {
  id: 'insurance',
  name: 'Insurance / Insurtech',
  shortName: 'Insurance',
  tier: 'priority',
  status: 'ga',

  branding: {
    primaryColor: '#0891B2', // Cyan
    secondaryColor: '#0E7490',
    accentColor: '#67E8F9',
    icon: '🛡️',
    tagline: 'AI-powered underwriting with audit-grade decision evidence',
    heroTitle: 'Insurance AI That Passes the Audit',
    heroSubtitle: 'Solvency II, NAIC, and Lloyd\'s compliant decision intelligence for carriers and MGAs',
  },

  coreServices: ['council', 'ledger', 'evidence-vault', 'predict', 'veto', 'panopticon'],
  recommendedServices: ['crucible', 'chronos', 'aegis', 'bridge', 'sovereign'],
  excludedServices: [],

  defaultAgents: ['chief-underwriter', 'claims-adjuster', 'actuary-ai', 'compliance-officer', 'reinsurance-analyst', 'fraud-investigator'],
  optionalAgents: ['catastrophe-modeler', 'product-actuary', 'distribution-analyst', 'regulatory-liaison'],

  agentPresets: [
    {
      id: 'underwriting-decision',
      name: 'Underwriting Decision',
      description: 'Risk assessment, pricing, and coverage determination with full audit trail',
      defaultAgents: ['chief-underwriter', 'actuary-ai', 'compliance-officer', 'fraud-investigator'],
      optionalAgents: ['reinsurance-analyst', 'catastrophe-modeler'],
      requiredApprovals: ['chief-underwriter', 'compliance-officer'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'claims-adjudication',
      name: 'Claims Adjudication',
      description: 'Claims assessment with fraud detection and regulatory-compliant settlement',
      defaultAgents: ['claims-adjuster', 'fraud-investigator', 'compliance-officer', 'actuary-ai'],
      optionalAgents: ['chief-underwriter'],
      requiredApprovals: ['claims-adjuster'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'reinsurance-placement',
      name: 'Reinsurance Placement',
      description: 'Treaty and facultative placement with capacity optimization',
      defaultAgents: ['reinsurance-analyst', 'actuary-ai', 'chief-underwriter', 'compliance-officer'],
      optionalAgents: ['catastrophe-modeler'],
      requiredApprovals: ['reinsurance-analyst', 'chief-underwriter'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'product-development',
      name: 'Product Development',
      description: 'New product pricing, filing, and regulatory approval workflow',
      defaultAgents: ['product-actuary', 'compliance-officer', 'chief-underwriter', 'actuary-ai'],
      optionalAgents: ['distribution-analyst', 'regulatory-liaison'],
      requiredApprovals: ['compliance-officer', 'product-actuary'],
      maxDeliberationRounds: 10,
    },
  ],

  compliance: {
    frameworks: ['Solvency II', 'NAIC Model Laws', 'IFRS 17', 'Lloyd\'s Minimum Standards', 'State Insurance Regulations', 'ORSA', 'EU AI Act', 'GDPR'],
    certifications: ['SOC 2 Type II', 'ISO 27001', 'Lloyd\'s Approved'],
    dataResidency: ['US', 'EU', 'UK', 'Bermuda', 'Client-Specified'],
    retentionPolicies: {
      default: 2555, // 7 years
      audit: 3650,   // 10 years
      legal: 7300,   // 20 years (long-tail claims)
    },
    requiredApprovals: ['compliance-officer', 'chief-underwriter'],
  },

  integrations: [
    { id: 'guidewire', name: 'Guidewire InsuranceSuite', category: 'Policy Admin', difficulty: 'hard', timeline: '8-16 weeks', notes: 'PolicyCenter, ClaimCenter, BillingCenter integration', required: false },
    { id: 'duck-creek', name: 'Duck Creek Technologies', category: 'Policy Admin', difficulty: 'hard', timeline: '8-16 weeks', notes: 'Policy, billing, claims, insights', required: false },
    { id: 'verisk', name: 'Verisk Analytics', category: 'Data & Analytics', difficulty: 'medium', timeline: '4-8 weeks', notes: 'ISO rating, PCS catastrophe data, underwriting analytics', required: false },
    { id: 'rms', name: 'Moody\'s RMS', category: 'Catastrophe Modeling', difficulty: 'medium', timeline: '4-8 weeks', notes: 'RiskLink, Risk Modeler catastrophe analytics', required: false },
    { id: 'air-worldwide', name: 'Veritas (AIR)', category: 'Catastrophe Modeling', difficulty: 'medium', timeline: '4-8 weeks', notes: 'Touchstone catastrophe loss modeling', required: false },
    { id: 'lexisnexis-insurance', name: 'LexisNexis Risk Solutions', category: 'Data Prefill', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Claims history, property data, risk scoring', required: false },
    { id: 'applied-epic', name: 'Applied Epic', category: 'Agency Management', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Agency management system, download workflows', required: false },
    { id: 'shift-technology', name: 'Shift Technology', category: 'Fraud Detection', difficulty: 'medium', timeline: '4-6 weeks', notes: 'AI-powered claims fraud detection', required: false },
  ],

  useCases: [
    // Underwriting Pack
    { id: 'automated-underwriting', name: 'Automated Underwriting', description: 'Straight-through processing with risk scoring and referral rules', services: ['council', 'predict', 'evidence-vault', 'veto'], category: 'underwriting', roi: '50% faster processing' },
    { id: 'risk-selection', name: 'Risk Selection & Pricing', description: 'Multi-factor risk assessment with actuarial pricing models', services: ['predict', 'council', 'evidence-vault'], category: 'underwriting', roi: '15% loss ratio improvement' },
    { id: 'underwriting-audit', name: 'Underwriting Audit Trail', description: 'Full decision evidence for regulatory examination', services: ['ledger', 'evidence-vault', 'chronos', 'veto'], category: 'underwriting', roi: '100% audit readiness' },
    { id: 'large-risk-review', name: 'Large Risk Review', description: 'Multi-agent deliberation for complex commercial risks', services: ['council', 'crucible', 'predict', 'evidence-vault'], category: 'underwriting' },
    // Claims Pack
    { id: 'claims-triage', name: 'Claims Triage & Routing', description: 'Automated severity scoring and adjuster assignment', services: ['predict', 'council', 'chronos'], category: 'claims', roi: '30% faster triage' },
    { id: 'fraud-detection-claims', name: 'Claims Fraud Detection', description: 'Pattern analysis with SIU referral automation', services: ['predict', 'aegis', 'evidence-vault', 'council'], category: 'claims', roi: '25% fraud savings' },
    { id: 'reserve-estimation', name: 'Reserve Estimation', description: 'AI-assisted loss reserve calculation with actuarial validation', services: ['predict', 'council', 'evidence-vault'], category: 'claims' },
    { id: 'subrogation', name: 'Subrogation Identification', description: 'Recovery opportunity detection with evidence packaging', services: ['council', 'predict', 'evidence-vault', 'bridge'], category: 'claims', roi: '20% recovery increase' },
    // Actuarial Pack
    { id: 'loss-modeling', name: 'Loss Modeling & Forecasting', description: 'Predictive loss development with uncertainty quantification', services: ['predict', 'council', 'evidence-vault'], category: 'actuarial' },
    { id: 'rate-adequacy', name: 'Rate Adequacy Analysis', description: 'Premium sufficiency testing with regulatory filing support', services: ['predict', 'evidence-vault', 'ledger', 'veto'], category: 'actuarial' },
    { id: 'catastrophe-analysis', name: 'Catastrophe Risk Analysis', description: 'PML estimation with aggregation and reinsurance optimization', services: ['predict', 'council', 'panopticon'], category: 'actuarial' },
    // Compliance Pack
    { id: 'solvency-monitoring', name: 'Solvency Monitoring', description: 'Real-time capital adequacy tracking with early warning', services: ['panopticon', 'predict', 'council'], category: 'compliance' },
    { id: 'market-conduct', name: 'Market Conduct Compliance', description: 'Sales practice monitoring with complaint analysis', services: ['panopticon', 'evidence-vault', 'council', 'veto'], category: 'compliance' },
    { id: 'ifrs17-reporting', name: 'IFRS 17 Compliance', description: 'Insurance contract measurement and disclosure evidence', services: ['predict', 'evidence-vault', 'ledger', 'panopticon'], category: 'compliance', roi: '70% faster reporting' },
    // Reinsurance Pack
    { id: 'treaty-optimization', name: 'Treaty Structure Optimization', description: 'Reinsurance program design with cost-benefit analysis', services: ['predict', 'council', 'evidence-vault'], category: 'reinsurance' },
    { id: 'commutation-analysis', name: 'Commutation Analysis', description: 'Portfolio transfer and commutation valuation', services: ['predict', 'council', 'evidence-vault', 'bridge'], category: 'reinsurance' },
  ],

  pricing: {
    pilot: { price: '$75,000', includes: 'One line of business end-to-end, 30 days' },
    professional: { price: '$300,000–$750,000/year', includes: 'Core Suite + 6 Insurance Agents + Guidewire Integration' },
    enterprise: { price: '$1,000,000–$3,000,000/year', includes: '+ All specialists, multi-line, catastrophe modeling' },
    sovereign: { price: '$5,000,000+', includes: '+ Air-gapped, custom actuarial models, dedicated support' },
  },

  dashboardWidgets: ['loss-ratio', 'combined-ratio', 'claims-pipeline', 'underwriting-queue', 'fraud-alerts', 'solvency-ratio', 'catastrophe-exposure', 'reinsurance-utilization'],
  navigationItems: ['council', 'underwriting', 'claims', 'actuarial', 'reinsurance', 'compliance', 'reports', 'settings'],
  featureFlags: { automatedUnderwriting: true, claimsFraud: true, catastropheModeling: true, reserveEstimation: true, solvencyMonitoring: true, ifrs17: true, subrogation: true, marketConduct: false },
  supportedDataSources: ['policy-data', 'claims-data', 'premium-data', 'loss-triangles', 'catastrophe-data', 'reinsurance-data', 'market-data'],
  dataIngestionPipelines: ['guidewire-sync', 'duck-creek-sync', 'verisk-import', 'cat-model-import', 'claims-feed', 'bordereaux-import'],
};

// =============================================================================
// SPORTS VERTICAL CUSTOMIZATION
// =============================================================================

export const sportsVerticalCustomization: VerticalCustomization = {
  id: 'sports',
  name: 'Sports / Football Clubs',
  shortName: 'Sports',
  tier: 'priority',
  status: 'ga',

  branding: {
    primaryColor: '#DC2626', // Red
    secondaryColor: '#991B1B',
    accentColor: '#FCA5A5',
    icon: '⚽',
    tagline: 'Decision governance for the beautiful game',
    heroTitle: 'The AI Sporting Directors Trust',
    heroSubtitle: 'FFP-compliant transfer intelligence with full audit trail for FIFA, UEFA, and domestic regulators',
  },

  coreServices: ['council', 'ledger', 'evidence-vault', 'chronos', 'veto', 'predict'],
  recommendedServices: ['crucible', 'panopticon', 'bridge', 'sovereign'],
  excludedServices: [],

  defaultAgents: ['sporting-director', 'chief-scout', 'financial-controller', 'legal-counsel', 'performance-analyst', 'fan-engagement'],
  optionalAgents: ['medical-director', 'academy-director', 'data-scientist', 'commercial-director'],

  agentPresets: [
    {
      id: 'transfer-inbound',
      name: 'Inbound Transfer Decision',
      description: 'Full transfer evaluation with scouting, valuation, FFP assessment, and regulatory compliance',
      defaultAgents: ['sporting-director', 'chief-scout', 'financial-controller', 'legal-counsel', 'performance-analyst'],
      optionalAgents: ['fan-engagement', 'medical-director'],
      requiredApprovals: ['sporting-director', 'financial-controller'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'transfer-outbound',
      name: 'Outbound Transfer Decision',
      description: 'Player sale evaluation with squad impact, revenue optimization, and replacement planning',
      defaultAgents: ['sporting-director', 'financial-controller', 'legal-counsel', 'chief-scout'],
      optionalAgents: ['performance-analyst', 'commercial-director'],
      requiredApprovals: ['sporting-director'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'contract-renewal',
      name: 'Contract Renewal',
      description: 'Wage structure analysis, performance benchmarking, and FFP impact assessment',
      defaultAgents: ['financial-controller', 'sporting-director', 'legal-counsel', 'performance-analyst'],
      optionalAgents: ['commercial-director'],
      requiredApprovals: ['financial-controller', 'legal-counsel'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'squad-planning',
      name: 'Squad Planning Session',
      description: 'Strategic squad assessment with position-by-position analysis and budget allocation',
      defaultAgents: ['sporting-director', 'chief-scout', 'performance-analyst', 'financial-controller'],
      optionalAgents: ['academy-director', 'data-scientist'],
      requiredApprovals: ['sporting-director'],
      maxDeliberationRounds: 10,
    },
  ],

  compliance: {
    frameworks: ['FIFA RSTP', 'UEFA FFP / Financial Sustainability', 'UEFA Club Licensing', 'Premier League PSR', 'FIFA Football Agent Regulations', 'CAS Arbitration Standards', 'EU AI Act'],
    certifications: ['FIFA Club Licensing', 'UEFA License', 'Domestic License'],
    dataResidency: ['EU', 'UK', 'Switzerland', 'Client-Specified'],
    retentionPolicies: {
      default: 2555, // 7 years
      audit: 3650,   // 10 years
      legal: 7300,   // 20 years (for TMS/integrity investigations)
    },
    requiredApprovals: ['sporting-director', 'financial-controller'],
  },

  integrations: [
    { id: 'transfermarkt', name: 'Transfermarkt', category: 'Player Data', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Market values, transfer history, player profiles', required: false },
    { id: 'opta', name: 'Opta (Stats Perform)', category: 'Match Data', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Match events, player stats, expected metrics', required: false },
    { id: 'statsbomb', name: 'StatsBomb', category: 'Advanced Analytics', difficulty: 'medium', timeline: '4-6 weeks', notes: 'Advanced metrics, 360 freeze frames, pressure events', required: false },
    { id: 'wyscout', name: 'Wyscout', category: 'Scouting', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Video scouting, player comparison, match analysis', required: false },
    { id: 'catapult', name: 'Catapult Sports', category: 'Physical Performance', difficulty: 'medium', timeline: '4-6 weeks', notes: 'GPS tracking, load monitoring, injury risk', required: false },
    { id: 'hudl', name: 'Hudl (InStat)', category: 'Video Analysis', difficulty: 'easy', timeline: '2-4 weeks', notes: 'Tactical video analysis, opponent scouting', required: false },
    { id: 'fifa-tms', name: 'FIFA TMS', category: 'Regulatory', difficulty: 'hard', timeline: '8-12 weeks', notes: 'Transfer Matching System, ITC, agent registration', required: false },
    { id: 'sap-sports', name: 'SAP Sports One', category: 'Club Management', difficulty: 'medium', timeline: '6-10 weeks', notes: 'Club operations, finance, HR, scouting integration', required: false },
  ],

  useCases: [
    // Transfer Pack
    { id: 'transfer-evaluation', name: 'Transfer Decision Package', description: 'Full multi-agent transfer evaluation with scouting, valuation, and FFP assessment', services: ['council', 'predict', 'evidence-vault', 'veto'], category: 'transfer', roi: '30% better signings' },
    { id: 'player-valuation', name: 'Player Valuation Model', description: 'Market value estimation with comparable analysis and amortization modeling', services: ['predict', 'council', 'evidence-vault'], category: 'transfer' },
    { id: 'alternative-scouting', name: 'Alternative Player Identification', description: 'Statistical similarity search for transfer targets with budget constraints', services: ['predict', 'bridge', 'council'], category: 'transfer', roi: '3x shortlist quality' },
    { id: 'negotiation-strategy', name: 'Negotiation Strategy', description: 'Scenario planning with walk-away price and add-on structure optimization', services: ['council', 'crucible', 'predict', 'evidence-vault'], category: 'transfer' },
    // Financial Pack
    { id: 'ffp-monitoring', name: 'FFP Compliance Monitoring', description: 'Real-time break-even tracking with transaction impact simulation', services: ['panopticon', 'predict', 'council', 'evidence-vault'], category: 'financial', roi: '100% FFP compliance' },
    { id: 'wage-structure', name: 'Wage Structure Analysis', description: 'Salary cap modeling with squad hierarchy and incentive optimization', services: ['predict', 'council', 'evidence-vault'], category: 'financial' },
    { id: 'amortization-planning', name: 'Transfer Amortization Planning', description: 'P&L impact modeling across contract duration with impairment testing', services: ['predict', 'evidence-vault', 'chronos'], category: 'financial' },
    // Performance Pack
    { id: 'squad-balance', name: 'Squad Balance Assessment', description: 'Position-by-position analysis with age curve and squad depth scoring', services: ['predict', 'council', 'bridge'], category: 'performance' },
    { id: 'injury-risk', name: 'Injury Risk Prediction', description: 'Load monitoring with injury probability scoring and prevention protocols', services: ['predict', 'council', 'chronos'], category: 'performance', roi: '20% fewer injuries' },
    { id: 'match-analysis', name: 'Tactical Match Analysis', description: 'Opponent analysis with tactical recommendation and set-piece strategy', services: ['council', 'predict', 'bridge'], category: 'performance' },
    // Governance Pack
    { id: 'agent-compliance', name: 'Agent Fee Compliance', description: 'FIFA agent regulation compliance with fee cap verification', services: ['veto', 'ledger', 'evidence-vault', 'council'], category: 'governance' },
    { id: 'tpi-review', name: 'Third Party Interest Review', description: 'TPO/TPI detection and regulatory compliance verification', services: ['council', 'veto', 'evidence-vault', 'panopticon'], category: 'governance' },
    { id: 'decision-audit-trail', name: 'Decision Audit Trail', description: 'Immutable evidence package for UEFA/FIFA regulatory inquiries', services: ['ledger', 'evidence-vault', 'chronos', 'veto'], category: 'governance', roi: '100% audit readiness' },
    // Commercial Pack
    { id: 'shirt-sale-projection', name: 'Commercial Impact Projection', description: 'Shirt sales, social media, and sponsorship impact modeling', services: ['predict', 'council', 'bridge'], category: 'commercial' },
    { id: 'academy-roi', name: 'Academy ROI Analysis', description: 'Youth development investment return with pathway probability scoring', services: ['predict', 'council', 'evidence-vault', 'chronos'], category: 'commercial' },
    { id: 'matchday-revenue', name: 'Matchday Revenue Optimization', description: 'Dynamic pricing and hospitality yield management', services: ['predict', 'council'], category: 'commercial' },
  ],

  pricing: {
    pilot: { price: '$50,000', includes: 'One transfer window end-to-end, 45 days' },
    professional: { price: '$200,000–$500,000/year', includes: 'Core Suite + 6 Sports Agents + Data Provider Integration' },
    enterprise: { price: '$500,000–$1,500,000/year', includes: '+ All specialists, multi-team/group, academy integration' },
    sovereign: { price: '$3,000,000+', includes: '+ Multi-club group, custom models, dedicated analyst support' },
  },

  dashboardWidgets: ['transfer-pipeline', 'ffp-tracker', 'squad-overview', 'scouting-watchlist', 'injury-status', 'wage-budget', 'agent-fees', 'deadline-countdown'],
  navigationItems: ['council', 'transfers', 'scouting', 'squad', 'financials', 'compliance', 'reports', 'settings'],
  featureFlags: { transferDecisions: true, ffpMonitoring: true, scoutingPipeline: true, injuryPrediction: true, agentCompliance: true, wageModeling: true, matchAnalysis: true, academyTracking: false },
  supportedDataSources: ['match-data', 'player-stats', 'scouting-reports', 'financial-data', 'medical-data', 'agent-data', 'transfer-data'],
  dataIngestionPipelines: ['opta-sync', 'statsbomb-sync', 'wyscout-import', 'catapult-sync', 'transfermarkt-sync', 'tms-feed'],
};

// =============================================================================
// VERTICAL REGISTRY
// =============================================================================

export const VERTICAL_CUSTOMIZATIONS: Record<string, VerticalCustomization> = {
  legal: legalVerticalCustomization,
  healthcare: healthcareVerticalCustomization,
  financial: financialVerticalCustomization,
  government: governmentVerticalCustomization,
  insurance: insuranceVerticalCustomization,
  sports: sportsVerticalCustomization,
  'climate-risk': climateRiskVerticalCustomization,
  'fairness-ai': fairnessAIVerticalCustomization,
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
