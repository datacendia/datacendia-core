/**
 * Context — Theme Context
 *
 * React context provider for cross-component state sharing.
 *
 * @exports ThemeProvider, useTheme, useDarkMode
 * @module contexts/ThemeContext
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA THEME CONTEXT
// Dark/Light mode toggle with system preference detection
// =============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'datacendia-theme';

// The product is designed dark. Its own palette (sovereign-*) doesn't follow
// the theme; only the shared components and inherited text do. Following a
// light OS setting by default gave those light popovers and near-black text
// on dark pages, so dark is the default. A stored choice still wins.
const DEFAULT_THEME: Theme = 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  // Resolved on the first render too, so the toggle shows the right icon at once.
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme !== 'system') {
      return theme;
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Resolve system preference
  const resolveTheme = useCallback((themeValue: Theme): ResolvedTheme => {
    if (themeValue === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return themeValue;
  }, []);

  // Update resolved theme and apply to document
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);

    // Apply to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Also set data attribute for components that need it
    root.setAttribute('data-theme', resolved);
  }, [theme, resolveTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') {return;}

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for conditional dark mode classes
export const useDarkMode = () => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
};

export default ThemeContext;
