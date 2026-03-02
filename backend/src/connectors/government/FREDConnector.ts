// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * FRED CONNECTOR - Federal Reserve Economic Data
 * =============================================================================
 * Production connector for St. Louis Fed FRED API providing:
 * - 800,000+ economic time series
 * - GDP, inflation, employment, interest rates
 * - International economic data
 * - Real-time data releases
 * 
 * API Documentation: https://fred.stlouisfed.org/docs/api/fred/
 */

import { HttpConnector, HttpConnectorConfig } from '../core/HttpConnector.js';
import { ConnectorMetadata } from '../BaseConnector.js';

// =============================================================================
// TYPES
// =============================================================================

export interface FREDSeries {
  id: string;
  realtime_start: string;
  realtime_end: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  frequency_short: string;
  units: string;
  units_short: string;
  seasonal_adjustment: string;
  seasonal_adjustment_short: string;
  last_updated: string;
  popularity: number;
  notes?: string;
}

export interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

export interface FREDCategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface FREDRelease {
  id: number;
  realtime_start: string;
  realtime_end: string;
  name: string;
  press_release: boolean;
  link?: string;
  notes?: string;
}

export interface FREDReleaseDate {
  release_id: number;
  release_name: string;
  date: string;
}

export interface FREDSource {
  id: number;
  realtime_start: string;
  realtime_end: string;
  name: string;
  link?: string;
  notes?: string;
}

export interface FREDTag {
  name: string;
  group_id: string;
  notes?: string;
  created: string;
  popularity: number;
  series_count: number;
}

// Popular FRED Series IDs
export const FRED_POPULAR_SERIES = {
  // GDP
  GDP: 'GDP', // Gross Domestic Product
  GDPC1: 'GDPC1', // Real Gross Domestic Product
  
  // Inflation
  CPIAUCSL: 'CPIAUCSL', // Consumer Price Index for All Urban Consumers
  CPILFESL: 'CPILFESL', // Core CPI
  PCEPI: 'PCEPI', // PCE Price Index
  PCEPILFE: 'PCEPILFE', // Core PCE
  
  // Employment
  UNRATE: 'UNRATE', // Unemployment Rate
  PAYEMS: 'PAYEMS', // Total Nonfarm Payrolls
  ICSA: 'ICSA', // Initial Claims
  CIVPART: 'CIVPART', // Labor Force Participation Rate
  
  // Interest Rates
  FEDFUNDS: 'FEDFUNDS', // Federal Funds Rate
  DFF: 'DFF', // Federal Funds Effective Rate
  DGS10: 'DGS10', // 10-Year Treasury Constant Maturity
  DGS2: 'DGS2', // 2-Year Treasury
  T10Y2Y: 'T10Y2Y', // 10-Year minus 2-Year Treasury Spread
  
  // Money Supply
  M1SL: 'M1SL', // M1 Money Stock
  M2SL: 'M2SL', // M2 Money Stock
  
  // Housing
  HOUST: 'HOUST', // Housing Starts
  CSUSHPINSA: 'CSUSHPINSA', // Case-Shiller Home Price Index
  MORTGAGE30US: 'MORTGAGE30US', // 30-Year Mortgage Rate
  
  // Consumer
  UMCSENT: 'UMCSENT', // Consumer Sentiment
  RSAFS: 'RSAFS', // Retail Sales
  
  // Industrial
  INDPRO: 'INDPRO', // Industrial Production
  CMRMTSPL: 'CMRMTSPL', // Manufacturing and Trade Sales
  
  // Trade
  BOPGSTB: 'BOPGSTB', // Trade Balance
  
  // Oil & Energy
  DCOILWTICO: 'DCOILWTICO', // WTI Crude Oil
  GASREGW: 'GASREGW', // Regular Gas Price
} as const;

// =============================================================================
// FRED CONNECTOR
// =============================================================================

export class FREDConnector extends HttpConnector {
  private static readonly BASE_URL = 'https://api.stlouisfed.org/fred';
  private static readonly METADATA: ConnectorMetadata = {
    id: 'fred-economic',
    name: 'Federal Reserve FRED',
    description: 'Federal Reserve Economic Data - comprehensive economic indicators',
    vertical: 'government',
    category: 'economics',
    provider: 'Federal Reserve Bank of St. Louis',
    region: 'US',
    dataTypes: ['gdp', 'interest-rates', 'money-supply', 'employment', 'inflation'],
    updateFrequency: 'varies',
    documentationUrl: 'https://fred.stlouisfed.org/docs/api/fred/',
    apiVersion: 'v1',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
  };

  private apiKey: string;

  constructor(config: Partial<HttpConnectorConfig> & { credentials?: { apiKey?: string } } = {}) {
    super({
      id: 'fred-economic',
      name: 'Federal Reserve FRED',
      description: 'FRED Economic Data API',
      vertical: 'government',
      category: 'economics',
      baseUrl: FREDConnector.BASE_URL,
      authType: 'api_key',
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    });

    this.apiKey = config.credentials?.apiKey || process.env.FRED_API_KEY || '';
    if (!this.apiKey) {
      this.log('warn', 'FRED API key not provided. Set FRED_API_KEY environment variable.');
    }
  }

  getMetadata(): ConnectorMetadata {
    return FREDConnector.METADATA;
  }

  protected async performHealthCheck(): Promise<void> {
    await this.getSeries('GDP');
  }

  private async fredRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const fullParams = {
      api_key: this.apiKey,
      file_type: 'json',
      ...params,
    };

    return this.request<T>('GET', endpoint, { params: fullParams });
  }

  // ---------------------------------------------------------------------------
  // SERIES
  // ---------------------------------------------------------------------------

  /**
   * Get information about a specific series
   */
  async getSeries(seriesId: string): Promise<FREDSeries> {
    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/series', {
      series_id: seriesId,
    });
    return response.seriess[0];
  }

  /**
   * Get observations (data points) for a series
   */
  async getObservations(seriesId: string, options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    sortOrder?: 'asc' | 'desc';
    units?: 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca' | 'cch' | 'cca' | 'log';
    frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a';
    aggregationMethod?: 'avg' | 'sum' | 'eop';
  }): Promise<FREDObservation[]> {
    const params: Record<string, string | number> = {
      series_id: seriesId,
    };

    if (options?.startDate) params.observation_start = options.startDate;
    if (options?.endDate) params.observation_end = options.endDate;
    if (options?.limit) params.limit = options.limit;
    if (options?.sortOrder) params.sort_order = options.sortOrder;
    if (options?.units) params.units = options.units;
    if (options?.frequency) params.frequency = options.frequency;
    if (options?.aggregationMethod) params.aggregation_method = options.aggregationMethod;

    const response = await this.fredRequest<{ observations: FREDObservation[] }>(
      '/series/observations',
      params
    );
    return response.observations;
  }

  /**
   * Get latest observation for a series
   */
  async getLatestObservation(seriesId: string): Promise<FREDObservation | null> {
    const observations = await this.getObservations(seriesId, {
      sortOrder: 'desc',
      limit: 1,
    });
    return observations[0] || null;
  }

  /**
   * Search for series
   */
  async searchSeries(query: string, options?: {
    limit?: number;
    orderBy?: 'search_rank' | 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    filterVariable?: string;
    filterValue?: string;
    tagNames?: string[];
  }): Promise<FREDSeries[]> {
    const params: Record<string, string | number> = {
      search_text: query,
    };

    if (options?.limit) params.limit = options.limit;
    if (options?.orderBy) params.order_by = options.orderBy;
    if (options?.sortOrder) params.sort_order = options.sortOrder;
    if (options?.filterVariable) params.filter_variable = options.filterVariable;
    if (options?.filterValue) params.filter_value = options.filterValue;
    if (options?.tagNames) params.tag_names = options.tagNames.join(';');

    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/series/search', params);
    return response.seriess;
  }

  /**
   * Get related series
   */
  async getRelatedSeries(seriesId: string, limit = 10): Promise<FREDSeries[]> {
    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/series/search/related_tags', {
      series_id: seriesId,
      limit,
    });
    return response.seriess;
  }

  /**
   * Get series in a category
   */
  async getSeriesByCategory(categoryId: number, options?: {
    limit?: number;
    orderBy?: 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity';
  }): Promise<FREDSeries[]> {
    const params: Record<string, string | number> = {
      category_id: categoryId,
    };

    if (options?.limit) params.limit = options.limit;
    if (options?.orderBy) params.order_by = options.orderBy;

    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/category/series', params);
    return response.seriess;
  }

  // ---------------------------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------------------------

  /**
   * Get category information
   */
  async getCategory(categoryId: number): Promise<FREDCategory> {
    const response = await this.fredRequest<{ categories: FREDCategory[] }>('/category', {
      category_id: categoryId,
    });
    return response.categories[0];
  }

  /**
   * Get child categories
   */
  async getChildCategories(categoryId: number): Promise<FREDCategory[]> {
    const response = await this.fredRequest<{ categories: FREDCategory[] }>('/category/children', {
      category_id: categoryId,
    });
    return response.categories;
  }

  /**
   * Get root categories
   */
  async getRootCategories(): Promise<FREDCategory[]> {
    return this.getChildCategories(0);
  }

  // ---------------------------------------------------------------------------
  // RELEASES
  // ---------------------------------------------------------------------------

  /**
   * Get all releases
   */
  async getReleases(options?: {
    limit?: number;
    orderBy?: 'release_id' | 'name' | 'press_release' | 'realtime_start' | 'realtime_end';
  }): Promise<FREDRelease[]> {
    const params: Record<string, string | number> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.orderBy) params.order_by = options.orderBy;

    const response = await this.fredRequest<{ releases: FREDRelease[] }>('/releases', params);
    return response.releases;
  }

  /**
   * Get specific release
   */
  async getRelease(releaseId: number): Promise<FREDRelease> {
    const response = await this.fredRequest<{ releases: FREDRelease[] }>('/release', {
      release_id: releaseId,
    });
    return response.releases[0];
  }

  /**
   * Get upcoming release dates
   */
  async getReleaseDates(options?: {
    limit?: number;
    includeReleaseDatesWithNoData?: boolean;
  }): Promise<FREDReleaseDate[]> {
    const params: Record<string, string | number> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.includeReleaseDatesWithNoData !== undefined) {
      params.include_release_dates_with_no_data = options.includeReleaseDatesWithNoData ? 'true' : 'false';
    }

    const response = await this.fredRequest<{ release_dates: FREDReleaseDate[] }>('/releases/dates', params);
    return response.release_dates;
  }

  /**
   * Get series in a release
   */
  async getReleasesSeries(releaseId: number, limit = 100): Promise<FREDSeries[]> {
    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/release/series', {
      release_id: releaseId,
      limit,
    });
    return response.seriess;
  }

  // ---------------------------------------------------------------------------
  // SOURCES
  // ---------------------------------------------------------------------------

  /**
   * Get all sources
   */
  async getSources(): Promise<FREDSource[]> {
    const response = await this.fredRequest<{ sources: FREDSource[] }>('/sources');
    return response.sources;
  }

  /**
   * Get specific source
   */
  async getSource(sourceId: number): Promise<FREDSource> {
    const response = await this.fredRequest<{ sources: FREDSource[] }>('/source', {
      source_id: sourceId,
    });
    return response.sources[0];
  }

  // ---------------------------------------------------------------------------
  // TAGS
  // ---------------------------------------------------------------------------

  /**
   * Get all tags
   */
  async getTags(options?: {
    limit?: number;
    orderBy?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  }): Promise<FREDTag[]> {
    const params: Record<string, string | number> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.orderBy) params.order_by = options.orderBy;

    const response = await this.fredRequest<{ tags: FREDTag[] }>('/tags', params);
    return response.tags;
  }

  /**
   * Get series with specific tags
   */
  async getSeriesByTags(tagNames: string[], limit = 100): Promise<FREDSeries[]> {
    const response = await this.fredRequest<{ seriess: FREDSeries[] }>('/tags/series', {
      tag_names: tagNames.join(';'),
      limit,
    });
    return response.seriess;
  }

  // ---------------------------------------------------------------------------
  // CONVENIENCE METHODS
  // ---------------------------------------------------------------------------

  /**
   * Get GDP data
   */
  async getGDP(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.GDP, options);
  }

  /**
   * Get unemployment rate
   */
  async getUnemploymentRate(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.UNRATE, options);
  }

  /**
   * Get CPI inflation
   */
  async getCPI(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.CPIAUCSL, options);
  }

  /**
   * Get Fed Funds Rate
   */
  async getFedFundsRate(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.FEDFUNDS, options);
  }

  /**
   * Get 10-Year Treasury Yield
   */
  async get10YearTreasury(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.DGS10, options);
  }

  /**
   * Get yield curve spread (10Y - 2Y)
   */
  async getYieldCurveSpread(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.T10Y2Y, options);
  }

  /**
   * Get M2 money supply
   */
  async getM2(options?: { startDate?: string; endDate?: string }): Promise<FREDObservation[]> {
    return this.getObservations(FRED_POPULAR_SERIES.M2SL, options);
  }

  /**
   * Get economic dashboard - key indicators
   */
  async getEconomicDashboard(): Promise<Record<string, FREDObservation | null>> {
    const series = [
      FRED_POPULAR_SERIES.GDP,
      FRED_POPULAR_SERIES.UNRATE,
      FRED_POPULAR_SERIES.CPIAUCSL,
      FRED_POPULAR_SERIES.FEDFUNDS,
      FRED_POPULAR_SERIES.DGS10,
      FRED_POPULAR_SERIES.PAYEMS,
      FRED_POPULAR_SERIES.INDPRO,
    ];

    const results: Record<string, FREDObservation | null> = {};
    
    await Promise.all(
      series.map(async (seriesId) => {
        try {
          results[seriesId] = await this.getLatestObservation(seriesId);
        } catch {
          results[seriesId] = null;
        }
      })
    );

    return results;
  }

  // ---------------------------------------------------------------------------
  // DATA FETCH
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<unknown[]> {
    const dataType = (params?.type as string) || 'observations';
    const seriesId = params?.seriesId as string;

    switch (dataType) {
      case 'series':
        if (!seriesId) throw new Error('seriesId required');
        return [await this.getSeries(seriesId)];

      case 'observations':
        if (!seriesId) throw new Error('seriesId required');
        return this.getObservations(seriesId, {
          startDate: params?.startDate as string,
          endDate: params?.endDate as string,
          limit: params?.limit as number,
        });

      case 'search':
        if (!params?.query) throw new Error('query required');
        return this.searchSeries(params.query as string, {
          limit: params?.limit as number,
        });

      case 'categories':
        if (params?.categoryId) {
          return this.getChildCategories(params.categoryId as number);
        }
        return this.getRootCategories();

      case 'releases':
        return this.getReleases({ limit: params?.limit as number });

      case 'releaseDates':
        return this.getReleaseDates({ limit: params?.limit as number });

      case 'dashboard':
        const dashboard = await this.getEconomicDashboard();
        return Object.entries(dashboard).map(([series, obs]) => ({ series, ...obs }));

      case 'gdp':
        return this.getGDP({ startDate: params?.startDate as string, endDate: params?.endDate as string });

      case 'unemployment':
        return this.getUnemploymentRate({ startDate: params?.startDate as string, endDate: params?.endDate as string });

      case 'cpi':
        return this.getCPI({ startDate: params?.startDate as string, endDate: params?.endDate as string });

      case 'fedfunds':
        return this.getFedFundsRate({ startDate: params?.startDate as string, endDate: params?.endDate as string });

      case 'treasury10y':
        return this.get10YearTreasury({ startDate: params?.startDate as string, endDate: params?.endDate as string });

      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }
}

// Factory function for registration
export function createFREDConnector(config: HttpConnectorConfig): FREDConnector {
  return new FREDConnector(config);
}
