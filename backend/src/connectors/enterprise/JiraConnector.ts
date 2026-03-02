// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * JIRA CONNECTOR - Enterprise Issue Tracking Integration
 * =============================================================================
 * Real Atlassian Jira Cloud REST API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface JiraConfig extends ConnectorConfig {
  cloudId?: string;
  siteName?: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: any;
    status: { name: string; id: string };
    priority?: { name: string; id: string };
    assignee?: { displayName: string; accountId: string };
    reporter?: { displayName: string; accountId: string };
    created: string;
    updated: string;
    issuetype: { name: string; id: string };
    project: { key: string; name: string; id: string };
    [key: string]: any;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
}

export interface JiraSearchResult {
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

export class JiraConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private cloudId: string;
  private baseApiUrl = 'https://api.atlassian.com';

  constructor(config: JiraConfig) {
    super({
      ...config,
      id: config.id || 'jira',
      name: config.name || 'Jira',
      description: 'Atlassian Jira issue tracking integration',
      vertical: 'enterprise',
      category: 'project-management',
      baseUrl: 'https://api.atlassian.com',
      authType: 'oauth2',
    });

    this.cloudId = config.cloudId || '';

    const redirectUri = config.credentials?.['redirectUri'] || process.env['JIRA_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['JIRA_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['JIRA_CLIENT_SECRET'] || '',
      authorizationUrl: 'https://auth.atlassian.com/authorize',
      tokenUrl: 'https://auth.atlassian.com/oauth/token',
      redirectUri,
      scopes: [
        'read:jira-work',
        'read:jira-user',
        'write:jira-work',
        'read:sprint:jira-software',
        'read:board:jira-software',
        'offline_access',
      ],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'jira',
      name: 'Jira',
      description: 'Atlassian Jira - issues, projects, sprints, boards, workflows',
      vertical: 'enterprise',
      category: 'project-management',
      provider: 'Atlassian',
      region: 'Global',
      dataTypes: ['issues', 'projects', 'sprints', 'boards', 'workflows', 'users', 'comments'],
      updateFrequency: 'Real-time via API or webhooks',
      documentationUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
      apiVersion: 'v3',
      requiredCredentials: ['clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['cloudId'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Full REST API v3 support with OAuth2 and webhooks',
    };
  }

  getAuthorizationUrl(): { url: string; state: string } {
    const auth = this.oauth.getAuthorizationUrl();
    // Jira requires audience parameter
    const url = new URL(auth.url);
    url.searchParams.set('audience', 'api.atlassian.com');
    url.searchParams.set('prompt', 'consent');
    return { url: url.toString(), state: auth.state };
  }

  async handleOAuthCallback(code: string): Promise<void> {
    await this.oauth.exchangeCodeForToken(code);
    // Fetch accessible resources to get cloudId
    await this.fetchAccessibleResources();
    this.status = 'connected';
    this.log('info', 'OAuth authorization completed');
  }

  private async fetchAccessibleResources(): Promise<void> {
    const resources = await this.oauth.authenticatedRequest<Array<{ id: string; name: string; url: string }>>(
      'https://api.atlassian.com/oauth/token/accessible-resources'
    );
    if (resources && resources.length > 0) {
      const firstResource = resources[0];
      if (firstResource) {
        this.cloudId = firstResource.id;
        this.log('info', `Using Jira site: ${firstResource.name}`);
      }
    }
  }

  async connect(): Promise<void> {
    this.status = 'connecting';
    try {
      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        if (!this.cloudId) {
          await this.fetchAccessibleResources();
        }
        this.status = 'connected';
        this.log('info', 'Connected to Jira');
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
      const result = await this.getServerInfo();
      return !!result.baseUrl;
    } catch {
      return false;
    }
  }

  private getApiBaseUrl(): string {
    return `${this.baseApiUrl}/ex/jira/${this.cloudId}/rest/api/3`;
  }

  /**
   * Get server info
   */
  async getServerInfo(): Promise<any> {
    return this.oauth.authenticatedRequest(`${this.getApiBaseUrl()}/serverInfo`);
  }

  /**
   * Search issues using JQL
   */
  async searchIssues(jql: string, options?: {
    startAt?: number;
    maxResults?: number;
    fields?: string[];
    expand?: string[];
  }): Promise<JiraSearchResult> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const params = new URLSearchParams({
      jql,
      startAt: String(options?.startAt || 0),
      maxResults: String(options?.maxResults || 50),
    });
    if (options?.fields) {
      params.set('fields', options.fields.join(','));
    }
    if (options?.expand) {
      params.set('expand', options.expand.join(','));
    }

    return this.oauth.authenticatedRequest<JiraSearchResult>(
      `${this.getApiBaseUrl()}/search?${params.toString()}`
    );
  }

  /**
   * Get issue by key
   */
  async getIssue(issueKey: string, options?: { fields?: string[]; expand?: string[] }): Promise<JiraIssue> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const params = new URLSearchParams();
    if (options?.fields) {
      params.set('fields', options.fields.join(','));
    }
    if (options?.expand) {
      params.set('expand', options.expand.join(','));
    }

    const queryString = params.toString();
    const url = `${this.getApiBaseUrl()}/issue/${issueKey}${queryString ? `?${queryString}` : ''}`;
    return this.oauth.authenticatedRequest<JiraIssue>(url);
  }

  /**
   * Create issue
   */
  async createIssue(data: {
    projectKey: string;
    issueType: string;
    summary: string;
    description?: string;
    priority?: string;
    assignee?: string;
    labels?: string[];
    [key: string]: any;
  }): Promise<{ id: string; key: string; self: string }> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const issueData = {
      fields: {
        project: { key: data.projectKey },
        issuetype: { name: data.issueType },
        summary: data.summary,
        description: data.description ? {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: data.description }] }],
        } : undefined,
        priority: data.priority ? { name: data.priority } : undefined,
        assignee: data.assignee ? { accountId: data.assignee } : undefined,
        labels: data.labels,
      },
    };

    return this.oauth.authenticatedRequest(`${this.getApiBaseUrl()}/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData),
    });
  }

  /**
   * Update issue
   */
  async updateIssue(issueKey: string, fields: Record<string, any>): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    await this.oauth.authenticatedRequest(`${this.getApiBaseUrl()}/issue/${issueKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
  }

  /**
   * Add comment to issue
   */
  async addComment(issueKey: string, body: string): Promise<any> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest(`${this.getApiBaseUrl()}/issue/${issueKey}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: body }] }],
        },
      }),
    });
  }

  /**
   * Transition issue
   */
  async transitionIssue(issueKey: string, transitionId: string): Promise<void> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    await this.oauth.authenticatedRequest(`${this.getApiBaseUrl()}/issue/${issueKey}/transitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transition: { id: transitionId } }),
    });
  }

  /**
   * List projects
   */
  async listProjects(options?: { startAt?: number; maxResults?: number }): Promise<JiraProject[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const params = new URLSearchParams({
      startAt: String(options?.startAt || 0),
      maxResults: String(options?.maxResults || 50),
    });

    const result = await this.oauth.authenticatedRequest<{ values: JiraProject[] }>(
      `${this.getApiBaseUrl()}/project/search?${params.toString()}`
    );
    return result.values;
  }

  async fetchData(params?: { jql?: string; projectKey?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.jql) {
        const result = await this.searchIssues(params.jql);
        records = result.issues;
      } else if (params?.projectKey) {
        const result = await this.searchIssues(`project = ${params.projectKey}`);
        records = result.issues;
      } else {
        const projects = await this.listProjects();
        records = projects;
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

export default JiraConnector;
