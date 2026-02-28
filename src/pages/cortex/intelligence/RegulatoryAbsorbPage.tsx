// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - REGULATORY INSTANT-ABSORB PAGE
// Upload any regulation and the Council learns it in seconds
// =============================================================================

import React, { useState, useCallback } from 'react';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// Sample regulatory document content for viewing
const REGULATORY_DOCUMENTS: Record<string, {
  name: string;
  icon: string;
  pages: number;
  time: string;
  lastUpdated: string;
  version: string;
  sections: Array<{
    title: string;
    articles: Array<{ id: string; title: string; content: string; severity?: string }>;
  }>;
}> = {
  'eu-ai-act': {
    name: 'EU AI Act 2024',
    icon: '🇪🇺',
    pages: 892,
    time: '47s',
    lastUpdated: '2024-03-13',
    version: '2024/1689',
    sections: [
      {
        title: 'Title I - General Provisions',
        articles: [
          { id: 'Art. 1', title: 'Subject Matter', content: 'This Regulation lays down harmonised rules on artificial intelligence. It establishes a legal framework for the development, placing on the market and use of AI systems in the Union.' },
          { id: 'Art. 2', title: 'Scope', content: 'This Regulation applies to: (a) providers placing on the market or putting into service AI systems in the Union; (b) deployers of AI systems that have their place of establishment within the Union; (c) providers and deployers of AI systems that have their place of establishment in a third country, where the output produced by the AI system is used in the Union.' },
          { id: 'Art. 3', title: 'Definitions', content: '\'AI system\' means a machine-based system designed to operate with varying levels of autonomy, that may exhibit adaptiveness after deployment and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments.' },
        ],
      },
      {
        title: 'Title II - Prohibited AI Practices',
        articles: [
          { id: 'Art. 5', title: 'Prohibited AI Practices', content: 'The following AI practices shall be prohibited: (a) the placing on the market, the putting into service or the use of an AI system that deploys subliminal techniques beyond a person\'s consciousness or purposefully manipulative or deceptive techniques; (b) the placing on the market, the putting into service or the use of an AI system that exploits vulnerabilities of individuals.', severity: 'critical' },
        ],
      },
      {
        title: 'Title III - High-Risk AI Systems',
        articles: [
          { id: 'Art. 6', title: 'Classification Rules', content: 'An AI system shall be considered high-risk where it is intended to be used as a safety component of a product, or the AI system is itself a product, covered by the Union harmonisation legislation listed in Annex I.', severity: 'high' },
          { id: 'Art. 9', title: 'Risk Management System', content: 'A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems. The risk management system shall be a continuous iterative process planned and run throughout the entire lifecycle of a high-risk AI system.', severity: 'high' },
          { id: 'Art. 10', title: 'Data and Data Governance', content: 'High-risk AI systems which make use of techniques involving the training of AI models with data shall be developed on the basis of training, validation and testing data sets that meet quality criteria.', severity: 'high' },
        ],
      },
    ],
  },
  'hipaa': {
    name: 'HIPAA Guidelines',
    icon: '🏥',
    pages: 234,
    time: '18s',
    lastUpdated: '2023-12-01',
    version: '45 CFR Parts 160, 162, 164',
    sections: [
      {
        title: 'Privacy Rule',
        articles: [
          { id: '§164.502', title: 'Uses and Disclosures', content: 'A covered entity or business associate may not use or disclose protected health information, except as permitted or required by this subpart or by subpart C of part 160 of this subchapter.', severity: 'critical' },
          { id: '§164.508', title: 'Authorization Requirements', content: 'Except as otherwise permitted or required by this subchapter, a covered entity may not use or disclose protected health information without an authorization that is valid under this section.' },
          { id: '§164.520', title: 'Notice of Privacy Practices', content: 'A covered entity must provide a notice that is written in plain language and that contains the elements required by this paragraph.' },
        ],
      },
      {
        title: 'Security Rule',
        articles: [
          { id: '§164.308', title: 'Administrative Safeguards', content: 'A covered entity or business associate must implement policies and procedures to prevent, detect, contain, and correct security violations.', severity: 'high' },
          { id: '§164.310', title: 'Physical Safeguards', content: 'A covered entity or business associate must implement policies and procedures to limit physical access to its electronic information systems and the facility or facilities in which they are housed.' },
          { id: '§164.312', title: 'Technical Safeguards', content: 'A covered entity or business associate must implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.', severity: 'high' },
        ],
      },
    ],
  },
  'sox': {
    name: 'SOX Compliance',
    icon: '🔒',
    pages: 156,
    time: '12s',
    lastUpdated: '2023-06-15',
    version: 'Sarbanes-Oxley Act of 2002',
    sections: [
      {
        title: 'Title III - Corporate Responsibility',
        articles: [
          { id: 'Sec. 302', title: 'Corporate Responsibility for Financial Reports', content: 'The signing officers have reviewed the report; the report does not contain any untrue statement of a material fact or omit to state a material fact necessary to make the statements made not misleading.', severity: 'critical' },
          { id: 'Sec. 303', title: 'Improper Influence on Audits', content: 'It shall be unlawful for any officer or director of an issuer to take any action to fraudulently influence, coerce, manipulate, or mislead any independent public or certified accountant.', severity: 'critical' },
        ],
      },
      {
        title: 'Title IV - Enhanced Financial Disclosures',
        articles: [
          { id: 'Sec. 404', title: 'Management Assessment of Internal Controls', content: 'Each annual report shall contain an internal control report which shall state the responsibility of management for establishing and maintaining an adequate internal control structure and procedures for financial reporting.', severity: 'high' },
          { id: 'Sec. 409', title: 'Real Time Issuer Disclosures', content: 'Each issuer reporting under section 13(a) or 15(d) shall disclose to the public on a rapid and current basis such additional information concerning material changes in the financial condition or operations of the issuer.', severity: 'high' },
        ],
      },
    ],
  },
  'gdpr': {
    name: 'GDPR Requirements',
    icon: '🔒',
    pages: 88,
    time: '8s',
    lastUpdated: '2024-01-10',
    version: 'Regulation (EU) 2016/679',
    sections: [
      {
        title: 'Chapter II - Principles',
        articles: [
          { id: 'Art. 5', title: 'Principles Relating to Processing', content: 'Personal data shall be: (a) processed lawfully, fairly and in a transparent manner; (b) collected for specified, explicit and legitimate purposes; (c) adequate, relevant and limited to what is necessary; (d) accurate and kept up to date; (e) kept in a form which permits identification for no longer than necessary; (f) processed in a manner that ensures appropriate security.', severity: 'critical' },
          { id: 'Art. 6', title: 'Lawfulness of Processing', content: 'Processing shall be lawful only if and to the extent that at least one of the following applies: (a) the data subject has given consent; (b) processing is necessary for the performance of a contract; (c) processing is necessary for compliance with a legal obligation.' },
        ],
      },
      {
        title: 'Chapter III - Rights of the Data Subject',
        articles: [
          { id: 'Art. 15', title: 'Right of Access', content: 'The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data concerning him or her are being processed, and, where that is the case, access to the personal data.', severity: 'high' },
          { id: 'Art. 17', title: 'Right to Erasure', content: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data without undue delay.', severity: 'high' },
          { id: 'Art. 20', title: 'Right to Data Portability', content: 'The data subject shall have the right to receive the personal data concerning him or her, which he or she has provided to a controller, in a structured, commonly used and machine-readable format.' },
        ],
      },
    ],
  },
  'internal': {
    name: 'Internal Policies',
    icon: '📋',
    pages: 45,
    time: '4s',
    lastUpdated: '2024-12-01',
    version: 'v2024.12',
    sections: [
      {
        title: 'Data Governance',
        articles: [
          { id: 'DG-001', title: 'Data Classification', content: 'All data must be classified according to sensitivity levels: Public, Internal, Confidential, and Restricted. Classification determines handling requirements, access controls, and retention periods.' },
          { id: 'DG-002', title: 'Data Retention', content: 'Data shall be retained for the minimum period required by law or business need. Financial records: 7 years. HR records: Duration of employment + 7 years. Customer data: Duration of relationship + 3 years.' },
        ],
      },
      {
        title: 'AI Ethics',
        articles: [
          { id: 'AI-001', title: 'Fairness and Non-Discrimination', content: 'AI systems must be designed and tested to minimize bias and discrimination. Regular audits must be conducted to assess fairness across protected characteristics.', severity: 'high' },
          { id: 'AI-002', title: 'Transparency and Explainability', content: 'AI-assisted decisions affecting individuals must be explainable. Users must be informed when interacting with AI systems.' },
          { id: 'AI-003', title: 'Human Oversight', content: 'High-stakes AI decisions require human review. Escalation paths must be defined for AI recommendations that exceed risk thresholds.', severity: 'high' },
        ],
      },
    ],
  },
};

interface AbsorptionResult {
  id: string;
  documentName: string;
  processingTime: number;
  summary: {
    totalPages: number;
    totalWords: number;
    requirementsExtracted: number;
    triggersIdentified: number;
    processesAffected: number;
    agentsUpdated: number;
    constraintsCreated: number;
    penalties: { violation: string; maxPenalty: string }[];
  };
  extractedRequirements: { title: string; category: string; severity: string }[];
  agentUpdates: { agentName: string; knowledgeAdded: string[]; updateStatus: string }[];
}

export const RegulatoryAbsorbPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AbsorptionResult | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('paste');
  
  // Document viewer state
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionTitle)) {
        next.delete(sectionTitle);
      } else {
        next.add(sectionTitle);
      }
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const absorbDocument = async () => {
    if (!textContent.trim() && !file) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + deterministicFloat('regulatoryabsorb-1') * 15, 95));
    }, 500);

    try {
      let content = textContent;

      if (file) {
        content = await file.text();
      }

      const res = await api.post<any>('/premium/regulatory/absorb', {
        document: {
          filename: file?.name || 'pasted-document.txt',
          mimeType: file?.type || 'text/plain',
          size: content.length,
          content,
        },
        tier: 'enterprise',
      });

      clearInterval(progressInterval);
      setProgress(100);

      const payload = res as any;
      if (payload.success && payload.result) {
        setResult(payload.result as AbsorptionResult);
      }
    } catch (err) {
      console.error('Absorption failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📜</span>
          <h1 className="text-3xl font-bold text-neutral-900">Regulatory Instant-Absorb</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Drop in any regulation. The Council knows it in 60 seconds.
        </p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputMode('paste')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm',
                    inputMode === 'paste'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setInputMode('file')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm',
                    inputMode === 'file'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  Upload File
                </button>
              </div>

              {inputMode === 'paste' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Paste Regulatory Text
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste the regulatory document content here..."
                    className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    {textContent.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center',
                    'transition-colors cursor-pointer',
                    file
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-neutral-300 hover:border-neutral-400'
                  )}
                >
                  {file ? (
                    <div>
                      <div className="text-4xl mb-2">📄</div>
                      <div className="font-medium text-neutral-900">{file.name}</div>
                      <div className="text-sm text-neutral-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="mt-3 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📤</div>
                      <div className="font-medium text-neutral-900">Drop your document here</div>
                      <div className="text-sm text-neutral-500 mt-1">or click to browse</div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.txt,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={absorbDocument}
                disabled={isProcessing || (!textContent.trim() && !file)}
                className={cn(
                  'w-full mt-6 py-3 px-4 rounded-lg font-medium text-white',
                  'bg-gradient-to-r from-teal-500 to-emerald-500',
                  'hover:from-teal-600 hover:to-emerald-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all shadow-sm hover:shadow-md'
                )}
              >
                {isProcessing ? 'Absorbing...' : '📜 Absorb Regulation'}
              </button>

              {isProcessing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example Documents */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Supported Document Types</h3>
            <p className="text-sm text-neutral-500 mb-4">Click to view document contents</p>
            <div className="space-y-3">
              {[
                { id: 'eu-ai-act', icon: '🇪🇺', name: 'EU AI Act 2024', pages: 892, time: '47s' },
                { id: 'hipaa', icon: '🏥', name: 'HIPAA Guidelines', pages: 234, time: '18s' },
                { id: 'sox', icon: '🔒', name: 'SOX Compliance', pages: 156, time: '12s' },
                { id: 'gdpr', icon: '🔒', name: 'GDPR Requirements', pages: 88, time: '8s' },
                { id: 'internal', icon: '📋', name: 'Internal Policies', pages: 45, time: '4s' },
              ].map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocument(doc.id);
                    setExpandedSections(new Set());
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <div>
                      <div className="font-medium text-neutral-900">{doc.name}</div>
                      <div className="text-sm text-neutral-500">{doc.pages} pages</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-teal-600 font-medium">{doc.time}</div>
                    <span className="text-neutral-400">→</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-medium text-teal-800 mb-2">🧠 What Happens</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Extracts regulatory requirements</li>
                <li>• Identifies compliance triggers</li>
                <li>• Maps to company processes</li>
                <li>• Updates all Council agents</li>
                <li>• Creates decision constraints</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Header */}
          <div className="bg-teal-50 rounded-xl border border-teal-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-800">
                    {result.documentName} Absorbed
                  </h2>
                  <p className="text-teal-600">
                    Processed in {result.processingTime.toFixed(1)} seconds
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setTextContent('');
                  setFile(null);
                }}
                className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Absorb Another
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-teal-600">
                {result.summary.requirementsExtracted}
              </div>
              <div className="text-sm text-neutral-500">Requirements</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {result.summary.triggersIdentified}
              </div>
              <div className="text-sm text-neutral-500">Triggers</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {result.summary.processesAffected}
              </div>
              <div className="text-sm text-neutral-500">Processes</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {result.summary.agentsUpdated}
              </div>
              <div className="text-sm text-neutral-500">Agents Updated</div>
            </div>
          </div>

          {/* Agent Updates */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              🧠 The Council Now Knows
            </h3>
            <div className="space-y-3">
              {result.agentUpdates.map((update, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">{update.agentName}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {update.updateStatus}
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {update.knowledgeAdded.slice(0, 3).map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Extracted Requirements ({result.extractedRequirements.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {result.extractedRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-neutral-900">{req.title}</span>
                    <span className="ml-2 text-xs text-neutral-500 uppercase">{req.category}</span>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      getSeverityColor(req.severity)
                    )}
                  >
                    {req.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Penalties */}
          {result.summary.penalties.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                ⚠️ Penalties for Non-Compliance
              </h3>
              <div className="space-y-2">
                {result.summary.penalties.map((penalty, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-red-100">
                    <span className="font-mono text-red-700">{penalty.maxPenalty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-teal-100 rounded-xl border border-teal-200 text-center">
            <p className="text-teal-800 font-medium">
              ✅ All future deliberations will incorporate these regulatory constraints
            </p>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && REGULATORY_DOCUMENTS[selectedDocument] && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{REGULATORY_DOCUMENTS[selectedDocument].icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {REGULATORY_DOCUMENTS[selectedDocument].name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                      <span>Version: {REGULATORY_DOCUMENTS[selectedDocument].version}</span>
                      <span>•</span>
                      <span>{REGULATORY_DOCUMENTS[selectedDocument].pages} pages</span>
                      <span>•</span>
                      <span>Updated: {REGULATORY_DOCUMENTS[selectedDocument].lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-neutral-400 hover:text-neutral-600">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {REGULATORY_DOCUMENTS[selectedDocument].sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
                    >
                      <span className="font-semibold text-neutral-900">{section.title}</span>
                      <span className="text-neutral-400 text-xl">
                        {expandedSections.has(section.title) ? '−' : '+'}
                      </span>
                    </button>
                    
                    {expandedSections.has(section.title) && (
                      <div className="p-4 space-y-4 bg-white">
                        {section.articles.map((article, articleIdx) => (
                          <div
                            key={articleIdx}
                            className={cn(
                              'p-4 rounded-lg border',
                              article.severity === 'critical'
                                ? 'bg-red-50 border-red-200'
                                : article.severity === 'high'
                                  ? 'bg-orange-50 border-orange-200'
                                  : 'bg-neutral-50 border-neutral-200'
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-mono text-sm text-teal-600 mr-2">
                                  {article.id}
                                </span>
                                <span className="font-semibold text-neutral-900">
                                  {article.title}
                                </span>
                              </div>
                              {article.severity && (
                                <span
                                  className={cn(
                                    'px-2 py-1 rounded text-xs font-medium',
                                    article.severity === 'critical'
                                      ? 'bg-red-100 text-red-700'
                                      : article.severity === 'high'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-neutral-100 text-neutral-700'
                                  )}
                                >
                                  {article.severity.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-700 text-sm leading-relaxed">
                              {article.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Expand All / Collapse All */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    const allSections = REGULATORY_DOCUMENTS[selectedDocument].sections.map(s => s.title);
                    setExpandedSections(new Set(allSections));
                  }}
                  className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedSections(new Set())}
                  className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-600 font-medium"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                💡 Click "Absorb Regulation" to have the Council learn from this document
              </div>
              <button
                onClick={() => {
                  // Pre-fill the text area with a sample from the document
                  const doc = REGULATORY_DOCUMENTS[selectedDocument];
                  const sampleText = doc.sections
                    .flatMap(s => s.articles.map(a => `${a.id} - ${a.title}\n${a.content}`))
                    .join('\n\n');
                  setTextContent(sampleText);
                  setSelectedDocument(null);
                  setInputMode('paste');
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Load into Absorber →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryAbsorbPage;
