// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PULSE SUB-PAGES
// =============================================================================

import React, { useEffect, useState } from 'react';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { alertsApi, metricsApi } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';

// =============================================================================
// ALERTS PAGE
// =============================================================================

interface Alert {
  id: string;
  severity: string;
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  status: string;
}

export const AlertsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from API on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setError(null);
        const response = await alertsApi.getAlerts({});
        if (response.success && response.data && Array.isArray(response.data)) {
          const mappedAlerts: Alert[] = response.data.map((a: any) => ({
            id: a.id,
            severity: (a.severity || 'info').toLowerCase(),
            title: a.title,
            message: a.message || a.description || '',
            source: a.source || 'System',
            timestamp: new Date(a.created_at || a.timestamp || Date.now()),
            status: (a.status || 'active').toLowerCase(),
          }));
          setAlerts(mappedAlerts);
          return;
        }

        setAlerts([]);
        setError(response.error?.message || 'Failed to load alerts');
      } catch (err) {
        setAlerts([]);
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a: Alert) => {
    if (filter !== 'all' && a.severity !== filter) {
      return false;
    }
    if (statusFilter !== 'all' && a.status !== statusFilter) {
      return false;
    }
    if (
      searchQuery &&
      !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.source.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const severityCounts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Alerts</h1>
          <p className="text-neutral-500">Monitor and manage system alerts</p>
        </div>
        <button
          onClick={() => {
            const ruleName = prompt('Enter alert rule name:');
            if (ruleName) {
              alert(
                `Alert rule "${ruleName}" created successfully!\n\nThis would configure automatic alerting based on your criteria.`
              );
            }
          }}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create Alert Rule
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => setFilter('all')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Total Active</p>
          <p className="text-2xl font-bold text-neutral-900">
            {alerts.filter((a) => a.status === 'active').length}
          </p>
        </div>
        <div
          onClick={() => setFilter('critical')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'critical'
              ? 'border-error-main bg-error-light'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Critical</p>
          <p className="text-2xl font-bold text-error-main">{severityCounts.critical}</p>
        </div>
        <div
          onClick={() => setFilter('warning')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'warning'
              ? 'border-warning-main bg-warning-light'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Warning</p>
          <p className="text-2xl font-bold text-warning-main">{severityCounts.warning}</p>
        </div>
        <div
          onClick={() => setFilter('info')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'info'
              ? 'border-info-main bg-info-light'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Info</p>
          <p className="text-2xl font-bold text-info-main">{severityCounts.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                statusFilter === status
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-auto w-64 h-9 px-3 border border-neutral-300 rounded-lg text-sm"
        />
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {error && (
          <div className="p-4 bg-warning-light border border-warning-main/30 rounded-xl text-warning-dark">
            {error}
          </div>
        )}
        {!isLoading && !error && filteredAlerts.length === 0 && (
          <div className="p-6 bg-white rounded-xl border border-neutral-200 text-neutral-600 text-center">
            No alerts found.
          </div>
        )}
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'bg-white rounded-xl border-l-4 p-4',
              alert.severity === 'critical' && 'border-l-error-main border border-neutral-200',
              alert.severity === 'warning' && 'border-l-warning-main border border-neutral-200',
              alert.severity === 'info' && 'border-l-info-main border border-neutral-200'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0',
                    alert.severity === 'critical' && 'bg-error-main',
                    alert.severity === 'warning' && 'bg-warning-main',
                    alert.severity === 'info' && 'bg-info-main'
                  )}
                />
                <div>
                  <h3 className="font-semibold text-neutral-900">{alert.title}</h3>
                  <p className="text-neutral-600 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-neutral-500">{alert.source}</span>
                    <span className="text-sm text-neutral-400">
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        alert.status === 'active' && 'bg-error-light text-error-dark',
                        alert.status === 'acknowledged' && 'bg-warning-light text-warning-dark',
                        alert.status === 'resolved' && 'bg-success-light text-success-dark'
                      )}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.status === 'active' && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLoadingAlertId(alert.id);
                      try {
                        await alertsApi.acknowledgeAlert(alert.id);
                        setAlerts((prev) =>
                          prev.map((a) =>
                            a.id === alert.id ? { ...a, status: 'acknowledged' } : a
                          )
                        );
                      } catch (err) {
                        console.error('Acknowledge failed:', err);
                        setError(err instanceof Error ? err.message : 'Acknowledge failed');
                      } finally {
                        setLoadingAlertId(null);
                      }
                    }}
                    disabled={loadingAlertId === alert.id}
                    className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAlertId === alert.id ? 'Acknowledging...' : 'Acknowledge'}
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLoadingAlertId(alert.id);
                      try {
                        await alertsApi.resolveAlert(alert.id, {
                          resolution: 'Resolved via dashboard',
                        });
                        setAlerts((prev) =>
                          prev.map((a) => (a.id === alert.id ? { ...a, status: 'resolved' } : a))
                        );
                      } catch (err) {
                        console.error('Resolve failed:', err);
                        setError(err instanceof Error ? err.message : 'Resolve failed');
                      } finally {
                        setLoadingAlertId(null);
                      }
                    }}
                    disabled={loadingAlertId === alert.id}
                    className="px-3 py-1.5 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAlertId === alert.id ? 'Resolving...' : 'Resolve'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Page Guide */}
      <PageGuide {...GUIDES.alerts} />
    </div>
  );
};

// =============================================================================
// METRICS PAGE
// =============================================================================

interface Metric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  category: string;
  target: string;
  progress: number;
}

const formatMetricValue = (value: number, unit: string): string => {
  if (unit === 'USD') {
    if (value >= 1000000) {return `$${(value / 1000000).toFixed(2)}M`;}
    if (value >= 1000) {return `$${(value / 1000).toFixed(1)}K`;}
    return `$${value.toLocaleString()}`;
  }
  if (unit === 'percent') {return `${value}%`;}
  if (unit === 'ms') {return `${value}ms`;}
  if (unit === 'count') {return value.toLocaleString();}
  return String(value);
};

export const MetricsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [category, setCategory] = useState<'all' | 'financial' | 'operational' | 'customer'>('all');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setError(null);
        const response = await metricsApi.getMetrics({});
        if (response.success && response.data && Array.isArray(response.data)) {
          const mappedMetrics: Metric[] = response.data.map((m: any) => {
            const currentValue = m.currentValue || m.latestValue || 0;
            const target = m.thresholds?.target || currentValue * 1.2;
            const change = m.change || m.dimensions?.change || 0;
            const progress = target > 0 ? Math.round((currentValue / target) * 100) : 0;
            return {
              id: m.id,
              name: m.name,
              value: formatMetricValue(currentValue, m.unit || ''),
              change,
              trend: change >= 0 ? ('up' as const) : ('down' as const),
              category: m.category || 'operational',
              target: formatMetricValue(target, m.unit || ''),
              progress: Math.min(progress, 100),
            };
          });
          setMetrics(mappedMetrics);
          return;
        }

        setMetrics([]);
        setError(response.error?.message || 'Failed to load metrics');
      } catch (err) {
        setMetrics([]);
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const filteredMetrics =
    category === 'all' ? metrics : metrics.filter((m) => m.category === category);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Metrics</h1>
          <p className="text-neutral-500">Key performance indicators and business metrics</p>
        </div>
        <button
          onClick={() => {
            const metricName = prompt('Enter metric name:');
            if (metricName) {
              alert(`Metric "${metricName}" would be created. Configure data source in Settings.`);
            }
          }}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Metric
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'financial', 'operational', 'customer'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                category === cat
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                timeRange === range
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-neutral-900">{metric.name}</h3>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full capitalize',
                    metric.category === 'financial' && 'bg-green-100 text-green-700',
                    metric.category === 'operational' && 'bg-blue-100 text-blue-700',
                    metric.category === 'customer' && 'bg-purple-100 text-purple-700'
                  )}
                >
                  {metric.category}
                </span>
              </div>
              <span
                className={cn(
                  'flex items-center text-sm font-medium',
                  metric.trend === 'up' && metric.change > 0
                    ? 'text-success-main'
                    : metric.trend === 'down' && metric.change < 0
                      ? 'text-success-main'
                      : 'text-error-main'
                )}
              >
                {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>

            <p className="text-3xl font-bold text-neutral-900 mb-4">{metric.value}</p>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-neutral-500">Target: {metric.target}</span>
                <span className="font-medium text-neutral-900">{metric.progress}%</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    metric.progress >= 90
                      ? 'bg-success-main'
                      : metric.progress >= 70
                        ? 'bg-warning-main'
                        : 'bg-error-main'
                  )}
                  style={{ width: `${Math.min(metric.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Page Guide */}
      <PageGuide {...GUIDES.metrics} />
    </div>
  );
};

export default AlertsPage;
