/**
 * Library — Fetch Auth Test
 *
 * @module lib/api/fetchAuth.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createApiFetch, installFetchAuth, isApiRequest } from './fetchAuth';
import { API_BASE_URL, tokenManager } from './client';

const ORIGIN = 'http://localhost:5173';
const CROSS_ORIGIN_API = 'http://localhost:3001/api/v1';

describe('isApiRequest', () => {
  it('matches same-origin API paths, relative or absolute', () => {
    expect(isApiRequest('/api/v1/settings/users', ORIGIN, '/api/v1')).toBe(true);
    expect(isApiRequest(`${ORIGIN}/api/v1/gateway/stats`, ORIGIN, '/api/v1')).toBe(true);
  });

  it('matches a cross-origin API base on whole path segments', () => {
    expect(isApiRequest(`${CROSS_ORIGIN_API}/settings/users`, ORIGIN, CROSS_ORIGIN_API)).toBe(true);
    expect(isApiRequest('http://localhost:3001/api/v10/other', ORIGIN, CROSS_ORIGIN_API)).toBe(false);
  });

  it('never matches another origin, even one with an /api/ path', () => {
    expect(isApiRequest('https://www.federalregister.gov/api/v1/documents.json', ORIGIN, '/api/v1')).toBe(false);
    expect(isApiRequest('http://localhost:11434/api/tags', ORIGIN, CROSS_ORIGIN_API)).toBe(false);
  });

  it('ignores non-API paths on the same origin', () => {
    expect(isApiRequest('/assets/logo.svg', ORIGIN, '/api/v1')).toBe(false);
  });
});

describe('createApiFetch', () => {
  const setup = (opts: { token?: string | null; csrf?: string | null; refresh?: () => Promise<boolean> } = {}) => {
    let token = opts.token === undefined ? 'tok' : opts.token;
    const next = vi.fn().mockResolvedValue(new Response('{}'));
    const getCsrf = vi.fn().mockResolvedValue(opts.csrf === undefined ? 'csrf-1' : opts.csrf);
    const apiFetch = createApiFetch(next, {
      origin: ORIGIN,
      apiBase: '/api/v1',
      getToken: () => token,
      getCsrf,
      refresh: opts.refresh,
    });
    const sent = (call = 0) => new Headers(next.mock.calls[call][1]?.headers);
    const setToken = (t: string) => { token = t; };
    return { next, getCsrf, apiFetch, sent, setToken };
  };

  it('adds the bearer token to API reads without fetching a CSRF token', async () => {
    const { apiFetch, getCsrf, sent, next } = setup();
    await apiFetch('/api/v1/settings/users');
    expect(sent().get('Authorization')).toBe('Bearer tok');
    expect(sent().has('X-CSRF-Token')).toBe(false);
    expect(getCsrf).not.toHaveBeenCalled();
    expect(next.mock.calls[0][1].credentials).toBe('include');
  });

  it('adds the CSRF token to API writes and forwards the rest of the request', async () => {
    const { apiFetch, sent, next } = setup();
    const signal = new AbortController().signal;
    await apiFetch('/api/v1/settings/users', {
      method: 'post',
      body: '{"a":1}',
      signal,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(sent().get('X-CSRF-Token')).toBe('csrf-1');
    expect(sent().get('Content-Type')).toBe('application/json');
    expect(next.mock.calls[0][1]).toMatchObject({ method: 'post', body: '{"a":1}', signal });
  });

  it('still sends a write when no CSRF token could be fetched', async () => {
    const { apiFetch, sent } = setup({ csrf: null });
    await apiFetch('/api/v1/feedback', { method: 'POST', body: '{}' });
    expect(sent().has('X-CSRF-Token')).toBe(false);
    expect(sent().get('Authorization')).toBe('Bearer tok');
  });

  it("keeps the caller's own headers", async () => {
    const { apiFetch, getCsrf, sent } = setup();
    await apiFetch('/api/v1/x', { method: 'POST', headers: { Authorization: 'Bearer other', 'X-CSRF-Token': 'mine' } });
    expect(sent().get('Authorization')).toBe('Bearer other');
    expect(sent().get('X-CSRF-Token')).toBe('mine');
    expect(getCsrf).not.toHaveBeenCalled();
  });

  it('passes other origins through untouched', async () => {
    const { apiFetch, next } = setup();
    const init = { method: 'GET' };
    await apiFetch('https://www.federalregister.gov/api/v1/documents.json', init);
    expect(next).toHaveBeenCalledWith('https://www.federalregister.gov/api/v1/documents.json', init);
  });

  it('gives the auth endpoints a CSRF token but no bearer', async () => {
    const { apiFetch, sent } = setup();
    await apiFetch('/api/v1/auth/login', { method: 'POST', body: '{}' });
    expect(sent().has('Authorization')).toBe(false);
    expect(sent().get('X-CSRF-Token')).toBe('csrf-1');
  });

  it('sends no Authorization when signed out', async () => {
    const { apiFetch, sent } = setup({ token: null });
    await apiFetch('/api/v1/settings/users');
    expect(sent().has('Authorization')).toBe(false);
  });

  it('refreshes an expired session once and retries with the new token', async () => {
    const holder: { setToken?: (t: string) => void } = {};
    const refresh = vi.fn(async () => { holder.setToken?.('tok-2'); return true; });
    const { apiFetch, next, sent, setToken } = setup({ refresh });
    holder.setToken = setToken;
    next.mockResolvedValueOnce(new Response('', { status: 401 })).mockResolvedValueOnce(new Response('{}'));

    const response = await apiFetch('/api/v1/settings/users', { method: 'PATCH', body: '{}' });
    expect(response.status).toBe(200);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(sent(1).get('Authorization')).toBe('Bearer tok-2');
  });

  it('retries a bodyless Request object too', async () => {
    const holder: { setToken?: (t: string) => void } = {};
    const refresh = vi.fn(async () => { holder.setToken?.('tok-2'); return true; });
    const { apiFetch, next, sent, setToken } = setup({ refresh });
    holder.setToken = setToken;
    next.mockResolvedValueOnce(new Response('', { status: 401 })).mockResolvedValueOnce(new Response('{}'));

    const response = await apiFetch(new Request(`${ORIGIN}/api/v1/settings/users`));
    expect(response.status).toBe(200);
    expect(sent(1).get('Authorization')).toBe('Bearer tok-2');
  });

  it("doesn't refresh for a bearer the caller supplied", async () => {
    const refresh = vi.fn(async () => true);
    const { apiFetch, next } = setup({ refresh });
    next.mockResolvedValueOnce(new Response('', { status: 401 }));
    const response = await apiFetch('/api/v1/x', { headers: { Authorization: 'Bearer other' } });
    expect(response.status).toBe(401);
    expect(refresh).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('installFetchAuth', () => {
  afterEach(() => {
    tokenManager.clearTokens();
  });

  it("wraps the host's fetch with the signed-in session", async () => {
    tokenManager.setTokens({ accessToken: 'session-token', refreshToken: 'r', expiresIn: 3600 });
    const original = vi.fn().mockResolvedValue(new Response('{}'));
    const host = { fetch: original as unknown as typeof fetch, location: { origin: ORIGIN } };

    installFetchAuth(host);
    await host.fetch(`${API_BASE_URL}/settings/users`);

    expect(new Headers(original.mock.calls[0][1]?.headers).get('Authorization')).toBe('Bearer session-token');
  });
});
