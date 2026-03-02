// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * ORACLE FUSION CLOUD CONNECTOR - Enterprise ERP Integration
 * =============================================================================
 * Real Oracle Fusion REST API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface OracleConfig extends ConnectorConfig {
  instanceUrl?: string;
  podName?: string;
}

export interface OracleEntity {
  links?: Array<{ rel: string; href: string; kind: string }>;
  [key: string]: any;
}

export interface OracleResponse<T> {
  items: T[];
  count: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  links?: Array<{ rel: string; href: string; kind: string }>;
}

export class OracleConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private instanceUrl: string;
  private baseApiUrl: string;

  constructor(config: OracleConfig) {
    super({
      ...config,
      id: config.id || 'oracle-fusion',
      name: config.name || 'Oracle Fusion Cloud',
      description: 'Oracle Fusion Cloud ERP integration',
      vertical: 'enterprise',
      category: 'erp',
      baseUrl: config.instanceUrl || process.env['ORACLE_INSTANCE_URL'] || '',
      authType: 'oauth2',
    });

    this.instanceUrl = config.instanceUrl || process.env['ORACLE_INSTANCE_URL'] || '';
    this.baseApiUrl = `${this.instanceUrl}/fscmRestApi/resources/11.13.18.05`;

    const redirectUri = config.credentials?.['redirectUri'] || process.env['ORACLE_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['ORACLE_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['ORACLE_CLIENT_SECRET'] || '',
      authorizationUrl: `${this.instanceUrl}/oauth2/v1/authorize`,
      tokenUrl: `${this.instanceUrl}/oauth2/v1/token`,
      redirectUri,
      scopes: ['urn:opc:resource:consumer::all'],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'oracle-fusion',
      name: 'Oracle Fusion Cloud',
      description: 'Oracle Fusion - ERP, HCM, CX, SCM applications',
      vertical: 'enterprise',
      category: 'erp',
      provider: 'Oracle',
      region: 'Global',
      dataTypes: ['financials', 'hrm', 'procurement', 'projects', 'scm', 'inventory'],
      updateFrequency: 'Real-time via REST',
      documentationUrl: 'https://docs.oracle.com/en/cloud/saas/index.html',
      apiVersion: 'REST v1',
      requiredCredentials: ['instanceUrl', 'clientId', 'clientSecret', 'redirectUri'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'FedRAMP'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Oracle REST APIs with OAuth2 (requires Oracle subscription)',
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
        this.log('info', 'Connected to Oracle Fusion Cloud');
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
      await this.query('invoices', { limit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic REST query
   */
  async query<T = any>(
    resource: string,
    params?: {
      q?: string;
      finder?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      fields?: string;
    }
  ): Promise<OracleResponse<T>> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.set('q', params.q);
    if (params?.finder) queryParams.set('finder', params.finder);
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.offset) queryParams.set('offset', String(params.offset));
    if (params?.orderBy) queryParams.set('orderBy', params.orderBy);
    if (params?.fields) queryParams.set('fields', params.fields);

    const url = `${this.baseApiUrl}/${resource}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.oauth.authenticatedRequest<OracleResponse<T>>(url);
  }

  /**
   * Get invoices
   */
  async getInvoices(options?: { limit?: number; filter?: string }): Promise<any[]> {
    const result = await this.query('invoices', {
      limit: options?.limit || 100,
      q: options?.filter,
    });
    return result.items;
  }

  /**
   * Get purchase orders
   */
  async getPurchaseOrders(options?: { limit?: number; filter?: string }): Promise<any[]> {
    const result = await this.query('purchaseOrders', {
      limit: options?.limit || 100,
      q: options?.filter,
    });
    return result.items;
  }

  /**
   * Get suppliers
   */
  async getSuppliers(options?: { limit?: number; filter?: string }): Promise<any[]> {
    const result = await this.query('suppliers', {
      limit: options?.limit || 100,
      q: options?.filter,
    });
    return result.items;
  }

  /**
   * Get employees (HCM)
   */
  async getEmployees(options?: { limit?: number; filter?: string }): Promise<any[]> {
    const result = await this.query('workers', {
      limit: options?.limit || 100,
      q: options?.filter,
    });
    return result.items;
  }

  /**
   * Get projects
   */
  async getProjects(options?: { limit?: number; filter?: string }): Promise<any[]> {
    const result = await this.query('projects', {
      limit: options?.limit || 100,
      q: options?.filter,
    });
    return result.items;
  }

  /**
   * Create invoice
   */
  async createInvoice(data: Record<string, any>): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.baseApiUrl}/invoices`;
    const response = await this.oauth.authenticatedRequest<OracleEntity>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  }

  private buildKeyString(key: Record<string, any>): string {
    return Object.entries(key)
      .map(([k, v]) => `${k}='${v}'`)
      .join(',');
  }

  async fetchData(params?: { resource?: string; filter?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.resource) {
        const result = await this.query(params.resource, {
          q: params.filter,
          limit: 100,
        });
        records = result.items;
      } else {
        records = await this.getInvoices({ limit: 50 });
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

export default OracleConnector;
