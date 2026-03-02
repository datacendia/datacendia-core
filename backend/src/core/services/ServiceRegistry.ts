// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - SERVICE REGISTRY
// Centralized service management with dependency injection
// =============================================================================

import { BaseService, ServiceHealth, ServiceMetrics, ServiceState } from './BaseService';
import { getErrorMessage, ensureError } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// TYPES
// =============================================================================

export interface ServiceRegistration {
  service: BaseService;
  registeredAt: Date;
  priority: number; // Lower numbers start first, shutdown last
}

export interface RegistryHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, ServiceHealth>;
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  unhealthyServices: number;
}

export interface RegistryMetrics {
  services: Record<string, ServiceMetrics>;
  totalRequests: number;
  totalErrors: number;
}

// =============================================================================
// SERVICE REGISTRY (Singleton)
// =============================================================================

class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceRegistration> = new Map();
  private initializing: Set<string> = new Set();
  private initialized: boolean = false;
  private shutdownPromise: Promise<void> | null = null;

  private constructor() {
    // Private constructor for singleton
    this.setupGracefulShutdown();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  // ---------------------------------------------------------------------------
  // REGISTRATION
  // ---------------------------------------------------------------------------

  /**
   * Register a service instance
   */
  register<T extends BaseService>(
    name: string,
    service: T,
    options: { priority?: number } = {}
  ): void {
    if (this.services.has(name)) {
      throw new Error(`Service already registered: ${name}`);
    }

    this.services.set(name, {
      service,
      registeredAt: new Date(),
      priority: options.priority ?? 100,
    });

    logger.info(`[ServiceRegistry] Registered service: ${name}`);
  }

  /**
   * Register and immediately initialize a service
   */
  async registerAndStart<T extends BaseService>(
    name: string,
    ServiceClass: new (config: any) => T,
    config: any,
    options: { priority?: number } = {}
  ): Promise<T> {
    if (this.services.has(name)) {
      return this.get<T>(name);
    }

    if (this.initializing.has(name)) {
      throw new Error(`Circular dependency detected while initializing: ${name}`);
    }

    this.initializing.add(name);

    try {
      // Check dependencies first
      const service = new ServiceClass(config);
      const deps = service.getDependencies();
      
      for (const dep of deps) {
        if (!this.services.has(dep)) {
          throw new Error(`Missing dependency: ${dep} for service ${name}`);
        }
        const depService = this.get(dep);
        if (!depService.isReady()) {
          throw new Error(`Dependency not ready: ${dep} for service ${name}`);
        }
      }

      // Initialize the service
      await service.start();

      // Register it
      this.services.set(name, {
        service,
        registeredAt: new Date(),
        priority: options.priority ?? 100,
      });

      logger.info(`[ServiceRegistry] Service started: ${name}`);
      
      return service;
    } finally {
      this.initializing.delete(name);
    }
  }

  /**
   * Unregister a service (stops it first)
   */
  async unregister(name: string): Promise<void> {
    const registration = this.services.get(name);
    if (!registration) {
      return;
    }

    // Check if other services depend on this one
    for (const [serviceName, reg] of this.services) {
      if (serviceName !== name) {
        const deps = reg.service.getDependencies();
        if (deps.includes(name)) {
          throw new Error(`Cannot unregister ${name}: ${serviceName} depends on it`);
        }
      }
    }

    await registration.service.stop();
    this.services.delete(name);
    logger.info(`[ServiceRegistry] Unregistered service: ${name}`);
  }

  // ---------------------------------------------------------------------------
  // RETRIEVAL
  // ---------------------------------------------------------------------------

  /**
   * Get a registered service by name
   */
  get<T extends BaseService>(name: string): T {
    const registration = this.services.get(name);
    if (!registration) {
      throw new Error(`Service not found: ${name}`);
    }
    return registration.service as T;
  }

  /**
   * Get a service if it exists, otherwise return null
   */
  getOptional<T extends BaseService>(name: string): T | null {
    const registration = this.services.get(name);
    return registration ? (registration.service as T) : null;
  }

  /**
   * Check if a service is registered
   */
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Get all registered service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get count of registered services
   */
  getServiceCount(): number {
    return this.services.size;
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * Initialize all registered services in dependency order
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) {
      logger.info('[ServiceRegistry] Already initialized');
      return;
    }

    logger.info('[ServiceRegistry] Initializing all services...');

    // Sort services by priority (lower first)
    const sorted = this.getSortedServices();

    for (const [name, registration] of sorted) {
      if (!registration.service.isReady()) {
        try {
          await registration.service.start();
          logger.info(`[ServiceRegistry] Started: ${name}`);
        } catch (error: unknown) {
          console.error(`[ServiceRegistry] Failed to start ${name}:`, getErrorMessage(error));
          throw error;
        }
      }
    }

    this.initialized = true;
    logger.info(`[ServiceRegistry] All ${this.services.size} services initialized`);
  }

  /**
   * Shutdown all services in reverse dependency order
   */
  async shutdownAll(): Promise<void> {
    if (this.shutdownPromise) {
      return this.shutdownPromise;
    }

    this.shutdownPromise = this.performShutdown();
    return this.shutdownPromise;
  }

  private async performShutdown(): Promise<void> {
    logger.info('[ServiceRegistry] Shutting down all services...');

    // Sort services by priority (higher first for shutdown)
    const sorted = this.getSortedServices().reverse();

    const errors: Array<{ name: string; error: Error }> = [];

    for (const [name, registration] of sorted) {
      try {
        logger.info(`[ServiceRegistry] Stopping: ${name}`);
        await registration.service.stop();
      } catch (error: unknown) {
        console.error(`[ServiceRegistry] Error stopping ${name}:`, getErrorMessage(error));
        errors.push({ name, error: ensureError(error) });
      }
    }

    this.services.clear();
    this.initialized = false;
    logger.info('[ServiceRegistry] All services stopped');

    if (errors.length > 0) {
      console.error('[ServiceRegistry] Errors during shutdown:', errors);
    }
  }

  // ---------------------------------------------------------------------------
  // HEALTH & METRICS
  // ---------------------------------------------------------------------------

  /**
   * Check health of all services
   */
  async healthCheckAll(): Promise<RegistryHealth> {
    const services: Record<string, ServiceHealth> = {};
    let healthyCount = 0;
    let degradedCount = 0;
    let unhealthyCount = 0;

    for (const [name, registration] of this.services) {
      try {
        const health = await registration.service.checkHealth();
        services[name] = health;

        switch (health.status) {
          case 'healthy':
            healthyCount++;
            break;
          case 'degraded':
            degradedCount++;
            break;
          case 'unhealthy':
            unhealthyCount++;
            break;
        }
      } catch (error: unknown) {
        services[name] = {
          status: 'unhealthy',
          lastCheck: new Date(),
          errors: [getErrorMessage(error)],
        };
        unhealthyCount++;
      }
    }

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyCount > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      services,
      totalServices: this.services.size,
      healthyServices: healthyCount,
      degradedServices: degradedCount,
      unhealthyServices: unhealthyCount,
    };
  }

  /**
   * Get metrics from all services
   */
  getMetricsAll(): RegistryMetrics {
    const services: Record<string, ServiceMetrics> = {};
    let totalRequests = 0;
    let totalErrors = 0;

    for (const [name, registration] of this.services) {
      const metrics = registration.service.getMetrics();
      services[name] = metrics;
      totalRequests += metrics.requestCount;
      totalErrors += metrics.errorCount;
    }

    return {
      services,
      totalRequests,
      totalErrors,
    };
  }

  /**
   * Get state of all services
   */
  getStateAll(): Record<string, ServiceState> {
    const states: Record<string, ServiceState> = {};
    for (const [name, registration] of this.services) {
      states[name] = registration.service.getState();
    }
    return states;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private getSortedServices(): Array<[string, ServiceRegistration]> {
    return Array.from(this.services.entries()).sort(
      (a, b) => a[1].priority - b[1].priority
    );
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

    for (const signal of signals) {
      process.on(signal, async () => {
        logger.info(`\n[ServiceRegistry] Received ${signal}, initiating graceful shutdown...`);
        try {
          await this.shutdownAll();
          process.exit(0);
        } catch (error) {
          console.error('[ServiceRegistry] Error during shutdown:', error);
          process.exit(1);
        }
      });
    }
  }

  /**
   * Reset the registry (for testing)
   */
  async reset(): Promise<void> {
    await this.shutdownAll();
    this.shutdownPromise = null;
    ServiceRegistry.instance = new ServiceRegistry();
  }
}

// Export singleton instance
export const serviceRegistry = ServiceRegistry.getInstance();
export { ServiceRegistry };
export default serviceRegistry;
