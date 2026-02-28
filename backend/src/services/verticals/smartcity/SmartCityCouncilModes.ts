// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA SMART CITY COUNCIL MODES
 * 
 * 28 specialized council deliberation modes for municipal governance
 * Organized by municipal function area
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SmartCityCouncilMode {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredAgents: string[];
  optionalAgents: string[];
  defaultPrompt: string;
  estimatedDuration: string;
  complianceFrameworks: string[];
}

// =============================================================================
// COUNCIL MODES (28)
// =============================================================================

export const SMART_CITY_COUNCIL_MODES: SmartCityCouncilMode[] = [
  // Budget & Finance (5)
  {
    id: 'budget-development',
    name: 'Annual Budget Development',
    description: 'Comprehensive budget preparation with department priorities and citizen input',
    category: 'Finance',
    requiredAgents: ['city-manager', 'finance-director'],
    optionalAgents: ['hr-director', 'public-works-director', 'community-engagement'],
    defaultPrompt: 'Develop budget recommendations balancing service delivery, fiscal sustainability, and citizen priorities.',
    estimatedDuration: '45-60 min',
    complianceFrameworks: ['GFOA Best Practices', 'State Budget Law'],
  },
  {
    id: 'capital-improvement-planning',
    name: 'Capital Improvement Program',
    description: 'Multi-year infrastructure investment planning',
    category: 'Finance',
    requiredAgents: ['finance-director', 'public-works-director', 'urban-planner'],
    optionalAgents: ['transportation-director', 'sustainability-officer'],
    defaultPrompt: 'Prioritize capital projects based on condition assessment, growth needs, and funding availability.',
    estimatedDuration: '30-45 min',
    complianceFrameworks: ['GFOA CIP Guidelines'],
  },
  {
    id: 'revenue-forecasting',
    name: 'Revenue Forecasting & Analysis',
    description: 'Multi-year revenue projections and economic analysis',
    category: 'Finance',
    requiredAgents: ['finance-director', 'economic-development'],
    optionalAgents: ['city-manager'],
    defaultPrompt: 'Project revenues considering economic trends, development pipeline, and policy changes.',
    estimatedDuration: '20-30 min',
    complianceFrameworks: ['GFOA Revenue Guidelines'],
  },
  {
    id: 'procurement-review',
    name: 'Major Procurement Review',
    description: 'Review of significant contracts and procurement decisions',
    category: 'Finance',
    requiredAgents: ['finance-director', 'city-attorney'],
    optionalAgents: ['cio', 'public-works-director'],
    defaultPrompt: 'Evaluate procurement for compliance, value, and risk.',
    estimatedDuration: '20-30 min',
    complianceFrameworks: ['State Procurement Law', 'Federal Grant Requirements'],
  },
  {
    id: 'grant-application',
    name: 'Grant Application Review',
    description: 'Evaluate grant opportunities and application strategies',
    category: 'Finance',
    requiredAgents: ['finance-director', 'city-manager'],
    optionalAgents: ['housing-director', 'transportation-director', 'sustainability-officer'],
    defaultPrompt: 'Assess grant alignment with city priorities, match requirements, and administrative capacity.',
    estimatedDuration: '15-25 min',
    complianceFrameworks: ['Federal Grant Compliance', '2 CFR 200'],
  },

  // Land Use & Development (5)
  {
    id: 'comprehensive-plan-update',
    name: 'Comprehensive Plan Update',
    description: 'Major update to city master plan and vision',
    category: 'Planning',
    requiredAgents: ['urban-planner', 'community-engagement', 'sustainability-officer'],
    optionalAgents: ['transportation-director', 'housing-director', 'economic-development'],
    defaultPrompt: 'Guide comprehensive plan update balancing growth, sustainability, and community vision.',
    estimatedDuration: '60-90 min',
    complianceFrameworks: ['State Planning Law'],
  },
  {
    id: 'development-review',
    name: 'Major Development Review',
    description: 'Review of significant development proposals',
    category: 'Planning',
    requiredAgents: ['urban-planner', 'public-works-director'],
    optionalAgents: ['transportation-director', 'sustainability-officer', 'community-engagement'],
    defaultPrompt: 'Evaluate development for code compliance, infrastructure capacity, and community impact.',
    estimatedDuration: '30-45 min',
    complianceFrameworks: ['Zoning Code', 'SEPA/NEPA'],
  },
  {
    id: 'zoning-amendment',
    name: 'Zoning Amendment Analysis',
    description: 'Analysis of proposed zoning code changes',
    category: 'Planning',
    requiredAgents: ['urban-planner', 'city-attorney'],
    optionalAgents: ['housing-director', 'economic-development'],
    defaultPrompt: 'Analyze zoning amendment for consistency with comprehensive plan and legal requirements.',
    estimatedDuration: '25-35 min',
    complianceFrameworks: ['State Zoning Law', 'Fair Housing'],
  },
  {
    id: 'affordable-housing-strategy',
    name: 'Affordable Housing Strategy',
    description: 'Policy development for housing affordability',
    category: 'Planning',
    requiredAgents: ['housing-director', 'urban-planner'],
    optionalAgents: ['finance-director', 'community-engagement', 'equity-guardian'],
    defaultPrompt: 'Develop housing strategies addressing affordability, displacement, and fair housing.',
    estimatedDuration: '40-55 min',
    complianceFrameworks: ['Fair Housing Act', 'HUD Requirements'],
  },
  {
    id: 'environmental-review',
    name: 'Environmental Impact Review',
    description: 'Environmental assessment of proposed projects',
    category: 'Planning',
    requiredAgents: ['urban-planner', 'sustainability-officer'],
    optionalAgents: ['public-works-director', 'equity-guardian'],
    defaultPrompt: 'Assess environmental impacts and mitigation measures for proposed action.',
    estimatedDuration: '30-45 min',
    complianceFrameworks: ['SEPA/NEPA', 'Clean Water Act'],
  },

  // Public Safety (4)
  {
    id: 'public-safety-policy',
    name: 'Public Safety Policy Review',
    description: 'Review of policing and public safety policies',
    category: 'Public Safety',
    requiredAgents: ['public-safety-chief', 'city-attorney', 'civil-rights-guardian'],
    optionalAgents: ['community-engagement', 'hr-director'],
    defaultPrompt: 'Evaluate public safety policies for effectiveness, constitutionality, and community trust.',
    estimatedDuration: '35-50 min',
    complianceFrameworks: ['Constitutional Law', 'State Law Enforcement Standards'],
  },
  {
    id: 'emergency-preparedness',
    name: 'Emergency Preparedness Planning',
    description: 'Disaster and emergency response planning',
    category: 'Public Safety',
    requiredAgents: ['public-safety-chief', 'public-works-director'],
    optionalAgents: ['cio', 'community-engagement', 'finance-director'],
    defaultPrompt: 'Develop emergency response capabilities and continuity of operations plans.',
    estimatedDuration: '40-55 min',
    complianceFrameworks: ['FEMA Standards', 'NIMS'],
  },
  {
    id: 'use-of-force-review',
    name: 'Use of Force Policy Review',
    description: 'Critical review of police use of force policies',
    category: 'Public Safety',
    requiredAgents: ['public-safety-chief', 'city-attorney', 'civil-rights-guardian'],
    optionalAgents: ['community-engagement'],
    defaultPrompt: 'Review use of force policy for constitutional compliance and best practices.',
    estimatedDuration: '45-60 min',
    complianceFrameworks: ['Constitutional Law', '8th & 14th Amendment'],
  },
  {
    id: 'community-policing',
    name: 'Community Policing Strategy',
    description: 'Development of community-oriented policing initiatives',
    category: 'Public Safety',
    requiredAgents: ['public-safety-chief', 'community-engagement'],
    optionalAgents: ['civil-rights-guardian', 'equity-guardian'],
    defaultPrompt: 'Develop community policing strategies that build trust and improve outcomes.',
    estimatedDuration: '30-40 min',
    complianceFrameworks: ['DOJ Community Policing Guidelines'],
  },

  // Infrastructure & Sustainability (5)
  {
    id: 'infrastructure-assessment',
    name: 'Infrastructure Condition Assessment',
    description: 'Comprehensive review of infrastructure condition and needs',
    category: 'Infrastructure',
    requiredAgents: ['public-works-director', 'finance-director'],
    optionalAgents: ['sustainability-officer', 'urban-planner'],
    defaultPrompt: 'Assess infrastructure condition and prioritize maintenance and replacement.',
    estimatedDuration: '35-50 min',
    complianceFrameworks: ['ASCE Infrastructure Guidelines'],
  },
  {
    id: 'climate-action-planning',
    name: 'Climate Action Plan Development',
    description: 'Comprehensive climate mitigation and adaptation planning',
    category: 'Sustainability',
    requiredAgents: ['sustainability-officer', 'urban-planner', 'equity-guardian'],
    optionalAgents: ['public-works-director', 'transportation-director', 'finance-director'],
    defaultPrompt: 'Develop climate action strategies with equity lens and measurable targets.',
    estimatedDuration: '50-70 min',
    complianceFrameworks: ['Paris Agreement', 'State Climate Law'],
  },
  {
    id: 'fleet-electrification',
    name: 'Fleet Electrification Strategy',
    description: 'Planning for electric vehicle transition',
    category: 'Sustainability',
    requiredAgents: ['sustainability-officer', 'public-works-director', 'finance-director'],
    optionalAgents: ['public-safety-chief', 'cio'],
    defaultPrompt: 'Develop fleet electrification roadmap with infrastructure and funding plan.',
    estimatedDuration: '25-35 min',
    complianceFrameworks: ['State EV Mandates'],
  },
  {
    id: 'water-system-planning',
    name: 'Water System Master Plan',
    description: 'Long-term water infrastructure and supply planning',
    category: 'Infrastructure',
    requiredAgents: ['public-works-director', 'urban-planner', 'sustainability-officer'],
    optionalAgents: ['finance-director', 'equity-guardian'],
    defaultPrompt: 'Plan water system improvements for reliability, quality, and climate resilience.',
    estimatedDuration: '40-55 min',
    complianceFrameworks: ['Safe Drinking Water Act', 'EPA Standards'],
  },
  {
    id: 'stormwater-management',
    name: 'Stormwater Management Review',
    description: 'Green infrastructure and stormwater planning',
    category: 'Infrastructure',
    requiredAgents: ['public-works-director', 'sustainability-officer'],
    optionalAgents: ['urban-planner', 'equity-guardian'],
    defaultPrompt: 'Develop stormwater strategies prioritizing green infrastructure and equity.',
    estimatedDuration: '30-40 min',
    complianceFrameworks: ['Clean Water Act', 'MS4 Permit'],
  },

  // Transportation & Mobility (4)
  {
    id: 'transportation-master-plan',
    name: 'Transportation Master Plan',
    description: 'Comprehensive multimodal transportation planning',
    category: 'Transportation',
    requiredAgents: ['transportation-director', 'urban-planner', 'sustainability-officer'],
    optionalAgents: ['equity-guardian', 'community-engagement'],
    defaultPrompt: 'Develop multimodal transportation vision with safety, equity, and climate goals.',
    estimatedDuration: '50-65 min',
    complianceFrameworks: ['Federal Transportation Law', 'ADA'],
  },
  {
    id: 'transit-service-planning',
    name: 'Transit Service Analysis',
    description: 'Public transit service optimization',
    category: 'Transportation',
    requiredAgents: ['transportation-director', 'equity-guardian'],
    optionalAgents: ['finance-director', 'community-engagement'],
    defaultPrompt: 'Analyze transit service for coverage, frequency, and equity.',
    estimatedDuration: '30-40 min',
    complianceFrameworks: ['Title VI', 'ADA'],
  },
  {
    id: 'vision-zero',
    name: 'Vision Zero Strategy',
    description: 'Traffic safety and fatality elimination planning',
    category: 'Transportation',
    requiredAgents: ['transportation-director', 'public-safety-chief'],
    optionalAgents: ['urban-planner', 'equity-guardian'],
    defaultPrompt: 'Develop Vision Zero action plan with equity focus and measurable targets.',
    estimatedDuration: '35-45 min',
    complianceFrameworks: ['Federal Safety Standards'],
  },
  {
    id: 'parking-policy',
    name: 'Parking Policy Review',
    description: 'Parking management and pricing strategy',
    category: 'Transportation',
    requiredAgents: ['transportation-director', 'economic-development'],
    optionalAgents: ['urban-planner', 'sustainability-officer'],
    defaultPrompt: 'Evaluate parking policies for economic impact and mode shift goals.',
    estimatedDuration: '20-30 min',
    complianceFrameworks: ['ADA Parking Requirements'],
  },

  // Technology & Digital Services (3)
  {
    id: 'smart-city-strategy',
    name: 'Smart City Technology Strategy',
    description: 'Digital transformation and smart city planning',
    category: 'Technology',
    requiredAgents: ['cio', 'city-manager'],
    optionalAgents: ['public-works-director', 'transportation-director', 'civil-rights-guardian'],
    defaultPrompt: 'Develop smart city roadmap balancing innovation with privacy and equity.',
    estimatedDuration: '40-55 min',
    complianceFrameworks: ['Privacy Laws', 'Accessibility Standards'],
  },
  {
    id: 'cybersecurity-review',
    name: 'Cybersecurity Assessment',
    description: 'Municipal cybersecurity posture review',
    category: 'Technology',
    requiredAgents: ['cio', 'city-attorney'],
    optionalAgents: ['finance-director', 'public-safety-chief'],
    defaultPrompt: 'Assess cybersecurity risks and develop mitigation strategies.',
    estimatedDuration: '30-40 min',
    complianceFrameworks: ['NIST Cybersecurity Framework', 'State Data Breach Law'],
  },
  {
    id: 'digital-equity',
    name: 'Digital Equity Planning',
    description: 'Broadband access and digital inclusion',
    category: 'Technology',
    requiredAgents: ['cio', 'community-engagement', 'equity-guardian'],
    optionalAgents: ['economic-development', 'housing-director'],
    defaultPrompt: 'Develop digital equity strategy addressing access, affordability, and skills.',
    estimatedDuration: '35-45 min',
    complianceFrameworks: ['Digital Equity Act', 'ADA'],
  },

  // Governance & Transparency (2)
  {
    id: 'policy-ordinance-review',
    name: 'Policy & Ordinance Review',
    description: 'Legal review of proposed municipal policies',
    category: 'Governance',
    requiredAgents: ['city-attorney', 'city-manager', 'transparency-guardian'],
    optionalAgents: ['civil-rights-guardian'],
    defaultPrompt: 'Review policy for legal compliance, constitutional issues, and open government.',
    estimatedDuration: '25-35 min',
    complianceFrameworks: ['State Law', 'Open Meetings Law'],
  },
  {
    id: 'public-engagement-strategy',
    name: 'Public Engagement Strategy',
    description: 'Community engagement and participation planning',
    category: 'Governance',
    requiredAgents: ['community-engagement', 'equity-guardian'],
    optionalAgents: ['cio', 'transparency-guardian'],
    defaultPrompt: 'Design inclusive engagement strategies reaching all community members.',
    estimatedDuration: '30-40 min',
    complianceFrameworks: ['ADA', 'Language Access Laws'],
  },
];

// Council mode lookup helpers
export const getSmartCityCouncilMode = (id: string): SmartCityCouncilMode | undefined =>
  SMART_CITY_COUNCIL_MODES.find(m => m.id === id);

export const getSmartCityCouncilModesByCategory = (category: string): SmartCityCouncilMode[] =>
  SMART_CITY_COUNCIL_MODES.filter(m => m.category === category);

export const getSmartCityCouncilModeCategories = (): string[] =>
  [...new Set(SMART_CITY_COUNCIL_MODES.map(m => m.category))];
