// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * VERTICAL DASHBOARD COMPONENT
 * Renders distinctive dashboard based on selected industry vertical
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useVerticalConfig } from '../../contexts/VerticalConfigContext';
import { VERTICAL_DASHBOARDS } from '../../config/verticalDashboards';
import { EXTENDED_DASHBOARDS } from '../../config/verticalDashboardsExtended';
import type { VerticalDashboardConfig, DashboardWidget } from '../../config/verticalDashboards';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Sparkles } from 'lucide-react';
import { FleetTrackingMap } from './widgets/FleetTrackingMap';
import { MarketPulse } from './widgets/MarketPulse';
import { HospitalFloorMap } from './widgets/HospitalFloorMap';
import { ProductionLineStatus } from './widgets/ProductionLineStatus';
import { SystemHealthMatrix } from './widgets/SystemHealthMatrix';
import { CivicSimulation } from './widgets/CivicSimulation';
import { PowerGridVisualization } from './widgets/PowerGridVisualization';
import { RetailStoreDashboard } from './widgets/RetailStoreDashboard';
import { StudentSuccessDashboard } from './widgets/StudentSuccessDashboard';
import { PropertyPortfolio } from './widgets/PropertyPortfolio';
import { LegalCaseManagement } from './widgets/LegalCaseManagement';
import { InsuranceClaimsDashboard } from './widgets/InsuranceClaimsDashboard';
import { TelecomNetworkDashboard } from './widgets/TelecomNetworkDashboard';
import { HospitalityDashboard } from './widgets/HospitalityDashboard';
import { AgricultureDashboard } from './widgets/AgricultureDashboard';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

// Merge all dashboards
const ALL_DASHBOARDS: Record<string, VerticalDashboardConfig> = {
  ...VERTICAL_DASHBOARDS,
  ...EXTENDED_DASHBOARDS,
};

// =============================================================================
// WIDGET COMPONENTS
// =============================================================================

const MetricCard: React.FC<{
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}> = ({ label, value, change, icon, color }) => {
  const colorClasses: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-600/5 border-fuchsia-500/30',
  };

  return (
    <div className={cn(
      'relative p-4 rounded-xl border bg-gradient-to-br',
      colorClasses[color] || colorClasses.cyan
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {change > 0 ? (
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        ) : change < 0 ? (
          <TrendingDown className="w-3 h-3 text-red-400" />
        ) : (
          <Minus className="w-3 h-3 text-gray-400" />
        )}
        <span className={cn(
          'text-xs font-medium',
          change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
        )}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  );
};

const WidgetRenderer: React.FC<{ widget: DashboardWidget; verticalId: string }> = ({ widget, verticalId }) => {
  const sizeClasses: Record<string, string> = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2 md:col-span-1',
    large: 'col-span-2 row-span-2',
    full: 'col-span-full row-span-2',
  };

  const typeGradients: Record<string, string> = {
    chart: 'from-cyan-900/30 to-cyan-950/10',
    map: 'from-emerald-900/30 to-emerald-950/10',
    sankey: 'from-violet-900/30 to-violet-950/10',
    heatmap: 'from-orange-900/30 to-orange-950/10',
    timeline: 'from-blue-900/30 to-blue-950/10',
    radar: 'from-fuchsia-900/30 to-fuchsia-950/10',
    treemap: 'from-amber-900/30 to-amber-950/10',
    gauge: 'from-rose-900/30 to-rose-950/10',
    list: 'from-slate-900/30 to-slate-950/10',
    custom: 'from-indigo-900/30 to-indigo-950/10',
  };

  // Render real interactive widgets for specific verticals
  const renderWidgetContent = () => {
    // Logistics - Fleet Tracking Map
    if (verticalId === 'logistics' && widget.id === 'fleet' && widget.type === 'map') {
      return <FleetTrackingMap className="h-full min-h-[300px]" />;
    }

    // Financial - Market Pulse
    if (verticalId === 'financial' && widget.id === 'market-pulse') {
      return <MarketPulse className="h-full min-h-[300px]" />;
    }

    // Healthcare - Hospital Floor Map
    if (verticalId === 'healthcare' && widget.id === 'patient-flow') {
      return <HospitalFloorMap className="h-full min-h-[300px]" />;
    }

    // Manufacturing - Production Line Status
    if (verticalId === 'manufacturing' && widget.id === 'production') {
      return <ProductionLineStatus className="h-full min-h-[300px]" />;
    }

    // Technology - System Health Matrix
    if (verticalId === 'technology' && widget.id === 'health') {
      return <SystemHealthMatrix className="h-full min-h-[300px]" />;
    }

    // Government - Civic Simulation
    if (verticalId === 'government' && widget.id === 'civic-simulation') {
      return <CivicSimulation className="h-full min-h-[300px]" />;
    }

    // Energy - Power Grid Visualization
    if (verticalId === 'energy' && widget.id === 'grid') {
      return <PowerGridVisualization className="h-full min-h-[300px]" />;
    }

    // Retail - Store Dashboard
    if (verticalId === 'retail' && widget.id === 'store-performance') {
      return <RetailStoreDashboard className="h-full min-h-[300px]" />;
    }

    // Education - Student Success
    if (verticalId === 'education' && widget.id === 'student-success') {
      return <StudentSuccessDashboard className="h-full min-h-[300px]" />;
    }

    // Real Estate - Property Portfolio
    if (verticalId === 'real-estate' && widget.id === 'portfolio') {
      return <PropertyPortfolio className="h-full min-h-[300px]" />;
    }

    // Legal - Case Management
    if (verticalId === 'legal' && widget.id === 'matters') {
      return <LegalCaseManagement className="h-full min-h-[300px]" />;
    }

    // Insurance - Claims Dashboard
    if (verticalId === 'insurance' && widget.id === 'claims') {
      return <InsuranceClaimsDashboard className="h-full min-h-[300px]" />;
    }

    // Telecom - Network Dashboard
    if (verticalId === 'telecom' && widget.id === 'network') {
      return <TelecomNetworkDashboard className="h-full min-h-[300px]" />;
    }

    // Hospitality - Property Performance
    if (verticalId === 'hospitality' && widget.id === 'property') {
      return <HospitalityDashboard className="h-full min-h-[300px]" />;
    }

    // Agriculture - Field Dashboard
    if (verticalId === 'agriculture' && widget.id === 'field') {
      return <AgricultureDashboard className="h-full min-h-[300px]" />;
    }

    // Default placeholder for other widgets
    return (
      <div className="flex-1 flex items-center justify-center min-h-[100px] rounded-lg bg-sovereign-base/50 border border-sovereign-border-subtle">
        <div className="text-center text-gray-500">
          <p className="text-xs uppercase tracking-wider">{widget.type}</p>
          <p className="text-[10px] mt-1 opacity-60">Interactive widget</p>
        </div>
      </div>
    );
  };

  // Check if widget has real interactive content
  const hasRealWidget = 
    (verticalId === 'logistics' && widget.id === 'fleet') ||
    (verticalId === 'financial' && widget.id === 'market-pulse') ||
    (verticalId === 'healthcare' && widget.id === 'patient-flow') ||
    (verticalId === 'manufacturing' && widget.id === 'production') ||
    (verticalId === 'technology' && widget.id === 'health') ||
    (verticalId === 'government' && widget.id === 'civic-simulation') ||
    (verticalId === 'energy' && widget.id === 'grid') ||
    (verticalId === 'retail' && widget.id === 'store-performance') ||
    (verticalId === 'education' && widget.id === 'student-success') ||
    (verticalId === 'real-estate' && widget.id === 'portfolio') ||
    (verticalId === 'legal' && widget.id === 'matters') ||
    (verticalId === 'insurance' && widget.id === 'claims') ||
    (verticalId === 'telecom' && widget.id === 'network') ||
    (verticalId === 'hospitality' && widget.id === 'property') ||
    (verticalId === 'agriculture' && widget.id === 'field');

  return (
    <div className={cn(
      'relative rounded-xl border border-sovereign-border bg-gradient-to-br overflow-hidden',
      hasRealWidget ? 'p-0' : 'p-4',
      sizeClasses[widget.size],
      typeGradients[widget.type] || typeGradients.custom
    )}>
      {!hasRealWidget && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{widget.icon}</span>
          <h3 className="text-sm font-semibold text-white">{widget.title}</h3>
        </div>
      )}
      {renderWidgetContent()}
    </div>
  );
};

const InsightCard: React.FC<{
  type: 'success' | 'warning' | 'info' | 'critical';
  message: string;
}> = ({ type, message }) => {
  const styles = {
    success: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', icon: '✓' },
    warning: { bg: 'bg-amber-900/20', border: 'border-amber-500/30', icon: '⚠' },
    info: { bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', icon: 'ℹ' },
    critical: { bg: 'bg-red-900/20', border: 'border-red-500/30', icon: '!' },
  } as const;

  const style = styles[type];

  return (
    <div className={cn('flex items-start gap-2 p-3 rounded-lg border', style.bg, style.border)}>
      <span className="text-sm">{style.icon}</span>
      <p className="text-xs text-gray-300">{message}</p>
    </div>
  );
};

// =============================================================================
// CREATIVE ELEMENT COMPONENTS
// =============================================================================

const CreativeElement: React.FC<{ config: VerticalDashboardConfig['creativeElement']; verticalId: string }> = ({ config, verticalId }) => {
  // Industry-specific animated elements
  const animations: Record<string, React.ReactNode> = {
    financial: (
      <div className="relative h-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center animate-scroll-left">
          {['AAPL +2.4%', 'MSFT +1.2%', 'GOOGL -0.8%', 'AMZN +3.1%', 'META +1.8%'].map((ticker, i) => (
            <span key={i} className="mx-4 text-xs font-mono text-cyan-400">{ticker}</span>
          ))}
        </div>
      </div>
    ),
    healthcare: (
      <div className="h-12 flex items-center justify-center">
        <svg className="w-full h-8" viewBox="0 0 200 40">
          <path
            d="M0,20 Q25,20 30,10 T40,20 T50,5 T60,20 T70,20 Q95,20 100,20 T110,10 T120,20 T130,5 T140,20 T150,20 Q175,20 180,10 T190,20 T200,20"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    ),
    manufacturing: (
      <div className="h-12 flex items-center gap-2">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex-1 h-2 bg-sovereign-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 animate-pulse"
              style={{ width: `${70 + i * 5}%`, animationDelay: `${i * 200}ms` }}
            />
          </div>
        ))}
      </div>
    ),
    technology: (
      <div className="h-12 grid grid-cols-6 gap-1">
        {Array(18).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              'rounded-sm transition-colors duration-500',
              deterministicFloat('vertical-1') > 0.3 ? 'bg-emerald-500/60' : 'bg-amber-500/60'
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    ),
  };

  return (
    <div className="mt-4 p-3 rounded-lg bg-sovereign-base/50 border border-sovereign-border-subtle">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] uppercase tracking-wider text-gray-500">{config.description}</span>
      </div>
      {animations[verticalId] || (
        <div className="h-12 flex items-center justify-center text-gray-600 text-xs">
          {config.component}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface VerticalDashboardProps {
  overrideVerticalId?: string;
}

export const VerticalDashboard: React.FC<VerticalDashboardProps> = ({ overrideVerticalId }) => {
  const navigate = useNavigate();
  const { currentVertical, isInitialized } = useVerticalConfig();

  // Get dashboard config for current vertical (or override)
  const verticalId = overrideVerticalId || currentVertical?.id || 'technology';
  const dashboardConfig = ALL_DASHBOARDS[verticalId] ?? ALL_DASHBOARDS['technology'];

  if (!isInitialized || !dashboardConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Hero Metric */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sovereign-elevated to-sovereign-base border border-sovereign-border p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{dashboardConfig.heroMetric.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{dashboardConfig.name}</h1>
                <p className="text-sm text-gray-400">{dashboardConfig.tagline}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">{dashboardConfig.heroMetric.label}</p>
            <p className="text-4xl font-bold text-white">{dashboardConfig.heroMetric.value}</p>
            <p className="text-sm text-cyan-400">{dashboardConfig.heroMetric.trend}</p>
          </div>
        </div>

        <CreativeElement config={dashboardConfig.creativeElement} verticalId={verticalId} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardConfig.kpis.map(kpi => (
          <MetricCard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[120px]">
        {dashboardConfig.widgets.map(widget => (
          <WidgetRenderer key={widget.id} widget={widget} verticalId={verticalId} />
        ))}
      </div>

      {/* Bottom Section: Quick Actions + Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl border border-sovereign-border bg-sovereign-elevated p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h3>
          <div className="space-y-2">
            {dashboardConfig.quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-sovereign-base hover:bg-sovereign-hover border border-sovereign-border-subtle transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm text-gray-300">{action.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border border-sovereign-border bg-sovereign-elevated p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>🧠</span> AI Insights
          </h3>
          <div className="space-y-2">
            {dashboardConfig.insights.map((insight, i) => (
              <InsightCard key={i} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalDashboard;
