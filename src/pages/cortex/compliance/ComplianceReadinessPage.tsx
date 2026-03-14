/**
 * Page — Compliance Readiness (Foundation Tier)
 *
 * A free compliance overview with basic checklist, framework status,
 * and upsell to the full Enterprise compliance suite.
 *
 * @exports ComplianceReadinessPage
 * @module pages/cortex/compliance/ComplianceReadinessPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle2, AlertTriangle, Lock, ArrowRight, Crown,
  FileCheck, ExternalLink, ChevronRight, Activity,
} from 'lucide-react';

// =============================================================================
// DATA
// =============================================================================

interface FrameworkStatus {
  name: string;
  shortName: string;
  score: number;
  status: 'compliant' | 'warning' | 'gap';
  lastChecked: string;
  gapCount?: number;
  description: string;
}

const FRAMEWORKS: FrameworkStatus[] = [
  { name: 'General Data Protection Regulation', shortName: 'GDPR', score: 100, status: 'compliant', lastChecked: '2 days ago', description: 'EU data protection & privacy regulation' },
  { name: 'Health Insurance Portability Act', shortName: 'HIPAA', score: 100, status: 'compliant', lastChecked: '1 day ago', description: 'US healthcare data protection' },
  { name: 'Service Organization Control 2', shortName: 'SOC 2', score: 100, status: 'compliant', lastChecked: '4 hours ago', description: 'Trust service criteria for service organizations' },
  { name: 'EU Artificial Intelligence Act', shortName: 'EU AI Act', score: 98, status: 'warning', lastChecked: '1 hour ago', description: 'EU regulation on artificial intelligence systems' },
  { name: 'Information Security Management', shortName: 'ISO 27001', score: 94, status: 'gap', lastChecked: '6 hours ago', gapCount: 3, description: 'International information security standard' },
];

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  category: 'governance' | 'audit' | 'risk' | 'evidence';
}

const CHECKLIST: ChecklistItem[] = [
  { id: 'gov-1', label: 'Decision governance policy defined', description: 'Formal policy for AI-assisted decision-making', completed: true, category: 'governance' },
  { id: 'gov-2', label: 'Human-in-the-loop requirements set', description: 'Defined which decisions require human oversight', completed: true, category: 'governance' },
  { id: 'gov-3', label: 'Agent roles & permissions configured', description: 'Council agents have explicit scope boundaries', completed: true, category: 'governance' },
  { id: 'aud-1', label: 'Audit trail enabled', description: 'All deliberations produce immutable audit records', completed: true, category: 'audit' },
  { id: 'aud-2', label: 'Decision replay available', description: 'Past decisions can be replayed and reviewed', completed: true, category: 'audit' },
  { id: 'aud-3', label: 'Evidence chain verified', description: 'Merkle tree verification of evidence integrity', completed: true, category: 'audit' },
  { id: 'risk-1', label: 'IISS baseline established', description: 'Institutional Immune System Score baseline set', completed: true, category: 'risk' },
  { id: 'risk-2', label: 'Crisis immunization active', description: 'DCII services monitoring decision health', completed: true, category: 'risk' },
  { id: 'risk-3', label: 'Continuous compliance monitoring', description: 'Real-time framework drift detection', completed: false, category: 'risk' },
  { id: 'ev-1', label: 'Regulator\'s Receipt generation', description: 'Auto-generated compliance evidence packets', completed: true, category: 'evidence' },
  { id: 'ev-2', label: 'Cross-jurisdiction analysis', description: 'Multi-jurisdiction compliance mapping', completed: false, category: 'evidence' },
  { id: 'ev-3', label: 'Gap remediation workflow', description: 'Automated compliance gap resolution process', completed: false, category: 'evidence' },
];

const ENTERPRISE_FEATURES = [
  { label: 'Continuous Compliance Monitor', desc: 'Real-time drift detection across 10+ frameworks' },
  { label: 'CendiaGapScan', desc: 'Automated gap analysis with remediation workflows' },
  { label: 'Cross-Jurisdiction Analysis', desc: 'Multi-jurisdiction regulatory mapping & conflict detection' },
  { label: 'Regulatory Sandbox', desc: 'Test compliance changes in an isolated environment' },
];

// =============================================================================
// HELPERS
// =============================================================================

const statusColor = (status: string) =>
  status === 'compliant' ? 'text-emerald-400' : status === 'warning' ? 'text-yellow-400' : 'text-orange-400';

const statusBg = (status: string) =>
  status === 'compliant' ? 'bg-emerald-500/10 border-emerald-500/20' : status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-orange-500/10 border-orange-500/20';

const categoryLabel = (cat: string) =>
  cat === 'governance' ? 'Governance' : cat === 'audit' ? 'Audit Trail' : cat === 'risk' ? 'Risk Management' : 'Evidence';

const categoryColor = (cat: string) =>
  cat === 'governance' ? 'text-blue-400' : cat === 'audit' ? 'text-emerald-400' : cat === 'risk' ? 'text-amber-400' : 'text-violet-400';

// =============================================================================
// COMPONENT
// =============================================================================

export const ComplianceReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const completedCount = CHECKLIST.filter(c => c.completed).length;
  const totalCount = CHECKLIST.length;
  const readinessScore = Math.round((completedCount / totalCount) * 100);
  const avgFrameworkScore = Math.round(FRAMEWORKS.reduce((s, f) => s + f.score, 0) / FRAMEWORKS.length);
  const categories = ['governance', 'audit', 'risk', 'evidence'] as const;

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-100">Compliance Readiness</h1>
              <p className="text-sm text-neutral-500">Foundation tier compliance overview & checklist</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/[0.06] text-blue-400 text-xs font-medium">
            <Shield className="w-3 h-3" />
            Foundation
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Readiness Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400">{readinessScore}%</span>
            <span className="text-xs text-neutral-500">{completedCount}/{totalCount} items</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Based on Foundation compliance checklist</p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Avg Framework Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-green-400">{avgFrameworkScore}%</span>
            <span className="text-xs text-neutral-500">{FRAMEWORKS.length} frameworks</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Across tracked compliance frameworks</p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Next Audit</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400">14</span>
            <span className="text-xs text-neutral-500">days (SEC quarterly)</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            <button onClick={() => navigate('/cortex/dcii')} className="text-violet-400 hover:text-violet-300 transition-colors">
              View DCII Report →
            </button>
          </p>
        </div>
      </div>

      {/* Framework Status */}
      <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700/50">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Framework Status</h2>
          </div>
          <span className="text-[10px] text-neutral-500">{FRAMEWORKS.filter(f => f.status === 'compliant').length}/{FRAMEWORKS.length} compliant</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4">
          {FRAMEWORKS.map(fw => (
            <div key={fw.shortName} className={`p-3 rounded-lg border transition-all ${statusBg(fw.status)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neutral-200">{fw.shortName}</span>
                {fw.status === 'compliant'
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
              <p className={`text-xl font-black ${statusColor(fw.status)}`}>{fw.score}%</p>
              <p className="text-[10px] text-neutral-500">Last: {fw.lastChecked}</p>
              {fw.gapCount && <p className="text-[10px] text-orange-400 mt-0.5">Gap: {fw.gapCount} controls</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Checklist + Enterprise Upsell */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Checklist (2 cols) */}
        <div className="lg:col-span-2 bg-neutral-900/80 border border-neutral-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-700/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Compliance Checklist</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-800/50">
            {categories.map(cat => (
              <div key={cat} className="p-4">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${categoryColor(cat)}`}>
                  {categoryLabel(cat)}
                </p>
                <div className="space-y-2">
                  {CHECKLIST.filter(c => c.category === cat).map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-600 shrink-0 mt-0.5 flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-neutral-500" />
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-medium ${item.completed ? 'text-neutral-200' : 'text-neutral-500'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-neutral-500">{item.description}</p>
                        {!item.completed && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 mt-1">
                            <Lock className="w-2.5 h-2.5" /> Requires Enterprise
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Upsell */}
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-300">Unlock Full Compliance</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Enterprise Edition adds continuous monitoring, automated gap remediation, and cross-jurisdiction analysis.
            </p>
            <ul className="space-y-3 mb-5">
              {ENTERPRISE_FEATURES.map(f => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-white font-medium">{f.label}</span>
                    <p className="text-[11px] text-neutral-500">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="mailto:enterprise@datacendia.com?subject=Datacendia%20Enterprise%20Compliance%20Inquiry"
              className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              Request Enterprise Access
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/cortex/dcii')} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left">
                <span className="text-xs text-neutral-300">DCII Dashboard</span>
                <ChevronRight className="w-3 h-3 text-neutral-500" />
              </button>
              <button onClick={() => navigate('/cortex/security/audit')} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left">
                <span className="text-xs text-neutral-300">Audit Log</span>
                <ChevronRight className="w-3 h-3 text-neutral-500" />
              </button>
              <button onClick={() => navigate('/cortex/security/policies')} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left">
                <span className="text-xs text-neutral-300">Security Policies</span>
                <ChevronRight className="w-3 h-3 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReadinessPage;
