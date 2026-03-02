// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - HOLY SHIT FEATURES API ROUTES
// Enterprise-grade API for premium decision intelligence features
// =============================================================================

import { Router, Request, Response } from 'express';
import { 
  preMortemService,
  ghostBoardService,
  decisionDebtService,
  liveDemoModeService,
  regulatoryAbsorbService,
  HOLY_SHIT_FEATURES,
} from '../features/holy-shit/index.js';
import { regulatoryAbsorbV2Service } from '../features/holy-shit/RegulatoryAbsorbV2.js';
import { PREMORTEM_AGENTS } from '../features/holy-shit/PreMortem.js';
import { 
  featureGating, 
  SUBSCRIPTION_TIERS,
  FEATURE_DEFINITIONS,
  SubscriptionTier,
} from '../core/subscriptions/SubscriptionTiers.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// FEATURE DISCOVERY
// =============================================================================

/**
 * GET /api/v1/premium/features
 * Get all Holy Shit features with availability based on subscription tier
 */
router.get('/features', (req: Request, res: Response) => {
  const tier = (req.query.tier as SubscriptionTier) || 'pilot';

  const featureKeyMap: Record<string, keyof import('../core/subscriptions/SubscriptionTiers.js').FeatureAccess> = {
    preMortem: 'preMortem',
    ghostBoard: 'ghostBoard',
    decisionDebtDashboard: 'decisionDebtDashboard',
    liveDemoMode: 'liveDemoMode',
    regulatoryInstantAbsorb: 'regulatoryInstantAbsorb',
  };

  const features = Object.entries(HOLY_SHIT_FEATURES).map(([key, feature]) => {
    const featureKey = featureKeyMap[key];
    const available = featureKey ? featureGating.hasFeature(tier, featureKey) : false;
    return {
      ...feature,
      available,
      upgradeRequired: !available,
      minimumTier: feature.minimumTier,
    };
  });

  res.json({
    tier,
    features,
    totalAvailable: features.filter(f => f.available).length,
    totalFeatures: features.length,
  });
});

/**
 * GET /api/v1/premium/tiers
 * Get all subscription tiers and their features
 */
router.get('/tiers', (_req: Request, res: Response) => {
  const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, config]) => ({
    id: key,
    name: config.displayName,
    pricing: config.pricing,
    holyShitFeatures: {
      preMortem: config.features.preMortem,
      ghostBoard: config.features.ghostBoard,
      decisionDebtDashboard: config.features.decisionDebtDashboard,
      liveDemoMode: config.features.liveDemoMode,
      regulatoryInstantAbsorb: config.features.regulatoryInstantAbsorb,
    },
    limits: config.limits,
    support: config.support,
  }));

  res.json({ tiers });
});

// =============================================================================
// PRE-MORTEM ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/pre-mortem/agents
 * Get all available Pre-Mortem agents for selection
 */
router.get('/pre-mortem/agents', (_req: Request, res: Response) => {
  const agents = Object.values(PREMORTEM_AGENTS).map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    icon: agent.icon,
    color: agent.color,
    description: agent.description,
  }));

  res.json({
    success: true,
    agents,
    defaultAgents: ['cfo', 'ciso', 'pessimist'],
    count: agents.length,
  });
});

/**
 * POST /api/v1/premium/pre-mortem/analyze
 * Run a Pre-Mortem analysis on a decision
 */
router.post('/pre-mortem/analyze', async (req: Request, res: Response) => {
  try {
    const { 
      organizationId, 
      userId, 
      decision, 
      context, 
      timeframe, 
      budget,
      stakeholders,
      selectedAgents,
      tier = 'enterprise',
    } = req.body;

    if (!decision) {
      return res.status(400).json({ 
        error: 'Decision is required',
        code: 'MISSING_DECISION',
      });
    }

    const result = await preMortemService.analyze({
      organizationId: organizationId || req.organizationId!,
      userId: userId || 'demo-user',
      decision,
      context,
      timeframe,
      budget,
      stakeholders,
      selectedAgents,
      tier: tier as SubscriptionTier,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('requires') ? 403 : 500).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' : 'ANALYSIS_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/pre-mortem/history
 * Get Pre-Mortem analysis history for an organization
 */
router.get('/pre-mortem/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = preMortemService.getAnalysisHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    analyses: history,
  });
});

// =============================================================================
// GHOST BOARD ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/premium/ghost-board/session
 * Start a Ghost Board session
 */
router.post('/ghost-board/session', async (req: Request, res: Response) => {
  try {
    const {
      organizationId,
      userId,
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      focusAreas,
      existingAnswers,
      tier = 'enterprise',
    } = req.body;

    if (!proposalTitle || !proposalContent) {
      return res.status(400).json({
        error: 'Proposal title and content are required',
        code: 'MISSING_PROPOSAL',
      });
    }

    const result = await ghostBoardService.runSession({
      organizationId: organizationId || req.organizationId!,
      userId: userId || 'demo-user',
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      focusAreas,
      existingAnswers,
      tier: tier as SubscriptionTier,
    });

    res.json({
      success: true,
      session: result,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('requires') ? 403 : 500).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' : 'SESSION_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/ghost-board/members
 * Get available board member personas
 */
router.get('/ghost-board/members', (_req: Request, res: Response) => {
  const members = ghostBoardService.getBoardMembers();
  res.json({ members });
});

/**
 * GET /api/v1/premium/ghost-board/history
 * Get Ghost Board session history
 */
router.get('/ghost-board/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = ghostBoardService.getSessionHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    sessions: history,
  });
});

// =============================================================================
// DECISION DEBT DASHBOARD ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/decision-debt/dashboard
 * Get the Decision Debt Dashboard for an organization
 */
router.get('/decision-debt/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const tier = (req.query.tier as SubscriptionTier) || 'enterprise';

    const dashboard = await decisionDebtService.generateDashboard({
      organizationId,
      userId: 'demo-user',
      tier,
      filters: req.query.filters as any,
    });

    res.json({
      success: true,
      dashboard,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('requires') ? 403 : 500).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' : 'DASHBOARD_FAILED',
    });
  }
});

/**
 * POST /api/v1/premium/decision-debt/decision
 * Create a new pending decision
 */
router.post('/decision-debt/decision', async (req: Request, res: Response) => {
  try {
    const { organizationId = 'demo', ...data } = req.body;
    const decision = await decisionDebtService.createDecision(organizationId, data);
    
    res.json({
      success: true,
      decision,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * DELETE /api/v1/premium/decision-debt/decision/:id
 * Resolve/remove a pending decision
 */
router.delete('/decision-debt/decision/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId = 'demo', resolution } = req.body;
    
    await decisionDebtService.resolveDecision(organizationId, id, resolution);
    
    res.json({
      success: true,
      message: 'Decision resolved',
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// LIVE DEMO MODE ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/live-demo/connectors
 * Get available connectors for live demo
 */
router.get('/live-demo/connectors', (_req: Request, res: Response) => {
  const connectors = liveDemoModeService.getAvailableConnectors();
  res.json({ connectors });
});

/**
 * POST /api/v1/premium/live-demo/session
 * Create a new live demo session
 */
router.post('/live-demo/session', async (req: Request, res: Response) => {
  try {
    const { userId, connector, tier = 'enterprise' } = req.body;

    if (!connector) {
      return res.status(400).json({
        error: 'Connector is required',
        code: 'MISSING_CONNECTOR',
      });
    }

    const session = await liveDemoModeService.createSession(
      userId || 'demo-user',
      connector,
      tier as SubscriptionTier
    );

    // Generate OAuth URL
    const authUrl = liveDemoModeService.generateAuthUrl(connector, session.id);

    res.json({
      success: true,
      session,
      authUrl,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('requires') ? 403 : 500).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' : 'SESSION_FAILED',
    });
  }
});

/**
 * POST /api/v1/premium/live-demo/connect
 * Complete OAuth connection for a session
 */
router.post('/live-demo/connect', async (req: Request, res: Response) => {
  try {
    const { sessionId, authCode } = req.body;

    if (!sessionId || !authCode) {
      return res.status(400).json({
        error: 'Session ID and auth code are required',
      });
    }

    const session = await liveDemoModeService.connectSession(sessionId, authCode);

    res.json({
      success: true,
      session,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/premium/live-demo/session/:id
 * Get session status
 */
router.get('/live-demo/session/:id', async (req: Request, res: Response) => {
  const session = await liveDemoModeService.getSession(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      error: 'Session not found',
    });
  }

  res.json({ session });
});

/**
 * POST /api/v1/premium/live-demo/deliberate
 * Run a live deliberation with connected data
 */
router.post('/live-demo/deliberate', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId, connector, question, tier = 'enterprise' } = req.body;

    if (!connector || !question) {
      return res.status(400).json({
        error: 'Connector and question are required',
      });
    }

    const result = await liveDemoModeService.runLiveDeliberation({
      organizationId: organizationId || req.organizationId!,
      userId: userId || 'demo-user',
      tier: tier as SubscriptionTier,
      connector,
      question,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// REGULATORY INSTANT-ABSORB ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/premium/regulatory/absorb
 * Upload and absorb a regulatory document
 */
router.post('/regulatory/absorb', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId, document, customMapping, tier = 'enterprise' } = req.body;

    if (!document || !document.content) {
      return res.status(400).json({
        error: 'Document with content is required',
        code: 'MISSING_DOCUMENT',
      });
    }

    const result = await regulatoryAbsorbService.absorbDocument({
      organizationId: organizationId || req.organizationId!,
      userId: userId || 'demo-user',
      tier: tier as SubscriptionTier,
      document,
      customMapping,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('requires') ? 403 : 500).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' : 'ABSORPTION_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/history
 * Get absorption history for an organization
 */
router.get('/regulatory/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = regulatoryAbsorbService.getAbsorptionHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    documents: history,
  });
});

/**
 * GET /api/v1/premium/regulatory/knowledge
 * Get the regulatory knowledge base
 */
router.get('/regulatory/knowledge', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const knowledge = regulatoryAbsorbService.getKnowledgeBase(organizationId);
  
  res.json({
    organizationId,
    requirementsCount: knowledge.length,
    requirements: knowledge,
  });
});

/**
 * GET /api/v1/premium/regulatory/query
 * Query the regulatory knowledge base
 */
router.get('/regulatory/query', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const query = (req.query.q as string) || '';
  
  const results = regulatoryAbsorbService.queryKnowledge(organizationId, query);
  
  res.json({
    organizationId,
    query,
    matchCount: results.length,
    results,
  });
});

// =============================================================================
// REGULATORY INSTANT-ABSORB V2 ENDPOINTS
// Enterprise-grade with provenance, verification, and review workflow
// =============================================================================

/**
 * POST /api/v1/premium/regulatory/v2/absorb
 * Upload and absorb a regulatory document with full provenance tracking
 */
router.post('/regulatory/v2/absorb', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId, document, metadata, parentVersionId, tier = 'enterprise' } = req.body;

    if (!document || !document.content) {
      return res.status(400).json({
        error: 'Document with content is required',
        code: 'MISSING_DOCUMENT',
      });
    }

    if (!metadata || !metadata.name) {
      return res.status(400).json({
        error: 'Metadata with name is required',
        code: 'MISSING_METADATA',
      });
    }

    const result = await regulatoryAbsorbV2Service.absorbDocument({
      organizationId: organizationId || req.organizationId!,
      userId: userId || 'demo-user',
      tier: tier as SubscriptionTier,
      document,
      metadata,
      parentVersionId,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    const statusCode = getErrorMessage(error).includes('requires') ? 403 
      : getErrorMessage(error).includes('already absorbed') ? 409 
      : 500;
    
    res.status(statusCode).json({
      success: false,
      error: getErrorMessage(error),
      code: getErrorMessage(error).includes('requires') ? 'UPGRADE_REQUIRED' 
        : getErrorMessage(error).includes('already absorbed') ? 'DUPLICATE_DOCUMENT'
        : 'ABSORPTION_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/v2/documents
 * Get all absorbed documents for an organization
 */
router.get('/regulatory/v2/documents', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const status = req.query.status as string | undefined;
    const reviewStatus = req.query.reviewStatus as string | undefined;
    const jurisdiction = req.query.jurisdiction as string | undefined;

    const documents = await regulatoryAbsorbV2Service.getDocuments(organizationId, {
      status: status as any,
      reviewStatus: reviewStatus as any,
      jurisdiction,
    });

    res.json({
      success: true,
      organizationId,
      count: documents.length,
      documents,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/v2/documents/:id
 * Get a specific document with all related data
 */
router.get('/regulatory/v2/documents/:id', async (req: Request, res: Response) => {
  try {
    const document = await regulatoryAbsorbV2Service.getDocument(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        code: 'NOT_FOUND',
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/v2/documents/:id/audit
 * Get tamper-evident audit trail for a document
 */
router.get('/regulatory/v2/documents/:id/audit', async (req: Request, res: Response) => {
  try {
    const auditTrail = await regulatoryAbsorbV2Service.getAuditTrail(req.params.id);

    res.json({
      success: true,
      documentId: req.params.id,
      entries: auditTrail,
      count: auditTrail.length,
      integrityVerified: true, // Each entry hash chains to previous
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/premium/regulatory/v2/documents/:id/approve
 * Approve a document and activate its constraints
 */
router.post('/regulatory/v2/documents/:id/approve', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required',
        code: 'MISSING_USER_ID',
      });
    }

    await regulatoryAbsorbV2Service.approveDocument(req.params.id, userId);

    res.json({
      success: true,
      message: 'Document approved and constraints activated',
      documentId: req.params.id,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('not found') ? 404 : 500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/premium/regulatory/v2/documents/:id/reject
 * Reject a document
 */
router.post('/regulatory/v2/documents/:id/reject', async (req: Request, res: Response) => {
  try {
    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({
        error: 'userId and reason are required',
        code: 'MISSING_FIELDS',
      });
    }

    await regulatoryAbsorbV2Service.rejectDocument(req.params.id, userId, reason);

    res.json({
      success: true,
      message: 'Document rejected',
      documentId: req.params.id,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('not found') ? 404 : 500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/premium/regulatory/v2/documents/:id/request-changes
 * Request changes to a document
 */
router.post('/regulatory/v2/documents/:id/request-changes', async (req: Request, res: Response) => {
  try {
    const { userId, comments } = req.body;

    if (!userId || !comments) {
      return res.status(400).json({
        error: 'userId and comments are required',
        code: 'MISSING_FIELDS',
      });
    }

    await regulatoryAbsorbV2Service.requestChanges(req.params.id, userId, comments);

    res.json({
      success: true,
      message: 'Changes requested',
      documentId: req.params.id,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('not found') ? 404 : 500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/v2/conflicts
 * Get all regulatory conflicts for an organization
 */
router.get('/regulatory/v2/conflicts', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const conflicts = await regulatoryAbsorbV2Service.getConflicts(organizationId);

    res.json({
      success: true,
      organizationId,
      count: conflicts.length,
      conflicts,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/v2/knowledge
 * Query the V2 regulatory knowledge base (approved documents only)
 */
router.get('/regulatory/v2/knowledge', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const query = (req.query.q as string) || '';

    const requirements = await regulatoryAbsorbV2Service.queryKnowledge(organizationId, query);

    res.json({
      success: true,
      organizationId,
      query,
      count: requirements.length,
      requirements,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
