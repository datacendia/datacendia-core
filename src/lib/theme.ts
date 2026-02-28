// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA SOVEREIGN THEME
// Unified design tokens for the entire platform
// =============================================================================

/**
 * Sovereign Theme Design System
 *
 * Philosophy: Premium, minimal, authoritative
 * - Dark backgrounds signal security and sophistication
 * - Crimson accents tie to CendiaVeto™ (authority, veto power)
 * - Cyan accents for constructive actions (create, confirm, navigate)
 * - Wide letter-spacing and light fonts evoke classified documents
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Background layers (darkest to lightest)
  background: {
    base: '#030303', // Pure dark - main background
    elevated: '#0a0a0a', // Slightly elevated surfaces
    card: '#111111', // Cards and panels
    hover: '#1a1a1a', // Hover states
    active: '#222222', // Active/selected states
  },

  // Border colors
  border: {
    subtle: '#1f1f1f', // Subtle separators
    default: '#2a2a2a', // Default borders
    strong: '#3a3a3a', // Emphasized borders
    focus: '#404040', // Focus rings
  },

  // Text colors
  text: {
    primary: '#ffffff', // Primary text
    secondary: '#a1a1a1', // Secondary text
    muted: '#6b6b6b', // Muted/disabled text
    inverse: '#000000', // Text on light backgrounds
  },

  // Brand - Crimson (Authority, CendiaVeto™)
  crimson: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b', // Primary accent
    900: '#7f1d1d', // Deep accent
    950: '#450a0a',
  },

  // Interactive - Cyan (Constructive actions)
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Primary interactive
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

// =============================================================================
// SEMANTIC COLOR MAPPINGS
// =============================================================================

export const semantic = {
  // Backgrounds
  'bg-page': colors.background.base,
  'bg-sidebar': colors.background.elevated,
  'bg-card': colors.background.card,
  'bg-hover': colors.background.hover,
  'bg-active': colors.background.active,

  // Text
  'text-primary': colors.text.primary,
  'text-secondary': colors.text.secondary,
  'text-muted': colors.text.muted,

  // Borders
  'border-subtle': colors.border.subtle,
  'border-default': colors.border.default,
  'border-strong': colors.border.strong,

  // Actions
  'action-primary': colors.cyan[500],
  'action-primary-hover': colors.cyan[400],
  'action-destructive': colors.crimson[700],
  'action-destructive-hover': colors.crimson[600],

  // Accents
  'accent-authority': colors.crimson[800],
  'accent-interactive': colors.cyan[500],
} as const;

// =============================================================================
// TAILWIND CLASS MAPPINGS
// =============================================================================

/**
 * Common class combinations for consistent styling
 */
export const tw = {
  // Page backgrounds
  page: 'bg-[#030303] min-h-screen',

  // Cards and panels
  card: 'bg-[#111111] border border-[#2a2a2a] rounded-xl',
  cardHover: 'hover:bg-[#1a1a1a] hover:border-[#3a3a3a] transition-colors',

  // Sidebar
  sidebar: 'bg-[#0a0a0a] border-r border-[#1f1f1f]',

  // Header
  header: 'bg-[#0a0a0a] border-b border-[#1f1f1f]',

  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-[#a1a1a1]',
  textMuted: 'text-[#6b6b6b]',

  // Buttons
  btnPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-white font-medium',
  btnSecondary: 'bg-[#1a1a1a] hover:bg-[#222222] text-white border border-[#2a2a2a]',
  btnDestructive: 'bg-red-900 hover:bg-red-800 text-white',
  btnGhost: 'hover:bg-[#1a1a1a] text-[#a1a1a1] hover:text-white',

  // Navigation items
  navItem:
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-white transition-colors',
  navItemActive: 'bg-[#1a1a1a] text-white border-l-2 border-cyan-500',

  // Form inputs
  input:
    'bg-[#111111] border border-[#2a2a2a] rounded-lg text-white placeholder-[#6b6b6b] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500',

  // Dividers
  divider: 'border-t border-[#1f1f1f]',

  // Badges/Tags
  badge: 'px-2 py-0.5 rounded text-xs font-medium',
  badgeCrimson: 'bg-red-900/20 text-red-400 border border-red-900/30',
  badgeCyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',

  // Section headers
  sectionHeader: 'text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider',
} as const;

// =============================================================================
// COMPONENT PRESETS
// =============================================================================

/**
 * Pre-built component class combinations
 */
export const presets = {
  // Modal/Dialog
  modal: {
    overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50',
    content: 'bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-2xl',
  },

  // Dropdown
  dropdown: {
    trigger:
      'flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#222222] transition-colors',
    content: 'bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden',
    item: 'w-full flex items-center gap-3 px-4 py-3 text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-white transition-colors',
  },

  // Table
  table: {
    wrapper: 'bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden',
    header: 'bg-[#0a0a0a] border-b border-[#2a2a2a]',
    headerCell: 'px-4 py-3 text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider',
    row: 'border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition-colors',
    cell: 'px-4 py-3 text-sm text-[#a1a1a1]',
  },

  // Stats/Metrics
  stat: {
    card: 'bg-[#111111] border border-[#2a2a2a] rounded-xl p-6',
    value: 'text-3xl font-light text-white tabular-nums',
    label: 'text-xs text-[#6b6b6b] uppercase tracking-wider mt-1',
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Merge theme classes with custom classes
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get status color
 */
export function getStatusColor(status: 'success' | 'warning' | 'error' | 'info'): string {
  return colors.status[status];
}

/**
 * Get severity color for UI elements
 */
export function getSeverityClasses(severity: 'critical' | 'high' | 'medium' | 'low'): string {
  const map = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return map[severity];
}

export default { colors, semantic, tw, presets, cx, getStatusColor, getSeverityClasses };
