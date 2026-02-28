// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - PAGE GUIDE COMPONENT
// Reusable wizard/tooltip/guide for onboarding users to service pages
// Features: step-by-step guide, show/hide toggle, skip option, localStorage persistence
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface GuideStep {
  title: string;
  description: string;
  icon?: string;
  action?: string;
  highlight?: string; // CSS selector to highlight
}

export interface PageGuideProps {
  pageId: string; // Unique ID for localStorage persistence
  title: string;
  description?: string;
  steps: GuideStep[];
  className?: string;
}

export const PageGuide: React.FC<PageGuideProps> = ({
  pageId,
  title,
  description,
  steps,
  className,
}) => {
  const storageKey = `datacendia-guide-${pageId}`;

  const [isVisible, setIsVisible] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        setIsSkipped(prefs.skipped || false);
        setIsMinimized(prefs.minimized || false);
        setCurrentStep(prefs.currentStep || 0);
      } catch {
        // Ignore parse errors
      }
    }
  }, [storageKey]);

  // Save preferences to localStorage
  const savePrefs = (updates: { skipped?: boolean; minimized?: boolean; currentStep?: number }) => {
    const stored = localStorage.getItem(storageKey);
    let prefs = {};
    try {
      prefs = stored ? JSON.parse(stored) : {};
    } catch {
      // Ignore
    }
    const newPrefs = { ...prefs, ...updates };
    localStorage.setItem(storageKey, JSON.stringify(newPrefs));
  };

  const handleSkip = () => {
    setIsSkipped(true);
    savePrefs({ skipped: true });
  };

  const handleReset = () => {
    setIsSkipped(false);
    setCurrentStep(0);
    setIsMinimized(false);
    savePrefs({ skipped: false, currentStep: 0, minimized: false });
  };

  const handleToggleMinimize = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    savePrefs({ minimized: newMinimized });
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      savePrefs({ currentStep: newStep });
    } else {
      // Completed all steps
      handleSkip();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      savePrefs({ currentStep: newStep });
    }
  };

  const handleGoToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    savePrefs({ currentStep: stepIndex });
  };

  // If skipped, show only the "Show Guide" button
  if (isSkipped) {
    return (
      <button
        onClick={handleReset}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2',
          'bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg',
          'text-sm font-medium transition-all',
          className
        )}
      >
        <span>❓</span>
        <span>Show Guide</span>
      </button>
    );
  }

  // Minimized view
  if (isMinimized) {
    return (
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl',
          'p-3 flex items-center gap-3',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="text-white font-medium text-sm">{title}</span>
          <span className="text-slate-400 text-xs">
            Step {currentStep + 1}/{steps.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleMinimize}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="Expand guide"
          >
            ⬆️
          </button>
          <button
            onClick={handleSkip}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="Hide guide"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl',
        'w-96 max-h-[70vh] overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="text-white font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleMinimize}
            className="p-1.5 hover:bg-white/20 rounded text-white/80 hover:text-white"
            title="Minimize"
          >
            ⬇️
          </button>
          <button
            onClick={handleSkip}
            className="p-1.5 hover:bg-white/20 rounded text-white/80 hover:text-white"
            title="Skip guide"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Description */}
      {description && currentStep === 0 && (
        <div className="px-4 py-2 bg-slate-700/50 border-b border-slate-600 text-slate-300 text-sm">
          {description}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-700/30 border-b border-slate-700">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleGoToStep(idx)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              idx === currentStep
                ? 'bg-indigo-500 w-4'
                : idx < currentStep
                  ? 'bg-green-500'
                  : 'bg-slate-600 hover:bg-slate-500'
            )}
            title={`Step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Current step content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center text-2xl">
            {currentStepData.icon || `${currentStep + 1}`}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-1">{currentStepData.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{currentStepData.description}</p>
            {currentStepData.action && (
              <div className="mt-2 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs">
                💡 {currentStepData.action}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-3 bg-slate-700/30 border-t border-slate-700">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={cn(
            'px-3 py-1.5 rounded text-sm font-medium transition-all',
            currentStep === 0
              ? 'text-slate-500 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          )}
        >
          ← Previous
        </button>

        <span className="text-slate-500 text-xs">
          {currentStep + 1} of {steps.length}
        </span>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNextStep}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-all"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-all"
          >
            ✓ Done
          </button>
        )}
      </div>

      {/* Skip option */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-center">
        <button
          onClick={handleSkip}
          className="text-slate-500 hover:text-slate-300 text-xs transition-all"
        >
          Skip this guide and don't show again
        </button>
      </div>
    </div>
  );
};

// Pre-defined guides for various pages
export const GUIDES = {
  decisionDNA: {
    pageId: 'decision-dna',
    title: 'Decision DNA Guide',
    description: 'Track the full lifecycle of any business decision with step-by-step replay.',
    steps: [
      {
        title: 'Create a Decision',
        description:
          'Start by entering a decision title and description in the form on the left. Add optional budget and timeframe.',
        icon: '✏️',
        action: 'Try: "Close EU expansion deal" or "Approve $50M capex for new data centre"',
      },
      {
        title: 'View Tracked Decisions',
        description:
          'Your decisions appear in the list below. Use filters (All | Deciding | Decided | At Risk) to focus on what matters.',
        icon: '📋',
        action: 'Click on a sample decision to explore its full timeline',
      },
      {
        title: 'Timeline & Artefacts',
        description:
          'Each timeline event links to real system outputs - Council minutes, Pre-Mortem analyses, Ghost Board simulations. Click "Open" to view the original artefact.',
        icon: '📜',
        action: 'Hover over any event and click "↗️ Open" to see the source',
      },
      {
        title: 'AI Council Deliberation',
        description:
          'Council events show how AI agents (CEO, CFO, CRO) deliberated - their stances, confidence levels, and consensus reached.',
        icon: '🏛️',
        action: 'Expand a Council Deliberation to see agent-by-agent analysis',
      },
      {
        title: 'Replay in Chronos',
        description:
          'Click "Replay in Chronos" to step through the decision history like a flight recorder. Every step is cryptographically anchored.',
        icon: '🎬',
        action: 'Watch the decision unfold step-by-step',
      },
      {
        title: 'Cryptographic Audit Trail',
        description:
          'Every decision here is: hashed into Chronos, replayable, and exportable for audits. The green hash banner proves immutability.',
        icon: '🔐',
        action: 'Export PDF for boards, JSON for integrations',
      },
    ],
  },

  council: {
    pageId: 'council',
    title: 'AI Council Guide',
    description:
      'Get balanced analysis from multiple AI agents representing different perspectives.',
    steps: [
      {
        title: 'Enter Your Question',
        description: 'Type a strategic question or decision you need help with in the input field.',
        icon: '❓',
        action: 'Try: "Should we expand into the European market?"',
      },
      {
        title: 'Select Agents',
        description:
          'Choose which AI agents (CEO, CFO, CRO, etc.) should participate in the deliberation.',
        icon: '👥',
        action: 'Select 3-5 agents for diverse perspectives',
      },
      {
        title: 'Choose Mode',
        description:
          'Select the council mode: Deliberation for discussion, Debate for opposing views, or Consensus for agreement.',
        icon: '⚙️',
      },
      {
        title: 'Run Council Session',
        description: 'Click "Convene Council" to get each agent\'s analysis and recommendation.',
        icon: '🏛️',
        action: 'Watch agents deliberate in real-time',
      },
      {
        title: 'Review Synthesis',
        description: 'Read the synthesized recommendation that combines all agent perspectives.',
        icon: '📊',
      },
    ],
  },

  preMortem: {
    pageId: 'pre-mortem',
    title: 'Pre-Mortem Guide',
    description:
      'Identify potential failure modes before they happen with AI-powered risk analysis.',
    steps: [
      {
        title: 'Describe Your Decision',
        description: 'Enter the decision or initiative you want to analyze for potential failures.',
        icon: '📝',
        action: "Be specific about what you're planning",
      },
      {
        title: 'Add Context',
        description:
          'Provide relevant context like budget, timeline, stakeholders, and constraints.',
        icon: '📋',
      },
      {
        title: 'Run Analysis',
        description: 'Click "Run Pre-Mortem" to have AI agents identify potential failure modes.',
        icon: '💀',
        action: 'AI will simulate future failures',
      },
      {
        title: 'Review Risks',
        description:
          'Examine each failure mode with probability, impact, and mitigation strategies.',
        icon: '⚠️',
      },
      {
        title: 'Get Recommendation',
        description:
          'See the overall risk score and recommendation: Proceed, Delay, or Reconsider.',
        icon: '✅',
      },
    ],
  },

  ghostBoard: {
    pageId: 'ghost-board',
    title: 'Ghost Board Guide',
    description:
      'Simulate a board meeting to prepare for tough questions before the real presentation.',
    steps: [
      {
        title: 'Set Up Presentation',
        description: 'Enter your proposal or decision that you would present to the board.',
        icon: '🎯',
      },
      {
        title: 'Select Board Members',
        description: 'Choose which simulated board members to include (investors, advisors, etc.).',
        icon: '👻',
      },
      {
        title: 'Run Simulation',
        description: 'Click "Simulate Board" to generate tough questions each member might ask.',
        icon: '▶️',
      },
      {
        title: 'Prepare Answers',
        description: 'Review questions by difficulty level and prepare your responses.',
        icon: '💬',
      },
      {
        title: 'Check Preparedness',
        description: 'See your preparedness score and identify critical gaps to address.',
        icon: '📊',
      },
    ],
  },

  metrics: {
    pageId: 'metrics',
    title: 'Metrics Dashboard Guide',
    description: 'Monitor your key business metrics and track performance over time.',
    steps: [
      {
        title: 'View Key Metrics',
        description:
          'The dashboard shows your most important metrics with current values and trends.',
        icon: '📊',
      },
      {
        title: 'Filter by Category',
        description:
          'Use the category filter to focus on financial, operational, or customer metrics.',
        icon: '🔍',
      },
      {
        title: 'Analyze Trends',
        description: 'Click on any metric card to see detailed history and trend analysis.',
        icon: '📈',
      },
      {
        title: 'Set Targets',
        description: 'Compare current values against targets to track goal progress.',
        icon: '🎯',
      },
    ],
  },

  workflows: {
    pageId: 'workflows',
    title: 'Workflows Guide',
    description: 'Automate business processes with configurable workflow templates.',
    steps: [
      {
        title: 'Browse Workflows',
        description: 'View available workflow templates organized by category.',
        icon: '⚙️',
      },
      {
        title: 'Check Status',
        description: 'See which workflows are active, paused, or in draft state.',
        icon: '🔄',
      },
      {
        title: 'View Executions',
        description: 'Click a workflow to see its execution history and results.',
        icon: '📋',
      },
      {
        title: 'Execute Workflow',
        description: 'Run a workflow manually or configure automatic triggers.',
        icon: '▶️',
      },
    ],
  },

  integrations: {
    pageId: 'integrations',
    title: 'Integrations Guide',
    description: 'Connect your data sources to power AI-driven insights.',
    steps: [
      {
        title: 'View Data Sources',
        description: 'See all connected integrations and their current status.',
        icon: '🔌',
      },
      {
        title: 'Check Health',
        description: 'Monitor connection health - green means healthy, yellow needs attention.',
        icon: '💚',
      },
      {
        title: 'Add Integration',
        description: 'Click "Add Integration" to connect a new data source.',
        icon: '➕',
      },
      {
        title: 'Sync Data',
        description: 'Trigger manual syncs or configure automatic sync schedules.',
        icon: '🔄',
      },
    ],
  },

  alerts: {
    pageId: 'alerts',
    title: 'Alerts Guide',
    description: 'Stay informed about important events and anomalies in your data.',
    steps: [
      {
        title: 'View Alerts',
        description: 'See all active alerts sorted by severity: critical, warning, and info.',
        icon: '🚨',
      },
      {
        title: 'Filter Alerts',
        description: 'Use filters to focus on specific severities or categories.',
        icon: '🔍',
      },
      {
        title: 'Acknowledge Alerts',
        description: "Mark alerts as acknowledged once you've reviewed them.",
        icon: '✓',
      },
      {
        title: 'Take Action',
        description: 'Click an alert to see details and recommended actions.',
        icon: '⚡',
      },
    ],
  },
};

export default PageGuide;
