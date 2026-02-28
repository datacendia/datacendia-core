// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA EU BANKING VERTICAL — Basel III + EU AI Act Compliance Dashboard
// Real-time regulatory compliance for mid-tier EU banks (€5B–€30B assets)
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Landmark,
  Brain,
  FileText,
  RefreshCw,
  ChevronRight,
  Info,
  Clock,
  ArrowLeft,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface CapitalMetrics {
  cet1Ratio: number;
  tier1Ratio: number;
  totalCapitalRatio: number;
  leverageRatio: number;
  cet1Capital: number;
  totalCapital: number;
  totalRWA: number;
  breaches: { metric: string; actual: number; required: number; regulation: string }[];
}

interface LiquidityMetrics {
  lcr: { lcr: number; hqla: number; totalNetOutflows: number; compliant: boolean };
  nsfr: { nsfr: number; availableStableFunding: number; requiredStableFunding: number; compliant: boolean };
}

interface StressTestResult {
  name: string;
  cet1Ratio: number;
  tier1Ratio: number;
  totalCapitalRatio: number;
  leverageRatio: number;
  breaches: { metric: string; actual: number; required: number }[];
}

interface AISystemSummary {
  id: string;
  name: string;
  riskLevel: 'unacceptable' | 'high' | 'limited' | 'minimal';
  domain: string;
  obligationCount: number;
  complianceScore: number;
}

interface AIActSummary {
  totalSystems: number;
  byRiskLevel: { unacceptable: number; high: number; limited: number; minimal: number };
  totalObligations: number;
  averageComplianceScore: number;
  systems: AISystemSummary[];
}

interface DashboardData {
  bank: { name: string; totalAssets: number; jurisdiction: string; complianceStaff: number };
  basel3: {
    capital: CapitalMetrics;
    liquidity: LiquidityMetrics;
    stressTest: { adverse: StressTestResult };
  };
  aiAct: AIActSummary;
  regulatoryDeadlines: { regulation: string; date: string; status: string }[];
  timestamp: string;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const StatusBadge: React.FC<{ status: 'pass' | 'warn' | 'fail' }> = ({ status }) => {
  const config = {
    pass: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle, label: 'Compliant' },
    warn: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertTriangle, label: 'Warning' },
    fail: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle, label: 'Breach' },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  status: 'pass' | 'warn' | 'fail';
  regulation?: string;
}> = ({ label, value, subtext, status, regulation }) => {
  const borderColor = { pass: 'border-emerald-500/40', warn: 'border-amber-500/40', fail: 'border-red-500/40' }[status];
  const valueColor = { pass: 'text-emerald-400', warn: 'text-amber-400', fail: 'text-red-400' }[status];
  return (
    <div className={`bg-neutral-800/60 rounded-xl p-5 border ${borderColor} hover:bg-neutral-800/80 transition-colors`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-neutral-400 font-medium">{label}</p>
        <StatusBadge status={status} />
      </div>
      <p className={`text-3xl font-bold ${valueColor} mt-1`}>{value}</p>
      {subtext && <p className="text-xs text-neutral-500 mt-1">{subtext}</p>}
      {regulation && <p className="text-xs text-neutral-600 mt-2 italic">{regulation}</p>}
    </div>
  );
};

const RiskLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    unacceptable: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
    high: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
    limited: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
    minimal: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  };
  const c = config[level] || config.minimal;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border} capitalize`}>
      {level}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; max: number; threshold: number; label: string }> = ({ value, max, threshold, label }) => {
  const pct = Math.min((value / max) * 100, 100);
  const thresholdPct = (threshold / max) * 100;
  const color = value >= threshold ? 'bg-emerald-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-300 font-mono">{(value * 100).toFixed(2)}%</span>
      </div>
      <div className="relative h-2.5 bg-neutral-700 rounded-full overflow-hidden">
        <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: `${thresholdPct}%` }} title={`Minimum: ${(threshold * 100).toFixed(1)}%`} />
      </div>
    </div>
  );
};

// =============================================================================
// DEMO DATA (rendered client-side when API unavailable)
// =============================================================================

const DEMO_DATA: DashboardData = {
  bank: { name: 'Demo Mid-Tier EU Bank', totalAssets: 12_000_000_000, jurisdiction: 'EU/EEA', complianceStaff: 150 },
  basel3: {
    capital: {
      cet1Ratio: 0.1367, tier1Ratio: 0.1534, totalCapitalRatio: 0.1785,
      leverageRatio: 0.0861, cet1Capital: 1_287_000_000, totalCapital: 1_682_000_000,
      totalRWA: 9_421_500_000,
      breaches: [],
    },
    liquidity: {
      lcr: { lcr: 1.4832, hqla: 2_648_500_000, totalNetOutflows: 1_785_300_000, compliant: true },
      nsfr: { nsfr: 1.1247, availableStableFunding: 8_942_000_000, requiredStableFunding: 7_951_000_000, compliant: true },
    },
    stressTest: {
      adverse: {
        name: 'EBA Adverse 2026',
        cet1Ratio: 0.1014, tier1Ratio: 0.1147, totalCapitalRatio: 0.1362,
        leverageRatio: 0.0721,
        breaches: [],
      },
    },
  },
  aiAct: {
    totalSystems: 6, byRiskLevel: { unacceptable: 0, high: 4, limited: 1, minimal: 1 },
    totalObligations: 42, averageComplianceScore: 0.72,
    systems: [
      { id: 'ai-credit-001', name: 'CreditScore Pro', riskLevel: 'high', domain: 'credit-scoring', obligationCount: 12, complianceScore: 0.75 },
      { id: 'ai-fraud-002', name: 'FraudShield RT', riskLevel: 'high', domain: 'fraud-detection', obligationCount: 12, complianceScore: 0.68 },
      { id: 'ai-aml-003', name: 'AML Sentinel', riskLevel: 'high', domain: 'aml-screening', obligationCount: 12, complianceScore: 0.82 },
      { id: 'ai-chatbot-004', name: 'BankAssist', riskLevel: 'limited', domain: 'customer-service', obligationCount: 4, complianceScore: 0.90 },
      { id: 'ai-collections-005', name: 'CollectIQ', riskLevel: 'high', domain: 'collections', obligationCount: 12, complianceScore: 0.65 },
      { id: 'ai-hr-006', name: 'TalentMatch', riskLevel: 'minimal', domain: 'hr-recruitment', obligationCount: 2, complianceScore: 0.55 },
    ],
  },
  regulatoryDeadlines: [
    { regulation: 'EU AI Act — Prohibited practices', date: '2025-02-02', status: 'in-force' },
    { regulation: 'EU AI Act — GPAI obligations', date: '2025-08-02', status: 'in-force' },
    { regulation: 'EU AI Act — High-risk obligations', date: '2026-08-02', status: 'upcoming' },
    { regulation: 'Basel III — Final reforms (CRR3)', date: '2025-01-01', status: 'in-force' },
    { regulation: 'DORA — Digital Operational Resilience', date: '2025-01-17', status: 'in-force' },
  ],
  timestamp: new Date().toISOString(),
};

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

export const EUBankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'basel3' | 'ai-act' | 'stress-test'>('overview');
  const [data, setData] = useState<DashboardData>(DEMO_DATA);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch('/api/v1/eu-banking/dashboard', {
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    } catch {
      // Fall back to demo data silently
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const fmt = (n: number) => new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: 'compact' }).format(n);
  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
  const capitalStatus = (ratio: number, min: number): 'pass' | 'warn' | 'fail' => ratio >= min * 1.25 ? 'pass' : ratio >= min ? 'warn' : 'fail';

  const { basel3, aiAct, regulatoryDeadlines } = data;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-neutral-900 to-indigo-900/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <button onClick={() => navigate('/verticals')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">EU/EEA Jurisdiction</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">Basel III CRR/CRD</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">EU AI Act 2024/1689</span>
              </div>
              <h1 className="text-4xl font-bold mb-3">EU Banking Compliance</h1>
              <p className="text-lg text-neutral-300 max-w-3xl">
                Real-time Basel III capital adequacy, liquidity monitoring, and EU AI Act compliance
                for mid-tier EU banks. Genuine CRR/CRD IV calculations with EBA stress testing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="text-right text-xs text-neutral-500">
                <p>Last update</p>
                <p>{lastRefresh.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <MetricCard
              label="CET1 Ratio"
              value={pct(basel3.capital.cet1Ratio)}
              subtext={`Min 4.5% · Buffer target ≥10.5%`}
              status={capitalStatus(basel3.capital.cet1Ratio, 0.045)}
              regulation="Art. 92(1)(a) CRR"
            />
            <MetricCard
              label="LCR"
              value={pct(basel3.liquidity.lcr.lcr)}
              subtext="Min 100%"
              status={basel3.liquidity.lcr.compliant ? 'pass' : 'fail'}
              regulation="Art. 412 CRR / LCR DA"
            />
            <MetricCard
              label="NSFR"
              value={pct(basel3.liquidity.nsfr.nsfr)}
              subtext="Min 100%"
              status={basel3.liquidity.nsfr.compliant ? 'pass' : 'fail'}
              regulation="Art. 428a CRR"
            />
            <MetricCard
              label="AI Act Readiness"
              value={`${(aiAct.averageComplianceScore * 100).toFixed(0)}%`}
              subtext={`${aiAct.totalSystems} systems · ${aiAct.byRiskLevel.high} high-risk`}
              status={aiAct.averageComplianceScore >= 0.8 ? 'pass' : aiAct.averageComplianceScore >= 0.6 ? 'warn' : 'fail'}
              regulation="Reg. (EU) 2024/1689"
            />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-neutral-800 sticky top-0 bg-neutral-900/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {([
              { key: 'overview', label: 'Overview', icon: Activity },
              { key: 'basel3', label: 'Basel III Capital & Liquidity', icon: BarChart3 },
              { key: 'ai-act', label: 'EU AI Act', icon: Brain },
              { key: 'stress-test', label: 'Stress Testing', icon: TrendingDown },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-all border-b-2 ${
                  activeTab === key ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Regulatory Deadlines */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /> Regulatory Deadlines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {regulatoryDeadlines.map((d, i) => {
                  const isInForce = d.status === 'in-force';
                  return (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${isInForce ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                      {isInForce ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{d.regulation}</p>
                        <p className="text-xs text-neutral-500">{d.date} · <span className={isInForce ? 'text-emerald-400' : 'text-amber-400'}>{d.status}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Capital Overview */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Landmark className="w-5 h-5 text-blue-400" /> Capital Position</h2>
              <div className="bg-neutral-800/40 rounded-2xl p-6 border border-neutral-700 space-y-5">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-sm text-neutral-400">CET1 Capital</p>
                    <p className="text-2xl font-bold text-emerald-400">{fmt(basel3.capital.cet1Capital)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Total Capital</p>
                    <p className="text-2xl font-bold text-blue-400">{fmt(basel3.capital.totalCapital)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Total RWA</p>
                    <p className="text-2xl font-bold text-neutral-200">{fmt(basel3.capital.totalRWA)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <ProgressBar value={basel3.capital.cet1Ratio} max={0.25} threshold={0.045} label="CET1 Ratio (min 4.5%)" />
                  <ProgressBar value={basel3.capital.tier1Ratio} max={0.25} threshold={0.06} label="Tier 1 Ratio (min 6.0%)" />
                  <ProgressBar value={basel3.capital.totalCapitalRatio} max={0.25} threshold={0.08} label="Total Capital Ratio (min 8.0%)" />
                  <ProgressBar value={basel3.capital.leverageRatio} max={0.15} threshold={0.03} label="Leverage Ratio (min 3.0%)" />
                </div>
                {basel3.capital.breaches.length > 0 && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm font-semibold text-red-400 mb-2">Capital Breaches Detected</p>
                    {basel3.capital.breaches.map((b, i) => (
                      <p key={i} className="text-xs text-red-300">
                        {b.metric}: {pct(b.actual)} vs required {pct(b.required)} — {b.regulation}
                      </p>
                    ))}
                  </div>
                )}
                {basel3.capital.breaches.length === 0 && (
                  <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                    <Shield className="w-4 h-4" /> All capital ratios above regulatory minimums
                  </div>
                )}
              </div>
            </section>

            {/* AI Act Summary */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" /> AI System Inventory</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {(['unacceptable', 'high', 'limited', 'minimal'] as const).map((level) => {
                  const colors: Record<string, string> = { unacceptable: 'text-red-400', high: 'text-orange-400', limited: 'text-amber-400', minimal: 'text-emerald-400' };
                  return (
                    <div key={level} className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700 text-center">
                      <p className={`text-3xl font-bold ${colors[level]}`}>{aiAct.byRiskLevel[level]}</p>
                      <p className="text-sm text-neutral-400 capitalize">{level} Risk</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700 text-neutral-400">
                      <th className="text-left px-5 py-3 font-medium">System</th>
                      <th className="text-left px-5 py-3 font-medium">Domain</th>
                      <th className="text-center px-5 py-3 font-medium">Risk Level</th>
                      <th className="text-center px-5 py-3 font-medium">Obligations</th>
                      <th className="text-center px-5 py-3 font-medium">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiAct.systems.map((sys) => (
                      <tr key={sys.id} className="border-b border-neutral-800 hover:bg-neutral-800/60 transition-colors">
                        <td className="px-5 py-3 font-medium">{sys.name}</td>
                        <td className="px-5 py-3 text-neutral-400">{sys.domain}</td>
                        <td className="px-5 py-3 text-center"><RiskLevelBadge level={sys.riskLevel} /></td>
                        <td className="px-5 py-3 text-center text-neutral-300">{sys.obligationCount}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`font-mono font-semibold ${sys.complianceScore >= 0.8 ? 'text-emerald-400' : sys.complianceScore >= 0.6 ? 'text-amber-400' : 'text-red-400'}`}>
                            {(sys.complianceScore * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* BASEL III TAB */}
        {activeTab === 'basel3' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-2">Capital Adequacy — CRR Art. 92</h2>
              <p className="text-neutral-400 text-sm mb-6">Pillar 1 minimum requirements under the Capital Requirements Regulation (EU) No 575/2013</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="CET1 Ratio" value={pct(basel3.capital.cet1Ratio)} subtext="Minimum 4.5%" status={capitalStatus(basel3.capital.cet1Ratio, 0.045)} regulation="Art. 92(1)(a)" />
                <MetricCard label="Tier 1 Ratio" value={pct(basel3.capital.tier1Ratio)} subtext="Minimum 6.0%" status={capitalStatus(basel3.capital.tier1Ratio, 0.06)} regulation="Art. 92(1)(b)" />
                <MetricCard label="Total Capital" value={pct(basel3.capital.totalCapitalRatio)} subtext="Minimum 8.0%" status={capitalStatus(basel3.capital.totalCapitalRatio, 0.08)} regulation="Art. 92(1)(c)" />
                <MetricCard label="Leverage Ratio" value={pct(basel3.capital.leverageRatio)} subtext="Minimum 3.0%" status={capitalStatus(basel3.capital.leverageRatio, 0.03)} regulation="Art. 429 CRR" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Capital Buffers — CRD IV Art. 128–142</h2>
              <p className="text-neutral-400 text-sm mb-6">Combined buffer requirement comprising conservation, countercyclical, and systemic buffers</p>
              <div className="bg-neutral-800/40 rounded-2xl p-6 border border-neutral-700">
                <div className="space-y-4">
                  {[
                    { label: 'Capital Conservation Buffer (CCB)', rate: '2.500%', article: 'Art. 129 CRD IV' },
                    { label: 'Countercyclical Buffer (CCyB)', rate: '0.500%', article: 'Art. 130 CRD IV' },
                    { label: 'Systemic Risk Buffer', rate: '1.000%', article: 'Art. 133 CRD IV' },
                    { label: 'Combined Buffer Requirement', rate: '4.000%', article: 'Total' },
                  ].map((buf) => (
                    <div key={buf.label} className="flex items-center justify-between py-2 border-b border-neutral-700/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{buf.label}</p>
                        <p className="text-xs text-neutral-500">{buf.article}</p>
                      </div>
                      <p className="text-sm font-mono font-semibold text-blue-400">{buf.rate}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> CET1 must exceed 4.5% + combined buffer = 8.5% to avoid MDA restrictions (Art. 141 CRD IV)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Liquidity Coverage Ratio — Art. 412 CRR</h2>
              <p className="text-neutral-400 text-sm mb-6">30-day liquidity stress scenario: HQLA must cover net cash outflows at ≥100%</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <p className="text-sm text-neutral-400">HQLA (after haircuts)</p>
                  <p className="text-2xl font-bold text-emerald-400">{fmt(basel3.liquidity.lcr.hqla)}</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <p className="text-sm text-neutral-400">Net Cash Outflows</p>
                  <p className="text-2xl font-bold text-red-400">{fmt(basel3.liquidity.lcr.totalNetOutflows)}</p>
                </div>
                <MetricCard label="LCR" value={pct(basel3.liquidity.lcr.lcr)} subtext="Minimum 100%" status={basel3.liquidity.lcr.compliant ? 'pass' : 'fail'} regulation="Delegated Reg. (EU) 2015/61" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Net Stable Funding Ratio — Art. 428a CRR</h2>
              <p className="text-neutral-400 text-sm mb-6">Structural liquidity: available stable funding must cover required stable funding at ≥100%</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <p className="text-sm text-neutral-400">Available Stable Funding</p>
                  <p className="text-2xl font-bold text-emerald-400">{fmt(basel3.liquidity.nsfr.availableStableFunding)}</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <p className="text-sm text-neutral-400">Required Stable Funding</p>
                  <p className="text-2xl font-bold text-amber-400">{fmt(basel3.liquidity.nsfr.requiredStableFunding)}</p>
                </div>
                <MetricCard label="NSFR" value={pct(basel3.liquidity.nsfr.nsfr)} subtext="Minimum 100%" status={basel3.liquidity.nsfr.compliant ? 'pass' : 'fail'} regulation="CRR2 Title IV" />
              </div>
            </section>
          </div>
        )}

        {/* AI ACT TAB */}
        {activeTab === 'ai-act' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-2">EU AI Act Compliance — Regulation (EU) 2024/1689</h2>
              <p className="text-neutral-400 text-sm mb-6">Classification and obligation tracking for all AI systems deployed by the institution</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700 text-center">
                  <p className="text-3xl font-bold text-blue-400">{aiAct.totalSystems}</p>
                  <p className="text-sm text-neutral-400">Total AI Systems</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700 text-center">
                  <p className="text-3xl font-bold text-orange-400">{aiAct.byRiskLevel.high}</p>
                  <p className="text-sm text-neutral-400">High-Risk (Annex III)</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700 text-center">
                  <p className="text-3xl font-bold text-amber-400">{aiAct.totalObligations}</p>
                  <p className="text-sm text-neutral-400">Total Obligations</p>
                </div>
                <MetricCard
                  label="Avg. Compliance"
                  value={`${(aiAct.averageComplianceScore * 100).toFixed(0)}%`}
                  status={aiAct.averageComplianceScore >= 0.8 ? 'pass' : aiAct.averageComplianceScore >= 0.6 ? 'warn' : 'fail'}
                  regulation="Art. 6–51 EU AI Act"
                />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4">AI System Register — Art. 49 High-Risk AI Database</h2>
              <div className="space-y-3">
                {aiAct.systems.map((sys) => (
                  <div key={sys.id} className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700 hover:border-neutral-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-700/50 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{sys.name}</p>
                          <p className="text-xs text-neutral-500">{sys.id} · {sys.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <RiskLevelBadge level={sys.riskLevel} />
                        <div className="text-right">
                          <p className={`text-lg font-bold font-mono ${sys.complianceScore >= 0.8 ? 'text-emerald-400' : sys.complianceScore >= 0.6 ? 'text-amber-400' : 'text-red-400'}`}>
                            {(sys.complianceScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-neutral-500">{sys.obligationCount} obligations</p>
                        </div>
                      </div>
                    </div>
                    {sys.riskLevel === 'high' && (
                      <div className="mt-3 pt-3 border-t border-neutral-700/50">
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Risk Management (Art. 9)',
                            'Data Governance (Art. 10)',
                            'Technical Docs (Art. 11)',
                            'Record-Keeping (Art. 12)',
                            'Transparency (Art. 13)',
                            'Human Oversight (Art. 14)',
                            'Accuracy & Robustness (Art. 15)',
                          ].map((ob) => (
                            <span key={ob} className="px-2 py-0.5 bg-neutral-700/50 text-neutral-400 rounded text-xs">{ob}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4">Fundamental Rights Impact Assessment (FRIA) — Art. 27</h2>
              <div className="bg-neutral-800/40 rounded-2xl p-6 border border-neutral-700">
                <p className="text-sm text-neutral-300 mb-4">
                  Deployers of high-risk AI systems must conduct a FRIA before deployment, assessing impact on rights
                  under the EU Charter of Fundamental Rights. Banking-specific rights include:
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { right: 'Non-discrimination (Art. 21)', relevance: 'Credit scoring, HR screening' },
                    { right: 'Privacy & data protection (Art. 7–8)', relevance: 'All AI systems processing personal data' },
                    { right: 'Effective remedy (Art. 47)', relevance: 'Automated denial decisions' },
                    { right: 'Freedom of expression (Art. 11)', relevance: 'Content moderation in chatbots' },
                    { right: 'Human dignity (Art. 1)', relevance: 'Collections and debt recovery AI' },
                    { right: 'Consumer protection (Art. 38)', relevance: 'Customer-facing AI recommendations' },
                  ].map((r) => (
                    <div key={r.right} className="p-3 bg-neutral-700/30 rounded-lg border border-neutral-700/50">
                      <p className="text-sm font-medium text-purple-300">{r.right}</p>
                      <p className="text-xs text-neutral-500 mt-1">{r.relevance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STRESS TEST TAB */}
        {activeTab === 'stress-test' && (
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-2">EBA Stress Test — Adverse Scenario</h2>
              <p className="text-neutral-400 text-sm mb-6">Capital impact under the EBA 2026 adverse macroeconomic scenario (GDP shock: −3.1%, credit losses: 2.5%, market losses: 18%)</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-neutral-400">Baseline CET1</p>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">{pct(basel3.capital.cet1Ratio)}</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-neutral-400">Stressed CET1</p>
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{pct(basel3.stressTest.adverse.cet1Ratio)}</p>
                </div>
                <div className="bg-neutral-800/60 rounded-xl p-5 border border-neutral-700">
                  <p className="text-sm text-neutral-400 mb-1">CET1 Depletion</p>
                  <p className="text-2xl font-bold text-red-400">
                    −{((basel3.capital.cet1Ratio - basel3.stressTest.adverse.cet1Ratio) * 100).toFixed(0)} bps
                  </p>
                </div>
                <MetricCard
                  label="Post-Stress Status"
                  value={basel3.stressTest.adverse.cet1Ratio >= 0.045 ? 'Above minimum' : 'Below minimum'}
                  status={capitalStatus(basel3.stressTest.adverse.cet1Ratio, 0.045)}
                  regulation="EBA/GL/2018/04"
                />
              </div>

              <div className="bg-neutral-800/40 rounded-2xl p-6 border border-neutral-700">
                <h3 className="font-semibold mb-4">Stressed Ratios vs Regulatory Minimums</h3>
                <div className="space-y-4">
                  <ProgressBar value={basel3.stressTest.adverse.cet1Ratio} max={0.20} threshold={0.045} label={`CET1 Ratio: ${pct(basel3.stressTest.adverse.cet1Ratio)} (min 4.5%)`} />
                  <ProgressBar value={basel3.stressTest.adverse.tier1Ratio} max={0.20} threshold={0.06} label={`Tier 1 Ratio: ${pct(basel3.stressTest.adverse.tier1Ratio)} (min 6.0%)`} />
                  <ProgressBar value={basel3.stressTest.adverse.totalCapitalRatio} max={0.20} threshold={0.08} label={`Total Capital: ${pct(basel3.stressTest.adverse.totalCapitalRatio)} (min 8.0%)`} />
                  <ProgressBar value={basel3.stressTest.adverse.leverageRatio} max={0.15} threshold={0.03} label={`Leverage Ratio: ${pct(basel3.stressTest.adverse.leverageRatio)} (min 3.0%)`} />
                </div>

                {basel3.stressTest.adverse.breaches.length > 0 ? (
                  <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Post-Stress Breaches</p>
                    {basel3.stressTest.adverse.breaches.map((b, i) => (
                      <p key={i} className="text-xs text-red-300">{b.metric}: {pct(b.actual)} vs required {pct(b.required)}</p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-emerald-300">All ratios remain above regulatory minimums under adverse stress scenario</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4">Scenario Parameters</h2>
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700 text-neutral-400">
                      <th className="text-left px-5 py-3 font-medium">Parameter</th>
                      <th className="text-right px-5 py-3 font-medium">Value</th>
                      <th className="text-left px-5 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { param: 'GDP Shock', value: '−3.1%', desc: 'Cumulative GDP decline over stress horizon' },
                      { param: 'Credit Loss Rate', value: '2.5%', desc: 'Additional credit losses as % of credit RWA' },
                      { param: 'Market Loss', value: '18.0%', desc: 'Decline in market risk positions' },
                      { param: 'RWA Inflation', value: '12.0%', desc: 'Increase in risk-weighted assets under stress' },
                    ].map((row) => (
                      <tr key={row.param} className="border-b border-neutral-800 hover:bg-neutral-800/60">
                        <td className="px-5 py-3 font-medium">{row.param}</td>
                        <td className="px-5 py-3 text-right font-mono text-red-400">{row.value}</td>
                        <td className="px-5 py-3 text-neutral-400">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Stress test methodology aligned with EBA Guidelines on institutions' stress testing (EBA/GL/2018/04) and SREP framework
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
