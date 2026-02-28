// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Module Exports
 * Five Rings of Sovereignty - Complete Compliance Framework System
 * Updated: December 2024 - Integrated with 32 compliance-mode workflows
 */

export * from './frameworks.js';
export * from './ComplianceService.js';
export * from './ComplianceEnforcer.js';

// Compliance workflow scenarios from the 312 enterprise workflows
// See: backend/src/data/WORKFLOW-REFERENCE.md
export const COMPLIANCE_WORKFLOWS = {
  total: 32,
  critical: [
    'WF-106', // Regulatory Audit Preparation
    'WF-248', // Compliance Audit Preparation
    'WF-293', // Hardware-Attested Decision Signing
  ],
  high: [
    'WF-015', // Regulatory Compliance Gap Assessment
    'WF-027', // Deterministic Decision Replay Audit
    'WF-054', // Cross-Border Data Transfer Compliance
    'WF-076', // Regulatory Change Impact Assessment
    'WF-088', // Product Accessibility Compliance
    'WF-092', // Cybersecurity Insurance Renewal
    'WF-116', // Data Privacy Impact Assessment
    'WF-148', // Deterministic Decision Replay
    'WF-223', // Data Privacy Compliance
    'WF-275', // Cross-Border Shipment Compliance
    'WF-281', // Regulatory Change Cascade Impact
    'WF-296', // Deterministic Decision Replay
    'WF-297', // Forensic Decision Investigation
  ],
  councilMode: 'compliance',
};
