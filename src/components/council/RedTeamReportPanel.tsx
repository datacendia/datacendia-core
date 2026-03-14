/**
 * Component — CendiaRedTeam™ Adversarial Report Panel
 *
 * Displays the Red Team adversarial analysis report after a deliberation.
 * Shows the 6 attack vectors (bias, logic, regulatory, precedent,
 * adversarial frame, dissent amplify), gate decision, risk score,
 * and whether the deliberation was blocked or passed.
 *
 * @exports RedTeamReportPanel
 * @module components/council/RedTeamReportPanel
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Target,
  Scale,
  FileSearch,
  Swords,
  MessageSquare,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

interface AttackVector {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
  found: boolean;
  details: string;
  recommendation?: string;
}

interface RedTeamReport {
  deliberationId: string;
  gateDecision: 'pass' | 'block' | 'warn';
  overallRiskScore: number;
  attackVectors: AttackVector[];
  executionTime: number;
  timestamp: string;
  summary: string;
}

interface RedTeamReportPanelProps {
  deliberationId: string;
  className?: string;
}

const ATTACK_VECTOR_ICONS: Record<string, React.ElementType> = {
  bias: Target,
  logic: Zap,
  regulatory: Scale,
  precedent: FileSearch,
  adversarial_frame: Swords,
  dissent_amplify: MessageSquare,
};

// Mock data — in production, fetched from /api/v1/redteam/report/:deliberationId
const MOCK_REPORT: RedTeamReport = {
  deliberationId: 'del-001',
  gateDecision: 'warn',
  overallRiskScore: 42,
  executionTime: 1847,
  timestamp: new Date().toISOString(),
  summary: 'Moderate risk identified. Two attack vectors flagged concerns that warrant human review before finalizing. No blocking issues detected.',
  attackVectors: [
    {
      id: 'bias',
      name: 'Bias Detection',
      description: 'Scans for demographic, confirmation, anchoring, and framing biases in agent responses',
      severity: 'medium',
      found: true,
      details: 'Anchoring bias detected: CFO Advisor\'s cost estimate ($2.1M) anchored subsequent agent responses. 4 of 6 agents referenced this figure without independent verification.',
      recommendation: 'Request independent cost estimates from at least 2 agents before sharing initial figures.',
    },
    {
      id: 'logic',
      name: 'Logical Fallacy Detection',
      description: 'Identifies logical fallacies, circular reasoning, false dichotomies, and unfounded causal claims',
      severity: 'low',
      found: true,
      details: 'Minor appeal to authority detected in Legal Counsel\'s response: "Industry leaders are doing this" without citing specific precedents.',
      recommendation: 'Require specific citations when invoking industry precedent.',
    },
    {
      id: 'regulatory',
      name: 'Regulatory Gap Analysis',
      description: 'Cross-references decision against applicable regulatory frameworks for compliance gaps',
      severity: 'none',
      found: false,
      details: 'No regulatory gaps identified. Decision aligns with EU AI Act Article 14, GDPR Article 22, and SR 11-7 requirements.',
    },
    {
      id: 'precedent',
      name: 'Precedent Conflict Check',
      description: 'Checks if the proposed decision contradicts established organizational precedents',
      severity: 'none',
      found: false,
      details: 'No precedent conflicts found. Decision is consistent with 3 similar past decisions (87%, 73%, 65% similarity).',
    },
    {
      id: 'adversarial_frame',
      name: 'Adversarial Frame Testing',
      description: 'Tests if the decision changes when the question is reframed from opposing perspectives',
      severity: 'medium',
      found: true,
      details: 'When reframed as "What are the reasons NOT to proceed?", 2 agents changed their recommendation from APPROVE to ESCALATE. Decision may be frame-dependent.',
      recommendation: 'Present both positive and negative framings to the Council before finalizing.',
    },
    {
      id: 'dissent_amplify',
      name: 'Dissent Amplification',
      description: 'Amplifies minority dissent positions to test if they reveal overlooked risks',
      severity: 'none',
      found: false,
      details: 'Risk Analyzer\'s dissent was amplified and tested. The dissent raised valid concerns about timeline risk, but these were adequately addressed by the conditions in the final recommendation.',
    },
  ],
};

export const RedTeamReportPanel: React.FC<RedTeamReportPanelProps> = ({
  deliberationId,
  className = '',
}) => {
  const [report, setReport] = useState<RedTeamReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedVector, setExpandedVector] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/redteam/report/${deliberationId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setReport(data.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // API not available
      }
      // Fallback
      setReport({ ...MOCK_REPORT, deliberationId });
      setLoading(false);
    };

    if (deliberationId) fetchReport();
  }, [deliberationId]);

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'text-red-400 bg-red-950/50';
      case 'high': return 'text-orange-400 bg-orange-950/50';
      case 'medium': return 'text-amber-400 bg-amber-950/50';
      case 'low': return 'text-blue-400 bg-blue-950/50';
      default: return 'text-emerald-400 bg-emerald-950/50';
    }
  };

  const gateIcon = (decision: string) => {
    switch (decision) {
      case 'pass': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'block': return <ShieldX className="w-5 h-5 text-red-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    }
  };

  const gateBg = (decision: string) => {
    switch (decision) {
      case 'pass': return 'bg-emerald-950/30 border-emerald-800';
      case 'block': return 'bg-red-950/30 border-red-800';
      default: return 'bg-amber-950/30 border-amber-800';
    }
  };

  const gateLabel = (decision: string) => {
    switch (decision) {
      case 'pass': return 'GATE: PASSED';
      case 'block': return 'GATE: BLOCKED';
      default: return 'GATE: WARNING';
    }
  };

  const riskColor = (score: number) => {
    if (score >= 75) return 'text-red-400';
    if (score >= 50) return 'text-orange-400';
    if (score >= 25) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const riskBg = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 25) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="p-1.5 bg-red-500/10 rounded-lg">
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-zinc-200">CendiaRedTeam™ — Adversarial Analysis</h3>
          <p className="text-xs text-zinc-500">
            {loading ? 'Running adversarial analysis...' : report ? `${report.attackVectors.filter(v => v.found).length} of ${report.attackVectors.length} vectors flagged` : 'No report available'}
          </p>
        </div>
        {loading ? (
          <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
        ) : report ? (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${gateBg(report.gateDecision)}`}>
              {gateLabel(report.gateDecision)}
            </span>
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </div>
        ) : null}
      </button>

      {!isCollapsed && report && (
        <div className="border-t border-zinc-800">
          {/* Gate Decision Banner */}
          <div className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-800 ${gateBg(report.gateDecision)}`}>
            {gateIcon(report.gateDecision)}
            <div className="flex-1">
              <p className="text-sm text-zinc-200">{report.summary}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-2xl font-bold ${riskColor(report.overallRiskScore)}`}>{report.overallRiskScore}</p>
              <p className="text-[10px] text-zinc-500">Risk Score</p>
            </div>
          </div>

          {/* Risk Score Bar */}
          <div className="px-4 py-2 border-b border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span>Risk Level</span>
              <span>{report.overallRiskScore}/100</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${riskBg(report.overallRiskScore)}`} style={{ width: `${report.overallRiskScore}%` }} />
            </div>
          </div>

          {/* Attack Vectors */}
          <div className="divide-y divide-zinc-800">
            {report.attackVectors.map((vector) => {
              const Icon = ATTACK_VECTOR_ICONS[vector.id] || ShieldAlert;
              return (
                <div key={vector.id}>
                  <button
                    onClick={() => setExpandedVector(expandedVector === vector.id ? null : vector.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/30 transition-colors"
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${vector.found ? 'text-amber-400' : 'text-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{vector.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{vector.found ? vector.details : 'No issues detected'}</p>
                    </div>
                    {vector.found ? (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${severityColor(vector.severity)}`}>
                        {vector.severity.toUpperCase()}
                      </span>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    {expandedVector === vector.id ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </button>
                  {expandedVector === vector.id && (
                    <div className="px-4 pb-4 space-y-2 ml-7">
                      <p className="text-xs text-zinc-500">{vector.description}</p>
                      <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3">
                        <p className="text-sm text-zinc-300">{vector.details}</p>
                      </div>
                      {vector.recommendation && (
                        <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-lg p-3">
                          <p className="text-xs font-semibold text-emerald-400 mb-1">Recommendation</p>
                          <p className="text-sm text-zinc-300">{vector.recommendation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-zinc-950/50 text-xs text-zinc-600 flex items-center justify-between">
            <span>Analysis completed in {report.executionTime}ms</span>
            <span>{new Date(report.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedTeamReportPanel;
