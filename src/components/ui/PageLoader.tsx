/**
 * Component — Page Loader
 *
 * Reusable React UI component.
 *
 * @exports PageLoader
 * @module components/ui/PageLoader
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// PAGE LOADER - Suspense fallback for lazy-loaded routes
// =============================================================================

import React from 'react';

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
      </div>
      <p className="text-neutral-500 text-sm">{message}</p>
    </div>
  </div>
);

export default PageLoader;
