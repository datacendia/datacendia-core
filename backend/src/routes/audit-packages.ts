// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUDIT PACKAGE API ROUTES
// Real cryptographically-signed audit packages for Chronos
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { keyManagementService } from '../services/security/KeyManagementService.js';
import { evidenceVaultService } from '../services/evidence/EvidenceVaultService.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// =============================================================================
// TYPES
// =============================================================================

interface AuditPackageContent {
  deliberations: any[];
  decisions: any[];
  timeline: any[];
  metrics: any[];
  metadata: {
    totalEvents: number;
    totalDeliberations: number;
    totalDecisions: number;
    dateRange: { start: string; end: string };
  };
}

interface SignedAuditPackage {
  id: string;
  exportDate: string;
  snapshotDate: string;
  type: 'audit-package';
  version: string;
  contents: AuditPackageContent;
  cryptographicProof: {
    hash: string;
    fullHash: string;
    merkleRoot: string;
    timestamp: string;
    signer: string;
    algorithm: string;
    signature: string;
    keyId: string;
    provider: string;
  };
  toolCalls?: any[];
}

// =============================================================================
// HELPERS
// =============================================================================

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function buildMerkleTree(hashes: string[]): string {
  if (hashes.length === 0) return hashData('');
  if (hashes.length === 1) return hashes[0] || hashData('');
  
  const nextLevel: string[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i] || '';
    const right = hashes[i + 1] || left;
    nextLevel.push(hashData(left + right));
  }
  
  return buildMerkleTree(nextLevel);
}

// =============================================================================
// SCHEMAS
// =============================================================================

const SignPackageSchema = z.object({
  snapshotDate: z.string(),
  contents: z.object({
    deliberations: z.array(z.any()),
    decisions: z.array(z.any()),
    timeline: z.array(z.any()),
    metrics: z.array(z.any()),
    metadata: z.object({
      totalEvents: z.number(),
      totalDeliberations: z.number(),
      totalDecisions: z.number(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
    }),
  }),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/audit-packages/sign
 * Sign an audit package with real KMS
 */
router.post('/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { snapshotDate, contents } = SignPackageSchema.parse(req.body);
    
    const packageId = `AUD-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const exportDate = new Date().toISOString();
    
    // Build hashes for each component
    const deliberationsHash = hashData(JSON.stringify(contents.deliberations));
    const decisionsHash = hashData(JSON.stringify(contents.decisions));
    const timelineHash = hashData(JSON.stringify(contents.timeline));
    const metricsHash = hashData(JSON.stringify(contents.metrics));
    const metadataHash = hashData(JSON.stringify(contents.metadata));
    
    // Build Merkle tree from all component hashes
    const merkleRoot = buildMerkleTree([
      deliberationsHash,
      decisionsHash,
      timelineHash,
      metricsHash,
      metadataHash,
    ]);
    
    // Calculate full content hash
    const fullHash = hashData(JSON.stringify(contents));
    
    // Create canonical data for signing
    const canonicalData = JSON.stringify({
      id: packageId,
      snapshotDate,
      exportDate,
      merkleRoot,
      fullHash,
    });
    
    // Sign with KMS
    let signatureResult;
    try {
      signatureResult = await keyManagementService.sign(canonicalData);
    } catch (error) {
      logger.warn('[AuditPackages] KMS signing failed, using fallback', { error });
      // Fallback to indicate signing was attempted
      signatureResult = {
        signature: `UNSIGNED-${Date.now()}`,
        algorithm: 'NONE',
        keyId: 'fallback',
        timestamp: new Date().toISOString(),
        provider: 'fallback',
      };
    }
    
    const signedPackage: SignedAuditPackage = {
      id: packageId,
      exportDate,
      snapshotDate,
      type: 'audit-package',
      version: '2.0', // Version 2.0 = KMS signed
      contents,
      cryptographicProof: {
        hash: `sha256:${fullHash.slice(0, 16)}`,
        fullHash,
        merkleRoot,
        timestamp: exportDate,
        signer: 'CendiaChronos™ + KMS',
        algorithm: signatureResult.algorithm,
        signature: signatureResult.signature,
        keyId: signatureResult.keyId,
        provider: signatureResult.provider,
      },
    };
    
    logger.info('[AuditPackages] Signed audit package', {
      packageId,
      deliberationCount: contents.deliberations.length,
      decisionCount: contents.decisions.length,
      eventCount: contents.timeline.length,
      algorithm: signatureResult.algorithm,
    });
    
    res.json({
      success: true,
      data: signedPackage,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/audit-packages/verify
 * Verify an audit package signature and integrity
 */
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { package: pkg } = req.body;
    
    if (!pkg?.cryptographicProof) {
      throw errors.badRequest('Invalid package format');
    }
    
    // Recalculate hashes
    const deliberationsHash = hashData(JSON.stringify(pkg.contents.deliberations));
    const decisionsHash = hashData(JSON.stringify(pkg.contents.decisions));
    const timelineHash = hashData(JSON.stringify(pkg.contents.timeline));
    const metricsHash = hashData(JSON.stringify(pkg.contents.metrics));
    const metadataHash = hashData(JSON.stringify(pkg.contents.metadata));
    
    const recalculatedMerkle = buildMerkleTree([
      deliberationsHash,
      decisionsHash,
      timelineHash,
      metricsHash,
      metadataHash,
    ]);
    
    const recalculatedFullHash = hashData(JSON.stringify(pkg.contents));
    
    // Check integrity
    const integrityValid = 
      recalculatedMerkle === pkg.cryptographicProof.merkleRoot &&
      recalculatedFullHash === pkg.cryptographicProof.fullHash;
    
    // Verify signature if present and not fallback
    let signatureValid = false;
    if (pkg.cryptographicProof.signature && 
        !pkg.cryptographicProof.signature.startsWith('UNSIGNED')) {
      try {
        const canonicalData = JSON.stringify({
          id: pkg.id,
          snapshotDate: pkg.snapshotDate,
          exportDate: pkg.exportDate,
          merkleRoot: pkg.cryptographicProof.merkleRoot,
          fullHash: pkg.cryptographicProof.fullHash,
        });
        
        signatureValid = await keyManagementService.verify(
          canonicalData,
          pkg.cryptographicProof.signature,
          pkg.cryptographicProof.keyId
        );
      } catch (error) {
        logger.warn('[AuditPackages] Signature verification failed', { error });
      }
    }
    
    logger.info('[AuditPackages] Verified audit package', {
      packageId: pkg.id,
      integrityValid,
      signatureValid,
    });
    
    res.json({
      success: true,
      data: {
        packageId: pkg.id,
        integrityValid,
        signatureValid,
        hasSignature: !!pkg.cryptographicProof.signature && 
                      !pkg.cryptographicProof.signature.startsWith('UNSIGNED'),
        merkleRoot: pkg.cryptographicProof.merkleRoot,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/audit-packages/store
 * Store a signed audit package in Evidence Vault
 */
router.post('/store', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { package: pkg } = req.body;
    
    if (!pkg?.id) {
      throw errors.badRequest('Invalid package format');
    }
    
    // Store in Evidence Vault
    const stored = await evidenceVaultService.storeCouncilDecisionPacket({
      runId: pkg.id,
      deliberationId: pkg.id,
      organizationId: 'default',
      userId: 'chronos-export',
      question: `Audit Package: ${pkg.snapshotDate}`,
      recommendation: `Contains ${pkg.contents.metadata.totalDeliberations} deliberations, ${pkg.contents.metadata.totalDecisions} decisions`,
      confidence: 1.0,
      merkleRoot: pkg.cryptographicProof.merkleRoot,
      signature: pkg.cryptographicProof.signature ? {
        signature: pkg.cryptographicProof.signature,
        algorithm: pkg.cryptographicProof.algorithm,
        keyId: pkg.cryptographicProof.keyId,
      } : undefined,
      regulatoryFrameworks: ['SOC 2', 'ISO 27001'],
      retentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000),
    });
    
    logger.info('[AuditPackages] Stored in Evidence Vault', {
      packageId: pkg.id,
      vaultId: stored.id,
    });
    
    res.json({
      success: true,
      data: {
        packageId: pkg.id,
        vaultId: stored.id,
        storedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/audit-packages/public-key
 * Get public key for external verification
 */
router.get('/public-key', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const publicKey = keyManagementService.getPublicKey();
    
    res.json({
      success: true,
      data: {
        publicKey: publicKey ? `${publicKey.substring(0, 50)}...` : null,
        fingerprint: publicKey ? hashData(publicKey).substring(0, 32) : null,
        algorithm: 'RSA-SHA256',
        usage: 'Verify audit package signatures',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
