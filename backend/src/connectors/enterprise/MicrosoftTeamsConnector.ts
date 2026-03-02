/**
 * Connector — Microsoft Teams Connector
 *
 * External system connector for third-party integrations.
 *
 * @exports MicrosoftTeamsConnector, TeamsConfig, TeamsTeam, TeamsChannel, TeamsMessage, TeamsUser
 * @module connectors/enterprise/MicrosoftTeamsConnector
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * MICROSOFT TEAMS CONNECTOR - Enterprise Collaboration Integration
 * =============================================================================
 * Real Microsoft Graph API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface TeamsConfig extends ConnectorConfig {
  tenantId?: string;
}

export interface TeamsTeam {
  id: string;
  displayName: string;
  description: string | null;
  createdDateTime: string;
  visibility: 'private' | 'public';
  webUrl: string;
}

export interface TeamsChannel {
  id: string;
  displayName: string;
  description: string | null;
  membershipType: 'standard' | 'private' | 'shared';
  webUrl: string;
}

export interface TeamsMessage {
  id: string;
  createdDateTime: string;
  body: { content: string; contentType: string };
  from: { user: { displayName: string; id: string } } | null;
  importance: 'normal' | 'high' | 'urgent';
  webUrl: string;
}

export interface TeamsUser {
  id: string;
  displayName: string;
  mail: string | null;
  userPrincipalName: string;
  jobTitle: string | null;
}

export class MicrosoftTeamsConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private tenantId: string;
  private baseApiUrl = 'https://graph.microsoft.com/v1.0';

  constructor(config: TeamsConfig) {
    super({
      ...config,
      id: config.id || 'microsoft-teams',
      name: config.name || 'Microsoft Teams',
      description: 'Microsoft Teams collaboration platform integration',
      vertical: 'enterprise',
      category: 'messaging',
      baseUrl: 'https://teams.microsoft.com',
      authType: 'oauth2',
    });

    this.tenantId = config.tenantId || process.env['AZURE_TENANT_ID'] || 'common';

    const redirectUri = config.credentials?.['redirectUri'] || process.env['TEAMS_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['AZURE_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['AZURE_CLIENT_SECRET'] || '',
      authorizationUrl: `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize`,
      tokenUrl: `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`,
      redirectUri,
      scopes: [
        'https://graph.microsoft.com/Team.ReadBasic.All',
        'https://graph.microsoft.com/Channel.ReadBasic.All',
        'https://graph.microsoft.com/ChannelMessage.Read.All',
        'https://graph.microsoft.com/User.Read',
        'https://graph.microsoft.com/Chat.Read',
        'offline_access',
      ],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Microsoft Teams - teams, channels, messages, meetings, users',
      vertical: 'enterprise',
      category: 'messaging',
      provider: 'Microsoft',
      region: 'Global',
      dataTypes: ['teams', 'channels', 'messages', 'meetings', 'users', 'chats', 'files'],
      updateFrequency: 'Real-time via Graph API',
      documentationUrl: 'https://learn.microsoft.com/en-us/graph/teams-concept-overview',
      apiVersion: 'v1.0',
      requiredCredentials: ['clientId', 'clientSecret', 'tenantId', 'redirectUri'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'FedRAMP'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Microsoft Graph API with OAuth2 and delegated permissions',
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
        this.log('info', 'Connected to Microsoft Teams');
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
      const user = await this.getCurrentUser();
      return !!user.id;
    } catch {
      return false;
    }
  }

  /**
   * List teams the user is a member of
   */
  async listTeams(): Promise<TeamsTeam[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const result = await this.oauth.authenticatedRequest<{ value: TeamsTeam[] }>(
      `${this.baseApiUrl}/me/joinedTeams`
    );
    return result.value;
  }

  /**
   * Get team by ID
   */
  async getTeam(teamId: string): Promise<TeamsTeam> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest<TeamsTeam>(`${this.baseApiUrl}/teams/${teamId}`);
  }

  /**
   * List channels in a team
   */
  async listChannels(teamId: string): Promise<TeamsChannel[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const result = await this.oauth.authenticatedRequest<{ value: TeamsChannel[] }>(
      `${this.baseApiUrl}/teams/${teamId}/channels`
    );
    return result.value;
  }

  /**
   * Get channel messages
   */
  async getChannelMessages(teamId: string, channelId: string, options?: {
    top?: number;
  }): Promise<TeamsMessage[]> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const params = new URLSearchParams();
    if (options?.top) params.set('$top', String(options.top));

    const url = `${this.baseApiUrl}/teams/${teamId}/channels/${channelId}/messages${params.toString() ? `?${params.toString()}` : ''}`;
    const result = await this.oauth.authenticatedRequest<{ value: TeamsMessage[] }>(url);
    return result.value;
  }

  /**
   * Send message to channel
   */
  async sendChannelMessage(teamId: string, channelId: string, content: string): Promise<TeamsMessage> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest<TeamsMessage>(
      `${this.baseApiUrl}/teams/${teamId}/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: { content, contentType: 'html' },
        }),
      }
    );
  }

  /**
   * List team members
   */
  async listTeamMembers(teamId: string): Promise<Array<{ id: string; displayName: string; roles: string[] }>> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const result = await this.oauth.authenticatedRequest<{ value: Array<{ id: string; displayName: string; roles: string[] }> }>(
      `${this.baseApiUrl}/teams/${teamId}/members`
    );
    return result.value;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<TeamsUser> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    return this.oauth.authenticatedRequest<TeamsUser>(`${this.baseApiUrl}/me`);
  }

  /**
   * List user's chats
   */
  async listChats(): Promise<Array<{ id: string; topic: string | null; chatType: string }>> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const result = await this.oauth.authenticatedRequest<{ value: Array<{ id: string; topic: string | null; chatType: string }> }>(
      `${this.baseApiUrl}/me/chats`
    );
    return result.value;
  }

  async fetchData(params?: { teamId?: string; channelId?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.teamId && params?.channelId) {
        records = await this.getChannelMessages(params.teamId, params.channelId);
      } else if (params?.teamId) {
        records = await this.listChannels(params.teamId);
      } else {
        records = await this.listTeams();
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

export default MicrosoftTeamsConnector;
