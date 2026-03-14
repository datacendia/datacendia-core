/**
 * Route Config — Verticals Routes
 *
 * React Router route definitions and lazy-loaded imports.
 *
 * @exports verticalsRoutes
 * @module routes/verticals.routes
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// VERTICALS ROUTES - Industry-Specific Vertical Pages
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from './utils';

// Foundation tier — VerticalsHub kept as teaser (shows the list of industries)
const VerticalsHubPage = lazy(() =>
  import('../pages/verticals').then((m) => ({ default: m.VerticalsHubPage }))
);

// Strategic tier — individual vertical pages gated to UpgradePage
const UpgradePage = lazy(() => import('../pages/cortex/UpgradePage'));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const verticalsRoutes: RouteObject[] = [
  // Foundation tier — hub page kept as teaser
  { path: '/verticals', element: w(VerticalsHubPage) },
  { path: '/industries', element: w(VerticalsHubPage) },
  { path: '/solutions', element: w(VerticalsHubPage) },

  // Strategic tier — all individual verticals gated to upgrade page
  { path: '/verticals/healthcare', element: w(UpgradePage) },
  { path: '/verticals/financial-services', element: w(UpgradePage) },
  { path: '/verticals/government-legal', element: w(UpgradePage) },
  { path: '/verticals/legal', element: w(UpgradePage) },
  { path: '/verticals/insurance', element: w(UpgradePage) },
  { path: '/verticals/pharmaceutical', element: w(UpgradePage) },
  { path: '/verticals/manufacturing', element: w(UpgradePage) },
  { path: '/verticals/energy-utilities', element: w(UpgradePage) },
  { path: '/verticals/technology', element: w(UpgradePage) },
  { path: '/verticals/retail-hospitality', element: w(UpgradePage) },
  { path: '/verticals/real-estate', element: w(UpgradePage) },
  { path: '/verticals/transportation', element: w(UpgradePage) },
  { path: '/verticals/media-entertainment', element: w(UpgradePage) },
  { path: '/verticals/professional-services', element: w(UpgradePage) },
  { path: '/verticals/higher-education', element: w(UpgradePage) },
  { path: '/verticals/sports', element: w(UpgradePage) },
  { path: '/verticals/telecommunications', element: w(UpgradePage) },
  { path: '/verticals/aerospace', element: w(UpgradePage) },
  { path: '/verticals/agriculture', element: w(UpgradePage) },
  { path: '/verticals/automotive', element: w(UpgradePage) },
  { path: '/verticals/construction', element: w(UpgradePage) },
  { path: '/verticals/hospitality', element: w(UpgradePage) },
  { path: '/verticals/nonprofit', element: w(UpgradePage) },
  { path: '/verticals/industrial-services', element: w(UpgradePage) },
  { path: '/verticals/smart-city', element: w(UpgradePage) },
  { path: '/verticals/eu-banking', element: w(UpgradePage) },
];
