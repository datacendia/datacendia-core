// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - LANGUAGE SWITCHER COMPONENT
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useLocale, SupportedLocale } from '../../lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'flags' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { locale, setLocale, availableLocales, localeConfig } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Compact variant - just flag and code
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-neutral-100 transition-colors"
          aria-label="Select language"
        >
          <span className="text-lg">{localeConfig.flag}</span>
          <span className="text-xs font-medium uppercase">{locale}</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
            {availableLocales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleSelect(loc.code)}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${
                  loc.code === locale ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'
                }`}
              >
                <span className="text-lg">{loc.flag}</span>
                <span className="text-sm">{loc.nativeName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Flags variant - horizontal row of flags
  if (variant === 'flags') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {availableLocales.map((loc) => (
          <button
            key={loc.code}
            onClick={() => handleSelect(loc.code)}
            className={`p-1.5 rounded-md transition-all ${
              loc.code === locale
                ? 'bg-primary-100 ring-2 ring-primary-500'
                : 'hover:bg-neutral-100'
            }`}
            title={loc.nativeName}
            aria-label={`Switch to ${loc.name}`}
          >
            <span className="text-xl">{loc.flag}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 rounded-lg hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-xl">{localeConfig.flag}</span>
        <span className="text-sm font-medium text-neutral-700">{localeConfig.nativeName}</span>
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {availableLocales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              role="option"
              aria-selected={loc.code === locale}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                loc.code === locale ? 'bg-primary-50' : ''
              }`}
            >
              <span className="text-xl">{loc.flag}</span>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${loc.code === locale ? 'text-primary-600' : 'text-neutral-900'}`}
                >
                  {loc.nativeName}
                </p>
                <p className="text-xs text-neutral-500">{loc.name}</p>
              </div>
              {loc.code === locale && (
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
