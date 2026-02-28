// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Keyboard Shortcuts Component
 *
 * Quick Win: Global keyboard shortcuts for power users
 * - Cmd/Ctrl + K: Quick search
 * - Cmd/Ctrl + Enter: Submit deliberation
 * - Cmd/Ctrl + /: Show shortcuts help
 * - Escape: Close modals
 */

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  onQuickSearch?: () => void;
  onSubmit?: () => void;
  onNewDeliberation?: () => void;
  onToggleSidebar?: () => void;
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ['⌘', 'K'], description: 'Quick search', category: 'Navigation' },
  { keys: ['⌘', '/'], description: 'Show keyboard shortcuts', category: 'Navigation' },
  { keys: ['G', 'C'], description: 'Go to Council', category: 'Navigation' },
  { keys: ['G', 'G'], description: 'Go to Graph', category: 'Navigation' },
  { keys: ['G', 'T'], description: 'Go to Chronos', category: 'Navigation' },
  { keys: ['G', 'P'], description: 'Go to Pulse', category: 'Navigation' },
  { keys: ['G', 'H'], description: 'Go to Home', category: 'Navigation' },

  // Actions
  { keys: ['⌘', '↵'], description: 'Submit deliberation', category: 'Actions' },
  { keys: ['⌘', 'N'], description: 'New deliberation', category: 'Actions' },
  { keys: ['⌘', 'S'], description: 'Save draft', category: 'Actions' },
  { keys: ['⌘', 'E'], description: 'Export current view', category: 'Actions' },

  // View
  { keys: ['⌘', 'B'], description: 'Toggle sidebar', category: 'View' },
  { keys: ['⌘', '\\'], description: 'Toggle full screen', category: 'View' },
  { keys: ['⌘', '+'], description: 'Zoom in', category: 'View' },
  { keys: ['⌘', '-'], description: 'Zoom out', category: 'View' },

  // General
  { keys: ['Esc'], description: 'Close modal / Cancel', category: 'General' },
  { keys: ['?'], description: 'Show help', category: 'General' },
];

const KeyboardShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) {return null;}

  const categories = [...new Set(SHORTCUTS.map((s) => s.category))];
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // Replace ⌘ with Ctrl on non-Mac
  const formatKeys = (keys: string[]) => {
    return keys.map((k) => (k === '⌘' ? (isMac ? '⌘' : 'Ctrl') : k));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-xl font-bold text-neutral-900">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {SHORTCUTS.filter((s) => s.category === category).map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-neutral-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {formatKeys(shortcut.keys).map((key, j) => (
                          <React.Fragment key={j}>
                            <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-mono text-neutral-700">
                              {key}
                            </kbd>
                            {j < shortcut.keys.length - 1 && (
                              <span className="text-neutral-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <p className="text-sm text-neutral-500 text-center">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-xs font-mono">
              Esc
            </kbd>{' '}
            to close
          </p>
        </div>
      </div>
    </div>
  );
};

const KeyboardShortcutsProvider: React.FC<
  KeyboardShortcutsProps & { children: React.ReactNode }
> = ({ children, onQuickSearch, onSubmit, onNewDeliberation, onToggleSidebar }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [goPrefix, setGoPrefix] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Don't trigger shortcuts when typing in inputs (except specific ones)
      if (isInput && !cmdKey) {
        setGoPrefix(false);
        return;
      }

      // Escape - close help
      if (e.key === 'Escape') {
        setShowHelp(false);
        setGoPrefix(false);
        return;
      }

      // ? - show help (when not in input)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Cmd/Ctrl + / - show help
      if (cmdKey && e.key === '/') {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Cmd/Ctrl + K - quick search
      if (cmdKey && e.key === 'k') {
        e.preventDefault();
        onQuickSearch?.();
        return;
      }

      // Cmd/Ctrl + Enter - submit
      if (cmdKey && e.key === 'Enter') {
        e.preventDefault();
        onSubmit?.();
        return;
      }

      // Cmd/Ctrl + N - new deliberation
      if (cmdKey && e.key === 'n') {
        e.preventDefault();
        onNewDeliberation?.();
        return;
      }

      // Cmd/Ctrl + B - toggle sidebar
      if (cmdKey && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar?.();
        return;
      }

      // G prefix for navigation (vim-style)
      if (!isInput) {
        if (e.key.toLowerCase() === 'g' && !goPrefix) {
          setGoPrefix(true);
          setTimeout(() => setGoPrefix(false), 1000); // Reset after 1 second
          return;
        }

        if (goPrefix) {
          setGoPrefix(false);
          switch (e.key.toLowerCase()) {
            case 'c':
              window.location.href = '/cortex/council';
              break;
            case 'g':
              window.location.href = '/cortex/graph';
              break;
            case 't':
              window.location.href = '/cortex/chronos';
              break;
            case 'p':
              window.location.href = '/cortex/pulse';
              break;
            case 'h':
              window.location.href = '/';
              break;
          }
        }
      }
    },
    [onQuickSearch, onSubmit, onNewDeliberation, onToggleSidebar, goPrefix]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {children}
      <KeyboardShortcutsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Go prefix indicator */}
      {goPrefix && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white rounded-lg shadow-lg">
          <span className="text-sm">Press a key: </span>
          <span className="font-mono">C</span>=Council,
          <span className="font-mono">G</span>=Graph,
          <span className="font-mono">T</span>=Chronos,
          <span className="font-mono">P</span>=Pulse
        </div>
      )}
    </>
  );
};

// Quick search component
const QuickSearch: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; title: string; path: string }[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      // Mock search results
      const mockResults = [
        {
          type: 'deliberation',
          title: 'Q1 Growth Strategy Analysis',
          path: '/cortex/council/del-001',
        },
        {
          type: 'deliberation',
          title: 'Market Expansion Risk Assessment',
          path: '/cortex/council/del-002',
        },
        { type: 'entity', title: 'Revenue Forecast Model', path: '/cortex/graph/entity-001' },
        { type: 'page', title: 'The Council', path: '/cortex/council' },
        { type: 'page', title: 'Knowledge Graph', path: '/cortex/graph' },
        { type: 'page', title: 'CendiaChronos', path: '/cortex/chronos' },
      ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) {return null;}

  const typeIcons: Record<string, string> = {
    deliberation: '⚖️',
    entity: '🔗',
    page: '📄',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deliberations, entities, pages..."
            className="flex-1 text-lg outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs font-mono text-neutral-500">
            Esc
          </kbd>
        </div>

        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, i) => (
              <a
                key={i}
                href={result.path}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
              >
                <span className="text-xl">{typeIcons[result.type] || '📄'}</span>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{result.title}</div>
                  <div className="text-sm text-neutral-500">{result.type}</div>
                </div>
                <svg
                  className="w-4 h-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-neutral-500">
            No results found for "{query}"
          </div>
        )}

        {!query && (
          <div className="px-4 py-4 text-sm text-neutral-500">
            <div className="mb-2 font-medium">Quick actions:</div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/cortex/council"
                className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                ⚖️ The Council
              </a>
              <a
                href="/cortex/graph"
                className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                🔗 Knowledge Graph
              </a>
              <a
                href="/cortex/chronos"
                className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                ⏱️ CendiaChronos
              </a>
              <a
                href="/cortex/pulse"
                className="px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                💓 The Pulse
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { KeyboardShortcutsProvider, KeyboardShortcutsModal, QuickSearch };
export default KeyboardShortcutsProvider;
