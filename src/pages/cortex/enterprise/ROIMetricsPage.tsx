// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CendiaROI™ DASHBOARD
// Real metrics to prove ROI claims with actual platform data
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface DeliberationMetrics {
  totalDeliberations: number;
  completedDeliberations: number;
  avgDurationMs: number;
  avgDurationMinutes: number;
  medianDurationMs: number;
  p95DurationMs: number;
  avgAgentCount: number;
  avgConfidence: number;
  consensusRate: number;
  dissentsRecorded: number;
}

interface AuditMetrics {
  totalPacketsGenerated: number;
  avgPacketGenerationMs: number;
  totalExports: number;
  avgExportSizeKb: number;
}

interface DecisionQualityMetrics {
  totalDecisions: number;
  decisionsWithDissent: number;
  dissentRate: number;
  reversalCount: number;
  reversalRate: number;
}

interface ComparisonMetrics {
  automated: { avgMinutes: number; count: number };
  manualEstimate: { avgMinutes: number; basis: string };
  timeSavingsPercent: number;
  hoursSavedPerMonth: number;
}

interface ROISummary {
  deliberation: DeliberationMetrics;
  audit: AuditMetrics;
  quality: DecisionQualityMetrics;
  period: { start: string; end: string; days: number };
  generatedAt: string;
}

// =============================================================================
// METRIC CARD COMPONENT
// =============================================================================

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}> = ({ label, value, subtext, trend, highlight }) => (
  <div className={cn(
    'bg-neutral-800/50 rounded-xl border p-5',
    highlight ? 'border-green-500/50' : 'border-neutral-700'
  )}>
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
    <p className={cn(
      'text-2xl font-bold font-mono',
      highlight ? 'text-green-400' : 'text-white'
    )}>
      {value}
    </p>
    {subtext && (
      <p className={cn(
        'text-xs mt-1',
        trend === 'up' ? 'text-green-400' : 
        trend === 'down' ? 'text-red-400' : 
        'text-neutral-500'
      )}>
        {trend === 'up' && '↑ '}
        {trend === 'down' && '↓ '}
        {subtext}
      </p>
    )}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ROIMetricsPage: React.FC = () => {
  const [summary, setSummary] = useState<ROISummary | null>(null);
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, comparisonRes] = await Promise.all([
          fetch(`/api/v1/roi-metrics/summary?days=${days}`),
          fetch('/api/v1/roi-metrics/comparison'),
        ]);

        if (!summaryRes.ok || !comparisonRes.ok) {
          throw new Error('Failed to load metrics');
        }

        const summaryData = await summaryRes.json();
        const comparisonData = await comparisonRes.json();

        if (summaryData.success) {setSummary(summaryData.data);}
        if (comparisonData.success) {setComparison(comparisonData.data);}
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [days]);

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const res = await fetch(`/api/v1/roi-metrics/export?format=${format}&days=${days}`);
      if (format === 'csv') {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roi-metrics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roi-metrics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-neutral-900 p-8 flex items-center justify-center">
        <div className="text-neutral-400">Loading ROI metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-neutral-900 p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Error loading metrics: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">CendiaROI™ Dashboard</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Real measurements from actual platform usage • Data you can share with prospects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white hover:bg-neutral-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white hover:bg-neutral-700"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Key ROI Highlights */}
        {comparison && (
          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📊 Provable ROI Metrics
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">REAL DATA</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Time Savings"
                value={`${comparison.timeSavingsPercent}%`}
                subtext="vs manual analysis"
                trend="up"
                highlight
              />
              <MetricCard
                label="Avg Decision Time"
                value={`${comparison.automated.avgMinutes} min`}
                subtext={`vs ${comparison.manualEstimate.avgMinutes} min manual`}
                trend="up"
                highlight
              />
              <MetricCard
                label="Hours Saved"
                value={comparison.hoursSavedPerMonth}
                subtext={`in last ${days} days`}
                trend="up"
                highlight
              />
              <MetricCard
                label="Decisions Processed"
                value={comparison.automated.count}
                subtext="automated deliberations"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              Manual estimate basis: {comparison.manualEstimate.basis}
            </p>
          </div>
        )}

        {/* Deliberation Metrics */}
        {summary && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">⚡ Decision Speed</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Total Deliberations"
                  value={summary.deliberation.totalDeliberations}
                />
                <MetricCard
                  label="Completed"
                  value={summary.deliberation.completedDeliberations}
                  subtext={`${Math.round(summary.deliberation.completedDeliberations / Math.max(1, summary.deliberation.totalDeliberations) * 100)}% completion rate`}
                />
                <MetricCard
                  label="Avg Duration"
                  value={`${summary.deliberation.avgDurationMinutes} min`}
                  subtext="per deliberation"
                />
                <MetricCard
                  label="P95 Duration"
                  value={`${Math.round(summary.deliberation.p95DurationMs / 60000 * 10) / 10} min`}
                  subtext="95th percentile"
                />
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">🎯 Decision Quality</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Avg Confidence"
                  value={`${Math.round(summary.deliberation.avgConfidence * 100)}%`}
                  subtext="model confidence"
                />
                <MetricCard
                  label="Consensus Rate"
                  value={`${summary.deliberation.consensusRate}%`}
                  subtext="high-confidence decisions"
                />
                <MetricCard
                  label="Avg Agents"
                  value={summary.deliberation.avgAgentCount.toFixed(1)}
                  subtext="per deliberation"
                />
                <MetricCard
                  label="Dissents Filed"
                  value={summary.deliberation.dissentsRecorded}
                  subtext="concerns captured"
                />
              </div>
            </div>

            {/* Audit Metrics */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">📋 Audit Readiness</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Audit Packets"
                  value={summary.audit.totalPacketsGenerated}
                  subtext="generated automatically"
                />
                <MetricCard
                  label="Packet Generation"
                  value={`${(summary.audit.avgPacketGenerationMs / 1000).toFixed(1)}s`}
                  subtext="avg generation time"
                />
                <MetricCard
                  label="Total Exports"
                  value={summary.audit.totalExports}
                  subtext="evidence downloads"
                />
                <MetricCard
                  label="Dissent Rate"
                  value={`${summary.quality.dissentRate}%`}
                  subtext="decisions with formal dissent"
                />
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4 text-center">
          <p className="text-xs text-neutral-500">
            These metrics are automatically calculated from actual platform usage data.
            Export this data to share with prospects as proof of ROI claims.
          </p>
          {summary && (
            <p className="text-xs text-neutral-600 mt-2">
              Period: {new Date(summary.period.start).toLocaleDateString()} - {new Date(summary.period.end).toLocaleDateString()} • 
              Generated: {new Date(summary.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROIMetricsPage;
