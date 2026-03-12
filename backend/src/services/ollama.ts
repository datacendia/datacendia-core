// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// OLLAMA FACADE — Lightweight wrapper over OllamaProvider for direct usage
// =============================================================================

import { OllamaProvider } from './inference/OllamaProvider.js';

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

const provider = new OllamaProvider();

export const ollama = {
  async isAvailable(): Promise<boolean> {
    return provider.isAvailable();
  },

  async chat(messages: ChatMessage[], options: GenerateOptions = {}): Promise<string> {
    const result = await provider.chat(messages, options);
    return result.content;
  },

  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    return provider.generate(prompt, options);
  },

  async embed(text: string, model?: string): Promise<number[]> {
    return provider.embed(text, model);
  },
};

export default ollama;
