// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// EXECUTIVE SUMMARY - Deliberation Summary Component
// =============================================================================

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Check,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CouncilModeBadge } from './CouncilModeSelector';

export interface ActionItem {
  action: string;
  owner: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ExecutiveSummaryData {
  decision: string;
  confidence: { score: number; level: string };
  keyInsights: string[];
  risks: Array<{ description: string; severity: number }>;
  actionItems: ActionItem[];
  dissent?: string;
  mode: string;
  processingTime: number;
  agentCount: number;
}

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

function ConfidenceBadge({ confidence }: { confidence: { score: number; level: string } }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    high: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    low: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
  };

  const level = confidence.score >= 80 ? 'high' : confidence.score >= 60 ? 'medium' : 'low';
  const style = colors[level];

  return (
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-medium border',
        style.bg,
        style.text,
        style.border
      )}
    >
      {confidence.score}% confidence
    </span>
  );
}

function RiskBadge({ severity }: { severity: number }) {
  const level = severity <= 3 ? 'low' : severity <= 6 ? 'medium' : 'high';
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-green-500/20', text: 'text-green-400' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    high: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };
  const style = colors[level];

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', style.bg, style.text)}>
      {severity}/10
    </span>
  );
}

export function ExecutiveSummary({
  data,
  isExpanded = true,
  onToggle,
  className,
}: ExecutiveSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCopy = async (format: 'tldr' | 'full' | 'email') => {
    let text = '';

    switch (format) {
      case 'tldr':
        text = `TL;DR: ${data.decision} (${data.confidence.score}% confidence)\n\nNext Action: ${data.actionItems[0]?.action || 'N/A'}`;
        break;
      case 'email':
        text = `Subject: Council Decision Summary\n\n${data.decision}\n\nConfidence: ${data.confidence.score}%\n\nKey Insights:\n${data.keyInsights.map((i) => `• ${i}`).join('\n')}\n\nNext Steps:\n${data.actionItems.map((a) => `• ${a.action} (${a.owner}, by ${a.deadline})`).join('\n')}`;
        break;
      case 'full':
      default:
        text = JSON.stringify(data, null, 2);
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn('bg-slate-900 border border-slate-700 rounded-xl overflow-hidden', className)}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Executive Summary</h3>
            <div className="flex items-center gap-2 mt-1">
              <CouncilModeBadge modeId={data.mode} />
              <ConfidenceBadge confidence={data.confidence} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            <span>{data.agentCount} agents</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{(data.processingTime / 1000).toFixed(1)}s</span>
          </div>
          {onToggle &&
            (isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ))}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-4">
          {/* Decision */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Decision</h4>
            <p className="text-white text-lg leading-relaxed">{data.decision}</p>
          </div>

          {/* Key Insights */}
          {data.keyInsights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {data.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {data.risks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Identified Risks</h4>
              <ul className="space-y-2">
                {data.risks.map((risk, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-2 text-slate-300 bg-slate-800/50 rounded-lg p-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{risk.description}</span>
                    </div>
                    <RiskBadge severity={risk.severity} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {data.actionItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Action Items</h4>
              <div className="space-y-2">
                {data.actionItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          item.priority === 'high'
                            ? 'bg-red-400'
                            : item.priority === 'medium'
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                        )}
                      />
                      <div>
                        <div className="text-white">{item.action}</div>
                        <div className="text-sm text-slate-400">{item.owner}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{item.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dissent */}
          {data.dissent && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Dissenting View</h4>
              <p className="text-slate-300 text-sm">{data.dissent}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
            <button
              onClick={() => handleCopy('tldr')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copied!' : 'Copy TL;DR'}
            </button>
            <button
              onClick={() => handleCopy('email')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Email Format
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExecutiveSummary;
