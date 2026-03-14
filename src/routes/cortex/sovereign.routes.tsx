/**
 * Route Config — Sovereign Routes
 *
 * React Router route definitions and lazy-loaded imports.
 *
 * @exports cortexSovereignRoutes
 * @module routes/cortex/sovereign.routes
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CORTEX SOVEREIGN ROUTES - Sovereign Tier, Defense, Simulation
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../utils';

// All sovereign routes are Enterprise/Strategic tier — gated in Community Edition
// Actual page implementations exist but are only served by datacendia-components

// const CruciblePage = lazy(() => import('../../pages/sovereign/CruciblePage').then((m) => ({ default: m.CruciblePage })));
// const PanopticonPage = lazy(() => import('../../pages/sovereign/PanopticonPage').then((m) => ({ default: m.PanopticonPage })));
// const AegisPage = lazy(() => import('../../pages/sovereign/AegisPage').then((m) => ({ default: m.AegisPage })));
// const EternalPage = lazy(() => import('../../pages/sovereign/EternalPage').then((m) => ({ default: m.EternalPage })));
// const ShadowOpsPage = lazy(() => import('../../pages/cortex/sovereign/ShadowOpsPage').then((m) => ({ default: m.ShadowOpsPage })));
// const SuccessionPage = lazy(() => import('../../pages/cortex/sovereign/SuccessionPage').then((m) => ({ default: m.SuccessionPage })));
// const SanctuaryPage = lazy(() => import('../../pages/cortex/sovereign/SanctuaryPage').then((m) => ({ default: m.SanctuaryPage })));
// const NotaryPage = lazy(() => import('../../pages/cortex/sovereign/NotaryPage'));
// const VaultPage = lazy(() => import('../../pages/cortex/sovereign/VaultPage'));
// const SymbiontPage = lazy(() => import('../../pages/sovereign/SymbiontPage').then((m) => ({ default: m.SymbiontPage })));
// const VoxPage = lazy(() => import('../../pages/sovereign/VoxPage').then((m) => ({ default: m.VoxPage })));
// const HorizonPage = lazy(() => import('../../pages/sovereign/HorizonPage'));
// const DefenseVerticalPage = lazy(() => import('../../pages/cortex/sovereign/DefenseVerticalPage').then((m) => ({ default: m.default })));
// const SGASPage = lazy(() => import('../../pages/cortex/sovereign/SGASPage'));
// const SCGEPage = lazy(() => import('../../pages/cortex/sovereign/SCGEPage'));
// const CollapsePage = lazy(() => import('../../pages/cortex/sovereign/CollapsePage'));

const UpgradePage = lazy(() => import('../../pages/cortex/UpgradePage'));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexSovereignRoutes: RouteObject[] = [
  // All sovereign routes redirect to upgrade page in Community Edition
  { path: 'sovereign', element: w(UpgradePage) },
  { path: 'sovereign/crucible', element: w(UpgradePage) },
  { path: 'sovereign/panopticon', element: w(UpgradePage) },
  { path: 'sovereign/oversight', element: w(UpgradePage) },
  { path: 'sovereign/aegis', element: w(UpgradePage) },
  { path: 'sovereign/eternal', element: w(UpgradePage) },
  { path: 'sovereign/shadow-ops', element: w(UpgradePage) },
  { path: 'sovereign/succession', element: w(UpgradePage) },
  { path: 'sovereign/sanctuary', element: w(UpgradePage) },
  { path: 'sovereign/notary', element: w(UpgradePage) },
  { path: 'sovereign/vault', element: w(UpgradePage) },
  { path: 'sovereign/symbiont', element: w(UpgradePage) },
  { path: 'sovereign/vox', element: w(UpgradePage) },
  { path: 'sovereign/horizon', element: w(UpgradePage) },
  { path: 'sovereign/defense', element: w(UpgradePage) },
  { path: 'sovereign/sgas', element: w(UpgradePage) },
  { path: 'sovereign/scge', element: w(UpgradePage) },
  { path: 'sovereign/collapse', element: w(UpgradePage) },
];
