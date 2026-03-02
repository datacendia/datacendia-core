// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CENDIA EVIDENCE VAULT API ROUTES
 * 
 * Enterprise-grade decision packet management endpoints
 * Integrated with data sources for real client data
 */

import { Router, Request, Response } from 'express';
import { evidenceVaultService } from '../services/evidence/EvidenceVaultService.js';
import { logger } from '../utils/logger.js';
import multer from 'multer';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Extract user info (production upgrade: from auth middleware)
const extractUser = (req: Request) => {
  return {
    id: req.headers['x-user-id'] as string || 'anonymous',
    role: (req.headers['x-user-role'] as string || 'viewer') as any,
    organizationId: req.headers['x-organization-id'] as string || 'default-org',
  };
};

// =============================================================================
// PACKET RETRIEVAL
// =============================================================================

/**
 * GET /api/v1/evidence-vault/packets
 * List all decision packets with filtering
 */
router.get('/packets', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const {
      dataSourceId,
      search,
      status,
      mode,
      businessUnit,
      framework,
      dateFrom,
      dateTo,
      limit,
      offset,
    } = req.query;

    const result = await evidenceVaultService.getPackets({
      organizationId: user.organizationId,
      dataSourceId: dataSourceId as string,
      search: search as string,
      status: status as any,
      mode: mode as any,
      businessUnit: businessUnit as string,
      framework: framework as string,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json(result);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error fetching packets:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/evidence-vault/packets/:id
 * Get a specific packet by ID
 */
router.get('/packets/:id', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const packet = await evidenceVaultService.getPacketById(
      req.params.id,
      user.id,
      user.role
    );

    if (!packet) {
      return res.status(404).json({ error: 'Packet not found' });
    }

    res.json(packet);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error fetching packet:', error);
    res.status(getErrorMessage(error).includes('Auditors') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// PACKET GENERATION
// =============================================================================

/**
 * POST /api/v1/evidence-vault/packets/generate
 * Generate a new decision packet (context only)
 */
router.post('/packets/generate', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { decisionId, dataSourceId, mode, businessUnit, systemsImpacted, complianceFrameworks, policyPackVersion } = req.body;

    if (!decisionId || !dataSourceId) {
      return res.status(400).json({ error: 'decisionId and dataSourceId are required' });
    }

    const packet = await evidenceVaultService.generatePacket(
      decisionId,
      user.id,
      user.role,
      dataSourceId,
      {
        title: `Decision ${decisionId}`,
        mode: mode || 'operational',
        businessUnit: businessUnit || 'General',
        systemsImpacted: systemsImpacted || [],
        complianceFrameworks: complianceFrameworks || [],
        policyPackVersion: policyPackVersion || 'v2024.12.1',
      }
    );

    res.status(201).json(packet);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error generating packet:', error);
    res.status(getErrorMessage(error).includes('Only') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// APPROVAL WORKFLOW
// =============================================================================

/**
 * POST /api/v1/evidence-vault/packets/:id/send-to-approvers
 * Send packet to approvers
 */
router.post('/packets/:id/send-to-approvers', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { approvers, message, dueDate } = req.body;

    if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
      return res.status(400).json({ error: 'At least one approver is required' });
    }

    const workflow = await evidenceVaultService.sendToApprovers(
      req.params.id,
      user.id,
      user.role,
      approvers,
      message,
      dueDate ? new Date(dueDate) : undefined
    );

    res.json(workflow);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error sending to approvers:', error);
    res.status(getErrorMessage(error).includes('Only') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/evidence-vault/workflows/:id/respond
 * Respond to approval request
 */
router.post('/workflows/:id/respond', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { response, comment } = req.body;

    if (!['approved', 'rejected'].includes(response)) {
      return res.status(400).json({ error: 'Response must be "approved" or "rejected"' });
    }

    await evidenceVaultService.respondToApproval(
      req.params.id,
      user.id,
      response,
      comment
    );

    res.json({ success: true });
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error responding to approval:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// ATTACH EVIDENCE
// =============================================================================

/**
 * POST /api/v1/evidence-vault/packets/:id/attachments
 * Attach evidence to a packet
 */
router.post('/packets/:id/attachments', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { description, category } = req.body;

    const attachment = await evidenceVaultService.attachEvidence(
      req.params.id,
      user.id,
      user.role,
      {
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        buffer: file.buffer,
        description,
        category: category || 'evidence',
      }
    );

    res.status(201).json(attachment);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error attaching evidence:', error);
    res.status(getErrorMessage(error).includes('permissions') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// LOCK PACKET
// =============================================================================

/**
 * POST /api/v1/evidence-vault/packets/:id/lock
 * Lock and finalize a packet
 */
router.post('/packets/:id/lock', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);

    const packet = await evidenceVaultService.lockPacket(
      req.params.id,
      user.id,
      user.role
    );

    res.json(packet);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error locking packet:', error);
    res.status(getErrorMessage(error).includes('Only') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// BREAK-GLASS EXPORT
// =============================================================================

/**
 * POST /api/v1/evidence-vault/packets/:id/break-glass
 * Request break-glass export
 */
router.post('/packets/:id/break-glass', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { justification, urgencyLevel } = req.body;

    if (!justification) {
      return res.status(400).json({ error: 'Justification is required' });
    }

    const breakGlass = await evidenceVaultService.requestBreakGlassExport(
      req.params.id,
      user.id,
      justification,
      urgencyLevel || 'high'
    );

    res.status(201).json(breakGlass);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error requesting break-glass:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/evidence-vault/break-glass/:id/approve
 * Approve break-glass export (dual approval required)
 */
router.post('/break-glass/:id/approve', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);

    const breakGlass = await evidenceVaultService.approveBreakGlassExport(
      req.params.id,
      user.id,
      user.role
    );

    res.json(breakGlass);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error approving break-glass:', error);
    res.status(getErrorMessage(error).includes('Only') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/evidence-vault/break-glass/:id/execute
 * Execute approved break-glass export
 */
router.get('/break-glass/:id/execute', async (req: Request, res: Response) => {
  try {
    const bundle = await evidenceVaultService.executeBreakGlassExport(req.params.id);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="break-glass-export-${req.params.id}.zip"`);
    res.send(bundle);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error executing break-glass:', error);
    res.status(getErrorMessage(error).includes('not yet') ? 400 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// EXPORT
// =============================================================================

/**
 * GET /api/v1/evidence-vault/packets/:id/export
 * Export packet as PDF/JSON bundle
 */
router.get('/packets/:id/export', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const format = (req.query.format as string) || 'bundle';

    const bundle = await evidenceVaultService.exportPacket(
      req.params.id,
      user.id,
      user.role,
      format as any
    );

    const contentType = format === 'json' ? 'application/json' : 'application/zip';
    const extension = format === 'json' ? 'json' : 'zip';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="decision-packet-${req.params.id}.${extension}"`);
    res.send(bundle);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error exporting packet:', error);
    res.status(getErrorMessage(error).includes('cannot') ? 403 : 500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// RELATED DECISIONS
// =============================================================================

/**
 * GET /api/v1/evidence-vault/related/:entityType/:entityId
 * Get related decisions for an entity
 */
router.get('/related/:entityType/:entityId', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);

    const related = await evidenceVaultService.getRelatedDecisions(
      req.params.entityType,
      req.params.entityId,
      user.organizationId
    );

    res.json(related);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error fetching related decisions:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// STATS
// =============================================================================

/**
 * GET /api/v1/evidence-vault/stats
 * Get packet statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const dataSourceId = req.query.dataSourceId as string;

    const result = await evidenceVaultService.getPackets({
      organizationId: user.organizationId,
      dataSourceId,
      limit: 1000,
    });

    const stats = {
      total: result.total,
      draft: result.packets.filter(p => p.status === 'draft').length,
      underReview: result.packets.filter(p => p.status === 'under_review').length,
      approved: result.packets.filter(p => p.status === 'approved').length,
      locked: result.packets.filter(p => p.status === 'locked').length,
      superseded: result.packets.filter(p => p.status === 'superseded').length,
    };

    res.json(stats);
  } catch (error: unknown) {
    logger.error('[EvidenceVault API] Error fetching stats:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
