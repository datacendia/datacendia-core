// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Legal Vertical - Compliance Frameworks
 * 15 legal/regulatory frameworks
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

export const LEGAL_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'aba-model-rules',
    name: 'ABA Model Rules of Professional Conduct',
    version: '2023',
    jurisdiction: 'US (Model)',
    controls: [
      { id: 'rule-1.1', name: 'Competence', description: 'Provide competent representation', severity: 'critical', automatable: false },
      { id: 'rule-1.6', name: 'Confidentiality', description: 'Preserve client confidences', severity: 'critical', automatable: true },
      { id: 'rule-1.7', name: 'Conflict of Interest - Current Clients', description: 'Identify and manage conflicts', severity: 'critical', automatable: true },
      { id: 'rule-1.9', name: 'Conflict of Interest - Former Clients', description: 'Protect former client interests', severity: 'critical', automatable: true },
      { id: 'rule-1.16', name: 'Declining/Terminating Representation', description: 'Proper withdrawal procedures', severity: 'high', automatable: false },
      { id: 'rule-3.3', name: 'Candor to Tribunal', description: 'Truthfulness in statements to court', severity: 'critical', automatable: false },
      { id: 'rule-5.1', name: 'Supervisory Responsibilities', description: 'Supervise subordinate lawyers', severity: 'high', automatable: true },
      { id: 'rule-5.3', name: 'Non-Lawyer Assistants', description: 'Supervise non-lawyer staff', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'frcp',
    name: 'Federal Rules of Civil Procedure',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'rule-11', name: 'Signing Pleadings', description: 'Reasonable inquiry before filing', severity: 'critical', automatable: false },
      { id: 'rule-16', name: 'Pretrial Conferences', description: 'Case management obligations', severity: 'high', automatable: true },
      { id: 'rule-26', name: 'Duty to Disclose', description: 'Initial disclosures', severity: 'critical', automatable: true },
      { id: 'rule-26-b', name: 'Discovery Scope', description: 'Proportionality in discovery', severity: 'high', automatable: true },
      { id: 'rule-26-f', name: 'Conference of Parties', description: 'Meet and confer requirements', severity: 'high', automatable: false },
      { id: 'rule-34', name: 'Document Production', description: 'Produce documents in native format', severity: 'high', automatable: true },
      { id: 'rule-37', name: 'Sanctions', description: 'Failure to make disclosures or cooperate', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'fre',
    name: 'Federal Rules of Evidence',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'rule-401', name: 'Relevance', description: 'Evidence must be relevant', severity: 'high', automatable: false },
      { id: 'rule-403', name: 'Prejudice vs Probative', description: 'Balance prejudice against probative value', severity: 'high', automatable: false },
      { id: 'rule-501', name: 'Attorney-Client Privilege', description: 'Protect privileged communications', severity: 'critical', automatable: true },
      { id: 'rule-502', name: 'Waiver of Privilege', description: 'Inadvertent disclosure protections', severity: 'critical', automatable: true },
      { id: 'rule-702', name: 'Expert Testimony', description: 'Daubert standard for experts', severity: 'high', automatable: false },
      { id: 'rule-801', name: 'Hearsay', description: 'Hearsay exclusion and exceptions', severity: 'high', automatable: false },
      { id: 'rule-901', name: 'Authentication', description: 'Authenticate evidence', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'ny-rules',
    name: 'New York Rules of Professional Conduct',
    version: '2024',
    jurisdiction: 'New York',
    controls: [
      { id: 'ny-1.6', name: 'Confidentiality', description: 'NY confidentiality rules', severity: 'critical', automatable: true },
      { id: 'ny-1.7', name: 'Conflicts', description: 'NY conflict rules', severity: 'critical', automatable: true },
      { id: 'ny-1.10', name: 'Imputation', description: 'Firm-wide conflict imputation', severity: 'critical', automatable: true },
      { id: 'ny-5.4', name: 'Fee Sharing', description: 'Restrictions on fee sharing', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'ca-rules',
    name: 'California Rules of Professional Conduct',
    version: '2024',
    jurisdiction: 'California',
    controls: [
      { id: 'ca-1.6', name: 'Confidentiality', description: 'CA confidentiality rules', severity: 'critical', automatable: true },
      { id: 'ca-1.7', name: 'Conflicts', description: 'CA conflict rules', severity: 'critical', automatable: true },
      { id: 'ca-1.8.1', name: 'Business Transactions with Clients', description: 'Restrictions on business dealings', severity: 'critical', automatable: true },
      { id: 'ca-3.3', name: 'Candor to Tribunal', description: 'CA candor requirements', severity: 'critical', automatable: false }
    ]
  },
  {
    id: 'tx-rules',
    name: 'Texas Disciplinary Rules of Professional Conduct',
    version: '2024',
    jurisdiction: 'Texas',
    controls: [
      { id: 'tx-1.05', name: 'Confidentiality', description: 'TX confidentiality rules', severity: 'critical', automatable: true },
      { id: 'tx-1.06', name: 'Conflicts', description: 'TX conflict rules', severity: 'critical', automatable: true },
      { id: 'tx-1.14', name: 'Safekeeping Property', description: 'Client property and funds', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'sec-rules',
    name: 'SEC Securities Regulations',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'reg-fd', name: 'Regulation FD', description: 'Fair disclosure', severity: 'critical', automatable: true },
      { id: 'rule-10b-5', name: 'Rule 10b-5', description: 'Anti-fraud provisions', severity: 'critical', automatable: false },
      { id: 'sarbanes-302', name: 'SOX 302', description: 'CEO/CFO certification', severity: 'critical', automatable: true },
      { id: 'sarbanes-404', name: 'SOX 404', description: 'Internal controls assessment', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'gdpr',
    name: 'General Data Protection Regulation',
    version: '2018',
    jurisdiction: 'EU',
    controls: [
      { id: 'gdpr-art-6', name: 'Lawful Basis', description: 'Lawful basis for processing', severity: 'critical', automatable: true },
      { id: 'gdpr-art-17', name: 'Right to Erasure', description: 'Right to be forgotten', severity: 'high', automatable: true },
      { id: 'gdpr-art-25', name: 'Data Protection by Design', description: 'Privacy by design', severity: 'high', automatable: true },
      { id: 'gdpr-art-32', name: 'Security of Processing', description: 'Appropriate security measures', severity: 'critical', automatable: true },
      { id: 'gdpr-art-33', name: 'Breach Notification', description: '72-hour breach notification', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'ccpa',
    name: 'California Consumer Privacy Act',
    version: '2024',
    jurisdiction: 'California',
    controls: [
      { id: 'ccpa-notice', name: 'Privacy Notice', description: 'Notice at collection', severity: 'critical', automatable: true },
      { id: 'ccpa-access', name: 'Right to Know', description: 'Provide data upon request', severity: 'high', automatable: true },
      { id: 'ccpa-deletion', name: 'Right to Delete', description: 'Delete personal information', severity: 'high', automatable: true },
      { id: 'ccpa-opt-out', name: 'Opt-Out of Sale', description: 'Do not sell my personal information', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'fcpa',
    name: 'Foreign Corrupt Practices Act',
    version: '1977',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'fcpa-anti-bribery', name: 'Anti-Bribery', description: 'Prohibit bribes to foreign officials', severity: 'critical', automatable: true },
      { id: 'fcpa-accounting', name: 'Accounting Provisions', description: 'Accurate books and records', severity: 'critical', automatable: true },
      { id: 'fcpa-internal-controls', name: 'Internal Controls', description: 'Adequate internal controls', severity: 'high', automatable: true },
      { id: 'fcpa-due-diligence', name: 'Third-Party Due Diligence', description: 'Vet intermediaries and agents', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'antitrust',
    name: 'Sherman Act / Clayton Act',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'sherman-1', name: 'Section 1 - Restraint of Trade', description: 'Prohibit anticompetitive agreements', severity: 'critical', automatable: false },
      { id: 'sherman-2', name: 'Section 2 - Monopolization', description: 'Prohibit monopolization', severity: 'critical', automatable: false },
      { id: 'clayton-7', name: 'Mergers and Acquisitions', description: 'HSR filing requirements', severity: 'critical', automatable: true },
      { id: 'ftc-act-5', name: 'Unfair Methods of Competition', description: 'FTC Act Section 5', severity: 'high', automatable: false }
    ]
  },
  {
    id: 'ip-law',
    name: 'Intellectual Property Law',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'patent-35usc', name: 'Patent Law', description: '35 USC patent requirements', severity: 'high', automatable: false },
      { id: 'copyright-17usc', name: 'Copyright Law', description: '17 USC copyright protection', severity: 'high', automatable: false },
      { id: 'trademark-15usc', name: 'Trademark Law', description: 'Lanham Act trademark protection', severity: 'high', automatable: false },
      { id: 'trade-secret', name: 'Trade Secret Law', description: 'DTSA and state trade secret laws', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'employment-law',
    name: 'Employment and Labor Law',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'title-vii', name: 'Title VII', description: 'Prohibition on discrimination', severity: 'critical', automatable: true },
      { id: 'ada', name: 'Americans with Disabilities Act', description: 'Disability accommodation', severity: 'critical', automatable: true },
      { id: 'flsa', name: 'Fair Labor Standards Act', description: 'Wage and hour requirements', severity: 'critical', automatable: true },
      { id: 'fmla', name: 'Family and Medical Leave Act', description: 'Leave entitlements', severity: 'high', automatable: true },
      { id: 'nlra', name: 'National Labor Relations Act', description: 'Union and collective bargaining', severity: 'high', automatable: false }
    ]
  },
  {
    id: 'contract-law',
    name: 'Contract Law Principles',
    version: 'Restatement 2d',
    jurisdiction: 'US (Common Law)',
    controls: [
      { id: 'offer-acceptance', name: 'Offer and Acceptance', description: 'Valid contract formation', severity: 'critical', automatable: false },
      { id: 'consideration', name: 'Consideration', description: 'Bargained-for exchange', severity: 'critical', automatable: false },
      { id: 'statute-frauds', name: 'Statute of Frauds', description: 'Writing requirement for certain contracts', severity: 'critical', automatable: true },
      { id: 'parol-evidence', name: 'Parol Evidence Rule', description: 'Integration and merger clauses', severity: 'high', automatable: false },
      { id: 'ucc-article-2', name: 'UCC Article 2', description: 'Sale of goods', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'litigation-standards',
    name: 'Litigation Practice Standards',
    version: '2024',
    jurisdiction: 'US Federal',
    controls: [
      { id: 'spoliation', name: 'Spoliation', description: 'Preserve evidence and avoid destruction', severity: 'critical', automatable: true },
      { id: 'discovery-proportionality', name: 'Proportionality', description: 'Proportional discovery', severity: 'high', automatable: true },
      { id: 'privilege-log', name: 'Privilege Log', description: 'Maintain privilege log', severity: 'critical', automatable: true },
      { id: 'clawback', name: 'Clawback Agreements', description: 'FRE 502(d) orders', severity: 'high', automatable: true },
      { id: 'meet-confer', name: 'Meet and Confer', description: 'Good faith conferral', severity: 'high', automatable: false }
    ]
  }
];

export const LEGAL_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'contract-review': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6', 'rule-1.7'],
    'contract-law': ['offer-acceptance', 'consideration', 'statute-frauds', 'parol-evidence'],
    'ny-rules': ['ny-1.6', 'ny-1.7']
  },
  'litigation-strategy': {
    'aba-model-rules': ['rule-1.1', 'rule-3.3', 'rule-1.6'],
    'frcp': ['rule-11', 'rule-16', 'rule-26'],
    'fre': ['rule-401', 'rule-403', 'rule-501'],
    'litigation-standards': ['spoliation', 'discovery-proportionality', 'privilege-log']
  },
  'settlement-approval': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6'],
    'contract-law': ['offer-acceptance', 'consideration'],
    'frcp': ['rule-16']
  },
  'privilege-determination': {
    'aba-model-rules': ['rule-1.6'],
    'fre': ['rule-501', 'rule-502'],
    'litigation-standards': ['privilege-log', 'clawback']
  },
  'ediscovery-production': {
    'frcp': ['rule-26', 'rule-26-b', 'rule-34', 'rule-37'],
    'fre': ['rule-501', 'rule-502', 'rule-901'],
    'litigation-standards': ['spoliation', 'privilege-log', 'clawback']
  },
  'regulatory-response': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6', 'rule-3.3'],
    'sec-rules': ['reg-fd', 'rule-10b-5', 'sarbanes-302'],
    'fcpa': ['fcpa-anti-bribery', 'fcpa-accounting']
  },
  'ma-due-diligence': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6', 'rule-1.7'],
    'sec-rules': ['reg-fd', 'sarbanes-404'],
    'antitrust': ['clayton-7'],
    'contract-law': ['offer-acceptance', 'consideration']
  },
  'employment-dispute': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6'],
    'employment-law': ['title-vii', 'ada', 'flsa', 'fmla'],
    'frcp': ['rule-26', 'rule-34']
  },
  'ip-protection': {
    'aba-model-rules': ['rule-1.1', 'rule-1.6'],
    'ip-law': ['patent-35usc', 'copyright-17usc', 'trademark-15usc', 'trade-secret'],
    'frcp': ['rule-26']
  },
  'data-privacy-compliance': {
    'aba-model-rules': ['rule-1.6'],
    'gdpr': ['gdpr-art-6', 'gdpr-art-17', 'gdpr-art-32', 'gdpr-art-33'],
    'ccpa': ['ccpa-notice', 'ccpa-access', 'ccpa-deletion', 'ccpa-opt-out']
  },
  'conflict-check': {
    'aba-model-rules': ['rule-1.7', 'rule-1.9'],
    'ny-rules': ['ny-1.7', 'ny-1.10'],
    'ca-rules': ['ca-1.7']
  },
  'expert-engagement': {
    'aba-model-rules': ['rule-1.1', 'rule-5.3'],
    'fre': ['rule-702'],
    'frcp': ['rule-26']
  }
};

export const LEGAL_JURISDICTION_MAP: Record<string, string> = {
  'aba-model-rules': 'US (Model)',
  'frcp': 'US Federal',
  'fre': 'US Federal',
  'ny-rules': 'New York',
  'ca-rules': 'California',
  'tx-rules': 'Texas',
  'sec-rules': 'US Federal',
  'gdpr': 'EU',
  'ccpa': 'California',
  'fcpa': 'US Federal',
  'antitrust': 'US Federal',
  'ip-law': 'US Federal',
  'employment-law': 'US Federal',
  'contract-law': 'US (Common Law)',
  'litigation-standards': 'US Federal'
};
