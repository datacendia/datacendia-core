// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA INFERENCE SERVICE
// Unified facade over multiple inference providers (Ollama, Triton, NIM).
// Provides automatic failover, health monitoring, and telemetry aggregation.
//
// The singleton `inference` export is a drop-in replacement for the original
// `ollama` singleton — all 45+ consuming services work without modification.
//
// Configuration via environment:
//   INFERENCE_PROVIDER  — 'ollama' (default) | 'triton' | 'nim'
//   INFERENCE_FAILOVER  — 'true' to auto-fallback to Ollama if GPU provider is down
//
// For Triton:  TRITON_BASE_URL, TRITON_MODEL_NAME
// For NIM:     NIM_BASE_URL, NIM_MODEL_NAME, NIM_API_KEY
// For Ollama:  OLLAMA_BASE_URL, OLLAMA_MODEL (existing config)
// =============================================================================

import { logger } from '../../utils/logger.js';
import { OllamaProvider } from './OllamaProvider.js';
import { TritonProvider } from './TritonProvider.js';
import { NIMProvider } from './NIMProvider.js';
import type {
  IInferenceProvider, InferenceProviderType, InferenceChatMessage,
  InferenceOptions, InferenceModel, ProviderHealth,
  GenerateResult, ChatResult, EmbedResult,
} from './InferenceProvider.js';

export interface InferenceServiceConfig {
  provider: InferenceProviderType;
  failoverEnabled: boolean;
}

class InferenceService implements IInferenceProvider {
  readonly type: InferenceProviderType;
  private primary: IInferenceProvider;
  private fallback: IInferenceProvider | null;
  private failoverEnabled: boolean;
  private failoverActive = false;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    const providerEnv = (process.env['INFERENCE_PROVIDER'] || 'ollama').toLowerCase() as InferenceProviderType;
    this.failoverEnabled = process.env['INFERENCE_FAILOVER'] === 'true';
    this.type = providerEnv;

    // Instantiate providers
    const ollamaProvider = new OllamaProvider();

    switch (providerEnv) {
      case 'triton':
        this.primary = new TritonProvider();
        this.fallback = this.failoverEnabled ? ollamaProvider : null;
        logger.info('[Inference] Primary provider: NVIDIA Triton (TensorRT-LLM)');
        break;
      case 'nim':
        this.primary = new NIMProvider();
        this.fallback = this.failoverEnabled ? ollamaProvider : null;
        logger.info('[Inference] Primary provider: NVIDIA NIM (self-hosted)');
        break;
      case 'ollama':
      default:
        this.primary = ollamaProvider;
        this.fallback = null;
        logger.info('[Inference] Primary provider: Ollama (local)');
        break;
    }

    if (this.fallback) {
      logger.info('[Inference] Failover enabled → Ollama fallback active');
    }

    // Periodic health check (every 30s) when failover is enabled
    if (this.failoverEnabled) {
      this.healthCheckInterval = setInterval(() => this.checkAndRecover(), 30_000);
    }
  }

  /**
   * Get the currently active provider (may be fallback).
   */
  private get active(): IInferenceProvider {
    return this.failoverActive && this.fallback ? this.fallback : this.primary;
  }

  /**
   * Execute with automatic failover.
   */
  private async withFailover<T>(operation: (provider: IInferenceProvider) => Promise<T>, label: string): Promise<T> {
    try {
      return await operation(this.active);
    } catch (primaryError) {
      if (!this.fallback || this.failoverActive) throw primaryError;

      logger.warn(`[Inference] ${label} failed on ${this.primary.type}, failing over to ${this.fallback.type}`, primaryError);
      this.failoverActive = true;

      try {
        return await operation(this.fallback);
      } catch (fallbackError) {
        logger.error(`[Inference] ${label} failed on fallback ${this.fallback.type} too`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Periodic recovery check: if primary comes back, switch back.
   */
  private async checkAndRecover(): Promise<void> {
    if (!this.failoverActive) return;
    try {
      const available = await this.primary.isAvailable();
      if (available) {
        logger.info(`[Inference] Primary provider ${this.primary.type} recovered — switching back`);
        this.failoverActive = false;
      }
    } catch {
      // Still down
    }
  }

  // ─── IInferenceProvider Implementation ──────────────────────────────────

  async isAvailable(): Promise<boolean> {
    return this.active.isAvailable();
  }

  async healthCheck(): Promise<ProviderHealth> {
    return this.active.healthCheck();
  }

  /**
   * Health check for all configured providers.
   */
  async healthCheckAll(): Promise<ProviderHealth[]> {
    const results: ProviderHealth[] = [await this.primary.healthCheck()];
    if (this.fallback) results.push(await this.fallback.healthCheck());
    return results;
  }

  async resolveModel(requested?: string): Promise<string> {
    return this.active.resolveModel(requested);
  }

  async listModels(): Promise<InferenceModel[]> {
    return this.withFailover(p => p.listModels(), 'listModels');
  }

  async generate(prompt: string, options: InferenceOptions = {}): Promise<string> {
    return this.withFailover(p => p.generate(prompt, options), 'generate');
  }

  async chat(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<InferenceChatMessage> {
    return this.withFailover(p => p.chat(messages, options), 'chat');
  }

  async embed(text: string, model?: string): Promise<number[]> {
    return this.withFailover(p => p.embed(text, model), 'embed');
  }

  async generateWithTelemetry(prompt: string, options: InferenceOptions = {}): Promise<GenerateResult> {
    return this.withFailover(p => p.generateWithTelemetry(prompt, options), 'generateWithTelemetry');
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options: InferenceOptions = {}): Promise<ChatResult> {
    return this.withFailover(p => p.chatWithTelemetry(messages, options), 'chatWithTelemetry');
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    return this.withFailover(p => p.embedWithTelemetry(text, model), 'embedWithTelemetry');
  }

  async *streamChat(messages: InferenceChatMessage[], options: InferenceOptions = {}): AsyncGenerator<string, void, unknown> {
    // Streaming doesn't support transparent failover mid-stream,
    // but we can failover before starting the stream
    const provider = this.active;
    try {
      yield* provider.streamChat(messages, options);
    } catch (err) {
      if (this.fallback && !this.failoverActive) {
        logger.warn(`[Inference] streamChat failed on ${provider.type}, failing over to ${this.fallback.type}`);
        this.failoverActive = true;
        yield* this.fallback.streamChat(messages, options);
      } else {
        throw err;
      }
    }
  }

  // ─── Diagnostics ─────────────────────────────────────────────────────

  /**
   * Get current provider status for dashboards/admin.
   */
  getStatus(): {
    activeProvider: InferenceProviderType;
    primaryProvider: InferenceProviderType;
    failoverActive: boolean;
    failoverEnabled: boolean;
  } {
    return {
      activeProvider: this.active.type,
      primaryProvider: this.primary.type,
      failoverActive: this.failoverActive,
      failoverEnabled: this.failoverEnabled,
    };
  }

  /**
   * Force switch to a specific provider (for admin override).
   */
  forceProvider(type: 'primary' | 'fallback'): void {
    if (type === 'fallback' && this.fallback) {
      this.failoverActive = true;
      logger.info(`[Inference] Admin forced failover to ${this.fallback.type}`);
    } else {
      this.failoverActive = false;
      logger.info(`[Inference] Admin forced primary ${this.primary.type}`);
    }
  }

  /**
   * Clean up intervals on shutdown.
   */
  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Export singleton — drop-in replacement for the old `ollama` singleton
export const inference = new InferenceService();
export default inference;
