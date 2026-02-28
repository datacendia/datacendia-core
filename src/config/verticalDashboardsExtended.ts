// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * EXTENDED VERTICAL DASHBOARD CONFIGURATIONS
 * Remaining 20 industry verticals (total 24)
 */

import { VerticalDashboardConfig } from './verticalDashboards';

// ENERGY & UTILITIES
export const energyDashboard: VerticalDashboardConfig = {
  id: 'energy', name: 'Energy & Utilities', tagline: 'Grid optimization & sustainability',
  heroMetric: { label: 'Grid Efficiency', value: '94.8%', trend: '+2.1% YoY', icon: '⚡' },
  kpis: [
    { id: 'generation', label: 'Power Generated', value: '2.4 GWh', change: 5.2, icon: '🔌', color: 'amber' },
    { id: 'renewable', label: 'Renewable Mix', value: '42%', change: 8.5, icon: '🌱', color: 'emerald' },
    { id: 'outage', label: 'SAIDI Index', value: '52min', change: -12, icon: '⏱️', color: 'cyan' },
    { id: 'carbon', label: 'Carbon Intensity', value: '284g/kWh', change: -15, icon: '🌍', color: 'emerald' },
  ],
  widgets: [
    { id: 'grid', type: 'map', title: 'Grid Status', icon: '🗺️', size: 'large' },
    { id: 'load', type: 'chart', title: 'Load Curve', icon: '📈', size: 'medium' },
    { id: 'mix', type: 'treemap', title: 'Generation Mix', icon: '🌱', size: 'medium' },
    { id: 'weather', type: 'custom', title: 'Weather Impact', icon: '🌤️', size: 'small' },
  ],
  quickActions: [
    { id: 'dispatch', label: 'Generation Dispatch', icon: '⚡', path: '/cortex/council' },
    { id: 'outage', label: 'Outage Response', icon: '🔧', path: '/cortex/enterprise/crisis-management' },
  ],
  insights: [
    { type: 'warning', message: 'Peak demand expected at 6PM - activate reserves' },
    { type: 'success', message: 'Solar generation exceeded forecast by 12%' },
  ],
  creativeElement: { type: 'visualization', component: 'PowerGrid', description: 'Animated power flow' },
};

// GOVERNMENT
export const governmentDashboard: VerticalDashboardConfig = {
  id: 'government', name: 'Government', tagline: 'Public service excellence & transparency',
  heroMetric: { label: 'Citizen Satisfaction', value: '78.4%', trend: '+4.2% this year', icon: '🏛️' },
  kpis: [
    { id: 'services', label: 'Digital Services', value: '847', change: 23, icon: '💻', color: 'cyan' },
    { id: 'response', label: 'Response Time', value: '2.4 days', change: -0.8, icon: '⏱️', color: 'emerald' },
    { id: 'transparency', label: 'Transparency Score', value: '92%', change: 3, icon: '👁️', color: 'violet' },
    { id: 'budget', label: 'Budget Utilization', value: '94.2%', change: 1.2, icon: '💰', color: 'amber' },
  ],
  widgets: [
    { id: 'civic-simulation', type: 'custom', title: 'Civic Simulation', icon: '🏛️', size: 'large' },
    { id: 'case-flow', type: 'sankey', title: 'Case Processing', icon: '📋', size: 'medium' },
    { id: 'budget', type: 'treemap', title: 'Budget Allocation', icon: '💰', size: 'medium' },
    { id: 'compliance', type: 'radar', title: 'Compliance', icon: '⚖️', size: 'small' },
  ],
  quickActions: [
    { id: 'policy', label: 'Policy Decision', icon: '📜', path: '/cortex/council' },
    { id: 'audit', label: 'Audit Trail', icon: '🔍', path: '/cortex/enterprise/ledger' },
  ],
  insights: [
    { type: 'info', message: 'New FOIA request volume up 15%' },
    { type: 'success', message: 'Permit processing reduced by 40%' },
  ],
  creativeElement: { type: 'visualization', component: 'CapitolDome', description: 'Government activity indicators' },
};

// LEGAL
export const legalDashboard: VerticalDashboardConfig = {
  id: 'legal', name: 'Legal Services', tagline: 'Matter management & litigation intelligence',
  heroMetric: { label: 'Case Win Rate', value: '84.2%', trend: '+6.1% vs benchmark', icon: '⚖️' },
  kpis: [
    { id: 'matters', label: 'Active Matters', value: '1,247', change: 12, icon: '📁', color: 'cyan' },
    { id: 'billable', label: 'Billable Hours', value: '94.2%', change: 2.1, icon: '⏱️', color: 'emerald' },
    { id: 'collection', label: 'Collection Rate', value: '96.8%', change: 1.4, icon: '💰', color: 'violet' },
    { id: 'risk', label: 'Litigation Reserve', value: '$42M', change: -5, icon: '⚠️', color: 'amber' },
  ],
  widgets: [
    { id: 'matters', type: 'custom', title: 'Legal Matters', icon: '⚖️', size: 'large' },
    { id: 'jurisdiction', type: 'map', title: 'Jurisdiction Map', icon: '🗺️', size: 'medium' },
    { id: 'practice', type: 'treemap', title: 'Practice Areas', icon: '📊', size: 'medium' },
    { id: 'deadlines', type: 'list', title: 'Critical Deadlines', icon: '⏰', size: 'small' },
  ],
  quickActions: [
    { id: 'strategy', label: 'Litigation Strategy', icon: '♟️', path: '/cortex/council' },
    { id: 'precedent', label: 'Precedent Search', icon: '📚', path: '/cortex/enterprise/gnosis' },
  ],
  insights: [
    { type: 'critical', message: 'Summary judgment deadline in 3 days' },
    { type: 'success', message: 'Motion to dismiss granted in Johnson matter' },
  ],
  creativeElement: { type: 'visualization', component: 'ScalesOfJustice', description: 'Animated balance scale' },
};

// RETAIL
export const retailDashboard: VerticalDashboardConfig = {
  id: 'retail', name: 'Retail', tagline: 'Omnichannel performance & customer intelligence',
  heroMetric: { label: 'Same-Store Sales', value: '+7.2%', trend: 'vs last year', icon: '🛒' },
  kpis: [
    { id: 'revenue', label: 'Daily Revenue', value: '$2.4M', change: 8.2, icon: '💰', color: 'emerald' },
    { id: 'conversion', label: 'Conversion Rate', value: '3.8%', change: 0.4, icon: '🎯', color: 'cyan' },
    { id: 'aov', label: 'Avg Order Value', value: '$127', change: 12, icon: '🛍️', color: 'violet' },
    { id: 'inventory', label: 'Inventory Turn', value: '8.4x', change: 0.6, icon: '📦', color: 'amber' },
  ],
  widgets: [
    { id: 'store-performance', type: 'custom', title: 'Store Performance', icon: '🏪', size: 'large' },
    { id: 'funnel', type: 'sankey', title: 'Customer Journey', icon: '🚶', size: 'medium' },
    { id: 'category', type: 'treemap', title: 'Category Mix', icon: '📊', size: 'medium' },
    { id: 'trending', type: 'list', title: 'Trending Products', icon: '🔥', size: 'small' },
  ],
  quickActions: [
    { id: 'pricing', label: 'Pricing Decision', icon: '💵', path: '/cortex/council' },
    { id: 'inventory', label: 'Inventory Optimization', icon: '📦', path: '/cortex/intelligence/ghost-board' },
  ],
  insights: [
    { type: 'success', message: 'Black Friday prep 94% complete' },
    { type: 'warning', message: 'SKU #4521 stockout predicted in 3 days' },
  ],
  creativeElement: { type: 'animation', component: 'ShoppingCart', description: 'Transaction visualization' },
};

// REAL ESTATE
export const realEstateDashboard: VerticalDashboardConfig = {
  id: 'real-estate', name: 'Real Estate', tagline: 'Portfolio optimization & market intelligence',
  heroMetric: { label: 'Portfolio NOI', value: '$124M', trend: '+8.4% YoY', icon: '🏢' },
  kpis: [
    { id: 'occupancy', label: 'Occupancy', value: '94.2%', change: 1.8, icon: '🏠', color: 'emerald' },
    { id: 'noi', label: 'Net Operating Income', value: '$124M', change: 8.4, icon: '💰', color: 'cyan' },
    { id: 'caprate', label: 'Cap Rate', value: '5.8%', change: -0.2, icon: '📈', color: 'violet' },
    { id: 'rent', label: 'Rent Growth', value: '+4.2%', change: 1.1, icon: '📊', color: 'amber' },
  ],
  widgets: [
    { id: 'portfolio', type: 'custom', title: 'Property Portfolio', icon: '🏢', size: 'large' },
    { id: 'lease', type: 'timeline', title: 'Lease Expirations', icon: '📅', size: 'medium' },
    { id: 'asset', type: 'treemap', title: 'Asset Classes', icon: '🏗️', size: 'medium' },
    { id: 'market', type: 'radar', title: 'Market Comparison', icon: '📊', size: 'small' },
  ],
  quickActions: [
    { id: 'acquisition', label: 'Acquisition Analysis', icon: '🏢', path: '/cortex/council' },
    { id: 'lease', label: 'Lease Decision', icon: '📝', path: '/cortex/intelligence/ghost-board' },
  ],
  insights: [
    { type: 'success', message: '12 lease renewals completed this quarter' },
    { type: 'warning', message: 'Downtown office vacancy trending up' },
  ],
  creativeElement: { type: 'visualization', component: 'CitySkyline', description: 'Animated skyline' },
};

// TELECOM
export const telecomDashboard: VerticalDashboardConfig = {
  id: 'telecom', name: 'Telecommunications', tagline: 'Network performance & subscriber intelligence',
  heroMetric: { label: 'Network Uptime', value: '99.98%', trend: 'SLA: 99.9%', icon: '📡' },
  kpis: [
    { id: 'subscribers', label: 'Subscribers', value: '12.4M', change: 2.1, icon: '👥', color: 'cyan' },
    { id: 'arpu', label: 'ARPU', value: '$64.20', change: 3.4, icon: '💰', color: 'emerald' },
    { id: 'churn', label: 'Monthly Churn', value: '1.2%', change: -0.3, icon: '📉', color: 'emerald' },
    { id: 'nps', label: 'Customer NPS', value: '+42', change: 5, icon: '💜', color: 'violet' },
  ],
  widgets: [
    { id: 'network', type: 'map', title: 'Network Coverage', icon: '🗺️', size: 'large' },
    { id: 'traffic', type: 'sankey', title: 'Data Traffic', icon: '🌐', size: 'medium' },
    { id: 'tower', type: 'heatmap', title: 'Tower Health', icon: '📡', size: 'medium' },
    { id: 'churn', type: 'list', title: 'Churn Risk', icon: '⚠️', size: 'small' },
  ],
  quickActions: [
    { id: 'network', label: 'Network Decision', icon: '📡', path: '/cortex/council' },
    { id: 'churn', label: 'Churn Prevention', icon: '🛡️', path: '/cortex/intelligence/pre-mortem' },
  ],
  insights: [
    { type: 'critical', message: 'Cell site #2847 degraded performance' },
    { type: 'success', message: '5G rollout 85% complete' },
  ],
  creativeElement: { type: 'visualization', component: 'SignalWaves', description: 'Signal propagation' },
};

// HOSPITALITY
export const hospitalityDashboard: VerticalDashboardConfig = {
  id: 'hospitality', name: 'Hospitality', tagline: 'Guest experience & revenue optimization',
  heroMetric: { label: 'Guest Satisfaction', value: '4.7/5.0', trend: '+0.2 vs last quarter', icon: '⭐' },
  kpis: [
    { id: 'revpar', label: 'RevPAR', value: '$142', change: 12.4, icon: '💰', color: 'emerald' },
    { id: 'occupancy', label: 'Occupancy', value: '78.4%', change: 4.2, icon: '🛏️', color: 'cyan' },
    { id: 'adr', label: 'ADR', value: '$189', change: 8.1, icon: '📈', color: 'violet' },
    { id: 'loyalty', label: 'Loyalty Members', value: '2.4M', change: 15, icon: '💳', color: 'amber' },
  ],
  widgets: [
    { id: 'property', type: 'map', title: 'Property Performance', icon: '🏨', size: 'large' },
    { id: 'booking', type: 'sankey', title: 'Booking Channels', icon: '📱', size: 'medium' },
    { id: 'revenue', type: 'treemap', title: 'Revenue Mix', icon: '💰', size: 'medium' },
    { id: 'reviews', type: 'list', title: 'Recent Reviews', icon: '💬', size: 'small' },
  ],
  quickActions: [
    { id: 'pricing', label: 'Dynamic Pricing', icon: '💵', path: '/cortex/council' },
    { id: 'forecast', label: 'Demand Forecast', icon: '📊', path: '/cortex/intelligence/chronos' },
  ],
  insights: [
    { type: 'success', message: 'Convention booking secured for Q2' },
    { type: 'warning', message: 'Competitor rate drop detected' },
  ],
  creativeElement: { type: 'animation', component: 'HotelLobby', description: 'Guest flow visualization' },
};

// EDUCATION
export const educationDashboard: VerticalDashboardConfig = {
  id: 'education', name: 'Education', tagline: 'Student success & institutional excellence',
  heroMetric: { label: 'Graduation Rate', value: '89.4%', trend: '+2.1% vs national', icon: '🎓' },
  kpis: [
    { id: 'enrollment', label: 'Enrollment', value: '42,847', change: 3.2, icon: '👩‍🎓', color: 'cyan' },
    { id: 'retention', label: 'Retention', value: '94.2%', change: 1.4, icon: '📈', color: 'emerald' },
    { id: 'satisfaction', label: 'Satisfaction', value: '4.4/5', change: 0.2, icon: '⭐', color: 'violet' },
    { id: 'placement', label: 'Job Placement', value: '92%', change: 3, icon: '💼', color: 'amber' },
  ],
  widgets: [
    { id: 'student-success', type: 'custom', title: 'Student Success', icon: '🎓', size: 'large' },
    { id: 'program', type: 'treemap', title: 'Program Performance', icon: '📚', size: 'medium' },
    { id: 'journey', type: 'sankey', title: 'Student Journey', icon: '🚶', size: 'medium' },
    { id: 'at-risk', type: 'list', title: 'At-Risk Students', icon: '⚠️', size: 'small' },
  ],
  quickActions: [
    { id: 'curriculum', label: 'Curriculum Decision', icon: '📖', path: '/cortex/council' },
    { id: 'intervention', label: 'Student Intervention', icon: '🤝', path: '/cortex/intelligence/pre-mortem' },
  ],
  insights: [
    { type: 'warning', message: '147 students flagged for intervention' },
    { type: 'success', message: 'STEM applications up 28%' },
  ],
  creativeElement: { type: 'visualization', component: 'GraduationCap', description: 'Success metrics' },
};

// MEDIA
export const mediaDashboard: VerticalDashboardConfig = {
  id: 'media', name: 'Media & Entertainment', tagline: 'Audience engagement & content performance',
  heroMetric: { label: 'Monthly Active Users', value: '84.2M', trend: '+12.4% MoM', icon: '📺' },
  kpis: [
    { id: 'mau', label: 'MAU', value: '84.2M', change: 12.4, icon: '👥', color: 'cyan' },
    { id: 'engagement', label: 'Watch Time', value: '47min', change: 8, icon: '⏱️', color: 'emerald' },
    { id: 'subscribers', label: 'Premium Subs', value: '12.4M', change: 5.2, icon: '💳', color: 'violet' },
    { id: 'revenue', label: 'Ad Revenue', value: '$42M', change: 15, icon: '💰', color: 'amber' },
  ],
  widgets: [
    { id: 'content', type: 'treemap', title: 'Content Performance', icon: '🎬', size: 'large' },
    { id: 'audience', type: 'sankey', title: 'Audience Flow', icon: '🚶', size: 'medium' },
    { id: 'engagement', type: 'heatmap', title: 'Engagement Heatmap', icon: '🔥', size: 'medium' },
    { id: 'trending', type: 'list', title: 'Trending', icon: '📈', size: 'small' },
  ],
  quickActions: [
    { id: 'content', label: 'Content Decision', icon: '🎬', path: '/cortex/council' },
    { id: 'recommendation', label: 'Recommendation Tuning', icon: '🎯', path: '/cortex/intelligence/echo' },
  ],
  insights: [
    { type: 'success', message: '"Apex" exceeded viewership targets' },
    { type: 'warning', message: 'Churn spike in 18-24 demographic' },
  ],
  creativeElement: { type: 'animation', component: 'StreamingWave', description: 'Viewer metrics' },
};

// AGRICULTURE
export const agricultureDashboard: VerticalDashboardConfig = {
  id: 'agriculture', name: 'Agriculture', tagline: 'Yield optimization & sustainable farming',
  heroMetric: { label: 'Yield per Acre', value: '184 bu', trend: '+8.2% vs 5yr avg', icon: '🌾' },
  kpis: [
    { id: 'yield', label: 'Yield/Acre', value: '184 bu', change: 8.2, icon: '🌾', color: 'emerald' },
    { id: 'acreage', label: 'Active Acreage', value: '42,500', change: 2.1, icon: '🗺️', color: 'cyan' },
    { id: 'water', label: 'Water Efficiency', value: '94%', change: 5, icon: '💧', color: 'cyan' },
    { id: 'cost', label: 'Cost/Bushel', value: '$3.42', change: -4, icon: '💰', color: 'emerald' },
  ],
  widgets: [
    { id: 'field', type: 'map', title: 'Field Status', icon: '🗺️', size: 'large' },
    { id: 'weather', type: 'custom', title: 'Weather Forecast', icon: '🌤️', size: 'medium' },
    { id: 'health', type: 'heatmap', title: 'Crop Health', icon: '🌱', size: 'medium' },
    { id: 'market', type: 'chart', title: 'Commodity Prices', icon: '📈', size: 'small' },
  ],
  quickActions: [
    { id: 'planting', label: 'Planting Decision', icon: '🌱', path: '/cortex/council' },
    { id: 'harvest', label: 'Harvest Timing', icon: '🚜', path: '/cortex/intelligence/chronos' },
  ],
  insights: [
    { type: 'warning', message: 'Drought conditions expected in South fields' },
    { type: 'success', message: 'Organic certification approved' },
  ],
  creativeElement: { type: 'visualization', component: 'FarmLandscape', description: 'Seasonal growth' },
};

// LOGISTICS
export const logisticsDashboard: VerticalDashboardConfig = {
  id: 'logistics', name: 'Logistics', tagline: 'End-to-end visibility & delivery excellence',
  heroMetric: { label: 'On-Time Delivery', value: '97.4%', trend: '+1.2% vs target', icon: '🚚' },
  kpis: [
    { id: 'otd', label: 'On-Time Delivery', value: '97.4%', change: 1.2, icon: '✅', color: 'emerald' },
    { id: 'shipments', label: 'Daily Shipments', value: '24,847', change: 8, icon: '📦', color: 'cyan' },
    { id: 'cost', label: 'Cost/Mile', value: '$2.14', change: -3, icon: '💰', color: 'emerald' },
    { id: 'utilization', label: 'Fleet Utilization', value: '89%', change: 4, icon: '🚛', color: 'violet' },
  ],
  widgets: [
    { id: 'fleet', type: 'map', title: 'Live Fleet Tracking', icon: '🗺️', size: 'large' },
    { id: 'supply', type: 'sankey', title: 'Supply Chain Flow', icon: '🔄', size: 'medium' },
    { id: 'warehouse', type: 'heatmap', title: 'Warehouse Capacity', icon: '🏭', size: 'medium' },
    { id: 'delays', type: 'list', title: 'Active Delays', icon: '⚠️', size: 'small' },
  ],
  quickActions: [
    { id: 'routing', label: 'Route Optimization', icon: '🗺️', path: '/cortex/council' },
    { id: 'disruption', label: 'Disruption Response', icon: '🚨', path: '/cortex/enterprise/crisis-management' },
  ],
  insights: [
    { type: 'critical', message: 'Port congestion - reroute shipments' },
    { type: 'success', message: 'Same-day delivery at all-time high' },
  ],
  creativeElement: { type: 'animation', component: 'GlobalRoutes', description: 'Live shipping routes' },
};

// INSURANCE
export const insuranceDashboard: VerticalDashboardConfig = {
  id: 'insurance', name: 'Insurance', tagline: 'Risk assessment & claims intelligence',
  heroMetric: { label: 'Combined Ratio', value: '94.2%', trend: 'Target: <100%', icon: '🛡️' },
  kpis: [
    { id: 'gwp', label: 'Gross Premium', value: '$2.4B', change: 8.2, icon: '💰', color: 'cyan' },
    { id: 'loss', label: 'Loss Ratio', value: '62%', change: -2, icon: '📉', color: 'emerald' },
    { id: 'claims', label: 'Claims Cycle', value: '12 days', change: -3, icon: '⏱️', color: 'emerald' },
    { id: 'retention', label: 'Policy Retention', value: '89%', change: 2, icon: '🔄', color: 'violet' },
  ],
  widgets: [
    { id: 'claims', type: 'custom', title: 'Claims Dashboard', icon: '📋', size: 'large' },
    { id: 'risk', type: 'map', title: 'Risk Exposure', icon: '🗺️', size: 'medium' },
    { id: 'portfolio', type: 'treemap', title: 'Portfolio Mix', icon: '📊', size: 'medium' },
    { id: 'fraud', type: 'list', title: 'Fraud Alerts', icon: '🚨', size: 'small' },
  ],
  quickActions: [
    { id: 'underwriting', label: 'Underwriting Decision', icon: '📝', path: '/cortex/council' },
    { id: 'claims', label: 'Claims Triage', icon: '⚖️', path: '/cortex/intelligence/pre-mortem' },
  ],
  insights: [
    { type: 'warning', message: 'CAT exposure elevated in Florida' },
    { type: 'success', message: 'Fraud detection saved $2.4M' },
  ],
  creativeElement: { type: 'visualization', component: 'UmbrellaShield', description: 'Risk protection' },
};

// NON-PROFIT
export const nonProfitDashboard: VerticalDashboardConfig = {
  id: 'non-profit', name: 'Non-Profit', tagline: 'Impact measurement & donor stewardship',
  heroMetric: { label: 'Lives Impacted', value: '2.4M', trend: '+18% this year', icon: '💝' },
  kpis: [
    { id: 'impact', label: 'Lives Impacted', value: '2.4M', change: 18, icon: '🌍', color: 'emerald' },
    { id: 'donations', label: 'Total Donations', value: '$84M', change: 12, icon: '💰', color: 'cyan' },
    { id: 'retention', label: 'Donor Retention', value: '68%', change: 4, icon: '🔄', color: 'violet' },
    { id: 'efficiency', label: 'Program Efficiency', value: '89%', change: 2, icon: '📊', color: 'amber' },
  ],
  widgets: [
    { id: 'impact', type: 'map', title: 'Global Impact', icon: '🗺️', size: 'large' },
    { id: 'fund', type: 'sankey', title: 'Fund Allocation', icon: '💰', size: 'medium' },
    { id: 'program', type: 'treemap', title: 'Programs', icon: '📊', size: 'medium' },
    { id: 'campaigns', type: 'list', title: 'Active Campaigns', icon: '📢', size: 'small' },
  ],
  quickActions: [
    { id: 'program', label: 'Program Decision', icon: '🎯', path: '/cortex/council' },
    { id: 'impact', label: 'Impact Report', icon: '📊', path: '/cortex/enterprise/evidence-vault' },
  ],
  insights: [
    { type: 'success', message: 'Annual gala exceeded target by 24%' },
    { type: 'warning', message: 'Q4 donations below forecast' },
  ],
  creativeElement: { type: 'visualization', component: 'HeartImpact', description: 'Impact ripple effect' },
};

// CONSTRUCTION
export const constructionDashboard: VerticalDashboardConfig = {
  id: 'construction', name: 'Construction', tagline: 'Project delivery & safety excellence',
  heroMetric: { label: 'Projects On-Track', value: '87%', trend: '+5% vs Q3', icon: '🏗️' },
  kpis: [
    { id: 'projects', label: 'Active Projects', value: '142', change: 8, icon: '🏗️', color: 'cyan' },
    { id: 'budget', label: 'Budget Variance', value: '+2.1%', change: -1.5, icon: '💰', color: 'amber' },
    { id: 'safety', label: 'Safety Score', value: '98.4%', change: 0.8, icon: '⛑️', color: 'emerald' },
    { id: 'backlog', label: 'Project Backlog', value: '$420M', change: 15, icon: '📋', color: 'violet' },
  ],
  widgets: [
    { id: 'project-map', type: 'map', title: 'Project Locations', icon: '🗺️', size: 'large' },
    { id: 'timeline', type: 'timeline', title: 'Project Timelines', icon: '📅', size: 'medium' },
    { id: 'resource', type: 'heatmap', title: 'Resource Allocation', icon: '👷', size: 'medium' },
    { id: 'safety', type: 'gauge', title: 'Safety Metrics', icon: '⛑️', size: 'small' },
  ],
  quickActions: [
    { id: 'bid', label: 'Bid Decision', icon: '📝', path: '/cortex/council' },
    { id: 'safety', label: 'Safety Review', icon: '⛑️', path: '/cortex/enterprise/govern' },
  ],
  insights: [
    { type: 'critical', message: 'Weather delay at Downtown Tower' },
    { type: 'success', message: '500 days without lost-time incident' },
  ],
  creativeElement: { type: 'animation', component: 'CraneConstruction', description: 'Progress indicators' },
};

// MINING
export const miningDashboard: VerticalDashboardConfig = {
  id: 'mining', name: 'Mining & Resources', tagline: 'Extraction optimization & ESG compliance',
  heroMetric: { label: 'Production Rate', value: '42.8kt', trend: '+4.2% vs plan', icon: '⛏️' },
  kpis: [
    { id: 'production', label: 'Daily Production', value: '42.8kt', change: 4.2, icon: '⛏️', color: 'amber' },
    { id: 'grade', label: 'Ore Grade', value: '2.4%', change: 0.2, icon: '💎', color: 'cyan' },
    { id: 'safety', label: 'TRIFR', value: '1.2', change: -0.4, icon: '⛑️', color: 'emerald' },
    { id: 'recovery', label: 'Recovery Rate', value: '94%', change: 1.5, icon: '📈', color: 'violet' },
  ],
  widgets: [
    { id: 'site', type: 'map', title: 'Mining Operations', icon: '🗺️', size: 'large' },
    { id: 'extraction', type: 'sankey', title: 'Extraction Flow', icon: '⛏️', size: 'medium' },
    { id: 'equipment', type: 'heatmap', title: 'Equipment Status', icon: '🚜', size: 'medium' },
    { id: 'commodity', type: 'chart', title: 'Commodity Prices', icon: '📈', size: 'small' },
  ],
  quickActions: [
    { id: 'extraction', label: 'Extraction Plan', icon: '⛏️', path: '/cortex/council' },
    { id: 'esg', label: 'ESG Report', icon: '🌍', path: '/cortex/enterprise/evidence-vault' },
  ],
  insights: [
    { type: 'success', message: 'Q4 production target achieved' },
    { type: 'warning', message: 'Haul truck #12 needs maintenance' },
  ],
  creativeElement: { type: 'visualization', component: 'MineCrossSection', description: 'Extraction visualization' },
};

// AEROSPACE
export const aerospaceDashboard: VerticalDashboardConfig = {
  id: 'aerospace', name: 'Aerospace & Defense', tagline: 'Mission readiness & program excellence',
  heroMetric: { label: 'Fleet Readiness', value: '94.2%', trend: 'Target: 90%', icon: '✈️' },
  kpis: [
    { id: 'readiness', label: 'Mission Readiness', value: '94.2%', change: 2.1, icon: '✈️', color: 'emerald' },
    { id: 'programs', label: 'Active Programs', value: '47', change: 3, icon: '🎯', color: 'cyan' },
    { id: 'backlog', label: 'Order Backlog', value: '$12.4B', change: 8, icon: '📋', color: 'violet' },
    { id: 'compliance', label: 'ITAR Compliance', value: '100%', change: 0, icon: '🛡️', color: 'emerald' },
  ],
  widgets: [
    { id: 'fleet', type: 'custom', title: 'Fleet Status Board', icon: '✈️', size: 'large' },
    { id: 'program', type: 'timeline', title: 'Program Milestones', icon: '📅', size: 'medium' },
    { id: 'supply', type: 'sankey', title: 'Supply Chain', icon: '🔄', size: 'medium' },
    { id: 'security', type: 'radar', title: 'Security Posture', icon: '🛡️', size: 'small' },
  ],
  quickActions: [
    { id: 'mission', label: 'Mission Planning', icon: '🎯', path: '/cortex/council' },
    { id: 'security', label: 'Security Audit', icon: '🛡️', path: '/cortex/enterprise/defense-stack' },
  ],
  insights: [
    { type: 'success', message: 'F-35 delivery milestone achieved' },
    { type: 'warning', message: 'Supply chain risk in titanium' },
  ],
  creativeElement: { type: 'visualization', component: 'FlightDeck', description: 'Cockpit HUD' },
};

// PHARMACEUTICALS
export const pharmaceuticalsDashboard: VerticalDashboardConfig = {
  id: 'pharmaceuticals', name: 'Pharmaceuticals', tagline: 'Drug development & regulatory excellence',
  heroMetric: { label: 'Pipeline Value', value: '$24.8B', trend: 'Risk-adjusted NPV', icon: '💊' },
  kpis: [
    { id: 'pipeline', label: 'Active Compounds', value: '47', change: 5, icon: '🧪', color: 'cyan' },
    { id: 'trials', label: 'Clinical Trials', value: '24', change: 3, icon: '📋', color: 'violet' },
    { id: 'approval', label: 'Approval Rate', value: '84%', change: 4, icon: '✅', color: 'emerald' },
    { id: 'rd', label: 'R&D Investment', value: '$4.2B', change: 12, icon: '💰', color: 'amber' },
  ],
  widgets: [
    { id: 'pipeline', type: 'sankey', title: 'Drug Pipeline', icon: '🧪', size: 'large' },
    { id: 'trials', type: 'timeline', title: 'Trial Milestones', icon: '📅', size: 'medium' },
    { id: 'therapeutic', type: 'treemap', title: 'Therapeutic Areas', icon: '💊', size: 'medium' },
    { id: 'regulatory', type: 'list', title: 'Regulatory Filings', icon: '📋', size: 'small' },
  ],
  quickActions: [
    { id: 'trial', label: 'Trial Decision', icon: '🧪', path: '/cortex/council' },
    { id: 'fda', label: 'FDA Strategy', icon: '📋', path: '/cortex/enterprise/govern' },
  ],
  insights: [
    { type: 'success', message: 'Phase 3 trial met primary endpoint' },
    { type: 'warning', message: 'Manufacturing capacity constraint' },
  ],
  creativeElement: { type: 'visualization', component: 'MoleculeStructure', description: '3D molecule' },
};

// AUTOMOTIVE
export const automotiveDashboard: VerticalDashboardConfig = {
  id: 'automotive', name: 'Automotive', tagline: 'Production excellence & EV transition',
  heroMetric: { label: 'Daily Production', value: '2,847', trend: '+4.2% vs target', icon: '🚗' },
  kpis: [
    { id: 'production', label: 'Daily Units', value: '2,847', change: 4.2, icon: '🚗', color: 'cyan' },
    { id: 'quality', label: 'Quality Score', value: '98.4%', change: 0.8, icon: '⭐', color: 'emerald' },
    { id: 'ev', label: 'EV Mix', value: '34%', change: 8, icon: '⚡', color: 'violet' },
    { id: 'inventory', label: 'Days of Supply', value: '42', change: -5, icon: '📦', color: 'amber' },
  ],
  widgets: [
    { id: 'plant', type: 'custom', title: 'Plant Status', icon: '🏭', size: 'large' },
    { id: 'supply', type: 'sankey', title: 'Parts Flow', icon: '🔄', size: 'medium' },
    { id: 'quality', type: 'heatmap', title: 'Quality Issues', icon: '⚠️', size: 'medium' },
    { id: 'dealer', type: 'map', title: 'Dealer Network', icon: '🗺️', size: 'small' },
  ],
  quickActions: [
    { id: 'production', label: 'Production Decision', icon: '🏭', path: '/cortex/council' },
    { id: 'recall', label: 'Recall Analysis', icon: '⚠️', path: '/cortex/intelligence/pre-mortem' },
  ],
  insights: [
    { type: 'success', message: 'EV model exceeded sales forecast' },
    { type: 'warning', message: 'Chip shortage affecting Line 2' },
  ],
  creativeElement: { type: 'animation', component: 'AssemblyRobot', description: 'Production line' },
};

// SPORTS
export const sportsDashboard: VerticalDashboardConfig = {
  id: 'sports', name: 'Sports & Entertainment', tagline: 'Fan engagement & performance analytics',
  heroMetric: { label: 'Fan Engagement', value: '94.2%', trend: '+8.4% YoY', icon: '🏆' },
  kpis: [
    { id: 'attendance', label: 'Avg Attendance', value: '48,247', change: 5.2, icon: '🎫', color: 'cyan' },
    { id: 'revenue', label: 'Match Day Revenue', value: '$4.2M', change: 12, icon: '💰', color: 'emerald' },
    { id: 'merchandise', label: 'Merch Sales', value: '$1.8M', change: 18, icon: '👕', color: 'violet' },
    { id: 'social', label: 'Social Reach', value: '12.4M', change: 24, icon: '📱', color: 'amber' },
  ],
  widgets: [
    { id: 'stadium', type: 'custom', title: 'Stadium Analytics', icon: '🏟️', size: 'large' },
    { id: 'player', type: 'radar', title: 'Player Performance', icon: '⚽', size: 'medium' },
    { id: 'ticket', type: 'heatmap', title: 'Ticket Demand', icon: '🎫', size: 'medium' },
    { id: 'social', type: 'chart', title: 'Social Sentiment', icon: '📈', size: 'small' },
  ],
  quickActions: [
    { id: 'transfer', label: 'Transfer Decision', icon: '⚽', path: '/cortex/council' },
    { id: 'pricing', label: 'Dynamic Pricing', icon: '💵', path: '/cortex/intelligence/ghost-board' },
  ],
  insights: [
    { type: 'success', message: 'Season ticket renewals at 94%' },
    { type: 'info', message: 'Rival match tickets 98% sold' },
  ],
  creativeElement: { type: 'visualization', component: 'StadiumView', description: 'Live stadium analytics' },
};

// CUSTOM
export const customDashboard: VerticalDashboardConfig = {
  id: 'custom', name: 'Custom', tagline: 'Build your own industry configuration',
  heroMetric: { label: 'Your Key Metric', value: 'Configure', trend: 'Customize', icon: '⚙️' },
  kpis: [
    { id: 'kpi1', label: 'Custom KPI 1', value: '---', change: 0, icon: '📊', color: 'cyan' },
    { id: 'kpi2', label: 'Custom KPI 2', value: '---', change: 0, icon: '📈', color: 'emerald' },
    { id: 'kpi3', label: 'Custom KPI 3', value: '---', change: 0, icon: '📉', color: 'violet' },
    { id: 'kpi4', label: 'Custom KPI 4', value: '---', change: 0, icon: '💰', color: 'amber' },
  ],
  widgets: [
    { id: 'widget1', type: 'chart', title: 'Custom Widget 1', icon: '📊', size: 'large' },
    { id: 'widget2', type: 'map', title: 'Custom Widget 2', icon: '🗺️', size: 'medium' },
    { id: 'widget3', type: 'list', title: 'Custom Widget 3', icon: '📋', size: 'medium' },
    { id: 'widget4', type: 'gauge', title: 'Custom Widget 4', icon: '⚡', size: 'small' },
  ],
  quickActions: [
    { id: 'action1', label: 'Custom Action', icon: '⚡', path: '/cortex/council' },
    { id: 'config', label: 'Configure', icon: '⚙️', path: '/cortex/admin/vertical-config' },
  ],
  insights: [
    { type: 'info', message: 'Configure your industry-specific insights' },
  ],
  creativeElement: { type: 'visualization', component: 'CustomBuilder', description: 'Drag-drop configurator' },
};

// Export all extended dashboards
export const EXTENDED_DASHBOARDS: Record<string, VerticalDashboardConfig> = {
  energy: energyDashboard,
  government: governmentDashboard,
  legal: legalDashboard,
  retail: retailDashboard,
  'real-estate': realEstateDashboard,
  telecom: telecomDashboard,
  hospitality: hospitalityDashboard,
  education: educationDashboard,
  media: mediaDashboard,
  agriculture: agricultureDashboard,
  logistics: logisticsDashboard,
  insurance: insuranceDashboard,
  'non-profit': nonProfitDashboard,
  construction: constructionDashboard,
  mining: miningDashboard,
  aerospace: aerospaceDashboard,
  pharmaceuticals: pharmaceuticalsDashboard,
  automotive: automotiveDashboard,
  sports: sportsDashboard,
  custom: customDashboard,
};
