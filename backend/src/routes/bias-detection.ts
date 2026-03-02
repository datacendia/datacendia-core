// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NLP BIAS DETECTION API ROUTES — CendiaBiasGuard™
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { nlpBiasDetectionService } from '../services/dcii/NLPBiasDetectionService.js';

const router = Router();

// Health (no auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'bias-detection', timestamp: new Date().toISOString() } });
});

router.get('/status', async (_req: Request, res: Response) => {
  const ollamaAvailable = await nlpBiasDetectionService.checkOllama();
  res.json({
    success: true,
    data: {
      engine: ollamaAvailable ? 'ollama-nlp' : 'statistical-fallback',
      ollamaAvailable,
      biasCategories: [
        'anchoring', 'confirmation', 'availability', 'sunk_cost', 'authority',
        'groupthink', 'recency', 'framing', 'survivorship', 'dunning_kruger',
      ],
    },
  });
});

router.use(devAuth);

// =============================================================================
// BIAS ANALYSIS
// =============================================================================

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { text, deliberationId, organizationId } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Missing "text" to analyze' });
    }
    const result = await nlpBiasDetectionService.analyze(text, { deliberationId, organizationId });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/analyze/statistical', (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Missing "text" to analyze' });
    }
    const detections = nlpBiasDetectionService.analyzeStatistical(text);
    res.json({ success: true, data: { detections, engine: 'statistical-fallback' } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// ENGINE CHECK
// =============================================================================

router.post('/check-engine', async (_req: Request, res: Response) => {
  try {
    const available = await nlpBiasDetectionService.checkOllama();
    res.json({ success: true, data: { ollamaAvailable: available } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
