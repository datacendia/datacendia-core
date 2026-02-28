// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CendiaTruth™
// =============================================================================
// Claim verification interface, fact validation, trusted source library.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Search, Clock,
  FileText, ExternalLink, Brain, Loader2, ThumbsUp, ThumbsDown,
} from 'lucide-react';

interface VerificationResult {
  id: string;
  claim: string;
  verdict: 'verified' | 'disputed' | 'unverifiable' | 'partially-true';
  confidence: number;
  sources: { name: string; url?: string; reliability: number }[];
  explanation: string;
  verifiedAt: string;
}

const DEMO_RESULTS: VerificationResult[] = [
  { id: 'v1', claim: 'Our SOC 2 Type II audit was completed with zero findings', verdict: 'verified', confidence: 98, sources: [{ name: 'Deloitte Audit Report 2025', reliability: 99 }, { name: 'Internal compliance dashboard', reliability: 95 }], explanation: 'Confirmed via signed audit report dated November 2025. Zero material findings documented.', verifiedAt: '2026-02-14T10:00:00Z' },
  { id: 'v2', claim: 'Customer churn rate decreased 15% quarter-over-quarter', verdict: 'partially-true', confidence: 74, sources: [{ name: 'Salesforce CRM analytics', reliability: 92 }, { name: 'Finance quarterly report', reliability: 88 }], explanation: 'Churn rate decreased 12.3%, not 15%. The 15% figure includes trial accounts which skew the metric.', verifiedAt: '2026-02-13T14:00:00Z' },
  { id: 'v3', claim: 'All vendor contracts include GDPR compliance clauses', verdict: 'disputed', confidence: 85, sources: [{ name: 'Contract management system', reliability: 94 }, { name: 'Legal review logs', reliability: 90 }], explanation: '3 of 47 active vendor contracts (pre-2024) lack explicit GDPR clauses. Remediation in progress.', verifiedAt: '2026-02-12T09:00:00Z' },
  { id: 'v4', claim: 'Average deliberation time is under 10 minutes', verdict: 'verified', confidence: 96, sources: [{ name: 'Council Analytics', reliability: 97 }, { name: 'Deliberation logs', reliability: 99 }], explanation: 'Average deliberation time is 9.2 minutes across 142 deliberations in the past 90 days.', verifiedAt: '2026-02-11T16:00:00Z' },
];

const verdictConfig: Record<string, { icon: React.FC<{ className?: string }>; color: string; bg: string; label: string }> = {
  verified: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Verified' },
  disputed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Disputed' },
  unverifiable: { icon: AlertTriangle, color: 'text-neutral-400', bg: 'bg-neutral-500/10 border-neutral-500/20', label: 'Unverifiable' },
  'partially-true': { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Partially True' },
};

export const TruthPage: React.FC = () => {
  const [results] = useState(DEMO_RESULTS);
  const [claimInput, setClaimInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!claimInput.trim()) {return;}
    setIsVerifying(true);
    try {
      await apiClient.api.post('/decision-intel/verify-claim', { claim: claimInput });
    } catch { /* handled */ }
    setTimeout(() => setIsVerifying(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs text-slate-400">DCII</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-400" /> CendiaTruth™
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">Claim verification — validate statements against evidence and trusted sources</p>
      </div>

      {/* Verify Input */}
      <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Verify a Claim</h3>
        <div className="flex gap-3">
          <input type="text" value={claimInput} onChange={e => setClaimInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="Enter a claim to verify against evidence..."
            className="flex-1 px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-sky-500/50" />
          <button onClick={handleVerify} disabled={isVerifying || !claimInput.trim()}
            className={cn('px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border',
              claimInput.trim() && !isVerifying ? 'bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25' : 'bg-neutral-800 text-neutral-600 border-neutral-700 cursor-not-allowed')}>
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Verification Results */}
      <div className="space-y-4">
        {results.map(result => {
          const vc = verdictConfig[result.verdict];
          return (
            <div key={result.id} className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-200 font-medium mb-2">"{result.claim}"</p>
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold uppercase px-2 py-1 rounded border', vc.bg, vc.color)}>
                      <vc.icon className="w-3.5 h-3.5" /> {vc.label}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className={cn('text-lg font-bold', result.confidence >= 85 ? 'text-green-400' : result.confidence >= 60 ? 'text-amber-400' : 'text-red-400')}>
                      {result.confidence}%
                    </p>
                    <p className="text-[10px] text-neutral-600">confidence</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-800/30 border border-neutral-700/30 mb-3">
                  <p className="text-xs text-neutral-300">{result.explanation}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-neutral-500">Sources:</span>
                  {result.sources.map((src, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {src.name}
                      <span className={cn('ml-1 font-bold', src.reliability >= 90 ? 'text-green-400' : 'text-amber-400')}>{src.reliability}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TruthPage;
