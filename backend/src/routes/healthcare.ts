/**
 * API Routes — Healthcare
 *
 * Express route handler defining REST endpoints.
 * @module routes/healthcare
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  ALL_HEALTHCARE_MODES,
  getHealthcareMode,
  getHealthcareModesByCategory,
  getHealthcareModesByLeadAgent,
  type HealthcareModeCategory,
} from '../services/verticals/healthcare/HealthcareCouncilModes.js';
import {
  ALL_HEALTHCARE_AGENTS,
  getHealthcareAgent,
  getDefaultHealthcareAgents,
  getOptionalHealthcareAgents,
  getSilentGuardHealthcareAgents,
  getHealthcareAgentsByExpertise,
} from '../services/verticals/healthcare/HealthcareAgents.js';

const router = Router();
router.use(devAuth);

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    vertical: 'healthcare',
    modesCount: ALL_HEALTHCARE_MODES.length,
    agentsCount: ALL_HEALTHCARE_AGENTS.length,
    lastActivity: new Date().toISOString(),
  });
});

// =============================================================================
// COUNCIL MODES
// =============================================================================

router.get('/modes', (_req: Request, res: Response): void => {
  res.json({
    modes: ALL_HEALTHCARE_MODES,
    total: ALL_HEALTHCARE_MODES.length,
    categories: ['major', 'clinical', 'regulatory', 'operations', 'samd', 'specialized'],
  });
});

router.get('/modes/:id', (req: Request<{ id: string }>, res: Response): void => {
  const mode = getHealthcareMode(req.params.id);
  if (!mode) {
    res.status(404).json({ error: 'Healthcare mode not found' });
    return;
  }
  res.json(mode);
});

router.get('/modes/category/:category', (req: Request<{ category: string }>, res: Response): void => {
  const category = req.params.category as HealthcareModeCategory;
  const validCategories = ['major', 'clinical', 'regulatory', 'operations', 'samd', 'specialized'];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: 'Invalid category', valid: validCategories });
    return;
  }

  const modes = getHealthcareModesByCategory(category);
  res.json({ modes, total: modes.length, category });
});

router.get('/modes/lead-agent/:agentId', (req: Request<{ agentId: string }>, res: Response): void => {
  const modes = getHealthcareModesByLeadAgent(req.params.agentId);
  res.json({ modes, total: modes.length, leadAgent: req.params.agentId });
});

// =============================================================================
// AGENTS
// =============================================================================

router.get('/agents', (_req: Request, res: Response): void => {
  res.json({
    agents: ALL_HEALTHCARE_AGENTS,
    total: ALL_HEALTHCARE_AGENTS.length,
    categories: ['default', 'optional', 'silent-guard'],
  });
});

router.get('/agents/default', (_req: Request, res: Response): void => {
  const agents = getDefaultHealthcareAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/optional', (_req: Request, res: Response): void => {
  const agents = getOptionalHealthcareAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/silent-guards', (_req: Request, res: Response): void => {
  const agents = getSilentGuardHealthcareAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/expertise/:expertise', (req: Request<{ expertise: string }>, res: Response): void => {
  const agents = getHealthcareAgentsByExpertise(req.params.expertise);
  res.json({ agents, total: agents.length, expertise: req.params.expertise });
});

router.get('/agents/:id', (req: Request<{ id: string }>, res: Response): void => {
  const agent = getHealthcareAgent(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Healthcare agent not found' });
    return;
  }
  res.json(agent);
});

export default router;
