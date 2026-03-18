/**
 * Page — CendiaGapScan™ Compliance Gap Scanner Dashboard
 *
 * Visual dashboard showing compliance scan results across EU AI Act,
 * NIST AI RMF, ISO 42001, SOX, GDPR and other frameworks. Displays
 * findings by severity, framework coverage charts, and trend data.
 *
 * @exports GapScannerPage
 * @module pages/cortex/compliance/GapScannerPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceInfoDropdown } from '../../../components/ui/ServiceInfoDropdown';
import { gapScannerInfo } from '../../../config/serviceInfo';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Filter,
  Search,
  Info,
  AlertOctagon,
  ChevronDown,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  version: string;
  totalRequirements: number;
  satisfied: number;
  partial: number;
  gaps: number;
  notApplicable: number;
  coveragePercent: number;
  status: 'aligned' | 'partial' | 'gaps' | 'not-assessed';
  lastScanned: string;
}

interface Finding {
  id: string;
  framework: string;
  requirement: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'gap' | 'partial' | 'satisfied' | 'remediated';
  description: string;
  recommendation: string;
  evidence?: string;
  dueDate?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const FRAMEWORKS: ComplianceFramework[] = [
  { id: 'eu-ai-act', name: 'EU AI Act', shortName: 'EU AI Act', version: '2024', totalRequirements: 42, satisfied: 36, partial: 4, gaps: 2, notApplicable: 0, coveragePercent: 86, status: 'aligned', lastScanned: new Date().toISOString() },
  { id: 'nist-ai-rmf', name: 'NIST AI Risk Management Framework', shortName: 'NIST AI RMF', version: '1.0', totalRequirements: 56, satisfied: 48, partial: 6, gaps: 2, notApplicable: 0, coveragePercent: 86, status: 'aligned', lastScanned: new Date().toISOString() },
  { id: 'iso-42001', name: 'ISO/IEC 42001 AI Management System', shortName: 'ISO 42001', version: '2023', totalRequirements: 38, satisfied: 30, partial: 5, gaps: 3, notApplicable: 0, coveragePercent: 79, status: 'partial', lastScanned: new Date().toISOString() },
  { id: 'gdpr', name: 'General Data Protection Regulation', shortName: 'GDPR', version: 'Art. 22', totalRequirements: 24, satisfied: 22, partial: 2, gaps: 0, notApplicable: 0, coveragePercent: 92, status: 'aligned', lastScanned: new Date().toISOString() },
  { id: 'hipaa', name: 'Health Insurance Portability and Accountability Act', shortName: 'HIPAA', version: '2024', totalRequirements: 18, satisfied: 15, partial: 2, gaps: 1, notApplicable: 0, coveragePercent: 83, status: 'partial', lastScanned: new Date().toISOString() },
  { id: 'sr-11-7', name: 'SR 11-7 Model Risk Management', shortName: 'SR 11-7', version: '2011', totalRequirements: 32, satisfied: 28, partial: 3, gaps: 1, notApplicable: 0, coveragePercent: 88, status: 'aligned', lastScanned: new Date().toISOString() },
  { id: 'sox', name: 'Sarbanes-Oxley Act', shortName: 'SOX', version: 'Section 404', totalRequirements: 20, satisfied: 16, partial: 3, gaps: 1, notApplicable: 0, coveragePercent: 80, status: 'partial', lastScanned: new Date().toISOString() },
  { id: 'aba-512', name: 'ABA Formal Opinion 512', shortName: 'ABA 512', version: '2024', totalRequirements: 12, satisfied: 11, partial: 1, gaps: 0, notApplicable: 0, coveragePercent: 92, status: 'aligned', lastScanned: new Date().toISOString() },
];

const FINDINGS: Finding[] = [
  { id: 'F-001', framework: 'EU AI Act', requirement: 'Art. 14(4)(a) — Human oversight measures', severity: 'medium', status: 'partial', description: 'Human override panel exists but auto-escalation thresholds not configured for all vertical-specific workflows.', recommendation: 'Configure escalation thresholds per vertical in CendiaGateway settings.', evidence: 'Verified: override panel functional. Gap: 3 of 12 verticals missing custom thresholds.' },
  { id: 'F-002', framework: 'EU AI Act', requirement: 'Art. 9(7) — Risk management testing', severity: 'high', status: 'gap', description: 'Formal adversarial testing schedule not documented. CendiaRedTeam runs ad-hoc but no quarterly review process established.', recommendation: 'Establish quarterly Red Team review cadence with documented test plans and results archive.' },
  { id: 'F-003', framework: 'ISO 42001', requirement: 'Clause 6.1 — Actions to address risks', severity: 'medium', status: 'partial', description: 'Risk register exists in CendiaPulse but not formally mapped to ISO 42001 risk categories.', recommendation: 'Map CendiaPulse risk categories to ISO 42001 Annex B risk taxonomy.' },
  { id: 'F-004', framework: 'ISO 42001', requirement: 'Clause 9.2 — Internal audit', severity: 'high', status: 'gap', description: 'No formal internal audit programme established. Decision audit trails exist but systematic audit process not documented.', recommendation: 'Establish internal audit programme with documented procedures, schedule, and competency requirements.' },
  { id: 'F-005', framework: 'ISO 42001', requirement: 'Clause 7.2 — Competence', severity: 'medium', status: 'gap', description: 'AI competency requirements not formally defined for personnel operating the system.', recommendation: 'Define AI competency matrix and training requirements for all personnel roles.' },
  { id: 'F-006', framework: 'NIST AI RMF', requirement: 'GOVERN 1.3 — AI risk management process', severity: 'medium', status: 'partial', description: 'Risk management processes exist but cross-functional governance board not formally constituted.', recommendation: 'Establish formal AI governance board with documented charter and meeting cadence.' },
  { id: 'F-007', framework: 'NIST AI RMF', requirement: 'MEASURE 2.5 — Bias testing', severity: 'high', status: 'gap', description: 'CendiaRedTeam includes bias detection vector but systematic bias testing across demographics not implemented.', recommendation: 'Implement demographic bias testing suite using CendiaRedTeam bias vector with documented test populations.' },
  { id: 'F-008', framework: 'HIPAA', requirement: '164.312(a)(1) — Access control', severity: 'medium', status: 'gap', description: 'PHI data masking in deliberation context not enforced for healthcare verticals.', recommendation: 'Enable automatic PHI detection and masking in healthcare vertical workflows.' },
  { id: 'F-009', framework: 'SR 11-7', requirement: 'Model validation — Independent review', severity: 'high', status: 'partial', description: 'Model outputs are cryptographically signed but independent model validation process not established.', recommendation: 'Establish independent model validation function with documented testing methodology.' },
  { id: 'F-010', framework: 'SOX', requirement: 'Section 404 — Internal controls over financial reporting', severity: 'medium', status: 'gap', description: 'Financial decision audit trail exists but SOX-specific control documentation not maintained.', recommendation: 'Map Datacendia decision audit capabilities to SOX Section 404 control requirements.' },
];

// =============================================================================
// COMPONENT
// =============================================================================

const GapScannerPage: React.FC = () => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const filteredFindings = FINDINGS.filter(f => {
    if (selectedFramework && f.framework !== FRAMEWORKS.find(fw => fw.id === selectedFramework)?.shortName) return false;
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    return true;
  });

  const severityCounts = {
    critical: FINDINGS.filter(f => f.severity === 'critical').length,
    high: FINDINGS.filter(f => f.severity === 'high').length,
    medium: FINDINGS.filter(f => f.severity === 'medium').length,
    low: FINDINGS.filter(f => f.severity === 'low').length,
  };

  const overallCoverage = Math.round(FRAMEWORKS.reduce((sum, f) => sum + f.coveragePercent, 0) / FRAMEWORKS.length);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'text-red-400 bg-red-950/50 border-red-800';
      case 'high': return 'text-orange-400 bg-orange-950/50 border-orange-800';
      case 'medium': return 'text-amber-400 bg-amber-950/50 border-amber-800';
      case 'low': return 'text-blue-400 bg-blue-950/50 border-blue-800';
      default: return 'text-zinc-400 bg-zinc-900 border-zinc-700';
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'gap': return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-950 text-red-400 border border-red-800">GAP</span>;
      case 'partial': return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-950 text-amber-400 border border-amber-800">PARTIAL</span>;
      case 'satisfied': return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">SATISFIED</span>;
      case 'remediated': return <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-950 text-blue-400 border border-blue-800">REMEDIATED</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
              CENDIAGAPSCAN<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 mt-1">Compliance gap analysis across {FRAMEWORKS.length} regulatory frameworks</p>
          <ServiceInfoDropdown config={gapScannerInfo} className="mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-500">Overall Coverage</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{overallCoverage}%</p>
          <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${overallCoverage}%` }} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-zinc-500">Open Findings</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{FINDINGS.filter(f => f.status !== 'remediated' && f.status !== 'satisfied').length}</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-red-400">{severityCounts.critical} critical</span>
            <span className="text-orange-400">{severityCounts.high} high</span>
            <span className="text-amber-400">{severityCounts.medium} med</span>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-500">Frameworks Scanned</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{FRAMEWORKS.length}</p>
          <p className="text-xs text-zinc-500 mt-2">{FRAMEWORKS.filter(f => f.status === 'aligned').length} aligned · {FRAMEWORKS.filter(f => f.status === 'partial').length} partial</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500">Last Scan</span>
          </div>
          <p className="text-lg font-bold text-zinc-100">{new Date().toLocaleDateString()}</p>
          <p className="text-xs text-zinc-500 mt-2">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Framework Coverage Grid */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Framework Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setSelectedFramework(selectedFramework === fw.id ? null : fw.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedFramework === fw.id
                  ? 'border-emerald-600 bg-emerald-950/20'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200">{fw.shortName}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  fw.status === 'aligned' ? 'bg-emerald-950 text-emerald-400' :
                  fw.status === 'partial' ? 'bg-amber-950 text-amber-400' :
                  'bg-red-950 text-red-400'
                }`}>
                  {fw.coveragePercent}%
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${fw.coveragePercent >= 85 ? 'bg-emerald-500' : fw.coveragePercent >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${fw.coveragePercent}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span className="text-emerald-500">{fw.satisfied} met</span>
                <span className="text-amber-500">{fw.partial} partial</span>
                <span className="text-red-500">{fw.gaps} gaps</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Findings Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            Findings {selectedFramework && <span className="text-sm font-normal text-zinc-500"> — {FRAMEWORKS.find(f => f.id === selectedFramework)?.shortName}</span>}
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {filteredFindings.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
              No findings match the current filters.
            </div>
          ) : (
            filteredFindings.map((finding) => (
              <div key={finding.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFinding(expandedFinding === finding.id ? null : finding.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${severityColor(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{finding.requirement}</p>
                    <p className="text-xs text-zinc-500 truncate">{finding.description}</p>
                  </div>
                  <span className="text-xs text-zinc-500 flex-shrink-0">{finding.framework}</span>
                  {statusBadge(finding.status)}
                  {expandedFinding === finding.id ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                </button>
                {expandedFinding === finding.id && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 mb-1">Description</p>
                      <p className="text-sm text-zinc-300">{finding.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 mb-1">Recommendation</p>
                      <p className="text-sm text-zinc-300">{finding.recommendation}</p>
                    </div>
                    {finding.evidence && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 mb-1">Evidence</p>
                        <p className="text-sm text-zinc-500 font-mono">{finding.evidence}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { GapScannerPage };
export default GapScannerPage;
