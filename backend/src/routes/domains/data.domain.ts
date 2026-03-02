// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATA DOMAIN ROUTER - Data Intelligence & Analytics
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import metricsRoutes from '../metrics.js';
import alertsRoutes from '../alerts.js';
import forecastRoutes from '../forecasts.js';
import dataSourceRoutes from '../dataSources.js';
import lineageRoutes from '../lineage.js';
import druidRoutes from '../druid.js';
import summaryRoutes from '../summaries.js';
import modelRoutes from '../models.js';
import roiMetricsRoutes from '../roi-metrics.js';
import ragRoutes from '../rag.js';
import graphRoutes from '../graph.js';
import sampleDataRoutes from '../sample-data.js';

const router = Router();

// Community routes
router.use('/metrics', metricsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/predict', forecastRoutes);
router.use('/data-sources', dataSourceRoutes);
router.use('/lineage', lineageRoutes);
router.use('/druid', druidRoutes);
router.use('/summaries', summaryRoutes);
router.use('/models', modelRoutes);
router.use('/roi-metrics', roiMetricsRoutes);
router.use('/rag', ragRoutes);
router.use('/graph', graphRoutes);
router.use('/sample-data', sampleDataRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/forecasting', () => import('../forecasting.js')],
  ['/horizon', () => import('../horizon.js')],
]);

export default router;
