/**
 * Connector — Index
 *
 * External system connector for third-party integrations.
 *
 * @exports AgricultureConnectorFactory, AGRICULTURE_CONNECTORS
 * @module connectors/agriculture/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * AGRICULTURE & FOOD CONNECTORS
 * =============================================================================
 * Crop Data, Weather, Commodity Markets, Food Safety
 */

import { ConnectorMetadata } from '../BaseConnector.js';

export const AGRICULTURE_CONNECTORS: ConnectorMetadata[] = [
  // USDA
  {
    id: 'usda-wasde',
    name: 'USDA WASDE',
    description: 'World Agricultural Supply and Demand Estimates',
    vertical: 'agriculture',
    category: 'market-reports',
    provider: 'USDA',
    region: 'Global',
    dataTypes: ['crop-forecasts', 'supply', 'demand', 'trade'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://www.usda.gov/oce/commodity/wasde',
    requiredCredentials: [],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'usda-crop-progress',
    name: 'USDA Crop Progress',
    description: 'Weekly crop condition and progress reports',
    vertical: 'agriculture',
    category: 'crop-data',
    provider: 'USDA NASS',
    region: 'US',
    dataTypes: ['planting-progress', 'crop-conditions', 'harvest'],
    updateFrequency: 'weekly',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },

  // International
  {
    id: 'fao-stat',
    name: 'FAO STAT',
    description: 'UN Food and Agriculture Organization statistics',
    vertical: 'agriculture',
    category: 'statistics',
    provider: 'FAO',
    region: 'Global',
    dataTypes: ['production', 'trade', 'food-balance', 'prices'],
    updateFrequency: 'annual',
    documentationUrl: 'https://www.fao.org/faostat/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'fao-giews',
    name: 'FAO GIEWS',
    description: 'Global Information and Early Warning System',
    vertical: 'agriculture',
    category: 'food-security',
    provider: 'FAO',
    region: 'Global',
    dataTypes: ['food-prices', 'crop-prospects', 'alerts'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://www.fao.org/giews/',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // Satellite & Remote Sensing
  {
    id: 'nasa-modis',
    name: 'NASA MODIS Vegetation',
    description: 'Satellite vegetation indices for crop monitoring',
    vertical: 'agriculture',
    category: 'remote-sensing',
    provider: 'NASA',
    region: 'Global',
    dataTypes: ['ndvi', 'evi', 'land-cover', 'phenology'],
    updateFrequency: 'daily',
    documentationUrl: 'https://modis.gsfc.nasa.gov/',
    requiredCredentials: ['earthdata_token'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free NASA Earthdata registration',
  },
  {
    id: 'esa-sentinel',
    name: 'ESA Sentinel Hub',
    description: 'Copernicus satellite imagery',
    vertical: 'agriculture',
    category: 'remote-sensing',
    provider: 'ESA',
    region: 'Global',
    dataTypes: ['optical-imagery', 'radar', 'vegetation'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.sentinel-hub.com/',
    requiredCredentials: ['client_id', 'client_secret'],
    complianceFrameworks: [],
    compatibilityLabel: 'license_required',
    integrationNotes: 'BYO Sentinel Hub subscription; Webhook Adapter',
  },

  // Commodity Markets
  {
    id: 'cme-agriculture',
    name: 'CME Agricultural Futures',
    description: 'Chicago Mercantile Exchange grain futures',
    vertical: 'agriculture',
    category: 'commodities',
    provider: 'CME Group',
    region: 'Global',
    dataTypes: ['corn', 'soybeans', 'wheat', 'cattle', 'hogs'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://www.cmegroup.com/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['SOC2'],
    compatibilityLabel: 'license_required',
    integrationNotes: 'BYO CME market data subscription; Webhook Adapter',
  },
];

export class AgricultureConnectorFactory {
  static getAvailableConnectors(): ConnectorMetadata[] {
    return AGRICULTURE_CONNECTORS;
  }
}
