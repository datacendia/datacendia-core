/**
 * CendiaEvidence™ — Self-Contained Evidence Package Generator
 *
 * Generates a complete, self-contained evidence package for any deliberation.
 * The package includes a standalone HTML verifier that works offline in any
 * browser — no server, no Datacendia access needed. Email it to a regulator
 * and they can verify everything locally.
 *
 * Package contents:
 *   - receipt.json         — Full Regulator's Receipt with all crypto proofs
 *   - signature.json       — Ed25519 + ML-DSA-65 dual signature
 *   - zkproof.json         — Zero-knowledge compliance proofs
 *   - merkle-proof.json    — Merkle forest inclusion proof
 *   - commitment.json      — Commit-reveal verification data
 *   - vdf-proof.json       — Verifiable delay function proof
 *   - stamp.svg            — Visual cryptographic seal
 *   - public-keys.json     — Public keys for independent verification
 *   - verify.html          — STANDALONE offline verifier (works in any browser)
 *   - manifest.json        — Package manifest with integrity checksums
 *
 * @module services/crypto/SelfContainedEvidenceService
 * @exports selfContainedEvidenceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.



import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { keyManagementService } from './KeyManagementService.js';
import { cendiaStampService } from './CendiaStampService.js';
import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';

// =============================================================================
// TYPES
// =============================================================================

export interface EvidencePackageFile {
  filename: string;
  content: string;
  contentType: string;
  sha256: string;
  size: number;
}

export interface EvidencePackage {
  packageId: string;
  deliberationId: string;
  receiptId: string;
  generatedAt: string;
  files: EvidencePackageFile[];
  manifest: {
    packageId: string;
    version: string;
    deliberationId: string;
    receiptId: string;
    generatedAt: string;
    fileCount: number;
    totalSize: number;
    integrityHash: string;
    files: { filename: string; sha256: string; size: number }[];
  };
}

// =============================================================================
// SERVICE
// =============================================================================

export class SelfContainedEvidenceService {
  private static instance: SelfContainedEvidenceService;

  private constructor() {
    logger.info('📦 CendiaEvidence: Initialized — self-contained evidence package generator active');
  }

  static getInstance(): SelfContainedEvidenceService {
    if (!SelfContainedEvidenceService.instance) {
      SelfContainedEvidenceService.instance = new SelfContainedEvidenceService();
    }
    return SelfContainedEvidenceService.instance;
  }

  // ---------------------------------------------------------------------------
  // PACKAGE GENERATION
  // ---------------------------------------------------------------------------

  async generatePackage(receipt: any): Promise<EvidencePackage> {
    const packageId = `pkg-${crypto.randomBytes(8).toString('hex')}`;
    const files: EvidencePackageFile[] = [];

    // 1. Receipt JSON
    files.push(this.createFile('receipt.json', JSON.stringify(receipt, null, 2), 'application/json'));

    // 2. Dual signature
    if (receipt.cryptographicProof?.dualSignature) {
      files.push(this.createFile('signature.json', JSON.stringify(receipt.cryptographicProof.dualSignature, null, 2), 'application/json'));
    }

    // 3. ZKP proofs (if present)
    if (receipt.zkProofs) {
      files.push(this.createFile('zkproof.json', JSON.stringify(receipt.zkProofs, null, 2), 'application/json'));
    }

    // 4. Merkle proof
    if (receipt.merkleForest) {
      files.push(this.createFile('merkle-proof.json', JSON.stringify(receipt.merkleForest, null, 2), 'application/json'));
    }

    // 5. Commitment data
    if (receipt.commitment) {
      files.push(this.createFile('commitment.json', JSON.stringify(receipt.commitment, null, 2), 'application/json'));
    }

    // 6. VDF proof
    if (receipt.vdfProof) {
      files.push(this.createFile('vdf-proof.json', JSON.stringify(receipt.vdfProof, null, 2), 'application/json'));
    }

    // 7. Public keys
    try {
      await keyManagementService.initialize();
      const keys = keyManagementService.getPublicKeys();
      files.push(this.createFile('public-keys.json', JSON.stringify(keys, null, 2), 'application/json'));
    } catch {
      // KMS not available
    }

    // 8. Visual stamp SVG
    if (receipt.cryptographicProof?.receiptHash) {
      const stamp = cendiaStampService.generateStamp(receipt.receiptId, receipt.cryptographicProof.receiptHash);
      files.push(this.createFile('stamp.svg', stamp.svg, 'image/svg+xml'));
    }

    // 9. Standalone HTML verifier (the wow factor)
    const verifierHtml = this.generateStandaloneVerifier(receipt, files);
    files.push(this.createFile('verify.html', verifierHtml, 'text/html'));

    // 10. Manifest
    const manifest = {
      packageId,
      version: '1.0.0',
      deliberationId: receipt.decision?.id || '',
      receiptId: receipt.receiptId || '',
      generatedAt: new Date().toISOString(),
      fileCount: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      integrityHash: '',
      files: files.map(f => ({ filename: f.filename, sha256: f.sha256, size: f.size })),
    };
    manifest.integrityHash = bytesToHex(sha256(utf8ToBytes(JSON.stringify(manifest.files))));
    files.push(this.createFile('manifest.json', JSON.stringify(manifest, null, 2), 'application/json'));

    logger.info(`📦 CendiaEvidence: Generated package ${packageId} — ${files.length} files, ${manifest.totalSize} bytes`);

    return {
      packageId,
      deliberationId: receipt.decision?.id || '',
      receiptId: receipt.receiptId || '',
      generatedAt: manifest.generatedAt,
      files,
      manifest,
    };
  }

  // ---------------------------------------------------------------------------
  // STANDALONE HTML VERIFIER
  // ---------------------------------------------------------------------------

  private generateStandaloneVerifier(receipt: any, files: EvidencePackageFile[]): string {
    const receiptJson = JSON.stringify(receipt);
    const receiptHash = receipt.cryptographicProof?.receiptHash || '';
    const dualSig = receipt.cryptographicProof?.dualSignature;
    const merkle = receipt.merkleForest;
    const stamp = files.find(f => f.filename === 'stamp.svg');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Datacendia Evidence Verifier — ${receipt.receiptId || 'Receipt'}</title>
<style>
  :root { --bg: #0a0e1a; --surface: #111827; --border: #1f2937; --text: #e5e7eb; --accent: #3b82f6; --green: #10b981; --red: #ef4444; --gold: #f59e0b; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; padding: 24px; }
  .container { max-width: 900px; margin: 0 auto; }
  header { text-align: center; padding: 32px 0; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
  header h1 { font-size: 1.5rem; color: var(--accent); margin-bottom: 8px; }
  header p { color: #9ca3af; font-size: 0.875rem; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
  .badge-pass { background: rgba(16,185,129,0.15); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
  .badge-fail { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .badge-unknown { background: rgba(148,163,184,0.15); color: #cbd5e1; border: 1px solid rgba(148,163,184,0.35); }
  .badge-warn { background: rgba(234,179,8,0.15); color: #fde68a; border: 1px solid rgba(234,179,8,0.35); }
  .badge-pending { background: rgba(245,158,11,0.15); color: var(--gold); border: 1px solid rgba(245,158,11,0.3); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .card h2 { font-size: 1rem; color: var(--accent); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .check-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .check-row:last-child { border-bottom: none; }
  .check-label { font-size: 0.875rem; }
  .check-detail { font-family: 'Courier New', monospace; font-size: 0.7rem; color: #6b7280; margin-top: 4px; word-break: break-all; }
  .hash { font-family: 'Courier New', monospace; font-size: 0.75rem; background: rgba(59,130,246,0.1); padding: 8px 12px; border-radius: 6px; word-break: break-all; color: #93c5fd; }
  .stamp-container { text-align: center; padding: 24px; }
  .stamp-container svg { max-width: 200px; }
  .summary { text-align: center; padding: 32px; margin-top: 24px; border-radius: 12px; }
  .summary.pass { background: rgba(16,185,129,0.1); border: 2px solid var(--green); }
  .summary.fail { background: rgba(239,68,68,0.1); border: 2px solid var(--red); }
  .summary.warn { background: rgba(234,179,8,0.1); border: 2px solid #eab308; }
  .summary h2 { font-size: 1.5rem; margin-bottom: 8px; }
  .summary.pass h2 { color: var(--green); }
  .summary.fail h2 { color: var(--red); }
  .summary.warn h2 { color: #eab308; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-item { padding: 8px 0; }
  .info-label { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; }
  .info-value { font-size: 0.875rem; margin-top: 2px; }
  button { background: var(--accent); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 600; }
  button:hover { opacity: 0.9; }
  .offline-note { text-align: center; color: #6b7280; font-size: 0.75rem; margin-top: 24px; padding: 16px; border: 1px dashed var(--border); border-radius: 8px; }
  footer { text-align: center; color: #4b5563; font-size: 0.75rem; margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border); }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>DATACENDIA EVIDENCE VERIFIER</h1>
    <p>Self-contained cryptographic verification — works offline, no server required</p>
    <p style="margin-top:8px"><span class="badge badge-pending" id="statusBadge">VERIFYING...</span></p>
  </header>

  <div class="card">
    <h2>📋 Receipt Information</h2>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Receipt ID</div><div class="info-value">${receipt.receiptId || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Generated</div><div class="info-value">${receipt.generatedAt || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Decision</div><div class="info-value" style="font-size:0.8rem">${(receipt.decision?.question || 'N/A').substring(0, 80)}${(receipt.decision?.question || '').length > 80 ? '...' : ''}</div></div>
      <div class="info-item"><div class="info-label">Consensus</div><div class="info-value">${receipt.decision?.consensusScore || 0}%</div></div>
      <div class="info-item"><div class="info-label">Algorithm</div><div class="info-value">${receipt.cryptographicProof?.algorithm || 'SHA-256'}</div></div>
      <div class="info-item"><div class="info-label">Jurisdiction</div><div class="info-value">${receipt.retention?.jurisdiction || 'N/A'}</div></div>
    </div>
  </div>

  <div class="card">
    <h2>🔐 Cryptographic Verification</h2>
    <div class="check-row">
      <div>
        <div class="check-label">Receipt Hash (SHA-256)</div>
        <div class="check-detail">${receiptHash || 'Not available'}</div>
      </div>
      <span class="badge badge-pending" id="hashCheck">CHECKING</span>
    </div>
    <div class="check-row">
      <div>
        <div class="check-label">Ed25519 Signature</div>
        <div class="check-detail">${dualSig?.ed25519?.fingerprint || 'Not available'}</div>
      </div>
      <span class="badge badge-pending" id="ed25519Check">CHECKING</span>
    </div>
    <div class="check-row">
      <div>
        <div class="check-label">ML-DSA-65 (Dilithium) Post-Quantum Signature</div>
        <div class="check-detail">${dualSig?.dilithium?.fingerprint || 'Not available'}</div>
      </div>
      <span class="badge badge-pending" id="dilithiumCheck">CHECKING</span>
    </div>
    <div class="check-row">
      <div>
        <div class="check-label">Merkle Forest Inclusion</div>
        <div class="check-detail">Root: ${merkle?.root?.substring(0, 32) || 'Not available'}...</div>
      </div>
      <span class="badge badge-pending" id="merkleCheck">CHECKING</span>
    </div>
  </div>

  <div class="card">
    <h2>📊 Evidence Chain</h2>
    <div class="hash" style="margin-bottom:8px"><strong>Merkle Root:</strong> ${receipt.evidenceChain?.merkleRoot || 'N/A'}</div>
    <div class="hash" style="margin-bottom:8px"><strong>Deliberation Hash:</strong> ${receipt.evidenceChain?.deliberationHash || 'N/A'}</div>
    <div class="hash" style="margin-bottom:8px"><strong>Agent Responses Hash:</strong> ${receipt.evidenceChain?.agentResponsesHash || 'N/A'}</div>
    <div class="hash"><strong>Dissents Hash:</strong> ${receipt.evidenceChain?.dissentsHash || 'N/A'}</div>
  </div>

  <div class="card">
    <h2>👥 Participants (${receipt.participants?.agents?.length || 0} agents)</h2>
    ${(receipt.participants?.agents || []).map((a: any) => `
    <div class="check-row">
      <div>
        <div class="check-label">${a.name} — ${a.role}</div>
        <div class="check-detail">${a.responseCount} responses · Confidence: ${a.confidenceAvg}%${a.dissented ? ' · DISSENTED' : ''}</div>
      </div>
      ${a.dissented ? '<span class="badge badge-fail">DISSENT</span>' : '<span class="badge badge-pass">AGREED</span>'}
    </div>`).join('')}
  </div>

  ${receipt.compliance ? `
  <div class="card">
    <h2>✅ Compliance Mapping</h2>
    <div class="check-detail" style="margin-bottom:12px">Frameworks: ${receipt.compliance.frameworks?.join(', ') || 'None'}</div>
    ${(receipt.compliance.requirements || []).map((r: any) => `
    <div class="check-row">
      <div class="check-label">${r.framework}: ${r.requirement}</div>
      <span class="badge ${r.status === 'met' ? 'badge-pass' : 'badge-fail'}">${r.status.toUpperCase()}</span>
    </div>`).join('')}
  </div>` : ''}

  ${stamp ? `
  <div class="card">
    <h2>🎨 Visual Cryptographic Seal</h2>
    <div class="stamp-container">${stamp.content}</div>
    <p style="text-align:center;color:#6b7280;font-size:0.75rem">This seal is deterministically generated from the receipt hash. Any modification invalidates it.</p>
  </div>` : ''}

  <div class="summary pass" id="summaryBox" style="display:none">
    <h2 id="summaryTitle"></h2>
    <p id="summaryText"></p>
  </div>

  <div class="offline-note">
    🔒 This verification runs entirely in your browser. No data is sent to any server.<br>
    All cryptographic checks use the Web Crypto API and embedded proof data.<br>
    © ${new Date().getFullYear()} Datacendia, LLC · Apache 2.0 · Self-Contained Evidence Package v1.0
  </div>

  <footer>
    <p>Generated by CendiaEvidence™ · Datacendia Decision Governance Infrastructure</p>
    <p>Package integrity can be verified by comparing file SHA-256 hashes against manifest.json</p>
  </footer>
</div>

<script>
// ============================================================
// OFFLINE VERIFICATION ENGINE
// ------------------------------------------------------------
// Every check below performs real cryptography or reports that it
// could not be performed. Nothing is inferred from the length of
// a string.
//
// Three outcomes, not two:
//   pass    - checked, and correct
//   fail    - checked, and WRONG. Do not rely on this package.
//   unknown - could not be checked here. This is NOT a pass.
// ============================================================

const RECEIPT_HASH      = ${JSON.stringify(receiptHash)};
const RECEIPT_JSON      = ${JSON.stringify(receiptJson)};
const HAS_SIGNATURE     = ${!!dualSig};
const HAS_MERKLE        = ${!!merkle};
const ED25519_SIG       = ${JSON.stringify(dualSig?.ed25519?.signature || '')};
const ED25519_PUB       = ${JSON.stringify(dualSig?.ed25519?.publicKey || '')};
const DILITHIUM_SIG     = ${JSON.stringify(dualSig?.dilithium?.signature || '')};
const MERKLE_ROOT       = ${JSON.stringify(merkle?.root || '')};
const MERKLE_LEAF       = ${JSON.stringify(merkle?.proof?.leaf || null)};
const MERKLE_SIBLINGS   = ${JSON.stringify(merkle?.proof?.siblings || [])};
const MERKLE_LEAF_COUNT = ${merkle?.proof?.treeSize || 0};

function hexToBytes(hex) {
  const clean = String(hex || '').replace(/^0x/, '');
  if (clean.length % 2 !== 0) throw new Error('odd-length hex');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

// SHA-256 over the UTF-8 bytes of a string, returned as hex. This matches the
// server exactly: MerkleForestService hashes the TEXT of its hex strings, not
// the bytes those strings decode to, so the verifier must do the same.
async function sha256HexOfText(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return bytesToHex(new Uint8Array(digest));
}

// Canonical JSON: object keys sorted at EVERY depth. Mirrors
// RegulatorsReceiptService.canonicalize. Note that JSON.stringify's array
// replacer is a key allowlist applied at every level, not a sort - using it
// here would hash every nested object as {} and the receipt hash would not
// cover the decision at all.
function canonicalize(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const out = {};
  for (const key of Object.keys(value).sort()) {
    const c = canonicalize(value[key]);
    if (c !== undefined) out[key] = c;
  }
  return out;
}

function setBadge(id, state, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const cls = state === 'pass' ? 'badge-pass' : state === 'fail' ? 'badge-fail' : 'badge-unknown';
  el.className = 'badge ' + cls;
  el.textContent = text;
}

async function runVerification() {
  let verified = 0, failed = 0, unknown = 0;

  // -------------------------------------------------------------
  // 1. Receipt hash - recompute it and COMPARE.
  //    Mirrors RegulatorsReceiptService.computeReceiptHash: the hash
  //    covers the receipt with receiptHash blanked and signature
  //    removed, serialised with the top-level keys sorted.
  // -------------------------------------------------------------
  try {
    if (!RECEIPT_HASH) {
      setBadge('hashCheck', 'unknown', 'NO HASH IN PACKAGE');
      unknown++;
    } else {
      const receipt = JSON.parse(RECEIPT_JSON);
      const copy = Object.assign({}, receipt);
      // Exclude everything derived from the hash, exactly as the producer does:
      // the signature signs the hash, and the Merkle leaf commits to the hash,
      // so including either would be circular. Keep this in step with
      // RegulatorsReceiptService.computeReceiptHash.
      delete copy.merkleForest;
      copy.cryptographicProof = Object.assign({}, receipt.cryptographicProof, {
        receiptHash: '',
        signature: undefined,
        dualSignature: undefined
      });
      const canonical = JSON.stringify(canonicalize(copy));
      const computed = await sha256HexOfText(canonical);
      if (computed === String(RECEIPT_HASH).replace(/^0x/, '')) {
        setBadge('hashCheck', 'pass', 'MATCHES (' + computed.substring(0, 16) + '...)');
        verified++;
      } else {
        setBadge('hashCheck', 'fail', 'MISMATCH - CONTENT ALTERED');
        failed++;
      }
    }
  } catch (e) {
    setBadge('hashCheck', 'fail', 'ERROR: ' + e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // 2. Ed25519 - real signature verification against the shipped key.
  //    Convention, also stated in VERIFY.md: the signature is over the
  //    UTF-8 bytes of receipt.json exactly as shipped in this package.
  // -------------------------------------------------------------
  try {
    if (!HAS_SIGNATURE || !ED25519_SIG || !ED25519_PUB) {
      setBadge('ed25519Check', 'unknown', 'NOT SIGNED');
      unknown++;
    } else {
      const key = await crypto.subtle.importKey(
        'raw', hexToBytes(ED25519_PUB), { name: 'Ed25519' }, false, ['verify']
      );
      const ok = await crypto.subtle.verify(
        'Ed25519', key, hexToBytes(ED25519_SIG), new TextEncoder().encode(RECEIPT_JSON)
      );
      if (ok) {
        setBadge('ed25519Check', 'pass', 'SIGNATURE VALID');
        verified++;
      } else {
        setBadge('ed25519Check', 'fail', 'SIGNATURE INVALID');
        failed++;
      }
    }
  } catch (e) {
    // Ed25519 is absent from Web Crypto in some older browsers. Being unable to
    // check is not the same as checking and passing.
    setBadge('ed25519Check', 'unknown', 'CANNOT VERIFY HERE (' + e.name + ')');
    unknown++;
  }

  // -------------------------------------------------------------
  // 3. ML-DSA-65 - no browser implements post-quantum verification.
  //    Report that honestly rather than inferring it from a length.
  // -------------------------------------------------------------
  if (HAS_SIGNATURE && DILITHIUM_SIG) {
    setBadge('dilithiumCheck', 'unknown', 'PRESENT - verify with the CLI (VERIFY.md)');
  } else {
    setBadge('dilithiumCheck', 'unknown', 'NOT SIGNED');
  }
  unknown++;

  // -------------------------------------------------------------
  // 4. Merkle inclusion - replay the proof to the root.
  //    Mirrors MerkleForestService.verifyInclusionProof exactly:
  //      leaf = SHA256('leaf:' + index + ':' + receiptId + ':' +
  //                    receiptHash + ':' + timestamp)
  //      node = SHA256('node:' + left + ':' + right)
  //    hashed as TEXT over the hex strings, with those prefixes.
  // -------------------------------------------------------------
  try {
    if (!HAS_MERKLE || !MERKLE_ROOT || !MERKLE_LEAF) {
      setBadge('merkleCheck', 'unknown', 'NO PROOF IN PACKAGE');
      unknown++;
    } else {
      let node = await sha256HexOfText(
        'leaf:' + MERKLE_LEAF.index + ':' + MERKLE_LEAF.receiptId + ':' +
        MERKLE_LEAF.receiptHash + ':' + MERKLE_LEAF.timestamp
      );
      for (const sib of MERKLE_SIBLINGS) {
        node = sib.position === 'left'
          ? await sha256HexOfText('node:' + sib.hash + ':' + node)
          : await sha256HexOfText('node:' + node + ':' + sib.hash);
      }
      if (node === String(MERKLE_ROOT).replace(/^0x/, '')) {
        setBadge('merkleCheck', 'pass', 'INCLUDED in ' + MERKLE_LEAF_COUNT + '-leaf tree');
        verified++;
      } else {
        setBadge('merkleCheck', 'fail', 'PROOF DOES NOT REACH ROOT');
        failed++;
      }
    }
  } catch (e) {
    setBadge('merkleCheck', 'fail', 'ERROR: ' + e.message);
    failed++;
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  const summaryBox   = document.getElementById('summaryBox');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryText  = document.getElementById('summaryText');
  const statusBadge  = document.getElementById('statusBadge');
  summaryBox.style.display = 'block';

  const total = verified + failed + unknown;
  const NOT_COMPLETENESS = ' This establishes that the package has not been altered. ' +
    'It does NOT establish that the underlying record set is complete.';

  if (failed > 0) {
    summaryBox.className = 'summary fail';
    summaryTitle.textContent = 'VERIFICATION FAILED (' + failed + ' of ' + total + ' checks failed)';
    summaryText.textContent = 'At least one cryptographic check did not pass. This package must not be ' +
      'relied upon as evidence. Contact the issuer before acting on it.';
    statusBadge.className = 'badge badge-fail';
    statusBadge.textContent = 'FAILED';
  } else if (verified === 0) {
    summaryBox.className = 'summary warn';
    summaryTitle.textContent = 'NOTHING COULD BE VERIFIED (0 of ' + total + ')';
    summaryText.textContent = 'No cryptographic check could be completed in this browser. This is not a ' +
      'pass. Follow VERIFY.md to check the package from the command line.';
    statusBadge.className = 'badge badge-warn';
    statusBadge.textContent = 'UNVERIFIED';
  } else if (unknown > 0) {
    summaryBox.className = 'summary warn';
    summaryTitle.textContent = 'PARTIALLY VERIFIED (' + verified + ' verified, ' + unknown + ' not checkable here)';
    summaryText.textContent = 'Every check that could run in this browser passed. ' + unknown +
      ' could not be performed here and remain unverified - see VERIFY.md to complete them.' + NOT_COMPLETENESS;
    statusBadge.className = 'badge badge-warn';
    statusBadge.textContent = 'PARTIAL';
  } else {
    summaryBox.className = 'summary pass';
    summaryTitle.textContent = 'ALL CHECKS VERIFIED (' + verified + '/' + total + ')';
    summaryText.textContent = 'Every cryptographic check passed: the receipt hash matches its contents, ' +
      'the Ed25519 signature is valid against the published key, and the Merkle proof reaches the ' +
      'stated root.' + NOT_COMPLETENESS;
    statusBadge.className = 'badge badge-pass';
    statusBadge.textContent = 'VERIFIED';
  }
}

// Run on load
window.addEventListener('DOMContentLoaded', () => setTimeout(runVerification, 500));
</script>
</body>
</html>`;
  }

  // ---------------------------------------------------------------------------
  // INTERNAL
  // ---------------------------------------------------------------------------

  private createFile(filename: string, content: string, contentType: string): EvidencePackageFile {
    return {
      filename,
      content,
      contentType,
      sha256: bytesToHex(sha256(utf8ToBytes(content))),
      size: new TextEncoder().encode(content).length,
    };
  }
}

// Export singleton
export const selfContainedEvidenceService = SelfContainedEvidenceService.getInstance();
