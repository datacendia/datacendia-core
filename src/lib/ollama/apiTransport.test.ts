/**
 * Library — Ollama API Transport Test
 *
 * @module lib/ollama/apiTransport.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi } from 'vitest';
import { apiInferenceAvailable, chatViaApi } from './apiTransport';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('apiInferenceAvailable', () => {
  it("reads the API's inference status", async () => {
    await expect(apiInferenceAvailable(vi.fn().mockResolvedValue(json({ available: true })))).resolves.toBe(true);
    await expect(apiInferenceAvailable(vi.fn().mockResolvedValue(json({ available: false })))).resolves.toBe(false);
  });

  it('treats an unreachable API as no provider', async () => {
    await expect(apiInferenceAvailable(vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))).resolves.toBe(false);
    await expect(apiInferenceAvailable(vi.fn().mockResolvedValue(json({}, 503)))).resolves.toBe(false);
  });
});

describe('chatViaApi', () => {
  const turn = { messages: [{ role: 'user' as const, content: 'Hello' }], model: 'qwen2.5:7b', options: { num_predict: 64 } };

  it('posts the turn to /council/chat and returns the reply', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(json({ success: true, data: { message: { role: 'assistant', content: 'Hi' } } }));
    await expect(chatViaApi(turn, { fetchImpl })).resolves.toEqual({ role: 'assistant', content: 'Hi' });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toMatch(/\/council\/chat$/);
    expect(JSON.parse(init.body)).toEqual(turn);
  });

  it("surfaces the API's reason when a turn fails", async () => {
    const limited = vi.fn().mockResolvedValue(json({ error: 'Too Many Requests', message: 'This endpoint is limited to 60 requests per 60 seconds.' }, 429));
    await expect(chatViaApi(turn, { fetchImpl: limited })).rejects.toThrow('limited to 60 requests');
    const failed = vi.fn().mockResolvedValue(json({ success: false, error: { message: 'Provider unavailable' } }, 503));
    await expect(chatViaApi(turn, { fetchImpl: failed })).rejects.toThrow('Provider unavailable');
  });

  it('gives up after the timeout', async () => {
    const hanging = vi.fn((_url: string, init: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    }));
    await expect(chatViaApi(turn, { fetchImpl: hanging as unknown as typeof fetch, timeoutMs: 20 })).rejects.toThrow('longer than 0 seconds');
  });
});
