// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCompliance™ - Five Rings of Sovereignty
 * Enterprise Platinum Standard Compliance Dashboard
 * 
 * Features:
 * - Real-time compliance data from API (no fallback mock data)
 * - Interactive Five Rings visualization with drill-down
 * - Tabbed interface for Frameworks, Assessments, Bundles, Pillar Mapping
 * - Generate Compliance Bundle with real API call and download
 * - Run assessments per domain with loading states
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Loader2,
  Brain,
  Lock,
  Scale,
  Building2,
  Cpu,
  Eye,
  Play,
  Package,
  Layers,
  Clock,
  Hash,
  FileCheck,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';
import { useUser } from '../../../contexts';

// Types
type ComplianceDomain = 'ethical_ai' | 'cybersecurity' | 'privacy' | 'governance' | 'industry';
type PillarId = 'helm' | 'lineage' | 'predict' | 'flow' | 'health' | 'guard' | 'ethics' | 'agents';

interface ComplianceFramework {
  id: string;
  code: string;
  name: string;
  fullName: string;
  domain: ComplianceDomain;
  description: string;
  version: string;
  jurisdiction: string[];
  industries: string[];
  pillars: PillarId[];
  controlCount: number;
  status: 'active' | 'deprecated' | 'draft';
}

interface Ring {
  ring: number;
  domain: ComplianceDomain;
  name: string;
  description: string;
  frameworks: ComplianceFramework[];
  totalControls: number;
}

interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  frameworkId: string;
  controlId: string;
  status: 'open' | 'in_progress' | 'resolved';
}

interface Assessment {
  id: string;
  frameworkId: string;
  frameworkCode: string;
  pillarId: PillarId;
  domain: ComplianceDomain;
  overallScore: number;
  findings: Finding[];
  assessedAt: string;
  assessedBy: string;
}

interface Bundle {
  id: string;
  organizationId: string;
  generatedAt: string;
  generatedBy: string;
  frameworks: string[];
  pillars: PillarId[];
  domains: ComplianceDomain[];
  fileCount: number;
  files: Array<{
    path: string;
    name: string;
    format: string;
    size: number;
    hash: string;
  }>;
  merkleRoot: string;
  bundleHash: string;
  expiresAt: string;
}

type TabId = 'overview' | 'frameworks' | 'assessments' | 'bundles' | 'pillars';

// Domain configuration
const DOMAIN_CONFIG: Record<ComplianceDomain, { 
  color: string; 
  bg: string; 
  border: string;
  icon: React.ReactNode; 
  gradient: string;
  name: string;
}> = {
  ethical_ai: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
    icon: <Brain className="w-5 h-5" />,
    gradient: 'from-purple-600 to-purple-800',
    name: 'Ethical AI',
  },
  cybersecurity: {
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    icon: <Shield className="w-5 h-5" />,
    gradient: 'from-red-600 to-red-800',
    name: 'Cybersecurity',
  },
  privacy: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    icon: <Lock className="w-5 h-5" />,
    gradient: 'from-blue-600 to-blue-800',
    name: 'Privacy',
  },
  governance: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/50',
    icon: <Scale className="w-5 h-5" />,
    gradient: 'from-amber-600 to-amber-800',
    name: 'Governance',
  },
  industry: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    icon: <Building2 className="w-5 h-5" />,
    gradient: 'from-emerald-600 to-emerald-800',
    name: 'Industry',
  },
};

const PILLAR_CONFIG: Record<PillarId, { name: string; emoji: string }> = {
  helm: { name: 'The Helm', emoji: '🎯' },
  lineage: { name: 'The Lineage', emoji: '🔗' },
  predict: { name: 'The Predict', emoji: '🔮' },
  flow: { name: 'The Flow', emoji: '🌊' },
  health: { name: 'The Health', emoji: '💓' },
  guard: { name: 'The Guard', emoji: '🛡️' },
  ethics: { name: 'The Ethics', emoji: '⚖️' },
  agents: { name: 'The Agents', emoji: '🤖' },
};

// Five Rings Interactive Visualization
const FiveRingsVisualization: React.FC<{ 
  rings: Ring[]; 
  onRingClick: (domain: ComplianceDomain) => void;
  selectedDomain: ComplianceDomain | null;
}> = ({ rings, onRingClick, selectedDomain }) => {
  const ringOrder: ComplianceDomain[] = ['industry', 'governance', 'privacy', 'cybersecurity', 'ethical_ai'];
  
  return (
    <div className="relative w-64 h-64">
      {ringOrder.map((domain, index) => {
        const ring = rings.find(r => r.domain === domain);
        const config = DOMAIN_CONFIG[domain];
        const ringNum = 5 - index;
        const size = 100 - (index * 16);
        const isSelected = selectedDomain === domain;
        
        return (
          <motion.div
            key={domain}
            className={`absolute rounded-full cursor-pointer transition-all duration-300 ${config.bg} ${config.border} border-2 ${isSelected ? 'ring-2 ring-white' : ''}`}
            style={{
              width: `${size}%`,
              height: `${size}%`,
              top: `${(100 - size) / 2}%`,
              left: `${(100 - size) / 2}%`,
            }}
            onClick={() => onRingClick(domain)}
            whileHover={{ scale: 1.02 }}
            title={`Ring ${ringNum}: ${config.name} - ${ring?.frameworks.length || 0} frameworks`}
          />
        );
      })}
      
      {/* Center - 8 Pillars */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-xl flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
        style={{ width: '20%', height: '20%', top: '40%', left: '40%' }}
        onClick={() => onRingClick('ethical_ai')}
      >
        <span className="text-lg font-bold">8</span>
        <span className="text-[8px] uppercase tracking-wider">Pillars</span>
      </div>

      {/* Ring labels */}
      <div className="absolute -right-2 top-0 text-[10px] text-emerald-400">Ring 5: Industry</div>
      <div className="absolute -right-2 top-[16%] text-[10px] text-amber-400">Ring 4: Governance</div>
      <div className="absolute -right-2 top-[32%] text-[10px] text-blue-400">Ring 3: Privacy</div>
      <div className="absolute -right-2 top-[48%] text-[10px] text-red-400">Ring 2: Cybersecurity</div>
    </div>
  );
};

// Findings Summary Component
const FindingsSummary: React.FC<{ assessments: Assessment[] }> = ({ assessments }) => {
  const findings = assessments.flatMap(a => a.findings);
  const critical = findings.filter(f => f.severity === 'critical').length;
  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;
  const open = findings.filter(f => f.status === 'open').length;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        Compliance Findings
      </h3>

      <div className="grid grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{critical}</div>
          <div className="text-xs text-gray-500 uppercase">Critical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{high}</div>
          <div className="text-xs text-gray-500 uppercase">High</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{medium}</div>
          <div className="text-xs text-gray-500 uppercase">Medium</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{low}</div>
          <div className="text-xs text-gray-500 uppercase">Low</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">{open}</div>
          <div className="text-xs text-gray-500 uppercase">Open</div>
        </div>
      </div>

      {critical > 0 && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {critical} critical finding(s) require immediate attention within 7 days
        </div>
      )}
    </div>
  );
};

// Framework tooltips with detailed explanations
const FRAMEWORK_TOOLTIPS: Record<string, { purpose: string; usage: string; benefit: string }> = {
  'NIST-AI-RMF': { purpose: 'Manages risks in AI systems throughout their lifecycle', usage: 'Apply during AI development, deployment, and monitoring phases', benefit: 'Ensures trustworthy AI with accountability and transparency' },
  'ISO-42001': { purpose: 'International standard for AI management systems', usage: 'Implement organizational controls for responsible AI governance', benefit: 'Demonstrates commitment to ethical AI practices globally' },
  'UNESCO-AI': { purpose: 'Global ethical framework for artificial intelligence', usage: 'Guide policy decisions and AI development principles', benefit: 'Aligns AI initiatives with human rights and dignity' },
  'OECD-AI': { purpose: 'Principles for responsible stewardship of trustworthy AI', usage: 'Shape national AI strategies and corporate policies', benefit: 'Promotes innovation while addressing societal challenges' },
  'NIST-800-53': { purpose: 'Comprehensive security and privacy controls catalog', usage: 'Select and implement controls based on risk assessment', benefit: 'Protects federal systems and critical infrastructure' },
  'NIST-CSF': { purpose: 'Framework for improving critical infrastructure cybersecurity', usage: 'Identify, protect, detect, respond, and recover from threats', benefit: 'Reduces cyber risk through structured approach' },
  'ISO-27001': { purpose: 'Information security management system standard', usage: 'Establish, implement, and continually improve ISMS', benefit: 'Certification demonstrates security commitment to stakeholders' },
  'SOC2': { purpose: 'Trust service criteria for service organizations', usage: 'Audit controls for security, availability, and confidentiality', benefit: 'Builds customer trust through independent verification' },
  'ZERO-TRUST': { purpose: 'Security model assuming no implicit trust', usage: 'Verify every access request regardless of location', benefit: 'Minimizes attack surface and lateral movement' },
  'MITRE-ATT&CK': { purpose: 'Knowledge base of adversary tactics and techniques', usage: 'Map defenses to known attack patterns', benefit: 'Improves threat detection and incident response' },
  'GDPR': { purpose: 'EU regulation protecting personal data and privacy', usage: 'Ensure lawful processing and data subject rights', benefit: 'Avoids fines up to 4% of global revenue' },
  'CCPA': { purpose: 'California consumer privacy rights law', usage: 'Provide transparency and control over personal information', benefit: 'Compliance required for California residents\' data' },
  'HIPAA': { purpose: 'US healthcare data protection requirements', usage: 'Safeguard protected health information (PHI)', benefit: 'Mandatory for healthcare entities and associates' },
  'ISO-27701': { purpose: 'Privacy information management extension to ISO 27001', usage: 'Implement privacy controls within existing ISMS', benefit: 'Demonstrates GDPR compliance readiness' },
  'PCI-DSS': { purpose: 'Payment card industry data security standard', usage: 'Protect cardholder data during transactions', benefit: 'Required for processing credit card payments' },
  'SOX': { purpose: 'Financial reporting and internal controls requirements', usage: 'Document and test controls over financial reporting', benefit: 'Mandatory for US public companies' },
  'COSO': { purpose: 'Internal control and enterprise risk management framework', usage: 'Design and assess internal control systems', benefit: 'Foundation for SOX compliance and governance' },
  'COBIT': { purpose: 'IT governance and management framework', usage: 'Align IT with business goals and manage IT risk', benefit: 'Bridges gap between business and IT objectives' },
  'ITIL': { purpose: 'IT service management best practices', usage: 'Deliver and support IT services effectively', benefit: 'Improves service quality and customer satisfaction' },
  'ISO-9001': { purpose: 'Quality management system requirements', usage: 'Establish processes for consistent quality', benefit: 'Certification enhances market credibility' },
  'FEDRAMP': { purpose: 'US government cloud security authorization', usage: 'Achieve authorization to operate for federal agencies', benefit: 'Opens federal market for cloud services' },
  'CMMC': { purpose: 'Cybersecurity maturity model for defense contractors', usage: 'Implement tiered security practices for DoD contracts', benefit: 'Required for defense industrial base participation' },
  'BASEL-III': { purpose: 'Banking capital and liquidity requirements', usage: 'Maintain adequate capital buffers and liquidity', benefit: 'Ensures financial system stability' },
  'DORA': { purpose: 'EU digital operational resilience for financial sector', usage: 'Manage ICT risks and ensure operational continuity', benefit: 'Mandatory for EU financial entities by 2025' },
};

// Framework Card with tooltip
const FrameworkCard: React.FC<{ framework: ComplianceFramework }> = ({ framework }) => {
  const config = DOMAIN_CONFIG[framework.domain];
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltip = FRAMEWORK_TOOLTIPS[framework.code] || {
    purpose: framework.description || 'Compliance framework for organizational governance',
    usage: `Apply ${framework.code} controls across ${framework.controlCount} requirements`,
    benefit: `Ensures compliance with ${framework.jurisdiction?.join(', ') || 'global'} regulations`
  };
  
  return (
    <div 
      className={`bg-slate-800/50 rounded-lg border ${config.border} p-4 hover:bg-slate-800 transition-colors relative cursor-pointer`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          {config.icon}
        </div>
        <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color}`}>
          {framework.status}
        </span>
      </div>
      <h4 className="font-semibold text-white">{framework.code}</h4>
      <p className="text-sm text-gray-400 mb-2">{framework.name}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{framework.controlCount} controls</span>
        <span>v{framework.version}</span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 p-4 bg-slate-900 border border-slate-600 rounded-lg shadow-xl text-sm">
          <div className="mb-3">
            <div className="text-cyan-400 font-semibold mb-1">Purpose</div>
            <div className="text-gray-300">{tooltip.purpose}</div>
          </div>
          <div className="mb-3">
            <div className="text-green-400 font-semibold mb-1">How It's Used</div>
            <div className="text-gray-300">{tooltip.usage}</div>
          </div>
          <div>
            <div className="text-amber-400 font-semibold mb-1">Key Benefit</div>
            <div className="text-gray-300">{tooltip.benefit}</div>
          </div>
          {framework.industries && framework.industries.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <span className="text-gray-500">Industries: </span>
              <span className="text-gray-400">{framework.industries.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Assessment Card
const AssessmentCard: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  const config = DOMAIN_CONFIG[assessment.domain];
  const criticalCount = assessment.findings.filter(f => f.severity === 'critical').length;
  
  return (
    <div className={`bg-slate-800/50 rounded-lg border ${config.border} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white">{assessment.frameworkCode}</h4>
          <p className="text-sm text-gray-400">{PILLAR_CONFIG[assessment.pillarId]?.name}</p>
        </div>
        <div className={`text-2xl font-bold ${assessment.overallScore >= 80 ? 'text-green-400' : assessment.overallScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
          {assessment.overallScore}%
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {new Date(assessment.assessedAt).toLocaleDateString()}
        </span>
        {criticalCount > 0 && (
          <span className="text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {criticalCount} critical
          </span>
        )}
      </div>
    </div>
  );
};

// Bundle Card
const BundleCard: React.FC<{ bundle: Bundle; onDownload: (id: string) => void }> = ({ bundle, onDownload }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Compliance Bundle</h4>
            <p className="text-xs text-gray-400">{bundle.fileCount} files</p>
          </div>
        </div>
        <button
          onClick={() => onDownload(bundle.id)}
          className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-3 h-3" />
          {new Date(bundle.generatedAt).toLocaleString()}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Hash className="w-3 h-3" />
          <span className="font-mono">{bundle.merkleRoot.slice(0, 16)}...</span>
        </div>
      </div>
    </div>
  );
};

// Pillar Mapping Card
const PillarMappingCard: React.FC<{ 
  pillarId: PillarId; 
  mapping: Record<ComplianceDomain, ComplianceFramework[]> | null;
  loading: boolean;
  onLoad: () => void;
}> = ({ pillarId, mapping, loading, onLoad }) => {
  const pillar = PILLAR_CONFIG[pillarId];
  
  if (!mapping && !loading) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{pillar.emoji}</span>
          <h4 className="font-semibold text-white">{pillar.name}</h4>
        </div>
        <button
          onClick={onLoad}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Load Mapping
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{pillar.emoji}</span>
          <h4 className="font-semibold text-white">{pillar.name}</h4>
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  const totalFrameworks = mapping ? Object.values(mapping).flat().length : 0;

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{pillar.emoji}</span>
          <h4 className="font-semibold text-white">{pillar.name}</h4>
        </div>
        <span className="text-sm text-cyan-400">{totalFrameworks} frameworks</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(DOMAIN_CONFIG) as ComplianceDomain[]).map(domain => {
          const count = mapping?.[domain]?.length || 0;
          const config = DOMAIN_CONFIG[domain];
          return (
            <div key={domain} className={`text-center p-2 rounded ${config.bg}`}>
              <div className={`text-lg font-bold ${config.color}`}>{count}</div>
              <div className="text-[10px] text-gray-400">{config.name.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Dashboard Component
const ComplianceDashboard: React.FC = () => {
  const user = useUser();
  const organizationId = user?.organizationId;
  const generatedBy = user?.name || user?.email || 'Unknown';

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [rings, setRings] = useState<Ring[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [pillarMappings, setPillarMappings] = useState<Record<PillarId, Record<ComplianceDomain, ComplianceFramework[]> | null>>({
    helm: null, lineage: null, predict: null, flow: null, health: null, guard: null, ethics: null, agents: null
  });
  const [pillarLoading, setPillarLoading] = useState<Record<PillarId, boolean>>({
    helm: false, lineage: false, predict: false, flow: false, health: false, guard: false, ethics: false, agents: false
  });
  
  // UI state
  const [selectedDomain, setSelectedDomain] = useState<ComplianceDomain | null>(null);
  const [generating, setGenerating] = useState(false);
  const [runningAssessment, setRunningAssessment] = useState<ComplianceDomain | null>(null);

  const loadAssessments = useCallback(
    async (loadedFrameworks: ComplianceFramework[]) => {
      if (!organizationId) {
        setAssessments([]);
        return;
      }

      const fwById = new Map(loadedFrameworks.map((f) => [f.id, f] as const));
      const res = await apiClient.api.get<
        Array<{
          id: string;
          organizationId: string;
          frameworkId: string;
          pillarId: PillarId;
          domain: ComplianceDomain;
          assessmentDate: string;
          assessor: string;
          overallScore: number;
          findings: Array<{
            id: string;
            controlId: string;
            severity: Finding['severity'];
            title: string;
            status: Finding['status'];
          }>;
        }>
      >('/compliance/assessments', { organizationId });

      if (!res.success) {
        throw new Error(res.error?.message || 'Failed to load assessments');
      }

      const raw = Array.isArray(res.data) ? res.data : [];
      const normalized: Assessment[] = raw.map((a) => {
        const fw = fwById.get(a.frameworkId);
        return {
          id: a.id,
          frameworkId: a.frameworkId,
          frameworkCode: fw?.code || a.frameworkId,
          pillarId: a.pillarId,
          domain: a.domain,
          overallScore: a.overallScore,
          findings: (a.findings || []).map((f) => ({
            id: f.id,
            severity: f.severity,
            title: f.title,
            frameworkId: a.frameworkId,
            controlId: f.controlId,
            status: f.status,
          })),
          assessedAt: a.assessmentDate,
          assessedBy: a.assessor,
        };
      });

      setAssessments(normalized);
    },
    [organizationId]
  );

  // Load initial data - parallel requests for speed
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ringsRes, frameworksRes] = await Promise.all([
        apiClient.api.get<{ rings: Ring[] }>('/compliance/five-rings'),
        apiClient.api.get<ComplianceFramework[]>('/compliance/frameworks'),
      ]);

      if (!ringsRes.success) {
        throw new Error(ringsRes.error?.message || 'Failed to load Five Rings overview');
      }

      if (!frameworksRes.success) {
        throw new Error(frameworksRes.error?.message || 'Failed to load frameworks');
      }

      const loadedRings = ringsRes.data?.rings || [];
      const loadedFrameworks = Array.isArray(frameworksRes.data) ? frameworksRes.data : [];

      if (loadedRings.length === 0 || loadedFrameworks.length === 0) {
        setRings([]);
        setFrameworks([]);
        setAssessments([]);
        setError('No compliance data returned from API');
        return;
      }

      setRings(loadedRings);
      setFrameworks(loadedFrameworks);

      try {
        await loadAssessments(loadedFrameworks);
      } catch (e) {
        setAssessments([]);
        setError(e instanceof Error ? e.message : 'Failed to load assessments');
      }
    } catch (err) {
      console.error('Compliance data load error:', err);
      setRings([]);
      setFrameworks([]);
      setAssessments([]);
      setError(err instanceof Error ? err.message : 'Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  }, [loadAssessments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load pillar mapping
  const loadPillarMapping = async (pillarId: PillarId) => {
    setPillarLoading(prev => ({ ...prev, [pillarId]: true }));
    try {
      const res = await apiClient.api.get<{ data: { mapping: Record<ComplianceDomain, ComplianceFramework[]> } }>(`/compliance/pillars/${pillarId}/mapping`);
      if (res.success && res.data) {
        const data = (res.data as any).data || res.data;
        setPillarMappings(prev => ({ ...prev, [pillarId]: data.mapping }));
      }
    } catch (err) {
      console.error('Failed to load pillar mapping:', err);
    } finally {
      setPillarLoading(prev => ({ ...prev, [pillarId]: false }));
    }
  };

  // Generate compliance bundle
  const generateBundle = async () => {
    setGenerating(true);
    try {
      if (!organizationId) {
        throw new Error('Organization is required to generate bundles');
      }

      const res = await apiClient.api.post<Bundle>('/compliance/bundles/generate', {
        organizationId,
        generatedBy,
        domains: ['ethical_ai', 'cybersecurity', 'privacy', 'governance', 'industry'],
        pillars: ['helm', 'lineage', 'predict', 'flow', 'health', 'guard', 'ethics', 'agents'],
      });

      if (!res.success || !res.data) {
        throw new Error(res.error?.message || 'Failed to generate compliance bundle');
      }

      setBundles((prev) => [res.data as Bundle, ...prev]);
      setActiveTab('bundles');
    } catch (err) {
      console.error('Failed to generate bundle:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate compliance bundle');
    } finally {
      setGenerating(false);
    }
  };

  // Run domain assessment
  const runDomainAssessment = async (domain: ComplianceDomain) => {
    setRunningAssessment(domain);
    try {
      if (!organizationId) {
        throw new Error('Organization is required to run assessments');
      }

      const assessor = generatedBy;
      const domainFrameworks = frameworks.filter((f) => f.domain === domain);

      for (const fw of domainFrameworks) {
        const pillarId = fw.pillars?.[0] || 'guard';
        const res = await apiClient.api.post('/compliance/assessments/framework', {
          organizationId,
          frameworkId: fw.id,
          pillarId,
          assessor,
        });

        if (!res.success) {
          throw new Error(res.error?.message || `Failed to assess framework ${fw.code}`);
        }
      }

      await loadAssessments(frameworks);
      setActiveTab('assessments');
    } catch (err) {
      console.error('Failed to run assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to run assessment');
    } finally {
      setRunningAssessment(null);
    }
  };

  // Download bundle
  const downloadBundle = async (bundleId: string) => {
    try {
      const res = await apiClient.api.get<unknown>(`/compliance/bundles/${bundleId}/download`);
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || 'Failed to download bundle');
      }

      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-bundle-${bundleId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download bundle:', err);
      setError(err instanceof Error ? err.message : 'Failed to download bundle');
    }
  };

  // Calculate overall score
  const overallScore = assessments.length > 0
    ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
    : 0;

  // Filter frameworks by selected domain
  const filteredFrameworks = selectedDomain
    ? frameworks.filter(f => f.domain === selectedDomain)
    : frameworks;

  // Tabs
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'frameworks', label: 'Frameworks', icon: <FileText className="w-4 h-4" /> },
    { id: 'assessments', label: 'Assessments', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'bundles', label: 'Bundles', icon: <Package className="w-4 h-4" /> },
    { id: 'pillars', label: 'Pillar Mapping', icon: <Layers className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  if (error && rings.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Five Rings of Sovereignty
          </h1>
          <p className="text-gray-400 mt-1">
            Complete compliance framework mapping across all 8 pillars
          </p>
        </div>
        <button
          onClick={generateBundle}
          disabled={generating}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Package className="w-4 h-4" />
              Generate Compliance Bundle
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Overall Score Card */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-slate-900 rounded-2xl p-8 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-gray-300">Overall Compliance Score</h2>
                  <div className="text-6xl font-bold text-white mt-2">{overallScore}%</div>
                  <p className="text-gray-400 mt-2">
                    {assessments.length} assessments across 5 domains
                  </p>
                </div>
                <FiveRingsVisualization 
                  rings={rings} 
                  onRingClick={(domain) => {
                    setSelectedDomain(domain === selectedDomain ? null : domain);
                    setActiveTab('frameworks');
                  }}
                  selectedDomain={selectedDomain}
                />
              </div>
            </div>

            {/* Findings Summary */}
            <FindingsSummary assessments={assessments} />

            {/* Domain Cards */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Compliance Domains</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rings.map(ring => {
                  const config = DOMAIN_CONFIG[ring.domain];
                  const isRunning = runningAssessment === ring.domain;
                  
                  return (
                    <div
                      key={ring.domain}
                      className={`bg-slate-800/50 rounded-xl border ${config.border} overflow-hidden`}
                    >
                      <div className={`p-4 bg-gradient-to-r ${config.gradient}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                              {config.icon}
                            </div>
                            <div>
                              <div className="text-xs text-white/70">Ring {ring.ring}</div>
                              <h3 className="font-semibold text-white">{ring.name}</h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-white">{frameworks.filter(f => f.domain === ring.domain).length}</div>
                            <div className="text-xs text-white/70">frameworks</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-400">{ring.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Cpu className="w-3 h-3" />
                          {ring.totalControls} controls
                        </div>
                        <button
                          onClick={() => runDomainAssessment(ring.domain)}
                          disabled={isRunning}
                          className={`w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                          {isRunning ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Run Assessment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'frameworks' && (
          <motion.div
            key="frameworks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Domain Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedDomain(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !selectedDomain ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                All ({frameworks.length})
              </button>
              {(Object.keys(DOMAIN_CONFIG) as ComplianceDomain[]).map(domain => {
                const config = DOMAIN_CONFIG[domain];
                const count = frameworks.filter(f => f.domain === domain).length;
                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedDomain === domain ? `${config.bg} ${config.color}` : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {config.icon}
                    {config.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Frameworks Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFrameworks.map(fw => (
                <FrameworkCard key={fw.id} framework={fw} />
              ))}
            </div>

            {filteredFrameworks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No frameworks found for the selected filter.
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'assessments' && (
          <motion.div
            key="assessments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {assessments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessments.map(assessment => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Assessments Yet</h3>
                <p className="text-gray-400 mb-4">Run your first compliance assessment to see results here.</p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
                >
                  Go to Overview
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'bundles' && (
          <motion.div
            key="bundles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {bundles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.map(bundle => (
                  <BundleCard key={bundle.id} bundle={bundle} onDownload={downloadBundle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Bundles Generated</h3>
                <p className="text-gray-400 mb-4">Generate a compliance bundle to export all reports and audit logs.</p>
                <button
                  onClick={generateBundle}
                  disabled={generating}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  Generate Bundle
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'pillars' && (
          <motion.div
            key="pillars"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {(Object.keys(PILLAR_CONFIG) as PillarId[]).map(pillarId => (
              <PillarMappingCard
                key={pillarId}
                pillarId={pillarId}
                mapping={pillarMappings[pillarId]}
                loading={pillarLoading[pillarId]}
                onLoad={() => loadPillarMapping(pillarId)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplianceDashboard;
