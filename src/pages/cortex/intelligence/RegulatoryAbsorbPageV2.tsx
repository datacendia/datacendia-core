// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - REGULATORY INSTANT-ABSORB V2 PAGE
// Enterprise-grade compliance ingestion with provenance, verification, and review
// =============================================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface DocumentMetadata {
  name: string;
  jurisdiction?: string;
  regulationType?: string;
  effectiveDate?: string;
}

interface RequirementV2 {
  id: string;
  title: string;
  description: string;
  originalText: string;
  originalTextHash: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  verificationScore: number;
  verificationMethod: string;
  isVerified: boolean;
  deadline?: string;
  penaltyAmount?: number;
  penaltyCurrency?: string;
  penaltyDescription?: string;
  affectedProcesses: string[];
  affectedAgents: string[];
}

interface ConflictV2 {
  id: string;
  document1Id: string;
  document2Id: string;
  conflictType: 'DIRECT' | 'POTENTIAL' | 'SUPERSEDED';
  description: string;
  requirement1Summary?: string;
  requirement2Summary?: string;
  aiRecommendation?: string;
  confidenceScore?: number;
  resolutionStatus: string;
}

interface VerificationReport {
  overallScore: number;
  verifiedRequirements: number;
  unverifiedRequirements: number;
  exactMatches: number;
  fuzzyMatches: number;
  noMatches: number;
  hallucinationRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface AbsorptionResultV2 {
  id: string;
  documentName: string;
  contentHash: string;
  uploadedAt: string;
  processingTime: number;
  status: string;
  reviewStatus: string;
  version: number;
  detectedLanguage?: string;
  requirements: RequirementV2[];
  triggers: any[];
  constraints: any[];
  conflicts: ConflictV2[];
  summary: {
    totalPages: number;
    totalWords: number;
    processingTime: number;
    requirementsExtracted: number;
    triggersIdentified: number;
    constraintsCreated: number;
    conflictsDetected: number;
    verificationScore: number;
    hallucinationRisk: 'low' | 'medium' | 'high';
    penalties: any[];
  };
  verificationReport: VerificationReport;
}

// =============================================================================
// SEVERITY COLORS
// =============================================================================

const severityColors: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  INFO: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

const riskColors: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RegulatoryAbsorbPageV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'conflicts'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AbsorptionResultV2 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    name: '',
    jurisdiction: '',
    regulationType: '',
    effectiveDate: '',
  });
  const [resultTab, setResultTab] = useState<'summary' | 'requirements' | 'verification' | 'conflicts' | 'provenance'>('summary');

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!metadata.name) {
        setMetadata(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  }, [metadata.name]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!metadata.name) {
        setMetadata(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  }, [metadata.name]);

  // Upload and absorb document
  const handleAbsorb = async () => {
    if (!selectedFile || !metadata.name) {
      setError('Please select a file and provide a name');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Read file as base64
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch('/api/v1/premium/regulatory/v2/absorb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 'demo',
          userId: 'demo-user',
          tier: 'enterprise',
          document: {
            filename: selectedFile.name,
            mimeType: selectedFile.type,
            size: selectedFile.size,
            content,
          },
          metadata: {
            name: metadata.name,
            jurisdiction: metadata.jurisdiction || undefined,
            regulationType: metadata.regulationType || undefined,
            effectiveDate: metadata.effectiveDate ? new Date(metadata.effectiveDate) : undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Absorption failed');
      }

      setResult(data.result);
      setResultTab('summary');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Approve document
  const handleApprove = async () => {
    if (!result) {return;}

    try {
      const response = await fetch(`/api/v1/premium/regulatory/v2/documents/${result.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user' }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(prev => prev ? { ...prev, reviewStatus: 'APPROVED' } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
    }
  };

  // Reject document
  const handleReject = async () => {
    if (!result) {return;}

    const reason = prompt('Enter rejection reason:');
    if (!reason) {return;}

    try {
      const response = await fetch(`/api/v1/premium/regulatory/v2/documents/${result.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', reason }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(prev => prev ? { ...prev, reviewStatus: 'REJECTED' } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejection failed');
    }
  };

  return (
    <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📜</span>
            <h1 className="text-2xl font-bold text-white">Regulatory Instant-Absorb V2</h1>
            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">Enterprise</span>
          </div>
          <p className="text-neutral-400">
            Upload any regulation. The Council learns it in 60 seconds. With cryptographic provenance and anti-hallucination verification.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upload', 'documents', 'conflicts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              )}
            >
              {tab === 'upload' && '📤 Upload'}
              {tab === 'documents' && '📋 Documents'}
              {tab === 'conflicts' && '⚠️ Conflicts'}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form */}
            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Upload Regulation</h2>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                  selectedFile
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-neutral-600 hover:border-neutral-500'
                )}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div>
                    <span className="text-3xl">✅</span>
                    <p className="text-green-400 mt-2">{selectedFile.name}</p>
                    <p className="text-neutral-500 text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl">📄</span>
                    <p className="text-neutral-400 mt-2">Drop a regulation file here</p>
                    <p className="text-neutral-500 text-sm">PDF, DOCX, TXT, or MD</p>
                  </div>
                )}
              </div>

              {/* Metadata Form */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Regulation Name *</label>
                  <input
                    type="text"
                    value={metadata.name}
                    onChange={e => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., GDPR, SOX, HIPAA"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Jurisdiction</label>
                    <select
                      value={metadata.jurisdiction}
                      onChange={e => setMetadata(prev => ({ ...prev, jurisdiction: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select...</option>
                      <option value="US">United States</option>
                      <option value="EU">European Union</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="GLOBAL">Global</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Type</label>
                    <select
                      value={metadata.regulationType}
                      onChange={e => setMetadata(prev => ({ ...prev, regulationType: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select...</option>
                      <option value="privacy">Privacy / Data Protection</option>
                      <option value="financial">Financial / Banking</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="security">Security / Cybersecurity</option>
                      <option value="environmental">Environmental</option>
                      <option value="employment">Employment / Labor</option>
                      <option value="industry">Industry-Specific</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={metadata.effectiveDate}
                    onChange={e => setMetadata(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAbsorb}
                disabled={isProcessing || !selectedFile || !metadata.name}
                className={cn(
                  'mt-6 w-full py-3 rounded-lg font-medium transition-colors',
                  isProcessing || !selectedFile || !metadata.name
                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    : 'bg-amber-500 text-black hover:bg-amber-400'
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  '🚀 Absorb Regulation'
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
              {!result ? (
                <div className="h-full flex items-center justify-center text-neutral-500">
                  <div className="text-center">
                    <span className="text-4xl">📊</span>
                    <p className="mt-2">Results will appear here</p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Result Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{result.documentName}</h2>
                      <p className="text-sm text-neutral-400">
                        Version {result.version} • {result.detectedLanguage?.toUpperCase() || 'EN'}
                      </p>
                    </div>
                    <div className={cn(
                      'px-3 py-1 rounded-full text-sm',
                      result.reviewStatus === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                      result.reviewStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {result.reviewStatus}
                    </div>
                  </div>

                  {/* Result Tabs */}
                  <div className="flex gap-1 mb-4 overflow-x-auto">
                    {(['summary', 'requirements', 'verification', 'conflicts', 'provenance'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setResultTab(tab)}
                        className={cn(
                          'px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap',
                          resultTab === tab
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                        )}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Summary Tab */}
                  {resultTab === 'summary' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-900/50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-white">{result.summary.requirementsExtracted}</p>
                          <p className="text-xs text-neutral-400">Requirements</p>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-white">{result.summary.constraintsCreated}</p>
                          <p className="text-xs text-neutral-400">Constraints</p>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3">
                          <p className={cn('text-2xl font-bold', riskColors[result.summary.hallucinationRisk])}>
                            {(result.summary.verificationScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-neutral-400">Verification Score</p>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3">
                          <p className={cn('text-2xl font-bold', result.summary.conflictsDetected > 0 ? 'text-yellow-400' : 'text-green-400')}>
                            {result.summary.conflictsDetected}
                          </p>
                          <p className="text-xs text-neutral-400">Conflicts</p>
                        </div>
                      </div>

                      {/* Hallucination Risk */}
                      <div className={cn(
                        'p-3 rounded-lg border',
                        result.summary.hallucinationRisk === 'low' ? 'bg-green-500/10 border-green-500/30' :
                        result.summary.hallucinationRisk === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        'bg-red-500/10 border-red-500/30'
                      )}>
                        <p className={cn('text-sm font-medium', riskColors[result.summary.hallucinationRisk])}>
                          {result.summary.hallucinationRisk === 'low' && '✅ Low Hallucination Risk'}
                          {result.summary.hallucinationRisk === 'medium' && '⚠️ Medium Hallucination Risk'}
                          {result.summary.hallucinationRisk === 'high' && '🚨 High Hallucination Risk'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {result.verificationReport.verifiedRequirements} of {result.requirements.length} requirements verified against source
                        </p>
                      </div>

                      {/* Review Actions */}
                      {result.reviewStatus === 'DRAFT' && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleApprove}
                            className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={handleReject}
                            className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Requirements Tab */}
                  {resultTab === 'requirements' && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {result.requirements.map(req => (
                        <div key={req.id} className="bg-neutral-900/50 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn('px-2 py-0.5 text-xs rounded border', severityColors[req.severity])}>
                                  {req.severity}
                                </span>
                                {req.isVerified ? (
                                  <span className="text-xs text-green-400">✓ Verified</span>
                                ) : (
                                  <span className="text-xs text-yellow-400">⚠ Unverified</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-white">{req.title}</p>
                              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{req.description}</p>
                            </div>
                            <div className="text-right">
                              <p className={cn('text-lg font-bold', req.verificationScore >= 0.7 ? 'text-green-400' : 'text-yellow-400')}>
                                {(req.verificationScore * 100).toFixed(0)}%
                              </p>
                              <p className="text-xs text-neutral-500">{req.verificationMethod}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Verification Tab */}
                  {resultTab === 'verification' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-500/10 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-400">{result.verificationReport.exactMatches}</p>
                          <p className="text-xs text-neutral-400">Exact Matches</p>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-yellow-400">{result.verificationReport.fuzzyMatches}</p>
                          <p className="text-xs text-neutral-400">Fuzzy Matches</p>
                        </div>
                        <div className="bg-red-500/10 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-red-400">{result.verificationReport.noMatches}</p>
                          <p className="text-xs text-neutral-400">No Match</p>
                        </div>
                      </div>

                      <div className="bg-neutral-900/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-white mb-2">Recommendations</h3>
                        <ul className="space-y-2">
                          {result.verificationReport.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-neutral-400 flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Conflicts Tab */}
                  {resultTab === 'conflicts' && (
                    <div className="space-y-3">
                      {result.conflicts.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500">
                          <span className="text-3xl">✅</span>
                          <p className="mt-2">No conflicts detected</p>
                        </div>
                      ) : (
                        result.conflicts.map(conflict => (
                          <div key={conflict.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                                {conflict.conflictType}
                              </span>
                              {conflict.confidenceScore && (
                                <span className="text-xs text-neutral-400">
                                  {(conflict.confidenceScore * 100).toFixed(0)}% confidence
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white">{conflict.description}</p>
                            {conflict.aiRecommendation && (
                              <p className="text-xs text-neutral-400 mt-2">
                                <strong>AI Recommendation:</strong> {conflict.aiRecommendation}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Provenance Tab */}
                  {resultTab === 'provenance' && (
                    <div className="space-y-4">
                      <div className="bg-neutral-900/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-white mb-3">Document Provenance</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Content Hash (SHA-256)</span>
                            <span className="text-amber-400 font-mono text-xs">{result.contentHash.substring(0, 16)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Uploaded At</span>
                            <span className="text-white">{new Date(result.uploadedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Processing Time</span>
                            <span className="text-white">{result.processingTime.toFixed(2)}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Version</span>
                            <span className="text-white">{result.version}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-500 text-center">
                        All changes are logged to a tamper-evident audit trail with hash-chained entries.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
            <p className="text-neutral-400 text-center py-8">
              Document list will be loaded from the API. Use the Upload tab to absorb new regulations.
            </p>
          </div>
        )}

        {/* Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
            <p className="text-neutral-400 text-center py-8">
              Conflicts between regulations will be shown here after multiple documents are absorbed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatoryAbsorbPageV2;
