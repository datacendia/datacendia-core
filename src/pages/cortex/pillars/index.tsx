// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PILLARS PAGES (The 8 Foundational Data Layers)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { useUser } from '../../../contexts/AuthContext';
import {
  X,
  ExternalLink,
  Play,
  AlertTriangle,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

const PillarHeader: React.FC<{
  icon: string;
  name: string;
  tagline: string;
  color: string;
}> = ({ icon, name, tagline, color }) => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
        <p className="text-neutral-500">{tagline}</p>
      </div>
    </div>
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}> = ({ label, value, change, trend, unit }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-4">
    <p className="text-sm text-neutral-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-neutral-900">
        {value}
        {unit && <span className="text-base font-normal text-neutral-500">{unit}</span>}
      </span>
      {change !== undefined && (
        <span
          className={cn(
            'text-sm font-medium',
            trend === 'up' && 'text-success-main',
            trend === 'down' && 'text-error-main',
            trend === 'stable' && 'text-neutral-500'
          )}
        >
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

// =============================================================================
// THE HELM - Metrics & KPIs (Enhanced)
// =============================================================================

interface HelmMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'critical' | 'stable';
  trend: number;
  owner?: string;
  ownerRole?: string;
  threshold?: number;
  target?: number;
  lastUpdated?: string;
  type?: 'leading' | 'lagging';
  linkedDecisionId?: string;
  linkedCrucibleId?: string;
}

interface HelmCategory {
  id: string;
  name: string;
  icon: string;
  color?: string;
  metrics: HelmMetric[];
}

interface HelmDashboard {
  totalMetrics: number;
  onTarget: number;
  atRisk: number;
  critical: number;
  healthScore?: number;
  healthTrend?: number;
  lastUpdated?: string;
  escalatedToCouncil?: number;
  categories: HelmCategory[];
}

// Category icons and colors
type CategoryConfig = { icon: string; color: string; bg: string };
const DEFAULT_CATEGORY_CONFIG: CategoryConfig = { icon: '📊', color: '#64748B', bg: 'bg-slate-50' };
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  financial: { icon: '💰', color: '#10B981', bg: 'bg-emerald-50' },
  operational: { icon: '⚙️', color: '#6366F1', bg: 'bg-indigo-50' },
  customer: { icon: '❤️', color: '#EC4899', bg: 'bg-pink-50' },
  people: { icon: '👥', color: '#F59E0B', bg: 'bg-amber-50' },
  strategic: { icon: '🎯', color: '#8B5CF6', bg: 'bg-purple-50' },
  compliance: { icon: '⚖️', color: '#06B6D4', bg: 'bg-cyan-50' },
  default: DEFAULT_CATEGORY_CONFIG,
};

// Pre-built metric packs
const METRIC_PACKS = [
  {
    id: 'cfo',
    name: 'CFO Pack',
    icon: '💰',
    metrics: ['Revenue', 'Gross Margin', 'Cash Flow', 'Runway'],
  },
  {
    id: 'coo',
    name: 'COO Pack',
    icon: '⚙️',
    metrics: ['Throughput', 'Defect Rate', 'Cycle Time', 'Utilization'],
  },
  {
    id: 'chro',
    name: 'CHRO Pack',
    icon: '👥',
    metrics: ['Engagement Score', 'Time-to-Hire', 'Attrition Rate', 'eNPS'],
  },
  { id: 'cmo', name: 'CMO Pack', icon: '📢', metrics: ['CAC', 'LTV', 'NPS', 'Brand Awareness'] },
];

// Owner avatars
const OWNER_AVATARS: Record<string, string> = {
  CFO: '💰',
  COO: '⚙️',
  CMO: '📢',
  CHRO: '👥',
  CTO: '💻',
  CEO: '👔',
};

export const HelmPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [dashboard, setDashboard] = useState<HelmDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarter'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<HelmCategory | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<HelmMetric | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'at_risk' | 'critical'>('all');

  useEffect(() => {
    const loadHelmData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<HelmDashboard>(
          '/pillars/helm/dashboard',
          organizationId ? { organizationId } : undefined
        );
        if (res.success && res.data) {
          setDashboard(res.data);
          return;
        }
        setDashboard(null);
        setError(res.error?.message || 'Failed to load helm data');
      } catch (err) {
        console.error('Failed to load helm data:', err);
        setDashboard(null);
        setError(err instanceof Error ? err.message : 'Failed to load helm data');
      } finally {
        setIsLoading(false);
      }
    };
    loadHelmData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-success-light text-success-dark';
      case 'at_risk':
        return 'bg-warning-light text-warning-dark';
      case 'critical':
        return 'bg-error-light text-error-dark';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'critical':
        return 'Critical';
      default:
        return 'Stable';
    }
  };

  const getCategoryConfig = (name: string | undefined): CategoryConfig => {
    if (!name) {return DEFAULT_CATEGORY_CONFIG;}
    const key = name.toLowerCase();
    return CATEGORY_CONFIG[key] ?? DEFAULT_CATEGORY_CONFIG;
  };

  const getCategoryStats = (cat: HelmCategory | null | undefined) => {
    if (!cat) {return { total: 0, onTrack: 0, atRisk: 0, critical: 0, owners: [] };}
    const metrics = cat.metrics || [];
    return {
      total: metrics.length,
      onTrack: metrics.filter((m) => m.status === 'on_track' || m.status === 'stable').length,
      atRisk: metrics.filter((m) => m.status === 'at_risk').length,
      critical: metrics.filter((m) => m.status === 'critical').length,
      owners: [...new Set(metrics.map((m) => m.ownerRole).filter(Boolean))],
    };
  };

  const healthScore =
    dashboard?.healthScore ??
    Math.round(((dashboard?.onTarget ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1)) * 100);
  const healthTrend = dashboard?.healthTrend ?? 3;

  const onTargetPct = Math.round(
    ((dashboard?.onTarget ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1)) * 100
  );
  const atRiskPct = Math.round(
    ((dashboard?.atRisk ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1)) * 100
  );
  const criticalPct = 100 - onTargetPct - atRiskPct;

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🎯"
          name="The Helm"
          tagline="Single source of truth for organizational metrics"
          color="#6366F1"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading metrics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}
      {/* Header with last updated */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-indigo-100">
              🎯
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">The Helm</h1>
              <p className="text-neutral-500">Single source of truth for organizational metrics</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <p className="text-xs text-neutral-400">
            <Clock className="w-3 h-3 inline mr-1" />
            Last updated:{' '}
            {dashboard?.lastUpdated ? new Date(dashboard.lastUpdated).toLocaleString() : 'Just now'}
          </p>
        </div>
      </div>

      {/* Health Summary Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Organizational Health</h3>
          {(dashboard?.escalatedToCouncil ?? 0) > 0 && (
            <button
              onClick={() => navigate('/cortex/intelligence/decision-dna?filter=escalated')}
              className="text-xs text-warning-dark bg-warning-light px-3 py-1 rounded-full hover:bg-warning-main hover:text-white transition-colors"
            >
              {dashboard?.escalatedToCouncil} metrics escalated to Council →
            </button>
          )}
        </div>
        <div className="flex items-center gap-8">
          {/* Health Score Circle */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#E5E7EB" strokeWidth="10" />
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke={healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#EF4444'}
                strokeWidth="10"
                strokeDasharray={`${healthScore * 3.02} 302`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-neutral-900">{healthScore}</span>
              <span className="text-xs text-neutral-500">Score</span>
            </div>
          </div>

          {/* Trend */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              {healthTrend >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success-main" />
              ) : (
                <TrendingDown className="w-5 h-5 text-error-main" />
              )}
              <span
                className={cn(
                  'text-lg font-semibold',
                  healthTrend >= 0 ? 'text-success-dark' : 'text-error-dark'
                )}
              >
                {healthTrend >= 0 ? '+' : ''}
                {healthTrend}%
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              vs last {timeframe === '7d' ? 'week' : timeframe === '30d' ? 'month' : 'quarter'}
            </p>
          </div>

          {/* Stacked Bar */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-success-main"></span> On Target {onTargetPct}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-warning-main"></span> At Risk {atRiskPct}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-error-main"></span> Critical {criticalPct}%
              </span>
            </div>
            <div className="h-4 bg-neutral-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-success-main" style={{ width: `${onTargetPct}%` }} />
              <div className="h-full bg-warning-main" style={{ width: `${atRiskPct}%` }} />
              <div className="h-full bg-error-main" style={{ width: `${criticalPct}%` }} />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setStatusFilter(statusFilter === 'at_risk' ? 'all' : 'at_risk')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                statusFilter === 'at_risk'
                  ? 'bg-warning-main text-white'
                  : 'bg-warning-light text-warning-dark hover:bg-warning-main hover:text-white'
              )}
            >
              {dashboard?.atRisk ?? 0} At Risk
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                statusFilter === 'critical'
                  ? 'bg-error-main text-white'
                  : 'bg-error-light text-error-dark hover:bg-error-main hover:text-white'
              )}
            >
              {dashboard?.critical ?? 0} Critical
            </button>
          </div>
        </div>
      </div>

      {/* Metric Categories */}
      {(dashboard?.categories?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(dashboard?.categories || [])
            .filter((cat) => cat && typeof cat === 'object')
            .map((cat, idx) => {
              const config = getCategoryConfig(cat?.name);
              const stats = getCategoryStats(cat);
              const metrics = cat?.metrics || [];
              const filteredMetrics =
                statusFilter === 'all' ? metrics : metrics.filter((m) => m.status === statusFilter);

              if (statusFilter !== 'all' && filteredMetrics.length === 0) {return null;}

              return (
                <button
                  key={cat?.id || idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'p-5 rounded-xl border border-neutral-200 text-left hover:border-primary-500 hover:shadow-md transition-all',
                    config.bg
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat?.icon || config.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {cat?.name || 'Category'}
                        </h3>
                        <p className="text-sm text-neutral-500">{stats.total} metrics</p>
                      </div>
                    </div>
                    {/* Owner avatars */}
                    {stats.owners.length > 0 && (
                      <div className="flex -space-x-2">
                        {stats.owners.slice(0, 3).map((owner, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-sm"
                            title={owner}
                          >
                            {OWNER_AVATARS[owner as string] || '👤'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mini status bar */}
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex mb-3">
                    {stats.onTrack > 0 && (
                      <div
                        className="h-full bg-success-main"
                        style={{ width: `${(stats.onTrack / stats.total) * 100}%` }}
                      />
                    )}
                    {stats.atRisk > 0 && (
                      <div
                        className="h-full bg-warning-main"
                        style={{ width: `${(stats.atRisk / stats.total) * 100}%` }}
                      />
                    )}
                    {stats.critical > 0 && (
                      <div
                        className="h-full bg-error-main"
                        style={{ width: `${(stats.critical / stats.total) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Status pills */}
                  <div className="flex items-center gap-2 text-xs">
                    {stats.onTrack > 0 && (
                      <span className="px-2 py-0.5 bg-success-light text-success-dark rounded-full">
                        On target {stats.onTrack}
                      </span>
                    )}
                    {stats.atRisk > 0 && (
                      <span className="px-2 py-0.5 bg-warning-light text-warning-dark rounded-full">
                        At risk {stats.atRisk}
                      </span>
                    )}
                    {stats.critical > 0 && (
                      <span className="px-2 py-0.5 bg-error-light text-error-dark rounded-full">
                        Critical {stats.critical}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      ) : (
        /* Empty state with metric packs */
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No metrics configured yet</h3>
          <p className="text-neutral-500 mb-6">
            Get started with one of our pre-built metric packs:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRIC_PACKS.map((pack) => (
              <button
                key={pack.id}
                className="p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
              >
                <span className="text-2xl mb-2 block">{pack.icon}</span>
                <h4 className="font-semibold text-neutral-900">{pack.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">{pack.metrics.join(', ')}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Detail Drawer */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-end z-50"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="w-[700px] h-full bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {selectedCategory?.icon || getCategoryConfig(selectedCategory?.name).icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {selectedCategory?.name || 'Category'}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {(selectedCategory?.metrics || []).length} metrics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50">
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Types</option>
                <option>Leading</option>
                <option>Lagging</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Owners</option>
                <option>CFO</option>
                <option>COO</option>
                <option>CMO</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Status</option>
                <option>On Track</option>
                <option>At Risk</option>
                <option>Critical</option>
              </select>
            </div>

            {/* Metrics Table */}
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-200">
                    <th className="pb-3 font-medium">Metric</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Owner</th>
                    <th className="pb-3 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCategory?.metrics || []).map((metric) => (
                    <tr
                      key={metric.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <td className="py-3">
                        <div className="font-medium text-neutral-900">{metric.name}</div>
                        {metric.type && (
                          <span className="text-xs text-neutral-400">{metric.type}</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="font-medium">
                          {typeof metric.value === 'number'
                            ? metric.value.toFixed(1)
                            : metric.value}
                        </span>
                        <span className="text-neutral-500">{metric.unit}</span>
                        {metric.target && (
                          <span className="text-xs text-neutral-400 ml-1">
                            / {metric.target}
                            {metric.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            getStatusStyle(metric.status)
                          )}
                        >
                          {getStatusLabel(metric.status)}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-600">{metric.owner || '—'}</td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'flex items-center gap-1',
                            metric.trend >= 0 ? 'text-success-dark' : 'text-error-dark'
                          )}
                        >
                          {metric.trend >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(metric.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Metric Detail Modal */}
      {selectedMetric && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedMetric(null)}
        >
          <div
            className="bg-white rounded-xl border border-neutral-200 w-[550px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{selectedMetric.name}</h2>
                <p className="text-sm text-neutral-500">
                  {selectedMetric.type || 'Metric'} • {selectedMetric.owner || 'Unassigned'}
                </p>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Value & Status */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">
                    {typeof selectedMetric.value === 'number'
                      ? selectedMetric.value.toFixed(1)
                      : selectedMetric.value}
                    <span className="text-lg font-normal text-neutral-500">
                      {selectedMetric.unit}
                    </span>
                  </p>
                  {selectedMetric.target && (
                    <p className="text-sm text-neutral-500">
                      Target: {selectedMetric.target}
                      {selectedMetric.unit}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full',
                      getStatusStyle(selectedMetric.status)
                    )}
                  >
                    {getStatusLabel(selectedMetric.status)}
                  </span>
                  <div
                    className={cn(
                      'flex items-center gap-1 mt-2 justify-end',
                      selectedMetric.trend >= 0 ? 'text-success-dark' : 'text-error-dark'
                    )}
                  >
                    {selectedMetric.trend >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {selectedMetric.trend >= 0 ? '+' : ''}
                      {selectedMetric.trend}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Ownership & Guardrails */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Owner</p>
                  <p className="font-medium text-neutral-900">
                    {selectedMetric.owner || 'Unassigned'}
                  </p>
                  {selectedMetric.ownerRole && (
                    <p className="text-xs text-neutral-400">{selectedMetric.ownerRole}</p>
                  )}
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Threshold</p>
                  <p className="font-medium text-neutral-900">
                    {selectedMetric.threshold ?? 'Not set'}
                    {selectedMetric.threshold ? selectedMetric.unit : ''}
                  </p>
                </div>
              </div>

              {/* Linked items for critical metrics */}
              {selectedMetric.status === 'critical' && (
                <div className="p-4 bg-error-light rounded-lg">
                  <h4 className="font-medium text-error-dark mb-2">Critical Metric Tracking</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMetric.linkedDecisionId ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/cortex/intelligence/decision-dna?id=${selectedMetric.linkedDecisionId}`
                          )
                        }
                        className="flex items-center gap-2 text-error-dark hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Decision DNA:{' '}
                        {selectedMetric.linkedDecisionId}
                      </button>
                    ) : (
                      <p className="text-error-dark/70">No Decision DNA item attached</p>
                    )}
                    {selectedMetric.linkedCrucibleId ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/cortex/sovereign/crucible?id=${selectedMetric.linkedCrucibleId}`
                          )
                        }
                        className="flex items-center gap-2 text-error-dark hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Crucible Scenario:{' '}
                        {selectedMetric.linkedCrucibleId}
                      </button>
                    ) : (
                      <p className="text-error-dark/70">No Crucible scenario analysing this</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <button
                  onClick={() => navigate(`/cortex/pillars/lineage?metric=${selectedMetric.id}`)}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  View Lineage
                </button>
                <button
                  onClick={() =>
                    navigate(`/cortex/intelligence/chronos?metric=${selectedMetric.id}`)
                  }
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Open in Chronos
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/cortex/council?q=${encodeURIComponent(`What is driving ${selectedMetric.name}?`)}`
                    )
                  }
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Ask Council: "What is driving this metric?"
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

interface LineageEntity {
  id: string;
  name: string;
  type: string;
  upstreamCount: number;
  downstreamCount: number;
  qualityScore: number;
  lastUpdated: string;
}

interface QualityOverview {
  totalEntities: number;
  totalSources: number;
  totalRelationships: number;
  avgQualityScore: number;
  sourceQuality: Array<{ name: string; quality: number; recordCount: number }>;
}

export const LineagePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [entities, setEntities] = useState<LineageEntity[]>([]);
  const [qualityOverview, setQualityOverview] = useState<QualityOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLineageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [entitiesRes, qualityRes] = await Promise.all([
          api.get<LineageEntity[]>(
            '/pillars/lineage/entities',
            organizationId ? { organizationId } : undefined
          ),
          api.get<QualityOverview>(
            '/pillars/lineage/quality',
            organizationId ? { organizationId } : undefined
          ),
        ]);

        if (entitiesRes.success && entitiesRes.data) {
          setEntities(entitiesRes.data || []);
        }
        if (qualityRes.success && qualityRes.data) {
          setQualityOverview(qualityRes.data);
        }

        if (!entitiesRes.success || !qualityRes.success) {
          setError(
            entitiesRes.error?.message || qualityRes.error?.message || 'Failed to load lineage data'
          );
        }
      } catch (err) {
        console.error('Failed to load lineage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lineage data');
      } finally {
        setIsLoading(false);
      }
    };
    loadLineageData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return `${Math.floor(diffMs / 86400000)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🔗"
          name="The Lineage"
          tagline="Complete data provenance and dependency tracking"
          color="#10B981"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-neutral-500">Loading lineage data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🔗"
        name="The Lineage"
        tagline="Complete data provenance and dependency tracking"
        color="#10B981"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Tracked Entities"
          value={qualityOverview?.totalEntities ?? entities.length}
        />
        <MetricCard label="Data Sources" value={qualityOverview?.totalSources ?? 0} />
        <MetricCard label="Relationships" value={qualityOverview?.totalRelationships ?? 0} />
        <MetricCard
          label="Quality Score"
          value={Math.round(qualityOverview?.avgQualityScore ?? 0)}
          unit="%"
        />
      </div>

      {/* Lineage Explorer - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Lineage Views</h3>
          <button
            onClick={() => navigate('/cortex/graph')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Open Graph Explorer →
          </button>
        </div>
        <div className="space-y-3">
          {entities.length > 0 ? (
            entities.slice(0, 6).map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
                onClick={() => navigate(`/cortex/graph?entity=${entity.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {entity.type === 'report'
                      ? '📄'
                      : entity.type === 'dataset'
                        ? '📊'
                        : entity.type === 'metric'
                          ? '📈'
                          : entity.type === 'model'
                            ? '🤖'
                            : '📁'}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">{entity.name}</p>
                    <p className="text-sm text-neutral-500">
                      {entity.upstreamCount} upstream sources
                    </p>
                  </div>
                </div>
                <span className="text-sm text-neutral-500">
                  {formatRelativeTime(entity.lastUpdated)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No entities tracked yet</p>
          )}
        </div>
      </div>

      {/* Data Quality - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Quality by Source</h3>
        <div className="space-y-4">
          {(qualityOverview?.sourceQuality || []).map((source, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-32 text-neutral-700">{source.name}</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${source.quality}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-neutral-900">{source.quality}%</span>
              <span className="w-20 text-sm text-neutral-500">
                {source.recordCount.toLocaleString()}
              </span>
            </div>
          ))}
          {(!qualityOverview?.sourceQuality || qualityOverview.sourceQuality.length === 0) && (
            <p className="text-neutral-500 text-center py-4">No quality data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

interface PredictModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'active' | 'training' | 'inactive';
  predictions: number;
  lastTrained: string;
}

interface PredictInsight {
  feature: string;
  importance: number;
}

export const PredictPage: React.FC = () => {
  const user = useUser();
  const organizationId = user?.organizationId;
  const [models, setModels] = useState<PredictModel[]>([]);
  const [insights, setInsights] = useState<PredictInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPredictData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [modelsRes, insightsRes] = await Promise.all([
          api.get<PredictModel[]>(
            '/pillars/predict/models',
            organizationId ? { organizationId } : undefined
          ),
          api.get<{ features: PredictInsight[] }>(
            '/pillars/predict/insights',
            organizationId ? { organizationId } : undefined
          ),
        ]);

        if (modelsRes.success && modelsRes.data) {
          setModels(modelsRes.data || []);
        }
        if (insightsRes.success && insightsRes.data) {
          setInsights(insightsRes.data.features || []);
        }

        if (!modelsRes.success || !insightsRes.success) {
          setError(
            modelsRes.error?.message ||
              insightsRes.error?.message ||
              'Failed to load prediction models'
          );
        }
      } catch (err) {
        console.error('Failed to load predict data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prediction models');
      } finally {
        setIsLoading(false);
      }
    };
    loadPredictData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeModels = models.filter((m) => m.status === 'active').length;
  const avgAccuracy =
    models.length > 0 ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length : 0;
  const totalPredictions = models.reduce((sum, m) => sum + (m.predictions || 0), 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🔮"
          name="The Predict"
          tagline="AI-powered forecasting and predictive analytics"
          color="#8B5CF6"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-neutral-500">Loading prediction models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🔮"
        name="The Predict"
        tagline="AI-powered forecasting and predictive analytics"
        color="#8B5CF6"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Active Models - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Models" value={activeModels} />
        <MetricCard label="Avg Accuracy" value={avgAccuracy.toFixed(1)} unit="%" />
        <MetricCard label="Predictions Today" value={totalPredictions} />
        <MetricCard
          label="Models Training"
          value={models.filter((m) => m.status === 'training').length}
        />
      </div>

      {/* Forecast Models - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Models</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {models.length > 0 ? (
            models.map((model) => (
              <div key={model.id} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-neutral-900">{model.name}</h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      model.status === 'active'
                        ? 'bg-success-light text-success-dark'
                        : model.status === 'training'
                          ? 'bg-warning-light text-warning-dark'
                          : 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {model.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mb-2">{model.type}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-200 rounded-full">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {model.accuracy.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-neutral-500 text-center py-4">No models configured</p>
          )}
        </div>
      </div>

      {/* Feature Importance - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Predictive Features</h3>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.slice(0, 5).map((f, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-40 text-neutral-700">{f.feature}</span>
                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${f.importance * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-neutral-600">
                  {(f.importance * 100).toFixed(0)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No feature insights available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

interface FlowStats {
  activeWorkflows: number;
  executionsToday: number;
  successRate: number;
  timeSavedHours: number;
  pendingApprovals: number;
}

interface FlowExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  startedAt: string;
  duration: number | null;
}

export const FlowPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [stats, setStats] = useState<FlowStats | null>(null);
  const [executions, setExecutions] = useState<FlowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlowData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [statsRes, execRes] = await Promise.all([
          api.get<FlowStats>('/pillars/flow/stats', organizationId ? { organizationId } : undefined),
          api.get<FlowExecution[]>('/pillars/flow/executions', {
            ...(organizationId ? { organizationId } : {}),
            limit: 10,
          }),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (execRes.success && execRes.data) {
          setExecutions(execRes.data || []);
        }

        if (!statsRes.success || !execRes.success) {
          setError(statsRes.error?.message || execRes.error?.message || 'Failed to load flow data');
        }
      } catch (err) {
        console.error('Failed to load flow data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load flow data');
      } finally {
        setIsLoading(false);
      }
    };
    loadFlowData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDuration = (ms: number | null) => {
    if (ms === null) {
      return '—';
    }
    if (ms < 1000) {
      return `${ms}ms`;
    }
    if (ms < 60000) {
      return `${(ms / 1000).toFixed(0)}s`;
    }
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 60000) {
      return 'Now';
    }
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    }
    return `${Math.floor(diffMs / 3600000)} hours ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🌊"
          name="The Flow"
          tagline="Intelligent workflow automation and orchestration"
          color="#06B6D4"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-neutral-500">Loading workflow data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🌊"
        name="The Flow"
        tagline="Intelligent workflow automation and orchestration"
        color="#06B6D4"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Workflows" value={stats?.activeWorkflows ?? 0} />
        <MetricCard label="Executions Today" value={stats?.executionsToday ?? 0} />
        <MetricCard label="Success Rate" value={(stats?.successRate ?? 0).toFixed(1)} unit="%" />
        <MetricCard label="Pending Approvals" value={stats?.pendingApprovals ?? 0} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => navigate('/cortex/bridge')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">🔧</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Workflow Builder</h3>
          <p className="text-sm text-neutral-500">Create and edit automation workflows</p>
        </button>
        <button
          onClick={() => navigate('/cortex/bridge?tab=executions')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">📊</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Execution History</h3>
          <p className="text-sm text-neutral-500">View past runs and logs</p>
        </button>
        <button
          onClick={() => navigate('/cortex/bridge?tab=approvals')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">✅</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Pending Approvals</h3>
          <p className="text-sm text-neutral-500">Review human-in-the-loop tasks</p>
        </button>
      </div>

      {/* Recent Activity - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Flow Executions</h3>
        <div className="space-y-3">
          {executions.length > 0 ? (
            executions.map((exec) => (
              <div
                key={exec.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      exec.status === 'success' && 'bg-success-main',
                      exec.status === 'running' && 'bg-primary-500 animate-pulse',
                      exec.status === 'failed' && 'bg-error-main',
                      exec.status === 'pending' && 'bg-warning-main'
                    )}
                  />
                  <span className="font-medium text-neutral-900">{exec.workflowName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>{formatDuration(exec.duration)}</span>
                  <span>{formatRelativeTime(exec.startedAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No recent executions</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE HEALTH - Organizational Health
// =============================================================================

interface SystemHealth {
  overallScore: number;
  dimensions: Array<{ name: string; score: number; color: string }>;
  status: 'healthy' | 'degraded' | 'critical';
}

interface HealthAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  source: string;
  createdAt: string;
  acknowledged: boolean;
  affectedSystems?: string[];
  rootCause?: string;
  linkedWorkflow?: string;
}

export const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [healthRes, alertsRes] = await Promise.all([
          api.get<SystemHealth>('/pillars/health/status', organizationId ? { organizationId } : undefined),
          api.get<HealthAlert[]>('/pillars/health/alerts', organizationId ? { organizationId } : undefined),
        ]);

        if (healthRes.success && healthRes.data) {
          setHealth(healthRes.data);
        }
        if (alertsRes.success && alertsRes.data) {
          setAlerts(alertsRes.data || []);
        }

        if (!healthRes.success || !alertsRes.success) {
          setError(
            healthRes.error?.message || alertsRes.error?.message || 'Failed to load health data'
          );
        }
      } catch (err) {
        console.error('Failed to load health data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load health data');
      } finally {
        setIsLoading(false);
      }
    };
    loadHealthData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return `${Math.floor(diffMs / 86400000)} days ago`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return '#10B981';
    }
    if (score >= 70) {
      return '#F59E0B';
    }
    return '#EF4444';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="💓"
          name="The Health"
          tagline="Real-time organizational health monitoring"
          color="#EF4444"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-neutral-500">Loading health data...</span>
        </div>
      </div>
    );
  }

  const overallScore = health?.overallScore ?? 0;

  return (
    <div className="p-6">
      <PillarHeader
        icon="💓"
        name="The Health"
        tagline="Real-time organizational health monitoring"
        color="#EF4444"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Health Score - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Overall Health Score</h3>
          <button
            onClick={() => navigate('/cortex/pulse')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View Details →
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={getScoreColor(overallScore)}
                strokeWidth="12"
                strokeDasharray={`${overallScore * 3.52} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">
                {Math.round(overallScore)}
              </span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {(health?.dimensions || []).map((dim, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dim.color || getScoreColor(dim.score) }}
                />
                <span className="text-neutral-600">{dim.name}</span>
                <span className="font-medium text-neutral-900 ml-auto">
                  {Math.round(dim.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Active Alerts</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error-main"></span> Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning-main"></span> Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span> Info
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={cn(
                  'w-full p-4 rounded-lg border-l-4 text-left hover:opacity-80 transition-opacity cursor-pointer',
                  alert.severity === 'critical' && 'bg-error-light border-error-main',
                  alert.severity === 'warning' && 'bg-warning-light border-warning-main',
                  alert.severity === 'info' && 'bg-primary-50 border-primary-500'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-900">{alert.title}</span>
                    {alert.description && (
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-1">
                        {alert.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">
              No active alerts - all systems healthy
            </p>
          )}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    selectedAlert.severity === 'critical'
                      ? 'bg-error-light'
                      : selectedAlert.severity === 'warning'
                        ? 'bg-warning-light'
                        : 'bg-primary-50'
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      'w-5 h-5',
                      selectedAlert.severity === 'critical'
                        ? 'text-error-main'
                        : selectedAlert.severity === 'warning'
                          ? 'text-warning-main'
                          : 'text-primary-500'
                    )}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedAlert.title}</h2>
                  <p className="text-sm text-neutral-500">
                    {selectedAlert.source || 'System Monitor'} •{' '}
                    {formatRelativeTime(selectedAlert.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    selectedAlert.severity === 'critical'
                      ? 'bg-error-light text-error-dark'
                      : selectedAlert.severity === 'warning'
                        ? 'bg-warning-light text-warning-dark'
                        : 'bg-primary-50 text-primary-700'
                  )}
                >
                  {selectedAlert.severity.toUpperCase()}
                </span>
                {selectedAlert.acknowledged && (
                  <span className="text-xs px-2 py-1 bg-success-light text-success-dark rounded-full">
                    Acknowledged
                  </span>
                )}
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {selectedAlert.description || 'No additional details available.'}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Root Cause Analysis</h4>
                <p className="text-sm text-neutral-600">
                  {selectedAlert.rootCause || 'No root cause analysis available.'}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedAlert.affectedSystems || []).map((system, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">
                      {system}
                    </span>
                  ))}
                </div>
              </div>

              {selectedAlert.linkedWorkflow && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">Linked Workflow:</span>
                  <button
                    onClick={() => navigate('/cortex/bridge')}
                    className="text-primary-600 hover:underline flex items-center gap-1"
                  >
                    {selectedAlert.linkedWorkflow}{' '}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate('/cortex/intelligence/chronos');
                  }}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  View in Chronos Timeline
                </button>
                <button
                  onClick={() =>
                    window.open('/cortex/bridge?template=incident-response', '_blank')
                  }
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Create Response Workflow in Bridge
                </button>
                <button
                  onClick={() =>
                    window.open('/cortex/council?escalate=health', '_blank')
                  }
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Escalate to Council
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

interface SecurityPosture {
  securityScore: number;
  openVulnerabilities: number;
  complianceScore: number;
  daysSinceIncident: number;
  frameworks: Array<{
    id: string;
    name: string;
    status: 'compliant' | 'in_progress' | 'non_compliant';
    implementedControls: number;
    totalControls: number;
  }>;
}

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detectedAt: string;
  status: string;
  description?: string;
  affectedAssets?: string[];
  cve?: string;
  cvss?: number;
}

export const GuardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch security posture and threats from backend
        const [postureRes, threatsRes] = await Promise.all([
          api.get<SecurityPosture>('/pillars/guard/posture', organizationId ? { organizationId } : undefined),
          api.get<SecurityThreat[]>('/pillars/guard/threats', organizationId ? { organizationId } : undefined),
        ]);

        if (postureRes.success && postureRes.data) {
          setPosture(postureRes.data);
        }

        if (threatsRes.success && threatsRes.data) {
          setThreats(threatsRes.data);
        }
      } catch (err) {
        console.error('Failed to load security data:', err);
        setError('Failed to load security data');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecurityData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🛡️"
          name="The Guard"
          tagline="Proactive security posture and compliance monitoring"
          color="#F59E0B"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-neutral-500">Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🛡️"
        name="The Guard"
        tagline="Proactive security posture and compliance monitoring"
        color="#F59E0B"
      />

      {/* Sovereign Security Integration */}
      <div className="mb-6 flex items-center gap-3">
        <a
          href="http://localhost:8090"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          <span className="text-red-500 text-xs font-medium">🔐 Infisical Secrets</span>
        </a>
        <a
          href="http://localhost:8080"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
        >
          <span className="text-blue-500 text-xs font-medium">🔑 Keycloak SSO</span>
        </a>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <span className="text-amber-500 text-xs font-medium">🛡️ Wazuh XDR (Coming Soon)</span>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>}

      {/* Security Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Security Score"
          value={Math.round(posture?.securityScore ?? 0)}
          unit="/100"
        />
        <MetricCard label="Open Vulnerabilities" value={posture?.openVulnerabilities ?? 0} />
        <MetricCard
          label="Compliance Status"
          value={Math.round(posture?.complianceScore ?? 0)}
          unit="%"
        />
        <MetricCard label="Days Since Incident" value={posture?.daysSinceIncident ?? 0} />
      </div>

      {/* Compliance Frameworks - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(posture?.frameworks || []).map((fw, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-900">{fw.name}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    fw.status === 'compliant'
                      ? 'bg-success-light text-success-dark'
                      : fw.status === 'in_progress'
                        ? 'bg-warning-light text-warning-dark'
                        : 'bg-error-light text-error-dark'
                  )}
                >
                  {fw.status === 'compliant'
                    ? 'Compliant'
                    : fw.status === 'in_progress'
                      ? 'In Progress'
                      : 'Non-Compliant'}
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                {fw.implementedControls}/{fw.totalControls} controls
              </p>
            </div>
          ))}
          {(!posture?.frameworks || posture.frameworks.length === 0) && (
            <p className="col-span-4 text-neutral-500 text-center py-4">
              No compliance frameworks configured
            </p>
          )}
        </div>
      </div>

      {/* Threats - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Threat Detection</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error-main"></span> Critical/High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning-main"></span> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span> Low
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {threats.length > 0 ? (
            threats.map((threat) => (
              <button
                key={threat.id}
                onClick={() => setSelectedThreat(threat)}
                className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 hover:border-primary-500 border border-transparent transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      threat.severity === 'critical' && 'bg-error-main',
                      threat.severity === 'high' && 'bg-error-main',
                      threat.severity === 'medium' && 'bg-warning-main',
                      threat.severity === 'low' && 'bg-neutral-400'
                    )}
                  />
                  <div>
                    <p className="font-medium text-neutral-900">{threat.type}</p>
                    <p className="text-sm text-neutral-500">{threat.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      threat.status === 'resolved' || threat.status === 'mitigated'
                        ? 'bg-success-light text-success-dark'
                        : threat.status === 'investigating'
                          ? 'bg-warning-light text-warning-dark'
                          : 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {threat.status}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatRelativeTime(threat.detectedAt)}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No active threats detected</p>
          )}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedThreat(null)}
        >
          <div
            className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    selectedThreat.severity === 'critical' || selectedThreat.severity === 'high'
                      ? 'bg-error-light'
                      : 'bg-warning-light'
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      'w-5 h-5',
                      selectedThreat.severity === 'critical' || selectedThreat.severity === 'high'
                        ? 'text-error-main'
                        : 'text-warning-main'
                    )}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedThreat.type}</h2>
                  <p className="text-sm text-neutral-500">
                    {selectedThreat.source} • {formatRelativeTime(selectedThreat.detectedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    selectedThreat.severity === 'critical'
                      ? 'bg-error-light text-error-dark'
                      : selectedThreat.severity === 'high'
                        ? 'bg-error-light text-error-dark'
                        : selectedThreat.severity === 'medium'
                          ? 'bg-warning-light text-warning-dark'
                          : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {selectedThreat.severity.toUpperCase()}
                </span>
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    selectedThreat.status === 'resolved' || selectedThreat.status === 'mitigated'
                      ? 'bg-success-light text-success-dark'
                      : selectedThreat.status === 'investigating'
                        ? 'bg-warning-light text-warning-dark'
                        : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {selectedThreat.status}
                </span>
                {selectedThreat.cvss !== undefined && (
                  <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                    CVSS: {selectedThreat.cvss}
                  </span>
                )}
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {selectedThreat.description || 'No description available.'}
                </p>
              </div>

              {selectedThreat.cve && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">CVE:</span>
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${selectedThreat.cve}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline flex items-center gap-1"
                  >
                    {selectedThreat.cve} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Assets</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedThreat.affectedAssets || []).map((asset, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button
                  onClick={() => {
                    setSelectedThreat(null);
                    navigate('/cortex/sovereign/panopticon');
                  }}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  View in Panopticon
                </button>
                <button
                  onClick={() =>
                    window.open('/cortex/council?escalate=security', '_blank')
                  }
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Escalate to Council
                </button>
                <button
                  onClick={() => window.open('/cortex/bridge?template=incident-response', '_blank')}
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Create Incident Response Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// THE ETHICS - Ethical Guardrails
// =============================================================================

interface EthicsStats {
  policyCompliance: number;
  biasChecks: number;
  flaggedDecisions: number;
  humanOverrides: number;
}

interface EthicsPrinciple {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  checksThisWeek: number;
}

interface EthicsReview {
  id: string;
  decisionId?: string;
  decisionName: string;
  result: 'approved' | 'flagged' | 'rejected';
  reviewedBy: string;
  reviewedAt: string;
  principle?: string;
  rationale?: string;
  biasScore?: number;
}

export const EthicsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [stats, setStats] = useState<EthicsStats | null>(null);
  const [principles, setPrinciples] = useState<EthicsPrinciple[]>([]);
  const [reviews, setReviews] = useState<EthicsReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<EthicsReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEthicsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [statsRes, principlesRes, reviewsRes] = await Promise.all([
          api.get<EthicsStats>('/pillars/ethics/stats', organizationId ? { organizationId } : undefined),
          api.get<EthicsPrinciple[]>('/pillars/ethics/principles', organizationId ? { organizationId } : undefined),
          api.get<EthicsReview[]>('/pillars/ethics/reviews', organizationId ? { organizationId } : undefined),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (principlesRes.success && principlesRes.data) {
          setPrinciples(principlesRes.data || []);
        }
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data || []);
        }

        if (!statsRes.success || !principlesRes.success || !reviewsRes.success) {
          setError(
            statsRes.error?.message ||
              principlesRes.error?.message ||
              reviewsRes.error?.message ||
              'Failed to load ethics data'
          );
        }
      } catch (err) {
        console.error('Failed to load ethics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ethics data');
      } finally {
        setIsLoading(false);
      }
    };
    loadEthicsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="⚖️"
          name="The Ethics"
          tagline="Built-in ethical guardrails and governance"
          color="#EC4899"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-neutral-500">Loading ethics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="⚖️"
        name="The Ethics"
        tagline="Built-in ethical guardrails and governance"
        color="#EC4899"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Ethics Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Policy Compliance"
          value={(stats?.policyCompliance ?? 0).toFixed(1)}
          unit="%"
        />
        <MetricCard label="Bias Checks" value={stats?.biasChecks ?? 0} />
        <MetricCard label="Flagged Decisions" value={stats?.flaggedDecisions ?? 0} />
        <MetricCard label="Human Overrides" value={stats?.humanOverrides ?? 0} />
      </div>

      {/* Ethical Principles - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Ethical Principles</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {principles.length > 0 ? (
            principles.map((principle) => (
              <div key={principle.id} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-900">{principle.name}</h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      principle.status === 'active'
                        ? 'bg-success-light text-success-dark'
                        : 'bg-neutral-100 text-neutral-600'
                    )}
                  >
                    {principle.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{principle.description}</p>
                <p className="text-xs text-neutral-500">
                  {principle.checksThisWeek} checks this week
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-neutral-500 text-center py-4">
              No ethical principles configured
            </p>
          )}
        </div>
      </div>

      {/* Recent Reviews - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Ethics Reviews</h3>
        <div className="space-y-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {review.decisionName || 'Unnamed Decision'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Reviewed by {review.reviewedBy || 'Ethics Engine'}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      review.result === 'approved'
                        ? 'bg-success-light text-success-dark'
                        : review.result === 'flagged'
                          ? 'bg-warning-light text-warning-dark'
                          : 'bg-error-light text-error-dark'
                    )}
                  >
                    {review.result}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">{formatDate(review.reviewedAt)}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No recent reviews</p>
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    selectedReview.result === 'approved'
                      ? 'bg-success-light'
                      : selectedReview.result === 'flagged'
                        ? 'bg-warning-light'
                        : 'bg-error-light'
                  )}
                >
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Ethics Review</h2>
                  <p className="text-sm text-neutral-500">
                    {selectedReview.decisionName || 'Unnamed Decision'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    selectedReview.result === 'approved'
                      ? 'bg-success-light text-success-dark'
                      : selectedReview.result === 'flagged'
                        ? 'bg-warning-light text-warning-dark'
                        : 'bg-error-light text-error-dark'
                  )}
                >
                  {selectedReview.result.toUpperCase()}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatDate(selectedReview.reviewedAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Reviewed By:</span>
                  <span className="ml-2 font-medium text-neutral-900">
                    {selectedReview.reviewedBy || 'Ethics Engine'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">Principle:</span>
                  <span className="ml-2 font-medium text-neutral-900">
                    {selectedReview.principle || '—'}
                  </span>
                </div>
              </div>

              {selectedReview.biasScore !== undefined && (
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">Bias Score</h4>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        (selectedReview.biasScore ?? 0) <
                          0.3
                          ? 'text-success-dark'
                          : (selectedReview.biasScore ?? 0) < 0.6
                            ? 'text-warning-dark'
                            : 'text-error-dark'
                      )}
                    >
                      {((selectedReview.biasScore ?? 0) * 100).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        (selectedReview.biasScore ?? 0) <
                          0.3
                          ? 'bg-success-main'
                          : (selectedReview.biasScore ?? 0) < 0.6
                            ? 'bg-warning-main'
                            : 'bg-error-main'
                      )}
                      style={{
                        width: `${(selectedReview.biasScore ?? 0) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Lower is better. Threshold: 30%</p>
                </div>
              )}

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Review Rationale</h4>
                <p className="text-sm text-neutral-600">
                  {selectedReview.rationale || 'No rationale provided.'}
                </p>
              </div>

              {selectedReview.decisionId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">Decision ID:</span>
                  <button
                    onClick={() =>
                      navigate(`/cortex/intelligence/decision-dna?id=${selectedReview.decisionId}`)
                    }
                    className="text-primary-600 hover:underline flex items-center gap-1"
                  >
                    {selectedReview.decisionId} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    navigate(
                      `/cortex/intelligence/decision-dna?id=${selectedReview.decisionId}`
                    );
                  }}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  View in Decision DNA
                </button>
                {selectedReview.result === 'rejected' && (
                  <button
                    onClick={() =>
                      window.open('/cortex/council?appeal=ethics', '_blank')
                    }
                    className="w-full px-4 py-2 bg-warning-light hover:bg-warning-main hover:text-white text-warning-dark rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Appeal to Council
                  </button>
                )}
                <button
                  onClick={() => window.open('/cortex/sovereign/vox', '_blank')}
                  className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  View Stakeholder Impact in CendiaVox
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// THE AGENTS - AI Advisors
// =============================================================================

interface AgentStats {
  activeAgents: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
}

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'online' | 'busy' | 'offline';
  queriesToday: number;
}

export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const organizationId = user?.organizationId;
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgentsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [statsRes, agentsRes] = await Promise.all([
          api.get<AgentStats>('/pillars/agents/stats', organizationId ? { organizationId } : undefined),
          api.get<Agent[]>('/pillars/agents', organizationId ? { organizationId } : undefined),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (agentsRes.success && agentsRes.data) {
          setAgents(agentsRes.data || []);
        }

        if (!statsRes.success || !agentsRes.success) {
          setError(
            statsRes.error?.message || agentsRes.error?.message || 'Failed to load agents data'
          );
        }
      } catch (err) {
        console.error('Failed to load agents data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load agents data');
      } finally {
        setIsLoading(false);
      }
    };
    loadAgentsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAgentIcon = (code: string): string => {
    const icons: Record<string, string> = {
      chief: '👔',
      cfo: '💰',
      coo: '⚙️',
      ciso: '🔒',
      cto: '💻',
      cmo: '📢',
      cro: '📈',
      cdo: '📊',
      risk: '⚠️',
      clo: '⚖️',
      chro: '👥',
      cso: '🌍',
      cco: '📰',
      caio: '🤖',
    };
    return icons[code.toLowerCase()] || '🤖';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🤖"
          name="The Agents"
          tagline="AI advisors for every domain - The Pantheon"
          color="#6366F1"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading agents data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🤖"
        name="The Agents"
        tagline="AI advisors for every domain - The Pantheon"
        color="#6366F1"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">{error}</div>
      )}

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Active Agents"
          value={stats?.activeAgents ?? agents.filter((a) => a.status === 'online').length}
        />
        <MetricCard
          label="Queries Today"
          value={stats?.queriesToday ?? agents.reduce((sum, a) => sum + a.queriesToday, 0)}
        />
        <MetricCard
          label="Avg Response"
          value={(stats?.avgResponseTime ?? 0).toFixed(1)}
          unit="s"
        />
        <MetricCard label="Satisfaction" value={(stats?.satisfaction ?? 0).toFixed(1)} unit="/5" />
      </div>

      {/* Agent Grid - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/cortex/council?agent=${agent.code}`)}
              className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{agent.icon || getAgentIcon(agent.code)}</span>
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    agent.status === 'online' && 'bg-success-main',
                    agent.status === 'busy' && 'bg-warning-main',
                    agent.status === 'offline' && 'bg-neutral-300'
                  )}
                />
              </div>
              <h4 className="font-semibold text-neutral-900">{agent.name}</h4>
              <p className="text-sm text-neutral-500">{agent.role}</p>
              <p className="text-xs text-neutral-400 mt-2">{agent.queriesToday} queries today</p>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-neutral-500 text-center py-8">No agents configured</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/cortex/council')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ask The Council
          </button>
          <button
            onClick={() => navigate('/cortex/council?mode=deliberation')}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Start Deliberation
          </button>
          <button
            onClick={() => navigate('/cortex/council?tab=history')}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            View Decision History
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelmPage;
