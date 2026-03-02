/**
 * API Routes — Roi Metrics
 *
 * Express route handler defining REST endpoints.
 * @module routes/roi-metrics
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CendiaROI™ API ROUTES
// Endpoints to expose provable ROI metrics
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { roiMetricsService } from '../services/metrics/ROIMetricsService.js';

const router = Router();

/**
 * GET /api/v1/roi-metrics/summary
 * Get complete ROI metrics summary
 */
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const days = parseInt(req.query['days'] as string) || 30;

    const summary = await roiMetricsService.getROISummary(orgId, days);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roi-metrics/deliberations
 * Get deliberation timing metrics
 */
router.get('/deliberations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const startDate = req.query['start'] ? new Date(req.query['start'] as string) : undefined;
    const endDate = req.query['end'] ? new Date(req.query['end'] as string) : undefined;

    const metrics = await roiMetricsService.getDeliberationMetrics(orgId, startDate, endDate);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roi-metrics/audit
 * Get audit packet metrics
 */
router.get('/audit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const startDate = req.query['start'] ? new Date(req.query['start'] as string) : undefined;
    const endDate = req.query['end'] ? new Date(req.query['end'] as string) : undefined;

    const metrics = await roiMetricsService.getAuditMetrics(orgId, startDate, endDate);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roi-metrics/quality
 * Get decision quality metrics
 */
router.get('/quality', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const startDate = req.query['start'] ? new Date(req.query['start'] as string) : undefined;
    const endDate = req.query['end'] ? new Date(req.query['end'] as string) : undefined;

    const metrics = await roiMetricsService.getDecisionQualityMetrics(orgId, startDate, endDate);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roi-metrics/comparison
 * Get automated vs manual comparison metrics
 */
router.get('/comparison', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;

    const comparison = await roiMetricsService.getComparativeMetrics(orgId);

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roi-metrics/export
 * Export ROI metrics as CSV or JSON
 */
router.get('/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const format = (req.query['format'] as string) || 'json';
    const days = parseInt(req.query['days'] as string) || 30;

    const summary = await roiMetricsService.getROISummary(orgId, days);
    const comparison = await roiMetricsService.getComparativeMetrics(orgId);

    const exportData = {
      generatedAt: new Date().toISOString(),
      period: summary.period,
      deliberationMetrics: summary.deliberation,
      auditMetrics: summary.audit,
      qualityMetrics: summary.quality,
      comparison,
      disclaimer: 'These metrics are automatically calculated from actual platform usage data.',
    };

    if (format === 'csv') {
      const csvRows = [
        'Metric,Value,Unit',
        `Total Deliberations,${summary.deliberation.totalDeliberations},count`,
        `Completed Deliberations,${summary.deliberation.completedDeliberations},count`,
        `Average Duration,${summary.deliberation.avgDurationMinutes},minutes`,
        `Median Duration,${Math.round(summary.deliberation.medianDurationMs / 60000 * 10) / 10},minutes`,
        `P95 Duration,${Math.round(summary.deliberation.p95DurationMs / 60000 * 10) / 10},minutes`,
        `Average Confidence,${summary.deliberation.avgConfidence * 100},percent`,
        `Consensus Rate,${summary.deliberation.consensusRate},percent`,
        `Dissents Recorded,${summary.deliberation.dissentsRecorded},count`,
        `Audit Packets Generated,${summary.audit.totalPacketsGenerated},count`,
        `Total Exports,${summary.audit.totalExports},count`,
        `Time Savings vs Manual,${comparison.timeSavingsPercent},percent`,
        `Hours Saved (${days} days),${comparison.hoursSavedPerMonth},hours`,
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=roi-metrics-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvRows.join('\n'));
    } else {
      res.json({
        success: true,
        data: exportData,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/roi-metrics/clear-cache
 * Clear metrics cache (admin only)
 */
router.post('/clear-cache', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    roiMetricsService.clearCache();

    res.json({
      success: true,
      message: 'Metrics cache cleared',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
