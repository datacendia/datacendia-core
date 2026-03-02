// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - DATA CONNECTOR FRAMEWORK
// Pluggable HTTP-based data connector for vertical integrations
// =============================================================================

import { logger } from './logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'soap' | 'grpc' | 'database' | 'file' | 'webhook';
  baseUrl?: string;
  auth?: ConnectorAuth;
  headers?: Record<string, string>;
  timeout?: number; // ms
  retries?: number;
  retryDelay?: number; // ms
  rateLimit?: { requests: number; windowMs: number };
  tls?: { rejectUnauthorized?: boolean; ca?: string; cert?: string; key?: string };
  metadata?: Record<string, unknown>;
}

export type ConnectorAuth =
  | { type: 'none' }
  | { type: 'apiKey'; key: string; header?: string; prefix?: string }
  | { type: 'bearer'; token: string }
  | { type: 'basic'; username: string; password: string }
  | { type: 'oauth2'; clientId: string; clientSecret: string; tokenUrl: string; scope?: string }
  | { type: 'custom'; handler: (headers: Record<string, string>) => Promise<Record<string, string>> };

export interface ConnectorRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ConnectorResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T | null;
  headers: Record<string, string>;
  latencyMs: number;
  error?: string;
  retryCount: number;
}

export interface ConnectionStatus {
  connected: boolean;
  lastCheck: Date;
  latencyMs: number;
  error?: string;
}

// =============================================================================
// RATE LIMITER
// =============================================================================

class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      const waitTime = this.timestamps[0] + this.windowMs - now;
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      this.timestamps = this.timestamps.filter(t => Date.now() - t < this.windowMs);
    }

    this.timestamps.push(Date.now());
  }
}

// =============================================================================
// OAUTH2 TOKEN CACHE
// =============================================================================

interface OAuth2Token {
  accessToken: string;
  expiresAt: number;
}

const tokenCache = new Map<string, OAuth2Token>();

async function getOAuth2Token(auth: Extract<ConnectorAuth, { type: 'oauth2' }>): Promise<string> {
  const cacheKey = `${auth.clientId}:${auth.tokenUrl}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.accessToken;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: auth.clientId,
    client_secret: auth.clientSecret,
  });
  if (auth.scope) params.set('scope', auth.scope);

  const response = await fetch(auth.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`OAuth2 token request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { access_token: string; expires_in?: number };
  const token: OAuth2Token = {
    accessToken: data.access_token,
    expiresAt: Date.now() + ((data.expires_in || 3600) * 1000),
  };

  tokenCache.set(cacheKey, token);
  return token.accessToken;
}

// =============================================================================
// DATA CONNECTOR
// =============================================================================

export class DataConnector {
  private config: ConnectorConfig;
  private rateLimiter?: RateLimiter;
  private connectionStatus: ConnectionStatus = {
    connected: false,
    lastCheck: new Date(),
    latencyMs: 0,
  };

  constructor(config: ConnectorConfig) {
    this.config = config;
    if (config.rateLimit) {
      this.rateLimiter = new RateLimiter(config.rateLimit.requests, config.rateLimit.windowMs);
    }
  }

  get id(): string { return this.config.id; }
  get name(): string { return this.config.name; }
  get status(): ConnectionStatus { return this.connectionStatus; }

  /**
   * Test connectivity to the data source
   */
  async connect(): Promise<boolean> {
    try {
      const start = performance.now();
      const response = await this.request({ method: 'GET', path: '/', timeout: 5000 });
      this.connectionStatus = {
        connected: response.success || response.status < 500,
        lastCheck: new Date(),
        latencyMs: performance.now() - start,
      };
      return this.connectionStatus.connected;
    } catch (error) {
      this.connectionStatus = {
        connected: false,
        lastCheck: new Date(),
        latencyMs: 0,
        error: error instanceof Error ? error.message : String(error),
      };
      return false;
    }
  }

  /**
   * Disconnect and clean up
   */
  disconnect(): void {
    this.connectionStatus.connected = false;
  }

  /**
   * Make an authenticated HTTP request to the data source
   */
  async request<T = unknown>(req: ConnectorRequest): Promise<ConnectorResponse<T>> {
    const start = performance.now();
    const maxRetries = this.config.retries || 0;
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (this.rateLimiter) {
          await this.rateLimiter.acquire();
        }

        const url = this.buildUrl(req.path, req.query);
        const headers = await this.buildHeaders(req.headers);
        const timeout = req.timeout || this.config.timeout || 30000;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const fetchOptions: RequestInit = {
            method: req.method,
            headers,
            signal: controller.signal,
          };

          if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          }

          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);

          let data: T | null = null;
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json() as T;
          } else if (contentType.includes('text/')) {
            data = await response.text() as unknown as T;
          }

          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => { responseHeaders[key] = value; });

          return {
            success: response.ok,
            status: response.status,
            data,
            headers: responseHeaders,
            latencyMs: performance.now() - start,
            retryCount: attempt,
          };
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        logger.warn(`Connector ${this.config.id} request failed (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError}`);

        if (attempt < maxRetries) {
          const delay = this.config.retryDelay || 1000;
          await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        }
      }
    }

    return {
      success: false,
      status: 0,
      data: null,
      headers: {},
      latencyMs: performance.now() - start,
      error: lastError || 'Request failed after all retries',
      retryCount: maxRetries,
    };
  }

  /**
   * Convenience: GET request
   */
  async get<T = unknown>(path: string, query?: Record<string, string | number | boolean>): Promise<ConnectorResponse<T>> {
    return this.request<T>({ method: 'GET', path, query });
  }

  /**
   * Convenience: POST request
   */
  async post<T = unknown>(path: string, body?: unknown): Promise<ConnectorResponse<T>> {
    return this.request<T>({ method: 'POST', path, body });
  }

  /**
   * Convenience: PUT request
   */
  async put<T = unknown>(path: string, body?: unknown): Promise<ConnectorResponse<T>> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  /**
   * Convenience: DELETE request
   */
  async delete<T = unknown>(path: string): Promise<ConnectorResponse<T>> {
    return this.request<T>({ method: 'DELETE', path });
  }

  // ---------------------------------------------------------------------------
  // INTERNAL
  // ---------------------------------------------------------------------------

  private buildUrl(path: string, query?: Record<string, string | number | boolean>): string {
    const base = this.config.baseUrl || '';
    const url = new URL(path, base || 'http://localhost');

    if (!base) {
      return `http://localhost${path}`;
    }

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }

  private async buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Datacendia-Platform/1.0',
      ...this.config.headers,
      ...extra,
    };

    if (this.config.auth) {
      switch (this.config.auth.type) {
        case 'apiKey': {
          const header = this.config.auth.header || 'X-API-Key';
          const prefix = this.config.auth.prefix || '';
          headers[header] = prefix ? `${prefix} ${this.config.auth.key}` : this.config.auth.key;
          break;
        }
        case 'bearer':
          headers['Authorization'] = `Bearer ${this.config.auth.token}`;
          break;
        case 'basic': {
          const encoded = Buffer.from(`${this.config.auth.username}:${this.config.auth.password}`).toString('base64');
          headers['Authorization'] = `Basic ${encoded}`;
          break;
        }
        case 'oauth2': {
          const token = await getOAuth2Token(this.config.auth);
          headers['Authorization'] = `Bearer ${token}`;
          break;
        }
        case 'custom': {
          const customHeaders = await this.config.auth.handler(headers);
          Object.assign(headers, customHeaders);
          break;
        }
      }
    }

    return headers;
  }
}

// =============================================================================
// CONNECTOR REGISTRY
// =============================================================================

export class ConnectorRegistry {
  private connectors = new Map<string, DataConnector>();

  register(config: ConnectorConfig): DataConnector {
    const connector = new DataConnector(config);
    this.connectors.set(config.id, connector);
    return connector;
  }

  get(id: string): DataConnector | undefined {
    return this.connectors.get(id);
  }

  remove(id: string): boolean {
    const connector = this.connectors.get(id);
    if (connector) {
      connector.disconnect();
      return this.connectors.delete(id);
    }
    return false;
  }

  list(): DataConnector[] {
    return Array.from(this.connectors.values());
  }

  async connectAll(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    for (const [id, connector] of this.connectors) {
      results.set(id, await connector.connect());
    }
    return results;
  }

  disconnectAll(): void {
    for (const connector of this.connectors.values()) {
      connector.disconnect();
    }
  }
}

// =============================================================================
// SINGLETON REGISTRY
// =============================================================================

export const connectorRegistry = new ConnectorRegistry();
