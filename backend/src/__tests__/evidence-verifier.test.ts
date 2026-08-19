// =============================================================================
// verify.html — the offline verifier shipped to regulators
// =============================================================================
// The generated verifier asserted nothing. Its checks were:
//
//     hashValid = RECEIPT_HASH.length > 0     // computed the hash, discarded it
//     ED25519_SIG.length >= 128               // string length
//     DILITHIUM_SIG.length >= 128             // string length
//     MERKLE_ROOT.length >= 32                // string length
//
// and it then printed "ALL CHECKS PASSED — cryptographically signed,
// independently verifiable, and tamper-evident". A false assurance handed to a
// third party is worse than no verifier, because it induces reliance.
//
// These tests execute the ACTUAL script embedded in the generated verify.html,
// against evidence built by the real MerkleForestService and the real receipt
// hashing convention. That matters: a verifier can be perfectly self-consistent
// and still disagree with the producer, in which case it reports genuine
// packages as forged — the same defect pointing the other way.
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';

process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ||= 'test-only-placeholder-not-a-real-secret-0123456789';

// Mirrors RegulatorsReceiptService.computeReceiptHash / hashData exactly.
// Note the array replacer: JSON.stringify filters keys at every level, so the
// verifier must use the identical call for the digests to agree.
function canonicalize(value: any): any {
  if (value === null || typeof value !== 'object') return value;
  if (typeof value.toJSON === 'function') return canonicalize(value.toJSON());
  if (Array.isArray(value)) return value.map(canonicalize);
  const out: Record<string, any> = {};
  for (const key of Object.keys(value).sort()) {
    const c = canonicalize(value[key]);
    if (c !== undefined) out[key] = c;
  }
  return out;
}

function computeReceiptHash(receipt: any): string {
  const { merkleForest: _m, ...copy } = receipt;
  (copy as any).cryptographicProof = {
    ...receipt.cryptographicProof,
    receiptHash: '',
    signature: undefined,
    dualSignature: undefined,
  };
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(copy))).digest('hex');
}

interface BadgeState { className: string; textContent: string }

/** Extract the verifier script from generated HTML and run it under a stub DOM. */
async function runVerifier(html: string) {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('no <script> block in verify.html');

  const els: Record<string, BadgeState & { style: Record<string, string> }> = {};
  const get = (id: string) => (els[id] ||= { className: '', textContent: '', style: {} });
  // Pre-create the summary nodes the script writes to unconditionally.
  ['hashCheck', 'ed25519Check', 'dilithiumCheck', 'merkleCheck', 'summaryBox', 'summaryTitle', 'summaryText', 'statusBadge'].forEach(get);

  const document = { getElementById: (id: string) => els[id] ?? null };
  const windowStub = { addEventListener: () => {} };

  const factory = new Function(
    'document', 'window', 'crypto', 'TextEncoder',
    match[1] + '\nreturn runVerification;',
  );
  const run = factory(document, windowStub, globalThis.crypto, TextEncoder);
  await run();

  return {
    badges: els,
    title: els.summaryTitle.textContent,
    status: els.statusBadge.textContent,
    summaryClass: els.summaryBox.className,
  };
}

describe('verify.html — offline evidence verifier', () => {
  let evidence: any;
  let merkleSvc: any;

  const buildPackage = async (mutate?: (r: any) => void) => {
    const merkle = await import('../services/crypto/MerkleForestService.js');
    merkleSvc = merkle.merkleForestService;

    const org = 'org-' + crypto.randomBytes(4).toString('hex');
    const receiptId = 'rcpt-' + crypto.randomBytes(4).toString('hex');

    const receipt: any = {
      receiptId,
      deliberationId: 'delib-1',
      generatedAt: '2026-08-18T00:00:00.000Z',
      decision: { outcome: 'approved', rationale: 'Within policy.' },
      cryptographicProof: { receiptHash: '', signature: undefined },
    };
    receipt.cryptographicProof.receiptHash = computeReceiptHash(receipt);

    // Real Merkle inclusion proof over the real service.
    merkleSvc.appendReceipt(org, 'other-1', crypto.randomBytes(32).toString('hex'));
    const appended = merkleSvc.appendReceipt(org, receiptId, receipt.cryptographicProof.receiptHash);
    merkleSvc.appendReceipt(org, 'other-2', crypto.randomBytes(32).toString('hex'));

    receipt.merkleForest = { root: appended.root, proof: appended.proof };

    if (mutate) mutate(receipt);

    const pkg = await evidence.generatePackage(receipt);
    const html = pkg.files.find((f: any) => f.filename === 'verify.html')!.content;
    return { receipt, html, appended };
  };

  beforeAll(async () => {
    const mod = await import('../services/crypto/SelfContainedEvidenceService.js');
    evidence = mod.selfContainedEvidenceService;
  });

  // --- the producer and the verifier must agree ----------------------------

  it('accepts a genuine package: hash matches and the Merkle proof reaches the root', async () => {
    const { html } = await buildPackage();
    const r = await runVerifier(html);

    expect(r.badges.hashCheck.textContent).toMatch(/^MATCHES/);
    expect(r.badges.hashCheck.className).toContain('badge-pass');
    expect(r.badges.merkleCheck.textContent).toMatch(/^INCLUDED/);
    expect(r.badges.merkleCheck.className).toContain('badge-pass');
    // Nothing failed, so it must not be reported as a failure.
    expect(r.summaryClass).not.toContain('fail');
  });

  it('agrees with MerkleForestService.verifyInclusionProof on the same proof', async () => {
    const { appended } = await buildPackage();
    expect(merkleSvc.verifyInclusionProof(appended.proof)).toBe(true);
  });

  // --- tampering must be caught --------------------------------------------

  it('rejects a package whose contents were altered after hashing', async () => {
    const { html } = await buildPackage(r => {
      r.decision.outcome = 'rejected'; // change the record, keep the old hash
    });
    const r = await runVerifier(html);

    expect(r.badges.hashCheck.textContent).toMatch(/MISMATCH/);
    expect(r.badges.hashCheck.className).toContain('badge-fail');
    expect(r.title).toMatch(/VERIFICATION FAILED/);
    expect(r.status).toBe('FAILED');
  });

  it('rejects a substituted Merkle root', async () => {
    const { html } = await buildPackage(r => {
      r.merkleForest.root = crypto.randomBytes(32).toString('hex');
    });
    const r = await runVerifier(html);

    expect(r.badges.merkleCheck.textContent).toMatch(/DOES NOT REACH ROOT/);
    expect(r.status).toBe('FAILED');
  });

  it('rejects a reordered sibling path', async () => {
    const { html } = await buildPackage(r => {
      const sibs = r.merkleForest.proof.siblings;
      if (sibs.length > 0) {
        sibs[0] = { ...sibs[0], position: sibs[0].position === 'left' ? 'right' : 'left' };
      }
    });
    const r = await runVerifier(html);

    expect(r.badges.merkleCheck.className).toContain('badge-fail');
    expect(r.status).toBe('FAILED');
  });

  it('rejects a tampered leaf', async () => {
    const { html } = await buildPackage(r => {
      r.merkleForest.proof.leaf = { ...r.merkleForest.proof.leaf, receiptId: 'someone-elses-receipt' };
    });
    const r = await runVerifier(html);

    expect(r.badges.merkleCheck.className).toContain('badge-fail');
    expect(r.status).toBe('FAILED');
  });

  // --- the original defect, directly -----------------------------------------

  it('does not treat a long random string as a valid signature', async () => {
    const { html } = await buildPackage(r => {
      // Exactly what the old engine accepted: >= 128 characters.
      r.cryptographicProof.dualSignature = {
        ed25519: { signature: 'a'.repeat(128), publicKey: 'b'.repeat(64) },
        dilithium: { signature: 'c'.repeat(200), publicKey: 'd'.repeat(100) },
      };
    });
    const r = await runVerifier(html);

    expect(r.badges.ed25519Check.className).not.toContain('badge-pass');
    expect(r.badges.ed25519Check.textContent).not.toMatch(/^SIGNED/);
    expect(r.badges.dilithiumCheck.className).not.toContain('badge-pass');
  });

  it('never reports post-quantum as verified, because no browser can check it', async () => {
    const { html } = await buildPackage();
    const r = await runVerifier(html);
    expect(r.badges.dilithiumCheck.className).toContain('badge-unknown');
  });

  it('does not claim "ALL CHECKS PASSED" when checks were merely unperformable', async () => {
    const { html } = await buildPackage(); // unsigned: signature checks are unknown
    const r = await runVerifier(html);

    expect(r.title).not.toMatch(/ALL CHECKS (PASSED|VERIFIED)/);
    expect(r.title).toMatch(/PARTIALLY VERIFIED/);
    expect(r.status).toBe('PARTIAL');
  });

  it('states that tamper-evidence is not a completeness claim', async () => {
    const { html } = await buildPackage();
    const r = await runVerifier(html);
    expect(r.badges.summaryText.textContent).toMatch(/does NOT establish that the underlying record set is complete/);
  });
});

// =============================================================================
// Receipt hash canonicalisation
// =============================================================================
// hashData() used JSON.stringify(data, Object.keys(data).sort()). The array form
// of the replacer is a key ALLOWLIST applied at every level, not a sort, so only
// the top-level keys survived and every nested object serialised as {}. The
// receipt hash therefore covered the id fields and nothing else — the decision
// could be rewritten from "approved" to "rejected" and the hash was unchanged.
//
// That made the hash useless as a tamper seal regardless of how good the
// verifier is, which is why it is fixed alongside the verifier.
// =============================================================================
describe('receipt hash canonicalisation', () => {
  const base = () => ({
    receiptId: 'r1',
    deliberationId: 'd1',
    decision: { outcome: 'approved', rationale: 'Within policy.' },
    findings: [{ id: 'f1', severity: 'low' }],
    cryptographicProof: { receiptHash: '', signature: undefined },
  });

  it('covers nested content: changing the decision changes the hash', () => {
    const a = base();
    const b = base();
    b.decision.outcome = 'rejected';
    expect(computeReceiptHash(a)).not.toBe(computeReceiptHash(b));
  });

  it('covers nested rationale text', () => {
    const a = base();
    const b = base();
    b.decision.rationale = 'Something entirely different.';
    expect(computeReceiptHash(a)).not.toBe(computeReceiptHash(b));
  });

  it('covers array contents', () => {
    const a = base();
    const b = base();
    b.findings[0].severity = 'critical';
    expect(computeReceiptHash(a)).not.toBe(computeReceiptHash(b));
  });

  it('is stable under key reordering', () => {
    const a: any = { b: 2, a: 1, nested: { y: 'two', x: 'one' } };
    const b: any = { a: 1, b: 2, nested: { x: 'one', y: 'two' } };
    a.cryptographicProof = { receiptHash: '' };
    b.cryptographicProof = { receiptHash: '' };
    expect(computeReceiptHash(a)).toBe(computeReceiptHash(b));
  });

  it('demonstrates the old behaviour was vacuous', () => {
    // The previous implementation, for the record.
    const old = (r: any) => crypto.createHash('sha256')
      .update(JSON.stringify(r, Object.keys(r).sort() as any)).digest('hex');
    const a = base();
    const b = base();
    b.decision.outcome = 'rejected';
    expect(old(a)).toBe(old(b));            // identical despite a different decision
    expect(computeReceiptHash(a)).not.toBe(computeReceiptHash(b)); // fixed
  });
});
