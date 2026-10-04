/**
 * Page — Index
 *
 * React page component rendered by the router.
 *
 * @exports AdminLayout, AdminDashboardPage
 * @module pages/admin/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - ADMIN CONSOLE PAGES
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { LogoSimple } from '../../components/brand/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { AdminRequestError, adminService, type PlatformDashboard } from '../../services/AdminService';

// =============================================================================
// ADMIN LAYOUT
// =============================================================================

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = (user?.name || user?.email || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'marketing', label: 'Marketing CMS', icon: '🌐', path: '/admin/marketing', ownerOnly: true },
    { id: 'marketing-studio', label: 'Marketing Studio', icon: '🎬', path: '/admin/marketing-studio', ownerOnly: true },
    { id: 'sovereign-stack', label: 'Sovereign Stack', icon: '🖥️', path: '/admin/sovereign-stack' },
    { id: 'control-center', label: 'Control Center', icon: '🎛️', path: '/admin/control-center' },
    { id: 'ai', label: 'Admin AI', icon: '🤖', path: '/admin/ai' },
    { id: 'tenants', label: 'Tenants', icon: '🏢', path: '/admin/tenants' },
    { id: 'data-sources', label: 'Data Sources', icon: '🗄️', path: '/admin/data-sources' },
    { id: 'mode-analytics', label: 'Council Analytics', icon: '🎯', path: '/admin/mode-analytics' },
    { id: 'rd-lab', label: 'R&D Lab', icon: '🔬', path: '/admin/rd-lab' },
    { id: 'core', label: 'Datacendia Core', icon: '👑', path: '/admin/core' },
    { id: 'licenses', label: 'Licenses', icon: '📜', path: '/admin/licenses' },
    { id: 'usage', label: 'Usage Analytics', icon: '📈', path: '/admin/usage' },
    { id: 'health', label: 'System Health', icon: '💓', path: '/admin/health' },
    { id: 'features', label: 'Feature Flags', icon: '🚩', path: '/admin/features' },
    { id: 'env-config', label: 'Environment Config', icon: '⚙️', path: '/admin/env-config' },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Admin Header */}
      <header className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center px-6">
        <div className="flex items-center gap-3">
          <LogoSimple size={32} />
          <span className="text-white font-semibold">Datacendia Admin</span>
          <span className="px-2 py-0.5 bg-warning-main/20 text-warning-main text-xs rounded-full">
            Admin Console
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a href="/cortex" className="text-neutral-400 hover:text-white text-sm">
            ← Back to Cortex
          </a>
          <div
            className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center"
            title={user?.name || user?.email}
          >
            <span className="text-white text-sm">{initials}</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-800 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            {/* The marketing tools are the platform owner's: SUPER_ADMIN, the same
                role the dashboard API requires. Their routes are guarded too. */}
            {adminNav.filter((item) => !item.ownerOnly || user?.role === 'SUPER_ADMIN').map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// ADMIN DASHBOARD
// =============================================================================

export const AdminDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<PlatformDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status?: number; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let stopped = false;
    const refresh: { timer?: ReturnType<typeof setInterval> } = {};
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        if (!stopped) {
          setDashboard(data);
          setError(null);
        }
      } catch (err) {
        if (stopped) {
          return;
        }
        const status = err instanceof AdminRequestError ? err.status : undefined;
        setError({ status, message: err instanceof Error ? err.message : 'Request failed' });
        if (status === 401 || status === 403) {
          // Access was withdrawn: stop showing the figures an earlier refresh
          // loaded. Asking again every 30 seconds won't change a refusal.
          setDashboard(null);
          clearInterval(refresh.timer);
        }
      } finally {
        if (!stopped) {
          setLoading(false);
        }
      }
    };
    loadDashboard();
    // Refresh every 30 seconds
    refresh.timer = setInterval(loadDashboard, 30000);
    return () => {
      stopped = true;
      clearInterval(refresh.timer);
    };
  }, [attempt]);

  const title = (
    <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>ADMIN DASHBOARD</h1>
  );

  if (loading && !dashboard && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!dashboard) {
    const refused = error?.status === 403;
    return (
      <div>
        {title}
        <div className="mt-6 max-w-xl bg-neutral-800 rounded-xl p-8 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-2">
            {refused ? 'For platform operators' : 'The dashboard could not be loaded'}
          </h2>
          {refused ? (
            <p className="text-neutral-400 text-sm">
              This dashboard adds up every tenant&apos;s revenue and activity, so only platform operators can open it.
              Your organization&apos;s users, teams and settings are in{' '}
              <Link to="/cortex/settings" className="text-primary-400 hover:underline">
                Settings
              </Link>
              .
            </p>
          ) : (
            <>
              <p className="text-neutral-400 text-sm">{error?.message}</p>
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="mt-4 px-4 py-2 text-sm rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Tenants',
      value: formatNumber(dashboard.tenants.total),
      detail: `${formatNumber(dashboard.tenants.active)} active · ${formatNumber(dashboard.tenants.trial)} on trial`,
      color: 'text-primary-400',
    },
    { label: 'Users', value: formatNumber(dashboard.users.total), detail: 'Across all tenants', color: 'text-success-main' },
    {
      label: 'MRR',
      value: formatCurrency(dashboard.revenue.mrr),
      detail: `ARR ${formatCurrency(dashboard.revenue.arr)}`,
      color: 'text-success-main',
    },
    {
      label: 'Licenses',
      value: formatNumber(dashboard.licenses.total),
      detail: `${formatNumber(dashboard.licenses.expiring)} expiring within 30 days`,
      color: 'text-info-main',
    },
  ];

  const growthPeak = Math.max(1, ...dashboard.tenantGrowth.map((m) => m.count));
  const hasGrowth = dashboard.tenantGrowth.some((m) => m.count > 0);
  const planPeak = Math.max(1, ...dashboard.revenueByPlan.map((p) => p.mrr));
  const monthLabel = (month: string) =>
    new Date(`${month}-01T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const planLabel = (plan: string) => plan.charAt(0) + plan.slice(1).toLowerCase();

  const recentActivity = dashboard.recentActivity.map((a) => ({
    event: a.event,
    organization: a.organization,
    time: new Date(a.time),
    isAlert: a.isAlert,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {title}
        {error && <span className="text-warning-main text-sm">Could not refresh: {error.message}</span>}
        <span className="text-neutral-500 text-xs">
          Last updated: {formatRelativeTime(new Date(dashboard.lastUpdated))}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-neutral-500 text-sm mt-1">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">New Tenants by Month</h2>
          {hasGrowth ? (
            <div className="h-48 flex items-end gap-3">
              {dashboard.tenantGrowth.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <span className="text-xs text-neutral-400">{m.count}</span>
                  <div
                    className="w-full rounded-t bg-primary-500/70"
                    style={{ height: Math.max(2, Math.round((m.count / growthPeak) * 120)) }}
                  />
                  <span className="text-xs text-neutral-500">{monthLabel(m.month)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="h-48 flex items-center justify-center text-neutral-500 text-sm">
              No new tenants in the last six months
            </p>
          )}
        </div>
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">MRR by Plan</h2>
          {dashboard.revenueByPlan.length > 0 ? (
            <div className="space-y-4">
              {dashboard.revenueByPlan.map((p) => (
                <div key={p.plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-300">{planLabel(p.plan)}</span>
                    <span className="text-neutral-400">{formatCurrency(p.mrr)}</span>
                  </div>
                  <div className="h-2 rounded bg-neutral-700">
                    <div className="h-2 rounded bg-success-main" style={{ width: `${(p.mrr / planPeak) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="h-48 flex items-center justify-center text-neutral-500 text-sm">No paying tenants yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        {recentActivity.length === 0 && <p className="text-neutral-500 text-sm">No activity yet</p>}
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    item.isAlert ? 'bg-warning-main' : 'bg-success-main'
                  )}
                />
                <div>
                  <p className="text-white">{item.event}</p>
                  <p className="text-sm text-neutral-400">{item.organization}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(item.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Inline page implementations removed - using dedicated files instead

export default AdminLayout;

// Re-export pages from dedicated files
export { DataSourcesPage } from './DataSourcesPage';
export { TenantsPage } from './TenantsPage';
export { LicensesPage } from './LicensesPage';
export { UsageAnalyticsPage } from './UsageAnalyticsPage';
export { SystemHealthPage } from './SystemHealthPage';
export { FeatureFlagsPage } from './FeatureFlagsPage';
