// =============================================================================
// Ristretto crypto — @noble/curves v2 migration + LSAG ring signatures
// =============================================================================
// Both services imported `RistrettoPoint` from '@noble/curves/ed25519'. In
// curves v2 neither the bare subpath nor that export exists: the group moved to
// ristretto255.Point, hash-to-curve moved to ristretto255_hasher, and
// toRawBytes() was renamed toBytes(). Every code path through either service
// therefore threw at import time.
//
// AnonymousDissentService additionally had no working signature scheme.
// verifyDissent() computed every value needed to check the ring signature,
// discarded all of them, and returned true whenever the scalars were positive.
// The signing side was not verifiable either: it drew random c_i/s_i for
// non-signers and closed with c_signer = total - sum(others), with no challenge
// chain, so a verifier had nothing to recompute. Both sides are now a proper
// LSAG.
//
// Because "it imports now" is a low bar for cryptographic code, these tests
// exercise the actual protocols, and the negative cases carry the weight: a
// verifier that cannot return false is the defect pattern being fixed.
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

// =============================================================================
// LSAG ring signatures
// =============================================================================

describe('AnonymousDissentService — LSAG ring signature', () => {
  let svc: any;

  const ringOf = (n: number, prefix: string) =>
    Array.from({ length: n }, (_, i) => svc.generateParticipantKeys(prefix + i));

  const pubsOf = (members: any[]) => members.map((m: any) => m.publicKey);

  const randHex64 = () =>
    Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

  const flipFirst = (hex: string) => (hex[0] === 'a' ? 'b' : 'a') + hex.slice(1);

  beforeAll(async () => {
    const mod = await import('../services/crypto/AnonymousDissentService.js');
    svc = mod.anonymousDissentService;
  });

  // --- soundness ------------------------------------------------------------

  it('accepts a genuine dissent', () => {
    const members = ringOf(4, 'a');
    svc.registerRing('d-ok', pubsOf(members));
    const signer = members[2];
    const d = svc.submitDissent('d-ok', 'I object.', 'formal_objection', signer.privateKey, signer.publicKey);

    const r = svc.verifyDissent(d);
    expect(r.valid).toBe(true);
    expect(r.membershipProven).toBe(true);
    expect(r.issues).toEqual([]);
    expect(r.anonymitySetSize).toBe(4);
  });

  it('accepts a signature from every position in the ring', () => {
    const members = ringOf(5, 'b');
    const pks = pubsOf(members);
    for (let i = 0; i < members.length; i++) {
      svc.registerRing('d-pos-' + i, pks);
      const d = svc.submitDissent('d-pos-' + i, 'Position test.', 'concern', members[i].privateKey, members[i].publicKey);
      expect(svc.verifyDissent(d).valid).toBe(true);
    }
  });

  it('closes for a ring of one (degenerate, but must still verify)', () => {
    const [only] = ringOf(1, 'c');
    svc.registerRing('d-one', [only.publicKey]);
    const d = svc.submitDissent('d-one', 'Alone.', 'observation', only.privateKey, only.publicKey);
    expect(svc.verifyDissent(d).valid).toBe(true);
  });

  // --- message binding: the defect this replaces ----------------------------

  it('rejects a statement altered after signing', () => {
    const members = ringOf(3, 'e');
    svc.registerRing('d-stmt', pubsOf(members));
    const d = svc.submitDissent('d-stmt', 'Original.', 'concern', members[0].privateKey, members[0].publicKey);

    const r = svc.verifyDissent({ ...d, statement: 'Rewritten.' });
    expect(r.valid).toBe(false);
    expect(r.membershipProven).toBe(false);
  });

  it('rejects an altered severity', () => {
    const members = ringOf(3, 'f');
    svc.registerRing('d-sev', pubsOf(members));
    const d = svc.submitDissent('d-sev', 'Same text.', 'observation', members[1].privateKey, members[1].publicKey);

    expect(svc.verifyDissent({ ...d, severity: 'formal_objection' }).valid).toBe(false);
  });

  it('rejects a dissent re-pointed at another deliberation', () => {
    const members = ringOf(3, 'g');
    svc.registerRing('d-delib', pubsOf(members));
    const d = svc.submitDissent('d-delib', 'Bound here.', 'concern', members[2].privateKey, members[2].publicKey);

    expect(svc.verifyDissent({ ...d, deliberationId: 'other-deliberation' }).valid).toBe(false);
  });

  // --- forgery --------------------------------------------------------------

  it('rejects a signature forged without any private key', () => {
    const members = ringOf(4, 'h');
    svc.registerRing('d-forge', pubsOf(members));
    const real = svc.submitDissent('d-forge', 'Genuine.', 'concern', members[0].privateKey, members[0].publicKey);

    // An attacker who knows the ring and a key image but holds no private key,
    // inventing positive scalars — precisely what the old verifier accepted.
    const forged = {
      ...real,
      statement: 'Forged dissent.',
      ringSignature: {
        ...real.ringSignature,
        c0: randHex64(),
        responses: real.ringSignature.responses.map(() => randHex64()),
      },
    };

    expect(svc.verifyDissent(forged).valid).toBe(false);
  });

  it('rejects a tampered response scalar', () => {
    const members = ringOf(4, 'i');
    svc.registerRing('d-resp', pubsOf(members));
    const d = svc.submitDissent('d-resp', 'Untouched.', 'concern', members[3].privateKey, members[3].publicKey);

    const responses = [...d.ringSignature.responses];
    responses[1] = flipFirst(responses[1]);
    expect(svc.verifyDissent({ ...d, ringSignature: { ...d.ringSignature, responses } }).valid).toBe(false);
  });

  it('rejects a tampered seed challenge', () => {
    const members = ringOf(3, 'j');
    svc.registerRing('d-c0', pubsOf(members));
    const d = svc.submitDissent('d-c0', 'Untouched.', 'concern', members[0].privateKey, members[0].publicKey);

    const c0 = flipFirst(d.ringSignature.c0);
    expect(svc.verifyDissent({ ...d, ringSignature: { ...d.ringSignature, c0 } }).valid).toBe(false);
  });

  it('rejects replay against a different anonymity set', () => {
    const members = ringOf(4, 'k');
    svc.registerRing('d-ring', pubsOf(members));
    const d = svc.submitDissent('d-ring', 'Bound to a ring.', 'concern', members[1].privateKey, members[1].publicKey);

    // Substitute one ring member for an outsider — the challenge prefix changes.
    const outsider = svc.generateParticipantKeys('outsider');
    const ring = [...d.ringSignature.ring];
    ring[3] = outsider.publicKey;
    expect(svc.verifyDissent({ ...d, ringSignature: { ...d.ringSignature, ring } }).valid).toBe(false);
  });

  it('rejects a swapped key image', () => {
    const members = ringOf(3, 'l');
    svc.registerRing('d-img', pubsOf(members));
    const d = svc.submitDissent('d-img', 'Bound to an image.', 'concern', members[0].privateKey, members[0].publicKey);

    const other = svc.generateParticipantKeys('other');
    expect(
      svc.verifyDissent({ ...d, ringSignature: { ...d.ringSignature, keyImage: other.publicKey } }).valid,
    ).toBe(false);
  });

  it('refuses to sign for a non-member', () => {
    const members = ringOf(3, 'm');
    svc.registerRing('d-outsider', pubsOf(members));
    const outsider = svc.generateParticipantKeys('nope');

    expect(() =>
      svc.submitDissent('d-outsider', 'Let me in.', 'concern', outsider.privateKey, outsider.publicKey),
    ).toThrow(/not found in ring/i);
  });

  it('rejects a signature whose private key does not match the claimed ring position', () => {
    const members = ringOf(4, 'q');
    svc.registerRing('d-impersonate', pubsOf(members));
    const victim = members[0];
    const attacker = svc.generateParticipantKeys('attacker');

    // The attacker claims the victim's position in the ring but can only sign
    // with their own key. The closing step s_pi = alpha - c_pi * x is then made
    // with the wrong x, so L_pi = s_pi*G + c_pi*P_victim no longer collapses to
    // alpha*G and the chain cannot return to c_0.
    const d = svc.submitDissent(
      'd-impersonate',
      'Impersonation attempt.',
      'concern',
      attacker.privateKey,
      victim.publicKey,
    );

    expect(svc.verifyDissent(d).valid).toBe(false);
    expect(svc.verifyDissent(d).membershipProven).toBe(false);
  });

  // --- linkability and anonymity -------------------------------------------

  it('links a second dissent from the same signer', () => {
    const members = ringOf(4, 'n');
    svc.registerRing('d-link', pubsOf(members));
    const signer = members[2];

    svc.submitDissent('d-link', 'First.', 'concern', signer.privateKey, signer.publicKey);
    expect(() =>
      svc.submitDissent('d-link', 'Second.', 'concern', signer.privateKey, signer.publicKey),
    ).toThrow(/double-dissent/i);
  });

  it('does not leak which member signed', () => {
    const members = ringOf(4, 'o');
    const pks = pubsOf(members);
    svc.registerRing('d-anon', pks);
    const signer = members[1];
    const d = svc.submitDissent('d-anon', 'Anonymous.', 'concern', signer.privateKey, signer.publicKey);

    const blob = JSON.stringify(d);
    expect(blob).not.toContain(signer.privateKey);
    expect(blob).not.toContain('o1');
    // Every position carries a response; the signer's is indistinguishable.
    expect(d.ringSignature.responses).toHaveLength(4);
    expect(new Set(d.ringSignature.responses).size).toBe(4);
    expect(d.ringSignature.ring).toEqual(pks);
  });

  it('derives a distinct key image per signer', () => {
    const members = ringOf(3, 'p');
    const pks = pubsOf(members);
    const images = members.map((m: any, i: number) => {
      svc.registerRing('d-keyimg-' + i, pks);
      return svc.submitDissent('d-keyimg-' + i, 'x', 'concern', m.privateKey, m.publicKey).ringSignature.keyImage;
    });
    expect(new Set(images).size).toBe(3);
  });
});
