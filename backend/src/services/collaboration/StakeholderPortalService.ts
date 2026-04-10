/**
 * End-User/Stakeholder Collaboration Tools
 * 
 * Secure portals for auditors, regulators, customers, and partners with
 * granular permissions, evidence sharing, and audit trails.
 * 
 * @module services/collaboration/StakeholderPortalService
 */

import { logger } from '../../utils/logger.js';
import { generateId, now, sr_create, sr_get, sr_update, sr_list } from '../enterprise/_base.js';

// =============================================================================
// TYPES
// =============================================================================

export type PortalRole = 'auditor' | 'regulator' | 'customer' | 'partner' | 'internal';
export type AccessLevel = 'view' | 'comment' | 'edit' | 'admin';
export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';

export interface StakeholderPortal {
  id: string;
  name: string;
  description: string;
  type: PortalRole;
  organizationId: string;
  members: PortalMember[];
  evidenceShares: EvidenceShare[];
  tasks: PortalTask[];
  comments: PortalComment[];
  settings: PortalSettings;
  createdAt: string;
  updatedAt: string;
}

export interface PortalMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: PortalRole;
  accessLevel: AccessLevel;
  invitedBy: string;
  invitedAt: string;
  lastAccessAt?: string;
  mfaRequired: boolean;
}

export interface EvidenceShare {
  id: string;
  title: string;
  description: string;
  documentType: 'audit_report' | 'evidence_package' | 'compliance_report' | 'decision_packet' | 'policy' | 'other';
  fileUrl?: string;
  content?: string;
  sharedBy: string;
  sharedAt: string;
  accessControls: { memberId: string; accessLevel: AccessLevel; expiresAt?: string }[];
  downloadCount: number;
  viewCount: number;
  auditTrail: { action: string; userId: string; timestamp: string }[];
}

export interface PortalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  linkedEvidence: string[];
  comments: string[];
}

export interface PortalComment {
  id: string;
  portalId: string;
  parentId?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  linkedEvidenceId?: string;
  linkedTaskId?: string;
  mentions: string[];
}

export interface PortalSettings {
  requireMfa: boolean;
  sessionTimeout: number;
  ipAllowlist: string[];
  watermarkEnabled: boolean;
  downloadEnabled: boolean;
  expirationDate?: string;
  maxMembers: number;
}

// =============================================================================
// SERVICE
// =============================================================================

class StakeholderPortalService {
  private SN = 'StakeholderPortal';

  async createPortal(input: {
    name: string;
    description: string;
    type: PortalRole;
    organizationId: string;
    settings?: Partial<PortalSettings>;
  }): Promise<StakeholderPortal> {
    const portal: StakeholderPortal & { id: string } = {
      id: generateId(),
      name: input.name,
      description: input.description,
      type: input.type,
      organizationId: input.organizationId,
      members: [],
      evidenceShares: [],
      tasks: [],
      comments: [],
      settings: {
        requireMfa: true,
        sessionTimeout: 3600,
        ipAllowlist: [],
        watermarkEnabled: true,
        downloadEnabled: false,
        maxMembers: 50,
        ...input.settings,
      },
      createdAt: now(),
      updatedAt: now(),
    };
    await sr_create(this.SN, 'portal', portal);
    logger.info(`[StakeholderPortal] Portal created: ${portal.id} (${input.type})`);
    return portal;
  }

  async getPortal(portalId: string): Promise<StakeholderPortal | null> {
    return await sr_get<StakeholderPortal>(this.SN, 'portal', portalId) || null;
  }

  async listPortals(organizationId?: string): Promise<StakeholderPortal[]> {
    const results = await sr_list<StakeholderPortal>(this.SN, 'portal');
    if (organizationId) return results.filter((p: any) => p.organizationId === organizationId);
    return results;
  }

  async addMember(portalId: string, member: Omit<PortalMember, 'id'>): Promise<PortalMember | null> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return null;
    if (portal.members.length >= portal.settings.maxMembers) return null;

    const newMember: PortalMember = { id: generateId(), ...member };
    const updated: StakeholderPortal & { id: string } = {
      ...portal,
      id: portalId,
      members: [...portal.members, newMember],
      updatedAt: now(),
    };
    await sr_update(this.SN, 'portal', portalId, updated);
    return newMember;
  }

  async removeMember(portalId: string, memberId: string): Promise<boolean> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return false;
    const updated: StakeholderPortal & { id: string } = {
      ...portal,
      id: portalId,
      members: portal.members.filter(m => m.id !== memberId),
      updatedAt: now(),
    };
    await sr_update(this.SN, 'portal', portalId, updated);
    return true;
  }

  async shareEvidence(portalId: string, evidence: Omit<EvidenceShare, 'id' | 'downloadCount' | 'viewCount' | 'auditTrail'>): Promise<EvidenceShare | null> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return null;

    const share: EvidenceShare = {
      id: generateId(),
      ...evidence,
      downloadCount: 0,
      viewCount: 0,
      auditTrail: [{ action: 'shared', userId: evidence.sharedBy, timestamp: now() }],
    };
    const updated: StakeholderPortal & { id: string } = {
      ...portal,
      id: portalId,
      evidenceShares: [...portal.evidenceShares, share],
      updatedAt: now(),
    };
    await sr_update(this.SN, 'portal', portalId, updated);
    return share;
  }

  async recordEvidenceAccess(portalId: string, evidenceId: string, userId: string, action: 'view' | 'download'): Promise<void> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return;
    const evidence = portal.evidenceShares.find(e => e.id === evidenceId);
    if (!evidence) return;

    if (action === 'view') evidence.viewCount++;
    if (action === 'download') evidence.downloadCount++;
    evidence.auditTrail.push({ action, userId, timestamp: now() });
    const updated: StakeholderPortal & { id: string } = { ...portal, id: portalId, updatedAt: now() };
    await sr_update(this.SN, 'portal', portalId, updated);
  }

  async createTask(portalId: string, task: Omit<PortalTask, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<PortalTask | null> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return null;

    const newTask: PortalTask = {
      id: generateId(),
      ...task,
      createdAt: now(),
      updatedAt: now(),
      comments: [],
    };
    const updated: StakeholderPortal & { id: string } = {
      ...portal,
      id: portalId,
      tasks: [...portal.tasks, newTask],
      updatedAt: now(),
    };
    await sr_update(this.SN, 'portal', portalId, updated);
    return newTask;
  }

  async updateTaskStatus(portalId: string, taskId: string, status: TaskStatus, userId: string): Promise<PortalTask | null> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return null;
    const task = portal.tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.status = status;
    task.updatedAt = now();
    if (status === 'completed') task.completedAt = now();
    const updated: StakeholderPortal & { id: string } = { ...portal, id: portalId, updatedAt: now() };
    await sr_update(this.SN, 'portal', portalId, updated);
    return task;
  }

  async addComment(portalId: string, comment: Omit<PortalComment, 'id' | 'createdAt'>): Promise<PortalComment | null> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return null;

    const newComment: PortalComment = { id: generateId(), ...comment, createdAt: now() };
    const updated: StakeholderPortal & { id: string } = {
      ...portal,
      id: portalId,
      comments: [...portal.comments, newComment],
      updatedAt: now(),
    };
    await sr_update(this.SN, 'portal', portalId, updated);
    return newComment;
  }

  async getPortalActivity(portalId: string, limit = 50): Promise<{ type: string; description: string; userId: string; timestamp: string }[]> {
    const portal = await sr_get<StakeholderPortal>(this.SN, 'portal', portalId);
    if (!portal) return [];

    const activity: { type: string; description: string; userId: string; timestamp: string }[] = [];

    for (const ev of portal.evidenceShares) {
      for (const entry of ev.auditTrail) {
        activity.push({ type: 'evidence', description: `${entry.action} evidence: ${ev.title}`, userId: entry.userId, timestamp: entry.timestamp });
      }
    }
    for (const task of portal.tasks) {
      activity.push({ type: 'task', description: `Task "${task.title}" — ${task.status}`, userId: task.assignedTo, timestamp: task.updatedAt });
    }
    for (const comment of portal.comments) {
      activity.push({ type: 'comment', description: `Comment by ${comment.authorName}`, userId: comment.authorId, timestamp: comment.createdAt });
    }

    return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  }
}

export const stakeholderPortal = new StakeholderPortalService();
export { StakeholderPortalService };
