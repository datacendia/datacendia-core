// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaMemory™ / Pantheon
// =============================================================================
// Institutional memory browser, knowledge preservation, leader transition toolkit.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import {
  Brain, BookOpen, Users, Clock, Search, ChevronRight, Shield,
  FileText, Star, Archive, AlertTriangle, TrendingUp, Layers,
} from 'lucide-react';

interface MemoryEntry {
  id: string;
  title: string;
  type: 'decision' | 'lesson' | 'precedent' | 'policy' | 'knowledge';
  importance: 'critical' | 'high' | 'medium';
  createdBy: string;
  date: string;
  summary: string;
  tags: string[];
  accessCount: number;
  linkedDecisions: number;
}

const DEMO_ENTRIES: MemoryEntry[] = [
  { id: 'm1', title: 'Why We Chose Multi-Cloud Over Single Vendor', type: 'decision', importance: 'critical', createdBy: 'Council — Strategic Advisory', date: '2026-02-14', summary: 'After 3 vendor lock-in incidents in 2024-2025, the Council unanimously recommended multi-cloud. Key factor: 64% reduction in dependency risk.', tags: ['cloud', 'vendor', 'strategy'], accessCount: 47, linkedDecisions: 12 },
  { id: 'm2', title: 'Data Residency Requirements — EU Expansion', type: 'precedent', importance: 'critical', createdBy: 'Compliance Officer', date: '2026-01-20', summary: 'GDPR Art. 44-49 requires adequacy decisions for data transfers. Schrems II implications documented. Standard contractual clauses implemented.', tags: ['gdpr', 'data-residency', 'eu'], accessCount: 89, linkedDecisions: 8 },
  { id: 'm3', title: 'Budget Cycle Bottleneck Pattern', type: 'lesson', importance: 'high', createdBy: 'CendiaOrbit — Pattern Detection', date: '2026-02-10', summary: 'Q1 budget approvals consistently delayed 5+ days. Root cause: 3 sequential sign-offs that can be parallelized. Recommendation: parallel approval workflow.', tags: ['budget', 'process', 'optimization'], accessCount: 23, linkedDecisions: 5 },
  { id: 'm4', title: 'Crisis Communication Protocol v3.0', type: 'policy', importance: 'critical', createdBy: 'Governance Team', date: '2025-12-01', summary: 'Updated after January 2026 outage. Includes 15-minute SLA for internal notification, 1-hour for external stakeholders, pre-approved messaging templates.', tags: ['crisis', 'communication', 'policy'], accessCount: 156, linkedDecisions: 3 },
  { id: 'm5', title: 'How Risk Assessor Confidence Correlates with Outcomes', type: 'knowledge', importance: 'medium', createdBy: 'Council Analytics', date: '2026-01-15', summary: 'Analysis of 138 deliberations: when Risk Assessor confidence drops below 70%, post-decision satisfaction is 40% lower. Threshold alert implemented.', tags: ['analytics', 'agent-performance', 'risk'], accessCount: 34, linkedDecisions: 0 },
  { id: 'm6', title: 'Board Governance Reform — Lessons from 2025', type: 'lesson', importance: 'high', createdBy: 'CEO Office', date: '2025-11-30', summary: 'Three board decisions overridden in 2025. Common pattern: insufficient pre-meeting material. Solution: mandatory Decision Brief 72h before meetings.', tags: ['governance', 'board', 'process'], accessCount: 67, linkedDecisions: 9 },
];

const typeColors: Record<string, { color: string; bg: string }> = {
  decision: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  lesson: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  precedent: { color: 'text-purple-400', bg: 'bg-purple-500/10' },
  policy: { color: 'text-green-400', bg: 'bg-green-500/10' },
  knowledge: { color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

const importanceColors: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  medium: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20',
};

export const MemoryPage: React.FC = () => {
  const [entries] = useState(DEMO_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = entries.filter(e => {
    const matchesSearch = searchQuery === '' || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">DCII</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Archive className="w-5 h-5 text-rose-400" /> CendiaMemory™ / Pantheon
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Institutional memory — knowledge that survives leadership transitions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Memory Entries', value: entries.length, icon: Archive, color: 'text-rose-400' },
          { label: 'Critical Knowledge', value: entries.filter(e => e.importance === 'critical').length, icon: Star, color: 'text-red-400' },
          { label: 'Total Accesses', value: entries.reduce((s, e) => s + e.accessCount, 0), icon: TrendingUp, color: 'text-green-400' },
          { label: 'Linked Decisions', value: entries.reduce((s, e) => s + e.linkedDecisions, 0), icon: Layers, color: 'text-blue-400' },
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
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search institutional memory..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-rose-500/50" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'decision', 'lesson', 'precedent', 'policy', 'knowledge'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors',
                typeFilter === t ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'text-neutral-400 border-neutral-700/50 hover:border-neutral-600')}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.map(entry => {
          const tc = typeColors[entry.type];
          return (
            <div key={entry.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', tc.bg, tc.color)}>{entry.type}</span>
                    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border', importanceColors[entry.importance])}>{entry.importance}</span>
                    <h3 className="text-sm font-semibold text-neutral-200">{entry.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{entry.summary}</p>
                  <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                    <span>{entry.createdBy}</span>
                    <span>·</span>
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{entry.accessCount} accesses</span>
                    <span>·</span>
                    <span>{entry.linkedDecisions} linked decisions</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {entry.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700">{tag}</span>)}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 ml-4 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryPage;
