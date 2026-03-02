// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEFENSE & INTELLIGENCE CONNECTORS
 * =============================================================================
 * Military, Intelligence, Security Data Sources
 */

import { ConnectorMetadata } from '../BaseConnector.js';

export const DEFENSE_CONNECTORS: ConnectorMetadata[] = [
  // US Defense
  {
    id: 'dla-logistics',
    name: 'DLA Logistics',
    description: 'Defense Logistics Agency supply chain data',
    vertical: 'defense',
    category: 'logistics',
    provider: 'DLA',
    region: 'US',
    dataTypes: ['inventory', 'orders', 'shipments', 'pricing'],
    updateFrequency: 'real-time',
    requiredCredentials: ['cac', 'certificate'],
    complianceFrameworks: ['FedRAMP High', 'ITAR', 'CMMC'],
    compatibilityLabel: 'client_gateway',
    integrationNotes: 'Requires CAC authentication and client gateway; file export ingestion',
  },
  {
    id: 'sam-gov',
    name: 'SAM.gov',
    description: 'System for Award Management - federal contracts',
    vertical: 'defense',
    category: 'contracts',
    provider: 'GSA',
    region: 'US',
    dataTypes: ['contracts', 'entities', 'exclusions', 'opportunities'],
    updateFrequency: 'daily',
    documentationUrl: 'https://sam.gov/api/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'fpds',
    name: 'FPDS-NG',
    description: 'Federal Procurement Data System',
    vertical: 'defense',
    category: 'contracts',
    provider: 'GSA',
    region: 'US',
    dataTypes: ['contract-awards', 'modifications', 'spending'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.fpds.gov/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'nist-nvd',
    name: 'NIST NVD',
    description: 'National Vulnerability Database',
    vertical: 'defense',
    category: 'cybersecurity',
    provider: 'NIST',
    region: 'US',
    dataTypes: ['cves', 'cpes', 'cvss-scores', 'exploits'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://nvd.nist.gov/developers',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'cisa-known-exploited',
    name: 'CISA KEV',
    description: 'Known Exploited Vulnerabilities Catalog',
    vertical: 'defense',
    category: 'cybersecurity',
    provider: 'CISA',
    region: 'US',
    dataTypes: ['known-exploits', 'remediation-deadlines'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    requiredCredentials: [],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // NATO & Allies
  {
    id: 'nato-stanag',
    name: 'NATO STANAG Feeds',
    description: 'NATO Standardization Agreement data formats',
    vertical: 'defense',
    category: 'military',
    provider: 'NATO',
    region: 'NATO',
    dataTypes: ['situational-awareness', 'logistics', 'c2'],
    updateFrequency: 'real-time',
    requiredCredentials: ['nato_certificate', 'clearance'],
    complianceFrameworks: ['NATO SECRET'],
    compatibilityLabel: 'client_gateway',
    integrationNotes: 'Requires NATO clearance and client gateway; file export ingestion only',
  },

  // Sanctions & Export Control
  {
    id: 'ofac-sanctions',
    name: 'OFAC Sanctions List',
    description: 'Office of Foreign Assets Control sanctions',
    vertical: 'defense',
    category: 'compliance',
    provider: 'US Treasury',
    region: 'US',
    dataTypes: ['sdn-list', 'consolidated-list', 'sectoral-sanctions'],
    updateFrequency: 'daily',
    documentationUrl: 'https://ofac.treasury.gov/specially-designated-nationals-list-data-formats-data-schemas',
    requiredCredentials: [],
    complianceFrameworks: ['OFAC'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'bis-export',
    name: 'BIS Export Control',
    description: 'Bureau of Industry and Security export data',
    vertical: 'defense',
    category: 'compliance',
    provider: 'Commerce BIS',
    region: 'US',
    dataTypes: ['denied-parties', 'entity-list', 'export-licenses'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.bis.doc.gov/',
    requiredCredentials: [],
    complianceFrameworks: ['EAR', 'ITAR'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
];

export class DefenseConnectorFactory {
  static getAvailableConnectors(): ConnectorMetadata[] {
    return DEFENSE_CONNECTORS;
  }
}
