// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA SOVEREIGN MODEL ZOO
 * =============================================================================
 * Configuration for Local Inference (Ollama)
 * Optimized for: 128GB RAM Workstation (Intel i9-12900KF)
 * Architecture: Specialized Expert Team (Heterogeneous Models)
 * 
 * RAM Usage: ~80GB (leaves room for long context windows)
 */

export interface ModelConfig {
  id: string;
  name: string;
  contextWindow: number;
  temperature: number;
  description: string;
  size: string;
  installed?: boolean;
}

export interface AgentConfig {
  name: string;
  model: keyof typeof MODEL_REGISTRY;
  systemPrompt: string;
  description: string;
}

// =============================================================================
// THE MODEL REGISTRY (Special Ops Team)
// =============================================================================

export const MODEL_REGISTRY = {
  // THE CHIEF (General Intelligence King)
  // Llama 3.3 - Peak instruction following and synthesis
  // Equivalent to GPT-4o class performance locally
  flagship: {
    id: 'qwen3:32b',
    name: 'Qwen3 32B',
    contextWindow: 128000,
    temperature: 0.7,
    description: 'General intelligence flagship - synthesis & strategy',
    size: '40GB',
  } as ModelConfig,

  // THE PHILOSOPHER (Reasoning Engine)
  // QwQ - Trained for "Chain of Thought" reasoning
  // Use for Risk, Audit, and finding logical fallacies
  reasoning: {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek-R1 32B',
    contextWindow: 32768,
    temperature: 0.6, // Lower temp for logic
    description: 'Deep reasoning & chain-of-thought analysis',
    size: '20GB',
  } as ModelConfig,

  // THE ENGINEER (Coding Specialist)
  // Qwen3 Coder 30B - Purpose-built for agentic coding + tool calling
  // Use for Data ops and Workflow execution
  coder: {
    id: 'qwen3-coder:30b',
    name: 'Qwen3 Coder 30B',
    contextWindow: 131072,
    temperature: 0.2, // Very low temp for precision
    description: 'Code, SQL, JSON specialist',
    size: '18GB',
  } as ModelConfig,

  // THE SPEEDSTER (UI & Operations)
  // Instant responses for the interface
  // Keeps the dashboard feeling snappy
  fast: {
    id: 'llama3.2:3b',
    name: 'Llama 3.2 3B',
    contextWindow: 8192,
    temperature: 0.5,
    description: 'Fast responses for UI & quick tasks',
    size: '2GB',
  } as ModelConfig,

  // THE EYES (Vision - Optional)
  // For The Lens to "see" charts and PDFs
  vision: {
    id: 'qwen3-vl:30b',
    name: 'Qwen3-VL 30B',
    contextWindow: 16384,
    temperature: 0.5,
    description: 'Vision model for charts & documents',
    size: '19GB',
  } as ModelConfig,

  // LEGACY MODELS (Already installed, can be used as fallbacks)
  legacy_mixtral: {
    id: 'mixtral:8x22b',
    name: 'Mixtral 8x22B',
    contextWindow: 65536,
    temperature: 0.7,
    description: 'MoE model - good for complex analysis',
    size: '79GB',
  } as ModelConfig,

  legacy_llama3: {
    id: 'llama3:70b',
    name: 'Llama 3 70B',
    contextWindow: 8192,
    temperature: 0.7,
    description: 'Previous flagship (fallback)',
    size: '39GB',
  } as ModelConfig,
} as const;

// =============================================================================
// THE COUNCIL: Agent-to-Model Mapping
// =============================================================================

export const AGENT_CONFIG: Record<string, AgentConfig> = {
  chief: {
    name: 'CendiaChief',
    model: 'flagship',
    description: 'Chief of Staff - Synthesis & Strategy',
    systemPrompt: `You are the Chief of Staff at Datacendia. Your role is to:
- Synthesize perspectives from all council members into coherent strategy
- Make final recommendations that balance competing priorities
- Identify blind spots and gaps in the analysis
- Drive toward actionable decisions with clear ownership`,
  },

  cfo: {
    name: 'CendiaCFO',
    model: 'flagship',
    description: 'Chief Financial Officer - ROI & Risk',
    systemPrompt: `You are the CFO at Datacendia. Your role is to:
- Focus on ROI, cash flow, and margin impact
- Be conservative in financial projections
- Quantify risks in dollar terms
- Ensure capital allocation aligns with strategic priorities`,
  },

  ciso: {
    name: 'CendiaCISO',
    model: 'reasoning', // QwQ for deep security analysis
    description: 'Chief Security Officer - Security & Compliance',
    systemPrompt: `You are the CISO at Datacendia. Your role is to:
- Scrutinize ALL plans for security and compliance risks
- Think step-by-step through attack vectors
- Reference specific regulations (GDPR, SOC2, NIST, etc.)
- Never approve anything without security review`,
  },

  cmo: {
    name: 'CendiaCMO',
    model: 'flagship',
    description: 'Chief Marketing Officer - Brand & Market',
    systemPrompt: `You are the CMO at Datacendia. Your role is to:
- Focus on brand voice and customer perception
- Assess market fit and competitive positioning
- Ensure messaging consistency
- Advocate for the customer perspective`,
  },

  coo: {
    name: 'CendiaCOO',
    model: 'fast', // Quick responses for operations
    description: 'Chief Operating Officer - Execution & Efficiency',
    systemPrompt: `You are the COO at Datacendia. Your role is to:
- Focus on bottlenecks and execution speed
- Ensure operational efficiency
- Create actionable timelines
- Identify resource constraints`,
  },

  cto: {
    name: 'CendiaCTO',
    model: 'coder', // Coding specialist
    description: 'Chief Technology Officer - Architecture & Code',
    systemPrompt: `You are the CTO at Datacendia. Your role is to:
- Evaluate technical feasibility
- Ensure architecture scalability
- Identify technical debt and risks
- Provide code and implementation guidance`,
  },

  cdo: {
    name: 'CendiaCDO',
    model: 'coder', // SQL/JSON specialist
    description: 'Chief Data Officer - Data Quality & Lineage',
    systemPrompt: `You are the CDO at Datacendia. Your role is to:
- Validate data lineage and quality
- Ensure data governance compliance
- Output valid JSON or SQL when requested
- Protect data integrity`,
  },

  risk: {
    name: 'CendiaRisk',
    model: 'reasoning', // QwQ for probability assessment
    description: 'Risk Officer - Probability & Impact',
    systemPrompt: `You are the Risk Officer at Datacendia. Your role is to:
- Calculate probability and impact scores
- Be pessimistic and validate all assumptions
- Identify tail risks others miss
- Quantify uncertainty ranges`,
  },

  chro: {
    name: 'CendiaHR',
    model: 'flagship',
    description: 'Chief HR Officer - People & Culture',
    systemPrompt: `You are the CHRO at Datacendia. Your role is to:
- Assess impact on employees and culture
- Ensure decisions align with company values
- Plan change management
- Advocate for talent development`,
  },

  flow: {
    name: 'CendiaFlow',
    model: 'coder', // Best at writing executable code
    description: 'Automation Engine - Workflows & Execution',
    systemPrompt: `You are the Automation Engine at Datacendia. Your role is to:
- Output executable workflows and code snippets
- Generate valid JSON configurations
- Create automation scripts
- Ensure code is production-ready`,
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the Ollama model ID for a specific agent
 */
export function getModelForAgent(agentId: string): string {
  const agent = AGENT_CONFIG[agentId];
  if (!agent) return MODEL_REGISTRY.flagship.id;
  
  const modelType = agent.model;
  return MODEL_REGISTRY[modelType].id;
}

/**
 * Get the full model config for an agent
 */
export function getModelConfigForAgent(agentId: string): ModelConfig {
  const agent = AGENT_CONFIG[agentId];
  if (!agent) return MODEL_REGISTRY.flagship;
  
  return MODEL_REGISTRY[agent.model];
}

/**
 * Get all available models
 */
export function getAllModels(): ModelConfig[] {
  return Object.values(MODEL_REGISTRY);
}

/**
 * Get all agents
 */
export function getAllAgents(): AgentConfig[] {
  return Object.values(AGENT_CONFIG);
}

/**
 * Get agents by model type
 */
export function getAgentsByModel(modelType: keyof typeof MODEL_REGISTRY): AgentConfig[] {
  return Object.values(AGENT_CONFIG).filter(agent => agent.model === modelType);
}

// =============================================================================
// MODEL SELECTION (User Preference Override)
// =============================================================================

export interface UserModelPreferences {
  defaultModel?: string;
  agentOverrides?: Record<string, string>;
  useVision?: boolean;
}

let userPreferences: UserModelPreferences = {};

export function setUserModelPreferences(prefs: UserModelPreferences): void {
  userPreferences = { ...userPreferences, ...prefs };
}

export function getUserModelPreferences(): UserModelPreferences {
  return userPreferences;
}

/**
 * Get the effective model for an agent (respects user overrides)
 */
export function getEffectiveModelForAgent(agentId: string): string {
  // Check for user override
  if (userPreferences.agentOverrides?.[agentId]) {
    return userPreferences.agentOverrides[agentId];
  }
  
  // Check for default override
  if (userPreferences.defaultModel) {
    return userPreferences.defaultModel;
  }
  
  // Use configured model
  return getModelForAgent(agentId);
}
