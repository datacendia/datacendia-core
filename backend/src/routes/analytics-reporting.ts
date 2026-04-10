/**
 * API Routes — Advanced Analytics & Reporting
 * @module routes/analytics-reporting
 */

import { Router, Request, Response } from 'express';
import { analyticsReporting } from '../services/analytics/AnalyticsReportingService.js';
import { logger } from '../utils/logger.js';

const router = Router();

/** GET /dashboards — List all dashboards */
router.get('/dashboards', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const dashboards = await analyticsReporting.listDashboards(userId);
    res.json({ success: true, data: dashboards });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list dashboards' }); }
});

/** POST /dashboards — Create dashboard */
router.post('/dashboards', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const dashboard = await analyticsReporting.createDashboard({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: dashboard });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create dashboard' }); }
});

/** GET /dashboards/:id — Get dashboard */
router.get('/dashboards/:id', async (req: Request, res: Response) => {
  try {
    const dashboard = await analyticsReporting.getDashboard(req.params.id);
    if (!dashboard) return res.status(404).json({ success: false, error: 'Dashboard not found' });
    res.json({ success: true, data: dashboard });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get dashboard' }); }
});

/** PUT /dashboards/:id — Update dashboard */
router.put('/dashboards/:id', async (req: Request, res: Response) => {
  try {
    const dashboard = await analyticsReporting.updateDashboard(req.params.id, req.body);
    if (!dashboard) return res.status(404).json({ success: false, error: 'Dashboard not found' });
    res.json({ success: true, data: dashboard });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to update dashboard' }); }
});

/** GET /metrics/:domain — Get metrics for a domain */
router.get('/metrics/:domain', async (req: Request, res: Response) => {
  try {
    const timeRange = {
      start: (req.query.start as string) || '',
      end: (req.query.end as string) || '',
      preset: (req.query.preset as any) || '30d',
    };
    const metrics = await analyticsReporting.getMetrics(req.params.domain as any, timeRange);
    res.json({ success: true, data: metrics });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get metrics' }); }
});

/** GET /metrics — Cross-domain summary */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const timeRange = {
      start: (req.query.start as string) || '',
      end: (req.query.end as string) || '',
      preset: (req.query.preset as any) || '30d',
    };
    const summary = await analyticsReporting.getCrossDomainSummary(timeRange);
    res.json({ success: true, data: summary });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to get cross-domain summary' }); }
});

/** POST /reports — Create report definition */
router.post('/reports', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const report = await analyticsReporting.createReport({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: report });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to create report' }); }
});

/** GET /reports — List report definitions */
router.get('/reports', async (_req: Request, res: Response) => {
  try {
    const reports = await analyticsReporting.listReports();
    res.json({ success: true, data: reports });
  } catch (error) { res.status(500).json({ success: false, error: 'Failed to list reports' }); }
});

/** POST /reports/:id/generate — Generate a report */
router.post('/reports/:id/generate', async (req: Request, res: Response) => {
  try {
    const report = await analyticsReporting.generateReport(req.params.id);
    res.json({ success: true, data: report });
  } catch (error: any) { res.status(500).json({ success: false, error: error.message || 'Failed to generate report' }); }
});

/** GET /reports/:id/export — Export generated report */
router.get('/reports/:id/export', async (req: Request, res: Response) => {
  try {
    const format = (req.query.format as 'json' | 'csv') || 'json';
    const result = await analyticsReporting.exportReport(req.params.id, format);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error: any) { res.status(500).json({ success: false, error: error.message || 'Failed to export report' }); }
});

export default router;
