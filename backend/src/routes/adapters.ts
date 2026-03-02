// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * SOVEREIGN ADAPTER API ROUTES
 * =============================================================================
 * REST API for managing universal adapters.
 * 
 * Endpoints:
 * - GET  /types              - List available adapter types
 * - GET  /instances          - List running adapter instances
 * - POST /create             - Create new adapter instance
 * - GET  /:id/health         - Get adapter health
 * - GET  /:id/metrics        - Get adapter metrics
 * - POST /:id/start          - Start an adapter
 * - POST /:id/stop           - Stop an adapter
 * - DELETE /:id              - Destroy an adapter
 * - GET  /health             - Get all adapter health
 * - GET  /metrics            - Get all adapter metrics
 * 
 * Webhook endpoints (mounted separately):
 * - POST /webhook/ingest/:sourceId - Receive webhook events
 */

import { Router, Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import {
  adapterManager,
  adapterRegistry,
  RiskTier,
  DataClassification,
  WebhookIngestAdapter,
} from '../adapters/sovereign/index.js';

const router = Router();

// =============================================================================
// MIDDLEWARE
// =============================================================================

/**
 * Require admin role for management operations
 */
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Production upgrade: integrate with Keycloak/auth system
  const role = req.headers['x-user-role'] as string;
  if (!role || !['admin', 'super_admin'].includes(role)) {
    res.status(403).json({
      error: 'Admin access required',
      message: 'Only admin users can manage adapters',
    });
    return;
  }
  next();
};

/**
 * Require auditor role for read-only operations
 */
const requireAuditor = (req: Request, res: Response, next: NextFunction): void => {
  const role = req.headers['x-user-role'] as string;
  if (!role || !['admin', 'super_admin', 'auditor'].includes(role)) {
    res.status(403).json({
      error: 'Auditor access required',
      message: 'Only auditor or admin users can view adapter details',
    });
    return;
  }
  next();
};

// =============================================================================
// ADAPTER TYPE ROUTES
// =============================================================================

/**
 * List available adapter types
 */
router.get('/types', (req, res) => {
  const types = adapterManager.listTypes();
  
  res.json({
    count: types.length,
    types: types.map(t => ({
      ...t,
      riskTierLabel: RiskTier[t.riskTier],
    })),
  });
});

/**
 * Get details for a specific adapter type
 */
router.get('/types/:type', (req, res) => {
  const types = adapterManager.listTypes();
  const type = types.find(t => t.type === req.params.type);

  if (!type) {
    res.status(404).json({ error: 'Adapter type not found' });
    return;
  }

  res.json({
    ...type,
    riskTierLabel: RiskTier[type.riskTier],
    documentation: getAdapterDocumentation(req.params.type),
  });
});

// =============================================================================
// ADAPTER INSTANCE ROUTES
// =============================================================================

/**
 * List all running adapter instances
 */
router.get('/instances', requireAuditor, (req, res) => {
  const instances = adapterManager.listInstances();
  
  res.json({
    count: instances.length,
    instances,
  });
});

/**
 * Create a new adapter instance
 */
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const { type, config } = req.body;

    if (!type) {
      res.status(400).json({ error: 'Adapter type is required' });
      return;
    }

    // Validate risk tier access
    const types = adapterManager.listTypes();
    const adapterType = types.find(t => t.type === type);
    
    if (!adapterType) {
      res.status(400).json({ error: `Unknown adapter type: ${type}` });
      return;
    }

    // Restricted adapters require explicit acknowledgment
    if (adapterType.riskTier === RiskTier.RESTRICTED) {
      if (!config?.acknowledgeRestricted) {
        res.status(400).json({
          error: 'Restricted adapter requires acknowledgment',
          message: 'Set acknowledgeRestricted: true in config to proceed',
          riskTier: 'RESTRICTED',
          warnings: [
            'This adapter may handle export-controlled data',
            'Requires explicit customer attestation',
            'On-prem deployment recommended',
          ],
        });
        return;
      }
    }

    // Create the adapter
    const adapter = adapterManager.create(type, config || {});
    
    // Log creation for audit
    logger.info(`[AUDIT] Adapter created: ${adapter['config'].id} (type: ${type}) by ${req.headers['x-user-id'] || 'unknown'}`);

    res.status(201).json({
      success: true,
      id: adapter['config'].id,
      type,
      riskTier: RiskTier[adapterType.riskTier],
      message: 'Adapter created. Call POST /start to begin operation.',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create adapter',
      message: (error as Error).message,
    });
  }
});

/**
 * Start an adapter
 */
router.post('/:id/start', requireAdmin, async (req, res) => {
  try {
    const adapter = adapterManager.get(req.params.id);
    
    if (!adapter) {
      res.status(404).json({ error: 'Adapter not found' });
      return;
    }

    await adapter.start();

    res.json({
      success: true,
      id: req.params.id,
      status: 'started',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to start adapter',
      message: (error as Error).message,
    });
  }
});

/**
 * Stop an adapter
 */
router.post('/:id/stop', requireAdmin, async (req, res) => {
  try {
    const adapter = adapterManager.get(req.params.id);
    
    if (!adapter) {
      res.status(404).json({ error: 'Adapter not found' });
      return;
    }

    await adapter.stop();

    res.json({
      success: true,
      id: req.params.id,
      status: 'stopped',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to stop adapter',
      message: (error as Error).message,
    });
  }
});

/**
 * Get adapter health
 */
router.get('/:id/health', requireAuditor, async (req, res) => {
  try {
    const adapter = adapterManager.get(req.params.id);
    
    if (!adapter) {
      res.status(404).json({ error: 'Adapter not found' });
      return;
    }

    const health = await adapter.healthCheck();

    res.json({
      id: req.params.id,
      health,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get health',
      message: (error as Error).message,
    });
  }
});

/**
 * Get adapter metrics
 */
router.get('/:id/metrics', requireAuditor, (req, res) => {
  const adapter = adapterManager.get(req.params.id);
  
  if (!adapter) {
    res.status(404).json({ error: 'Adapter not found' });
    return;
  }

  const metrics = adapter.getMetrics();

  res.json({
    id: req.params.id,
    metrics,
  });
});

/**
 * Get adapter capabilities
 */
router.get('/:id/capabilities', requireAuditor, (req, res) => {
  const adapter = adapterManager.get(req.params.id);
  
  if (!adapter) {
    res.status(404).json({ error: 'Adapter not found' });
    return;
  }

  res.json({
    id: req.params.id,
    capabilities: adapter.getCapabilities(),
    riskTier: RiskTier[adapter.getRiskTier()],
  });
});

/**
 * Destroy an adapter
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const adapter = adapterManager.get(req.params.id);
    
    if (!adapter) {
      res.status(404).json({ error: 'Adapter not found' });
      return;
    }

    await adapterManager.destroy(req.params.id);

    // Log destruction for audit
    logger.info(`[AUDIT] Adapter destroyed: ${req.params.id} by ${req.headers['x-user-id'] || 'unknown'}`);

    res.json({
      success: true,
      id: req.params.id,
      status: 'destroyed',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to destroy adapter',
      message: (error as Error).message,
    });
  }
});

// =============================================================================
// AGGREGATE ROUTES
// =============================================================================

/**
 * Get health for all adapters
 */
router.get('/health', requireAuditor, async (req, res) => {
  try {
    const health = await adapterManager.getAllHealth();

    res.json({
      timestamp: new Date().toISOString(),
      adapters: health,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get health',
      message: (error as Error).message,
    });
  }
});

/**
 * Get metrics for all adapters
 */
router.get('/metrics', requireAuditor, (req, res) => {
  const metrics = adapterManager.getAllMetrics();

  res.json({
    timestamp: new Date().toISOString(),
    adapters: metrics,
  });
});

// =============================================================================
// WEBHOOK ROUTES
// =============================================================================

/**
 * Get webhook adapter router for mounting
 * Usage: app.use('/api/v1/adapters/webhook', getWebhookRouter('webhook-main'));
 */
export function getWebhookRouter(adapterId: string): Router | null {
  const adapter = adapterManager.get(adapterId);
  
  if (adapter instanceof WebhookIngestAdapter) {
    return adapter.getRouter();
  }

  return null;
}

// =============================================================================
// DOCUMENTATION HELPER
// =============================================================================

function getAdapterDocumentation(type: string): object {
  const docs: Record<string, object> = {
    'file-watcher': {
      description: 'Watch directories for new files and ingest them automatically',
      useCases: [
        'Avionics data exports (flight logs)',
        'Defense system outputs',
        'Legacy batch file processing',
      ],
      configExample: {
        watchPaths: ['/data/incoming'],
        filePatterns: ['*.json', '*.csv'],
        quarantinePath: '/data/quarantine',
        processedPath: '/data/processed',
      },
    },
    'webhook': {
      description: 'Receive push events from external systems',
      useCases: [
        'SaaS integrations',
        'Financial gateway notifications',
        'IoT device events',
      ],
      configExample: {
        hmacSecret: 'your-webhook-secret',
        apiKeys: ['key1', 'key2'],
        rateLimitPerMinute: 1000,
      },
    },
    'database': {
      description: 'Poll databases for new or updated records',
      useCases: [
        'ERP integrations',
        'Supply chain data',
        'Client reporting views',
      ],
      configExample: {
        databaseType: 'postgresql',
        host: 'client-db.internal',
        database: 'reporting',
        queries: [
          { id: 'orders', sql: 'SELECT * FROM orders WHERE updated_at > $1', watermarkColumn: 'updated_at' },
        ],
      },
    },
    'fhir': {
      description: 'Connect to FHIR R4 servers for healthcare data',
      useCases: [
        'Patient data integration',
        'Clinical observations',
        'Healthcare interoperability',
      ],
      configExample: {
        fhirServerUrl: 'https://fhir.example.com',
        fhirVersion: 'R4',
        authType: 'smart',
        clientId: 'your-client-id',
        scope: 'system/*.read',
      },
      note: 'For Epic/Cerner, use their FHIR endpoints - NOT proprietary APIs',
    },
    'fix': {
      description: 'FIX protocol for financial messaging',
      useCases: [
        'Order execution reports',
        'Market data feeds',
        'Trading notifications',
      ],
      configExample: {
        fixVersion: '4.4',
        senderCompId: 'DATACENDIA',
        targetCompId: 'EXCHANGE',
        host: 'fix.exchange.com',
        port: 9878,
      },
      note: 'Standard FIX only - NOT Bloomberg/Refinitiv proprietary',
    },
    'mqtt': {
      description: 'MQTT for IoT and energy grid data',
      useCases: [
        'Energy grid sensors',
        'Industrial IoT',
        'Real-time telemetry',
      ],
      configExample: {
        brokerUrl: 'mqtt://broker.example.com:1883',
        topics: ['sensors/#', 'grid/+/status'],
        qos: 1,
      },
    },
  };

  return docs[type] || { description: 'No documentation available' };
}

// =============================================================================
// EXPORT
// =============================================================================

export default router;
