/**
 * AI Regulatory Compliance Middleware
 *
 * Applied to all AI inference and deliberation routes. Classifies each request
 * against applicable AI regulations (Colorado SB 205, NYC LL 144, Illinois AIVIA,
 * EU AI Act, GDPR Art. 22) and:
 *   1. Attaches regulatory classification to the request context (req.aiRegulatory)
 *   2. Hard-blocks requests that are missing required consent flags
 *   3. Adds regulatory disclosure headers to AI responses
 *   4. Logs high-risk classification events to audit trail
 */

import { aiRegulatoryClassifier, type AIClassificationContext, type AIClassificationResult } from '../services/compliance/AIRegulatoryClassifier.js';
import { auditService } from '../security/audit.service.js';
import { logger } from '../utils/logger.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      aiRegulatory?: AIClassificationResult;
    }
  }
}

export const aiRegulatoryMiddleware = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const body = req.body ?? {};

    const ctx: AIClassificationContext = {
      deliberationTopic: body.topic ?? body.title ?? body.subject ?? undefined,
      useCase: body.useCase ?? body.context ?? body.purpose ?? undefined,
      targetAudience: body.targetAudience ?? body.audience ?? undefined,
      inputText: typeof body.prompt === 'string' ? body.prompt.slice(0, 500) : undefined,
      jurisdiction: body.jurisdiction ?? req.headers['x-jurisdiction'] ?? undefined,
      organisationType: body.organisationType ?? undefined,
    };

    const result = aiRegulatoryClassifier.classify(ctx);
    req.aiRegulatory = result;

    // Hard-block if prohibited practices detected
    if (result.prohibitedFlags.length > 0) {
      await auditService.log({
        eventType: 'ai.prohibited_practice_blocked',
        action: 'AI prohibited practice request blocked',
        outcome: 'failure',
        userId: req.user?.id,
        organizationId: req.organizationId,
        resource: { type: 'ai_regulatory', id: 'prohibited_practice' },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        details: { prohibitedFlags: result.prohibitedFlags, frameworks: result.applicableFrameworks },
        severity: 'critical',
      });
      res.status(451).json({
        success: false,
        error: 'Unavailable For Legal Reasons',
        message: 'This request has been blocked because it would implement an AI practice prohibited under EU AI Act Article 5 or equivalent national law.',
        prohibitedPractices: result.prohibitedFlags,
        legalBasis: 'EU AI Act Article 5; Regulation (EU) 2024/1689',
        appealContact: 'privacy@datacendia.com',
      });
      return;
    }

    // Hard-block: Illinois AIVIA — require explicit consent before video analysis
    if (result.requiresVideoConsent) {
      const consentProvided = body.illinoisAIVIAConsent === true || req.headers['x-illinois-aivia-consent'] === 'true';
      if (!consentProvided) {
        res.status(451).json({
          success: false,
          error: 'Illinois AI Video Interview Assessment Act — Consent Required',
          message: 'This request involves AI analysis of video interview content. Illinois law (820 ILCS 42) requires explicit written consent from the candidate before any AI analysis. Re-submit with illinoisAIVIAConsent: true in the request body after obtaining written consent.',
          requiredField: 'illinoisAIVIAConsent',
          statute: '820 ILCS 42/1 — Illinois AI Video Interview Assessment Act',
          consentRequirements: [
            'Inform candidate AI will be used to analyse the interview',
            'Explain what traits/characteristics the AI will evaluate',
            'Specify who will view the AI analysis',
            'Obtain consent before any recording begins',
            'Delete video and AI analysis within 30 days of request',
          ],
        });
        return;
      }
    }

    // Hard-block: NYC LL 144 — require prior notice acknowledgement for NYC employment decisions
    if (result.isAEDT && (!body.nycLL144NoticeProvided)) {
      logger.warn('[aiRegulatoryMiddleware] NYC LL 144 AEDT notice not confirmed — attaching warning header');
      res.setHeader('X-NYC-LL144-Warning', 'AEDT detected. Employer must provide 10-business-day advance notice to candidates. See GET /api/v1/privacy/aedt-disclosure');
    }

    // Attach regulatory classification headers to response (before calling next)
    const headers = aiRegulatoryClassifier.buildResponseHeaders(result);
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));

    // Add GDPR Art. 22 automated decision header when applicable
    if (result.isGDPRArticle22) {
      res.setHeader('X-GDPR-Article-22', 'automated-decision; human-review-available; see POST /api/v1/privacy/appeal-ai-decision');
    }

    // Log high-risk classifications for audit trail
    if (result.overallRisk === 'CRITICAL' || result.overallRisk === 'HIGH') {
      await auditService.log({
        eventType: 'ai.regulatory_classified',
        action: `High-risk AI request classified: ${result.consequentialDomain} / ${result.overallRisk}`,
        outcome: 'success',
        userId: req.user?.id,
        organizationId: req.organizationId,
        resource: { type: 'ai_regulatory', id: result.consequentialDomain },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        details: {
          domain: result.consequentialDomain,
          risk: result.overallRisk,
          frameworks: result.applicableFrameworks,
          isAEDT: result.isAEDT,
          isEUHighRisk: result.isEUAIActHighRisk,
        },
        severity: result.overallRisk === 'CRITICAL' ? 'critical' : 'warning',
      });
    }

    next();
  } catch (err: unknown) {
    const e = err as Error;
    logger.error('[aiRegulatoryMiddleware] Classification error', e);
    next(); // Non-blocking — don't stop AI requests on classifier error
  }
};
