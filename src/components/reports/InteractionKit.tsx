// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// INTERACTION KIT
// Contextual tooltips, saved views, annotations, thresholds, and deep links
// =============================================================================

import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Info,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  X,
  Save,
  Trash2,
  ChevronDown,
  Bell,
  BellOff,
  Plus,
  Check,
  Edit3,
  Link2,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface TooltipContent {
  title: string;
  definition: string;
  calculation?: string;
  dataSource?: string;
  lastUpdated?: string;
  range?: { min: string; max: string; current: string };
}

export interface SavedView {
  id: string;
  name: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  columns?: string[];
  createdAt: Date;
}

export interface Annotation {
  id: string;
  targetId: string;
  targetType: string;
  text: string;
  author: string;
  createdAt: Date;
  pinned?: boolean;
}

export interface ThresholdConfig {
  id: string;
  metricKey: string;
  metricLabel: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number;
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  notifyOnBreach?: boolean;
}

// =============================================================================
// METRIC TOOLTIP — Contextual hover info for any metric
// =============================================================================

export const MetricTooltip: React.FC<{
  content: TooltipContent;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ content, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      <div className="flex items-center gap-1 cursor-help">
        {children}
        <Info className="w-3 h-3 text-gray-500 opacity-50 hover:opacity-100 transition-opacity" />
      </div>

      {visible && (
        <div className={`absolute z-50 ${positionClasses[position]} w-64 bg-gray-800 border border-gray-600 rounded-xl p-3 shadow-2xl`}>
          <div className="text-xs space-y-2">
            <div>
              <div className="font-semibold text-white text-sm">{content.title}</div>
              <div className="text-gray-400 mt-0.5">{content.definition}</div>
            </div>
            {content.calculation && (
              <div>
                <div className="text-gray-500 font-medium">Calculation</div>
                <div className="text-gray-300 font-mono text-[10px] bg-gray-900 rounded px-2 py-1 mt-0.5">{content.calculation}</div>
              </div>
            )}
            {content.dataSource && (
              <div>
                <div className="text-gray-500 font-medium">Data Source</div>
                <div className="text-gray-300">{content.dataSource}</div>
              </div>
            )}
            {content.range && (
              <div>
                <div className="text-gray-500 font-medium">Range</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-400">{content.range.min}</span>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full relative">
                    <div
                      className="absolute h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0,
                          ((parseFloat(content.range.current) - parseFloat(content.range.min)) /
                          (parseFloat(content.range.max) - parseFloat(content.range.min))) * 100
                        ))}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-400">{content.range.max}</span>
                </div>
                <div className="text-center text-white font-medium mt-0.5">Current: {content.range.current}</div>
              </div>
            )}
            {content.lastUpdated && (
              <div className="text-gray-600 text-[10px]">Last updated: {content.lastUpdated}</div>
            )}
          </div>
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-gray-800 border-gray-600 transform rotate-45 ${
            position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b' :
            position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t' :
            position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' :
            'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l'
          }`} />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SAVED VIEW MANAGER — Save/load view configurations
// =============================================================================

const STORAGE_KEY = 'datacendia-saved-views';

export const SavedViewManager: React.FC<{
  pageId: string;
  currentFilters: Record<string, any>;
  onLoadView: (filters: Record<string, any>) => void;
}> = ({ pageId, currentFilters, onLoadView }) => {
  const [views, setViews] = useState<SavedView[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${pageId}`);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const persist = useCallback((updated: SavedView[]) => {
    setViews(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}-${pageId}`, JSON.stringify(updated));
    } catch { /* storage full */ }
  }, [pageId]);

  const saveView = () => {
    if (!newName.trim()) return;
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name: newName.trim(),
      filters: { ...currentFilters },
      createdAt: new Date(),
    };
    persist([view, ...views]);
    setNewName('');
    setShowSaveInput(false);
  };

  const deleteView = (id: string) => {
    persist(views.filter(v => v.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
      >
        <Bookmark className="w-3 h-3" />
        Saved Views
        {views.length > 0 && (
          <span className="bg-blue-500/30 text-blue-400 px-1 rounded text-[10px] font-bold">{views.length}</span>
        )}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-64">
          <div className="p-3 border-b border-gray-700">
            {showSaveInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveView()}
                  placeholder="View name..."
                  className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                  autoFocus
                />
                <button onClick={saveView} className="p-1 text-emerald-400 hover:text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowSaveInput(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveInput(true)}
                className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" /> Save Current View
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto">
            {views.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">No saved views yet</div>
            ) : (
              views.map(view => (
                <div
                  key={view.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-700/50 group"
                >
                  <button
                    onClick={() => { onLoadView(view.filters); setIsOpen(false); }}
                    className="flex-1 text-left"
                  >
                    <div className="text-xs text-white font-medium">{view.name}</div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(view.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                  <button
                    onClick={() => deleteView(view.id)}
                    className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// INLINE ANNOTATION — Click to add notes to any data point
// =============================================================================

export const InlineAnnotation: React.FC<{
  targetId: string;
  targetType: string;
  annotations: Annotation[];
  onAdd: (text: string) => void;
  onDelete?: (id: string) => void;
}> = ({ targetId, targetType, annotations, onAdd, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const relevantAnnotations = annotations.filter(a => a.targetId === targetId);

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded transition-colors ${
          relevantAnnotations.length > 0
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-gray-600 hover:text-gray-400'
        }`}
        title={`${relevantAnnotations.length} note${relevantAnnotations.length !== 1 ? 's' : ''}`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        {relevantAnnotations.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full text-[8px] text-black font-bold flex items-center justify-center">
            {relevantAnnotations.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-72">
          <div className="p-3 border-b border-gray-700">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Notes
            </h4>
          </div>

          {relevantAnnotations.length > 0 && (
            <div className="max-h-32 overflow-y-auto p-2 space-y-1.5">
              {relevantAnnotations.map(a => (
                <div key={a.id} className="bg-gray-900 rounded-lg p-2 group">
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-gray-300">{a.text}</p>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(a.id)}
                        className="p-0.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    {a.author} · {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-2 border-t border-gray-700">
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Add a note..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500"
              />
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded text-white transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// THRESHOLD INDICATOR — Metric with configurable alert bounds
// =============================================================================

export const ThresholdIndicator: React.FC<{
  value: number;
  label: string;
  thresholds: ThresholdConfig[];
  format?: (v: number) => string;
  showConfig?: boolean;
  onConfigChange?: (thresholds: ThresholdConfig[]) => void;
}> = ({ value, label, thresholds, format = (v) => String(v), showConfig = false, onConfigChange }) => {
  const [configOpen, setConfigOpen] = useState(false);

  const breached = thresholds.filter(t => {
    if (!t.enabled) return false;
    switch (t.operator) {
      case '>': return value > t.value;
      case '<': return value < t.value;
      case '>=': return value >= t.value;
      case '<=': return value <= t.value;
      case '==': return value === t.value;
      case '!=': return value !== t.value;
      default: return false;
    }
  });

  const worstSeverity = breached.reduce<string | null>((worst, t) => {
    if (!worst) return t.severity;
    const order = { critical: 3, warning: 2, info: 1 };
    return (order[t.severity] || 0) > (order[worst as keyof typeof order] || 0) ? t.severity : worst;
  }, null);

  const severityStyles = {
    critical: 'border-red-500/50 bg-red-500/5 animate-pulse',
    warning: 'border-amber-500/50 bg-amber-500/5',
    info: 'border-blue-500/50 bg-blue-500/5',
  };

  return (
    <div className={`relative rounded-lg border p-3 transition-all ${
      worstSeverity ? severityStyles[worstSeverity as keyof typeof severityStyles] : 'border-gray-700 bg-gray-800/50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">{label}</div>
          <div className={`text-xl font-bold ${
            worstSeverity === 'critical' ? 'text-red-400' :
            worstSeverity === 'warning' ? 'text-amber-400' :
            'text-white'
          }`}>
            {format(value)}
          </div>
        </div>
        {breached.length > 0 && (
          <div className="flex items-center gap-1">
            <AlertCircle className={`w-5 h-5 ${
              worstSeverity === 'critical' ? 'text-red-400' :
              worstSeverity === 'warning' ? 'text-amber-400' :
              'text-blue-400'
            }`} />
          </div>
        )}
      </div>

      {breached.length > 0 && (
        <div className="mt-2 space-y-1">
          {breached.map(t => (
            <div key={t.id} className={`text-[10px] px-2 py-0.5 rounded ${
              t.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
              t.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {t.metricLabel} {t.operator} {t.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// DEEP LINK — Cross-page navigation with context
// =============================================================================

export const DeepLink: React.FC<{
  href: string;
  label: string;
  entityType?: string;
  entityId?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ href, label, entityType, entityId, icon, className = '', onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors ${className}`}
      title={entityType ? `${entityType}: ${entityId || label}` : label}
    >
      {icon || <Link2 className="w-3 h-3" />}
      {label}
      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
    </a>
  );
};

// =============================================================================
// DEEP LINK NAVIGATOR — Context-preserving cross-page navigation
// =============================================================================

interface NavigationContext {
  fromPage: string;
  fromEntity?: string;
  filters?: Record<string, any>;
  timestamp: number;
}

const NavContext = createContext<{
  navigate: (path: string, context?: Partial<NavigationContext>) => void;
  context: NavigationContext | null;
}>({
  navigate: () => {},
  context: null,
});

export const DeepLinkProvider: React.FC<{
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}> = ({ children, onNavigate }) => {
  const [context, setContext] = useState<NavigationContext | null>(null);

  const navigate = useCallback((path: string, ctx?: Partial<NavigationContext>) => {
    const fullContext: NavigationContext = {
      fromPage: window.location.pathname,
      timestamp: Date.now(),
      ...ctx,
    };
    setContext(fullContext);
    sessionStorage.setItem('datacendia-nav-context', JSON.stringify(fullContext));
    onNavigate(path);
  }, [onNavigate]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('datacendia-nav-context');
      if (stored) setContext(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  return (
    <NavContext.Provider value={{ navigate, context }}>
      {children}
    </NavContext.Provider>
  );
};

export const useDeepLink = () => useContext(NavContext);
