// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DEMO DOMAIN ROUTER - Demo, Premium & Consolidated Services
// =============================================================================

import { Router } from 'express';
import demoRoutes from '../demo.js';
import holyShitRoutes from '../holyShit.js';
import demoSeedRoutes from '../demo-seed.js';
import consolidatedRoutes from '../consolidated.js';

const router = Router();

router.use('/leads', demoRoutes);
router.use('/premium', holyShitRoutes);
router.use('/demo', demoSeedRoutes);
router.use('/consolidated', consolidatedRoutes);

export default router;
