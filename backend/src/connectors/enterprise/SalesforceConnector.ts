/**
 * Connector — Salesforce Connector
 *
 * External system connector for third-party integrations.
 *
 * @exports SalesforceConnector, SalesforceConfig, SalesforceRecord, SalesforceQueryResult
 * @module connectors/enterprise/SalesforceConnector
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * SALESFORCE CONNECTOR - Enterprise CRM Integration
 * =============================================================================
 * Real Salesforce REST API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface SalesforceConfig extends ConnectorConfig {
  instanceUrl?: string;
  apiVersion?: string;
  sandbox?: boolean;
}

export interface SalesforceRecord {
  Id: string;
  attributes: { type: string; url: string };
  [key: string]: any;
}

export interface SalesforceQueryResult {
  totalSize: number;
  done: boolean;
  nextRecordsUrl?: string;
  records: SalesforceRecord[];
}

export class SalesforceConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private instanceUrl: string;
  private apiVersion: string;

  constructor(config: SalesforceConfig) {
    super({
      ...config,
      id: config.id || 'salesforce',
      name: config.name || 'Salesforce',
      description: 'Salesforce CRM integration',
      vertical: 'enterprise',
      category: 'crm',
      baseUrl: config.baseUrl || 'https://login.salesforce.com',
      authType: 'oauth2',
    });

    this.instanceUrl = config.instanceUrl || '';
    this.apiVersion = config.apiVersion || 'v59.0';

    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['SALESFORCE_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['SALESFORCE_CLIENT_SECRET'] || '',
      authorizationUrl: config.sandbox 
        ? 'https://test.salesforce.com/services/oauth2/authorize'
        : 'https://login.salesforce.com/services/oauth2/authorize',
      tokenUrl: config.sandbox
        ? 'https://test.salesforce.com/services/oauth2/token'
        : 'https://login.salesforce.com/services/oauth2/token',
      redirectUri: config.credentials?.['redirectUri'] || process.env['SALESFORCE_REDIRECT_URI'] || '',
      scopes: ['api', 'refresh_token', 'offline_access'],
      pkce: true,
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Salesforce CRM - accounts, contacts, opportunities, leads, cases',
      vertical: 'enterprise',
      category: 'crm',
      provider: 'Salesforce, Inc.',
      region: 'Global',
      dataTypes: ['accounts', 'contacts', 'opportunities', 'leads', 'cases', 'tasks', 'events', 'custom_objects'],
      updateFrequency: 'Real-time via API',
      documentationUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
      apiVersion: this.apiVersion,
      requiredCredentials: ['clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['instanceUrl', 'sandbox'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Full REST API support with OAuth2 PKCE flow',
    };
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(): { url: string; state: string } {
    return this.oauth.getAuthorizationUrl();
  }

  /**
   * Complete OAuth flow with authorization code
   */
  async handleOAuthCallback(code: string, codeVerifier?: string): Promise<void> {
    await this.oauth.exchangeCodeForToken(code, codeVerifier);
    // Salesforce returns instance_url in token response
    // In real implementation, parse from token response
    this.status = 'connected';
    this.log('info', 'OAuth authorization completed');
  }

  async connect(): Promise<void> {
    this.status = 'connecting';
    try {
      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        this.status = 'connected';
        this.log('info', 'Connected to Salesforce');
      } else {
        this.status = 'disconnected';
        this.log('info', 'Authorization required - call getAuthorizationUrl()');
      }
    } catch (error) {
      this.status = 'error';
      this.lastError = error as Error;
      this.log('error', 'Connection failed', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.oauth.revokeToken();
    this.status = 'disconnected';
    this.log('info', 'Disconnected from Salesforce');
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT Id FROM Organization LIMIT 1');
      return result.totalSize > 0;
    } catch {
      return false;
    }
  }

  /**
   * Execute SOQL query
   */
  async query(soql: string): Promise<SalesforceQueryResult> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/query?q=${encodeURIComponent(soql)}`;
    return this.oauth.authenticatedRequest<SalesforceQueryResult>(url);
  }

  /**
   * Get record by ID
   */
  async getRecord(objectType: string, recordId: string, fields?: string[]): Promise<SalesforceRecord> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    let url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/${objectType}/${recordId}`;
    if (fields?.length) {
      url += `?fields=${fields.join(',')}`;
    }
    return this.oauth.authenticatedRequest<SalesforceRecord>(url);
  }

  /**
   * Create record
   */
  async createRecord(objectType: string, data: Record<string, any>): Promise<{ id: string; success: boolean }> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/${objectType}`;
    return this.oauth.authenticatedRequest<{ id: string; success: boolean }>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  /**
   * Update record
   */
  async updateRecord(objectType: string, recordId: string, data: Record<string, any>): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/${objectType}/${recordId}`;
    await this.oauth.authenticatedRequest<void>(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete record
   */
  async deleteRecord(objectType: string, recordId: string): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/${objectType}/${recordId}`;
    await this.oauth.authenticatedRequest<void>(url, { method: 'DELETE' });
  }

  /**
   * Describe object schema
   */
  async describeObject(objectType: string): Promise<any> {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/${objectType}/describe`;
    return this.oauth.authenticatedRequest(url);
  }

  /**
   * List available objects
   */
  async listObjects(): Promise<any> {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects`;
    return this.oauth.authenticatedRequest(url);
  }

  async fetchData(params?: { objectType?: string; query?: string; limit?: number }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.query) {
        const result = await this.query(params.query);
        records = result.records;
      } else if (params?.objectType) {
        const limit = params.limit || 100;
        const result = await this.query(`SELECT FIELDS(ALL) FROM ${params.objectType} LIMIT ${limit}`);
        records = result.records;
      } else {
        warnings.push('No query or objectType specified');
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

export default SalesforceConnector;
