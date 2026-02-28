// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL MODE ANALYTICS DASHBOARD - Admin Analytics Page
// =============================================================================

import { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Download,
  Loader2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { COUNCIL_MODES } from '../../data/councilModes';
import { api } from '../../lib/api/client';

interface ModeAnalyticsData {
  summary: {
    totalDeliberations: number;
    totalDecisions: number;
    avgTimeToDecision: string;
    avgConfidence: number;
  };
  byMode: Record<string, { count: number; avgConfidence: number; avgTime: string }>;
  recentActivity: Array<{ mode: string; question: string; confidence: number; timestamp: string }>;
  topUsers: Array<{ name: string; count: number }>;
}

export default function ModeAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ModeAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<{ data: ModeAnalyticsData }>('/admin/mode-analytics');
        if (res.success && res.data) {
          setAnalytics((res.data as any).data || res.data);
        }
      } catch (error) {
        console.error('Failed to load mode analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [selectedPeriod]);

  const sortedModes = useMemo(() => {
    if (!analytics?.byMode) {return [];}
    return Object.entries(analytics.byMode)
      .map(([id, data]) => ({ id, ...data, mode: COUNCIL_MODES[id] }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);

  const maxCount = Math.max(...sortedModes.map((m) => m.count), 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Council Mode Analytics</h1>
          <p className="text-gray-400">Track usage patterns and decision effectiveness</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Deliberations',
            value: (analytics?.summary.totalDeliberations || 0).toLocaleString(),
            icon: BarChart3,
            color: 'text-blue-400',
          },
          {
            label: 'Decisions Made',
            value: (analytics?.summary.totalDecisions || 0).toLocaleString(),
            icon: Target,
            color: 'text-emerald-400',
          },
          {
            label: 'Avg Time to Decision',
            value: analytics?.summary.avgTimeToDecision || '0m',
            icon: Clock,
            color: 'text-amber-400',
          },
          {
            label: 'Avg Confidence',
            value: `${analytics?.summary.avgConfidence || 0}%`,
            icon: TrendingUp,
            color: 'text-purple-400',
          },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Mode Usage Chart */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mode Usage Distribution</h3>
          <div className="space-y-3">
            {sortedModes.map(({ id, count, avgConfidence, mode }) => (
              <div
                key={id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                  selectedMode === id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                )}
                onClick={() => setSelectedMode(selectedMode === id ? null : id)}
              >
                <span className="text-2xl w-10">{mode?.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{mode?.name}</span>
                    <span className="text-sm text-gray-400">{count} uses</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: mode?.color,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div
                    className={cn(
                      'font-medium',
                      avgConfidence >= 80
                        ? 'text-emerald-400'
                        : avgConfidence >= 60
                          ? 'text-amber-400'
                          : 'text-red-400'
                    )}
                  >
                    {avgConfidence}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Teams</h3>
            <div className="space-y-3">
              {(analytics?.topUsers || []).map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">
                      {i + 1}
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{user.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {(analytics?.recentActivity || []).map((activity, i) => {
                const mode = COUNCIL_MODES[activity.mode];
                return (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-lg">{mode?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{activity.question}</div>
                      <div className="text-gray-500">{new Date(activity.timestamp).toLocaleString()}</div>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        activity.confidence >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {activity.confidence}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
