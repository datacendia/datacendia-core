/**
 * API Routes — Cascade
 *
 * Express route handler defining REST endpoints.
 * @module routes/cascade
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA CASCADE API ROUTES
 * =============================================================================
 * The Butterfly Effect - Second/Third-Order Consequence Analysis
 * 
 * Endpoints:
 * - POST   /analyze              - Analyze a proposed change
 * - GET    /reports              - List all cascade reports
 * - GET    /reports/:id          - Get a specific report
 * - PATCH  /reports/:id/status   - Update report status
 * - POST   /reports/:id/sign     - Sign a report
 * - GET    /reports/:id/timeline - Get cascade timeline visualization
 * - GET    /reports/:id/evidence - Get evidence bundle
 * 
 * Graph Management:
 * - POST   /graph/load           - Load organization graph
 * - GET    /graph/stats          - Get graph statistics
 * - POST   /graph/nodes          - Add a node
 * - POST   /graph/edges          - Add an edge
 * - GET    /graph/critical       - Get critical nodes
 * - GET    /graph/loops          - Find feedback loops
 * 
 * Orbit (Engine) Endpoints:
 * - POST   /orbit/run            - Run raw propagation
 * - GET    /orbit/runs           - List orbit runs
 * - GET    /orbit/runs/:id       - Get orbit run result
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import {
  cendiaHorizonService as cascadeService,
  ChangeSpec,
  ChangeType,
  NodeType,
  EdgeType,
} from '../services/CendiaHorizonService.js';

// Get orbit service from the merged horizon service
const orbitService = cascadeService.getOrbitService();

const router = Router();

// =============================================================================
// STATUS & HEALTH
// =============================================================================

/**
 * Get Cascade service status
 * GET /api/v1/cascade/status
 */
router.get('/status', (_req: Request, res: Response) => {
  const stats = cascadeService.getGraphStats();
  const reports = cascadeService.listCascadeReports();
  const runs = orbitService.listRuns();

  res.json({
    service: 'CendiaCascade',
    version: '1.0.0',
    status: 'operational',
    description: 'Second/Third-Order Consequence Analysis (The Butterfly Effect)',
    capabilities: [
      'multi-lens-analysis',
      'butterfly-detection',
      'mitigation-generation',
      'guardrail-proposals',
      'evidence-hashing',
      'timeline-visualization',
    ],
    graph: {
      nodeCount: stats.nodeCount,
      edgeCount: stats.edgeCount,
      avgDegree: stats.avgDegree,
      loaded: stats.nodeCount > 0,
    },
    reports: {
      total: reports.length,
      byStatus: {
        draft: reports.filter(r => r.status === 'draft').length,
        in_review: reports.filter(r => r.status === 'in_review').length,
        approved: reports.filter(r => r.status === 'approved').length,
        rejected: reports.filter(r => r.status === 'rejected').length,
        executed: reports.filter(r => r.status === 'executed').length,
      },
    },
    orbitRuns: runs.length,
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// CHANGE ANALYSIS
// =============================================================================

/**
 * Analyze a proposed change
 * POST /api/v1/cascade/analyze
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const changeSpec: ChangeSpec = req.body;

    // Validate required fields
    if (!changeSpec.type || !changeSpec.title || !changeSpec.description) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['type', 'title', 'description', 'affectedAssets'],
      });
      return;
    }

    if (!changeSpec.affectedAssets || changeSpec.affectedAssets.length === 0) {
      res.status(400).json({
        error: 'At least one affected asset must be specified',
      });
      return;
    }

    // Validate change type
    if (!Object.values(ChangeType).includes(changeSpec.type)) {
      res.status(400).json({
        error: 'Invalid change type',
        validTypes: Object.values(ChangeType),
      });
      return;
    }

    const report = await cascadeService.analyzeChange(changeSpec);

    res.status(201).json({
      success: true,
      report,
      summary: {
        totalConsequences: report.consequences.length,
        directImpacts: report.consequences.filter(c => c.order === 1).length,
        rippleEffects: report.consequences.filter(c => c.order === 2).length,
        butterflyEffects: report.consequences.filter(c => c.order >= 3).length,
        recommendation: report.recommendation,
        totalRiskScore: report.totalRiskScore,
      },
    });

  } catch (error) {
    logger.error('Cascade analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: (error as Error).message,
    });
  }
});

// =============================================================================
// REPORT MANAGEMENT
// =============================================================================

/**
 * List all cascade reports
 * GET /api/v1/cascade/reports
 */
router.get('/reports', (_req: Request, res: Response) => {
  const reports = cascadeService.listCascadeReports();
  
  res.json({
    count: reports.length,
    reports: reports.map(r => ({
      id: r.id,
      title: r.changeSpec.title,
      type: r.changeSpec.type,
      status: r.status,
      recommendation: r.recommendation,
      totalRiskScore: r.totalRiskScore,
      consequenceCount: r.consequences.length,
      timestamp: r.timestamp,
    })),
  });
});

/**
 * Get a specific report
 * GET /api/v1/cascade/reports/:id
 */
router.get('/reports/:id', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  res.json(report);
});

/**
 * Update report status
 * PATCH /api/v1/cascade/reports/:id/status
 */
router.patch('/reports/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  
  const validStatuses = ['draft', 'in_review', 'approved', 'rejected', 'executed'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({
      error: 'Invalid status',
      validStatuses,
    });
    return;
  }

  try {
    cascadeService.updateCascadeReportStatus(req.params['id'], status);
    res.json({ success: true, status });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
});

/**
 * Sign a report
 * POST /api/v1/cascade/reports/:id/sign
 */
router.post('/reports/:id/sign', async (req: Request, res: Response) => {
  const { signerId } = req.body;
  
  if (!signerId) {
    res.status(400).json({ error: 'signerId is required' });
    return;
  }

  try {
    await cascadeService.signCascadeReport(req.params['id'], signerId);
    res.json({ success: true, signedBy: signerId, signedAt: new Date() });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
});

/**
 * Get cascade timeline visualization data
 * GET /api/v1/cascade/reports/:id/timeline
 */
router.get('/reports/:id/timeline', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  // Format for visualization
  const timelineData = {
    change: {
      title: report.changeSpec.title,
      date: report.timeline.tZero.date,
    },
    waves: [
      {
        label: 'T+0: Decision',
        date: report.timeline.tZero.date,
        effects: report.timeline.tZero.directEffects,
        color: '#3b82f6',
      },
      {
        label: 'T+30 Days',
        date: report.timeline.tShort.date,
        effects: report.timeline.tShort.effects.map(e => ({
          name: e.nodeName,
          severity: e.severity,
          category: e.category,
        })),
        color: '#f59e0b',
      },
      {
        label: 'T+90 Days',
        date: report.timeline.tMedium.date,
        effects: report.timeline.tMedium.effects.map(e => ({
          name: e.nodeName,
          severity: e.severity,
          category: e.category,
        })),
        color: '#ef4444',
      },
      {
        label: 'T+1 Year',
        date: report.timeline.tLong.date,
        effects: report.timeline.tLong.effects.map(e => ({
          name: e.nodeName,
          severity: e.severity,
          category: e.category,
        })),
        color: '#8b5cf6',
      },
    ],
    butterflyEffect: report.butterflyEffect ? {
      node: report.butterflyEffect.nodeName,
      description: report.butterflyEffect.description,
      path: report.butterflyEffect.pathDescription,
      latencyDays: report.butterflyEffect.latencyDays,
    } : null,
  };

  res.json(timelineData);
});

/**
 * Get evidence bundle for a report
 * GET /api/v1/cascade/reports/:id/evidence
 */
router.get('/reports/:id/evidence', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const evidence = {
    reportId: report.id,
    changeSpec: report.changeSpec,
    analysisTimestamp: report.timestamp,
    
    // Consequence chain
    consequenceChain: report.consequences.map(c => ({
      node: c.nodeName,
      order: c.order,
      severity: c.severity,
      likelihood: c.likelihood,
      evidenceBasis: c.evidenceBasis,
      path: c.pathDescription,
    })),
    
    // Mitigations proposed
    mitigations: report.mitigations,
    
    // Guardrails configured
    guardrails: report.guardrails,
    
    // Recommendation
    recommendation: {
      action: report.recommendation,
      rationale: report.rationale,
      requiredApprovals: report.requiredApprovals,
    },
    
    // Signatures
    integrity: {
      evidenceHash: report.evidenceHash,
      signedBy: report.signedBy,
      signedAt: report.signedAt,
    },
    
    // Reproducibility
    reproducibility: {
      orbitRunId: report.orbitRunId,
      graphStatsAtAnalysis: cascadeService.getGraphStats(),
    },
  };

  res.json(evidence);
});

// =============================================================================
// EXECUTIVE PDF EXPORT
// =============================================================================

/**
 * Generate Executive PDF report (boardroom-ready artifact)
 * GET /api/v1/cascade/reports/:id/export/executive
 */
router.get('/reports/:id/export/executive', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  // Top 10 consequences ranked by risk score
  const topConsequences = [...report.consequences]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  // Build executive summary structure
  const executiveSummary = {
    metadata: {
      reportId: report.id,
      generatedAt: new Date().toISOString(),
      format: 'executive-summary',
      version: '1.0',
    },

    changeOverview: {
      title: report.changeSpec.title,
      type: report.changeSpec.type,
      description: report.changeSpec.description,
      expectedBenefit: report.changeSpec.expectedBenefit,
      affectedAssets: report.changeSpec.affectedAssets,
      proposedBy: report.changeSpec.proposedBy || 'Unknown',
      proposedAt: report.changeSpec.proposedAt,
    },

    executiveDecision: {
      recommendation: report.recommendation,
      recommendationLabel: {
        proceed: '✅ PROCEED - Acceptable risk profile',
        proceed_with_caution: '⚠️ PROCEED WITH CAUTION - Enhanced monitoring required',
        reconsider: '🔄 RECONSIDER - Explore alternatives recommended',
        reject: '❌ REJECT - Unacceptable risk level',
      }[report.recommendation],
      rationale: report.rationale,
      requiredApprovals: report.requiredApprovals || [],
      totalRiskScore: report.totalRiskScore,
    },

    consequenceSummary: {
      total: report.consequences.length,
      byOrder: {
        direct: report.consequences.filter(c => c.order === 1).length,
        ripple: report.consequences.filter(c => c.order === 2).length,
        butterfly: report.consequences.filter(c => c.order >= 3).length,
      },
      bySeverity: {
        critical: report.consequences.filter(c => c.severity === 'critical').length,
        high: report.consequences.filter(c => c.severity === 'high').length,
        moderate: report.consequences.filter(c => c.severity === 'moderate').length,
        low: report.consequences.filter(c => c.severity === 'low').length,
        minimal: report.consequences.filter(c => c.severity === 'minimal').length,
      },
    },

    topTenConsequences: topConsequences.map((c, idx) => ({
      rank: idx + 1,
      node: c.nodeName,
      type: c.nodeType,
      category: c.category,
      order: c.order === 1 ? 'Direct' : c.order === 2 ? 'Ripple' : 'Butterfly',
      severity: c.severity.toUpperCase(),
      likelihood: c.likelihood.replace(/_/g, ' '),
      riskScore: c.riskScore,
      latencyDays: c.latencyDays,
      description: c.description,
      evidenceBasis: c.evidenceBasis,
      path: c.pathDescription,
    })),

    butterflyEffect: report.butterflyEffect ? {
      detected: true,
      node: report.butterflyEffect.nodeName,
      description: report.butterflyEffect.description,
      order: report.butterflyEffect.order,
      latencyDays: report.butterflyEffect.latencyDays,
      severity: report.butterflyEffect.severity,
      path: report.butterflyEffect.pathDescription,
      warning: 'This is an unexpected long-range consequence that may not be immediately obvious.',
    } : {
      detected: false,
      message: 'No significant butterfly effects detected.',
    },

    mitigationPlan: {
      total: report.mitigations.length,
      byType: {
        prevent: report.mitigations.filter(m => m.type === 'prevent').length,
        detect: report.mitigations.filter(m => m.type === 'detect').length,
        respond: report.mitigations.filter(m => m.type === 'respond').length,
        transfer: report.mitigations.filter(m => m.type === 'transfer').length,
      },
      items: report.mitigations.slice(0, 10).map(m => ({
        type: m.type.toUpperCase(),
        description: m.description,
        implementation: m.implementation,
        effectiveness: `${Math.round(m.effectivenessScore * 100)}%`,
      })),
    },

    guardrails: {
      total: report.guardrails.length,
      items: report.guardrails.map(g => ({
        type: g.type.replace(/_/g, ' ').toUpperCase(),
        condition: g.condition,
        action: g.action,
        threshold: g.threshold,
      })),
    },

    timeline: {
      tZero: {
        label: 'T+0: Decision Made',
        date: report.timeline.tZero.date,
        directEffects: report.timeline.tZero.directEffects.slice(0, 5),
      },
      tShort: {
        label: 'T+30 Days',
        date: report.timeline.tShort.date,
        effectCount: report.timeline.tShort.effects.length,
      },
      tMedium: {
        label: 'T+90 Days',
        date: report.timeline.tMedium.date,
        effectCount: report.timeline.tMedium.effects.length,
      },
      tLong: {
        label: 'T+1 Year',
        date: report.timeline.tLong.date,
        effectCount: report.timeline.tLong.effects.length,
      },
    },

    alternatives: report.alternatives?.map(a => ({
      description: a.description,
      riskReduction: a.riskDelta < 0 ? `${Math.abs(a.riskDelta)}% lower risk` : `${a.riskDelta}% higher risk`,
      tradeoffs: a.tradeoffs,
    })) || [],

    evidence: {
      reportId: report.id,
      evidenceHash: report.evidenceHash,
      signedBy: report.signedBy || 'Unsigned',
      signedAt: report.signedAt,
      verificationEndpoint: '/api/v1/cascade/reports/' + report.id + '/evidence',
      orbitRunId: report.orbitRunId,
      analysisTimestamp: report.timestamp,
    },

    disclaimers: [
      'This analysis is based on the organization graph loaded at analysis time.',
      'Confidence levels indicate the certainty of the propagation path, not the certainty of the outcome.',
      'Consequences marked as "assumed" have lower evidentiary support and should be validated.',
      'This report does not constitute legal, financial, or strategic advice.',
    ],
  };

  res.json(executiveSummary);
});

/**
 * Get explainability details for a consequence
 * GET /api/v1/cascade/reports/:id/explain/:nodeId
 */
router.get('/reports/:id/explain/:nodeId', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const consequence = report.consequences.find(c => c.nodeId === req.params.nodeId);
  
  if (!consequence) {
    res.status(404).json({ error: 'Consequence not found for this node' });
    return;
  }

  // Build explainability breakdown
  const explanation = {
    consequence: {
      nodeId: consequence.nodeId,
      nodeName: consequence.nodeName,
      nodeType: consequence.nodeType,
      category: consequence.category,
    },
    
    impactCalculation: {
      severity: consequence.severity,
      severityExplanation: `Based on propagated impact score reaching ${consequence.nodeType} node`,
      likelihood: consequence.likelihood,
      likelihoodExplanation: `Based on ${Math.round(consequence.confidence * 100)}% confidence in propagation path`,
      riskScore: consequence.riskScore,
      riskFormula: 'severity_level × likelihood_level (1-5 scale each)',
    },

    propagationPath: {
      order: consequence.order,
      orderLabel: consequence.order === 1 ? 'Direct (1st order)' : 
                  consequence.order === 2 ? 'Ripple (2nd order)' : 
                  `Butterfly (${consequence.order}th order)`,
      path: consequence.pathDescription,
      latencyDays: consequence.latencyDays,
      latencyExplanation: `Estimated time for impact to propagate through ${consequence.order} connection(s)`,
    },

    evidenceBasis: {
      level: consequence.evidenceBasis,
      explanation: {
        measured: 'Based on direct observed data or strong historical correlation',
        derived: 'Calculated from established relationships in the graph',
        inferred: 'Estimated based on similar patterns and node characteristics',
        assumed: 'Hypothetical based on graph structure; requires validation',
      }[consequence.evidenceBasis],
    },

    confidence: {
      score: consequence.confidence,
      percentage: `${Math.round(consequence.confidence * 100)}%`,
      factors: [
        `Path length: ${consequence.order} hops (longer paths = lower confidence)`,
        `Edge strength: Cumulative connection strength along path`,
        `Node sensitivity: How reactive ${consequence.nodeName} is to changes`,
        `Node inertia: Resistance to change (higher inertia = slower/smaller impact)`,
      ],
    },

    limitations: [
      'This explanation is based on the graph structure at analysis time',
      'Real-world outcomes may differ due to factors not captured in the model',
      'Confidence decreases with propagation distance',
    ],
  };

  res.json(explanation);
});

/**
 * Validate policy constraints (no-go lines)
 * POST /api/v1/cascade/reports/:id/validate-constraints
 */
router.post('/reports/:id/validate-constraints', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const noGoLines = report.changeSpec.constraints?.noGoLines || [];
  const violations: Array<{ constraint: string; violatingConsequence: string; severity: string }> = [];

  // Check each consequence against no-go lines
  for (const noGo of noGoLines) {
    const lowerNoGo = noGo.toLowerCase();
    
    for (const consequence of report.consequences) {
      const lowerDesc = consequence.description.toLowerCase();
      const lowerName = consequence.nodeName.toLowerCase();
      const lowerPath = consequence.pathDescription.toLowerCase();
      
      if (lowerDesc.includes(lowerNoGo) || lowerName.includes(lowerNoGo) || lowerPath.includes(lowerNoGo)) {
        violations.push({
          constraint: noGo,
          violatingConsequence: consequence.nodeName,
          severity: consequence.severity,
        });
      }
    }
  }

  res.json({
    reportId: report.id,
    constraintsChecked: noGoLines.length,
    violations: violations.length,
    passed: violations.length === 0,
    details: violations,
    recommendation: violations.length > 0 
      ? 'Policy constraints violated. Review and address before proceeding.'
      : 'All policy constraints satisfied.',
  });
});

/**
 * Get governance audit trail for a report
 * GET /api/v1/cascade/reports/:id/governance
 */
router.get('/reports/:id/governance', (req: Request, res: Response) => {
  const report = cascadeService.getCascadeReport(req.params['id']);
  
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const governance = {
    reportId: report.id,
    
    changeAuthority: {
      proposedBy: report.changeSpec.proposedBy || 'Unknown',
      proposedAt: report.changeSpec.proposedAt || report.timestamp,
      changeType: report.changeSpec.type,
    },

    analysisProvenance: {
      analyzedAt: report.timestamp,
      orbitRunId: report.orbitRunId,
      graphStatsAtAnalysis: cascadeService.getGraphStats(),
    },

    approvalRequirements: {
      recommendation: report.recommendation,
      requiredApprovals: report.requiredApprovals || [],
      approvalRationale: report.rationale,
    },

    signatureStatus: {
      signed: !!report.signedBy,
      signedBy: report.signedBy,
      signedAt: report.signedAt,
    },

    policyCompliance: {
      constraintsSpecified: report.changeSpec.constraints?.noGoLines?.length || 0,
      noGoLines: report.changeSpec.constraints?.noGoLines || [],
    },

    evidenceIntegrity: {
      evidenceHash: report.evidenceHash,
      hashAlgorithm: 'SHA-256',
      verificationEndpoint: `/api/v1/cascade/reports/${report.id}/evidence`,
    },

    status: {
      current: report.status,
      statusHistory: [
        { status: 'draft', timestamp: report.timestamp },
        ...(report.signedAt ? [{ status: 'in_review', timestamp: report.signedAt }] : []),
      ],
    },

    auditTrail: {
      created: report.timestamp,
      lastModified: report.signedAt || report.timestamp,
      immutable: report.status === 'executed' || report.status === 'rejected',
    },
  };

  res.json(governance);
});

// =============================================================================
// GRAPH MANAGEMENT
// =============================================================================

/**
 * Load organization graph
 * POST /api/v1/cascade/graph/load
 */
router.post('/graph/load', (req: Request, res: Response) => {
  try {
    const { nodes, edges } = req.body;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      res.status(400).json({ error: 'nodes and edges must be arrays' });
      return;
    }

    cascadeService.loadGraph({ nodes, edges });
    
    const stats = cascadeService.getGraphStats();
    res.json({
      success: true,
      loaded: {
        nodes: stats.nodeCount,
        edges: stats.edgeCount,
      },
    });

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * Get graph statistics
 * GET /api/v1/cascade/graph/stats
 */
router.get('/graph/stats', (req: Request, res: Response) => {
  const stats = cascadeService.getGraphStats();
  res.json(stats);
});

/**
 * Add a node to the graph
 * POST /api/v1/cascade/graph/nodes
 */
router.post('/graph/nodes', (req: Request, res: Response) => {
  try {
    const node = req.body;
    
    if (!node.id || !node.type || !node.name) {
      res.status(400).json({ error: 'id, type, and name are required' });
      return;
    }

    if (!Object.values(NodeType).includes(node.type)) {
      res.status(400).json({
        error: 'Invalid node type',
        validTypes: Object.values(NodeType),
      });
      return;
    }

    cascadeService.addNode(node);
    res.status(201).json({ success: true, node });

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * Add an edge to the graph
 * POST /api/v1/cascade/graph/edges
 */
router.post('/graph/edges', (req: Request, res: Response) => {
  try {
    const edge = req.body;
    
    if (!edge.id || !edge.sourceId || !edge.targetId || !edge.type) {
      res.status(400).json({ error: 'id, sourceId, targetId, and type are required' });
      return;
    }

    if (!Object.values(EdgeType).includes(edge.type)) {
      res.status(400).json({
        error: 'Invalid edge type',
        validTypes: Object.values(EdgeType),
      });
      return;
    }

    cascadeService.addEdge({
      strength: 0.5,
      ...edge,
    });
    res.status(201).json({ success: true, edge });

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * Get critical nodes (high centrality + sensitivity)
 * GET /api/v1/cascade/graph/critical
 */
router.get('/graph/critical', (req: Request, res: Response) => {
  const topN = parseInt(req.query.topN as string) || 10;
  const criticalNodes = orbitService.getCriticalNodes(topN);
  
  res.json({
    count: criticalNodes.length,
    nodes: criticalNodes,
  });
});

/**
 * Find feedback loops in the graph
 * GET /api/v1/cascade/graph/loops
 */
router.get('/graph/loops', (req: Request, res: Response) => {
  const maxLength = parseInt(req.query.maxLength as string) || 5;
  const loops = orbitService.findFeedbackLoops(maxLength);
  
  res.json({
    count: loops.length,
    loops: loops.map(loop => ({
      length: loop.length,
      nodes: loop,
    })),
  });
});

// =============================================================================
// ORBIT (RAW ENGINE) ENDPOINTS
// =============================================================================

/**
 * Run raw propagation analysis
 * POST /api/v1/cascade/orbit/run
 */
router.post('/orbit/run', async (req: Request, res: Response) => {
  try {
    const { sourceNodeId, changeDescription, initialImpact, config } = req.body;

    if (!sourceNodeId || !changeDescription) {
      res.status(400).json({ error: 'sourceNodeId and changeDescription are required' });
      return;
    }

    const result = await orbitService.runPropagation(
      sourceNodeId,
      changeDescription,
      initialImpact ?? 1.0,
      config ?? {}
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * List orbit runs
 * GET /api/v1/cascade/orbit/runs
 */
router.get('/orbit/runs', (req: Request, res: Response) => {
  const runs = orbitService.listRuns();
  
  res.json({
    count: runs.length,
    runs: runs.map(r => ({
      runId: r.runId,
      sourceNodeId: r.sourceNodeId,
      changeDescription: r.changeDescription,
      totalNodesAffected: r.totalNodesAffected,
      executionTimeMs: r.executionTimeMs,
      timestamp: r.timestamp,
    })),
  });
});

/**
 * Get orbit run result
 * GET /api/v1/cascade/orbit/runs/:id
 */
router.get('/orbit/runs/:id', (req: Request, res: Response) => {
  const run = orbitService.getRun(req.params.id);
  
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  res.json(run);
});

// =============================================================================
// REFERENCE DATA
// =============================================================================

/**
 * Get available change types
 * GET /api/v1/cascade/types/changes
 */
router.get('/types/changes', (req: Request, res: Response) => {
  res.json({
    changeTypes: Object.values(ChangeType),
  });
});

/**
 * Get available node types
 * GET /api/v1/cascade/types/nodes
 */
router.get('/types/nodes', (req: Request, res: Response) => {
  res.json({
    nodeTypes: Object.values(NodeType),
  });
});

/**
 * Get available edge types
 * GET /api/v1/cascade/types/edges
 */
router.get('/types/edges', (req: Request, res: Response) => {
  res.json({
    edgeTypes: Object.values(EdgeType),
  });
});

// =============================================================================
// SAMPLE DATA (For demos)
// =============================================================================

/**
 * Load sample organization graph for demos
 * POST /api/v1/cascade/demo/load-sample
 */
router.post('/demo/load-sample', (req: Request, res: Response) => {
  // Sample organization graph
  const sampleNodes = [
    { id: 'ceo', type: NodeType.PERSON, name: 'CEO', metadata: {}, weight: 1.0, sensitivity: 0.3 },
    { id: 'cfo', type: NodeType.PERSON, name: 'CFO', metadata: {}, weight: 0.9, sensitivity: 0.5 },
    { id: 'coo', type: NodeType.PERSON, name: 'COO', metadata: {}, weight: 0.9, sensitivity: 0.5 },
    { id: 'eng-team', type: NodeType.TEAM, name: 'Engineering Team', metadata: {}, weight: 0.8, sensitivity: 0.7 },
    { id: 'ops-team', type: NodeType.TEAM, name: 'Operations Team', metadata: {}, weight: 0.7, sensitivity: 0.6 },
    { id: 'sales-team', type: NodeType.TEAM, name: 'Sales Team', metadata: {}, weight: 0.7, sensitivity: 0.5 },
    { id: 'main-product', type: NodeType.PRODUCT, name: 'Main Product', metadata: {}, weight: 0.9, sensitivity: 0.8 },
    { id: 'revenue', type: NodeType.METRIC, name: 'Revenue', metadata: {}, weight: 1.0, sensitivity: 0.9 },
    { id: 'customer-sat', type: NodeType.METRIC, name: 'Customer Satisfaction', metadata: {}, weight: 0.8, sensitivity: 0.8 },
    { id: 'morale', type: NodeType.METRIC, name: 'Employee Morale', metadata: {}, weight: 0.7, sensitivity: 0.9 },
    { id: 'main-vendor', type: NodeType.VENDOR, name: 'Primary Vendor', metadata: {}, weight: 0.6, sensitivity: 0.4 },
    { id: 'top-customer', type: NodeType.CUSTOMER, name: 'Enterprise Customer A', metadata: {}, weight: 0.8, sensitivity: 0.6 },
    { id: 'core-system', type: NodeType.SYSTEM, name: 'Core Platform', metadata: {}, weight: 0.9, sensitivity: 0.8 },
    { id: 'deploy-process', type: NodeType.PROCESS, name: 'Deployment Process', metadata: {}, weight: 0.6, sensitivity: 0.7 },
    { id: 'security-policy', type: NodeType.POLICY, name: 'Security Policy', metadata: {}, weight: 0.7, sensitivity: 0.5 },
  ];

  const sampleEdges = [
    { id: 'e1', sourceId: 'ceo', targetId: 'cfo', type: EdgeType.MANAGES, strength: 0.9 },
    { id: 'e2', sourceId: 'ceo', targetId: 'coo', type: EdgeType.MANAGES, strength: 0.9 },
    { id: 'e3', sourceId: 'coo', targetId: 'eng-team', type: EdgeType.MANAGES, strength: 0.8 },
    { id: 'e4', sourceId: 'coo', targetId: 'ops-team', type: EdgeType.MANAGES, strength: 0.8 },
    { id: 'e5', sourceId: 'cfo', targetId: 'sales-team', type: EdgeType.MANAGES, strength: 0.7 },
    { id: 'e6', sourceId: 'eng-team', targetId: 'main-product', type: EdgeType.PRODUCES, strength: 0.9, latencyDays: 14 },
    { id: 'e7', sourceId: 'eng-team', targetId: 'morale', type: EdgeType.INFLUENCES, strength: 0.7, latencyDays: 30 },
    { id: 'e8', sourceId: 'main-product', targetId: 'revenue', type: EdgeType.INFLUENCES, strength: 0.85, latencyDays: 30 },
    { id: 'e9', sourceId: 'main-product', targetId: 'customer-sat', type: EdgeType.INFLUENCES, strength: 0.8, latencyDays: 7 },
    { id: 'e10', sourceId: 'customer-sat', targetId: 'top-customer', type: EdgeType.INFLUENCES, strength: 0.7, latencyDays: 60 },
    { id: 'e11', sourceId: 'top-customer', targetId: 'revenue', type: EdgeType.FUNDS, strength: 0.4, latencyDays: 90 },
    { id: 'e12', sourceId: 'main-vendor', targetId: 'ops-team', type: EdgeType.DEPENDS_ON, strength: 0.6, latencyDays: 7 },
    { id: 'e13', sourceId: 'ops-team', targetId: 'core-system', type: EdgeType.MANAGES, strength: 0.8, latencyDays: 3 },
    { id: 'e14', sourceId: 'core-system', targetId: 'main-product', type: EdgeType.PRODUCES, strength: 0.9, latencyDays: 1 },
    { id: 'e15', sourceId: 'morale', targetId: 'eng-team', type: EdgeType.INFLUENCES, strength: 0.6, latencyDays: 30, bidirectional: true },
    { id: 'e16', sourceId: 'eng-team', targetId: 'deploy-process', type: EdgeType.PRODUCES, strength: 0.7, latencyDays: 7 },
    { id: 'e17', sourceId: 'deploy-process', targetId: 'core-system', type: EdgeType.TRIGGERS, strength: 0.8, latencyDays: 1 },
    { id: 'e18', sourceId: 'security-policy', targetId: 'core-system', type: EdgeType.CONSTRAINS, strength: 0.5, latencyDays: 14 },
  ];

  cascadeService.loadGraph({ nodes: sampleNodes, edges: sampleEdges });

  res.json({
    success: true,
    message: 'Sample organization graph loaded',
    stats: cascadeService.getGraphStats(),
  });
});

export default router;
