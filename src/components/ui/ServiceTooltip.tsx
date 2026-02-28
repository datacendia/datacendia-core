// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SERVICE TOOLTIP COMPONENT
// Enterprise Platinum: Rich, informative tooltips for all services
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import { Info, Lightbulb, Target, CheckCircle2, ChevronRight, X } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type ServiceCategory = 'pillars' | 'spaces' | 'sovereign';

interface TooltipData {
  title: string;
  summary: string;
  features: string[];
  useCases?: string[];
  guidance: string;
}

interface ServiceTooltipProps {
  service: string;
  category: ServiceCategory;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'hover' | 'click' | 'persistent';
  showIcon?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ServiceTooltip: React.FC<ServiceTooltipProps> = ({
  service,
  category,
  children,
  position = 'top',
  variant = 'hover',
  showIcon = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'useCases'>('overview');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Get tooltip data from translations
  const tooltipKey = `tooltips.${category}.${service}`;
  const tooltipData: TooltipData = {
    title: t(`${tooltipKey}.title`),
    summary: t(`${tooltipKey}.summary`),
    features: [],
    useCases: [],
    guidance: t(`${tooltipKey}.guidance`),
  };

  // Parse features array
  for (let i = 0; i < 10; i++) {
    const feature = t(`${tooltipKey}.features.${i}`);
    if (feature && !feature.includes('.features.')) {
      tooltipData.features.push(feature);
    }
  }

  // Parse use cases array
  for (let i = 0; i < 10; i++) {
    const useCase = t(`${tooltipKey}.useCases.${i}`);
    if (useCase && !useCase.includes('.useCases.')) {
      tooltipData.useCases?.push(useCase);
    }
  }

  // Handle click outside to close
  useEffect((): (() => void) | undefined => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && variant !== 'hover') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen, variant]);

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent',
  };

  const handleMouseEnter = () => {
    if (variant === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'hover') {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (variant === 'click') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-pointer"
      >
        {children}
        {showIcon && (
          <Info className="w-4 h-4 ml-1 text-neutral-400 hover:text-primary-500 transition-colors" />
        )}
      </div>

      {(isOpen || variant === 'persistent') && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[position]}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`} />

          {/* Tooltip Content */}
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3">
              <div className="flex items-start justify-between">
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {tooltipData.title}
                </h3>
                {variant === 'click' && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-primary-100 text-xs mt-1 leading-relaxed">{tooltipData.summary}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'features'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Features
              </button>
              {tooltipData.useCases && tooltipData.useCases.length > 0 && (
                <button
                  onClick={() => setActiveTab('useCases')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === 'useCases'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Use Cases
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-700 mb-1">Getting Started</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {tooltipData.guidance}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="space-y-2">
                  {tooltipData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'useCases' && tooltipData.useCases && (
                <ul className="space-y-2">
                  {tooltipData.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
              <button className="w-full flex items-center justify-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Learn More <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SIMPLE TOOLTIP VARIANT
// =============================================================================

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {children}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default ServiceTooltip;
