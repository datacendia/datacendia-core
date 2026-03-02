// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA AUTOPILOT™ API ROUTES
// Automation Rules Management
// =============================================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { assertCapability } from '../utils/permissions.js';

const router = Router();

router.use(devAuth);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

// GET /autopilot/rules - List automation rules
router.get('/rules', async (req: Request, res: Response) => {
  try {
    await assertCapability(req, 'autopilot.manageRules');
    const { organization_id, enabled } = req.query;
    const orgId = (req.organizationId as string) || (organization_id as string);
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const rules = await prisma.autopilot_rules.findMany({
      where,
      include: { executions: { take: 5, orderBy: { executed_at: 'desc' } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: rules });
  } catch (error) {
    console.error('[Autopilot] Rules error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch rules' });
  }
});

// POST /autopilot/rules - Create rule
router.post('/rules', async (req: Request, res: Response) => {
  try {
    await assertCapability(req, 'autopilot.manageRules');
    const rule = await prisma.autopilot_rules.create({
      data: {
        organization_id: (req.organizationId as string) || req.body.organization_id,
        name: req.body.name,
        trigger_type: req.body.trigger_type,
        trigger_config: req.body.trigger_config || {},
        action_type: req.body.action_type,
        action_config: req.body.action_config || {}
      }
    });
    res.json({ success: true, data: rule });
  } catch (error) {
    console.error('[Autopilot] Rule create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create rule' });
  }
});

// POST /autopilot/rules/:id/execute - Execute rule
router.post('/rules/:id/execute', async (req: Request, res: Response) => {
  try {
    await assertCapability(req, 'autopilot.manageRules');
    const execution = await prisma.autopilot_executions.create({
      data: {
        rule_id: req.params.id,
        status: 'completed',
        duration_ms: req.body.duration_ms || 0
      }
    });
    
    await prisma.autopilot_rules.update({
      where: { id: req.params.id },
      data: { trigger_count: { increment: 1 } }
    });
    
    res.json({ success: true, data: execution });
  } catch (error) {
    console.error('[Autopilot] Execute error:', error);
    res.status(500).json({ success: false, error: 'Failed to execute rule' });
  }
});

// GET /autopilot/executions - List executions
router.get('/executions', async (req: Request, res: Response) => {
  try {
    await assertCapability(req, 'autopilot.manageRules');
    const { rule_id, status } = req.query;
    const orgId = (req.organizationId as string) || undefined;
    const where: any = {};
    if (rule_id) where.rule_id = rule_id;
    if (status) where.status = status;
    if (orgId) where.rule = { organization_id: orgId };

    const executions = await prisma.autopilot_executions.findMany({
      where,
      include: { rule: true },
      orderBy: { executed_at: 'desc' },
      take: 100
    });
    res.json({ success: true, data: executions });
  } catch (error) {
    console.error('[Autopilot] Executions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch executions' });
  }
});

export default router;
