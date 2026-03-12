// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// OPENAI-COMPATIBLE INFERENCE PROVIDER
// Works with OpenAI, Groq, Together AI, Mistral, and any OpenAI-compatible API.
// Cloud-ready: ✅  Railway-compatible: ✅  No local GPU needed: ✅
// =============================================================================

import { logger } from '../../utils/logger.js';
import type {
  IInferenceProvider, InferenceChatMessage, InferenceOptions,
  InferenceModel, ProviderHealth, InferenceProviderType,
  GenerateResult, ChatResult, EmbedResult, InferenceTelemetry,
} from './InferenceProvider.js';

interface OpenAIChatResponse {
  id: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface OpenAIModelsResponse {
  data: Array<{ id: string; owned_by: string; created: number }>;
}

interface OpenAIEmbeddingResponse {
  data: Array<{ embedding: number[]; index: number }>;
  usage?: { prompt_tokens: number; total_tokens: number };
}

export class OpenAIProvider implements IInferenceProvider {
  readonly type: InferenceProviderType = 'openai' as any;
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;
  private embeddingModel: string;

  constructor(opts?: { baseUrl?: string; apiKey?: string; defaultModel?: string; embeddingModel?: string }) {
    this.apiKey = opts?.apiKey || process.env.OPENAI_API_KEY || '';
    this.defaultModel = opts?.defaultModel || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.embeddingModel = opts?.embeddingModel || process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

    // Support Groq, Together, Mistral, etc. via custom base URL
    const envBase = process.env.OPENAI_BASE_URL || process.env.OPENAI_API_BASE || '';
    this.baseUrl = (opts?.baseUrl || envBase || 'https://api.openai.com/v1').replace(/\/+$/, '');

    if (!this.apiKey) {
      logger.warn('[OpenAI] No API key configured — set OPENAI_API_KEY');
    }
  }

  private headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const res = await fetch(`${this.baseUrl}/models`, { headers: this.headers(), signal: AbortSignal.timeout(5000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    if (!this.apiKey) {
      return { provider: this.type, available: false, error: 'No API key configured' };
    }
    try {
      const res = await fetch(`${this.baseUrl}/models`, { headers: this.headers(), signal: AbortSignal.timeout(5000) });
      if (!res.ok) return { provider: this.type, available: false, error: `HTTP ${res.status}`, latencyMs: Date.now() - start };
      const data = (await res.json()) as OpenAIModelsResponse;
      return { provider: this.type, available: true, latencyMs: Date.now() - start, modelsLoaded: data.data?.length || 0 };
    } catch (err: any) {
      return { provider: this.type, available: false, latencyMs: Date.now() - start, error: err.message };
    }
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    const res = await fetch(`${this.baseUrl}/models`, { headers: this.headers() });
    if (!res.ok) throw new Error(`OpenAI listModels failed: HTTP ${res.status}`);
    const data = (await res.json()) as OpenAIModelsResponse;
    return (data.data || []).map(m => ({
      name: m.id,
      size: 0,
      family: m.owned_by || 'openai',
      parameterSize: 'unknown',
      quantization: 'none',
      modifiedAt: new Date(m.created * 1000).toISOString(),
    }));
  }

  async generate(prompt: string, options: InferenceOptions = {}): Promise<string> {
    const result = await this.generateWithTelemetry(prompt, options);
    return result.text;
  }

  async chat(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<InferenceChatMessage> {
    const result = await this.chatWithTelemetry(messages, options);
    return result.message;
  }

  async embed(text: string, model?: string): Promise<number[]> {
    const result = await this.embedWithTelemetry(text, model);
    return result.embedding;
  }

  async generateWithTelemetry(prompt: string, options: InferenceOptions = {}): Promise<GenerateResult> {
    const messages: InferenceChatMessage[] = [];
    if (options.system) messages.push({ role: 'system', content: options.system });
    messages.push({ role: 'user', content: prompt });
    const chatResult = await this.chatWithTelemetry(messages, options);
    return { text: chatResult.message.content, telemetry: chatResult.telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    const model = options.model || this.defaultModel;
    const start = Date.now();

    const body: Record<string, unknown> = {
      model,
      messages,
      stream: false,
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens;
    if (options.stop) body.stop = options.stop;
    if (options.seed !== undefined) body.seed = options.seed;
    if (options.format === 'json') body.response_format = { type: 'json_object' };

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI chat failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as OpenAIChatResponse;
    const durationMs = Date.now() - start;
    const choice = data.choices?.[0];

    const telemetry: InferenceTelemetry = {
      provider: this.type,
      model: data.model || model,
      durationMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    logger.debug(`[OpenAI] chat completed in ${durationMs}ms`, { model, tokens: telemetry.totalTokens });

    return {
      message: {
        role: 'assistant',
        content: choice?.message?.content || '',
      },
      telemetry,
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    const resolvedModel = model || this.embeddingModel;
    const start = Date.now();

    const res = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ model: resolvedModel, input: text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI embed failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as OpenAIEmbeddingResponse;
    const durationMs = Date.now() - start;

    return {
      embedding: data.data?.[0]?.embedding || [],
      telemetry: { provider: this.type, model: resolvedModel, durationMs },
    };
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    const model = options.model || this.defaultModel;

    const body: Record<string, unknown> = {
      model,
      messages,
      stream: true,
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) throw new Error(`OpenAI stream failed: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') return;
          try {
            const data = JSON.parse(payload);
            const delta = data.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch { /* skip malformed */ }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
