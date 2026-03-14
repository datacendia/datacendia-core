/**
 * Route Config — Intelligence Routes
 *
 * React Router route definitions and lazy-loaded imports.
 *
 * @exports cortexIntelligenceRoutes
 * @module routes/cortex/intelligence.routes
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CORTEX INTELLIGENCE ROUTES - Decision Intelligence Pages
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper, RedirectToCouncilWithQuery } from '../utils';

const PreMortemPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.PreMortemPage }))
);
const GhostBoardPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.GhostBoardPage }))
);
const DecisionDebtPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.DecisionDebtPage }))
);
const LiveDemoPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.LiveDemoPage }))
);
// Enterprise tier — actual pages commented out, gated to UpgradePage
// const RegulatoryAbsorbPage = lazy(() =>
//   import('../../pages/cortex/intelligence').then((m) => ({ default: m.RegulatoryAbsorbPage }))
// );
// const DecisionDNAPage = lazy(() =>
//   import('../../pages/cortex/intelligence').then((m) => ({ default: m.DecisionDNAPage }))
// );
const ChronosPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.ChronosPage }))
);
// const CendiaLensPage = lazy(() =>
//   import('../../pages/cortex/intelligence').then((m) => ({ default: m.CendiaLensPage }))
// );

// Enterprise tier — advanced DECIDE pages commented out, gated to UpgradePage
// const OrbitPage = lazy(() =>
//   import('../../pages/cortex/intelligence/OrbitPage').then((m) => ({ default: m.OrbitPage }))
// );
// const ConsensusBuilderPage = lazy(() =>
//   import('../../pages/cortex/intelligence/ConsensusBuilderPage').then((m) => ({ default: m.ConsensusBuilderPage }))
// );
// const WhatIfScenariosPage = lazy(() =>
//   import('../../pages/cortex/intelligence/WhatIfScenariosPage').then((m) => ({ default: m.WhatIfScenariosPage }))
// );
// const SynthesisEnginePage = lazy(() =>
//   import('../../pages/cortex/intelligence/SynthesisEnginePage').then((m) => ({ default: m.SynthesisEnginePage }))
// );
// const RDPServicePage = lazy(() =>
//   import('../../pages/cortex/intelligence/RDPServicePage').then((m) => ({ default: m.RDPServicePage }))
// );
const UpgradePage = lazy(() => import('../../pages/cortex/UpgradePage'));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexIntelligenceRoutes: RouteObject[] = [
  { path: 'intelligence', element: <Navigate to="/cortex/intelligence/pre-mortem" replace /> },
  { path: 'intelligence/council', element: <RedirectToCouncilWithQuery /> },
  { path: 'intelligence/pre-mortem', element: w(PreMortemPage) },
  { path: 'intelligence/ghost-board', element: w(GhostBoardPage) },
  { path: 'intelligence/decision-debt', element: w(DecisionDebtPage) },
  { path: 'intelligence/live-demo', element: w(LiveDemoPage) },
  { path: 'intelligence/chronos', element: w(ChronosPage) },

  // Enterprise tier — advanced intelligence (gated to upgrade page)
  { path: 'intelligence/regulatory', element: w(UpgradePage) },
  { path: 'intelligence/decision-dna', element: w(UpgradePage) },
  { path: 'intelligence/lens', element: w(UpgradePage) },
  { path: 'intelligence/orbit', element: w(UpgradePage) },
  { path: 'intelligence/consensus', element: w(UpgradePage) },
  { path: 'intelligence/what-if', element: w(UpgradePage) },
  { path: 'intelligence/synthesis', element: w(UpgradePage) },
  { path: 'intelligence/rdp', element: w(UpgradePage) },
  { path: 'intelligence/audit-provenance', element: w(UpgradePage) },
];
