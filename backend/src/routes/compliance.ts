// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Compliance API Routes
 * Five Rings of Sovereignty - Complete Compliance Framework API
 */

import { Router, Request, Response } from 'express';
import { complianceService, complianceEnforcer, ComplianceDomain, PillarId } from '../services/compliance/index.js';
import { complianceGuard, councilComplianceMiddleware, CouncilProposal } from '../services/council/ComplianceGuard.js';

const router = Router();

// Health endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'compliance', timestamp: new Date().toISOString() } });
});

// ============================================================================
// FRAMEWORK ENDPOINTS
// ============================================================================

/**
 * GET /api/compliance/frameworks
 * Get all compliance frameworks
 */
router.get('/frameworks', (req: Request, res: Response) => {
  try {
    const { domain, pillar, industry } = req.query;

    let frameworks = complianceService.getAllFrameworks();

    if (domain) {
      frameworks = frameworks.filter(f => f.domain === domain as ComplianceDomain);
    }

    if (pillar) {
      frameworks = frameworks.filter(f => f.pillars.includes(pillar as PillarId));
    }

    if (industry) {
      frameworks = frameworks.filter(f => 
        f.industries.includes('All') || f.industries.includes(industry as string)
      );
    }

    res.json({
      success: true,
      data: frameworks,
      meta: { count: frameworks.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch frameworks' });
  }
});

/**
 * GET /api/compliance/frameworks/:id
 * Get a specific framework
 */
router.get('/frameworks/:id', (req: Request, res: Response) => {
  try {
    const framework = complianceService.getFramework(req.params.id);
    if (!framework) {
      return res.status(404).json({ success: false, error: 'Framework not found' });
    }
    res.json({ success: true, data: framework });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch framework' });
  }
});

/**
 * GET /api/compliance/five-rings
 * Get Five Rings of Sovereignty overview
 */
router.get('/five-rings', (req: Request, res: Response) => {
  try {
    const overview = complianceService.getFiveRingsOverview();
    const totalControls = overview.reduce((sum, ring) => sum + ring.totalControls, 0);
    const totalFrameworks = overview.reduce((sum, ring) => sum + ring.frameworks.length, 0);

    res.json({
      success: true,
      data: {
        rings: overview,
        summary: {
          totalRings: 5,
          totalFrameworks,
          totalControls,
          domains: ['ethical_ai', 'cybersecurity', 'privacy', 'governance', 'industry'],
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch Five Rings overview' });
  }
});

/**
 * GET /api/compliance/pillars/:pillarId/mapping
 * Get compliance mapping for a specific pillar
 */
router.get('/pillars/:pillarId/mapping', (req: Request, res: Response) => {
  try {
    const pillarId = req.params.pillarId as PillarId;
    const validPillars: PillarId[] = ['helm', 'lineage', 'predict', 'flow', 'health', 'guard', 'ethics', 'agents'];
    
    if (!validPillars.includes(pillarId)) {
      return res.status(400).json({ success: false, error: 'Invalid pillar ID' });
    }

    const mapping = complianceService.getPillarComplianceMapping(pillarId);
    
    const summary = {
      ethical_ai: mapping.ethical_ai.length,
      cybersecurity: mapping.cybersecurity.length,
      privacy: mapping.privacy.length,
      governance: mapping.governance.length,
      industry: mapping.industry.length,
      total: Object.values(mapping).flat().length,
    };

    res.json({
      success: true,
      data: {
        pillarId,
        mapping,
        summary,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pillar mapping' });
  }
});

// ============================================================================
// ASSESSMENT ENDPOINTS
// ============================================================================

/**
 * POST /api/compliance/assessments/pillar
 * Run automated assessment for a pillar
 */
router.post('/assessments/pillar', async (req: Request, res: Response) => {
  try {
    const { organizationId, pillarId, assessor } = req.body;

    if (!organizationId || !pillarId || !assessor) {
      return res.status(400).json({ 
        success: false, 
        error: 'organizationId, pillarId, and assessor are required' 
      });
    }

    const assessments = await complianceService.runPillarAssessment(
      organizationId,
      pillarId as PillarId,
      assessor
    );

    const overallScore = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
      : 0;

    res.json({
      success: true,
      data: {
        pillarId,
        assessments,
        summary: {
          totalAssessments: assessments.length,
          overallScore,
          findings: assessments.reduce((sum, a) => sum + a.findings.length, 0),
          criticalFindings: assessments.reduce((sum, a) => 
            sum + a.findings.filter(f => f.severity === 'critical').length, 0
          ),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run pillar assessment' });
  }
});

/**
 * POST /api/compliance/assessments/framework
 * Run automated assessment for a specific framework
 */
router.post('/assessments/framework', async (req: Request, res: Response) => {
  try {
    const { organizationId, frameworkId, pillarId, assessor } = req.body;

    if (!organizationId || !frameworkId || !pillarId || !assessor) {
      return res.status(400).json({ 
        success: false, 
        error: 'organizationId, frameworkId, pillarId, and assessor are required' 
      });
    }

    const assessment = await complianceService.runFrameworkAssessment(
      organizationId,
      frameworkId,
      pillarId as PillarId,
      assessor
    );

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run framework assessment' });
  }
});

/**
 * GET /api/compliance/assessments/:id
 * Get a specific assessment
 */
router.get('/assessments/:id', (req: Request, res: Response) => {
  try {
    const assessment = complianceService.getAssessment(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch assessment' });
  }
});

/**
 * GET /api/compliance/assessments
 * Get assessments for an organization
 */
router.get('/assessments', (req: Request, res: Response) => {
  try {
    const { organizationId, domain, pillarId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'organizationId is required' });
    }

    let assessments = complianceService.getAssessmentsForOrg(organizationId as string);

    if (domain) {
      assessments = assessments.filter(a => a.domain === domain as ComplianceDomain);
    }

    if (pillarId) {
      assessments = assessments.filter(a => a.pillarId === pillarId as PillarId);
    }

    res.json({
      success: true,
      data: assessments,
      meta: { count: assessments.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch assessments' });
  }
});

// ============================================================================
// BUNDLE ENDPOINTS
// ============================================================================

/**
 * POST /api/compliance/bundles/generate
 * Generate compliance bundle
 */
router.post('/bundles/generate', async (req: Request, res: Response) => {
  try {
    const { organizationId, frameworks, pillars, domains, generatedBy } = req.body;

    if (!organizationId || !generatedBy) {
      return res.status(400).json({ 
        success: false, 
        error: 'organizationId and generatedBy are required' 
      });
    }

    const bundle = await complianceService.generateComplianceBundle(organizationId, {
      frameworks,
      pillars: pillars as PillarId[],
      domains: domains as ComplianceDomain[],
      generatedBy,
    });

    // Return bundle metadata (files content can be large)
    res.json({
      success: true,
      data: {
        id: bundle.id,
        organizationId: bundle.organizationId,
        generatedAt: bundle.generatedAt,
        generatedBy: bundle.generatedBy,
        frameworks: bundle.frameworks,
        pillars: bundle.pillars,
        domains: bundle.domains,
        fileCount: bundle.files.length,
        files: bundle.files.map(f => ({
          path: f.path,
          name: f.name,
          format: f.format,
          size: f.size,
          hash: f.hash,
        })),
        merkleRoot: bundle.merkleRoot,
        bundleHash: bundle.bundleHash,
        expiresAt: bundle.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate bundle' });
  }
});

/**
 * GET /api/compliance/bundles/:id
 * Get bundle metadata
 */
router.get('/bundles/:id', (req: Request, res: Response) => {
  try {
    const bundle = complianceService.getBundle(req.params.id);
    if (!bundle) {
      return res.status(404).json({ success: false, error: 'Bundle not found' });
    }

    res.json({
      success: true,
      data: {
        id: bundle.id,
        organizationId: bundle.organizationId,
        generatedAt: bundle.generatedAt,
        generatedBy: bundle.generatedBy,
        frameworks: bundle.frameworks,
        pillars: bundle.pillars,
        domains: bundle.domains,
        fileCount: bundle.files.length,
        files: bundle.files.map(f => ({
          path: f.path,
          name: f.name,
          format: f.format,
          size: f.size,
          hash: f.hash,
        })),
        merkleRoot: bundle.merkleRoot,
        bundleHash: bundle.bundleHash,
        expiresAt: bundle.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bundle' });
  }
});

/**
 * GET /api/compliance/bundles/:id/download
 * Download bundle as ZIP
 */
router.get('/bundles/:id/download', (req: Request, res: Response) => {
  try {
    const bundle = complianceService.getBundle(req.params.id);
    if (!bundle) {
      return res.status(404).json({ success: false, error: 'Bundle not found' });
    }

    // Return full bundle with file contents
    res.json({
      success: true,
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to download bundle' });
  }
});

/**
 * GET /api/compliance/bundles/:id/files/:path
 * Get specific file from bundle
 */
router.get('/bundles/:id/files/*', (req: Request, res: Response) => {
  try {
    const bundle = complianceService.getBundle(req.params.id);
    if (!bundle) {
      return res.status(404).json({ success: false, error: 'Bundle not found' });
    }

    const filePath = req.params[0];
    const file = bundle.files.find(f => f.path === filePath);
    
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found in bundle' });
    }

    res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch file' });
  }
});

// ============================================================================
// SUMMARY ENDPOINTS
// ============================================================================

/**
 * GET /api/compliance/summary
 * Get overall compliance summary for organization
 */
router.get('/summary', (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'organizationId is required' });
    }

    const assessments = complianceService.getAssessmentsForOrg(organizationId as string);
    const fiveRings = complianceService.getFiveRingsOverview();

    const domainScores: Record<ComplianceDomain, number> = {
      ethical_ai: 0,
      cybersecurity: 0,
      privacy: 0,
      governance: 0,
      industry: 0,
    };

    const domainCounts: Record<ComplianceDomain, number> = {
      ethical_ai: 0,
      cybersecurity: 0,
      privacy: 0,
      governance: 0,
      industry: 0,
    };

    for (const a of assessments) {
      domainScores[a.domain] += a.overallScore;
      domainCounts[a.domain]++;
    }

    const domainAverages: Record<ComplianceDomain, number> = {
      ethical_ai: domainCounts.ethical_ai > 0 ? Math.round(domainScores.ethical_ai / domainCounts.ethical_ai) : 0,
      cybersecurity: domainCounts.cybersecurity > 0 ? Math.round(domainScores.cybersecurity / domainCounts.cybersecurity) : 0,
      privacy: domainCounts.privacy > 0 ? Math.round(domainScores.privacy / domainCounts.privacy) : 0,
      governance: domainCounts.governance > 0 ? Math.round(domainScores.governance / domainCounts.governance) : 0,
      industry: domainCounts.industry > 0 ? Math.round(domainScores.industry / domainCounts.industry) : 0,
    };

    const overallScore = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
      : 0;

    const allFindings = assessments.flatMap(a => a.findings);

    res.json({
      success: true,
      data: {
        organizationId,
        overallScore,
        fiveRings: fiveRings.map(ring => ({
          ring: ring.ring,
          domain: ring.domain,
          name: ring.name,
          score: domainAverages[ring.domain],
          frameworkCount: ring.frameworks.length,
          controlCount: ring.totalControls,
        })),
        assessments: {
          total: assessments.length,
          byDomain: domainCounts,
        },
        findings: {
          total: allFindings.length,
          critical: allFindings.filter(f => f.severity === 'critical').length,
          high: allFindings.filter(f => f.severity === 'high').length,
          medium: allFindings.filter(f => f.severity === 'medium').length,
          low: allFindings.filter(f => f.severity === 'low').length,
          open: allFindings.filter(f => f.status === 'open').length,
        },
        domainScores: domainAverages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch compliance summary' });
  }
});

// ============================================================================
// ENFORCEMENT ENDPOINTS - Active Compliance
// ============================================================================

/**
 * POST /api/compliance/enforce
 * Check an action against compliance rules
 * Used by Council agents for real-time enforcement
 */
router.post('/enforce', (req: Request, res: Response) => {
  try {
    const { agentId, action, description, dataTypes } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        error: 'action and description are required',
      });
    }

    const result = complianceEnforcer.enforceForCouncil(
      agentId || 'unknown',
      action,
      description,
      dataTypes || []
    );

    res.json({
      success: true,
      data: {
        allowed: result.allowed,
        response: result.response,
        violationCount: result.violations.length,
        violations: result.violations.map(v => ({
          citation: v.citation,
          severity: v.severity,
          reason: v.reason,
          recommendation: v.recommendation,
          ring: v.ring,
          domain: v.domain,
          framework: v.framework,
          control: v.control,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Enforcement check failed' });
  }
});

/**
 * POST /api/compliance/check
 * Full compliance check with detailed results
 */
router.post('/check', (req: Request, res: Response) => {
  try {
    const { action, description, dataTypes, pillar, userId, agentId, metadata } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        error: 'action and description are required',
      });
    }

    const result = complianceEnforcer.checkAction({
      action,
      description,
      dataTypes: dataTypes || [],
      pillar,
      userId,
      agentId,
      metadata,
    });

    res.json({
      success: true,
      data: {
        allowed: result.allowed,
        riskLevel: result.riskLevel,
        citations: result.citations,
        recommendation: result.recommendation,
        violations: result.violations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Compliance check failed' });
  }
});

/**
 * GET /api/compliance/rules
 * Get all compliance enforcement rules
 */
router.get('/rules', (req: Request, res: Response) => {
  try {
    const { domain, framework } = req.query;

    let rules;
    if (domain) {
      rules = complianceEnforcer.getRulesByDomain(domain as ComplianceDomain);
    } else if (framework) {
      rules = complianceEnforcer.getRulesByFramework(framework as string);
    } else {
      // Return summary of rules by domain
      const domains: ComplianceDomain[] = ['ethical_ai', 'cybersecurity', 'privacy', 'governance', 'industry'];
      rules = domains.map(d => ({
        domain: d,
        ruleCount: complianceEnforcer.getRulesByDomain(d).length,
      }));
    }

    res.json({
      success: true,
      data: rules,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rules' });
  }
});

// ============================================================================
// COUNCIL INTEGRATION - Active Enforcement
// ============================================================================

/**
 * POST /api/compliance/council/evaluate
 * Evaluate a Council proposal for compliance
 * This is the main integration point for The Council
 */
router.post('/council/evaluate', (req: Request, res: Response) => {
  try {
    const { id, agentId, action, description, dataTypes, targetSystems, affectedData, rationale } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        error: 'action and description are required',
      });
    }

    const proposal: CouncilProposal = {
      id: id || `proposal-${Date.now()}`,
      agentId: agentId || 'unknown',
      action,
      description,
      dataTypes,
      targetSystems,
      affectedData,
      rationale,
    };

    const result = councilComplianceMiddleware(proposal);

    res.json({
      success: true,
      data: {
        proceed: result.proceed,
        cisoResponse: result.cisoResponse,
        verdict: {
          allowed: result.verdict.allowed,
          riskLevel: result.verdict.riskLevel,
          citations: result.verdict.citations,
          violations: result.verdict.violations.map(v => ({
            ring: v.ring,
            domain: v.domain,
            framework: v.framework,
            control: v.control,
            controlTitle: v.controlTitle,
            severity: v.severity,
            citation: v.citation,
            reason: v.reason,
            recommendation: v.recommendation,
          })),
          requiresHumanReview: result.verdict.requiresHumanReview,
        },
        auditRecord: complianceGuard.getAuditRecord(result.verdict),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Council evaluation failed' });
  }
});

/**
 * GET /api/compliance/council/history
 * Get compliance verdict history
 */
router.get('/council/history', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const history = complianceGuard.getVerdictHistory(limit);

    res.json({
      success: true,
      data: history.map(v => ({
        proposalId: v.proposalId,
        agentId: v.agentId,
        timestamp: v.timestamp,
        allowed: v.allowed,
        riskLevel: v.riskLevel,
        citations: v.citations,
        violationCount: v.violations.length,
      })),
      meta: { count: history.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

/**
 * GET /api/compliance/council/statistics
 * Get compliance enforcement statistics
 */
router.get('/council/statistics', (req: Request, res: Response) => {
  try {
    const stats = complianceGuard.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

export default router;
