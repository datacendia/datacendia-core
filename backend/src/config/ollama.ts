// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Single source of truth for the Ollama endpoint.
 *
 * Three variable names were in circulation: OLLAMA_BASE_URL (config schema,
 * demo and dev compose files), OLLAMA_URL (production compose) and
 * OLLAMA_HOST (Ollama's own convention, often "host:port" with no scheme).
 * Callers that read the "wrong" one silently fell back to 127.0.0.1, which
 * inside a container is the container itself, so every model call failed.
 * Everything now resolves through here.
 *
 * @module config/ollama
 */

export const DEFAULT_OLLAMA_URL = 'http://127.0.0.1:11434';

/**
 * Normalise an Ollama address into a base URL with a scheme and no trailing slash.
 * Accepts full URLs ("http://ollama:11434/") and Ollama-style host strings
 * ("0.0.0.0", "127.0.0.1:11434"). A bind-all address is not a valid client
 * target, so 0.0.0.0 becomes loopback.
 */
export function normalizeOllamaUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return DEFAULT_OLLAMA_URL;
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  let candidate = hasScheme ? trimmed : `http://${trimmed}`;
  candidate = candidate.replace('://0.0.0.0', '://127.0.0.1');

  try {
    const url = new URL(candidate);
    // Ollama-style host strings without a port mean the default port.
    if (!hasScheme && !url.port) {
      url.port = '11434';
    }
    return url.toString().replace(/\/+$/, '');
  } catch {
    return DEFAULT_OLLAMA_URL;
  }
}

/** Resolve the Ollama base URL: OLLAMA_BASE_URL, then OLLAMA_URL, then OLLAMA_HOST. */
export function getOllamaBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env['OLLAMA_BASE_URL'] || env['OLLAMA_URL'] || env['OLLAMA_HOST'];
  return raw ? normalizeOllamaUrl(raw) : DEFAULT_OLLAMA_URL;
}
