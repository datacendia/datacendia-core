// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Domain Router — Enterprise
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 *
 * @exports mountEnterpriseRoutes
 * @module routes/domains/_enterprise
 */

// =============================================================================
// ENTERPRISE ROUTE MOUNTING UTILITY
// Conditionally loads enterprise route modules via dynamic import.
// In Community Edition builds, enterprise route files are excluded,
// so the imports fail silently and those endpoints simply don't exist.
// =============================================================================

import { Router } from 'express';

/**
 * Mount multiple enterprise routes on a router.
 * Each route is loaded via dynamic import — if the module doesn't exist
 * (community build), it is silently skipped.
 */
export function mountEnterpriseRoutes(
  router: Router,
  routes: Array<[string, () => Promise<any>]>
): void {
  (async () => {
    for (const [path, loader] of routes) {
      try {
        const mod = await loader();
        router.use(path, mod.default);
      } catch {
        // Enterprise module not available — Community Edition
      }
    }
  })();
}
