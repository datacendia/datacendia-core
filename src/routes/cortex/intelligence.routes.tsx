// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
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
const RegulatoryAbsorbPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.RegulatoryAbsorbPage }))
);
const DecisionDNAPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.DecisionDNAPage }))
);
const ChronosPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.ChronosPage }))
);
const CendiaLensPage = lazy(() =>
  import('../../pages/cortex/intelligence').then((m) => ({ default: m.CendiaLensPage }))
);

// New DECIDE Pages
const OrbitPage = lazy(() =>
  import('../../pages/cortex/intelligence/OrbitPage').then((m) => ({ default: m.OrbitPage }))
);
const ConsensusBuilderPage = lazy(() =>
  import('../../pages/cortex/intelligence/ConsensusBuilderPage').then((m) => ({ default: m.ConsensusBuilderPage }))
);
const WhatIfScenariosPage = lazy(() =>
  import('../../pages/cortex/intelligence/WhatIfScenariosPage').then((m) => ({ default: m.WhatIfScenariosPage }))
);
const SynthesisEnginePage = lazy(() =>
  import('../../pages/cortex/intelligence/SynthesisEnginePage').then((m) => ({ default: m.SynthesisEnginePage }))
);
const RDPServicePage = lazy(() =>
  import('../../pages/cortex/intelligence/RDPServicePage').then((m) => ({ default: m.RDPServicePage }))
);

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
  { path: 'intelligence/regulatory', element: w(RegulatoryAbsorbPage) },
  { path: 'intelligence/decision-dna', element: w(DecisionDNAPage) },
  { path: 'intelligence/chronos', element: w(ChronosPage) },
  { path: 'intelligence/lens', element: w(CendiaLensPage) },

  // New DECIDE routes
  { path: 'intelligence/orbit', element: w(OrbitPage) },
  { path: 'intelligence/consensus', element: w(ConsensusBuilderPage) },
  { path: 'intelligence/what-if', element: w(WhatIfScenariosPage) },
  { path: 'intelligence/synthesis', element: w(SynthesisEnginePage) },
  { path: 'intelligence/rdp', element: w(RDPServicePage) },
];
