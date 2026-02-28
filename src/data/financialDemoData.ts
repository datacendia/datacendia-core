// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA FINANCIAL™ - COMPREHENSIVE DEMO DATA
 * =============================================================================
 * Realistic banking and financial services demo data for all Datacendia services.
 * This data powers demo mode across the entire platform when Financial vertical is active.
 * 
 * SCENARIO: Meridian Capital Partners - $45B AUM Investment Bank
 * - Headquarters: New York, NY
 * - Employees: 2,400
 * - Divisions: Investment Banking, Asset Management, Trading, Wealth Management
 * - Regulatory: SEC, FINRA, OCC, Federal Reserve, CFTC
 */

// =============================================================================
// COMPANY PROFILE
// =============================================================================

export const FINANCIAL_COMPANY = {
  name: 'Meridian Capital Partners',
  ticker: 'MCP',
  headquarters: 'New York, NY',
  founded: 1987,
  employees: 2400,
  aum: 45_000_000_000, // $45B
  revenue: 2_800_000_000, // $2.8B annual
  divisions: [
    { name: 'Investment Banking', head: 'Sarah Chen', employees: 450, revenue: 890_000_000 },
    { name: 'Asset Management', head: 'Michael Torres', employees: 380, revenue: 720_000_000 },
    { name: 'Trading', head: 'James Okonkwo', employees: 520, revenue: 680_000_000 },
    { name: 'Wealth Management', head: 'Emily Nakamura', employees: 340, revenue: 510_000_000 },
    { name: 'Risk & Compliance', head: 'David Petrov', employees: 180, revenue: 0 },
    { name: 'Technology', head: 'Priya Sharma', employees: 530, revenue: 0 },
  ],
  regulators: ['SEC', 'FINRA', 'OCC', 'Federal Reserve', 'CFTC', 'NYDFS'],
};

// =============================================================================
// EXECUTIVE TEAM (for Ghost Board, Succession, etc.)
// =============================================================================

export const FINANCIAL_EXECUTIVES = [
  {
    id: 'exec-ceo',
    name: 'Robert Harrington',
    title: 'Chief Executive Officer',
    avatar: '👔',
    tenure: 8,
    age: 58,
    background: 'Former Goldman Sachs Partner, Harvard MBA',
    compensationTotal: 12_500_000,
    stockOwnership: 2.3,
    keyDecisions: ['2019 Digital Transformation', '2021 ESG Fund Launch', '2023 Crypto Desk'],
    successionRisk: 'medium',
    knowledgeAreas: ['M&A Strategy', 'Regulatory Relations', 'Client Relationships'],
  },
  {
    id: 'exec-cfo',
    name: 'Margaret Liu',
    title: 'Chief Financial Officer',
    avatar: '📊',
    tenure: 5,
    age: 52,
    background: 'Former Deloitte Partner, CPA, Wharton MBA',
    compensationTotal: 4_200_000,
    stockOwnership: 0.8,
    keyDecisions: ['Basel III Implementation', 'Cost Reduction Program', 'Treasury Optimization'],
    successionRisk: 'low',
    knowledgeAreas: ['Capital Management', 'Regulatory Reporting', 'Tax Strategy'],
  },
  {
    id: 'exec-cro',
    name: 'David Petrov',
    title: 'Chief Risk Officer',
    avatar: '🛡️',
    tenure: 6,
    age: 49,
    background: 'Former Fed Examiner, MIT PhD in Financial Engineering',
    compensationTotal: 3_800_000,
    stockOwnership: 0.5,
    keyDecisions: ['VaR Model Overhaul', 'Stress Testing Framework', 'Counterparty Limits'],
    successionRisk: 'high',
    knowledgeAreas: ['Market Risk', 'Credit Risk', 'Operational Risk', 'Model Validation'],
  },
  {
    id: 'exec-coo',
    name: 'Jennifer Walsh',
    title: 'Chief Operating Officer',
    avatar: '⚙️',
    tenure: 4,
    age: 47,
    background: 'Former McKinsey Partner, Operations Transformation',
    compensationTotal: 3_500_000,
    stockOwnership: 0.6,
    keyDecisions: ['Cloud Migration', 'Vendor Consolidation', 'Process Automation'],
    successionRisk: 'low',
    knowledgeAreas: ['Operations', 'Technology', 'Vendor Management'],
  },
  {
    id: 'exec-cco',
    name: 'Thomas Brennan',
    title: 'Chief Compliance Officer',
    avatar: '⚖️',
    tenure: 7,
    age: 55,
    background: 'Former SEC Enforcement, Georgetown Law',
    compensationTotal: 2_800_000,
    stockOwnership: 0.3,
    keyDecisions: ['AML Program Overhaul', 'GDPR Implementation', 'Whistleblower Program'],
    successionRisk: 'medium',
    knowledgeAreas: ['Securities Law', 'AML/BSA', 'Regulatory Examinations'],
  },
  {
    id: 'exec-cto',
    name: 'Priya Sharma',
    title: 'Chief Technology Officer',
    avatar: '💻',
    tenure: 3,
    age: 44,
    background: 'Former Google Engineering Director, Stanford CS',
    compensationTotal: 4_500_000,
    stockOwnership: 0.7,
    keyDecisions: ['AI Trading Platform', 'Zero Trust Security', 'Real-time Analytics'],
    successionRisk: 'medium',
    knowledgeAreas: ['AI/ML', 'Cloud Architecture', 'Cybersecurity'],
  },
];

// =============================================================================
// COUNCIL DELIBERATIONS (Financial-specific scenarios)
// =============================================================================

export const FINANCIAL_DELIBERATIONS = [
  {
    id: 'fin-delib-001',
    question: 'Should we acquire Quantum Analytics, a $180M fintech specializing in AI-driven credit scoring?',
    context: `Quantum Analytics has developed proprietary ML models that outperform traditional FICO by 23% in default prediction. 
    They have 45 bank clients and $32M ARR growing 67% YoY. Asking price is $180M (5.6x revenue).
    Integration would accelerate our digital lending strategy by 18 months.
    Key risks: Regulatory approval (OCC), model validation requirements, key person dependency on 3 founders.`,
    status: 'COMPLETED',
    outcome: 'APPROVED_WITH_CONDITIONS',
    confidence: 0.78,
    agents: [
      {
        id: 'strategist',
        name: 'Chief Strategy Agent',
        vote: 'SUPPORT',
        confidence: 0.85,
        reasoning: 'Strategic fit is excellent. AI credit scoring is table stakes by 2027. Build vs buy analysis favors acquisition.',
        keyPoints: ['18-month time-to-market advantage', 'Talent acquisition (23 ML engineers)', 'Competitive moat in SMB lending'],
      },
      {
        id: 'analyst',
        name: 'Financial Analyst Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.72,
        reasoning: 'Valuation is aggressive but defensible given growth rate. Recommend earnout structure to mitigate integration risk.',
        keyPoints: ['5.6x revenue is 15% premium to comps', 'Recommend $140M upfront + $40M earnout', 'IRR of 18% over 5 years'],
      },
      {
        id: 'risk',
        name: 'Risk Assessment Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.68,
        reasoning: 'Model risk is manageable with proper validation. Key person risk requires retention packages.',
        keyPoints: ['OCC approval timeline: 6-9 months', 'Model validation: $2M budget needed', 'Founder retention: 3-year lockup required'],
      },
      {
        id: 'compliance',
        name: 'Compliance Guardian Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.71,
        reasoning: 'Fair lending implications require careful review. Recommend pre-closing regulatory consultation.',
        keyPoints: ['ECOA/fair lending audit required', 'Model explainability documentation', 'State licensing in 12 states'],
      },
      {
        id: 'ethics',
        name: 'Ethics Guardian Agent',
        vote: 'SUPPORT',
        confidence: 0.82,
        reasoning: 'AI credit scoring can reduce human bias if properly designed. Quantum has strong fairness metrics.',
        keyPoints: ['Disparate impact testing shows improvement', 'Explainability features for adverse actions', 'No predatory lending concerns'],
      },
      {
        id: 'advocate',
        name: "Devil's Advocate Agent",
        vote: 'OPPOSE',
        confidence: 0.65,
        reasoning: 'Integration risk is underestimated. 60% of fintech acquisitions fail to deliver projected synergies.',
        keyPoints: ['Cultural integration challenges', 'Technology stack incompatibility', 'Customer concentration (top 5 = 45% revenue)'],
      },
    ],
    conditions: [
      'Restructure deal as $140M upfront + $40M earnout tied to revenue targets',
      'Secure 3-year retention agreements with all 3 founders',
      'Complete OCC pre-filing consultation before signing',
      'Budget $2M for independent model validation',
      'Conduct fair lending audit within 90 days of close',
    ],
    dissents: [
      {
        agentId: 'advocate',
        agentName: "Devil's Advocate Agent",
        position: 'OPPOSE',
        reasoning: 'Historical M&A success rate in fintech is poor. Organic build may be slower but lower risk.',
        acknowledged: true,
      },
    ],
    startedAt: '2026-01-03T14:30:00Z',
    completedAt: '2026-01-03T15:45:00Z',
  },
  {
    id: 'fin-delib-002',
    question: 'Should we exit our $2.3B position in emerging market sovereign debt given escalating geopolitical tensions?',
    context: `Current EM sovereign debt portfolio: $2.3B across 18 countries.
    Largest exposures: Brazil ($420M), Mexico ($380M), Indonesia ($290M), South Africa ($240M).
    Recent developments: Currency volatility up 40%, credit spreads widening 85bps.
    Yield advantage over US Treasuries: 340bps. Unrealized gain: $145M.
    Client mandates: 12 funds with EM allocation requirements.`,
    status: 'COMPLETED',
    outcome: 'PARTIAL_EXIT',
    confidence: 0.74,
    agents: [
      {
        id: 'strategist',
        name: 'Chief Strategy Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.76,
        reasoning: 'Selective reduction makes sense. Full exit would be overreaction and lock in opportunity cost.',
        keyPoints: ['Reduce high-risk exposures by 40%', 'Maintain investment-grade EM', 'Hedge currency exposure'],
      },
      {
        id: 'analyst',
        name: 'Financial Analyst Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.79,
        reasoning: 'Risk-adjusted returns no longer justify current allocation. Recommend rebalancing to 60% of current.',
        keyPoints: ['Sharpe ratio declined from 1.2 to 0.7', 'Correlation to risk assets increased', 'Liquidity concerns in stress scenario'],
      },
      {
        id: 'risk',
        name: 'Risk Assessment Agent',
        vote: 'SUPPORT',
        confidence: 0.84,
        reasoning: 'VaR breach probability has increased to 12%. Stress tests show potential $180M loss in tail scenario.',
        keyPoints: ['VaR limit utilization at 94%', 'Liquidity coverage ratio impact', 'Counterparty exposure concentration'],
      },
    ],
    conditions: [
      'Execute phased exit over 6 weeks to minimize market impact',
      'Prioritize reduction in countries with highest political risk scores',
      'Implement currency hedges on remaining positions',
      'Communicate strategy change to affected fund investors',
    ],
    startedAt: '2026-01-04T09:00:00Z',
    completedAt: '2026-01-04T10:30:00Z',
  },
  {
    id: 'fin-delib-003',
    question: 'Should we launch a cryptocurrency custody and trading desk for institutional clients?',
    context: `Client demand: 34 institutional clients have requested crypto services in past 12 months.
    Estimated revenue opportunity: $45M in Year 1, $120M by Year 3.
    Required investment: $28M (technology, compliance, talent).
    Regulatory status: OCC has approved crypto custody for national banks. SEC clarity pending.
    Competitors: 8 of top 10 investment banks now offer crypto services.`,
    status: 'IN_PROGRESS',
    outcome: null,
    confidence: null,
    agents: [
      {
        id: 'strategist',
        name: 'Chief Strategy Agent',
        vote: 'SUPPORT',
        confidence: 0.81,
        reasoning: 'First-mover advantage is eroding. Further delay risks losing clients to competitors.',
        keyPoints: ['Client retention risk', 'Revenue diversification', 'Talent attraction'],
      },
      {
        id: 'risk',
        name: 'Risk Assessment Agent',
        vote: 'OPPOSE',
        confidence: 0.72,
        reasoning: 'Regulatory uncertainty remains high. Reputational risk from potential enforcement actions.',
        keyPoints: ['SEC enforcement trend', 'Custody liability', 'AML/KYC complexity'],
      },
      {
        id: 'compliance',
        name: 'Compliance Guardian Agent',
        vote: 'SUPPORT_WITH_CONDITIONS',
        confidence: 0.68,
        reasoning: 'Proceed with custody only initially. Trading desk should wait for clearer SEC guidance.',
        keyPoints: ['Custody-only Phase 1', 'Enhanced AML program', 'Regulatory engagement strategy'],
      },
    ],
    startedAt: '2026-01-05T11:00:00Z',
  },
];

// =============================================================================
// RISK METRICS (for Oversight, Financial Page, Crucible)
// =============================================================================

export const FINANCIAL_RISK_METRICS = {
  market: {
    dailyVaR95: { value: 42_500_000, limit: 50_000_000, utilization: 0.85, trend: 'up' },
    dailyVaR99: { value: 68_200_000, limit: 75_000_000, utilization: 0.91, trend: 'up' },
    stressedVaR: { value: 124_000_000, limit: 150_000_000, utilization: 0.83, trend: 'stable' },
    greekExposures: {
      delta: 12_400_000,
      gamma: -2_100_000,
      vega: 8_900_000,
      theta: -340_000,
    },
  },
  credit: {
    totalExposure: 28_400_000_000,
    expectedLoss: 142_000_000,
    unexpectedLoss: 890_000_000,
    concentrationTop10: 0.34,
    watchlistAccounts: 23,
    nplRatio: 0.018,
  },
  liquidity: {
    lcr: 142, // Liquidity Coverage Ratio (%)
    nsfr: 118, // Net Stable Funding Ratio (%)
    hqla: 8_200_000_000, // High Quality Liquid Assets
    stressedOutflows: 5_800_000_000,
    intraday: { peak: 2_400_000_000, average: 890_000_000 },
  },
  capital: {
    cet1Ratio: 12.8,
    tier1Ratio: 14.2,
    totalCapitalRatio: 16.4,
    leverageRatio: 5.8,
    rwa: 32_000_000_000,
    capitalBuffer: 2_100_000_000,
  },
  operational: {
    lossEvents30d: 12,
    lossAmount30d: 2_400_000,
    nearMisses30d: 34,
    controlFailures: 3,
    cyberIncidents: 2,
    vendorIssues: 5,
  },
};

// =============================================================================
// COMPLIANCE STATUS (for Oversight, Regulatory Absorb)
// =============================================================================

export const FINANCIAL_COMPLIANCE = {
  frameworks: [
    {
      id: 'basel-iii',
      name: 'Basel III',
      status: 'compliant',
      lastAudit: '2025-11-15',
      nextAudit: '2026-05-15',
      controls: 142,
      findings: 3,
      criticalFindings: 0,
    },
    {
      id: 'sox',
      name: 'Sarbanes-Oxley',
      status: 'compliant',
      lastAudit: '2025-12-01',
      nextAudit: '2026-03-01',
      controls: 89,
      findings: 2,
      criticalFindings: 0,
    },
    {
      id: 'dora',
      name: 'DORA (EU)',
      status: 'in_progress',
      lastAudit: '2025-10-01',
      nextAudit: '2026-01-17',
      controls: 67,
      findings: 8,
      criticalFindings: 1,
    },
    {
      id: 'aml-bsa',
      name: 'AML/BSA',
      status: 'warning',
      lastAudit: '2025-09-20',
      nextAudit: '2026-03-20',
      controls: 156,
      findings: 12,
      criticalFindings: 2,
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      status: 'compliant',
      lastAudit: '2025-08-15',
      nextAudit: '2026-02-15',
      controls: 45,
      findings: 1,
      criticalFindings: 0,
    },
    {
      id: 'mifid-ii',
      name: 'MiFID II',
      status: 'compliant',
      lastAudit: '2025-11-01',
      nextAudit: '2026-05-01',
      controls: 78,
      findings: 4,
      criticalFindings: 0,
    },
  ],
  upcomingDeadlines: [
    { date: '2026-01-17', framework: 'DORA', requirement: 'ICT Risk Management Framework submission', priority: 'critical' },
    { date: '2026-01-31', framework: 'SEC', requirement: 'Form ADV annual amendment', priority: 'high' },
    { date: '2026-02-15', framework: 'FINRA', requirement: 'Annual compliance meeting certification', priority: 'medium' },
    { date: '2026-03-01', framework: 'SOX', requirement: 'Q4 control testing completion', priority: 'high' },
    { date: '2026-03-15', framework: 'Fed', requirement: 'FR Y-14A submission', priority: 'critical' },
  ],
  recentRegulations: [
    {
      id: 'reg-001',
      title: 'SEC Climate Disclosure Rules',
      effectiveDate: '2026-03-01',
      impact: 'high',
      status: 'gap_analysis',
      requirements: 23,
      gaps: 8,
    },
    {
      id: 'reg-002',
      title: 'OCC Third-Party Risk Management',
      effectiveDate: '2026-06-01',
      impact: 'medium',
      status: 'implementation',
      requirements: 45,
      gaps: 12,
    },
    {
      id: 'reg-003',
      title: 'CFPB Section 1071 Small Business Lending',
      effectiveDate: '2026-10-01',
      impact: 'high',
      status: 'planning',
      requirements: 67,
      gaps: 67,
    },
  ],
};

// =============================================================================
// FRAUD ALERTS (for Financial Page, Crucible)
// =============================================================================

export const FINANCIAL_FRAUD_ALERTS = [
  {
    id: 'fraud-001',
    type: 'Wire Transfer Anomaly',
    severity: 'critical',
    amount: 2_400_000,
    accountId: 'CORP-8847291',
    accountName: 'Nexus Industrial Holdings',
    timestamp: new Date('2026-01-05T08:23:00Z'),
    confidence: 0.94,
    status: 'investigating',
    indicators: [
      'First international wire to this beneficiary',
      'Amount 340% above account average',
      'Beneficiary country: High-risk jurisdiction',
      'Unusual timing (outside business hours)',
    ],
    assignedTo: 'Maria Santos',
    slaDeadline: new Date('2026-01-05T12:23:00Z'),
  },
  {
    id: 'fraud-002',
    type: 'Account Takeover Attempt',
    severity: 'high',
    amount: 0,
    accountId: 'PRIV-2234891',
    accountName: 'Henderson Family Trust',
    timestamp: new Date('2026-01-05T06:45:00Z'),
    confidence: 0.87,
    status: 'escalated',
    indicators: [
      'Login from new device and location',
      'Multiple failed MFA attempts',
      'Password reset request',
      'Beneficiary addition attempt',
    ],
    assignedTo: 'James Chen',
    slaDeadline: new Date('2026-01-05T10:45:00Z'),
  },
  {
    id: 'fraud-003',
    type: 'Structuring Pattern',
    severity: 'high',
    amount: 89_500,
    accountId: 'BUS-4456721',
    accountName: 'Coastal Imports LLC',
    timestamp: new Date('2026-01-04T15:30:00Z'),
    confidence: 0.82,
    status: 'confirmed',
    indicators: [
      '9 cash deposits in 3 days',
      'All deposits between $9,500-$9,900',
      'Multiple branch locations',
      'Pattern matches known structuring',
    ],
    assignedTo: 'Robert Kim',
    slaDeadline: new Date('2026-01-05T15:30:00Z'),
  },
];

// =============================================================================
// TRADING POSITIONS (for Financial Page, Chronos)
// =============================================================================

export const FINANCIAL_TRADING = {
  portfolios: [
    {
      id: 'port-equity',
      name: 'Global Equity Fund',
      aum: 8_200_000_000,
      returns: { ytd: 12.4, mtd: 2.1, wtd: 0.8 },
      benchmark: 'MSCI World',
      benchmarkReturns: { ytd: 10.8, mtd: 1.9, wtd: 0.6 },
      alpha: 1.6,
      beta: 1.05,
      sharpe: 1.42,
      var95: 124_000_000,
      positions: 342,
      topHoldings: [
        { ticker: 'AAPL', weight: 4.2, pnl: 12_400_000 },
        { ticker: 'MSFT', weight: 3.8, pnl: 8_900_000 },
        { ticker: 'NVDA', weight: 3.1, pnl: 24_200_000 },
        { ticker: 'GOOGL', weight: 2.9, pnl: -2_100_000 },
        { ticker: 'AMZN', weight: 2.7, pnl: 5_600_000 },
      ],
    },
    {
      id: 'port-fi',
      name: 'Investment Grade Credit',
      aum: 12_400_000_000,
      returns: { ytd: 4.8, mtd: 0.4, wtd: 0.1 },
      benchmark: 'Bloomberg US Agg',
      benchmarkReturns: { ytd: 4.2, mtd: 0.3, wtd: 0.1 },
      alpha: 0.6,
      duration: 6.2,
      spread: 142,
      var95: 89_000_000,
      positions: 567,
    },
    {
      id: 'port-alt',
      name: 'Alternative Strategies',
      aum: 4_800_000_000,
      returns: { ytd: 8.9, mtd: 1.2, wtd: 0.4 },
      benchmark: 'HFRI Fund Weighted',
      benchmarkReturns: { ytd: 7.2, mtd: 0.9, wtd: 0.3 },
      alpha: 1.7,
      correlation: 0.34,
      sharpe: 1.28,
      var95: 67_000_000,
      strategies: ['Long/Short Equity', 'Event Driven', 'Global Macro', 'Relative Value'],
    },
  ],
  recentTrades: [
    { id: 't1', time: '09:32:14', symbol: 'NVDA', side: 'BUY', qty: 15000, price: 142.50, value: 2_137_500, desk: 'Equity' },
    { id: 't2', time: '09:45:22', symbol: 'US10Y', side: 'SELL', qty: 500, price: 98.25, value: 49_125_000, desk: 'Rates' },
    { id: 't3', time: '10:12:08', symbol: 'EUR/USD', side: 'BUY', qty: 25_000_000, price: 1.0842, value: 27_105_000, desk: 'FX' },
    { id: 't4', time: '10:28:45', symbol: 'SPX 4800P', side: 'BUY', qty: 200, price: 45.20, value: 904_000, desk: 'Options' },
    { id: 't5', time: '10:45:33', symbol: 'AAPL', side: 'SELL', qty: 8500, price: 178.90, value: 1_520_650, desk: 'Equity' },
  ],
};

// =============================================================================
// DECISION DEBT (for Decision Debt Page)
// =============================================================================

export const FINANCIAL_DECISION_DEBT = [
  {
    id: 'debt-001',
    title: 'Core Banking System Modernization',
    description: 'Replace 25-year-old mainframe with cloud-native platform',
    owner: 'Priya Sharma (CTO)',
    department: 'Technology',
    daysStuck: 847,
    estimatedCost: 45_000_000,
    dailyCarryingCost: 124_000,
    totalDebtAccrued: 105_028_000,
    blockers: ['Budget approval pending', 'Vendor selection deadlock', 'Regulatory uncertainty'],
    stakeholders: 12,
    meetings: 34,
    status: 'stalled',
    priority: 'critical',
  },
  {
    id: 'debt-002',
    title: 'Crypto Custody Service Launch',
    description: 'Launch institutional cryptocurrency custody and trading',
    owner: 'Sarah Chen (IB Head)',
    department: 'Investment Banking',
    daysStuck: 234,
    estimatedCost: 28_000_000,
    dailyCarryingCost: 89_000,
    totalDebtAccrued: 20_826_000,
    blockers: ['Regulatory clarity pending', 'Risk committee approval', 'Insurance coverage'],
    stakeholders: 8,
    meetings: 18,
    status: 'blocked',
    priority: 'high',
  },
  {
    id: 'debt-003',
    title: 'London Office Expansion',
    description: 'Expand London presence from 120 to 300 employees post-Brexit',
    owner: 'Jennifer Walsh (COO)',
    department: 'Operations',
    daysStuck: 156,
    estimatedCost: 12_000_000,
    dailyCarryingCost: 34_000,
    totalDebtAccrued: 5_304_000,
    blockers: ['Real estate negotiations', 'Hiring timeline', 'Regulatory approvals'],
    stakeholders: 6,
    meetings: 12,
    status: 'slow_progress',
    priority: 'medium',
  },
  {
    id: 'debt-004',
    title: 'ESG Data Integration',
    description: 'Integrate third-party ESG data into investment process',
    owner: 'Michael Torres (AM Head)',
    department: 'Asset Management',
    daysStuck: 89,
    estimatedCost: 4_500_000,
    dailyCarryingCost: 18_000,
    totalDebtAccrued: 1_602_000,
    blockers: ['Data vendor evaluation', 'Methodology alignment', 'Client communication'],
    stakeholders: 5,
    meetings: 8,
    status: 'in_review',
    priority: 'medium',
  },
];

// =============================================================================
// STRESS TEST SCENARIOS (for Crucible, Financial Page)
// =============================================================================

export const FINANCIAL_STRESS_TESTS = [
  {
    id: 'stress-001',
    name: '2008 Financial Crisis Replay',
    description: 'Simulate market conditions from September-November 2008',
    scenario: {
      equityDrop: -45,
      creditSpreadWiden: 400,
      volatilitySpike: 80,
      liquidityDrain: 60,
      correlationBreak: true,
    },
    results: {
      portfolioLoss: -4_200_000_000,
      capitalImpact: -3.2,
      liquidityShortfall: 1_800_000_000,
      breachedLimits: ['VaR', 'Concentration', 'Liquidity'],
    },
    status: 'warning',
    lastRun: '2026-01-03',
  },
  {
    id: 'stress-002',
    name: 'Rapid Rate Rise (+300bps)',
    description: 'Federal Reserve emergency rate hikes over 6 months',
    scenario: {
      rateIncrease: 300,
      yieldCurveFlattening: true,
      creditMigration: 'down_1_notch',
      prepaymentSpike: 40,
    },
    results: {
      portfolioLoss: -890_000_000,
      capitalImpact: -0.8,
      durationGap: 2.4,
      breachedLimits: ['Duration'],
    },
    status: 'passed',
    lastRun: '2026-01-02',
  },
  {
    id: 'stress-003',
    name: 'Cyber Attack - Trading System Down',
    description: 'Complete trading system outage for 48 hours',
    scenario: {
      systemDowntime: 48,
      manualProcessing: true,
      clientExodus: 5,
      regulatoryFines: 25_000_000,
    },
    results: {
      operationalLoss: -180_000_000,
      reputationalImpact: 'severe',
      clientAttrition: 340_000_000,
      recoveryTime: 72,
    },
    status: 'failed',
    lastRun: '2026-01-01',
  },
  {
    id: 'stress-004',
    name: 'Emerging Market Contagion',
    description: 'Sovereign default triggers EM-wide selloff',
    scenario: {
      emCurrencyDrop: -25,
      spreadWiden: 500,
      capitalFlight: true,
      usdStrength: 15,
    },
    results: {
      portfolioLoss: -560_000_000,
      capitalImpact: -0.5,
      counterpartyLosses: 89_000_000,
      breachedLimits: ['Country Concentration'],
    },
    status: 'warning',
    lastRun: '2025-12-28',
  },
];

// =============================================================================
// AUDIT TRAIL / LEDGER ENTRIES (for Decision DNA, Ledger)
// =============================================================================

export const FINANCIAL_AUDIT_TRAIL = [
  {
    id: 'audit-001',
    timestamp: '2026-01-05T09:15:23Z',
    action: 'TRADE_EXECUTED',
    actor: 'James Okonkwo',
    actorRole: 'Head of Trading',
    resource: 'NVDA Position',
    details: { side: 'BUY', quantity: 15000, price: 142.50, value: 2_137_500 },
    hash: 'a3f2c1d4e5b6...',
    previousHash: '9c8b7a6f5e4d...',
    signature: 'MCP-TRADE-2026-0105-001',
  },
  {
    id: 'audit-002',
    timestamp: '2026-01-05T08:45:12Z',
    action: 'RISK_LIMIT_BREACH',
    actor: 'SYSTEM',
    actorRole: 'Risk Engine',
    resource: 'VaR Limit',
    details: { limit: 50_000_000, actual: 52_400_000, breach: 4.8 },
    hash: '9c8b7a6f5e4d...',
    previousHash: '7d6e5f4a3b2c...',
    signature: 'MCP-RISK-2026-0105-001',
  },
  {
    id: 'audit-003',
    timestamp: '2026-01-05T08:30:00Z',
    action: 'COUNCIL_DELIBERATION_STARTED',
    actor: 'Sarah Chen',
    actorRole: 'Head of Investment Banking',
    resource: 'Quantum Analytics Acquisition',
    details: { deliberationId: 'fin-delib-001', agents: 6, mode: 'full_council' },
    hash: '7d6e5f4a3b2c...',
    previousHash: '5b4c3d2e1f0a...',
    signature: 'MCP-COUNCIL-2026-0105-001',
  },
  {
    id: 'audit-004',
    timestamp: '2026-01-04T16:45:00Z',
    action: 'COMPLIANCE_ALERT_CREATED',
    actor: 'Thomas Brennan',
    actorRole: 'Chief Compliance Officer',
    resource: 'AML Alert - Structuring',
    details: { alertId: 'fraud-003', severity: 'high', account: 'BUS-4456721' },
    hash: '5b4c3d2e1f0a...',
    previousHash: '3a2b1c0d9e8f...',
    signature: 'MCP-COMP-2026-0104-001',
  },
];

// =============================================================================
// DISSENT RECORDS (for Dissent Page)
// =============================================================================

export const FINANCIAL_DISSENTS = [
  {
    id: 'dissent-001',
    title: 'Objection to Crypto Desk Launch Timeline',
    filer: 'Anonymous',
    filedAt: '2026-01-02T14:30:00Z',
    decision: 'Crypto Custody Service Launch',
    decisionId: 'debt-002',
    position: 'OPPOSE',
    reasoning: `The proposed Q2 launch timeline is dangerously aggressive given unresolved regulatory questions. 
    SEC enforcement actions against crypto custodians increased 340% in 2025. 
    Launching before clear guidance exposes the firm to significant regulatory and reputational risk.
    Recommend delaying until Q4 2026 at earliest.`,
    status: 'under_review',
    acknowledged: true,
    response: null,
    retaliationMonitoring: true,
  },
  {
    id: 'dissent-002',
    title: 'Concerns About Model Risk in Quantum Acquisition',
    filer: 'Risk Management Team',
    filedAt: '2026-01-03T11:15:00Z',
    decision: 'Quantum Analytics Acquisition',
    decisionId: 'fin-delib-001',
    position: 'SUPPORT_WITH_CONDITIONS',
    reasoning: `While we support the strategic rationale, the $2M budget for model validation is insufficient.
    Quantum's ML models have 847 features and require extensive fair lending testing.
    Recommend increasing validation budget to $5M and extending timeline by 90 days.`,
    status: 'addressed',
    acknowledged: true,
    response: 'Validation budget increased to $3.5M. Timeline extended by 60 days. Additional fair lending consultant engaged.',
    retaliationMonitoring: false,
  },
];

// =============================================================================
// CHRONOS TIMELINE EVENTS (for Chronos Page)
// =============================================================================

export const FINANCIAL_TIMELINE_EVENTS = [
  {
    id: 'event-001',
    timestamp: new Date('2026-01-05T09:15:00Z'),
    type: 'decision',
    title: 'Quantum Analytics Acquisition Approved',
    description: 'Council approved $180M acquisition with conditions',
    impact: 'positive',
    magnitude: 85,
    department: 'Investment Banking',
    actors: ['Sarah Chen', 'Robert Harrington', 'Margaret Liu'],
    deliberationId: 'fin-delib-001',
  },
  {
    id: 'event-002',
    timestamp: new Date('2026-01-05T08:45:00Z'),
    type: 'metric',
    title: 'VaR Limit Breach',
    description: 'Daily VaR exceeded limit by 4.8%',
    impact: 'negative',
    magnitude: 65,
    department: 'Trading',
    actors: ['James Okonkwo', 'David Petrov'],
  },
  {
    id: 'event-003',
    timestamp: new Date('2026-01-04T16:00:00Z'),
    type: 'financial',
    title: 'Q4 Earnings Beat',
    description: 'EPS of $4.82 vs $4.45 expected (+8.3%)',
    impact: 'positive',
    magnitude: 78,
    department: 'Finance',
    actors: ['Margaret Liu'],
  },
  {
    id: 'event-004',
    timestamp: new Date('2026-01-03T10:00:00Z'),
    type: 'personnel',
    title: 'CRO Succession Planning Initiated',
    description: 'David Petrov announced retirement in 18 months',
    impact: 'neutral',
    magnitude: 72,
    department: 'Risk',
    actors: ['David Petrov', 'Robert Harrington'],
  },
  {
    id: 'event-005',
    timestamp: new Date('2025-12-15T14:00:00Z'),
    type: 'system',
    title: 'Trading Platform Upgrade Complete',
    description: 'Migrated to low-latency trading infrastructure',
    impact: 'positive',
    magnitude: 68,
    department: 'Technology',
    actors: ['Priya Sharma'],
  },
];

// =============================================================================
// GHOST BOARD PERSONAS (for Ghost Board Page)
// =============================================================================

export const FINANCIAL_BOARD_PERSONAS = [
  {
    id: 'board-001',
    name: 'Victoria Sterling',
    role: 'Activist Investor',
    firm: 'Sterling Capital Partners',
    stake: '4.2%',
    avatar: '👩‍💼',
    personality: 'aggressive',
    concerns: ['Capital allocation', 'Cost efficiency', 'Shareholder returns'],
    typicalQuestions: [
      'Why is your ROIC 200bps below peers?',
      'What is your plan to return excess capital?',
      'Why are you investing in crypto when core business needs attention?',
    ],
    hostilityLevel: 0.85,
  },
  {
    id: 'board-002',
    name: 'William Chen',
    role: 'Independent Director',
    firm: 'Audit Committee Chair',
    tenure: '8 years',
    avatar: '👨‍💼',
    personality: 'analytical',
    concerns: ['Risk management', 'Compliance', 'Internal controls'],
    typicalQuestions: [
      'Walk me through your stress testing methodology',
      'How confident are you in your VaR models?',
      'What keeps you up at night from a risk perspective?',
    ],
    hostilityLevel: 0.45,
  },
  {
    id: 'board-003',
    name: 'Dr. Sarah Okafor',
    role: 'ESG Advisor',
    firm: 'Sustainable Finance Institute',
    avatar: '👩‍🔬',
    personality: 'principled',
    concerns: ['Climate risk', 'Diversity', 'Governance'],
    typicalQuestions: [
      'What is your net-zero transition plan?',
      'How are you measuring financed emissions?',
      'Why is your board still 70% male?',
    ],
    hostilityLevel: 0.55,
  },
  {
    id: 'board-004',
    name: 'James Morrison',
    role: 'Regulator Observer',
    firm: 'Former OCC Deputy Comptroller',
    avatar: '🏛️',
    personality: 'skeptical',
    concerns: ['Safety and soundness', 'Consumer protection', 'Systemic risk'],
    typicalQuestions: [
      'How would you survive a 2008-style crisis?',
      'What is your resolution plan?',
      'Are you too big to manage?',
    ],
    hostilityLevel: 0.70,
  },
];

// =============================================================================
// EXPORT ALL
// =============================================================================

export const FINANCIAL_DEMO_DATA = {
  company: FINANCIAL_COMPANY,
  executives: FINANCIAL_EXECUTIVES,
  deliberations: FINANCIAL_DELIBERATIONS,
  riskMetrics: FINANCIAL_RISK_METRICS,
  compliance: FINANCIAL_COMPLIANCE,
  fraudAlerts: FINANCIAL_FRAUD_ALERTS,
  trading: FINANCIAL_TRADING,
  decisionDebt: FINANCIAL_DECISION_DEBT,
  stressTests: FINANCIAL_STRESS_TESTS,
  auditTrail: FINANCIAL_AUDIT_TRAIL,
  dissents: FINANCIAL_DISSENTS,
  timelineEvents: FINANCIAL_TIMELINE_EVENTS,
  boardPersonas: FINANCIAL_BOARD_PERSONAS,
};

export default FINANCIAL_DEMO_DATA;
