/**
 * API Routes — Vertical Sentinels
 *
 * Express route handler defining REST endpoints.
 * @module routes/vertical-sentinels
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Vertical Sentinel API Routes
 * 
 * Industry monitoring meta-agents that produce Vertical Risk Delta reports.
 * This turns Datacendia into a living governance system.
 */

import { Router, Request, Response } from 'express';
import { verticalSentinelService, VerticalId } from '../services/verticals/meta/VerticalSentinelService.js';

const router = Router();

const isValidVerticalId = (id: string): id is VerticalId => {
  const validIds: VerticalId[] = [
    'financial', 'healthcare', 'insurance', 'energy', 'manufacturing',
    'technology', 'retail', 'education', 'real-estate', 'government', 'legal'
  ];
  return validIds.includes(id as VerticalId);
};

/**
 * GET /api/v1/vertical-sentinels/status
 * Get overall sentinel service status
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    const sentinels = verticalSentinelService.getAllSentinels();
    
    res.json({
      success: true,
      data: {
        totalSentinels: sentinels.length,
        activeSentinels: sentinels.filter(s => s.getConfig().enabled).length,
        verticals: sentinels.map(s => ({
          id: s.verticalId,
          name: s.verticalName,
          enabled: s.getConfig().enabled,
          scanFrequency: s.getConfig().scanFrequency,
          sourceCount: s.getConfig().sources.length
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get sentinel status' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/global-risk
 * Get global risk summary across all verticals
 */
router.get('/global-risk', (_req: Request, res: Response) => {
  try {
    const summary = verticalSentinelService.getGlobalRiskSummary();
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate global risk summary' });
  }
});

/**
 * POST /api/v1/vertical-sentinels/scan-all
 * Trigger a scan across all verticals
 */
router.post('/scan-all', async (_req: Request, res: Response) => {
  try {
    const results = await verticalSentinelService.scanAll();
    
    const summary: Record<string, number> = {};
    for (const [id, events] of results) {
      summary[id] = events.length;
    }
    
    res.json({
      success: true,
      data: {
        scannedVerticals: results.size,
        newEventsDetected: summary,
        totalNewEvents: Array.from(results.values()).reduce((sum, events) => sum + events.length, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to scan all verticals' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId
 * Get sentinel details for a specific vertical
 */
router.get('/:verticalId', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const config = sentinel.getConfig();
    const events = sentinel.getEvents();
    
    res.json({
      success: true,
      data: {
        verticalId: sentinel.verticalId,
        verticalName: sentinel.verticalName,
        config: {
          enabled: config.enabled,
          scanFrequency: config.scanFrequency,
          sourceCount: config.sources.length,
          jurisdictions: config.jurisdictions
        },
        eventSummary: {
          total: events.length,
          critical: events.filter(e => e.severity === 'critical').length,
          high: events.filter(e => e.severity === 'high').length,
          unacknowledged: events.filter(e => !e.acknowledgedAt).length,
          unresolved: events.filter(e => !e.resolvedAt).length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get sentinel details' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId/events
 * Get events for a specific vertical
 */
router.get('/:verticalId/events', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const { eventType, severity, acknowledged, resolved, since } = req.query;
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    type EventType = 'regulation-change' | 'lawsuit' | 'enforcement-action' | 'ai-failure' | 'industry-incident' | 'compliance-update';
    type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
    
    // Build filter object only with defined values
    const filterObj: Record<string, unknown> = {};
    if (eventType) filterObj['eventType'] = eventType as EventType;
    if (severity) filterObj['severity'] = severity as Severity;
    if (acknowledged !== undefined) filterObj['acknowledged'] = acknowledged === 'true';
    if (resolved !== undefined) filterObj['resolved'] = resolved === 'true';
    if (since) filterObj['since'] = new Date(since as string);
    
    const events = sentinel.getEvents(Object.keys(filterObj).length > 0 ? filterObj as Parameters<typeof sentinel.getEvents>[0] : undefined);
    
    res.json({
      success: true,
      data: {
        verticalId,
        events,
        total: events.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get events' });
  }
});

/**
 * POST /api/v1/vertical-sentinels/:verticalId/events/:eventId/acknowledge
 * Acknowledge an event
 */
router.post('/:verticalId/events/:eventId/acknowledge', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const eventId = req.params['eventId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const success = sentinel.acknowledgeEvent(eventId);
    if (!success) {
      res.status(400).json({ success: false, error: 'Event not found or already acknowledged' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Event acknowledged'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to acknowledge event' });
  }
});

/**
 * POST /api/v1/vertical-sentinels/:verticalId/events/:eventId/resolve
 * Resolve an event
 */
router.post('/:verticalId/events/:eventId/resolve', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const eventId = req.params['eventId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const success = sentinel.resolveEvent(eventId);
    if (!success) {
      res.status(400).json({ success: false, error: 'Event not found or already resolved' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Event resolved'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to resolve event' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId/risk-delta
 * Generate risk delta report for a vertical
 */
router.get('/:verticalId/risk-delta', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const { periodDays } = req.query;
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const days = periodDays ? parseInt(periodDays as string, 10) : 30;
    const report = sentinel.generateRiskDelta(days);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate risk delta' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId/reports
 * Get historical risk delta reports
 */
router.get('/:verticalId/reports', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const reports = sentinel.getReports();
    
    res.json({
      success: true,
      data: {
        verticalId,
        reports: reports.map(r => ({
          id: r.id,
          period: r.period,
          summary: r.summary,
          generatedAt: r.generatedAt
        })),
        total: reports.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get reports' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId/reports/:reportId
 * Get a specific risk delta report
 */
router.get('/:verticalId/reports/:reportId', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const reportId = req.params['reportId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const report = sentinel.getReport(reportId);
    if (!report) {
      res.status(404).json({ success: false, error: 'Report not found' });
      return;
    }
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get report' });
  }
});

/**
 * POST /api/v1/vertical-sentinels/:verticalId/scan
 * Trigger a scan for a specific vertical
 */
router.post('/:verticalId/scan', async (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    const newEvents = await sentinel.scan();
    
    res.json({
      success: true,
      data: {
        verticalId,
        newEventsDetected: newEvents.length,
        events: newEvents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to scan vertical' });
  }
});

/**
 * GET /api/v1/vertical-sentinels/:verticalId/config
 * Get sentinel configuration
 */
router.get('/:verticalId/config', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    res.json({
      success: true,
      data: sentinel.getConfig()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get config' });
  }
});

/**
 * PATCH /api/v1/vertical-sentinels/:verticalId/config
 * Update sentinel configuration
 */
router.patch('/:verticalId/config', (req: Request, res: Response) => {
  try {
    const verticalId = req.params['verticalId'] ?? '';
    const updates = req.body;
    
    if (!isValidVerticalId(verticalId)) {
      res.status(400).json({ success: false, error: 'Invalid vertical ID' });
      return;
    }
    
    const sentinel = verticalSentinelService.getSentinel(verticalId);
    if (!sentinel) {
      res.status(404).json({ success: false, error: 'Sentinel not found' });
      return;
    }
    
    sentinel.updateConfig(updates);
    
    res.json({
      success: true,
      data: sentinel.getConfig(),
      message: 'Configuration updated'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update config' });
  }
});

export default router;
