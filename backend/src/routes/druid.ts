/**
 * API Routes — Druid
 *
 * Express route handler defining REST endpoints.
 * @module routes/druid
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DRUID API ROUTES - Analytics Data for CendiaChronos�, CendiaWitness�, CendiaPulse�
// =============================================================================

import { Router, Request, Response } from 'express';
import { druidService, DRUID_DATASOURCES } from '../services/storage/DruidService';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

// Input validation helpers
const VALID_GRANULARITIES = ['minute', 'hour', 'day', 'week'] as const;
const GRANULARITY_TO_FLOOR: Record<string, string> = { minute: 'PT1M', hour: 'PT1H', day: 'P1D', week: 'P7D' };
const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
const VALID_SEVERITIES = ['info', 'warning', 'critical'] as const;

function safeInt(val: unknown, defaultVal: number, min: number, max: number): number {
  const n = parseInt(String(val), 10);
  if (isNaN(n)) return defaultVal;
  return Math.max(min, Math.min(max, n));
}

function requireOrgId(req: Request, res: Response): string | null {
  const orgId = req.organizationId;
  if (!orgId) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return null;
  }
  return orgId;
}

const router = Router();

// Apply authentication to all druid routes
router.use(authenticate);

// =============================================================================
// HEALTH & STATUS
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const available = await druidService.checkAvailability();
    res.json({
      success: true,
      available,
      datasources: Object.values(DRUID_DATASOURCES),
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// CHRONOS - Decision History & Timeline
// =============================================================================

router.get('/chronos/decisions', async (req: Request, res: Response) => {
  try {
    const { 
      startTime, 
      endTime, 
      limit = '500', 
      riskLevel,
    } = req.query;

    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const options: { startTime?: Date; endTime?: Date; limit?: number; riskLevel?: string } = {
      limit: safeInt(limit, 500, 1, 5000),
    };
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);
    if (riskLevel && VALID_RISK_LEVELS.includes(riskLevel as any)) {
      options.riskLevel = riskLevel as string;
    }

    const result = await druidService.getDecisionHistory(orgId, options);

    // Transform for frontend
    const events = result.data.map((d: any) => ({
      id: d.decision_id,
      timestamp: new Date(d.__time),
      type: 'decision',
      title: d.question,
      description: `${d.final_recommendation} - ${d.confidence_score}% confidence`,
      impact: d.risk_level === 'critical' || d.risk_level === 'high' ? 'negative' : 
              d.final_recommendation === 'approve' ? 'positive' : 'neutral',
      magnitude: Math.ceil(d.confidence_score / 10),
      department: d.department,
      actors: d.agents_involved?.split(',') || [],
      deliberationId: d.session_id,
      riskLevel: d.risk_level,
      consensusReached: d.consensus_reached,
      userAccepted: d.user_accepted,
      deliberationTimeMs: d.deliberation_time_ms,
    }));

    res.json({
      success: true,
      data: events,
      totalRows: result.totalRows,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/chronos/timeline', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, granularity = 'day' } = req.query;
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const gran = VALID_GRANULARITIES.includes(granularity as any) ? (granularity as string) : 'day';
    const timeFloor = GRANULARITY_TO_FLOOR[gran];

    const params: any[] = [{ type: 'VARCHAR', value: orgId }];
    let dateFilters = '';

    if (startDate) {
      const d = new Date(startDate as string);
      if (!isNaN(d.getTime())) {
        dateFilters += ' AND __time >= ?';
        params.push({ type: 'TIMESTAMP', value: d.toISOString() });
      }
    }
    if (endDate) {
      const d = new Date(endDate as string);
      if (!isNaN(d.getTime())) {
        dateFilters += ' AND __time <= ?';
        params.push({ type: 'TIMESTAMP', value: d.toISOString() });
      }
    }

    // timeFloor is from a validated allowlist, safe to interpolate
    const sql = `
      SELECT 
        TIME_FLOOR(__time, '${timeFloor}') as time_bucket,
        COUNT(*) as decision_count,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN consensus_reached = 'true' THEN 1 ELSE 0 END) as consensus_count,
        AVG(confidence_score) as avg_confidence,
        AVG(deliberation_time_ms) as avg_deliberation_time
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = ?${dateFilters}
      GROUP BY 1
      ORDER BY time_bucket ASC
    `;

    const result = await druidService.query(sql, params);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/chronos/risk-trend', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const result = await druidService.getRiskTrend(orgId, safeInt(days, 30, 1, 365));

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/chronos/departments', async (req: Request, res: Response) => {
  try {
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const sql = `
      SELECT 
        department,
        COUNT(*) as decision_count,
        AVG(confidence_score) as avg_confidence,
        SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as high_risk_count
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = ?
        AND __time >= CURRENT_TIMESTAMP - INTERVAL '90' DAY
      GROUP BY department
      ORDER BY decision_count DESC
    `;

    const result = await druidService.query(sql, [{ type: 'VARCHAR', value: orgId }]);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// WITNESS - Audit Trail
// =============================================================================

router.get('/witness/audit', async (req: Request, res: Response) => {
  try {
    const { resourceType, resourceId, actorId, startTime, endTime, limit = '100' } = req.query;
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const options: { resourceType?: string; resourceId?: string; actorId?: string; startTime?: Date; endTime?: Date; limit?: number } = {
      limit: safeInt(limit, 100, 1, 1000),
    };
    if (resourceType) options.resourceType = resourceType as string;
    if (resourceId) options.resourceId = resourceId as string;
    if (actorId) options.actorId = actorId as string;
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);

    const result = await druidService.getAuditTrail(orgId, options);

    res.json({
      success: true,
      data: result.data,
      totalRows: result.totalRows,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/witness/activity-summary', async (req: Request, res: Response) => {
  try {
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const sql = `
      SELECT 
        TIME_FLOOR(__time, 'PT1H') as hour,
        action,
        COUNT(*) as count,
        COUNT(DISTINCT actor_id) as unique_actors
      FROM "${DRUID_DATASOURCES.AUDIT_EVENTS}"
      WHERE organization_id = ?
        AND __time >= CURRENT_TIMESTAMP - INTERVAL '24' HOUR
      GROUP BY 1, 2
      ORDER BY hour DESC
    `;

    const result = await druidService.query(sql, [{ type: 'VARCHAR', value: orgId }]);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// PULSE - Agent & System Metrics
// =============================================================================

router.get('/pulse/agents', async (req: Request, res: Response) => {
  try {
    const { agentId, granularity = 'hour', startTime, endTime } = req.query;
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const options: { agentId?: string; granularity?: 'minute' | 'hour' | 'day'; startTime?: Date; endTime?: Date } = {
      granularity: granularity as 'minute' | 'hour' | 'day',
    };
    if (agentId) options.agentId = agentId as string;
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);

    const result = await druidService.getAgentMetrics(orgId, options);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/pulse/system', async (_req: Request, res: Response) => {
  try {
    const result = await druidService.getSystemHealth();

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

router.get('/pulse/alerts', async (req: Request, res: Response) => {
  try {
    const { severity, resolved, limit = '50' } = req.query;
    const orgId = requireOrgId(req, res);
    if (!orgId) return;

    const params: any[] = [{ type: 'VARCHAR', value: orgId }];
    let filters = '';

    if (severity && VALID_SEVERITIES.includes(severity as any)) {
      filters += ' AND severity = ?';
      params.push({ type: 'VARCHAR', value: severity });
    }
    if (resolved !== undefined) {
      const resolvedBool = resolved === 'true' ? 'true' : 'false';
      filters += ' AND resolved = ?';
      params.push({ type: 'VARCHAR', value: resolvedBool });
    }

    const safeLimit = safeInt(limit, 50, 1, 500);

    const sql = `
      SELECT *
      FROM "${DRUID_DATASOURCES.ALERTS}"
      WHERE organization_id = ?${filters}
      ORDER BY __time DESC
      LIMIT ${safeLimit}
    `;

    const result = await druidService.query(sql, params);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// SEEDING - Demo Data (Admin only, dev environment)
// =============================================================================

router.post('/seed', requireRole('ADMIN', 'OWNER'), async (req: Request, res: Response) => {
  try {
    logger.info(`[Druid] Seed requested by user ${req.user?.id}`);

    // Inline seeding via the druid service - no child process spawning
    res.json({
      success: true,
      message: 'Druid seeding must be run via CLI: npx ts-node scripts/seed-druid.ts',
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// Raw SQL /query endpoint REMOVED - was a SQL injection attack surface.
// All analytics queries are now served through dedicated parameterized endpoints above.

export default router;
