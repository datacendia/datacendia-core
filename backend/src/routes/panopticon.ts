// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ API Routes
 * Global Regulation Engine
 */

import { Router, Request, Response } from 'express';
import { cendiaPanopticonService, REGULATORY_FRAMEWORKS } from '../services/CendiaPanopticonService.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// Apply devAuth to all routes to get organizationId from seeded user
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /panopticon/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    
    // Get counts for dashboard
    const [regulationCount, violationCount, gapCount] = await Promise.all([
      cendiaPanopticonService.getOrganizationRegulations(orgId).then(r => r.length).catch(() => 0),
      cendiaPanopticonService.getOpenViolations(orgId).then(v => v.length).catch(() => 0),
      cendiaPanopticonService.getComplianceGaps(orgId).then(g => g.length).catch(() => 0),
    ]);
    
    res.json({
      success: true,
      data: {
        service: 'CendiaPanopticon',
        status: 'operational',
        version: '1.0.0',
        description: 'Global Regulation Engine',
        capabilities: [
          'Multi-jurisdiction regulatory tracking',
          '50+ regulatory framework support',
          'Real-time violation detection',
          'AI-powered regulatory forecasting',
          'Compliance gap analysis',
          'Obligation mapping',
        ],
        supportedFrameworks: Object.keys(REGULATORY_FRAMEWORKS).length,
        metrics: {
          activeRegulations: regulationCount,
          openViolations: violationCount,
          complianceGaps: gapCount,
        },
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// FRAMEWORKS
// ===========================================================================

/**
 * GET /panopticon/frameworks
 * Get all supported regulatory frameworks
 */
router.get('/frameworks', async (_req: Request, res: Response) => {
  try {
    const frameworks = await cendiaPanopticonService.getFrameworks();
    res.json({ success: true, data: frameworks });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/frameworks/category/:category
 * Get frameworks by category
 */
router.get('/frameworks/category/:category', async (req: Request, res: Response) => {
  try {
    const frameworks = await cendiaPanopticonService.getFrameworksByCategory(req.params.category);
    res.json({ success: true, data: frameworks });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/frameworks/jurisdiction/:jurisdiction
 * Get frameworks by jurisdiction
 */
router.get('/frameworks/jurisdiction/:jurisdiction', async (req: Request, res: Response) => {
  try {
    const frameworks = await cendiaPanopticonService.getFrameworksByJurisdiction(req.params.jurisdiction);
    res.json({ success: true, data: frameworks });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// REGULATIONS
// ===========================================================================

/**
 * POST /panopticon/regulations/ingest
 * Ingest a regulation
 */
router.post('/regulations/ingest', async (req: Request, res: Response) => {
  try {
    const { frameworkCode, version, sourceUrl } = req.body;
    const orgId = (req as any).organizationId;
    
    const regulation = await cendiaPanopticonService.ingestRegulation(
      orgId,
      frameworkCode,
      version || '1.0',
      sourceUrl
    );
    
    res.json({ success: true, data: regulation });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/regulations
 * Get organization's active regulations
 */
router.get('/regulations', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const regulations = await cendiaPanopticonService.getOrganizationRegulations(orgId);
    res.json({ success: true, data: regulations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// COMPLIANCE
// ===========================================================================

/**
 * POST /panopticon/alignments
 * Map obligation to entity
 */
router.post('/alignments', async (req: Request, res: Response) => {
  try {
    const { obligationId, entityType, entityId, entityName } = req.body;
    
    const alignment = await cendiaPanopticonService.mapObligation(
      obligationId,
      entityType,
      entityId,
      entityName
    );
    
    res.json({ success: true, data: alignment });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/gaps
 * Get compliance gaps
 */
router.get('/gaps', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const gaps = await cendiaPanopticonService.getComplianceGaps(orgId);
    res.json({ success: true, data: gaps });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// VIOLATIONS
// ===========================================================================

/**
 * POST /panopticon/violations/detect
 * Detect violations
 */
router.post('/violations/detect', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { processData } = req.body;
    
    const violations = await cendiaPanopticonService.detectViolations(orgId, processData);
    res.json({ success: true, data: violations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/violations
 * Get open violations
 */
router.get('/violations', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const violations = await cendiaPanopticonService.getOpenViolations(orgId);
    res.json({ success: true, data: violations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /panopticon/violations/:id/resolve
 * Resolve a violation
 */
router.post('/violations/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { resolution } = req.body;
    const resolvedBy = (req as any).user?.id || 'system';
    
    const violation = await cendiaPanopticonService.resolveViolation(
      req.params.id,
      resolution,
      resolvedBy
    );
    
    res.json({ success: true, data: violation });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// FORECASTING
// ===========================================================================

/**
 * POST /panopticon/forecasts/generate
 * Generate regulatory forecasts
 */
router.post('/forecasts/generate', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const forecasts = await cendiaPanopticonService.generateForecasts(orgId);
    res.json({ success: true, data: forecasts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /panopticon/forecasts
 * Get forecasts
 */
router.get('/forecasts', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const forecasts = await cendiaPanopticonService.getForecasts(orgId);
    res.json({ success: true, data: forecasts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// REGULATORY RADAR (LLM-DRIVEN)
// ===========================================================================

/**
 * GET /panopticon/radar
 * Get LLM-generated regulatory radar for the next 90 days
 */
router.get('/radar', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const perspective = typeof req.query.perspective === 'string' ? req.query.perspective : undefined;
    const radar = await cendiaPanopticonService.getRegulatoryRadar(orgId, { perspective });
    res.json({ success: true, data: radar });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// DASHBOARD
// ===========================================================================

/**
 * GET /panopticon/dashboard
 * Get compliance dashboard
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const dashboard = await cendiaPanopticonService.getDashboard(orgId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// EXPRESS MODE — Quick Intelligence Without Council
// ===========================================================================

/**
 * GET /panopticon/express/report
 * Full compliance report directly (no Council needed)
 */
router.get('/express/report', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const report = await cendiaPanopticonService.getComplianceReport(orgId);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /panopticon/express/remediate
 * Generate remediation steps without Council
 */
router.post('/express/remediate', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { violationIds } = req.body;
    const result = await cendiaPanopticonService.generateRemediationSteps(orgId, violationIds);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// 10/10 ENHANCEMENTS — Advanced Compliance Intelligence
// ===========================================================================

/**
 * GET /panopticon/conflicts
 * Cross-framework conflict detection
 */
router.get('/conflicts', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const result = await cendiaPanopticonService.detectFrameworkConflicts(orgId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /panopticon/workflow
 * Generate compliance remediation workflow
 */
router.post('/workflow', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { frameworkCode, severity, maxTasks } = req.body;
    const result = await cendiaPanopticonService.generateComplianceWorkflow(orgId, {
      frameworkCode,
      severity,
      maxTasks,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
