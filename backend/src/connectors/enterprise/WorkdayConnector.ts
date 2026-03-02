// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * WORKDAY CONNECTOR - Enterprise HCM Integration
 * =============================================================================
 * Real Workday REST API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface WorkdayConfig extends ConnectorConfig {
  tenantUrl?: string;
  tenantName?: string;
}

export interface WorkdayWorker {
  id: string;
  descriptor: string;
  href: string;
  primaryWorkEmail?: string;
  primaryWorkPhone?: string;
  businessTitle?: string;
  location?: { descriptor: string };
  supervisoryOrganization?: { descriptor: string };
}

export interface WorkdayOrganization {
  id: string;
  descriptor: string;
  href: string;
  organizationType?: { descriptor: string };
  manager?: { descriptor: string };
}

export interface WorkdayJob {
  id: string;
  descriptor: string;
  href: string;
  jobFamily?: { descriptor: string };
  jobProfile?: { descriptor: string };
}

export class WorkdayConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private tenantUrl: string;
  private baseApiUrl: string;

  constructor(config: WorkdayConfig) {
    super({
      ...config,
      id: config.id || 'workday',
      name: config.name || 'Workday',
      description: 'Workday HCM platform integration',
      vertical: 'enterprise',
      category: 'hcm',
      baseUrl: config.tenantUrl || process.env['WORKDAY_TENANT_URL'] || '',
      authType: 'oauth2',
    });

    this.tenantUrl = config.tenantUrl || process.env['WORKDAY_TENANT_URL'] || '';
    this.baseApiUrl = `${this.tenantUrl}/ccx/api/v1/${config.tenantName || process.env['WORKDAY_TENANT_NAME'] || ''}`;

    const redirectUri = config.credentials?.['redirectUri'] || process.env['WORKDAY_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['WORKDAY_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['WORKDAY_CLIENT_SECRET'] || '',
      authorizationUrl: `${this.tenantUrl}/authorize`,
      tokenUrl: `${this.tenantUrl}/token`,
      redirectUri,
      scopes: ['workday.common', 'workday.staffing', 'workday.compensation'],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'workday',
      name: 'Workday',
      description: 'Workday HCM - employees, org structure, compensation, time off',
      vertical: 'enterprise',
      category: 'hcm',
      provider: 'Workday',
      region: 'Global',
      dataTypes: ['workers', 'organizations', 'compensation', 'time_off', 'recruiting', 'performance'],
      updateFrequency: 'Real-time via API',
      documentationUrl: 'https://community.workday.com/sites/default/files/file-hosting/restapi/',
      apiVersion: 'REST API v1',
      requiredCredentials: ['tenantUrl', 'tenantName', 'clientId', 'clientSecret', 'redirectUri'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Workday REST API with OAuth2 (requires Workday subscription)',
    };
  }

  getAuthorizationUrl(): { url: string; state: string } {
    return this.oauth.getAuthorizationUrl();
  }

  async handleOAuthCallback(code: string): Promise<void> {
    await this.oauth.exchangeCodeForToken(code);
    this.status = 'connected';
    this.log('info', 'OAuth authorization completed');
  }

  async connect(): Promise<void> {
    this.status = 'connecting';
    try {
      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        this.status = 'connected';
        this.log('info', 'Connected to Workday');
      } else {
        this.status = 'disconnected';
        this.log('info', 'Authorization required');
      }
    } catch (error) {
      this.status = 'error';
      this.lastError = error as Error;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.oauth.revokeToken();
    this.status = 'disconnected';
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.listWorkers({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic Workday API query
   */
  private async query<T = any>(
    endpoint: string,
    params?: {
      limit?: number;
      offset?: number;
      search?: string;
    }
  ): Promise<{ data: T[]; total: number }> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.offset) queryParams.set('offset', String(params.offset));
    if (params?.search) queryParams.set('search', params.search);

    const url = `${this.baseApiUrl}/${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.oauth.authenticatedRequest<{ data: T[]; total: number }>(url);
    return response;
  }

  /**
   * List workers (employees)
   */
  async listWorkers(options?: { limit?: number; offset?: number; search?: string }): Promise<WorkdayWorker[]> {
    const result = await this.query<WorkdayWorker>('workers', options);
    return result.data;
  }

  /**
   * Get worker by ID
   */
  async getWorker(workerId: string): Promise<WorkdayWorker> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest<WorkdayWorker>(`${this.baseApiUrl}/workers/${workerId}`);
  }

  /**
   * List organizations
   */
  async listOrganizations(options?: { limit?: number; offset?: number }): Promise<WorkdayOrganization[]> {
    const result = await this.query<WorkdayOrganization>('organizations', options);
    return result.data;
  }

  /**
   * Get organization by ID
   */
  async getOrganization(orgId: string): Promise<WorkdayOrganization> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest<WorkdayOrganization>(`${this.baseApiUrl}/organizations/${orgId}`);
  }

  /**
   * List jobs
   */
  async listJobs(options?: { limit?: number; offset?: number }): Promise<WorkdayJob[]> {
    const result = await this.query<WorkdayJob>('jobs', options);
    return result.data;
  }

  /**
   * Get worker compensation
   */
  async getWorkerCompensation(workerId: string): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest(`${this.baseApiUrl}/workers/${workerId}/compensation`);
  }

  /**
   * Get time off balances
   */
  async getTimeOffBalances(workerId: string): Promise<any[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const result = await this.oauth.authenticatedRequest<{ data: any[] }>(
      `${this.baseApiUrl}/workers/${workerId}/timeOffBalances`
    );
    return result.data;
  }

  /**
   * Search workers
   */
  async searchWorkers(searchTerm: string, options?: { limit?: number }): Promise<WorkdayWorker[]> {
    return this.listWorkers({
      search: searchTerm,
      limit: options?.limit || 50,
    });
  }

  async fetchData(params?: { type?: 'workers' | 'organizations' | 'jobs'; search?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      const type = params?.type || 'workers';
      if (type === 'workers') {
        records = await this.listWorkers({ limit: 100, search: params?.search });
      } else if (type === 'organizations') {
        records = await this.listOrganizations({ limit: 100 });
      } else if (type === 'jobs') {
        records = await this.listJobs({ limit: 100 });
      }
    } catch (error) {
      errors.push((error as Error).message);
    }

    return {
      connectorId: this.config.id,
      timestamp: new Date(),
      recordsIngested: records.length,
      bytesProcessed: JSON.stringify(records).length,
      durationMs: Date.now() - startTime,
      errors,
      warnings,
      checksum: this.generateChecksum(records),
    };
  }
}

export default WorkdayConnector;
