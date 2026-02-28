// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA HORIZON SIMULATION MODES - What-If Scenario Perspectives
// Different lenses for simulating future decision outcomes
// Includes industry-aware probability and confidence calculations
// =============================================================================

// Industry benchmark data for probability/confidence calculations
export interface IndustryBenchmarks {
  id: string;
  name: string;
  // Probability adjustments
  churnRateBase: number; // Annual churn rate baseline (0-1)
  growthVolatility: number; // How much growth varies (0-1)
  regulatoryRisk: number; // Regulatory change probability (0-1)
  competitiveIntensity: number; // Market competition level (0-1)
  // Confidence adjustments
  dataReliability: number; // How reliable industry data is (0-1)
  forecastAccuracy: number; // Historical forecast accuracy (0-1)
  cyclicality: number; // Business cycle sensitivity (0-1)
  // Time horizon factors
  typicalPlanningHorizon: number; // Years
  disruptionFrequency: number; // Major disruptions per decade
}

export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmarks> = {
  'saas': {
    id: 'saas',
    name: 'SaaS / Software',
    churnRateBase: 0.05,
    growthVolatility: 0.25,
    regulatoryRisk: 0.15,
    competitiveIntensity: 0.8,
    dataReliability: 0.85,
    forecastAccuracy: 0.7,
    cyclicality: 0.3,
    typicalPlanningHorizon: 3,
    disruptionFrequency: 2,
  },
  'fintech': {
    id: 'fintech',
    name: 'FinTech / Financial Services',
    churnRateBase: 0.08,
    growthVolatility: 0.3,
    regulatoryRisk: 0.6,
    competitiveIntensity: 0.7,
    dataReliability: 0.9,
    forecastAccuracy: 0.65,
    cyclicality: 0.6,
    typicalPlanningHorizon: 5,
    disruptionFrequency: 1.5,
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare / Life Sciences',
    churnRateBase: 0.03,
    growthVolatility: 0.15,
    regulatoryRisk: 0.7,
    competitiveIntensity: 0.5,
    dataReliability: 0.8,
    forecastAccuracy: 0.6,
    cyclicality: 0.2,
    typicalPlanningHorizon: 7,
    disruptionFrequency: 1,
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-Commerce / Retail',
    churnRateBase: 0.15,
    growthVolatility: 0.4,
    regulatoryRisk: 0.2,
    competitiveIntensity: 0.9,
    dataReliability: 0.75,
    forecastAccuracy: 0.55,
    cyclicality: 0.7,
    typicalPlanningHorizon: 2,
    disruptionFrequency: 3,
  },
  'manufacturing': {
    id: 'manufacturing',
    name: 'Manufacturing / Industrial',
    churnRateBase: 0.04,
    growthVolatility: 0.2,
    regulatoryRisk: 0.4,
    competitiveIntensity: 0.6,
    dataReliability: 0.85,
    forecastAccuracy: 0.7,
    cyclicality: 0.8,
    typicalPlanningHorizon: 5,
    disruptionFrequency: 1,
  },
  'energy': {
    id: 'energy',
    name: 'Energy / Utilities',
    churnRateBase: 0.02,
    growthVolatility: 0.15,
    regulatoryRisk: 0.65,
    competitiveIntensity: 0.4,
    dataReliability: 0.9,
    forecastAccuracy: 0.75,
    cyclicality: 0.5,
    typicalPlanningHorizon: 10,
    disruptionFrequency: 0.5,
  },
  'media': {
    id: 'media',
    name: 'Media / Entertainment',
    churnRateBase: 0.12,
    growthVolatility: 0.35,
    regulatoryRisk: 0.25,
    competitiveIntensity: 0.85,
    dataReliability: 0.7,
    forecastAccuracy: 0.5,
    cyclicality: 0.4,
    typicalPlanningHorizon: 2,
    disruptionFrequency: 3,
  },
  'professional-services': {
    id: 'professional-services',
    name: 'Professional Services',
    churnRateBase: 0.1,
    growthVolatility: 0.2,
    regulatoryRisk: 0.35,
    competitiveIntensity: 0.7,
    dataReliability: 0.75,
    forecastAccuracy: 0.65,
    cyclicality: 0.5,
    typicalPlanningHorizon: 3,
    disruptionFrequency: 1.5,
  },
  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate / Construction',
    churnRateBase: 0.06,
    growthVolatility: 0.3,
    regulatoryRisk: 0.45,
    competitiveIntensity: 0.6,
    dataReliability: 0.8,
    forecastAccuracy: 0.55,
    cyclicality: 0.85,
    typicalPlanningHorizon: 7,
    disruptionFrequency: 1,
  },
  'logistics': {
    id: 'logistics',
    name: 'Logistics / Supply Chain',
    churnRateBase: 0.07,
    growthVolatility: 0.25,
    regulatoryRisk: 0.35,
    competitiveIntensity: 0.75,
    dataReliability: 0.8,
    forecastAccuracy: 0.6,
    cyclicality: 0.6,
    typicalPlanningHorizon: 3,
    disruptionFrequency: 2,
  },
  'general': {
    id: 'general',
    name: 'General / Cross-Industry',
    churnRateBase: 0.08,
    growthVolatility: 0.25,
    regulatoryRisk: 0.35,
    competitiveIntensity: 0.65,
    dataReliability: 0.75,
    forecastAccuracy: 0.6,
    cyclicality: 0.5,
    typicalPlanningHorizon: 3,
    disruptionFrequency: 1.5,
  },
};

export interface HorizonMode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  primeDirective: string;
  description: string;
  shortDesc: string;
  useCases: string[];
  // Simulation parameters
  biasProfile: 'optimistic' | 'pessimistic' | 'balanced' | 'contrarian';
  confidenceAdjustment: number; // -0.3 to +0.3 adjustment to base confidence
  timeHorizonWeight: 'near' | 'balanced' | 'far';
  riskWeighting: number; // 0.5-2.0 multiplier on risk factors
  opportunityWeighting: number; // 0.5-2.0 multiplier on opportunity factors
  defaultUniverseCount: number; // How many parallel scenarios to simulate
  // Industry probability modifiers
  industryModifiers: {
    churnMultiplier: number;
    growthMultiplier: number;
    riskMultiplier: number;
    confidenceMultiplier: number;
  };
  isCore?: boolean;
  fieldTooltips: {
    question: string;
    context: string;
    constraints: string;
    timeHorizon: string;
    industry: string;
  };
  placeholders: {
    question: string;
    context: string;
    constraints: string;
  };
}

export const HORIZON_MODE_CATEGORIES = {
  'Strategic Planning': ['balanced', 'board-ready', 'long-range'],
  'Risk Assessment': ['pessimistic', 'black-swan', 'stress-test'],
  'Opportunity': ['optimistic', 'moonshot', 'growth'],
  'Competitive': ['contrarian', 'disruptor', 'defensive'],
} as const;

export const CORE_HORIZON_MODES = [
  'balanced',
  'optimistic',
  'pessimistic',
  'board-ready',
  'stress-test',
] as const;

export const HORIZON_MODES: Record<string, HorizonMode> = {
  'balanced': {
    id: 'balanced',
    name: 'Balanced Analysis',
    emoji: '⚖️',
    color: '#3B82F6',
    primeDirective: 'See All Futures Equally',
    description: 'Neutral simulation weighing risks and opportunities equally. Uses industry benchmarks for realistic probability estimates.',
    shortDesc: 'Neutral what-if analysis',
    useCases: ['Strategic planning', 'Board presentations', 'Investment decisions', 'Annual planning'],
    biasProfile: 'balanced',
    confidenceAdjustment: 0,
    timeHorizonWeight: 'balanced',
    riskWeighting: 1.0,
    opportunityWeighting: 1.0,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 1.0, growthMultiplier: 1.0, riskMultiplier: 1.0, confidenceMultiplier: 1.0 },
    isCore: true,
    fieldTooltips: {
      question: 'Frame your strategic question clearly. What decision are you trying to make? What outcomes matter?',
      context: 'Provide relevant background: market conditions, competitive landscape, internal capabilities, recent changes.',
      constraints: 'Define boundaries: budget limits, timeline requirements, regulatory constraints, strategic non-negotiables.',
      timeHorizon: 'Select how far into the future to simulate. Industry benchmarks will adjust confidence accordingly.',
      industry: 'Select your industry to apply relevant probability benchmarks (churn rates, growth volatility, regulatory risk).',
    },
    placeholders: {
      question: 'e.g., Should we expand into the European market in 2025?',
      context: 'e.g., We have $10M budget, 2 competitors already there, no local team yet...',
      constraints: 'e.g., Must achieve profitability within 18 months, cannot exceed $15M total investment',
    },
  },

  'optimistic': {
    id: 'optimistic',
    name: 'Optimistic Scenario',
    emoji: '🌟',
    color: '#10B981',
    primeDirective: 'Find the Upside',
    description: 'Emphasizes opportunities and best-case outcomes. Applies upper-quartile industry benchmarks for growth projections.',
    shortDesc: 'Best-case futures',
    useCases: ['Fundraising prep', 'Team motivation', 'Opportunity sizing', 'Growth planning'],
    biasProfile: 'optimistic',
    confidenceAdjustment: 0.15,
    timeHorizonWeight: 'far',
    riskWeighting: 0.7,
    opportunityWeighting: 1.4,
    defaultUniverseCount: 4,
    industryModifiers: { churnMultiplier: 0.7, growthMultiplier: 1.3, riskMultiplier: 0.6, confidenceMultiplier: 1.1 },
    isCore: true,
    fieldTooltips: {
      question: 'What opportunity are you exploring? Frame the question to surface maximum upside potential.',
      context: 'Highlight tailwinds: market trends, competitive advantages, team strengths, timing factors working in your favor.',
      constraints: 'Define minimum acceptable outcomes. What does "success" look like? What would exceed expectations?',
      timeHorizon: 'Optimistic scenarios often play out over longer timeframes. Industry growth rates will be upper-quartile.',
      industry: 'Industry benchmarks will use top-performer metrics (lower churn, higher growth, reduced risk factors).',
    },
    placeholders: {
      question: 'e.g., What if our new product captures 20% market share?',
      context: 'e.g., Strong product-market fit signals, competitor weakness, favorable regulatory changes...',
      constraints: 'e.g., Success = $50M ARR in 3 years, exceeds expectations = $100M ARR',
    },
  },

  'pessimistic': {
    id: 'pessimistic',
    name: 'Pessimistic Scenario',
    emoji: '⚠️',
    color: '#EF4444',
    primeDirective: 'Prepare for the Worst',
    description: 'Emphasizes risks and worst-case outcomes. Applies lower-quartile industry benchmarks and elevated risk factors.',
    shortDesc: 'Worst-case futures',
    useCases: ['Risk assessment', 'Contingency planning', 'Due diligence', 'Insurance planning'],
    biasProfile: 'pessimistic',
    confidenceAdjustment: -0.15,
    timeHorizonWeight: 'near',
    riskWeighting: 1.5,
    opportunityWeighting: 0.6,
    defaultUniverseCount: 4,
    industryModifiers: { churnMultiplier: 1.4, growthMultiplier: 0.7, riskMultiplier: 1.5, confidenceMultiplier: 0.85 },
    isCore: true,
    fieldTooltips: {
      question: 'What could go wrong? Frame the question to surface risks, threats, and failure modes.',
      context: 'Highlight headwinds: market risks, competitive threats, internal weaknesses, timing challenges.',
      constraints: 'Define failure thresholds. What outcomes are unacceptable? What triggers contingency plans?',
      timeHorizon: 'Risks often materialize faster than expected. Industry risk factors will be elevated.',
      industry: 'Industry benchmarks will use bottom-quartile metrics (higher churn, lower growth, elevated risk).',
    },
    placeholders: {
      question: 'e.g., What if our main competitor launches a price war?',
      context: 'e.g., Competitor raised $100M, our margins are thin, customer loyalty untested...',
      constraints: 'e.g., Cannot lose more than 15% market share, must maintain positive cash flow',
    },
  },

  'board-ready': {
    id: 'board-ready',
    name: 'Board-Ready',
    emoji: '👔',
    color: '#6366F1',
    primeDirective: 'Defensible Decisions',
    description: 'Rigorous analysis suitable for board presentations. Uses conservative industry benchmarks with explicit confidence intervals.',
    shortDesc: 'Executive presentations',
    useCases: ['Board meetings', 'Investor updates', 'Major capital decisions', 'Strategic pivots'],
    biasProfile: 'balanced',
    confidenceAdjustment: -0.05,
    timeHorizonWeight: 'balanced',
    riskWeighting: 1.2,
    opportunityWeighting: 0.9,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 1.1, growthMultiplier: 0.95, riskMultiplier: 1.15, confidenceMultiplier: 0.9 },
    isCore: true,
    fieldTooltips: {
      question: 'Frame the strategic question as you would present it to the board. Be specific about the decision required.',
      context: 'Include all material facts a board member would need: financials, market data, competitive position, regulatory status.',
      constraints: 'Define fiduciary boundaries: risk tolerance, capital allocation limits, strategic guardrails, compliance requirements.',
      timeHorizon: 'Align with board planning cycles. Confidence intervals will be explicitly stated for all projections.',
      industry: 'Industry benchmarks will be conservative with explicit ranges (e.g., "SaaS churn: 5-8% annually, 90% confidence").',
    },
    placeholders: {
      question: 'e.g., Should we approve the $50M acquisition of TechCo?',
      context: 'e.g., TechCo: $8M ARR, 40% growth, 50 employees. Strategic fit with our AI roadmap. Competing bidder at $45M...',
      constraints: 'e.g., Must achieve 3x return in 5 years, integration costs capped at $5M, key talent retention required',
    },
  },

  'stress-test': {
    id: 'stress-test',
    name: 'Stress Test',
    emoji: '🔥',
    color: '#DC2626',
    primeDirective: 'Break It Before Reality Does',
    description: 'Extreme scenario simulation. Uses 99th percentile adverse industry benchmarks to test resilience.',
    shortDesc: 'Extreme scenarios',
    useCases: ['Crisis preparedness', 'Business continuity', 'Regulatory stress tests', 'Insurance assessment'],
    biasProfile: 'pessimistic',
    confidenceAdjustment: -0.25,
    timeHorizonWeight: 'near',
    riskWeighting: 2.0,
    opportunityWeighting: 0.5,
    defaultUniverseCount: 6,
    industryModifiers: { churnMultiplier: 2.0, growthMultiplier: 0.4, riskMultiplier: 2.5, confidenceMultiplier: 0.7 },
    isCore: true,
    fieldTooltips: {
      question: 'What extreme scenario are you testing? Think 2008 financial crisis, pandemic, major cyber attack.',
      context: 'Describe the stress scenario in detail: trigger event, severity, duration, cascading effects.',
      constraints: 'Define survival criteria. What must remain operational? What losses are survivable vs. fatal?',
      timeHorizon: 'Stress events typically unfold in weeks to months. Industry metrics will use crisis-level benchmarks.',
      industry: 'Industry benchmarks will use worst-case historical data (e.g., "SaaS churn during 2020: 12-18%").',
    },
    placeholders: {
      question: 'e.g., Can we survive a 6-month revenue drop of 50%?',
      context: 'e.g., Assume major customer bankruptcy, credit line frozen, key employees poached...',
      constraints: 'e.g., Must maintain 6 months runway, cannot breach debt covenants, must retain core team',
    },
  },

  'black-swan': {
    id: 'black-swan',
    name: 'Black Swan',
    emoji: '🦢',
    color: '#1F2937',
    primeDirective: 'Expect the Unexpected',
    description: 'Simulates rare, high-impact events. Uses tail-risk probability models beyond normal industry benchmarks.',
    shortDesc: 'Rare catastrophic events',
    useCases: ['Tail risk analysis', 'Insurance planning', 'Existential risk assessment', 'Scenario planning'],
    biasProfile: 'pessimistic',
    confidenceAdjustment: -0.3,
    timeHorizonWeight: 'balanced',
    riskWeighting: 2.0,
    opportunityWeighting: 0.4,
    defaultUniverseCount: 8,
    industryModifiers: { churnMultiplier: 3.0, growthMultiplier: 0.2, riskMultiplier: 4.0, confidenceMultiplier: 0.5 },
    fieldTooltips: {
      question: 'What "impossible" event would devastate your business? Think beyond normal risk categories.',
      context: 'Describe the black swan: why it seems unlikely, what would trigger it, why defenses might fail.',
      constraints: 'Define existential thresholds. What would force liquidation, bankruptcy, or fundamental pivot?',
      timeHorizon: 'Black swans can strike at any time. Probability models will use fat-tail distributions.',
      industry: 'Industry benchmarks will include historical black swan events (dot-com crash, 2008, pandemic).',
    },
    placeholders: {
      question: 'e.g., What if our entire technology stack becomes obsolete overnight?',
      context: 'e.g., Quantum computing breaks our encryption, AI replaces our core service, regulatory ban...',
      constraints: 'e.g., Must have pivot path that preserves 50% of value, cannot lose all institutional knowledge',
    },
  },

  'moonshot': {
    id: 'moonshot',
    name: 'Moonshot',
    emoji: '🚀',
    color: '#8B5CF6',
    primeDirective: '10x Thinking',
    description: 'Explores transformative outcomes. Uses top-1% industry performer benchmarks for breakthrough scenarios.',
    shortDesc: 'Transformative futures',
    useCases: ['Innovation planning', 'Disruption strategy', 'Vision setting', 'Breakthrough initiatives'],
    biasProfile: 'optimistic',
    confidenceAdjustment: 0.2,
    timeHorizonWeight: 'far',
    riskWeighting: 0.5,
    opportunityWeighting: 1.8,
    defaultUniverseCount: 4,
    industryModifiers: { churnMultiplier: 0.5, growthMultiplier: 2.0, riskMultiplier: 0.4, confidenceMultiplier: 1.2 },
    fieldTooltips: {
      question: 'What would 10x success look like? Don\'t constrain yourself to incremental improvements.',
      context: 'Describe the enabling conditions: technology breakthroughs, market shifts, capability leaps.',
      constraints: 'Define moonshot criteria. What would make this transformative rather than just successful?',
      timeHorizon: 'Moonshots typically require 5-10 year horizons. Industry benchmarks will use unicorn/decacorn metrics.',
      industry: 'Industry benchmarks will use top-1% performer data (fastest growth, lowest churn, highest margins).',
    },
    placeholders: {
      question: 'e.g., What if we became the dominant platform in our industry?',
      context: 'e.g., AI breakthrough, network effects, regulatory moat, talent magnet...',
      constraints: 'e.g., Must achieve $1B valuation, must create new market category, must be defensible',
    },
  },

  'contrarian': {
    id: 'contrarian',
    name: 'Contrarian View',
    emoji: '🔄',
    color: '#F59E0B',
    primeDirective: 'Challenge Consensus',
    description: 'Deliberately challenges conventional wisdom. Inverts typical industry assumptions to surface blind spots.',
    shortDesc: 'Against the grain',
    useCases: ['Strategy validation', 'Assumption testing', 'Devil\'s advocate', 'Competitive differentiation'],
    biasProfile: 'contrarian',
    confidenceAdjustment: 0,
    timeHorizonWeight: 'balanced',
    riskWeighting: 1.0,
    opportunityWeighting: 1.0,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 1.0, growthMultiplier: 1.0, riskMultiplier: 1.0, confidenceMultiplier: 0.8 },
    fieldTooltips: {
      question: 'What does everyone believe that might be wrong? Challenge the consensus view.',
      context: 'Describe the conventional wisdom and why it might be flawed. What are people missing?',
      constraints: 'Define what would prove the contrarian view right. What evidence would be compelling?',
      timeHorizon: 'Contrarian views often take time to prove out. Industry "rules" will be questioned.',
      industry: 'Industry benchmarks will be presented alongside counter-examples and outliers.',
    },
    placeholders: {
      question: 'e.g., What if remote work actually increases productivity long-term?',
      context: 'e.g., Conventional wisdom says in-office is better, but our data shows remote teams outperforming...',
      constraints: 'e.g., Must show sustained productivity gains over 2+ years, must account for selection bias',
    },
  },

  'growth': {
    id: 'growth',
    name: 'Growth Focus',
    emoji: '📈',
    color: '#22C55E',
    primeDirective: 'Maximize Expansion',
    description: 'Optimized for growth opportunities. Uses high-growth company benchmarks and accepts higher risk for higher reward.',
    shortDesc: 'Aggressive growth',
    useCases: ['Market expansion', 'Product launches', 'Scaling decisions', 'Investment allocation'],
    biasProfile: 'optimistic',
    confidenceAdjustment: 0.1,
    timeHorizonWeight: 'balanced',
    riskWeighting: 0.8,
    opportunityWeighting: 1.3,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 0.85, growthMultiplier: 1.25, riskMultiplier: 0.75, confidenceMultiplier: 1.05 },
    fieldTooltips: {
      question: 'What growth opportunity are you evaluating? Be specific about the target market or segment.',
      context: 'Describe the growth drivers: market size, competitive dynamics, your advantages, timing.',
      constraints: 'Define growth targets and acceptable costs. What growth rate justifies the investment?',
      timeHorizon: 'Growth initiatives typically show results in 1-3 years. Benchmarks will use growth-stage companies.',
      industry: 'Industry benchmarks will use high-growth cohort data (Series B+ companies, market leaders).',
    },
    placeholders: {
      question: 'e.g., Can we double revenue by entering the SMB market?',
      context: 'e.g., SMB market is 10x larger than enterprise, lower CAC, faster sales cycles...',
      constraints: 'e.g., Must achieve 100% revenue growth in 2 years, CAC payback under 12 months',
    },
  },

  'defensive': {
    id: 'defensive',
    name: 'Defensive Posture',
    emoji: '🛡️',
    color: '#64748B',
    primeDirective: 'Protect What Matters',
    description: 'Prioritizes preservation over growth. Uses mature company benchmarks focused on stability and retention.',
    shortDesc: 'Protect and preserve',
    useCases: ['Market defense', 'Recession planning', 'Competitive response', 'Value preservation'],
    biasProfile: 'pessimistic',
    confidenceAdjustment: -0.1,
    timeHorizonWeight: 'near',
    riskWeighting: 1.4,
    opportunityWeighting: 0.7,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 1.2, growthMultiplier: 0.8, riskMultiplier: 1.3, confidenceMultiplier: 0.9 },
    fieldTooltips: {
      question: 'What are you defending against? Identify the specific threat or risk.',
      context: 'Describe the threat landscape: competitor moves, market shifts, internal vulnerabilities.',
      constraints: 'Define what must be preserved. What losses are acceptable vs. unacceptable?',
      timeHorizon: 'Defensive actions often need to be immediate. Benchmarks will focus on retention metrics.',
      industry: 'Industry benchmarks will use mature company data (focus on retention, margin protection, stability).',
    },
    placeholders: {
      question: 'e.g., How do we defend market share against new entrant?',
      context: 'e.g., Well-funded competitor entering our space, targeting our top customers...',
      constraints: 'e.g., Cannot lose more than 5% market share, must retain top 20 accounts',
    },
  },

  'disruptor': {
    id: 'disruptor',
    name: 'Disruptor',
    emoji: '💥',
    color: '#EC4899',
    primeDirective: 'Break the Rules',
    description: 'Explores disruption scenarios. Uses disruptor company benchmarks and challenges industry structure assumptions.',
    shortDesc: 'Industry disruption',
    useCases: ['Disruption strategy', 'Competitive analysis', 'Innovation planning', 'Market creation'],
    biasProfile: 'contrarian',
    confidenceAdjustment: 0.05,
    timeHorizonWeight: 'far',
    riskWeighting: 0.9,
    opportunityWeighting: 1.5,
    defaultUniverseCount: 6,
    industryModifiers: { churnMultiplier: 0.6, growthMultiplier: 1.8, riskMultiplier: 0.7, confidenceMultiplier: 1.1 },
    fieldTooltips: {
      question: 'What industry assumption could be overturned? What would a 10x better solution look like?',
      context: 'Describe the industry status quo and its weaknesses. Where is value being destroyed?',
      constraints: 'Define disruption criteria. What would constitute true disruption vs. incremental improvement?',
      timeHorizon: 'Disruption typically takes 5-10 years. Benchmarks will use successful disruptor trajectories.',
      industry: 'Industry benchmarks will include disruptor case studies (Uber, Airbnb, Stripe patterns).',
    },
    placeholders: {
      question: 'e.g., What if we eliminated the need for our industry\'s middlemen?',
      context: 'e.g., Current model has 40% margin going to intermediaries, customers frustrated with complexity...',
      constraints: 'e.g., Must reduce customer costs by 50%, must achieve network effects, must be legally defensible',
    },
  },

  'long-range': {
    id: 'long-range',
    name: 'Long-Range Planning',
    emoji: '🔭',
    color: '#0EA5E9',
    primeDirective: 'Think in Decades',
    description: 'Extended time horizon simulation. Uses secular trend data and reduces confidence for distant projections.',
    shortDesc: '5-10 year futures',
    useCases: ['Strategic vision', 'Succession planning', 'Infrastructure investment', 'Market positioning'],
    biasProfile: 'balanced',
    confidenceAdjustment: -0.2,
    timeHorizonWeight: 'far',
    riskWeighting: 1.1,
    opportunityWeighting: 1.1,
    defaultUniverseCount: 5,
    industryModifiers: { churnMultiplier: 1.0, growthMultiplier: 1.0, riskMultiplier: 1.2, confidenceMultiplier: 0.6 },
    fieldTooltips: {
      question: 'Where do you want to be in 10 years? What strategic position are you building toward?',
      context: 'Describe long-term trends: technology evolution, demographic shifts, regulatory direction, competitive dynamics.',
      constraints: 'Define strategic non-negotiables. What must be true in 10 years regardless of path?',
      timeHorizon: 'This mode is designed for 5-10 year horizons. Confidence decreases with time but trends emerge.',
      industry: 'Industry benchmarks will use secular trend data (10-year CAGRs, structural shifts, megatrends).',
    },
    placeholders: {
      question: 'e.g., What should our company look like in 2035?',
      context: 'e.g., AI will transform our industry, climate regulation increasing, talent war intensifying...',
      constraints: 'e.g., Must be carbon neutral, must have AI-native products, must have global presence',
    },
  },
};

// Helper functions
export const isCoreMode = (modeId: string): boolean => 
  CORE_HORIZON_MODES.includes(modeId as any);

export const getModesByCategory = (category: keyof typeof HORIZON_MODE_CATEGORIES): HorizonMode[] =>
  HORIZON_MODE_CATEGORIES[category].map(id => HORIZON_MODES[id]).filter(Boolean);

export const getCoreModes = (): HorizonMode[] =>
  CORE_HORIZON_MODES.map(id => HORIZON_MODES[id]);

export const getModeForScenarioType = (scenarioType: string): string => {
  const mapping: Record<string, string> = {
    'strategic': 'balanced',
    'risk': 'pessimistic',
    'opportunity': 'optimistic',
    'crisis': 'stress-test',
    'growth': 'growth',
    'defense': 'defensive',
    'innovation': 'moonshot',
    'board': 'board-ready',
  };
  return mapping[scenarioType] || 'balanced';
};

// Calculate adjusted probability based on mode and industry
export const calculateAdjustedProbability = (
  baseProbability: number,
  mode: HorizonMode,
  industry: IndustryBenchmarks
): { probability: number; confidence: number; range: [number, number] } => {
  // Apply mode's risk/opportunity weighting
  const modeAdjusted = baseProbability * (
    baseProbability > 0.5 
      ? mode.opportunityWeighting 
      : mode.riskWeighting
  );
  
  // Apply industry modifiers
  const industryAdjusted = modeAdjusted * mode.industryModifiers.riskMultiplier;
  
  // Calculate confidence based on industry data reliability and mode
  const baseConfidence = industry.dataReliability * industry.forecastAccuracy;
  const adjustedConfidence = Math.min(0.95, Math.max(0.3, 
    baseConfidence * mode.industryModifiers.confidenceMultiplier + mode.confidenceAdjustment
  ));
  
  // Calculate range based on confidence
  const spread = (1 - adjustedConfidence) * 0.3;
  const probability = Math.min(0.99, Math.max(0.01, industryAdjusted));
  
  return {
    probability,
    confidence: adjustedConfidence,
    range: [
      Math.max(0.01, probability - spread),
      Math.min(0.99, probability + spread),
    ],
  };
};

// Get industry-specific insight text
export const getIndustryInsight = (
  metric: 'churn' | 'growth' | 'risk',
  mode: HorizonMode,
  industry: IndustryBenchmarks
): string => {
  const modeName = mode.name;
  const industryName = industry.name;
  
  switch (metric) {
    case 'churn':
      const adjustedChurn = industry.churnRateBase * mode.industryModifiers.churnMultiplier;
      return `${industryName} baseline churn: ${(industry.churnRateBase * 100).toFixed(1)}%. ${modeName} adjustment: ${(adjustedChurn * 100).toFixed(1)}%`;
    case 'growth':
      const adjustedGrowth = industry.growthVolatility * mode.industryModifiers.growthMultiplier;
      return `${industryName} growth volatility: ±${(industry.growthVolatility * 100).toFixed(0)}%. ${modeName} range: ±${(adjustedGrowth * 100).toFixed(0)}%`;
    case 'risk':
      const adjustedRisk = industry.regulatoryRisk * mode.industryModifiers.riskMultiplier;
      return `${industryName} regulatory risk: ${(industry.regulatoryRisk * 100).toFixed(0)}%. ${modeName} weighting: ${(adjustedRisk * 100).toFixed(0)}%`;
    default:
      return '';
  }
};
