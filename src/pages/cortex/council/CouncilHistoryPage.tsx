/**
 * Page — Council History Page
 *
 * React page component rendered by the router.
 *
 * @exports CouncilHistoryPage
 * @module pages/cortex/council/CouncilHistoryPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — COUNCIL HISTORY BROWSER (ADVANCED)
// =============================================================================
// Browse, filter, search past deliberations. Filter by date, topic, agent, outcome.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient, { type ApiResponse } from '../../../lib/api/client';
import { COUNCIL_MODES } from '../../../data/councilModes';
import {
  Search, Filter, Clock, Brain, CheckCircle, AlertTriangle, XCircle,
  ChevronRight, Download, Calendar, Users, BarChart3, Tag, SortAsc,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  mode: string;
  status: 'consensus' | 'split' | 'overridden' | 'abandoned' | 'in_progress' | 'pending';
  consensusScore: number | null;
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
  in_progress: { icon: Clock, color: 'text-blue-400', label: 'In Progress' },
  pending: { icon: Clock, color: 'text-neutral-400', label: 'Pending' },
};

// GET /deliberations returns Prisma rows: status is the DeliberationStatus enum
// (PENDING | IN_PROGRESS | AWAITING_APPROVAL | COMPLETED | CANCELLED), the topic
// is `question`, and `confidence` is 0-1. Reading them as lowercase strings sent
// "COMPLETED" to STATUS_CONFIG, which has no such key, and the page crashed.
// The fields of a GET /deliberations row this page reads (older payloads used other names).
interface DeliberationRow {
  id: string;
  question?: string;
  title?: string;
  topic?: string;
  mode?: string;
  status?: string;
  decision?: { status?: string; dissent?: unknown; dissenting?: unknown } | null;
  confidence?: number | null;
  consensus_score?: number;
  consensusScore?: number;
  duration?: string;
  started_at?: string;
  completed_at?: string;
  config?: { agents?: unknown[]; mode?: string } | null;
  deliberation_messages?: Array<{ agent_id?: string }>;
  agent_count?: number;
  agentCount?: number;
  context?: { verticalLabel?: string; initiatedBy?: string } | null;
  created_at?: string;
  createdAt?: string;
  tags?: string[];
  initiated_by?: string;
  initiatedBy?: string;
}

function toHistoryStatus(d: DeliberationRow): HistoryItem['status'] {
  const status = String(d.status ?? '').toUpperCase();
  if (status === 'CANCELLED') {return 'abandoned';}
  if (status === 'PENDING') {return 'pending';}
  if (status !== 'COMPLETED') {return 'in_progress';}
  if (d.decision?.status === 'REJECTED' || d.decision?.status === 'OVERRIDDEN') {return 'overridden';}
  // Recorded as `dissent` or `dissenting`, a view or a list of them; an empty list is no dissent
  const dissent = d.decision?.dissent ?? d.decision?.dissenting;
  return (Array.isArray(dissent) ? dissent.length > 0 : Boolean(dissent)) ? 'split' : 'consensus';
}

// The configured council if recorded, else the distinct agents who spoke.
function countAgents(d: DeliberationRow): number {
  const configured = d.config?.agents;
  if (Array.isArray(configured) && configured.length > 0) {
    return configured.length;
  }
  const speakers = new Set((d.deliberation_messages ?? []).map((m) => m.agent_id).filter(Boolean));
  return speakers.size || d.agent_count || d.agentCount || 0;
}

function formatDuration(start?: string, end?: string): string {
  const ms = start && end ? new Date(end).getTime() - new Date(start).getTime() : NaN;
  if (!Number.isFinite(ms) || ms <= 0) {return '—';}
  const mins = Math.max(1, Math.round(ms / 60000));
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
}

function toHistoryItem(d: DeliberationRow): HistoryItem {
  const score = d.confidence ?? d.consensus_score ?? d.consensusScore;
  const modeId = d.config?.mode || d.mode;
  const vertical = d.context?.verticalLabel;
  return {
    id: d.id,
    title: d.question || d.title || d.topic || 'Untitled Deliberation',
    mode: modeId ? COUNCIL_MODES[modeId]?.name ?? modeId.charAt(0).toUpperCase() + modeId.slice(1) : 'Council',
    status: toHistoryStatus(d),
    consensusScore: typeof score === 'number' ? Math.round(score <= 1 ? score * 100 : score) : null,
    duration: d.duration || formatDuration(d.started_at, d.completed_at),
    agentCount: countAgents(d),
    date: d.created_at || d.createdAt || new Date().toISOString(),
    tags: d.tags || (vertical ? [vertical] : []),
    initiatedBy: d.context?.initiatedBy || d.initiated_by || d.initiatedBy || 'User',
  };
}

// Quote every cell; a leading =, +, - or @ (or a tab or line break before one)
// would run as a formula in a spreadsheet.
function csvCell(value: string | number | null): string {
  const text = value === null ? '' : String(value);
  const safe = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

// GET /deliberations returns at most 100 rows a page. History lists (and
// exports) every page, up to MAX_PAGES so a huge workspace can't stall it.
const PAGE_SIZE = 100;
const MAX_PAGES = 20;

type DeliberationPage = ApiResponse<DeliberationRow[]> & { pagination?: { totalPages?: number } };

async function loadDeliberations(): Promise<DeliberationRow[] | null> {
  const rows: DeliberationRow[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res: DeliberationPage = await apiClient.api.get<DeliberationRow[]>('/deliberations', { page, limit: PAGE_SIZE });
    if (!res.success || !Array.isArray(res.data)) {
      return null;
    }
    rows.push(...res.data);
    if (res.data.length < PAGE_SIZE || page >= (res.pagination?.totalPages ?? page)) {
      break;
    }
  }
  return rows;
}

// Downloads the deliberations as shown (search, filter and sort applied).
function exportCsv(rows: HistoryItem[]): void {
  const header = ['Title', 'Status', 'Consensus %', 'Mode', 'Agents', 'Duration', 'Date', 'Tags'];
  const lines = rows.map((r) =>
    [r.title, STATUS_CONFIG[r.status]?.label ?? r.status, r.consensusScore, r.mode, r.agentCount,
      r.duration, r.date, r.tags.join('; ')].map(csvCell).join(',')
  );
  const blob = new Blob([[header.map(csvCell).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `council-history-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

type SortField = 'date' | 'consensus' | 'duration';

export const CouncilHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from API
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const rows = await loadDeliberations();
        if (rows) {
          setItems(rows.map(toHistoryItem));
        } else {
          setLoadFailed(true);
        }
      } catch {
        setLoadFailed(true);
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
      if (sortBy === 'consensus') {return (b.consensusScore ?? -1) - (a.consensusScore ?? -1);}
      return 0;
    });

  const scores = items.map(i => i.consensusScore).filter((s): s is number => s !== null);
  const stats = {
    total: items.length,
    consensus: items.filter(i => i.status === 'consensus').length,
    avgScore: scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0,
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
          <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>COUNCIL HISTORY</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Browse and search all past deliberations</p>
        </div>
        <button
          onClick={() => exportCsv(filtered)}
          disabled={filtered.length === 0}
          className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
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
          const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['in_progress'];
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
                      item.consensusScore === null ? 'text-neutral-500'
                        : item.consensusScore >= 80 ? 'text-green-400' : item.consensusScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    )}>{item.consensusScore === null ? '—' : `${item.consensusScore}%`}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <p className="text-center py-12 text-neutral-500 text-sm">Loading deliberations…</p>
      )}

      {!isLoading && loadFailed && (
        <p className="text-center py-12 text-red-400 text-sm">The deliberations could not be loaded.</p>
      )}

      {!isLoading && !loadFailed && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-sm mb-4">No deliberations in this workspace yet.</p>
          <button
            onClick={() => navigate('/cortex/council')}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm"
          >
            Ask the Council
          </button>
        </div>
      )}

      {items.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No deliberations match your search</p>
        </div>
      )}
    </div>
  );
};

export default CouncilHistoryPage;
