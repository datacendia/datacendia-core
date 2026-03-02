/**
 * Connector — Git Hub Connector
 *
 * External system connector for third-party integrations.
 *
 * @exports GitHubConnector, GitHubConfig, GitHubRepository, GitHubIssue, GitHubPullRequest
 * @module connectors/enterprise/GitHubConnector
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * GITHUB CONNECTOR - Enterprise Development Integration
 * =============================================================================
 * Real GitHub REST/GraphQL API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface GitHubConfig extends ConnectorConfig {
  organization?: string;
  personalAccessToken?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  default_branch: string;
  open_issues_count: number;
  stargazers_count: number;
  forks_count: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  html_url: string;
  user: { login: string; id: number };
  labels: Array<{ name: string; color: string }>;
  assignees: Array<{ login: string; id: number }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  html_url: string;
  user: { login: string; id: number };
  head: { ref: string; sha: string };
  base: { ref: string; sha: string };
  merged: boolean;
  mergeable: boolean | null;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
}

export class GitHubConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private pat?: string;
  private baseApiUrl = 'https://api.github.com';
  private organization?: string;

  constructor(config: GitHubConfig) {
    super({
      ...config,
      id: config.id || 'github',
      name: config.name || 'GitHub',
      description: 'GitHub development platform integration',
      vertical: 'enterprise',
      category: 'development',
      baseUrl: 'https://github.com',
      authType: 'oauth2',
    });

    this.pat = config.personalAccessToken || process.env['GITHUB_PAT'];
    this.organization = config.organization || process.env['GITHUB_ORG'];

    const redirectUri = config.credentials?.['redirectUri'] || process.env['GITHUB_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['GITHUB_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['GITHUB_CLIENT_SECRET'] || '',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      redirectUri,
      scopes: ['repo', 'read:org', 'read:user', 'user:email', 'workflow'],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'github',
      name: 'GitHub',
      description: 'GitHub - repositories, issues, pull requests, actions, code',
      vertical: 'enterprise',
      category: 'development',
      provider: 'GitHub (Microsoft)',
      region: 'Global',
      dataTypes: ['repositories', 'issues', 'pull_requests', 'commits', 'actions', 'releases', 'users'],
      updateFrequency: 'Real-time via API or webhooks',
      documentationUrl: 'https://docs.github.com/en/rest',
      apiVersion: 'v3',
      requiredCredentials: ['clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['personalAccessToken', 'organization'],
      complianceFrameworks: ['SOC2', 'ISO27001'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'REST and GraphQL API with OAuth2 or PAT',
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
      if (this.pat) {
        const user = await this.apiCall<{ login: string }>('/user');
        this.status = 'connected';
        this.log('info', `Connected to GitHub as ${user.login}`);
        return;
      }

      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        this.status = 'connected';
        this.log('info', 'Connected to GitHub via OAuth');
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
      const user = await this.apiCall<{ login: string }>('/user');
      return !!user.login;
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
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    if (this.pat) {
      headers['Authorization'] = `Bearer ${this.pat}`;
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
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * List repositories
   */
  async listRepositories(options?: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    per_page?: number;
    page?: number;
  }): Promise<GitHubRepository[]> {
    const params = new URLSearchParams();
    if (options?.type) params.set('type', options.type);
    if (options?.sort) params.set('sort', options.sort);
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.page) params.set('page', String(options.page));

    const endpoint = this.organization
      ? `/orgs/${this.organization}/repos?${params.toString()}`
      : `/user/repos?${params.toString()}`;

    return this.apiCall<GitHubRepository[]>(endpoint);
  }

  /**
   * Get repository
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.apiCall<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  /**
   * List issues
   */
  async listIssues(owner: string, repo: string, options?: {
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    assignee?: string;
    per_page?: number;
    page?: number;
  }): Promise<GitHubIssue[]> {
    const params = new URLSearchParams();
    if (options?.state) params.set('state', options.state);
    if (options?.labels) params.set('labels', options.labels);
    if (options?.assignee) params.set('assignee', options.assignee);
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.page) params.set('page', String(options.page));

    return this.apiCall<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?${params.toString()}`);
  }

  /**
   * Create issue
   */
  async createIssue(owner: string, repo: string, data: {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
    milestone?: number;
  }): Promise<GitHubIssue> {
    return this.apiCall<GitHubIssue>(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  /**
   * List pull requests
   */
  async listPullRequests(owner: string, repo: string, options?: {
    state?: 'open' | 'closed' | 'all';
    head?: string;
    base?: string;
    per_page?: number;
    page?: number;
  }): Promise<GitHubPullRequest[]> {
    const params = new URLSearchParams();
    if (options?.state) params.set('state', options.state);
    if (options?.head) params.set('head', options.head);
    if (options?.base) params.set('base', options.base);
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.page) params.set('page', String(options.page));

    return this.apiCall<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?${params.toString()}`);
  }

  /**
   * Get commits
   */
  async listCommits(owner: string, repo: string, options?: {
    sha?: string;
    path?: string;
    author?: string;
    since?: string;
    until?: string;
    per_page?: number;
    page?: number;
  }): Promise<Array<{ sha: string; commit: { message: string; author: { name: string; date: string } } }>> {
    const params = new URLSearchParams();
    if (options?.sha) params.set('sha', options.sha);
    if (options?.path) params.set('path', options.path);
    if (options?.author) params.set('author', options.author);
    if (options?.since) params.set('since', options.since);
    if (options?.until) params.set('until', options.until);
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.page) params.set('page', String(options.page));

    return this.apiCall(`/repos/${owner}/${repo}/commits?${params.toString()}`);
  }

  /**
   * Search code
   */
  async searchCode(query: string, options?: { per_page?: number; page?: number }): Promise<{
    total_count: number;
    items: Array<{
      name: string;
      path: string;
      sha: string;
      html_url: string;
      repository: { full_name: string };
    }>;
  }> {
    const params = new URLSearchParams({ q: query });
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.page) params.set('page', String(options.page));

    return this.apiCall(`/search/code?${params.toString()}`);
  }

  /**
   * Get authenticated user
   */
  async getCurrentUser(): Promise<{ login: string; id: number; name: string; email: string }> {
    return this.apiCall('/user');
  }

  async fetchData(params?: { owner?: string; repo?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.owner && params?.repo) {
        const [issues, prs] = await Promise.all([
          this.listIssues(params.owner, params.repo),
          this.listPullRequests(params.owner, params.repo),
        ]);
        records = [...issues, ...prs];
      } else {
        records = await this.listRepositories();
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

export default GitHubConnector;
