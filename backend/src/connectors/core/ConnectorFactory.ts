// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * ENTERPRISE CONNECTOR FACTORY - Platinum Standard
 * =============================================================================
 * Central factory for creating, managing, and orchestrating data connectors
 * across all industry verticals with full lifecycle management.
 */

import { EventEmitter } from 'events';
import { BaseConnector, ConnectorConfig, ConnectorMetadata, ConnectorStatus, DataIngestionResult } from '../BaseConnector.js';
import { logger } from '../../utils/logger.js';
import { createHash, randomUUID } from 'crypto';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ConnectorInstance {
  id: string;
  connector: BaseConnector;
  config: ConnectorConfig;
  metadata: ConnectorMetadata;
  createdAt: Date;
  lastActivity: Date;
  status: ConnectorStatus;
  metrics: ConnectorMetrics;
}

export interface ConnectorMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalBytesIngested: number;
  totalRecordsIngested: number;
  averageLatencyMs: number;
  lastLatencyMs: number;
  uptime: number;
  errors: ErrorRecord[];
}

export interface ErrorRecord {
  timestamp: Date;
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface ConnectorRegistration {
  id: string;
  metadata: ConnectorMetadata;
  factory: (config: ConnectorConfig) => BaseConnector;
}

export interface IngestionJob {
  id: string;
  connectorId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt?: Date;
  completedAt?: Date;
  params: Record<string, unknown>;
  result?: DataIngestionResult;
  error?: string;
}

export interface HealthCheck {
  connectorId: string;
  healthy: boolean;
  latencyMs: number;
  checkedAt: Date;
  details?: Record<string, unknown>;
}

// =============================================================================
// CONNECTOR REGISTRY
// =============================================================================

class ConnectorRegistry {
  private registrations = new Map<string, ConnectorRegistration>();
  private byVertical = new Map<string, Set<string>>();
  private byCategory = new Map<string, Set<string>>();

  register(registration: ConnectorRegistration): void {
    if (this.registrations.has(registration.id)) {
      throw new Error(`Connector ${registration.id} is already registered`);
    }

    this.registrations.set(registration.id, registration);

    // Index by vertical
    const vertical = registration.metadata.vertical;
    if (!this.byVertical.has(vertical)) {
      this.byVertical.set(vertical, new Set());
    }
    this.byVertical.get(vertical)!.add(registration.id);

    // Index by category
    const category = registration.metadata.category;
    if (!this.byCategory.has(category)) {
      this.byCategory.set(category, new Set());
    }
    this.byCategory.get(category)!.add(registration.id);

    logger.info(`Registered connector: ${registration.id} (${vertical}/${category})`);
  }

  unregister(id: string): boolean {
    const registration = this.registrations.get(id);
    if (!registration) return false;

    this.registrations.delete(id);
    this.byVertical.get(registration.metadata.vertical)?.delete(id);
    this.byCategory.get(registration.metadata.category)?.delete(id);

    return true;
  }

  get(id: string): ConnectorRegistration | undefined {
    return this.registrations.get(id);
  }

  getByVertical(vertical: string): ConnectorRegistration[] {
    const ids = this.byVertical.get(vertical) || new Set();
    return Array.from(ids).map(id => this.registrations.get(id)!).filter(Boolean);
  }

  getByCategory(category: string): ConnectorRegistration[] {
    const ids = this.byCategory.get(category) || new Set();
    return Array.from(ids).map(id => this.registrations.get(id)!).filter(Boolean);
  }

  getAll(): ConnectorRegistration[] {
    return Array.from(this.registrations.values());
  }

  getAllMetadata(): ConnectorMetadata[] {
    return this.getAll().map(r => r.metadata);
  }

  getVerticals(): string[] {
    return Array.from(this.byVertical.keys());
  }

  getCategories(): string[] {
    return Array.from(this.byCategory.keys());
  }

  size(): number {
    return this.registrations.size;
  }
}

// =============================================================================
// CONNECTOR FACTORY
// =============================================================================

export class ConnectorFactory extends EventEmitter {
  private static instance: ConnectorFactory;
  private registry = new ConnectorRegistry();
  private instances = new Map<string, ConnectorInstance>();
  private ingestionJobs = new Map<string, IngestionJob>();
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsCollectionInterval?: NodeJS.Timeout;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): ConnectorFactory {
    if (!ConnectorFactory.instance) {
      ConnectorFactory.instance = new ConnectorFactory();
    }
    return ConnectorFactory.instance;
  }

  // ---------------------------------------------------------------------------
  // REGISTRATION
  // ---------------------------------------------------------------------------

  registerConnector(registration: ConnectorRegistration): void {
    this.registry.register(registration);
    this.emit('connector:registered', registration);
  }

  registerConnectors(registrations: ConnectorRegistration[]): void {
    for (const registration of registrations) {
      this.registerConnector(registration);
    }
  }

  unregisterConnector(id: string): boolean {
    // Destroy any active instances first
    const activeInstances = this.getInstancesByConnectorType(id);
    for (const instance of activeInstances) {
      this.destroyInstance(instance.id);
    }

    const result = this.registry.unregister(id);
    if (result) {
      this.emit('connector:unregistered', id);
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // INSTANCE MANAGEMENT
  // ---------------------------------------------------------------------------

  async createInstance(connectorId: string, config: Partial<ConnectorConfig>): Promise<ConnectorInstance> {
    const registration = this.registry.get(connectorId);
    if (!registration) {
      throw new Error(`Connector ${connectorId} is not registered`);
    }

    const instanceId = `${connectorId}-${randomUUID().slice(0, 8)}`;
    const fullConfig: ConnectorConfig = {
      id: instanceId,
      name: registration.metadata.name,
      description: registration.metadata.description,
      vertical: registration.metadata.vertical,
      category: registration.metadata.category,
      baseUrl: '',
      authType: 'none',
      ...config,
    };

    const connector = registration.factory(fullConfig);

    const instance: ConnectorInstance = {
      id: instanceId,
      connector,
      config: fullConfig,
      metadata: registration.metadata,
      createdAt: new Date(),
      lastActivity: new Date(),
      status: 'disconnected',
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalBytesIngested: 0,
        totalRecordsIngested: 0,
        averageLatencyMs: 0,
        lastLatencyMs: 0,
        uptime: 0,
        errors: [],
      },
    };

    // Set up event listeners
    connector.on('status', (status: ConnectorStatus) => {
      instance.status = status;
      instance.lastActivity = new Date();
      this.emit('instance:status', { instanceId, status });
    });

    connector.on('error', (error: Error) => {
      instance.metrics.errors.push({
        timestamp: new Date(),
        code: 'CONNECTOR_ERROR',
        message: error.message,
      });
      // Keep only last 100 errors
      if (instance.metrics.errors.length > 100) {
        instance.metrics.errors = instance.metrics.errors.slice(-100);
      }
      this.emit('instance:error', { instanceId, error });
    });

    this.instances.set(instanceId, instance);
    this.emit('instance:created', instance);

    logger.info(`Created connector instance: ${instanceId}`);
    return instance;
  }

  async destroyInstance(instanceId: string): Promise<boolean> {
    const instance = this.instances.get(instanceId);
    if (!instance) return false;

    try {
      if (instance.status === 'connected') {
        await instance.connector.disconnect();
      }
    } catch (error) {
      logger.warn(`Error disconnecting instance ${instanceId}:`, error);
    }

    instance.connector.removeAllListeners();
    this.instances.delete(instanceId);
    this.emit('instance:destroyed', instanceId);

    logger.info(`Destroyed connector instance: ${instanceId}`);
    return true;
  }

  getInstance(instanceId: string): ConnectorInstance | undefined {
    return this.instances.get(instanceId);
  }

  getInstancesByConnectorType(connectorId: string): ConnectorInstance[] {
    return Array.from(this.instances.values()).filter(
      i => i.metadata.id === connectorId
    );
  }

  getInstancesByVertical(vertical: string): ConnectorInstance[] {
    return Array.from(this.instances.values()).filter(
      i => i.metadata.vertical === vertical
    );
  }

  getAllInstances(): ConnectorInstance[] {
    return Array.from(this.instances.values());
  }

  // ---------------------------------------------------------------------------
  // CONNECTION MANAGEMENT
  // ---------------------------------------------------------------------------

  async connect(instanceId: string): Promise<void> {
    const instance = this.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    instance.status = 'connecting';
    instance.lastActivity = new Date();

    try {
      await instance.connector.connect();
      instance.status = 'connected';
      this.emit('instance:connected', instanceId);
    } catch (error) {
      instance.status = 'error';
      instance.metrics.errors.push({
        timestamp: new Date(),
        code: 'CONNECTION_FAILED',
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async disconnect(instanceId: string): Promise<void> {
    const instance = this.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      await instance.connector.disconnect();
      instance.status = 'disconnected';
      instance.lastActivity = new Date();
      this.emit('instance:disconnected', instanceId);
    } catch (error) {
      instance.metrics.errors.push({
        timestamp: new Date(),
        code: 'DISCONNECT_FAILED',
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async testConnection(instanceId: string): Promise<boolean> {
    const instance = this.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    const startTime = Date.now();
    try {
      const result = await instance.connector.testConnection();
      instance.metrics.lastLatencyMs = Date.now() - startTime;
      return result;
    } catch (error) {
      instance.metrics.lastLatencyMs = Date.now() - startTime;
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // DATA INGESTION
  // ---------------------------------------------------------------------------

  async ingest(instanceId: string, params?: Record<string, unknown>): Promise<DataIngestionResult> {
    const instance = this.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    if (instance.status !== 'connected') {
      throw new Error(`Instance ${instanceId} is not connected (status: ${instance.status})`);
    }

    const jobId = randomUUID();
    const job: IngestionJob = {
      id: jobId,
      connectorId: instanceId,
      status: 'running',
      startedAt: new Date(),
      params: params || {},
    };

    this.ingestionJobs.set(jobId, job);
    this.emit('ingestion:started', job);

    const startTime = Date.now();
    instance.metrics.totalRequests++;

    try {
      const data = await instance.connector.fetchData(params);
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      const result: DataIngestionResult = {
        connectorId: instanceId,
        timestamp: new Date(),
        recordsIngested: Array.isArray(data) ? data.length : 1,
        bytesProcessed: JSON.stringify(data).length,
        durationMs,
        errors: [],
        warnings: [],
        checksum: createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      };

      // Update metrics
      instance.metrics.successfulRequests++;
      instance.metrics.totalRecordsIngested += result.recordsIngested;
      instance.metrics.totalBytesIngested += result.bytesProcessed;
      instance.metrics.lastLatencyMs = durationMs;
      instance.metrics.averageLatencyMs = 
        (instance.metrics.averageLatencyMs * (instance.metrics.successfulRequests - 1) + durationMs) / 
        instance.metrics.successfulRequests;

      instance.lastActivity = new Date();

      // Update job
      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;

      this.emit('ingestion:completed', { job, data, result });

      return result;
    } catch (error) {
      instance.metrics.failedRequests++;
      instance.metrics.errors.push({
        timestamp: new Date(),
        code: 'INGESTION_FAILED',
        message: error instanceof Error ? error.message : String(error),
        context: params,
      });

      job.status = 'failed';
      job.completedAt = new Date();
      job.error = error instanceof Error ? error.message : String(error);

      this.emit('ingestion:failed', { job, error });

      throw error;
    }
  }

  getIngestionJob(jobId: string): IngestionJob | undefined {
    return this.ingestionJobs.get(jobId);
  }

  getIngestionJobsByInstance(instanceId: string): IngestionJob[] {
    return Array.from(this.ingestionJobs.values()).filter(
      j => j.connectorId === instanceId
    );
  }

  // ---------------------------------------------------------------------------
  // HEALTH MONITORING
  // ---------------------------------------------------------------------------

  async healthCheck(instanceId: string): Promise<HealthCheck> {
    const instance = this.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    const startTime = Date.now();
    let healthy = false;
    let details: Record<string, unknown> = {};

    try {
      healthy = await instance.connector.testConnection();
      details = {
        status: instance.status,
        lastActivity: instance.lastActivity,
        metrics: {
          successRate: instance.metrics.totalRequests > 0
            ? (instance.metrics.successfulRequests / instance.metrics.totalRequests) * 100
            : 100,
          avgLatency: instance.metrics.averageLatencyMs,
        },
      };
    } catch (error) {
      details = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    const check: HealthCheck = {
      connectorId: instanceId,
      healthy,
      latencyMs: Date.now() - startTime,
      checkedAt: new Date(),
      details,
    };

    this.emit('health:checked', check);
    return check;
  }

  async healthCheckAll(): Promise<HealthCheck[]> {
    const instances = this.getAllInstances();
    const checks = await Promise.all(
      instances.map(i => this.healthCheck(i.id).catch(error => ({
        connectorId: i.id,
        healthy: false,
        latencyMs: 0,
        checkedAt: new Date(),
        details: { error: error.message },
      })))
    );
    return checks;
  }

  startHealthMonitoring(intervalMs: number = 60000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      const checks = await this.healthCheckAll();
      this.emit('health:report', checks);
    }, intervalMs);

    logger.info(`Started health monitoring (interval: ${intervalMs}ms)`);
  }

  stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
      logger.info('Stopped health monitoring');
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getInstanceMetrics(instanceId: string): ConnectorMetrics | undefined {
    return this.getInstance(instanceId)?.metrics;
  }

  getAggregateMetrics(): {
    totalInstances: number;
    connectedInstances: number;
    totalRequests: number;
    successRate: number;
    avgLatencyMs: number;
    totalBytesIngested: number;
    totalRecordsIngested: number;
    byVertical: Record<string, { instances: number; requests: number }>;
  } {
    const instances = this.getAllInstances();
    const byVertical: Record<string, { instances: number; requests: number }> = {};

    let totalRequests = 0;
    let successfulRequests = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    let totalBytes = 0;
    let totalRecords = 0;

    for (const instance of instances) {
      const vertical = instance.metadata.vertical;
      if (!byVertical[vertical]) {
        byVertical[vertical] = { instances: 0, requests: 0 };
      }
      byVertical[vertical].instances++;
      byVertical[vertical].requests += instance.metrics.totalRequests;

      totalRequests += instance.metrics.totalRequests;
      successfulRequests += instance.metrics.successfulRequests;
      totalBytes += instance.metrics.totalBytesIngested;
      totalRecords += instance.metrics.totalRecordsIngested;

      if (instance.metrics.averageLatencyMs > 0) {
        totalLatency += instance.metrics.averageLatencyMs;
        latencyCount++;
      }
    }

    return {
      totalInstances: instances.length,
      connectedInstances: instances.filter(i => i.status === 'connected').length,
      totalRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100,
      avgLatencyMs: latencyCount > 0 ? totalLatency / latencyCount : 0,
      totalBytesIngested: totalBytes,
      totalRecordsIngested: totalRecords,
      byVertical,
    };
  }

  // ---------------------------------------------------------------------------
  // REGISTRY ACCESS
  // ---------------------------------------------------------------------------

  getRegistry(): ConnectorRegistry {
    return this.registry;
  }

  getAvailableConnectors(): ConnectorMetadata[] {
    return this.registry.getAllMetadata();
  }

  getConnectorsByVertical(vertical: string): ConnectorMetadata[] {
    return this.registry.getByVertical(vertical).map(r => r.metadata);
  }

  getConnectorsByCategory(category: string): ConnectorMetadata[] {
    return this.registry.getByCategory(category).map(r => r.metadata);
  }

  getVerticals(): string[] {
    return this.registry.getVerticals();
  }

  getCategories(): string[] {
    return this.registry.getCategories();
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  async shutdown(): Promise<void> {
    logger.info('Shutting down ConnectorFactory...');

    this.stopHealthMonitoring();

    // Disconnect and destroy all instances
    const instances = this.getAllInstances();
    await Promise.all(
      instances.map(i => this.destroyInstance(i.id))
    );

    this.ingestionJobs.clear();
    this.removeAllListeners();

    logger.info('ConnectorFactory shutdown complete');
  }
}

// Export singleton
export const connectorFactory = ConnectorFactory.getInstance();
