/**
 * Library — Ollama Model Fallback Test
 *
 * @module lib/ollama/modelFallback.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect } from 'vitest';
import { pickModel } from './modelFallback';

describe('pickModel', () => {
  it("uses the agent's own model when it is installed", () => {
    expect(pickModel('qwen2.5:14b', ['llama3.2:3b', 'qwen2.5:14b'])).toBe('qwen2.5:14b');
  });

  it('falls back within the same family before anything else', () => {
    expect(pickModel('qwen2.5:14b', ['llama3.1:8b', 'qwen2.5:7b'])).toBe('qwen2.5:7b');
  });

  it('otherwise takes the most capable installed chat model', () => {
    expect(pickModel('qwen2.5:14b', ['llama3.2:3b', 'mistral:7b'])).toBe('mistral:7b');
    expect(pickModel('qwen2.5:7b', ['llama3.2:3b'])).toBe('llama3.2:3b');
  });

  it('never picks an embedding model', () => {
    expect(pickModel('qwen2.5:7b', ['nomic-embed-text:latest', 'llama3.2:3b'])).toBe('llama3.2:3b');
    expect(pickModel('qwen2.5:7b', ['nomic-embed-text:latest'])).toBeNull();
  });

  it('returns null when nothing is installed', () => {
    expect(pickModel('qwen2.5:7b', [])).toBeNull();
  });
});
