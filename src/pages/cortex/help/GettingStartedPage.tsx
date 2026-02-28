// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — HELP / GETTING STARTED PAGE (MVP)
// =============================================================================
// Onboarding guide, quick start, platform overview, and support links.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import {
  Brain, Shield, FileCheck, Compass, ChevronRight, Play,
  BookOpen, MessageSquare, Zap, ArrowRight, CheckCircle,
  Users, BarChart3, Lock, ExternalLink, Search, HelpCircle,
} from 'lucide-react';

interface QuickStartStep {
  id: string;
  title: string;
  description: string;
  action: string;
  route: string;
  icon: React.FC<{ className?: string }>;
  completed: boolean;
}

const QUICK_START_STEPS: QuickStartStep[] = [
  {
    id: 'council',
    title: 'Run Your First Deliberation',
    description: 'Ask the AI Council to analyze a decision. Choose a mode, provide context, and watch 7 agents deliberate.',
    action: 'Open Council',
    route: '/cortex/council',
    icon: Brain,
    completed: false,
  },
  {
    id: 'dcii',
    title: 'Check Your IISS Score',
    description: 'View your Institutional Immune System Score — the 9 primitives that prove your DDGI compliance.',
    action: 'View DCII Dashboard',
    route: '/cortex/enterprise/dcii',
    icon: Shield,
    completed: false,
  },
  {
    id: 'receipt',
    title: 'Generate a Regulator\'s Receipt',
    description: 'Create a cryptographically signed proof of governance for any past decision. One click.',
    action: 'Generate Receipt',
    route: '/cortex/compliance/regulators-receipt',
    icon: FileCheck,
    completed: false,
  },
  {
    id: 'settings',
    title: 'Configure Your Organization',
    description: 'Set up your team, roles, integrations, and compliance frameworks.',
    action: 'Open Settings',
    route: '/cortex/settings',
    icon: Zap,
    completed: false,
  },
];

interface PlatformSection {
  tier: string;
  tierColor: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  features: string[];
  route: string;
}

const PLATFORM_SECTIONS: PlatformSection[] = [
  {
    tier: 'FOUNDATION',
    tierColor: 'blue',
    title: 'The Council',
    description: 'AI-powered multi-agent deliberation. 7 agents, 35+ modes, structured governance.',
    icon: Brain,
    features: ['Start deliberations', 'Choose advisory modes', 'View agent reasoning', 'Export decisions'],
    route: '/cortex/council',
  },
  {
    tier: 'FOUNDATION',
    tierColor: 'blue',
    title: 'DECIDE',
    description: 'Decision intelligence services. Chronos, PreMortem, Ghost Board, and more.',
    icon: BarChart3,
    features: ['Timeline analysis', 'Pre-mortem scenarios', 'Board rehearsal', 'Decision debt tracking'],
    route: '/cortex/intelligence/chronos',
  },
  {
    tier: 'FOUNDATION',
    tierColor: 'blue',
    title: 'DCII',
    description: 'Decision Crisis Immunization Infrastructure. Prove everything.',
    icon: Shield,
    features: ['IISS scoring', 'Evidence vault', 'Regulator receipts', 'Audit trails'],
    route: '/cortex/enterprise/dcii',
  },
  {
    tier: 'ENTERPRISE',
    tierColor: 'purple',
    title: 'Comply',
    description: '10 frameworks × 17 jurisdictions. Continuous compliance monitoring.',
    icon: Lock,
    features: ['SOC 2, GDPR, HIPAA', 'Cross-jurisdiction checks', 'Continuous monitoring', 'Gap analysis'],
    route: '/cortex/compliance',
  },
  {
    tier: 'ENTERPRISE',
    tierColor: 'purple',
    title: 'Govern',
    description: 'Policy management, approval workflows, and access control.',
    icon: Users,
    features: ['RBAC configuration', 'Approval workflows', 'Policy versioning', 'Dispute resolution'],
    route: '/cortex/governance',
  },
];

const TIER_COLORS: Record<string, { badge: string; dot: string }> = {
  blue: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  purple: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' },
  amber: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
};

export const GettingStartedPage: React.FC = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('dc_onboarding_completed') || '[]'))
  );

  const markComplete = (id: string) => {
    const next = new Set(completedSteps);
    next.add(id);
    setCompletedSteps(next);
    localStorage.setItem('dc_onboarding_completed', JSON.stringify([...next]));
  };

  const progress = Math.round((completedSteps.size / QUICK_START_STEPS.length) * 100);

  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-neutral-100">Getting Started</h1>
        </div>
        <p className="text-sm text-neutral-400">
          Welcome to Datacendia — Decision Crisis Immunization Infrastructure. Here's everything you need to get started.
        </p>
      </div>

      {/* Quick Start Progress */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-200 flex items-center gap-2">
            <Play className="w-4 h-4 text-green-400" /> Quick Start Guide
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-neutral-500">{completedSteps.size}/{QUICK_START_STEPS.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_START_STEPS.map((step) => {
            const done = completedSteps.has(step.id);
            return (
              <div
                key={step.id}
                className={cn(
                  'p-4 rounded-xl border transition-all',
                  done
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-neutral-700/50 bg-neutral-800/30 hover:border-neutral-600'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    done ? 'bg-green-500/15' : 'bg-neutral-700/50'
                  )}>
                    {done
                      ? <CheckCircle className="w-5 h-5 text-green-400" />
                      : <step.icon className="w-5 h-5 text-neutral-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      'text-sm font-semibold',
                      done ? 'text-green-400 line-through' : 'text-neutral-200'
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">{step.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => { markComplete(step.id); navigate(step.route); }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors',
                          done
                            ? 'text-neutral-400 hover:text-neutral-300'
                            : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30'
                        )}
                      >
                        {step.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Overview */}
      <div>
        <h2 className="text-base font-semibold text-neutral-200 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" /> Platform Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM_SECTIONS.map((section, i) => {
            const tc = TIER_COLORS[section.tierColor];
            return (
              <button
                key={i}
                onClick={() => navigate(section.route)}
                className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border', tc.badge)}>
                    {section.tier}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="w-5 h-5 text-neutral-300" />
                  <h3 className="text-sm font-semibold text-neutral-200">{section.title}</h3>
                </div>
                <p className="text-xs text-neutral-500 mb-3">{section.description}</p>
                <ul className="space-y-1">
                  {section.features.map((f, j) => (
                    <li key={j} className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <div className={cn('w-1 h-1 rounded-full', tc.dot)} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Support & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
          <MessageSquare className="w-5 h-5 text-blue-400 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-200 mb-1">Contact Support</h3>
          <p className="text-xs text-neutral-500 mb-3">Enterprise support available 24/7 for critical issues.</p>
          <a href="mailto:support@datacendia.com" className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
            support@datacendia.com <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
          <BookOpen className="w-5 h-5 text-purple-400 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-200 mb-1">Documentation</h3>
          <p className="text-xs text-neutral-500 mb-3">Full API docs, integration guides, and architecture references.</p>
          <a href="https://docs.datacendia.com" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 flex items-center gap-1 hover:underline">
            docs.datacendia.com <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="p-5 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
          <HelpCircle className="w-5 h-5 text-amber-400 mb-3" />
          <h3 className="text-sm font-semibold text-neutral-200 mb-1">Keyboard Shortcuts</h3>
          <p className="text-xs text-neutral-500 mb-3">Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px]">Ctrl+K</kbd> to open the Command Palette.</p>
          <div className="space-y-1">
            {[
              { key: 'Ctrl+K', action: 'Command Palette' },
              { key: 'Ctrl+/', action: 'Search' },
              { key: 'G then D', action: 'Go to Dashboard' },
            ].map((sc, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300 text-[10px] font-mono">{sc.key}</kbd>
                <span className="text-neutral-500">{sc.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;
