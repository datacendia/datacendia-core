// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA FEATURE FLAGS - Enterprise Platinum Standard
// Feature toggles, A/B testing, and progressive rollout management
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Flag,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Users,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Trash2,
  Edit,
  Copy,
  Eye,
  Zap,
  Shield,
  Building2,
  Code,
  Layers,
} from 'lucide-react';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'percentage' | 'user_list' | 'tenant_list';
  enabled: boolean;
  value: any;
  rolloutPercentage?: number;
  targetTenants?: string[];
  targetUsers?: string[];
  category: 'core' | 'ai' | 'ui' | 'experimental' | 'deprecated';
  environment: 'all' | 'production' | 'staging' | 'development';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastToggledAt?: string;
  lastToggledBy?: string;
}

interface FlagMetrics {
  total: number;
  enabled: number;
  disabled: number;
  byCategory: Record<string, number>;
  byEnvironment: Record<string, number>;
  recentChanges: number;
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin';

async function fetchFeatureFlags(filters?: { category?: string; enabled?: boolean }): Promise<FeatureFlag[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) {params.set('category', filters.category);}
    if (filters?.enabled !== undefined) {params.set('enabled', String(filters.enabled));}
    
    const res = await api.get<any>(`${API_BASE}/features?${params.toString()}`);
    return (res as any)?.features || (res as any)?.data?.features || getMockFlags();
  } catch (error) {
    console.error('Failed to fetch feature flags:', error);
    return getMockFlags();
  }
}

async function fetchFlagMetrics(): Promise<FlagMetrics> {
  try {
    const res = await api.get<any>(`${API_BASE}/features/metrics`);
    return (res as any)?.data || (res as any) || getDefaultMetrics();
  } catch (error) {
    console.error('Failed to fetch flag metrics:', error);
    return getDefaultMetrics();
  }
}

async function toggleFlag(id: string, enabled: boolean): Promise<FeatureFlag> {
  const res = await api.post<any>(`${API_BASE}/features/${id}/toggle`, { enabled });
  return (res as any)?.data || res;
}

async function updateFlag(id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
  const res = await api.patch<any>(`${API_BASE}/features/${id}`, data);
  return (res as any)?.data || res;
}

// =============================================================================
// MOCK DATA
// =============================================================================

function getMockFlags(): FeatureFlag[] {
  return [
    {
      id: 'ff-1',
      key: 'council_cross_examination',
      name: 'AI Cross-Examination',
      description: 'Enable AI agents to challenge and cross-examine each other during deliberations',
      type: 'boolean',
      enabled: true,
      value: true,
      category: 'ai',
      environment: 'all',
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2024-12-15T14:30:00Z',
      createdBy: 'stuart@datacendia.com',
      lastToggledAt: '2024-12-15T14:30:00Z',
      lastToggledBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-2',
      key: 'chronos_monte_carlo',
      name: 'Monte Carlo Simulations',
      description: 'Future prediction with uncertainty cones and probability distributions',
      type: 'percentage',
      enabled: true,
      value: 75,
      rolloutPercentage: 75,
      category: 'ai',
      environment: 'production',
      createdAt: '2024-09-15T08:00:00Z',
      updatedAt: '2024-12-20T10:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-3',
      key: 'sovereign_air_gap',
      name: 'Air-Gap Mode',
      description: 'Complete network isolation for sovereign deployments',
      type: 'tenant_list',
      enabled: true,
      value: ['globalfin', 'defensetech'],
      targetTenants: ['globalfin', 'defensetech'],
      category: 'core',
      environment: 'production',
      createdAt: '2024-04-01T12:00:00Z',
      updatedAt: '2024-11-30T16:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-4',
      key: 'persona_forge_beta',
      name: 'PersonaForge™ Digital Twins',
      description: 'Create and interact with AI digital twins of organizational roles',
      type: 'boolean',
      enabled: true,
      value: true,
      category: 'ai',
      environment: 'all',
      createdAt: '2024-10-01T09:00:00Z',
      updatedAt: '2024-12-18T11:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-5',
      key: 'new_dashboard_layout',
      name: 'New Dashboard Layout',
      description: 'Experimental new dashboard with improved data visualization',
      type: 'percentage',
      enabled: true,
      value: 25,
      rolloutPercentage: 25,
      category: 'ui',
      environment: 'staging',
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-19T09:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-6',
      key: 'legacy_export_format',
      name: 'Legacy Export Format',
      description: 'Support for deprecated CSV export format (to be removed Q1 2025)',
      type: 'boolean',
      enabled: false,
      value: false,
      category: 'deprecated',
      environment: 'all',
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-10-01T10:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-7',
      key: 'quantum_ready_encryption',
      name: 'Quantum-Ready Encryption',
      description: 'Post-quantum cryptographic algorithms for future-proof security',
      type: 'boolean',
      enabled: false,
      value: false,
      category: 'experimental',
      environment: 'development',
      createdAt: '2024-11-15T10:00:00Z',
      updatedAt: '2024-11-15T10:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
    {
      id: 'ff-8',
      key: 'cascade_butterfly_effect',
      name: 'CendiaCascade™ Engine',
      description: 'Second/third-order consequence prediction for organizational changes',
      type: 'boolean',
      enabled: true,
      value: true,
      category: 'ai',
      environment: 'production',
      createdAt: '2024-08-20T10:00:00Z',
      updatedAt: '2024-12-10T15:00:00Z',
      createdBy: 'stuart@datacendia.com',
    },
  ];
}

function getDefaultMetrics(): FlagMetrics {
  return {
    total: 42,
    enabled: 28,
    disabled: 14,
    byCategory: { core: 12, ai: 15, ui: 8, experimental: 5, deprecated: 2 },
    byEnvironment: { all: 18, production: 15, staging: 6, development: 3 },
    recentChanges: 7,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

const CategoryBadge: React.FC<{ category: FeatureFlag['category'] }> = ({ category }) => {
  const categoryLower = (category || 'core').toLowerCase();
  const configs: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    core: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Shield },
    ai: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Zap },
    ui: { bg: 'bg-green-500/20', text: 'text-green-400', icon: Layers },
    experimental: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: AlertTriangle },
    deprecated: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
    enterprise: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Shield },
    sovereign: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: Shield },
    analytics: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: Zap },
    integration: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', icon: Layers },
    security: { bg: 'bg-red-500/20', text: 'text-red-400', icon: Shield },
    compliance: { bg: 'bg-green-500/20', text: 'text-green-400', icon: Shield },
    beta: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: AlertTriangle },
  };
  const config = configs[categoryLower] || configs.core;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
};

const EnvironmentBadge: React.FC<{ environment: FeatureFlag['environment'] }> = ({ environment }) => {
  const config = {
    all: { bg: 'bg-neutral-600', text: 'text-neutral-200' },
    production: { bg: 'bg-green-700', text: 'text-green-200' },
    staging: { bg: 'bg-yellow-700', text: 'text-yellow-200' },
    development: { bg: 'bg-blue-700', text: 'text-blue-200' },
  }[environment];

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {environment}
    </span>
  );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; disabled?: boolean }> = ({ 
  enabled, onChange, disabled 
}) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      enabled ? 'bg-green-600' : 'bg-neutral-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`}
    />
  </button>
);

const MetricCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-neutral-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
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

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [metrics, setMetrics] = useState<FlagMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [enabledFilter, setEnabledFilter] = useState<string>('all');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [flagsData, metricsData] = await Promise.all([
        fetchFeatureFlags({
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          enabled: enabledFilter === 'enabled' ? true : enabledFilter === 'disabled' ? false : undefined,
        }),
        fetchFlagMetrics(),
      ]);
      setFlags(flagsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, enabledFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (flag: FeatureFlag) => {
    setTogglingId(flag.id);
    try {
      await toggleFlag(flag.id, !flag.enabled);
      setFlags(prev => prev.map(f => 
        f.id === flag.id ? { ...f, enabled: !f.enabled, lastToggledAt: new Date().toISOString() } : f
      ));
    } catch (error) {
      console.error('Failed to toggle flag:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const filteredFlags = flags.filter(flag => 
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Flag className="w-7 h-7 text-amber-500" />
            Feature Flags
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage feature toggles, A/B testing, and progressive rollouts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            New Flag
          </button>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Flags"
            value={metrics.total}
            icon={Flag}
            color="bg-blue-600"
          />
          <MetricCard
            label="Enabled"
            value={metrics.enabled}
            icon={ToggleRight}
            color="bg-green-600"
          />
          <MetricCard
            label="Disabled"
            value={metrics.disabled}
            icon={ToggleLeft}
            color="bg-neutral-600"
          />
          <MetricCard
            label="Changed This Week"
            value={metrics.recentChanges}
            icon={Clock}
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
              placeholder="Search flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="core">Core</option>
            <option value="ai">AI</option>
            <option value="ui">UI</option>
            <option value="experimental">Experimental</option>
            <option value="deprecated">Deprecated</option>
          </select>

          <select
            value={enabledFilter}
            onChange={(e) => setEnabledFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-neutral-500 animate-spin" />
          </div>
        ) : filteredFlags.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No feature flags found
          </div>
        ) : (
          filteredFlags.map(flag => (
            <div
              key={flag.id}
              className={`bg-neutral-800 rounded-xl p-5 border transition-colors ${
                flag.enabled ? 'border-neutral-700' : 'border-neutral-700/50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{flag.name}</h3>
                    <CategoryBadge category={flag.category} />
                    <EnvironmentBadge environment={flag.environment} />
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-3">{flag.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-neutral-500" />
                      <code className="bg-neutral-900 px-2 py-0.5 rounded text-neutral-300">{flag.key}</code>
                      <button
                        onClick={() => handleCopyKey(flag.key)}
                        className="p-1 hover:bg-neutral-700 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-neutral-400" />
                      </button>
                    </div>
                    
                    {flag.rolloutPercentage !== undefined && (
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-neutral-500" />
                        <span className="text-neutral-300">{flag.rolloutPercentage}% rollout</span>
                      </div>
                    )}
                    
                    {flag.targetTenants && flag.targetTenants.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-neutral-500" />
                        <span className="text-neutral-300">{flag.targetTenants.length} tenants</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-neutral-500">
                    <p>Updated {formatDate(flag.updatedAt)}</p>
                    {flag.lastToggledBy && (
                      <p>by {flag.lastToggledBy.split('@')[0]}</p>
                    )}
                  </div>
                  
                  <ToggleSwitch
                    enabled={flag.enabled}
                    onChange={() => handleToggle(flag)}
                    disabled={togglingId === flag.id}
                  />
                  
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === flag.id ? null : flag.id)}
                      className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>

                    {actionMenuId === flag.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10">
                        <button
                          onClick={() => { setActionMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => { setActionMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700"
                        >
                          <Eye className="w-4 h-4" />
                          View History
                        </button>
                        <button
                          onClick={() => { setActionMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rollout Progress */}
              {flag.type === 'percentage' && flag.rolloutPercentage !== undefined && (
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">Rollout Progress</span>
                    <span className="text-sm text-white font-medium">{flag.rolloutPercentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${flag.rolloutPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Category Distribution */}
      {metrics && (
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(metrics.byCategory).map(([category, count]) => (
              <div key={category} className="text-center">
                <CategoryBadge category={category as FeatureFlag['category']} />
                <p className="text-2xl font-bold text-white mt-2">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureFlagsPage;
