/**
 * Data Adapter — Multi Source Demo
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports MultiSourceManager, multiSourceManager
 * @module adapters/MultiSourceDemo
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// MULTI-SOURCE DATABASE DEMO
// Proves multi-database connectivity works
// =============================================================================

import { Pool } from 'pg';
import { EventEmitter } from 'events';

import { logger } from '../utils/logger.js';
interface DataSource {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'api' | 'file';
  status: 'connected' | 'disconnected' | 'error';
  query: <T>(sql: string, params?: unknown[]) => Promise<T[]>;
  disconnect: () => Promise<void>;
}

interface RealTimeEvent {
  source: string;
  type: 'insert' | 'update' | 'delete' | 'query';
  table: string;
  data: unknown;
  timestamp: Date;
}

export class MultiSourceManager extends EventEmitter {
  private sources: Map<string, DataSource> = new Map();
  private pollIntervals: Map<string, NodeJS.Timeout> = new Map();

  async addPostgresSource(id: string, name: string, connectionString: string): Promise<void> {
    const pool = new Pool({ connectionString });
    
    // Test connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    const source: DataSource = {
      id,
      name,
      type: 'postgresql',
      status: 'connected',
      query: async <T>(sql: string, params?: unknown[]): Promise<T[]> => {
        const result = await pool.query(sql, params);
        return result.rows as T[];
      },
      disconnect: async () => {
        await pool.end();
      }
    };

    this.sources.set(id, source);
    this.emit('source:connected', { id, name, type: 'postgresql' });
    logger.info(`[MultiSource] Connected to PostgreSQL: ${name}`);
  }

  async addAPISource(id: string, name: string, baseUrl: string, apiKey?: string): Promise<void> {
    const source: DataSource = {
      id,
      name,
      type: 'api',
      status: 'connected',
      query: async <T>(endpoint: string): Promise<T[]> => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
        
        const response = await fetch(`${baseUrl}${endpoint}`, { headers });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json() as Promise<T[]>;
      },
      disconnect: async () => {}
    };

    this.sources.set(id, source);
    this.emit('source:connected', { id, name, type: 'api' });
    logger.info(`[MultiSource] Connected to API: ${name}`);
  }

  async addInMemorySource(id: string, name: string, data: Record<string, unknown[]>): Promise<void> {
    const source: DataSource = {
      id,
      name,
      type: 'file',
      status: 'connected',
      query: async <T>(table: string): Promise<T[]> => {
        return (data[table] || []) as T[];
      },
      disconnect: async () => {}
    };

    this.sources.set(id, source);
    this.emit('source:connected', { id, name, type: 'file' });
    logger.info(`[MultiSource] Connected to In-Memory: ${name}`);
  }

  // Real-time polling for changes
  startPolling(sourceId: string, table: string, intervalMs: number = 5000): void {
    const source = this.sources.get(sourceId);
    if (!source) throw new Error(`Source not found: ${sourceId}`);

    let lastRowCount = 0;
    
    const poll = async () => {
      try {
        const rows = await source.query<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}`);
        const currentCount = rows[0]?.count || 0;
        
        if (currentCount !== lastRowCount) {
          this.emit('data:change', {
            source: sourceId,
            type: currentCount > lastRowCount ? 'insert' : 'delete',
            table,
            data: { previousCount: lastRowCount, currentCount },
            timestamp: new Date()
          } as RealTimeEvent);
          lastRowCount = currentCount;
        }
      } catch (error) {
        logger.error(`[MultiSource] Poll error on ${sourceId}:`, error);
      }
    };

    poll(); // Initial poll
    const interval = setInterval(poll, intervalMs);
    this.pollIntervals.set(`${sourceId}:${table}`, interval);
  }

  stopPolling(sourceId: string, table: string): void {
    const key = `${sourceId}:${table}`;
    const interval = this.pollIntervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.pollIntervals.delete(key);
    }
  }

  async queryAll<T>(sql: string, params?: unknown[]): Promise<Map<string, T[]>> {
    const results = new Map<string, T[]>();
    
    for (const [id, source] of this.sources) {
      if (source.type === 'postgresql' || source.type === 'mysql') {
        try {
          const rows = await source.query<T>(sql, params);
          results.set(id, rows);
        } catch (error) {
          logger.error(`[MultiSource] Query error on ${id}:`, error);
          results.set(id, []);
        }
      }
    }
    
    return results;
  }

  async querySource<T>(sourceId: string, query: string, params?: unknown[]): Promise<T[]> {
    const source = this.sources.get(sourceId);
    if (!source) throw new Error(`Source not found: ${sourceId}`);
    return source.query<T>(query, params);
  }

  getStatus(): { id: string; name: string; type: string; status: string }[] {
    return Array.from(this.sources.values()).map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      status: s.status
    }));
  }

  async disconnectAll(): Promise<void> {
    for (const [, interval] of this.pollIntervals) {
      clearInterval(interval);
    }
    this.pollIntervals.clear();

    for (const [id, source] of this.sources) {
      await source.disconnect();
      this.emit('source:disconnected', { id });
    }
    this.sources.clear();
  }
}

// Singleton instance
export const multiSourceManager = new MultiSourceManager();
