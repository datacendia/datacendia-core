// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SECURITY DOMAIN ROUTER - Security & Adversarial Defense
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import kmsRoutes from '../kms.js';
import postQuantumRoutes from '../post-quantum.js';
import zkpRoutes from '../zkp.js';
import adversarialRedteamRoutes from '../adversarial-redteam.js';
import redteamRoutes from '../redteam.js';
import securityServicesRoutes from '../security-services.js';
import mfaRoutes from '../mfa.js';
import sentryRoutes from '../sentry.js';
import hsmRoutes from '../hsm.js';

const router = Router();

// Community routes
router.use('/sentry', sentryRoutes);
router.use('/kms', kmsRoutes);
router.use('/post-quantum', postQuantumRoutes);
router.use('/zkp', zkpRoutes);
router.use('/adversarial-redteam', adversarialRedteamRoutes);
router.use('/redteam', redteamRoutes);
router.use('/security-services', securityServicesRoutes);
router.use('/mfa', mfaRoutes);
router.use('/hsm', hsmRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/crucible', () => import('../crucible.js')],
  ['/crucible-enterprise', () => import('../crucible-enterprise.js')],
  ['/aegis', () => import('../aegis.js')],
  ['/security', () => import('../sovereign-security.js')],
]);

export default router;
