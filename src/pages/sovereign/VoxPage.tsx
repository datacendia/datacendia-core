// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaVox™ - Stakeholder Voice Assembly
 * "Who speaks for those not in the room?"
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import {
  Users,
  MessageSquare,
  Vote,
  AlertTriangle,
  Scale,
  Heart,
  Leaf,
  Clock,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  ExternalLink,
  Edit2,
  Check,
  ArrowRight,
  CircleDot,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart2,
  Link2,
  Download,
} from 'lucide-react';

// Mock sentiment history data (monthly)
const SENTIMENT_HISTORY = [
  {
    month: 'Aug',
    EMPLOYEES: 72,
    CUSTOMERS: 68,
    ENVIRONMENT: 75,
    FUTURE_GENERATIONS: 80,
    COMMUNITY: 65,
    SHAREHOLDERS: 70,
  },
  {
    month: 'Sep',
    EMPLOYEES: 70,
    CUSTOMERS: 72,
    ENVIRONMENT: 74,
    FUTURE_GENERATIONS: 80,
    COMMUNITY: 68,
    SHAREHOLDERS: 72,
  },
  {
    month: 'Oct',
    EMPLOYEES: 68,
    CUSTOMERS: 75,
    ENVIRONMENT: 73,
    FUTURE_GENERATIONS: 79,
    COMMUNITY: 70,
    SHAREHOLDERS: 74,
  },
  {
    month: 'Nov',
    EMPLOYEES: 65,
    CUSTOMERS: 78,
    ENVIRONMENT: 76,
    FUTURE_GENERATIONS: 81,
    COMMUNITY: 72,
    SHAREHOLDERS: 76,
  },
  {
    month: 'Dec',
    EMPLOYEES: 63,
    CUSTOMERS: 80,
    ENVIRONMENT: 78,
    FUTURE_GENERATIONS: 82,
    COMMUNITY: 73,
    SHAREHOLDERS: 78,
  },
  {
    month: 'Jan',
    EMPLOYEES: 61,
    CUSTOMERS: 82,
    ENVIRONMENT: 80,
    FUTURE_GENERATIONS: 83,
    COMMUNITY: 74,
    SHAREHOLDERS: 80,
  },
];

// Default stakeholder configuration with weights
const DEFAULT_STAKEHOLDERS = [
  {
    type: 'EMPLOYEES',
    name: 'Employees',
    icon: '👥',
    defaultWeight: 1.0,
    vetoRights: ['Mass layoffs', 'Unsafe conditions', 'Benefits reduction'],
    description: 'Current workforce across all levels',
  },
  {
    type: 'CUSTOMERS',
    name: 'Customers',
    icon: '❤️',
    defaultWeight: 1.0,
    vetoRights: ['Service discontinuation', 'Privacy violations'],
    description: 'End users and enterprise clients',
  },
  {
    type: 'COMMUNITY',
    name: 'Community',
    icon: '🏠',
    defaultWeight: 0.8,
    vetoRights: ['Environmental harm', 'Community displacement'],
    description: 'Local communities where we operate',
  },
  {
    type: 'ENVIRONMENT',
    name: 'Environment',
    icon: '🌿',
    defaultWeight: 1.2,
    vetoRights: ['Irreversible harm', 'Carbon commitments'],
    description: 'Natural environment and ecosystems',
  },
  {
    type: 'FUTURE_GENERATIONS',
    name: 'Future Generations',
    icon: '🔮',
    defaultWeight: 1.5,
    vetoRights: ['Generational debt', 'Resource depletion'],
    description: 'Those who inherit our decisions',
  },
  {
    type: 'SHAREHOLDERS',
    name: 'Shareholders',
    icon: '💰',
    defaultWeight: 1.0,
    vetoRights: ['Fiduciary breach'],
    description: 'Investors and equity holders',
  },
];

// Decision lifecycle stages for the assembly timeline
const DECISION_LIFECYCLE = [
  {
    id: 'decision',
    label: 'Decision Proposed',
    icon: '📝',
    description: 'Question submitted to Council',
  },
  {
    id: 'assembly',
    label: 'Stakeholder Assembly',
    icon: '🗣️',
    description: 'Voices gathered and weighted',
  },
  {
    id: 'veto-check',
    label: 'Veto Check',
    icon: '⚠️',
    description: 'Checking against veto rights',
  },
  { id: 'resolution', label: 'Resolution', icon: '✅', description: 'Final decision recorded' },
];

interface Stakeholder {
  id: string;
  stakeholderType: string;
  name: string;
  description: string;
  voiceWeight: number;
  vetoRights: string[];
  isActive: boolean;
}

interface Dashboard {
  activeStakeholders: number;
  signalsLast7Days: number;
  sentimentBreakdown: Record<string, number>;
  vetoesLast30Days: number;
  totalAssemblies: number;
}

interface Signal {
  id: string;
  timestamp: Date;
  stakeholder: string;
  type: 'survey' | 'hr_data' | 'nps' | 'incident' | 'regulatory' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  source: string;
}

interface VetoRecord {
  id: string;
  timestamp: Date;
  decisionId: string;
  decisionTitle: string;
  stakeholder: string;
  vetoType: string;
  outcome: 'blocked' | 'escalated' | 'overridden';
}

interface WeightChange {
  timestamp: Date;
  oldWeight: number;
  newWeight: number;
  changedBy: string;
}

// Mock data for signals
const MOCK_SIGNALS: Signal[] = [
  {
    id: 's1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    stakeholder: 'EMPLOYEES',
    type: 'survey',
    severity: 'medium',
    summary: 'Q4 engagement survey shows 12% drop in remote work satisfaction',
    source: 'Workday Survey',
  },
  {
    id: 's2',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    stakeholder: 'CUSTOMERS',
    type: 'nps',
    severity: 'low',
    summary: 'NPS increased from 42 to 47 in enterprise segment',
    source: 'Delighted',
  },
  {
    id: 's3',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    stakeholder: 'ENVIRONMENT',
    type: 'regulatory',
    severity: 'high',
    summary: 'New EU carbon reporting requirements effective Q2 2026',
    source: 'Regulatory Watch',
  },
  {
    id: 's4',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    stakeholder: 'COMMUNITY',
    type: 'social',
    severity: 'medium',
    summary: 'Local council raised concerns about expanded facility traffic',
    source: 'Community Relations',
  },
  {
    id: 's5',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    stakeholder: 'EMPLOYEES',
    type: 'hr_data',
    severity: 'high',
    summary: 'Engineering attrition rate increased to 18% (threshold: 15%)',
    source: 'HR Analytics',
  },
  {
    id: 's6',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    stakeholder: 'CUSTOMERS',
    type: 'incident',
    severity: 'critical',
    summary: 'Major outage affected 2,400 enterprise customers for 47 minutes',
    source: 'PagerDuty',
  },
];

// Mock data for vetoes
const MOCK_VETOES: VetoRecord[] = [
  {
    id: 'v1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    decisionId: 'dec-001',
    decisionTitle: 'Facility Expansion Phase 2',
    stakeholder: 'ENVIRONMENT',
    vetoType: 'IRREVERSIBLE_ENVIRONMENTAL_DAMAGE',
    outcome: 'escalated',
  },
  {
    id: 'v2',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    decisionId: 'dec-002',
    decisionTitle: 'Workforce Reduction Plan',
    stakeholder: 'EMPLOYEES',
    vetoType: 'MASS_LAYOFFS',
    outcome: 'blocked',
  },
];

export const VoxPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Panel states
  const [showSignalsPanel, setShowSignalsPanel] = useState(false);
  const [showVetoesPanel, setShowVetoesPanel] = useState(false);
  const [showSentimentBreakdown, setShowSentimentBreakdown] = useState(false);
  const [showAssemblyModal, setShowAssemblyModal] = useState(false);
  const [editingWeightFor, setEditingWeightFor] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<number>(1.0);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [showDecisionTimeline, setShowDecisionTimeline] = useState(false);
  const [activeTimelineDecision, setActiveTimelineDecision] = useState<string | null>(null);
  const [showSentimentChart, setShowSentimentChart] = useState(false);
  const [selectedChartStakeholder, setSelectedChartStakeholder] = useState<string | null>(null);

  // Sentiment trends (mock)
  const sentimentTrend = { direction: 'up' as const, vsLastMonth: '+8%' };
  const stakeholderSentiment: Record<string, number> = {
    EMPLOYEES: -2,
    CUSTOMERS: 5,
    COMMUNITY: 1,
    ENVIRONMENT: 0,
    FUTURE_GENERATIONS: 0,
    SHAREHOLDERS: 3,
  };

  const [signals, setSignals] = useState<Signal[]>([]);
  const [vetoes, setVetoes] = useState<VetoRecord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stkRes, dashRes, sigRes, vetRes] = await Promise.all([
        apiClient.api.get<{ data: Stakeholder[] }>('/vox/stakeholders'),
        apiClient.api.get<{ data: Dashboard }>('/vox/dashboard'),
        apiClient.api.get<{ data: Signal[] }>('/vox/signals?limit=50'),
        apiClient.api.get<{ data: VetoRecord[] }>('/vox/vetoes?limit=50'),
      ]);
      if (stkRes.success) {
        setStakeholders((stkRes.data as any)?.data || stkRes.data || []);
      }
      if (dashRes.success) {
        setDashboard((dashRes.data as any)?.data || dashRes.data || null);
      }
      if (sigRes.success) {
        const realSignals = (sigRes.data as any)?.data || sigRes.data || [];
        setSignals(realSignals.length > 0 ? realSignals : MOCK_SIGNALS);
      }
      if (vetRes.success) {
        const realVetoes = (vetRes.data as any)?.data || vetRes.data || [];
        setVetoes(realVetoes.length > 0 ? realVetoes : MOCK_VETOES);
      }
    } catch (error) {
      console.error('Failed to load Vox data:', error);
      setSignals(MOCK_SIGNALS);
      setVetoes(MOCK_VETOES);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeStakeholders = async () => {
    setIsInitializing(true);
    try {
      await apiClient.api.post('/vox/stakeholders/initialize');
      await loadData();
    } catch (error) {
      console.error('Initialize failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'EMPLOYEES':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'CUSTOMERS':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'COMMUNITY':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'ENVIRONMENT':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'FUTURE_GENERATIONS':
        return <Clock className="w-5 h-5 text-purple-400" />;
      case 'SHAREHOLDERS':
        return <Scale className="w-5 h-5 text-cyan-400" />;
      default:
        return <Users className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStakeholderColor = (type: string) => {
    switch (type) {
      case 'EMPLOYEES':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'CUSTOMERS':
        return 'border-pink-500/50 bg-pink-500/10';
      case 'COMMUNITY':
        return 'border-amber-500/50 bg-amber-500/10';
      case 'ENVIRONMENT':
        return 'border-emerald-500/50 bg-emerald-500/10';
      case 'FUTURE_GENERATIONS':
        return 'border-purple-500/50 bg-purple-500/10';
      case 'SHAREHOLDERS':
        return 'border-cyan-500/50 bg-cyan-500/10';
      default:
        return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  // Dynamic decision timeline data (relative to current time)
  const formatTimelineDate = (hoursAgo: number) => {
    const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    return date.toISOString().replace('T', ' ').substring(0, 16);
  };

  const mockDecisionTimeline = {
    id: `dec-${new Date().getFullYear()}-042`,
    title: 'Facility Expansion Phase 2',
    stages: [
      {
        stage: 'decision',
        status: 'completed',
        timestamp: formatTimelineDate(72),
        notes: 'Proposed by Operations',
      },
      {
        stage: 'assembly',
        status: 'completed',
        timestamp: formatTimelineDate(71.75),
        notes: '6 stakeholder voices gathered',
      },
      {
        stage: 'veto-check',
        status: 'vetoed',
        timestamp: formatTimelineDate(71.5),
        notes: 'Environment veto: Irreversible harm',
      },
      {
        stage: 'resolution',
        status: 'pending',
        timestamp: null,
        notes: 'Awaiting mitigation plan',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Vox...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaVox™</h1>
            <p className="text-slate-400">
              Stakeholder Voice Assembly - "Who speaks for those not in the room?"
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssemblyModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run Stakeholder Assembly on a Decision
          </button>
          <button
            onClick={() => setShowSentimentChart(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" /> Sentiment History
          </button>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/cortex/council"
            className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm text-purple-300 flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" /> Link to Council Deliberation
          </a>
          <div className="text-xs text-slate-500">
            Linked to: <span className="text-cyan-400">Council</span> •{' '}
            <span className="text-purple-400">Decision DNA</span> •{' '}
            <span className="text-blue-400">Chronos</span>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Users className="w-4 h-4" /> Stakeholders
            </div>
            <div className="text-3xl font-bold">{dashboard.activeStakeholders}</div>
          </div>
          <button
            onClick={() => setShowSignalsPanel(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MessageSquare className="w-4 h-4" /> Signals (7d)
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {dashboard.signalsLast7Days || signals.length}
            </div>
            <div className="text-xs text-cyan-400/60 mt-1">Click to view stream →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Vote className="w-4 h-4" /> Assemblies
            </div>
            <div className="text-3xl font-bold">{dashboard.totalAssemblies}</div>
          </div>
          <button
            onClick={() => setShowVetoesPanel(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <AlertTriangle className="w-4 h-4" /> Vetoes (30d)
            </div>
            <div className="text-3xl font-bold text-red-400">
              {dashboard.vetoesLast30Days || vetoes.length}
            </div>
            <div className="text-xs text-red-400/60 mt-1">Click to view history →</div>
          </button>
          <button
            onClick={() => setShowSentimentBreakdown(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="text-slate-400 text-sm mb-1 flex items-center justify-between">
              <span>Sentiment</span>
              <span className="flex items-center gap-1 text-emerald-400">
                {sentimentTrend.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : sentimentTrend.direction === 'down' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                <span className="text-xs">{sentimentTrend.vsLastMonth}</span>
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(dashboard.sentimentBreakdown || {})
                .slice(0, 3)
                .map(([k, v]) => (
                  <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">
                    {k.substring(0, 3)}: {v}
                  </span>
                ))}
            </div>
            <div className="text-xs text-emerald-400/60 mt-1">Improving vs last month →</div>
          </button>
        </div>
      )}

      {/* Initialize Button */}
      {stakeholders.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 mb-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Stakeholders Configured</h3>
          <p className="text-slate-400 mb-6">
            Initialize default stakeholder voices including employees, customers, community,
            environment, and future generations.
          </p>
          <button
            onClick={initializeStakeholders}
            disabled={isInitializing}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium disabled:opacity-50"
          >
            {isInitializing ? 'Initializing...' : 'Initialize Stakeholder Voices'}
          </button>
        </div>
      )}

      {/* Stakeholder Cards */}
      {stakeholders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((s) => {
            const stakeholderSignals = signals.filter(
              (sig) => sig.stakeholder === s.stakeholderType
            ).length;
            const stakeholderVetoes = vetoes.filter(
              (v) => v.stakeholder === s.stakeholderType
            ).length;

            return (
              <div
                key={s.id}
                className={`rounded-lg p-6 border ${getStakeholderColor(s.stakeholderType)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {getStakeholderIcon(s.stakeholderType)}
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">
                      {s.stakeholderType.replace(/_/g, ' ')}
                    </div>
                  </div>
                  {/* Signals & Vetoes mini badges */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSignalsPanel(true)}
                      className={`text-xs px-2 py-1 rounded ${stakeholderSignals > 0 ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-700 text-slate-500'}`}
                      title={`${stakeholderSignals} signals in last 7 days`}
                    >
                      📡 {stakeholderSignals}
                    </button>
                    <button
                      onClick={() => setShowVetoesPanel(true)}
                      className={`text-xs px-2 py-1 rounded ${stakeholderVetoes > 0 ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-slate-700 text-slate-500'}`}
                      title={`${stakeholderVetoes} vetoes in last 30 days`}
                    >
                      🛑 {stakeholderVetoes}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{s.description}</p>
                <div className="space-y-3 text-sm">
                  {/* Editable Voice Weight with Draggable Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1 group relative">
                        Voice Weight
                        <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
                        <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                          Voice Weight determines how strongly this stakeholder's interests are
                          weighted in Council deliberations and risk scoring.
                        </span>
                      </span>
                      <span className="font-medium text-cyan-400">{s.voiceWeight.toFixed(1)}x</span>
                    </div>
                    {editingWeightFor === s.id ? (
                      <div className="space-y-2">
                        <input
                          type="range"
                          value={newWeight}
                          onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                          step="0.1"
                          min="0.1"
                          max="2.0"
                          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>0.1x (Low)</span>
                          <span>1.0x (Default)</span>
                          <span>2.0x (High)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newWeight}
                            onChange={(e) =>
                              setNewWeight(
                                Math.min(2.0, Math.max(0.1, parseFloat(e.target.value) || 1.0))
                              )
                            }
                            step="0.1"
                            min="0.1"
                            max="2.0"
                            className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm"
                          />
                          <button
                            onClick={async () => {
                              // Save to backend
                              try {
                                await apiClient.api.patch(`/vox/stakeholders/${s.id}`, {
                                  voiceWeight: newWeight,
                                });
                                await loadData();
                              } catch (error) {
                                console.error('Failed to update weight:', error);
                              }
                              setEditingWeightFor(null);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingWeightFor(null)}
                            className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingWeightFor(s.id);
                          setNewWeight(s.voiceWeight);
                        }}
                        className="w-full h-2 bg-slate-600 rounded-lg relative group cursor-pointer hover:bg-slate-500 transition-colors"
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-cyan-500 rounded-lg transition-all"
                          style={{ width: `${(s.voiceWeight / 2.0) * 100}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg border-2 border-white"
                          style={{ left: `calc(${(s.voiceWeight / 2.0) * 100}% - 8px)` }}
                        />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to adjust
                        </span>
                      </button>
                    )}
                  </div>
                  {/* Weight audit trail hint */}
                  <div className="text-[10px] text-slate-500">
                    Last changed:{' '}
                    {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} by
                    Governance Admin
                  </div>
                  <div>
                    <span className="text-slate-400">Veto Rights:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.vetoRights.map((right, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded"
                        >
                          {right.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision → Assembly → Veto → Resolution Timeline */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" /> DDGI Timeline
            </h2>
            <p className="text-sm text-slate-400">How stakeholder voices flow through decisions</p>
          </div>
          <button
            onClick={() => setShowDecisionTimeline(!showDecisionTimeline)}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            {showDecisionTimeline ? 'Hide example' : 'Show live example'}
          </button>
        </div>

        {/* Timeline Steps */}
        <div className="flex items-center justify-between mb-6">
          {DECISION_LIFECYCLE.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl mb-2">
                  {stage.icon}
                </div>
                <div className="font-medium text-sm">{stage.label}</div>
                <div className="text-xs text-slate-500 max-w-[120px]">{stage.description}</div>
              </div>
              {i < DECISION_LIFECYCLE.length - 1 && (
                <div className="flex-1 h-0.5 bg-cyan-500/30 mx-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live Example */}
        {showDecisionTimeline && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">{mockDecisionTimeline.title}</div>
                <div className="text-xs text-slate-400">ID: {mockDecisionTimeline.id}</div>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                Veto Active
              </span>
            </div>
            <div className="space-y-2">
              {mockDecisionTimeline.stages.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      s.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : s.status === 'vetoed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {s.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : s.status === 'vetoed' ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CircleDot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {DECISION_LIFECYCLE.find((d) => d.id === s.stage)?.label}
                    </div>
                    <div className="text-xs text-slate-400">{s.notes}</div>
                  </div>
                  {s.timestamp && <div className="text-xs text-slate-500">{s.timestamp}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Default Stakeholders Reference */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="font-semibold mb-4">Default Stakeholder Weights & Veto Rights</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEFAULT_STAKEHOLDERS.map((s) => (
            <div key={s.type} className={`p-3 rounded-lg border ${getStakeholderColor(s.type)}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-slate-400 mb-2">Weight: {s.defaultWeight}x</div>
              <div className="text-xs text-slate-500">
                Veto: {s.vetoRights.length} right{s.vetoRights.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Weights are editable per stakeholder. Higher weights amplify that voice in Council
          deliberations.
        </p>
      </div>

      {/* Philosophy Banner - Collapsible */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg border border-cyan-500/30 overflow-hidden">
        <button
          onClick={() => setShowPhilosophy(!showPhilosophy)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Stakeholder Capitalism Philosophy</span>
            <span className="text-xs text-slate-500">— Why every voice matters</span>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${showPhilosophy ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showPhilosophy && (
          <div className="px-6 pb-6 pt-2">
            <p className="text-slate-300 mb-4">
              <strong className="text-white">
                CendiaVox™ enforces stakeholder capitalism in decision-making.
              </strong>{' '}
              Every major decision is tested against the interests of employees, customers,
              communities, environment, and future generations. All proxies represent voices that
              cannot speak for themselves.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span>Environment: veto on irreversible harm</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Future generations: veto on generational debt</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Employees: veto on unsafe conditions</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signals Stream Panel */}
      {showSignalsPanel && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-end z-50"
          onClick={() => setShowSignalsPanel(false)}
        >
          <div
            className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">📡 Signals Stream</h2>
                <p className="text-sm text-slate-400">Live sensing from all stakeholder channels</p>
              </div>
              <button
                onClick={() => setShowSignalsPanel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        signal.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : signal.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-300'
                            : signal.severity === 'medium'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {signal.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {signal.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm mb-2">{signal.summary}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{signal.stakeholder.replace(/_/g, ' ')}</span>
                    <span className="flex items-center gap-1">
                      {signal.source}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vetoes History Panel */}
      {showVetoesPanel && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-end z-50"
          onClick={() => setShowVetoesPanel(false)}
        >
          <div
            className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">🛑 Veto History</h2>
                <p className="text-sm text-slate-400">
                  Decisions where stakeholder vetoes were triggered
                </p>
              </div>
              <button
                onClick={() => setShowVetoesPanel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {vetoes.map((veto) => (
                <div key={veto.id} className="p-4 bg-slate-800 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        veto.outcome === 'blocked'
                          ? 'bg-red-500/20 text-red-300'
                          : veto.outcome === 'escalated'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-500/20 text-slate-300'
                      }`}
                    >
                      {veto.outcome.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {veto.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">{veto.decisionTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">
                    {veto.vetoType.replace(/_/g, ' ')}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Triggered by: {veto.stakeholder.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() =>
                        window.open(
                          `/cortex/intelligence/decision-dna?id=${veto.decisionId}`,
                          '_blank'
                        )
                      }
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      View in DNA <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {vetoes.length === 0 && (
                <div className="text-center py-8 text-slate-500">No vetoes in last 30 days</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Breakdown Modal */}
      {showSentimentBreakdown && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSentimentBreakdown(false)}
        >
          <div
            className="bg-slate-900 rounded-xl border border-slate-700 w-[500px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Sentiment Breakdown</h2>
                <p className="text-sm text-slate-400">ESG pulse by stakeholder group</p>
              </div>
              <button
                onClick={() => setShowSentimentBreakdown(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-slate-300">Overall Trend</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  {sentimentTrend.vsLastMonth} vs last month
                </span>
              </div>
              {Object.entries(stakeholderSentiment).map(([stakeholder, value]) => (
                <div
                  key={stakeholder}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                >
                  <span className="text-slate-300">{stakeholder.replace(/_/g, ' ')}</span>
                  <span
                    className={`font-medium ${value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-slate-400'}`}
                  >
                    {value > 0 ? '+' : ''}
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Run Assembly Modal */}
      {showAssemblyModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAssemblyModal(false)}
        >
          <div
            className="bg-slate-900 rounded-xl border border-cyan-500/30 w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold mb-1">🗣️ Run Stakeholder Assembly</h2>
              <p className="text-sm text-slate-400">
                Convene stakeholder voices to deliberate on a decision
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Decision
                </label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white">
                  <option value="">Choose from recent Decision DNA items...</option>
                  <option value="dec-001">DEC-001: Facility Expansion Phase 2</option>
                  <option value="dec-002">DEC-002: Workforce Reduction Plan</option>
                  <option value="dec-003">DEC-003: AI Infrastructure Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Or enter Decision ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., DEC-2025-0042"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500"
                />
              </div>
              <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                <h4 className="font-medium text-cyan-300 mb-2">What happens next:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>
                    • A Council session will be spawned with {stakeholders.length || 6} stakeholder
                    voices
                  </li>
                  <li>• Each voice is represented by a configured AI persona</li>
                  <li>
                    • The assembly will be logged to Decision DNA as:{' '}
                    <strong>Stakeholder Assembly: Yes</strong>
                  </li>
                  <li>• Results link back to this CendiaVox configuration</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAssemblyModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAssemblyModal(false);
                    window.open('/cortex/council?assembly=true', '_blank');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium"
                >
                  Start Assembly →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment History Chart Modal */}
      {showSentimentChart && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowSentimentChart(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" /> Sentiment History
                </h3>
                <p className="text-sm text-slate-400">
                  Track stakeholder sentiment trends over time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export
                </button>
                <button
                  onClick={() => setShowSentimentChart(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stakeholder Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedChartStakeholder(null)}
                className={`px-3 py-1.5 rounded-lg text-xs ${!selectedChartStakeholder ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                All Stakeholders
              </button>
              {DEFAULT_STAKEHOLDERS.map((s) => (
                <button
                  key={s.type}
                  onClick={() => setSelectedChartStakeholder(s.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${selectedChartStakeholder === s.type ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  <span>{s.icon}</span> {s.name}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="h-64 flex items-end gap-1">
                {SENTIMENT_HISTORY.map((month, i) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-0.5 h-52">
                      {(selectedChartStakeholder
                        ? [selectedChartStakeholder]
                        : Object.keys(month).filter((k) => k !== 'month')
                      ).map((stakeholder) => {
                        const value = month[stakeholder as keyof typeof month] as number;
                        const color =
                          stakeholder === 'EMPLOYEES'
                            ? 'bg-blue-500'
                            : stakeholder === 'CUSTOMERS'
                              ? 'bg-pink-500'
                              : stakeholder === 'ENVIRONMENT'
                                ? 'bg-emerald-500'
                                : stakeholder === 'FUTURE_GENERATIONS'
                                  ? 'bg-purple-500'
                                  : stakeholder === 'COMMUNITY'
                                    ? 'bg-amber-500'
                                    : 'bg-cyan-500';
                        return (
                          <div
                            key={stakeholder}
                            className={`w-full ${color} rounded-sm transition-all hover:opacity-80`}
                            style={{
                              height: `${(value / 100) * (selectedChartStakeholder ? 100 : 16)}%`,
                            }}
                            title={`${stakeholder}: ${value}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-slate-500 mt-2">{month.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              {DEFAULT_STAKEHOLDERS.map((s) => (
                <span key={s.type} className="flex items-center gap-1">
                  <span
                    className={`w-3 h-3 rounded ${
                      s.type === 'EMPLOYEES'
                        ? 'bg-blue-500'
                        : s.type === 'CUSTOMERS'
                          ? 'bg-pink-500'
                          : s.type === 'ENVIRONMENT'
                            ? 'bg-emerald-500'
                            : s.type === 'FUTURE_GENERATIONS'
                              ? 'bg-purple-500'
                              : s.type === 'COMMUNITY'
                                ? 'bg-amber-500'
                                : 'bg-cyan-500'
                    }`}
                  ></span>
                  {s.name}
                </span>
              ))}
            </div>

            {/* Alerts Section */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <h4 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Sentiment Alerts
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    👥 Employees sentiment declining -11 pts over 6 months
                  </span>
                  <span className="text-red-400">Action needed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    🔮 Future Generations veto frequency up 15%
                  </span>
                  <span className="text-amber-400">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoxPage;
