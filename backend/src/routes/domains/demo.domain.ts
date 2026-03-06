/**
 * Domain Router — Demo Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/demo.domain
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DEMO DOMAIN ROUTER - Demo, Premium & Consolidated Services
// =============================================================================

import { Router } from 'express';
import demoRoutes from '../demo.js';
import advancedAnalysisRoutes from '../advancedAnalysis.js';
import demoSeedRoutes from '../demo-seed.js';
import consolidatedRoutes from '../consolidated.js';

const router = Router();

router.use('/leads', demoRoutes);
router.use('/premium', advancedAnalysisRoutes);
router.use('/demo', demoSeedRoutes);
router.use('/consolidated', consolidatedRoutes);

export default router;
