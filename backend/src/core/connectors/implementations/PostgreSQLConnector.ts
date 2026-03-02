// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - POSTGRESQL CONNECTOR
// Enterprise-grade PostgreSQL database connector
// =============================================================================

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { BaseConnector, ConnectorConfig, SyncOptions, SyncResult, ConnectionStatus } from '../BaseConnector';
import { ServiceHealth } from '../../services/BaseService';
import { getErrorMessage } from '../../../utils/errors.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PostgreSQLConfig extends ConnectorConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  poolSize?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
  schema?: string;
}

export interface QueryOptions {
  timeout?: number;
  transaction?: boolean;
}

export interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
}

// =============================================================================
// POSTGRESQL CONNECTOR
// =============================================================================

export class PostgreSQLConnector extends BaseConnector {
  private pool: Pool | null = null;
  private pgConfig: PostgreSQLConfig;

  constructor(config: PostgreSQLConfig) {
    super({
      ...config,
      name: config.name || 'postgresql',
      version: '1.0.0',
    });
    this.pgConfig = config;
  }

  // ---------------------------------------------------------------------------
  // CONNECTION MANAGEMENT
  // ---------------------------------------------------------------------------

  async connect(): Promise<void> {
    this.logger.info('Connecting to PostgreSQL...', {
      host: this.pgConfig.host,
      database: this.pgConfig.database,
    });

    this.pool = new Pool({
      host: this.pgConfig.host,
      port: this.pgConfig.port,
      database: this.pgConfig.database,
      user: this.pgConfig.username,
      password: this.pgConfig.password,
      ssl: this.pgConfig.ssl,
      max: this.pgConfig.poolSize || 10,
      connectionTimeoutMillis: this.pgConfig.connectionTimeout || 10000,
      idleTimeoutMillis: this.pgConfig.idleTimeout || 30000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      this.logger.error('Pool error', { error: getErrorMessage(err) });
      this.connectionStatus.connected = false;
      this.connectionStatus.lastError = getErrorMessage(err);
    });

    // Test connection
    const connected = await this.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to PostgreSQL');
    }

    this.connectionStatus.connected = true;
    this.connectionStatus.lastConnectedAt = new Date();
    this.logger.info('Connected to PostgreSQL successfully');
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      this.logger.info('Disconnecting from PostgreSQL...');
      await this.pool.end();
      this.pool = null;
      this.connectionStatus.connected = false;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.pool) return false;

    try {
      const start = Date.now();
      const result = await this.pool.query('SELECT 1 as test, version() as version');
      this.connectionStatus.latency = Date.now() - start;
      this.connectionStatus.version = result.rows[0]?.version;
      return true;
    } catch (error: unknown) {
      this.logger.error('Connection test failed', { error: getErrorMessage(error) });
      this.connectionStatus.lastError = getErrorMessage(error);
      return false;
    }
  }

  getCapabilities(): string[] {
    return [
      'query',
      'transaction',
      'schema_discovery',
      'sync',
      'real_time_changes',
      'full_text_search',
      'json_support',
    ];
  }

  // ---------------------------------------------------------------------------
  // QUERY EXECUTION
  // ---------------------------------------------------------------------------

  /**
   * Execute a SQL query
   */
  async query<T extends QueryResultRow = QueryResultRow>(sql: string, params?: any[], options?: QueryOptions): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Not connected to PostgreSQL');
    }

    return this.withMetrics('query', async () => {
      const client = await this.pool!.connect();
      
      try {
        if (options?.timeout) {
          await client.query(`SET statement_timeout = ${options.timeout}`);
        }

        const result = await client.query(sql, params) as QueryResult<T>;
        
        this.incrementCounter('queries', 1);
        this.recordMetric('rows_returned', result.rowCount || 0);
        
        return result;
      } finally {
        client.release();
      }
    });
  }

  /**
   * Execute a query and return first row
   */
  async queryOne<T extends QueryResultRow = QueryResultRow>(sql: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows[0] || null;
  }

  /**
   * Execute a query and return all rows
   */
  async queryAll<T extends QueryResultRow = QueryResultRow>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.query<T>(sql, params);
    return result.rows;
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    if (!this.pool) {
      throw new Error('Not connected to PostgreSQL');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      this.incrementCounter('transactions', 1);
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.incrementCounter('transaction_rollbacks', 1);
      throw error;
    } finally {
      client.release();
    }
  }

  // ---------------------------------------------------------------------------
  // SCHEMA DISCOVERY
  // ---------------------------------------------------------------------------

  /**
   * Get all tables in the database
   */
  async getTables(schema?: string): Promise<TableInfo[]> {
    const schemaFilter = schema || this.pgConfig.schema || 'public';
    
    const result = await this.query<{
      table_name: string;
      table_schema: string;
    }>(`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = $1
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `, [schemaFilter]);

    const tables: TableInfo[] = [];

    for (const row of result.rows) {
      const columns = await this.getColumns(row.table_name, row.table_schema);
      const countResult = await this.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "${row.table_schema}"."${row.table_name}"`
      );
      
      tables.push({
        name: row.table_name,
        schema: row.table_schema,
        rowCount: parseInt(countResult.rows[0]?.count || '0', 10),
        columns,
      });
    }

    return tables;
  }

  /**
   * Get columns for a table
   */
  async getColumns(tableName: string, schema?: string): Promise<ColumnInfo[]> {
    const schemaFilter = schema || this.pgConfig.schema || 'public';
    
    const result = await this.query<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
      is_primary: boolean;
    }>(`
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        COALESCE(pk.is_primary, false) as is_primary
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT kcu.column_name, true as is_primary
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = $1
          AND tc.table_name = $2
      ) pk ON c.column_name = pk.column_name
      WHERE c.table_schema = $1
        AND c.table_name = $2
      ORDER BY c.ordinal_position
    `, [schemaFilter, tableName]);

    return result.rows.map(row => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      defaultValue: row.column_default || undefined,
      isPrimaryKey: row.is_primary,
    }));
  }

  // ---------------------------------------------------------------------------
  // SYNC
  // ---------------------------------------------------------------------------

  async sync(options: SyncOptions): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: Array<{ entity: string; error: string }> = [];
    let entitiesSynced = 0;

    try {
      const tables = options.entities 
        ? await this.getTables().then(t => t.filter(table => options.entities!.includes(table.name)))
        : await this.getTables();

      for (const table of tables) {
        try {
          // Emit sync event for each table
          this.emit('sync:table', {
            table: table.name,
            rowCount: table.rowCount,
            columns: table.columns,
          });
          entitiesSynced++;
        } catch (error: unknown) {
          errors.push({ entity: table.name, error: getErrorMessage(error) });
        }
      }

      return {
        success: errors.length === 0,
        entitiesSynced,
        errors,
        duration: Date.now() - startTime,
      };
    } catch (error: unknown) {
      return {
        success: false,
        entitiesSynced,
        errors: [...errors, { entity: 'database', error: getErrorMessage(error) }],
        duration: Date.now() - startTime,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  async healthCheck(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      if (!this.pool) {
        return {
          status: 'unhealthy',
          lastCheck: new Date(),
          errors: ['Pool not initialized'],
        };
      }

      // Test basic connectivity
      const connected = await this.testConnection();
      if (!connected) {
        return {
          status: 'unhealthy',
          lastCheck: new Date(),
          latency: Date.now() - startTime,
          errors: ['Connection test failed'],
        };
      }

      // Check pool stats
      const poolStats = {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount,
      };

      // Determine health status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (poolStats.waitingCount > 5) {
        status = 'degraded';
      }

      return {
        status,
        lastCheck: new Date(),
        latency: Date.now() - startTime,
        details: {
          version: this.connectionStatus.version,
          pool: poolStats,
          database: this.pgConfig.database,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - startTime,
        errors: [getErrorMessage(error)],
      };
    }
  }

  // ---------------------------------------------------------------------------
  // UTILITY
  // ---------------------------------------------------------------------------

  /**
   * Get the underlying pool (for advanced use)
   */
  getPool(): Pool | null {
    return this.pool;
  }

  /**
   * Get connection status
   */
  getStatus(): ConnectionStatus {
    return {
      ...this.connectionStatus,
      capabilities: this.getCapabilities(),
    };
  }
}

export default PostgreSQLConnector;
