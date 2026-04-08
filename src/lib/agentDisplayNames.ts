/**
 * Library — Agent Display Names
 *
 * Client-side utility library.
 *
 * @exports getAgentDisplayName, getAgentInternalName, hasAgentDisplayName, getAllAgentDisplayNames, getRegulatorySafeTerm, REGULATORY_SAFE_TERMS, CANONICAL_DISCLAIMER
 * @module lib/agentDisplayNames
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - AGENT DISPLAY NAME MAPPING
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * Regulatory-safe display names for AI analysis components.
 * 
 * RATIONALE:
 * - SR 11-7 and EU AI Act require clear distinction between AI outputs and human decisions
 * - Anthropomorphic agent names ("Risk Sentinel") can trigger regulatory scrutiny
 * - These display names present agents as "analysis components" rather than autonomous actors
 * 
 * USAGE:
 * - Use getAgentDisplayName(agentId) in all user-facing UI
 * - Internal IDs remain unchanged for API stability
 * - Export artifacts use these names automatically
 */

// =============================================================================
// FINANCIAL SERVICES AGENTS
// =============================================================================
const FINANCIAL_AGENT_NAMES: Record<string, string> = {
  'risk-sentinel': 'Risk Analysis',
  'alpha-hunter': 'Investment Analysis',
  'compliance-guardian': 'Compliance Verification',
  'market-pulse': 'Market Analysis',
  'credit-analyst': 'Credit Analysis',
  'portfolio-manager': 'Portfolio Analysis',
  'workout-specialist': 'Workout Analysis',
  'execution-specialist': 'Execution Analysis',
  'counterparty-analyst': 'Counterparty Analysis',
  'quant-analyst': 'Quantitative Analysis',
  'model-developer': 'Model Development',
  'audit-specialist': 'Audit Analysis',
  'investigation-specialist': 'Investigation Analysis',
  'sanctions-analyst': 'Sanctions Analysis',
  'kyc-specialist': 'KYC Analysis',
  'tax-specialist': 'Tax Analysis',
  'estate-planner': 'Estate Planning Analysis',
  'suitability-officer': 'Suitability Analysis',
  'treasury-specialist': 'Treasury Analysis',
  'funding-analyst': 'Funding Analysis',
  'capital-planner': 'Capital Planning Analysis',
  'economics-specialist': 'Economics Analysis',
  'technology-risk-analyst': 'Technology Risk Analysis',
  'trading-desk-head': 'Trading Desk Analysis',
  'investor-relations': 'Investor Relations Analysis',
};

// =============================================================================
// CORE/UNIVERSAL AGENTS
// =============================================================================
const CORE_AGENT_NAMES: Record<string, string> = {
  // C-Suite roles - keep professional titles
  'chief': 'Strategic Analysis',
  'cfo': 'Financial Analysis',
  'coo': 'Operations Analysis',
  'ciso': 'Security Analysis',
  'cto': 'Technology Analysis',
  'cmo': 'Marketing Analysis',
  'chro': 'Human Resources Analysis',
  'clo': 'Legal Analysis',
  'cro': 'Revenue Analysis',
  'cdo': 'Data Intelligence Analysis',
  'cpo': 'Product Strategy Analysis',
  'caio': 'AI Strategy Analysis',
  'cso': 'Sustainability Analysis',
  'cio': 'Investment Intelligence Analysis',
  'cco': 'Communications Analysis',
  'risk': 'Risk Assessment Analysis',
  
  // Support agents
  'partnerships': 'Strategic Partnerships Analysis',
  'analyst': 'Strategic Analysis',
  'arbiter': 'Conflict Resolution Analysis',
  'actuary': 'Actuarial Analysis',
  'redteam': 'Red Team Analysis',
  'union': 'Employee Advocacy Analysis',
  
  // Adversarial/Red Team
  'adversarial-reviewer': 'Stress Test Analysis',
  'red-team': 'Adversarial Analysis',
  'devils-advocate': 'Challenge Analysis',
  
  // General roles
  'risk-manager': 'Risk Analysis',
  'legal-counsel': 'Legal Analysis',
  'strategy': 'Strategy Analysis',
  'operations': 'Operations Analysis',

  // Premium Foundation
  'cxo': 'Customer Experience Analysis',
  'procurement': 'Procurement Analysis',
  'ma': 'M&A Intelligence Analysis',
  'innovation': 'Innovation Analysis',
  'ir': 'Investor Relations Analysis',
  'ethics': 'Ethics & Governance Analysis',
  'crisis': 'Crisis Management Analysis',
  'gov-relations': 'Government Relations Analysis',

  // Premium Enterprise
  'ext-auditor': 'External Audit Analysis',
  'int-auditor': 'Internal Audit Analysis',
  'pso': 'Patient Safety Analysis',
  'hco': 'Healthcare Compliance Analysis',
  'cod': 'Clinical Operations Analysis',
  'quant': 'Quantitative Analysis',
  'pm': 'Portfolio Management Analysis',
  'cro-finance': 'Credit Risk Analysis',
  'contracts': 'Contract Analysis',
  'ip': 'Intellectual Property Analysis',
  'litigation': 'Litigation Analysis',
  'regulatory': 'Regulatory Affairs Analysis',
};

// =============================================================================
// LEGAL VERTICAL AGENTS
// =============================================================================
const LEGAL_AGENT_NAMES: Record<string, string> = {
  'matter-lead': 'Matter Analysis',
  'research-counsel': 'Research Analysis',
  'contract-counsel': 'Contract Analysis',
  'litigation-strategist': 'Litigation Analysis',
  'risk-counsel': 'Risk & Liability Analysis',
  'opposing-counsel': 'Adversarial Analysis',
  'privilege-officer': 'Privilege Analysis',
  'evidence-officer': 'Evidence Analysis',
  'regulatory-counsel': 'Regulatory Analysis',
  'employment-counsel': 'Employment Analysis',
  'ip-counsel': 'IP Analysis',
  'tax-counsel': 'Tax Analysis',
  'antitrust-counsel': 'Antitrust Analysis',
  'commercial-advisor': 'Commercial Analysis',
};

// =============================================================================
// HEALTHCARE VERTICAL AGENTS
// =============================================================================
const HEALTHCARE_AGENT_NAMES: Record<string, string> = {
  'cmio': 'Medical Information Analysis',
  'patient-safety': 'Patient Safety Analysis',
  'clinical-ops': 'Clinical Operations Analysis',
  'healthcare-compliance': 'Healthcare Compliance Analysis',
  'physician': 'Clinical Analysis',
  'nurse-leader': 'Nursing Leadership Analysis',
  'pharmacist': 'Pharmacy Analysis',
  'case-manager': 'Case Management Analysis',
  'health-informatics': 'Health Informatics Analysis',
  'revenue-cycle': 'Revenue Cycle Analysis',
  'infection-control': 'Infection Control Analysis',
  'medical-director': 'Medical Director Analysis',
  'care-coordinator': 'Care Coordination Analysis',
  'clinical-advisor': 'Clinical Analysis',
  'capacity-oracle': 'Capacity Analysis',
  'quality-sentinel': 'Quality Analysis',
};

// =============================================================================
// OTHER VERTICAL AGENTS
// =============================================================================
const OTHER_AGENT_NAMES: Record<string, string> = {
  // Finance Vertical
  'quant-analyst': 'Quantitative Analysis',
  'portfolio-manager': 'Portfolio Analysis',
  'credit-risk': 'Credit Risk Analysis',
  'treasury': 'Treasury Analysis',
  'investment-banker': 'Investment Banking Analysis',
  'financial-compliance': 'Financial Compliance Analysis',
  'market-risk': 'Market Risk Analysis',
  'wealth-advisor': 'Wealth Advisory Analysis',
  'trading-desk': 'Trading Analysis',
  'financial-analyst': 'Financial Analysis',
  'fund-accountant': 'Fund Accounting Analysis',
  'fintech-strategist': 'Fintech Strategy Analysis',

  // Legal Vertical
  'prosecutor': 'Prosecution Analysis',
  'defense-attorney': 'Defense Analysis',
  'judge': 'Judicial Analysis',
  'juror-skeptic': 'Skeptical Juror Analysis',
  'juror-emotional': 'Emotional Impact Analysis',
  'juror-analytical': 'Analytical Juror Analysis',
  'juror-foreperson': 'Jury Foreperson Analysis',
  'matter-lead': 'Matter Analysis',
  'research-counsel': 'Research Analysis',
  'contract-counsel': 'Contract Analysis',
  'litigation-strategist': 'Litigation Analysis',
  'risk-counsel': 'Risk & Liability Analysis',
  'opposing-counsel': 'Adversarial Analysis',
  'privilege-officer': 'Privilege Analysis',
  'evidence-officer': 'Evidence Analysis',
  'regulatory-specialist': 'Regulatory Analysis',
  'ip-specialist': 'Intellectual Property Analysis',
  'employment-specialist': 'Employment Analysis',
  'commercial-advisor': 'Commercial Analysis',
  'forensics': 'Forensic Analysis',

  // Manufacturing
  'plant-manager': 'Plant Operations Analysis',
  'quality-engineer': 'Quality Engineering Analysis',
  'supply-chain-mfg': 'Supply Chain Analysis',
  'process-engineer': 'Process Engineering Analysis',
  'production-planner': 'Production Planning Analysis',
  'maintenance-manager': 'Maintenance Analysis',
  'safety-director': 'Safety Analysis',
  'production-manager': 'Production Management Analysis',
  'industrial-engineer': 'Industrial Engineering Analysis',
  'materials-manager': 'Materials Analysis',
  'tooling-engineer': 'Tooling Analysis',
  'ehs-manager': 'Environmental Health & Safety Analysis',
  'production-master': 'Production Analysis',
  'predict-maintain': 'Maintenance Analysis',
  'quality-vision': 'Quality Analysis',
  'supply-sync': 'Supply Chain Analysis',

  // Technology
  'product-manager': 'Product Analysis',
  'engineering-manager': 'Engineering Analysis',
  'architect': 'Architecture Analysis',
  'devops-lead': 'DevOps Analysis',
  'security-engineer': 'Security Engineering Analysis',
  'data-engineer': 'Data Engineering Analysis',
  'ml-engineer': 'ML Engineering Analysis',
  'ux-lead': 'UX Analysis',
  'qa-lead': 'QA Analysis',
  'tech-writer': 'Technical Documentation Analysis',
  'site-reliability': 'Reliability Analysis',
  'security-fortress': 'Security Analysis',
  'dev-velocity': 'Engineering Analysis',
  'data-architect': 'Data Analysis',

  // Energy
  'grid-operator': 'Grid Operations Analysis',
  'energy-trader': 'Energy Trading Analysis',
  'renewable-developer': 'Renewable Development Analysis',
  'environmental-energy': 'Environmental Compliance Analysis',
  'energy-analyst': 'Energy Analysis',
  'asset-manager-energy': 'Asset Management Analysis',
  'transmission-planner': 'Transmission Planning Analysis',
  'storage-specialist': 'Energy Storage Analysis',
  'utility-regulatory': 'Utility Regulatory Analysis',
  'grid-balancer': 'Grid Analysis',
  'renewable-optimizer': 'Renewable Analysis',
  'asset-guardian': 'Asset Analysis',
  'demand-response': 'Demand Analysis',

  // Government
  'policy-analyst': 'Policy Analysis',
  'procurement-officer': 'Procurement Analysis',
  'grants-manager': 'Grants Analysis',
  'foia-officer': 'FOIA Analysis',
  'cybersecurity-gov': 'Government Cybersecurity Analysis',
  'budget-analyst-gov': 'Budget Analysis',
  'program-manager-gov': 'Program Management Analysis',
  'hr-specialist-gov': 'HR Analysis',
  'inspector-general': 'Inspector General Analysis',
  'legislative-affairs': 'Legislative Analysis',
  'ethics-officer-gov': 'Ethics Analysis',
  'public-affairs': 'Public Affairs Analysis',
  'policy-advisor': 'Policy Analysis',
  'citizen-engagement': 'Citizen Services Analysis',
  'budget-optimizer': 'Budget Analysis',
  'transparency-engine': 'Transparency Analysis',
  'infrastructure-planner': 'Infrastructure Analysis',

  // Insurance
  'underwriter': 'Underwriting Analysis',
  'claims-adjuster': 'Claims Analysis',
  'insurance-actuary': 'Actuarial Analysis',
  'insurance-compliance': 'Insurance Compliance Analysis',
  'loss-control': 'Loss Control Analysis',
  'reinsurance': 'Reinsurance Analysis',
  'product-development-ins': 'Product Development Analysis',
  'policy-admin': 'Policy Administration Analysis',
  'siu': 'Special Investigation Analysis',
  'agency-manager': 'Agency Management Analysis',
  'pricing-analyst': 'Pricing Analysis',
  'carrier-relations': 'Carrier Relations Analysis',
  'underwriting-ai': 'Underwriting Analysis',
  'claims-processor': 'Claims Analysis',
  'actuarial-engine': 'Actuarial Analysis',
  'insurance-policy-advisor': 'Insurance Policy Analysis',

  // Pharmaceutical
  'clinical-development': 'Clinical Development Analysis',
  'regulatory-affairs': 'Regulatory Affairs Analysis',
  'pharmacovigilance': 'Pharmacovigilance Analysis',
  'market-access': 'Market Access Analysis',
  'medical-affairs': 'Medical Affairs Analysis',
  'supply-chain-pharma': 'Pharma Supply Chain Analysis',
  'qa-pharma': 'Quality Assurance Analysis',
  'biostatistician': 'Biostatistics Analysis',
  'cmc': 'Chemistry Manufacturing Analysis',
  'preclinical': 'Preclinical Analysis',

  // Retail
  'store-ops': 'Store Operations Analysis',
  'merchandising': 'Merchandising Analysis',
  'ecommerce': 'E-Commerce Analysis',
  'supply-chain-retail': 'Retail Supply Chain Analysis',
  'customer-insights': 'Customer Insights Analysis',
  'loss-prevention': 'Loss Prevention Analysis',
  'category-manager': 'Category Management Analysis',
  'visual-merchandiser': 'Visual Merchandising Analysis',
  'inventory-planner': 'Inventory Planning Analysis',
  'warehouse-manager': 'Warehouse Analysis',
  'merchandising-ai': 'Merchandising Analysis',
  'pricing-engine': 'Pricing Analysis',
  'customer-insight': 'Customer Analysis',
  'omnichannel-sync': 'Omnichannel Analysis',

  // Real Estate
  'development-manager': 'Development Analysis',
  'leasing-director': 'Leasing Analysis',
  'asset-manager-re': 'Asset Management Analysis',
  'market-research-re': 'Market Research Analysis',
  'construction-manager': 'Construction Analysis',
  'sustainability-re': 'Sustainability Analysis',
  'investment-analyst-re': 'Investment Analysis',
  'capital-markets-re': 'Capital Markets Analysis',
  'valuation-engine': 'Valuation Analysis',
  'lease-optimizer': 'Lease Analysis',
  'property-manager': 'Property Analysis',
  'investment-analyst': 'Investment Analysis',

  // Transportation
  'fleet-manager': 'Fleet Management Analysis',
  'logistics-planner': 'Logistics Analysis',
  'dispatch': 'Dispatch Analysis',
  'customs-broker': 'Customs Analysis',
  'last-mile': 'Last Mile Delivery Analysis',
  'freight-broker': 'Freight Analysis',
  'transportation-analyst': 'Transportation Analysis',
  'route-optimizer': 'Route Analysis',
  'warehouse-brain': 'Warehouse Analysis',
  'demand-predictor': 'Demand Analysis',
  'carrier-manager': 'Carrier Analysis',

  // Media
  'content-strategist': 'Content Strategy Analysis',
  'ad-sales': 'Advertising Sales Analysis',
  'audience-development': 'Audience Development Analysis',
  'programming': 'Programming Analysis',
  'rights-licensing': 'Rights & Licensing Analysis',
  'social-media-manager': 'Social Media Analysis',
  'subscription': 'Subscription Analysis',
  'analytics-media': 'Media Analytics Analysis',
  'media-content': 'Content Analysis',
  'media-streaming': 'Streaming Analysis',

  // Professional Services
  'partner': 'Partner Analysis',
  'engagement-manager': 'Engagement Management Analysis',
  'consultant': 'Consulting Analysis',
  'deal-advisory': 'Deal Advisory Analysis',
  'risk-advisory': 'Risk Advisory Analysis',
  'tax-advisor': 'Tax Advisory Analysis',
  'audit-partner': 'Audit Analysis',
  'technology-consulting': 'Technology Consulting Analysis',
  'hr-consulting': 'HR Consulting Analysis',
  'gm': 'General Management Analysis',

  // Education
  'provost': 'Academic Affairs Analysis',
  'department-chair': 'Department Analysis',
  'registrar': 'Registrar Analysis',
  'enrollment': 'Enrollment Analysis',
  'student-affairs': 'Student Affairs Analysis',
  'institutional-research': 'Institutional Research Analysis',
  'accreditation': 'Accreditation Analysis',
  'academic-tech': 'Academic Technology Analysis',
  'advancement': 'Advancement Analysis',
  'research-admin': 'Research Administration Analysis',
  'ai-ethics': 'AI Ethics Analysis',
  'student-success': 'Student Success Analysis',
  'learning-advisor': 'Learning Analysis',
  'enrollment-optimizer': 'Enrollment Analysis',
  'workforce-connector': 'Workforce Analysis',

  // Sports
  'scouting': 'Scouting Analysis',
  'sports-medicine': 'Sports Medicine Analysis',
  'analytics-sports': 'Sports Analytics Analysis',
  'salary-cap': 'Salary Cap Analysis',
  'player-development': 'Player Development Analysis',
  'sports-marketing': 'Sports Marketing Analysis',
  'ticket-ops': 'Ticket Operations Analysis',
  'compliance-sports': 'Sports Compliance Analysis',
  'sports-agent': 'Sports Agent Analysis',
  'brand-partnerships': 'Brand Partnerships Analysis',
  'acquisitions': 'Acquisitions Analysis',
  'sports-gm': 'General Management Analysis',
  'sports-analytics': 'Performance Analysis',
  'sports-coaching': 'Coaching Analysis',
  'sports-medical': 'Medical Analysis',
  'sports-business': 'Business Analysis',
  'sports-scouting': 'Scouting Analysis',
  'sports-fan-experience': 'Fan Experience Analysis',
  'sports-venue': 'Venue Analysis',
};

// =============================================================================
// COMBINED MAPPING
// =============================================================================
const ALL_AGENT_DISPLAY_NAMES: Record<string, string> = {
  ...FINANCIAL_AGENT_NAMES,
  ...CORE_AGENT_NAMES,
  ...LEGAL_AGENT_NAMES,
  ...HEALTHCARE_AGENT_NAMES,
  ...OTHER_AGENT_NAMES,
};

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get the regulatory-safe display name for an agent.
 * Falls back to a formatted version of the ID if not found.
 * 
 * @param agentId - The internal agent ID (e.g., 'risk-sentinel')
 * @returns The display name (e.g., 'Risk Analysis')
 */
export function getAgentDisplayName(agentId: string): string {
  if (ALL_AGENT_DISPLAY_NAMES[agentId]) {
    return ALL_AGENT_DISPLAY_NAMES[agentId];
  }
  
  // Fallback: convert kebab-case to Title Case + " Analysis"
  const formatted = agentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return `${formatted} Analysis`;
}

/**
 * Get the original agent name (for internal/debugging use only).
 * This should NOT be used in user-facing UI.
 */
export function getAgentInternalName(agentId: string): string {
  // This returns the original name format for internal use
  return agentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Check if an agent ID has a mapped display name.
 */
export function hasAgentDisplayName(agentId: string): boolean {
  return agentId in ALL_AGENT_DISPLAY_NAMES;
}

/**
 * Get all agent display names (for debugging/admin).
 */
export function getAllAgentDisplayNames(): Record<string, string> {
  return { ...ALL_AGENT_DISPLAY_NAMES };
}

// =============================================================================
// TERMINOLOGY MAPPING FOR UI ELEMENTS
// =============================================================================

/**
 * Regulatory-safe terminology for UI elements.
 * Use these instead of anthropomorphic terms.
 */
export const REGULATORY_SAFE_TERMS = {
  // Agent-related
  agent: 'Analysis Component',
  agents: 'Analysis Components',
  aiAgent: 'Analysis Module',
  aiAgents: 'Analysis Modules',
  
  // Deliberation-related
  deliberation: 'Verification Process',
  deliberate: 'Analyze',
  deliberating: 'Analyzing',
  deliberated: 'Analyzed',
  
  // Recommendation-related
  recommendation: 'Analysis Output',
  recommendations: 'Analysis Outputs',
  recommend: 'Support',
  recommends: 'Supports',
  recommended: 'Supported',
  
  // Consensus-related
  consensus: 'Summary',
  agreement: 'Alignment',
  disagree: 'Divergence',
  dissent: 'Dissent Record',
  
  // Decision-related
  decision: 'Determination',
  decide: 'Determine',
  decided: 'Determined',
  
  // Confidence-related
  confidence: 'Data Completeness',
  confidenceLevel: 'Input Completeness',
  
  // Council-related
  council: 'Analysis Panel',
  theCouncil: 'The Analysis Panel',
  councilSession: 'Analysis Session',
};

/**
 * Get regulatory-safe term for a given term.
 */
export function getRegulatorySafeTerm(term: keyof typeof REGULATORY_SAFE_TERMS): string {
  return REGULATORY_SAFE_TERMS[term] || term;
}

// =============================================================================
// CANONICAL DISCLAIMER
// =============================================================================

/**
 * The canonical disclaimer that must appear on all exported artifacts.
 */
export const CANONICAL_DISCLAIMER = 
  'All system outputs are non-binding analytical artifacts. ' +
  'Final determinations are made by designated human decision-makers ' +
  'in accordance with institutional governance.';

export default {
  getAgentDisplayName,
  getAgentInternalName,
  hasAgentDisplayName,
  getAllAgentDisplayNames,
  getRegulatorySafeTerm,
  REGULATORY_SAFE_TERMS,
  CANONICAL_DISCLAIMER,
};
