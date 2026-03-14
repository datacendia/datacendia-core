/**
 * Component — Service Info Dropdown
 *
 * Reusable collapsible section showing what a service is, what it does,
 * and step-by-step instructions on how to use it.
 *
 * @exports ServiceInfoDropdown
 * @module components/ui/ServiceInfoDropdown
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState } from 'react';
import { ChevronDown, Info, Zap, BookOpen } from 'lucide-react';

export interface ServiceInfoConfig {
  /** What the service is — a concise definition */
  whatItIs: string;
  /** What the service does — list of capabilities */
  whatItDoes: string[];
  /** Step-by-step instructions on how to use the service */
  howToUse: { step: string; detail: string }[];
}

interface ServiceInfoDropdownProps {
  config: ServiceInfoConfig;
  className?: string;
}

export const ServiceInfoDropdown: React.FC<ServiceInfoDropdownProps> = ({ config, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors group"
      >
        <Info className="w-3.5 h-3.5" />
        <span>About this service</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] dark:bg-gray-800/50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* What it is */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">What it is</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{config.whatItIs}</p>
          </div>

          {/* What it does */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">What it does</h4>
            </div>
            <ul className="space-y-1.5">
              {config.whatItDoes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-emerald-500 mt-1 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to use */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">How to use</h4>
            </div>
            <ol className="space-y-3">
              {config.howToUse.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{step.step}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceInfoDropdown;
