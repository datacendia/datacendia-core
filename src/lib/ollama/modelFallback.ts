/**
 * Library — Ollama Model Fallback
 *
 * Chooses the installed model a Council agent runs on.
 *
 * @exports isChatModel, pickModel
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

// Embedding models can't chat. Most are named *embed*, but not all (bge-m3,
// all-minilm), so the family Ollama reports is checked too: they are BERT-style.
const EMBEDDING_NAME = /embed|bge|minilm|paraphrase|\be5-|\bgte-/i;
const EMBEDDING_FAMILIES = new Set(['bert', 'nomic-bert', 'jina-bert-v2', 'xlm-roberta', 'roberta']);

interface ModelInfo {
  name: string;
  details?: { family?: string; families?: string[] | null } | null;
}

/** False for embedding models, by name or by the model family Ollama reports. */
export function isChatModel(model: ModelInfo): boolean {
  if (EMBEDDING_NAME.test(model.name)) {
    return false;
  }
  const families = [model.details?.family, ...(model.details?.families ?? [])];
  return !families.some((f) => typeof f === 'string' && EMBEDDING_FAMILIES.has(f.toLowerCase()));
}

const family = (model: string): string => model.split(':')[0] ?? model;

/** The installed model to run `preferred` on, or null when there is no chat model at all. */
export function pickModel(preferred: string, installed: string[]): string | null {
  const chat = installed.filter((m) => isChatModel({ name: m }));
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
