// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * OAUTH2 SERVICE - Enterprise OAuth2 Flow Handler
 * =============================================================================
 * Real OAuth2 implementation for enterprise connectors
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scopes: string[];
  state?: string;
  pkce?: boolean;
}

export interface OAuth2Token {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
  scope?: string;
}

export interface OAuth2TokenStorage {
  get(connectorId: string): Promise<OAuth2Token | null>;
  set(connectorId: string, token: OAuth2Token): Promise<void>;
  delete(connectorId: string): Promise<void>;
}

// In-memory token storage (production should use encrypted DB or vault)
class InMemoryTokenStorage implements OAuth2TokenStorage {
  private tokens = new Map<string, OAuth2Token>();

  async get(connectorId: string): Promise<OAuth2Token | null> {
    return this.tokens.get(connectorId) || null;
  }

  async set(connectorId: string, token: OAuth2Token): Promise<void> {
    this.tokens.set(connectorId, token);
  }

  async delete(connectorId: string): Promise<void> {
    this.tokens.delete(connectorId);
  }
}

export class OAuth2Service {
  private config: OAuth2Config;
  private connectorId: string;
  private storage: OAuth2TokenStorage;
  private codeVerifier?: string;

  constructor(connectorId: string, config: OAuth2Config, storage?: OAuth2TokenStorage) {
    this.connectorId = connectorId;
    this.config = config;
    this.storage = storage || new InMemoryTokenStorage();
  }

  /**
   * Generate authorization URL for OAuth2 flow
   */
  getAuthorizationUrl(): { url: string; state: string; codeVerifier?: string } {
    const state = this.config.state || crypto.randomBytes(32).toString('hex');
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state,
    });

    // PKCE support for enhanced security
    if (this.config.pkce) {
      this.codeVerifier = crypto.randomBytes(32).toString('base64url');
      const codeChallenge = crypto
        .createHash('sha256')
        .update(this.codeVerifier)
        .digest('base64url');
      params.set('code_challenge', codeChallenge);
      params.set('code_challenge_method', 'S256');
    }

    return {
      url: `${this.config.authorizationUrl}?${params.toString()}`,
      state,
      codeVerifier: this.codeVerifier,
    };
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, codeVerifier?: string): Promise<OAuth2Token> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    if (codeVerifier || this.codeVerifier) {
      params.set('code_verifier', codeVerifier || this.codeVerifier!);
    }

    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(`[OAuth2] Token exchange failed for ${this.connectorId}`, { error });
      throw new Error(`OAuth2 token exchange failed: ${error}`);
    }

    const data: any = await response.json();
    const token: OAuth2Token = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in || 3600,
      expiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000),
      scope: data.scope,
    };

    await this.storage.set(this.connectorId, token);
    logger.info(`[OAuth2] Token obtained for ${this.connectorId}`);
    return token;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<OAuth2Token> {
    const currentToken = await this.storage.get(this.connectorId);
    if (!currentToken?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: currentToken.refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(`[OAuth2] Token refresh failed for ${this.connectorId}`, { error });
      throw new Error(`OAuth2 token refresh failed: ${error}`);
    }

    const data: any = await response.json();
    const token: OAuth2Token = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || currentToken.refreshToken,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in || 3600,
      expiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000),
      scope: data.scope,
    };

    await this.storage.set(this.connectorId, token);
    logger.info(`[OAuth2] Token refreshed for ${this.connectorId}`);
    return token;
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidToken(): Promise<string> {
    const token = await this.storage.get(this.connectorId);
    if (!token) {
      throw new Error('No token available - authorization required');
    }

    // Refresh if expiring within 5 minutes
    if (token.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
      if (token.refreshToken) {
        const newToken = await this.refreshToken();
        return newToken.accessToken;
      }
      throw new Error('Token expired and no refresh token available');
    }

    return token.accessToken;
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = await this.getValidToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      // Try refresh and retry once
      try {
        await this.refreshToken();
        const newToken = await this.getValidToken();
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
            Accept: 'application/json',
          },
        });
        if (!retryResponse.ok) {
          throw new Error(`API request failed: ${retryResponse.status}`);
        }
        return retryResponse.json() as Promise<T>;
      } catch {
        throw new Error('Authentication failed - re-authorization required');
      }
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status} - ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Revoke tokens
   */
  async revokeToken(): Promise<void> {
    await this.storage.delete(this.connectorId);
    logger.info(`[OAuth2] Token revoked for ${this.connectorId}`);
  }

  /**
   * Check if connector is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get(this.connectorId);
    return token !== null && token.expiresAt.getTime() > Date.now();
  }
}

export default OAuth2Service;
