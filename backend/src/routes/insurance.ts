// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  ALL_INSURANCE_MODES,
  getInsuranceMode,
  getInsuranceModesByCategory,
  getInsuranceModesByLeadAgent,
  type InsuranceModeCategory,
} from '../services/verticals/insurance/InsuranceCouncilModes.js';
import {
  ALL_INSURANCE_AGENTS,
  getInsuranceAgent,
  getDefaultInsuranceAgents,
  getOptionalInsuranceAgents,
  getSilentGuardInsuranceAgents,
  getInsuranceAgentsByExpertise,
} from '../services/verticals/insurance/InsuranceAgents.js';

const router = Router();
router.use(devAuth);

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    vertical: 'insurance',
    modesCount: ALL_INSURANCE_MODES.length,
    agentsCount: ALL_INSURANCE_AGENTS.length,
    lastActivity: new Date().toISOString(),
  });
});

// =============================================================================
// COUNCIL MODES
// =============================================================================

router.get('/modes', (_req: Request, res: Response): void => {
  res.json({
    modes: ALL_INSURANCE_MODES,
    total: ALL_INSURANCE_MODES.length,
    categories: ['major', 'underwriting', 'claims', 'actuarial', 'compliance', 'specialized'],
  });
});

router.get('/modes/:id', (req: Request<{ id: string }>, res: Response): void => {
  const mode = getInsuranceMode(req.params.id);
  if (!mode) {
    res.status(404).json({ error: 'Insurance mode not found' });
    return;
  }
  res.json(mode);
});

router.get('/modes/category/:category', (req: Request<{ category: string }>, res: Response): void => {
  const category = req.params.category as InsuranceModeCategory;
  const validCategories = ['major', 'underwriting', 'claims', 'actuarial', 'compliance', 'specialized'];
  if (!validCategories.includes(category)) {
    res.status(400).json({ error: 'Invalid category', valid: validCategories });
    return;
  }

  const modes = getInsuranceModesByCategory(category);
  res.json({ modes, total: modes.length, category });
});

router.get('/modes/lead-agent/:agentId', (req: Request<{ agentId: string }>, res: Response): void => {
  const modes = getInsuranceModesByLeadAgent(req.params.agentId);
  res.json({ modes, total: modes.length, leadAgent: req.params.agentId });
});

// =============================================================================
// AGENTS
// =============================================================================

router.get('/agents', (_req: Request, res: Response): void => {
  res.json({
    agents: ALL_INSURANCE_AGENTS,
    total: ALL_INSURANCE_AGENTS.length,
    categories: ['default', 'optional', 'silent-guard'],
  });
});

router.get('/agents/default', (_req: Request, res: Response): void => {
  const agents = getDefaultInsuranceAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/optional', (_req: Request, res: Response): void => {
  const agents = getOptionalInsuranceAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/silent-guards', (_req: Request, res: Response): void => {
  const agents = getSilentGuardInsuranceAgents();
  res.json({ agents, total: agents.length });
});

router.get('/agents/expertise/:expertise', (req: Request<{ expertise: string }>, res: Response): void => {
  const agents = getInsuranceAgentsByExpertise(req.params.expertise);
  res.json({ agents, total: agents.length, expertise: req.params.expertise });
});

router.get('/agents/:id', (req: Request<{ id: string }>, res: Response): void => {
  const agent = getInsuranceAgent(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Insurance agent not found' });
    return;
  }
  res.json(agent);
});

export default router;
