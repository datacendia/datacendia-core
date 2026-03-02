// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaEternal™ API Routes
 * Ultra-Long Horizon Archive
 */

import { Router, Request, Response } from 'express';
import { cendiaEternalService } from '../services/CendiaEternalService.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /eternal/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    
    // Get counts for metrics
    const [artifactCount, migrationCount, successorCount] = await Promise.all([
      cendiaEternalService.getArtifacts(orgId, {}).then(a => a.length).catch(() => 0),
      cendiaEternalService.getMigrations(orgId).then(m => m.length).catch(() => 0),
      cendiaEternalService.getSuccessors(orgId).then(s => s.length).catch(() => 0),
    ]);
    
    res.json({
      success: true,
      data: {
        service: 'CendiaEternal',
        status: 'operational',
        version: '1.0.0',
        description: 'Ultra-Long Horizon Archive',
        capabilities: [
          'Multi-generational knowledge preservation',
          'Format migration and future-proofing',
          'Successor planning and handoff',
          'VERITAS validation framework',
          'Immutable artifact storage',
          '100+ year retention support',
        ],
        metrics: {
          archivedArtifacts: artifactCount,
          formatMigrations: migrationCount,
          successorPlans: successorCount,
        },
        artifactTypes: ['decision', 'policy', 'contract', 'code', 'documentation', 'historical', 'other'],
        accessLevels: ['public', 'internal', 'restricted', 'confidential', 'successor_only'],
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// ARTIFACTS
// ===========================================================================

router.post('/artifacts', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const userId = (req as any).user?.id || 'system';
    const artifact = await cendiaEternalService.archiveArtifact(orgId, userId, req.body);
    res.json({ success: true, data: artifact });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/artifacts', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { artifactType, accessLevel, minImportance, searchQuery } = req.query;
    const artifacts = await cendiaEternalService.getArtifacts(orgId, {
      artifactType: artifactType as any,
      accessLevel: accessLevel as any,
      minImportance: minImportance ? parseFloat(minImportance as string) : undefined,
      searchQuery: searchQuery as string,
    });
    res.json({ success: true, data: artifacts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/artifacts/:id', async (req: Request, res: Response) => {
  try {
    const artifact = await cendiaEternalService.getArtifact(req.params.id);
    if (!artifact) {
      return res.status(404).json({ success: false, error: { message: 'Artifact not found' } });
    }
    res.json({ success: true, data: artifact });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// VALIDATION (VERITAS)
// ===========================================================================

router.post('/artifacts/:id/verify', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const { validationType } = req.body;
    const result = await cendiaEternalService.verifyArtifact(req.params.id, userId, validationType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/artifacts/:id/validations', async (req: Request, res: Response) => {
  try {
    const validations = await cendiaEternalService.getValidationHistory(req.params.id);
    res.json({ success: true, data: validations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.post('/artifacts/:id/correct', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const { correctedContent } = req.body;
    const artifact = await cendiaEternalService.correctArtifact(req.params.id, correctedContent, userId);
    res.json({ success: true, data: artifact });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// MIGRATIONS
// ===========================================================================

router.post('/migrations', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { sourceFormat, targetFormat } = req.body;
    const migration = await cendiaEternalService.startMigration(orgId, sourceFormat, targetFormat);
    res.json({ success: true, data: migration });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/migrations', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const migrations = await cendiaEternalService.getMigrations(orgId);
    res.json({ success: true, data: migrations });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// SUCCESSION
// ===========================================================================

router.post('/successors', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const successor = await cendiaEternalService.defineSuccessor(orgId, req.body);
    res.json({ success: true, data: successor });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/successors', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const successors = await cendiaEternalService.getSuccessors(orgId);
    res.json({ success: true, data: successors });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.post('/successors/:id/activate', async (req: Request, res: Response) => {
  try {
    const successor = await cendiaEternalService.activateSuccessor(req.params.id);
    res.json({ success: true, data: successor });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// DASHBOARD
// ===========================================================================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const dashboard = await cendiaEternalService.getDashboard(orgId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
