/**
 * CendiaWhistle™ — Anonymous Dissent Channel
 *
 * Cryptographically anonymous channel where any agent or human participant
 * can flag concerns about a decision WITHOUT revealing their identity.
 *
 * ZKP Protocol: Linkable Ring Signature on Ristretto255
 *
 * The ZKP statement being proved:
 *   "I am one of the N registered participants in deliberation D,
 *    AND I have not previously submitted a dissent for this decision,
 *    BUT you cannot determine which participant I am."
 *
 * Implementation:
 *   1. Each participant has a Ristretto255 key pair (generated at registration)
 *   2. To dissent anonymously, the participant creates a ring signature:
 *      - Ring: the set of ALL participant public keys
 *      - Message: the dissent statement
 *      - Key image: H(privateKey) — prevents double-dissent (linkable)
 *      - Signature: Schnorr-like ring signature that proves membership
 *   3. Anyone can verify the signature is valid (participant is legitimate)
 *      but cannot determine which key was used (anonymity)
 *   4. The key image prevents the same participant from dissenting twice
 *      (linkability) without revealing who they are
 *
 * @module services/crypto/AnonymousDissentService
 * @exports anonymousDissentService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { ristretto255, ristretto255_hasher } from '@noble/curves/ed25519.js';

// @noble/curves v2 removed the top-level `RistrettoPoint` export and the bare
// './ed25519' subpath. The group now lives at ristretto255.Point, and
// hash-to-curve moved to a separate hasher object. Aliasing keeps the call
// sites below unchanged; only construction and hashing differ.
const RistrettoPoint = ristretto255.Point;
type RistrettoPointT = InstanceType<typeof RistrettoPoint>;

// Domain separator for the LSAG challenge chain. Changing this invalidates
// every signature previously issued under it.
const LSAG_DOMAIN = 'cendia-whistle-lsag-v1:';



import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const G = RistrettoPoint.BASE;
const ORDER = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');

// Second generator for key images (nothing-up-my-sleeve)
const H_POINT = ristretto255_hasher.hashToCurve(sha512(utf8ToBytes('cendia-whistle-key-image-generator-v1')));

// =============================================================================
// TYPES
// =============================================================================

export interface ParticipantKeyPair {
  participantId: string;     // Only known to the participant
  publicKey: string;         // Ristretto point (hex) — shared with the ring
  privateKey: string;        // Scalar (hex) — NEVER shared
}

export interface AnonymousDissent {
  dissentId: string;
  deliberationId: string;
  statement: string;
  severity: 'formal_objection' | 'concern' | 'observation';
  ringSignature: {
    keyImage: string;        // H(sk) — linkable tag, prevents double-dissent
    ring: string[];          // All participant public keys
    c0: string;              // seed challenge; a valid ring closes back to this
    responses: string[];     // s_0, s_1, ..., s_{n-1}
    ringSize: number;
  };
  verified: boolean;
  submittedAt: string;
  metadata: {
    algorithm: 'Linkable-Ring-Signature-Ristretto255';
    anonymitySet: number;
    doubleDissentPrevented: boolean;
  };
}

export interface DissentVerification {
  valid: boolean;
  membershipProven: boolean;
  keyImageUnique: boolean;
  dissentId: string;
  anonymitySetSize: number;
  verifiedAt: string;
  issues: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

export class AnonymousDissentService {
  private static instance: AnonymousDissentService;

  // Deliberation → registered participant public keys
  private rings = new Map<string, string[]>();
  // Deliberation → submitted key images (for double-dissent prevention)
  private keyImages = new Map<string, Set<string>>();
  // Stored dissents
  private dissents = new Map<string, AnonymousDissent[]>();

  private constructor() {
    logger.info('🕵️ CendiaWhistle: Initialized — anonymous dissent channel (Linkable Ring Signatures on Ristretto255)');
  }

  static getInstance(): AnonymousDissentService {
    if (!AnonymousDissentService.instance) {
      AnonymousDissentService.instance = new AnonymousDissentService();
    }
    return AnonymousDissentService.instance;
  }

  // ---------------------------------------------------------------------------
  // PARTICIPANT REGISTRATION
  // ---------------------------------------------------------------------------

  /**
   * Generate a key pair for a participant.
   * The private key is returned ONCE and must be stored securely by the participant.
   */
  generateParticipantKeys(participantId: string): ParticipantKeyPair {
    const privBytes = crypto.getRandomValues(new Uint8Array(32));
    const privScalar = this.bytesToScalar(privBytes);
    const pubPoint = G.multiply(privScalar);

    return {
      participantId,
      publicKey: bytesToHex(pubPoint.toBytes()),
      privateKey: bytesToHex(this.scalarToBytes(privScalar)),
    };
  }

  /**
   * Register participant public keys for a deliberation.
   * This defines the anonymity set (the ring).
   */
  registerRing(deliberationId: string, publicKeys: string[]): void {
    this.rings.set(deliberationId, publicKeys);
    if (!this.keyImages.has(deliberationId)) {
      this.keyImages.set(deliberationId, new Set());
    }
    logger.info(`🕵️ CendiaWhistle: Ring registered for ${deliberationId} — ${publicKeys.length} participants`);
  }

  // ---------------------------------------------------------------------------
  // ANONYMOUS DISSENT SUBMISSION
  // ---------------------------------------------------------------------------

  /**
   * Submit an anonymous dissent using a linkable ring signature.
   *
   * The signer proves they are a member of the ring without revealing
   * which member they are. The key image prevents double-dissent.
   */
  submitDissent(
    deliberationId: string,
    statement: string,
    severity: AnonymousDissent['severity'],
    signerPrivateKey: string,
    signerPublicKey: string,
  ): AnonymousDissent {
    const ring = this.rings.get(deliberationId);
    if (!ring || ring.length === 0) {
      throw new Error(`No ring registered for deliberation ${deliberationId}`);
    }

    // Find signer's position in the ring
    const signerIndex = ring.indexOf(signerPublicKey);
    if (signerIndex === -1) {
      throw new Error('Signer public key not found in ring — not a registered participant');
    }

    const privScalar = this.bytesToScalar(hexToBytes(signerPrivateKey));
    const message = utf8ToBytes(`${deliberationId}:${statement}:${severity}`);

    // Compute key image: I = x * H_p(P) where x is private key, P is public key
    const pubPoint = RistrettoPoint.fromHex(signerPublicKey);
    const hP = ristretto255_hasher.hashToCurve(sha512(pubPoint.toBytes()));
    const keyImage = hP.multiply(privScalar);
    const keyImageHex = bytesToHex(keyImage.toBytes());

    // Check for double-dissent
    const usedImages = this.keyImages.get(deliberationId)!;
    if (usedImages.has(keyImageHex)) {
      throw new Error('Double-dissent detected — you have already submitted a dissent for this deliberation');
    }

    // -------------------------------------------------------------------------
    // Linkable Spontaneous Anonymous Group (LSAG) signature
    // -------------------------------------------------------------------------
    // The ring is a closed chain of challenges: each position derives the next
    // position's challenge from its own (L_i, R_i) pair. The signer starts the
    // chain at a random alpha, walks it around every other member using random
    // responses, and closes it with
    //
    //     s_pi = alpha - c_pi * x   (mod l)
    //
    // which is the single step that requires the private key. A verifier walks
    // the same chain from c_0 and accepts only if it arrives back at c_0.
    const n = ring.length;
    const ringPoints = ring.map(pk => RistrettoPoint.fromHex(pk));

    const c: bigint[] = new Array<bigint>(n).fill(0n);
    const s: bigint[] = new Array<bigint>(n).fill(0n);

    // Everything the challenge is bound to, hashed once and reused. Including
    // the ring and the key image stops a signature being replayed against a
    // different anonymity set.
    const prefix = concatBytes(
      utf8ToBytes(LSAG_DOMAIN),
      message,
      keyImage.toBytes(),
      ...ringPoints.map(p => p.toBytes()),
    );

    const alpha = this.randomScalar();
    c[(signerIndex + 1) % n] = this.ringChallenge(prefix, G.multiply(alpha), hP.multiply(alpha));

    for (let k = 1; k < n; k++) {
      const i = (signerIndex + k) % n;
      s[i] = this.randomScalar();
      const L = G.multiply(s[i]).add(ringPoints[i].multiply(c[i]));
      const R = this.hashToPoint(ringPoints[i]).multiply(s[i]).add(keyImage.multiply(c[i]));
      c[(i + 1) % n] = this.ringChallenge(prefix, L, R);
    }

    // Close the ring.
    s[signerIndex] = this.modOrder(alpha - this.modOrder(c[signerIndex] * privScalar));

    // Record key image to prevent double-dissent
    usedImages.add(keyImageHex);

    const dissentId = `dissent-${crypto.randomBytes(8).toString('hex')}`;

    const dissent: AnonymousDissent = {
      dissentId,
      deliberationId,
      statement,
      severity,
      ringSignature: {
        keyImage: keyImageHex,
        ring,
        c0: this.scalarToHex(c[0]),
        responses: s.map(v => this.scalarToHex(v)),
        ringSize: n,
      },
      verified: true,
      submittedAt: new Date().toISOString(),
      metadata: {
        algorithm: 'Linkable-Ring-Signature-Ristretto255',
        anonymitySet: n,
        doubleDissentPrevented: true,
      },
    };

    // Store
    if (!this.dissents.has(deliberationId)) this.dissents.set(deliberationId, []);
    this.dissents.get(deliberationId)!.push(dissent);

    logger.info(`🕵️ CendiaWhistle: Anonymous dissent ${dissentId} submitted for ${deliberationId} (ring size: ${n}, severity: ${severity})`);

    return dissent;
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION (PUBLIC)
  // ---------------------------------------------------------------------------

  /**
   * Verify a ring signature — proves the dissenter is a legitimate
   * participant without revealing which one.
   */
  verifyDissent(dissent: AnonymousDissent): DissentVerification {
    const issues: string[] = [];
    const sig = dissent.ringSignature;
    let membershipProven = false;

    try {
      const message = utf8ToBytes(`${dissent.deliberationId}:${dissent.statement}:${dissent.severity}`);
      const keyImage = RistrettoPoint.fromHex(sig.keyImage);
      const ringPoints = sig.ring.map(pk => RistrettoPoint.fromHex(pk));
      const responses = sig.responses.map(r => this.hexToScalar(r));
      const n = ringPoints.length;

      if (n === 0 || sig.ringSize !== n || responses.length !== n) {
        issues.push('Ring signature is malformed — ring size and response count disagree');
      } else {
        // Bound to exactly what the signer bound: message, key image, ring.
        // Any change to the statement, severity, deliberation, ring membership
        // or key image alters this prefix and the chain will not close.
        const prefix = concatBytes(
          utf8ToBytes(LSAG_DOMAIN),
          message,
          keyImage.toBytes(),
          ...ringPoints.map(p => p.toBytes()),
        );

        // Walk the chain from the stored seed and see whether it returns to it.
        // For the true signer, s_pi*G + c_pi*P_pi collapses to alpha*G, which is
        // what makes the chain close; no other position can be forced to.
        const c0 = this.hexToScalar(sig.c0);
        let c = c0;
        for (let i = 0; i < n; i++) {
          const L = G.multiply(responses[i]).add(ringPoints[i].multiply(c));
          const R = this.hashToPoint(ringPoints[i])
            .multiply(responses[i])
            .add(keyImage.multiply(c));
          c = this.ringChallenge(prefix, L, R);
        }

        membershipProven = c === c0;
        if (!membershipProven) {
          issues.push('Ring signature verification failed — signature does not close over this message and ring');
        }
      }

      // Linkability: the key image is deterministic in the signer's private key,
      // so a repeat means the same participant dissented twice.
      const usedImages = this.keyImages.get(dissent.deliberationId);
      const keyImageUnique = usedImages ? usedImages.has(sig.keyImage) : true;

      return {
        valid: membershipProven && issues.length === 0,
        membershipProven,
        keyImageUnique,
        dissentId: dissent.dissentId,
        anonymitySetSize: sig.ringSize,
        verifiedAt: new Date().toISOString(),
        issues,
      };
    } catch (err) {
      return {
        valid: false,
        membershipProven: false,
        keyImageUnique: false,
        dissentId: dissent.dissentId,
        anonymitySetSize: sig.ringSize,
        verifiedAt: new Date().toISOString(),
        issues: [`Verification error: ${(err as Error).message}`],
      };
    }
  }

  // ---------------------------------------------------------------------------
  // LSAG PRIMITIVES
  // ---------------------------------------------------------------------------

  /**
   * H_p(P) — map a ring member's public key to an independent generator.
   * Used for the key image, so that the image binds to the signer's key without
   * revealing which ring position it came from.
   */
  private hashToPoint(point: RistrettoPointT): RistrettoPointT {
    return ristretto255_hasher.hashToCurve(sha512(point.toBytes())) as RistrettoPointT;
  }

  /**
   * c_{i+1} = H(domain || message || keyImage || ring || L_i || R_i)
   * The prefix is precomputed once per signature; only L and R vary per step.
   */
  private ringChallenge(prefix: Uint8Array, L: RistrettoPointT, R: RistrettoPointT): bigint {
    return this.hashToScalar(concatBytes(prefix, L.toBytes(), R.toBytes()));
  }

  // ---------------------------------------------------------------------------
  // ACCESS
  // ---------------------------------------------------------------------------

  getDissentsForDeliberation(deliberationId: string): AnonymousDissent[] {
    return this.dissents.get(deliberationId) || [];
  }

  getAnonymitySetSize(deliberationId: string): number {
    return this.rings.get(deliberationId)?.length || 0;
  }

  // ---------------------------------------------------------------------------
  // SCALAR ARITHMETIC
  // ---------------------------------------------------------------------------

  private randomScalar(): bigint {
    const bytes = crypto.getRandomValues(new Uint8Array(64));
    return this.hashToScalar(bytes);
  }

  private hashToScalar(data: Uint8Array): bigint {
    const hash = sha512(data);
    let n = 0n;
    for (let i = 0; i < hash.length; i++) {
      n = (n << 8n) | BigInt(hash[i]);
    }
    return this.modOrder(n);
  }

  private modOrder(n: bigint): bigint {
    return ((n % ORDER) + ORDER) % ORDER;
  }

  private bytesToScalar(bytes: Uint8Array): bigint {
    let n = 0n;
    for (let i = 0; i < bytes.length; i++) {
      n = (n << 8n) | BigInt(bytes[i]);
    }
    return this.modOrder(n);
  }

  private scalarToBytes(n: bigint): Uint8Array {
    const positive = this.modOrder(n);
    const hex = positive.toString(16).padStart(64, '0');
    return hexToBytes(hex);
  }

  private scalarToHex(n: bigint): string {
    return this.modOrder(n).toString(16).padStart(64, '0');
  }

  private hexToScalar(hex: string): bigint {
    return this.bytesToScalar(hexToBytes(hex));
  }
}

// Export singleton
export const anonymousDissentService = AnonymousDissentService.getInstance();
