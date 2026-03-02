// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ERROR REPORTING API ROUTES
// Receives error reports from frontend for logging and analysis
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

// =============================================================================
// ERROR REPORT INTERFACE
// =============================================================================

interface ErrorReport {
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: {
    componentStack?: string;
    userId?: string;
    sessionId?: string;
    url?: string;
    userAgent?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
  };
}

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /errors/report
 * Receive error reports from frontend
 */
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { errors } = req.body as { errors: ErrorReport[] };

    if (!errors || !Array.isArray(errors)) {
      return res.status(400).json({ error: 'Invalid error report format' });
    }

    // Log each error
    for (const error of errors) {
      // Log to console/file based on severity
      const logMethod = error.severity === 'critical' || error.severity === 'high' 
        ? 'error' 
        : error.severity === 'medium' 
          ? 'warn' 
          : 'info';

      logger[logMethod]('[Frontend Error]', {
        message: error.message,
        severity: error.severity,
        url: error.context.url,
        userId: error.context.userId,
        sessionId: error.context.sessionId,
        userAgent: error.context.userAgent,
        timestamp: error.context.timestamp,
      });

      // Store in audit_logs for analysis
      try {
        await prisma.audit_logs.create({
          data: {
            id: `err-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
            organization_id: 'system', // System-level errors
            user_id: error.context.userId || null,
            action: 'FRONTEND_ERROR',
            resource_type: 'error',
            resource_id: error.context.sessionId || 'unknown',
            details: JSON.parse(JSON.stringify({
              message: error.message,
              severity: error.severity,
              url: error.context.url,
              stack: error.stack?.substring(0, 5000), // Limit stack size
              metadata: error.context.metadata || {},
            })),
            ip_address: req.ip || req.socket.remoteAddress || null,
            user_agent: error.context.userAgent?.substring(0, 500) || null,
            created_at: new Date(error.context.timestamp || Date.now()),
          },
        });
      } catch (dbError) {
        logger.warn('[ErrorReport] Failed to store in database:', dbError);
      }
    }

    res.json({ 
      success: true, 
      received: errors.length,
      message: 'Errors logged successfully'
    });
  } catch (error) {
    logger.error('[ErrorReport] Failed to process:', error);
    res.status(500).json({ error: 'Failed to process error report' });
  }
});

/**
 * GET /errors/recent
 * Get recent errors (admin only)
 */
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const { limit = 50, severity } = req.query;

    const errors = await prisma.audit_logs.findMany({
      where: {
        action: 'FRONTEND_ERROR',
        ...(severity && {
          new_value: {
            path: ['severity'],
            equals: severity as string,
          },
        }),
      },
      orderBy: { created_at: 'desc' },
      take: Math.min(Number(limit), 100),
    });

    res.json({ 
      success: true, 
      data: errors,
      count: errors.length
    });
  } catch (error) {
    logger.error('[ErrorReport] Failed to fetch recent:', error);
    res.status(500).json({ error: 'Failed to fetch errors' });
  }
});

/**
 * GET /errors/stats
 * Get error statistics
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, last24hCount, last7dCount] = await Promise.all([
      prisma.audit_logs.count({ where: { action: 'FRONTEND_ERROR' } }),
      prisma.audit_logs.count({ 
        where: { 
          action: 'FRONTEND_ERROR',
          created_at: { gte: last24h }
        } 
      }),
      prisma.audit_logs.count({ 
        where: { 
          action: 'FRONTEND_ERROR',
          created_at: { gte: last7d }
        } 
      }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        last24Hours: last24hCount,
        last7Days: last7dCount,
      }
    });
  } catch (error) {
    logger.error('[ErrorReport] Failed to get stats:', error);
    res.status(500).json({ error: 'Failed to get error stats' });
  }
});

export default router;
