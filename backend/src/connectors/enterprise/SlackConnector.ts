// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SLACK CONNECTOR - Enterprise Messaging Integration
 * =============================================================================
 * Real Slack Web API integration with OAuth2
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, DataIngestionResult } from '../BaseConnector.js';
import { OAuth2Service, OAuth2Config } from '../core/OAuth2Service.js';

export interface SlackConfig extends ConnectorConfig {
  botToken?: string;
  userToken?: string;
}

export interface SlackMessage {
  type: string;
  user?: string;
  text: string;
  ts: string;
  channel?: string;
  thread_ts?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_private: boolean;
  created: number;
  creator: string;
  num_members?: number;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name?: string;
  profile: {
    email?: string;
    display_name?: string;
    image_72?: string;
  };
}

export class SlackConnector extends BaseConnector {
  private oauth: OAuth2Service;
  private botToken?: string;
  private baseApiUrl = 'https://slack.com/api';

  constructor(config: SlackConfig) {
    super({
      ...config,
      id: config.id || 'slack',
      name: config.name || 'Slack',
      description: 'Slack messaging platform integration',
      vertical: 'enterprise',
      category: 'messaging',
      baseUrl: 'https://slack.com',
      authType: 'oauth2',
    });

    this.botToken = config.botToken || process.env['SLACK_BOT_TOKEN'];

    const redirectUri = config.credentials?.['redirectUri'] || process.env['SLACK_REDIRECT_URI'] || '';
    const oauthConfig: OAuth2Config = {
      clientId: config.credentials?.['clientId'] || process.env['SLACK_CLIENT_ID'] || '',
      clientSecret: config.credentials?.['clientSecret'] || process.env['SLACK_CLIENT_SECRET'] || '',
      authorizationUrl: 'https://slack.com/oauth/v2/authorize',
      tokenUrl: 'https://slack.com/api/oauth.v2.access',
      redirectUri,
      scopes: [
        'channels:read',
        'channels:history',
        'users:read',
        'users:read.email',
        'chat:write',
        'files:read',
        'reactions:read',
      ],
    };

    this.oauth = new OAuth2Service(this.config.id, oauthConfig);
  }

  getMetadata(): ConnectorMetadata {
    return {
      id: 'slack',
      name: 'Slack',
      description: 'Slack messaging - channels, messages, users, files, reactions',
      vertical: 'enterprise',
      category: 'messaging',
      provider: 'Slack Technologies (Salesforce)',
      region: 'Global',
      dataTypes: ['channels', 'messages', 'users', 'files', 'reactions', 'threads'],
      updateFrequency: 'Real-time via Events API or polling',
      documentationUrl: 'https://api.slack.com/docs',
      apiVersion: 'Web API',
      requiredCredentials: ['clientId', 'clientSecret', 'redirectUri'],
      optionalCredentials: ['botToken', 'signingSecret'],
      complianceFrameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'],
      compatibilityLabel: 'native_protocol',
      integrationNotes: 'Full Web API support with OAuth2 and Events API',
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
      if (this.botToken) {
        // Use bot token directly
        const testResult = await this.apiCall('auth.test');
        if (testResult.ok) {
          this.status = 'connected';
          this.log('info', `Connected to Slack as ${testResult.user}`);
          return;
        }
      }

      const isAuth = await this.oauth.isAuthenticated();
      if (isAuth) {
        this.status = 'connected';
        this.log('info', 'Connected to Slack via OAuth');
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
      const result = await this.apiCall('auth.test');
      return result.ok === true;
    } catch {
      return false;
    }
  }

  private async apiCall<T = any>(method: string, params?: Record<string, any>): Promise<T> {
    if (!await this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    const url = `${this.baseApiUrl}/${method}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (this.botToken) {
      headers['Authorization'] = `Bearer ${this.botToken}`;
    } else {
      const token = await this.oauth.getValidToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
    };
    if (params) {
      fetchOptions.body = JSON.stringify(params);
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json() as { ok: boolean; error?: string } & T;
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error || 'Unknown error'}`);
    }
    return data as T;
  }

  /**
   * List channels
   */
  async listChannels(options?: { 
    types?: string; 
    limit?: number;
    cursor?: string;
  }): Promise<{ channels: SlackChannel[]; cursor?: string }> {
    const result = await this.apiCall('conversations.list', {
      types: options?.types || 'public_channel,private_channel',
      limit: options?.limit || 100,
      cursor: options?.cursor,
    });
    return { channels: result.channels, cursor: result.response_metadata?.next_cursor };
  }

  /**
   * Get channel history
   */
  async getChannelHistory(channelId: string, options?: {
    limit?: number;
    oldest?: string;
    latest?: string;
    cursor?: string;
  }): Promise<{ messages: SlackMessage[]; cursor?: string }> {
    const result = await this.apiCall('conversations.history', {
      channel: channelId,
      limit: options?.limit || 100,
      oldest: options?.oldest,
      latest: options?.latest,
      cursor: options?.cursor,
    });
    return { messages: result.messages, cursor: result.response_metadata?.next_cursor };
  }

  /**
   * Send message
   */
  async sendMessage(channelId: string, text: string, options?: {
    thread_ts?: string;
    blocks?: any[];
    attachments?: any[];
  }): Promise<SlackMessage> {
    const result = await this.apiCall('chat.postMessage', {
      channel: channelId,
      text,
      thread_ts: options?.thread_ts,
      blocks: options?.blocks,
      attachments: options?.attachments,
    });
    return result.message;
  }

  /**
   * List users
   */
  async listUsers(options?: { limit?: number; cursor?: string }): Promise<{ users: SlackUser[]; cursor?: string }> {
    const result = await this.apiCall('users.list', {
      limit: options?.limit || 100,
      cursor: options?.cursor,
    });
    return { users: result.members, cursor: result.response_metadata?.next_cursor };
  }

  /**
   * Get user info
   */
  async getUserInfo(userId: string): Promise<SlackUser> {
    const result = await this.apiCall('users.info', { user: userId });
    return result.user;
  }

  /**
   * Search messages
   */
  async searchMessages(query: string, options?: { 
    count?: number; 
    page?: number;
    sort?: 'score' | 'timestamp';
  }): Promise<{ messages: { matches: SlackMessage[] }; total: number }> {
    const result = await this.apiCall('search.messages', {
      query,
      count: options?.count || 20,
      page: options?.page || 1,
      sort: options?.sort || 'timestamp',
    });
    return { messages: result.messages, total: result.messages.total };
  }

  async fetchData(params?: { channelId?: string; query?: string }): Promise<DataIngestionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let records: any[] = [];

    try {
      if (params?.channelId) {
        const result = await this.getChannelHistory(params.channelId);
        records = result.messages;
      } else if (params?.query) {
        const result = await this.searchMessages(params.query);
        records = result.messages.matches;
      } else {
        const result = await this.listChannels();
        records = result.channels;
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

export default SlackConnector;
