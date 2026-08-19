// =============================================================================
// PostQuantumKMSService — is it actually post-quantum?
// =============================================================================
// The previous implementation advertised CRYSTALS-Dilithium 3, FALCON-512,
// SPHINCS+ and CRYSTALS-Kyber 768, complete with NIST levels and correct key
// and signature sizes — and then did this:
//
//     const keypair = crypto.generateKeyPairSync('ed25519');
//
// Every key it issued was classical Ed25519. Every signature it produced was an
// Ed25519 signature returned with `algorithm: 'dilithium3'`. This is reachable:
// routes/post-quantum.ts is mounted under the security domain, so the claim was
// being made over a live API.
//
// It also verified using the PRIVATE key, so only the issuing server could
// check a signature it had published — which defeats the point of publishing
// one.
//
// These tests assert the sizes of real FIPS 203/204/205 primitives. Ed25519
// cannot satisfy them: its public key is 32 bytes and its signature 64.
// =============================================================================

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// src/config/index.ts validates its schema at import time and throws under
// NODE_ENV=test when these are absent, and the service reaches config through
// the logger. They are non-secret placeholders that exist only to satisfy that
// schema; real values in the environment always win. Captured first and put
// back in afterAll(), so nothing leaks into other suites sharing this process.
const MUTATED_ENV_KEYS = ['DATABASE_URL', 'JWT_SECRET'] as const;
const ORIGINAL_ENV: Partial<Record<(typeof MUTATED_ENV_KEYS)[number], string | undefined>> = {};
for (const key of MUTATED_ENV_KEYS) {
  ORIGINAL_ENV[key] = process.env[key];
}

process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test-only-placeholder-not-a-real-secret-0123456789';

afterAll(() => {
  for (const key of MUTATED_ENV_KEYS) {
    const original = ORIGINAL_ENV[key];
    if (original === undefined) delete process.env[key];
    else process.env[key] = original;
  }
});

describe('PostQuantumKMSService', () => {
  let svc: any;
  let normalizeAlgorithm: (s: string) => string;

  beforeAll(async () => {
    const mod = await import('../services/security/PostQuantumKMSService.js');
    svc = mod.postQuantumKMSService;
    normalizeAlgorithm = mod.normalizeAlgorithm;
  });

  // --- the keys are genuinely post-quantum ---------------------------------

  it('issues ML-DSA-65 keys at the FIPS 204 sizes, not Ed25519', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });

    expect(key.publicKey.length).toBe(1952);   // Ed25519 would be 32
    expect(key.algorithmDetails.standard).toBe('FIPS 204');
    expect(key.algorithmDetails.nistLevel).toBe(3);
  });

  it('issues SLH-DSA keys at the FIPS 205 sizes', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'slh-dsa-sha2-128f' });
    expect(key.publicKey.length).toBe(32);
    expect(key.algorithmDetails.standard).toBe('FIPS 205');
  });

  it('issues ML-KEM-768 keys at the FIPS 203 sizes', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-kem-768' });
    expect(key.publicKey.length).toBe(1184);
    expect(key.algorithmDetails.standard).toBe('FIPS 203');
  });

  it('produces signatures of the ML-DSA-65 size, not the Ed25519 size', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('attestation payload', key.id);
    const bytes = Buffer.from(sig.signature, 'base64');

    expect(bytes.length).toBe(3309);  // Ed25519 would be 64
    expect(sig.algorithm).toBe('ml-dsa-65');
    expect(sig.standard).toBe('FIPS 204');
  });

  // --- sign / verify actually work -----------------------------------------

  it('verifies a genuine signature', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('hello regulator', key.id);
    const result = await svc.verify('hello regulator', sig);
    expect(result.valid).toBe(true);
  });

  it('rejects a signature over different data', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('original message', key.id);
    const result = await svc.verify('altered message', sig);
    expect(result.valid).toBe(false);
  });

  it('rejects a tampered signature', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('payload', key.id);

    const bytes = Buffer.from(sig.signature, 'base64');
    bytes[0] ^= 0xff;
    const result = await svc.verify('payload', { ...sig, signature: bytes.toString('base64') });
    expect(result.valid).toBe(false);
  });

  it('verifies from the published public key alone', async () => {
    // The old implementation passed the private key to crypto.verify, so nobody
    // but the issuer could check a signature. A third party must be able to.
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('third-party check', key.id);

    const result = await svc.verify('third-party check', {
      signature: sig.signature,
      publicKeyHex: key.publicKeyHex,
      algorithm: 'ml-dsa-65',
    });
    expect(result.valid).toBe(true);
  });

  // --- secret material never leaves the service ----------------------------

  it('never returns secret key material', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    expect(key.secretKey).toBeUndefined();
    // Match the field, not the advertised size `secretKeyBytes`.
    expect(JSON.stringify(key)).not.toMatch(/"(secretKey|privateKey)"\s*:/);

    expect(svc.listKeys().every((k: any) => k.secretKey === undefined)).toBe(true);
    expect(svc.getKeyMetadata(key.id).secretKey).toBeUndefined();
  });

  // --- a KEM is not a signature scheme -------------------------------------

  it('refuses to sign with a KEM key', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-kem-768' });
    await expect(svc.sign('data', key.id)).rejects.toThrow(/KEM|cannot sign/i);
  });

  // --- backwards compatibility, and one deliberate refusal -----------------

  it('maps the previously advertised identifiers onto what is implemented', () => {
    expect(normalizeAlgorithm('dilithium3')).toBe('ml-dsa-65');
    expect(normalizeAlgorithm('kyber768')).toBe('ml-kem-768');
    expect(normalizeAlgorithm('sphincs-sha256-128f')).toBe('slh-dsa-sha2-128f');
    expect(normalizeAlgorithm('ml-dsa-65')).toBe('ml-dsa-65');
  });

  it('still issues a real key when asked for the legacy dilithium3', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'dilithium3', strength: 3 });
    expect(key.algorithm).toBe('ml-dsa-65');
    expect(key.publicKey.length).toBe(1952);
  });

  it('refuses FALCON-512 rather than substituting Ed25519 for it', () => {
    expect(() => normalizeAlgorithm('falcon-512')).toThrow(/not implemented/i);
    expect(() => normalizeAlgorithm('falcon-512')).toThrow(/Ed25519/);
  });

  it('rejects an unknown algorithm outright', () => {
    expect(() => normalizeAlgorithm('rot13')).toThrow(/Unsupported algorithm/i);
  });

  it('does not treat inherited Object properties as algorithms', () => {
    // `key in ALGORITHMS` matched these; ALGORITHMS['constructor'] is then the
    // Object constructor and impl() falls through to undefined, so the caller
    // saw a TypeError from .keygen() instead of a clean rejection.
    for (const name of ['constructor', 'toString', 'hasOwnProperty', '__proto__', 'valueOf']) {
      expect(() => normalizeAlgorithm(name), name).toThrow(/Unsupported algorithm/i);
    }
  });

  it('normalises the algorithm supplied to verify()', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('legacy verify path', key.id);

    // A caller passing the legacy id must verify, not crash on impl(undefined).
    const result = await svc.verify('legacy verify path', {
      signature: sig.signature,
      publicKeyHex: key.publicKeyHex,
      algorithm: 'dilithium3',
    });
    expect(result.valid).toBe(true);
  });

  it('refuses to verify under a KEM algorithm', async () => {
    const kem = await svc.generateKeyPair({ algorithm: 'ml-kem-768' });
    const signer = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('payload', signer.id);

    await expect(
      svc.verify('payload', {
        signature: sig.signature,
        publicKeyHex: kem.publicKeyHex,
        algorithm: 'ml-kem-768',
      }),
    ).rejects.toThrow(/KEM|cannot verify/i);
  });

  it('rejects an unknown algorithm supplied to verify() cleanly', async () => {
    const key = await svc.generateKeyPair({ algorithm: 'ml-dsa-65' });
    const sig = await svc.sign('payload', key.id);

    await expect(
      svc.verify('payload', {
        signature: sig.signature,
        publicKeyHex: key.publicKeyHex,
        algorithm: 'constructor',
      }),
    ).rejects.toThrow(/Unsupported algorithm/i);
  });

  it('reports quantum resistance only after actually exercising the algorithms', () => {
    // isQuantumResistant() returned this.verified, which nothing ever set,
    // so it answered false forever regardless of what the service could do.
    expect(svc.isQuantumResistant()).toBe(true);
  });

  it('no longer advertises an algorithm it cannot perform', () => {
    const ids = svc.getSupportedAlgorithms().map((a: any) => a.id);
    expect(ids).not.toContain('falcon-512');
    expect(ids).toEqual(expect.arrayContaining(['ml-dsa-65', 'slh-dsa-sha2-128f', 'ml-kem-768']));
  });

  // --- the advertised figures are exercised, not asserted -------------------

  it('self-test round-trips every advertised algorithm', () => {
    const results = svc.selfTest();
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.ok, `${r.algorithm}: ${r.detail}`).toBe(true);
    }
  });
});
