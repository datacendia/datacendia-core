// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM — SUBSCRIPTION TIERS & FEATURE GATING
// 3-Tier Architecture: Foundation → Enterprise → Strategic
// Sovereign-first enterprise software. Not SaaS. Annual licenses.
// =============================================================================

import type { PillarId, PlatformTier } from '../PlatformCatalog.js';
import { PLATFORM_PILLARS, isPillarIncludedInTier } from '../PlatformCatalog.js';

// =============================================================================
// SUBSCRIPTION TIER DEFINITIONS
// =============================================================================

export type SubscriptionTier =
  | 'pilot'        // 90-day evaluation ($50K)
  | 'foundation'   // Tier 1: Council + DECIDE + DCII ($150K-$500K/yr)
  | 'enterprise'   // Tier 2: + StressTest, Comply, Govern, Sovereign, Operate ($500K-$1.5M/yr)
  | 'strategic'    // Tier 3: + Collapse, SGAS, Verticals, Frontier (Custom $1.5M+/yr)
  | 'custom';      // Negotiated — Government/Defense/Platinum

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  platformTier: PlatformTier | 'pilot' | 'custom';
  pricing: {
    annualMin: number;      // Minimum annual license ($)
    annualMax: number;      // Maximum annual license ($)
    pilotPrice: number;     // 90-day pilot ($)
    label: string;
  };
  pillars: PillarId[];
  features: FeatureAccess;
  limits: TierLimits;
  support: SupportLevel;
  sla: SLAConfig;
}

export interface FeatureAccess {
  // Tier 1: Foundation Pillars
  theCouncil: boolean;          // Council deliberation engine
  decide: boolean;              // DECIDE intelligence layer
  dcii: boolean;                // DCII proof infrastructure

  // Tier 1: Foundation Services
  preMortem: boolean;
  ghostBoard: boolean;
  decisionDebt: boolean;
  decisionDebtDashboard: boolean;  // Backward compat alias for decisionDebt
  chronos: boolean;
  ninePrivimitives: boolean;    // P1-P9
  evidenceVault: boolean;
  regulatorsReceipt: boolean;
  regulatoryInstantAbsorb: boolean;  // Backward compat alias for regulatoryAbsorb
  liveDemoMode: boolean;             // Backward compat — included in Foundation+
  iissScoring: boolean;
  biasMitigation: boolean;

  // Tier 2: Enterprise Pillars
  stressTest: boolean;          // STRESS-TEST pillar
  comply: boolean;              // COMPLY pillar
  govern: boolean;              // GOVERN pillar
  sovereign: boolean;           // SOVEREIGN pillar
  operate: boolean;             // OPERATE (CendiaOps) pillar

  // Tier 2: Enterprise Services
  crucible: boolean;
  redTeam: boolean;
  warGames: boolean;
  complianceMonitor: boolean;
  regulatoryAbsorb: boolean;
  complianceGuard: boolean;
  policyEngine: boolean;
  dissent: boolean;
  autopilot: boolean;
  sovereignDeploy: boolean;
  postQuantumKMS: boolean;
  departmentCopilots: boolean;
  omniTranslate: boolean;
  apotheosis: boolean;

  // Tier 3: Strategic Pillars
  collapse: boolean;            // COLLAPSE pillar
  sgas: boolean;                // SGAS pillar
  verticals: boolean;           // VERTICALS pillar
  frontier: boolean;            // FRONTIER pillar

  // Tier 3: Strategic Services
  collapseAgents: boolean;
  sgasSimulation: boolean;
  deepVerticals: boolean;
  nationScale: boolean;

  // Council Modes
  councilModes: {
    warRoom: boolean;
    dueDiligence: boolean;
    innovationLab: boolean;
    compliance: boolean;
    crisis: boolean;
    execution: boolean;
    research: boolean;
    investment: boolean;
    stakeholder: boolean;
    rapid: boolean;
    advisory: boolean;
    governance: boolean;
  };

  // Integration & Platform Features
  customConnectors: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  ssoIntegration: boolean;
  auditLogs: boolean;
  customBranding: boolean;
  whiteLabeling: boolean;
  airGapDeploy: boolean;
}

export interface TierLimits {
  users: number;                         // -1 = unlimited
  councilDeliberationsPerMonth: number;
  preMortemAnalysesPerMonth: number;
  ghostBoardSessionsPerMonth: number;
  regulatoryDocumentsPerMonth: number;
  dataSources: number;
  storageGB: number;
  apiCallsPerMonth: number;
  retentionDays: number;
  maxCouncilAgents: number;
  departmentCopilots: number;            // Number of department co-pilots available
  jurisdictions: number;                 // Cross-jurisdiction coverage
  complianceFrameworks: number;          // Compliance frameworks available
}

export type SupportLevel = 'email' | 'priority' | 'dedicated' | 'white_glove';

export interface SLAConfig {
  uptimeGuarantee: number;
  responseTimeMinutes: number;
  resolutionTimeHours: number;
}

// =============================================================================
// TIER CONFIGURATIONS
// =============================================================================

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  pilot: {
    id: 'pilot',
    name: 'pilot',
    displayName: 'DCII Pilot',
    platformTier: 'pilot',
    pricing: {
      annualMin: 50000,
      annualMax: 50000,
      pilotPrice: 50000,
      label: '$50,000 — 90 days, 1 business unit',
    },
    pillars: ['council', 'decide', 'dcii'],
    features: {
      theCouncil: true,
      decide: true,
      dcii: true,
      preMortem: true,
      ghostBoard: true,
      decisionDebt: true,
      decisionDebtDashboard: true,
      chronos: true,
      ninePrivimitives: true,
      evidenceVault: true,
      regulatorsReceipt: true,
      regulatoryInstantAbsorb: true,
      liveDemoMode: true,
      iissScoring: true,
      biasMitigation: true,

      stressTest: false, comply: false, govern: false, sovereign: false, operate: false,
      crucible: false, redTeam: false, warGames: false, complianceMonitor: false,
      regulatoryAbsorb: false, complianceGuard: false, policyEngine: false,
      dissent: false, autopilot: false, sovereignDeploy: false, postQuantumKMS: false,
      departmentCopilots: false, omniTranslate: false, apotheosis: false,

      collapse: false, sgas: false, verticals: false, frontier: false,
      collapseAgents: false, sgasSimulation: false, deepVerticals: false, nationScale: false,

      councilModes: {
        warRoom: false, dueDiligence: true, innovationLab: false, compliance: true,
        crisis: false, execution: true, research: true, investment: false,
        stakeholder: false, rapid: true, advisory: true, governance: false,
      },

      customConnectors: false, apiAccess: true, webhooks: true, ssoIntegration: false,
      auditLogs: true, customBranding: false, whiteLabeling: false, airGapDeploy: false,
    },
    limits: {
      users: 10, councilDeliberationsPerMonth: 100, preMortemAnalysesPerMonth: 20,
      ghostBoardSessionsPerMonth: 10, regulatoryDocumentsPerMonth: 5, dataSources: 5,
      storageGB: 50, apiCallsPerMonth: 50000, retentionDays: 90, maxCouncilAgents: 15,
      departmentCopilots: 0, jurisdictions: 3, complianceFrameworks: 3,
    },
    support: 'priority',
    sla: { uptimeGuarantee: 99.5, responseTimeMinutes: 240, resolutionTimeHours: 24 },
  },

  foundation: {
    id: 'foundation',
    name: 'foundation',
    displayName: 'Foundation',
    platformTier: 'foundation',
    pricing: {
      annualMin: 150000,
      annualMax: 500000,
      pilotPrice: 50000,
      label: '$150,000–$500,000/year — Council + DECIDE + DCII',
    },
    pillars: ['council', 'decide', 'dcii'],
    features: {
      theCouncil: true,
      decide: true,
      dcii: true,
      preMortem: true,
      ghostBoard: true,
      decisionDebt: true,
      decisionDebtDashboard: true,
      chronos: true,
      ninePrivimitives: true,
      evidenceVault: true,
      regulatorsReceipt: true,
      regulatoryInstantAbsorb: true,
      liveDemoMode: true,
      iissScoring: true,
      biasMitigation: true,

      stressTest: false, comply: false, govern: false, sovereign: false, operate: false,
      crucible: false, redTeam: false, warGames: false, complianceMonitor: false,
      regulatoryAbsorb: false, complianceGuard: false, policyEngine: false,
      dissent: false, autopilot: false, sovereignDeploy: false, postQuantumKMS: false,
      departmentCopilots: false, omniTranslate: false, apotheosis: false,

      collapse: false, sgas: false, verticals: false, frontier: false,
      collapseAgents: false, sgasSimulation: false, deepVerticals: false, nationScale: false,

      councilModes: {
        warRoom: true, dueDiligence: true, innovationLab: true, compliance: true,
        crisis: true, execution: true, research: true, investment: true,
        stakeholder: true, rapid: true, advisory: true, governance: true,
      },

      customConnectors: true, apiAccess: true, webhooks: true, ssoIntegration: true,
      auditLogs: true, customBranding: false, whiteLabeling: false, airGapDeploy: false,
    },
    limits: {
      users: 50, councilDeliberationsPerMonth: 1000, preMortemAnalysesPerMonth: 100,
      ghostBoardSessionsPerMonth: 50, regulatoryDocumentsPerMonth: 20, dataSources: 25,
      storageGB: 500, apiCallsPerMonth: 500000, retentionDays: 365, maxCouncilAgents: 15,
      departmentCopilots: 0, jurisdictions: 5, complianceFrameworks: 5,
    },
    support: 'dedicated',
    sla: { uptimeGuarantee: 99.9, responseTimeMinutes: 60, resolutionTimeHours: 8 },
  },

  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    platformTier: 'enterprise',
    pricing: {
      annualMin: 500000,
      annualMax: 1500000,
      pilotPrice: 50000,
      label: '$500,000–$1,500,000/year — Foundation + StressTest, Comply, Govern, Sovereign, Operate',
    },
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
    features: {
      theCouncil: true,
      decide: true,
      dcii: true,
      preMortem: true,
      ghostBoard: true,
      decisionDebt: true,
      decisionDebtDashboard: true,
      chronos: true,
      ninePrivimitives: true,
      evidenceVault: true,
      regulatorsReceipt: true,
      regulatoryInstantAbsorb: true,
      liveDemoMode: true,
      iissScoring: true,
      biasMitigation: true,

      stressTest: true,
      comply: true,
      govern: true,
      sovereign: true,
      operate: true,
      crucible: true,
      redTeam: true,
      warGames: true,
      complianceMonitor: true,
      regulatoryAbsorb: true,
      complianceGuard: true,
      policyEngine: true,
      dissent: true,
      autopilot: true,
      sovereignDeploy: true,
      postQuantumKMS: true,
      departmentCopilots: true,
      omniTranslate: true,
      apotheosis: true,

      collapse: false, sgas: false, verticals: false, frontier: false,
      collapseAgents: false, sgasSimulation: false, deepVerticals: false, nationScale: false,

      councilModes: {
        warRoom: true, dueDiligence: true, innovationLab: true, compliance: true,
        crisis: true, execution: true, research: true, investment: true,
        stakeholder: true, rapid: true, advisory: true, governance: true,
      },

      customConnectors: true, apiAccess: true, webhooks: true, ssoIntegration: true,
      auditLogs: true, customBranding: true, whiteLabeling: false, airGapDeploy: true,
    },
    limits: {
      users: 500, councilDeliberationsPerMonth: -1, preMortemAnalysesPerMonth: -1,
      ghostBoardSessionsPerMonth: -1, regulatoryDocumentsPerMonth: -1, dataSources: -1,
      storageGB: 5000, apiCallsPerMonth: -1, retentionDays: -1, maxCouncilAgents: -1,
      departmentCopilots: 19, jurisdictions: 17, complianceFrameworks: 10,
    },
    support: 'white_glove',
    sla: { uptimeGuarantee: 99.99, responseTimeMinutes: 15, resolutionTimeHours: 4 },
  },

  strategic: {
    id: 'strategic',
    name: 'strategic',
    displayName: 'Strategic',
    platformTier: 'strategic',
    pricing: {
      annualMin: 1500000,
      annualMax: 0, // Custom / negotiated
      pilotPrice: 50000,
      label: '$2M–$100M+/year — Enterprise + Resilience, Model, Dominate, Nation',
    },
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
    features: {
      theCouncil: true, decide: true, dcii: true,
      preMortem: true, ghostBoard: true, decisionDebt: true, decisionDebtDashboard: true, chronos: true,
      ninePrivimitives: true, evidenceVault: true, regulatorsReceipt: true,
      regulatoryInstantAbsorb: true, liveDemoMode: true,
      iissScoring: true, biasMitigation: true,

      stressTest: true, comply: true, govern: true, sovereign: true, operate: true,
      crucible: true, redTeam: true, warGames: true, complianceMonitor: true,
      regulatoryAbsorb: true, complianceGuard: true, policyEngine: true,
      dissent: true, autopilot: true, sovereignDeploy: true, postQuantumKMS: true,
      departmentCopilots: true, omniTranslate: true, apotheosis: true,

      collapse: true, sgas: true, verticals: true, frontier: true,
      collapseAgents: true, sgasSimulation: true, deepVerticals: true, nationScale: true,

      councilModes: {
        warRoom: true, dueDiligence: true, innovationLab: true, compliance: true,
        crisis: true, execution: true, research: true, investment: true,
        stakeholder: true, rapid: true, advisory: true, governance: true,
      },

      customConnectors: true, apiAccess: true, webhooks: true, ssoIntegration: true,
      auditLogs: true, customBranding: true, whiteLabeling: true, airGapDeploy: true,
    },
    limits: {
      users: -1, councilDeliberationsPerMonth: -1, preMortemAnalysesPerMonth: -1,
      ghostBoardSessionsPerMonth: -1, regulatoryDocumentsPerMonth: -1, dataSources: -1,
      storageGB: -1, apiCallsPerMonth: -1, retentionDays: -1, maxCouncilAgents: -1,
      departmentCopilots: -1, jurisdictions: -1, complianceFrameworks: -1,
    },
    support: 'white_glove',
    sla: { uptimeGuarantee: 99.99, responseTimeMinutes: 15, resolutionTimeHours: 4 },
  },

  custom: {
    id: 'custom',
    name: 'custom',
    displayName: 'Custom / Government / Defense',
    platformTier: 'custom',
    pricing: {
      annualMin: 0,
      annualMax: 0,
      pilotPrice: 0,
      label: 'Custom — Negotiated engagement (Government, Defense, Platinum)',
    },
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
    features: {
      theCouncil: true, decide: true, dcii: true,
      preMortem: true, ghostBoard: true, decisionDebt: true, decisionDebtDashboard: true, chronos: true,
      ninePrivimitives: true, evidenceVault: true, regulatorsReceipt: true,
      regulatoryInstantAbsorb: true, liveDemoMode: true,
      iissScoring: true, biasMitigation: true,

      stressTest: true, comply: true, govern: true, sovereign: true, operate: true,
      crucible: true, redTeam: true, warGames: true, complianceMonitor: true,
      regulatoryAbsorb: true, complianceGuard: true, policyEngine: true,
      dissent: true, autopilot: true, sovereignDeploy: true, postQuantumKMS: true,
      departmentCopilots: true, omniTranslate: true, apotheosis: true,

      collapse: true, sgas: true, verticals: true, frontier: true,
      collapseAgents: true, sgasSimulation: true, deepVerticals: true, nationScale: true,

      councilModes: {
        warRoom: true, dueDiligence: true, innovationLab: true, compliance: true,
        crisis: true, execution: true, research: true, investment: true,
        stakeholder: true, rapid: true, advisory: true, governance: true,
      },

      customConnectors: true, apiAccess: true, webhooks: true, ssoIntegration: true,
      auditLogs: true, customBranding: true, whiteLabeling: true, airGapDeploy: true,
    },
    limits: {
      users: -1, councilDeliberationsPerMonth: -1, preMortemAnalysesPerMonth: -1,
      ghostBoardSessionsPerMonth: -1, regulatoryDocumentsPerMonth: -1, dataSources: -1,
      storageGB: -1, apiCallsPerMonth: -1, retentionDays: -1, maxCouncilAgents: -1,
      departmentCopilots: -1, jurisdictions: -1, complianceFrameworks: -1,
    },
    support: 'white_glove',
    sla: { uptimeGuarantee: 99.99, responseTimeMinutes: 15, resolutionTimeHours: 4 },
  },
};

// =============================================================================
// FEATURE DEFINITIONS FOR UI/UX
// =============================================================================

export interface FeatureDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'foundation' | 'enterprise' | 'strategic' | 'council_mode' | 'integration';
  icon: string;
  minimumTier: SubscriptionTier;
  pillar: PillarId;
}

export const FEATURE_DEFINITIONS: Record<string, FeatureDefinition> = {
  preMortem: {
    id: 'preMortem',
    name: 'Pre-Mortem',
    displayName: '💀 CendiaPreMortem™',
    description: 'Predicts why a decision will fail BEFORE you make it.',
    category: 'foundation',
    icon: '💀',
    minimumTier: 'foundation',
    pillar: 'decide',
  },
  ghostBoard: {
    id: 'ghostBoard',
    name: 'Ghost Board',
    displayName: '👻 Ghost Board™',
    description: 'Rehearse board meetings with AI directors that challenge harder than your real board.',
    category: 'foundation',
    icon: '👻',
    minimumTier: 'foundation',
    pillar: 'decide',
  },
  decisionDebt: {
    id: 'decisionDebt',
    name: 'Decision Debt',
    displayName: '📊 Decision Debt™',
    description: 'Shows cost of NOT deciding — $/day of organizational delay.',
    category: 'foundation',
    icon: '📊',
    minimumTier: 'foundation',
    pillar: 'decide',
  },
  regulatorsReceipt: {
    id: 'regulatorsReceipt',
    name: "Regulator's Receipt",
    displayName: "📜 Regulator's Receipt™",
    description: 'One-click court-admissible PDF — the demo moment.',
    category: 'foundation',
    icon: '📜',
    minimumTier: 'foundation',
    pillar: 'dcii',
  },
  crucible: {
    id: 'crucible',
    name: 'Crucible',
    displayName: '⚡ CendiaCrucible™',
    description: 'Enterprise red-teaming with Monte Carlo simulation, SBOM, runtime security.',
    category: 'enterprise',
    icon: '⚡',
    minimumTier: 'enterprise',
    pillar: 'stress_test',
  },
  complianceMonitor: {
    id: 'complianceMonitor',
    name: 'Compliance Monitor',
    displayName: '✅ Compliance Monitor',
    description: 'Always-on compliance drift detection across 17 jurisdictions.',
    category: 'enterprise',
    icon: '✅',
    minimumTier: 'enterprise',
    pillar: 'comply',
  },
  deepVerticals: {
    id: 'deepVerticals',
    name: 'Deep Verticals',
    displayName: '🏭 Industry Verticals',
    description: 'Pre-built industry integrations: Legal (14 agents, 48 modes), Sports, Defense, Healthcare, Financial.',
    category: 'strategic',
    icon: '🏭',
    minimumTier: 'strategic',
    pillar: 'verticals',
  },
};

// =============================================================================
// FEATURE GATING SERVICE
// =============================================================================

export class FeatureGatingService {
  private static instance: FeatureGatingService;
  private customOverrides: Map<string, Partial<FeatureAccess>> = new Map();

  private constructor() {}

  static getInstance(): FeatureGatingService {
    if (!FeatureGatingService.instance) {
      FeatureGatingService.instance = new FeatureGatingService();
    }
    return FeatureGatingService.instance;
  }

  hasFeature(tier: SubscriptionTier, featureKey: keyof FeatureAccess): boolean {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return false;
    return tierConfig.features[featureKey] === true;
  }

  hasCouncilMode(tier: SubscriptionTier, mode: keyof FeatureAccess['councilModes']): boolean {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return false;
    return tierConfig.features.councilModes[mode] === true;
  }

  hasPillar(tier: SubscriptionTier, pillarId: PillarId): boolean {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return false;
    return tierConfig.pillars.includes(pillarId);
  }

  getLimit(tier: SubscriptionTier, limitKey: keyof TierLimits): number {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return 0;
    const value = tierConfig.limits[limitKey];
    return typeof value === 'number' ? value : 0;
  }

  isWithinLimit(tier: SubscriptionTier, limitKey: keyof TierLimits, currentUsage: number): boolean {
    const limit = this.getLimit(tier, limitKey);
    if (limit === -1) return true;
    return currentUsage < limit;
  }

  getAvailableFeatures(tier: SubscriptionTier): string[] {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return [];
    const features: string[] = [];
    for (const [key, value] of Object.entries(tierConfig.features)) {
      if (key === 'councilModes') continue;
      if (value === true) features.push(key);
    }
    return features;
  }

  getAvailablePillars(tier: SubscriptionTier): PillarId[] {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return [];
    return tierConfig.pillars;
  }

  setCustomOverrides(organizationId: string, overrides: Partial<FeatureAccess>): void {
    this.customOverrides.set(organizationId, overrides);
  }

  hasFeatureWithOverrides(tier: SubscriptionTier, organizationId: string, featureKey: keyof FeatureAccess): boolean {
    const overrides = this.customOverrides.get(organizationId);
    if (overrides && overrides[featureKey] !== undefined) {
      return overrides[featureKey] as boolean;
    }
    return this.hasFeature(tier, featureKey);
  }

  getUpgradeTierForFeature(featureKey: keyof FeatureAccess): SubscriptionTier | null {
    const tiers: SubscriptionTier[] = ['pilot', 'foundation', 'enterprise', 'strategic'];
    for (const tier of tiers) {
      if (this.hasFeature(tier, featureKey)) return tier;
    }
    return null;
  }

  getUsagePercentage(tier: SubscriptionTier, limitKey: keyof TierLimits, currentUsage: number): number {
    const limit = this.getLimit(tier, limitKey);
    if (limit === -1) return 0;
    if (limit === 0) return 100;
    return Math.round((currentUsage / limit) * 100);
  }
}

export const featureGating = FeatureGatingService.getInstance();
