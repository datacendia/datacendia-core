// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM — TIER & FEATURE DEFINITIONS (Frontend)
// 3-Tier Architecture: Foundation → Enterprise → Strategic
// Sovereign-first enterprise software. Not SaaS. Annual licenses.
// =============================================================================

export type PremiumTier = 'pilot' | 'foundation' | 'enterprise' | 'strategic';

export type PillarId =
  | 'council' | 'decide' | 'dcii'
  | 'stress_test' | 'comply' | 'govern' | 'sovereign' | 'operate'
  | 'collapse' | 'sgas' | 'verticals' | 'frontier';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: PremiumTier;
  pillar: PillarId;
  features: string[];
  agentIntegration: string;
  comingSoon?: boolean;
}

export interface PremiumBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: PremiumTier;
  pillars: PillarId[];
  annualPricing: string;
  includedFeatures: string[];
  popular?: boolean;
}

// =============================================================================
// 3-TIER DEFINITIONS
// =============================================================================
export const PREMIUM_TIERS: Record<
  PremiumTier,
  { name: string; color: string; bgGradient: string; icon: string; annualPricing: string; tagline: string; pillarCount: number }
> = {
  pilot: {
    name: 'DCII Pilot',
    color: '#6B7280',
    bgGradient: 'from-gray-500 to-slate-600',
    icon: '🧪',
    annualPricing: '$50,000 (90 days)',
    tagline: 'Evaluate the full Foundation tier for 90 days',
    pillarCount: 3,
  },
  foundation: {
    name: 'Foundation',
    color: '#3B82F6',
    bgGradient: 'from-blue-500 to-indigo-600',
    icon: '🏛️',
    annualPricing: '$150,000–$500,000/year',
    tagline: 'Make decisions → Understand them → Prove them',
    pillarCount: 3,
  },
  enterprise: {
    name: 'Enterprise',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500 to-violet-600',
    icon: '⚡',
    annualPricing: '$500,000–$1,500,000/year',
    tagline: 'Harden, automate, and scale across the entire organization',
    pillarCount: 8,
  },
  strategic: {
    name: 'Strategic',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-600',
    icon: '👑',
    annualPricing: '$2M–$100M+/year',
    tagline: 'From enterprise tool to strategic weapon',
    pillarCount: 12,
  },
};

// =============================================================================
// PILLAR-BASED FEATURES — organized by tier and pillar
// =============================================================================
export const PREMIUM_FEATURES: PremiumFeature[] = [
  // ===== TIER 1: FOUNDATION — Council + DECIDE + DCII =====
  {
    id: 'the-council',
    name: 'THE COUNCIL',
    description: 'Multi-agent AI deliberation system — the engine that produces decisions',
    icon: '🧠',
    tier: 'foundation',
    pillar: 'council',
    features: [
      '15 Core C-Suite Agents (CFO, CTO, CISO, CLO, COO, CMO, etc.)',
      'Premium Agent Packs (Healthcare, Finance, Legal, Audit)',
      'CendiaVeto™ Agents — 6 agents with blocking power',
      'CendiaUnion™ Agents — worker representation voices',
      'PersonaForge™ — create custom agents',
      '35+ Council Modes (War Room, Crisis, Due Diligence, etc.)',
      'CendiaLive™ — watch agents debate in real-time',
      'CendiaReplay™ — rewatch past deliberations',
    ],
    agentIntegration: '15 C-Suite agents debate decisions with cross-examination, veto powers, and real-time visualization',
  },
  {
    id: 'decide',
    name: 'DECIDE',
    description: 'Intelligence about every decision — before, during, and after',
    icon: '🔍',
    tier: 'foundation',
    pillar: 'decide',
    features: [
      'CendiaChronos™ — time machine, replay & fork decisions',
      'CendiaPreMortem™ — predict why decisions will fail',
      'Ghost Board™ — rehearse against tough AI directors',
      'Decision Debt™ — cost of NOT deciding ($/day)',
      'CendiaEcho™ — track outcomes vs. predictions',
      'CendiaCascade™ — second/third-order consequences',
      'What-If Scenarios — model multiple futures',
      'Consensus Builder — multi-stakeholder alignment',
    ],
    agentIntegration: 'The intelligence layer adds depth to every Council deliberation with predictive analytics and outcome tracking',
  },
  {
    id: 'dcii',
    name: 'DCII — Decision Crisis Immunization Infrastructure',
    description: 'Prove decisions survive scrutiny — the 9 primitives + cryptographic proof',
    icon: '💥',
    tier: 'foundation',
    pillar: 'dcii',
    features: [
      '9 Decision Primitives (P1-P9)',
      'CendiaVault™ — immutable evidence storage',
      'CendiaNotary™ — customer-owned key signing',
      'CendiaIISS™ — 0-1000 institutional resilience score',
      "Regulator's Receipt™ — one-click court-admissible PDF",
      'CendiaBiasMitigation™ — 12 cognitive bias types tested',
      'CendiaJurisdiction™ — 17 jurisdictions',
      'Decision Packets — cryptographically signed outputs',
    ],
    agentIntegration: 'Every Council decision gets cryptographic proof infrastructure — when regulators challenge you, DCII is what you show them',
  },

  // ===== TIER 2: ENTERPRISE — StressTest, Comply, Govern, Sovereign, Operate =====
  {
    id: 'stress-test',
    name: 'STRESS-TEST',
    description: 'Attack decisions before reality does',
    icon: '⚡',
    tier: 'enterprise',
    pillar: 'stress_test',
    features: [
      'CendiaCrucible™ — enterprise red-teaming',
      'CendiaRedTeam™ — 8 adversarial perspectives',
      'War Games — competitive scenario modeling',
      'SCGE — Synthetic Crisis Governance Engine',
      'Monte Carlo Engine — thousands of simulations',
      'Runtime Security — live monitoring',
      'SBOM Service — supply chain security',
    ],
    agentIntegration: 'Red-team agents attack every Council decision before it ships',
  },
  {
    id: 'comply',
    name: 'COMPLY',
    description: 'Stay legal everywhere, automatically',
    icon: '✅',
    tier: 'enterprise',
    pillar: 'comply',
    features: [
      'CendiaPanopticon™ — real-time regulatory radar',
      'Regulatory Absorb™ V2 — AI learns 500-page regs in 60s',
      'Compliance Monitor — always-on drift detection',
      '10 Compliance Frameworks (SOC2, GDPR, HIPAA, etc.)',
      'Cross-Jurisdiction Engine — 17 jurisdictions',
      'CendiaSandbox™ — test against PROPOSED regulations',
      'CendiaInsure™ — per-decision liability coverage',
    ],
    agentIntegration: 'Compliance agents validate every Council decision against active regulations in real-time',
  },
  {
    id: 'govern',
    name: 'GOVERN',
    description: 'Rules, oversight, and accountability',
    icon: '⚖️',
    tier: 'enterprise',
    pillar: 'govern',
    features: [
      'CendiaGovern™ — policy management, RBAC',
      'CendiaCourt™ — AI dispute resolution',
      'CendiaDissent™ — protected whistleblower channels',
      'CendiaAutopilot™ — autonomous AI + human-in-the-loop',
      'Logic Gate — auto approve/block rules engine',
      'Real-Time Policy Enforcement',
    ],
    agentIntegration: 'Governance agents enforce policies and track accountability across all Council decisions',
  },
  {
    id: 'sovereign',
    name: 'SOVEREIGN',
    description: 'Your infrastructure, your keys, your proof',
    icon: '🔒',
    tier: 'enterprise',
    pillar: 'sovereign',
    features: [
      '11 Sovereign Architectural Patterns (Data Diode, Shadow Council, etc.)',
      'Post-Quantum KMS (Dilithium, SPHINCS+, Falcon)',
      'CendiaBlackBox™ — sealed decision recording',
      'Federated Mesh — multi-org without sharing data',
      'Local RLHF — on-prem AI training',
      'CAC/PIV Auth — military smart card',
      'Air-gapped deployment options',
    ],
    agentIntegration: 'Council runs on customer-owned infrastructure with full data sovereignty',
  },
  {
    id: 'operate',
    name: 'CendiaOps™',
    description: 'AI co-pilots for every department',
    icon: '�',
    tier: 'enterprise',
    pillar: 'operate',
    features: [
      '19 Department Co-Pilots (Brand, Revenue, Support, Legal, etc.)',
      'CendiaOmniTranslate™ — 100+ languages',
      'CendiaApotheosis™ — nightly AI self-improvement',
      'CendiaAutoHeal — self-diagnosing debugging',
      'CendiaPulse — mission control dashboard',
      'CendiaCommand — CLI platform management',
    ],
    agentIntegration: 'Department co-pilots extend Council intelligence to every corner of the organization',
  },

  // ===== TIER 3: STRATEGIC — Collapse, SGAS, Verticals, Frontier =====
  {
    id: 'collapse',
    name: 'RESILIENCE',
    description: 'Institutional survival systems — collapse simulation, recovery, century-grade preservation',
    icon: '🛡️',
    tier: 'strategic',
    pillar: 'collapse',
    features: [
      'COLLAPSE Simulation — 18 agents, 7 societal failure domains',
      'CendiaPhoenix™ — institutional recovery playbooks',
      'CendiaEternal™ — century-grade knowledge preservation',
      'CendiaHorizon™ — generational strategic forecasting',
      'Succession Engine — leadership transition immunity',
      'Institutional Memory Architecture',
    ],
    agentIntegration: 'Resilience agents ensure Council decisions protect against institutional collapse and enable recovery',
  },
  {
    id: 'sgas',
    name: 'MODEL',
    description: 'Understand society before you act on it — population modeling, stakeholder voice, policy simulation',
    icon: '🌐',
    tier: 'strategic',
    pillar: 'sgas',
    features: [
      'SGAS Population Modeling — 5 agent classes at societal scale',
      'CendiaVox™ — give voice to affected populations',
      'CendiaNarratives™ — model how decisions change public discourse',
      'Synthetic Population Engine — demographic impact simulation',
      'Policy Impact Simulator — test regulations before they launch',
    ],
    agentIntegration: 'Modeling agents simulate societal-scale impacts before Council decisions affect populations',
  },
  {
    id: 'verticals',
    name: 'DOMINATE',
    description: 'Own your industry — 8 deep verticals with 48+ modes each',
    icon: '🏆',
    tier: 'strategic',
    pillar: 'verticals',
    features: [
      'Legal Vertical — 14 agents, 48 modes, CourtListener, SCOTUS integration',
      'Healthcare Vertical — clinical, pharma, biotech governance',
      'Finance Vertical — Basel IV, trade surveillance, portfolio stress-testing',
      'Sports Vertical — FFP, UEFA/FIFA governance, transfer analytics',
      'Energy, Defense, Government, Insurance verticals',
      'CendiaMesh™ M&A — multi-entity governance fusion',
      'CendiaGlass™ AR — decision augmented reality overlay',
    ],
    agentIntegration: 'Industry-specific agents with deep domain knowledge, compliance frameworks, and defensible outputs',
  },
  {
    id: 'frontier',
    name: 'NATION',
    description: 'Governance at national scale — policy modeling, multi-agency coordination, sovereign infrastructure',
    icon: '🌍',
    tier: 'strategic',
    pillar: 'frontier',
    features: [
      'CendiaNation™ — national economic OS',
      'National Compliance Framework — multi-agency regulatory coordination',
      'Multi-Agency Coordination — cross-department governance',
      'Sovereign National Infrastructure — government-grade deployment',
      'CendiaOmniShield™ — national cyber-defence grid',
      'CendiaMarketSovereign™ — central bank governance brain',
    ],
    agentIntegration: 'Nation-scale agents for governments, central banks, and civilization-scale governance actors',
  },
];

// =============================================================================
// TIER BUNDLES — each tier is a bundle of pillars
// =============================================================================
export const PREMIUM_BUNDLES: PremiumBundle[] = [
  {
    id: 'foundation-bundle',
    name: 'Foundation License',
    description: 'Make decisions, understand them, prove them. The minimum viable platform.',
    icon: '🏛️',
    tier: 'foundation',
    pillars: ['council', 'decide', 'dcii'],
    annualPricing: '$150,000–$500,000/year',
    includedFeatures: ['the-council', 'decide', 'dcii'],
    popular: true,
  },
  {
    id: 'enterprise-bundle',
    name: 'Enterprise License',
    description: 'Harden, automate, and scale. Everything in Foundation plus 5 enterprise pillars.',
    icon: '⚡',
    tier: 'enterprise',
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
    annualPricing: '$500,000–$1,500,000/year',
    includedFeatures: ['the-council', 'decide', 'dcii', 'stress-test', 'comply', 'govern', 'sovereign', 'operate'],
    popular: true,
  },
  {
    id: 'strategic-bundle',
    name: 'Strategic License',
    description: 'From enterprise tool to strategic weapon. All 12 pillars: Resilience, Model, Dominate, Nation.',
    icon: '👑',
    tier: 'strategic',
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
    annualPricing: '$2M–$100M+/year',
    includedFeatures: ['the-council', 'decide', 'dcii', 'stress-test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
export const getFeatureById = (id: string): PremiumFeature | undefined => {
  return PREMIUM_FEATURES.find((f) => f.id === id);
};

export const getFeaturesByTier = (tier: PremiumTier): PremiumFeature[] => {
  return PREMIUM_FEATURES.filter((f) => f.tier === tier);
};

export const getFeaturesByPillar = (pillar: PillarId): PremiumFeature[] => {
  return PREMIUM_FEATURES.filter((f) => f.pillar === pillar);
};

export const getBundleById = (id: string): PremiumBundle | undefined => {
  return PREMIUM_BUNDLES.find((b) => b.id === id);
};

export const getBundleByTier = (tier: PremiumTier): PremiumBundle | undefined => {
  return PREMIUM_BUNDLES.find((b) => b.tier === tier);
};

export const getPillarDisplayName = (pillarId: PillarId): string => {
  const names: Record<PillarId, string> = {
    council: 'THE COUNCIL', decide: 'DECIDE', dcii: 'DCII',
    stress_test: 'STRESS-TEST', comply: 'COMPLY', govern: 'GOVERN',
    sovereign: 'SOVEREIGN', operate: 'CendiaOps™',
    collapse: 'RESILIENCE', sgas: 'MODEL', verticals: 'DOMINATE', frontier: 'NATION',
  };
  return names[pillarId] || pillarId;
};
