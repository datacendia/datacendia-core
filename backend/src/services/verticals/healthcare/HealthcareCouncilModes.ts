// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA HEALTHCARE COUNCIL MODES
 *
 * Specialized deliberation modes for the Healthcare Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Regulatory Frameworks: HIPAA, HITECH, FDA (SaMD), GDPR, NIST 800-53
 * Stark Law, AKS
 * Clinical Standards: HL7 FHIR, ICD-10, CPT, SNOMED CT
 */

// =============================================================================
// TYPES
// =============================================================================

export type HealthcareModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'clinical'        // Clinical decision modes
  | 'regulatory'      // Regulatory compliance modes
  | 'operations'      // Healthcare operations modes
  | 'samd'            // Software as Medical Device modes
  | 'specialized';    // Specialized healthcare modes

export interface HealthcareCouncilMode {
  id: string;
  name: string;
  category: HealthcareModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  regulatoryFrameworks: string[];
  clinicalValidationRequired: boolean;
  patientSafetyGate: boolean;
  hipaaReviewRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_HEALTHCARE_MODES: HealthcareCouncilMode[] = [
  {
    id: 'clinical-review-board',
    name: 'Clinical Review Board',
    category: 'major',
    purpose: 'Multi-disciplinary clinical case review for complex patients. Evidence-based treatment planning with human oversight.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'Complex cases, treatment plan disputes, multi-specialty coordination',
    defaultAgents: ['clinical-advisor', 'care-coordinator', 'quality-sentinel', 'capacity-oracle'],
    optionalAgents: ['pharmacy-specialist', 'case-manager', 'ethics-consultant'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['HIPAA', 'CMS Conditions of Participation', 'Joint Commission'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Patient safety first. Evidence-based recommendations. Human clinician makes final decision.',
    toneKeywords: ['clinical', 'evidence-based', 'patient-centered', 'safety-first'],
    outputFormat: ['case_summary', 'clinical_assessment', 'treatment_options', 'recommendation', 'human_review_required'],
  },
  {
    id: 'samd-approval-council',
    name: 'SaMD Approval Council',
    category: 'major',
    purpose: 'Software as Medical Device approval and classification. FDA pathway determination, clinical validation requirements.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'New SaMD development, feature changes, FDA submission prep',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator'],
    optionalAgents: ['regulatory-specialist', 'cybersecurity-analyst', 'validation-engineer'],
    maxDeliberationRounds: 12,
    regulatoryFrameworks: ['FDA 21 CFR 820', '21 CFR Part 11', 'IEC 62304', 'ISO 14971', 'EU MDR'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'FDA classification accurate. Clinical validation complete. Risk analysis documented.',
    toneKeywords: ['samd', 'fda-compliant', 'risk-analyzed', 'validated'],
    outputFormat: ['classification_analysis', 'regulatory_pathway', 'validation_requirements', 'risk_assessment', 'approval_decision'],
  },
  {
    id: 'patient-safety-council',
    name: 'Patient Safety Council',
    category: 'major',
    purpose: 'Adverse event analysis and root cause investigation. Sentinel event review, FMEA, corrective action.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Sentinel events, near misses, safety concerns, mortality reviews',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator'],
    optionalAgents: ['risk-manager', 'legal-counsel', 'patient-advocate'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['Joint Commission', 'CMS', 'State Reporting Requirements', 'AHRQ'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Root cause identified. Contributing factors analyzed. Corrective action prevents recurrence.',
    toneKeywords: ['safety', 'root-cause', 'non-punitive', 'improvement-focused'],
    outputFormat: ['event_summary', 'root_cause_analysis', 'contributing_factors', 'corrective_actions', 'monitoring_plan'],
  },
  {
    id: 'care-coordination-council',
    name: 'Care Coordination Council',
    category: 'major',
    purpose: 'Complex care transitions and multi-provider coordination. Discharge planning, care gaps, handoff safety.',
    leadAgent: 'care-coordinator',
    whenToUse: 'Complex discharges, care transitions, multi-provider cases',
    defaultAgents: ['care-coordinator', 'clinical-advisor', 'quality-sentinel', 'capacity-oracle'],
    optionalAgents: ['social-worker', 'case-manager', 'pharmacy-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['CMS Care Transitions', 'BPCI', 'ACO Quality Measures'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Safe transitions. No care gaps. Clear accountability at each handoff.',
    toneKeywords: ['coordination', 'transition-safe', 'gap-free', 'accountable'],
    outputFormat: ['care_plan', 'transition_checklist', 'provider_assignments', 'follow_up_schedule', 'patient_education'],
  },
  {
    id: 'ethics-consultation-council',
    name: 'Ethics Consultation Council',
    category: 'major',
    purpose: 'Clinical ethics consultation for difficult decisions. End-of-life, autonomy, resource allocation.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'End-of-life decisions, treatment refusal, capacity questions, resource allocation',
    defaultAgents: ['clinical-advisor', 'care-coordinator', 'quality-sentinel'],
    optionalAgents: ['ethics-consultant', 'chaplain', 'social-worker', 'legal-counsel'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['AMA Ethics', 'State Advance Directive Laws', 'HIPAA'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Patient autonomy respected. Ethical principles applied. Family and care team aligned.',
    toneKeywords: ['ethical', 'autonomy-respecting', 'principled', 'compassionate'],
    outputFormat: ['ethics_analysis', 'stakeholder_perspectives', 'options_analysis', 'recommendation', 'documentation'],
  },
];

// =============================================================================
// CLINICAL DECISION MODES
// =============================================================================

export const CLINICAL_MODES: HealthcareCouncilMode[] = [
  {
    id: 'diagnosis-support',
    name: 'Diagnosis Support',
    category: 'clinical',
    purpose: 'Differential diagnosis support with evidence ranking. Clinical decision support, not diagnosis.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'Complex presentations, rare conditions, second opinions',
    defaultAgents: ['clinical-advisor', 'care-coordinator'],
    optionalAgents: ['specialty-consultant'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FDA CDS Guidance', 'HIPAA', '21 CFR Part 11'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Support only. Clinician makes diagnosis. Evidence cited for each differential.',
    toneKeywords: ['diagnostic-support', 'evidence-ranked', 'clinician-decides', 'educational'],
    outputFormat: ['differential_list', 'evidence_summary', 'recommended_workup', 'clinical_pearls'],
  },
  {
    id: 'medication-review',
    name: 'Medication Review',
    category: 'clinical',
    purpose: 'Comprehensive medication review for polypharmacy, interactions, and optimization.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'Polypharmacy, new medications, adverse reactions, transitions of care',
    defaultAgents: ['clinical-advisor', 'care-coordinator', 'quality-sentinel'],
    optionalAgents: ['pharmacy-specialist', 'specialty-consultant'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FDA Drug Safety', 'CMS MTM', 'State Pharmacy Laws'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Interactions checked. Duplicates identified. Deprescribing opportunities flagged.',
    toneKeywords: ['medication-safety', 'interaction-aware', 'optimization', 'deprescribing'],
    outputFormat: ['medication_list', 'interaction_check', 'optimization_recommendations', 'patient_education'],
  },
  {
    id: 'treatment-planning',
    name: 'Treatment Planning',
    category: 'clinical',
    purpose: 'Evidence-based treatment planning with guideline integration and shared decision-making support.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'New diagnoses, treatment selection, guideline application',
    defaultAgents: ['clinical-advisor', 'care-coordinator', 'quality-sentinel'],
    optionalAgents: ['specialty-consultant', 'patient-navigator'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Clinical Practice Guidelines', 'CMS Quality Measures'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Guideline-concordant. Patient preferences incorporated. Shared decision documented.',
    toneKeywords: ['evidence-based', 'patient-centered', 'shared-decision', 'guideline-aware'],
    outputFormat: ['treatment_options', 'evidence_summary', 'patient_factors', 'shared_decision_aid', 'care_plan'],
  },
  {
    id: 'clinical-deterioration',
    name: 'Clinical Deterioration',
    category: 'clinical',
    purpose: 'Early warning system for clinical deterioration. Rapid response team support.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'Vital sign changes, early warning scores, clinical concern',
    defaultAgents: ['clinical-advisor', 'care-coordinator', 'quality-sentinel'],
    optionalAgents: ['icu-consultant', 'rapid-response-team'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['Joint Commission', 'CMS SEP-1', 'Rapid Response Requirements'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Rapid assessment. Escalation pathway clear. Time-critical actions identified.',
    toneKeywords: ['urgent', 'escalation', 'time-critical', 'action-oriented'],
    outputFormat: ['clinical_status', 'deterioration_indicators', 'immediate_actions', 'escalation_decision'],
  },
];

// =============================================================================
// REGULATORY COMPLIANCE MODES
// =============================================================================

export const REGULATORY_MODES: HealthcareCouncilMode[] = [
  {
    id: 'hipaa-review',
    name: 'HIPAA Review',
    category: 'regulatory',
    purpose: 'HIPAA compliance review for new initiatives, vendors, and incidents. Privacy and security assessment.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'New vendors, data sharing, breach assessment, audit prep',
    defaultAgents: ['quality-sentinel', 'care-coordinator'],
    optionalAgents: ['privacy-officer', 'security-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['HIPAA Privacy Rule', 'HIPAA Security Rule', 'HITECH', 'State Privacy Laws'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: true,
    primeDirective: 'Minimum necessary. BAA required. Security controls verified.',
    toneKeywords: ['hipaa', 'privacy', 'security', 'minimum-necessary'],
    outputFormat: ['compliance_assessment', 'risk_analysis', 'baa_requirements', 'remediation_plan'],
  },
  {
    id: 'stark-aks-review',
    name: 'Stark/AKS Review',
    category: 'regulatory',
    purpose: 'Stark Law and Anti-Kickback Statute compliance review. Physician compensation, referral arrangements.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Physician contracts, joint ventures, referral relationships',
    defaultAgents: ['quality-sentinel', 'clinical-advisor'],
    optionalAgents: ['legal-counsel', 'compliance-officer', 'valuation-specialist'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Stark Law', 'Anti-Kickback Statute', 'OIG Guidance', 'CMS Final Rules'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: false,
    primeDirective: 'FMV documented. Safe harbor identified. Referral intent analyzed.',
    toneKeywords: ['stark-compliant', 'aks-safe-harbor', 'fmv', 'referral-clean'],
    outputFormat: ['arrangement_analysis', 'safe_harbor_fit', 'fmv_assessment', 'risk_rating', 'documentation_requirements'],
  },
  {
    id: 'cms-audit-prep',
    name: 'CMS Audit Prep',
    category: 'regulatory',
    purpose: 'CMS audit preparation and response. RAC, MAC, ZPIC, UPIC readiness.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Audit notifications, post-pay review prep, self-audits',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator'],
    optionalAgents: ['coding-specialist', 'documentation-analyst', 'legal-counsel'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['CMS Program Integrity', 'RAC Program', 'OIG Work Plan'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: true,
    primeDirective: 'Documentation supports billing. Medical necessity clear. Audit trail complete.',
    toneKeywords: ['audit-ready', 'documentation-complete', 'medical-necessity', 'defensible'],
    outputFormat: ['audit_scope', 'documentation_review', 'risk_areas', 'response_strategy', 'remediation_plan'],
  },
  {
    id: 'fda-submission-review',
    name: 'FDA Submission Review',
    category: 'regulatory',
    purpose: 'FDA submission preparation and review. 510(k), De Novo, PMA pathway support.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Medical device submissions, software changes, post-market requirements',
    defaultAgents: ['quality-sentinel', 'clinical-advisor'],
    optionalAgents: ['regulatory-specialist', 'clinical-evidence-specialist', 'quality-engineer'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['FDA 21 CFR 807', '21 CFR 814', 'FDA Guidance Documents', 'MDCG Guidance'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Predicate identified. Substantial equivalence demonstrated. Clinical evidence sufficient.',
    toneKeywords: ['fda-ready', 'predicate-matched', 'evidence-complete', 'pathway-clear'],
    outputFormat: ['pathway_determination', 'predicate_analysis', 'clinical_evidence_summary', 'submission_checklist'],
  },
  {
    id: 'consent-review',
    name: 'Consent Review',
    category: 'regulatory',
    purpose: 'Informed consent process review. Research consent, treatment consent, AI disclosure.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'New consent forms, AI-assisted care disclosure, research protocols',
    defaultAgents: ['clinical-advisor', 'quality-sentinel', 'care-coordinator'],
    optionalAgents: ['irb-specialist', 'legal-counsel', 'patient-advocate'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['Common Rule', 'FDA ICH-GCP', 'State Consent Laws', 'AI Disclosure Requirements'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Risks disclosed. AI involvement clear. Patient understanding verified.',
    toneKeywords: ['informed-consent', 'transparent', 'patient-understanding', 'ai-disclosed'],
    outputFormat: ['consent_analysis', 'disclosure_requirements', 'readability_assessment', 'approval_decision'],
  },
];

// =============================================================================
// OPERATIONS MODES
// =============================================================================

export const OPERATIONS_MODES: HealthcareCouncilMode[] = [
  {
    id: 'capacity-management',
    name: 'Capacity Management',
    category: 'operations',
    purpose: 'Real-time capacity management and patient flow optimization. Surge planning, bottleneck resolution.',
    leadAgent: 'capacity-oracle',
    whenToUse: 'High census, surge conditions, discharge delays, ED boarding',
    defaultAgents: ['capacity-oracle', 'care-coordinator', 'clinical-advisor'],
    optionalAgents: ['house-supervisor', 'environmental-services', 'transport-coordinator'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['CMS CoPs', 'EMTALA', 'State Licensing'],
    clinicalValidationRequired: false,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Patient flow optimized. Safety maintained. Bottlenecks resolved.',
    toneKeywords: ['flow', 'capacity', 'throughput', 'real-time'],
    outputFormat: ['capacity_status', 'bottleneck_analysis', 'action_plan', 'surge_protocol_status'],
  },
  {
    id: 'staffing-review',
    name: 'Staffing Review',
    category: 'operations',
    purpose: 'Staffing adequacy assessment and optimization. Skill mix, ratios, fatigue management.',
    leadAgent: 'capacity-oracle',
    whenToUse: 'Staffing shortages, high acuity, scheduling decisions',
    defaultAgents: ['capacity-oracle', 'quality-sentinel', 'care-coordinator'],
    optionalAgents: ['nurse-manager', 'hr-specialist'],
    maxDeliberationRounds: 4,
    regulatoryFrameworks: ['State Staffing Ratios', 'CMS CoPs', 'Joint Commission'],
    clinicalValidationRequired: false,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Safe ratios maintained. Skill mix appropriate. Fatigue managed.',
    toneKeywords: ['staffing', 'ratios', 'skill-mix', 'safety'],
    outputFormat: ['staffing_analysis', 'ratio_compliance', 'recommendations', 'contingency_plan'],
  },
  {
    id: 'quality-metrics-review',
    name: 'Quality Metrics Review',
    category: 'operations',
    purpose: 'Quality measure performance review and improvement planning. CMS quality, value-based care.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Quarterly quality reviews, measure performance issues, accreditation prep',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator', 'capacity-oracle'],
    optionalAgents: ['data-analyst', 'quality-improvement-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['CMS Quality Programs', 'HEDIS', 'Leapfrog', 'Joint Commission'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: false,
    primeDirective: 'Performance measured. Gaps identified. Improvement actions prioritized.',
    toneKeywords: ['quality', 'measurement', 'improvement', 'benchmarked'],
    outputFormat: ['performance_dashboard', 'gap_analysis', 'improvement_priorities', 'action_plan'],
  },
  {
    id: 'revenue-cycle-council',
    name: 'Revenue Cycle Council',
    category: 'operations',
    purpose: 'Revenue cycle optimization with compliance focus. Denials management, coding accuracy.',
    leadAgent: 'capacity-oracle',
    whenToUse: 'Denial trends, coding issues, revenue leakage, payer disputes',
    defaultAgents: ['capacity-oracle', 'quality-sentinel', 'care-coordinator'],
    optionalAgents: ['coding-specialist', 'billing-analyst', 'payer-relations'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['False Claims Act', 'CMS Billing Rules', 'OIG Compliance'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: true,
    primeDirective: 'Accurate coding. Compliant billing. Denials prevented.',
    toneKeywords: ['revenue-cycle', 'compliant', 'denial-prevention', 'accurate'],
    outputFormat: ['denial_analysis', 'root_causes', 'improvement_actions', 'compliance_check'],
  },
];

// =============================================================================
// SOFTWARE AS MEDICAL DEVICE MODES
// =============================================================================

export const SAMD_MODES: HealthcareCouncilMode[] = [
  {
    id: 'algorithm-validation',
    name: 'Algorithm Validation',
    category: 'samd',
    purpose: 'Clinical algorithm validation for SaMD. Performance metrics, bias testing, clinical relevance.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'New algorithms, algorithm updates, validation studies',
    defaultAgents: ['quality-sentinel', 'clinical-advisor'],
    optionalAgents: ['data-scientist', 'biostatistician', 'clinical-investigator'],
    maxDeliberationRounds: 10,
    regulatoryFrameworks: ['FDA AI/ML Guidance', 'IMDRF SaMD', 'Good Machine Learning Practice'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Performance validated. Bias tested. Clinical utility demonstrated.',
    toneKeywords: ['validation', 'bias-tested', 'clinically-relevant', 'performance-proven'],
    outputFormat: ['validation_results', 'performance_metrics', 'bias_assessment', 'clinical_utility_evidence'],
  },
  {
    id: 'change-impact-review',
    name: 'Change Impact Review',
    category: 'samd',
    purpose: 'SaMD change impact assessment. Regulatory pathway for modifications.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Software updates, algorithm changes, intended use changes',
    defaultAgents: ['quality-sentinel', 'clinical-advisor'],
    optionalAgents: ['regulatory-specialist', 'software-engineer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FDA PCCP', '21 CFR 820', 'IEC 62304'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Change classified. Regulatory path determined. Validation scope defined.',
    toneKeywords: ['change-control', 'impact-assessed', 'pathway-clear', 'validation-scoped'],
    outputFormat: ['change_description', 'impact_assessment', 'regulatory_pathway', 'validation_requirements'],
  },
  {
    id: 'post-market-surveillance',
    name: 'Post-Market Surveillance',
    category: 'samd',
    purpose: 'Post-market surveillance and real-world performance monitoring. Adverse events, performance drift.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Ongoing monitoring, adverse events, performance alerts',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator'],
    optionalAgents: ['regulatory-specialist', 'data-analyst'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FDA MDR', '21 CFR 803', 'EU MDR PMS', 'IMDRF'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Performance monitored. Adverse events reported. Drift detected early.',
    toneKeywords: ['post-market', 'surveillance', 'adverse-event', 'drift-detection'],
    outputFormat: ['performance_report', 'adverse_event_summary', 'trend_analysis', 'action_recommendations'],
  },
  {
    id: 'human-factors-review',
    name: 'Human Factors Review',
    category: 'samd',
    purpose: 'Human factors and usability assessment. Use error analysis, clinician workflow integration.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'New interfaces, workflow changes, use error events',
    defaultAgents: ['clinical-advisor', 'quality-sentinel', 'care-coordinator'],
    optionalAgents: ['usability-specialist', 'human-factors-engineer'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['FDA Human Factors Guidance', 'IEC 62366', 'ANSI/AAMI HE75'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Use errors prevented. Workflow integrated. Clinician burden minimized.',
    toneKeywords: ['usability', 'human-factors', 'use-error-prevention', 'workflow-integrated'],
    outputFormat: ['usability_assessment', 'use_error_analysis', 'workflow_impact', 'design_recommendations'],
  },
];

// =============================================================================
// SPECIALIZED HEALTHCARE MODES
// =============================================================================

export const SPECIALIZED_HEALTHCARE_MODES: HealthcareCouncilMode[] = [
  {
    id: 'telehealth-review',
    name: 'Telehealth Review',
    category: 'specialized',
    purpose: 'Telehealth program compliance and quality. Licensure, prescribing, technology requirements.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Telehealth expansion, new modalities, compliance reviews',
    defaultAgents: ['quality-sentinel', 'clinical-advisor', 'care-coordinator'],
    optionalAgents: ['legal-counsel', 'technology-specialist'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['State Telehealth Laws', 'Ryan Haight Act', 'CMS Telehealth Waivers', 'Interstate Licensure'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Licensure compliant. Prescribing rules followed. Technology secure.',
    toneKeywords: ['telehealth', 'licensure', 'prescribing-compliant', 'technology-enabled'],
    outputFormat: ['compliance_assessment', 'licensure_review', 'technology_requirements', 'recommendations'],
  },
  {
    id: 'clinical-trial-review',
    name: 'Clinical Trial Review',
    category: 'specialized',
    purpose: 'Clinical trial protocol review and participant safety. IRB support, GCP compliance.',
    leadAgent: 'clinical-advisor',
    whenToUse: 'Protocol review, safety monitoring, deviation review',
    defaultAgents: ['clinical-advisor', 'quality-sentinel', 'care-coordinator'],
    optionalAgents: ['irb-specialist', 'research-coordinator', 'biostatistician'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['Common Rule', 'ICH-GCP', 'FDA IND/IDE', '21 CFR 50/56'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Participant safety paramount. GCP followed. Scientific integrity maintained.',
    toneKeywords: ['research', 'participant-safety', 'gcp-compliant', 'scientific-integrity'],
    outputFormat: ['protocol_assessment', 'safety_review', 'consent_analysis', 'recommendations'],
  },
  {
    id: 'population-health-council',
    name: 'Population Health Council',
    category: 'specialized',
    purpose: 'Population health management strategy. Risk stratification, care gaps, value-based care.',
    leadAgent: 'care-coordinator',
    whenToUse: 'Population health programs, ACO strategy, risk stratification',
    defaultAgents: ['care-coordinator', 'clinical-advisor', 'quality-sentinel', 'capacity-oracle'],
    optionalAgents: ['data-analyst', 'community-health-worker', 'social-worker'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['ACO Quality Measures', 'HEDIS', 'CMS Stars'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: true,
    primeDirective: 'High-risk patients identified. Care gaps closed. Value demonstrated.',
    toneKeywords: ['population-health', 'risk-stratified', 'value-based', 'proactive'],
    outputFormat: ['population_analysis', 'risk_stratification', 'care_gap_summary', 'intervention_plan'],
  },
  {
    id: 'behavioral-health-integration',
    name: 'Behavioral Health Integration',
    category: 'specialized',
    purpose: 'Behavioral health integration review. Collaborative care, screening, referral pathways.',
    leadAgent: 'care-coordinator',
    whenToUse: 'BH integration programs, screening protocols, referral optimization',
    defaultAgents: ['care-coordinator', 'clinical-advisor', 'quality-sentinel'],
    optionalAgents: ['behavioral-health-specialist', 'psychiatry-consultant'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['CoCM Requirements', 'Mental Health Parity', 'State BH Laws'],
    clinicalValidationRequired: true,
    patientSafetyGate: true,
    hipaaReviewRequired: true,
    primeDirective: 'Screening standardized. Integration seamless. Parity maintained.',
    toneKeywords: ['integrated-care', 'screening', 'collaborative', 'parity-compliant'],
    outputFormat: ['integration_assessment', 'workflow_analysis', 'referral_pathways', 'recommendations'],
  },
  {
    id: 'emergency-preparedness',
    name: 'Emergency Preparedness',
    category: 'specialized',
    purpose: 'Emergency preparedness and response planning. Mass casualty, pandemic, disaster response.',
    leadAgent: 'capacity-oracle',
    whenToUse: 'Emergency planning, drills, actual emergencies',
    defaultAgents: ['capacity-oracle', 'clinical-advisor', 'care-coordinator', 'quality-sentinel'],
    optionalAgents: ['emergency-management', 'logistics-coordinator', 'communications-lead'],
    maxDeliberationRounds: 6,
    regulatoryFrameworks: ['CMS Emergency Preparedness', 'Joint Commission EM', 'State Emergency Laws'],
    clinicalValidationRequired: false,
    patientSafetyGate: true,
    hipaaReviewRequired: false,
    primeDirective: 'Preparedness verified. Response coordinated. Continuity assured.',
    toneKeywords: ['preparedness', 'response', 'continuity', 'coordinated'],
    outputFormat: ['preparedness_status', 'response_plan', 'resource_assessment', 'communication_plan'],
  },
  {
    id: 'health-equity-review',
    name: 'Health Equity Review',
    category: 'specialized',
    purpose: 'Health equity analysis and disparity reduction. SDOH integration, equity metrics.',
    leadAgent: 'quality-sentinel',
    whenToUse: 'Equity assessments, disparity analysis, program design',
    defaultAgents: ['quality-sentinel', 'care-coordinator', 'clinical-advisor'],
    optionalAgents: ['community-health-specialist', 'data-analyst', 'social-worker'],
    maxDeliberationRounds: 8,
    regulatoryFrameworks: ['CMS Health Equity', 'Joint Commission Health Equity', 'ACA 1557'],
    clinicalValidationRequired: false,
    patientSafetyGate: false,
    hipaaReviewRequired: true,
    primeDirective: 'Disparities measured. SDOH addressed. Equity advanced.',
    toneKeywords: ['equity', 'disparity-reduction', 'sdoh', 'community-focused'],
    outputFormat: ['equity_analysis', 'disparity_metrics', 'sdoh_assessment', 'intervention_plan'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_HEALTHCARE_MODES: HealthcareCouncilMode[] = [
  ...MAJOR_HEALTHCARE_MODES,
  ...CLINICAL_MODES,
  ...REGULATORY_MODES,
  ...OPERATIONS_MODES,
  ...SAMD_MODES,
  ...SPECIALIZED_HEALTHCARE_MODES,
];

export const HEALTHCARE_MODE_MAP: Map<string, HealthcareCouncilMode> = new Map(
  ALL_HEALTHCARE_MODES.map(mode => [mode.id, mode])
);

/**
 * Get a healthcare mode by ID
 */
export function getHealthcareMode(modeId: string): HealthcareCouncilMode | undefined {
  return HEALTHCARE_MODE_MAP.get(modeId);
}

/**
 * Get all healthcare modes by category
 */
export function getHealthcareModesByCategory(category: HealthcareModeCategory): HealthcareCouncilMode[] {
  return ALL_HEALTHCARE_MODES.filter(mode => mode.category === category);
}

/**
 * Get all healthcare modes requiring patient safety gate
 */
export function getPatientSafetyModes(): HealthcareCouncilMode[] {
  return ALL_HEALTHCARE_MODES.filter(mode => mode.patientSafetyGate);
}

/**
 * Get all healthcare modes requiring clinical validation
 */
export function getClinicalValidationModes(): HealthcareCouncilMode[] {
  return ALL_HEALTHCARE_MODES.filter(mode => mode.clinicalValidationRequired);
}

/**
 * Get healthcare modes by regulatory framework
 */
export function getHealthcareModesByFramework(framework: string): HealthcareCouncilMode[] {
  return ALL_HEALTHCARE_MODES.filter(mode => 
    mode.regulatoryFrameworks.some(f => f.toLowerCase().includes(framework.toLowerCase()))
  );
}

/**
 * Get healthcare modes by lead agent
 */
export function getHealthcareModesByLeadAgent(leadAgent: string): HealthcareCouncilMode[] {
  return ALL_HEALTHCARE_MODES.filter(mode => mode.leadAgent === leadAgent);
}

// Summary stats
export const HEALTHCARE_MODES_SUMMARY = {
  totalModes: ALL_HEALTHCARE_MODES.length,
  majorModes: MAJOR_HEALTHCARE_MODES.length,
  clinicalModes: CLINICAL_MODES.length,
  regulatoryModes: REGULATORY_MODES.length,
  operationsModes: OPERATIONS_MODES.length,
  samdModes: SAMD_MODES.length,
  specializedModes: SPECIALIZED_HEALTHCARE_MODES.length,
  patientSafetyModes: ALL_HEALTHCARE_MODES.filter(m => m.patientSafetyGate).length,
  clinicalValidationModes: ALL_HEALTHCARE_MODES.filter(m => m.clinicalValidationRequired).length,
};
