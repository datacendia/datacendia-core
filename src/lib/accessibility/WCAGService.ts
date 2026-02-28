// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - WCAG ACCESSIBILITY SERVICE
// Enterprise-grade WCAG 2.1 AA/AAA compliance utilities
// =============================================================================

/**
 * WCAG Compliance Levels
 */
export type WCAGLevel = 'A' | 'AA' | 'AAA';

/**
 * Color contrast ratios per WCAG 2.1
 */
export const CONTRAST_RATIOS = {
  AA_NORMAL_TEXT: 4.5,
  AA_LARGE_TEXT: 3,
  AAA_NORMAL_TEXT: 7,
  AAA_LARGE_TEXT: 4.5,
} as const;

/**
 * Focus indicator configurations
 */
export const FOCUS_STYLES = {
  default: 'ring-2 ring-blue-500 ring-offset-2',
  highContrast: 'ring-4 ring-black ring-offset-4',
  outline: 'outline-2 outline-offset-2 outline-blue-500',
} as const;

/**
 * Keyboard navigation keys
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

// =============================================================================
// COLOR CONTRAST UTILITIES
// =============================================================================

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns value from 1 to 21
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return 1;
  }

  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return isLargeText
      ? ratio >= CONTRAST_RATIOS.AAA_LARGE_TEXT
      : ratio >= CONTRAST_RATIOS.AAA_NORMAL_TEXT;
  }

  return isLargeText
    ? ratio >= CONTRAST_RATIOS.AA_LARGE_TEXT
    : ratio >= CONTRAST_RATIOS.AA_NORMAL_TEXT;
}

/**
 * Suggest accessible color alternatives
 */
export function suggestAccessibleColor(
  color: string,
  background: string,
  level: WCAGLevel = 'AA'
): string {
  const targetRatio =
    level === 'AAA' ? CONTRAST_RATIOS.AAA_NORMAL_TEXT : CONTRAST_RATIOS.AA_NORMAL_TEXT;

  const rgb = hexToRgb(color);
  if (!rgb) {
    return color;
  }

  // Try darkening or lightening the color
  let adjustedColor = color;
  let currentRatio = getContrastRatio(color, background);

  // Determine if we should lighten or darken
  const bgLum = hexToRgb(background);
  const isLightBg = bgLum ? getRelativeLuminance(bgLum.r, bgLum.g, bgLum.b) > 0.5 : true;

  for (let i = 0; i < 100 && currentRatio < targetRatio; i++) {
    const factor = isLightBg ? 0.95 : 1.05;
    const newR = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));

    rgb.r = newR;
    rgb.g = newG;
    rgb.b = newB;

    adjustedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    currentRatio = getContrastRatio(adjustedColor, background);
  }

  return adjustedColor;
}

// =============================================================================
// FOCUS MANAGEMENT
// =============================================================================

/**
 * Focus trap for modals and dialogs
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: Element | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.updateFocusableElements();
  }

  private updateFocusableElements(): void {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(selectors.join(', '))
    );
  }

  activate(): void {
    this.previousActiveElement = document.activeElement;
    this.container.addEventListener('keydown', this.handleKeyDown);

    // Focus first element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KEYBOARD_KEYS.TAB) {
      return;
    }

    this.updateFocusableElements();

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  };
}

// =============================================================================
// SCREEN READER UTILITIES
// =============================================================================

/**
 * Create visually hidden text for screen readers only
 */
export function createScreenReaderText(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'sr-only';
  span.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  return span;
}

/**
 * Announce text to screen readers using ARIA live region
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const liveRegion = document.getElementById('a11y-announcer') || createLiveRegion();
  liveRegion.setAttribute('aria-live', priority);

  // Clear and set new message (necessary for repeat announcements)
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

function createLiveRegion(): HTMLDivElement {
  const region = document.createElement('div');
  region.id = 'a11y-announcer';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(region);
  return region;
}

// =============================================================================
// KEYBOARD NAVIGATION UTILITIES
// =============================================================================

/**
 * Generate keyboard event handler for arrow key navigation
 */
export function createArrowKeyHandler(
  items: HTMLElement[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onSelect?: (item: HTMLElement, index: number) => void;
  } = {}
): (event: KeyboardEvent) => void {
  const { orientation = 'vertical', loop = true, onSelect } = options;

  return (event: KeyboardEvent) => {
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (isVertical) {
          nextIndex = currentIndex + 1;
          event.preventDefault();
        }
        break;
      case KEYBOARD_KEYS.ARROW_UP:
        if (isVertical) {
          nextIndex = currentIndex - 1;
          event.preventDefault();
        }
        break;
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (isHorizontal) {
          nextIndex = currentIndex + 1;
          event.preventDefault();
        }
        break;
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (isHorizontal) {
          nextIndex = currentIndex - 1;
          event.preventDefault();
        }
        break;
      case KEYBOARD_KEYS.HOME:
        nextIndex = 0;
        event.preventDefault();
        break;
      case KEYBOARD_KEYS.END:
        nextIndex = items.length - 1;
        event.preventDefault();
        break;
      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        if (onSelect) {
          onSelect(items[currentIndex], currentIndex);
          event.preventDefault();
        }
        return;
      default:
        return;
    }

    // Handle looping
    if (loop) {
      if (nextIndex < 0) {
        nextIndex = items.length - 1;
      }
      if (nextIndex >= items.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));
    }

    items[nextIndex]?.focus();
  };
}

// =============================================================================
// WCAG COMPLIANCE CHECKER
// =============================================================================

export interface AccessibilityIssue {
  type: 'error' | 'warning';
  rule: string;
  element: string;
  message: string;
  wcagCriteria: string;
  level: WCAGLevel;
}

/**
 * Check element for accessibility issues
 */
export function checkElementAccessibility(element: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check for alt text on images
  if (element.tagName === 'IMG') {
    const alt = element.getAttribute('alt');
    if (!alt) {
      issues.push({
        type: 'error',
        rule: 'img-alt',
        element: element.outerHTML.substring(0, 100),
        message: 'Images must have alternative text',
        wcagCriteria: '1.1.1',
        level: 'A',
      });
    }
  }

  // Check for button/link accessible names
  if (element.tagName === 'BUTTON' || element.tagName === 'A') {
    const hasAccessibleName =
      element.textContent?.trim() ||
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title');

    if (!hasAccessibleName) {
      issues.push({
        type: 'error',
        rule: 'button-name',
        element: element.outerHTML.substring(0, 100),
        message: 'Interactive elements must have accessible names',
        wcagCriteria: '4.1.2',
        level: 'A',
      });
    }
  }

  // Check for form labels
  if (
    element.tagName === 'INPUT' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA'
  ) {
    const id = element.getAttribute('id');
    const hasLabel =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      (id && document.querySelector(`label[for="${id}"]`));

    if (!hasLabel) {
      issues.push({
        type: 'error',
        rule: 'form-label',
        element: element.outerHTML.substring(0, 100),
        message: 'Form controls must have associated labels',
        wcagCriteria: '1.3.1',
        level: 'A',
      });
    }
  }

  // Check for heading hierarchy
  if (/^H[1-6]$/.test(element.tagName)) {
    const level = parseInt(element.tagName[1]);
    const previousHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    for (const h of previousHeadings) {
      if (h === element) {
        break;
      }
      previousLevel = parseInt(h.tagName[1]);
    }

    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        rule: 'heading-order',
        element: element.outerHTML.substring(0, 100),
        message: `Heading level skipped: h${previousLevel} to h${level}`,
        wcagCriteria: '1.3.1',
        level: 'A',
      });
    }
  }

  // Check for empty links
  if (element.tagName === 'A' && element.getAttribute('href')) {
    const isEmpty =
      !element.textContent?.trim() &&
      !element.querySelector('img[alt]') &&
      !element.getAttribute('aria-label');
    if (isEmpty) {
      issues.push({
        type: 'error',
        rule: 'link-name',
        element: element.outerHTML.substring(0, 100),
        message: 'Links must have discernible text',
        wcagCriteria: '2.4.4',
        level: 'A',
      });
    }
  }

  return issues;
}

/**
 * Run full page accessibility audit
 */
export function runAccessibilityAudit(container: HTMLElement = document.body): {
  issues: AccessibilityIssue[];
  summary: {
    errors: number;
    warnings: number;
    passed: number;
  };
} {
  const allElements = container.querySelectorAll('*');
  const issues: AccessibilityIssue[] = [];

  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      issues.push(...checkElementAccessibility(el));
    }
  });

  return {
    issues,
    summary: {
      errors: issues.filter((i) => i.type === 'error').length,
      warnings: issues.filter((i) => i.type === 'warning').length,
      passed: allElements.length - issues.length,
    },
  };
}

// =============================================================================
// REDUCED MOTION PREFERENCE
// =============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subscribe to reduced motion preference changes
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event: MediaQueryListEvent) => callback(event.matches);

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

// =============================================================================
// HIGH CONTRAST MODE
// =============================================================================

/**
 * Check if user has high contrast mode enabled
 */
export function prefersHighContrast(): boolean {
  return (
    window.matchMedia('(prefers-contrast: more)').matches ||
    window.matchMedia('(-ms-high-contrast: active)').matches
  );
}

/**
 * Get appropriate color scheme based on system preferences
 */
export function getPreferredColorScheme(): 'light' | 'dark' | 'high-contrast' {
  if (prefersHighContrast()) {
    return 'high-contrast';
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// =============================================================================
// SKIP LINKS
// =============================================================================

/**
 * Create skip link element
 */
export function createSkipLink(
  targetId: string,
  text: string = 'Skip to main content'
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className =
    'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:underline';

  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });

  return link;
}

// =============================================================================
// WCAG SERVICE CLASS
// =============================================================================

class WCAGService {
  private static instance: WCAGService;
  private initialized = false;

  static getInstance(): WCAGService {
    if (!WCAGService.instance) {
      WCAGService.instance = new WCAGService();
    }
    return WCAGService.instance;
  }

  /**
   * Initialize WCAG service with global accessibility enhancements
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    // Add live region for announcements
    createLiveRegion();

    // Add skip link if main content exists
    const mainContent =
      document.querySelector('main[id]') || document.getElementById('main-content');
    if (mainContent && mainContent.id) {
      const skipLink = createSkipLink(mainContent.id);
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Listen for reduced motion preference
    onReducedMotionChange((prefersReduced) => {
      document.documentElement.classList.toggle('reduce-motion', prefersReduced);
    });

    // Apply initial reduced motion class
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Apply high contrast mode class
    if (prefersHighContrast()) {
      document.documentElement.classList.add('high-contrast');
    }

    this.initialized = true;
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    announceToScreenReader(message, priority);
  }

  /**
   * Run accessibility audit on element or page
   */
  audit(container?: HTMLElement) {
    return runAccessibilityAudit(container);
  }

  /**
   * Check color contrast
   */
  checkContrast(foreground: string, background: string, level: WCAGLevel = 'AA') {
    const ratio = getContrastRatio(foreground, background);
    const passes = meetsContrastRequirements(foreground, background, level);
    return { ratio, passes, level };
  }

  /**
   * Create focus trap for modal/dialog
   */
  createFocusTrap(container: HTMLElement): FocusTrap {
    return new FocusTrap(container);
  }

  /**
   * Get user's accessibility preferences
   */
  getPreferences() {
    return {
      prefersReducedMotion: prefersReducedMotion(),
      prefersHighContrast: prefersHighContrast(),
      colorScheme: getPreferredColorScheme(),
    };
  }
}

export const wcagService = WCAGService.getInstance();
export default wcagService;
