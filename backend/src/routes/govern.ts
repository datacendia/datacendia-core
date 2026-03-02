// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GOVERN™ API ROUTES
// Policy & Governance Management
// =============================================================================

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /govern/policies - List policies
router.get('/policies', async (req: Request, res: Response) => {
  try {
    const { organization_id, status, category } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (status) where.status = status;
    if (category) where.category = category;

    const policies = await prisma.govern_policies.findMany({
      where,
      include: { audits: { take: 3, orderBy: { created_at: 'desc' } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: policies });
  } catch (error) {
    console.error('[Govern] Policies error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch policies' });
  }
});

// POST /govern/policies - Create policy
router.post('/policies', async (req: Request, res: Response) => {
  try {
    const policy = await prisma.govern_policies.create({
      data: {
        organization_id: req.body.organization_id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        rules: req.body.rules || [],
        created_by: req.body.created_by
      }
    });
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('[Govern] Policy create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create policy' });
  }
});

// GET /govern/audits - List audits
router.get('/audits', async (req: Request, res: Response) => {
  try {
    const { organization_id, status } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (status) where.status = status;

    const audits = await prisma.govern_audits.findMany({
      where,
      include: { policy: true },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: audits });
  } catch (error) {
    console.error('[Govern] Audits error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audits' });
  }
});

// POST /govern/audits - Create audit
router.post('/audits', async (req: Request, res: Response) => {
  try {
    const audit = await prisma.govern_audits.create({
      data: {
        organization_id: req.body.organization_id,
        policy_id: req.body.policy_id,
        audit_type: req.body.audit_type,
        findings: req.body.findings || [],
        risk_score: req.body.risk_score
      }
    });
    res.json({ success: true, data: audit });
  } catch (error) {
    console.error('[Govern] Audit create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create audit' });
  }
});

export default router;
