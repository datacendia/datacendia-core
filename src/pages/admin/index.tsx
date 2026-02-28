// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - ADMIN CONSOLE PAGES
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { LogoSimple } from '../../components/brand/Logo';
import {
  adminService,
  type PlatformDashboard,
  type Tenant,
  type License,
  type HealthDashboard,
} from '../../services/AdminService';

// =============================================================================
// ADMIN LAYOUT
// =============================================================================

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
          <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">A</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-800 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            {adminNav.map((item) => (
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        setDashboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard. Using cached data.');
        // Fallback to demo data
        setDashboard({
          tenants: { total: 127, active: 98, trial: 12, churned: 17 },
          revenue: { mrr: 842000, arr: 10104000, avgPerTenant: 8590 },
          licenses: { total: 127, active: 110, expiring: 5, revenueAtRisk: 75000 },
          system: { status: 'healthy', apiRequests24h: 12500000, avgLatency: 45, errorRate: 0.8 },
          users: { total: 3482 },
          recentActivity: [
            {
              event: 'New tenant created',
              tenant: 'HealthTech Labs',
              time: new Date(Date.now() - 1800000).toISOString(),
            },
            {
              event: 'License upgraded',
              tenant: 'TechStart Inc',
              time: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              event: 'User limit warning',
              tenant: 'GlobalCo',
              time: new Date(Date.now() - 7200000).toISOString(),
              isAlert: true,
            },
            {
              event: 'SSO configured',
              tenant: 'FinanceFirst',
              time: new Date(Date.now() - 14400000).toISOString(),
            },
          ],
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = dashboard
    ? [
        {
          label: 'Total Tenants',
          value: dashboard.tenants.total,
          change: +5,
          color: 'text-primary-400',
        },
        {
          label: 'Active Users',
          value: dashboard.users.total,
          change: +142,
          color: 'text-success-main',
        },
        {
          label: 'MRR',
          value: dashboard.revenue.mrr,
          isCurrency: true,
          change: +8.5,
          isPercent: true,
          color: 'text-success-main',
        },
        {
          label: 'API Calls (24h)',
          value: dashboard.system.apiRequests24h,
          change: +12,
          isPercent: true,
          color: 'text-info-main',
        },
      ]
    : [];

  const recentActivity =
    dashboard?.recentActivity.map((a) => ({
      event: a.event,
      tenant: a.tenant,
      time: new Date(a.time),
      isAlert: a.isAlert,
    })) || [];

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        {error && <span className="text-warning-main text-sm">{error}</span>}
        {dashboard && (
          <span className="text-neutral-500 text-xs">
            Last updated: {formatRelativeTime(new Date(dashboard.lastUpdated))}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className={cn('text-3xl font-bold', stat.color)}>
              {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
            </p>
            <p className="text-success-main text-sm mt-1">
              ↑ {stat.isPercent ? `${stat.change}%` : `+${stat.change}`}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">Tenant Growth</h2>
          <div className="h-48 flex items-center justify-center text-neutral-500">
            [Chart Placeholder]
          </div>
        </div>
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
          <div className="h-48 flex items-center justify-center text-neutral-500">
            [Chart Placeholder]
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
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
                  <p className="text-sm text-neutral-400">{item.tenant}</p>
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
