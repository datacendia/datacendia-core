// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ENTERPRISE DOMAIN ROUTER - Enterprise Services
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import enterpriseSecurityRoutes from '../enterprise.security.js';
import ledgerRoutes from '../ledger.js';
import auditPackagesRoutes from '../audit-packages.js';
import adaptersRoutes from '../adapters.js';
import connectorsRoutes from '../connectors.js';
import carbonAwareRoutes from '../carbon-aware.js';
import hrRoutes from '../hr.js';
import salaryRoutes from '../salary.js';

const router = Router();

// Community routes
router.use('/enterprise/security', enterpriseSecurityRoutes); // Must come BEFORE /enterprise
router.use('/ledger', ledgerRoutes);
router.use('/audit-packages', auditPackagesRoutes);
router.use('/adapters', adaptersRoutes);
router.use('/connectors', connectorsRoutes);
router.use('/carbon-aware', carbonAwareRoutes);
router.use('/hr', hrRoutes);
router.use('/salary', salaryRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/sso', () => import('../sso.js')],
  ['/enterprise', () => import('../enterprise.js')],
  ['/cascade', () => import('../cascade.js')],
  ['/strategic', () => import('../strategic.js')],
  ['/enterprise-connectors', () => import('../enterprise-connectors.js')],
  ['/ai-insurance', () => import('../ai-insurance.js')],
]);

export default router;
