// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - APPLICATION ROUTES (Composed from domain modules)
// =============================================================================

// Error Pages (keep non-lazy for fast 404)
import { NotFoundPage } from './pages/NotFoundPage';

// =============================================================================
// LAYOUTS - Load immediately (critical for shell)
// =============================================================================
import { CortexLayout } from './layouts/CortexLayout';

// =============================================================================
// DOMAIN ROUTE MODULES - 9 files replacing 2,400+ lines of inline routes
// =============================================================================
import { publicRoutes } from './routes/public.routes';
import { authRoutes } from './routes/auth.routes';
import { verticalsRoutes } from './routes/verticals.routes';
import { adminRoutes } from './routes/admin.routes';
import { cortexCoreRoutes } from './routes/cortex/core.routes';
import { cortexIntelligenceRoutes } from './routes/cortex/intelligence.routes';
import { cortexEnterpriseRoutes } from './routes/cortex/enterprise.routes';
import { cortexSovereignRoutes } from './routes/cortex/sovereign.routes';
import { cortexPlatformRoutes } from './routes/cortex/platform.routes';

import { createBrowserRouter } from 'react-router-dom';
import { lazyLoad } from './routes/utils';

// =============================================================================
// ROUTE CONFIGURATION - Composed from domain modules
// =============================================================================

export const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...verticalsRoutes,

  // CORTEX APPLICATION
  {
    path: '/cortex',
    element: <CortexLayout />,
    children: [
      ...cortexCoreRoutes,
      ...cortexIntelligenceRoutes,
      ...cortexEnterpriseRoutes,
      ...cortexSovereignRoutes,
      ...cortexPlatformRoutes,
    ],
  },

  ...adminRoutes,

  // TOOLS
  {
    path: '/tools',
    element: <CortexLayout />,
    children: [
      { path: 'roi-calculator', element: lazyLoad(() => import('./pages/tools').then((m) => ({ default: m.ROICalculator }))) },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Route helpers (same as before)
export const routes = {
  home: '/',
  pricing: '/pricing',
  demo: '/demo',
  product: '/product',
  about: '/about',
  manifesto: '/manifesto',
  downloads: '/downloads',
  services: '/services',
  packages: '/packages',
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  cortex: '/cortex',
  dashboard: '/cortex/dashboard',
  graph: '/cortex/graph',
  lineage: (entityId?: string) =>
    entityId ? `/cortex/graph/lineage/${entityId}` : '/cortex/graph/lineage',
  entity: (entityId: string) => `/cortex/graph/entity/${entityId}`,
  council: '/cortex/council',
  deliberation: (id: string) => `/cortex/council/deliberation/${id}`,
  agent: (id: string) => `/cortex/council/agent/${id}`,
  pulse: '/cortex/pulse',
  alerts: '/cortex/pulse/alerts',
  metrics: '/cortex/pulse/metrics',
  bridge: '/cortex/bridge',
  workflows: '/cortex/bridge/workflows',
  workflow: (id: string) => `/cortex/bridge/workflows/${id}`,
  newWorkflow: '/cortex/bridge/workflows/new',
  approvals: '/cortex/bridge/approvals',
  bridgeIntegrations: '/cortex/bridge/integrations',
  data: '/cortex/data',
  dataSources: '/cortex/data/sources',
  dataCatalog: '/cortex/data/catalog',
  dataQuality: '/cortex/data/quality',
  dataImportExport: '/cortex/data/import-export',
  security: '/cortex/security',
  accessControl: '/cortex/security/access',
  auditLog: '/cortex/security/audit',
  securityPolicies: '/cortex/security/policies',
  settings: '/cortex/settings',
  settingsOrganization: '/cortex/settings/organization',
  settingsUsers: '/cortex/settings/users',
  settingsTeams: '/cortex/settings/teams',
  settingsRoles: '/cortex/settings/roles',
  settingsBilling: '/cortex/settings/billing',
  settingsApiKeys: '/cortex/settings/api-keys',
  settingsIntegrations: '/cortex/settings/integrations',
  settingsPreferences: '/cortex/settings/preferences',
  settingsSecurity: '/cortex/settings/security',
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminTenants: '/admin/tenants',
  adminLicenses: '/admin/licenses',
  adminUsage: '/admin/usage',
  adminHealth: '/admin/health',
  adminFeatures: '/admin/features',
  adminRDLab: '/admin/rd-lab',
};

export default router;
