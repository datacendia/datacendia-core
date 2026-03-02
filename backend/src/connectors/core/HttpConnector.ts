// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * HTTP CONNECTOR - Enterprise REST/HTTP API Client
 * =============================================================================
 * Production-grade HTTP connector with OAuth2, rate limiting, retry logic,
 * circuit breaker pattern, and comprehensive error handling.
 */

import { BaseConnector, ConnectorConfig, ConnectorMetadata, ConnectorStatus, AuthType } from '../BaseConnector.js';
import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export interface HttpConnectorConfig extends ConnectorConfig {
  baseUrl: string;
  authType: AuthType;
  credentials?: {
    apiKey?: string;
    apiKeyHeader?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    tokenUrl?: string;
    scope?: string;
    certificate?: string;
    privateKey?: string;
    userAgent?: string;
  };
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeoutMs: number;
  };
}

interface TokenCache {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
}

// =============================================================================
// HTTP CONNECTOR
// =============================================================================

export abstract class HttpConnector extends BaseConnector {
  protected httpConfig: HttpConnectorConfig;
  protected tokenCache?: TokenCache;
  protected circuitBreaker: CircuitBreakerState = {
    failures: 0,
    lastFailure: 0,
    state: 'closed',
  };

  constructor(config: HttpConnectorConfig) {
    super(config);
    this.httpConfig = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelayMs: 1000,
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeoutMs: 30000,
      },
      ...config,
    };
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------

  protected async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    const creds = this.httpConfig.credentials || {};

    switch (this.httpConfig.authType) {
      case 'api_key':
        const headerName = creds.apiKeyHeader || 'X-API-Key';
        if (creds.apiKey) {
          headers[headerName] = creds.apiKey;
        }
        break;

      case 'basic':
        if (creds.username && creds.password) {
          const encoded = Buffer.from(`${creds.username}:${creds.password}`).toString('base64');
          headers['Authorization'] = `Basic ${encoded}`;
        }
        break;

      case 'oauth2':
        const token = await this.getOAuth2Token();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        break;

      case 'jwt':
        const jwt = await this.generateJWT();
        if (jwt) {
          headers['Authorization'] = `Bearer ${jwt}`;
        }
        break;

      case 'none':
      default:
        break;
    }

    // Add user agent if specified
    if (creds.userAgent) {
      headers['User-Agent'] = creds.userAgent;
    }

    return headers;
  }

  protected async getOAuth2Token(): Promise<string | null> {
    const creds = this.httpConfig.credentials;
    if (!creds?.clientId || !creds?.clientSecret || !creds?.tokenUrl) {
      throw new Error('OAuth2 requires clientId, clientSecret, and tokenUrl');
    }

    // Check cache
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now() + 60000) {
      return this.tokenCache.accessToken;
    }

    // Request new token
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
    });

    if (creds.scope) {
      params.append('scope', creds.scope);
    }

    const response = await fetch(creds.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`OAuth2 token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number; refresh_token?: string };

    this.tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
      refreshToken: data.refresh_token,
    };

    return this.tokenCache.accessToken;
  }

  protected async generateJWT(): Promise<string | null> {
    const creds = this.httpConfig.credentials;
    if (!creds?.clientId || !creds?.privateKey) {
      throw new Error('JWT auth requires clientId and privateKey');
    }

    // Create JWT header and payload
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: creds.clientId,
      sub: creds.clientId,
      aud: this.httpConfig.baseUrl,
      iat: now,
      exp: now + 300, // 5 minutes
      jti: crypto.randomUUID(),
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const unsigned = `${headerB64}.${payloadB64}`;

    // Sign with private key
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(unsigned);
    const signature = sign.sign(creds.privateKey, 'base64url');

    return `${unsigned}.${signature}`;
  }

  // ---------------------------------------------------------------------------
  // HTTP REQUEST HANDLING
  // ---------------------------------------------------------------------------

  protected async request<T>(
    method: string,
    path: string,
    options: {
      params?: Record<string, string | number | boolean>;
      body?: unknown;
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    // Check circuit breaker
    if (this.circuitBreaker.state === 'open') {
      const elapsed = Date.now() - this.circuitBreaker.lastFailure;
      const resetTimeout = this.httpConfig.circuitBreaker?.resetTimeoutMs || 30000;

      if (elapsed > resetTimeout) {
        this.circuitBreaker.state = 'half-open';
        this.log('info', 'Circuit breaker entering half-open state');
      } else {
        throw new Error('Circuit breaker is open - too many failures');
      }
    }

    // Check rate limit
    if (!(await this.checkRateLimit())) {
      throw new Error('Rate limit exceeded');
    }

    // Build URL
    let url = `${this.httpConfig.baseUrl}${path}`;
    if (options.params) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      }
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Build headers
    const authHeaders = await this.getAuthHeaders();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...this.httpConfig.headers,
      ...authHeaders,
      ...options.headers,
    };

    if (options.body && typeof options.body === 'object') {
      headers['Content-Type'] = 'application/json';
    }

    // Execute with retry
    const maxAttempts = this.httpConfig.retryAttempts || 3;
    const retryDelay = this.httpConfig.retryDelayMs || 1000;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = options.timeout || this.httpConfig.timeout || 30000;
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}: ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`);
        }

        // Success - reset circuit breaker
        if (this.circuitBreaker.state === 'half-open') {
          this.circuitBreaker.state = 'closed';
          this.circuitBreaker.failures = 0;
          this.log('info', 'Circuit breaker closed after successful request');
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json() as T;
        } else {
          return await response.text() as unknown as T;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Handle circuit breaker
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailure = Date.now();

        const threshold = this.httpConfig.circuitBreaker?.failureThreshold || 5;
        if (this.circuitBreaker.failures >= threshold) {
          this.circuitBreaker.state = 'open';
          this.log('warn', `Circuit breaker opened after ${this.circuitBreaker.failures} failures`);
        }

        // Retry on transient errors
        const isRetryable = this.isRetryableError(lastError);
        if (isRetryable && attempt < maxAttempts) {
          const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          this.log('warn', `Request failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms: ${lastError.message}`);
          await this.sleep(delay);
          continue;
        }

        throw lastError;
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  protected isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused') ||
      message.includes('network') ||
      message.includes('http 429') ||
      message.includes('http 500') ||
      message.includes('http 502') ||
      message.includes('http 503') ||
      message.includes('http 504')
    );
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------------------------------------------------------------------------
  // BASE CONNECTOR IMPLEMENTATION
  // ---------------------------------------------------------------------------

  async connect(): Promise<void> {
    this.status = 'connecting';
    this.emit('status', this.status);

    try {
      const success = await this.testConnection();
      if (!success) {
        throw new Error('Connection test failed');
      }
      this.status = 'connected';
      this.emit('status', this.status);
      this.log('info', 'Connected successfully');
    } catch (error) {
      this.status = 'error';
      this.lastError = error instanceof Error ? error : new Error(String(error));
      this.emit('status', this.status);
      this.emit('error', this.lastError);
      throw this.lastError;
    }
  }

  async disconnect(): Promise<void> {
    this.tokenCache = undefined;
    this.status = 'disconnected';
    this.emit('status', this.status);
    this.log('info', 'Disconnected');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.performHealthCheck();
      return true;
    } catch (error) {
      this.log('warn', `Connection test failed: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  }

  protected abstract performHealthCheck(): Promise<void>;
}
