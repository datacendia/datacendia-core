/**
 * Data Adapter — Client Hosted Adapter
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports ClientHostedAdapter
 * @module adapters/ClientHostedAdapter
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CLIENT-HOSTED DATA ADAPTER
// Connects directly to client's database - no data stored on Datacendia
// Supports: PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, IBM DB2
// =============================================================================

import { 
  DataAdapter, 
  ApotheosisDataAdapter, 
  DissentDataAdapter,
  OrganizationDataConfig,
  SchemaMapping 
} from './DataAdapter.js';
import { 
  ApotheosisRun, 
  ApotheosisConfig, 
  ApotheosisScore,
  Escalation,
  PatternBan,
  UpskillAssignment,
  WeaknessItem,
  AutoPatch
} from '../services/CendiaApotheosisService.js';
import {
  Dissent,
  DissentResponse,
  DissenterProfile,
  OrganizationDissentMetrics
} from '../services/CendiaDissentService.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// MONGODB HELPER FUNCTIONS
// =============================================================================

/**
 * Parse SQL WHERE clause to MongoDB filter object
 * Supports: =, >, <, >=, <=, AND, OR, IN, LIKE
 */
function parseWhereToMongoFilter(whereClause: string, params: unknown[]): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  let paramIndex = 0;
  
  // Simple parser for common patterns
  // Handles: column = $1, column > $2, column IN ($3, $4)
  const conditions = whereClause.split(/\s+AND\s+/i);
  
  for (const condition of conditions) {
    const eqMatch = condition.match(/(\w+)\s*=\s*\$(\d+)/i);
    if (eqMatch) {
      const [, column] = eqMatch;
      filter[column] = params[paramIndex++];
      continue;
    }
    
    const gtMatch = condition.match(/(\w+)\s*>\s*\$(\d+)/i);
    if (gtMatch) {
      const [, column] = gtMatch;
      filter[column] = { $gt: params[paramIndex++] };
      continue;
    }
    
    const ltMatch = condition.match(/(\w+)\s*<\s*\$(\d+)/i);
    if (ltMatch) {
      const [, column] = ltMatch;
      filter[column] = { $lt: params[paramIndex++] };
      continue;
    }
    
    const inMatch = condition.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
    if (inMatch) {
      const [, column, valuesStr] = inMatch;
      const valueCount = valuesStr.split(',').length;
      const values = params.slice(paramIndex, paramIndex + valueCount);
      paramIndex += valueCount;
      filter[column] = { $in: values };
      continue;
    }
    
    const likeMatch = condition.match(/(\w+)\s+LIKE\s*\$(\d+)/i);
    if (likeMatch) {
      const [, column] = likeMatch;
      const pattern = String(params[paramIndex++]).replace(/%/g, '.*');
      filter[column] = { $regex: pattern, $options: 'i' };
      continue;
    }
  }
  
  return filter;
}

/**
 * Parse SQL SET clause to MongoDB update object
 * Supports: column = $1, column = $2
 */
function parseSetToMongoUpdate(setClause: string, params: unknown[]): Record<string, unknown> {
  const update: Record<string, unknown> = {};
  let paramIndex = 0;
  
  const assignments = setClause.split(/\s*,\s*/);
  
  for (const assignment of assignments) {
    const match = assignment.match(/(\w+)\s*=\s*\$(\d+)/i);
    if (match) {
      const [, column] = match;
      update[column] = params[paramIndex++];
    }
  }
  
  return update;
}

// =============================================================================
// GENERIC SQL CLIENT INTERFACE
// =============================================================================

interface SQLClient {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }>;
  transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

// =============================================================================
// CLIENT-HOSTED ADAPTER
// =============================================================================

export class ClientHostedAdapter implements DataAdapter {
  readonly type = 'client-hosted' as const;
  readonly organizationId: string;
  
  private config: OrganizationDataConfig;
  private client: SQLClient | null = null;
  private schemaMapping: SchemaMapping;
  
  apotheosis: ApotheosisDataAdapter;
  dissent: DissentDataAdapter;

  constructor(config: OrganizationDataConfig) {
    this.config = config;
    this.organizationId = config.organizationId;
    this.schemaMapping = config.clientDatabase?.schemaMapping || this.defaultSchemaMapping();
    
    this.apotheosis = new ClientHostedApotheosisAdapter(this);
    this.dissent = new ClientHostedDissentAdapter(this);
  }

  async connect(): Promise<void> {
    const dbConfig = this.config.clientDatabase;
    if (!dbConfig) {
      throw new Error('Client database configuration is required');
    }

    switch (dbConfig.type) {
      case 'postgresql':
        this.client = await this.createPostgresClient(dbConfig);
        break;
      case 'mysql':
        this.client = await this.createMySQLClient(dbConfig);
        break;
      case 'sqlserver':
        this.client = await this.createSQLServerClient(dbConfig);
        break;
      case 'oracle':
        this.client = await this.createOracleClient(dbConfig);
        break;
      case 'mongodb':
        this.client = await this.createMongoClient(dbConfig);
        break;
      case 'db2':
        this.client = await this.createDB2Client(dbConfig);
        break;
      default:
        throw new Error(`Unsupported database type: ${dbConfig.type}`);
    }

    logger.info(`[ClientAdapter] Connected to ${dbConfig.type} for org ${this.organizationId}`);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.rawQuery('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async rawQuery<T>(query: string, params?: unknown[]): Promise<T> {
    if (!this.client) {
      throw new Error('Database not connected');
    }
    const results = await this.client.query<T>(query, params);
    return results as T;
  }

  // ===========================================================================
  // INTERNAL HELPERS
  // ===========================================================================

  getClient(): SQLClient {
    if (!this.client) {
      throw new Error('Database not connected');
    }
    return this.client;
  }

  getTableName(datacendiaTable: string): string {
    return this.schemaMapping.tables[datacendiaTable as keyof typeof this.schemaMapping.tables] || datacendiaTable;
  }

  getColumnName(table: string, datacendiaColumn: string): string {
    const tableMapping = this.schemaMapping.columns[table];
    return tableMapping?.[datacendiaColumn] || datacendiaColumn;
  }

  transformToClient(table: string, column: string, value: unknown): unknown {
    const transform = this.schemaMapping.transforms?.[table]?.[column];
    return transform ? transform.toClient(value) : value;
  }

  transformFromClient(table: string, column: string, value: unknown): unknown {
    const transform = this.schemaMapping.transforms?.[table]?.[column];
    return transform ? transform.fromClient(value) : value;
  }

  // ===========================================================================
  // DATABASE CLIENT FACTORIES
  // ===========================================================================

  private async createPostgresClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // Dynamic import to avoid bundling unused drivers
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: config.connectionString,
      host: config.host,
      port: config.port || 5432,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const result = await pool.query(sql, params);
        return result.rows as T[];
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const result = await pool.query(sql, params);
        return { affectedRows: result.rowCount || 0 };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const result = await client.query(sql, params);
              return result.rows as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const result = await client.query(sql, params);
              return { affectedRows: result.rowCount || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await client.query('COMMIT');
          return result;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      },
      async close(): Promise<void> {
        await pool.end();
      },
    };
  }

  private async createMySQLClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    const mysql = await import('mysql2/promise');
    const pool = mysql.createPool({
      host: config.host,
      port: config.port || 3306,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? {} : undefined,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const [rows] = await pool.execute(sql, params);
        return rows as T[];
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const [result] = await pool.execute(sql, params) as unknown as [{ affectedRows: number }];
        return { affectedRows: result.affectedRows };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const [rows] = await connection.execute(sql, params);
              return rows as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const [result] = await connection.execute(sql, params) as unknown as [{ affectedRows: number }];
              return { affectedRows: result.affectedRows };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      },
      async close(): Promise<void> {
        await pool.end();
      },
    };
  }

  private async createSQLServerClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // SQL Server support requires mssql package: npm install mssql
    // @ts-ignore - mssql is an optional dependency
    const sql = await import('mssql').catch(() => { throw new Error('mssql package not installed. Run: npm install mssql'); });
    const pool = await sql.connect({
      server: config.host || 'localhost',
      port: config.port || 1433,
      database: config.database,
      user: config.username,
      password: config.password,
      options: {
        encrypt: config.ssl ?? true,
        trustServerCertificate: true,
      },
    });

    return {
      async query<T>(sqlQuery: string, params?: unknown[]): Promise<T[]> {
        const request = pool.request();
        params?.forEach((p, i) => request.input(`p${i}`, p));
        const result = await request.query(sqlQuery);
        return result.recordset as T[];
      },
      async execute(sqlQuery: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const request = pool.request();
        params?.forEach((p, i) => request.input(`p${i}`, p));
        const result = await request.query(sqlQuery);
        return { affectedRows: result.rowsAffected[0] || 0 };
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const transaction = pool.transaction();
        await transaction.begin();
        try {
          const wrappedClient: SQLClient = {
            async query<T>(sqlQuery: string, params?: unknown[]): Promise<T[]> {
              const request = transaction.request();
              params?.forEach((p, i) => request.input(`p${i}`, p));
              const result = await request.query(sqlQuery);
              return result.recordset as T[];
            },
            async execute(sqlQuery: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const request = transaction.request();
              params?.forEach((p, i) => request.input(`p${i}`, p));
              const result = await request.query(sqlQuery);
              return { affectedRows: result.rowsAffected[0] || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await transaction.commit();
          return result;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      },
      async close(): Promise<void> {
        await pool.close();
      },
    };
  }

  private async createOracleClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // Oracle requires oracledb package: npm install oracledb
    const oracledb = await import('oracledb').catch(() => { 
      throw new Error('oracledb package not installed. Run: npm install oracledb'); 
    });
    
    // Configure Oracle client
    oracledb.default.outFormat = oracledb.default.OUT_FORMAT_OBJECT;
    oracledb.default.autoCommit = false;
    
    const pool = await oracledb.default.createPool({
      user: config.username,
      password: config.password,
      connectString: config.connectionString || `${config.host}:${config.port || 1521}/${config.database}`,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const connection = await pool.getConnection();
        try {
          const result = await connection.execute(sql, params || [], { outFormat: oracledb.default.OUT_FORMAT_OBJECT });
          return (result.rows || []) as T[];
        } finally {
          await connection.close();
        }
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        const connection = await pool.getConnection();
        try {
          const result = await connection.execute(sql, params || []);
          await connection.commit();
          return { affectedRows: result.rowsAffected || 0 };
        } finally {
          await connection.close();
        }
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const connection = await pool.getConnection();
        try {
          const wrappedClient: SQLClient = {
            async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
              const result = await connection.execute(sql, params || [], { outFormat: oracledb.default.OUT_FORMAT_OBJECT });
              return (result.rows || []) as T[];
            },
            async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
              const result = await connection.execute(sql, params || []);
              return { affectedRows: result.rowsAffected || 0 };
            },
            transaction: () => { throw new Error('Nested transactions not supported'); },
            close: () => Promise.resolve(),
          };
          const result = await fn(wrappedClient);
          await connection.commit();
          return result;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          await connection.close();
        }
      },
      async close(): Promise<void> {
        await pool.close(0);
      },
    };
  }

  private async createMongoClient(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // MongoDB requires mongodb package: npm install mongodb
    const { MongoClient } = await import('mongodb').catch(() => { 
      throw new Error('mongodb package not installed. Run: npm install mongodb'); 
    });
    
    const connectionString = config.connectionString || 
      `mongodb://${config.username}:${config.password}@${config.host}:${config.port || 27017}/${config.database}`;
    
    const client = new MongoClient(connectionString, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    await client.connect();
    const db = client.db(config.database);

    // MongoDB adapter - translates SQL-like operations to MongoDB queries
    // Note: This is a simplified adapter. Complex queries may need custom handling.
    const sqlClient: SQLClient = {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        // Parse simple SELECT queries to MongoDB find operations
        const selectMatch = sql.match(/SELECT \* FROM (\w+)(?: WHERE (.+))?(?: ORDER BY (\w+) (ASC|DESC))?(?: LIMIT (\d+))?/i);
        if (selectMatch) {
          const [, collection, whereClause, orderField, orderDir, limit] = selectMatch;
          const filter = whereClause ? parseWhereToMongoFilter(whereClause, params || []) : {};
          let cursor = db.collection(collection).find(filter);
          
          if (orderField) {
            cursor = cursor.sort({ [orderField]: orderDir?.toUpperCase() === 'DESC' ? -1 : 1 });
          }
          if (limit) {
            cursor = cursor.limit(parseInt(limit));
          }
          
          return await cursor.toArray() as T[];
        }
        throw new Error(`Unsupported query for MongoDB: ${sql}`);
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        // Parse INSERT, UPDATE, DELETE to MongoDB operations
        const insertMatch = sql.match(/INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/i);
        if (insertMatch) {
          const [, collection, columns] = insertMatch;
          const columnList = columns.split(',').map(c => c.trim());
          const doc: Record<string, unknown> = {};
          columnList.forEach((col, i) => {
            doc[col] = params?.[i];
          });
          const result = await db.collection(collection).insertOne(doc);
          return { affectedRows: result.acknowledged ? 1 : 0 };
        }
        
        const updateMatch = sql.match(/UPDATE (\w+) SET (.+) WHERE (.+)/i);
        if (updateMatch) {
          const [, collection, setClause, whereClause] = updateMatch;
          const filter = parseWhereToMongoFilter(whereClause, params || []);
          const update = parseSetToMongoUpdate(setClause, params || []);
          const result = await db.collection(collection).updateMany(filter, { $set: update });
          return { affectedRows: result.modifiedCount };
        }
        
        throw new Error(`Unsupported execute for MongoDB: ${sql}`);
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        const session = client.startSession();
        try {
          session.startTransaction();
          const result = await fn(sqlClient);
          await session.commitTransaction();
          return result;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      },
      async close(): Promise<void> {
        await client.close();
      },
    };
    return sqlClient;
  }

  private async createDB2Client(config: NonNullable<OrganizationDataConfig['clientDatabase']>): Promise<SQLClient> {
    // IBM DB2 requires ibm_db package: npm install ibm_db
    // @ts-ignore - ibm_db is an optional dependency
    const ibmdb = await import('ibm_db').catch(() => { 
      throw new Error('ibm_db package not installed. Run: npm install ibm_db'); 
    });
    
    const connectionString = config.connectionString || 
      `DATABASE=${config.database};HOSTNAME=${config.host};PORT=${config.port || 50000};PROTOCOL=TCPIP;UID=${config.username};PWD=${config.password};`;
    
    const pool = new ibmdb.Pool();
    pool.setMaxPoolSize(10);

    return {
      async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { query: (sql: string, params: unknown[], cb: (err: Error | null, rows: T[]) => void) => void; close: (cb: () => void) => void };
            connection.query(sql, params || [], (err: Error | null, rows: T[]) => {
              connection.close(() => {});
              if (err) return reject(err);
              resolve(rows);
            });
          });
        });
      },
      async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { query: (sql: string, params: unknown[], cb: (err: Error | null, result: { affectedRows?: number }) => void) => void; close: (cb: () => void) => void };
            connection.query(sql, params || [], (err: Error | null, result: { affectedRows?: number }) => {
              connection.close(() => {});
              if (err) return reject(err);
              resolve({ affectedRows: result?.affectedRows || 0 });
            });
          });
        });
      },
      async transaction<T>(fn: (client: SQLClient) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
          pool.open(connectionString, async (err: Error | null, conn: unknown) => {
            if (err) return reject(err);
            const connection = conn as { 
              beginTransaction: (cb: (err: Error | null) => void) => void;
              commitTransaction: (cb: (err: Error | null) => void) => void;
              rollbackTransaction: (cb: (err: Error | null) => void) => void;
              query: (sql: string, params: unknown[], cb: (err: Error | null, rows: unknown[]) => void) => void;
              close: (cb: () => void) => void;
            };
            
            connection.beginTransaction(async (err: Error | null) => {
              if (err) {
                connection.close(() => {});
                return reject(err);
              }
              
              try {
                const wrappedClient: SQLClient = {
                  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
                    return new Promise((res, rej) => {
                      connection.query(sql, params || [], (err, rows) => {
                        if (err) return rej(err);
                        res(rows as T[]);
                      });
                    });
                  },
                  async execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }> {
                    return new Promise((res, rej) => {
                      connection.query(sql, params || [], (err) => {
                        if (err) return rej(err);
                        res({ affectedRows: 1 });
                      });
                    });
                  },
                  transaction: () => { throw new Error('Nested transactions not supported'); },
                  close: () => Promise.resolve(),
                };
                
                const result = await fn(wrappedClient);
                
                connection.commitTransaction((err: Error | null) => {
                  connection.close(() => {});
                  if (err) return reject(err);
                  resolve(result);
                });
              } catch (error) {
                connection.rollbackTransaction(() => {
                  connection.close(() => {});
                  reject(error);
                });
              }
            });
          });
        });
      },
      async close(): Promise<void> {
        pool.close(() => {});
      },
    };
  }

  private defaultSchemaMapping(): SchemaMapping {
    return {
      tables: {},
      columns: {},
    };
  }
}

// =============================================================================
// APOTHEOSIS ADAPTER IMPLEMENTATION
// =============================================================================

class ClientHostedApotheosisAdapter implements ApotheosisDataAdapter {
  constructor(private adapter: ClientHostedAdapter) {}

  async storeRun(run: ApotheosisRun): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    await client.execute(`
      INSERT INTO ${table} (
        id, organization_id, started_at, completed_at, status,
        scenarios_tested, scenarios_survived, survival_rate,
        critical_count, high_count, medium_count, low_count,
        apotheosis_score, previous_score, score_delta,
        shadow_council_instances, compute_hours, duration_minutes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      run.id, this.adapter.organizationId, run.startedAt, run.completedAt, run.status,
      run.scenariosTested, run.scenariosSurvived, run.survivalRate,
      run.criticalCount, run.highCount, run.mediumCount, run.lowCount,
      run.apotheosisScore, run.previousScore, run.scoreDelta,
      run.shadowCouncilInstances, run.computeHours, run.duration
    ]);
  }

  async getLatestRun(): Promise<ApotheosisRun | null> {
    const table = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table}
      WHERE organization_id = $1
      ORDER BY started_at DESC
      LIMIT 1
    `, [this.adapter.organizationId]);

    if (rows.length === 0) return null;
    return this.mapRunFromDb(rows[0]);
  }

  async getRunHistory(limit: number): Promise<ApotheosisRun[]> {
    const table = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table}
      WHERE organization_id = $1
      ORDER BY started_at DESC
      LIMIT $2
    `, [this.adapter.organizationId, limit]);

    return rows.map(r => this.mapRunFromDb(r));
  }

  async getRunById(runId: string): Promise<ApotheosisRun | null> {
    const table = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE id = $1
    `, [runId]);

    if (rows.length === 0) return null;
    return this.mapRunFromDb(rows[0]);
  }

  async storeWeaknesses(runId: string, weaknesses: WeaknessItem[]): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_weaknesses');
    const client = this.adapter.getClient();
    
    for (const w of weaknesses) {
      await client.execute(`
        INSERT INTO ${table} (
          id, run_id, title, description, category, severity,
          exploit_scenario, damage_estimate, fix_complexity,
          recommended_fix, auto_fixable, status, discovered_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        w.id, runId, w.title, w.description, w.category, w.severity,
        w.exploitScenario, w.damageEstimate, w.fixComplexity,
        w.recommendedFix, w.autoFixable, w.status, w.discoveredAt
      ]);
    }
  }

  async getWeaknesses(runId: string): Promise<WeaknessItem[]> {
    const table = this.adapter.getTableName('apotheosis_weaknesses');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE run_id = $1
    `, [runId]);

    return rows.map(r => this.mapWeaknessFromDb(r));
  }

  async updateWeaknessStatus(weaknessId: string, status: WeaknessItem['status']): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_weaknesses');
    const client = this.adapter.getClient();
    
    const resolvedAt = ['resolved', 'patched'].includes(status) ? new Date() : null;
    await client.execute(`
      UPDATE ${table} SET status = $1, resolved_at = $2 WHERE id = $3
    `, [status, resolvedAt, weaknessId]);
  }

  async storeEscalations(runId: string, escalations: Escalation[]): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_escalations');
    const client = this.adapter.getClient();
    
    for (const e of escalations) {
      await client.execute(`
        INSERT INTO ${table} (
          id, run_id, weakness_id, title, description, severity, reason,
          estimated_cost_to_fix, risk_if_not_fixed, assigned_to, deadline, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        e.id, runId, e.weaknessId, e.title, e.description, e.severity, e.reason,
        e.estimatedCostToFix, e.riskIfNotFixed, JSON.stringify(e.assignedTo), e.deadline, e.status
      ]);
    }
  }

  async getPendingEscalations(): Promise<Escalation[]> {
    const table = this.adapter.getTableName('apotheosis_escalations');
    const runsTable = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT e.* FROM ${table} e
      JOIN ${runsTable} r ON e.run_id = r.id
      WHERE r.organization_id = $1 AND e.status = 'pending'
      ORDER BY e.deadline ASC
    `, [this.adapter.organizationId]);

    return rows.map(r => this.mapEscalationFromDb(r));
  }

  async respondToEscalation(escalationId: string, response: string, status: Escalation['status']): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_escalations');
    const client = this.adapter.getClient();
    
    await client.execute(`
      UPDATE ${table} SET status = $1, response = $2, response_at = $3 WHERE id = $4
    `, [status, response, new Date(), escalationId]);
  }

  async storeAutoPatches(runId: string, patches: AutoPatch[]): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_auto_patches');
    const client = this.adapter.getClient();
    
    for (const p of patches) {
      await client.execute(`
        INSERT INTO ${table} (
          id, run_id, weakness_id, patch_type, description,
          before_state, after_state, reversible, budget_impact, applied_at, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        p.id, runId, p.weaknessId, p.patchType, p.description,
        p.beforeState, p.afterState, p.reversible, p.budgetImpact, p.appliedAt, p.status
      ]);
    }
  }

  async getAutoPatches(runId: string): Promise<AutoPatch[]> {
    const table = this.adapter.getTableName('apotheosis_auto_patches');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE run_id = $1
    `, [runId]);

    return rows.map(r => ({
      id: r.id as string,
      weaknessId: r.weakness_id as string,
      patchType: r.patch_type as AutoPatch['patchType'],
      description: r.description as string,
      beforeState: r.before_state as string,
      afterState: r.after_state as string,
      reversible: r.reversible as boolean,
      budgetImpact: Number(r.budget_impact),
      appliedAt: r.applied_at as Date,
      status: r.status as AutoPatch['status'],
      rollbackAvailable: r.rollback_available as boolean,
    }));
  }

  async storeUpskillAssignments(runId: string, assignments: UpskillAssignment[]): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_upskill_assignments');
    const client = this.adapter.getClient();
    
    for (const u of assignments) {
      await client.execute(`
        INSERT INTO ${table} (
          id, run_id, user_id, user_name, weakness_id, skill_gap,
          training_module, estimated_hours, deadline, status, progress
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        u.id, runId, u.userId, u.userName, u.weaknessId, u.skillGap,
        u.trainingModule, u.estimatedHours, u.deadline, u.status, u.progress
      ]);
    }
  }

  async getUpskillAssignments(): Promise<UpskillAssignment[]> {
    const table = this.adapter.getTableName('apotheosis_upskill_assignments');
    const runsTable = this.adapter.getTableName('apotheosis_runs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT u.* FROM ${table} u
      JOIN ${runsTable} r ON u.run_id = r.id
      WHERE r.organization_id = $1 AND u.status IN ('assigned', 'in_progress')
      ORDER BY u.deadline ASC
    `, [this.adapter.organizationId]);

    return rows.map(r => ({
      id: r.id as string,
      userId: r.user_id as string,
      userName: r.user_name as string,
      weaknessId: r.weakness_id as string,
      skillGap: r.skill_gap as string,
      trainingModule: r.training_module as string,
      estimatedHours: r.estimated_hours as number,
      deadline: r.deadline as Date,
      status: r.status as UpskillAssignment['status'],
      progress: r.progress as number,
      startedAt: r.started_at as Date | undefined,
      completedAt: r.completed_at as Date | undefined,
    }));
  }

  async updateUpskillProgress(assignmentId: string, progress: number, status: UpskillAssignment['status']): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_upskill_assignments');
    const client = this.adapter.getClient();
    
    await client.execute(`
      UPDATE ${table} SET progress = $1, status = $2, completed_at = $3 WHERE id = $4
    `, [progress, status, status === 'completed' ? new Date() : null, assignmentId]);
  }

  async storeBannedPatterns(patterns: PatternBan[]): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_pattern_bans');
    const client = this.adapter.getClient();
    
    for (const p of patterns) {
      await client.execute(`
        INSERT INTO ${table} (
          id, organization_id, pattern, description, instances,
          failure_rate, total_cost, banned_at, banned_by, status, override_requires
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        p.id, this.adapter.organizationId, p.pattern, p.description, JSON.stringify(p.instances),
        p.failureRate, p.totalCost, p.bannedAt, p.bannedBy, p.status, p.overrideRequires
      ]);
    }
  }

  async getBannedPatterns(): Promise<PatternBan[]> {
    const table = this.adapter.getTableName('apotheosis_pattern_bans');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table}
      WHERE organization_id = $1 AND status = 'active'
      ORDER BY banned_at DESC
    `, [this.adapter.organizationId]);

    return rows.map(r => ({
      id: r.id as string,
      pattern: r.pattern as string,
      description: r.description as string,
      instances: JSON.parse(r.instances as string || '[]'),
      failureRate: Number(r.failure_rate),
      totalCost: Number(r.total_cost),
      bannedAt: r.banned_at as Date,
      bannedBy: r.banned_by as PatternBan['bannedBy'],
      status: r.status as PatternBan['status'],
      overrideRequires: r.override_requires as string,
    }));
  }

  async liftPatternBan(patternId: string): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_pattern_bans');
    const client = this.adapter.getClient();
    
    await client.execute(`
      UPDATE ${table} SET status = 'lifted' WHERE id = $1
    `, [patternId]);
  }

  async getConfig(): Promise<ApotheosisConfig> {
    const table = this.adapter.getTableName('apotheosis_configs');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE organization_id = $1
    `, [this.adapter.organizationId]);

    if (rows.length === 0) {
      return this.defaultConfig();
    }

    const r = rows[0];
    return {
      runFrequency: r.run_frequency as ApotheosisConfig['runFrequency'],
      runTime: r.run_time as string,
      scenarioCount: r.scenario_count as number,
      autoPatchThreshold: Number(r.auto_patch_threshold),
      escalationTimeout: r.escalation_timeout as number,
      patternBanThreshold: r.pattern_ban_threshold as number,
      trainingDeadline: r.training_deadline as number,
    };
  }

  async updateConfig(config: Partial<ApotheosisConfig>): Promise<ApotheosisConfig> {
    const current = await this.getConfig();
    const updated = { ...current, ...config };
    
    const table = this.adapter.getTableName('apotheosis_configs');
    const client = this.adapter.getClient();
    
    await client.execute(`
      INSERT INTO ${table} (organization_id, run_frequency, run_time, scenario_count, auto_patch_threshold, escalation_timeout, pattern_ban_threshold, training_deadline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (organization_id) DO UPDATE SET
        run_frequency = $2, run_time = $3, scenario_count = $4, auto_patch_threshold = $5,
        escalation_timeout = $6, pattern_ban_threshold = $7, training_deadline = $8
    `, [
      this.adapter.organizationId, updated.runFrequency, updated.runTime, updated.scenarioCount,
      updated.autoPatchThreshold, updated.escalationTimeout, updated.patternBanThreshold, updated.trainingDeadline
    ]);

    return updated;
  }

  async storeScore(score: ApotheosisScore): Promise<void> {
    const table = this.adapter.getTableName('apotheosis_scores');
    const client = this.adapter.getClient();
    
    await client.execute(`
      INSERT INTO ${table} (id, organization_id, overall_score, components, recorded_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      crypto.randomUUID(), this.adapter.organizationId, score.overall, JSON.stringify(score.components), new Date()
    ]);
  }

  async getScore(): Promise<ApotheosisScore> {
    const table = this.adapter.getTableName('apotheosis_scores');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table}
      WHERE organization_id = $1
      ORDER BY recorded_at DESC
      LIMIT 1
    `, [this.adapter.organizationId]);

    if (rows.length === 0) {
      return this.defaultScore();
    }

    const r = rows[0];
    return {
      overall: Number(r.overall_score),
      components: JSON.parse(r.components as string),
      trend: await this.getScoreHistory(30),
      improvementPoints: 0,
      improvementPeriod: '30 days',
    };
  }

  async getScoreHistory(days: number): Promise<Array<{ date: string; score: number }>> {
    const table = this.adapter.getTableName('apotheosis_scores');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT overall_score, recorded_at FROM ${table}
      WHERE organization_id = $1 AND recorded_at > $2
      ORDER BY recorded_at ASC
    `, [this.adapter.organizationId, new Date(Date.now() - days * 24 * 60 * 60 * 1000)]);

    return rows.map(r => ({
      date: (r.recorded_at as Date).toISOString().split('T')[0],
      score: Number(r.overall_score),
    }));
  }

  // ===========================================================================
  // MAPPING HELPERS
  // ===========================================================================

  private mapRunFromDb(r: Record<string, unknown>): ApotheosisRun {
    return {
      id: r.id as string,
      organizationId: r.organization_id as string,
      startedAt: r.started_at as Date,
      completedAt: r.completed_at as Date | undefined,
      status: r.status as ApotheosisRun['status'],
      scenariosTested: r.scenarios_tested as number,
      scenariosSurvived: r.scenarios_survived as number,
      survivalRate: Number(r.survival_rate),
      weaknessesFound: [],
      criticalCount: r.critical_count as number,
      highCount: r.high_count as number,
      mediumCount: r.medium_count as number,
      lowCount: r.low_count as number,
      autoPatches: [],
      escalations: [],
      upskillAssignments: [],
      patternBans: [],
      apotheosisScore: Number(r.apotheosis_score),
      previousScore: Number(r.previous_score),
      scoreDelta: Number(r.score_delta),
      shadowCouncilInstances: r.shadow_council_instances as number,
      computeHours: Number(r.compute_hours),
      duration: r.duration_minutes as number,
    };
  }

  private mapWeaknessFromDb(r: Record<string, unknown>): WeaknessItem {
    return {
      id: r.id as string,
      title: r.title as string,
      description: r.description as string,
      category: r.category as WeaknessItem['category'],
      severity: r.severity as WeaknessItem['severity'],
      exploitScenario: r.exploit_scenario as string,
      damageEstimate: Number(r.damage_estimate),
      fixComplexity: r.fix_complexity as WeaknessItem['fixComplexity'],
      recommendedFix: r.recommended_fix as string,
      autoFixable: r.auto_fixable as boolean,
      status: r.status as WeaknessItem['status'],
      discoveredAt: r.discovered_at as Date,
      resolvedAt: r.resolved_at as Date | undefined,
    };
  }

  private mapEscalationFromDb(r: Record<string, unknown>): Escalation {
    return {
      id: r.id as string,
      weaknessId: r.weakness_id as string,
      title: r.title as string,
      description: r.description as string,
      severity: r.severity as Escalation['severity'],
      reason: r.reason as string,
      estimatedCostToFix: Number(r.estimated_cost_to_fix),
      riskIfNotFixed: Number(r.risk_if_not_fixed),
      assignedTo: JSON.parse(r.assigned_to as string || '[]'),
      deadline: r.deadline as Date,
      status: r.status as Escalation['status'],
      responseAt: r.response_at as Date | undefined,
      response: r.response as string | undefined,
    };
  }

  private defaultConfig(): ApotheosisConfig {
    return {
      runFrequency: 'nightly',
      runTime: '03:00',
      scenarioCount: 1000,
      autoPatchThreshold: 10000,
      escalationTimeout: 48,
      patternBanThreshold: 3,
      trainingDeadline: 72,
    };
  }

  private defaultScore(): ApotheosisScore {
    return {
      overall: 0,
      components: {
        redTeamSurvivalRate: { value: 0, weight: 0.3 },
        weaknessClosureRate: { value: 0, weight: 0.2 },
        decisionSuccessRate: { value: 0, weight: 0.25 },
        humanReadiness: { value: 0, weight: 0.15 },
        patternHealth: { value: 0, weight: 0.1 },
      },
      trend: [],
      improvementPoints: 0,
      improvementPeriod: 'No data',
    };
  }
}

// =============================================================================
// DISSENT ADAPTER IMPLEMENTATION (Stub - follows same pattern)
// =============================================================================

class ClientHostedDissentAdapter implements DissentDataAdapter {
  constructor(private adapter: ClientHostedAdapter) {}

  async fileDissent(dissent: Dissent): Promise<Dissent> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    await client.execute(`
      INSERT INTO ${table} (
        id, organization_id, decision_id, decision_title, decision_date, decision_owner,
        dissent_type, severity, statement, supporting_evidence,
        is_anonymous, dissenter_id, dissenter_name, dissenter_role, dissenter_department,
        status, response_deadline, outcome_verified, ledger_hash, ledger_timestamp, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    `, [
      dissent.id, this.adapter.organizationId, dissent.decisionId, dissent.decisionTitle,
      dissent.decisionDate, dissent.decisionOwner, dissent.dissentType, dissent.severity,
      dissent.statement, JSON.stringify(dissent.supportingEvidence || []),
      dissent.isAnonymous, dissent.dissenterId, dissent.dissenterName,
      dissent.dissenterRole, dissent.dissenterDepartment, dissent.status,
      dissent.responseDeadline, false, dissent.ledgerHash, dissent.ledgerTimestamp,
      new Date(), new Date()
    ]);

    return dissent;
  }

  async getDissents(options?: { status?: string; userId?: string; limit?: number }): Promise<Dissent[]> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    let sql = `SELECT * FROM ${table} WHERE organization_id = $1`;
    const params: unknown[] = [this.adapter.organizationId];
    
    if (options?.status) {
      params.push(options.status);
      sql += ` AND status = $${params.length}`;
    }
    if (options?.userId) {
      params.push(options.userId);
      sql += ` AND dissenter_id = $${params.length}`;
    }
    
    sql += ' ORDER BY created_at DESC';
    
    if (options?.limit) {
      params.push(options.limit);
      sql += ` LIMIT $${params.length}`;
    }

    const rows = await client.query<Record<string, unknown>>(sql, params);
    return rows.map(r => this.mapDissentFromDb(r));
  }

  async getDissentById(dissentId: string): Promise<Dissent | null> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE id = $1
    `, [dissentId]);

    if (rows.length === 0) return null;
    return this.mapDissentFromDb(rows[0]);
  }

  async respondToDissent(dissentId: string, response: DissentResponse): Promise<Dissent> {
    const responseTable = this.adapter.getTableName('dissent_responses');
    const dissentTable = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    await client.execute(`
      INSERT INTO ${responseTable} (
        id, dissent_id, responder_id, responder_name, responder_role,
        response_type, reasoning, mitigating_actions, ledger_hash, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      response.id, dissentId, response.responderId, response.responderName,
      response.responderRole, response.responseType, response.reasoning,
      JSON.stringify(response.mitigatingActions || []), response.ledgerHash, new Date()
    ]);

    // Update dissent status
    let newStatus: string;
    switch (response.responseType) {
      case 'accept': newStatus = 'accepted'; break;
      case 'partial_accept':
      case 'acknowledge_proceed': newStatus = 'overruled'; break;
      case 'request_clarification': newStatus = 'clarification_requested'; break;
      case 'escalate_together': newStatus = 'escalated'; break;
      default: newStatus = 'acknowledged';
    }

    await client.execute(`
      UPDATE ${dissentTable} SET status = $1, updated_at = $2 WHERE id = $3
    `, [newStatus, new Date(), dissentId]);

    const dissent = await this.getDissentById(dissentId);
    return dissent!;
  }

  async verifyOutcome(dissentId: string, wasCorrect: boolean): Promise<void> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    await client.execute(`
      UPDATE ${table} SET outcome_verified = true, dissenter_was_right = $1, outcome_verified_at = $2 WHERE id = $3
    `, [wasCorrect, new Date(), dissentId]);
  }

  async getDissenterProfile(userId: string): Promise<DissenterProfile> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE organization_id = $1 AND dissenter_id = $2
    `, [this.adapter.organizationId, userId]);

    const dissents = rows.map(r => this.mapDissentFromDb(r));
    const verified = dissents.filter(d => d.outcomeVerified);
    const correct = verified.filter(d => d.dissenterWasRight).length;

    return {
      userId,
      userName: dissents[0]?.dissenterName || 'Unknown',
      isAnonymous: dissents[0]?.isAnonymous || false,
      totalDissents: dissents.length,
      acknowledged: dissents.filter(d => d.status !== 'pending').length,
      acceptedDissents: dissents.filter(d => d.status === 'accepted').length,
      overruledDissents: dissents.filter(d => d.status === 'overruled').length,
      dissentAccuracy: verified.length > 0 ? Math.round((correct / verified.length) * 100) : 0,
      verifiedOutcomes: verified.length,
      correctPredictions: correct,
      isHighAccuracy: verified.length >= 3 && (correct / verified.length) >= 0.7,
      byType: {},
    };
  }

  async getOrganizationMetrics(): Promise<OrganizationDissentMetrics> {
    const table = this.adapter.getTableName('dissents');
    const client = this.adapter.getClient();
    
    const rows = await client.query<Record<string, unknown>>(`
      SELECT * FROM ${table} WHERE organization_id = $1
    `, [this.adapter.organizationId]);

    const dissents = rows.map(r => this.mapDissentFromDb(r));
    const active = dissents.filter(d => d.status === 'pending').length;
    const responded = dissents.filter(d => d.status !== 'pending').length;
    const verified = dissents.filter(d => d.outcomeVerified);
    const correct = verified.filter(d => d.dissenterWasRight).length;

    return {
      organizationId: this.adapter.organizationId,
      totalDissents: dissents.length,
      activeDissents: active,
      responseRate: dissents.length > 0 ? Math.round((responded / dissents.length) * 100) : 100,
      avgResponseTime: 24, // Would need to calculate from actual data
      acceptanceRate: dissents.length > 0 ? Math.round((dissents.filter(d => d.status === 'accepted').length / dissents.length) * 100) : 0,
      overallAccuracy: verified.length > 0 ? Math.round((correct / verified.length) * 100) : 0,
      retaliationFlags: 0,
      healthStatus: active > 10 ? 'warning' : 'healthy',
      byDepartment: [],
      highAccuracyDissenters: [],
      trend: [],
    };
  }

  private mapDissentFromDb(r: Record<string, unknown>): Dissent {
    return {
      id: r.id as string,
      organizationId: r.organization_id as string,
      decisionId: r.decision_id as string,
      decisionTitle: r.decision_title as string,
      decisionDate: r.decision_date as Date,
      decisionOwner: r.decision_owner as string,
      dissentType: r.dissent_type as Dissent['dissentType'],
      severity: r.severity as Dissent['severity'],
      statement: r.statement as string,
      supportingEvidence: JSON.parse(r.supporting_evidence as string || '[]'),
      isAnonymous: r.is_anonymous as boolean,
      dissenterId: r.dissenter_id as string,
      dissenterName: r.dissenter_name as string,
      dissenterRole: r.dissenter_role as string | undefined,
      dissenterDepartment: r.dissenter_department as string | undefined,
      status: r.status as Dissent['status'],
      responseDeadline: r.response_deadline as Date,
      outcomeVerified: r.outcome_verified as boolean,
      dissenterWasRight: r.dissenter_was_right as boolean | undefined,
      outcomeVerifiedAt: r.outcome_verified_at as Date | undefined,
      createdAt: r.created_at as Date,
      updatedAt: r.updated_at as Date,
      ledgerHash: r.ledger_hash as string,
      ledgerTimestamp: r.ledger_timestamp as Date,
    };
  }
}
