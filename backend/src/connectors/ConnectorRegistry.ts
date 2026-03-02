/**
 * Connector — Connector Registry
 *
 * External system connector for third-party integrations.
 *
 * @exports ConnectorRegistry, connectorRegistry
 * @module connectors/ConnectorRegistry
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * CONNECTOR REGISTRY - Central Management of All Data Connectors
 * =============================================================================
 */

import { BaseConnector, ConnectorMetadata, ConnectorConfig } from './BaseConnector.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

export class ConnectorRegistry {
  private static instance: ConnectorRegistry;
  private connectors: Map<string, BaseConnector> = new Map();

  static getInstance(): ConnectorRegistry {
    if (!ConnectorRegistry.instance) {
      ConnectorRegistry.instance = new ConnectorRegistry();
    }
    return ConnectorRegistry.instance;
  }

  register(connector: BaseConnector): void {
    this.connectors.set(connector.getId(), connector);
    logger.info(`[ConnectorRegistry] Registered: ${connector.getName()}`);
  }

  get(id: string): BaseConnector | undefined {
    return this.connectors.get(id);
  }

  getAll(): BaseConnector[] {
    return Array.from(this.connectors.values());
  }

  getByVertical(vertical: string): BaseConnector[] {
    return this.getAll().filter(c => c.getMetadata().vertical === vertical);
  }

  getByCategory(category: string): BaseConnector[] {
    return this.getAll().filter(c => c.getMetadata().category === category);
  }

  getAllMetadata(): ConnectorMetadata[] {
    return this.getAll().map(c => c.getMetadata());
  }

  async testAll(): Promise<{ id: string; name: string; success: boolean; error?: string }[]> {
    const results = [];
    for (const connector of this.connectors.values()) {
      try {
        const success = await connector.testConnection();
        results.push({ id: connector.getId(), name: connector.getName(), success });
      } catch (error: unknown) {
        results.push({ id: connector.getId(), name: connector.getName(), success: false, error: getErrorMessage(error) });
      }
    }
    return results;
  }
}

export const connectorRegistry = ConnectorRegistry.getInstance();
