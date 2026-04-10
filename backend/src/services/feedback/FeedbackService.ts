/**
 * Continuous Feedback & Improvement Loop
 * 
 * In-app feedback submission, incident learning capture, improvement roadmap,
 * automated notifications, and feedback analytics.
 * 
 * @module services/feedback/FeedbackService
 */

import { logger } from '../../utils/logger.js';
import { generateId, now, sr_create, sr_get, sr_update, sr_list } from '../enterprise/_base.js';

// =============================================================================
// TYPES
// =============================================================================

export type FeedbackType = 'bug' | 'feature_request' | 'improvement' | 'complaint' | 'praise' | 'question';
export type FeedbackStatus = 'submitted' | 'acknowledged' | 'triaged' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';
export type FeedbackSource = 'in_app' | 'api' | 'email' | 'support_ticket' | 'incident_review' | 'audit_finding';

export interface FeedbackEntry {
  id: string;
  type: FeedbackType;
  source: FeedbackSource;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: FeedbackStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
  votes: number;
  voterIds: string[];
  assignee?: string;
  resolution?: string;
  resolvedAt?: string;
  linkedIncidentId?: string;
  linkedAuditFinding?: string;
  comments: FeedbackComment[];
  statusHistory: { status: FeedbackStatus; changedBy: string; changedAt: string; reason?: string }[];
}

export interface FeedbackComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isInternal: boolean;
}

export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'deferred';
  priority: 'low' | 'medium' | 'high';
  targetDate?: string;
  completedDate?: string;
  linkedFeedbackIds: string[];
  assignee?: string;
  category: string;
  visible: 'public' | 'internal' | 'role_based';
  visibleToRoles: string[];
}

export interface LessonLearned {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  rootCause: string;
  actions: { description: string; assignee: string; status: 'pending' | 'completed'; dueDate: string }[];
  capturedBy: string;
  capturedAt: string;
  tags: string[];
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  byStatus: Record<FeedbackStatus, number>;
  byCategory: Record<string, number>;
  avgResolutionDays: number;
  topVoted: FeedbackEntry[];
  recentTrends: { period: string; count: number; resolvedCount: number }[];
  satisfactionScore: number;
}

// =============================================================================
// SERVICE
// =============================================================================

class FeedbackService {
  private SN = 'Feedback';

  // ---------------------------------------------------------------------------
  // FEEDBACK CRUD
  // ---------------------------------------------------------------------------

  async submitFeedback(input: {
    type: FeedbackType;
    source?: FeedbackSource;
    title: string;
    description: string;
    submittedBy: string;
    category?: string;
    tags?: string[];
    priority?: FeedbackEntry['priority'];
    linkedIncidentId?: string;
    linkedAuditFinding?: string;
  }): Promise<FeedbackEntry> {
    const id = generateId();
    const entry: FeedbackEntry & { id: string } = {
      id,
      type: input.type,
      source: input.source || 'in_app',
      title: input.title,
      description: input.description,
      submittedBy: input.submittedBy,
      submittedAt: now(),
      status: 'submitted',
      priority: input.priority || 'medium',
      category: input.category || 'general',
      tags: input.tags || [],
      votes: 1,
      voterIds: [input.submittedBy],
      linkedIncidentId: input.linkedIncidentId,
      linkedAuditFinding: input.linkedAuditFinding,
      comments: [],
      statusHistory: [{ status: 'submitted', changedBy: input.submittedBy, changedAt: now() }],
    };
    await sr_create(this.SN, 'feedback', entry);
    logger.info(`[Feedback] New feedback: ${id} (${input.type})`);
    return entry;
  }

  async getFeedback(feedbackId: string): Promise<FeedbackEntry | null> {
    return await sr_get<FeedbackEntry>(this.SN, 'feedback', feedbackId) || null;
  }

  async listFeedback(filters?: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    category?: string;
    source?: FeedbackSource;
    query?: string;
    sortBy?: 'votes' | 'recent' | 'priority';
  }): Promise<FeedbackEntry[]> {
    let results = await sr_list<FeedbackEntry>(this.SN, 'feedback');
    if (filters?.type) results = results.filter(f => f.type === filters.type);
    if (filters?.status) results = results.filter(f => f.status === filters.status);
    if (filters?.category) results = results.filter(f => f.category === filters.category);
    if (filters?.source) results = results.filter(f => f.source === filters.source);
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(f => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }

    if (filters?.sortBy === 'votes') results.sort((a, b) => b.votes - a.votes);
    else if (filters?.sortBy === 'priority') {
      const pOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      results.sort((a, b) => (pOrder[a.priority] || 2) - (pOrder[b.priority] || 2));
    }
    else results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return results;
  }

  async updateFeedbackStatus(feedbackId: string, status: FeedbackStatus, userId: string, reason?: string): Promise<FeedbackEntry | null> {
    const entry = await sr_get<FeedbackEntry>(this.SN, 'feedback', feedbackId);
    if (!entry) return null;

    const updated: FeedbackEntry & { id: string } = {
      ...entry,
      id: feedbackId,
      status,
      resolvedAt: status === 'resolved' ? now() : entry.resolvedAt,
      resolution: status === 'resolved' ? reason : entry.resolution,
      statusHistory: [...entry.statusHistory, { status, changedBy: userId, changedAt: now(), reason }],
    };
    await sr_update(this.SN, 'feedback', feedbackId, updated);
    return updated;
  }

  async voteFeedback(feedbackId: string, userId: string): Promise<FeedbackEntry | null> {
    const entry = await sr_get<FeedbackEntry>(this.SN, 'feedback', feedbackId);
    if (!entry) return null;
    if (entry.voterIds.includes(userId)) return entry;

    const updated: FeedbackEntry & { id: string } = {
      ...entry,
      id: feedbackId,
      votes: entry.votes + 1,
      voterIds: [...entry.voterIds, userId],
    };
    await sr_update(this.SN, 'feedback', feedbackId, updated);
    return updated;
  }

  async addComment(feedbackId: string, comment: Omit<FeedbackComment, 'id' | 'createdAt'>): Promise<FeedbackComment | null> {
    const entry = await sr_get<FeedbackEntry>(this.SN, 'feedback', feedbackId);
    if (!entry) return null;

    const newComment: FeedbackComment = { id: generateId(), ...comment, createdAt: now() };
    const updated: FeedbackEntry & { id: string } = {
      ...entry,
      id: feedbackId,
      comments: [...entry.comments, newComment],
    };
    await sr_update(this.SN, 'feedback', feedbackId, updated);
    return newComment;
  }

  // ---------------------------------------------------------------------------
  // IMPROVEMENT ROADMAP
  // ---------------------------------------------------------------------------

  async createImprovement(input: Omit<ImprovementItem, 'id'>): Promise<ImprovementItem> {
    const item: ImprovementItem & { id: string } = { id: generateId(), ...input };
    await sr_create(this.SN, 'improvement', item);
    return item;
  }

  async listImprovements(visibility?: 'public' | 'internal'): Promise<ImprovementItem[]> {
    const results = await sr_list<ImprovementItem>(this.SN, 'improvement');
    if (visibility) return results.filter((i: any) => i.visible === visibility || i.visible === 'public');
    return results;
  }

  async updateImprovementStatus(improvementId: string, status: ImprovementItem['status']): Promise<ImprovementItem | null> {
    const item = await sr_get<ImprovementItem>(this.SN, 'improvement', improvementId);
    if (!item) return null;
    const updated: ImprovementItem & { id: string } = {
      ...item,
      id: improvementId,
      status,
      completedDate: status === 'completed' ? now() : item.completedDate,
    };
    await sr_update(this.SN, 'improvement', improvementId, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // LESSONS LEARNED
  // ---------------------------------------------------------------------------

  async captureLessonLearned(input: Omit<LessonLearned, 'id'>): Promise<LessonLearned> {
    const lesson: LessonLearned & { id: string } = { id: generateId(), ...input };
    await sr_create(this.SN, 'lesson', lesson);
    logger.info(`[Feedback] Lesson learned captured: ${lesson.id}`);
    return lesson;
  }

  async listLessonsLearned(): Promise<LessonLearned[]> {
    const results = await sr_list<LessonLearned>(this.SN, 'lesson');
    return results.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  async getAnalytics(): Promise<FeedbackAnalytics> {
    const all = await sr_list<FeedbackEntry>(this.SN, 'feedback');
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    let totalResolutionMs = 0;
    let resolvedCount = 0;

    for (const f of all) {
      byType[f.type] = (byType[f.type] || 0) + 1;
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;

      if (f.resolvedAt) {
        totalResolutionMs += new Date(f.resolvedAt).getTime() - new Date(f.submittedAt).getTime();
        resolvedCount++;
      }
    }

    const topVoted = [...all].sort((a, b) => b.votes - a.votes).slice(0, 10) as FeedbackEntry[];

    return {
      totalFeedback: all.length,
      byType: byType as Record<FeedbackType, number>,
      byStatus: byStatus as Record<FeedbackStatus, number>,
      byCategory,
      avgResolutionDays: resolvedCount > 0 ? totalResolutionMs / resolvedCount / 86400000 : 0,
      topVoted,
      recentTrends: [],
      satisfactionScore: all.length > 0 ? (all.filter(f => f.type === 'praise').length / all.length) * 100 : 0,
    };
  }
}

export const feedbackService = new FeedbackService();
export { FeedbackService };
