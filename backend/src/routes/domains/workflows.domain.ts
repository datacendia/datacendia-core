/**
 * Domain Router — Workflows Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/workflows.domain
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// WORKFLOWS DOMAIN ROUTER - Workflows, Integrations & Scheduling
// =============================================================================

import { Router } from 'express';
import workflowRoutes from '../workflows.js';
import integrationsRoutes from '../integrations.js';
import schedulerRoutes from '../scheduler.js';

const router = Router();

router.use('/workflows', workflowRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/scheduler', schedulerRoutes);

export default router;
