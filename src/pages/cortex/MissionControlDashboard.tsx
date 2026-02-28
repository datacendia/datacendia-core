// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — INSTITUTIONAL MISSION CONTROL
// =============================================================================
// Bloomberg Terminal meets Air Traffic Control for DDGI (Datacendia Decision Governance Infrastructure).
// Hero: IISS Score. Focus: What needs attention NOW. Action: Council, Analyze, Prove.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../lib/utils';
import { organizationsApi, authApi } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield, Activity, AlertTriangle, Brain, Search, FileCheck,
  Clock, TrendingUp, ChevronRight, Zap, CheckCircle,
  Eye, MessageSquare, BarChart3, Lock, Compass, X,
} from 'lucide-react';
import { NarrativeGuide, NarrativeSelector } from '../../components/ui';
import { getIISSPrimitiveSummary, getIISSTotal } from '../../lib/algorithms/iiss-scoring';

// =============================================================================
// TYPES
// =============================================================================

interface IISSPrimitive {
  id: string;
  name: string;
  score: number;
  status: 'operational' | 'warning' | 'critical';
  note?: string;
}

interface LiveDeliberation {
  id: string;
  title: string;
  subtitle: string;
  agents: string[];
  elapsed: string;
  consensus: number;
  scope: string;
  status: 'active' | 'debating' | 'consensus';
}

interface CriticalAlert {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
  timestamp: Date;
  impact: string;
  actions: { label: string; route: string }[];
}

interface PendingAction {
  id: string;
  title: string;
  subtitle: string;
  type: 'approval' | 'review' | 'sign';
  route: string;
}

interface ComplianceItem {
  framework: string;
  score: number;
  lastChecked: string;
  status: 'compliant' | 'gap' | 'warning';
  gapCount?: number;
}

// =============================================================================
// IISS — THE 9 DECISION PRIMITIVES
// =============================================================================

// IISS primitives computed from the scoring engine (single source of truth)
// Previously hardcoded — now uses the same calculateIISS() as DCII Dashboard
const IISS_PRIMITIVES: IISSPrimitive[] = getIISSPrimitiveSummary();

const IISS_TOTAL = getIISSTotal();

// =============================================================================
// LIVE DATA (demo — replace with real API calls)
// =============================================================================

const LIVE_DELIBERATIONS: LiveDeliberation[] = [
  {
    id: 'del-1',
    title: 'M&A Due Diligence — Series A Target',
    subtitle: 'CFO, CLO, CISO, CRO active',
    agents: ['CFO', 'CLO', 'CISO', 'CRO'],
    elapsed: '23min',
    consensus: 60,
    scope: '$15M investment',
    status: 'active',
  },
  {
    id: 'del-2',
    title: 'Vendor Selection — Cloud Infrastructure',
    subtitle: 'CTO vs CISO debating',
    agents: ['CTO', 'CISO'],
    elapsed: '8min',
    consensus: 40,
    scope: '$800K annual',
    status: 'debating',
  },
  {
    id: 'del-3',
    title: 'Hiring Decision — VP Engineering',
    subtitle: 'CHRO, CTO consensus forming',
    agents: ['CHRO', 'CTO'],
    elapsed: '45min',
    consensus: 85,
    scope: 'Strategic hire',
    status: 'consensus',
  },
];

const CRITICAL_ALERTS: CriticalAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Compliance Drift Detected',
    description: 'EU AI Act Article 14 — Human oversight gap identified',
    timestamp: new Date(Date.now() - 120000),
    impact: 'High',
    actions: [
      { label: 'Review & Remediate', route: '/cortex/compliance' },
      { label: 'Assign Team', route: '/cortex/bridge/approvals' },
    ],
  },
  {
    id: 'alert-2',
    severity: 'critical',
    title: 'Board Approval Required — M&A Decision',
    description: 'Board approval needed by 5pm — $15M acquisition deliberation',
    timestamp: new Date(Date.now() - 480000),
    impact: 'Critical',
    actions: [
      { label: 'Join Council', route: '/cortex/council' },
      { label: 'Escalate', route: '/cortex/bridge/approvals' },
    ],
  },
  {
    id: 'alert-3',
    severity: 'warning',
    title: 'Decision Debt Accumulating',
    description: 'Cloud Migration decision delayed 47 days — cost: $67K/day',
    timestamp: new Date(Date.now() - 3600000),
    impact: 'Medium',
    actions: [
      { label: 'Force Decision', route: '/cortex/council' },
      { label: 'Extend Deadline', route: '/cortex/bridge/approvals' },
    ],
  },
];

const PENDING_ACTIONS: PendingAction[] = [
  { id: 'pa-1', title: 'Q4 Budget Approval', subtitle: '$18M — Finance workflow', type: 'approval', route: '/cortex/bridge/approvals' },
  { id: 'pa-2', title: 'Vendor Contract Review', subtitle: 'Legal review required', type: 'review', route: '/cortex/bridge/approvals' },
  { id: 'pa-3', title: 'VP Engineering Hire', subtitle: 'CHRO recommendation', type: 'approval', route: '/cortex/bridge/approvals' },
  { id: 'pa-4', title: 'Override Sign-off', subtitle: 'Loan #4721 — CFO veto', type: 'sign', route: '/cortex/bridge/approvals' },
  { id: 'pa-5', title: 'SEC Audit Report', subtitle: 'Quarterly filing due in 14 days', type: 'review', route: '/cortex/compliance' },
];

const COMPLIANCE_STATUS: ComplianceItem[] = [
  { framework: 'GDPR', score: 100, lastChecked: '2 days ago', status: 'compliant' },
  { framework: 'HIPAA', score: 100, lastChecked: '1 day ago', status: 'compliant' },
  { framework: 'SOC 2', score: 100, lastChecked: '4 hours ago', status: 'compliant' },
  { framework: 'EU AI Act', score: 98, lastChecked: '1 hour ago', status: 'warning' },
  { framework: 'ISO 27001', score: 94, lastChecked: '6 hours ago', status: 'gap', gapCount: 3 },
];

// =============================================================================
// COLOUR HELPERS
// =============================================================================

const iissColor = (s: number) =>
  s >= 900 ? 'text-emerald-400' : s >= 800 ? 'text-green-400' : s >= 700 ? 'text-yellow-400' : s >= 600 ? 'text-orange-400' : 'text-red-400';

const iissBg = (s: number) =>
  s >= 900
    ? 'from-emerald-500/20 to-emerald-600/5'
    : s >= 800
      ? 'from-green-500/20 to-green-600/5'
      : s >= 700
        ? 'from-yellow-500/20 to-yellow-600/5'
        : s >= 600
          ? 'from-orange-500/20 to-orange-600/5'
          : 'from-red-500/20 to-red-600/5';

const iissLabel = (s: number) =>
  s >= 900 ? 'EXCEPTIONAL' : s >= 800 ? 'EXCELLENT' : s >= 700 ? 'GOOD' : s >= 600 ? 'ADEQUATE' : 'AT RISK';

const dot = (st: string) =>
  st === 'operational' ? 'bg-green-400' : st === 'warning' ? 'bg-yellow-400' : 'bg-red-400';

// =============================================================================
// COMPONENT
// =============================================================================

export const MissionControlDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [userName, setUserName] = useState('User');
  const [orgName, setOrgName] = useState('Your Organization');
  const [isLoading, setIsLoading] = useState(true);

  // Journey state (preserved)
  const [showJourneySelector, setShowJourneySelector] = useState(false);
  const [activeJourney, setActiveJourney] = useState<
    'welcome' | 'executive' | 'dataEngineer' | 'complianceOfficer' | 'strategist' | 'quickStart' | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [orgRes, userRes] = await Promise.all([
          organizationsApi.getCurrent(),
          authApi.getCurrentUser(),
        ]);
        if (orgRes.success && orgRes.data) {setOrgName(orgRes.data.name || 'Your Organization');}
        if (userRes.success && userRes.data) {setUserName(userRes.data.name?.split(' ')[0] || 'User');}
      } catch (e) {
        console.error('Mission Control fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {return t('dashboard.greetings.morning');}
    if (hour < 18) {return t('dashboard.greetings.afternoon');}
    return t('dashboard.greetings.evening');
  };

  const handleJourneyComplete = () => {
    setActiveJourney(null);
    localStorage.setItem('datacendia_journey_completed', 'true');
  };

  const handleSelectJourney = (id: any) => {
    setActiveJourney(id);
    setShowJourneySelector(false);
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1440px] mx-auto flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-500">Loading Mission Control…</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">

      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-100">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Institutional Mission Control — {orgName}
          </p>
        </div>
        <button
          onClick={() => navigate('/cortex/council')}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Brain className="w-4 h-4" />
          Ask Council
        </button>
      </div>

      {/* ================================================================ */}
      {/* IISS SCORE — HERO ELEMENT                                        */}
      {/* ================================================================ */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-neutral-700/50 p-6',
          'bg-gradient-to-br',
          iissBg(IISS_TOTAL),
          'bg-neutral-900/80 backdrop-blur-sm',
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Score Ring */}
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <svg className="w-28 h-28" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-neutral-700/40" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                  className={iissColor(IISS_TOTAL)} stroke="currentColor"
                  strokeDasharray={`${(IISS_TOTAL / 1000) * 326.7} 326.7`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-3xl font-black tracking-tight', iissColor(IISS_TOTAL))}>{IISS_TOTAL}</span>
                <span className="text-[10px] text-neutral-500 font-medium">/1000</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Shield className={cn('w-5 h-5', iissColor(IISS_TOTAL))} />
                <h2 className="text-base font-bold text-neutral-100 tracking-wide">
                  INSTITUTIONAL IMMUNE SYSTEM SCORE
                </h2>
              </div>
              <p className={cn('text-sm font-semibold mt-1', iissColor(IISS_TOTAL))}>
                {iissLabel(IISS_TOTAL)} — ▲ +12 from last quarter
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Insurance Savings: $680K annually · Your Score vs. Industry Avg: +127
              </p>
            </div>
          </div>

          {/* 9 Primitives */}
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              9 Decision Primitives
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
              {IISS_PRIMITIVES.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    'group relative flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all',
                    p.status === 'warning'
                      ? 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20'
                      : 'bg-neutral-800/60 border border-neutral-700/30 hover:bg-neutral-700/40',
                  )}
                  title={`${p.name}: ${p.score}/100`}
                >
                  <span className={cn('text-[10px] font-bold', p.status === 'warning' ? 'text-yellow-400' : 'text-neutral-400')}>
                    {p.id}
                  </span>
                  <span className={cn('text-sm font-bold', p.status === 'warning' ? 'text-yellow-300' : 'text-neutral-200')}>
                    {p.score}
                  </span>
                  <div className={cn('w-1.5 h-1.5 rounded-full mt-0.5', dot(p.status))} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-neutral-400">{p.score}/100 — {p.status === 'warning' ? `⚠ ${p.note}` : '✓ Operational'}</p>
                  </div>
                </div>
              ))}
            </div>
            {IISS_PRIMITIVES.some((p) => p.status === 'warning') && (
              <p className="text-xs text-yellow-400/80 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {IISS_PRIMITIVES.filter((p) => p.status === 'warning').map((p) => `${p.id}: ${p.note}`).join(' · ')}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/cortex/dcii')}
          className="absolute top-4 right-4 text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors"
        >
          View Full DCII Report <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* ================================================================ */}
      {/* STATS ROW                                                        */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Now */}
        <div
          className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-4 cursor-pointer hover:border-blue-500/30 transition-all"
          onClick={() => navigate('/cortex/council')}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Active Now</span>
          </div>
          <p className="text-3xl font-black text-neutral-100">3</p>
          <p className="text-xs text-neutral-500 mt-1">Council Deliberations</p>
          <p className="text-[10px] text-blue-400 mt-2 flex items-center gap-1">
            View Live <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* This Week */}
        <div
          className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/30 transition-all"
          onClick={() => navigate('/cortex/intelligence/chronos')}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">This Week</span>
          </div>
          <p className="text-3xl font-black text-neutral-100">47</p>
          <p className="text-xs text-neutral-500 mt-1">Decisions · 12 pending · 8 overrides</p>
          <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
            23 drift checks <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Risk Status */}
        <div
          className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-4 cursor-pointer hover:border-red-500/30 transition-all"
          onClick={() => navigate('/cortex/pulse/alerts')}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Risk Status</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-red-400">2</span>
            <span className="text-sm text-red-400/70">Critical</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">5 Warning · 94% Compliant</p>
          <p className="text-[10px] text-yellow-400 mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> 5 warnings
          </p>
        </div>

        {/* Compliance */}
        <div
          className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-4 cursor-pointer hover:border-violet-500/30 transition-all"
          onClick={() => navigate('/cortex/compliance')}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Compliance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-green-400">98%</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-xs text-neutral-500 mt-1">2 framework gaps · Next audit: 14 days</p>
          <p className="text-[10px] text-violet-400 mt-2 flex items-center gap-1">
            Prepare package <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CRITICAL ALERTS                                                  */}
      {/* ================================================================ */}
      <div className="bg-neutral-900/80 border border-red-500/20 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Critical Alerts</h3>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
              {CRITICAL_ALERTS.filter((a) => a.severity === 'critical').length}
            </span>
          </div>
          <button
            onClick={() => navigate('/cortex/pulse/alerts')}
            className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors"
          >
            View All (7) <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-neutral-800/50">
          {CRITICAL_ALERTS.map((alert) => (
            <div key={alert.id} className="px-5 py-4 hover:bg-neutral-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    alert.severity === 'critical' ? 'bg-red-500/20' : 'bg-yellow-500/20',
                  )}
                >
                  <AlertTriangle className={cn('w-3.5 h-3.5', alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-sm font-semibold text-neutral-100">{alert.title}</h4>
                    <span className="text-[10px] text-neutral-500">{formatRelativeTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        alert.impact === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        alert.impact === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400',
                      )}
                    >
                      Impact: {alert.impact}
                    </span>
                    {alert.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(action.route)}
                        className={cn(
                          'text-[10px] font-semibold px-3 py-1 rounded-md transition-colors',
                          i === 0
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700',
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* PENDING ACTIONS + LIVE DELIBERATIONS                             */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Pending Actions */}
        <div className="lg:col-span-2 bg-neutral-900/80 border border-neutral-700/50 rounded-xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Your Actions</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                {PENDING_ACTIONS.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/cortex/bridge/approvals')}
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {PENDING_ACTIONS.map((action) => (
              <div
                key={action.id}
                onClick={() => navigate(action.route)}
                className="px-5 py-3 hover:bg-neutral-800/30 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                    action.type === 'approval' ? 'bg-green-500/10' :
                    action.type === 'review' ? 'bg-blue-500/10' : 'bg-purple-500/10',
                  )}
                >
                  {action.type === 'approval' && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                  {action.type === 'review' && <Eye className="w-3.5 h-3.5 text-blue-400" />}
                  {action.type === 'sign' && <FileCheck className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{action.title}</p>
                  <p className="text-[10px] text-neutral-500 truncate">{action.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Live Deliberations */}
        <div className="lg:col-span-3 bg-neutral-900/80 border border-neutral-700/50 rounded-xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <MessageSquare className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Live Deliberations</h3>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                {LIVE_DELIBERATIONS.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/cortex/council')}
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {LIVE_DELIBERATIONS.map((delib) => (
              <div key={delib.id} className="px-5 py-4 hover:bg-neutral-800/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full flex-shrink-0',
                          delib.status === 'active' ? 'bg-green-400' :
                          delib.status === 'debating' ? 'bg-yellow-400' : 'bg-blue-400',
                        )}
                      />
                      <h4 className="text-sm font-semibold text-neutral-100 truncate">{delib.title}</h4>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{delib.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {delib.elapsed}
                      </span>
                      <span className="text-[10px] text-neutral-400">Scope: {delib.scope}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              delib.consensus >= 70 ? 'bg-green-400' :
                              delib.consensus >= 50 ? 'bg-yellow-400' : 'bg-red-400',
                            )}
                            style={{ width: `${delib.consensus}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-500">{delib.consensus}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/cortex/council')}
                    className="px-3 py-1.5 text-xs font-semibold bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    Join <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DECISION INTELLIGENCE ROI                                        */}
      {/* ================================================================ */}
      <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Decision Intelligence</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/cortex/intelligence/chronos')}
              className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              View Analytics
            </button>
            <button className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'This Week', decisions: 47, value: '$24M', blocked: 3, saved: '$8.2M' },
            { label: 'This Month', decisions: 183, value: '$89M', blocked: 12, saved: '$31M' },
            { label: 'This Quarter', decisions: 512, value: '$340M', blocked: 47, saved: '$127M' },
          ].map((period) => (
            <div key={period.label} className="text-center">
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                {period.label}
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-black text-neutral-100">{period.decisions}</p>
                  <p className="text-[10px] text-neutral-500">decisions governed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{period.value}</p>
                  <p className="text-[10px] text-neutral-500">value under governance</p>
                </div>
                <div className="pt-2 border-t border-neutral-800">
                  <p className="text-sm font-bold text-amber-400">{period.blocked} blocked</p>
                  <p className="text-[10px] text-neutral-500">saved {period.saved}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Value Protected</span>
              <p className="text-lg font-black text-emerald-400">$173M</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Platform Cost (Quarter)</span>
              <p className="text-lg font-bold text-neutral-300">$125K</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">ROI</span>
              <p className="text-lg font-black text-amber-400">1,384x</p>
            </div>
          </div>
          <button className="text-xs bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors font-semibold">
            Download Executive Report
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* COMPLIANCE DASHBOARD                                             */}
      {/* ================================================================ */}
      <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Compliance Dashboard</h3>
          </div>
          <span className="text-xs text-neutral-500">Next Audit: SEC (14 days)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {COMPLIANCE_STATUS.map((item) => (
            <div
              key={item.framework}
              className={cn(
                'p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02]',
                item.status === 'compliant' ? 'bg-green-500/5 border-green-500/20' :
                item.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                'bg-orange-500/5 border-orange-500/20',
              )}
              onClick={() => navigate('/cortex/compliance')}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neutral-200">{item.framework}</span>
                {item.status === 'compliant'
                  ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
              <p
                className={cn(
                  'text-xl font-black',
                  item.status === 'compliant' ? 'text-green-400' :
                  item.status === 'warning' ? 'text-yellow-400' : 'text-orange-400',
                )}
              >
                {item.score}%
              </p>
              <p className="text-[10px] text-neutral-500">Last: {item.lastChecked}</p>
              {item.gapCount && (
                <p className="text-[10px] text-orange-400 mt-0.5">Gap: {item.gapCount} controls</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => navigate('/cortex/compliance')}
            className="text-xs bg-violet-500/10 text-violet-400 px-4 py-2 rounded-lg hover:bg-violet-500/20 transition-colors font-semibold"
          >
            Prepare Audit Package
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* QUICK ACTION CTAs — 3 Foundation Pillars                         */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* COUNCIL */}
        <button
          onClick={() => navigate('/cortex/council')}
          className="group bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-5 text-left hover:border-amber-500/40 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-100">THE COUNCIL</h4>
              <p className="text-[10px] text-neutral-500">Start New Deliberation</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Multi-agent AI deliberation with 15 C-suite perspectives</p>
          <p className="text-[10px] text-amber-400 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
            Ask Council <ChevronRight className="w-3 h-3" />
          </p>
        </button>

        {/* ANALYZE */}
        <button
          onClick={() => navigate('/cortex/intelligence/chronos')}
          className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5 text-left hover:border-blue-500/40 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-100">ANALYZE</h4>
              <p className="text-[10px] text-neutral-500">View Past Decisions</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Timeline intelligence, drift detection, decision archaeology</p>
          <p className="text-[10px] text-blue-400 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
            Open Chronos <ChevronRight className="w-3 h-3" />
          </p>
        </button>

        {/* PROVE */}
        <button
          onClick={() => navigate('/cortex/compliance')}
          className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-5 text-left hover:border-emerald-500/40 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-100">PROVE</h4>
              <p className="text-[10px] text-neutral-500">Generate Evidence</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Regulator's Receipt, audit trails, cryptographic proof</p>
          <p className="text-[10px] text-emerald-400 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
            Generate Receipt <ChevronRight className="w-3 h-3" />
          </p>
        </button>
      </div>

      {/* ================================================================ */}
      {/* JOURNEY SYSTEM (preserved)                                       */}
      {/* ================================================================ */}
      {!activeJourney && !showJourneySelector && (
        <button
          onClick={() => setShowJourneySelector(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
        >
          <Compass className="w-5 h-5" />
          <span>Start Your Journey</span>
        </button>
      )}

      {showJourneySelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Choose Your Journey</h2>
                <p className="text-amber-900/70 text-sm mt-1">Select a guided experience tailored to your role</p>
              </div>
              <button onClick={() => setShowJourneySelector(false)} className="text-black/60 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <NarrativeSelector onSelect={handleSelectJourney} />
            </div>
          </div>
        </div>
      )}

      {activeJourney && (
        <NarrativeGuide narrativeId={activeJourney} variant="floating" onComplete={handleJourneyComplete} />
      )}
    </div>
  );
};

export default MissionControlDashboard;
