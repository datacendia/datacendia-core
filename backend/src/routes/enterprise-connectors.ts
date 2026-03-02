/**
 * API Routes — Enterprise Connectors
 *
 * Express route handler defining REST endpoints.
 * @module routes/enterprise-connectors
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * ENTERPRISE CONNECTORS API ROUTES
 * =============================================================================
 * OAuth2 flows and data operations for enterprise integrations
 */

import { Router, Request, Response } from 'express';
import { SalesforceConnector, SlackConnector, JiraConnector, ENTERPRISE_CONNECTORS } from '../connectors/enterprise/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Connector instances (production upgrade: per-tenant)
const connectorInstances = new Map<string, any>();

function getOrCreateConnector(connectorId: string, config?: any): any {
  if (connectorInstances.has(connectorId)) {
    return connectorInstances.get(connectorId);
  }

  let connector: any;
  switch (connectorId) {
    case 'salesforce':
      connector = new SalesforceConnector(config || { id: 'salesforce' });
      break;
    case 'slack':
      connector = new SlackConnector(config || { id: 'slack' });
      break;
    case 'jira':
      connector = new JiraConnector(config || { id: 'jira' });
      break;
    default:
      return null;
  }

  connectorInstances.set(connectorId, connector);
  return connector;
}

// List available enterprise connectors
router.get('/list', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: ENTERPRISE_CONNECTORS,
    meta: { total: ENTERPRISE_CONNECTORS.length },
  });
});

// Get connector details
router.get('/:connectorId', (req: Request, res: Response): void => {
  const connectorId = req.params['connectorId'] || '';
  const metadata = ENTERPRISE_CONNECTORS.find(c => c.id === connectorId);
  if (!metadata) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Connector not found' },
    });
    return;
  }

  const connector = getOrCreateConnector(connectorId);
  res.json({
    success: true,
    data: {
      ...metadata,
      status: connector?.getStatus() || 'not_initialized',
      implemented: !!connector,
    },
  });
});

// Initialize OAuth flow - get authorization URL
router.post('/:connectorId/oauth/authorize', (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector(req.params.connectorId, req.body.config);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not found or not implemented' },
      });
    }

    if (typeof connector.getAuthorizationUrl !== 'function') {
      return res.status(400).json({
        success: false,
        error: { code: 'NOT_SUPPORTED', message: 'Connector does not support OAuth' },
      });
    }

    const authData = connector.getAuthorizationUrl();
    res.json({
      success: true,
      data: {
        authorizationUrl: authData.url,
        state: authData.state,
        codeVerifier: authData.codeVerifier,
      },
    });
  } catch (error) {
    logger.error(`OAuth authorize error for ${req.params.connectorId}`, { error });
    res.status(500).json({
      success: false,
      error: { code: 'OAUTH_ERROR', message: (error as Error).message },
    });
  }
});

// Handle OAuth callback
router.post('/:connectorId/oauth/callback', async (req: Request, res: Response) => {
  try {
    const { code, codeVerifier, state } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CODE', message: 'Authorization code is required' },
      });
    }

    const connector = getOrCreateConnector(req.params.connectorId);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not found' },
      });
    }

    await connector.handleOAuthCallback(code, codeVerifier);
    res.json({
      success: true,
      data: {
        status: connector.getStatus(),
        message: 'OAuth authorization completed successfully',
      },
    });
  } catch (error) {
    logger.error(`OAuth callback error for ${req.params.connectorId}`, { error });
    res.status(500).json({
      success: false,
      error: { code: 'OAUTH_ERROR', message: (error as Error).message },
    });
  }
});

// Test connection
router.post('/:connectorId/test', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector(req.params.connectorId);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not found' },
      });
    }

    const isConnected = await connector.testConnection();
    res.json({
      success: true,
      data: {
        connected: isConnected,
        status: connector.getStatus(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CONNECTION_ERROR', message: (error as Error).message },
    });
  }
});

// Connect
router.post('/:connectorId/connect', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector(req.params.connectorId, req.body.config);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not found' },
      });
    }

    await connector.connect();
    res.json({
      success: true,
      data: { status: connector.getStatus() },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CONNECTION_ERROR', message: (error as Error).message },
    });
  }
});

// Disconnect
router.post('/:connectorId/disconnect', async (req: Request, res: Response) => {
  try {
    const connector = connectorInstances.get(req.params.connectorId);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not initialized' },
      });
    }

    await connector.disconnect();
    connectorInstances.delete(req.params.connectorId);
    res.json({
      success: true,
      data: { status: 'disconnected' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DISCONNECT_ERROR', message: (error as Error).message },
    });
  }
});

// Fetch data from connector
router.post('/:connectorId/fetch', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector(req.params.connectorId);
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Connector not found' },
      });
    }

    const result = await connector.fetchData(req.body.params);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: (error as Error).message },
    });
  }
});

// Salesforce-specific: Execute SOQL query
router.post('/salesforce/query', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector('salesforce') as SalesforceConnector;
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Salesforce connector not initialized' },
      });
    }

    const { soql } = req.body;
    if (!soql) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'SOQL query is required' },
      });
    }

    const result = await connector.query(soql);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'QUERY_ERROR', message: (error as Error).message },
    });
  }
});

// Slack-specific: Send message
router.post('/slack/send', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector('slack') as SlackConnector;
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Slack connector not initialized' },
      });
    }

    const { channelId, text, thread_ts, blocks } = req.body;
    if (!channelId || !text) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'channelId and text are required' },
      });
    }

    const result = await connector.sendMessage(channelId, text, { thread_ts, blocks });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SEND_ERROR', message: (error as Error).message },
    });
  }
});

// Jira-specific: Search issues
router.post('/jira/search', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector('jira') as JiraConnector;
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Jira connector not initialized' },
      });
    }

    const { jql, maxResults, startAt, fields } = req.body;
    if (!jql) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'JQL query is required' },
      });
    }

    const result = await connector.searchIssues(jql, { maxResults, startAt, fields });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SEARCH_ERROR', message: (error as Error).message },
    });
  }
});

// Jira-specific: Create issue
router.post('/jira/issues', async (req: Request, res: Response) => {
  try {
    const connector = getOrCreateConnector('jira') as JiraConnector;
    if (!connector) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Jira connector not initialized' },
      });
    }

    const result = await connector.createIssue(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: (error as Error).message },
    });
  }
});

// Status endpoint
router.get('/status', (_req: Request, res: Response) => {
  const connectorStatuses = Array.from(connectorInstances.entries()).map(([id, connector]) => ({
    id,
    status: connector.getStatus(),
    name: connector.getName(),
  }));

  res.json({
    success: true,
    data: {
      availableConnectors: ENTERPRISE_CONNECTORS.length,
      initializedConnectors: connectorInstances.size,
      connectors: connectorStatuses,
    },
  });
});

export default router;
