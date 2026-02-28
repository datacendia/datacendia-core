// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// THEME UTILITY TESTS
// Unit tests for theme.ts utility functions
// =============================================================================

import { describe, it, expect } from 'vitest';
import { colors, semantic, tw, presets, cx, getStatusColor, getSeverityClasses } from '../theme';

// =============================================================================
// COLOR PALETTE TESTS
// =============================================================================

describe('colors', () => {
  describe('background colors', () => {
    it('should have base background color', () => {
      expect(colors.background.base).toBe('#030303');
    });

    it('should have elevated background color', () => {
      expect(colors.background.elevated).toBe('#0a0a0a');
    });

    it('should have card background color', () => {
      expect(colors.background.card).toBe('#111111');
    });

    it('should have hover background color', () => {
      expect(colors.background.hover).toBe('#1a1a1a');
    });

    it('should have active background color', () => {
      expect(colors.background.active).toBe('#222222');
    });
  });

  describe('border colors', () => {
    it('should have subtle border color', () => {
      expect(colors.border.subtle).toBe('#1f1f1f');
    });

    it('should have default border color', () => {
      expect(colors.border.default).toBe('#2a2a2a');
    });

    it('should have strong border color', () => {
      expect(colors.border.strong).toBe('#3a3a3a');
    });

    it('should have focus border color', () => {
      expect(colors.border.focus).toBe('#404040');
    });
  });

  describe('text colors', () => {
    it('should have primary text color', () => {
      expect(colors.text.primary).toBe('#ffffff');
    });

    it('should have secondary text color', () => {
      expect(colors.text.secondary).toBe('#a1a1a1');
    });

    it('should have muted text color', () => {
      expect(colors.text.muted).toBe('#6b6b6b');
    });

    it('should have inverse text color', () => {
      expect(colors.text.inverse).toBe('#000000');
    });
  });

  describe('crimson brand colors', () => {
    it('should have crimson 800 as primary accent', () => {
      expect(colors.crimson[800]).toBe('#991b1b');
    });

    it('should have crimson 900 as deep accent', () => {
      expect(colors.crimson[900]).toBe('#7f1d1d');
    });

    it('should have full crimson scale', () => {
      expect(Object.keys(colors.crimson)).toHaveLength(11);
    });
  });

  describe('cyan interactive colors', () => {
    it('should have cyan 500 as primary interactive', () => {
      expect(colors.cyan[500]).toBe('#06b6d4');
    });

    it('should have full cyan scale', () => {
      expect(Object.keys(colors.cyan)).toHaveLength(11);
    });
  });

  describe('status colors', () => {
    it('should have success color', () => {
      expect(colors.status.success).toBe('#10b981');
    });

    it('should have warning color', () => {
      expect(colors.status.warning).toBe('#f59e0b');
    });

    it('should have error color', () => {
      expect(colors.status.error).toBe('#ef4444');
    });

    it('should have info color', () => {
      expect(colors.status.info).toBe('#3b82f6');
    });
  });
});

// =============================================================================
// SEMANTIC COLOR MAPPINGS TESTS
// =============================================================================

describe('semantic', () => {
  it('should map bg-page to base background', () => {
    expect(semantic['bg-page']).toBe(colors.background.base);
  });

  it('should map bg-sidebar to elevated background', () => {
    expect(semantic['bg-sidebar']).toBe(colors.background.elevated);
  });

  it('should map text-primary to primary text', () => {
    expect(semantic['text-primary']).toBe(colors.text.primary);
  });

  it('should map action-primary to cyan 500', () => {
    expect(semantic['action-primary']).toBe(colors.cyan[500]);
  });

  it('should map action-destructive to crimson 700', () => {
    expect(semantic['action-destructive']).toBe(colors.crimson[700]);
  });

  it('should map accent-authority to crimson 800', () => {
    expect(semantic['accent-authority']).toBe(colors.crimson[800]);
  });
});

// =============================================================================
// TAILWIND CLASS MAPPINGS TESTS
// =============================================================================

describe('tw', () => {
  it('should have page class', () => {
    expect(tw.page).toContain('bg-[#030303]');
    expect(tw.page).toContain('min-h-screen');
  });

  it('should have card class', () => {
    expect(tw.card).toContain('bg-[#111111]');
    expect(tw.card).toContain('border');
    expect(tw.card).toContain('rounded-xl');
  });

  it('should have sidebar class', () => {
    expect(tw.sidebar).toContain('bg-[#0a0a0a]');
    expect(tw.sidebar).toContain('border-r');
  });

  it('should have button classes', () => {
    expect(tw.btnPrimary).toContain('bg-cyan-500');
    expect(tw.btnSecondary).toContain('bg-[#1a1a1a]');
    expect(tw.btnDestructive).toContain('bg-red-900');
    expect(tw.btnGhost).toContain('hover:bg-[#1a1a1a]');
  });

  it('should have navigation item classes', () => {
    expect(tw.navItem).toContain('flex');
    expect(tw.navItem).toContain('items-center');
    expect(tw.navItemActive).toContain('border-cyan-500');
  });

  it('should have input class', () => {
    expect(tw.input).toContain('bg-[#111111]');
    expect(tw.input).toContain('focus:border-cyan-500');
  });

  it('should have badge classes', () => {
    expect(tw.badge).toContain('px-2');
    expect(tw.badgeCrimson).toContain('bg-red-900/20');
    expect(tw.badgeCyan).toContain('bg-cyan-500/20');
  });
});

// =============================================================================
// COMPONENT PRESETS TESTS
// =============================================================================

describe('presets', () => {
  describe('modal preset', () => {
    it('should have overlay class', () => {
      expect(presets.modal.overlay).toContain('fixed');
      expect(presets.modal.overlay).toContain('inset-0');
      expect(presets.modal.overlay).toContain('backdrop-blur-sm');
    });

    it('should have content class', () => {
      expect(presets.modal.content).toContain('bg-[#111111]');
      expect(presets.modal.content).toContain('rounded-xl');
    });
  });

  describe('dropdown preset', () => {
    it('should have trigger class', () => {
      expect(presets.dropdown.trigger).toContain('flex');
      expect(presets.dropdown.trigger).toContain('rounded-lg');
    });

    it('should have content class', () => {
      expect(presets.dropdown.content).toContain('bg-[#111111]');
      expect(presets.dropdown.content).toContain('shadow-xl');
    });

    it('should have item class', () => {
      expect(presets.dropdown.item).toContain('w-full');
      expect(presets.dropdown.item).toContain('hover:bg-[#1a1a1a]');
    });
  });

  describe('table preset', () => {
    it('should have wrapper class', () => {
      expect(presets.table.wrapper).toContain('bg-[#111111]');
      expect(presets.table.wrapper).toContain('rounded-xl');
    });

    it('should have header class', () => {
      expect(presets.table.header).toContain('bg-[#0a0a0a]');
    });

    it('should have row class', () => {
      expect(presets.table.row).toContain('hover:bg-[#1a1a1a]');
    });
  });

  describe('stat preset', () => {
    it('should have card class', () => {
      expect(presets.stat.card).toContain('bg-[#111111]');
      expect(presets.stat.card).toContain('p-6');
    });

    it('should have value class', () => {
      expect(presets.stat.value).toContain('text-3xl');
      expect(presets.stat.value).toContain('tabular-nums');
    });

    it('should have label class', () => {
      expect(presets.stat.label).toContain('uppercase');
      expect(presets.stat.label).toContain('tracking-wider');
    });
  });
});

// =============================================================================
// UTILITY FUNCTION TESTS
// =============================================================================

describe('cx', () => {
  it('should join multiple classes', () => {
    expect(cx('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should filter out undefined values', () => {
    expect(cx('class1', undefined, 'class2')).toBe('class1 class2');
  });

  it('should filter out null values', () => {
    expect(cx('class1', null, 'class2')).toBe('class1 class2');
  });

  it('should filter out false values', () => {
    expect(cx('class1', false, 'class2')).toBe('class1 class2');
  });

  it('should filter out empty strings', () => {
    // cx filters falsy values including empty strings
    expect(cx('class1', '', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cx('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('should return empty string for no valid classes', () => {
    expect(cx(undefined, null, false)).toBe('');
  });

  it('should handle single class', () => {
    expect(cx('single')).toBe('single');
  });
});

describe('getStatusColor', () => {
  it('should return success color', () => {
    expect(getStatusColor('success')).toBe('#10b981');
  });

  it('should return warning color', () => {
    expect(getStatusColor('warning')).toBe('#f59e0b');
  });

  it('should return error color', () => {
    expect(getStatusColor('error')).toBe('#ef4444');
  });

  it('should return info color', () => {
    expect(getStatusColor('info')).toBe('#3b82f6');
  });
});

describe('getSeverityClasses', () => {
  it('should return critical severity classes', () => {
    const classes = getSeverityClasses('critical');
    expect(classes).toContain('bg-red-500/20');
    expect(classes).toContain('text-red-400');
    expect(classes).toContain('border-red-500/30');
  });

  it('should return high severity classes', () => {
    const classes = getSeverityClasses('high');
    expect(classes).toContain('bg-orange-500/20');
    expect(classes).toContain('text-orange-400');
    expect(classes).toContain('border-orange-500/30');
  });

  it('should return medium severity classes', () => {
    const classes = getSeverityClasses('medium');
    expect(classes).toContain('bg-yellow-500/20');
    expect(classes).toContain('text-yellow-400');
    expect(classes).toContain('border-yellow-500/30');
  });

  it('should return low severity classes', () => {
    const classes = getSeverityClasses('low');
    expect(classes).toContain('bg-blue-500/20');
    expect(classes).toContain('text-blue-400');
    expect(classes).toContain('border-blue-500/30');
  });
});
