// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Insurance Compliance Frameworks - Expanded
 * 
 * Additional compliance frameworks beyond the core NAIC, state insurance regulations.
 * Covers specialty lines, reinsurance, and international frameworks.
 */

import { ComplianceFramework, ComplianceControl } from '../core/VerticalPattern.js';

export const EXPANDED_INSURANCE_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'naic-model-governance',
    name: 'NAIC AI Model Governance',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'naic-ai-transparency', name: 'AI Transparency', description: 'Disclosure of AI use in underwriting and claims', severity: 'critical', automatable: true },
      { id: 'naic-ai-fairness', name: 'AI Fairness Testing', description: 'Regular bias testing of AI models', severity: 'critical', automatable: true },
      { id: 'naic-ai-oversight', name: 'AI Human Oversight', description: 'Human review of AI-driven decisions', severity: 'high', automatable: false },
      { id: 'naic-ai-accountability', name: 'AI Accountability', description: 'Clear accountability chain for AI decisions', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'solvency-ii',
    name: 'Solvency II',
    version: '2016',
    jurisdiction: 'EU',
    controls: [
      { id: 'solv2-scr', name: 'Solvency Capital Requirement', description: 'Risk-based capital calculation', severity: 'critical', automatable: true },
      { id: 'solv2-mcr', name: 'Minimum Capital Requirement', description: 'Minimum capital threshold', severity: 'critical', automatable: true },
      { id: 'solv2-orsa', name: 'Own Risk and Solvency Assessment', description: 'Internal risk assessment process', severity: 'high', automatable: false },
      { id: 'solv2-governance', name: 'System of Governance', description: 'Fit and proper requirements', severity: 'high', automatable: false }
    ]
  },
  {
    id: 'ifrs-17',
    name: 'IFRS 17 Insurance Contracts',
    version: '2023',
    jurisdiction: 'International',
    controls: [
      { id: 'ifrs17-measurement', name: 'Contract Measurement', description: 'Building block approach for measurement', severity: 'critical', automatable: true },
      { id: 'ifrs17-csm', name: 'Contractual Service Margin', description: 'CSM calculation and amortization', severity: 'high', automatable: true },
      { id: 'ifrs17-disclosure', name: 'Disclosure Requirements', description: 'Financial statement disclosures', severity: 'high', automatable: true },
      { id: 'ifrs17-transition', name: 'Transition Requirements', description: 'Modified retrospective or fair value approach', severity: 'medium', automatable: true }
    ]
  },
  {
    id: 'state-unfair-trade',
    name: 'Unfair Trade Practices Act (Model)',
    version: '2024',
    jurisdiction: 'US-State',
    controls: [
      { id: 'utpa-misrepresentation', name: 'Anti-Misrepresentation', description: 'Prohibit misleading statements', severity: 'critical', automatable: true },
      { id: 'utpa-discrimination', name: 'Unfair Discrimination', description: 'Prohibit unfair discrimination in rating', severity: 'critical', automatable: true },
      { id: 'utpa-claims-practices', name: 'Claims Settlement Practices', description: 'Fair claims handling requirements', severity: 'critical', automatable: true },
      { id: 'utpa-rebating', name: 'Anti-Rebating', description: 'Prohibit improper inducements', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'state-rate-filing',
    name: 'Rate Filing & Approval',
    version: '2024',
    jurisdiction: 'US-State',
    controls: [
      { id: 'rate-adequacy', name: 'Rate Adequacy', description: 'Rates must be adequate but not excessive', severity: 'critical', automatable: true },
      { id: 'rate-discrimination', name: 'Rate Non-Discrimination', description: 'No unfairly discriminatory rates', severity: 'critical', automatable: true },
      { id: 'rate-actuarial', name: 'Actuarial Justification', description: 'Sound actuarial basis required', severity: 'high', automatable: false },
      { id: 'rate-filing-compliance', name: 'Filing Compliance', description: 'Proper rate filing procedures', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'naic-market-conduct',
    name: 'NAIC Market Conduct Examination',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'mc-underwriting-review', name: 'Underwriting Review', description: 'Review of underwriting practices', severity: 'high', automatable: true },
      { id: 'mc-claims-review', name: 'Claims Review', description: 'Review of claims handling practices', severity: 'high', automatable: true },
      { id: 'mc-complaint-handling', name: 'Complaint Handling', description: 'Consumer complaint resolution', severity: 'high', automatable: true },
      { id: 'mc-producer-licensing', name: 'Producer Licensing', description: 'Agent and broker compliance', severity: 'medium', automatable: true }
    ]
  },
  {
    id: 'reinsurance-regulation',
    name: 'Reinsurance Regulation',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'reins-collateral', name: 'Collateral Requirements', description: 'Reinsurance collateral and credit', severity: 'high', automatable: true },
      { id: 'reins-certified', name: 'Certified Reinsurer', description: 'Certified reinsurer requirements', severity: 'high', automatable: true },
      { id: 'reins-credit', name: 'Reinsurance Credit', description: 'Credit for reinsurance ceded', severity: 'critical', automatable: true },
      { id: 'reins-treaty-compliance', name: 'Treaty Compliance', description: 'Treaty terms and conditions', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'cyber-insurance-regulation',
    name: 'Cyber Insurance Requirements',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'cyber-data-security', name: 'Insurer Data Security', description: 'NAIC Insurance Data Security Model Law', severity: 'critical', automatable: true },
      { id: 'cyber-incident-response', name: 'Incident Response Plan', description: 'Cybersecurity incident response', severity: 'critical', automatable: false },
      { id: 'cyber-third-party', name: 'Third-Party Risk', description: 'Vendor cybersecurity requirements', severity: 'high', automatable: true },
      { id: 'cyber-notification', name: 'Breach Notification', description: 'Data breach notification requirements', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'gdpr-insurance',
    name: 'GDPR Insurance Applications',
    version: '2018',
    jurisdiction: 'EU',
    controls: [
      { id: 'gdpr-ins-profiling', name: 'Automated Profiling Rights', description: 'Right to not be subject to automated decisions', severity: 'critical', automatable: true },
      { id: 'gdpr-ins-consent', name: 'Policyholder Consent', description: 'Consent for data processing in insurance', severity: 'critical', automatable: true },
      { id: 'gdpr-ins-portability', name: 'Data Portability', description: 'Policyholder data portability rights', severity: 'high', automatable: true },
      { id: 'gdpr-ins-dpia', name: 'DPIA for Insurance AI', description: 'Impact assessment for automated underwriting', severity: 'high', automatable: false }
    ]
  },
  {
    id: 'acord-standards',
    name: 'ACORD Data Standards',
    version: '2024',
    jurisdiction: 'International',
    controls: [
      { id: 'acord-data-model', name: 'ACORD Data Model', description: 'Standard data model compliance', severity: 'medium', automatable: true },
      { id: 'acord-forms', name: 'ACORD Forms', description: 'Standard forms usage', severity: 'medium', automatable: true },
      { id: 'acord-messaging', name: 'ACORD Messaging', description: 'Standard messaging protocols', severity: 'medium', automatable: true }
    ]
  }
];

export const EXPANDED_INSURANCE_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  underwriting: {
    'naic-model-governance': ['naic-ai-transparency', 'naic-ai-fairness', 'naic-ai-oversight', 'naic-ai-accountability'],
    'solvency-ii': ['solv2-scr', 'solv2-orsa'],
    'state-unfair-trade': ['utpa-discrimination', 'utpa-misrepresentation'],
    'state-rate-filing': ['rate-adequacy', 'rate-discrimination', 'rate-actuarial'],
    'gdpr-insurance': ['gdpr-ins-profiling', 'gdpr-ins-consent', 'gdpr-ins-dpia']
  },
  claim: {
    'naic-model-governance': ['naic-ai-transparency', 'naic-ai-oversight'],
    'state-unfair-trade': ['utpa-claims-practices', 'utpa-discrimination'],
    'naic-market-conduct': ['mc-claims-review', 'mc-complaint-handling'],
    'gdpr-insurance': ['gdpr-ins-profiling', 'gdpr-ins-consent']
  },
  fraud: {
    'naic-model-governance': ['naic-ai-transparency', 'naic-ai-fairness'],
    'cyber-insurance-regulation': ['cyber-data-security', 'cyber-incident-response'],
    'naic-market-conduct': ['mc-claims-review'],
    'gdpr-insurance': ['gdpr-ins-profiling']
  },
  reinsurance: {
    'reinsurance-regulation': ['reins-collateral', 'reins-certified', 'reins-credit', 'reins-treaty-compliance'],
    'ifrs-17': ['ifrs17-measurement', 'ifrs17-csm', 'ifrs17-disclosure'],
    'solvency-ii': ['solv2-scr', 'solv2-mcr']
  },
  'rate-review': {
    'state-rate-filing': ['rate-adequacy', 'rate-discrimination', 'rate-actuarial', 'rate-filing-compliance'],
    'naic-model-governance': ['naic-ai-transparency', 'naic-ai-fairness'],
    'state-unfair-trade': ['utpa-discrimination']
  },
  'policy-issuance': {
    'state-unfair-trade': ['utpa-misrepresentation', 'utpa-discrimination', 'utpa-rebating'],
    'acord-standards': ['acord-data-model', 'acord-forms'],
    'gdpr-insurance': ['gdpr-ins-consent', 'gdpr-ins-portability']
  },
  'reserve-estimation': {
    'ifrs-17': ['ifrs17-measurement', 'ifrs17-csm'],
    'solvency-ii': ['solv2-scr', 'solv2-mcr', 'solv2-orsa'],
    'state-rate-filing': ['rate-actuarial']
  },
  'catastrophe-modeling': {
    'solvency-ii': ['solv2-scr', 'solv2-orsa'],
    'reinsurance-regulation': ['reins-collateral', 'reins-credit'],
    'naic-model-governance': ['naic-ai-transparency', 'naic-ai-oversight']
  }
};

export const EXPANDED_INSURANCE_JURISDICTION_MAP: Record<string, string[]> = {
  'US-Federal': ['naic-model-governance', 'reinsurance-regulation', 'naic-market-conduct', 'cyber-insurance-regulation', 'acord-standards'],
  'US-State': ['state-unfair-trade', 'state-rate-filing'],
  'EU': ['solvency-ii', 'gdpr-insurance'],
  'International': ['ifrs-17', 'acord-standards']
};
