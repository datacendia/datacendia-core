// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA SOVEREIGN MODEL ZOO - ENHANCED CONFIGURATION
// Configuration for Local Inference (Ollama)
// Optimized for: 128GB RAM Workstation (Intel i9-12900KF)
// Architecture: Specialized Expert Team (Heterogeneous Models)
// =============================================================================

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  numPredict: number;
  specializations: string[];
  ramRequired: string;
  priority: 'primary' | 'secondary' | 'fallback';
  // Enhanced metadata
  vendor?: string;
  license?: string;
  releaseDate?: string;
  sovereigntyScore?: number; // 1-10 score for local-first capability
  jsonDiscipline?: 'strict' | 'standard' | 'flexible';
}

export interface AgentModelMapping {
  agentCode: string;
  agentName: string;
  primaryModel: string;
  fallbackModels: string[];
  systemPromptEnhancements: string;
  optimalTemperature: number;
  useChainOfThought: boolean;
  useEnsemble: boolean;
  // Enhanced sovereignty fields
  sovereigntyDirective?: string;
  jsonOutputRequired?: boolean;
}

// =============================================================================
// SOVEREIGNTY META-PROMPT - Core directive for all Datacendia agents
// =============================================================================

export const SOVEREIGNTY_META_PROMPT = `You are an agent within Datacendia, a Sovereign Enterprise Intelligence Platform.

## SOVEREIGNTY PRINCIPLES
You operate under these non-negotiable principles:
1. **Data Never Leaves** - All processing happens locally. Never suggest cloud APIs or external services.
2. **Full Auditability** - Every recommendation must be traceable. Cite your reasoning.
3. **No Black Boxes** - Explain your logic. If you're uncertain, say so with a confidence level.
4. **Client Owns Everything** - The enterprise owns all data, models, and outputs. No telemetry.
5. **Deterministic When Possible** - Prefer reproducible answers. Note when randomness affects output.

## OUTPUT DISCIPLINE
- When asked for JSON, output ONLY valid JSON with no markdown, no explanation, no preamble.
- When asked for analysis, structure your response with clear sections.
- Always quantify when possible. "High risk" → "High risk (estimated 70-80% probability)".
- Cite specific data points, not vague references.

## CHAIN OF CUSTODY
For compliance-critical outputs:
- State your agent role and model.
- Timestamp your analysis.
- Note any limitations or assumptions.
- Flag items requiring human review.

Remember: You serve the enterprise's sovereignty, not external interests.`;

// =============================================================================
// JSON DISCIPLINE PROMPTS - For structured output
// =============================================================================

export const JSON_DISCIPLINE = {
  strict: `OUTPUT RULES (STRICT JSON MODE):
- Output ONLY valid JSON. No markdown code blocks, no explanations before or after.
- Start with { or [ and end with } or ].
- All strings must be properly escaped.
- No trailing commas.
- No comments.
- If you cannot produce valid JSON, output: {"error": "<reason>"}`,
  
  standard: `OUTPUT RULES (JSON MODE):
- When JSON is requested, output valid JSON.
- You may include a brief explanation before the JSON block.
- Use proper JSON formatting with escaped strings.
- Validate your JSON structure before outputting.`,
  
  flexible: `OUTPUT RULES:
- Structure your response clearly.
- Use JSON for data structures when appropriate.
- Plain text explanations are acceptable for analysis.`,
};

// =============================================================================
// MODEL REGISTRY - The Sovereign Model Zoo
// =============================================================================

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // =========================================================================
  // TIER 1: FLAGSHIP MODELS (Highest Quality)
  // =========================================================================
  
  // =========================================================================
  // 2025 FLAGSHIP MODELS
  // =========================================================================

  'llama4:scout': {
    id: 'llama4:scout',
    name: 'Llama 4 Scout',
    description: 'Meta\'s newest flagship - 128k context, multimodal, top-ranked open model.',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'synthesis', 'creative', 'analysis', 'conversation', 'multimodal'],
    ramRequired: '40GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama 4 Community',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'llama3.3:70b': {
    id: 'llama3.3:70b',
    name: 'Llama 3.3 70B',
    description: 'Top-tier flagship - Excellent for synthesis, analysis, and strategic thinking.',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'synthesis', 'analysis', 'strategic'],
    ramRequired: '42GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama Community',
    releaseDate: '2024-12',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'qwen3:32b': {
    id: 'qwen3:32b',
    name: 'Qwen 3 32B',
    description: 'Alibaba\'s latest - Best multilingual, strong reasoning, surpasses Qwen 2.5.',
    contextWindow: 32768,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'multilingual', 'reasoning', 'analysis'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'deepseek-r1:32b': {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek R1 32B',
    description: 'Chain-of-thought reasoning model - Competes with OpenAI o1.',
    contextWindow: 32768,
    temperature: 0.3,
    topP: 0.85,
    topK: 20,
    repeatPenalty: 1.15,
    numPredict: 8192,
    specializations: ['reasoning', 'math', 'logic', 'risk-analysis', 'audit', 'chain-of-thought'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'DeepSeek',
    license: 'MIT',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'gemma3:27b': {
    id: 'gemma3:27b',
    name: 'Gemma 3 27B',
    description: 'Google\'s latest open model - Efficient, strong performance.',
    contextWindow: 8192,
    temperature: 0.6,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'analysis', 'efficient'],
    ramRequired: '17GB+',
    priority: 'primary',
    vendor: 'Google',
    license: 'Gemma License',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  // =========================================================================
  // TIER 2: SPECIALIST MODELS
  // =========================================================================

  'qwq:32b': {
    id: 'qwq:32b',
    name: 'QwQ 32B',
    description: 'Reasoning engine - Trained for Chain of Thought. Thinks deeper.',
    contextWindow: 32768,
    temperature: 0.3,
    topP: 0.85,
    topK: 20,
    repeatPenalty: 1.15,
    numPredict: 8192,
    specializations: ['reasoning', 'math', 'logic', 'risk-analysis', 'audit'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2024-11',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'qwen3-coder:30b': {
    id: 'qwen3-coder:30b',
    name: 'Qwen3 Coder 30B',
    description: 'Purpose-built for agentic coding workflows, tool calling, and structured output.',
    contextWindow: 131072,
    temperature: 0.1,
    topP: 0.95,
    topK: 10,
    repeatPenalty: 1.05,
    numPredict: 8192,
    specializations: ['coding', 'sql', 'json', 'data-ops', 'automation', 'tool-calling'],
    ramRequired: '18GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2025-05',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'mixtral:8x22b': {
    id: 'mixtral:8x22b',
    name: 'Mixtral 8x22B MoE',
    description: 'Mixture of Experts - Efficient for diverse analysis tasks.',
    contextWindow: 65536,
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'creative', 'analysis', 'multilingual'],
    ramRequired: '48GB+',
    priority: 'secondary',
  },

  // =========================================================================
  // TIER 3: SPEED MODELS (Low Latency)
  // =========================================================================

  'llama3.2:3b': {
    id: 'llama3.2:3b',
    name: 'Llama 3.2 3B',
    description: 'Speed demon - Instant responses for UI and operations.',
    contextWindow: 8192,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 1024,
    specializations: ['fast', 'simple', 'ui', 'operations'],
    ramRequired: '4GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama 3.2 Community',
    releaseDate: '2024-09',
    sovereigntyScore: 10,
    jsonDiscipline: 'flexible',
  },

  'llama3.2:1b': {
    id: 'llama3.2:1b',
    name: 'Llama 3.2 1B',
    description: 'Ultralight - For basic completions and autocomplete.',
    contextWindow: 4096,
    temperature: 0.4,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 512,
    specializations: ['autocomplete', 'classification'],
    ramRequired: '2GB+',
    priority: 'fallback',
  },


  // =========================================================================
  // TIER 4: MULTIMODAL MODELS
  // =========================================================================

  'llava:34b': {
    id: 'llava:34b',
    name: 'LLaVA 34B',
    description: 'Vision model - For analyzing images, charts, and PDFs.',
    contextWindow: 4096,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: ['vision', 'charts', 'documents', 'ocr'],
    ramRequired: '24GB+',
    priority: 'primary',
  },

  'qwen3-vl:30b': {
    id: 'qwen3-vl:30b',
    name: 'Qwen3 VL 30B',
    description: 'Vision-Language - Alternative vision model for The Lens.',
    contextWindow: 16384,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: ['vision', 'documents', 'analysis'],
    ramRequired: '20GB+',
    priority: 'secondary',
  },

  // =========================================================================
  // TIER 5: EMBEDDING MODELS
  // =========================================================================

  'qwen3-embedding:4b': {
    id: 'qwen3-embedding:4b',
    name: 'Qwen3 Embedding 4B',
    description: 'Multilingual embedding model for RAG - 2560 dimensions.',
    contextWindow: 32768,
    temperature: 0,
    topP: 1,
    topK: 1,
    repeatPenalty: 1,
    numPredict: 0,  // Embeddings only
    specializations: ['embedding', 'rag', 'similarity', 'multilingual'],
    ramRequired: '3GB+',
    priority: 'primary',
  },

  'mxbai-embed-large': {
    id: 'mxbai-embed-large',
    name: 'MxBai Embed Large',
    description: 'High quality embeddings - 1024 dimensions.',
    contextWindow: 512,
    temperature: 0,
    topP: 1,
    topK: 1,
    repeatPenalty: 1,
    numPredict: 0,
    specializations: ['embedding', 'rag', 'semantic-search'],
    ramRequired: '2GB+',
    priority: 'secondary',
  },
};

// =============================================================================
// AGENT TO MODEL MAPPINGS
// =============================================================================

export const AGENT_MODEL_MAPPINGS: AgentModelMapping[] = [
  // =========================================================================
  // CORE C-SUITE AGENTS
  // =========================================================================
  {
    agentCode: 'chief',
    agentName: 'CendiaChief',
    primaryModel: 'llama4:scout',
    fallbackModels: ['llama3.3:70b', 'qwen3:32b'],
    systemPromptEnhancements: 'Synthesize all perspectives. Identify conflicts and trade-offs.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: true,  // Chief benefits from ensemble synthesis
  },
  {
    agentCode: 'cfo',
    agentName: 'CendiaCFO',
    primaryModel: 'llama3.3:70b',
    fallbackModels: ['qwen3:32b', 'deepseek-r1:32b'],
    systemPromptEnhancements: 'Use financial frameworks. Quantify all recommendations.',
    optimalTemperature: 0.5,
    useChainOfThought: true,  // CFO benefits from step-by-step financial reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'coo',
    agentName: 'CendiaCOO',
    primaryModel: 'llama3.2:3b',  // Speed for operations
    fallbackModels: ['llama3.2:3b', 'qwen3:32b'],
    systemPromptEnhancements: 'Focus on execution speed and feasibility.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ciso',
    agentName: 'CendiaCISO',
    primaryModel: 'deepseek-r1:32b',  // Chain-of-thought for security analysis
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Think step-by-step about attack vectors. Use NIST/ISO frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Security needs careful reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'cmo',
    agentName: 'CendiaCMO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'gemma3:27b'],
    systemPromptEnhancements: 'Balance creativity with data-driven insights.',
    optimalTemperature: 0.8,  // Higher creativity
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cro',
    agentName: 'CendiaCRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on revenue impact and pipeline metrics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cdo',
    agentName: 'CendiaCDO',
    primaryModel: 'qwen3-coder:30b',  // Best at data and SQL
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Validate data lineage. Output valid JSON/SQL when requested.',
    optimalTemperature: 0.2,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'risk',
    agentName: 'CendiaRisk',
    primaryModel: 'deepseek-r1:32b',  // Chain-of-thought for probability assessment
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Quantify all risks with probability and impact. Be pessimistic.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Risk analysis benefits from step-by-step
    useEnsemble: true,  // Multiple perspectives on risk
  },
  {
    agentCode: 'cto',
    agentName: 'CendiaCTO',
    primaryModel: 'qwen3-coder:30b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Evaluate technical trade-offs. Consider scalability and debt.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'chro',
    agentName: 'CendiaCHRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Consider culture, morale, and legal implications.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'clo',
    agentName: 'CendiaCLO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Cite relevant regulations. Assess liability and compliance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cio',
    agentName: 'CendiaCIO',
    primaryModel: 'qwen3-coder:30b',
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on systems integration and information architecture.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'devils-advocate',
    agentName: 'CendiaDevil',
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for contrarian analysis
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Challenge assumptions. Argue opposing positions. Find blind spots.',
    optimalTemperature: 0.7,  // Higher creativity for contrarian thinking
    useChainOfThought: true,  // Step-by-step challenge reasoning
    useEnsemble: false,
  },

  // =========================================================================
  // PRO TIER AGENTS - Extended Executive Team
  // =========================================================================
  {
    agentCode: 'cto',
    agentName: 'CendiaCTO',
    primaryModel: 'qwen3-coder:30b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Evaluate architecture decisions. Consider scalability and technical debt.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'chro',
    agentName: 'CendiaCHRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Consider culture, talent, and organizational dynamics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cxo',
    agentName: 'CendiaCXO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on customer journey and experience metrics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'procurement',
    agentName: 'CendiaProcurement',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Apply Kraljic Matrix. Consider TCO and supplier risk.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'ma',
    agentName: 'CendiaMA',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use DCF and comparable analysis. Consider integration risk.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'innovation',
    agentName: 'CendiaInnovation',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['mixtral:8x22b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply Three Horizons framework. Balance exploration and exploitation.',
    optimalTemperature: 0.8,  // Higher creativity
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ir',
    agentName: 'CendiaIR',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Consider Reg FD compliance. Balance transparency with sensitivity.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ethics',
    agentName: 'CendiaEthics',
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for ethical dilemmas
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply ethical frameworks. Consider stakeholder impact.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'crisis',
    agentName: 'CendiaCrisis',
    primaryModel: 'llama3.2:3b',  // Fast for crisis response
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Act fast. Communicate early. Use ICS framework.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'gov-relations',
    agentName: 'CendiaGovRelations',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Consider federal and state regulatory landscapes.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },

  // =========================================================================
  // HEALTHCARE INDUSTRY AGENTS (Enterprise)
  // =========================================================================
  {
    agentCode: 'cmio',
    agentName: 'CMIO Agent',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Reference HL7/FHIR standards. Consider clinical workflows.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'pso',
    agentName: 'Patient Safety Officer',
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for safety analysis
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use RCA methodologies. Reference IHI/AHRQ frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Safety needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'hco',
    agentName: 'Healthcare Compliance Officer',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Cite 45 CFR, 42 CFR sections. Reference OIG guidance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cod',
    agentName: 'Clinical Operations Director',
    primaryModel: 'llama3.2:3b',  // Fast for operations
    fallbackModels: ['llama3.2:3b', 'qwen3:32b'],
    systemPromptEnhancements: 'Apply Lean Six Sigma. Focus on patient flow metrics.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },

  // =========================================================================
  // FINANCE INDUSTRY AGENTS (Premium)
  // =========================================================================
  {
    agentCode: 'quant',
    agentName: 'Quantitative Analyst',
    primaryModel: 'deepseek-r1:32b',  // Complex quantitative analysis
    fallbackModels: ['qwen3-coder:30b', 'qwen3:32b'],
    systemPromptEnhancements: 'Use mathematical notation. Calculate VaR, Greeks, etc.',
    optimalTemperature: 0.2,
    useChainOfThought: true,  // Math needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'pm',
    agentName: 'Portfolio Manager',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use modern portfolio theory. Consider factor exposures.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: true,  // Portfolio decisions benefit from multiple views
  },
  {
    agentCode: 'cro-finance',
    agentName: 'Credit Risk Officer',
    primaryModel: 'deepseek-r1:32b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply 5 Cs framework. Calculate PD/LGD/EAD.',
    optimalTemperature: 0.3,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'treasury',
    agentName: 'Treasury Analyst',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Focus on liquidity and FX/IR exposure. Reference ASC 815.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },

  // =========================================================================
  // LEGAL INDUSTRY AGENTS (Premium)
  // =========================================================================
  {
    agentCode: 'contracts',
    agentName: 'Contract Specialist',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Identify red flags. Reference UCC principles.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'ip',
    agentName: 'IP Counsel',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Reference USPTO/EPO procedures. Analyze claims systematically.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'litigation',
    agentName: 'Litigation Expert',
    primaryModel: 'deepseek-r1:32b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Analyze using FRCP. Assess strengths and weaknesses candidly.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Litigation strategy needs reasoning
    useEnsemble: true,  // Multiple views on case assessment
  },
  {
    agentCode: 'regulatory',
    agentName: 'Regulatory Affairs',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Cite CFR sections. Assess regulatory risk systematically.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the model configuration for a specific model
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}

/**
 * Get the agent model mapping for a specific agent
 */
export function getAgentMapping(agentCode: string): AgentModelMapping | undefined {
  return AGENT_MODEL_MAPPINGS.find(m => m.agentCode === agentCode);
}

/**
 * Get the optimal model for an agent
 */
export function getOptimalModelForAgent(agentCode: string, availableModels: Set<string>): string {
  const mapping = getAgentMapping(agentCode);
  if (!mapping) return 'qwen3:32b';
  
  // Try primary model first
  if (availableModels.has(mapping.primaryModel)) {
    return mapping.primaryModel;
  }
  
  // Try fallbacks
  for (const fallback of mapping.fallbackModels) {
    if (availableModels.has(fallback)) {
      return fallback;
    }
  }
  
  // Last resort
  return 'llama3.2:3b';
}

/**
 * Get models suitable for a specific task type
 */
export function getModelsForTask(taskType: string): string[] {
  return Object.values(MODEL_REGISTRY)
    .filter(m => m.specializations.includes(taskType))
    .sort((a, b) => {
      const priorityOrder = { primary: 0, secondary: 1, fallback: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .map(m => m.id);
}

/**
 * Get inference options for a model
 */
export function getInferenceOptions(modelId: string, overrides?: Partial<ModelConfig>) {
  const config = MODEL_REGISTRY[modelId] ?? MODEL_REGISTRY['qwen3:32b'];
  
  // Default values if config is still undefined
  const defaults: ModelConfig = {
    id: 'default',
    name: 'Default',
    description: 'Default configuration',
    contextWindow: 8192,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: [],
    ramRequired: '4GB+',
    priority: 'fallback',
  };
  
  const finalConfig = config ?? defaults;
  
  return {
    temperature: overrides?.temperature ?? finalConfig.temperature,
    top_p: overrides?.topP ?? finalConfig.topP,
    top_k: overrides?.topK ?? finalConfig.topK,
    repeat_penalty: overrides?.repeatPenalty ?? finalConfig.repeatPenalty,
    num_predict: overrides?.numPredict ?? finalConfig.numPredict,
    num_ctx: finalConfig.contextWindow,
  };
}

/**
 * Check if a model should use Chain of Thought for an agent
 */
export function shouldUseChainOfThought(agentCode: string): boolean {
  const mapping = getAgentMapping(agentCode);
  return mapping?.useChainOfThought ?? false;
}

/**
 * Check if a model should use Ensemble for an agent
 */
export function shouldUseEnsemble(agentCode: string): boolean {
  const mapping = getAgentMapping(agentCode);
  return mapping?.useEnsemble ?? false;
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

// =============================================================================
// VERTICAL INDUSTRY AGENT MAPPINGS
// =============================================================================

export const VERTICAL_AGENT_MAPPINGS: AgentModelMapping[] = [
  // FINANCIAL SERVICES (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'fin-risk-sentinel', agentName: 'RiskSentinel', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Quantify all risks with probability and impact. Reference VaR and stress testing.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'fin-alpha-hunter', agentName: 'AlphaHunter', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Identify alpha opportunities with clear risk/reward profiles.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'fin-compliance-guardian', agentName: 'ComplianceGuardian', primaryModel: 'qwen3:32b', fallbackModels: ['deepseek-r1:32b'], systemPromptEnhancements: 'Cite specific regulations. Flag potential violations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'fin-market-pulse', agentName: 'MarketPulse', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Process market data in real-time. Provide actionable signals.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // HEALTHCARE (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'hc-care-coordinator', agentName: 'CareCoordinator', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure continuity of care. Reference clinical protocols and HIPAA.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'hc-clinical-advisor', agentName: 'ClinicalAdvisor', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Base recommendations on evidence. Flag contraindications.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'hc-capacity-oracle', agentName: 'CapacityOracle', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize resource utilization. Predict demand.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'hc-quality-sentinel', agentName: 'QualitySentinel', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Monitor safety events. Reference quality frameworks.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // MANUFACTURING (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'mfg-production-master', agentName: 'ProductionMaster', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize OEE. Identify bottlenecks with ROI estimates.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'mfg-predict-maintain', agentName: 'PredictMaintain', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze sensor data. Predict failures with confidence intervals.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'mfg-quality-vision', agentName: 'QualityVision', primaryModel: 'qwen3-vl:30b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Detect defects with precision. Perform root cause analysis.', optimalTemperature: 0.2, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'mfg-supply-sync', agentName: 'SupplySync', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize inventory levels. Predict disruptions.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // TECHNOLOGY (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'tech-site-reliability', agentName: 'SiteReliability', primaryModel: 'qwen3-coder:30b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Monitor system health. Correlate incidents.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'tech-security-fortress', agentName: 'SecurityFortress', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Detect threats. Assess vulnerabilities using NIST/ISO frameworks.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'tech-dev-velocity', agentName: 'DevVelocity', primaryModel: 'qwen3-coder:30b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize development workflows. Reduce cycle time.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'tech-data-architect', agentName: 'DataArchitect', primaryModel: 'qwen3-coder:30b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Design scalable data architectures. Optimize queries.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },

  // ENERGY (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'eng-grid-balancer', agentName: 'GridBalancer', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Balance load and generation. Predict demand.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'eng-renewable-optimizer', agentName: 'RenewableOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize renewable output. Forecast weather impacts.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'eng-asset-guardian', agentName: 'AssetGuardian', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Monitor asset health. Predict failures.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'eng-demand-response', agentName: 'DemandResponse', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Coordinate demand response. Optimize programs.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // GOVERNMENT (Updated Jan 2026 for 16GB VRAM)
  { agentCode: 'gov-policy-advisor', agentName: 'PolicyAdvisor', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze policy impacts. Provide evidence-based recommendations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'gov-citizen-engage', agentName: 'CitizenEngage', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Improve citizen experience. Route services efficiently.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'gov-budget-optimizer', agentName: 'BudgetOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Optimize budget allocation. Track spending efficiency.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'gov-transparency-engine', agentName: 'TransparencyEngine', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure transparency. Process records requests.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },

  // LOGISTICS
  { agentCode: 'log-route-optimizer', agentName: 'RouteOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize routes dynamically. Consider traffic and time windows.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'log-warehouse-brain', agentName: 'WarehouseBrain', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize warehouse operations. Improve pick efficiency.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'log-demand-predictor', agentName: 'DemandPredictor', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Forecast demand accurately. Consider seasonality.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'log-carrier-manager', agentName: 'CarrierManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize carrier selection. Benchmark rates.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // RETAIL & HOSPITALITY - 22 Agents
  { agentCode: 'ret-merchandising-ai', agentName: 'MerchandisingAI', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize product mix. Maximize sales per square foot.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ret-pricing-engine', agentName: 'PricingEngine', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize prices dynamically. Consider elasticity and competition.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ret-customer-insight', agentName: 'CustomerInsight', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Understand customer behavior. Predict churn.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ret-omni-sync', agentName: 'OmniSync', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Synchronize channels. Optimize fulfillment.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-supply-chain', agentName: 'RetailSupplyChain', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize retail supply chain. Ensure right product, right place, right time.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-ecommerce', agentName: 'EcommerceManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive digital commerce excellence. Optimize conversion and customer experience.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-cx', agentName: 'RetailCX', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Delight every customer. Drive loyalty and NPS through exceptional experiences.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-marketing', agentName: 'RetailMarketing', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive traffic and conversion. Execute marketing campaigns and promotions.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-private-label', agentName: 'PrivateLabel', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop private label strategy. Drive margin through owned brands.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-lp', agentName: 'LossPrevention', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Protect assets. Reduce shrink through prevention and detection.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-hr', agentName: 'RetailHR', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build engaged retail workforce. Optimize scheduling and labor.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-real-estate', agentName: 'RetailRealEstate', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize store portfolio. Make location decisions that drive traffic.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-category', agentName: 'CategoryManager', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize category assortment. Drive category growth through data-driven decisions.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'retail-pricing', agentName: 'RetailPricing', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Balance competitive pricing with profitability. Optimize markdowns.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'hospitality-operations', agentName: 'HospitalityOps', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver exceptional guest experiences. Optimize hotel and hospitality operations.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'restaurant-operations', agentName: 'RestaurantOps', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver great food and service. Optimize restaurant operations and consistency.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-franchise', agentName: 'FranchiseOps', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure consistent brand experience. Support franchisee success.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-analytics', agentName: 'RetailAnalytics', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Transform retail data into insights. Drive data-driven retail decisions.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'retail-sustainability', agentName: 'RetailSustainability', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive sustainable retail. Lead ESG and responsible sourcing initiatives.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-technology', agentName: 'RetailTechnology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable technology-driven retail. Drive digital transformation and innovation.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-vendor', agentName: 'VendorManagement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build strategic vendor partnerships. Optimize negotiations and performance.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'retail-cfo', agentName: 'RetailFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Drive profitable retail growth. Optimize margin and capital allocation.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },

  // REAL ESTATE / CONSTRUCTION - 23 Agents
  { agentCode: 're-development', agentName: 'DevelopmentStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Lead real estate development. Optimize project feasibility and execution.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-construction', agentName: 'ConstructionManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver projects on time and budget. Manage construction quality and safety.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-property', agentName: 'PropertyManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize property performance. Optimize tenant satisfaction and NOI.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-investment', agentName: 'REInvestment', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Drive risk-adjusted returns. Make disciplined investment decisions.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-leasing', agentName: 'LeasingStrategy', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize occupancy and NOI. Optimize tenant mix and lease terms.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-asset-mgmt', agentName: 'AssetManagement', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Maximize asset value. Drive value creation through active management.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-capital-markets', agentName: 'RECapitalMarkets', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize capital structure. Manage debt, equity, and investor relations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-research', agentName: 'REResearch', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Provide market insights. Analyze trends and competitive intelligence.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-facilities', agentName: 'FacilitiesManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure efficient, safe building operations. Optimize maintenance and services.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-sustainability', agentName: 'RESustainability', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive sustainable buildings. Lead ESG and green building initiatives.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-brokerage', agentName: 'CommercialBrokerage', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Close deals. Provide transaction advisory and brokerage services.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-residential', agentName: 'ResidentialDev', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build communities. Lead residential development and homebuilding.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-industrial', agentName: 'IndustrialLogistics', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable supply chains. Develop industrial and logistics real estate.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-retail', agentName: 'RetailRE', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Create retail destinations. Optimize tenant mix and experiential retail.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-office', agentName: 'OfficeStrategy', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead workspace of the future. Adapt to changing workplace needs.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-multifamily', agentName: 'Multifamily', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Create great places to live. Optimize multifamily investment and operations.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-hospitality', agentName: 'HospitalityRE', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize RevPAR. Lead hotel investment and hospitality real estate.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-land', agentName: 'LandEntitlement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Unlock land value. Navigate entitlement and zoning processes.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-project-finance', agentName: 'REProjectFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Structure deals optimally. Manage construction financing and project finance.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-proptech', agentName: 'PropTech', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive technology-enabled real estate. Lead PropTech innovation.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-valuation', agentName: 'Valuation', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Provide accurate valuations. Analyze market value and highest/best use.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-risk', agentName: 'RERisk', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Manage risk and protect value. Analyze portfolio and climate risk.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-legal', agentName: 'RELegal', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect transactions. Manage real estate legal and compliance.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // TRANSPORTATION / LOGISTICS - 19 Agents
  { agentCode: 'trans-fleet', agentName: 'FleetManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize fleet utilization. Optimize maintenance and asset management.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-routing', agentName: 'RouteOptimizer', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize routes for efficiency. Balance cost and service levels.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'trans-logistics', agentName: 'LogisticsOps', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Move goods efficiently. Optimize warehouse and distribution operations.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-compliance', agentName: 'TransCompliance', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure safe, legal, compliant operations. Manage DOT and safety programs.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-freight', agentName: 'FreightManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Move freight profitably. Optimize carrier management and rates.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-drivers', agentName: 'DriverManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build safe, productive driver workforce. Optimize recruitment and retention.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-safety', agentName: 'TransSafety', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Achieve zero accidents. Lead safety programs and culture.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-supply-chain', agentName: 'SupplyChainStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize end-to-end supply chain. Drive visibility and network optimization.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'trans-last-mile', agentName: 'LastMile', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Delight customers with delivery. Optimize last mile experience.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-technology', agentName: 'TransTechnology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable technology-driven logistics. Drive TMS and digital transformation.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-international', agentName: 'InternationalLogistics', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable global trade. Manage international shipping and customs.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-carrier', agentName: 'CarrierRelations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build strategic carrier partnerships. Ensure capacity and service.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-finance', agentName: 'TransFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Drive profitable operations. Optimize cost per mile and pricing.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'trans-customer', agentName: 'TransCustomer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Exceed customer expectations. Manage service and claims.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-sustainability', agentName: 'TransSustainability', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive green logistics. Lead emissions reduction and sustainability.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-rail', agentName: 'RailOps', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize rail operations. Manage intermodal and rail logistics.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-air', agentName: 'AirCargo', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver speed and reliability. Manage air freight and express.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-ocean', agentName: 'OceanFreight', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable global trade. Manage ocean freight and maritime logistics.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'trans-analytics', agentName: 'TransAnalytics', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Drive data-driven decisions. Transform transportation data into insights.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },

  // EDUCATION
  { agentCode: 'edu-student-success', agentName: 'StudentSuccess', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Identify at-risk students early. Recommend interventions.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-learning-advisor', agentName: 'LearningAdvisor', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Personalize learning paths. Recommend content.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-enrollment-optimizer', agentName: 'EnrollmentOptimizer', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize recruitment funnel. Predict yield.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-workforce-connector', agentName: 'WorkforceConnector', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Match students to opportunities. Analyze skills gaps.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // LEGAL / LAW FIRMS - 14 Agents (8 Default + 6 Specialists)
  // Default Agents (8)
  { agentCode: 'leg-matter-lead', agentName: 'MatterLead', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b', 'qwen3:32b'], systemPromptEnhancements: 'Orchestrate matter strategy. Coordinate all legal agents. Track deadlines and deliverables. Reference ABA Model Rules.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-research-counsel', agentName: 'ResearchCounsel', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Conduct legal research with citation enforcement. Only cite from ingested case law library. No-source-no-claim rule applies.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-contract-counsel', agentName: 'ContractCounsel', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Analyze and draft contracts. Apply playbook rules. Identify fallback positions. Reference UCC and common law principles.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-litigation-strategist', agentName: 'LitigationStrategist', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b', 'qwen3:32b'], systemPromptEnhancements: 'Develop case theory and trial strategy. Analyze strengths and weaknesses. Reference FRCP/state rules. Predict outcomes with confidence levels.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: true },
  { agentCode: 'leg-risk-counsel', agentName: 'RiskCounsel', primaryModel: 'deepseek-r1:32b', fallbackModels: ['deepseek-r1:32b', 'qwen3:32b'], systemPromptEnhancements: 'Assess legal risks with probability and impact. Identify exposure. Recommend mitigation strategies. Quantify potential liability.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-opposing-counsel', agentName: 'OpposingCounsel', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b', 'qwen3:32b'], systemPromptEnhancements: 'RED TEAM: Argue opposing position vigorously. Find weaknesses in our case. Anticipate counterarguments. Challenge assumptions.', optimalTemperature: 0.6, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-privilege-officer', agentName: 'PrivilegeOfficer', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Review documents for attorney-client privilege and work product. Apply privilege gates. Maintain audit trail. Reference Rule 1.6 and Upjohn.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-evidence-officer', agentName: 'EvidenceOfficer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.3:70b', 'llama3.2:3b'], systemPromptEnhancements: 'Manage evidence chain of custody. Organize exhibits. Track discovery obligations. Ensure FRE compliance.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  
  // Optional Specialist Agents (6)
  { agentCode: 'leg-ip-specialist', agentName: 'IPSpecialist', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Analyze patents, trademarks, copyrights. Reference USPTO/EPO procedures. Assess infringement risk. Evaluate portfolio strength.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-ma-specialist', agentName: 'MASpecialist', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b', 'qwen3:32b'], systemPromptEnhancements: 'Conduct M&A due diligence. Review data rooms. Identify deal risks. Draft transaction documents. Reference Hart-Scott-Rodino.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: true },
  { agentCode: 'leg-regulatory-specialist', agentName: 'RegulatorySpecialist', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Monitor regulatory changes. Assess compliance obligations. Cite CFR sections. Track enforcement trends.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-employment-specialist', agentName: 'EmploymentSpecialist', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Advise on employment law matters. Reference FLSA, Title VII, ADA, FMLA. Assess discrimination risk. Review policies.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-tax-specialist', agentName: 'TaxSpecialist', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Analyze tax implications. Reference IRC sections. Optimize structures. Assess audit risk. Consider state and international tax.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-international-specialist', agentName: 'InternationalSpecialist', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b', 'llama3.3:70b'], systemPromptEnhancements: 'Handle cross-border matters. Reference treaties and conventions. Consider jurisdiction and choice of law. Assess FCPA/sanctions risk.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // REAL ESTATE
  { agentCode: 're-valuation-engine', agentName: 'ValuationEngine', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Value properties accurately. Analyze comparables.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-lease-optimizer', agentName: 'LeaseOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize rent. Abstract lease terms.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-property-manager', agentName: 'PropertyManager', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage work orders. Schedule maintenance.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-investment-analyst', agentName: 'InvestmentAnalyst', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Model DCF. Assess risks.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // INSURANCE
  { agentCode: 'ins-underwriting-ai', agentName: 'UnderwritingAI', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Score risks accurately. Calculate premiums.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ins-claims-processor', agentName: 'ClaimsProcessor', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Triage claims efficiently. Estimate reserves.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ins-fraud-detector', agentName: 'FraudDetector', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Identify suspicious patterns. Score fraud likelihood.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ins-actuarial-engine', agentName: 'ActuarialEngine', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Develop loss triangles. Estimate IBNR.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },

  // SPORTS / ATHLETICS - 25 Agents
  { agentCode: 'sports-performance', agentName: 'PerformanceAnalyst', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze athletic performance metrics. Optimize training loads. Prevent injuries through data analysis.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-scouting', agentName: 'ScoutingDirector', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Evaluate player talent. Analyze draft prospects. Assess fit with team system and culture.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-gm', agentName: 'GeneralManager', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Lead roster decisions. Manage salary cap. Balance short-term and long-term team building.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: true },
  { agentCode: 'sports-business', agentName: 'BusinessOperations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize franchise value. Optimize revenue streams. Drive fan engagement and sponsorships.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-medical', agentName: 'SportsMedicine', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Prioritize athlete health. Manage injury treatment and rehabilitation. Enforce return-to-play protocols.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-coaching', agentName: 'CoachingStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Develop game strategy. Analyze opponents. Make tactical adjustments. Maximize competitive advantage.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: true },
  { agentCode: 'sports-analytics', agentName: 'SportsAnalytics', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Transform data into insights. Develop advanced metrics. Build predictive models for performance.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-contracts', agentName: 'ContractNegotiator', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Negotiate player contracts. Manage salary cap implications. Structure deals for flexibility.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-fan-experience', agentName: 'FanExperience', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Create memorable fan experiences. Optimize game day operations. Drive loyalty and engagement.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-marketing', agentName: 'SportsMarketing', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build team brand. Execute marketing campaigns. Drive digital engagement and social media.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-venue', agentName: 'VenueOperations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage stadium operations. Ensure safety and security. Optimize event execution.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-player-dev', agentName: 'PlayerDevelopment', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop player potential. Manage minor league systems. Build talent pipeline.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-cfo', agentName: 'SportsFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Manage team finances. Optimize budgets. Ensure financial sustainability and profitability.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-legal', agentName: 'SportsLegal', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect organization legally. Manage contracts and compliance. Handle labor relations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'sports-media', agentName: 'MediaRelations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage media relationships. Control narrative. Handle crisis communications.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-partnerships', agentName: 'SponsorshipPartner', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop sponsorship relationships. Activate partnerships. Maximize mutual value.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-tickets', agentName: 'TicketSales', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize ticket revenue. Optimize pricing. Drive season ticket sales and renewals.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-strength', agentName: 'StrengthConditioning', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Design training programs. Optimize physical preparation. Manage recovery and periodization.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-nutrition', agentName: 'SportsNutrition', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize athlete nutrition. Plan meals and hydration. Support performance and recovery.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-psychology', agentName: 'SportsPsychology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop mental performance. Support team dynamics. Help athletes manage pressure.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-youth', agentName: 'YouthDevelopment', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build youth programs. Identify young talent. Create development pathways.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-community', agentName: 'CommunityRelations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build community relationships. Execute charitable programs. Drive social responsibility.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-esports', agentName: 'EsportsGaming', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop esports initiatives. Engage gaming audiences. Build digital competition presence.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'sports-technology', agentName: 'SportsTechnology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive technology innovation. Implement wearables and data systems. Create competitive advantage.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },

  // HIGHER EDUCATION - 21 Agents
  { agentCode: 'edu-enrollment', agentName: 'EnrollmentManager', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize enrollment strategy. Manage admissions funnel. Maximize yield and retention.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-academic', agentName: 'AcademicAffairs', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead academic programs. Ensure educational quality. Support faculty and curriculum development.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-student-success-lead', agentName: 'StudentSuccessLead', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Support student success. Drive retention. Provide advising and career services.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-research', agentName: 'ResearchAdmin', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Enable research excellence. Manage grants and compliance. Support technology transfer.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-cfo', agentName: 'EducationFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Ensure financial sustainability. Manage budgets and endowment. Optimize tuition strategy.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-advancement', agentName: 'Advancement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive fundraising success. Build alumni relationships. Execute capital campaigns.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-facilities', agentName: 'CampusFacilities', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage campus facilities. Plan capital projects. Ensure sustainability and safety.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-cio', agentName: 'EducationIT', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead IT strategy. Enable learning technology. Ensure cybersecurity and data analytics.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-athletics', agentName: 'AthleticsDirector', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead athletic programs. Ensure NCAA compliance. Support student-athlete success.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-online', agentName: 'OnlineEducation', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop online programs. Ensure quality in distance learning. Optimize digital pedagogy.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-student-affairs', agentName: 'StudentAffairs', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Support student life. Manage housing and wellness. Enable co-curricular development.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-dei', agentName: 'CampusDEI', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead diversity and inclusion. Build inclusive campus community. Ensure equitable access.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-hr', agentName: 'EducationHR', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Attract and retain talent. Manage faculty and staff. Optimize compensation and benefits.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-communications', agentName: 'UniversityComms', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Tell the institution story. Manage brand and media relations. Handle crisis communications.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-legal', agentName: 'EducationLegal', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect the institution. Ensure compliance with Title IX and regulations. Manage risk.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-strategy', agentName: 'StrategicPlanning', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Shape institutional future. Lead strategic planning. Ensure accreditation and effectiveness.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-graduate', agentName: 'GraduateEducation', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Lead graduate programs. Support doctoral education and research training.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-continuing', agentName: 'ContinuingEducation', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Serve lifelong learners. Develop workforce training. Build corporate partnerships.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-international', agentName: 'InternationalEd', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build global engagement. Manage study abroad and international students. Develop partnerships.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-safety', agentName: 'CampusSafety', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure campus safety. Manage emergency response. Conduct threat assessment.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-library', agentName: 'LibraryServices', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable discovery and research. Manage collections and digital resources.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },

  // MEDIA & ENTERTAINMENT - 23 Agents
  { agentCode: 'media-content', agentName: 'ContentStrategy', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop content strategy. Understand audience needs. Make programming decisions.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-analytics', agentName: 'AudienceAnalytics', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze audience data. Measure engagement. Build predictive models for content performance.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'media-rights', agentName: 'RightsManagement', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect and monetize IP. Manage licensing and distribution rights. Track royalties.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'media-ad-ops', agentName: 'AdOperations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize ad revenue. Optimize yield and inventory. Manage programmatic operations.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-production', agentName: 'ProductionManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver content on time and budget. Manage production schedules and resources.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-distribution', agentName: 'Distribution', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize content reach. Optimize platform strategy and syndication.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-talent', agentName: 'TalentManagement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Attract and retain creative talent. Manage contracts and partnerships.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-streaming', agentName: 'StreamingStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Drive streaming growth. Optimize subscriber acquisition and retention. Plan content investment.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'media-marketing', agentName: 'MediaMarketing', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build audiences. Execute marketing campaigns. Drive engagement and brand awareness.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-social', agentName: 'SocialMedia', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Engage social audiences. Manage community. Build influencer relationships.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-gaming', agentName: 'GamingEsports', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Develop gaming and esports strategy. Engage gaming communities.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-music', agentName: 'MusicStrategy', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Discover and develop artists. Manage catalog and streaming strategy.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-events', agentName: 'LiveEvents', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Create unforgettable live experiences. Manage concerts, festivals, and events.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-news', agentName: 'NewsJournalism', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Uphold truth and accuracy. Lead editorial strategy and journalism standards.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-publishing', agentName: 'Publishing', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Discover and publish great stories. Manage acquisitions and editorial.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-podcasting', agentName: 'Podcasting', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build loyal podcast audiences. Optimize production and monetization.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-technology', agentName: 'MediaTechnology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable media scale through technology. Drive digital transformation.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-partnerships', agentName: 'MediaPartnerships', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build strategic alliances. Develop co-productions and licensing deals.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-cfo', agentName: 'MediaFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Ensure profitable content investment. Manage budgets and ROI analysis.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'media-legal', agentName: 'MediaLegal', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect creative assets. Manage IP and contracts. Ensure regulatory compliance.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'media-operations', agentName: 'MediaOperations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable efficient media operations. Optimize workflows and resources.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'media-brand', agentName: 'BrandPartnerships', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Create authentic brand integrations. Manage sponsorships and branded content.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // PROFESSIONAL SERVICES - 23 Agents
  { agentCode: 'ps-engagement', agentName: 'EngagementManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Deliver value to clients. Manage project delivery and quality assurance.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-practice', agentName: 'PracticeDevelopment', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Grow practice expertise. Drive business development and thought leadership.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-talent', agentName: 'TalentManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Attract, develop, and retain talent. Optimize utilization and career paths.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-quality-risk', agentName: 'QualityRisk', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Protect firm reputation. Manage quality control and risk. Ensure independence.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-client-dev', agentName: 'ClientDevelopment', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Grow client relationships. Drive account growth and cross-selling.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-knowledge', agentName: 'KnowledgeManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Leverage collective knowledge. Manage best practices and intellectual capital.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-pricing', agentName: 'PricingStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Capture value through pricing. Optimize fee arrangements and profitability.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-operations', agentName: 'FirmOperations', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable efficient operations. Optimize processes and administration.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-technology', agentName: 'PSTechnology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Enable technology-driven services. Drive digital transformation and automation.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-cfo', agentName: 'FirmFinance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Ensure profitable growth. Manage firm finances and partner compensation.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-marketing', agentName: 'PSMarketing', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build firm brand. Drive thought leadership and marketing campaigns.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-learning', agentName: 'LearningDevelopment', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Build professional capabilities. Manage training and career development.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-dei', agentName: 'PSDEI', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive inclusive excellence. Lead diversity, equity, and inclusion initiatives.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-partner-mgmt', agentName: 'PartnerManagement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage partner performance and compensation. Lead governance and succession.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-legal', agentName: 'FirmLegal', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Protect the firm. Manage legal risk and regulatory compliance.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-innovation', agentName: 'PSInnovation', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Drive service innovation. Develop new offerings and business models.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-strategy', agentName: 'FirmStrategy', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Set strategic direction. Drive market positioning and competitive advantage.', optimalTemperature: 0.5, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-project-mgmt', agentName: 'ProjectManagement', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure successful delivery. Manage projects, resources, and milestones.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-methodology', agentName: 'Methodology', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Provide structured problem-solving. Apply consulting frameworks and methodologies.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ps-audit', agentName: 'AuditAssurance', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Provide independent assurance. Conduct audits with professional skepticism.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-tax', agentName: 'TaxAdvisory', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Provide tax-efficient strategies. Ensure compliance and optimize structures.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ps-transaction', agentName: 'TransactionAdvisory', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Ensure deal success. Conduct due diligence and support transactions.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: true },
  { agentCode: 'ps-restructuring', agentName: 'Restructuring', primaryModel: 'deepseek-r1:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Restore value in distressed situations. Lead turnaround and restructuring.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
];

// Combined agent mappings (C-Suite + Vertical)
export const ALL_AGENT_MAPPINGS: AgentModelMapping[] = [
  ...AGENT_MODEL_MAPPINGS,
  ...VERTICAL_AGENT_MAPPINGS,
];

export const MODEL_ZOO_SUMMARY = {
  totalModels: Object.keys(MODEL_REGISTRY).length,
  primaryModels: Object.values(MODEL_REGISTRY).filter(m => m.priority === 'primary').length,
  agentMappings: ALL_AGENT_MAPPINGS.length,
  cSuiteAgents: AGENT_MODEL_MAPPINGS.length,
  verticalAgents: VERTICAL_AGENT_MAPPINGS.length,
  specializationsAvailable: [...new Set(Object.values(MODEL_REGISTRY).flatMap(m => m.specializations))],
  averageSovereigntyScore: Object.values(MODEL_REGISTRY)
    .filter(m => m.sovereigntyScore)
    .reduce((sum, m) => sum + (m.sovereigntyScore || 0), 0) / 
    Object.values(MODEL_REGISTRY).filter(m => m.sovereigntyScore).length || 10,
};

/**
 * Build a complete system prompt with sovereignty directive
 */
export function buildSovereignSystemPrompt(
  agentCode: string,
  basePrompt: string,
  options?: { jsonMode?: boolean; includeChainOfThought?: boolean }
): string {
  const mapping = getAgentMapping(agentCode);
  const parts: string[] = [SOVEREIGNTY_META_PROMPT];
  
  // Add agent-specific enhancements
  if (mapping?.systemPromptEnhancements) {
    parts.push(`\n## AGENT-SPECIFIC DIRECTIVE\n${mapping.systemPromptEnhancements}`);
  }
  
  // Add sovereignty directive if present
  if (mapping?.sovereigntyDirective) {
    parts.push(`\n## SOVEREIGNTY FOCUS\n${mapping.sovereigntyDirective}`);
  }
  
  // Add JSON discipline if requested
  if (options?.jsonMode || mapping?.jsonOutputRequired) {
    const model = mapping ? MODEL_REGISTRY[mapping.primaryModel] : null;
    const discipline = model?.jsonDiscipline || 'standard';
    parts.push(`\n${JSON_DISCIPLINE[discipline]}`);
  }
  
  // Add chain of thought instruction
  if (options?.includeChainOfThought || mapping?.useChainOfThought) {
    parts.push(`\n## REASONING APPROACH\nThink step-by-step. Show your work. Number your reasoning steps.`);
  }
  
  // Add the base prompt
  parts.push(`\n## YOUR TASK\n${basePrompt}`);
  
  return parts.join('\n');
}

/**
 * Get JSON discipline prompt for a model
 */
export function getJsonDisciplinePrompt(modelId: string): string {
  const config = MODEL_REGISTRY[modelId];
  const discipline = config?.jsonDiscipline || 'standard';
  return JSON_DISCIPLINE[discipline];
}
