// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NVIDIA RAPIDS / cuGraph GPU ANALYTICS API ROUTES
// Mounted at /api/v1/rapids
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { rapids } from '../services/gpu/RAPIDSService.js';
import { confidentialCompute } from '../services/gpu/ConfidentialComputeService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await rapids.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) { next(error); }
});

router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: rapids.getStats() });
});

// ─── Bias & Fairness Analysis ──────────────────────────────────────────

/**
 * POST /api/v1/rapids/bias/analyze
 * GPU-accelerated bias and fairness analysis
 */
router.post('/bias/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dataset, protectedAttributes, outcomeColumn, positiveOutcomeValue, fairnessThreshold } = req.body;

    if (!dataset || !protectedAttributes || !outcomeColumn) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: dataset, protectedAttributes, outcomeColumn',
      });
      return;
    }

    const result = await rapids.analyzeBias({
      dataset,
      protectedAttributes,
      outcomeColumn,
      positiveOutcomeValue: positiveOutcomeValue ?? true,
      fairnessThreshold,
    });

    logger.info(`[RAPIDS API] Bias analysis completed (${result.accelerator}, ${result.computeTimeMs}ms, ${result.datasetSize} rows)`);

    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Graph Analytics ───────────────────────────────────────────────────

/**
 * POST /api/v1/rapids/graph/analyze
 * GPU-accelerated graph analytics (PageRank, community detection, centrality)
 */
router.post('/graph/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes || !edges) {
      res.status(400).json({ success: false, error: 'Missing required fields: nodes, edges' });
      return;
    }

    if (nodes.length > 100_000) {
      res.status(400).json({ success: false, error: 'Maximum 100,000 nodes per request' });
      return;
    }

    const result = await rapids.analyzeGraph({ nodes, edges });

    logger.info(`[RAPIDS API] Graph analysis completed (${result.accelerator}, ${result.computeTimeMs}ms, ${result.nodeCount} nodes, ${result.edgeCount} edges)`);

    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Statistical Tests ─────────────────────────────────────────────────

/**
 * POST /api/v1/rapids/stats/test
 * GPU-accelerated statistical hypothesis testing
 */
router.post('/stats/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupA, groupB, testType, significance } = req.body;

    if (!groupA || !groupB || !testType) {
      res.status(400).json({ success: false, error: 'Missing required fields: groupA, groupB, testType' });
      return;
    }

    const result = await rapids.runStatisticalTest({ groupA, groupB, testType, significance });

    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Anomaly Detection ─────────────────────────────────────────────────

/**
 * POST /api/v1/rapids/anomaly/detect
 * GPU-accelerated anomaly detection on time series
 */
router.post('/anomaly/detect', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeSeries, sensitivity, method } = req.body;

    if (!timeSeries || !Array.isArray(timeSeries)) {
      res.status(400).json({ success: false, error: 'Missing required field: timeSeries (array)' });
      return;
    }

    const result = await rapids.detectAnomalies({ timeSeries, sensitivity, method });

    logger.info(`[RAPIDS API] Anomaly detection completed (${result.accelerator}, ${result.computeTimeMs}ms, ${result.anomalyCount}/${result.totalPoints} anomalies)`);

    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Confidential Computing ────────────────────────────────────────────

router.get('/cc/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await confidentialCompute.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) { next(error); }
});

router.get('/cc/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: confidentialCompute.getStats() });
});

router.get('/cc/policy', (_req: Request, res: Response) => {
  res.json({ success: true, data: confidentialCompute.getPolicy() });
});

router.put('/cc/policy', (req: Request, res: Response) => {
  confidentialCompute.updatePolicy(req.body);
  logger.info(`[CC API] Policy updated by ${req.user?.email || 'unknown'}`);
  res.json({ success: true, data: confidentialCompute.getPolicy() });
});

router.post('/cc/attest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gpuId } = req.body;
    const result = await confidentialCompute.verifyGPUAttestation(gpuId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

router.post('/cc/enforce', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await confidentialCompute.enforceConfidentialInference();
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

router.post('/cc/evidence', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organizationId || req.body.organizationId || 'default';
    const evidence = await confidentialCompute.generateCCEvidence(organizationId);
    res.json({ success: true, data: evidence });
  } catch (error) { next(error); }
});

export default router;
