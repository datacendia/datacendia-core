// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Healthcare Vertical - Expanded Compliance Frameworks
 * 8 additional frameworks (12 total)
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

export const EXPANDED_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'cms-cop',
    name: 'CMS Conditions of Participation',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'cop-patient-rights', name: 'Patient Rights', description: 'Informed consent and patient rights', severity: 'critical', automatable: false },
      { id: 'cop-medical-staff', name: 'Medical Staff', description: 'Credentialing and privileging', severity: 'critical', automatable: true },
      { id: 'cop-nursing', name: 'Nursing Services', description: 'RN supervision and staffing', severity: 'high', automatable: true },
      { id: 'cop-pharmacy', name: 'Pharmaceutical Services', description: 'Medication management', severity: 'critical', automatable: true },
      { id: 'cop-laboratory', name: 'Laboratory Services', description: 'CLIA compliance', severity: 'high', automatable: true },
      { id: 'cop-radiology', name: 'Radiologic Services', description: 'Imaging safety and quality', severity: 'high', automatable: true },
      { id: 'cop-qapi', name: 'QAPI Program', description: 'Quality assurance and performance improvement', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'emtala',
    name: 'Emergency Medical Treatment and Labor Act',
    version: '1986',
    jurisdiction: 'US',
    controls: [
      { id: 'emtala-mse', name: 'Medical Screening Exam', description: 'Appropriate MSE for all patients', severity: 'critical', automatable: false },
      { id: 'emtala-stabilization', name: 'Stabilization', description: 'Stabilize emergency medical conditions', severity: 'critical', automatable: false },
      { id: 'emtala-transfer', name: 'Appropriate Transfer', description: 'Transfer requirements and certification', severity: 'critical', automatable: true },
      { id: 'emtala-on-call', name: 'On-Call Physicians', description: 'On-call specialist availability', severity: 'high', automatable: true },
      { id: 'emtala-signage', name: 'Patient Signage', description: 'Post EMTALA rights', severity: 'medium', automatable: false }
    ]
  },
  {
    id: 'stark-law',
    name: 'Stark Law (Physician Self-Referral)',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'stark-referral', name: 'Referral Prohibition', description: 'Prohibit self-referrals for DHS', severity: 'critical', automatable: true },
      { id: 'stark-financial', name: 'Financial Relationships', description: 'Track physician financial relationships', severity: 'critical', automatable: true },
      { id: 'stark-exceptions', name: 'Exception Documentation', description: 'Document applicable exceptions', severity: 'high', automatable: true },
      { id: 'stark-disclosure', name: 'Disclosure Requirements', description: 'Annual disclosure of relationships', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'anti-kickback',
    name: 'Anti-Kickback Statute',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'aks-remuneration', name: 'Remuneration Prohibition', description: 'Prohibit kickbacks for referrals', severity: 'critical', automatable: true },
      { id: 'aks-safe-harbor', name: 'Safe Harbor Compliance', description: 'Ensure safe harbor protections', severity: 'critical', automatable: true },
      { id: 'aks-intent', name: 'Intent Analysis', description: 'Evaluate intent to induce referrals', severity: 'high', automatable: false },
      { id: 'aks-monitoring', name: 'Compliance Monitoring', description: 'Monitor arrangements for AKS risk', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'clia',
    name: 'Clinical Laboratory Improvement Amendments',
    version: '1988',
    jurisdiction: 'US',
    controls: [
      { id: 'clia-certificate', name: 'CLIA Certificate', description: 'Valid CLIA certificate', severity: 'critical', automatable: true },
      { id: 'clia-qc', name: 'Quality Control', description: 'Daily QC and proficiency testing', severity: 'critical', automatable: true },
      { id: 'clia-personnel', name: 'Personnel Qualifications', description: 'Laboratory director and staff qualifications', severity: 'high', automatable: true },
      { id: 'clia-validation', name: 'Test Validation', description: 'Validate test systems', severity: 'high', automatable: false },
      { id: 'clia-reporting', name: 'Result Reporting', description: 'Timely and accurate reporting', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'oig-compliance',
    name: 'OIG Compliance Program Guidance',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'oig-code-conduct', name: 'Code of Conduct', description: 'Written code of conduct', severity: 'high', automatable: false },
      { id: 'oig-compliance-officer', name: 'Compliance Officer', description: 'Designated compliance officer', severity: 'high', automatable: true },
      { id: 'oig-training', name: 'Compliance Training', description: 'Annual compliance training', severity: 'high', automatable: true },
      { id: 'oig-auditing', name: 'Internal Auditing', description: 'Regular compliance audits', severity: 'high', automatable: true },
      { id: 'oig-hotline', name: 'Reporting Mechanism', description: 'Anonymous reporting hotline', severity: 'medium', automatable: false }
    ]
  },
  {
    id: 'meaningful-use',
    name: 'Meaningful Use / Promoting Interoperability',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'mu-cpoe', name: 'CPOE', description: 'Computerized provider order entry', severity: 'high', automatable: true },
      { id: 'mu-cds', name: 'Clinical Decision Support', description: 'Evidence-based CDS', severity: 'high', automatable: true },
      { id: 'mu-patient-access', name: 'Patient Access', description: 'Patient portal and data access', severity: 'high', automatable: true },
      { id: 'mu-interoperability', name: 'Interoperability', description: 'Health information exchange', severity: 'high', automatable: true },
      { id: 'mu-security', name: 'Security Risk Analysis', description: 'Annual security risk analysis', severity: 'critical', automatable: false }
    ]
  },
  {
    id: 'ncqa',
    name: 'NCQA Healthcare Effectiveness Data and Information Set (HEDIS)',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'hedis-preventive', name: 'Preventive Care', description: 'Preventive screening measures', severity: 'medium', automatable: true },
      { id: 'hedis-chronic', name: 'Chronic Disease Management', description: 'Diabetes, hypertension management', severity: 'high', automatable: true },
      { id: 'hedis-behavioral', name: 'Behavioral Health', description: 'Depression screening and follow-up', severity: 'high', automatable: true },
      { id: 'hedis-medication', name: 'Medication Management', description: 'Medication adherence measures', severity: 'medium', automatable: true },
      { id: 'hedis-readmission', name: 'Hospital Readmission', description: '30-day readmission rates', severity: 'high', automatable: true }
    ]
  }
];

export const EXPANDED_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'diagnosis-support': {
    'cms-cop': ['cop-patient-rights', 'cop-medical-staff', 'cop-qapi'],
    'meaningful-use': ['mu-cds', 'mu-security'],
    'oig-compliance': ['oig-code-conduct', 'oig-training']
  },
  'triage': {
    'emtala': ['emtala-mse', 'emtala-stabilization', 'emtala-on-call'],
    'cms-cop': ['cop-nursing', 'cop-patient-rights']
  },
  'medication': {
    'cms-cop': ['cop-pharmacy', 'cop-patient-rights'],
    'meaningful-use': ['mu-cpoe', 'mu-cds'],
    'ncqa': ['hedis-medication']
  },
  'discharge': {
    'cms-cop': ['cop-patient-rights', 'cop-qapi'],
    'ncqa': ['hedis-readmission'],
    'meaningful-use': ['mu-patient-access']
  },
  'surgery-authorization': {
    'cms-cop': ['cop-patient-rights', 'cop-medical-staff', 'cop-qapi'],
    'oig-compliance': ['oig-code-conduct', 'oig-auditing']
  },
  'imaging-order': {
    'cms-cop': ['cop-radiology', 'cop-patient-rights'],
    'stark-law': ['stark-referral', 'stark-financial'],
    'anti-kickback': ['aks-remuneration', 'aks-monitoring']
  },
  'lab-order': {
    'clia': ['clia-certificate', 'clia-qc', 'clia-personnel', 'clia-reporting'],
    'cms-cop': ['cop-laboratory'],
    'meaningful-use': ['mu-cpoe']
  },
  'specialist-referral': {
    'stark-law': ['stark-referral', 'stark-financial', 'stark-exceptions'],
    'anti-kickback': ['aks-remuneration', 'aks-safe-harbor'],
    'cms-cop': ['cop-patient-rights']
  },
  'readmission-risk': {
    'ncqa': ['hedis-readmission', 'hedis-chronic'],
    'cms-cop': ['cop-qapi'],
    'meaningful-use': ['mu-patient-access']
  },
  'clinical-trial-enrollment': {
    'cms-cop': ['cop-patient-rights', 'cop-medical-staff'],
    'oig-compliance': ['oig-code-conduct', 'oig-compliance-officer']
  },
  'end-of-life-care': {
    'cms-cop': ['cop-patient-rights', 'cop-nursing'],
    'oig-compliance': ['oig-code-conduct']
  },
  'behavioral-health-assessment': {
    'ncqa': ['hedis-behavioral'],
    'cms-cop': ['cop-patient-rights', 'cop-qapi'],
    'meaningful-use': ['mu-cds']
  }
};

export const EXPANDED_JURISDICTION_MAP: Record<string, string> = {
  'cms-cop': 'US',
  'emtala': 'US',
  'stark-law': 'US',
  'anti-kickback': 'US',
  'clia': 'US',
  'oig-compliance': 'US',
  'meaningful-use': 'US',
  'ncqa': 'US'
};
