/**
 * Service — Together AI Inference Provider
 *
 * Cloud LLM provider using Together AI's OpenAI-compatible API.
 * Requires user-provided API key via TOGETHER_API_KEY env var.
 *
 * @module services/inference/TogetherAIProvider
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../../utils/logger.js';
import type {
  IInferenceProvider,
  InferenceChatMessage,
  InferenceOptions,
  InferenceModel,
  ProviderHealth,
  GenerateResult,
  ChatResult,
  EmbedResult,
} from './InferenceProvider.js';

const BASE_URL = 'https://api.together.xyz/v1';
const DEFAULT_MODEL = 'meta-llama/Llama-3-70b-chat-hf';
const EMBED_MODEL = 'togethercomputer/m2-bert-80M-8k-retrieval';

export class TogetherAIProvider implements IInferenceProvider {
  readonly type = 'together' as const;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env['TOGETHER_API_KEY'] || '';
    this.defaultModel = process.env['TOGETHER_MODEL'] || DEFAULT_MODEL;

    if (!this.apiKey) {
      logger.warn('[Together AI] No TOGETHER_API_KEY set — provider will be unavailable. Users must provide their own API key.');
    } else {
      logger.info(`[Together AI] Provider initialized — model: ${this.defaultModel}`);
    }
  }

  private get headers(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const res = await fetch(`${BASE_URL}/models`, { method: 'GET', headers: this.headers });
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    const available = await this.isAvailable();
    return {
      provider: 'together',
      available,
      latencyMs: Date.now() - start,
      error: available ? undefined : 'Together AI API unreachable or TOGETHER_API_KEY not set',
    };
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    if (!this.apiKey) return [];
    try {
      const res = await fetch(`${BASE_URL}/models`, { headers: this.headers });
      if (!res.ok) return [];
      const data = await res.json() as { data?: Array<{ id: string; type?: string }> };
      return (data.data || []).slice(0, 50).map(m => ({
        name: m.id,
        size: 0,
        family: m.type || 'unknown',
        parameterSize: 'unknown',
        quantization: 'none',
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
    const messages: InferenceChatMessage[] = [{ role: 'user', content: prompt }];
    if (options.system) {
      messages.unshift({ role: 'system', content: options.system });
    }
    const chatResult = await this.chatWithTelemetry(messages, options);
    return { text: chatResult.message.content, telemetry: chatResult.telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    if (!this.apiKey) throw new Error('TOGETHER_API_KEY not configured');
    const start = Date.now();
    const model = options.model || this.defaultModel;

    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
    };
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.stop) body.stop = options.stop;
    if (options.format === 'json') body.response_format = { type: 'json_object' };

    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Together AI error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      choices: Array<{ message: { role: string; content: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    };

    const content = data.choices?.[0]?.message?.content || '';
    return {
      message: { role: 'assistant', content },
      telemetry: {
        provider: 'together',
        model,
        durationMs: Date.now() - start,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    if (!this.apiKey) throw new Error('TOGETHER_API_KEY not configured');
    const start = Date.now();
    const embedModel = model || EMBED_MODEL;

    const res = await fetch(`${BASE_URL}/embeddings`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ model: embedModel, input: text }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Together AI embed error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      data: Array<{ embedding: number[] }>;
      usage?: { total_tokens?: number };
    };

    return {
      embedding: data.data?.[0]?.embedding || [],
      telemetry: {
        provider: 'together',
        model: embedModel,
        durationMs: Date.now() - start,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) throw new Error('TOGETHER_API_KEY not configured');
    const model = options.model || this.defaultModel;

    const body: Record<string, unknown> = {
      model,
      messages,
      stream: true,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
    };

    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Together AI stream error ${res.status}: ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
        try {
          const json = JSON.parse(line.slice(6)) as { choices?: Array<{ delta?: { content?: string } }> };
          const content = json.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch { /* skip malformed */ }
      }
    }
  }
}
