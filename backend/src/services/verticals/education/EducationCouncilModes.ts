// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA EDUCATION COUNCIL MODES
 *
 * Specialized deliberation modes for the Education Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Standards: FERPA, Title IX, ADA, Accreditation Standards, Title IV
 */

export type EducationModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'academic'        // Academic decisions
  | 'student'         // Student affairs
  | 'compliance'      // Regulatory compliance
  | 'enrollment'      // Enrollment management
  | 'specialized';    // Specialized education modes

export interface EducationCouncilMode {
  id: string;
  name: string;
  category: EducationModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  standards: string[];
  equityGate: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_EDUCATION_MODES: EducationCouncilMode[] = [
  {
    id: 'academic-policy-council',
    name: 'Academic Policy Council',
    category: 'major',
    purpose: 'Major academic policy decisions. Grading policies, academic standing, degree requirements.',
    leadAgent: 'academic-dean',
    whenToUse: 'New academic policies, policy changes, academic standards decisions',
    defaultAgents: ['academic-dean', 'registrar', 'faculty-representative', 'compliance-officer'],
    optionalAgents: ['assessment-director', 'student-affairs-dean'],
    maxDeliberationRounds: 10,
    standards: ['Accreditation Standards', 'Academic Policies', 'Faculty Handbook'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Set policies that uphold academic standards while supporting student success.',
    toneKeywords: ['rigorous', 'fair', 'student-centered', 'evidence-based'],
    outputFormat: ['policy_proposal', 'impact_analysis', 'equity_review', 'implementation_plan'],
  },
  {
    id: 'accreditation-council',
    name: 'Accreditation Council',
    category: 'major',
    purpose: 'Accreditation preparation and response. Self-study, evidence compilation, continuous improvement.',
    leadAgent: 'assessment-director',
    whenToUse: 'Accreditation visits, self-study preparation, response to findings',
    defaultAgents: ['assessment-director', 'academic-dean', 'compliance-officer', 'institutional-research-director'],
    optionalAgents: ['registrar', 'financial-aid-director'],
    maxDeliberationRounds: 10,
    standards: ['Regional Accreditation', 'Programmatic Accreditation'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Demonstrate quality and improvement through evidence.',
    toneKeywords: ['evidence-based', 'improvement-focused', 'transparent', 'compliant'],
    outputFormat: ['self_study_section', 'evidence_inventory', 'improvement_plan', 'response_draft'],
  },
  {
    id: 'student-conduct-council',
    name: 'Student Conduct Council',
    category: 'major',
    purpose: 'Serious student conduct matters. Academic integrity, behavioral violations, sanctions.',
    leadAgent: 'student-affairs-dean',
    whenToUse: 'Serious conduct violations, appeals, suspension/expulsion considerations',
    defaultAgents: ['student-affairs-dean', 'compliance-officer', 'legal-counsel', 'faculty-representative'],
    optionalAgents: ['diversity-officer', 'disability-services-director'],
    maxDeliberationRounds: 8,
    standards: ['Student Code of Conduct', 'Due Process', 'Title IX'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Fair process. Educational sanctions. Protect all students.',
    toneKeywords: ['fair', 'educational', 'consistent', 'due-process'],
    outputFormat: ['finding_of_fact', 'policy_violations', 'sanction_recommendation', 'appeal_rights'],
  },
  {
    id: 'title-ix-council',
    name: 'Title IX Council',
    category: 'major',
    purpose: 'Title IX case review and institutional response. Investigations, remedies, prevention.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Title IX complaints, investigations, institutional response planning',
    defaultAgents: ['compliance-officer', 'student-affairs-dean', 'legal-counsel', 'diversity-officer'],
    optionalAgents: ['academic-dean', 'faculty-representative'],
    maxDeliberationRounds: 10,
    standards: ['Title IX', 'Dear Colleague Letters', 'Final Rule'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Prompt, fair, and equitable response. Support all parties.',
    toneKeywords: ['equitable', 'thorough', 'supportive', 'compliant'],
    outputFormat: ['investigation_plan', 'interim_measures', 'finding_report', 'remedies'],
  },
];

// =============================================================================
// ACADEMIC MODES
// =============================================================================

export const ACADEMIC_MODES: EducationCouncilMode[] = [
  {
    id: 'curriculum-review-council',
    name: 'Curriculum Review Council',
    category: 'academic',
    purpose: 'New program and curriculum approval. Course changes, program modifications, learning outcomes.',
    leadAgent: 'academic-dean',
    whenToUse: 'New programs, curriculum changes, course approvals',
    defaultAgents: ['academic-dean', 'faculty-representative', 'assessment-director', 'registrar'],
    optionalAgents: ['online-learning-director', 'career-services-director'],
    maxDeliberationRounds: 8,
    standards: ['Curriculum Approval Process', 'Accreditation Requirements'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Ensure curricula meet student needs and academic standards.',
    toneKeywords: ['rigorous', 'relevant', 'outcome-focused', 'accessible'],
    outputFormat: ['curriculum_proposal', 'learning_outcomes', 'resource_requirements', 'approval_recommendation'],
  },
  {
    id: 'grade-appeal-council',
    name: 'Grade Appeal Council',
    category: 'academic',
    purpose: 'Student grade appeals and academic grievances. Fair review, policy application.',
    leadAgent: 'academic-dean',
    whenToUse: 'Grade appeals, academic grievances, grading disputes',
    defaultAgents: ['academic-dean', 'faculty-representative', 'registrar'],
    optionalAgents: ['compliance-officer', 'student-affairs-dean'],
    maxDeliberationRounds: 5,
    standards: ['Academic Grievance Policy', 'Grading Policy'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Fair process. Policy adherence. Student and faculty rights.',
    toneKeywords: ['fair', 'policy-based', 'transparent', 'timely'],
    outputFormat: ['appeal_review', 'policy_analysis', 'finding', 'resolution'],
  },
  {
    id: 'faculty-evaluation-council',
    name: 'Faculty Evaluation Council',
    category: 'academic',
    purpose: 'Faculty performance review and development. Teaching effectiveness, scholarly work.',
    leadAgent: 'academic-dean',
    whenToUse: 'Annual reviews, tenure decisions, promotion considerations',
    defaultAgents: ['academic-dean', 'faculty-representative', 'assessment-director'],
    optionalAgents: ['diversity-officer', 'online-learning-director'],
    maxDeliberationRounds: 8,
    standards: ['Faculty Handbook', 'Tenure and Promotion Policies'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Fair evaluation. Development support. Academic excellence.',
    toneKeywords: ['fair', 'developmental', 'evidence-based', 'supportive'],
    outputFormat: ['evaluation_summary', 'strengths_areas', 'development_plan', 'recommendation'],
  },
];

// =============================================================================
// STUDENT MODES
// =============================================================================

export const STUDENT_MODES: EducationCouncilMode[] = [
  {
    id: 'academic-standing-council',
    name: 'Academic Standing Council',
    category: 'student',
    purpose: 'Academic standing decisions. Probation, suspension, reinstatement, appeals.',
    leadAgent: 'registrar',
    whenToUse: 'End of term standing review, reinstatement requests, standing appeals',
    defaultAgents: ['registrar', 'academic-dean', 'student-affairs-dean', 'financial-aid-director'],
    optionalAgents: ['diversity-officer', 'disability-services-director'],
    maxDeliberationRounds: 6,
    standards: ['Academic Standing Policy', 'Satisfactory Academic Progress'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Apply standards fairly. Support student success. Consider circumstances.',
    toneKeywords: ['fair', 'supportive', 'consistent', 'developmental'],
    outputFormat: ['standing_determination', 'circumstances_review', 'intervention_plan', 'communication'],
  },
  {
    id: 'accommodation-review-council',
    name: 'Accommodation Review Council',
    category: 'student',
    purpose: 'Disability accommodation decisions. Reasonable accommodations, interactive process.',
    leadAgent: 'disability-services-director',
    whenToUse: 'Complex accommodation requests, appeals, interactive process resolution',
    defaultAgents: ['disability-services-director', 'compliance-officer', 'academic-dean'],
    optionalAgents: ['faculty-representative', 'legal-counsel'],
    maxDeliberationRounds: 6,
    standards: ['ADA', 'Section 504', 'Accommodation Policy'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Equal access. Reasonable accommodations. Interactive process.',
    toneKeywords: ['accessible', 'reasonable', 'interactive', 'documented'],
    outputFormat: ['accommodation_analysis', 'interactive_process', 'determination', 'implementation'],
  },
  {
    id: 'student-success-council',
    name: 'Student Success Council',
    category: 'student',
    purpose: 'At-risk student intervention. Early alerts, retention strategies, holistic support.',
    leadAgent: 'student-affairs-dean',
    whenToUse: 'At-risk student identification, intervention planning, retention initiatives',
    defaultAgents: ['student-affairs-dean', 'academic-dean', 'financial-aid-director', 'career-services-director'],
    optionalAgents: ['diversity-officer', 'institutional-research-director'],
    maxDeliberationRounds: 5,
    standards: ['Student Success Framework', 'Retention Best Practices'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Early identification. Holistic support. Remove barriers.',
    toneKeywords: ['proactive', 'supportive', 'holistic', 'barrier-removing'],
    outputFormat: ['risk_assessment', 'intervention_plan', 'resource_connections', 'follow_up'],
  },
];

// =============================================================================
// COMPLIANCE MODES
// =============================================================================

export const COMPLIANCE_EDUCATION_MODES: EducationCouncilMode[] = [
  {
    id: 'ferpa-review-council',
    name: 'FERPA Review Council',
    category: 'compliance',
    purpose: 'FERPA compliance decisions. Record access, disclosure, directory information.',
    leadAgent: 'registrar',
    whenToUse: 'Record requests, disclosure decisions, policy interpretation',
    defaultAgents: ['registrar', 'compliance-officer', 'legal-counsel'],
    optionalAgents: ['student-affairs-dean'],
    maxDeliberationRounds: 5,
    standards: ['FERPA', 'State Privacy Laws'],
    equityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Protect student privacy. Comply with FERPA. Document decisions.',
    toneKeywords: ['private', 'compliant', 'documented', 'protective'],
    outputFormat: ['privacy_analysis', 'disclosure_determination', 'documentation', 'communication'],
  },
  {
    id: 'title-iv-compliance-council',
    name: 'Title IV Compliance Council',
    category: 'compliance',
    purpose: 'Federal financial aid compliance. Program integrity, SAP, R2T4 calculations.',
    leadAgent: 'financial-aid-director',
    whenToUse: 'Compliance reviews, audit findings, policy changes, SAP appeals',
    defaultAgents: ['financial-aid-director', 'compliance-officer', 'registrar'],
    optionalAgents: ['legal-counsel', 'institutional-research-director'],
    maxDeliberationRounds: 8,
    standards: ['Title IV', 'Program Integrity Rules', 'SAP Requirements'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Maintain compliance. Protect student access. Document thoroughly.',
    toneKeywords: ['compliant', 'documented', 'accessible', 'accurate'],
    outputFormat: ['compliance_review', 'finding_response', 'policy_update', 'training_plan'],
  },
  {
    id: 'clery-compliance-council',
    name: 'Clery Compliance Council',
    category: 'compliance',
    purpose: 'Clery Act compliance. Crime reporting, timely warnings, annual security report.',
    leadAgent: 'compliance-officer',
    whenToUse: 'Clery reporting, timely warning decisions, ASR preparation',
    defaultAgents: ['compliance-officer', 'student-affairs-dean', 'legal-counsel'],
    optionalAgents: ['diversity-officer'],
    maxDeliberationRounds: 5,
    standards: ['Clery Act', 'VAWA', 'Campus Security'],
    equityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Accurate reporting. Timely warnings. Campus safety.',
    toneKeywords: ['accurate', 'timely', 'transparent', 'safety-focused'],
    outputFormat: ['incident_classification', 'warning_decision', 'reporting', 'asr_content'],
  },
];

// =============================================================================
// ENROLLMENT MODES
// =============================================================================

export const ENROLLMENT_MODES: EducationCouncilMode[] = [
  {
    id: 'admissions-review-council',
    name: 'Admissions Review Council',
    category: 'enrollment',
    purpose: 'Holistic admissions review. Applicant evaluation, admit decisions, waitlist management.',
    leadAgent: 'admissions-director',
    whenToUse: 'Admissions decisions, borderline cases, appeals, waitlist management',
    defaultAgents: ['admissions-director', 'academic-dean', 'financial-aid-director'],
    optionalAgents: ['diversity-officer', 'institutional-research-director'],
    maxDeliberationRounds: 6,
    standards: ['Admissions Policy', 'Holistic Review', 'Non-Discrimination'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Fair, holistic review. Mission-aligned decisions. Diverse class.',
    toneKeywords: ['holistic', 'fair', 'mission-aligned', 'diverse'],
    outputFormat: ['applicant_review', 'decision_rationale', 'admit_recommendation', 'financial_aid_coordination'],
  },
  {
    id: 'enrollment-strategy-council',
    name: 'Enrollment Strategy Council',
    category: 'enrollment',
    purpose: 'Enrollment planning and strategy. Targets, recruitment, yield strategies.',
    leadAgent: 'admissions-director',
    whenToUse: 'Enrollment planning, strategy development, mid-cycle adjustments',
    defaultAgents: ['admissions-director', 'financial-aid-director', 'marketing-director', 'institutional-research-director'],
    optionalAgents: ['academic-dean', 'diversity-officer'],
    maxDeliberationRounds: 6,
    standards: ['Enrollment Management Best Practices'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Meet enrollment goals while building diverse, qualified classes.',
    toneKeywords: ['strategic', 'data-informed', 'mission-aligned', 'equitable'],
    outputFormat: ['enrollment_forecast', 'strategy_plan', 'resource_allocation', 'metrics_dashboard'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_EDUCATION_MODES: EducationCouncilMode[] = [
  {
    id: 'equity-review-council',
    name: 'Equity Review Council',
    category: 'specialized',
    purpose: 'Equity analysis and intervention. Achievement gaps, access barriers, inclusive practices.',
    leadAgent: 'diversity-officer',
    whenToUse: 'Equity audits, gap analysis, intervention planning, policy equity review',
    defaultAgents: ['diversity-officer', 'institutional-research-director', 'student-affairs-dean', 'academic-dean'],
    optionalAgents: ['disability-services-director', 'financial-aid-director'],
    maxDeliberationRounds: 8,
    standards: ['Equity Frameworks', 'Civil Rights', 'Inclusive Excellence'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Identify gaps. Remove barriers. Advance equity.',
    toneKeywords: ['equity-centered', 'data-driven', 'action-oriented', 'inclusive'],
    outputFormat: ['equity_analysis', 'gap_identification', 'barrier_assessment', 'intervention_plan'],
  },
  {
    id: 'learning-assessment-council',
    name: 'Learning Assessment Council',
    category: 'specialized',
    purpose: 'Learning outcomes assessment and improvement. Program review, assessment results, improvement actions.',
    leadAgent: 'assessment-director',
    whenToUse: 'Assessment cycles, program review, improvement planning',
    defaultAgents: ['assessment-director', 'academic-dean', 'faculty-representative'],
    optionalAgents: ['institutional-research-director', 'online-learning-director'],
    maxDeliberationRounds: 6,
    standards: ['Assessment Best Practices', 'Accreditation Standards'],
    equityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Assess for improvement. Close the loop. Demonstrate learning.',
    toneKeywords: ['outcome-focused', 'improvement-driven', 'evidence-based', 'transparent'],
    outputFormat: ['assessment_results', 'gap_analysis', 'improvement_actions', 'closing_the_loop'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_EDUCATION_MODES: EducationCouncilMode[] = [
  ...MAJOR_EDUCATION_MODES,
  ...ACADEMIC_MODES,
  ...STUDENT_MODES,
  ...COMPLIANCE_EDUCATION_MODES,
  ...ENROLLMENT_MODES,
  ...SPECIALIZED_EDUCATION_MODES,
];

export const EDUCATION_MODE_MAP: Map<string, EducationCouncilMode> = new Map(
  ALL_EDUCATION_MODES.map(mode => [mode.id, mode])
);

export function getEducationMode(modeId: string): EducationCouncilMode | undefined {
  return EDUCATION_MODE_MAP.get(modeId);
}

export function getEducationModesByCategory(category: EducationModeCategory): EducationCouncilMode[] {
  return ALL_EDUCATION_MODES.filter(mode => mode.category === category);
}

export const EDUCATION_MODE_STATS = {
  total: ALL_EDUCATION_MODES.length,
  byCategory: {
    major: MAJOR_EDUCATION_MODES.length,
    academic: ACADEMIC_MODES.length,
    student: STUDENT_MODES.length,
    compliance: COMPLIANCE_EDUCATION_MODES.length,
    enrollment: ENROLLMENT_MODES.length,
    specialized: SPECIALIZED_EDUCATION_MODES.length,
  },
};
