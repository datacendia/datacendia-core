// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL DOMAIN ROUTER - The Council™ AI Deliberation
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import deliberationsRoutes from '../deliberations.js';
import councilRoutes from '../council.js';
import deliberationsApiRoutes from '../deliberationsApi.js';
import decisionsRoutes from '../decisions.js';
import councilPacketsRoutes from '../council-packets.js';
import vetoRoutes from '../veto.js';
import unionRoutes from '../union.js';
import dissentRoutes from '../dissent.js';
import echoRoutes from '../echo.js';

const router = Router();

// Community routes
router.use('/council/deliberations', deliberationsRoutes); // Must come BEFORE /council
router.use('/council', councilRoutes);
router.use('/deliberations', deliberationsApiRoutes);
router.use('/decisions', decisionsRoutes);
router.use('/council-packets', councilPacketsRoutes);
router.use('/veto', vetoRoutes);
router.use('/union', unionRoutes);
router.use('/dissent', dissentRoutes);
router.use('/echo', echoRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/vox', () => import('../vox.js')],
]);

export default router;
