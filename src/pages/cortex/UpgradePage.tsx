// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Page — Enterprise Upgrade
 *
 * Displayed when a user navigates to an enterprise-only feature in the
 * Community Edition. Shows what's available and links to pricing.
 *
 * @module pages/cortex/UpgradePage
 */

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Lock,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Crown,
  Building2,
  Flame,
  Activity,
  Scale,
  Monitor,
  AlertTriangle,
  Factory,
  ExternalLink,
  Calendar,
  BarChart3,
  Dna,
  Castle,
  Eye,
  Brain,
  Network,
  Clock,
  TrendingUp,
} from 'lucide-react';

const ENTERPRISE_FEATURES = [
  { icon: Flame, label: 'Stress-Test', desc: 'Adversarial stress testing & red team simulations' },
  { icon: Activity, label: 'Comply', desc: 'Continuous compliance monitoring across 10 frameworks' },
  { icon: Shield, label: 'Gap Scan', desc: 'Compliance gap analysis across EU AI Act, NIST, ISO, GDPR, HIPAA' },
  { icon: Dna, label: 'Intelligence', desc: 'CendiaLens, Decision DNA, What-If, Orbit, Consensus Builder' },
  { icon: Lock, label: 'Escrow', desc: 'Shamir Secret Sharing with VDF time-locks' },
  { icon: Scale, label: 'Govern', desc: 'Constitutional court, decision packets & dispute resolution' },
  { icon: Globe, label: 'Sovereign', desc: '22 sovereign deployment patterns for air-gapped environments' },
  { icon: Monitor, label: 'Operate', desc: 'CendiaPulse live operations monitor with WebSocket streaming' },
  { icon: Castle, label: 'Crown Jewels', desc: 'CendiaEcho, CendiaRedTeam, CendiaGnosis dashboards' },
];

const STRATEGIC_FEATURES = [
  { icon: AlertTriangle, label: 'COLLAPSE', desc: 'Adversarial policy stress-testing with 19 attack agents' },
  { icon: Building2, label: 'SGAS', desc: 'Synthetic Governance Agent System — societal-scale verification' },
  { icon: Factory, label: 'Verticals', desc: '26 industry verticals with full agent packs (12+ agents each)' },
  { icon: Globe, label: 'Frontier', desc: 'Crisis bunker, nation-scale coordination, frontier capabilities' },
];

const FOUNDATION_INCLUDED = [
  'The Council — 13 pages: deliberation, replay, modes, analytics',
  'DECIDE — Chronos, PreMortem, Ghost Board, Decision Debt',
  'DCII — 7 crisis immunization services (Truth, Notary, Witness…)',
  'CendiaGateway — AI governance proxy',
  'Pulse — System monitoring, alerts & metrics',
  'Bridge — Workflow automation, approvals & integrations',
  'Graph — Knowledge graph explorer with entity lineage',
  'Compliance Readiness — Basic checklist & framework status',
  'Data Management — Sources, catalog, quality, import/export',
  'Security — Access control, audit log, policies',
];

// Contextual previews — shown when a user hits a specific gated feature
const FEATURE_PREVIEWS: Record<string, { headline: string; bullets: string[]; stat: string; statLabel: string }> = {
  'Continuous Compliance': {
    headline: 'Real-time compliance drift detection across 10+ frameworks',
    bullets: ['Auto-detect EU AI Act Article 14 gaps in minutes', 'Generate regulator-ready evidence packets', 'Track remediation workflows end-to-end'],
    stat: '94%', statLabel: 'faster audit prep',
  },
  'CendiaGapScan': {
    headline: 'Automated compliance gap analysis with remediation workflows',
    bullets: ['Scan across GDPR, HIPAA, SOC 2, EU AI Act, ISO 27001', 'Prioritized gap remediation with cost estimates', 'Auto-generate compliance evidence'],
    stat: '8', statLabel: 'frameworks scanned',
  },
  'CendiaEscrow': {
    headline: 'Cryptographic escrow with Shamir Secret Sharing',
    bullets: ['VDF time-locks for scheduled release', 'Multi-party key management', 'Tamper-proof evidence preservation'],
    stat: '256-bit', statLabel: 'encryption standard',
  },
  'CendiaLens': {
    headline: 'AI explainability dashboard — see why every decision was made',
    bullets: ['Full decision lineage visualization', 'Agent contribution analysis', 'Bias detection & fairness metrics'],
    stat: '100%', statLabel: 'decision transparency',
  },
  'Decision DNA': {
    headline: 'Organizational decision pattern analytics',
    bullets: ['Map your organization\'s decision genome', 'Identify systemic decision biases', 'Benchmark against industry patterns'],
    stat: '47%', statLabel: 'faster pattern detection',
  },
  'What-If Scenarios': {
    headline: 'Scenario modeling — simulate decisions before committing',
    bullets: ['Monte Carlo decision simulations', 'Multi-variable sensitivity analysis', 'Risk-adjusted outcome projections'],
    stat: '1000+', statLabel: 'scenarios per minute',
  },
  'Consensus Builder': {
    headline: 'Multi-stakeholder consensus orchestration',
    bullets: ['Weighted voting with preference aggregation', 'Conflict resolution workflows', 'Real-time alignment tracking'],
    stat: '3x', statLabel: 'faster stakeholder alignment',
  },
  'CendiaPulse': {
    headline: 'Live operations monitor with WebSocket streaming',
    bullets: ['Real-time decision pipeline health', 'Agent performance dashboards', 'Anomaly detection & auto-alerting'],
    stat: '<100ms', statLabel: 'alert latency',
  },
  'Crown Jewels': {
    headline: 'Premium analytics dashboards for executive leadership',
    bullets: ['CendiaEcho — decision echo pattern analysis', 'CendiaRedTeam — adversarial stress testing', 'CendiaGnosis — knowledge synthesis engine'],
    stat: '3', statLabel: 'executive dashboards',
  },
  'Sovereign': {
    headline: '22 sovereign deployment patterns for air-gapped environments',
    bullets: ['Data diode, shadow council, QR air-gap bridge', 'TPM attestation & federated mesh', 'Full data residency compliance'],
    stat: '22', statLabel: 'deployment patterns',
  },
  'Governance': {
    headline: 'Constitutional court & decision packet governance',
    bullets: ['Formal dispute resolution process', 'Decision packet generation & approval', 'Constitutional policy enforcement'],
    stat: '60%', statLabel: 'faster governance cycles',
  },
  'COLLAPSE': {
    headline: 'Adversarial policy stress-testing with 19 attack agents',
    bullets: ['Simulate regulatory changes before they happen', 'Test policy resilience under extreme scenarios', 'Nation-scale governance stress testing'],
    stat: '19', statLabel: 'attack agent types',
  },
  'Verticals': {
    headline: '26 industry vertical packs with specialized AI agents',
    bullets: ['Healthcare, Financial Services, Government, Legal, Insurance…', '12+ specialized agents per vertical', 'Industry-specific compliance frameworks'],
    stat: '26', statLabel: 'industry verticals',
  },
};

// Map route segments to friendly feature names
const ROUTE_LABELS: Record<string, { name: string; tier: 'enterprise' | 'strategic' }> = {
  // Enterprise — Compliance
  'compliance': { name: 'Continuous Compliance', tier: 'enterprise' },
  'gap-scanner': { name: 'CendiaGapScan', tier: 'enterprise' },
  'cross-jurisdiction': { name: 'Cross-Jurisdiction Compliance', tier: 'enterprise' },
  'regulatory-sandbox': { name: 'Regulatory Sandbox', tier: 'enterprise' },
  // Enterprise — Crypto
  'escrow': { name: 'CendiaEscrow', tier: 'enterprise' },
  // Enterprise — Governance
  'governance': { name: 'Governance', tier: 'enterprise' },
  'decision-packets': { name: 'Decision Packets', tier: 'enterprise' },
  'constitutional-court': { name: 'CendiaCourt', tier: 'enterprise' },
  // Enterprise — Operations
  'monitor': { name: 'CendiaPulse', tier: 'enterprise' },
  // Enterprise — Crown Jewels
  'crown': { name: 'Crown Jewels', tier: 'enterprise' },
  'echo': { name: 'CendiaEcho', tier: 'enterprise' },
  'redteam': { name: 'CendiaRedTeam', tier: 'enterprise' },
  'gnosis': { name: 'CendiaGnosis', tier: 'enterprise' },
  // Enterprise — Advanced Intelligence
  'lens': { name: 'CendiaLens', tier: 'enterprise' },
  'regulatory': { name: 'Regulatory Intelligence', tier: 'enterprise' },
  'decision-dna': { name: 'Decision DNA', tier: 'enterprise' },
  'orbit': { name: 'Decision Orbit', tier: 'enterprise' },
  'consensus': { name: 'Consensus Builder', tier: 'enterprise' },
  'what-if': { name: 'What-If Scenarios', tier: 'enterprise' },
  'synthesis': { name: 'Synthesis Engine', tier: 'enterprise' },
  'rdp': { name: 'R&D Pipeline', tier: 'enterprise' },
  'audit-provenance': { name: 'Audit Provenance', tier: 'enterprise' },
  // Enterprise — Security
  'zkp': { name: 'Zero-Knowledge Proofs', tier: 'enterprise' },
  // Enterprise — Sovereign
  'sovereign': { name: 'Sovereign', tier: 'enterprise' },
  // Strategic
  'collapse': { name: 'COLLAPSE', tier: 'strategic' },
  'sgas': { name: 'SGAS', tier: 'strategic' },
  'verticals': { name: 'Verticals', tier: 'strategic' },
  'frontier': { name: 'Frontier', tier: 'strategic' },
  'sanctuary': { name: 'Frontier', tier: 'strategic' },
  'fifa': { name: 'FIFA Governance Scenarios', tier: 'strategic' },
  'uefa': { name: 'UEFA Walkthrough', tier: 'strategic' },
  // Strategic — individual verticals
  'healthcare': { name: 'Healthcare Vertical', tier: 'strategic' },
  'financial-services': { name: 'Financial Services Vertical', tier: 'strategic' },
  'government-legal': { name: 'Government & Legal Vertical', tier: 'strategic' },
  'legal': { name: 'Legal Vertical', tier: 'strategic' },
  'insurance': { name: 'Insurance Vertical', tier: 'strategic' },
  'pharmaceutical': { name: 'Pharmaceutical Vertical', tier: 'strategic' },
  'manufacturing': { name: 'Manufacturing Vertical', tier: 'strategic' },
  'energy-utilities': { name: 'Energy & Utilities Vertical', tier: 'strategic' },
  'technology': { name: 'Technology Vertical', tier: 'strategic' },
  'sports': { name: 'Sports Vertical', tier: 'strategic' },
  'aerospace': { name: 'Aerospace Vertical', tier: 'strategic' },
  'eu-banking': { name: 'EU Banking Vertical', tier: 'strategic' },
};

function detectFeature(pathname: string): { name: string; tier: 'enterprise' | 'strategic' } {
  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    if (ROUTE_LABELS[segments[i]]) return ROUTE_LABELS[segments[i]];
  }
  return { name: 'This feature', tier: 'enterprise' };
}

export default function UpgradePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name: featureName, tier } = detectFeature(location.pathname);
  const preview = FEATURE_PREVIEWS[featureName];

  const tierLabel = tier === 'strategic' ? 'Strategic' : 'Enterprise';

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-3xl">
        {/* Lock Badge */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
            tier === 'strategic'
              ? 'border-amber-500/20 bg-amber-500/[0.06] text-amber-400'
              : 'border-indigo-500/20 bg-indigo-500/[0.06] text-indigo-400'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium tracking-wider uppercase">{tierLabel} Tier</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-3">
          {featureName} requires {tierLabel} Edition
        </h1>
        <p className="text-sm sm:text-base text-gray-400 text-center max-w-xl mx-auto mb-8 leading-relaxed">
          You're using <span className="text-white font-medium">Datacendia Core</span> (Foundation tier).
          Upgrade to unlock {featureName} and {tier === 'strategic' ? '30+' : '20+'} additional capabilities.
        </p>

        {/* Contextual Feature Preview — the #1 conversion driver */}
        {preview && (
          <div className={`rounded-xl border p-6 mb-8 relative overflow-hidden ${
            tier === 'strategic'
              ? 'border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01]'
              : 'border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.04] to-indigo-600/[0.01]'
          }`}>
            <div className="absolute top-3 right-3">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                tier === 'strategic' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
              }`}>PREVIEW</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">
              What you'll get with {featureName}
            </h3>
            <p className={`text-xs mb-4 leading-relaxed ${
              tier === 'strategic' ? 'text-amber-200/70' : 'text-indigo-200/70'
            }`}>{preview.headline}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {preview.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    tier === 'strategic' ? 'text-amber-400/60' : 'text-indigo-400/60'
                  }`} />
                  <span className="text-[11px] text-gray-300">{b}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-baseline gap-1 ${
                tier === 'strategic' ? 'text-amber-400' : 'text-indigo-400'
              }`}>
                <span className="text-2xl font-black">{preview.stat}</span>
                <span className="text-[10px] opacity-70">{preview.statLabel}</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <span>Used by Fortune 500 governance teams</span>
              </div>
            </div>
          </div>
        )}

        {/* CTAs — dual: email + schedule demo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="mailto:enterprise@datacendia.com?subject=Datacendia%20Enterprise%20Inquiry%20-%20{featureName}"
            className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-medium transition-all ${
              tier === 'strategic'
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            <Crown className="w-4 h-4" />
            Request Enterprise Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://datacendia.com/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-medium text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.03] transition-all"
          >
            <Calendar className="w-4 h-4 opacity-60" />
            Schedule a Demo
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
          </a>
        </div>

        {/* Social proof bar */}
        <div className="flex items-center justify-center gap-6 mb-10 text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-500/50" />
            <span>SOC 2 Type II compliant</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-500/50" />
            <span>Air-gapped deployment ready</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-indigo-500/50" />
            <span>Apache 2.0 open core</span>
          </div>
        </div>

        {/* Two columns: Enterprise + Strategic features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Enterprise Features */}
          <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/[0.02] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-medium text-indigo-300 tracking-wide uppercase">Enterprise Tier</h3>
            </div>
            <ul className="space-y-3">
              {ENTERPRISE_FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <f.icon className="w-3.5 h-3.5 text-indigo-400/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-white font-medium">{f.label}</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-indigo-400/50 mt-4 font-mono">From $499/mo</p>
          </div>

          {/* Strategic Features */}
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.02] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-medium text-amber-300 tracking-wide uppercase">Strategic Tier</h3>
            </div>
            <ul className="space-y-3">
              {STRATEGIC_FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5">
                  <f.icon className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-white font-medium">{f.label}</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-400/50 mt-4 font-mono">Custom pricing</p>
          </div>
        </div>

        {/* What's included in Foundation */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-gray-300">Included in Foundation (your current plan)</h3>
            </div>
            <span className="text-[10px] text-emerald-400/60 font-mono">~60 pages · Free forever</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FOUNDATION_INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500/50 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-500">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/cortex/dashboard')}
            className="mt-4 text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            Return to Mission Control <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-gray-600 text-center mt-8">
          Questions? Contact <a href="mailto:enterprise@datacendia.com" className="text-indigo-400/70 hover:text-indigo-400">enterprise@datacendia.com</a> · <a href="https://datacendia.com/demo" target="_blank" rel="noopener noreferrer" className="text-indigo-400/70 hover:text-indigo-400">Schedule a demo</a> · Enterprise includes Foundation + all Enterprise and Strategic capabilities.
        </p>
      </div>
    </div>
  );
}
