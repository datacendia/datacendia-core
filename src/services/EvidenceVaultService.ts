// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA EVIDENCE VAULT SERVICE (Frontend)
 * 
 * API client for Evidence Vault operations
 * Integrates with selected data source from DataSourceContext
 */

import { api } from '../lib/api/client';

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
  dataSourceId?: string;
  generatedAt: Date;
  signedAt?: Date;
  lockedAt?: Date;
  policyPackVersion: string;
  signatureValid: boolean;
  integrityHash: string;
  version: number;
  supersededBy?: string;
  attachments: Attachment[];
  dissents: Dissent[];
  vetoes: Veto[];
  overrides: Override[];
  systemsImpacted: string[];
  complianceFrameworks: string[];
  retentionUntil: Date;
  accessLog: AccessLogEntry[];
  approvalWorkflow?: ApprovalWorkflow;
  breakGlassExport?: BreakGlassExport;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  hash: string;
  description?: string;
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
  overriddenBy?: string;
  overriddenAt?: Date;
}

export interface Override {
  id: string;
  userId: string;
  userName: string;
  originalValue: string;
  newValue: string;
  justification: string;
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface AccessLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'export' | 'generate' | 'lock' | 'send_approval' | 'attach' | 'break_glass';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

export interface ApprovalWorkflow {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedBy: string;
  requestedAt: Date;
  approvers: Approver[];
  dueDate: Date;
  message?: string;
  completedAt?: Date;
}

export interface Approver {
  userId: string;
  userName: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: Date;
  comment?: string;
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
  };
  secondApprover?: {
    userId: string;
    userName: string;
    approvedAt: Date;
  };
  executedAt?: Date;
  auditTrail: string[];
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

export interface PacketSearchParams {
  dataSourceId?: string;
  search?: string;
  status?: PacketStatus | 'all';
  mode?: DecisionMode | 'all';
  businessUnit?: string;
  framework?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface PacketStats {
  total: number;
  draft: number;
  underReview: number;
  approved: number;
  locked: number;
  superseded: number;
}

// =============================================================================
// API SERVICE
// =============================================================================

const BASE_URL = '/evidence-vault';

export const evidenceVaultApi = {
  // Packet retrieval
  async getPackets(params: PacketSearchParams): Promise<{ packets: DecisionPacket[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params.dataSourceId) {queryParams.set('dataSourceId', params.dataSourceId);}
    if (params.search) {queryParams.set('search', params.search);}
    if (params.status) {queryParams.set('status', params.status);}
    if (params.mode) {queryParams.set('mode', params.mode);}
    if (params.businessUnit) {queryParams.set('businessUnit', params.businessUnit);}
    if (params.framework) {queryParams.set('framework', params.framework);}
    if (params.dateFrom) {queryParams.set('dateFrom', params.dateFrom.toISOString());}
    if (params.dateTo) {queryParams.set('dateTo', params.dateTo.toISOString());}
    if (params.limit) {queryParams.set('limit', params.limit.toString());}
    if (params.offset) {queryParams.set('offset', params.offset.toString());}

    const response = await api.get<{ packets: DecisionPacket[]; total: number }>(`${BASE_URL}/packets?${queryParams}`);
    return response.data as { packets: DecisionPacket[]; total: number };
  },

  async getPacketById(id: string): Promise<DecisionPacket> {
    const response = await api.get<DecisionPacket>(`${BASE_URL}/packets/${id}`);
    return response.data as DecisionPacket;
  },

  async getStats(dataSourceId?: string): Promise<PacketStats> {
    const url = dataSourceId 
      ? `${BASE_URL}/stats?dataSourceId=${dataSourceId}`
      : `${BASE_URL}/stats`;
    const response = await api.get<PacketStats>(url);
    return response.data as PacketStats;
  },

  // Packet generation
  async generatePacket(params: {
    decisionId: string;
    dataSourceId: string;
    title: string;
    mode: DecisionMode;
    businessUnit: string;
    systemsImpacted: string[];
    complianceFrameworks: string[];
    policyPackVersion?: string;
  }): Promise<DecisionPacket> {
    const response = await api.post<DecisionPacket>(`${BASE_URL}/packets/generate`, params);
    return response.data as DecisionPacket;
  },

  // Approval workflow
  async sendToApprovers(
    packetId: string,
    approvers: { userId: string; email: string; name: string; role: string }[],
    message?: string,
    dueDate?: Date
  ): Promise<ApprovalWorkflow> {
    const response = await api.post<ApprovalWorkflow>(`${BASE_URL}/packets/${packetId}/send-to-approvers`, {
      approvers,
      message,
      dueDate: dueDate?.toISOString(),
    });
    return response.data as ApprovalWorkflow;
  },

  async respondToApproval(
    packetId: string,
    responseVal: 'approved' | 'rejected',
    comment?: string
  ): Promise<void> {
    await api.post(`${BASE_URL}/workflows/${packetId}/respond`, { response: responseVal, comment });
  },

  // Attach evidence
  async attachEvidence(
    packetId: string,
    file: File,
    description?: string,
    category: Attachment['category'] = 'evidence'
  ): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {formData.append('description', description);}
    formData.append('category', category);

    const response = await api.post<Attachment>(`${BASE_URL}/packets/${packetId}/attachments`, formData);
    return response.data as Attachment;
  },

  // Lock packet
  async lockPacket(packetId: string): Promise<DecisionPacket> {
    const response = await api.post<DecisionPacket>(`${BASE_URL}/packets/${packetId}/lock`);
    return response.data as DecisionPacket;
  },

  // Break-glass export
  async requestBreakGlassExport(
    packetId: string,
    justification: string,
    urgencyLevel: BreakGlassExport['urgencyLevel']
  ): Promise<BreakGlassExport> {
    const response = await api.post<BreakGlassExport>(`${BASE_URL}/packets/${packetId}/break-glass`, {
      justification,
      urgencyLevel,
    });
    return response.data as BreakGlassExport;
  },

  async approveBreakGlassExport(breakGlassId: string): Promise<BreakGlassExport> {
    const response = await api.post<BreakGlassExport>(`${BASE_URL}/break-glass/${breakGlassId}/approve`);
    return response.data as BreakGlassExport;
  },

  async executeBreakGlassExport(breakGlassId: string): Promise<Blob> {
    const response = await api.get<Blob>(`${BASE_URL}/break-glass/${breakGlassId}/execute`);
    return response.data as Blob;
  },

  // Export
  async exportPacket(packetId: string, format: 'pdf' | 'json' | 'bundle' = 'bundle'): Promise<Blob> {
    const response = await api.get<Blob>(`${BASE_URL}/packets/${packetId}/export?format=${format}`);
    return response.data as Blob;
  },

  // Related decisions
  async getRelatedDecisions(entityType: string, entityId: string): Promise<RelatedDecision[]> {
    const response = await api.get<RelatedDecision[]>(`${BASE_URL}/related/${entityType}/${entityId}`);
    return response.data as RelatedDecision[];
  },
};

export default evidenceVaultApi;
