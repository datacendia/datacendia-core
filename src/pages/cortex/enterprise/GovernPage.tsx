// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GOVERN™ - LEGAL-GRADE POLICY & AUDIT MAPPING
// Real-Time Regulatory Compliance Engine
// "Your AI Compliance Officer That Never Sleeps"
//
// CAPABILITIES:
// - Real-time law & regulation parsing
// - Policy-to-procedure mapping
// - Missing control identification
// - Automated audit evidence generation
// - Board packet generation
// - Regulatory impact simulation
// - Multi-framework compliance (SOX, GDPR, HIPAA, SOC2, FedRAMP, etc.)
// =============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ComplianceFramework =
  | 'sox'
  | 'gdpr'
  | 'hipaa'
  | 'soc2'
  | 'fedramp'
  | 'pci-dss'
  | 'iso27001'
  | 'ccpa'
  | 'nist'
  | 'dora';
type ControlStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable' | 'under-review';
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type EvidenceType =
  | 'policy'
  | 'procedure'
  | 'screenshot'
  | 'log'
  | 'attestation'
  | 'report'
  | 'audit-trail';

interface Regulation {
  id: string;
  name: string;
  shortName: string;
  jurisdiction: string;
  effectiveDate: Date;
  lastUpdated: Date;
  version: string;
  totalRequirements: number;
  applicableRequirements: number;
  sections: RegulationSection[];
}

interface RegulationSection {
  id: string;
  code: string;
  title: string;
  description: string;
  requirements: Requirement[];
}

interface Requirement {
  id: string;
  code: string;
  text: string;
  controls: string[];
  riskLevel: RiskLevel;
  status: ControlStatus;
  lastAssessed: Date;
  evidenceCount: number;
}

interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  framework: ComplianceFramework;
  category: string;
  status: ControlStatus;
  owner: string;
  department: string;
  lastTested: Date;
  nextTest: Date;
  testFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
  riskRating: RiskLevel;
  mappedRequirements: string[];
  evidence: Evidence[];
  findings: Finding[];
}

interface Evidence {
  id: string;
  type: EvidenceType;
  name: string;
  description: string;
  collectedAt: Date;
  collectedBy: string;
  source: string;
  isAutomated: boolean;
  validUntil: Date;
  status: 'valid' | 'expired' | 'pending-review';
}

interface Finding {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  status: 'open' | 'in-progress' | 'remediated' | 'accepted';
  identifiedAt: Date;
  dueDate: Date;
  owner: string;
  remediationPlan: string;
}

interface PolicyDocument {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'retired';
  owner: string;
  department: string;
  lastReviewed: Date;
  nextReview: Date;
  mappedControls: string[];
  mappedRegulations: string[];
  approvers: string[];
  effectiveDate: Date;
}

interface AuditProject {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'regulatory';
  framework: ComplianceFramework;
  status: 'planning' | 'fieldwork' | 'reporting' | 'complete';
  startDate: Date;
  endDate: Date;
  auditor: string;
  controlsInScope: number;
  controlsTested: number;
  findingsCount: number;
  criticalFindings: number;
}

interface BoardPacket {
  id: string;
  name: string;
  period: string;
  generatedAt: Date;
  status: 'draft' | 'review' | 'approved' | 'published';
  sections: {
    name: string;
    status: 'complete' | 'pending' | 'needs-update';
  }[];
  approvers: { name: string; approved: boolean; approvedAt?: Date }[];
}

interface ComplianceMetrics {
  overallScore: number;
  frameworkScores: Record<ComplianceFramework, number>;
  controlsTotal: number;
  controlsCompliant: number;
  controlsPartial: number;
  controlsNonCompliant: number;
  openFindings: number;
  criticalFindings: number;
  overdueRemediations: number;
  upcomingAudits: number;
  policiesExpiringSoon: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const FRAMEWORK_CONFIG: Record<ComplianceFramework, { icon: string; name: string; color: string }> =
  {
    sox: { icon: '📊', name: 'SOX', color: 'from-blue-600 to-indigo-600' },
    gdpr: { icon: '🇪🇺', name: 'GDPR', color: 'from-purple-600 to-violet-600' },
    hipaa: { icon: '🏥', name: 'HIPAA', color: 'from-red-600 to-rose-600' },
    soc2: { icon: '🔐', name: 'SOC 2', color: 'from-green-600 to-emerald-600' },
    fedramp: { icon: '🏛️', name: 'FedRAMP', color: 'from-slate-600 to-gray-600' },
    'pci-dss': { icon: '💳', name: 'PCI-DSS', color: 'from-amber-600 to-orange-600' },
    iso27001: { icon: '🌐', name: 'ISO 27001', color: 'from-cyan-600 to-blue-600' },
    ccpa: { icon: '🐻', name: 'CCPA', color: 'from-yellow-600 to-amber-600' },
    nist: { icon: '🇺🇸', name: 'NIST CSF', color: 'from-red-600 to-blue-600' },
    dora: { icon: '🏦', name: 'DORA', color: 'from-teal-600 to-cyan-600' },
  };

const generateControls = (): Control[] => [
  {
    id: 'ctrl-001',
    code: 'AC-1',
    name: 'Access Control Policy',
    description: 'Documented access control policy with defined roles and responsibilities',
    framework: 'soc2',
    category: 'Access Control',
    status: 'compliant',
    owner: 'CISO',
    department: 'Security',
    lastTested: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    nextTest: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    testFrequency: 'quarterly',
    automationLevel: 'semi-automated',
    riskRating: 'high',
    mappedRequirements: ['SOX 404', 'SOC2 CC6.1', 'ISO 27001 A.9'],
    evidence: [
      {
        id: 'ev-001',
        type: 'policy',
        name: 'Access Control Policy v3.2',
        description: 'Current policy document',
        collectedAt: new Date(),
        collectedBy: 'System',
        source: 'SharePoint',
        isAutomated: true,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
      {
        id: 'ev-002',
        type: 'screenshot',
        name: 'RBAC Configuration',
        description: 'Okta RBAC settings',
        collectedAt: new Date(),
        collectedBy: 'Security Team',
        source: 'Okta',
        isAutomated: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
    ],
    findings: [],
  },
  {
    id: 'ctrl-002',
    code: 'AC-2',
    name: 'User Access Provisioning',
    description: 'Automated user provisioning and deprovisioning processes',
    framework: 'soc2',
    category: 'Access Control',
    status: 'compliant',
    owner: 'IT Manager',
    department: 'IT',
    lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextTest: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    testFrequency: 'monthly',
    automationLevel: 'fully-automated',
    riskRating: 'high',
    mappedRequirements: ['SOX 404', 'SOC2 CC6.2', 'GDPR Art.25'],
    evidence: [
      {
        id: 'ev-003',
        type: 'audit-trail',
        name: 'Provisioning Logs',
        description: 'Last 30 days of provisioning activity',
        collectedAt: new Date(),
        collectedBy: 'System',
        source: 'Okta',
        isAutomated: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
    ],
    findings: [],
  },
  {
    id: 'ctrl-003',
    code: 'DP-1',
    name: 'Data Classification',
    description: 'Data classification and handling procedures',
    framework: 'gdpr',
    category: 'Data Protection',
    status: 'partial',
    owner: 'Data Protection Officer',
    department: 'Legal',
    lastTested: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    nextTest: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    testFrequency: 'quarterly',
    automationLevel: 'manual',
    riskRating: 'medium',
    mappedRequirements: ['GDPR Art.5', 'CCPA 1798.100'],
    evidence: [
      {
        id: 'ev-004',
        type: 'policy',
        name: 'Data Classification Policy',
        description: 'Policy document needs update',
        collectedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        collectedBy: 'DPO',
        source: 'SharePoint',
        isAutomated: false,
        validUntil: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'expired',
      },
    ],
    findings: [
      {
        id: 'find-001',
        title: 'Outdated Data Classification Policy',
        description: 'Policy has not been reviewed in 6 months',
        severity: 'medium',
        status: 'in-progress',
        identifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        owner: 'DPO',
        remediationPlan:
          'Update policy to include new data categories and AI processing requirements',
      },
    ],
  },
  {
    id: 'ctrl-004',
    code: 'FIN-1',
    name: 'Financial Close Controls',
    description: 'Month-end and quarter-end financial close procedures',
    framework: 'sox',
    category: 'Financial Reporting',
    status: 'compliant',
    owner: 'Controller',
    department: 'Finance',
    lastTested: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextTest: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    testFrequency: 'monthly',
    automationLevel: 'semi-automated',
    riskRating: 'critical',
    mappedRequirements: ['SOX 302', 'SOX 404'],
    evidence: [
      {
        id: 'ev-005',
        type: 'procedure',
        name: 'Close Checklist',
        description: 'Q3 close checklist - all items complete',
        collectedAt: new Date(),
        collectedBy: 'Controller',
        source: 'NetSuite',
        isAutomated: false,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
      {
        id: 'ev-006',
        type: 'attestation',
        name: 'Management Certification',
        description: 'CFO certification of Q3 financials',
        collectedAt: new Date(),
        collectedBy: 'CFO',
        source: 'DocuSign',
        isAutomated: false,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
    ],
    findings: [],
  },
  {
    id: 'ctrl-005',
    code: 'SEC-1',
    name: 'Encryption at Rest',
    description: 'All sensitive data encrypted at rest using AES-256',
    framework: 'pci-dss',
    category: 'Security',
    status: 'non-compliant',
    owner: 'Security Engineer',
    department: 'Security',
    lastTested: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextTest: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    testFrequency: 'monthly',
    automationLevel: 'fully-automated',
    riskRating: 'critical',
    mappedRequirements: ['PCI-DSS 3.4', 'HIPAA 164.312'],
    evidence: [
      {
        id: 'ev-007',
        type: 'screenshot',
        name: 'Encryption Configuration',
        description: 'AWS KMS settings',
        collectedAt: new Date(),
        collectedBy: 'System',
        source: 'AWS',
        isAutomated: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
    ],
    findings: [
      {
        id: 'find-002',
        title: 'Legacy Database Unencrypted',
        description: 'Legacy Oracle database contains PII without encryption',
        severity: 'critical',
        status: 'open',
        identifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        owner: 'Database Admin',
        remediationPlan: 'Implement TDE on legacy Oracle instance or migrate to AWS RDS',
      },
    ],
  },
];

const generateAuditProjects = (): AuditProject[] => [
  {
    id: 'audit-001',
    name: 'SOC 2 Type II Annual Audit',
    type: 'external',
    framework: 'soc2',
    status: 'fieldwork',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    auditor: 'Deloitte',
    controlsInScope: 87,
    controlsTested: 45,
    findingsCount: 3,
    criticalFindings: 0,
  },
  {
    id: 'audit-002',
    name: 'GDPR Data Protection Impact Assessment',
    type: 'internal',
    framework: 'gdpr',
    status: 'reporting',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    auditor: 'Internal Audit Team',
    controlsInScope: 34,
    controlsTested: 34,
    findingsCount: 5,
    criticalFindings: 1,
  },
  {
    id: 'audit-003',
    name: 'Q4 SOX 404 Testing',
    type: 'internal',
    framework: 'sox',
    status: 'planning',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    auditor: 'PwC',
    controlsInScope: 156,
    controlsTested: 0,
    findingsCount: 0,
    criticalFindings: 0,
  },
];

const generateBoardPackets = (): BoardPacket[] => [
  {
    id: 'bp-001',
    name: 'Q3 2024 Compliance Report',
    period: 'Q3 2024',
    generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'review',
    sections: [
      { name: 'Executive Summary', status: 'complete' },
      { name: 'Control Environment', status: 'complete' },
      { name: 'Risk Assessment', status: 'complete' },
      { name: 'Audit Findings', status: 'complete' },
      { name: 'Remediation Status', status: 'needs-update' },
      { name: 'Regulatory Changes', status: 'pending' },
    ],
    approvers: [
      { name: 'CFO', approved: true, approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { name: 'General Counsel', approved: false },
      { name: 'CISO', approved: true, approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
  },
];

const calculateMetrics = (controls: Control[]): ComplianceMetrics => {
  const compliant = controls.filter((c) => c.status === 'compliant').length;
  const partial = controls.filter((c) => c.status === 'partial').length;
  const nonCompliant = controls.filter((c) => c.status === 'non-compliant').length;
  const allFindings = controls.flatMap((c) => c.findings);

  const frameworkScores: Record<ComplianceFramework, number> = {
    sox: 94,
    gdpr: 78,
    hipaa: 85,
    soc2: 91,
    fedramp: 72,
    'pci-dss': 68,
    iso27001: 88,
    ccpa: 82,
    nist: 79,
    dora: 65,
  };

  return {
    overallScore: Math.round((compliant / controls.length) * 100),
    frameworkScores,
    controlsTotal: controls.length,
    controlsCompliant: compliant,
    controlsPartial: partial,
    controlsNonCompliant: nonCompliant,
    openFindings: allFindings.filter((f) => f.status === 'open' || f.status === 'in-progress')
      .length,
    criticalFindings: allFindings.filter(
      (f) => f.severity === 'critical' && f.status !== 'remediated'
    ).length,
    overdueRemediations: allFindings.filter(
      (f) => f.dueDate < new Date() && f.status !== 'remediated'
    ).length,
    upcomingAudits: 2,
    policiesExpiringSoon: 3,
  };
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GovernPage: React.FC = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState<Control[]>(generateControls);
  const [auditProjects, setAuditProjects] = useState<AuditProject[]>(generateAuditProjects);
  const [boardPackets] = useState<BoardPacket[]>(generateBoardPackets);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'controls' | 'regulations' | 'audits' | 'board-packets'
  >('dashboard');
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | 'all'>('all');
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real governance data from API
  useEffect(() => {
    const fetchGovernData = async () => {
      try {
        const [policiesRes, auditsRes] = await Promise.all([
          governApi.getPolicies(),
          governApi.getAudits(),
        ]);

        if (policiesRes.success && policiesRes.data) {
          console.log('[Govern] Loaded', policiesRes.data.length, 'policies from database');
        }
        if (auditsRes.success && auditsRes.data) {
          console.log('[Govern] Loaded', auditsRes.data.length, 'audits from database');
        }
      } catch (error) {
        console.log('[Govern] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGovernData();
  }, []);

  const metrics = useMemo(() => calculateMetrics(controls), [controls]);

  const filteredControls =
    selectedFramework === 'all'
      ? controls
      : controls.filter((c) => c.framework === selectedFramework);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">⚖️</span>
                  CendiaGovern™
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 rounded-full font-medium">
                    COMPLIANCE
                  </span>
                </h1>
                <p className="text-emerald-300 text-sm">
                  Legal-Grade Policy & Audit Mapping • Real-Time Compliance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  const ctx = {
                    question: `Review our compliance posture (${metrics.overallScore}% score) and identify priority remediation actions`,
                    sourcePage: 'CendiaGovern',
                    contextSummary: `Compliance: ${metrics.overallScore}%, ${metrics.criticalFindings} critical findings`,
                    contextData: {
                      complianceScore: metrics.overallScore,
                      totalControls: metrics.controlsTotal,
                      compliantControls: metrics.controlsCompliant,
                      nonCompliantControls: metrics.controlsNonCompliant,
                      criticalFindings: metrics.criticalFindings,
                      openFindings: metrics.openFindings,
                      overdueRemediations: metrics.overdueRemediations,
                    },
                    suggestedMode: metrics.criticalFindings > 0 ? 'compliance' : 'advisory',
                  };
                  sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                  navigate('/cortex/council?fromContext=true');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                💬 Ask Council
              </button>
              <div className="text-right">
                <div className="text-sm text-white/60">Compliance Score</div>
                <div
                  className={`text-2xl font-bold ${
                    metrics.overallScore >= 90
                      ? 'text-green-400'
                      : metrics.overallScore >= 70
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}
                >
                  {metrics.overallScore}%
                </div>
              </div>
              {metrics.criticalFindings > 0 && (
                <div className="px-3 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{metrics.criticalFindings} Critical</div>
                  <div className="text-xs">Findings Open</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.controlsTotal}</div>
              <div className="text-xs text-emerald-300">Total Controls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.controlsCompliant}</div>
              <div className="text-xs text-emerald-300">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.controlsPartial}</div>
              <div className="text-xs text-emerald-300">Partial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.controlsNonCompliant}</div>
              <div className="text-xs text-emerald-300">Non-Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{metrics.openFindings}</div>
              <div className="text-xs text-emerald-300">Open Findings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.overdueRemediations}</div>
              <div className="text-xs text-emerald-300">Overdue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.upcomingAudits}</div>
              <div className="text-xs text-emerald-300">Upcoming Audits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {metrics.policiesExpiringSoon}
              </div>
              <div className="text-xs text-emerald-300">Policies Expiring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-emerald-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'controls', label: 'Control Library', icon: '🎛️' },
              { id: 'regulations', label: 'Regulations', icon: '📜' },
              { id: 'audits', label: 'Audit Projects', icon: '🔍' },
              { id: 'board-packets', label: 'Board Packets', icon: '📋' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-white bg-emerald-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Framework Compliance Scores */}
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-semibold mb-4">Framework Compliance Scores</h2>
              <div className="grid grid-cols-5 gap-4">
                {(
                  Object.entries(FRAMEWORK_CONFIG) as [
                    ComplianceFramework,
                    (typeof FRAMEWORK_CONFIG)[ComplianceFramework],
                  ][]
                ).map(([key, config]) => {
                  const score = metrics.frameworkScores[key];
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedFramework(key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedFramework === key
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'border-emerald-800/50 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="font-medium">{config.name}</span>
                      </div>
                      <div
                        className={`text-3xl font-bold ${
                          score >= 90
                            ? 'text-green-400'
                            : score >= 70
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {score}%
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${
                            score >= 90
                              ? 'bg-green-500'
                              : score >= 70
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Critical Items */}
            <div className="grid grid-cols-2 gap-6">
              {/* Critical Findings */}
              <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Findings
                </h3>
                <div className="space-y-3">
                  {controls
                    .flatMap((c) => c.findings)
                    .filter((f) => f.severity === 'critical')
                    .map((finding) => (
                      <div
                        key={finding.id}
                        className="p-4 bg-red-900/20 rounded-xl border border-red-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{finding.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              finding.status === 'open'
                                ? 'bg-red-600'
                                : finding.status === 'in-progress'
                                  ? 'bg-amber-600'
                                  : 'bg-green-600'
                            }`}
                          >
                            {finding.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 mb-2">{finding.description}</p>
                        <div className="flex justify-between text-xs text-white/50">
                          <span>Owner: {finding.owner}</span>
                          <span>Due: {finding.dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  {controls.flatMap((c) => c.findings).filter((f) => f.severity === 'critical')
                    .length === 0 && (
                    <div className="text-center py-8 text-white/50">
                      <div className="text-4xl mb-2">✅</div>
                      <div>No critical findings</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Audits */}
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🔍</span> Active & Upcoming Audits
                </h3>
                <div className="space-y-3">
                  {auditProjects.map((audit) => (
                    <div
                      key={audit.id}
                      className="p-4 bg-black/20 rounded-xl border border-emerald-800/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                          <h4 className="font-semibold">{audit.name}</h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            audit.status === 'planning'
                              ? 'bg-blue-600'
                              : audit.status === 'fieldwork'
                                ? 'bg-amber-600'
                                : audit.status === 'reporting'
                                  ? 'bg-purple-600'
                                  : 'bg-green-600'
                          }`}
                        >
                          {audit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Auditor:</span>
                          <div className="font-medium">{audit.auditor}</div>
                        </div>
                        <div>
                          <span className="text-white/50">Progress:</span>
                          <div className="font-medium">
                            {audit.controlsTested}/{audit.controlsInScope} controls
                          </div>
                        </div>
                        <div>
                          <span className="text-white/50">Findings:</span>
                          <div
                            className={`font-medium ${audit.criticalFindings > 0 ? 'text-red-400' : ''}`}
                          >
                            {audit.findingsCount} ({audit.criticalFindings} critical)
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{
                              width: `${(audit.controlsTested / audit.controlsInScope) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Impact Simulation */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">🔮 Regulatory Impact Simulator</h2>
                  <p className="text-white/60 text-sm">
                    Simulate the impact of upcoming regulations on your control environment.
                    Proactively identify gaps before requirements take effect.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Run Simulation
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSelectedFramework('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedFramework === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black/30 text-white/60 hover:text-white'
                }`}
              >
                All Frameworks
              </button>
              {(
                Object.entries(FRAMEWORK_CONFIG) as [
                  ComplianceFramework,
                  (typeof FRAMEWORK_CONFIG)[ComplianceFramework],
                ][]
              )
                .slice(0, 6)
                .map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFramework(key)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedFramework === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/30 text-white/60 hover:text-white'
                    }`}
                  >
                    {config.icon} {config.name}
                  </button>
                ))}
            </div>

            {filteredControls.map((control) => (
              <div
                key={control.id}
                onClick={() =>
                  setSelectedControl(selectedControl?.id === control.id ? null : control)
                }
                className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all ${
                  control.status === 'compliant'
                    ? 'border-green-800/50 hover:border-green-600'
                    : control.status === 'partial'
                      ? 'border-amber-800/50 hover:border-amber-600'
                      : 'border-red-800/50 hover:border-red-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{FRAMEWORK_CONFIG[control.framework].icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/50">{control.code}</span>
                        <h3 className="font-semibold">{control.name}</h3>
                      </div>
                      <div className="text-sm text-white/50">
                        {control.category} • {control.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        control.riskRating === 'critical'
                          ? 'bg-red-900 text-red-300'
                          : control.riskRating === 'high'
                            ? 'bg-amber-900 text-amber-300'
                            : control.riskRating === 'medium'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-green-900 text-green-300'
                      }`}
                    >
                      {control.riskRating} risk
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        control.status === 'compliant'
                          ? 'bg-green-600'
                          : control.status === 'partial'
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                      }`}
                    >
                      {control.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/70 mb-3">{control.description}</p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Owner:</span>
                    <div className="font-medium">{control.owner}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Last Tested:</span>
                    <div className="font-medium">{control.lastTested.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Automation:</span>
                    <div
                      className={`font-medium ${
                        control.automationLevel === 'fully-automated'
                          ? 'text-green-400'
                          : control.automationLevel === 'semi-automated'
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}
                    >
                      {control.automationLevel}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50">Evidence:</span>
                    <div className="font-medium">{control.evidence.length} items</div>
                  </div>
                </div>

                {/* Expanded View */}
                {selectedControl?.id === control.id && (
                  <div className="mt-4 pt-4 border-t border-emerald-800/30 space-y-4">
                    {/* Evidence */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Evidence
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {control.evidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-3 bg-black/20 rounded-xl flex items-center gap-3"
                          >
                            <span className="text-xl">
                              {ev.type === 'policy'
                                ? '📄'
                                : ev.type === 'procedure'
                                  ? '📋'
                                  : ev.type === 'screenshot'
                                    ? '📸'
                                    : ev.type === 'log'
                                      ? '📝'
                                      : ev.type === 'attestation'
                                        ? '✍️'
                                        : '📁'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{ev.name}</div>
                              <div className="text-xs text-white/50">{ev.description}</div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                ev.status === 'valid'
                                  ? 'bg-green-900 text-green-300'
                                  : ev.status === 'expired'
                                    ? 'bg-red-900 text-red-300'
                                    : 'bg-amber-900 text-amber-300'
                              }`}
                            >
                              {ev.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Findings */}
                    {control.findings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                          Findings
                        </h4>
                        <div className="space-y-2">
                          {control.findings.map((finding) => (
                            <div
                              key={finding.id}
                              className={`p-3 rounded-xl ${
                                finding.severity === 'critical'
                                  ? 'bg-red-900/30 border border-red-700/50'
                                  : finding.severity === 'high'
                                    ? 'bg-amber-900/30 border border-amber-700/50'
                                    : 'bg-yellow-900/30 border border-yellow-700/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{finding.title}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    finding.status === 'open'
                                      ? 'bg-red-600'
                                      : finding.status === 'in-progress'
                                        ? 'bg-amber-600'
                                        : 'bg-green-600'
                                  }`}
                                >
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{finding.remediationPlan}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mapped Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Mapped Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {control.mappedRequirements.map((req) => (
                          <span
                            key={req}
                            className="px-3 py-1 bg-emerald-900/50 rounded-lg text-sm"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'board-packets' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📋 Board Packet Generator</h2>
                  <p className="text-white/60 text-sm">
                    Automatically generate comprehensive compliance reports for board meetings,
                    audit committees, and regulatory submissions.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Generate New Packet
                </button>
              </div>
            </div>

            {boardPackets.map((packet) => (
              <div
                key={packet.id}
                className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{packet.name}</h3>
                    <div className="text-sm text-white/50">
                      Generated: {packet.generatedAt.toLocaleDateString()} • Period: {packet.period}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      packet.status === 'draft'
                        ? 'bg-neutral-600'
                        : packet.status === 'review'
                          ? 'bg-amber-600'
                          : packet.status === 'approved'
                            ? 'bg-green-600'
                            : 'bg-blue-600'
                    }`}
                  >
                    {packet.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Sections */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Sections
                    </h4>
                    <div className="space-y-2">
                      {packet.sections.map((section) => (
                        <div
                          key={section.name}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-xl"
                        >
                          <span>{section.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              section.status === 'complete'
                                ? 'bg-green-900 text-green-300'
                                : section.status === 'pending'
                                  ? 'bg-amber-900 text-amber-300'
                                  : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {section.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approvers */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Approvers
                    </h4>
                    <div className="space-y-2">
                      {packet.approvers.map((approver) => (
                        <div
                          key={approver.name}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-xl"
                        >
                          <span>{approver.name}</span>
                          {approver.approved ? (
                            <span className="flex items-center gap-2 text-green-400 text-sm">
                              ✅ Approved {approver.approvedAt?.toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-900 text-amber-300 rounded text-xs">
                              Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-emerald-800/30">
                  <button className="px-4 py-2 bg-emerald-700 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                    📄 View Report
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    ✏️ Edit
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    📤 Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-bold mb-2">Regulation Library</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Access the full regulatory library with real-time updates on SOX, GDPR, HIPAA,
              PCI-DSS, FedRAMP, DORA, and 50+ other frameworks.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
              Browse Regulations
            </button>
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="space-y-4">
            {auditProjects.map((audit) => (
              <div
                key={audit.id}
                className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{audit.name}</h3>
                      <div className="text-sm text-white/50">
                        {audit.auditor} • {audit.type} audit
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      audit.status === 'planning'
                        ? 'bg-blue-600'
                        : audit.status === 'fieldwork'
                          ? 'bg-amber-600'
                          : audit.status === 'reporting'
                            ? 'bg-purple-600'
                            : 'bg-green-600'
                    }`}
                  >
                    {audit.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">{audit.controlsInScope}</div>
                    <div className="text-xs text-white/50">Controls in Scope</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">
                      {audit.controlsTested}
                    </div>
                    <div className="text-xs text-white/50">Tested</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">
                      {Math.round((audit.controlsTested / audit.controlsInScope) * 100)}%
                    </div>
                    <div className="text-xs text-white/50">Progress</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-amber-400">{audit.findingsCount}</div>
                    <div className="text-xs text-white/50">Findings</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div
                      className={`text-2xl font-bold ${audit.criticalFindings > 0 ? 'text-red-400' : 'text-green-400'}`}
                    >
                      {audit.criticalFindings}
                    </div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                </div>

                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all"
                    style={{ width: `${(audit.controlsTested / audit.controlsInScope) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-white/50 mt-2">
                  <span>Start: {audit.startDate.toLocaleDateString()}</span>
                  <span>End: {audit.endDate.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GovernPage;
