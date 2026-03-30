/**
 * Page — Grupo Figer Sandbox Demo (Trilingual EN/ES/PT)
 *
 * Bespoke sandbox for Grupo Figer — Brazil's largest sports agency.
 * 10 fully scripted multi-agent deliberation scenarios with trilingual support.
 *
 * Access: /sandbox/figer (Key: FIGER-26)
 *
 * @exports GrupoFigerSandboxPage
 * @module pages/sandbox/GrupoFigerSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import type { ScenarioConfig, Agent, Connector, ShellLabels } from './SandboxShared';
import { AccessGate, SandboxShell, DEFAULT_LABELS, ES_LABELS, PT_LABELS } from './SandboxShared';
import type { TemplateScenario, TemplateConnector } from './SandboxTemplate';
import config from './configs/grupo-figer';
import type { FigerLang } from './configs/grupo-figer';
import { EN_SCENARIOS } from './configs/grupo-figer-en';
import { ES_SCENARIOS } from './configs/grupo-figer-es';
import { PT_SCENARIOS } from './configs/grupo-figer-pt';

// =============================================================================
// ICON REGISTRY — Resolve string icon keys to JSX (mirrors SandboxTemplate)
// =============================================================================

import {
  Activity, Banknote, Scale, Globe as GlobeIcon, FileText, Shield, MessageSquare,
  Database, Eye, DollarSign, Users, Ban, Landmark, FlaskConical,
  Shuffle, Video, Heart, UtensilsCrossed, ShieldCheck, Fingerprint,
  Link2, AlertTriangle, Zap, Radio, Lock, Siren, Cpu, Wifi,
  Building2, Gavel, BookOpen, TrendingUp, Search, MapPin,
  type LucideIcon,
} from 'lucide-react';

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
  globe: GlobeIcon,
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

function resolveScenarios(templates: TemplateScenario[]): ScenarioConfig[] {
  return templates.map((t) => ({
    ...t,
    icon: resolveIcon(t.icon),
    agents: t.agents as Agent[],
    connectors: t.connectors.map((c: TemplateConnector) => ({
      ...c,
      icon: resolveIcon(c.icon),
    })) as Connector[],
  }));
}

// =============================================================================
// TRILINGUAL LANGUAGE TOGGLE
// =============================================================================

const LANG_OPTIONS: { code: FigerLang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

const TrilingualToggle: React.FC<{ lang: FigerLang; onSelect: (lang: FigerLang) => void }> = ({ lang, onSelect }) => (
  <div className="flex items-center gap-1">
    {LANG_OPTIONS.map((opt) => (
      <button
        key={opt.code}
        onClick={() => onSelect(opt.code)}
        className={`px-2.5 py-1.5 text-[10px] rounded-lg flex items-center gap-1.5 transition-all ${
          lang === opt.code
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold'
            : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
        }`}
        title={opt.label}
      >
        <span className="text-xs">{opt.flag}</span>
        <span>{opt.code.toUpperCase()}</span>
      </button>
    ))}
  </div>
);

// =============================================================================
// LABEL MAPS
// =============================================================================

const LABELS_MAP: Record<FigerLang, ShellLabels> = {
  en: DEFAULT_LABELS,
  es: ES_LABELS,
  pt: PT_LABELS,
};

const FOOTER_MAP: Record<FigerLang, string> = {
  en: config.footerNote,
  es: config.i18n?.footerNote ?? config.footerNote,
  pt: config.pt.footerNote,
};

// =============================================================================
// RESOLVED SCENARIOS (pre-resolve to avoid re-computation)
// =============================================================================

const SCENARIOS_MAP: Record<FigerLang, ScenarioConfig[]> = {
  en: resolveScenarios(EN_SCENARIOS),
  es: resolveScenarios(ES_SCENARIOS),
  pt: resolveScenarios(PT_SCENARIOS),
};

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export const GrupoFigerSandboxPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [lang, setLang] = useState<FigerLang>('en');

  useEffect(() => {
    if (sessionStorage.getItem(config.sessionKey) === 'true') {
      setUnlocked(true);
    }
    const savedLang = sessionStorage.getItem(`${config.sessionKey}-lang`) as FigerLang | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'es' || savedLang === 'pt')) {
      setLang(savedLang);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem(config.sessionKey, 'true');
    setUnlocked(true);
  };

  const handleLangChange = (next: FigerLang) => {
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

  return (
    <SandboxShell
      scenarios={SCENARIOS_MAP[lang]}
      orgLabel={config.orgLabel}
      accent={config.accent}
      footerNote={FOOTER_MAP[lang]}
      labels={LABELS_MAP[lang]}
      headerExtra={<TrilingualToggle lang={lang} onSelect={handleLangChange} />}
    />
  );
};

export default GrupoFigerSandboxPage;
