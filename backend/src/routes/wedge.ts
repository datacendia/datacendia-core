// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// WEDGE API ROUTES — Three standalone products that drive client acquisition
//
//   POST /api/v1/wedge/shadow-scan          — Run Shadow AI scan
//   GET  /api/v1/wedge/shadow-scan/:id      — Get scan results
//   POST /api/v1/wedge/governance-report    — Generate governance report
//   GET  /api/v1/wedge/governance-report/:id — Get report
//   POST /api/v1/wedge/incident-forensics   — Submit incident for forensics
//   GET  /api/v1/wedge/incident-forensics/:id — Get forensic report
// =============================================================================

import { Router, Request, Response } from 'express';
import { shadowAIScannerService } from '../services/wedge/ShadowAIScannerService.js';
import { governanceReportService } from '../services/wedge/GovernanceReportService.js';
import { incidentForensicsService } from '../services/wedge/IncidentForensicsService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ---------------------------------------------------------------------------
// WEDGE 1: Shadow AI Scanner
// ---------------------------------------------------------------------------

router.post('/shadow-scan', async (req: Request, res: Response) => {
  try {
    const result = await shadowAIScannerService.runScan(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Shadow scan error:', error);
    res.status(500).json({ success: false, error: 'Scan failed' });
  }
});

router.get('/shadow-scan/:id', async (req: Request, res: Response) => {
  try {
    const result = await shadowAIScannerService.getScan(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Scan not found' });
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Shadow scan get error:', error);
    res.status(500).json({ success: false, error: 'Failed to get scan' });
  }
});

// ---------------------------------------------------------------------------
// WEDGE 2: AI Governance Report
// ---------------------------------------------------------------------------

router.post('/governance-report', async (req: Request, res: Response) => {
  try {
    const result = await governanceReportService.generateReport(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Governance report error:', error);
    res.status(500).json({ success: false, error: 'Report generation failed' });
  }
});

router.get('/governance-report/:id', async (req: Request, res: Response) => {
  try {
    const result = await governanceReportService.getReport(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Report not found' });
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Governance report get error:', error);
    res.status(500).json({ success: false, error: 'Failed to get report' });
  }
});

// ---------------------------------------------------------------------------
// WEDGE 3: AI Incident Forensics
// ---------------------------------------------------------------------------

router.post('/incident-forensics', async (req: Request, res: Response) => {
  try {
    const result = await incidentForensicsService.submitIncident(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Incident forensics error:', error);
    res.status(500).json({ success: false, error: 'Forensic analysis failed' });
  }
});

router.get('/incident-forensics/:id', async (req: Request, res: Response) => {
  try {
    const result = await incidentForensicsService.getReport(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Report not found' });
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[Wedge] Incident forensics get error:', error);
    res.status(500).json({ success: false, error: 'Failed to get report' });
  }
});

export default router;
