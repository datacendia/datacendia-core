/**
 * CendiaGateway™ — Intelligent Model Router
 *
 * Routes AI requests through a cost-optimized fallback chain.
 * Tries the cheapest capable model first, falls back to more expensive
 * models on failure, timeout, or quality threshold violation.
 *
 * Architecture:
 *   Request → Router → Cheapest Model → (fail?) → Next Model → ... → Expensive Model
 *
 * @module services/gateway/ModelRouter
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ModelTier {
  provider: string;
  model: string;
  costPer1kTokens: number;
  maxTokens: number;
  latencyMs: number;        // Average observed latency
  successRate: number;       // 0-1, rolling success rate
  capabilities: ModelCapability[];
  enabled: boolean;
}

export type ModelCapability =
  | 'chat'
  | 'code'
  | 'reasoning'
  | 'vision'
  | 'long_context'
  | 'function_calling'
  | 'json_mode'
  | 'embedding';

export interface RoutingRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  
  // Match conditions
  departments?: string[];          // Empty = all departments
  userPatterns?: string[];         // Glob patterns for user emails
  promptPatterns?: string[];       // Keywords that trigger this rule
  requiredCapabilities?: ModelCapability[];
  maxCostPer1kTokens?: number;     // Budget constraint
  
  // Routing chain (ordered cheapest → most expensive)
  modelChain: Array<{
    provider: string;
    model: string;
    timeoutMs: number;             // Max wait before falling back
    retries: number;               // Retries before falling back
  }>;
  
  // Fallback behavior
  fallbackAction: 'next_model' | 'block' | 'queue';
}

export interface RoutingDecision {
  ruleId: string;
  ruleName: string;
  selectedProvider: string;
  selectedModel: string;
  tierIndex: number;               // 0 = cheapest, N = most expensive
  totalTiers: number;
  reason: string;
  estimatedCostPer1kTokens: number;
  fallbacksUsed: number;
  fallbackHistory: Array<{
    provider: string;
    model: string;
    error: string;
    latencyMs: number;
  }>;
}

// =============================================================================
// DEFAULT ROUTING CHAINS
// =============================================================================

const DEFAULT_ROUTING_RULES: RoutingRule[] = [
  {
    id: 'default-chat',
    name: 'Default Chat — Cost Optimized',
    enabled: true,
    priority: 100,
    requiredCapabilities: ['chat'],
    modelChain: [
      { provider: 'groq', model: 'llama-3.1-8b-instant', timeoutMs: 5000, retries: 1 },
      { provider: 'groq', model: 'llama-3.3-70b-versatile', timeoutMs: 10000, retries: 1 },
      { provider: 'openai', model: 'gpt-4o-mini', timeoutMs: 15000, retries: 1 },
      { provider: 'openai', model: 'gpt-4o', timeoutMs: 30000, retries: 2 },
    ],
    fallbackAction: 'next_model',
  },
  {
    id: 'default-code',
    name: 'Code Generation — Quality Priority',
    enabled: true,
    priority: 50,
    requiredCapabilities: ['code'],
    promptPatterns: ['code', 'function', 'implement', 'debug', 'refactor', 'typescript', 'python', 'javascript'],
    modelChain: [
      { provider: 'mistral', model: 'codestral-latest', timeoutMs: 15000, retries: 1 },
      { provider: 'openai', model: 'gpt-4o', timeoutMs: 30000, retries: 2 },
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', timeoutMs: 30000, retries: 2 },
    ],
    fallbackAction: 'next_model',
  },
  {
    id: 'default-reasoning',
    name: 'Complex Reasoning — Premium Models',
    enabled: true,
    priority: 40,
    requiredCapabilities: ['reasoning'],
    promptPatterns: ['analyze', 'reason', 'evaluate', 'compare', 'strategy', 'legal', 'compliance', 'risk'],
    modelChain: [
      { provider: 'openai', model: 'o3-mini', timeoutMs: 60000, retries: 1 },
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', timeoutMs: 30000, retries: 2 },
      { provider: 'openai', model: 'gpt-4o', timeoutMs: 30000, retries: 2 },
    ],
    fallbackAction: 'next_model',
  },
  {
    id: 'sovereign-local',
    name: 'Sovereign — Local Models Only (Air-Gap Safe)',
    enabled: false,
    priority: 10,
    modelChain: [
      { provider: 'ollama', model: 'llama3.1', timeoutMs: 60000, retries: 2 },
      { provider: 'ollama', model: 'mistral', timeoutMs: 60000, retries: 2 },
    ],
    fallbackAction: 'block',
  },
];

// =============================================================================
// MODEL ROUTER
// =============================================================================

/** Rolling window for tracking model performance */
interface ModelPerformance {
  totalRequests: number;
  failures: number;
  totalLatencyMs: number;
  lastFailure?: Date;
  consecutiveFailures: number;
}

class ModelRouter {
  private rules: RoutingRule[] = [];
  private performance: Map<string, ModelPerformance> = new Map();

  constructor() {
    this.rules = [...DEFAULT_ROUTING_RULES];
  }

  /**
   * Select the best model for a request based on routing rules.
   * Returns the routing decision with the selected model and chain position.
   */
  selectModel(params: {
    requestedModel?: string;
    userDepartment: string;
    userEmail: string;
    promptText: string;
    requiredCapabilities?: ModelCapability[];
  }): RoutingDecision | null {
    // If a specific model was requested and no routing override, honor it
    if (params.requestedModel && !this.shouldOverride(params.requestedModel)) {
      return null; // Let the caller use the requested model directly
    }

    // Find matching rules sorted by priority (lower = higher priority)
    const matchingRules = this.rules
      .filter(r => r.enabled)
      .filter(r => this.matchesRule(r, params))
      .sort((a, b) => a.priority - b.priority);

    if (matchingRules.length === 0) return null;

    const rule = matchingRules[0]!;
    const chain = rule.modelChain;

    // Find the first healthy model in the chain
    for (let i = 0; i < chain.length; i++) {
      const tier = chain[i]!;
      const key = `${tier.provider}:${tier.model}`;
      const perf = this.performance.get(key);

      // Skip models with too many consecutive failures (circuit breaker)
      if (perf && perf.consecutiveFailures >= 5) {
        // Reset circuit breaker after 5 minutes
        if (perf.lastFailure && Date.now() - perf.lastFailure.getTime() > 5 * 60 * 1000) {
          perf.consecutiveFailures = 0;
        } else {
          continue;
        }
      }

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        selectedProvider: tier.provider,
        selectedModel: tier.model,
        tierIndex: i,
        totalTiers: chain.length,
        reason: i === 0
          ? `Primary model selected by rule "${rule.name}"`
          : `Fallback #${i} — earlier models unavailable`,
        estimatedCostPer1kTokens: this.getModelCost(tier.provider, tier.model),
        fallbacksUsed: i,
        fallbackHistory: [],
      };
    }

    return null; // All models in chain are circuit-broken
  }

  /**
   * Record the outcome of a model request for adaptive routing.
   */
  recordOutcome(provider: string, model: string, success: boolean, latencyMs: number): void {
    const key = `${provider}:${model}`;
    const perf = this.performance.get(key) || {
      totalRequests: 0,
      failures: 0,
      totalLatencyMs: 0,
      consecutiveFailures: 0,
    };

    perf.totalRequests++;
    perf.totalLatencyMs += latencyMs;

    if (success) {
      perf.consecutiveFailures = 0;
    } else {
      perf.failures++;
      perf.consecutiveFailures++;
      perf.lastFailure = new Date();
    }

    this.performance.set(key, perf);
  }

  /**
   * Get the next fallback model in the chain after a failure.
   */
  getNextFallback(decision: RoutingDecision): RoutingDecision | null {
    const rule = this.rules.find(r => r.id === decision.ruleId);
    if (!rule) return null;

    const nextIndex = decision.tierIndex + 1;
    if (nextIndex >= rule.modelChain.length) {
      if (rule.fallbackAction === 'block') return null;
      return null; // No more fallbacks
    }

    const next = rule.modelChain[nextIndex]!;
    return {
      ...decision,
      selectedProvider: next.provider,
      selectedModel: next.model,
      tierIndex: nextIndex,
      fallbacksUsed: decision.fallbacksUsed + 1,
      reason: `Fallback #${nextIndex} after ${decision.selectedModel} failed`,
      estimatedCostPer1kTokens: this.getModelCost(next.provider, next.model),
    };
  }

  // =========================================================================
  // RULE MANAGEMENT
  // =========================================================================

  getRules(): RoutingRule[] { return this.rules; }

  addRule(rule: RoutingRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  updateRule(id: string, updates: Partial<RoutingRule>): RoutingRule | null {
    const idx = this.rules.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.rules[idx] = { ...this.rules[idx]!, ...updates };
    return this.rules[idx]!;
  }

  removeRule(id: string): boolean {
    const idx = this.rules.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.rules.splice(idx, 1);
    return true;
  }

  getPerformanceStats(): Record<string, ModelPerformance & { successRate: number; avgLatencyMs: number }> {
    const stats: Record<string, any> = {};
    for (const [key, perf] of this.performance.entries()) {
      stats[key] = {
        ...perf,
        successRate: perf.totalRequests > 0 ? 1 - (perf.failures / perf.totalRequests) : 1,
        avgLatencyMs: perf.totalRequests > 0 ? Math.round(perf.totalLatencyMs / perf.totalRequests) : 0,
      };
    }
    return stats;
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private matchesRule(rule: RoutingRule, params: {
    userDepartment: string;
    userEmail: string;
    promptText: string;
    requiredCapabilities?: ModelCapability[];
  }): boolean {
    // Department filter
    if (rule.departments && rule.departments.length > 0) {
      if (!rule.departments.includes(params.userDepartment)) return false;
    }

    // Prompt pattern matching (any match)
    if (rule.promptPatterns && rule.promptPatterns.length > 0) {
      const lower = params.promptText.toLowerCase();
      if (!rule.promptPatterns.some(p => lower.includes(p.toLowerCase()))) return false;
    }

    // Capability requirements
    if (rule.requiredCapabilities && params.requiredCapabilities) {
      if (!rule.requiredCapabilities.some(c => params.requiredCapabilities!.includes(c))) return false;
    }

    return true;
  }

  private shouldOverride(_model: string): boolean {
    // Could implement logic to override specific model requests
    // For now, respect explicit model selection
    return false;
  }

  private getModelCost(provider: string, model: string): number {
    // Simplified cost lookup — full pricing is in CendiaGatewayService
    const costs: Record<string, number> = {
      'llama-3.1-8b-instant': 0.00013,
      'llama-3.3-70b-versatile': 0.00138,
      'gpt-4o-mini': 0.00075,
      'gpt-4o': 0.0125,
      'o3-mini': 0.0055,
      'codestral-latest': 0.004,
      'claude-3-5-sonnet-20241022': 0.018,
      'mistral': 0,
      'llama3.1': 0,
    };
    return costs[model] || 0.01;
  }
}

export default ModelRouter;
