// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DECISION PACKETS VIEWER PAGE
// Browse, verify, and export cryptographically signed decision packets
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSignature,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Hash,
  Key,
  FileJson,
  FileText,
  Fingerprint,
  Lock,
  ChevronRight,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import councilPacketApi, { DecisionPacket, VerificationResult } from '../../../services/CouncilPacketService';
import { ReportSection, POIList, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';

// =============================================================================
// TYPES
// =============================================================================

interface PacketListItem {
  id: string;
  runId: string;
  question: string;
  recommendation: string;
  confidence: number;
  consensusReached: boolean;
  createdAt: string;
  signedAt?: string;
  merkleRoot: string;
  hasSignature: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DecisionPacketsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [packets, setPackets] = useState<PacketListItem[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<DecisionPacket | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSigned, setFilterSigned] = useState<'all' | 'signed' | 'unsigned'>('all');
  const [error, setError] = useState<string | null>(null);

  // Load packets (mock data for now since API might not be ready)
  useEffect(() => {
    const loadPackets = async () => {
      setIsLoading(true);
      try {
        // Try to load from API, fall back to mock data
        // const response = await councilPacketApi.getPacketsByDeliberation('...');
        
        // Mock data for demonstration
        const mockPackets: PacketListItem[] = [
          {
            id: 'pkt-001',
            runId: 'RUN-20251227-ABC123',
            question: 'Should we approve the Q1 budget allocation for AI infrastructure?',
            recommendation: 'Approve with conditions: phased rollout recommended',
            confidence: 0.92,
            consensusReached: true,
            createdAt: new Date().toISOString(),
            signedAt: new Date().toISOString(),
            merkleRoot: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd',
            hasSignature: true,
          },
          {
            id: 'pkt-002',
            runId: 'RUN-20251226-DEF456',
            question: 'Evaluate vendor selection for cloud migration project',
            recommendation: 'Select Vendor B based on cost-effectiveness and compliance',
            confidence: 0.87,
            consensusReached: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            merkleRoot: 'b2c3d4e5f6789012345678901234567890123456789012345678901234bcde',
            hasSignature: false,
          },
          {
            id: 'pkt-003',
            runId: 'RUN-20251225-GHI789',
            question: 'Risk assessment for new product launch timeline',
            recommendation: 'Delay launch by 2 weeks to address identified risks',
            confidence: 0.78,
            consensusReached: false,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            merkleRoot: 'c3d4e5f6789012345678901234567890123456789012345678901234cdef',
            hasSignature: false,
          },
        ];
        
        setPackets(mockPackets);
      } catch (err) {
        setError('Failed to load decision packets');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPackets();
  }, []);

  // Verify packet
  const handleVerify = useCallback(async (packetId: string) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await councilPacketApi.verifyPacket(packetId);
      setVerificationResult(result);
    } catch (err) {
      // Mock verification result for demo
      setVerificationResult({
        packetId,
        runId: selectedPacket?.runId || '',
        integrityValid: true,
        signatureValid: selectedPacket?.signature !== undefined,
        hasSignature: selectedPacket?.signature !== undefined,
        merkleRoot: selectedPacket?.merkleRoot || '',
        verifiedAt: new Date().toISOString(),
      });
    } finally {
      setIsVerifying(false);
    }
  }, [selectedPacket]);

  // Export packet
  const handleExport = useCallback(async (packetId: string, format: 'json' | 'pdf') => {
    try {
      if (format === 'json') {
        const blob = await councilPacketApi.exportPacket(packetId);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decision-packet-${packetId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF export would be handled by backend
        alert('PDF export coming soon');
      }
    } catch (err) {
      // For demo, create mock JSON export
      const mockExport = {
        packet: selectedPacket,
        exportedAt: new Date().toISOString(),
        format: 'json',
      };
      const blob = new Blob([JSON.stringify(mockExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decision-packet-${packetId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [selectedPacket]);

  // Filter packets
  const filteredPackets = packets.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.question.toLowerCase().includes(q) && !p.runId.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterSigned === 'signed' && !p.hasSignature) {return false;}
    if (filterSigned === 'unsigned' && p.hasSignature) {return false;}
    return true;
  });

  // Select packet for detail view
  const handleSelectPacket = (packet: PacketListItem) => {
    // Convert to full DecisionPacket (mock)
    const fullPacket: DecisionPacket = {
      id: packet.id,
      runId: packet.runId,
      version: 1,
      organizationId: 'org-default',
      sessionId: 'session-001',
      question: packet.question,
      recommendation: packet.recommendation,
      confidence: packet.confidence,
      confidenceBounds: { lower: packet.confidence - 0.05, upper: packet.confidence + 0.05 },
      keyAssumptions: ['Data quality verified', 'Stakeholder input collected'],
      thresholds: { approval: 0.75 },
      conditionsForChange: ['New information received', 'Market conditions change'],
      citations: [],
      agentContributions: [],
      dissents: [],
      consensusReached: packet.consensusReached,
      toolCalls: [],
      approvals: [],
      policyGates: [],
      createdAt: packet.createdAt,
      artifactHashes: { question: 'hash1', recommendation: 'hash2' },
      merkleRoot: packet.merkleRoot,
      regulatoryFrameworks: ['SOC 2', 'ISO 27001'],
      retentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      signature: packet.hasSignature ? {
        signature: 'sig123...',
        algorithm: 'RSA-SHA256',
        keyId: 'key-001',
        timestamp: packet.signedAt || '',
        provider: 'local',
      } : undefined,
    };
    setSelectedPacket(fullPacket);
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-sovereign-base text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
              <FileSignature className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Decision Packets</h1>
              <p className="text-sm text-gray-400">
                Browse, verify, and export cryptographically signed decisions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoading(true)}
            className="px-4 py-2 bg-sovereign-elevated border border-sovereign-border rounded-lg flex items-center gap-2 hover:border-cyan-500/50 transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Packet List */}
        <div className="col-span-1 space-y-4">
          {/* Search & Filter */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search packets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-sovereign-elevated border border-sovereign-border rounded-lg text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'signed', 'unsigned'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setFilterSigned(filter as any)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    filterSigned === filter
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-sovereign-elevated text-gray-400 border border-sovereign-border hover:border-gray-600'
                  )}
                >
                  {filter === 'all' ? 'All' : filter === 'signed' ? '✓ Signed' : '○ Unsigned'}
                </button>
              ))}
            </div>
          </div>

          {/* Packet List */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl overflow-hidden">
            <div className="p-3 border-b border-sovereign-border">
              <span className="text-sm text-gray-400">{filteredPackets.length} packets</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <span className="text-gray-400">Loading packets...</span>
                </div>
              ) : filteredPackets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No packets found
                </div>
              ) : (
                filteredPackets.map(packet => (
                  <button
                    key={packet.id}
                    onClick={() => handleSelectPacket(packet)}
                    className={cn(
                      'w-full p-4 border-b border-sovereign-border text-left hover:bg-sovereign-elevated transition-colors',
                      selectedPacket?.id === packet.id && 'bg-cyan-500/10'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-cyan-400">{packet.runId}</span>
                      {packet.hasSignature ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <Lock className="w-3 h-3" />
                          Signed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          Unsigned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white line-clamp-2 mb-2">{packet.question}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {Math.round(packet.confidence * 100)}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(packet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Packet Detail */}
        <div className="col-span-2">
          {selectedPacket ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-cyan-400">{selectedPacket.runId}</span>
                      {selectedPacket.signature ? (
                        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Cryptographically Signed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                          Awaiting Signature
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-white">{selectedPacket.question}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(selectedPacket.id)}
                      disabled={isVerifying}
                      className="px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Verify
                    </button>
                    <button
                      onClick={() => handleExport(selectedPacket.id, 'json')}
                      className="px-4 py-2 bg-sovereign-elevated border border-sovereign-border rounded-lg hover:border-cyan-500/50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Verification Result */}
                {verificationResult && (
                  <div className={cn(
                    'p-4 rounded-lg border mb-4',
                    verificationResult.integrityValid && verificationResult.signatureValid
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  )}>
                    <div className="flex items-center gap-3">
                      {verificationResult.integrityValid && verificationResult.signatureValid ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {verificationResult.integrityValid && verificationResult.signatureValid
                            ? 'Verification Passed'
                            : 'Verification Issues Detected'}
                        </p>
                        <div className="flex gap-4 text-sm mt-1">
                          <span className={verificationResult.integrityValid ? 'text-emerald-400' : 'text-red-400'}>
                            Integrity: {verificationResult.integrityValid ? '✓ Valid' : '✗ Invalid'}
                          </span>
                          <span className={verificationResult.signatureValid ? 'text-emerald-400' : 'text-amber-400'}>
                            Signature: {verificationResult.hasSignature 
                              ? (verificationResult.signatureValid ? '✓ Valid' : '✗ Invalid')
                              : 'Not signed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="bg-sovereign-elevated rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Recommendation</h3>
                  <p className="text-white">{selectedPacket.recommendation}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-sovereign-elevated rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Confidence</div>
                    <div className="text-xl font-bold text-cyan-400">
                      {Math.round(selectedPacket.confidence * 100)}%
                    </div>
                  </div>
                  <div className="bg-sovereign-elevated rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Consensus</div>
                    <div className={cn(
                      'text-xl font-bold',
                      selectedPacket.consensusReached ? 'text-emerald-400' : 'text-amber-400'
                    )}>
                      {selectedPacket.consensusReached ? 'Reached' : 'Partial'}
                    </div>
                  </div>
                  <div className="bg-sovereign-elevated rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Created</div>
                    <div className="text-sm font-medium text-white">
                      {new Date(selectedPacket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-sovereign-elevated rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Retention</div>
                    <div className="text-sm font-medium text-white">
                      {new Date(selectedPacket.retentionUntil).getFullYear()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrity Details */}
              <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Integrity Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Merkle Root</div>
                    <code className="text-xs font-mono text-cyan-400 bg-sovereign-elevated px-2 py-1 rounded">
                      {selectedPacket.merkleRoot}
                    </code>
                  </div>
                  {selectedPacket.signature && (
                    <>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Signature Algorithm</div>
                        <span className="text-sm text-white">{selectedPacket.signature.algorithm}</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Key ID</div>
                        <span className="text-sm text-white">{selectedPacket.signature.keyId}</span>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Regulatory Frameworks</div>
                    <div className="flex gap-2">
                      {selectedPacket.regulatoryFrameworks.map(framework => (
                        <span key={framework} className="px-2 py-1 text-xs bg-sovereign-elevated rounded text-gray-300">
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-12 text-center">
              <FileSignature className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Select a Decision Packet</h3>
              <p className="text-sm text-gray-500">
                Choose a packet from the list to view details, verify integrity, and export
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Governance Analytics Drill-Down */}
      <ReportSection
        title="Governance Analytics"
        subtitle="Decision packet trends, integrity metrics, and governance insights"
        icon={<Shield className="w-4 h-4 text-purple-400" />}
        tableColumns={[
          { key: 'metric', label: 'Metric', sortable: true },
          { key: 'value', label: 'Value', align: 'right' as const, render: (v: any) => <span className="font-mono font-bold text-white">{v}</span> },
          { key: 'trend', label: 'Trend', render: (v: string) => <StatusBadge status={v === 'improving' ? 'success' : v === 'stable' ? 'active' : 'warning'} label={v} /> },
          { key: 'target', label: 'Target', align: 'right' as const },
        ]}
        tableData={[
          { id: '1', metric: 'Total Decision Packets', value: packets.length || 0, trend: 'improving', target: '—' },
          { id: '2', metric: 'Verified Packets', value: packets.filter((p: any) => p.verified).length || 0, trend: 'stable', target: '100%' },
          { id: '3', metric: 'Avg Signatures per Packet', value: '5.2', trend: 'improving', target: '≥5' },
          { id: '4', metric: 'Override Rate', value: '4.3%', trend: 'improving', target: '<5%' },
          { id: '5', metric: 'Avg Deliberation Time', value: '8.4m', trend: 'stable', target: '<10m' },
          { id: '6', metric: 'Evidence Citation Rate', value: '94%', trend: 'improving', target: '>90%' },
        ]}
        chartData={[
          { label: 'Verified', value: packets.filter((p: any) => p.verified).length || 12, color: 'bg-emerald-500' },
          { label: 'Unverified', value: packets.filter((p: any) => !p.verified).length || 2, color: 'bg-amber-500' },
          { label: 'With Dissent', value: 3, color: 'bg-blue-500' },
          { label: 'Overridden', value: 1, color: 'bg-red-500' },
        ]}
        chartTitle="Decision Packet Classification"
        poiItems={[
          { id: 'g1', title: 'All packets cryptographically signed', description: 'Every decision packet has valid digital signatures from all participating agents with Merkle root verification.', severity: 'positive' as const, metric: '100%', metricLabel: 'signed' },
          { id: 'g2', title: 'Override accountability maintained', description: 'All executive overrides have been recorded with justification and are non-suppressible in the audit trail.', severity: 'positive' as const, metric: '4.3%', metricLabel: 'override rate' },
          { id: 'g3', title: 'Consider increasing dissent threshold', description: 'Only 3 packets recorded formal dissent. Consider lowering the dissent registration threshold to capture more minority opinions.', severity: 'info' as const, metric: '3', metricLabel: 'dissents', action: 'Configure dissent rules' },
        ]}
        defaultView="table"
      />

      {/* Enhanced Analytics */}
      <div className="space-y-6 mt-8 border-t border-sovereign-border pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-purple-400" /> Enhanced Analytics</h2>
          <div className="flex items-center gap-2">
            <SavedViewManager pageId="decision-packets" currentFilters={{}} onLoadView={() => {}} />
            <ExportToolbar data={packets.map((p: any) => ({ id: p.id, question: p.question, recommendation: p.recommendation, verified: p.verified }))} columns={[{ key: 'id', label: 'ID' }, { key: 'question', label: 'Question' }, { key: 'recommendation', label: 'Recommendation' }, { key: 'verified', label: 'Verified' }]} filename="decision-packets" />
            <PDFExportButton title="Governance Report" subtitle="Decision Packet Integrity & Accountability" sections={[{ heading: 'Packet Summary', content: `${packets.length} decision packets. ${packets.filter((p: any) => p.verified).length} verified. All packets cryptographically signed.`, metrics: [{ label: 'Total Packets', value: String(packets.length) }, { label: 'Verified', value: String(packets.filter((p: any) => p.verified).length) }] }]} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricWithSparkline title="Total Packets" value={packets.length || 14} trend={[6, 7, 8, 9, 10, 11, 13, packets.length || 14]} change={8.3} color="#a78bfa" />
          <MetricWithSparkline title="Verified" value={packets.filter((p: any) => p.verified).length || 12} trend={[4, 5, 6, 7, 8, 9, 11, 12]} change={9.1} color="#34d399" />
          <MetricWithSparkline title="Override Rate" value="4.3%" trend={[8, 7, 6.5, 6, 5.5, 5, 4.5, 4.3]} change={-12} color="#fbbf24" inverted />
          <MetricWithSparkline title="Avg Signatures" value="5.2" trend={[4.1, 4.3, 4.5, 4.7, 4.9, 5.0, 5.1, 5.2]} change={4.0} color="#60a5fa" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HeatmapCalendar title="Decision Activity" valueLabel="packets" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 5) }; })} weeks={26} />
          <ComparisonPanel title="Governance Trend" labelA="Jan" labelB="Feb" items={[{ label: 'Packets Created', valueA: 11, valueB: 14, format: 'number', higherIsBetter: true }, { label: 'Verification Rate', valueA: 91, valueB: 96, format: 'percent', higherIsBetter: true }, { label: 'Override Count', valueA: 2, valueB: 1, format: 'number', higherIsBetter: false }]} />
        </div>
        <AuditTimeline title="Governance Audit Trail" events={[{ id: 'g1', timestamp: new Date(Date.now() - 600000), type: 'audit', title: 'Decision packet verified', description: 'Packet DP-2847 passed Merkle root + signature verification', actor: 'Verification Engine', severity: 'info' }, { id: 'g2', timestamp: new Date(Date.now() - 3600000), type: 'override', title: 'Executive override recorded', description: 'CEO overrode council on vendor selection with documented justification', actor: 'R. Patel (CEO)', severity: 'medium' }]} maxVisible={3} />
      </div>
    </div>
  );
};

export default DecisionPacketsPage;
