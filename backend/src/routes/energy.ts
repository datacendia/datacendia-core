// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  ALL_ENERGY_MODES,
  getEnergyMode,
  getEnergyModesByCategory,
  getEnergyModesByLeadAgent,
  type EnergyModeCategory,
} from '../services/verticals/energy/EnergyCouncilModes.js';
import {
  ALL_ENERGY_AGENTS,
  getEnergyAgent,
  getDefaultEnergyAgents,
  getOptionalEnergyAgents,
  getSilentGuardEnergyAgents,
  getEnergyAgentsByExpertise,
} from '../services/verticals/energy/EnergyAgents.js';

const router = Router();
router.use(devAuth);

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    vertical: 'energy',
    modesCount: ALL_ENERGY_MODES.length,
    agentsCount: ALL_ENERGY_AGENTS.length,
    lastActivity: new Date().toISOString(),
  });
});

// =============================================================================
// COUNCIL MODES
// =============================================================================

router.get('/modes', (_req: Request, res: Response): void => {
  res.json({
    modes: ALL_ENERGY_MODES,
    total: ALL_ENERGY_MODES.length,
    categories: ['major', 'grid', 'safety', 'compliance', 'assets', 'specialized'],
  });
});

router.get('/modes/:id', (req: Request<{ id: string }>, res: Response): void => {
  const mode = getEnergyMode(req.params.id);
  if (!mode) {
    res.status(404).json({ error: 'Energy mode not found' });
    return;
  }
  res.json(mode);
});

router.get('/modes/category/:category', (req: Request<{ category: string }>, res: Response): void => {
  const category = req.params.category as EnergyModeCategory;
  const validCategories = ['major', 'grid', 'safety', 'compliance', 'assets', 'specialized'];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: 'Invalid category', valid: validCategories });
    return;
  }

  const modes = getEnergyModesByCategory(category);
  res.json({ modes, total: modes.length, category });
});

router.get('/modes/lead-agent/:agentId', (req: Request<{ agentId: string }>, res: Response): void => {
  const modes = getEnergyModesByLeadAgent(req.params.agentId);
  res.json({ modes, total: modes.length, leadAgent: req.params.agentId });
});

// =============================================================================
// AGENTS
// =============================================================================

router.get('/agents', (_req: Request, res: Response): void => {
  res.json({
    agents: ALL_ENERGY_AGENTS,
    total: ALL_ENERGY_AGENTS.length,
    categories: ['default', 'optional', 'silent-guard'],
  });
});

router.get('/agents/default', (_req: Request, res: Response): void => {
  const agents = getDefaultEnergyAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/optional', (_req: Request, res: Response): void => {
  const agents = getOptionalEnergyAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/silent-guards', (_req: Request, res: Response): void => {
  const agents = getSilentGuardEnergyAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/expertise/:expertise', (req: Request<{ expertise: string }>, res: Response): void => {
  const agents = getEnergyAgentsByExpertise(req.params.expertise);
  res.json({ agents, total: agents.length, expertise: req.params.expertise });
});

router.get('/agents/:id', (req: Request<{ id: string }>, res: Response): void => {
  const agent = getEnergyAgent(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Energy agent not found' });
    return;
  }
  res.json(agent);
});

export default router;
