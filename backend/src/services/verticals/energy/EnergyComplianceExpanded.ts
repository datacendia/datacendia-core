// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Energy Vertical - Expanded Compliance Frameworks
 * 6 additional frameworks (9 total)
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

export const EXPANDED_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'ferc',
    name: 'Federal Energy Regulatory Commission',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'ferc-rates', name: 'Rate Regulation', description: 'Just and reasonable rates', severity: 'critical', automatable: true },
      { id: 'ferc-reliability', name: 'Reliability Standards', description: 'Mandatory reliability standards', severity: 'critical', automatable: true },
      { id: 'ferc-market', name: 'Market Manipulation', description: 'Anti-manipulation rules', severity: 'critical', automatable: true },
      { id: 'ferc-reporting', name: 'Reporting Requirements', description: 'FERC Form 1/714 reporting', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'nrc',
    name: 'Nuclear Regulatory Commission',
    version: '10 CFR 50',
    jurisdiction: 'US',
    controls: [
      { id: 'nrc-license', name: 'Operating License', description: 'Valid operating license', severity: 'critical', automatable: false },
      { id: 'nrc-safety', name: 'Safety Analysis', description: 'Safety analysis reports', severity: 'critical', automatable: false },
      { id: 'nrc-security', name: 'Physical Security', description: 'Security plans and force-on-force', severity: 'critical', automatable: false },
      { id: 'nrc-emergency', name: 'Emergency Planning', description: 'Emergency response plans', severity: 'critical', automatable: false },
      { id: 'nrc-reporting', name: 'Event Reporting', description: 'Licensee event reports', severity: 'critical', automatable: true }
    ]
  },
  {
    id: 'epa-air',
    name: 'EPA Clean Air Act',
    version: '42 USC 7401',
    jurisdiction: 'US',
    controls: [
      { id: 'caa-naaqs', name: 'NAAQS Compliance', description: 'National ambient air quality standards', severity: 'critical', automatable: true },
      { id: 'caa-nsps', name: 'NSPS', description: 'New source performance standards', severity: 'critical', automatable: true },
      { id: 'caa-title-v', name: 'Title V Permit', description: 'Operating permit requirements', severity: 'critical', automatable: false },
      { id: 'caa-ghg', name: 'GHG Reporting', description: 'Greenhouse gas reporting', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'epa-water',
    name: 'EPA Clean Water Act',
    version: '33 USC 1251',
    jurisdiction: 'US',
    controls: [
      { id: 'cwa-npdes', name: 'NPDES Permit', description: 'Discharge permit compliance', severity: 'critical', automatable: false },
      { id: 'cwa-spcc', name: 'SPCC Plan', description: 'Spill prevention control', severity: 'critical', automatable: false },
      { id: 'cwa-monitoring', name: 'Discharge Monitoring', description: 'Effluent monitoring and reporting', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'doe-efficiency',
    name: 'DOE Energy Efficiency Standards',
    version: '10 CFR 430',
    jurisdiction: 'US',
    controls: [
      { id: 'doe-standards', name: 'Efficiency Standards', description: 'Appliance efficiency standards', severity: 'high', automatable: true },
      { id: 'doe-testing', name: 'Testing Procedures', description: 'DOE test procedures', severity: 'high', automatable: true },
      { id: 'doe-certification', name: 'Certification', description: 'Compliance certification', severity: 'high', automatable: true }
    ]
  },
  {
    id: 'iso-50001',
    name: 'ISO 50001 Energy Management',
    version: '2018',
    jurisdiction: 'International',
    controls: [
      { id: 'iso50-policy', name: 'Energy Policy', description: 'Energy management policy', severity: 'high', automatable: false },
      { id: 'iso50-planning', name: 'Energy Planning', description: 'Energy review and baseline', severity: 'high', automatable: true },
      { id: 'iso50-objectives', name: 'Energy Objectives', description: 'Energy performance targets', severity: 'high', automatable: true },
      { id: 'iso50-monitoring', name: 'Monitoring', description: 'Energy performance monitoring', severity: 'high', automatable: true }
    ]
  }
];

export const EXPANDED_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'maintenance-deferral': {
    'ferc': ['ferc-reliability'],
    'nrc': ['nrc-safety', 'nrc-reporting'],
    'iso-50001': ['iso50-monitoring']
  },
  'load-balancing': {
    'ferc': ['ferc-rates', 'ferc-reliability', 'ferc-market'],
    'iso-50001': ['iso50-planning', 'iso50-objectives']
  },
  'emergency-response': {
    'ferc': ['ferc-reliability', 'ferc-reporting'],
    'nrc': ['nrc-emergency', 'nrc-reporting'],
    'epa-air': ['caa-title-v']
  },
  'grid-optimization': {
    'ferc': ['ferc-rates', 'ferc-reliability'],
    'iso-50001': ['iso50-objectives', 'iso50-monitoring']
  },
  'generation-dispatch': {
    'ferc': ['ferc-rates', 'ferc-market'],
    'epa-air': ['caa-naaqs', 'caa-ghg'],
    'epa-water': ['cwa-npdes', 'cwa-monitoring']
  },
  'outage-planning': {
    'ferc': ['ferc-reliability'],
    'nrc': ['nrc-safety'],
    'nerc-cip': ['cip-010']
  },
  'renewable-integration': {
    'ferc': ['ferc-rates', 'ferc-reliability'],
    'iso-50001': ['iso50-objectives', 'iso50-monitoring'],
    'epa-air': ['caa-ghg']
  },
  'demand-response': {
    'ferc': ['ferc-rates', 'ferc-market'],
    'iso-50001': ['iso50-planning', 'iso50-objectives']
  },
  'transmission-upgrade': {
    'ferc': ['ferc-rates', 'ferc-reliability'],
    'nerc-reliability': ['tpl-001'],
    'epa-air': ['caa-title-v']
  },
  'fuel-procurement': {
    'ferc': ['ferc-rates'],
    'epa-air': ['caa-naaqs', 'caa-nsps'],
    'epa-water': ['cwa-spcc']
  },
  'environmental-compliance': {
    'epa-air': ['caa-naaqs', 'caa-nsps', 'caa-title-v', 'caa-ghg'],
    'epa-water': ['cwa-npdes', 'cwa-spcc', 'cwa-monitoring'],
    'iso-14001': ['iso14-aspects', 'iso14-legal', 'iso14-monitoring']
  },
  'asset-retirement': {
    'ferc': ['ferc-rates', 'ferc-reporting'],
    'epa-air': ['caa-title-v'],
    'epa-water': ['cwa-npdes']
  }
};

export const EXPANDED_JURISDICTION_MAP: Record<string, string> = {
  'ferc': 'US',
  'nrc': 'US',
  'epa-air': 'US',
  'epa-water': 'US',
  'doe-efficiency': 'US',
  'iso-50001': 'International'
};
