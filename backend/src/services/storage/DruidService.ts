// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DRUID SERVICE - High-Performance Analytics for CendiaChronos & CendiaWitness
// =============================================================================
// Apache Druid handles billions of events with sub-second queries.
// Use this for: Audit logs, Decision history, Metrics, Time-series data
// Do NOT use for: User accounts, Configs, Relational data (use Postgres)
// =============================================================================

import axios, { AxiosInstance } from 'axios';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// Druid connection config
const DRUID_CONFIG = {
  routerUrl: process.env.DRUID_ROUTER_URL || 'http://localhost:8888',
  brokerUrl: process.env.DRUID_BROKER_URL || 'http://localhost:8082',
  coordinatorUrl: process.env.DRUID_COORDINATOR_URL || 'http://localhost:8081',
};

// Data source names (tables in Druid)
export const DRUID_DATASOURCES = {
  AUDIT_EVENTS: 'cendia_audit_events',
  DECISION_HISTORY: 'cendia_decision_history',
  AGENT_METRICS: 'cendia_agent_metrics',
  SYSTEM_TELEMETRY: 'cendia_system_telemetry',
  USER_ACTIVITY: 'cendia_user_activity',
  ALERTS: 'cendia_alerts',
} as const;

// Event types for audit logging
export interface AuditEvent {
  __time: string; // ISO timestamp (required by Druid)
  organization_id: string;
  event_type: string;
  actor_id: string;
  actor_type: 'user' | 'agent' | 'system';
  resource_type: string;
  resource_id: string;
  action: string;
  outcome: 'success' | 'failure' | 'pending';
  risk_score?: number;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Decision history for CendiaChronos
export interface DecisionEvent {
  __time: string;
  organization_id: string;
  session_id: string;
  decision_id: string;
  question: string;
  agents_involved: string[];
  consensus_reached: boolean;
  final_recommendation: string;
  confidence_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  deliberation_time_ms: number;
  user_accepted: boolean | null;
  tags?: string[];
}

// Agent metrics for CendiaPulse
export interface AgentMetric {
  __time: string;
  organization_id: string;
  agent_id: string;
  agent_role: string;
  metric_name: string;
  metric_value: number;
  model_used: string;
  tokens_input: number;
  tokens_output: number;
  latency_ms: number;
}

// System telemetry
export interface SystemTelemetry {
  __time: string;
  host: string;
  service: string;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  request_count: number;
  error_count: number;
  avg_latency_ms: number;
}

// Query result type
export interface DruidQueryResult<T = any> {
  success: boolean;
  data: T[];
  totalRows?: number;
  queryTime?: number;
  error?: string;
}

class DruidService {
  private client: AxiosInstance;
  private isAvailable: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: DRUID_CONFIG.routerUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check availability on startup
    this.checkAvailability();
  }

  /**
   * Check if Druid is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await this.client.get('/status');
      this.isAvailable = response.status === 200;
      logger.info(`[Druid] Service ${this.isAvailable ? 'available' : 'unavailable'}`);
      return this.isAvailable;
    } catch (error) {
      this.isAvailable = false;
      console.warn('[Druid] Service not available, falling back to Postgres');
      return false;
    }
  }

  /**
   * Ingest a single event (for real-time streaming)
   */
  async ingestEvent(
    datasource: string,
    event: Record<string, any>
  ): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('[Druid] Service unavailable, event not ingested');
      return false;
    }

    try {
      // Ensure timestamp is present
      if (!event.__time) {
        event.__time = new Date().toISOString();
      }

      const response = await this.client.post(
        `/druid/v2/sql/task`,
        {
          query: `INSERT INTO "${datasource}" SELECT * FROM TABLE(EXTERN('{"type":"inline","data":"${JSON.stringify(event).replace(/"/g, '\\"')}"}', '{"type":"json"}'))`,
          context: {
            sqlInsertSegmentGranularity: 'HOUR',
          },
        }
      );

      return response.status === 200;
    } catch (error: unknown) {
      console.error('[Druid] Ingest error:', getErrorMessage(error));
      return false;
    }
  }

  /**
   * Batch ingest multiple events
   */
  async ingestBatch(
    datasource: string,
    events: Record<string, any>[]
  ): Promise<{ success: number; failed: number }> {
    if (!this.isAvailable) {
      return { success: 0, failed: events.length };
    }

    let success = 0;
    let failed = 0;

    // Process in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < events.length; i += chunkSize) {
      const chunk = events.slice(i, i + chunkSize);
      
      try {
        const ndjson = chunk
          .map(e => ({ ...e, __time: e.__time || new Date().toISOString() }))
          .map(e => JSON.stringify(e))
          .join('\n');

        await this.client.post(`/druid/v2/sql/task`, {
          query: `INSERT INTO "${datasource}" SELECT * FROM TABLE(EXTERN('{"type":"inline","data":"${ndjson.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}', '{"type":"json"}', '{"type":"string"}'))`,
          context: {
            sqlInsertSegmentGranularity: 'HOUR',
          },
        });

        success += chunk.length;
      } catch (error) {
        failed += chunk.length;
      }
    }

    return { success, failed };
  }

  /**
   * Execute a SQL query against Druid
   */
  async query<T = any>(sql: string, parameters?: any[]): Promise<DruidQueryResult<T>> {
    if (!this.isAvailable) {
      return { success: false, data: [], error: 'Druid service unavailable' };
    }

    const startTime = Date.now();

    try {
      const response = await this.client.post('/druid/v2/sql', {
        query: sql,
        parameters: parameters || [],
        resultFormat: 'objectLines',
      });

      const queryTime = Date.now() - startTime;

      return {
        success: true,
        data: response.data,
        totalRows: response.data.length,
        queryTime,
      };
    } catch (error: unknown) {
      console.error('[Druid] Query error:', getErrorMessage(error));
      return {
        success: false,
        data: [],
        error: getErrorMessage(error),
      };
    }
  }

  // ===========================================================================
  // CENDIA-SPECIFIC QUERY METHODS
  // ===========================================================================

  /**
   * Log an audit event (CendiaWitness)
   */
  async logAuditEvent(event: Omit<AuditEvent, '__time'>): Promise<boolean> {
    return this.ingestEvent(DRUID_DATASOURCES.AUDIT_EVENTS, {
      ...event,
      __time: new Date().toISOString(),
    });
  }

  /**
   * Log a decision (CendiaChronos)
   */
  async logDecision(decision: Omit<DecisionEvent, '__time'>): Promise<boolean> {
    return this.ingestEvent(DRUID_DATASOURCES.DECISION_HISTORY, {
      ...decision,
      __time: new Date().toISOString(),
    });
  }

  /**
   * Log agent metrics (CendiaPulse)
   */
  async logAgentMetric(metric: Omit<AgentMetric, '__time'>): Promise<boolean> {
    return this.ingestEvent(DRUID_DATASOURCES.AGENT_METRICS, {
      ...metric,
      __time: new Date().toISOString(),
    });
  }

  /**
   * Get decision history for time travel (CendiaChronos)
   */
  async getDecisionHistory(
    organizationId: string,
    options: {
      startTime?: Date;
      endTime?: Date;
      limit?: number;
      riskLevel?: string;
    } = {}
  ): Promise<DruidQueryResult<DecisionEvent>> {
    const { startTime, endTime, limit = 100, riskLevel } = options;

    let sql = `
      SELECT *
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = '${organizationId}'
    `;

    if (startTime) {
      sql += ` AND __time >= TIMESTAMP '${startTime.toISOString()}'`;
    }
    if (endTime) {
      sql += ` AND __time <= TIMESTAMP '${endTime.toISOString()}'`;
    }
    if (riskLevel) {
      sql += ` AND risk_level = '${riskLevel}'`;
    }

    sql += ` ORDER BY __time DESC LIMIT ${limit}`;

    return this.query<DecisionEvent>(sql);
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
  ): Promise<DruidQueryResult<AuditEvent>> {
    const { resourceType, resourceId, actorId, startTime, endTime, limit = 100 } = options;

    let sql = `
      SELECT *
      FROM "${DRUID_DATASOURCES.AUDIT_EVENTS}"
      WHERE organization_id = '${organizationId}'
    `;

    if (resourceType) sql += ` AND resource_type = '${resourceType}'`;
    if (resourceId) sql += ` AND resource_id = '${resourceId}'`;
    if (actorId) sql += ` AND actor_id = '${actorId}'`;
    if (startTime) sql += ` AND __time >= TIMESTAMP '${startTime.toISOString()}'`;
    if (endTime) sql += ` AND __time <= TIMESTAMP '${endTime.toISOString()}'`;

    sql += ` ORDER BY __time DESC LIMIT ${limit}`;

    return this.query<AuditEvent>(sql);
  }

  /**
   * Get agent performance metrics (CendiaPulse)
   */
  async getAgentMetrics(
    organizationId: string,
    options: {
      agentId?: string;
      granularity?: 'minute' | 'hour' | 'day';
      startTime?: Date;
      endTime?: Date;
    } = {}
  ): Promise<DruidQueryResult<any>> {
    const { agentId, granularity = 'hour', startTime, endTime } = options;

    const timeFloor = granularity === 'minute' ? 'PT1M' 
      : granularity === 'hour' ? 'PT1H' 
      : 'P1D';

    let sql = `
      SELECT 
        TIME_FLOOR(__time, '${timeFloor}') as time_bucket,
        agent_id,
        agent_role,
        COUNT(*) as total_calls,
        AVG(latency_ms) as avg_latency,
        SUM(tokens_input) as total_tokens_in,
        SUM(tokens_output) as total_tokens_out,
        AVG(metric_value) as avg_metric_value
      FROM "${DRUID_DATASOURCES.AGENT_METRICS}"
      WHERE organization_id = '${organizationId}'
    `;

    if (agentId) sql += ` AND agent_id = '${agentId}'`;
    if (startTime) sql += ` AND __time >= TIMESTAMP '${startTime.toISOString()}'`;
    if (endTime) sql += ` AND __time <= TIMESTAMP '${endTime.toISOString()}'`;

    sql += ` GROUP BY 1, 2, 3 ORDER BY time_bucket DESC`;

    return this.query(sql);
  }

  /**
   * Get risk trend over time
   */
  async getRiskTrend(
    organizationId: string,
    days: number = 30
  ): Promise<DruidQueryResult<any>> {
    const sql = `
      SELECT 
        TIME_FLOOR(__time, 'P1D') as date,
        risk_level,
        COUNT(*) as count,
        AVG(confidence_score) as avg_confidence
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = '${organizationId}'
        AND __time >= CURRENT_TIMESTAMP - INTERVAL '${days}' DAY
      GROUP BY 1, 2
      ORDER BY date DESC
    `;

    return this.query(sql);
  }

  /**
   * Get system health summary
   */
  async getSystemHealth(): Promise<DruidQueryResult<any>> {
    const sql = `
      SELECT 
        service,
        AVG(cpu_percent) as avg_cpu,
        AVG(memory_percent) as avg_memory,
        SUM(request_count) as total_requests,
        SUM(error_count) as total_errors,
        AVG(avg_latency_ms) as avg_latency
      FROM "${DRUID_DATASOURCES.SYSTEM_TELEMETRY}"
      WHERE __time >= CURRENT_TIMESTAMP - INTERVAL '1' HOUR
      GROUP BY service
    `;

    return this.query(sql);
  }
}

// Singleton instance
export const druidService = new DruidService();

export default druidService;
