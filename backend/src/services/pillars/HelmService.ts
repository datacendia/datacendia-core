// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - THE HELM SERVICE
// Command & Control - Single source of truth for organizational metrics
// Enterprise Platinum Intelligence - PostgreSQL Persistent Storage
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { v4 as uuidv4 } from 'uuid';
import { recordChronosEvent } from '../ChronosEventBus.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type MetricCategory = 'financial' | 'operational' | 'customer' | 'people' | 'strategic' | 'compliance';
export type MetricStatus = 'on_target' | 'at_risk' | 'critical' | 'exceeded' | 'not_set';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface Metric {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: MetricCategory;
  currentValue: number;
  targetValue: number;
  previousValue?: number;
  unit: string;
  status: MetricStatus;
  trend: TrendDirection;
  changePercent: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  source: string;
  lastUpdated: Date;
  refreshInterval: number;
  history?: MetricDataPoint[];
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
}

export interface KPIDashboard {
  organizationId: string;
  totalMetrics: number;
  onTarget: number;
  atRisk: number;
  critical: number;
  exceeded: number;
  overallHealth: number;
  categories: CategorySummary[];
  topMetrics: Metric[];
  alerts: MetricAlert[];
  lastRefresh: Date;
}

export interface CategorySummary {
  category: MetricCategory;
  totalMetrics: number;
  avgPerformance: number;
  trend: TrendDirection;
  status: MetricStatus;
}

export interface MetricAlert {
  id: string;
  organizationId: string;
  metricId: string;
  metricName: string;
  severity: 'warning' | 'critical';
  message: string;
  triggeredAt: Date;
  acknowledged: boolean;
}

// =============================================================================
// THE HELM SERVICE - PRISMA BACKED
// =============================================================================

export class HelmService extends BaseService {
  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'helm-service',
      version: '2.0.0',
      dependencies: ['prisma'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Helm service initializing with PostgreSQL...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Helm service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const count = await prisma.metric_definitions.count();
    const alertCount = await prisma.alerts.count({ where: { acknowledged_at: null } });
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { totalMetrics: count, totalAlerts: alertCount },
    };
  }

  // ===========================================================================
  // METRIC MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async createMetric(data: {
    organizationId: string;
    name: string;
    code: string;
    description?: string;
    category: MetricCategory;
    targetValue: number;
    unit?: string;
    source?: string;
    warningThreshold?: number;
    criticalThreshold?: number;
    refreshInterval?: number;
  }): Promise<Metric> {
    const id = uuidv4();
    const thresholds = {
      warning: data.warningThreshold,
      critical: data.criticalThreshold,
      target: data.targetValue,
    };

    await prisma.metric_definitions.create({
      data: {
        id,
        organization_id: data.organizationId,
        name: data.name,
        code: data.code,
        description: data.description || '',
        formula: { type: 'direct', source: data.source || 'manual' },
        unit: data.unit || '',
        category: data.category,
        thresholds,
        refresh_schedule: data.refreshInterval ? `${data.refreshInterval}s` : '3600s',
        updated_at: new Date(),
      },
    });

    return this.getMetric(id) as Promise<Metric>;
  }

  async updateMetricValue(metricId: string, newValue: number): Promise<Metric | null> {
    const metricDef = await prisma.metric_definitions.findUnique({
      where: { id: metricId },
    });

    if (!metricDef) return null;

    // Record the new value
    await prisma.metric_values.create({
      data: {
        id: uuidv4(),
        metric_id: metricId,
        value: newValue,
        dimensions: {},
        timestamp: new Date(),
      },
    });

    // Check for alerts
    const metric = await this.getMetric(metricId);
    if (metric) {
      await this.checkMetricAlerts(metric);
    }

    return metric;
  }

  async getMetric(metricId: string): Promise<Metric | null> {
    const metricDef = await prisma.metric_definitions.findUnique({
      where: { id: metricId },
    });

    if (!metricDef) return null;

    // Fetch recent values separately
    const recentValues = await prisma.metric_values.findMany({
      where: { metric_id: metricId },
      orderBy: { timestamp: 'desc' },
      take: 2,
    });

    return this.mapToMetric(metricDef, recentValues);
  }

  async getOrgMetrics(organizationId: string, category?: MetricCategory): Promise<Metric[]> {
    const where: any = { organization_id: organizationId };
    if (category) where.category = category;

    const metricDefs = await prisma.metric_definitions.findMany({ where });

    // Fetch recent values for all metrics
    const metrics: Metric[] = [];
    for (const def of metricDefs) {
      const recentValues = await prisma.metric_values.findMany({
        where: { metric_id: def.id },
        orderBy: { timestamp: 'desc' },
        take: 2,
      });
      metrics.push(this.mapToMetric(def, recentValues));
    }

    return metrics;
  }

  async getMetricHistory(metricId: string, days: number = 30): Promise<MetricDataPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const values = await prisma.metric_values.findMany({
      where: {
        metric_id: metricId,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
    });

    return values.map((v: any) => ({
      timestamp: v.timestamp,
      value: v.value,
    }));
  }

  // ===========================================================================
  // DASHBOARD - REAL DATA FROM POSTGRESQL
  // ===========================================================================

  async getKPIDashboard(organizationId: string): Promise<KPIDashboard> {
    const metrics = await this.getOrgMetrics(organizationId);
    
    const onTarget = metrics.filter(m => m.status === 'on_target' || m.status === 'exceeded').length;
    const atRisk = metrics.filter(m => m.status === 'at_risk').length;
    const critical = metrics.filter(m => m.status === 'critical').length;
    const exceeded = metrics.filter(m => m.status === 'exceeded').length;

    const healthScore = metrics.length > 0
      ? Math.round((onTarget / metrics.length) * 100)
      : 0;

    const categories: MetricCategory[] = ['financial', 'operational', 'customer', 'people', 'strategic', 'compliance'];
    const categorySummaries: CategorySummary[] = categories.map(cat => {
      const catMetrics = metrics.filter(m => m.category === cat);
      const avgPerf = catMetrics.length > 0
        ? catMetrics.reduce((sum, m) => sum + (m.currentValue / m.targetValue) * 100, 0) / catMetrics.length
        : 0;

      return {
        category: cat,
        totalMetrics: catMetrics.length,
        avgPerformance: Math.round(avgPerf),
        trend: avgPerf > 100 ? 'up' as TrendDirection : avgPerf < 90 ? 'down' as TrendDirection : 'stable' as TrendDirection,
        status: catMetrics.some(m => m.status === 'critical') ? 'critical' as MetricStatus : 
                catMetrics.some(m => m.status === 'at_risk') ? 'at_risk' as MetricStatus : 'on_target' as MetricStatus,
      };
    });

    const alerts = await this.getActiveAlerts(organizationId);

    const topMetrics = [...metrics]
      .sort((a, b) => {
        if (a.status === 'critical' && b.status !== 'critical') return -1;
        if (a.status !== 'critical' && b.status === 'critical') return 1;
        if (a.status === 'at_risk' && b.status !== 'at_risk') return -1;
        return 0;
      })
      .slice(0, 10);

    return {
      organizationId,
      totalMetrics: metrics.length,
      onTarget,
      atRisk,
      critical,
      exceeded,
      overallHealth: healthScore,
      categories: categorySummaries,
      topMetrics,
      alerts,
      lastRefresh: new Date(),
    };
  }

  // ===========================================================================
  // ALERTS - PRISMA BACKED
  // ===========================================================================

  private async checkMetricAlerts(metric: Metric): Promise<void> {
    if (metric.status === 'critical' || metric.status === 'at_risk') {
      const severity = metric.status === 'critical' ? 'critical' : 'warning';
      
      // Check if similar alert exists recently
      const existingAlert = await prisma.alerts.findFirst({
        where: {
          metric_id: metric.id,
          acknowledged_at: null,
          created_at: { gte: new Date(Date.now() - 3600000) }, // Last hour
        },
      });

      if (!existingAlert) {
        const alertId = uuidv4();
        await prisma.alerts.create({
          data: {
            id: alertId,
            organization_id: metric.organizationId,
            metric_id: metric.id,
            title: `${metric.name} ${metric.status === 'critical' ? 'Critical' : 'At Risk'}`,
            message: `${metric.name}: ${metric.currentValue}${metric.unit} (target: ${metric.targetValue}${metric.unit})`,
            severity: severity as any,
            source: 'helm',
          },
        });

        // Record to Chronos timeline
        recordChronosEvent({
          organizationId: metric.organizationId,
          eventType: 'alert_triggered',
          category: 'data',
          severity: severity === 'critical' ? 'critical' : 'medium',
          title: `Alert: ${metric.name} ${metric.status === 'critical' ? 'Critical' : 'At Risk'}`,
          description: `${metric.name}: ${metric.currentValue}${metric.unit} (target: ${metric.targetValue}${metric.unit})`,
          actorType: 'system',
          resourceType: 'alert',
          resourceId: alertId,
          impact: severity === 'critical' ? 'critical' : 'negative',
          magnitude: severity === 'critical' ? 9 : 6,
          metadata: { metricId: metric.id, metricName: metric.name, currentValue: metric.currentValue, targetValue: metric.targetValue, severity },
        });
      }
    }
  }

  async getActiveAlerts(organizationId: string): Promise<MetricAlert[]> {
    const alerts = await prisma.alerts.findMany({
      where: {
        organization_id: organizationId,
        acknowledged_at: null,
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    return alerts.map((a: any) => ({
      id: a.id,
      organizationId: a.organizationId,
      metricId: a.metricId || '',
      metricName: a.title,
      severity: a.severity as 'warning' | 'critical',
      message: a.message,
      triggeredAt: a.createdAt,
      acknowledged: !!a.acknowledgedAt,
    }));
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await prisma.alerts.update({
      where: { id: alertId },
      data: { acknowledged_at: new Date() },
    });
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private mapToMetric(metricDef: any, values: any[] = []): Metric {
    const currentValue = values[0]?.value || 0;
    const previousValue = values[1]?.value || currentValue;
    const thresholds = (metricDef.thresholds as any) || {};
    const targetValue = thresholds.target || 100;

    const changePercent = previousValue !== 0 
      ? ((currentValue - previousValue) / previousValue) * 100 
      : 0;

    // Normalize category from arbitrary string (e.g. 'Financial') into MetricCategory
    const rawCategory = (metricDef.category || 'operational').toString().toLowerCase();
    let category: MetricCategory;
    switch (rawCategory) {
      case 'financial':
        category = 'financial';
        break;
      case 'customer':
        category = 'customer';
        break;
      case 'people':
        category = 'people';
        break;
      case 'operations':
      case 'operational':
        category = 'operational';
        break;
      case 'strategic':
        category = 'strategic';
        break;
      case 'security':
      case 'compliance':
        category = 'compliance';
        break;
      default:
        category = 'operational';
    }

    return {
      id: metricDef.id,
      organizationId: metricDef.organizationId,
      name: metricDef.name,
      description: metricDef.description || '',
      category,
      currentValue,
      targetValue,
      previousValue,
      unit: metricDef.unit || '',
      status: this.calculateStatus(currentValue, targetValue, thresholds.warning, thresholds.critical),
      trend: changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable',
      changePercent: Math.round(changePercent * 100) / 100,
      warningThreshold: thresholds.warning,
      criticalThreshold: thresholds.critical,
      source: ((metricDef.formula as any)?.source) || 'manual',
      lastUpdated: values[0]?.timestamp || metricDef.updatedAt,
      refreshInterval: parseInt(metricDef.refreshSchedule?.replace('s', '') || '3600'),
    };
  }

  private calculateStatus(
    current: number, 
    target: number, 
    warning?: number, 
    critical?: number
  ): MetricStatus {
    if (target === 0) return 'not_set';
    const ratio = current / target;
    
    if (ratio >= 1) return 'exceeded';
    if (critical && current <= critical) return 'critical';
    if (warning && current <= warning) return 'at_risk';
    if (ratio >= 0.9) return 'on_target';
    if (ratio >= 0.7) return 'at_risk';
    return 'critical';
  }

  // No seed method - Enterprise Platinum standard
  // Data is created only through real API operations

  async hasMetricsForOrg(organizationId: string): Promise<boolean> {
    const count = await prisma.metric_definitions.count({
      where: { organization_id: organizationId },
    });
    return count > 0;
  }
}

export const helmService = new HelmService();
