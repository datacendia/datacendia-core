/**
 * React wrappers for @datacendia/widgets
 *
 * Uses @lit/react to create proper React components from the Lit Web Components.
 * These wrappers handle event binding, property passing, and ref forwarding.
 *
 * @example
 * ```tsx
 * import { DciiEvidenceViewer, CendiaPiiScanner, CouncilStatusBadge } from '@datacendia/widgets/react';
 *
 * function App() {
 *   return (
 *     <>
 *       <DciiEvidenceViewer apiUrl="https://app.datacendia.com/api/v1" packetId="pkt-123" />
 *       <CendiaPiiScanner apiUrl="https://app.datacendia.com/api/gateway" />
 *       <CouncilStatusBadge status="completed" confidence={0.82} agentCount={6} />
 *     </>
 *   );
 * }
 * ```
 *
 * @module @datacendia/widgets/react
 * @license Apache-2.0
 */

import { createComponent } from '@lit/react';
import React from 'react';

import { DciiEvidenceViewer as DciiEvidenceViewerElement } from './components/dcii-evidence-viewer.js';
import { CendiaPiiScanner as CendiaPiiScannerElement } from './components/cendia-pii-scanner.js';
import { CouncilStatusBadge as CouncilStatusBadgeElement } from './components/council-status-badge.js';

export const DciiEvidenceViewer = createComponent({
  tagName: 'dcii-evidence-viewer',
  elementClass: DciiEvidenceViewerElement,
  react: React,
  events: {
    onDciiVerified: 'dcii-verified' as EventName<CustomEvent>,
  },
});

export const CendiaPiiScanner = createComponent({
  tagName: 'cendia-pii-scanner',
  elementClass: CendiaPiiScannerElement,
  react: React,
  events: {
    onPiiScanComplete: 'pii-scan-complete' as EventName<CustomEvent>,
  },
});

export const CouncilStatusBadge = createComponent({
  tagName: 'council-status-badge',
  elementClass: CouncilStatusBadgeElement,
  react: React,
  events: {
    onCouncilStatusUpdate: 'council-status-update' as EventName<CustomEvent>,
  },
});

// Re-export types for convenience
export type { EvidencePacket, SignatureInfo, VerificationResult } from './components/dcii-evidence-viewer.js';
export type { PIIType, PIIDetection, PIIScanResult } from './components/cendia-pii-scanner.js';
export type { DeliberationStatus, DeliberationSummary } from './components/council-status-badge.js';

// Type helper for event names (required by @lit/react)
type EventName<T extends Event> = string & { __eventType: T };
