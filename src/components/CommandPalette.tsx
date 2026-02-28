// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - COMMAND PALETTE (Cmd+K)
// Global search and quick actions for power users
// =============================================================================

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: 'navigation' | 'action' | 'agent' | 'mode' | 'recent';
  action: () => void;
  keywords?: string[];
}

// =============================================================================
// COMMAND PALETTE COMPONENT
// =============================================================================

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, language, setLanguage, languages } = useLanguage();

  // Navigation commands
  const navigationCommands: CommandItem[] = useMemo(
    () => [
      {
        id: 'nav-dashboard',
        title: t('sidebar.dashboard'),
        subtitle: 'Go to Dashboard',
        icon: '📊',
        category: 'navigation',
        action: () => navigate('/cortex/dashboard'),
        keywords: ['home', 'panel'],
      },
      {
        id: 'nav-council',
        title: t('sidebar.the_council'),
        subtitle: 'Ask the AI Council',
        icon: '🧠',
        category: 'navigation',
        action: () => navigate('/cortex/council'),
        keywords: ['agents', 'ai', 'ask'],
      },
      {
        id: 'nav-graph',
        title: t('sidebar.the_graph'),
        subtitle: 'Explore Knowledge Graph',
        icon: '🕸️',
        category: 'navigation',
        action: () => navigate('/cortex/graph'),
        keywords: ['knowledge', 'entities', 'explore'],
      },
      {
        id: 'nav-pulse',
        title: t('sidebar.the_pulse'),
        subtitle: 'Real-time Health Monitoring',
        icon: '💓',
        category: 'navigation',
        action: () => navigate('/cortex/pulse'),
        keywords: ['health', 'monitoring', 'alerts'],
      },
      {
        id: 'nav-lens',
        title: t('sidebar.the_lens'),
        subtitle: 'Predictive Analytics',
        icon: '🔮',
        category: 'navigation',
        action: () => navigate('/cortex/lens'),
        keywords: ['forecast', 'predict', 'scenarios'],
      },
      {
        id: 'nav-bridge',
        title: t('sidebar.the_bridge'),
        subtitle: 'Workflow Automation',
        icon: '🌉',
        category: 'navigation',
        action: () => navigate('/cortex/bridge'),
        keywords: ['workflows', 'automation', 'integrations'],
      },
      {
        id: 'nav-settings',
        title: t('sidebar.settings'),
        subtitle: 'App Settings',
        icon: '⚙️',
        category: 'navigation',
        action: () => navigate('/cortex/settings'),
        keywords: ['config', 'preferences'],
      },
    ],
    [navigate, t]
  );

  // Action commands
  const actionCommands: CommandItem[] = useMemo(
    () => [
      {
        id: 'action-new-query',
        title: t('commandPalette.newQuery'),
        subtitle: t('commandPalette.askCouncil'),
        icon: '💬',
        category: 'action',
        action: () => {
          navigate('/cortex/council');
          setTimeout(() => document.querySelector<HTMLTextAreaElement>('textarea')?.focus(), 100);
        },
        keywords: ['ask', 'question'],
      },
      {
        id: 'action-refresh',
        title: t('commandPalette.refresh'),
        subtitle: t('commandPalette.reloadPage'),
        icon: '🔄',
        category: 'action',
        action: () => window.location.reload(),
        keywords: ['reload'],
      },
      {
        id: 'action-fullscreen',
        title: t('commandPalette.fullscreen'),
        subtitle: t('commandPalette.toggleFullscreen'),
        icon: '⛶',
        category: 'action',
        action: () =>
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen(),
        keywords: ['full', 'screen'],
      },
      ...languages.slice(0, 8).map((lang) => ({
        id: `lang-${lang.code}`,
        title: `${t('commandPalette.switchTo')} ${lang.nativeName}`,
        subtitle: `${t('commandPalette.changeLanguage')} ${lang.name}`,
        icon: '🌐',
        category: 'action' as const,
        action: () => setLanguage(lang.code),
        keywords: [lang.code, lang.name.toLowerCase(), lang.nativeName.toLowerCase()],
      })),
    ],
    [navigate, languages, setLanguage, t]
  );

  // Agent commands
  const agentCommands: CommandItem[] = useMemo(
    () => [
      {
        id: 'agent-chief',
        title: t('commandPalette.agents.chief'),
        subtitle: t('commandPalette.agents.chiefDesc'),
        icon: '👔',
        category: 'agent',
        action: () => navigate('/cortex/council?agent=chief'),
        keywords: ['ceo', 'strategy'],
      },
      {
        id: 'agent-cfo',
        title: t('commandPalette.agents.cfo'),
        subtitle: t('commandPalette.agents.cfoDesc'),
        icon: '💰',
        category: 'agent',
        action: () => navigate('/cortex/council?agent=cfo'),
        keywords: ['finance', 'money', 'budget'],
      },
      {
        id: 'agent-coo',
        title: t('commandPalette.agents.coo'),
        subtitle: t('commandPalette.agents.cooDesc'),
        icon: '⚙️',
        category: 'agent',
        action: () => navigate('/cortex/council?agent=coo'),
        keywords: ['operations', 'efficiency'],
      },
      {
        id: 'agent-ciso',
        title: t('commandPalette.agents.ciso'),
        subtitle: t('commandPalette.agents.cisoDesc'),
        icon: '🛡️',
        category: 'agent',
        action: () => navigate('/cortex/council?agent=ciso'),
        keywords: ['security', 'risk'],
      },
      {
        id: 'agent-cmo',
        title: t('commandPalette.agents.cmo'),
        subtitle: t('commandPalette.agents.cmoDesc'),
        icon: '📈',
        category: 'agent',
        action: () => navigate('/cortex/council?agent=cmo'),
        keywords: ['marketing', 'market', 'growth'],
      },
    ],
    [navigate, t]
  );

  // All commands
  const allCommands = useMemo(
    () => [...navigationCommands, ...actionCommands, ...agentCommands],
    [navigationCommands, actionCommands, agentCommands]
  );

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query) {
      return allCommands.slice(0, 10);
    }

    const lowerQuery = query.toLowerCase();
    return allCommands
      .filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(lowerQuery) ||
          cmd.subtitle?.toLowerCase().includes(lowerQuery) ||
          cmd.keywords?.some((k) => k.includes(lowerQuery))
      )
      .slice(0, 10);
  }, [query, allCommands]);

  // Keyboard shortcut to open (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    },
    [filteredCommands, selectedIndex]
  );

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.children[selectedIndex] as HTMLElement;
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Category labels
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        return t('commandPalette.categories.navigation');
      case 'action':
        return t('commandPalette.categories.actions');
      case 'agent':
        return t('commandPalette.categories.agents');
      case 'mode':
        return t('commandPalette.categories.modes');
      case 'recent':
        return t('commandPalette.categories.recent');
      default:
        return category;
    }
  };

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in duration-150"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="bg-sovereign-card rounded-2xl shadow-2xl border border-sovereign-border overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-sovereign-border-subtle">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('commandPalette.searchPlaceholder')}
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-base"
            />
            <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono text-gray-400 bg-sovereign-active rounded">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <span className="text-2xl mb-2 block">🔍</span>
                {t('commandPalette.noResults')} "{query}"
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category}>
                  <div className="px-4 py-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  {commands.map((cmd, idx) => {
                    const globalIdx = filteredCommands.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          globalIdx === selectedIndex
                            ? 'bg-sovereign-active text-white border-l-2 border-cyan-500'
                            : 'hover:bg-sovereign-hover text-gray-300'
                        }`}
                      >
                        <span className="text-lg w-8 text-center">{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{cmd.title}</p>
                          {cmd.subtitle && (
                            <p className="text-xs text-gray-500 truncate">{cmd.subtitle}</p>
                          )}
                        </div>
                        {globalIdx === selectedIndex && (
                          <kbd className="px-2 py-0.5 text-xs font-mono text-cyan-400 bg-cyan-900/30 rounded">
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-sovereign-border-subtle bg-sovereign-elevated flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">
                  ↓
                </kbd>
                {t('commandPalette.navigate')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">
                  ↵
                </kbd>
                {t('commandPalette.select')}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">
                Ctrl+K
              </kbd>
              {t('commandPalette.toggle')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommandPalette;
