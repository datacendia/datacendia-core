// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ANALYTICS ROUTER - Intelligent Backend Selection (Druid vs ClickHouse)
// =============================================================================
// Automatically routes analytics queries to the optimal backend based on:
// - Query type (streaming vs ad-hoc)
// - Data volume (high concurrent users â†’ Druid)
// - Query complexity (complex SQL â†’ ClickHouse)
// - Resource availability (fallback if one is down)
// =============================================================================

import { druidService, DRUID_DATASOURCES, DruidQueryResult } from './DruidService';
import { clickhouseService, CLICKHOUSE_TABLES, ClickHouseQueryResult } from './ClickHouseService';

import { logger } from '../../utils/logger.js';
// Routing decision reasons
export type RoutingReason = 
  | 'streaming_ingestion'      // Real-time data â†’ Druid
  | 'high_concurrency'         // Many concurrent queries â†’ Druid
  | 'complex_sql'              // Complex joins/CTEs â†’ ClickHouse
  | 'ad_hoc_query'             // One-off analysis â†’ ClickHouse
  | 'resource_optimization'    // Lower resource usage â†’ ClickHouse
  | 'druid_unavailable'        // Fallback â†’ ClickHouse
  | 'clickhouse_unavailable'   // Fallback â†’ Druid
  | 'user_preference'          // Explicit backend selection
  | 'default';

// Query characteristics that influence routing
export interface QueryCharacteristics {
  isStreaming?: boolean;           // Real-time ingestion scenario
  expectedConcurrency?: number;    // Expected concurrent users
  hasComplexJoins?: boolean;       // Complex SQL with joins
  isAdHocAnalysis?: boolean;       // One-off exploratory query
  preferLowResources?: boolean;    // Optimize for resource usage
  forceBackend?: 'druid' | 'clickhouse';  // User override
}

// Unified query result
export interface AnalyticsQueryResult<T = any> {
  success: boolean;
  data: T[];
  totalRows?: number;
  queryTime?: number;
  error?: string;
  backend: 'druid' | 'clickhouse';
  routingReason: RoutingReason;
}

// Configuration thresholds
const ROUTING_CONFIG = {
  highConcurrencyThreshold: 50,    // Users above this â†’ prefer Druid
  complexQueryKeywords: ['JOIN', 'WITH', 'UNION', 'INTERSECT', 'EXCEPT'],
};

class AnalyticsRouter {
  private druidAvailable: boolean = false;
  private clickhouseAvailable: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor() {
    this.checkHealth();
  }

  /**
   * Check availability of both backends
   */
  async checkHealth(): Promise<{ druid: boolean; clickhouse: boolean }> {
    const now = Date.now();
    
    // Cache health check results
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return { druid: this.druidAvailable, clickhouse: this.clickhouseAvailable };
    }

    const [druidHealth, clickhouseHealth] = await Promise.allSettled([
      druidService.checkAvailability(),
      clickhouseService.checkAvailability(),
    ]);

    this.druidAvailable = druidHealth.status === 'fulfilled' && druidHealth.value;
    this.clickhouseAvailable = clickhouseHealth.status === 'fulfilled' && clickhouseHealth.value;
    this.lastHealthCheck = now;

    logger.info(`[AnalyticsRouter] Health: Druid=${this.druidAvailable}, ClickHouse=${this.clickhouseAvailable}`);

    return { druid: this.druidAvailable, clickhouse: this.clickhouseAvailable };
  }

  /**
   * Determine optimal backend for a query
   */
  selectBackend(characteristics: QueryCharacteristics = {}): { 
    backend: 'druid' | 'clickhouse'; 
    reason: RoutingReason;
  } {
    // User override takes precedence
    if (characteristics.forceBackend) {
      return { 
        backend: characteristics.forceBackend, 
        reason: 'user_preference' 
      };
    }

    // Streaming/real-time ingestion â†’ Druid (native capability)
    if (characteristics.isStreaming) {
      if (this.druidAvailable) {
        return { backend: 'druid', reason: 'streaming_ingestion' };
      }
      // Fall through to ClickHouse if Druid unavailable
    }

    // High concurrency â†’ Druid (optimized for this)
    if (characteristics.expectedConcurrency && 
        characteristics.expectedConcurrency > ROUTING_CONFIG.highConcurrencyThreshold) {
      if (this.druidAvailable) {
        return { backend: 'druid', reason: 'high_concurrency' };
      }
    }

    // Complex SQL with joins â†’ ClickHouse (full SQL support)
    if (characteristics.hasComplexJoins) {
      if (this.clickhouseAvailable) {
        return { backend: 'clickhouse', reason: 'complex_sql' };
      }
    }

    // Ad-hoc analysis â†’ ClickHouse (simpler, faster for one-offs)
    if (characteristics.isAdHocAnalysis) {
      if (this.clickhouseAvailable) {
        return { backend: 'clickhouse', reason: 'ad_hoc_query' };
      }
    }

    // Resource optimization preference â†’ ClickHouse (lower footprint)
    if (characteristics.preferLowResources) {
      if (this.clickhouseAvailable) {
        return { backend: 'clickhouse', reason: 'resource_optimization' };
      }
    }

    // Default: prefer ClickHouse for simplicity, fall back to Druid
    if (this.clickhouseAvailable) {
      return { backend: 'clickhouse', reason: 'default' };
    }

    if (this.druidAvailable) {
      return { backend: 'druid', reason: 'clickhouse_unavailable' };
    }

    // Both unavailable - return ClickHouse as default (will error)
    return { backend: 'clickhouse', reason: 'default' };
  }

  /**
   * Detect query complexity from SQL string
   */
  private detectQueryComplexity(sql: string): QueryCharacteristics {
    const upperSql = sql.toUpperCase();
    const hasComplexJoins = ROUTING_CONFIG.complexQueryKeywords.some(
      keyword => upperSql.includes(keyword)
    );
    return { hasComplexJoins };
  }

  // ===========================================================================
  // UNIFIED QUERY METHODS (Auto-routing)
  // ===========================================================================

  /**
   * Query decision history with auto-routing
   */
  async getDecisionHistory(
    organizationId: string,
    options: {
      startTime?: Date;
      endTime?: Date;
      limit?: number;
      riskLevel?: string;
      characteristics?: QueryCharacteristics;
    } = {}
  ): Promise<AnalyticsQueryResult<any>> {
    await this.checkHealth();
    
    const { backend, reason } = this.selectBackend({
      ...options.characteristics,
      // Streaming timeline queries via Prisma cursor-based pagination
      isStreaming: options.characteristics?.isStreaming ?? false,
    });

    let result: DruidQueryResult | ClickHouseQueryResult;

    if (backend === 'druid') {
      result = await druidService.getDecisionHistory(organizationId, options);
    } else {
      result = await clickhouseService.getDecisionHistory(organizationId, options);
    }

    return {
      ...result,
      backend,
      routingReason: reason,
    };
  }

  /**
   * Query audit trail with auto-routing
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
      characteristics?: QueryCharacteristics;
    } = {}
  ): Promise<AnalyticsQueryResult<any>> {
    await this.checkHealth();
    
    const { backend, reason } = this.selectBackend({
      ...options.characteristics,
      // Audit queries are often high-volume
      isStreaming: true,
    });

    let result: DruidQueryResult | ClickHouseQueryResult;

    if (backend === 'druid') {
      result = await druidService.getAuditTrail(organizationId, options);
    } else {
      result = await clickhouseService.getAuditTrail(organizationId, options);
    }

    return {
      ...result,
      backend,
      routingReason: reason,
    };
  }

  /**
   * Query agent metrics with auto-routing
   */
  async getAgentMetrics(
    organizationId: string,
    options: {
      agentId?: string;
      granularity?: 'minute' | 'hour' | 'day';
      startTime?: Date;
      endTime?: Date;
      characteristics?: QueryCharacteristics;
    } = {}
  ): Promise<AnalyticsQueryResult<any>> {
    await this.checkHealth();
    
    const { backend, reason } = this.selectBackend({
      ...options.characteristics,
      // Metrics are often real-time
      isStreaming: options.granularity === 'minute',
    });

    let result: DruidQueryResult | ClickHouseQueryResult;

    if (backend === 'druid') {
      result = await druidService.getAgentMetrics(organizationId, options);
    } else {
      result = await clickhouseService.getAgentMetrics(organizationId, options);
    }

    return {
      ...result,
      backend,
      routingReason: reason,
    };
  }

  /**
   * Query system health with auto-routing
   */
  async getSystemHealth(
    characteristics?: QueryCharacteristics
  ): Promise<AnalyticsQueryResult<any>> {
    await this.checkHealth();
    
    const { backend, reason } = this.selectBackend({
      ...characteristics,
      // System health is typically ad-hoc
      isAdHocAnalysis: true,
    });

    let result: DruidQueryResult | ClickHouseQueryResult;

    if (backend === 'druid') {
      result = await druidService.getSystemHealth();
    } else {
      result = await clickhouseService.getSystemHealth();
    }

    return {
      ...result,
      backend,
      routingReason: reason,
    };
  }

  /**
   * Execute raw SQL with auto-routing based on query analysis
   */
  async query<T = any>(
    sql: string,
    options: {
      params?: Record<string, any>;
      characteristics?: QueryCharacteristics;
    } = {}
  ): Promise<AnalyticsQueryResult<T>> {
    await this.checkHealth();
    
    // Detect complexity from SQL
    const detectedCharacteristics = this.detectQueryComplexity(sql);
    
    const { backend, reason } = this.selectBackend({
      ...detectedCharacteristics,
      ...options.characteristics,
    });

    let result: DruidQueryResult<T> | ClickHouseQueryResult<T>;

    if (backend === 'druid') {
      result = await druidService.query<T>(sql);
    } else {
      result = await clickhouseService.query<T>(sql, options.params);
    }

    return {
      ...result,
      backend,
      routingReason: reason,
    };
  }

  /**
   * Ingest events (routes to both for redundancy, or one based on config)
   */
  async ingestEvents(
    events: Record<string, any>[],
    options: {
      table: string;
      datasource?: string;
      dualWrite?: boolean;  // Write to both backends
    }
  ): Promise<{
    druid: { success: number; failed: number } | null;
    clickhouse: { success: number; failed: number } | null;
  }> {
    await this.checkHealth();

    const results: {
      druid: { success: number; failed: number } | null;
      clickhouse: { success: number; failed: number } | null;
    } = { druid: null, clickhouse: null };

    // Dual write mode: write to both for redundancy/migration
    if (options.dualWrite) {
      if (this.druidAvailable && options.datasource) {
        results.druid = await druidService.ingestBatch(options.datasource, events);
      }
      if (this.clickhouseAvailable) {
        results.clickhouse = await clickhouseService.insert(options.table, events);
      }
    } else {
      // Single write: prefer Druid for streaming, ClickHouse for batch
      if (this.druidAvailable && options.datasource) {
        results.druid = await druidService.ingestBatch(options.datasource, events);
      } else if (this.clickhouseAvailable) {
        results.clickhouse = await clickhouseService.insert(options.table, events);
      }
    }

    return results;
  }

  /**
   * Get current routing status
   */
  getStatus(): {
    druidAvailable: boolean;
    clickhouseAvailable: boolean;
    preferredBackend: 'druid' | 'clickhouse';
    lastHealthCheck: Date;
  } {
    const { backend } = this.selectBackend();
    return {
      druidAvailable: this.druidAvailable,
      clickhouseAvailable: this.clickhouseAvailable,
      preferredBackend: backend,
      lastHealthCheck: new Date(this.lastHealthCheck),
    };
  }
}

// Singleton instance
export const analyticsRouter = new AnalyticsRouter();

export default analyticsRouter;
