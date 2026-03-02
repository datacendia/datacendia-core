// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - EVENT BUS
// Enterprise-grade event-driven communication system
// =============================================================================

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { getErrorMessage, ensureError } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// TYPES
// =============================================================================

export interface DomainEvent<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  correlationId?: string;
  causationId?: string;
  version: number;
  payload: T;
  metadata?: Record<string, any>;
}

export interface EventHandler<T = any> {
  (event: DomainEvent<T>): Promise<void> | void;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  options: SubscriptionOptions;
  subscribedAt: Date;
}

export interface SubscriptionOptions {
  /** Handler priority (lower = earlier) */
  priority?: number;
  /** Run handler asynchronously */
  async?: boolean;
  /** Filter function to selectively handle events */
  filter?: (event: DomainEvent) => boolean;
  /** Retry configuration */
  retry?: {
    maxRetries: number;
    backoffMs: number;
  };
  /** Dead letter queue for failed events */
  deadLetterQueue?: string;
}

export interface EventBusConfig {
  /** Maximum event history to retain */
  maxHistory?: number;
  /** Enable event logging */
  logEvents?: boolean;
  /** Default retry configuration */
  defaultRetry?: {
    maxRetries: number;
    backoffMs: number;
  };
}

export interface EventStats {
  totalPublished: number;
  totalDelivered: number;
  totalFailed: number;
  eventsByType: Record<string, number>;
  averageDeliveryTime: number;
}

// =============================================================================
// EVENT BUS (Singleton)
// =============================================================================

class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private deadLetterQueue: DomainEvent[] = [];
  private config: EventBusConfig;
  private stats: EventStats;

  private constructor(config: EventBusConfig = {}) {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
    this.config = {
      maxHistory: config.maxHistory ?? 1000,
      logEvents: config.logEvents ?? true,
      defaultRetry: config.defaultRetry ?? { maxRetries: 3, backoffMs: 1000 },
    };
    this.stats = {
      totalPublished: 0,
      totalDelivered: 0,
      totalFailed: 0,
      eventsByType: {},
      averageDeliveryTime: 0,
    };
  }

  static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  // ---------------------------------------------------------------------------
  // EVENT CREATION
  // ---------------------------------------------------------------------------

  /**
   * Create a new domain event
   */
  createEvent<T>(
    type: string,
    source: string,
    payload: T,
    options: {
      correlationId?: string;
      causationId?: string;
      metadata?: Record<string, any>;
    } = {}
  ): DomainEvent<T> {
    return {
      id: uuidv4(),
      type,
      source,
      timestamp: new Date(),
      version: 1,
      payload,
      correlationId: options.correlationId,
      causationId: options.causationId,
      metadata: options.metadata,
    };
  }

  // ---------------------------------------------------------------------------
  // PUBLISHING
  // ---------------------------------------------------------------------------

  /**
   * Publish an event to all subscribers
   */
  async publish<T>(event: DomainEvent<T>): Promise<void> {
    const startTime = Date.now();
    
    if (this.config.logEvents) {
      logger.info(`[EventBus] Publishing: ${event.type}`, { id: event.id, source: event.source });
    }

    this.stats.totalPublished++;
    this.stats.eventsByType[event.type] = (this.stats.eventsByType[event.type] || 0) + 1;

    // Store in history
    this.addToHistory(event);

    // Get sorted subscribers
    const subscriptions = this.getSortedSubscriptions(event.type);
    
    if (subscriptions.length === 0) {
      if (this.config.logEvents) {
        logger.info(`[EventBus] No subscribers for: ${event.type}`);
      }
      return;
    }

    // Process subscribers
    const promises: Promise<void>[] = [];

    for (const sub of subscriptions) {
      // Apply filter if defined
      if (sub.options.filter && !sub.options.filter(event)) {
        continue;
      }

      if (sub.options.async !== false) {
        // Async execution (default)
        promises.push(this.executeHandler(sub, event));
      } else {
        // Sync execution
        try {
          await this.executeHandler(sub, event);
        } catch (error) {
          console.error(`[EventBus] Sync handler error for ${event.type}:`, error);
        }
      }
    }

    // Wait for all async handlers
    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }

    // Update delivery time stats
    const deliveryTime = Date.now() - startTime;
    this.updateAverageDeliveryTime(deliveryTime);
  }

  /**
   * Publish multiple events
   */
  async publishAll<T>(events: DomainEvent<T>[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Emit a simple event (creates DomainEvent automatically)
   */
  async emit<T>(
    type: string,
    source: string,
    payload: T,
    options?: {
      correlationId?: string;
      causationId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<DomainEvent<T>> {
    const event = this.createEvent(type, source, payload, options);
    await this.publish(event);
    return event;
  }

  // ---------------------------------------------------------------------------
  // SUBSCRIBING
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to an event type
   */
  subscribe<T>(
    eventType: string,
    handler: EventHandler<T>,
    options: SubscriptionOptions = {}
  ): string {
    const subscription: EventSubscription = {
      id: uuidv4(),
      eventType,
      handler: handler as EventHandler,
      options: {
        priority: options.priority ?? 100,
        async: options.async ?? true,
        ...options,
      },
      subscribedAt: new Date(),
    };

    const subs = this.subscriptions.get(eventType) || [];
    subs.push(subscription);
    this.subscriptions.set(eventType, subs);

    if (this.config.logEvents) {
      logger.info(`[EventBus] Subscribed to: ${eventType}`, { subscriptionId: subscription.id });
    }

    return subscription.id;
  }

  /**
   * Subscribe to multiple event types with same handler
   */
  subscribeAll<T>(
    eventTypes: string[],
    handler: EventHandler<T>,
    options: SubscriptionOptions = {}
  ): string[] {
    return eventTypes.map((type) => this.subscribe(type, handler, options));
  }

  /**
   * Subscribe with pattern matching (e.g., 'user.*' matches 'user.created', 'user.updated')
   */
  subscribePattern<T>(
    pattern: string,
    handler: EventHandler<T>,
    options: SubscriptionOptions = {}
  ): string {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    
    return this.subscribe('*', async (event) => {
      if (regex.test(event.type)) {
        await handler(event as DomainEvent<T>);
      }
    }, options);
  }

  /**
   * Unsubscribe by subscription ID
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [eventType, subs] of this.subscriptions) {
      const idx = subs.findIndex((s) => s.id === subscriptionId);
      if (idx !== -1) {
        subs.splice(idx, 1);
        if (this.config.logEvents) {
          logger.info(`[EventBus] Unsubscribed: ${subscriptionId} from ${eventType}`);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Unsubscribe all handlers for an event type
   */
  unsubscribeAll(eventType: string): void {
    this.subscriptions.delete(eventType);
  }

  /**
   * Subscribe once (automatically unsubscribes after first event)
   */
  once<T>(
    eventType: string,
    handler: EventHandler<T>,
    options: SubscriptionOptions = {}
  ): string {
    const wrappedHandler: EventHandler<T> = async (event) => {
      this.unsubscribe(subscriptionId);
      await handler(event);
    };
    
    const subscriptionId = this.subscribe(eventType, wrappedHandler, options);
    return subscriptionId;
  }

  // ---------------------------------------------------------------------------
  // QUERY
  // ---------------------------------------------------------------------------

  /**
   * Get event history
   */
  getHistory(options?: { type?: string; limit?: number; since?: Date }): DomainEvent[] {
    let events = [...this.eventHistory];

    if (options?.type) {
      events = events.filter((e) => e.type === options.type);
    }

    if (options?.since) {
      events = events.filter((e) => e.timestamp >= options.since!);
    }

    if (options?.limit) {
      events = events.slice(-options.limit);
    }

    return events;
  }

  /**
   * Get dead letter queue contents
   */
  getDeadLetterQueue(): DomainEvent[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Clear dead letter queue
   */
  clearDeadLetterQueue(): void {
    this.deadLetterQueue = [];
  }

  /**
   * Get subscription count for an event type
   */
  getSubscriberCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length ?? 0;
  }

  /**
   * Get all subscriptions
   */
  getSubscriptions(): Map<string, EventSubscription[]> {
    return new Map(this.subscriptions);
  }

  /**
   * Get statistics
   */
  getStats(): EventStats {
    return { ...this.stats };
  }

  // ---------------------------------------------------------------------------
  // REPLAY
  // ---------------------------------------------------------------------------

  /**
   * Replay events from history
   */
  async replay(options?: { type?: string; since?: Date; to?: Date }): Promise<number> {
    let events = this.getHistory(options);
    
    if (options?.to) {
      events = events.filter((e) => e.timestamp <= options.to!);
    }

    logger.info(`[EventBus] Replaying ${events.length} events...`);

    for (const event of events) {
      await this.publish(event);
    }

    return events.length;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private getSortedSubscriptions(eventType: string): EventSubscription[] {
    const direct = this.subscriptions.get(eventType) || [];
    const wildcard = this.subscriptions.get('*') || [];
    
    return [...direct, ...wildcard].sort(
      (a, b) => (a.options.priority || 100) - (b.options.priority || 100)
    );
  }

  private async executeHandler(sub: EventSubscription, event: DomainEvent): Promise<void> {
    const retryConfig = sub.options.retry || this.config.defaultRetry;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= (retryConfig?.maxRetries || 0); attempt++) {
      try {
        await sub.handler(event);
        this.stats.totalDelivered++;
        return;
      } catch (error: unknown) {
        lastError = ensureError(error);
        console.error(
          `[EventBus] Handler error (attempt ${attempt + 1}):`,
          getErrorMessage(error)
        );

        if (attempt < (retryConfig?.maxRetries || 0)) {
          await this.sleep(retryConfig!.backoffMs * Math.pow(2, attempt));
        }
      }
    }

    // All retries failed
    this.stats.totalFailed++;
    
    if (sub.options.deadLetterQueue) {
      this.deadLetterQueue.push(event);
      logger.info(`[EventBus] Event moved to DLQ: ${event.id}`);
    }
  }

  private addToHistory(event: DomainEvent): void {
    this.eventHistory.push(event);
    
    // Trim history if needed
    if (this.eventHistory.length > (this.config.maxHistory || 1000)) {
      this.eventHistory.shift();
    }
  }

  private updateAverageDeliveryTime(newTime: number): void {
    const count = this.stats.totalDelivered + this.stats.totalFailed;
    if (count === 0) {
      this.stats.averageDeliveryTime = newTime;
    } else {
      this.stats.averageDeliveryTime = 
        (this.stats.averageDeliveryTime * (count - 1) + newTime) / count;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear all subscriptions and history (for testing)
   */
  reset(): void {
    this.subscriptions.clear();
    this.eventHistory = [];
    this.deadLetterQueue = [];
    this.stats = {
      totalPublished: 0,
      totalDelivered: 0,
      totalFailed: 0,
      eventsByType: {},
      averageDeliveryTime: 0,
    };
  }
}

// Export singleton
export const eventBus = EventBus.getInstance();
export { EventBus };
export default eventBus;
