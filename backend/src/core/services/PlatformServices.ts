// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - SERVICE REGISTRATIONS
// Registers all platform features as monitored services
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from './BaseService.js';
import { serviceRegistry } from './ServiceRegistry.js';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { neo4j } from '../../config/neo4j.js';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// DATABASE SERVICE
// =============================================================================

class DatabaseService extends BaseService {
  constructor() {
    super({
      name: 'database',
      version: '1.0.0',
      dependencies: [],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Database service initializing...');
    await prisma.$connect();
  }

  async shutdown(): Promise<void> {
    this.logger.info('Database service shutting down...');
    await prisma.$disconnect();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { database: 'postgresql' },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// REDIS SERVICE
// =============================================================================

class RedisService extends BaseService {
  constructor() {
    super({
      name: 'redis',
      version: '1.0.0',
      dependencies: [],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Redis service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Redis service shutting down...');
    await redis.quit();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await redis.ping();
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// NEO4J SERVICE (The Graph)
// =============================================================================

class GraphService extends BaseService {
  constructor() {
    super({
      name: 'graph',
      version: '1.0.0',
      dependencies: [],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Graph service (Neo4j) initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Graph service shutting down...');
    await neo4j.close();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const session = neo4j.session();
      await session.run('RETURN 1');
      await session.close();
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { database: 'neo4j' },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// COUNCIL SERVICE (AI Agents)
// =============================================================================

class CouncilService extends BaseService {
  constructor() {
    super({
      name: 'council',
      version: '1.0.0',
      dependencies: ['database'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Council service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Council service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      // Check Ollama connectivity
      const response = await fetch('http://127.0.0.1:11434/api/tags');
      const data = await response.json() as { models?: any[] };
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { 
          ollama: 'connected',
          models: data.models?.length || 0,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'degraded',
        lastCheck: new Date(),
        latency: Date.now() - start,
        errors: ['Ollama not reachable'],
        details: { ollama: 'disconnected' },
      };
    }
  }
}

// =============================================================================
// PREDICT SERVICE (Forecasting)
// =============================================================================

class PredictService extends BaseService {
  constructor() {
    super({
      name: 'predict',
      version: '1.0.0',
      dependencies: ['database'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Predict service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Predict service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { forecasting: 'ready' },
    };
  }
}

// =============================================================================
// FLOW SERVICE (Workflows)
// =============================================================================

class FlowService extends BaseService {
  constructor() {
    super({
      name: 'flow',
      version: '1.0.0',
      dependencies: ['database'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Flow service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Flow service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const count = await prisma.workflows.count();
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { workflows: count },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// LINEAGE SERVICE
// =============================================================================

class LineageService extends BaseService {
  constructor() {
    super({
      name: 'lineage',
      version: '1.0.0',
      dependencies: ['graph'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Lineage service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Lineage service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { tracking: 'active' },
    };
  }
}

// =============================================================================
// BRIDGE SERVICE (Integrations)
// =============================================================================

class BridgeService extends BaseService {
  constructor() {
    super({
      name: 'bridge',
      version: '1.0.0',
      dependencies: ['database'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Bridge service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Bridge service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const count = await prisma.data_sources.count({ where: { status: 'CONNECTED' } });
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { connectedSources: count },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// PULSE SERVICE (Alerts & Metrics)
// =============================================================================

class PulseService extends BaseService {
  constructor() {
    super({
      name: 'pulse',
      version: '1.0.0',
      dependencies: ['database', 'redis'],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Pulse service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Pulse service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const activeAlerts = await prisma.alerts.count({ where: { status: 'ACTIVE' } });
      return {
        status: 'healthy',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { activeAlerts },
      };
    } catch (error: unknown) {
      return {
        status: 'unhealthy',
        lastCheck: new Date(),
        errors: [getErrorMessage(error)],
      };
    }
  }
}

// =============================================================================
// REGISTER ALL SERVICES
// =============================================================================

export async function registerPlatformServices(): Promise<void> {
  logger.info('[Platform] Registering platform services...');

  // Core infrastructure services
  const dbService = new DatabaseService();
  serviceRegistry.register('database', dbService, { priority: 1 });
  await dbService.start();

  const redisService = new RedisService();
  serviceRegistry.register('redis', redisService, { priority: 2 });
  await redisService.start();

  const graphService = new GraphService();
  serviceRegistry.register('graph', graphService, { priority: 3 });
  await graphService.start();

  // Platform feature services
  const councilService = new CouncilService();
  serviceRegistry.register('council', councilService, { priority: 10 });
  await councilService.start();

  const predictService = new PredictService();
  serviceRegistry.register('predict', predictService, { priority: 10 });
  await predictService.start();

  const flowService = new FlowService();
  serviceRegistry.register('flow', flowService, { priority: 10 });
  await flowService.start();

  const lineageService = new LineageService();
  serviceRegistry.register('lineage', lineageService, { priority: 11 });
  await lineageService.start();

  const bridgeService = new BridgeService();
  serviceRegistry.register('bridge', bridgeService, { priority: 10 });
  await bridgeService.start();

  const pulseService = new PulseService();
  serviceRegistry.register('pulse', pulseService, { priority: 10 });
  await pulseService.start();

  logger.info(`[Platform] Registered ${serviceRegistry.getServiceCount()} services`);
}

export {
  DatabaseService,
  RedisService,
  GraphService,
  CouncilService,
  PredictService,
  FlowService,
  LineageService,
  BridgeService,
  PulseService,
};
