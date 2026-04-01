/**
 * Enhanced Sandbox Components
 *
 * Additional components for enhanced sandbox experience:
 * - Compliance Score visualization
 * - Decision Timeline
 * - Evidence Explorer (expandable)
 * - Export/Share functionality
 * - Cortex Intelligence components:
 *   - Pre-Mortem Analysis
 *   - Ghost Board
 *   - Decision Debt Tracker
 *   - Chronos Timeline
 *   - Live Demo Mode
 *
 * @module pages/sandbox/SandboxEnhanced
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState } from 'react';
import {
  BarChart3, Clock, Eye, ChevronDown, Share, FileText, Download,
  ShieldCheck, Users, AlertTriangle, Link2, TrendingUp, Brain, Ghost,
  Scale, Timer, Play, Zap, Target, ArrowRight, AlertCircle,
} from 'lucide-react';
import type { ReceiptData, TimelineEvent, ShellLabels } from './SandboxShared';

// =============================================================================
// COMPONENT — COMPLIANCE SCORE
// =============================================================================

export const ComplianceScore: React.FC<{ 
  score: number; 
  accent?: string; 
  labels?: ShellLabels;
  phase?: string;
  citationsVerified?: number;
  totalCitations?: number;
}> = ({ score, accent = 'emerald', labels, phase = 'idle', citationsVerified = 0, totalCitations = 14 }) => {
  const L = labels || { complianceScore: 'Compliance Score' } as ShellLabels;
  
  // Dynamic score based on phase
  const getDynamicScore = () => {
    if (phase === 'idle') return 0;
    if (phase === 'phase1') return 25; // AI draft complete
    if (phase === 'phase2') return 60 + Math.floor((citationsVerified / totalCitations) * 15); // During verification
    if (phase === 'phase3') return 85 + Math.floor((citationsVerified / totalCitations) * 15); // Final phase
    return score;
  };
  
  const dynamicScore = getDynamicScore();
  
  const getStatusMessage = () => {
    if (phase === 'idle') return 'Zero attorney review documented';
    if (phase === 'phase1') return 'AI draft complete - attorney review required';
    if (phase === 'phase2') return `${citationsVerified}/${totalCitations} citations verified`;
    if (phase === 'phase3') return citationsVerified === totalCitations ? 'ABA 512 satisfied - Ready to file' : 'Final verification in progress';
    return 'Compliance assessment complete';
  };
  
  const getColor = (s: number) => {
    if (s >= 90) return `text-${accent}-400`;
    if (s >= 75) return `text-${accent}-300`;
    if (s >= 60) return `text-amber-400`;
    return `text-red-400`;
  };
  
  const getBgColor = (s: number) => {
    if (s >= 90) return `bg-${accent}-400/20`;
    if (s >= 75) return `bg-${accent}-300/20`;
    if (s >= 60) return `bg-amber-400/20`;
    return `bg-red-400/20`;
  };
  
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> {L.complianceScore}
        </h3>
        <span className={`text-2xl font-bold ${getColor(dynamicScore)}`}>{dynamicScore}%</span>
      </div>
      <div className={`w-full h-2 rounded-full ${getBgColor(dynamicScore)}`}>
        <div className={`h-full rounded-full ${getColor(dynamicScore)} transition-all duration-1000 ease-out`} style={{ width: `${dynamicScore}%` }} />
      </div>
      <div className="mt-2 text-sm text-white/40 font-medium">
        {getStatusMessage()}
      </div>
      {phase === 'phase2' && (
        <div className="mt-1 text-xs text-white/30">
          Verifying citations... ({Math.round((citationsVerified / totalCitations) * 100)}% complete)
        </div>
      )}
    </div>
  );
};

// =============================================================================
// COMPONENT — TIMELINE
// =============================================================================

export const DecisionTimeline: React.FC<{ 
  events: TimelineEvent[]; 
  accent?: string;
  labels?: ShellLabels;
}> = ({ events, accent = 'emerald', labels }) => {
  const L = labels || { timeline: 'Decision Timeline' } as ShellLabels;
  
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
      <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" /> {L.timeline}
      </h3>
      <div className="space-y-3">
        {events.map((event, idx) => (
          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className={`mt-0.5 ${
              event.type === 'analysis' ? 'text-cyan-400' :
              event.type === 'flag' ? 'text-red-400' :
              event.type === 'warning' ? 'text-amber-400' :
              event.type === 'dissent' ? 'text-amber-400' :
              event.type === 'proposal' ? 'text-blue-400' :
              event.type === 'resolution' ? 'text-emerald-500' :
              event.type === 'withdrawal' ? 'text-gray-400' :
              'text-cyan-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-white/80">{event.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                  event.impact === 'high' ? 'bg-red-500/10 text-red-400' :
                  event.impact === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {event.impact.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-white/40">{event.description}</p>
              {event.agent && (
                <p className="text-[10px] text-white/20 mt-1">by {event.agent}</p>
              )}
              <p className="text-[10px] text-white/30 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — EVIDENCE EXPLORER
// =============================================================================

export const EvidenceExplorer: React.FC<{ 
  receipt: ReceiptData; 
  accent?: string;
  labels?: ShellLabels;
}> = ({ receipt, accent = 'emerald', labels }) => {
  const L = labels || { evidenceExplorer: 'Evidence Explorer' } as ShellLabels;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const evidenceSections = [
    {
      id: 'compliance',
      title: 'Compliance Analysis',
      icon: <ShieldCheck className="w-4 h-4" />,
      content: receipt.complianceValue,
      detail: `${receipt.complianceLabel} (${receipt.complianceThreshold})`
    },
    {
      id: 'agents',
      title: 'Agent Participation',
      icon: <Users className="w-4 h-4" />,
      content: `${receipt.agents.length} agents participated`,
      detail: receipt.agents.join(', ')
    },
    {
      id: 'dissents',
      title: 'Dissent Resolution',
      icon: <AlertTriangle className="w-4 h-4" />,
      content: `${receipt.dissents} dissents filed`,
      detail: receipt.dissentResolved ? 'All resolved' : 'Pending resolution'
    },
    {
      id: 'evidence',
      title: 'Evidence Chain',
      icon: <Link2 className="w-4 h-4" />,
      content: receipt.evidenceChain,
      detail: 'Cryptographic evidence trail'
    }
  ];
  
  return (
    <div className={`bg-[#0d1117] border border-${accent}-500/30 rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold text-${accent}-400 tracking-wider flex items-center gap-2`}>
          <Eye className="w-5 h-5" /> {L.evidenceExplorer}
        </h3>
        <button 
          onClick={() => setExpandedSection(expandedSection ? null : 'compliance')}
          className="text-[10px] text-white/40 hover:text-white/60"
        >
          {expandedSection ? <ChevronDown className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>
      
      {expandedSection ? (
        <div className="space-y-4">
          {evidenceSections.map((section) => (
            <div key={section.id} className="bg-black/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`text-${accent}-400 flex-shrink-0`}>{section.icon}</div>
                <div>
                  <h4 className="text-sm font-semibold text-white/80">{section.title}</h4>
                  <p className="text-xs text-white/60 mt-1">{section.content}</p>
                  <p className="text-[10px] text-white/30 mt-2">{section.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {evidenceSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setExpandedSection(section.id)}
              className="p-3 bg-black/30 border border-white/10 rounded-lg text-left hover:bg-black/40 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-${accent}-400`}>{section.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-white/80 truncate">{section.title}</h4>
                  <p className="text-[10px] text-white/40 truncate">{section.content}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// COMPONENT — EXPORT/SHARE PANEL
// =============================================================================

export const ExportSharePanel: React.FC<{ 
  receipt: ReceiptData; 
  accent?: string;
  labels?: ShellLabels;
}> = ({ receipt, accent = 'emerald', labels }) => {
  const L = labels || { 
    shareReport: 'Share Report',
    exportData: 'Export Data'
  } as ShellLabels;
  
  const handleExport = (format: 'json' | 'pdf') => {
    const data = format === 'json' 
      ? JSON.stringify(receipt, null, 2)
      : `PDF Export: ${receipt.guaranteeTitle}\n\n${receipt.guaranteeBody}\n\nGenerated: ${receipt.timestamp}`;
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandbox-receipt.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleShare = () => {
    const shareData = {
      title: receipt.guaranteeTitle,
      summary: receipt.guaranteeBody,
      score: receipt.complianceScore,
      timestamp: receipt.timestamp
    };
    
    if (navigator.share) {
      navigator.share({
        title: 'Datacendia Sandbox Report',
        text: JSON.stringify(shareData, null, 2),
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
      alert('Report data copied to clipboard');
    }
  };
  
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
      <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
        <Share className="w-3.5 h-3.5" /> {L.shareReport}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleExport('json')}
          className="p-3 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-white/60" />
          <span className="text-xs text-white/80">{L.exportData} (JSON)</span>
        </button>
        <button
          onClick={() => handleExport('pdf')}
          className="p-3 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-white/60" />
          <span className="text-xs text-white/80">{L.exportData} (PDF)</span>
        </button>
        <button
          onClick={handleShare}
          className="p-3 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-all flex items-center gap-2"
        >
          <Share className="w-4 h-4 text-white/60" />
          <span className="text-xs text-white/80">{L.shareReport}</span>
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — PRE-MORTEM ANALYSIS
// =============================================================================

export const PreMortemAnalysis: React.FC<{ 
  failures: Array<{
    type: string;
    probability: number;
    impact: string;
    description: string;
  }>;
  accent?: string;
  labels?: ShellLabels;
}> = ({ failures, accent = 'emerald', labels }) => {
  const title = 'Pre-Mortem Analysis';
  
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <Brain className="w-4 h-4" /> {title}
        </h3>
        <AlertTriangle className="w-4 h-4 text-amber-400" />
      </div>
      <div className="space-y-2">
        {failures.map((failure, idx) => (
          <div key={idx} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/80">{failure.type}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                failure.probability >= 0.7 ? 'bg-red-500/10 text-red-400' :
                failure.probability >= 0.4 ? 'bg-amber-500/10 text-amber-400' :
                'bg-cyan-500/10 text-cyan-400'
              }`}>
                {Math.round(failure.probability * 100)}% likely
              </span>
            </div>
            <p className="text-sm text-white/40">{failure.description}</p>
            <p className="text-xs text-white/30 mt-1">Impact: {failure.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — GHOST BOARD
// =============================================================================

export const GhostBoard: React.FC<{ 
  alternatives: Array<{
    path: string;
    probability: number;
    outcome: string;
    reason: string;
  }>;
  accent?: string;
  labels?: ShellLabels;
}> = ({ alternatives, accent = 'emerald', labels }) => {
  const title = 'Ghost Board';
  
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <Ghost className="w-4 h-4" /> {title}
        </h3>
        <Target className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="space-y-2">
        {alternatives.map((alt, idx) => (
          <div key={idx} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span className="text-sm font-medium text-white/80">{alt.path}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                alt.probability >= 0.7 ? 'bg-emerald-500/10 text-emerald-400' :
                alt.probability >= 0.4 ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {Math.round(alt.probability * 100)}% success
              </span>
            </div>
            <p className="text-sm text-white/40">{alt.outcome}</p>
            <p className="text-xs text-white/30 mt-1">{alt.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — DECISION DEBT TRACKER
// =============================================================================

export const DecisionDebtTracker: React.FC<{ 
  debt: Array<{
    decision: string;
    date: string;
    impact: number;
    accumulated: boolean;
  }>;
  totalDebt: number;
  accent?: string;
  labels?: ShellLabels;
}> = ({ debt, totalDebt, accent = 'emerald', labels }) => {
  const title = 'Decision Debt';
  
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <Scale className="w-4 h-4" /> {title}
        </h3>
        <span className={`text-sm font-bold ${
          totalDebt >= 80 ? 'text-red-400' :
          totalDebt >= 50 ? 'text-amber-400' :
          'text-emerald-400'
        }`}>
          {totalDebt}%
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${
        totalDebt >= 80 ? 'bg-red-400/20' :
        totalDebt >= 50 ? 'bg-amber-400/20' :
        'bg-emerald-400/20'
      }`}>
        <div className={`h-full rounded-full ${
          totalDebt >= 80 ? 'bg-red-400' :
          totalDebt >= 50 ? 'bg-amber-400' :
          'bg-emerald-400'
        }`} style={{ width: `${totalDebt}%` }} />
      </div>
      <div className="mt-3 space-y-2">
        {debt.slice(0, 3).map((item, idx) => (
          <div key={idx} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/80">{item.decision}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.accumulated ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                {item.accumulated ? 'Accumulated' : 'Resolved'}
              </span>
            </div>
            <p className="text-xs text-white/30">{item.date} · Impact: {item.impact}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — CHRONOS TIMELINE
// =============================================================================

export const ChronosTimeline: React.FC<{ 
  events: Array<{
    period: string;
    change: string;
    magnitude: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  accent?: string;
  labels?: ShellLabels;
}> = ({ events, accent = 'emerald', labels }) => {
  const title = 'Chronos Timeline';
  
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <Timer className="w-4 h-4" /> {title}
        </h3>
        <TrendingUp className="w-4 h-4 text-purple-400" />
      </div>
      <div className="space-y-2">
        {events.map((event, idx) => (
          <div key={idx} className="flex gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className={`mt-0.5 ${
              event.trend === 'improving' ? 'text-emerald-400' :
              event.trend === 'declining' ? 'text-red-400' :
              'text-cyan-400'
            }`}>
              {event.trend === 'improving' ? <TrendingUp className="w-4 h-4" /> :
               event.trend === 'declining' ? <TrendingUp className="w-4 h-4 rotate-180" /> :
               <Timer className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white/80">{event.period}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.magnitude >= 0.7 ? 'bg-purple-500/10 text-purple-400' :
                  event.magnitude >= 0.4 ? 'bg-amber-500/10 text-amber-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {Math.round(event.magnitude * 100)}% change
                </span>
              </div>
              <p className="text-sm text-white/40">{event.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — LIVE DEMO MODE
// =============================================================================

export const LiveDemoMode: React.FC<{ 
  isActive: boolean;
  currentAction: string;
  progress: number;
  accent?: string;
  labels?: ShellLabels;
}> = ({ isActive, currentAction, progress, accent = 'emerald', labels }) => {
  const title = 'Live Demo Mode';
  
  return (
    <div className={`bg-black/40 border rounded-xl p-4 ${
      isActive ? `border-${accent}-500/50` : 'border-white/10'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
          <Play className="w-4 h-4" /> {title}
        </h3>
        <div className={`w-2 h-2 rounded-full ${isActive ? `bg-${accent}-400 animate-pulse` : 'bg-gray-400'}`} />
      </div>
      {isActive && (
        <>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className={`w-3 h-3 text-${accent}-400`} />
              <span className="text-sm text-white/80">{currentAction}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full bg-${accent}-400/20`}>
              <div className={`h-full rounded-full bg-${accent}-400 transition-all duration-500`} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <AlertCircle className="w-3 h-3" />
            <span>Real-time AI decision making in progress</span>
          </div>
        </>
      )}
      {!isActive && (
        <div className="text-center py-2">
          <Play className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-sm text-white/40">Click to start live demonstration</p>
        </div>
      )}
    </div>
  );
};
