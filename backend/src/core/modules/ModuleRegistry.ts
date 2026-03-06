/**
 * Core — Module Registry
 *
 * Core platform infrastructure and shared utilities.
 *
 * @exports ModuleLogger, moduleRegistry, ModuleContext, ModuleDefinition, ModuleState, ModuleHealth, ModuleInfo
 * @module core/modules/ModuleRegistry
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - MODULE REGISTRY
// Enterprise-grade feature module system with dependency management
// =============================================================================

import { Router } from 'express';
import { eventBus } from '../events/EventBus';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// TYPES
// =============================================================================

export interface ModuleContext {
  router: Router;
  eventBus: typeof eventBus;
  services: Map<string, unknown>;
  config: Record<string, unknown>;
  logger: ModuleLogger;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  version: string;
  description?: string;
  
  /** Dependencies on other modules */
  dependencies?: string[];
  
  /** Feature flags required for this module */
  features?: string[];
  
  /** Priority for loading order (lower = earlier) */
  priority?: number;
  
  /** Routes this module provides */
  routes?: () => Promise<{ default: (ctx: ModuleContext) => Router }>;
  
  /** Services this module provides */
  services?: () => Promise<{ default: Record<string, unknown> }>;
  
  /** API controllers */
  controllers?: () => Promise<{ default: Record<string, unknown> }>;
  
  /** Module configuration schema */
  configSchema?: Record<string, unknown>;
  
  /** Default configuration */
  defaultConfig?: Record<string, unknown>;
  
  /** Lifecycle hook: Called when module is loaded */
  onLoad?: (context: ModuleContext) => Promise<void>;
  
  /** Lifecycle hook: Called when module is unloaded */
  onUnload?: (context: ModuleContext) => Promise<void>;
  
  /** Lifecycle hook: Called when module config changes */
  onConfigChange?: (context: ModuleContext, newConfig: Record<string, unknown>) => Promise<void>;
  
  /** Health check for this module */
  healthCheck?: (context: ModuleContext) => Promise<ModuleHealth>;
}

export interface ModuleState {
  status: 'registered' | 'loading' | 'loaded' | 'error' | 'unloading' | 'unloaded';
  loadedAt?: Date;
  error?: string;
  config?: Record<string, unknown>;
}

export interface ModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details?: Record<string, unknown>;
}

export interface ModuleInfo {
  definition: ModuleDefinition;
  state: ModuleState;
  context?: ModuleContext;
}

// =============================================================================
// MODULE LOGGER
// =============================================================================

export class ModuleLogger {
  constructor(private moduleId: string) {}

  private format(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] [Module:${this.moduleId}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: unknown): void {
    logger.debug(this.format('DEBUG', message, meta));
  }

  info(message: string, meta?: unknown): void {
    logger.info(this.format('INFO', message, meta));
  }

  warn(message: string, meta?: unknown): void {
    logger.warn(this.format('WARN', message, meta));
  }

  error(message: string, meta?: unknown): void {
    logger.error(this.format('ERROR', message, meta));
  }
}

// =============================================================================
// MODULE REGISTRY (Singleton)
// =============================================================================

class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, ModuleInfo> = new Map();
  private mainRouter: Router;
  private globalServices: Map<string, unknown> = new Map();
  private featureFlags: Set<string> = new Set();
  private globalConfig: Record<string, unknown> = {};

  private constructor() {
    this.mainRouter = Router();
  }

  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  // ---------------------------------------------------------------------------
  // CONFIGURATION
  // ---------------------------------------------------------------------------

  /**
   * Set global configuration
   */
  setConfig(config: Record<string, unknown>): void {
    this.globalConfig = { ...this.globalConfig, ...config };
  }

  /**
   * Set feature flags
   */
  setFeatureFlags(flags: string[]): void {
    this.featureFlags = new Set(flags);
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureId: string): boolean {
    return this.featureFlags.has(featureId);
  }

  /**
   * Register a global service (accessible by all modules)
   */
  registerGlobalService(name: string, service: unknown): void {
    this.globalServices.set(name, service);
  }

  // ---------------------------------------------------------------------------
  // MODULE REGISTRATION
  // ---------------------------------------------------------------------------

  /**
   * Register a module definition
   */
  register(definition: ModuleDefinition): void {
    if (this.modules.has(definition.id)) {
      throw new Error(`Module already registered: ${definition.id}`);
    }

    this.modules.set(definition.id, {
      definition,
      state: { status: 'registered' },
    });

    logger.info(`[ModuleRegistry] Registered module: ${definition.id} v${definition.version}`);
  }

  /**
   * Register multiple modules
   */
  registerAll(definitions: ModuleDefinition[]): void {
    for (const def of definitions) {
      this.register(def);
    }
  }

  // ---------------------------------------------------------------------------
  // MODULE LOADING
  // ---------------------------------------------------------------------------

  /**
   * Load a specific module
   */
  async load(moduleId: string): Promise<void> {
    const moduleInfo = this.modules.get(moduleId);
    if (!moduleInfo) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    if (moduleInfo.state.status === 'loaded') {
      logger.info(`[ModuleRegistry] Module already loaded: ${moduleId}`);
      return;
    }

    const { definition } = moduleInfo;

    // Check feature flags
    if (definition.features) {
      for (const feature of definition.features) {
        if (!this.isFeatureEnabled(feature)) {
          logger.info(`[ModuleRegistry] Skipping module ${moduleId}: feature ${feature} not enabled`);
          return;
        }
      }
    }

    // Load dependencies first
    if (definition.dependencies) {
      for (const dep of definition.dependencies) {
        const depInfo = this.modules.get(dep);
        if (!depInfo) {
          throw new Error(`Missing dependency: ${dep} for module ${moduleId}`);
        }
        if (depInfo.state.status !== 'loaded') {
          await this.load(dep);
        }
      }
    }

    moduleInfo.state.status = 'loading';
    logger.info(`[ModuleRegistry] Loading module: ${moduleId}...`);

    try {
      // Create module context
      const moduleRouter = Router();
      const context: ModuleContext = {
        router: moduleRouter,
        eventBus,
        services: this.globalServices,
        config: {
          ...this.globalConfig,
          ...definition.defaultConfig,
          ...(moduleInfo.state.config || {}),
        },
        logger: new ModuleLogger(moduleId),
      };

      moduleInfo.context = context;

      // Load services
      if (definition.services) {
        const servicesModule = await definition.services();
        for (const [name, service] of Object.entries(servicesModule.default)) {
          this.globalServices.set(`${moduleId}.${name}`, service);
        }
      }

      // Load routes
      if (definition.routes) {
        const routesModule = await definition.routes();
        const moduleRoutes = routesModule.default(context);
        this.mainRouter.use(`/api/${moduleId}`, moduleRoutes);
      }

      // Call onLoad hook
      if (definition.onLoad) {
        await definition.onLoad(context);
      }

      // Emit module loaded event
      await eventBus.emit('module.loaded', 'ModuleRegistry', {
        moduleId,
        version: definition.version,
      });

      moduleInfo.state.status = 'loaded';
      moduleInfo.state.loadedAt = new Date();
      logger.info(`[ModuleRegistry] Module loaded: ${moduleId}`);

    } catch (error: unknown) {
      moduleInfo.state.status = 'error';
      moduleInfo.state.error = getErrorMessage(error);
      logger.error(`[ModuleRegistry] Failed to load module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Load all registered modules in dependency order
   */
  async loadAll(): Promise<void> {
    logger.info(`[ModuleRegistry] Loading all modules...`);

    // Sort by priority
    const sorted = this.getSortedModules();

    for (const [moduleId] of sorted) {
      try {
        await this.load(moduleId);
      } catch (error: unknown) {
        logger.error(`[ModuleRegistry] Error loading ${moduleId}:`, getErrorMessage(error));
        // Continue loading other modules
      }
    }

    const loaded = Array.from(this.modules.values()).filter(m => m.state.status === 'loaded');
    logger.info(`[ModuleRegistry] Loaded ${loaded.length}/${this.modules.size} modules`);
  }

  // ---------------------------------------------------------------------------
  // MODULE UNLOADING
  // ---------------------------------------------------------------------------

  /**
   * Unload a specific module
   */
  async unload(moduleId: string): Promise<void> {
    const moduleInfo = this.modules.get(moduleId);
    if (!moduleInfo || moduleInfo.state.status !== 'loaded') {
      return;
    }

    // Check if other loaded modules depend on this one
    for (const [otherId, otherInfo] of this.modules) {
      if (otherId !== moduleId && 
          otherInfo.state.status === 'loaded' &&
          otherInfo.definition.dependencies?.includes(moduleId)) {
        throw new Error(`Cannot unload ${moduleId}: ${otherId} depends on it`);
      }
    }

    moduleInfo.state.status = 'unloading';
    logger.info(`[ModuleRegistry] Unloading module: ${moduleId}...`);

    try {
      const { definition, context } = moduleInfo;

      if (definition.onUnload && context) {
        await definition.onUnload(context);
      }

      // Remove module services
      for (const key of this.globalServices.keys()) {
        if (key.startsWith(`${moduleId}.`)) {
          this.globalServices.delete(key);
        }
      }

      // Emit module unloaded event
      await eventBus.emit('module.unloaded', 'ModuleRegistry', { moduleId });

      moduleInfo.state.status = 'unloaded';
      moduleInfo.context = undefined;
      logger.info(`[ModuleRegistry] Module unloaded: ${moduleId}`);

    } catch (error: unknown) {
      moduleInfo.state.status = 'error';
      moduleInfo.state.error = getErrorMessage(error);
      throw error;
    }
  }

  /**
   * Unload all modules in reverse dependency order
   */
  async unloadAll(): Promise<void> {
    logger.info(`[ModuleRegistry] Unloading all modules...`);

    const sorted = this.getSortedModules().reverse();

    for (const [moduleId, moduleInfo] of sorted) {
      if (moduleInfo.state.status === 'loaded') {
        try {
          await this.unload(moduleId);
        } catch (error: unknown) {
          logger.error(`[ModuleRegistry] Error unloading ${moduleId}:`, getErrorMessage(error));
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // MODULE RELOADING
  // ---------------------------------------------------------------------------

  /**
   * Reload a module (hot reload)
   */
  async reload(moduleId: string): Promise<void> {
    logger.info(`[ModuleRegistry] Reloading module: ${moduleId}...`);
    await this.unload(moduleId);
    await this.load(moduleId);
  }

  /**
   * Update module configuration
   */
  async updateConfig(moduleId: string, config: Record<string, unknown>): Promise<void> {
    const moduleInfo = this.modules.get(moduleId);
    if (!moduleInfo) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    moduleInfo.state.config = { ...moduleInfo.state.config, ...config };

    if (moduleInfo.state.status === 'loaded' && 
        moduleInfo.definition.onConfigChange && 
        moduleInfo.context) {
      moduleInfo.context.config = {
        ...this.globalConfig,
        ...moduleInfo.definition.defaultConfig,
        ...moduleInfo.state.config,
      };
      await moduleInfo.definition.onConfigChange(moduleInfo.context, moduleInfo.context.config);
    }
  }

  // ---------------------------------------------------------------------------
  // QUERY
  // ---------------------------------------------------------------------------

  /**
   * Get module info
   */
  get(moduleId: string): ModuleInfo | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Check if module is loaded
   */
  isLoaded(moduleId: string): boolean {
    return this.modules.get(moduleId)?.state.status === 'loaded';
  }

  /**
   * Get all module IDs
   */
  getModuleIds(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules(): ModuleInfo[] {
    return Array.from(this.modules.values()).filter(m => m.state.status === 'loaded');
  }

  /**
   * Get main router with all module routes
   */
  getRouter(): Router {
    return this.mainRouter;
  }

  /**
   * Get a service by full name (moduleId.serviceName)
   */
  getService<T>(fullName: string): T | undefined {
    return this.globalServices.get(fullName) as T;
  }

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  /**
   * Check health of all modules
   */
  async healthCheckAll(): Promise<Record<string, ModuleHealth>> {
    const results: Record<string, ModuleHealth> = {};

    for (const [moduleId, moduleInfo] of this.modules) {
      if (moduleInfo.state.status !== 'loaded') {
        results[moduleId] = {
          status: moduleInfo.state.status === 'error' ? 'unhealthy' : 'degraded',
          details: { state: moduleInfo.state.status, error: moduleInfo.state.error },
        };
        continue;
      }

      if (moduleInfo.definition.healthCheck && moduleInfo.context) {
        try {
          results[moduleId] = await moduleInfo.definition.healthCheck(moduleInfo.context);
        } catch (error: unknown) {
          results[moduleId] = {
            status: 'unhealthy',
            details: { error: getErrorMessage(error) },
          };
        }
      } else {
        results[moduleId] = { status: 'healthy' };
      }
    }

    return results;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private getSortedModules(): Array<[string, ModuleInfo]> {
    return Array.from(this.modules.entries()).sort((a, b) => {
      const priorityA = a[1].definition.priority ?? 100;
      const priorityB = b[1].definition.priority ?? 100;
      return priorityA - priorityB;
    });
  }

  /**
   * Reset the registry (for testing)
   */
  async reset(): Promise<void> {
    await this.unloadAll();
    this.modules.clear();
    this.globalServices.clear();
    this.mainRouter = Router();
    this.featureFlags.clear();
    this.globalConfig = {};
  }
}

// Export singleton
export const moduleRegistry = ModuleRegistry.getInstance();
export { ModuleRegistry };
export default moduleRegistry;
