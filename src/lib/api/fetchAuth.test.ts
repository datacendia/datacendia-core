/**
 * Library — Fetch Auth Test
 *
 * @module lib/api/fetchAuth.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi } from 'vitest';
import { createApiFetch, isApiRequest } from './fetchAuth';

const ORIGIN = 'http://localhost:5173';
const CROSS_ORIGIN_API = 'http://localhost:3001/api/v1';

describe('isApiRequest', () => {
  it('matches same-origin API paths, relative or absolute', () => {
    expect(isApiRequest('/api/v1/settings/users', ORIGIN, '/api/v1')).toBe(true);
    expect(isApiRequest(`${ORIGIN}/api/v1/gateway/stats`, ORIGIN, '/api/v1')).toBe(true);
  });

  it('matches a cross-origin API base', () => {
    expect(isApiRequest(`${CROSS_ORIGIN_API}/settings/users`, ORIGIN, CROSS_ORIGIN_API)).toBe(true);
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
  const setup = (token: string | null = 'tok') => {
    const next = vi.fn().mockResolvedValue(new Response('{}'));
    const getCsrf = vi.fn().mockResolvedValue('csrf-1');
    const apiFetch = createApiFetch(next, { origin: ORIGIN, apiBase: '/api/v1', getToken: () => token, getCsrf });
    const sent = () => new Headers(next.mock.calls[0][1]?.headers);
    return { next, getCsrf, apiFetch, sent };
  };

  it('adds the bearer token to API reads without fetching a CSRF token', async () => {
    const { apiFetch, getCsrf, sent, next } = setup();
    await apiFetch('/api/v1/settings/users');
    expect(sent().get('Authorization')).toBe('Bearer tok');
    expect(sent().has('X-CSRF-Token')).toBe(false);
    expect(getCsrf).not.toHaveBeenCalled();
    expect(next.mock.calls[0][1].credentials).toBe('include');
  });

  it('adds the CSRF token to API writes', async () => {
    const { apiFetch, sent } = setup();
    await apiFetch('/api/v1/settings/users', { method: 'post', body: '{}' });
    expect(sent().get('X-CSRF-Token')).toBe('csrf-1');
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

  it('leaves the auth endpoints alone', async () => {
    const { apiFetch, next } = setup();
    const init = { method: 'POST', body: '{}' };
    await apiFetch('/api/v1/auth/refresh', init);
    expect(next).toHaveBeenCalledWith('/api/v1/auth/refresh', init);
  });

  it('sends no Authorization when signed out', async () => {
    const { apiFetch, sent } = setup(null);
    await apiFetch('/api/v1/settings/users');
    expect(sent().has('Authorization')).toBe(false);
  });
});
