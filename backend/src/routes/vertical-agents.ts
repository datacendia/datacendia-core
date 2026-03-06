/**
 * API Routes — Vertical Agents
 *
 * Express route handler defining REST endpoints.
 * @module routes/vertical-agents
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - VERTICAL AI AGENTS API ROUTES
// Enterprise Platinum Standard - Full REST API for Vertical Agents
// =============================================================================

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { verticalAgentsService } from '../services/VerticalAgentsService.js';

const router = Router();

// Helper to safely get params
const getParam = (req: Request, key: string): string => {
  return (req.params as Record<string, string>)[key] || '';
};

const getQuery = (req: Request, key: string): string | undefined => {
  return (req.query as Record<string, string | undefined>)[key];
};

// =============================================================================
// VERTICAL QUERIES
// =============================================================================

/**
 * GET /api/v1/vertical-agents/verticals
 * List all available verticals
 */
router.get('/verticals', async (_req: Request, res: Response) => {
  try {
    const verticals = await verticalAgentsService.getAllVerticals();
    res.json({ success: true, data: verticals });
  } catch (error) {
    logger.error('Error getting verticals:', error);
    res.status(500).json({ success: false, error: 'Failed to get verticals' });
  }
});

/**
 * GET /api/v1/vertical-agents/verticals/:verticalId
 * Get vertical configuration including all agents
 */
router.get('/verticals/:verticalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const verticalId = getParam(req, 'verticalId');
    const config = await verticalAgentsService.getVerticalConfig(verticalId);
    
    if (!config) {
      res.status(404).json({ success: false, error: 'Vertical not found' });
      return;
    }
    
    res.json({ success: true, data: config });
  } catch (error) {
    logger.error('Error getting vertical config:', error);
    res.status(500).json({ success: false, error: 'Failed to get vertical config' });
  }
});

/**
 * GET /api/v1/vertical-agents/verticals/:verticalId/agents
 * Get all agents for a specific vertical
 */
router.get('/verticals/:verticalId/agents', async (req: Request, res: Response): Promise<void> => {
  try {
    const verticalId = getParam(req, 'verticalId');
    const agents = await verticalAgentsService.getAgentsForVertical(verticalId);
    res.json({ success: true, data: agents });
  } catch (error) {
    logger.error('Error getting vertical agents:', error);
    res.status(500).json({ success: false, error: 'Failed to get vertical agents' });
  }
});

/**
 * GET /api/v1/vertical-agents/verticals/:verticalId/metrics
 * Get metrics for a specific vertical
 */
router.get('/verticals/:verticalId/metrics', async (req: Request, res: Response): Promise<void> => {
  try {
    const verticalId = getParam(req, 'verticalId');
    const metrics = await verticalAgentsService.getVerticalMetrics(verticalId);
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error getting vertical metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to get vertical metrics' });
  }
});

// =============================================================================
// AGENT QUERIES
// =============================================================================

/**
 * GET /api/v1/vertical-agents/agents
 * Get all agents across all verticals
 */
router.get('/agents', async (_req: Request, res: Response) => {
  try {
    const agents = await verticalAgentsService.getAllAgents();
    res.json({ success: true, data: agents });
  } catch (error) {
    logger.error('Error getting all agents:', error);
    res.status(500).json({ success: false, error: 'Failed to get agents' });
  }
});

/**
 * GET /api/v1/vertical-agents/agents/search
 * Search agents by query
 */
router.get('/agents/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const q = getQuery(req, 'q');
    if (!q) {
      res.status(400).json({ success: false, error: 'Query parameter q is required' });
      return;
    }
    
    const agents = await verticalAgentsService.searchAgents(q);
    res.json({ success: true, data: agents });
  } catch (error) {
    logger.error('Error searching agents:', error);
    res.status(500).json({ success: false, error: 'Failed to search agents' });
  }
});

/**
 * GET /api/v1/vertical-agents/agents/:agentId
 * Get a specific agent by ID
 */
router.get('/agents/:agentId', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = getParam(req, 'agentId');
    const agent = await verticalAgentsService.getAgent(agentId);
    
    if (!agent) {
      res.status(404).json({ success: false, error: 'Agent not found' });
      return;
    }
    
    res.json({ success: true, data: agent });
  } catch (error) {
    logger.error('Error getting agent:', error);
    res.status(500).json({ success: false, error: 'Failed to get agent' });
  }
});

/**
 * GET /api/v1/vertical-agents/agents/:agentId/metrics
 * Get metrics for a specific agent
 */
router.get('/agents/:agentId/metrics', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = getParam(req, 'agentId');
    const metrics = await verticalAgentsService.getAgentMetrics(agentId);
    
    if (!metrics) {
      res.status(404).json({ success: false, error: 'Agent metrics not found' });
      return;
    }
    
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error getting agent metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to get agent metrics' });
  }
});

/**
 * GET /api/v1/vertical-agents/agents/:agentId/activity
 * Get recent activity for a specific agent
 */
router.get('/agents/:agentId/activity', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = getParam(req, 'agentId');
    const limit = parseInt(getQuery(req, 'limit') || '50');
    const activity = await verticalAgentsService.getAgentActivity(agentId, limit);
    res.json({ success: true, data: activity });
  } catch (error) {
    logger.error('Error getting agent activity:', error);
    res.status(500).json({ success: false, error: 'Failed to get agent activity' });
  }
});

// =============================================================================
// GLOBAL METRICS & ACTIVITY
// =============================================================================

/**
 * GET /api/v1/vertical-agents/metrics
 * Get global metrics across all verticals
 */
router.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await verticalAgentsService.getGlobalMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error getting global metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to get global metrics' });
  }
});

/**
 * GET /api/v1/vertical-agents/activity
 * Get recent activity across all agents
 */
router.get('/activity', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(getQuery(req, 'limit') || '50');
    const activity = await verticalAgentsService.getRecentActivity(limit);
    res.json({ success: true, data: activity });
  } catch (error) {
    logger.error('Error getting activity:', error);
    res.status(500).json({ success: false, error: 'Failed to get activity' });
  }
});

/**
 * POST /api/v1/vertical-agents/activity
 * Record an agent activity
 */
router.post('/activity', async (req: Request, res: Response): Promise<void> => {
  try {
    const { agentId, verticalId, action, result, duration, success } = req.body;
    
    if (!agentId || !verticalId || !action) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: agentId, verticalId, action' 
      });
      return;
    }
    
    const activity = await verticalAgentsService.recordActivity({
      agentId,
      verticalId,
      action,
      result,
      duration: duration || 0,
      success: success !== false,
    });
    
    res.json({ success: true, data: activity });
  } catch (error) {
    logger.error('Error recording activity:', error);
    res.status(500).json({ success: false, error: 'Failed to record activity' });
  }
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

/**
 * GET /api/v1/vertical-agents/health
 * Service health check
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await verticalAgentsService.healthCheck();
    res.json({ success: true, data: health });
  } catch (error) {
    logger.error('Error checking health:', error);
    res.status(500).json({ success: false, error: 'Health check failed' });
  }
});

export default router;
