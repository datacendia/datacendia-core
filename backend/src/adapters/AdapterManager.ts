/**
 * Data Adapter — Adapter Manager
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports getAdapter, isDataLocal, adapterManager
 * @module adapters/AdapterManager
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ADAPTER MANAGER
// Routes data operations to the correct adapter based on organization config
// Supports: Datacendia-hosted, Client-hosted, or Hybrid modes
// =============================================================================

import { DataAdapter, OrganizationDataConfig, DataStorageMode } from './DataAdapter.js';
import { ClientHostedAdapter } from './ClientHostedAdapter.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// PRISMA ADAPTER (Datacendia-hosted)
// =============================================================================

class DatacendiaHostedAdapter implements DataAdapter {
  readonly type = 'datacendia' as const;
  readonly organizationId: string;
  
  // Use the existing Prisma-based implementations
  apotheosis: DataAdapter['apotheosis'];
  dissent: DataAdapter['dissent'];

  constructor(organizationId: string) {
    this.organizationId = organizationId;
    // These would delegate to the existing Prisma-based service methods
    // For now, they're stubs that should be filled in
    this.apotheosis = null as unknown as DataAdapter['apotheosis'];
    this.dissent = null as unknown as DataAdapter['dissent'];
  }

  async connect(): Promise<void> {
    // Prisma connects automatically
  }

  async disconnect(): Promise<void> {
    // Don't disconnect shared Prisma client
  }

  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async rawQuery<T>(query: string, params?: unknown[]): Promise<T> {
    return prisma.$queryRawUnsafe(query, ...(params || [])) as Promise<T>;
  }
}

// =============================================================================
// ADAPTER MANAGER
// =============================================================================

class AdapterManager {
  private adapters: Map<string, DataAdapter> = new Map();
  private configs: Map<string, OrganizationDataConfig> = new Map();

  /**
   * Register organization data configuration
   * Call this during onboarding or from external config service
   */
  async registerOrganization(config: OrganizationDataConfig): Promise<void> {
    this.configs.set(config.organizationId, config);
    
    // Pre-create adapter if possible
    const adapter = this.createAdapter(config);
    if (adapter) {
      await adapter.connect();
      this.adapters.set(config.organizationId, adapter);
    }

    logger.info(`[AdapterManager] Registered org ${config.organizationId} with mode: ${config.storageMode}`);
  }

  /**
   * Unregister organization (on offboarding)
   */
  async unregisterOrganization(organizationId: string): Promise<void> {
    const adapter = this.adapters.get(organizationId);
    if (adapter) {
      await adapter.disconnect();
      this.adapters.delete(organizationId);
    }
    this.configs.delete(organizationId);
    logger.info(`[AdapterManager] Unregistered org ${organizationId}`);
  }

  /**
   * Get the data adapter for an organization
   * This is the main entry point for all data operations
   */
  getAdapter(organizationId: string): DataAdapter {
    // Check if we have a cached adapter
    let adapter = this.adapters.get(organizationId);
    
    if (adapter) {
      return adapter;
    }

    // Check if we have config but no adapter yet
    const config = this.configs.get(organizationId);
    
    if (config) {
      const newAdapter = this.createAdapter(config);
      if (newAdapter) {
        this.adapters.set(organizationId, newAdapter);
        // Connect async - may delay first request
        newAdapter.connect().catch(err => {
          logger.error(`[AdapterManager] Failed to connect adapter for ${organizationId}:`, err);
        });
        return newAdapter;
      }
    }

    // Default: Use Datacendia-hosted (Prisma)
    adapter = new DatacendiaHostedAdapter(organizationId);
    this.adapters.set(organizationId, adapter);
    return adapter;
  }

  /**
   * Get organization storage mode
   */
  getStorageMode(organizationId: string): DataStorageMode {
    const config = this.configs.get(organizationId);
    return config?.storageMode || 'datacendia-hosted';
  }

  /**
   * Check if organization uses client-hosted storage
   */
  isClientHosted(organizationId: string): boolean {
    const mode = this.getStorageMode(organizationId);
    return mode === 'client-hosted';
  }

  /**
   * Check if organization data is stored on Datacendia
   */
  hasDatacendiaStorage(organizationId: string): boolean {
    const mode = this.getStorageMode(organizationId);
    return mode === 'datacendia-hosted' || mode === 'hybrid-sync' || mode === 'hybrid-cache';
  }

  /**
   * Health check for all adapters
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [orgId, adapter] of this.adapters) {
      results[orgId] = await adapter.healthCheck();
    }

    return results;
  }

  /**
   * Disconnect all adapters (for graceful shutdown)
   */
  async disconnectAll(): Promise<void> {
    for (const adapter of this.adapters.values()) {
      await adapter.disconnect();
    }
    this.adapters.clear();
    logger.info('[AdapterManager] All adapters disconnected');
  }

  /**
   * Create adapter based on configuration
   */
  private createAdapter(config: OrganizationDataConfig): DataAdapter | null {
    switch (config.storageMode) {
      case 'datacendia-hosted':
        return new DatacendiaHostedAdapter(config.organizationId);
      
      case 'client-hosted':
        if (!config.clientDatabase) {
          logger.error(`[AdapterManager] Client database config required for client-hosted mode`);
          return null;
        }
        return new ClientHostedAdapter(config);
      
      case 'hybrid-sync':
      case 'hybrid-cache':
        // For hybrid modes, we'd need a more complex adapter
        // that syncs between client and Datacendia
        logger.warn(`[AdapterManager] Hybrid mode not yet fully implemented, using client-hosted`);
        if (config.clientDatabase) {
          return new ClientHostedAdapter(config);
        }
        return new DatacendiaHostedAdapter(config.organizationId);
      
      default:
        return new DatacendiaHostedAdapter(config.organizationId);
    }
  }

  /**
   * Load organization configs from database or environment
   */
  async loadConfigurations(): Promise<void> {
    // Load from environment variables
    // Format: ORG_CONFIG_<ORGID>=<JSON config>
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('ORG_CONFIG_') && value) {
        try {
          const config = JSON.parse(value) as OrganizationDataConfig;
          await this.registerOrganization(config);
        } catch (err) {
          logger.error(`[AdapterManager] Failed to parse config for ${key}:`, err);
        }
      }
    }

    // Load from database (organization settings table)
    try {
      const orgConfigs = await prisma.organizations.findMany({
        select: {
          id: true,
          name: true,
          // Assuming there's a settings JSON field
        },
      });

      // In practice, you'd parse organization settings and register adapters
      logger.info(`[AdapterManager] Loaded ${orgConfigs.length} organization configurations`);
    } catch (err) {
      logger.warn('[AdapterManager] Could not load org configs from database:', err);
    }
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const adapterManager = new AdapterManager();

/**
 * Convenience function to get adapter for an organization
 * 
 * Usage:
 * ```typescript
 * import { getAdapter } from '../adapters/AdapterManager.js';
 * 
 * async function getLatestRun(orgId: string) {
 *   const adapter = getAdapter(orgId);
 *   return adapter.apotheosis.getLatestRun();
 * }
 * ```
 */
export function getAdapter(organizationId: string): DataAdapter {
  return adapterManager.getAdapter(organizationId);
}

/**
 * Check if data is stored locally (on Datacendia infrastructure)
 */
export function isDataLocal(organizationId: string): boolean {
  return adapterManager.hasDatacendiaStorage(organizationId);
}

// =============================================================================
// EXAMPLE CONFIGURATION
// =============================================================================

/*
Environment variable example for client-hosted database:

ORG_CONFIG_acme-corp={
  "organizationId": "acme-corp",
  "storageMode": "client-hosted",
  "clientDatabase": {
    "type": "postgresql",
    "host": "db.acme-corp.com",
    "port": 5432,
    "database": "datacendia",
    "username": "datacendia_service",
    "password": "${ACME_DB_PASSWORD}",
    "ssl": true,
    "schemaMapping": {
      "tables": {
        "apotheosis_runs": "risk_assessments",
        "dissents": "formal_objections"
      },
      "columns": {
        "risk_assessments": {
          "apotheosis_score": "risk_score"
        }
      }
    }
  }
}
*/
