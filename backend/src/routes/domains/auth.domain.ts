// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH DOMAIN ROUTER - Authentication & User Management
// =============================================================================

import { Router } from 'express';
import authRoutes from '../auth.js';
import userRoutes from '../users.js';
import organizationRoutes from '../organizations.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);

export default router;
