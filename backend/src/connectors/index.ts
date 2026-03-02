// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA ENTERPRISE CONNECTORS
 * =============================================================================
 * 
 * Comprehensive data connector infrastructure for integrating with external
 * data sources across all major verticals. Connectors are organized by industry
 * and support both real-time streaming and batch data ingestion.
 * 
 * Each connector provides:
 * - Authentication handling (API keys, OAuth, certificates)
 * - Rate limiting and quota management
 * - Data transformation and normalization
 * - Error handling and retry logic
 * - Audit logging for compliance
 */

export * from './BaseConnector.js';
export * from './ConnectorRegistry.js';

// Vertical-specific connector exports
export * from './government/index.js';
export * from './financial/index.js';
export * from './healthcare/index.js';
export * from './supply-chain/index.js';
export * from './energy/index.js';
export * from './international/index.js';
export * from './defense/index.js';
export * from './agriculture/index.js';
export * from './telecommunications/index.js';
export * from './transportation/index.js';
export * from './avionics/index.js';
