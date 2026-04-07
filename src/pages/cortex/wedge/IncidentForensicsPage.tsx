/**
 * Page — AI Incident Forensics
 *
 * Wedge 3: When an AI makes a wrong decision, produce court-grade evidence.
 * Incident submission → forensic analysis → legal evidence package.
 *
 * @exports IncidentForensicsPage
 * @module pages/cortex/wedge/IncidentForensicsPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useCallback } from 'react';
import {
  Shield, AlertTriangle, FileText, Loader2, ChevronRight,
  Clock, CheckCircle, XCircle, Download, Scale, Lock,
  Hash, Users, DollarSign, Eye, Fingerprint, BookOpen,
  Target, ArrowRight, ShieldAlert, Zap, Link, Building2,
  Copy, ExternalLink,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface IncidentForm {
  organizationName: string;
  contactEmail: string;
  contactName: string;
  incidentDate: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  aiSystem: string;
  aiProvider: string;
  aiModel: string;
  expectedOutcome: string;
  actualOutcome: string;
  impactDescription: string;
  affectedParties: string;
  estimatedDamageUsd: number;
  inputData: string;
  outputData: string;
  additionalContext: string;
}

interface TimelineEvent {
  timestamp: string;
  event: string;
  source: string;
  significance: string;
  verified: boolean;
}

interface Evidence {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  hash: string;
  classification: string;
  admissibility: string;
  content: string;
}

interface ForensicReport {
  reportId: string;
  incidentId: string;
  organizationName: string;
  generatedAt: string;
  classification: string;
  timeline: TimelineEvent[];
  rootCause: {
    primaryCause: string;
    contributingFactors: string[];
    systemicIssues: string[];
    aiModelFactors: string[];
  };
  impactAssessment: {
    financialImpact: { estimated: number; currency: string; breakdown: Record<string, number> };
    operationalImpact: string;
    reputationalImpact: string;
    regulatoryImpact: string;
    affectedParties: string[];
    litigationRisk: string;
  };
  evidenceChain: Evidence[];
  immediateActions: string[];
  preventionMeasures: string[];
  complianceImplications: Array<{ framework: string; requirement: string; violation: boolean; description: string }>;
  legalSummary: {
    headline: string;
    keyFacts: string[];
    liabilityAssessment: string;
    defensibleActions: string[];
    documentation: string[];
  };
  attestation: {
    hash: string;
    algorithm: string;
    timestamp: string;
    signedBy: string;
    chainOfCustody: Array<{ action: string; actor: string; timestamp: string; hash: string }>;
  };
}

// =============================================================================
// OPTIONS
// =============================================================================

const CATEGORIES = ['Customer-Facing Error', 'Financial Decision Error', 'Legal/Compliance Error', 'Medical/Health Error', 'HR/Hiring Decision Error', 'Data Breach', 'Discrimination/Bias', 'Misinformation', 'Safety Incident', 'Privacy Violation'];
const AI_PROVIDERS = ['OpenAI', 'Anthropic', 'Google AI', 'Microsoft', 'Internal/Custom', 'Unknown'];

// =============================================================================
// INCIDENT SUBMISSION FORM
// =============================================================================

const IncidentSubmissionForm: React.FC<{ onSubmit: (form: IncidentForm) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IncidentForm>({
    organizationName: '', contactEmail: '', contactName: '',
    incidentDate: new Date().toISOString().slice(0, 16),
    severity: 'high', category: 'Customer-Facing Error',
    title: '', description: '',
    aiSystem: '', aiProvider: 'OpenAI', aiModel: '',
    expectedOutcome: '', actualOutcome: '',
    impactDescription: '', affectedParties: '',
    estimatedDamageUsd: 100000,
    inputData: '', outputData: '', additionalContext: '',
  });

  const update = (partial: Partial<IncidentForm>) => setForm(prev => ({ ...prev, ...partial }));

  const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean; required?: boolean }> = ({ label, value, onChange, placeholder, type = 'text', textarea, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}{required && ' *'}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 outline-none" />
      )}
    </div>
  );

  const steps = [
    // Step 0: Contact & Incident
    <div key="incident" className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Incident Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Organization" value={form.organizationName} onChange={v => update({ organizationName: v })} placeholder="Acme Corp" required />
        <Input label="Your Name" value={form.contactName} onChange={v => update({ contactName: v })} placeholder="Jane Smith" required />
        <Input label="Email" value={form.contactEmail} onChange={v => update({ contactEmail: v })} placeholder="jane@acme.com" type="email" required />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Incident Date *</label>
          <input type="datetime-local" value={form.incidentDate} onChange={e => update({ incidentDate: e.target.value })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Severity</label>
          <div className="flex gap-2">
            {(['critical', 'high', 'medium', 'low'] as const).map(s => (
              <button key={s} onClick={() => update({ severity: s })} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', form.severity === s ? (s === 'critical' ? 'bg-red-500/20 border-red-500/40 text-red-400' : s === 'high' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : s === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-green-500/20 border-green-500/40 text-green-400') : 'bg-sovereign-dark border-sovereign-border text-gray-500')}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
          <select value={form.category} onChange={e => update({ category: e.target.value })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Input label="Incident Title" value={form.title} onChange={v => update({ title: v })} placeholder="AI chatbot provided incorrect refund amount to customer" required />
      <Input label="Description" value={form.description} onChange={v => update({ description: v })} placeholder="Describe what happened in detail..." textarea />
    </div>,

    // Step 1: AI System
    <div key="ai" className="space-y-4">
      <h2 className="text-xl font-semibold text-white">AI System Involved</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="AI System Name" value={form.aiSystem} onChange={v => update({ aiSystem: v })} placeholder="Customer Support Chatbot" required />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">AI Provider</label>
          <select value={form.aiProvider} onChange={e => update({ aiProvider: e.target.value })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none">
            {AI_PROVIDERS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <Input label="Model (if known)" value={form.aiModel} onChange={v => update({ aiModel: v })} placeholder="gpt-4o" />
      </div>
      <Input label="Expected Outcome" value={form.expectedOutcome} onChange={v => update({ expectedOutcome: v })} placeholder="AI should have quoted $49.99 refund per company policy" textarea required />
      <Input label="Actual Outcome" value={form.actualOutcome} onChange={v => update({ actualOutcome: v })} placeholder="AI quoted $4,999 refund — 100x the correct amount" textarea required />
      <Input label="Impact Description" value={form.impactDescription} onChange={v => update({ impactDescription: v })} placeholder="Customer received an incorrect refund, requiring manual reversal..." textarea />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Affected Parties" value={form.affectedParties} onChange={v => update({ affectedParties: v })} placeholder="Customer John Doe, Finance team" />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Estimated Damage (USD)</label>
          <input type="number" value={form.estimatedDamageUsd} onChange={e => update({ estimatedDamageUsd: parseInt(e.target.value) || 0 })} className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>
    </div>,

    // Step 2: Evidence
    <div key="evidence" className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Available Evidence</h2>
      <p className="text-sm text-gray-400">Provide any available data from the AI interaction. This strengthens your forensic evidence package.</p>
      <Input label="AI Input (prompt/request sent to the AI)" value={form.inputData} onChange={v => update({ inputData: v })} placeholder="Paste the input that was sent to the AI system..." textarea />
      <Input label="AI Output (response received)" value={form.outputData} onChange={v => update({ outputData: v })} placeholder="Paste the AI's response that caused the incident..." textarea />
      <Input label="Additional Context" value={form.additionalContext} onChange={v => update({ additionalContext: v })} placeholder="Any additional logs, screenshots descriptions, or context..." textarea />
    </div>,
  ];

  const canSubmit = form.organizationName && form.contactEmail && form.title && form.aiSystem && form.expectedOutcome && form.actualOutcome;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
          <Fingerprint className="w-4 h-4" />
          Court-Grade AI Forensics
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Incident Forensics</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          When an AI system makes a wrong decision, we produce a court-admissible
          forensic evidence package — timeline, root cause, and legal-grade documentation.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Incident', 'AI System', 'Evidence'].map((label, i) => (
          <React.Fragment key={i}>
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium', i === step ? 'bg-purple-500/20 text-purple-400' : i < step ? 'text-green-400' : 'text-gray-600')}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">{i + 1}</span>}
              {label}
            </div>
            {i < 2 && <ChevronRight className="w-4 h-4 text-gray-700" />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-sovereign-card border border-sovereign-border rounded-2xl p-8">
        {steps[step]}
        <div className="flex justify-between mt-8 pt-6 border-t border-sovereign-border">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className={cn('flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors', step === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-300 hover:text-white bg-sovereign-dark border border-sovereign-border')}>
            Back
          </button>
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => canSubmit && onSubmit(form)} disabled={loading || !canSubmit} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20 transition-all">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Fingerprint className="w-5 h-5" /> Run Forensic Analysis</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// FORENSIC REPORT VIEW
// =============================================================================

const ForensicReportView: React.FC<{ report: ForensicReport; onNew: () => void }> = ({ report, onNew }) => {
  const [tab, setTab] = useState<'timeline' | 'rootcause' | 'impact' | 'evidence' | 'legal' | 'prevention'>('timeline');
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(report.attestation.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const SeverityBadge: React.FC<{ level: string }> = ({ level }) => {
    const colors: Record<string, string> = { critical: 'bg-red-500/20 text-red-400 border-red-500/30', high: 'bg-orange-500/20 text-orange-400 border-orange-500/30', medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', low: 'bg-green-500/20 text-green-400 border-green-500/30' };
    return <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', colors[level] || colors.medium)}>{level.toUpperCase()}</span>;
  };

  const tabs = [
    { id: 'timeline' as const, label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'rootcause' as const, label: 'Root Cause', icon: <Target className="w-4 h-4" /> },
    { id: 'impact' as const, label: 'Impact', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'evidence' as const, label: `Evidence (${report.evidenceChain.length})`, icon: <Fingerprint className="w-4 h-4" /> },
    { id: 'legal' as const, label: 'Legal Package', icon: <Scale className="w-4 h-4" /> },
    { id: 'prevention' as const, label: 'Prevention', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Forensic Analysis Report</h1>
            <SeverityBadge level={report.classification} />
          </div>
          <p className="text-gray-500">
            Incident <span className="font-mono text-gray-400">{report.incidentId}</span>
            {' · '}{report.organizationName}
            {' · '}{new Date(report.generatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onNew} className="px-4 py-2 rounded-lg bg-sovereign-card border border-sovereign-border text-gray-300 hover:text-white transition-colors">New Analysis</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"><Download className="w-4 h-4" /> Export Package</button>
        </div>
      </div>

      {/* Attestation Banner */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-sm font-semibold text-purple-400">Cryptographically Attested Evidence Package</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              {report.attestation.algorithm}: {report.attestation.hash.slice(0, 32)}...
              <span className="text-gray-600 ml-2">Signed by: {report.attestation.signedBy}</span>
            </div>
          </div>
        </div>
        <button onClick={copyHash} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sovereign-dark border border-sovereign-border text-gray-400 hover:text-white text-xs transition-colors">
          {copiedHash ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedHash ? 'Copied' : 'Copy Hash'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sovereign-dark rounded-xl p-1 border border-sovereign-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap', tab === t.id ? 'bg-sovereign-card text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
        {tab === 'timeline' && (
          <div className="space-y-0">
            <h3 className="text-lg font-semibold text-white mb-6">Event Timeline Reconstruction</h3>
            {report.timeline.map((event, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={cn('w-3 h-3 rounded-full mt-1.5', event.significance === 'critical' ? 'bg-red-500' : event.significance === 'important' ? 'bg-orange-500' : 'bg-gray-600')} />
                  {i < report.timeline.length - 1 && <div className="w-px flex-1 bg-sovereign-border mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                    {event.verified && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', event.significance === 'critical' ? 'bg-red-500/10 text-red-400' : event.significance === 'important' ? 'bg-orange-500/10 text-orange-400' : 'bg-gray-500/10 text-gray-400')}>{event.significance}</span>
                  </div>
                  <p className="text-sm text-gray-200">{event.event}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Source: {event.source}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'rootcause' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Primary Cause</h3>
              <p className="text-gray-300 bg-sovereign-dark p-4 rounded-xl border border-sovereign-border">{report.rootCause.primaryCause}</p>
            </div>
            {[
              { title: 'Contributing Factors', items: report.rootCause.contributingFactors, color: 'text-orange-400' },
              { title: 'Systemic Issues', items: report.rootCause.systemicIssues, color: 'text-red-400' },
              { title: 'AI Model Factors', items: report.rootCause.aiModelFactors, color: 'text-purple-400' },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">{section.title}</h4>
                <div className="space-y-1.5">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm">
                      <ChevronRight className={cn('w-4 h-4 mt-0.5 flex-shrink-0', section.color)} />
                      <span className="text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'impact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-sovereign-dark rounded-xl p-4 border border-sovereign-border text-center">
                <DollarSign className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">${report.impactAssessment.financialImpact.estimated.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Estimated Damage</div>
              </div>
              <div className="bg-sovereign-dark rounded-xl p-4 border border-sovereign-border text-center">
                <Users className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{report.impactAssessment.affectedParties.length}</div>
                <div className="text-xs text-gray-500">Affected Parties</div>
              </div>
              <div className="bg-sovereign-dark rounded-xl p-4 border border-sovereign-border text-center">
                <Scale className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{report.impactAssessment.litigationRisk.replace('_', ' ').toUpperCase()}</div>
                <div className="text-xs text-gray-500">Litigation Risk</div>
              </div>
              <div className="bg-sovereign-dark rounded-xl p-4 border border-sovereign-border text-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{report.complianceImplications.filter(c => c.violation).length}</div>
                <div className="text-xs text-gray-500">Regulatory Violations</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Financial Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(report.impactAssessment.financialImpact.breakdown).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2 border-b border-sovereign-border last:border-0">
                    <span className="text-sm text-gray-400">{k}</span>
                    <span className="text-sm font-semibold text-white">${v.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Compliance Implications</h4>
              <div className="space-y-2">
                {report.complianceImplications.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-sovereign-dark border border-sovereign-border">
                    {c.violation ? <XCircle className="w-4 h-4 text-red-400 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />}
                    <div>
                      <div className="text-sm font-medium text-gray-200">{c.framework} — {c.requirement}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'evidence' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">Chain of Evidence</h3>
            <p className="text-sm text-gray-400 mb-4">Each piece of evidence is cryptographically hashed and timestamped for legal admissibility.</p>
            {report.evidenceChain.map((ev, i) => (
              <div key={i} className="rounded-xl border border-sovereign-border overflow-hidden">
                <div className="bg-sovereign-dark px-5 py-3 flex items-center justify-between border-b border-sovereign-border">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-white text-sm">{ev.description}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', ev.admissibility === 'court_admissible' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20')}>{ev.admissibility.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-600">{ev.hash.slice(0, 16)}...</span>
                </div>
                <div className="px-5 py-3">
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">{ev.content}</pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'legal' && (
          <div className="space-y-6">
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">{report.legalSummary.headline}</h3>
              <div className="space-y-2 mb-4">
                {report.legalSummary.keyFacts.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />{f}</div>
                ))}
              </div>
              <div className="bg-sovereign-dark rounded-lg p-4 border border-sovereign-border">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Liability Assessment</div>
                <p className="text-sm text-gray-300">{report.legalSummary.liabilityAssessment}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Defensible Actions</h4>
              {report.legalSummary.defensibleActions.map((a, i) => (
                <div key={i} className="flex items-center gap-2 py-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-green-400" />{a}</div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Documentation Package</h4>
              {report.legalSummary.documentation.map((d, i) => (
                <div key={i} className="flex items-center gap-2 py-2 text-sm text-gray-300"><FileText className="w-4 h-4 text-blue-400" />{d}</div>
              ))}
            </div>
            {/* Chain of Custody */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Chain of Custody</h4>
              <div className="space-y-2">
                {report.attestation.chainOfCustody.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs p-2 rounded bg-sovereign-dark border border-sovereign-border">
                    <Link className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-gray-400">{c.action}</span>
                    <span className="text-gray-500">{c.actor}</span>
                    <span className="font-mono text-gray-600 ml-auto">{c.hash}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'prevention' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Immediate Actions</h3>
              <div className="space-y-2">
                {report.immediateActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Prevention Measures</h3>
              <div className="space-y-2">
                {report.preventionMeasures.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Prevent Future Incidents Before They Happen</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Deploy Datacendia's Regulator's Receipt for every AI decision — creating court-admissible evidence
          automatically, so when the next incident happens, you have a complete forensic trail from day one.
        </p>
        <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors inline-flex items-center gap-2">
          <Shield className="w-5 h-5" /> Schedule a Demo
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const IncidentForensicsPage: React.FC = () => {
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (form: IncidentForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/wedge/incident-forensics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setReport(data.data);
    } catch (err) {
      console.error('Forensic analysis failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-sovereign-dark p-6 md:p-8">
      {report ? <ForensicReportView report={report} onNew={() => setReport(null)} /> : <IncidentSubmissionForm onSubmit={handleSubmit} loading={loading} />}
    </div>
  );
};

export default IncidentForensicsPage;
