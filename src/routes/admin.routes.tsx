// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADMIN ROUTES - Admin Panel Layout & Pages
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageLoader } from '../components/ui/PageLoader';
import { SuspenseWrapper } from './utils';

const AdminLayout = lazy(() => import('../pages/admin').then((m) => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() =>
  import('../pages/admin').then((m) => ({ default: m.AdminDashboardPage }))
);
const TenantsPage = lazy(() => import('../pages/admin').then((m) => ({ default: m.TenantsPage })));
const LicensesPage = lazy(() => import('../pages/admin').then((m) => ({ default: m.LicensesPage })));
const UsageAnalyticsPage = lazy(() =>
  import('../pages/admin').then((m) => ({ default: m.UsageAnalyticsPage }))
);
const SystemHealthPage = lazy(() =>
  import('../pages/admin').then((m) => ({ default: m.SystemHealthPage }))
);
const FeatureFlagsPage = lazy(() =>
  import('../pages/admin').then((m) => ({ default: m.FeatureFlagsPage }))
);
const AdminDataSourcesPage = lazy(() =>
  import('../pages/admin').then((m) => ({ default: m.DataSourcesPage }))
);
const ModeAnalytics = lazy(() => import('../pages/admin/ModeAnalytics'));
const RDLabPage = lazy(() =>
  import('../pages/admin/RDLabPage').then((m) => ({ default: m.RDLabPage }))
);
const CorePage = lazy(() => import('../pages/admin/CorePage'));
const ControlCenterPage = lazy(() =>
  import('../pages/admin/ControlCenterPage').then((m) => ({ default: m.ControlCenterPage }))
);
const AdminAIPage = lazy(() =>
  import('../pages/admin/AdminAIPage').then((m) => ({ default: m.AdminAIPage }))
);
const SovereignStackPage = lazy(() => import('../pages/admin/SovereignStackPage'));
const MarketingCMSPage = lazy(() => import('../pages/admin/MarketingCMSPage'));
const EnvironmentConfigPage = lazy(() => import('../pages/admin/EnvironmentConfigPage').then((m) => ({ default: m.default })));
const MarketingStudioPage = lazy(() => import('../pages/admin/MarketingStudioPage').then((m) => ({ default: m.default })));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: w(AdminDashboardPage) },
      { path: 'dashboard', element: w(AdminDashboardPage) },
      { path: 'tenants', element: w(TenantsPage) },
      { path: 'licenses', element: w(LicensesPage) },
      { path: 'usage', element: w(UsageAnalyticsPage) },
      { path: 'health', element: w(SystemHealthPage) },
      { path: 'features', element: w(FeatureFlagsPage) },
      { path: 'data-sources', element: w(AdminDataSourcesPage) },
      { path: 'mode-analytics', element: w(ModeAnalytics) },
      { path: 'rd-lab', element: w(RDLabPage) },
      { path: 'core', element: w(CorePage) },
      { path: 'control-center', element: w(ControlCenterPage) },
      { path: 'ai', element: w(AdminAIPage) },
      { path: 'sovereign-stack', element: w(SovereignStackPage) },
      { path: 'marketing', element: w(MarketingCMSPage) },
      { path: 'env-config', element: w(EnvironmentConfigPage) },
      { path: 'marketing-studio', element: w(MarketingStudioPage) },
    ],
  },
];
