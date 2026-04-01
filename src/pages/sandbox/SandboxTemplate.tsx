/**
 * Sandbox Template — Config-Driven Demo Pages
 *
 * Drop in a data config file → get a fully functional sandbox demo.
 * Each org gets its own isolated URL + access key. No cross-visibility.
 *
 * Usage:
 *   1. Create a config file in sandbox/configs/  (see configs/_example.ts)
 *   2. Add one lazy route in public.routes.tsx
 *   3. Done — org sees only their demo at their unique URL
 *
 * @module pages/sandbox/SandboxTemplate
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import {
  Activity, Banknote, Scale, Globe, FileText, Shield, MessageSquare,
  Database, Eye, DollarSign, Users, Ban, Landmark, FlaskConical,
  Shuffle, Video, Heart, UtensilsCrossed, ShieldCheck, Fingerprint,
  Link2, AlertTriangle, Zap, Radio, Lock, Siren, Cpu, Wifi,
  Building2, Gavel, BookOpen, TrendingUp, Search, MapPin,
  type LucideIcon,
} from 'lucide-react';
import type { ScenarioConfig, Agent, Connector, ShellLabels } from './SandboxShared';
import { AccessGate, SandboxShell, DEFAULT_LABELS, ES_LABELS } from './SandboxShared';

// =============================================================================
// ICON REGISTRY — Map string names → Lucide components
// =============================================================================

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  ban: Ban,
  banknote: Banknote,
  'book-open': BookOpen,
  'building-2': Building2,
  cpu: Cpu,
  database: Database,
  'dollar-sign': DollarSign,
  eye: Eye,
  'file-text': FileText,
  fingerprint: Fingerprint,
  'flask-conical': FlaskConical,
  gavel: Gavel,
  globe: Globe,
  heart: Heart,
  landmark: Landmark,
  'link-2': Link2,
  lock: Lock,
  'map-pin': MapPin,
  'message-square': MessageSquare,
  radio: Radio,
  scale: Scale,
  search: Search,
  shield: Shield,
  'shield-check': ShieldCheck,
  shuffle: Shuffle,
  siren: Siren,
  'trending-up': TrendingUp,
  users: Users,
  'utensils-crossed': UtensilsCrossed,
  video: Video,
  wifi: Wifi,
  zap: Zap,
};

function resolveIcon(name: string, className = 'w-4 h-4'): React.ReactNode {
  const Icon = ICONS[name];
  if (!Icon) return <Shield className={className} />;
  return <Icon className={className} />;
}

// =============================================================================
// PURE-DATA TYPES — No JSX, just strings and primitives
// =============================================================================

export interface TemplateAgent {
  id: string;
  name: string;
  role: string;
  icon: string;       // emoji
  color: string;
  borderColor: string;
  bgColor: string;
}

export interface TemplateConnector {
  name: string;
  status: 'connected' | 'syncing' | 'ready';
  type: string;
  icon: string;        // icon registry key (e.g. 'shield', 'database')
  detail: string;
}

export interface TemplateScenario {
  id: string;
  title: string;
  subtitle: string;
  banner: string;
  risk: string;
  scenarioNum: string;
  icon: string;        // icon registry key
  color: string;
  agents: TemplateAgent[];
  connectors: TemplateConnector[];
  script: {
    agentId: string;
    phase: 'phase1' | 'phase2' | 'phase3';
    type: 'analysis' | 'flag' | 'warning' | 'dissent' | 'proposal' | 'resolution' | 'withdrawal';
    delay: number;
    content: string;
  }[];
  receiptTemplate: {
    hash: string;
    merkleRoot: string;
    merkleLabel: string;
    complianceLabel: string;
    complianceValue: string;
    complianceThreshold: string;
    agents: string[];
    dissents: number;
    dissentResolved: boolean;
    guaranteeTitle: string;
    guaranteeBody: string;
    evidenceChain: string;
    complianceScore?: number;
    timelineEvents?: {
      timestamp: string;
      type: 'analysis' | 'flag' | 'warning' | 'dissent' | 'proposal' | 'resolution' | 'withdrawal';
      title: string;
      description: string;
      agent?: string;
      impact: 'high' | 'medium' | 'low';
    }[];
    // Cortex Intelligence properties
    preMortemFailures?: Array<{
      type: string;
      probability: number;
      impact: string;
      description: string;
    }>;
    ghostAlternatives?: Array<{
      path: string;
      probability: number;
      outcome: string;
      reason: string;
    }>;
    decisionDebt?: Array<{
      decision: string;
      date: string;
      impact: number;
      accumulated: boolean;
    }>;
    totalDecisionDebt?: number;
    chronosEvents?: Array<{
      period: string;
      change: string;
      magnitude: number;
      trend: 'improving' | 'declining' | 'stable';
    }>;
    liveDemoActive?: boolean;
    liveDemoAction?: string;
    liveDemoProgress?: number;
  };
  idleTitle: string;
  idleDesc: string;
  phaseLabels: [string, string, string];
}

export interface OrgSandboxConfig {
  // Org identity
  orgLabel: string;
  accessKey: string;           // case-insensitive, checked on submit
  sessionKey: string;          // sessionStorage key for unlock state

  // Styling
  accent: string;              // tailwind color name (e.g. 'amber', 'blue')
  accentColor: string;         // e.g. 'text-amber-400'
  accentHover: string;         // gradient for button
  ringColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;

  // Content
  footerNote: string;
  scenarios: TemplateScenario[];

  // Optional i18n
  i18n?: {
    footerNote: string;
    labels: ShellLabels;
    scenarios: TemplateScenario[];  // same structure, translated text
  };
}

// =============================================================================
// RESOLVER — Convert pure data → ScenarioConfig (with JSX icons)
// =============================================================================

function resolveScenarios(templates: TemplateScenario[]): ScenarioConfig[] {
  return templates.map((t) => ({
    ...t,
    icon: resolveIcon(t.icon),
    agents: t.agents as Agent[],
    connectors: t.connectors.map((c) => ({
      ...c,
      icon: resolveIcon(c.icon),
    })) as Connector[],
  }));
}

// =============================================================================
// LANGUAGE TOGGLE (reusable)
// =============================================================================

const LangToggle: React.FC<{ lang: 'en' | 'es'; onToggle: () => void }> = ({ lang, onToggle }) => (
  <button
    onClick={onToggle}
    className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 hover:text-white/80 flex items-center gap-1.5 transition-all"
    title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
  >
    <Globe className="w-3 h-3" />
    <span className="font-semibold">{lang === 'en' ? 'ES' : 'EN'}</span>
  </button>
);

// =============================================================================
// TEMPLATE PAGE COMPONENT
// =============================================================================

export const SandboxTemplatePage: React.FC<{ config: OrgSandboxConfig }> = ({ config }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const scenariosEN = resolveScenarios(config.scenarios);
  const scenariosES = config.i18n ? resolveScenarios(config.i18n.scenarios) : null;

  useEffect(() => {
    if (sessionStorage.getItem(config.sessionKey) === 'true') {
      setUnlocked(true);
    }
    if (config.i18n) {
      const savedLang = sessionStorage.getItem(`${config.sessionKey}-lang`);
      if (savedLang === 'es') setLang('es');
    }
  }, [config.sessionKey, config.i18n]);

  const handleUnlock = () => {
    sessionStorage.setItem(config.sessionKey, 'true');
    setUnlocked(true);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    sessionStorage.setItem(`${config.sessionKey}-lang`, next);
  };

  if (!unlocked) {
    return (
      <AccessGate
        onUnlock={handleUnlock}
        accessKey={config.accessKey}
        orgName={config.orgLabel}
        accentColor={config.accentColor}
        accentHover={config.accentHover}
        ringColor={config.ringColor}
        borderColor={config.borderColor}
        gradientFrom={config.gradientFrom}
        gradientTo={config.gradientTo}
        sessionKey={config.sessionKey}
      />
    );
  }

  const isES = lang === 'es' && scenariosES;
  const scenarios = isES ? scenariosES : scenariosEN;
  const footer = isES ? config.i18n!.footerNote : config.footerNote;
  const labels = isES ? config.i18n!.labels : DEFAULT_LABELS;

  return (
    <SandboxShell
      scenarios={scenarios}
      orgLabel={config.orgLabel}
      accent={config.accent}
      footerNote={footer}
      labels={labels}
      headerExtra={config.i18n ? <LangToggle lang={lang} onToggle={toggleLang} /> : undefined}
    />
  );
};

export default SandboxTemplatePage;
