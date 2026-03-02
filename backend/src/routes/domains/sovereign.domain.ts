// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN DOMAIN ROUTER - Sovereign Stack Infrastructure
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import sovereignRoutes from '../sovereign.js';
import evidenceRoutes from '../evidence.js';
import meshRoutes from '../mesh.js';
import evidenceVaultRoutes from '../evidence-vault.js';

const router = Router();

// Community routes
router.use('/sovereign-infra', sovereignRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/mesh', meshRoutes);
router.use('/evidence-vault', evidenceVaultRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/sovereign', () => import('../sovereign-organs.js')],
  ['/sovereign-arch', () => import('../sovereign-arch.js')],
  ['/vault', () => import('../vault.js')],
  ['/eternal', () => import('../eternal.js')],
  ['/symbiont', () => import('../symbiont.js')],
  ['/clamav', () => import('../clamav.js')],
]);

export default router;
