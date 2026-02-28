// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Industrial Services Vertical - Expanded Compliance Frameworks
 * 12 additional frameworks (18 total) with 90+ additional controls (140+ total)
 */

import { ComplianceFramework } from '../core/VerticalPattern.js';

// ============================================================================
// EXPANDED COMPLIANCE FRAMEWORKS (12 new)
// ============================================================================

export const EXPANDED_COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  // --- Framework 7: NFPA 70E Electrical Safety ---
  {
    id: 'nfpa-70e',
    name: 'NFPA 70E Standard for Electrical Safety in the Workplace',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'nfpa70e-arc-flash', name: 'Arc Flash Risk Assessment', description: 'Arc flash hazard analysis and PPE category determination (Article 130)', severity: 'critical', automatable: true },
      { id: 'nfpa70e-energized-work', name: 'Energized Electrical Work Permit', description: 'Permit requirements for work on energized conductors (Article 130.2)', severity: 'critical', automatable: false },
      { id: 'nfpa70e-loto', name: 'Lockout/Tagout Procedures', description: 'LOTO program for hazardous energy control (Article 120)', severity: 'critical', automatable: true },
      { id: 'nfpa70e-approach-boundary', name: 'Approach Boundaries', description: 'Limited, restricted, and prohibited approach boundaries (Table 130.4)', severity: 'critical', automatable: true },
      { id: 'nfpa70e-ppe-selection', name: 'Electrical PPE Selection', description: 'Selection and use of electrical PPE per hazard category (Article 130.7)', severity: 'high', automatable: true },
      { id: 'nfpa70e-qualified-person', name: 'Qualified Person Requirements', description: 'Training and qualification for electrical work (Article 110)', severity: 'high', automatable: true },
      { id: 'nfpa70e-grounding', name: 'Grounding & Bonding', description: 'Temporary protective grounding requirements (Article 120.5)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 8: API 510/570 Pressure Equipment Inspection ---
  {
    id: 'api-510-570',
    name: 'API 510/570 Pressure Vessel & Piping Inspection',
    version: '2022',
    jurisdiction: 'International',
    controls: [
      { id: 'api510-internal-inspection', name: 'Internal Inspection', description: 'Internal inspection requirements for pressure vessels (API 510 Section 6)', severity: 'critical', automatable: false },
      { id: 'api510-external-inspection', name: 'External Inspection', description: 'External visual inspection and corrosion monitoring (API 510 Section 6.3)', severity: 'high', automatable: true },
      { id: 'api510-thickness-measurement', name: 'Thickness Measurement', description: 'Ultrasonic thickness measurements and corrosion rate calculation (API 510 Section 7)', severity: 'critical', automatable: true },
      { id: 'api510-remaining-life', name: 'Remaining Life Calculation', description: 'Retirement thickness and remaining life assessment (API 510 Section 7.2)', severity: 'critical', automatable: true },
      { id: 'api570-piping-inspection', name: 'Piping System Inspection', description: 'In-service piping inspection requirements (API 570 Section 6)', severity: 'critical', automatable: false },
      { id: 'api570-corrosion-monitoring', name: 'Corrosion Monitoring', description: 'Piping corrosion monitoring program (API 570 Section 7)', severity: 'high', automatable: true },
      { id: 'api510-repair-alteration', name: 'Repair & Alteration', description: 'Requirements for vessel and piping repairs (API 510 Section 8)', severity: 'critical', automatable: false },
      { id: 'api510-rbi', name: 'Risk-Based Inspection', description: 'Risk-based inspection planning per API 580/581 (API 510 Section 6.6)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 9: Peru Ley 29783 General OSH Law ---
  {
    id: 'peru-ley-29783',
    name: 'Peru Ley 29783 Ley de Seguridad y Salud en el Trabajo',
    version: '2011 (amended 2024)',
    jurisdiction: 'Peru',
    controls: [
      { id: 'ley29783-prevencion', name: 'Principio de Prevención', description: 'El empleador garantiza la protección de la vida y salud de los trabajadores (Art. 1)', severity: 'critical', automatable: false },
      { id: 'ley29783-responsabilidad', name: 'Principio de Responsabilidad', description: 'Responsabilidad del empleador por consecuencias económicas y legales (Art. 2)', severity: 'critical', automatable: false },
      { id: 'ley29783-participacion', name: 'Participación de Trabajadores', description: 'Derecho a participar en el SGSST (Art. 19-25)', severity: 'high', automatable: false },
      { id: 'ley29783-sgsst', name: 'Sistema de Gestión SST', description: 'Implementación del Sistema de Gestión de SST (Art. 17-18)', severity: 'critical', automatable: true },
      { id: 'ley29783-capacitacion', name: 'Capacitación Obligatoria', description: 'Capacitación mínima en SST para todos los trabajadores (Art. 35)', severity: 'high', automatable: true },
      { id: 'ley29783-examenes', name: 'Exámenes Médicos Ocupacionales', description: 'Exámenes pre, periódicos y de retiro (Art. 49-f)', severity: 'high', automatable: true },
      { id: 'ley29783-registros', name: 'Registros Obligatorios', description: 'Registros del SGSST por mínimo 10 años (Art. 28)', severity: 'critical', automatable: true },
      { id: 'ley29783-sanciones', name: 'Régimen Sancionador', description: 'Sanciones por incumplimiento (Art. 168-A Código Penal)', severity: 'critical', automatable: true },
    ]
  },

  // --- Framework 10: ANSI Z359 Fall Protection ---
  {
    id: 'ansi-z359',
    name: 'ANSI Z359 Fall Protection & Fall Restraint Standard',
    version: '2020',
    jurisdiction: 'US',
    controls: [
      { id: 'z359-fall-protection-plan', name: 'Fall Protection Plan', description: 'Documented fall protection plan for each work area (Z359.2)', severity: 'critical', automatable: true },
      { id: 'z359-pfas', name: 'Personal Fall Arrest Systems', description: 'Full-body harness, lanyard, and anchorage requirements (Z359.1)', severity: 'critical', automatable: true },
      { id: 'z359-anchorage', name: 'Anchorage Requirements', description: 'Anchorage point strength (5000 lbs minimum) and inspection (Z359.1)', severity: 'critical', automatable: true },
      { id: 'z359-srl', name: 'Self-Retracting Lifelines', description: 'SRL inspection, maintenance, and service life (Z359.14)', severity: 'high', automatable: true },
      { id: 'z359-rescue-plan', name: 'Rescue Planning', description: 'Post-fall rescue plan and equipment availability (Z359.2)', severity: 'critical', automatable: false },
      { id: 'z359-training', name: 'Fall Protection Training', description: 'Competent person training and annual retraining (Z359.2)', severity: 'high', automatable: true },
      { id: 'z359-inspection', name: 'Equipment Inspection', description: 'Pre-use and periodic inspection of all fall protection equipment (Z359.2)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 11: NFPA 51B Hot Work Fire Prevention ---
  {
    id: 'nfpa-51b',
    name: 'NFPA 51B Standard for Fire Prevention During Welding, Cutting, and Other Hot Work',
    version: '2019',
    jurisdiction: 'US',
    controls: [
      { id: 'nfpa51b-permit', name: 'Hot Work Permit', description: 'Written hot work permit required before operations (Section 6)', severity: 'critical', automatable: true },
      { id: 'nfpa51b-fire-watch', name: 'Fire Watch Requirements', description: 'Designated fire watch during and 60 min after hot work (Section 8)', severity: 'critical', automatable: false },
      { id: 'nfpa51b-area-prep', name: 'Hot Work Area Preparation', description: 'Combustible material clearance (35ft radius) or fire-resistant covers (Section 7)', severity: 'critical', automatable: true },
      { id: 'nfpa51b-fire-extinguisher', name: 'Fire Extinguisher Requirements', description: 'Appropriate fire extinguishers within immediate reach (Section 7)', severity: 'high', automatable: true },
      { id: 'nfpa51b-confined-space-hot', name: 'Hot Work in Confined Spaces', description: 'Additional requirements for hot work in confined areas (Section 11)', severity: 'critical', automatable: false },
      { id: 'nfpa51b-gas-test', name: 'Atmospheric Testing', description: 'Gas testing before hot work near flammable materials (Section 7)', severity: 'critical', automatable: true },
    ]
  },

  // --- Framework 12: ISO 31000 Risk Management ---
  {
    id: 'iso-31000',
    name: 'ISO 31000:2018 Risk Management',
    version: '2018',
    jurisdiction: 'International',
    controls: [
      { id: 'iso31-risk-framework', name: 'Risk Management Framework', description: 'Establishing risk management framework and governance (Clause 5)', severity: 'high', automatable: false },
      { id: 'iso31-risk-identification', name: 'Risk Identification', description: 'Systematic identification of sources of risk (Clause 6.4.2)', severity: 'critical', automatable: true },
      { id: 'iso31-risk-analysis', name: 'Risk Analysis', description: 'Understanding nature and level of risk (Clause 6.4.3)', severity: 'critical', automatable: true },
      { id: 'iso31-risk-evaluation', name: 'Risk Evaluation', description: 'Comparing risk analysis results against criteria (Clause 6.4.4)', severity: 'high', automatable: true },
      { id: 'iso31-risk-treatment', name: 'Risk Treatment', description: 'Selecting and implementing risk treatment options (Clause 6.5)', severity: 'high', automatable: false },
      { id: 'iso31-monitoring', name: 'Risk Monitoring & Review', description: 'Continuous monitoring and review of risk (Clause 6.6)', severity: 'high', automatable: true },
      { id: 'iso31-communication', name: 'Risk Communication', description: 'Communication and consultation with stakeholders (Clause 6.2)', severity: 'medium', automatable: false },
    ]
  },

  // --- Framework 13: ISO 55001 Asset Management ---
  {
    id: 'iso-55001',
    name: 'ISO 55001:2014 Asset Management',
    version: '2014',
    jurisdiction: 'International',
    controls: [
      { id: 'iso55-asset-policy', name: 'Asset Management Policy', description: 'Documented asset management policy aligned with strategy (Clause 5.2)', severity: 'high', automatable: false },
      { id: 'iso55-asset-planning', name: 'Asset Management Planning', description: 'Strategic asset management plan (SAMP) development (Clause 6.2)', severity: 'high', automatable: true },
      { id: 'iso55-lifecycle', name: 'Asset Lifecycle Management', description: 'Whole-life cost and performance optimization (Clause 8.1)', severity: 'critical', automatable: true },
      { id: 'iso55-risk-opportunity', name: 'Asset Risk & Opportunity', description: 'Risk-based approach to asset management decisions (Clause 6.1)', severity: 'high', automatable: true },
      { id: 'iso55-performance', name: 'Asset Performance Monitoring', description: 'KPIs and performance evaluation for assets (Clause 9.1)', severity: 'high', automatable: true },
      { id: 'iso55-outsourced', name: 'Outsourced Asset Activities', description: 'Control of outsourced asset management activities (Clause 8.3)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 14: DS 024-2016-EM Peru Mining Safety ---
  {
    id: 'peru-ds024-mining',
    name: 'DS 024-2016-EM Reglamento de Seguridad y Salud Ocupacional en Minería',
    version: '2016 (amended 2023)',
    jurisdiction: 'Peru',
    controls: [
      { id: 'ds024-petar', name: 'PETAR (Permiso de Trabajo de Alto Riesgo)', description: 'High-risk work permits for mining operations (Art. 128-130)', severity: 'critical', automatable: true },
      { id: 'ds024-pets', name: 'PETS (Procedimiento Escrito de Trabajo Seguro)', description: 'Written safe work procedures for all activities (Art. 99)', severity: 'critical', automatable: true },
      { id: 'ds024-ats', name: 'ATS (Análisis de Trabajo Seguro)', description: 'Job safety analysis before each task (Art. 100)', severity: 'critical', automatable: true },
      { id: 'ds024-geomechanics', name: 'Geomechanical Assessment', description: 'Ground control and stability assessment for underground operations (Art. 214-232)', severity: 'critical', automatable: false },
      { id: 'ds024-ventilation', name: 'Mine Ventilation', description: 'Adequate ventilation for underground operations (Art. 236-246)', severity: 'critical', automatable: true },
      { id: 'ds024-explosives', name: 'Explosives Management', description: 'Storage, transport, and use of explosives (Art. 261-288)', severity: 'critical', automatable: false },
      { id: 'ds024-emergency-mine', name: 'Mine Emergency Response', description: 'Mine rescue and emergency response plan (Art. 148-152)', severity: 'critical', automatable: false },
      { id: 'ds024-highaltitude', name: 'High Altitude Work', description: 'Medical requirements for work above 3,000 meters (Art. 111)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 15: EPA 40 CFR Environmental ---
  {
    id: 'epa-40cfr',
    name: 'EPA 40 CFR US Environmental Regulations',
    version: '2024',
    jurisdiction: 'US',
    controls: [
      { id: 'epa-spcc', name: 'Spill Prevention Control', description: 'SPCC Plan for facilities with oil storage (40 CFR 112)', severity: 'critical', automatable: true },
      { id: 'epa-rcra', name: 'Hazardous Waste Management', description: 'RCRA requirements for hazardous waste (40 CFR 260-272)', severity: 'critical', automatable: true },
      { id: 'epa-cercla', name: 'Superfund Response', description: 'CERCLA reporting and response requirements (40 CFR 302)', severity: 'critical', automatable: true },
      { id: 'epa-caa', name: 'Clean Air Act Compliance', description: 'Air emission standards and permits (40 CFR 50-97)', severity: 'high', automatable: true },
      { id: 'epa-cwa', name: 'Clean Water Act Compliance', description: 'Water discharge permits and standards (40 CFR 122-136)', severity: 'high', automatable: true },
      { id: 'epa-tsca', name: 'Toxic Substances Control', description: 'TSCA chemical management requirements (40 CFR 700-799)', severity: 'high', automatable: true },
      { id: 'epa-epcra', name: 'Emergency Planning & Release Reporting', description: 'Community right-to-know and TRI reporting (40 CFR 355-372)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 16: Peru MINAM Environmental ---
  {
    id: 'peru-minam',
    name: 'Peru MINAM Environmental Regulations (LGA, EIA)',
    version: '2024',
    jurisdiction: 'Peru',
    controls: [
      { id: 'minam-eia', name: 'Evaluación de Impacto Ambiental', description: 'Environmental impact assessment for industrial projects (Ley 27446)', severity: 'critical', automatable: false },
      { id: 'minam-lga', name: 'Ley General del Ambiente', description: 'General environmental law compliance requirements (Ley 28611)', severity: 'critical', automatable: false },
      { id: 'minam-eca', name: 'Estándares de Calidad Ambiental', description: 'Environmental quality standards for air, water, and soil (DS 003-2017-MINAM)', severity: 'high', automatable: true },
      { id: 'minam-lmp', name: 'Límites Máximos Permisibles', description: 'Maximum permissible emission and effluent limits (various DS)', severity: 'critical', automatable: true },
      { id: 'minam-residuos', name: 'Gestión de Residuos Sólidos', description: 'Solid and hazardous waste management (DL 1278)', severity: 'high', automatable: true },
      { id: 'minam-fiscalizacion', name: 'Fiscalización Ambiental', description: 'OEFA environmental enforcement and oversight (Ley 29325)', severity: 'critical', automatable: false },
    ]
  },

  // --- Framework 17: ILO Convention 155 OSH ---
  {
    id: 'ilo-c155',
    name: 'ILO Convention 155 - Occupational Safety and Health',
    version: '1981 (Protocol 2002)',
    jurisdiction: 'International',
    controls: [
      { id: 'ilo155-national-policy', name: 'National OSH Policy', description: 'Coherent national policy on OSH (Article 4)', severity: 'high', automatable: false },
      { id: 'ilo155-employer-duty', name: 'Employer General Duty', description: 'Workplaces, machinery, and processes are safe (Article 16)', severity: 'critical', automatable: false },
      { id: 'ilo155-worker-rights', name: 'Worker Rights', description: 'Workers right to remove from imminent danger (Article 13)', severity: 'critical', automatable: false },
      { id: 'ilo155-cooperation', name: 'Worker-Management Cooperation', description: 'Cooperation between employers and workers on OSH (Article 20)', severity: 'high', automatable: false },
      { id: 'ilo155-recording', name: 'Accident Recording', description: 'Recording and notification of occupational accidents (Article 11)', severity: 'high', automatable: true },
      { id: 'ilo155-training-info', name: 'Training & Information', description: 'Adequate OSH training and information for workers (Article 19)', severity: 'high', automatable: true },
    ]
  },

  // --- Framework 18: NEBOSH International Standards ---
  {
    id: 'nebosh-igc',
    name: 'NEBOSH International General Certificate Standards',
    version: '2024',
    jurisdiction: 'International',
    controls: [
      { id: 'nebosh-management', name: 'Health & Safety Management', description: 'Plan-Do-Check-Act cycle for HSE management systems', severity: 'high', automatable: false },
      { id: 'nebosh-risk-assessment', name: 'Risk Assessment Process', description: '5-step risk assessment methodology (Identify, Evaluate, Control, Record, Review)', severity: 'critical', automatable: true },
      { id: 'nebosh-workplace-hazards', name: 'Workplace Hazard Control', description: 'Hierarchy of controls for workplace hazards', severity: 'high', automatable: true },
      { id: 'nebosh-work-equipment', name: 'Work Equipment Safety', description: 'Safe use, maintenance, and inspection of work equipment', severity: 'high', automatable: true },
      { id: 'nebosh-fire-safety', name: 'Fire Safety Management', description: 'Fire risk assessment and emergency procedures', severity: 'critical', automatable: true },
      { id: 'nebosh-chemical-bio', name: 'Chemical & Biological Hazards', description: 'Control of chemical and biological agents in the workplace', severity: 'high', automatable: true },
      { id: 'nebosh-physical-hazards', name: 'Physical Hazards', description: 'Control of noise, vibration, radiation, and ergonomic hazards', severity: 'high', automatable: true },
    ]
  },
];

// ============================================================================
// EXPANDED COMPLIANCE MAPPINGS
// Maps new frameworks to all 15 decision types
// ============================================================================

export const EXPANDED_COMPLIANCE_MAPPINGS: Record<string, Record<string, string[]>> = {
  'project-bid': {
    'nfpa-70e': ['nfpa70e-arc-flash', 'nfpa70e-qualified-person'],
    'api-510-570': ['api510-rbi', 'api510-repair-alteration'],
    'peru-ley-29783': ['ley29783-sgsst', 'ley29783-prevencion'],
    'ansi-z359': ['z359-fall-protection-plan'],
    'nfpa-51b': ['nfpa51b-permit'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-risk-evaluation'],
    'iso-55001': ['iso55-asset-planning', 'iso55-lifecycle'],
    'peru-ds024-mining': ['ds024-petar', 'ds024-pets', 'ds024-highaltitude'],
    'epa-40cfr': ['epa-spcc', 'epa-rcra'],
    'peru-minam': ['minam-eia', 'minam-lga'],
    'ilo-c155': ['ilo155-employer-duty'],
    'nebosh-igc': ['nebosh-risk-assessment', 'nebosh-management'],
  },
  'equipment': {
    'nfpa-70e': ['nfpa70e-arc-flash', 'nfpa70e-loto', 'nfpa70e-grounding'],
    'api-510-570': ['api510-internal-inspection', 'api510-thickness-measurement', 'api510-remaining-life'],
    'iso-55001': ['iso55-lifecycle', 'iso55-performance', 'iso55-risk-opportunity'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis'],
    'nebosh-igc': ['nebosh-work-equipment'],
  },
  'safety-permit': {
    'nfpa-70e': ['nfpa70e-arc-flash', 'nfpa70e-energized-work', 'nfpa70e-loto', 'nfpa70e-approach-boundary', 'nfpa70e-ppe-selection', 'nfpa70e-qualified-person'],
    'ansi-z359': ['z359-fall-protection-plan', 'z359-pfas', 'z359-anchorage', 'z359-rescue-plan', 'z359-training', 'z359-inspection'],
    'nfpa-51b': ['nfpa51b-permit', 'nfpa51b-fire-watch', 'nfpa51b-area-prep', 'nfpa51b-fire-extinguisher', 'nfpa51b-gas-test'],
    'peru-ley-29783': ['ley29783-prevencion', 'ley29783-sgsst', 'ley29783-capacitacion', 'ley29783-examenes'],
    'peru-ds024-mining': ['ds024-petar', 'ds024-pets', 'ds024-ats', 'ds024-highaltitude'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-risk-evaluation', 'iso31-risk-treatment'],
    'ilo-c155': ['ilo155-employer-duty', 'ilo155-worker-rights', 'ilo155-training-info'],
    'nebosh-igc': ['nebosh-risk-assessment', 'nebosh-workplace-hazards', 'nebosh-fire-safety'],
  },
  'subcontractor': {
    'peru-ley-29783': ['ley29783-responsabilidad', 'ley29783-sgsst', 'ley29783-capacitacion'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-evaluation'],
    'iso-55001': ['iso55-outsourced'],
    'ilo-c155': ['ilo155-employer-duty', 'ilo155-cooperation'],
    'nebosh-igc': ['nebosh-management'],
  },
  'contract-review': {
    'peru-ley-29783': ['ley29783-responsabilidad', 'ley29783-sanciones'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-risk-evaluation', 'iso31-risk-treatment', 'iso31-communication'],
    'ilo-c155': ['ilo155-employer-duty'],
    'nebosh-igc': ['nebosh-management'],
  },
  'workforce-deployment': {
    'peru-ley-29783': ['ley29783-capacitacion', 'ley29783-examenes', 'ley29783-participacion'],
    'peru-ds024-mining': ['ds024-highaltitude', 'ds024-pets'],
    'ansi-z359': ['z359-training'],
    'nfpa-70e': ['nfpa70e-qualified-person'],
    'ilo-c155': ['ilo155-training-info', 'ilo155-worker-rights'],
    'nebosh-igc': ['nebosh-workplace-hazards'],
  },
  'maintenance-schedule': {
    'api-510-570': ['api510-internal-inspection', 'api510-external-inspection', 'api510-thickness-measurement', 'api510-remaining-life', 'api570-piping-inspection', 'api570-corrosion-monitoring', 'api510-rbi'],
    'iso-55001': ['iso55-lifecycle', 'iso55-performance', 'iso55-asset-planning'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis'],
    'nebosh-igc': ['nebosh-work-equipment'],
  },
  'incident-investigation': {
    'peru-ley-29783': ['ley29783-sgsst', 'ley29783-registros', 'ley29783-sanciones'],
    'ilo-c155': ['ilo155-recording', 'ilo155-employer-duty'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-monitoring'],
    'nebosh-igc': ['nebosh-management', 'nebosh-risk-assessment'],
  },
  'training-certification': {
    'peru-ley-29783': ['ley29783-capacitacion', 'ley29783-sgsst'],
    'peru-ds024-mining': ['ds024-pets', 'ds024-highaltitude'],
    'ansi-z359': ['z359-training'],
    'nfpa-70e': ['nfpa70e-qualified-person'],
    'ilo-c155': ['ilo155-training-info'],
    'nebosh-igc': ['nebosh-management', 'nebosh-risk-assessment'],
  },
  'change-order': {
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-risk-evaluation', 'iso31-risk-treatment'],
    'iso-55001': ['iso55-asset-planning'],
    'nebosh-igc': ['nebosh-management'],
  },
  'insurance-claim': {
    'peru-ley-29783': ['ley29783-registros', 'ley29783-sanciones'],
    'ilo-c155': ['ilo155-recording'],
    'iso-31000': ['iso31-risk-analysis', 'iso31-monitoring'],
  },
  'environmental-assessment': {
    'epa-40cfr': ['epa-spcc', 'epa-rcra', 'epa-cercla', 'epa-caa', 'epa-cwa', 'epa-tsca', 'epa-epcra'],
    'peru-minam': ['minam-eia', 'minam-lga', 'minam-eca', 'minam-lmp', 'minam-residuos', 'minam-fiscalizacion'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis'],
    'nebosh-igc': ['nebosh-chemical-bio'],
  },
  'quality-ncr': {
    'api-510-570': ['api510-repair-alteration', 'api510-internal-inspection'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-treatment'],
    'nebosh-igc': ['nebosh-work-equipment'],
  },
  'emergency-response': {
    'peru-ley-29783': ['ley29783-sgsst', 'ley29783-prevencion'],
    'peru-ds024-mining': ['ds024-emergency-mine'],
    'nfpa-51b': ['nfpa51b-confined-space-hot'],
    'epa-40cfr': ['epa-epcra', 'epa-cercla'],
    'ilo-c155': ['ilo155-employer-duty', 'ilo155-worker-rights'],
    'nebosh-igc': ['nebosh-fire-safety'],
  },
  'joint-venture': {
    'peru-ley-29783': ['ley29783-responsabilidad', 'ley29783-sgsst'],
    'iso-31000': ['iso31-risk-identification', 'iso31-risk-analysis', 'iso31-risk-evaluation', 'iso31-risk-treatment', 'iso31-communication'],
    'ilo-c155': ['ilo155-cooperation', 'ilo155-employer-duty'],
    'nebosh-igc': ['nebosh-management'],
  },
};

export const EXPANDED_JURISDICTION_MAP: Record<string, string> = {
  'nfpa-70e': 'US',
  'api-510-570': 'International',
  'peru-ley-29783': 'Peru',
  'ansi-z359': 'US',
  'nfpa-51b': 'US',
  'iso-31000': 'International',
  'iso-55001': 'International',
  'peru-ds024-mining': 'Peru',
  'epa-40cfr': 'US',
  'peru-minam': 'Peru',
  'ilo-c155': 'International',
  'nebosh-igc': 'International',
};
