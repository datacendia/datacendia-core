// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CLICKHOUSE SERVICE - Fast SQL Analytics (Alternative to Druid)
// =============================================================================
// Single-binary analytics store with full SQL support.
// Use for: Ad-hoc queries, standard SQL, lower resource footprint
// AnalyticsRouter automatically selects between Druid and ClickHouse
// =============================================================================

import { createClient, ClickHouseClient } from '@clickhouse/client';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// ClickHouse connection config
const CLICKHOUSE_CONFIG = {
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'datacendia',
  password: process.env.CLICKHOUSE_PASSWORD || 'datacendia_secure_2024',
  database: process.env.CLICKHOUSE_DB || 'datacendia',
};

// Table names (equivalent to Druid datasources)
export const CLICKHOUSE_TABLES = {
  AUDIT_EVENTS: 'audit_events',
  DECISION_HISTORY: 'decision_history',
  AGENT_METRICS: 'agent_metrics',
  SYSTEM_TELEMETRY: 'system_telemetry',
  USER_ACTIVITY: 'user_activity',
  ALERTS: 'alerts',
} as const;

// Query result type
export interface ClickHouseQueryResult<T = any> {
  success: boolean;
  data: T[];
  totalRows?: number;
  queryTime?: number;
  error?: string;
}

class ClickHouseService {
  private client: ClickHouseClient | null = null;
  private isAvailable: boolean = false;

  constructor() {
    this.initializeClient();
  }

  /**
   * Initialize ClickHouse client
   */
  private async initializeClient(): Promise<void> {
    try {
      this.client = createClient({
        host: CLICKHOUSE_CONFIG.host,
        username: CLICKHOUSE_CONFIG.username,
        password: CLICKHOUSE_CONFIG.password,
        database: CLICKHOUSE_CONFIG.database,
      });
      await this.checkAvailability();
    } catch (error: unknown) {
      console.warn('[ClickHouse] Failed to initialize:', getErrorMessage(error));
      this.isAvailable = false;
    }
  }

  /**
   * Check if ClickHouse is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      if (!this.client) {
        await this.initializeClient();
      }
      
      const result = await this.client!.ping();
      this.isAvailable = result.success;
      logger.info(`[ClickHouse] Service ${this.isAvailable ? 'available' : 'unavailable'}`);
      return this.isAvailable;
    } catch (error) {
      this.isAvailable = false;
      console.warn('[ClickHouse] Service not available');
      return false;
    }
  }

  /**
   * Execute a SQL query
   */
  async query<T = any>(sql: string, params?: Record<string, any>): Promise<ClickHouseQueryResult<T>> {
    if (!this.isAvailable || !this.client) {
      return { success: false, data: [], error: 'ClickHouse service unavailable' };
    }

    const startTime = Date.now();

    try {
      const result = await this.client.query({
        query: sql,
        query_params: params,
        format: 'JSONEachRow',
      });

      const data = await result.json() as T[];
      const queryTime = Date.now() - startTime;

      return {
        success: true,
        data,
        totalRows: data.length,
        queryTime,
      };
    } catch (error: unknown) {
      console.error('[ClickHouse] Query error:', getErrorMessage(error));
      return {
        success: false,
        data: [],
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Insert data
   */
  async insert<T extends Record<string, any>>(
    table: string,
    data: T[]
  ): Promise<{ success: number; failed: number }> {
    if (!this.isAvailable || !this.client) {
      return { success: 0, failed: data.length };
    }

    try {
      await this.client.insert({
        table,
        values: data,
        format: 'JSONEachRow',
      });

      return { success: data.length, failed: 0 };
    } catch (error: unknown) {
      console.error('[ClickHouse] Insert error:', getErrorMessage(error));
      return { success: 0, failed: data.length };
    }
  }

  /**
   * Initialize tables (create if not exist)
   */
  async initializeTables(): Promise<void> {
    if (!this.isAvailable || !this.client) return;

    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_TABLES.AUDIT_EVENTS} (
        timestamp DateTime64(3),
        organization_id String,
        event_type String,
        actor_id String,
        actor_type Enum8('user' = 1, 'agent' = 2, 'system' = 3),
        resource_type String,
        resource_id String,
        action String,
        outcome Enum8('success' = 1, 'failure' = 2, 'pending' = 3),
        risk_score Float32,
        details String,
        ip_address String,
        user_agent String
      ) ENGINE = MergeTree()
      ORDER BY (organization_id, timestamp)
      PARTITION BY toYYYYMM(timestamp)`,

      `CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_TABLES.DECISION_HISTORY} (
        timestamp DateTime64(3),
        organization_id String,
        session_id String,
        decision_id String,
        question String,
        agents_involved Array(String),
        consensus_reached UInt8,
        final_recommendation String,
        confidence_score Float32,
        risk_level Enum8('low' = 1, 'medium' = 2, 'high' = 3, 'critical' = 4),
        deliberation_time_ms UInt32,
        user_accepted UInt8,
        tags Array(String)
      ) ENGINE = MergeTree()
      ORDER BY (organization_id, timestamp)
      PARTITION BY toYYYYMM(timestamp)`,

      `CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_TABLES.AGENT_METRICS} (
        timestamp DateTime64(3),
        organization_id String,
        agent_id String,
        agent_role String,
        metric_name String,
        metric_value Float64,
        model_used String,
        tokens_input UInt32,
        tokens_output UInt32,
        latency_ms UInt32
      ) ENGINE = MergeTree()
      ORDER BY (organization_id, agent_id, timestamp)
      PARTITION BY toYYYYMM(timestamp)`,

      `CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_TABLES.SYSTEM_TELEMETRY} (
        timestamp DateTime64(3),
        host String,
        service String,
        cpu_percent Float32,
        memory_percent Float32,
        disk_percent Float32,
        request_count UInt32,
        error_count UInt32,
        avg_latency_ms Float32
      ) ENGINE = MergeTree()
      ORDER BY (service, timestamp)
      PARTITION BY toYYYYMM(timestamp)`,
    ];

    for (const query of createTableQueries) {
      try {
        await this.client.command({ query });
      } catch (error: unknown) {
        console.error('[ClickHouse] Table creation error:', getErrorMessage(error));
      }
    }

    logger.info('[ClickHouse] Tables initialized');
  }

  // ===========================================================================
  // CENDIA-SPECIFIC QUERY METHODS (Mirror DruidService API)
  // ===========================================================================

  /**
   * Get decision history (CendiaChronos)
   */
  async getDecisionHistory(
    organizationId: string,
    options: {
      startTime?: Date;
      endTime?: Date;
      limit?: number;
      riskLevel?: string;
    } = {}
  ): Promise<ClickHouseQueryResult<any>> {
    const { startTime, endTime, limit = 100, riskLevel } = options;

    let sql = `
      SELECT *
      FROM ${CLICKHOUSE_TABLES.DECISION_HISTORY}
      WHERE organization_id = {orgId:String}
    `;

    const params: Record<string, any> = { orgId: organizationId };

    if (startTime) {
      sql += ` AND timestamp >= {startTime:DateTime64(3)}`;
      params.startTime = startTime.toISOString();
    }
    if (endTime) {
      sql += ` AND timestamp <= {endTime:DateTime64(3)}`;
      params.endTime = endTime.toISOString();
    }
    if (riskLevel) {
      sql += ` AND risk_level = {riskLevel:String}`;
      params.riskLevel = riskLevel;
    }

    sql += ` ORDER BY timestamp DESC LIMIT {limit:UInt32}`;
    params.limit = limit;

    return this.query(sql, params);
  }

  /**
   * Get audit trail (CendiaWitness)
   */
  async getAuditTrail(
    organizationId: string,
    options: {
      resourceType?: string;
      resourceId?: string;
      actorId?: string;
      startTime?: Date;
      endTime?: Date;
      limit?: number;
    } = {}
  ): Promise<ClickHouseQueryResult<any>> {
    const { resourceType, resourceId, actorId, startTime, endTime, limit = 100 } = options;

    let sql = `
      SELECT *
      FROM ${CLICKHOUSE_TABLES.AUDIT_EVENTS}
      WHERE organization_id = {orgId:String}
    `;

    const params: Record<string, any> = { orgId: organizationId };

    if (resourceType) {
      sql += ` AND resource_type = {resourceType:String}`;
      params.resourceType = resourceType;
    }
    if (resourceId) {
      sql += ` AND resource_id = {resourceId:String}`;
      params.resourceId = resourceId;
    }
    if (actorId) {
      sql += ` AND actor_id = {actorId:String}`;
      params.actorId = actorId;
    }
    if (startTime) {
      sql += ` AND timestamp >= {startTime:DateTime64(3)}`;
      params.startTime = startTime.toISOString();
    }
    if (endTime) {
      sql += ` AND timestamp <= {endTime:DateTime64(3)}`;
      params.endTime = endTime.toISOString();
    }

    sql += ` ORDER BY timestamp DESC LIMIT {limit:UInt32}`;
    params.limit = limit;

    return this.query(sql, params);
  }

  /**
   * Get agent metrics (CendiaPulse)
   */
  async getAgentMetrics(
    organizationId: string,
    options: {
      agentId?: string;
      granularity?: 'minute' | 'hour' | 'day';
      startTime?: Date;
      endTime?: Date;
    } = {}
  ): Promise<ClickHouseQueryResult<any>> {
    const { agentId, granularity = 'hour', startTime, endTime } = options;

    const timeFunc = granularity === 'minute' ? 'toStartOfMinute'
      : granularity === 'hour' ? 'toStartOfHour'
      : 'toStartOfDay';

    let sql = `
      SELECT 
        ${timeFunc}(timestamp) as time_bucket,
        agent_id,
        agent_role,
        count() as total_calls,
        avg(latency_ms) as avg_latency,
        sum(tokens_input) as total_tokens_in,
        sum(tokens_output) as total_tokens_out,
        avg(metric_value) as avg_metric_value
      FROM ${CLICKHOUSE_TABLES.AGENT_METRICS}
      WHERE organization_id = {orgId:String}
    `;

    const params: Record<string, any> = { orgId: organizationId };

    if (agentId) {
      sql += ` AND agent_id = {agentId:String}`;
      params.agentId = agentId;
    }
    if (startTime) {
      sql += ` AND timestamp >= {startTime:DateTime64(3)}`;
      params.startTime = startTime.toISOString();
    }
    if (endTime) {
      sql += ` AND timestamp <= {endTime:DateTime64(3)}`;
      params.endTime = endTime.toISOString();
    }

    sql += ` GROUP BY time_bucket, agent_id, agent_role ORDER BY time_bucket DESC`;

    return this.query(sql, params);
  }

  /**
   * Get system health summary
   */
  async getSystemHealth(): Promise<ClickHouseQueryResult<any>> {
    const sql = `
      SELECT 
        service,
        avg(cpu_percent) as avg_cpu,
        avg(memory_percent) as avg_memory,
        sum(request_count) as total_requests,
        sum(error_count) as total_errors,
        avg(avg_latency_ms) as avg_latency
      FROM ${CLICKHOUSE_TABLES.SYSTEM_TELEMETRY}
      WHERE timestamp >= now() - INTERVAL 1 HOUR
      GROUP BY service
    `;

    return this.query(sql);
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.isAvailable = false;
    }
  }
}

// Singleton instance
export const clickhouseService = new ClickHouseService();

export default clickhouseService;
