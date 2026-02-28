// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// THEME TOGGLE COMPONENT
// Elegant dark/light mode switcher
// =============================================================================

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'dropdown' | 'switch';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
  variant = 'icon',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'text-neutral-600 dark:text-neutral-400',
          className
        )}
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        {showLabel && (
          <span className="ml-2 text-sm">{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
        )}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Sun className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
        <button
          onClick={toggleTheme}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors',
            resolvedTheme === 'dark' ? 'bg-cyan-600' : 'bg-neutral-300'
          )}
        >
          <span
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              resolvedTheme === 'dark' ? 'left-7' : 'left-1'
            )}
          />
        </button>
        <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'p-2 rounded-md transition-colors',
            theme === 'light'
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
          title="Light mode"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'p-2 rounded-md transition-colors',
            theme === 'dark'
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
          title="Dark mode"
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={cn(
            'p-2 rounded-md transition-colors',
            theme === 'system'
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
          title="System preference"
        >
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
