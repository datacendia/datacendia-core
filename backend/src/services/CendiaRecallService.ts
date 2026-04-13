// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA RECALL SERVICE — Outcome Tracking & Prediction Accuracy Engine
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicFloat, deterministicBool } from '../utils/deterministic.js';

interface OutcomeTracker {
  id: string;
  organizationId: string;
  decisionId: string;
  title: string;
  predictedOutcomes: Array<{ metric: string; predictedValue: number; unit: string; confidence: number }>;
  actualOutcomes: Array<{ metric: string; actualValue: number; unit: string; recordedAt: string }>;
  actualROI?: number;
  status: 'active' | 'verified' | 'closed';
  trackedBy: string;
  lessonsLearned: string[];
  createdAt: string;
}

interface Lesson {
  id: string;
  organizationId: string;
  trackerId: string;
  content: string;
  category: string;
  impact: string;
  endorsements: string[];
  createdAt: string;
}

class CendiaRecallServiceImpl {
  private trackers = new Map<string, OutcomeTracker>();
  private lessons = new Map<string, Lesson>();

  async getHealth() {
    return { status: 'healthy', trackers: this.trackers.size, lessons: this.lessons.size, uptime: process.uptime() };
  }

  async createOutcomeTracker(orgId: string, decisionId: string, title: string, predictedOutcomes: any[], trackedBy: string, options?: any): Promise<OutcomeTracker> {
    const id = `ot-${crypto.randomUUID().slice(0, 8)}`;
    const tracker: OutcomeTracker = {
      id, organizationId: orgId, decisionId, title,
      predictedOutcomes: predictedOutcomes.map(p => ({
        metric: p.metric || 'unnamed', predictedValue: p.predictedValue || 0,
        unit: p.unit || '', confidence: p.confidence || 0.5,
      })),
      actualOutcomes: [], status: 'active', trackedBy,
      lessonsLearned: [], createdAt: new Date().toISOString(),
    };
    this.trackers.set(id, tracker);
    return tracker;
  }

  async getOutcomes(orgId: string, filters: { status?: string; limit?: number; offset?: number }) {
    let results = [...this.trackers.values()].filter(t => t.organizationId === orgId);
    if (filters.status) results = results.filter(t => t.status === filters.status);
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    return results.slice(offset, offset + limit);
  }

  async getOutcome(id: string): Promise<OutcomeTracker | undefined> { return this.trackers.get(id); }

  async recordActualOutcome(id: string, data: { metric: string; actualValue: number; unit: string; recordedBy: string }) {
    const tracker = this.trackers.get(id);
    if (!tracker) throw new Error(`Tracker ${id} not found`);
    tracker.actualOutcomes.push({ metric: data.metric, actualValue: data.actualValue, unit: data.unit, recordedAt: new Date().toISOString() });
    return tracker;
  }

  async recordActualROI(id: string, actualROI: number) {
    const tracker = this.trackers.get(id);
    if (!tracker) throw new Error(`Tracker ${id} not found`);
    tracker.actualROI = actualROI;
    return tracker;
  }

  async verifyOutcome(id: string, verifiedBy: string) {
    const tracker = this.trackers.get(id);
    if (!tracker) throw new Error(`Tracker ${id} not found`);
    tracker.status = 'verified';
    return tracker;
  }

  async closeOutcome(id: string, lessonsLearned: string[]) {
    const tracker = this.trackers.get(id);
    if (!tracker) throw new Error(`Tracker ${id} not found`);
    tracker.status = 'closed';
    tracker.lessonsLearned = lessonsLearned;
    for (const content of lessonsLearned) {
      const lesson: Lesson = {
        id: `lesson-${crypto.randomUUID().slice(0, 8)}`,
        organizationId: tracker.organizationId, trackerId: id,
        content, category: 'general', impact: 'medium',
        endorsements: [], createdAt: new Date().toISOString(),
      };
      this.lessons.set(lesson.id, lesson);
    }
    return tracker;
  }

  async getPredictionAccuracyReport(orgId: string, period: string) {
    const trackers = [...this.trackers.values()].filter(t => t.organizationId === orgId && t.actualOutcomes.length > 0);
    const accuracies = trackers.map(t => {
      const matched = t.predictedOutcomes.filter(p =>
        t.actualOutcomes.some(a => a.metric === p.metric)
      );
      if (matched.length === 0) return null;
      const avgAccuracy = matched.reduce((sum, p) => {
        const actual = t.actualOutcomes.find(a => a.metric === p.metric);
        if (!actual) return sum;
        const diff = Math.abs(actual.actualValue - p.predictedValue) / Math.max(Math.abs(p.predictedValue), 1);
        return sum + Math.max(0, 1 - diff);
      }, 0) / matched.length;
      return avgAccuracy;
    }).filter(Boolean) as number[];

    return {
      organizationId: orgId, period,
      totalTrackers: trackers.length,
      averageAccuracy: accuracies.length > 0 ? Math.round(accuracies.reduce((s, a) => s + a, 0) / accuracies.length * 10000) / 100 : 0,
      sampleSize: accuracies.length,
      generatedAt: new Date().toISOString(),
    };
  }

  async getLessonsLearned(orgId: string, filters: { category?: string; impact?: string; limit?: number }) {
    let results = [...this.lessons.values()].filter(l => l.organizationId === orgId);
    if (filters.category) results = results.filter(l => l.category === filters.category);
    if (filters.impact) results = results.filter(l => l.impact === filters.impact);
    return results.slice(0, filters.limit || 20);
  }

  async endorseLesson(id: string, endorsedBy: string) {
    const lesson = this.lessons.get(id);
    if (!lesson) throw new Error(`Lesson ${id} not found`);
    lesson.endorsements.push(endorsedBy);
    return lesson;
  }

  async getFeedbackForDecisionType(orgId: string, decisionType: string) {
    const trackers = [...this.trackers.values()].filter(t => t.organizationId === orgId && t.status === 'closed');
    return {
      decisionType, trackerCount: trackers.length,
      lessons: trackers.flatMap(t => t.lessonsLearned).slice(0, 10),
      averageOutcomeCount: trackers.length > 0
        ? Math.round(trackers.reduce((s, t) => s + t.actualOutcomes.length, 0) / trackers.length * 10) / 10
        : 0,
    };
  }
}

export const cendiaRecallService = new CendiaRecallServiceImpl();
