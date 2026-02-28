// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA LICENSE MANAGEMENT - Enterprise Platinum Standard
// Software licensing, entitlements, and revenue tracking
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Key,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  ArrowUpRight,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Building2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface License {
  id: string;
  key: string;
  tenantId: string;
  tenantName?: string;
  type: string;
  status: string;
  seats?: number;
  seatsUsed?: number;
  features?: string[];
  createdAt: string;
  expiresAt?: string;
  lastValidatedAt?: string;
  revenue?: number;
  billingCycle?: string;
}

interface LicenseMetrics {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  byType: Record<string, number>;
  totalRevenue: number;
  mrr: number;
  arr: number;
  revenueAtRisk: number;
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin';

async function fetchLicenses(filters?: { status?: string; type?: string }): Promise<License[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) {params.set('status', filters.status);}
    if (filters?.type) {params.set('type', filters.type);}
    
    const res = await api.get<any>(`${API_BASE}/licenses?${params.toString()}`);
    return (res as any)?.licenses || (res as any)?.data?.licenses || getMockLicenses();
  } catch (error) {
    console.error('Failed to fetch licenses:', error);
    return getMockLicenses();
  }
}

async function fetchLicenseMetrics(): Promise<LicenseMetrics> {
  try {
    const res = await api.get<any>(`${API_BASE}/licenses/metrics`);
    return (res as any)?.data || (res as any) || getDefaultMetrics();
  } catch (error) {
    console.error('Failed to fetch license metrics:', error);
    return getDefaultMetrics();
  }
}

async function extendLicense(id: string, months: number): Promise<License> {
  const res = await api.post<any>(`${API_BASE}/licenses/${id}/extend`, { months });
  return (res as any)?.data || res;
}

async function upgradeLicense(id: string, type: string): Promise<License> {
  const res = await api.post<any>(`${API_BASE}/licenses/${id}/upgrade`, { type });
  return (res as any)?.data || res;
}

// =============================================================================
// MOCK DATA
// =============================================================================

function getMockLicenses(): License[] {
  return [
    {
      id: 'lic-001',
      key: 'DC-ENT-ACME-2024-XXXX',
      tenantId: 't1',
      tenantName: 'Acme Corporation',
      type: 'enterprise',
      status: 'active',
      seats: 500,
      seatsUsed: 156,
      features: ['council', 'chronos', 'sovereign', 'api_unlimited', 'sso', 'custom_agents'],
      createdAt: '2024-01-15T10:00:00Z',
      expiresAt: '2025-01-15T10:00:00Z',
      lastValidatedAt: new Date().toISOString(),
      revenue: 125000,
      billingCycle: 'annual',
    },
    {
      id: 'lic-002',
      key: 'DC-PRO-TECH-2024-YYYY',
      tenantId: 't2',
      tenantName: 'TechStart Inc',
      type: 'foundation',
      status: 'active',
      seats: 100,
      seatsUsed: 45,
      features: ['council', 'chronos', 'api_standard'],
      createdAt: '2024-03-20T14:30:00Z',
      expiresAt: '2025-03-20T14:30:00Z',
      lastValidatedAt: new Date().toISOString(),
      revenue: 24000,
      billingCycle: 'annual',
    },
    {
      id: 'lic-003',
      key: 'DC-SOV-GFIN-2023-ZZZZ',
      tenantId: 't3',
      tenantName: 'Global Finance Group',
      type: 'strategic',
      status: 'active',
      seats: 1000,
      seatsUsed: 320,
      features: ['council', 'chronos', 'sovereign', 'api_unlimited', 'sso', 'custom_agents', 'air_gap', 'dedicated_support'],
      createdAt: '2023-11-01T09:00:00Z',
      expiresAt: '2024-11-01T09:00:00Z',
      lastValidatedAt: new Date().toISOString(),
      revenue: 450000,
      billingCycle: 'annual',
    },
    {
      id: 'lic-004',
      key: 'DC-TRI-SXYZ-2025-AAAA',
      tenantId: 't4',
      tenantName: 'StartupXYZ',
      type: 'trial',
      status: 'active',
      seats: 10,
      seatsUsed: 5,
      features: ['council_basic', 'api_limited'],
      createdAt: '2025-01-01T08:00:00Z',
      expiresAt: '2025-01-31T08:00:00Z',
      lastValidatedAt: new Date().toISOString(),
      revenue: 0,
      billingCycle: 'annual',
    },
    {
      id: 'lic-005',
      key: 'DC-ENT-MEDC-2024-BBBB',
      tenantId: 't5',
      tenantName: 'MedCare Health Systems',
      type: 'enterprise',
      status: 'active',
      seats: 200,
      seatsUsed: 89,
      features: ['council', 'chronos', 'sovereign', 'api_unlimited', 'sso', 'hipaa_compliance'],
      createdAt: '2024-06-15T11:00:00Z',
      expiresAt: '2025-02-15T11:00:00Z',
      lastValidatedAt: new Date().toISOString(),
      revenue: 85000,
      billingCycle: 'annual',
    },
    {
      id: 'lic-006',
      key: 'DC-PRO-RETL-2024-CCCC',
      tenantId: 't6',
      tenantName: 'RetailMax',
      type: 'foundation',
      status: 'expired',
      seats: 50,
      seatsUsed: 32,
      features: ['council', 'api_standard'],
      createdAt: '2024-04-10T16:00:00Z',
      expiresAt: '2024-10-10T16:00:00Z',
      lastValidatedAt: '2024-10-10T16:00:00Z',
      revenue: 12000,
      billingCycle: 'annual',
    },
  ];
}

function getDefaultMetrics(): LicenseMetrics {
  return {
    total: 127,
    active: 110,
    expiring: 8,
    expired: 9,
    byType: { pilot: 15, foundation: 32, enterprise: 45, strategic: 28, custom: 7 },
    totalRevenue: 8420000,
    mrr: 702000,
    arr: 8424000,
    revenueAtRisk: 185000,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

const StatusBadge: React.FC<{ status: License['status'] }> = ({ status }) => {
  const statusLower = (status || 'pending').toLowerCase();
  const configs: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle2, label: 'Active' },
    expired: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle, label: 'Expired' },
    expiring: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: AlertTriangle, label: 'Expiring' },
    suspended: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle, label: 'Suspended' },
    pending: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock, label: 'Pending' },
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

const TypeBadge: React.FC<{ type: License['type'] }> = ({ type }) => {
  const typeLower = (type || 'trial').toLowerCase();
  const configs: Record<string, { bg: string; text: string }> = {
    pilot: { bg: 'bg-neutral-700', text: 'text-neutral-300' },
    trial: { bg: 'bg-cyan-900/50', text: 'text-cyan-300' },
    foundation: { bg: 'bg-blue-900/50', text: 'text-blue-300' },
    enterprise: { bg: 'bg-amber-900/50', text: 'text-amber-300' },
    strategic: { bg: 'bg-gradient-to-r from-amber-600 to-orange-600', text: 'text-white' },
    custom: { bg: 'bg-purple-900/50', text: 'text-purple-300' },
  };
  const config = configs[typeLower] || configs.trial;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text}`}>
      {type || 'Trial'}
    </span>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color: string;
  alert?: boolean;
}> = ({ label, value, subValue, icon: Icon, color, alert }) => (
  <div className={`bg-neutral-800 rounded-xl p-5 border ${alert ? 'border-red-500/50' : 'border-neutral-700'}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-neutral-400 text-sm">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${alert ? 'text-red-400' : 'text-white'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subValue && <p className="text-sm text-neutral-500 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const LicenseKeyDisplay: React.FC<{ licenseKey: string }> = ({ licenseKey }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className="text-neutral-400">
        {visible ? licenseKey : licenseKey.replace(/[A-Z0-9]/g, '•').slice(0, 20)}
      </span>
      <button
        onClick={() => setVisible(!visible)}
        className="p-1 hover:bg-neutral-700 rounded transition-colors"
      >
        {visible ? <EyeOff className="w-3 h-3 text-neutral-400" /> : <Eye className="w-3 h-3 text-neutral-400" />}
      </button>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-neutral-700 rounded transition-colors"
      >
        {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
      </button>
    </div>
  );
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [metrics, setMetrics] = useState<LicenseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [licensesData, metricsData] = await Promise.all([
        fetchLicenses({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
        }),
        fetchLicenseMetrics(),
      ]);
      setLicenses(licensesData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExtend = async (license: License, months: number) => {
    try {
      await extendLicense(license.id, months);
      loadData();
    } catch (error) {
      console.error('Failed to extend license:', error);
    }
    setActionMenuId(null);
  };

  const handleUpgrade = async (license: License, newType: string) => {
    try {
      await upgradeLicense(license.id, newType);
      loadData();
    } catch (error) {
      console.error('Failed to upgrade license:', error);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const isExpiringSoon = (license: License) => {
    const expiresAt = license.expiresAt;
    if (!expiresAt) {return false;}
    const days = getDaysUntilExpiry(expiresAt);
    return days > 0 && days <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Key className="w-7 h-7 text-amber-500" />
            License Management
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage software licenses, entitlements, and revenue tracking
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
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Generate License
          </button>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Active Licenses"
            value={metrics.active}
            subValue={`of ${metrics.total} total`}
            icon={Key}
            color="bg-green-600"
          />
          <MetricCard
            label="Monthly Revenue"
            value={formatCurrency(metrics.mrr)}
            subValue={`ARR: ${formatCurrency(metrics.arr)}`}
            icon={DollarSign}
            color="bg-purple-600"
          />
          <MetricCard
            label="Expiring Soon"
            value={metrics.expiring}
            subValue="Next 30 days"
            icon={Calendar}
            color="bg-yellow-600"
            alert={metrics.expiring > 0}
          />
          <MetricCard
            label="Revenue at Risk"
            value={formatCurrency(metrics.revenueAtRisk)}
            subValue="From expiring licenses"
            icon={AlertTriangle}
            color="bg-red-600"
            alert={metrics.revenueAtRisk > 0}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-neutral-800 rounded-xl p-4 border border-neutral-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Types</option>
            <option value="pilot">Pilot</option>
            <option value="trial">Trial</option>
            <option value="foundation">Foundation</option>
            <option value="enterprise">Enterprise</option>
            <option value="strategic">Strategic</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2 text-sm text-neutral-400">
          <span>Showing {licenses.length} licenses</span>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700 bg-neutral-900/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">License</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Tenant</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Seats</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Expires</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-300">Revenue</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                    No licenses found
                  </td>
                </tr>
              ) : (
                licenses.map((license) => (
                  <tr
                    key={license.id}
                    className={`border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors ${
                      isExpiringSoon(license) ? 'bg-yellow-500/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <LicenseKeyDisplay licenseKey={license.key} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span className="text-white">{license.tenantName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={license.type} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={license.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <span className="text-white">{license.seatsUsed}</span>
                        <span className="text-neutral-500">/ {license.seats}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`${isExpiringSoon(license) ? 'text-yellow-400' : 'text-neutral-300'}`}>
                          {license.expiresAt ? formatDate(license.expiresAt) : 'N/A'}
                        </span>
                        {license.expiresAt && isExpiringSoon(license) && (
                          <p className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            {getDaysUntilExpiry(license.expiresAt!)} days left
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-white font-medium">{formatCurrency(license.revenue ?? 0)}</span>
                        <p className="text-xs text-neutral-400 capitalize">{license.billingCycle || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === license.id ? null : license.id)}
                          className="p-2 hover:bg-neutral-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-400" />
                        </button>

                        {actionMenuId === license.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10">
                            <button
                              onClick={() => handleExtend(license, 12)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                            >
                              <Calendar className="w-4 h-4" />
                              Extend 12 Months
                            </button>
                            <button
                              onClick={() => handleUpgrade(license, 'enterprise')}
                              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                              Upgrade Plan
                            </button>
                            <button
                              onClick={() => {}}
                              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                            >
                              <Shield className="w-4 h-4" />
                              View Features
                            </button>
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
      </div>

      {/* Revenue by License Type */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">License Distribution</h3>
            <div className="space-y-3">
              {Object.entries(metrics.byType).map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <TypeBadge type={type as License['type']} />
                  <div className="flex-1">
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(count / metrics.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-neutral-300 w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">Annual Revenue</span>
                </div>
                <span className="text-xl font-bold text-green-400">{formatCurrency(metrics.arr)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-neutral-300">Monthly Revenue</span>
                </div>
                <span className="text-xl font-bold text-purple-400">{formatCurrency(metrics.mrr)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-neutral-300">At Risk (Expiring)</span>
                </div>
                <span className="text-xl font-bold text-red-400">{formatCurrency(metrics.revenueAtRisk)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensesPage;
