// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - BASE SERVICE
// Enterprise-grade service foundation with lifecycle management
// =============================================================================

import { EventEmitter } from 'events';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// TYPES
// =============================================================================

export interface ServiceConfig {
  name: string;
  version: string;
  dependencies?: string[];
  config?: Record<string, any>;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  lastCheck: Date;
  details?: Record<string, any>;
  errors?: string[];
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  uptime: number;
}

export interface ServiceState {
  status: 'uninitialized' | 'initializing' | 'ready' | 'degraded' | 'shutting_down' | 'stopped';
  startedAt?: Date;
  lastHealthCheck?: Date;
  health?: ServiceHealth;
}

// =============================================================================
// LOGGER (Enterprise-grade logging)
// =============================================================================

export class ServiceLogger {
  private serviceName: string;
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  constructor(serviceName: string, logLevel?: 'debug' | 'info' | 'warn' | 'error') {
    this.serviceName = serviceName;
    if (logLevel) this.logLevel = logLevel;
  }

  private formatMessage(level: string, message: string, meta?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.serviceName}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (this.logLevel === 'debug') {
      logger.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: Record<string, any>): void {
    if (['debug', 'info'].includes(this.logLevel)) {
      logger.info(this.formatMessage('info', message, meta));
    }
  }

  warn(message: string, meta?: Record<string, any>): void {
    if (['debug', 'info', 'warn'].includes(this.logLevel)) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  error(message: string, meta?: Record<string, any>): void {
    console.error(this.formatMessage('error', message, meta));
  }
}

// =============================================================================
// METRICS COLLECTOR
// =============================================================================

export class MetricsCollector {
  private serviceName: string;
  private metrics: Map<string, number[]> = new Map();
  private counters: Map<string, number> = new Map();
  private startTime: Date;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.startTime = new Date();
  }

  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
  }

  record(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const values = this.metrics.get(key) || [];
    values.push(value);
    // Keep last 1000 values for percentile calculations
    if (values.length > 1000) values.shift();
    this.metrics.set(key, values);
  }

  timing(name: string, startTime: number, tags?: Record<string, string>): void {
    const duration = Date.now() - startTime;
    this.record(name, duration, tags);
  }

  getMetrics(): ServiceMetrics {
    const requestCount = this.counters.get('requests') || 0;
    const errorCount = this.counters.get('errors') || 0;
    const latencies = this.metrics.get('latency') || [];
    
    return {
      requestCount,
      errorCount,
      avgLatency: this.average(latencies),
      p95Latency: this.percentile(latencies, 95),
      p99Latency: this.percentile(latencies, 99),
      uptime: Date.now() - this.startTime.getTime(),
    };
  }

  private getKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const tagStr = Object.entries(tags).map(([k, v]) => `${k}:${v}`).join(',');
    return `${name}{${tagStr}}`;
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[idx];
  }

  reset(): void {
    this.metrics.clear();
    this.counters.clear();
  }
}

// =============================================================================
// BASE SERVICE
// =============================================================================

export abstract class BaseService {
  protected config: ServiceConfig;
  protected logger: ServiceLogger;
  protected metrics: MetricsCollector;
  protected events: EventEmitter;
  protected state: ServiceState;

  constructor(config: ServiceConfig) {
    this.config = config;
    this.logger = new ServiceLogger(config.name);
    this.metrics = new MetricsCollector(config.name);
    this.events = new EventEmitter();
    this.state = { status: 'uninitialized' };
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE METHODS (Must be implemented by subclasses)
  // ---------------------------------------------------------------------------

  /**
   * Initialize the service. Called once during startup.
   * Should set up connections, load configuration, etc.
   */
  abstract initialize(): Promise<void>;

  /**
   * Gracefully shutdown the service.
   * Should close connections, flush buffers, etc.
   */
  abstract shutdown(): Promise<void>;

  /**
   * Perform a health check on the service.
   * Should verify all dependencies are accessible.
   */
  abstract healthCheck(): Promise<ServiceHealth>;

  // ---------------------------------------------------------------------------
  // LIFECYCLE MANAGEMENT
  // ---------------------------------------------------------------------------

  async start(): Promise<void> {
    if (this.state.status !== 'uninitialized') {
      throw new Error(`Cannot start service in state: ${this.state.status}`);
    }

    this.state.status = 'initializing';
    this.logger.info('Starting service...');

    try {
      await this.initialize();
      this.state.status = 'ready';
      this.state.startedAt = new Date();
      this.logger.info('Service started successfully');
      this.emit('started');
    } catch (error: unknown) {
      this.state.status = 'stopped';
      this.logger.error('Failed to start service', { error: getErrorMessage(error) });
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.state.status === 'stopped') {
      return;
    }

    this.state.status = 'shutting_down';
    this.logger.info('Stopping service...');

    try {
      await this.shutdown();
      this.state.status = 'stopped';
      this.logger.info('Service stopped successfully');
      this.emit('stopped');
    } catch (error: unknown) {
      this.logger.error('Error during shutdown', { error: getErrorMessage(error) });
      this.state.status = 'stopped';
      throw error;
    }
  }

  async restart(): Promise<void> {
    await this.stop();
    this.state.status = 'uninitialized';
    await this.start();
  }

  // ---------------------------------------------------------------------------
  // HEALTH & METRICS
  // ---------------------------------------------------------------------------

  async checkHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const health = await this.healthCheck();
      health.lastCheck = new Date();
      health.latency = Date.now() - startTime;
      
      this.state.lastHealthCheck = health.lastCheck;
      this.state.health = health;
      
      if (health.status === 'unhealthy' && this.state.status === 'ready') {
        this.state.status = 'degraded';
        this.emit('degraded', health);
      } else if (health.status === 'healthy' && this.state.status === 'degraded') {
        this.state.status = 'ready';
        this.emit('recovered', health);
      }
      
      return health;
    } catch (error: unknown) {
      const health: ServiceHealth = {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - startTime,
        errors: [getErrorMessage(error)],
      };
      
      this.state.health = health;
      this.state.status = 'degraded';
      this.emit('degraded', health);
      
      return health;
    }
  }

  getMetrics(): ServiceMetrics {
    return this.metrics.getMetrics();
  }

  getState(): ServiceState {
    return { ...this.state };
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLING
  // ---------------------------------------------------------------------------

  on(event: string, handler: (...args: any[]) => void): void {
    this.events.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.events.off(event, handler);
  }

  once(event: string, handler: (...args: any[]) => void): void {
    this.events.once(event, handler);
  }

  protected emit(event: string, ...args: any[]): void {
    this.events.emit(event, ...args);
  }

  // ---------------------------------------------------------------------------
  // UTILITY METHODS
  // ---------------------------------------------------------------------------

  getName(): string {
    return this.config.name;
  }

  getVersion(): string {
    return this.config.version;
  }

  getDependencies(): string[] {
    return this.config.dependencies || [];
  }

  isReady(): boolean {
    return this.state.status === 'ready';
  }

  isHealthy(): boolean {
    return this.state.health?.status === 'healthy';
  }

  protected recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.record(name, value, tags);
  }

  protected incrementCounter(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.metrics.increment(name, value, tags);
  }

  /**
   * Wrap an async operation with timing and error tracking
   */
  protected async withMetrics<T>(
    operationName: string,
    operation: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const startTime = Date.now();
    this.incrementCounter('requests', 1, { operation: operationName, ...tags });
    
    try {
      const result = await operation();
      this.metrics.timing('latency', startTime, { operation: operationName, ...tags });
      return result;
    } catch (error) {
      this.incrementCounter('errors', 1, { operation: operationName, ...tags });
      this.metrics.timing('latency', startTime, { operation: operationName, error: 'true', ...tags });
      throw error;
    }
  }
}

export default BaseService;
