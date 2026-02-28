// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Government Vertical - Expanded Compliance Frameworks
 * 10 additional frameworks (15 total)
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

export const EXPANDED_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'nist-800-53',
    name: 'NIST 800-53 Security Controls',
    version: 'Rev 5',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'ac-access', name: 'Access Control', description: 'Least privilege and separation of duties', severity: 'critical', automatable: true },
      { id: 'au-audit', name: 'Audit and Accountability', description: 'Comprehensive audit logging', severity: 'critical', automatable: true },
      { id: 'cm-config', name: 'Configuration Management', description: 'Baseline configurations and change control', severity: 'high', automatable: true },
      { id: 'ia-identification', name: 'Identification and Authentication', description: 'Multi-factor authentication', severity: 'critical', automatable: true },
      { id: 'ir-incident', name: 'Incident Response', description: 'Incident handling and reporting', severity: 'high', automatable: true },
      { id: 'sc-system', name: 'System and Communications Protection', description: 'Encryption and boundary protection', severity: 'critical', automatable: true },
      { id: 'si-integrity', name: 'System and Information Integrity', description: 'Malware protection and monitoring', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'fedramp',
    name: 'FedRAMP Authorization',
    version: 'Rev 5',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'fedramp-ato', name: 'Authority to Operate', description: 'FedRAMP ATO from JAB or agency', severity: 'critical', automatable: false },
      { id: 'fedramp-conmon', name: 'Continuous Monitoring', description: 'Ongoing authorization', severity: 'critical', automatable: true },
      { id: 'fedramp-ir', name: 'Incident Response', description: 'US-CERT notification within 1 hour', severity: 'critical', automatable: true },
      { id: 'fedramp-supply', name: 'Supply Chain Risk', description: 'SCRM plan and vendor assessment', severity: 'high', automatable: true },
      { id: 'fedramp-crypto', name: 'Cryptographic Standards', description: 'FIPS 140-2 validated modules', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'omb-a123',
    name: 'OMB Circular A-123 Internal Controls',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'a123-control-env', name: 'Control Environment', description: 'Integrity and ethical values', severity: 'high', automatable: false },
      { id: 'a123-risk-assess', name: 'Risk Assessment', description: 'Identify and analyze risks', severity: 'high', automatable: true },
      { id: 'a123-control-activities', name: 'Control Activities', description: 'Policies and procedures', severity: 'high', automatable: true },
      { id: 'a123-info-comm', name: 'Information and Communication', description: 'Timely and accurate information', severity: 'medium', automatable: true },
      { id: 'a123-monitoring', name: 'Monitoring', description: 'Ongoing monitoring and evaluation', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'omb-a11',
    name: 'OMB Circular A-11 Budget Preparation',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'a11-justification', name: 'Budget Justification', description: 'Detailed budget justification materials', severity: 'high', automatable: false },
      { id: 'a11-performance', name: 'Performance Budget', description: 'Link budget to performance goals', severity: 'high', automatable: true },
      { id: 'a11-apportionment', name: 'Apportionment', description: 'OMB apportionment compliance', severity: 'critical', automatable: true },
      { id: 'a11-execution', name: 'Budget Execution', description: 'Track obligations and outlays', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'antideficiency',
    name: 'Antideficiency Act',
    version: '31 USC 1341',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'ada-obligation', name: 'Obligation Limits', description: 'Cannot obligate beyond appropriations', severity: 'critical', automatable: true },
      { id: 'ada-apportionment', name: 'Apportionment Compliance', description: 'Comply with OMB apportionments', severity: 'critical', automatable: true },
      { id: 'ada-reporting', name: 'Violation Reporting', description: 'Report violations to President and Congress', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'prompt-payment',
    name: 'Prompt Payment Act',
    version: '31 USC 3901',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'ppa-invoice', name: 'Invoice Processing', description: 'Pay within 30 days or accrue interest', severity: 'high', automatable: true },
      { id: 'ppa-interest', name: 'Interest Calculation', description: 'Calculate and pay interest on late payments', severity: 'high', automatable: true },
      { id: 'ppa-tracking', name: 'Payment Tracking', description: 'Track payment timeliness', severity: 'medium', automatable: true }
    ]
  },
  {
    id: 'foia',
    name: 'Freedom of Information Act',
    version: '5 USC 552',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'foia-response', name: 'Response Timeliness', description: '20 business day response requirement', severity: 'high', automatable: true },
      { id: 'foia-exemptions', name: 'Exemption Analysis', description: 'Properly apply FOIA exemptions', severity: 'high', automatable: false },
      { id: 'foia-redaction', name: 'Redaction', description: 'Redact exempt information', severity: 'high', automatable: false },
      { id: 'foia-tracking', name: 'Request Tracking', description: 'Track and report FOIA requests', severity: 'medium', automatable: true }
    ]
  },
  {
    id: 'privacy-act',
    name: 'Privacy Act of 1974',
    version: '5 USC 552a',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'pa-sorn', name: 'System of Records Notice', description: 'Publish SORN for systems of records', severity: 'critical', automatable: false },
      { id: 'pa-access', name: 'Individual Access', description: 'Provide access to own records', severity: 'high', automatable: true },
      { id: 'pa-accuracy', name: 'Accuracy and Timeliness', description: 'Maintain accurate records', severity: 'high', automatable: true },
      { id: 'pa-disclosure', name: 'Disclosure Restrictions', description: 'Limit disclosures without consent', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'cfo-act',
    name: 'Chief Financial Officers Act',
    version: '1990',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'cfo-audit', name: 'Annual Audit', description: 'Audited financial statements', severity: 'critical', automatable: false },
      { id: 'cfo-systems', name: 'Financial Systems', description: 'Integrated financial management systems', severity: 'high', automatable: true },
      { id: 'cfo-reporting', name: 'Financial Reporting', description: 'Timely and accurate financial reports', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'improper-payments',
    name: 'Payment Integrity Information Act',
    version: '2019',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'piia-risk-assess', name: 'Risk Assessment', description: 'Annual improper payment risk assessment', severity: 'high', automatable: true },
      { id: 'piia-sampling', name: 'Statistical Sampling', description: 'Sample payments for error rate', severity: 'high', automatable: true },
      { id: 'piia-reporting', name: 'Improper Payment Reporting', description: 'Report improper payment rates', severity: 'high', automatable: true },
      { id: 'piia-corrective', name: 'Corrective Actions', description: 'Implement corrective action plans', severity: 'high', automatable: true }
    ]
  }
];

export const EXPANDED_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'procurement': {
    'nist-800-53': ['ac-access', 'au-audit'],
    'fedramp': ['fedramp-supply'],
    'omb-a123': ['a123-control-activities', 'a123-monitoring'],
    'prompt-payment': ['ppa-invoice', 'ppa-tracking']
  },
  'policy': {
    'foia': ['foia-response', 'foia-exemptions', 'foia-tracking'],
    'privacy-act': ['pa-sorn', 'pa-disclosure'],
    'omb-a123': ['a123-control-env', 'a123-risk-assess']
  },
  'grant': {
    'omb-a123': ['a123-control-activities', 'a123-monitoring'],
    'cfo-act': ['cfo-audit', 'cfo-reporting'],
    'improper-payments': ['piia-risk-assess', 'piia-corrective']
  },
  'budget': {
    'omb-a11': ['a11-justification', 'a11-performance', 'a11-apportionment', 'a11-execution'],
    'antideficiency': ['ada-obligation', 'ada-apportionment'],
    'cfo-act': ['cfo-systems', 'cfo-reporting']
  },
  'personnel-action': {
    'nist-800-53': ['ac-access', 'ia-identification'],
    'privacy-act': ['pa-sorn', 'pa-access', 'pa-accuracy'],
    'omb-a123': ['a123-control-env']
  },
  'regulatory-action': {
    'apa': ['apa-notice', 'apa-record'],
    'foia': ['foia-response', 'foia-exemptions'],
    'omb-a123': ['a123-risk-assess', 'a123-info-comm']
  },
  'it-investment': {
    'nist-800-53': ['ac-access', 'au-audit', 'cm-config', 'ia-identification'],
    'fedramp': ['fedramp-ato', 'fedramp-conmon', 'fedramp-crypto'],
    'fisma': ['fisma-ato', 'fisma-ca']
  },
  'contract-modification': {
    'far': ['far-42'],
    'prompt-payment': ['ppa-invoice', 'ppa-interest'],
    'omb-a123': ['a123-control-activities']
  },
  'foia-request': {
    'foia': ['foia-response', 'foia-exemptions', 'foia-redaction', 'foia-tracking'],
    'privacy-act': ['pa-disclosure']
  },
  'ig-audit-response': {
    'omb-a123': ['a123-control-activities', 'a123-monitoring'],
    'cfo-act': ['cfo-audit', 'cfo-systems'],
    'improper-payments': ['piia-corrective']
  },
  'emergency-declaration': {
    'nist-800-53': ['ir-incident'],
    'fedramp': ['fedramp-ir'],
    'omb-a123': ['a123-risk-assess', 'a123-info-comm']
  },
  'interagency-agreement': {
    'omb-a123': ['a123-control-activities', 'a123-info-comm'],
    'antideficiency': ['ada-obligation'],
    'cfo-act': ['cfo-reporting']
  }
};

export const EXPANDED_JURISDICTION_MAP: Record<string, string> = {
  'nist-800-53': 'US Federal',
  'fedramp': 'US Federal',
  'omb-a123': 'US Federal',
  'omb-a11': 'US Federal',
  'antideficiency': 'US Federal',
  'prompt-payment': 'US Federal',
  'foia': 'US Federal',
  'privacy-act': 'US Federal',
  'cfo-act': 'US Federal',
  'improper-payments': 'US Federal'
};
