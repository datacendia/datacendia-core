// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// REDACTED TEXT COMPONENT
// Proper document redaction effect for Regulator's Receipts.
// Toggle between redacted (black bars) and revealed text.
// =============================================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// CONTEXT
// =============================================================================

interface RedactionContextType {
  isRedacted: boolean;
  toggleRedaction: () => void;
  setRedacted: (value: boolean) => void;
}

const RedactionContext = createContext<RedactionContextType>({
  isRedacted: false,
  toggleRedaction: () => {},
  setRedacted: () => {},
});

export const useRedaction = () => useContext(RedactionContext);

export const RedactionProvider: React.FC<{ children: React.ReactNode; defaultRedacted?: boolean }> = ({
  children,
  defaultRedacted = false,
}) => {
  const [isRedacted, setRedacted] = useState(defaultRedacted);
  const toggleRedaction = useCallback(() => setRedacted(prev => !prev), []);

  return (
    <RedactionContext.Provider value={{ isRedacted, toggleRedaction, setRedacted }}>
      {children}
    </RedactionContext.Provider>
  );
};

// =============================================================================
// REDACTED TEXT COMPONENT
// =============================================================================

interface RedactedTextProps {
  children: React.ReactNode;
  /** Classification level shown on hover when redacted */
  classification?: 'CONFIDENTIAL' | 'RESTRICTED' | 'SENSITIVE' | 'REDACTED';
  /** Inline or block display */
  inline?: boolean;
  /** Additional className */
  className?: string;
}

export const RedactedText: React.FC<RedactedTextProps> = ({
  children,
  classification = 'REDACTED',
  inline = true,
  className,
}) => {
  const { isRedacted } = useRedaction();

  if (!isRedacted) {
    return inline ? <span className={className}>{children}</span> : <div className={className}>{children}</div>;
  }

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      className={cn(
        'redacted-bar relative select-none cursor-not-allowed',
        inline ? 'inline' : 'block',
        className,
      )}
      title={`[${classification}]`}
      aria-label={`Content redacted: ${classification}`}
    >
      {/* Hidden original text for layout sizing */}
      <span className="invisible" aria-hidden="true">{children}</span>
      {/* Black redaction overlay */}
      <span
        className={cn(
          'absolute inset-0 bg-black rounded-[2px]',
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/[0.03] after:to-transparent',
        )}
      />
    </Tag>
  );
};

// =============================================================================
// REDACTED CODE (for hashes, keys, etc.)
// =============================================================================

interface RedactedCodeProps {
  children: React.ReactNode;
  classification?: 'CONFIDENTIAL' | 'RESTRICTED' | 'SENSITIVE' | 'REDACTED';
  className?: string;
}

export const RedactedCode: React.FC<RedactedCodeProps> = ({
  children,
  classification = 'RESTRICTED',
  className,
}) => {
  const { isRedacted } = useRedaction();

  if (!isRedacted) {
    return <code className={className}>{children}</code>;
  }

  return (
    <code
      className={cn('redacted-bar relative select-none cursor-not-allowed inline-block w-full', className)}
      title={`[${classification}]`}
    >
      <span className="invisible" aria-hidden="true">{children}</span>
      <span className="absolute inset-0 bg-black rounded-[2px]" />
    </code>
  );
};

// =============================================================================
// REDACTION TOGGLE BUTTON
// =============================================================================

interface RedactionToggleProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export const RedactionToggle: React.FC<RedactionToggleProps> = ({ className, variant = 'dark' }) => {
  const { isRedacted, toggleRedaction } = useRedaction();

  const darkStyles = isRedacted
    ? 'bg-red-900/40 border-red-500/50 text-red-300 hover:bg-red-900/60'
    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20';

  const lightStyles = isRedacted
    ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:border-red-500/50 dark:text-red-300 dark:hover:bg-red-900/60'
    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/20';

  return (
    <button
      onClick={toggleRedaction}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
        variant === 'dark' ? darkStyles : lightStyles,
        className,
      )}
      title={isRedacted ? 'Click to reveal redacted content' : 'Click to apply redaction'}
    >
      {isRedacted ? (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          REDACTED
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Redact
        </>
      )}
    </button>
  );
};

export default RedactedText;
