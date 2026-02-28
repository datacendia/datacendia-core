// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MODEL SWITCHING SYSTEM
// Easy model switching for all AI Agents and Services
// =============================================================================

// =============================================================================
// AVAILABLE MODELS
// =============================================================================

export interface OllamaModel {
  id: string;
  name: string;
  size: string;
  description: string;
  capabilities: ModelCapability[];
  contextLength: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'basic' | 'good' | 'excellent' | 'flagship';
  useCase: string[];
  memoryRequired: string;
  default?: boolean;
}

export type ModelCapability =
  | 'reasoning'
  | 'coding'
  | 'analysis'
  | 'creative'
  | 'summarization'
  | 'chat'
  | 'instruction-following'
  | 'multilingual'
  | 'math'
  | 'vision';

// =============================================================================
// MODEL REGISTRY - All Available Ollama Models
// =============================================================================

export const AVAILABLE_MODELS: OllamaModel[] = [
  // =========================================================================
  // LLAMA 3.3 FAMILY
  // =========================================================================
  {
    id: 'qwen2.5:7b',
    name: 'Llama 3.3 70B',
    size: '70B',
    description: "Meta's flagship model. Best overall performance for complex tasks.",
    capabilities: [
      'reasoning',
      'analysis',
      'creative',
      'summarization',
      'chat',
      'instruction-following',
      'multilingual',
    ],
    contextLength: 128000,
    speed: 'slow',
    quality: 'flagship',
    useCase: [
      'Strategic analysis',
      'Complex reasoning',
      'Executive summaries',
      'Multi-domain synthesis',
    ],
    memoryRequired: '48GB+',
    default: true,
  },
  {
    id: 'llama3.3:latest',
    name: 'Llama 3.3 (Default)',
    size: '70B',
    description: 'Latest Llama 3.3 with optimal quantization.',
    capabilities: [
      'reasoning',
      'analysis',
      'creative',
      'summarization',
      'chat',
      'instruction-following',
    ],
    contextLength: 128000,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['General purpose flagship tasks'],
    memoryRequired: '48GB+',
  },

  // =========================================================================
  // LLAMA 3.2 FAMILY
  // =========================================================================
  {
    id: 'llama3.2:3b',
    name: 'Llama 3.2 3B',
    size: '3B',
    description: 'Fast, efficient model for simple tasks. Great for quick responses.',
    capabilities: ['chat', 'summarization', 'instruction-following'],
    contextLength: 128000,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick responses', 'Simple queries', 'High-volume tasks', 'Real-time chat'],
    memoryRequired: '4GB',
  },
  {
    id: 'llama3.2:1b',
    name: 'Llama 3.2 1B',
    size: '1B',
    description: 'Ultra-fast, minimal resource model. Best for edge/embedded.',
    capabilities: ['chat', 'instruction-following'],
    contextLength: 128000,
    speed: 'fast',
    quality: 'basic',
    useCase: ['Edge deployment', 'Embedded systems', 'Ultra-low latency'],
    memoryRequired: '2GB',
  },
  {
    id: 'llama3.2-vision:11b',
    name: 'Llama 3.2 Vision 11B',
    size: '11B',
    description: 'Multimodal model with vision capabilities.',
    capabilities: ['vision', 'chat', 'analysis', 'instruction-following'],
    contextLength: 128000,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Image analysis', 'Document OCR', 'Visual Q&A', 'Chart interpretation'],
    memoryRequired: '12GB',
  },

  // =========================================================================
  // QWQ (Reasoning Specialist)
  // =========================================================================
  {
    id: 'qwen2.5:7b',
    name: 'QwQ 32B',
    size: '32B',
    description: "Alibaba's reasoning specialist. Exceptional for complex analysis.",
    capabilities: ['reasoning', 'math', 'analysis', 'coding'],
    contextLength: 32768,
    speed: 'medium',
    quality: 'excellent',
    useCase: [
      'Deep reasoning',
      'Risk analysis',
      'Legal review',
      'Security assessment',
      'Complex problem solving',
    ],
    memoryRequired: '24GB',
  },
  {
    id: 'qwq:latest',
    name: 'QwQ (Latest)',
    size: '32B',
    description: 'Latest QwQ with optimal settings.',
    capabilities: ['reasoning', 'math', 'analysis', 'coding'],
    contextLength: 32768,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Reasoning tasks', 'Analytical work'],
    memoryRequired: '24GB',
  },

  // =========================================================================
  // QWEN 2.5 FAMILY
  // =========================================================================
  {
    id: 'qwen2.5:72b',
    name: 'Qwen 2.5 72B',
    size: '72B',
    description: "Alibaba's flagship general-purpose model.",
    capabilities: ['reasoning', 'analysis', 'creative', 'multilingual', 'chat'],
    contextLength: 131072,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['General flagship tasks', 'Multilingual applications'],
    memoryRequired: '48GB+',
  },
  {
    id: 'qwen2.5:7b',
    name: 'Qwen 2.5 32B',
    size: '32B',
    description: 'Balanced Qwen model for general use.',
    capabilities: ['reasoning', 'analysis', 'chat', 'multilingual'],
    contextLength: 131072,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['General purpose', 'Multilingual tasks'],
    memoryRequired: '24GB',
  },
  {
    id: 'qwen2.5:14b',
    name: 'Qwen 2.5 14B',
    size: '14B',
    description: 'Efficient Qwen model for moderate tasks.',
    capabilities: ['chat', 'analysis', 'multilingual'],
    contextLength: 131072,
    speed: 'medium',
    quality: 'good',
    useCase: ['Moderate complexity', 'Good balance of speed/quality'],
    memoryRequired: '12GB',
  },
  {
    id: 'qwen2.5:7b',
    name: 'Qwen 2.5 7B',
    size: '7B',
    description: 'Fast Qwen model for quick tasks.',
    capabilities: ['chat', 'instruction-following'],
    contextLength: 131072,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick responses', 'High throughput'],
    memoryRequired: '8GB',
  },
  {
    id: 'qwen2.5:7b',
    name: 'Qwen 2.5 Coder 32B',
    size: '32B',
    description: 'Specialized for code generation and analysis.',
    capabilities: ['coding', 'reasoning', 'analysis'],
    contextLength: 131072,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Code generation', 'Code review', 'Data operations', 'Technical analysis'],
    memoryRequired: '24GB',
  },
  {
    id: 'qwen2.5-coder:14b',
    name: 'Qwen 2.5 Coder 14B',
    size: '14B',
    description: 'Efficient coding model.',
    capabilities: ['coding', 'analysis'],
    contextLength: 131072,
    speed: 'medium',
    quality: 'good',
    useCase: ['Code tasks', 'Quick coding help'],
    memoryRequired: '12GB',
  },
  {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B',
    size: '7B',
    description: 'Fast coding assistant.',
    capabilities: ['coding'],
    contextLength: 131072,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick code completion', 'Simple coding tasks'],
    memoryRequired: '8GB',
  },

  // =========================================================================
  // DEEPSEEK FAMILY
  // =========================================================================
  {
    id: 'deepseek-r1:70b',
    name: 'DeepSeek R1 70B',
    size: '70B',
    description: "DeepSeek's reasoning model with chain-of-thought.",
    capabilities: ['reasoning', 'math', 'coding', 'analysis'],
    contextLength: 64000,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['Complex reasoning', 'Mathematical proofs', 'Deep analysis'],
    memoryRequired: '48GB+',
  },
  {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek R1 32B',
    size: '32B',
    description: 'Efficient DeepSeek reasoning model.',
    capabilities: ['reasoning', 'math', 'coding'],
    contextLength: 64000,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Reasoning tasks', 'Math problems'],
    memoryRequired: '24GB',
  },
  {
    id: 'deepseek-r1:14b',
    name: 'DeepSeek R1 14B',
    size: '14B',
    description: 'Fast DeepSeek reasoning model.',
    capabilities: ['reasoning', 'coding'],
    contextLength: 64000,
    speed: 'medium',
    quality: 'good',
    useCase: ['Quick reasoning', 'Moderate complexity'],
    memoryRequired: '12GB',
  },
  {
    id: 'deepseek-coder-v2:236b',
    name: 'DeepSeek Coder V2 236B',
    size: '236B',
    description: 'Massive coding model for complex development.',
    capabilities: ['coding', 'reasoning', 'analysis'],
    contextLength: 128000,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['Enterprise code generation', 'Complex refactoring'],
    memoryRequired: '128GB+',
  },

  // =========================================================================
  // MISTRAL FAMILY
  // =========================================================================
  {
    id: 'mistral:7b',
    name: 'Mistral 7B',
    size: '7B',
    description: 'Efficient European model with strong performance.',
    capabilities: ['chat', 'instruction-following', 'reasoning'],
    contextLength: 32768,
    speed: 'fast',
    quality: 'good',
    useCase: ['General chat', 'Quick responses'],
    memoryRequired: '8GB',
  },
  {
    id: 'mistral-large:123b',
    name: 'Mistral Large 123B',
    size: '123B',
    description: "Mistral's flagship model.",
    capabilities: ['reasoning', 'analysis', 'creative', 'multilingual'],
    contextLength: 128000,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['Enterprise applications', 'Complex analysis'],
    memoryRequired: '80GB+',
  },
  {
    id: 'mixtral:8x7b',
    name: 'Mixtral 8x7B',
    size: '47B (MoE)',
    description: 'Mixture of Experts model - efficient and powerful.',
    capabilities: ['reasoning', 'chat', 'coding', 'multilingual'],
    contextLength: 32768,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Balanced workloads', 'Multilingual tasks'],
    memoryRequired: '32GB',
  },
  {
    id: 'qwen2.5:7b',
    name: 'Mixtral 8x22B',
    size: '141B (MoE)',
    description: 'Large Mixture of Experts model.',
    capabilities: ['reasoning', 'analysis', 'creative', 'coding'],
    contextLength: 65536,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['Complex enterprise tasks'],
    memoryRequired: '64GB+',
  },

  // =========================================================================
  // GEMMA FAMILY (Google)
  // =========================================================================
  {
    id: 'gemma2:27b',
    name: 'Gemma 2 27B',
    size: '27B',
    description: "Google's open model with strong reasoning.",
    capabilities: ['reasoning', 'chat', 'analysis', 'instruction-following'],
    contextLength: 8192,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['General purpose', 'Research applications'],
    memoryRequired: '20GB',
  },
  {
    id: 'gemma2:9b',
    name: 'Gemma 2 9B',
    size: '9B',
    description: 'Efficient Google model.',
    capabilities: ['chat', 'instruction-following'],
    contextLength: 8192,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick tasks', 'Moderate complexity'],
    memoryRequired: '10GB',
  },
  {
    id: 'gemma2:2b',
    name: 'Gemma 2 2B',
    size: '2B',
    description: 'Ultra-efficient Google model.',
    capabilities: ['chat'],
    contextLength: 8192,
    speed: 'fast',
    quality: 'basic',
    useCase: ['Edge deployment', 'Simple tasks'],
    memoryRequired: '4GB',
  },

  // =========================================================================
  // PHI FAMILY (Microsoft)
  // =========================================================================
  {
    id: 'phi3:14b',
    name: 'Phi-3 14B',
    size: '14B',
    description: "Microsoft's efficient reasoning model.",
    capabilities: ['reasoning', 'math', 'coding'],
    contextLength: 128000,
    speed: 'medium',
    quality: 'good',
    useCase: ['Reasoning tasks', 'Educational applications'],
    memoryRequired: '12GB',
  },
  {
    id: 'phi3:mini',
    name: 'Phi-3 Mini',
    size: '3.8B',
    description: 'Compact Microsoft model with good reasoning.',
    capabilities: ['reasoning', 'chat'],
    contextLength: 128000,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick reasoning', 'Mobile/edge'],
    memoryRequired: '4GB',
  },

  // =========================================================================
  // COMMAND R FAMILY (Cohere)
  // =========================================================================
  {
    id: 'command-r:35b',
    name: 'Command R 35B',
    size: '35B',
    description: "Cohere's RAG-optimized model.",
    capabilities: ['reasoning', 'analysis', 'summarization', 'chat'],
    contextLength: 128000,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['RAG applications', 'Document analysis', 'Enterprise search'],
    memoryRequired: '24GB',
  },
  {
    id: 'command-r-plus:104b',
    name: 'Command R+ 104B',
    size: '104B',
    description: "Cohere's flagship enterprise model.",
    capabilities: ['reasoning', 'analysis', 'summarization', 'creative'],
    contextLength: 128000,
    speed: 'slow',
    quality: 'flagship',
    useCase: ['Enterprise RAG', 'Complex document work'],
    memoryRequired: '64GB+',
  },

  // =========================================================================
  // CODESTRAL (Mistral Coding)
  // =========================================================================
  {
    id: 'codestral:22b',
    name: 'Codestral 22B',
    size: '22B',
    description: "Mistral's dedicated coding model.",
    capabilities: ['coding', 'reasoning'],
    contextLength: 32768,
    speed: 'medium',
    quality: 'excellent',
    useCase: ['Code generation', 'Code review', 'Refactoring'],
    memoryRequired: '16GB',
  },

  // =========================================================================
  // STARCODER FAMILY
  // =========================================================================
  {
    id: 'starcoder2:15b',
    name: 'StarCoder 2 15B',
    size: '15B',
    description: 'Open-source coding model trained on The Stack.',
    capabilities: ['coding'],
    contextLength: 16384,
    speed: 'medium',
    quality: 'good',
    useCase: ['Code completion', 'Multi-language coding'],
    memoryRequired: '12GB',
  },
  {
    id: 'starcoder2:7b',
    name: 'StarCoder 2 7B',
    size: '7B',
    description: 'Efficient StarCoder model.',
    capabilities: ['coding'],
    contextLength: 16384,
    speed: 'fast',
    quality: 'good',
    useCase: ['Quick code completion'],
    memoryRequired: '8GB',
  },

  // =========================================================================
  // EMBEDDING MODELS
  // =========================================================================
  {
    id: 'nomic-embed-text:latest',
    name: 'Nomic Embed Text',
    size: '137M',
    description: 'High-quality text embeddings.',
    capabilities: ['analysis'],
    contextLength: 8192,
    speed: 'fast',
    quality: 'excellent',
    useCase: ['Semantic search', 'RAG', 'Clustering'],
    memoryRequired: '1GB',
  },
  {
    id: 'mxbai-embed-large:335m',
    name: 'MxBAI Embed Large',
    size: '335M',
    description: 'Large embedding model for semantic search.',
    capabilities: ['analysis'],
    contextLength: 512,
    speed: 'fast',
    quality: 'excellent',
    useCase: ['Semantic search', 'Document similarity'],
    memoryRequired: '2GB',
  },
];

// =============================================================================
// MODEL CATEGORIES FOR UI
// =============================================================================

export interface ModelCategory {
  id: string;
  name: string;
  description: string;
  models: string[];
}

export const MODEL_CATEGORIES: ModelCategory[] = [
  {
    id: 'flagship',
    name: '🏆 Flagship Models',
    description: 'Best quality, highest resource usage',
    models: [
      'qwen2.5:7b',
      'qwen2.5:72b',
      'deepseek-r1:70b',
      'mistral-large:123b',
      'command-r-plus:104b',
    ],
  },
  {
    id: 'reasoning',
    name: '🧠 Reasoning Specialists',
    description: 'Optimized for complex analysis and logic',
    models: ['qwen2.5:7b', 'deepseek-r1:32b', 'phi3:14b', 'gemma2:27b'],
  },
  {
    id: 'coding',
    name: '💻 Coding Models',
    description: 'Specialized for code generation and analysis',
    models: ['qwen2.5:7b', 'deepseek-coder-v2:236b', 'codestral:22b', 'starcoder2:15b'],
  },
  {
    id: 'balanced',
    name: '⚖️ Balanced Models',
    description: 'Good balance of speed and quality',
    models: ['qwen2.5:7b', 'mixtral:8x7b', 'command-r:35b', 'gemma2:27b'],
  },
  {
    id: 'fast',
    name: '⚡ Fast Models',
    description: 'Quick responses, lower resource usage',
    models: ['llama3.2:3b', 'qwen2.5:7b', 'mistral:7b', 'gemma2:9b', 'phi3:mini'],
  },
  {
    id: 'edge',
    name: '📱 Edge/Embedded',
    description: 'Minimal resource usage, mobile-friendly',
    models: ['llama3.2:1b', 'gemma2:2b'],
  },
  {
    id: 'vision',
    name: '👁️ Vision Models',
    description: 'Multimodal with image understanding',
    models: ['llama3.2-vision:11b'],
  },
  {
    id: 'embedding',
    name: '🔍 Embedding Models',
    description: 'For semantic search and RAG',
    models: ['nomic-embed-text:latest', 'mxbai-embed-large:335m'],
  },
];

// =============================================================================
// RECOMMENDED MODELS BY AGENT ROLE
// =============================================================================

export const AGENT_MODEL_RECOMMENDATIONS: Record<string, string[]> = {
  // Strategic / Executive
  chief: ['qwen2.5:7b', 'qwen2.5:72b', 'command-r-plus:104b'],

  // Financial
  cfo: ['qwen2.5:7b', 'qwen2.5:7b', 'deepseek-r1:70b'],
  cio: ['qwen2.5:7b', 'qwen2.5:7b'],

  // Operations
  coo: ['llama3.2:3b', 'qwen2.5:7b', 'mistral:7b'],

  // Security / Legal / Risk
  ciso: ['qwen2.5:7b', 'deepseek-r1:32b', 'gemma2:27b'],
  clo: ['qwen2.5:7b', 'command-r:35b'],
  risk: ['qwen2.5:7b', 'deepseek-r1:32b'],

  // Marketing / Sales
  cmo: ['qwen2.5:7b', 'qwen2.5:7b'],
  cro: ['qwen2.5:7b', 'qwen2.5:7b'],
  cco: ['llama3.2:3b', 'qwen2.5:7b'],

  // Data / Technical
  cdo: ['qwen2.5:7b', 'deepseek-coder-v2:236b'],
  caio: ['qwen2.5:7b', 'deepseek-r1:32b'],

  // Product / Innovation
  cpo: ['qwen2.5:7b', 'qwen2.5:7b'],
  cso: ['qwen2.5:7b', 'qwen2.5:7b'],

  // Premium Packs
  'ext-auditor': ['qwen2.5:7b', 'command-r:35b'],
  'int-auditor': ['qwen2.5:7b', 'qwen2.5:7b'],
  cmio: ['qwen2.5:7b', 'qwen2.5:7b'],
  pso: ['qwen2.5:7b', 'deepseek-r1:32b'],
  hco: ['qwen2.5:7b', 'command-r:35b'],
  cod: ['llama3.2:3b', 'qwen2.5:14b'],
  quant: ['qwen2.5:7b', 'deepseek-r1:70b'],
  pm: ['qwen2.5:7b', 'qwen2.5:7b'],
  'cro-finance': ['qwen2.5:7b', 'deepseek-r1:32b'],
  treasury: ['qwen2.5:7b', 'qwen2.5:7b'],
  contracts: ['command-r:35b', 'qwen2.5:7b'],
  ip: ['qwen2.5:7b', 'qwen2.5:7b'],
  litigation: ['qwen2.5:7b', 'command-r-plus:104b'],
  regulatory: ['qwen2.5:7b', 'command-r:35b'],
};

// =============================================================================
// MODEL SWITCHING FUNCTIONS
// =============================================================================

/**
 * Get all available models
 */
export function getAvailableModels(): OllamaModel[] {
  return AVAILABLE_MODELS;
}

/**
 * Get a model by ID
 */
export function getModel(modelId: string): OllamaModel | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}

/**
 * Get models by capability
 */
export function getModelsByCapability(capability: ModelCapability): OllamaModel[] {
  return AVAILABLE_MODELS.filter((m) => m.capabilities.includes(capability));
}

/**
 * Get models by quality tier
 */
export function getModelsByQuality(quality: OllamaModel['quality']): OllamaModel[] {
  return AVAILABLE_MODELS.filter((m) => m.quality === quality);
}

/**
 * Get models by speed
 */
export function getModelsBySpeed(speed: OllamaModel['speed']): OllamaModel[] {
  return AVAILABLE_MODELS.filter((m) => m.speed === speed);
}

/**
 * Get recommended models for an agent
 */
export function getRecommendedModels(agentCode: string): OllamaModel[] {
  const recommendations = AGENT_MODEL_RECOMMENDATIONS[agentCode] || ['qwen2.5:7b'];
  return recommendations.map((id) => getModel(id)).filter((m): m is OllamaModel => m !== undefined);
}

/**
 * Get the default model
 */
export function getDefaultModel(): OllamaModel {
  return AVAILABLE_MODELS.find((m) => m.default) || AVAILABLE_MODELS[0];
}

/**
 * Get model categories for UI display
 */
export function getModelCategories(): ModelCategory[] {
  return MODEL_CATEGORIES;
}

/**
 * Estimate tokens per second for a model (rough estimate)
 */
export function estimateTokensPerSecond(modelId: string): number {
  const model = getModel(modelId);
  if (!model) {
    return 20;
  }

  switch (model.speed) {
    case 'fast':
      return 50;
    case 'medium':
      return 25;
    case 'slow':
      return 10;
    default:
      return 20;
  }
}

/**
 * Check if a model is suitable for a capability
 */
export function isModelSuitable(modelId: string, capability: ModelCapability): boolean {
  const model = getModel(modelId);
  return model?.capabilities.includes(capability) || false;
}

// =============================================================================
// MODEL CONFIGURATION STORAGE
// =============================================================================

export interface AgentModelConfig {
  agentId: string;
  currentModel: string;
  fallbackModel?: string;
  customSettings?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}

// Default agent model configurations
export const DEFAULT_AGENT_MODELS: Record<string, string> = {
  chief: 'qwen2.5:7b',
  cfo: 'qwen2.5:7b',
  coo: 'llama3.2:3b',
  ciso: 'qwen2.5:7b',
  cmo: 'qwen2.5:7b',
  cro: 'qwen2.5:7b',
  cdo: 'qwen2.5:7b',
  risk: 'qwen2.5:7b',
  clo: 'qwen2.5:7b',
  cpo: 'qwen2.5:7b',
  caio: 'qwen2.5:7b',
  cso: 'qwen2.5:7b',
  cio: 'qwen2.5:7b',
  cco: 'llama3.2:3b',
};

// Total model count
export const TOTAL_MODEL_COUNT = AVAILABLE_MODELS.length;
