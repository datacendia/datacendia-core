// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * SAP S/4HANA CONNECTOR - Enterprise ERP Integration
 * =============================================================================
 * Real SAP OData API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface SAPConfig extends ConnectorConfig {
  systemUrl?: string;
  sapClient?: string;
  sapLanguage?: string;
}

export interface SAPEntity {
  __metadata: { uri: string; type: string };
  [key: string]: any;
}

export interface SAPODataResponse<T> {
  d: {
    results?: T[];
    [key: string]: any;
  };
}

export class SAPConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private systemUrl: string;
  private sapClient: string;
  private sapLanguage: string;
  private baseApiUrl: string;

  constructor(config: SAPConfig) {
    super({
      ...config,
      id: config.id || 'sap',
      name: config.name || 'SAP S/4HANA',
      description: 'SAP ERP integration',
      vertical: 'enterprise',
      category: 'erp',
      baseUrl: config.systemUrl || process.env['SAP_SYSTEM_URL'] || '',
      authType: 'oauth2',
    });

    this.systemUrl = config.systemUrl || process.env['SAP_SYSTEM_URL'] || '';
    this.sapClient = config.sapClient || process.env['SAP_CLIENT'] || '100';
    this.sapLanguage = config.sapLanguage || process.env['SAP_LANGUAGE'] || 'EN';
    this.baseApiUrl = `${this.systemUrl}/sap/opu/odata/sap`;

    const redirectUri = config.credentials?.['redirectUri'] || process.env['SAP_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['SAP_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['SAP_CLIENT_SECRET'] || '',
      authorizationUrl: `${this.systemUrl}/sap/bc/sec/oauth2/authorize`,
      tokenUrl: `${this.systemUrl}/sap/bc/sec/oauth2/token`,
      redirectUri,
      scopes: ['API_FINANCIALS', 'API_MATERIAL', 'API_SALES_ORDER', 'API_PURCHASE_ORDER'],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'sap',
      name: 'SAP S/4HANA',
      description: 'SAP ERP - financials, materials, sales, procurement',
      vertical: 'enterprise',
      category: 'erp',
      provider: 'SAP',
      region: 'Global',
      dataTypes: ['financials', 'materials', 'sales_orders', 'purchase_orders', 'master_data', 'inventory'],
      updateFrequency: 'Real-time via OData',
      documentationUrl: 'https://api.sap.com/',
      apiVersion: 'OData v4',
      requiredCredentials: ['systemUrl', 'clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['sapClient', 'sapLanguage'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'SAP OData APIs with OAuth2 (requires SAP subscription)',
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
        this.log('info', 'Connected to SAP S/4HANA');
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
      await this.queryOData('API_BUSINESS_PARTNER/A_BusinessPartner', { $top: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic OData query
   */
  async queryOData<T = any>(
    entitySet: string,
    params?: {
      $filter?: string;
      $select?: string;
      $expand?: string;
      $top?: number;
      $skip?: number;
      $orderby?: string;
    }
  ): Promise<T[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const queryParams = new URLSearchParams();
    queryParams.set('sap-client', this.sapClient);
    queryParams.set('sap-language', this.sapLanguage);
    
    if (params?.$filter) queryParams.set('$filter', params.$filter);
    if (params?.$select) queryParams.set('$select', params.$select);
    if (params?.$expand) queryParams.set('$expand', params.$expand);
    if (params?.$top) queryParams.set('$top', String(params.$top));
    if (params?.$skip) queryParams.set('$skip', String(params.$skip));
    if (params?.$orderby) queryParams.set('$orderby', params.$orderby);

    const url = `${this.baseApiUrl}/${entitySet}?${queryParams.toString()}`;
    const response = await this.oauth.authenticatedRequest<SAPODataResponse<T>>(url);
    return response.d.results || [];
  }

  /**
   * Get entity by key
   */
  async getEntity<T = any>(entitySet: string, key: string | Record<string, any>): Promise<T> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const keyString = typeof key === 'string' ? `'${key}'` : this.buildKeyString(key);
    const url = `${this.baseApiUrl}/${entitySet}(${keyString})?sap-client=${this.sapClient}&sap-language=${this.sapLanguage}`;
    const response = await this.oauth.authenticatedRequest<{ d: T }>(url);
    return response.d;
  }

  /**
   * Create entity
   */
  async createEntity<T = any>(entitySet: string, data: Record<string, any>): Promise<T> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.baseApiUrl}/${entitySet}?sap-client=${this.sapClient}&sap-language=${this.sapLanguage}`;
    const response = await this.oauth.authenticatedRequest<{ d: T }>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.d;
  }

  /**
   * Update entity
   */
  async updateEntity(entitySet: string, key: string | Record<string, any>, data: Record<string, any>): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const keyString = typeof key === 'string' ? `'${key}'` : this.buildKeyString(key);
    const url = `${this.baseApiUrl}/${entitySet}(${keyString})?sap-client=${this.sapClient}&sap-language=${this.sapLanguage}`;
    await this.oauth.authenticatedRequest(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete entity
   */
  async deleteEntity(entitySet: string, key: string | Record<string, any>): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const keyString = typeof key === 'string' ? `'${key}'` : this.buildKeyString(key);
    const url = `${this.baseApiUrl}/${entitySet}(${keyString})?sap-client=${this.sapClient}&sap-language=${this.sapLanguage}`;
    await this.oauth.authenticatedRequest(url, { method: 'DELETE' });
  }

  /**
   * Get business partners
   */
  async getBusinessPartners(options?: { top?: number; filter?: string }): Promise<any[]> {
    return this.queryOData('API_BUSINESS_PARTNER/A_BusinessPartner', {
      $top: options?.top || 100,
      $filter: options?.filter,
    });
  }

  /**
   * Get sales orders
   */
  async getSalesOrders(options?: { top?: number; filter?: string }): Promise<any[]> {
    return this.queryOData('API_SALES_ORDER_SRV/A_SalesOrder', {
      $top: options?.top || 100,
      $filter: options?.filter,
    });
  }

  /**
   * Get purchase orders
   */
  async getPurchaseOrders(options?: { top?: number; filter?: string }): Promise<any[]> {
    return this.queryOData('API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder', {
      $top: options?.top || 100,
      $filter: options?.filter,
    });
  }

  /**
   * Get material master data
   */
  async getMaterials(options?: { top?: number; filter?: string }): Promise<any[]> {
    return this.queryOData('API_PRODUCT_SRV/A_Product', {
      $top: options?.top || 100,
      $filter: options?.filter,
    });
  }

  /**
   * Get financial documents
   */
  async getFinancialDocuments(options?: { top?: number; filter?: string }): Promise<any[]> {
    return this.queryOData('API_FINANCIALDOCUMENT_SRV/A_FinancialDocument', {
      $top: options?.top || 100,
      $filter: options?.filter,
    });
  }

  private buildKeyString(key: Record<string, any>): string {
    return Object.entries(key)
      .map(([k, v]) => `${k}='${v}'`)
      .join(',');
  }

  async fetchData(params?: { entitySet?: string; filter?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.entitySet) {
        records = await this.queryOData(params.entitySet, {
          $filter: params.filter,
          $top: 100,
        });
      } else {
        records = await this.getBusinessPartners({ top: 50 });
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

export default SAPConnector;
