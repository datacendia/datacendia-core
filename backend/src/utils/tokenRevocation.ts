/**
 * Utils — Token Revocation
 *
 * Key under which a logged-out access token is blacklisted.
 *
 * @exports revocationKey
 * @module utils/tokenRevocation
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * A JWS signature decodes to the same bytes from more than one base64url
 * spelling: its last character carries two unused bits. Keyed on the raw
 * string, a respelled copy of a revoked token passed the blacklist while its
 * signature still verified. Re-encoding the signature gives every spelling the
 * key of the token as issued, which is also the key used before this change.
 *
 * Only the signature needs this: respelling the header or payload changes the
 * signed input, so verification rejects it.
 */
export function revocationKey(token: string): string {
  const [header = '', payload = '', signature = ''] = token.split('.');
  const canonical = Buffer.from(signature, 'base64url').toString('base64url');
  return `blacklist:${header}.${payload}.${canonical}`;
}
