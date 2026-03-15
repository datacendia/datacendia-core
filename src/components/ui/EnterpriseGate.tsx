/**
 * Component — Enterprise Gate
 *
 * Persuasive upgrade component shown when users hit enterprise/strategic-gated
 * features. Includes contextual previews, animated visuals, stats, dual CTAs,
 * social proof, and a "what you already have" section.
 *
 * Backward-compatible: accepts the same { featureName, description } props.
 *
 * @exports EnterpriseGate
 * @module components/ui/EnterpriseGate
 */

import { useEffect, useRef, useState } from 'react';
import {
  Lock,
  ArrowRight,
  Crown,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Calendar,
  ExternalLink,
  TrendingUp,
  Flame,
  Eye,
  Brain,
  Network,
  Castle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EnterpriseGateProps {
  featureName: string;
  description?: string;
  tier?: 'enterprise' | 'strategic';
}

interface FeaturePreview {
  headline: string;
  bullets: string[];
  stat: string;
  statLabel: string;
  icon: LucideIcon;
  color: string;        // tailwind color token, e.g. "indigo" | "amber"
  capabilities: string[];
}

// ---------------------------------------------------------------------------
// Contextual preview data — maps featureName → rich preview
// ---------------------------------------------------------------------------
const PREVIEWS: Record<string, FeaturePreview> = {
  'CendiaCollapse™': {
    headline: 'Adversarial policy stress-testing with 19 specialized agents across 7 failure domains',
    bullets: ['Simulate regulatory upheaval before it happens', 'Test policy resilience under extreme adversarial attack', 'Generate board-ready stress-test reports'],
    stat: '19', statLabel: 'attack agent types', icon: AlertTriangle, color: 'amber',
    capabilities: ['Policy Bombardment', 'Regulatory Shock', 'Agent Rebellion', 'Data Poisoning', 'Cascade Failure'],
  },
  'CendiaCrucible™': {
    headline: 'Adversarial stress testing — attack decisions with simulated threats before they become real',
    bullets: ['Red-team every decision automatically', 'Simulate insider threats and data poisoning', '140+ attack vectors across 7 failure domains'],
    stat: '140+', statLabel: 'attack vectors', icon: Flame, color: 'red',
    capabilities: ['Red Team Simulation', 'Threat Modeling', 'Resilience Scoring', 'Auto-Remediation'],
  },
  'CendiaSovereign™': {
    headline: '22 sovereign deployment patterns for air-gapped and data-resident environments',
    bullets: ['Data diode, shadow council, QR air-gap bridge', 'TPM attestation & federated mesh', 'Full data residency and sovereignty compliance'],
    stat: '22', statLabel: 'deployment patterns', icon: Shield, color: 'indigo',
    capabilities: ['Air-Gap Bridge', 'Shadow Council', 'Data Diode', 'TPM Attestation', 'Federated Mesh'],
  },
  'CendiaPanopticon™': {
    headline: 'Total observability for AI decision pipelines with real-time anomaly detection',
    bullets: ['Watch every agent decision in real-time', 'Detect anomalous patterns before they escalate', 'Full audit trail with cryptographic proofs'],
    stat: '<100ms', statLabel: 'detection latency', icon: Eye, color: 'cyan',
    capabilities: ['Real-Time Observability', 'Anomaly Detection', 'Pipeline Health', 'Alert Routing'],
  },
  'CendiaGnosis™': {
    headline: 'Knowledge synthesis engine — surface hidden patterns across your entire decision corpus',
    bullets: ['Cross-decision pattern mining', 'Organizational knowledge graph', 'Executive insight briefs auto-generated'],
    stat: '10x', statLabel: 'faster insight discovery', icon: Brain, color: 'purple',
    capabilities: ['Pattern Mining', 'Knowledge Graph', 'Insight Synthesis', 'Trend Alerts'],
  },
  'CendiaEcho™': {
    headline: 'Decision echo analysis — find recurring patterns, loops, and organizational blind spots',
    bullets: ['Detect decision cycles that repeat every quarter', 'Map organizational blind spots', 'Compare decisions across time for drift'],
    stat: '47%', statLabel: 'faster pattern detection', icon: Network, color: 'blue',
    capabilities: ['Echo Detection', 'Cycle Analysis', 'Drift Monitoring', 'Blind Spot Mapping'],
  },
  'CendiaRedTeam™': {
    headline: 'Automated red-team testing for every decision before it ships',
    bullets: ['Adversarial agents attack your conclusions', 'Find weaknesses human reviewers miss', 'Generate risk-adjusted confidence scores'],
    stat: '98%', statLabel: 'coverage of known attack types', icon: Flame, color: 'red',
    capabilities: ['Adversarial Attack', 'Weakness Discovery', 'Risk Scoring', 'Counter-Argument Gen'],
  },
  'SGAS': {
    headline: 'Synthetic Governance Agent System — societal-scale verification and simulation',
    bullets: ['Simulate governance at city, state, and national scale', 'Model regulatory impact before implementation', 'Multi-stakeholder alignment verification'],
    stat: '1M+', statLabel: 'simulated stakeholders', icon: Globe, color: 'amber',
    capabilities: ['Societal Simulation', 'Regulatory Impact', 'Multi-Stakeholder', 'Scale Testing'],
  },
  'CendiaSanctuary™': {
    headline: 'Crisis-mode governance bunker — maintain decision capability when everything else fails',
    bullets: ['Air-gapped crisis decision-making', 'Offline agent deliberation', 'Emergency succession protocols'],
    stat: '0', statLabel: 'external dependencies', icon: Castle, color: 'amber',
    capabilities: ['Crisis Mode', 'Offline Agents', 'Emergency Succession', 'Bunker Operations'],
  },
};

// Fallback preview for features without a specific entry
const DEFAULT_PREVIEW: FeaturePreview = {
  headline: 'Advanced AI governance capabilities for enterprise organizations',
  bullets: ['Full platform access with sovereign deployment', 'Priority support and dedicated success manager', 'Custom agent packs for your industry'],
  stat: '20+', statLabel: 'enterprise capabilities', icon: Zap, color: 'indigo',
  capabilities: ['Sovereign Deploy', 'Custom Agents', 'Priority Support', 'Advanced Analytics'],
};

// ---------------------------------------------------------------------------
// Animated canvas background
// ---------------------------------------------------------------------------
function GateCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    cv.width = cv.offsetWidth;
    cv.height = cv.offsetHeight;
    const W = cv.width;
    const H = cv.height;

    const hue = color === 'amber' ? '45' : color === 'red' ? '0' : color === 'purple' ? '270' : color === 'cyan' ? '190' : color === 'blue' ? '220' : '230';

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5, a: Math.random() * 0.5 + 0.2,
      });
    }

    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${0.06 * (1 - d / 100)})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

// ---------------------------------------------------------------------------
// Animated stat counter
// ---------------------------------------------------------------------------
function AnimatedStat({ value, label, color }: { value: string; label: string; color: string }) {
  const [display, setDisplay] = useState('0');
  const numericPart = value.replace(/[^0-9.]/g, '');
  const prefix = value.replace(/[0-9.,]+.*/, '');
  const suffix = value.replace(/.*?[0-9.,]+/, '');

  useEffect(() => {
    if (!numericPart) { setDisplay(value); return; }
    const target = parseFloat(numericPart);
    const duration = 1200;
    const start = Date.now();
    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }
    tick();
  }, [numericPart, prefix, suffix, value]);

  const colorMap: Record<string, string> = {
    amber: 'text-amber-400', red: 'text-red-400', indigo: 'text-indigo-400',
    purple: 'text-purple-400', cyan: 'text-cyan-400', blue: 'text-blue-400',
  };

  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`text-3xl font-black tracking-tight ${colorMap[color] || 'text-indigo-400'}`}>{display}</span>
      <span className="text-[11px] text-zinc-500">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function EnterpriseGate({ featureName, description, tier = 'enterprise' }: EnterpriseGateProps) {
  const preview = PREVIEWS[featureName] || DEFAULT_PREVIEW;
  const isStrategic = tier === 'strategic' || featureName.includes('Collapse') || featureName.includes('SGAS') || featureName.includes('Sanctuary');
  const tierLabel = isStrategic ? 'Strategic' : 'Enterprise';

  const borderColor = isStrategic ? 'border-amber-500/20' : 'border-indigo-500/20';
  const badgeBg = isStrategic ? 'bg-amber-500/[0.06] text-amber-400 border-amber-500/20' : 'bg-indigo-500/[0.06] text-indigo-400 border-indigo-500/20';
  const ctaBg = isStrategic ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-indigo-600 hover:bg-indigo-500 text-white';
  const accentText = isStrategic ? 'text-amber-400' : 'text-indigo-400';
  const accentBg = isStrategic ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400';
  const previewBorder = isStrategic
    ? 'border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01]'
    : 'border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.04] to-indigo-600/[0.01]';
  const checkColor = isStrategic ? 'text-amber-400/60' : 'text-indigo-400/60';

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-3xl">

        {/* Hero area with animated background */}
        <div className="relative rounded-2xl overflow-hidden mb-8 p-8 sm:p-10 text-center">
          <GateCanvas color={preview.color} />
          <div className="relative z-10">
            {/* Tier badge */}
            <div className="flex justify-center mb-5">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${badgeBg}`}>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium tracking-wider uppercase">{tierLabel} Tier</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">{featureName}</h1>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {description || `This feature requires Datacendia ${tierLabel} Edition.`}
            </p>

            {/* Capability chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {preview.capabilities.map((cap) => (
                <span key={cap} className={`text-[10px] px-2.5 py-1 rounded-full border ${borderColor} ${accentBg} font-medium`}>
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contextual preview card */}
        <div className={`rounded-xl border p-6 mb-8 relative overflow-hidden ${previewBorder}`}>
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${accentBg}`}>PREVIEW</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentBg}`}>
              <preview.icon className={`w-4 h-4 ${accentText}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">What you'll get with {featureName}</h3>
              <p className={`text-xs mt-1 leading-relaxed ${isStrategic ? 'text-amber-200/70' : 'text-indigo-200/70'}`}>
                {preview.headline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 mt-4">
            {preview.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${checkColor}`} />
                <span className="text-[11px] text-zinc-300 leading-relaxed">{b}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
            <AnimatedStat value={preview.stat} label={preview.statLabel} color={preview.color} />
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <TrendingUp className="w-3 h-3" />
              <span>Used by Fortune 500 governance teams</span>
            </div>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <a
            href={`mailto:enterprise@datacendia.com?subject=Datacendia%20${tierLabel}%20Inquiry%20-%20${encodeURIComponent(featureName)}`}
            className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-medium transition-all ${ctaBg}`}
          >
            <Crown className="w-4 h-4" />
            Request {tierLabel} Access
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

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mb-8 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-500/50" />
            <span>SOC 2 Type II</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-500/50" />
            <span>Air-gapped ready</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-indigo-500/50" />
            <span>Apache 2.0 open core</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500/50" />
            <span>Sovereign-first</span>
          </div>
        </div>

        {/* What Enterprise/Strategic includes */}
        <div className={`rounded-xl border p-5 mb-6 ${previewBorder}`}>
          <div className="flex items-center gap-2 mb-3">
            {isStrategic
              ? <Crown className="w-4 h-4 text-amber-400" />
              : <Zap className="w-4 h-4 text-indigo-400" />}
            <h3 className={`text-sm font-medium tracking-wide uppercase ${accentText}`}>
              {tierLabel} Tier includes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isStrategic ? [
              'COLLAPSE — 19 adversarial attack agents',
              'SGAS — Societal-scale governance simulation',
              '26 industry vertical agent packs',
              'Frontier — Crisis bunker & nation-scale',
              'Everything in Enterprise tier',
            ] : [
              'Stress-Test — Red team simulations',
              'Comply — 10 compliance frameworks',
              'Gap Scan — Automated gap analysis',
              'Escrow — Shamir Secret Sharing + VDF',
              'Govern — Constitutional court',
              'Sovereign — 22 deployment patterns',
              'Operate — CendiaPulse live monitor',
              'Crown Jewels — Echo, RedTeam, Gnosis',
              'Intelligence — Lens, DNA, What-If, Orbit',
              'Everything in Foundation tier',
            ]).map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className={`w-3 h-3 shrink-0 mt-0.5 ${checkColor}`} />
                <span className="text-xs text-zinc-400">{item}</span>
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-3 font-mono ${isStrategic ? 'text-amber-400/50' : 'text-indigo-400/50'}`}>
            {isStrategic ? 'Custom pricing · Dedicated success team' : 'From $499/mo · Annual license'}
          </p>
        </div>

        {/* What you already have */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-300">Included in Foundation (your current plan)</h3>
            </div>
            <span className="text-[10px] text-emerald-400/60 font-mono">~60 pages · Free forever</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {[
              'The Council — 13 deliberation pages',
              'DECIDE — Chronos, PreMortem, Ghost Board',
              'DCII — 7 crisis immunization services',
              'CendiaGateway — AI governance proxy',
              'Pulse — Monitoring & alerts',
              'Bridge — Workflow automation',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500/50 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-zinc-600 text-center mt-6">
          Questions? <a href="mailto:enterprise@datacendia.com" className="text-indigo-400/70 hover:text-indigo-400">enterprise@datacendia.com</a>
          {' · '}
          <a href="https://datacendia.com/pricing" target="_blank" rel="noopener noreferrer" className="text-indigo-400/70 hover:text-indigo-400">View pricing</a>
          {' · '}
          <a href="https://datacendia.com/demo" target="_blank" rel="noopener noreferrer" className="text-indigo-400/70 hover:text-indigo-400">Schedule demo</a>
        </p>
      </div>
    </div>
  );
}
