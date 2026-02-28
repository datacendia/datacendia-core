// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — RDP SERVICE (Research/Discovery/Planning)
// =============================================================================
// Research workflow, discovery automation, decision brief generator, research library.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Search, BookOpen, FileText, Plus, Play, Clock, CheckCircle,
  Loader2, ChevronRight, Download, Filter, Layers, Brain, Zap,
} from 'lucide-react';

interface ResearchBrief {
  id: string;
  title: string;
  status: 'draft' | 'researching' | 'complete';
  sources: number;
  findings: number;
  createdAt: string;
  topic: string;
}

interface ResearchTemplate {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

const BRIEFS: ResearchBrief[] = [
  { id: 'rb1', title: 'EU AI Act Impact Assessment', status: 'complete', sources: 24, findings: 12, createdAt: '2d ago', topic: 'Regulatory' },
  { id: 'rb2', title: 'Competitor Analysis — DDGI Market', status: 'complete', sources: 18, findings: 8, createdAt: '5d ago', topic: 'Market' },
  { id: 'rb3', title: 'Cloud Migration Best Practices 2026', status: 'researching', sources: 11, findings: 4, createdAt: '1d ago', topic: 'Technology' },
  { id: 'rb4', title: 'Board Governance Trends — FTSE 250', status: 'draft', sources: 0, findings: 0, createdAt: '3h ago', topic: 'Governance' },
];

const TEMPLATES: ResearchTemplate[] = [
  { id: 't1', name: 'Regulatory Impact Analysis', description: 'Assess impact of new regulations on operations', steps: ['Identify regulation', 'Map affected areas', 'Gap analysis', 'Remediation plan', 'Cost estimate'] },
  { id: 't2', name: 'Competitive Intelligence', description: 'Comprehensive competitor landscape analysis', steps: ['Define competitors', 'Product comparison', 'Pricing analysis', 'Market positioning', 'SWOT synthesis'] },
  { id: 't3', name: 'Technology Evaluation', description: 'Evaluate technology options for adoption', steps: ['Requirements gathering', 'Market scan', 'Proof of concept', 'Risk assessment', 'Recommendation'] },
  { id: 't4', name: 'Decision Brief', description: 'Prepare structured brief for Council deliberation', steps: ['Context definition', 'Stakeholder mapping', 'Options identification', 'Evidence gathering', 'Brief compilation'] },
];

const statusColors: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: 'text-neutral-400', bg: 'bg-neutral-500/10', label: 'Draft' },
  researching: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Researching' },
  complete: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Complete' },
};

export const RDPServicePage: React.FC = () => {
  const [briefs] = useState(BRIEFS);
  const [activeTab, setActiveTab] = useState<'briefs' | 'templates'>('briefs');
  const [isCreating, setIsCreating] = useState(false);

  const handleNewBrief = async (templateId: string) => {
    setIsCreating(true);
    try {
      await apiClient.api.post('/decision-intel/research/start', { templateId });
    } catch { /* handled */ }
    setTimeout(() => setIsCreating(false), 1500);
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
            <BookOpen className="w-5 h-5 text-indigo-400" /> Research · Discovery · Planning
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Automated research workflows and decision brief generation</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm font-medium hover:bg-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Research
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-800">
        {(['briefs', 'templates'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
              activeTab === tab ? 'text-indigo-400 border-indigo-400' : 'text-neutral-500 border-transparent hover:text-neutral-300')}>
            {tab === 'briefs' ? 'Research Briefs' : 'Templates'}
          </button>
        ))}
      </div>

      {activeTab === 'briefs' && (
        <div className="space-y-3">
          {briefs.map(brief => {
            const st = statusColors[brief.status];
            return (
              <div key={brief.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-neutral-200">{brief.title}</h3>
                      <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', st.bg, st.color)}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="px-1.5 py-0.5 bg-neutral-800 rounded">{brief.topic}</span>
                      <span>{brief.sources} sources</span>
                      <span>{brief.findings} findings</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {brief.createdAt}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map(tmpl => (
            <div key={tmpl.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-200 mb-1">{tmpl.name}</h3>
              <p className="text-xs text-neutral-500 mb-3">{tmpl.description}</p>
              <div className="space-y-1.5 mb-4">
                {tmpl.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 rounded px-1.5 py-0.5">{i + 1}</span>
                    <span className="text-xs text-neutral-400">{step}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleNewBrief(tmpl.id)} disabled={isCreating}
                className="px-3 py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-medium hover:bg-indigo-500/25 flex items-center gap-1.5">
                <Play className="w-3 h-3" /> Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RDPServicePage;
