// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// LEGAL DOMAIN ROUTER - Legal Services & Research
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';

const router = Router();

mountEnterpriseRoutes(router, [
  ['/legal', () => import('../legal.js')],
  ['/legal-research', () => import('../legal-research.js')],
  ['/legal-services', () => import('../legal-services.js')],
]);

export default router;
