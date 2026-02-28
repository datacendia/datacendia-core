// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - KEYBOARD NAVIGATION HOOK
// =============================================================================

import { useRef, useEffect, useCallback, RefObject } from 'react';
import { KEYBOARD_KEYS, createArrowKeyHandler } from './WCAGService';

export interface UseKeyboardNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  selector?: string;
  onSelect?: (element: HTMLElement, index: number) => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in lists, menus, and other composite widgets
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>(
  options: UseKeyboardNavigationOptions = {}
): {
  containerRef: RefObject<T>;
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
} {
  const {
    orientation = 'vertical',
    loop = true,
    selector = '[tabindex="0"], button:not([disabled]), a[href], input:not([disabled])',
    onSelect,
    enabled = true,
  } = options;

  const containerRef = useRef<T>(null);

  const getItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) {
      return [];
    }
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector));
  }, [selector]);

  const focusFirst = useCallback(() => {
    const items = getItems();
    items[0]?.focus();
  }, [getItems]);

  const focusLast = useCallback(() => {
    const items = getItems();
    items[items.length - 1]?.focus();
  }, [getItems]);

  const focusNext = useCallback(() => {
    const items = getItems();
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let nextIndex = currentIndex + 1;

    if (loop && nextIndex >= items.length) {
      nextIndex = 0;
    } else {
      nextIndex = Math.min(nextIndex, items.length - 1);
    }

    items[nextIndex]?.focus();
  }, [getItems, loop]);

  const focusPrevious = useCallback(() => {
    const items = getItems();
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let prevIndex = currentIndex - 1;

    if (loop && prevIndex < 0) {
      prevIndex = items.length - 1;
    } else {
      prevIndex = Math.max(prevIndex, 0);
    }

    items[prevIndex]?.focus();
  }, [getItems, loop]);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const items = getItems();
    const handler = createArrowKeyHandler(items, { orientation, loop, onSelect });

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      handler(event);
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, getItems, orientation, loop, onSelect]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  };
}
