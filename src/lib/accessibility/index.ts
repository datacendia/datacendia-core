// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - ACCESSIBILITY MODULE EXPORTS
// =============================================================================

export {
  wcagService,
  default as WCAGService,
  // Types
  type WCAGLevel,
  type AccessibilityIssue,
  // Constants
  CONTRAST_RATIOS,
  FOCUS_STYLES,
  KEYBOARD_KEYS,
  // Color utilities
  getContrastRatio,
  meetsContrastRequirements,
  suggestAccessibleColor,
  // Focus utilities
  FocusTrap,
  // Screen reader utilities
  createScreenReaderText,
  announceToScreenReader,
  // Keyboard utilities
  createArrowKeyHandler,
  // Audit utilities
  checkElementAccessibility,
  runAccessibilityAudit,
  // Preference utilities
  prefersReducedMotion,
  onReducedMotionChange,
  prefersHighContrast,
  getPreferredColorScheme,
  // Skip link
  createSkipLink,
} from './WCAGService';

export { useAccessibility } from './useAccessibility';
export { useAnnounce } from './useAnnounce';
export { useFocusTrap } from './useFocusTrap';
export { useKeyboardNavigation } from './useKeyboardNavigation';
