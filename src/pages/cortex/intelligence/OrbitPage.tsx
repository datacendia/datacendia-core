// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaOrbit™
// =============================================================================
// 30,000ft orbital view. Pattern detection, anomaly alerts, trend visualization.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import {
  Globe, TrendingUp, TrendingDown, AlertTriangle, Activity, Eye,
  Layers, Target, Zap, Clock, ChevronRight, Search, RefreshCw,
} from 'lucide-react';

interface OrbitalSignal {
  id: string;
  category: 'pattern' | 'anomaly' | 'trend' | 'risk';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  source: string;
  confidence: number;
}

const SIGNALS: OrbitalSignal[] = [
  { id: 's1', category: 'pattern', title: 'Recurring approval bottleneck in Q1 budget cycles', description: 'Same 3 decision types delayed >5 days each quarter. Automation candidate.', severity: 'medium', detectedAt: '2h ago', source: 'Decision Flow Analysis', confidence: 88 },
  { id: 's2', category: 'anomaly', title: 'Unusual spike in compliance exceptions — 3.2x normal', description: 'Cross-jurisdiction compliance checks failing at higher rate since Feb 10.', severity: 'high', detectedAt: '45m ago', source: 'Compliance Monitor', confidence: 92 },
  { id: 's3', category: 'trend', title: 'Decision velocity improving — 18% faster this quarter', description: 'Average deliberation time decreased from 11.2m to 9.2m. Council efficiency improving.', severity: 'low', detectedAt: '1d ago', source: 'Council Analytics', confidence: 95 },
  { id: 's4', category: 'risk', title: 'Vendor contract renewal cluster — 6 contracts in 30 days', description: 'Six major vendor contracts expire within the same window. Concentration risk.', severity: 'high', detectedAt: '3h ago', source: 'Contract Analysis', confidence: 86 },
  { id: 's5', category: 'pattern', title: 'Board meeting decisions have 2x higher override rate', description: 'Decisions made during board meetings are overridden 34% vs 17% baseline.', severity: 'medium', detectedAt: '2d ago', source: 'Decision Quality', confidence: 79 },
  { id: 's6', category: 'trend', title: 'IISS score steady improvement — +12 points in 90 days', description: 'All 9 primitives showing improvement. Biggest gains in Drift Detection and Deliberation Capture.', severity: 'low', detectedAt: '1d ago', source: 'DCII Dashboard', confidence: 97 },
  { id: 's7', category: 'anomaly', title: 'Agent confidence variance spiked for Risk Assessor', description: 'Risk Assessor confidence dropped 15% on financial decisions this week.', severity: 'medium', detectedAt: '6h ago', source: 'Agent Metrics', confidence: 74 },
  { id: 's8', category: 'risk', title: 'Decision debt accumulating — 8 decisions pending >14 days', description: 'Deferred decisions growing. Estimated cost: $12K/day in opportunity cost.', severity: 'critical', detectedAt: '30m ago', source: 'Decision Debt Tracker', confidence: 91 },
];

const SEVERITY_COLORS: Record<string, string> = {
  low: 'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  pattern: Layers,
  anomaly: AlertTriangle,
  trend: TrendingUp,
  risk: Target,
};

export const OrbitPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);

  const filtered = filter === 'all' ? SIGNALS : SIGNALS.filter(s => s.category === filter);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">DECIDE</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" /> CendiaOrbit™
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">30,000ft view — patterns, anomalies, trends, and risks across your decision landscape</p>
        </div>
        <button onClick={handleRescan} disabled={isScanning} className="px-4 py-2 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/25 flex items-center gap-2">
          <RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin')} /> {isScanning ? 'Scanning...' : 'Rescan'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Signals', value: SIGNALS.length, icon: Activity, color: 'text-cyan-400' },
          { label: 'Patterns', value: SIGNALS.filter(s => s.category === 'pattern').length, icon: Layers, color: 'text-blue-400' },
          { label: 'Anomalies', value: SIGNALS.filter(s => s.category === 'anomaly').length, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Risks', value: SIGNALS.filter(s => s.category === 'risk').length, icon: Target, color: 'text-red-400' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5">
        {['all', 'pattern', 'anomaly', 'trend', 'risk'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors',
              filter === cat ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'text-neutral-400 border-neutral-700/50 hover:border-neutral-600'
            )}>
            {cat}
          </button>
        ))}
      </div>

      {/* Signals */}
      <div className="space-y-3">
        {filtered.map(signal => {
          const CatIcon = CATEGORY_ICONS[signal.category] || Activity;
          return (
            <div key={signal.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg border', SEVERITY_COLORS[signal.severity])}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-200">{signal.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border', SEVERITY_COLORS[signal.severity])}>{signal.severity}</span>
                      <span className="text-[10px] text-neutral-500">{signal.source}</span>
                      <span className="text-[10px] text-neutral-600">· {signal.detectedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Confidence</p>
                  <p className={cn('text-sm font-bold', signal.confidence >= 85 ? 'text-green-400' : signal.confidence >= 70 ? 'text-amber-400' : 'text-neutral-400')}>{signal.confidence}%</p>
                </div>
              </div>
              <p className="text-xs text-neutral-400 ml-11">{signal.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitPage;
