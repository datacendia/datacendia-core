// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - BASE CONNECTOR
// Enterprise-grade integration connector foundation
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../services/BaseService';
import { eventBus } from '../events/EventBus';
import { getErrorMessage, ensureError } from '../../utils/errors.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ConnectorConfig extends ServiceConfig {
  /** Connection endpoint URL */
  endpoint?: string;
  
  /** API Key or token */
  apiKey?: string;
  
  /** OAuth credentials */
  oauth?: {
    clientId: string;
    clientSecret: string;
    tokenUrl: string;
    scopes?: string[];
  };
  
  /** Connection timeout in ms */
  timeout?: number;
  
  /** Retry configuration */
  retry?: {
    maxRetries: number;
    backoffMs: number;
    maxBackoffMs: number;
  };
  
  /** Rate limiting */
  rateLimit?: {
    requestsPerSecond: number;
    burstLimit: number;
  };
  
  /** Enable request/response logging */
  debug?: boolean;
}

export interface ConnectorCredentials {
  type: 'api_key' | 'oauth' | 'basic' | 'bearer' | 'custom';
  apiKey?: string;
  token?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  username?: string;
  password?: string;
  custom?: Record<string, any>;
}

export interface ConnectionStatus {
  connected: boolean;
  lastConnectedAt?: Date;
  lastError?: string;
  latency?: number;
  version?: string;
  capabilities?: string[];
}

export interface SyncOptions {
  fullSync?: boolean;
  since?: Date;
  entities?: string[];
  batchSize?: number;
}

export interface SyncResult {
  success: boolean;
  entitiesSynced: number;
  errors: Array<{ entity: string; error: string }>;
  duration: number;
  nextSyncToken?: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
}

// =============================================================================
// RATE LIMITER
// =============================================================================

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per ms

  constructor(requestsPerSecond: number, burstLimit: number) {
    this.maxTokens = burstLimit;
    this.tokens = burstLimit;
    this.refillRate = requestsPerSecond / 1000;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Wait for token
    const waitTime = (1 - this.tokens) / this.refillRate;
    await this.sleep(waitTime);
    this.refill();
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// =============================================================================
// BASE CONNECTOR
// =============================================================================

export abstract class BaseConnector extends BaseService {
  protected credentials: ConnectorCredentials | null = null;
  protected connectionStatus: ConnectionStatus = { connected: false };
  protected rateLimiter: RateLimiter | null = null;
  protected retryConfig: { maxRetries: number; backoffMs: number; maxBackoffMs: number };

  constructor(config: ConnectorConfig) {
    super(config);
    
    this.retryConfig = config.retry || {
      maxRetries: 3,
      backoffMs: 1000,
      maxBackoffMs: 30000,
    };

    if (config.rateLimit) {
      this.rateLimiter = new RateLimiter(
        config.rateLimit.requestsPerSecond,
        config.rateLimit.burstLimit
      );
    }
  }

  // ---------------------------------------------------------------------------
  // ABSTRACT METHODS (Must be implemented by connectors)
  // ---------------------------------------------------------------------------

  /**
   * Connect to the external service
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the external service
   */
  abstract disconnect(): Promise<void>;

  /**
   * Test the connection
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Get connector metadata/capabilities
   */
  abstract getCapabilities(): string[];

  /**
   * Sync data from the external service
   */
  abstract sync(options: SyncOptions): Promise<SyncResult>;

  // ---------------------------------------------------------------------------
  // LIFECYCLE IMPLEMENTATION
  // ---------------------------------------------------------------------------

  async initialize(): Promise<void> {
    this.logger.info('Initializing connector...');
    await this.loadCredentials();
    await this.connect();
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down connector...');
    await this.disconnect();
    this.connectionStatus.connected = false;
  }

  async healthCheck(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const connected = await this.testConnection();
      
      return {
        status: connected ? 'healthy' : 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - startTime,
        details: {
          isConnected: connected,
          ...this.connectionStatus,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - startTime,
        errors: [getErrorMessage(error)],
        details: this.connectionStatus,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // CREDENTIAL MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * Set credentials for the connector
   */
  setCredentials(credentials: ConnectorCredentials): void {
    this.credentials = credentials;
  }

  /**
   * Load credentials from secure storage
   */
  protected async loadCredentials(): Promise<void> {
    // Override in subclasses to load from vault, env, etc.
    const config = this.config as ConnectorConfig;
    
    if (config.apiKey) {
      this.credentials = { type: 'api_key', apiKey: config.apiKey };
    } else if (config.oauth) {
      await this.refreshOAuthToken();
    }
  }

  /**
   * Refresh OAuth token
   */
  protected async refreshOAuthToken(): Promise<void> {
    const config = this.config as ConnectorConfig;
    if (!config.oauth) return;

    this.logger.info('Refreshing OAuth token...');

    try {
      const response = await fetch(config.oauth.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.oauth.clientId,
          client_secret: config.oauth.clientSecret,
          scope: config.oauth.scopes?.join(' ') || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`OAuth token refresh failed: ${response.status}`);
      }

      const data = await response.json() as { access_token: string; refresh_token?: string; expires_in: number };
      
      this.credentials = {
        type: 'oauth',
        token: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiry: new Date(Date.now() + data.expires_in * 1000),
      };

      this.logger.info('OAuth token refreshed successfully');
    } catch (error: unknown) {
      this.logger.error('Failed to refresh OAuth token', { error: getErrorMessage(error) });
      throw error;
    }
  }

  /**
   * Check if OAuth token needs refresh
   */
  protected needsTokenRefresh(): boolean {
    if (!this.credentials || this.credentials.type !== 'oauth') {
      return false;
    }
    
    if (!this.credentials.tokenExpiry) {
      return true;
    }

    // Refresh if token expires in less than 5 minutes
    const buffer = 5 * 60 * 1000;
    return this.credentials.tokenExpiry.getTime() - Date.now() < buffer;
  }

  // ---------------------------------------------------------------------------
  // HTTP HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Make an authenticated HTTP request with retry and rate limiting
   */
  protected async request<T>(
    method: string,
    url: string,
    options: {
      body?: any;
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    // Rate limiting
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    // Token refresh if needed
    if (this.needsTokenRefresh()) {
      await this.refreshOAuthToken();
    }

    return this.withRetry(async () => {
      const config = this.config as ConnectorConfig;
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        options.timeout || config.timeout || 30000
      );

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        };

        const response = await fetch(url, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`HTTP ${response.status}: ${error}`);
        }

        return response.json() as Promise<T>;
      } finally {
        clearTimeout(timeout);
      }
    });
  }

  /**
   * Get authentication headers based on credential type
   */
  protected getAuthHeaders(): Record<string, string> {
    if (!this.credentials) {
      return {};
    }

    switch (this.credentials.type) {
      case 'api_key':
        return { 'X-API-Key': this.credentials.apiKey! };
      
      case 'bearer':
      case 'oauth':
        return { 'Authorization': `Bearer ${this.credentials.token}` };
      
      case 'basic':
        const encoded = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString('base64');
        return { 'Authorization': `Basic ${encoded}` };
      
      default:
        return {};
    }
  }

  /**
   * Execute an operation with retry logic
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries?: number
  ): Promise<T> {
    const retries = maxRetries ?? this.retryConfig.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error: unknown) {
        lastError = ensureError(error);
        
        if (attempt < retries) {
          const delay = Math.min(
            this.retryConfig.backoffMs * Math.pow(2, attempt),
            this.retryConfig.maxBackoffMs
          );
          this.logger.warn(`Retry ${attempt + 1}/${retries} after ${delay}ms`, { 
            error: getErrorMessage(error) 
          });
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------------------------------------------------------------------------
  // WEBHOOK HANDLING
  // ---------------------------------------------------------------------------

  /**
   * Register a webhook for real-time updates
   */
  async registerWebhook(config: WebhookConfig): Promise<string> {
    // Override in subclasses
    throw new Error('Webhook registration not implemented');
  }

  /**
   * Unregister a webhook
   */
  async unregisterWebhook(webhookId: string): Promise<void> {
    // Override in subclasses
    throw new Error('Webhook unregistration not implemented');
  }

  /**
   * Handle incoming webhook payload
   */
  async handleWebhook(payload: any, signature?: string): Promise<void> {
    // Override in subclasses
    throw new Error('Webhook handling not implemented');
  }

  // ---------------------------------------------------------------------------
  // STATUS & INFO
  // ---------------------------------------------------------------------------

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionStatus.connected;
  }
}

export default BaseConnector;
