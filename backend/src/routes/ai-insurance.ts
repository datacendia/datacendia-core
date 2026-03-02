/**
 * API Routes — Ai Insurance
 *
 * Express route handler defining REST endpoints.
 * @module routes/ai-insurance
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaInsure™ API Routes
 * 
 * AI Insurance Integration
 */

import { Router, Request, Response } from 'express';
import { aiInsuranceService, CoverageType } from '../services/insurance/AIInsuranceService.js';

const router = Router();

/**
 * GET /api/v1/ai-insurance/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaInsure',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/ai-insurance/coverage-types
 */
router.get('/coverage-types', (_req: Request, res: Response) => {
  try {
    const types = aiInsuranceService.getCoverageTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    console.error('Error getting coverage types:', error);
    res.status(500).json({ success: false, error: 'Failed to get coverage types' });
  }
});

/**
 * POST /api/v1/ai-insurance/quotes
 */
router.post('/quotes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, coverageType, requestedLimit, verticalId, coveredSystems, termMonths } = req.body;

    if (!organizationId || !coverageType || !requestedLimit) {
      res.status(400).json({
        success: false,
        error: 'organizationId, coverageType, and requestedLimit are required',
      });
      return;
    }

    const quote = await aiInsuranceService.requestQuote({
      organizationId,
      coverageType: coverageType as CoverageType,
      requestedLimit,
      verticalId,
      coveredSystems,
      termMonths,
    });

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error('Error requesting quote:', error);
    res.status(500).json({ success: false, error: 'Failed to request quote' });
  }
});

/**
 * POST /api/v1/ai-insurance/policies
 */
router.post('/policies', async (req: Request, res: Response): Promise<void> => {
  try {
    const { quoteId, coveredSystems, coveredDecisionTypes, createdBy } = req.body;

    if (!quoteId || !coveredSystems || !coveredDecisionTypes || !createdBy) {
      res.status(400).json({
        success: false,
        error: 'quoteId, coveredSystems, coveredDecisionTypes, and createdBy are required',
      });
      return;
    }

    const policy = await aiInsuranceService.bindPolicy(quoteId, {
      coveredSystems,
      coveredDecisionTypes,
      createdBy,
    });

    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    console.error('Error binding policy:', error);
    res.status(500).json({ success: false, error: 'Failed to bind policy' });
  }
});

/**
 * GET /api/v1/ai-insurance/policies/:id
 */
router.get('/policies/:id', (req: Request, res: Response): void => {
  try {
    const policy = aiInsuranceService.getPolicy(req.params['id']!);
    if (!policy) {
      res.status(404).json({ success: false, error: 'Policy not found' });
      return;
    }
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Error getting policy:', error);
    res.status(500).json({ success: false, error: 'Failed to get policy' });
  }
});

/**
 * GET /api/v1/ai-insurance/policies/organization/:orgId
 */
router.get('/policies/organization/:orgId', (req: Request, res: Response): void => {
  try {
    const policies = aiInsuranceService.getPoliciesByOrganization(req.params['orgId']!);
    res.json({ success: true, data: policies });
  } catch (error) {
    console.error('Error getting policies:', error);
    res.status(500).json({ success: false, error: 'Failed to get policies' });
  }
});

/**
 * POST /api/v1/ai-insurance/cover-decision
 */
router.post('/cover-decision', async (req: Request, res: Response): Promise<void> => {
  try {
    const { policyId, decisionId, deliberationId, decisionType, decisionValue, riskFactors } = req.body;

    if (!policyId || !decisionId || !decisionType || decisionValue === undefined) {
      res.status(400).json({
        success: false,
        error: 'policyId, decisionId, decisionType, and decisionValue are required',
      });
      return;
    }

    const coverage = await aiInsuranceService.coverDecision({
      policyId,
      decisionId,
      deliberationId,
      decisionType,
      decisionValue,
      riskFactors,
    });

    res.status(201).json({ success: true, data: coverage });
  } catch (error) {
    console.error('Error covering decision:', error);
    res.status(500).json({ success: false, error: 'Failed to cover decision' });
  }
});

/**
 * GET /api/v1/ai-insurance/coverage/decision/:decisionId
 */
router.get('/coverage/decision/:decisionId', (req: Request, res: Response): void => {
  try {
    const coverage = aiInsuranceService.getCoverageByDecision(req.params['decisionId']!);
    if (!coverage) {
      res.status(404).json({ success: false, error: 'Coverage not found' });
      return;
    }
    res.json({ success: true, data: coverage });
  } catch (error) {
    console.error('Error getting coverage:', error);
    res.status(500).json({ success: false, error: 'Failed to get coverage' });
  }
});

/**
 * POST /api/v1/ai-insurance/claims
 */
router.post('/claims', async (req: Request, res: Response): Promise<void> => {
  try {
    const { policyId, incidentDate, incidentDescription, decisionId, claimAmount, claimType, supportingDocuments } = req.body;

    if (!policyId || !incidentDate || !incidentDescription || !claimAmount || !claimType) {
      res.status(400).json({
        success: false,
        error: 'policyId, incidentDate, incidentDescription, claimAmount, and claimType are required',
      });
      return;
    }

    const claim = await aiInsuranceService.fileClaim({
      policyId,
      incidentDate: new Date(incidentDate),
      incidentDescription,
      decisionId,
      claimAmount,
      claimType,
      supportingDocuments,
    });

    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    console.error('Error filing claim:', error);
    res.status(500).json({ success: false, error: 'Failed to file claim' });
  }
});

/**
 * GET /api/v1/ai-insurance/certificates/:id/verify
 */
router.get('/certificates/:id/verify', (req: Request, res: Response): void => {
  try {
    const result = aiInsuranceService.verifyCertificate(req.params['id']!);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to verify certificate' });
  }
});

export default router;
