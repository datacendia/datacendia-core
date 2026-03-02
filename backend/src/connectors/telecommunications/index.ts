/**
 * Connector — Index
 *
 * External system connector for third-party integrations.
 *
 * @exports TelecomConnectorFactory, TELECOM_CONNECTORS
 * @module connectors/telecommunications/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * TELECOMMUNICATIONS CONNECTORS
 * =============================================================================
 * Network Data, Spectrum, Mobile, Satellite Communications
 */

import { ConnectorMetadata } from '../BaseConnector.js';

export const TELECOM_CONNECTORS: ConnectorMetadata[] = [
  // Regulatory
  {
    id: 'fcc-spectrum',
    name: 'FCC Spectrum Data',
    description: 'Federal Communications Commission spectrum licenses',
    vertical: 'telecommunications',
    category: 'regulatory',
    provider: 'FCC',
    region: 'US',
    dataTypes: ['licenses', 'spectrum-allocation', 'antenna-locations'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.fcc.gov/developers',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'ofcom-uk',
    name: 'Ofcom UK',
    description: 'UK communications regulator data',
    vertical: 'telecommunications',
    category: 'regulatory',
    provider: 'Ofcom',
    region: 'UK',
    dataTypes: ['spectrum', 'broadcast', 'telecoms-data'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://www.ofcom.org.uk/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'itu-data',
    name: 'ITU Statistics',
    description: 'International Telecommunication Union',
    vertical: 'telecommunications',
    category: 'statistics',
    provider: 'ITU',
    region: 'Global',
    dataTypes: ['ict-indicators', 'broadband', 'mobile-subscriptions'],
    updateFrequency: 'annual',
    documentationUrl: 'https://www.itu.int/en/ITU-D/Statistics/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // Network Monitoring
  {
    id: 'ripe-atlas',
    name: 'RIPE Atlas',
    description: 'Global internet measurement network',
    vertical: 'telecommunications',
    category: 'network',
    provider: 'RIPE NCC',
    region: 'Global',
    dataTypes: ['latency', 'traceroutes', 'dns', 'ssl'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://atlas.ripe.net/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'arin-whois',
    name: 'ARIN WHOIS',
    description: 'American Registry for Internet Numbers',
    vertical: 'telecommunications',
    category: 'network',
    provider: 'ARIN',
    region: 'North America',
    dataTypes: ['ip-allocation', 'asn', 'organizations'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://www.arin.net/resources/registry/whois/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },

  // Satellite
  {
    id: 'spacex-starlink',
    name: 'Starlink Telemetry',
    description: 'Starlink satellite constellation data',
    vertical: 'telecommunications',
    category: 'satellite',
    provider: 'SpaceX',
    region: 'Global',
    dataTypes: ['coverage', 'latency', 'capacity'],
    updateFrequency: 'real-time',
    requiredCredentials: ['api_key', 'account_id'],
    complianceFrameworks: [],
    compatibilityLabel: 'license_required',
    integrationNotes: 'BYO Starlink business account; Webhook Adapter',
  },
  {
    id: 'inmarsat',
    name: 'Inmarsat Maritime',
    description: 'Maritime satellite communications',
    vertical: 'telecommunications',
    category: 'satellite',
    provider: 'Inmarsat',
    region: 'Global',
    dataTypes: ['vessel-tracking', 'fleet-data', 'coverage'],
    updateFrequency: 'real-time',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['ISO27001'],
    compatibilityLabel: 'license_required',
    integrationNotes: 'BYO Inmarsat subscription; Webhook Adapter',
  },
];

export class TelecomConnectorFactory {
  static getAvailableConnectors(): ConnectorMetadata[] {
    return TELECOM_CONNECTORS;
  }
}
