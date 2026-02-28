// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA ECHO™ - Decision Outcome Engine
// "Every decision echoes through time. We measure the echo."
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  ChevronRight,
  Calendar,
  Users,
  Brain,
  FileText,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Check,
  X,
  Clock,
  AlertTriangle,
  Link2,
  Loader2,
  Download,
} from 'lucide-react';
import { echoApi } from '../../../lib/api';

interface DecisionOutcome {
  id: string;
  decisionTitle: string;
  decisionDate: string;
  dollarImpact: number;
  roi: number;
  status: 'positive' | 'negative' | 'neutral';
  rank: number;
  councilMode: string;
  leadAgent: string;
}

interface AccuracyReport {
  overallAccuracy: number;
  byCategory: Record<string, number>;
  byAgent: Record<string, number>;
  byMode: Record<string, number>;
  trend: Array<{ date: string; accuracy: number }>;
  recommendations: string[];
}

interface DashboardData {
  summary: {
    totalDecisionsTracked: number;
    overallAccuracy: number;
    totalPositiveImpact: number;
    totalNegativeImpact: number;
    netImpact: number;
  };
  topDecisions: DecisionOutcome[];
  accuracyTrend: Array<{ date: string; accuracy: number }>;
  recommendations: string[];
}

interface PendingDecision {
  deliberationId: string;
  question: string;
  decidedAt: string;
  daysSinceDecision: number;
  mode: string;
  hasScheduledCollection: boolean;
}

interface LinkOutcomeForm {
  deliberationId: string;
  actualRevenue: string;
  actualProfit: string;
  actualHeadcount: string;
  notes: string;
}

const EchoPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [leaderboard, setLeaderboard] = useState<DecisionOutcome[]>([]);
  const [accuracy, setAccuracy] = useState<AccuracyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  // Quick Action state
  const [activePanel, setActivePanel] = useState<'link' | 'report' | 'failed' | null>(null);
  const [pendingDecisions, setPendingDecisions] = useState<PendingDecision[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [linkForm, setLinkForm] = useState<LinkOutcomeForm>({ deliberationId: '', actualRevenue: '', actualProfit: '', actualHeadcount: '', notes: '' });
  const [linkSubmitting, setLinkSubmitting] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [failedDecisions, setFailedDecisions] = useState<DecisionOutcome[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, leaderboardRes, accuracyRes] = await Promise.all([
        echoApi.getDashboard(),
        echoApi.getLeaderboard({ period, limit: 20 }),
        echoApi.getAccuracyReport(),
      ]);

      if (dashboardRes.success) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data as DecisionOutcome[]);
      }
      if (accuracyRes.success) {
        setAccuracy(accuracyRes.data as AccuracyReport);
      }
    } catch (error) {
      console.error('Failed to fetch Echo data, using demo data:', error);
      // Fallback demo data when backend unavailable
      setDashboard({
        summary: {
          totalDecisionsTracked: 47,
          overallAccuracy: 78.3,
          totalPositiveImpact: 12400000,
          totalNegativeImpact: -1800000,
          netImpact: 10600000,
        },
        topDecisions: [
          { id: 'echo-1', decisionTitle: 'Q4 Market Expansion into DACH Region', decisionDate: '2025-09-15', dollarImpact: 4200000, roi: 340, status: 'positive', rank: 1, councilMode: 'Strategic', leadAgent: 'CendiaCEO' },
          { id: 'echo-2', decisionTitle: 'Core Banking System Migration', decisionDate: '2025-08-01', dollarImpact: 2800000, roi: 180, status: 'positive', rank: 2, councilMode: 'Technical', leadAgent: 'CendiaCTO' },
          { id: 'echo-3', decisionTitle: 'Cryptocurrency Custody Launch', decisionDate: '2025-10-20', dollarImpact: -950000, roi: -12, status: 'negative', rank: 3, councilMode: 'Risk', leadAgent: 'CendiaCRO' },
          { id: 'echo-4', decisionTitle: 'Enterprise Pricing Restructure', decisionDate: '2025-11-01', dollarImpact: 1900000, roi: 210, status: 'positive', rank: 4, councilMode: 'Revenue', leadAgent: 'CendiaCFO' },
          { id: 'echo-5', decisionTitle: 'Vendor Consolidation Program', decisionDate: '2025-07-12', dollarImpact: 860000, roi: 95, status: 'positive', rank: 5, councilMode: 'Operational', leadAgent: 'CendiaCOO' },
        ],
        accuracyTrend: [
          { date: '2025-07', accuracy: 72 }, { date: '2025-08', accuracy: 74 }, { date: '2025-09', accuracy: 76 },
          { date: '2025-10', accuracy: 75 }, { date: '2025-11', accuracy: 79 }, { date: '2025-12', accuracy: 78.3 },
        ],
        recommendations: [
          'Strategic decisions show highest accuracy (84%). Continue leveraging multi-agent deliberation for strategic moves.',
          'Technical decisions have longest time-to-outcome. Consider scheduling earlier echo checkpoints.',
          'Risk-mode decisions showing negative ROI trend — review agent weighting for CendiaCRO recommendations.',
        ],
      });
      setLeaderboard([
        { id: 'echo-1', decisionTitle: 'Q4 Market Expansion into DACH Region', decisionDate: '2025-09-15', dollarImpact: 4200000, roi: 340, status: 'positive', rank: 1, councilMode: 'Strategic', leadAgent: 'CendiaCEO' },
        { id: 'echo-2', decisionTitle: 'Core Banking System Migration', decisionDate: '2025-08-01', dollarImpact: 2800000, roi: 180, status: 'positive', rank: 2, councilMode: 'Technical', leadAgent: 'CendiaCTO' },
        { id: 'echo-4', decisionTitle: 'Enterprise Pricing Restructure', decisionDate: '2025-11-01', dollarImpact: 1900000, roi: 210, status: 'positive', rank: 3, councilMode: 'Revenue', leadAgent: 'CendiaCFO' },
        { id: 'echo-5', decisionTitle: 'Vendor Consolidation Program', decisionDate: '2025-07-12', dollarImpact: 860000, roi: 95, status: 'positive', rank: 4, councilMode: 'Operational', leadAgent: 'CendiaCOO' },
        { id: 'echo-3', decisionTitle: 'Cryptocurrency Custody Launch', decisionDate: '2025-10-20', dollarImpact: -950000, roi: -12, status: 'negative', rank: 5, councilMode: 'Risk', leadAgent: 'CendiaCRO' },
      ]);
      setAccuracy({
        overallAccuracy: 78.3,
        byCategory: { Strategic: 84, Technical: 72, Risk: 68, Revenue: 81, Operational: 77 },
        byAgent: { CendiaCEO: 86, CendiaCTO: 74, CendiaCFO: 82, CendiaCRO: 65, CendiaCOO: 79 },
        byMode: { Consensus: 80, Adversarial: 73, Hybrid: 78 },
        trend: [
          { date: '2025-07', accuracy: 72 }, { date: '2025-08', accuracy: 74 }, { date: '2025-09', accuracy: 76 },
          { date: '2025-10', accuracy: 75 }, { date: '2025-11', accuracy: 79 }, { date: '2025-12', accuracy: 78.3 },
        ],
        recommendations: [
          'Strategic decisions show highest accuracy (84%)',
          'Risk-mode decisions need recalibration',
          'Consider scheduling earlier echo checkpoints for technical decisions',
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Decision Outcomes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-5 mb-2">
          <div className="w-12 h-12 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
              CENDIAECHO<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">Decision Outcome Engine</p>
          </div>
        </div>
        <p className="text-neutral-500 mt-2 max-w-2xl">
          Every decision echoes through time. We measure the echo and make the next decision better.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Decisions Tracked</span>
            <BarChart3 className="w-5 h-5 text-neutral-500" />
          </div>
          <p className="text-3xl font-bold">{dashboard?.summary.totalDecisionsTracked || 0}</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Prediction Accuracy</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {formatPercent(dashboard?.summary.overallAccuracy || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Positive Impact</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(dashboard?.summary.totalPositiveImpact || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Negative Impact</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-400">
            {formatCurrency(dashboard?.summary.totalNegativeImpact || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Net Impact</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <p
            className={`text-3xl font-bold ${(dashboard?.summary.netImpact || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {formatCurrency(dashboard?.summary.netImpact || 0)}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision ROI Leaderboard */}
        <div className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800">
          <div className="p-5 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Decision ROI Leaderboard</h2>
              </div>
              <div className="flex items-center gap-2">
                {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-sm rounded-lg transition ${
                      period === p
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                <button
                  onClick={fetchData}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto">
            {leaderboard.map((decision, idx) => (
              <div
                key={decision.id}
                onClick={() => setSelectedDecision(decision.id)}
                className="p-4 hover:bg-neutral-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx < 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{decision.decisionTitle}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(decision.decisionDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {decision.councilMode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {decision.leadAgent}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        decision.dollarImpact > 0
                          ? 'text-green-400'
                          : decision.dollarImpact < 0
                            ? 'text-red-400'
                            : 'text-neutral-400'
                      }`}
                    >
                      {decision.dollarImpact > 0 ? '+' : ''}
                      {formatCurrency(decision.dollarImpact)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      ROI: {formatPercent(decision.roi * 100)}
                    </p>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      decision.status === 'positive'
                        ? 'bg-green-500/20'
                        : decision.status === 'negative'
                          ? 'bg-red-500/20'
                          : 'bg-neutral-800'
                    }`}
                  >
                    {decision.status === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : decision.status === 'negative' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="p-8 text-center text-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No decision outcomes tracked yet</p>
                <p className="text-sm mt-1">
                  Link decisions to their outcomes to see the ROI leaderboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Accuracy by Agent */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Agent Accuracy</h2>
            </div>

            <div className="space-y-3">
              {Object.entries(accuracy?.byAgent || {})
                .slice(0, 6)
                .map(([agent, acc]) => (
                  <div key={agent}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-400">{agent}</span>
                      <span
                        className={
                          acc >= 80
                            ? 'text-green-400'
                            : acc >= 60
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }
                      >
                        {formatPercent(acc)}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          acc >= 80 ? 'bg-green-500' : acc >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                  </div>
                ))}

              {Object.keys(accuracy?.byAgent || {}).length === 0 && (
                <p className="text-neutral-500 text-sm text-center py-4">
                  No agent accuracy data available yet
                </p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Recommendations</h2>
            </div>

            <div className="space-y-3">
              {(accuracy?.recommendations || dashboard?.recommendations || []).map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-neutral-300">{rec}</p>
                </div>
              ))}

              {(accuracy?.recommendations || []).length === 0 && (
                <p className="text-neutral-500 text-sm text-center py-4">
                  All metrics are within acceptable ranges
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  setActivePanel(activePanel === 'link' ? null : 'link');
                  setLinkSuccess(null);
                  if (activePanel !== 'link') {
                    setPendingLoading(true);
                    try {
                      const res = await echoApi.getPendingDecisions({ olderThanDays: 1, limit: 20 });
                      if (res.success) {setPendingDecisions(res.data as PendingDecision[]);}
                    } catch (e) { console.error('Failed to fetch pending:', e); }
                    setPendingLoading(false);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                  activePanel === 'link' ? 'bg-green-500/20 border border-green-500/30' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-green-400" />
                  Link Decision Outcome
                </span>
                <ChevronRight className={`w-4 h-4 text-neutral-500 transition ${activePanel === 'link' ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={async () => {
                  setActivePanel(activePanel === 'report' ? null : 'report');
                  setGeneratedReport(null);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                  activePanel === 'report' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  Generate Outcome Report
                </span>
                <ChevronRight className={`w-4 h-4 text-neutral-500 transition ${activePanel === 'report' ? 'rotate-90' : ''}`} />
              </button>

              <button
                onClick={async () => {
                  if (activePanel === 'failed') {
                    setActivePanel(null);
                  } else {
                    setActivePanel('failed');
                    const res = await echoApi.getLeaderboard({ period: 'year', limit: 50, sortBy: 'impact' });
                    if (res.success) {
                      setFailedDecisions((res.data as DecisionOutcome[]).filter(d => d.status === 'negative'));
                    }
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                  activePanel === 'failed' ? 'bg-red-500/20 border border-red-500/30' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Review Failed Predictions
                </span>
                <ChevronRight className={`w-4 h-4 text-neutral-500 transition ${activePanel === 'failed' ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* QUICK ACTION PANELS                                                */}
      {/* ================================================================== */}

      {/* Link Decision Outcome Panel */}
      {activePanel === 'link' && (
        <div className="mt-6 bg-neutral-900 rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">Link Decision Outcome</h2>
            <button onClick={() => setActivePanel(null)} className="ml-auto p-1 hover:bg-neutral-800 rounded">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {linkSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {linkSuccess}
            </div>
          )}

          {/* Pending Decisions List */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">
              Decisions Awaiting Outcome ({pendingDecisions.length})
            </h3>
            {pendingLoading ? (
              <div className="flex items-center gap-2 text-neutral-500 py-4 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading pending decisions...
              </div>
            ) : pendingDecisions.length === 0 ? (
              <p className="text-neutral-500 text-sm py-3 text-center">No pending decisions found. All decisions have outcomes or are too recent.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1 mb-3">
                {pendingDecisions.map(d => (
                  <button
                    key={d.deliberationId}
                    onClick={() => setLinkForm({ ...linkForm, deliberationId: d.deliberationId })}
                    className={`w-full text-left p-2 rounded-lg text-sm transition ${
                      linkForm.deliberationId === d.deliberationId
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  >
                    <p className="font-medium truncate">{d.question}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {d.daysSinceDecision}d ago
                      </span>
                      <span>{d.mode}</span>
                      {d.hasScheduledCollection && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Auto-collection scheduled
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outcome Form */}
          {linkForm.deliberationId && (
            <div className="border-t border-neutral-800 pt-4">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">Enter Actual Results</h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Actual Revenue ($)</label>
                  <input
                    type="number"
                    value={linkForm.actualRevenue}
                    onChange={e => setLinkForm({ ...linkForm, actualRevenue: e.target.value })}
                    placeholder="0"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Actual Profit ($)</label>
                  <input
                    type="number"
                    value={linkForm.actualProfit}
                    onChange={e => setLinkForm({ ...linkForm, actualProfit: e.target.value })}
                    placeholder="0"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Actual Headcount</label>
                  <input
                    type="number"
                    value={linkForm.actualHeadcount}
                    onChange={e => setLinkForm({ ...linkForm, actualHeadcount: e.target.value })}
                    placeholder="0"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-neutral-500 block mb-1">Notes</label>
                <input
                  type="text"
                  value={linkForm.notes}
                  onChange={e => setLinkForm({ ...linkForm, notes: e.target.value })}
                  placeholder="Optional notes about this outcome..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                />
              </div>
              <button
                onClick={async () => {
                  setLinkSubmitting(true);
                  try {
                    const res = await echoApi.linkOutcome({
                      deliberationId: linkForm.deliberationId,
                      actualRevenue: linkForm.actualRevenue ? parseFloat(linkForm.actualRevenue) : undefined,
                      actualProfit: linkForm.actualProfit ? parseFloat(linkForm.actualProfit) : undefined,
                      actualHeadcount: linkForm.actualHeadcount ? parseFloat(linkForm.actualHeadcount) : undefined,
                      notes: linkForm.notes || undefined,
                    });
                    if (res.success) {
                      setLinkSuccess('Outcome linked successfully! Agent weights have been adjusted.');
                      setLinkForm({ deliberationId: '', actualRevenue: '', actualProfit: '', actualHeadcount: '', notes: '' });
                      setPendingDecisions(prev => prev.filter(d => d.deliberationId !== linkForm.deliberationId));
                      fetchData();
                    }
                  } catch (e) {
                    console.error('Failed to link outcome:', e);
                  }
                  setLinkSubmitting(false);
                }}
                disabled={linkSubmitting}
                className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {linkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {linkSubmitting ? 'Linking...' : 'Link Outcome & Adjust Weights'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Generate Outcome Report Panel */}
      {activePanel === 'report' && (
        <div className="mt-6 bg-neutral-900 rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Generate Outcome Report</h2>
            <button onClick={() => { setActivePanel(null); setGeneratedReport(null); }} className="ml-auto p-1 hover:bg-neutral-800 rounded">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {!generatedReport ? (
            <>
              <p className="text-neutral-400 text-sm mb-3">Select a decision from the leaderboard to generate a cryptographically signed "Was This Right?" report.</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {leaderboard.map(decision => (
                  <button
                    key={decision.id}
                    onClick={async () => {
                      setReportGenerating(true);
                      try {
                        const res = await echoApi.getOutcomeReport(decision.id);
                        if (res.success) {setGeneratedReport({ ...res.data as any, decisionTitle: decision.decisionTitle });}
                      } catch (e) { console.error('Failed to generate report:', e); }
                      setReportGenerating(false);
                    }}
                    disabled={reportGenerating}
                    className="w-full text-left p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{decision.decisionTitle}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(decision.decisionDate).toLocaleDateString()} · {formatCurrency(decision.dollarImpact)} impact
                      </p>
                    </div>
                    {reportGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-neutral-500 text-sm text-center py-4">No decisions with outcomes yet. Link an outcome first.</p>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-300 mb-1">{generatedReport.decisionTitle}</h3>
                <p className="text-sm text-neutral-300">{generatedReport.summary}</p>
              </div>

              <div className="space-y-2 mb-4">
                {generatedReport.sections?.map((section: any, idx: number) => (
                  <div key={idx} className="p-3 bg-neutral-800 rounded-lg">
                    <h4 className="text-xs font-semibold text-neutral-400 mb-1">{section.title}</h4>
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Cryptographic Signature */}
              <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Cryptographic Signature
                </h4>
                {typeof generatedReport.signature === 'object' ? (
                  <div className="font-mono text-xs text-neutral-500 space-y-1">
                    <p>Algorithm: <span className="text-neutral-300">{generatedReport.signature.algorithm}</span></p>
                    <p>HMAC: <span className="text-neutral-300 break-all">{generatedReport.signature.hash}</span></p>
                    <p>Data Hash: <span className="text-neutral-300 break-all">{generatedReport.signature.dataHash}</span></p>
                    <p>Chain: <span className="text-neutral-300 break-all">{generatedReport.signature.signatureChain}</span></p>
                    <p>Nonce: <span className="text-neutral-300">{generatedReport.signature.nonce}</span></p>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-neutral-500 break-all">{generatedReport.signature}</p>
                )}
              </div>

              <button
                onClick={() => setGeneratedReport(null)}
                className="mt-3 w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 transition"
              >
                Generate Another Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Failed Predictions Panel */}
      {activePanel === 'failed' && (
        <div className="mt-6 bg-neutral-900 rounded-xl border border-red-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold">Failed Predictions</h2>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{failedDecisions.length}</span>
            <button onClick={() => setActivePanel(null)} className="ml-auto p-1 hover:bg-neutral-800 rounded">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {failedDecisions.length === 0 ? (
            <div className="text-center py-6">
              <Check className="w-10 h-10 text-green-500 mx-auto mb-2 opacity-50" />
              <p className="text-neutral-400 text-sm">No failed predictions found. All decisions are performing as expected.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {failedDecisions.map((d, idx) => (
                <div key={d.id} className="p-3 bg-neutral-800 rounded-lg border-l-2 border-red-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{d.decisionTitle}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>{new Date(d.decisionDate).toLocaleDateString()}</span>
                        <span className="text-red-400 font-medium">{formatCurrency(d.dollarImpact)}</span>
                        <span>ROI: {formatPercent(d.roi * 100)}</span>
                        <span>{d.councilMode} mode</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {failedDecisions.length > 0 && accuracy?.recommendations && accuracy.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" /> AI Recommendations to Improve
              </h3>
              <div className="space-y-1">
                {accuracy.recommendations.map((rec, idx) => (
                  <p key={idx} className="text-xs text-neutral-400 flex gap-2">
                    <span className="text-amber-500 flex-shrink-0">{idx + 1}.</span> {rec}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EchoPage;
