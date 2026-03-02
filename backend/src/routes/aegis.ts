// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaAegis™ API Routes
 * Strategic Defense Intelligence
 */

import { Router, Request, Response } from 'express';
import { cendiaAegisService } from '../services/CendiaAegisService.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /aegis/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    
    // Get counts for metrics
    const [threatCount, signalCount, briefingCount] = await Promise.all([
      cendiaAegisService.getActiveThreats(orgId).then(t => t.length).catch(() => 0),
      cendiaAegisService.getRecentSignals(orgId, { limit: 100 }).then(s => s.length).catch(() => 0),
      cendiaAegisService.getBriefings(orgId, 100).then(b => b.length).catch(() => 0),
    ]);
    
    res.json({
      success: true,
      data: {
        service: 'CendiaAegis',
        status: 'operational',
        version: '1.0.0',
        description: 'Strategic Defense Intelligence',
        capabilities: [
          'Multi-source threat signal ingestion',
          'AI-powered threat assessment',
          'Scenario generation and wargaming',
          'Countermeasure recommendation',
          'Executive briefing generation',
          'Real-time threat dashboard',
        ],
        metrics: {
          activeThreats: threatCount,
          recentSignals: signalCount,
          briefingsGenerated: briefingCount,
        },
        threatLevels: ['low', 'medium', 'high', 'critical', 'existential'],
        signalTypes: ['competitor', 'regulatory', 'market', 'technology', 'geopolitical', 'supply_chain', 'cyber', 'reputation'],
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// SIGNALS
// ===========================================================================

router.post('/signals', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const signal = await cendiaAegisService.ingestSignal(orgId, req.body);
    res.json({ success: true, data: signal });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/signals', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { signalType, severity, limit } = req.query;
    const signals = await cendiaAegisService.getRecentSignals(orgId, {
      signalType: signalType as any,
      severity: severity as any,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: signals });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// THREATS
// ===========================================================================

router.post('/threats', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const threat = await cendiaAegisService.createThreat(orgId, req.body);
    res.json({ success: true, data: threat });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/threats', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const threats = await cendiaAegisService.getActiveThreats(orgId);
    res.json({ success: true, data: threats });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.patch('/threats/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const threat = await cendiaAegisService.updateThreatStatus(req.params.id, status);
    res.json({ success: true, data: threat });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// SCENARIOS
// ===========================================================================

router.post('/threats/:id/scenarios', async (req: Request, res: Response) => {
  try {
    const scenarios = await cendiaAegisService.generateScenarios(req.params.id);
    res.json({ success: true, data: scenarios });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/threats/:id/scenarios', async (req: Request, res: Response) => {
  try {
    const scenarios = await cendiaAegisService.getThreatScenarios(req.params.id);
    res.json({ success: true, data: scenarios });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// COUNTERMEASURES
// ===========================================================================

router.post('/threats/:id/countermeasures', async (req: Request, res: Response) => {
  try {
    const countermeasures = await cendiaAegisService.generateCountermeasures(req.params.id);
    res.json({ success: true, data: countermeasures });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/threats/:id/countermeasures', async (req: Request, res: Response) => {
  try {
    const countermeasures = await cendiaAegisService.getThreatCountermeasures(req.params.id);
    res.json({ success: true, data: countermeasures });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.post('/countermeasures/:id/implement', async (req: Request, res: Response) => {
  try {
    const cm = await cendiaAegisService.implementCountermeasure(req.params.id);
    res.json({ success: true, data: cm });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// BRIEFINGS
// ===========================================================================

router.post('/briefings', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { threatId, briefingType } = req.body;
    const briefing = await cendiaAegisService.generateBriefing(orgId, threatId, briefingType);
    res.json({ success: true, data: briefing });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/briefings', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const briefings = await cendiaAegisService.getBriefings(orgId, limit);
    res.json({ success: true, data: briefings });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// DASHBOARD
// ===========================================================================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const dashboard = await cendiaAegisService.getDashboard(orgId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// EXPRESS MODE — Quick Intelligence Without Council
// ===========================================================================

/**
 * GET /aegis/express/briefing
 * Quick threat briefing directly (no Council needed)
 */
router.get('/express/briefing', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const threatId = req.query.threatId as string | undefined;
    const briefing = await cendiaAegisService.getQuickBriefing(orgId, threatId);
    res.json({ success: true, data: briefing });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /aegis/express/summary
 * Threat summary with risk score (no Council needed)
 */
router.get('/express/summary', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const summary = await cendiaAegisService.getThreatSummary(orgId);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// 10/10 ENHANCEMENTS — Advanced Threat Intelligence
// ===========================================================================

/**
 * GET /aegis/correlate
 * Signal Correlation Engine — find patterns across threat signals
 */
router.get('/correlate', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const result = await cendiaAegisService.correlateSignals(orgId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /aegis/playbook
 * Generate NIST 800-61 IR Playbook for an incident type
 */
router.post('/playbook', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { incidentType } = req.body;
    if (!incidentType) {
      return res.status(400).json({ success: false, error: { message: 'incidentType is required' } });
    }
    const result = await cendiaAegisService.generateIRPlaybook(orgId, incidentType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /aegis/hunt
 * Proactive Threat Hunting — hypothesis-driven queries against internal data
 */
router.post('/hunt', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { hypothesis, focusArea, lookbackDays } = req.body;
    const result = await cendiaAegisService.runThreatHunt(orgId, {
      hypothesis,
      focusArea,
      lookbackDays,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
