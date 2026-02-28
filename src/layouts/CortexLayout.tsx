// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - CORTEX LAYOUT
// =============================================================================

// File: src/layouts/CortexLayout.tsx

import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { DataSourceProvider } from '../contexts/DataSourceContext';
import { LanguageProvider, LanguageSelector, useLanguage } from '../contexts/LanguageContext';
import { useVerticalConfig } from '../contexts/VerticalConfigContext';
import {
  DataSourceSelector,
  WorkflowIndicator,
  QuickActionsBar,
} from '../components/cortex/DataSourceSelector';
import CommandPalette from '../components/CommandPalette';
import SEO from '../components/SEO';
import { Logo, LogoSimple } from '../components/brand/Logo';
import { SimpleTooltip } from '../components/ui';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts';
import { NavigationLoader, Breadcrumbs, HealthIndicator, ConnectionBanner } from '../components/navigation';
import { DemoModeToggle, DemoIndicatorBadge } from '../components/demo';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { PlatformAssistant } from '../components/ai-assistant/PlatformAssistant';
import {
  Clock, Ghost, Skull, BarChart3, Eye, Film,
  ScanEye, PenTool, Landmark, Dna, Flame, Target, ScrollText,
  Building2, Scale, FlaskConical, Lock, Shield, KeyRound, Leaf,
  Globe, Activity, Languages, Megaphone, UserCheck, Brain,
  Infinity, Network, SearchCode, Briefcase, Castle, Settings, Radar, AlertTriangle,
  Factory, Gavel, HeartPulse, Banknote, Building, ShieldCheck, Pill,
  Zap, Monitor, ShoppingCart, HardHat, Truck, Clapperboard,
  GraduationCap, Trophy, Columns, FileSignature, TrendingUp, Siren,
  type LucideIcon,
} from 'lucide-react';

// Icons (using inline SVGs for simplicity - replace with icon library)
const Icons = {
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Graph: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  ),
  Council: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  Pulse: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  Lens: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  Bridge: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  ),
  Data: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  ),
  Security: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Help: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
};

// =============================================================================
// NAVIGATION STRUCTURE - CONSOLIDATED MASTER LIST
// =============================================================================

// =============================================================================
// TIER-BASED NAVIGATION — matches Page Architecture Blueprint
// =============================================================================

interface NavItem {
  id: string;
  label: string;
  labelKey?: string;
  icon: React.FC | LucideIcon;
  path: string;
  tooltip?: string;
}

interface NavGroup {
  id: string;
  label: string;
  color: string; // tier accent
  items: NavItem[];
}

// Home
const homeItem: NavItem = {
  id: 'dashboard',
  label: 'Mission Control',
  labelKey: 'sidebar.dashboard',
  icon: Icons.Home,
  path: '/cortex/dashboard',
  tooltip: 'Mission Control — your institutional command center',
};

// FOUNDATION TIER (Blue)
const foundationGroup: NavGroup = {
  id: 'foundation',
  label: 'FOUNDATION',
  color: 'blue',
  items: [
    {
      id: 'council',
      label: 'The Council',
      labelKey: 'sidebar.the_council',
      icon: Brain,
      path: '/cortex/council',
      tooltip: 'Multi-Agent Deliberation Engine',
    },
    {
      id: 'decide',
      label: 'DECIDE',
      icon: SearchCode,
      path: '/cortex/intelligence/chronos',
      tooltip: 'Decision Intelligence — Chronos, PreMortem, Ghost Board',
    },
    {
      id: 'dcii',
      label: 'DCII',
      icon: Shield,
      path: '/cortex/enterprise/dcii',
      tooltip: 'Decision Crisis Immunization Infrastructure — IISS Score',
    },
  ],
};

// ENTERPRISE TIER (Purple)
const enterpriseGroup: NavGroup = {
  id: 'enterprise',
  label: 'ENTERPRISE',
  color: 'purple',
  items: [
    {
      id: 'stress-test',
      label: 'Stress-Test',
      icon: Flame,
      path: '/cortex/enterprise/adversarial-redteam',
      tooltip: 'Adversarial stress testing & red team',
    },
    {
      id: 'comply',
      label: 'Comply',
      icon: Activity,
      path: '/cortex/compliance/continuous-monitor',
      tooltip: 'Continuous compliance monitoring',
    },
    {
      id: 'govern',
      label: 'Govern',
      icon: Scale,
      path: '/cortex/governance/decision-packets',
      tooltip: 'DDGI & constitutional court',
    },
    {
      id: 'sovereign',
      label: 'Sovereign',
      icon: Lock,
      path: '/cortex/enterprise/sovereign',
      tooltip: 'Sovereign deployment & data residency',
    },
    {
      id: 'operate',
      label: 'Operate',
      icon: Monitor,
      path: '/cortex/monitor/live',
      tooltip: 'CendiaPulse live operations monitor',
    },
  ],
};

// STRATEGIC TIER (Gold)
const strategicGroup: NavGroup = {
  id: 'strategic',
  label: 'STRATEGIC',
  color: 'amber',
  items: [
    {
      id: 'collapse',
      label: 'COLLAPSE',
      icon: AlertTriangle,
      path: '/cortex/sovereign/collapse',
      tooltip: 'Adversarial policy stress-testing',
    },
    {
      id: 'sgas',
      label: 'SGAS',
      icon: Building2,
      path: '/cortex/sovereign/sgas',
      tooltip: 'Synthetic Governance Agent System',
    },
    {
      id: 'verticals',
      label: 'Verticals',
      icon: Factory,
      path: '/verticals',
      tooltip: '17 industry verticals',
    },
    {
      id: 'frontier',
      label: 'Frontier',
      icon: Globe,
      path: '/cortex/sovereign/sanctuary',
      tooltip: 'Crisis bunker & frontier capabilities',
    },
  ],
};

const tierGroups: NavGroup[] = [foundationGroup, enterpriseGroup, strategicGroup];

// Cross-cutting / system
const systemItems: NavItem[] = [
  { id: 'data', label: 'Data', labelKey: 'sidebar.data', icon: Icons.Data, path: '/cortex/data' },
  { id: 'security', label: 'Security', labelKey: 'sidebar.security', icon: Icons.Security, path: '/cortex/security' },
];

const bottomNavigationItems: NavItem[] = [
  { id: 'settings', label: 'Settings', labelKey: 'sidebar.settings', icon: Icons.Settings, path: '/cortex/settings' },
  { id: 'help', label: 'Help', labelKey: 'sidebar.help', icon: Icons.Help, path: '/cortex/help' },
];

// Legacy compat
const navigationItems = [homeItem, ...foundationGroup.items];
const pillarItems: { id: string; labelKey: string; emoji: string; path: string; tooltip: string }[] = [];

// Get current page for quick actions
const getCurrentPage = (
  pathname: string
): 'graph' | 'council' | 'pulse' | 'lens' | 'bridge' | null => {
  if (pathname.includes('/graph')) {
    return 'graph';
  }
  if (pathname.includes('/council')) {
    return 'council';
  }
  if (pathname.includes('/pulse')) {
    return 'pulse';
  }
  if (pathname.includes('/lens')) {
    return 'lens';
  }
  if (pathname.includes('/bridge')) {
    return 'bridge';
  }
  return null;
};

// =============================================================================
// 1. THE CORE SUITE (The "Brain") - User-facing, solves immediate business problems
// =============================================================================
const coreSuiteFeatures = [
  {
    id: 'chronos',
    label: 'CendiaChronos™',
    Icon: Clock,
    path: '/cortex/intelligence/chronos',
    description: 'Enterprise Time Machine - Replay past decisions, simulate future crisis scenarios',
    featured: true,
    merged: ['Horizon', 'Cascade', 'Crisis', 'Lens'],
  },
  {
    id: 'ghost-board',
    label: 'Ghost Board™',
    Icon: Ghost,
    path: '/cortex/intelligence/ghost-board',
    description: 'Rehearse high-stakes board meetings against AI avatars',
  },
  {
    id: 'pre-mortem',
    label: 'CendiaPreMortem™',
    Icon: Skull,
    path: '/cortex/intelligence/pre-mortem',
    description: 'AI analyzes why your decision will fail before you execute it',
  },
  {
    id: 'decision-debt',
    label: 'Decision Debt™',
    Icon: BarChart3,
    path: '/cortex/intelligence/decision-debt',
    description: 'Real-time dashboard of stuck decisions and the financial cost of delay',
  },
  {
    id: 'live-visualization',
    label: 'CendiaLive™',
    Icon: Eye,
    path: '/cortex/council/visualization',
    description: 'Watch AI agents deliberate in real-time with animated avatars',
  },
  {
    id: 'replay-theater',
    label: 'CendiaReplay™',
    Icon: Film,
    path: '/cortex/council/replay-theater',
    description: 'Watch past deliberations unfold like a movie',
  },
  {
    id: 'echo',
    label: 'CendiaEcho™',
    Icon: Radar,
    path: '/cortex/crown/echo',
    description: 'Decision Outcome Engine - Track what actually happened after each decision',
  },
  {
    id: 'cendia-lens',
    label: 'CendiaLens™',
    Icon: SearchCode,
    path: '/cortex/intelligence/lens',
    description: 'AI Interpretability - Token confidence, reasoning chains, bias detection, EU AI Act compliance',
  },
  {
    id: 'collapse',
    label: 'CendiaCollapse™',
    Icon: AlertTriangle,
    path: '/cortex/sovereign/collapse',
    description: 'Adversarial Policy Stress-Testing - Find how decisions fail before they do',
  },
  {
    id: 'live-monitor',
    label: 'CendiaPulse™',
    Icon: Monitor,
    path: '/cortex/monitor/live',
    description: 'Mission control - Real-time visualization of agent actions, decisions, and compliance checks',
  },
  {
    id: 'crisis',
    label: 'CendiaCrisis™',
    Icon: Siren,
    path: '/cortex/enterprise/crisis',
    description: 'Incident Response Center - From detection to resolution with complete audit trail',
  },
  {
    id: 'roi-metrics',
    label: 'CendiaROI™',
    Icon: TrendingUp,
    path: '/cortex/enterprise/roi-metrics',
    description: 'Prove the ROI of governance - Real deliberation throughput, quality, and cost metrics',
  },
  {
    id: 'dcii',
    label: 'CendiaDCII™',
    Icon: Shield,
    path: '/cortex/enterprise/dcii',
    description: 'Decision Crisis Immunization Infrastructure - IISS scoring, 9 primitives, media auth, timestamps',
  },
];

// =============================================================================
// 2. THE TRUST LAYER (The "Shield") - Compliance & Proof
// =============================================================================
const trustLayerFeatures = [
  {
    id: 'oversight',
    label: 'CendiaOversight™',
    Icon: ScanEye,
    path: '/cortex/sovereign/panopticon',
    description: 'Real-time Regulatory Radar - FDA, GDPR, DORA frameworks with policy gates',
    merged: ['Govern', 'Audit', 'Veto', 'Regulatory Absorb', 'Panopticon'],
  },
  {
    id: 'notary',
    label: 'CendiaNotary™',
    Icon: PenTool,
    path: '/cortex/sovereign/notary',
    description: 'Cryptographic Signing Authority - Signs and authenticates all decisions with customer-owned keys',
    merged: ['Key Management', 'Digital Signatures', 'Non-Repudiation'],
  },
  {
    id: 'vault',
    label: 'CendiaVault™',
    Icon: Landmark,
    path: '/cortex/sovereign/vault',
    description: 'Unified Evidence Storage - Decision packets, audit ledger, evidence bundles, signed reports',
    merged: ['Decision Packets', 'Audit Ledger', 'Evidence Bundles', 'Signed Reports'],
  },
  {
    id: 'audit-provenance',
    label: 'CendiaProvenance™',
    Icon: Dna,
    path: '/cortex/intelligence/audit-provenance',
    description: 'Full decision lineage & evidence export - cryptographically signed, court-admissible',
    merged: ['Decision DNA', "Regulator's Receipt", 'Ledger', 'Evidence Export'],
  },
  {
    id: 'decision-packets',
    label: 'Decision Packets',
    Icon: FileSignature,
    path: '/cortex/governance/decision-packets',
    description: 'Browse, verify, and export cryptographically signed decision evidence bundles',
    merged: ['Signed Packets', 'Merkle Verification', 'Export'],
  },
  {
    id: 'crucible',
    label: 'CendiaCrucible™',
    Icon: Flame,
    path: '/cortex/sovereign/crucible',
    description: 'Adversarial Stress Testing - Attack decisions with simulated threats',
    merged: ['RedTeam', 'Echo', 'Apotheosis'],
  },
  {
    id: 'adversarial-redteam',
    label: 'CendiaRedTeam™',
    Icon: Target,
    path: '/cortex/enterprise/adversarial-redteam',
    description: 'Adversarial Red Team - Every agent becomes a devil\'s advocate',
  },
  {
    id: 'sgas',
    label: 'SGAS™',
    Icon: Building2,
    path: '/cortex/sovereign/sgas',
    description: 'Synthetic Governance Agent System - 5 agent classes for institutional decision verification at societal scale',
    merged: ['Decision Agents', 'Institutional Agents', 'Adversarial Agents', 'Observer Agents', 'Meta-Governance'],
  },
  {
    id: 'constitutional-court',
    label: 'CendiaCourt™',
    Icon: Scale,
    path: '/cortex/governance/constitutional-court',
    description: 'Formal AI dispute resolution with precedent tracking and binding opinions',
    merged: ['Dispute Filing', 'Precedent Database', 'Constitutional Principles'],
  },
  {
    id: 'regulatory-sandbox',
    label: 'CendiaSandbox™',
    Icon: FlaskConical,
    path: '/cortex/compliance/regulatory-sandbox',
    description: 'Test against proposed regulations before they become law',
    merged: ['EU AI Act', 'Colorado AI Act', 'Gap Analysis', 'Remediation Roadmap'],
  },
  {
    id: 'zkp',
    label: 'CendiaZKP™',
    Icon: Lock,
    path: '/cortex/security/zkp',
    description: 'Prove compliance without revealing proprietary logic or data',
    merged: ['Compliance Proofs', 'Fairness Proofs', 'Certificates'],
  },
  {
    id: 'ai-insurance',
    label: 'CendiaInsure™',
    Icon: Shield,
    path: '/cortex/enterprise/ai-insurance',
    description: 'Direct liability coverage per AI decision with real-time risk scoring',
    merged: ['Policy Management', 'Decision Coverage', 'Claims'],
  },
  {
    id: 'post-quantum-kms',
    label: 'CendiaQuantumKMS™',
    Icon: KeyRound,
    path: '/cortex/enterprise/post-quantum-kms',
    description: 'Quantum-resistant cryptographic signatures (Dilithium, SPHINCS+, Falcon)',
    merged: ['Key Generation', 'Signing', 'Verification', 'Key Rotation'],
  },
  {
    id: 'carbon-aware',
    label: 'CendiaCarbon™',
    Icon: Leaf,
    path: '/cortex/enterprise/carbon-aware',
    description: 'Reduce AI carbon footprint with intelligent workload scheduling',
    merged: ['Carbon Intensity', 'Workload Scheduling', 'ESG Reporting'],
  },
  {
    id: 'cross-jurisdiction',
    label: 'CendiaJurisdiction™',
    Icon: Globe,
    path: '/cortex/compliance/cross-jurisdiction',
    description: '17-jurisdiction compliance engine for cross-border data transfers',
    merged: ['Transfer Assessment', 'Conflict Detection', 'Data Residency'],
  },
  {
    id: 'continuous-compliance',
    label: 'CendiaCompliance™',
    Icon: Activity,
    path: '/cortex/compliance/continuous-monitor',
    description: 'Real-time monitoring for 10 compliance frameworks',
    merged: ['EU AI Act', 'GDPR', 'HIPAA', 'SOC 2', 'ISO 27001', 'NIST AI RMF'],
  },
];

// =============================================================================
// 3. VERTICAL PACKS (The "Specialist") - Show based on audience
// =============================================================================
const verticalPacks = [
  // Hub - All Verticals
  {
    id: 'hub',
    label: 'All Verticals',
    Icon: Factory,
    path: '/verticals',
    description: 'Browse all 24 industry verticals',
    industry: 'All',
  },
  // Priority Tier
  {
    id: 'legal',
    label: 'Legal / Law Firms',
    Icon: Gavel,
    path: '/verticals/legal',
    description: '49 council modes, 14 AI agents',
    industry: 'Legal',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    Icon: HeartPulse,
    path: '/verticals/healthcare',
    description: 'HIPAA-compliant clinical intelligence',
    industry: 'Healthcare',
  },
  {
    id: 'financial',
    label: 'Financial Services',
    Icon: Banknote,
    path: '/verticals/financial-services',
    description: 'Fraud detection & regulatory intel',
    industry: 'Finance',
  },
  {
    id: 'government',
    label: 'Government',
    Icon: Building,
    path: '/verticals/government-legal',
    description: 'Sovereign AI for public sector',
    industry: 'Government',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    Icon: ShieldCheck,
    path: '/verticals/insurance',
    description: 'Underwriting & claims intelligence',
    industry: 'Insurance',
  },
  {
    id: 'pharmaceutical',
    label: 'Pharmaceutical',
    Icon: Pill,
    path: '/verticals/pharmaceutical',
    description: 'Pipeline & regulatory acceleration',
    industry: 'Pharma',
  },
  // Growth Tier
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    Icon: Factory,
    path: '/verticals/manufacturing',
    description: 'Supply chain & operations',
    industry: 'Manufacturing',
  },
  {
    id: 'energy',
    label: 'Energy & Utilities',
    Icon: Zap,
    path: '/verticals/energy-utilities',
    description: 'Grid intelligence & compliance',
    industry: 'Energy',
  },
  {
    id: 'technology',
    label: 'Technology / SaaS',
    Icon: Monitor,
    path: '/verticals/technology',
    description: 'Product velocity & AI governance',
    industry: 'Tech',
  },
  {
    id: 'retail',
    label: 'Retail & Hospitality',
    Icon: ShoppingCart,
    path: '/verticals/retail-hospitality',
    description: 'Pricing & revenue optimization',
    industry: 'Retail',
  },
  {
    id: 'real-estate',
    label: 'Real Estate',
    Icon: HardHat,
    path: '/verticals/real-estate',
    description: 'Development & property analytics',
    industry: 'Real Estate',
  },
  {
    id: 'transportation',
    label: 'Transportation',
    Icon: Truck,
    path: '/verticals/transportation',
    description: 'Fleet & logistics optimization',
    industry: 'Logistics',
  },
  {
    id: 'media',
    label: 'Media & Entertainment',
    Icon: Clapperboard,
    path: '/verticals/media-entertainment',
    description: 'Content & audience intelligence',
    industry: 'Media',
  },
  {
    id: 'professional-services',
    label: 'Professional Services',
    Icon: Briefcase,
    path: '/verticals/professional-services',
    description: 'Consulting & advisory firms',
    industry: 'Services',
  },
  {
    id: 'education',
    label: 'Higher Education',
    Icon: GraduationCap,
    path: '/verticals/higher-education',
    description: 'Academic & research institutions',
    industry: 'Education',
  },
  {
    id: 'sports',
    label: 'Sports Governance',
    Icon: Trophy,
    path: '/cortex/verticals/sports',
    description: 'FIFA/UEFA governance scenarios & transfer compliance',
    industry: 'Sports',
  },
  // Smart City / Municipal
  {
    id: 'smart-city',
    label: 'Smart City / Municipal',
    Icon: Columns,
    path: '/verticals/smart-city',
    description: '17 agents, 28 council modes, 3 guardians',
    industry: 'Government',
  },
  // EU Banking Compliance
  {
    id: 'eu-banking',
    label: 'EU Banking Compliance',
    Icon: Scale,
    path: '/verticals/eu-banking',
    description: 'Basel III + EU AI Act for mid-tier EU banks',
    industry: 'Banking',
  },
];

// =============================================================================
// ADDITIONAL CORE SERVICES
// =============================================================================
const additionalServices = [
  {
    id: 'omni-translate',
    label: 'CendiaOmniTranslate™',
    Icon: Languages,
    path: '/cortex/enterprise/omni-translate',
    description: '100-Language Enterprise Translator',
  },
  {
    id: 'dissent',
    label: 'CendiaDissent™',
    Icon: Megaphone,
    path: '/cortex/enterprise/dissent',
    description: 'Protected Dissent & Whistleblower Channel (Council extension)',
  },
  {
    id: 'responsibility',
    label: 'CendiaResponsibility™',
    Icon: UserCheck,
    path: '/cortex/enterprise/responsibility',
    description: 'Human Accountability Layer - TPM-signed liability transfer',
  },
];

// REMOVED: CendiaForecast, CendiaSentry (Apex Products)
// MOVED TO SETTINGS: Walkthroughs, Training, Gnosis
// MOVED TO PRICING: Sovereign (deployment tier)
// MOVED TO VISION ROADMAP: PersonaForge, Mesh, Aegis

// Legacy arrays for backwards compatibility (empty or minimal)
const premiumFeatures = [...coreSuiteFeatures];
const apexProducts: typeof coreSuiteFeatures = []; // Removed

// =============================================================================
// ENTERPRISE FEATURES - Consolidated (many merged into Core Suite / Trust Layer)
// =============================================================================
const enterpriseFeatures = [
  // Vertical Packs (Specialist - show based on audience)
  {
    id: 'genomics',
    label: 'CendiaGenomics™',
    Icon: Dna,
    path: '/cortex/enterprise/genomics',
    description: 'Healthcare & Life Sciences Pack',
    impact: 'Critical',
    tier: 'Specialist',
  },
  {
    id: 'defense-stack',
    label: 'CendiaDefense™',
    Icon: Shield,
    path: '/cortex/enterprise/defense-stack',
    description: 'Government/Defense Edition',
    impact: 'Critical',
    tier: 'Specialist',
  },
  {
    id: 'defense-vertical',
    label: 'Defense Vertical',
    Icon: Target,
    path: '/cortex/sovereign/defense',
    description: 'DIU-Ready Defense & National Security - 24 agents, 35 council modes',
    impact: 'Critical',
    tier: 'Sovereign',
  },
  // Core Services (kept)
  {
    id: 'omni-translate',
    label: 'CendiaOmniTranslate™',
    Icon: Languages,
    path: '/cortex/enterprise/omni-translate',
    description: '100-Language Enterprise Translator',
    impact: 'High',
    tier: 'Core',
  },
  {
    id: 'dissent',
    label: 'CendiaDissent™',
    Icon: Megaphone,
    path: '/cortex/enterprise/dissent',
    description: 'Protected Dissent & Whistleblower Channel (Council extension)',
    impact: 'High',
    tier: 'Core',
  },
  {
    id: 'responsibility',
    label: 'CendiaResponsibility™',
    Icon: UserCheck,
    path: '/cortex/enterprise/responsibility',
    description: 'Human Accountability Layer - TPM-signed liability transfer',
    impact: 'High',
    tier: 'Enterprise',
  },
  // Admin (moved from Enterprise to Admin section)
  {
    id: 'vertical-config',
    label: 'Vertical Config',
    Icon: Settings,
    path: '/cortex/admin/vertical-config',
    description: 'Industry Vertical & Service Toggles',
    impact: 'Admin',
    tier: 'Admin',
  },
];

// =============================================================================
// HIDDEN/MERGED SERVICES (kept for route compatibility but not shown in nav)
// =============================================================================
// MERGED INTO COUNCIL: Autopilot, Voice, Union, Veto
// MERGED INTO CHRONOS: Horizon, Cascade, Crisis, Lens
// MERGED INTO OVERSIGHT: Govern, Audit, Panopticon, Regulatory Absorb
// MERGED INTO DECISION DNA: Ledger, Evidence Vault
// MERGED INTO CRUCIBLE: RedTeam, Echo, Apotheosis
// MOVED TO SETTINGS: Training, Walkthroughs, Gnosis
// MOVED TO VISION ROADMAP: PersonaForge, Mesh, Aegis
// MOVED TO PRICING: Sovereign (deployment tier, not software module)

// =============================================================================
// SOVEREIGN TIER - Now part of Trust Layer (shown in Trust Layer dropdown)
// =============================================================================
// Most sovereign features are now merged into Trust Layer:
// - Crucible (merged with RedTeam, Echo, Apotheosis)
// - Panopticon → renamed to Oversight (merged with Govern, Audit, Veto)
// - Horizon → merged into Chronos
// - Vox → merged into Council
// 
// Remaining sovereign features (kept for specialized use):
const sovereignFeatures = [
  {
    id: 'eternal',
    label: 'CendiaEternal™',
    Icon: Infinity,
    path: '/cortex/sovereign/eternal',
    description: 'Ultra-Long Horizon Archive (100+ years)',
    impact: 'Strategic',
    tier: 'Sovereign',
  },
  {
    id: 'symbiont',
    label: 'CendiaSymbiont™',
    Icon: Network,
    path: '/cortex/sovereign/symbiont',
    description: 'Partnership & Ecosystem Engine',
    impact: 'High',
    tier: 'Sovereign',
  },
  {
    id: 'shadow-ops',
    label: 'CendiaShadowOps™',
    Icon: SearchCode,
    path: '/cortex/sovereign/shadow-ops',
    description: 'Competitive Intelligence & Counter-Intelligence - Monitor competitor moves, detect when you\'re being analyzed',
    impact: 'Critical',
    tier: 'Sovereign',
  },
  {
    id: 'succession',
    label: 'CendiaSuccession™',
    Icon: Briefcase,
    path: '/cortex/sovereign/succession',
    description: 'Leadership Continuity - AI-powered succession planning & tacit knowledge capture from departing executives',
    impact: 'Strategic',
    tier: 'Sovereign',
  },
  {
    id: 'sanctuary',
    label: 'CendiaSanctuary™',
    Icon: Castle,
    path: '/cortex/sovereign/sanctuary',
    description: 'Crisis Bunker - Air-gapped decision-making during cyber attacks with offline deliberation',
    impact: 'Critical',
    tier: 'Sovereign',
  },
];

// MOVED TO VISION ROADMAP: Aegis (Strategic Defense Intelligence)
// MERGED INTO CHRONOS: Horizon
// MERGED INTO COUNCIL: Vox
// RENAMED: Panopticon → Oversight (in Trust Layer)

// Inner layout component that can use translations
const CortexLayoutInner: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPremiumDropdownOpen, setIsPremiumDropdownOpen] = useState(false);
  const [isEnterpriseDropdownOpen, setIsEnterpriseDropdownOpen] = useState(false);
  const [isSovereignDropdownOpen, setIsSovereignDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { isServiceEnabled, isInitialized } = useVerticalConfig();

  // Check if user is owner/admin (bypass all service filtering)
  const isOwnerOrAdmin = useMemo(() => {
    const role = user?.role?.toUpperCase();
    const result = role === 'OWNER' || role === 'SUPER_ADMIN' || role === 'ADMIN';
    console.log('[CortexLayout] User role:', user?.role, 'isOwnerOrAdmin:', result);
    return result;
  }, [user?.role]);

  // Filter enterprise features based on enabled services
  const filteredEnterpriseFeatures = useMemo(() => {
    // ALWAYS show ALL enterprise features - filtering disabled for now
    console.log('[CortexLayout] Enterprise: isOwnerOrAdmin=', isOwnerOrAdmin, 'returning all', enterpriseFeatures.length, 'features');
    return enterpriseFeatures;
  }, [isOwnerOrAdmin]);

  // Filter sovereign features - show ALL for owner
  const filteredSovereignFeatures = useMemo(() => {
    // ALWAYS show ALL sovereign features - filtering disabled for now
    console.log('[CortexLayout] Sovereign: isOwnerOrAdmin=', isOwnerOrAdmin, 'returning all', sovereignFeatures.length, 'features');
    return sovereignFeatures;
  }, [isOwnerOrAdmin]);

  const isActive = (path: string) => {
    if (path === '/cortex/dashboard') {
      return location.pathname === '/cortex' || location.pathname === '/cortex/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const currentPage = getCurrentPage(location.pathname);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SR';

  return (
    <DataSourceProvider>
      {/* SEO - Dynamic page titles and meta tags */}
      <SEO />

      {/* Navigation loading indicator */}
      <NavigationLoader />

      {/* Connection status banner */}
      <ConnectionBanner />

      {/* Command Palette - Global search and actions (Cmd+K) */}
      <CommandPalette />

      <div className="h-screen flex bg-sovereign-base">
        {/* ================================================================= */}
        {/* SIDEBAR */}
        {/* ================================================================= */}
        <aside
          className={cn(
            'hidden lg:flex flex-col bg-sovereign-elevated border-r border-sovereign-border-subtle',
            'transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sovereign-border-subtle">
            {!isCollapsed && <Logo size="sm" />}
            {isCollapsed && (
              <div className="mx-auto">
                <LogoSimple size={32} />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-sovereign-hover',
                isCollapsed && 'hidden'
              )}
            >
              <Icons.ChevronLeft />
            </button>
          </div>

          {/* Main Navigation — Tier-Based */}
          <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
            {/* Home / Mission Control */}
            {(() => {
              const Icon = homeItem.icon;
              const active = isActive(homeItem.path);
              return (
                <SimpleTooltip content={homeItem.tooltip || ''} position="right">
                  <button
                    onClick={() => navigate(homeItem.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                      'transition-colors text-sm font-semibold',
                      active
                        ? 'bg-sovereign-active text-white border-l-2 border-cyan-500'
                        : 'text-gray-400 hover:bg-sovereign-hover hover:text-white'
                    )}
                    title={isCollapsed ? homeItem.label : undefined}
                  >
                    <Icon />
                    {!isCollapsed && <span>{homeItem.labelKey ? t(homeItem.labelKey) : homeItem.label}</span>}
                  </button>
                </SimpleTooltip>
              );
            })()}

            {/* Tier Groups */}
            {tierGroups.map((group) => {
              const tierColorMap: Record<string, { label: string; active: string; dot: string }> = {
                blue:   { label: 'text-blue-400',   active: 'border-blue-500',   dot: 'bg-blue-400' },
                purple: { label: 'text-purple-400', active: 'border-purple-500', dot: 'bg-purple-400' },
                amber:  { label: 'text-amber-400',  active: 'border-amber-500',  dot: 'bg-amber-400' },
              };
              const tc = tierColorMap[group.color] || tierColorMap.blue;
              return (
                <div key={group.id} className="pt-3 mt-2 border-t border-sovereign-border-subtle">
                  {!isCollapsed && (
                    <div className="flex items-center gap-2 px-3 mb-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full', tc.dot)} />
                      <p className={cn('text-[10px] font-bold uppercase tracking-widest', tc.label)}>
                        {group.label}
                      </p>
                    </div>
                  )}
                  {isCollapsed && (
                    <div className="flex justify-center mb-1">
                      <div className={cn('w-6 h-0.5 rounded-full', tc.dot)} />
                    </div>
                  )}
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <SimpleTooltip key={item.id} content={item.tooltip || item.label} position="right">
                        <button
                          onClick={() => navigate(item.path)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                            'transition-colors text-sm',
                            active
                              ? `bg-sovereign-active text-white border-l-2 ${tc.active}`
                              : 'text-gray-400 hover:bg-sovereign-hover hover:text-white'
                          )}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5" />
                          {!isCollapsed && <span>{item.labelKey ? t(item.labelKey) : item.label}</span>}
                        </button>
                      </SimpleTooltip>
                    );
                  })}
                </div>
              );
            })}

            {/* Cross-cutting / System */}
            <div className="pt-3 mt-2 border-t border-sovereign-border-subtle">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  SYSTEM
                </p>
              )}
              {systemItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                      'transition-colors text-sm',
                      active
                        ? 'bg-sovereign-active text-white border-l-2 border-cyan-500'
                        : 'text-gray-400 hover:bg-sovereign-hover hover:text-white'
                    )}
                    title={isCollapsed ? (item.labelKey ? t(item.labelKey) : item.label) : undefined}
                  >
                    <Icon />
                    {!isCollapsed && <span>{item.labelKey ? t(item.labelKey) : item.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="py-4 px-2 border-t border-sovereign-border-subtle space-y-1">
            {bottomNavigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'transition-colors text-sm font-medium',
                    active
                      ? 'bg-sovereign-active text-white border-l-2 border-cyan-500'
                      : 'text-gray-400 hover:bg-sovereign-hover hover:text-white'
                  )}
                  title={isCollapsed ? (item.labelKey ? t(item.labelKey) : item.label) : undefined}
                >
                  <Icon />
                  {!isCollapsed && <span>{item.labelKey ? t(item.labelKey) : item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* User Section */}
          {!isCollapsed && (
            <div className="p-4 border-t border-sovereign-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-crimson-900/30 rounded-full flex items-center justify-center">
                  <span className="text-crimson-400 font-medium text-sm">{userInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Stuart Rainey'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.role === 'OWNER' ? t('label.owner') : t('label.admin')}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ================================================================= */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-sovereign-elevated border-b border-sovereign-border-subtle overflow-visible">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-sovereign-hover"
            >
              <Icons.Menu />
            </button>

            {/* Data Source Selector */}
            <div className="hidden md:block w-64">
              <DataSourceSelector compact />
            </div>

            {/* Search - Opens Command Palette */}
            <div className="flex-1 max-w-md mx-4">
              <button
                onClick={() => {
                  // Trigger Cmd+K programmatically
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    ctrlKey: true,
                  });
                  window.dispatchEvent(event);
                }}
                className={cn(
                  'w-full h-10 pl-10 pr-4 rounded-lg flex items-center justify-between',
                  'bg-sovereign-card border border-sovereign-border',
                  'text-sm text-gray-500',
                  'hover:bg-sovereign-hover hover:border-sovereign-border-strong transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icons.Search />
                  <span>Search anything...</span>
                </div>
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-sovereign-active text-gray-400 rounded">
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Quick Actions (show on main Cortex pages) */}
            {currentPage && (
              <div className="hidden lg:block">
                <QuickActionsBar currentPage={currentPage} />
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* API Health Status */}
              <HealthIndicator className="hidden sm:flex" />

              {/* Core Suite Dropdown (The "Brain") */}
              <div className="relative">
                <button
                  onClick={() => setIsPremiumDropdownOpen(!isPremiumDropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                    'bg-sovereign-card border border-sovereign-border text-gray-300',
                    'hover:bg-sovereign-hover hover:text-white hover:border-cyan-500/50 transition-all'
                  )}
                >
                  <Brain className="w-4 h-4" />
                  <span className="hidden md:inline">Core Suite</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isPremiumDropdownOpen && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isPremiumDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsPremiumDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-96 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50">
                      {/* Core Suite Section */}
                      <div className="p-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b border-sovereign-border-subtle rounded-t-xl">
                        <h3 className="font-semibold text-white flex items-center gap-2"><Brain className="w-4 h-4 text-cyan-400" /> The Core Suite</h3>
                        <p className="text-xs text-cyan-400">User-facing decision tools</p>
                      </div>
                      <div className="py-2">
                        {coreSuiteFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => {
                              navigate(feature.path);
                              setIsPremiumDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors',
                              location.pathname === feature.path &&
                                'bg-sovereign-active border-l-2 border-cyan-500'
                            )}
                          >
                            <feature.Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                            <div className="text-left flex-1">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Trust Layer Section */}
                      <div className="p-3 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-t border-sovereign-border-subtle">
                        <h3 className="font-semibold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-amber-400" /> The Trust Layer</h3>
                        <p className="text-xs text-amber-400">Compliance & Proof</p>
                      </div>
                      <div className="py-2">
                        {trustLayerFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => {
                              navigate(feature.path);
                              setIsPremiumDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors',
                              location.pathname === feature.path &&
                                'bg-sovereign-active border-l-2 border-amber-500'
                            )}
                          >
                            <feature.Icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-left flex-1">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Additional Services */}
                      <div className="p-2 border-t border-sovereign-border-subtle">
                        <p className="px-2 text-xs font-semibold text-gray-600 uppercase mb-1">
                          Additional Services
                        </p>
                        {additionalServices.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              navigate(service.path);
                              setIsPremiumDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 px-4 py-2 hover:bg-sovereign-hover transition-colors rounded-lg',
                              location.pathname === service.path && 'bg-sovereign-active'
                            )}
                          >
                            <service.Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div className="text-left">
                              <p className="font-medium text-white text-sm">{service.label}</p>
                              <p className="text-xs text-gray-500">{service.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Vertical Packs Dropdown (The "Specialist") */}
              <div className="relative">
                <button
                  onClick={() => setIsEnterpriseDropdownOpen(!isEnterpriseDropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                    'bg-sovereign-card border border-sovereign-border text-gray-300',
                    'hover:bg-sovereign-hover hover:text-white hover:border-purple-500/50 transition-all'
                  )}
                >
                  <Factory className="w-4 h-4" />
                  <span className="hidden md:inline">Verticals</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isEnterpriseDropdownOpen && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isEnterpriseDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsEnterpriseDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-80 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 max-h-[70vh] flex flex-col">
                      <div className="p-3 bg-gradient-to-r from-purple-900/30 to-violet-900/30 border-b border-sovereign-border-subtle rounded-t-xl flex-shrink-0">
                        <h3 className="font-semibold text-white flex items-center gap-2"><Factory className="w-4 h-4 text-purple-400" /> Industry Verticals</h3>
                        <p className="text-xs text-purple-400">
                          17 verticals • 400+ council modes • 200+ AI agents
                        </p>
                      </div>
                      <div className="py-2 overflow-y-auto flex-1">
                        {verticalPacks.map((pack) => (
                          <button
                            key={pack.id}
                            onClick={() => {
                              navigate(pack.path);
                              setIsEnterpriseDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 px-4 py-2 hover:bg-sovereign-hover transition-colors',
                              location.pathname === pack.path &&
                                'bg-sovereign-active border-l-2 border-purple-500'
                            )}
                          >
                            <pack.Icon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div className="text-left flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-white text-sm">{pack.label}</p>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-900/30 text-purple-400">
                                  {pack.industry}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{pack.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-2 bg-sovereign-elevated border-t border-sovereign-border-subtle rounded-b-xl flex-shrink-0">
                        <button
                          onClick={() => {
                            navigate('/cortex/admin/vertical-config');
                            setIsEnterpriseDropdownOpen(false);
                          }}
                          className="w-full text-xs text-purple-400 hover:text-purple-300 text-center"
                        >
                          Configure Vertical Services
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Dropdown (hidden for non-admins in production) */}
              <div className="relative">
                <button
                  onClick={() => setIsSovereignDropdownOpen(!isSovereignDropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                    'bg-sovereign-card border border-sovereign-border text-gray-300',
                    'hover:bg-sovereign-hover hover:text-white hover:border-gray-500/50 transition-all'
                  )}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isSovereignDropdownOpen && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isSovereignDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSovereignDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-80 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50">
                      <div className="p-3 bg-sovereign-elevated border-b border-sovereign-border-subtle rounded-t-xl">
                        <h3 className="font-semibold text-white flex items-center gap-2"><Settings className="w-4 h-4 text-gray-400" /> Administration</h3>
                        <p className="text-xs text-gray-500">
                          System configuration & management
                        </p>
                      </div>
                      <div className="py-2">
                        {/* Vertical Config */}
                        <button
                          onClick={() => {
                            navigate('/cortex/admin/vertical-config');
                            setIsSovereignDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors',
                            location.pathname === '/cortex/admin/vertical-config' &&
                              'bg-sovereign-active border-l-2 border-cyan-500'
                          )}
                        >
                          <Settings className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                          <div className="text-left">
                            <p className="font-medium text-white text-sm">Vertical Config</p>
                            <p className="text-xs text-gray-500">Industry & service toggles</p>
                          </div>
                        </button>
                        {/* Long-horizon features */}
                        {filteredSovereignFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => {
                              navigate(feature.path);
                              setIsSovereignDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors',
                              location.pathname === feature.path &&
                                'bg-sovereign-active border-l-2 border-cyan-500'
                            )}
                          >
                            <feature.Icon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div className="text-left">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-3 bg-sovereign-elevated border-t border-sovereign-border-subtle">
                        <p className="text-xs text-gray-500 text-center">
                          Owner/Admin access only
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <button
                aria-label="Notifications"
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-sovereign-hover"
              >
                <Icons.Bell />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson-600 rounded-full"
                  aria-hidden="true"
                />
              </button>

              {/* Demo Mode Toggle */}
              <DemoModeToggle />

              {/* Notifications */}
              <NotificationBell />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Selector */}
              <LanguageSelector />

              {/* User menu */}
              <div className="relative">
                <button
                  aria-label="User menu"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="p-1.5 rounded-lg hover:bg-sovereign-hover"
                >
                  <div className="w-8 h-8 bg-crimson-900/30 rounded-full flex items-center justify-center">
                    <span className="text-crimson-400 font-medium text-sm">{userInitials}</span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50">
                      <div className="p-4 border-b border-sovereign-border-subtle">
                        <p className="text-sm font-semibold text-white">
                          {user?.name || 'John Smith'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || 'john@datacendia.com'}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate('/cortex/profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-sovereign-hover hover:text-white"
                        >
                          <Eye className="w-3.5 h-3.5" /> <span>View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/cortex/settings');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-sovereign-hover hover:text-white"
                        >
                          <Settings className="w-3.5 h-3.5" /> <span>Settings</span>
                        </button>
                        <button
                          onClick={async () => {
                            setIsUserMenuOpen(false);
                            await logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-crimson-400 hover:bg-crimson-900/20"
                        >
                          ⎋ <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-sovereign-base">
            {/* Breadcrumbs for deep navigation */}
            <div className="px-4 lg:px-6 py-2 border-b border-sovereign-border-subtle bg-sovereign-elevated/50">
              <Breadcrumbs className="text-slate-400" />
            </div>
            <Outlet />
          </main>

          {/* Workflow Indicator */}
          <WorkflowIndicator />
        </div>

        {/* ================================================================= */}
        {/* MOBILE SIDEBAR OVERLAY */}
        {/* ================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sovereign-elevated shadow-2xl border-r border-sovereign-border-subtle">
              {/* Logo */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-sovereign-border-subtle">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-sovereign-hover"
                >
                  ×
                </button>
              </div>

              {/* Navigation */}
              <nav className="py-4 px-2 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'transition-colors text-sm font-medium',
                        active
                          ? 'bg-sovereign-active text-white border-l-2 border-cyan-500'
                          : 'text-gray-400 hover:bg-sovereign-hover hover:text-white'
                      )}
                    >
                      <Icon />
                      <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}
      </div>

      {/* AI Platform Assistant */}
      <PlatformAssistant />
    </DataSourceProvider>
  );
};

// Wrapper component that provides language context
export const CortexLayout: React.FC = () => {
  return (
    <LanguageProvider>
      <CortexLayoutInner />
    </LanguageProvider>
  );
};

export default CortexLayout;
