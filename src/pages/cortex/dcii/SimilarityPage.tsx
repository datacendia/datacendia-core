// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaSimilarity™
// =============================================================================
// Semantic search interface, similar decision finder, outcome-aware recommendations.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Search, Brain, CheckCircle, Clock, ChevronRight, BarChart3,
  Layers, Target, ThumbsUp, ThumbsDown, AlertTriangle, FileText,
} from 'lucide-react';

interface SimilarDecision {
  id: string;
  title: string;
  date: string;
  similarity: number;
  outcome: 'positive' | 'negative' | 'mixed' | 'pending';
  consensusScore: number;
  keyLesson: string;
  tags: string[];
}

const DEMO_RESULTS: SimilarDecision[] = [
  { id: 'd1', title: 'Cloud Provider Migration — AWS to Multi-Cloud (2025)', date: '2025-09-15', similarity: 94, outcome: 'positive', consensusScore: 89, keyLesson: 'Phased approach reduced risk. Key: dedicated migration team.', tags: ['cloud', 'migration', 'infrastructure'] },
  { id: 'd2', title: 'Data Center Consolidation — EU Region (2025)', date: '2025-06-20', similarity: 82, outcome: 'positive', consensusScore: 91, keyLesson: 'Compliance pre-clearance saved 3 months. Always check jurisdiction first.', tags: ['infrastructure', 'compliance', 'eu'] },
  { id: 'd3', title: 'SaaS Vendor Replacement — CRM System (2024)', date: '2024-11-10', similarity: 71, outcome: 'mixed', consensusScore: 72, keyLesson: 'Data migration took 2x longer than estimated. Budget extra time for legacy data.', tags: ['vendor', 'migration', 'crm'] },
  { id: 'd4', title: 'Hybrid Cloud Strategy — Finance Workloads (2024)', date: '2024-03-22', similarity: 68, outcome: 'positive', consensusScore: 85, keyLesson: 'Sensitive data kept on-prem while analytics moved to cloud. Good pattern.', tags: ['cloud', 'finance', 'hybrid'] },
  { id: 'd5', title: 'Emergency Infrastructure Scaling — Black Friday (2024)', date: '2024-11-28', similarity: 55, outcome: 'negative', consensusScore: 58, keyLesson: 'Rushed decision without proper load testing. Pre-mortem would have caught this.', tags: ['infrastructure', 'crisis', 'scaling'] },
];

const outcomeIcon = (o: string) => {
  switch (o) {
    case 'positive': return <ThumbsUp className="w-4 h-4 text-green-400" />;
    case 'negative': return <ThumbsDown className="w-4 h-4 text-red-400" />;
    case 'mixed': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    default: return <Clock className="w-4 h-4 text-neutral-400" />;
  }
};

export const SimilarityPage: React.FC = () => {
  const [query, setQuery] = useState('Cloud infrastructure migration to multi-cloud architecture');
  const [results, setResults] = useState<SimilarDecision[]>(DEMO_RESULTS);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {return;}
    setIsSearching(true);
    try {
      const res = await apiClient.api.post<any>('/decision-intel/similar', { query, limit: 10 });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setResults(res.data);
      }
    } catch { /* keep demo results */ }
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs text-slate-400">DCII</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" /> CendiaSimilarity™
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">Find similar past decisions, learn from outcomes, get recommendations</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Describe your current decision context..."
            className="w-full pl-9 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-violet-500/50" />
        </div>
        <button onClick={handleSearch} disabled={isSearching}
          className="px-5 py-3 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-xl text-sm font-medium hover:bg-violet-500/25 flex items-center gap-2">
          {isSearching ? <Brain className="w-4 h-4 animate-pulse" /> : <Search className="w-4 h-4" />}
          {isSearching ? 'Searching...' : 'Find Similar'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map(dec => (
          <div key={dec.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-semibold text-neutral-200">{dec.title}</h3>
                  {outcomeIcon(dec.outcome)}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span>{new Date(dec.date).toLocaleDateString()}</span>
                  <span>Consensus: {dec.consensusScore}%</span>
                  <div className="flex gap-1">
                    {dec.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 text-[10px]">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className={cn('text-lg font-bold', dec.similarity >= 80 ? 'text-green-400' : dec.similarity >= 60 ? 'text-amber-400' : 'text-neutral-400')}>
                  {dec.similarity}%
                </p>
                <p className="text-[10px] text-neutral-600">match</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/30 mt-2">
              <p className="text-xs text-neutral-300 flex items-start gap-2">
                <Brain className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span><strong className="text-violet-400">Key Lesson:</strong> {dec.keyLesson}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarityPage;
