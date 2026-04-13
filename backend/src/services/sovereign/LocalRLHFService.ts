// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

class LocalRLHFServiceImpl {
  private feedback: any[] = [];
  private datasets: any[] = [];
  private loraConfigs: any[] = [];

  async recordFeedback(data: any) {
    const record = { id: `fb-${crypto.randomUUID().slice(0, 8)}`, ...data, createdAt: new Date().toISOString() };
    this.feedback.push(record);
    return record;
  }

  getFeedbackRecords(orgId: string, limit: number) {
    return this.feedback.filter(f => !orgId || f.organizationId === orgId).slice(-limit);
  }

  getFeedbackStats(orgId: string) {
    const records = this.getFeedbackRecords(orgId, 10000);
    return { total: records.length, positive: records.filter(r => r.rating > 3).length, negative: records.filter(r => r.rating <= 3).length };
  }

  async generateDataset(data: any) {
    const ds = { id: `ds-${crypto.randomUUID().slice(0, 8)}`, organizationId: data.organizationId, name: data.name || 'dataset', format: data.format || 'jsonl', recordCount: this.feedback.length, createdAt: new Date().toISOString() };
    this.datasets.push(ds);
    return ds;
  }

  getDatasets(orgId: string) { return this.datasets.filter(d => !orgId || d.organizationId === orgId); }

  async createLoraConfig(data: any) {
    const config = { id: `lora-${crypto.randomUUID().slice(0, 8)}`, ...data, status: 'ready', createdAt: new Date().toISOString() };
    this.loraConfigs.push(config);
    return config;
  }

  async generateTrainingScript(loraId: string) {
    return `/tmp/lora-training-${loraId}.sh`;
  }
}

export const localRLHFService = new LocalRLHFServiceImpl();
