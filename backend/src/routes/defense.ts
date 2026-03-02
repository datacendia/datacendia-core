/**
 * API Routes — Defense
 *
 * Express route handler defining REST endpoints.
 * @module routes/defense
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA DEFENSE & NATIONAL SECURITY VERTICAL ROUTES
 * 
 * API endpoints for the Defense/Government vertical
 * Compliance: FedRAMP High, CMMC Level 3, ITAR, NIST 800-171
 */

import { Router, Request, Response } from 'express';
import { defenseVerticalService } from '../services/verticals/defense/index.js';

const router = Router();

// =============================================================================
// HEALTH & STATUS
// =============================================================================

/**
 * GET /api/v1/defense/health
 * Health check for defense vertical
 */
router.get('/health', (_req: Request, res: Response) => {
  const health = defenseVerticalService.getHealth();
  res.json(health);
});

/**
 * GET /api/v1/defense/summary
 * Get defense vertical summary
 */
router.get('/summary', (_req: Request, res: Response) => {
  const summary = defenseVerticalService.getSummary();
  res.json(summary);
});

// =============================================================================
// AGENTS
// =============================================================================

/**
 * GET /api/v1/defense/agents
 * List all defense agents
 */
router.get('/agents', (req: Request, res: Response) => {
  const { category, clearance } = req.query;
  
  let agents = defenseVerticalService.getAllAgents();
  
  if (category && typeof category === 'string') {
    agents = agents.filter(a => a.category === category);
  }
  
  if (clearance && typeof clearance === 'string') {
    agents = agents.filter(a => a.clearanceRequired === clearance);
  }
  
  res.json({
    count: agents.length,
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      category: a.category,
      expertise: a.expertise,
      clearanceRequired: a.clearanceRequired,
      opsecAware: a.opsecAware,
      missionFocused: a.missionFocused,
      jointCapable: a.jointCapable,
    })),
  });
});

/**
 * GET /api/v1/defense/agents/:id
 * Get a specific defense agent
 */
router.get('/agents/:id', (req: Request, res: Response) => {
  const agent = defenseVerticalService.getAgentById(req.params.id);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  res.json(agent);
});

/**
 * GET /api/v1/defense/agents/category/:category
 * Get agents by category
 */
router.get('/agents/category/:category', (req: Request, res: Response) => {
  const category = req.params.category as 'default' | 'optional' | 'silent-guard';
  const agents = defenseVerticalService.getAgentsByCategory(category);
  
  res.json({
    category,
    count: agents.length,
    agents,
  });
});

/**
 * POST /api/v1/defense/agents/build-team
 * Build a mission-specific agent team
 */
router.post('/agents/build-team', (req: Request, res: Response) => {
  const { missionType } = req.body;
  
  if (!missionType || !['kinetic', 'cyber', 'acquisition', 'planning', 'intelligence'].includes(missionType)) {
    return res.status(400).json({ 
      error: 'Invalid mission type',
      validTypes: ['kinetic', 'cyber', 'acquisition', 'planning', 'intelligence'],
    });
  }
  
  const team = defenseVerticalService.buildMissionTeam(missionType);
  
  res.json({
    missionType,
    teamSize: team.length,
    team: team.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      category: a.category,
    })),
  });
});

// =============================================================================
// COUNCIL MODES
// =============================================================================

/**
 * GET /api/v1/defense/modes
 * List all defense council modes
 */
router.get('/modes', (req: Request, res: Response) => {
  const { category, classification, legalReview } = req.query;
  
  let modes = defenseVerticalService.getAllModes();
  
  if (category && typeof category === 'string') {
    modes = modes.filter(m => m.category === category);
  }
  
  if (classification && typeof classification === 'string') {
    modes = modes.filter(m => m.classificationLevel === classification);
  }
  
  if (legalReview === 'true') {
    modes = modes.filter(m => m.legalReviewRequired);
  }
  
  res.json({
    count: modes.length,
    modes: modes.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      purpose: m.purpose,
      leadAgent: m.leadAgent,
      classificationLevel: m.classificationLevel,
      legalReviewRequired: m.legalReviewRequired,
      opsecRequired: m.opsecRequired,
    })),
  });
});

/**
 * GET /api/v1/defense/modes/:id
 * Get a specific defense council mode
 */
router.get('/modes/:id', (req: Request, res: Response) => {
  const mode = defenseVerticalService.getModeById(req.params.id);
  
  if (!mode) {
    return res.status(404).json({ error: 'Mode not found' });
  }
  
  res.json(mode);
});

/**
 * GET /api/v1/defense/modes/category/:category
 * Get modes by category
 */
router.get('/modes/category/:category', (req: Request, res: Response) => {
  const modes = defenseVerticalService.getModesByCategory(req.params.category);
  
  res.json({
    category: req.params.category,
    count: modes.length,
    modes,
  });
});

/**
 * GET /api/v1/defense/modes/classification/:level
 * Get modes by classification level
 */
router.get('/modes/classification/:level', (req: Request, res: Response) => {
  const level = req.params.level as 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  const modes = defenseVerticalService.getModesByClassification(level);
  
  res.json({
    classificationLevel: level,
    count: modes.length,
    modes,
  });
});

// =============================================================================
// DECISION SCHEMAS
// =============================================================================

/**
 * GET /api/v1/defense/schemas
 * List all defense decision schemas
 */
router.get('/schemas', (_req: Request, res: Response) => {
  const schemas = defenseVerticalService.getAllSchemas();
  
  res.json({
    count: schemas.length,
    schemas: schemas.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      classificationLevel: s.classificationLevel,
      requiredApprovals: s.requiredApprovals,
      fieldCount: s.fields.length,
    })),
  });
});

/**
 * GET /api/v1/defense/schemas/:id
 * Get a specific decision schema
 */
router.get('/schemas/:id', (req: Request, res: Response) => {
  const schema = defenseVerticalService.getSchemaById(req.params.id);
  
  if (!schema) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  
  res.json(schema);
});

// =============================================================================
// COMPLIANCE FRAMEWORKS
// =============================================================================

/**
 * GET /api/v1/defense/compliance
 * List all compliance frameworks
 */
router.get('/compliance', (_req: Request, res: Response) => {
  const frameworks = defenseVerticalService.getAllComplianceFrameworks();
  
  res.json({
    count: frameworks.length,
    frameworks: frameworks.map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      auditFrequency: f.auditFrequency,
      requirementCount: f.requirements.length,
      applicableModeCount: f.applicableModes.length,
    })),
  });
});

/**
 * GET /api/v1/defense/compliance/:id
 * Get a specific compliance framework
 */
router.get('/compliance/:id', (req: Request, res: Response) => {
  const framework = defenseVerticalService.getComplianceFrameworkById(req.params.id);
  
  if (!framework) {
    return res.status(404).json({ error: 'Compliance framework not found' });
  }
  
  res.json(framework);
});

/**
 * GET /api/v1/defense/compliance/mode/:modeId
 * Get applicable compliance frameworks for a mode
 */
router.get('/compliance/mode/:modeId', (req: Request, res: Response) => {
  const frameworks = defenseVerticalService.getApplicableFrameworks(req.params.modeId);
  
  res.json({
    modeId: req.params.modeId,
    count: frameworks.length,
    frameworks,
  });
});

// =============================================================================
// DATA CONNECTORS
// =============================================================================

/**
 * GET /api/v1/defense/connectors
 * List all defense data connectors
 */
router.get('/connectors', (req: Request, res: Response) => {
  const { classification } = req.query;
  
  let connectors = defenseVerticalService.getAllConnectors();
  
  if (classification && typeof classification === 'string') {
    connectors = connectors.filter(c => c.classification === classification);
  }
  
  res.json({
    count: connectors.length,
    connectors,
  });
});

/**
 * GET /api/v1/defense/connectors/classification/:level
 * Get connectors by classification level
 */
router.get('/connectors/classification/:level', (req: Request, res: Response) => {
  const level = req.params.level as 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP_SECRET';
  const connectors = defenseVerticalService.getConnectorsByClassification(level);
  
  res.json({
    classificationLevel: level,
    count: connectors.length,
    connectors,
  });
});

// =============================================================================
// DELIBERATION INTEGRATION
// =============================================================================

/**
 * POST /api/v1/defense/deliberate
 * Start a defense vertical deliberation
 */
router.post('/deliberate', async (req: Request, res: Response) => {
  const { modeId, query, context, classificationLevel } = req.body;
  
  if (!modeId || !query) {
    return res.status(400).json({ error: 'modeId and query are required' });
  }
  
  const mode = defenseVerticalService.getModeById(modeId);
  if (!mode) {
    return res.status(404).json({ error: 'Mode not found' });
  }
  
  // Build the agent team for this mode
  const defaultAgents = mode.defaultAgents
    .map(id => defenseVerticalService.getAgentById(id))
    .filter(a => a !== undefined);
  
  // Get applicable compliance frameworks
  const complianceFrameworks = defenseVerticalService.getApplicableFrameworks(modeId);
  
  // Return deliberation configuration (actual deliberation handled by CouncilService)
  res.json({
    deliberationConfig: {
      vertical: 'defense',
      mode: {
        id: mode.id,
        name: mode.name,
        primeDirective: mode.primeDirective,
        maxRounds: mode.maxDeliberationRounds,
      },
      agents: defaultAgents.map(a => ({
        id: a!.id,
        name: a!.name,
        role: a!.role,
        systemPrompt: a!.systemPrompt,
      })),
      silentGuards: defenseVerticalService.getSilentGuards().map(g => ({
        id: g.id,
        name: g.name,
        systemPrompt: g.systemPrompt,
      })),
      compliance: {
        frameworks: complianceFrameworks.map(f => f.id),
        opsecRequired: mode.opsecRequired,
        legalReviewRequired: mode.legalReviewRequired,
        classificationLevel: classificationLevel || mode.classificationLevel,
      },
      query,
      context,
    },
    message: 'Deliberation configuration ready. Forward to /api/v1/council/deliberate to execute.',
  });
});

export default router;
