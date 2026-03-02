// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response } from 'express';
import { 
  CendiaResponsibilityService,
  FailureCategory,
  HumanAuthority
} from '../services/CendiaResponsibilityService';

const router = Router();
const responsibilityService = new CendiaResponsibilityService();

/**
 * @route POST /api/v1/responsibility/record
 * @desc Create a new accountability record
 */
router.post('/record', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      deliberationId,
      organizationId,
      humanAuthority,
      actionTaken,
      justification,
      acceptedRisks,
      riskAcknowledgment,
      aiRecommendation,
      aiConfidenceScore,
      dissentsOverridden,
      witnesses
    } = req.body;

    if (!decisionId || !organizationId || !humanAuthority || !actionTaken || !justification) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: decisionId, organizationId, humanAuthority, actionTaken, justification'
      });
      return;
    }

    const record = await responsibilityService.createAccountabilityRecord({
      decisionId,
      deliberationId,
      organizationId,
      humanAuthority: humanAuthority as HumanAuthority,
      actionTaken,
      justification,
      acceptedRisks: (acceptedRisks as FailureCategory[]) || [],
      riskAcknowledgment: riskAcknowledgment || '',
      aiRecommendation,
      aiConfidenceScore,
      dissentsOverridden,
      witnesses
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error creating accountability record:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create accountability record'
    });
  }
});

/**
 * @route POST /api/v1/responsibility/override
 * @desc Record an override action (human overriding AI recommendation)
 */
router.post('/override', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      organizationId,
      humanAuthority,
      aiRecommendation,
      humanDecision,
      overrideReason,
      acceptedRisks
    } = req.body;

    if (!decisionId || !organizationId || !humanAuthority || !overrideReason || !acceptedRisks) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields for override'
      });
      return;
    }

    const record = await responsibilityService.recordOverride({
      decisionId,
      organizationId,
      humanAuthority: humanAuthority as HumanAuthority,
      aiRecommendation: aiRecommendation || 'Not specified',
      humanDecision: humanDecision || 'Override applied',
      overrideReason,
      acceptedRisks: acceptedRisks as FailureCategory[]
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error recording override:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record override'
    });
  }
});

/**
 * @route POST /api/v1/responsibility/approve
 * @desc Record an approval action
 */
router.post('/approve', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      organizationId,
      humanAuthority,
      aiRecommendation,
      aiConfidenceScore,
      acceptedRisks,
      additionalConditions
    } = req.body;

    if (!decisionId || !organizationId || !humanAuthority) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields for approval'
      });
      return;
    }

    const record = await responsibilityService.recordApproval({
      decisionId,
      organizationId,
      humanAuthority: humanAuthority as HumanAuthority,
      aiRecommendation: aiRecommendation || 'Recommendation approved',
      aiConfidenceScore: aiConfidenceScore || 0,
      acceptedRisks: (acceptedRisks as FailureCategory[]) || [],
      additionalConditions
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error recording approval:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record approval'
    });
  }
});

/**
 * @route POST /api/v1/responsibility/reject
 * @desc Record a rejection action
 */
router.post('/reject', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      organizationId,
      humanAuthority,
      aiRecommendation,
      rejectionReason,
      alternativeAction
    } = req.body;

    if (!decisionId || !organizationId || !humanAuthority || !rejectionReason) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields for rejection'
      });
      return;
    }

    const record = await responsibilityService.recordRejection({
      decisionId,
      organizationId,
      humanAuthority: humanAuthority as HumanAuthority,
      aiRecommendation: aiRecommendation || 'Recommendation rejected',
      rejectionReason,
      alternativeAction
    });

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error recording rejection:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record rejection'
    });
  }
});

/**
 * @route POST /api/v1/responsibility/delegation
 * @desc Create a delegation of authority
 */
router.post('/delegation', async (req: Request, res: Response) => {
  try {
    const {
      fromAuthority,
      toAuthority,
      scope,
      constraints,
      validUntil
    } = req.body;

    if (!fromAuthority || !toAuthority || !scope) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: fromAuthority, toAuthority, scope'
      });
      return;
    }

    const delegation = await responsibilityService.createDelegation({
      fromAuthority: fromAuthority as HumanAuthority,
      toAuthority: toAuthority as HumanAuthority,
      scope: Array.isArray(scope) ? scope : [scope],
      constraints: constraints || [],
      validUntil: validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });

    res.status(201).json({
      success: true,
      data: delegation
    });
  } catch (error) {
    console.error('Error creating delegation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create delegation'
    });
  }
});

/**
 * @route GET /api/v1/responsibility/chain/:decisionId
 * @desc Get the full accountability chain for a decision
 */
router.get('/chain/:decisionId', async (req: Request, res: Response) => {
  try {
    const decisionId = req.params['decisionId'] || '';

    const chain = await responsibilityService.getAccountabilityChain(decisionId);

    res.json({
      success: true,
      data: chain
    });
  } catch (error) {
    console.error('Error getting accountability chain:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get accountability chain'
    });
  }
});

/**
 * @route GET /api/v1/responsibility/liability-report/:decisionId
 * @desc Generate a liability report for a decision
 */
router.get('/liability-report/:decisionId', async (req: Request, res: Response) => {
  try {
    const decisionId = req.params['decisionId'] || '';

    const report = await responsibilityService.generateLiabilityReport(decisionId);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating liability report:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate liability report'
    });
  }
});

/**
 * @route POST /api/v1/responsibility/verify
 * @desc Verify an accountability record
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { record } = req.body;

    if (!record) {
      res.status(400).json({
        success: false,
        error: 'record object required in body'
      });
      return;
    }

    const isValid = await responsibilityService.verifyRecord(record);

    res.json({
      success: true,
      data: {
        valid: isValid,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error verifying record:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify record'
    });
  }
});

/**
 * @route GET /api/v1/responsibility/health
 * @desc Service health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaResponsibility™',
    version: '1.0.0',
    status: 'operational',
    features: [
      'accountability-records',
      'override-tracking',
      'delegation-chains',
      'liability-reports',
      'tpm-signatures',
      'merkle-verification'
    ]
  });
});

export default router;
