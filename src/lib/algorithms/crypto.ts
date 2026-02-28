// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CRYPTOGRAPHIC HASHING — Production-Grade Hash Functions
// =============================================================================
// Provides SHA-256 via Web Crypto API with fallback to a high-quality
// synchronous hash for environments where Web Crypto is unavailable.
// The fallback uses FNV-1a + multiple mixing rounds for collision resistance.

/**
 * SHA-256 hash using Web Crypto API (async).
 * Returns lowercase hex string.
 * This is the preferred method — cryptographically secure.
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 hash of a JSON-serializable object.
 * Deterministic: keys are sorted before hashing.
 */
export async function sha256Object(obj: Record<string, unknown>): Promise<string> {
  const canonical = JSON.stringify(obj, Object.keys(obj).sort());
  return sha256(canonical);
}

/**
 * Synchronous high-quality hash for non-crypto use cases.
 * Uses FNV-1a (Fowler-Noll-Vo) with additional mixing.
 * Produces a 64-character hex string (256-bit equivalent via 4× FNV rounds).
 * 
 * NOT cryptographically secure — use sha256() for security-critical hashing.
 * Suitable for: deterministic IDs, content addressing, chain linking in demos.
 */
export function hashSync(data: string): string {
  // Run 4 rounds of FNV-1a with different offsets to produce 256 bits
  const parts: string[] = [];
  for (let round = 0; round < 4; round++) {
    let hash = 0x811c9dc5 ^ (round * 0x01000193);
    for (let i = 0; i < data.length; i++) {
      hash ^= data.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    // Additional mixing (MurmurHash3 finalizer)
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
    parts.push((hash >>> 0).toString(16).padStart(8, '0'));
  }
  return parts.join('');
}

/**
 * Synchronous hash of a JSON-serializable object.
 * Deterministic: keys are sorted before hashing.
 */
export function hashSyncObject(obj: Record<string, unknown>): string {
  const canonical = JSON.stringify(obj, Object.keys(obj).sort());
  return hashSync(canonical);
}

/**
 * Verify a hash matches the expected value.
 */
export async function verifyHash(data: string, expectedHash: string): Promise<boolean> {
  const actual = await sha256(data);
  return actual === expectedHash;
}

/**
 * Generate a Merkle root from an array of hashes.
 * Uses SHA-256 for pairwise hashing up the tree.
 * Returns the root hash.
 */
export async function merkleRoot(hashes: string[]): Promise<string> {
  if (hashes.length === 0) return sha256('');
  if (hashes.length === 1) return hashes[0];

  let layer = [...hashes];
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left; // duplicate odd leaf
      next.push(await sha256(left + right));
    }
    layer = next;
  }
  return layer[0];
}

/**
 * Synchronous Merkle root (uses hashSync instead of sha256).
 * For use in synchronous contexts.
 */
export function merkleRootSync(hashes: string[]): string {
  if (hashes.length === 0) return hashSync('');
  if (hashes.length === 1) return hashes[0];

  let layer = [...hashes];
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left;
      next.push(hashSync(left + right));
    }
    layer = next;
  }
  return layer[0];
}

/**
 * HMAC-like keyed hash (synchronous, non-crypto).
 * For tagging/fingerprinting, NOT for authentication.
 */
export function keyedHash(data: string, key: string): string {
  const inner = hashSync(key + ':inner:' + data);
  return hashSync(key + ':outer:' + inner);
}
