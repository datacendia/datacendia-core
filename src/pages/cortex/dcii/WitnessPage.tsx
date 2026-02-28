// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaWitness™
// =============================================================================
// Independent verification, blockchain anchoring, cryptographic proof generation.

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Eye, Shield, CheckCircle, Clock, Hash, Link2, FileCheck,
  RefreshCw, Download, ExternalLink, AlertTriangle, Lock,
} from 'lucide-react';

interface WitnessRecord {
  id: string;
  type: 'decision' | 'deliberation' | 'evidence' | 'receipt';
  title: string;
  hash: string;
  anchorStatus: 'anchored' | 'pending' | 'failed';
  anchorTx?: string;
  witnessedAt: string;
  verifiedAt?: string;
  merkleRoot: string;
}

const DEMO_RECORDS: WitnessRecord[] = [
  { id: 'w1', type: 'decision', title: 'Q1 Cloud Migration — Final Decision', hash: 'sha256:a4f8e2...c91b', anchorStatus: 'anchored', anchorTx: '0x7f3a...e821', witnessedAt: '2026-02-14T09:30:00Z', verifiedAt: '2026-02-14T09:31:12Z', merkleRoot: 'b7c2d1...8f4a' },
  { id: 'w2', type: 'deliberation', title: 'Vendor Selection Deliberation Record', hash: 'sha256:3b9d1f...a2e7', anchorStatus: 'anchored', anchorTx: '0x1d8c...f442', witnessedAt: '2026-02-13T14:15:00Z', verifiedAt: '2026-02-13T14:16:45Z', merkleRoot: 'e1f3a7...2c9b' },
  { id: 'w3', type: 'receipt', title: "Regulator's Receipt — EU AI Act Compliance", hash: 'sha256:9e7a4c...d5f2', anchorStatus: 'anchored', anchorTx: '0x4a2f...b993', witnessedAt: '2026-02-12T10:20:00Z', verifiedAt: '2026-02-12T10:21:33Z', merkleRoot: 'c8d4f2...a1e6' },
  { id: 'w4', type: 'evidence', title: 'Board Minutes — February 2026', hash: 'sha256:2c8f1a...e3b9', anchorStatus: 'pending', witnessedAt: '2026-02-14T08:00:00Z', merkleRoot: 'f2a1b8...7d3c' },
  { id: 'w5', type: 'decision', title: 'Budget Reallocation — R&D vs Ops', hash: 'sha256:6d4e2b...f7a1', anchorStatus: 'anchored', anchorTx: '0x8b5e...c117', witnessedAt: '2026-02-11T16:45:00Z', verifiedAt: '2026-02-11T16:46:22Z', merkleRoot: 'a9c3e5...4b2f' },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  decision: { label: 'Decision', color: 'text-blue-400 bg-blue-500/10' },
  deliberation: { label: 'Deliberation', color: 'text-purple-400 bg-purple-500/10' },
  evidence: { label: 'Evidence', color: 'text-green-400 bg-green-500/10' },
  receipt: { label: 'Receipt', color: 'text-amber-400 bg-amber-500/10' },
};

export const WitnessPage: React.FC = () => {
  const [records] = useState(DEMO_RECORDS);
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleVerify = async (recordId: string) => {
    setVerifying(recordId);
    try {
      await apiClient.api.post(`/council-packets/${recordId}/verify`, {});
    } catch { /* handled */ }
    setTimeout(() => setVerifying(null), 2000);
  };

  const stats = {
    total: records.length,
    anchored: records.filter(r => r.anchorStatus === 'anchored').length,
    pending: records.filter(r => r.anchorStatus === 'pending').length,
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">DCII</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" /> CendiaWitness™
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Independent verification and blockchain-anchored cryptographic proofs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Witnessed', value: stats.total, icon: Eye, color: 'text-emerald-400' },
          { label: 'Blockchain Anchored', value: stats.anchored, icon: Link2, color: 'text-green-400' },
          { label: 'Pending Anchor', value: stats.pending, icon: Clock, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={cn('w-4 h-4', s.color)} />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-3">
        {records.map(record => {
          const tl = typeLabels[record.type];
          return (
            <div key={record.id} className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', tl.color)}>{tl.label}</span>
                    <h3 className="text-sm font-semibold text-neutral-200">{record.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="font-mono">{record.hash}</span>
                    <span>·</span>
                    <span>{new Date(record.witnessedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {record.anchorStatus === 'anchored' ? (
                    <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-4 h-4" /> Anchored</span>
                  ) : record.anchorStatus === 'pending' ? (
                    <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-4 h-4" /> Pending</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400"><AlertTriangle className="w-4 h-4" /> Failed</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/30">
                <div>
                  <p className="text-[10px] text-neutral-600 mb-0.5">Merkle Root</p>
                  <p className="text-xs font-mono text-neutral-400">{record.merkleRoot}</p>
                </div>
                {record.anchorTx && (
                  <div>
                    <p className="text-[10px] text-neutral-600 mb-0.5">Blockchain Tx</p>
                    <p className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      {record.anchorTx} <ExternalLink className="w-3 h-3 text-blue-400" />
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleVerify(record.id)}
                  disabled={verifying === record.id}
                  className="px-3 py-1.5 text-xs border border-neutral-700 rounded-lg text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
                >
                  {verifying === record.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                  {verifying === record.id ? 'Verifying...' : 'Verify Integrity'}
                </button>
                <button className="px-3 py-1.5 text-xs border border-neutral-700 rounded-lg text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Export Proof
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WitnessPage;
