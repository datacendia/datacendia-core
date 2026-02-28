// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CORTEX CORE ROUTES - Dashboard, Graph, Council, Pulse, Bridge
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../utils';

const DashboardPage = lazy(() =>
  import('../../pages/cortex/MissionControlDashboard').then((m) => ({ default: m.MissionControlDashboard }))
);
const GraphExplorerPage = lazy(() =>
  import('../../pages/cortex/graph/GraphExplorerPage').then((m) => ({ default: m.GraphExplorerPage }))
);
const CouncilPage = lazy(() =>
  import('../../pages/cortex/council/CouncilPage').then((m) => ({ default: m.CouncilPage }))
);
const PulsePage = lazy(() =>
  import('../../pages/cortex/pulse/PulsePage').then((m) => ({ default: m.PulsePage }))
);
const BridgePage = lazy(() =>
  import('../../pages/cortex/bridge/BridgePage').then((m) => ({ default: m.BridgePage }))
);
const LineageViewPage = lazy(() =>
  import('../../pages/cortex/graph/subpages').then((m) => ({ default: m.LineageViewPage }))
);
const EntityDetailsPage = lazy(() =>
  import('../../pages/cortex/graph/subpages').then((m) => ({ default: m.EntityDetailsPage }))
);
const DeliberationViewPage = lazy(() =>
  import('../../pages/cortex/council/subpages').then((m) => ({ default: m.DeliberationViewPage }))
);
const DecisionsPage = lazy(() =>
  import('../../pages/cortex/council/DecisionsPage').then((m) => ({ default: m.DecisionsPage }))
);
const AgentProfilePage = lazy(() =>
  import('../../pages/cortex/council/subpages').then((m) => ({ default: m.AgentProfilePage }))
);
const AlertsPage = lazy(() =>
  import('../../pages/cortex/pulse/subpages').then((m) => ({ default: m.AlertsPage }))
);
const MetricsPage = lazy(() =>
  import('../../pages/cortex/pulse/subpages').then((m) => ({ default: m.MetricsPage }))
);
const WorkflowsListPage = lazy(() =>
  import('../../pages/cortex/bridge/subpages').then((m) => ({ default: m.WorkflowsListPage }))
);
const WorkflowBuilderPage = lazy(() =>
  import('../../pages/cortex/bridge/subpages').then((m) => ({ default: m.WorkflowBuilderPage }))
);
const ApprovalsPage = lazy(() =>
  import('../../pages/cortex/bridge/subpages').then((m) => ({ default: m.ApprovalsPage }))
);
const BridgeIntegrationsPage = lazy(() =>
  import('../../pages/cortex/bridge/subpages').then((m) => ({ default: m.BridgeIntegrationsPage }))
);

// New Council Pages
const CouncilModesPage = lazy(() =>
  import('../../pages/cortex/council/CouncilModesPage').then((m) => ({ default: m.CouncilModesPage }))
);
const PostDeliberationPanel = lazy(() =>
  import('../../pages/cortex/council/PostDeliberationPanel').then((m) => ({ default: m.PostDeliberationPanel }))
);
const UserInterventionPanel = lazy(() =>
  import('../../pages/cortex/council/UserInterventionPanel').then((m) => ({ default: m.UserInterventionPanel }))
);
const ExecutiveSummaryPage = lazy(() =>
  import('../../pages/cortex/council/ExecutiveSummaryPage').then((m) => ({ default: m.ExecutiveSummaryPage }))
);
const CouncilHistoryPage = lazy(() =>
  import('../../pages/cortex/council/CouncilHistoryPage').then((m) => ({ default: m.CouncilHistoryPage }))
);
const CouncilAnalyticsPage = lazy(() =>
  import('../../pages/cortex/council/CouncilAnalyticsPage').then((m) => ({ default: m.CouncilAnalyticsPage }))
);

// WOW Features - Visualization & Replay
const DeliberationVisualizationPage = lazy(() =>
  import('../../pages/cortex/council/DeliberationVisualizationPage').then((m) => ({ default: m.default }))
);
const DecisionReplayTheaterPage = lazy(() =>
  import('../../pages/cortex/council/DecisionReplayTheaterPage').then((m) => ({ default: m.default }))
);
const LiveAgentMonitorPage = lazy(() =>
  import('../../pages/cortex/monitor/LiveAgentMonitorPage').then((m) => ({ default: m.default }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexCoreRoutes: RouteObject[] = [
  // Dashboard
  { index: true, element: w(DashboardPage) },
  { path: 'dashboard', element: w(DashboardPage) },

  // Graph
  { path: 'graph', element: w(GraphExplorerPage) },
  { path: 'graph/lineage/:entityId?', element: w(LineageViewPage) },
  { path: 'graph/entity/:entityId', element: w(EntityDetailsPage) },

  // Council
  { path: 'council', element: w(CouncilPage) },
  { path: 'council/deliberation/:deliberationId', element: w(DeliberationViewPage) },
  { path: 'council/agent/:agentId', element: w(AgentProfilePage) },
  { path: 'decisions', element: w(DecisionsPage) },
  { path: 'council/visualization', element: w(DeliberationVisualizationPage) },
  { path: 'council/replay-theater', element: w(DecisionReplayTheaterPage) },
  { path: 'council/modes', element: w(CouncilModesPage) },
  { path: 'council/post-deliberation/:deliberationId?', element: w(PostDeliberationPanel) },
  { path: 'council/intervene/:deliberationId?', element: w(UserInterventionPanel) },
  { path: 'council/executive-summary', element: w(ExecutiveSummaryPage) },
  { path: 'council/history', element: w(CouncilHistoryPage) },
  { path: 'council/analytics', element: w(CouncilAnalyticsPage) },

  // Pulse
  { path: 'pulse', element: w(PulsePage) },
  { path: 'pulse/alerts', element: w(AlertsPage) },
  { path: 'pulse/metrics', element: w(MetricsPage) },

  // Bridge
  { path: 'bridge', element: w(BridgePage) },
  { path: 'bridge/workflows', element: w(WorkflowsListPage) },
  { path: 'bridge/workflows/:workflowId', element: w(WorkflowBuilderPage) },
  { path: 'bridge/workflows/new', element: w(WorkflowBuilderPage) },
  { path: 'bridge/approvals', element: w(ApprovalsPage) },
  { path: 'bridge/integrations', element: w(BridgeIntegrationsPage) },

  // CendiaPulse™
  { path: 'monitor/live', element: w(LiveAgentMonitorPage) },
];
