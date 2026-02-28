// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — WHAT-IF SCENARIOS
// =============================================================================
// Scenario builder, sensitivity analysis, assumption testing, outcome comparison.

import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/api/client';
import { cn } from '../../../../lib/utils';
import {
  GitBranch, Plus, Play, Trash2, BarChart3, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, ChevronRight, Copy, ArrowRight, Layers,
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  assumptions: { label: string; value: string; baseline: string }[];
  outcome: { label: string; impact: 'positive' | 'negative' | 'neutral'; delta: string }[];
  probability: number;
  status: 'draft' | 'running' | 'complete';
}

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: 'sc1', name: 'Optimistic Growth', description: 'Market expands 15%, customer acquisition cost drops 20%',
    assumptions: [
      { label: 'Market Growth', value: '+15%', baseline: '+5%' },
      { label: 'CAC Reduction', value: '-20%', baseline: '0%' },
      { label: 'Churn Rate', value: '2%', baseline: '4%' },
    ],
    outcome: [
      { label: 'Revenue Impact', impact: 'positive', delta: '+$4.2M' },
      { label: 'Margin Impact', impact: 'positive', delta: '+8pp' },
      { label: 'Headcount Need', impact: 'negative', delta: '+22 hires' },
    ],
    probability: 25, status: 'complete',
  },
  {
    id: 'sc2', name: 'Baseline (Most Likely)', description: 'Current trajectory maintained with minor adjustments',
    assumptions: [
      { label: 'Market Growth', value: '+5%', baseline: '+5%' },
      { label: 'CAC Reduction', value: '0%', baseline: '0%' },
      { label: 'Churn Rate', value: '4%', baseline: '4%' },
    ],
    outcome: [
      { label: 'Revenue Impact', impact: 'neutral', delta: '+$1.8M' },
      { label: 'Margin Impact', impact: 'neutral', delta: '+2pp' },
      { label: 'Headcount Need', impact: 'neutral', delta: '+8 hires' },
    ],
    probability: 50, status: 'complete',
  },
  {
    id: 'sc3', name: 'Recession Scenario', description: 'Economic downturn, budget cuts across clients, longer sales cycles',
    assumptions: [
      { label: 'Market Growth', value: '-8%', baseline: '+5%' },
      { label: 'CAC Increase', value: '+35%', baseline: '0%' },
      { label: 'Churn Rate', value: '9%', baseline: '4%' },
    ],
    outcome: [
      { label: 'Revenue Impact', impact: 'negative', delta: '-$2.1M' },
      { label: 'Margin Impact', impact: 'negative', delta: '-12pp' },
      { label: 'Cash Runway', impact: 'negative', delta: '-6 months' },
    ],
    probability: 20, status: 'complete',
  },
  {
    id: 'sc4', name: 'Regulatory Shock', description: 'New AI regulation requires significant compliance investment',
    assumptions: [
      { label: 'Compliance Cost', value: '+$800K', baseline: '$200K' },
      { label: 'Time to Comply', value: '6 months', baseline: 'N/A' },
      { label: 'Market Advantage', value: 'First-mover', baseline: 'N/A' },
    ],
    outcome: [
      { label: 'Short-term Cost', impact: 'negative', delta: '+$800K' },
      { label: 'Competitive Moat', impact: 'positive', delta: '12-month lead' },
      { label: 'New Revenue', impact: 'positive', delta: '+$3M (compliance SaaS)' },
    ],
    probability: 35, status: 'complete',
  },
];

const impactColor = (impact: string) => {
  switch (impact) {
    case 'positive': return 'text-green-400';
    case 'negative': return 'text-red-400';
    default: return 'text-neutral-400';
  }
};

export const WhatIfScenariosPage: React.FC = () => {
  const [scenarios, setScenarios] = useState(DEMO_SCENARIOS);
  const [selectedId, setSelectedId] = useState<string>('sc2');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.api.get<any>('/horizon/scenarios');
        if (res.success && res.data?.scenarios?.length > 0) {
          setScenarios(res.data.scenarios);
          setSelectedId(res.data.scenarios[0].id);
        }
      } catch { /* fallback to demo data */ }
    };
    load();
  }, []);
  const selected = scenarios.find(s => s.id === selectedId);

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
            <GitBranch className="w-5 h-5 text-purple-400" /> What-If Scenarios
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Build scenarios, test assumptions, compare outcomes</p>
        </div>
        <button className="px-4 py-2 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scenario List */}
        <div className="space-y-3">
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => setSelectedId(sc.id)}
              className={cn(
                'w-full p-4 rounded-xl border text-left transition-all',
                selectedId === sc.id ? 'border-purple-500/30 bg-purple-500/5' : 'border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-neutral-200">{sc.name}</h3>
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded',
                  sc.probability >= 40 ? 'bg-green-500/10 text-green-400' : sc.probability >= 20 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                )}>{sc.probability}% likely</span>
              </div>
              <p className="text-xs text-neutral-500">{sc.description}</p>
            </button>
          ))}
        </div>

        {/* Scenario Detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
              <h2 className="text-base font-semibold text-neutral-200 mb-1">{selected.name}</h2>
              <p className="text-sm text-neutral-500 mb-4">{selected.description}</p>

              {/* Assumptions */}
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Assumptions vs Baseline</h3>
              <div className="space-y-2 mb-5">
                {selected.assumptions.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/30">
                    <span className="text-xs text-neutral-400 flex-1">{a.label}</span>
                    <span className="text-xs text-neutral-600">{a.baseline}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-600" />
                    <span className={cn('text-xs font-bold',
                      a.value.startsWith('+') ? 'text-green-400' : a.value.startsWith('-') ? 'text-red-400' : 'text-neutral-300'
                    )}>{a.value}</span>
                  </div>
                ))}
              </div>

              {/* Outcomes */}
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Projected Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selected.outcome.map((o, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/80">
                    <p className="text-xs text-neutral-500 mb-1">{o.label}</p>
                    <p className={cn('text-lg font-bold', impactColor(o.impact))}>{o.delta}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {o.impact === 'positive' && <TrendingUp className="w-3 h-3 text-green-400" />}
                      {o.impact === 'negative' && <TrendingDown className="w-3 h-3 text-red-400" />}
                      <span className={cn('text-[10px]', impactColor(o.impact))}>
                        {o.impact === 'positive' ? 'Favorable' : o.impact === 'negative' ? 'Unfavorable' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison */}
            <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Scenario Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="py-2 text-left text-neutral-500 font-medium">Metric</th>
                      {scenarios.map(sc => (
                        <th key={sc.id} className={cn('py-2 text-right font-medium', sc.id === selectedId ? 'text-purple-400' : 'text-neutral-500')}>{sc.name.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.outcome.map((_, oi) => (
                      <tr key={oi} className="border-b border-neutral-800/50">
                        <td className="py-2 text-neutral-400">{scenarios[0].outcome[oi]?.label}</td>
                        {scenarios.map(sc => (
                          <td key={sc.id} className={cn('py-2 text-right font-medium', impactColor(sc.outcome[oi]?.impact || 'neutral'))}>
                            {sc.outcome[oi]?.delta}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfScenariosPage;
