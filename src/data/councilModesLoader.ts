// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL MODES LAZY LOADER
// Dynamically imports councilModes to reduce initial bundle size
// =============================================================================

import type { CouncilMode } from './councilModes';

type CouncilModesMap = Record<string, CouncilMode>;

let cachedModes: CouncilModesMap | null = null;
let loadingPromise: Promise<CouncilModesMap> | null = null;

/**
 * Lazily load council modes on demand
 * Caches the result after first load
 */
export async function loadCouncilModes(): Promise<CouncilModesMap> {
  if (cachedModes) {
    return cachedModes;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = import('./councilModes').then((module) => {
    cachedModes = module.COUNCIL_MODES;
    return cachedModes;
  });

  return loadingPromise;
}

/**
 * Get cached modes synchronously (returns empty object if not loaded)
 * Use this for initial render, then call loadCouncilModes() in useEffect
 */
export function getCachedModes(): CouncilModesMap {
  return cachedModes || {};
}

/**
 * Check if modes are loaded
 */
export function areModesLoaded(): boolean {
  return cachedModes !== null;
}

/**
 * Preload modes (call this early in app lifecycle)
 */
export function preloadCouncilModes(): void {
  loadCouncilModes().catch(console.error);
}

// Re-export types
export type { CouncilMode } from './councilModes';
