// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA EVIDENCE VAULT™ — GLOBAL DECISION PACKET ACCESS
// Universal evidence store with "read anywhere, generate/lock only in context"
// Enterprise-grade RBAC: Executives pull in 10s, Audit has one canonical store
// =============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  Lock,
  Shield,
  FileText,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronDown,
  Fingerprint,
  FileCheck,
  Archive,
  RefreshCw,
  Send,
  Paperclip,
  AlertOctagon,
  X,
  Upload,
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { useDataSource } from '../../../contexts/DataSourceContext';
import { DataSourceSelector } from '../../../components/cortex/DataSourceSelector';
import { evidenceVaultApi, DecisionPacket as APIPacket, ApprovalWorkflow, Attachment } from '../../../services/EvidenceVaultService';

// =============================================================================
// TYPES
// =============================================================================

type PacketStatus = 'draft' | 'under_review' | 'approved' | 'locked' | 'superseded';
type DecisionMode = 'due_diligence' | 'war_room' | 'compliance' | 'strategic' | 'operational';
type UserRole = 'viewer' | 'decision_owner' | 'council_operator' | 'approver' | 'risk_compliance' | 'auditor' | 'admin';

interface DecisionPacket {
  id: string;
  decisionId: string;
  decisionTitle: string;
  status: PacketStatus;
  mode: DecisionMode;
  owner: {
    name: string;
    role: string;
    department: string;
  };
  businessUnit: string;
  generatedAt: Date;
  signedAt?: Date;
  lockedAt?: Date;
  policyPackVersion: string;
  signatureValid: boolean;
  integrityHash: string;
  version: number;
  supersededBy?: string;
  attachments: number;
  dissents: number;
  vetoes: number;
  overrides: number;
  systemsImpacted: string[];
  complianceFrameworks: string[];
  retentionUntil: Date;
  accessCount: number;
  lastAccessedAt?: Date;
  lastAccessedBy?: string;
}

interface FilterState {
  search: string;
  status: PacketStatus | 'all';
  mode: DecisionMode | 'all';
  businessUnit: string;
  dateFrom?: Date;
  dateTo?: Date;
  owner: string;
  framework: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PACKETS: DecisionPacket[] = [
  {
    id: 'PKT-2024-001',
    decisionId: 'DEC-2024-0847',
    decisionTitle: 'Q1 2025 Market Expansion Strategy',
    status: 'locked',
    mode: 'strategic',
    owner: { name: 'Sarah Chen', role: 'Chief Strategy Officer', department: 'Executive' },
    businessUnit: 'Corporate Strategy',
    generatedAt: new Date('2024-12-15T10:30:00'),
    signedAt: new Date('2024-12-15T14:22:00'),
    lockedAt: new Date('2024-12-16T09:00:00'),
    policyPackVersion: 'v2024.12.1',
    signatureValid: true,
    integrityHash: 'sha256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    version: 3,
    attachments: 12,
    dissents: 1,
    vetoes: 0,
    overrides: 0,
    systemsImpacted: ['CRM', 'ERP', 'Marketing Automation'],
    complianceFrameworks: ['SOX', 'GDPR'],
    retentionUntil: new Date('2031-12-16'),
    accessCount: 47,
    lastAccessedAt: new Date('2024-12-19T08:15:00'),
    lastAccessedBy: 'Michael Torres',
  },
  {
    id: 'PKT-2024-002',
    decisionId: 'DEC-2024-0891',
    decisionTitle: 'Emergency Infrastructure Scaling Response',
    status: 'locked',
    mode: 'war_room',
    owner: { name: 'James Wilson', role: 'VP Engineering', department: 'Technology' },
    businessUnit: 'Engineering',
    generatedAt: new Date('2024-12-18T02:15:00'),
    signedAt: new Date('2024-12-18T02:45:00'),
    lockedAt: new Date('2024-12-18T03:00:00'),
    policyPackVersion: 'v2024.12.1',
    signatureValid: true,
    integrityHash: 'sha256-a3b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    version: 1,
    attachments: 8,
    dissents: 0,
    vetoes: 0,
    overrides: 1,
    systemsImpacted: ['Cloud Infrastructure', 'Database Cluster', 'CDN'],
    complianceFrameworks: ['SOC2', 'ISO27001'],
    retentionUntil: new Date('2031-12-18'),
    accessCount: 23,
    lastAccessedAt: new Date('2024-12-19T11:30:00'),
    lastAccessedBy: 'Sarah Chen',
  },
  {
    id: 'PKT-2024-003',
    decisionId: 'DEC-2024-0912',
    decisionTitle: 'Vendor Due Diligence: Acme Analytics Partnership',
    status: 'approved',
    mode: 'due_diligence',
    owner: { name: 'Emily Rodriguez', role: 'Head of Procurement', department: 'Operations' },
    businessUnit: 'Procurement',
    generatedAt: new Date('2024-12-17T14:00:00'),
    signedAt: new Date('2024-12-18T16:30:00'),
    policyPackVersion: 'v2024.12.1',
    signatureValid: true,
    integrityHash: 'sha256-b4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    version: 2,
    attachments: 15,
    dissents: 0,
    vetoes: 0,
    overrides: 0,
    systemsImpacted: ['Data Warehouse', 'BI Platform'],
    complianceFrameworks: ['GDPR', 'CCPA', 'SOC2'],
    retentionUntil: new Date('2031-12-17'),
    accessCount: 12,
    lastAccessedAt: new Date('2024-12-19T09:45:00'),
    lastAccessedBy: 'Legal Team',
  },
  {
    id: 'PKT-2024-004',
    decisionId: 'DEC-2024-0923',
    decisionTitle: 'GDPR Data Processing Agreement Update',
    status: 'under_review',
    mode: 'compliance',
    owner: { name: 'Dr. Anna Schmidt', role: 'Chief Privacy Officer', department: 'Legal' },
    businessUnit: 'Legal & Compliance',
    generatedAt: new Date('2024-12-19T10:00:00'),
    policyPackVersion: 'v2024.12.1',
    signatureValid: false,
    integrityHash: 'sha256-c5d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    version: 1,
    attachments: 6,
    dissents: 2,
    vetoes: 0,
    overrides: 0,
    systemsImpacted: ['Customer Database', 'Marketing Platform', 'Support System'],
    complianceFrameworks: ['GDPR', 'ePrivacy'],
    retentionUntil: new Date('2031-12-19'),
    accessCount: 8,
    lastAccessedAt: new Date('2024-12-19T14:20:00'),
    lastAccessedBy: 'Compliance Team',
  },
  {
    id: 'PKT-2024-005',
    decisionId: 'DEC-2024-0934',
    decisionTitle: 'FY2025 Budget Allocation Model',
    status: 'draft',
    mode: 'operational',
    owner: { name: 'Robert Kim', role: 'CFO', department: 'Finance' },
    businessUnit: 'Finance',
    generatedAt: new Date('2024-12-19T11:30:00'),
    policyPackVersion: 'v2024.12.1',
    signatureValid: false,
    integrityHash: 'sha256-d6e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    version: 1,
    attachments: 4,
    dissents: 0,
    vetoes: 0,
    overrides: 0,
    systemsImpacted: ['ERP', 'Financial Planning'],
    complianceFrameworks: ['SOX', 'GAAP'],
    retentionUntil: new Date('2031-12-19'),
    accessCount: 3,
    lastAccessedAt: new Date('2024-12-19T12:00:00'),
    lastAccessedBy: 'Robert Kim',
  },
  {
    id: 'PKT-2024-006',
    decisionId: 'DEC-2024-0845',
    decisionTitle: 'AI Model Deployment: Customer Churn Predictor v2',
    status: 'superseded',
    mode: 'operational',
    owner: { name: 'Dr. Lisa Park', role: 'Head of Data Science', department: 'Analytics' },
    businessUnit: 'Data Science',
    generatedAt: new Date('2024-12-10T09:00:00'),
    signedAt: new Date('2024-12-10T15:00:00'),
    lockedAt: new Date('2024-12-11T09:00:00'),
    policyPackVersion: 'v2024.11.2',
    signatureValid: true,
    integrityHash: 'sha256-e7f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    version: 1,
    supersededBy: 'PKT-2024-007',
    attachments: 9,
    dissents: 0,
    vetoes: 0,
    overrides: 0,
    systemsImpacted: ['ML Platform', 'Customer Analytics'],
    complianceFrameworks: ['EU AI Act', 'SOC2'],
    retentionUntil: new Date('2031-12-10'),
    accessCount: 31,
    lastAccessedAt: new Date('2024-12-15T10:00:00'),
    lastAccessedBy: 'Audit Team',
  },
];

const BUSINESS_UNITS = [
  'All Units',
  'Corporate Strategy',
  'Engineering',
  'Procurement',
  'Legal & Compliance',
  'Finance',
  'Data Science',
  'Operations',
  'Human Resources',
];

const COMPLIANCE_FRAMEWORKS = [
  'All Frameworks',
  'SOX',
  'SOC2',
  'GDPR',
  'CCPA',
  'HIPAA',
  'ISO27001',
  'EU AI Act',
  'GAAP',
  'ePrivacy',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getStatusConfig = (status: PacketStatus) => {
  switch (status) {
    case 'draft':
      return { label: 'Draft', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: FileText };
    case 'under_review':
      return { label: 'Under Review', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock };
    case 'approved':
      return { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
    case 'locked':
      return { label: 'Locked', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Lock };
    case 'superseded':
      return { label: 'Superseded', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Archive };
  }
};

const getModeConfig = (mode: DecisionMode) => {
  switch (mode) {
    case 'due_diligence':
      return { label: 'Due Diligence', color: 'text-blue-400', icon: '🔍' };
    case 'war_room':
      return { label: 'War Room', color: 'text-red-400', icon: '🚨' };
    case 'compliance':
      return { label: 'Compliance', color: 'text-purple-400', icon: '⚖️' };
    case 'strategic':
      return { label: 'Strategic', color: 'text-amber-400', icon: '🎯' };
    case 'operational':
      return { label: 'Operational', color: 'text-emerald-400', icon: '⚙️' };
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const EvidenceVaultPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDataSource } = useDataSource();
  
  // Data state
  const [packets, setPackets] = useState<DecisionPacket[]>(MOCK_PACKETS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<DecisionPacket | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField] = useState<'generatedAt' | 'status' | 'accessCount'>('generatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [showSendToApprovers, setShowSendToApprovers] = useState(false);
  const [showAttachEvidence, setShowAttachEvidence] = useState(false);
  const [showBreakGlass, setShowBreakGlass] = useState(false);
  const [actionPacketId, setActionPacketId] = useState<string | null>(null);
  
  // Form states
  const [approverEmail, setApproverEmail] = useState('');
  const [approverMessage, setApproverMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentCategory, setAttachmentCategory] = useState<'evidence' | 'supporting' | 'reference' | 'legal'>('evidence');
  const [breakGlassJustification, setBreakGlassJustification] = useState('');
  const [breakGlassUrgency, setBreakGlassUrgency] = useState<'high' | 'critical' | 'emergency'>('high');
  
  // Simulated current user role - in production, this comes from auth context
  const [currentUserRole] = useState<UserRole>('approver');
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    mode: 'all',
    businessUnit: 'All Units',
    owner: '',
    framework: 'All Frameworks',
  });

  // Fetch packets when data source changes
  const fetchPackets = useCallback(async () => {
    setIsLoading(true);
    try {
      // In production, this would call the API with the selected data source
      // const result = await evidenceVaultApi.getPackets({ dataSourceId: selectedDataSource?.id });
      // setPackets(result.packets);
      
      // For now, use mock data filtered by data source
      setPackets(MOCK_PACKETS);
    } catch (error) {
      console.error('Failed to fetch packets:', error);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPackets();
  }, [fetchPackets]);

  // Action handlers
  const handleSendToApprovers = async () => {
    if (!actionPacketId || !approverEmail) {return;}
    try {
      // await evidenceVaultApi.sendToApprovers(actionPacketId, [{ userId: 'usr-new', email: approverEmail, name: approverEmail.split('@')[0], role: 'Approver' }], approverMessage);
      setShowSendToApprovers(false);
      setApproverEmail('');
      setApproverMessage('');
      fetchPackets();
    } catch (error) {
      console.error('Failed to send to approvers:', error);
    }
  };

  const handleAttachEvidence = async () => {
    if (!actionPacketId || !attachmentFile) {return;}
    try {
      // await evidenceVaultApi.attachEvidence(actionPacketId, attachmentFile, '', attachmentCategory);
      setShowAttachEvidence(false);
      setAttachmentFile(null);
      fetchPackets();
    } catch (error) {
      console.error('Failed to attach evidence:', error);
    }
  };

  const handleBreakGlassRequest = async () => {
    if (!actionPacketId || !breakGlassJustification) {return;}
    try {
      // await evidenceVaultApi.requestBreakGlassExport(actionPacketId, breakGlassJustification, breakGlassUrgency);
      setShowBreakGlass(false);
      setBreakGlassJustification('');
      fetchPackets();
    } catch (error) {
      console.error('Failed to request break-glass export:', error);
    }
  };

  const handleLockPacket = async (packetId: string) => {
    try {
      // await evidenceVaultApi.lockPacket(packetId);
      fetchPackets();
    } catch (error) {
      console.error('Failed to lock packet:', error);
    }
  };

  const handleExportPacket = async (packetId: string) => {
    try {
      // const blob = await evidenceVaultApi.exportPacket(packetId);
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `decision-packet-${packetId}.zip`;
      // a.click();
      console.log('Export packet:', packetId);
    } catch (error) {
      console.error('Failed to export packet:', error);
    }
  };

  // Filter and sort packets
  const filteredPackets = useMemo(() => {
    let result = [...packets];

    // Apply search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.decisionId.toLowerCase().includes(searchLower) ||
          p.decisionTitle.toLowerCase().includes(searchLower) ||
          p.owner.name.toLowerCase().includes(searchLower) ||
          p.systemsImpacted.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }

    // Apply mode filter
    if (filters.mode !== 'all') {
      result = result.filter((p) => p.mode === filters.mode);
    }

    // Apply business unit filter
    if (filters.businessUnit !== 'All Units') {
      result = result.filter((p) => p.businessUnit === filters.businessUnit);
    }

    // Apply framework filter
    if (filters.framework !== 'All Frameworks') {
      result = result.filter((p) => p.complianceFrameworks.includes(filters.framework));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'generatedAt') {
        comparison = a.generatedAt.getTime() - b.generatedAt.getTime();
      } else if (sortField === 'status') {
        const statusOrder = { draft: 0, under_review: 1, approved: 2, locked: 3, superseded: 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortField === 'accessCount') {
        comparison = a.accessCount - b.accessCount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [packets, filters, sortField, sortDirection]);

  // RBAC: Check if user can perform action
  const canViewPacket = (_packet: DecisionPacket) => true; // Everyone can view
  const canExportPacket = (packet: DecisionPacket) => {
    if (currentUserRole === 'auditor') {return packet.status === 'locked';}
    return ['decision_owner', 'council_operator', 'approver', 'risk_compliance', 'admin'].includes(currentUserRole);
  };
  const canGeneratePacket = (_packet: DecisionPacket) => {
    return ['decision_owner', 'council_operator'].includes(currentUserRole);
  };
  const canLockPacket = (packet: DecisionPacket) => {
    return ['approver', 'risk_compliance', 'admin'].includes(currentUserRole) && packet.status === 'approved';
  };

  // Stats
  const stats = useMemo(() => ({
    total: packets.length,
    draft: packets.filter((p) => p.status === 'draft').length,
    underReview: packets.filter((p) => p.status === 'under_review').length,
    approved: packets.filter((p) => p.status === 'approved').length,
    locked: packets.filter((p) => p.status === 'locked').length,
    superseded: packets.filter((p) => p.status === 'superseded').length,
  }), [packets]);

  return (
    <div className="min-h-screen bg-sovereign-base text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Archive className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Evidence Vault</h1>
              <p className="text-sm text-gray-400">
                Universal access to decision packets • Read anywhere, generate in context
              </p>
            </div>
          </div>
          <div className="w-72">
            <DataSourceSelector showStatus />
          </div>
        </div>

        {/* RBAC Notice */}
        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="text-sm">
            <span className="text-cyan-400 font-medium">Your Role: </span>
            <span className="text-gray-300 capitalize">{currentUserRole.replace('_', ' ')}</span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-400">
              {currentUserRole === 'auditor'
                ? 'View and export locked packets only'
                : currentUserRole === 'viewer'
                  ? 'View-only access to approved packets'
                  : 'Full access with role-based actions'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Total Packets', value: stats.total, color: 'text-white' },
          { label: 'Draft', value: stats.draft, color: 'text-gray-400' },
          { label: 'Under Review', value: stats.underReview, color: 'text-amber-400' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
          { label: 'Locked', value: stats.locked, color: 'text-cyan-400' },
          { label: 'Superseded', value: stats.superseded, color: 'text-purple-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-sovereign-card border border-sovereign-border rounded-xl p-4 text-center"
          >
            <div className={cn('text-2xl font-bold', stat.color)}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by decision ID, title, owner, or system..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Quick Filters */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as PacketStatus | 'all' })}
            className="px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="locked">Locked</option>
            <option value="superseded">Superseded</option>
          </select>

          <select
            value={filters.mode}
            onChange={(e) => setFilters({ ...filters, mode: e.target.value as DecisionMode | 'all' })}
            className="px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
          >
            <option value="all">All Modes</option>
            <option value="due_diligence">Due Diligence</option>
            <option value="war_room">War Room</option>
            <option value="compliance">Compliance</option>
            <option value="strategic">Strategic</option>
            <option value="operational">Operational</option>
          </select>

          <select
            value={filters.businessUnit}
            onChange={(e) => setFilters({ ...filters, businessUnit: e.target.value })}
            className="px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
          >
            {BUSINESS_UNITS.map((bu) => (
              <option key={bu} value={bu}>{bu}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'px-3 py-2 rounded-lg border transition-colors flex items-center gap-2',
              showFilters
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-sovereign-base border-sovereign-border text-gray-400 hover:text-white'
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">More</span>
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sovereign-border grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Compliance Framework</label>
              <select
                value={filters.framework}
                onChange={(e) => setFilters({ ...filters, framework: e.target.value })}
                className="w-full px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
              >
                {COMPLIANCE_FRAMEWORKS.map((fw) => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date From</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date To</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  search: '',
                  status: 'all',
                  mode: 'all',
                  businessUnit: 'All Units',
                  owner: '',
                  framework: 'All Frameworks',
                })}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count & View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{filteredPackets.length}</span> of{' '}
          <span className="text-white font-medium">{packets.length}</span> packets
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 text-xs bg-sovereign-card border border-sovereign-border rounded-lg flex items-center gap-1"
          >
            <span className="text-gray-400">Sort:</span>
            <span className="text-white">{sortField === 'generatedAt' ? 'Date' : sortField}</span>
            <ChevronDown className={cn('w-3 h-3', sortDirection === 'asc' && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Packets Table */}
      <div className="bg-sovereign-card border border-sovereign-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-sovereign-elevated border-b border-sovereign-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sovereign-border">
            {filteredPackets.map((packet) => {
              const statusConfig = getStatusConfig(packet.status);
              const modeConfig = getModeConfig(packet.mode);
              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={packet.id}
                  className="hover:bg-sovereign-hover/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPacket(packet)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sovereign-elevated flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{packet.decisionTitle}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-mono">{packet.decisionId}</span>
                          <span>•</span>
                          <span>{packet.id}</span>
                          {packet.version > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400">v{packet.version}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        statusConfig.color
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn('flex items-center gap-1.5 text-sm', modeConfig.color)}>
                      <span>{modeConfig.icon}</span>
                      {modeConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm text-white">{packet.owner.name}</div>
                      <div className="text-xs text-gray-500">{packet.businessUnit}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm text-white">
                        {packet.generatedAt.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {packet.generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {packet.signatureValid ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Fingerprint className="w-4 h-4" />
                        <span className="text-xs">Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {canViewPacket(packet) && (
                        <button
                          onClick={() => setSelectedPacket(packet)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                          title="View Packet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {canExportPacket(packet) && (
                        <button
                          className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Export PDF/JSON"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${packet.decisionId}`)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        title="Go to Decision"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Packet Detail Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sovereign-card border border-sovereign-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-sovereign-border bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-sovereign-elevated flex items-center justify-center">
                    <FileCheck className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPacket.decisionTitle}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-sm text-gray-400">{selectedPacket.id}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                          getStatusConfig(selectedPacket.status).color
                        )}
                      >
                        {getStatusConfig(selectedPacket.status).label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPacket(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  {/* Decision Info */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Decision Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Decision ID</span>
                        <span className="font-mono text-cyan-400">{selectedPacket.decisionId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Mode</span>
                        <span className={getModeConfig(selectedPacket.mode).color}>
                          {getModeConfig(selectedPacket.mode).icon} {getModeConfig(selectedPacket.mode).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Version</span>
                        <span className="text-white">v{selectedPacket.version}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Policy Pack</span>
                        <span className="text-white">{selectedPacket.policyPackVersion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Owner & Business Unit</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{selectedPacket.owner.name}</div>
                        <div className="text-sm text-gray-400">{selectedPacket.owner.role}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{selectedPacket.businessUnit}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        <div>
                          <div className="text-sm text-white">Generated</div>
                          <div className="text-xs text-gray-500">
                            {selectedPacket.generatedAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {selectedPacket.signedAt && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div>
                            <div className="text-sm text-white">Signed</div>
                            <div className="text-xs text-gray-500">
                              {selectedPacket.signedAt.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedPacket.lockedAt && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-500" />
                          <div>
                            <div className="text-sm text-white">Locked</div>
                            <div className="text-xs text-gray-500">
                              {selectedPacket.lockedAt.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Verification & Systems */}
                <div className="space-y-6">
                  {/* Verification */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Cryptographic Verification</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Signature Status</span>
                        {selectedPacket.signatureValid ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Valid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400">
                            <AlertTriangle className="w-4 h-4" />
                            Pending
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Integrity Hash</span>
                        <div className="mt-1 p-2 bg-sovereign-base rounded font-mono text-xs text-gray-400 break-all">
                          {selectedPacket.integrityHash}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments & Activity */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Packet Contents</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-sovereign-base rounded-lg text-center">
                        <div className="text-xl font-bold text-white">{selectedPacket.attachments}</div>
                        <div className="text-xs text-gray-500">Attachments</div>
                      </div>
                      <div className="p-3 bg-sovereign-base rounded-lg text-center">
                        <div className="text-xl font-bold text-white">{selectedPacket.accessCount}</div>
                        <div className="text-xs text-gray-500">Access Count</div>
                      </div>
                      {selectedPacket.dissents > 0 && (
                        <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                          <div className="text-xl font-bold text-amber-400">{selectedPacket.dissents}</div>
                          <div className="text-xs text-amber-400/70">Dissents</div>
                        </div>
                      )}
                      {selectedPacket.overrides > 0 && (
                        <div className="p-3 bg-red-500/10 rounded-lg text-center">
                          <div className="text-xl font-bold text-red-400">{selectedPacket.overrides}</div>
                          <div className="text-xs text-red-400/70">Overrides</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Systems Impacted */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Systems Impacted</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPacket.systemsImpacted.map((system) => (
                        <span
                          key={system}
                          className="px-2 py-1 bg-sovereign-base rounded text-xs text-gray-300"
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Frameworks */}
                  <div className="bg-sovereign-elevated rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Compliance Frameworks</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPacket.complianceFrameworks.map((fw) => (
                        <span
                          key={fw}
                          className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - RBAC Actions */}
            <div className="p-4 border-t border-sovereign-border bg-sovereign-elevated flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Retention until: </span>
                <span className="text-gray-400">{selectedPacket.retentionUntil.toLocaleDateString()}</span>
                {selectedPacket.lastAccessedAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Last accessed by {selectedPacket.lastAccessedBy}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {canGeneratePacket(selectedPacket) && selectedPacket.status === 'draft' && (
                  <button
                    onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${selectedPacket.decisionId}`)}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Edit in Context
                  </button>
                )}
                {/* Send to Approvers */}
                {(selectedPacket.status === 'draft' || selectedPacket.status === 'under_review') && 
                  ['decision_owner', 'council_operator'].includes(currentUserRole) && (
                  <button
                    onClick={() => {
                      setActionPacketId(selectedPacket.id);
                      setShowSendToApprovers(true);
                    }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send to Approvers
                  </button>
                )}
                {/* Attach Evidence */}
                {(selectedPacket.status !== 'locked' && selectedPacket.status !== 'superseded') &&
                  ['decision_owner', 'council_operator', 'approver', 'risk_compliance'].includes(currentUserRole) && (
                  <button
                    onClick={() => {
                      setActionPacketId(selectedPacket.id);
                      setShowAttachEvidence(true);
                    }}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach Evidence
                  </button>
                )}
                {canLockPacket(selectedPacket) && (
                  <button 
                    onClick={() => handleLockPacket(selectedPacket.id)}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Lock & Finalize
                  </button>
                )}
                {canExportPacket(selectedPacket) && (
                  <button 
                    onClick={() => handleExportPacket(selectedPacket.id)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-cyan-500 hover:to-blue-500 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF + JSON
                  </button>
                )}
                {/* Break-glass Export */}
                <button
                  onClick={() => {
                    setActionPacketId(selectedPacket.id);
                    setShowBreakGlass(true);
                  }}
                  className="px-4 py-2 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Break-glass
                </button>
                <button
                  onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${selectedPacket.decisionId}`)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send to Approvers Modal */}
      {showSendToApprovers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-sovereign-card border border-sovereign-border rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-sovereign-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-blue-400" />
                <h2 className="text-lg font-bold">Send to Approvers</h2>
              </div>
              <button onClick={() => setShowSendToApprovers(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Approver Email</label>
                <input
                  type="email"
                  value={approverEmail}
                  onChange={(e) => setApproverEmail(e.target.value)}
                  placeholder="approver@company.com"
                  className="w-full px-4 py-3 bg-sovereign-base border border-sovereign-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message (optional)</label>
                <textarea
                  value={approverMessage}
                  onChange={(e) => setApproverMessage(e.target.value)}
                  placeholder="Please review this decision packet..."
                  rows={3}
                  className="w-full px-4 py-3 bg-sovereign-base border border-sovereign-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-sovereign-border flex justify-end gap-3">
              <button onClick={() => setShowSendToApprovers(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleSendToApprovers}
                disabled={!approverEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach Evidence Modal */}
      {showAttachEvidence && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-sovereign-card border border-sovereign-border rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-sovereign-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Paperclip className="w-6 h-6 text-purple-400" />
                <h2 className="text-lg font-bold">Attach Evidence</h2>
              </div>
              <button onClick={() => setShowAttachEvidence(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={attachmentCategory}
                  onChange={(e) => setAttachmentCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-sovereign-base border border-sovereign-border rounded-lg"
                >
                  <option value="evidence">Evidence</option>
                  <option value="supporting">Supporting Document</option>
                  <option value="reference">Reference</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">File</label>
                <div
                  className="border-2 border-dashed border-sovereign-border rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('evidence-file-input')?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {attachmentFile ? attachmentFile.name : 'Click to select or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX, XLSX up to 50MB</p>
                  <input
                    id="evidence-file-input"
                    type="file"
                    onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.doc,.xls,.csv,.txt"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-sovereign-border flex justify-end gap-3">
              <button onClick={() => setShowAttachEvidence(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleAttachEvidence}
                disabled={!attachmentFile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Attach File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Break-glass Export Modal */}
      {showBreakGlass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-sovereign-card border border-red-500/30 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-red-500/30 bg-red-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-red-400" />
                <div>
                  <h2 className="text-lg font-bold text-red-400">Break-glass Export</h2>
                  <p className="text-xs text-red-400/70">Emergency access - requires dual admin approval</p>
                </div>
              </div>
              <button onClick={() => setShowBreakGlass(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>Warning:</strong> Break-glass exports are logged, audited, and require approval from 
                  two separate administrators. Use only in genuine emergencies.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Urgency Level</label>
                <select
                  value={breakGlassUrgency}
                  onChange={(e) => setBreakGlassUrgency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-sovereign-base border border-sovereign-border rounded-lg"
                >
                  <option value="high">High - Response within 4 hours</option>
                  <option value="critical">Critical - Response within 1 hour</option>
                  <option value="emergency">Emergency - Immediate response required</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Justification (required)</label>
                <textarea
                  value={breakGlassJustification}
                  onChange={(e) => setBreakGlassJustification(e.target.value)}
                  placeholder="Explain why emergency access is required..."
                  rows={4}
                  className="w-full px-4 py-3 bg-sovereign-base border border-sovereign-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-sovereign-border flex justify-end gap-3">
              <button onClick={() => setShowBreakGlass(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleBreakGlassRequest}
                disabled={!breakGlassJustification}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                Request Break-glass Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceVaultPage;
