/**
 * Service — Anthropic Claude Inference Provider
 *
 * Cloud LLM provider using Anthropic's Messages API.
 * Requires user-provided API key via ANTHROPIC_API_KEY env var.
 *
 * @module services/inference/AnthropicProvider
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

const BASE_URL = 'https://api.anthropic.com/v1';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const API_VERSION = '2023-06-01';

export class AnthropicProvider implements IInferenceProvider {
  readonly type = 'anthropic' as const;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env['ANTHROPIC_API_KEY'] || '';
    this.defaultModel = process.env['ANTHROPIC_MODEL'] || DEFAULT_MODEL;

    if (!this.apiKey) {
      logger.warn('[Anthropic] No ANTHROPIC_API_KEY set — provider will be unavailable. Users must provide their own API key.');
    } else {
      logger.info(`[Anthropic] Provider initialized — model: ${this.defaultModel}`);
    }
  }

  private get headers(): Record<string, string> {
    return {
      'x-api-key': this.apiKey,
      'anthropic-version': API_VERSION,
      'Content-Type': 'application/json',
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      // Anthropic doesn't have a simple /models endpoint; try a minimal request
      const res = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.defaultModel,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });
      return res.ok || res.status === 400; // 400 = API reachable but bad request
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    const available = await this.isAvailable();
    return {
      provider: 'anthropic',
      available,
      latencyMs: Date.now() - start,
      error: available ? undefined : 'Anthropic API unreachable or ANTHROPIC_API_KEY not set',
    };
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    // Anthropic doesn't expose a public model listing endpoint
    const models = [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
    ];
    return models.map(name => ({
      name,
      size: 0,
      family: 'claude',
      parameterSize: 'unknown',
      quantization: 'none',
      modifiedAt: new Date().toISOString(),
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

  async embed(_text: string, _model?: string): Promise<number[]> {
    throw new Error('Anthropic does not support embeddings. Use a different provider for embeddings.');
  }

  async generateWithTelemetry(prompt: string, options: InferenceOptions = {}): Promise<GenerateResult> {
    const messages: InferenceChatMessage[] = [{ role: 'user', content: prompt }];
    const chatResult = await this.chatWithTelemetry(messages, { ...options, system: options.system });
    return { text: chatResult.message.content, telemetry: chatResult.telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    if (!this.apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
    const start = Date.now();
    const model = options.model || this.defaultModel;

    // Anthropic separates system from messages
    const systemMsg = options.system || messages.find(m => m.role === 'system')?.content;
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role, content: m.content }));

    const body: Record<string, unknown> = {
      model,
      messages: chatMessages,
      max_tokens: options.max_tokens ?? 2048,
    };
    if (systemMsg) body.system = systemMsg;
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.top_p !== undefined) body.top_p = options.top_p;
    if (options.top_k !== undefined) body.top_k = options.top_k;
    if (options.stop) body.stop_sequences = options.stop;

    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      content: Array<{ type: string; text: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };

    const content = data.content?.find(c => c.type === 'text')?.text || '';
    const inputTokens = data.usage?.input_tokens;
    const outputTokens = data.usage?.output_tokens;

    return {
      message: { role: 'assistant', content },
      telemetry: {
        provider: 'anthropic',
        model,
        durationMs: Date.now() - start,
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        totalTokens: (inputTokens || 0) + (outputTokens || 0),
      },
    };
  }

  async embedWithTelemetry(_text: string, _model?: string): Promise<EmbedResult> {
    throw new Error('Anthropic does not support embeddings. Use a different provider for embeddings.');
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
    const model = options.model || this.defaultModel;

    const systemMsg = options.system || messages.find(m => m.role === 'system')?.content;
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role, content: m.content }));

    const body: Record<string, unknown> = {
      model,
      messages: chatMessages,
      max_tokens: options.max_tokens ?? 2048,
      stream: true,
    };
    if (systemMsg) body.system = systemMsg;
    if (options.temperature !== undefined) body.temperature = options.temperature;

    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic stream error ${res.status}: ${err}`);
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
        if (!line.startsWith('data: ')) continue;
        try {
          const json = JSON.parse(line.slice(6)) as {
            type?: string;
            delta?: { type?: string; text?: string };
          };
          if (json.type === 'content_block_delta' && json.delta?.text) {
            yield json.delta.text;
          }
        } catch { /* skip malformed */ }
      }
    }
  }
}
