// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// VERTICALS DOMAIN ROUTER - Industry-Specific Verticals
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import financialRoutes from '../financial.js';
import healthcareRoutes from '../healthcare.js';
import insuranceRoutes from '../insurance.js';
import energyRoutes from '../energy.js';
import defenseRoutes from '../defense.js';
import sportsRoutes from '../sports.js';
import industrialServicesRoutes from '../industrial-services.js';
import verticalAgentsRoutes from '../vertical-agents.js';
import verticalSentinelsRoutes from '../vertical-sentinels.js';
import fhirRoutes from '../fhir.js';

const router = Router();

// Community routes
router.use('/financial', financialRoutes);
router.use('/healthcare', healthcareRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/energy', energyRoutes);
router.use('/defense', defenseRoutes);
router.use('/sports', sportsRoutes);
router.use('/industrial-services', industrialServicesRoutes);
router.use('/vertical-agents', verticalAgentsRoutes);
router.use('/vertical-sentinels', verticalSentinelsRoutes);
router.use('/fhir', fhirRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/vertical-config', () => import('../vertical-config.js')],
]);

export default router;
