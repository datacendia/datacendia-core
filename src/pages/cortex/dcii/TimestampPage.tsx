// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaTimestamp™
// =============================================================================
// RFC 3161 timestamp manager, multi-authority verification, blockchain anchor tracker.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Clock, Shield, CheckCircle, AlertTriangle, Hash, Link2,
  RefreshCw, Download, Plus, Server, FileCheck, ExternalLink,
} from 'lucide-react';

interface TimestampRecord {
  id: string;
  documentTitle: string;
  hash: string;
  rfc3161Token: string;
  tsaAuthority: string;
  timestamp: string;
  verified: boolean;
  blockchainAnchor?: string;
}

const DEMO_TIMESTAMPS: TimestampRecord[] = [
  { id: 'ts1', documentTitle: 'Decision Packet — Q1 Cloud Migration', hash: 'sha256:a4f8...c91b', rfc3161Token: 'MIIGhg...', tsaAuthority: 'DigiCert TSA', timestamp: '2026-02-14T09:31:00Z', verified: true, blockchainAnchor: '0x7f3a...e821' },
  { id: 'ts2', documentTitle: "Regulator's Receipt — SOC 2 Compliance", hash: 'sha256:3b9d...a2e7', rfc3161Token: 'MIIFxw...', tsaAuthority: 'GlobalSign TSA', timestamp: '2026-02-13T14:16:00Z', verified: true, blockchainAnchor: '0x1d8c...f442' },
  { id: 'ts3', documentTitle: 'Deliberation Record — Budget Review', hash: 'sha256:9e7a...d5f2', rfc3161Token: 'MIIG2Q...', tsaAuthority: 'Comodo TSA', timestamp: '2026-02-12T10:21:00Z', verified: true },
  { id: 'ts4', documentTitle: 'Evidence Bundle — Board Minutes Feb 2026', hash: 'sha256:2c8f...e3b9', rfc3161Token: 'Pending...', tsaAuthority: 'DigiCert TSA', timestamp: '2026-02-14T08:01:00Z', verified: false },
  { id: 'ts5', documentTitle: 'Audit Trail Export — January 2026', hash: 'sha256:6d4e...f7a1', rfc3161Token: 'MIIHkA...', tsaAuthority: 'GlobalSign TSA', timestamp: '2026-02-01T00:00:00Z', verified: true, blockchainAnchor: '0x8b5e...c117' },
];

export const TimestampPage: React.FC = () => {
  const [records] = useState(DEMO_TIMESTAMPS);
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setVerifying(id);
    try { await apiClient.api.post(`/kms/verify`, { documentId: id }); } catch { /* handled */ }
    setTimeout(() => setVerifying(null), 2000);
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
            <Clock className="w-5 h-5 text-cyan-400" /> CendiaTimestamp™
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">RFC 3161 compliant timestamps — multi-authority verification with blockchain anchoring</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Timestamps', value: records.length, icon: Clock, color: 'text-cyan-400' },
          { label: 'Verified', value: records.filter(r => r.verified).length, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Blockchain Anchored', value: records.filter(r => r.blockchainAnchor).length, icon: Link2, color: 'text-purple-400' },
          { label: 'TSA Authorities', value: 3, icon: Server, color: 'text-blue-400' },
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

      {/* Timestamp Records */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" /> Timestamp Records
          </h3>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {records.map(rec => (
            <div key={rec.id} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-200 mb-1">{rec.documentTitle}</h4>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="font-mono">{rec.hash}</span>
                    <span>·</span>
                    <span>{rec.tsaAuthority}</span>
                    <span>·</span>
                    <span>{new Date(rec.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                {rec.verified ? (
                  <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-4 h-4" /> Verified</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-400"><AlertTriangle className="w-4 h-4" /> Pending</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {rec.blockchainAnchor && (
                  <span className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    <Link2 className="w-3 h-3" /> {rec.blockchainAnchor}
                  </span>
                )}
                <button onClick={() => handleVerify(rec.id)} disabled={verifying === rec.id}
                  className="text-[10px] px-2 py-0.5 border border-neutral-700 rounded text-neutral-400 hover:text-neutral-200 flex items-center gap-1">
                  {verifying === rec.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                  {verifying === rec.id ? 'Verifying...' : 'Re-verify'}
                </button>
                <button className="text-[10px] px-2 py-0.5 border border-neutral-700 rounded text-neutral-400 hover:text-neutral-200 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export Token
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimestampPage;
