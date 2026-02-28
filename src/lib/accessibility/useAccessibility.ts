// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - ACCESSIBILITY HOOK
// Provides accessibility preferences and utilities
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  prefersReducedMotion,
  prefersHighContrast,
  getPreferredColorScheme,
  onReducedMotionChange,
  wcagService,
} from './WCAGService';

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  colorScheme: 'light' | 'dark' | 'high-contrast';
}

export interface UseAccessibilityReturn {
  preferences: AccessibilityPreferences;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isInitialized: boolean;
}

/**
 * Hook for accessing accessibility features and preferences
 */
export function useAccessibility(): UseAccessibilityReturn {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    colorScheme: 'light',
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize preferences
    setPreferences({
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
      colorScheme: getPreferredColorScheme(),
    });

    // Initialize WCAG service
    wcagService.initialize();
    setIsInitialized(true);

    // Listen for reduced motion changes
    const unsubscribe = onReducedMotionChange((prefersReduced) => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: prefersReduced,
      }));
    });

    // Listen for color scheme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = () => {
      setPreferences((prev) => ({
        ...prev,
        colorScheme: getPreferredColorScheme(),
      }));
    };
    darkModeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      unsubscribe();
      darkModeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    wcagService.announce(message, priority);
  }, []);

  return {
    preferences,
    announce,
    isInitialized,
  };
}
