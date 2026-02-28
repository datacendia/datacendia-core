// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// PERSONALITY TRAITS PANEL
// UI for toggling AI agent personality traits
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  Settings,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Check,
  X,
  Info,
  Zap,
  RefreshCw,
} from 'lucide-react';
import {
  PersonalityTrait,
  TraitCategory,
  getAvailableTraits,
  getTraitCategories,
  getTraitsByCategory,
  validateTraitCombination,
  getTrait,
} from '../../lib/agents/personality';

interface PersonalityTraitsPanelProps {
  agentId: string;
  agentName: string;
  enabledTraits: string[];
  onTraitsChange: (enabledTraits: string[]) => void;
  compact?: boolean;
}

export const PersonalityTraitsPanel: React.FC<PersonalityTraitsPanelProps> = ({
  agentId,
  agentName,
  enabledTraits,
  onTraitsChange,
  compact = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<TraitCategory>>(new Set());
  const [showConflicts, setShowConflicts] = useState(false);

  const categories = getTraitCategories();
  const allTraits = getAvailableTraits();

  const validation = useMemo(() => {
    return validateTraitCombination(enabledTraits);
  }, [enabledTraits]);

  const toggleCategory = (category: TraitCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleTrait = (traitId: string) => {
    const newTraits = enabledTraits.includes(traitId)
      ? enabledTraits.filter((id) => id !== traitId)
      : [...enabledTraits, traitId];
    onTraitsChange(newTraits);
  };

  const clearAllTraits = () => {
    onTraitsChange([]);
  };

  const isTraitConflicting = (traitId: string): boolean => {
    if (!enabledTraits.includes(traitId)) {
      return false;
    }
    return validation.conflicts.some(([t1, t2]) => t1 === traitId || t2 === traitId);
  };

  const wouldConflict = (traitId: string): string[] => {
    const trait = getTrait(traitId);
    if (!trait || enabledTraits.includes(traitId)) {
      return [];
    }

    return enabledTraits.filter(
      (enabledId) =>
        trait.conflictsWith?.includes(enabledId) ||
        getTrait(enabledId)?.conflictsWith?.includes(traitId)
    );
  };

  const getIntensityColor = (intensity: string): string => {
    switch (intensity) {
      case 'subtle':
        return 'bg-blue-500/20 text-blue-400';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400';
      case 'strong':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-white">Personality Traits</span>
          </div>
          <span className="text-xs text-slate-400">{enabledTraits.length} active</span>
        </div>

        {enabledTraits.length === 0 ? (
          <p className="text-xs text-slate-500">All traits disabled (default behavior)</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {enabledTraits.map((traitId) => {
              const trait = getTrait(traitId);
              if (!trait) {
                return null;
              }
              return (
                <button
                  key={traitId}
                  onClick={() => toggleTrait(traitId)}
                  className={`
                    px-2 py-1 rounded text-xs flex items-center gap-1
                    ${
                      isTraitConflicting(traitId)
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }
                    hover:bg-opacity-30 transition-colors
                  `}
                >
                  <span>{trait.icon}</span>
                  <span>{trait.name}</span>
                  <X size={12} />
                </button>
              );
            })}
          </div>
        )}

        {!validation.valid && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={12} />
            <span>Conflicting traits detected</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings size={20} className="text-indigo-400" />
              Personality Traits
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Customize {agentName}'s personality and communication style
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`
              px-3 py-1.5 rounded-full text-sm font-medium
              ${
                enabledTraits.length === 0
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-indigo-500/20 text-indigo-400'
              }
            `}
            >
              {enabledTraits.length} / {allTraits.length} active
            </span>

            {enabledTraits.length > 0 && (
              <button
                onClick={clearAllTraits}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
              >
                <RefreshCw size={14} />
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Conflict Warning */}
        {!validation.valid && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Conflicting Traits Detected</p>
              <p className="text-xs text-red-300/70 mt-1">
                {validation.conflicts
                  .map(([t1, t2]) => `${getTrait(t1)?.name} ↔ ${getTrait(t2)?.name}`)
                  .join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
          <Info size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-300/80">
            <p className="font-medium text-indigo-300">How Personality Traits Work</p>
            <p className="mt-1">
              Traits modify how the AI agent communicates and reasons. All traits are{' '}
              <strong>OFF by default</strong> for standard professional behavior. Enable traits to
              customize agent personality for specific use cases like devil's advocate analysis,
              creative brainstorming, or risk assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-slate-700/50">
        {categories.map((category) => {
          const categoryTraits = getTraitsByCategory(category.id);
          const enabledCount = categoryTraits.filter((t) => enabledTraits.includes(t.id)).length;
          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={20} className="text-slate-400" />
                  )}
                  <div className="text-left">
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{categoryTraits.length} traits</span>
                  {enabledCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                      {enabledCount} active
                    </span>
                  )}
                </div>
              </button>

              {/* Traits Grid */}
              {isExpanded && (
                <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTraits.map((trait) => {
                    const isEnabled = enabledTraits.includes(trait.id);
                    const conflicting = isTraitConflicting(trait.id);
                    const potentialConflicts = wouldConflict(trait.id);

                    return (
                      <div
                        key={trait.id}
                        className={`
                          relative p-4 rounded-lg border transition-all cursor-pointer
                          ${
                            isEnabled
                              ? conflicting
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-indigo-500/10 border-indigo-500/30'
                              : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                          }
                        `}
                        onClick={() => toggleTrait(trait.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{trait.icon}</span>
                            <div>
                              <h5 className="font-medium text-white">{trait.name}</h5>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded ${getIntensityColor(trait.intensity)}`}
                              >
                                {trait.intensity}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${
                              isEnabled
                                ? conflicting
                                  ? 'bg-red-500'
                                  : 'bg-indigo-500'
                                : 'bg-slate-700'
                            }
                          `}
                          >
                            {isEnabled ? (
                              <Check size={14} className="text-white" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-500" />
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-2">{trait.description}</p>

                        {/* Show potential conflicts for disabled traits */}
                        {!isEnabled && potentialConflicts.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                            <AlertCircle size={12} />
                            <span>
                              Would conflict with:{' '}
                              {potentialConflicts.map((id) => getTrait(id)?.name).join(', ')}
                            </span>
                          </div>
                        )}

                        {/* Conflicts indicator for enabled traits */}
                        {isEnabled && conflicting && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                            <AlertCircle size={12} />
                            <span>Conflicts with other enabled traits</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with Active Traits Summary */}
      {enabledTraits.length > 0 && (
        <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            Active Personality Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {enabledTraits.map((traitId) => {
              const trait = getTrait(traitId);
              if (!trait) {
                return null;
              }
              return (
                <span
                  key={traitId}
                  className={`
                    px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                    ${
                      isTraitConflicting(traitId)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-indigo-500/20 text-indigo-400'
                    }
                  `}
                >
                  {trait.icon} {trait.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// QUICK TRAIT TOGGLE COMPONENT
// For inline use in agent cards
// =============================================================================

interface QuickTraitToggleProps {
  traitId: string;
  isEnabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export const QuickTraitToggle: React.FC<QuickTraitToggleProps> = ({
  traitId,
  isEnabled,
  onToggle,
  size = 'md',
}) => {
  const trait = getTrait(traitId);
  if (!trait) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs gap-1' : 'px-3 py-1.5 text-sm gap-1.5';

  return (
    <button
      onClick={onToggle}
      className={`
        rounded-lg flex items-center transition-all
        ${sizeClasses}
        ${
          isEnabled
            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700'
        }
      `}
      title={trait.description}
    >
      <span>{trait.icon}</span>
      <span>{trait.name}</span>
      <span className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`} />
    </button>
  );
};

export default PersonalityTraitsPanel;
