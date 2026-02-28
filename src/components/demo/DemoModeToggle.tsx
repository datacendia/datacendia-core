// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO MODE TOGGLE COMPONENT
 * =============================================================================
 * UI component for toggling demo mode and selecting scenarios.
 * Appears in the header/toolbar area.
 */

import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Monitor, X, ChevronDown, Eye, EyeOff, FileText } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import { WALKTHROUGHS, GuidedWalkthrough, WalkthroughConfig } from './GuidedWalkthrough';

// =============================================================================
// DEMO MODE TOGGLE BUTTON
// =============================================================================

interface DemoModeToggleProps {
  className?: string;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ className }) => {
  const {
    isActive,
    currentDemo,
    isPlaying,
    showScript,
    cleanMode,
    startDemo,
    stopDemo,
    nextStep,
    prevStep,
    play,
    pause,
    toggleScript,
    toggleCleanMode,
    getCurrentStep,
    getProgress,
    getDemos
  } = useDemoMode();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState<WalkthroughConfig | null>(null);

  const demos = getDemos();
  const currentStep = getCurrentStep();
  const progress = getProgress();

  const handleStartWalkthrough = (walkthroughId: string) => {
    const walkthrough = WALKTHROUGHS[walkthroughId];
    if (walkthrough) {
      setSelectedWalkthrough(walkthrough);
      setShowWalkthrough(true);
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative ${className}`} data-tour="demo-toggle">
      {/* Main Toggle Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all
          ${isActive 
            ? 'bg-indigo-600 text-white' 
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }
        `}
      >
        <Monitor className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isActive ? 'Demo Active' : 'Demo Mode'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Demo Mode</h3>
            <p className="text-sm text-slate-400 mt-1">
              Pre-loaded scenarios for presentations
            </p>
          </div>

          {/* Demo Scenarios */}
          <div className="p-2" data-tour="demo-scenarios">
            <div className="text-xs font-medium text-slate-500 uppercase px-2 py-1">
              Video Demos
            </div>
            {demos.map(demo => (
              <button
                key={demo.id}
                onClick={() => {
                  startDemo(demo.id);
                  setShowDropdown(false);
                }}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors
                  ${currentDemo?.id === demo.id 
                    ? 'bg-indigo-600/20 border border-indigo-500/50' 
                    : 'hover:bg-slate-700'
                  }
                `}
              >
                <span className="text-2xl">{demo.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{demo.name}</div>
                  <div className="text-xs text-slate-400 truncate">{demo.description}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {demo.duration} • {demo.audience}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Guided Walkthroughs */}
          <div className="p-2 border-t border-slate-700">
            <div className="text-xs font-medium text-slate-500 uppercase px-2 py-1">
              Interactive Tours
            </div>
            {Object.values(WALKTHROUGHS).slice(0, 4).map(walkthrough => (
              <button
                key={walkthrough.id}
                onClick={() => handleStartWalkthrough(walkthrough.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-slate-700 transition-colors"
              >
                <Play className="w-5 h-5 text-green-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{walkthrough.name}</div>
                  <div className="text-xs text-slate-400">{walkthrough.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Stop Demo Button */}
          {isActive && (
            <div className="p-2 border-t border-slate-700">
              <button
                onClick={() => {
                  stopDemo();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Exit Demo Mode</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Demo Controls */}
      {isActive && currentDemo && (
        <div 
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-4 z-50"
          data-tour="demo-controls"
        >
          {/* Progress Bar */}
          <div className="w-96 mb-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{currentDemo.name}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          {currentStep && (
            <div className="mb-3">
              <div className="text-sm font-medium text-white">{currentStep.title}</div>
              <div className="text-xs text-slate-400">{currentStep.description}</div>
            </div>
          )}

          {/* Script (if visible) */}
          {showScript && currentStep && (
            <div 
              className="mb-3 p-3 bg-slate-800 rounded-lg border border-slate-700 max-w-md"
              data-tour="demo-script"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <FileText className="w-3 h-3" />
                <span>Script</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentStep.script}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={prevStep}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={isPlaying ? pause : play}
              className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={nextStep}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2" />

            <button
              onClick={toggleScript}
              className={`p-2 rounded-lg transition-colors ${
                showScript 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={showScript ? 'Hide Script' : 'Show Script'}
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              onClick={toggleCleanMode}
              className={`p-2 rounded-lg transition-colors ${
                cleanMode 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={cleanMode ? 'Show UI Chrome' : 'Clean Mode'}
            >
              {cleanMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2" />

            <button
              onClick={stopDemo}
              className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              title="Exit Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Guided Walkthrough */}
      {showWalkthrough && selectedWalkthrough && (
        <GuidedWalkthrough
          walkthrough={selectedWalkthrough}
          onComplete={() => {
            setShowWalkthrough(false);
            setSelectedWalkthrough(null);
          }}
          onSkip={() => {
            setShowWalkthrough(false);
            setSelectedWalkthrough(null);
          }}
        />
      )}
    </div>
  );
};

// =============================================================================
// DEMO INDICATOR BADGE
// =============================================================================

export const DemoIndicatorBadge: React.FC = () => {
  const { isActive, currentDemo } = useDemoMode();

  if (!isActive) {return null;}

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-sm font-medium">
          Demo Mode: {currentDemo?.name || 'Active'}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default DemoModeToggle;
