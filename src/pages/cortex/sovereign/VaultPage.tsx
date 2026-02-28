// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { 
  Archive, FileText, Shield, Clock, Search, Filter,
  Download, Eye, Lock, Unlock, CheckCircle, XCircle,
  AlertTriangle, Database, FileCheck, Folder, Tag,
  Calendar, User, Hash, ExternalLink, RefreshCw
} from 'lucide-react';

// =============================================================================
// CENDIAVAULT™ - Unified Evidence Storage
// The secure vault for all decision artifacts, audit trails, and evidence bundles
// Consolidates: Decision Packets, Audit Ledger, Evidence Bundles, Signed Reports
// =============================================================================

interface VaultArtifact {
  id: string;
  type: 'decision-packet' | 'audit-entry' | 'evidence-bundle' | 'signed-report' | 'council-deliberation' | 'dissent-record' | 'approval-chain';
  title: string;
  description?: string;
  contentHash: string;
  contentSize: number;
  mimeType: string;
  createdAt: string;
  createdBy: string;
  sourceService: string;
  signature?: string;
  signedAt?: string;
  retentionPolicy: string;
  retentionUntil?: string;
  legalHold: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
}

interface VaultStats {
  totalArtifacts: number;
  byType: Record<string, number>;
  totalSize: number;
  legalHoldCount: number;
  pendingDeletion: number;
}

const VaultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'search' | 'legal-hold' | 'stats'>('browse');
  const [artifacts, setArtifacts] = useState<VaultArtifact[]>([]);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<VaultArtifact | null>(null);

  useEffect(() => {
    loadVaultData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVaultData = async () => {
    setIsLoading(true);
    try {
      const [artifactsRes, statsRes] = await Promise.all([
        fetch('/api/v1/vault/search?limit=100').then(r => r.ok ? r.json() : { data: [] }),
        fetch('/api/v1/vault/stats').then(r => r.ok ? r.json() : { data: null }),
      ]);

      setArtifacts(artifactsRes.data || getMockArtifacts());
      setStats(statsRes.data || getMockStats());
    } catch (error) {
      console.error('[CendiaVault] Failed to load data:', error);
      setArtifacts(getMockArtifacts());
      setStats(getMockStats());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockArtifacts = (): VaultArtifact[] => [
    {
      id: 'pkt-2026-0103-001',
      type: 'decision-packet',
      title: 'Q1 Budget Allocation Decision',
      description: 'Council deliberation on Q1 2026 budget allocation across departments',
      contentHash: 'sha256:a1b2c3d4e5f6...',
      contentSize: 45678,
      mimeType: 'application/json',
      createdAt: '2026-01-03T14:30:00Z',
      createdBy: 'council-service',
      sourceService: 'CouncilDecisionPacketService',
      signature: 'RSA-PSS:abc123...',
      signedAt: '2026-01-03T14:31:00Z',
      retentionPolicy: 'extended',
      retentionUntil: '2036-01-03T14:30:00Z',
      legalHold: false,
      classification: 'confidential',
      tags: ['budget', 'q1-2026', 'council', 'approved'],
    },
    {
      id: 'aud-2026-0103-8934',
      type: 'audit-entry',
      title: 'Ledger Entry #8934',
      description: 'User login event - stuart@datacendia.com',
      contentHash: 'sha256:f6e5d4c3b2a1...',
      contentSize: 1234,
      mimeType: 'application/json',
      createdAt: '2026-01-03T21:45:00Z',
      createdBy: 'ledger-service',
      sourceService: 'ImmutableAuditLedger',
      retentionPolicy: 'permanent',
      legalHold: false,
      classification: 'internal',
      tags: ['audit', 'login', 'user-activity'],
    },
    {
      id: 'evd-2026-0102-001',
      type: 'evidence-bundle',
      title: 'Compliance Audit Evidence Pack',
      description: 'Evidence bundle for SOC 2 Type II audit preparation',
      contentHash: 'sha256:1a2b3c4d5e6f...',
      contentSize: 2345678,
      mimeType: 'application/zip',
      createdAt: '2026-01-02T10:00:00Z',
      createdBy: 'compliance-team',
      sourceService: 'EvidenceVaultService',
      signature: 'RSA-PSS:def456...',
      signedAt: '2026-01-02T10:05:00Z',
      retentionPolicy: 'extended',
      retentionUntil: '2036-01-02T10:00:00Z',
      legalHold: true,
      classification: 'confidential',
      tags: ['soc2', 'compliance', 'audit', 'evidence'],
    },
    {
      id: 'rpt-2026-0103-001',
      type: 'signed-report',
      title: 'Test Suite Report - Golden Build',
      description: '1,464 tests passed - 100% pass rate',
      contentHash: 'sha256:9f8e7d6c5b4a...',
      contentSize: 567890,
      mimeType: 'application/pdf',
      createdAt: '2026-01-03T22:00:00Z',
      createdBy: 'test-runner',
      sourceService: 'SignedTestReportService',
      signature: 'RSA-PSS:ghi789...',
      signedAt: '2026-01-03T22:01:00Z',
      retentionPolicy: 'standard',
      retentionUntil: '2033-01-03T22:00:00Z',
      legalHold: false,
      classification: 'internal',
      tags: ['test', 'report', 'golden-build', 'signed'],
    },
  ];

  const getMockStats = (): VaultStats => ({
    totalArtifacts: 12847,
    byType: {
      'decision-packet': 1247,
      'audit-entry': 8934,
      'evidence-bundle': 156,
      'signed-report': 2510,
    },
    totalSize: 4567890123,
    legalHoldCount: 23,
    pendingDeletion: 0,
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'decision-packet': return <FileCheck className="w-5 h-5 text-blue-400" />;
      case 'audit-entry': return <Database className="w-5 h-5 text-purple-400" />;
      case 'evidence-bundle': return <Folder className="w-5 h-5 text-green-400" />;
      case 'signed-report': return <FileText className="w-5 h-5 text-amber-400" />;
      default: return <Archive className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'decision-packet': return 'Decision Packet';
      case 'audit-entry': return 'Audit Entry';
      case 'evidence-bundle': return 'Evidence Bundle';
      case 'signed-report': return 'Signed Report';
      default: return type;
    }
  };

  const getClassificationBadge = (classification: string) => {
    const colors: Record<string, string> = {
      public: 'bg-green-500/20 text-green-400 border-green-500/30',
      internal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      confidential: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      restricted: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full border ${colors[classification] || colors.internal}`}>
        {classification.toUpperCase()}
      </span>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) {return `${bytes} B`;}
    if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`;}
    if (bytes < 1024 * 1024 * 1024) {return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;}
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const filteredArtifacts = artifacts.filter(a => {
    if (selectedType !== 'all' && a.type !== selectedType) {return false;}
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <Archive className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              CendiaVault™
            </h1>
            <p className="text-gray-400 text-sm">Unified Evidence Storage</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Secure storage for decision packets, audit ledger, evidence bundles, and signed reports. 
          Immutable, searchable, and retention-policy compliant.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <Archive className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalArtifacts.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Artifacts stored</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-500">Decisions</span>
            </div>
            <div className="text-2xl font-bold text-white">{(stats.byType['decision-packet'] || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Decision packets</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-500">Audit</span>
            </div>
            <div className="text-2xl font-bold text-white">{(stats.byType['audit-entry'] || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Audit entries</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <Lock className="w-5 h-5 text-red-400" />
              <span className="text-xs text-gray-500">Legal Hold</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.legalHoldCount}</div>
            <div className="text-xs text-gray-400">Protected artifacts</div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-gray-500">Storage</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatSize(stats.totalSize)}</div>
            <div className="text-xs text-gray-400">Total size</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700/50 pb-2">
        {[
          { id: 'browse', label: 'Browse', icon: Folder },
          { id: 'search', label: 'Search', icon: Search },
          { id: 'legal-hold', label: 'Legal Hold', icon: Lock },
          { id: 'stats', label: 'Analytics', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Types</option>
              <option value="decision-packet">Decision Packets</option>
              <option value="audit-entry">Audit Entries</option>
              <option value="evidence-bundle">Evidence Bundles</option>
              <option value="signed-report">Signed Reports</option>
            </select>
            <button
              onClick={loadVaultData}
              className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Artifacts List */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Artifact</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Created</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredArtifacts.map(artifact => (
                  <tr key={artifact.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(artifact.type)}
                        <div>
                          <div className="text-sm font-medium text-white">{artifact.title}</div>
                          <div className="text-xs text-gray-500 font-mono">{artifact.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{getTypeLabel(artifact.type)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{formatDate(artifact.createdAt)}</div>
                      <div className="text-xs text-gray-500">{artifact.createdBy}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{formatSize(artifact.contentSize)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getClassificationBadge(artifact.classification)}
                        {artifact.legalHold && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <Lock className="w-3 h-3" />
                            Hold
                          </span>
                        )}
                        {artifact.signature && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            Signed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedArtifact(artifact)}
                          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors" title="Verify">
                          <Shield className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legal Hold Tab */}
      {activeTab === 'legal-hold' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-sm font-medium text-amber-400">Legal Hold Management</h3>
                <p className="text-xs text-gray-400">
                  Artifacts on legal hold cannot be deleted or modified. Use with caution.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-medium text-white mb-4">Artifacts on Legal Hold</h3>
            <div className="space-y-3">
              {artifacts.filter(a => a.legalHold).map(artifact => (
                <div key={artifact.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{artifact.title}</div>
                      <div className="text-xs text-gray-500">{artifact.id}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors">
                    Release Hold
                  </button>
                </div>
              ))}
              {artifacts.filter(a => a.legalHold).length === 0 && (
                <p className="text-gray-500 text-center py-8">No artifacts on legal hold</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-medium text-white mb-4">Artifacts by Type</h3>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="text-sm text-gray-300">{getTypeLabel(type)}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-medium text-white mb-4">Retention Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-sm text-gray-300">Active Retention</span>
                <span className="text-sm font-medium text-green-400">{(stats.totalArtifacts - stats.pendingDeletion).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <span className="text-sm text-gray-300">Legal Hold</span>
                <span className="text-sm font-medium text-red-400">{stats.legalHoldCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <span className="text-sm text-gray-300">Pending Deletion</span>
                <span className="text-sm font-medium text-amber-400">{stats.pendingDeletion}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedArtifact(null)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedArtifact.type)}
                  <div>
                    <h2 className="text-lg font-medium text-white">{selectedArtifact.title}</h2>
                    <p className="text-xs text-gray-500 font-mono">{selectedArtifact.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedArtifact(null)} className="text-gray-400 hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Type</label>
                  <p className="text-sm text-white">{getTypeLabel(selectedArtifact.type)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Classification</label>
                  <p className="text-sm">{getClassificationBadge(selectedArtifact.classification)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Created</label>
                  <p className="text-sm text-white">{formatDate(selectedArtifact.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Created By</label>
                  <p className="text-sm text-white">{selectedArtifact.createdBy}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Size</label>
                  <p className="text-sm text-white">{formatSize(selectedArtifact.contentSize)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Content Hash</label>
                  <p className="text-sm text-white font-mono truncate">{selectedArtifact.contentHash}</p>
                </div>
              </div>
              {selectedArtifact.signature && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Cryptographically Signed</span>
                  </div>
                  <p className="text-xs text-gray-400">Signed by CendiaNotary™ at {formatDate(selectedArtifact.signedAt!)}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedArtifact.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                <Shield className="w-4 h-4" />
                Verify Integrity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-xs text-gray-600">
        <p>CendiaVault™ - Unified Evidence Storage</p>
        <p className="mt-1">Immutable. Searchable. Retention-compliant.</p>
      </div>
    </div>
  );
};

export default VaultPage;
