/**
 * API Routes — Veto
 *
 * Express route handler defining REST endpoints.
 * @module routes/veto
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA VETOÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - API ROUTES
// Adversarial Governance Engine endpoints
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import ollama from '../services/ollama.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router: Router = express.Router();

// Health endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'veto', timestamp: new Date().toISOString() } });
});

// =============================================================================
// TYPES
// =============================================================================

interface VetoReview {
  id: string;
  agentId: string;
  agentRole: string;
  status: 'pending' | 'approved' | 'vetoed' | 'conditional';
  riskScore: number;
  confidence: number;
  reasoning: string;
  concerns: any[];
  reviewedAt: Date;
  isBlocking: boolean;
}

interface VetoDecision {
  id: string;
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'vetoed' | 'override_requested';
  reviews: VetoReview[];
  finalDecision?: 'approved' | 'vetoed';
}

// In-memory store; production upgrade: use PostgreSQL
const decisions: Map<string, VetoDecision> = new Map();

// =============================================================================
// VETO AGENTS
// =============================================================================

const VETO_AGENTS = [
  { id: 'veto-ciso', role: 'ciso', name: 'CISO Guardian', vetoThreshold: 70, canBlockAutomatic: true },
  { id: 'veto-ethics', role: 'ethics', name: 'Ethics Arbiter', vetoThreshold: 60, canBlockAutomatic: true },
  { id: 'veto-compliance', role: 'compliance', name: 'Compliance Sentinel', vetoThreshold: 65, canBlockAutomatic: true },
  { id: 'veto-risk', role: 'risk', name: 'Risk Assessor', vetoThreshold: 75, canBlockAutomatic: false },
  { id: 'veto-legal', role: 'legal', name: 'Legal Counsel', vetoThreshold: 70, canBlockAutomatic: true },
  { id: 'veto-finance', role: 'finance', name: 'Financial Guardian', vetoThreshold: 80, canBlockAutomatic: false },
];

// =============================================================================
// ROUTES
// =============================================================================

// Get all veto agents
router.get('/agents', async (_req: Request, res: Response) => {
  try {
    res.json({ agents: VETO_AGENTS });
  } catch (error) {
    logger.error('Failed to get veto agents:', error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

// Submit a proposal for review
router.post('/proposals', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, category, amount } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    const id = `veto-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    
    const decision: VetoDecision = {
      id,
      proposalId: id,
      proposalTitle: title,
      proposalDescription: description,
      submittedBy: userId,
      submittedAt: new Date(),
      status: 'pending',
      reviews: [],
    };

    // Run reviews for relevant agents
    const reviews = await runAgentReviews(decision, category, amount);
    decision.reviews = reviews;

    // Check for automatic vetoes
    const blockingReview = reviews.find(r => r.isBlocking && r.status === 'vetoed');
    if (blockingReview) {
      decision.status = 'vetoed';
      decision.finalDecision = 'vetoed';
    } else if (reviews.every(r => r.status === 'approved')) {
      decision.status = 'approved';
      decision.finalDecision = 'approved';
    }

    decisions.set(id, decision);
    
    logger.info(`Proposal submitted: ${id} - ${title}`);
    res.status(201).json({ decision });
  } catch (error) {
    logger.error('Failed to submit proposal:', error);
    res.status(500).json({ error: 'Failed to submit proposal' });
  }
});

// Get all decisions
router.get('/decisions', authenticate, async (_req: Request, res: Response) => {
  try {
    const allDecisions = Array.from(decisions.values())
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
    res.json({ decisions: allDecisions });
  } catch (error) {
    logger.error('Failed to get decisions:', error);
    res.status(500).json({ error: 'Failed to get decisions' });
  }
});

// Get a specific decision
router.get('/decisions/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const decision = decisions.get(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    res.json({ decision });
  } catch (error) {
    logger.error('Failed to get decision:', error);
    res.status(500).json({ error: 'Failed to get decision' });
  }
});

// Request override
router.post('/decisions/:id/override', authenticate, async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const userId = (req as any).user?.id || 'anonymous';
    const decision = decisions.get(req.params.id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    
    if (decision.status !== 'vetoed') {
      return res.status(400).json({ error: 'Can only request override for vetoed decisions' });
    }

    decision.status = 'override_requested';
    (decision as any).overrideRequested = true;
    (decision as any).overrideRequestedBy = userId;
    (decision as any).overrideReason = reason;

    logger.info(`Override requested for decision: ${decision.id}`);
    res.json({ decision });
  } catch (error) {
    logger.error('Failed to request override:', error);
    res.status(500).json({ error: 'Failed to request override' });
  }
});

// Get metrics
router.get('/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const allDecisions = Array.from(decisions.values());
    
    const metrics = {
      totalProposals: allDecisions.length,
      approvedProposals: allDecisions.filter(d => d.finalDecision === 'approved').length,
      vetoedProposals: allDecisions.filter(d => d.finalDecision === 'vetoed').length,
      pendingProposals: allDecisions.filter(d => d.status === 'pending').length,
      overrideRequests: allDecisions.filter(d => (d as any).overrideRequested).length,
    };

    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function runAgentReviews(
  decision: VetoDecision, 
  _category?: string, 
  _amount?: number
): Promise<VetoReview[]> {
  const reviews: VetoReview[] = [];
  const text = `${decision.proposalTitle} ${decision.proposalDescription}`.toLowerCase();

  // Determine which agents should review based on keywords
  const agentsToReview = VETO_AGENTS.filter(agent => {
    if (text.includes('security') || text.includes('data')) return agent.role === 'ciso';
    if (text.includes('compliance') || text.includes('gdpr')) return agent.role === 'compliance';
    if (text.includes('ethical') || text.includes('ai')) return agent.role === 'ethics';
    return agent.role === 'risk'; // Default to risk assessment
  });

  // If no specific agents matched, use risk
  if (agentsToReview.length === 0) {
    agentsToReview.push(VETO_AGENTS.find(a => a.role === 'risk')!);
  }

  for (const agent of agentsToReview) {
    const review = await runSingleReview(decision, agent);
    reviews.push(review);
  }

  return reviews;
}

async function runSingleReview(
  decision: VetoDecision,
  agent: typeof VETO_AGENTS[0]
): Promise<VetoReview> {
  let riskScore = 30;
  let reasoning = '';
  let status: VetoReview['status'] = 'approved';
  const concerns: any[] = [];

  // Try Ollama if available
  const ollamaAvailable = await ollama.isAvailable();
  
  if (ollamaAvailable) {
    try {
      const prompt = `You are the ${agent.name} reviewing a proposal.

Proposal: "${decision.proposalTitle}"
Description: "${decision.proposalDescription}"

Analyze for risks in your domain. Respond with JSON:
{
  "riskScore": 0-100,
  "status": "approved" or "vetoed" or "conditional",
  "reasoning": "your reasoning"
}`;

      const response = await ollama.generate(prompt, { model: 'llama3.2:latest' });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        riskScore = parsed.riskScore || 30;
        reasoning = parsed.reasoning || '';
        status = parsed.status || 'approved';
      }
    } catch (error) {
      logger.error('Ollama review failed:', error);
    }
  }

  // Fallback logic
  if (!reasoning) {
    const text = `${decision.proposalTitle} ${decision.proposalDescription}`.toLowerCase();
    
    if (text.includes('delete') || text.includes('remove')) riskScore += 20;
    if (text.includes('customer data') || text.includes('pii')) riskScore += 30;
    if (text.includes('layoff') || text.includes('terminate')) riskScore += 25;
    
    reasoning = `${agent.name} assessed risk at ${riskScore}/100`;
  }

  const isBlocking = agent.canBlockAutomatic && riskScore >= agent.vetoThreshold;
  if (isBlocking) status = 'vetoed';

  return {
    id: `review-${Date.now()}`,
    agentId: agent.id,
    agentRole: agent.role,
    status,
    riskScore,
    confidence: 75,
    reasoning,
    concerns,
    reviewedAt: new Date(),
    isBlocking,
  };
}

export default router;
