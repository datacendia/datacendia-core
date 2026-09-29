/**
 * Component — Route Error Page
 *
 * Shown in place of a page that failed to render, instead of React Router's
 * developer screen ("Unexpected Application Error! ... Hey developer").
 * @module components/RouteErrorPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useEffect } from 'react';
import { Link, isRouteErrorResponse, useLocation, useRouteError } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { logError } from '../lib/errorTracking';

interface Props {
  /** Where "back" goes: the dashboard inside the app, the home page outside it. */
  homeHref?: string;
  homeLabel?: string;
}

export const RouteErrorPage: React.FC<Props> = ({ homeHref = '/', homeLabel = 'Back to home' }) => {
  const error = useRouteError();
  const { pathname } = useLocation();

  const notFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    // A route can also fail with a response (a loader's 500): report that too,
    // but not an expected 404.
    if (notFound) {
      return;
    }
    const reported = error instanceof Error
      ? error
      : new Error(isRouteErrorResponse(error) ? `Route error ${error.status}: ${error.statusText}` : String(error));
    logError(reported, { metadata: { source: 'RouteErrorPage', route: pathname } }, 'high');
  }, [error, notFound, pathname]);

  // The message is for developers; the demo runs the dev server but hides it.
  const showDetails = import.meta.env.DEV && import.meta.env['VITE_HIDE_DEV_TOOLS'] !== 'true';

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <AlertTriangle className="h-7 w-7 text-amber-400" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-white">
          {notFound ? 'Page not found' : 'This page ran into a problem'}
        </h1>
        <p className="mb-6 text-sm text-slate-400">
          {notFound
            ? 'The page you were looking for does not exist.'
            : 'The rest of the platform is unaffected. Reload to try again, or go back and carry on.'}
        </p>
        {showDetails && error instanceof Error && (
          <p className="mb-6 break-words rounded-lg border border-slate-800 bg-slate-950 p-3 text-left font-mono text-xs text-red-300">
            {error.message}
          </p>
        )}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
          >
            <RefreshCw className="h-4 w-4" /> Reload
          </button>
          <Link
            to={homeHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorPage;
