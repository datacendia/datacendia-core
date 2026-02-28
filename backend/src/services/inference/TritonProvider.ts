// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NVIDIA TRITON INFERENCE SERVER PROVIDER
// GPU-optimized inference via TensorRT-LLM served by Triton Inference Server.
// Sovereign: ✅  Air-gapped: ✅  Open source: ✅ (BSD-3 + Apache-2.0)
//
// Triton serves TensorRT-LLM engines via its generate/chat endpoints.
// Triton exposes an OpenAI-compatible API when configured with the
// vLLM or TensorRT-LLM backend, making it a near drop-in replacement.
//
// Expected deployment:
//   docker pull nvcr.io/nvidia/tritonserver:<tag>-trtllm-python-py3
//   Model repository mounted at /models with TRT-LLM engines
//
// Environment variables:
//   TRITON_BASE_URL     — e.g. http://localhost:8000
//   TRITON_MODEL_NAME   — e.g. ensemble (default TRT-LLM ensemble name)
// =============================================================================

import { logger } from '../../utils/logger.js';
import type {
  IInferenceProvider, InferenceChatMessage, InferenceOptions,
  InferenceModel, ProviderHealth,
  GenerateResult, ChatResult, EmbedResult, InferenceTelemetry,
} from './InferenceProvider.js';

// Triton with OpenAI-compatible frontend response types
interface TritonChatChoice {
  index: number;
  message: { role: string; content: string };
  finish_reason: string;
}

interface TritonChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: TritonChatChoice[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

interface TritonCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: { index: number; text: string; finish_reason: string }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

interface TritonEmbeddingResponse {
  object: string;
  data: { object: string; embedding: number[]; index: number }[];
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}

interface TritonModelInfo {
  id: string;
  object: string;
  owned_by: string;
}

export class TritonProvider implements IInferenceProvider {
  readonly type = 'triton' as const;
  private baseUrl: string;
  private defaultModel: string;
  private embedModel: string;

  constructor(
    baseUrl?: string,
    defaultModel?: string,
    embedModel?: string,
  ) {
    this.baseUrl = baseUrl || process.env['TRITON_BASE_URL'] || 'http://localhost:8000';
    this.defaultModel = defaultModel || process.env['TRITON_MODEL_NAME'] || 'ensemble';
    this.embedModel = embedModel || process.env['TRITON_EMBED_MODEL'] || 'embedding';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/v2/health/ready`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/v2/health/ready`);
      if (!res.ok) return { provider: 'triton', available: false, error: `HTTP ${res.status}` };

      // Try to get model count via /v1/models (OpenAI compat)
      let modelsLoaded = 0;
      try {
        const modelsRes = await fetch(`${this.baseUrl}/v1/models`);
        if (modelsRes.ok) {
          const modelsData = (await modelsRes.json()) as { data: TritonModelInfo[] };
          modelsLoaded = modelsData.data?.length || 0;
        }
      } catch { /* optional */ }

      // GPU utilization via Triton metrics endpoint
      let gpuUtilization: number | undefined;
      try {
        const metricsRes = await fetch(`${this.baseUrl}/metrics`);
        if (metricsRes.ok) {
          const metricsText = await metricsRes.text();
          const gpuMatch = metricsText.match(/nv_gpu_utilization\{[^}]*\}\s+([\d.]+)/);
          if (gpuMatch) gpuUtilization = parseFloat(gpuMatch[1]);
        }
      } catch { /* optional */ }

      return {
        provider: 'triton',
        available: true,
        latencyMs: Date.now() - start,
        modelsLoaded,
        gpuUtilization,
      };
    } catch (err: any) {
      return { provider: 'triton', available: false, latencyMs: Date.now() - start, error: err.message };
    }
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || this.defaultModel;
  }

  async listModels(): Promise<InferenceModel[]> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`);
      if (!res.ok) return [];
      const data = (await res.json()) as { data: TritonModelInfo[] };
      return (data.data || []).map(m => ({
        name: m.id,
        size: 0,
        family: 'trt-llm',
        parameterSize: 'unknown',
        quantization: 'fp16/int8',
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

    // Use OpenAI-compatible /v1/completions endpoint
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Triton generate failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as TritonCompletionResponse;
    const durationMs = Date.now() - start;
    const text = data.choices?.[0]?.text || '';

    const telemetry: InferenceTelemetry = {
      provider: 'triton', model, durationMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    logger.debug(`[Triton] generate completed in ${durationMs}ms`, { model, tokens: telemetry.totalTokens });
    return { text, telemetry };
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Triton chat failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as TritonChatResponse;
    const durationMs = Date.now() - start;
    const choice = data.choices?.[0];

    const telemetry: InferenceTelemetry = {
      provider: 'triton', model, durationMs,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    logger.debug(`[Triton] chat completed in ${durationMs}ms`, { model, tokens: telemetry.totalTokens });
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

    const res = await fetch(`${this.baseUrl}/v1/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: resolvedModel, input: text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Triton embed failed: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as TritonEmbeddingResponse;
    const durationMs = Date.now() - start;

    return {
      embedding: data.data?.[0]?.embedding || [],
      telemetry: {
        provider: 'triton', model: resolvedModel, durationMs,
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) throw new Error(`Triton stream failed: ${res.status}`);

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
