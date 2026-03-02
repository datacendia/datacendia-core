// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * API Routes for Football/Soccer DDGI
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

import { Router, Request, Response, NextFunction } from 'express';
import { sportsDecisionService, Player, Club } from '../services/sports/SportsDecisionService.js';
import { sportsKnowledgeBase } from '../services/sports/SportsKnowledgeBase.js';
import { sportsAgentService, SPORTS_AGENT_PRESETS } from '../services/sports/SportsAgents.js';
import { SPORTS_DECISION_TEMPLATES } from '../config/sports/decision-templates.js';
import { SPORTS_COMPLIANCE_FRAMEWORKS } from '../config/sports/compliance-frameworks.js';

const router = Router();

// Health endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'sports', timestamp: new Date().toISOString() } });
});

// Helper to get param safely
function getParam(req: Request, name: string): string {
  return req.params[name] || '';
}

// =============================================================================
// MIDDLEWARE
// =============================================================================

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// =============================================================================
// HEALTH & INFO
// =============================================================================

/**
 * GET /api/v1/sports/status
 * Service health and statistics
 */
router.get('/status', asyncHandler(async (_req: Request, res: Response) => {
  const health = await sportsDecisionService.healthCheck();
  res.json({
    service: 'SportsDecisionService',
    version: '1.0.0',
    ...health,
  });
}));

/**
 * GET /api/v1/sports/templates
 * List available decision templates
 */
router.get('/templates', (_req: Request, res: Response) => {
  res.json({
    templates: SPORTS_DECISION_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      subcategory: t.subcategory,
      description: t.description,
      requiredFieldsCount: t.requiredFields.length,
      optionalFieldsCount: t.optionalFields.length,
      complianceFrameworks: t.complianceFrameworks,
    })),
    count: SPORTS_DECISION_TEMPLATES.length,
  });
});

/**
 * GET /api/v1/sports/templates/:id
 * Get full template details
 */
router.get('/templates/:id', (req: Request, res: Response) => {
  const template = sportsDecisionService.getTemplate(getParam(req, 'id'));
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  res.json({ template });
});

/**
 * GET /api/v1/sports/compliance-frameworks
 * List compliance frameworks
 */
router.get('/compliance-frameworks', (_req: Request, res: Response) => {
  res.json({
    frameworks: SPORTS_COMPLIANCE_FRAMEWORKS.map(f => ({
      id: f.id,
      name: f.name,
      shortName: f.shortName,
      governingBody: f.governingBody,
      region: f.region,
      requirementsCount: f.requirements.length,
    })),
    count: SPORTS_COMPLIANCE_FRAMEWORKS.length,
  });
});

/**
 * GET /api/v1/sports/compliance-frameworks/:id
 * Get full framework details
 */
router.get('/compliance-frameworks/:id', (req: Request, res: Response) => {
  const framework = sportsDecisionService.getFramework(getParam(req, 'id'));
  if (!framework) {
    res.status(404).json({ error: 'Framework not found' });
    return;
  }
  res.json({ framework });
});

// =============================================================================
// TRANSFER DECISIONS
// =============================================================================

/**
 * POST /api/v1/sports/transfers
 * Create a new transfer decision
 */
router.post('/transfers', asyncHandler(async (req: Request, res: Response) => {
  const {
    organizationId,
    userId,
    templateId,
    transactionType,
    player,
    counterpartyClub,
    transferFee,
    addOns,
    agentFee,
  } = req.body;

  if (!organizationId || !userId || !player || !counterpartyClub) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const decision = await sportsDecisionService.createTransferDecision({
    organizationId,
    userId,
    templateId: templateId || 'transfer-inbound-v1',
    transactionType: transactionType || 'inbound',
    player: player as Player,
    counterpartyClub: counterpartyClub as Club,
    transferFee: transferFee || 0,
    addOns,
    agentFee,
  });

  res.status(201).json({ decision });
}));

/**
 * GET /api/v1/sports/transfers/:id
 * Get a transfer decision
 */
router.get('/transfers/:id', asyncHandler(async (req: Request, res: Response) => {
  const decision = await sportsDecisionService.getTransferDecision(getParam(req, 'id'));
  if (!decision) {
    res.status(404).json({ error: 'Transfer decision not found' });
    return;
  }
  res.json({ decision });
}));

/**
 * PATCH /api/v1/sports/transfers/:id
 * Update a transfer decision
 */
router.patch('/transfers/:id', asyncHandler(async (req: Request, res: Response) => {
  const { userId, ...updates } = req.body;
  
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.updateTransferDecision(
      getParam(req, 'id'),
      userId,
      updates
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/scouting
 * Add scouting assessment
 */
router.post('/transfers/:id/scouting', asyncHandler(async (req: Request, res: Response) => {
  const { userId, assessment } = req.body;
  
  if (!userId || !assessment) {
    res.status(400).json({ error: 'userId and assessment are required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.addScoutingAssessment(
      getParam(req, 'id'),
      userId,
      assessment
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/valuation
 * Add valuation assessment
 */
router.post('/transfers/:id/valuation', asyncHandler(async (req: Request, res: Response) => {
  const { userId, valuation } = req.body;
  
  if (!userId || !valuation) {
    res.status(400).json({ error: 'userId and valuation are required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.addValuation(
      getParam(req, 'id'),
      userId,
      valuation
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/alternatives
 * Add alternative player considered
 */
router.post('/transfers/:id/alternatives', asyncHandler(async (req: Request, res: Response) => {
  const { userId, alternative } = req.body;
  
  if (!userId || !alternative) {
    res.status(400).json({ error: 'userId and alternative are required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.addAlternative(
      getParam(req, 'id'),
      userId,
      alternative
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/evidence
 * Attach evidence to decision
 */
router.post('/transfers/:id/evidence', asyncHandler(async (req: Request, res: Response) => {
  const { userId, evidence } = req.body;
  
  if (!userId || !evidence) {
    res.status(400).json({ error: 'userId and evidence are required' });
    return;
  }

  if (!evidence.type || !evidence.filename) {
    res.status(400).json({ error: 'evidence.type and evidence.filename are required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.attachEvidence(
      getParam(req, 'id'),
      userId,
      evidence
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/submit
 * Submit for approval
 */
router.post('/transfers/:id/submit', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.submitForApproval(getParam(req, 'id'), userId);
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/approve
 * Record approval decision
 */
router.post('/transfers/:id/approve', asyncHandler(async (req: Request, res: Response) => {
  const { userId, userName, role, approved, comments } = req.body;
  
  if (!userId || !userName || !role || approved === undefined) {
    res.status(400).json({ error: 'userId, userName, role, and approved are required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.recordApproval(
      getParam(req, 'id'),
      userId,
      userName,
      role,
      approved,
      comments
    );
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/complete
 * Complete and lock decision
 */
router.post('/transfers/:id/complete', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  try {
    const decision = await sportsDecisionService.completeDecision(getParam(req, 'id'), userId);
    res.json({ decision });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * POST /api/v1/sports/transfers/:id/ffp-assessment
 * Assess FFP impact of decision
 */
router.post('/transfers/:id/ffp-assessment', asyncHandler(async (req: Request, res: Response) => {
  const { currentBreakEvenPosition, currentSquadCostRatio } = req.body;
  
  if (currentBreakEvenPosition === undefined) {
    res.status(400).json({ error: 'currentBreakEvenPosition is required' });
    return;
  }

  try {
    const assessment = await sportsDecisionService.assessFFPImpact(
      getParam(req, 'id'),
      {
        breakEvenPosition: currentBreakEvenPosition,
        squadCostRatio: currentSquadCostRatio || 0,
      }
    );
    res.json({ assessment });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

/**
 * GET /api/v1/sports/transfers/:id/export
 * Export decision record
 */
router.get('/transfers/:id/export', asyncHandler(async (req: Request, res: Response) => {
  try {
    const exportData = await sportsDecisionService.exportDecisionRecord(getParam(req, 'id'));
    res.json(exportData);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}));

// =============================================================================
// ORGANIZATION DECISIONS
// =============================================================================

/**
 * GET /api/v1/sports/organizations/:orgId/decisions
 * Get all decisions for an organization
 */
router.get('/organizations/:orgId/decisions', asyncHandler(async (req: Request, res: Response) => {
  const { type, status, limit } = req.query;
  
  const options: { type?: 'transfer' | 'contract'; status?: string; limit?: number } = {};
  if (type === 'transfer' || type === 'contract') {
    options.type = type;
  }
  if (typeof status === 'string') {
    options.status = status;
  }
  if (limit) {
    options.limit = parseInt(limit as string, 10);
  }
  
  const decisions = await sportsDecisionService.getOrganizationDecisions(
    getParam(req, 'orgId'),
    options
  );
  
  res.json({
    decisions,
    count: decisions.length,
  });
}));

// =============================================================================
// KNOWLEDGE BASE ROUTES
// =============================================================================

/**
 * GET /api/v1/sports/knowledge/status
 * Get knowledge base status
 */
router.get('/knowledge/status', (_req: Request, res: Response) => {
  const status = sportsKnowledgeBase.getStatus();
  res.json({ status });
});

/**
 * POST /api/v1/sports/knowledge/query
 * Query the sports regulations knowledge base
 */
router.post('/knowledge/query', asyncHandler(async (req: Request, res: Response) => {
  const { query, sources, types, maxResults, minRelevance } = req.body;
  
  if (!query) {
    res.status(400).json({ error: 'query is required' });
    return;
  }

  const results = await sportsKnowledgeBase.query({
    query,
    sources,
    types,
    maxResults: maxResults || 10,
    minRelevance: minRelevance || 0.1,
  });

  res.json({
    results,
    count: results.length,
    query,
  });
}));

/**
 * GET /api/v1/sports/knowledge/provenance
 * Get provenance log for audit trail
 */
router.get('/knowledge/provenance', (req: Request, res: Response) => {
  const { documentId, limit } = req.query;
  
  const options: { documentId?: string; limit?: number } = {
    limit: limit ? parseInt(limit as string, 10) : 100,
  };
  
  if (typeof documentId === 'string') {
    options.documentId = documentId;
  }
  
  const records = sportsKnowledgeBase.getProvenanceLog(options);

  res.json({ records, count: records.length });
});

// =============================================================================
// AGENT ROUTES
// =============================================================================

/**
 * GET /api/v1/sports/agents
 * List all available agent presets
 */
router.get('/agents', (_req: Request, res: Response) => {
  const agents = SPORTS_AGENT_PRESETS.map(a => ({
    id: a.id,
    role: a.role,
    displayLabel: a.displayLabel,
    description: a.description,
    expertise: a.expertise,
    workflows: a.workflows,
    responseStyle: a.responseStyle,
    customizableLabel: a.customizableLabel,
  }));
  
  res.json({ agents, count: agents.length });
});

/**
 * GET /api/v1/sports/agents/:agentId
 * Get specific agent preset
 */
router.get('/agents/:agentId', (req: Request, res: Response) => {
  const agent = sportsAgentService.getAgentPreset(getParam(req, 'agentId'));
  
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  
  res.json({ agent });
});

/**
 * GET /api/v1/sports/agents/workflow/:workflow
 * Get recommended agents for a workflow
 */
router.get('/agents/workflow/:workflow', (req: Request, res: Response) => {
  const workflow = getParam(req, 'workflow') as any;
  const agents = sportsAgentService.getRecommendedAgents(workflow);
  
  res.json({
    workflow,
    agents: agents.map(a => ({
      id: a.id,
      role: a.role,
      displayLabel: a.displayLabel,
      description: a.description,
      expertise: a.expertise,
    })),
    count: agents.length,
  });
});

/**
 * POST /api/v1/sports/agents/:agentId/prompt
 * Build agent prompt with context
 */
router.post('/agents/:agentId/prompt', asyncHandler(async (req: Request, res: Response) => {
  const agent = sportsAgentService.getAgentPreset(getParam(req, 'agentId'));
  
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  const { workflow, player, financials, additionalContext } = req.body;
  
  if (!workflow) {
    res.status(400).json({ error: 'workflow is required' });
    return;
  }

  const prompt = await sportsAgentService.buildAgentPrompt(agent, {
    workflow,
    player,
    financials,
    additionalContext,
  });

  res.json({
    agentId: agent.id,
    displayLabel: agent.displayLabel,
    role: agent.role,
    model: agent.model,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    prompt,
  });
}));

/**
 * GET /api/v1/sports/workflows
 * List available workflows
 */
router.get('/workflows', (_req: Request, res: Response) => {
  const workflows = sportsAgentService.getWorkflows();
  res.json({ workflows });
});

// =============================================================================
// ERROR HANDLER
// =============================================================================

router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Sports API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

export default router;
