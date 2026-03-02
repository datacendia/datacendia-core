/**
 * API Routes — Data Sources
 *
 * Express route handler defining REST endpoints.
 * @module routes/dataSources
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { testDataSourceConnection } from '../services/connectors/index.js';
import { ingestPostgresDataSourceToGraph } from '../services/graphIngestion.js';

const router = Router();

const dbTimeout = <T>(promise: Promise<T>, ms: number = 2500): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), ms)),
  ]);

const isDatabaseUnavailableError = (err: unknown): boolean => {
  if (!err || typeof err !== 'object') return false;
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("Can't reach database server") ||
    message.includes('ECONNREFUSED') ||
    message.includes('DB_TIMEOUT')
  );
};

router.use(devAuth);

const dataSourceSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'POSTGRESQL', 'MYSQL', 'SNOWFLAKE', 'BIGQUERY',
    'SALESFORCE', 'SAP', 'ORACLE', 'MONGODB',
    'REST_API', 'GRAPHQL', 'CSV_UPLOAD'
  ]),
  config: z.record(z.unknown()),
  syncSchedule: z.string().optional(),
});

const updateDataSourceSchema = z.object({
  name: z.string().min(1).optional(),
  config: z.record(z.unknown()).optional(),
  credentials: z.record(z.unknown()).optional(),
  syncSchedule: z.string().optional(),
});

/**
 * GET /api/v1/data-sources
 * List data sources
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSources = await dbTimeout(
      prisma.data_sources.findMany({
        where: { organization_id: req.organizationId! },
        orderBy: { name: 'asc' },
      })
    );

    // Remove sensitive credentials from response
    const sanitized = dataSources.map(ds => ({
      ...ds,
      credentials: undefined,
      config: {
        ...(ds.config as object),
        password: undefined,
        apiKey: undefined,
        secret: undefined,
      },
    }));

    res.json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_UNAVAILABLE',
          message: 'Database is unavailable. Please start Postgres and try again.',
        },
      });
      return;
    }
    next(error);
  }
});

/**
 * PUT /api/v1/data-sources/:id
 * Update existing data source (config + credentials)
 */
router.put('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) {
      throw errors.badRequest('Data source id is required');
    }

    const dataSource = await prisma.data_sources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const { name, config, credentials, syncSchedule } = updateDataSourceSchema.parse(req.body);

    const rawCredentials = (credentials || {}) as Record<string, unknown>;
    const { password, apiKey, secret, ...safeConfig } = (config || dataSource.config || {}) as Record<string, unknown>;

    const existingCredentials = (dataSource.credentials || {}) as Record<string, unknown>;

    const mergedCredentials = {
      ...existingCredentials,
      ...rawCredentials,
      password: rawCredentials['password'] ?? existingCredentials['password'] ?? password,
      apiKey: rawCredentials['apiKey'] ?? existingCredentials['apiKey'] ?? apiKey,
      secret: rawCredentials['secret'] ?? existingCredentials['secret'] ?? secret,
    };

    const updated = await prisma.data_sources.update({
      where: { id },
      data: {
        name: name ?? dataSource.name,
        config: (config ? safeConfig : dataSource.config) as Prisma.InputJsonValue,
        credentials: mergedCredentials as Prisma.InputJsonValue,
        sync_schedule: syncSchedule ?? dataSource.sync_schedule,
      },
    });

    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'data_source.update',
        resource_type: 'data_source',
        resource_id: updated.id,
        details: { name: updated.name, type: updated.type } as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: {
        ...updated,
        credentials: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/data-sources/:id
 * Get single data source
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) {
      throw errors.badRequest('Data source id is required');
    }
    const dataSource = await prisma.data_sources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: {
        ...dataSource,
        credentials: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources
 * Create data source
 */
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = dataSourceSchema.parse(req.body);
    const { name, type, config, syncSchedule } = parsed;
    const orgId = req.organizationId!;

    const rawCredentials = (req.body.credentials || {}) as Record<string, unknown>;

    // Extract secrets from config while also honoring explicit credentials payload
    const { password, apiKey, secret, ...safeConfig } = config as Record<string, unknown>;

    const credentials = {
      ...rawCredentials,
      password: rawCredentials['password'] ?? password,
      apiKey: rawCredentials['apiKey'] ?? apiKey,
      secret: rawCredentials['secret'] ?? secret,
    };

    const dataSource = await prisma.data_sources.create({
      data: {
        id: uuidv4(),
        organization_id: orgId,
        name,
        type,
        config: safeConfig as Prisma.InputJsonValue,
        credentials: credentials as Prisma.InputJsonValue,
        sync_schedule: syncSchedule ?? null,
        status: 'PENDING',
        updated_at: new Date(),
      },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'data_source.create',
        resource_type: 'data_source',
        resource_id: dataSource.id,
        details: { name, type } as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...dataSource,
        credentials: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources/test
 * Test connection without saving (for new data sources)
 */
router.post('/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, config, credentials } = req.body;
    
    if (!type) {
      res.status(400).json({
        success: false,
        error: 'Type is required',
      });
      return;
    }
    
    const result = await testDataSourceConnection(
      type,
      config || {},
      credentials || {}
    );
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * POST /api/v1/data-sources/:id/test
 * Test connection for existing data source
 */
router.post('/:id/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) {
      throw errors.badRequest('Data source id is required');
    }
    const dataSource = await prisma.data_sources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Test connection based on type
    const config = dataSource.config as Record<string, unknown>;
    const credentials = dataSource.credentials as Record<string, string>;
    const result = await testDataSourceConnection(dataSource.type, config, credentials);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources/:id/sync
 * Trigger sync
 */
router.post('/:id/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) {
      throw errors.badRequest('Data source id is required');
    }
    const dataSource = await prisma.data_sources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Update status
    await prisma.data_sources.update({
      where: { id },
      data: { status: 'SYNCING' },
    });

    // Run sync in background
    syncDataSource(dataSource).catch(err => {
      logger.error('Data source sync failed:', err);
    });

    res.json({
      success: true,
      data: { message: 'Sync started' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/data-sources/:id
 * Delete data source
 */
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) {
      throw errors.badRequest('Data source id is required');
    }
    const dataSource = await prisma.data_sources.findUnique({
      where: { id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    await prisma.data_sources.delete({
      where: { id },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'data_source.delete',
        resource_type: 'data_source',
        resource_id: id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Data source deleted' },
    });
  } catch (error) {
    next(error);
  }
});

// Test connection is now handled by the imported testDataSourceConnection from connectors

// Sync data source
async function syncDataSource(dataSource: {
  id: string;
  type: string;
  organization_id: string;
  config: unknown;
  credentials: unknown;
}) {
  try {
    // For PostgreSQL sources, ingest schema into the Neo4j graph
    if (dataSource.type === 'POSTGRESQL') {
      try {
        const config = (dataSource.config || {}) as Record<string, unknown>;
        const credentials = (dataSource.credentials || {}) as Record<string, unknown>;

        await ingestPostgresDataSourceToGraph({
          dataSourceId: dataSource.id,
          organizationId: dataSource.organization_id,
          config,
          credentials,
        });
      } catch (ingestError) {
        logger.error('Postgres graph ingestion failed during data source sync', {
          dataSourceId: dataSource.id,
          error:
            ingestError instanceof Error
              ? ingestError.message
              : 'Unknown ingestion error',
        });
        // Continue to update sync status below even if ingestion fails
        throw ingestError;
      }
    } else {
      throw new Error(`Sync not implemented for data source type: ${dataSource.type}`);
    }

    await prisma.data_sources.update({
      where: { id: dataSource.id },
      data: {
        status: 'CONNECTED',
        last_sync_at: new Date(),
        last_sync_status: 'success',
      },
    });

  } catch (error) {
    logger.error('Sync error:', error);

    await prisma.data_sources.update({
      where: { id: dataSource.id },
      data: {
        status: 'ERROR',
        last_sync_status: error instanceof Error ? error.message : 'Sync failed',
      },
    });
  }
}

export default router;
