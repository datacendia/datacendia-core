// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO OVERLAY COMPONENT
 * =============================================================================
 * Professional overlay for recording demos with:
 * - Script teleprompter
 * - Step navigation
 * - Progress indicator
 * - Recording controls
 */

import React, { useEffect } from 'react';
import { router } from '../../routes.lazy';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Eye, 
  EyeOff,
  FileText,
  Monitor,
  ChevronRight,
  Clock,
  Users
} from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import { cn } from '../../lib/utils';

export const DemoOverlay: React.FC = () => {
  const {
    isActive,
    currentDemo,
    currentStepIndex,
    isPlaying,
    showScript,
    showOverlay,
    cleanMode,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    play,
    pause,
    toggleScript,
    toggleOverlay,
    toggleCleanMode,
    getCurrentStep,
    getProgress,
  } = useDemoMode();

  // Auto-navigate when step changes
  useEffect(() => {
    if (!isActive || !currentDemo) {return;}
    const step = currentDemo.steps[currentStepIndex];
    if (step?.route) {
      router.navigate(step.route);
    }
  }, [isActive, currentDemo, currentStepIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isActive) {return;}
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {return;}
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case ' ':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'Escape':
          e.preventDefault();
          stopDemo();
          break;
        case 's':
          e.preventDefault();
          toggleScript();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isPlaying, nextStep, prevStep, play, pause, stopDemo, toggleScript]);

  if (!isActive || !currentDemo || !showOverlay) {return null;}

  const currentStep = getCurrentStep();
  const progress = getProgress();

  return (
    <>
      {/* Top Bar - Demo Info */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-b from-black/90 to-transparent p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Demo Title */}
          <div className="flex items-center gap-4">
            <span className="text-3xl">{currentDemo.thumbnail}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{currentDemo.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentDemo.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentDemo.audience}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleScript}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showScript ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400 hover:text-white'
              )}
              title="Toggle Script"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCleanMode}
              className={cn(
                'p-2 rounded-lg transition-colors',
                cleanMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400 hover:text-white'
              )}
              title="Clean Mode"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={toggleOverlay}
              className="p-2 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Hide Overlay"
            >
              <EyeOff className="w-5 h-5" />
            </button>
            <button
              onClick={stopDemo}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Exit Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {currentStepIndex + 1} of {currentDemo.steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Script Teleprompter - Bottom */}
      {showScript && currentStep && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-t from-black/95 via-black/90 to-transparent p-6 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            {/* Current Step Info */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-1">{currentStep.title}</h2>
              <p className="text-gray-400">{currentStep.description}</p>
            </div>

            {/* Script Text */}
            <div className="bg-black/50 rounded-xl p-6 border border-cyan-500/30 mb-4">
              <p className="text-xl text-white leading-relaxed text-center font-medium">
                "{currentStep.script}"
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={isPlaying ? pause : play}
                className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              
              <button
                onClick={nextStep}
                disabled={currentStepIndex === currentDemo.steps.length - 1}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Step Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {currentDemo.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentStepIndex 
                      ? 'w-8 bg-cyan-500' 
                      : index < currentStepIndex 
                        ? 'bg-cyan-500/50' 
                        : 'bg-white/20 hover:bg-white/40'
                  )}
                  title={step.title}
                />
              ))}
            </div>

            {/* Duration & Wait Indicator */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentStep.duration}s
              </span>
              {currentStep.waitForClick && (
                <span className="flex items-center gap-1 text-amber-400">
                  <ChevronRight className="w-4 h-4" />
                  Click to continue
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Highlight Overlay */}
      {currentStep?.highlight && (
        <style>{`
          ${currentStep.highlight} {
            position: relative;
            z-index: 9998 !important;
            box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.5), 0 0 30px rgba(6, 182, 212, 0.3) !important;
            border-radius: 8px;
          }
          ${currentStep.highlight}::before {
            content: '';
            position: absolute;
            inset: -8px;
            border: 2px solid rgba(6, 182, 212, 0.8);
            border-radius: 12px;
            animation: pulse-border 2s infinite;
          }
          @keyframes pulse-border {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.02); }
          }
        `}</style>
      )}
    </>
  );
};

export default DemoOverlay;
