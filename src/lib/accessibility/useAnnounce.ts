// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - SCREEN READER ANNOUNCEMENT HOOK
// =============================================================================

import { useCallback, useRef } from 'react';
import { announceToScreenReader } from './WCAGService';

/**
 * Hook for making announcements to screen readers
 */
export function useAnnounce() {
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const message = queueRef.current.shift()!;

    announceToScreenReader(message, 'polite');

    setTimeout(() => {
      isProcessingRef.current = false;
      processQueue();
    }, 500);
  }, []);

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (priority === 'assertive') {
        // Assertive messages bypass the queue
        announceToScreenReader(message, 'assertive');
      } else {
        queueRef.current.push(message);
        processQueue();
      }
    },
    [processQueue]
  );

  const announcePolite = useCallback(
    (message: string) => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceAssertive = useCallback(
    (message: string) => {
      announce(message, 'assertive');
    },
    [announce]
  );

  return {
    announce,
    announcePolite,
    announceAssertive,
  };
}
