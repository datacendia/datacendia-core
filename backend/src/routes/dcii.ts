/**
 * API Routes — Dcii
 *
 * Express route handler defining REST endpoints.
 * @module routes/dcii
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DCII - Decision Crisis Immunization Infrastructure™ API Routes
 * 
 * Comprehensive API for all 6 DCII services supporting the 9 Primitives:
 * 1. IISS (Institutional Immune System Score) — scores all 9 primitives
 * 2. Cognitive Bias Mitigation (P6) — detect & challenge biases
 * 3. Synthetic Media Authentication (P8) — deepfake detection & C2PA
 * 4. Cross-Jurisdiction Compliance (P9) — conflict detection
 * 5. RFC 3161 Timestamp Authority (P1) — cryptographic timestamps
 * 6. Decision Similarity — proactive historical matching
 */

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { iissService } from '../services/dcii/IISSService.js';
import { syntheticMediaAuthService } from '../services/dcii/SyntheticMediaAuthService.js';
import { crossJurisdictionConflictService } from '../services/dcii/CrossJurisdictionConflictService.js';
import { timestampAuthorityService } from '../services/dcii/TimestampAuthorityService.js';
import { decisionSimilarityService } from '../services/dcii/DecisionSimilarityService.js';
import { cognitiveBiasMitigationService } from '../services/dcii/CognitiveBiasMitigationService.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Health endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'dcii', timestamp: new Date().toISOString() } });
});

// All DCII routes require authentication (devAuth allows bypass in development)
router.use(devAuth);

// =============================================================================
// SEED DEMO DATA (idempotent — only seeds if services are empty)
// =============================================================================

router.post('/seed-demo', async (req: Request, res: Response) => {
  try {
    const orgId = '351bf638-d771-4bed-83c7-3df49871f7ab';
    const orgName = 'Datacendia Demo';
    const seededBy = req.user?.email || 'system';
    const seeded: string[] = [];

    // 1. IISS — calculate if no scores exist
    if (iissService.getAllScores().length === 0) {
      await iissService.calculateScore(orgId, orgName, seededBy);
      seeded.push('iiss');
    }

    // 2. Media Assets — sign sample assets if none exist
    if (syntheticMediaAuthService.getAllAssets().length === 0) {
      const mediaItems = [
        { fileName: 'board-meeting-recording.mp4', mediaType: 'video', mimeType: 'video/mp4' },
        { fileName: 'financial-report-q4.pdf', mediaType: 'document', mimeType: 'application/pdf' },
        { fileName: 'ceo-testimony-transcript.pdf', mediaType: 'document', mimeType: 'application/pdf' },
        { fileName: 'compliance-screenshot-2026.png', mediaType: 'screenshot', mimeType: 'image/png' },
        { fileName: 'whistleblower-audio-clip.wav', mediaType: 'audio', mimeType: 'audio/wav' },
        { fileName: 'contract-scan-page1.jpg', mediaType: 'image', mimeType: 'image/jpeg' },
      ];
      for (const m of mediaItems) {
        const asset = await syntheticMediaAuthService.signMedia(
          orgId, m.fileName, m.mediaType as any, m.mimeType,
          `content-${m.fileName}-${Date.now()}`, seededBy,
          { source: 'upload', capturedAt: new Date(), capturedBy: seededBy }
        );
        // Analyze first 3 for authenticity
        if (mediaItems.indexOf(m) < 3) {
          try { await syntheticMediaAuthService.analyzeAuthenticity(asset.id, seededBy); } catch {}
        }
      }
      seeded.push('media');
    }

    // 3. Jurisdiction — assess across jurisdictions if no conflicts
    if (crossJurisdictionConflictService.getAllConflicts().length === 0) {
      await crossJurisdictionConflictService.assessOrganization(
        orgId, orgName,
        ['US', 'EU', 'UK', 'SG', 'CH'] as any,
        seededBy
      );
      seeded.push('jurisdiction');
    }

    // 4. Timestamps — issue sample tokens if none exist
    if (timestampAuthorityService.getAllTokens().length === 0) {
      const tsItems = [
        { data: 'deliberation-start-4f555f21', desc: 'Deliberation initiated: SAR Alert Assessment', type: 'deliberation' },
        { data: 'decision-packet-signed-abc123', desc: 'Decision packet signed by Council', type: 'decision' },
        { data: 'evidence-vault-hash-def456', desc: 'Evidence vault integrity checkpoint', type: 'evidence' },
        { data: 'compliance-gate-cleared-ghi789', desc: 'BSA/AML compliance gate cleared', type: 'compliance' },
        { data: 'audit-trail-snapshot-jkl012', desc: 'Quarterly audit trail snapshot', type: 'audit' },
        { data: 'override-accountability-mno345', desc: 'CEO override logged with justification', type: 'override' },
      ];
      for (const t of tsItems) {
        await timestampAuthorityService.issueTimestamp(
          orgId, t.data, t.desc, t.type as any, undefined,
          { useExternal: false, useBlockchain: tsItems.indexOf(t) < 2 }
        );
      }
      seeded.push('timestamps');
    }

    // 5. Similarity — add decision records if none exist
    if (decisionSimilarityService.getAllDecisions().length === 0) {
      const decItems = [
        { title: 'Q4 Expansion into APAC Markets', question: 'Should we expand operations into Singapore and Hong Kong?', dept: 'Strategy', type: 'strategic', outcome: 'successful', urgency: 'medium' },
        { title: 'SAR Filing for Suspicious Wire Transfer', question: 'Should a SAR be filed for the $2.3M wire to shell entity?', dept: 'Compliance', type: 'regulatory', outcome: 'successful', urgency: 'critical' },
        { title: 'AI Model Deployment Governance', question: 'Should the new credit scoring model be deployed without additional bias testing?', dept: 'Technology', type: 'operational', outcome: 'partially_successful', urgency: 'high' },
        { title: 'Board Compensation Restructuring', question: 'Should executive compensation be tied to ESG metrics?', dept: 'HR', type: 'strategic', outcome: 'successful', urgency: 'low' },
        { title: 'Third-Party Vendor Risk Assessment', question: 'Should we continue the relationship with CloudVault given the data breach?', dept: 'Risk', type: 'risk_assessment', outcome: 'successful', urgency: 'high' },
        { title: 'Cross-Border Data Transfer Policy', question: 'How should we handle EU-US data transfers post-Privacy Shield invalidation?', dept: 'Legal', type: 'regulatory', outcome: 'partially_successful', urgency: 'high' },
        { title: 'Whistleblower Report Investigation', question: 'Should an external investigation be initiated based on the anonymous report?', dept: 'Compliance', type: 'regulatory', outcome: 'successful', urgency: 'critical' },
        { title: 'Capital Allocation for Quantum Security', question: 'Should $5M be allocated to post-quantum cryptography migration?', dept: 'Technology', type: 'investment', outcome: 'too_early', urgency: 'medium' },
      ];
      for (const d of decItems) {
        decisionSimilarityService.addDecisionRecord({
          organizationId: orgId,
          title: d.title,
          question: d.question,
          context: `${d.dept} department decision requiring Council deliberation`,
          department: d.dept,
          decisionType: d.type as any,
          urgency: d.urgency as any,
          outcome: d.outcome as any,
          outcomeDescription: `Decision ${d.outcome?.replace(/_/g, ' ')}`,
          decidedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          decidedBy: seededBy,
          tags: [d.dept.toLowerCase(), d.type],
          relatedDecisionIds: [],
          overrideOccurred: d.title.includes('Override') || Math.random() < 0.15,
          lessonsLearned: d.outcome === 'successful' ? ['Process worked as designed'] : d.outcome === 'partially_successful' ? ['Additional review step needed'] : [],
        });
      }
      seeded.push('similarity');
    }

    // 6. Cognitive Bias — analyze a sample deliberation if no analyses exist
    if (cognitiveBiasMitigationService.getAllAnalyses().length === 0) {
      await cognitiveBiasMitigationService.analyzeDeliberation({
        organizationId: orgId,
        deliberationId: '4f555f21-64c2-45ac-b26d-8b9933e87575',
        deliberationTitle: 'SAR Alert Assessment — Suspicious Wire Transfer',
        deliberationDurationMinutes: 45,
        agentCount: 6,
        dissentCount: 1,
        devilsAdvocatePresent: true,
        challengeCount: 8,
        unanimousVote: false,
        arguments: [
          { agentRole: 'CLO', position: 'File SAR immediately — regulatory obligation is clear', evidence: ['AML pattern match'], sentiment: 'support' as const },
          { agentRole: 'CFO', position: 'Agree — pattern matches known shell entity typologies', evidence: ['Transaction analysis'], sentiment: 'support' as const },
          { agentRole: 'CRO', position: 'Dissent — insufficient evidence for definitive filing', evidence: ['Risk threshold not met'], sentiment: 'oppose' as const },
        ],
        analyzedBy: seededBy,
      });
      seeded.push('bias');
    }

    res.json({ success: true, data: { seeded, message: seeded.length > 0 ? `Seeded: ${seeded.join(', ')}` : 'All services already have data' } });
  } catch (err: unknown) {
    logger.error('DCII demo seed failed:', err);
    res.status(500).json({ success: false, error: { code: 'SEED_FAILED', message: getErrorMessage(err) } });
  }
});

// =============================================================================
// DCII STATUS
// =============================================================================

router.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'CendiaDCII™ — Decision Crisis Immunization Infrastructure',
      version: '3.0.0',
      pillar: 'dcii',
      tier: 'foundation',
      tierDescription: 'Tier 1: Foundation — Make decisions ? Understand them ? Prove them',
      modules: {
        iiss: { status: 'operational', description: 'CendiaIISS™ — Institutional Immune System Score (9 primitives)' },
        cognitiveBias: { status: 'operational', description: 'CendiaBiasMitigation™ — Cognitive Bias Mitigation (P6)' },
        syntheticMedia: { status: 'operational', description: 'CendiaMediaAuth™ — Synthetic Media Authentication (P8)' },
        crossJurisdiction: { status: 'operational', description: 'CendiaJurisdiction™ — Cross-Jurisdiction Conflict Detection (P9)' },
        timestampAuthority: { status: 'operational', description: 'CendiaTimestamp™ — RFC 3161 Timestamp Authority (P1)' },
        decisionSimilarity: { status: 'operational', description: 'CendiaSimilarity™ — Decision Similarity Engine' },
      },
      primitives: [
        { id: 'P1', name: 'Discovery-Time Proof', question: 'When did you know?', service: 'CendiaTimestamp' },
        { id: 'P2', name: 'Deliberation Capture', question: 'What did you consider?', service: 'Council + CendiaVault' },
        { id: 'P3', name: 'Override Accountability', question: 'Who decided and why?', service: 'CendiaResponsibility + CendiaNotary' },
        { id: 'P4', name: 'Continuity Memory', question: 'Is knowledge preserved?', service: 'CendiaMemory + Pantheon' },
        { id: 'P5', name: 'Drift Detection', question: 'Are you still compliant?', service: 'CendiaDrift' },
        { id: 'P6', name: 'Cognitive Bias Mitigation', question: 'Did you challenge assumptions?', service: 'CendiaBiasMitigation' },
        { id: 'P7', name: 'Quantum-Resistant Integrity', question: 'Is the proof future-proof?', service: 'PostQuantumKMS' },
        { id: 'P8', name: 'Synthetic Media Authentication', question: 'Is the evidence authentic?', service: 'CendiaMediaAuth' },
        { id: 'P9', name: 'Cross-Jurisdiction Compliance', question: 'Did you comply everywhere?', service: 'CendiaJurisdiction' },
      ],
    },
  });
});

// =============================================================================
// IISS - INSTITUTIONAL IMMUNE SYSTEM SCORE
// =============================================================================

// Calculate IISS for an organization
router.post('/iiss/calculate', async (req: Request, res: Response) => {
  try {
    const { organizationId, organizationName } = req.body;
    const initiatedBy = req.user?.email || 'api-user';
    if (!organizationId || !organizationName) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId and organizationName required' } });
    }
    const score = await iissService.calculateScore(organizationId, organizationName, initiatedBy);
    res.json({ success: true, data: score });
  } catch (err: unknown) {
    logger.error('IISS calculation failed:', err);
    res.status(500).json({ success: false, error: { code: 'CALCULATION_FAILED', message: getErrorMessage(err) } });
  }
});

// Get latest IISS score for an organization
router.get('/iiss/score/:organizationId', (req: Request, res: Response) => {
  const score = iissService.getLatestScore(req.params.organizationId);
  if (!score) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No IISS score found for organization' } });
  res.json({ success: true, data: score });
});

// Get IISS score by ID
router.get('/iiss/score/id/:scoreId', (req: Request, res: Response) => {
  const score = iissService.getScore(req.params.scoreId);
  if (!score) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Score not found' } });
  res.json({ success: true, data: score });
});

// Get IISS history
router.get('/iiss/history/:organizationId', (req: Request, res: Response) => {
  const history = iissService.getHistory(req.params.organizationId);
  res.json({ success: true, data: history });
});

// Get all IISS scores
router.get('/iiss/scores', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getAllScores() });
});

// Get dimension definitions
router.get('/iiss/dimensions', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getDimensionDefinitions() });
});

// Get score band info
router.get('/iiss/bands', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getScoreBandInfo() });
});

// Get industry benchmarks
router.get('/iiss/benchmarks', (req: Request, res: Response) => {
  const industry = req.query.industry as string | undefined;
  res.json({ success: true, data: iissService.getBenchmarks(industry) });
});

// Get assessment details
router.get('/iiss/assessment/:assessmentId', (req: Request, res: Response) => {
  const assessment = iissService.getAssessment(req.params.assessmentId);
  if (!assessment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assessment not found' } });
  res.json({ success: true, data: assessment });
});

// =============================================================================
// COGNITIVE BIAS MITIGATION (P6)
// =============================================================================

// Analyze a deliberation for cognitive biases
router.post('/bias/analyze', async (req: Request, res: Response) => {
  try {
    const { organizationId, deliberationId, deliberationTitle, deliberationDurationMinutes, agentCount, dissentCount, devilsAdvocatePresent, challengeCount, unanimousVote, arguments: args } = req.body;
    const analyzedBy = req.user?.email || 'api-user';
    if (!organizationId || !deliberationId || !deliberationTitle) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, deliberationId, and deliberationTitle required' } });
    }
    const analysis = await cognitiveBiasMitigationService.analyzeDeliberation({
      organizationId, deliberationId, deliberationTitle,
      deliberationDurationMinutes: deliberationDurationMinutes || 0,
      agentCount: agentCount || 0, dissentCount: dissentCount || 0,
      devilsAdvocatePresent: devilsAdvocatePresent || false,
      challengeCount: challengeCount || 0, unanimousVote: unanimousVote || false,
      arguments: args || [], analyzedBy,
    });
    res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    logger.error('Bias analysis failed:', err);
    res.status(500).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: getErrorMessage(err) } });
  }
});

// Get bias analysis by ID
router.get('/bias/analysis/:analysisId', (req: Request, res: Response) => {
  const analysis = cognitiveBiasMitigationService.getAnalysis(req.params.analysisId);
  if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found' } });
  res.json({ success: true, data: analysis });
});

// Get analyses by organization
router.get('/bias/analyses/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAnalysesByOrganization(req.params.organizationId) });
});

// Get analyses by deliberation
router.get('/bias/by-deliberation/:deliberationId', (req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAnalysesByDeliberation(req.params.deliberationId) });
});

// Mitigate a detected bias
router.post('/bias/mitigate/:analysisId/:biasDetectionId', (req: Request, res: Response) => {
  const { action } = req.body;
  const mitigatedBy = req.user?.email || 'api-user';
  if (!action) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'action required' } });
  const detection = cognitiveBiasMitigationService.mitigateBias(req.params.analysisId, req.params.biasDetectionId, action, mitigatedBy);
  if (!detection) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis or bias detection not found' } });
  res.json({ success: true, data: detection });
});

// Accept bias risk
router.post('/bias/accept-risk/:analysisId/:biasDetectionId', (req: Request, res: Response) => {
  const { justification } = req.body;
  const acceptedBy = req.user?.email || 'api-user';
  if (!justification) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'justification required' } });
  const detection = cognitiveBiasMitigationService.acceptBiasRisk(req.params.analysisId, req.params.biasDetectionId, acceptedBy, justification);
  if (!detection) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis or bias detection not found' } });
  res.json({ success: true, data: detection });
});

// Generate bias report for organization
router.post('/bias/report', (req: Request, res: Response) => {
  try {
    const { organizationId, from, to } = req.body;
    if (!organizationId) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId required' } });
    const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();
    const report = cognitiveBiasMitigationService.generateReport(organizationId, fromDate, toDate);
    res.json({ success: true, data: report });
  } catch (err: unknown) {
    logger.error('Bias report generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'REPORT_FAILED', message: getErrorMessage(err) } });
  }
});

// Get bias report by ID
router.get('/bias/report/:reportId', (req: Request, res: Response) => {
  const report = cognitiveBiasMitigationService.getReport(req.params.reportId);
  if (!report) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Report not found' } });
  res.json({ success: true, data: report });
});

// Get bias definitions (all 12 types)
router.get('/bias/definitions', (_req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getBiasDefinitions() });
});

// Get all analyses
router.get('/bias/analyses', (_req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAllAnalyses() });
});

// =============================================================================
// SYNTHETIC MEDIA AUTHENTICATION
// =============================================================================

// Sign media (create provenance)
router.post('/media/sign', async (req: Request, res: Response) => {
  try {
    const { organizationId, fileName, mediaType, mimeType, content, origin } = req.body;
    const createdBy = req.user?.email || 'api-user';
    if (!organizationId || !fileName || !mediaType) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, fileName, and mediaType required' } });
    }
    const asset = await syntheticMediaAuthService.signMedia(
      organizationId, fileName, mediaType, mimeType || 'application/octet-stream',
      content || `content-${Date.now()}`, createdBy,
      origin || { source: 'upload', capturedAt: new Date(), capturedBy: createdBy }
    );
    res.json({ success: true, data: asset });
  } catch (err: unknown) {
    logger.error('Media signing failed:', err);
    res.status(500).json({ success: false, error: { code: 'SIGNING_FAILED', message: getErrorMessage(err) } });
  }
});

// Analyze media authenticity (deepfake detection)
router.post('/media/analyze/:assetId', async (req: Request, res: Response) => {
  try {
    const analyzedBy = req.user?.email || 'api-user';
    const assessment = await syntheticMediaAuthService.analyzeAuthenticity(req.params.assetId, analyzedBy);
    res.json({ success: true, data: assessment });
  } catch (err: unknown) {
    logger.error('Media analysis failed:', err);
    res.status(500).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: getErrorMessage(err) } });
  }
});

// Get media asset
router.get('/media/asset/:assetId', (req: Request, res: Response) => {
  const asset = syntheticMediaAuthService.getAsset(req.params.assetId);
  if (!asset) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } });
  res.json({ success: true, data: asset });
});

// Get assets by organization
router.get('/media/assets/:organizationId', (req: Request, res: Response) => {
  const assets = syntheticMediaAuthService.getAssetsByOrganization(req.params.organizationId);
  res.json({ success: true, data: assets });
});

// Get all assets
router.get('/media/assets', (_req: Request, res: Response) => {
  res.json({ success: true, data: syntheticMediaAuthService.getAllAssets() });
});

// Generate verification report
router.get('/media/report/:assetId', async (req: Request, res: Response) => {
  try {
    const report = await syntheticMediaAuthService.generateVerificationReport(req.params.assetId);
    res.json({ success: true, data: report });
  } catch (err: unknown) {
    logger.error('Report generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'REPORT_FAILED', message: getErrorMessage(err) } });
  }
});

// Add custody entry
router.post('/media/custody/:assetId', (req: Request, res: Response) => {
  const { action, actorRole, details, ipAddress } = req.body;
  const actor = req.user?.email || 'api-user';
  const entry = syntheticMediaAuthService.addCustodyEntry(req.params.assetId, action, actor, actorRole || 'user', details || '', ipAddress);
  if (!entry) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } });
  res.json({ success: true, data: entry });
});

// =============================================================================
// CROSS-JURISDICTION COMPLIANCE CONFLICT DETECTION
// =============================================================================

// Assess organization across jurisdictions
router.post('/jurisdiction/assess', async (req: Request, res: Response) => {
  try {
    const { organizationId, organizationName, jurisdictions } = req.body;
    const assessedBy = req.user?.email || 'api-user';
    if (!organizationId || !organizationName || !jurisdictions?.length) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, organizationName, and jurisdictions required' } });
    }
    const assessment = await crossJurisdictionConflictService.assessOrganization(organizationId, organizationName, jurisdictions, assessedBy);
    res.json({ success: true, data: assessment });
  } catch (err: unknown) {
    logger.error('Jurisdiction assessment failed:', err);
    res.status(500).json({ success: false, error: { code: 'ASSESSMENT_FAILED', message: getErrorMessage(err) } });
  }
});

// Get assessment
router.get('/jurisdiction/assessment/:assessmentId', (req: Request, res: Response) => {
  const assessment = crossJurisdictionConflictService.getAssessment(req.params.assessmentId);
  if (!assessment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assessment not found' } });
  res.json({ success: true, data: assessment });
});

// Get assessments by organization
router.get('/jurisdiction/assessments/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getAssessmentsByOrganization(req.params.organizationId) });
});

// Get conflicts by organization
router.get('/jurisdiction/conflicts/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getConflictsByOrganization(req.params.organizationId) });
});

// Get all conflicts
router.get('/jurisdiction/conflicts', (_req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getAllConflicts() });
});

// Get specific conflict
router.get('/jurisdiction/conflict/:conflictId', (req: Request, res: Response) => {
  const conflict = crossJurisdictionConflictService.getConflict(req.params.conflictId);
  if (!conflict) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conflict not found' } });
  res.json({ success: true, data: conflict });
});

// Generate good-faith documentation
router.post('/jurisdiction/good-faith/:conflictId', async (req: Request, res: Response) => {
  try {
    const signedBy = req.user?.email || 'api-user';
    const doc = await crossJurisdictionConflictService.generateGoodFaithDocument(req.params.conflictId, signedBy);
    res.json({ success: true, data: doc });
  } catch (err: unknown) {
    logger.error('Good-faith document generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'GENERATION_FAILED', message: getErrorMessage(err) } });
  }
});

// Generate jurisdiction evidence packet
router.post('/jurisdiction/evidence-packet', async (req: Request, res: Response) => {
  try {
    const { organizationId, jurisdiction, framework, packetType } = req.body;
    const generatedBy = req.user?.email || 'api-user';
    if (!organizationId || !jurisdiction || !framework) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, jurisdiction, and framework required' } });
    }
    const packet = await crossJurisdictionConflictService.generateEvidencePacket(
      organizationId, jurisdiction, framework, packetType || 'compliance_report', generatedBy
    );
    res.json({ success: true, data: packet });
  } catch (err: unknown) {
    logger.error('Evidence packet generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'GENERATION_FAILED', message: getErrorMessage(err) } });
  }
});

// Get evidence packets by organization
router.get('/jurisdiction/evidence-packets/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getEvidencePacketsByOrganization(req.params.organizationId) });
});

// Get jurisdiction profiles
router.get('/jurisdiction/profiles', (_req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getJurisdictionProfiles() });
});

// Get specific jurisdiction profile
router.get('/jurisdiction/profile/:jurisdiction', (req: Request, res: Response) => {
  const profile = crossJurisdictionConflictService.getJurisdictionProfile(req.params.jurisdiction as any);
  if (!profile) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Jurisdiction profile not found' } });
  res.json({ success: true, data: profile });
});

// =============================================================================
// RFC 3161 TIMESTAMP AUTHORITY
// =============================================================================

// Issue a timestamp
router.post('/timestamp/issue', async (req: Request, res: Response) => {
  try {
    const { organizationId, data, description, dataType, referenceId, useExternal, useBlockchain, preferredProvider } = req.body;
    if (!organizationId || !data || !description) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, data, and description required' } });
    }
    const token = await timestampAuthorityService.issueTimestamp(
      organizationId, data, description, dataType || 'generic', referenceId,
      { useExternal, useBlockchain, preferredProvider }
    );
    res.json({ success: true, data: token });
  } catch (err: unknown) {
    logger.error('Timestamp issuance failed:', err);
    res.status(500).json({ success: false, error: { code: 'ISSUANCE_FAILED', message: getErrorMessage(err) } });
  }
});

// Batch timestamp
router.post('/timestamp/batch', async (req: Request, res: Response) => {
  try {
    const { organizationId, items, useExternal, useBlockchain } = req.body;
    if (!organizationId || !items?.length) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId and items required' } });
    }
    const batch = await timestampAuthorityService.batchTimestamp(organizationId, items, { useExternal, useBlockchain });
    res.json({ success: true, data: batch });
  } catch (err: unknown) {
    logger.error('Batch timestamp failed:', err);
    res.status(500).json({ success: false, error: { code: 'BATCH_FAILED', message: getErrorMessage(err) } });
  }
});

// Verify a timestamp
router.post('/timestamp/verify/:tokenId', async (req: Request, res: Response) => {
  try {
    const verifiedBy = req.user?.email || 'api-user';
    const verification = await timestampAuthorityService.verifyTimestamp(req.params.tokenId, verifiedBy);
    res.json({ success: true, data: verification });
  } catch (err: unknown) {
    logger.error('Timestamp verification failed:', err);
    res.status(500).json({ success: false, error: { code: 'VERIFICATION_FAILED', message: getErrorMessage(err) } });
  }
});

// Get timestamp token
router.get('/timestamp/token/:tokenId', (req: Request, res: Response) => {
  const token = timestampAuthorityService.getToken(req.params.tokenId);
  if (!token) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Token not found' } });
  res.json({ success: true, data: token });
});

// Get tokens by organization
router.get('/timestamp/tokens/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getTokensByOrganization(req.params.organizationId) });
});

// Get all tokens
router.get('/timestamp/tokens', (_req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getAllTokens() });
});

// Get tokens by reference
router.get('/timestamp/by-reference/:referenceId', (req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getTokensByReference(req.params.referenceId) });
});

// Get TSA providers
router.get('/timestamp/providers', (_req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getProviders() });
});

// Get timestamp stats
router.get('/timestamp/stats', (req: Request, res: Response) => {
  const organizationId = req.query.organizationId as string | undefined;
  res.json({ success: true, data: timestampAuthorityService.getStats(organizationId) });
});

// Get batch
router.get('/timestamp/batch/:batchId', (req: Request, res: Response) => {
  const batch = timestampAuthorityService.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Batch not found' } });
  res.json({ success: true, data: batch });
});

// =============================================================================
// DECISION SIMILARITY
// =============================================================================

// Search for similar decisions
router.post('/similarity/search', async (req: Request, res: Response) => {
  try {
    const { organizationId, title, question, context, decisionType, department, urgency, tags, maxResults, minSimilarity, includeOutcomes, includeCrossDepartment } = req.body;
    if (!organizationId || !title || !question) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, title, and question required' } });
    }
    const result = await decisionSimilarityService.findSimilarDecisions({
      organizationId, title, question, context: context || '',
      decisionType, department, urgency, tags,
      maxResults, minSimilarity, includeOutcomes, includeCrossDepartment,
    });
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    logger.error('Similarity search failed:', err);
    res.status(500).json({ success: false, error: { code: 'SEARCH_FAILED', message: getErrorMessage(err) } });
  }
});

// Add a decision record
router.post('/similarity/decisions', (req: Request, res: Response) => {
  try {
    const record = req.body;
    if (!record.organizationId || !record.title || !record.question) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, title, and question required' } });
    }
    const decision = decisionSimilarityService.addDecisionRecord({
      ...record,
      decidedAt: record.decidedAt ? new Date(record.decidedAt) : new Date(),
      decidedBy: record.decidedBy || req.user?.email || 'api-user',
      tags: record.tags || [],
      relatedDecisionIds: record.relatedDecisionIds || [],
      overrideOccurred: record.overrideOccurred || false,
    });
    res.json({ success: true, data: decision });
  } catch (err: unknown) {
    logger.error('Decision record creation failed:', err);
    res.status(500).json({ success: false, error: { code: 'CREATION_FAILED', message: getErrorMessage(err) } });
  }
});

// Update decision outcome
router.put('/similarity/decisions/:decisionId/outcome', (req: Request, res: Response) => {
  const { outcome, outcomeDescription, lessonsLearned, dissenterWasCorrect } = req.body;
  const decision = decisionSimilarityService.updateOutcome(
    req.params.decisionId, outcome, outcomeDescription, lessonsLearned, dissenterWasCorrect
  );
  if (!decision) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Decision not found' } });
  res.json({ success: true, data: decision });
});

// Get decisions by organization
router.get('/similarity/decisions/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getDecisionsByOrganization(req.params.organizationId) });
});

// Get all decisions
router.get('/similarity/decisions', (_req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getAllDecisions() });
});

// Get specific decision
router.get('/similarity/decision/:decisionId', (req: Request, res: Response) => {
  const decision = decisionSimilarityService.getDecision(req.params.decisionId);
  if (!decision) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Decision not found' } });
  res.json({ success: true, data: decision });
});

// Detect patterns
router.post('/similarity/patterns/:organizationId', async (req: Request, res: Response) => {
  try {
    const patterns = await decisionSimilarityService.detectPatterns(req.params.organizationId);
    res.json({ success: true, data: patterns });
  } catch (err: unknown) {
    logger.error('Pattern detection failed:', err);
    res.status(500).json({ success: false, error: { code: 'DETECTION_FAILED', message: getErrorMessage(err) } });
  }
});

// Get patterns by organization
router.get('/similarity/patterns/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getPatternsByOrganization(req.params.organizationId) });
});

// Get similarity stats
router.get('/similarity/stats/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getStats(req.params.organizationId) });
});

// Get search result
router.get('/similarity/result/:resultId', (req: Request, res: Response) => {
  const result = decisionSimilarityService.getSearchResult(req.params.resultId);
  if (!result) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Search result not found' } });
  res.json({ success: true, data: result });
});

export default router;

