/**
 * API Routes — Command
 *
 * Express route handler defining REST endpoints.
 * @module routes/command
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaCommand™ API Routes
 * 
 * Vertical-specific AI command interface endpoints
 */

import { Router, Request, Response } from 'express';
import { cendiaCommandService, VerticalId, CommandContext } from '../services/command/CendiaCommandService';
import { cendiaCommandPlatinumService } from '../services/command/CendiaCommandPlatinumService';

const router = Router();

/**
 * GET /api/v1/command/verticals
 * Get all available verticals
 */
router.get('/verticals', async (_req: Request, res: Response) => {
  try {
    const verticals = cendiaCommandService.getAllVerticals();
    res.json({
      success: true,
      data: verticals,
      count: verticals.length,
    });
  } catch (error) {
    console.error('Error getting verticals:', error);
    res.status(500).json({ success: false, error: 'Failed to get verticals' });
  }
});

/**
 * GET /api/v1/command/verticals/:verticalId
 * Get vertical configuration
 */
router.get('/verticals/:verticalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { verticalId } = req.params;
    const config = cendiaCommandService.getVerticalConfig(verticalId as VerticalId);
    
    if (!config) {
      res.status(404).json({ success: false, error: 'Vertical not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: verticalId,
        ...config,
      },
    });
  } catch (error) {
    console.error('Error getting vertical config:', error);
    res.status(500).json({ success: false, error: 'Failed to get vertical config' });
  }
});

/**
 * GET /api/v1/command/verticals/:verticalId/quick-actions
 * Get quick actions for a vertical
 */
router.get('/verticals/:verticalId/quick-actions', async (req: Request, res: Response) => {
  try {
    const { verticalId } = req.params;
    const { category } = req.query;
    
    const actions = cendiaCommandService.getQuickActions(
      verticalId as VerticalId,
      category as string | undefined
    );

    res.json({
      success: true,
      data: actions,
      count: actions.length,
    });
  } catch (error) {
    console.error('Error getting quick actions:', error);
    res.status(500).json({ success: false, error: 'Failed to get quick actions' });
  }
});

/**
 * POST /api/v1/command/parse
 * Parse a natural language command to intent
 */
router.post('/parse', async (req: Request, res: Response): Promise<void> => {
  try {
    const { command, context } = req.body;

    if (!command || !context?.verticalId) {
      res.status(400).json({
        success: false,
        error: 'Command and context.verticalId are required',
      });
      return;
    }

    const intent = cendiaCommandService.parseCommand(command, context as CommandContext);

    res.json({
      success: true,
      data: {
        command,
        intent,
      },
    });
  } catch (error) {
    console.error('Error parsing command:', error);
    res.status(500).json({ success: false, error: 'Failed to parse command' });
  }
});

/**
 * POST /api/v1/command/execute
 * Execute a command
 */
router.post('/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const { command, context } = req.body;

    if (!command || !context?.verticalId) {
      res.status(400).json({
        success: false,
        error: 'Command and context.verticalId are required',
      });
      return;
    }

    const execution = await cendiaCommandService.executeCommand(command, context as CommandContext);

    res.json({
      success: true,
      data: execution,
    });
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({ success: false, error: 'Failed to execute command' });
  }
});

/**
 * POST /api/v1/command/suggest
 * Get command suggestions based on partial input
 */
router.post('/suggest', async (req: Request, res: Response): Promise<void> => {
  try {
    const { partialCommand, context } = req.body;

    if (!context?.verticalId) {
      res.status(400).json({
        success: false,
        error: 'context.verticalId is required',
      });
      return;
    }

    const suggestions = cendiaCommandService.getSuggestions(
      partialCommand || '',
      context as CommandContext
    );

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
});

/**
 * GET /api/v1/command/history
 * Get command execution history
 */
router.get('/history', async (req: Request, res: Response): Promise<void> => {
  try {
    const { verticalId, limit } = req.query;

    if (!verticalId) {
      res.status(400).json({
        success: false,
        error: 'verticalId is required',
      });
      return;
    }

    const context: CommandContext = {
      verticalId: verticalId as VerticalId,
      userId: 'system',
      organizationId: 'system',
      sessionId: 'system',
    };

    const history = cendiaCommandService.getExecutionHistory(
      context,
      limit ? parseInt(limit as string, 10) : 10
    );

    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ success: false, error: 'Failed to get history' });
  }
});

/**
 * GET /api/v1/command/execution/:id
 * Get specific execution by ID
 */
router.get('/execution/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const execution = cendiaCommandService.getExecution(id);

    if (!execution) {
      res.status(404).json({
        success: false,
        error: 'Execution not found',
      });
      return;
    }

    res.json({
      success: true,
      data: execution,
    });
  } catch (error) {
    console.error('Error getting execution:', error);
    res.status(500).json({ success: false, error: 'Failed to get execution' });
  }
});

/**
 * GET /api/v1/command/health
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaCommand',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    verticalCount: cendiaCommandService.getAllVerticals().length,
  });
});

// ============================================================================
// PLATINUM STANDARD ENDPOINTS
// ============================================================================

/**
 * POST /api/v1/command/platinum/execute
 * Execute command with full Enterprise Platinum standard
 * Includes all 6 vertical completion layers
 */
router.post('/platinum/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const { command, context } = req.body;

    if (!command || !context?.verticalId) {
      res.status(400).json({
        success: false,
        error: 'Command and context.verticalId are required',
      });
      return;
    }

    // First parse the command to get intent
    const intent = cendiaCommandService.parseCommand(command, context as CommandContext);

    // Execute with platinum standard
    const execution = await cendiaCommandPlatinumService.executePlatinum(
      command,
      intent,
      context as CommandContext
    );

    res.json({
      success: true,
      data: execution,
      platinum: {
        knowledgeQueries: execution.knowledgeQueries.length,
        citations: execution.citations.length,
        complianceChecks: execution.complianceChecks.length,
        agentContributions: execution.agentContributions.length,
        auditTrailId: execution.auditTrailId,
        merkleRoot: execution.merkleRoot,
        signed: !!execution.signature,
      },
    });
  } catch (error) {
    console.error('Error executing platinum command:', error);
    res.status(500).json({ success: false, error: 'Failed to execute platinum command' });
  }
});

/**
 * GET /api/v1/command/platinum/config/:verticalId
 * Get platinum configuration for a vertical
 */
router.get('/platinum/config/:verticalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { verticalId } = req.params;
    const config = cendiaCommandPlatinumService.getPlatinumConfig(verticalId as VerticalId);

    if (!config) {
      res.status(404).json({ success: false, error: 'Vertical not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        verticalId,
        ...config,
      },
    });
  } catch (error) {
    console.error('Error getting platinum config:', error);
    res.status(500).json({ success: false, error: 'Failed to get platinum config' });
  }
});

/**
 * POST /api/v1/command/platinum/verify/:executionId
 * Verify integrity of a platinum execution
 */
router.post('/platinum/verify/:executionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { executionId } = req.params;
    const result = await cendiaCommandPlatinumService.verifyExecution(executionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error verifying execution:', error);
    res.status(500).json({ success: false, error: 'Failed to verify execution' });
  }
});

/**
 * GET /api/v1/command/platinum/export/:executionId
 * Export execution for regulatory submission
 */
router.get('/platinum/export/:executionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { executionId } = req.params;
    const result = await cendiaCommandPlatinumService.exportForRegulator(executionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error exporting execution:', error);
    res.status(500).json({ success: false, error: 'Failed to export execution' });
  }
});

/**
 * GET /api/v1/command/platinum/execution/:id
 * Get platinum execution details
 */
router.get('/platinum/execution/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const execution = cendiaCommandPlatinumService.getExecution(id);

    if (!execution) {
      res.status(404).json({ success: false, error: 'Execution not found' });
      return;
    }

    res.json({
      success: true,
      data: execution,
    });
  } catch (error) {
    console.error('Error getting platinum execution:', error);
    res.status(500).json({ success: false, error: 'Failed to get platinum execution' });
  }
});

export default router;
