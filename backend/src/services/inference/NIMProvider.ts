// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NVIDIA NIM (NVIDIA INFERENCE MICROSERVICE) PROVIDER
// Self-hosted, GPU-optimized inference microservice.
// Sovereign: ✅  Air-gapped: ✅  Open source: ✅ (container from NGC)
//
// NIM exposes an OpenAI-compatible REST API out of the box.
// Deploy via:
//   docker run --gpus all -p 8000:8000 nvcr.io/nim/<model>:latest
//
// Environment variables:
//   NIM_BASE_URL       — e.g. http://localhost:8000
//   NIM_MODEL_NAME     — model identifier (e.g. meta/llama-3.1-70b-instruct)
//   NIM_API_KEY        — optional auth key (for multi-tenant setups)
//   NIM_EMBED_URL      — separate NIM instance for embeddings (optional)
// =============================================================================

import { logger } from '../../utils/logger.js';
import type {
  IInferenceProvider, InferenceChatMessage, InferenceOptions,
  InferenceModel, ProviderHealth,
  GenerateResult, ChatResult, EmbedResult, InferenceTelemetry,
} from './InferenceProvider.js';

interface NIMChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: { index: number; message: { role: string; content: string }; finish_reason: string }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

interface NIMCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: { index: number; text: string; finish_reason: string }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

interface NIMEmbeddingResponse {
  object: string;
  data: { object: string; embedding: number[]; index: number }[];
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}

export class NIMProvider implements IInferenceProvider {
  readonly type = 'nim' as const;
  private baseUrl: string;
  private embedUrl: string;
  private defaultModel: string;
  private embedModel: string;
  private apiKey: string | undefined;

  constructor(
    baseUrl?: string,
    defaultModel?: string,
    embedUrl?: string,
    embedModel?: string,
    apiKey?: string,
  ) {
    this.baseUrl = baseUrl || process.env['NIM_BASE_URL'] || 'http://localhost:8000';
    this.embedUrl = embedUrl || process.env['NIM_EMBED_URL'] || this.baseUrl;
    this.defaultModel = defaultModel || process.env['NIM_MODEL_NAME'] || 'meta/llama-3.1-70b-instruct';
    this.embedModel = embedModel || process.env['NIM_EMBED_MODEL'] || 'nvidia/nv-embedqa-e5-v5';
    this.apiKey = apiKey || process.env['NIM_API_KEY'];
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { headers: this.headers() });
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { headers: this.headers() });
      if (!res.ok) return { provider: 'nim', available: false, error: `HTTP ${res.status}` };
      const data = (await res.json()) as { data: { id: string }[] };
      return {
        provider: 'nim',
        available: true,
        latencyMs: Date.now() - start,
        modelsLoaded: data.data?.length || 0,
      };
    } catch (err: any) {
      return { provider: 'nim', available: false, latencyMs: Date.now() - start, error: err.message };
    }
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { headers: this.headers() });
      if (!res.ok) return [];
      const data = (await res.json()) as { data: { id: string; owned_by: string }[] };
      return (data.data || []).map(m => ({
        name: m.id,
        size: 0,
        family: 'nim',
        parameterSize: 'unknown',
        quantization: 'fp16',
        modifiedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
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
    const model = options.model || this.defaultModel;
    const start = Date.now();

    const body: Record<string, unknown> = {
      model,
      prompt,
      max_tokens: options.max_tokens || 4096,
      stream: false,
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.stop) body.stop = options.stop;
    if (options.seed !== undefined) body.seed = options.seed;

    const res = await fetch(`${this.baseUrl}/v1/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NIM generate failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as NIMCompletionResponse;
    const durationMs = Date.now() - start;

    const telemetry: InferenceTelemetry = {
      provider: 'nim', model, durationMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    logger.debug(`[NIM] generate completed in ${durationMs}ms`, { model, tokens: telemetry.totalTokens });
    return { text: data.choices?.[0]?.text || '', telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    const model = options.model || this.defaultModel;
    const start = Date.now();

    const body: Record<string, unknown> = {
      model,
      messages,
      max_tokens: options.max_tokens || 4096,
      stream: false,
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.stop) body.stop = options.stop;
    if (options.seed !== undefined) body.seed = options.seed;
    if (options.format === 'json') {
      body.response_format = { type: 'json_object' };
    }

    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NIM chat failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as NIMChatResponse;
    const durationMs = Date.now() - start;
    const choice = data.choices?.[0];

    const telemetry: InferenceTelemetry = {
      provider: 'nim', model, durationMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    logger.debug(`[NIM] chat completed in ${durationMs}ms`, { model, tokens: telemetry.totalTokens });
    return {
      message: {
        role: (choice?.message?.role as 'assistant') || 'assistant',
        content: choice?.message?.content || '',
      },
      telemetry,
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    const resolvedModel = model || this.embedModel;
    const start = Date.now();

    const res = await fetch(`${this.embedUrl}/v1/embeddings`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ model: resolvedModel, input: text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NIM embed failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as NIMEmbeddingResponse;
    const durationMs = Date.now() - start;

    return {
      embedding: data.data?.[0]?.embedding || [],
      telemetry: {
        provider: 'nim', model: resolvedModel, durationMs,
        promptTokens: data.usage?.prompt_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    const model = options.model || this.defaultModel;

    const body: Record<string, unknown> = {
      model,
      messages,
      max_tokens: options.max_tokens || 4096,
      stream: true,
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;

    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) throw new Error(`NIM stream failed: ${res.status}`);

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
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const chunk = JSON.parse(trimmed.slice(6));
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) yield delta;
            } catch { /* skip malformed SSE */ }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
