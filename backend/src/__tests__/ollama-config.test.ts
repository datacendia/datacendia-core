import { describe, it, expect } from 'vitest';
import { getOllamaBaseUrl, normalizeOllamaUrl, DEFAULT_OLLAMA_URL } from '../config/ollama.js';

describe('Ollama endpoint resolution', () => {
  it('falls back to loopback when nothing is set', () => {
    expect(getOllamaBaseUrl({})).toBe(DEFAULT_OLLAMA_URL);
  });

  it('prefers OLLAMA_BASE_URL, then OLLAMA_URL, then OLLAMA_HOST', () => {
    const all = {
      OLLAMA_BASE_URL: 'http://base:11434',
      OLLAMA_URL: 'http://url:11434',
      OLLAMA_HOST: 'host:11434',
    };
    expect(getOllamaBaseUrl(all)).toBe('http://base:11434');
    expect(getOllamaBaseUrl({ OLLAMA_URL: all.OLLAMA_URL, OLLAMA_HOST: all.OLLAMA_HOST })).toBe('http://url:11434');
    expect(getOllamaBaseUrl({ OLLAMA_HOST: all.OLLAMA_HOST })).toBe('http://host:11434');
  });

  it('reaches the host from inside the demo container', () => {
    // docker-compose.demo.yml sets OLLAMA_BASE_URL; the Council used to ignore it.
    expect(getOllamaBaseUrl({ OLLAMA_BASE_URL: 'http://host.docker.internal:11434' }))
      .toBe('http://host.docker.internal:11434');
  });

  it('normalises Ollama-style host strings', () => {
    expect(normalizeOllamaUrl('0.0.0.0')).toBe('http://127.0.0.1:11434');
    expect(normalizeOllamaUrl('127.0.0.1:11500')).toBe('http://127.0.0.1:11500');
    expect(normalizeOllamaUrl('ollama')).toBe('http://ollama:11434');
  });

  it('keeps full URLs as given, minus trailing slashes', () => {
    expect(normalizeOllamaUrl('https://llm.example.com/')).toBe('https://llm.example.com');
    expect(normalizeOllamaUrl('http://ollama:11434///')).toBe('http://ollama:11434');
  });

  it('treats a blank value as unset', () => {
    expect(normalizeOllamaUrl('   ')).toBe(DEFAULT_OLLAMA_URL);
  });
});
