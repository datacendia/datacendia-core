/**
 * API Routes — Zkp
 *
 * Express route handler defining REST endpoints.
 * @module routes/zkp
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaZKP™ API Routes
 * 
 * Zero-Knowledge Proofs for Compliance
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { zeroKnowledgeProofService, ProofType } from '../services/security/ZeroKnowledgeProofService.js';

const router = Router();

/**
 * GET /api/v1/zkp/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaZKP',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/zkp/proof-types
 */
router.get('/proof-types', (_req: Request, res: Response) => {
  try {
    const types = zeroKnowledgeProofService.getProofTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    logger.error('Error getting proof types:', error);
    res.status(500).json({ success: false, error: 'Failed to get proof types' });
  }
});

/**
 * POST /api/v1/zkp/request
 */
router.post('/request', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, claim, decisionId, deliberationId, workflowId, organizationId, framework, privateWitness, requestedBy } = req.body;

    if (!type || !claim || !organizationId || !privateWitness || !requestedBy) {
      res.status(400).json({
        success: false,
        error: 'type, claim, organizationId, privateWitness, and requestedBy are required',
      });
      return;
    }

    const request = await zeroKnowledgeProofService.requestProof({
      type: type as ProofType,
      claim,
      decisionId,
      deliberationId,
      workflowId,
      organizationId,
      framework,
      privateWitness,
      requestedBy,
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    logger.error('Error requesting proof:', error);
    res.status(500).json({ success: false, error: 'Failed to request proof' });
  }
});

/**
 * POST /api/v1/zkp/generate/:requestId
 */
router.post('/generate/:requestId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const proof = await zeroKnowledgeProofService.generateProof(requestId);
    res.json({ success: true, data: proof });
  } catch (error) {
    logger.error('Error generating proof:', error);
    res.status(500).json({ success: false, error: 'Failed to generate proof' });
  }
});

/**
 * POST /api/v1/zkp/verify/:proofId
 */
router.post('/verify/:proofId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { proofId } = req.params;
    const { verifiedBy } = req.body;

    if (!verifiedBy) {
      res.status(400).json({ success: false, error: 'verifiedBy is required' });
      return;
    }

    const result = await zeroKnowledgeProofService.verifyProof(proofId, verifiedBy);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error verifying proof:', error);
    res.status(500).json({ success: false, error: 'Failed to verify proof' });
  }
});

/**
 * GET /api/v1/zkp/proofs/:id
 */
router.get('/proofs/:id', (req: Request, res: Response): void => {
  try {
    const proof = zeroKnowledgeProofService.getProof(req.params['id']!);
    if (!proof) {
      res.status(404).json({ success: false, error: 'Proof not found' });
      return;
    }
    res.json({ success: true, data: proof });
  } catch (error) {
    logger.error('Error getting proof:', error);
    res.status(500).json({ success: false, error: 'Failed to get proof' });
  }
});

/**
 * GET /api/v1/zkp/proofs/organization/:orgId
 */
router.get('/proofs/organization/:orgId', (req: Request, res: Response): void => {
  try {
    const proofs = zeroKnowledgeProofService.getProofsByOrganization(req.params['orgId']!);
    res.json({ success: true, data: proofs });
  } catch (error) {
    logger.error('Error getting proofs:', error);
    res.status(500).json({ success: false, error: 'Failed to get proofs' });
  }
});

/**
 * POST /api/v1/zkp/revoke/:proofId
 */
router.post('/revoke/:proofId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { proofId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({ success: false, error: 'reason is required' });
      return;
    }

    await zeroKnowledgeProofService.revokeProof(proofId, reason);
    res.json({ success: true, message: 'Proof revoked' });
  } catch (error) {
    logger.error('Error revoking proof:', error);
    res.status(500).json({ success: false, error: 'Failed to revoke proof' });
  }
});

/**
 * GET /api/v1/zkp/certificates/:id
 */
router.get('/certificates/:id', (req: Request, res: Response): void => {
  try {
    const certificate = zeroKnowledgeProofService.getCertificate(req.params['id']!);
    if (!certificate) {
      res.status(404).json({ success: false, error: 'Certificate not found' });
      return;
    }
    res.json({ success: true, data: certificate });
  } catch (error) {
    logger.error('Error getting certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to get certificate' });
  }
});

export default router;
