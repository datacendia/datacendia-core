// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA MESH™ API ROUTES
// Cross-Company Decision Network endpoints
// =============================================================================

import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

// =============================================================================
// NETWORK STATS
// =============================================================================

// GET /mesh/stats - Get current network statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Get latest stats or create default
    let stats = await prisma.mesh_network_stats.findFirst({
      orderBy: { recorded_at: 'desc' }
    });

    if (!stats) {
      // Create initial stats if none exist
      stats = await prisma.mesh_network_stats.create({
        data: {
          total_participants: 0,
          active_today: 0,
          data_points_shared: BigInt(0),
          insights_generated: 0,
          avg_response_ms: 45,
          privacy_score: 99.97,
          uptime_percent: 99.99
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...stats,
        data_points_shared: Number(stats.data_points_shared)
      }
    });
  } catch (error) {
    console.error('[Mesh] Stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch network stats' });
  }
});

// POST /mesh/stats - Update network statistics (admin)
router.post('/stats', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const stats = await prisma.mesh_network_stats.create({
      data: {
        total_participants: req.body.total_participants || 0,
        active_today: req.body.active_today || 0,
        data_points_shared: BigInt(req.body.data_points_shared || 0),
        insights_generated: req.body.insights_generated || 0,
        avg_response_ms: req.body.avg_response_ms || 45,
        privacy_score: req.body.privacy_score || 99.97,
        uptime_percent: req.body.uptime_percent || 99.99
      }
    });

    res.json({
      success: true,
      data: {
        ...stats,
        data_points_shared: Number(stats.data_points_shared)
      }
    });
  } catch (error) {
    console.error('[Mesh] Stats update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update network stats' });
  }
});

// =============================================================================
// PARTICIPANTS
// =============================================================================

// GET /mesh/participants - Get anonymous participants
router.get('/participants', async (req: Request, res: Response) => {
  try {
    const { industry, region, limit = 100 } = req.query;
    
    const where: any = {};
    if (industry) where.industry = industry;
    if (region) where.region = region;

    const participants = await prisma.mesh_participants.findMany({
      where,
      take: Number(limit),
      orderBy: { contribution_score: 'desc' }
    });

    res.json({ success: true, data: participants });
  } catch (error) {
    console.error('[Mesh] Participants error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch participants' });
  }
});

// =============================================================================
// BENCHMARKS
// =============================================================================

// GET /mesh/benchmarks - Get industry benchmarks
router.get('/benchmarks', async (req: Request, res: Response) => {
  try {
    const { industry, category } = req.query;
    
    const where: any = {};
    if (industry) where.industry = industry;
    if (category) where.category = category;

    const benchmarks = await prisma.mesh_benchmarks.findMany({
      where,
      orderBy: { category: 'asc' }
    });

    res.json({ success: true, data: benchmarks });
  } catch (error) {
    console.error('[Mesh] Benchmarks error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch benchmarks' });
  }
});

// =============================================================================
// RISK SIGNALS
// =============================================================================

// GET /mesh/signals - Get risk signals
router.get('/signals', async (req: Request, res: Response) => {
  try {
    const { severity, category, active } = req.query;
    
    const where: any = {};
    if (severity) where.severity = severity;
    if (category) where.category = category;
    if (active === 'true') {
      where.valid_until = { gte: new Date() };
    }

    const signals = await prisma.mesh_risk_signals.findMany({
      where,
      orderBy: [{ severity: 'asc' }, { detected_at: 'desc' }]
    });

    res.json({ success: true, data: signals });
  } catch (error) {
    console.error('[Mesh] Signals error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch risk signals' });
  }
});

// GET /mesh/signals/:id - Get single signal
router.get('/signals/:id', async (req: Request, res: Response) => {
  try {
    const signal = await prisma.mesh_risk_signals.findUnique({
      where: { id: req.params.id }
    });

    if (!signal) {
      return res.status(404).json({ success: false, error: 'Signal not found' });
    }

    res.json({ success: true, data: signal });
  } catch (error) {
    console.error('[Mesh] Signal error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch signal' });
  }
});

// POST /mesh/signals - Create new signal
router.post('/signals', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const signal = await prisma.mesh_risk_signals.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        severity: req.body.severity,
        affected_industries: req.body.affected_industries || [],
        affected_regions: req.body.affected_regions || [],
        confidence: req.body.confidence || 0,
        sources: req.body.sources || 0,
        recommendations: req.body.recommendations || [],
        valid_until: new Date(req.body.valid_until || Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({ success: true, data: signal });
  } catch (error) {
    console.error('[Mesh] Signal create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create signal' });
  }
});

export default router;
