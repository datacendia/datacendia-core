// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { fredDataService, FREDSeriesId, FRED_SERIES } from './FREDDataService.js';

class TimeSeriesForecasterImpl {
  async forecast(seriesId: FREDSeriesId, periodsAhead: number = 12, confidenceLevel: number = 0.95) {
    const data = await fredDataService.fetchSeries(seriesId);
    const values = data.observations.map((o: any) => o.value);
    const n = values.length;
    const trainSize = Math.floor(n * 0.8);
    const train = values.slice(0, trainSize);
    const test = values.slice(trainSize);

    // Simple exponential smoothing forecast
    const alpha = 0.3;
    let level = train[0]!;
    let trend = (train[train.length - 1]! - train[0]!) / train.length;
    for (const v of train) { const prevLevel = level; level = alpha * v + (1 - alpha) * (level + trend); trend = 0.1 * (level - prevLevel) + 0.9 * trend; }

    const forecasts: { date: string; value: number; lower: number; upper: number }[] = [];
    const lastDate = new Date(data.observations[n - 1]!.date);
    const zScore = confidenceLevel >= 0.99 ? 2.576 : confidenceLevel >= 0.95 ? 1.96 : 1.645;
    const residuals = test.map((v: number, i: number) => v - (level + trend * (i + 1)));
    const stdError = Math.sqrt(residuals.reduce((s: number, r: number) => s + r * r, 0) / residuals.length);

    for (let i = 1; i <= periodsAhead; i++) {
      const fDate = new Date(lastDate); fDate.setMonth(fDate.getMonth() + i);
      const fVal = Math.round((level + trend * i) * 100) / 100;
      const margin = Math.round(zScore * stdError * Math.sqrt(i) * 100) / 100;
      forecasts.push({ date: fDate.toISOString().slice(0, 10), value: fVal, lower: Math.round((fVal - margin) * 100) / 100, upper: Math.round((fVal + margin) * 100) / 100 });
    }

    // Accuracy metrics
    const testPredictions = test.map((_: any, i: number) => level + trend * (i + 1));
    const mape = test.reduce((s: number, v: number, i: number) => s + Math.abs((v - testPredictions[i]!) / v) * 100, 0) / test.length;
    const rmse = Math.sqrt(residuals.reduce((s: number, r: number) => s + r * r, 0) / residuals.length);
    const meanTest = test.reduce((s: number, v: number) => s + v, 0) / test.length;
    const ssTot = test.reduce((s: number, v: number) => s + (v - meanTest) ** 2, 0);
    const ssRes = residuals.reduce((s: number, r: number) => s + r * r, 0);
    const r2 = 1 - ssRes / (ssTot || 1);

    return { seriesId, seriesName: FRED_SERIES[seriesId].name, model: 'Holt-Winters Exponential Smoothing', periodsAhead, confidenceLevel, forecasts, accuracy: { mape: Math.round(mape * 100) / 100, rmse: Math.round(rmse * 100) / 100, r2: Math.round(r2 * 1000) / 1000, trainSize, testSize: test.length }, generatedAt: new Date().toISOString() };
  }

  async forecastMultiple(seriesIds: FREDSeriesId[], periodsAhead: number = 12) {
    const results = new Map<string, any>();
    for (const id of seriesIds) { results.set(id as string, await this.forecast(id, periodsAhead)); }
    return results;
  }
}

export const timeSeriesForecaster = new TimeSeriesForecasterImpl();
