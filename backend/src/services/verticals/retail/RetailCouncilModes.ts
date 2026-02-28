// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA RETAIL COUNCIL MODES
 *
 * Specialized deliberation modes for the Retail Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Standards: FTC Guidelines, Consumer Protection, CCPA/GDPR, Advertising Standards
 */

export type RetailModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'pricing'         // Pricing decisions
  | 'merchandising'   // Category and assortment
  | 'operations'      // Store and digital operations
  | 'customer'        // Customer experience
  | 'specialized';    // Specialized retail modes

export interface RetailCouncilMode {
  id: string;
  name: string;
  category: RetailModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  standards: string[];
  ethicsGate: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_RETAIL_MODES: RetailCouncilMode[] = [
  {
    id: 'pricing-strategy-council',
    name: 'Pricing Strategy Council',
    category: 'major',
    purpose: 'Major pricing decisions with ethical review. Dynamic pricing, promotional strategy, competitive response.',
    leadAgent: 'pricing-analyst',
    whenToUse: 'Major pricing changes, dynamic pricing rules, promotional strategy, crisis pricing',
    defaultAgents: ['pricing-analyst', 'merchandising-director', 'compliance-manager', 'marketing-director'],
    optionalAgents: ['customer-experience-manager', 'sustainability-manager'],
    maxDeliberationRounds: 8,
    standards: ['FTC Pricing Guidelines', 'State Consumer Protection', 'Advertising Standards'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Optimize pricing fairly. Never exploit customers. Document rationale.',
    toneKeywords: ['fair', 'competitive', 'transparent', 'documented'],
    outputFormat: ['pricing_strategy', 'ethics_review', 'competitive_analysis', 'implementation_plan'],
  },
  {
    id: 'assortment-review-council',
    name: 'Assortment Review Council',
    category: 'major',
    purpose: 'Category assortment decisions. New product introductions, discontinuations, vendor negotiations.',
    leadAgent: 'merchandising-director',
    whenToUse: 'Seasonal assortment planning, category reviews, new vendor decisions',
    defaultAgents: ['merchandising-director', 'supply-chain-director', 'pricing-analyst', 'ecommerce-manager'],
    optionalAgents: ['private-label-manager', 'sustainability-manager'],
    maxDeliberationRounds: 8,
    standards: ['Category Management', 'Vendor Partnerships'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Curate for customers. Balance variety and efficiency. Build vendor partnerships.',
    toneKeywords: ['customer-focused', 'efficient', 'strategic', 'balanced'],
    outputFormat: ['assortment_plan', 'vendor_scorecard', 'financial_impact', 'implementation_timeline'],
  },
  {
    id: 'customer-crisis-council',
    name: 'Customer Crisis Council',
    category: 'major',
    purpose: 'Customer-impacting crises. Product recalls, service failures, data breaches, PR issues.',
    leadAgent: 'customer-experience-manager',
    whenToUse: 'Product recalls, service outages, data incidents, viral complaints, PR crises',
    defaultAgents: ['customer-experience-manager', 'compliance-manager', 'marketing-director', 'store-operations-manager'],
    optionalAgents: ['ecommerce-manager', 'loss-prevention-director'],
    maxDeliberationRounds: 6,
    standards: ['Crisis Management', 'Consumer Protection', 'Privacy Regulations'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Protect customers first. Communicate transparently. Make it right.',
    toneKeywords: ['customer-first', 'transparent', 'responsive', 'accountable'],
    outputFormat: ['crisis_assessment', 'customer_communication', 'remediation_plan', 'lessons_learned'],
  },
  {
    id: 'omnichannel-strategy-council',
    name: 'Omnichannel Strategy Council',
    category: 'major',
    purpose: 'Omnichannel experience decisions. Channel integration, fulfillment options, customer journey.',
    leadAgent: 'ecommerce-manager',
    whenToUse: 'New fulfillment options, channel integration, customer journey redesign',
    defaultAgents: ['ecommerce-manager', 'store-operations-manager', 'supply-chain-director', 'customer-experience-manager'],
    optionalAgents: ['marketing-director', 'personalization-specialist'],
    maxDeliberationRounds: 8,
    standards: ['Omnichannel Best Practices', 'Customer Experience'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Seamless customer experience across all channels.',
    toneKeywords: ['seamless', 'integrated', 'customer-centric', 'efficient'],
    outputFormat: ['channel_strategy', 'integration_plan', 'customer_journey_map', 'kpi_targets'],
  },
];

// =============================================================================
// PRICING MODES
// =============================================================================

export const PRICING_MODES: RetailCouncilMode[] = [
  {
    id: 'dynamic-pricing-review',
    name: 'Dynamic Pricing Review',
    category: 'pricing',
    purpose: 'Dynamic pricing algorithm review and guardrails. Demand-based pricing with ethical constraints.',
    leadAgent: 'pricing-analyst',
    whenToUse: 'Dynamic pricing implementation, algorithm tuning, guardrail setting',
    defaultAgents: ['pricing-analyst', 'compliance-manager', 'customer-experience-manager'],
    optionalAgents: ['merchandising-director'],
    maxDeliberationRounds: 6,
    standards: ['FTC Guidelines', 'State Price Gouging Laws', 'Ethical Pricing'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Optimize dynamically within ethical bounds. Never exploit urgency or vulnerability.',
    toneKeywords: ['ethical', 'bounded', 'transparent', 'fair'],
    outputFormat: ['algorithm_review', 'guardrail_settings', 'ethics_assessment', 'monitoring_plan'],
  },
  {
    id: 'promotional-effectiveness-council',
    name: 'Promotional Effectiveness Council',
    category: 'pricing',
    purpose: 'Promotion planning and effectiveness review. ROI analysis, cannibalization, customer value.',
    leadAgent: 'marketing-director',
    whenToUse: 'Promotional planning, post-promotion analysis, promotional strategy',
    defaultAgents: ['marketing-director', 'pricing-analyst', 'merchandising-director'],
    optionalAgents: ['customer-experience-manager', 'personalization-specialist'],
    maxDeliberationRounds: 5,
    standards: ['Promotional Best Practices', 'Advertising Standards'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Promote for customer value. Measure true incrementality. Avoid deception.',
    toneKeywords: ['effective', 'incremental', 'honest', 'value-driven'],
    outputFormat: ['promotion_plan', 'roi_analysis', 'cannibalization_assessment', 'customer_impact'],
  },
  {
    id: 'competitive-response-council',
    name: 'Competitive Response Council',
    category: 'pricing',
    purpose: 'Competitive pricing response decisions. Price matching, competitive positioning, market share.',
    leadAgent: 'pricing-analyst',
    whenToUse: 'Competitor price changes, market share concerns, price wars',
    defaultAgents: ['pricing-analyst', 'merchandising-director', 'marketing-director'],
    optionalAgents: ['ecommerce-manager', 'store-operations-manager'],
    maxDeliberationRounds: 5,
    standards: ['Competitive Intelligence', 'Antitrust'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Compete on value, not just price. Avoid race to bottom.',
    toneKeywords: ['strategic', 'value-focused', 'sustainable', 'differentiated'],
    outputFormat: ['competitive_analysis', 'response_strategy', 'value_proposition', 'financial_impact'],
  },
];

// =============================================================================
// MERCHANDISING MODES
// =============================================================================

export const MERCHANDISING_MODES: RetailCouncilMode[] = [
  {
    id: 'category-performance-review',
    name: 'Category Performance Review',
    category: 'merchandising',
    purpose: 'Category performance analysis and optimization. Space allocation, vendor mix, trend response.',
    leadAgent: 'merchandising-director',
    whenToUse: 'Quarterly category reviews, performance issues, trend shifts',
    defaultAgents: ['merchandising-director', 'pricing-analyst', 'supply-chain-director'],
    optionalAgents: ['private-label-manager', 'store-operations-manager'],
    maxDeliberationRounds: 6,
    standards: ['Category Management', 'Space Optimization'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Optimize categories for customer needs and business performance.',
    toneKeywords: ['optimized', 'customer-driven', 'profitable', 'trendy'],
    outputFormat: ['category_scorecard', 'optimization_actions', 'vendor_recommendations', 'space_allocation'],
  },
  {
    id: 'vendor-negotiation-council',
    name: 'Vendor Negotiation Council',
    category: 'merchandising',
    purpose: 'Strategic vendor negotiations. Terms, exclusives, joint business planning.',
    leadAgent: 'merchandising-director',
    whenToUse: 'Contract renewals, new vendor negotiations, JBP sessions',
    defaultAgents: ['merchandising-director', 'supply-chain-director', 'pricing-analyst'],
    optionalAgents: ['compliance-manager', 'sustainability-manager'],
    maxDeliberationRounds: 6,
    standards: ['Vendor Partnership', 'Ethical Sourcing'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Build partnerships that benefit customers, vendors, and our business.',
    toneKeywords: ['partnership', 'fair', 'strategic', 'sustainable'],
    outputFormat: ['negotiation_strategy', 'term_sheet', 'jbp_framework', 'partnership_scorecard'],
  },
];

// =============================================================================
// OPERATIONS MODES
// =============================================================================

export const OPERATIONS_RETAIL_MODES: RetailCouncilMode[] = [
  {
    id: 'store-performance-council',
    name: 'Store Performance Council',
    category: 'operations',
    purpose: 'Store performance review and improvement. Underperformers, format optimization, closures.',
    leadAgent: 'store-operations-manager',
    whenToUse: 'Store reviews, performance issues, format decisions, closure analysis',
    defaultAgents: ['store-operations-manager', 'real-estate-manager', 'workforce-analyst'],
    optionalAgents: ['merchandising-director', 'loss-prevention-director'],
    maxDeliberationRounds: 6,
    standards: ['Store Operations', 'Labor Compliance'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Optimize store performance while treating communities and associates fairly.',
    toneKeywords: ['performance-driven', 'fair', 'community-aware', 'efficient'],
    outputFormat: ['performance_review', 'improvement_plan', 'format_recommendation', 'community_impact'],
  },
  {
    id: 'fulfillment-optimization-council',
    name: 'Fulfillment Optimization Council',
    category: 'operations',
    purpose: 'Fulfillment strategy and optimization. Ship-from-store, BOPIS, delivery options.',
    leadAgent: 'supply-chain-director',
    whenToUse: 'Fulfillment strategy, capacity planning, new options, cost optimization',
    defaultAgents: ['supply-chain-director', 'ecommerce-manager', 'store-operations-manager'],
    optionalAgents: ['customer-experience-manager', 'workforce-analyst'],
    maxDeliberationRounds: 6,
    standards: ['Fulfillment Best Practices', 'Customer Promise'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Fulfill customer promises efficiently and profitably.',
    toneKeywords: ['efficient', 'reliable', 'cost-effective', 'customer-focused'],
    outputFormat: ['fulfillment_strategy', 'capacity_plan', 'cost_analysis', 'service_levels'],
  },
];

// =============================================================================
// CUSTOMER MODES
// =============================================================================

export const CUSTOMER_MODES: RetailCouncilMode[] = [
  {
    id: 'loyalty-program-council',
    name: 'Loyalty Program Council',
    category: 'customer',
    purpose: 'Loyalty program strategy and optimization. Rewards, tiers, personalization, partner integrations.',
    leadAgent: 'marketing-director',
    whenToUse: 'Loyalty program design, reward changes, partner additions, program performance',
    defaultAgents: ['marketing-director', 'customer-experience-manager', 'pricing-analyst'],
    optionalAgents: ['personalization-specialist', 'compliance-manager'],
    maxDeliberationRounds: 6,
    standards: ['Loyalty Best Practices', 'Privacy Regulations'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Build loyalty through genuine value, not manipulation.',
    toneKeywords: ['valuable', 'transparent', 'personalized', 'genuine'],
    outputFormat: ['program_strategy', 'reward_structure', 'personalization_plan', 'privacy_compliance'],
  },
  {
    id: 'customer-feedback-council',
    name: 'Customer Feedback Council',
    category: 'customer',
    purpose: 'Customer feedback analysis and action planning. NPS, reviews, complaints, insights.',
    leadAgent: 'customer-experience-manager',
    whenToUse: 'Feedback reviews, NPS analysis, complaint trends, improvement planning',
    defaultAgents: ['customer-experience-manager', 'store-operations-manager', 'ecommerce-manager'],
    optionalAgents: ['marketing-director', 'compliance-manager'],
    maxDeliberationRounds: 5,
    standards: ['Customer Experience', 'Voice of Customer'],
    ethicsGate: false,
    auditTrailRequired: true,
    primeDirective: 'Listen to customers. Act on insights. Close the loop.',
    toneKeywords: ['listening', 'responsive', 'actionable', 'improving'],
    outputFormat: ['feedback_analysis', 'insight_summary', 'action_plan', 'response_strategy'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_RETAIL_MODES: RetailCouncilMode[] = [
  {
    id: 'ethical-sourcing-council',
    name: 'Ethical Sourcing Council',
    category: 'specialized',
    purpose: 'Ethical and sustainable sourcing decisions. Supply chain transparency, labor practices.',
    leadAgent: 'sustainability-manager',
    whenToUse: 'New supplier evaluation, ethical concerns, sustainability initiatives',
    defaultAgents: ['sustainability-manager', 'merchandising-director', 'compliance-manager'],
    optionalAgents: ['supply-chain-director', 'private-label-manager'],
    maxDeliberationRounds: 8,
    standards: ['Ethical Sourcing', 'Labor Standards', 'Environmental Standards'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Source responsibly. Transparency over convenience. Respect all workers.',
    toneKeywords: ['ethical', 'transparent', 'responsible', 'sustainable'],
    outputFormat: ['sourcing_assessment', 'supplier_audit', 'risk_analysis', 'improvement_requirements'],
  },
  {
    id: 'personalization-ethics-council',
    name: 'Personalization Ethics Council',
    category: 'specialized',
    purpose: 'Personalization strategy with privacy and ethics review. Data use, targeting, consent.',
    leadAgent: 'personalization-specialist',
    whenToUse: 'New personalization features, data use decisions, targeting strategies',
    defaultAgents: ['personalization-specialist', 'compliance-manager', 'customer-experience-manager'],
    optionalAgents: ['marketing-director', 'ecommerce-manager'],
    maxDeliberationRounds: 6,
    standards: ['CCPA', 'GDPR', 'Privacy Best Practices', 'Ethical AI'],
    ethicsGate: true,
    auditTrailRequired: true,
    primeDirective: 'Personalize helpfully. Respect privacy. Never manipulate.',
    toneKeywords: ['helpful', 'private', 'consensual', 'transparent'],
    outputFormat: ['personalization_strategy', 'privacy_review', 'consent_framework', 'ethics_assessment'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_RETAIL_MODES: RetailCouncilMode[] = [
  ...MAJOR_RETAIL_MODES,
  ...PRICING_MODES,
  ...MERCHANDISING_MODES,
  ...OPERATIONS_RETAIL_MODES,
  ...CUSTOMER_MODES,
  ...SPECIALIZED_RETAIL_MODES,
];

export const RETAIL_MODE_MAP: Map<string, RetailCouncilMode> = new Map(
  ALL_RETAIL_MODES.map(mode => [mode.id, mode])
);

export function getRetailMode(modeId: string): RetailCouncilMode | undefined {
  return RETAIL_MODE_MAP.get(modeId);
}

export function getRetailModesByCategory(category: RetailModeCategory): RetailCouncilMode[] {
  return ALL_RETAIL_MODES.filter(mode => mode.category === category);
}

export const RETAIL_MODE_STATS = {
  total: ALL_RETAIL_MODES.length,
  byCategory: {
    major: MAJOR_RETAIL_MODES.length,
    pricing: PRICING_MODES.length,
    merchandising: MERCHANDISING_MODES.length,
    operations: OPERATIONS_RETAIL_MODES.length,
    customer: CUSTOMER_MODES.length,
    specialized: SPECIALIZED_RETAIL_MODES.length,
  },
};
