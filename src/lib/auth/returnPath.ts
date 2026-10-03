/**
 * Library — Return Path After Sign-In
 *
 * Where to send someone once they have signed in or registered.
 *
 * @exports returnPath, DEFAULT_AFTER_SIGN_IN
 * @module lib/auth/returnPath
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export const DEFAULT_AFTER_SIGN_IN = '/cortex/dashboard';

// The sign-in and registration pages themselves: returning there would loop.
const AUTH_PAGES = /^\/(login|register|auth)(\/|\?|#|$)/;

/**
 * ProtectedRoute passes the page a signed-out visitor asked for as
 * `location.state.from`. Only a path inside this app is honoured. Anything
 * else falls back to the dashboard, including a full URL and the
 * protocol-relative "//host" form, so sign-in can never redirect off-site.
 */
export function returnPath(state: unknown, fallback = DEFAULT_AFTER_SIGN_IN): string {
  const from = (state as { from?: unknown } | null | undefined)?.from;
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/\\')) {
    return fallback;
  }
  return AUTH_PAGES.test(from) ? fallback : from;
}
