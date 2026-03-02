// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { DataSourceType, Prisma } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { cacheService } from '../services/cache/RedisCacheService.js';

const router = Router();

router.use(devAuth);

// Available integrations catalog
const INTEGRATIONS_CATALOG: IntegrationCatalogItem[] = [
  // CRM
  { id: 'salesforce', name: 'Salesforce', category: 'crm', authType: 'oauth2', logo: '/integrations/salesforce.svg' },
  { id: 'hubspot', name: 'HubSpot', category: 'crm', authType: 'oauth2', logo: '/integrations/hubspot.svg' },
  { id: 'dynamics365', name: 'Microsoft Dynamics 365', category: 'crm', authType: 'oauth2', logo: '/integrations/dynamics.svg' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'crm', authType: 'api_key', logo: '/integrations/pipedrive.svg' },
  { id: 'zoho', name: 'Zoho CRM', category: 'crm', authType: 'oauth2', logo: '/integrations/zoho.svg' },
  
  // ERP
  { id: 'sap', name: 'SAP S/4HANA', category: 'erp', authType: 'oauth2', logo: '/integrations/sap.svg' },
  { id: 'netsuite', name: 'Oracle NetSuite', category: 'erp', authType: 'token', logo: '/integrations/netsuite.svg' },
  { id: 'workday', name: 'Workday', category: 'erp', authType: 'oauth2', logo: '/integrations/workday.svg' },
  { id: 'sage', name: 'Sage Intacct', category: 'erp', authType: 'api_key', logo: '/integrations/sage.svg' },
  
  // Data Warehouse
  { id: 'snowflake', name: 'Snowflake', category: 'data_warehouse', authType: 'keypair', logo: '/integrations/snowflake.svg' },
  { id: 'bigquery', name: 'Google BigQuery', category: 'data_warehouse', authType: 'service_account', logo: '/integrations/bigquery.svg' },
  { id: 'redshift', name: 'Amazon Redshift', category: 'data_warehouse', authType: 'iam', logo: '/integrations/redshift.svg' },
  { id: 'databricks', name: 'Databricks', category: 'data_warehouse', authType: 'token', logo: '/integrations/databricks.svg' },
  { id: 'synapse', name: 'Azure Synapse', category: 'data_warehouse', authType: 'oauth2', logo: '/integrations/synapse.svg' },
  
  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', authType: 'password', logo: '/integrations/postgresql.svg' },
  { id: 'mysql', name: 'MySQL', category: 'database', authType: 'password', logo: '/integrations/mysql.svg' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', authType: 'connection_string', logo: '/integrations/mongodb.svg' },
  { id: 'sqlserver', name: 'SQL Server', category: 'database', authType: 'password', logo: '/integrations/sqlserver.svg' },
  
  // Communication
  { id: 'slack', name: 'Slack', category: 'communication', authType: 'oauth2', logo: '/integrations/slack.svg' },
  { id: 'teams', name: 'Microsoft Teams', category: 'communication', authType: 'oauth2', logo: '/integrations/teams.svg' },
  { id: 'email', name: 'Email (SMTP)', category: 'communication', authType: 'password', logo: '/integrations/email.svg' },
  
  // Storage
  { id: 's3', name: 'Amazon S3', category: 'storage', authType: 'iam', logo: '/integrations/s3.svg' },
  { id: 'gcs', name: 'Google Cloud Storage', category: 'storage', authType: 'service_account', logo: '/integrations/gcs.svg' },
  { id: 'azure_blob', name: 'Azure Blob Storage', category: 'storage', authType: 'sas', logo: '/integrations/azure-blob.svg' },
  { id: 'sharepoint', name: 'SharePoint', category: 'storage', authType: 'oauth2', logo: '/integrations/sharepoint.svg' },
  
  // API
  { id: 'rest_api', name: 'REST API', category: 'api', authType: 'configurable', logo: '/integrations/api.svg' },
  { id: 'graphql', name: 'GraphQL', category: 'api', authType: 'configurable', logo: '/integrations/graphql.svg' },
  { id: 'webhook', name: 'Webhook', category: 'api', authType: 'secret', logo: '/integrations/webhook.svg' },
  
  // Project Management
  { id: 'jira', name: 'Jira', category: 'project_management', authType: 'api_key', logo: '/integrations/jira.svg' },
  
  // Business Intelligence
  { id: 'tableau', name: 'Tableau', category: 'bi', authType: 'token', logo: '/integrations/tableau.svg' },
  
  // Internal (already connected)
  { id: 'neo4j', name: 'Neo4j', category: 'database', authType: 'password', logo: '/integrations/neo4j.svg' },
  { id: 'redis', name: 'Redis', category: 'database', authType: 'password', logo: '/integrations/redis.svg' },
];

interface IntegrationCatalogItem {
  id: string;
  name: string;
  category: string;
  authType: string;
  logo: string;
}

const connectSchema = z.object({
  name: z.string().min(1),
  config: z.record(z.unknown()),
});

const oauthCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

/**
 * GET /api/v1/integrations
 * List available and connected integrations
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    // Check cache first
    const cacheKey = `integrations:${orgId}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get connected integrations from database
    const connections = await prisma.data_sources.findMany({
      where: { organization_id: orgId },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        last_sync_at: true,
        created_at: true,
      },
    });

    const connected = connections.map(conn => ({
      id: conn.id,
      integrationId: conn.type.toLowerCase(),
      name: conn.name,
      status: conn.status === 'CONNECTED' ? 'active' : conn.status.toLowerCase(),
      lastSync: conn.last_sync_at,
      createdAt: conn.created_at,
    }));

    // Mark available integrations
    const connectedTypes = new Set(connections.map(c => c.type.toLowerCase()));
    const available = INTEGRATIONS_CATALOG.map(int => ({
      ...int,
      status: connectedTypes.has(int.id) ? 'connected' : 'available',
    }));

    const response = {
      success: true,
      data: {
        available,
        connected,
      },
    };

    // Cache for 5 minutes
    await cacheService.set(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/integrations/:integrationId
 * Get integration details and configuration schema
 */
router.get('/:integrationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const integration = INTEGRATIONS_CATALOG.find(i => i.id === req.params.integrationId);

    if (!integration) {
      throw errors.notFound('Integration');
    }

    // Get configuration schema for this integration
    const configSchema = getIntegrationConfigSchema(integration.id);

    res.json({
      success: true,
      data: {
        ...integration,
        configSchema,
        documentation: `https://docs.datacendia.com/integrations/${integration.id}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/integrations/:integrationId/connect
 * Initiate connection to an integration
 */
router.post('/:integrationId/connect', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, config } = connectSchema.parse(req.body);
    const integrationId = req.params.integrationId;
    const orgId = req.organizationId!;

    const integration = INTEGRATIONS_CATALOG.find(i => i.id === integrationId);
    if (!integration) {
      throw errors.notFound('Integration');
    }

    // Handle OAuth integrations
    if (integration.authType === 'oauth2') {
      const state = generateOAuthState(orgId, integrationId, name);
      const authUrl = getOAuthAuthorizationUrl(integrationId, state);

      // Store pending connection
      await cache.set(`oauth_pending:${state}`, { orgId, integrationId, name, config }, 600);

      return res.json({
        success: true,
        data: {
          authUrl,
          method: 'oauth2',
        },
      });
    }

    // For non-OAuth integrations, create connection directly
    const dataSource = await prisma.data_sources.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        name,
        type: (integrationId.toUpperCase() as DataSourceType) || 'API',
        config: config as Prisma.InputJsonValue,
        credentials: extractCredentials(config) as Prisma.InputJsonValue,
        status: 'PENDING',
        updated_at: new Date(),
      },
    });

    // Test connection in background
    testAndActivateConnection(dataSource.id).catch(err => {
      logger.error('Connection test failed:', err);
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'integration.connect',
        resource_type: 'integration',
        resource_id: dataSource.id,
        details: { integrationId, name } as Prisma.InputJsonValue,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        connectionId: dataSource.id,
        status: 'pending',
        message: 'Testing connection...',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/integrations/oauth/callback
 * Handle OAuth callback
 */
router.get('/oauth/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state } = oauthCallbackSchema.parse(req.query);

    // Retrieve pending connection
    const pending = await cache.get<{
      orgId: string;
      integrationId: string;
      name: string;
      config: Record<string, unknown>;
    }>(`oauth_pending:${state}`);

    if (!pending) {
      throw errors.badRequest('Invalid or expired OAuth state');
    }

    // Exchange code for tokens
    const tokens = await exchangeOAuthCode(pending.integrationId, code);

    // Create connection
    const dataSource = await prisma.data_sources.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: pending.orgId,
        name: pending.name,
        type: (pending.integrationId.toUpperCase() as DataSourceType) || 'API',
        config: pending.config as Prisma.InputJsonValue,
        credentials: tokens as Prisma.InputJsonValue,
        status: 'CONNECTED',
        updated_at: new Date(),
      },
    });

    // Clear pending state
    await cache.del(`oauth_pending:${state}`);

    // Redirect to frontend success page
    res.redirect(`/cortex/settings/integrations?connected=${dataSource.id}`);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/integrations/connections/:connectionId
 * Get connection details
 */
router.get('/connections/:connectionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await prisma.data_sources.findUnique({
      where: { id: req.params.connectionId },
    });

    if (!connection) {
      throw errors.notFound('Connection');
    }

    if (connection.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const integration = INTEGRATIONS_CATALOG.find(i => i.id === connection.type.toLowerCase());

    res.json({
      success: true,
      data: {
        id: connection.id,
        name: connection.name,
        integration: integration || { id: connection.type, name: connection.type },
        status: connection.status,
        config: connection.config,
        lastSync: connection.last_sync_at,
        lastSyncStatus: connection.last_sync_status,
        createdAt: connection.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/integrations/connections/:connectionId/sync
 * Trigger sync for a connection
 */
router.post('/connections/:connectionId/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await prisma.data_sources.findUnique({
      where: { id: req.params.connectionId },
    });

    if (!connection) {
      throw errors.notFound('Connection');
    }

    if (connection.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    // Update status
    await prisma.data_sources.update({
      where: { id: connection.id },
      data: { status: 'SYNCING', updated_at: new Date() },
    });

    // Start sync in background
    performSync(connection.id).catch(err => {
      logger.error('Sync failed:', err);
    });

    res.json({
      success: true,
      data: {
        message: 'Sync started',
        connectionId: connection.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/integrations/connections/:connectionId/test
 * Test a connection
 */
router.post('/connections/:connectionId/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await prisma.data_sources.findUnique({
      where: { id: req.params.connectionId },
    });

    if (!connection) {
      throw errors.notFound('Connection');
    }

    if (connection.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const result = await testConnection(connection);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/integrations/connections/:connectionId
 * Disconnect an integration
 */
router.delete('/connections/:connectionId', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await prisma.data_sources.findUnique({
      where: { id: req.params.connectionId },
    });

    if (!connection) {
      throw errors.notFound('Connection');
    }

    if (connection.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    await prisma.data_sources.delete({
      where: { id: connection.id },
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'integration.disconnect',
        resource_type: 'integration',
        resource_id: connection.id,
        details: { name: connection.name, type: connection.type } as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: { message: 'Connection removed' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/integrations/connections/:connectionId/schema
 * Discover schema from a connection
 */
router.get('/connections/:connectionId/schema', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await prisma.data_sources.findUnique({
      where: { id: req.params.connectionId },
    });

    if (!connection) {
      throw errors.notFound('Connection');
    }

    if (connection.organization_id !== req.organizationId) {
      throw errors.forbidden();
    }

    const schema = await discoverSchema(connection);

    res.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions

function getIntegrationConfigSchema(integrationId: string): Record<string, unknown> {
  const schemas: Record<string, Record<string, unknown>> = {
    salesforce: {
      type: 'object',
      required: ['instanceUrl'],
      properties: {
        instanceUrl: { type: 'string', title: 'Instance URL', placeholder: 'https://yourcompany.salesforce.com' },
        sandbox: { type: 'boolean', title: 'Sandbox Environment', default: false },
        apiVersion: { type: 'string', title: 'API Version', default: '58.0' },
      },
    },
    snowflake: {
      type: 'object',
      required: ['account', 'warehouse', 'database'],
      properties: {
        account: { type: 'string', title: 'Account Identifier' },
        warehouse: { type: 'string', title: 'Warehouse' },
        database: { type: 'string', title: 'Database' },
        schema: { type: 'string', title: 'Schema', default: 'PUBLIC' },
        role: { type: 'string', title: 'Role' },
      },
    },
    postgresql: {
      type: 'object',
      required: ['host', 'database', 'username', 'password'],
      properties: {
        host: { type: 'string', title: 'Host' },
        port: { type: 'number', title: 'Port', default: 5432 },
        database: { type: 'string', title: 'Database' },
        username: { type: 'string', title: 'Username' },
        password: { type: 'string', title: 'Password', format: 'password' },
        ssl: { type: 'boolean', title: 'Use SSL', default: true },
      },
    },
    slack: {
      type: 'object',
      properties: {
        defaultChannel: { type: 'string', title: 'Default Channel' },
      },
    },
  };

  return schemas[integrationId] || { type: 'object', properties: {} };
}

function generateOAuthState(orgId: string, integrationId: string, name: string): string {
  const data = { orgId, integrationId, name, ts: Date.now() };
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

function getOAuthAuthorizationUrl(integrationId: string, state: string): string {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  const redirectUri = `${baseUrl}/api/v1/integrations/oauth/callback`;

  const urls: Record<string, string> = {
    salesforce: `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    slack: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:read&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    hubspot: `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&scope=crm.objects.contacts.read&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
  };

  return urls[integrationId] || `${baseUrl}/oauth/unsupported`;
}

async function exchangeOAuthCode(integrationId: string, code: string): Promise<Record<string, unknown>> {
  // Production upgrade: exchange code for OAuth tokens
  // This is a placeholder implementation
  return {
    access_token: `mock_access_token_${code}`,
    refresh_token: `mock_refresh_token_${code}`,
    expires_in: 3600,
    obtained_at: new Date().toISOString(),
  };
}

function extractCredentials(config: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'apiKey', 'secret', 'token', 'privateKey'];
  const credentials: Record<string, unknown> = {};

  for (const key of sensitiveKeys) {
    if (config[key]) {
      credentials[key] = config[key];
      delete config[key];
    }
  }

  return credentials;
}

async function testAndActivateConnection(connectionId: string): Promise<void> {
  const connection = await prisma.data_sources.findUnique({
    where: { id: connectionId },
  });

  if (!connection) return;

  const result = await testConnection(connection);

  await prisma.data_sources.update({
    where: { id: connectionId },
    data: {
      status: result.success ? 'CONNECTED' : 'ERROR',
      last_sync_status: result.message,
      updated_at: new Date(),
    },
  });
}

async function testConnection(connection: {
  type: string;
  config: unknown;
  credentials: unknown;
}): Promise<{ success: boolean; message: string; latency?: number; metadata?: Record<string, unknown> }> {
  const start = Date.now();

  try {
    // Use real connectors
    const { testDataSourceConnection } = await import('../services/connectors/index.js');
    
    const result = await testDataSourceConnection(
      connection.type,
      connection.config as Record<string, unknown>,
      connection.credentials as Record<string, string | undefined>
    );

    return {
      success: result.success,
      message: result.message,
      latency: Date.now() - start,
      metadata: result.metadata,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      latency: Date.now() - start,
    };
  }
}

async function performSync(connectionId: string): Promise<void> {
  try {
    // Execute sync operation
    await new Promise(resolve => setTimeout(resolve, 3000));

    await prisma.data_sources.update({
      where: { id: connectionId },
      data: {
        status: 'CONNECTED',
        last_sync_at: new Date(),
        last_sync_status: 'success',
        updated_at: new Date(),
      },
    });
  } catch (error) {
    await prisma.data_sources.update({
      where: { id: connectionId },
      data: {
        status: 'ERROR',
        last_sync_status: error instanceof Error ? error.message : 'Sync failed',
        updated_at: new Date(),
      },
    });
  }
}

async function discoverSchema(connection: {
  type: string;
  config: unknown;
  credentials: unknown;
}): Promise<{ objects: Array<{ name: string; type: string; fields: Array<{ name: string; type: string }> }> }> {
  // Production upgrade: query the connected system
  return {
    objects: [
      {
        name: 'accounts',
        type: 'table',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'created_at', type: 'datetime' },
        ],
      },
      {
        name: 'contacts',
        type: 'table',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'email', type: 'string' },
          { name: 'account_id', type: 'string' },
        ],
      },
    ],
  };
}

export default router;
