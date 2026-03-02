// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - INDUSTRIAL SERVICES API ROUTES
// Enterprise Platinum Standard - Full REST API
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  ALL_INDUSTRIAL_SERVICES_AGENTS,
  getIndustrialServicesAgent,
  getDefaultIndustrialServicesAgents,
  getOptionalIndustrialServicesAgents,
  getSilentGuardIndustrialServicesAgents,
  getIndustrialServicesAgentsByExpertise,
} from '../services/verticals/industrial-services/IndustrialServicesAgents.js';
import industrialServicesVertical, {
  IndustrialServicesVerticalImpl,
} from '../services/verticals/industrial-services/IndustrialServicesVertical.js';

const router = Router();
router.use(devAuth);

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response): void => {
  const status = industrialServicesVertical.getStatus();
  res.json({
    status: 'healthy',
    vertical: 'industrial-services',
    agentsCount: ALL_INDUSTRIAL_SERVICES_AGENTS.length,
    layers: status.layers,
    completionPercentage: status.completionPercentage,
    complianceFrameworks: industrialServicesVertical.complianceMapper.supportedFrameworks.length,
    decisionTypes: industrialServicesVertical.decisionSchemas.size,
    lastActivity: new Date().toISOString(),
  });
});

// =============================================================================
// AGENTS
// =============================================================================

router.get('/agents', (_req: Request, res: Response): void => {
  res.json({
    agents: ALL_INDUSTRIAL_SERVICES_AGENTS,
    total: ALL_INDUSTRIAL_SERVICES_AGENTS.length,
    categories: ['default', 'optional', 'silent-guard'],
  });
});

router.get('/agents/default', (_req: Request, res: Response): void => {
  const agents = getDefaultIndustrialServicesAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/optional', (_req: Request, res: Response): void => {
  const agents = getOptionalIndustrialServicesAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/silent-guards', (_req: Request, res: Response): void => {
  const agents = getSilentGuardIndustrialServicesAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/expertise/:expertise', (req: Request<{ expertise: string }>, res: Response): void => {
  const agents = getIndustrialServicesAgentsByExpertise(req.params.expertise);
  res.json({ agents, total: agents.length, expertise: req.params.expertise });
});

router.get('/agents/:id', (req: Request<{ id: string }>, res: Response): void => {
  const agent = getIndustrialServicesAgent(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Industrial services agent not found' });
    return;
  }
  res.json(agent);
});

// =============================================================================
// COMPLIANCE FRAMEWORKS
// =============================================================================

router.get('/compliance', (_req: Request, res: Response): void => {
  const frameworks = industrialServicesVertical.complianceMapper.supportedFrameworks;
  res.json({
    frameworks: frameworks.map(f => ({
      id: f.id,
      name: f.name,
      version: f.version,
      jurisdiction: f.jurisdiction,
      controlCount: f.controls.length,
    })),
    total: frameworks.length,
  });
});

router.get('/compliance/:frameworkId', (req: Request<{ frameworkId: string }>, res: Response): void => {
  const framework = industrialServicesVertical.complianceMapper.getFramework(req.params.frameworkId);
  if (!framework) {
    res.status(404).json({ error: 'Compliance framework not found' });
    return;
  }
  res.json(framework);
});

router.get('/compliance/:frameworkId/controls', (req: Request<{ frameworkId: string }>, res: Response): void => {
  const framework = industrialServicesVertical.complianceMapper.getFramework(req.params.frameworkId);
  if (!framework) {
    res.status(404).json({ error: 'Compliance framework not found' });
    return;
  }
  res.json({ controls: framework.controls, total: framework.controls.length });
});

router.get('/compliance/map/:decisionType/:frameworkId', (req: Request<{ decisionType: string; frameworkId: string }>, res: Response): void => {
  const controls = industrialServicesVertical.complianceMapper.mapToFramework(
    req.params.decisionType,
    req.params.frameworkId
  );
  res.json({
    decisionType: req.params.decisionType,
    frameworkId: req.params.frameworkId,
    applicableControls: controls,
    total: controls.length,
  });
});

// =============================================================================
// DECISION SCHEMAS
// =============================================================================

router.get('/schemas', (_req: Request, res: Response): void => {
  const schemas: { type: string; requiredFields: string[]; requiredApprovers: string[] }[] = [];
  for (const [type, schema] of industrialServicesVertical.decisionSchemas) {
    schemas.push({
      type,
      requiredFields: schema.requiredFields,
      requiredApprovers: schema.requiredApprovers,
    });
  }
  res.json({ schemas, total: schemas.length });
});

router.get('/schemas/:type', (req: Request<{ type: string }>, res: Response): void => {
  const schema = industrialServicesVertical.decisionSchemas.get(req.params.type);
  if (!schema) {
    res.status(404).json({ error: 'Decision schema not found', available: Array.from(industrialServicesVertical.decisionSchemas.keys()) });
    return;
  }
  res.json({
    type: req.params.type,
    verticalId: schema.verticalId,
    requiredFields: schema.requiredFields,
    requiredApprovers: schema.requiredApprovers,
  });
});

// =============================================================================
// DATA CONNECTORS
// =============================================================================

router.get('/connectors', (_req: Request, res: Response): void => {
  const sources = industrialServicesVertical.dataConnector.getSources();
  res.json({
    connectors: sources,
    total: sources.length,
  });
});

router.post('/connectors/:sourceId/connect', async (req: Request<{ sourceId: string }>, res: Response): Promise<void> => {
  try {
    const success = await industrialServicesVertical.dataConnector.connect({
      sourceId: req.params.sourceId,
      ...req.body,
    });
    res.json({ success, sourceId: req.params.sourceId });
  } catch (error) {
    console.error('Error connecting data source:', error);
    res.status(500).json({ success: false, error: 'Failed to connect data source' });
  }
});

router.post('/connectors/:sourceId/ingest', async (req: Request<{ sourceId: string }>, res: Response): Promise<void> => {
  try {
    const result = await industrialServicesVertical.dataConnector.ingest(req.params.sourceId, req.body.query);
    res.json(result);
  } catch (error) {
    console.error('Error ingesting data:', error);
    res.status(500).json({ success: false, error: 'Failed to ingest data' });
  }
});

// =============================================================================
// WORKFLOW & AGENT PRESETS
// =============================================================================

router.get('/workflow', async (_req: Request, res: Response): Promise<void> => {
  try {
    const preset = industrialServicesVertical.agentPresets.get('industrial-services-council');
    if (!preset) {
      res.status(404).json({ error: 'Agent preset not found' });
      return;
    }
    const steps = await preset.loadWorkflow({});
    res.json({
      presetId: preset.presetId,
      name: preset.name,
      description: preset.description,
      steps: steps.map(s => ({
        id: s.id,
        name: s.name,
        agentId: s.agentId,
        requiredInputs: s.requiredInputs,
        expectedOutputs: s.expectedOutputs,
        timeout: s.timeout,
        guardrails: s.guardrails.map(g => ({ id: g.id, name: g.name, type: g.type })),
      })),
      guardrails: preset.guardrails.map(g => ({
        id: g.id,
        name: g.name,
        type: g.type,
        condition: g.condition,
        action: g.action,
      })),
      capabilities: preset.capabilities,
    });
  } catch (error) {
    console.error('Error getting workflow:', error);
    res.status(500).json({ success: false, error: 'Failed to get workflow' });
  }
});

router.get('/workflow/:decisionType', async (req: Request<{ decisionType: string }>, res: Response): Promise<void> => {
  try {
    const preset = industrialServicesVertical.agentPresets.get('industrial-services-council');
    if (!preset) {
      res.status(404).json({ error: 'Agent preset not found' });
      return;
    }
    const steps = await preset.loadWorkflow({ decisionType: req.params.decisionType });
    res.json({
      decisionType: req.params.decisionType,
      steps: steps.map(s => ({
        id: s.id,
        name: s.name,
        agentId: s.agentId,
        timeout: s.timeout,
      })),
      totalSteps: steps.length,
    });
  } catch (error) {
    console.error('Error getting workflow for decision type:', error);
    res.status(500).json({ success: false, error: 'Failed to get workflow' });
  }
});

// =============================================================================
// VERTICAL STATUS
// =============================================================================

router.get('/status', (_req: Request, res: Response): void => {
  const status = industrialServicesVertical.getStatus();
  res.json({
    ...status,
    complianceFrameworks: industrialServicesVertical.complianceMapper.supportedFrameworks.map(f => f.id),
    decisionSchemas: Array.from(industrialServicesVertical.decisionSchemas.keys()),
    agentPresets: Array.from(industrialServicesVertical.agentPresets.keys()),
    dataSources: industrialServicesVertical.dataConnector.getSources().map(s => s.id),
  });
});

export default router;
