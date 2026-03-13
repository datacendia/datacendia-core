/**
 * CendiaCommit™ — Cryptographic Commitment Service (Commit-Reveal)
 *
 * Before a deliberation begins, publishes a cryptographic commitment to the
 * question and parameters. After the decision, anyone can verify the question
 * wasn't changed after seeing the answer. Prevents post-hoc manipulation.
 *
 * Protocol:
 *   1. COMMIT: hash(question || params || nonce) → commitment published
 *   2. DELIBERATE: AI Council runs normally
 *   3. REVEAL: publish (question, params, nonce) → anyone can verify
 *
 * @module services/crypto/CommitmentService
 * @exports commitmentService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.



import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';

// =============================================================================
// TYPES
// =============================================================================

export interface DeliberationCommitment {
  commitmentId: string;
  commitment: string;          // SHA-256 hash
  committedAt: string;
  organizationId: string;
  status: 'committed' | 'revealed' | 'expired';
}

export interface CommitmentReveal {
  commitmentId: string;
  question: string;
  parameters: Record<string, unknown>;
  nonce: string;
  revealedAt: string;
}

export interface CommitmentVerification {
  valid: boolean;
  commitmentId: string;
  commitmentMatches: boolean;
  questionIntact: boolean;
  parametersIntact: boolean;
  timingValid: boolean;
  verifiedAt: string;
  issues: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

export class CommitmentService {
  private static instance: CommitmentService;
  private commitments = new Map<string, {
    commitment: DeliberationCommitment;
    nonce: string;
    question: string;
    parameters: Record<string, unknown>;
  }>();

  private constructor() {
    logger.info('🔒 CendiaCommit: Initialized — deliberation commitment-reveal protocol active');
  }

  static getInstance(): CommitmentService {
    if (!CommitmentService.instance) {
      CommitmentService.instance = new CommitmentService();
    }
    return CommitmentService.instance;
  }

  // ---------------------------------------------------------------------------
  // COMMIT PHASE
  // ---------------------------------------------------------------------------

  /**
   * Create a commitment before deliberation begins.
   * The commitment is a SHA-256 hash of (question || params || nonce).
   * The nonce ensures the commitment cannot be reversed.
   */
  createCommitment(
    question: string,
    parameters: Record<string, unknown>,
    organizationId: string,
  ): DeliberationCommitment {
    const commitmentId = `commit-${crypto.randomBytes(8).toString('hex')}`;
    const nonce = crypto.randomBytes(32).toString('hex');

    // Canonical serialization for deterministic hashing
    const canonical = this.canonicalize(question, parameters, nonce);
    const commitment = bytesToHex(sha256(utf8ToBytes(canonical)));

    const result: DeliberationCommitment = {
      commitmentId,
      commitment,
      committedAt: new Date().toISOString(),
      organizationId,
      status: 'committed',
    };

    // Store the private data (nonce, question, params) for later reveal
    this.commitments.set(commitmentId, {
      commitment: result,
      nonce,
      question,
      parameters,
    });

    logger.info(`🔒 CendiaCommit: Created commitment ${commitmentId} (hash: ${commitment.substring(0, 16)}...)`);

    return result;
  }

  // ---------------------------------------------------------------------------
  // REVEAL PHASE
  // ---------------------------------------------------------------------------

  /**
   * Reveal the committed data after deliberation completes.
   * Returns the original question, parameters, and nonce for public verification.
   */
  revealCommitment(commitmentId: string): CommitmentReveal {
    const stored = this.commitments.get(commitmentId);
    if (!stored) {
      throw new Error(`Commitment ${commitmentId} not found`);
    }

    if (stored.commitment.status === 'revealed') {
      throw new Error(`Commitment ${commitmentId} already revealed`);
    }

    stored.commitment.status = 'revealed';

    logger.info(`🔒 CendiaCommit: Revealed commitment ${commitmentId}`);

    return {
      commitmentId,
      question: stored.question,
      parameters: stored.parameters,
      nonce: stored.nonce,
      revealedAt: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION (PUBLIC)
  // ---------------------------------------------------------------------------

  /**
   * Verify a commitment-reveal pair. Anyone can do this — no secrets needed.
   * Recomputes hash(question || params || nonce) and compares to commitment.
   */
  verifyCommitment(
    commitment: string,
    question: string,
    parameters: Record<string, unknown>,
    nonce: string,
    committedAt?: string,
    revealedAt?: string,
  ): CommitmentVerification {
    const issues: string[] = [];

    // Recompute the commitment
    const canonical = this.canonicalize(question, parameters, nonce);
    const recomputed = bytesToHex(sha256(utf8ToBytes(canonical)));
    const commitmentMatches = recomputed === commitment;

    if (!commitmentMatches) {
      issues.push('Commitment hash mismatch — question or parameters were modified after commitment');
    }

    // Check timing (commitment must precede reveal)
    let timingValid = true;
    if (committedAt && revealedAt) {
      timingValid = new Date(committedAt) < new Date(revealedAt);
      if (!timingValid) {
        issues.push('Timing violation — reveal timestamp precedes commitment timestamp');
      }
    }

    return {
      valid: commitmentMatches && timingValid,
      commitmentId: '',
      commitmentMatches,
      questionIntact: commitmentMatches,
      parametersIntact: commitmentMatches,
      timingValid,
      verifiedAt: new Date().toISOString(),
      issues,
    };
  }

  // ---------------------------------------------------------------------------
  // STATE ACCESS
  // ---------------------------------------------------------------------------

  getCommitment(commitmentId: string): DeliberationCommitment | undefined {
    return this.commitments.get(commitmentId)?.commitment;
  }

  // ---------------------------------------------------------------------------
  // INTERNAL
  // ---------------------------------------------------------------------------

  private canonicalize(question: string, parameters: Record<string, unknown>, nonce: string): string {
    // Deterministic JSON serialization (sorted keys) for reproducible hashing
    const sortedParams = JSON.stringify(parameters, Object.keys(parameters).sort());
    return `cendia-commit-v1:${question}:${sortedParams}:${nonce}`;
  }
}

// Export singleton
export const commitmentService = CommitmentService.getInstance();
