// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * HUBSPOT CONNECTOR - Enterprise CRM & Marketing Integration
 * =============================================================================
 * Real HubSpot API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface HubSpotConfig extends ConnectorConfig {
  privateAppToken?: string;
}

export interface HubSpotContact {
  id: string;
  properties: {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    phone: string;
    lifecyclestage: string;
    createdate: string;
    lastmodifieddate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotCompany {
  id: string;
  properties: {
    name: string;
    domain: string;
    industry: string;
    numberofemployees: string;
    city: string;
    state: string;
    country: string;
    createdate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string;
    pipeline: string;
    closedate: string;
    createdate: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export class HubSpotConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private privateToken?: string;
  private baseApiUrl = 'https://api.hubapi.com';

  constructor(config: HubSpotConfig) {
    super({
      ...config,
      id: config.id || 'hubspot',
      name: config.name || 'HubSpot',
      description: 'HubSpot CRM and marketing platform integration',
      vertical: 'enterprise',
      category: 'crm',
      baseUrl: 'https://app.hubspot.com',
      authType: 'oauth2',
    });

    this.privateToken = config.privateAppToken || process.env['HUBSPOT_PRIVATE_TOKEN'];

    const redirectUri = config.credentials?.['redirectUri'] || process.env['HUBSPOT_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['HUBSPOT_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['HUBSPOT_CLIENT_SECRET'] || '',
      authorizationUrl: 'https://app.hubspot.com/oauth/authorize',
      tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
      redirectUri,
      scopes: [
        'crm.objects.contacts.read',
        'crm.objects.contacts.write',
        'crm.objects.companies.read',
        'crm.objects.companies.write',
        'crm.objects.deals.read',
        'crm.objects.deals.write',
        'crm.schemas.contacts.read',
        'crm.schemas.companies.read',
        'crm.schemas.deals.read',
      ],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'HubSpot CRM - contacts, companies, deals, tickets, marketing',
      vertical: 'enterprise',
      category: 'crm',
      provider: 'HubSpot',
      region: 'Global',
      dataTypes: ['contacts', 'companies', 'deals', 'tickets', 'marketing', 'emails', 'forms'],
      updateFrequency: 'Real-time via API',
      documentationUrl: 'https://developers.hubspot.com/docs/api/overview',
      apiVersion: 'v3',
      requiredCredentials: ['clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['privateAppToken'],
      complianceFrameworks: ['SOC2', 'GDPR'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Full REST API v3 with OAuth2 or private app tokens',
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
      if (this.privateToken) {
        const result = await this.apiCall<{ portalId: number }>('/account-info/v3/details');
        this.status = 'connected';
        this.log('info', `Connected to HubSpot portal ${result.portalId}`);
        return;
      }

      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        this.status = 'connected';
        this.log('info', 'Connected to HubSpot via OAuth');
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
      const result = await this.apiCall<{ portalId: number }>('/account-info/v3/details');
      return !!result.portalId;
    } catch {
      return false;
    }
  }

  private async apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.baseApiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.privateToken) {
      headers['Authorization'] = `Bearer ${this.privateToken}`;
    } else {
      const token = await this.oauth.getValidToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options?.headers },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * List contacts
   */
  async listContacts(options?: {
    limit?: number;
    after?: string;
    properties?: string[];
  }): Promise<{ results: HubSpotContact[]; paging?: { next?: { after: string } } }> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.after) params.set('after', options.after);
    if (options?.properties) {
      options.properties.forEach(prop => params.append('properties', prop));
    }

    return this.apiCall<{ results: HubSpotContact[]; paging?: { next?: { after: string } } }>(
      `/crm/v3/objects/contacts?${params.toString()}`
    );
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: string, properties?: string[]): Promise<HubSpotContact> {
    const params = properties ? `?properties=${properties.join(',')}` : '';
    return this.apiCall<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}${params}`);
  }

  /**
   * Create contact
   */
  async createContact(properties: Record<string, string>): Promise<HubSpotContact> {
    return this.apiCall<HubSpotContact>('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });
  }

  /**
   * Update contact
   */
  async updateContact(contactId: string, properties: Record<string, string>): Promise<HubSpotContact> {
    return this.apiCall<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
  }

  /**
   * List companies
   */
  async listCompanies(options?: {
    limit?: number;
    after?: string;
  }): Promise<{ results: HubSpotCompany[]; paging?: { next?: { after: string } } }> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.after) params.set('after', options.after);

    return this.apiCall<{ results: HubSpotCompany[]; paging?: { next?: { after: string } } }>(
      `/crm/v3/objects/companies?${params.toString()}`
    );
  }

  /**
   * Create company
   */
  async createCompany(properties: Record<string, string>): Promise<HubSpotCompany> {
    return this.apiCall<HubSpotCompany>('/crm/v3/objects/companies', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });
  }

  /**
   * List deals
   */
  async listDeals(options?: {
    limit?: number;
    after?: string;
  }): Promise<{ results: HubSpotDeal[]; paging?: { next?: { after: string } } }> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.after) params.set('after', options.after);

    return this.apiCall<{ results: HubSpotDeal[]; paging?: { next?: { after: string } } }>(
      `/crm/v3/objects/deals?${params.toString()}`
    );
  }

  /**
   * Create deal
   */
  async createDeal(properties: Record<string, string>): Promise<HubSpotDeal> {
    return this.apiCall<HubSpotDeal>('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });
  }

  /**
   * Search CRM objects
   */
  async search(objectType: 'contacts' | 'companies' | 'deals', query: {
    filterGroups: Array<{
      filters: Array<{
        propertyName: string;
        operator: string;
        value: string;
      }>;
    }>;
    sorts?: Array<{ propertyName: string; direction: 'ASCENDING' | 'DESCENDING' }>;
    limit?: number;
  }): Promise<{ results: any[]; total: number }> {
    return this.apiCall(`/crm/v3/objects/${objectType}/search`, {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async fetchData(params?: { objectType?: 'contacts' | 'companies' | 'deals' }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      const objectType = params?.objectType || 'contacts';
      if (objectType === 'contacts') {
        const result = await this.listContacts({ limit: 100 });
        records = result.results;
      } else if (objectType === 'companies') {
        const result = await this.listCompanies({ limit: 100 });
        records = result.results;
      } else if (objectType === 'deals') {
        const result = await this.listDeals({ limit: 100 });
        records = result.results;
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

export default HubSpotConnector;
