/**
 * Sandbox Visit Tracking Component
 * 
 * Drop-in component for tracking sandbox visits and scenario completions
 */

import React, { useEffect } from 'react';

interface SandboxTrackerProps {
  sandboxId: string;
  onScenarioComplete?: (scenarioId: string) => void;
}

export function SandboxTracker({ sandboxId }: SandboxTrackerProps) {
  useEffect(() => {
    // Read UTM ref from URL (set per-contact when sending the link)
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || 'direct';
    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Log to your own endpoint
    fetch('/api/sandbox-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sandbox: sandboxId,
        ref,
        sessionId,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Fail silently — never break the demo for tracking
    });

    // Also fire Plausible event if you add Plausible to the page
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Sandbox Viewed', {
        props: { sandbox: sandboxId, ref },
      });
    }
  }, [sandboxId]);

  return null; // Invisible component
}

// ─── SCENARIO COMPLETION TRACKER ─────────────────────────────────────────────
// Call this when a scenario deliberation completes

export function trackScenarioComplete(sandboxId: string, scenarioId: string) {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || 'direct';

  fetch('/api/sandbox-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'scenario_complete',
      sandbox: sandboxId,
      scenario: scenarioId,
      ref,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});

  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Scenario Complete', {
      props: { sandbox: sandboxId, scenario: scenarioId },
    });
  }
}

// ─── UTM LINK GENERATOR ───────────────────────────────────────────────────────
// Run this to generate your per-contact tracking links

export const TR_TRACKING_LINKS = {
  davidWong:       'https://app.datacendia.com/sandbox/thomson-reuters?ref=dwong-tr',
  raghuRamanathan: 'https://app.datacendia.com/sandbox/thomson-reuters?ref=rramanathan-tr',
  rawiaAshraf:     'https://app.datacendia.com/sandbox/thomson-reuters?ref=rashraf-tr',
  linkedInBio:     'https://app.datacendia.com/sandbox/thomson-reuters?ref=li-bio',
  emailSignature:  'https://app.datacendia.com/sandbox/thomson-reuters?ref=email-sig',
  organic:         'https://app.datacendia.com/sandbox/thomson-reuters?ref=organic',
};
