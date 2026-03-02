/**
 * Connector — Index
 *
 * External system connector for third-party integrations.
 *
 * @exports InternationalConnectorFactory, INTERNATIONAL_CONNECTORS
 * @module connectors/international/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * INTERNATIONAL & GLOBAL CONNECTORS
 * =============================================================================
 * UN Agencies, EU Institutions, International Organizations
 */

import { ConnectorMetadata } from '../BaseConnector.js';

export const INTERNATIONAL_CONNECTORS: ConnectorMetadata[] = [
  // United Nations
  {
    id: 'un-data',
    name: 'UN Data',
    description: 'United Nations Statistics Division',
    vertical: 'international',
    category: 'statistics',
    provider: 'United Nations',
    region: 'Global',
    dataTypes: ['population', 'economics', 'environment', 'social'],
    updateFrequency: 'annual',
    documentationUrl: 'https://data.un.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'un-ocha',
    name: 'UN OCHA HDX',
    description: 'Humanitarian Data Exchange',
    vertical: 'international',
    category: 'humanitarian',
    provider: 'UN OCHA',
    region: 'Global',
    dataTypes: ['crisis-data', 'refugee-flows', 'food-security', 'health'],
    updateFrequency: 'daily',
    documentationUrl: 'https://data.humdata.org/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'unhcr',
    name: 'UNHCR Refugee Data',
    description: 'UN Refugee Agency population statistics',
    vertical: 'international',
    category: 'humanitarian',
    provider: 'UNHCR',
    region: 'Global',
    dataTypes: ['refugee-populations', 'asylum-seekers', 'displacement'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://www.unhcr.org/refugee-statistics/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // European Union
  {
    id: 'eurostat',
    name: 'Eurostat',
    description: 'EU Statistical Office',
    vertical: 'international',
    category: 'statistics',
    provider: 'European Commission',
    region: 'EU',
    dataTypes: ['economics', 'population', 'trade', 'environment'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://ec.europa.eu/eurostat/',
    requiredCredentials: [],
    complianceFrameworks: ['GDPR'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'ecb-sdw',
    name: 'ECB Statistical Data Warehouse',
    description: 'European Central Bank financial data',
    vertical: 'international',
    category: 'financial',
    provider: 'ECB',
    region: 'EU',
    dataTypes: ['interest-rates', 'exchange-rates', 'monetary-aggregates'],
    updateFrequency: 'daily',
    documentationUrl: 'https://sdw.ecb.europa.eu/',
    requiredCredentials: [],
    complianceFrameworks: ['GDPR'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'eu-open-data',
    name: 'EU Open Data Portal',
    description: 'European Union institutions open data',
    vertical: 'international',
    category: 'open-data',
    provider: 'European Commission',
    region: 'EU',
    dataTypes: ['legislation', 'statistics', 'geographic', 'environment'],
    updateFrequency: 'varies',
    documentationUrl: 'https://data.europa.eu/',
    requiredCredentials: [],
    complianceFrameworks: ['GDPR'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // World Bank & IMF
  {
    id: 'world-bank',
    name: 'World Bank Open Data',
    description: 'Development indicators and economic data',
    vertical: 'international',
    category: 'development',
    provider: 'World Bank',
    region: 'Global',
    dataTypes: ['gdp', 'poverty', 'education', 'health', 'infrastructure'],
    updateFrequency: 'annual',
    documentationUrl: 'https://data.worldbank.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'imf-data',
    name: 'IMF Data',
    description: 'International Monetary Fund statistics',
    vertical: 'international',
    category: 'financial',
    provider: 'IMF',
    region: 'Global',
    dataTypes: ['balance-of-payments', 'exchange-rates', 'fiscal', 'debt'],
    updateFrequency: 'quarterly',
    documentationUrl: 'https://data.imf.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // OECD
  {
    id: 'oecd-data',
    name: 'OECD Data',
    description: 'Organisation for Economic Co-operation and Development',
    vertical: 'international',
    category: 'economics',
    provider: 'OECD',
    region: 'Global',
    dataTypes: ['economics', 'education', 'environment', 'governance'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://data.oecd.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // Regional Banks
  {
    id: 'adb',
    name: 'Asian Development Bank',
    description: 'ADB statistics and development data',
    vertical: 'international',
    category: 'development',
    provider: 'ADB',
    region: 'Asia-Pacific',
    dataTypes: ['economics', 'poverty', 'infrastructure', 'environment'],
    updateFrequency: 'annual',
    documentationUrl: 'https://data.adb.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'afdb',
    name: 'African Development Bank',
    description: 'AfDB statistics portal',
    vertical: 'international',
    category: 'development',
    provider: 'AfDB',
    region: 'Africa',
    dataTypes: ['economics', 'development', 'infrastructure'],
    updateFrequency: 'annual',
    documentationUrl: 'https://dataportal.opendataforafrica.org/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // Other International
  {
    id: 'bis',
    name: 'Bank for International Settlements',
    description: 'Central bank statistics',
    vertical: 'international',
    category: 'financial',
    provider: 'BIS',
    region: 'Global',
    dataTypes: ['credit', 'derivatives', 'fx-turnover', 'banking'],
    updateFrequency: 'quarterly',
    documentationUrl: 'https://www.bis.org/statistics/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'iea-energy',
    name: 'IEA Energy Data',
    description: 'International Energy Agency statistics',
    vertical: 'international',
    category: 'energy',
    provider: 'IEA',
    region: 'Global',
    dataTypes: ['energy-production', 'consumption', 'emissions', 'prices'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://www.iea.org/data-and-statistics',
    requiredCredentials: ['subscription'],
    complianceFrameworks: [],
    compatibilityLabel: 'license_required',
    integrationNotes: 'BYO IEA subscription for full access; Webhook Adapter',
  },
];

export class InternationalConnectorFactory {
  static getAvailableConnectors(): ConnectorMetadata[] {
    return INTERNATIONAL_CONNECTORS;
  }
}
