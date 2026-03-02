// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DECISION INTELLIGENCE API ROUTES
// Chronos, Ghost Board, Pre-Mortem, Regulatory
// With AI-Powered Analysis via Ollama
// =============================================================================

import { Router, Request, Response } from 'express';
import { chronosAIService } from '../services/ChronosAIService.js';
import { chronosEventBus } from '../services/ChronosEventBus.js';
import { prisma } from '../config/database.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

// =============================================================================
// STATUS / HEALTH
// =============================================================================

/**
 * GET /decision-intel/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    
    // Get counts for metrics
    const [snapshotCount, sessionCount, analysisCount, itemCount] = await Promise.all([
      prisma.chronos_snapshots.count({ where }).catch(() => 0),
      prisma.ghost_board_sessions.count({ where }).catch(() => 0),
      prisma.pre_mortem_analyses.count({ where }).catch(() => 0),
      prisma.regulatory_items.count({ where }).catch(() => 0),
    ]);
    
    res.json({
      success: true,
      data: {
        service: 'DecisionIntelligence',
        status: 'operational',
        version: '1.0.0',
        description: 'AI-Powered Decision Intelligence Suite',
        modules: {
          chronos: {
            name: 'Chronos Time Machine',
            status: 'operational',
            features: ['Snapshots', 'Pivotal moments', 'Causal chains', 'What-if analysis', 'Future scenarios'],
            snapshots: snapshotCount,
          },
          ghostBoard: {
            name: 'Ghost Board',
            status: 'operational',
            features: ['Board rehearsal', 'Scenario simulation', 'Stakeholder modeling'],
            sessions: sessionCount,
          },
          preMortem: {
            name: 'Pre-Mortem Analysis',
            status: 'operational',
            features: ['Failure mode analysis', 'Risk identification', 'Mitigation planning'],
            analyses: analysisCount,
          },
          regulatory: {
            name: 'Regulatory Absorb',
            status: 'operational',
            features: ['Regulatory tracking', 'Compliance mapping', 'Impact assessment'],
            items: itemCount,
          },
        },
        aiCapabilities: [
          'Pivotal moment detection via Ollama',
          'Causal chain analysis',
          'Future scenario generation',
          'What-if counterfactual reasoning',
          'Timeline insight synthesis',
        ],
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('[DecisionIntel] Status error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch status' });
  }
});

// =============================================================================
// CHRONOS - Time Machine Snapshots
// =============================================================================

router.get('/chronos/snapshots', async (req: Request, res: Response) => {
  try {
    const { snapshot_type } = req.query;
    const orgId = req.organizationId;
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    if (snapshot_type) where.snapshot_type = snapshot_type;

    const snapshots = await prisma.chronos_snapshots.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 100
    });
    res.json({ success: true, data: snapshots });
  } catch (error) {
    console.error('[Chronos] Snapshots error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch snapshots' });
  }
});

router.post('/chronos/snapshots', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const userId = req.user?.id;

    const snapshot = await prisma.chronos_snapshots.create({
      data: {
        organization_id: orgId || req.body.organization_id,
        snapshot_type: req.body.snapshot_type,
        name: req.body.name,
        data: req.body.data || {},
        metrics: req.body.metrics || {},
        created_by: userId || req.body.created_by
      }
    });
    res.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('[Chronos] Snapshot create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create snapshot' });
  }
});

// =============================================================================
// CHRONOS AI - AI-Powered Analysis via Ollama
// =============================================================================

// AI Pivotal Moment Detection
router.post('/chronos/ai/pivotal-moments', async (req: Request, res: Response) => {
  try {
    const { organization_id, events, limit, department } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ success: false, error: 'Events array required' });
    }

    const normalizedEvents = events.map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));

    const scopedEvents = department
      ? normalizedEvents.filter(e => e.department === department)
      : normalizedEvents;

    const orgId = req.organizationId || organization_id || 'default';

    const pivotalMoments = await chronosAIService.detectPivotalMoments(
      orgId,
      scopedEvents,
      limit || 5
    );

    res.json({ success: true, data: pivotalMoments });
  } catch (error) {
    console.error('[ChronosAI] Pivotal moments error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Causal Chain Analysis
router.post('/chronos/ai/causal-chain', async (req: Request, res: Response) => {
  try {
    const { organization_id, root_event, all_events } = req.body;
    
    if (!root_event) {
      return res.status(400).json({ success: false, error: 'Root event required' });
    }

    const orgId = req.organizationId || organization_id || 'default';

    const causalLinks = await chronosAIService.analyzeCausalChain(
      orgId,
      { ...root_event, timestamp: new Date(root_event.timestamp) },
      (all_events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }))
    );

    res.json({ success: true, data: causalLinks });
  } catch (error) {
    console.error('[ChronosAI] Causal chain error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Future Scenario Generation
router.post('/chronos/ai/future-scenarios', async (req: Request, res: Response) => {
  try {
    const { organization_id, current_metrics, recent_events, time_horizon } = req.body;

    const orgId = req.organizationId || organization_id || 'default';

    const scenarios = await chronosAIService.generateFutureScenarios(
      orgId,
      current_metrics || {},
      (recent_events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })),
      time_horizon || '12 months'
    );

    res.json({ success: true, data: scenarios });
  } catch (error) {
    console.error('[ChronosAI] Scenario generation error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Timeline Insight
router.post('/chronos/ai/timeline-insight', async (req: Request, res: Response) => {
  try {
    const { organization_id, start_date, end_date, events, metrics } = req.body;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Start and end dates required' });
    }

    const orgId = req.organizationId || organization_id || 'default';

    const insight = await chronosAIService.getTimelineInsight(
      orgId,
      new Date(start_date),
      new Date(end_date),
      (events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })),
      metrics
    );

    res.json({ success: true, data: insight });
  } catch (error) {
    console.error('[ChronosAI] Timeline insight error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI "What If" Analysis
router.post('/chronos/ai/what-if', async (req: Request, res: Response) => {
  try {
    const { organization_id, event, alternative_action } = req.body;
    
    if (!event || !alternative_action) {
      return res.status(400).json({ success: false, error: 'Event and alternative action required' });
    }

    const orgId = req.organizationId || organization_id || 'default';

    const analysis = await chronosAIService.analyzeWhatIf(
      orgId,
      { ...event, timestamp: new Date(event.timestamp) },
      alternative_action
    );

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[ChronosAI] What-if analysis error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// =============================================================================
// GHOST BOARD - Board Rehearsal Sessions
// =============================================================================

router.get('/ghost-board/sessions', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const orgId = req.organizationId;
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    if (status) where.status = status;

    const sessions = await prisma.ghost_board_sessions.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('[GhostBoard] Sessions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

router.post('/ghost-board/sessions', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const userId = req.user?.id;

    const session = await prisma.ghost_board_sessions.create({
      data: {
        organization_id: orgId || req.body.organization_id,
        title: req.body.title,
        scenario: req.body.scenario,
        board_composition: req.body.board_composition || [],
        created_by: userId || req.body.created_by
      }
    });
    res.json({ success: true, data: session });
  } catch (error) {
    console.error('[GhostBoard] Session create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

// =============================================================================
// PRE-MORTEM - Failure Analysis
// =============================================================================

router.get('/pre-mortem/analyses', async (req: Request, res: Response) => {
  try {
    const { decision_id, status } = req.query;
    const orgId = req.organizationId;
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    if (decision_id) where.decision_id = decision_id;
    if (status) where.status = status;

    const analyses = await prisma.pre_mortem_analyses.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: analyses });
  } catch (error) {
    console.error('[PreMortem] Analyses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analyses' });
  }
});

router.post('/pre-mortem/analyses', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const userId = req.user?.id;

    const analysis = await prisma.pre_mortem_analyses.create({
      data: {
        organization_id: orgId || req.body.organization_id,
        decision_id: req.body.decision_id,
        title: req.body.title,
        failure_modes: req.body.failure_modes || [],
        risk_factors: req.body.risk_factors || [],
        mitigations: req.body.mitigations || [],
        overall_risk: req.body.overall_risk,
        created_by: userId || req.body.created_by
      }
    });
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[PreMortem] Analysis create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create analysis' });
  }
});

// =============================================================================
// REGULATORY ABSORB
// =============================================================================

router.get('/regulatory/items', async (req: Request, res: Response) => {
  try {
    const { jurisdiction, status } = req.query;
    const orgId = req.organizationId;
    const where: any = {};
    if (orgId) where.organization_id = orgId;
    if (jurisdiction) where.jurisdiction = jurisdiction;
    if (status) where.compliance_status = status;

    const items = await prisma.regulatory_items.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('[Regulatory] Items error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

router.post('/regulatory/items', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;

    const item = await prisma.regulatory_items.create({
      data: {
        organization_id: orgId || req.body.organization_id,
        regulation_id: req.body.regulation_id,
        title: req.body.title,
        description: req.body.description,
        jurisdiction: req.body.jurisdiction,
        category: req.body.category,
        impact_level: req.body.impact_level || 'medium',
        required_actions: req.body.required_actions || []
      }
    });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('[Regulatory] Item create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

// =============================================================================
// CHRONOS UNIFIED TIMELINE — Full-Platform Event Recording
// =============================================================================

/**
 * GET /decision-intel/chronos/timeline
 * Query the full platform timeline with comprehensive filtering
 */
router.get('/chronos/timeline', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId || (req.query.organization_id as string);
    if (!orgId) {
      res.status(400).json({ success: false, error: 'organization_id required' });
      return;
    }

    const {
      start_date,
      end_date,
      event_types,
      categories,
      severities,
      resource_type,
      resource_id,
      actor,
      min_magnitude,
      limit,
      offset,
      include_historical,
    } = req.query;

    const result = await chronosEventBus.getTimeline({
      organizationId: orgId,
      startDate: start_date ? new Date(start_date as string) : undefined,
      endDate: end_date ? new Date(end_date as string) : undefined,
      eventTypes: event_types ? (event_types as string).split(',') as any[] : undefined,
      categories: categories ? (categories as string).split(',') as any[] : undefined,
      severities: severities ? (severities as string).split(',') as any[] : undefined,
      resourceType: resource_type as string,
      resourceId: resource_id as string,
      actor: actor as string,
      minMagnitude: min_magnitude ? parseInt(min_magnitude as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : 100,
      offset: offset ? parseInt(offset as string, 10) : 0,
      includeHistorical: include_historical !== 'false',
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Chronos] Timeline query error:', error);
    res.status(500).json({ success: false, error: 'Failed to query timeline' });
  }
});

/**
 * GET /decision-intel/chronos/stats
 * Get platform-wide timeline statistics
 */
router.get('/chronos/stats', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId || (req.query.organization_id as string);
    if (!orgId) {
      res.status(400).json({ success: false, error: 'organization_id required' });
      return;
    }

    const stats = await chronosEventBus.getStats(orgId);

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[Chronos] Stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

/**
 * POST /decision-intel/chronos/backfill
 * Backfill chronos_events from all historical tables
 */
router.post('/chronos/backfill', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId || req.body.organization_id;
    if (!orgId) {
      res.status(400).json({ success: false, error: 'organization_id required' });
      return;
    }

    const result = await chronosEventBus.backfill(orgId);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Chronos] Backfill error:', error);
    res.status(500).json({ success: false, error: 'Failed to backfill events' });
  }
});

/**
 * POST /decision-intel/chronos/events
 * Manually record a custom event to the timeline
 */
router.post('/chronos/events', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId || req.body.organization_id;
    if (!orgId) {
      res.status(400).json({ success: false, error: 'organization_id required' });
      return;
    }

    const { event_type, category, severity, title, description, resource_type, resource_id, metadata, impact, magnitude } = req.body;

    if (!event_type || !category || !title || !description) {
      res.status(400).json({ success: false, error: 'event_type, category, title, and description are required' });
      return;
    }

    const eventId = await chronosEventBus.emitEvent({
      organizationId: orgId,
      eventType: event_type,
      category,
      severity: severity || 'info',
      title,
      description,
      actor: req.user?.id,
      actorType: 'user',
      resourceType: resource_type,
      resourceId: resource_id,
      metadata: metadata || {},
      impact,
      magnitude: magnitude || 0,
    });

    res.json({ success: true, data: { id: eventId } });
  } catch (error) {
    console.error('[Chronos] Event record error:', error);
    res.status(500).json({ success: false, error: 'Failed to record event' });
  }
});

export default router;
