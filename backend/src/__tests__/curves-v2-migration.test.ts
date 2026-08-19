// =============================================================================
// @noble/curves v2 migration — AnonymousDissentService + ZeroKnowledgeProofService
// =============================================================================
// Both services imported `RistrettoPoint` from '@noble/curves/ed25519'. In
// curves v2 neither the bare subpath nor that export exists: the group moved to
// ristretto255.Point, hash-to-curve moved to ristretto255_hasher, and
// toRawBytes() was renamed toBytes(). Every code path through either service
// therefore threw at import time.
//
// Because "it imports now" is a low bar for cryptographic code, these tests
// exercise the actual protocols and — more importantly — assert that
// verification returns *false* when it should. A verifier that cannot fail is
// the defect pattern this repository has produced more than once.
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';

process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test-only-placeholder-not-a-real-secret-0123456789';

describe('ZeroKnowledgeProofService — Pedersen commitments and Schnorr proofs', () => {
  let zkp: any;

  beforeAll(async () => {
    const mod = await import('../services/crypto/ZeroKnowledgeProofService.js');
    zkp = mod.zkpService;
  });

  it('loads at all (v1 import threw before reaching any of this)', () => {
    expect(zkp).toBeDefined();
  });

  it('opens a commitment with the correct value and blinding', () => {
    const { commitment, blinding } = zkp.commit(42n);
    expect(zkp.verifyCommitment(commitment.commitment, 42n, blinding)).toBe(true);
  });

  it('rejects a commitment opened to the wrong value', () => {
    const { commitment, blinding } = zkp.commit(42n);
    expect(zkp.verifyCommitment(commitment.commitment, 43n, blinding)).toBe(false);
  });

  it('rejects a commitment opened with the wrong blinding factor', () => {
    const { commitment } = zkp.commit(42n);
    expect(zkp.verifyCommitment(commitment.commitment, 42n, 12345n)).toBe(false);
  });

  it('is hiding: the same value commits to different points under fresh blinding', () => {
    const a = zkp.commit(42n).commitment.commitment;
    const b = zkp.commit(42n).commitment.commitment;
    expect(a).not.toBe(b);
  });

  it('proves and verifies knowledge of an opening', () => {
    const { commitment, proof } = zkp.proveKnowledge(7n, 99n, 'ctx-A');
    expect(zkp.verifyKnowledgeProof(commitment.commitment, proof, 'ctx-A')).toBe(true);
  });

  it('binds the proof to its context', () => {
    const { commitment, proof } = zkp.proveKnowledge(7n, 99n, 'ctx-A');
    // Same proof, different context — the challenge must not validate.
    expect(zkp.verifyKnowledgeProof(commitment.commitment, proof, 'ctx-B')).toBe(false);
  });

  it('rejects a tampered proof response', () => {
    const { commitment, proof } = zkp.proveKnowledge(7n, 99n, 'ctx-A');
    // response is hex of sv||sr; flip one nibble.
    const flipped = (proof.response[0] === 'a' ? 'b' : 'a') + proof.response.slice(1);
    expect(zkp.verifyKnowledgeProof(commitment.commitment, { ...proof, response: flipped }, 'ctx-A')).toBe(false);
  });
});

describe('AnonymousDissentService — linkable ring signatures', () => {
  let svc: any;

  beforeAll(async () => {
    const mod = await import('../services/crypto/AnonymousDissentService.js');
    svc = mod.anonymousDissentService;
  });

  it('loads at all (v1 import threw before reaching any of this)', () => {
    expect(svc).toBeDefined();
  });

  it('produces a dissent that verifies against its ring', () => {
    const members = ['p1', 'p2', 'p3', 'p4'].map(id => svc.generateParticipantKeys(id));
    const delib = 'delib-verify';
    svc.registerRing(delib, members.map((m: any) => m.publicKey));

    const signer = members[2];
    const dissent = svc.submitDissent(delib, 'I object to the finding.', 'high', signer.privateKey, signer.publicKey);

    const result = svc.verifyDissent(dissent);
    expect(result.valid).toBe(true);
    expect(result.membershipProven).toBe(true);
    expect(result.anonymitySetSize).toBe(4);
  });

  // ---------------------------------------------------------------------------
  // CHARACTERISATION — documents a defect, not desired behaviour
  // ---------------------------------------------------------------------------
  // verifyDissent() does not verify the ring signature. It computes sG, cP, sH
  // and cI for every ring member, discards all of them, leaves
  // reconstructedAlphaG/H at ZERO, and returns:
  //
  //     membershipProven = challengeSum > 0n
  //                     && challenges.every(c => c > 0n)
  //                     && responses.every(s => s > 0n)
  //
  // — a check that the scalars are positive. The source says as much:
  // "This is a simplified verification — in production would recompute full
  // hash chain."
  //
  // The signing side cannot be verified as written either: it draws random
  // c_i/s_i for non-signers and closes with c_signer = total - sum(others),
  // with no challenge chain (c_{i+1} = H(m, L_i, R_i)), so a verifier has
  // nothing to recompute. Repairing this means implementing a real LSAG on
  // both sides, which is deliberately out of scope for a dependency migration.
  //
  // This test asserts the CURRENT behaviour so the gap is visible and cannot be
  // mistaken for working anonymity. When the verifier is implemented, this test
  // will fail — invert it to expect false at that point.
  it('CHARACTERISATION: accepts a statement altered after signing (verifier is a stub)', () => {
    const members = ['q1', 'q2', 'q3'].map(id => svc.generateParticipantKeys(id));
    const delib = 'delib-tamper';
    svc.registerRing(delib, members.map((m: any) => m.publicKey));

    const signer = members[0];
    const dissent = svc.submitDissent(delib, 'Original statement.', 'medium', signer.privateKey, signer.publicKey);

    const forged = { ...dissent, statement: 'Rewritten statement.' };
    const result = svc.verifyDissent(forged);

    // Documents the defect: tampering is NOT detected.
    expect(result.valid).toBe(true);
    expect(result.membershipProven).toBe(true);
  });

  it('hides which ring member signed', () => {
    const members = ['r1', 'r2', 'r3'].map(id => svc.generateParticipantKeys(id));
    const delib = 'delib-anon';
    svc.registerRing(delib, members.map((m: any) => m.publicKey));

    const signer = members[1];
    const dissent = svc.submitDissent(delib, 'Anonymous objection.', 'low', signer.privateKey, signer.publicKey);

    // The signature must not carry the signer's identity or key.
    const blob = JSON.stringify(dissent);
    expect(blob).not.toContain(signer.privateKey);
    expect(blob).not.toContain('r2');
    expect(svc.getAnonymitySetSize(delib)).toBe(3);
  });
});
