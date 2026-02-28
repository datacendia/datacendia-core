// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// OLLAMA INFERENCE PROVIDER
// Default provider for local CPU/GPU inference via Ollama.
// Sovereign: ✅  Air-gapped: ✅  Open source: ✅
// =============================================================================

import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import type {
  IInferenceProvider, InferenceChatMessage, InferenceOptions,
  InferenceModel, ProviderHealth,
  GenerateResult, ChatResult, EmbedResult, InferenceTelemetry,
} from './InferenceProvider.js';

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaChatResponse {
  model: string;
  message: { role: string; content: string };
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaTagsResponse {
  models: {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
      format: string;
      family: string;
      families: string[] | null;
      parameter_size: string;
      quantization_level: string;
    };
  }[];
}

export class OllamaProvider implements IInferenceProvider {
  readonly type = 'ollama' as const;
  private baseUrl: string;
  private defaultModel: string;
  private cachedModelNames: string[] | null = null;
  private modelCacheTime = 0;

  constructor(baseUrl?: string, defaultModel?: string) {
    this.baseUrl = baseUrl || config.ollamaBaseUrl;
    this.defaultModel = defaultModel || config.ollamaModel;
  }

  private async getCachedModelNames(): Promise<string[]> {
    if (this.cachedModelNames && Date.now() - this.modelCacheTime < 60_000) {
      return this.cachedModelNames;
    }
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) return [];
      const data = (await res.json()) as OllamaTagsResponse;
      this.cachedModelNames = data.models.map(m => m.name);
      this.modelCacheTime = Date.now();
      return this.cachedModelNames;
    } catch {
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) return { provider: 'ollama', available: false, error: `HTTP ${res.status}` };
      const data = (await res.json()) as OllamaTagsResponse;
      return {
        provider: 'ollama',
        available: true,
        latencyMs: Date.now() - start,
        modelsLoaded: data.models.length,
      };
    } catch (err: any) {
      return { provider: 'ollama', available: false, latencyMs: Date.now() - start, error: err.message };
    }
  }

  async resolveModel(requested?: string): Promise<string> {
    const models = await this.getCachedModelNames();
    const target = requested || this.defaultModel;
    if (models.includes(target)) return target;
    const prefix = models.find(m => m.startsWith(target.split(':')[0]));
    if (prefix) return prefix;
    if (models.includes(this.defaultModel)) return this.defaultModel;
    if (models.length > 0) {
      logger.warn(`[Ollama] Model '${target}' not found, using '${models[0]}'`);
      return models[0];
    }
    return target;
  }

  async listModels(): Promise<InferenceModel[]> {
    const res = await fetch(`${this.baseUrl}/api/tags`);
    if (!res.ok) throw new Error(`Ollama listModels failed: HTTP ${res.status}`);
    const data = (await res.json()) as OllamaTagsResponse;
    return data.models.map(m => ({
      name: m.name,
      size: m.size,
      family: m.details.family,
      parameterSize: m.details.parameter_size,
      quantization: m.details.quantization_level,
      modifiedAt: m.modified_at,
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
    const resolvedModel = await this.resolveModel(options.model || this.defaultModel);
    const start = Date.now();

    const body: Record<string, unknown> = {
      model: resolvedModel,
      prompt,
      stream: false,
    };
    if (options.system) body.system = options.system;
    if (options.format) body.format = options.format;
    const ollamaOptions: Record<string, unknown> = {};
    if (options.temperature !== undefined) ollamaOptions.temperature = options.temperature;
    if (options.top_p !== undefined) ollamaOptions.top_p = options.top_p;
    if (options.top_k !== undefined) ollamaOptions.top_k = options.top_k;
    if (options.max_tokens !== undefined) ollamaOptions.num_predict = options.max_tokens;
    if (options.stop) ollamaOptions.stop = options.stop;
    if (options.seed !== undefined) ollamaOptions.seed = options.seed;
    if (options.repeat_penalty !== undefined) ollamaOptions.repeat_penalty = options.repeat_penalty;
    if (Object.keys(ollamaOptions).length > 0) body.options = ollamaOptions;

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama generate failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as OllamaGenerateResponse;
    const durationMs = Date.now() - start;
    const telemetry: InferenceTelemetry = {
      provider: 'ollama', model: resolvedModel, durationMs,
      promptTokens: data.prompt_eval_count, completionTokens: data.eval_count,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    };

    logger.debug(`[Ollama] generate completed in ${durationMs}ms`, { model: resolvedModel, tokens: telemetry.totalTokens });
    return { text: data.response, telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    const resolvedModel = await this.resolveModel(options.model || this.defaultModel);
    const start = Date.now();

    const body: Record<string, unknown> = {
      model: resolvedModel,
      messages,
      stream: false,
    };
    if (options.format) body.format = options.format;
    const ollamaOptions: Record<string, unknown> = {};
    if (options.temperature !== undefined) ollamaOptions.temperature = options.temperature;
    if (options.top_p !== undefined) ollamaOptions.top_p = options.top_p;
    if (options.top_k !== undefined) ollamaOptions.top_k = options.top_k;
    if (options.max_tokens !== undefined) ollamaOptions.num_predict = options.max_tokens;
    if (options.stop) ollamaOptions.stop = options.stop;
    if (options.seed !== undefined) ollamaOptions.seed = options.seed;
    if (Object.keys(ollamaOptions).length > 0) body.options = ollamaOptions;

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama chat failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as OllamaChatResponse;
    const durationMs = Date.now() - start;
    const telemetry: InferenceTelemetry = {
      provider: 'ollama', model: resolvedModel, durationMs,
      promptTokens: data.prompt_eval_count, completionTokens: data.eval_count,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    };

    logger.debug(`[Ollama] chat completed in ${durationMs}ms`, { model: resolvedModel, tokens: telemetry.totalTokens });
    return {
      message: { role: data.message.role as 'assistant', content: data.message.content },
      telemetry,
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    const resolvedModel = model || 'qwen3-embedding:4b';
    const start = Date.now();

    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: resolvedModel, prompt: text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama embed failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as { embedding: number[] };
    const durationMs = Date.now() - start;

    return {
      embedding: data.embedding,
      telemetry: { provider: 'ollama', model: resolvedModel, durationMs },
    };
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    const resolvedModel = await this.resolveModel(options.model || this.defaultModel);
    const body: Record<string, unknown> = {
      model: resolvedModel,
      messages,
      stream: true,
    };
    if (options.format) body.format = options.format;
    const ollamaOptions: Record<string, unknown> = {};
    if (options.temperature !== undefined) ollamaOptions.temperature = options.temperature;
    if (options.top_p !== undefined) ollamaOptions.top_p = options.top_p;
    if (options.max_tokens !== undefined) ollamaOptions.num_predict = options.max_tokens;
    if (Object.keys(ollamaOptions).length > 0) body.options = ollamaOptions;

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) throw new Error(`Ollama stream failed: ${res.status}`);

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
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as OllamaChatResponse;
              if (data.message?.content) yield data.message.content;
            } catch { /* skip malformed */ }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
