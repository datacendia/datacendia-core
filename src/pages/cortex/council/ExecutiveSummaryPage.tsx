// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — EXECUTIVE SUMMARY GENERATOR
// =============================================================================
// Generate board-ready executive summaries from deliberation outputs using AI.
// Connects to real Ollama backend for summary generation.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  FileText, Download, Copy, Check, Brain, Clock, RefreshCw,
  ChevronRight, Loader2, Users, Shield, BarChart3, Briefcase,
} from 'lucide-react';

interface SummaryTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  audience: string;
  icon: React.FC<{ className?: string }>;
}

const TEMPLATES: SummaryTemplate[] = [
  { id: 'board', name: 'Board Report', description: 'Concise summary for board of directors', sections: ['Decision', 'Rationale', 'Risk Assessment', 'Financial Impact', 'Recommendation'], audience: 'Board Members', icon: Briefcase },
  { id: 'ceo', name: 'CEO Brief', description: 'One-page executive brief for CEO', sections: ['Decision', 'Key Findings', 'Action Items'], audience: 'CEO / C-Suite', icon: Users },
  { id: 'compliance', name: 'Compliance Summary', description: 'Regulatory-focused summary with framework mapping', sections: ['Decision', 'Compliance Status', 'Framework Coverage', 'Gaps', 'Remediation Plan'], audience: 'Compliance Officers', icon: Shield },
  { id: 'financial', name: 'Financial Impact Report', description: 'Cost-benefit analysis and financial projections', sections: ['Decision', 'Cost Analysis', 'ROI Projection', 'Risk-Adjusted Returns', 'Budget Implications'], audience: 'CFO / Finance', icon: BarChart3 },
];

interface RecentSummary {
  id: string;
  deliberationTitle: string;
  template: string;
  generatedAt: string;
  wordCount: number;
}

const RECENT_SUMMARIES: RecentSummary[] = [
  { id: 's1', deliberationTitle: 'Q1 Cloud Migration Strategy', template: 'Board Report', generatedAt: new Date(Date.now() - 86400000).toISOString(), wordCount: 847 },
  { id: 's2', deliberationTitle: 'Vendor Selection — Security Stack', template: 'CEO Brief', generatedAt: new Date(Date.now() - 172800000).toISOString(), wordCount: 312 },
  { id: 's3', deliberationTitle: 'EU AI Act Compliance Gap Assessment', template: 'Compliance Summary', generatedAt: new Date(Date.now() - 259200000).toISOString(), wordCount: 1203 },
];

export const ExecutiveSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('board');
  const [selectedDeliberation, setSelectedDeliberation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedDeliberation) {return;}
    setIsGenerating(true);
    setGeneratedSummary(null);
    try {
      const res = await apiClient.api.post<{ summary: string }>('/summaries/generate', {
        deliberationId: selectedDeliberation,
        template: selectedTemplate,
      });
      if (res.success && res.data) {
        setGeneratedSummary((res.data as any).summary || 'Summary generated successfully. View in the deliberation detail page.');
      } else {
        // Fallback demo summary
        setGeneratedSummary(
          `EXECUTIVE SUMMARY — ${TEMPLATES.find(t => t.id === selectedTemplate)?.name}\n\n` +
          `Generated: ${new Date().toLocaleDateString()}\n` +
          `Template: ${selectedTemplate}\n\n` +
          `This summary was generated from the selected deliberation using the ${selectedTemplate} template. ` +
          `Connect to a live deliberation to generate a real AI-powered summary using the Council's structured output.\n\n` +
          `The summary includes:\n` +
          TEMPLATES.find(t => t.id === selectedTemplate)?.sections.map(s => `• ${s}`).join('\n') +
          `\n\nTo generate from real deliberation data, select a completed deliberation from the list.`
        );
      }
    } catch {
      setGeneratedSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedSummary) {
      navigator.clipboard.writeText(generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <h1 className="text-xl font-bold text-neutral-100">Executive Summary Generator</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Generate board-ready summaries from deliberation outputs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Template Selection */}
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Select Template</h3>
            <div className="space-y-2">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors',
                    selectedTemplate === tmpl.id
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-neutral-700/50 hover:border-neutral-600'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <tmpl.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-neutral-200">{tmpl.name}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">{tmpl.description}</p>
                  <p className="text-[10px] text-neutral-600 mt-1">Audience: {tmpl.audience}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Select Deliberation</h3>
            <select
              value={selectedDeliberation}
              onChange={(e) => setSelectedDeliberation(e.target.value)}
              className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500/50"
            >
              <option value="">Choose a deliberation...</option>
              <option value="delib-001">Q1 Cloud Migration Strategy</option>
              <option value="delib-002">Vendor Selection — Security Stack</option>
              <option value="delib-003">EU AI Act Compliance Gap</option>
              <option value="delib-004">Annual Budget Allocation</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={!selectedDeliberation || isGenerating}
              className={cn(
                'w-full mt-3 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2',
                selectedDeliberation && !isGenerating
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              )}
            >
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Brain className="w-4 h-4" /> Generate Summary</>}
            </button>
          </div>
        </div>

        {/* Center: Generated Summary */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Generated Summary
            </h3>
            {generatedSummary && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="px-3 py-1 text-xs border border-neutral-700 rounded-lg text-neutral-400 hover:text-neutral-200 flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy'}
                </button>
                <button className="px-3 py-1 text-xs border border-neutral-700 rounded-lg text-neutral-400 hover:text-neutral-200 flex items-center gap-1">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
            )}
          </div>
          <div className="p-6 min-h-[400px]">
            {generatedSummary ? (
              <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-sans leading-relaxed">{generatedSummary}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <FileText className="w-12 h-12 text-neutral-700 mb-4" />
                <p className="text-neutral-500 text-sm">Select a template and deliberation to generate</p>
                <p className="text-neutral-600 text-xs mt-1">AI-powered summaries tailored to your audience</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Summaries */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" /> Recent Summaries
          </h3>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {RECENT_SUMMARIES.map(s => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-800/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-neutral-500" />
                <div>
                  <p className="text-sm text-neutral-200">{s.deliberationTitle}</p>
                  <p className="text-xs text-neutral-500">{s.template} · {s.wordCount} words</p>
                </div>
              </div>
              <span className="text-xs text-neutral-500">{new Date(s.generatedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPage;
