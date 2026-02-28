// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA USAGE ANALYTICS - Enterprise Platinum Standard
// Platform-wide usage metrics, API analytics, and resource consumption
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Activity,
  Zap,
  Database,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  Cpu,
  HardDrive,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { api } from '../../lib/api';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface UsageMetrics {
  apiCalls: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: number;
    byEndpoint: Record<string, number>;
    byMethod: Record<string, number>;
  };
  deliberations: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: number;
    byMode: Record<string, number>;
    avgDuration: number;
  };
  storage: {
    totalUsedGB: number;
    totalCapacityGB: number;
    byType: Record<string, number>;
    trend: number;
  };
  users: {
    totalActive: number;
    dau: number;
    wau: number;
    mau: number;
    trend: number;
  };
  performance: {
    avgLatency: number;
    p95Latency: number;
    p99Latency: number;
    errorRate: number;
    uptime: number;
  };
}

interface UsageTimeSeries {
  timestamp: string;
  apiCalls: number;
  deliberations: number;
  activeUsers: number;
}

interface TopConsumer {
  tenantId: string;
  tenantName: string;
  apiCalls: number;
  deliberations: number;
  storage: number;
  percentOfTotal: number;
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin';

async function fetchUsageMetrics(): Promise<UsageMetrics> {
  try {
    const res = await api.get<any>(`${API_BASE}/usage/metrics`);
    return (res as any)?.data || (res as any) || getDefaultMetrics();
  } catch (error) {
    console.error('Failed to fetch usage metrics:', error);
    return getDefaultMetrics();
  }
}

async function fetchUsageTimeSeries(period: string): Promise<UsageTimeSeries[]> {
  try {
    const res = await api.get<any>(`${API_BASE}/usage/timeseries?period=${period}`);
    return (res as any)?.data || (res as any)?.timeseries || getDefaultTimeSeries();
  } catch (error) {
    console.error('Failed to fetch time series:', error);
    return getDefaultTimeSeries();
  }
}

async function fetchTopConsumers(): Promise<TopConsumer[]> {
  try {
    const res = await api.get<any>(`${API_BASE}/usage/top-consumers`);
    return (res as any)?.data || (res as any)?.consumers || getDefaultTopConsumers();
  } catch (error) {
    console.error('Failed to fetch top consumers:', error);
    return getDefaultTopConsumers();
  }
}

// =============================================================================
// MOCK DATA
// =============================================================================

function getDefaultMetrics(): UsageMetrics {
  return {
    apiCalls: {
      total: 458000000,
      today: 1250000,
      thisWeek: 8750000,
      thisMonth: 38500000,
      trend: 12.5,
      byEndpoint: {
        '/api/v1/council': 15200000,
        '/api/v1/deliberations': 8900000,
        '/api/v1/metrics': 6500000,
        '/api/v1/agents': 4200000,
        '/api/v1/chronos': 3800000,
      },
      byMethod: { GET: 28500000, POST: 8200000, PUT: 1200000, DELETE: 600000 },
    },
    deliberations: {
      total: 892000,
      today: 3420,
      thisWeek: 24500,
      thisMonth: 98000,
      trend: 8.3,
      byMode: { council: 45000, solo: 32000, cross_exam: 15000, shadow: 6000 },
      avgDuration: 45.2,
    },
    storage: {
      totalUsedGB: 2450,
      totalCapacityGB: 10000,
      byType: { documents: 1200, embeddings: 650, backups: 400, logs: 200 },
      trend: 5.2,
    },
    users: {
      totalActive: 12500,
      dau: 3200,
      wau: 8500,
      mau: 11200,
      trend: 15.3,
    },
    performance: {
      avgLatency: 45,
      p95Latency: 120,
      p99Latency: 350,
      errorRate: 0.12,
      uptime: 99.97,
    },
  };
}

function getDefaultTimeSeries(): UsageTimeSeries[] {
  const data: UsageTimeSeries[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      timestamp: date.toISOString(),
      apiCalls: Math.floor(1000000 + deterministicFloat('usageanalytics-1') * 500000),
      deliberations: Math.floor(3000 + deterministicFloat('usageanalytics-2') * 1000),
      activeUsers: Math.floor(2800 + deterministicFloat('usageanalytics-3') * 800),
    });
  }
  return data;
}

function getDefaultTopConsumers(): TopConsumer[] {
  return [
    { tenantId: 't3', tenantName: 'Global Finance Group', apiCalls: 45000000, deliberations: 56000, storage: 120, percentOfTotal: 28.5 },
    { tenantId: 't1', tenantName: 'Acme Corporation', apiCalls: 25000000, deliberations: 23400, storage: 45, percentOfTotal: 15.8 },
    { tenantId: 't5', tenantName: 'MedCare Health Systems', apiCalls: 18000000, deliberations: 15600, storage: 32, percentOfTotal: 11.4 },
    { tenantId: 't2', tenantName: 'TechStart Inc', apiCalls: 8500000, deliberations: 8900, storage: 12, percentOfTotal: 5.4 },
    { tenantId: 't7', tenantName: 'Manufacturing Plus', apiCalls: 6200000, deliberations: 4500, storage: 8, percentOfTotal: 3.9 },
  ];
}

// =============================================================================
// COMPONENTS
// =============================================================================

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, subLabel, trend, icon: Icon, color }) => (
  <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-neutral-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subLabel && <p className="text-xs text-neutral-500 mt-1">{subLabel}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}% vs last period
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-0.5 h-12">
      {data.slice(-14).map((value, i) => (
        <div
          key={i}
          className={`w-2 ${color} rounded-t opacity-70 hover:opacity-100 transition-opacity`}
          style={{ height: `${((value - min) / range) * 100}%`, minHeight: '4px' }}
        />
      ))}
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => (
  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
    <div
      className={`h-full ${color} rounded-full transition-all duration-500`}
      style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
    />
  </div>
);

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export const UsageAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [timeSeries, setTimeSeries] = useState<UsageTimeSeries[]>([]);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsData, tsData, consumersData] = await Promise.all([
        fetchUsageMetrics(),
        fetchUsageTimeSeries(period),
        fetchTopConsumers(),
      ]);
      setMetrics(metricsData);
      setTimeSeries(tsData);
      setTopConsumers(consumersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {return `${(num / 1000000000).toFixed(1)}B`;}
    if (num >= 1000000) {return `${(num / 1000000).toFixed(1)}M`;}
    if (num >= 1000) {return `${(num / 1000).toFixed(1)}K`;}
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            Usage Analytics
          </h1>
          <p className="text-neutral-400 mt-1">
            Platform-wide usage metrics, API analytics, and resource consumption
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="API Calls (Today)"
            value={formatNumber(metrics.apiCalls.today)}
            subLabel={`${formatNumber(metrics.apiCalls.thisMonth)} this month`}
            trend={metrics.apiCalls.trend}
            icon={Zap}
            color="bg-blue-600"
          />
          <MetricCard
            label="Deliberations (Today)"
            value={formatNumber(metrics.deliberations.today)}
            subLabel={`Avg ${metrics.deliberations.avgDuration}s duration`}
            trend={metrics.deliberations.trend}
            icon={MessageSquare}
            color="bg-purple-600"
          />
          <MetricCard
            label="Active Users (DAU)"
            value={formatNumber(metrics.users.dau)}
            subLabel={`${formatNumber(metrics.users.mau)} MAU`}
            trend={metrics.users.trend}
            icon={Users}
            color="bg-green-600"
          />
          <MetricCard
            label="Storage Used"
            value={`${metrics.storage.totalUsedGB} GB`}
            subLabel={`of ${metrics.storage.totalCapacityGB} GB`}
            trend={metrics.storage.trend}
            icon={Database}
            color="bg-amber-600"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Calls Chart */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">API Call Volume</h3>
            <span className="text-sm text-neutral-400">Last 14 days</span>
          </div>
          <MiniChart data={timeSeries.map(t => t.apiCalls)} color="bg-blue-500" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-neutral-400 text-xs">Peak</p>
              <p className="text-white font-semibold">{formatNumber(Math.max(...timeSeries.map(t => t.apiCalls)))}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs">Average</p>
              <p className="text-white font-semibold">
                {formatNumber(Math.round(timeSeries.reduce((a, t) => a + t.apiCalls, 0) / timeSeries.length))}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs">Total</p>
              <p className="text-white font-semibold">{formatNumber(timeSeries.reduce((a, t) => a + t.apiCalls, 0))}</p>
            </div>
          </div>
        </div>

        {/* Deliberations Chart */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Deliberation Activity</h3>
            <span className="text-sm text-neutral-400">Last 14 days</span>
          </div>
          <MiniChart data={timeSeries.map(t => t.deliberations)} color="bg-purple-500" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-neutral-400 text-xs">Peak</p>
              <p className="text-white font-semibold">{formatNumber(Math.max(...timeSeries.map(t => t.deliberations)))}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs">Average</p>
              <p className="text-white font-semibold">
                {formatNumber(Math.round(timeSeries.reduce((a, t) => a + t.deliberations, 0) / timeSeries.length))}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs">Total</p>
              <p className="text-white font-semibold">{formatNumber(timeSeries.reduce((a, t) => a + t.deliberations, 0))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        {metrics && (
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">Avg Latency</span>
                  <span className="text-white font-medium">{metrics.performance.avgLatency}ms</span>
                </div>
                <ProgressBar value={metrics.performance.avgLatency} max={200} color="bg-green-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">P95 Latency</span>
                  <span className="text-white font-medium">{metrics.performance.p95Latency}ms</span>
                </div>
                <ProgressBar value={metrics.performance.p95Latency} max={500} color="bg-yellow-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-400">P99 Latency</span>
                  <span className="text-white font-medium">{metrics.performance.p99Latency}ms</span>
                </div>
                <ProgressBar value={metrics.performance.p99Latency} max={1000} color="bg-orange-500" />
              </div>
              <div className="pt-4 border-t border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Uptime</span>
                  <span className="text-green-400 font-bold">{metrics.performance.uptime}%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-neutral-400">Error Rate</span>
                  <span className="text-white font-medium">{metrics.performance.errorRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Endpoints */}
        {metrics && (
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Top Endpoints</h3>
            <div className="space-y-3">
              {Object.entries(metrics.apiCalls.byEndpoint).slice(0, 5).map(([endpoint, count]) => (
                <div key={endpoint} className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{endpoint}</p>
                    <ProgressBar 
                      value={count} 
                      max={Object.values(metrics.apiCalls.byEndpoint)[0]} 
                      color="bg-blue-500" 
                    />
                  </div>
                  <span className="text-sm text-neutral-400 flex-shrink-0">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Breakdown */}
        {metrics && (
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Storage Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(metrics.storage.byType).map(([type, gb]) => (
                <div key={type} className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white capitalize">{type}</span>
                      <span className="text-sm text-neutral-400">{gb} GB</span>
                    </div>
                    <ProgressBar value={gb} max={metrics.storage.totalUsedGB} color="bg-amber-500" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Capacity Used</span>
                <span className="text-white font-medium">
                  {((metrics.storage.totalUsedGB / metrics.storage.totalCapacityGB) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Consumers */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top Resource Consumers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left pb-3 text-sm font-semibold text-neutral-400">Tenant</th>
                <th className="text-right pb-3 text-sm font-semibold text-neutral-400">API Calls</th>
                <th className="text-right pb-3 text-sm font-semibold text-neutral-400">Deliberations</th>
                <th className="text-right pb-3 text-sm font-semibold text-neutral-400">Storage</th>
                <th className="text-right pb-3 text-sm font-semibold text-neutral-400">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {topConsumers.map((consumer, i) => (
                <tr key={consumer.tenantId} className="border-b border-neutral-700/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="text-white">{consumer.tenantName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-neutral-300">{formatNumber(consumer.apiCalls)}</td>
                  <td className="py-3 text-right text-neutral-300">{formatNumber(consumer.deliberations)}</td>
                  <td className="py-3 text-right text-neutral-300">{consumer.storage} GB</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20">
                        <ProgressBar value={consumer.percentOfTotal} max={100} color="bg-amber-500" />
                      </div>
                      <span className="text-amber-400 font-medium w-12 text-right">{consumer.percentOfTotal}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalyticsPage;
