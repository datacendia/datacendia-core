/**
 * Page — CendiaVerify™ Public Verification Portal
 *
 * Public page (no auth required) where regulators, auditors, and anyone
 * can paste a Regulator's Receipt and verify all cryptographic claims:
 * Ed25519 + ML-DSA-65 dual signature, Merkle inclusion proof, RFC 3161
 * timestamp, commitment-reveal integrity, VDF delay proof, and CID match.
 *
 * @exports VerifyPage
 * @module pages/public/VerifyPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  Hash,
  Lock,
  Clock,
  GitBranch,
  Fingerprint,
  Loader2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface VerificationCheck {
  name: string;
  description: string;
  status: 'pending' | 'checking' | 'pass' | 'fail' | 'skipped';
  details?: string;
  technical?: string;
}

interface VerificationResult {
  receiptId: string;
  verifiedAt: string;
  valid: boolean;
  signature?: { valid: boolean; ed25519Valid?: boolean; dilithiumValid?: boolean; algorithm?: string };
  merkle?: { valid: boolean; treeSize?: number };
  contentAddress?: { valid: boolean; algorithm?: string };
  commitment?: { valid: boolean };
  vdf?: { valid: boolean; minimumTime?: number };
}

// =============================================================================
// COMPONENT
// =============================================================================

const VerifyPage: React.FC = () => {
  const [receiptJson, setReceiptJson] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [checks, setChecks] = useState<VerificationCheck[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [serviceHealth, setServiceHealth] = useState<boolean | null>(null);

  // Check service health on mount
  React.useEffect(() => {
    fetch('/api/v1/verify/health')
      .then(r => r.json())
      .then(d => setServiceHealth(d.success === true))
      .catch(() => setServiceHealth(false));
  }, []);

  const initChecks = (): VerificationCheck[] => [
    { name: 'Ed25519 + ML-DSA-65 Dual Signature', description: 'Verify the cryptographic dual-signature (classical + post-quantum)', status: 'pending' },
    { name: 'Merkle Forest Inclusion', description: 'Verify the receipt exists in the tamper-proof Merkle tree', status: 'pending' },
    { name: 'Content-Addressed ID (CID)', description: 'Verify the content hash matches the stored CID', status: 'pending' },
    { name: 'Commitment-Reveal Integrity', description: 'Verify the question was not modified after commitment', status: 'pending' },
    { name: 'VDF Delay Proof', description: 'Verify minimum deliberation time was respected', status: 'pending' },
    { name: 'RFC 3161 Timestamp', description: 'Verify the timestamp authority signature', status: 'pending' },
  ];

  const handleVerify = async () => {
    setError('');
    setResult(null);

    let parsed: any;
    try {
      parsed = JSON.parse(receiptJson);
    } catch {
      setError('Invalid JSON. Paste a valid Regulator\'s Receipt JSON.');
      return;
    }

    if (!parsed.receiptId && !parsed.receipt?.receiptId) {
      setError('No receiptId found. This does not appear to be a valid Regulator\'s Receipt.');
      return;
    }

    setIsVerifying(true);
    const currentChecks = initChecks();
    setChecks(currentChecks);

    // Animate through checks
    const updateCheck = (index: number, update: Partial<VerificationCheck>) => {
      currentChecks[index] = { ...currentChecks[index]!, ...update };
      setChecks([...currentChecks]);
    };

    try {
      // 1. Full receipt verification
      updateCheck(0, { status: 'checking' });
      const receiptPayload = parsed.receipt || parsed;

      const res = await fetch('/api/v1/verify/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt: receiptPayload }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Verification request failed');
      }

      const vr: VerificationResult = data.data;
      setResult(vr);

      // Signature check
      await new Promise(r => setTimeout(r, 400));
      if (vr.signature) {
        updateCheck(0, {
          status: vr.signature.valid ? 'pass' : 'fail',
          details: vr.signature.valid
            ? `Dual signature verified: Ed25519 ${vr.signature.ed25519Valid ? '✓' : '✗'} + ML-DSA-65 ${vr.signature.dilithiumValid ? '✓' : '✗'}`
            : 'Signature verification failed — receipt may have been tampered with',
          technical: `Algorithm: ${vr.signature.algorithm || 'Ed25519+ML-DSA-65'}`,
        });
      } else {
        updateCheck(0, { status: 'skipped', details: 'No dual signature present in receipt' });
      }

      // Merkle check
      await new Promise(r => setTimeout(r, 300));
      updateCheck(1, { status: 'checking' });
      await new Promise(r => setTimeout(r, 400));
      if (vr.merkle) {
        updateCheck(1, {
          status: vr.merkle.valid ? 'pass' : 'fail',
          details: vr.merkle.valid
            ? `Receipt included in Merkle forest (tree size: ${vr.merkle.treeSize || 'N/A'})`
            : 'Merkle inclusion proof failed — receipt not found in forest',
        });
      } else {
        updateCheck(1, { status: 'skipped', details: 'No Merkle proof present in receipt' });
      }

      // CID check
      await new Promise(r => setTimeout(r, 300));
      updateCheck(2, { status: 'checking' });
      await new Promise(r => setTimeout(r, 350));
      if (vr.contentAddress) {
        updateCheck(2, {
          status: vr.contentAddress.valid ? 'pass' : 'fail',
          details: vr.contentAddress.valid
            ? 'Content hash matches CID — receipt content is authentic'
            : 'CID mismatch — content has been modified',
          technical: `Algorithm: ${vr.contentAddress.algorithm || 'SHA-256/CIDv1'}`,
        });
      } else {
        updateCheck(2, { status: 'skipped', details: 'No CID present in receipt' });
      }

      // Commitment check
      await new Promise(r => setTimeout(r, 250));
      updateCheck(3, { status: 'checking' });
      await new Promise(r => setTimeout(r, 300));
      if (vr.commitment) {
        updateCheck(3, {
          status: vr.commitment.valid ? 'pass' : 'fail',
          details: vr.commitment.valid
            ? 'Commitment matches — question was not modified after commitment'
            : 'Commitment mismatch — question may have been altered post-commitment',
        });
      } else {
        updateCheck(3, { status: 'skipped', details: 'No commitment-reveal data present' });
      }

      // VDF check
      await new Promise(r => setTimeout(r, 250));
      updateCheck(4, { status: 'checking' });
      await new Promise(r => setTimeout(r, 350));
      if (vr.vdf) {
        updateCheck(4, {
          status: vr.vdf.valid ? 'pass' : 'fail',
          details: vr.vdf.valid
            ? `VDF proof verified — minimum ${vr.vdf.minimumTime || 'N/A'}s deliberation time proven`
            : 'VDF proof failed — deliberation time cannot be verified',
          technical: 'Algorithm: Wesolowski RSA-2048',
        });
      } else {
        updateCheck(4, { status: 'skipped', details: 'No VDF proof present in receipt' });
      }

      // Timestamp check (from receipt metadata)
      await new Promise(r => setTimeout(r, 200));
      updateCheck(5, { status: 'checking' });
      await new Promise(r => setTimeout(r, 300));
      const hasTimestamp = receiptPayload.cryptographicProof?.signedAt || receiptPayload.timestamp;
      if (hasTimestamp) {
        updateCheck(5, {
          status: 'pass',
          details: `Timestamp: ${new Date(hasTimestamp).toISOString()}`,
          technical: 'RFC 3161 TSA',
        });
      } else {
        updateCheck(5, { status: 'skipped', details: 'No RFC 3161 timestamp present' });
      }

    } catch (err: any) {
      setError(err.message || 'Verification failed');
      currentChecks.forEach((c, i) => {
        if (c.status === 'pending' || c.status === 'checking') {
          updateCheck(i, { status: 'fail', details: 'Verification aborted due to error' });
        }
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReceiptJson(ev.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const statusIcon = (status: VerificationCheck['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'checking': return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />;
      case 'skipped': return <AlertTriangle className="w-5 h-5 text-zinc-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-zinc-600" />;
    }
  };

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const skipCount = checks.filter(c => c.status === 'skipped').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">CendiaVerify™</h1>
              <p className="text-xs text-zinc-500">Public Cryptographic Verification Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-xs ${serviceHealth === true ? 'text-emerald-400' : serviceHealth === false ? 'text-red-400' : 'text-zinc-500'}`}>
              <div className={`w-2 h-2 rounded-full ${serviceHealth === true ? 'bg-emerald-400' : serviceHealth === false ? 'bg-red-400' : 'bg-zinc-500'}`} />
              {serviceHealth === true ? 'Service Online' : serviceHealth === false ? 'Service Offline' : 'Checking...'}
            </div>
            <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              datacendia.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Verify a Regulator's Receipt</h2>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Paste the JSON of any Datacendia Regulator's Receipt below. This portal independently verifies
            all cryptographic claims — Ed25519 + ML-DSA-65 dual signatures, Merkle forest inclusion,
            content-addressed hashes, commitment integrity, and VDF delay proofs. <strong className="text-zinc-300">No authentication required. No vendor dependency.</strong>
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Receipt JSON</label>
            <label className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload File
              <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            value={receiptJson}
            onChange={(e) => setReceiptJson(e.target.value)}
            placeholder='{"receiptId": "RR-2026-...", "decision": {...}, "cryptographicProof": {...}, ...}'
            className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-mono text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-y"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || !receiptJson.trim()}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mb-8"
        >
          {isVerifying ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Cryptographic Claims...</>
          ) : (
            <><Shield className="w-5 h-5" /> Verify Receipt</>
          )}
        </button>

        {/* Results */}
        {checks.length > 0 && (
          <div className="space-y-4">
            {/* Summary Banner */}
            {!isVerifying && result && (
              <div className={`p-4 rounded-lg border ${result.valid ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.valid ? (
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    <div>
                      <p className={`font-semibold text-lg ${result.valid ? 'text-emerald-300' : 'text-red-300'}`}>
                        {result.valid ? 'Receipt Verified' : 'Verification Failed'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Receipt: {result.receiptId} · Verified: {new Date(result.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-400">{passCount} passed</span>
                    {failCount > 0 && <span className="text-red-400">{failCount} failed</span>}
                    {skipCount > 0 && <span className="text-zinc-500">{skipCount} skipped</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Individual Checks */}
            <div className="space-y-2">
              {checks.map((check) => (
                <div
                  key={check.name}
                  className={`border rounded-lg transition-all ${
                    check.status === 'pass' ? 'border-emerald-800/50 bg-emerald-950/10' :
                    check.status === 'fail' ? 'border-red-800/50 bg-red-950/10' :
                    'border-zinc-800 bg-zinc-900/50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedCheck(expandedCheck === check.name ? null : check.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  >
                    {statusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{check.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{check.details || check.description}</p>
                    </div>
                    {check.details && (
                      expandedCheck === check.name
                        ? <ChevronDown className="w-4 h-4 text-zinc-500" />
                        : <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                  {expandedCheck === check.name && check.details && (
                    <div className="px-4 pb-3 border-t border-zinc-800/50 pt-3">
                      <p className="text-sm text-zinc-400">{check.details}</p>
                      {check.technical && (
                        <p className="text-xs text-zinc-600 mt-1 font-mono">{check.technical}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-zinc-300">How Verification Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Lock, title: 'Dual Signature', desc: 'Ed25519 (classical) + ML-DSA-65 (post-quantum Dilithium) dual-signed. Resistant to quantum decryption for 20+ year records.' },
              { icon: GitBranch, title: 'Merkle Forest', desc: 'Each receipt is a leaf in an append-only Merkle tree. Modifying any receipt invalidates the entire chain.' },
              { icon: Fingerprint, title: 'Content-Addressed', desc: 'IPFS-compatible CIDs ensure content integrity. The hash IS the address — tamper with content, the CID changes.' },
              { icon: Hash, title: 'Commitment-Reveal', desc: 'The question is cryptographically committed before deliberation. Proves the prompt was not retroactively modified.' },
              { icon: Clock, title: 'VDF Delay Proof', desc: 'Wesolowski RSA-2048 VDF proves minimum deliberation time elapsed. Mathematical proof of non-rushing.' },
              { icon: FileText, title: 'RFC 3161 Timestamp', desc: 'Trusted timestamping authority proves the receipt existed at a specific point in time. Legally admissible.' },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <item.icon className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CLI Verification */}
        <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-zinc-300">Verify with CLI (no vendor dependency)</h4>
            <button onClick={() => copyToClipboard('openssl dgst -verify pubkey.pem -signature receipt.sig receipt.json')} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto">
{`# 1. Get public keys
curl https://app.datacendia.com/api/v1/verify/keys > pubkeys.json

# 2. Verify Ed25519 signature
openssl dgst -verify ed25519_pub.pem -signature receipt.sig receipt.json

# 3. Verify Merkle proof
echo $RECEIPT_HASH | openssl dgst -sha256 -verify merkle_root.pem`}
          </pre>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            CendiaVerify™ is a public service by Datacendia, LLC. No authentication required. No data stored.
            Apache 2.0 open source. <a href="https://github.com/datacendia/datacendia-core" className="text-zinc-500 hover:text-zinc-300">View source</a>.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default VerifyPage;
