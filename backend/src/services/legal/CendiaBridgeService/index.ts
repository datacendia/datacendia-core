// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface Connector { id: string; name: string; type: string; status: string; config: any; createdAt: string }
interface IngestJob { id: string; connectorId: string; status: string; itemsProcessed: number; startedAt: string; completedAt?: string }
interface BridgeItem { id: string; connectorId: string; title: string; type: string; content: string; metadata: any; ingestedAt: string }

const CONNECTOR_TYPES = ['westlaw', 'lexisnexis', 'courtlistener', 'cap', 'pacer', 'sec-edgar', 'custom-api', 'file-upload'];

class CendiaBridgeServiceImpl {
  private connectors = new Map<string, Connector>();
  private jobs = new Map<string, IngestJob>();
  private items = new Map<string, BridgeItem>();

  async registerConnector(params: any): Promise<Connector> {
    const c: Connector = { id: crypto.randomUUID(), name: params.name || 'Unnamed', type: params.type || 'custom-api', status: 'disconnected', config: params.config || {}, createdAt: new Date().toISOString() };
    this.connectors.set(c.id, c);
    return c;
  }

  async connect(connectorId: string) {
    const c = this.connectors.get(connectorId);
    if (!c) throw new Error('Connector not found');
    c.status = 'connected';
    return c;
  }

  async disconnect(connectorId: string) {
    const c = this.connectors.get(connectorId);
    if (!c) throw new Error('Connector not found');
    c.status = 'disconnected';
  }

  getConnector(id: string) { return this.connectors.get(id) || null; }

  listConnectors(filters?: { type?: string; status?: string }) {
    let list = [...this.connectors.values()];
    if (filters?.type) list = list.filter(c => c.type === filters.type);
    if (filters?.status) list = list.filter(c => c.status === filters.status);
    return list;
  }

  getConnectorTypes() { return CONNECTOR_TYPES.map(t => ({ id: t, name: t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), category: 'legal-data' })); }

  async startIngestJob(params: any): Promise<IngestJob> {
    const job: IngestJob = { id: crypto.randomUUID(), connectorId: params.connectorId, status: 'running', itemsProcessed: 0, startedAt: new Date().toISOString() };
    this.jobs.set(job.id, job);
    // Simulate completion
    setTimeout(() => { job.status = 'completed'; job.itemsProcessed = Math.floor(Math.random() * 50) + 1; job.completedAt = new Date().toISOString(); }, 2000);
    return job;
  }

  getJob(id: string) { return this.jobs.get(id) || null; }

  listJobs(filters?: { connectorId?: string; status?: string }) {
    let list = [...this.jobs.values()];
    if (filters?.connectorId) list = list.filter(j => j.connectorId === filters.connectorId);
    if (filters?.status) list = list.filter(j => j.status === filters.status);
    return list;
  }

  getItem(id: string) { return this.items.get(id) || null; }

  searchItems(params: { query?: string; connectorId?: string; limit?: number }) {
    let list = [...this.items.values()];
    if (params.connectorId) list = list.filter(i => i.connectorId === params.connectorId);
    if (params.query) { const q = params.query.toLowerCase(); list = list.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)); }
    return list.slice(0, params.limit || 50);
  }

  getStatistics() {
    return { connectors: this.connectors.size, connected: [...this.connectors.values()].filter(c => c.status === 'connected').length, jobs: this.jobs.size, items: this.items.size };
  }
}

export const cendiaBridgeService = new CendiaBridgeServiceImpl();
