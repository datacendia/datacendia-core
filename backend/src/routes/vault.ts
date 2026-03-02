// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAVAULT™ API ROUTES
// Unified Evidence Storage - Decision Packets, Audit Ledger, Evidence Bundles
// =============================================================================

import { Router, Request, Response } from 'express';
import { cendiaVaultService } from '../services/sovereign/CendiaVaultService.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// =============================================================================
// STATUS & STATS
// =============================================================================

/**
 * GET /api/v1/vault/status
 * Get vault service status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = cendiaVaultService.getStatus();
    const stats = await cendiaVaultService.getStats();

    res.json({
      success: true,
      data: {
        ...status,
        stats,
      },
    });
  } catch (error) {
    logger.error('[CendiaVault] Status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get vault status',
    });
  }
});

/**
 * GET /api/v1/vault/stats
 * Get vault statistics
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await cendiaVaultService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('[CendiaVault] Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get vault stats',
    });
  }
});

// =============================================================================
// ARTIFACT STORAGE
// =============================================================================

/**
 * POST /api/v1/vault/artifacts
 * Store a new artifact
 */
router.post('/artifacts', async (req: Request, res: Response) => {
  try {
    const { type, title, content, mimeType, sourceService, sourceId, tags, metadata } = req.body;
    const createdBy = (req as any).user?.email || 'system';

    if (!type || !title || !content) {
      res.status(400).json({
        success: false,
        error: 'type, title, and content are required',
      });
      return;
    }

    const artifact = await cendiaVaultService.store({
      type,
      title,
      content: Buffer.from(content, 'base64'),
      mimeType: mimeType || 'application/octet-stream',
      createdBy,
      sourceService: sourceService || 'api',
      sourceId,
      tags,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Store error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store artifact',
    });
  }
});

/**
 * POST /api/v1/vault/decision-packets
 * Store a decision packet
 */
router.post('/decision-packets', async (req: Request, res: Response) => {
  try {
    const { packetId, deliberationId, title, content, signature, merkleRoot, metadata } = req.body;
    const createdBy = (req as any).user?.email || 'system';

    if (!packetId || !title || !content) {
      res.status(400).json({
        success: false,
        error: 'packetId, title, and content are required',
      });
      return;
    }

    const artifact = await cendiaVaultService.storeDecisionPacket({
      packetId,
      deliberationId,
      title,
      content,
      signature,
      merkleRoot,
      createdBy,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Store decision packet error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store decision packet',
    });
  }
});

/**
 * POST /api/v1/vault/audit-entries
 * Store an audit entry
 */
router.post('/audit-entries', async (req: Request, res: Response) => {
  try {
    const { entryId, action, content, previousHash, metadata } = req.body;
    const actor = (req as any).user?.email || 'system';

    if (!entryId || !action || !content) {
      res.status(400).json({
        success: false,
        error: 'entryId, action, and content are required',
      });
      return;
    }

    const artifact = await cendiaVaultService.storeAuditEntry({
      entryId,
      action,
      actor,
      content,
      previousHash,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Store audit entry error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store audit entry',
    });
  }
});

/**
 * POST /api/v1/vault/evidence-bundles
 * Store an evidence bundle
 */
router.post('/evidence-bundles', async (req: Request, res: Response) => {
  try {
    const { bundleId, title, content, mimeType, relatedDecisionId, metadata } = req.body;
    const createdBy = (req as any).user?.email || 'system';

    if (!bundleId || !title || !content) {
      res.status(400).json({
        success: false,
        error: 'bundleId, title, and content are required',
      });
      return;
    }

    const artifact = await cendiaVaultService.storeEvidenceBundle({
      bundleId,
      title,
      content: Buffer.from(content, 'base64'),
      mimeType: mimeType || 'application/zip',
      createdBy,
      relatedDecisionId,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Store evidence bundle error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store evidence bundle',
    });
  }
});

/**
 * POST /api/v1/vault/signed-reports
 * Store a signed report
 */
router.post('/signed-reports', async (req: Request, res: Response) => {
  try {
    const { reportId, title, content, mimeType, signature, metadata } = req.body;
    const createdBy = (req as any).user?.email || 'system';

    if (!reportId || !title || !content) {
      res.status(400).json({
        success: false,
        error: 'reportId, title, and content are required',
      });
      return;
    }

    const artifact = await cendiaVaultService.storeSignedReport({
      reportId,
      title,
      content: Buffer.from(content, 'base64'),
      mimeType: mimeType || 'application/pdf',
      signature,
      createdBy,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Store signed report error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store signed report',
    });
  }
});

// =============================================================================
// RETRIEVAL
// =============================================================================

/**
 * GET /api/v1/vault/artifacts/:id
 * Get artifact by ID
 */
router.get('/artifacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const actor = (req as any).user?.email || 'anonymous';

    const artifact = await cendiaVaultService.get(id as string, actor);

    if (!artifact) {
      res.status(404).json({
        success: false,
        error: 'Artifact not found',
      });
      return;
    }

    res.json({
      success: true,
      data: artifact,
    });
  } catch (error) {
    logger.error('[CendiaVault] Get artifact error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get artifact',
    });
  }
});

/**
 * GET /api/v1/vault/artifacts/:id/content
 * Get artifact content
 */
router.get('/artifacts/:id/content', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const actor = (req as any).user?.email || 'anonymous';

    const artifact = await cendiaVaultService.get(id as string, actor);
    if (!artifact) {
      res.status(404).json({
        success: false,
        error: 'Artifact not found',
      });
      return;
    }

    const content = await cendiaVaultService.getContent(id, actor);
    if (!content) {
      res.status(404).json({
        success: false,
        error: 'Content not found',
      });
      return;
    }

    res.setHeader('Content-Type', artifact.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${artifact.title}"`);
    res.send(content);
  } catch (error) {
    logger.error('[CendiaVault] Get content error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get content',
    });
  }
});

/**
 * GET /api/v1/vault/artifacts/:id/related
 * Get related artifacts
 */
router.get('/artifacts/:id/related', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const related = await cendiaVaultService.getRelated(id);

    res.json({
      success: true,
      data: related,
    });
  } catch (error) {
    logger.error('[CendiaVault] Get related error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get related artifacts',
    });
  }
});

// =============================================================================
// SEARCH
// =============================================================================

/**
 * GET /api/v1/vault/search
 * Search artifacts
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { type, createdBy, tags, classification, legalHold, q, limit, offset } = req.query;

    const artifacts = await cendiaVaultService.search({
      type: type as any,
      createdBy: createdBy as string,
      tags: tags ? (tags as string).split(',') : undefined,
      classification: classification as string,
      legalHold: legalHold === 'true' ? true : legalHold === 'false' ? false : undefined,
      searchText: q as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json({
      success: true,
      data: artifacts,
      count: artifacts.length,
    });
  } catch (error) {
    logger.error('[CendiaVault] Search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    });
  }
});

/**
 * GET /api/v1/vault/by-type/:type
 * Get artifacts by type
 */
router.get('/by-type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 50;

    const artifacts = await cendiaVaultService.getByType(type as any, limit);

    res.json({
      success: true,
      data: artifacts,
      count: artifacts.length,
    });
  } catch (error) {
    logger.error('[CendiaVault] Get by type error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get artifacts',
    });
  }
});

// =============================================================================
// VERIFICATION
// =============================================================================

/**
 * POST /api/v1/vault/artifacts/:id/verify
 * Verify artifact integrity
 */
router.post('/artifacts/:id/verify', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await cendiaVaultService.verify(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('[CendiaVault] Verify error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

// =============================================================================
// LEGAL HOLD
// =============================================================================

/**
 * POST /api/v1/vault/artifacts/:id/legal-hold
 * Set or release legal hold
 */
router.post('/artifacts/:id/legal-hold', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { hold, reason } = req.body;

    if (hold === undefined) {
      res.status(400).json({
        success: false,
        error: 'hold (boolean) is required',
      });
      return;
    }

    const success = await cendiaVaultService.setLegalHold(id, hold, reason);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Artifact not found',
      });
      return;
    }

    res.json({
      success: true,
      message: hold ? 'Legal hold set' : 'Legal hold released',
    });
  } catch (error) {
    logger.error('[CendiaVault] Legal hold error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set legal hold',
    });
  }
});

// =============================================================================
// EXPORT
// =============================================================================

/**
 * POST /api/v1/vault/export
 * Export artifacts
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const { ids, format, includeContent, includeSignatures, includeAccessLog } = req.body;
    const actor = (req as any).user?.email || 'anonymous';

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        error: 'ids (array) is required',
      });
      return;
    }

    const result = await cendiaVaultService.export(ids, {
      format: format || 'json',
      includeContent: includeContent !== false,
      includeSignatures: includeSignatures !== false,
      includeAccessLog: includeAccessLog || false,
    }, actor);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error,
      });
      return;
    }

    res.setHeader('Content-Type', result.mimeType!);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  } catch (error) {
    logger.error('[CendiaVault] Export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    });
  }
});

export default router;
