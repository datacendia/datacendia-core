// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - API Routes
 * 
 * Adversarial Policy Stress-Testing System
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 */

import { Router, Request, Response } from 'express';
import { collapseOrchestrator } from '../services/collapse/index.js';
import { PolicyContext } from '../services/collapse/agents/BaseCollapseAgent.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router = Router();

/**
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'collapse-mode',
    description: 'Adversarial Policy Collapse Simulator',
    agents: collapseOrchestrator.getAgentDescriptions().length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get agent descriptions
 */
router.get('/agents', (_req: Request, res: Response) => {
  try {
    const agents = collapseOrchestrator.getAgentDescriptions();
    res.json({
      success: true,
      agents,
      count: agents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get agents',
    });
  }
});

/**
 * Get current configuration
 */
router.get('/config', (_req: Request, res: Response) => {
  try {
    const config = collapseOrchestrator.getConfig();
    res.json({
      success: true,
      config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get config',
    });
  }
});

/**
 * Update configuration
 */
router.put('/config', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    collapseOrchestrator.updateConfig(updates);
    res.json({
      success: true,
      config: collapseOrchestrator.getConfig(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update config',
    });
  }
});

/**
 * Run dual-track deliberation
 * POST /deliberation
 * Body: { decisionId, decisionText, context, consensusConfidence?, seed? }
 */
router.post('/deliberation', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      decisionText,
      context,
      consensusConfidence = 0.85,
      seed,
    } = req.body;

    if (!decisionId || !decisionText || !context) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: decisionId, decisionText, context',
      });
    }

    // Build policy context
    const policyContext: PolicyContext = {
      decisionId,
      decisionText,
      policyDomain: context.policyDomain || 'General Policy',
      targetPopulation: context.targetPopulation || 100000,
      geographicScope: context.geographicScope || 'Municipal',
      budgetImpact: context.budgetImpact || 0,
      timelineMonths: context.timelineMonths || 24,
      existingConditions: context.existingConditions || {},
      stakeholders: context.stakeholders || [],
      historicalAnalogues: context.historicalAnalogues,
    };

    const deliberation = await collapseOrchestrator.runDualTrackDeliberation(
      decisionId,
      decisionText,
      policyContext,
      consensusConfidence,
      seed
    );

    res.json({
      success: true,
      deliberation,
    });
  } catch (error) {
    console.error('Deliberation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Deliberation failed',
    });
  }
});

/**
 * Get deliberation by ID
 */
router.get('/deliberation/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const deliberation = collapseOrchestrator.getDeliberation(id);

    if (!deliberation) {
      return res.status(404).json({
        success: false,
        error: 'Deliberation not found',
      });
    }

    res.json({
      success: true,
      deliberation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get deliberation',
    });
  }
});

/**
 * List all deliberations
 */
router.get('/deliberations', (_req: Request, res: Response) => {
  try {
    const deliberations = collapseOrchestrator.listDeliberations();
    res.json({
      success: true,
      deliberations,
      count: deliberations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list deliberations',
    });
  }
});

/**
 * Get failure envelope by ID
 */
router.get('/envelope/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    res.json({
      success: true,
      envelope,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get envelope',
    });
  }
});

/**
 * Verify failure envelope integrity
 */
router.post('/envelope/:id/verify', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    const verification = collapseOrchestrator.verifyEnvelopeIntegrity(envelope);

    res.json({
      success: true,
      envelopeId: id,
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

/**
 * Replay deliberation
 */
router.post('/deliberation/:id/replay', async (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const result = await collapseOrchestrator.replayDeliberation(id);

    res.json({
      success: true,
      result,
      deterministic: result.match,
      message: result.match
        ? 'Replay matches original - deterministic verification passed'
        : 'Replay does not match - possible non-determinism detected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Replay failed',
    });
  }
});

/**
 * Export failure envelope as JSON (for download)
 */
router.get('/envelope/:id/export', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="failure-envelope-${id}.json"`
    );
    res.send(JSON.stringify(envelope, null, 2));
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    });
  }
});

/**
 * Quick analysis - run collapse analysis only (no consensus track)
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      decisionText,
      context,
      seed,
    } = req.body;

    if (!decisionId || !decisionText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: decisionId, decisionText',
      });
    }

    const policyContext: PolicyContext = {
      decisionId,
      decisionText,
      policyDomain: context?.policyDomain || 'General Policy',
      targetPopulation: context?.targetPopulation || 100000,
      geographicScope: context?.geographicScope || 'Municipal',
      budgetImpact: context?.budgetImpact || 0,
      timelineMonths: context?.timelineMonths || 24,
      existingConditions: context?.existingConditions || {},
      stakeholders: context?.stakeholders || [],
      historicalAnalogues: context?.historicalAnalogues,
    };

    const actualSeed = seed ?? deterministicInt(0, 999999, 'collapse-1');

    const collapseTrack = await collapseOrchestrator.runCollapseTrack(
      decisionId,
      decisionText,
      policyContext,
      actualSeed
    );

    res.json({
      success: true,
      analysis: {
        totalRisk: collapseTrack.totalRisk,
        criticalFindings: collapseTrack.criticalFindings,
        failureConditionsCount: collapseTrack.failureEnvelope.failureConditions.length,
        seed: actualSeed,
      },
      failureEnvelope: collapseTrack.failureEnvelope,
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

/**
 * Get trust delta interpretation
 */
router.get('/trust-delta/interpret', (req: Request, res: Response) => {
  const { consensusConfidence, collapseRisk } = req.query;

  if (!consensusConfidence || !collapseRisk) {
    return res.status(400).json({
      success: false,
      error: 'Missing required query params: consensusConfidence, collapseRisk',
    });
  }

  const cc = parseFloat(consensusConfidence as string);
  const cr = parseFloat(collapseRisk as string);

  if (isNaN(cc) || isNaN(cr)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid numeric values',
    });
  }

  const delta = cc - cr;
  let recommendation: string;
  let riskLevel: string;

  if (delta > 0.3) {
    recommendation = 'SAFE_TO_DEPLOY';
    riskLevel = 'LOW';
  } else if (delta > 0.1) {
    recommendation = 'DEPLOY_WITH_GUARDRAILS';
    riskLevel = 'MODERATE';
  } else if (delta > 0) {
    recommendation = 'HIGH_RISK';
    riskLevel = 'HIGH';
  } else {
    recommendation = 'DO_NOT_DEPLOY';
    riskLevel = 'CRITICAL';
  }

  res.json({
    success: true,
    trustDelta: {
      consensusConfidence: cc,
      collapseRisk: cr,
      delta,
      recommendation,
      riskLevel,
    },
  });
});

/**
 * Export full audit bundle (all artifacts for IMPOSSIBLE_DEMO)
 * Includes: packet.json, evidence/, collapse/, accountability/, verification/
 */
router.get('/deliberation/:id/audit-bundle', async (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const deliberation = collapseOrchestrator.getDeliberation(id);

    if (!deliberation) {
      return res.status(404).json({
        success: false,
        error: 'Deliberation not found',
      });
    }

    const envelope = deliberation.collapseTrack.failureEnvelope;
    const verification = collapseOrchestrator.verifyEnvelopeIntegrity(envelope);

    // Build comprehensive audit bundle
    const auditBundle = {
      meta: {
        bundleId: `AUDIT-${id}-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        format: 'datacendia-audit-bundle',
      },
      packet: {
        decisionId: deliberation.decisionId,
        decisionText: deliberation.decisionText,
        deliberationId: id,
        completedAt: deliberation.completedAt,
        seed: deliberation.seed,
        merkleRoot: deliberation.merkleRoot,
      },
      consensus: {
        confidence: deliberation.consensusTrack.confidence,
        recommendation: deliberation.trustDelta.deploymentRecommendation,
      },
      collapse: {
        failureEnvelope: envelope,
        totalRisk: deliberation.collapseTrack.totalRisk,
        criticalFindings: deliberation.collapseTrack.criticalFindings,
      },
      trustDelta: deliberation.trustDelta,
      verification: {
        envelopeValid: verification.valid,
        merkleRootMatch: (verification as any).merkleRootMatch,
        failureConditionsValid: (verification as any).failureConditionsValid,
        integrityHash: (verification as any).computedHash,
        verifiedAt: new Date().toISOString(),
      },
      checksums: {
        packet: generateSHA256(JSON.stringify(deliberation)),
        envelope: envelope.merkleRoot,
        bundle: '', // Will be computed
      },
    };

    // Compute bundle checksum
    auditBundle.checksums.bundle = generateSHA256(JSON.stringify(auditBundle));

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit-bundle-${id}.json"`
    );
    res.send(JSON.stringify(auditBundle, null, 2));
  } catch (error) {
    console.error('Audit bundle export failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    });
  }
});

/**
 * In-browser verification of audit bundle (no Docker required)
 */
router.post('/verify-bundle', (req: Request, res: Response) => {
  try {
    const bundle = req.body;

    if (!bundle || !bundle.meta || !bundle.packet || !bundle.collapse) {
      return res.status(400).json({
        success: false,
        error: 'Invalid audit bundle format',
      });
    }

    const verificationResults = {
      bundleFormat: true,
      metaValid: !!(bundle.meta.bundleId && bundle.meta.generatedAt),
      packetValid: !!(bundle.packet.decisionId && bundle.packet.merkleRoot),
      envelopePresent: !!bundle.collapse.failureEnvelope,
      checksumValid: false,
      merkleValid: false,
      integrityScore: 0,
      details: [] as string[],
    };

    // Verify bundle checksum
    const storedChecksum = bundle.checksums?.bundle;
    const bundleForHash = { ...bundle };
    bundleForHash.checksums = { ...bundle.checksums, bundle: '' };
    const computedChecksum = generateSHA256(JSON.stringify(bundleForHash));
    verificationResults.checksumValid = storedChecksum === computedChecksum;

    if (verificationResults.checksumValid) {
      verificationResults.details.push('âœ“ Bundle checksum verified');
    } else {
      verificationResults.details.push('âœ— Bundle checksum mismatch - possible tampering');
    }

    // Verify Merkle root
    if (bundle.collapse.failureEnvelope) {
      const envelope = bundle.collapse.failureEnvelope;
      const verification = collapseOrchestrator.verifyEnvelopeIntegrity(envelope);
      verificationResults.merkleValid = verification.valid;

      if (verification.valid) {
        verificationResults.details.push('âœ“ Failure envelope Merkle root verified');
      } else {
        verificationResults.details.push('âœ— Failure envelope integrity check failed');
      }
    }

    // Calculate integrity score
    let score = 0;
    if (verificationResults.bundleFormat) score += 20;
    if (verificationResults.metaValid) score += 20;
    if (verificationResults.packetValid) score += 20;
    if (verificationResults.checksumValid) score += 20;
    if (verificationResults.merkleValid) score += 20;
    verificationResults.integrityScore = score;

    verificationResults.details.push(`Integrity Score: ${score}/100`);

    res.json({
      success: true,
      verification: verificationResults,
      recommendation: score === 100 
        ? 'VERIFIED - Bundle is authentic and untampered'
        : score >= 80
        ? 'PARTIAL - Bundle mostly intact but some checks failed'
        : 'FAILED - Bundle integrity compromised',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

/**
 * Record human override with accountability signing
 */
router.post('/deliberation/:id/override', async (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const {
      humanAuthority,
      justification,
      acceptedRisks,
      riskAcknowledgment,
    } = req.body;

    const deliberation = collapseOrchestrator.getDeliberation(id);
    if (!deliberation) {
      return res.status(404).json({
        success: false,
        error: 'Deliberation not found',
      });
    }

    if (!humanAuthority || !justification || !acceptedRisks || !riskAcknowledgment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: humanAuthority, justification, acceptedRisks, riskAcknowledgment',
      });
    }

    // Generate accountability record
    const overrideRecord = {
      id: `OVERRIDE-${id}-${Date.now()}`,
      deliberationId: id,
      decisionId: deliberation.decisionId,
      timestamp: new Date().toISOString(),
      humanAuthority: {
        name: humanAuthority.name,
        title: humanAuthority.title,
        email: humanAuthority.email,
        department: humanAuthority.department,
      },
      aiRecommendation: deliberation.trustDelta.deploymentRecommendation,
      trustDeltaAtOverride: deliberation.trustDelta.trustDelta,
      actionTaken: 'OVERRIDE',
      justification,
      acceptedRisks,
      riskAcknowledgment,
      nonOverridableViolations: checkNonOverridableViolations(deliberation),
      signature: generateSignature(humanAuthority, justification, acceptedRisks),
      signedAt: new Date().toISOString(),
    };

    // Check if trying to override non-overridable findings
    if (overrideRecord.nonOverridableViolations.length > 0) {
      return res.status(403).json({
        success: false,
        error: 'Cannot override non-overridable violations',
        violations: overrideRecord.nonOverridableViolations,
      });
    }

    res.json({
      success: true,
      overrideRecord,
      warning: 'This override has been cryptographically recorded. The human authority has accepted institutional responsibility for the accepted risks.',
    });
  } catch (error) {
    console.error('Override recording failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Override failed',
    });
  }
});

/**
 * Get pre-loaded IMPOSSIBLE_DEMO scenario
 */
router.get('/demo/impossible', (_req: Request, res: Response) => {
  const impossibleDemoScenario = {
    id: 'impossible-demo',
    name: 'Predictive Policing Algorithm',
    description: 'A 10-minute demonstration that competitors cannot fake',
    decisionText: `We are considering implementing a predictive policing system that uses historical crime data to optimize patrol allocation across the city. The goal is 15% improvement in response times while maintaining current staffing levels.`,
    context: {
      policyDomain: 'Public Safety',
      targetPopulation: 850000,
      geographicScope: 'Municipal',
      budgetImpact: 2400000,
      timelineMonths: 18,
      stakeholders: ['Citizens', 'Law Enforcement', 'City Council', 'Civil Rights Organizations'],
    },
    expectedOutcome: {
      consensusRecommendation: 'APPROVE',
      collapseRecommendation: 'DO_NOT_DEPLOY',
      keyFindings: [
        'Historical data encodes redlining patterns - deployment amplifies existing bias',
        '67% probability of community trust erosion within 12 months',
        'Pre-crime assumptions conflict with presumption of innocence',
        'Feedback loop creates self-fulfilling prophecy',
      ],
    },
    demoSteps: [
      'Enter the policy proposal',
      'Run standard Council deliberation â†’ Watch it recommend APPROVE',
      'Activate Collapse Mode â†’ Watch 18 agents find failures',
      'Review Trust Delta (should be NEGATIVE)',
      'Attempt human override â†’ See accountability signing',
      'Export audit bundle â†’ Verify in browser',
    ],
  };

  res.json({
    success: true,
    scenario: impossibleDemoScenario,
  });
});

/**
 * Get pre-loaded CLOUD_AI_DISRUPTION scenario
 * How Cloud AI plugins threaten SaaS companies
 */
router.get('/demo/cloud-ai-disruption', (_req: Request, res: Response) => {
  const cloudAIScenario = {
    id: 'cloud-ai-disruption',
    name: 'Cloud AI Plugin Market Disruption',
    description: 'Strategic analysis of how major Cloud AI providers launching plugins threatens existing SaaS businesses',
    decisionText: `We are a mid-size SaaS company ($45M ARR) providing project management software. Microsoft just announced Copilot integration with native project management features in Teams. Google launched Duet AI with similar capabilities in Workspace. OpenAI's plugin store now has 3 competitors to our core product. Our board wants a strategic response plan.

Key facts:
- Our product: ProjectFlow - $45M ARR, 2,400 enterprise customers, 89% gross margin
- Microsoft Copilot: Now includes project tracking, task assignment, timeline generation - included in E5 licenses ($57/user/month that customers already pay)
- Google Duet AI: Launched Workspace project features - included in Business Plus ($18/user/month)
- OpenAI plugins: TaskMaster, ProjectGPT, and FlowAI all launched in last 90 days - $20/user/month each
- Our pricing: $35/user/month

The board is considering:
1. Pivot to "AI-native" by integrating our own LLM features
2. Focus on enterprise compliance/security as differentiator
3. Seek acquisition by a larger player before value erodes
4. Double down on vertical-specific features (construction, healthcare, legal)
5. Race to the bottom on pricing to retain customers

What is our strategic recommendation?`,
    context: {
      policyDomain: 'Finance',
      targetPopulation: 2400,
      geographicScope: 'Global',
      budgetImpact: 45000000,
      timelineMonths: 24,
      stakeholders: [
        'Board of Directors',
        'Shareholders',
        'Enterprise Customers',
        'Employees (340 FTE)',
        'Microsoft/Google (competitors)',
        'OpenAI ecosystem',
      ],
      companyProfile: {
        name: 'ProjectFlow Inc.',
        arr: 45000000,
        customers: 2400,
        employees: 340,
        grossMargin: 0.89,
        netRetention: 0.94,
        churnRate: 0.08,
        averageContractValue: 18750,
        runway: '18 months at current burn',
      },
      competitorAnalysis: {
        microsoftCopilot: {
          pricing: 'Included in E5 ($57/user already paid)',
          features: 'Project tracking, task assignment, AI timeline, Teams integration',
          threat: 'CRITICAL - 78% of our customers use M365',
        },
        googleDuet: {
          pricing: 'Included in Business Plus ($18/user)',
          features: 'Workspace projects, AI task creation, Sheets integration',
          threat: 'HIGH - 34% of our customers use Google Workspace',
        },
        openaiPlugins: {
          pricing: '$20/user/month each',
          features: 'Natural language project management, ChatGPT integration',
          threat: 'MEDIUM - Growing but enterprise adoption slow',
        },
      },
      financialImpact: {
        scenarioA_doNothing: {
          year1ChurnIncrease: 0.15,
          year2ChurnIncrease: 0.28,
          arrImpact: -18000000,
        },
        scenarioB_aiIntegration: {
          developmentCost: 8000000,
          timeToMarket: 12,
          competitivePosition: 'Parity, not advantage',
        },
        scenarioC_acquisition: {
          estimatedMultiple: '2.5-3.5x ARR',
          valuationRange: '112M - 157M',
          windowRemaining: '6-12 months before erosion',
        },
      },
    },
    expectedOutcome: {
      consensusRecommendation: 'DEPLOY_WITH_GUARDRAILS',
      collapseRecommendation: 'HIGH_RISK',
      keyFindings: [
        'Platform economics favor bundled AI - standalone SaaS loses on distribution',
        'Enterprise security positioning has 18-24 month window before cloud providers match',
        'Vertical specialization is only defensible moat but reduces TAM by 70%',
        'Acquisition window is closing - every quarter of delay reduces multiples',
        'AI integration race cannot be won against $2T market cap competitors',
        'Employee retention risk: 45% of engineering may leave if pivot fails',
        'Customer lock-in is weaker than believed - data portability regulations increasing',
      ],
      strategicRecommendation: 'Pursue acquisition within 6 months while demonstrating AI integration roadmap to maximize valuation. Vertical specialization as fallback if no acquirer.',
    },
    demoSteps: [
      'Review the competitive landscape',
      'Run Council deliberation with CFO, CTO, CLO, CSO agents',
      'Activate Collapse Mode to find strategic failures',
      'Examine Platform Economics agent findings',
      'Review Competitive Moat Erosion analysis',
      'See Employee Flight Risk assessment',
      'Compare acquisition vs. build scenarios',
      'Export strategic decision packet for board',
    ],
    industryContext: {
      recentExamples: [
        { company: 'Notion', event: 'Launched Notion AI, pivoted to AI-first', outcome: 'Survived but growth slowed' },
        { company: 'Asana', event: 'Stock down 80% from peak, AI pressure cited', outcome: 'Struggling to differentiate' },
        { company: 'Monday.com', event: 'Aggressive AI investment, vertical focus', outcome: 'Maintaining but margin compression' },
        { company: 'Figma', event: 'Adobe acquisition blocked, now facing AI design tools', outcome: 'Uncertain' },
        { company: 'Grammarly', event: 'Directly competed by ChatGPT, Copilot', outcome: 'Pivoting to enterprise security' },
        { company: 'Jasper AI', event: 'OpenAI API changes, ChatGPT competition', outcome: 'Laid off 20%, pivoting' },
      ],
      marketTrends: [
        'AI feature commoditization accelerating',
        'Platform bundling destroying standalone pricing power',
        'Enterprise security/compliance last defensible position',
        'Vertical SaaS more resilient than horizontal',
        'M&A activity increasing as acquirers seek AI talent',
      ],
    },
  };

  res.json({
    success: true,
    scenario: cloudAIScenario,
  });
});

/**
 * List all available demo scenarios
 */
router.get('/demo/list', (_req: Request, res: Response) => {
  const demos = [
    {
      id: 'impossible',
      name: 'Predictive Policing (IMPOSSIBLE_DEMO)',
      description: 'Policy collapse analysis with adversarial agents',
      endpoint: '/api/v1/collapse/demo/impossible',
      category: 'Policy Risk',
    },
    {
      id: 'cloud-ai-disruption',
      name: 'Cloud AI Plugin Disruption',
      description: 'Strategic analysis of AI platform competition threatening SaaS',
      endpoint: '/api/v1/collapse/demo/cloud-ai-disruption',
      category: 'Strategic Risk',
    },
  ];

  res.json({
    success: true,
    demos,
    count: demos.length,
  });
});

// Helper functions
function generateSHA256(data: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

function checkNonOverridableViolations(deliberation: any): string[] {
  const violations: string[] = [];
  const envelope = deliberation.collapseTrack.failureEnvelope;
  
  for (const fc of envelope.failureConditions) {
    if (fc.agent.includes('FREE_SPEECH') || fc.agent.includes('MINORITY_HARM')) {
      if (fc.severity >= 0.7) {
        violations.push(`${fc.agent}: ${fc.failureEvent.description}`);
      }
    }
  }
  
  return violations;
}

function generateSignature(humanAuthority: any, justification: string, risks: string[]): string {
  const crypto = require('crypto');
  const payload = JSON.stringify({ humanAuthority, justification, risks, timestamp: Date.now() });
  return 'SIG:' + crypto.createHash('sha256').update(payload).digest('hex').slice(0, 32);
}

export default router;
