// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CONSENSUS BUILDER
// =============================================================================
// Multi-stakeholder voting, weighted voting config, compromise modeler.

import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/api/client';
import { cn } from '../../../../lib/utils';
import {
  Users, CheckCircle, XCircle, MinusCircle, BarChart3, Scale,
  Plus, ChevronRight, ThumbsUp, ThumbsDown, Minus, Zap, Target,
} from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  weight: number;
  vote: 'approve' | 'reject' | 'abstain' | null;
  comment?: string;
}

interface Option {
  id: string;
  title: string;
  description: string;
  votes: { approve: number; reject: number; abstain: number };
  weightedScore: number;
}

const DEMO_STAKEHOLDERS: Stakeholder[] = [
  { id: 's1', name: 'CEO Office', role: 'Executive Sponsor', weight: 3, vote: 'approve', comment: 'Aligns with strategic vision' },
  { id: 's2', name: 'CFO Office', role: 'Financial Authority', weight: 2, vote: 'approve', comment: 'ROI projections are sound' },
  { id: 's3', name: 'CTO Office', role: 'Technical Authority', weight: 2, vote: 'approve' },
  { id: 's4', name: 'CISO Office', role: 'Security Authority', weight: 2, vote: null },
  { id: 's5', name: 'Legal Counsel', role: 'Legal Authority', weight: 1, vote: 'abstain', comment: 'Need more data on jurisdiction implications' },
  { id: 's6', name: 'Operations', role: 'Operational Lead', weight: 1, vote: 'reject', comment: 'Timeline too aggressive for current team capacity' },
  { id: 's7', name: 'Compliance', role: 'Compliance Officer', weight: 2, vote: null },
  { id: 's8', name: 'HR', role: 'People Impact', weight: 1, vote: 'approve' },
];

const DEMO_OPTIONS: Option[] = [
  { id: 'o1', title: 'Option A: Full Migration Q2', description: 'Complete migration to multi-cloud in one phase during Q2', votes: { approve: 3, reject: 2, abstain: 1 }, weightedScore: 62 },
  { id: 'o2', title: 'Option B: Phased Migration Q2-Q3', description: 'Two-phase approach: non-critical Q2, production Q3', votes: { approve: 5, reject: 0, abstain: 1 }, weightedScore: 87 },
  { id: 'o3', title: 'Option C: Defer to Q4', description: 'Delay migration until Q4 to allow more planning', votes: { approve: 1, reject: 4, abstain: 1 }, weightedScore: 28 },
];

export const ConsensusBuilderPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState(DEMO_STAKEHOLDERS);
  const [options, setOptions] = useState(DEMO_OPTIONS);
  const [activeOption, setActiveOption] = useState('o2');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.api.get<any>('/council/sessions?status=active&limit=1');
        if (res.success && res.data?.sessions?.length > 0) {
          const session = res.data.sessions[0];
          if (session.stakeholders?.length) setStakeholders(session.stakeholders);
          if (session.options?.length) setOptions(session.options);
        }
      } catch { /* fallback to demo data */ }
      setIsLoading(false);
    };
    load();
  }, []);

  const totalWeight = stakeholders.reduce((s, sh) => s + sh.weight, 0);
  const voted = stakeholders.filter(s => s.vote !== null).length;

  const castVote = (stakeholderId: string, vote: 'approve' | 'reject' | 'abstain') => {
    setStakeholders(prev => prev.map(s => s.id === stakeholderId ? { ...s, vote } : s));
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
          <h1 className="text-xl font-bold text-neutral-100">Consensus Builder</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Multi-stakeholder weighted voting and compromise modeling</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
          <Users className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-200">{voted}/{stakeholders.length} voted</span>
        </div>
      </div>

      {/* Options Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => setActiveOption(opt.id)}
            className={cn(
              'p-5 rounded-xl border text-left transition-all',
              activeOption === opt.id
                ? 'border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20'
                : 'border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600'
            )}
          >
            <h3 className="text-sm font-semibold text-neutral-200 mb-1">{opt.title}</h3>
            <p className="text-xs text-neutral-500 mb-3">{opt.description}</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="flex items-center gap-1 text-xs text-green-400"><ThumbsUp className="w-3 h-3" /> {opt.votes.approve}</span>
              <span className="flex items-center gap-1 text-xs text-red-400"><ThumbsDown className="w-3 h-3" /> {opt.votes.reject}</span>
              <span className="flex items-center gap-1 text-xs text-neutral-500"><Minus className="w-3 h-3" /> {opt.votes.abstain}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all',
                opt.weightedScore >= 70 ? 'bg-green-500' : opt.weightedScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
              )} style={{ width: `${opt.weightedScore}%` }} />
            </div>
            <p className={cn('text-right text-xs font-bold mt-1',
              opt.weightedScore >= 70 ? 'text-green-400' : opt.weightedScore >= 40 ? 'text-amber-400' : 'text-red-400'
            )}>{opt.weightedScore}% weighted approval</p>
          </button>
        ))}
      </div>

      {/* Stakeholder Voting */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" /> Stakeholder Votes
          </h3>
          <span className="text-xs text-neutral-500">Total weight: {totalWeight}</span>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {stakeholders.map(sh => (
            <div key={sh.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-200">{sh.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded">{sh.role}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">×{sh.weight}</span>
                </div>
                {sh.comment && <p className="text-xs text-neutral-500 mt-1">"{sh.comment}"</p>}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => castVote(sh.id, 'approve')} className={cn('p-2 rounded-lg border transition-colors',
                  sh.vote === 'approve' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'border-neutral-700/50 text-neutral-600 hover:text-green-400')}>
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button onClick={() => castVote(sh.id, 'reject')} className={cn('p-2 rounded-lg border transition-colors',
                  sh.vote === 'reject' ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'border-neutral-700/50 text-neutral-600 hover:text-red-400')}>
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button onClick={() => castVote(sh.id, 'abstain')} className={cn('p-2 rounded-lg border transition-colors',
                  sh.vote === 'abstain' ? 'bg-neutral-500/15 border-neutral-500/30 text-neutral-400' : 'border-neutral-700/50 text-neutral-600 hover:text-neutral-400')}>
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsensusBuilderPage;
