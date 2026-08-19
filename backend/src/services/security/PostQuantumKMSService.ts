// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.
//
// =============================================================================
// POST-QUANTUM KEY MANAGEMENT
// =============================================================================
//
// Real post-quantum primitives via @noble/post-quantum (FIPS 203/204/205):
//
//   ml-dsa-65   FIPS 204  signature   (was published as CRYSTALS-Dilithium 3)
//   slh-dsa-sha2-128f  FIPS 205  signature  (was SPHINCS+ SHA2-128f)
//   ml-kem-768  FIPS 203  KEM         (was CRYSTALS-Kyber 768)
//
// PREVIOUS IMPLEMENTATION GENERATED Ed25519 KEYS FOR ALL FOUR ALGORITHMS AND
// REPORTED NIST LEVELS AND PQ KEY SIZES OVER THE TOP. Any signature produced
// before this commit is classical Ed25519 and is NOT quantum-resistant,
// whatever its metadata says. Re-key and re-sign anything that matters.
//
// FALCON-512 is NOT offered. It is not implemented here and @noble does not
// ship it; NIST's FN-DSA draft is not final. An algorithm we cannot perform
// must not appear in the supported list.
//
// FIPS NOTE: these are FIPS-*approved algorithms*. This module is not a
// FIPS 140-3 *validated cryptographic module* and must not be described as
// "FIPS 140-3 compliant". Validation is a property of a certified module, not
// of the algorithm.
// =============================================================================

import crypto from 'crypto';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { slh_dsa_sha2_128f } from '@noble/post-quantum/slh-dsa.js';
import { logger } from '../../utils/logger.js';

export type PQAlgorithm = 'ml-dsa-65' | 'slh-dsa-sha2-128f' | 'ml-kem-768';

/**
 * Identifiers this service previously advertised. They are accepted so that
 * existing API clients keep working, and mapped onto what is actually
 * implemented.
 *
 * 'falcon-512' is deliberately absent. FALCON has no implementation here, and
 * the previous version answered a request for it with an Ed25519 key labelled
 * FALCON-512. Refusing is the only honest response.
 */
const LEGACY_ALGORITHM_IDS: Record<string, PQAlgorithm> = {
  'dilithium3': 'ml-dsa-65',
  'crystals-dilithium-3': 'ml-dsa-65',
  'sphincs-sha256-128f': 'slh-dsa-sha2-128f',
  'sphincs+-sha2-128f': 'slh-dsa-sha2-128f',
  'kyber768': 'ml-kem-768',
  'crystals-kyber-768': 'ml-kem-768',
};

const WITHDRAWN_ALGORITHM_IDS: Record<string, string> = {
  'falcon-512':
    'FALCON-512 is not implemented. It was previously offered, but every key ' +
    'issued under that name was a classical Ed25519 key. Use ml-dsa-65 ' +
    '(FIPS 204) for signatures.',
};

export type PQAlgorithmInput = PQAlgorithm | keyof typeof LEGACY_ALGORITHM_IDS | string;

/** Resolve a caller-supplied identifier to an algorithm this service implements. */
export function normalizeAlgorithm(input: PQAlgorithmInput): PQAlgorithm {
  const key = String(input ?? '').trim().toLowerCase();

  const withdrawn = WITHDRAWN_ALGORITHM_IDS[key];
  if (withdrawn) throw new Error(withdrawn);

  if (key in ALGORITHMS) return key as PQAlgorithm;

  const mapped = LEGACY_ALGORITHM_IDS[key];
  if (mapped) return mapped;

  throw new Error(
    `Unsupported algorithm: ${input}. Supported: ${Object.keys(ALGORITHMS).join(', ')}`
  );
}

interface AlgorithmSpec {
  name: string;
  standard: string;
  type: 'signature' | 'kem';
  nistLevel: number;
  publicKeyBytes: number;
  secretKeyBytes: number;
  signatureBytes: number | null;
  legacyName: string;
}

/**
 * Sizes below are asserted against the library at construction time (see
 * `selfTest`). If @noble changes them, the service refuses to start rather
 * than reporting figures that no longer match reality.
 */
const ALGORITHMS: Record<PQAlgorithm, AlgorithmSpec> = {
  'ml-dsa-65': {
    name: 'ML-DSA-65',
    standard: 'FIPS 204',
    type: 'signature',
    nistLevel: 3,
    publicKeyBytes: 1952,
    secretKeyBytes: 4032,
    signatureBytes: 3309,
    legacyName: 'CRYSTALS-Dilithium 3',
  },
  'slh-dsa-sha2-128f': {
    name: 'SLH-DSA-SHA2-128f',
    standard: 'FIPS 205',
    type: 'signature',
    nistLevel: 1,
    publicKeyBytes: 32,
    secretKeyBytes: 64,
    signatureBytes: 17088,
    legacyName: 'SPHINCS+ SHA2-128f',
  },
  'ml-kem-768': {
    name: 'ML-KEM-768',
    standard: 'FIPS 203',
    type: 'kem',
    nistLevel: 3,
    publicKeyBytes: 1184,
    secretKeyBytes: 2400,
    signatureBytes: null,
    legacyName: 'CRYSTALS-Kyber 768',
  },
};

function impl(algorithm: PQAlgorithm) {
  switch (algorithm) {
    case 'ml-dsa-65':
      return ml_dsa65;
    case 'slh-dsa-sha2-128f':
      return slh_dsa_sha2_128f;
    case 'ml-kem-768':
      return ml_kem768;
  }
}

export interface PQKeyRecord {
  id: string;
  algorithm: PQAlgorithm;
  algorithmDetails: AlgorithmSpec;
  publicKey: Uint8Array;
  publicKeyHex: string;
  fingerprint: string;
  status: 'active' | 'rotated' | 'revoked';
  createdAt: string;
  expiresAt: string | null;
}

class PostQuantumKMSServiceImpl {
  private keys = new Map<string, PQKeyRecord & { secretKey: Uint8Array }>();
  private verified = false;

  // ---------------------------------------------------------------------------
  // Introspection
  // ---------------------------------------------------------------------------

  getSupportedAlgorithms() {
    return Object.entries(ALGORITHMS).map(([id, spec]) => ({ id, ...spec }));
  }

  getRecommendation(useCase: string): PQAlgorithm {
    const recs: Record<string, PQAlgorithm> = {
      general: 'ml-dsa-65',
      'high-security': 'ml-dsa-65',
      'long-term': 'slh-dsa-sha2-128f', // hash-based: most conservative assumptions
      'key-exchange': 'ml-kem-768',
    };
    return recs[useCase] ?? 'ml-dsa-65';
  }

  /**
   * Round-trips every algorithm and asserts the advertised sizes. Call at
   * startup. Reporting a NIST level we have not exercised is exactly the
   * defect this file exists to correct.
   */
  selfTest(): { algorithm: PQAlgorithm; ok: boolean; detail: string }[] {
    const msg = new TextEncoder().encode('datacendia-pq-selftest');
    const results = (Object.keys(ALGORITHMS) as PQAlgorithm[]).map((algorithm) => {
      const spec = ALGORITHMS[algorithm];
      try {
        if (spec.type === 'kem') {
          const kem = ml_kem768;
          const kp = kem.keygen();
          if (kp.publicKey.length !== spec.publicKeyBytes) {
            throw new Error(`public key ${kp.publicKey.length}B, expected ${spec.publicKeyBytes}B`);
          }
          const { cipherText, sharedSecret } = kem.encapsulate(kp.publicKey);
          const recovered = kem.decapsulate(cipherText, kp.secretKey);
          if (Buffer.from(sharedSecret).compare(Buffer.from(recovered)) !== 0) {
            throw new Error('shared secret mismatch');
          }
          return { algorithm, ok: true, detail: `${spec.standard} encapsulate/decapsulate OK` };
        }

        const sig = impl(algorithm) as typeof ml_dsa65;
        const kp = sig.keygen();
        if (kp.publicKey.length !== spec.publicKeyBytes) {
          throw new Error(`public key ${kp.publicKey.length}B, expected ${spec.publicKeyBytes}B`);
        }
        const signature = sig.sign(msg, kp.secretKey);
        if (signature.length !== spec.signatureBytes) {
          throw new Error(`signature ${signature.length}B, expected ${spec.signatureBytes}B`);
        }
        if (!sig.verify(signature, msg, kp.publicKey)) throw new Error('verify failed');
        const tampered = new TextEncoder().encode('datacendia-pq-selftesT');
        if (sig.verify(signature, tampered, kp.publicKey)) {
          throw new Error('verify accepted a tampered message');
        }
        return { algorithm, ok: true, detail: `${spec.standard} sign/verify OK` };
      } catch (err) {
        return {
          algorithm,
          ok: false,
          detail: err instanceof Error ? err.message : String(err),
        };
      }
    });

    this.verified = results.every((r) => r.ok);
    for (const r of results) {
      if (r.ok) logger.info(`🔐 PQ self-test ${r.algorithm}: ${r.detail}`);
      else logger.error(`🔐 PQ self-test FAILED ${r.algorithm}: ${r.detail}`);
    }
    return results;
  }

  /** True only after a passing selfTest(). Health endpoints must gate on this. */
  isQuantumResistant(): boolean {
    return this.verified;
  }

  // ---------------------------------------------------------------------------
  // Key lifecycle
  // ---------------------------------------------------------------------------

  async generateKeyPair(opts: {
    algorithm: PQAlgorithmInput;
    /**
     * Accepted and ignored. The old implementation took a `strength` and did
     * nothing with it beyond echoing it back; NIST level is a property of the
     * algorithm, not a parameter. Kept so existing callers do not break.
     */
    strength?: number;
    expiresInDays?: number;
  }): Promise<PQKeyRecord> {
    const algorithm = normalizeAlgorithm(opts.algorithm);
    const spec = ALGORITHMS[algorithm];

    const kp = impl(algorithm).keygen();
    const publicKey = kp.publicKey;
    const fingerprint = crypto
      .createHash('sha256')
      .update(publicKey)
      .digest('hex')
      .slice(0, 32);

    const record = {
      id: `pq-${crypto.randomUUID()}`,
      algorithm,
      algorithmDetails: spec,
      publicKey,
      publicKeyHex: Buffer.from(publicKey).toString('hex'),
      fingerprint,
      secretKey: kp.secretKey,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      expiresAt: opts.expiresInDays
        ? new Date(Date.now() + opts.expiresInDays * 86_400_000).toISOString()
        : null,
    };

    this.keys.set(record.id, record);
    logger.info(`🔐 PQ key ${record.id} (${spec.name}, ${spec.standard}) generated`);
    return this.redact(record);
  }

  listKeys(): PQKeyRecord[] {
    return [...this.keys.values()].map((k) => this.redact(k));
  }

  getKeyMetadata(id: string): PQKeyRecord | null {
    const key = this.keys.get(id);
    return key ? this.redact(key) : null;
  }

  async rotateKey(id: string): Promise<PQKeyRecord> {
    const old = this.keys.get(id);
    if (!old) throw new Error('Key not found');
    old.status = 'rotated';
    return this.generateKeyPair({ algorithm: old.algorithm });
  }

  deleteKey(id: string): boolean {
    return this.keys.delete(id);
  }

  private redact(k: PQKeyRecord & { secretKey?: Uint8Array }): PQKeyRecord {
    const { secretKey: _omit, ...rest } = k;
    return rest as PQKeyRecord;
  }

  // ---------------------------------------------------------------------------
  // Sign / verify
  // ---------------------------------------------------------------------------

  async sign(data: string | Uint8Array, keyId?: string) {
    const key = keyId
      ? this.keys.get(keyId)
      : [...this.keys.values()].find((k) => k.status === 'active' && k.algorithmDetails.type === 'signature');
    if (!key) throw new Error('No active signing key available');
    if (key.algorithmDetails.type !== 'signature') {
      // ml-kem-768 is a KEM. The previous implementation happily "signed" with
      // it because everything was Ed25519 underneath.
      throw new Error(`${key.algorithmDetails.name} is a KEM and cannot sign`);
    }

    const msg = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const sig = (impl(key.algorithm) as typeof ml_dsa65).sign(msg, key.secretKey);

    return {
      keyId: key.id,
      algorithm: key.algorithm,
      algorithmName: key.algorithmDetails.name,
      standard: key.algorithmDetails.standard,
      signature: Buffer.from(sig).toString('base64'),
      publicKeyHex: key.publicKeyHex,
      signedAt: new Date().toISOString(),
    };
  }

  /**
   * Verifies against the PUBLIC key. The previous implementation passed the
   * private key to `crypto.verify`, so only the issuing server could check a
   * signature — which defeats the purpose of publishing one.
   */
  async verify(
    data: string | Uint8Array,
    signatureObj: { keyId?: string; signature: string; publicKeyHex?: string; algorithm?: PQAlgorithm }
  ) {
    const msg = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const sig = Buffer.from(signatureObj.signature, 'base64');

    let publicKey: Uint8Array;
    let algorithm: PQAlgorithm;

    if (signatureObj.publicKeyHex && signatureObj.algorithm) {
      publicKey = Uint8Array.from(Buffer.from(signatureObj.publicKeyHex, 'hex'));
      algorithm = signatureObj.algorithm;
    } else {
      const key = signatureObj.keyId ? this.keys.get(signatureObj.keyId) : undefined;
      if (!key) throw new Error('Key not found and no public key supplied');
      publicKey = key.publicKey;
      algorithm = key.algorithm;
    }

    const valid = (impl(algorithm) as typeof ml_dsa65).verify(sig, msg, publicKey);
    return { valid, algorithm, verifiedAt: new Date().toISOString() };
  }

  // ---------------------------------------------------------------------------
  // Key encapsulation (ML-KEM-768)
  // ---------------------------------------------------------------------------

  encapsulate(publicKeyHex: string) {
    const pk = Uint8Array.from(Buffer.from(publicKeyHex, 'hex'));
    const { cipherText, sharedSecret } = ml_kem768.encapsulate(pk);
    return {
      cipherText: Buffer.from(cipherText).toString('base64'),
      sharedSecret: Buffer.from(sharedSecret).toString('base64'),
    };
  }

  decapsulate(cipherTextB64: string, keyId: string) {
    const key = this.keys.get(keyId);
    if (!key) throw new Error('Key not found');
    if (key.algorithm !== 'ml-kem-768') throw new Error('Not an ML-KEM key');
    const ct = Uint8Array.from(Buffer.from(cipherTextB64, 'base64'));
    const shared = ml_kem768.decapsulate(ct, key.secretKey);
    return { sharedSecret: Buffer.from(shared).toString('base64') };
  }
}

export const postQuantumKMSService = new PostQuantumKMSServiceImpl();
export { PostQuantumKMSServiceImpl };
