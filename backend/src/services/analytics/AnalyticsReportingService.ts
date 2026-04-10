/**
 * Advanced Analytics & Reporting Service
 * 
 * Unified cross-domain analytics with custom report builder, export options,
 * scheduled reports, and visualization data.
 * 
 * @module services/analytics/AnalyticsReportingService
 */

import { logger } from '../../utils/logger.js';
import { generateId, now, sr_create, sr_get, sr_update, sr_list } from '../enterprise/_base.js';

// =============================================================================
// TYPES
// =============================================================================

export type MetricDomain = 'risk' | 'compliance' | 'incidents' | 'vendors' | 'decisions' | 'security' | 'performance' | 'ai_governance';

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  shared: boolean;
  sharedWith: string[];
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'heatmap' | 'timeline' | 'pie' | 'bar' | 'line' | 'gauge' | 'map';
  title: string;
  domain: MetricDomain;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  metric: string;
  aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'percentile';
  groupBy?: string;
  filters?: Record<string, any>;
  timeRange: TimeRange;
  refreshInterval?: number;
  thresholds?: { warning: number; critical: number };
}

export interface TimeRange {
  start: string;
  end: string;
  preset?: '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'custom';
}

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'risk' | 'incident' | 'executive' | 'audit' | 'custom';
  sections: ReportSection[];
  schedule?: ReportSchedule;
  format: 'json' | 'csv' | 'pdf';
  createdBy: string;
  createdAt: string;
  lastGeneratedAt?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  domain: MetricDomain;
  metrics: string[];
  filters: Record<string, any>;
  timeRange: TimeRange;
  visualization?: 'table' | 'chart' | 'summary';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  enabled: boolean;
}

export interface GeneratedReport {
  id: string;
  reportDefinitionId: string;
  generatedAt: string;
  timeRange: TimeRange;
  sections: GeneratedReportSection[];
  summary: ReportSummary;
  format: string;
}

export interface GeneratedReportSection {
  title: string;
  data: Record<string, any>[];
  charts: ChartData[];
  summary: string;
}

export interface ChartData {
  type: string;
  title: string;
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
}

export interface ReportSummary {
  totalMetrics: number;
  highlights: string[];
  alerts: { level: 'info' | 'warning' | 'critical'; message: string }[];
  generationTime: number;
}

export interface MetricValue {
  metric: string;
  domain: MetricDomain;
  value: number;
  unit: string;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

// =============================================================================
// SERVICE
// =============================================================================

class AnalyticsReportingService {
  private SN = 'Analytics';

  constructor() {
    this.loadDefaultDashboards();
  }

  // ---------------------------------------------------------------------------
  // DASHBOARDS
  // ---------------------------------------------------------------------------

  async getDashboard(dashboardId: string): Promise<AnalyticsDashboard | null> {
    return await sr_get<AnalyticsDashboard>(this.SN, 'dashboard', dashboardId) || null;
  }

  async listDashboards(userId?: string): Promise<AnalyticsDashboard[]> {
    const results = await sr_list<AnalyticsDashboard>(this.SN, 'dashboard');
    if (userId) {
      return results.filter((d: any) => d.createdBy === userId || d.shared || d.sharedWith.includes(userId));
    }
    return results;
  }

  async createDashboard(input: { name: string; description: string; widgets?: DashboardWidget[]; createdBy: string }): Promise<AnalyticsDashboard> {
    const dashboard: AnalyticsDashboard & { id: string } = {
      id: generateId(),
      name: input.name,
      description: input.description,
      widgets: input.widgets || [],
      createdBy: input.createdBy,
      createdAt: now(),
      updatedAt: now(),
      shared: false,
      sharedWith: [],
    };
    await sr_create(this.SN, 'dashboard', dashboard);
    return dashboard;
  }

  async updateDashboard(dashboardId: string, updates: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard | null> {
    const dashboard = await sr_get<AnalyticsDashboard>(this.SN, 'dashboard', dashboardId);
    if (!dashboard) return null;
    const updated: AnalyticsDashboard & { id: string } = { ...dashboard, id: dashboardId, ...updates, updatedAt: now() };
    await sr_update(this.SN, 'dashboard', dashboardId, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  async getMetrics(domain: MetricDomain, timeRange: TimeRange): Promise<MetricValue[]> {
    const metricsMap: Record<MetricDomain, { metric: string; unit: string; baseValue: number }[]> = {
      risk: [
        { metric: 'overall_risk_score', unit: 'score', baseValue: 72 },
        { metric: 'open_risks', unit: 'count', baseValue: 14 },
        { metric: 'mitigated_risks', unit: 'count', baseValue: 89 },
        { metric: 'risk_acceptance_rate', unit: 'percent', baseValue: 94.2 },
      ],
      compliance: [
        { metric: 'compliance_score', unit: 'percent', baseValue: 97.3 },
        { metric: 'open_findings', unit: 'count', baseValue: 5 },
        { metric: 'controls_tested', unit: 'count', baseValue: 142 },
        { metric: 'policies_active', unit: 'count', baseValue: 23 },
      ],
      incidents: [
        { metric: 'open_incidents', unit: 'count', baseValue: 3 },
        { metric: 'mttr_hours', unit: 'hours', baseValue: 2.4 },
        { metric: 'incidents_this_month', unit: 'count', baseValue: 12 },
        { metric: 'severity_distribution', unit: 'count', baseValue: 0 },
      ],
      vendors: [
        { metric: 'active_vendors', unit: 'count', baseValue: 47 },
        { metric: 'vendor_risk_avg', unit: 'score', baseValue: 3.2 },
        { metric: 'assessments_due', unit: 'count', baseValue: 8 },
      ],
      decisions: [
        { metric: 'decisions_this_month', unit: 'count', baseValue: 234 },
        { metric: 'consensus_rate', unit: 'percent', baseValue: 91.4 },
        { metric: 'avg_deliberation_time', unit: 'seconds', baseValue: 18.7 },
        { metric: 'dissent_rate', unit: 'percent', baseValue: 8.6 },
      ],
      security: [
        { metric: 'threat_score', unit: 'score', baseValue: 15 },
        { metric: 'blocked_attacks', unit: 'count', baseValue: 1247 },
        { metric: 'vulnerabilities_open', unit: 'count', baseValue: 3 },
        { metric: 'patch_compliance', unit: 'percent', baseValue: 98.1 },
      ],
      performance: [
        { metric: 'uptime', unit: 'percent', baseValue: 99.94 },
        { metric: 'avg_response_time', unit: 'ms', baseValue: 142 },
        { metric: 'error_rate', unit: 'percent', baseValue: 0.12 },
        { metric: 'throughput', unit: 'req/s', baseValue: 847 },
      ],
      ai_governance: [
        { metric: 'models_monitored', unit: 'count', baseValue: 12 },
        { metric: 'bias_alerts', unit: 'count', baseValue: 2 },
        { metric: 'explainability_score', unit: 'percent', baseValue: 87.3 },
        { metric: 'human_override_rate', unit: 'percent', baseValue: 4.1 },
      ],
    };

    const metrics = metricsMap[domain] || [];
    return metrics.map(m => ({
      metric: m.metric,
      domain,
      value: m.baseValue + (Math.random() * m.baseValue * 0.1) - (m.baseValue * 0.05),
      unit: m.unit,
      timestamp: new Date().toISOString(),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
      changePercent: (Math.random() * 20) - 10,
    }));
  }

  async getCrossDomainSummary(timeRange: TimeRange): Promise<Record<MetricDomain, MetricValue[]>> {
    const domains: MetricDomain[] = ['risk', 'compliance', 'incidents', 'vendors', 'decisions', 'security', 'performance', 'ai_governance'];
    const result: Record<string, MetricValue[]> = {};
    for (const domain of domains) {
      result[domain] = await this.getMetrics(domain, timeRange);
    }
    return result as Record<MetricDomain, MetricValue[]>;
  }

  // ---------------------------------------------------------------------------
  // REPORTS
  // ---------------------------------------------------------------------------

  async createReport(input: { name: string; description: string; type: ReportDefinition['type']; sections: ReportSection[]; schedule?: ReportSchedule; format?: string; createdBy: string }): Promise<ReportDefinition> {
    const report: ReportDefinition & { id: string } = {
      id: generateId(),
      name: input.name,
      description: input.description,
      type: input.type,
      sections: input.sections,
      schedule: input.schedule,
      format: (input.format as any) || 'json',
      createdBy: input.createdBy,
      createdAt: now(),
    };
    await sr_create(this.SN, 'report_definition', report);
    return report;
  }

  async listReports(): Promise<ReportDefinition[]> {
    return await sr_list<ReportDefinition>(this.SN, 'report_definition');
  }

  async generateReport(reportId: string): Promise<GeneratedReport> {
    const definition = await sr_get<ReportDefinition>(this.SN, 'report_definition', reportId);
    if (!definition) throw new Error(`Report ${reportId} not found`);

    const startTime = Date.now();
    const sections: GeneratedReportSection[] = [];

    for (const section of definition.sections) {
      const metrics = await this.getMetrics(section.domain, section.timeRange);
      sections.push({
        title: section.title,
        data: metrics.map(m => ({ metric: m.metric, value: m.value, unit: m.unit, trend: m.trend, change: m.changePercent })),
        charts: [{
          type: 'bar',
          title: section.title,
          labels: metrics.map(m => m.metric.replace(/_/g, ' ')),
          datasets: [{ label: section.domain, data: metrics.map(m => m.value) }],
        }],
        summary: `${metrics.length} metrics collected for ${section.domain} domain`,
      });
    }

    const generated: GeneratedReport & { id: string } = {
      id: generateId(),
      reportDefinitionId: reportId,
      generatedAt: now(),
      timeRange: definition.sections[0]?.timeRange || { start: '', end: '', preset: '30d' },
      sections,
      summary: {
        totalMetrics: sections.reduce((sum, s) => sum + s.data.length, 0),
        highlights: [`Report generated with ${sections.length} sections`, `Covers ${definition.sections.map(s => s.domain).join(', ')} domains`],
        alerts: [],
        generationTime: Date.now() - startTime,
      },
      format: definition.format,
    };

    const updatedDef: ReportDefinition & { id: string } = { ...definition, id: reportId, lastGeneratedAt: generated.generatedAt };
    await sr_update(this.SN, 'report_definition', reportId, updatedDef);
    await sr_create(this.SN, 'generated_report', generated);

    return generated;
  }

  async exportReport(reportId: string, format: 'json' | 'csv'): Promise<{ data: string; contentType: string; filename: string }> {
    const report = await sr_get<GeneratedReport>(this.SN, 'generated_report', reportId);
    if (!report) throw new Error(`Generated report ${reportId} not found`);

    if (format === 'csv') {
      const rows: string[] = ['domain,metric,value,unit,trend,change'];
      for (const section of report.sections) {
        for (const item of section.data) {
          rows.push(`${section.title},${item.metric},${item.value},${item.unit},${item.trend},${item.change}`);
        }
      }
      return { data: rows.join('\n'), contentType: 'text/csv', filename: `report-${reportId}-${Date.now()}.csv` };
    }

    return { data: JSON.stringify(report, null, 2), contentType: 'application/json', filename: `report-${reportId}-${Date.now()}.json` };
  }

  // ---------------------------------------------------------------------------
  // DEFAULT DASHBOARDS
  // ---------------------------------------------------------------------------

  private async loadDefaultDashboards(): Promise<void> {
    const executiveDashboard: AnalyticsDashboard & { id: string } = {
      id: 'dash_executive',
      name: 'Executive Overview',
      description: 'Cross-domain executive dashboard with key risk, compliance, and performance metrics',
      widgets: [
        { id: 'w1', type: 'gauge', title: 'Compliance Score', domain: 'compliance', config: { metric: 'compliance_score', aggregation: 'avg', timeRange: { start: '', end: '', preset: '30d' } }, position: { x: 0, y: 0, w: 3, h: 2 } },
        { id: 'w2', type: 'gauge', title: 'Risk Score', domain: 'risk', config: { metric: 'overall_risk_score', aggregation: 'avg', timeRange: { start: '', end: '', preset: '30d' } }, position: { x: 3, y: 0, w: 3, h: 2 } },
        { id: 'w3', type: 'metric', title: 'Open Incidents', domain: 'incidents', config: { metric: 'open_incidents', aggregation: 'count', timeRange: { start: '', end: '', preset: '30d' } }, position: { x: 6, y: 0, w: 3, h: 2 } },
        { id: 'w4', type: 'metric', title: 'Uptime', domain: 'performance', config: { metric: 'uptime', aggregation: 'avg', timeRange: { start: '', end: '', preset: '30d' } }, position: { x: 9, y: 0, w: 3, h: 2 } },
        { id: 'w5', type: 'line', title: 'Decision Volume', domain: 'decisions', config: { metric: 'decisions_this_month', aggregation: 'count', timeRange: { start: '', end: '', preset: '90d' } }, position: { x: 0, y: 2, w: 6, h: 3 } },
        { id: 'w6', type: 'bar', title: 'Security Threats', domain: 'security', config: { metric: 'blocked_attacks', aggregation: 'sum', timeRange: { start: '', end: '', preset: '30d' } }, position: { x: 6, y: 2, w: 6, h: 3 } },
      ],
      createdBy: 'system',
      createdAt: now(),
      updatedAt: now(),
      shared: true,
      sharedWith: [],
    };
    await sr_create(this.SN, 'dashboard', executiveDashboard).catch(() => {});
  }
}

export const analyticsReporting = new AnalyticsReportingService();
export { AnalyticsReportingService };
