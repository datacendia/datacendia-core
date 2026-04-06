// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// INFERENCE FACADE — Routes through InferenceService (OpenAI, Ollama, etc.)
// Kept as `ollama` export for backward-compatibility with 45+ consuming files.
// =============================================================================

import { inference } from './inference/InferenceService.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GenerateOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stop?: string[];
  seed?: number;
  repeat_penalty?: number;
  system?: string;
  format?: 'json';
}

export const ollama = {
  async isAvailable(): Promise<boolean> {
    return inference.isAvailable();
  },

  async chat(messages: ChatMessage[], options: GenerateOptions = {}): Promise<string> {
    const result = await inference.chat(messages, options);
    return result.content;
  },

  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    return inference.generate(prompt, options);
  },

  async embed(text: string, model?: string): Promise<number[]> {
    return inference.embed(text, model);
  },

  async listModels(): Promise<{ name: string; size: number }[]> {
    return [];
  },
};

export default ollama;
