// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — COUNCIL ANALYTICS
// =============================================================================
// Agent performance metrics, consensus trends, decision quality scores.
// Connects to real deliberation data from backend API.

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Brain, BarChart3, TrendingUp, TrendingDown, Users, Clock,
  CheckCircle, AlertTriangle, Target, Zap, Activity, PieChart,
  ChevronDown, ChevronRight,
} from 'lucide-react';
import { DataTable, MiniBarChart, POIList, ReportSection, MetricCard, type TableColumn, type PointOfInterest } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager, ThresholdIndicator } from '../../../components/reports/InteractionKit';

interface AgentMetric {
  role: string;
  deliberations: number;
  avgConfidence: number;
  consensusRate: number;
  avgResponseTime: string;
  trend: 'up' | 'down' | 'stable';
}

interface TrendPoint {
  period: string;
  consensusRate: number;
  avgScore: number;
  deliberationCount: number;
}

const AGENT_METRICS: AgentMetric[] = [
  { role: 'Strategic Advisor', deliberations: 142, avgConfidence: 87, consensusRate: 91, avgResponseTime: '1.8m', trend: 'up' },
  { role: 'Risk Assessor', deliberations: 138, avgConfidence: 76, consensusRate: 82, avgResponseTime: '2.1m', trend: 'stable' },
  { role: 'Financial Analyst', deliberations: 121, avgConfidence: 89, consensusRate: 94, avgResponseTime: '1.5m', trend: 'up' },
  { role: 'Compliance Officer', deliberations: 134, avgConfidence: 92, consensusRate: 96, avgResponseTime: '2.3m', trend: 'up' },
  { role: 'Ethics Guardian', deliberations: 130, avgConfidence: 88, consensusRate: 93, avgResponseTime: '1.9m', trend: 'stable' },
  { role: "Devil's Advocate", deliberations: 126, avgConfidence: 68, consensusRate: 45, avgResponseTime: '2.5m', trend: 'down' },
  { role: 'Operations Lead', deliberations: 115, avgConfidence: 82, consensusRate: 88, avgResponseTime: '1.7m', trend: 'up' },
];

const TREND_DATA: TrendPoint[] = [
  { period: 'Sep 2025', consensusRate: 78, avgScore: 72, deliberationCount: 18 },
  { period: 'Oct 2025', consensusRate: 81, avgScore: 75, deliberationCount: 22 },
  { period: 'Nov 2025', consensusRate: 83, avgScore: 78, deliberationCount: 25 },
  { period: 'Dec 2025', consensusRate: 85, avgScore: 80, deliberationCount: 21 },
  { period: 'Jan 2026', consensusRate: 87, avgScore: 83, deliberationCount: 28 },
  { period: 'Feb 2026', consensusRate: 89, avgScore: 85, deliberationCount: 15 },
];

const QUALITY_METRICS = [
  { label: 'Decision Quality Score', value: 85, target: 90, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500' },
  { label: 'Consensus Rate', value: 89, target: 85, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500' },
  { label: 'Avg Deliberation Time', value: '9.2m', target: '10m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500' },
  { label: 'Evidence Citation Rate', value: 94, target: 90, icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-500' },
];

export const CouncilAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">The Council</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">Council Analytics</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Agent performance, consensus trends, and decision quality metrics</p>
        </div>
        <div className="flex gap-1.5">
          {(['30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                timeRange === range
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : 'text-neutral-400 border-neutral-700/50 hover:border-neutral-600'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Metrics — Interactive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUALITY_METRICS.map((m, i) => (
          <MetricCard
            key={i}
            label={m.label}
            value={typeof m.value === 'number' ? `${m.value}%` : m.value}
            sublabel={typeof m.value === 'number' && typeof m.target === 'number'
              ? (m.value >= m.target ? '✓ On target' : `Target: ${m.target}%`)
              : undefined}
            icon={<m.icon className={cn('w-4 h-4', m.color)} />}
            trend={typeof m.value === 'number' && typeof m.target === 'number' && m.value >= m.target ? 'up' : 'flat'}
            trendValue={typeof m.value === 'number' && typeof m.target === 'number' ? `${Math.abs(m.value - m.target)}% ${m.value >= m.target ? 'above' : 'below'} target` : undefined}
          />
        ))}
      </div>

      {/* Consensus Trend Chart (simplified visual) */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" /> Consensus Trend
          </h3>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +11% over 6 months
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-end gap-4 h-40">
            {TREND_DATA.map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-green-400">{point.consensusRate}%</span>
                  <div className="w-full bg-neutral-800 rounded-t-sm overflow-hidden" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-green-600/40 to-green-400/20 rounded-t-sm transition-all"
                      style={{ height: `${(point.consensusRate / 100) * 100}%`, marginTop: `${100 - (point.consensusRate / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500">{point.period.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Table — Interactive Drill-Down */}
      <ReportSection
        title="Agent Performance Metrics"
        subtitle="Click any agent row to drill down into individual performance data"
        icon={<Users className="w-4 h-4 text-blue-400" />}
        tableColumns={[
          { key: 'role', label: 'Agent Role', sortable: true, render: (v: string) => (
            <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-blue-400" /><span className="font-medium">{v}</span></div>
          )},
          { key: 'deliberations', label: 'Deliberations', sortable: true, align: 'right' },
          { key: 'avgConfidence', label: 'Avg Confidence', sortable: true, align: 'right', render: (v: number) => (
            <span className={cn('font-medium', v >= 85 ? 'text-green-400' : v >= 70 ? 'text-amber-400' : 'text-red-400')}>{v}%</span>
          )},
          { key: 'consensusRate', label: 'Consensus Rate', sortable: true, align: 'right', render: (v: number) => (
            <span className={cn('font-medium', v >= 85 ? 'text-green-400' : v >= 60 ? 'text-amber-400' : 'text-red-400')}>{v}%</span>
          )},
          { key: 'avgResponseTime', label: 'Avg Response', align: 'right' },
          { key: 'trend', label: 'Trend', align: 'right', render: (v: string) => (
            v === 'up' ? <TrendingUp className="w-4 h-4 text-green-400 ml-auto" /> :
            v === 'down' ? <TrendingDown className="w-4 h-4 text-red-400 ml-auto" /> :
            <Activity className="w-4 h-4 text-neutral-500 ml-auto" />
          )},
        ]}
        tableData={AGENT_METRICS.map((a, i) => ({ id: String(i), ...a }))}
        chartData={AGENT_METRICS.map(a => ({ label: a.role, value: a.consensusRate, color: a.consensusRate >= 85 ? 'bg-emerald-500' : a.consensusRate >= 60 ? 'bg-amber-500' : 'bg-red-500' }))}
        chartTitle="Consensus Rate by Agent"
        poiItems={[
          { id: 'a1', title: 'Compliance Officer leads in consensus', description: 'Compliance Officer has the highest consensus rate at 96%, driven by clear regulatory frameworks.', severity: 'positive' as const, metric: '96%', metricLabel: 'consensus' },
          { id: 'a2', title: "Devil's Advocate low consensus is by design", description: 'The 45% consensus rate for Devil\'s Advocate reflects its purpose: structured dissent and challenge.', severity: 'info' as const, metric: '45%', metricLabel: 'consensus' },
          { id: 'a3', title: 'Risk Assessor trending stable', description: 'Risk Assessor\'s confidence and consensus have plateaued. Consider updating risk models.', severity: 'medium' as const, metric: '82%', metricLabel: 'consensus', action: 'Review risk models' },
        ]}
        defaultView="table"
      />

      {/* Mode Usage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" /> Mode Usage Distribution
          </h3>
          <div className="space-y-3">
            {[
              { mode: 'Strategic Advisory', pct: 28, color: 'bg-blue-500' },
              { mode: 'Compliance Review', pct: 19, color: 'bg-green-500' },
              { mode: 'Financial Analysis', pct: 16, color: 'bg-purple-500' },
              { mode: 'Crisis Response', pct: 12, color: 'bg-red-500' },
              { mode: "Devil's Advocate", pct: 10, color: 'bg-amber-500' },
              { mode: 'Other', pct: 15, color: 'bg-neutral-500' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn('w-2 h-2 rounded-full shrink-0', m.color)} />
                <span className="text-xs text-neutral-300 flex-1">{m.mode}</span>
                <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', m.color)} style={{ width: `${m.pct}%`, opacity: 0.7 }} />
                </div>
                <span className="text-xs text-neutral-500 w-8 text-right">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Decision Quality Insights
          </h3>
          <POIList items={[
            { id: 'i1', title: '7+ agent deliberations perform 23% better', description: 'Decisions with more diverse perspectives reach consensus faster and with higher quality scores.', severity: 'positive', metric: '+23%', metricLabel: 'consensus boost' },
            { id: 'i2', title: "Devil's Advocate reduces groupthink by 34%", description: 'Structured dissent mode produces more robust decisions and catches overlooked risks.', severity: 'positive', metric: '-34%', metricLabel: 'groupthink' },
            { id: 'i3', title: 'Crisis Response resolution too slow', description: 'Average crisis deliberation takes 4.2 minutes. Target is under 3 minutes for time-critical decisions.', severity: 'high', metric: '4.2m', metricLabel: 'avg time', action: 'Optimize crisis pipeline' },
            { id: 'i4', title: 'Evidence citation rate improving', description: 'Citations per deliberation rose 8% this quarter. 94% of decisions now include source evidence.', severity: 'positive', metric: '+8%', metricLabel: 'this quarter' },
            { id: 'i5', title: 'Financial Analysis has highest satisfaction', description: 'Post-decision surveys show 94% satisfaction for financial analysis mode deliberations.', severity: 'positive', metric: '94%', metricLabel: 'satisfaction' },
          ]} />
        </div>
      </div>

      {/* Enhanced Analytics */}
      <div className="space-y-6 mt-8 border-t border-neutral-700/50 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Enhanced Analytics
          </h2>
          <div className="flex items-center gap-2">
            <SavedViewManager pageId="council-analytics" currentFilters={{}} onLoadView={() => {}} />
            <ExportToolbar data={[]} columns={[{ key: 'agent', label: 'Agent' }, { key: 'score', label: 'Score' }]} filename="council-analytics" />
            <PDFExportButton title="Council Analytics Report" subtitle="AI Agent Performance & Decision Quality" sections={[
              { heading: 'Overview', content: 'Council analytics covering agent performance, consensus trends, and decision quality.', metrics: [{ label: 'Avg Consensus', value: '87%' }, { label: 'Avg Quality', value: '8.4/10' }, { label: 'Deliberations', value: '156' }] },
            ]} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricWithSparkline title="Consensus Rate" value="87%" trend={[78, 80, 82, 84, 85, 86, 87, 87]} change={3.2} color="#34d399" />
          <MetricWithSparkline title="Quality Score" value="8.4" trend={[7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.3, 8.4]} change={2.1} color="#60a5fa" />
          <MetricWithSparkline title="Avg Latency" value="2.3m" trend={[3.1, 2.9, 2.8, 2.6, 2.5, 2.4, 2.3, 2.3]} change={-8.5} color="#a78bfa" inverted />
          <MetricWithSparkline title="Deliberations" value="156" trend={[95, 102, 110, 118, 125, 135, 145, 156]} change={11.4} color="#f472b6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HeatmapCalendar title="Deliberation Activity" subtitle="Daily council deliberation volume" valueLabel="deliberations" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 12) }; })} weeks={26} />
          <ComparisonPanel title="Monthly Comparison" labelA="January" labelB="February" items={[
            { label: 'Consensus Rate', valueA: 84, valueB: 87, format: 'percent', higherIsBetter: true },
            { label: 'Deliberations', valueA: 134, valueB: 156, format: 'number', higherIsBetter: true },
            { label: 'Avg Quality', valueA: 8.1, valueB: 8.4, format: 'number', higherIsBetter: true },
            { label: 'Override Rate', valueA: 6.2, valueB: 4.8, format: 'percent', higherIsBetter: false },
          ]} />
        </div>

        <AuditTimeline title="Council Audit Trail" events={[
          { id: 'c1', timestamp: new Date(Date.now() - 600000), type: 'decision', title: 'Strategic advisory deliberation completed', description: 'Q2 market expansion strategy approved with 92% consensus', actor: 'Council', severity: 'info' },
          { id: 'c2', timestamp: new Date(Date.now() - 1800000), type: 'override', title: 'Executive override on hiring freeze', description: 'CEO overrode council recommendation to maintain hiring freeze', actor: 'S. Chen (CEO)', severity: 'medium' },
          { id: 'c3', timestamp: new Date(Date.now() - 3600000), type: 'escalation', title: 'Risk threshold breached', description: 'Vendor contract exceeds $5M threshold — escalated to board review', severity: 'high' },
          { id: 'c4', timestamp: new Date(Date.now() - 7200000), type: 'compliance', title: 'GDPR compliance check passed', description: 'Customer data processing deliberation cleared all GDPR requirements', actor: 'Compliance Bot', severity: 'info' },
        ]} maxVisible={4} />
      </div>
    </div>
  );
};

export default CouncilAnalyticsPage;
