// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * ENTERPRISE CONNECTORS API ROUTES
 * =============================================================================
 * Exposes all available data connectors organized by vertical
 */

import { Router, Request, Response } from 'express';
import { GOVERNMENT_CONNECTORS } from '../connectors/government/index.js';
import { FINANCIAL_CONNECTORS } from '../connectors/financial/index.js';
import { HEALTHCARE_CONNECTORS } from '../connectors/healthcare/index.js';
import { SUPPLY_CHAIN_CONNECTORS } from '../connectors/supply-chain/index.js';
import { ENERGY_CONNECTORS } from '../connectors/energy/index.js';
import { INTERNATIONAL_CONNECTORS } from '../connectors/international/index.js';
import { DEFENSE_CONNECTORS } from '../connectors/defense/index.js';
import { AGRICULTURE_CONNECTORS } from '../connectors/agriculture/index.js';
import { TELECOM_CONNECTORS } from '../connectors/telecommunications/index.js';
import { TRANSPORTATION_CONNECTORS } from '../connectors/transportation/index.js';
import { AVIONICS_CONNECTORS } from '../connectors/avionics/index.js';
import { ConnectorMetadata } from '../connectors/BaseConnector.js';

const router = Router();

// Combine all connectors
const ALL_CONNECTORS: ConnectorMetadata[] = [
  ...GOVERNMENT_CONNECTORS,
  ...FINANCIAL_CONNECTORS,
  ...HEALTHCARE_CONNECTORS,
  ...SUPPLY_CHAIN_CONNECTORS,
  ...ENERGY_CONNECTORS,
  ...INTERNATIONAL_CONNECTORS,
  ...DEFENSE_CONNECTORS,
  ...AGRICULTURE_CONNECTORS,
  ...TELECOM_CONNECTORS,
  ...TRANSPORTATION_CONNECTORS,
  ...AVIONICS_CONNECTORS,
];

// Get all available connectors
router.get('/list', (req: Request, res: Response) => {
  const vertical = req.query.vertical as string;
  const category = req.query.category as string;
  const region = req.query.region as string;

  let connectors = ALL_CONNECTORS;

  if (vertical) {
    connectors = connectors.filter(c => c.vertical === vertical);
  }
  if (category) {
    connectors = connectors.filter(c => c.category === category);
  }
  if (region) {
    connectors = connectors.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
  }

  res.json({
    success: true,
    data: connectors,
    meta: {
      total: connectors.length,
      filters: { vertical, category, region },
    },
  });
});

// Get connector summary by vertical
router.get('/summary', (req: Request, res: Response) => {
  const verticals = new Map<string, { count: number; categories: Set<string> }>();

  for (const connector of ALL_CONNECTORS) {
    if (!verticals.has(connector.vertical)) {
      verticals.set(connector.vertical, { count: 0, categories: new Set() });
    }
    const v = verticals.get(connector.vertical)!;
    v.count++;
    v.categories.add(connector.category);
  }

  const summary = Array.from(verticals.entries()).map(([vertical, data]) => ({
    vertical,
    connectorCount: data.count,
    categories: Array.from(data.categories),
  }));

  res.json({
    success: true,
    data: {
      totalConnectors: ALL_CONNECTORS.length,
      verticals: summary,
    },
  });
});

// Get connectors by vertical
router.get('/vertical/:vertical', (req: Request, res: Response) => {
  const connectors = ALL_CONNECTORS.filter(c => c.vertical === req.params.vertical);
  
  const byCategory = new Map<string, ConnectorMetadata[]>();
  for (const c of connectors) {
    if (!byCategory.has(c.category)) {
      byCategory.set(c.category, []);
    }
    byCategory.get(c.category)!.push(c);
  }

  res.json({
    success: true,
    data: {
      vertical: req.params.vertical,
      totalConnectors: connectors.length,
      categories: Object.fromEntries(byCategory),
    },
  });
});

// Get specific connector details
router.get('/details/:id', (req: Request, res: Response) => {
  const connector = ALL_CONNECTORS.find(c => c.id === req.params.id);
  
  if (!connector) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Connector not found' },
    });
  }

  res.json({
    success: true,
    data: connector,
  });
});

// Get available verticals
router.get('/verticals', (req: Request, res: Response) => {
  const verticals = [...new Set(ALL_CONNECTORS.map(c => c.vertical))];
  
  res.json({
    success: true,
    data: verticals.map(v => ({
      id: v,
      name: v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, ' '),
      connectorCount: ALL_CONNECTORS.filter(c => c.vertical === v).length,
    })),
  });
});

// Get available regions
router.get('/regions', (req: Request, res: Response) => {
  const regions = [...new Set(ALL_CONNECTORS.map(c => c.region))];
  
  res.json({
    success: true,
    data: regions.map(r => ({
      id: r,
      connectorCount: ALL_CONNECTORS.filter(c => c.region === r).length,
    })),
  });
});

// Search connectors
router.get('/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  
  if (!query) {
    return res.json({ success: true, data: [] });
  }

  const results = ALL_CONNECTORS.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query) ||
    c.provider.toLowerCase().includes(query) ||
    c.dataTypes.some(dt => dt.toLowerCase().includes(query))
  );

  res.json({
    success: true,
    data: results,
    meta: { query, count: results.length },
  });
});

// Status endpoint
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      totalConnectors: ALL_CONNECTORS.length,
      verticals: [...new Set(ALL_CONNECTORS.map(c => c.vertical))].length,
      regions: [...new Set(ALL_CONNECTORS.map(c => c.region))].length,
    },
  });
});

export default router;
