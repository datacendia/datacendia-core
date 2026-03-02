/**
 * API Routes — Summaries
 *
 * Express route handler defining REST endpoints.
 * @module routes/summaries
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA - EXECUTIVE SUMMARY & MINUTES API
 * =============================================================================
 * Endpoints for generating and managing executive summaries
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { executiveSummaryService, type SummaryType } from '../services/ExecutiveSummaryService.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// POST /api/v1/summaries/generate - Generate executive summary
// =============================================================================

const generateSchema = z.object({
  organizationId: z.string().default('demo'),
  deliberationId: z.string().optional(),
  decisionId: z.string().optional(),
  type: z.enum([
    'COUNCIL_DELIBERATION',
    'DECISION_DNS',
    'PRE_MORTEM',
    'GHOST_BOARD',
    'DECISION_DEBT',
    'REGULATORY_ABSORB',
    'LIVE_DEMO',
  ]),
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  agents: z.array(z.object({
    name: z.string(),
    content: z.string(),
  })).optional(),
  decision: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  language: z.string().default('en'),
});

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input = generateSchema.parse(req.body);

    const summary = await executiveSummaryService.generateFromDeliberation(input as any);

    res.json({
      success: true,
      summary,
    });
  } catch (error: unknown) {
    logger.error(`Failed to generate summary: ${getErrorMessage(error)}`);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/summaries/minutes - Generate meeting minutes
// =============================================================================

router.post('/minutes', async (req: Request, res: Response) => {
  try {
    const input = generateSchema.parse(req.body);

    const minutes = await executiveSummaryService.generateMinutes(input as any);

    res.json({
      success: true,
      minutes,
    });
  } catch (error: unknown) {
    logger.error(`Failed to generate minutes: ${getErrorMessage(error)}`);
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/summaries - List summaries for organization
// =============================================================================

const listSchema = z.object({
  organizationId: z.string().default('demo'),
  type: z.enum([
    'COUNCIL_DELIBERATION',
    'DECISION_DNS',
    'PRE_MORTEM',
    'GHOST_BOARD',
    'DECISION_DEBT',
    'REGULATORY_ABSORB',
    'LIVE_DEMO',
  ]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { organizationId, type, limit, offset } = listSchema.parse(req.query);

    const summaries = await executiveSummaryService.getSummaries(organizationId, {
      type: type as SummaryType,
      limit,
      offset,
    });

    res.json({
      success: true,
      summaries,
      count: summaries.length,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/summaries/:id - Get summary by ID
// =============================================================================

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const summary = await executiveSummaryService.getSummaryById(id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    res.json({
      success: true,
      summary,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/summaries/:id/export - Export summary as markdown
// =============================================================================

router.get('/:id/export', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const format = req.query.format || 'markdown';

    const summary = await executiveSummaryService.getSummaryById(id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found',
      });
    }

    if (format === 'markdown') {
      const markdown = executiveSummaryService.exportAsMarkdown(summary);
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${summary.title.replace(/[^a-z0-9]/gi, '_')}.md"`);
      res.send(markdown);
    } else {
      res.json({
        success: true,
        summary,
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
