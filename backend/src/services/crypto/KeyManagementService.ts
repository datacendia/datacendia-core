/**
 * CendiaKMS™ — Enterprise Key Management Service
 *
 * Manages cryptographic key pairs for Ed25519 (classical) and ML-DSA-65/Dilithium
 * (post-quantum) dual-signing. Keys are generated deterministically from a master
 * seed stored in environment variables, or generated fresh on first boot.
 *
 * @module services/crypto/KeyManagementService
 * @exports keyManagementService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { ed25519 } from '@noble/curves/ed25519.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';



import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';

// =============================================================================
// ALGORITHM CONSTANTS
// =============================================================================
// Fixed by FIPS 204 for ML-DSA-65. Asserted in src/__tests__/key-management.test.ts
// so that a dependency bump changing them fails loudly instead of silently.
const ML_DSA_65_SECRET_KEY_BYTES = 4032;

// =============================================================================
// TYPES
// =============================================================================

export interface KeyPair {
  algorithm: string;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  publicKeyHex: string;
  fingerprint: string;
  createdAt: Date;
}

export interface DualSignature {
  ed25519: {
    signature: string;
    publicKey: string;
    fingerprint: string;
  };
  dilithium: {
    signature: string;
    publicKey: string;
    fingerprint: string;
  };
  signedAt: string;
  algorithm: 'Ed25519+ML-DSA-65';
  messageHash: string;
}

export interface SignatureVerificationResult {
  valid: boolean;
  ed25519Valid: boolean;
  dilithiumValid: boolean;
  messageHashMatch: boolean;
  algorithm: string;
  verifiedAt: string;
  issues: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

export class KeyManagementService {
  private static instance: KeyManagementService;

  private ed25519Keys: KeyPair | null = null;
  private dilithiumKeys: KeyPair | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): KeyManagementService {
    if (!KeyManagementService.instance) {
      KeyManagementService.instance = new KeyManagementService();
    }
    return KeyManagementService.instance;
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Try to load existing keys from environment
      const ed25519PrivHex = process.env.CENDIA_ED25519_PRIVATE_KEY;
      const dilithiumPrivHex = process.env.CENDIA_DILITHIUM_PRIVATE_KEY;

      if (ed25519PrivHex && dilithiumPrivHex) {
        this.ed25519Keys = this.loadEd25519Key(ed25519PrivHex);
        this.dilithiumKeys = this.loadDilithiumKey(dilithiumPrivHex);
        logger.info('🔐 CendiaKMS: Loaded existing key pairs from environment');
      } else {
        // Generate new keys deterministically from master seed or randomly
        const masterSeed = process.env.CENDIA_MASTER_SEED || crypto.randomBytes(64).toString('hex');

        this.ed25519Keys = this.generateEd25519Key(masterSeed);
        this.dilithiumKeys = this.generateDilithiumKey(masterSeed);

        logger.info('🔐 CendiaKMS: Generated new key pairs');
        logger.info(`   Ed25519 Public Key:   ${this.ed25519Keys.publicKeyHex.substring(0, 16)}...`);
        logger.info(`   Ed25519 Fingerprint:  ${this.ed25519Keys.fingerprint}`);
        logger.info(`   Dilithium Public Key: ${this.dilithiumKeys.publicKeyHex.substring(0, 16)}...`);
        logger.info(`   Dilithium Fingerprint: ${this.dilithiumKeys.fingerprint}`);

        // Warn that keys are ephemeral and need to be persisted via env vars.
        // NOTE: Key material is NEVER logged, regardless of LOG_LEVEL. A runtime
        // toggle that reveals private keys is not a provisioning mechanism; keys
        // must be generated out-of-band and written straight to a secret store.
        if (!process.env.CENDIA_ED25519_PRIVATE_KEY) {
          logger.warn('🔐 CendiaKMS: Keys were generated randomly and will change on restart.');
          logger.warn('   Set CENDIA_ED25519_PRIVATE_KEY, CENDIA_DILITHIUM_PRIVATE_KEY, and CENDIA_MASTER_SEED to persist.');
          logger.warn(`   Ed25519 Fingerprint:  ${this.ed25519Keys.fingerprint}`);
          logger.warn(`   Dilithium Fingerprint: ${this.dilithiumKeys.fingerprint}`);
          logger.warn('   Generate keys out-of-band and store them in your secret manager.');
        }
      }

      this.initialized = true;
      logger.info('🔐 CendiaKMS: Initialization complete — dual-signing ready (Ed25519 + ML-DSA-65)');
    } catch (err) {
      logger.error('🔐 CendiaKMS: Initialization failed', err);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // KEY GENERATION
  // ---------------------------------------------------------------------------

  private generateEd25519Key(masterSeed: string): KeyPair {
    // Derive Ed25519 private key from master seed
    const seedBytes = sha512(new TextEncoder().encode(`cendia-ed25519-v1:${masterSeed}`));
    const privateKey = seedBytes.slice(0, 32);
    const publicKey = ed25519.getPublicKey(privateKey);
    const publicKeyHex = bytesToHex(publicKey);
    const fingerprint = `SHA256:${bytesToHex(sha256(publicKey)).substring(0, 32)}`;

    return {
      algorithm: 'Ed25519',
      publicKey,
      privateKey,
      publicKeyHex,
      fingerprint,
      createdAt: new Date(),
    };
  }

  private generateDilithiumKey(masterSeed: string): KeyPair {
    // Derive Dilithium seed and generate key pair
    const seedBytes = sha512(new TextEncoder().encode(`cendia-dilithium-v1:${masterSeed}`));
    const seed = seedBytes.slice(0, 32);
    const keys = ml_dsa65.keygen(seed);
    const publicKeyHex = bytesToHex(keys.publicKey).substring(0, 128) + '...';
    const fingerprint = `SHA256:${bytesToHex(sha256(keys.publicKey)).substring(0, 32)}`;

    return {
      algorithm: 'ML-DSA-65 (Dilithium)',
      publicKey: keys.publicKey,
      privateKey: keys.secretKey,
      publicKeyHex,
      fingerprint,
      createdAt: new Date(),
    };
  }

  private loadEd25519Key(privateKeyHex: string): KeyPair {
    const privateKey = hexToBytes(privateKeyHex);
    const publicKey = ed25519.getPublicKey(privateKey);
    const publicKeyHex = bytesToHex(publicKey);
    const fingerprint = `SHA256:${bytesToHex(sha256(publicKey)).substring(0, 32)}`;

    return {
      algorithm: 'Ed25519',
      publicKey,
      privateKey,
      publicKeyHex,
      fingerprint,
      createdAt: new Date(),
    };
  }

  private loadDilithiumKey(privateKeyHex: string): KeyPair {
    const privateKey = hexToBytes(privateKeyHex);

    // ML-DSA-65 secret keys are a fixed 4032 bytes. Catching a wrong-sized key
    // here gives a usable error instead of an opaque failure inside the library.
    if (privateKey.length !== ML_DSA_65_SECRET_KEY_BYTES) {
      throw new Error(
        `CENDIA_DILITHIUM_PRIVATE_KEY must be ${ML_DSA_65_SECRET_KEY_BYTES} bytes ` +
          `(${ML_DSA_65_SECRET_KEY_BYTES * 2} hex characters) for ML-DSA-65, ` +
          `got ${privateKey.length} bytes`
      );
    }

    // The ML-DSA secret key encodes its own public key, so recover it directly.
    //
    // This previously read `ml_dsa65.keygen(sha256(privateKey).slice(0, 32))`,
    // which does not load the supplied key at all — it derives a brand new,
    // unrelated key pair from a hash of it and returns that instead. The effect
    // was that setting CENDIA_DILITHIUM_PRIVATE_KEY to persist a key silently
    // produced a *different* signing key on every boot, one whose public key
    // did not match the fingerprint that had been published for it.
    const publicKey = ml_dsa65.getPublicKey(privateKey);
    const publicKeyHex = bytesToHex(publicKey).substring(0, 128) + '...';
    const fingerprint = `SHA256:${bytesToHex(sha256(publicKey)).substring(0, 32)}`;

    return {
      algorithm: 'ML-DSA-65 (Dilithium)',
      publicKey,
      privateKey,
      publicKeyHex,
      fingerprint,
      createdAt: new Date(),
    };
  }

  // ---------------------------------------------------------------------------
  // SIGNING
  // ---------------------------------------------------------------------------

  /**
   * Dual-sign a message with both Ed25519 and ML-DSA-65 (Dilithium).
   * Returns a DualSignature containing both signatures plus metadata.
   */
  async sign(message: Uint8Array): Promise<DualSignature> {
    this.ensureInitialized();

    const messageHash = bytesToHex(sha256(message));

    // Ed25519 signature
    const ed25519Sig = ed25519.sign(message, this.ed25519Keys!.privateKey);

    // ML-DSA-65 (Dilithium) signature
    const dilithiumSig = ml_dsa65.sign(message, this.dilithiumKeys!.privateKey);

    return {
      ed25519: {
        signature: bytesToHex(ed25519Sig),
        publicKey: this.ed25519Keys!.publicKeyHex,
        fingerprint: this.ed25519Keys!.fingerprint,
      },
      dilithium: {
        signature: bytesToHex(dilithiumSig),
        publicKey: bytesToHex(this.dilithiumKeys!.publicKey),
        fingerprint: this.dilithiumKeys!.fingerprint,
      },
      signedAt: new Date().toISOString(),
      algorithm: 'Ed25519+ML-DSA-65',
      messageHash,
    };
  }

  /**
   * Sign a string message (convenience wrapper).
   */
  async signString(message: string): Promise<DualSignature> {
    return this.sign(new TextEncoder().encode(message));
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION
  // ---------------------------------------------------------------------------

  /**
   * Verify a dual signature against a message.
   * Both Ed25519 and Dilithium signatures must be valid.
   */
  verify(message: Uint8Array, signature: DualSignature): SignatureVerificationResult {
    const issues: string[] = [];
    let ed25519Valid = false;
    let dilithiumValid = false;

    // Verify message hash
    const computedHash = bytesToHex(sha256(message));
    const messageHashMatch = computedHash === signature.messageHash;
    if (!messageHashMatch) {
      issues.push('Message hash mismatch — content may have been modified after signing');
    }

    // Verify Ed25519
    try {
      const sig = hexToBytes(signature.ed25519.signature);
      const pubKey = hexToBytes(signature.ed25519.publicKey);
      ed25519Valid = ed25519.verify(sig, message, pubKey);
      if (!ed25519Valid) {
        issues.push('Ed25519 signature verification failed');
      }
    } catch (err) {
      issues.push(`Ed25519 verification error: ${(err as Error).message}`);
    }

    // Verify Dilithium
    try {
      const sig = hexToBytes(signature.dilithium.signature);
      const pubKey = hexToBytes(signature.dilithium.publicKey);
      dilithiumValid = ml_dsa65.verify(sig, message, pubKey);
      if (!dilithiumValid) {
        issues.push('ML-DSA-65 (Dilithium) signature verification failed');
      }
    } catch (err) {
      issues.push(`ML-DSA-65 verification error: ${(err as Error).message}`);
    }

    return {
      valid: ed25519Valid && dilithiumValid && messageHashMatch,
      ed25519Valid,
      dilithiumValid,
      messageHashMatch,
      algorithm: 'Ed25519+ML-DSA-65',
      verifiedAt: new Date().toISOString(),
      issues,
    };
  }

  /**
   * Verify from string message (convenience wrapper).
   */
  verifyString(message: string, signature: DualSignature): SignatureVerificationResult {
    return this.verify(new TextEncoder().encode(message), signature);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC KEY ACCESS
  // ---------------------------------------------------------------------------

  getPublicKeys(): {
    ed25519: { publicKey: string; fingerprint: string; algorithm: string };
    dilithium: { publicKey: string; fingerprint: string; algorithm: string };
  } {
    this.ensureInitialized();
    return {
      ed25519: {
        publicKey: this.ed25519Keys!.publicKeyHex,
        fingerprint: this.ed25519Keys!.fingerprint,
        algorithm: 'Ed25519',
      },
      dilithium: {
        publicKey: bytesToHex(this.dilithiumKeys!.publicKey),
        fingerprint: this.dilithiumKeys!.fingerprint,
        algorithm: 'ML-DSA-65 (FIPS 204 / Dilithium)',
      },
    };
  }

  getEd25519PublicKey(): Uint8Array {
    this.ensureInitialized();
    return this.ed25519Keys!.publicKey;
  }

  getDilithiumPublicKey(): Uint8Array {
    this.ensureInitialized();
    return this.dilithiumKeys!.publicKey;
  }

  // ---------------------------------------------------------------------------
  // INTERNAL
  // ---------------------------------------------------------------------------

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('CendiaKMS not initialized — call initialize() first');
    }
  }
}

// Export singleton
export const keyManagementService = KeyManagementService.getInstance();
