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

import { useLocation } from 'react-router-dom';
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
} from 'lucide-react';

const ENTERPRISE_FEATURES = [
  { icon: Flame, label: 'Stress-Test', desc: 'Adversarial stress testing & red team simulations' },
  { icon: Activity, label: 'Comply', desc: 'Continuous compliance monitoring across 10 frameworks' },
  { icon: Shield, label: 'Gap Scan', desc: 'Compliance gap analysis across EU AI Act, NIST, ISO, GDPR, HIPAA' },
  { icon: Lock, label: 'Escrow', desc: 'Shamir Secret Sharing with VDF time-locks' },
  { icon: Scale, label: 'Govern', desc: 'Constitutional court, decision packets & dispute resolution' },
  { icon: Globe, label: 'Sovereign', desc: '22 sovereign deployment patterns for air-gapped environments' },
  { icon: Monitor, label: 'Operate', desc: 'CendiaPulse live operations monitor with WebSocket streaming' },
];

const STRATEGIC_FEATURES = [
  { icon: AlertTriangle, label: 'COLLAPSE', desc: 'Adversarial policy stress-testing with 19 attack agents' },
  { icon: Building2, label: 'SGAS', desc: 'Synthetic Governance Agent System — societal-scale verification' },
  { icon: Factory, label: 'Verticals', desc: '30 industry verticals with full agent packs (12+ agents each)' },
  { icon: Globe, label: 'Frontier', desc: 'Crisis bunker, nation-scale coordination, frontier capabilities' },
];

const FOUNDATION_INCLUDED = [
  'The Council — Multi-agent deliberation engine',
  'CendiaReplay — Decision playback theater',
  'DECIDE — Chronos, PreMortem, Ghost Board',
  'DCII — 6 crisis immunization services',
  'CendiaGateway — AI governance proxy',
  'Immutable audit ledger with Merkle trees',
  '30 industry vertical frameworks',
];

// Map route segments to friendly feature names
const ROUTE_LABELS: Record<string, { name: string; tier: 'enterprise' | 'strategic' }> = {
  'compliance': { name: 'Continuous Compliance', tier: 'enterprise' },
  'gap-scanner': { name: 'CendiaGapScan', tier: 'enterprise' },
  'escrow': { name: 'CendiaEscrow', tier: 'enterprise' },
  'governance': { name: 'Governance', tier: 'enterprise' },
  'decision-packets': { name: 'Decision Packets', tier: 'enterprise' },
  'constitutional-court': { name: 'CendiaCourt', tier: 'enterprise' },
  'monitor': { name: 'CendiaPulse', tier: 'enterprise' },
  'crown': { name: 'Crown Jewels', tier: 'enterprise' },
  'echo': { name: 'CendiaEcho', tier: 'enterprise' },
  'redteam': { name: 'CendiaRedTeam', tier: 'enterprise' },
  'gnosis': { name: 'CendiaGnosis', tier: 'enterprise' },
  'lens': { name: 'CendiaLens', tier: 'enterprise' },
  'sovereign': { name: 'Sovereign', tier: 'enterprise' },
  'collapse': { name: 'COLLAPSE', tier: 'strategic' },
  'sgas': { name: 'SGAS', tier: 'strategic' },
  'verticals': { name: 'Verticals', tier: 'strategic' },
  'frontier': { name: 'Frontier', tier: 'strategic' },
  'sanctuary': { name: 'Frontier', tier: 'strategic' },
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
  const { name: featureName, tier } = detectFeature(location.pathname);

  const tierLabel = tier === 'strategic' ? 'Strategic' : 'Enterprise';
  const tierColor = tier === 'strategic' ? 'amber' : 'indigo';

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
        <p className="text-sm sm:text-base text-gray-400 text-center max-w-xl mx-auto mb-10 leading-relaxed">
          You're using <span className="text-white font-medium">Datacendia Core</span> (Foundation tier).
          Upgrade to the full platform to unlock {featureName} and {tier === 'strategic' ? '15+' : '10+'} additional capabilities.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <a
            href="mailto:enterprise@datacendia.com?subject=Datacendia%20Enterprise%20Inquiry"
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
            href="https://datacendia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            View Pricing
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Two columns: Enterprise + Strategic features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-gray-300">Included in Foundation (your current plan)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FOUNDATION_INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500/50 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-gray-600 text-center mt-8">
          Questions? Contact <a href="mailto:enterprise@datacendia.com" className="text-indigo-400/70 hover:text-indigo-400">enterprise@datacendia.com</a> · Datacendia Enterprise includes everything in Foundation plus all Enterprise and Strategic capabilities.
        </p>
      </div>
    </div>
  );
}
