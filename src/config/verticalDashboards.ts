// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * VERTICAL DASHBOARD CONFIGURATIONS
 * Distinctive layouts for each of 24 industry verticals
 */

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'gauge' | 'map' | 'timeline' | 'heatmap' | 'radar' | 'sankey' | 'treemap' | 'custom';
  title: string;
  icon: string;
  size: 'small' | 'medium' | 'large' | 'full';
}

export interface VerticalDashboardConfig {
  id: string;
  name: string;
  tagline: string;
  heroMetric: { label: string; value: string; trend: string; icon: string };
  kpis: Array<{ id: string; label: string; value: string; change: number; icon: string; color: string }>;
  widgets: DashboardWidget[];
  quickActions: Array<{ id: string; label: string; icon: string; path: string }>;
  insights: Array<{ type: 'success' | 'warning' | 'info' | 'critical'; message: string }>;
  creativeElement: { type: string; component: string; description: string };
}

// FINANCIAL SERVICES
export const financialDashboard: VerticalDashboardConfig = {
  id: 'financial', name: 'Financial Services', tagline: 'Real-time market intelligence & risk management',
  heroMetric: { label: 'Portfolio Value', value: '$847.2M', trend: '+2.4% today', icon: '💹' },
  kpis: [
    { id: 'aum', label: 'Assets Under Management', value: '$2.4B', change: 5.2, icon: '🏦', color: 'cyan' },
    { id: 'var', label: 'Value at Risk (95%)', value: '$12.8M', change: -1.2, icon: '⚠️', color: 'amber' },
    { id: 'sharpe', label: 'Sharpe Ratio', value: '1.84', change: 0.12, icon: '📊', color: 'emerald' },
    { id: 'alpha', label: 'Alpha Generated', value: '+3.2%', change: 0.8, icon: '🎯', color: 'violet' },
  ],
  widgets: [
    { id: 'market-pulse', type: 'custom', title: 'Market Pulse', icon: '📈', size: 'large' },
    { id: 'risk-heatmap', type: 'heatmap', title: 'Risk Exposure', icon: '🔥', size: 'medium' },
    { id: 'trade-flow', type: 'sankey', title: 'Capital Flow', icon: '💰', size: 'medium' },
    { id: 'compliance', type: 'radar', title: 'Compliance', icon: '🛡️', size: 'small' },
  ],
  quickActions: [
    { id: 'trade', label: 'Execute Trade Decision', icon: '⚡', path: '/cortex/council' },
    { id: 'risk', label: 'Risk Report', icon: '📋', path: '/cortex/intelligence/pre-mortem' },
  ],
  insights: [
    { type: 'critical', message: 'VIX spike detected - review hedging strategy' },
    { type: 'success', message: 'Q4 alpha target exceeded by 40bps' },
  ],
  creativeElement: { type: 'visualization', component: 'TickerTape', description: 'Live scrolling ticker' },
};

// HEALTHCARE
export const healthcareDashboard: VerticalDashboardConfig = {
  id: 'healthcare', name: 'Healthcare', tagline: 'Patient outcomes & operational excellence',
  heroMetric: { label: 'Patient Satisfaction', value: '94.2%', trend: '+1.8% this quarter', icon: '❤️' },
  kpis: [
    { id: 'readmission', label: '30-Day Readmission', value: '8.4%', change: -2.1, icon: '🏥', color: 'emerald' },
    { id: 'los', label: 'Avg Length of Stay', value: '4.2 days', change: -0.3, icon: '🛏️', color: 'cyan' },
    { id: 'mortality', label: 'Mortality Index', value: '0.82', change: -0.05, icon: '📉', color: 'emerald' },
    { id: 'hipaa', label: 'HIPAA Compliance', value: '99.8%', change: 0.1, icon: '🔒', color: 'violet' },
  ],
  widgets: [
    { id: 'patient-flow', type: 'sankey', title: 'Patient Journey', icon: '🚶', size: 'large' },
    { id: 'bed-occupancy', type: 'heatmap', title: 'Bed Occupancy', icon: '🛏️', size: 'medium' },
    { id: 'quality', type: 'radar', title: 'Quality Metrics', icon: '⭐', size: 'medium' },
    { id: 'staffing', type: 'gauge', title: 'Staffing', icon: '👩‍⚕️', size: 'small' },
  ],
  quickActions: [
    { id: 'care', label: 'Care Protocol Decision', icon: '🩺', path: '/cortex/council' },
    { id: 'capacity', label: 'Capacity Planning', icon: '📊', path: '/cortex/intelligence/ghost-board' },
  ],
  insights: [
    { type: 'warning', message: 'ICU capacity at 87% - consider surge protocol' },
    { type: 'success', message: 'Sepsis bundle compliance improved to 96%' },
  ],
  creativeElement: { type: 'visualization', component: 'HeartbeatMonitor', description: 'ECG-style hospital vitals' },
};

// MANUFACTURING
export const manufacturingDashboard: VerticalDashboardConfig = {
  id: 'manufacturing', name: 'Manufacturing', tagline: 'Production optimization & supply chain',
  heroMetric: { label: 'OEE Score', value: '87.3%', trend: '+3.1% vs target', icon: '⚙️' },
  kpis: [
    { id: 'oee', label: 'OEE Score', value: '87.3%', change: 2.4, icon: '🏭', color: 'emerald' },
    { id: 'yield', label: 'First Pass Yield', value: '98.2%', change: 0.5, icon: '✅', color: 'cyan' },
    { id: 'downtime', label: 'Unplanned Downtime', value: '2.1%', change: -0.8, icon: '🔧', color: 'amber' },
    { id: 'inventory', label: 'Inventory Turns', value: '12.4x', change: 1.2, icon: '📦', color: 'violet' },
  ],
  widgets: [
    { id: 'production', type: 'custom', title: 'Production Line Status', icon: '🏭', size: 'large' },
    { id: 'defects', type: 'chart', title: 'Defect Analysis', icon: '📊', size: 'medium' },
    { id: 'supply', type: 'sankey', title: 'Supply Chain', icon: '🚚', size: 'medium' },
    { id: 'maintenance', type: 'timeline', title: 'Maintenance', icon: '🔧', size: 'small' },
  ],
  quickActions: [
    { id: 'production', label: 'Production Decision', icon: '🏭', path: '/cortex/council' },
    { id: 'quality', label: 'Quality Analysis', icon: '🔍', path: '/cortex/intelligence/decision-dna' },
  ],
  insights: [
    { type: 'critical', message: 'Line 3 showing early failure signature' },
    { type: 'success', message: 'Zero defects on Product A this week' },
  ],
  creativeElement: { type: 'animation', component: 'AssemblyLine', description: 'Animated factory floor' },
};

// TECHNOLOGY
export const technologyDashboard: VerticalDashboardConfig = {
  id: 'technology', name: 'Technology', tagline: 'Innovation velocity & platform reliability',
  heroMetric: { label: 'Platform Uptime', value: '99.97%', trend: 'SLA: 99.9%', icon: '🚀' },
  kpis: [
    { id: 'deploy', label: 'Deploy Frequency', value: '47/day', change: 12, icon: '🔄', color: 'cyan' },
    { id: 'mttr', label: 'MTTR', value: '4.2min', change: -1.8, icon: '⚡', color: 'emerald' },
    { id: 'velocity', label: 'Sprint Velocity', value: '94pts', change: 8, icon: '📈', color: 'violet' },
    { id: 'nps', label: 'Developer NPS', value: '+72', change: 5, icon: '💜', color: 'fuchsia' },
  ],
  widgets: [
    { id: 'health', type: 'custom', title: 'System Health Matrix', icon: '💚', size: 'large' },
    { id: 'pipeline', type: 'timeline', title: 'Deploy Pipeline', icon: '🔄', size: 'medium' },
    { id: 'incidents', type: 'heatmap', title: 'Incident Heatmap', icon: '🔥', size: 'medium' },
    { id: 'debt', type: 'gauge', title: 'Tech Debt', icon: '💳', size: 'small' },
  ],
  quickActions: [
    { id: 'arch', label: 'Architecture Decision', icon: '🏗️', path: '/cortex/council' },
    { id: 'incident', label: 'Incident Analysis', icon: '🚨', path: '/cortex/intelligence/decision-dna' },
  ],
  insights: [
    { type: 'success', message: 'Zero critical incidents in 30 days' },
    { type: 'warning', message: 'Tech debt in auth service approaching threshold' },
  ],
  creativeElement: { type: 'visualization', component: 'NetworkTopology', description: 'Live network topology' },
};

// Export all dashboards
export const VERTICAL_DASHBOARDS: Record<string, VerticalDashboardConfig> = {
  financial: financialDashboard,
  healthcare: healthcareDashboard,
  manufacturing: manufacturingDashboard,
  technology: technologyDashboard,
};
