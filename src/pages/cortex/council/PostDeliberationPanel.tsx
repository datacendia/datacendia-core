// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — POST-DELIBERATION PANEL
// =============================================================================
// Structured output viewer for completed deliberations. Shows agent contributions,
// consensus points, dissents, recommendations, and evidence citations.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Brain, FileText, Download, ChevronRight, CheckCircle, AlertTriangle,
  XCircle, Users, Clock, Shield, BarChart3, Copy, Check, MessageSquare,
  ThumbsUp, ThumbsDown, Layers, ExternalLink,
} from 'lucide-react';

interface AgentContribution {
  agentId: string;
  agentRole: string;
  position: 'support' | 'oppose' | 'neutral' | 'conditional';
  reasoning: string;
  confidence: number;
  evidenceCited: string[];
}

interface DeliberationOutput {
  id: string;
  title: string;
  status: 'completed' | 'consensus' | 'split';
  completedAt: string;
  duration: string;
  mode: string;
  consensusScore: number;
  recommendation: string;
  summary: string;
  keyFindings: string[];
  risks: string[];
  nextSteps: string[];
  agentContributions: AgentContribution[];
  dissents: { agent: string; reason: string }[];
}

// Demo output (connects to real API when available)
const DEMO_OUTPUT: DeliberationOutput = {
  id: 'delib-2026-0214-001',
  title: 'Q1 Cloud Infrastructure Migration Strategy',
  status: 'consensus',
  completedAt: new Date(Date.now() - 3600000).toISOString(),
  duration: '11m 42s',
  mode: 'Strategic Advisory',
  consensusScore: 87,
  recommendation: 'Proceed with phased migration to multi-cloud architecture, prioritizing non-critical workloads in Phase 1 with full production migration in Phase 2.',
  summary: 'The Council reached strong consensus on a phased cloud migration approach. Risk Assessor flagged vendor lock-in concerns which were addressed through multi-cloud strategy. Financial Analyst confirmed ROI within 18 months.',
  keyFindings: [
    'Current on-premise infrastructure reaching 78% capacity — migration timeline is urgent',
    'Multi-cloud approach reduces vendor dependency risk by 64%',
    'Estimated 18-month ROI with $2.4M annual savings post-migration',
    'Compliance requirements met across all 3 target jurisdictions (US, EU, UK)',
    'Staff retraining required for 12 team members — 6-week program recommended',
  ],
  risks: [
    'Data sovereignty requirements may restrict EU workload placement',
    'Migration window conflicts with Q2 product launch — scheduling coordination needed',
    'Legacy system dependencies not fully mapped — discovery phase recommended',
  ],
  nextSteps: [
    'Commission full infrastructure audit (Week 1-2)',
    'Finalize cloud provider selection matrix (Week 2-3)',
    'Begin Phase 1 non-critical workload migration (Week 4-8)',
    'Schedule staff retraining program (Week 3 start)',
    'Establish migration monitoring dashboard',
  ],
  agentContributions: [
    { agentId: 'strategist', agentRole: 'Strategic Advisor', position: 'support', reasoning: 'Multi-cloud aligns with 3-year digital transformation roadmap and reduces single-vendor risk.', confidence: 92, evidenceCited: ['Gartner Cloud Report 2025', 'Internal capacity audit'] },
    { agentId: 'risk', agentRole: 'Risk Assessor', position: 'conditional', reasoning: 'Support with condition: must complete full dependency mapping before Phase 2.', confidence: 78, evidenceCited: ['ISO 27001 requirements', 'Past migration incident report'] },
    { agentId: 'financial', agentRole: 'Financial Analyst', position: 'support', reasoning: 'NPV positive at 18 months. OpEx reduction of 34% by Year 2.', confidence: 88, evidenceCited: ['TCO analysis spreadsheet', 'Vendor pricing comparisons'] },
    { agentId: 'compliance', agentRole: 'Compliance Officer', position: 'support', reasoning: 'All target providers meet SOC 2, GDPR, and ISO 27001 requirements.', confidence: 95, evidenceCited: ['SOC 2 Type II reports', 'GDPR adequacy decisions'] },
    { agentId: 'ethics', agentRole: 'Ethics Guardian', position: 'neutral', reasoning: 'No ethical concerns identified. Environmental impact positive due to cloud efficiency gains.', confidence: 90, evidenceCited: ['Carbon footprint analysis'] },
    { agentId: 'devil', agentRole: "Devil's Advocate", position: 'oppose', reasoning: 'Migration fatigue risk. Team has undergone 3 major changes in 18 months.', confidence: 72, evidenceCited: ['Team survey results', 'Change management literature'] },
    { agentId: 'operational', agentRole: 'Operations Lead', position: 'support', reasoning: 'Current infrastructure maintenance burden unsustainable. Migration reduces ops overhead by 40%.', confidence: 85, evidenceCited: ['Incident log analysis', 'SLA performance data'] },
  ],
  dissents: [
    { agent: "Devil's Advocate", reason: 'Concerned about change fatigue — recommends 3-month stabilization period before Phase 2.' },
  ],
};

const positionColor = (p: string) => {
  switch (p) {
    case 'support': return 'text-green-400 bg-green-500/10';
    case 'oppose': return 'text-red-400 bg-red-500/10';
    case 'conditional': return 'text-amber-400 bg-amber-500/10';
    default: return 'text-slate-400 bg-slate-500/10';
  }
};

export const PostDeliberationPanel: React.FC = () => {
  const { deliberationId } = useParams();
  const navigate = useNavigate();
  const [output, setOutput] = useState<DeliberationOutput>(DEMO_OUTPUT);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'evidence'>('overview');

  useEffect(() => {
    if (deliberationId) {
      apiClient.api.get<any>(`/deliberations/${deliberationId}`).then(res => {
        if (res.success && res.data) {
          // Map real data when available
        }
      });
    }
  }, [deliberationId]);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(`${output.title}\n\n${output.summary}\n\nRecommendation: ${output.recommendation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-xl font-bold text-neutral-100">Post-Deliberation Panel</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{output.title}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopySummary} className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>
          <button className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={cn(
        'p-4 rounded-xl border flex items-center gap-4',
        output.status === 'consensus' ? 'border-green-500/30 bg-green-500/5' :
        output.status === 'split' ? 'border-amber-500/30 bg-amber-500/5' :
        'border-blue-500/30 bg-blue-500/5'
      )}>
        {output.status === 'consensus' ? <CheckCircle className="w-6 h-6 text-green-400" /> :
         output.status === 'split' ? <AlertTriangle className="w-6 h-6 text-amber-400" /> :
         <CheckCircle className="w-6 h-6 text-blue-400" />}
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-200">
            {output.status === 'consensus' ? 'Consensus Reached' : output.status === 'split' ? 'Split Decision' : 'Deliberation Complete'}
          </p>
          <p className="text-xs text-neutral-400">{output.mode} · {output.duration} · Consensus: {output.consensusScore}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Completed</p>
          <p className="text-xs text-neutral-400">{new Date(output.completedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-800">
        {(['overview', 'agents', 'evidence'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
              activeTab === tab ? 'text-blue-400 border-blue-400' : 'text-neutral-500 border-transparent hover:text-neutral-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Recommendation */}
          <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Council Recommendation
            </h3>
            <p className="text-sm text-neutral-200">{output.recommendation}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Key Findings */}
            <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Key Findings
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {output.keyFindings.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-400 mt-2 shrink-0" />
                    <p className="text-xs text-neutral-300">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified Risks
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {output.risks.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <p className="text-xs text-neutral-300">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400" /> Next Steps
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {output.nextSteps.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 rounded px-1.5 py-0.5 shrink-0">{i + 1}</span>
                    <p className="text-xs text-neutral-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="space-y-4">
          {output.agentContributions.map((agent) => (
            <div key={agent.agentId} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Brain className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200">{agent.agentRole}</h4>
                    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', positionColor(agent.position))}>
                      {agent.position}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Confidence</p>
                  <p className={cn('text-sm font-bold', agent.confidence >= 85 ? 'text-green-400' : agent.confidence >= 70 ? 'text-amber-400' : 'text-red-400')}>
                    {agent.confidence}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 mb-3">{agent.reasoning}</p>
              {agent.evidenceCited.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {agent.evidenceCited.map((ev, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700">
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {output.dissents.length > 0 && (
            <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <ThumbsDown className="w-4 h-4" /> Formal Dissents ({output.dissents.length})
              </h3>
              {output.dissents.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-medium text-red-400 shrink-0">{d.agent}:</span>
                  <p className="text-xs text-neutral-300">{d.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">Evidence citations from this deliberation</p>
          <p className="text-neutral-600 text-xs mt-1">
            {output.agentContributions.reduce((sum, a) => sum + a.evidenceCited.length, 0)} sources cited across {output.agentContributions.length} agents
          </p>
          <div className="mt-6 max-w-md mx-auto space-y-2">
            {[...new Set(output.agentContributions.flatMap(a => a.evidenceCited))].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700/50 bg-neutral-900/50 text-left">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs text-neutral-300 flex-1">{ev}</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDeliberationPanel;
