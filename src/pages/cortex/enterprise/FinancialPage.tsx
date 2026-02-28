// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA FINANCIAL™ - BANKING & FINANCIAL SERVICES PACK
// AI-Powered Financial Decision Intelligence
// "Enterprise Decision Intelligence for the Financial Sector"
//
// CAPABILITIES:
// - Risk assessment & credit scoring
// - Fraud detection & prevention
// - Regulatory compliance (SOX, Basel III, DORA)
// - Portfolio optimization
// - Market risk analysis
// - AML/KYC automation
// - Trading decision support
// - Stress testing & scenario analysis
// =============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';
import { 
  FINANCIAL_COMPANY, 
  FINANCIAL_RISK_METRICS, 
  FINANCIAL_COMPLIANCE, 
  FINANCIAL_FRAUD_ALERTS,
  FINANCIAL_TRADING,
  FINANCIAL_STRESS_TESTS 
} from '../../../data/financialDemoData';

// =============================================================================
// TYPES
// =============================================================================

type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'minimal';
type AssetClass = 'equities' | 'fixed-income' | 'derivatives' | 'commodities' | 'forex' | 'crypto' | 'alternatives';
type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'pending-review';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  status: RiskLevel;
  lastUpdated: Date;
}

interface Portfolio {
  id: string;
  name: string;
  aum: number;
  returns: number;
  volatility: number;
  sharpeRatio: number;
  var95: number;
  assetAllocation: { class: AssetClass; percentage: number }[];
  riskScore: number;
}

interface FraudAlert {
  id: string;
  type: string;
  severity: RiskLevel;
  amount: number;
  accountId: string;
  timestamp: Date;
  confidence: number;
  status: 'investigating' | 'confirmed' | 'cleared' | 'escalated';
  indicators: string[];
}

interface ComplianceItem {
  id: string;
  framework: string;
  requirement: string;
  status: ComplianceStatus;
  dueDate: Date;
  owner: string;
  lastAudit: Date;
  findings: number;
}

interface MarketSignal {
  id: string;
  asset: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasoning: string[];
  timeframe: string;
}

interface StressTest {
  id: string;
  name: string;
  scenario: string;
  impactPnL: number;
  impactCapital: number;
  probability: number;
  status: 'passed' | 'warning' | 'failed';
  lastRun: Date;
}

interface FinancialMetrics {
  totalAUM: number;
  avgReturns: number;
  riskScore: number;
  complianceScore: number;
  fraudPrevented: number;
  activeAlerts: number;
  pendingReviews: number;
  capitalRatio: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const ASSET_CONFIG: Record<AssetClass, { icon: string; color: string; name: string }> = {
  equities: { icon: '📈', color: 'from-blue-600 to-indigo-600', name: 'Equities' },
  'fixed-income': { icon: '📊', color: 'from-green-600 to-emerald-600', name: 'Fixed Income' },
  derivatives: { icon: '📉', color: 'from-purple-600 to-pink-600', name: 'Derivatives' },
  commodities: { icon: '🛢️', color: 'from-amber-600 to-orange-600', name: 'Commodities' },
  forex: { icon: '💱', color: 'from-cyan-600 to-blue-600', name: 'Forex' },
  crypto: { icon: '₿', color: 'from-yellow-600 to-amber-600', name: 'Crypto' },
  alternatives: { icon: '🏢', color: 'from-slate-600 to-zinc-600', name: 'Alternatives' },
};

const generateRiskMetrics = (): RiskMetric[] => [
  {
    id: 'var-daily',
    name: 'Daily VaR (95%)',
    value: 2.4,
    threshold: 3.0,
    trend: 'stable',
    status: 'moderate',
    lastUpdated: new Date(),
  },
  {
    id: 'credit-exposure',
    name: 'Credit Exposure',
    value: 78,
    threshold: 85,
    trend: 'up',
    status: 'moderate',
    lastUpdated: new Date(),
  },
  {
    id: 'liquidity-ratio',
    name: 'Liquidity Coverage',
    value: 142,
    threshold: 100,
    trend: 'stable',
    status: 'low',
    lastUpdated: new Date(),
  },
  {
    id: 'capital-adequacy',
    name: 'Capital Adequacy',
    value: 14.2,
    threshold: 10.5,
    trend: 'up',
    status: 'low',
    lastUpdated: new Date(),
  },
];

const generatePortfolios = (): Portfolio[] => [
  {
    id: 'port-001',
    name: 'Global Growth Fund',
    aum: 4500000000,
    returns: 12.4,
    volatility: 14.2,
    sharpeRatio: 1.42,
    var95: 2.8,
    assetAllocation: [
      { class: 'equities', percentage: 65 },
      { class: 'fixed-income', percentage: 20 },
      { class: 'alternatives', percentage: 10 },
      { class: 'commodities', percentage: 5 },
    ],
    riskScore: 68,
  },
  {
    id: 'port-002',
    name: 'Conservative Income',
    aum: 2800000000,
    returns: 5.8,
    volatility: 6.4,
    sharpeRatio: 0.98,
    var95: 1.2,
    assetAllocation: [
      { class: 'fixed-income', percentage: 70 },
      { class: 'equities', percentage: 20 },
      { class: 'alternatives', percentage: 10 },
    ],
    riskScore: 32,
  },
  {
    id: 'port-003',
    name: 'Emerging Markets',
    aum: 1200000000,
    returns: 18.2,
    volatility: 22.5,
    sharpeRatio: 1.15,
    var95: 4.5,
    assetAllocation: [
      { class: 'equities', percentage: 80 },
      { class: 'forex', percentage: 10 },
      { class: 'commodities', percentage: 10 },
    ],
    riskScore: 85,
  },
];

const generateFraudAlerts = (): FraudAlert[] => [
  {
    id: 'fraud-001',
    type: 'Unusual Transaction Pattern',
    severity: 'high',
    amount: 2450000,
    accountId: 'ACC-78291',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    confidence: 0.89,
    status: 'investigating',
    indicators: ['Velocity spike', 'New beneficiary', 'Off-hours activity'],
  },
  {
    id: 'fraud-002',
    type: 'Account Takeover Attempt',
    severity: 'critical',
    amount: 0,
    accountId: 'ACC-45123',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    confidence: 0.94,
    status: 'escalated',
    indicators: ['Multiple failed logins', 'Device fingerprint mismatch', 'Geo-anomaly'],
  },
  {
    id: 'fraud-003',
    type: 'Potential Money Laundering',
    severity: 'high',
    amount: 890000,
    accountId: 'ACC-92847',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    confidence: 0.76,
    status: 'investigating',
    indicators: ['Structuring pattern', 'Shell company links', 'High-risk jurisdiction'],
  },
];

const generateComplianceItems = (): ComplianceItem[] => [
  {
    id: 'comp-001',
    framework: 'SOX',
    requirement: 'Internal Controls Assessment',
    status: 'compliant',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    owner: 'CFO Office',
    lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    findings: 0,
  },
  {
    id: 'comp-002',
    framework: 'Basel III',
    requirement: 'Capital Adequacy Reporting',
    status: 'compliant',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    owner: 'Risk Management',
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    findings: 1,
  },
  {
    id: 'comp-003',
    framework: 'DORA',
    requirement: 'ICT Risk Management',
    status: 'warning',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    owner: 'IT Security',
    lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    findings: 3,
  },
  {
    id: 'comp-004',
    framework: 'AML/KYC',
    requirement: 'Customer Due Diligence',
    status: 'pending-review',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    owner: 'Compliance',
    lastAudit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    findings: 2,
  },
];

const generateMarketSignals = (): MarketSignal[] => [
  {
    id: 'sig-001',
    asset: 'S&P 500 ETF',
    signal: 'hold',
    confidence: 0.72,
    priceTarget: 485,
    currentPrice: 478,
    reasoning: ['Overbought RSI', 'Earnings season volatility', 'Fed uncertainty'],
    timeframe: '30 days',
  },
  {
    id: 'sig-002',
    asset: 'US 10Y Treasury',
    signal: 'buy',
    confidence: 0.81,
    priceTarget: 4.2,
    currentPrice: 4.5,
    reasoning: ['Yield curve normalization', 'Inflation cooling', 'Flight to safety'],
    timeframe: '60 days',
  },
  {
    id: 'sig-003',
    asset: 'EUR/USD',
    signal: 'sell',
    confidence: 0.68,
    priceTarget: 1.05,
    currentPrice: 1.08,
    reasoning: ['ECB dovish pivot', 'US growth outperformance', 'Rate differential'],
    timeframe: '45 days',
  },
];

const generateStressTests = (): StressTest[] => [
  {
    id: 'stress-001',
    name: '2008 Financial Crisis',
    scenario: 'Severe market downturn with credit freeze',
    impactPnL: -18.5,
    impactCapital: -4.2,
    probability: 0.05,
    status: 'passed',
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'stress-002',
    name: 'Interest Rate Shock',
    scenario: '+300bps sudden rate increase',
    impactPnL: -8.2,
    impactCapital: -2.1,
    probability: 0.15,
    status: 'passed',
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'stress-003',
    name: 'Cyber Attack',
    scenario: 'Major operational disruption',
    impactPnL: -3.5,
    impactCapital: -0.8,
    probability: 0.10,
    status: 'warning',
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

const calculateMetrics = (): FinancialMetrics => ({
  totalAUM: 8500000000,
  avgReturns: 11.2,
  riskScore: 58,
  complianceScore: 94,
  fraudPrevented: 12500000,
  activeAlerts: 8,
  pendingReviews: 12,
  capitalRatio: 14.2,
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const FinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'risk' | 'portfolios' | 'fraud' | 'compliance' | 'trading'
  >('overview');
  const [riskMetrics] = useState<RiskMetric[]>(generateRiskMetrics);
  const [portfolios] = useState<Portfolio[]>(generatePortfolios);
  const [fraudAlerts] = useState<FraudAlert[]>(generateFraudAlerts);
  const [complianceItems] = useState<ComplianceItem[]>(generateComplianceItems);
  const [marketSignals] = useState<MarketSignal[]>(generateMarketSignals);
  const [stressTests] = useState<StressTest[]>(generateStressTests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const [regulatoryRes, preMortemRes] = await Promise.all([
          decisionIntelApi.getRegulatoryItems(),
          decisionIntelApi.getPreMortemAnalyses(),
        ]);

        if (regulatoryRes.success && regulatoryRes.data) {
          console.log('[Financial] Loaded', regulatoryRes.data.length, 'regulatory items');
        }
        if (preMortemRes.success && preMortemRes.data) {
          console.log('[Financial] Loaded', preMortemRes.data.length, 'risk analyses');
        }
      } catch (error) {
        console.log('[Financial] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancialData();
  }, []);

  const metrics = useMemo(() => calculateMetrics(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">💰</span>
                  CendiaFinancial™
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 rounded-full font-medium">
                    BANKING
                  </span>
                </h1>
                <p className="text-emerald-300 text-sm">
                  Banking & Financial Services Pack • SOX/Basel III Compliant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">🔒 SOX Compliant</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Total AUM</div>
                <div className="text-xl font-bold text-emerald-400">
                  ${(metrics.totalAUM / 1e9).toFixed(1)}B
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                ${(metrics.totalAUM / 1e9).toFixed(1)}B
              </div>
              <div className="text-xs text-emerald-300">Total AUM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.avgReturns}%</div>
              <div className="text-xs text-emerald-300">Avg Returns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.riskScore}</div>
              <div className="text-xs text-emerald-300">Risk Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.complianceScore}%</div>
              <div className="text-xs text-emerald-300">Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                ${(metrics.fraudPrevented / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-emerald-300">Fraud Prevented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.activeAlerts}</div>
              <div className="text-xs text-emerald-300">Active Alerts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{metrics.pendingReviews}</div>
              <div className="text-xs text-emerald-300">Pending Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{metrics.capitalRatio}%</div>
              <div className="text-xs text-emerald-300">Capital Ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-emerald-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'risk', label: 'Risk Management', icon: '⚠️' },
              { id: 'portfolios', label: 'Portfolios', icon: '💼' },
              { id: 'fraud', label: 'Fraud Detection', icon: '🚨' },
              { id: 'compliance', label: 'Compliance', icon: '📋' },
              { id: 'trading', label: 'Trading Signals', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-white bg-emerald-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Fraud Alerts */}
                <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-red-400">🚨</span> Active Fraud Alerts
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {fraudAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border ${
                          alert.severity === 'critical'
                            ? 'bg-red-900/20 border-red-700/50'
                            : alert.severity === 'high'
                              ? 'bg-amber-900/20 border-amber-700/50'
                              : 'bg-yellow-900/20 border-yellow-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-white/60">{alert.accountId}</span>
                          <span
                            className={`text-sm font-bold px-2 py-0.5 rounded ${
                              alert.severity === 'critical'
                                ? 'bg-red-600'
                                : alert.severity === 'high'
                                  ? 'bg-amber-600'
                                  : 'bg-yellow-600'
                            }`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{alert.type}</h4>
                        {alert.amount > 0 && (
                          <div className="text-lg font-bold text-white mb-2">
                            ${alert.amount.toLocaleString()}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {alert.indicators.slice(0, 2).map((ind) => (
                            <span key={ind} className="text-xs px-2 py-0.5 bg-black/30 rounded">
                              {ind}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-white/40">
                          Confidence: {(alert.confidence * 100).toFixed(0)}% • {alert.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Classes */}
                <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                  <h2 className="text-lg font-semibold mb-4">Asset Classes</h2>
                  <div className="grid grid-cols-7 gap-4">
                    {(
                      Object.entries(ASSET_CONFIG) as [
                        AssetClass,
                        (typeof ASSET_CONFIG)[AssetClass],
                      ][]
                    ).map(([key, config]) => (
                      <div
                        key={key}
                        className="text-center p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}
                        >
                          {config.icon}
                        </div>
                        <div className="font-medium text-sm">{config.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Risk Metrics */}
                  <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                    <h3 className="text-lg font-semibold mb-4">Key Risk Metrics</h3>
                    <div className="space-y-3">
                      {riskMetrics.map((metric) => (
                        <div key={metric.id} className="p-4 bg-black/20 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{metric.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                metric.status === 'low'
                                  ? 'bg-green-600'
                                  : metric.status === 'moderate'
                                    ? 'bg-amber-600'
                                    : 'bg-red-600'
                              }`}
                            >
                              {metric.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-2xl font-bold">{metric.value}%</span>
                            <span className="text-white/60">Threshold: {metric.threshold}%</span>
                          </div>
                          <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                metric.value < metric.threshold ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Status */}
                  <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                    <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                    <div className="space-y-3">
                      {complianceItems.map((item) => (
                        <div key={item.id} className="p-4 bg-black/20 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">{item.framework}</span>
                              <span className="ml-2 text-xs text-white/60">{item.requirement}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                item.status === 'compliant'
                                  ? 'bg-green-600'
                                  : item.status === 'warning'
                                    ? 'bg-amber-600'
                                    : item.status === 'pending-review'
                                      ? 'bg-blue-600'
                                      : 'bg-red-600'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-white/60">
                            <span>Owner: {item.owner}</span>
                            <span>{item.findings} findings</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolios' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
                  <h2 className="text-lg font-semibold mb-2">💼 Portfolio Intelligence</h2>
                  <p className="text-white/60">
                    AI-powered portfolio optimization, risk analysis, and performance attribution.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{portfolio.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            portfolio.riskScore > 70
                              ? 'bg-red-600'
                              : portfolio.riskScore > 40
                                ? 'bg-amber-600'
                                : 'bg-green-600'
                          }`}
                        >
                          Risk Score: {portfolio.riskScore}
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-4 mb-4">
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-emerald-400">
                            ${(portfolio.aum / 1e9).toFixed(2)}B
                          </div>
                          <div className="text-xs text-white/50">AUM</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className={`text-xl font-bold ${portfolio.returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {portfolio.returns >= 0 ? '+' : ''}{portfolio.returns}%
                          </div>
                          <div className="text-xs text-white/50">Returns</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-amber-400">{portfolio.volatility}%</div>
                          <div className="text-xs text-white/50">Volatility</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-cyan-400">{portfolio.sharpeRatio}</div>
                          <div className="text-xs text-white/50">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold text-purple-400">{portfolio.var95}%</div>
                          <div className="text-xs text-white/50">VaR (95%)</div>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-xl">
                          <div className="text-xl font-bold">{portfolio.assetAllocation.length}</div>
                          <div className="text-xs text-white/50">Asset Classes</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {portfolio.assetAllocation.map((alloc) => (
                          <div
                            key={alloc.class}
                            className="flex-1 p-2 bg-black/20 rounded-lg text-center"
                          >
                            <div className="text-lg">{ASSET_CONFIG[alloc.class].icon}</div>
                            <div className="text-sm font-bold">{alloc.percentage}%</div>
                            <div className="text-xs text-white/50">{ASSET_CONFIG[alloc.class].name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
                  <h2 className="text-lg font-semibold mb-2">📈 AI Trading Signals</h2>
                  <p className="text-white/60">
                    Machine learning-powered market signals with confidence scores and reasoning.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {marketSignals.map((signal) => (
                    <div
                      key={signal.id}
                      className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{signal.asset}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-bold ${
                            signal.signal === 'buy'
                              ? 'bg-green-600'
                              : signal.signal === 'sell'
                                ? 'bg-red-600'
                                : 'bg-amber-600'
                          }`}
                        >
                          {signal.signal.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-xs text-white/50">Current</div>
                          <div className="text-lg font-bold">${signal.currentPrice}</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl">
                          <div className="text-xs text-white/50">Target</div>
                          <div className="text-lg font-bold text-emerald-400">${signal.priceTarget}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confidence</span>
                          <span>{(signal.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${signal.confidence * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        {signal.reasoning.map((reason, i) => (
                          <div key={i} className="text-xs text-white/60 flex items-center gap-2">
                            <span className="text-emerald-400">•</span> {reason}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-xs text-white/40">
                        Timeframe: {signal.timeframe}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stress Tests */}
                <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                  <h3 className="text-lg font-semibold mb-4">Stress Test Results</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {stressTests.map((test) => (
                      <div key={test.id} className="p-4 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{test.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              test.status === 'passed'
                                ? 'bg-green-600'
                                : test.status === 'warning'
                                  ? 'bg-amber-600'
                                  : 'bg-red-600'
                            }`}
                          >
                            {test.status}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 mb-3">{test.scenario}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="text-red-400 font-bold">{test.impactPnL}%</div>
                            <div className="text-xs text-white/50">P&L Impact</div>
                          </div>
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="text-amber-400 font-bold">{test.impactCapital}%</div>
                            <div className="text-xs text-white/50">Capital Impact</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
                  <h2 className="text-lg font-semibold mb-2">⚠️ Enterprise Risk Management</h2>
                  <p className="text-white/60">
                    Real-time risk monitoring, VaR calculations, and regulatory capital management.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {riskMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{metric.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            metric.status === 'low'
                              ? 'bg-green-600'
                              : metric.status === 'moderate'
                                ? 'bg-amber-600'
                                : 'bg-red-600'
                          }`}
                        >
                          {metric.status}
                        </span>
                      </div>
                      <div className="text-4xl font-bold mb-4">{metric.value}%</div>
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Threshold: {metric.threshold}%</span>
                        <span>Trend: {metric.trend}</span>
                      </div>
                      <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            metric.value < metric.threshold ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fraud' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-2xl p-6 border border-red-700/50">
                  <h2 className="text-lg font-semibold mb-2">🚨 AI Fraud Detection</h2>
                  <p className="text-white/60">
                    Real-time transaction monitoring, anomaly detection, and AML screening.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {fraudAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-6 rounded-2xl border ${
                        alert.severity === 'critical'
                          ? 'bg-red-900/20 border-red-700/50'
                          : alert.severity === 'high'
                            ? 'bg-amber-900/20 border-amber-700/50'
                            : 'bg-yellow-900/20 border-yellow-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">
                            {alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : '🟡'}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold">{alert.type}</h3>
                            <div className="text-sm text-white/60">Account: {alert.accountId}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {alert.amount > 0 && (
                            <div className="text-2xl font-bold">${alert.amount.toLocaleString()}</div>
                          )}
                          <div className="text-sm text-white/60">
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {alert.indicators.map((ind) => (
                          <span key={ind} className="px-3 py-1 bg-black/30 rounded-lg text-sm">
                            {ind}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Confidence: <span className="font-bold">{(alert.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            alert.status === 'escalated'
                              ? 'bg-red-600'
                              : alert.status === 'investigating'
                                ? 'bg-amber-600'
                                : 'bg-green-600'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
                  <h2 className="text-lg font-semibold mb-2">📋 Regulatory Compliance</h2>
                  <p className="text-white/60">
                    SOX, Basel III, DORA, and AML/KYC compliance monitoring and reporting.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {complianceItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{item.framework}</h3>
                          <div className="text-sm text-white/60">{item.requirement}</div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            item.status === 'compliant'
                              ? 'bg-green-600'
                              : item.status === 'warning'
                                ? 'bg-amber-600'
                                : item.status === 'pending-review'
                                  ? 'bg-blue-600'
                                  : 'bg-red-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-lg font-bold">{item.findings}</div>
                          <div className="text-xs text-white/50">Findings</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-sm font-bold">{item.owner}</div>
                          <div className="text-xs text-white/50">Owner</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-sm font-bold">
                            {Math.ceil((item.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                          </div>
                          <div className="text-xs text-white/50">Due</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
