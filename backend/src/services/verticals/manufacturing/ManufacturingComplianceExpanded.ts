// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Manufacturing Vertical - Expanded Compliance Frameworks
 * 12 additional frameworks (18 total)
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

export const EXPANDED_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001 Quality Management',
    version: '2015',
    jurisdiction: 'International',
    controls: [
      { id: 'iso9-context', name: 'Context of Organization', description: 'Understand organizational context', severity: 'high', automatable: false },
      { id: 'iso9-leadership', name: 'Leadership', description: 'Top management commitment', severity: 'high', automatable: false },
      { id: 'iso9-planning', name: 'Planning', description: 'Risk-based planning', severity: 'high', automatable: true },
      { id: 'iso9-support', name: 'Support', description: 'Resources and competence', severity: 'medium', automatable: true },
      { id: 'iso9-operation', name: 'Operation', description: 'Operational planning and control', severity: 'critical', automatable: true },
      { id: 'iso9-performance', name: 'Performance Evaluation', description: 'Monitoring and measurement', severity: 'high', automatable: true },
      { id: 'iso9-improvement', name: 'Improvement', description: 'Continual improvement', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'iatf-16949',
    name: 'IATF 16949 Automotive Quality',
    version: '2016',
    jurisdiction: 'International',
    controls: [
      { id: 'iatf-corporate', name: 'Corporate Responsibility', description: 'Quality policy and objectives', severity: 'high', automatable: false },
      { id: 'iatf-product-safety', name: 'Product Safety', description: 'Product safety requirements', severity: 'critical', automatable: true },
      { id: 'iatf-manufacturing', name: 'Manufacturing Process Design', description: 'Process FMEA and control plans', severity: 'critical', automatable: true },
      { id: 'iatf-supplier', name: 'Supplier Management', description: 'Supplier quality management', severity: 'high', automatable: true },
      { id: 'iatf-customer', name: 'Customer-Specific Requirements', description: 'Meet customer requirements', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'osha-general',
    name: 'OSHA General Industry Standards',
    version: '29 CFR 1910',
    jurisdiction: 'US',
    controls: [
      { id: 'osha-hazcom', name: 'Hazard Communication', description: 'Chemical hazard communication', severity: 'critical', automatable: true },
      { id: 'osha-ppe', name: 'Personal Protective Equipment', description: 'PPE assessment and provision', severity: 'critical', automatable: true },
      { id: 'osha-lockout', name: 'Lockout/Tagout', description: 'LOTO procedures', severity: 'critical', automatable: true },
      { id: 'osha-machine', name: 'Machine Guarding', description: 'Machine safeguarding', severity: 'critical', automatable: true },
      { id: 'osha-recordkeeping', name: 'Recordkeeping', description: 'OSHA 300 log', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'fda-qsr',
    name: 'FDA Quality System Regulation (21 CFR 820)',
    version: '1996',
    jurisdiction: 'US',
    controls: [
      { id: 'qsr-design', name: 'Design Controls', description: 'Design validation and verification', severity: 'critical', automatable: false },
      { id: 'qsr-capa', name: 'CAPA', description: 'Corrective and preventive action', severity: 'critical', automatable: true },
      { id: 'qsr-production', name: 'Production Controls', description: 'Process validation', severity: 'critical', automatable: true },
      { id: 'qsr-complaint', name: 'Complaint Handling', description: 'MDR and complaint files', severity: 'high', automatable: true },
      { id: 'qsr-records', name: 'Records', description: 'DHR and DMR', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'as9100',
    name: 'AS9100 Aerospace Quality',
    version: 'Rev D',
    jurisdiction: 'International',
    controls: [
      { id: 'as9-config', name: 'Configuration Management', description: 'Configuration control', severity: 'critical', automatable: true },
      { id: 'as9-fod', name: 'FOD Prevention', description: 'Foreign object debris prevention', severity: 'critical', automatable: true },
      { id: 'as9-traceability', name: 'Product Traceability', description: 'Full traceability', severity: 'critical', automatable: true },
      { id: 'as9-first-article', name: 'First Article Inspection', description: 'FAI requirements', severity: 'high', automatable: true },
      { id: 'as9-counterfeit', name: 'Counterfeit Parts Prevention', description: 'Prevent counterfeit parts', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'iso-14001',
    name: 'ISO 14001 Environmental Management',
    version: '2015',
    jurisdiction: 'International',
    controls: [
      { id: 'iso14-aspects', name: 'Environmental Aspects', description: 'Identify environmental aspects', severity: 'high', automatable: true },
      { id: 'iso14-legal', name: 'Legal Compliance', description: 'Comply with environmental laws', severity: 'critical', automatable: true },
      { id: 'iso14-objectives', name: 'Environmental Objectives', description: 'Set and track objectives', severity: 'high', automatable: true },
      { id: 'iso14-emergency', name: 'Emergency Preparedness', description: 'Emergency response plans', severity: 'high', automatable: false },
      { id: 'iso14-monitoring', name: 'Monitoring', description: 'Monitor environmental performance', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001 Occupational Health & Safety',
    version: '2018',
    jurisdiction: 'International',
    controls: [
      { id: 'iso45-hazard', name: 'Hazard Identification', description: 'Identify workplace hazards', severity: 'critical', automatable: true },
      { id: 'iso45-risk', name: 'Risk Assessment', description: 'Assess OH&S risks', severity: 'critical', automatable: true },
      { id: 'iso45-participation', name: 'Worker Participation', description: 'Consult workers on OH&S', severity: 'high', automatable: false },
      { id: 'iso45-incident', name: 'Incident Investigation', description: 'Investigate incidents', severity: 'critical', automatable: true },
      { id: 'iso45-audit', name: 'Internal Audit', description: 'OH&S management system audits', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'iso-13485',
    name: 'ISO 13485 Medical Devices Quality',
    version: '2016',
    jurisdiction: 'International',
    controls: [
      { id: 'iso13-risk', name: 'Risk Management', description: 'ISO 14971 risk management', severity: 'critical', automatable: true },
      { id: 'iso13-design', name: 'Design and Development', description: 'Design controls', severity: 'critical', automatable: false },
      { id: 'iso13-sterile', name: 'Sterile Products', description: 'Sterile device requirements', severity: 'critical', automatable: true },
      { id: 'iso13-traceability', name: 'Traceability', description: 'Device traceability', severity: 'critical', automatable: true },
      { id: 'iso13-complaint', name: 'Complaint Handling', description: 'Customer complaints and vigilance', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'six-sigma',
    name: 'Six Sigma / Lean Manufacturing',
    version: 'DMAIC',
    jurisdiction: 'International',
    controls: [
      { id: 'ss-define', name: 'Define Phase', description: 'Define project scope and goals', severity: 'high', automatable: false },
      { id: 'ss-measure', name: 'Measure Phase', description: 'Measure current performance', severity: 'high', automatable: true },
      { id: 'ss-analyze', name: 'Analyze Phase', description: 'Analyze root causes', severity: 'high', automatable: true },
      { id: 'ss-improve', name: 'Improve Phase', description: 'Implement improvements', severity: 'high', automatable: true },
      { id: 'ss-control', name: 'Control Phase', description: 'Sustain improvements', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'apqp',
    name: 'Advanced Product Quality Planning',
    version: '2024',
    jurisdiction: 'Automotive',
    controls: [
      { id: 'apqp-planning', name: 'Plan and Define', description: 'Product design and development planning', severity: 'high', automatable: true },
      { id: 'apqp-design', name: 'Product Design', description: 'Design FMEA and DVP&R', severity: 'critical', automatable: false },
      { id: 'apqp-process', name: 'Process Design', description: 'Process FMEA and control plan', severity: 'critical', automatable: true },
      { id: 'apqp-validation', name: 'Product Validation', description: 'Production trial run', severity: 'critical', automatable: true },
      { id: 'apqp-launch', name: 'Launch and Feedback', description: 'Production launch and lessons learned', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'ppap',
    name: 'Production Part Approval Process',
    version: '4th Edition',
    jurisdiction: 'Automotive',
    controls: [
      { id: 'ppap-warrant', name: 'Part Submission Warrant', description: 'PSW documentation', severity: 'critical', automatable: true },
      { id: 'ppap-appearance', name: 'Appearance Approval', description: 'AAR if applicable', severity: 'high', automatable: false },
      { id: 'ppap-dimensional', name: 'Dimensional Results', description: 'Full dimensional inspection', severity: 'critical', automatable: true },
      { id: 'ppap-material', name: 'Material Test Results', description: 'Material certification', severity: 'critical', automatable: true },
      { id: 'ppap-process', name: 'Process Capability', description: 'Cpk >= 1.33', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'nadcap',
    name: 'NADCAP Special Process Accreditation',
    version: '2024',
    jurisdiction: 'Aerospace',
    controls: [
      { id: 'nadcap-heat-treat', name: 'Heat Treatment', description: 'Heat treat process control', severity: 'critical', automatable: true },
      { id: 'nadcap-ndt', name: 'Non-Destructive Testing', description: 'NDT procedures and personnel', severity: 'critical', automatable: true },
      { id: 'nadcap-welding', name: 'Welding', description: 'Welding process control', severity: 'critical', automatable: true },
      { id: 'nadcap-coating', name: 'Coatings', description: 'Surface treatment processes', severity: 'high', automatable: true }
    ]
  }
];

export const EXPANDED_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'production': {
    'iso-9001': ['iso9-operation', 'iso9-performance'],
    'iatf-16949': ['iatf-manufacturing', 'iatf-product-safety'],
    'osha-general': ['osha-machine', 'osha-lockout'],
    'six-sigma': ['ss-measure', 'ss-control']
  },
  'quality': {
    'iso-9001': ['iso9-operation', 'iso9-improvement'],
    'fda-qsr': ['qsr-production', 'qsr-capa'],
    'iso-13485': ['iso13-risk', 'iso13-traceability'],
    'ppap': ['ppap-dimensional', 'ppap-process']
  },
  'safety': {
    'osha-general': ['osha-hazcom', 'osha-ppe', 'osha-lockout', 'osha-recordkeeping'],
    'iso-45001': ['iso45-hazard', 'iso45-risk', 'iso45-incident']
  },
  'rebalance': {
    'iso-9001': ['iso9-planning', 'iso9-performance'],
    'six-sigma': ['ss-analyze', 'ss-improve', 'ss-control']
  },
  'product-launch': {
    'apqp': ['apqp-planning', 'apqp-design', 'apqp-process', 'apqp-validation', 'apqp-launch'],
    'ppap': ['ppap-warrant', 'ppap-dimensional', 'ppap-material', 'ppap-process'],
    'iatf-16949': ['iatf-manufacturing', 'iatf-customer']
  },
  'supplier-qualification': {
    'iso-9001': ['iso9-support', 'iso9-operation'],
    'iatf-16949': ['iatf-supplier'],
    'as9100': ['as9-config', 'as9-counterfeit']
  },
  'process-change': {
    'iso-9001': ['iso9-operation', 'iso9-improvement'],
    'apqp': ['apqp-process', 'apqp-validation'],
    'six-sigma': ['ss-analyze', 'ss-improve', 'ss-control']
  },
  'equipment-qualification': {
    'iso-9001': ['iso9-support', 'iso9-operation'],
    'fda-qsr': ['qsr-production'],
    'nadcap': ['nadcap-heat-treat', 'nadcap-welding']
  },
  'ncr-disposition': {
    'iso-9001': ['iso9-operation', 'iso9-improvement'],
    'fda-qsr': ['qsr-capa', 'qsr-complaint'],
    'iso-13485': ['iso13-complaint', 'iso13-traceability']
  },
  'environmental-permit': {
    'iso-14001': ['iso14-aspects', 'iso14-legal', 'iso14-monitoring'],
    'osha-general': ['osha-hazcom']
  },
  'workforce-training': {
    'iso-9001': ['iso9-support'],
    'osha-general': ['osha-hazcom', 'osha-lockout'],
    'iso-45001': ['iso45-participation']
  },
  'capital-investment': {
    'iso-9001': ['iso9-planning', 'iso9-support'],
    'iso-14001': ['iso14-aspects', 'iso14-objectives']
  }
};

export const EXPANDED_JURISDICTION_MAP: Record<string, string> = {
  'iso-9001': 'International',
  'iatf-16949': 'International',
  'osha-general': 'US',
  'fda-qsr': 'US',
  'as9100': 'International',
  'iso-14001': 'International',
  'iso-45001': 'International',
  'iso-13485': 'International',
  'six-sigma': 'International',
  'apqp': 'Automotive',
  'ppap': 'Automotive',
  'nadcap': 'Aerospace'
};
