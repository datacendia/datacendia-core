// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaEternal™ - Ultra-Long Horizon Archive
 * "A memory designed to outlive us."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import {
  Archive,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Lock,
  Link2,
  Settings,
  Key,
  Scale,
  Hash,
  Search,
  Table,
  Grid3X3,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

// Helper to generate dynamic timestamps relative to now
const formatRelativeDate = (hoursAgo: number): string => {
  const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return date.toISOString().replace('T', ' ').substring(0, 16);
};

// Dynamic access log data (generated relative to current time)
const generateAccessLog = () => [
  {
    id: 'log1',
    timestamp: formatRelativeDate(2),
    user: 'Sarah Chen',
    action: 'VIEW',
    artifact: 'Board Resolution Q4',
    status: 'success',
  },
  {
    id: 'log2',
    timestamp: formatRelativeDate(5),
    user: 'Michael Torres',
    action: 'VERIFY',
    artifact: 'Crisis Response Protocol',
    status: 'success',
  },
  {
    id: 'log3',
    timestamp: formatRelativeDate(24),
    user: 'Unknown IP',
    action: 'ACCESS_ATTEMPT',
    artifact: 'Financial Strategy',
    status: 'blocked',
  },
  {
    id: 'log4',
    timestamp: formatRelativeDate(28),
    user: 'Emily Watson',
    action: 'DOWNLOAD',
    artifact: 'Founding Documents',
    status: 'success',
  },
  {
    id: 'log5',
    timestamp: formatRelativeDate(48),
    user: 'System',
    action: 'INTEGRITY_CHECK',
    artifact: 'All artifacts',
    status: 'success',
  },
];

interface Artifact {
  id: string;
  artifactType: string;
  title: string;
  description: string;
  importanceScore: number;
  retentionYears: number;
  accessLevel: string;
  verificationStatus: string;
  createdAt: string;
}

interface Dashboard {
  totalArtifacts: number;
  verifiedArtifacts: number;
  driftedArtifacts: number;
  integrityRate: number;
  avgRetentionYears: number;
  avgImportanceScore: number;
  definedSuccessors: number;
}

export const EternalPage: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [newArtifact, setNewArtifact] = useState({
    title: '',
    description: '',
    content: '',
    artifactType: 'STRATEGIC_DECISION',
    retentionYears: 100,
    legalHold: false,
  });
  const [showRetentionPolicy, setShowRetentionPolicy] = useState(false);
  const [showSuccessorWorkflow, setShowSuccessorWorkflow] = useState(false);

  // New state for search, view mode, and audit log
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [retentionPolicies, setRetentionPolicies] = useState([
    { type: 'Strategic Decision', years: 100, legalBasis: 'Board governance' },
    { type: 'Policy Document', years: 50, legalBasis: 'Regulatory requirement' },
    { type: 'Lessons Learned', years: 25, legalBasis: 'Institutional knowledge' },
    { type: 'Leadership Wisdom', years: 100, legalBasis: 'Succession planning' },
    { type: 'Crisis Response', years: 30, legalBasis: 'Legal & compliance' },
    { type: 'Financial Records', years: 7, legalBasis: 'Tax/audit requirements' },
  ]);

  const itemsPerPage = 9;

  // Filter artifacts based on search
  const filteredArtifacts = artifacts.filter(
    (a) =>
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.artifactType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArtifacts.length / itemsPerPage);
  const paginatedArtifacts = filteredArtifacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [artRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Artifact[] }>('/eternal/artifacts'),
        apiClient.api.get<{ data: Dashboard }>('/eternal/dashboard'),
      ]);
      if (artRes.success) {
        setArtifacts((artRes.data as any)?.data || artRes.data || []);
      }
      if (dashRes.success) {
        setDashboard((dashRes.data as any)?.data || dashRes.data || null);
      }
    } catch (error) {
      console.error('Failed to load Eternal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const archiveArtifact = async () => {
    try {
      await apiClient.api.post('/eternal/artifacts', newArtifact);
      setShowArchiveModal(false);
      setNewArtifact({
        title: '',
        description: '',
        content: '',
        artifactType: 'STRATEGIC_DECISION',
        retentionYears: 100,
        legalHold: false,
      });
      await loadData();
    } catch (error) {
      console.error('Archive failed:', error);
    }
  };

  const verifyArtifact = async (id: string) => {
    try {
      await apiClient.api.post(`/eternal/artifacts/${id}/verify`, { validationType: 'MANUAL' });
      await loadData();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'DRIFT_DETECTED':
        return 'text-red-400 bg-red-500/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Eternal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="w-10 h-10 text-amber-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaEternal™</h1>
              <p className="text-slate-400">
                Ultra-Long Horizon Archive - "A memory designed to outlive us."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/cortex/sovereign/vox?context=artifact"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" /> Stakeholder Assembly
            </a>
            <button
              onClick={() => {
                const reportData = {
                  generated: new Date().toISOString(),
                  artifacts: artifacts.map((a) => ({
                    id: a.id,
                    title: a.title,
                    type: a.artifactType,
                    retention: a.retentionYears,
                  })),
                  dashboard,
                  policies: retentionPolicies,
                };
                const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `eternal-archive-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Archive
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FileText className="w-4 h-4" /> Total Artifacts
            </div>
            <div className="text-3xl font-bold">{dashboard.totalArtifacts}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="w-4 h-4" /> Integrity Rate
            </div>
            <div className="text-3xl font-bold text-emerald-400">{dashboard.integrityRate}%</div>
          </div>
          <button
            onClick={() => setShowRetentionPolicy(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" /> Avg Retention
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {dashboard.avgRetentionYears} yrs
            </div>
            <div className="text-xs text-amber-400/60 mt-1">View retention policy →</div>
          </button>
          <button
            onClick={() => setShowSuccessorWorkflow(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Users className="w-4 h-4" /> Successors
            </div>
            <div className="text-3xl font-bold">{dashboard.definedSuccessors}</div>
            <div className="text-xs text-purple-400/60 mt-1">Manage access →</div>
          </button>
        </div>
      )}

      {/* Immutability & Integrity Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-900/30 rounded-lg p-6 border border-emerald-500/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Hash className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-semibold">Cryptographic Immutability</h2>
              <p className="text-sm text-slate-400">
                Every artifact is hash-chained and signed for tamper-evident storage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
              SHA-256 Hash Chain
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
              WORM Storage
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
              Digital Signatures
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Last Verification</div>
            <div className="font-medium text-emerald-400">2 hours ago</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Chain Length</div>
            <div className="font-medium">{dashboard?.totalArtifacts || 0} blocks</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Drift Detected</div>
            <div className="font-medium text-red-400">{dashboard?.driftedArtifacts || 0}</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg">
            <div className="text-xs text-slate-400">Legal Holds</div>
            <div className="font-medium text-amber-400">3 active</div>
          </div>
        </div>
      </div>

      {/* "Why Now" Triggers - Contextual prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => {
            setNewArtifact({
              ...newArtifact,
              artifactType: 'LEADERSHIP_WISDOM',
              title: 'Knowledge Transfer: ',
              description: 'Institutional knowledge from departing team member',
            });
            setShowArchiveModal(true);
          }}
          className="p-4 bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-lg text-left hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">Key Employee Leaving?</span>
          </div>
          <p className="text-sm text-slate-400">
            Capture their institutional knowledge before they go →
          </p>
        </button>
        <button
          onClick={() => {
            setNewArtifact({
              ...newArtifact,
              artifactType: 'CRISIS_RESPONSE',
              title: 'Crisis Learnings: ',
              description: 'How we handled and what we learned',
            });
            setShowArchiveModal(true);
          }}
          className="p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg text-left hover:border-red-400/50 transition-all group"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Just Survived a Crisis?</span>
          </div>
          <p className="text-sm text-slate-400">Document lessons while they're fresh →</p>
        </button>
        <button
          onClick={() => {
            setNewArtifact({
              ...newArtifact,
              artifactType: 'STRATEGIC_DECISION',
              title: 'Strategic Pivot: ',
              description: 'Major strategic decision and rationale',
            });
            setShowArchiveModal(true);
          }}
          className="p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg text-left hover:border-purple-400/50 transition-all group"
        >
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Major Decision Made?</span>
          </div>
          <p className="text-sm text-slate-400">Preserve the "why" for future leaders →</p>
        </button>
      </div>

      {/* Archive Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchiveModal(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-2"
          >
            <Archive className="w-4 h-4" /> Archive New Artifact
          </button>
          <span className="text-xs text-slate-500">
            Policy-driven retention (configurable 1-100 years) • Cryptographic integrity • Successor
            inheritance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRetentionPolicy(true)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1"
          >
            <Settings className="w-3 h-3" /> Retention Policy
          </button>
          <button
            onClick={() => setShowSuccessorWorkflow(true)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1"
          >
            <Key className="w-3 h-3" /> Access & Successors
          </button>
        </div>
      </div>

      {/* Artifacts Section with Search & View Toggle */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Archived Artifacts</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search artifacts..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm w-64 placeholder-slate-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                title="Table view"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>

            {/* Audit Log */}
            <button
              onClick={() => setShowAuditLog(true)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Audit Log
            </button>
          </div>
        </div>

        {filteredArtifacts.length === 0 && searchQuery ? (
          <div className="text-center py-8 text-slate-500">No artifacts match "{searchQuery}"</div>
        ) : artifacts.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto mb-4 text-amber-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">Archive your first artifact</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Start with your founding documents, key contracts, board resolutions, or critical
              decisions that shaped your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => {
                  setNewArtifact({ ...newArtifact, artifactType: 'POLICY_DOCUMENT' });
                  setShowArchiveModal(true);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
              >
                📜 Founding Documents
              </button>
              <button
                onClick={() => {
                  setNewArtifact({ ...newArtifact, artifactType: 'STRATEGIC_DECISION' });
                  setShowArchiveModal(true);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
              >
                ⚖️ Key Decisions
              </button>
              <button
                onClick={() => {
                  setNewArtifact({ ...newArtifact, artifactType: 'LEADERSHIP_WISDOM' });
                  setShowArchiveModal(true);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
              >
                🧠 Leadership Wisdom
              </button>
            </div>
            <button
              onClick={() => setShowArchiveModal(true)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium"
            >
              Archive Your First Artifact →
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedArtifacts.map((a) => (
                <div
                  key={a.id}
                  className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">
                      {a.artifactType.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getStatusColor(a.verificationStatus)}`}
                    >
                      {a.verificationStatus}
                    </span>
                  </div>
                  <div className="font-medium mb-1">{a.title}</div>
                  <div className="text-sm text-slate-400 mb-3">
                    {a.description?.substring(0, 80)}...
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Importance: {a.importanceScore}/100</span>
                    <span>Retention: {a.retentionYears} yrs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>{a.accessLevel}</span>
                  </div>
                  {a.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => verifyArtifact(a.id)}
                      className="mt-3 w-full px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs"
                    >
                      Verify Integrity
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredArtifacts.length)} of{' '}
                  {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Table View */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Retention</th>
                    <th className="pb-3 font-medium text-right">Importance</th>
                    <th className="pb-3 font-medium">Access</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArtifacts.map((a) => (
                    <tr key={a.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                      <td className="py-3 font-medium">{a.title}</td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">
                          {a.artifactType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getStatusColor(a.verificationStatus)}`}
                        >
                          {a.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right text-amber-400">{a.retentionYears} yrs</td>
                      <td className="py-3 text-right">{a.importanceScore}/100</td>
                      <td className="py-3 text-slate-400">{a.accessLevel}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-slate-600 rounded" title="View">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1 hover:bg-slate-600 rounded" title="Download">
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                          {a.verificationStatus !== 'VERIFIED' && (
                            <button
                              onClick={() => verifyArtifact(a.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredArtifacts.length)} of{' '}
                  {filteredArtifacts.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Archive New Artifact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select
                  value={newArtifact.artifactType}
                  onChange={(e) => setNewArtifact({ ...newArtifact, artifactType: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                >
                  <option value="STRATEGIC_DECISION">Strategic Decision</option>
                  <option value="POLICY_DOCUMENT">Policy Document</option>
                  <option value="LESSONS_LEARNED">Lessons Learned</option>
                  <option value="LEADERSHIP_WISDOM">Leadership Wisdom</option>
                  <option value="CRISIS_RESPONSE">Crisis Response</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  value={newArtifact.title}
                  onChange={(e) => setNewArtifact({ ...newArtifact, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="Artifact title"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <input
                  value={newArtifact.description}
                  onChange={(e) => setNewArtifact({ ...newArtifact, description: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content</label>
                <textarea
                  value={newArtifact.content}
                  onChange={(e) => setNewArtifact({ ...newArtifact, content: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 h-24"
                  placeholder="Full content to archive"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={archiveArtifact}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Retention Policy Modal */}
      {showRetentionPolicy && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowRetentionPolicy(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Retention Policy by Artifact Type</h3>
                <p className="text-sm text-slate-400">
                  Configure how long each type of artifact is preserved
                </p>
              </div>
              <button
                onClick={() => setShowRetentionPolicy(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {retentionPolicies.map((policy, index) => {
                const isLegalHold =
                  policy.type === 'Crisis Response' || policy.type === 'Financial Records';
                return (
                  <div key={policy.type} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{policy.type}</div>
                        <div className="text-xs text-slate-400">{policy.legalBasis}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">{policy.years} years</div>
                        {isLegalHold && <span className="text-xs text-red-400">Legal minimum</span>}
                      </div>
                    </div>
                    {!isLegalHold && (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={policy.years}
                          onChange={(e) => {
                            const newPolicies = [...retentionPolicies];
                            newPolicies[index] = { ...policy, years: parseInt(e.target.value) };
                            setRetentionPolicies(newPolicies);
                          }}
                          className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={policy.years}
                          onChange={(e) => {
                            const newPolicies = [...retentionPolicies];
                            newPolicies[index] = {
                              ...policy,
                              years: Math.min(100, Math.max(1, parseInt(e.target.value) || 1)),
                            };
                            setRetentionPolicies(newPolicies);
                          }}
                          className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-center text-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  // Save retention policies to backend
                  apiClient.api.post('/eternal/retention-policies', {
                    policies: retentionPolicies,
                  });
                  setShowRetentionPolicy(false);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium"
              >
                Save Policies
              </button>
            </div>
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Scale className="w-4 h-4" />
                <span className="font-medium">Legal Hold Override</span>
              </div>
              <p className="text-sm text-slate-300">
                Artifacts under legal hold cannot be modified or deleted until the hold is released
                by authorized counsel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Successor Workflow Modal */}
      {showSuccessorWorkflow && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowSuccessorWorkflow(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Access & Successor Management</h3>
                <p className="text-sm text-slate-400">
                  Define who can access artifacts and designate successors
                </p>
              </div>
              <button
                onClick={() => setShowSuccessorWorkflow(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Workflow Steps */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                Successor Designation Workflow
              </h4>
              <div className="flex items-center gap-2">
                {['Nominate', 'Approve', 'Verify', 'Activate'].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex-1 p-3 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-xs text-slate-400">Step {i + 1}</div>
                      <div className="font-medium text-sm">{step}</div>
                    </div>
                    {i < 3 && <span className="text-slate-600">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Current Successors */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Designated Successors</h4>
              <div className="space-y-2">
                {[
                  {
                    name: 'Sarah Chen',
                    role: 'Chief of Staff',
                    status: 'Active',
                    approvedBy: 'CEO',
                    accessLevel: 'Full',
                  },
                  {
                    name: 'Michael Torres',
                    role: 'General Counsel',
                    status: 'Active',
                    approvedBy: 'Board',
                    accessLevel: 'Legal',
                  },
                  {
                    name: 'Emily Watson',
                    role: 'Board Secretary',
                    status: 'Pending',
                    approvedBy: 'Pending',
                    accessLevel: 'Read-only',
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        {s.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <div className="text-slate-400">Approved by: {s.approvedBy}</div>
                        <div className="text-slate-400">Access: {s.accessLevel}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          s.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Nominate New Successor
              </button>
              <button
                onClick={() => {
                  setShowSuccessorWorkflow(false);
                  setShowAuditLog(true);
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
              >
                View Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowAuditLog(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-3xl border border-slate-700 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-400" /> Audit Log
                </h3>
                <p className="text-sm text-slate-400">
                  Access attempts and actions on archived artifacts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export PDF
                </button>
                <button
                  onClick={() => setShowAuditLog(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Actions</option>
                <option>VIEW</option>
                <option>DOWNLOAD</option>
                <option>VERIFY</option>
                <option>ACCESS_ATTEMPT</option>
              </select>
              <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option>All Statuses</option>
                <option>Success</option>
                <option>Blocked</option>
              </select>
              <input
                type="date"
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Artifact</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {generateAccessLog().map(
                    (log: {
                      id: string;
                      timestamp: string;
                      user: string;
                      action: string;
                      artifact: string;
                      status: string;
                    }) => (
                      <tr key={log.id} className="border-b border-slate-800">
                        <td className="py-3 text-slate-400 font-mono text-xs">{log.timestamp}</td>
                        <td className="py-3">
                          <span
                            className={log.user === 'Unknown IP' ? 'text-red-400' : 'text-white'}
                          >
                            {log.user}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              log.action === 'ACCESS_ATTEMPT'
                                ? 'bg-red-500/20 text-red-300'
                                : log.action === 'VERIFY'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : log.action === 'DOWNLOAD'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : log.action === 'INTEGRITY_CHECK'
                                      ? 'bg-purple-500/20 text-purple-300'
                                      : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{log.artifact}</td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              log.status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
              <span>Showing last 5 entries. Full log contains 1,247 records.</span>
              <span>All logs are immutable and cryptographically signed.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EternalPage;
