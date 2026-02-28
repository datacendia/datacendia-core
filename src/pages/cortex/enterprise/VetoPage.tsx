// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA VETO™ — ADVERSARIAL GOVERNANCE ENGINE
// First veto-based (not just advisory) AI governance system
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  vetoService,
  VetoAgent,
  VetoDecision,
  VetoPolicy,
  VetoMetrics,
  VetoAgentRole,
} from '../../../services/VetoService';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const VetoPage: React.FC = () => {
  const navigate = useNavigate();
  const [agents] = useState<VetoAgent[]>(vetoService.getVetoAgents());
  const [decisions, setDecisions] = useState<VetoDecision[]>([]);
  const [policies, setPolicies] = useState<VetoPolicy[]>([]);
  const [metrics, setMetrics] = useState<VetoMetrics | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<VetoDecision | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proposals' | 'policies' | 'agents'>(
    'dashboard'
  );
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(false);

  const loadData = useCallback(() => {
    setDecisions(vetoService.getAllDecisions());
    setPolicies(vetoService.getPolicies());
    setMetrics(vetoService.getMetrics());
    setOllamaStatus(vetoService.isOllamaAvailable());
  }, []);

  useEffect(() => {
    loadData();
    vetoService.refreshOllamaStatus().then(() => setOllamaStatus(vetoService.isOllamaAvailable()));
  }, [loadData]);

  const handleSubmitProposal = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await vetoService.submitProposal(
        newProposal.title,
        newProposal.description,
        'current-user',
        newProposal.category || undefined
      );
      loadData();
      setShowNewProposal(false);
      setNewProposal({ title: '', description: '', category: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOverride = (decisionId: string) => {
    const reason = prompt('Enter reason for override request:');
    if (reason) {
      vetoService.requestOverride(decisionId, 'current-user', reason);
      loadData();
    }
  };

  const getStatusColor = (status: VetoDecision['status']) => {
    const colors = {
      pending: 'bg-amber-600',
      approved: 'bg-green-600',
      vetoed: 'bg-red-600',
      override_requested: 'bg-purple-600',
      escalated: 'bg-orange-600',
    };
    return colors[status];
  };

  const getAgentIcon = (role: VetoAgentRole) => {
    const agent = agents.find((a) => a.role === role);
    return agent?.avatar || '🤖';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-red-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🛡️</span>
                  CendiaVeto™
                  <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 rounded-full font-medium">
                    GOVERNANCE
                  </span>
                </h1>
                <p className="text-red-300 text-sm">
                  Adversarial Governance Engine • Enforceable AI Veto Rights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${ollamaStatus ? 'bg-green-900/50' : 'bg-red-900/50'}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${ollamaStatus ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
                />
                <span className="text-xs">{ollamaStatus ? 'AI Active' : 'AI Offline'}</span>
              </div>
              <button
                onClick={() => setShowNewProposal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors"
              >
                + New Proposal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      {metrics && (
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-b border-red-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalProposals}</div>
                <div className="text-xs text-red-300">Total Proposals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.approvedProposals}</div>
                <div className="text-xs text-red-300">Approved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.vetoedProposals}</div>
                <div className="text-xs text-red-300">Vetoed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.pendingProposals}</div>
                <div className="text-xs text-red-300">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.overrideRequests}</div>
                <div className="text-xs text-red-300">Override Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {metrics.avgReviewTime.toFixed(1)}h
                </div>
                <div className="text-xs text-red-300">Avg Review Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-red-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['dashboard', 'proposals', 'policies', 'agents'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-red-500'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Recent Decisions */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-red-800/50">
              <h2 className="text-lg font-bold mb-4">Recent Decisions</h2>
              <div className="space-y-3">
                {decisions.slice(0, 5).map((decision) => (
                  <div
                    key={decision.id}
                    onClick={() => setSelectedDecision(decision)}
                    className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{decision.proposalTitle}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getStatusColor(decision.status)}`}
                      >
                        {decision.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2">
                      {decision.proposalDescription}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span>{decision.reviews.length} reviews</span>
                      <span>{decision.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {decisions.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    No proposals yet. Submit one to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Veto Agents */}
            <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
              <h2 className="text-lg font-bold mb-4">Veto Agents</h2>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-3 bg-black/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{agent.avatar}</span>
                      <div>
                        <div className="font-semibold text-sm">{agent.name}</div>
                        <div className="text-xs text-white/50">{agent.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {agent.canBlockAutomatic && (
                        <span className="px-2 py-0.5 bg-red-900/50 rounded text-red-300">
                          Can Block
                        </span>
                      )}
                      <span className="text-white/40">Threshold: {agent.vetoThreshold}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-black/30 rounded-2xl p-6 border border-red-800/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{decision.proposalTitle}</h3>
                    <p className="text-sm text-white/60">{decision.proposalDescription}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(decision.status)}`}
                    >
                      {decision.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {decision.status === 'vetoed' && !decision.overrideRequested && (
                      <button
                        onClick={() => handleRequestOverride(decision.id)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
                      >
                        Request Override
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {decision.reviews.map((review) => {
                    const agent = agents.find((a) => a.role === review.agentRole);
                    return (
                      <div
                        key={review.id}
                        className={`p-3 rounded-xl ${
                          review.status === 'vetoed'
                            ? 'bg-red-900/30 border border-red-600/50'
                            : review.status === 'approved'
                              ? 'bg-green-900/30 border border-green-600/50'
                              : 'bg-amber-900/30 border border-amber-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{agent?.avatar}</span>
                          <span className="font-medium text-sm">{agent?.name}</span>
                        </div>
                        <div className="text-xs text-white/60 mb-1">
                          Risk Score:{' '}
                          <span
                            className={
                              review.riskScore >= 70
                                ? 'text-red-400'
                                : review.riskScore >= 50
                                  ? 'text-amber-400'
                                  : 'text-green-400'
                            }
                          >
                            {review.riskScore}%
                          </span>
                        </div>
                        <div className="text-xs text-white/50 line-clamp-2">{review.reasoning}</div>
                        {review.isBlocking && (
                          <div className="mt-2 text-xs text-red-400 font-semibold">⛔ BLOCKING</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="grid grid-cols-2 gap-6">
            {policies.map((policy) => (
              <div key={policy.id} className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{policy.name}</h3>
                  <button
                    onClick={() => {
                      vetoService.togglePolicy(policy.id);
                      loadData();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs ${
                      policy.isActive ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {policy.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <p className="text-sm text-white/60 mb-4">{policy.description}</p>
                <div className="space-y-2">
                  <div className="text-xs text-white/40">
                    Required Agents: {policy.requiredAgents.map((r) => getAgentIcon(r)).join(' ')}
                  </div>
                  <div className="text-xs text-white/40">
                    Auto-Veto Threshold: {policy.autoVetoThreshold}%
                  </div>
                  <div className="text-xs text-white/40">
                    Escalation: {policy.escalationPath.join(' → ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="grid grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{agent.avatar}</span>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-white/60">{agent.title}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-4">{agent.description}</p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {agent.jurisdiction.map((j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-300"
                      >
                        {j.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="p-2 bg-black/20 rounded">
                      <span className="text-white/50">Veto Threshold</span>
                      <div className="font-bold text-lg">{agent.vetoThreshold}%</div>
                    </div>
                    <div className="p-2 bg-black/20 rounded">
                      <span className="text-white/50">Vetoes</span>
                      <div className="font-bold text-lg">
                        {metrics?.vetosByAgent[agent.role] || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {agent.canBlockAutomatic && (
                      <span className="px-2 py-1 bg-red-600 rounded text-xs">Can Auto-Block</span>
                    )}
                    {agent.requiresHumanOverride && (
                      <span className="px-2 py-1 bg-purple-600 rounded text-xs">
                        Human Override Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Proposal Modal */}
      {showNewProposal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-red-800/50">
            <h2 className="text-xl font-bold mb-4">Submit New Proposal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/30 border border-red-700/50 rounded-lg"
                  placeholder="Proposal title"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/30 border border-red-700/50 rounded-lg h-32"
                  placeholder="Describe the proposal in detail..."
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Category (optional)</label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/30 border border-red-700/50 rounded-lg"
                >
                  <option value="">Select category</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="data">Data</option>
                  <option value="hr">HR / Workforce</option>
                  <option value="financial">Financial</option>
                  <option value="ai">AI / ML</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewProposal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProposal}
                  disabled={isSubmitting || !newProposal.title || !newProposal.description}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Detail Modal */}
      {selectedDecision && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedDecision(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-red-800/50 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedDecision.proposalTitle}</h2>
                <p className="text-sm text-white/60">
                  Submitted {selectedDecision.submittedAt.toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedDecision.status)}`}>
                {selectedDecision.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <p className="text-white/80 mb-6">{selectedDecision.proposalDescription}</p>

            <h3 className="font-semibold mb-3">Agent Reviews</h3>
            <div className="space-y-3">
              {selectedDecision.reviews.map((review) => {
                const agent = agents.find((a) => a.role === review.agentRole);
                return (
                  <div key={review.id} className="p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{agent?.avatar}</span>
                        <span className="font-medium">{agent?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            review.status === 'vetoed'
                              ? 'bg-red-600'
                              : review.status === 'approved'
                                ? 'bg-green-600'
                                : 'bg-amber-600'
                          }`}
                        >
                          {review.status}
                        </span>
                        <span className="text-sm">Risk: {review.riskScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">{review.reasoning}</p>
                    {review.concerns.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-white/50 mb-1">Concerns:</div>
                        {review.concerns.map((c) => (
                          <div key={c.id} className="text-xs p-2 bg-black/20 rounded mb-1">
                            <span
                              className={`font-semibold ${
                                c.severity === 'critical'
                                  ? 'text-red-400'
                                  : c.severity === 'high'
                                    ? 'text-orange-400'
                                    : c.severity === 'medium'
                                      ? 'text-amber-400'
                                      : 'text-white/60'
                              }`}
                            >
                              {c.severity.toUpperCase()}
                            </span>
                            : {c.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedDecision(null)}
              className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetoPage;
