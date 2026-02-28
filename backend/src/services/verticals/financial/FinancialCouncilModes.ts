// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA FINANCIAL SERVICES COUNCIL MODES
 *
 * Specialized deliberation modes for the Financial Services Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Regulatory Frameworks: Basel III/IV, SR 11-7, AML-BSA, MiFID II, Dodd-Frank
 */

// =============================================================================
// TYPES
// =============================================================================

export type FinancialModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'credit'          // Credit and lending modes
  | 'trading'         // Trading and markets modes
  | 'compliance'      // Regulatory compliance modes
  | 'risk'            // Risk management modes
  | 'specialized';    // Specialized financial modes

export interface FinancialCouncilMode {
  id: string;
  name: string;
  category: FinancialModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  regulatoryFrameworks: string[];
  modelRiskRequired: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_FINANCIAL_MODES: FinancialCouncilMode[] = [
  {
    id: 'credit-committee',
    name: 'Credit Committee',
    category: 'major',
    purpose: 'Full credit committee deliberation for major lending decisions. Multi-agent analysis with 5 Cs framework, PD/LGD/EAD calculation, and SR 11-7 model governance.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Large credit exposures, policy exceptions, concentration limit breaches',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'alpha-hunter', 'market-pulse'],
    optionalAgents: ['credit-analyst', 'portfolio-manager', 'workout-specialist'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['Basel III', 'Basel IV', 'SR 11-7', 'CECL'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Apply 5 Cs framework. Document model inputs. Stress test assumptions.',
    toneKeywords: ['credit-focused', 'model-validated', 'stress-tested', 'well-documented'],
    outputFormat: ['credit_analysis', 'risk_rating', 'model_validation', 'stress_scenarios', 'recommendation'],
  },
  {
    id: 'trade-approval-council',
    name: 'Trade Approval Council',
    category: 'major',
    purpose: 'Pre-trade compliance and risk review for significant transactions. Best execution, concentration limits, regulatory constraints.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Large trades, new counterparties, exotic instruments, limit breaches',
    defaultAgents: ['compliance-guardian', 'risk-sentinel', 'market-pulse', 'alpha-hunter'],
    optionalAgents: ['execution-specialist', 'counterparty-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['MiFID II', 'Dodd-Frank', 'Volcker Rule', 'MAR'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Best execution documented. Concentration checked. Regulatory constraints verified.',
    toneKeywords: ['pre-trade', 'compliant', 'best-execution', 'limit-aware'],
    outputFormat: ['trade_analysis', 'compliance_check', 'risk_metrics', 'execution_strategy', 'approval_decision'],
  },
  {
    id: 'aml-war-room',
    name: 'AML War Room',
    category: 'major',
    purpose: 'Suspicious activity investigation and SAR filing decisions. Transaction pattern analysis, network mapping, escalation decisions.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'SAR filings, high-risk customer reviews, regulatory inquiries, transaction monitoring alerts',
    defaultAgents: ['compliance-guardian', 'risk-sentinel', 'market-pulse'],
    optionalAgents: ['investigation-specialist', 'sanctions-analyst', 'kyc-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['BSA', 'AML', 'OFAC', 'FinCEN', 'FATF'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Pattern analysis complete. Network mapped. SAR decision documented with evidence.',
    toneKeywords: ['investigative', 'pattern-focused', 'evidence-based', 'sar-ready'],
    outputFormat: ['investigation_summary', 'transaction_analysis', 'network_diagram', 'sar_recommendation', 'evidence_package'],
  },
  {
    id: 'portfolio-review-council',
    name: 'Portfolio Review Council',
    category: 'major',
    purpose: 'Quarterly/annual portfolio review with rebalancing decisions. Drift analysis, suitability confirmation, tax optimization.',
    leadAgent: 'alpha-hunter',
    whenToUse: 'Quarterly reviews, significant drift, mandate changes, client life events',
    defaultAgents: ['alpha-hunter', 'risk-sentinel', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['tax-specialist', 'estate-planner', 'suitability-officer'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Reg BI', 'DOL Fiduciary', 'SEC Investment Advisers Act'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Drift quantified. Suitability confirmed. Tax-efficient execution planned.',
    toneKeywords: ['portfolio-focused', 'suitability-aware', 'tax-efficient', 'client-aligned'],
    outputFormat: ['portfolio_analysis', 'drift_report', 'rebalancing_plan', 'suitability_confirmation', 'tax_impact'],
  },
  {
    id: 'model-validation-council',
    name: 'Model Validation Council',
    category: 'major',
    purpose: 'SR 11-7 compliant model validation and governance. Independent review, backtesting, challenger models.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'New model deployment, annual model reviews, material model changes, regulatory exam prep',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'alpha-hunter'],
    optionalAgents: ['quant-analyst', 'model-developer', 'audit-specialist'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['SR 11-7', 'Basel III IRB', 'CCAR', 'DFAST'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Independent validation. Backtesting documented. Challenger model compared. Limitations disclosed.',
    toneKeywords: ['sr-11-7', 'independent', 'backtested', 'challenger-compared'],
    outputFormat: ['validation_report', 'backtest_results', 'challenger_comparison', 'limitation_disclosure', 'approval_decision'],
  },
];

// =============================================================================
// CREDIT AND LENDING MODES
// =============================================================================

export const CREDIT_MODES: FinancialCouncilMode[] = [
  {
    id: 'underwriting-review',
    name: 'Underwriting Review',
    category: 'credit',
    purpose: 'Individual loan underwriting with automated scorecard and manual override documentation.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Loan applications, renewals, modifications',
    defaultAgents: ['risk-sentinel', 'compliance-guardian'],
    optionalAgents: ['credit-analyst', 'collateral-specialist'],
    maxDeliberationRounds: 5,
    regulatoryFrameworks: ['ECOA', 'FCRA', 'TILA', 'RESPA'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Scorecard applied. Overrides documented. Fair lending checked.',
    toneKeywords: ['underwriting', 'scorecard', 'fair-lending', 'documented'],
    outputFormat: ['underwriting_decision', 'scorecard_output', 'override_justification', 'fair_lending_check'],
  },
  {
    id: 'concentration-review',
    name: 'Concentration Review',
    category: 'credit',
    purpose: 'Portfolio concentration limit monitoring and exception approvals.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Limit breaches, new large exposures, industry concentration',
    defaultAgents: ['risk-sentinel', 'alpha-hunter', 'compliance-guardian'],
    optionalAgents: ['portfolio-manager', 'sector-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Basel III', 'OCC Guidelines', 'Interagency CRE Guidance'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Concentration measured. Limit status documented. Mitigation planned if breached.',
    toneKeywords: ['concentration', 'limit-aware', 'diversification', 'mitigation'],
    outputFormat: ['concentration_report', 'limit_status', 'mitigation_plan', 'exception_approval'],
  },
  {
    id: 'workout-council',
    name: 'Workout Council',
    category: 'credit',
    purpose: 'Troubled debt restructuring and workout strategy. NPL management, recovery optimization.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Delinquent loans, TDR decisions, foreclosure alternatives',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'alpha-hunter'],
    optionalAgents: ['workout-specialist', 'legal-counsel', 'collateral-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['GAAP TDR', 'CECL', 'OCC Workout Guidelines'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Recovery maximized. TDR accounting assessed. Borrower capacity analyzed.',
    toneKeywords: ['workout', 'recovery-focused', 'tdr-aware', 'borrower-capacity'],
    outputFormat: ['workout_strategy', 'recovery_analysis', 'tdr_assessment', 'restructuring_terms'],
  },
  {
    id: 'syndication-review',
    name: 'Syndication Review',
    category: 'credit',
    purpose: 'Syndicated loan participation decisions. Lead arranger analysis, allocation strategy.',
    leadAgent: 'alpha-hunter',
    whenToUse: 'Syndicated loan opportunities, club deals, participation purchases',
    defaultAgents: ['alpha-hunter', 'risk-sentinel', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['syndication-specialist', 'credit-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Leveraged Lending Guidance', 'Basel III'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Lead arranger assessed. Terms analyzed. Allocation optimized.',
    toneKeywords: ['syndication', 'arranger-focused', 'allocation', 'leveraged-lending'],
    outputFormat: ['participation_analysis', 'arranger_assessment', 'allocation_recommendation', 'risk_rating'],
  },
];

// =============================================================================
// TRADING AND MARKETS MODES
// =============================================================================

export const TRADING_MODES: FinancialCouncilMode[] = [
  {
    id: 'execution-strategy',
    name: 'Execution Strategy',
    category: 'trading',
    purpose: 'Optimal execution strategy for large orders. Algo selection, venue analysis, market impact.',
    leadAgent: 'market-pulse',
    whenToUse: 'Large orders, illiquid securities, complex execution requirements',
    defaultAgents: ['market-pulse', 'alpha-hunter', 'compliance-guardian'],
    optionalAgents: ['execution-specialist', 'quant-analyst'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['MiFID II Best Execution', 'Reg NMS', 'Rule 606'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Best execution achieved. Market impact minimized. Algo selection documented.',
    toneKeywords: ['execution', 'best-execution', 'algo-aware', 'impact-minimized'],
    outputFormat: ['execution_plan', 'algo_recommendation', 'venue_analysis', 'impact_estimate'],
  },
  {
    id: 'derivatives-review',
    name: 'Derivatives Review',
    category: 'trading',
    purpose: 'OTC derivatives approval and hedging strategy. CVA/DVA analysis, collateral optimization.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'New derivatives trades, hedge accounting, counterparty exposure management',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'market-pulse', 'alpha-hunter'],
    optionalAgents: ['quant-analyst', 'collateral-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Dodd-Frank', 'EMIR', 'Basel III SA-CCR', 'ASC 815'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'CVA/DVA calculated. Collateral optimized. Hedge effectiveness documented.',
    toneKeywords: ['derivatives', 'cva-dva', 'hedge-accounting', 'collateral-aware'],
    outputFormat: ['trade_analysis', 'risk_metrics', 'cva_dva_calculation', 'hedge_documentation'],
  },
  {
    id: 'market-making-council',
    name: 'Market Making Council',
    category: 'trading',
    purpose: 'Market making strategy and inventory management. Spread optimization, risk limits.',
    leadAgent: 'market-pulse',
    whenToUse: 'Inventory limit reviews, spread adjustments, new market entry',
    defaultAgents: ['market-pulse', 'risk-sentinel', 'alpha-hunter'],
    optionalAgents: ['quant-analyst', 'execution-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['Volcker Rule', 'MiFID II Market Making', 'SEC Rule 15c3-1'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Inventory managed. Spreads optimized. Volcker compliance verified.',
    toneKeywords: ['market-making', 'inventory', 'spread-optimization', 'volcker-compliant'],
    outputFormat: ['inventory_analysis', 'spread_recommendation', 'risk_limits', 'compliance_check'],
  },
  {
    id: 'counterparty-review',
    name: 'Counterparty Review',
    category: 'trading',
    purpose: 'Counterparty credit risk assessment and limit setting. PFE analysis, wrong-way risk.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'New counterparty onboarding, limit reviews, credit events',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['credit-analyst', 'legal-counsel'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Basel III CCR', 'SA-CCR', 'ISDA Master Agreement'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'PFE calculated. Wrong-way risk assessed. Limits set with buffer.',
    toneKeywords: ['counterparty', 'pfe', 'wrong-way-risk', 'limit-setting'],
    outputFormat: ['counterparty_analysis', 'pfe_calculation', 'limit_recommendation', 'documentation_check'],
  },
];

// =============================================================================
// COMPLIANCE AND REGULATORY MODES
// =============================================================================

export const COMPLIANCE_MODES: FinancialCouncilMode[] = [
  {
    id: 'regulatory-exam-prep',
    name: 'Regulatory Exam Prep',
    category: 'compliance',
    purpose: 'Preparation for regulatory examinations. Gap analysis, document preparation, response strategy.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Upcoming exams (OCC, Fed, SEC, FINRA), MRAs, consent orders',
    defaultAgents: ['compliance-guardian', 'risk-sentinel', 'alpha-hunter'],
    optionalAgents: ['legal-counsel', 'audit-specialist', 'documentation-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['All applicable frameworks'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Gaps identified. Documents ready. Response strategy prepared.',
    toneKeywords: ['exam-ready', 'gap-analyzed', 'documented', 'proactive'],
    outputFormat: ['gap_analysis', 'document_inventory', 'response_strategy', 'timeline'],
  },
  {
    id: 'sanctions-screening',
    name: 'Sanctions Screening',
    category: 'compliance',
    purpose: 'OFAC sanctions screening and potential match resolution. False positive analysis.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Potential sanctions matches, new customer onboarding, periodic rescreening',
    defaultAgents: ['compliance-guardian', 'risk-sentinel'],
    optionalAgents: ['sanctions-analyst', 'kyc-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['OFAC', 'EU Sanctions', 'UN Sanctions', 'CAATSA'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Match analyzed. False positive documented. True match escalated immediately.',
    toneKeywords: ['sanctions', 'ofac', 'match-resolution', 'zero-tolerance'],
    outputFormat: ['match_analysis', 'resolution_decision', 'escalation_if_true', 'documentation'],
  },
  {
    id: 'fair-lending-review',
    name: 'Fair Lending Review',
    category: 'compliance',
    purpose: 'Fair lending analysis and disparate impact testing. HMDA analysis, exception monitoring.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Fair lending exams, HMDA submissions, pricing exception reviews',
    defaultAgents: ['compliance-guardian', 'risk-sentinel'],
    optionalAgents: ['fair-lending-specialist', 'statistical-analyst'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['ECOA', 'Fair Housing Act', 'HMDA', 'CRA'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Disparate impact tested. Exceptions analyzed. Remediation planned if needed.',
    toneKeywords: ['fair-lending', 'disparate-impact', 'hmda', 'exception-focused'],
    outputFormat: ['fair_lending_analysis', 'disparate_impact_test', 'exception_review', 'remediation_plan'],
  },
  {
    id: 'reg-reporting-council',
    name: 'Regulatory Reporting Council',
    category: 'compliance',
    purpose: 'Regulatory report preparation and quality assurance. Call reports, FR Y-9C, CCAR.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Quarterly/annual regulatory filings, restatements, new reporting requirements',
    defaultAgents: ['compliance-guardian', 'risk-sentinel', 'alpha-hunter'],
    optionalAgents: ['reporting-specialist', 'data-quality-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Call Report', 'FR Y-9C', 'CCAR', 'DFAST', 'FR 2052a'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Data validated. Reconciliations complete. Attestations supported.',
    toneKeywords: ['regulatory-reporting', 'data-quality', 'reconciled', 'attestation-ready'],
    outputFormat: ['report_review', 'data_validation', 'reconciliation_summary', 'attestation_support'],
  },
  {
    id: 'consumer-complaint-review',
    name: 'Consumer Complaint Review',
    category: 'compliance',
    purpose: 'Consumer complaint analysis and root cause identification. CFPB response preparation.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'CFPB complaints, BBB escalations, complaint trends',
    defaultAgents: ['compliance-guardian', 'risk-sentinel'],
    optionalAgents: ['customer-service-lead', 'legal-counsel'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['CFPB', 'UDAAP', 'UDAP', 'State AG'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Root cause identified. UDAAP risk assessed. Response timely and complete.',
    toneKeywords: ['complaint-focused', 'root-cause', 'udaap-aware', 'customer-centric'],
    outputFormat: ['complaint_analysis', 'root_cause', 'response_draft', 'remediation_recommendation'],
  },
];

// =============================================================================
// RISK MANAGEMENT MODES
// =============================================================================

export const RISK_MODES: FinancialCouncilMode[] = [
  {
    id: 'stress-testing-council',
    name: 'Stress Testing Council',
    category: 'risk',
    purpose: 'Enterprise stress testing scenario development and analysis. CCAR/DFAST preparation.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Annual CCAR/DFAST, internal stress testing, scenario updates',
    defaultAgents: ['risk-sentinel', 'alpha-hunter', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['quant-analyst', 'economics-specialist', 'capital-planner'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['CCAR', 'DFAST', 'Basel III Pillar 2', 'EBA Stress Tests'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Scenarios severe but plausible. Models validated. Capital impact quantified.',
    toneKeywords: ['stress-testing', 'scenario-based', 'capital-focused', 'severe-plausible'],
    outputFormat: ['scenario_definition', 'model_outputs', 'capital_impact', 'management_actions'],
  },
  {
    id: 'liquidity-review',
    name: 'Liquidity Review',
    category: 'risk',
    purpose: 'Liquidity risk management and contingency funding. LCR/NSFR monitoring, stress scenarios.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Daily liquidity monitoring, contingency funding activation, regulatory reviews',
    defaultAgents: ['risk-sentinel', 'market-pulse', 'compliance-guardian'],
    optionalAgents: ['treasury-specialist', 'funding-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Basel III LCR', 'Basel III NSFR', 'FR 2052a', 'Resolution Planning'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'LCR/NSFR monitored. Stress scenarios run. Contingency funding ready.',
    toneKeywords: ['liquidity', 'lcr-nsfr', 'contingency', 'funding-aware'],
    outputFormat: ['liquidity_report', 'stress_results', 'contingency_status', 'action_items'],
  },
  {
    id: 'operational-risk-council',
    name: 'Operational Risk Council',
    category: 'risk',
    purpose: 'Operational risk event analysis and RCSA updates. Loss event review, control assessment.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Significant op risk events, RCSA cycles, control failures',
    defaultAgents: ['risk-sentinel', 'compliance-guardian'],
    optionalAgents: ['operational-risk-specialist', 'audit-specialist', 'technology-risk-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Basel III AMA/SMA', 'OCC Heightened Standards', 'FFIEC'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Root cause analyzed. Controls assessed. Remediation tracked.',
    toneKeywords: ['operational-risk', 'rcsa', 'control-focused', 'remediation'],
    outputFormat: ['event_analysis', 'root_cause', 'control_assessment', 'remediation_plan'],
  },
  {
    id: 'market-risk-council',
    name: 'Market Risk Council',
    category: 'risk',
    purpose: 'Market risk limit monitoring and VaR backtesting. Limit breach review, model performance.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'VaR breaches, limit exceptions, model backtesting failures',
    defaultAgents: ['risk-sentinel', 'market-pulse', 'alpha-hunter'],
    optionalAgents: ['quant-analyst', 'trading-desk-head'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Basel III FRTB', 'VaR Backtesting', 'Stressed VaR'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'VaR explained. Backtesting analyzed. Limits reviewed.',
    toneKeywords: ['market-risk', 'var', 'backtesting', 'limit-management'],
    outputFormat: ['var_analysis', 'backtest_results', 'limit_review', 'exception_approval'],
  },
  {
    id: 'capital-planning-council',
    name: 'Capital Planning Council',
    category: 'risk',
    purpose: 'Capital adequacy planning and optimization. RWA management, capital actions.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Capital planning cycle, dividend decisions, capital raise evaluation',
    defaultAgents: ['risk-sentinel', 'alpha-hunter', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['capital-planner', 'treasury-specialist', 'investor-relations'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Basel III CET1', 'CCAR', 'Total Loss Absorbing Capacity'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Capital ratios projected. RWA optimized. Actions aligned with strategy.',
    toneKeywords: ['capital-planning', 'cet1', 'rwa-optimization', 'strategic'],
    outputFormat: ['capital_projection', 'rwa_analysis', 'action_recommendation', 'board_presentation'],
  },
];

// =============================================================================
// SPECIALIZED FINANCIAL MODES
// =============================================================================

export const SPECIALIZED_FINANCIAL_MODES: FinancialCouncilMode[] = [
  {
    id: 'private-equity-review',
    name: 'Private Equity Review',
    category: 'specialized',
    purpose: 'PE/VC investment evaluation. Due diligence, valuation, governance rights.',
    leadAgent: 'alpha-hunter',
    whenToUse: 'PE fund investments, direct investments, co-investments',
    defaultAgents: ['alpha-hunter', 'risk-sentinel', 'compliance-guardian'],
    optionalAgents: ['pe-specialist', 'valuation-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['SEC Investment Advisers Act', 'Volcker Rule PE Exemptions'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Valuation validated. Governance rights secured. Exit strategy clear.',
    toneKeywords: ['private-equity', 'valuation', 'governance', 'exit-strategy'],
    outputFormat: ['investment_memo', 'valuation_analysis', 'governance_terms', 'exit_scenarios'],
  },
  {
    id: 'wealth-suitability-council',
    name: 'Wealth Suitability Council',
    category: 'specialized',
    purpose: 'High-net-worth client suitability review. Complex product approval, concentration limits.',
    leadAgent: 'alpha-hunter',
    whenToUse: 'Complex product recommendations, concentrated positions, alternative investments',
    defaultAgents: ['alpha-hunter', 'compliance-guardian', 'risk-sentinel'],
    optionalAgents: ['suitability-officer', 'estate-planner', 'tax-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Reg BI', 'FINRA Suitability', 'SEC Fiduciary'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Suitability documented. Concentration acknowledged. Client understanding verified.',
    toneKeywords: ['suitability', 'hnw-focused', 'concentration-aware', 'client-understanding'],
    outputFormat: ['suitability_analysis', 'product_assessment', 'client_profile', 'recommendation'],
  },
  {
    id: 'structured-product-council',
    name: 'Structured Product Council',
    category: 'specialized',
    purpose: 'Structured product creation and approval. Pricing validation, disclosure review.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'New structured products, pricing reviews, disclosure updates',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'market-pulse', 'alpha-hunter'],
    optionalAgents: ['quant-analyst', 'legal-counsel', 'documentation-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['SEC Structured Products', 'FINRA Rules', 'OCC Bulletin 2011-12'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Pricing validated. Risks disclosed. Suitability framework applied.',
    toneKeywords: ['structured-products', 'pricing', 'disclosure', 'complexity-aware'],
    outputFormat: ['product_analysis', 'pricing_validation', 'disclosure_review', 'approval_decision'],
  },
  {
    id: 'fiduciary-review',
    name: 'Fiduciary Review',
    category: 'specialized',
    purpose: 'ERISA fiduciary decisions for retirement plans. Investment policy, fee reasonableness.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'Retirement plan decisions, ERISA compliance, fee negotiations',
    defaultAgents: ['compliance-guardian', 'alpha-hunter', 'risk-sentinel'],
    optionalAgents: ['erisa-specialist', 'fee-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['ERISA', 'DOL Fiduciary Rule', 'PTE 2020-02'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Prudent process documented. Fees benchmarked. Conflicts disclosed.',
    toneKeywords: ['fiduciary', 'erisa', 'prudent-process', 'fee-reasonable'],
    outputFormat: ['fiduciary_analysis', 'fee_benchmarking', 'conflict_disclosure', 'documentation'],
  },
  {
    id: 'fintech-partnership-review',
    name: 'Fintech Partnership Review',
    category: 'specialized',
    purpose: 'Third-party fintech partnership due diligence. Vendor risk, regulatory implications.',
    leadAgent: 'compliance-guardian',
    whenToUse: 'New fintech partnerships, BaaS arrangements, API integrations',
    defaultAgents: ['compliance-guardian', 'risk-sentinel', 'market-pulse'],
    optionalAgents: ['technology-risk-analyst', 'legal-counsel', 'vendor-manager'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['OCC Third-Party Guidance', 'FFIEC Outsourcing', 'State Banking Laws'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Vendor risk assessed. Regulatory approval path clear. Exit strategy defined.',
    toneKeywords: ['fintech', 'vendor-risk', 'baas', 'partnership'],
    outputFormat: ['due_diligence_report', 'risk_assessment', 'regulatory_path', 'contract_review'],
  },
  {
    id: 'crypto-custody-council',
    name: 'Crypto Custody Council',
    category: 'specialized',
    purpose: 'Digital asset custody and trading decisions. Regulatory uncertainty, operational risk.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Crypto custody services, digital asset trading, DeFi exposure',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['crypto-specialist', 'technology-risk-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['OCC Interpretive Letters', 'SEC Digital Assets', 'State Money Transmitter'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Custody controls verified. Regulatory position documented. Operational risk managed.',
    toneKeywords: ['crypto', 'custody', 'digital-assets', 'regulatory-uncertainty'],
    outputFormat: ['custody_assessment', 'regulatory_analysis', 'operational_controls', 'risk_decision'],
  },
  {
    id: 'esg-investment-council',
    name: 'ESG Investment Council',
    category: 'specialized',
    purpose: 'ESG investment strategy and greenwashing risk. Disclosure compliance, impact measurement.',
    leadAgent: 'alpha-hunter',
    whenToUse: 'ESG product launches, sustainability claims, impact reporting',
    defaultAgents: ['alpha-hunter', 'compliance-guardian', 'risk-sentinel'],
    optionalAgents: ['esg-specialist', 'disclosure-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['SEC ESG Disclosure', 'EU SFDR', 'TCFD'],
    modelRiskRequired: false,
    auditTrailRequired: true,
    primeDirective: 'Claims substantiated. Greenwashing risk managed. Impact measured.',
    toneKeywords: ['esg', 'sustainability', 'greenwashing-aware', 'impact-focused'],
    outputFormat: ['esg_analysis', 'disclosure_review', 'impact_metrics', 'recommendation'],
  },
  {
    id: 'payment-fraud-council',
    name: 'Payment Fraud Council',
    category: 'specialized',
    purpose: 'Payment fraud investigation and prevention strategy. Real-time decisioning, loss recovery.',
    leadAgent: 'risk-sentinel',
    whenToUse: 'Fraud alerts, pattern detection, loss events, rule tuning',
    defaultAgents: ['risk-sentinel', 'compliance-guardian', 'market-pulse'],
    optionalAgents: ['fraud-analyst', 'investigation-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['Reg E', 'NACHA Rules', 'Card Network Rules'],
    modelRiskRequired: true,
    auditTrailRequired: true,
    primeDirective: 'Fraud detected quickly. Customer impact minimized. Recovery pursued.',
    toneKeywords: ['fraud', 'payment', 'real-time', 'recovery'],
    outputFormat: ['fraud_analysis', 'pattern_identification', 'rule_recommendation', 'recovery_plan'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_FINANCIAL_MODES: FinancialCouncilMode[] = [
  ...MAJOR_FINANCIAL_MODES,
  ...CREDIT_MODES,
  ...TRADING_MODES,
  ...COMPLIANCE_MODES,
  ...RISK_MODES,
  ...SPECIALIZED_FINANCIAL_MODES,
];

export const FINANCIAL_MODE_MAP: Map<string, FinancialCouncilMode> = new Map(
  ALL_FINANCIAL_MODES.map(mode => [mode.id, mode])
);

/**
 * Get a financial mode by ID
 */
export function getFinancialMode(modeId: string): FinancialCouncilMode | undefined {
  return FINANCIAL_MODE_MAP.get(modeId);
}

/**
 * Get all financial modes by category
 */
export function getFinancialModesByCategory(category: FinancialModeCategory): FinancialCouncilMode[] {
  return ALL_FINANCIAL_MODES.filter(mode => mode.category === category);
}

/**
 * Get all financial modes requiring model validation
 */
export function getModelRiskModes(): FinancialCouncilMode[] {
  return ALL_FINANCIAL_MODES.filter(mode => mode.modelRiskRequired);
}

/**
 * Get financial modes by regulatory framework
 */
export function getFinancialModesByFramework(framework: string): FinancialCouncilMode[] {
  return ALL_FINANCIAL_MODES.filter(mode => 
    mode.regulatoryFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

/**
 * Get financial modes by lead agent
 */
export function getFinancialModesByLeadAgent(leadAgent: string): FinancialCouncilMode[] {
  return ALL_FINANCIAL_MODES.filter(mode => mode.leadAgent === leadAgent);
}

// Summary stats
export const FINANCIAL_MODES_SUMMARY = {
  totalModes: ALL_FINANCIAL_MODES.length,
  majorModes: MAJOR_FINANCIAL_MODES.length,
  creditModes: CREDIT_MODES.length,
  tradingModes: TRADING_MODES.length,
  complianceModes: COMPLIANCE_MODES.length,
  riskModes: RISK_MODES.length,
  specializedModes: SPECIALIZED_FINANCIAL_MODES.length,
  modelRiskModes: ALL_FINANCIAL_MODES.filter(m => m.modelRiskRequired).length,
};
