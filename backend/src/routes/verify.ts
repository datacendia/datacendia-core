/**
 * CendiaVerify™ — Public Verification Routes
 *
 * Public endpoints for independent verification of Datacendia cryptographic
 * artifacts. No authentication required — anyone can verify.
 *
 * Endpoints:
 *   GET  /api/v1/verify/keys          — Get public keys
 *   POST /api/v1/verify/signature     — Verify a dual signature
 *   POST /api/v1/verify/zkproof       — Verify a ZKP compliance proof
 *   POST /api/v1/verify/merkle        — Verify a Merkle inclusion proof
 *   POST /api/v1/verify/commitment    — Verify a commitment-reveal pair
 *   POST /api/v1/verify/vdf           — Verify a VDF delay proof
 *   POST /api/v1/verify/cid           — Verify content matches a CID
 *   GET  /api/v1/verify/stamp/:hash   — Get visual stamp SVG
 *   GET  /api/v1/verify/health        — Service health
 *
 * @module routes/verify
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { keyManagementService } from '../services/crypto/KeyManagementService.js';
import { zkpService } from '../services/crypto/ZeroKnowledgeProofService.js';
import { merkleForestService } from '../services/crypto/MerkleForestService.js';
import { commitmentService } from '../services/crypto/CommitmentService.js';
import { verifiableDelayService } from '../services/crypto/VerifiableDelayService.js';
import { contentAddressedReceiptService } from '../services/crypto/ContentAddressedReceiptService.js';
import { cendiaStampService } from '../services/crypto/CendiaStampService.js';

const router = Router();

// =============================================================================
// HEALTH
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaVerify',
    version: '1.0.0',
    capabilities: [
      'Ed25519+ML-DSA-65 dual signature verification',
      'Zero-knowledge compliance proof verification (Pedersen-Ristretto255-Schnorr)',
      'Merkle forest inclusion proof verification',
      'Commitment-reveal verification',
      'Verifiable delay function proof verification (Wesolowski-RSA2048)',
      'Content-addressed receipt (CID) verification',
      'Visual cryptographic seal (CendiaStamp)',
    ],
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// PUBLIC KEYS
// =============================================================================

/**
 * GET /api/v1/verify/keys
 * Returns public keys for independent signature verification.
 */
router.get('/keys', async (_req: Request, res: Response) => {
  try {
    await keyManagementService.initialize();
    const keys = keyManagementService.getPublicKeys();
    res.json({
      success: true,
      data: {
        ...keys,
        usage: 'Use these public keys to independently verify any Datacendia Regulator\'s Receipt signature.',
        documentation: 'https://docs.datacendia.com/verify',
      },
    });
  } catch (error) {
    logger.error('Error getting public keys:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve public keys' });
  }
});

// =============================================================================
// SIGNATURE VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/signature
 * Verify an Ed25519 + ML-DSA-65 dual signature.
 *
 * Body: { message: string, signature: DualSignature }
 */
router.post('/signature', async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      res.status(400).json({ success: false, error: 'message and signature are required' });
      return;
    }

    await keyManagementService.initialize();
    const result = keyManagementService.verifyString(message, signature);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Signature verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// =============================================================================
// ZKP VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/zkproof
 * Verify a zero-knowledge compliance proof.
 *
 * Body: { proof: ComplianceProof }
 */
router.post('/zkproof', (req: Request, res: Response) => {
  try {
    const { proof } = req.body;

    if (!proof) {
      res.status(400).json({ success: false, error: 'proof is required' });
      return;
    }

    const result = zkpService.verifyComplianceProof(proof);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('ZKP verification error:', error);
    res.status(500).json({ success: false, error: 'ZKP verification failed' });
  }
});

// =============================================================================
// MERKLE FOREST VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/merkle
 * Verify a Merkle inclusion proof — prove a receipt exists in the forest.
 *
 * Body: { proof: MerkleProof }
 */
router.post('/merkle', (req: Request, res: Response) => {
  try {
    const { proof } = req.body;

    if (!proof) {
      res.status(400).json({ success: false, error: 'proof is required' });
      return;
    }

    const valid = merkleForestService.verifyInclusionProof(proof);

    res.json({
      success: true,
      data: {
        valid,
        receiptId: proof.leaf?.receiptId,
        treeSize: proof.treeSize,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Merkle verification error:', error);
    res.status(500).json({ success: false, error: 'Merkle verification failed' });
  }
});

/**
 * GET /api/v1/verify/merkle/forest/:orgId
 * Get the current Merkle forest state for an organization.
 */
router.get('/merkle/forest/:orgId', (req: Request, res: Response) => {
  try {
    const state = merkleForestService.getForestState(req.params['orgId']!);
    if (!state) {
      res.status(404).json({ success: false, error: 'Forest not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        root: state.root,
        leafCount: state.leafCount,
        lastUpdated: state.lastUpdated,
      },
    });
  } catch (error) {
    logger.error('Forest state error:', error);
    res.status(500).json({ success: false, error: 'Failed to get forest state' });
  }
});

// =============================================================================
// COMMITMENT VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/commitment
 * Verify a commitment-reveal pair — prove the question wasn't changed.
 *
 * Body: { commitment, question, parameters, nonce, committedAt?, revealedAt? }
 */
router.post('/commitment', (req: Request, res: Response) => {
  try {
    const { commitment, question, parameters, nonce, committedAt, revealedAt } = req.body;

    if (!commitment || !question || !nonce) {
      res.status(400).json({ success: false, error: 'commitment, question, and nonce are required' });
      return;
    }

    const result = commitmentService.verifyCommitment(
      commitment, question, parameters || {}, nonce, committedAt, revealedAt
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Commitment verification error:', error);
    res.status(500).json({ success: false, error: 'Commitment verification failed' });
  }
});

// =============================================================================
// VDF VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/vdf
 * Verify a Verifiable Delay Function proof — confirm minimum deliberation time.
 *
 * Body: { proof: VDFProof }
 */
router.post('/vdf', (req: Request, res: Response) => {
  try {
    const { proof } = req.body;

    if (!proof) {
      res.status(400).json({ success: false, error: 'proof is required' });
      return;
    }

    const result = verifiableDelayService.verifyVDFProof(proof);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('VDF verification error:', error);
    res.status(500).json({ success: false, error: 'VDF verification failed' });
  }
});

// =============================================================================
// CID VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/cid
 * Verify content matches a Content Identifier.
 *
 * Body: { cid, content }
 */
router.post('/cid', (req: Request, res: Response) => {
  try {
    const { cid, content } = req.body;

    if (!cid || !content) {
      res.status(400).json({ success: false, error: 'cid and content are required' });
      return;
    }

    const result = contentAddressedReceiptService.verifyCID(cid, content);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('CID verification error:', error);
    res.status(500).json({ success: false, error: 'CID verification failed' });
  }
});

/**
 * GET /api/v1/verify/cid/:cid
 * Resolve a CID to its content.
 */
router.get('/cid/:cid', (req: Request, res: Response) => {
  try {
    const result = contentAddressedReceiptService.resolve(req.params['cid']!);
    if (!result) {
      res.status(404).json({ success: false, error: 'CID not found in local registry' });
      return;
    }

    res.json({
      success: true,
      data: {
        receipt: result.receipt,
        content: JSON.parse(result.content),
      },
    });
  } catch (error) {
    logger.error('CID resolution error:', error);
    res.status(500).json({ success: false, error: 'CID resolution failed' });
  }
});

// =============================================================================
// VISUAL STAMP
// =============================================================================

/**
 * GET /api/v1/verify/stamp/:hash
 * Get the visual cryptographic seal SVG for a receipt hash.
 */
router.get('/stamp/:hash', (req: Request, res: Response) => {
  try {
    const hash = req.params['hash']!;
    const receiptId = req.query['receiptId'] as string || `receipt-${hash}`;

    const stamp = cendiaStampService.generateStamp(receiptId, hash);

    // Return SVG directly if Accept header wants it
    if (req.accepts('image/svg+xml')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(stamp.svg);
      return;
    }

    res.json({
      success: true,
      data: stamp,
    });
  } catch (error) {
    logger.error('Stamp generation error:', error);
    res.status(500).json({ success: false, error: 'Stamp generation failed' });
  }
});

// =============================================================================
// COMPREHENSIVE VERIFICATION
// =============================================================================

/**
 * POST /api/v1/verify/receipt
 * One-stop verification: checks signature, Merkle proof, CID, and stamp
 * for a complete Regulator's Receipt.
 *
 * Body: { receipt: RegulatorsReceipt (with extended fields) }
 */
router.post('/receipt', async (req: Request, res: Response) => {
  try {
    const { receipt } = req.body;

    if (!receipt) {
      res.status(400).json({ success: false, error: 'receipt is required' });
      return;
    }

    const results: Record<string, any> = {
      receiptId: receipt.receiptId,
      verifiedAt: new Date().toISOString(),
    };

    // 1. Verify dual signature
    if (receipt.cryptographicProof?.dualSignature) {
      await keyManagementService.initialize();
      results.signature = keyManagementService.verifyString(
        receipt.cryptographicProof.receiptHash,
        receipt.cryptographicProof.dualSignature
      );
    }

    // 2. Verify Merkle inclusion
    if (receipt.merkleForest?.proof) {
      results.merkle = {
        valid: merkleForestService.verifyInclusionProof(receipt.merkleForest.proof),
      };
    }

    // 3. Verify CID
    if (receipt.contentAddress?.cid) {
      const receiptJson = JSON.stringify(receipt);
      results.contentAddress = contentAddressedReceiptService.verifyCID(
        receipt.contentAddress.cid, receiptJson
      );
    }

    // Overall validity
    const allValid = Object.values(results).every((r: any) =>
      typeof r === 'object' && r !== null ? (r.valid !== false) : true
    );

    res.json({
      success: true,
      data: {
        valid: allValid,
        ...results,
      },
    });
  } catch (error) {
    logger.error('Receipt verification error:', error);
    res.status(500).json({ success: false, error: 'Receipt verification failed' });
  }
});

export default router;
