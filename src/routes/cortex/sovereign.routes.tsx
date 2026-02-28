// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CORTEX SOVEREIGN ROUTES - Sovereign Tier, Defense, Simulation
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../utils';

const CruciblePage = lazy(() =>
  import('../../pages/sovereign/CruciblePage').then((m) => ({ default: m.CruciblePage }))
);
const PanopticonPage = lazy(() =>
  import('../../pages/sovereign/PanopticonPage').then((m) => ({ default: m.PanopticonPage }))
);
const AegisPage = lazy(() =>
  import('../../pages/sovereign/AegisPage').then((m) => ({ default: m.AegisPage }))
);
const EternalPage = lazy(() =>
  import('../../pages/sovereign/EternalPage').then((m) => ({ default: m.EternalPage }))
);
const ShadowOpsPage = lazy(() =>
  import('../../pages/cortex/sovereign/ShadowOpsPage').then((m) => ({ default: m.ShadowOpsPage }))
);
const SuccessionPage = lazy(() =>
  import('../../pages/cortex/sovereign/SuccessionPage').then((m) => ({ default: m.SuccessionPage }))
);
const SanctuaryPage = lazy(() =>
  import('../../pages/cortex/sovereign/SanctuaryPage').then((m) => ({ default: m.SanctuaryPage }))
);
const NotaryPage = lazy(() => import('../../pages/cortex/sovereign/NotaryPage'));
const VaultPage = lazy(() => import('../../pages/cortex/sovereign/VaultPage'));
const SymbiontPage = lazy(() =>
  import('../../pages/sovereign/SymbiontPage').then((m) => ({ default: m.SymbiontPage }))
);
const VoxPage = lazy(() =>
  import('../../pages/sovereign/VoxPage').then((m) => ({ default: m.VoxPage }))
);
const HorizonPage = lazy(() => import('../../pages/sovereign/HorizonPage'));
const DefenseVerticalPage = lazy(() =>
  import('../../pages/cortex/sovereign/DefenseVerticalPage').then((m) => ({ default: m.default }))
);

// Simulation
const SGASPage = lazy(() => import('../../pages/cortex/sovereign/SGASPage'));
const SCGEPage = lazy(() => import('../../pages/cortex/sovereign/SCGEPage'));
const CollapsePage = lazy(() => import('../../pages/cortex/sovereign/CollapsePage'));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexSovereignRoutes: RouteObject[] = [
  { path: 'sovereign', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
  { path: 'sovereign/crucible', element: w(CruciblePage) },
  { path: 'sovereign/panopticon', element: w(PanopticonPage) },
  { path: 'sovereign/oversight', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
  { path: 'sovereign/aegis', element: w(AegisPage) },
  { path: 'sovereign/eternal', element: w(EternalPage) },
  { path: 'sovereign/shadow-ops', element: w(ShadowOpsPage) },
  { path: 'sovereign/succession', element: w(SuccessionPage) },
  { path: 'sovereign/sanctuary', element: w(SanctuaryPage) },
  { path: 'sovereign/notary', element: w(NotaryPage) },
  { path: 'sovereign/vault', element: w(VaultPage) },
  { path: 'sovereign/symbiont', element: w(SymbiontPage) },
  { path: 'sovereign/vox', element: w(VoxPage) },
  { path: 'sovereign/horizon', element: w(HorizonPage) },
  { path: 'sovereign/defense', element: w(DefenseVerticalPage) },
  { path: 'sovereign/sgas', element: w(SGASPage) },
  { path: 'sovereign/scge', element: w(SCGEPage) },
  { path: 'sovereign/collapse', element: w(CollapsePage) },
];
