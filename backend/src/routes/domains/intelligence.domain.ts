// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// INTELLIGENCE DOMAIN ROUTER - AI Intelligence & Visualization
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import personaRoutes from '../persona.js';
import autopilotRoutes from '../autopilot.js';
import decisionIntelRoutes from '../decision-intel.js';
import gnosisRoutes from '../gnosis.js';
import visualizationRoutes from '../visualization.js';

const router = Router();

// Community routes
router.use('/persona', personaRoutes);
router.use('/autopilot', autopilotRoutes);
router.use('/decision-intel', decisionIntelRoutes);
router.use('/gnosis', gnosisRoutes);
router.use('/visualization', visualizationRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/apotheosis', () => import('../apotheosis.js')],
]);

export default router;
