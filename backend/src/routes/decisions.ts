// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - DECISION API ROUTES
// Full lifecycle management, replay, and audit for enterprise decisions
// POST /decision/analyze | POST /decision/premortem | POST /decision/ghostboard
// =============================================================================

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { decisionService } from '../services/DecisionService.js';
import { preMortemService, ghostBoardService } from '../features/holy-shit/index.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createDecisionSchema = z.object({
  organizationId: z.string().default('demo'),
  userId: z.string().default('demo-user'),
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(10000),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  budget: z.number().positive().optional(),
  timeframe: z.string().optional(),
  deadline: z.string().datetime().optional(),
  stakeholders: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
});

const querySchema = z.object({
  organizationId: z.string().default('demo'),
  status: z.string().optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// =============================================================================
// DECISION CRUD
// =============================================================================

/**
 * POST /api/v1/decisions
 * Create a new decision to track
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input with Zod schema
    const validated = createDecisionSchema.parse(req.body);

    const decision = await decisionService.createDecision({
      organizationId: validated.organizationId,
      userId: validated.userId,
      title: validated.title,
      description: validated.description,
      category: validated.category,
      priority: validated.priority,
      budget: validated.budget,
      timeframe: validated.timeframe,
      deadline: validated.deadline ? new Date(validated.deadline) : undefined,
      stakeholders: validated.stakeholders,
      constraints: validated.constraints,
    });

    res.json({
      success: true,
      decision,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/decisions
 * List decisions for an organization
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const validated = querySchema.parse(req.query);

    const decisions = await decisionService.getDecisions(validated.organizationId, {
      status: validated.status,
      category: validated.category,
      limit: validated.limit,
      offset: validated.offset,
    });

    res.json({
      success: true,
      decisions,
      count: decisions.length,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/decisions/:id
 * Get a specific decision with full details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const decision = await decisionService.getDecision(req.params.id);

    if (!decision) {
      return res.status(404).json({
        success: false,
        error: 'Decision not found',
      });
    }

    res.json({
      success: true,
      decision,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * PATCH /api/v1/decisions/:id
 * Update a decision
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo-user', ...updates } = req.body;

    const decision = await decisionService.updateDecision(
      req.params.id,
      userId,
      updates
    );

    if (!decision) {
      return res.status(404).json({
        success: false,
        error: 'Decision not found',
      });
    }

    res.json({
      success: true,
      decision,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// INTEGRATED ANALYSIS ENDPOINTS
// These run analysis AND record it to the decision timeline
// =============================================================================

/**
 * POST /api/v1/decisions/:id/analyze
 * Quick analysis - runs Pre-Mortem with default agents
 */
router.post('/:id/analyze', async (req: Request, res: Response) => {
  try {
    const decision = await decisionService.getDecision(req.params.id);
    if (!decision) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    const { userId = 'demo-user', selectedAgents } = req.body;

    // Run Pre-Mortem analysis
    const result = await preMortemService.analyze({
      organizationId: decision.organizationId,
      userId,
      decision: decision.description,
      context: decision.context.description,
      timeframe: decision.timeframe,
      budget: decision.budget,
      stakeholders: decision.context.stakeholders,
      selectedAgents: selectedAgents || ['cfo', 'ciso', 'pessimist'],
      tier: 'enterprise',
    });

    // Record to decision timeline
    await decisionService.recordPreMortem(req.params.id, userId, result);

    res.json({
      success: true,
      result,
      message: 'Analysis recorded to decision timeline',
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/decisions/:id/premortem
 * Run a full Pre-Mortem analysis with custom agents
 */
router.post('/:id/premortem', async (req: Request, res: Response) => {
  try {
    const decision = await decisionService.getDecision(req.params.id);
    if (!decision) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    const {
      userId = 'demo-user',
      selectedAgents,
      additionalContext,
    } = req.body;

    const result = await preMortemService.analyze({
      organizationId: decision.organizationId,
      userId,
      decision: decision.description,
      context: additionalContext || decision.context.description,
      timeframe: decision.timeframe,
      budget: decision.budget,
      stakeholders: decision.context.stakeholders,
      selectedAgents,
      tier: 'enterprise',
    });

    await decisionService.recordPreMortem(req.params.id, userId, result);

    res.json({
      success: true,
      result,
      decisionId: req.params.id,
      recorded: true,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/decisions/:id/ghostboard
 * Run Ghost Board simulation
 */
router.post('/:id/ghostboard', async (req: Request, res: Response) => {
  try {
    const decision = await decisionService.getDecision(req.params.id);
    if (!decision) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    const {
      userId = 'demo-user',
      boardType,
      difficulty,
      focusAreas,
    } = req.body;

    const result = await ghostBoardService.runSession({
      organizationId: decision.organizationId,
      userId,
      proposalTitle: decision.title,
      proposalContent: decision.description + (decision.context.description ? `\n\n${decision.context.description}` : ''),
      boardType: boardType || 'standard',
      difficulty: difficulty || 'medium',
      focusAreas,
      tier: 'enterprise',
    });

    await decisionService.recordGhostBoard(req.params.id, userId, result);

    res.json({
      success: true,
      result,
      decisionId: req.params.id,
      recorded: true,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/decisions/:id/council
 * Record a council session (called from Council page)
 */
router.post('/:id/council', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo-user', councilResult } = req.body;

    const updated = await decisionService.recordCouncilSession(
      req.params.id,
      userId,
      councilResult
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    res.json({
      success: true,
      decision: updated,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// DECISION FINALIZATION
// =============================================================================

/**
 * POST /api/v1/decisions/:id/decide
 * Record the final decision
 */
router.post('/:id/decide', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo-user', finalDecision } = req.body;

    if (!finalDecision) {
      return res.status(400).json({
        success: false,
        error: 'Final decision is required',
      });
    }

    const updated = await decisionService.recordFinalDecision(
      req.params.id,
      userId,
      finalDecision
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    res.json({
      success: true,
      decision: updated,
      auditHash: updated.auditHash,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/decisions/:id/outcome
 * Record the actual outcome (post-implementation)
 */
router.post('/:id/outcome', async (req: Request, res: Response) => {
  try {
    const {
      userId = 'demo-user',
      actualResult,
      notes,
      lessonsLearned = [],
      predictedRisksOccurred = [],
      unpredictedIssues = [],
      financialImpact,
    } = req.body;

    if (!actualResult) {
      return res.status(400).json({
        success: false,
        error: 'Actual result is required',
      });
    }

    const updated = await decisionService.recordOutcome(
      req.params.id,
      userId,
      {
        actualResult,
        notes: notes || '',
        lessonsLearned,
        predictedRisksOccurred,
        unpredictedIssues,
        financialImpact,
      }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    res.json({
      success: true,
      decision: updated,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// TIMELINE & REPLAY (Black Box)
// =============================================================================

/**
 * GET /api/v1/decisions/:id/timeline
 * Get the full timeline (Decision DNA)
 */
router.get('/:id/timeline', async (req: Request, res: Response) => {
  try {
    const timeline = await decisionService.getTimeline(req.params.id);

    if (timeline.length === 0) {
      const decision = await decisionService.getDecision(req.params.id);
      if (!decision) {
        return res.status(404).json({ success: false, error: 'Decision not found' });
      }
    }

    res.json({
      success: true,
      timeline,
      eventCount: timeline.length,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/decisions/:id/replay
 * Get full replay data for step-by-step playback
 */
router.get('/:id/replay', async (req: Request, res: Response) => {
  try {
    const replay = await decisionService.getFullReplay(req.params.id);

    if (!replay) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    res.json({
      success: true,
      ...replay,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/decisions/:id/audit
 * Export for auditors (with hash verification)
 */
router.get('/:id/audit', async (req: Request, res: Response) => {
  try {
    const audit = await decisionService.exportForAudit(req.params.id);

    if (!audit) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    res.json({
      success: true,
      ...audit,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// ANALYTICS
// =============================================================================

/**
 * GET /api/v1/decisions/stats
 * Get decision statistics for an organization
 */
router.get('/org/:orgId/stats', async (req: Request, res: Response) => {
  try {
    const stats = await decisionService.getDecisionStats(req.params.orgId);

    res.json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
