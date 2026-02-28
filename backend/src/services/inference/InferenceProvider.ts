// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA INFERENCE PROVIDER ABSTRACTION
// Vendor-neutral interface for LLM inference backends.
// Sovereign-compatible: all providers run on-premise, no external API calls.
//
// Supported backends:
//   - Ollama        (default, CPU/GPU, open-source)
//   - NVIDIA Triton (TensorRT-LLM, GPU-optimized, 5-10x faster)
//   - NVIDIA NIM    (self-hosted microservice, GPU-optimized)
// =============================================================================

/**
 * Chat message format shared across all providers.
 */
export interface InferenceChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Common generation options applicable to all providers.
 */
export interface InferenceOptions {
  model?: string;
  system?: string;
  format?: 'json';
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stop?: string[];
  seed?: number;
  repeat_penalty?: number;
}

/**
 * Telemetry returned with every inference call for observability.
 */
export interface InferenceTelemetry {
  provider: InferenceProviderType;
  model: string;
  durationMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cached?: boolean;
}

/**
 * Result of a generate() call.
 */
export interface GenerateResult {
  text: string;
  telemetry: InferenceTelemetry;
}

/**
 * Result of a chat() call.
 */
export interface ChatResult {
  message: InferenceChatMessage;
  telemetry: InferenceTelemetry;
}

/**
 * Result of an embed() call.
 */
export interface EmbedResult {
  embedding: number[];
  telemetry: InferenceTelemetry;
}

/**
 * Model metadata returned by listModels().
 */
export interface InferenceModel {
  name: string;
  size: number;
  family: string;
  parameterSize: string;
  quantization: string;
  modifiedAt: string;
}

/**
 * Supported inference provider backends.
 */
export type InferenceProviderType = 'ollama' | 'triton' | 'nim';

/**
 * Provider health status.
 */
export interface ProviderHealth {
  provider: InferenceProviderType;
  available: boolean;
  latencyMs?: number;
  modelsLoaded?: number;
  gpuUtilization?: number;
  error?: string;
}

// =============================================================================
// CORE INTERFACE — Every provider must implement this
// =============================================================================

export interface IInferenceProvider {
  /** Provider type identifier */
  readonly type: InferenceProviderType;

  /** Check if the provider backend is reachable */
  isAvailable(): Promise<boolean>;

  /** Health check with detailed metrics */
  healthCheck(): Promise<ProviderHealth>;

  /** Resolve the best available model name */
  resolveModel(requested?: string): Promise<string>;

  /** List available models */
  listModels(): Promise<InferenceModel[]>;

  /** Text completion (non-chat) */
  generate(prompt: string, options?: InferenceOptions): Promise<string>;

  /** Chat completion (multi-turn) */
  chat(messages: InferenceChatMessage[], options?: InferenceOptions): Promise<InferenceChatMessage>;

  /** Generate embeddings */
  embed(text: string, model?: string): Promise<number[]>;

  /** Streaming chat completion */
  streamChat(messages: InferenceChatMessage[], options?: InferenceOptions): AsyncGenerator<string, void, unknown>;

  /** Generate with full telemetry */
  generateWithTelemetry(prompt: string, options?: InferenceOptions): Promise<GenerateResult>;

  /** Chat with full telemetry */
  chatWithTelemetry(messages: InferenceChatMessage[], options?: InferenceOptions): Promise<ChatResult>;

  /** Embed with full telemetry */
  embedWithTelemetry(text: string, model?: string): Promise<EmbedResult>;
}
