/**
 * Data Adapter — Webhook Ingest Adapter
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports WebhookIngestAdapter, WebhookConfig, WebhookEvent, ProcessedWebhook
 * @module adapters/sovereign/WebhookIngestAdapter
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * UNIVERSAL WEBHOOK INGEST ADAPTER
 * =============================================================================
 * For SaaS, Financial, and any system that can push events.
 * 
 * Use Case: "Configure your MuleSoft/SWIFT gateway to push events to us.
 * We don't touch your banking wire; we just catch the receipt."
 * 
 * Features:
 * - Secured REST endpoint for push events
 * - HMAC signature verification
 * - Idempotency key handling
 * - Dead-letter queue for failed processing
 * - Rate limiting per source
 * - Schema validation
 */

import { Readable } from 'stream';
import crypto from 'crypto';
import { Request, Response, NextFunction, Router } from 'express';
import {
  SovereignAdapter,
  AdapterConfig,
  IngestRecord,
  RiskTier,
  DataClassification,
  adapterRegistry,
} from './SovereignAdapter.js';

// =============================================================================
// TYPES
// =============================================================================

export interface WebhookConfig extends AdapterConfig {
  // Authentication
  hmacSecret?: string;
  hmacHeader?: string;           // Default: X-Signature-256
  hmacAlgorithm?: string;        // Default: sha256
  apiKeys?: string[];            // Allowed API keys
  apiKeyHeader?: string;         // Default: X-API-Key
  
  // Idempotency
  idempotencyHeader?: string;    // Default: X-Idempotency-Key
  idempotencyTTLSeconds?: number;
  
  // Rate limiting
  rateLimitPerMinute?: number;
  rateLimitPerSource?: boolean;
  
  // Validation
  requiredHeaders?: string[];
  schema?: unknown;              // JSON Schema for validation
  
  // Dead letter
  enableDeadLetter?: boolean;
  maxRetries?: number;
}

export interface WebhookEvent {
  id: string;
  sourceId: string;
  timestamp: Date;
  headers: Record<string, string>;
  body: unknown;
  signature?: string;
  idempotencyKey?: string;
}

export interface ProcessedWebhook {
  event: WebhookEvent;
  record: IngestRecord;
  processingTimeMs: number;
}

// =============================================================================
// WEBHOOK INGEST ADAPTER
// =============================================================================

export class WebhookIngestAdapter extends SovereignAdapter {
  private webhookConfig: WebhookConfig;
  private router: Router;
  private idempotencyCache = new Map<string, { timestamp: number; recordId: string }>();
  private rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
  private deadLetterQueue: WebhookEvent[] = [];

  constructor(config: WebhookConfig) {
    super(config);
    this.webhookConfig = {
      hmacHeader: 'x-signature-256',
      hmacAlgorithm: 'sha256',
      apiKeyHeader: 'x-api-key',
      idempotencyHeader: 'x-idempotency-key',
      idempotencyTTLSeconds: 86400, // 24 hours
      rateLimitPerMinute: 1000,
      rateLimitPerSource: true,
      maxRetries: 3,
      enableDeadLetter: true,
      ...config,
    };

    this.router = Router();
    this.setupRoutes();
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------------

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Start idempotency cache cleanup
    this.startCacheCleanup();

    this.isRunning = true;
    this.log('info', 'Webhook ingest adapter started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.log('info', 'Webhook ingest adapter stopped');
  }

  // ---------------------------------------------------------------------------
  // EXPRESS ROUTER
  // ---------------------------------------------------------------------------

  getRouter(): Router {
    return this.router;
  }

  private setupRoutes(): void {
    // Main webhook endpoint
    this.router.post(
      '/ingest/:sourceId',
      this.authenticate.bind(this),
      this.rateLimit.bind(this),
      this.handleWebhook.bind(this)
    );

    // Health check
    this.router.get('/health', (req, res) => {
      res.json(this.health);
    });

    // Dead letter queue management
    this.router.get('/dead-letter', this.requireAdmin.bind(this), (req, res) => {
      res.json({
        count: this.deadLetterQueue.length,
        events: this.deadLetterQueue.slice(0, 100),
      });
    });

    this.router.post('/dead-letter/retry', this.requireAdmin.bind(this), async (req, res) => {
      const results = await this.retryDeadLetterQueue();
      res.json(results);
    });

    this.router.delete('/dead-letter', this.requireAdmin.bind(this), (req, res) => {
      const count = this.deadLetterQueue.length;
      this.deadLetterQueue = [];
      res.json({ cleared: count });
    });
  }

  // ---------------------------------------------------------------------------
  // MIDDLEWARE
  // ---------------------------------------------------------------------------

  private async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Check API key
    if (this.webhookConfig.apiKeys && this.webhookConfig.apiKeys.length > 0) {
      const apiKey = req.headers[this.webhookConfig.apiKeyHeader!.toLowerCase()] as string;
      if (!apiKey || !this.webhookConfig.apiKeys.includes(apiKey)) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }
    }

    // Verify HMAC signature
    if (this.webhookConfig.hmacSecret) {
      const signature = req.headers[this.webhookConfig.hmacHeader!.toLowerCase()] as string;
      if (!signature) {
        res.status(401).json({ error: 'Missing signature' });
        return;
      }

      const payload = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac(this.webhookConfig.hmacAlgorithm!, this.webhookConfig.hmacSecret)
        .update(payload)
        .digest('hex');

      const signatureValue = signature.replace(/^sha256=/, '');
      if (!crypto.timingSafeEqual(Buffer.from(signatureValue), Buffer.from(expectedSignature))) {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }
    }

    // Check required headers
    if (this.webhookConfig.requiredHeaders) {
      for (const header of this.webhookConfig.requiredHeaders) {
        if (!req.headers[header.toLowerCase()]) {
          res.status(400).json({ error: `Missing required header: ${header}` });
          return;
        }
      }
    }

    next();
  }

  private async rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    const sourceId = req.params.sourceId;
    const key = this.webhookConfig.rateLimitPerSource ? sourceId : 'global';
    const now = Date.now();
    const windowMs = 60000; // 1 minute

    let bucket = this.rateLimitBuckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.rateLimitBuckets.set(key, bucket);
    }

    bucket.count++;

    if (bucket.count > (this.webhookConfig.rateLimitPerMinute || 1000)) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      });
      return;
    }

    next();
  }

  private requireAdmin(req: Request, res: Response, next: NextFunction): void {
    // Production upgrade: integrate with auth system
    const adminKey = req.headers['x-admin-key'] as string;
    if (!adminKey) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  }

  // ---------------------------------------------------------------------------
  // WEBHOOK HANDLING
  // ---------------------------------------------------------------------------

  private async handleWebhook(req: Request, res: Response): Promise<void> {
    const sourceId = req.params.sourceId;
    const startTime = Date.now();

    try {
      // Check idempotency
      const idempotencyKey = req.headers[this.webhookConfig.idempotencyHeader!.toLowerCase()] as string;
      if (idempotencyKey) {
        const cached = this.idempotencyCache.get(idempotencyKey);
        if (cached) {
          res.status(200).json({
            status: 'duplicate',
            recordId: cached.recordId,
            message: 'Event already processed',
          });
          return;
        }
      }

      // Create webhook event
      const event: WebhookEvent = {
        id: crypto.randomUUID(),
        sourceId,
        timestamp: new Date(),
        headers: req.headers as Record<string, string>,
        body: req.body,
        signature: req.headers[this.webhookConfig.hmacHeader!.toLowerCase()] as string,
        idempotencyKey,
      };

      // Validate schema if configured
      if (this.webhookConfig.schema) {
        const validation = await this.validate(event.body);
        if (!validation.valid) {
          res.status(400).json({
            error: 'Schema validation failed',
            details: validation.errors,
          });
          return;
        }
      }

      // Process the webhook
      const content = Buffer.from(JSON.stringify(event.body));
      const stream = Readable.from(content);
      const record = await this.ingest(stream, sourceId, {
        webhookId: event.id,
        headers: event.headers,
        idempotencyKey,
      });

      // Cache idempotency key
      if (idempotencyKey) {
        this.idempotencyCache.set(idempotencyKey, {
          timestamp: Date.now(),
          recordId: record.id,
        });
      }

      const processingTimeMs = Date.now() - startTime;

      // Emit processed event
      this.emit('webhook:processed', {
        event,
        record,
        processingTimeMs,
      } as ProcessedWebhook);

      res.status(200).json({
        status: 'accepted',
        recordId: record.id,
        processingTimeMs,
      });

    } catch (error) {
      const event: WebhookEvent = {
        id: crypto.randomUUID(),
        sourceId,
        timestamp: new Date(),
        headers: req.headers as Record<string, string>,
        body: req.body,
      };

      // Add to dead letter queue
      if (this.webhookConfig.enableDeadLetter) {
        this.deadLetterQueue.push(event);
        this.emit('webhook:dead-letter', event);
      }

      this.log('error', `Webhook processing failed: ${(error as Error).message}`, {
        sourceId,
        eventId: event.id,
      });

      res.status(500).json({
        status: 'error',
        error: (error as Error).message,
        eventId: event.id,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // DEAD LETTER QUEUE
  // ---------------------------------------------------------------------------

  private async retryDeadLetterQueue(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    const toRetry = [...this.deadLetterQueue];
    this.deadLetterQueue = [];

    for (const event of toRetry) {
      try {
        const content = Buffer.from(JSON.stringify(event.body));
        const stream = Readable.from(content);
        await this.ingest(stream, event.sourceId, {
          webhookId: event.id,
          retried: true,
        });
        success++;
      } catch {
        failed++;
        this.deadLetterQueue.push(event);
      }
    }

    return { success, failed };
  }

  // ---------------------------------------------------------------------------
  // CACHE CLEANUP
  // ---------------------------------------------------------------------------

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const ttl = (this.webhookConfig.idempotencyTTLSeconds || 86400) * 1000;

      for (const [key, value] of this.idempotencyCache) {
        if (now - value.timestamp > ttl) {
          this.idempotencyCache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  // ---------------------------------------------------------------------------
  // INGEST IMPLEMENTATION
  // ---------------------------------------------------------------------------

  async ingest(stream: Readable, sourceId: string, metadata?: Record<string, unknown>): Promise<IngestRecord> {
    if (!this.checkQuota()) {
      throw new Error('Quota exceeded');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks);

    // Create ingest record
    const record = this.createIngestRecord(sourceId, content, metadata);

    // Update metrics
    this.consumeQuota(1, 0);
    this.metrics.bytesIngested += content.length;
    this.health.messagesProcessed++;
    this.health.bytesProcessed += content.length;

    // Emit for downstream processing
    this.emit('data', {
      record,
      data: JSON.parse(content.toString()),
    });

    return record;
  }

  async validate(data: unknown): Promise<{ valid: boolean; errors?: string[] }> {
    // Implement JSON Schema validation here
    // Production upgrade: use ajv schema validation
    if (data === null || data === undefined) {
      return { valid: false, errors: ['Data is null or undefined'] };
    }
    return { valid: true };
  }

  // ---------------------------------------------------------------------------
  // UTILITY METHODS
  // ---------------------------------------------------------------------------

  /**
   * Generate a webhook URL for a source
   */
  getWebhookUrl(sourceId: string, baseUrl: string): string {
    return `${baseUrl}/api/v1/adapters/webhook/ingest/${sourceId}`;
  }

  /**
   * Generate an API key for a new source
   */
  generateApiKey(): string {
    return `dcw_${crypto.randomBytes(24).toString('base64url')}`;
  }

  /**
   * Get dead letter queue size
   */
  getDeadLetterCount(): number {
    return this.deadLetterQueue.length;
  }
}

// =============================================================================
// REGISTER ADAPTER
// =============================================================================

adapterRegistry.register({
  type: 'webhook',
  factory: (config) => new WebhookIngestAdapter(config as WebhookConfig),
  description: 'Universal Webhook Ingest for SaaS, financial gateways, and push-based integrations',
  defaultRiskTier: RiskTier.ENTERPRISE,
  defaultCapabilities: {
    transportTypes: ['http'],
    supportsStreaming: false,
    supportsBatch: false,
    supportsWriteBack: false,
    cachingAllowed: true,
    defaultDataClass: DataClassification.CONFIDENTIAL,
    requiresBYOKeys: true,
    exportControlled: false,
  },
});
