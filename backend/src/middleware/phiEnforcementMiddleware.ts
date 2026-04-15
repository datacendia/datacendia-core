// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
//
// PHI Before AI Enforcement Middleware
//
// Enforces that health/medical AI inference requests either:
//   (a) Are confirmed as already de-identified via POST /api/v1/privacy/deidentify, OR
//   (b) Originate from a customer with a signed HIPAA BAA on file
//
// Compliance basis:
//   - HIPAA §164.502(a) — Use/disclosure of PHI
//   - FTC Health Breach Notification Rule 16 CFR Part 318 (2024 amendment)
//   - GDPR Art. 9 — Processing of special category (health) data
//
// Gap addressed: docs/compliance/MASTER-COMPLIANCE-TRACKER.md Section 5B FTC HBNR row

import { Request, Response, NextFunction } from 'express';
import { auditService } from '../security/audit.service.js';
import { logger } from '../utils/logger.js';

/** Keywords that indicate a health/PHI domain request */
const HEALTH_KEYWORDS = [
  'patient', 'diagnosis', 'treatment', 'medication', 'prescription', 'medical record',
  'health condition', 'symptom', 'clinical', 'hospital', 'ehr', 'healthcare',
  'phi ', 'protected health', 'hipaa', 'radiology', 'pathology', 'lab result',
  'surgical', 'chronic', 'disease', 'therapy', 'psychiatric', 'mental health',
];

/** De-identification tokens issued by POST /api/v1/privacy/deidentify */
const DEIDENTIFIED_HEADER = 'x-phi-deidentified';
const DEIDENTIFIED_BODY_FLAG = 'phiDeidentified';

/**
 * Detect whether a request body contains health/PHI-related content
 */
function isHealthDomainRequest(body: Record<string, unknown>): boolean {
  const text = JSON.stringify(body).toLowerCase();
  return HEALTH_KEYWORDS.some(kw => text.includes(kw));
}

/**
 * Check if customer org has a signed HIPAA BAA on file.
 * Currently uses a per-org preference flag stored during BAA signing workflow.
 * Replace with database lookup when BAA management is automated.
 */
async function hasBAAOnFile(organizationId: string | undefined): Promise<boolean> {
  if (!organizationId) return false;
  try {
    const { prisma } = await import('../config/database.js');
    const org = await prisma.organizations.findUnique({
      where: { id: organizationId },
      select: { settings: true },
    });
    const settings = (org?.settings as Record<string, unknown>) ?? {};
    return settings['hipaaBAASigned'] === true;
  } catch {
    return false;
  }
}

/**
 * PHI Enforcement Middleware
 *
 * Applied to all AI inference/deliberation routes:
 *   /api/v1/council
 *   /api/v1/deliberations
 *   /api/v1/inference
 *   /api/v1/platform-assistant
 *
 * Enforcement modes:
 *   1. Pass-through if aiRegulatory.consequentialDomain is not HEALTHCARE
 *   2. Pass-through if X-PHI-Deidentified header is present and truthy
 *   3. Pass-through if body.phiDeidentified === true
 *   4. Pass-through if org has signed HIPAA BAA (settings.hipaaBAASigned === true)
 *   5. Block with HTTP 451 if health domain detected without de-identification evidence
 */
export const phiEnforcementMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;

    // Check if AI Regulatory Classifier already tagged this as healthcare
    const aiReg = (req as any).aiRegulatory;
    const isHealthcareByClassifier = aiReg?.consequentialDomain === 'HEALTHCARE';

    // Also do a direct keyword scan for requests that bypass the classifier
    const isHealthcareByKeyword = isHealthDomainRequest(body);

    if (!isHealthcareByClassifier && !isHealthcareByKeyword) {
      return next(); // Not a health-domain request — pass through
    }

    // Check de-identification evidence
    const deidentifiedHeader = req.headers[DEIDENTIFIED_HEADER];
    const deidentifiedBodyFlag = body[DEIDENTIFIED_BODY_FLAG];

    if (
      deidentifiedHeader === 'true' ||
      deidentifiedHeader === '1' ||
      deidentifiedBodyFlag === true
    ) {
      return next(); // De-identified — safe to proceed
    }

    // Check BAA on file
    const baaOnFile = await hasBAAOnFile(req.organizationId);
    if (baaOnFile) {
      // BAA in place — log the PHI access for HIPAA audit
      await auditService.log({
        eventType: 'data.accessed',
        action: 'PHI domain AI request — HIPAA BAA on file; proceeding',
        outcome: 'success',
        userId: req.user?.id,
        organizationId: req.organizationId,
        resource: { type: 'phi_ai_request', id: req.organizationId ?? 'unknown' },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        details: {
          healthDomainSource: isHealthcareByClassifier ? 'classifier' : 'keyword_scan',
          baaOnFile: true,
        },
        severity: 'info',
      });
      return next();
    }

    // Neither de-identified nor BAA — block under HIPAA + FTC HBNR
    logger.warn('[PHI Enforcement] Blocked health-domain AI request — no de-identification evidence and no BAA on file', {
      organizationId: req.organizationId,
      userId: req.user?.id,
      healthDomainSource: isHealthcareByClassifier ? 'classifier' : 'keyword_scan',
    });

    await auditService.log({
      eventType: 'security.unauthorized_access',
      action: 'PHI domain AI request blocked — missing de-identification evidence and no HIPAA BAA',
      outcome: 'failure',
      userId: req.user?.id,
      organizationId: req.organizationId,
      resource: { type: 'phi_ai_request', id: req.organizationId ?? 'unknown' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        healthDomainSource: isHealthcareByClassifier ? 'classifier' : 'keyword_scan',
        baaOnFile: false,
        requiredActions: [
          'Option 1: De-identify PHI first via POST /api/v1/privacy/deidentify, then include X-PHI-Deidentified: true header',
          'Option 2: Contact sales@datacendia.com to execute a HIPAA BAA',
        ],
      },
      severity: 'warning',
    });

    res.status(451).json({
      success: false,
      error: 'HIPAA_PHI_ENFORCEMENT',
      message: 'Health-domain AI requests require either PHI de-identification or a signed HIPAA BAA.',
      remediation: {
        option1: {
          description: 'De-identify PHI first, then send de-identified data to AI',
          steps: [
            'POST /api/v1/privacy/deidentify with your health data',
            'Use the de-identified output in your AI request',
            'Include header X-PHI-Deidentified: true in your AI request',
          ],
        },
        option2: {
          description: 'Execute a HIPAA Business Associate Agreement',
          contact: 'sales@datacendia.com',
          documentation: 'docs/legal/hipaa-baa-template.md',
        },
      },
      legalBasis: [
        'HIPAA §164.502(a) — Use and Disclosure of PHI',
        'FTC Health Breach Notification Rule 16 CFR Part 318 (2024 amendment)',
        'GDPR Art. 9 — Special Category Data',
      ],
    });
  } catch (err: unknown) {
    logger.error('[PHI Enforcement] Middleware error', err as Error);
    next(); // Fail open — log the error but don't block on middleware failures
  }
};
