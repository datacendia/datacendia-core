// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Smart Query Router
 * Classifies queries and routes to optimal models
 * 
 * Math → QwQ-32B (reasoning specialist)
 * Strategy → Mixtral-8x22B (synthesis)
 * Code → Qwen2.5-Coder (programming)
 * Analysis → Llama3.3-70B (deep reasoning)
 * Fast → Llama3.2-3B (speed)
 */

import crypto from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

export type QueryCategory = 
  | 'math'
  | 'strategy'
  | 'code'
  | 'analysis'
  | 'creative'
  | 'factual'
  | 'conversation'
  | 'compliance'
  | 'financial';

export interface ClassificationResult {
  category: QueryCategory;
  confidence: number;
  routedModel: string;
  reasoning: string;
  alternativeModels: string[];
}

export interface RoutingConfig {
  model: string;
  temperature: number;
  useCoT: boolean;
  priority: number;
}

// ============================================================================
// CLASSIFICATION PATTERNS
// ============================================================================

const CATEGORY_PATTERNS: Record<QueryCategory, { patterns: RegExp[]; keywords: string[] }> = {
  math: {
    patterns: [
      /calculate|compute|solve|equation|formula|derivative|integral|algebra/i,
      /\d+\s*[\+\-\*\/\^]\s*\d+/,
      /what is \d+|how much is|sum of|product of|divide|multiply/i,
      /probability|statistics|mean|median|standard deviation|variance/i,
      /geometric|arithmetic|logarithm|exponential|factorial/i,
    ],
    keywords: ['calculate', 'compute', 'solve', 'math', 'equation', 'formula', 'derivative', 'integral', 'probability', 'statistics', 'algebra', 'geometry', 'calculus'],
  },
  strategy: {
    patterns: [
      /strategy|strategic|plan|planning|roadmap|vision|mission/i,
      /market analysis|competitive|swot|pestel|porter/i,
      /business model|go-to-market|gtm|positioning/i,
      /should we|what approach|how should|recommend|advise/i,
      /tradeoff|trade-off|pros and cons|advantages|disadvantages/i,
    ],
    keywords: ['strategy', 'strategic', 'plan', 'roadmap', 'vision', 'market', 'competitive', 'business', 'approach', 'recommend', 'advise', 'tradeoff'],
  },
  code: {
    patterns: [
      /write code|generate code|implement|function|class|method/i,
      /python|javascript|typescript|java|c\+\+|rust|go|sql/i,
      /bug|debug|error|exception|fix|refactor/i,
      /api|endpoint|database|query|schema|migration/i,
      /```|def |function |class |const |let |var |import |export /i,
    ],
    keywords: ['code', 'program', 'function', 'class', 'implement', 'debug', 'api', 'database', 'sql', 'python', 'javascript', 'typescript'],
  },
  analysis: {
    patterns: [
      /analyze|analysis|evaluate|assess|examine|investigate/i,
      /what are the implications|impact|effect|consequence/i,
      /compare|contrast|difference|similarity|versus|vs/i,
      /explain why|reason for|cause of|root cause/i,
      /trend|pattern|insight|finding|observation/i,
    ],
    keywords: ['analyze', 'analysis', 'evaluate', 'assess', 'examine', 'compare', 'contrast', 'explain', 'trend', 'pattern', 'insight'],
  },
  creative: {
    patterns: [
      /write a story|poem|creative|imagine|brainstorm/i,
      /generate ideas|come up with|think of|suggest/i,
      /marketing copy|slogan|tagline|headline/i,
      /design|mockup|concept|prototype/i,
    ],
    keywords: ['creative', 'story', 'poem', 'imagine', 'brainstorm', 'ideas', 'design', 'concept', 'marketing'],
  },
  factual: {
    patterns: [
      /what is|who is|when did|where is|how does/i,
      /define|definition|meaning of|explain what/i,
      /history of|origin of|background/i,
      /fact|true|false|correct|accurate/i,
    ],
    keywords: ['what', 'who', 'when', 'where', 'define', 'definition', 'fact', 'history', 'origin'],
  },
  conversation: {
    patterns: [
      /hello|hi|hey|good morning|good afternoon/i,
      /how are you|what's up|thank you|thanks/i,
      /tell me about yourself|who are you/i,
    ],
    keywords: ['hello', 'hi', 'hey', 'thanks', 'thank'],
  },
  compliance: {
    patterns: [
      /compliance|regulation|regulatory|gdpr|hipaa|sox|pci/i,
      /audit|control|risk|framework|policy/i,
      /legal|lawful|permitted|prohibited|violation/i,
    ],
    keywords: ['compliance', 'regulation', 'gdpr', 'hipaa', 'audit', 'control', 'risk', 'legal', 'policy'],
  },
  financial: {
    patterns: [
      /financial|finance|investment|portfolio|stock|bond/i,
      /revenue|profit|loss|margin|ebitda|cash flow/i,
      /valuation|dcf|npv|irr|roi|payback/i,
      /budget|forecast|projection|scenario/i,
    ],
    keywords: ['financial', 'finance', 'investment', 'revenue', 'profit', 'valuation', 'budget', 'forecast'],
  },
};

// ============================================================================
// MODEL ROUTING MAP
// ============================================================================

const MODEL_ROUTING: Record<QueryCategory, RoutingConfig> = {
  math: {
    model: 'qwq:32b',
    temperature: 0.1,
    useCoT: true,
    priority: 1,
  },
  strategy: {
    model: 'mixtral:8x22b',
    temperature: 0.7,
    useCoT: true,
    priority: 1,
  },
  code: {
    model: 'qwen3-coder:30b',
    temperature: 0.2,
    useCoT: false,
    priority: 1,
  },
  analysis: {
    model: 'qwen3:32b',
    temperature: 0.5,
    useCoT: true,
    priority: 1,
  },
  creative: {
    model: 'qwen3:32b',
    temperature: 0.9,
    useCoT: false,
    priority: 2,
  },
  factual: {
    model: 'llama3.2:3b',
    temperature: 0.3,
    useCoT: false,
    priority: 3,
  },
  conversation: {
    model: 'llama3.2:3b',
    temperature: 0.7,
    useCoT: false,
    priority: 3,
  },
  compliance: {
    model: 'deepseek-r1:32b',
    temperature: 0.3,
    useCoT: true,
    priority: 1,
  },
  financial: {
    model: 'qwq:32b',
    temperature: 0.2,
    useCoT: true,
    priority: 1,
  },
};

const FALLBACK_MODELS: Record<string, string[]> = {
  'deepseek-r1:32b': ['qwen3:32b', 'qwq:32b', 'mixtral:8x22b'],
  'qwq:32b': ['deepseek-r1:32b', 'qwen3:32b', 'mixtral:8x22b'],
  'mixtral:8x22b': ['qwen3:32b', 'llama3.3:70b'],
  'qwen3-coder:30b': ['qwen3:32b', 'qwen2.5:14b'],
  'qwen3:32b': ['llama3.3:70b', 'mixtral:8x22b', 'qwen2.5:32b'],
  'llama3.3:70b': ['qwen3:32b', 'mixtral:8x22b'],
  'llama3.2:3b': ['qwen2.5:7b', 'qwen3:32b'],
};

// ============================================================================
// QUERY ROUTER CLASS
// ============================================================================

export class QueryRouter {
  
  /**
   * Classify a query and determine optimal model routing
   */
  classifyQuery(query: string): ClassificationResult {
    const scores: Record<QueryCategory, number> = {
      math: 0,
      strategy: 0,
      code: 0,
      analysis: 0,
      creative: 0,
      factual: 0,
      conversation: 0,
      compliance: 0,
      financial: 0,
    };

    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);

    // Score each category
    for (const [category, config] of Object.entries(CATEGORY_PATTERNS)) {
      // Pattern matching (higher weight)
      for (const pattern of config.patterns) {
        if (pattern.test(query)) {
          scores[category as QueryCategory] += 3;
        }
      }

      // Keyword matching
      for (const keyword of config.keywords) {
        if (queryLower.includes(keyword)) {
          scores[category as QueryCategory] += 1;
        }
        // Exact word match bonus
        if (words.includes(keyword)) {
          scores[category as QueryCategory] += 0.5;
        }
      }
    }

    // Find best category
    let bestCategory: QueryCategory = 'factual';
    let bestScore = 0;
    let totalScore = 0;

    for (const [category, score] of Object.entries(scores)) {
      totalScore += score;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category as QueryCategory;
      }
    }

    // Calculate confidence
    const confidence = totalScore > 0 ? Math.min(bestScore / totalScore, 0.99) : 0.5;

    // Get routing config
    const routing = MODEL_ROUTING[bestCategory];
    const alternatives = FALLBACK_MODELS[routing.model] || [];

    return {
      category: bestCategory,
      confidence: Math.round(confidence * 100) / 100,
      routedModel: routing.model,
      reasoning: this.generateReasoning(bestCategory, bestScore, scores),
      alternativeModels: alternatives,
    };
  }

  /**
   * Get routing configuration for a category
   */
  getRoutingConfig(category: QueryCategory): RoutingConfig {
    return MODEL_ROUTING[category];
  }

  /**
   * Get the optimal model for a query
   */
  routeQuery(query: string): {
    model: string;
    temperature: number;
    useCoT: boolean;
    classification: ClassificationResult;
  } {
    const classification = this.classifyQuery(query);
    const config = MODEL_ROUTING[classification.category];

    return {
      model: config.model,
      temperature: config.temperature,
      useCoT: config.useCoT,
      classification,
    };
  }

  /**
   * Generate a hash for caching
   */
  generateQueryHash(query: string, model: string, temperature: number): string {
    const input = `${query}|${model}|${temperature}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  private generateReasoning(category: QueryCategory, score: number, allScores: Record<QueryCategory, number>): string {
    const sortedCategories = Object.entries(allScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (score === 0) {
      return `Defaulted to '${category}' - no strong category signals detected`;
    }

    const topMatches = sortedCategories
      .filter(([_, s]) => s > 0)
      .map(([cat, s]) => `${cat}(${s.toFixed(1)})`)
      .join(', ');

    return `Classified as '${category}' (score: ${score.toFixed(1)}). Top matches: ${topMatches}`;
  }
}

export const queryRouter = new QueryRouter();
