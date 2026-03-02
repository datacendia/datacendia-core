// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Express Intelligence Routes
 * 
 * Quick intelligence endpoints — use services directly without Council.
 * 
 * Two modes:
 * - Express (default): LLM-powered analysis, 30s-5min
 * - Deliberative: Full Council deliberation, 20-40min (redirects to council routes)
 * 
 * Routes:
 *   POST /api/v1/express/analyze              - Generic Express analysis
 *   GET  /api/v1/express/compliance/report     - Compliance report (no Council)
 *   POST /api/v1/express/compliance/remediate  - Remediation steps (no Council)
 *   GET  /api/v1/express/threats/briefing      - Threat briefing (no Council)
 *   GET  /api/v1/express/threats/summary       - Threat summary (no Council)
 *   POST /api/v1/express/simulation/quick      - Quick scenario analysis (no Council)
 *   GET  /api/v1/express/simulation/resilience - Resilience score (no Council)
 *   GET  /api/v1/express/decisions/insights    - Decision pattern insights (no Council)
 *   POST /api/v1/express/forecast              - Quick forecast (no Council)
 */

import { Router, Request, Response } from 'express';
import { expressIntelligenceService } from '../services/express/ExpressIntelligenceService.js';
import { cendiaPanopticonService } from '../services/CendiaPanopticonService.js';
import { cendiaAegisService } from '../services/CendiaAegisService.js';
import cendiaCrucibleService from '../services/CendiaCrucibleService.js';
import { echoExpressService } from '../services/express/EchoExpressService.js';
import { cendiaHorizonService } from '../services/CendiaHorizonService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// =============================================================================
// GENERIC EXPRESS ANALYSIS
// =============================================================================

/**
 * POST /express/analyze
 * Run Express analysis on any domain
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { query, domain, context, mode } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    // Check if should auto-escalate to Deliberative
    const request = {
      organizationId: user.organizationId,
      userId: user.id,
      query,
      domain: domain || 'general',
      context,
      mode,
    };

    const escalation = expressIntelligenceService.shouldEscalate(request);
    if (escalation.shouldEscalate && mode !== 'express') {
      return res.json({
        mode: 'escalation_suggested',
        reason: escalation.reason,
        message: 'This query may benefit from Council deliberation. Set mode=express to force Express mode, or use /api/v1/council/query for deliberation.',
      });
    }

    const result = await expressIntelligenceService.analyze(request);
    res.json(result);
  } catch (error: any) {
    logger.error('Express analysis failed:', error);
    res.status(500).json({ error: 'Express analysis failed', details: error.message });
  }
});

// =============================================================================
// COMPLIANCE — EXPRESS MODE
// =============================================================================

/**
 * GET /express/compliance/report
 * Full compliance report without Council
 */
router.get('/compliance/report', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const report = await cendiaPanopticonService.getComplianceReport(user.organizationId);
    res.json(report);
  } catch (error: any) {
    logger.error('Express compliance report failed:', error);
    res.status(500).json({ error: 'Compliance report generation failed', details: error.message });
  }
});

/**
 * POST /express/compliance/remediate
 * Generate remediation steps without Council
 */
router.post('/compliance/remediate', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { violationIds } = req.body;

    const result = await cendiaPanopticonService.generateRemediationSteps(
      user.organizationId,
      violationIds
    );
    res.json(result);
  } catch (error: any) {
    logger.error('Express remediation failed:', error);
    res.status(500).json({ error: 'Remediation generation failed', details: error.message });
  }
});

// =============================================================================
// THREAT INTELLIGENCE — EXPRESS MODE
// =============================================================================

/**
 * GET /express/threats/briefing
 * Quick threat briefing without Council
 */
router.get('/threats/briefing', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const threatId = req.query.threatId as string | undefined;

    const briefing = await cendiaAegisService.getQuickBriefing(
      user.organizationId,
      threatId
    );
    res.json(briefing);
  } catch (error: any) {
    logger.error('Express threat briefing failed:', error);
    res.status(500).json({ error: 'Threat briefing generation failed', details: error.message });
  }
});

/**
 * GET /express/threats/summary
 * Threat summary with risk score without Council
 */
router.get('/threats/summary', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const summary = await cendiaAegisService.getThreatSummary(user.organizationId);
    res.json(summary);
  } catch (error: any) {
    logger.error('Express threat summary failed:', error);
    res.status(500).json({ error: 'Threat summary failed', details: error.message });
  }
});

// =============================================================================
// SIMULATION — EXPRESS MODE
// =============================================================================

/**
 * POST /express/simulation/quick
 * Quick 3-outcome scenario analysis without Council
 */
router.post('/simulation/quick', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { scenarioType, description } = req.body;

    if (!scenarioType) {
      return res.status(400).json({
        error: 'scenarioType is required',
        validTypes: [
          'FINANCIAL_STRESS', 'OPERATIONAL_SHOCK', 'CYBER_ATTACK',
          'REGULATORY_CHANGE', 'CULTURAL_SHIFT', 'ESG_EVENT',
          'MA_SCENARIO', 'MARKET_DISRUPTION', 'SUPPLY_CHAIN',
          'TALENT_EXODUS', 'TECHNOLOGY_FAILURE', 'BLACK_SWAN', 'CUSTOM',
        ],
      });
    }

    const result = await cendiaCrucibleService.getQuickSimulation(
      user.organizationId,
      scenarioType,
      description
    );
    res.json(result);
  } catch (error: any) {
    logger.error('Express simulation failed:', error);
    res.status(500).json({ error: 'Quick simulation failed', details: error.message });
  }
});

/**
 * GET /express/simulation/resilience
 * Resilience score without running full simulation
 */
router.get('/simulation/resilience', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const score = await cendiaCrucibleService.getResilienceScore(user.organizationId);
    res.json(score);
  } catch (error: any) {
    logger.error('Express resilience score failed:', error);
    res.status(500).json({ error: 'Resilience score failed', details: error.message });
  }
});

// =============================================================================
// DECISION INTELLIGENCE (ECHO) — EXPRESS MODE
// =============================================================================

/**
 * GET /express/decisions/insights
 * Quick decision pattern summary without Council
 */
router.get('/decisions/insights', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const insights = await echoExpressService.getExpressDecisionInsights(user.organizationId);
    res.json(insights);
  } catch (error: any) {
    logger.error('Express decision insights failed:', error);
    res.status(500).json({ error: 'Decision insights failed', details: error.message });
  }
});

// =============================================================================
// FORECASTING (HORIZON) — EXPRESS MODE
// =============================================================================

/**
 * POST /express/forecast
 * Quick forecast without full multi-agent simulation
 */
router.post('/forecast', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { question, timeHorizon } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    const forecast = await cendiaHorizonService.getExpressForecast(question, {
      timeHorizon: timeHorizon || '90d',
      organizationId: user.organizationId,
    });
    res.json(forecast);
  } catch (error: any) {
    logger.error('Express forecast failed:', error);
    res.status(500).json({ error: 'Forecast generation failed', details: error.message });
  }
});

// =============================================================================
// MODE COMPARISON
// =============================================================================

/**
 * GET /express/modes
 * Explain the two modes to the client
 */
router.get('/modes', (_req: Request, res: Response) => {
  res.json({
    express: {
      name: 'Quick Intelligence',
      description: 'LLM-powered analysis without Council deliberation',
      speed: '30 seconds - 5 minutes',
      bestFor: 'Routine checks, quick assessments, operational decisions',
      endpoints: [
        'GET  /express/compliance/report',
        'POST /express/compliance/remediate',
        'GET  /express/threats/briefing',
        'GET  /express/threats/summary',
        'POST /express/simulation/quick',
        'GET  /express/simulation/resilience',
        'GET  /express/decisions/insights',
        'POST /express/forecast',
        'POST /express/analyze',
      ],
    },
    deliberative: {
      name: 'Strategic Deliberation',
      description: 'Full Council deliberation with multi-agent analysis',
      speed: '20 - 40 minutes',
      bestFor: 'Strategic decisions, high-stakes analysis, complex issues',
      endpoints: [
        'POST /council/query',
        'POST /council/deliberate',
      ],
    },
    guidance: 'Use Express for 80% of day-to-day intelligence. Use Deliberative for complex, high-stakes decisions where multi-perspective analysis adds value.',
  });
});

export default router;
