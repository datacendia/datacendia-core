// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - NARRATIVE GUIDE COMPONENT
// Enterprise Platinum: Interactive storyboard/user journey guides
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  CheckCircle2,
  Circle,
  Clock,
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Map,
  Route,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface NarrativeStep {
  title: string;
  description: string;
  action?: string;
  pillar?: string;
  space?: string;
  sovereign?: string;
  keyActions?: string[];
}

interface Narrative {
  title: string;
  subtitle: string;
  persona?: string;
  duration?: string;
  steps: NarrativeStep[];
}

type NarrativeId =
  | 'welcome'
  | 'executive'
  | 'dataEngineer'
  | 'complianceOfficer'
  | 'strategist'
  | 'quickStart';

interface NarrativeGuideProps {
  narrativeId: NarrativeId;
  variant?: 'modal' | 'sidebar' | 'inline' | 'floating';
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
}

// =============================================================================
// NARRATIVE SELECTOR
// =============================================================================

interface NarrativeSelectorProps {
  onSelect: (narrativeId: NarrativeId) => void;
  className?: string;
}

export const NarrativeSelector: React.FC<NarrativeSelectorProps> = ({
  onSelect,
  className = '',
}) => {
  const { t } = useTranslation();

  const narratives: { id: NarrativeId; icon: React.ReactNode; color: string }[] = [
    { id: 'quickStart', icon: <Play className="w-5 h-5" />, color: 'bg-green-500' },
    { id: 'welcome', icon: <Compass className="w-5 h-5" />, color: 'bg-primary-500' },
    { id: 'executive', icon: <User className="w-5 h-5" />, color: 'bg-purple-500' },
    { id: 'dataEngineer', icon: <Route className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'complianceOfficer', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-amber-500' },
    { id: 'strategist', icon: <Map className="w-5 h-5" />, color: 'bg-rose-500' },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-neutral-900">{t('common.select')} a Journey</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {narratives.map(({ id, icon, color }) => {
          const title = t(`narratives.${id}.title`);
          const subtitle = t(`narratives.${id}.subtitle`);
          const duration = t(`narratives.${id}.duration`);
          const persona = t(`narratives.${id}.persona`);

          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-left group"
            >
              <div
                className={`${color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform`}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 truncate">{title}</h4>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">{subtitle}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  {duration && !duration.includes('.duration') && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {duration}
                    </span>
                  )}
                  {persona && !persona.includes('.persona') && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {persona}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const NarrativeGuide: React.FC<NarrativeGuideProps> = ({
  narrativeId,
  variant = 'sidebar',
  onComplete,
  onStepChange,
  autoPlay = false,
  autoPlayDelay = 5000,
  className = '',
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isExpanded, setIsExpanded] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Parse narrative from translations
  const narrativeKey = `narratives.${narrativeId}`;
  const narrative: Narrative = {
    title: t(`${narrativeKey}.title`),
    subtitle: t(`${narrativeKey}.subtitle`),
    persona: t(`${narrativeKey}.persona`),
    duration: t(`${narrativeKey}.duration`),
    steps: [],
  };

  // Parse steps
  for (let i = 0; i < 20; i++) {
    const stepTitle = t(`${narrativeKey}.steps.${i}.title`);
    if (stepTitle && !stepTitle.includes('.steps.')) {
      const step: NarrativeStep = {
        title: stepTitle,
        description: t(`${narrativeKey}.steps.${i}.description`),
        action: t(`${narrativeKey}.steps.${i}.action`),
        pillar: t(`${narrativeKey}.steps.${i}.pillar`),
        space: t(`${narrativeKey}.steps.${i}.space`),
        sovereign: t(`${narrativeKey}.steps.${i}.sovereign`),
        keyActions: [],
      };

      // Parse key actions
      for (let j = 0; j < 10; j++) {
        const keyAction = t(`${narrativeKey}.steps.${i}.keyActions.${j}`);
        if (keyAction && !keyAction.includes('.keyActions.')) {
          step.keyActions?.push(keyAction);
        }
      }

      narrative.steps.push(step);
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < narrative.steps.length - 1) {
      const timer = setTimeout(() => {
        goToNext();
      }, autoPlayDelay);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === narrative.steps.length - 1) {
      setIsPlaying(false);
    }
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStep, narrative.steps.length, autoPlayDelay]);

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const goToNext = () => {
    if (currentStep < narrative.steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      onComplete?.();
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = narrative.steps[currentStep];
  const progress = ((currentStep + 1) / narrative.steps.length) * 100;

  // Floating variant
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden w-80">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">{narrative.title}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-white" />
              ) : (
                <ChevronUp className="w-4 h-4 text-white" />
              )}
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isExpanded && currentStepData && (
            <>
              {/* Step content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    Step {currentStep + 1} of {narrative.steps.length}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Key actions */}
                {currentStepData.keyActions && currentStepData.keyActions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {currentStepData.keyActions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-500">
                        <ArrowRight className="w-3 h-3" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action button */}
                {currentStepData.action && !currentStepData.action.includes('.action') && (
                  <button className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {currentStepData.action}
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <button
                  onClick={goToPrev}
                  disabled={currentStep === 0}
                  className="p-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Sidebar variant (default)
  if (variant === 'sidebar') {
    return (
      <div className={`bg-white rounded-xl border border-neutral-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-4">
          <h3 className="text-white font-semibold">{narrative.title}</h3>
          <p className="text-primary-100 text-sm mt-1">{narrative.subtitle}</p>
          {narrative.duration && !narrative.duration.includes('.duration') && (
            <div className="flex items-center gap-1 mt-2 text-primary-200 text-xs">
              <Clock className="w-3 h-3" />
              <span>{narrative.duration}</span>
            </div>
          )}
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="p-4 space-y-3">
          {narrative.steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);

            return (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-primary-50 border border-primary-200'
                    : isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : 'hover:bg-neutral-50 border border-transparent'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-primary-700'
                        : isCompleted
                          ? 'text-green-700'
                          : 'text-neutral-700'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isActive && (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{step.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={goToNext}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {currentStep === narrative.steps.length - 1 ? 'Complete' : 'Next'}
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{narrative.title}</h3>
          <p className="text-sm text-neutral-500">{narrative.subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-primary-600">
            Step {currentStep + 1} / {narrative.steps.length}
          </span>
          {/* Progress bar */}
          <div className="mt-1 w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {currentStepData && (
        <div className="bg-neutral-50 rounded-lg p-4 mb-4">
          <h4 className="text-base font-semibold text-neutral-900 mb-2">{currentStepData.title}</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">{currentStepData.description}</p>

          {/* Key actions */}
          {currentStepData.keyActions && currentStepData.keyActions.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentStepData.keyActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-neutral-600 bg-white px-3 py-2 rounded-lg"
                >
                  <Circle className="w-3 h-3 text-primary-500" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrev}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous Step
        </button>
        <div className="flex items-center gap-2">
          {narrative.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-primary-500'
                  : completedSteps.has(index)
                    ? 'bg-green-500'
                    : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          {currentStep === narrative.steps.length - 1 ? 'Complete Journey' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};

export default NarrativeGuide;
