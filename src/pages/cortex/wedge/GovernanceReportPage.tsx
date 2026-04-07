/**
 * Page — AI Governance Report Generator
 *
 * Wedge 2: Generate a board-ready AI governance report in 10 minutes.
 * Multi-step questionnaire → comprehensive compliance report → PDF export.
 *
 * @exports GovernanceReportPage
 * @module pages/cortex/wedge/GovernanceReportPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useCallback } from 'react';
import {
  FileText, ChevronRight, ChevronLeft, Loader2, Shield,
  AlertTriangle, CheckCircle, XCircle, Download, BarChart3,
  Building2, Users, Globe, Cpu, Scale, TrendingUp, Clock,
  Target, ArrowRight, ShieldCheck, Zap, BookOpen, DollarSign,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface Questionnaire {
  organizationName: string;
  industry: string;
  employeeCount: number;
  annualRevenue: string;
  regions: string[];
  contactEmail: string;
  contactName: string;
  aiSystemCount: number;
  aiUseCases: string[];
  aiProviders: string[];
  hasAIPolicy: boolean;
  hasAIInventory: boolean;
  hasAIRiskAssessment: boolean;
  hasHumanOversight: boolean;
  hasAuditTrail: boolean;
  applicableFrameworks: string[];
  hasDataProtectionOfficer: boolean;
  hasDPIA: boolean;
  hasIncidentResponsePlan: boolean;
  lastSecurityAudit: string;
  dataClassificationPolicy: boolean;
  piiProcessing: boolean;
  crossBorderDataTransfer: boolean;
  dataRetentionPolicy: boolean;
}

interface ReportCategory {
  name: string;
  score: number;
  maxScore: number;
  status: string;
  findings: string[];
  recommendations: string[];
}

interface ComplianceReq {
  id: string;
  requirement: string;
  status: string;
  gap: string;
  remediation: string;
  effort: string;
  priority: number;
}

interface ComplianceFramework {
  framework: string;
  applicability: string;
  overallCompliance: number;
  requirements: ComplianceReq[];
}

interface RiskItem {
  id: string;
  category: string;
  description: string;
  likelihood: string;
  impact: string;
  riskScore: number;
  currentControls: string;
  recommendedControls: string;
}

interface RoadmapPhase {
  phase: string;
  timeline: string;
  actions: Array<{ action: string; owner: string; effort: string; impact: string; frameworks: string[] }>;
}

interface Report {
  reportId: string;
  organizationName: string;
  generatedAt: string;
  executiveSummary: {
    overallScore: number;
    riskLevel: string;
    headline: string;
    keyFindings: string[];
    immediateActions: string[];
  };
  governanceScore: {
    overall: number;
    categories: ReportCategory[];
  };
  aiInventory: { totalSystems: number; byRiskLevel: Record<string, number>; gaps: string[] };
  complianceMatrix: ComplianceFramework[];
  riskAssessment: { overallRisk: string; risks: RiskItem[] };
  remediationRoadmap: RoadmapPhase[];
  boardSummary: {
    headline: string;
    riskPosture: string;
    investmentRequired: string;
    timelineToCompliance: string;
    keyMetrics: Array<{ label: string; value: string; status: string }>;
    recommendations: string[];
  };
  integrityHash: string;
}

// =============================================================================
// OPTIONS
// =============================================================================

const INDUSTRIES = ['Financial Services', 'Healthcare', 'Legal', 'Technology', 'Manufacturing', 'Government', 'Defense', 'Retail', 'Insurance', 'Pharmaceutical'];
const REVENUES = ['Under $10M', '$10M–$50M', '$50M–$250M', '$250M–$1B', 'Over $1B'];
const REGIONS = ['North America', 'EU/EEA', 'UK', 'Asia-Pacific', 'Latin America', 'Middle East', 'Africa'];
const USE_CASES = ['Customer Service Chatbot', 'Document Analysis', 'Code Generation', 'Data Analysis', 'Content Creation', 'Fraud Detection', 'Risk Assessment', 'HR Screening', 'Medical Diagnosis', 'Legal Research', 'Financial Modeling', 'Image/Video Analysis'];
const AI_PROVIDERS = ['OpenAI', 'Anthropic', 'Google AI', 'Microsoft Azure AI', 'AWS Bedrock', 'Ollama (Local)', 'Meta Llama', 'Mistral', 'Cohere', 'Custom/Internal'];
const FRAMEWORKS = ['EU AI Act', 'GDPR', 'NIST AI RMF', 'SOC 2', 'ISO 42001', 'HIPAA'];

// =============================================================================
// QUESTIONNAIRE WIZARD
// =============================================================================

const QuestionnaireWizard: React.FC<{ onSubmit: (q: Questionnaire) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(0);
  const [q, setQ] = useState<Questionnaire>({
    organizationName: '', industry: 'Financial Services', employeeCount: 500,
    annualRevenue: '$50M–$250M', regions: ['North America'], contactEmail: '', contactName: '',
    aiSystemCount: 5, aiUseCases: [], aiProviders: [],
    hasAIPolicy: false, hasAIInventory: false, hasAIRiskAssessment: false,
    hasHumanOversight: false, hasAuditTrail: false,
    applicableFrameworks: ['EU AI Act', 'NIST AI RMF'], hasDataProtectionOfficer: false,
    hasDPIA: false, hasIncidentResponsePlan: false, lastSecurityAudit: '',
    dataClassificationPolicy: false, piiProcessing: true, crossBorderDataTransfer: false,
    dataRetentionPolicy: false,
  });

  const update = (partial: Partial<Questionnaire>) => setQ(prev => ({ ...prev, ...partial }));
  const toggleArray = (field: keyof Questionnaire, value: string) => {
    const arr = q[field] as string[];
    update({ [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] });
  };

  const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }> = ({ label, value, onChange, desc }) => (
    <div className="flex items-start justify-between py-3 border-b border-sovereign-border last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-200">{label}</div>
        {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={cn('w-12 h-6 rounded-full transition-colors relative', value ? 'bg-green-600' : 'bg-gray-700')}>
        <div className={cn('w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform', value ? 'translate-x-6' : 'translate-x-0.5')} />
      </button>
    </div>
  );

  const Chips: React.FC<{ options: string[]; selected: string[]; onToggle: (v: string) => void }> = ({ options, selected, onToggle }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onToggle(opt)} className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
          selected.includes(opt) ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-sovereign-dark border-sovereign-border text-gray-500 hover:text-gray-300'
        )}>
          {opt}
        </button>
      ))}
    </div>
  );

  const steps = [
    // Step 0: Organization
    <div key="org" className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Your Organization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization Name *</label>
          <input value={q.organizationName} onChange={e => update({ organizationName: e.target.value })} placeholder="Acme Corporation" className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry</label>
          <select value={q.industry} onChange={e => update({ industry: e.target.value })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none">
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Employee Count</label>
          <input type="number" value={q.employeeCount} onChange={e => update({ employeeCount: parseInt(e.target.value) || 100 })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Annual Revenue</label>
          <select value={q.annualRevenue} onChange={e => update({ annualRevenue: e.target.value })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none">
            {REVENUES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact Name *</label>
          <input value={q.contactName} onChange={e => update({ contactName: e.target.value })} placeholder="Jane Smith" className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact Email *</label>
          <input type="email" value={q.contactEmail} onChange={e => update({ contactEmail: e.target.value })} placeholder="jane@acme.com" className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Operating Regions</label>
        <Chips options={REGIONS} selected={q.regions} onToggle={v => toggleArray('regions', v)} />
      </div>
    </div>,

    // Step 1: AI Usage
    <div key="ai" className="space-y-5">
      <h2 className="text-xl font-semibold text-white">AI Systems & Usage</h2>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">How many AI systems does your organization use?</label>
        <input type="number" value={q.aiSystemCount} onChange={e => update({ aiSystemCount: parseInt(e.target.value) || 1 })} min={1} className="w-32 bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">AI Use Cases</label>
        <Chips options={USE_CASES} selected={q.aiUseCases} onToggle={v => toggleArray('aiUseCases', v)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">AI Providers</label>
        <Chips options={AI_PROVIDERS} selected={q.aiProviders} onToggle={v => toggleArray('aiProviders', v)} />
      </div>
    </div>,

    // Step 2: Governance Posture
    <div key="gov" className="space-y-2">
      <h2 className="text-xl font-semibold text-white mb-4">Current Governance Posture</h2>
      <Toggle label="AI Acceptable Use Policy" desc="Formal policy governing AI tool usage" value={q.hasAIPolicy} onChange={v => update({ hasAIPolicy: v })} />
      <Toggle label="AI System Inventory" desc="Centralized registry of all AI systems" value={q.hasAIInventory} onChange={v => update({ hasAIInventory: v })} />
      <Toggle label="AI Risk Assessment" desc="Formal risk assessment covering AI systems" value={q.hasAIRiskAssessment} onChange={v => update({ hasAIRiskAssessment: v })} />
      <Toggle label="Human Oversight" desc="Human review for AI-assisted decisions" value={q.hasHumanOversight} onChange={v => update({ hasHumanOversight: v })} />
      <Toggle label="AI Audit Trail" desc="Logging of AI inputs, outputs, and decisions" value={q.hasAuditTrail} onChange={v => update({ hasAuditTrail: v })} />
      <Toggle label="Data Classification Policy" desc="Data classified by sensitivity level" value={q.dataClassificationPolicy} onChange={v => update({ dataClassificationPolicy: v })} />
      <Toggle label="Data Retention Policy" desc="Defined retention periods for AI data" value={q.dataRetentionPolicy} onChange={v => update({ dataRetentionPolicy: v })} />
    </div>,

    // Step 3: Compliance
    <div key="compliance" className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Compliance & Data Protection</h2>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Applicable Regulatory Frameworks</label>
        <Chips options={FRAMEWORKS} selected={q.applicableFrameworks} onToggle={v => toggleArray('applicableFrameworks', v)} />
      </div>
      <Toggle label="Data Protection Officer" desc="DPO or equivalent role designated" value={q.hasDataProtectionOfficer} onChange={v => update({ hasDataProtectionOfficer: v })} />
      <Toggle label="Data Protection Impact Assessment" desc="DPIA conducted for AI systems" value={q.hasDPIA} onChange={v => update({ hasDPIA: v })} />
      <Toggle label="AI Incident Response Plan" desc="Playbook for AI-specific incidents" value={q.hasIncidentResponsePlan} onChange={v => update({ hasIncidentResponsePlan: v })} />
      <Toggle label="PII Processing" desc="AI systems process personal data" value={q.piiProcessing} onChange={v => update({ piiProcessing: v })} />
      <Toggle label="Cross-Border Data Transfer" desc="AI data transferred between jurisdictions" value={q.crossBorderDataTransfer} onChange={v => update({ crossBorderDataTransfer: v })} />
    </div>,
  ];

  const canProceed = step === 0 ? q.organizationName && q.contactEmail && q.contactName : true;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          Free AI Governance Assessment
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Governance Report Generator</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Answer a few questions about your AI usage and governance posture.
          Get a board-ready compliance report in under 2 minutes.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Organization', 'AI Usage', 'Governance', 'Compliance'].map((label, i) => (
          <React.Fragment key={i}>
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium', i === step ? 'bg-blue-500/20 text-blue-400' : i < step ? 'text-green-400' : 'text-gray-600')}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">{i + 1}</span>}
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 3 && <ChevronRight className="w-4 h-4 text-gray-700" />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-sovereign-card border border-sovereign-border rounded-2xl p-8">
        {steps[step]}
        <div className="flex justify-between mt-8 pt-6 border-t border-sovereign-border">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className={cn('flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors', step === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-300 hover:text-white bg-sovereign-dark border border-sovereign-border')}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => canProceed && setStep(s => s + 1)} disabled={!canProceed} className={cn('flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors', canProceed ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed')}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => onSubmit(q)} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20 transition-all">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><FileText className="w-5 h-5" /> Generate Report</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// REPORT VIEW
// =============================================================================

const ReportView: React.FC<{ report: Report; onNew: () => void }> = ({ report, onNew }) => {
  const [tab, setTab] = useState<'executive' | 'score' | 'compliance' | 'risks' | 'roadmap' | 'board'>('executive');
  const { executiveSummary: es, governanceScore: gs } = report;

  const ScoreMeter: React.FC<{ score: number; size?: 'sm' | 'lg' }> = ({ score, size = 'sm' }) => {
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';
    const r = size === 'lg' ? 58 : 32;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
      <svg className={size === 'lg' ? 'w-32 h-32' : 'w-20 h-20'} viewBox={size === 'lg' ? '0 0 128 128' : '0 0 72 72'}>
        <circle cx={size === 'lg' ? 64 : 36} cy={size === 'lg' ? 64 : 36} r={r} fill="none" stroke="#1f2937" strokeWidth={size === 'lg' ? 8 : 5} />
        <circle cx={size === 'lg' ? 64 : 36} cy={size === 'lg' ? 64 : 36} r={r} fill="none" stroke={color} strokeWidth={size === 'lg' ? 8 : 5} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size === 'lg' ? 64 : 36} ${size === 'lg' ? 64 : 36})`} className="transition-all duration-1000" />
        <text x={size === 'lg' ? 64 : 36} y={size === 'lg' ? 68 : 39} textAnchor="middle" className="fill-white font-bold" fontSize={size === 'lg' ? 28 : 16}>{score}</text>
      </svg>
    );
  };

  const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'compliant' || status === 'pass') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'partial') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const tabs = [
    { id: 'executive' as const, label: 'Executive Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'score' as const, label: 'Governance Score', icon: <Target className="w-4 h-4" /> },
    { id: 'compliance' as const, label: 'Compliance Matrix', icon: <Scale className="w-4 h-4" /> },
    { id: 'risks' as const, label: 'Risk Assessment', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'roadmap' as const, label: 'Remediation Roadmap', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'board' as const, label: 'Board Summary', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Governance Report</h1>
          <p className="text-gray-500 mt-1">{report.organizationName} · {new Date(report.generatedAt).toLocaleDateString()} · <span className="font-mono">{report.reportId}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={onNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sovereign-card border border-sovereign-border text-gray-300 hover:text-white transition-colors">New Report</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"><Download className="w-4 h-4" /> Export PDF</button>
        </div>
      </div>

      {/* Score Banner */}
      <div className={cn('rounded-2xl p-6 border flex items-center gap-8',
        es.riskLevel === 'critical' ? 'bg-red-500/5 border-red-500/20' :
        es.riskLevel === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
        es.riskLevel === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
        'bg-green-500/5 border-green-500/20'
      )}>
        <ScoreMeter score={es.overallScore} size="lg" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">{es.headline}</h2>
          <div className="flex gap-4">
            {report.boardSummary.keyMetrics.map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-bold text-white">{m.value}</div>
                <div className="text-xs text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sovereign-dark rounded-xl p-1 border border-sovereign-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap', tab === t.id ? 'bg-sovereign-card text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
        {tab === 'executive' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Key Findings</h3>
              <div className="space-y-2">
                {es.keyFindings.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Immediate Actions Required</h3>
              <div className="space-y-2">
                {es.immediateActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'score' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gs.categories.map((cat, i) => (
              <div key={i} className="rounded-xl p-5 border border-sovereign-border bg-sovereign-dark">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">{cat.name}</span>
                  <StatusIcon status={cat.status} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <ScoreMeter score={cat.score} />
                  <div className="text-3xl font-bold text-white">{cat.score}<span className="text-lg text-gray-500">%</span></div>
                </div>
                {cat.findings.length > 0 && (
                  <div className="text-xs text-red-400 mb-1">{cat.findings[0]}</div>
                )}
                {cat.recommendations.length > 0 && (
                  <div className="text-xs text-blue-400">{cat.recommendations[0]}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'compliance' && (
          <div className="space-y-8">
            {report.complianceMatrix.map((fw, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{fw.framework}</h3>
                    <p className="text-xs text-gray-500">{fw.applicability}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{fw.overallCompliance}%</div>
                    <div className="text-xs text-gray-500">Compliant</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {fw.requirements.map((req, j) => (
                    <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-sovereign-dark border border-sovereign-border">
                      <StatusIcon status={req.status} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200">{req.id}: {req.requirement}</div>
                        {req.gap && <div className="text-xs text-red-400 mt-0.5">{req.gap}</div>}
                        {req.remediation && <div className="text-xs text-blue-400 mt-0.5">{req.remediation}</div>}
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded', req.effort === 'high' ? 'bg-red-500/10 text-red-400' : req.effort === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400')}>{req.effort}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'risks' && (
          <div className="space-y-4">
            {report.riskAssessment.risks.map((risk, i) => (
              <div key={i} className="rounded-xl p-5 border border-sovereign-border bg-sovereign-dark">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{risk.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Score:</span>
                    <span className={cn('text-sm font-bold', risk.riskScore >= 80 ? 'text-red-400' : risk.riskScore >= 50 ? 'text-orange-400' : 'text-yellow-400')}>{risk.riskScore}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{risk.description}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="text-gray-500">Current Controls:</span> <span className="text-gray-300">{risk.currentControls}</span></div>
                  <div><span className="text-gray-500">Recommended:</span> <span className="text-blue-400">{risk.recommendedControls}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'roadmap' && (
          <div className="space-y-8">
            {report.remediationRoadmap.map((phase, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">{i + 1}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{phase.phase}</h3>
                    <p className="text-xs text-gray-500">Timeline: {phase.timeline}</p>
                  </div>
                </div>
                <div className="space-y-2 ml-11">
                  {phase.actions.map((action, j) => (
                    <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-sovereign-dark border border-sovereign-border">
                      <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-200">{action.action}</div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <span>Owner: {action.owner}</span>
                          <span>Effort: {action.effort}</span>
                          <span>Frameworks: {action.frameworks.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'board' && (
          <div className="space-y-6">
            <div className="text-center p-8 rounded-xl bg-sovereign-dark border border-sovereign-border">
              <h2 className="text-2xl font-bold text-white mb-2">{report.boardSummary.headline}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div><div className="text-sm text-gray-500">Risk Posture</div><div className="text-lg font-bold text-white mt-1">{report.boardSummary.riskPosture}</div></div>
                <div><div className="text-sm text-gray-500">Investment Required</div><div className="text-lg font-bold text-white mt-1">{report.boardSummary.investmentRequired}</div></div>
                <div><div className="text-sm text-gray-500">Timeline to Compliance</div><div className="text-lg font-bold text-white mt-1">{report.boardSummary.timelineToCompliance}</div></div>
                <div><div className="text-sm text-gray-500">Frameworks</div><div className="text-lg font-bold text-white mt-1">{report.complianceMatrix.length}</div></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Board Recommendations</h3>
              {report.boardSummary.recommendations.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 text-sm text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Want Continuous AI Governance Monitoring?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          This report is a point-in-time snapshot. Datacendia provides continuous compliance monitoring,
          automated audit trails, and real-time risk scoring — keeping your governance posture current.
        </p>
        <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors inline-flex items-center gap-2">
          <Shield className="w-5 h-5" /> Schedule a Demo
        </button>
      </div>

      <div className="text-center text-xs text-gray-600 font-mono">Integrity: {report.integrityHash}</div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const GovernanceReportPage: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (q: Questionnaire) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/wedge/governance-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q),
      });
      const data = await res.json();
      if (data.success) setReport(data.data);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-sovereign-dark p-6 md:p-8">
      {report ? <ReportView report={report} onNew={() => setReport(null)} /> : <QuestionnaireWizard onSubmit={handleSubmit} loading={loading} />}
    </div>
  );
};

export default GovernanceReportPage;
