// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * GUIDED WALKTHROUGH COMPONENT
 * =============================================================================
 * Interactive step-by-step tour using react-joyride.
 * Highlights UI elements and provides explanations for demos.
 */

import React, { useState, useCallback, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// =============================================================================
// TYPES
// =============================================================================

export interface WalkthroughStep extends Step {
  route?: string; // Navigate to this route before showing step
  waitMs?: number; // Wait before showing step
}

export interface WalkthroughConfig {
  id: string;
  name: string;
  description: string;
  steps: WalkthroughStep[];
}

interface GuidedWalkthroughProps {
  walkthrough: WalkthroughConfig;
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

// =============================================================================
// WALKTHROUGH DEFINITIONS
// =============================================================================

export const WALKTHROUGHS: Record<string, WalkthroughConfig> = {
  'platform-overview': {
    id: 'platform-overview',
    name: 'Platform Overview',
    description: 'Quick tour of the Datacendia platform',
    steps: [
      {
        target: '.sidebar-nav',
        content: 'Welcome to Datacendia! This sidebar contains all your decision intelligence tools organized by category.',
        placement: 'right',
        disableBeacon: true,
        route: '/cortex/dashboard'
      },
      {
        target: '[data-tour="core-suite"]',
        content: 'The Core Suite contains your primary decision-making tools: The Council, Chronos, Ghost Board, Pre-Mortem Engine, and Decision Debt tracker.',
        placement: 'right'
      },
      {
        target: '[data-tour="trust-layer"]',
        content: 'The Trust Layer provides compliance and audit capabilities: Oversight for governance, Decision DNA for lineage, and Crucible for adversarial testing.',
        placement: 'right'
      },
      {
        target: '[data-tour="user-menu"]',
        content: 'Access your profile, settings, and demo mode controls from here.',
        placement: 'bottom'
      }
    ]
  },
  'council-tour': {
    id: 'council-tour',
    name: 'The Council Tour',
    description: 'Learn how multi-agent deliberation works',
    steps: [
      {
        target: '.council-input',
        content: 'Start by entering your decision question here. Be specific about what you need to decide and any relevant context.',
        placement: 'bottom',
        disableBeacon: true,
        route: '/cortex/council'
      },
      {
        target: '.document-upload',
        content: 'Upload supporting documents like financial statements, contracts, or reports. The Council will analyze these during deliberation.',
        placement: 'bottom'
      },
      {
        target: '.agent-panel',
        content: 'Watch as specialized AI agents deliberate on your question. Each agent brings domain expertise: CFO, Legal, Risk, Strategy, and more.',
        placement: 'left'
      },
      {
        target: '.agent-vote',
        content: 'Each agent provides a vote (Support, Oppose, or Conditional) along with their confidence level and reasoning.',
        placement: 'left'
      },
      {
        target: '.dissent-indicator',
        content: 'Dissenting opinions are highlighted and permanently recorded. This ensures minority viewpoints are never lost.',
        placement: 'top'
      },
      {
        target: '.arbiter-synthesis',
        content: 'The Arbiter synthesizes all perspectives into a final recommendation with conditions and risk factors.',
        placement: 'top'
      },
      {
        target: '.export-packet',
        content: 'Export the complete deliberation as a cryptographically signed evidence packet for audit and compliance.',
        placement: 'left'
      }
    ]
  },
  'chronos-tour': {
    id: 'chronos-tour',
    name: 'Chronos Timeline Tour',
    description: 'Discover pivotal moments in your decision history',
    steps: [
      {
        target: '.chronos-timeline',
        content: 'Chronos analyzes your historical decisions to identify pivotal moments that shaped your current state.',
        placement: 'bottom',
        disableBeacon: true,
        route: '/cortex/enterprise/chronos'
      },
      {
        target: '.pivotal-moment',
        content: 'Each pivotal moment shows the decision, who made it, what alternatives were considered, and the actual consequences.',
        placement: 'right'
      },
      {
        target: '.counterfactual',
        content: 'Counterfactual analysis shows what would have happened if a different choice was made.',
        placement: 'bottom'
      },
      {
        target: '.pattern-analysis',
        content: 'Pattern analysis identifies decision-making tendencies that have historically led to success or failure.',
        placement: 'top'
      }
    ]
  },
  'cascade-tour': {
    id: 'cascade-tour',
    name: 'Cascade Ripple Analysis Tour',
    description: 'See downstream effects before you decide',
    steps: [
      {
        target: '.cascade-input',
        content: 'Enter a proposed change or decision. Cascade will analyze the ripple effects across your organization.',
        placement: 'bottom',
        disableBeacon: true,
        route: '/cortex/enterprise/cascade'
      },
      {
        target: '.ripple-visualization',
        content: 'Effects are organized by order: First-order (direct), Second-order (indirect), Third-order (systemic), and Fourth-order (long-term).',
        placement: 'left'
      },
      {
        target: '.hidden-costs',
        content: 'Hidden costs are surfaced that may not be visible in traditional analysis. These often exceed the obvious costs.',
        placement: 'top'
      },
      {
        target: '.alternatives',
        content: 'Alternative approaches are compared with their own ripple effects, helping you find the best path forward.',
        placement: 'bottom'
      }
    ]
  },
  'oversight-tour': {
    id: 'oversight-tour',
    name: 'Oversight Compliance Tour',
    description: 'Real-time compliance posture and audit readiness',
    steps: [
      {
        target: '.compliance-dashboard',
        content: 'Your real-time compliance posture across all frameworks. Green means compliant, yellow means attention needed.',
        placement: 'bottom',
        disableBeacon: true,
        route: '/cortex/enterprise/oversight'
      },
      {
        target: '.control-status',
        content: 'Each control shows its current status, evidence, and last test date. Click to see full details.',
        placement: 'right'
      },
      {
        target: '.evidence-generator',
        content: 'Generate audit-ready evidence packets with one click. Includes all documentation, logs, and cryptographic proof.',
        placement: 'left'
      },
      {
        target: '.framework-selector',
        content: 'Switch between compliance frameworks: HIPAA, SOC 2, ISO 27001, GDPR, and more.',
        placement: 'bottom'
      }
    ]
  },
  'demo-mode-tour': {
    id: 'demo-mode-tour',
    name: 'Demo Mode Tour',
    description: 'Learn how to use demo mode for presentations',
    steps: [
      {
        target: '[data-tour="demo-toggle"]',
        content: 'Toggle Demo Mode to show pre-loaded realistic scenarios. Perfect for investor presentations and client demos.',
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-tour="demo-scenarios"]',
        content: 'Choose from multiple demo scenarios: Cyber Insurance, Hospital Timeline, Plant Closure, and more.',
        placement: 'right'
      },
      {
        target: '[data-tour="demo-controls"]',
        content: 'Control the demo playback: play/pause, skip steps, or jump to specific sections.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="demo-script"]',
        content: 'View the presenter script for each step. Great for rehearsing your demo.',
        placement: 'left'
      }
    ]
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export const GuidedWalkthrough: React.FC<GuidedWalkthroughProps> = ({
  walkthrough,
  onComplete,
  onSkip,
  autoStart = true
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [run, setRun] = useState(autoStart);
  const [stepIndex, setStepIndex] = useState(0);

  // Handle route navigation for steps
  useEffect(() => {
    if (run && walkthrough.steps[stepIndex]?.route) {
      navigate(walkthrough.steps[stepIndex].route!);
    }
  }, [run, stepIndex, walkthrough.steps, navigate]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as typeof STATUS.FINISHED)) {
      setRun(false);
      if (status === STATUS.FINISHED) {
        onComplete?.();
      } else {
        onSkip?.();
      }
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      
      // Check if next step has a route
      if (walkthrough.steps[nextIndex]?.route) {
        navigate(walkthrough.steps[nextIndex].route!);
        // Wait for navigation before showing step
        setTimeout(() => {
          setStepIndex(nextIndex);
        }, walkthrough.steps[nextIndex].waitMs || 300);
      } else {
        setStepIndex(nextIndex);
      }
    }
  }, [navigate, onComplete, onSkip, walkthrough.steps]);

  return (
    <Joyride
      steps={walkthrough.steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      spotlightClicks
      disableOverlayClose
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#6366f1', // Indigo
          backgroundColor: '#1e1e2e',
          textColor: '#e2e8f0',
          arrowColor: '#1e1e2e',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10000
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px'
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px'
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: 1.6
        },
        buttonNext: {
          backgroundColor: '#6366f1',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px'
        },
        buttonBack: {
          color: '#94a3b8',
          marginRight: '8px'
        },
        buttonSkip: {
          color: '#64748b'
        },
        spotlight: {
          borderRadius: '8px'
        }
      }}
      locale={{
        back: t('common.back', 'Back'),
        close: t('common.close', 'Close'),
        last: t('common.finish', 'Finish'),
        next: t('common.next', 'Next'),
        skip: t('common.skip', 'Skip Tour')
      }}
    />
  );
};

// =============================================================================
// WALKTHROUGH LAUNCHER
// =============================================================================

interface WalkthroughLauncherProps {
  walkthroughId: string;
  children: React.ReactNode;
  className?: string;
}

export const WalkthroughLauncher: React.FC<WalkthroughLauncherProps> = ({
  walkthroughId,
  children,
  className
}) => {
  const [isActive, setIsActive] = useState(false);
  const walkthrough = WALKTHROUGHS[walkthroughId];

  if (!walkthrough) {
    console.warn(`Walkthrough "${walkthroughId}" not found`);
    return <>{children}</>;
  }

  return (
    <>
      <div className={className} onClick={() => setIsActive(true)}>
        {children}
      </div>
      {isActive && (
        <GuidedWalkthrough
          walkthrough={walkthrough}
          onComplete={() => setIsActive(false)}
          onSkip={() => setIsActive(false)}
        />
      )}
    </>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default GuidedWalkthrough;
