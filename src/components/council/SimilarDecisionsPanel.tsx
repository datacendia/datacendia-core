/**
 * Component — CendiaPrecedent™ Similar Decisions Panel
 *
 * Shows precedent matches for the current deliberation question using
 * TF-IDF cosine similarity from the DecisionSimilarityService.
 * Displays matching past decisions with similarity scores, outcomes,
 * and key differences.
 *
 * @exports SimilarDecisionsPanel
 * @module components/council/SimilarDecisionsPanel
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  ChevronRight,
  ChevronDown,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Loader2,
  Info,
  ExternalLink,
} from 'lucide-react';

interface PrecedentMatch {
  id: string;
  question: string;
  similarity: number;
  outcome: string;
  councilMode: string;
  consensusScore: number;
  agentCount: number;
  date: string;
  keyDifferences: string[];
  relevantInsights: string[];
  dissentsRecorded: number;
}

interface SimilarDecisionsPanelProps {
  currentQuestion: string;
  deliberationId?: string;
  className?: string;
  maxResults?: number;
}

// Mock precedent data — in production, fetched from /api/v1/decisions/similar
const MOCK_PRECEDENTS: PrecedentMatch[] = [
  {
    id: 'prec-001',
    question: 'Should we proceed with the $1.8M vendor contract for cloud migration to AWS?',
    similarity: 0.87,
    outcome: 'APPROVED with conditions: 90-day performance review clause, data residency verification, and backup vendor identification.',
    councilMode: 'vendor-evaluation',
    consensusScore: 82,
    agentCount: 8,
    date: '2026-01-15',
    keyDifferences: ['Different vendor (AWS vs Azure)', 'Lower contract value ($1.8M vs current)', 'No regulatory hold required'],
    relevantInsights: ['CFO flagged hidden egress costs — saved 12% on final contract', 'Legal identified missing SLA penalties — added to final terms'],
    dissentsRecorded: 1,
  },
  {
    id: 'prec-002',
    question: 'Evaluate risk of expanding operations into EU market given GDPR and AI Act requirements',
    similarity: 0.73,
    outcome: 'PROCEED with phased rollout: Phase 1 UK/Ireland (Q2), Phase 2 Germany/France (Q3), full EU (Q4). Compliance officer assigned per jurisdiction.',
    councilMode: 'strategic-planning',
    consensusScore: 76,
    agentCount: 10,
    date: '2025-11-28',
    keyDifferences: ['B2B focus vs B2C', 'Different compliance profile', 'Larger team allocated'],
    relevantInsights: ['Ethics Officer raised data sovereignty concerns early — shaped architecture decisions', 'Red Team identified 3 regulatory gaps before launch'],
    dissentsRecorded: 2,
  },
  {
    id: 'prec-003',
    question: 'Review proposed acquisition of DataTech Solutions — $4.2M valuation',
    similarity: 0.65,
    outcome: 'ESCALATE: Valuation deemed 15% above fair market. Counter-offer recommended at $3.6M with earn-out structure.',
    councilMode: 'strategic-planning',
    consensusScore: 68,
    agentCount: 8,
    date: '2025-10-03',
    keyDifferences: ['Acquisition vs organic expansion', 'Higher financial exposure', 'Different vertical'],
    relevantInsights: ['Risk Analyzer identified undisclosed liability — reduced final offer by $400K', 'Legal flagged IP assignment gaps in LOI'],
    dissentsRecorded: 3,
  },
];

export const SimilarDecisionsPanel: React.FC<SimilarDecisionsPanelProps> = ({
  currentQuestion,
  deliberationId,
  className = '',
  maxResults = 5,
}) => {
  const [precedents, setPrecedents] = useState<PrecedentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchPrecedents = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/decisions/similar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: currentQuestion, limit: maxResults }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.matches) {
            setPrecedents(data.data.matches);
            setLoading(false);
            return;
          }
        }
      } catch {
        // API not available — use mock data
      }
      // Fallback to mock data
      setPrecedents(MOCK_PRECEDENTS.slice(0, maxResults));
      setLoading(false);
    };

    if (currentQuestion) {
      fetchPrecedents();
    }
  }, [currentQuestion, maxResults]);

  const similarityColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-400';
    if (score >= 0.6) return 'text-amber-400';
    return 'text-zinc-500';
  };

  const similarityBg = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500';
    if (score >= 0.6) return 'bg-amber-500';
    return 'bg-zinc-600';
  };

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <GitCompare className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-zinc-200">CendiaPrecedent™ — Similar Decisions</h3>
          <p className="text-xs text-zinc-500">
            {loading ? 'Searching precedents...' : `${precedents.length} precedent${precedents.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        {loading ? (
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        ) : (
          isCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />
        )}
      </button>

      {!isCollapsed && (
        <div className="border-t border-zinc-800">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-zinc-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing decision precedents...
            </div>
          ) : precedents.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-zinc-500 text-sm">
              <Search className="w-6 h-6 mb-2 opacity-50" />
              <p>No similar precedents found.</p>
              <p className="text-xs mt-1">This appears to be a novel decision.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {precedents.map((p) => (
                <div key={p.id}>
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Similarity Score */}
                    <div className="flex flex-col items-center flex-shrink-0 w-12">
                      <span className={`text-lg font-bold ${similarityColor(p.similarity)}`}>
                        {Math.round(p.similarity * 100)}%
                      </span>
                      <div className="w-8 h-1 rounded-full bg-zinc-800 mt-1">
                        <div className={`h-full rounded-full ${similarityBg(p.similarity)}`} style={{ width: `${p.similarity * 100}%` }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 line-clamp-2">{p.question}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.date}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.agentCount} agents</span>
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {p.consensusScore}% consensus</span>
                        {p.dissentsRecorded > 0 && (
                          <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-3 h-3" /> {p.dissentsRecorded} dissent{p.dissentsRecorded !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    {expanded === p.id ? <ChevronDown className="w-4 h-4 text-zinc-500 mt-1" /> : <ChevronRight className="w-4 h-4 text-zinc-500 mt-1" />}
                  </button>

                  {expanded === p.id && (
                    <div className="px-4 pb-4 space-y-3 ml-15">
                      {/* Outcome */}
                      <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3">
                        <p className="text-xs font-semibold text-zinc-400 mb-1">Outcome</p>
                        <p className="text-sm text-zinc-300">{p.outcome}</p>
                      </div>

                      {/* Key Differences */}
                      <div>
                        <p className="text-xs font-semibold text-amber-400 mb-1">Key Differences from Current Decision</p>
                        <ul className="space-y-1">
                          {p.keyDifferences.map((diff, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                              <span className="text-amber-500 mt-0.5">•</span> {diff}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Relevant Insights */}
                      <div>
                        <p className="text-xs font-semibold text-emerald-400 mb-1">Relevant Insights</p>
                        <ul className="space-y-1">
                          {p.relevantInsights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" /> {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimilarDecisionsPanel;
