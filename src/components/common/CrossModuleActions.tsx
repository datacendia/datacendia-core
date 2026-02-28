// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CrossModuleActions Component
 *
 * Displays cross-module integration pathways and actions.
 * Makes the "moat" of module integration visible to users.
 */

import React from 'react';

interface CrossModuleAction {
  id: string;
  fromModule: string;
  toModule: string;
  action: string;
  description: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

interface CrossModuleActionsProps {
  currentModule: string;
  context?: {
    decisionId?: string;
    simulationId?: string;
    artifactId?: string;
    assessmentId?: string;
  };
  variant?: 'inline' | 'panel' | 'floating';
  onAction?: (action: CrossModuleAction) => void;
}

// Define all cross-module integration pathways
const MODULE_INTEGRATIONS: Record<string, CrossModuleAction[]> = {
  council: [
    {
      id: 'council-to-dna',
      fromModule: 'council',
      toModule: 'decision-dna',
      action: 'Log to Decision DNA',
      description: 'Track this deliberation in your decision history',
      icon: '🧬',
      color: 'emerald',
    },
    {
      id: 'council-to-crucible',
      fromModule: 'council',
      toModule: 'crucible',
      action: 'Stress Test Decision',
      description: 'Run simulations on this recommendation',
      icon: '🔥',
      color: 'orange',
    },
    {
      id: 'council-to-vox',
      fromModule: 'council',
      toModule: 'vox',
      action: 'Run Stakeholder Assembly',
      description: 'Get stakeholder perspectives on this decision',
      icon: '🗣️',
      color: 'cyan',
    },
    {
      id: 'council-to-eternal',
      fromModule: 'council',
      toModule: 'eternal',
      action: 'Archive for Posterity',
      description: 'Preserve this decision for future reference',
      icon: '📜',
      color: 'amber',
    },
  ],
  'decision-dna': [
    {
      id: 'dna-to-council',
      fromModule: 'decision-dna',
      toModule: 'council',
      action: 'Re-deliberate',
      description: 'Open a new Council session on this decision',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'dna-to-chronos',
      fromModule: 'decision-dna',
      toModule: 'chronos',
      action: 'View in Timeline',
      description: 'See this decision in historical context',
      icon: '⏰',
      color: 'blue',
    },
    {
      id: 'dna-to-crucible',
      fromModule: 'decision-dna',
      toModule: 'crucible',
      action: 'What-If Analysis',
      description: 'Simulate alternative outcomes',
      icon: '🔥',
      color: 'orange',
    },
  ],
  crucible: [
    {
      id: 'crucible-to-council',
      fromModule: 'crucible',
      toModule: 'council',
      action: 'Create Council Briefing',
      description: 'Deliberate on simulation findings',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'crucible-to-dna',
      fromModule: 'crucible',
      toModule: 'decision-dna',
      action: 'Log Scenario Results',
      description: 'Record simulation outcomes',
      icon: '🧬',
      color: 'emerald',
    },
    {
      id: 'crucible-to-vox',
      fromModule: 'crucible',
      toModule: 'vox',
      action: 'Stakeholder Impact',
      description: 'Assess stakeholder impact of scenario',
      icon: '🗣️',
      color: 'cyan',
    },
  ],
  panopticon: [
    {
      id: 'panopticon-to-council',
      fromModule: 'panopticon',
      toModule: 'council',
      action: 'Create Council Briefing',
      description: 'Deliberate on regulatory findings',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'panopticon-to-crucible',
      fromModule: 'panopticon',
      toModule: 'crucible',
      action: 'Launch Stress Test',
      description: 'Simulate regulatory impact',
      icon: '🔥',
      color: 'orange',
    },
    {
      id: 'panopticon-to-dna',
      fromModule: 'panopticon',
      toModule: 'decision-dna',
      action: 'Log Assessment',
      description: 'Record regulatory assessment',
      icon: '🧬',
      color: 'emerald',
    },
  ],
  vox: [
    {
      id: 'vox-to-council',
      fromModule: 'vox',
      toModule: 'council',
      action: 'Stakeholder Council',
      description: 'Run Council with stakeholder voices',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'vox-to-dna',
      fromModule: 'vox',
      toModule: 'decision-dna',
      action: 'Log Veto Event',
      description: 'Record stakeholder veto in DNA',
      icon: '🧬',
      color: 'emerald',
    },
  ],
  chronos: [
    {
      id: 'chronos-to-council',
      fromModule: 'chronos',
      toModule: 'council',
      action: 'Replay Deliberation',
      description: 'View original Council session',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'chronos-to-crucible',
      fromModule: 'chronos',
      toModule: 'crucible',
      action: 'What-If from Point',
      description: 'Branch simulation from this moment',
      icon: '🔥',
      color: 'orange',
    },
  ],
  eternal: [
    {
      id: 'eternal-to-council',
      fromModule: 'eternal',
      toModule: 'council',
      action: 'Deliberate on Artifact',
      description: 'Discuss archived wisdom',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'eternal-to-chronos',
      fromModule: 'eternal',
      toModule: 'chronos',
      action: 'View in Timeline',
      description: 'See artifact in historical context',
      icon: '⏰',
      color: 'blue',
    },
  ],
  symbiont: [
    {
      id: 'symbiont-to-council',
      fromModule: 'symbiont',
      toModule: 'council',
      action: 'Partner Deliberation',
      description: 'Deliberate on partnership decision',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'symbiont-to-crucible',
      fromModule: 'symbiont',
      toModule: 'crucible',
      action: 'Stress Test Partnership',
      description: 'Simulate partnership scenarios',
      icon: '🔥',
      color: 'orange',
    },
  ],
  aegis: [
    {
      id: 'aegis-to-council',
      fromModule: 'aegis',
      toModule: 'council',
      action: 'Threat Briefing',
      description: 'Deliberate on security threat',
      icon: '⚖️',
      color: 'purple',
    },
    {
      id: 'aegis-to-crucible',
      fromModule: 'aegis',
      toModule: 'crucible',
      action: 'Attack Simulation',
      description: 'Simulate threat impact',
      icon: '🔥',
      color: 'orange',
    },
  ],
};

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hover: 'hover:bg-emerald-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    hover: 'hover:bg-orange-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    hover: 'hover:bg-cyan-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hover: 'hover:bg-amber-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/20',
  },
};

export const CrossModuleActions: React.FC<CrossModuleActionsProps> = ({
  currentModule,
  context,
  variant = 'inline',
  onAction,
}) => {
  const actions = MODULE_INTEGRATIONS[currentModule] || [];

  if (actions.length === 0) {return null;}

  const handleAction = (action: CrossModuleAction) => {
    if (onAction) {
      onAction(action);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  // Inline variant - horizontal button strip
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const colors = colorClasses[action.color] || colorClasses.purple;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={`px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-2 group`}
              title={action.description}
            >
              <span>{action.icon}</span>
              <span className={`text-sm font-medium ${colors.text}`}>{action.action}</span>
              <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Panel variant - vertical list with descriptions
  if (variant === 'panel') {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔗</span>
          <h3 className="font-semibold text-white">Cross-Module Actions</h3>
        </div>
        <div className="space-y-2">
          {actions.map((action) => {
            const colors = colorClasses[action.color] || colorClasses.purple;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`w-full px-4 py-3 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-3 text-left`}
              >
                <span className="text-xl">{action.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium ${colors.text}`}>{action.action}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
                <span className="text-slate-500">→</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Floating variant - compact floating bar
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-slate-400">Actions:</span>
          {actions.slice(0, 4).map((action) => {
            const colors = colorClasses[action.color] || colorClasses.purple;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-2`}
                title={action.description}
              >
                <span>{action.icon}</span>
                <span className={`text-sm ${colors.text}`}>{action.action}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

// Compact version for embedding in results/cards
export const CrossModuleQuickActions: React.FC<{
  currentModule: string;
  maxActions?: number;
  onAction?: (action: CrossModuleAction) => void;
}> = ({ currentModule, maxActions = 3, onAction }) => {
  const actions = (MODULE_INTEGRATIONS[currentModule] || []).slice(0, maxActions);

  if (actions.length === 0) {return null;}

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
      <span className="text-xs text-slate-500">Next:</span>
      {actions.map((action) => {
        const colors = colorClasses[action.color] || colorClasses.purple;
        return (
          <button
            key={action.id}
            onClick={() => onAction?.(action)}
            className={`px-2 py-1 rounded text-xs ${colors.bg} ${colors.text} ${colors.hover} transition-all flex items-center gap-1`}
            title={action.description}
          >
            <span>{action.icon}</span>
            <span>{action.action}</span>
          </button>
        );
      })}
    </div>
  );
};

// Integration workflow indicator
export const IntegrationWorkflowBadge: React.FC<{
  workflow: string[];
  currentStep: number;
}> = ({ workflow, currentStep }) => {
  const moduleIcons: Record<string, string> = {
    council: '⚖️',
    'decision-dna': '🧬',
    crucible: '🔥',
    vox: '🗣️',
    chronos: '⏰',
    eternal: '📜',
    panopticon: '👁️',
    symbiont: '🤝',
    aegis: '🛡️',
  };

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
      <span className="text-xs text-slate-500 mr-1">Workflow:</span>
      {workflow.map((mod, idx) => (
        <React.Fragment key={mod}>
          <span
            className={`text-sm ${idx <= currentStep ? 'opacity-100' : 'opacity-40'}`}
            title={mod}
          >
            {moduleIcons[mod] || '📦'}
          </span>
          {idx < workflow.length - 1 && (
            <span
              className={`text-xs ${idx < currentStep ? 'text-emerald-400' : 'text-slate-600'}`}
            >
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CrossModuleActions;
