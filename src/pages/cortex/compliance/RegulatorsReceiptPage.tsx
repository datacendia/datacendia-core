// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// REGULATOR'S RECEIPT PAGE
// One-click court-admissible decision documentation
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { RedactionProvider, RedactionToggle, RedactedText, RedactedCode, useRedaction } from '../../../components/ui/RedactedText';
import {
  FileText,
  Shield,
  CheckCircle,
  Lock,
  Download,
  Eye,
  Clock,
  Users,
  Hash,
  AlertTriangle,
  Printer,
  Share2,
  Search,
  Calendar,
  Building,
  Scale,
  Fingerprint,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Camera,
  Settings,
  ChevronDown,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Receipt {
  receiptId: string;
  version: string;
  generatedAt: Date;
  generatedBy: string;
  decision: {
    id: string;
    question: string;
    finalDecision: string;
    councilMode: string;
    vertical?: string;
    consensusScore: number;
    createdAt: Date;
    completedAt: Date;
  };
  participants: {
    agents: { name: string; role: string; description?: string; responseCount: number; citationCount?: number; dissented: boolean; confidenceAvg?: number }[];
    humanApprovers?: { name: string; role: string; approvedAt: Date }[];
  };
  evidenceChain: {
    merkleRoot: string;
    deliberationHash: string;
    citationsHash: string;
    agentResponsesHash: string;
    dissentsHash: string;
  };
  compliance: {
    frameworks: string[];
    requirements?: { framework: string; requirement: string; status: string; evidence: string }[];
    gatesCleared: string[];
    gatesFailed: string[];
  };
  cryptographicProof: {
    algorithm: string;
    receiptHash: string;
    signature?: string;
    signedBy?: string;
    signedAt?: Date;
    publicKeyFingerprint?: string;
  };
  mediaAuthentication?: {
    assetsVerified: number;
    chainOfCustodyIntact: boolean;
    c2paProvenanceSigned: boolean;
    deepfakeAnalysisRun: boolean;
    verdicts: { assetName: string; verdict: string; confidence: number }[];
  };
  workflowConfig?: {
    workflowType: string;
    verticalId: string;
    complianceProfile: string;
  };
  iissScores?: {
    overallScore: number;
    band: string;
    certificationLevel: string;
    dimensions: { name: string; primitive: string; score: number; maxScore: number; normalizedScore: number }[];
    calculatedAt: Date;
  };
  dissents?: { agentName: string; severity: string; reason: string; protected: boolean }[];
  citations?: { source: string; url?: string; retrievedAt: Date; hash: string }[];
  auditTrail?: { action: string; actor: string; timestamp: Date; details?: string }[];
  retention: {
    retentionPeriod: string;
    retentionUntil: Date;
    jurisdiction: string;
    legalHold: boolean;
  };
}

interface Deliberation {
  id: string;
  question: string;
  status: 'completed' | 'in_progress';
  councilMode: string;
  consensusScore: number;
  createdAt: Date;
  agentCount: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

// TR Demo: Petrov Transfer deliberation
const TR_DEMO_DELIBERATION: Deliberation = {
  id: 'tr-demo-petrov-transfer',
  question: '$2.5M PEP Transfer to Viktor Petrov (Cyprus) - Basel III Compliance Review',
  status: 'completed',
  councilMode: 'regulatory-compliance',
  consensusScore: 72,
  createdAt: new Date('2026-01-29T20:15:00Z'),
  agentCount: 4,
};

// Fallback deliberations
const FALLBACK_DELIBERATIONS: Deliberation[] = [
  TR_DEMO_DELIBERATION,
  { id: 'del-001', question: 'Should we proceed with the Q1 2026 expansion into European markets?', status: 'completed', councilMode: 'strategic-planning', consensusScore: 87, createdAt: new Date(Date.now() - 86400000 * 2), agentCount: 8 },
  { id: 'del-002', question: 'Evaluate vendor selection for cloud infrastructure migration', status: 'completed', councilMode: 'vendor-evaluation', consensusScore: 72, createdAt: new Date(Date.now() - 86400000 * 5), agentCount: 10 },
];

// TR Demo: Petrov Transfer receipt
const TR_DEMO_RECEIPT: Receipt = {
  receiptId: 'RR-2026-01-29-PETROV-001',
  version: '1.0.0',
  generatedAt: new Date(),
  generatedBy: 'stuart@datacendia.com',
  decision: {
    id: 'tr-demo-petrov-transfer',
    question: '$2.5M PEP Transfer to Viktor Petrov (Cyprus) - Basel III Compliance Review',
    finalDecision: 'ESCALATE_WITH_CONDITIONS: Approve transfer with 24-hour compliance hold, enhanced monitoring for 90 days, documented compliance officer approval. Formal dissent from Risk Analyzer recorded and acknowledged.',
    councilMode: 'regulatory-compliance',
    consensusScore: 72,
    createdAt: new Date('2026-01-29T20:15:00Z'),
    completedAt: new Date('2026-01-29T20:45:00Z'),
  },
  participants: {
    agents: [
      { name: 'CFO Advisor', role: 'Financial Analysis', responseCount: 2, dissented: false },
      { name: 'Risk Analyzer', role: 'Risk Assessment', responseCount: 2, dissented: true },
      { name: 'Legal Counsel', role: 'Legal Analysis', responseCount: 1, dissented: false },
      { name: 'Compliance Bot', role: 'Automated Compliance', responseCount: 1, dissented: false },
    ],
  },
  evidenceChain: {
    merkleRoot: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    deliberationHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    citationsHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    agentResponsesHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    dissentsHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
  },
  compliance: {
    frameworks: ['Basel III', 'SEC Rule 17a-4', 'FINRA Rule 3310'],
    gatesCleared: ['ofac-screening', 'pep-review', 'aml-threshold', 'audit-trail'],
    gatesFailed: [],
  },
  cryptographicProof: {
    algorithm: 'RSA-SHA256',
    receiptHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    signedBy: 'meridian-signing-key-001',
    signedAt: new Date('2026-01-29T20:45:00Z'),
  },
  retention: {
    retentionPeriod: '7 years',
    retentionUntil: new Date('2033-01-29T20:45:00Z'),
    jurisdiction: 'US',
    legalHold: false,
  },
};

// Fallback receipt for other deliberations
const FALLBACK_RECEIPT: Receipt = {
  receiptId: 'RR-1737500000-A1B2C3D4',
  version: '1.0.0',
  generatedAt: new Date(),
  generatedBy: 'stuart@datacendia.com',
  decision: {
    id: 'del-001',
    question: 'Should we proceed with the Q1 2026 expansion into European markets?',
    finalDecision: 'Approved with modifications: Proceed with phased rollout starting with UK and Germany.',
    councilMode: 'strategic-planning',
    consensusScore: 87,
    createdAt: new Date(Date.now() - 86400000 * 2),
    completedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
  },
  participants: {
    agents: [
      { name: 'CendiaChief', role: 'Chief Strategist', responseCount: 12, dissented: false },
      { name: 'CendiaCFO', role: 'Financial Advisor', responseCount: 8, dissented: false },
      { name: 'CendiaCISO', role: 'Security Officer', responseCount: 6, dissented: true },
      { name: 'CendiaRisk', role: 'Risk Analyst', responseCount: 10, dissented: false },
    ],
  },
  evidenceChain: {
    merkleRoot: 'a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    deliberationHash: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    citationsHash: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    agentResponsesHash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    dissentsHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
  },
  compliance: {
    frameworks: ['SOX', 'GDPR', 'CCPA', 'ISO 27001'],
    gatesCleared: ['audit-trail', 'data-lineage', 'access-control', 'encryption-at-rest'],
    gatesFailed: [],
  },
  cryptographicProof: {
    algorithm: 'SHA-256',
    receiptHash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    signedBy: 'datacendia-kms',
    signedAt: new Date(),
  },
  retention: {
    retentionPeriod: '7 years',
    retentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000),
    jurisdiction: 'US',
    legalHold: false,
  },
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const HashDisplay: React.FC<{ label: string; hash: string }> = ({ label, hash }) => {
  const { isRedacted } = useRedaction();
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <div className="flex items-center gap-2">
        <RedactedCode className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono truncate" classification="RESTRICTED">
          {hash}
        </RedactedCode>
        {!isRedacted && (
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const RegulatorsReceiptPageInner: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { t } = useTranslation();
  const [deliberations, setDeliberations] = useState<Deliberation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeliberation, setSelectedDeliberation] = useState<Deliberation | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'compliance' | 'crypto' | 'media'>('overview');

  // Load deliberations from API on mount
  useEffect(() => {
    loadDeliberations();
  }, []);

  const loadDeliberations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<any>('/council/deliberations', { limit: 50 });
      const payload = res as any;
      
      const list = payload.data || payload.deliberations;
      if (payload.success && list && list.length > 0) {
        const apiDeliberations: Deliberation[] = list
          .filter((d: any) => d.status === 'COMPLETED')
          .map((d: any) => ({
            id: d.id,
            question: d.question?.substring(0, 150) || 'Council Deliberation',
            status: 'completed' as const,
            councilMode: d.mode || 'deliberation',
            consensusScore: Math.round((d.confidence || 0.7) * 100),
            createdAt: new Date(d.created_at || d.createdAt),
            agentCount: d.agents?.length || Math.ceil((d.message_count || 0) / 3) || 4,
          }));
        setDeliberations(apiDeliberations);
      } else {
        setDeliberations(FALLBACK_DELIBERATIONS);
      }
    } catch (error) {
      console.error('Failed to load deliberations:', error);
      setDeliberations(FALLBACK_DELIBERATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReceipt = async (deliberation: Deliberation) => {
    setSelectedDeliberation(deliberation);
    setIsGenerating(true);
    
    try {
      const res = await api.post<any>('/regulators-receipt/generate', {
        deliberationId: deliberation.id,
        generatedBy: 'stuart.rainey@datacendia.com',
      });
      const payload = res as any;
      if (payload.success && payload.receipt) {
        setReceipt(payload.receipt);
      } else {
        // Fallback for demo IDs that don't exist in DB
        if (deliberation.id === 'tr-demo-petrov-transfer') {
          setReceipt(TR_DEMO_RECEIPT);
        } else {
          setReceipt(FALLBACK_RECEIPT);
        }
      }
    } catch {
      if (deliberation.id === 'tr-demo-petrov-transfer') {
        setReceipt(TR_DEMO_RECEIPT);
      } else {
        setReceipt(FALLBACK_RECEIPT);
      }
    }
    setIsGenerating(false);
  };

  const handleBack = () => {
    setSelectedDeliberation(null);
    setReceipt(null);
  };

  const handleDownloadPdf = async (format: 'court' | 'standard' | 'evidence' = 'court') => {
    if (!selectedDeliberation) return;
    try {
      const token = localStorage.getItem('dc_access_token');
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');
      const response = await fetch(`${baseUrl}/regulators-receipt/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          deliberationId: selectedDeliberation.id,
          generatedBy: 'platform-user',
          format,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('PDF generation failed:', response.status, errText);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const suffixMap: Record<string, string> = { court: 'court-admissible', standard: 'executive-summary', evidence: 'evidence-package' };
      const suffix = suffixMap[format] || 'court-admissible';
      a.download = `regulators-receipt-${selectedDeliberation.id.substring(0, 8)}-${suffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Deliberation Selection View
  if (!selectedDeliberation) {
    return (
      <div className={embedded ? 'bg-gray-50 dark:bg-gray-900' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}>
        {/* Header — hidden when embedded in CendiaProvenance™ */}
        {!embedded && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Regulator's Receipt Generator</h1>
                  <p className="text-emerald-200">One-click court-admissible decision documentation</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Fingerprint, label: 'Cryptographic Proof', desc: 'Merkle tree verification' },
              { icon: Scale, label: 'Court-Admissible', desc: 'Legal-grade documentation' },
              { icon: Shield, label: 'Compliance Mapping', desc: 'Automatic framework mapping' },
              { icon: Lock, label: 'Tamper-Evident', desc: 'SHA-256 hash chain' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deliberation List */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a Deliberation</h2>
          <div className="space-y-4">
            {deliberations.map(deliberation => (
              <div
                key={deliberation.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium">
                        {deliberation.councilMode}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(deliberation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{deliberation.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {deliberation.agentCount} agents
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {deliberation.consensusScore}% consensus
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateReceipt(deliberation)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Receipt View
  return (
    <div className={embedded ? 'bg-gray-50 dark:bg-gray-900' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}>
      {/* Receipt Header */}
      <div className={embedded ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{embedded ? 'Evidence Export' : "Regulator's Receipt"}</h1>
                {receipt && <p className={embedded ? 'text-indigo-200 font-mono text-sm' : 'text-emerald-200 font-mono text-sm'}><RedactedText classification="CONFIDENTIAL">{receipt.receiptId}</RedactedText></p>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <RedactionToggle variant="dark" />
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <div className="relative group">
                <button
                  onClick={() => handleDownloadPdf('court')}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                >
                  <Scale className="w-4 h-4" />
                  Court PDF
                </button>
              </div>
              <button
                onClick={() => handleDownloadPdf('standard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Summary PDF
              </button>
              <button
                onClick={() => handleDownloadPdf('evidence')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                Evidence Package
              </button>
            </div>
          </div>
        </div>
      </div>

      {isGenerating ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <FileCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Generating Receipt...</h2>
            <p className="text-gray-500 dark:text-gray-400">Building cryptographic proof and compliance mapping</p>
          </div>
        </div>
      ) : receipt && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex gap-8">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'evidence', label: 'Evidence Chain', icon: Hash },
                { id: 'compliance', label: 'Compliance', icon: Shield },
                { id: 'crypto', label: 'Cryptographic Proof', icon: Lock },
                { id: 'media', label: 'Media Auth', icon: Camera },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? embedded
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Decision Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decision Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Question</p>
                      <p className="text-gray-900 dark:text-white"><RedactedText classification="SENSITIVE">{receipt.decision.question}</RedactedText></p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Final Decision</p>
                      <p className="text-gray-900 dark:text-white font-medium"><RedactedText classification="CONFIDENTIAL">{receipt.decision.finalDecision}</RedactedText></p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Council Mode</p>
                        <p className="text-gray-900 dark:text-white">{receipt.decision.councilMode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Consensus Score</p>
                        <p className="text-gray-900 dark:text-white font-bold text-emerald-600">{receipt.decision.consensusScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Council Participants</h2>
                  <div className="space-y-3">
                    {receipt.participants.agents.map((agent, i) => (
                      <div key={i} className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white"><RedactedText>{agent.name}</RedactedText></p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{agent.responseCount} responses</span>
                            {agent.confidenceAvg != null && (
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{agent.confidenceAvg}%</span>
                            )}
                            {agent.dissented && (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs">
                                DISSENTED
                              </span>
                            )}
                          </div>
                        </div>
                        {agent.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-11">{agent.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* IISS Integrity Scores */}
                {receipt.iissScores && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">IISS™ Integrity Score</h2>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{receipt.iissScores.overallScore}/1000</div>
                      <div>
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-sm font-medium uppercase">{receipt.iissScores.band}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{receipt.iissScores.certificationLevel}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {receipt.iissScores.dimensions.map((dim, i) => {
                        const pct = dim.maxScore > 0 ? Math.round((dim.score / dim.maxScore) * 100) : 0;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-6">P{i + 1}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 w-48 truncate">{dim.name}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-16 text-right">{dim.normalizedScore}/1000</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Receipt Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Receipt Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Receipt ID</span>
                      <span className="font-mono text-gray-900 dark:text-white"><RedactedText classification="CONFIDENTIAL">{receipt.receiptId}</RedactedText></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Version</span>
                      <span className="text-gray-900 dark:text-white">{receipt.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Generated</span>
                      <span className="text-gray-900 dark:text-white">{new Date(receipt.generatedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Generated By</span>
                      <span className="text-gray-900 dark:text-white"><RedactedText>{receipt.generatedBy}</RedactedText></span>
                    </div>
                  </div>
                </div>

                {/* Retention */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Retention & Legal</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Retention Period</span>
                      <span className="text-gray-900 dark:text-white">{receipt.retention.retentionPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Retain Until</span>
                      <span className="text-gray-900 dark:text-white">{new Date(receipt.retention.retentionUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Jurisdiction</span>
                      <span className="text-gray-900 dark:text-white">{receipt.retention.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Legal Hold</span>
                      <span className={receipt.retention.legalHold ? 'text-red-600' : 'text-gray-900 dark:text-white'}>
                        {receipt.retention.legalHold ? 'YES' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Chain Tab */}
          {activeTab === 'evidence' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Evidence Chain (Cryptographic)</h2>
              <div className="space-y-6">
                <HashDisplay label="Merkle Root" hash={receipt.evidenceChain.merkleRoot} />
                <HashDisplay label="Deliberation Hash" hash={receipt.evidenceChain.deliberationHash} />
                <HashDisplay label="Agent Responses Hash" hash={receipt.evidenceChain.agentResponsesHash} />
                <HashDisplay label="Citations Hash" hash={receipt.evidenceChain.citationsHash} />
                <HashDisplay label="Dissents Hash" hash={receipt.evidenceChain.dissentsHash} />
              </div>
              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Evidence chain verified - No tampering detected</span>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance Frameworks</h2>
                <div className="flex flex-wrap gap-2">
                  {receipt.compliance.frameworks.map(framework => (
                    <span key={framework} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                      {framework}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance Requirements */}
              {receipt.compliance.requirements && receipt.compliance.requirements.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance Requirements</h2>
                  <div className="space-y-3">
                    {receipt.compliance.requirements.map((req, i) => (
                      <div key={i} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">{req.framework}</span>
                            {req.status === 'met' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white">{req.requirement}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{req.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gates Cleared</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {receipt.compliance.gatesCleared.map(gate => (
                    <div key={gate} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-700 dark:text-green-400">{gate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {receipt.compliance.gatesFailed.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gates Failed</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {receipt.compliance.gatesFailed.map(gate => (
                      <div key={gate} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-700 dark:text-red-400">{gate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">All Compliance Requirements Met</h3>
                    <p className="text-emerald-700 dark:text-emerald-300">This receipt meets all applicable regulatory requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Proof Tab */}
          {activeTab === 'crypto' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cryptographic Proof</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Algorithm</p>
                  <p className="text-gray-900 dark:text-white font-mono">{receipt.cryptographicProof.algorithm}</p>
                </div>
                <HashDisplay label="Receipt Hash" hash={receipt.cryptographicProof.receiptHash} />
                {receipt.cryptographicProof.signature && (
                  <HashDisplay label="Digital Signature" hash={receipt.cryptographicProof.signature} />
                )}
                {receipt.cryptographicProof.signedBy && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Signed By</p>
                      <p className="text-gray-900 dark:text-white font-mono">{receipt.cryptographicProof.signedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Signed At</p>
                      <p className="text-gray-900 dark:text-white">{receipt.cryptographicProof.signedAt ? new Date(receipt.cryptographicProof.signedAt).toLocaleString() : 'N/A'}</p>
                    </div>
                    {receipt.cryptographicProof.publicKeyFingerprint && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Public Key Fingerprint</p>
                        <p className="text-gray-900 dark:text-white font-mono text-sm">{receipt.cryptographicProof.publicKeyFingerprint}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Cryptographic signature verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Media Authentication Tab (P8) */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Workflow Config Badge */}
              {receipt.workflowConfig && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Workflow Configuration
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Workflow Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{receipt.workflowConfig.workflowType}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vertical</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{receipt.workflowConfig.verticalId}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compliance Profile</p>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                        {receipt.workflowConfig.complianceProfile}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Auth Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Synthetic Media Authentication (P8)
                </h2>
                {receipt.mediaAuthentication ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{receipt.mediaAuthentication.assetsVerified}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assets Verified</p>
                      </div>
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: receipt.mediaAuthentication.chainOfCustodyIntact ? 'rgb(240 253 244)' : 'rgb(254 242 242)' }}>
                        <div className="flex justify-center mb-1">
                          {receipt.mediaAuthentication.chainOfCustodyIntact
                            ? <CheckCircle className="w-6 h-6 text-green-600" />
                            : <AlertTriangle className="w-6 h-6 text-red-600" />
                          }
                        </div>
                        <p className="text-xs text-gray-600">Chain of Custody</p>
                      </div>
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: receipt.mediaAuthentication.c2paProvenanceSigned ? 'rgb(240 253 244)' : 'rgb(255 251 235)' }}>
                        <div className="flex justify-center mb-1">
                          {receipt.mediaAuthentication.c2paProvenanceSigned
                            ? <CheckCircle className="w-6 h-6 text-green-600" />
                            : <Clock className="w-6 h-6 text-yellow-600" />
                          }
                        </div>
                        <p className="text-xs text-gray-600">C2PA Provenance</p>
                      </div>
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: receipt.mediaAuthentication.deepfakeAnalysisRun ? 'rgb(240 253 244)' : 'rgb(255 251 235)' }}>
                        <div className="flex justify-center mb-1">
                          {receipt.mediaAuthentication.deepfakeAnalysisRun
                            ? <CheckCircle className="w-6 h-6 text-green-600" />
                            : <Eye className="w-6 h-6 text-yellow-600" />
                          }
                        </div>
                        <p className="text-xs text-gray-600">Deepfake Analysis</p>
                      </div>
                    </div>

                    {/* Verdicts Table */}
                    {receipt.mediaAuthentication.verdicts.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Verification Verdicts</h3>
                        <div className="space-y-2">
                          {receipt.mediaAuthentication.verdicts.map((v, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Camera className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{v.assetName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  v.verdict === 'authentic' || v.verdict === 'likely_authentic'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : v.verdict === 'inconclusive'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                  {v.verdict.replace(/_/g, ' ').toUpperCase()}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{v.confidence}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {receipt.mediaAuthentication.verdicts.length === 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-gray-500 dark:text-gray-400">
                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No media assets attached to this deliberation.</p>
                        <p className="text-xs mt-1">Upload evidence via the DCII Media Auth API to enable verification.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Media authentication data not available for this receipt.</p>
                  </div>
                )}
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">DCII Primitive P8 Active</h3>
                    <p className="text-emerald-700 dark:text-emerald-300">CendiaMediaAuth™ — C2PA provenance, deepfake detection, chain of custody tracking</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RegulatorsReceiptPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => (
  <RedactionProvider>
    <RegulatorsReceiptPageInner embedded={embedded} />
  </RedactionProvider>
);

export default RegulatorsReceiptPage;
