/**
 * API Routes — Strategic
 *
 * Express route handler defining REST endpoints.
 * @module routes/strategic
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// STRATEGIC SERVICES API ROUTES
// Investor-Aligned Capabilities - Enterprise Platinum Standard
// =============================================================================

import { Router, Request, Response } from 'express';
import { synthesisEngineService } from '../services/strategic/SynthesisEngineService.js';
import { logicGateService } from '../services/strategic/LogicGateService.js';
import { rdpService } from '../services/strategic/RDPService.js';
import { cendiaGraphService } from '../services/strategic/CendiaGraphService.js';
import { cendiaIngestService } from '../services/strategic/CendiaIngestService.js';
import { warGamesService } from '../services/strategic/WarGamesService.js';
import { unionService } from '../services/strategic/UnionService.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// SYNTHESIS ENGINE - Multi-Agent Orchestration
// =============================================================================

router.post('/synthesis/initiate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, userId, question, context, agents, mode, timeoutMs, requireUnanimity } = req.body;
    
    if (!organizationId || !userId || !question || !agents) {
      res.status(400).json({ error: 'Missing required fields: organizationId, userId, question, agents' });
      return;
    }

    const synthesis = await synthesisEngineService.initiateSynthesis({
      organizationId,
      userId,
      question,
      context,
      agents,
      mode: mode || 'consensus',
      timeoutMs,
      requireUnanimity
    });

    res.json({ success: true, synthesis });
  } catch (error: unknown) {
    logger.error('Synthesis initiation failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/synthesis/:synthesisId', async (req: Request, res: Response): Promise<void> => {
  try {
    const synthesisId = req.params['synthesisId'] as string;
    const synthesis = synthesisEngineService.getSynthesis(synthesisId);
    if (!synthesis) {
      res.status(404).json({ error: 'Synthesis not found' });
      return;
    }
    res.json({ success: true, synthesis });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/synthesis/:synthesisId/execute', async (req: Request, res: Response) => {
  try {
    const synthesisId = req.params['synthesisId'] as string;
    const { approverUserId } = req.body;
    const execution = await synthesisEngineService.initiateExecution(synthesisId, approverUserId);
    res.json({ success: true, execution });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/synthesis/history/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const history = await synthesisEngineService.getSynthesisHistory(organizationId);
    res.json({ success: true, history });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/synthesis/metrics/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const metrics = await synthesisEngineService.getMetrics(organizationId);
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// LOGIC GATE - Parallel Processing
// =============================================================================

router.post('/logicgate/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, name, tasks, config } = req.body;
    
    if (!organizationId || !tasks) {
      res.status(400).json({ error: 'Missing required fields: organizationId, tasks' });
      return;
    }

    // Convert task handlers from strings to functions (for API use)
    const processedTasks = tasks.map((t: any) => ({
      ...t,
      handler: async () => t.result || `Task ${t.id} completed`
    }));

    const execution = await logicGateService.executeParallel(
      organizationId,
      name || 'API Execution',
      processedTasks,
      config
    );

    res.json({ success: true, execution: { ...execution, results: Object.fromEntries(execution.results) } });
  } catch (error: unknown) {
    logger.error('LogicGate execution failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/logicgate/agents', async (req: Request, res: Response) => {
  try {
    const { organizationId, agentTasks, config } = req.body;
    
    const execution = await logicGateService.executeAgentsInParallel(organizationId, agentTasks, config);
    res.json({ success: true, execution: { ...execution, results: Object.fromEntries(execution.results) } });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/logicgate/redteam-union', async (req: Request, res: Response) => {
  try {
    const { organizationId, scenario, context } = req.body;
    
    const result = await logicGateService.executeRedTeamAndUnion(organizationId, scenario, context || {});
    res.json({ success: true, result });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/logicgate/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = logicGateService.getMetrics();
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// RDP - Rapid Deployment Protocol
// =============================================================================

router.post('/rdp/package/build', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, name, type, options } = req.body;
    
    if (!organizationId || !name) {
      res.status(400).json({ error: 'Missing required fields: organizationId, name' });
      return;
    }

    const pkg = await rdpService.buildPackage(organizationId, name, type || 'standard', options);
    res.json({ success: true, package: pkg });
  } catch (error: unknown) {
    logger.error('RDP package build failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/rdp/package/:packageId', async (req: Request, res: Response): Promise<void> => {
  try {
    const packageId = req.params['packageId'] as string;
    const pkg = rdpService.getPackage(packageId);
    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json({ success: true, package: pkg });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/rdp/deploy/:packageId', async (req: Request, res: Response) => {
  try {
    const packageId = req.params['packageId'] as string;
    const { targetEndpoint } = req.body;
    const instance = await rdpService.deploy(packageId, targetEndpoint);
    res.json({ success: true, instance });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/rdp/instance/:instanceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const instanceId = req.params['instanceId'] as string;
    const instance = rdpService.getInstance(instanceId);
    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }
    res.json({ success: true, instance });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/rdp/instance/:instanceId/health', async (req: Request, res: Response) => {
  try {
    const instanceId = req.params['instanceId'] as string;
    const health = await rdpService.checkInstanceHealth(instanceId);
    res.json({ success: true, health });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/rdp/export/:packageId', async (req: Request, res: Response) => {
  try {
    const packageId = req.params['packageId'] as string;
    const exportData = await rdpService.exportForAirGap(packageId);
    res.json({ success: true, export: exportData });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/rdp/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = rdpService.getMetrics();
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA GRAPH - Knowledge Graph
// =============================================================================

router.post('/graph/entity', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, type, name, properties, sourceDocuments, confidence } = req.body;
    
    if (!organizationId || !type || !name) {
      res.status(400).json({ error: 'Missing required fields: organizationId, type, name' });
      return;
    }

    const entity = await cendiaGraphService.createEntity(
      organizationId, type, name, properties || {}, sourceDocuments || [], confidence || 1.0
    );
    res.json({ success: true, entity });
  } catch (error: unknown) {
    logger.error('Graph entity creation failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/graph/relationship', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, sourceEntityId, targetEntityId, type, properties, weight, confidence } = req.body;
    
    if (!organizationId || !sourceEntityId || !targetEntityId || !type) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const relationship = await cendiaGraphService.createRelationship(
      organizationId, sourceEntityId, targetEntityId, type, properties || {}, weight || 1.0, confidence || 1.0
    );
    res.json({ success: true, relationship });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/graph/query', async (req: Request, res: Response) => {
  try {
    const { organizationId, query } = req.body;
    const paths = await cendiaGraphService.queryGraph(organizationId, query);
    res.json({ success: true, paths });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/graph/nl-query', async (req: Request, res: Response) => {
  try {
    const { organizationId, question } = req.body;
    const result = await cendiaGraphService.naturalLanguageQuery(organizationId, question);
    res.json({ success: true, result });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/graph/risks/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const risks = await cendiaGraphService.discoverHiddenRisks(organizationId);
    res.json({ success: true, risks });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/graph/insights/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const insights = await cendiaGraphService.generateInsights(organizationId);
    res.json({ success: true, insights });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/graph/metrics/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const metrics = cendiaGraphService.getMetrics(organizationId);
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// CENDIA INGEST - Document Processing Pipeline
// =============================================================================

router.post('/ingest/job', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, userId, source } = req.body;
    
    if (!organizationId || !userId || !source) {
      res.status(400).json({ error: 'Missing required fields: organizationId, userId, source' });
      return;
    }

    const job = await cendiaIngestService.createIngestJob(organizationId, userId, source);
    res.json({ success: true, job });
  } catch (error: unknown) {
    logger.error('Ingest job creation failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/ingest/job/:jobId', async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.params['jobId'] as string;
    const job = cendiaIngestService.getJob(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ success: true, job });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/ingest/search', async (req: Request, res: Response) => {
  try {
    const { organizationId, query, limit } = req.body;
    const results = await cendiaIngestService.semanticSearch(organizationId, query, limit || 10);
    res.json({ success: true, results });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/ingest/history/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const history = await cendiaIngestService.getJobHistory(organizationId);
    res.json({ success: true, history });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/ingest/metrics/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const metrics = await cendiaIngestService.getMetrics(organizationId);
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// WARGAMES - Crisis Simulation
// =============================================================================

router.get('/wargames/scenarios', async (_req: Request, res: Response) => {
  try {
    const scenarios = warGamesService.getAllScenarios();
    res.json({ success: true, scenarios });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/wargames/scenario/:scenarioId', async (req: Request, res: Response): Promise<void> => {
  try {
    const scenarioId = req.params['scenarioId'] as string;
    const scenario = warGamesService.getScenario(scenarioId);
    if (!scenario) {
      res.status(404).json({ error: 'Scenario not found' });
      return;
    }
    res.json({ success: true, scenario });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/wargames/simulation/start', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, operatorId, scenarioId } = req.body;
    
    if (!organizationId || !operatorId || !scenarioId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const simulation = await warGamesService.startSimulation(organizationId, operatorId, scenarioId);
    res.json({ success: true, simulation });
  } catch (error: unknown) {
    logger.error('Simulation start failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/wargames/simulation/:simulationId/advance', async (req: Request, res: Response) => {
  try {
    const simulationId = req.params['simulationId'] as string;
    const { deltaSeconds } = req.body;
    const result = await warGamesService.advanceSimulation(simulationId, deltaSeconds || 60);
    res.json({ success: true, ...result });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/wargames/simulation/:simulationId/decide', async (req: Request, res: Response) => {
  try {
    const simulationId = req.params['simulationId'] as string;
    const { eventId, optionId, reasoning } = req.body;
    const decision = await warGamesService.submitDecision(simulationId, eventId, optionId, reasoning);
    res.json({ success: true, decision });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/wargames/simulation/:simulationId/complete', async (req: Request, res: Response) => {
  try {
    const simulationId = req.params['simulationId'] as string;
    const score = await warGamesService.completeSimulation(simulationId);
    res.json({ success: true, score });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/wargames/simulation/:simulationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const simulationId = req.params['simulationId'] as string;
    const simulation = warGamesService.getSimulation(simulationId);
    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }
    res.json({ success: true, simulation });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/wargames/certification/:operatorId', async (req: Request, res: Response) => {
  try {
    const operatorId = req.params['operatorId'] as string;
    const certification = warGamesService.getOperatorCertification(operatorId);
    res.json({ success: true, certification: certification || null });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/wargames/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = warGamesService.getMetrics();
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// UNION - Defense Synthesis
// =============================================================================

router.post('/union/assessment', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, source, threats } = req.body;
    
    if (!organizationId || !threats) {
      res.status(400).json({ error: 'Missing required fields: organizationId, threats' });
      return;
    }

    const assessment = await unionService.ingestThreatAssessment(organizationId, source || 'user_report', threats);
    res.json({ success: true, assessment });
  } catch (error: unknown) {
    logger.error('Threat assessment failed:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/union/synthesize/:assessmentId', async (req: Request, res: Response) => {
  try {
    const assessmentId = req.params['assessmentId'] as string;
    const { organizationId } = req.body;
    const strategy = await unionService.synthesizeDefenseStrategy(organizationId, assessmentId);
    res.json({ success: true, strategy });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/union/strategy/:strategyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const strategyId = req.params['strategyId'] as string;
    const strategy = unionService.getStrategy(strategyId);
    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }
    res.json({ success: true, strategy });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/union/strategy/:strategyId/approve', async (req: Request, res: Response) => {
  try {
    const strategyId = req.params['strategyId'] as string;
    const { approverId } = req.body;
    const strategy = await unionService.approveStrategy(strategyId, approverId);
    res.json({ success: true, strategy });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post('/union/strategy/:strategyId/activate', async (req: Request, res: Response) => {
  try {
    const strategyId = req.params['strategyId'] as string;
    const strategy = await unionService.activateStrategy(strategyId);
    res.json({ success: true, strategy });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/union/posture/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'] as string;
    const posture = unionService.getSecurityPosture(organizationId);
    res.json({ success: true, posture: posture || null });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get('/union/metrics/:organizationId?', async (req: Request, res: Response) => {
  try {
    const organizationId = req.params['organizationId'];
    const metrics = unionService.getMetrics(organizationId);
    res.json({ success: true, metrics });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    services: {
      synthesisEngine: 'operational',
      logicGate: 'operational',
      rdp: 'operational',
      cendiaGraph: 'operational',
      cendiaIngest: 'operational',
      warGames: 'operational',
      union: 'operational'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
