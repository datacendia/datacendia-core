// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL MODE SELECTOR - Enterprise Mode Selection Component
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Zap, Search, Shield, Target } from 'lucide-react';
import { COUNCIL_MODES, MODE_CATEGORIES, type CouncilMode } from '../../data/councilModes';
import { cn } from '../../../lib/utils';

interface CouncilModeSelectorProps {
  selectedMode: string;
  onModeChange: (modeId: string) => void;
  compact?: boolean;
  className?: string;
}

// Compact dropdown selector
export function CouncilModeSelector({
  selectedMode,
  onModeChange,
  compact = false,
  className,
}: CouncilModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mode = COUNCIL_MODES[selectedMode] || COUNCIL_MODES['war-room'];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (compact) {
    return (
      <div className={cn('relative', className)} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <span className="text-lg">{mode.emoji}</span>
          <span className="text-white font-medium">{mode.name}</span>
          <ChevronDown
            className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
            {Object.entries(MODE_CATEGORIES).map(([category, modeIds]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                  {category}
                </div>
                {modeIds.map((modeId) => {
                  const m = COUNCIL_MODES[modeId];
                  if (!m) {
                    return null;
                  }
                  return (
                    <button
                      key={modeId}
                      onClick={() => {
                        onModeChange(modeId);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 transition-colors',
                        selectedMode === modeId && 'bg-slate-700'
                      )}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.shortDesc}</div>
                      </div>
                      {selectedMode === modeId && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full grid view
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
      {Object.values(COUNCIL_MODES).map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all text-left',
            selectedMode === m.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-semibold text-white">{m.name}</span>
          </div>
          <p className="text-xs text-slate-400 italic">"{m.primeDirective}"</p>
          <p className="text-xs text-slate-500 mt-1">{m.shortDesc}</p>
        </button>
      ))}
    </div>
  );
}

// Mode Badge (inline display)
export function CouncilModeBadge({ modeId }: { modeId: string }) {
  const mode = COUNCIL_MODES[modeId] || COUNCIL_MODES['war-room'];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
    >
      <span>{mode.emoji}</span>
      <span>{mode.name}</span>
    </span>
  );
}

// Mode Info Card (expanded details)
export function CouncilModeCard({ modeId }: { modeId: string }) {
  const mode = COUNCIL_MODES[modeId] || COUNCIL_MODES['war-room'];
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ borderColor: `${mode.color}40`, backgroundColor: `${mode.color}10` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{mode.emoji}</span>
        <div>
          <h3 className="font-bold text-lg text-white">{mode.name} Mode</h3>
          <p className="text-sm italic" style={{ color: mode.color }}>
            "{mode.primeDirective}"
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-3">{mode.description}</p>
      <div className="flex flex-wrap gap-2">
        {mode.useCases.slice(0, 4).map((useCase, i) => (
          <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            {useCase}
          </span>
        ))}
      </div>
    </div>
  );
}

// Quick Mode Switcher (horizontal pills)
export function CouncilModeQuickSwitch({
  selectedMode,
  onModeChange,
  showAll = false,
}: {
  selectedMode: string;
  onModeChange: (id: string) => void;
  showAll?: boolean;
}) {
  const quickModes = showAll
    ? Object.values(COUNCIL_MODES)
    : [
        COUNCIL_MODES['war-room'],
        COUNCIL_MODES['rapid'],
        COUNCIL_MODES['execution'],
        COUNCIL_MODES['compliance'],
      ];

  return (
    <div className="flex flex-wrap gap-2">
      {quickModes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
            selectedMode === mode.id
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          )}
        >
          <span>{mode.emoji}</span>
          <span>{mode.name}</span>
        </button>
      ))}
    </div>
  );
}

export default CouncilModeSelector;
