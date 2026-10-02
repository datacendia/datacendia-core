/**
 * Library — Ollama API Transport
 *
 * Runs Council model calls on the API's AI provider when no Ollama is beside the browser.
 *
 * @exports apiInferenceAvailable, chatViaApi, ApiChatMessage
 * @module lib/ollama/apiTransport
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// The Council deliberates in the browser, one model call per agent turn. With
// Ollama on the visitor's machine those calls go straight to it; on a hosted
// deployment there is none, so they go to POST /council/chat and run on whatever
// provider the API is configured with. Requests go through window.fetch, so
// lib/api/fetchAuth attaches the session and CSRF token and refreshes them.

import { API_BASE_URL } from '../api/client';

export interface ApiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ApiChatRequest {
  messages: ApiChatMessage[];
  model?: string;
  options?: { temperature?: number; top_p?: number; num_predict?: number };
}

/** True when the API reports an AI provider it can run model calls on. */
export async function apiInferenceAvailable(fetchImpl: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await fetchImpl(`${API_BASE_URL}/inference/status`);
    if (!response.ok) {
      return false;
    }
    const status = (await response.json()) as { available?: unknown };
    return status.available === true;
  } catch {
    return false;
  }
}

/**
 * One model turn through POST /council/chat. ApiClient isn't used because it
 * gives up after 15 seconds and a turn can take longer; this allows two minutes,
 * as the direct Ollama path does.
 */
export async function chatViaApi(
  request: ApiChatRequest,
  { fetchImpl = fetch, timeoutMs = 120_000 }: { fetchImpl?: typeof fetch; timeoutMs?: number } = {}
): Promise<ApiChatMessage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${API_BASE_URL}/council/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: request.messages, model: request.model, options: request.options }),
      signal: controller.signal,
    });
    const body = (await response.json().catch(() => null)) as {
      data?: { message?: ApiChatMessage };
      error?: { message?: string } | string;
      message?: string;
    } | null;
    const message = body?.data?.message;
    if (!response.ok || !message) {
      const reason =
        (typeof body?.error === 'object' ? body.error.message : undefined) ??
        body?.message ??
        (typeof body?.error === 'string' ? body.error : undefined);
      throw new Error(reason || `The AI provider did not answer (HTTP ${response.status})`);
    }
    return message;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`The AI provider took longer than ${Math.round(timeoutMs / 1000)} seconds to answer`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
