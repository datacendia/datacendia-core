// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PLATFORM API ROUTES
// Health, metrics, and system information endpoints
// =============================================================================

import { Router, Request, Response } from 'express';
import { serviceRegistry } from '../core/services/ServiceRegistry.js';
import { moduleRegistry } from '../core/modules/ModuleRegistry.js';
import { eventBus } from '../core/events/EventBus.js';
import {
  PLATFORM_TIERS,
  PLATFORM_PILLARS,
  getPillarsForTier,
  getServicesForTier,
  getServiceCountByTier,
  getTotalServiceCount,
  getAllPillarIds,
  getAllTierIds,
  getPlatformSummary,
} from '../core/PlatformCatalog.js';
import type { PlatformTier, PillarId } from '../core/PlatformCatalog.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// HEALTH ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/health
 * Overall platform health check
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const [serviceHealth, moduleHealth] = await Promise.all([
      serviceRegistry.healthCheckAll(),
      moduleRegistry.healthCheckAll(),
    ]);

    const overall = 
      serviceHealth.status === 'healthy' && 
      Object.values(moduleHealth).every(h => h.status === 'healthy')
        ? 'healthy'
        : serviceHealth.status === 'unhealthy' || 
          Object.values(moduleHealth).some(h => h.status === 'unhealthy')
          ? 'unhealthy'
          : 'degraded';

    res.json({
      status: overall,
      timestamp: new Date().toISOString(),
      services: serviceHealth,
      modules: moduleHealth,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error: unknown) {
    res.status(500).json({
      status: 'unhealthy',
      error: getErrorMessage(error),
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/v1/platform/health/live
 * Kubernetes liveness probe
 */
router.get('/health/live', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /api/v1/platform/health/ready
 * Kubernetes readiness probe
 */
router.get('/health/ready', async (req: Request, res: Response) => {
  try {
    const serviceHealth = await serviceRegistry.healthCheckAll();
    
    if (serviceHealth.status === 'unhealthy') {
      return res.status(503).json({
        status: 'not_ready',
        reason: 'One or more services are unhealthy',
        services: serviceHealth.services,
      });
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: serviceHealth.healthyServices,
    });
  } catch (error: unknown) {
    res.status(503).json({
      status: 'not_ready',
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// METRICS ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/metrics
 * Platform metrics in JSON format
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const serviceMetrics = serviceRegistry.getMetricsAll();
    const eventStats = eventBus.getStats();

    res.json({
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      services: serviceMetrics,
      events: eventStats,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/platform/metrics/prometheus
 * Prometheus format metrics
 */
router.get('/metrics/prometheus', (req: Request, res: Response) => {
  try {
    const serviceMetrics = serviceRegistry.getMetricsAll();
    const eventStats = eventBus.getStats();
    const mem = process.memoryUsage();

    let output = '';
    
    // Process metrics
    output += `# HELP process_uptime_seconds Process uptime in seconds\n`;
    output += `# TYPE process_uptime_seconds gauge\n`;
    output += `process_uptime_seconds ${process.uptime()}\n\n`;

    output += `# HELP process_memory_heap_bytes Process heap memory in bytes\n`;
    output += `# TYPE process_memory_heap_bytes gauge\n`;
    output += `process_memory_heap_bytes ${mem.heapUsed}\n\n`;

    // Service metrics
    output += `# HELP service_requests_total Total service requests\n`;
    output += `# TYPE service_requests_total counter\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_requests_total{service="${name}"} ${metrics.requestCount}\n`;
    }
    output += '\n';

    output += `# HELP service_errors_total Total service errors\n`;
    output += `# TYPE service_errors_total counter\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_errors_total{service="${name}"} ${metrics.errorCount}\n`;
    }
    output += '\n';

    output += `# HELP service_latency_avg_ms Average service latency in ms\n`;
    output += `# TYPE service_latency_avg_ms gauge\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_latency_avg_ms{service="${name}"} ${metrics.avgLatency.toFixed(2)}\n`;
    }
    output += '\n';

    // Event metrics
    output += `# HELP events_published_total Total events published\n`;
    output += `# TYPE events_published_total counter\n`;
    output += `events_published_total ${eventStats.totalPublished}\n\n`;

    output += `# HELP events_delivered_total Total events delivered\n`;
    output += `# TYPE events_delivered_total counter\n`;
    output += `events_delivered_total ${eventStats.totalDelivered}\n\n`;

    res.set('Content-Type', 'text/plain');
    res.send(output);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// SYSTEM INFO ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/info
 * Platform information
 */
router.get('/info', (req: Request, res: Response) => {
  res.json({
    name: 'Datacendia Platform',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    pid: process.pid,
  });
});

/**
 * GET /api/v1/platform/services
 * List registered services
 */
router.get('/services', (req: Request, res: Response) => {
  const states = serviceRegistry.getStateAll();
  const services = serviceRegistry.getServiceNames().map(name => ({
    name,
    ...states[name],
  }));
  
  res.json({
    count: services.length,
    services,
  });
});

/**
 * GET /api/v1/platform/modules
 * List registered modules
 */
router.get('/modules', (req: Request, res: Response) => {
  const modules = moduleRegistry.getLoadedModules().map(m => ({
    id: m.definition.id,
    name: m.definition.name,
    version: m.definition.version,
    status: m.state.status,
    loadedAt: m.state.loadedAt,
  }));

  res.json({
    count: modules.length,
    modules,
  });
});

/**
 * GET /api/v1/platform/events
 * Event bus information
 */
router.get('/events', (req: Request, res: Response) => {
  const stats = eventBus.getStats();
  const subscriptions = eventBus.getSubscriptions();
  
  const subscriptionsSummary: Record<string, number> = {};
  for (const [eventType, subs] of subscriptions) {
    subscriptionsSummary[eventType] = subs.length;
  }

  res.json({
    stats,
    subscriptions: subscriptionsSummary,
    deadLetterQueueSize: eventBus.getDeadLetterQueue().length,
  });
});

/**
 * GET /api/v1/platform/events/history
 * Recent event history
 */
router.get('/events/history', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const type = req.query.type as string | undefined;
  
  const events = eventBus.getHistory({ type, limit });
  
  res.json({
    count: events.length,
    events: events.map(e => ({
      id: e.id,
      type: e.type,
      source: e.source,
      timestamp: e.timestamp,
      correlationId: e.correlationId,
    })),
  });
});

// =============================================================================
// PLATFORM CATALOG — 3-Tier Architecture Endpoints
// =============================================================================

/**
 * GET /api/v1/platform/catalog
 * Complete platform catalog — 3 tiers, 12 pillars, all services
 */
router.get('/catalog', (req: Request, res: Response) => {
  res.json(getPlatformSummary());
});

/**
 * GET /api/v1/platform/catalog/tiers
 * All tier definitions with pricing
 */
router.get('/catalog/tiers', (req: Request, res: Response) => {
  const tiers = getAllTierIds().map(tid => {
    const tier = PLATFORM_TIERS[tid];
    const pillars = getPillarsForTier(tid);
    return {
      id: tier.id,
      name: tier.name,
      tagline: tier.tagline,
      description: tier.description,
      pricing: tier.pricing,
      color: tier.color,
      icon: tier.icon,
      pillarCount: pillars.length,
      serviceCount: pillars.reduce((s, p) => s + p.services.length, 0),
      pillars: pillars.map(p => ({ id: p.id, name: p.displayName, tagline: p.tagline })),
    };
  });

  res.json({ tierCount: tiers.length, tiers });
});

/**
 * GET /api/v1/platform/catalog/tiers/:tierId
 * Single tier with full pillar and service details
 */
router.get('/catalog/tiers/:tierId', (req: Request, res: Response) => {
  const tierId = req.params.tierId as PlatformTier;
  const tier = PLATFORM_TIERS[tierId];
  if (!tier) {
    return res.status(404).json({ error: `Tier '${tierId}' not found. Valid tiers: foundation, enterprise, strategic` });
  }

  const pillars = getPillarsForTier(tierId);
  res.json({
    ...tier,
    pillars: pillars.map(p => ({
      id: p.id,
      name: p.displayName,
      tagline: p.tagline,
      description: p.description,
      icon: p.icon,
      color: p.color,
      serviceCount: p.services.length,
      services: p.services,
    })),
  });
});

/**
 * GET /api/v1/platform/catalog/pillars
 * All 12 pillars with their tier assignments
 */
router.get('/catalog/pillars', (req: Request, res: Response) => {
  const pillars = getAllPillarIds().map(pid => {
    const p = PLATFORM_PILLARS[pid];
    return {
      id: p.id,
      tier: p.tier,
      name: p.displayName,
      tagline: p.tagline,
      description: p.description,
      icon: p.icon,
      color: p.color,
      serviceCount: p.services.length,
    };
  });

  res.json({ pillarCount: pillars.length, pillars });
});

/**
 * GET /api/v1/platform/catalog/pillars/:pillarId
 * Single pillar with full service details
 */
router.get('/catalog/pillars/:pillarId', (req: Request, res: Response) => {
  const pillarId = req.params.pillarId as PillarId;
  const pillar = PLATFORM_PILLARS[pillarId];
  if (!pillar) {
    return res.status(404).json({ error: `Pillar '${pillarId}' not found.` });
  }

  res.json({
    id: pillar.id,
    tier: pillar.tier,
    name: pillar.displayName,
    tagline: pillar.tagline,
    description: pillar.description,
    icon: pillar.icon,
    color: pillar.color,
    serviceCount: pillar.services.length,
    services: pillar.services,
  });
});

/**
 * GET /api/v1/platform/catalog/stats
 * Service count statistics
 */
router.get('/catalog/stats', (req: Request, res: Response) => {
  const countByTier = getServiceCountByTier();
  res.json({
    totalServices: getTotalServiceCount(),
    totalPillars: getAllPillarIds().length,
    totalTiers: 3,
    servicesByTier: countByTier,
  });
});

export default router;
