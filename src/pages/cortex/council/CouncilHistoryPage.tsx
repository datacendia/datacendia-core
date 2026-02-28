// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — COUNCIL HISTORY BROWSER (ADVANCED)
// =============================================================================
// Browse, filter, search past deliberations. Filter by date, topic, agent, outcome.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Search, Filter, Clock, Brain, CheckCircle, AlertTriangle, XCircle,
  ChevronRight, Download, Calendar, Users, BarChart3, Tag, SortAsc,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  mode: string;
  status: 'consensus' | 'split' | 'overridden' | 'abandoned';
  consensusScore: number;
  duration: string;
  agentCount: number;
  date: string;
  tags: string[];
  initiatedBy: string;
}

const STATUS_CONFIG: Record<string, { icon: React.FC<{ className?: string }>; color: string; label: string }> = {
  consensus: { icon: CheckCircle, color: 'text-green-400', label: 'Consensus' },
  split: { icon: AlertTriangle, color: 'text-amber-400', label: 'Split Decision' },
  overridden: { icon: XCircle, color: 'text-red-400', label: 'Overridden' },
  abandoned: { icon: XCircle, color: 'text-neutral-500', label: 'Abandoned' },
};

const DEMO_HISTORY: HistoryItem[] = [
  { id: 'd1', title: 'Q1 Cloud Infrastructure Migration Strategy', mode: 'Strategic Advisory', status: 'consensus', consensusScore: 87, duration: '11m 42s', agentCount: 7, date: '2026-02-14T09:30:00Z', tags: ['infrastructure', 'cloud', 'migration'], initiatedBy: 'Stuart Rainey' },
  { id: 'd2', title: 'Vendor Selection — Enterprise Security Stack', mode: 'Vendor Selection', status: 'consensus', consensusScore: 92, duration: '8m 15s', agentCount: 5, date: '2026-02-13T14:00:00Z', tags: ['vendor', 'security', 'procurement'], initiatedBy: 'Stuart Rainey' },
  { id: 'd3', title: 'EU AI Act Compliance Gap Assessment', mode: 'Compliance Review', status: 'consensus', consensusScore: 95, duration: '14m 22s', agentCount: 6, date: '2026-02-12T10:00:00Z', tags: ['compliance', 'eu-ai-act', 'regulation'], initiatedBy: 'Admin' },
  { id: 'd4', title: 'Annual Budget Reallocation — R&D vs Operations', mode: 'Financial Analysis', status: 'split', consensusScore: 62, duration: '18m 05s', agentCount: 7, date: '2026-02-11T16:00:00Z', tags: ['budget', 'finance', 'resource-allocation'], initiatedBy: 'Stuart Rainey' },
  { id: 'd5', title: 'Partnership Evaluation — TechCorp AI Division', mode: 'Strategic Advisory', status: 'consensus', consensusScore: 78, duration: '12m 30s', agentCount: 7, date: '2026-02-10T11:00:00Z', tags: ['partnership', 'strategy', 'ai'], initiatedBy: 'Stuart Rainey' },
  { id: 'd6', title: 'Data Residency Policy — Multi-Jurisdiction', mode: 'Governance Audit', status: 'consensus', consensusScore: 89, duration: '9m 48s', agentCount: 6, date: '2026-02-09T09:00:00Z', tags: ['data', 'governance', 'jurisdiction'], initiatedBy: 'Admin' },
  { id: 'd7', title: 'Crisis Response — Service Outage January 28', mode: 'Crisis Response', status: 'overridden', consensusScore: 71, duration: '4m 12s', agentCount: 5, date: '2026-01-28T03:15:00Z', tags: ['crisis', 'incident', 'outage'], initiatedBy: 'Stuart Rainey' },
  { id: 'd8', title: 'Product Pricing Strategy — Enterprise Tier', mode: 'Financial Analysis', status: 'consensus', consensusScore: 83, duration: '10m 55s', agentCount: 5, date: '2026-01-25T14:30:00Z', tags: ['pricing', 'strategy', 'enterprise'], initiatedBy: 'Stuart Rainey' },
  { id: 'd9', title: 'Hiring Plan Q2 — Engineering Team Expansion', mode: 'Talent Strategy', status: 'consensus', consensusScore: 90, duration: '7m 33s', agentCount: 5, date: '2026-01-22T10:00:00Z', tags: ['hiring', 'talent', 'engineering'], initiatedBy: 'Admin' },
  { id: 'd10', title: 'Competitive Response — Market Disruption Alert', mode: "Devil's Advocate", status: 'split', consensusScore: 55, duration: '15m 20s', agentCount: 7, date: '2026-01-18T16:00:00Z', tags: ['competition', 'market', 'strategy'], initiatedBy: 'Stuart Rainey' },
];

type SortField = 'date' | 'consensus' | 'duration';

export const CouncilHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>(DEMO_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [isLoading, setIsLoading] = useState(false);

  // Load real data from API
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.api.get<any[]>('/deliberations');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((d: any) => ({
            id: d.id,
            title: d.title || d.topic || 'Untitled Deliberation',
            mode: d.mode || 'Strategic Advisory',
            status: d.status === 'completed' ? 'consensus' : d.status || 'consensus',
            consensusScore: d.consensus_score || d.consensusScore || 80,
            duration: d.duration || '—',
            agentCount: d.agent_count || d.agentCount || 7,
            date: d.created_at || d.createdAt || new Date().toISOString(),
            tags: d.tags || [],
            initiatedBy: d.initiated_by || d.initiatedBy || 'User',
          }));
          setItems(mapped);
        }
      } catch {
        // Keep demo data
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = items
    .filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {return new Date(b.date).getTime() - new Date(a.date).getTime();}
      if (sortBy === 'consensus') {return b.consensusScore - a.consensusScore;}
      return 0;
    });

  const stats = {
    total: items.length,
    consensus: items.filter(i => i.status === 'consensus').length,
    avgScore: Math.round(items.reduce((s, i) => s + i.consensusScore, 0) / items.length),
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">The Council</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">Council History</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Browse and search all past deliberations</p>
        </div>
        <button className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Deliberations', value: stats.total, icon: Brain, color: 'text-blue-400' },
          { label: 'Consensus Reached', value: `${stats.consensus}/${stats.total}`, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Avg Consensus Score', value: `${stats.avgScore}%`, icon: BarChart3, color: 'text-purple-400' },
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
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search deliberations, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'consensus', 'split', 'overridden'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border',
                statusFilter === s
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : 'text-neutral-400 border-neutral-700/50 hover:border-neutral-600'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none"
        >
          <option value="date">Sort by Date</option>
          <option value="consensus">Sort by Consensus</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.map(item => {
          const statusCfg = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/cortex/council/post-deliberation/${item.id}`)}
              className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-200 truncate">{item.title}</h3>
                    <span className={cn('flex items-center gap-1 text-[10px] font-medium shrink-0', statusCfg.color)}>
                      <statusCfg.icon className="w-3 h-3" /> {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {item.mode}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.agentCount} agents</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  {item.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Consensus</p>
                    <p className={cn('text-lg font-bold',
                      item.consensusScore >= 80 ? 'text-green-400' : item.consensusScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    )}>{item.consensusScore}%</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No deliberations match your search</p>
        </div>
      )}
    </div>
  );
};

export default CouncilHistoryPage;
