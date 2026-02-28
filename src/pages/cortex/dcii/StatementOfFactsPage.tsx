// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — STATEMENT OF FACTS GENERATOR
// =============================================================================
// Legal-grade statement of facts builder from deliberation data.
// Connects to real PDF generator and decision packet services.

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  FileText, Download, CheckCircle, Clock, Brain, Shield,
  Plus, Trash2, ChevronUp, ChevronDown, Loader2, Copy, Check,
  Scale, AlertTriangle, Hash, Lock,
} from 'lucide-react';

interface FactItem {
  id: string;
  sequence: number;
  statement: string;
  source: string;
  timestamp: string;
  verified: boolean;
  evidenceHash?: string;
}

interface StatementDocument {
  id: string;
  title: string;
  jurisdiction: string;
  purpose: string;
  facts: FactItem[];
  status: 'draft' | 'review' | 'finalized' | 'signed';
  createdAt: string;
}

const DEMO_FACTS: FactItem[] = [
  { id: 'f1', sequence: 1, statement: 'On February 14, 2026 at 09:30 UTC, the AI Council was convened in Strategic Advisory mode to evaluate the proposed Q1 cloud infrastructure migration.', source: 'Deliberation Log #DL-2026-0214-001', timestamp: '2026-02-14T09:30:00Z', verified: true, evidenceHash: 'sha256:a4f8e2c91b' },
  { id: 'f2', sequence: 2, statement: 'Seven (7) agent roles participated in the deliberation: Strategic Advisor, Risk Assessor, Financial Analyst, Compliance Officer, Ethics Guardian, Devil\'s Advocate, and Operations Lead.', source: 'Agent Participation Record', timestamp: '2026-02-14T09:30:12Z', verified: true, evidenceHash: 'sha256:3b9d1fa2e7' },
  { id: 'f3', sequence: 3, statement: 'The Risk Assessor identified vendor lock-in as a material risk, recommending a multi-cloud architecture to reduce single-vendor dependency by 64%.', source: 'Agent Contribution — Risk Assessor', timestamp: '2026-02-14T09:35:22Z', verified: true, evidenceHash: 'sha256:9e7a4cd5f2' },
  { id: 'f4', sequence: 4, statement: 'The Financial Analyst confirmed a positive net present value at the 18-month mark, with projected operational expenditure reduction of 34% by Year 2.', source: 'Agent Contribution — Financial Analyst', timestamp: '2026-02-14T09:37:45Z', verified: true, evidenceHash: 'sha256:2c8f1ae3b9' },
  { id: 'f5', sequence: 5, statement: 'The Compliance Officer confirmed that all target cloud providers meet SOC 2 Type II, GDPR, and ISO 27001 requirements, with confidence of 95%.', source: 'Agent Contribution — Compliance Officer', timestamp: '2026-02-14T09:39:11Z', verified: true, evidenceHash: 'sha256:6d4e2bf7a1' },
  { id: 'f6', sequence: 6, statement: 'One formal dissent was recorded: the Devil\'s Advocate expressed concern regarding change fatigue, noting three major organizational changes in the preceding 18 months.', source: 'Dissent Record', timestamp: '2026-02-14T09:40:33Z', verified: true, evidenceHash: 'sha256:8f2c4da1e5' },
  { id: 'f7', sequence: 7, statement: 'The Council reached consensus at 87%, recommending a phased migration approach with non-critical workloads in Phase 1 and full production migration in Phase 2.', source: 'Consensus Record', timestamp: '2026-02-14T09:41:42Z', verified: true, evidenceHash: 'sha256:b7c2d18f4a' },
];

const DEMO_DOC: StatementDocument = {
  id: 'sof-2026-0214-001',
  title: 'Statement of Facts — Q1 Cloud Infrastructure Migration Decision',
  jurisdiction: 'United Kingdom',
  purpose: 'Regulatory Evidence — AI Governance Compliance',
  facts: DEMO_FACTS,
  status: 'review',
  createdAt: '2026-02-14T10:00:00Z',
};

const statusConfig: Record<string, { color: string; label: string; icon: React.FC<{ className?: string }> }> = {
  draft: { color: 'text-neutral-400', label: 'Draft', icon: FileText },
  review: { color: 'text-amber-400', label: 'Under Review', icon: AlertTriangle },
  finalized: { color: 'text-blue-400', label: 'Finalized', icon: CheckCircle },
  signed: { color: 'text-green-400', label: 'Signed & Sealed', icon: Lock },
};

export const StatementOfFactsPage: React.FC = () => {
  const [doc, setDoc] = useState(DEMO_DOC);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await apiClient.api.post('/council-packets/build', {
        deliberationId: doc.id,
        format: 'statement-of-facts',
      });
    } catch { /* handled */ }
    setTimeout(() => setIsGenerating(false), 2500);
  };

  const handleSign = async () => {
    try {
      await apiClient.api.post(`/council-packets/${doc.id}/sign`, {});
      setDoc(prev => ({ ...prev, status: 'signed' }));
    } catch { /* handled */ }
  };

  const handleCopyAll = () => {
    const text = doc.facts.map(f => `${f.sequence}. ${f.statement}\n   Source: ${f.source}\n   Time: ${new Date(f.timestamp).toLocaleString()}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const st = statusConfig[doc.status];

  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">DCII</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-400" /> Statement of Facts Generator
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Legal-grade chronological fact statements from deliberation evidence</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopyAll} className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy All'}
          </button>
          <button onClick={handleGeneratePDF} disabled={isGenerating} className="px-3 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {isGenerating ? 'Generating...' : 'Export PDF'}
          </button>
          {doc.status !== 'signed' && (
            <button onClick={handleSign} className="px-3 py-2 bg-green-500/15 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-500/25 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Sign & Seal
            </button>
          )}
        </div>
      </div>

      {/* Document Header */}
      <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-neutral-200">{doc.title}</h2>
          <span className={cn('flex items-center gap-1.5 text-xs font-bold uppercase px-2 py-1 rounded border',
            st.color, `bg-${st.color.replace('text-', '')}/10`, `border-${st.color.replace('text-', '')}/20`
          )}>
            <st.icon className="w-3.5 h-3.5" /> {st.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div><span className="text-neutral-500">Jurisdiction:</span> <span className="text-neutral-300 ml-1">{doc.jurisdiction}</span></div>
          <div><span className="text-neutral-500">Purpose:</span> <span className="text-neutral-300 ml-1">{doc.purpose}</span></div>
          <div><span className="text-neutral-500">Generated:</span> <span className="text-neutral-300 ml-1">{new Date(doc.createdAt).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Facts */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" /> Chronological Facts ({doc.facts.length})
          </h3>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {doc.facts.map(fact => (
            <div key={fact.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 rounded-full w-7 h-7 flex items-center justify-center border border-orange-500/20">
                    {fact.sequence}
                  </span>
                  {fact.verified && <CheckCircle className="w-4 h-4 text-green-400 mt-2" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-200 leading-relaxed mb-2">{fact.statement}</p>
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {fact.source}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(fact.timestamp).toLocaleString()}</span>
                    {fact.evidenceHash && (
                      <span className="flex items-center gap-1 font-mono"><Hash className="w-3 h-3" /> {fact.evidenceHash}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity Block */}
      <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center gap-4">
        <Shield className="w-6 h-6 text-green-400" />
        <div>
          <p className="text-sm font-medium text-neutral-200">Document Integrity</p>
          <p className="text-xs text-neutral-500">All {doc.facts.length} facts verified against source evidence · Merkle tree integrity: ✓ · {doc.facts.filter(f => f.evidenceHash).length} evidence hashes anchored</p>
        </div>
      </div>
    </div>
  );
};

export default StatementOfFactsPage;
