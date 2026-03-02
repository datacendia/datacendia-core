/**
 * API Routes — Symbiont
 *
 * Express route handler defining REST endpoints.
 * @module routes/symbiont
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaSymbiont™ API Routes
 * Partnership & Ecosystem Engine
 */

import { Router, Request, Response } from 'express';
import { cendiaSymbiontService } from '../services/CendiaSymbiontService.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /symbiont/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    
    // Get counts for metrics
    const [entityCount, opportunityCount, relationshipCount] = await Promise.all([
      cendiaSymbiontService.getEntities(orgId, {}).then(e => e.length).catch(() => 0),
      cendiaSymbiontService.getOpportunities(orgId).then(o => o.length).catch(() => 0),
      cendiaSymbiontService.getRelationships(orgId).then(r => r.length).catch(() => 0),
    ]);
    
    res.json({
      success: true,
      data: {
        service: 'CendiaSymbiont',
        status: 'operational',
        version: '1.0.0',
        description: 'Partnership & Ecosystem Engine',
        capabilities: [
          'Ecosystem entity mapping',
          'AI-powered opportunity detection',
          'Alliance simulation and modeling',
          'Relationship health tracking',
          'Partnership ROI analysis',
          'Ecosystem network effects',
        ],
        metrics: {
          trackedEntities: entityCount,
          activeOpportunities: opportunityCount,
          relationships: relationshipCount,
        },
        entityTypes: ['competitor', 'partner', 'supplier', 'customer', 'regulator', 'investor', 'potential_partner'],
        relationshipTypes: ['partnership', 'vendor', 'customer', 'competitor', 'regulatory', 'investment'],
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// ENTITIES
// ===========================================================================

router.post('/entities', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const entity = await cendiaSymbiontService.addEntity(orgId, req.body);
    res.json({ success: true, data: entity });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/entities', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { entityType, domain, minHealth } = req.query;
    const entities = await cendiaSymbiontService.getEntities(orgId, {
      entityType: entityType as any,
      domain: domain as string,
      minHealth: minHealth ? parseFloat(minHealth as string) : undefined,
    });
    res.json({ success: true, data: entities });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// OPPORTUNITIES
// ===========================================================================

router.post('/entities/:id/opportunities', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const opportunities = await cendiaSymbiontService.detectOpportunities(orgId, req.params.id);
    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/opportunities', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { status } = req.query;
    const opportunities = await cendiaSymbiontService.getOpportunities(orgId, status as any);
    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.patch('/opportunities/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const opportunity = await cendiaSymbiontService.updateOpportunityStatus(req.params.id, status);
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// SIMULATIONS
// ===========================================================================

router.post('/opportunities/:id/simulate', async (req: Request, res: Response) => {
  try {
    const { simulationType } = req.body;
    const simulation = await cendiaSymbiontService.simulateAlliance(req.params.id, simulationType);
    res.json({ success: true, data: simulation });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/opportunities/:id/simulations', async (req: Request, res: Response) => {
  try {
    const simulations = await cendiaSymbiontService.getSimulations(req.params.id);
    res.json({ success: true, data: simulations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// RELATIONSHIPS
// ===========================================================================

router.post('/relationships', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { entityId, relatedEntityId, relationshipType } = req.body;
    const relationship = await cendiaSymbiontService.createRelationship(
      orgId, entityId, relatedEntityId, relationshipType
    );
    res.json({ success: true, data: relationship });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/relationships', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const relationships = await cendiaSymbiontService.getRelationships(orgId);
    res.json({ success: true, data: relationships });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.post('/relationships/:id/interaction', async (req: Request, res: Response) => {
  try {
    const relationship = await cendiaSymbiontService.updateRelationshipHealth(req.params.id, req.body);
    res.json({ success: true, data: relationship });
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
    const dashboard = await cendiaSymbiontService.getDashboard(orgId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
