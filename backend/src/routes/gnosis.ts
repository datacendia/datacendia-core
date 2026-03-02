// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GNOSIS™ API ROUTES
// Sovereign Education Engine - "Teaches humans how to execute AI decisions"
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { gnosisService } from '../services/gnosisService.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// Status endpoints for enterprise testing
router.get('/status', (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0' } });
});

router.get('/stats', (req: Request, res: Response) => {
  res.json({ success: true, data: { totalPaths: 0, activeUsers: 0, completedModules: 0 } });
});

router.post('/search', (req: Request, res: Response) => {
  res.json({ success: true, data: { results: [], query: req.body.query, total: 0 } });
});

router.get('/insights', (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

// Validation schemas
const createPathSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  sourceDecision: z.string().uuid().optional(),
  skills: z.array(z.string()),
  targetRole: z.string().optional(),
  urgency: z.enum(['immediate', 'within_week', 'within_month', 'optional']).optional(),
  userId: z.string().uuid().optional(),
});

const updateProgressSchema = z.object({
  moduleId: z.string().uuid(),
  completed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
});

const submitAssessmentSchema = z.object({
  answers: z.record(z.string()),
});

/**
 * POST /api/v1/gnosis/generate-from-decision
 * Generate learning paths from a Council decision
 */
router.post('/generate-from-decision', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId } = req.body;
    const orgId = req.organizationId!;

    if (!deliberationId) {
      res.status(400).json({
        success: false,
        error: 'deliberationId is required',
      });
      return;
    }

    const impact = await gnosisService.generateLearningFromDecision(deliberationId, orgId);

    res.json({
      success: true,
      data: impact,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to generate learning:', error);
    next(error);
  }
});

/**
 * POST /api/v1/gnosis/paths
 * Create a new learning path
 */
router.post('/paths', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createPathSchema.parse(req.body);
    const orgId = req.organizationId!;

    const path = await gnosisService.createLearningPath({
      ...data,
      organizationId: orgId,
    });

    res.json({
      success: true,
      data: path,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to create path:', error);
    next(error);
  }
});

/**
 * GET /api/v1/gnosis/paths/:pathId
 * Get a specific learning path
 */
router.get('/paths/:pathId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pathId } = req.params;
    // Implementation would fetch from database
    res.json({
      success: true,
      data: { id: pathId, message: 'Path details' },
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to get path:', error);
    next(error);
  }
});

/**
 * PUT /api/v1/gnosis/paths/:pathId/progress
 * Update learning progress
 */
router.put('/paths/:pathId/progress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pathId } = req.params;
    const userId = req.user?.id || 'anonymous';
    const data = updateProgressSchema.parse(req.body);

    const path = await gnosisService.updateProgress(
      pathId,
      userId,
      data.moduleId,
      data.completed,
      data.score
    );

    res.json({
      success: true,
      data: path,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to update progress:', error);
    next(error);
  }
});

/**
 * GET /api/v1/gnosis/profile
 * Get user's skill profile
 */
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const orgId = req.organizationId!;

    const profile = await gnosisService.getUserSkillProfile(userId, orgId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to get profile:', error);
    next(error);
  }
});

/**
 * GET /api/v1/gnosis/analytics
 * Get learning analytics for organization
 */
router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const analytics = await gnosisService.getLearningAnalytics(orgId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to get analytics:', error);
    next(error);
  }
});

/**
 * POST /api/v1/gnosis/assessments
 * Start a skill assessment
 */
router.post('/assessments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skill } = req.body;
    const userId = req.user?.id || 'anonymous';
    const orgId = req.organizationId!;

    if (!skill) {
      res.status(400).json({
        success: false,
        error: 'skill is required',
      });
      return;
    }

    const assessment = await gnosisService.takeAssessment(userId, skill, orgId);

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to start assessment:', error);
    next(error);
  }
});

/**
 * POST /api/v1/gnosis/assessments/:assessmentId/submit
 * Submit assessment answers
 */
router.post('/assessments/:assessmentId/submit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = req.params;
    const data = submitAssessmentSchema.parse(req.body);

    const result = await gnosisService.submitAssessment(assessmentId, data.answers);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to submit assessment:', error);
    next(error);
  }
});

/**
 * GET /api/v1/gnosis/dashboard
 * Get Gnosis dashboard summary
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const orgId = req.organizationId!;

    const [profile, analytics] = await Promise.all([
      gnosisService.getUserSkillProfile(userId, orgId),
      gnosisService.getLearningAnalytics(orgId),
    ]);

    res.json({
      success: true,
      data: {
        userProfile: {
          strengths: profile.strengths,
          gaps: profile.gaps,
          learningStyle: profile.learningStyle,
          skillCount: Object.keys(profile.skills).length,
        },
        organizationMetrics: {
          totalLearners: analytics.totalLearners,
          activeLearners: analytics.activeLearners,
          avgCompletionRate: analytics.avgCompletionRate,
          decisionReadiness: analytics.decisionReadiness,
        },
        recommendedPaths: profile.recommendedPaths,
        topPerformers: analytics.topPerformers.slice(0, 5),
        atRiskLearners: analytics.atRiskLearners.slice(0, 5),
      },
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to get dashboard:', error);
    next(error);
  }
});

/**
 * GET /api/v1/gnosis/decision-readiness
 * Get organization's readiness to execute recent decisions
 */
router.get('/decision-readiness', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const analytics = await gnosisService.getLearningAnalytics(orgId);

    res.json({
      success: true,
      data: {
        readinessScore: analytics.decisionReadiness,
        totalLearners: analytics.totalLearners,
        activeLearners: analytics.activeLearners,
        completedPaths: analytics.completedPaths,
        status: analytics.decisionReadiness >= 80 ? 'ready' :
                analytics.decisionReadiness >= 50 ? 'partial' : 'not_ready',
        message: analytics.decisionReadiness >= 80 
          ? 'Organization is ready to execute recent Council decisions'
          : analytics.decisionReadiness >= 50
          ? 'Some teams need additional training before execution'
          : 'Significant training gaps detected - prioritize learning paths',
      },
    });
  } catch (error) {
    logger.error('[Gnosis API] Failed to get decision readiness:', error);
    next(error);
  }
});

export default router;
