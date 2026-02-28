// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TREND SPARKLINE KIT
// Inline trend charts, anomaly detection cards, and trend badges
// =============================================================================

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Eye, X } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface SparklinePoint {
  value: number;
  label?: string;
}

export interface AnomalyItem {
  id: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  change: number; // percentage change
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: Date;
  sourceEntity?: string;
  sourcePage?: string;
}

// =============================================================================
// SPARKLINE — Inline SVG trend chart
// =============================================================================

export const Sparkline: React.FC<{
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showArea?: boolean;
  className?: string;
}> = ({
  data,
  width = 120,
  height = 32,
  color = '#60a5fa',
  fillColor,
  strokeWidth = 1.5,
  showDots = false,
  showArea = true,
  className = '',
}) => {
  const path = useMemo(() => {
    if (data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const w = width - padding * 2;
    const h = height - padding * 2;

    const points = data.map((v, i) => ({
      x: padding + (i / (data.length - 1)) * w,
      y: padding + h - ((v - min) / range) * h,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const areaPath = showArea
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return { linePath, areaPath, points };
  }, [data, width, height, showArea]);

  if (!path || data.length < 2) return null;

  const trend = data[data.length - 1] - data[0];
  const autoColor = trend > 0 ? '#34d399' : trend < 0 ? '#f87171' : '#9ca3af';
  const finalColor = color === 'auto' ? autoColor : color;

  return (
    <svg width={width} height={height} className={`inline-block ${className}`} viewBox={`0 0 ${width} ${height}`}>
      {showArea && (path as any).areaPath && (
        <path
          d={(path as any).areaPath}
          fill={fillColor || `${finalColor}20`}
        />
      )}
      <path
        d={(path as any).linePath}
        fill="none"
        stroke={finalColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots && (path as any).points?.map((p: any, i: number) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === data.length - 1 ? 2.5 : 1.5}
          fill={i === data.length - 1 ? finalColor : `${finalColor}80`}
        />
      ))}
    </svg>
  );
};

// =============================================================================
// SPARKLINE CELL — Table cell wrapper for sparklines
// =============================================================================

export const SparklineCell: React.FC<{
  data: number[];
  current: string | number;
  trend?: 'up' | 'down' | 'flat';
  color?: string;
}> = ({ data, current, trend, color = 'auto' }) => {
  const autoTrend = data.length >= 2
    ? data[data.length - 1] > data[0] ? 'up' : data[data.length - 1] < data[0] ? 'down' : 'flat'
    : 'flat';
  const t = trend || autoTrend;

  return (
    <div className="flex items-center gap-2">
      <Sparkline data={data} color={color} width={80} height={24} />
      <span className="font-mono font-bold text-sm text-white">{current}</span>
      {t === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
      {t === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
      {t === 'flat' && <Minus className="w-3 h-3 text-gray-400" />}
    </div>
  );
};

// =============================================================================
// TREND BADGE — Compact percentage change indicator
// =============================================================================

export const TrendBadge: React.FC<{
  value: number; // percentage change
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean; // true = negative is good (e.g., costs)
}> = ({ value, label, size = 'sm', inverted = false }) => {
  const isPositive = inverted ? value < 0 : value > 0;
  const isNegative = inverted ? value > 0 : value < 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-0.5',
    md: 'text-sm px-2 py-1 gap-1',
    lg: 'text-base px-3 py-1.5 gap-1',
  };

  const colorClasses = isPositive
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : isNegative
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${colorClasses}`}>
      {isPositive && <TrendingUp className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {isNegative && <TrendingDown className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {isNeutral && <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {value > 0 ? '+' : ''}{value.toFixed(1)}%
      {label && <span className="text-gray-500 ml-0.5">{label}</span>}
    </span>
  );
};

// =============================================================================
// ANOMALY CARD — Auto-detected unusual pattern
// =============================================================================

export const AnomalyCard: React.FC<{
  anomaly: AnomalyItem;
  onDismiss?: (id: string) => void;
  onInvestigate?: (anomaly: AnomalyItem) => void;
}> = ({ anomaly, onDismiss, onInvestigate }) => {
  const severityStyles = {
    critical: { bg: 'bg-red-500/10 border-red-500/40', icon: 'text-red-400', pulse: 'animate-pulse' },
    high: { bg: 'bg-amber-500/10 border-amber-500/40', icon: 'text-amber-400', pulse: '' },
    medium: { bg: 'bg-blue-500/10 border-blue-500/40', icon: 'text-blue-400', pulse: '' },
    low: { bg: 'bg-gray-500/10 border-gray-500/40', icon: 'text-gray-400', pulse: '' },
  };

  const style = severityStyles[anomaly.severity];

  return (
    <div className={`relative rounded-xl border p-4 ${style.bg} ${style.pulse}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${style.icon}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-white truncate">{anomaly.title}</h4>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              anomaly.severity === 'critical' ? 'bg-red-500 text-white' :
              anomaly.severity === 'high' ? 'bg-amber-500 text-black' :
              anomaly.severity === 'medium' ? 'bg-blue-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {anomaly.severity}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{anomaly.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white">{anomaly.metric}</span>
              <span className="text-xs text-gray-500">{anomaly.metricLabel}</span>
            </div>
            <TrendBadge value={anomaly.change} />
            <span className="text-[10px] text-gray-600">
              {anomaly.detectedAt.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onInvestigate && (
            <button
              onClick={() => onInvestigate(anomaly)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Investigate"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(anomaly.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ANOMALY BANNER — Horizontal strip showing detected anomalies
// =============================================================================

export const AnomalyBanner: React.FC<{
  anomalies: AnomalyItem[];
  maxVisible?: number;
  onDismiss?: (id: string) => void;
  onInvestigate?: (anomaly: AnomalyItem) => void;
  onViewAll?: () => void;
}> = ({ anomalies, maxVisible = 3, onDismiss, onInvestigate, onViewAll }) => {
  if (anomalies.length === 0) return null;

  const visible = anomalies.slice(0, maxVisible);
  const remaining = anomalies.length - maxVisible;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-400">
            {anomalies.length} Anomal{anomalies.length === 1 ? 'y' : 'ies'} Detected
          </h3>
        </div>
        {remaining > 0 && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all {anomalies.length} →
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {visible.map((a) => (
          <AnomalyCard
            key={a.id}
            anomaly={a}
            onDismiss={onDismiss}
            onInvestigate={onInvestigate}
          />
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// METRIC WITH SPARKLINE — Enhanced metric card with embedded trend
// =============================================================================

export const MetricWithSparkline: React.FC<{
  title: string;
  value: string | number;
  trend: number[]; // historical values for sparkline
  change?: number; // percentage change
  icon?: React.ReactNode;
  color?: string;
  inverted?: boolean;
  onClick?: () => void;
}> = ({ title, value, trend, change, icon, color = '#60a5fa', inverted, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-gray-500 hover:bg-gray-800/70' : ''} transition-all`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{title}</span>
      {icon && <div className="text-gray-500">{icon}</div>}
    </div>
    <div className="flex items-end justify-between gap-3">
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change !== undefined && (
          <TrendBadge value={change} inverted={inverted} size="sm" />
        )}
      </div>
      <Sparkline data={trend} color={color} width={80} height={32} showDots />
    </div>
  </div>
);
