// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA - MODEL MANAGEMENT API
 * =============================================================================
 * Endpoints for managing Ollama models and user preferences
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { config } from '../config/index.js';
import {
  MODEL_REGISTRY,
  AGENT_CONFIG,
  getAllModels,
  getAllAgents,
  getModelForAgent,
  setUserModelPreferences,
  getUserModelPreferences,
  type ModelConfig,
  type UserModelPreferences,
} from '../config/models.js';
import { aiModelSelector, LICENSE_TIERS, type LicenseTier } from '../config/aiModels.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// GET /api/v1/models - List all available models
// =============================================================================

router.get('/', async (req: Request, res: Response) => {
  try {
    // Get installed models from Ollama
    const ollamaResponse = await fetch(`${config.ollamaBaseUrl}/api/tags`);
    const ollamaData = await ollamaResponse.json() as { models: Array<{ name: string; size: number; modified_at: string }> };
    
    const installedModels = new Set(ollamaData.models?.map((m: { name: string }) => m.name) || []);

    // Enrich our model registry with installation status
    const models = Object.entries(MODEL_REGISTRY).map(([key, model]) => ({
      key,
      ...model,
      installed: installedModels.has(model.id),
    }));

    res.json({
      success: true,
      models,
      installedCount: models.filter(m => m.installed).length,
      totalCount: models.length,
      ollamaModels: ollamaData.models || [],
    });
  } catch (error: unknown) {
    logger.error(`Failed to fetch models: ${getErrorMessage(error)}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models',
      details: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/models/agents - List all agents and their model assignments
// =============================================================================

router.get('/agents', async (req: Request, res: Response) => {
  try {
    const agents = Object.entries(AGENT_CONFIG).map(([key, agent]) => ({
      id: key,
      ...agent,
      modelId: getModelForAgent(key),
      modelConfig: MODEL_REGISTRY[agent.model],
    }));

    res.json({
      success: true,
      agents,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/models/status - Check Ollama status and model availability
// =============================================================================

router.get('/status', async (req: Request, res: Response) => {
  try {
    // Check Ollama health
    const healthCheck = await fetch(`${config.ollamaBaseUrl}/api/tags`).catch(() => null);
    const isOllamaRunning = healthCheck?.ok ?? false;

    if (!isOllamaRunning) {
      return res.json({
        success: true,
        ollamaRunning: false,
        message: 'Ollama is not running. Start it with: ollama serve',
      });
    }

    // Get installed models
    const ollamaData = await healthCheck!.json() as { models: Array<{ name: string; size: number }> };
    const installedModels = ollamaData.models || [];

    // Check which required models are missing
    const requiredModels = [
      { id: 'qwen3:32b', role: 'Flagship (Chief, CMO, Strategy)' },
      { id: 'deepseek-r1:32b', role: 'Reasoning (CFO, CISO, Risk, Legal)' },
      { id: 'qwen3-coder:30b', role: 'Coder (CTO, CDO, Flow)' },
      { id: 'llama3.2:3b', role: 'Fast (COO, Support)' },
      { id: 'llama3.3:70b', role: 'Large (Council, Executive Decisions)' },
    ];

    const modelStatus = requiredModels.map(req => ({
      ...req,
      installed: installedModels.some((m: { name: string }) => m.name === req.id),
      size: installedModels.find((m: { name: string }) => m.name === req.id)?.size || null,
    }));

    const missingModels = modelStatus.filter(m => !m.installed);
    const allInstalled = missingModels.length === 0;

    res.json({
      success: true,
      ollamaRunning: true,
      ollamaUrl: config.ollamaBaseUrl,
      allModelsInstalled: allInstalled,
      modelStatus,
      missingModels,
      installedCount: installedModels.length,
      pullCommands: missingModels.map(m => `ollama pull ${m.id}`),
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/models/pull - Pull a model from Ollama
// =============================================================================

const pullSchema = z.object({
  modelId: z.string().min(1),
});

router.post('/pull', async (req: Request, res: Response) => {
  try {
    const { modelId } = pullSchema.parse(req.body);

    logger.info(`Starting pull for model: ${modelId}`);

    // Start the pull (this returns immediately, pull happens in background)
    const response = await fetch(`${config.ollamaBaseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelId, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start pull: ${response.statusText}`);
    }

    res.json({
      success: true,
      message: `Started pulling ${modelId}`,
      modelId,
    });
  } catch (error: unknown) {
    logger.error(`Failed to pull model: ${getErrorMessage(error)}`);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/models/preferences - Get user model preferences
// =============================================================================

router.get('/preferences', async (req: Request, res: Response) => {
  try {
    const preferences = getUserModelPreferences();
    res.json({
      success: true,
      preferences,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// PUT /api/v1/models/preferences - Update user model preferences
// =============================================================================

const preferencesSchema = z.object({
  defaultModel: z.string().optional(),
  agentOverrides: z.record(z.string()).optional(),
  useVision: z.boolean().optional(),
});

router.put('/preferences', async (req: Request, res: Response) => {
  try {
    const preferences = preferencesSchema.parse(req.body);
    setUserModelPreferences(preferences);

    logger.info(`Updated model preferences: ${JSON.stringify(preferences)}`);

    res.json({
      success: true,
      message: 'Preferences updated',
      preferences: getUserModelPreferences(),
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/models/test - Test a model with a simple prompt
// =============================================================================

const testSchema = z.object({
  modelId: z.string().min(1),
  prompt: z.string().default('Hello! Please respond with a single word.'),
});

router.post('/test', async (req: Request, res: Response) => {
  try {
    const { modelId, prompt } = testSchema.parse(req.body);

    const startTime = Date.now();
    
    const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        prompt,
        stream: false,
        options: { num_predict: 50 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Model test failed: ${response.statusText}`);
    }

    const data = await response.json() as { response: string; total_duration?: number };
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      modelId,
      response: data.response,
      durationMs: duration,
      ollamaDurationMs: data.total_duration ? data.total_duration / 1000000 : null,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/models/tiers - License tier capabilities and model gating
// =============================================================================

router.get('/tiers', async (req: Request, res: Response) => {
  try {
    const requestedTier = (req.query['tier'] as LicenseTier) || undefined;
    const currentTier = aiModelSelector.getTier();
    const caps = aiModelSelector.getTierCapabilities(requestedTier);
    const visibleModels = aiModelSelector.getAllModels(requestedTier);

    res.json({
      success: true,
      currentTier,
      requestedTier: requestedTier || currentTier,
      capabilities: caps,
      visibleModels: Object.entries(visibleModels).map(([type, model]) => ({
        type,
        id: (model as any).id,
        description: (model as any).description,
      })),
      allTiers: Object.entries(LICENSE_TIERS).map(([tier, tierCaps]) => ({
        tier,
        ...tierCaps,
        modelCount: tierCaps.allowedModelTypes.length,
      })),
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// PUT /api/v1/models/tiers - Set license tier (admin only)
// =============================================================================

router.put('/tiers', async (req: Request, res: Response) => {
  try {
    const { tier } = z.object({ tier: z.enum(['pilot', 'enterprise', 'sovereign']) }).parse(req.body);
    aiModelSelector.setTier(tier);

    res.json({
      success: true,
      message: `License tier set to "${tier}"`,
      tier,
      capabilities: aiModelSelector.getTierCapabilities(),
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
