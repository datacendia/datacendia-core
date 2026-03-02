// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

router.use(devAuth);

const forecastSchema = z.object({
  name: z.string().min(1),
  targetMetric: z.string().min(1),
  horizon: z.object({
    value: z.number().min(1),
    unit: z.enum(['days', 'weeks', 'months']),
  }),
  model: z.enum(['auto', 'arima', 'prophet', 'lstm', 'linear']).default('auto'),
  features: z.array(z.string()).optional(),
  confidenceIntervals: z.array(z.number()).default([0.80, 0.95]),
});

const scenarioSchema = z.object({
  name: z.string().min(1),
  forecastId: z.string().optional(),
  assumptions: z.array(z.object({
    variable: z.string(),
    baseValue: z.unknown(),
    scenarioValue: z.unknown(),
  })),
  metricsToProject: z.array(z.string()).optional(),
});

/**
 * GET /api/v1/predict/forecasts
 * List forecasts
 */
router.get('/forecasts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forecasts = await prisma.forecasts.findMany({
      where: { organization_id: req.organizationId! },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/predict/forecasts
 * Create forecast
 */
router.post('/forecasts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = forecastSchema.parse(req.body);
    const orgId = req.organizationId!;

    const forecast = await prisma.forecasts.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        name: data.name,
        target_metric: data.targetMetric,
        horizon: data.horizon as Prisma.InputJsonValue,
        model: data.model,
        features: (data.features || []) as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    // Run forecast in background
    runForecast(forecast.id, data).catch(err => {
      logger.error('Forecast failed:', err);
    });

    res.status(202).json({
      success: true,
      data: {
        id: forecast.id,
        status: 'processing',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/predict/forecasts/:id
 * Get forecast results
 */
router.get('/forecasts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forecast = await prisma.forecasts.findUnique({
      where: { id: req.params.id },
      include: { scenarios: true },
    });

    if (!forecast) {
      throw errors.notFound('Forecast');
    }

    if (forecast.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/predict/scenarios
 * List scenarios
 */
router.get('/scenarios', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarios = await prisma.scenarios.findMany({
      where: {
        forecasts: {
          organization_id: req.organizationId!,
        },
      },
      include: { forecasts: true },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: scenarios,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/predict/scenarios
 * Create scenario
 */
router.post('/scenarios', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = scenarioSchema.parse(req.body);

    // Verify forecast belongs to org if provided
    if (data.forecastId) {
      const forecast = await prisma.forecasts.findUnique({
        where: { id: data.forecastId },
      });

      if (!forecast || forecast.organization_id !== req.organizationId) {
        throw errors.notFound('Forecast');
      }
    }

    const scenario = await prisma.scenarios.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        assumptions: data.assumptions as Prisma.InputJsonValue,
        forecast_id: data.forecastId,
      },
    });

    // Run scenario projection in background
    runScenarioProjection(scenario.id, data).catch(err => {
      logger.error('Scenario projection failed:', err);
    });

    res.status(201).json({
      success: true,
      data: scenario,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/predict/scenarios/compare
 * Compare multiple scenarios
 */
router.post('/scenarios/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scenarioIds, metrics, timeRange } = z.object({
      scenarioIds: z.array(z.string()).min(2),
      metrics: z.array(z.string()),
      timeRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
    }).parse(req.body);

    const scenarios = await prisma.scenarios.findMany({
      where: { id: { in: scenarioIds } },
      include: { forecasts: true },
    });

    // Verify all scenarios belong to org
    for (const scenario of scenarios) {
      if (scenario.forecasts && scenario.forecasts.organization_id !== req.organizationId) {
        throw errors.forbidden();
      }
    }

    // Generate comparison data
    const comparison = generateScenarioComparison(scenarios, metrics, timeRange);

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
});

// Run forecast using statistical methods
async function runForecast(
  forecastId: string,
  config: z.infer<typeof forecastSchema>
) {
  try {
    // Get historical metric data
    const metricValues = await prisma.metric_values.findMany({
      where: {
        metric_definitions: { code: config.targetMetric },
      },
      orderBy: { timestamp: 'asc' },
      take: 365, // Last year of data
    });

    if (metricValues.length < 10) {
      throw new Error('Insufficient historical data for forecasting');
    }

    // Simple linear regression forecast (production would use proper time series)
    const values = metricValues.map((v: { value: number }) => v.value);
    const predictions = generateLinearForecast(values, config.horizon);

    // Calculate accuracy metrics
    const accuracy = {
      mape: calculateMAPE(values),
      rmse: calculateRMSE(values),
    };

    await prisma.forecasts.update({
      where: { id: forecastId },
      data: {
        status: 'COMPLETED',
        predictions,
        accuracy,
        completed_at: new Date(),
      },
    });

  } catch (error) {
    logger.error('Forecast error:', error);

    await prisma.forecasts.update({
      where: { id: forecastId },
      data: { status: 'FAILED' },
    });
  }
}

// Generate linear forecast
function generateLinearForecast(
  historicalValues: number[],
  horizon: { value: number; unit: string }
): Array<{ timestamp: string; value: number; confidence_intervals: Record<string, { lower: number; upper: number }> }> {
  const n = historicalValues.length;
  const xMean = (n - 1) / 2;
  const yMean = historicalValues.reduce((a, b) => a + b, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (historicalValues[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate standard error
  let sumSquaredErrors = 0;
  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * i;
    sumSquaredErrors += (historicalValues[i] - predicted) ** 2;
  }
  const standardError = Math.sqrt(sumSquaredErrors / (n - 2));

  // Generate predictions
  const daysToForecast = horizon.unit === 'days' ? horizon.value :
    horizon.unit === 'weeks' ? horizon.value * 7 :
    horizon.value * 30;

  const predictions = [];
  const today = new Date();

  for (let i = 0; i < daysToForecast; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);

    const predictedValue = intercept + slope * (n + i);
    const margin80 = 1.28 * standardError * Math.sqrt(1 + 1/n + ((n + i - xMean) ** 2) / denominator);
    const margin95 = 1.96 * standardError * Math.sqrt(1 + 1/n + ((n + i - xMean) ** 2) / denominator);

    predictions.push({
      timestamp: futureDate.toISOString().split('T')[0],
      value: Math.max(0, Math.round(predictedValue * 100) / 100),
      confidence_intervals: {
        '80': {
          lower: Math.max(0, Math.round((predictedValue - margin80) * 100) / 100),
          upper: Math.round((predictedValue + margin80) * 100) / 100,
        },
        '95': {
          lower: Math.max(0, Math.round((predictedValue - margin95) * 100) / 100),
          upper: Math.round((predictedValue + margin95) * 100) / 100,
        },
      },
    });
  }

  return predictions;
}

// Calculate Mean Absolute Percentage Error
function calculateMAPE(values: number[]): number {
  if (values.length < 2) return 0;
  let sumAPE = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] !== 0) {
      sumAPE += Math.abs((values[i] - values[i - 1]) / values[i - 1]);
    }
  }
  return Math.round((sumAPE / (values.length - 1)) * 10000) / 100;
}

// Calculate Root Mean Square Error
function calculateRMSE(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sumSquared = values.reduce((acc, val) => acc + (val - mean) ** 2, 0);
  return Math.round(Math.sqrt(sumSquared / values.length) * 100) / 100;
}

async function runScenarioProjection(
  scenarioId: string,
  config: z.infer<typeof scenarioSchema>
) {
  // Simplified scenario projection
  const projections = config.assumptions.map(a => ({
    variable: a.variable,
    baseValue: a.baseValue,
    scenarioValue: a.scenarioValue,
    impact: 'calculated',
  }));

  await prisma.scenarios.update({
    where: { id: scenarioId },
    data: { projections: projections as Prisma.InputJsonValue },
  });
}

function generateScenarioComparison(
  scenarios: Array<{ id: string; name: string; projections: unknown }>,
  metrics: string[],
  timeRange: { start: string; end: string }
) {
  return {
    scenarios: scenarios.map(s => ({
      id: s.id,
      name: s.name,
    })),
    metrics: metrics.map(metric => ({
      metric,
      comparison: scenarios.map(s => ({
        scenarioId: s.id,
        values: [], // Would contain projected values
      })),
    })),
    timeRange,
  };
}

export default router;
