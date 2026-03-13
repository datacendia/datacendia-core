/**
 * Native Crypto Helpers — Drop-in replacement for @noble/hashes
 *
 * Uses Node.js built-in crypto module instead of @noble/hashes to avoid
 * tsx runtime ESM subpath export resolution failures.
 *
 * Provides the same API surface as @noble/hashes/sha256, @noble/hashes/sha512,
 * and @noble/hashes/utils so existing code needs minimal changes.
 *
 * @module services/crypto/nativeCrypto
 */

import crypto from 'crypto';

// SHA-256 hash — same signature as @noble/hashes/sha256
export function sha256(data: Uint8Array | string): Uint8Array {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return new Uint8Array(crypto.createHash('sha256').update(input).digest());
}

// SHA-512 hash — same signature as @noble/hashes/sha512
export function sha512(data: Uint8Array | string): Uint8Array {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return new Uint8Array(crypto.createHash('sha512').update(input).digest());
}

// bytesToHex — same as @noble/hashes/utils
export function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

// hexToBytes — same as @noble/hashes/utils
export function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, 'hex'));
}

// utf8ToBytes — same as @noble/hashes/utils
export function utf8ToBytes(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'utf8'));
}

// concatBytes — same as @noble/hashes/utils
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  return new Uint8Array(Buffer.concat(arrays.map(a => Buffer.from(a))));
}
