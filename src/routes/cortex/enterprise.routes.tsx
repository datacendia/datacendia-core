// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CORTEX ENTERPRISE ROUTES - Enterprise Platinum Services
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageLoader } from '../../components/ui/PageLoader';

const EnterprisePlatinumDashboard = lazy(() =>
  import('../../pages/cortex/enterprise/EnterprisePlatinumDashboard')
);
const EnterpriseCorporationHub = lazy(() =>
  import('../../pages/cortex/enterprise/EnterpriseCorporationHub')
);
const PolicyAuthoringPage = lazy(() =>
  import('../../pages/cortex/enterprise/PolicyAuthoringPage')
);
const FeedbackLoopPage = lazy(() =>
  import('../../pages/cortex/enterprise/FeedbackLoopPage')
);
const ModelRegistryPage = lazy(() =>
  import('../../pages/cortex/enterprise/ModelRegistryPage')
);

const w = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}><Component /></Suspense>
);

export const cortexEnterpriseRoutes: RouteObject[] = [
  { path: 'enterprise', element: w(EnterprisePlatinumDashboard) },
  { path: 'enterprise/platinum', element: w(EnterprisePlatinumDashboard) },
  { path: 'enterprise/services', element: w(EnterprisePlatinumDashboard) },
  { path: 'enterprise/trust-score', element: w(EnterprisePlatinumDashboard) },
  { path: 'enterprise/marketplace', element: w(EnterprisePlatinumDashboard) },
  { path: 'enterprise/corporation', element: w(EnterpriseCorporationHub) },
  { path: 'enterprise/policy-authoring', element: w(PolicyAuthoringPage) },
  { path: 'enterprise/feedback', element: w(FeedbackLoopPage) },
  { path: 'enterprise/model-registry', element: w(ModelRegistryPage) },
];
