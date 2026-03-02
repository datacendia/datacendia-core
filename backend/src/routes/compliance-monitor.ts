// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaContinuousCompliance™ API Routes
 * 
 * Real-Time Compliance Monitoring
 */

import { Router, Request, Response } from 'express';
import { continuousComplianceMonitorService, ComplianceFramework, AlertStatus } from '../services/compliance/ContinuousComplianceMonitorService.js';

const router = Router();

/**
 * GET /api/v1/compliance-monitor/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaContinuousCompliance',
    status: 'healthy',
    continuousMonitoring: true,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/compliance-monitor/frameworks
 */
router.get('/frameworks', (_req: Request, res: Response) => {
  try {
    const frameworks = continuousComplianceMonitorService.getSupportedFrameworks();
    res.json({ success: true, data: frameworks });
  } catch (error) {
    console.error('Error getting frameworks:', error);
    res.status(500).json({ success: false, error: 'Failed to get frameworks' });
  }
});

/**
 * POST /api/v1/compliance-monitor/initialize
 */
router.post('/initialize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, framework } = req.body;

    if (!organizationId || !framework) {
      res.status(400).json({ success: false, error: 'organizationId and framework are required' });
      return;
    }

    const controls = await continuousComplianceMonitorService.initializeFramework(
      organizationId,
      framework as ComplianceFramework
    );
    res.status(201).json({ success: true, data: controls });
  } catch (error) {
    console.error('Error initializing framework:', error);
    res.status(500).json({ success: false, error: 'Failed to initialize framework' });
  }
});

/**
 * POST /api/v1/compliance-monitor/scan
 */
router.post('/scan', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, framework } = req.body;

    if (!organizationId || !framework) {
      res.status(400).json({ success: false, error: 'organizationId and framework are required' });
      return;
    }

    const snapshot = await continuousComplianceMonitorService.runFrameworkScan(
      organizationId,
      framework as ComplianceFramework
    );
    res.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error running scan:', error);
    res.status(500).json({ success: false, error: 'Failed to run scan' });
  }
});

/**
 * GET /api/v1/compliance-monitor/controls/:orgId/:framework
 */
router.get('/controls/:orgId/:framework', (req: Request, res: Response): void => {
  try {
    const controls = continuousComplianceMonitorService.getControls(
      req.params['orgId']!,
      req.params['framework'] as ComplianceFramework
    );
    res.json({ success: true, data: controls });
  } catch (error) {
    console.error('Error getting controls:', error);
    res.status(500).json({ success: false, error: 'Failed to get controls' });
  }
});

/**
 * POST /api/v1/compliance-monitor/controls/:id/check
 */
router.post('/controls/:id/check', async (req: Request, res: Response): Promise<void> => {
  try {
    const control = await continuousComplianceMonitorService.checkControl(req.params['id']!);
    res.json({ success: true, data: control });
  } catch (error) {
    console.error('Error checking control:', error);
    res.status(500).json({ success: false, error: 'Failed to check control' });
  }
});

/**
 * GET /api/v1/compliance-monitor/history/:orgId/:framework
 */
router.get('/history/:orgId/:framework', (req: Request, res: Response): void => {
  try {
    const history = continuousComplianceMonitorService.getComplianceHistory(
      req.params['orgId']!,
      req.params['framework'] as ComplianceFramework
    );
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ success: false, error: 'Failed to get history' });
  }
});

/**
 * GET /api/v1/compliance-monitor/drifts
 */
router.get('/drifts', (req: Request, res: Response): void => {
  try {
    const hours = parseInt(req.query['hours'] as string) || 24;
    const drifts = continuousComplianceMonitorService.getRecentDrifts(hours);
    res.json({ success: true, data: drifts });
  } catch (error) {
    console.error('Error getting drifts:', error);
    res.status(500).json({ success: false, error: 'Failed to get drifts' });
  }
});

/**
 * GET /api/v1/compliance-monitor/alerts/:orgId
 */
router.get('/alerts/:orgId', (req: Request, res: Response): void => {
  try {
    const status = req.query['status'] as AlertStatus | undefined;
    const alerts = continuousComplianceMonitorService.getAlerts(req.params['orgId']!, status);
    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to get alerts' });
  }
});

/**
 * POST /api/v1/compliance-monitor/alerts/:id/acknowledge
 */
router.post('/alerts/:id/acknowledge', (req: Request, res: Response): void => {
  try {
    const { assignedTo } = req.body;
    const alert = continuousComplianceMonitorService.acknowledgeAlert(req.params['id']!, assignedTo);
    res.json({ success: true, data: alert });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ success: false, error: 'Failed to acknowledge alert' });
  }
});

/**
 * POST /api/v1/compliance-monitor/alerts/:id/resolve
 */
router.post('/alerts/:id/resolve', (req: Request, res: Response): void => {
  try {
    const { resolution } = req.body;
    const alert = continuousComplianceMonitorService.resolveAlert(
      req.params['id']!,
      resolution || 'resolved'
    );
    res.json({ success: true, data: alert });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ success: false, error: 'Failed to resolve alert' });
  }
});

export default router;
