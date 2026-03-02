// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS API Routes
 * Synthetic Governance Agent System - Decision Verification Infrastructure
 */

import { Router, Request, Response } from 'express';
import {
  sgasOrchestrator,
  decisionAgentsService,
  institutionalAgentsService,
  adversarialAgentsService,
  observerAgentsService,
  metaGovernanceAgentsService,
  DecisionProposal,
  DecisionType,
  DecisionContext,
  BudgetContext,
  HistoricalBaseline,
  Constraint,
  ConstraintType,
  EnforcementLevel,
  InstitutionalState,
  RiskLevel,
  UrgencyLevel,
  SensitivityLevel,
  generateSGASId,
} from '../services/sgas/index.js';

const router = Router();

// =============================================================================
// HEALTH & STATUS
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  const stats = sgasOrchestrator.getStatistics();
  res.json({
    status: 'healthy',
    version: '1.0.0',
    system: 'SGAS - Synthetic Governance Agent System',
    statistics: stats,
    agentCounts: {
      decision: decisionAgentsService.getAgents().length,
      institutional: institutionalAgentsService.getAgents().length,
      adversarial: adversarialAgentsService.getAgents().length,
      observer: observerAgentsService.getAgents().length,
      metaGovernance: metaGovernanceAgentsService.getAgents().length,
    },
  });
});

// =============================================================================
// DELIBERATION ENDPOINTS
// =============================================================================

router.post('/deliberation', async (req: Request, res: Response) => {
  try {
    const { proposal, config, seed } = req.body;

    if (!proposal) {
      return res.status(400).json({ error: 'Proposal is required' });
    }

    // Validate and construct proposal
    const validatedProposal = validateAndConstructProposal(proposal);

    const result = await sgasOrchestrator.executeDeliberation(
      validatedProposal,
      config || {},
      seed
    );

    res.json({
      success: true,
      deliberationId: result.graph.id,
      result: {
        finalStatus: result.finalStatus,
        summary: result.summary,
        graph: {
          id: result.graph.id,
          status: result.graph.status,
          phase: result.graph.phase,
          nodeCount: result.graph.nodes.length,
          edgeCount: result.graph.edges.length,
          deterministicHash: result.graph.deterministicHash,
        },
      },
    });
  } catch (error) {
    console.error('Deliberation error:', error);
    res.status(500).json({ 
      error: 'Deliberation failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/deliberation/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check active first
  const active = sgasOrchestrator.getActiveDeliberation(id);
  if (active) {
    return res.json({
      status: 'in_progress',
      deliberation: {
        id: active.id,
        proposalId: active.proposalId,
        status: active.status,
        phase: active.phase,
        nodeCount: active.nodes.length,
        edgeCount: active.edges.length,
      },
    });
  }

  // Check completed
  const completed = sgasOrchestrator.getCompletedDeliberation(id);
  if (completed) {
    return res.json({
      status: 'completed',
      result: {
        finalStatus: completed.finalStatus,
        summary: completed.summary,
        graph: {
          id: completed.graph.id,
          status: completed.graph.status,
          phase: completed.graph.phase,
          completedAt: completed.graph.completedAt,
          metadata: completed.graph.metadata,
        },
      },
    });
  }

  res.status(404).json({ error: 'Deliberation not found' });
});

router.get('/deliberation/:id/full', (req: Request, res: Response) => {
  const { id } = req.params;
  
  const completed = sgasOrchestrator.getCompletedDeliberation(id);
  if (!completed) {
    return res.status(404).json({ error: 'Completed deliberation not found' });
  }

  // Return full result including all agent outputs
  res.json(completed);
});

router.get('/deliberations', (_req: Request, res: Response) => {
  const deliberations = sgasOrchestrator.listCompletedDeliberations();
  
  res.json({
    count: deliberations.length,
    deliberations: deliberations.map(d => ({
      id: d.graph.id,
      proposalId: d.graph.proposalId,
      status: d.graph.status,
      approved: d.finalStatus.approved,
      blocked: d.finalStatus.blocked,
      completedAt: d.graph.completedAt,
      summary: d.summary,
    })),
  });
});

// =============================================================================
// AGENT ENDPOINTS
// =============================================================================

router.get('/agents', (_req: Request, res: Response) => {
  res.json({
    decision: decisionAgentsService.getAgents().map(a => ({
      id: a.id,
      name: a.name,
      objective: a.objective,
      capabilities: a.capabilities.length,
    })),
    institutional: institutionalAgentsService.getAgents().map(a => ({
      id: a.id,
      name: a.name,
      type: a.institutionType,
      authorities: a.authorities.length,
    })),
    adversarial: adversarialAgentsService.getAgents().map(a => ({
      id: a.id,
      name: a.name,
      attackType: a.attackProfile.type,
      sophistication: a.attackProfile.sophistication,
    })),
    observer: observerAgentsService.getAgents().map(a => ({
      id: a.id,
      name: a.name,
      observationType: a.observationType,
      metrics: a.metrics.length,
    })),
    metaGovernance: metaGovernanceAgentsService.getAgents().map(a => ({
      id: a.id,
      name: a.name,
      patterns: a.detectionPatterns.length,
      metrics: a.governanceMetrics.length,
    })),
  });
});

router.get('/agents/decision', (_req: Request, res: Response) => {
  res.json(decisionAgentsService.getAgents());
});

router.get('/agents/institutional', (_req: Request, res: Response) => {
  res.json(institutionalAgentsService.getAgents());
});

router.get('/agents/adversarial', (_req: Request, res: Response) => {
  res.json(adversarialAgentsService.getAgents());
});

router.get('/agents/observer', (_req: Request, res: Response) => {
  res.json(observerAgentsService.getAgents());
});

router.get('/agents/meta-governance', (_req: Request, res: Response) => {
  res.json(metaGovernanceAgentsService.getAgents());
});

// =============================================================================
// INDIVIDUAL AGENT EXECUTION
// =============================================================================

router.post('/agents/decision/:agentId/execute', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { proposal, seed } = req.body;

    if (!proposal) {
      return res.status(400).json({ error: 'Proposal is required' });
    }

    const validatedProposal = validateAndConstructProposal(proposal);
    const output = await decisionAgentsService.executeAgent(agentId, validatedProposal, seed);

    res.json({ success: true, output });
  } catch (error) {
    res.status(500).json({ 
      error: 'Agent execution failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/agents/institutional/:agentId/execute', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { proposal, decisionOutputs, seed } = req.body;

    if (!proposal || !decisionOutputs) {
      return res.status(400).json({ error: 'Proposal and decisionOutputs are required' });
    }

    const validatedProposal = validateAndConstructProposal(proposal);
    const output = await institutionalAgentsService.executeAgent(
      agentId,
      validatedProposal,
      decisionOutputs,
      seed
    );

    res.json({ success: true, output });
  } catch (error) {
    res.status(500).json({ 
      error: 'Agent execution failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/agents/adversarial/:agentId/execute', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { proposal, institutionalOutputs, seed } = req.body;

    if (!proposal || !institutionalOutputs) {
      return res.status(400).json({ error: 'Proposal and institutionalOutputs are required' });
    }

    const validatedProposal = validateAndConstructProposal(proposal);
    const output = await adversarialAgentsService.executeAgent(
      agentId,
      validatedProposal,
      institutionalOutputs,
      seed
    );

    res.json({ success: true, output });
  } catch (error) {
    res.status(500).json({ 
      error: 'Agent execution failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// =============================================================================
// META-GOVERNANCE ENDPOINTS
// =============================================================================

router.post('/meta-governance/analyze', async (req: Request, res: Response) => {
  try {
    const { seed } = req.body;
    const outputs = await metaGovernanceAgentsService.executeAllAgents(seed);
    const aggregated = metaGovernanceAgentsService.aggregateOutputs(outputs);

    res.json({
      success: true,
      outputs,
      aggregated,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Meta-governance analysis failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/meta-governance/interventions', (_req: Request, res: Response) => {
  const interventions = metaGovernanceAgentsService.getInterventionLog();
  res.json({ interventions });
});

// =============================================================================
// INSTITUTIONAL STATE
// =============================================================================

router.get('/institutional/state', (_req: Request, res: Response) => {
  res.json({ state: institutionalAgentsService.getInstitutionalState() });
});

router.post('/institutional/state', (req: Request, res: Response) => {
  try {
    const { state } = req.body;
    
    if (!Object.values(InstitutionalState).includes(state)) {
      return res.status(400).json({ error: 'Invalid institutional state' });
    }

    institutionalAgentsService.setInstitutionalState(state);
    res.json({ success: true, state });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to set institutional state', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// =============================================================================
// STATISTICS
// =============================================================================

router.get('/statistics', (_req: Request, res: Response) => {
  const stats = sgasOrchestrator.getStatistics();
  res.json(stats);
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function validateAndConstructProposal(input: Partial<DecisionProposal>): DecisionProposal {
  const now = new Date();
  const defaultBudget: BudgetContext = {
    allocated: 0,
    currency: 'USD',
    fiscalYear: new Date().getFullYear().toString(),
    lineItems: [],
    flexibilityPercent: 10,
  };
  const defaultContext: DecisionContext = {
    budget: defaultBudget,
    timeframe: {
      start: now,
      end: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
      milestones: [],
      criticalPath: false,
      flexibilityDays: 14,
    },
    scope: {
      boundaries: ['organizational'],
      exclusions: [],
      authorities: [],
      geographicScope: ['global'],
      organizationalUnits: ['all'],
    },
    stakeholders: [],
    dependencies: [],
    riskTolerance: RiskLevel.MEDIUM,
    institutionalState: InstitutionalState.NORMAL,
  };

  const defaultConstraints: Constraint[] = [
    {
      id: generateSGASId('con'),
      type: ConstraintType.PROCEDURAL,
      name: 'Standard Review Process',
      description: 'Proposal must follow standard review procedures',
      source: 'policy',
      enforcementLevel: EnforcementLevel.SOFT,
      parameters: {},
      exceptions: [],
      effectiveFrom: now,
    },
  ];

  const proposal: DecisionProposal = {
    id: input.id || generateSGASId('prop'),
    timestamp: input.timestamp ? new Date(input.timestamp) : now,
    proposer: input.proposer || 'system',
    title: input.title || 'Untitled Proposal',
    description: input.description || '',
    type: input.type || DecisionType.OPERATIONAL,
    context: {
      ...defaultContext,
      ...(input.context || {}),
      budget: input.context?.budget || defaultBudget,
      timeframe: input.context?.timeframe || defaultContext.timeframe,
      scope: input.context?.scope || defaultContext.scope,
    },
    constraints: input.constraints || defaultConstraints,
    metadata: {
      version: input.metadata?.version || 1,
      previousVersions: input.metadata?.previousVersions || [],
      classifications: input.metadata?.classifications || [],
      tags: input.metadata?.tags || [],
      priority: input.metadata?.priority || 5,
      urgency: input.metadata?.urgency || UrgencyLevel.ROUTINE,
      sensitivity: input.metadata?.sensitivity || SensitivityLevel.INTERNAL,
    },
  };
  
  // Only add historicalBaseline if provided
  if (input.historicalBaseline) {
    proposal.historicalBaseline = input.historicalBaseline;
  }
  
  return proposal;
}

export default router;
