// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SIMULATION DOMAIN ROUTER - Governance Simulation & Stress Testing
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';

const router = Router();

mountEnterpriseRoutes(router, [
  ['/sgas', () => import('../sgas.js')],
  ['/scge', () => import('../scge.js')],
  ['/collapse', () => import('../collapse.js')],
]);

export default router;
