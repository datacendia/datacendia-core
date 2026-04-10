/**
 * API Routes — Service Discovery & Marketplace
 * 
 * Unified API for discovering, managing, and configuring all platform services.
 * @module routes/service-discovery
 */

import { Router, Request, Response } from 'express';
import { serviceDiscovery } from '../services/platform/ServiceDiscoveryService.js';
import { logger } from '../utils/logger.js';

const router = Router();

/** GET /api/v1/service-discovery/dashboard — Unified dashboard summary */
router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const dashboard = await serviceDiscovery.getDashboard();
    res.json({ success: true, data: dashboard });
  } catch (error) {
    logger.error('[ServiceDiscovery] Dashboard error:', error);
    res.status(500).json({ success: false, error: 'Failed to load dashboard' });
  }
});

/** GET /api/v1/service-discovery/services — List/search all services */
router.get('/services', async (req: Request, res: Response) => {
  try {
    const filters = {
      query: req.query.q as string,
      tier: req.query.tier as any,
      pillar: req.query.pillar as any,
      category: req.query.category as string,
      status: req.query.status as any,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      complianceDomain: req.query.compliance as string,
    };
    const result = await serviceDiscovery.search(filters);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('[ServiceDiscovery] Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

/** GET /api/v1/service-discovery/services/:id — Get service details */
router.get('/services/:id', async (req: Request, res: Response) => {
  try {
    const service = await serviceDiscovery.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get service' });
  }
});

/** POST /api/v1/service-discovery/services/:id/enable — Enable a service */
router.post('/services/:id/enable', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await serviceDiscovery.enableService(req.params.id, userId, req.body.reason);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to enable service' });
  }
});

/** POST /api/v1/service-discovery/services/:id/disable — Disable a service */
router.post('/services/:id/disable', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await serviceDiscovery.disableService(req.params.id, userId, req.body.reason);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to disable service' });
  }
});

/** PUT /api/v1/service-discovery/services/:id/config — Configure a service */
router.put('/services/:id/config', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await serviceDiscovery.configureService(req.params.id, req.body.config, userId, req.body.reason);
    if (!result.success) return res.status(400).json({ success: false, errors: result.errors });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to configure service' });
  }
});

/** GET /api/v1/service-discovery/dependencies — Full dependency graph */
router.get('/dependencies', async (_req: Request, res: Response) => {
  try {
    const graph = await serviceDiscovery.getDependencyGraph();
    res.json({ success: true, data: graph });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get dependency graph' });
  }
});

/** GET /api/v1/service-discovery/impact/:id — Impact analysis for disabling */
router.get('/impact/:id', async (req: Request, res: Response) => {
  try {
    const action = (req.query.action as 'disable' | 'remove') || 'disable';
    const impact = await serviceDiscovery.analyzeImpact(req.params.id, action);
    res.json({ success: true, data: impact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to analyze impact' });
  }
});

/** POST /api/v1/service-discovery/extensions — Install extension */
router.post('/extensions', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await serviceDiscovery.installExtension(req.body, userId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to install extension' });
  }
});

/** DELETE /api/v1/service-discovery/extensions/:id — Uninstall extension */
router.delete('/extensions/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await serviceDiscovery.uninstallExtension(req.params.id, userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to uninstall extension' });
  }
});

/** GET /api/v1/service-discovery/audit — Audit trail */
router.get('/audit', async (req: Request, res: Response) => {
  try {
    const filters = {
      serviceId: req.query.serviceId as string,
      userId: req.query.userId as string,
      action: req.query.action as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    };
    const entries = serviceDiscovery.getAuditLog(filters);
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get audit log' });
  }
});

export default router;
