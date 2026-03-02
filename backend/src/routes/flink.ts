// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// APACHE FLINK CEP STREAM PROCESSING API ROUTES
// Mounted at /api/v1/flink
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { flinkCEP } from '../services/streaming/FlinkCEPService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await flinkCEP.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) { next(error); }
});

router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: flinkCEP.getStats() });
});

// ─── Rules ─────────────────────────────────────────────────────────────

router.get('/rules', (_req: Request, res: Response) => {
  const rules = flinkCEP.getRules().map(r => ({
    id: r.id, name: r.name, description: r.description, enabled: r.enabled,
    eventTypes: r.eventTypes, windowSec: r.windowSec, threshold: r.threshold,
    complianceFrameworks: r.complianceFrameworks, priority: r.priority,
    conditionType: r.condition.type, actionType: r.action.type,
  }));
  res.json({ success: true, data: { rules, total: rules.length, active: rules.filter(r => r.enabled).length } });
});

router.get('/rules/:ruleId', (req: Request, res: Response) => {
  const rule = flinkCEP.getRule(req.params.ruleId!);
  if (!rule) { res.status(404).json({ success: false, error: 'Rule not found' }); return; }
  res.json({ success: true, data: rule });
});

router.patch('/rules/:ruleId/toggle', (req: Request, res: Response) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') { res.status(400).json({ success: false, error: 'enabled (boolean) required' }); return; }
  const ok = flinkCEP.setRuleEnabled(req.params.ruleId!, enabled);
  if (!ok) { res.status(404).json({ success: false, error: 'Rule not found' }); return; }
  logger.info(`[Flink API] Rule ${req.params.ruleId} ${enabled ? 'enabled' : 'disabled'} by ${req.user?.email || 'unknown'}`);
  res.json({ success: true, data: { ruleId: req.params.ruleId, enabled } });
});

// ─── Event Ingestion ───────────────────────────────────────────────────

router.post('/events/ingest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { event, events } = req.body;
    if (events && Array.isArray(events)) {
      const alerts = await flinkCEP.ingestBatch(events.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp || Date.now()) })));
      res.json({ success: true, data: { ingested: events.length, alerts } });
    } else if (event) {
      const alerts = await flinkCEP.ingestEvent({ ...event, timestamp: new Date(event.timestamp || Date.now()) });
      res.json({ success: true, data: { ingested: 1, alerts } });
    } else {
      res.status(400).json({ success: false, error: 'event or events[] required' });
    }
  } catch (error) { next(error); }
});

// ─── Alerts ────────────────────────────────────────────────────────────

router.get('/alerts', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const unackOnly = req.query.unacknowledged === 'true';
  const alerts = unackOnly ? flinkCEP.getUnacknowledgedAlerts() : flinkCEP.getAlerts(limit);
  res.json({ success: true, data: { alerts, total: alerts.length } });
});

router.post('/alerts/:alertId/acknowledge', (req: Request, res: Response) => {
  const ok = flinkCEP.acknowledgeAlert(req.params.alertId!);
  if (!ok) { res.status(404).json({ success: false, error: 'Alert not found' }); return; }
  res.json({ success: true, data: { alertId: req.params.alertId, acknowledged: true } });
});

export default router;
