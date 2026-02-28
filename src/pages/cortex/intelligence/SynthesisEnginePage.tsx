// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — SYNTHESIS ENGINE
// =============================================================================
// Multi-source data viewer, integration management, unified analysis dashboard.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Layers, Database, RefreshCw, CheckCircle, AlertTriangle, Clock,
  FileText, BarChart3, Link2, Unlink, Plus, Search, Filter, Zap,
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: string;
  recordCount: number;
  quality: number;
}

interface SynthesisResult {
  id: string;
  title: string;
  sources: string[];
  confidence: number;
  findings: string[];
  createdAt: string;
}

const SOURCES: DataSource[] = [
  { id: 'ds1', name: 'PostgreSQL — Primary', type: 'database', status: 'connected', lastSync: '2m ago', recordCount: 1247832, quality: 98 },
  { id: 'ds2', name: 'Salesforce CRM', type: 'api', status: 'connected', lastSync: '15m ago', recordCount: 34521, quality: 94 },
  { id: 'ds3', name: 'Financial Reports (S3)', type: 'file', status: 'connected', lastSync: '1h ago', recordCount: 892, quality: 99 },
  { id: 'ds4', name: 'Slack Activity Stream', type: 'stream', status: 'syncing', lastSync: 'live', recordCount: 182945, quality: 87 },
  { id: 'ds5', name: 'Jira Project Tracker', type: 'api', status: 'connected', lastSync: '30m ago', recordCount: 8743, quality: 92 },
  { id: 'ds6', name: 'Legacy ERP (Oracle)', type: 'database', status: 'error', lastSync: '3d ago', recordCount: 567000, quality: 71 },
];

const RESULTS: SynthesisResult[] = [
  { id: 'r1', title: 'Cross-Department Budget Utilization Analysis', sources: ['PostgreSQL', 'Financial Reports', 'Jira'], confidence: 92, findings: ['Engineering over budget by 12%', 'Marketing under-utilizing Q1 allocation', 'Revenue team exceeding targets by 18%'], createdAt: '2h ago' },
  { id: 'r2', title: 'Customer Churn Risk Correlation', sources: ['Salesforce CRM', 'Slack Activity', 'Jira'], confidence: 87, findings: ['Support ticket volume correlates 0.78 with churn', 'NPS below 7 predicts 3x churn risk', 'Feature request patterns indicate product-market gaps'], createdAt: '1d ago' },
  { id: 'r3', title: 'Vendor Dependency Risk Assessment', sources: ['PostgreSQL', 'Financial Reports'], confidence: 94, findings: ['3 vendors account for 68% of infrastructure spend', 'Single-source dependency on cloud provider', 'Contract renewal cluster in Q2 creates negotiation leverage'], createdAt: '3d ago' },
];

const statusIcon = (s: string) => {
  switch (s) {
    case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
    default: return <Unlink className="w-4 h-4 text-neutral-500" />;
  }
};

export const SynthesisEnginePage: React.FC = () => {
  const [sources] = useState(SOURCES);
  const [results] = useState(RESULTS);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSynthesis = async () => {
    setIsRunning(true);
    try {
      await apiClient.api.post('/decision-intel/synthesize', {
        sources: sources.filter(s => s.status === 'connected').map(s => s.id),
      });
    } catch { /* handled by API client */ }
    setTimeout(() => setIsRunning(false), 3000);
  };

  const connected = sources.filter(s => s.status === 'connected' || s.status === 'syncing').length;

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
            <Layers className="w-5 h-5 text-teal-400" /> Synthesis Engine
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Unified multi-source analysis — combine data, find patterns, surface insights</p>
        </div>
        <button onClick={handleRunSynthesis} disabled={isRunning} className="px-4 py-2 bg-teal-500/15 text-teal-400 border border-teal-500/30 rounded-lg text-sm font-medium hover:bg-teal-500/25 flex items-center gap-2">
          {isRunning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running...</> : <><Zap className="w-4 h-4" /> Run Synthesis</>}
        </button>
      </div>

      {/* Data Sources */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" /> Connected Sources
          </h3>
          <span className="text-xs text-neutral-500">{connected}/{sources.length} active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800/30">
          {sources.map(src => (
            <div key={src.id} className="p-4 bg-neutral-900/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {statusIcon(src.status)}
                  <span className="text-sm font-medium text-neutral-200">{src.name}</span>
                </div>
                <span className={cn('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded',
                  src.type === 'database' ? 'bg-blue-500/10 text-blue-400' :
                  src.type === 'api' ? 'bg-purple-500/10 text-purple-400' :
                  src.type === 'file' ? 'bg-green-500/10 text-green-400' :
                  'bg-amber-500/10 text-amber-400'
                )}>{src.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{src.recordCount.toLocaleString()} records</span>
                <span>Quality: {src.quality}%</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-600 mt-1">
                <span>Last sync: {src.lastSync}</span>
                <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', src.quality >= 90 ? 'bg-green-500' : src.quality >= 75 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${src.quality}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis Results */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" /> Synthesis Results
          </h3>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {results.map(r => (
            <div key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-neutral-200">{r.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-bold', r.confidence >= 90 ? 'text-green-400' : 'text-amber-400')}>{r.confidence}%</span>
                  <span className="text-[10px] text-neutral-600">{r.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-1.5 mb-3">
                {r.sources.map(s => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700">{s}</span>
                ))}
              </div>
              <div className="space-y-1.5">
                {r.findings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-neutral-300">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SynthesisEnginePage;
