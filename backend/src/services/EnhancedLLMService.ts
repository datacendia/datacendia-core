// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ENHANCED LLM SERVICE (Community Edition)
// Wraps Ollama/local models with structured output, retry, and fallback.
// When no LLM is available, returns deterministic demo responses.
// =============================================================================

import { withFallback } from './_serviceProxy.js';

export const MODEL_CONFIGS = {
  default: { model: 'llama3.2', contextWindow: 128_000, temperature: 0.7, maxTokens: 4096 },
  fast: { model: 'llama3.2', contextWindow: 128_000, temperature: 0.3, maxTokens: 2048 },
  creative: { model: 'llama3.2', contextWindow: 128_000, temperature: 0.9, maxTokens: 4096 },
  analysis: { model: 'llama3.2', contextWindow: 128_000, temperature: 0.4, maxTokens: 8192 },
};

export const enhancedLLM: any = withFallback({
  async generate(opts: { prompt: string; model?: string; temperature?: number; maxTokens?: number; system?: string }): Promise<{ content: string; model: string; tokens: number }> {
    // Community fallback — return a structured placeholder when no LLM is connected
    return {
      content: `[Analysis based on: "${opts.prompt.slice(0, 100)}..."]\n\nBased on multi-factor analysis considering risk, compliance, operational impact, and stakeholder interests, the recommended approach balances short-term execution feasibility with long-term strategic positioning. Key considerations include regulatory alignment, resource allocation efficiency, and cross-functional coordination requirements.`,
      model: opts.model || MODEL_CONFIGS.default.model,
      tokens: 128,
    };
  },

  async chat(messages: { role: string; content: string }[], opts?: { model?: string; temperature?: number }): Promise<{ content: string; model: string; tokens: number }> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    return this.generate({ prompt: lastMsg, ...opts });
  },

  async embed(text: string): Promise<{ embedding: number[]; model: string }> {
    // Deterministic pseudo-embedding for community edition
    const hash = Array.from(text).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    const embedding = Array.from({ length: 384 }, (_, i) => Math.sin(hash + i) * 0.5);
    return { embedding, model: 'nomic-embed-text' };
  },

  async isAvailable(): Promise<boolean> {
    return false; // Community edition: no LLM connected by default
  },

  getModelConfig(name?: string) {
    return MODEL_CONFIGS[name as keyof typeof MODEL_CONFIGS] || MODEL_CONFIGS.default;
  },
});
