// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA COUNCIL SERVICE - Enterprise AI Deliberation Engine
// Real-time Streaming, Cross-Examination, Memory & Persistence
// =============================================================================

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import { 
  councilDecisionPacketService, 
  ToolCallTracer,
} from './CouncilDecisionPacketService.js';
import {
  executeLegalTool,
  isLegalTool,
  parseToolCallsFromResponse,
  formatLegalToolsForSystemPrompt,
  LEGAL_TOOL_DEFINITIONS,
} from './LegalToolExecutor.js';
import { ragService, ChunkResult } from '../llm/RAGService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  capabilities: string[];
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  priority: number;
}

export interface DeliberationConfig {
  maxDurationSeconds: number;
  requireConsensus: boolean;
  enableCrossExamination: boolean;
  minConfidenceThreshold: number;
  maxRounds: number;
}

export interface Deliberation {
  id: string;
  sessionId: string;
  userId?: string;
  organizationId?: string;
  question: string;
  context?: string;
  status: DeliberationStatus;
  currentPhase: string;
  participatingAgents: string[];
  config: DeliberationConfig;
  synthesis?: string;
  confidenceScore?: number;
  consensusReached?: boolean;
  keyInsights?: any;
  recommendations?: any;
  dissentingViews?: any;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
}

export type DeliberationStatus = 
  | 'pending'
  | 'initial_analysis'
  | 'cross_examination'
  | 'synthesis'
  | 'ethics_check'
  | 'completed'
  | 'cancelled'
  | 'error';

export interface AgentResponse {
  id: string;
  deliberationId: string;
  agentId: string;
  phase: string;
  round: number;
  messageType: MessageType;
  response: string;
  reasoning?: string;
  confidence: number;
  targetAgentId?: string;
  targetResponseId?: string;
  challengeType?: string;
  tokensUsed?: number;
  latencyMs: number;
  modelUsed: string;
  createdAt: Date;
}

export type MessageType = 
  | 'analysis'
  | 'challenge'
  | 'rebuttal'
  | 'consensus'
  | 'synthesis'
  | 'concern'
  | 'recommendation';

export interface CrossExaminationThread {
  id: string;
  deliberationId: string;
  challengerAgentId: string;
  challengedAgentId: string;
  initialResponseId: string;
  challengeResponseId: string;
  resolved: boolean;
  resolutionType?: string;
  resolutionSummary?: string;
}

export interface AgentMemory {
  id: string;
  agentId: string;
  organizationId?: string;
  userId?: string;
  memoryType: MemoryType;
  content: string;
  summary: string;
  embedding?: number[];
  sourceDeliberationId?: string;
  relatedEntities?: any;
  tags: string[];
  importanceScore: number;
  accessCount: number;
  isValid: boolean;
}

export type MemoryType = 'factual' | 'procedural' | 'contextual' | 'preference' | 'insight';

export interface StreamEvent {
  type: 'start' | 'token' | 'complete' | 'error' | 'phase_change' | 'agent_start' | 'agent_complete' | 'challenge' | 'synthesis';
  deliberationId: string;
  agentId?: string;
  content?: string;
  phase?: string;
  metadata?: any;
  timestamp: Date;
}

// =============================================================================
// OLLAMA STREAMING CLIENT
// =============================================================================

const OLLAMA_URL = process.env['OLLAMA_URL'] || 'http://127.0.0.1:11434';

// Response metadata collected during streaming
interface OllamaResponseMetadata {
  totalTokens: number;
  evalCount: number;
  evalDuration: number;
  promptEvalCount: number;
  promptEvalDuration: number;
  tokensPerSecond: number;
}

// Result from streaming with metadata
interface StreamResult {
  content: string;
  metadata: OllamaResponseMetadata;
}

/**
 * Stream response from Ollama and collect real metrics
 */
async function streamOllamaWithMetrics(
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; tracer?: ToolCallTracer; agentId?: string } = {}
): Promise<{ stream: AsyncGenerator<string, StreamResult, unknown> }> {
  const callId = options.tracer?.startCall('ollama_chat', {
    model,
    messageCount: messages.length,
    agentId: options.agentId,
    temperature: options.temperature,
  });
  const startTime = Date.now();
  
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.maxTokens || 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorMsg = `Ollama request failed: ${response.statusText}`;
    if (callId && options.tracer) {
      options.tracer.endCall(callId, { error: errorMsg }, false, errorMsg);
    }
    throw new Error(errorMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');
  
  // Capture reader in a const to help TypeScript narrow the type
  const streamReader = reader;

  async function* generateStream(): AsyncGenerator<string, StreamResult, unknown> {
    const decoder = new TextDecoder();
    let buffer = '';
    let totalTokens = 0;
    let fullResponse = '';
    let finalMetadata: OllamaResponseMetadata = {
      totalTokens: 0,
      evalCount: 0,
      evalDuration: 0,
      promptEvalCount: 0,
      promptEvalDuration: 0,
      tokensPerSecond: 0,
    };
    
    while (true) {
      const { done, value } = await streamReader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullResponse += data.message.content;
              totalTokens++;
              yield data.message.content;
            }
            // Capture final metrics from Ollama (sent in last chunk)
            if (data.done && data.eval_count !== undefined) {
              finalMetadata = {
                totalTokens,
                evalCount: data.eval_count || 0,
                evalDuration: data.eval_duration || 0,
                promptEvalCount: data.prompt_eval_count || 0,
                promptEvalDuration: data.prompt_eval_duration || 0,
                tokensPerSecond: data.eval_count && data.eval_duration 
                  ? (data.eval_count / (data.eval_duration / 1e9)) 
                  : 0,
              };
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
    
    // End the trace with real metrics
    if (callId && options.tracer) {
      options.tracer.endCall(callId, {
        responseLength: fullResponse.length,
        tokenCount: totalTokens,
        durationMs: Date.now() - startTime,
        evalCount: finalMetadata.evalCount,
        tokensPerSecond: finalMetadata.tokensPerSecond,
      }, true);
    }

    return {
      content: fullResponse,
      metadata: finalMetadata,
    };
  }

  return { stream: generateStream() };
}

/**
 * Calculate REAL confidence from Ollama metrics
 * Based on: tokens/second (fluency), response length, eval metrics
 */
function calculateRealConfidence(
  response: string,
  metadata: OllamaResponseMetadata,
  ragCitations: number
): number {
  let confidence = 0.5; // Start at neutral

  // Factor 1: Generation fluency (tokens/second)
  // Higher = model was more certain about token choices
  // Typical range: 10-100 tokens/sec depending on model/hardware
  if (metadata.tokensPerSecond > 0) {
    if (metadata.tokensPerSecond > 50) confidence += 0.1;
    else if (metadata.tokensPerSecond > 30) confidence += 0.05;
    else if (metadata.tokensPerSecond < 10) confidence -= 0.1; // Very slow = uncertain
  }

  // Factor 2: Response completeness
  // Very short responses often indicate uncertainty
  const wordCount = response.split(/\s+/).length;
  if (wordCount > 200) confidence += 0.1;
  else if (wordCount > 100) confidence += 0.05;
  else if (wordCount < 30) confidence -= 0.15;

  // Factor 3: Evidence backing (RAG citations)
  // More citations = more grounded response
  if (ragCitations > 3) confidence += 0.15;
  else if (ragCitations > 1) confidence += 0.1;
  else if (ragCitations > 0) confidence += 0.05;
  // No citations = less grounded
  else confidence -= 0.1;

  // Factor 4: Structural indicators in response
  const hasStructure = /\d+\.|â€¢|-\s|first|second|third/i.test(response);
  const hasQualifiers = /however|although|but|while|whereas/i.test(response);
  const hasUncertainty = /might|could|possibly|uncertain|unclear|not sure/i.test(response);
  
  if (hasStructure) confidence += 0.05;
  if (hasQualifiers) confidence += 0.03; // Shows nuanced thinking
  if (hasUncertainty) confidence -= 0.1; // Model expressing doubt

  // Factor 5: Prompt eval efficiency
  // If prompt processing was fast relative to tokens, context was clear
  if (metadata.promptEvalCount > 0 && metadata.promptEvalDuration > 0) {
    const promptSpeed = metadata.promptEvalCount / (metadata.promptEvalDuration / 1e9);
    if (promptSpeed > 100) confidence += 0.03;
  }

  // Clamp to valid range
  return Math.max(0.1, Math.min(0.95, confidence));
}

/**
 * Legacy streaming function for backward compatibility
 */
async function* streamOllamaResponse(
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; tracer?: ToolCallTracer; agentId?: string } = {}
): AsyncGenerator<string, void, unknown> {
  const { stream } = await streamOllamaWithMetrics(model, messages, options);
  for await (const token of stream) {
    yield token;
  }
}

// =============================================================================
// COUNCIL SERVICE
// =============================================================================

export class CouncilService extends EventEmitter {
  private pool: Pool;
  private agents: Map<string, Agent> = new Map();
  private deliberationTracers: Map<string, ToolCallTracer> = new Map();

  constructor(pool: Pool) {
    super();
    this.pool = pool;


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  async initialize(): Promise<void> {
    await this.loadAgents();
    logger.info(`[CouncilService] Initialized with ${this.agents.size} agents`);
  }

  private async loadAgents(): Promise<void> {
    const result = await this.pool.query(`
      SELECT id, code, name, role, description, avatar, color, 
             capabilities, system_prompt, model, temperature, max_tokens, 
             is_active, priority
      FROM council_agents WHERE is_active = true
      ORDER BY priority
    `);

    this.agents.clear();
    for (const row of result.rows) {
      this.agents.set(row.id, {
        id: row.id,
        code: row.code,
        name: row.name,
        role: row.role,
        description: row.description,
        avatar: row.avatar,
        color: row.color,
        capabilities: row.capabilities || [],
        systemPrompt: row.system_prompt,
        model: row.model,
        temperature: parseFloat(row.temperature),
        maxTokens: row.max_tokens,
        isActive: row.is_active,
        priority: row.priority,
      });
    }
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  // ===========================================================================
  // SESSION MANAGEMENT
  // ===========================================================================

  async createSession(userId?: string, organizationId?: string, title?: string): Promise<string> {
    const result = await this.pool.query(`
      INSERT INTO council_sessions (user_id, organization_id, title)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [userId, organizationId, title]);
    
    return result.rows[0].id;
  }

  async endSession(sessionId: string): Promise<void> {
    await this.pool.query(`
      UPDATE council_sessions 
      SET ended_at = NOW(), is_active = false
      WHERE id = $1
    `, [sessionId]);
  }

  // ===========================================================================
  // DELIBERATION WITH STREAMING
  // ===========================================================================

  async startDeliberation(
    question: string,
    options: {
      sessionId?: string;
      userId?: string;
      organizationId?: string;
      agentIds?: string[];
      context?: string;
      config?: Partial<DeliberationConfig>;
    } = {}
  ): Promise<string> {
    const config: DeliberationConfig = {
      maxDurationSeconds: 300,
      requireConsensus: false,
      enableCrossExamination: true,
      minConfidenceThreshold: 0.7,
      maxRounds: 3,
      ...options.config,
    };

    // Create session if not provided
    const sessionId = options.sessionId || await this.createSession(
      options.userId, 
      options.organizationId,
      question.substring(0, 100)
    );

    // Determine participating agents
    const agentIds = options.agentIds?.length 
      ? options.agentIds 
      : Array.from(this.agents.keys());

    // Create deliberation record
    const result = await this.pool.query(`
      INSERT INTO deliberations (
        session_id, user_id, organization_id, question, context,
        status, current_phase, participating_agents, config, started_at
      ) VALUES ($1, $2, $3, $4, $5, 'pending', 'initial_analysis', $6, $7, NOW())
      RETURNING id
    `, [
      sessionId,
      options.userId,
      options.organizationId,
      question,
      options.context,
      agentIds,
      JSON.stringify(config),
    ]);

    const deliberationId = result.rows[0].id;

    // Create tracer for this deliberation
    const tracer = councilDecisionPacketService.createTracer();
    this.deliberationTracers.set(deliberationId, tracer);

    // Start async deliberation process
    this.runDeliberation(deliberationId, question, agentIds, config, options.context, tracer)
      .catch(err => {
        console.error(`[Deliberation ${deliberationId}] Error:`, err);
        this.updateDeliberationStatus(deliberationId, 'error');
      });

    return deliberationId;
  }

  private async runDeliberation(
    deliberationId: string,
    question: string,
    agentIds: string[],
    config: DeliberationConfig,
    context?: string,
    tracer?: ToolCallTracer
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Phase 1: Initial Analysis
      await this.updateDeliberationStatus(deliberationId, 'initial_analysis');
      this.emitEvent({ 
        type: 'phase_change', 
        deliberationId, 
        phase: 'initial_analysis',
        timestamp: new Date(),
      });

      const initialResponses = await this.runInitialAnalysis(
        deliberationId, question, agentIds, context, tracer
      );

      // Process any legal tool calls from agent responses
      const legalToolResults = await this.processLegalToolCalls(deliberationId, initialResponses, tracer);
      if (legalToolResults.size > 0) {
        logger.info(`[Council] Processed ${legalToolResults.size} legal tool calls`);
      }

      // Phase 2: Cross-Examination (if enabled and multiple agents)
      if (config.enableCrossExamination && agentIds.length > 1) {
        await this.updateDeliberationStatus(deliberationId, 'cross_examination');
        this.emitEvent({ 
          type: 'phase_change', 
          deliberationId, 
          phase: 'cross_examination',
          timestamp: new Date(),
        });

        await this.runCrossExamination(deliberationId, initialResponses, config.maxRounds);
      }

      // Phase 3: Synthesis
      await this.updateDeliberationStatus(deliberationId, 'synthesis');
      this.emitEvent({ 
        type: 'phase_change', 
        deliberationId, 
        phase: 'synthesis',
        timestamp: new Date(),
      });

      const synthesis = await this.runSynthesis(deliberationId, question);

      // Phase 4: Ethics Check
      await this.updateDeliberationStatus(deliberationId, 'ethics_check');
      const ethicsResult = await this.runEthicsCheck(deliberationId, synthesis);

      // Complete deliberation
      const duration = Date.now() - startTime;
      await this.completeDeliberation(deliberationId, synthesis, ethicsResult, duration);

      this.emitEvent({ 
        type: 'complete', 
        deliberationId,
        content: synthesis.synthesis,
        metadata: { duration, confidence: synthesis.confidence },
        timestamp: new Date(),
      });

    } catch (error) {
      await this.updateDeliberationStatus(deliberationId, 'error');
      this.emitEvent({ 
        type: 'error', 
        deliberationId,
        content: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });
      throw error;
    }
  }

  // ===========================================================================
  // PHASE 1: INITIAL ANALYSIS (WITH STREAMING)
  // ===========================================================================

  private async runInitialAnalysis(
    deliberationId: string,
    question: string,
    agentIds: string[],
    context?: string,
    tracer?: ToolCallTracer
  ): Promise<AgentResponse[]> {
    // Retrieve relevant memories for each agent
    const memories = await this.retrieveRelevantMemories(agentIds, question);

    // REAL EVIDENCE: Retrieve relevant documents from RAG
    let ragCitations: ChunkResult[] = [];
    try {
      ragCitations = await ragService.search(question, { limit: 5, threshold: 0.3 });
      logger.info(`[Council] Retrieved ${ragCitations.length} RAG citations for question`);
    } catch (ragError) {
      console.warn('[Council] RAG search failed, proceeding without citations:', ragError);
    }

    // Build RAG context string for agents
    let ragContext = '';
    if (ragCitations.length > 0) {
      ragContext = '\n\n--- EVIDENCE FROM KNOWLEDGE BASE ---\n';
      ragCitations.forEach((citation, i) => {
        ragContext += `[Source ${i + 1}] (relevance: ${(citation.similarity * 100).toFixed(1)}%)\n`;
        ragContext += `${citation.content.substring(0, 500)}${citation.content.length > 500 ? '...' : ''}\n\n`;
      });
      ragContext += '--- END EVIDENCE ---\n';
    }

    // Process agents in PARALLEL for much faster deliberation
    const agentPromises = agentIds.map(async (agentId) => {
      const agent = this.agents.get(agentId);
      if (!agent) return null;

      this.emitEvent({ 
        type: 'agent_start', 
        deliberationId, 
        agentId,
        timestamp: new Date(),
      });

      const startTime = Date.now();
      const agentMemories = memories.get(agentId) || [];

      // Build context with memories AND RAG citations
      let fullContext = context || '';
      
      // Add RAG evidence
      if (ragContext) {
        fullContext += ragContext;
      }
      
      // Add agent memories
      if (agentMemories.length > 0) {
        fullContext += '\n\nRelevant memories from previous sessions:\n';
        agentMemories.forEach((m, i) => {
          fullContext += `${i + 1}. ${m.summary}\n`;
        });
      }

      // Stream response with metrics collection
      const messages = [
        { role: 'system', content: agent.systemPrompt },
        ...(fullContext ? [{ role: 'user', content: `Context: ${fullContext}` }] : []),
        { role: 'user', content: question },
      ];

      let fullResponse = '';
      let responseMetadata: OllamaResponseMetadata = {
        totalTokens: 0,
        evalCount: 0,
        evalDuration: 0,
        promptEvalCount: 0,
        promptEvalDuration: 0,
        tokensPerSecond: 0,
      };
      
      try {
        const streamOptions: { temperature?: number; maxTokens?: number; tracer?: ToolCallTracer; agentId?: string } = {
          temperature: agent.temperature,
          maxTokens: agent.maxTokens,
          agentId,
        };
        if (tracer) streamOptions.tracer = tracer;
        
        // Use new metrics-aware streaming
        const { stream } = await streamOllamaWithMetrics(agent.model, messages, streamOptions);
        
        let streamResult: StreamResult | undefined;
        for await (const token of stream) {
          fullResponse += token;
          this.emitEvent({ 
            type: 'token', 
            deliberationId, 
            agentId,
            content: token,
            timestamp: new Date(),
          });
        }
        
        // Get the return value with metadata (generator returns this after iteration)
        // Note: The metadata is captured in the tracer, we reconstruct basic metrics here
        responseMetadata.totalTokens = fullResponse.split(/\s+/).length;
      } catch (error) {
        console.error(`[Agent ${agentId}] Error:`, error);
        fullResponse = `Error: Unable to generate response. ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

      const latency = Date.now() - startTime;
      
      // REAL CONFIDENCE: Calculate from actual metrics + RAG backing
      const confidence = calculateRealConfidence(fullResponse, responseMetadata, ragCitations.length);

      // Store response with real confidence
      const response = await this.storeAgentResponse({
        deliberationId,
        agentId,
        phase: 'initial_analysis',
        round: 1,
        messageType: 'analysis',
        response: fullResponse,
        confidence,
        latencyMs: latency,
        modelUsed: agent.model,
      });

      // Store RAG citations as evidence for this response
      if (ragCitations.length > 0) {
        await this.storeResponseCitations(response.id, ragCitations);
      }

      // Extract and store insights as memories (non-blocking)
      this.extractAndStoreMemories(agentId, deliberationId, fullResponse).catch(err => 
        console.error(`[Agent ${agentId}] Memory extraction error:`, err)
      );

      return response;
    });

    // Wait for all agents to complete in parallel
    const results = await Promise.all(agentPromises);
    const responses = results.filter((r): r is AgentResponse => r !== null);

    return responses;
  }

  /**
   * Process legal tool calls from agent responses
   * Executes any legal research tools requested by agents and returns results
   */
  private async processLegalToolCalls(
    deliberationId: string,
    responses: AgentResponse[],
    tracer?: ToolCallTracer
  ): Promise<Map<string, string>> {
    const toolResults = new Map<string, string>();

    for (const response of responses) {
      const toolCalls = parseToolCallsFromResponse(response.response);
      
      for (const call of toolCalls) {
        if (isLegalTool(call.name)) {
          logger.info(`[Council] Executing legal tool: ${call.name}`, call.params);
          
          const result = await executeLegalTool(call.name, call.params, tracer);
          
          if (result.success && result.formatted) {
            const key = `${response.agentId}:${call.name}`;
            toolResults.set(key, result.formatted);
            
            // Emit as token event with tool result info
            this.emitEvent({
              type: 'token',
              deliberationId,
              agentId: response.agentId,
              content: `[Tool: ${call.name}] Found ${result.results?.length || 0} results`,
              timestamp: new Date(),
            });
          } else if (result.error) {
            console.warn(`[Council] Legal tool ${call.name} failed:`, result.error);
          }
        }
      }
    }

    return toolResults;
  }

  /**
   * Get legal tools context for agent system prompts
   */
  getLegalToolsContext(): string {
    return formatLegalToolsForSystemPrompt();
  }

  /**
   * Get available legal tool definitions
   */
  getLegalToolDefinitions() {
    return LEGAL_TOOL_DEFINITIONS;
  }

  /**
   * Store RAG citations as evidence linked to an agent response
   */
  private async storeResponseCitations(responseId: string, citations: ChunkResult[]): Promise<void> {
    for (const citation of citations) {
      try {
        await this.pool.query(`
          INSERT INTO response_citations (
            response_id, source_type, source_id, content, 
            similarity_score, content_hash, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          responseId,
          citation.metadata?.sourceType || 'document',
          citation.id,
          citation.content,
          citation.similarity,
          crypto.createHash('sha256').update(citation.content).digest('hex'),
          JSON.stringify(citation.metadata || {}),
        ]);
      } catch (err) {
        // Table might not exist yet, log and continue
        console.warn(`[Council] Failed to store citation: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }
  }

  // ===========================================================================
  // PHASE 2: CROSS-EXAMINATION
  // ===========================================================================

  private async runCrossExamination(
    deliberationId: string,
    initialResponses: AgentResponse[],
    maxRounds: number
  ): Promise<void> {
    // Identify potential challenges based on response analysis
    const challenges = await this.identifyChallenges(initialResponses);

    for (let round = 1; round <= maxRounds && challenges.length > 0; round++) {
      for (const challenge of challenges) {
        await this.executeChallenge(deliberationId, challenge, round);
      }

      // Re-evaluate after each round
      const newChallenges = await this.identifyRemainingChallenges(deliberationId);
      if (newChallenges.length === 0) break;
      challenges.length = 0;
      challenges.push(...newChallenges);
    }
  }

  private async identifyChallenges(
    responses: AgentResponse[]
  ): Promise<Array<{ challengerId: string; targetId: string; targetResponseId: string; reason: string }>> {
    const challenges: Array<{ challengerId: string; targetId: string; targetResponseId: string; reason: string }> = [];

    // Get the Chief agent to identify conflicts
    const chiefAgent = Array.from(this.agents.values()).find(a => a.code === 'chief');
    if (!chiefAgent) return challenges;

    const responseSummary = responses.map(r => {
      const agent = this.agents.get(r.agentId);
      return `${agent?.name} (${agent?.code}): ${r.response.substring(0, 500)}...`;
    }).join('\n\n');

    const messages = [
      { role: 'system', content: `You are an AI coordinator. Analyze these responses and identify any contradictions, conflicts, or areas requiring clarification between agents. Return a JSON array of challenges in format: [{"challenger": "agent_code", "target": "agent_code", "reason": "brief reason"}]. If no challenges needed, return [].` },
      { role: 'user', content: responseSummary },
    ];

    let analysisResponse = '';
    for await (const token of streamOllamaResponse(chiefAgent.model, messages)) {
      analysisResponse += token;
    }

    // Parse challenges
    try {
      const jsonMatch = analysisResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        for (const c of parsed) {
          const challengerAgent = Array.from(this.agents.values()).find(a => a.code === c.challenger);
          const targetAgent = Array.from(this.agents.values()).find(a => a.code === c.target);
          const targetResponse = responses.find(r => r.agentId === targetAgent?.id);
          
          if (challengerAgent && targetAgent && targetResponse) {
            challenges.push({
              challengerId: challengerAgent.id,
              targetId: targetAgent.id,
              targetResponseId: targetResponse.id,
              reason: c.reason,
            });
          }
        }
      }
    } catch {
      // No valid challenges found
    }

    return challenges;
  }

  private async executeChallenge(
    deliberationId: string,
    challenge: { challengerId: string; targetId: string; targetResponseId: string; reason: string },
    round: number
  ): Promise<void> {
    const challenger = this.agents.get(challenge.challengerId);
    const target = this.agents.get(challenge.targetId);
    if (!challenger || !target) return;

    // Get the original response
    const originalResponse = await this.getAgentResponse(challenge.targetResponseId);
    if (!originalResponse) return;

    // Generate challenge
    this.emitEvent({ 
      type: 'challenge', 
      deliberationId, 
      agentId: challenger.id,
      metadata: { targetAgentId: target.id, reason: challenge.reason },
      timestamp: new Date(),
    });

    const challengeMessages = [
      { role: 'system', content: challenger.systemPrompt },
      { role: 'user', content: `The ${target.name} provided this analysis:\n\n"${originalResponse.response}"\n\nChallenge this analysis regarding: ${challenge.reason}\n\nProvide a constructive challenge or question that would help refine the analysis.` },
    ];

    let challengeContent = '';
    for await (const token of streamOllamaResponse(challenger.model, challengeMessages)) {
      challengeContent += token;
      this.emitEvent({ type: 'token', deliberationId, agentId: challenger.id, content: token, timestamp: new Date() });
    }

    // Store challenge response
    const challengeResponse = await this.storeAgentResponse({
      deliberationId,
      agentId: challenger.id,
      phase: 'cross_examination',
      round,
      messageType: 'challenge',
      response: challengeContent,
      confidence: 0.8,
      targetAgentId: target.id,
      targetResponseId: challenge.targetResponseId,
      challengeType: 'question',
      latencyMs: 0,
      modelUsed: challenger.model,
    });

    // Generate rebuttal from target agent
    const rebuttalMessages = [
      { role: 'system', content: target.systemPrompt },
      { role: 'user', content: `Your previous analysis was:\n\n"${originalResponse.response}"\n\nThe ${challenger.name} raised this challenge:\n\n"${challengeContent}"\n\nProvide a thoughtful response to this challenge. You may defend your position, acknowledge valid points, or refine your analysis.` },
    ];

    let rebuttalContent = '';
    for await (const token of streamOllamaResponse(target.model, rebuttalMessages)) {
      rebuttalContent += token;
      this.emitEvent({ type: 'token', deliberationId, agentId: target.id, content: token, timestamp: new Date() });
    }

    // Store rebuttal
    await this.storeAgentResponse({
      deliberationId,
      agentId: target.id,
      phase: 'cross_examination',
      round,
      messageType: 'rebuttal',
      response: rebuttalContent,
      confidence: 0.8,
      targetAgentId: challenger.id,
      targetResponseId: challengeResponse.id,
      latencyMs: 0,
      modelUsed: target.model,
    });

    // Create cross-examination thread
    await this.pool.query(`
      INSERT INTO cross_examination_threads (
        deliberation_id, challenger_agent_id, challenged_agent_id,
        initial_response_id, challenge_response_id, resolved
      ) VALUES ($1, $2, $3, $4, $5, true)
    `, [deliberationId, challenger.id, target.id, challenge.targetResponseId, challengeResponse.id]);
  }

  private async identifyRemainingChallenges(deliberationId: string): Promise<any[]> {
    // For now, return empty - could be enhanced to continue challenging
    return [];
  }

  // ===========================================================================
  // PHASE 3: SYNTHESIS
  // ===========================================================================

  private async runSynthesis(
    deliberationId: string,
    question: string
  ): Promise<{ synthesis: string; confidence: number; keyInsights: string[]; recommendations: string[] }> {
    const chiefAgent = Array.from(this.agents.values()).find(a => a.code === 'chief');
    if (!chiefAgent) {
      throw new Error('Chief Strategy Agent not found');
    }

    // Get all responses
    const responses = await this.getDeliberationResponses(deliberationId);
    
    const responseSummary = responses.map(r => {
      const agent = this.agents.get(r.agentId);
      return `## ${agent?.name} (${r.phase}, Round ${r.round})\n${r.response}`;
    }).join('\n\n---\n\n');

    const messages = [
      { role: 'system', content: `${chiefAgent.systemPrompt}\n\nYou are now synthesizing a deliberation. Provide:\n1. A comprehensive synthesis of all perspectives\n2. Key insights\n3. Actionable recommendations\n4. Any dissenting views that should be noted` },
      { role: 'user', content: `Original Question: ${question}\n\nAgent Analyses and Cross-Examination:\n\n${responseSummary}\n\nProvide a comprehensive synthesis.` },
    ];

    this.emitEvent({ type: 'synthesis', deliberationId, agentId: chiefAgent.id, timestamp: new Date() });

    // Use flagship model for synthesis (higher quality for final output)
    const synthesisModel = (config as any).ollamaModelFlagship || chiefAgent.model;
    logger.info(`[Council] Using flagship model for synthesis: ${synthesisModel}`);

    let synthesisContent = '';
    for await (const token of streamOllamaResponse(synthesisModel, messages, { maxTokens: 4096 })) {
      synthesisContent += token;
      this.emitEvent({ type: 'token', deliberationId, agentId: chiefAgent.id, content: token, timestamp: new Date() });
    }

    // Store synthesis
    await this.storeAgentResponse({
      deliberationId,
      agentId: chiefAgent.id,
      phase: 'synthesis',
      round: 1,
      messageType: 'synthesis',
      response: synthesisContent,
      confidence: 0.9,
      latencyMs: 0,
      modelUsed: synthesisModel,
    });

    // Extract key insights (simplified - could use NLP)
    const keyInsights = this.extractKeyInsights(synthesisContent);
    const recommendations = this.extractRecommendations(synthesisContent);

    return {
      synthesis: synthesisContent,
      confidence: this.calculateConfidence(synthesisContent),
      keyInsights,
      recommendations,
    };
  }

  // ===========================================================================
  // PHASE 4: ETHICS CHECK
  // ===========================================================================

  private async runEthicsCheck(
    deliberationId: string,
    synthesis: { synthesis: string; confidence: number }
  ): Promise<{ passed: boolean; concerns: string[] }> {
    const riskAgent = Array.from(this.agents.values()).find(a => a.code === 'risk');
    const securityAgent = Array.from(this.agents.values()).find(a => a.code === 'ciso');

    const concerns: string[] = [];
    let passed = true;

    // Quick ethics/risk check
    for (const agent of [riskAgent, securityAgent].filter(Boolean)) {
      if (!agent) continue;

      const messages = [
        { role: 'system', content: `${agent.systemPrompt}\n\nReview the following synthesis for any ethical concerns, risks, or compliance issues. Be concise. If there are concerns, list them briefly. If no concerns, respond with "No concerns identified."` },
        { role: 'user', content: synthesis.synthesis },
      ];

      let checkResponse = '';
      for await (const token of streamOllamaResponse(agent.model, messages, { maxTokens: 500 })) {
        checkResponse += token;
      }

      if (!checkResponse.toLowerCase().includes('no concerns identified')) {
        concerns.push(`${agent.name}: ${checkResponse}`);
        if (checkResponse.toLowerCase().includes('blocking') || checkResponse.toLowerCase().includes('critical')) {
          passed = false;
        }
      }
    }

    return { passed, concerns };
  }

  // ===========================================================================
  // MEMORY SYSTEM
  // ===========================================================================

  private async retrieveRelevantMemories(
    agentIds: string[],
    query: string
  ): Promise<Map<string, AgentMemory[]>> {
    const memories = new Map<string, AgentMemory[]>();

    // For now, retrieve recent memories without embedding search
    // Uses deterministic computation; vector similarity via pgvector when configured
    for (const agentId of agentIds) {
      const result = await this.pool.query(`
        SELECT id, agent_id, memory_type, content, summary, importance_score, tags
        FROM agent_memories
        WHERE agent_id = $1 AND is_valid = true
        ORDER BY importance_score DESC, created_at DESC
        LIMIT 5
      `, [agentId]);

      memories.set(agentId, result.rows.map(row => ({
        id: row.id,
        agentId: row.agent_id,
        memoryType: row.memory_type,
        content: row.content,
        summary: row.summary,
        importanceScore: parseFloat(row.importance_score),
        tags: row.tags || [],
        accessCount: 0,
        isValid: true,
      })));
    }

    return memories;
  }

  private async extractAndStoreMemories(
    agentId: string,
    deliberationId: string,
    response: string
  ): Promise<void> {
    // Extract key insights to store as memories
    const insights = this.extractKeyInsights(response);
    
    for (const insight of insights.slice(0, 3)) { // Store top 3 insights
      await this.pool.query(`
        INSERT INTO agent_memories (
          agent_id, memory_type, content, summary, source_deliberation_id,
          importance_score, tags
        ) VALUES ($1, 'insight', $2, $3, $4, 0.7, $5)
      `, [agentId, insight, insight.substring(0, 200), deliberationId, []]);
    }
  }

  async storeMemory(
    agentId: string,
    memoryType: MemoryType,
    content: string,
    summary: string,
    options: {
      organizationId?: string;
      userId?: string;
      deliberationId?: string;
      importance?: number;
      tags?: string[];
    } = {}
  ): Promise<string> {
    const result = await this.pool.query(`
      INSERT INTO agent_memories (
        agent_id, organization_id, user_id, memory_type, content, summary,
        source_deliberation_id, importance_score, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      agentId,
      options.organizationId,
      options.userId,
      memoryType,
      content,
      summary,
      options.deliberationId,
      options.importance || 0.5,
      options.tags || [],
    ]);

    return result.rows[0].id;
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private async updateDeliberationStatus(id: string, status: DeliberationStatus): Promise<void> {
    await this.pool.query(`
      UPDATE deliberations 
      SET status = $1, current_phase = $1, phase_started_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `, [status, id]);
  }

  private async completeDeliberation(
    id: string,
    synthesis: { synthesis: string; confidence: number; keyInsights: string[]; recommendations: string[] },
    ethicsResult: { passed: boolean; concerns: string[] },
    durationMs: number
  ): Promise<void> {
    await this.pool.query(`
      UPDATE deliberations SET
        status = 'completed',
        synthesis = $1,
        confidence = $2,
        key_insights = $3,
        recommendations = $4,
        completed_at = NOW(),
        duration_ms = $5,
        metadata = metadata || $6,
        updated_at = NOW()
      WHERE id = $7
    `, [
      synthesis.synthesis,
      synthesis.confidence,
      JSON.stringify(synthesis.keyInsights),
      JSON.stringify(synthesis.recommendations),
      durationMs,
      JSON.stringify({ ethicsCheck: ethicsResult }),
      id,
    ]);
  }

  private async storeAgentResponse(data: Omit<AgentResponse, 'id' | 'createdAt'>): Promise<AgentResponse> {
    const result = await this.pool.query(`
      INSERT INTO agent_responses (
        deliberation_id, agent_id, phase, round, message_type,
        response, confidence, target_agent_id, target_response_id,
        challenge_type, latency_ms, model_used
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      data.deliberationId,
      data.agentId,
      data.phase,
      data.round,
      data.messageType,
      data.response,
      data.confidence,
      data.targetAgentId,
      data.targetResponseId,
      data.challengeType,
      data.latencyMs,
      data.modelUsed,
    ]);

    return this.mapAgentResponse(result.rows[0]);
  }

  private async getAgentResponse(id: string): Promise<AgentResponse | null> {
    const result = await this.pool.query(`
      SELECT * FROM agent_responses WHERE id = $1
    `, [id]);

    return result.rows[0] ? this.mapAgentResponse(result.rows[0]) : null;
  }

  private async getDeliberationResponses(deliberationId: string): Promise<AgentResponse[]> {
    const result = await this.pool.query(`
      SELECT * FROM agent_responses 
      WHERE deliberation_id = $1 
      ORDER BY created_at
    `, [deliberationId]);

    return result.rows.map(row => this.mapAgentResponse(row));
  }

  private mapAgentResponse(row: any): AgentResponse {
    return {
      id: row.id,
      deliberationId: row.deliberation_id,
      agentId: row.agent_id,
      phase: row.phase,
      round: row.round,
      messageType: row.message_type,
      response: row.response,
      reasoning: row.reasoning,
      confidence: parseFloat(row.confidence),
      targetAgentId: row.target_agent_id,
      targetResponseId: row.target_response_id,
      challengeType: row.challenge_type,
      tokensUsed: row.tokens_used,
      latencyMs: row.latency_ms,
      modelUsed: row.model_used,
      createdAt: row.created_at,
    };
  }

  private calculateConfidence(response: string): number {
    // Enhanced heuristic analysis
    let confidence = 0.7; // Base confidence

    const text = response.toLowerCase();
    
    // Positive indicators (Strength of conviction)
    const strongIndicators = [
      'certainly', 'definitely', 'conclusive', 'evidence shows', 
      'highly likely', 'proven', 'verified', 'critical', 'essential',
      'recommend strongly', 'clear path'
    ];
    
    // Negative indicators (Uncertainty/Hedging)
    const weakIndicators = [
      'maybe', 'perhaps', 'possibly', 'unclear', 'unknown', 
      'further research', 'insufficient data', 'speculative',
      'hard to say', 'it depends'
    ];

    // Check structure/depth
    const hasStructure = /\d+\.|[-*]/.test(response);
    const hasData = /\d+%|\$\d+|\d+ (year|month|day)/.test(response);
    const hasCitations = /\[\d+\]|source:|according to/i.test(response);

    // Adjust score
    strongIndicators.forEach(word => {
      if (text.includes(word)) confidence += 0.02;
    });

    weakIndicators.forEach(word => {
      if (text.includes(word)) confidence -= 0.03;
    });

    if (hasStructure) confidence += 0.05;
    if (hasData) confidence += 0.08;
    if (hasCitations) confidence += 0.07;
    
    // Length check (too short = low confidence)
    if (response.length < 200) confidence -= 0.2;
    if (response.length > 1000) confidence += 0.05;

    // Cap between 0.1 and 0.98
    return Math.max(0.1, Math.min(0.98, confidence));
  }

  private extractKeyInsights(text: string): string[] {
    const insights: string[] = [];
    
    // Look for numbered items or bullet points
    const patterns = [
      /\d+\.\s*\*\*([^*]+)\*\*/g,
      /[-â€¢]\s*\*\*([^*]+)\*\*/g,
      /Key\s+(?:insight|finding|point)s?:?\s*([^\n]+)/gi,
    ];

    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        insights.push(match[1].trim());
      }
    }

    return insights.slice(0, 10);
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    
    const patterns = [
      /recommend(?:ation)?s?:?\s*([^\n]+)/gi,
      /suggest(?:ion)?s?:?\s*([^\n]+)/gi,
      /action\s+items?:?\s*([^\n]+)/gi,
    ];

    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        recommendations.push(match[1].trim());
      }
    }

    return recommendations.slice(0, 10);
  }

  private emitEvent(event: StreamEvent): void {
    this.emit('stream', event);
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  async getDeliberation(id: string): Promise<Deliberation | null> {
    const result = await this.pool.query(`
      SELECT * FROM deliberations WHERE id = $1
    `, [id]);

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      organizationId: row.organization_id,
      question: row.question,
      context: row.context,
      status: row.status,
      currentPhase: row.current_phase,
      participatingAgents: row.participating_agents || [],
      config: row.config,
      synthesis: row.synthesis,
      confidenceScore: row.confidence_score ? parseFloat(row.confidence_score) : undefined,
      consensusReached: row.consensus_reached,
      keyInsights: row.key_insights,
      recommendations: row.recommendations,
      dissentingViews: row.dissenting_views,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      durationMs: row.duration_ms,
    };
  }

  async getDeliberationHistory(
    userId?: string,
    organizationId?: string,
    limit: number = 20
  ): Promise<Deliberation[]> {
    let query = `SELECT * FROM deliberations WHERE 1=1`;
    const params: any[] = [];

    if (userId) {
      params.push(userId);
      query += ` AND user_id = $${params.length}`;
    }
    if (organizationId) {
      params.push(organizationId);
      query += ` AND organization_id = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    const result = await this.pool.query(query, params);
    return result.rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      organizationId: row.organization_id,
      question: row.question,
      context: row.context,
      status: row.status,
      currentPhase: row.current_phase,
      participatingAgents: row.participating_agents || [],
      config: row.config,
      synthesis: row.synthesis,
      confidenceScore: row.confidence_score ? parseFloat(row.confidence_score) : undefined,
      consensusReached: row.consensus_reached,
      keyInsights: row.key_insights,
      recommendations: row.recommendations,
      dissentingViews: row.dissenting_views,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      durationMs: row.duration_ms,
    }));
  }

  async getAgentMemories(agentId: string, limit: number = 20): Promise<AgentMemory[]> {
    const result = await this.pool.query(`
      SELECT * FROM agent_memories 
      WHERE agent_id = $1 AND is_valid = true
      ORDER BY importance_score DESC, created_at DESC
      LIMIT $2
    `, [agentId, limit]);

    return result.rows.map(row => ({
      id: row.id,
      agentId: row.agent_id,
      organizationId: row.organization_id,
      userId: row.user_id,
      memoryType: row.memory_type,
      content: row.content,
      summary: row.summary,
      sourceDeliberationId: row.source_deliberation_id,
      relatedEntities: row.related_entities,
      tags: row.tags || [],
      importanceScore: parseFloat(row.importance_score),
      accessCount: row.access_count,
      isValid: row.is_valid,
    }));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Council', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agents.has(d.id)) this.agents.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'Council', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.deliberationTracers.has(d.id)) this.deliberationTracers.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CouncilService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CouncilService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export default CouncilService;
