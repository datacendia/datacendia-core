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
// any request bound for this app's API that doesn't already carry its own, and
// refreshes an expired session the way ApiClient does.
//
// Nothing is attached to other origins: some pages call public APIs (Federal
// Register, SEC EDGAR, OpenStates) and must never receive the user's token.

import { API_BASE_URL, getCsrfToken, tokenManager } from './client';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const basePathOf = (apiBase: string, origin: string): string =>
  new URL(apiBase, origin).pathname.replace(/\/+$/, '');

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
  // Whole path segments only: a base of /api/v1 must not claim /api/v10/...
  const basePath = basePathOf(apiBase, origin);
  return target.origin === base.origin && (target.pathname === basePath || target.pathname.startsWith(`${basePath}/`));
}

interface ApiFetchDeps {
  origin: string;
  apiBase: string;
  getToken: () => string | null;
  getCsrf: () => Promise<string | null>;
  /** Refreshes the session after a 401; resolves true once a new token is in place. */
  refresh?: () => Promise<boolean>;
}

/** Wraps `next` so API requests carry the bearer token, and the CSRF token on writes. */
export function createApiFetch(next: typeof fetch, deps: ApiFetchDeps): typeof fetch {
  return async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (!isApiRequest(url, deps.origin, deps.apiBase)) {
      return next(input, init);
    }
    // The auth endpoints manage the session themselves (refresh deliberately sends
    // no bearer, and an expired one would only get in the way), but their writes
    // still need the CSRF token.
    const isAuthEndpoint = new URL(url, deps.origin).pathname.startsWith(`${basePathOf(deps.apiBase, deps.origin)}/auth/`);

    const request = typeof input === 'object' && 'headers' in input ? input : undefined;
    const headers = new Headers(init?.headers ?? request?.headers);
    const token = isAuthEndpoint ? null : deps.getToken();
    const addsBearer = Boolean(token) && !headers.has('Authorization');
    if (addsBearer) {
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
    const send = () => next(input, { ...init, headers, credentials: init?.credentials ?? 'include' });
    const response = await send();

    // An expired session is refreshed once and the request retried, as ApiClient
    // does: only for a bearer added here, and only when the body can be sent again.
    const resendable = request
      ? request.body === null // a Request whose body is a stream can only be read once
      : init?.body === undefined || typeof init.body === 'string';
    if (response.status === 401 && addsBearer && resendable && deps.refresh && (await deps.refresh())) {
      const fresh = deps.getToken();
      if (fresh) {
        headers.set('Authorization', `Bearer ${fresh}`);
        return send();
      }
    }
    return response;
  };
}

interface FetchHost {
  fetch: typeof fetch;
  location: { origin: string };
}

/** Install once, at startup, before anything calls the API. */
export function installFetchAuth(host?: FetchHost): void {
  const target = host ?? (typeof window !== 'undefined' ? window : undefined);
  if (!target) {
    return;
  }
  target.fetch = createApiFetch(target.fetch.bind(target), {
    origin: target.location.origin,
    apiBase: API_BASE_URL,
    getToken: () => tokenManager.getAccessToken(),
    getCsrf: () => getCsrfToken(),
    refresh: () => tokenManager.refreshAccessToken(),
  });
}
