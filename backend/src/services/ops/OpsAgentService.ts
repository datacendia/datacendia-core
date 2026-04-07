// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// OPS AGENT SERVICE — Community Edition
// Practical, everyday AI agents that execute tasks (not deliberate).
//
// Community tier includes:
//   1. Report Automation — generate structured reports from data
//   2. Analytics          — descriptive stats, trends, anomalies
//
// Enterprise tier (datacendia-components) adds:
//   3. NLP               — classify, summarize, extract, sentiment-analyze text
//   4. Pipeline Builder   — scaffold data pipelines from plain-English descriptions
//   + Scheduled tasks, higher limits, integrity hashing, multi-org RBAC
//
// These complement the Governance/Council agents (which deliberate and audit).
// Ops agents DO things; Governance agents THINK about things.
// =============================================================================

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { ollama } from '../ollama.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OpsAgentType = 'report' | 'analytics' | 'nlp' | 'pipeline';

export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface OpsAgent {
  id: string;
  type: OpsAgentType;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  systemPrompt: string;
  status: 'online' | 'offline';
}

export interface OpsTask {
  id: string;
  agentType: OpsAgentType;
  organizationId?: string;
  userId?: string;
  title: string;
  prompt: string;
  context?: string;
  status: TaskStatus;
  result?: OpsTaskResult;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface OpsTaskResult {
  content: string;
  format: 'text' | 'markdown' | 'json' | 'csv' | 'html';
  metadata?: Record<string, unknown>;
  // For reports
  sections?: Array<{ title: string; content: string }>;
  // For analytics
  charts?: Array<{ type: string; title: string; data: unknown }>;
  // For NLP
  classifications?: Array<{ label: string; confidence: number }>;
  entities?: Array<{ text: string; type: string; start: number; end: number }>;
  sentiment?: { score: number; label: string };
  // For pipeline
  steps?: Array<{ order: number; name: string; type: string; config: Record<string, unknown> }>;
}

export interface RunTaskInput {
  agentType: OpsAgentType;
  title: string;
  prompt: string;
  context?: string;
  organizationId?: string;
  userId?: string;
  options?: {
    format?: OpsTaskResult['format'];
    temperature?: number;
    maxTokens?: number;
  };
}

// ---------------------------------------------------------------------------
// Agent definitions
// ---------------------------------------------------------------------------

const AGENT_DEFINITIONS: OpsAgent[] = [
  {
    id: 'ops-report',
    type: 'report',
    name: 'Report Agent',
    description: 'Generates structured reports from data and natural-language descriptions. Handles scheduling, formatting, and multi-section layouts.',
    icon: 'FileText',
    capabilities: [
      'report_generation',
      'data_summarization',
      'scheduled_reports',
      'multi_format_export',
      'template_based_reports',
      'executive_summary',
    ],
    systemPrompt: `You are the Datacendia Report Automation Agent. You generate clear, well-structured reports.

Rules:
- Output reports in clean Markdown with headers, bullet points, and tables
- Always include an Executive Summary at the top
- Include data-backed findings — never fabricate numbers
- If given raw data, summarize it into actionable insights
- Structure reports with clear sections: Summary, Key Findings, Details, Recommendations
- Use tables for comparative data
- Be concise but thorough — reports should be board-ready`,
    status: 'online',
  },
  {
    id: 'ops-analytics',
    type: 'analytics',
    name: 'Analytics Agent',
    description: 'Performs descriptive analytics, trend detection, anomaly identification, and conversational BI. Ask questions about your data in plain English.',
    icon: 'BarChart3',
    capabilities: [
      'descriptive_statistics',
      'trend_analysis',
      'anomaly_detection',
      'conversational_bi',
      'data_visualization_spec',
      'cohort_analysis',
    ],
    systemPrompt: `You are the Datacendia Analytics Agent. You analyze data and answer business questions.

Rules:
- When given data, compute relevant statistics (mean, median, distribution, trends)
- Identify anomalies and explain why they matter
- Express findings in plain English first, then provide supporting numbers
- When suggesting visualizations, output a JSON spec with chart type, axes, and data mapping
- Always quantify uncertainty — "approximately", "within range of", confidence intervals
- If data is insufficient, say so clearly rather than guessing
- Output structured JSON when the user asks for chart data`,
    status: 'online',
  },
  {
    id: 'ops-nlp',
    type: 'nlp',
    name: 'NLP Agent',
    description: 'Classifies, summarizes, extracts entities, and analyzes sentiment from text. Handles contracts, surveys, support tickets, and documents.',
    icon: 'Brain',
    capabilities: [
      'text_classification',
      'summarization',
      'entity_extraction',
      'sentiment_analysis',
      'key_phrase_extraction',
      'language_detection',
      'contract_review',
    ],
    systemPrompt: `You are the Datacendia NLP Agent. You process and analyze text data.

Rules:
- For classification: output a JSON array of { label, confidence } sorted by confidence
- For summarization: provide a concise summary followed by key points
- For entity extraction: output { text, type, start, end } for each entity found
- For sentiment: output { score (-1 to 1), label (positive/negative/neutral) }
- When reviewing contracts, flag risky clauses with specific quotes and explanations
- Be precise with confidence scores — don't inflate them
- Handle multiple languages when detected`,
    status: 'online',
  },
  {
    id: 'ops-pipeline',
    type: 'pipeline',
    name: 'Pipeline Agent',
    description: 'Scaffolds data pipelines from plain-English workflow descriptions. Generates step definitions, dependencies, and scheduling configurations.',
    icon: 'Workflow',
    capabilities: [
      'pipeline_scaffolding',
      'etl_design',
      'workflow_generation',
      'dependency_resolution',
      'schedule_configuration',
      'code_generation',
    ],
    systemPrompt: `You are the Datacendia Pipeline Builder Agent. You design and scaffold data pipelines.

Rules:
- When given a workflow description, break it into ordered steps with clear dependencies
- Each step should have: order, name, type (extract/transform/load/validate/notify), config
- Output as a JSON array of pipeline steps
- Include error handling steps (retry logic, dead-letter queues, alerting)
- Suggest appropriate scheduling (cron expressions) based on data freshness needs
- When generating code, output production-ready snippets with proper error handling
- Support common patterns: ETL, ELT, CDC, event-driven, batch, streaming`,
    status: 'online',
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Community-tier limits (enterprise overrides in datacendia-components)
const MAX_PROMPT_LENGTH = 8_000;
const MAX_CONTEXT_LENGTH = 16_000;
const MAX_CONCURRENT_TASKS = 3;
const MAX_TASK_HISTORY = 50;
const TASK_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const COMMUNITY_AGENT_TYPES: OpsAgentType[] = ['report', 'analytics'];
const VALID_AGENT_TYPES: OpsAgentType[] = COMMUNITY_AGENT_TYPES;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

class OpsAgentService {
  private tasks = new Map<string, OpsTask>();
  private runningCount = 0;
  private abortControllers = new Map<string, AbortController>();
  private initialized = false;

  getAgents(): OpsAgent[] {
    return AGENT_DEFINITIONS.filter(a => COMMUNITY_AGENT_TYPES.includes(a.type));
  }

  getAgent(agentType: OpsAgentType): OpsAgent | undefined {
    return AGENT_DEFINITIONS.find(a => a.type === agentType);
  }

  async checkAvailability(): Promise<{ available: boolean; provider: string }> {
    const available = await ollama.isAvailable();
    return { available, provider: available ? 'inference' : 'none' };
  }

  // ---------------------------------------------------------------------------
  // Task execution
  // ---------------------------------------------------------------------------

  async runTask(input: RunTaskInput): Promise<OpsTask> {
    await this.loadFromDB();

    // --- Input validation ---
    if (!VALID_AGENT_TYPES.includes(input.agentType)) {
      throw new Error(`Invalid agent type: ${input.agentType}. Valid types: ${VALID_AGENT_TYPES.join(', ')}`);
    }
    if (!input.prompt || typeof input.prompt !== 'string' || input.prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string');
    }
    if (input.prompt.length > MAX_PROMPT_LENGTH) {
      throw new Error(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`);
    }
    if (input.context && input.context.length > MAX_CONTEXT_LENGTH) {
      throw new Error(`Context exceeds maximum length of ${MAX_CONTEXT_LENGTH} characters`);
    }
    if (this.runningCount >= MAX_CONCURRENT_TASKS) {
      throw new Error(`Concurrency limit reached (${MAX_CONCURRENT_TASKS} tasks). Please wait for running tasks to complete.`);
    }

    const agent = this.getAgent(input.agentType);
    if (!agent) throw new Error(`Unknown agent type: ${input.agentType}`);

    // Evict old tasks if history is too large
    this.evictStaleTasks();

    const taskId = `task-${crypto.randomUUID().slice(0, 12)}`;
    const sanitizedTitle = (input.title || `${input.agentType} task`).slice(0, 200).replace(/<[^>]*>/g, '');

    const task: OpsTask = {
      id: taskId,
      agentType: input.agentType,
      organizationId: input.organizationId,
      userId: input.userId,
      title: sanitizedTitle,
      prompt: input.prompt.trim(),
      context: input.context?.trim(),
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(taskId, task);

    // Execute async — don't block the response
    this.executeTask(task, agent, input.options).catch(err => {
      logger.error(`[OpsAgent] Task ${taskId} failed:`, err);
    });

    return task;
  }

  private async executeTask(
    task: OpsTask,
    agent: OpsAgent,
    options?: RunTaskInput['options'],
  ): Promise<void> {
    task.status = 'running';
    task.startedAt = new Date().toISOString();
    this.tasks.set(task.id, task);
    this.runningCount++;

    const abortController = new AbortController();
    this.abortControllers.set(task.id, abortController);
    const start = Date.now();

    try {
      // Check if cancelled before starting
      if (abortController.signal.aborted) throw new Error('Task cancelled before execution');

      const available = await ollama.isAvailable();
      if (!available) {
        throw new Error('No AI inference provider available. Configure OPENAI_API_KEY or run Ollama locally.');
      }

      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: agent.systemPrompt },
      ];

      if (task.context) {
        messages.push({ role: 'user', content: `Context/Data:\n${task.context}` });
      }

      messages.push({ role: 'user', content: task.prompt });

      // Check cancellation again before the expensive AI call
      if (abortController.signal.aborted) throw new Error('Task cancelled');

      const response = await ollama.chat(messages, {
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 4096,
        format: options?.format === 'json' ? 'json' : undefined,
      });

      // Check cancellation after AI call returns
      if (abortController.signal.aborted) throw new Error('Task cancelled');

      const result = this.parseResult(task.agentType, response, options?.format);

      // Enterprise tier adds integrity hashing — see datacendia-components
      result.metadata = {
        ...result.metadata,
        agentType: task.agentType,
        tokenEstimate: Math.ceil(result.content.length / 4),
      };

      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date().toISOString();
      task.durationMs = Date.now() - start;

      logger.info(`[OpsAgent] Task ${task.id} (${task.agentType}) completed in ${task.durationMs}ms`);
    } catch (err) {
      const msg = (err as Error).message;
      if (abortController.signal.aborted || msg.includes('cancelled')) {
        task.status = 'cancelled';
      } else {
        task.status = 'failed';
      }
      task.error = msg;
      task.completedAt = new Date().toISOString();
      task.durationMs = Date.now() - start;

      logger.error(`[OpsAgent] Task ${task.id} ${task.status}: ${task.error}`);
    } finally {
      this.runningCount = Math.max(0, this.runningCount - 1);
      this.abortControllers.delete(task.id);
    }

    this.tasks.set(task.id, task);

    await persistServiceRecord({
      serviceName: 'OpsAgent',
      recordType: 'task',
      organizationId: task.organizationId,
      referenceId: task.id,
      data: task,
    });
  }

  private parseResult(agentType: OpsAgentType, rawContent: string, format?: OpsTaskResult['format']): OpsTaskResult {
    const result: OpsTaskResult = {
      content: rawContent,
      format: format || 'markdown',
    };

    // Try to extract structured data based on agent type
    try {
      if (agentType === 'nlp') {
        // Try to extract JSON blocks for classifications/entities/sentiment
        const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed) && parsed[0]?.label && parsed[0]?.confidence !== undefined) {
            result.classifications = parsed;
          }
          if (parsed.sentiment) result.sentiment = parsed.sentiment;
          if (parsed.entities) result.entities = parsed.entities;
        }
      }

      if (agentType === 'pipeline') {
        const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed) && parsed[0]?.order !== undefined) {
            result.steps = parsed;
          }
        }
      }

      if (agentType === 'analytics') {
        const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed)) {
            result.charts = parsed;
          }
        }
      }

      if (agentType === 'report') {
        // Parse markdown sections
        const sectionRegex = /^#{1,3}\s+(.+)$/gm;
        const sections: OpsTaskResult['sections'] = [];
        let match;
        const positions: Array<{ title: string; start: number }> = [];

        while ((match = sectionRegex.exec(rawContent)) !== null) {
          positions.push({ title: match[1], start: match.index + match[0].length });
        }

        for (let i = 0; i < positions.length; i++) {
          const end = i + 1 < positions.length
            ? rawContent.lastIndexOf('\n', positions[i + 1].start - positions[i + 1].title.length - 3)
            : rawContent.length;
          sections.push({
            title: positions[i].title,
            content: rawContent.slice(positions[i].start, end).trim(),
          });
        }

        if (sections.length > 0) result.sections = sections;
      }
    } catch {
      // Structured extraction failed — raw content is still available
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // Task retrieval
  // ---------------------------------------------------------------------------

  async getTask(taskId: string): Promise<OpsTask | null> {
    await this.loadFromDB();
    return this.tasks.get(taskId) ?? null;
  }

  async listTasks(params?: {
    agentType?: OpsAgentType;
    organizationId?: string;
    userId?: string;
    status?: TaskStatus;
    limit?: number;
  }): Promise<OpsTask[]> {
    await this.loadFromDB();
    let tasks = [...this.tasks.values()];

    if (params?.agentType) tasks = tasks.filter(t => t.agentType === params.agentType);
    if (params?.organizationId) tasks = tasks.filter(t => t.organizationId === params.organizationId);
    if (params?.userId) tasks = tasks.filter(t => t.userId === params.userId);
    if (params?.status) tasks = tasks.filter(t => t.status === params.status);

    tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return tasks.slice(0, params?.limit ?? 50);
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') return false;

    // Abort the running inference call if in progress
    const controller = this.abortControllers.get(taskId);
    if (controller) controller.abort();

    task.status = 'cancelled';
    task.completedAt = new Date().toISOString();
    this.tasks.set(taskId, task);
    logger.info(`[OpsAgent] Task ${taskId} cancelled by user`);
    return true;
  }

  private evictStaleTasks(): void {
    if (this.tasks.size <= MAX_TASK_HISTORY) return;
    const now = Date.now();
    const toDelete: string[] = [];
    for (const [id, task] of this.tasks) {
      const age = now - new Date(task.createdAt).getTime();
      if (age > TASK_TTL_MS && task.status !== 'running' && task.status !== 'queued') {
        toDelete.push(id);
      }
    }
    for (const id of toDelete) this.tasks.delete(id);
    if (toDelete.length > 0) logger.info(`[OpsAgent] Evicted ${toDelete.length} stale tasks`);
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  async loadFromDB(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const recs = await loadServiceRecords({ serviceName: 'OpsAgent', recordType: 'task', limit: 500 });
      let staleRecovered = 0;
      for (const rec of recs) {
        const d = rec.data as OpsTask;
        if (!d?.id || this.tasks.has(d.id)) continue;

        // Mark any stale running/queued tasks as failed (server restarted mid-execution)
        if (d.status === 'running' || d.status === 'queued') {
          d.status = 'failed';
          d.error = 'Task interrupted by server restart';
          d.completedAt = d.completedAt || new Date().toISOString();
          staleRecovered++;
        }

        this.tasks.set(d.id, d);
      }
      if (recs.length > 0) logger.info(`[OpsAgent] Restored ${recs.length} tasks from DB (${staleRecovered} stale tasks marked failed)`);
    } catch (err) {
      logger.warn(`[OpsAgent] DB restore skipped: ${(err as Error).message}`);
    }
  }
}

export const opsAgentService = new OpsAgentService();
