/**
 * Library — Ollama Model Fallback
 *
 * Chooses the installed model a Council agent runs on.
 *
 * @exports pickModel
 * @module lib/ollama/modelFallback
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// Agents name the model they were tuned on (qwen2.5:14b or :7b). On a machine
// without it every agent showed offline and the Council could not deliberate, and
// a family match alone (qwen2.5:7b installed for a qwen2.5:14b agent) marked the
// agent online but then asked Ollama for a model it didn't have. An agent now runs
// on its own model, else the same family, else the best chat model installed.
const CHAT_MODEL_PREFERENCE = [
  'qwen2.5', 'qwen3', 'llama3.3', 'llama3.1', 'mistral', 'gemma3', 'gemma2', 'phi4', 'llama3.2', 'phi3',
];

const family = (model: string): string => model.split(':')[0] ?? model;

/** The installed model to run `preferred` on, or null when there is no chat model at all. */
export function pickModel(preferred: string, installed: string[]): string | null {
  const chat = installed.filter((m) => !/embed/i.test(m));
  if (chat.includes(preferred)) {
    return preferred;
  }
  const sameFamily = chat.find((m) => family(m) === family(preferred));
  if (sameFamily) {
    return sameFamily;
  }
  for (const f of CHAT_MODEL_PREFERENCE) {
    const match = chat.find((m) => family(m) === f);
    if (match) {
      return match;
    }
  }
  return chat[0] ?? null;
}
