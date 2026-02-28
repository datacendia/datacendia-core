// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
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
  'cfo': 'Financial Analysis',
  'coo': 'Operations Analysis',
  'ciso': 'Security Analysis',
  'cto': 'Technology Analysis',
  'cmo': 'Marketing Analysis',
  'chro': 'Human Resources Analysis',
  'clo': 'Legal Analysis',
  'cro': 'Risk Analysis',
  
  // Adversarial/Red Team
  'adversarial-reviewer': 'Stress Test Analysis',
  'red-team': 'Adversarial Analysis',
  'devils-advocate': 'Challenge Analysis',
  
  // General roles
  'risk-manager': 'Risk Analysis',
  'legal-counsel': 'Legal Analysis',
  'strategy': 'Strategy Analysis',
  'operations': 'Operations Analysis',
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
  'care-coordinator': 'Care Coordination Analysis',
  'clinical-advisor': 'Clinical Analysis',
  'capacity-oracle': 'Capacity Analysis',
  'quality-sentinel': 'Quality Analysis',
};

// =============================================================================
// OTHER VERTICAL AGENTS
// =============================================================================
const OTHER_AGENT_NAMES: Record<string, string> = {
  // Manufacturing
  'production-master': 'Production Analysis',
  'predict-maintain': 'Maintenance Analysis',
  'quality-vision': 'Quality Analysis',
  'supply-sync': 'Supply Chain Analysis',
  
  // Technology
  'site-reliability': 'Reliability Analysis',
  'security-fortress': 'Security Analysis',
  'dev-velocity': 'Engineering Analysis',
  'data-architect': 'Data Analysis',
  
  // Energy
  'grid-balancer': 'Grid Analysis',
  'renewable-optimizer': 'Renewable Analysis',
  'asset-guardian': 'Asset Analysis',
  'demand-response': 'Demand Analysis',
  
  // Government
  'policy-advisor': 'Policy Analysis',
  'citizen-engagement': 'Citizen Services Analysis',
  'budget-optimizer': 'Budget Analysis',
  'transparency-engine': 'Transparency Analysis',
  'infrastructure-planner': 'Infrastructure Analysis',
  
  // Logistics
  'route-optimizer': 'Route Analysis',
  'warehouse-brain': 'Warehouse Analysis',
  'demand-predictor': 'Demand Analysis',
  'carrier-manager': 'Carrier Analysis',
  
  // Retail
  'merchandising-ai': 'Merchandising Analysis',
  'pricing-engine': 'Pricing Analysis',
  'customer-insight': 'Customer Analysis',
  'omnichannel-sync': 'Omnichannel Analysis',
  
  // Education
  'student-success': 'Student Success Analysis',
  'learning-advisor': 'Learning Analysis',
  'enrollment-optimizer': 'Enrollment Analysis',
  'workforce-connector': 'Workforce Analysis',
  
  // Real Estate
  'valuation-engine': 'Valuation Analysis',
  'lease-optimizer': 'Lease Analysis',
  'property-manager': 'Property Analysis',
  'investment-analyst': 'Investment Analysis',
  
  // Insurance
  'underwriting-ai': 'Underwriting Analysis',
  'claims-processor': 'Claims Analysis',
  'actuarial-engine': 'Actuarial Analysis',
  'insurance-policy-advisor': 'Insurance Policy Analysis',
  
  // Sports
  'sports-gm': 'General Management Analysis',
  'sports-analytics': 'Performance Analysis',
  'sports-coaching': 'Coaching Analysis',
  'sports-medical': 'Medical Analysis',
  'sports-business': 'Business Analysis',
  'sports-scouting': 'Scouting Analysis',
  'sports-fan-experience': 'Fan Experience Analysis',
  'sports-venue': 'Venue Analysis',
  
  // Media
  'media-content': 'Content Analysis',
  'media-streaming': 'Streaming Analysis',
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
