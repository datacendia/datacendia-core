// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — CONSISTENT PAGE HEADER PATTERN
// =============================================================================
// Every page uses this header: Tier badge, title, description, status, actions.
// Architecture: Bloomberg density, Palantir sophistication, AWS organization.

import React from 'react';
import { cn } from '../../../lib/utils';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Tier color system
const TIER_STYLES = {
  foundation: {
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    accent: 'text-blue-400',
    dot: 'bg-blue-400',
    label: 'FOUNDATION',
  },
  enterprise: {
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    accent: 'text-purple-400',
    dot: 'bg-purple-400',
    label: 'ENTERPRISE',
  },
  strategic: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accent: 'text-amber-400',
    dot: 'bg-amber-400',
    label: 'STRATEGIC',
  },
  system: {
    badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    accent: 'text-gray-400',
    dot: 'bg-gray-400',
    label: 'SYSTEM',
  },
} as const;

type Tier = keyof typeof TIER_STYLES;

// Status indicator
type PageStatus = 'operational' | 'warning' | 'critical' | 'loading';

const STATUS_STYLES: Record<PageStatus, { icon: React.FC<{ className?: string }>; color: string; label: string }> = {
  operational: { icon: CheckCircle, color: 'text-green-400', label: 'Operational' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', label: 'Warning' },
  critical: { icon: XCircle, color: 'text-red-400', label: 'Critical' },
  loading: { icon: Activity, color: 'text-cyan-400', label: 'Loading...' },
};

interface PageHeaderProps {
  title: string;
  description?: string;
  tier?: Tier;
  pillar?: string;
  status?: PageStatus;
  statusLabel?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badges?: Array<{ label: string; variant?: 'default' | 'success' | 'warning' | 'danger' }>;
  className?: string;
}

const BADGE_VARIANTS = {
  default: 'bg-slate-700/50 text-slate-300 border-slate-600',
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  tier,
  pillar,
  status,
  statusLabel,
  icon,
  actions,
  badges,
  className,
}) => {
  const tierStyle = tier ? TIER_STYLES[tier] : null;
  const statusStyle = status ? STATUS_STYLES[status] : null;

  return (
    <div className={cn('px-6 py-5 border-b border-sovereign-border-subtle bg-sovereign-elevated/50', className)}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Title block */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Icon */}
          {icon && (
            <div className={cn(
              'p-2.5 rounded-xl border',
              tierStyle ? tierStyle.badge : 'bg-slate-800 border-slate-700'
            )}>
              {icon}
            </div>
          )}

          <div className="min-w-0">
            {/* Tier + Pillar context */}
            <div className="flex items-center gap-2 mb-1">
              {tierStyle && (
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border',
                  tierStyle.badge
                )}>
                  {tierStyle.label}
                </span>
              )}
              {pillar && (
                <>
                  <span className="text-slate-600 text-xs">/</span>
                  <span className="text-xs text-slate-400 font-medium">{pillar}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-white truncate">{title}</h1>

            {/* Description */}
            {description && (
              <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">{description}</p>
            )}

            {/* Badges */}
            {badges && badges.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {badges.map((badge, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded border',
                      BADGE_VARIANTS[badge.variant || 'default']
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status + Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status indicator */}
          {statusStyle && (
            <div className={cn('flex items-center gap-1.5 text-xs', statusStyle.color)}>
              <statusStyle.icon className="w-4 h-4" />
              <span className="font-medium">{statusLabel || statusStyle.label}</span>
            </div>
          )}

          {/* Primary actions */}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
