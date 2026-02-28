// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// POST-DELIBERATION PANEL - Game-changing post-decision workflow
// Displays Statement of Facts and allows multiple action selection
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

type ClaimStatus =
  | 'verified'
  | 'partially_verified'
  | 'unverified'
  | 'disputed'
  | 'assumption'
  | 'requires_human';
type ActionCategory =
  | 'immediate'
  | 'analyze'
  | 'iterate'
  | 'govern'
  | 'communicate'
  | 'monitor'
  | 'automate';
type ActionPriority = 'critical' | 'high' | 'medium' | 'low';

interface Claim {
  id: string;
  agentId: string;
  agentName: string;
  statement: string;
  claimType: string;
  extractedValue?: string | number;
  status: ClaimStatus;
  confidence: number;
  evidence: Evidence[];
}

interface Evidence {
  id: string;
  type: string;
  description: string;
  source: { type: string; name: string; url?: string };
  calculation?: {
    formula: string;
    inputs: Record<string, number | string>;
    steps: string[];
    result: number | string;
  };
  strength: 'strong' | 'moderate' | 'weak' | 'circumstantial';
}

interface StatementOfFacts {
  totalClaims: number;
  verifiedClaims: number;
  partiallyVerified: number;
  unverifiedClaims: number;
  overallConfidence: number;
  verificationScore: number;
  claims: Claim[];
  keyAssumptions: string[];
  claimsByAgent: Record<
    string,
    { agentName: string; totalClaims: number; verified: number; confidence: number }
  >;
}

interface PostDeliberationAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  icon: string;
  integratedTool?: string;
  toolSuite?: string;
  requiresConfirmation: boolean;
  estimatedDuration?: string;
  requiredPlan: string;
  status: string;
  priority?: ActionPriority;
}

interface ExecutiveSummary {
  title: string;
  recommendation: string;
  keyFindings: string[];
  riskFactors: string[];
  nextSteps: string[];
  confidence: number;
}

interface PostDeliberationSession {
  id: string;
  deliberationId: string;
  executiveSummary: ExecutiveSummary;
  statementOfFacts: StatementOfFacts;
  availableActions: PostDeliberationAction[];
  selectedActions: { selectedActions: string[]; priority: Record<string, ActionPriority> };
  status: string;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface PostDeliberationPanelProps {
  deliberationId: string;
  onClose?: () => void;
  onActionComplete?: (outputs: unknown[]) => void;
}

// =============================================================================
// STATUS ICONS & COLORS
// =============================================================================

const claimStatusConfig: Record<ClaimStatus, { icon: string; color: string; label: string }> = {
  verified: { icon: '✅', color: 'text-green-400', label: 'Verified' },
  partially_verified: { icon: '🟡', color: 'text-yellow-400', label: 'Partially Verified' },
  unverified: { icon: '⚪', color: 'text-neutral-400', label: 'Unverified' },
  disputed: { icon: '❌', color: 'text-red-400', label: 'Disputed' },
  assumption: { icon: '💭', color: 'text-purple-400', label: 'Assumption' },
  requires_human: { icon: '👤', color: 'text-blue-400', label: 'Needs Review' },
};

const categoryConfig: Record<ActionCategory, { icon: string; color: string; label: string }> = {
  immediate: {
    icon: '⚡',
    color: 'bg-green-500/20 border-green-500/30',
    label: 'Immediate Actions',
  },
  analyze: { icon: '🔬', color: 'bg-blue-500/20 border-blue-500/30', label: 'Analyze Further' },
  iterate: {
    icon: '🔄',
    color: 'bg-purple-500/20 border-purple-500/30',
    label: 'Iterate & Refine',
  },
  govern: { icon: '⚖️', color: 'bg-orange-500/20 border-orange-500/30', label: 'Govern & Comply' },
  communicate: {
    icon: '📢',
    color: 'bg-cyan-500/20 border-cyan-500/30',
    label: 'Communicate & Share',
  },
  monitor: { icon: '📊', color: 'bg-indigo-500/20 border-indigo-500/30', label: 'Monitor & Track' },
  automate: { icon: '🤖', color: 'bg-pink-500/20 border-pink-500/30', label: 'Automate' },
};

const priorityConfig: Record<ActionPriority, { color: string; label: string }> = {
  critical: { color: 'bg-red-500', label: 'Critical' },
  high: { color: 'bg-orange-500', label: 'High' },
  medium: { color: 'bg-yellow-500', label: 'Medium' },
  low: { color: 'bg-blue-500', label: 'Low' },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PostDeliberationPanel: React.FC<PostDeliberationPanelProps> = ({
  deliberationId,
  onClose,
  onActionComplete,
}) => {
  // State
  const [session, setSession] = useState<PostDeliberationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'facts' | 'actions' | 'outputs'>(
    'summary'
  );
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [priorities, setPriorities] = useState<Record<string, ActionPriority>>({});
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<unknown[]>([]);

  const loadSession = async () => {
    try {
      setLoading(true);
      // Create session
      const res = await fetch('/api/v1/deliberation/post-deliberation/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliberationId }),
      });

      if (!res.ok) {
        throw new Error('Failed to create session');
      }
      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load session
  useEffect(() => {
    loadSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliberationId]);

  const toggleAction = (actionId: string) => {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const setPriority = (actionId: string, priority: ActionPriority) => {
    setPriorities((prev) => ({ ...prev, [actionId]: priority }));
  };

  const executeActions = async () => {
    if (!session || selectedActions.size === 0) {
      return;
    }

    try {
      setExecuting(true);
      const res = await fetch('/api/v1/deliberation/post-deliberation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          actionIds: Array.from(selectedActions),
          priorities,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to execute actions');
      }
      const result = await res.json();

      setSession(result);
      setOutputs(result.generatedOutputs || []);
      setActiveTab('outputs');

      if (onActionComplete) {
        onActionComplete(result.generatedOutputs || []);
      }
    } catch (err) {
      console.error('Failed to execute actions:', err);
    } finally {
      setExecuting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-neutral-400">Generating Statement of Facts...</p>
            <p className="text-sm text-neutral-500 mt-2">Validating all agent claims...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-700 p-8">
        <p className="text-red-400 text-center">Failed to load post-deliberation session</p>
      </div>
    );
  }

  const { executiveSummary, statementOfFacts, availableActions } = session;

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{executiveSummary.title}</h2>
            <p className="text-white/80 mt-1">What would you like to do next?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/60 text-sm">Confidence</p>
              <p className="text-2xl font-bold text-white">{executiveSummary.confidence}%</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Verification</p>
              <p className="text-2xl font-bold text-white">{statementOfFacts.verificationScore}%</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/60 hover:text-white ml-4">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        {(['summary', 'facts', 'actions', 'outputs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-6 py-4 font-medium transition-colors capitalize',
              activeTab === tab
                ? 'text-white border-b-2 border-primary-500 bg-neutral-800/50'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'
            )}
          >
            {tab === 'facts' ? 'Statement of Facts' : tab}
            {tab === 'actions' && selectedActions.size > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-500 rounded-full text-xs">
                {selectedActions.size}
              </span>
            )}
            {tab === 'outputs' && outputs.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-green-500 rounded-full text-xs">
                {outputs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Recommendation */}
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendation</h3>
              <p className="text-neutral-300 leading-relaxed">{executiveSummary.recommendation}</p>
            </div>

            {/* Key Findings, Risks, Next Steps */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">🔍</span> Key Findings
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.keyFindings.map((finding, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-primary-400">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Risk Factors
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.riskFactors.map((risk, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-orange-400">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span> Next Steps
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.nextSteps.map((step, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-green-400">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('facts')}
                className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
              >
                📋 Review Statement of Facts
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                ⚡ Choose Actions
              </button>
            </div>
          </div>
        )}

        {/* Statement of Facts Tab */}
        {activeTab === 'facts' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-6 gap-3">
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">{statementOfFacts.totalClaims}</p>
                <p className="text-xs text-neutral-400">Total Claims</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {statementOfFacts.verifiedClaims}
                </p>
                <p className="text-xs text-neutral-400">Verified</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {statementOfFacts.partiallyVerified}
                </p>
                <p className="text-xs text-neutral-400">Partial</p>
              </div>
              <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600 text-center">
                <p className="text-2xl font-bold text-neutral-400">
                  {statementOfFacts.unverifiedClaims}
                </p>
                <p className="text-xs text-neutral-400">Unverified</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">
                  {statementOfFacts.overallConfidence}%
                </p>
                <p className="text-xs text-neutral-400">Confidence</p>
              </div>
              <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/30 text-center">
                <p className="text-2xl font-bold text-primary-400">
                  {statementOfFacts.verificationScore}%
                </p>
                <p className="text-xs text-neutral-400">Verified %</p>
              </div>
            </div>

            {/* Claims by Agent */}
            <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
              <h4 className="font-semibold text-white mb-3">Claims by Agent</h4>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(statementOfFacts.claimsByAgent).map(([agentId, data]) => (
                  <div key={agentId} className="bg-neutral-700/50 rounded-lg p-3">
                    <p className="font-medium text-white text-sm">{data.agentName}</p>
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>{data.totalClaims} claims</span>
                      <span className="text-green-400">{data.verified} verified</span>
                    </div>
                    <div className="w-full bg-neutral-600 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${data.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Assumptions */}
            {statementOfFacts.keyAssumptions.length > 0 && (
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💭</span> Key Assumptions
                </h4>
                <ul className="space-y-2">
                  {statementOfFacts.keyAssumptions.map((assumption, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-purple-400">•</span>
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Claims */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">
                All Claims ({statementOfFacts.claims.length})
              </h4>
              {statementOfFacts.claims.map((claim) => {
                const statusCfg = claimStatusConfig[claim.status];
                const isExpanded = expandedClaim === claim.id;

                return (
                  <div
                    key={claim.id}
                    className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}
                      className="w-full p-4 flex items-start gap-4 text-left hover:bg-neutral-700/30 transition-colors"
                    >
                      <span className="text-xl">{statusCfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-200 text-sm">{claim.statement}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-neutral-500">{claim.agentName}</span>
                          <span className={statusCfg.color}>{statusCfg.label}</span>
                          <span className="text-neutral-500">{claim.claimType}</span>
                          {claim.extractedValue && (
                            <span className="text-primary-400">Value: {claim.extractedValue}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium text-white">
                            {claim.confidence}%
                          </span>
                        </div>
                        <span className="text-neutral-400">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* Evidence (expanded) */}
                    {isExpanded && claim.evidence.length > 0 && (
                      <div className="border-t border-neutral-700 p-4 bg-neutral-900/50">
                        <p className="text-xs font-medium text-neutral-400 mb-3">Evidence Chain:</p>
                        {claim.evidence.map((ev) => (
                          <div key={ev.id} className="mb-3 last:mb-0">
                            <div className="flex items-start gap-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-xs font-medium',
                                  ev.strength === 'strong'
                                    ? 'bg-green-500/20 text-green-400'
                                    : ev.strength === 'moderate'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-neutral-500/20 text-neutral-400'
                                )}
                              >
                                {ev.strength}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-neutral-300">{ev.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  Source: {ev.source.name}
                                </p>
                                {ev.calculation && (
                                  <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs font-mono">
                                    <p className="text-primary-400 mb-1">
                                      Formula: {ev.calculation.formula}
                                    </p>
                                    <p className="text-neutral-400">
                                      Inputs: {JSON.stringify(ev.calculation.inputs)}
                                    </p>
                                    <p className="text-green-400 mt-1">
                                      Result: {ev.calculation.result}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            {/* Selected Count */}
            {selectedActions.size > 0 && (
              <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {selectedActions.size} action{selectedActions.size > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-neutral-400">
                    You can select multiple actions to execute together
                  </p>
                </div>
                <button
                  onClick={executeActions}
                  disabled={executing}
                  className={cn(
                    'px-6 py-3 rounded-lg font-medium transition-colors',
                    executing
                      ? 'bg-neutral-600 text-neutral-400 cursor-wait'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  )}
                >
                  {executing
                    ? 'Executing...'
                    : `Execute ${selectedActions.size} Action${selectedActions.size > 1 ? 's' : ''}`}
                </button>
              </div>
            )}

            {/* Actions by Category */}
            {(Object.keys(categoryConfig) as ActionCategory[]).map((category) => {
              const categoryActions = availableActions.filter((a) => a.category === category);
              if (categoryActions.length === 0) {
                return null;
              }

              const cfg = categoryConfig[category];

              return (
                <div key={category} className={cn('rounded-xl border p-4', cfg.color)}>
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    {cfg.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryActions.map((action) => {
                      const isSelected = selectedActions.has(action.id);
                      const isUpgradeRequired = action.status === 'requires_upgrade';

                      return (
                        <div
                          key={action.id}
                          className={cn(
                            'bg-neutral-800/80 rounded-lg p-4 border transition-all cursor-pointer',
                            isUpgradeRequired && 'opacity-50 cursor-not-allowed',
                            isSelected
                              ? 'border-primary-500 ring-2 ring-primary-500/30'
                              : 'border-neutral-700 hover:border-neutral-500'
                          )}
                          onClick={() => !isUpgradeRequired && toggleAction(action.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white">{action.name}</p>
                                {isSelected && <span className="text-primary-400">✓</span>}
                              </div>
                              <p className="text-sm text-neutral-400 mt-1">{action.description}</p>
                              <div className="flex gap-2 mt-2">
                                {action.integratedTool && (
                                  <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded text-neutral-300">
                                    {action.integratedTool}
                                  </span>
                                )}
                                {action.estimatedDuration && (
                                  <span className="text-xs text-neutral-500">
                                    ~{action.estimatedDuration}
                                  </span>
                                )}
                                {isUpgradeRequired && (
                                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                                    Upgrade Required
                                  </span>
                                )}
                              </div>
                              {/* Priority selector (when selected) */}
                              {isSelected && (
                                <div
                                  className="flex gap-1 mt-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {(['critical', 'high', 'medium', 'low'] as ActionPriority[]).map(
                                    (p) => (
                                      <button
                                        key={p}
                                        onClick={() => setPriority(action.id, p)}
                                        className={cn(
                                          'px-2 py-1 text-xs rounded transition-colors',
                                          priorities[action.id] === p
                                            ? `${priorityConfig[p].color} text-white`
                                            : 'bg-neutral-700 text-neutral-400 hover:text-white'
                                        )}
                                      >
                                        {priorityConfig[p].label}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Outputs Tab */}
        {activeTab === 'outputs' && (
          <div className="space-y-4">
            {outputs.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">📭</span>
                <p className="text-neutral-400 mt-4">No outputs yet</p>
                <p className="text-sm text-neutral-500">Execute actions to generate outputs</p>
              </div>
            ) : (
              outputs.map((output: any, i) => (
                <div key={i} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">
                      {output.type === 'report'
                        ? '📄'
                        : output.type === 'simulation'
                          ? '🔬'
                          : output.type === 'task'
                            ? '📋'
                            : output.type === 'alert'
                              ? '🔔'
                              : output.type === 'data'
                                ? '📊'
                                : '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-white">{output.name}</p>
                      <p className="text-sm text-neutral-400">{output.description}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">
                      {new Date(output.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {output.data && (
                    <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <pre>
                        {typeof output.data === 'string'
                          ? output.data.substring(0, 500)
                          : JSON.stringify(output.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-700 p-4 bg-neutral-800/50 flex justify-between items-center">
        <p className="text-sm text-neutral-400">Session: {session.id.substring(0, 12)}...</p>
        <div className="flex gap-3">
          {activeTab !== 'actions' && (
            <button
              onClick={() => setActiveTab('actions')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Choose Actions
            </button>
          )}
          {selectedActions.size > 0 && activeTab === 'actions' && (
            <button
              onClick={executeActions}
              disabled={executing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {executing ? 'Executing...' : 'Execute Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDeliberationPanel;
