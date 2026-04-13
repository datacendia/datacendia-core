// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPercentage } from '../../utils/deterministic.js';

class CendiaIngestServiceImpl {
  private jobs = new Map<string, any>();
  private chunks: any[] = [];

  async createIngestJob(orgId: string, userId: string, source: any) {
    const id = `ingest-${crypto.randomUUID().slice(0, 8)}`;
    const job: any = { id, organizationId: orgId, userId, source, status: 'processing', documentsProcessed: 0, chunksCreated: 0, startedAt: new Date().toISOString() };
    this.jobs.set(id, job);
    // Simulate processing
    setTimeout(() => { job.status = 'completed'; job.documentsProcessed = 1; job.chunksCreated = Math.ceil(Math.random() * 20 + 5); job.completedAt = new Date().toISOString(); }, 100);
    return job;
  }

  getJob(id: string) { return this.jobs.get(id) || null; }

  async semanticSearch(orgId: string, query: string, limit: number) {
    const seed = `search-${orgId}-${query.slice(0, 10)}`;
    return Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
      id: `chunk-${i}`, content: `Relevant excerpt for "${query}" (result ${i + 1})`, score: deterministicPercentage(85, 10, `${seed}-${i}`) / 100, source: `document-${i + 1}`, metadata: {}
    }));
  }

  async getJobHistory(orgId: string) { return [...this.jobs.values()].filter(j => j.organizationId === orgId); }

  async getMetrics(orgId: string) {
    const orgJobs = [...this.jobs.values()].filter(j => j.organizationId === orgId);
    return { totalJobs: orgJobs.length, completed: orgJobs.filter(j => j.status === 'completed').length, totalDocuments: orgJobs.reduce((a, j) => a + (j.documentsProcessed || 0), 0), totalChunks: orgJobs.reduce((a, j) => a + (j.chunksCreated || 0), 0) };
  }
}

export const cendiaIngestService = new CendiaIngestServiceImpl();
