// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// HEATMAP & TIMELINE KIT
// GitHub-style heatmap calendar and vertical audit timeline
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  User,
  Zap,
  FileText,
  Settings,
  Eye,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  value: number;
  label?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'decision' | 'override' | 'escalation' | 'deployment' | 'compliance' | 'alert' | 'system' | 'audit';
  title: string;
  description: string;
  actor?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  metadata?: Record<string, string | number>;
  linkedEntity?: { type: string; id: string; label: string };
}

// =============================================================================
// HEATMAP CALENDAR — GitHub-style activity density grid
// =============================================================================

const DAYS_OF_WEEK = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HeatmapCalendar: React.FC<{
  data: HeatmapDay[];
  weeks?: number;
  colorScale?: string[];
  title?: string;
  subtitle?: string;
  valueLabel?: string;
  onDayClick?: (day: HeatmapDay) => void;
}> = ({
  data,
  weeks = 52,
  colorScale = ['#1a1a2e', '#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa'],
  title = 'Activity Heatmap',
  subtitle,
  valueLabel = 'actions',
  onDayClick,
}) => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { grid, monthLabels, maxValue } = useMemo(() => {
    const dataMap = new Map(data.map(d => [d.date, d]));
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - weeks * 7);

    // Align to Monday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - ((dayOfWeek + 6) % 7));

    const grid: (HeatmapDay | null)[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    let maxVal = 0;

    for (let w = 0; w < weeks; w++) {
      const week: (HeatmapDay | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);

        if (date > today) {
          week.push(null);
          continue;
        }

        const dateStr = date.toISOString().split('T')[0];
        const entry = dataMap.get(dateStr) || { date: dateStr, value: 0 };
        if (entry.value > maxVal) maxVal = entry.value;

        const month = date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTHS[month], col: w });
          lastMonth = month;
        }

        week.push(entry);
      }
      grid.push(week);
    }

    return { grid, monthLabels, maxValue: maxVal };
  }, [data, weeks]);

  const getColor = (value: number) => {
    if (value === 0) return colorScale[0];
    const idx = Math.min(
      Math.ceil((value / Math.max(maxValue, 1)) * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[idx];
  };

  const cellSize = 12;
  const cellGap = 2;

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            {title}
          </h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          Less
          {colorScale.map((c, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: c }}
            />
          ))}
          More
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: weeks * (cellSize + cellGap) + 30 }}>
          {/* Month labels */}
          <div className="flex ml-8 mb-1" style={{ gap: 0 }}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-gray-500 absolute"
                style={{ left: 32 + m.col * (cellSize + cellGap) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex mt-4">
            {/* Day labels */}
            <div className="flex flex-col mr-1" style={{ gap: cellGap }}>
              {DAYS_OF_WEEK.map((day, i) => (
                <div
                  key={i}
                  className="text-[10px] text-gray-500 flex items-center justify-end"
                  style={{ height: cellSize, width: 28 }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: cellGap }}>
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`rounded-sm transition-all ${day && onDayClick ? 'cursor-pointer hover:ring-1 hover:ring-white/30' : ''}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: day ? getColor(day.value) : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (day) {
                          setHoveredDay(day);
                          setTooltipPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() => day && onDayClick?.(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
          style={{ left: tooltipPos.x + 10, top: tooltipPos.y - 40 }}
        >
          <div className="font-semibold text-white">{hoveredDay.value} {valueLabel}</div>
          <div className="text-gray-400">{hoveredDay.date}</div>
          {hoveredDay.label && <div className="text-gray-500">{hoveredDay.label}</div>}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// AUDIT TIMELINE — Vertical chronological event log
// =============================================================================

const EVENT_TYPE_CONFIG: Record<TimelineEvent['type'], { icon: React.ElementType; color: string; bg: string }> = {
  decision: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  override: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  escalation: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
  deployment: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  compliance: { icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  alert: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  system: { icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  audit: { icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

export const AuditTimeline: React.FC<{
  events: TimelineEvent[];
  title?: string;
  maxVisible?: number;
  showFilters?: boolean;
  onEventClick?: (event: TimelineEvent) => void;
}> = ({
  events,
  title = 'Audit Trail',
  maxVisible = 20,
  showFilters = true,
  onEventClick,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TimelineEvent['type'] | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (typeFilter !== 'all') result = result.filter(e => e.type === typeFilter);
    if (severityFilter !== 'all') result = result.filter(e => e.severity === severityFilter);
    return result;
  }, [events, typeFilter, severityFilter]);

  const visible = expanded ? filtered : filtered.slice(0, maxVisible);

  const eventTypes: TimelineEvent['type'][] = ['decision', 'override', 'escalation', 'deployment', 'compliance', 'alert', 'system', 'audit'];

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          {title}
          <span className="text-gray-500 font-normal">({filtered.length} events)</span>
        </h3>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="w-3 h-3 text-gray-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
          >
            <option value="all">All Types</option>
            {eventTypes.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-700" />

        <div className="space-y-1">
          {visible.map((event, i) => {
            const config = EVENT_TYPE_CONFIG[event.type];
            const Icon = config.icon;
            const isFirst = i === 0;

            return (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={`relative flex items-start gap-3 pl-2 py-2 rounded-lg transition-colors ${
                  onEventClick ? 'cursor-pointer hover:bg-gray-800/50' : ''
                } ${isFirst ? 'bg-gray-800/30' : ''}`}
              >
                {/* Icon */}
                <div className={`relative z-10 p-1.5 rounded-lg ${config.bg} flex-shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{event.title}</span>
                    {event.severity && event.severity !== 'info' && (
                      <span className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase ${
                        event.severity === 'critical' ? 'bg-red-500/30 text-red-400' :
                        event.severity === 'high' ? 'bg-amber-500/30 text-amber-400' :
                        event.severity === 'medium' ? 'bg-blue-500/30 text-blue-400' :
                        'bg-gray-500/30 text-gray-400'
                      }`}>
                        {event.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{event.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                    <span>{event.timestamp.toLocaleString()}</span>
                    {event.actor && (
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" /> {event.actor}
                      </span>
                    )}
                    {event.linkedEntity && (
                      <span className="text-blue-400 hover:underline">
                        {event.linkedEntity.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more/less */}
        {filtered.length > maxVisible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-white bg-gray-800/50 rounded-lg transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Show less</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> Show {filtered.length - maxVisible} more events</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
