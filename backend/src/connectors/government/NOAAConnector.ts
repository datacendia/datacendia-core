// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * NOAA WEATHER SERVICE CONNECTOR - National Oceanic and Atmospheric Admin
 * =============================================================================
 * Production connector for NOAA Weather API providing:
 * - Weather forecasts and alerts
 * - Observations from weather stations
 * - Radar and satellite data
 * - Marine forecasts and buoy data
 * - Climate data and trends
 * 
 * API Documentation: https://www.weather.gov/documentation/services-web-api
 */

import { HttpConnector, HttpConnectorConfig } from '../core/HttpConnector.js';
import { ConnectorMetadata } from '../BaseConnector.js';

// =============================================================================
// TYPES
// =============================================================================

export interface NOAAPoint {
  '@id': string;
  '@type': string;
  cwa: string;
  forecastOffice: string;
  gridId: string;
  gridX: number;
  gridY: number;
  forecast: string;
  forecastHourly: string;
  forecastGridData: string;
  observationStations: string;
  relativeLocation: {
    city: string;
    state: string;
    distance: { value: number; unitCode: string };
    bearing: { value: number; unitCode: string };
  };
  forecastZone: string;
  county: string;
  fireWeatherZone: string;
  timeZone: string;
  radarStation: string;
}

export interface NOAAForecast {
  '@context': unknown[];
  type: string;
  geometry: { type: string; coordinates: number[][][] };
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: { value: number; unitCode: string };
    periods: NOAAForecastPeriod[];
  };
}

export interface NOAAForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: { value: number | null; unitCode: string };
  dewpoint: { value: number; unitCode: string };
  relativeHumidity: { value: number; unitCode: string };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NOAAAlert {
  '@id': string;
  '@type': string;
  id: string;
  areaDesc: string;
  geocode: { SAME: string[]; UGC: string[] };
  affectedZones: string[];
  references: unknown[];
  sent: string;
  effective: string;
  onset: string;
  expires: string;
  ends: string;
  status: string;
  messageType: string;
  category: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  certainty: string;
  urgency: string;
  event: string;
  sender: string;
  senderName: string;
  headline: string;
  description: string;
  instruction: string;
  response: string;
  parameters: Record<string, string[]>;
}

export interface NOAAObservation {
  '@id': string;
  '@type': string;
  elevation: { value: number; unitCode: string };
  station: string;
  timestamp: string;
  rawMessage: string;
  textDescription: string;
  icon: string;
  presentWeather: unknown[];
  temperature: { value: number | null; unitCode: string; qualityControl: string };
  dewpoint: { value: number | null; unitCode: string; qualityControl: string };
  windDirection: { value: number | null; unitCode: string; qualityControl: string };
  windSpeed: { value: number | null; unitCode: string; qualityControl: string };
  windGust: { value: number | null; unitCode: string; qualityControl: string };
  barometricPressure: { value: number | null; unitCode: string; qualityControl: string };
  seaLevelPressure: { value: number | null; unitCode: string; qualityControl: string };
  visibility: { value: number | null; unitCode: string; qualityControl: string };
  relativeHumidity: { value: number | null; unitCode: string; qualityControl: string };
  windChill: { value: number | null; unitCode: string; qualityControl: string };
  heatIndex: { value: number | null; unitCode: string; qualityControl: string };
  cloudLayers: Array<{ base: { value: number; unitCode: string }; amount: string }>;
}

export interface NOAAStation {
  '@id': string;
  '@type': string;
  elevation: { value: number; unitCode: string };
  stationIdentifier: string;
  name: string;
  timeZone: string;
  forecast: string;
  county: string;
  fireWeatherZone: string;
}

// =============================================================================
// NOAA CONNECTOR
// =============================================================================

export class NOAAWeatherConnector extends HttpConnector {
  private static readonly BASE_URL = 'https://api.weather.gov';
  private static readonly METADATA: ConnectorMetadata = {
    id: 'noaa-weather',
    name: 'NOAA Weather Service',
    description: 'National Oceanic and Atmospheric Administration - Weather forecasts, alerts, observations',
    vertical: 'government',
    category: 'weather',
    provider: 'NOAA',
    region: 'US',
    dataTypes: ['forecasts', 'alerts', 'observations', 'radar', 'satellite'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://www.weather.gov/documentation/services-web-api',
    apiVersion: 'v3',
    requiredCredentials: [],
    optionalCredentials: ['user_agent'],
    complianceFrameworks: ['FedRAMP'],
  };

  constructor(config: Partial<HttpConnectorConfig> = {}) {
    super({
      id: 'noaa-weather',
      name: 'NOAA Weather Service',
      description: 'NOAA Weather API',
      vertical: 'government',
      category: 'weather',
      baseUrl: NOAAWeatherConnector.BASE_URL,
      authType: 'none',
      headers: {
        'User-Agent': config.credentials?.userAgent || 'Datacendia/1.0 (enterprise@datacendia.com)',
        'Accept': 'application/geo+json',
      },
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    });
  }

  getMetadata(): ConnectorMetadata {
    return NOAAWeatherConnector.METADATA;
  }

  protected async performHealthCheck(): Promise<void> {
    await this.request('GET', '/');
  }

  // ---------------------------------------------------------------------------
  // LOCATION SERVICES
  // ---------------------------------------------------------------------------

  /**
   * Get metadata for a specific point (latitude, longitude)
   */
  async getPoint(lat: number, lon: number): Promise<NOAAPoint> {
    const response = await this.request<{ properties: NOAAPoint }>('GET', `/points/${lat},${lon}`);
    return response.properties;
  }

  /**
   * Get weather stations near a point
   */
  async getStations(lat: number, lon: number): Promise<NOAAStation[]> {
    const point = await this.getPoint(lat, lon);
    const response = await this.request<{ features: Array<{ properties: NOAAStation }> }>(
      'GET',
      point.observationStations.replace(NOAAWeatherConnector.BASE_URL, '')
    );
    return response.features.map(f => f.properties);
  }

  // ---------------------------------------------------------------------------
  // FORECASTS
  // ---------------------------------------------------------------------------

  /**
   * Get 7-day forecast for a location
   */
  async getForecast(lat: number, lon: number): Promise<NOAAForecast> {
    const point = await this.getPoint(lat, lon);
    return this.request<NOAAForecast>('GET', point.forecast.replace(NOAAWeatherConnector.BASE_URL, ''));
  }

  /**
   * Get hourly forecast for a location
   */
  async getForecastHourly(lat: number, lon: number): Promise<NOAAForecast> {
    const point = await this.getPoint(lat, lon);
    return this.request<NOAAForecast>('GET', point.forecastHourly.replace(NOAAWeatherConnector.BASE_URL, ''));
  }

  /**
   * Get forecast for a specific grid point
   */
  async getGridForecast(office: string, gridX: number, gridY: number): Promise<NOAAForecast> {
    return this.request<NOAAForecast>('GET', `/gridpoints/${office}/${gridX},${gridY}/forecast`);
  }

  // ---------------------------------------------------------------------------
  // OBSERVATIONS
  // ---------------------------------------------------------------------------

  /**
   * Get latest observation from a weather station
   */
  async getLatestObservation(stationId: string): Promise<NOAAObservation> {
    const response = await this.request<{ properties: NOAAObservation }>(
      'GET',
      `/stations/${stationId}/observations/latest`
    );
    return response.properties;
  }

  /**
   * Get all recent observations from a station
   */
  async getObservations(stationId: string, options?: {
    start?: string;
    end?: string;
    limit?: number;
  }): Promise<NOAAObservation[]> {
    const params: Record<string, string | number> = {};
    if (options?.start) params.start = options.start;
    if (options?.end) params.end = options.end;
    if (options?.limit) params.limit = options.limit;

    const response = await this.request<{ features: Array<{ properties: NOAAObservation }> }>(
      'GET',
      `/stations/${stationId}/observations`,
      { params }
    );
    return response.features.map(f => f.properties);
  }

  /**
   * Get observation for nearest station to a point
   */
  async getNearestObservation(lat: number, lon: number): Promise<NOAAObservation | null> {
    const stations = await this.getStations(lat, lon);
    if (stations.length === 0) return null;

    return this.getLatestObservation(stations[0].stationIdentifier);
  }

  // ---------------------------------------------------------------------------
  // ALERTS
  // ---------------------------------------------------------------------------

  /**
   * Get active weather alerts for a specific area or nationwide
   */
  async getAlerts(options?: {
    area?: string; // State code or zone
    point?: string; // lat,lon
    zone?: string; // Zone ID
    region?: string; // Region type
    status?: 'actual' | 'exercise' | 'system' | 'test' | 'draft';
    messageType?: 'alert' | 'update' | 'cancel';
    event?: string; // Event type
    urgency?: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
    severity?: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
    certainty?: 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';
    limit?: number;
  }): Promise<NOAAAlert[]> {
    const params: Record<string, string | number> = {};
    if (options?.area) params.area = options.area;
    if (options?.point) params.point = options.point;
    if (options?.zone) params.zone = options.zone;
    if (options?.region) params.region = options.region;
    if (options?.status) params.status = options.status;
    if (options?.messageType) params.message_type = options.messageType;
    if (options?.event) params.event = options.event;
    if (options?.urgency) params.urgency = options.urgency;
    if (options?.severity) params.severity = options.severity;
    if (options?.certainty) params.certainty = options.certainty;
    if (options?.limit) params.limit = options.limit;

    const response = await this.request<{ features: Array<{ properties: NOAAAlert }> }>(
      'GET',
      '/alerts/active',
      { params }
    );
    return response.features.map(f => f.properties);
  }

  /**
   * Get specific alert by ID
   */
  async getAlert(alertId: string): Promise<NOAAAlert> {
    const response = await this.request<{ properties: NOAAAlert }>('GET', `/alerts/${alertId}`);
    return response.properties;
  }

  /**
   * Get alert types
   */
  async getAlertTypes(): Promise<string[]> {
    const response = await this.request<{ eventTypes: string[] }>('GET', '/alerts/types');
    return response.eventTypes;
  }

  // ---------------------------------------------------------------------------
  // RADAR
  // ---------------------------------------------------------------------------

  /**
   * Get radar stations
   */
  async getRadarStations(): Promise<unknown[]> {
    const response = await this.request<{ features: unknown[] }>('GET', '/radar/stations');
    return response.features;
  }

  /**
   * Get radar data for a specific station
   */
  async getRadarData(stationId: string): Promise<unknown> {
    return this.request('GET', `/radar/stations/${stationId}`);
  }

  // ---------------------------------------------------------------------------
  // ZONES
  // ---------------------------------------------------------------------------

  /**
   * Get forecast zones
   */
  async getZones(type?: 'forecast' | 'fire' | 'county' | 'public'): Promise<unknown[]> {
    const path = type ? `/zones/${type}` : '/zones';
    const response = await this.request<{ features: unknown[] }>('GET', path);
    return response.features;
  }

  /**
   * Get specific zone
   */
  async getZone(type: string, zoneId: string): Promise<unknown> {
    return this.request('GET', `/zones/${type}/${zoneId}`);
  }

  // ---------------------------------------------------------------------------
  // OFFICES
  // ---------------------------------------------------------------------------

  /**
   * Get all Weather Forecast Offices
   */
  async getOffices(): Promise<unknown[]> {
    const response = await this.request<{ '@graph': unknown[] }>('GET', '/offices');
    return response['@graph'];
  }

  /**
   * Get specific office
   */
  async getOffice(officeId: string): Promise<unknown> {
    return this.request('GET', `/offices/${officeId}`);
  }

  // ---------------------------------------------------------------------------
  // GLOSSARY
  // ---------------------------------------------------------------------------

  /**
   * Get weather glossary
   */
  async getGlossary(): Promise<unknown> {
    return this.request('GET', '/glossary');
  }

  // ---------------------------------------------------------------------------
  // DATA FETCH
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<unknown[]> {
    const dataType = (params?.type as string) || 'alerts';

    switch (dataType) {
      case 'alerts':
        return this.getAlerts(params as Parameters<typeof this.getAlerts>[0]);

      case 'forecast':
        if (!params?.lat || !params?.lon) {
          throw new Error('Forecast requires lat and lon parameters');
        }
        const forecast = await this.getForecast(params.lat as number, params.lon as number);
        return forecast.properties.periods;

      case 'observations':
        if (params?.stationId) {
          return this.getObservations(params.stationId as string);
        }
        if (params?.lat && params?.lon) {
          const obs = await this.getNearestObservation(params.lat as number, params.lon as number);
          return obs ? [obs] : [];
        }
        throw new Error('Observations require stationId or lat/lon parameters');

      case 'stations':
        if (!params?.lat || !params?.lon) {
          throw new Error('Stations requires lat and lon parameters');
        }
        return this.getStations(params.lat as number, params.lon as number);

      case 'zones':
        return this.getZones(params?.zoneType as 'forecast' | 'fire' | 'county' | 'public');

      default:
        return this.getAlerts();
    }
  }
}

// Factory function for registration
export function createNOAAWeatherConnector(config: HttpConnectorConfig): NOAAWeatherConnector {
  return new NOAAWeatherConnector(config);
}
