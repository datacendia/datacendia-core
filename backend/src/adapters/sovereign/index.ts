// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SOVEREIGN ADAPTER ARCHITECTURE - INDEX
 * =============================================================================
 * 16 Connector Suites: 6 Universal Adapters + 10 Pre-configured Suites
 * 
 * Key Principle: "We provide the socket; the client brings the plug."
 * 
 * UNIVERSAL ADAPTERS (6):
 * 1. File Watcher - Avionics, Defense, Legacy (file-based ingest)
 * 2. Webhook Ingest - SaaS, Financial gateways (push events)
 * 3. Database - ERP, Supply Chain (SQL/ODBC polling)
 * 4. FHIR - Healthcare standard (NOT Epic/Cerner proprietary)
 * 5. FIX - Financial standard (NOT Bloomberg/Refinitiv)
 * 6. MQTT - IoT/Energy grids
 * 
 * PRE-CONFIGURED SUITES (10):
 * 7. Salesforce Suite - CRM
 * 8. SAP Suite - ERP
 * 9. Workday Suite - HR
 * 10. ServiceNow Suite - ITSM
 * 11. Microsoft 365 Suite - Productivity
 * 12. Oracle Suite - ERP/Database
 * 13. Snowflake Suite - Data Warehouse
 * 14. Atlassian Suite - Jira/Confluence
 * 15. HubSpot Suite - Marketing/CRM
 * 16. Zendesk Suite - Support
 * 
 * NOT included (liability traps):
 * - Bloomberg Terminal API (licensing $24k/user/year)
 * - Epic proprietary APIs (BAA required)
 * - SWIFT direct (CSP compliance audit)
 * - ARINC 429/MIL-STD-1553 (hardware protocols)
 * - Refinitiv/FactSet (redistribution restrictions)
 */

// Core adapter framework
export {
  SovereignAdapter,
  AdapterConfig,
  AdapterCapabilities,
  IngestRecord,
  AdapterHealth,
  AdapterMetrics,
  RiskTier,
  DataClassification,
  adapterRegistry,
} from './SovereignAdapter.js';

// Universal adapters
export { FileWatcherAdapter, FileWatcherConfig, FileParser, ParsedData } from './FileWatcherAdapter.js';
export { WebhookIngestAdapter, WebhookConfig, WebhookEvent, ProcessedWebhook } from './WebhookIngestAdapter.js';
export { DatabaseAdapter, DatabaseConfig, DatabaseType, QueryDefinition, QueryResult } from './DatabaseAdapter.js';

// Standard protocol adapters
export {
  FHIRAdapter,
  FHIRAdapterConfig,
  FHIRResource,
  FHIRSubscription,
  FIXAdapter,
  FIXAdapterConfig,
  FIXMessage,
  MQTTAdapter,
  MQTTAdapterConfig,
  MQTTMessage,
} from './ProtocolAdapters.js';

// Connector Suites (pre-configured adapter templates)
export {
  ConnectorSuiteConfig,
  ConnectorSuiteInstance,
  ConnectorSuites,
  connectorSuiteManager,
  SalesforceSuite,
  SAPSuite,
  WorkdaySuite,
  ServiceNowSuite,
  Microsoft365Suite,
  OracleSuite,
  SnowflakeSuite,
  AtlassianSuite,
  HubSpotSuite,
  ZendeskSuite,
} from './ConnectorSuites.js';

// =============================================================================
// ADAPTER MANAGER
// =============================================================================

import { adapterRegistry, SovereignAdapter, RiskTier, AdapterConfig } from './SovereignAdapter.js';

/**
 * Manages all adapter instances across the system
 */
class AdapterManager {
  private static instance: AdapterManager;

  private constructor() {}

  static getInstance(): AdapterManager {
    if (!AdapterManager.instance) {
      AdapterManager.instance = new AdapterManager();
    }
    return AdapterManager.instance;
  }

  /**
   * Create a new adapter instance
   */
  create(type: string, config: Partial<AdapterConfig>): SovereignAdapter {
    return adapterRegistry.create(type, config);
  }

  /**
   * Get an existing adapter instance
   */
  get(id: string): SovereignAdapter | undefined {
    return adapterRegistry.getInstance(id);
  }

  /**
   * List all registered adapter types
   */
  listTypes(): { type: string; description: string; riskTier: RiskTier }[] {
    return adapterRegistry.listTypes();
  }

  /**
   * List all running instances
   */
  listInstances(): { id: string; type: string; status: string }[] {
    return adapterRegistry.listInstances();
  }

  /**
   * Destroy an adapter instance
   */
  async destroy(id: string): Promise<void> {
    return adapterRegistry.destroy(id);
  }

  /**
   * Destroy all adapter instances
   */
  async destroyAll(): Promise<void> {
    return adapterRegistry.destroyAll();
  }

  /**
   * Get health status for all adapters
   */
  async getAllHealth(): Promise<Record<string, unknown>> {
    const instances = adapterRegistry.listInstances();
    const health: Record<string, unknown> = {};

    for (const { id } of instances) {
      const adapter = adapterRegistry.getInstance(id);
      if (adapter) {
        health[id] = await adapter.healthCheck();
      }
    }

    return health;
  }

  /**
   * Get metrics for all adapters
   */
  getAllMetrics(): Record<string, unknown> {
    const instances = adapterRegistry.listInstances();
    const metrics: Record<string, unknown> = {};

    for (const { id } of instances) {
      const adapter = adapterRegistry.getInstance(id);
      if (adapter) {
        metrics[id] = adapter.getMetrics();
      }
    }

    return metrics;
  }
}

export const adapterManager = AdapterManager.getInstance();

// =============================================================================
// RISK TIER DOCUMENTATION
// =============================================================================

/**
 * Risk Tier Classification Guide
 * 
 * Tier 0 - PUBLIC (Low Risk):
 *   - Public APIs: NOAA, Census, USGS, BLS
 *   - Open data sources
 *   - Main concerns: uptime, rate limits, data quality
 * 
 * Tier 1 - ENTERPRISE (Moderate Risk):
 *   - Client-managed SaaS integrations
 *   - Database connections to client systems
 *   - File-based ingestion
 *   - Concerns: auth, tenancy, SLAs
 * 
 * Tier 2 - REGULATED (High Risk):
 *   - Healthcare (FHIR, HL7)
 *   - Financial (FIX protocol)
 *   - BYO-keys required
 *   - Concerns: licensing, auditability, retention, compliance
 * 
 * Tier 3 - RESTRICTED (Very High Risk):
 *   - Defense protocols
 *   - Export-controlled data
 *   - Disabled by default
 *   - Requires explicit customer attestation
 *   - On-prem only recommended
 */

// =============================================================================
// MARKETING vs IMPLEMENTATION
// =============================================================================

/**
 * What we MARKET (compatible via standard adapters):
 * - Bloomberg, Refinitiv, FactSet → "Compatible via File Watcher or Webhook"
 * - Epic, Cerner → "Compatible via FHIR standard"
 * - SWIFT → "Compatible via Webhook from your gateway"
 * - ARINC 429, MIL-STD-1553 → "Compatible via File Watcher (client exports)"
 * 
 * What we IMPLEMENT:
 * - 5 Universal Adapters
 * - 3 Standard Protocols (FHIR, FIX, MQTT)
 * - Evidence logging for all ingest operations
 * - Risk tier enforcement
 * - BYO-keys for all regulated adapters
 */
