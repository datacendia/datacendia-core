// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// ROUTE UTILITIES - Shared helpers for lazy loading and suspense
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoader } from '../components/ui/PageLoader';

export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
};

export const RedirectToCouncilWithQuery: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/cortex/council${location.search}`} replace />;
};
