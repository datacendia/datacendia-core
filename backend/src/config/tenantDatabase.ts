// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TENANT DATABASE ADAPTER
// Supports multiple database configurations per client/organization
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface TenantDatabaseConfig {
  organizationId: string;
  databaseUrl: string;
  databaseType: 'postgresql' | 'mysql' | 'sqlserver' | 'mongodb';
  poolSize?: number;
  ssl?: boolean;
  schema?: string; // For PostgreSQL schema isolation
}

// =============================================================================
// TENANT DATABASE MANAGER
// =============================================================================

class TenantDatabaseManager {
  private clients: Map<string, PrismaClient> = new Map();
  private configs: Map<string, TenantDatabaseConfig> = new Map();
  private defaultClient: PrismaClient;

  constructor() {
    // Default client uses DATABASE_URL from environment
    this.defaultClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });

    this.setupMiddleware(this.defaultClient, 'default');
  }

  /**
   * Register a tenant-specific database configuration
   * Called during tenant onboarding or from external config service
   */
  registerTenant(config: TenantDatabaseConfig): void {
    this.configs.set(config.organizationId, config);
    logger.info(`[TenantDB] Registered database config for org ${config.organizationId}`);
  }

  /**
   * Remove tenant configuration (on tenant offboarding)
   */
  async unregisterTenant(organizationId: string): Promise<void> {
    const client = this.clients.get(organizationId);
    if (client) {
      await client.$disconnect();
      this.clients.delete(organizationId);
    }
    this.configs.delete(organizationId);
    logger.info(`[TenantDB] Unregistered database for org ${organizationId}`);
  }

  /**
   * Get database client for a specific organization
   * Returns tenant-specific client if configured, otherwise default shared client
   */
  getClient(organizationId: string): PrismaClient {
    // Check if tenant has custom database config
    const config = this.configs.get(organizationId);
    
    if (!config) {
      // Use default shared database (multi-tenant with org_id filtering)
      return this.defaultClient;
    }

    // Check if we already have a client for this tenant
    let client = this.clients.get(organizationId);
    
    if (!client) {
      // Create new client for this tenant
      client = this.createTenantClient(config);
      this.clients.set(organizationId, client);
      logger.info(`[TenantDB] Created dedicated client for org ${organizationId}`);
    }

    return client;
  }

  /**
   * Get the default shared database client
   * Use for operations that span organizations (admin, analytics)
   */
  getDefaultClient(): PrismaClient {
    return this.defaultClient;
  }

  /**
   * Create a Prisma client for a specific tenant database
   */
  private createTenantClient(config: TenantDatabaseConfig): PrismaClient {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });

    this.setupMiddleware(client, config.organizationId);
    return client;
  }

  /**
   * Add middleware for logging and monitoring
   */
  private setupMiddleware(client: PrismaClient, tenantId: string): void {
    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      const duration = after - before;
      if (duration > 100) {
        logger.warn(`[TenantDB:${tenantId}] Slow query: ${params.model}.${params.action} took ${duration}ms`);
      }
      
      return result;
    });
  }

  /**
   * Health check for all tenant databases
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    // Check default
    try {
      await this.defaultClient.$queryRaw`SELECT 1`;
      results['default'] = true;
    } catch {
      results['default'] = false;
    }

    // Check each tenant
    for (const [orgId, client] of this.clients) {
      try {
        await client.$queryRaw`SELECT 1`;
        results[orgId] = true;
      } catch {
        results[orgId] = false;
      }
    }

    return results;
  }

  /**
   * Gracefully disconnect all clients
   */
  async disconnectAll(): Promise<void> {
    await this.defaultClient.$disconnect();
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
    this.clients.clear();
    logger.info('[TenantDB] All database connections closed');
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const tenantDb = new TenantDatabaseManager();

/**
 * Helper function for services to get the correct database client
 * 
 * Usage in services:
 * ```typescript
 * import { getDbForOrg } from '../config/tenantDatabase.js';
 * 
 * async getLatestRun(organizationId: string) {
 *   const db = getDbForOrg(organizationId);
 *   return db.apotheosis_runs.findFirst({
 *     where: { organization_id: organizationId }
 *   });
 * }
 * ```
 */
export function getDbForOrg(organizationId: string): PrismaClient {
  return tenantDb.getClient(organizationId);
}

// =============================================================================
// CONFIGURATION LOADING
// =============================================================================

/**
 * Load tenant database configurations from environment or external source
 * Called during application startup
 */
export async function loadTenantConfigs(): Promise<void> {
  // Option 1: Load from environment variables
  // TENANT_DB_ORG123=postgresql://user:pass@host:5432/org123
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('TENANT_DB_') && value) {
      const orgId = key.replace('TENANT_DB_', '').toLowerCase();
      tenantDb.registerTenant({
        organizationId: orgId,
        databaseUrl: value,
        databaseType: 'postgresql',
      });
    }
  }

  // Option 2: Load from a configuration service (example)
  // const configs = await fetch('https://config-service/databases');
  // configs.forEach(c => tenantDb.registerTenant(c));

  logger.info('[TenantDB] Tenant configurations loaded');
}
