// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DETERMINISTIC COMPUTATION UTILITIES (FRONTEND)
// =============================================================================
// Replaces Math.random() with deterministic, reproducible computations
// based on seed strings. All outputs are derived from actual parameters,
// making results auditable and reproducible.
//
// Uses a simple but effective hash function suitable for browser environments
// (no Node.js crypto dependency).

/**
 * Simple hash function for browser environments (djb2 + xorshift).
 * Produces a deterministic 32-bit integer from a string.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  // xorshift to improve distribution
  hash ^= hash << 13;
  hash ^= hash >> 17;
  hash ^= hash << 5;
  return hash >>> 0; // ensure unsigned
}

/**
 * Generate a deterministic float (0-1) from seed strings.
 * Same inputs always produce the same output.
 */
export function deterministicFloat(seed: string, ...factors: (string | number | boolean)[]): number {
  const input = [seed, ...factors.map(String)].join('|');
  return hashString(input) / 0xFFFFFFFF;
}

/**
 * Generate a deterministic integer within a range from seed strings.
 */
export function deterministicInt(min: number, max: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  return Math.floor(float * (max - min + 1)) + min;
}

/**
 * Generate a deterministic percentage with realistic variance.
 * baseValue is the center, variance controls spread.
 */
export function deterministicPercentage(baseValue: number, variance: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  const offset = (float - 0.5) * 2 * variance;
  return Math.max(0, Math.min(100, Math.round((baseValue + offset) * 100) / 100));
}

/**
 * Pick a deterministic item from an array based on seed strings.
 */
export function deterministicPick<T>(items: T[], seed: string, ...factors: (string | number | boolean)[]): T {
  const index = deterministicInt(0, items.length - 1, seed, ...factors);
  return items[index]!;
}

/**
 * Generate a deterministic boolean with a given probability (0-1).
 */
export function deterministicBool(probability: number, seed: string, ...factors: (string | number | boolean)[]): boolean {
  return deterministicFloat(seed, ...factors) < probability;
}

/**
 * Generate a deterministic score (0-100) from seed strings.
 */
export function deterministicScore(seed: string, ...factors: (string | number | boolean)[]): number {
  return Math.round(deterministicFloat(seed, ...factors) * 10000) / 100;
}

/**
 * Generate a deterministic latency value (ms) based on characteristics.
 */
export function deterministicLatency(baseMs: number, seed: string, ...factors: (string | number | boolean)[]): number {
  const float = deterministicFloat(seed, ...factors);
  const multiplier = 1 + (float * float * 3);
  return Math.round(baseMs * multiplier);
}
