/**
 * Page — CendiaEscrow™ Shamir Share Management
 *
 * UI for managing cryptographic decision escrow — creating sealed
 * decisions with AES-256-GCM encryption, distributing Shamir SSS
 * shares to stakeholders, and managing VDF time-locks.
 *
 * @exports EscrowManagementPage
 * @module pages/cortex/crypto/EscrowManagementPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceInfoDropdown } from '../../../components/ui/ServiceInfoDropdown';
import { escrowInfo } from '../../../config/serviceInfo';
import {
  Lock,
  Unlock,
  Key,
  Users,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Download,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Loader2,
  FileText,
  Hash,
  Share2,
  Eye,
  EyeOff,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface EscrowedDecision {
  id: string;
  deliberationId: string;
  question: string;
  status: 'sealed' | 'partial' | 'released' | 'expired';
  threshold: number;
  totalShares: number;
  sharesCollected: number;
  shareholders: Shareholder[];
  timeLock?: { expiresAt: string; vdfIterations: number };
  sealedAt: string;
  releasedAt?: string;
  encryptionAlgorithm: string;
}

interface Shareholder {
  id: string;
  name: string;
  role: string;
  email: string;
  shareDistributed: boolean;
  shareSubmitted: boolean;
  distributedAt?: string;
  submittedAt?: string;
}

interface NewEscrowForm {
  deliberationId: string;
  threshold: number;
  shareholders: { name: string; role: string; email: string }[];
  timeLockHours: number;
  enableTimeLock: boolean;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_ESCROWS: EscrowedDecision[] = [
  {
    id: 'esc-001',
    deliberationId: 'del-petrov-transfer',
    question: '$2.5M PEP Transfer to Viktor Petrov — Basel III Compliance Review',
    status: 'sealed',
    threshold: 3,
    totalShares: 5,
    sharesCollected: 0,
    shareholders: [
      { id: 's1', name: 'Sarah Chen', role: 'Chief Compliance Officer', email: 'sarah@company.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-13T10:00:00Z' },
      { id: 's2', name: 'James Morrison', role: 'General Counsel', email: 'james@company.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-13T10:00:00Z' },
      { id: 's3', name: 'Maria Rodriguez', role: 'CFO', email: 'maria@company.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-13T10:00:00Z' },
      { id: 's4', name: 'David Kim', role: 'CISO', email: 'david@company.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-13T10:00:00Z' },
      { id: 's5', name: 'External Auditor', role: 'Independent Auditor', email: 'auditor@kpmg.com', shareDistributed: false, shareSubmitted: false },
    ],
    timeLock: { expiresAt: '2026-03-14T10:00:00Z', vdfIterations: 1000000 },
    sealedAt: '2026-03-13T09:45:00Z',
    encryptionAlgorithm: 'AES-256-GCM + Shamir SSS (GF(p))',
  },
  {
    id: 'esc-002',
    deliberationId: 'del-acquisition',
    question: 'DataTech Solutions Acquisition — Board Confidential',
    status: 'partial',
    threshold: 2,
    totalShares: 3,
    sharesCollected: 1,
    shareholders: [
      { id: 's1', name: 'CEO', role: 'Chief Executive', email: 'ceo@company.com', shareDistributed: true, shareSubmitted: true, distributedAt: '2026-03-10T14:00:00Z', submittedAt: '2026-03-12T09:00:00Z' },
      { id: 's2', name: 'Board Chair', role: 'Board of Directors', email: 'chair@company.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-10T14:00:00Z' },
      { id: 's3', name: 'Lead Investor', role: 'Series A Lead', email: 'investor@vc.com', shareDistributed: true, shareSubmitted: false, distributedAt: '2026-03-10T14:00:00Z' },
    ],
    sealedAt: '2026-03-10T13:30:00Z',
    encryptionAlgorithm: 'AES-256-GCM + Shamir SSS (GF(p))',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const EscrowManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [escrows] = useState<EscrowedDecision[]>(MOCK_ESCROWS);
  const [selectedEscrow, setSelectedEscrow] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shareInput, setShareInput] = useState('');
  const [showShareInput, setShowShareInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New escrow form state
  const [newForm, setNewForm] = useState<NewEscrowForm>({
    deliberationId: '',
    threshold: 3,
    shareholders: [
      { name: '', role: '', email: '' },
      { name: '', role: '', email: '' },
      { name: '', role: '', email: '' },
    ],
    timeLockHours: 24,
    enableTimeLock: true,
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'sealed': return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1"><Lock className="w-3 h-3" /> SEALED</span>;
      case 'partial': return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center gap-1"><Key className="w-3 h-3" /> PARTIAL</span>;
      case 'released': return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1"><Unlock className="w-3 h-3" /> RELEASED</span>;
      case 'expired': return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 flex items-center gap-1"><Clock className="w-3 h-3" /> EXPIRED</span>;
      default: return null;
    }
  };

  const handleCreateEscrow = async () => {
    setIsProcessing(true);
    // In production: POST /api/v1/escrow/create
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setShowCreateForm(false);
  };

  const handleSubmitShare = async () => {
    if (!shareInput.trim()) return;
    setIsProcessing(true);
    // In production: POST /api/v1/escrow/:id/submit-share
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setShareInput('');
    setShowShareInput(false);
  };

  const addShareholder = () => {
    setNewForm({
      ...newForm,
      shareholders: [...newForm.shareholders, { name: '', role: '', email: '' }],
    });
  };

  const removeShareholder = (index: number) => {
    const updated = [...newForm.shareholders];
    updated.splice(index, 1);
    setNewForm({ ...newForm, shareholders: updated });
  };

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
              CENDIAESCROW<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Cryptographic decision escrow with Shamir Secret Sharing and VDF time-locks</p>
          <ServiceInfoDropdown config={escrowInfo} className="mt-2" />
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Seal New Decision
        </button>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { icon: Lock, title: 'Encrypt', desc: 'Decision encrypted with AES-256-GCM', color: 'text-amber-400' },
          { icon: Share2, title: 'Split Key', desc: 'Encryption key split via Shamir SSS (M-of-N)', color: 'text-blue-400' },
          { icon: Users, title: 'Distribute', desc: 'Shares sent to designated stakeholders', color: 'text-purple-400' },
          { icon: Unlock, title: 'Release', desc: 'M shareholders combine to unlock decision', color: 'text-emerald-400' },
        ].map((step, i) => (
          <div key={step.title} className="flex items-start gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="p-1.5 bg-zinc-800 rounded-lg flex-shrink-0">
              <step.icon className={`w-4 h-4 ${step.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-300">{i + 1}. {step.title}</p>
              <p className="text-[10px] text-zinc-500">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-zinc-900 border border-amber-800/50 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" /> Seal a Decision
          </h2>

          {/* Deliberation ID */}
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Deliberation ID</label>
            <input
              value={newForm.deliberationId}
              onChange={(e) => setNewForm({ ...newForm, deliberationId: e.target.value })}
              placeholder="del-xxx-xxx"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Threshold (M required)</label>
              <input
                type="number"
                min={2}
                max={newForm.shareholders.length}
                value={newForm.threshold}
                onChange={(e) => setNewForm({ ...newForm, threshold: parseInt(e.target.value) || 2 })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[10px] text-zinc-600 mt-1">{newForm.threshold} of {newForm.shareholders.length} shareholders needed</p>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newForm.enableTimeLock}
                  onChange={(e) => setNewForm({ ...newForm, enableTimeLock: e.target.checked })}
                  className="rounded"
                />
                VDF Time-Lock (hours)
              </label>
              <input
                type="number"
                min={1}
                max={720}
                value={newForm.timeLockHours}
                onChange={(e) => setNewForm({ ...newForm, timeLockHours: parseInt(e.target.value) || 24 })}
                disabled={!newForm.enableTimeLock}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Shareholders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-400">Shareholders (N total)</label>
              <button onClick={addShareholder} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Shareholder
              </button>
            </div>
            <div className="space-y-2">
              {newForm.shareholders.map((sh, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 w-6">#{i + 1}</span>
                  <input
                    placeholder="Name"
                    value={sh.name}
                    onChange={(e) => {
                      const updated = [...newForm.shareholders];
                      updated[i] = { ...updated[i]!, name: e.target.value };
                      setNewForm({ ...newForm, shareholders: updated });
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    placeholder="Role"
                    value={sh.role}
                    onChange={(e) => {
                      const updated = [...newForm.shareholders];
                      updated[i] = { ...updated[i]!, role: e.target.value };
                      setNewForm({ ...newForm, shareholders: updated });
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    placeholder="Email"
                    value={sh.email}
                    onChange={(e) => {
                      const updated = [...newForm.shareholders];
                      updated[i] = { ...updated[i]!, email: e.target.value };
                      setNewForm({ ...newForm, shareholders: updated });
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {newForm.shareholders.length > 2 && (
                    <button onClick={() => removeShareholder(i)} className="text-zinc-600 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCreateEscrow}
              disabled={isProcessing || !newForm.deliberationId}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isProcessing ? 'Sealing...' : 'Seal Decision'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Tech Note */}
          <p className="text-[10px] text-zinc-600 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Encryption: AES-256-GCM · Key splitting: Shamir SSS over GF(p) with Lagrange interpolation · Time-lock: Wesolowski VDF (RSA-2048)
          </p>
        </div>
      )}

      {/* Escrow List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-200">Escrowed Decisions</h2>
        {escrows.map((esc) => (
          <div key={esc.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setSelectedEscrow(selectedEscrow === esc.id ? null : esc.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{esc.question}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> {esc.sharesCollected}/{esc.threshold} of {esc.totalShares}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(esc.sealedAt).toLocaleDateString()}</span>
                  {esc.timeLock && <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3" /> {getTimeRemaining(esc.timeLock.expiresAt)}</span>}
                </div>
              </div>
              {statusBadge(esc.status)}
              {selectedEscrow === esc.id ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
            </button>

            {selectedEscrow === esc.id && (
              <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>Share Collection Progress</span>
                    <span>{esc.sharesCollected} / {esc.threshold} required ({esc.totalShares} total)</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${esc.sharesCollected >= esc.threshold ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${(esc.sharesCollected / esc.threshold) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Shareholders */}
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-2">Shareholders</p>
                  <div className="space-y-1.5">
                    {esc.shareholders.map((sh) => (
                      <div key={sh.id} className="flex items-center gap-3 text-xs">
                        <div className={`w-2 h-2 rounded-full ${sh.shareSubmitted ? 'bg-emerald-500' : sh.shareDistributed ? 'bg-amber-500' : 'bg-zinc-600'}`} />
                        <span className="text-zinc-300 flex-1">{sh.name}</span>
                        <span className="text-zinc-500">{sh.role}</span>
                        <span className={`${sh.shareSubmitted ? 'text-emerald-400' : sh.shareDistributed ? 'text-amber-400' : 'text-zinc-600'}`}>
                          {sh.shareSubmitted ? 'Submitted' : sh.shareDistributed ? 'Pending' : 'Not Distributed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Share */}
                {esc.status !== 'released' && (
                  <div>
                    {showShareInput ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={shareInput}
                          onChange={(e) => setShareInput(e.target.value)}
                          placeholder="Paste your Shamir share here..."
                          type="password"
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          onClick={handleSubmitShare}
                          disabled={isProcessing || !shareInput.trim()}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                          Submit
                        </button>
                        <button onClick={() => setShowShareInput(false)} className="text-zinc-500 hover:text-zinc-300 text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowShareInput(true)}
                        className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300"
                      >
                        <Key className="w-3.5 h-3.5" /> Submit Your Share
                      </button>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-600 flex items-center gap-4">
                  <span>ID: {esc.id}</span>
                  <span>Encryption: {esc.encryptionAlgorithm}</span>
                  <span>Sealed: {new Date(esc.sealedAt).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EscrowManagementPage;
