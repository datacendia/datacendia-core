// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AI MODEL CONFIGURATION
// Intelligent model routing based on task complexity and type
// "Right Brain for the Right Job"
// =============================================================================

import { logger } from '../utils/logger.js';

// =============================================================================
// MODEL REGISTRY
// =============================================================================

export const AI_MODELS = {
  // THE TITAN (Maximum Intelligence)
  // Llama 3.3 70B or Llama 4 Scout - Highest quality for critical decisions
  // Use for: Council deliberations, executive decisions, high-stakes analysis
  large: {
    id: process.env['OLLAMA_MODEL_LARGE'] || 'llama3.3:70b',
    contextWindow: 128000,
    temp: 0.7,
    description: 'Largest model for critical decisions and council deliberations',
  },

  // THE CHIEF (General Intelligence)
  // Qwen3 32B - Best balance of quality and speed
  // Use for: Complex analysis, strategic decisions, synthesis, content generation
  flagship: {
    id: process.env['OLLAMA_MODEL'] || 'qwen3:32b',
    contextWindow: 128000,
    temp: 0.7,
    description: 'Flagship model for complex synthesis and strategic analysis',
  },

  // THE PHILOSOPHER (Reasoning Engine)
  // DeepSeek-R1 32B - Purpose-built chain-of-thought reasoning
  // Use for: Risk analysis, legal review, finding logical fallacies
  reasoning: {
    id: process.env['OLLAMA_MODEL_REASONING'] || 'deepseek-r1:32b',
    contextWindow: 65536,
    temp: 0.6,
    description: 'Deep reasoning for risk, compliance, and logical analysis',
  },

  // THE ENGINEER (Coding Specialist)
  // Qwen3 Coder 30B - Purpose-built for agentic coding + tool calling
  // Use for: Data operations, workflow execution, schema work, SQL, JSON
  coder: {
    id: process.env['OLLAMA_MODEL_CODER'] || 'qwen3-coder:30b',
    contextWindow: 131072,
    temp: 0.2,
    description: 'Code generation, SQL, JSON, and technical operations',
  },

  // THE SPEEDSTER (UI & Quick Operations)
  // Llama 3.2 3B - Instant responses
  // Use for: Quick lookups, simple formatting, UI responses
  fast: {
    id: process.env['OLLAMA_MODEL_FAST'] || 'llama3.2:3b',
    contextWindow: 8192,
    temp: 0.5,
    description: 'Fast responses for simple tasks and UI interactions',
  },

  // THE EYES (Vision)
  // Qwen3-VL 30B - For seeing charts and PDFs
  // Use for: Image analysis, document OCR
  vision: {
    id: process.env['OLLAMA_MODEL_VISION'] || 'qwen3-vl:30b',
    contextWindow: 16384,
    temp: 0.5,
    description: 'Vision model for image and document analysis',
  },

  // THE TRANSLATOR (Translation Specialist)
  // Qwen 2.5 32B - Best multilingual performance
  // Use for: CendiaOmniTranslate, cross-language content
  translator: {
    id: process.env['OMNITRANSLATE_MODEL'] || 'qwen2.5:32b',
    contextWindow: 32768,
    temp: 0.3,
    description: 'Translation and multilingual content generation',
  },

  // THE EMBED (Embedding Model)
  // Qwen3 Embedding 4B - Multilingual embeddings, massive upgrade from nomic 137M
  embed: {
    id: process.env['OLLAMA_EMBED_MODEL'] || 'qwen3-embedding:4b',
    contextWindow: 32768,
    temp: 0,
    description: 'Text embeddings for search and RAG pipelines',
  },
} as const;

export type ModelType = keyof typeof AI_MODELS;

// =============================================================================
// TASK-BASED MODEL SELECTION
// =============================================================================

export type TaskType =
  // Complex Analysis Tasks → Flagship
  | 'strategic_analysis'
  | 'synthesis'
  | 'executive_summary'
  | 'market_analysis'
  | 'investor_relations'
  | 'communications'
  | 'patent_drafting'
  | 'deal_analysis'
  | 'culture_assessment'
  // Reasoning Tasks → Reasoning Model
  | 'risk_analysis'
  | 'legal_analysis'
  | 'compliance_check'
  | 'threat_detection'
  | 'audit'
  | 'litigation_analysis'
  | 'failure_prediction'
  // Technical Tasks → Coder Model
  | 'data_query'
  | 'json_generation'
  | 'workflow_automation'
  | 'code_generation'
  | 'schema_analysis'
  | 'metrics_calculation'
  // Quick Tasks → Fast Model
  | 'simple_lookup'
  | 'formatting'
  | 'categorization'
  | 'status_check'
  | 'basic_extraction'
  // Vision Tasks → Vision Model
  | 'image_analysis'
  | 'document_ocr'
  | 'chart_reading';

const TASK_MODEL_MAP: Record<TaskType, ModelType> = {
  // Complex Analysis → Flagship (qwen3:32b)
  strategic_analysis: 'flagship',
  synthesis: 'flagship',
  executive_summary: 'flagship',
  market_analysis: 'flagship',
  investor_relations: 'flagship',
  communications: 'flagship',
  patent_drafting: 'flagship',
  deal_analysis: 'flagship',
  culture_assessment: 'flagship',

  // Reasoning → DeepSeek-R1 (deepseek-r1:32b)
  risk_analysis: 'reasoning',
  legal_analysis: 'reasoning',
  compliance_check: 'reasoning',
  threat_detection: 'reasoning',
  audit: 'reasoning',
  litigation_analysis: 'reasoning',
  failure_prediction: 'reasoning',

  // Technical → Qwen3 Coder (qwen3-coder:30b)
  data_query: 'coder',
  json_generation: 'coder',
  workflow_automation: 'coder',
  code_generation: 'coder',
  schema_analysis: 'coder',
  metrics_calculation: 'coder',

  // Quick → Fast Model (llama3.2:3b)
  simple_lookup: 'fast',
  formatting: 'fast',
  categorization: 'fast',
  status_check: 'fast',
  basic_extraction: 'fast',

  // Vision → Vision Model (qwen3-vl:30b)
  image_analysis: 'vision',
  document_ocr: 'vision',
  chart_reading: 'vision',
};

// =============================================================================
// SERVICE-BASED MODEL DEFAULTS
// =============================================================================

export type ServiceDomain =
  | 'procurement'
  | 'talent'
  | 'facilities'
  | 'sales'
  | 'customer_success'
  | 'it_ops'
  | 'legal'
  | 'investor_relations'
  | 'ma_integration'
  | 'manufacturing'
  | 'travel_security'
  | 'learning'
  | 'communications'
  | 'innovation'
  | 'executive'
  | 'brand'
  | 'revenue'
  | 'support'
  | 'monitoring'
  | 'council'
  | 'decision';

const SERVICE_MODEL_MAP: Record<ServiceDomain, ModelType> = {
  // Enterprise Services → flagship (qwen3:32b)
  procurement: 'flagship',        // Negotiations need nuance
  talent: 'flagship',             // People decisions are complex
  facilities: 'fast',             // Mostly operational
  sales: 'flagship',              // Deal analysis is strategic
  customer_success: 'flagship',   // Churn prediction needs depth
  it_ops: 'reasoning',            // Threat detection → deepseek-r1
  legal: 'reasoning',             // Legal analysis → deepseek-r1
  investor_relations: 'flagship', // Market sentiment is complex
  ma_integration: 'flagship',     // Culture is nuanced
  manufacturing: 'reasoning',     // Failure prediction → deepseek-r1
  travel_security: 'reasoning',   // Risk assessment → deepseek-r1
  learning: 'flagship',           // Content generation needs quality
  communications: 'flagship',     // Messaging needs nuance
  innovation: 'flagship',         // Patent drafting needs depth
  executive: 'large',             // CEO decisions → llama3.3:70b

  // Core Services
  brand: 'flagship',              // Content creation → qwen3:32b
  revenue: 'coder',               // Financial calculations → qwen3-coder:30b
  support: 'fast',                // Quick responses → llama3.2:3b
  monitoring: 'fast',             // Status checks → llama3.2:3b

  // Decision Intelligence → largest model
  council: 'large',               // Deliberation → llama3.3:70b
  decision: 'large',              // Decision analysis → llama3.3:70b
};

// =============================================================================
// LICENSE TIER — MODEL GATING
// =============================================================================
//
// The slot architecture runs internally. Always.
// Tiers control which slots are active and what fills them.
//
// Sell simplicity. Maintain sophistication behind the curtain.
// Models are replaceable. The evidence layer is not.
//

export type LicenseTier = 'pilot' | 'enterprise' | 'sovereign';

export interface TierCapabilities {
  allowedModelTypes: ModelType[];
  maxModelSize: string;
  multiModelConsensus: boolean;
  adversarialRedTeam: boolean;
  advancedBiasMitigation: boolean;
  postQuantumSignatures: boolean;
  airGapDeployment: boolean;
  description: string;
}

export const LICENSE_TIERS: Record<LicenseTier, TierCapabilities> = {
  // ─── TIER 1: PILOT ($50K) ─────────────────────────────────────────────
  // 3 models + embed. Stable, deterministic, boring infrastructure.
  // Proves the platform produces defensible evidence in their environment.
  // No consensus, no red-teaming — single-model decision path.
  //
  // What the client sees:
  //   - 1 primary model (qwen2.5:14b) — structured outputs, evidence
  //   - 1 reasoning backup (deepseek-r1:32b) — compliance, risk checks
  //   - 1 fast model (llama3.2:3b) — UI, quick lookups
  //   - 1 embed model (qwen3-embedding:4b) — search, RAG
  //
  // What they DON'T see: the slot architecture routing behind it.
  pilot: {
    allowedModelTypes: ['fast', 'flagship', 'reasoning', 'embed'],
    maxModelSize: '14b',
    multiModelConsensus: false,
    adversarialRedTeam: false,
    advancedBiasMitigation: false,
    postQuantumSignatures: false,
    airGapDeployment: false,
    description: 'Deterministic evidence mode. Structured outputs. Proof of value.',
  },

  // ─── TIER 2: ENTERPRISE ($150K–$500K) ─────────────────────────────────
  // Full 32B lineup. Multi-model consensus mode unlocked.
  // Red-team reasoning. Advanced bias mitigation. Vision. Translation.
  // This is where the platform starts to feel intelligent.
  enterprise: {
    allowedModelTypes: ['fast', 'flagship', 'reasoning', 'coder', 'vision', 'translator', 'embed'],
    maxModelSize: '32b',
    multiModelConsensus: true,
    adversarialRedTeam: true,
    advancedBiasMitigation: true,
    postQuantumSignatures: false,
    airGapDeployment: false,
    description: 'Multi-model consensus. Red-team reasoning. Advanced bias mitigation.',
  },

  // ─── TIER 3: SOVEREIGN / DEFENSE ($500K+) ─────────────────────────────
  // Everything. 70B+ deliberation engines. Air-gapped deployment.
  // Post-quantum signature chain. Full model zoo, no restrictions.
  sovereign: {
    allowedModelTypes: ['fast', 'flagship', 'reasoning', 'coder', 'vision', 'translator', 'embed', 'large'],
    maxModelSize: '70b+',
    multiModelConsensus: true,
    adversarialRedTeam: true,
    advancedBiasMitigation: true,
    postQuantumSignatures: true,
    airGapDeployment: true,
    description: 'Full arsenal. 70B models. Post-quantum. Air-gap capable.',
  },
};

// =============================================================================
// TIER MODEL OVERRIDES
// =============================================================================
// The slot architecture stays the same. The models filling the slots change.
// Pilot's "flagship" is qwen2.5:14b, not qwen3:32b.
// Enterprise's "flagship" is qwen3:32b, not llama3.3:70b.
// Sovereign gets the real defaults from AI_MODELS (no overrides).

const TIER_MODEL_OVERRIDES: Record<LicenseTier, Partial<Record<ModelType, string>>> = {
  pilot: {
    flagship: 'qwen2.5:14b',      // Capped at 14B — stable, deterministic
    reasoning: 'deepseek-r1:32b',  // Allowed — this is the one specialist they get
    fast: 'llama3.2:3b',           // Same across all tiers
  },
  enterprise: {
    // No overrides — uses AI_MODELS defaults (32B class)
    // flagship → qwen3:32b, reasoning → deepseek-r1:32b, coder → qwen3-coder:30b, etc.
  },
  sovereign: {
    // No overrides — uses AI_MODELS defaults (full arsenal)
    // Plus 'large' slot unlocked → llama3.3:70b
  },
};

// Downgrade map: when a model type is not allowed, what to use instead
const TIER_DOWNGRADE_MAP: Record<ModelType, ModelType> = {
  large: 'flagship',
  flagship: 'fast',
  reasoning: 'flagship',
  coder: 'flagship',
  vision: 'flagship',
  translator: 'flagship',
  fast: 'fast',
  embed: 'embed',
};

// =============================================================================
// MODEL SELECTOR CLASS
// =============================================================================

class AIModelSelector {
  private currentTier: LicenseTier = (process.env['DATACENDIA_LICENSE_TIER'] as LicenseTier) || 'sovereign';

  /**
   * Set the active license tier (called on org context switch)
   */
  setTier(tier: LicenseTier): void {
    this.currentTier = tier;
    logger.info(`AIModelSelector: License tier set to "${tier}"`);
  }

  getTier(): LicenseTier {
    return this.currentTier;
  }

  getTierCapabilities(tier?: LicenseTier): TierCapabilities {
    return LICENSE_TIERS[tier || this.currentTier];
  }

  /**
   * Check if a model type is allowed for the current tier
   */
  isModelTypeAllowed(type: ModelType, tier?: LicenseTier): boolean {
    const t = tier || this.currentTier;
    return LICENSE_TIERS[t].allowedModelTypes.includes(type);
  }

  /**
   * Resolve model type respecting tier gating.
   * If the requested type is above the org's tier, downgrade gracefully.
   */
  private resolveForTier(requestedType: ModelType, tier?: LicenseTier): ModelType {
    const t = tier || this.currentTier;
    const caps = LICENSE_TIERS[t];

    if (caps.allowedModelTypes.includes(requestedType)) {
      return requestedType;
    }

    // Downgrade chain until we find an allowed type
    let downgraded = TIER_DOWNGRADE_MAP[requestedType];
    let safety = 5;
    while (!caps.allowedModelTypes.includes(downgraded) && safety-- > 0) {
      downgraded = TIER_DOWNGRADE_MAP[downgraded];
    }

    logger.info(`AIModelSelector: Tier "${t}" downgraded "${requestedType}" → "${downgraded}"`);
    return downgraded;
  }

  /**
   * Get the actual model ID for a resolved slot, applying tier overrides.
   * Pilot's "flagship" → qwen2.5:14b (not qwen3:32b).
   * Enterprise/Sovereign → AI_MODELS defaults.
   */
  private resolveModelId(resolvedType: ModelType, tier?: LicenseTier): string {
    const t = tier || this.currentTier;
    const overrides = TIER_MODEL_OVERRIDES[t];
    if (overrides && overrides[resolvedType]) {
      return overrides[resolvedType]!;
    }
    return AI_MODELS[resolvedType].id;
  }

  /**
   * Get the optimal model for a specific task type (tier-gated)
   */
  getModelForTask(task: TaskType, tier?: LicenseTier): string {
    const requestedType = TASK_MODEL_MAP[task];
    const resolvedType = this.resolveForTier(requestedType, tier);
    const modelId = this.resolveModelId(resolvedType, tier);
    logger.debug(`AIModelSelector: Task "${task}" → ${modelId} (slot: ${resolvedType}, tier: ${tier || this.currentTier})`);
    return modelId;
  }

  /**
   * Get the default model for a service domain (tier-gated)
   */
  getModelForService(service: ServiceDomain, tier?: LicenseTier): string {
    const requestedType = SERVICE_MODEL_MAP[service];
    const resolvedType = this.resolveForTier(requestedType, tier);
    const modelId = this.resolveModelId(resolvedType, tier);
    logger.debug(`AIModelSelector: Service "${service}" → ${modelId} (slot: ${resolvedType}, tier: ${tier || this.currentTier})`);
    return modelId;
  }

  /**
   * Get model by type directly (tier-gated)
   */
  getModel(type: ModelType, tier?: LicenseTier): string {
    const resolved = this.resolveForTier(type, tier);
    return this.resolveModelId(resolved, tier);
  }

  /**
   * Get model configuration
   */
  getModelConfig(type: ModelType): typeof AI_MODELS[ModelType] {
    return AI_MODELS[type];
  }

  /**
   * Get recommended temperature for a task
   */
  getTemperatureForTask(task: TaskType): number {
    const modelType = TASK_MODEL_MAP[task];
    return AI_MODELS[modelType].temp;
  }

  /**
   * Get all models visible to the current tier
   */
  getAllModels(tier?: LicenseTier): Partial<typeof AI_MODELS> {
    const t = tier || this.currentTier;
    const caps = LICENSE_TIERS[t];
    const overrides = TIER_MODEL_OVERRIDES[t];
    const visible: Partial<typeof AI_MODELS> = {};
    for (const type of caps.allowedModelTypes) {
      const base = AI_MODELS[type];
      const overriddenId = overrides?.[type];
      (visible as any)[type] = overriddenId
        ? { ...base, id: overriddenId }
        : base;
    }
    return visible;
  }

  /**
   * Check if multi-model consensus is allowed
   */
  isConsensusAllowed(tier?: LicenseTier): boolean {
    return LICENSE_TIERS[tier || this.currentTier].multiModelConsensus;
  }

  /**
   * Check if adversarial red-team mode is allowed
   */
  isRedTeamAllowed(tier?: LicenseTier): boolean {
    return LICENSE_TIERS[tier || this.currentTier].adversarialRedTeam;
  }

  /**
   * Check if a model is available via the active inference provider.
   */
  async isModelAvailable(modelId: string): Promise<boolean> {
    try {
      // Lazy import to avoid circular dependency at module load time
      const { inference } = await import('../services/inference/InferenceService.js');
      const models = await inference.listModels();
      return models.some(m => m.name === modelId || m.name.startsWith(modelId.split(':')[0]));
    } catch {
      return false;
    }
  }

  /**
   * Get fallback model if primary is unavailable
   */
  getFallbackModel(): string {
    return AI_MODELS.fast.id;
  }

  /**
   * Get tier comparison for upsell display
   */
  getTierComparison(): Record<LicenseTier, TierCapabilities> {
    return LICENSE_TIERS;
  }
}

// Export singleton
export const aiModelSelector = new AIModelSelector();
export default aiModelSelector;
