// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export type FREDSeriesId = 'GDP' | 'UNRATE' | 'CPIAUCSL' | 'FEDFUNDS' | 'DGS10' | 'SP500' | 'PAYEMS' | 'HOUST' | 'INDPRO' | 'UMCSENT';

export const FRED_SERIES: Record<FREDSeriesId, { name: string; description: string; frequency: string; units: string }> = {
  GDP: { name: 'Gross Domestic Product', description: 'Quarterly US GDP', frequency: 'quarterly', units: 'Billions of Dollars' },
  UNRATE: { name: 'Unemployment Rate', description: 'Civilian unemployment rate', frequency: 'monthly', units: 'Percent' },
  CPIAUCSL: { name: 'Consumer Price Index', description: 'CPI for All Urban Consumers', frequency: 'monthly', units: 'Index 1982-1984=100' },
  FEDFUNDS: { name: 'Federal Funds Rate', description: 'Effective federal funds rate', frequency: 'monthly', units: 'Percent' },
  DGS10: { name: '10-Year Treasury', description: '10-Year Treasury Constant Maturity Rate', frequency: 'daily', units: 'Percent' },
  SP500: { name: 'S&P 500', description: 'S&P 500 Index', frequency: 'daily', units: 'Index' },
  PAYEMS: { name: 'Nonfarm Payrolls', description: 'All Employees, Total Nonfarm', frequency: 'monthly', units: 'Thousands of Persons' },
  HOUST: { name: 'Housing Starts', description: 'New Privately-Owned Housing Units Started', frequency: 'monthly', units: 'Thousands of Units' },
  INDPRO: { name: 'Industrial Production', description: 'Industrial Production Index', frequency: 'monthly', units: 'Index 2017=100' },
  UMCSENT: { name: 'Consumer Sentiment', description: 'University of Michigan Consumer Sentiment', frequency: 'monthly', units: 'Index 1966:Q1=100' },
};

// Generate synthetic sample data for each series
function generateSampleData(seriesId: FREDSeriesId) {
  const bases: Record<FREDSeriesId, { start: number; volatility: number; trend: number }> = {
    GDP: { start: 22000, volatility: 200, trend: 150 }, UNRATE: { start: 3.7, volatility: 0.2, trend: -0.01 },
    CPIAUCSL: { start: 308, volatility: 0.5, trend: 0.3 }, FEDFUNDS: { start: 5.25, volatility: 0.1, trend: -0.05 },
    DGS10: { start: 4.2, volatility: 0.15, trend: -0.02 }, SP500: { start: 5200, volatility: 80, trend: 30 },
    PAYEMS: { start: 157000, volatility: 100, trend: 50 }, HOUST: { start: 1400, volatility: 40, trend: 5 },
    INDPRO: { start: 103, volatility: 0.5, trend: 0.1 }, UMCSENT: { start: 68, volatility: 2, trend: 0.3 },
  };
  const b = bases[seriesId];
  const points: { date: string; value: number }[] = [];
  let val = b.start;
  for (let i = 0; i < 60; i++) {
    const date = new Date(2020, i, 1).toISOString().slice(0, 10);
    val += b.trend + (Math.sin(i * 0.3) * b.volatility * 0.5) + (Math.random() - 0.5) * b.volatility;
    points.push({ date, value: Math.round(val * 100) / 100 });
  }
  return { seriesId, seriesName: FRED_SERIES[seriesId].name, units: FRED_SERIES[seriesId].units, frequency: FRED_SERIES[seriesId].frequency, observations: points, source: 'FRED (sample data)', lastUpdated: new Date().toISOString() };
}

class FREDDataServiceImpl {
  getAvailableSeries() { return FRED_SERIES; }
  async fetchSeries(seriesId: FREDSeriesId) { return generateSampleData(seriesId); }
}

export const fredDataService = new FREDDataServiceImpl();
