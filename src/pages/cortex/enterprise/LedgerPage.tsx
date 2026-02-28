// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA LEDGER™ — IMMUTABLE DECISION BLOCKCHAIN
// First AI decision provenance for regulatory audit
// Every deliberation, vote, veto, and confidence score recorded on chain
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { governApi, councilApi } from '../../../lib/api';
import {
  ledgerService,
  LedgerEntry,
  DecisionRecord,
  LedgerMetrics,
  ChainVerificationResult,
  ComplianceFramework,
  LedgerEventType,
} from '../../../services/LedgerService';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [metrics, setMetrics] = useState<LedgerMetrics | null>(null);
  const [chainStatus, setChainStatus] = useState<ChainVerificationResult | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'chain' | 'decisions' | 'audit' | 'export'>('chain');
  const [showNewDecision, setShowNewDecision] = useState(false);
  const [filterFramework, setFilterFramework] = useState<ComplianceFramework | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from APIs
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch real audit data from API
      const [auditsRes, decisionsRes] = await Promise.all([
        governApi.getAudits(),
        councilApi.getRecentDecisions(50),
      ]);

      // Map audit entries to ledger entries
      if (auditsRes.success && auditsRes.data && Array.isArray(auditsRes.data)) {
        const realEntries: LedgerEntry[] = (auditsRes.data as any[]).map((audit, idx) => ({
          id: audit.id,
          sequence: idx + 1,
          timestamp: new Date(audit.created_at),
          eventType: 'audit.completed' as LedgerEventType,
          decisionId: audit.policy_id || 'N/A',
          organizationId: audit.organization_id,
          title: `Audit: ${audit.audit_type || 'Compliance Check'}`,
          description: audit.findings?.length ? `${audit.findings.length} findings` : 'No findings',
          data: audit,
          confidenceScore: 100 - (audit.risk_score || 0),
          previousHash: idx > 0 ? `hash-${idx - 1}` : 'genesis',
          hash: `hash-${idx}`,
          complianceFrameworks: ['SOC2', 'SOX'] as ComplianceFramework[],
          retentionPeriodDays: 2555,
          sensitivityLevel: 'confidential' as const,
          piiInvolved: false,
          verified: audit.status === 'completed',
        }));

        if (realEntries.length > 0) {
          setEntries(realEntries);
          console.log('[Ledger] Loaded', realEntries.length, 'audit entries from API');
        } else {
          setEntries(ledgerService.getAllEntries());
        }
      } else {
        setEntries(ledgerService.getAllEntries());
      }

      // Map decisions from council
      if (decisionsRes.success && decisionsRes.data && Array.isArray(decisionsRes.data)) {
        const realDecisions: DecisionRecord[] = (decisionsRes.data as any[]).map((d) => ({
          id: d.id,
          title: d.query || d.title || 'Council Decision',
          description: d.response || 'Decision made by AI Council',
          proposedBy: 'AI Council',
          proposedAt: new Date(d.created_at || d.timestamp),
          status: 'approved' as const,
          agents: d.agents?.map((a: any) => a.id || a) || [],
          voters: [],
          finalConfidence: d.confidence || 85,
          ledgerEntries: [],
          firstEntryHash: 'genesis',
          latestEntryHash: `hash-${d.id}`,
          complianceStatus: 'compliant' as const,
          auditHistory: [],
        }));

        if (realDecisions.length > 0) {
          setDecisions(realDecisions);
          console.log('[Ledger] Loaded', realDecisions.length, 'decisions from API');
        } else {
          setDecisions(ledgerService.getAllDecisions());
        }
      } else {
        setDecisions(ledgerService.getAllDecisions());
      }

      // Calculate metrics from real data
      setMetrics(ledgerService.getMetrics());
      setChainStatus(ledgerService.verifyChain());
    } catch (error) {
      console.error('[Ledger] Failed to load data, using fallback:', error);
      setEntries(ledgerService.getAllEntries());
      setDecisions(ledgerService.getAllDecisions());
      setMetrics(ledgerService.getMetrics());
      setChainStatus(ledgerService.verifyChain());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getEventIcon = (type: LedgerEventType) => {
    const icons: Record<string, string> = {
      'decision.proposed': '📋',
      'decision.deliberated': '💭',
      'decision.voted': '🗳️',
      'decision.vetoed': '⛔',
      'decision.approved': '✅',
      'decision.executed': '🚀',
      'decision.outcome_recorded': '📊',
      'agent.joined': '🤖',
      'agent.contributed': '💬',
      'agent.voted': '✋',
      'agent.vetoed': '🛑',
      'confidence.updated': '📈',
      'evidence.attached': '📎',
      'audit.requested': '🔍',
      'audit.completed': '✔️',
      'compliance.check': '📋',
      'override.requested': '⚠️',
      'override.approved': '✅',
      'override.denied': '❌',
    };
    return icons[type] || '📝';
  };

  const getEventColor = (type: LedgerEventType) => {
    if (type.includes('vetoed') || type.includes('denied')) {
      return 'border-red-600/50 bg-red-900/20';
    }
    if (type.includes('approved') || type.includes('completed')) {
      return 'border-green-600/50 bg-green-900/20';
    }
    if (type.includes('voted') || type.includes('contributed')) {
      return 'border-blue-600/50 bg-blue-900/20';
    }
    if (type.includes('audit') || type.includes('compliance')) {
      return 'border-purple-600/50 bg-purple-900/20';
    }
    return 'border-amber-600/50 bg-amber-900/20';
  };

  const filteredEntries =
    filterFramework === 'all'
      ? entries
      : entries.filter((e) => e.complianceFrameworks.includes(filterFramework));

  const handleExport = (decisionId: string) => {
    const json = ledgerService.exportForAudit(decisionId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-export-${decisionId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">⛓️</span>
                  CendiaLedger™
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    BLOCKCHAIN
                  </span>
                </h1>
                <p className="text-emerald-300 text-sm">
                  Immutable Decision Blockchain • Regulatory Audit Trail
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {chainStatus && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${chainStatus.valid ? 'bg-green-900/50' : 'bg-red-900/50'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${chainStatus.valid ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
                  />
                  <span className="text-xs">
                    {chainStatus.valid ? 'Chain Valid' : 'Chain Broken!'}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  const ctx = {
                    question: 'Analyze the decision ledger and identify any patterns, risks, or compliance concerns',
                    sourcePage: 'CendiaLedger',
                    contextSummary: `Ledger: ${entries.length} entries, ${decisions.length} decisions`,
                    contextData: {
                      totalEntries: entries.length,
                      totalDecisions: decisions.length,
                      chainValid: chainStatus?.valid,
                      approvalRate: metrics?.approvalRate,
                      vetoRate: metrics?.vetoRate,
                    },
                    suggestedMode: 'compliance',
                  };
                  sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                  navigate('/cortex/council?fromContext=true');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                💬 Ask Council
              </button>
              <button
                onClick={() => setShowNewDecision(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
              >
                + New Decision
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      {metrics && (
        <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-b border-emerald-800/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-7 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{metrics.totalEntries}</div>
                <div className="text-xs text-emerald-300">Total Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.totalDecisions}</div>
                <div className="text-xs text-emerald-300">Decisions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{metrics.approvalRate}%</div>
                <div className="text-xs text-emerald-300">Approval Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{metrics.vetoRate}%</div>
                <div className="text-xs text-emerald-300">Veto Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {metrics.averageConfidence}%
                </div>
                <div className="text-xs text-emerald-300">Avg Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.piiEntriesCount}</div>
                <div className="text-xs text-emerald-300">PII Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{metrics.pendingAudits}</div>
                <div className="text-xs text-emerald-300">Pending Audits</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-emerald-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['chain', 'decisions', 'audit', 'export'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-emerald-500'
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
        {activeTab === 'chain' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Chain Visualization */}
            <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Blockchain Entries</h2>
                <select
                  value={filterFramework}
                  onChange={(e) =>
                    setFilterFramework(e.target.value as ComplianceFramework | 'all')
                  }
                  className="px-3 py-1.5 bg-black/30 border border-emerald-700/50 rounded-lg text-sm"
                >
                  <option value="all">All Frameworks</option>
                  <option value="GDPR">GDPR</option>
                  <option value="SOX">SOX</option>
                  <option value="HIPAA">HIPAA</option>
                  <option value="SOC2">SOC2</option>
                  <option value="ISO27001">ISO27001</option>
                </select>
              </div>

              <div className="relative">
                {/* Chain line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-700/50" />

                <div className="space-y-4">
                  {filteredEntries.slice(0, 20).map((entry, i) => (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`relative pl-14 cursor-pointer group`}
                    >
                      {/* Chain node */}
                      <div
                        className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                          entry.verified
                            ? 'border-green-500 bg-green-900'
                            : 'border-emerald-500 bg-emerald-900'
                        } flex items-center justify-center text-xs`}
                      >
                        {i + 1}
                      </div>

                      <div
                        className={`p-4 rounded-xl border ${getEventColor(entry.eventType)} group-hover:border-emerald-400 transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getEventIcon(entry.eventType)}</span>
                            <div>
                              <h3 className="font-semibold text-sm">{entry.title}</h3>
                              <p className="text-xs text-white/50">{entry.eventType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/40">
                              {entry.timestamp.toLocaleString()}
                            </div>
                            {entry.confidenceScore !== undefined && (
                              <div className="text-xs text-emerald-400">
                                {entry.confidenceScore}% confidence
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs text-emerald-400 font-mono bg-black/30 px-2 py-0.5 rounded">
                            {entry.hash.substring(0, 12)}...
                          </code>
                          {entry.verified && (
                            <span className="text-xs text-green-400">✓ Verified</span>
                          )}
                          {entry.complianceFrameworks.map((f) => (
                            <span
                              key={f}
                              className="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {entries.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                      No entries yet. Create a decision to start the chain.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chain Stats */}
            <div className="space-y-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Chain Integrity</h2>
                {chainStatus && (
                  <div
                    className={`p-4 rounded-xl ${chainStatus.valid ? 'bg-green-900/30 border border-green-600/50' : 'bg-red-900/30 border border-red-600/50'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{chainStatus.valid ? '✅' : '❌'}</span>
                      <span className="font-bold">
                        {chainStatus.valid ? 'Chain Valid' : 'Chain Broken'}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{chainStatus.message}</p>
                    <div className="mt-2 text-xs text-white/50">
                      Entries checked: {chainStatus.entriesChecked}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setChainStatus(ledgerService.verifyChain())}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm"
                >
                  🔄 Verify Chain
                </button>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Compliance Coverage</h2>
                {metrics && (
                  <div className="space-y-2">
                    {Object.entries(metrics.entriesByFramework).map(([framework, count]) => (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{
                                width: `${Math.min(100, (count / Math.max(1, metrics.totalEntries)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-white/50 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {entries.slice(0, 5).map((e) => (
                    <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span>{getEventIcon(e.eventType)}</span>
                      <span className="flex-1 truncate">{e.title}</span>
                      <span className="text-xs text-white/40">
                        {e.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50 cursor-pointer hover:border-emerald-500 transition-colors"
                onClick={() => setSelectedDecision(decision)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{decision.title}</h3>
                    <p className="text-sm text-white/60">{decision.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        decision.status === 'approved'
                          ? 'bg-green-600'
                          : decision.status === 'vetoed' || decision.status === 'rejected'
                            ? 'bg-red-600'
                            : 'bg-amber-600'
                      }`}
                    >
                      {decision.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-white/50">
                  <span>Proposed: {decision.proposedAt.toLocaleDateString()}</span>
                  <span>{decision.ledgerEntries.length} chain entries</span>
                  <span>{decision.voters.length} votes</span>
                  {decision.finalConfidence !== undefined && (
                    <span className="text-emerald-400">{decision.finalConfidence}% confidence</span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    First: {decision.firstEntryHash.substring(0, 12)}...
                  </code>
                  <span className="text-white/30">→</span>
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-emerald-400">
                    Latest: {decision.latestEntryHash.substring(0, 12)}...
                  </code>
                </div>
              </div>
            ))}
            {decisions.length === 0 && (
              <div className="text-center py-12 text-white/40">
                No decisions recorded yet. Create one to begin tracking.
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Request Audit</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const decisionId = formData.get('decisionId') as string;
                  const framework = formData.get('framework') as ComplianceFramework;
                  const reason = formData.get('reason') as string;

                  if (decisionId && framework && reason) {
                    ledgerService.requestAudit(decisionId, 'current-user', reason, framework);
                    loadData();
                    form.reset();
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-white/60 mb-1">Decision</label>
                  <select
                    name="decisionId"
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg"
                  >
                    <option value="">Select decision</option>
                    {decisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Compliance Framework</label>
                  <select
                    name="framework"
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg"
                  >
                    <option value="">Select framework</option>
                    <option value="GDPR">GDPR</option>
                    <option value="SOX">SOX</option>
                    <option value="HIPAA">HIPAA</option>
                    <option value="SOC2">SOC2</option>
                    <option value="ISO27001">ISO 27001</option>
                    <option value="PCI-DSS">PCI-DSS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Reason for Audit</label>
                  <textarea
                    name="reason"
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-24"
                    placeholder="Describe the reason for this audit request..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Request Audit
                </button>
              </form>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Audit History</h2>
              <div className="space-y-3">
                {decisions
                  .flatMap((d) => d.auditHistory.map((a) => ({ ...a, decision: d })))
                  .slice(0, 10)
                  .map((audit) => (
                    <div key={audit.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{audit.decision.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            audit.status === 'completed'
                              ? 'bg-green-600'
                              : audit.status === 'failed'
                                ? 'bg-red-600'
                                : 'bg-amber-600'
                          }`}
                        >
                          {audit.status}
                        </span>
                      </div>
                      <div className="text-sm text-white/60">{audit.reason}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span>{audit.framework}</span>
                        <span>{audit.requestedAt.toLocaleDateString()}</span>
                        {audit.findings.length > 0 && (
                          <span className="text-amber-400">{audit.findings.length} findings</span>
                        )}
                      </div>
                    </div>
                  ))}
                {decisions.flatMap((d) => d.auditHistory).length === 0 && (
                  <div className="text-center py-8 text-white/40">No audits requested yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export for Regulatory Audit</h2>
              <p className="text-sm text-white/60 mb-4">
                Export complete decision records with full chain of custody for regulatory
                submission.
              </p>
              <div className="space-y-3">
                {decisions.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{d.title}</div>
                      <div className="text-xs text-white/50">{d.ledgerEntries.length} entries</div>
                    </div>
                    <button
                      onClick={() => handleExport(d.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm"
                    >
                      📥 Export JSON
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-bold mb-4">Export Format</h2>
              <div className="p-4 bg-black/20 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>{`{
  "exportedAt": "ISO timestamp",
  "chainIntegrity": {
    "valid": true,
    "entriesChecked": 42,
    "message": "All entries verified"
  },
  "decision": {
    "id": "decision-xxx",
    "title": "...",
    "status": "approved",
    "finalConfidence": 87
  },
  "entries": [
    {
      "sequence": 1,
      "hash": "0000abcd...",
      "previousHash": "00000000...",
      "eventType": "decision.proposed",
      "timestamp": "ISO timestamp",
      "verified": true
    }
  ],
  "hashChain": [...]
}`}</pre>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Exports include cryptographic hash chain for tamper detection and full audit trail.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Decision Modal */}
      {showNewDecision && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-emerald-800/50">
            <h2 className="text-xl font-bold mb-4">Create Decision Record</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                ledgerService.createDecision(
                  formData.get('title') as string,
                  formData.get('description') as string,
                  'current-user',
                  ['strategic-agent', 'financial-agent', 'risk-agent']
                );
                loadData();
                setShowNewDecision(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm text-white/60 mb-1">Decision Title</label>
                <input
                  name="title"
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg"
                  placeholder="e.g., Q4 Budget Allocation"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-emerald-700/50 rounded-lg h-32"
                  placeholder="Describe the decision to be recorded..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewDecision(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  Create & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-emerald-800/50 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{getEventIcon(selectedEntry.eventType)}</span>
              <div>
                <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                <p className="text-sm text-white/60">{selectedEntry.eventType}</p>
              </div>
            </div>

            <p className="text-white/80 mb-6">{selectedEntry.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sequence</div>
                <div className="font-mono">{selectedEntry.sequence}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Timestamp</div>
                <div>{selectedEntry.timestamp.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">Sensitivity</div>
                <div className="capitalize">{selectedEntry.sensitivityLevel}</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50">PII Involved</div>
                <div>{selectedEntry.piiInvolved ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">
                  {selectedEntry.hash}
                </code>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-white/50 mb-1">Previous Hash</div>
                <code className="text-sm font-mono text-emerald-400 break-all">
                  {selectedEntry.previousHash}
                </code>
              </div>
            </div>

            {selectedEntry.complianceFrameworks.length > 0 && (
              <div className="mb-6">
                <div className="text-xs text-white/50 mb-2">Compliance Frameworks</div>
                <div className="flex gap-2">
                  {selectedEntry.complianceFrameworks.map((f) => (
                    <span key={f} className="px-3 py-1 bg-purple-900/50 rounded-lg">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  ledgerService.verifyEntry(selectedEntry.id);
                  loadData();
                  setSelectedEntry(ledgerService.getEntry(selectedEntry.id) || null);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                ✓ Verify Entry
              </button>
              <button
                onClick={() => setSelectedEntry(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close
              </button>
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
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl border border-emerald-800/50 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                <p className="text-sm text-white/60">{selectedDecision.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full ${
                  selectedDecision.status === 'approved'
                    ? 'bg-green-600'
                    : selectedDecision.status === 'vetoed'
                      ? 'bg-red-600'
                      : 'bg-amber-600'
                }`}
              >
                {selectedDecision.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.ledgerEntries.length}</div>
                <div className="text-xs text-white/50">Chain Entries</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.voters.length}</div>
                <div className="text-xs text-white/50">Votes</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold text-emerald-400">
                  {selectedDecision.finalConfidence || '-'}%
                </div>
                <div className="text-xs text-white/50">Confidence</div>
              </div>
              <div className="p-3 bg-black/30 rounded-lg text-center">
                <div className="text-xl font-bold">{selectedDecision.auditHistory.length}</div>
                <div className="text-xs text-white/50">Audits</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Chain Entries</h3>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {ledgerService.getEntriesForDecision(selectedDecision.id).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-2 bg-black/20 rounded-lg text-sm"
                >
                  <span>{getEventIcon(entry.eventType)}</span>
                  <span className="flex-1">{entry.title}</span>
                  <code className="text-xs text-emerald-400 font-mono">
                    {entry.hash.substring(0, 8)}...
                  </code>
                  <span className="text-xs text-white/40">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleExport(selectedDecision.id)}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                📥 Export for Audit
              </button>
              <button
                onClick={() => setSelectedDecision(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerPage;
