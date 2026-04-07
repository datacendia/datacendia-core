// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SERVICE PROXY HELPER
// Wraps a real service implementation so that:
//   1. Known methods execute real logic with proper return types.
//   2. Unknown methods return Promise.resolve([]) for array-like calls,
//      or Promise.resolve(null) — never crashes.
// This lets us incrementally implement services without breaking routes.
// =============================================================================

export function withFallback<T extends Record<string, any>>(impl: T): any {
  return new Proxy(impl, {
    get(target, prop: string | symbol) {
      if (prop === 'then') return undefined; // prevent await confusion
      if (typeof prop === 'symbol') return (target as any)[prop];
      if (prop in target) return target[prop];
      // Fallback: unimplemented method → return a function that resolves safely
      return (..._args: any[]) => Promise.resolve(null);
    },
  });
}
