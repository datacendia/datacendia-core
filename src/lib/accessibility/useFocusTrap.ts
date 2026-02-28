// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - FOCUS TRAP HOOK
// =============================================================================

import { useRef, useEffect, useCallback } from 'react';
import { FocusTrap } from './WCAGService';

export interface UseFocusTrapOptions {
  enabled?: boolean;
  returnFocusOnDeactivate?: boolean;
}

/**
 * Hook for trapping focus within a container (modals, dialogs)
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions = {}
) {
  const { enabled = true, returnFocusOnDeactivate = true } = options;

  const containerRef = useRef<T>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  const activate = useCallback(() => {
    if (!containerRef.current || !enabled) {
      return;
    }

    previousActiveElementRef.current = document.activeElement;
    focusTrapRef.current = new FocusTrap(containerRef.current);
    focusTrapRef.current.activate();
  }, [enabled]);

  const deactivate = useCallback(() => {
    if (focusTrapRef.current) {
      focusTrapRef.current.deactivate();
      focusTrapRef.current = null;
    }

    if (returnFocusOnDeactivate && previousActiveElementRef.current instanceof HTMLElement) {
      previousActiveElementRef.current.focus();
    }
  }, [returnFocusOnDeactivate]);

  useEffect(() => {
    if (enabled && containerRef.current) {
      activate();
    }

    return () => {
      deactivate();
    };
  }, [enabled, activate, deactivate]);

  return {
    ref: containerRef,
    activate,
    deactivate,
  };
}
