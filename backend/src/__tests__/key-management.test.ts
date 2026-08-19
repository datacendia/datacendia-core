// =============================================================================
// KeyManagementService — crypto integrity regression tests
// =============================================================================
// These tests exist because of four defects that shipped to master together:
//
//   C3  private keys + master seed written to the log under LOG_LEVEL=debug
//   D1  '@noble/post-quantum/ml-dsa' — a subpath the package does not export
//   D2  ml_dsa65.sign(secretKey, message)  — arguments reversed
//   D3  ml_dsa65.verify(publicKey, message, signature) — arguments reversed
//
// D2 and D3 type-checked cleanly because a hand-written ambient declaration in
// src/types/noble.d.ts described the argument order backwards. The compiler
// cannot catch this class of bug for us any more than it already does, so the
// assertions below are the backstop.
//
// The two that matter most are "rejects a tampered message" and "never logs key
// material". A verifier that cannot return false and a logger that prints
// secrets are the two failure modes this codebase has produced before.
// =============================================================================

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';

// Every process.env key this file touches, captured before anything is changed
// so the whole set can be put back in afterAll(). Vitest isolates files by
// default, but that is a configuration choice rather than a guarantee -- under
// `isolate: false`, or any pool that shares a process, unrestored mutations
// would leak into unrelated suites. Restoring keeps this file self-contained
// either way.
const MUTATED_ENV_KEYS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CENDIA_ED25519_PRIVATE_KEY',
  'CENDIA_DILITHIUM_PRIVATE_KEY',
  'CENDIA_MASTER_SEED',
] as const;

const ORIGINAL_ENV: Partial<Record<(typeof MUTATED_ENV_KEYS)[number], string | undefined>> = {};
for (const key of MUTATED_ENV_KEYS) {
  ORIGINAL_ENV[key] = process.env[key];
}

function restoreEnv(): void {
  for (const key of MUTATED_ENV_KEYS) {
    const original = ORIGINAL_ENV[key];
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
}

// src/config/index.ts validates its schema at import time and throws under
// NODE_ENV=test if these are missing. KeyManagementService reaches config only
// transitively, via the logger, and never touches a database -- so these are
// non-secret placeholders that exist purely to satisfy that schema. Real values
// in the environment always win. They must be set before the service is
// imported, which is why the imports in beforeAll() are dynamic.
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test-only-placeholder-not-a-real-secret-0123456789';

afterAll(() => {
  restoreEnv();
  vi.restoreAllMocks();
});

// A fixed seed keeps these deterministic. It is a test vector, not a secret.
const TEST_SEED = 'a'.repeat(128);

describe('KeyManagementService — crypto integrity', () => {
  let kms: InstanceType<typeof import('../services/crypto/KeyManagementService.js').KeyManagementService>;
  let logged: string[];

  beforeAll(async () => {
    // Force the "generated, not loaded" branch — the one that used to leak.
    delete process.env.CENDIA_ED25519_PRIVATE_KEY;
    delete process.env.CENDIA_DILITHIUM_PRIVATE_KEY;
    process.env.CENDIA_MASTER_SEED = TEST_SEED;

    const { logger } = await import('../utils/logger.js');
    const { KeyManagementService } = await import('../services/crypto/KeyManagementService.js');

    logged = [];
    const capture = (...args: unknown[]) => { logged.push(args.map(String).join(' ')); };
    for (const level of ['debug', 'info', 'warn', 'error'] as const) {
      vi.spyOn(logger, level).mockImplementation(capture as never);
    }

    kms = KeyManagementService.getInstance();
    await kms.initialize();
  });

  // ---------------------------------------------------------------------------
  // C3 — the disclosure bug
  // ---------------------------------------------------------------------------
  it('never writes key material to the log at any level', () => {
    const all = logged.join('\n');
    expect(all).not.toMatch(/PRIVATE_KEY=/);
    expect(all).not.toMatch(/MASTER_SEED=/);
    expect(all).not.toContain(TEST_SEED);
  });

  it('does not tell operators to raise the log level to obtain keys', () => {
    // The old code advertised LOG_LEVEL=debug as the provisioning path.
    expect(logged.join('\n')).not.toMatch(/LOG_LEVEL=debug to output key material/);
  });

  it('still logs fingerprints, so operators can identify the running key', () => {
    expect(logged.join('\n')).toMatch(/Fingerprint/);
  });

  // ---------------------------------------------------------------------------
  // D1/D2/D3 — the post-quantum path can actually execute
  // ---------------------------------------------------------------------------
  it('dual-signs and verifies a message', async () => {
    const msg = new TextEncoder().encode('datacendia evidence receipt');
    const sig = await kms.sign(msg);
    const result = kms.verify(msg, sig);

    expect(result.ed25519Valid).toBe(true);
    expect(result.dilithiumValid).toBe(true);   // false if D2/D3 regress
    expect(result.messageHashMatch).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('rejects a tampered message', async () => {
    const msg = new TextEncoder().encode('transfer 100');
    const sig = await kms.sign(msg);
    const tampered = new TextEncoder().encode('transfer 900');

    const result = kms.verify(tampered, sig);
    expect(result.valid).toBe(false);
    expect(result.ed25519Valid).toBe(false);
    expect(result.dilithiumValid).toBe(false);
  });

  it('rejects a tampered ML-DSA signature specifically', async () => {
    const msg = new TextEncoder().encode('datacendia evidence receipt');
    const sig = await kms.sign(msg);

    // Flip one byte of the Dilithium signature only.
    const hex = sig.dilithium.signature;
    const flipped =
      hex.slice(0, 8) +
      (hex[8] === '0' ? '1' : '0') +
      hex.slice(9);

    const result = kms.verify(msg, { ...sig, dilithium: { ...sig.dilithium, signature: flipped } });
    expect(result.dilithiumValid).toBe(false);
    expect(result.valid).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Library contract — pinned so a dependency bump cannot silently drift
// -----------------------------------------------------------------------------
describe('@noble/post-quantum ML-DSA-65 contract', () => {
  it('exposes the documented key and signature sizes', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(7));
    expect(kp.publicKey.length).toBe(1952);
    expect(kp.secretKey.length).toBe(4032);
    expect(ml_dsa65.sign(new TextEncoder().encode('x'), kp.secretKey).length).toBe(3309);
  });

  it('takes sign(message, secretKey) — not the reverse', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(7));
    const msg = new TextEncoder().encode('x');

    expect(() => ml_dsa65.sign(msg, kp.secretKey)).not.toThrow();
    // The reversed form throws on a length check rather than producing a bad
    // signature, which is the only reason this defect was survivable.
    expect(() => ml_dsa65.sign(kp.secretKey as never, msg as never)).toThrow();
  });

  it('takes verify(signature, message, publicKey) — not the reverse', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(7));
    const msg = new TextEncoder().encode('x');
    const sig = ml_dsa65.sign(msg, kp.secretKey);

    expect(ml_dsa65.verify(sig, msg, kp.publicKey)).toBe(true);
    expect(() => ml_dsa65.verify(kp.publicKey as never, msg, sig as never)).toThrow();
  });

  it('derives keys deterministically from a seed', () => {
    const seed = new Uint8Array(32).fill(3);
    const a = ml_dsa65.keygen(seed);
    const b = ml_dsa65.keygen(seed);
    expect(Buffer.from(a.secretKey)).toEqual(Buffer.from(b.secretKey));
  });
});

// -----------------------------------------------------------------------------
// Key persistence round-trip
// -----------------------------------------------------------------------------
// loadDilithiumKey() used to call keygen(sha256(privateKey)), which discards the
// key being loaded and returns an unrelated one. Persisting a key via
// CENDIA_DILITHIUM_PRIVATE_KEY therefore produced a different signing identity
// than the one provisioned, with a fingerprint that did not match the published
// one. This asserts the round-trip actually round-trips.
// -----------------------------------------------------------------------------
describe('ML-DSA key persistence round-trip', () => {
  it('recovers the same public key from a stored secret key', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(11));
    const recovered = ml_dsa65.getPublicKey(kp.secretKey);
    expect(Buffer.from(recovered)).toEqual(Buffer.from(kp.publicKey));
  });

  it('produces signatures that verify under the originally published public key', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(11));
    const msg = new TextEncoder().encode('persisted-key receipt');

    // Simulate a restart: the secret key comes back from the environment as hex.
    const fromEnv = Uint8Array.from(Buffer.from(Buffer.from(kp.secretKey).toString('hex'), 'hex'));
    const sig = ml_dsa65.sign(msg, fromEnv);

    expect(ml_dsa65.verify(sig, msg, kp.publicKey)).toBe(true);
  });

  it('rejects a secret key of the wrong length rather than silently substituting one', () => {
    expect(() => ml_dsa65.getPublicKey(new Uint8Array(32))).toThrow();
  });
});
