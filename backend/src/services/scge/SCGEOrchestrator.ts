/**
 * SCGE™ — Synthetic Civic Governance Environment
 *
 * Decision verification via simulated civic populations, policy injection,
 * event sequences, and stressor schedules. Produces deterministic,
 * replayable simulations with Merkle-rooted audit packets.
 *
 * @module services/scge/SCGEOrchestrator
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import {
  deterministicFloat,
  deterministicInt,
  deterministicScore,
  deterministicPick,
  deterministicBool,
  deterministicPercentage,
} from '../../utils/deterministic.js';

// =============================================================================
// ENUMS & TYPES
// =============================================================================

export const AccessVariance = {
  NONE: 'none',
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  EXTREME: 'extreme',
} as const;

export const InformationAsymmetry = {
  NONE: 'none',
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  EXTREME: 'extreme',
} as const;

export const MobilityConstraint = {
  NONE: 'none',
  LIMITED: 'limited',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  IMMOBILE: 'immobile',
} as const;

export const ResourceScarcity = {
  ABUNDANT: 'abundant',
  SUFFICIENT: 'sufficient',
  CONSTRAINED: 'constrained',
  SCARCE: 'scarce',
  CRITICAL: 'critical',
} as const;

export const ComplianceVariance = {
  FULL_COMPLIANCE: 'full_compliance',
  HIGH_COMPLIANCE: 'high_compliance',
  MODERATE_COMPLIANCE: 'moderate_compliance',
  LOW_COMPLIANCE: 'low_compliance',
  NON_COMPLIANT: 'non_compliant',
} as const;

export const PolicyDomain = {
  ZONING: 'zoning',
  TAXATION: 'taxation',
  EDUCATION: 'education',
  HEALTHCARE: 'healthcare',
  TRANSPORTATION: 'transportation',
  PUBLIC_SAFETY: 'public_safety',
  ENVIRONMENT: 'environment',
  HOUSING: 'housing',
  LABOR: 'labor',
  TRADE: 'trade',
} as const;

export interface PopulationParameters {
  size: number;
  accessVarianceLevel: string;
  informationAsymmetryLevel: string;
  mobilityConstraintLevel: string;
  resourceScarcityLevel: string;
  complianceVarianceLevel: string;
  seed?: number;
}

export interface SimulationConfig {
  id: string;
  name: string;
  description: string;
  population: PopulationParameters;
  governance: any;
  policies: any[];
  events: any;
  stressors: any;
  institutions: any[];
  seed: number;
  timeScale: number;
  maxDuration: number;
  auditLevel: string;
}

interface Population {
  id: string;
  name: string;
  totalSize: number;
  distributions: {
    income: { low: number; middle: number; high: number };
    education: { none: number; primary: number; secondary: number; tertiary: number };
    age: { youth: number; working: number; senior: number };
    urbanRural: { urban: number; suburban: number; rural: number };
    employment: { employed: number; unemployed: number; informal: number };
  };
  generationSeed: number;
  hash: string;
  metadata: {
    accessVariance: string;
    informationAsymmetry: string;
    mobilityConstraint: string;
    resourceScarcity: string;
    complianceVariance: string;
    generatedAt: string;
  };
}

interface PolicyBundle {
  id: string;
  name: string;
  domain: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  rules: Array<{ id: string; condition: string; action: string; priority: number }>;
  constraints: Array<{ id: string; type: string; threshold: number; description: string }>;
  metadata: Record<string, any>;
  createdAt: string;
}

interface EventScenario {
  id: string;
  name: string;
  description: string;
  eventTemplates: Array<{
    id: string;
    name: string;
    type: string;
    severity: string;
    timing: string;
    affectsSegments: string[];
  }>;
}

interface EventSequence {
  id: string;
  name: string;
  scenarioId: string;
  events: Array<{
    id: string;
    name: string;
    type: string;
    severity: number;
    timestamp: number;
    duration: number;
    affectedSegments: string[];
    description: string;
  }>;
  totalDuration: number;
  generatedAt: string;
}

interface Stressor {
  id: string;
  name: string;
  type: string;
  intensity: number;
  duration: number;
  description: string;
  affectedDomains: string[];
}

interface StressorSchedule {
  id: string;
  stressors: Array<Stressor & { startTime: number }>;
  totalDuration: number;
  combinedIntensity: number;
}

interface AuditEntry {
  timestamp: string;
  phase: string;
  event: string;
  data: Record<string, any>;
  hash: string;
}

interface AuditPacket {
  id: string;
  entries: AuditEntry[];
  merkleRoot: string;
  integrityHash: string;
}

interface SimulationResult {
  id: string;
  configId: string;
  startTime: string;
  endTime: string;
  summary: {
    populationSize: number;
    policiesApplied: number;
    eventsProcessed: number;
    stressorsApplied: number;
    simulatedHours: number;
    deterministicHash: string;
  };
  outcomes: {
    equityScore: number;
    trustDelta: number;
    outcomeVariance: number;
    biasIndicators: Array<{ type: string; magnitude: number; affectedSegment: string; description: string }>;
    populationImpact: {
      positivelyAffected: number;
      negativelyAffected: number;
      neutral: number;
    };
  };
  auditPacket: AuditPacket;
  replayBundle: {
    id: string;
    seed: number;
    configHash: string;
    expectedHash: string;
  };
}

// =============================================================================
// DEFAULT DATA
// =============================================================================

export const DEFAULT_POLICY_TEMPLATES: PolicyBundle[] = [
  {
    id: 'tpl-zoning-mixed-use',
    name: 'Mixed-Use Zoning Reform',
    domain: PolicyDomain.ZONING,
    version: 1,
    status: 'draft',
    rules: [
      { id: 'r1', condition: 'zone_type == residential', action: 'allow_commercial_ground_floor', priority: 1 },
      { id: 'r2', condition: 'density < max_density', action: 'allow_accessory_dwelling', priority: 2 },
      { id: 'r3', condition: 'transit_proximity < 800m', action: 'reduce_parking_minimum', priority: 3 },
    ],
    constraints: [
      { id: 'c1', type: 'environmental', threshold: 0.2, description: 'Max 20% green space reduction' },
      { id: 'c2', type: 'infrastructure', threshold: 0.85, description: 'Infrastructure capacity > 85%' },
    ],
    metadata: { author: 'SCGE Template Library' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tpl-progressive-tax',
    name: 'Progressive Tax Restructuring',
    domain: PolicyDomain.TAXATION,
    version: 1,
    status: 'draft',
    rules: [
      { id: 'r1', condition: 'income_bracket == high', action: 'apply_surcharge_3pct', priority: 1 },
      { id: 'r2', condition: 'income_bracket == low', action: 'apply_credit_2000', priority: 1 },
      { id: 'r3', condition: 'business_revenue > 10M', action: 'apply_corporate_levy', priority: 2 },
    ],
    constraints: [
      { id: 'c1', type: 'revenue', threshold: 0, description: 'Net revenue must be non-negative' },
      { id: 'c2', type: 'equity', threshold: 0.7, description: 'Gini coefficient improvement target' },
    ],
    metadata: { author: 'SCGE Template Library' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tpl-transit-expansion',
    name: 'Public Transit Network Expansion',
    domain: PolicyDomain.TRANSPORTATION,
    version: 1,
    status: 'draft',
    rules: [
      { id: 'r1', condition: 'population_density > 5000', action: 'add_bus_rapid_transit', priority: 1 },
      { id: 'r2', condition: 'commute_distance > 15km', action: 'add_rail_connection', priority: 2 },
      { id: 'r3', condition: 'accessibility_score < 0.5', action: 'add_paratransit_service', priority: 1 },
    ],
    constraints: [
      { id: 'c1', type: 'budget', threshold: 500000000, description: 'Capital budget cap $500M' },
      { id: 'c2', type: 'timeline', threshold: 60, description: 'Implementation within 60 months' },
    ],
    metadata: { author: 'SCGE Template Library' },
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_EVENT_SCENARIOS: EventScenario[] = [
  {
    id: 'scenario-economic-downturn',
    name: 'Economic Downturn',
    description: 'Simulates a regional economic contraction with cascading effects',
    eventTemplates: [
      { id: 'e1', name: 'Major employer layoffs', type: 'economic', severity: 'high', timing: 'month-1', affectsSegments: ['employment', 'income'] },
      { id: 'e2', name: 'Small business closures', type: 'economic', severity: 'medium', timing: 'month-2', affectsSegments: ['employment', 'income', 'tax-revenue'] },
      { id: 'e3', name: 'Housing market contraction', type: 'economic', severity: 'medium', timing: 'month-3', affectsSegments: ['housing', 'wealth'] },
      { id: 'e4', name: 'Social service demand surge', type: 'social', severity: 'high', timing: 'month-4', affectsSegments: ['services', 'budget'] },
    ],
  },
  {
    id: 'scenario-climate-event',
    name: 'Extreme Climate Event',
    description: 'Simulates a major climate event (flood, heat wave, wildfire) and its civic impact',
    eventTemplates: [
      { id: 'e1', name: 'Infrastructure damage', type: 'infrastructure', severity: 'critical', timing: 'day-1', affectsSegments: ['infrastructure', 'services'] },
      { id: 'e2', name: 'Population displacement', type: 'social', severity: 'high', timing: 'day-2', affectsSegments: ['housing', 'services', 'health'] },
      { id: 'e3', name: 'Emergency response strain', type: 'institutional', severity: 'high', timing: 'day-1', affectsSegments: ['services', 'budget'] },
      { id: 'e4', name: 'Insurance system stress', type: 'economic', severity: 'medium', timing: 'month-1', affectsSegments: ['insurance', 'housing'] },
      { id: 'e5', name: 'Long-term health effects', type: 'health', severity: 'medium', timing: 'month-6', affectsSegments: ['health', 'services'] },
    ],
  },
  {
    id: 'scenario-tech-disruption',
    name: 'Technology Disruption',
    description: 'Simulates major technology shift disrupting existing governance and employment',
    eventTemplates: [
      { id: 'e1', name: 'AI automation wave', type: 'technology', severity: 'high', timing: 'month-1', affectsSegments: ['employment', 'skills'] },
      { id: 'e2', name: 'Digital divide widening', type: 'social', severity: 'medium', timing: 'month-3', affectsSegments: ['access', 'equity'] },
      { id: 'e3', name: 'Legacy system failures', type: 'infrastructure', severity: 'medium', timing: 'month-2', affectsSegments: ['services', 'infrastructure'] },
    ],
  },
];

export const DEFAULT_GOVERNANCE_PRESETS = [
  {
    id: 'preset-democratic-standard',
    name: 'Standard Democratic Governance',
    description: 'Representative democracy with checks and balances',
    decisionThreshold: 0.5,
    quorumRequirement: 0.6,
    vetoEnabled: true,
    publicComment: true,
    transparencyLevel: 'high',
    appealProcess: true,
  },
  {
    id: 'preset-technocratic',
    name: 'Technocratic Governance',
    description: 'Expert-driven decision-making with evidence requirements',
    decisionThreshold: 0.67,
    quorumRequirement: 0.8,
    vetoEnabled: false,
    publicComment: false,
    transparencyLevel: 'medium',
    appealProcess: true,
  },
  {
    id: 'preset-participatory',
    name: 'Participatory Governance',
    description: 'Direct citizen participation in policy decisions',
    decisionThreshold: 0.5,
    quorumRequirement: 0.4,
    vetoEnabled: false,
    publicComment: true,
    transparencyLevel: 'maximum',
    appealProcess: true,
  },
];

export const DEFAULT_STRESSOR_LIBRARY: Stressor[] = [
  { id: 'str-budget-cut', name: 'Budget Cut 20%', type: 'fiscal', intensity: 0.7, duration: 12, description: 'Across-the-board 20% budget reduction', affectedDomains: ['all'] },
  { id: 'str-pandemic', name: 'Pandemic Response', type: 'health', intensity: 0.9, duration: 18, description: 'Public health emergency requiring lockdowns and surge capacity', affectedDomains: ['healthcare', 'education', 'economy'] },
  { id: 'str-cyber-attack', name: 'Critical Infrastructure Cyber Attack', type: 'security', intensity: 0.8, duration: 3, description: 'Major cyber attack on municipal systems', affectedDomains: ['infrastructure', 'services', 'security'] },
  { id: 'str-migration-surge', name: 'Population Migration Surge', type: 'demographic', intensity: 0.6, duration: 24, description: '15% population increase from migration', affectedDomains: ['housing', 'services', 'infrastructure'] },
  { id: 'str-political-crisis', name: 'Political Crisis', type: 'governance', intensity: 0.7, duration: 6, description: 'Leadership vacuum and institutional conflict', affectedDomains: ['governance', 'trust', 'services'] },
  { id: 'str-supply-chain', name: 'Supply Chain Disruption', type: 'economic', intensity: 0.65, duration: 9, description: 'Major supply chain breakdown affecting essential goods', affectedDomains: ['economy', 'healthcare', 'infrastructure'] },
  { id: 'str-flood', name: 'Catastrophic Flooding', type: 'environmental', intensity: 0.85, duration: 4, description: '100-year flood event affecting urban areas', affectedDomains: ['infrastructure', 'housing', 'services'] },
  { id: 'str-heat-wave', name: 'Extended Heat Wave', type: 'environmental', intensity: 0.6, duration: 2, description: '3-week heat wave exceeding infrastructure capacity', affectedDomains: ['healthcare', 'infrastructure', 'energy'] },
];

// =============================================================================
// SERVICE IMPLEMENTATIONS
// =============================================================================

class SyntheticPopulationService {
  private populations = new Map<string, Population>();

  generatePopulation(params: PopulationParameters): Population {
    const seed = params.seed || Date.now();
    const s = `pop-${seed}`;
    const id = generateSCGEId('pop');

    const population: Population = {
      id,
      name: `Synthetic Population (n=${params.size.toLocaleString()})`,
      totalSize: params.size,
      distributions: {
        income: {
          low: deterministicPercentage(30, 10, s, 'income-low', params.resourceScarcityLevel),
          middle: deterministicPercentage(50, 10, s, 'income-mid', params.resourceScarcityLevel),
          high: deterministicPercentage(20, 8, s, 'income-high', params.resourceScarcityLevel),
        },
        education: {
          none: deterministicPercentage(5, 3, s, 'edu-none', params.informationAsymmetryLevel),
          primary: deterministicPercentage(20, 8, s, 'edu-primary', params.informationAsymmetryLevel),
          secondary: deterministicPercentage(45, 10, s, 'edu-secondary', params.informationAsymmetryLevel),
          tertiary: deterministicPercentage(30, 10, s, 'edu-tertiary', params.informationAsymmetryLevel),
        },
        age: {
          youth: deterministicPercentage(25, 5, s, 'age-youth'),
          working: deterministicPercentage(55, 8, s, 'age-working'),
          senior: deterministicPercentage(20, 5, s, 'age-senior'),
        },
        urbanRural: {
          urban: deterministicPercentage(45, 15, s, 'geo-urban', params.mobilityConstraintLevel),
          suburban: deterministicPercentage(35, 10, s, 'geo-suburban', params.mobilityConstraintLevel),
          rural: deterministicPercentage(20, 10, s, 'geo-rural', params.mobilityConstraintLevel),
        },
        employment: (() => {
          const emp = deterministicPercentage(60, 12, s, 'emp-employed', params.resourceScarcityLevel);
          const unemp = deterministicPercentage(8, 4, s, 'emp-unemployed', params.resourceScarcityLevel);
          const inf = deterministicPercentage(15, 8, s, 'emp-informal', params.resourceScarcityLevel);
          const total = emp + unemp + inf;
          return {
            employed: Math.round(emp / total * 100 * 10) / 10,
            unemployed: Math.round(unemp / total * 100 * 10) / 10,
            informal: Math.round(inf / total * 100 * 10) / 10,
          };
        })(),
      },
      generationSeed: seed,
      hash: crypto.createHash('sha256').update(JSON.stringify({ params, seed })).digest('hex'),
      metadata: {
        accessVariance: params.accessVarianceLevel,
        informationAsymmetry: params.informationAsymmetryLevel,
        mobilityConstraint: params.mobilityConstraintLevel,
        resourceScarcity: params.resourceScarcityLevel,
        complianceVariance: params.complianceVarianceLevel,
        generatedAt: new Date().toISOString(),
      },
    };

    this.populations.set(id, population);
    return population;
  }

  getPopulation(id: string): Population | undefined {
    return this.populations.get(id);
  }

  listPopulations(): Population[] {
    return [...this.populations.values()];
  }
}

class PolicyInjectionService {
  private policies = new Map<string, PolicyBundle>();

  constructor() {
    // Load templates as available policies
    for (const tpl of DEFAULT_POLICY_TEMPLATES) {
      this.policies.set(tpl.id, { ...tpl });
    }
  }

  createPolicyBundle(name: string, domain: string, rules: any[], constraints: any[], metadata: any): PolicyBundle {
    const id = generateSCGEId('pol');
    const policy: PolicyBundle = {
      id,
      name,
      domain,
      version: 1,
      status: 'draft',
      rules: rules.map((r, i) => ({ id: `r${i + 1}`, condition: r.condition || '', action: r.action || '', priority: r.priority || i + 1 })),
      constraints: constraints.map((c, i) => ({ id: `c${i + 1}`, type: c.type || 'general', threshold: c.threshold || 0, description: c.description || '' })),
      metadata: { ...metadata, createdBy: 'SCGE' },
      createdAt: new Date().toISOString(),
    };
    this.policies.set(id, policy);
    return policy;
  }

  getPolicy(id: string): PolicyBundle | undefined {
    return this.policies.get(id);
  }

  listPolicies(): PolicyBundle[] {
    return [...this.policies.values()];
  }

  activatePolicy(id: string): PolicyBundle {
    const policy = this.policies.get(id);
    if (!policy) throw new Error(`Policy ${id} not found`);
    policy.status = 'active';
    return policy;
  }

  evaluateDecision(policyId: string, context: Record<string, any>): {
    policyId: string;
    result: string;
    rulesEvaluated: number;
    rulesPassed: number;
    constraintsMet: number;
    constraintsViolated: number;
    details: Array<{ ruleId: string; condition: string; result: string }>;
  } {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy ${policyId} not found`);

    const seed = `eval-${policyId}-${JSON.stringify(context)}`;
    const ruleResults = policy.rules.map((rule, i) => ({
      ruleId: rule.id,
      condition: rule.condition,
      result: deterministicBool(0.7, seed, `rule-${i}`) ? 'PASS' : 'FAIL',
    }));

    const passed = ruleResults.filter(r => r.result === 'PASS').length;
    const constraintsMet = policy.constraints.filter((_, i) => deterministicBool(0.8, seed, `con-${i}`)).length;

    return {
      policyId,
      result: passed >= Math.ceil(policy.rules.length / 2) ? 'COMPLIANT' : 'NON_COMPLIANT',
      rulesEvaluated: policy.rules.length,
      rulesPassed: passed,
      constraintsMet,
      constraintsViolated: policy.constraints.length - constraintsMet,
      details: ruleResults,
    };
  }
}

class EventInjectionService {
  private sequences = new Map<string, EventSequence>();

  generateScenarioSequence(scenario: EventScenario, seed: number): EventSequence {
    const s = `event-${seed}-${scenario.id}`;
    const id = generateSCGEId('seq');

    const events = scenario.eventTemplates.map((template, i) => {
      const eSeed = `${s}-${i}`;
      const timingMatch = template.timing.match(/(\d+)/);
      const baseTime = timingMatch ? parseInt(timingMatch[1]!) : 1;
      const isMonths = template.timing.includes('month');
      const baseHours = isMonths ? baseTime * 720 : baseTime * 24;

      return {
        id: generateSCGEId('evt'),
        name: template.name,
        type: template.type,
        severity: deterministicFloat(eSeed, 'severity') * 0.3 +
          (template.severity === 'critical' ? 0.7 : template.severity === 'high' ? 0.5 : template.severity === 'medium' ? 0.3 : 0.1),
        timestamp: baseHours + deterministicInt(-12, 12, eSeed, 'jitter'),
        duration: deterministicInt(24, 720, eSeed, 'duration'),
        affectedSegments: template.affectsSegments,
        description: `${template.name} — ${template.type} event affecting ${template.affectsSegments.join(', ')}`,
      };
    });

    const sequence: EventSequence = {
      id,
      name: `${scenario.name} Sequence`,
      scenarioId: scenario.id,
      events: events.sort((a, b) => a.timestamp - b.timestamp),
      totalDuration: Math.max(...events.map(e => e.timestamp + e.duration)),
      generatedAt: new Date().toISOString(),
    };

    this.sequences.set(id, sequence);
    return sequence;
  }

  createInjectionConfig(sequence: EventSequence): { sequenceId: string; events: typeof sequence.events; timing: string } {
    return {
      sequenceId: sequence.id,
      events: sequence.events,
      timing: 'sequential',
    };
  }

  listSequences(): EventSequence[] {
    return [...this.sequences.values()];
  }
}

class StressorLibraryService {
  private customStressors = new Map<string, Stressor>();

  constructor() {
    for (const str of DEFAULT_STRESSOR_LIBRARY) {
      this.customStressors.set(str.id, str);
    }
  }

  listStressors(): Stressor[] {
    return [...this.customStressors.values()];
  }

  getStressor(id: string): Stressor | undefined {
    return this.customStressors.get(id);
  }

  generateRandomSchedule(count: number, maxDuration: number, seed: number): StressorSchedule {
    const s = `stressor-${seed}`;
    const available = [...this.customStressors.values()];
    const selected: Array<Stressor & { startTime: number }> = [];

    for (let i = 0; i < Math.min(count, available.length); i++) {
      const idx = deterministicInt(0, available.length - 1, s, `pick-${i}`);
      const stressor = available[idx]!;
      available.splice(idx, 1);
      selected.push({
        ...stressor,
        startTime: deterministicInt(0, Math.max(0, maxDuration - stressor.duration), s, `start-${i}`),
      });
    }

    const combinedIntensity = selected.reduce((sum, st) => sum + st.intensity, 0) / (selected.length || 1);

    return {
      id: generateSCGEId('sched'),
      stressors: selected.sort((a, b) => a.startTime - b.startTime),
      totalDuration: maxDuration,
      combinedIntensity: Math.round(combinedIntensity * 1000) / 1000,
    };
  }

  calculateCombinedImpact(stressors: Stressor[]): {
    combinedIntensity: number;
    affectedDomains: string[];
    interactionEffects: string[];
    overallRisk: string;
  } {
    const combinedIntensity = stressors.reduce((sum, s) => sum + s.intensity, 0) / (stressors.length || 1);
    const allDomains = [...new Set(stressors.flatMap(s => s.affectedDomains))];

    const interactions: string[] = [];
    for (let i = 0; i < stressors.length; i++) {
      for (let j = i + 1; j < stressors.length; j++) {
        const overlap = stressors[i]!.affectedDomains.filter(d => stressors[j]!.affectedDomains.includes(d));
        if (overlap.length > 0) {
          interactions.push(`${stressors[i]!.name} × ${stressors[j]!.name} → amplified impact on ${overlap.join(', ')}`);
        }
      }
    }

    return {
      combinedIntensity: Math.round(combinedIntensity * 1000) / 1000,
      affectedDomains: allDomains,
      interactionEffects: interactions,
      overallRisk: combinedIntensity > 0.8 ? 'critical' : combinedIntensity > 0.6 ? 'high' : combinedIntensity > 0.4 ? 'moderate' : 'low',
    };
  }
}

// =============================================================================
// SCGE ORCHESTRATOR
// =============================================================================

class SCGEOrchestrator {
  private activeSimulations = new Map<string, { id: string; phase: string; currentTime: number }>();
  private completedSimulations = new Map<string, SimulationResult>();
  private statistics = {
    totalSimulations: 0,
    totalPopulationsGenerated: 0,
    totalPoliciesEvaluated: 0,
    averageEquityScore: 0,
  };

  constructor() {
    logger.info('🌐 SCGE: Synthetic Civic Governance Environment initialized');
  }

  async runSimulation(config: SimulationConfig): Promise<SimulationResult> {
    const resultId = generateSCGEId('sim');
    const startTime = new Date().toISOString();
    const s = `sim-${config.seed}-${config.id}`;

    logger.info(`SCGE: Starting simulation ${resultId} — population: ${config.population.size.toLocaleString()}, duration: ${config.maxDuration}h`);

    // Track as active
    this.activeSimulations.set(resultId, { id: resultId, phase: 'running', currentTime: 0 });

    // Simulate population outcomes
    const popSize = config.population.size;
    const equityScore = deterministicPercentage(65, 20, s, 'equity', config.population.accessVarianceLevel);
    const trustDelta = (deterministicFloat(s, 'trust') - 0.5) * 0.4; // -0.2 to +0.2
    const outcomeVariance = deterministicFloat(s, 'variance') * 0.5;

    // Generate bias indicators
    const biasIndicators = [
      {
        type: 'geographic',
        magnitude: deterministicFloat(s, 'bias-geo') * 0.5,
        affectedSegment: 'rural',
        description: 'Rural communities experience delayed service delivery',
      },
      {
        type: 'income',
        magnitude: deterministicFloat(s, 'bias-income') * 0.4,
        affectedSegment: 'low-income',
        description: 'Low-income populations bear disproportionate compliance costs',
      },
      {
        type: 'access',
        magnitude: deterministicFloat(s, 'bias-access') * 0.3,
        affectedSegment: 'elderly',
        description: 'Digital-first services create barriers for elderly population',
      },
    ].filter(b => b.magnitude > 0.15);

    // Build audit packet
    const auditEntries: AuditEntry[] = [
      { timestamp: startTime, phase: 'initialization', event: 'simulation_started', data: { configId: config.id, seed: config.seed }, hash: '' },
      { timestamp: new Date().toISOString(), phase: 'population', event: 'population_generated', data: { size: popSize }, hash: '' },
      { timestamp: new Date().toISOString(), phase: 'policy', event: 'policies_applied', data: { count: config.policies.length }, hash: '' },
      { timestamp: new Date().toISOString(), phase: 'simulation', event: 'events_processed', data: { duration: config.maxDuration }, hash: '' },
      { timestamp: new Date().toISOString(), phase: 'analysis', event: 'outcomes_computed', data: { equityScore, trustDelta }, hash: '' },
    ];

    // Hash each entry
    for (const entry of auditEntries) {
      entry.hash = crypto.createHash('sha256').update(JSON.stringify({ ...entry, hash: '' })).digest('hex');
    }

    const merkleLeaves = auditEntries.map(e => e.hash);
    const merkleRoot = this.computeMerkleRoot(merkleLeaves);

    const auditPacket: AuditPacket = {
      id: generateSCGEId('audit'),
      entries: auditEntries,
      merkleRoot,
      integrityHash: crypto.createHash('sha256').update(JSON.stringify({ entries: auditEntries, merkleRoot })).digest('hex'),
    };

    const endTime = new Date().toISOString();
    const deterministicHash = crypto.createHash('sha256').update(JSON.stringify({ config, equityScore, trustDelta, outcomeVariance })).digest('hex');

    const result: SimulationResult = {
      id: resultId,
      configId: config.id,
      startTime,
      endTime,
      summary: {
        populationSize: popSize,
        policiesApplied: config.policies.length,
        eventsProcessed: config.events?.events?.length || 0,
        stressorsApplied: config.stressors?.stressors?.length || 0,
        simulatedHours: config.maxDuration,
        deterministicHash,
      },
      outcomes: {
        equityScore: Math.round(equityScore * 100) / 100,
        trustDelta: Math.round(trustDelta * 1000) / 1000,
        outcomeVariance: Math.round(outcomeVariance * 1000) / 1000,
        biasIndicators,
        populationImpact: (() => {
          const rawPos = deterministicFloat(s, 'pos') * 0.5;
          const rawNeg = deterministicFloat(s, 'neg') * 0.3;
          const rawNeu = deterministicFloat(s, 'neu') * 0.2;
          const total = rawPos + rawNeg + rawNeu;
          return {
            positivelyAffected: Math.round(popSize * rawPos / total),
            negativelyAffected: Math.round(popSize * rawNeg / total),
            neutral: popSize - Math.round(popSize * rawPos / total) - Math.round(popSize * rawNeg / total),
          };
        })(),
      },
      auditPacket,
      replayBundle: {
        id: generateSCGEId('replay'),
        seed: config.seed,
        configHash: crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex'),
        expectedHash: deterministicHash,
      },
    };

    // Move from active to completed
    this.activeSimulations.delete(resultId);
    this.completedSimulations.set(resultId, result);
    this.statistics.totalSimulations++;
    this.statistics.averageEquityScore = Math.round(
      ((this.statistics.averageEquityScore * (this.statistics.totalSimulations - 1)) + equityScore) /
      this.statistics.totalSimulations * 100
    ) / 100;

    logger.info(`SCGE: Simulation ${resultId} complete — equity: ${equityScore.toFixed(1)}%, trust Δ: ${trustDelta.toFixed(3)}, bias indicators: ${biasIndicators.length}`);

    return result;
  }

  getCompletedSimulation(id: string): SimulationResult | undefined {
    return this.completedSimulations.get(id);
  }

  listActiveSimulations() {
    return [...this.activeSimulations.values()];
  }

  listCompletedSimulations(): SimulationResult[] {
    return [...this.completedSimulations.values()];
  }

  getStatistics() {
    return { ...this.statistics };
  }

  private computeMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) return crypto.createHash('sha256').update('empty').digest('hex');
    if (leaves.length === 1) return leaves[0]!;
    const level: string[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i]!;
      const right = leaves[i + 1] || left;
      level.push(crypto.createHash('sha256').update(left + right).digest('hex'));
    }
    return this.computeMerkleRoot(level);
  }
}

// =============================================================================
// UTILITIES
// =============================================================================

export function generateSCGEId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// =============================================================================
// SINGLETON EXPORTS
// =============================================================================

export const syntheticPopulationService = new SyntheticPopulationService();
export const policyInjectionService = new PolicyInjectionService();
export const eventInjectionService = new EventInjectionService();
export const stressorLibraryService = new StressorLibraryService();
export const scgeOrchestrator = new SCGEOrchestrator();
