/**
 * Library — Fetch Auth
 *
 * Attaches the signed-in session to direct fetch() calls against this app's API.
 *
 * @exports isApiRequest, createApiFetch, installFetchAuth
 * @module lib/api/fetchAuth
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// About thirty modules call fetch() on the API directly instead of going through
// ApiClient, and none of them send the bearer token. The backend's development
// auth bypass hid that; against a real deployment every one of those calls got a
// 401 (Settings > Users, the Gateway, the Legal demo, Chronos, the Sovereign
// pages). Rather than rewrite each call site, window.fetch attaches the session to
// any request bound for this app's API that doesn't already carry its own.
//
// Nothing is attached to other origins: some pages call public APIs (Federal
// Register, SEC EDGAR, OpenStates) and must never receive the user's token.

import { API_BASE_URL, getCsrfToken, tokenManager } from './client';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** True when `url` targets this app's API: same-origin /api/..., or anything under `apiBase`. */
export function isApiRequest(url: string, origin: string, apiBase: string): boolean {
  let target: URL;
  let base: URL;
  try {
    target = new URL(url, origin);
    base = new URL(apiBase, origin);
  } catch {
    return false;
  }
  if (target.origin === origin && target.pathname.startsWith('/api/')) {
    return true;
  }
  return target.origin === base.origin && target.pathname.startsWith(base.pathname);
}

interface ApiFetchDeps {
  origin: string;
  apiBase: string;
  getToken: () => string | null;
  getCsrf: () => Promise<string | null>;
}

/** Wraps `next` so API requests carry the bearer token, and the CSRF token on writes. */
export function createApiFetch(next: typeof fetch, deps: ApiFetchDeps): typeof fetch {
  return async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (!isApiRequest(url, deps.origin, deps.apiBase)) {
      return next(input, init);
    }
    // The auth endpoints manage their own credentials: refresh deliberately sends
    // no bearer, and an expired one there would only get in the way.
    const authPrefix = `${new URL(deps.apiBase, deps.origin).pathname}/auth/`;
    if (new URL(url, deps.origin).pathname.startsWith(authPrefix)) {
      return next(input, init);
    }

    const request = typeof input === 'object' && 'headers' in input ? input : undefined;
    const headers = new Headers(init?.headers ?? request?.headers);
    const token = deps.getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const method = (init?.method ?? request?.method ?? 'GET').toUpperCase();
    if (UNSAFE_METHODS.has(method) && !headers.has('X-CSRF-Token')) {
      const csrf = await deps.getCsrf();
      if (csrf) {
        headers.set('X-CSRF-Token', csrf);
      }
    }
    // The CSRF cookie has to travel with cross-origin calls (VITE_API_URL on another port).
    return next(input, { ...init, headers, credentials: init?.credentials ?? 'include' });
  };
}

/** Install once, at startup, before anything calls the API. */
export function installFetchAuth(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.fetch = createApiFetch(window.fetch.bind(window), {
    origin: window.location.origin,
    apiBase: API_BASE_URL,
    getToken: () => tokenManager.getAccessToken(),
    getCsrf: () => getCsrfToken(),
  });
}
