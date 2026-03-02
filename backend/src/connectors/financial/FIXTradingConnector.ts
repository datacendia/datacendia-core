// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * FIX TRADING CONNECTOR - Concrete implementation
 * =============================================================================
 * Ready-to-use FIX connector for trading systems integration
 */

import { FIXConnector, FIXConnectorConfig, FIXMessage, FIXExecution } from '../core/FIXConnector.js';
import { ConnectorMetadata } from '../BaseConnector.js';
import { logger } from '../../utils/logger.js';

export interface FIXTradingConnectorConfig extends FIXConnectorConfig {
  onExecutionCallback?: (execution: FIXExecution) => void;
  onMarketDataCallback?: (data: FIXMessage) => void;
  persistExecutions?: boolean;
}

export class FIXTradingConnector extends FIXConnector {
  private tradingConfig: FIXTradingConnectorConfig;
  private executions: FIXExecution[] = [];
  private marketDataCache: Map<string, FIXMessage> = new Map();

  constructor(config: FIXTradingConnectorConfig) {
    super(config);
    this.tradingConfig = config;
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'fix-trading',
      name: 'FIX Trading Connector',
      description: 'Financial Information eXchange protocol for trading systems',
      vertical: 'financial',
      category: 'trading',
      provider: 'Datacendia',
      region: 'global',
      dataTypes: ['orders', 'executions', 'market-data', 'quotes'],
      updateFrequency: 'real-time',
      apiVersion: 'FIX 4.4',
      requiredCredentials: ['host', 'port', 'senderCompId', 'targetCompId'],
      optionalCredentials: ['fixVersion', 'heartbeatInterval', 'useTLS', 'username', 'password'],
      complianceFrameworks: ['MiFID II', 'SEC Rule 606', 'FINRA'],
      compatibilityLabel: 'public_api',
      integrationNotes: 'Requires FIX session credentials from counterparty. Supports FIX 4.2, 4.4, and 5.0.',
    };
  }

  protected onMessage(message: FIXMessage): void {
    logger.debug(`FIX message received: ${message.msgType}`);
  }

  protected onExecution(execution: FIXExecution): void {
    logger.info(`Execution received: ${execution.execId} - ${execution.ordStatus}`);
    
    if (this.tradingConfig.persistExecutions) {
      this.executions.push(execution);
    }

    if (this.tradingConfig.onExecutionCallback) {
      this.tradingConfig.onExecutionCallback(execution);
    }
  }

  protected onMarketData(message: FIXMessage): void {
    const symbol = message.fields.get(55); // Symbol tag
    if (symbol) {
      this.marketDataCache.set(symbol, message);
    }

    if (this.tradingConfig.onMarketDataCallback) {
      this.tradingConfig.onMarketDataCallback(message);
    }
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Get all executions received during this session
   */
  getExecutions(): FIXExecution[] {
    return [...this.executions];
  }

  /**
   * Get cached market data for a symbol
   */
  getMarketData(symbol: string): FIXMessage | undefined {
    return this.marketDataCache.get(symbol);
  }

  /**
   * Get all cached market data
   */
  getAllMarketData(): Map<string, FIXMessage> {
    return new Map(this.marketDataCache);
  }

  /**
   * Clear execution history
   */
  clearExecutions(): void {
    this.executions = [];
  }

  /**
   * Clear market data cache
   */
  clearMarketData(): void {
    this.marketDataCache.clear();
  }
}

export default FIXTradingConnector;
