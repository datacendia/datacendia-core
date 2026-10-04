/**
 * Library — Token Refresh Test
 *
 * @module lib/api/tokenRefresh.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach } from 'vitest';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// A fresh module per test: the CSRF token cache and the token manager are module state.
async function signedIn() {
  vi.resetModules();
  const { tokenManager } = await import('./client');
  tokenManager.setTokens({ accessToken: 'access-1', refreshToken: 'refresh-1', expiresIn: 3600 });
  return tokenManager;
}

describe('tokenManager.refreshAccessToken', () => {
  beforeEach(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  });

  it('keeps the refresh token when the API returns only a new access token', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(json({ csrfToken: 'csrf-1' }))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'access-2', expiresIn: 3600 } }));
    const tokenManager = await signedIn();

    await expect(tokenManager.refreshAccessToken()).resolves.toBe(true);
    expect(tokenManager.getAccessToken()).toBe('access-2');
    expect(tokenManager.getRefreshToken()).toBe('refresh-1');
  });

  it('retries once with a fresh CSRF token when the cached one is rejected', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ csrfToken: 'stale' }))
      .mockResolvedValueOnce(json({ success: false, error: { code: 'CSRF_TOKEN_INVALID', message: 'x' } }, 403))
      .mockResolvedValueOnce(json({ csrfToken: 'fresh' }))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'access-2', expiresIn: 3600 } }));
    globalThis.fetch = fetchMock;
    const tokenManager = await signedIn();

    await expect(tokenManager.refreshAccessToken()).resolves.toBe(true);
    const retry = fetchMock.mock.calls[3][1] as RequestInit;
    expect(new Headers(retry.headers).get('X-CSRF-Token')).toBe('fresh');
    expect(tokenManager.getAccessToken()).toBe('access-2');
  });

  it("doesn't undo a sign-out that happened while it was in flight", async () => {
    let answerRefresh: (r: Response) => void = () => {};
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(json({ csrfToken: 'csrf-1' }))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { answerRefresh = resolve; }));
    const tokenManager = await signedIn();

    const pending = tokenManager.refreshAccessToken();
    await new Promise((r) => setTimeout(r, 0)); // the refresh request is now in flight
    tokenManager.clearTokens();
    answerRefresh(json({ success: true, data: { accessToken: 'access-2', expiresIn: 3600 } }));

    await expect(pending).resolves.toBe(false);
    expect(tokenManager.getAccessToken()).toBeNull();
  });

  it('signs out when the refresh itself is refused', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(json({ csrfToken: 'csrf-1' }))
      .mockResolvedValueOnce(json({ success: false, error: { code: 'UNAUTHORIZED', message: 'x' } }, 401));
    const tokenManager = await signedIn();

    await expect(tokenManager.refreshAccessToken()).resolves.toBe(false);
    expect(tokenManager.getAccessToken()).toBeNull();
  });
});
