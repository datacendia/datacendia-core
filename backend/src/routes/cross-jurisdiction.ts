// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrossJurisdiction™ API Routes
 * 
 * Multi-Jurisdiction Compliance Engine
 */

import { Router, Request, Response } from 'express';
import { crossJurisdictionEngineService, Jurisdiction } from '../services/compliance/CrossJurisdictionEngineService.js';

const router = Router();

/**
 * GET /api/v1/cross-jurisdiction/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaCrossJurisdiction',
    status: 'healthy',
    multiJurisdiction: true,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/cross-jurisdiction/jurisdictions
 */
router.get('/jurisdictions', (_req: Request, res: Response) => {
  try {
    const jurisdictions = crossJurisdictionEngineService.getJurisdictionProfiles();
    res.json({ success: true, data: jurisdictions });
  } catch (error) {
    console.error('Error getting jurisdictions:', error);
    res.status(500).json({ success: false, error: 'Failed to get jurisdictions' });
  }
});

/**
 * GET /api/v1/cross-jurisdiction/jurisdictions/:id
 */
router.get('/jurisdictions/:id', (req: Request, res: Response): void => {
  try {
    const profile = crossJurisdictionEngineService.getJurisdictionProfile(
      req.params['id'] as Jurisdiction
    );
    if (!profile) {
      res.status(404).json({ success: false, error: 'Jurisdiction not found' });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error getting jurisdiction:', error);
    res.status(500).json({ success: false, error: 'Failed to get jurisdiction' });
  }
});

/**
 * POST /api/v1/cross-jurisdiction/assess-transfer
 */
router.post('/assess-transfer', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceJurisdiction, destinationJurisdiction, dataTypes } = req.body;

    if (!sourceJurisdiction || !destinationJurisdiction || !dataTypes) {
      res.status(400).json({
        success: false,
        error: 'sourceJurisdiction, destinationJurisdiction, and dataTypes are required',
      });
      return;
    }

    const assessment = await crossJurisdictionEngineService.assessCrossBorderTransfer({
      sourceJurisdiction: sourceJurisdiction as Jurisdiction,
      destinationJurisdiction: destinationJurisdiction as Jurisdiction,
      dataTypes,
    });

    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error assessing transfer:', error);
    res.status(500).json({ success: false, error: 'Failed to assess transfer' });
  }
});

/**
 * POST /api/v1/cross-jurisdiction/compliance-matrix
 */
router.post('/compliance-matrix', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, jurisdictions } = req.body;

    if (!organizationId || !jurisdictions || !Array.isArray(jurisdictions)) {
      res.status(400).json({
        success: false,
        error: 'organizationId and jurisdictions array are required',
      });
      return;
    }

    const matrix = await crossJurisdictionEngineService.generateComplianceMatrix({
      organizationId,
      jurisdictions: jurisdictions as Jurisdiction[],
    });

    res.json({ success: true, data: matrix });
  } catch (error) {
    console.error('Error generating matrix:', error);
    res.status(500).json({ success: false, error: 'Failed to generate compliance matrix' });
  }
});

/**
 * POST /api/v1/cross-jurisdiction/detect-conflicts
 */
router.post('/detect-conflicts', (req: Request, res: Response): void => {
  try {
    const { jurisdictions } = req.body;

    if (!jurisdictions || !Array.isArray(jurisdictions)) {
      res.status(400).json({ success: false, error: 'jurisdictions array is required' });
      return;
    }

    const conflicts = crossJurisdictionEngineService.detectConflicts(
      jurisdictions as Jurisdiction[]
    );

    res.json({ success: true, data: conflicts });
  } catch (error) {
    console.error('Error detecting conflicts:', error);
    res.status(500).json({ success: false, error: 'Failed to detect conflicts' });
  }
});

/**
 * POST /api/v1/cross-jurisdiction/data-residency
 */
router.post('/data-residency', (req: Request, res: Response): void => {
  try {
    const { jurisdictions } = req.body;

    if (!jurisdictions || !Array.isArray(jurisdictions)) {
      res.status(400).json({ success: false, error: 'jurisdictions array is required' });
      return;
    }

    const rules = crossJurisdictionEngineService.getDataResidencyRules(
      jurisdictions as Jurisdiction[]
    );

    res.json({ success: true, data: rules });
  } catch (error) {
    console.error('Error getting data residency rules:', error);
    res.status(500).json({ success: false, error: 'Failed to get data residency rules' });
  }
});

/**
 * GET /api/v1/cross-jurisdiction/assessments
 */
router.get('/assessments', (_req: Request, res: Response) => {
  try {
    const assessments = crossJurisdictionEngineService.listAssessments();
    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error('Error listing assessments:', error);
    res.status(500).json({ success: false, error: 'Failed to list assessments' });
  }
});

/**
 * GET /api/v1/cross-jurisdiction/assessments/:id
 */
router.get('/assessments/:id', (req: Request, res: Response): void => {
  try {
    const assessment = crossJurisdictionEngineService.getAssessment(req.params['id']!);
    if (!assessment) {
      res.status(404).json({ success: false, error: 'Assessment not found' });
      return;
    }
    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error('Error getting assessment:', error);
    res.status(500).json({ success: false, error: 'Failed to get assessment' });
  }
});

/**
 * GET /api/v1/cross-jurisdiction/matrices/:id
 */
router.get('/matrices/:id', (req: Request, res: Response): void => {
  try {
    const matrix = crossJurisdictionEngineService.getMatrix(req.params['id']!);
    if (!matrix) {
      res.status(404).json({ success: false, error: 'Matrix not found' });
      return;
    }
    res.json({ success: true, data: matrix });
  } catch (error) {
    console.error('Error getting matrix:', error);
    res.status(500).json({ success: false, error: 'Failed to get matrix' });
  }
});

export default router;
