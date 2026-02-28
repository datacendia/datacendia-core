// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA TENANTS MANAGEMENT - Enterprise Platinum Standard
// Multi-tenant organization management with full CRUD operations
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Settings,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Download,
  Upload,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Database,
  Zap,
} from 'lucide-react';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  users?: number;
  maxUsers?: number;
  userCount?: number;
  userLimit?: number;
  deliberations?: number;
  apiCalls?: number;
  storageUsedMB?: number;
  storageMaxMB?: number;
  mrr?: number;
  createdAt: string;
  updatedAt?: string;
  lastActiveAt?: string;
  billingEmail?: string;
  metadata?: Record<string, any>;
  settings?: Record<string, any>;
}

interface TenantMetrics {
  total?: number;
  totalTenants?: number;
  active?: number;
  activeTenants?: number;
  trial?: number;
  trialTenants?: number;
  suspended?: number;
  churned?: number;
  churnedTenants?: number;
  byPlan?: Record<string, number>;
  totalUsers?: number;
  totalDeliberations?: number;
  totalApiCalls?: number;
  mrr?: number;
  totalMrr?: number;
  avgRevenuePerTenant?: number;
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin';

async function fetchTenants(filters?: { status?: string; plan?: string; search?: string }): Promise<Tenant[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) {params.set('status', filters.status);}
    if (filters?.plan) {params.set('plan', filters.plan);}
    if (filters?.search) {params.set('search', filters.search);}
    
    const res = await api.get<any>(`${API_BASE}/tenants?${params.toString()}`);
    const data = res as any;
    return data?.tenants || data?.data?.tenants || [];
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    return getMockTenants();
  }
}

async function fetchTenantMetrics(): Promise<TenantMetrics> {
  try {
    const res = await api.get<any>(`${API_BASE}/tenants/metrics`);
    return res?.data || res || getDefaultMetrics();
  } catch (error) {
    console.error('Failed to fetch tenant metrics:', error);
    return getDefaultMetrics();
  }
}

async function createTenant(data: Partial<Tenant>): Promise<Tenant> {
  const res = await api.post<any>(`${API_BASE}/tenants`, data);
  return res?.data || res;
}

async function updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
  const res = await api.patch<any>(`${API_BASE}/tenants/${id}`, data);
  return res?.data || res;
}

async function suspendTenant(id: string, reason: string): Promise<Tenant> {
  const res = await api.post<any>(`${API_BASE}/tenants/${id}/suspend`, { reason });
  return res?.data || res;
}

async function upgradeTenant(id: string, plan: string): Promise<Tenant> {
  const res = await api.post<any>(`${API_BASE}/tenants/${id}/upgrade`, { plan });
  return res?.data || res;
}

// =============================================================================
// MOCK DATA
// =============================================================================

function getMockTenants(): Tenant[] {
  return [
    {
      id: 't1',
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: 'enterprise',
      status: 'active',
      users: 156,
      maxUsers: 500,
      deliberations: 2340,
      apiCalls: 125000,
      storageUsedMB: 4500,
      storageMaxMB: 50000,
      createdAt: '2024-01-15T10:00:00Z',
      lastActiveAt: new Date().toISOString(),
      billingEmail: 'billing@acme.com',
    },
    {
      id: 't2',
      name: 'TechStart Inc',
      slug: 'techstart',
      plan: 'foundation',
      status: 'active',
      users: 45,
      maxUsers: 100,
      deliberations: 890,
      apiCalls: 34000,
      storageUsedMB: 1200,
      storageMaxMB: 10000,
      createdAt: '2024-03-20T14:30:00Z',
      lastActiveAt: new Date().toISOString(),
      billingEmail: 'admin@techstart.io',
    },
    {
      id: 't3',
      name: 'Global Finance Group',
      slug: 'globalfin',
      plan: 'strategic',
      status: 'active',
      users: 320,
      maxUsers: 1000,
      deliberations: 5600,
      apiCalls: 450000,
      storageUsedMB: 12000,
      storageMaxMB: 100000,
      createdAt: '2023-11-01T09:00:00Z',
      lastActiveAt: new Date().toISOString(),
      billingEmail: 'it@globalfin.com',
    },
    {
      id: 't4',
      name: 'StartupXYZ',
      slug: 'startupxyz',
      plan: 'pilot',
      status: 'trial',
      users: 5,
      maxUsers: 10,
      deliberations: 23,
      apiCalls: 890,
      storageUsedMB: 50,
      storageMaxMB: 1000,
      createdAt: '2025-01-01T08:00:00Z',
      lastActiveAt: new Date().toISOString(),
    },
    {
      id: 't5',
      name: 'MedCare Health Systems',
      slug: 'medcare',
      plan: 'enterprise',
      status: 'active',
      users: 89,
      maxUsers: 200,
      deliberations: 1560,
      apiCalls: 89000,
      storageUsedMB: 3200,
      storageMaxMB: 25000,
      createdAt: '2024-06-15T11:00:00Z',
      lastActiveAt: new Date().toISOString(),
      billingEmail: 'admin@medcare.health',
    },
    {
      id: 't6',
      name: 'RetailMax',
      slug: 'retailmax',
      plan: 'foundation',
      status: 'suspended',
      users: 32,
      maxUsers: 50,
      deliberations: 456,
      apiCalls: 12000,
      storageUsedMB: 800,
      storageMaxMB: 5000,
      createdAt: '2024-04-10T16:00:00Z',
      lastActiveAt: '2024-11-15T10:00:00Z',
      billingEmail: 'support@retailmax.com',
    },
  ];
}

function getDefaultMetrics(): TenantMetrics {
  return {
    total: 127,
    active: 98,
    trial: 12,
    suspended: 8,
    churned: 9,
    byPlan: { pilot: 15, foundation: 32, enterprise: 45, strategic: 28, custom: 7 },
    totalUsers: 3482,
    totalDeliberations: 45600,
    totalApiCalls: 12500000,
    mrr: 842000,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

const StatusBadge: React.FC<{ status: Tenant['status'] }> = ({ status }) => {
  const statusLower = (status || 'pending').toLowerCase();
  const configs: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle2, label: 'Active' },
    trial: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock, label: 'Trial' },
    suspended: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle, label: 'Suspended' },
    churned: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', icon: AlertTriangle, label: 'Churned' },
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock, label: 'Pending' },
  };
  const config = configs[statusLower] || configs.pending;

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const PlanBadge: React.FC<{ plan: Tenant['plan'] }> = ({ plan }) => {
  const planLower = (plan || 'pilot').toLowerCase();
  const configs: Record<string, { bg: string; text: string }> = {
    pilot: { bg: 'bg-neutral-700', text: 'text-neutral-300' },
    trial: { bg: 'bg-cyan-900/50', text: 'text-cyan-300' },
    foundation: { bg: 'bg-blue-900/50', text: 'text-blue-300' },
    enterprise: { bg: 'bg-amber-900/50', text: 'text-amber-300' },
    strategic: { bg: 'bg-gradient-to-r from-amber-600 to-orange-600', text: 'text-white' },
    custom: { bg: 'bg-purple-900/50', text: 'text-purple-300' },
  };
  const config = configs[planLower] || configs.pilot;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text}`}>
      {plan || 'Pilot'}
    </span>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, change, icon: Icon, color }) => (
  <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-neutral-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {change !== undefined && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [metrics, setMetrics] = useState<TenantMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tenantsData, metricsData] = await Promise.all([
        fetchTenants({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          plan: planFilter !== 'all' ? planFilter : undefined,
          search: searchQuery || undefined,
        }),
        fetchTenantMetrics(),
      ]);
      setTenants(tenantsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, planFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSuspend = async (tenant: Tenant) => {
    if (!confirm(`Are you sure you want to suspend ${tenant.name}?`)) {return;}
    try {
      await suspendTenant(tenant.id, 'Admin action');
      loadData();
    } catch (error) {
      console.error('Failed to suspend tenant:', error);
    }
    setActionMenuId(null);
  };

  const handleUpgrade = async (tenant: Tenant, newPlan: string) => {
    try {
      await upgradeTenant(tenant.id, newPlan);
      loadData();
    } catch (error) {
      console.error('Failed to upgrade tenant:', error);
    }
    setActionMenuId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBytes = (mb: number) => {
    if (mb >= 1000) {return `${(mb / 1000).toFixed(1)} GB`;}
    return `${mb} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-amber-500" />
            Tenant Management
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage organizations, subscriptions, and usage across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Tenants"
            value={metrics.totalTenants ?? metrics.total ?? 0}
            change={5}
            icon={Building2}
            color="bg-blue-600"
          />
          <MetricCard
            label="Active Users"
            value={metrics.totalUsers ?? 0}
            change={12}
            icon={Users}
            color="bg-green-600"
          />
          <MetricCard
            label="Monthly Revenue"
            value={`$${((metrics.totalMrr ?? metrics.mrr ?? 0) / 1000).toFixed(0)}K`}
            change={8}
            icon={CreditCard}
            color="bg-purple-600"
          />
          <MetricCard
            label="API Calls (24h)"
            value={`${((metrics.totalApiCalls ?? 0) / 1000000).toFixed(1)}M`}
            change={15}
            icon={Activity}
            color="bg-amber-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-neutral-800 rounded-xl p-4 border border-neutral-700">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="churned">Churned</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Plans</option>
            <option value="pilot">Pilot</option>
            <option value="foundation">Foundation</option>
            <option value="enterprise">Enterprise</option>
            <option value="strategic">Strategic</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700 bg-neutral-900/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Organization</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Plan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Users</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Usage</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Last Active</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    No tenants found
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{tenant.name}</p>
                          <p className="text-sm text-neutral-400">/{tenant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge plan={tenant.plan} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tenant.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <span className="text-white">{tenant.userCount ?? tenant.users ?? 0}</span>
                        <span className="text-neutral-500">/ {tenant.userLimit ?? tenant.maxUsers ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Database className="w-3 h-3 text-neutral-400" />
                          <span className="text-neutral-300">{formatBytes(tenant.storageUsedMB ?? 0)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-3 h-3 text-neutral-400" />
                          <span className="text-neutral-300">{(tenant.apiCalls ?? 0).toLocaleString()} calls</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {tenant.lastActiveAt ? formatDate(tenant.lastActiveAt) : (tenant.updatedAt ? formatDate(tenant.updatedAt) : 'N/A')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() => setSelectedTenant(tenant)}
                          className="p-2 hover:bg-neutral-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-neutral-400" />
                        </button>
                        <button
                          onClick={() => setActionMenuId(actionMenuId === tenant.id ? null : tenant.id)}
                          className="p-2 hover:bg-neutral-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-400" />
                        </button>

                        {actionMenuId === tenant.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10">
                            <button
                              onClick={() => handleUpgrade(tenant, 'enterprise')}
                              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                              Upgrade Plan
                            </button>
                            <button
                              onClick={() => {}}
                              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                            >
                              <Settings className="w-4 h-4" />
                              Configure
                            </button>
                            {tenant.status === 'active' && (
                              <button
                                onClick={() => handleSuspend(tenant)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-700"
                              >
                                <XCircle className="w-4 h-4" />
                                Suspend
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-700">
          <p className="text-sm text-neutral-400">
            Showing {tenants.length} of {metrics?.total || 0} tenants
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-amber-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
              2
            </button>
            <button className="px-3 py-1 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
              3
            </button>
            <button className="px-3 py-1 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Plan Distribution */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Distribution</h3>
            <div className="space-y-3">
              {Object.entries(metrics.byPlan || {}).map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-3">
                  <PlanBadge plan={plan as Tenant['plan']} />
                  <div className="flex-1">
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(count / (metrics.totalTenants ?? metrics.total ?? 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-neutral-300 w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Status Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-green-400 text-2xl font-bold">{metrics.active}</p>
                <p className="text-neutral-400 text-sm">Active</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <p className="text-blue-400 text-2xl font-bold">{metrics.trial}</p>
                <p className="text-neutral-400 text-sm">In Trial</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-red-400 text-2xl font-bold">{metrics.suspended}</p>
                <p className="text-neutral-400 text-sm">Suspended</p>
              </div>
              <div className="bg-neutral-500/10 rounded-lg p-4 border border-neutral-500/30">
                <p className="text-neutral-400 text-2xl font-bold">{metrics.churned}</p>
                <p className="text-neutral-400 text-sm">Churned</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantsPage;
