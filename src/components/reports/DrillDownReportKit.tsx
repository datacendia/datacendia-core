// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DRILL-DOWN REPORT KIT
// Reusable components for multi-level drill-down reports across all platform
// sections. Provides: expandable panels, data tables, mini-charts, POI cards,
// and report sections with breadcrumb navigation.
// =============================================================================

import React, { useState, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import {
  ChevronDown, ChevronRight, ChevronUp, ArrowLeft,
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  CheckCircle, XCircle, Info, Eye, Download,
  BarChart3, Table2, Lightbulb, Search, Filter,
  ArrowUpRight, ArrowDownRight, ExternalLink,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface DrillLevel {
  id: string;
  label: string;
  data?: any;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

export interface TableRow {
  [key: string]: any;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  meta?: string;
}

export interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'positive';
  metric?: string;
  metricLabel?: string;
  action?: string;
  onClick?: () => void;
}

type ViewMode = 'table' | 'chart' | 'poi';

// =============================================================================
// DRILL-DOWN PANEL — Expandable section with multi-level navigation
// =============================================================================

interface DrillDownPanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  level?: number;
  badge?: string | number;
  badgeColor?: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
  onDrillDown?: () => void;
  drillDownLabel?: string;
}

export const DrillDownPanel: React.FC<DrillDownPanelProps> = ({
  title, subtitle, icon, defaultOpen = false, level = 0, badge,
  badgeColor = 'bg-blue-500/20 text-blue-400', accentColor = 'border-blue-500/30',
  children, className, onDrillDown, drillDownLabel,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      'rounded-xl border transition-all',
      level === 0 ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 bg-white/[0.02]',
      isOpen && level === 0 && accentColor,
      className,
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={cn('font-semibold', level === 0 ? 'text-sm' : 'text-xs')}>
                {title}
              </span>
              {badge !== undefined && (
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', badgeColor)}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDrillDown && (
            <button
              onClick={(e) => { e.stopPropagation(); onDrillDown(); }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
            >
              <Eye className="w-3 h-3" />
              {drillDownLabel || 'Details'}
            </button>
          )}
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </button>
      {isOpen && (
        <div className={cn('px-4 pb-4', level > 0 && 'pl-6')}>
          {children}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// BREADCRUMB NAV — For multi-level drill-down navigation
// =============================================================================

interface BreadcrumbNavProps {
  levels: DrillLevel[];
  onNavigate: (levelIndex: number) => void;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ levels, onNavigate, className }) => {
  if (levels.length <= 1) return null;
  return (
    <div className={cn('flex items-center gap-1 text-xs mb-4', className)}>
      {levels.map((level, i) => (
        <React.Fragment key={level.id}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
          <button
            onClick={() => onNavigate(i)}
            className={cn(
              'px-2 py-1 rounded transition-colors',
              i === levels.length - 1
                ? 'text-white font-medium bg-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {level.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

// =============================================================================
// DATA TABLE — Sortable, filterable table with row click drill-down
// =============================================================================

interface DataTableProps {
  columns: TableColumn[];
  data: TableRow[];
  onRowClick?: (row: TableRow) => void;
  maxRows?: number;
  searchable?: boolean;
  title?: string;
  emptyMessage?: string;
  className?: string;
  compact?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns, data, onRowClick, maxRows, searchable = false,
  title, emptyMessage = 'No data available', className, compact = false,
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    if (maxRows) result = result.slice(0, maxRows);
    return result;
  }, [data, search, sortKey, sortDir, columns, maxRows]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('rounded-lg border border-white/10 overflow-hidden', className)}>
      {(title || searchable) && (
        <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5">
          {title && (
            <div className="flex items-center gap-2">
              <Table2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">{title}</span>
              <span className="text-[10px] text-slate-500">({filteredData.length})</span>
            </div>
          )}
          {searchable && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs">
              <Search className="w-3 h-3 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-24"
              />
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left font-medium text-slate-400 px-3',
                    compact ? 'py-1.5' : 'py-2',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.sortable && 'cursor-pointer hover:text-white transition-colors',
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-white/[0.03] transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-white/[0.05]',
                  )}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 text-slate-300',
                        compact ? 'py-1.5' : 'py-2.5',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                      )}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {maxRows && data.length > maxRows && (
        <div className="px-3 py-2 text-center text-[10px] text-slate-500 border-t border-white/5">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MINI BAR CHART — Simple horizontal bar chart for drill-down views
// =============================================================================

interface MiniBarChartProps {
  data: ChartDataPoint[];
  maxValue?: number;
  title?: string;
  className?: string;
  onBarClick?: (point: ChartDataPoint) => void;
  showValues?: boolean;
  barHeight?: number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data, maxValue, title, className, onBarClick, showValues = true, barHeight = 24,
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <div className={cn('space-y-1', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">{title}</span>
        </div>
      )}
      {data.map((point, i) => (
        <div
          key={i}
          className={cn('group', onBarClick && 'cursor-pointer')}
          onClick={() => onBarClick?.(point)}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors truncate max-w-[60%]">
              {point.label}
            </span>
            {showValues && (
              <span className="text-[10px] font-mono text-slate-400">
                {point.value}{point.meta ? ` ${point.meta}` : ''}
              </span>
            )}
          </div>
          <div className="w-full bg-white/5 rounded-full overflow-hidden" style={{ height: `${Math.max(barHeight / 3, 4)}px` }}>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 group-hover:brightness-125',
                point.color || 'bg-blue-500',
              )}
              style={{ width: `${Math.min((point.value / max) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// DONUT CHART — Simple donut/ring chart for summary views
// =============================================================================

interface DonutChartProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  value, max = 100, label, sublabel, size = 80, strokeWidth = 8, color = '#3b82f6', className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-white/5" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold text-white">{typeof value === 'number' ? value.toFixed(0) : value}</span>
        {sublabel && <span className="text-[8px] text-slate-500 uppercase">{sublabel}</span>}
      </div>
      {label && <span className="text-[10px] text-slate-400 mt-1">{label}</span>}
    </div>
  );
};

// =============================================================================
// TREND INDICATOR — Shows value with trend arrow
// =============================================================================

interface TrendIndicatorProps {
  value: number | string;
  trend: 'up' | 'down' | 'flat';
  label: string;
  suffix?: string;
  positive?: 'up' | 'down';
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value, trend, label, suffix = '', positive = 'up', className,
}) => {
  const isGood = (trend === 'up' && positive === 'up') || (trend === 'down' && positive === 'down');
  const isBad = (trend === 'up' && positive === 'down') || (trend === 'down' && positive === 'up');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        isGood ? 'bg-emerald-500/20' : isBad ? 'bg-red-500/20' : 'bg-slate-500/20',
      )}>
        {trend === 'up' && <TrendingUp className={cn('w-3.5 h-3.5', isGood ? 'text-emerald-400' : 'text-red-400')} />}
        {trend === 'down' && <TrendingDown className={cn('w-3.5 h-3.5', isGood ? 'text-emerald-400' : 'text-red-400')} />}
        {trend === 'flat' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
      </div>
      <div>
        <span className="text-sm font-bold text-white">{value}{suffix}</span>
        <span className="text-[10px] text-slate-500 ml-1">{label}</span>
      </div>
    </div>
  );
};

// =============================================================================
// POINTS OF INTEREST — Highlighted insight cards
// =============================================================================

interface POICardProps {
  poi: PointOfInterest;
  className?: string;
}

const severityConfig = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle, iconColor: 'text-red-400', label: 'CRITICAL' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle, iconColor: 'text-orange-400', label: 'HIGH' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-400', label: 'MEDIUM' },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info, iconColor: 'text-blue-400', label: 'LOW' },
  info: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: Info, iconColor: 'text-slate-400', label: 'INFO' },
  positive: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle, iconColor: 'text-emerald-400', label: 'POSITIVE' },
};

export const POICard: React.FC<POICardProps> = ({ poi, className }) => {
  const cfg = severityConfig[poi.severity];
  const Icon = cfg.icon;

  return (
    <div
      className={cn('rounded-lg border p-3 transition-all', cfg.bg, cfg.border, poi.onClick && 'cursor-pointer hover:brightness-125', className)}
      onClick={poi.onClick}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', cfg.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-white">{poi.title}</span>
            <span className={cn('text-[8px] px-1 py-0.5 rounded font-bold', cfg.bg, cfg.iconColor)}>{cfg.label}</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">{poi.description}</p>
          {poi.metric && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-bold text-white">{poi.metric}</span>
              {poi.metricLabel && <span className="text-[10px] text-slate-500">{poi.metricLabel}</span>}
            </div>
          )}
          {poi.action && (
            <button className="mt-2 flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
              <ExternalLink className="w-3 h-3" />
              {poi.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface POIListProps {
  items: PointOfInterest[];
  title?: string;
  maxItems?: number;
  className?: string;
}

export const POIList: React.FC<POIListProps> = ({ items, title, maxItems, className }) => {
  const display = maxItems ? items.slice(0, maxItems) : items;
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">{title}</span>
          <span className="text-[10px] text-slate-500">({items.length})</span>
        </div>
      )}
      {display.map(poi => <POICard key={poi.id} poi={poi} />)}
      {maxItems && items.length > maxItems && (
        <p className="text-[10px] text-slate-500 text-center">+{items.length - maxItems} more insights</p>
      )}
    </div>
  );
};

// =============================================================================
// REPORT SECTION — Full drill-down report with view mode toggle
// =============================================================================

interface ReportSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tableColumns?: TableColumn[];
  tableData?: TableRow[];
  chartData?: ChartDataPoint[];
  chartTitle?: string;
  poiItems?: PointOfInterest[];
  onRowClick?: (row: TableRow) => void;
  onBarClick?: (point: ChartDataPoint) => void;
  defaultView?: ViewMode;
  className?: string;
  children?: React.ReactNode;
  accentColor?: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  title, subtitle, icon, tableColumns, tableData, chartData, chartTitle,
  poiItems, onRowClick, onBarClick, defaultView = 'table', className,
  children, accentColor,
}) => {
  const availableViews: ViewMode[] = [];
  if (tableColumns && tableData) availableViews.push('table');
  if (chartData) availableViews.push('chart');
  if (poiItems) availableViews.push('poi');

  const [view, setView] = useState<ViewMode>(
    availableViews.includes(defaultView) ? defaultView : availableViews[0] || 'table'
  );

  const viewIcons: Record<ViewMode, React.ReactNode> = {
    table: <Table2 className="w-3 h-3" />,
    chart: <BarChart3 className="w-3 h-3" />,
    poi: <Lightbulb className="w-3 h-3" />,
  };

  const viewLabels: Record<ViewMode, string> = {
    table: 'Table',
    chart: 'Chart',
    poi: 'Insights',
  };

  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {availableViews.length > 1 && (
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            {availableViews.map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
                  view === v ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
                )}
              >
                {viewIcons[v]}
                {viewLabels[v]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        {children}
        {view === 'table' && tableColumns && tableData && (
          <DataTable columns={tableColumns} data={tableData} onRowClick={onRowClick} searchable={tableData.length > 5} />
        )}
        {view === 'chart' && chartData && (
          <MiniBarChart data={chartData} title={chartTitle} onBarClick={onBarClick} />
        )}
        {view === 'poi' && poiItems && (
          <POIList items={poiItems} />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// STATUS BADGE — Reusable status indicator
// =============================================================================

interface StatusBadgeProps {
  status: 'implemented' | 'partial' | 'not_implemented' | 'active' | 'inactive' | 'warning' | 'error' | 'success';
  label?: string;
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; defaultLabel: string }> = {
  implemented: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', defaultLabel: 'Implemented' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', defaultLabel: 'Active' },
  success: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', defaultLabel: 'Success' },
  partial: { bg: 'bg-amber-500/20', text: 'text-amber-400', defaultLabel: 'Partial' },
  warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', defaultLabel: 'Warning' },
  not_implemented: { bg: 'bg-red-500/20', text: 'text-red-400', defaultLabel: 'Not Implemented' },
  error: { bg: 'bg-red-500/20', text: 'text-red-400', defaultLabel: 'Error' },
  inactive: { bg: 'bg-slate-500/20', text: 'text-slate-400', defaultLabel: 'Inactive' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const s = statusStyles[status] || statusStyles.inactive;
  return (
    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', s.bg, s.text, className)}>
      {label || s.defaultLabel}
    </span>
  );
};

// =============================================================================
// METRIC CARD — Clickable stat card with drill-down
// =============================================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  onClick?: () => void;
  accentColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, sublabel, icon, trend, trendValue, onClick, accentColor = 'border-blue-500/20', className,
}) => (
  <div
    className={cn(
      'rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all',
      onClick && 'cursor-pointer hover:bg-white/[0.06] hover:border-white/20',
      className,
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      {onClick && <ChevronRight className="w-3 h-3 text-slate-500" />}
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="flex items-center gap-2 mt-1">
      {sublabel && <span className="text-[10px] text-slate-500">{sublabel}</span>}
      {trend && trendValue && (
        <span className={cn('flex items-center gap-0.5 text-[10px]',
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400',
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {trendValue}
        </span>
      )}
    </div>
  </div>
);

export default {
  DrillDownPanel, BreadcrumbNav, DataTable, MiniBarChart, DonutChart,
  TrendIndicator, POICard, POIList, ReportSection, StatusBadge, MetricCard,
};
