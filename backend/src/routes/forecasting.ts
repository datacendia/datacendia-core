// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FORECASTING API ROUTES
// Real ML forecasting using FRED economic data
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { fredDataService, FRED_SERIES, FREDSeriesId } from '../services/forecasting/FREDDataService.js';
import { timeSeriesForecaster } from '../services/forecasting/TimeSeriesForecaster.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// =============================================================================
// SCHEMAS
// =============================================================================

const ForecastSchema = z.object({
  seriesId: z.string(),
  periodsAhead: z.number().min(1).max(36).optional().default(12),
  confidenceLevel: z.number().min(0.8).max(0.99).optional().default(0.95),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /api/v1/forecasting/series
 * List available FRED data series
 */
router.get('/series', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const series = fredDataService.getAvailableSeries();
    
    const seriesList = Object.entries(series).map(([key, value]) => ({
      key,
      ...value,
    }));

    res.json({
      success: true,
      data: {
        series: seriesList,
        count: seriesList.length,
        source: 'Federal Reserve Economic Data (FRED)',
        disclaimer: 'Real economic data from the Federal Reserve Bank of St. Louis',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/forecasting/series/:seriesId/data
 * Get historical data for a series
 */
router.get('/series/:seriesId/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seriesId = req.params['seriesId'] as FREDSeriesId;
    
    if (!FRED_SERIES[seriesId]) {
      throw errors.badRequest(`Unknown series: ${seriesId}`);
    }

    const data = await fredDataService.fetchSeries(seriesId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/forecasting/forecast
 * Generate a forecast for a series
 */
router.post('/forecast', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { seriesId, periodsAhead, confidenceLevel } = ForecastSchema.parse(req.body);
    
    if (!FRED_SERIES[seriesId as FREDSeriesId]) {
      throw errors.badRequest(`Unknown series: ${seriesId}`);
    }

    logger.info('[Forecasting] Generating forecast', { seriesId, periodsAhead, confidenceLevel });

    const result = await timeSeriesForecaster.forecast(
      seriesId as FREDSeriesId,
      periodsAhead,
      confidenceLevel
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/forecasting/forecast/batch
 * Generate forecasts for multiple series
 */
router.post('/forecast/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { seriesIds, periodsAhead = 12 } = req.body;
    
    if (!Array.isArray(seriesIds) || seriesIds.length === 0) {
      throw errors.badRequest('seriesIds must be a non-empty array');
    }

    if (seriesIds.length > 10) {
      throw errors.badRequest('Maximum 10 series per batch request');
    }

    // Validate all series IDs
    for (const id of seriesIds) {
      if (!FRED_SERIES[id as FREDSeriesId]) {
        throw errors.badRequest(`Unknown series: ${id}`);
      }
    }

    logger.info('[Forecasting] Generating batch forecast', { count: seriesIds.length, periodsAhead });

    const results = await timeSeriesForecaster.forecastMultiple(
      seriesIds as FREDSeriesId[],
      periodsAhead
    );

    // Convert Map to object for JSON response
    const forecasts: Record<string, any> = {};
    results.forEach((value, key) => {
      forecasts[key] = value;
    });

    res.json({
      success: true,
      data: {
        forecasts,
        count: results.size,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/forecasting/accuracy
 * Get accuracy metrics summary across all forecasting
 */
router.get('/accuracy', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate forecasts for key indicators and compile accuracy
    const keyIndicators: FREDSeriesId[] = ['GDP', 'UNRATE', 'CPIAUCSL', 'FEDFUNDS'];
    
    const results = await timeSeriesForecaster.forecastMultiple(keyIndicators, 6);
    
    const accuracyMetrics: any[] = [];
    let totalMAPE = 0;
    let count = 0;

    results.forEach((result, seriesId) => {
      accuracyMetrics.push({
        seriesId,
        seriesName: result.seriesName,
        mape: result.accuracy.mape,
        rmse: result.accuracy.rmse,
        r2: result.accuracy.r2,
        trainSize: result.accuracy.trainSize,
        testSize: result.accuracy.testSize,
      });
      totalMAPE += result.accuracy.mape;
      count++;
    });

    const averageMAPE = count > 0 ? totalMAPE / count : 0;

    res.json({
      success: true,
      data: {
        summary: {
          averageMAPE: Math.round(averageMAPE * 100) / 100,
          averageAccuracy: Math.round((100 - averageMAPE) * 100) / 100,
          modelType: 'Holt-Winters Exponential Smoothing',
          dataSource: 'Federal Reserve Economic Data (FRED)',
          disclaimer: 'Accuracy calculated via backtesting on held-out test data. Past performance does not guarantee future results.',
        },
        byIndicator: accuracyMetrics,
        testedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/forecasting/status
 * Get forecasting service status
 */
router.get('/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const series = fredDataService.getAvailableSeries();
    const hasApiKey = !!process.env['FRED_API_KEY'];

    res.json({
      success: true,
      data: {
        status: 'operational',
        dataSource: hasApiKey ? 'FRED API (live)' : 'Sample data (demo mode)',
        hasApiKey,
        availableSeries: Object.keys(series).length,
        modelType: 'Holt-Winters Triple Exponential Smoothing',
        capabilities: [
          'Time series forecasting',
          'Confidence intervals',
          'Backtesting accuracy',
          'Multiple economic indicators',
        ],
        setupInstructions: hasApiKey ? null : 'Set FRED_API_KEY environment variable for live data. Get free key at https://fred.stlouisfed.org/docs/api/api_key.html',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
