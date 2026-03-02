// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// AUTO-HEAL API ROUTE
// Proxies AI fix generation requests through the backend to avoid CORS issues
// with direct browser → Ollama calls
// =============================================================================

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { ollama } from '../services/ollama.js';

const router = Router();

// =============================================================================
// POST /api/v1/auto-heal/generate - Generate a fix using Ollama
// =============================================================================

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { model, prompt, systemPrompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PROMPT', message: 'prompt is required' },
      });
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    logger.info('[AutoHeal] Generating fix', {
      model: model || 'default',
      promptLength: fullPrompt.length,
    });

    const response = await ollama.generate(fullPrompt, {
      model: model || undefined,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.num_predict ?? 2000,
    });

    logger.info('[AutoHeal] Fix generated', {
      responseLength: response.length,
    });

    return res.json({
      success: true,
      data: { response },
    });
  } catch (error: any) {
    const message = error?.message || 'Unknown error generating fix';
    logger.error('[AutoHeal] Generate failed:', message);

    return res.status(502).json({
      success: false,
      error: {
        code: 'OLLAMA_ERROR',
        message,
      },
    });
  }
});

// =============================================================================
// GET /api/v1/auto-heal/status - Check if Ollama is reachable from backend
// =============================================================================

router.get('/status', async (_req: Request, res: Response) => {
  try {
    const available = await ollama.isAvailable();

    if (available) {
      const models = await ollama.listModels();
      return res.json({
        success: true,
        data: {
          ollamaRunning: true,
          modelCount: models.length,
          models: models.map((m) => m.name),
        },
      });
    }

    return res.json({
      success: true,
      data: { ollamaRunning: false, modelCount: 0, models: [] },
    });
  } catch (error: any) {
    return res.json({
      success: true,
      data: { ollamaRunning: false, modelCount: 0, models: [], error: error?.message },
    });
  }
});

export default router;
