// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CORTEX PLATFORM ROUTES - Data, Compliance, Security, Settings, Crown, Pillars
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { PageLoader } from '../../components/ui/PageLoader';
import { SuspenseWrapper } from '../utils';

// Pillar Pages
const HelmPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.HelmPage }))
);
const LineagePage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.LineagePage }))
);
const PredictPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.PredictPage }))
);
const FlowPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.FlowPage }))
);
const HealthPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.HealthPage }))
);
const GuardPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.GuardPage }))
);
const EthicsPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.EthicsPage }))
);
const AgentsPage = lazy(() =>
  import('../../pages/cortex/pillars').then((m) => ({ default: m.AgentsPage }))
);

// Data Pages
const DataSourcesPage = lazy(() =>
  import('../../pages/cortex/data').then((m) => ({ default: m.DataSourcesPage }))
);
const DataCatalogPage = lazy(() =>
  import('../../pages/cortex/data').then((m) => ({ default: m.DataCatalogPage }))
);
const DataQualityPage = lazy(() =>
  import('../../pages/cortex/data').then((m) => ({ default: m.DataQualityPage }))
);
const DataImportExportPage = lazy(() =>
  import('../../pages/cortex/data').then((m) => ({ default: m.DataImportExportPage }))
);

// Compliance
const ComplianceDashboard = lazy(() =>
  import('../../pages/cortex/compliance/ComplianceDashboard').then((m) => ({ default: m.default }))
);

// Walkthroughs
const WalkthroughsPage = lazy(() => import('../../pages/cortex/walkthroughs/WalkthroughsPage'));

// Security Pages
const SecurityOverviewPage = lazy(() =>
  import('../../pages/cortex/security').then((m) => ({ default: m.SecurityOverviewPage }))
);
const AccessControlPage = lazy(() =>
  import('../../pages/cortex/security').then((m) => ({ default: m.AccessControlPage }))
);
const AuditLogPage = lazy(() =>
  import('../../pages/cortex/security').then((m) => ({ default: m.AuditLogPage }))
);
const SecurityPoliciesPage = lazy(() =>
  import('../../pages/cortex/security').then((m) => ({ default: m.SecurityPoliciesPage }))
);

// Settings
const SettingsLayout = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.SettingsLayout }))
);
const OrganizationSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.OrganizationSettingsPage }))
);
const UsersSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.UsersSettingsPage }))
);
const TeamsSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.TeamsSettingsPage }))
);
const RolesSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.RolesSettingsPage }))
);
const BillingSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.BillingSettingsPage }))
);
const ApiKeysSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.ApiKeysSettingsPage }))
);
const IntegrationSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.IntegrationSettingsPage }))
);
const PreferencesSettingsPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.PreferencesSettingsPage }))
);
const SettingsSecurityPage = lazy(() =>
  import('../../pages/settings').then((m) => ({ default: m.SecuritySettingsPage }))
);

// Crown Jewels
const EchoPage = lazy(() => import('../../pages/cortex/crown').then((m) => ({ default: m.EchoPage })));
const RedTeamPage = lazy(() =>
  import('../../pages/cortex/crown').then((m) => ({ default: m.RedTeamPage }))
);
const GnosisPage = lazy(() =>
  import('../../pages/cortex/crown').then((m) => ({ default: m.GnosisPage }))
);

// Demo & Showcase
const ShowcaseDashboard = lazy(() => import('../../components/showcase/ShowcaseDashboard'));
const DemoLauncherPage = lazy(() => import('../../pages/cortex/demo/DemoLauncherPage'));
const LegalDemoShowcasePage = lazy(() => import('../../pages/cortex/demo/LegalDemoShowcasePage'));

// Admin (cortex-level)
const VerticalConfigPage = lazy(() =>
  import('../../pages/cortex/admin').then((m) => ({ default: m.VerticalConfigPage }))
);

// Tools
const ROICalculator = lazy(() =>
  import('../../pages/tools').then((m) => ({ default: m.ROICalculator }))
);

// Profile & Help (MVP)
const UserProfilePage = lazy(() =>
  import('../../pages/cortex/profile/UserProfilePage').then((m) => ({ default: m.UserProfilePage }))
);
const GettingStartedPage = lazy(() =>
  import('../../pages/cortex/help/GettingStartedPage').then((m) => ({ default: m.GettingStartedPage }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexPlatformRoutes: RouteObject[] = [
  // Pillars
  { path: 'pillars', element: <Navigate to="/cortex/pillars/helm" replace /> },
  { path: 'pillars/helm', element: w(HelmPage) },
  { path: 'pillars/lineage', element: w(LineagePage) },
  { path: 'pillars/predict', element: w(PredictPage) },
  { path: 'pillars/flow', element: w(FlowPage) },
  { path: 'pillars/health', element: w(HealthPage) },
  { path: 'pillars/guard', element: w(GuardPage) },
  { path: 'pillars/ethics', element: w(EthicsPage) },
  { path: 'pillars/agents', element: w(AgentsPage) },

  // Data
  { path: 'data', element: <Navigate to="/cortex/data/sources" replace /> },
  { path: 'data/sources', element: w(DataSourcesPage) },
  { path: 'data/catalog', element: w(DataCatalogPage) },
  { path: 'data/quality', element: w(DataQualityPage) },
  { path: 'data/import-export', element: w(DataImportExportPage) },

  // Compliance
  { path: 'compliance', element: w(ComplianceDashboard) },

  // Walkthroughs
  { path: 'walkthroughs', element: w(WalkthroughsPage) },

  // Security
  { path: 'security', element: w(SecurityOverviewPage) },
  { path: 'security/access', element: w(AccessControlPage) },
  { path: 'security/audit', element: w(AuditLogPage) },
  { path: 'security/policies', element: w(SecurityPoliciesPage) },

  // Settings
  {
    path: 'settings',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SettingsLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/cortex/settings/organization" replace /> },
      { path: 'organization', element: w(OrganizationSettingsPage) },
      { path: 'users', element: w(UsersSettingsPage) },
      { path: 'teams', element: w(TeamsSettingsPage) },
      { path: 'roles', element: w(RolesSettingsPage) },
      { path: 'billing', element: w(BillingSettingsPage) },
      { path: 'api-keys', element: w(ApiKeysSettingsPage) },
      { path: 'integrations', element: w(IntegrationSettingsPage) },
      { path: 'preferences', element: w(PreferencesSettingsPage) },
      { path: 'security', element: w(SettingsSecurityPage) },
    ],
  },

  // Route Aliases
  { path: 'core/chronos', element: <Navigate to="/cortex/intelligence/chronos" replace /> },
  { path: 'core/council', element: <Navigate to="/cortex/council" replace /> },
  { path: 'trust/oversight', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
  { path: 'enterprise/audit', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
  { path: 'trust/decision-dna', element: <Navigate to="/cortex/intelligence/decision-dna" replace /> },
  { path: 'trust/crucible', element: <Navigate to="/cortex/sovereign/crucible" replace /> },

  // Admin
  { path: 'admin', element: <Navigate to="/cortex/admin/vertical-config" replace /> },
  { path: 'admin/vertical-config', element: w(VerticalConfigPage) },

  // Showcase & Demo
  { path: 'showcase', element: w(ShowcaseDashboard) },
  { path: 'demo', element: w(DemoLauncherPage) },
  { path: 'demo/legal', element: w(LegalDemoShowcasePage) },

  // Crown Jewels
  { path: 'crown', element: <Navigate to="/cortex/crown/echo" replace /> },
  { path: 'crown/echo', element: w(EchoPage) },
  { path: 'crown/redteam', element: w(RedTeamPage) },
  { path: 'crown/gnosis', element: w(GnosisPage) },

  // Profile & Help (MVP)
  { path: 'profile', element: w(UserProfilePage) },
  { path: 'help', element: w(GettingStartedPage) },
  { path: 'getting-started', element: <Navigate to="/cortex/help" replace /> },
];
