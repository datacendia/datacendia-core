// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SERVICENOW CONNECTOR - Enterprise ITSM Integration
 * =============================================================================
 * Real ServiceNow REST API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface ServiceNowConfig extends ConnectorConfig {
  instanceUrl?: string;
  instanceName?: string;
}

export interface ServiceNowIncident {
  sys_id: string;
  number: string;
  short_description: string;
  description: string;
  state: string;
  priority: string;
  urgency: string;
  impact: string;
  assigned_to: { value: string; display_value: string };
  assignment_group: { value: string; display_value: string };
  opened_at: string;
  updated_at: string;
  closed_at: string | null;
  category: string;
  subcategory: string;
}

export interface ServiceNowChange {
  sys_id: string;
  number: string;
  short_description: string;
  description: string;
  state: string;
  risk: string;
  impact: string;
  priority: string;
  requested_by: { value: string; display_value: string };
  start_date: string;
  end_date: string;
  type: string;
}

export interface ServiceNowCMDBItem {
  sys_id: string;
  name: string;
  sys_class_name: string;
  asset_tag: string;
  serial_number: string;
  model_id: { value: string; display_value: string };
  location: { value: string; display_value: string };
  assigned_to: { value: string; display_value: string };
  install_status: string;
}

export class ServiceNowConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private instanceUrl: string;
  private apiVersion = 'now/table';

  constructor(config: ServiceNowConfig) {
    super({
      ...config,
      id: config.id || 'servicenow',
      name: config.name || 'ServiceNow',
      description: 'ServiceNow ITSM platform integration',
      vertical: 'enterprise',
      category: 'itsm',
      baseUrl: config.instanceUrl || `https://${config.instanceName || 'dev'}.service-now.com`,
      authType: 'oauth2',
    });

    this.instanceUrl = config.instanceUrl || `https://${config.instanceName || process.env['SERVICENOW_INSTANCE'] || 'dev'}.service-now.com`;

    const redirectUri = config.credentials?.['redirectUri'] || process.env['SERVICENOW_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['SERVICENOW_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['SERVICENOW_CLIENT_SECRET'] || '',
      authorizationUrl: `${this.instanceUrl}/oauth_auth.do`,
      tokenUrl: `${this.instanceUrl}/oauth_token.do`,
      redirectUri,
      scopes: ['useraccount'],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'servicenow',
      name: 'ServiceNow',
      description: 'ServiceNow ITSM - incidents, changes, problems, assets',
      vertical: 'enterprise',
      category: 'itsm',
      provider: 'ServiceNow',
      region: 'Global',
      dataTypes: ['incidents', 'changes', 'problems', 'assets', 'cmdb', 'users', 'catalog'],
      updateFrequency: 'Real-time via API',
      documentationUrl: 'https://developer.servicenow.com/dev.do',
      apiVersion: 'REST API',
      requiredCredentials: ['instanceUrl', 'clientId', 'clientSecret', 'redirectUri'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'FedRAMP'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Full REST API with OAuth2',
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
        this.log('info', 'Connected to ServiceNow');
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
      const result = await this.query('sys_user', { sysparm_limit: 1 });
      return result.result.length >= 0;
    } catch {
      return false;
    }
  }

  /**
   * Generic table query
   */
  async query(table: string, params?: {
    sysparm_query?: string;
    sysparm_limit?: number;
    sysparm_offset?: number;
    sysparm_fields?: string;
  }): Promise<{ result: any[] }> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const queryParams = new URLSearchParams();
    if (params?.sysparm_query) queryParams.set('sysparm_query', params.sysparm_query);
    if (params?.sysparm_limit) queryParams.set('sysparm_limit', String(params.sysparm_limit));
    if (params?.sysparm_offset) queryParams.set('sysparm_offset', String(params.sysparm_offset));
    if (params?.sysparm_fields) queryParams.set('sysparm_fields', params.sysparm_fields);

    const url = `${this.instanceUrl}/api/${this.apiVersion}/${table}?${queryParams.toString()}`;
    return this.oauth.authenticatedRequest<{ result: any[] }>(url);
  }

  /**
   * Get record by sys_id
   */
  async getRecord(table: string, sysId: string): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/api/${this.apiVersion}/${table}/${sysId}`;
    const result = await this.oauth.authenticatedRequest<{ result: any }>(url);
    return result.result;
  }

  /**
   * Create record
   */
  async createRecord(table: string, data: Record<string, any>): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/api/${this.apiVersion}/${table}`;
    const result = await this.oauth.authenticatedRequest<{ result: any }>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return result.result;
  }

  /**
   * Update record
   */
  async updateRecord(table: string, sysId: string, data: Record<string, any>): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/api/${this.apiVersion}/${table}/${sysId}`;
    const result = await this.oauth.authenticatedRequest<{ result: any }>(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return result.result;
  }

  /**
   * List incidents
   */
  async listIncidents(options?: {
    state?: string;
    priority?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceNowIncident[]> {
    const query: string[] = [];
    if (options?.state) query.push(`state=${options.state}`);
    if (options?.priority) query.push(`priority=${options.priority}`);

    const result = await this.query('incident', {
      sysparm_query: query.join('^'),
      sysparm_limit: options?.limit || 100,
      sysparm_offset: options?.offset,
    });
    return result.result as ServiceNowIncident[];
  }

  /**
   * Create incident
   */
  async createIncident(data: {
    short_description: string;
    description?: string;
    urgency?: string;
    impact?: string;
    category?: string;
    assigned_to?: string;
  }): Promise<ServiceNowIncident> {
    return this.createRecord('incident', data) as Promise<ServiceNowIncident>;
  }

  /**
   * List changes
   */
  async listChanges(options?: {
    state?: string;
    risk?: string;
    limit?: number;
  }): Promise<ServiceNowChange[]> {
    const query: string[] = [];
    if (options?.state) query.push(`state=${options.state}`);
    if (options?.risk) query.push(`risk=${options.risk}`);

    const result = await this.query('change_request', {
      sysparm_query: query.join('^'),
      sysparm_limit: options?.limit || 100,
    });
    return result.result as ServiceNowChange[];
  }

  /**
   * List CMDB items
   */
  async listCMDBItems(options?: {
    class?: string;
    limit?: number;
  }): Promise<ServiceNowCMDBItem[]> {
    const table = options?.class || 'cmdb_ci';
    const result = await this.query(table, {
      sysparm_limit: options?.limit || 100,
    });
    return result.result as ServiceNowCMDBItem[];
  }

  /**
   * Search across tables
   */
  async search(searchTerm: string, tables: string[] = ['incident', 'change_request']): Promise<{
    table: string;
    results: any[];
  }[]> {
    const results = await Promise.all(
      tables.map(async (table) => {
        const result = await this.query(table, {
          sysparm_query: `short_descriptionLIKE${searchTerm}^ORdescriptionLIKE${searchTerm}`,
          sysparm_limit: 20,
        });
        return { table, results: result.result };
      })
    );
    return results;
  }

  async fetchData(params?: { table?: string; query?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.table) {
        const result = await this.query(params.table, {
          sysparm_query: params.query,
          sysparm_limit: 100,
        });
        records = result.result;
      } else {
        const incidents = await this.listIncidents({ limit: 50 });
        records = incidents;
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

export default ServiceNowConnector;
