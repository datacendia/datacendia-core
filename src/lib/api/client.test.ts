/**
 * Library — Client Test
 *
 * Client-side utility library.
 * @module lib/api/client.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, setCurrentDataSourceId } from './client';

// These tests verify that the ApiClient propagates the currently selected
// data source via the X-Data-Source-Id header on all requests.

describe('ApiClient data source header propagation', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as any);

    (globalThis as any).fetch = fetchMock;

    // Clear any previously stored data source id
    setCurrentDataSourceId(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('includes X-Data-Source-Id header when a current data source is set', async () => {
    const dataSourceId = 'test-ds-id';
    setCurrentDataSourceId(dataSourceId);

    await api.get('/test-endpoint');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0];
    const headers = (options as any).headers as Record<string, string>;

    expect(headers['X-Data-Source-Id']).toBe(dataSourceId);
  });
});

// The API enforces double-submit CSRF on writes (backend/src/middleware/csrf.ts).
describe('ApiClient CSRF handling', () => {
  function respond(body: unknown, status = 200): any {
    const text = JSON.stringify(body);
    return {
      ok: status < 400,
      status,
      statusText: '',
      json: async () => JSON.parse(text),
      text: async () => text,
      clone: () => respond(body, status),
    };
  }

  beforeEach(() => {
    vi.resetModules(); // fresh module = no cached token
  });

  it('fetches a token once and sends it on writes, with cookies', async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url.endsWith('/csrf-token') ? respond({ success: true, csrfToken: 'tok-1' }) : respond({ success: true })
    );
    (globalThis as any).fetch = fetchMock;
    const { api: freshApi } = await import('./client');

    await freshApi.post('/auth/login', { email: 'sarah.chen@acme.demo', password: 'x' });
    await freshApi.post('/decisions', { title: 'y' });

    const urls = fetchMock.mock.calls.map(([u]) => String(u));
    expect(urls.filter((u) => u.endsWith('/csrf-token'))).toHaveLength(1);
    const [, loginInit] = fetchMock.mock.calls.find(([u]) => String(u).endsWith('/auth/login'))! as any[];
    expect(loginInit.headers['X-CSRF-Token']).toBe('tok-1');
    expect(loginInit.credentials).toBe('include');
  });

  it('does not ask for a token on reads', async () => {
    const fetchMock = vi.fn(async () => respond({ success: true }));
    (globalThis as any).fetch = fetchMock;
    const { api: freshApi } = await import('./client');

    await freshApi.get('/council/agents');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]![0])).not.toContain('/csrf-token');
  });

  it('refreshes the token and retries once when the server rejects it', async () => {
    const tokens = ['stale', 'fresh'];
    let writes = 0;
    const fetchMock = vi.fn(async (url: string, init?: any) => {
      if (url.endsWith('/csrf-token')) return respond({ success: true, csrfToken: tokens.shift() });
      writes++;
      return init.headers['X-CSRF-Token'] === 'fresh'
        ? respond({ success: true, data: { saved: true } })
        : respond({ success: false, error: { code: 'CSRF_TOKEN_INVALID', message: 'Invalid CSRF token' } }, 403);
    });
    (globalThis as any).fetch = fetchMock;
    const { api: freshApi } = await import('./client');

    const result = await freshApi.post('/decisions', {});

    expect(result).toMatchObject({ success: true, data: { saved: true } });
    expect(writes).toBe(2);
  });
});
