// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// REUSABLE MODE SELECTOR COMPONENT
// Provides consistent mode selection UI across all service pages
// =============================================================================

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Check, Info } from 'lucide-react';

export interface ModeOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  shortDesc: string;
  description: string;
  isCore?: boolean;
}

export interface IndustryOption {
  id: string;
  name: string;
}

interface ModeSelectorProps {
  label: string;
  modes: Record<string, ModeOption>;
  selectedModeId: string;
  onModeChange: (modeId: string) => void;
  coreModeIds?: string[];
  showAllModes?: boolean;
  className?: string;
}

interface IndustrySelectorProps {
  label: string;
  industries: Record<string, IndustryOption>;
  selectedIndustryId: string;
  onIndustryChange: (industryId: string) => void;
  className?: string;
}

interface FieldTooltipProps {
  content: string;
}

// Tooltip component for mode-aware field help
export const FieldTooltip: React.FC<FieldTooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-500 hover:text-gray-300 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl text-sm text-gray-200">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

// Mode info banner component
export const ModeInfoBanner: React.FC<{ mode: ModeOption; primeDirective?: string }> = ({ 
  mode, 
  primeDirective 
}) => {
  return (
    <div 
      className="p-3 rounded-lg border mb-4"
      style={{ 
        backgroundColor: `${mode.color}15`,
        borderColor: `${mode.color}40`
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{mode.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ color: mode.color }}>{mode.name}</span>
            {primeDirective && (
              <span className="text-xs text-gray-400">— "{primeDirective}"</span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{mode.description}</p>
        </div>
      </div>
    </div>
  );
};

// Main mode selector component
export const ModeSelector: React.FC<ModeSelectorProps> = ({
  label,
  modes,
  selectedModeId,
  onModeChange,
  coreModeIds = [],
  showAllModes = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(showAllModes);
  
  const selectedMode = modes[selectedModeId];
  const modeList = Object.values(modes);
  const coreModes = modeList.filter(m => coreModeIds.includes(m.id) || m.isCore);
  const additionalModes = modeList.filter(m => !coreModeIds.includes(m.id) && !m.isCore);
  
  const displayModes = showAll ? modeList : coreModes;

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{selectedMode?.emoji}</span>
          <span className="text-white">{selectedMode?.name}</span>
          <span className="text-xs text-gray-500">— {selectedMode?.shortDesc}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {displayModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                onModeChange(mode.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors ${
                mode.id === selectedModeId ? 'bg-gray-700' : ''
              }`}
            >
              <span>{mode.emoji}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white">{mode.name}</span>
                  {mode.isCore && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">Core</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{mode.shortDesc}</span>
              </div>
              {mode.id === selectedModeId && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </button>
          ))}
          
          {!showAll && additionalModes.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full px-3 py-2 text-sm text-purple-400 hover:bg-gray-700 transition-colors border-t border-gray-700"
            >
              Show {additionalModes.length} more modes...
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Industry selector component
export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  label,
  industries,
  selectedIndustryId,
  onIndustryChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedIndustry = industries[selectedIndustryId];
  const industryList = Object.values(industries);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
        {label}
        <FieldTooltip content="Select your industry to apply relevant benchmarks and probability adjustments." />
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
      >
        <span className="text-white">{selectedIndustry?.name || 'Select Industry'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {industryList.map((industry) => (
            <button
              key={industry.id}
              type="button"
              onClick={() => {
                onIndustryChange(industry.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 transition-colors ${
                industry.id === selectedIndustryId ? 'bg-gray-700' : ''
              }`}
            >
              <span className="text-white">{industry.name}</span>
              {industry.id === selectedIndustryId && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Industry insight component
export const IndustryInsight: React.FC<{ insight: string }> = ({ insight }) => {
  if (!insight) {return null;}
  
  return (
    <div className="flex items-start gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
      <span className="text-blue-300">{insight}</span>
    </div>
  );
};

export default ModeSelector;
