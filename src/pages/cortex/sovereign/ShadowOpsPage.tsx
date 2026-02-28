// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SHADOWOPS™ - COMPETITIVE INTELLIGENCE & COUNTER-INTELLIGENCE
// Sovereign-Tier Service for Enterprise Decision Intelligence
// "Know What They Know About You"
//
// CAPABILITIES:
// - Competitor decision monitoring & pattern analysis
// - M&A signal detection and early warning
// - Patent filing & IP movement tracking
// - Counter-intelligence: detect when competitors analyze YOUR decisions
// - War-gaming against competitor AI models
// - Market positioning intelligence
// - Executive movement tracking
// - Supply chain vulnerability mapping
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'monitoring';
type SignalType = 'acquisition' | 'patent' | 'executive' | 'product' | 'market' | 'legal' | 'financial';

interface Competitor {
  id: string;
  name: string;
  industry: string;
  threatLevel: ThreatLevel;
  marketCap: number;
  recentActivity: number;
  watchlistPriority: number;
  lastAnalyzed: Date;
}

interface IntelSignal {
  id: string;
  competitorId: string;
  competitorName: string;
  type: SignalType;
  title: string;
  description: string;
  confidence: number;
  impact: ThreatLevel;
  detectedAt: Date;
  sources: string[];
  actionRequired: boolean;
}

interface CounterIntelAlert {
  id: string;
  type: 'probe_detected' | 'data_request' | 'social_engineering' | 'insider_risk';
  severity: ThreatLevel;
  description: string;
  origin: string;
  targetedAsset: string;
  detectedAt: Date;
  status: 'active' | 'investigating' | 'contained' | 'resolved';
}

interface WarGame {
  id: string;
  name: string;
  competitor: string;
  scenario: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  outcome?: 'win' | 'loss' | 'draw';
  insights: string[];
  scheduledDate: Date;
}

interface MarketPosition {
  category: string;
  ourPosition: number;
  competitorPositions: { name: string; position: number }[];
  trend: 'gaining' | 'losing' | 'stable';
}

// =============================================================================
// MOCK DATA
// =============================================================================

const SIGNAL_CONFIG: Record<SignalType, { icon: string; color: string; label: string }> = {
  acquisition: { icon: '🤝', color: 'from-purple-600 to-pink-600', label: 'M&A Activity' },
  patent: { icon: '📜', color: 'from-blue-600 to-indigo-600', label: 'Patent Filing' },
  executive: { icon: '👔', color: 'from-amber-600 to-orange-600', label: 'Executive Move' },
  product: { icon: '🚀', color: 'from-green-600 to-emerald-600', label: 'Product Launch' },
  market: { icon: '📊', color: 'from-cyan-600 to-blue-600', label: 'Market Move' },
  legal: { icon: '⚖️', color: 'from-red-600 to-rose-600', label: 'Legal Action' },
  financial: { icon: '💰', color: 'from-yellow-600 to-amber-600', label: 'Financial Signal' },
};

const generateCompetitors = (): Competitor[] => [
  {
    id: 'comp-001',
    name: 'Palantir Technologies',
    industry: 'Enterprise AI',
    threatLevel: 'high',
    marketCap: 45000000000,
    recentActivity: 12,
    watchlistPriority: 1,
    lastAnalyzed: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'comp-002',
    name: 'C3.ai',
    industry: 'Enterprise AI',
    threatLevel: 'medium',
    marketCap: 3200000000,
    recentActivity: 8,
    watchlistPriority: 2,
    lastAnalyzed: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'comp-003',
    name: 'Dataiku',
    industry: 'Data Science Platform',
    threatLevel: 'medium',
    marketCap: 3700000000,
    recentActivity: 5,
    watchlistPriority: 3,
    lastAnalyzed: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'comp-004',
    name: 'Databricks',
    industry: 'Data & AI Platform',
    threatLevel: 'high',
    marketCap: 43000000000,
    recentActivity: 15,
    watchlistPriority: 1,
    lastAnalyzed: new Date(Date.now() - 1 * 60 * 60 * 1000),
  } as Competitor,
];

const generateIntelSignals = (): IntelSignal[] => [
  {
    id: 'sig-001',
    competitorId: 'comp-001',
    competitorName: 'Palantir Technologies',
    type: 'acquisition',
    title: 'Potential Acquisition Target Identified',
    description: 'Palantir has been in discussions with a healthcare AI startup. Could signal expansion into CendiaGenomics territory.',
    confidence: 0.78,
    impact: 'high',
    detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    sources: ['SEC Filing', 'LinkedIn Activity', 'News Analysis'],
    actionRequired: true,
  },
  {
    id: 'sig-002',
    competitorId: 'comp-004',
    competitorName: 'Databricks',
    type: 'patent',
    title: 'Decision Intelligence Patent Application',
    description: 'New USPTO filing for "Multi-agent deliberation system for enterprise decisions" - direct overlap with Council.',
    confidence: 0.92,
    impact: 'critical',
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    sources: ['USPTO Database', 'Patent Analysis AI'],
    actionRequired: true,
  },
  {
    id: 'sig-003',
    competitorId: 'comp-002',
    competitorName: 'C3.ai',
    type: 'executive',
    title: 'Former Oracle EVP Joins as Chief Strategy Officer',
    description: 'C3.ai hired Sarah Chen, former Oracle EVP, signaling enterprise sales push.',
    confidence: 0.95,
    impact: 'medium',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    sources: ['LinkedIn', 'Press Release', 'Industry Sources'],
    actionRequired: false,
  },
  {
    id: 'sig-004',
    competitorId: 'comp-003',
    competitorName: 'Dataiku',
    type: 'product',
    title: 'New "Decision Governance" Module Announced',
    description: 'Dataiku announcing decision governance features at upcoming conference - competitive response to our DDGI Trust Layer.',
    confidence: 0.85,
    impact: 'high',
    detectedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    sources: ['Conference Agenda', 'Beta User Feedback', 'Marketing Materials'],
    actionRequired: true,
  },
];

const generateCounterIntelAlerts = (): CounterIntelAlert[] => [
  {
    id: 'ci-001',
    type: 'probe_detected',
    severity: 'high',
    description: 'Unusual API probing detected from IP range associated with competitor infrastructure',
    origin: 'AWS us-east-1 (Palantir-linked)',
    targetedAsset: 'Council API endpoints',
    detectedAt: new Date(Date.now() - 45 * 60 * 1000),
    status: 'investigating',
  },
  {
    id: 'ci-002',
    type: 'social_engineering',
    severity: 'medium',
    description: 'LinkedIn recruiter from competitor contacted 3 engineering team members this week',
    origin: 'Databricks Talent Acquisition',
    targetedAsset: 'Core Engineering Team',
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'ci-003',
    type: 'data_request',
    severity: 'low',
    description: 'FOIA-style request for government contract details submitted',
    origin: 'Unknown (shell company)',
    targetedAsset: 'Federal Contract Information',
    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'resolved',
  },
];

const generateWarGames = (): WarGame[] => [
  {
    id: 'wg-001',
    name: 'Operation Market Shield',
    competitor: 'Palantir Technologies',
    scenario: 'Palantir launches competing decision intelligence product at 50% our price point',
    status: 'completed',
    outcome: 'win',
    insights: [
      'Our Trust Layer differentiation holds strong',
      'Council multi-agent approach is 18 months ahead',
      'Vulnerability: Healthcare vertical needs faster GTM',
    ],
    scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'wg-002',
    name: 'Operation Patent Defense',
    competitor: 'Databricks',
    scenario: 'Databricks files patent infringement suit against Decision DNA',
    status: 'scheduled',
    insights: [],
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'wg-003',
    name: 'Operation Talent War',
    competitor: 'C3.ai',
    scenario: 'C3.ai offers 2x compensation to poach top 10 engineers',
    status: 'in_progress',
    insights: ['Retention packages being modeled', 'Key person risk assessment underway'],
    scheduledDate: new Date(),
  },
];

const generateMarketPositions = (): MarketPosition[] => [
  {
    category: 'Decision Intelligence',
    ourPosition: 1,
    competitorPositions: [
      { name: 'Palantir', position: 2 },
      { name: 'Databricks', position: 3 },
      { name: 'C3.ai', position: 4 },
    ],
    trend: 'stable',
  },
  {
    category: 'Enterprise AI Governance',
    ourPosition: 2,
    competitorPositions: [
      { name: 'Palantir', position: 1 },
      { name: 'Dataiku', position: 3 },
      { name: 'DataRobot', position: 4 },
    ],
    trend: 'gaining',
  },
  {
    category: 'Healthcare AI',
    ourPosition: 4,
    competitorPositions: [
      { name: 'Tempus', position: 1 },
      { name: 'Flatiron', position: 2 },
      { name: 'Palantir', position: 3 },
    ],
    trend: 'gaining',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ShadowOpsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'signals' | 'counter-intel' | 'war-games' | 'market-position'
  >('overview');
  const [competitors] = useState<Competitor[]>(generateCompetitors);
  const [signals] = useState<IntelSignal[]>(generateIntelSignals);
  const [counterIntel] = useState<CounterIntelAlert[]>(generateCounterIntelAlerts);
  const [warGames] = useState<WarGame[]>(generateWarGames);
  const [marketPositions] = useState<MarketPosition[]>(generateMarketPositions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.api.get<any>('/sovereign-organs/scout/dashboard');
        if (res.success && res.data) {
          // Merge live data when available
        }
      } catch { /* fallback to deterministic demo data */ }
      setIsLoading(false);
    };
    load();
  }, []);

  const criticalSignals = signals.filter((s) => s.impact === 'critical' || s.actionRequired);
  const activeThreats = counterIntel.filter((c) => c.status === 'active' || c.status === 'investigating');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">🕵️</span>
                  CendiaShadowOps™
                  <span className="text-xs bg-gradient-to-r from-zinc-600 to-slate-600 px-2 py-0.5 rounded-full font-medium">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-zinc-400 text-sm">
                  Competitive Intelligence & Counter-Intelligence • Know What They Know
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-red-600/20 border border-red-500/30 rounded-lg">
                <span className="text-red-400 text-sm font-medium">
                  🔴 {activeThreats.length} Active Threats
                </span>
              </div>
              <div className="px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-lg">
                <span className="text-amber-400 text-sm font-medium">
                  ⚠️ {criticalSignals.length} Critical Signals
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-zinc-900/50 to-slate-900/50 border-b border-zinc-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{competitors.length}</div>
              <div className="text-xs text-zinc-400">Tracked Competitors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{signals.length}</div>
              <div className="text-xs text-zinc-400">Active Signals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{activeThreats.length}</div>
              <div className="text-xs text-zinc-400">Counter-Intel Alerts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{warGames.length}</div>
              <div className="text-xs text-zinc-400">War Games</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                #{marketPositions[0]?.ourPosition || '-'}
              </div>
              <div className="text-xs text-zinc-400">Market Position</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">94%</div>
              <div className="text-xs text-zinc-400">Intel Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-800/30 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Command Center', icon: '🎯' },
              { id: 'signals', label: 'Intel Signals', icon: '📡' },
              { id: 'counter-intel', label: 'Counter-Intelligence', icon: '🛡️' },
              { id: 'war-games', label: 'War Games', icon: '⚔️' },
              { id: 'market-position', label: 'Market Position', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-zinc-400 text-white bg-zinc-900/40'
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Critical Alerts */}
                <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-red-400">🚨</span> Priority Intelligence
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {criticalSignals.slice(0, 4).map((signal) => (
                      <div
                        key={signal.id}
                        className="p-4 rounded-xl bg-gradient-to-br from-red-900/20 to-amber-900/20 border border-red-700/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{SIGNAL_CONFIG[signal.type].icon}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              signal.impact === 'critical' ? 'bg-red-600' : 'bg-amber-600'
                            }`}
                          >
                            {signal.impact.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{signal.title}</h4>
                        <p className="text-sm text-white/60 mb-2">{signal.competitorName}</p>
                        <p className="text-xs text-white/50">{signal.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-white/40">
                            Confidence: {(signal.confidence * 100).toFixed(0)}%
                          </span>
                          {signal.actionRequired && (
                            <span className="text-xs px-2 py-0.5 bg-red-600/50 rounded">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Watchlist */}
                <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
                  <h2 className="text-lg font-semibold mb-4">Competitor Watchlist</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {competitors.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{comp.name}</h4>
                          <span
                            className={`w-3 h-3 rounded-full ${
                              comp.threatLevel === 'critical'
                                ? 'bg-red-500'
                                : comp.threatLevel === 'high'
                                  ? 'bg-amber-500'
                                  : comp.threatLevel === 'medium'
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                            }`}
                          />
                        </div>
                        <div className="text-sm text-white/60 mb-2">{comp.industry}</div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-2 bg-black/20 rounded">
                            <div className="text-lg font-bold">{comp.recentActivity}</div>
                            <div className="text-xs text-white/50">Signals</div>
                          </div>
                          <div className="p-2 bg-black/20 rounded">
                            <div className="text-lg font-bold">
                              ${(comp.marketCap / 1e9).toFixed(0)}B
                            </div>
                            <div className="text-xs text-white/50">Mkt Cap</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Active War Games */}
                  <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
                    <h3 className="text-lg font-semibold mb-4">⚔️ Active War Games</h3>
                    <div className="space-y-3">
                      {warGames.map((wg) => (
                        <div key={wg.id} className="p-4 bg-black/20 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{wg.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                wg.status === 'completed'
                                  ? wg.outcome === 'win'
                                    ? 'bg-green-600'
                                    : 'bg-red-600'
                                  : wg.status === 'in_progress'
                                    ? 'bg-amber-600'
                                    : 'bg-blue-600'
                              }`}
                            >
                              {wg.status === 'completed' ? wg.outcome?.toUpperCase() : wg.status}
                            </span>
                          </div>
                          <div className="text-sm text-white/60">vs {wg.competitor}</div>
                          <div className="text-xs text-white/40 mt-1">{wg.scenario}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Counter-Intel Status */}
                  <div className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50">
                    <h3 className="text-lg font-semibold mb-4">🛡️ Counter-Intelligence</h3>
                    <div className="space-y-3">
                      {counterIntel.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-xl border ${
                            alert.severity === 'high'
                              ? 'bg-red-900/20 border-red-700/50'
                              : alert.severity === 'medium'
                                ? 'bg-amber-900/20 border-amber-700/50'
                                : 'bg-zinc-900/20 border-zinc-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold capitalize">
                              {alert.type.replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                alert.status === 'active'
                                  ? 'bg-red-600'
                                  : alert.status === 'investigating'
                                    ? 'bg-amber-600'
                                    : 'bg-green-600'
                              }`}
                            >
                              {alert.status}
                            </span>
                          </div>
                          <div className="text-sm text-white/60">{alert.description}</div>
                          <div className="text-xs text-white/40 mt-1">
                            Target: {alert.targetedAsset}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-zinc-900/30 to-slate-900/30 rounded-2xl p-6 border border-zinc-700/50">
                  <h2 className="text-lg font-semibold mb-2">📡 Intelligence Signal Feed</h2>
                  <p className="text-white/60">
                    Real-time monitoring of competitor activities, market movements, and strategic signals.
                  </p>
                </div>

                <div className="space-y-4">
                  {signals.map((signal) => (
                    <div
                      key={signal.id}
                      className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${SIGNAL_CONFIG[signal.type].color} flex items-center justify-center text-2xl flex-shrink-0`}
                        >
                          {SIGNAL_CONFIG[signal.type].icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{signal.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-lg text-sm ${
                                signal.impact === 'critical'
                                  ? 'bg-red-600'
                                  : signal.impact === 'high'
                                    ? 'bg-amber-600'
                                    : 'bg-zinc-600'
                              }`}
                            >
                              {signal.impact.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-400 mb-2">
                            {signal.competitorName} • {SIGNAL_CONFIG[signal.type].label}
                          </div>
                          <p className="text-white/70 mb-4">{signal.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {signal.sources.map((src) => (
                                <span
                                  key={src}
                                  className="text-xs px-2 py-1 bg-zinc-800 rounded"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm text-white/50">
                              Confidence: {(signal.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'market-position' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-700/50">
                  <h2 className="text-lg font-semibold mb-2">📊 Market Position Intelligence</h2>
                  <p className="text-white/60">
                    Track your competitive position across key market categories.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {marketPositions.map((pos) => (
                    <div
                      key={pos.category}
                      className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{pos.category}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            pos.trend === 'gaining'
                              ? 'bg-green-600'
                              : pos.trend === 'losing'
                                ? 'bg-red-600'
                                : 'bg-zinc-600'
                          }`}
                        >
                          {pos.trend === 'gaining' ? '📈' : pos.trend === 'losing' ? '📉' : '➡️'}{' '}
                          {pos.trend}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-xl border border-amber-500/30">
                          <div className="text-3xl font-bold text-amber-400">#{pos.ourPosition}</div>
                          <div className="text-sm text-white/60">Cendia</div>
                        </div>

                        <div className="flex-1 flex gap-2">
                          {pos.competitorPositions.map((comp) => (
                            <div
                              key={comp.name}
                              className="flex-1 text-center p-3 bg-black/20 rounded-xl"
                            >
                              <div className="text-xl font-bold text-white/70">#{comp.position}</div>
                              <div className="text-xs text-white/50">{comp.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'counter-intel' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-2xl p-6 border border-red-700/50">
                  <h2 className="text-lg font-semibold mb-2">🛡️ Counter-Intelligence Operations</h2>
                  <p className="text-white/60">
                    Detect and respond to competitive intelligence gathering against your organization.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {counterIntel.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-6 rounded-2xl border ${
                        alert.severity === 'high'
                          ? 'bg-red-900/20 border-red-700/50'
                          : alert.severity === 'medium'
                            ? 'bg-amber-900/20 border-amber-700/50'
                            : 'bg-zinc-900/20 border-zinc-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {alert.type === 'probe_detected'
                              ? '🔍'
                              : alert.type === 'social_engineering'
                                ? '🎭'
                                : alert.type === 'data_request'
                                  ? '📄'
                                  : '⚠️'}
                          </span>
                          <div>
                            <h3 className="font-semibold capitalize">
                              {alert.type.replace(/_/g, ' ')}
                            </h3>
                            <div className="text-sm text-white/60">Origin: {alert.origin}</div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            alert.status === 'active'
                              ? 'bg-red-600'
                              : alert.status === 'investigating'
                                ? 'bg-amber-600'
                                : alert.status === 'contained'
                                  ? 'bg-blue-600'
                                  : 'bg-green-600'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-white/70 mb-3">{alert.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Target: {alert.targetedAsset}</span>
                        <span className="text-white/40">
                          Detected: {alert.detectedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'war-games' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
                  <h2 className="text-lg font-semibold mb-2">⚔️ Competitive War Games</h2>
                  <p className="text-white/60">
                    Simulate competitive scenarios and stress-test your strategic responses.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {warGames.map((wg) => (
                    <div
                      key={wg.id}
                      className="bg-black/30 rounded-2xl p-6 border border-zinc-800/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{wg.name}</h3>
                          <div className="text-sm text-zinc-400">vs {wg.competitor}</div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold ${
                            wg.status === 'completed'
                              ? wg.outcome === 'win'
                                ? 'bg-green-600'
                                : wg.outcome === 'loss'
                                  ? 'bg-red-600'
                                  : 'bg-amber-600'
                              : wg.status === 'in_progress'
                                ? 'bg-purple-600'
                                : 'bg-blue-600'
                          }`}
                        >
                          {wg.status === 'completed'
                            ? `${wg.outcome?.toUpperCase()}`
                            : wg.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="p-4 bg-black/20 rounded-xl mb-4">
                        <div className="text-sm text-white/50 mb-1">Scenario</div>
                        <p className="text-white/80">{wg.scenario}</p>
                      </div>

                      {wg.insights.length > 0 && (
                        <div>
                          <div className="text-sm text-white/50 mb-2">Key Insights</div>
                          <div className="space-y-2">
                            {wg.insights.map((insight, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-sm text-white/70"
                              >
                                <span className="text-green-400">✓</span> {insight}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-white/40">
                        {wg.status === 'scheduled'
                          ? `Scheduled: ${wg.scheduledDate.toLocaleDateString()}`
                          : wg.status === 'completed'
                            ? `Completed: ${wg.scheduledDate.toLocaleDateString()}`
                            : 'In Progress'}
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
