/**
 * Component — Upgrade Nudge
 *
 * Subtle, dismissible upsell banner shown at natural friction points
 * (e.g. after deliberation completion, after key actions). Contextual
 * messages guide users toward Enterprise/Strategic features.
 *
 * @exports UpgradeNudge
 * @module components/ui/UpgradeNudge
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ArrowRight,
  Zap,
  Shield,
  Crown,
  Flame,
  Eye,
  Brain,
  Network,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type NudgeVariant =
  | 'crucible'      // After deliberation — "stress-test this decision"
  | 'redteam'       // After synthesis — "red-team your conclusions"
  | 'crown'         // After completion — "deeper analysis with Crown Jewels"
  | 'comply'        // After any decision — "check compliance"
  | 'sovereign'     // General — "deploy sovereign"
  | 'panopticon'    // After many decisions — "observe all pipelines"
  | 'collapse'      // Power users — "stress-test at scale"
  | 'intelligence'  // After insights — "deeper intelligence"
  | 'milestone';    // Usage milestones — "you've made N decisions"

interface UpgradeNudgeProps {
  variant: NudgeVariant;
  /** Optional: override the default dismissal key (for per-session/per-page control) */
  dismissKey?: string;
  /** Optional: compact mode for inline placement */
  compact?: boolean;
  /** Optional: number to display in milestone variant */
  count?: number;
}

// ---------------------------------------------------------------------------
// Variant configuration
// ---------------------------------------------------------------------------
interface NudgeConfig {
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  bgGradient: string;
  tagText: string;
  tagColor: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  stat?: string;
  statLabel?: string;
}

const NUDGE_CONFIGS: Record<NudgeVariant, NudgeConfig> = {
  crucible: {
    icon: Flame,
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/15',
    bgGradient: 'from-red-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-red-400 bg-red-500/10',
    headline: 'Stress-test this decision before it ships',
    body: 'CendiaCrucible™ attacks your conclusions with 140+ adversarial vectors across 7 failure domains. Find weaknesses before real adversaries do.',
    ctaText: 'Explore Crucible',
    ctaLink: '/cortex/upgrade',
    stat: '140+',
    statLabel: 'attack vectors',
  },
  redteam: {
    icon: Flame,
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/15',
    bgGradient: 'from-red-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-red-400 bg-red-500/10',
    headline: 'Red-team your conclusions automatically',
    body: 'CendiaRedTeam™ generates adversarial counter-arguments and risk-adjusted confidence scores for every decision.',
    ctaText: 'Explore RedTeam',
    ctaLink: '/cortex/crown/redteam',
    stat: '98%',
    statLabel: 'attack coverage',
  },
  crown: {
    icon: Crown,
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/15',
    bgGradient: 'from-amber-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-amber-400 bg-amber-500/10',
    headline: 'Go deeper with the Crown Jewels',
    body: 'Echo finds decision patterns you\'re repeating. Gnosis synthesizes insights across your entire corpus. RedTeam attacks your blind spots.',
    ctaText: 'Explore Crown Jewels',
    ctaLink: '/cortex/crown',
    stat: '3',
    statLabel: 'analysis engines',
  },
  comply: {
    icon: Shield,
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/15',
    bgGradient: 'from-emerald-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-emerald-400 bg-emerald-500/10',
    headline: 'Is this decision compliant?',
    body: 'Continuous Compliance Monitor checks decisions against 10 regulatory frameworks in real-time. Auto-resolve 94% of compliance gaps.',
    ctaText: 'Explore Compliance',
    ctaLink: '/cortex/compliance/continuous-monitor',
    stat: '10',
    statLabel: 'frameworks',
  },
  sovereign: {
    icon: Shield,
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/15',
    bgGradient: 'from-indigo-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-indigo-400 bg-indigo-500/10',
    headline: 'Deploy on your infrastructure',
    body: '22 sovereign deployment patterns including air-gap bridge, data diode, TPM attestation, and federated mesh. Zero cloud dependencies.',
    ctaText: 'Explore Sovereign',
    ctaLink: '/cortex/sovereign',
    stat: '22',
    statLabel: 'patterns',
  },
  panopticon: {
    icon: Eye,
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/15',
    bgGradient: 'from-cyan-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-cyan-400 bg-cyan-500/10',
    headline: 'Total observability for your decision pipelines',
    body: 'CendiaPanopticon™ watches every agent decision in real-time. <100ms anomaly detection with cryptographic audit proofs.',
    ctaText: 'Explore Panopticon',
    ctaLink: '/cortex/sovereign/panopticon',
    stat: '<100ms',
    statLabel: 'detection',
  },
  collapse: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/15',
    bgGradient: 'from-amber-500/[0.03] to-transparent',
    tagText: 'STRATEGIC',
    tagColor: 'text-amber-400 bg-amber-500/10',
    headline: 'What happens when everything fails?',
    body: 'CendiaCollapse™ deploys 19 adversarial agents across 7 failure domains to stress-test your governance at the breaking point.',
    ctaText: 'Explore Collapse',
    ctaLink: '/cortex/sovereign/collapse',
    stat: '19',
    statLabel: 'attack agents',
  },
  intelligence: {
    icon: Brain,
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/15',
    bgGradient: 'from-purple-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-purple-400 bg-purple-500/10',
    headline: 'Surface hidden patterns in your decisions',
    body: 'Lens, Decision DNA, What-If simulation, and Orbit analysis — 4 intelligence modules to see what human reviewers miss.',
    ctaText: 'Explore Intelligence',
    ctaLink: '/cortex/intelligence/lens',
    stat: '10x',
    statLabel: 'faster insights',
  },
  milestone: {
    icon: TrendingUp,
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/15',
    bgGradient: 'from-indigo-500/[0.03] to-transparent',
    tagText: 'ENTERPRISE',
    tagColor: 'text-indigo-400 bg-indigo-500/10',
    headline: 'You\'re making great decisions',
    body: 'Enterprise teams use Crucible to stress-test, Crown Jewels for pattern detection, and Sovereign for air-gapped deployment.',
    ctaText: 'See Enterprise Features',
    ctaLink: '/cortex/upgrade',
    stat: '20+',
    statLabel: 'capabilities',
  },
};

// ---------------------------------------------------------------------------
// Persistence — track dismissed nudges per session
// ---------------------------------------------------------------------------
const DISMISSED_KEY_PREFIX = 'datacendia_nudge_dismissed_';

function isDismissed(key: string): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

function setDismissed(key: string): void {
  try {
    sessionStorage.setItem(DISMISSED_KEY_PREFIX + key, '1');
  } catch {
    // sessionStorage unavailable
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function UpgradeNudge({ variant, dismissKey, compact = false, count }: UpgradeNudgeProps) {
  const key = dismissKey || variant;
  const [dismissed, setDismissedState] = useState(() => isDismissed(key));
  const config = NUDGE_CONFIGS[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(key);
    setDismissedState(true);
  };

  const Icon = config.icon;

  // Compact variant — single line
  if (compact) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border bg-gradient-to-r ${config.borderColor} ${config.bgGradient}`}>
        <Icon className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
        <span className="text-xs text-zinc-300 flex-1">{config.headline}</span>
        <Link
          to={config.ctaLink}
          className={`text-[10px] font-medium ${config.iconColor} hover:underline flex items-center gap-1`}
        >
          {config.ctaText} <ArrowRight className="w-3 h-3" />
        </Link>
        <button onClick={handleDismiss} className="text-zinc-600 hover:text-zinc-400 p-0.5">
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Full variant — card with stats
  return (
    <div className={`relative rounded-xl border p-4 bg-gradient-to-r ${config.borderColor} ${config.bgGradient} transition-all`}>
      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.tagColor.split(' ')[1]}`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          {/* Tag + headline */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${config.tagColor}`}>
              {config.tagText}
            </span>
            {variant === 'milestone' && count && (
              <span className="text-[10px] text-zinc-500">{count} decisions made</span>
            )}
          </div>
          <h4 className="text-sm font-medium text-white mb-1">{config.headline}</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">{config.body}</p>

          {/* Stats + CTA row */}
          <div className="flex items-center gap-4">
            {config.stat && (
              <>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-black ${config.iconColor}`}>{config.stat}</span>
                  <span className="text-[9px] text-zinc-500">{config.statLabel}</span>
                </div>
                <div className="h-5 w-px bg-white/[0.06]" />
              </>
            )}
            <Link
              to={config.ctaLink}
              className={`group inline-flex items-center gap-1.5 text-xs font-medium ${config.iconColor} hover:underline`}
            >
              {config.ctaText}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
