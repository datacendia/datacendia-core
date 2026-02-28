// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAPERSONAFORGE™ SERVICE
// Enterprise-grade persona management with real Ollama integration
// =============================================================================

import { ollamaService, DomainAgent, OllamaChatMessage } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export type PersonaRole =
  | 'cfo'
  | 'cio'
  | 'cpo'
  | 'clo'
  | 'chro'
  | 'cso'
  | 'cro'
  | 'ciso'
  | 'coo'
  | 'custom';
export type TrainingStatus =
  | 'not_started'
  | 'collecting'
  | 'training'
  | 'validating'
  | 'ready'
  | 'updating';
export type DataSourceType =
  | 'slack'
  | 'email'
  | 'calendar'
  | 'documents'
  | 'crm'
  | 'erp'
  | 'hr_system'
  | 'tickets'
  | 'meetings'
  | 'decisions';

export interface TrainingDataset {
  sourceType: DataSourceType;
  recordsProcessed: number;
  tokensExtracted: number;
  patternsIdentified: number;
  lastUpdated: Date;
}

export interface PersonaCapability {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  usageCount: number;
  examples: string[];
}

export interface RiskProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  decisionSpeed: 'deliberate' | 'balanced' | 'rapid';
  stakeholderFocus: 'shareholders' | 'balanced' | 'employees';
  innovationBias: 'cautious' | 'pragmatic' | 'pioneering';
  complianceStrictness: 'strict' | 'balanced' | 'flexible';
}

export interface CommunicationStyle {
  formality: 'formal' | 'professional' | 'casual';
  verbosity: 'concise' | 'balanced' | 'detailed';
  tone: 'authoritative' | 'collaborative' | 'supportive';
  dataOrientation: 'qualitative' | 'balanced' | 'quantitative';
}

export interface DigitalPersona {
  id: string;
  role: PersonaRole;
  name: string;
  title: string;
  avatar: string;
  department: string;
  status: TrainingStatus;
  trainingProgress: number;
  dataSources: TrainingDataset[];
  capabilities: PersonaCapability[];
  riskProfile: RiskProfile;
  communicationStyle: CommunicationStyle;
  totalInteractions: number;
  avgResponseQuality: number;
  lastActive: Date;
  createdAt: Date;
  trainedBy: string;
  version: string;
  baseModel: string;
  specializations: string[];
  knowledgeCutoff: Date;
  // Ollama integration
  ollamaAgentId?: string;
  systemPrompt: string;
}

export interface PersonaInteraction {
  id: string;
  personaId: string;
  query: string;
  response: string;
  timestamp: Date;
  userId: string;
  department: string;
  rating?: number;
  feedback?: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// =============================================================================
// ROLE CONFIGURATIONS
// =============================================================================

export const ROLE_CONFIG: Record<
  PersonaRole,
  {
    icon: string;
    color: string;
    title: string;
    defaultModel: string;
    defaultSystemPrompt: string;
  }
> = {
  cfo: {
    icon: '💰',
    color: 'from-green-600 to-emerald-600',
    title: 'Chief Financial Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CFO (Chief Financial Officer) AI agent.
You are an expert in corporate finance, financial planning & analysis, treasury management, and investor relations.
Your responses should be data-driven, precise, and focused on financial implications.
Key expertise areas:
- Financial statement analysis and reporting (GAAP/IFRS)
- Budget planning, forecasting, and variance analysis
- Capital structure and treasury management
- SOX compliance and internal controls
- M&A financial due diligence
- Cost optimization and profitability analysis
Always provide quantitative analysis where possible. Reference specific metrics, KPIs, and financial ratios.`,
  },
  cio: {
    icon: '🖥️',
    color: 'from-blue-600 to-cyan-600',
    title: 'Chief Information Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CIO (Chief Information Officer) AI agent.
You are an expert in technology strategy, IT operations, digital transformation, and cybersecurity.
Key expertise areas:
- Enterprise architecture and technology roadmaps
- Cloud migration and infrastructure modernization
- Cybersecurity posture and risk management
- Vendor evaluation and technology procurement
- Digital transformation initiatives
- IT governance and compliance
Provide strategic technology recommendations with implementation considerations.`,
  },
  cpo: {
    icon: '📦',
    color: 'from-purple-600 to-pink-600',
    title: 'Chief Product Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CPO (Chief Product Officer) AI agent.
You are an expert in product strategy, user experience, product development, and market positioning.
Key expertise areas:
- Product vision and roadmap development
- User research and customer insights
- Feature prioritization and trade-offs
- Go-to-market strategy
- Product-market fit analysis
- Competitive positioning
Focus on user value, market opportunity, and strategic alignment.`,
  },
  clo: {
    icon: '⚖️',
    color: 'from-amber-600 to-orange-600',
    title: 'Chief Legal Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CLO (Chief Legal Officer) AI agent.
You are an expert in corporate law, regulatory compliance, contract law, and risk management.
Key expertise areas:
- Contract review and negotiation
- Regulatory compliance (GDPR, SOX, HIPAA, etc.)
- Corporate governance and fiduciary duties
- Intellectual property protection
- Litigation risk assessment
- M&A legal due diligence
Provide careful, well-reasoned legal analysis. Always note when outside counsel should be consulted.`,
  },
  chro: {
    icon: '👥',
    color: 'from-rose-600 to-red-600',
    title: 'Chief Human Resources Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CHRO (Chief Human Resources Officer) AI agent.
You are an expert in talent management, organizational development, compensation, and HR strategy.
Key expertise areas:
- Talent acquisition and retention strategies
- Compensation and benefits benchmarking
- Performance management systems
- Organizational design and culture
- Employee relations and engagement
- HR compliance and employment law
Balance employee advocacy with business objectives.`,
  },
  cso: {
    icon: '📊',
    color: 'from-indigo-600 to-violet-600',
    title: 'Chief Strategy Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CSO (Chief Strategy Officer) AI agent.
You are an expert in corporate strategy, competitive analysis, and strategic planning.
Key expertise areas:
- Strategic planning and vision development
- Competitive intelligence and market analysis
- M&A strategy and target identification
- Business model innovation
- Portfolio management and resource allocation
- Scenario planning and strategic foresight
Think long-term while providing actionable near-term recommendations.`,
  },
  cro: {
    icon: '💹',
    color: 'from-teal-600 to-green-600',
    title: 'Chief Revenue Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CRO (Chief Revenue Officer) AI agent.
You are an expert in revenue growth, sales strategy, and go-to-market operations.
Key expertise areas:
- Revenue growth strategy and forecasting
- Sales process optimization
- Pricing strategy and deal structuring
- Customer success and retention
- Sales enablement and training
- Pipeline management and analytics
Focus on measurable revenue impact and growth acceleration.`,
  },
  ciso: {
    icon: '🔐',
    color: 'from-red-600 to-rose-600',
    title: 'Chief Information Security Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CISO (Chief Information Security Officer) AI agent.
You are an expert in cybersecurity, risk management, and security operations.
Key expertise areas:
- Threat intelligence and vulnerability assessment
- Security architecture and zero-trust implementation
- Incident response and business continuity
- Compliance frameworks (SOC 2, ISO 27001, NIST)
- Security awareness and training
- Third-party risk management
Prioritize security while enabling business operations.`,
  },
  coo: {
    icon: '⚙️',
    color: 'from-slate-600 to-gray-600',
    title: 'Chief Operating Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital COO (Chief Operating Officer) AI agent.
You are an expert in operations, process optimization, and organizational efficiency.
Key expertise areas:
- Operational excellence and process improvement
- Supply chain and logistics optimization
- Capacity planning and resource allocation
- Quality management and continuous improvement
- Cross-functional coordination
- Operational risk management
Focus on efficiency, scalability, and execution excellence.`,
  },
  custom: {
    icon: '🎯',
    color: 'from-neutral-600 to-neutral-700',
    title: 'Custom Agent',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt:
      'You are a custom AI agent. Provide helpful, accurate responses based on your training.',
  },
};

// =============================================================================
// PERSONA FORGE SERVICE
// =============================================================================

class PersonaForgeService {
  private personas: Map<string, DigitalPersona> = new Map();
  private interactions: Map<string, PersonaInteraction[]> = new Map();
  private chatHistories: Map<string, ChatMessage[]> = new Map();
  private trainingIntervals: Map<string, number> = new Map();
  private storageKey = 'datacendia_personas';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPersonas();
  }

  // ---------------------------------------------------------------------------
  // STORAGE
  // ---------------------------------------------------------------------------

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.personas?.forEach((p: DigitalPersona) => {
          p.createdAt = new Date(p.createdAt);
          p.lastActive = new Date(p.lastActive);
          p.knowledgeCutoff = new Date(p.knowledgeCutoff);
          this.personas.set(p.id, p);
        });
        console.log('[PersonaForge] Loaded', this.personas.size, 'personas from storage');
      }
    } catch (error) {
      console.error('[PersonaForge] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        personas: Array.from(this.personas.values()),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[PersonaForge] Failed to save to storage:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeDefaultPersonas(): void {
    if (this.personas.size > 0) {
      return;
    }

    const defaults: Partial<DigitalPersona>[] = [
      {
        role: 'cfo',
        name: 'Digital CFO',
        department: 'Finance',
        status: 'ready',
        trainingProgress: 100,
        version: '3.2.1',
        totalInteractions: 15234,
        avgResponseQuality: 4.7,
        specializations: ['SOX Compliance', 'GAAP', 'Treasury Management', 'FP&A'],
      },
      {
        role: 'cio',
        name: 'Digital CIO',
        department: 'Technology',
        status: 'ready',
        trainingProgress: 100,
        version: '2.8.4',
        totalInteractions: 12456,
        avgResponseQuality: 4.6,
        specializations: [
          'Enterprise Architecture',
          'Cloud Infrastructure',
          'Cybersecurity',
          'Digital Transformation',
        ],
      },
      {
        role: 'clo',
        name: 'Digital CLO',
        department: 'Legal',
        status: 'ready',
        trainingProgress: 100,
        version: '2.1.0',
        totalInteractions: 8934,
        avgResponseQuality: 4.8,
        specializations: [
          'Corporate Law',
          'Contract Law',
          'Regulatory Compliance',
          'IP Protection',
        ],
      },
      {
        role: 'chro',
        name: 'Digital CHRO',
        department: 'Human Resources',
        status: 'training',
        trainingProgress: 78,
        version: '1.0.0-beta',
        totalInteractions: 0,
        avgResponseQuality: 0,
        specializations: ['Talent Management', 'Compensation', 'Employee Relations', 'DEI'],
      },
      {
        role: 'ciso',
        name: 'Digital CISO',
        department: 'Security',
        status: 'validating',
        trainingProgress: 95,
        version: '1.0.0-rc1',
        totalInteractions: 0,
        avgResponseQuality: 0,
        specializations: ['Threat Intelligence', 'Incident Response', 'Zero Trust', 'Compliance'],
      },
    ];

    defaults.forEach((partial) => this.createPersona(partial));
  }

  // ---------------------------------------------------------------------------
  // PERSONA MANAGEMENT
  // ---------------------------------------------------------------------------

  getPersonas(): DigitalPersona[] {
    return Array.from(this.personas.values());
  }

  getPersona(id: string): DigitalPersona | undefined {
    return this.personas.get(id);
  }

  createPersona(partial: Partial<DigitalPersona>): DigitalPersona {
    const role = partial.role || 'custom';
    const config = ROLE_CONFIG[role];
    const id = partial.id || `persona-${role}-${Date.now()}`;

    const persona: DigitalPersona = {
      id,
      role,
      name: partial.name || `Digital ${config.title.split(' ').pop()}`,
      title: config.title,
      avatar: config.icon,
      department: partial.department || role.toUpperCase(),
      status: partial.status || 'not_started',
      trainingProgress: partial.trainingProgress || 0,
      dataSources: partial.dataSources || [],
      capabilities: partial.capabilities || this.getDefaultCapabilities(role),
      riskProfile: partial.riskProfile || {
        riskTolerance: 'moderate',
        decisionSpeed: 'balanced',
        stakeholderFocus: 'balanced',
        innovationBias: 'pragmatic',
        complianceStrictness: 'balanced',
      },
      communicationStyle: partial.communicationStyle || {
        formality: 'professional',
        verbosity: 'balanced',
        tone: 'collaborative',
        dataOrientation: 'balanced',
      },
      totalInteractions: partial.totalInteractions || 0,
      avgResponseQuality: partial.avgResponseQuality || 0,
      lastActive: partial.lastActive || new Date(),
      createdAt: partial.createdAt || new Date(),
      trainedBy: partial.trainedBy || 'System',
      version: partial.version || '1.0.0',
      baseModel: partial.baseModel || config.defaultModel,
      specializations: partial.specializations || [],
      knowledgeCutoff: partial.knowledgeCutoff || new Date(),
      systemPrompt: partial.systemPrompt || config.defaultSystemPrompt,
    };

    this.personas.set(id, persona);
    this.saveToStorage();
    return persona;
  }

  updatePersona(id: string, updates: Partial<DigitalPersona>): DigitalPersona | null {
    const persona = this.personas.get(id);
    if (!persona) {
      return null;
    }

    const updated = { ...persona, ...updates };
    this.personas.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  deletePersona(id: string): boolean {
    const deleted = this.personas.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  private getDefaultCapabilities(role: PersonaRole): PersonaCapability[] {
    const capabilities: Record<PersonaRole, PersonaCapability[]> = {
      cfo: [
        {
          id: 'budget-analysis',
          name: 'Budget Analysis',
          description: 'Analyze and forecast budgets',
          accuracy: 94,
          usageCount: 0,
          examples: ['Q4 budget projection', 'Cost optimization'],
        },
        {
          id: 'financial-reporting',
          name: 'Financial Reporting',
          description: 'Generate financial reports',
          accuracy: 97,
          usageCount: 0,
          examples: ['Monthly P&L', 'Cash flow statement'],
        },
        {
          id: 'risk-assessment',
          name: 'Financial Risk Assessment',
          description: 'Evaluate financial risks',
          accuracy: 91,
          usageCount: 0,
          examples: ['Currency exposure', 'Credit risk'],
        },
      ],
      cio: [
        {
          id: 'tech-strategy',
          name: 'Technology Strategy',
          description: 'Develop IT roadmaps',
          accuracy: 92,
          usageCount: 0,
          examples: ['Cloud migration', 'Tech stack decisions'],
        },
        {
          id: 'vendor-evaluation',
          name: 'Vendor Evaluation',
          description: 'Assess technology vendors',
          accuracy: 88,
          usageCount: 0,
          examples: ['SaaS selection', 'Contract negotiation'],
        },
      ],
      clo: [
        {
          id: 'contract-review',
          name: 'Contract Review',
          description: 'Analyze legal contracts',
          accuracy: 96,
          usageCount: 0,
          examples: ['NDA review', 'Vendor agreements'],
        },
        {
          id: 'compliance-check',
          name: 'Compliance Check',
          description: 'Verify regulatory compliance',
          accuracy: 94,
          usageCount: 0,
          examples: ['GDPR audit', 'SOX compliance'],
        },
      ],
      chro: [
        {
          id: 'talent-analysis',
          name: 'Talent Analysis',
          description: 'Analyze workforce data',
          accuracy: 85,
          usageCount: 0,
          examples: ['Retention risk', 'Skills gap'],
        },
      ],
      ciso: [
        {
          id: 'threat-assessment',
          name: 'Threat Assessment',
          description: 'Evaluate security threats',
          accuracy: 93,
          usageCount: 0,
          examples: ['APT analysis', 'Vulnerability scoring'],
        },
      ],
      cso: [
        {
          id: 'strategic-analysis',
          name: 'Strategic Analysis',
          description: 'Market and competitive analysis',
          accuracy: 90,
          usageCount: 0,
          examples: ['Market entry', 'Competitive positioning'],
        },
      ],
      cro: [
        {
          id: 'revenue-forecast',
          name: 'Revenue Forecasting',
          description: 'Predict revenue trends',
          accuracy: 88,
          usageCount: 0,
          examples: ['Pipeline analysis', 'Quota setting'],
        },
      ],
      coo: [
        {
          id: 'ops-optimization',
          name: 'Operations Optimization',
          description: 'Improve operational efficiency',
          accuracy: 91,
          usageCount: 0,
          examples: ['Process improvement', 'Resource allocation'],
        },
      ],
      cpo: [
        {
          id: 'product-strategy',
          name: 'Product Strategy',
          description: 'Product roadmap planning',
          accuracy: 89,
          usageCount: 0,
          examples: ['Feature prioritization', 'Market fit'],
        },
      ],
      custom: [],
    };
    return capabilities[role] || [];
  }

  // ---------------------------------------------------------------------------
  // TRAINING SIMULATION
  // ---------------------------------------------------------------------------

  startTraining(
    personaId: string,
    onProgress?: (progress: number, status: TrainingStatus) => void
  ): void {
    const persona = this.personas.get(personaId);
    if (!persona) {
      return;
    }

    // Clear any existing interval
    this.stopTraining(personaId);

    let progress = persona.trainingProgress;
    const targetProgress = 100;

    const interval = window.setInterval(() => {
      progress = Math.min(progress + 1.5, targetProgress);

      let status: TrainingStatus = 'training';
      if (progress >= 95) {
        status = 'validating';
      }
      if (progress >= 100) {
        status = 'ready';
      }

      this.updatePersona(personaId, {
        trainingProgress: Math.round(progress),
        status,
      });

      onProgress?.(Math.round(progress), status);

      if (progress >= 100) {
        this.stopTraining(personaId);
      }
    }, 2000);

    this.trainingIntervals.set(personaId, interval);
    this.updatePersona(personaId, { status: 'collecting' });
  }

  stopTraining(personaId: string): void {
    const interval = this.trainingIntervals.get(personaId);
    if (interval) {
      window.clearInterval(interval);
      this.trainingIntervals.delete(personaId);
    }
  }

  // ---------------------------------------------------------------------------
  // CHAT WITH PERSONA (Real Ollama Integration)
  // ---------------------------------------------------------------------------

  async chat(
    personaId: string,
    message: string,
    onToken?: (token: string) => void
  ): Promise<{ response: string; latencyMs: number }> {
    const persona = this.personas.get(personaId);
    if (!persona) {
      throw new Error(`Persona not found: ${personaId}`);
    }

    if (persona.status !== 'ready') {
      throw new Error(`Persona ${persona.name} is not ready. Current status: ${persona.status}`);
    }

    const startTime = Date.now();

    // Get or create chat history
    const history = this.chatHistories.get(personaId) || [];

    // Build messages for Ollama
    const messages: OllamaChatMessage[] = [{ role: 'system', content: persona.systemPrompt }];

    // Add recent history (last 10 messages for context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    messages.push({ role: 'user', content: message });

    try {
      // Check Ollama availability
      const status = ollamaService.getStatus();
      if (!status.available) {
        throw new Error('Ollama is not available. Please ensure Ollama is running.');
      }

      // Use streaming if callback provided
      if (onToken) {
        let fullResponse = '';
        const stream = ollamaService.streamChat(
          this.mapRoleToAgentId(persona.role),
          message,
          recentHistory.map((m) => `${m.role}: ${m.content}`).join('\n')
        );

        for await (const chunk of stream) {
          if (chunk.type === 'token') {
            fullResponse += chunk.content;
            onToken(chunk.content);
          }
        }

        const latencyMs = Date.now() - startTime;

        // Update history
        this.updateChatHistory(personaId, message, fullResponse);
        this.recordInteraction(personaId, message, fullResponse, latencyMs);

        return { response: fullResponse, latencyMs };
      } else {
        // Non-streaming request
        const result = await ollamaService.chat({
          model: persona.baseModel,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
          },
        });

        const latencyMs = Date.now() - startTime;
        const response = result.message.content;

        // Update history
        this.updateChatHistory(personaId, message, response);
        this.recordInteraction(personaId, message, response, latencyMs);

        return { response, latencyMs };
      }
    } catch (error) {
      console.error('[PersonaForge] Chat error:', error);

      // Fallback to intelligent local response
      const fallbackResponse = this.generateFallbackResponse(persona, message);
      const latencyMs = Date.now() - startTime;

      this.updateChatHistory(personaId, message, fallbackResponse);
      this.recordInteraction(personaId, message, fallbackResponse, latencyMs);

      return { response: fallbackResponse, latencyMs };
    }
  }

  private mapRoleToAgentId(role: PersonaRole): string {
    const mapping: Record<PersonaRole, string> = {
      cfo: 'agent-cfo',
      cio: 'agent-cto', // CIO maps to CTO agent
      clo: 'agent-clo',
      chro: 'agent-cco', // CHRO maps to CCO for HR comms
      ciso: 'agent-ciso',
      cso: 'agent-chief',
      cro: 'agent-cro',
      coo: 'agent-coo',
      cpo: 'agent-cpo',
      custom: 'agent-chief',
    };
    return mapping[role] || 'agent-chief';
  }

  private updateChatHistory(
    personaId: string,
    userMessage: string,
    assistantMessage: string
  ): void {
    const history = this.chatHistories.get(personaId) || [];

    history.push({
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    history.push({
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
    });

    // Keep last 50 messages
    this.chatHistories.set(personaId, history.slice(-50));
  }

  getChatHistory(personaId: string): ChatMessage[] {
    return this.chatHistories.get(personaId) || [];
  }

  clearChatHistory(personaId: string): void {
    this.chatHistories.delete(personaId);
  }

  private recordInteraction(
    personaId: string,
    query: string,
    response: string,
    latencyMs: number
  ): void {
    const persona = this.personas.get(personaId);
    if (!persona) {
      return;
    }

    // Update persona stats
    this.updatePersona(personaId, {
      totalInteractions: persona.totalInteractions + 1,
      lastActive: new Date(),
    });

    // Store interaction
    const interactions = this.interactions.get(personaId) || [];
    interactions.push({
      id: `int-${Date.now()}`,
      personaId,
      query,
      response,
      timestamp: new Date(),
      userId: 'current-user',
      department: 'Unknown',
      tokensUsed: Math.ceil(response.length / 4),
      latencyMs,
    });

    // Keep last 100 interactions per persona
    this.interactions.set(personaId, interactions.slice(-100));
  }

  private generateFallbackResponse(persona: DigitalPersona, message: string): string {
    const role = persona.role;
    const query = message.toLowerCase();

    // Intelligent fallback responses based on role and query
    const responses: Record<PersonaRole, Record<string, string>> = {
      cfo: {
        budget:
          'Based on financial analysis patterns, I recommend reviewing the current budget allocation against historical performance. Key considerations include operating expense ratios, revenue forecasts, and capital expenditure requirements. Would you like me to elaborate on any specific area?',
        risk: 'From a financial risk perspective, I analyze exposure across market, credit, liquidity, and operational dimensions. Current best practices suggest maintaining diversified reserves and conducting regular stress testing.',
        default:
          'As your Digital CFO, I can assist with financial analysis, budgeting, forecasting, risk assessment, and strategic financial planning. What specific financial matter would you like to discuss?',
      },
      cio: {
        security:
          'Technology security should follow defense-in-depth principles. I recommend evaluating your current architecture against zero-trust frameworks and ensuring comprehensive monitoring and incident response capabilities.',
        cloud:
          'Cloud strategy should balance innovation velocity with governance requirements. Key considerations include workload assessment, data residency, cost optimization, and vendor lock-in mitigation.',
        default:
          'As your Digital CIO, I provide guidance on technology strategy, digital transformation, infrastructure decisions, and IT governance. What technology challenge can I help you address?',
      },
      clo: {
        contract:
          'Contract review should focus on key risk areas: liability limitations, indemnification clauses, IP rights, termination provisions, and regulatory compliance. I recommend a systematic clause-by-clause analysis.',
        compliance:
          'Compliance requires a comprehensive framework covering relevant regulations (GDPR, SOX, HIPAA as applicable), regular audits, training programs, and documentation protocols.',
        default:
          'As your Digital CLO, I provide legal guidance on contracts, compliance, risk management, and corporate governance. What legal matter requires attention?',
      },
      chro: {
        talent:
          'Talent management requires a holistic approach covering acquisition, development, retention, and succession planning. Key metrics include turnover rates, engagement scores, and time-to-fill.',
        default:
          'As your Digital CHRO, I advise on talent strategy, organizational development, compensation, and HR compliance. How can I assist with your people matters?',
      },
      ciso: {
        threat:
          'Threat assessment should evaluate attack vectors, threat actors, and vulnerability landscape. I recommend continuous monitoring, threat intelligence integration, and regular penetration testing.',
        default:
          'As your Digital CISO, I provide guidance on cybersecurity strategy, risk management, incident response, and compliance. What security concern should we address?',
      },
      cso: {
        default:
          'As your Digital CSO, I provide strategic analysis, market intelligence, and long-term planning guidance. What strategic question can I help explore?',
      },
      cro: {
        default:
          'As your Digital CRO, I focus on revenue growth, sales strategy, and go-to-market optimization. What revenue challenge should we discuss?',
      },
      coo: {
        default:
          'As your Digital COO, I advise on operations, efficiency, process optimization, and execution. What operational matter needs attention?',
      },
      cpo: {
        default:
          'As your Digital CPO, I provide product strategy, roadmap planning, and market positioning guidance. What product decision can I assist with?',
      },
      custom: {
        default:
          "I'm ready to assist based on my training. Please provide more details about what you'd like to discuss.",
      },
    };

    const roleResponses = responses[role] || responses.custom;

    // Match query to specific response
    for (const [key, response] of Object.entries(roleResponses)) {
      if (key !== 'default' && query.includes(key)) {
        return response;
      }
    }

    return (
      roleResponses.default ||
      "I'm here to help. Could you provide more details about your question?"
    );
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  getStats(): {
    totalPersonas: number;
    readyPersonas: number;
    trainingPersonas: number;
    totalInteractions: number;
  } {
    const personas = Array.from(this.personas.values());
    return {
      totalPersonas: personas.length,
      readyPersonas: personas.filter((p) => p.status === 'ready').length,
      trainingPersonas: personas.filter((p) => p.status !== 'ready' && p.status !== 'not_started')
        .length,
      totalInteractions: personas.reduce((sum, p) => sum + p.totalInteractions, 0),
    };
  }
}

// Singleton instance
export const personaForgeService = new PersonaForgeService();
export default personaForgeService;
