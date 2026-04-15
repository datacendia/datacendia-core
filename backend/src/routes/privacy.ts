// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Privacy API Routes — GDPR Articles 15-22 / CCPA Consumer Rights / HIPAA §164.514
 *                      Colorado SB 205 / NYC LL 144 / Illinois AIVIA / EU Data Act Art. 23
 *
 * Endpoints:
 *   GET    /api/v1/privacy/access               — Art. 15 DSAR (right of access)
 *   GET    /api/v1/privacy/export               — Art. 20 data portability
 *   DELETE /api/v1/privacy/erasure              — Art. 17 right to erasure
 *   POST   /api/v1/privacy/restrict             — Art. 18 right to restriction
 *   POST   /api/v1/privacy/deidentify           — HIPAA §164.514(b) Safe Harbor
 *   POST   /api/v1/privacy/rectify              — Art. 16 right to rectification
 *   POST   /api/v1/privacy/appeal-ai-decision   — CO SB 205 §6-1-1703; VA CDPA; TX TDPSA
 *   GET    /api/v1/privacy/aedt-disclosure      — NYC LL 144 AEDT notice
 *   GET    /api/v1/privacy/org-export           — EU Data Act Art. 23 full org export
 *   POST   /api/v1/privacy/opt-out-profiling    — TX/VA/CO/CT/OR profiling opt-out
 *   POST   /api/v1/privacy/ai-impact-assessment — CO SB 205 / EU AI Act impact assessment
 *   POST   /api/v1/privacy/classify-ai-use-case — AIRegulatoryClassifier public endpoint
 *   GET    /api/v1/privacy/ccpa/notice          — CCPA §1798.130 consumer notice
 *   POST   /api/v1/privacy/ccpa/opt-out         — CCPA §1798.120 opt-out
 *   GET    /api/v1/privacy/ccpa/status          — CCPA status check
 *   POST   /api/v1/privacy/ccpa/limit-sensitive  — CPRA §1798.121 limit use of sensitive personal info
 *   POST   /api/v1/privacy/wa-mhmda-consent      — WA MHMDA §RCW 70.02 health data consent flag
 *
 * All endpoints require authentication. Users may only act on their own data
 * unless they hold ADMIN/SUPER_ADMIN role.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { devAuth, requireRole } from '../middleware/auth.js';
import { dataSubjectRightsService } from '../services/privacy/DataSubjectRightsService.js';
import { phiDeIdentificationService } from '../services/privacy/PHIDeIdentificationService.js';
import { aiRegulatoryClassifier } from '../services/compliance/AIRegulatoryClassifier.js';
import { auditService } from '../security/audit.service.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';

const router = Router();

router.use(devAuth);

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

const erasureSchema = z.object({
  userId: z.string().uuid().optional(), // Admin only — defaults to self
  reason: z.string().min(10).max(500),
  confirmPhrase: z.literal('I confirm I want to erase this account permanently'),
});

const restrictSchema = z.object({
  userId: z.string().uuid().optional(),
  reason: z.string().min(10).max(500),
});

const deidentifySchema = z.object({
  text: z.string().max(100000).optional(),
  object: z.record(z.unknown()).optional(),
  mode: z.enum(['safe_harbor', 'expert_determination']).default('safe_harbor'),
}).refine((d: { text?: string; object?: Record<string, unknown> }) => d.text !== undefined || d.object !== undefined, {
  message: 'Provide either text or object to de-identify',
});

// ============================================================================
// HELPERS
// ============================================================================

function resolveSubjectUserId(req: Request, requestedId?: string): string {
  const caller = req.user!;
  if (!requestedId || requestedId === caller.id) return caller.id;
  if (caller.role !== 'SUPER_ADMIN' && caller.role !== 'ADMIN') {
    throw Object.assign(new Error('Forbidden: you may only manage your own data'), { statusCode: 403 });
  }
  return requestedId;
}

// ============================================================================
// GET /api/v1/privacy/access — GDPR Art. 15 / CCPA Right to Know
// ============================================================================

router.get('/access', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = resolveSubjectUserId(req, req.query['userId'] as string | undefined);

    const report = await dataSubjectRightsService.generateDSAR(userId);

    await auditService.log({
      eventType: 'data.accessed',
      action: 'GDPR DSAR generated',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: req.organizationId!,
      resource: { type: 'privacy_dsar', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'GDPR Article 15' },
      severity: 'info',
    });

    res.json({ success: true, data: report });
  } catch (err: unknown) {
    const e = err as Error & { statusCode?: number };
    logger.error('[Privacy] DSAR failed', e);
    res.status(e.statusCode ?? 500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// GET /api/v1/privacy/export — GDPR Art. 20 Data Portability
// ============================================================================

router.get('/export', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = resolveSubjectUserId(req, req.query['userId'] as string | undefined);

    const exportData = await dataSubjectRightsService.exportPortableData(userId);

    await auditService.log({
      eventType: 'data.exported',
      action: 'GDPR data portability export',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: req.organizationId!,
      resource: { type: 'privacy_export', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'GDPR Article 20', format: 'JSON' },
      severity: 'info',
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="datacendia-data-export-${userId}-${Date.now()}.json"`);
    res.json({ success: true, data: exportData });
  } catch (err: unknown) {
    const e = err as Error & { statusCode?: number };
    logger.error('[Privacy] Export failed', e);
    res.status(e.statusCode ?? 500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// DELETE /api/v1/privacy/erasure — GDPR Art. 17 Right to be Forgotten
// ============================================================================

router.delete('/erasure', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = erasureSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const subjectUserId = resolveSubjectUserId(req, parsed.data.userId);
    const result = await dataSubjectRightsService.eraseUser(subjectUserId, req.user!.id);

    await auditService.log({
      eventType: 'data.deleted',
      action: 'GDPR erasure completed',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: req.organizationId!,
      resource: { type: 'privacy_erasure', id: subjectUserId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'GDPR Article 17', reason: parsed.data.reason },
      severity: 'warning',
    });

    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const e = err as Error & { statusCode?: number };
    logger.error('[Privacy] Erasure failed', e);
    res.status(e.statusCode ?? 500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/restrict — GDPR Art. 18 Right to Restriction
// ============================================================================

router.post('/restrict', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = restrictSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const subjectUserId = resolveSubjectUserId(req, parsed.data.userId);
    const result = await dataSubjectRightsService.restrictProcessing(subjectUserId, parsed.data.reason);

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'GDPR processing restriction applied',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: req.organizationId!,
      resource: { type: 'privacy_restriction', id: subjectUserId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'GDPR Article 18', reason: parsed.data.reason },
      severity: 'warning',
    });

    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const e = err as Error & { statusCode?: number };
    logger.error('[Privacy] Restriction failed', e);
    res.status(e.statusCode ?? 500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/deidentify — HIPAA §164.514(b) Safe Harbor
// ============================================================================

router.post('/deidentify', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = deidentifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const options = { mode: parsed.data.mode as 'safe_harbor' | 'expert_determination' };

    if (parsed.data.text !== undefined) {
      const result = phiDeIdentificationService.deIdentifyText(parsed.data.text, options);
      res.json({ success: true, data: result });
      return;
    }

    if (parsed.data.object !== undefined) {
      const result = phiDeIdentificationService.deIdentifyObject(parsed.data.object, options);
      res.json({ success: true, data: result });
      return;
    }
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] De-identification failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// GET /api/v1/privacy/policy — Machine-readable privacy notice
// ============================================================================

router.get('/policy', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      version: '1.0',
      effectiveDate: '2026-04-15',
      controller: 'Datacendia, LLC',
      contactEmail: 'privacy@datacendia.com',
      processingPurposes: [
        { purpose: 'Service delivery', legalBasis: 'Contract performance (Art. 6(1)(b))' },
        { purpose: 'Security and fraud prevention', legalBasis: 'Legitimate interest (Art. 6(1)(f))' },
        { purpose: 'Legal compliance', legalBasis: 'Legal obligation (Art. 6(1)(c))' },
        { purpose: 'Product analytics', legalBasis: 'Legitimate interest (Art. 6(1)(f))' },
      ],
      dataSubjectRights: [
        { right: 'Access', article: 'GDPR Art. 15', endpoint: 'GET /api/v1/privacy/access' },
        { right: 'Portability', article: 'GDPR Art. 20', endpoint: 'GET /api/v1/privacy/export' },
        { right: 'Erasure', article: 'GDPR Art. 17', endpoint: 'DELETE /api/v1/privacy/erasure' },
        { right: 'Restriction', article: 'GDPR Art. 18', endpoint: 'POST /api/v1/privacy/restrict' },
      ],
      retentionPeriods: {
        accountData: '30 days after account closure',
        auditLogs: '7 years (legal compliance)',
        sessionData: '30 days',
        apiKeys: 'Until revoked',
      },
      subprocessors: [
        { name: 'Neon', purpose: 'Database hosting', location: 'US/EU', socReport: 'Neon SOC 2' },
        { name: 'Railway', purpose: 'Application hosting', location: 'US', socReport: 'Railway SOC 2' },
        { name: 'SendGrid (Twilio)', purpose: 'Email delivery', location: 'US', socReport: 'Twilio SOC 2 Type II' },
        { name: 'Upstash', purpose: 'Redis cache', location: 'US/EU', socReport: 'Upstash SOC 2' },
        { name: 'OpenAI', purpose: 'AI inference (optional)', location: 'US', socReport: 'OpenAI SOC 2 Type II' },
      ],
      dpo: 'No DPO required (Datacendia is not a public authority and does not engage in large-scale systematic monitoring)',
      dataTransfers: 'Standard Contractual Clauses (SCCs) used for transfers outside EEA where applicable',
    },
  });
});

// ============================================================================
// POST /api/v1/privacy/opt-out-profiling — TX TDPSA, VA CDPA, CO CPA, CT CTDPA, OR OCPA
// Right to opt out of profiling for solely automated decisions with legal/significant effects
// ============================================================================

const profilingOptOutSchema = z.object({
  scope: z.enum(['all', 'ai_deliberation', 'recommendations', 'analytics']).default('all'),
});

router.post('/opt-out-profiling', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = profilingOptOutSchema.safeParse(req.body);
    const scope = parsed.success ? parsed.data.scope : 'all';
    const userId = req.user!.id;

    const existing = await prisma.users.findUnique({ where: { id: userId }, select: { preferences: true } });
    const prefs = (existing?.preferences as Record<string, unknown>) ?? {};
    const updated = { ...prefs, profilingOptOut: true, profilingOptOutScope: scope, profilingOptOutAt: new Date().toISOString() };

    await prisma.users.update({ where: { id: userId }, data: { preferences: updated } });

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'Profiling opt-out exercised',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'profiling_opt_out', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { scope, legalBasis: 'TX TDPSA §541.202; VA CDPA §59.1-578; CO CPA §6-1-1306; CT CTDPA §6-1-1306; OR OCPA §646A.574' },
      severity: 'info',
    });

    res.json({
      success: true,
      data: {
        optedOut: true,
        scope,
        optedOutAt: updated.profilingOptOutAt,
        legalBasis: 'TX TDPSA §541.202 / VA CDPA §59.1-578 / CO CPA §6-1-1306 / CT CTDPA / OR OCPA',
        message: 'You have opted out of profiling for automated decisions. AI deliberation results will still be available but will not be used for automated decision-making affecting your legal or similarly significant interests.',
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] Profiling opt-out failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// Global Privacy Control (GPC) auto-apply — honour Sec-GPC: 1 browser signal
// CA CPRA §1798.135(b) / CO CPA §6-1-1306(2) / TX TDPSA / OR OCPA
// Applied on any authenticated request where GPC signal is detected
// ============================================================================

router.use(async (req: Request, _res: any, next: any) => {
  try {
    if ((req as any).gpcOptOut && req.user?.id) {
      const user = await prisma.users.findUnique({ where: { id: req.user.id }, select: { ccpa_opt_out: true } });
      if (user && !user.ccpa_opt_out) {
        await prisma.users.update({
          where: { id: req.user.id },
          data: { ccpa_opt_out: true, ccpa_opt_out_at: new Date(), ccpa_data_category_prefs: { analytics: false, advertising: false, thirdParty: false } },
        });
        logger.info(`[Privacy] GPC opt-out auto-applied for user ${req.user.id}`);
      }
    }
  } catch { /* non-blocking — GPC enforcement best-effort */ }
  next();
});

// ============================================================================
// PATCH /api/v1/privacy/rectify — GDPR Art. 16 / PIPEDA / LGPD / APP Right to Rectification
// ============================================================================

const rectifySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  preferences: z.record(z.unknown()).optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    inApp: z.boolean().optional(),
    push: z.boolean().optional(),
    slack: z.boolean().optional(),
  }).optional(),
});

router.patch('/rectify', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = rectifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    if (!parsed.data.name && !parsed.data.preferences && !parsed.data.notificationPreferences) {
      res.status(400).json({ success: false, error: 'Provide at least one field to rectify' });
      return;
    }

    const userId = req.user!.id;
    const updateData: Record<string, unknown> = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.preferences) updateData.preferences = parsed.data.preferences;
    if (parsed.data.notificationPreferences) updateData.notification_preferences = parsed.data.notificationPreferences;

    await prisma.users.update({ where: { id: userId }, data: updateData });

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'GDPR rectification applied',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'privacy_rectification', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'GDPR Article 16 / PIPEDA / LGPD', fieldsUpdated: Object.keys(updateData) },
      severity: 'info',
    });

    res.json({
      success: true,
      data: { rectifiedAt: new Date().toISOString(), fieldsUpdated: Object.keys(updateData), legalBasis: 'GDPR Article 16' },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] Rectification failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/appeal-ai-decision — Colorado SB 205 §6-1-1703
// Right to appeal/human review of AI decisions with legal or significant effects
// ============================================================================

const aiAppealSchema = z.object({
  deliberationId: z.string().min(1),
  decisionContext: z.string().min(10).max(2000),
  appealReason: z.string().min(10).max(2000),
  requestHumanReview: z.boolean().default(true),
});

router.post('/appeal-ai-decision', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = aiAppealSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.id;
    const { deliberationId, decisionContext, appealReason, requestHumanReview } = parsed.data;

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'AI decision appeal submitted',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'ai_appeal', id: deliberationId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        deliberationId,
        decisionContext,
        appealReason,
        requestHumanReview,
        legalBasis: 'Colorado SB 205 §6-1-1703 (2026); VA CDPA §59.1-578; CT CTDPA; TX TDPSA §541.202',
      },
      severity: 'warning',
    });

    res.status(202).json({
      success: true,
      data: {
        appealId: `APPEAL-${Date.now()}-${userId.slice(0, 8)}`,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        deliberationId,
        humanReviewRequested: requestHumanReview,
        expectedResponseDays: 45,
        contactEmail: 'privacy@datacendia.com',
        legalBasis: 'Colorado AI Act SB 205 §6-1-1703 / VA CDPA §59.1-578 / CT CTDPA / TX TDPSA §541.202',
        message: 'Your appeal has been received. A human reviewer will assess the AI decision within 45 days. You will be notified at your registered email address.',
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] AI appeal submission failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// GET /api/v1/privacy/aedt-disclosure — NYC Local Law 144 AEDT disclosure
// Required notice when AI is used in employment screening decisions
// ============================================================================

router.get('/aedt-disclosure', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      title: 'Automated Employment Decision Tool (AEDT) Disclosure',
      statute: 'NYC Local Law 144 of 2021 (Admin. Code §20-870 et seq.)',
      effectiveDate: '2023-07-05',
      businessName: 'Datacendia, LLC',
      toolDescription: 'Datacendia uses machine learning and AI models to support deliberation workflows. When configured for employment-related decisions, the platform may constitute an Automated Employment Decision Tool (AEDT) under NYC Local Law 144.',
      dataUsed: [
        'Job application data provided by the employer',
        'Deliberation criteria configured by the employer',
        'Structured scoring and ranking outputs from AI models',
      ],
      biasAudit: {
        required: true,
        responsibility: 'The employer (customer) is responsible for conducting an annual bias audit of the AEDT before use for NYC employment decisions.',
        guidance: 'Datacendia provides audit data and model outputs upon request to facilitate LL 144 bias audits.',
        auditProviders: ['FairNow', 'Parity AI', 'BABL AI'],
      },
      candidateRights: [
        'Right to be informed that an AEDT is being used in your screening',
        'Right to request an alternative selection process',
        'Right to request the aedt-related data categories used',
      ],
      optOutEndpoint: 'Contact your prospective employer to request an alternative process per NYC LL 144',
      contactEmail: 'privacy@datacendia.com',
      publishedAt: 'https://app.datacendia.com/legal/aedt-disclosure',
    },
  });
});

// ============================================================================
// GET /api/v1/privacy/org-export — EU Data Act Art. 23 / Full Organisation Export
// Complete organisation data export for cloud switching / portability
// ============================================================================

router.get('/org-export', requireRole('OWNER', 'SUPER_ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.organizationId!;

    const [org, members, auditSample, apiKeys] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: orgId } }),
      prisma.team_members.findMany({ where: { organization_id: orgId }, include: { users: { select: { id: true, email: true, name: true, role: true, created_at: true } } } }),
      prisma.audit_logs.findMany({ where: { organization_id: orgId }, orderBy: { created_at: 'desc' }, take: 1000 }),
      prisma.api_keys.findMany({ where: { organization_id: orgId }, select: { id: true, name: true, created_at: true, last_used_at: true, revoked_at: true } }),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
      exportFormat: 'application/json',
      legalBasis: 'EU Data Act Regulation (EU) 2023/2854 Art. 23; GDPR Art. 20',
      organization: org,
      members: members.map((m: any) => ({ ...m.users, teamRole: m.role, joinedAt: m.created_at })),
      apiKeys,
      auditLogsSample: {
        note: 'Last 1000 audit events included. Full 7-year archive available via support request.',
        count: auditSample.length,
        events: auditSample,
      },
    };

    await auditService.log({
      eventType: 'data.exported',
      action: 'Full organisation data export (Data Act Art. 23)',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: orgId,
      resource: { type: 'org_export', id: orgId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'EU Data Act Art. 23; GDPR Art. 20', memberCount: members.length },
      severity: 'info',
    });

    // Enhance export with deliberations, agent configs, org settings per EU Data Act Art. 23
    const [deliberations, agentConfigs] = await Promise.all([
      (prisma as any).deliberations?.findMany?.({ where: { organization_id: orgId }, orderBy: { created_at: 'desc' }, take: 10000 }) ?? [],
      (prisma as any).agents?.findMany?.({ where: { organization_id: orgId } }) ?? [],
    ]);
    (exportPayload as any).deliberations = { count: deliberations.length, data: deliberations };
    (exportPayload as any).agentConfigurations = { count: agentConfigs.length, data: agentConfigs };

    res.setHeader('Content-Disposition', `attachment; filename="datacendia-org-export-${orgId}-${Date.now()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, data: exportPayload });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] Org export failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/ai-impact-assessment — Colorado SB 205 §6-1-1702
// Annual AI Impact Assessment generator (also covers EU AI Act Art. 9 risk management)
// ============================================================================

const aiImpactAssessmentSchema = z.object({
  useCase: z.string().min(5).max(500),
  deliberationTopic: z.string().min(5).max(500),
  targetAudience: z.string().optional(),
  jurisdiction: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  knownDataSources: z.array(z.string()).optional(),
  mitigationMeasures: z.array(z.string()).optional(),
});

router.post('/ai-impact-assessment', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = aiImpactAssessmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const { useCase, deliberationTopic, targetAudience, jurisdiction, benefits, knownDataSources, mitigationMeasures } = parsed.data;

    const classification = aiRegulatoryClassifier.classify({
      useCase, deliberationTopic, targetAudience, jurisdiction,
    });

    const assessmentId = `IMPACT-${Date.now()}-${req.user!.id.slice(0, 8)}`;

    await auditService.log({
      eventType: 'ai.regulatory_classified',
      action: 'AI Impact Assessment generated',
      outcome: 'success',
      userId: req.user!.id,
      organizationId: req.organizationId!,
      resource: { type: 'ai_impact_assessment', id: assessmentId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { useCase, domain: classification.consequentialDomain, risk: classification.overallRisk, frameworks: classification.applicableFrameworks },
      severity: 'info',
    });

    res.json({
      success: true,
      data: {
        assessmentId,
        generatedAt: new Date().toISOString(),
        nextReviewDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        useCase,
        deliberationTopic,
        classification: {
          consequentialDomain: classification.consequentialDomain,
          overallRisk: classification.overallRisk,
          isHighRiskAI: classification.isHighRiskAI,
          isAEDT: classification.isAEDT,
          requiresVideoConsent: classification.requiresVideoConsent,
          isGDPRArticle22: classification.isGDPRArticle22,
          isEUAIActHighRisk: classification.isEUAIActHighRisk,
          applicableFrameworks: classification.applicableFrameworks,
        },
        prohibitedPracticeFlags: classification.prohibitedFlags,
        requiredActions: {
          biasAudits: classification.biasAuditRequirements,
          consents: classification.requiredConsents.map(c => ({ framework: c.framework, gate: c.gate, apiField: c.apiField })),
          disclosures: classification.requiredDisclosures.map(d => ({ framework: d.framework, statute: d.statute, timing: d.timing })),
        },
        assessmentTemplate: {
          purpose: useCase,
          benefits: benefits ?? ['[Document expected benefits]'],
          dataSourcesUsed: knownDataSources ?? ['[List data sources used for AI training and inference]'],
          risksOfAlgorithmicDiscrimination: classification.consequentialDomain !== 'NONE'
            ? [`Potential disparate impact on protected groups in ${classification.consequentialDomain} domain`, 'Bias in training data', 'Proxy discrimination via seemingly neutral features']
            : ['Low risk — not a consequential decision domain'],
          mitigationMeasures: mitigationMeasures ?? ['Bias testing before deployment', 'Human oversight for high-stakes decisions', 'User appeal mechanism (POST /api/v1/privacy/appeal-ai-decision)', 'Regular performance monitoring across demographic groups'],
          monitoringPlan: 'Quarterly performance review; annual bias audit; incident tracking',
          humanOversight: 'Human review available via POST /api/v1/privacy/appeal-ai-decision within 45 days',
          legalBasis: ['Colorado AI Act SB 205 §6-1-1702', 'EU AI Act Art. 9 (Risk Management System)', ...classification.applicableFrameworks],
        },
        instructions: 'Complete the assessmentTemplate fields above, have it reviewed and signed by your Privacy Officer, and retain for minimum 7 years. Re-run this assessment annually or after significant changes to the AI system.',
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] AI impact assessment failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/classify-ai-use-case — Developer tool
// Returns full AIRegulatoryClassifier output for a given use case description
// ============================================================================

const classifySchema = z.object({
  deliberationTopic: z.string().optional(),
  useCase: z.string().optional(),
  targetAudience: z.string().optional(),
  jurisdiction: z.string().optional(),
  inputText: z.string().max(500).optional(),
});

router.post('/classify-ai-use-case', (req: Request, res: Response): void => {
  const parsed = classifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, errors: parsed.error.flatten() });
    return;
  }
  const result = aiRegulatoryClassifier.classify(parsed.data);
  res.json({ success: true, data: result });
});

// ============================================================================
// CCPA / CPRA ENDPOINTS
// California Consumer Privacy Act (§1798.100–§1798.199)
// California Privacy Rights Act — effective 1 Jan 2023
// ============================================================================

const ccpaOptOutSchema = z.object({
  categories: z.object({
    analytics: z.boolean().optional(),
    advertising: z.boolean().optional(),
    thirdParty: z.boolean().optional(),
  }).optional(),
});

// POST /api/v1/privacy/ccpa/opt-out — Do Not Sell or Share My Personal Information
router.post('/ccpa/opt-out', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = ccpaOptOutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.id;
    const categories = parsed.data.categories ?? { analytics: false, advertising: false, thirdParty: false };

    await prisma.users.update({
      where: { id: userId },
      data: {
        ccpa_opt_out: true,
        ccpa_opt_out_at: new Date(),
        ccpa_data_category_prefs: categories,
      },
    });

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'CCPA Do Not Sell opt-out exercised',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'ccpa_opt_out', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { legalBasis: 'CCPA §1798.120 / CPRA §1798.135', categories },
      severity: 'info',
    });

    res.json({
      success: true,
      data: {
        optedOut: true,
        optedOutAt: new Date().toISOString(),
        categories,
        message: 'Your Do Not Sell or Share preference has been recorded. Datacendia does not sell personal information; this preference prevents any future data sharing with analytics or advertising third parties.',
        legalBasis: 'CCPA §1798.120 / CPRA §1798.135',
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] CCPA opt-out failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /api/v1/privacy/ccpa/opt-out — Withdraw opt-out (opt back in)
router.delete('/ccpa/opt-out', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await prisma.users.update({
      where: { id: userId },
      data: {
        ccpa_opt_out: false,
        ccpa_opt_out_at: null,
        ccpa_data_category_prefs: {},
      },
    });

    res.json({
      success: true,
      data: { optedOut: false, message: 'Your Do Not Sell or Share opt-out has been withdrawn.' },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] CCPA opt-in failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/v1/privacy/ccpa/status — Current CCPA opt-out status
router.get('/ccpa/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { ccpa_opt_out: true, ccpa_opt_out_at: true, ccpa_data_category_prefs: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        optedOut: user.ccpa_opt_out,
        optedOutAt: user.ccpa_opt_out_at?.toISOString() ?? null,
        categoryPreferences: user.ccpa_data_category_prefs,
        rightsAvailable: [
          { right: 'Know / Access', endpoint: 'GET /api/v1/privacy/access', statute: 'CCPA §1798.100' },
          { right: 'Delete', endpoint: 'DELETE /api/v1/privacy/erasure', statute: 'CCPA §1798.105' },
          { right: 'Opt-Out of Sale/Share', endpoint: 'POST /api/v1/privacy/ccpa/opt-out', statute: 'CCPA §1798.120' },
          { right: 'Non-Discrimination', statute: 'CCPA §1798.125', note: 'You will not be penalised for exercising CCPA rights' },
          { right: 'Limit Sensitive PI Use', endpoint: 'POST /api/v1/privacy/ccpa/limit-sensitive', statute: 'CPRA §1798.121' },
        ],
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] CCPA status failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/ccpa/limit-sensitive — CPRA §1798.121
// Right to Limit Use and Disclosure of Sensitive Personal Information
// Limits use to necessary service delivery only (no profiling, ads, cross-context behavioural)
// ============================================================================

const limitSensitivePISchema = z.object({
  limitBiometricData: z.boolean().optional(),
  limitHealthData: z.boolean().optional(),
  limitPreciseGeolocation: z.boolean().optional(),
  limitAllSensitivePI: z.boolean().optional().default(true),
});

router.post('/ccpa/limit-sensitive', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = limitSensitivePISchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.id;
    const { limitBiometricData, limitHealthData, limitPreciseGeolocation, limitAllSensitivePI } = parsed.data;

    const existing = await prisma.users.findUnique({ where: { id: userId }, select: { preferences: true } });
    const prefs = (existing?.preferences as Record<string, unknown>) ?? {};
    const updated = {
      ...prefs,
      cpraLimitSensitivePI: true,
      cpraLimitSensitivePIAt: new Date().toISOString(),
      cpraLimitSensitivePIScope: {
        biometricData: limitBiometricData ?? limitAllSensitivePI,
        healthData: limitHealthData ?? limitAllSensitivePI,
        preciseGeolocation: limitPreciseGeolocation ?? limitAllSensitivePI,
        allSensitivePI: limitAllSensitivePI ?? true,
      },
    };

    await prisma.users.update({ where: { id: userId }, data: { preferences: updated } });

    await auditService.log({
      eventType: 'admin.user_updated',
      action: 'CPRA Limit Sensitive PI exercised',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'cpra_limit_sensitive_pi', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { scope: updated.cpraLimitSensitivePIScope, legalBasis: 'CPRA §1798.121 / Cal. Civ. Code §1798.121' },
      severity: 'info',
    });

    res.json({
      success: true,
      data: {
        limited: true,
        limitedAt: updated.cpraLimitSensitivePIAt,
        scope: updated.cpraLimitSensitivePIScope,
        legalBasis: 'CPRA §1798.121 / Cal. Civ. Code §1798.121',
        message: 'Your Limit Use of Sensitive Personal Information preference has been recorded. Datacendia will use your sensitive personal information only to provide the service you requested and will not use it for advertising, profiling, or cross-context behavioural purposes.',
        effectiveRights: [
          'No use of sensitive PI for targeted advertising',
          'No use of sensitive PI for profiling in furtherance of decisions producing legal or similarly significant effects',
          'No sale or sharing of sensitive PI to third parties',
          'Service delivery not affected by exercising this right (§1798.125 non-discrimination)',
        ],
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] CPRA limit-sensitive failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ============================================================================
// POST /api/v1/privacy/wa-mhmda-consent — Washington My Health MY Data Act
// RCW 70.02 — Consumer health data consent
// Allows Washington residents to consent to or withdraw consent for collection
// of consumer health data (location, search history, purchasing that infers health)
// ============================================================================

const waMhmdaConsentSchema = z.object({
  consentGranted: z.boolean(),
  healthDataCategories: z.array(z.enum([
    'precise_location',
    'search_queries',
    'purchase_history',
    'biometric',
    'reproductive_health',
    'mental_health',
    'all',
  ])).optional().default(['all']),
});

router.post('/wa-mhmda-consent', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = waMhmdaConsentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.id;
    const { consentGranted, healthDataCategories } = parsed.data;

    const existing = await prisma.users.findUnique({ where: { id: userId }, select: { preferences: true } });
    const prefs = (existing?.preferences as Record<string, unknown>) ?? {};
    const updated = {
      ...prefs,
      waMhmdaConsent: consentGranted,
      waMhmdaConsentAt: new Date().toISOString(),
      waMhmdaConsentCategories: healthDataCategories,
    };

    await prisma.users.update({ where: { id: userId }, data: { preferences: updated } });

    await auditService.log({
      eventType: 'admin.user_updated',
      action: consentGranted ? 'WA MHMDA health data consent granted' : 'WA MHMDA health data consent withdrawn',
      outcome: 'success',
      userId,
      organizationId: req.organizationId!,
      resource: { type: 'wa_mhmda_consent', id: userId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { consentGranted, healthDataCategories, legalBasis: 'WA MHMDA RCW 70.02' },
      severity: 'info',
    });

    res.json({
      success: true,
      data: {
        consentGranted,
        updatedAt: updated.waMhmdaConsentAt,
        categories: healthDataCategories,
        legalBasis: 'Washington My Health MY Data Act (MHMDA) RCW §70.02',
        message: consentGranted
          ? 'Your consent to collect consumer health data has been recorded under the Washington My Health MY Data Act.'
          : 'Your consumer health data consent has been withdrawn. Datacendia will not collect or share consumer health data inferred from your activity.',
        yourRights: [
          'Right to confirm what consumer health data is collected (submit DSAR)',
          'Right to withdraw consent at any time',
          'Right to have consumer health data deleted',
          'No sale or sharing of consumer health data without valid consent',
          'No geofencing around healthcare facilities',
        ],
        contact: 'privacy@datacendia.com',
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[Privacy] WA MHMDA consent failed', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/v1/privacy/ccpa/notice — Machine-readable CCPA Notice at Collection
router.get('/ccpa/notice', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      title: 'California Consumer Privacy Act — Notice at Collection',
      businessName: 'Datacendia, LLC',
      effectiveDate: '2026-04-15',
      doesSellPersonalInfo: false,
      doesSharePersonalInfo: false,
      categoriesCollected: [
        { category: 'Identifiers', examples: 'Name, email address, IP address, user ID', purpose: 'Account management, authentication, security' },
        { category: 'Internet/Electronic Activity', examples: 'Login timestamps, session data, API usage', purpose: 'Security, fraud prevention, product improvement' },
        { category: 'Professional Information', examples: 'Job role, organisation name', purpose: 'Service personalisation' },
        { category: 'Inferences', examples: 'User preferences derived from platform usage', purpose: 'Personalised experience' },
      ],
      sensitivePersonalInfoCollected: false,
      retentionPeriods: {
        accountData: 'Duration of account plus 30-day deletion grace period',
        auditLogs: '7 years (legal/regulatory compliance)',
        sessionData: '30 days',
      },
      consumerRightsUrl: 'https://app.datacendia.com/privacy',
      contactEmail: 'privacy@datacendia.com',
      doNotSellUrl: 'POST /api/v1/privacy/ccpa/opt-out',
      authorisedAgentProcess: 'Submit a signed authorisation letter to privacy@datacendia.com',
      statute: 'Cal. Civ. Code §§ 1798.100–1798.199',
    },
  });
});

export default router;
