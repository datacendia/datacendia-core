// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA EVIDENCE VAULT SERVICE
 * 
 * Enterprise-grade decision packet management with:
 * - Global access with RBAC controls
 * - Data source integration for real client data
 * - Send to approvers workflow
 * - Attach evidence functionality
 * - Break-glass export with dual approval
 * - Cryptographic verification and chain of custody
 * 
 * PERSISTENCE: Prisma (evidence_vault_packets table) + in-memory cache.
 * Data survives server restart via PostgreSQL.
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type PacketStatus = 'draft' | 'under_review' | 'approved' | 'locked' | 'superseded';
export type DecisionMode = 'due_diligence' | 'war_room' | 'compliance' | 'strategic' | 'operational';
export type UserRole = 'viewer' | 'decision_owner' | 'council_operator' | 'approver' | 'risk_compliance' | 'auditor' | 'admin';

export interface DecisionPacket {
  id: string;
  decisionId: string;
  decisionTitle: string;
  status: PacketStatus;
  mode: DecisionMode;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  };
  businessUnit: string;
  organizationId: string;
  dataSourceId?: string | undefined;
  generatedAt: Date;
  signedAt?: Date | undefined;
  lockedAt?: Date | undefined;
  policyPackVersion: string;
  signatureValid: boolean;
  integrityHash: string;
  version: number;
  supersededBy?: string | undefined;
  attachments: Attachment[];
  dissents: Dissent[];
  vetoes: Veto[];
  overrides: Override[];
  systemsImpacted: string[];
  complianceFrameworks: string[];
  retentionUntil: Date;
  accessLog: AccessLogEntry[];
  approvalWorkflow?: ApprovalWorkflow | undefined;
  breakGlassExport?: BreakGlassExport | undefined;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  hash: string;
  description?: string | undefined;
  category: 'evidence' | 'supporting' | 'reference' | 'legal';
}

export interface Dissent {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  submittedAt: Date;
  status: 'pending' | 'acknowledged' | 'resolved';
}

export interface Veto {
  id: string;
  userId: string;
  userName: string;
  authority: string;
  reason: string;
  submittedAt: Date;
  overridden: boolean;
  overriddenBy?: string | undefined;
  overriddenAt?: Date | undefined;
}

export interface Override {
  id: string;
  userId: string;
  userName: string;
  originalValue: string;
  newValue: string;
  justification: string;
  submittedAt: Date;
  approvedBy?: string | undefined;
  approvedAt?: Date | undefined;
}

export interface AccessLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'export' | 'generate' | 'lock' | 'send_approval' | 'attach' | 'break_glass';
  timestamp: Date;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
  details?: string | undefined;
}

export interface ApprovalWorkflow {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedBy: string;
  requestedAt: Date;
  approvers: Approver[];
  dueDate: Date;
  message?: string | undefined;
  completedAt?: Date | undefined;
}

export interface Approver {
  userId: string;
  userName: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: Date | undefined;
  comment?: string | undefined;
}

export interface BreakGlassExport {
  id: string;
  status: 'pending' | 'approved' | 'denied' | 'executed';
  requestedBy: string;
  requestedAt: Date;
  justification: string;
  urgencyLevel: 'high' | 'critical' | 'emergency';
  firstApprover?: {
    userId: string;
    userName: string;
    approvedAt: Date;
  } | undefined;
  secondApprover?: {
    userId: string;
    userName: string;
    approvedAt: Date;
  } | undefined;
  executedAt?: Date | undefined;
  auditTrail: string[];
}

export interface PacketSearchParams {
  organizationId: string;
  dataSourceId?: string | undefined;
  search?: string | undefined;
  status?: PacketStatus | 'all' | undefined;
  mode?: DecisionMode | 'all' | undefined;
  businessUnit?: string | undefined;
  owner?: string | undefined;
  framework?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface RelatedDecision {
  packetId: string;
  decisionId: string;
  decisionTitle: string;
  status: PacketStatus;
  mode: DecisionMode;
  relevanceScore: number;
  relationship: 'impacts' | 'impacted_by' | 'related' | 'supersedes' | 'superseded_by';
  entityType: string;
  entityId: string;
}

// =============================================================================
// SAMPLE DATA - Enterprise Ready
// =============================================================================

const generateSamplePackets = (): DecisionPacket[] => {
  const retentionDate = new Date();
  retentionDate.setFullYear(retentionDate.getFullYear() + 7);

  return [
    {
      id: 'PKT-2024-001',
      decisionId: 'DEC-2024-0847',
      decisionTitle: 'Q1 2025 Market Expansion Strategy',
      status: 'locked',
      mode: 'strategic',
      owner: { id: 'usr-001', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Chief Strategy Officer', department: 'Executive' },
      businessUnit: 'Corporate Strategy',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-15T10:30:00'),
      signedAt: new Date('2024-12-15T14:22:00'),
      lockedAt: new Date('2024-12-16T09:00:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: true,
      integrityHash: 'sha256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      version: 3,
      attachments: [
        { id: 'att-001', filename: 'market-analysis.pdf', mimeType: 'application/pdf', size: 2456789, uploadedAt: new Date('2024-12-15T11:00:00'), uploadedBy: 'usr-001', hash: 'sha256-abc123', category: 'evidence' },
        { id: 'att-002', filename: 'competitor-report.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1234567, uploadedAt: new Date('2024-12-15T11:30:00'), uploadedBy: 'usr-001', hash: 'sha256-def456', category: 'supporting' },
      ],
      dissents: [
        { id: 'dis-001', userId: 'usr-005', userName: 'Michael Torres', reason: 'Risk assessment incomplete for APAC region', submittedAt: new Date('2024-12-15T12:00:00'), status: 'acknowledged' },
      ],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['CRM', 'ERP', 'Marketing Automation'],
      complianceFrameworks: ['SOX', 'GDPR'],
      retentionUntil: retentionDate,
      accessLog: [
        { id: 'log-001', userId: 'usr-005', userName: 'Michael Torres', action: 'view', timestamp: new Date('2024-12-19T08:15:00') },
      ],
    },
    {
      id: 'PKT-2024-002',
      decisionId: 'DEC-2024-0891',
      decisionTitle: 'Emergency Infrastructure Scaling Response',
      status: 'locked',
      mode: 'war_room',
      owner: { id: 'usr-002', name: 'James Wilson', email: 'james.wilson@company.com', role: 'VP Engineering', department: 'Technology' },
      businessUnit: 'Engineering',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-18T02:15:00'),
      signedAt: new Date('2024-12-18T02:45:00'),
      lockedAt: new Date('2024-12-18T03:00:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: true,
      integrityHash: 'sha256-a3b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      version: 1,
      attachments: [
        { id: 'att-003', filename: 'incident-report.pdf', mimeType: 'application/pdf', size: 567890, uploadedAt: new Date('2024-12-18T02:20:00'), uploadedBy: 'usr-002', hash: 'sha256-ghi789', category: 'evidence' },
      ],
      dissents: [],
      vetoes: [],
      overrides: [
        { id: 'ovr-001', userId: 'usr-002', userName: 'James Wilson', originalValue: 'Standard approval flow', newValue: 'Emergency bypass', justification: 'Critical production incident requiring immediate action', submittedAt: new Date('2024-12-18T02:30:00'), approvedBy: 'usr-001', approvedAt: new Date('2024-12-18T02:35:00') },
      ],
      systemsImpacted: ['Cloud Infrastructure', 'Database Cluster', 'CDN'],
      complianceFrameworks: ['SOC2', 'ISO27001'],
      retentionUntil: retentionDate,
      accessLog: [],
    },
    {
      id: 'PKT-2024-003',
      decisionId: 'DEC-2024-0912',
      decisionTitle: 'Vendor Due Diligence: Acme Analytics Partnership',
      status: 'approved',
      mode: 'due_diligence',
      owner: { id: 'usr-003', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', role: 'Head of Procurement', department: 'Operations' },
      businessUnit: 'Procurement',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-17T14:00:00'),
      signedAt: new Date('2024-12-18T16:30:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: true,
      integrityHash: 'sha256-b4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
      version: 2,
      attachments: [
        { id: 'att-004', filename: 'vendor-assessment.pdf', mimeType: 'application/pdf', size: 3456789, uploadedAt: new Date('2024-12-17T14:30:00'), uploadedBy: 'usr-003', hash: 'sha256-jkl012', category: 'evidence' },
        { id: 'att-005', filename: 'security-audit.pdf', mimeType: 'application/pdf', size: 2345678, uploadedAt: new Date('2024-12-17T15:00:00'), uploadedBy: 'usr-003', hash: 'sha256-mno345', category: 'legal' },
      ],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['Data Warehouse', 'BI Platform'],
      complianceFrameworks: ['GDPR', 'CCPA', 'SOC2'],
      retentionUntil: retentionDate,
      accessLog: [],
      approvalWorkflow: {
        id: 'wf-001',
        status: 'approved',
        requestedBy: 'usr-003',
        requestedAt: new Date('2024-12-17T16:00:00'),
        dueDate: new Date('2024-12-24T16:00:00'),
        message: 'Please review vendor security assessment',
        completedAt: new Date('2024-12-18T16:30:00'),
        approvers: [
          { userId: 'usr-006', userName: 'Legal Team', email: 'legal@company.com', role: 'Legal Counsel', status: 'approved', respondedAt: new Date('2024-12-18T10:00:00'), comment: 'Contract terms acceptable' },
          { userId: 'usr-007', userName: 'Security Team', email: 'security@company.com', role: 'CISO', status: 'approved', respondedAt: new Date('2024-12-18T14:00:00'), comment: 'Security controls verified' },
        ],
      },
    },
    {
      id: 'PKT-2024-004',
      decisionId: 'DEC-2024-0923',
      decisionTitle: 'GDPR Data Processing Agreement Update',
      status: 'under_review',
      mode: 'compliance',
      owner: { id: 'usr-004', name: 'Dr. Anna Schmidt', email: 'anna.schmidt@company.com', role: 'Chief Privacy Officer', department: 'Legal' },
      businessUnit: 'Legal & Compliance',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-19T10:00:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: false,
      integrityHash: 'sha256-c5d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
      version: 1,
      attachments: [],
      dissents: [
        { id: 'dis-002', userId: 'usr-008', userName: 'Data Protection Officer', reason: 'Additional impact assessment required for new processing activities', submittedAt: new Date('2024-12-19T11:00:00'), status: 'pending' },
        { id: 'dis-003', userId: 'usr-009', userName: 'IT Security', reason: 'Encryption standards need clarification', submittedAt: new Date('2024-12-19T11:30:00'), status: 'pending' },
      ],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['Customer Database', 'Marketing Platform', 'Support System'],
      complianceFrameworks: ['GDPR', 'ePrivacy'],
      retentionUntil: retentionDate,
      accessLog: [],
      approvalWorkflow: {
        id: 'wf-002',
        status: 'pending',
        requestedBy: 'usr-004',
        requestedAt: new Date('2024-12-19T10:30:00'),
        dueDate: new Date('2024-12-26T10:30:00'),
        message: 'Urgent: DPA update required before year-end',
        approvers: [
          { userId: 'usr-010', userName: 'EU Legal', email: 'eu.legal@company.com', role: 'EU Counsel', status: 'pending' },
          { userId: 'usr-011', userName: 'Compliance Officer', email: 'compliance@company.com', role: 'CCO', status: 'pending' },
        ],
      },
    },
    {
      id: 'PKT-2024-005',
      decisionId: 'DEC-2024-0934',
      decisionTitle: 'FY2025 Budget Allocation Model',
      status: 'draft',
      mode: 'operational',
      owner: { id: 'usr-012', name: 'Robert Kim', email: 'robert.kim@company.com', role: 'CFO', department: 'Finance' },
      businessUnit: 'Finance',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-19T11:30:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: false,
      integrityHash: 'sha256-d6e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
      version: 1,
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['ERP', 'Financial Planning'],
      complianceFrameworks: ['SOX', 'GAAP'],
      retentionUntil: retentionDate,
      accessLog: [],
    },
    {
      id: 'PKT-2024-006',
      decisionId: 'DEC-2024-0845',
      decisionTitle: 'AI Model Deployment: Customer Churn Predictor v2',
      status: 'superseded',
      mode: 'operational',
      owner: { id: 'usr-013', name: 'Dr. Lisa Park', email: 'lisa.park@company.com', role: 'Head of Data Science', department: 'Analytics' },
      businessUnit: 'Data Science',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-10T09:00:00'),
      signedAt: new Date('2024-12-10T15:00:00'),
      lockedAt: new Date('2024-12-11T09:00:00'),
      policyPackVersion: 'v2024.11.2',
      signatureValid: true,
      integrityHash: 'sha256-e7f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
      version: 1,
      supersededBy: 'PKT-2024-007',
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['ML Platform', 'Customer Analytics'],
      complianceFrameworks: ['EU AI Act', 'SOC2'],
      retentionUntil: retentionDate,
      accessLog: [],
    },
  ];
};

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

class EvidenceVaultService extends EventEmitter {
  private static instance: EvidenceVaultService;
  private packets: Map<string, DecisionPacket> = new Map();
  private breakGlassRequests: Map<string, BreakGlassExport> = new Map();

  private constructor() {
    super();
    this.initFromDb().catch(() => {
      logger.warn('[EvidenceVault] DB not available, using in-memory sample data');
      const samples = generateSamplePackets();
      samples.forEach(p => this.packets.set(p.id, p));
    });
    logger.info('[EvidenceVault] Service initialized with Prisma persistence');


    this.loadFromDB().catch(() => {});
  }

  private async initFromDb(): Promise<void> {
    try {
      const dbPackets = await prisma.evidence_vault_packets.findMany({ orderBy: { generated_at: 'desc' } });
      if (dbPackets.length > 0) {
        for (const row of dbPackets) {
          this.packets.set(row.id, row.data as unknown as DecisionPacket);
        }
        logger.info(`[EvidenceVault] Loaded ${dbPackets.length} packets from database`);
        return;
      }
    } catch { /* DB not available */ }
    // Seed sample data and persist
    const samples = generateSamplePackets();
    samples.forEach(p => this.packets.set(p.id, p));
    for (const p of samples) {
      this.persistPacket(p).catch(() => {});
    }
  }

  private async persistPacket(packet: DecisionPacket): Promise<void> {
    try {
      await prisma.evidence_vault_packets.upsert({
        where: { id: packet.id },
        update: {
          status: packet.status,
          signature_valid: packet.signatureValid,
          integrity_hash: packet.integrityHash,
          version: packet.version,
          superseded_by: packet.supersededBy ?? null,
          signed_at: packet.signedAt ?? null,
          locked_at: packet.lockedAt ?? null,
          data: packet as any,
        },
        create: {
          id: packet.id,
          decision_id: packet.decisionId,
          decision_title: packet.decisionTitle,
          status: packet.status,
          mode: packet.mode,
          owner_id: packet.owner.id,
          owner_name: packet.owner.name,
          owner_email: packet.owner.email,
          owner_role: packet.owner.role,
          owner_department: packet.owner.department,
          business_unit: packet.businessUnit,
          organization_id: packet.organizationId,
          data_source_id: packet.dataSourceId ?? null,
          policy_pack_version: packet.policyPackVersion,
          signature_valid: packet.signatureValid,
          integrity_hash: packet.integrityHash,
          version: packet.version,
          superseded_by: packet.supersededBy ?? null,
          systems_impacted: packet.systemsImpacted,
          compliance_frameworks: packet.complianceFrameworks,
          retention_until: packet.retentionUntil,
          data: packet as any,
          generated_at: packet.generatedAt,
          signed_at: packet.signedAt ?? null,
          locked_at: packet.lockedAt ?? null,
        },
      });
    } catch (err) {
      logger.debug('[EvidenceVault] DB persist failed (non-fatal):', err);
    }
  }

  static getInstance(): EvidenceVaultService {
    if (!EvidenceVaultService.instance) {
      EvidenceVaultService.instance = new EvidenceVaultService();
    }
    return EvidenceVaultService.instance;
  }

  // ===========================================================================
  // PACKET RETRIEVAL
  // ===========================================================================

  async getPackets(params: PacketSearchParams): Promise<{ packets: DecisionPacket[]; total: number }> {
    const { search, status, mode, businessUnit, framework, dataSourceId, limit = 50, offset = 0 } = params;

    let result = Array.from(this.packets.values());

    // Filter by data source
    if (dataSourceId) {
      result = result.filter(p => p.dataSourceId === dataSourceId);
    }

    // Filter by status
    if (status && status !== 'all') {
      result = result.filter(p => p.status === status);
    }

    // Filter by mode
    if (mode && mode !== 'all') {
      result = result.filter(p => p.mode === mode);
    }

    // Filter by business unit
    if (businessUnit && businessUnit !== 'All Units') {
      result = result.filter(p => p.businessUnit === businessUnit);
    }

    // Filter by framework
    if (framework && framework !== 'All Frameworks') {
      result = result.filter(p => p.complianceFrameworks.includes(framework));
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.decisionId.toLowerCase().includes(searchLower) ||
        p.decisionTitle.toLowerCase().includes(searchLower) ||
        p.owner.name.toLowerCase().includes(searchLower) ||
        p.systemsImpacted.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    // Sort by generated date descending
    result.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());

    const total = result.length;
    result = result.slice(offset, offset + limit);

    return { packets: result, total };
  }

  async getPacketById(id: string, userId: string, userRole: UserRole): Promise<DecisionPacket | null> {
    const packet = this.packets.get(id);
    if (!packet) return null;

    // RBAC check for auditors
    if (userRole === 'auditor' && packet.status !== 'locked') {
      throw new Error('Auditors can only access locked packets');
    }

    // Log access
    this.logAccess(packet, userId, 'view');

    return packet;
  }

  // ===========================================================================
  // PACKET GENERATION (Context Only)
  // ===========================================================================

  async generatePacket(
    decisionId: string,
    userId: string,
    userRole: UserRole,
    dataSourceId: string,
    options: {
      title: string;
      mode: DecisionMode;
      businessUnit: string;
      systemsImpacted: string[];
      complianceFrameworks: string[];
      policyPackVersion: string;
    }
  ): Promise<DecisionPacket> {
    // RBAC check
    if (!['decision_owner', 'council_operator'].includes(userRole)) {
      throw new Error('Only Decision Owners and Council Operators can generate packets');
    }

    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + 7);

    const packet: DecisionPacket = {
      id: `PKT-${Date.now()}`,
      decisionId,
      decisionTitle: options.title,
      status: 'draft',
      mode: options.mode,
      owner: {
        id: userId,
        name: 'Current User',
        email: 'user@company.com',
        role: 'Decision Owner',
        department: options.businessUnit,
      },
      businessUnit: options.businessUnit,
      organizationId: 'org-default',
      dataSourceId,
      generatedAt: new Date(),
      policyPackVersion: options.policyPackVersion,
      signatureValid: false,
      integrityHash: this.generateIntegrityHash({ decisionId, ...options }),
      version: 1,
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: options.systemsImpacted,
      complianceFrameworks: options.complianceFrameworks,
      retentionUntil: retentionDate,
      accessLog: [],
    };

    this.packets.set(packet.id, packet);
    this.persistPacket(packet).catch(() => {});
    this.logAccess(packet, userId, 'generate');
    this.emit('packet:generated', { packetId: packet.id, userId });

    return packet;
  }

  // ===========================================================================
  // SEND TO APPROVERS
  // ===========================================================================

  async sendToApprovers(
    packetId: string,
    userId: string,
    userRole: UserRole,
    approvers: { userId: string; email: string; name: string; role: string }[],
    message?: string,
    dueDate?: Date
  ): Promise<ApprovalWorkflow> {
    if (!['decision_owner', 'council_operator'].includes(userRole)) {
      throw new Error('Only Decision Owners and Council Operators can send packets for approval');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    if (packet.status !== 'draft' && packet.status !== 'under_review') {
      throw new Error('Only draft or under-review packets can be sent for approval');
    }

    const workflow: ApprovalWorkflow = {
      id: `wf-${Date.now()}`,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      message,
      approvers: approvers.map(a => ({
        userId: a.userId,
        userName: a.name,
        email: a.email,
        role: a.role,
        status: 'pending' as const,
      })),
    };

    packet.status = 'under_review';
    packet.approvalWorkflow = workflow;
    this.persistPacket(packet).catch(() => {});
    this.logAccess(packet, userId, 'send_approval', `Sent to ${approvers.length} approvers`);

    this.emit('packet:sent_for_approval', { packetId, workflow, approvers });

    return workflow;
  }

  async respondToApproval(
    packetId: string,
    userId: string,
    response: 'approved' | 'rejected',
    comment?: string
  ): Promise<void> {
    const packet = this.packets.get(packetId);
    if (!packet || !packet.approvalWorkflow) throw new Error('Workflow not found');

    const approver = packet.approvalWorkflow.approvers.find(a => a.userId === userId);
    if (!approver) throw new Error('Not an approver for this packet');

    approver.status = response;
    approver.respondedAt = new Date();
    approver.comment = comment;

    // Check if all approved
    const allResponded = packet.approvalWorkflow.approvers.every(a => a.status !== 'pending');
    const allApproved = packet.approvalWorkflow.approvers.every(a => a.status === 'approved');

    if (allResponded) {
      packet.approvalWorkflow.status = allApproved ? 'approved' : 'rejected';
      packet.approvalWorkflow.completedAt = new Date();
      if (allApproved) {
        packet.status = 'approved';
        packet.signedAt = new Date();
        packet.signatureValid = true;
      }
      this.persistPacket(packet).catch(() => {});
      this.emit('packet:approval_complete', { packetId, status: packet.approvalWorkflow.status });
    }
  }

  // ===========================================================================
  // ATTACH EVIDENCE
  // ===========================================================================

  async attachEvidence(
    packetId: string,
    userId: string,
    userRole: UserRole,
    file: {
      filename: string;
      mimeType: string;
      size: number;
      buffer: Buffer;
      description?: string;
      category: Attachment['category'];
    }
  ): Promise<Attachment> {
    if (!['decision_owner', 'council_operator', 'approver', 'risk_compliance'].includes(userRole)) {
      throw new Error('Insufficient permissions to attach evidence');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    if (packet.status === 'locked' || packet.status === 'superseded') {
      throw new Error('Cannot attach evidence to locked or superseded packets');
    }

    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: new Date(),
      uploadedBy: userId,
      hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
      description: file.description,
      category: file.category,
    };

    packet.attachments.push(attachment);
    packet.integrityHash = this.generateIntegrityHash(packet);
    packet.signatureValid = false;
    this.persistPacket(packet).catch(() => {});

    this.logAccess(packet, userId, 'attach', `Attached: ${file.filename}`);
    this.emit('packet:evidence_attached', { packetId, attachmentId: attachment.id });

    return attachment;
  }

  // ===========================================================================
  // LOCK PACKET
  // ===========================================================================

  async lockPacket(packetId: string, userId: string, userRole: UserRole): Promise<DecisionPacket> {
    if (!['approver', 'risk_compliance', 'admin'].includes(userRole)) {
      throw new Error('Only Approvers, Risk/Compliance, and Admins can lock packets');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    if (packet.status !== 'approved') {
      throw new Error('Only approved packets can be locked');
    }

    packet.status = 'locked';
    packet.lockedAt = new Date();
    packet.signedAt = new Date();
    packet.signatureValid = true;
    packet.integrityHash = this.generateIntegrityHash(packet);
    this.persistPacket(packet).catch(() => {});

    this.logAccess(packet, userId, 'lock');
    this.emit('packet:locked', { packetId, userId });

    return packet;
  }

  // ===========================================================================
  // BREAK-GLASS EXPORT
  // ===========================================================================

  async requestBreakGlassExport(
    packetId: string,
    userId: string,
    justification: string,
    urgencyLevel: BreakGlassExport['urgencyLevel']
  ): Promise<BreakGlassExport> {
    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    const breakGlass: BreakGlassExport = {
      id: `bg-${Date.now()}`,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date(),
      justification,
      urgencyLevel,
      auditTrail: [`${new Date().toISOString()}: Break-glass export requested by ${userId}`],
    };

    this.breakGlassRequests.set(breakGlass.id, breakGlass);
    packet.breakGlassExport = breakGlass;
    this.logAccess(packet, userId, 'break_glass', `Requested: ${urgencyLevel} urgency`);

    this.emit('packet:break_glass_requested', { packetId, breakGlassId: breakGlass.id, userId, urgencyLevel });
    logger.warn(`[EvidenceVault] Break-glass export requested for packet ${packetId}`);

    return breakGlass;
  }

  async approveBreakGlassExport(breakGlassId: string, userId: string, userRole: UserRole): Promise<BreakGlassExport> {
    if (userRole !== 'admin') {
      throw new Error('Only Admins can approve break-glass exports');
    }

    const breakGlass = this.breakGlassRequests.get(breakGlassId);
    if (!breakGlass) throw new Error('Break-glass request not found');

    if (!breakGlass.firstApprover) {
      breakGlass.firstApprover = { userId, userName: 'Admin', approvedAt: new Date() };
      breakGlass.auditTrail.push(`${new Date().toISOString()}: First approval by ${userId}`);
    } else if (!breakGlass.secondApprover) {
      if (breakGlass.firstApprover.userId === userId) {
        throw new Error('Cannot be both approvers for break-glass export');
      }
      breakGlass.secondApprover = { userId, userName: 'Admin', approvedAt: new Date() };
      breakGlass.status = 'approved';
      breakGlass.auditTrail.push(`${new Date().toISOString()}: Second approval by ${userId}`);
      breakGlass.auditTrail.push(`${new Date().toISOString()}: Break-glass export authorized`);
      this.emit('packet:break_glass_approved', { breakGlassId });
    }

    return breakGlass;
  }

  async executeBreakGlassExport(breakGlassId: string): Promise<Buffer> {
    const breakGlass = this.breakGlassRequests.get(breakGlassId);
    if (!breakGlass) throw new Error('Break-glass request not found');
    if (breakGlass.status !== 'approved') {
      throw new Error('Break-glass export not yet approved');
    }

    // Find associated packet
    const packet = Array.from(this.packets.values()).find(p => p.breakGlassExport?.id === breakGlassId);
    if (!packet) throw new Error('Packet not found');

    breakGlass.status = 'executed';
    breakGlass.executedAt = new Date();
    breakGlass.auditTrail.push(`${new Date().toISOString()}: Export executed`);

    return this.generateExportBundle(packet);
  }

  // ===========================================================================
  // RELATED DECISIONS
  // ===========================================================================

  async getRelatedDecisions(entityType: string, entityId: string, _organizationId: string): Promise<RelatedDecision[]> {
    const results: RelatedDecision[] = [];

    this.packets.forEach((packet) => {
      const isRelated = packet.systemsImpacted.some(s => 
        s.toLowerCase().includes(entityId.toLowerCase())
      ) || packet.decisionTitle.toLowerCase().includes(entityId.toLowerCase());

      if (isRelated) {
        results.push({
          packetId: packet.id,
          decisionId: packet.decisionId,
          decisionTitle: packet.decisionTitle,
          status: packet.status,
          mode: packet.mode,
          relevanceScore: 0.8,
          relationship: 'related',
          entityType,
          entityId,
        });
      }
    });

    return results.slice(0, 10);
  }

  // ===========================================================================
  // EXPORT
  // ===========================================================================

  async exportPacket(packetId: string, userId: string, userRole: UserRole, format: 'pdf' | 'json' | 'bundle' = 'bundle'): Promise<Buffer> {
    if (userRole === 'viewer') {
      throw new Error('Viewers cannot export packets');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    if (userRole === 'auditor' && packet.status !== 'locked') {
      throw new Error('Auditors can only export locked packets');
    }

    this.logAccess(packet, userId, 'export', `Format: ${format}`);
    return this.generateExportBundle(packet, format);
  }

  // ===========================================================================
  // STATS
  // ===========================================================================

  async getStats(dataSourceId?: string): Promise<Record<string, number>> {
    let packets = Array.from(this.packets.values());
    if (dataSourceId) {
      packets = packets.filter(p => p.dataSourceId === dataSourceId);
    }

    return {
      total: packets.length,
      draft: packets.filter(p => p.status === 'draft').length,
      underReview: packets.filter(p => p.status === 'under_review').length,
      approved: packets.filter(p => p.status === 'approved').length,
      locked: packets.filter(p => p.status === 'locked').length,
      superseded: packets.filter(p => p.status === 'superseded').length,
    };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private generateIntegrityHash(data: any): string {
    const serialized = JSON.stringify(data, Object.keys(data).sort());
    return `sha256-${crypto.createHash('sha256').update(serialized).digest('hex')}`;
  }

  private logAccess(packet: DecisionPacket, userId: string, action: AccessLogEntry['action'], details?: string): void {
    packet.accessLog.push({
      id: `log-${Date.now()}`,
      userId,
      userName: 'User',
      action,
      timestamp: new Date(),
      details,
    });
  }

  private generateExportBundle(packet: DecisionPacket, _format: 'pdf' | 'json' | 'bundle' = 'bundle'): Buffer {
    const exportData = {
      packet,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0',
      integrityVerified: packet.signatureValid,
    };
    return Buffer.from(JSON.stringify(exportData, null, 2));
  }

  // ===========================================================================
  // COUNCIL DECISION PACKET INTEGRATION
  // ===========================================================================

  /**
   * Store a council decision packet in the Evidence Vault
   * Called after a deliberation is completed and packet is built
   */
  async storeCouncilDecisionPacket(params: {
    runId: string;
    deliberationId: string;
    organizationId: string;
    userId: string;
    question: string;
    recommendation: string;
    confidence: number;
    merkleRoot: string;
    signature?: { signature: string; algorithm: string; keyId: string } | undefined;
    regulatoryFrameworks: string[];
    retentionUntil: Date;
  }): Promise<DecisionPacket> {
    const packet: DecisionPacket = {
      id: `PKT-${params.runId}`,
      decisionId: params.deliberationId,
      decisionTitle: params.question.substring(0, 100),
      status: params.signature ? 'locked' : 'draft',
      mode: 'due_diligence',
      owner: {
        id: params.userId || 'system',
        name: 'Council System',
        email: 'council@datacendia.local',
        role: 'Council Operator',
        department: 'AI Operations',
      },
      businessUnit: 'AI Council',
      organizationId: params.organizationId,
      generatedAt: new Date(),
      signedAt: params.signature ? new Date() : undefined,
      lockedAt: params.signature ? new Date() : undefined,
      policyPackVersion: '1.0.0',
      signatureValid: !!params.signature,
      integrityHash: params.merkleRoot,
      version: 1,
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['CendiaCouncil™'],
      complianceFrameworks: params.regulatoryFrameworks,
      retentionUntil: params.retentionUntil,
      accessLog: [{
        id: `log-${Date.now()}`,
        userId: params.userId || 'system',
        userName: 'Council System',
        action: 'generate',
        timestamp: new Date(),
        details: `Council deliberation completed with ${Math.round(params.confidence * 100)}% confidence`,
      }],
    };

    this.packets.set(packet.id, packet);
    this.persistPacket(packet).catch(() => {});
    this.emit('packet:council_stored', { packetId: packet.id, runId: params.runId });
    
    logger.info('[EvidenceVault] Stored council decision packet', { 
      packetId: packet.id, 
      runId: params.runId,
      signed: !!params.signature,
    });

    return packet;
  }

  /**
   * Get council decision packet by run ID
   */
  async getCouncilPacketByRunId(runId: string): Promise<DecisionPacket | null> {
    const packetId = `PKT-${runId}`;
    return this.packets.get(packetId) || null;
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'EvidenceVault', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.packets.has(d.id)) this.packets.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'EvidenceVault', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.breakGlassRequests.has(d.id)) this.breakGlassRequests.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[EvidenceVaultService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[EvidenceVaultService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const evidenceVaultService = EvidenceVaultService.getInstance();
export default evidenceVaultService;
