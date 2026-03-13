/**
 * Service — Google Gemini Inference Provider
 *
 * Cloud LLM provider using Google's Gemini API.
 * Requires user-provided API key via GEMINI_API_KEY env var.
 *
 * @module services/inference/GeminiProvider
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

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash';
const EMBED_MODEL = 'text-embedding-004';

export class GeminiProvider implements IInferenceProvider {
  readonly type = 'gemini' as const;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env['GEMINI_API_KEY'] || '';
    this.defaultModel = process.env['GEMINI_MODEL'] || DEFAULT_MODEL;

    if (!this.apiKey) {
      logger.warn('[Gemini] No GEMINI_API_KEY set — provider will be unavailable. Users must provide their own API key.');
    } else {
      logger.info(`[Gemini] Provider initialized — model: ${this.defaultModel}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const res = await fetch(`${BASE_URL}/models?key=${this.apiKey}`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    const available = await this.isAvailable();
    return {
      provider: 'gemini',
      available,
      latencyMs: Date.now() - start,
      error: available ? undefined : 'Gemini API unreachable or GEMINI_API_KEY not set',
    };
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    if (!this.apiKey) return [];
    try {
      const res = await fetch(`${BASE_URL}/models?key=${this.apiKey}`);
      if (!res.ok) return [];
      const data = await res.json() as { models?: Array<{ name: string; displayName?: string }> };
      return (data.models || []).slice(0, 50).map(m => ({
        name: m.name.replace('models/', ''),
        size: 0,
        family: 'gemini',
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
    if (!this.apiKey) throw new Error('GEMINI_API_KEY not configured');
    const start = Date.now();
    const model = options.model || this.defaultModel;

    // Convert to Gemini format
    const systemInstruction = options.system || messages.find(m => m.role === 'system')?.content;
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: Record<string, unknown> = { contents };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const generationConfig: Record<string, unknown> = {};
    if (options.temperature !== undefined) generationConfig.temperature = options.temperature;
    if (options.top_p !== undefined) generationConfig.topP = options.top_p;
    if (options.top_k !== undefined) generationConfig.topK = options.top_k;
    if (options.max_tokens !== undefined) generationConfig.maxOutputTokens = options.max_tokens;
    if (options.stop) generationConfig.stopSequences = options.stop;
    if (options.format === 'json') generationConfig.responseMimeType = 'application/json';
    if (Object.keys(generationConfig).length > 0) body.generationConfig = generationConfig;

    const url = `${BASE_URL}/models/${model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
    };

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
      message: { role: 'assistant', content },
      telemetry: {
        provider: 'gemini',
        model,
        durationMs: Date.now() - start,
        promptTokens: data.usageMetadata?.promptTokenCount,
        completionTokens: data.usageMetadata?.candidatesTokenCount,
        totalTokens: data.usageMetadata?.totalTokenCount,
      },
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    if (!this.apiKey) throw new Error('GEMINI_API_KEY not configured');
    const start = Date.now();
    const embedModel = model || EMBED_MODEL;

    const url = `${BASE_URL}/models/${embedModel}:embedContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${embedModel}`,
        content: { parts: [{ text }] },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini embed error ${res.status}: ${err}`);
    }

    const data = await res.json() as { embedding?: { values?: number[] } };
    return {
      embedding: data.embedding?.values || [],
      telemetry: {
        provider: 'gemini',
        model: embedModel,
        durationMs: Date.now() - start,
      },
    };
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) throw new Error('GEMINI_API_KEY not configured');
    const model = options.model || this.defaultModel;

    const systemInstruction = options.system || messages.find(m => m.role === 'system')?.content;
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: Record<string, unknown> = { contents };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const generationConfig: Record<string, unknown> = {};
    if (options.temperature !== undefined) generationConfig.temperature = options.temperature;
    if (options.max_tokens !== undefined) generationConfig.maxOutputTokens = options.max_tokens;
    if (Object.keys(generationConfig).length > 0) body.generationConfig = generationConfig;

    const url = `${BASE_URL}/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini stream error ${res.status}: ${err}`);
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
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch { /* skip malformed */ }
      }
    }
  }
}
