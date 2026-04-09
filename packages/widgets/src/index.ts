/**
 * @datacendia/widgets — Framework-Agnostic Web Components
 *
 * Three embeddable components for integrating Datacendia into any frontend:
 *
 * - <dcii-evidence-viewer>  — Decision packet with cryptographic verification
 * - <cendia-pii-scanner>    — Real-time PII detection and redaction
 * - <council-status-badge>  — Deliberation status, confidence, agent count
 *
 * Works in Angular, Vue, React, Svelte, or plain HTML.
 *
 * @license Apache-2.0
 */

export { DciiEvidenceViewer } from './components/dcii-evidence-viewer.js';
export { CendiaPiiScanner } from './components/cendia-pii-scanner.js';
export { CouncilStatusBadge } from './components/council-status-badge.js';

// Re-export types
export type {
  EvidencePacket,
  SignatureInfo,
  AgentContribution,
  VerificationResult,
} from './components/dcii-evidence-viewer.js';

export type {
  PIIType,
  PIIDetection,
  PIIScanResult,
} from './components/cendia-pii-scanner.js';

export type {
  DeliberationStatus,
  DeliberationSummary,
} from './components/council-status-badge.js';
