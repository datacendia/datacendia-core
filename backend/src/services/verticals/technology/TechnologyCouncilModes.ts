// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA TECHNOLOGY/SAAS COUNCIL MODES
 *
 * Specialized deliberation modes for the Technology/SaaS Vertical
 * Each mode configures agent behavior, lead agent, and deliberation parameters
 *
 * Standards: SOC 2, ISO 27001, GDPR, SRE Practices, SDLC
 */

export type TechnologyModeCategory = 
  | 'major'           // Major Council/War Room modes
  | 'architecture'    // Architecture decisions
  | 'delivery'        // Development and delivery
  | 'security'        // Security and compliance
  | 'operations'      // Operations and reliability
  | 'specialized';    // Specialized tech modes

export interface TechnologyCouncilMode {
  id: string;
  name: string;
  category: TechnologyModeCategory;
  purpose: string;
  leadAgent: string;
  whenToUse: string;
  defaultAgents: string[];
  optionalAgents: string[];
  maxDeliberationRounds: number;
  standards: string[];
  securityGate: boolean;
  auditTrailRequired: boolean;
  primeDirective: string;
  toneKeywords: string[];
  outputFormat: string[];
}

// =============================================================================
// MAJOR COUNCIL/WAR ROOM MODES
// =============================================================================

export const MAJOR_TECHNOLOGY_MODES: TechnologyCouncilMode[] = [
  {
    id: 'incident-war-room',
    name: 'Incident War Room',
    category: 'major',
    purpose: 'Critical production incident response and coordination. P1/P2 incidents, customer impact, recovery.',
    leadAgent: 'sre-lead',
    whenToUse: 'Production outages, P1/P2 incidents, security breaches, data loss',
    defaultAgents: ['sre-lead', 'devops-engineer', 'engineering-manager', 'security-engineer'],
    optionalAgents: ['architect', 'data-engineer'],
    maxDeliberationRounds: 6,
    standards: ['SRE Practices', 'Incident Management', 'PagerDuty'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Restore service. Communicate status. Learn from incidents.',
    toneKeywords: ['urgent', 'coordinated', 'transparent', 'recovery-focused'],
    outputFormat: ['incident_status', 'impact_assessment', 'recovery_actions', 'communication_updates'],
  },
  {
    id: 'architecture-review-board',
    name: 'Architecture Review Board',
    category: 'major',
    purpose: 'Major architectural decisions and technical direction. System design, technology selection, standards.',
    leadAgent: 'architect',
    whenToUse: 'New systems, major refactoring, technology adoption, architectural standards',
    defaultAgents: ['architect', 'cto', 'security-engineer', 'devops-engineer'],
    optionalAgents: ['platform-architect', 'data-engineer', 'ml-engineer'],
    maxDeliberationRounds: 10,
    standards: ['Architecture Decision Records', 'Technical Design Documents'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Make decisions that balance short-term needs with long-term sustainability.',
    toneKeywords: ['strategic', 'documented', 'trade-offs', 'sustainable'],
    outputFormat: ['adr_document', 'design_review', 'trade_off_analysis', 'decision_rationale'],
  },
  {
    id: 'security-review-council',
    name: 'Security Review Council',
    category: 'major',
    purpose: 'Security architecture review and threat modeling. New features, third-party integrations, compliance.',
    leadAgent: 'security-engineer',
    whenToUse: 'New features, external integrations, security assessments, compliance audits',
    defaultAgents: ['security-engineer', 'architect', 'compliance-engineer', 'devops-engineer'],
    optionalAgents: ['cto', 'data-engineer'],
    maxDeliberationRounds: 8,
    standards: ['OWASP', 'SOC 2', 'ISO 27001', 'Threat Modeling'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Identify and mitigate security risks before they reach production.',
    toneKeywords: ['threat-aware', 'defense-in-depth', 'compliant', 'proactive'],
    outputFormat: ['threat_model', 'security_requirements', 'risk_assessment', 'mitigation_plan'],
  },
  {
    id: 'release-readiness-council',
    name: 'Release Readiness Council',
    category: 'major',
    purpose: 'Major release go/no-go decisions. Feature completeness, quality gates, rollback plans.',
    leadAgent: 'engineering-manager',
    whenToUse: 'Major releases, feature launches, breaking changes, migration releases',
    defaultAgents: ['engineering-manager', 'qa-lead', 'devops-engineer', 'product-manager'],
    optionalAgents: ['sre-lead', 'security-engineer'],
    maxDeliberationRounds: 6,
    standards: ['Release Management', 'Feature Flags', 'Canary Deployment'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Release only when ready. Have rollback plans. Communicate clearly.',
    toneKeywords: ['ready', 'tested', 'rollback-ready', 'communicated'],
    outputFormat: ['release_checklist', 'test_results', 'rollback_plan', 'go_no_go_decision'],
  },
];

// =============================================================================
// ARCHITECTURE MODES
// =============================================================================

export const ARCHITECTURE_MODES: TechnologyCouncilMode[] = [
  {
    id: 'api-design-review',
    name: 'API Design Review',
    category: 'architecture',
    purpose: 'API design and versioning decisions. REST/GraphQL design, backwards compatibility, documentation.',
    leadAgent: 'architect',
    whenToUse: 'New APIs, API changes, versioning decisions, deprecation planning',
    defaultAgents: ['architect', 'frontend-lead', 'technical-writer'],
    optionalAgents: ['security-engineer', 'platform-architect'],
    maxDeliberationRounds: 6,
    standards: ['OpenAPI', 'REST Best Practices', 'API Versioning'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Design APIs that are intuitive, secure, and backwards compatible.',
    toneKeywords: ['developer-friendly', 'consistent', 'documented', 'versioned'],
    outputFormat: ['api_specification', 'design_rationale', 'breaking_change_analysis', 'documentation'],
  },
  {
    id: 'database-design-review',
    name: 'Database Design Review',
    category: 'architecture',
    purpose: 'Database schema and data architecture decisions. Schema changes, migrations, performance.',
    leadAgent: 'data-engineer',
    whenToUse: 'Schema changes, new databases, migration planning, performance optimization',
    defaultAgents: ['data-engineer', 'architect', 'devops-engineer'],
    optionalAgents: ['security-engineer', 'sre-lead'],
    maxDeliberationRounds: 6,
    standards: ['Database Design Patterns', 'Migration Best Practices'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Design for data integrity, performance, and safe migrations.',
    toneKeywords: ['normalized', 'performant', 'migratable', 'secure'],
    outputFormat: ['schema_design', 'migration_plan', 'performance_analysis', 'rollback_strategy'],
  },
  {
    id: 'technology-selection',
    name: 'Technology Selection',
    category: 'architecture',
    purpose: 'Technology and framework selection decisions. Build vs buy, vendor evaluation, adoption.',
    leadAgent: 'cto',
    whenToUse: 'New technology adoption, vendor selection, framework decisions',
    defaultAgents: ['cto', 'architect', 'engineering-manager', 'security-engineer'],
    optionalAgents: ['devops-engineer', 'compliance-engineer'],
    maxDeliberationRounds: 8,
    standards: ['Technology Radar', 'Vendor Assessment'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Select technologies that solve problems without creating new ones.',
    toneKeywords: ['evaluated', 'fit-for-purpose', 'sustainable', 'supported'],
    outputFormat: ['evaluation_matrix', 'selection_rationale', 'adoption_plan', 'risk_assessment'],
  },
];

// =============================================================================
// DELIVERY MODES
// =============================================================================

export const DELIVERY_MODES: TechnologyCouncilMode[] = [
  {
    id: 'sprint-planning-council',
    name: 'Sprint Planning Council',
    category: 'delivery',
    purpose: 'Sprint planning and commitment decisions. Capacity, priorities, dependencies.',
    leadAgent: 'engineering-manager',
    whenToUse: 'Sprint planning, capacity planning, priority changes',
    defaultAgents: ['engineering-manager', 'product-manager', 'qa-lead'],
    optionalAgents: ['architect', 'devops-engineer'],
    maxDeliberationRounds: 4,
    standards: ['Scrum', 'Agile'],
    securityGate: false,
    auditTrailRequired: false,
    primeDirective: 'Commit to what we can deliver. Protect the team. Communicate risks.',
    toneKeywords: ['committed', 'realistic', 'prioritized', 'transparent'],
    outputFormat: ['sprint_backlog', 'capacity_analysis', 'risk_items', 'commitments'],
  },
  {
    id: 'technical-debt-council',
    name: 'Technical Debt Council',
    category: 'delivery',
    purpose: 'Technical debt prioritization and paydown planning. Refactoring, modernization, cleanup.',
    leadAgent: 'architect',
    whenToUse: 'Technical debt reviews, refactoring planning, modernization initiatives',
    defaultAgents: ['architect', 'engineering-manager', 'cto'],
    optionalAgents: ['qa-lead', 'devops-engineer'],
    maxDeliberationRounds: 6,
    standards: ['Code Quality', 'Maintainability'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Balance feature delivery with technical sustainability.',
    toneKeywords: ['prioritized', 'sustainable', 'incremental', 'measurable'],
    outputFormat: ['debt_inventory', 'prioritization_matrix', 'paydown_plan', 'progress_metrics'],
  },
  {
    id: 'feature-flag-council',
    name: 'Feature Flag Council',
    category: 'delivery',
    purpose: 'Feature flag strategy and lifecycle management. Rollout plans, cleanup, experimentation.',
    leadAgent: 'product-manager',
    whenToUse: 'Feature rollouts, A/B tests, progressive delivery, flag cleanup',
    defaultAgents: ['product-manager', 'engineering-manager', 'qa-lead'],
    optionalAgents: ['data-engineer', 'sre-lead'],
    maxDeliberationRounds: 4,
    standards: ['Progressive Delivery', 'Feature Management'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Ship safely. Measure impact. Clean up flags.',
    toneKeywords: ['controlled', 'measured', 'reversible', 'clean'],
    outputFormat: ['rollout_plan', 'success_metrics', 'rollback_criteria', 'cleanup_timeline'],
  },
];

// =============================================================================
// SECURITY MODES
// =============================================================================

export const SECURITY_TECHNOLOGY_MODES: TechnologyCouncilMode[] = [
  {
    id: 'vulnerability-triage',
    name: 'Vulnerability Triage',
    category: 'security',
    purpose: 'Security vulnerability assessment and remediation prioritization. CVEs, pen test findings.',
    leadAgent: 'security-engineer',
    whenToUse: 'Vulnerability reports, pen test results, dependency alerts, CVE notifications',
    defaultAgents: ['security-engineer', 'devops-engineer', 'engineering-manager'],
    optionalAgents: ['compliance-engineer', 'sre-lead'],
    maxDeliberationRounds: 5,
    standards: ['CVSS', 'OWASP', 'CVE'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Assess accurately. Prioritize by risk. Remediate promptly.',
    toneKeywords: ['risk-based', 'prioritized', 'timely', 'tracked'],
    outputFormat: ['vulnerability_assessment', 'risk_rating', 'remediation_plan', 'timeline'],
  },
  {
    id: 'compliance-audit-prep',
    name: 'Compliance Audit Prep',
    category: 'security',
    purpose: 'Compliance audit preparation and evidence collection. SOC 2, ISO 27001, GDPR readiness.',
    leadAgent: 'compliance-engineer',
    whenToUse: 'Audit preparation, evidence collection, gap assessment, certification renewals',
    defaultAgents: ['compliance-engineer', 'security-engineer', 'devops-engineer'],
    optionalAgents: ['cto', 'data-engineer'],
    maxDeliberationRounds: 8,
    standards: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Maintain continuous compliance. Automate evidence. Close gaps.',
    toneKeywords: ['audit-ready', 'evidenced', 'controlled', 'continuous'],
    outputFormat: ['control_status', 'evidence_inventory', 'gap_analysis', 'remediation_plan'],
  },
  {
    id: 'access-review-council',
    name: 'Access Review Council',
    category: 'security',
    purpose: 'Access control review and least privilege enforcement. IAM, permissions, service accounts.',
    leadAgent: 'security-engineer',
    whenToUse: 'Periodic access reviews, privilege escalation requests, service account audits',
    defaultAgents: ['security-engineer', 'devops-engineer', 'compliance-engineer'],
    optionalAgents: ['engineering-manager', 'cto'],
    maxDeliberationRounds: 5,
    standards: ['Least Privilege', 'IAM Best Practices', 'SOC 2'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Least privilege always. Review regularly. Remove promptly.',
    toneKeywords: ['least-privilege', 'reviewed', 'justified', 'audited'],
    outputFormat: ['access_inventory', 'review_findings', 'remediation_actions', 'exceptions'],
  },
];

// =============================================================================
// OPERATIONS MODES
// =============================================================================

export const OPERATIONS_TECHNOLOGY_MODES: TechnologyCouncilMode[] = [
  {
    id: 'slo-review-council',
    name: 'SLO Review Council',
    category: 'operations',
    purpose: 'SLO definition and error budget management. Service reliability targets, budget burn.',
    leadAgent: 'sre-lead',
    whenToUse: 'SLO definition, error budget reviews, reliability planning',
    defaultAgents: ['sre-lead', 'engineering-manager', 'product-manager'],
    optionalAgents: ['devops-engineer', 'architect'],
    maxDeliberationRounds: 6,
    standards: ['SRE Practices', 'SLO/SLI/SLA'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Set realistic SLOs. Track error budgets. Balance reliability with velocity.',
    toneKeywords: ['measurable', 'achievable', 'balanced', 'tracked'],
    outputFormat: ['slo_definitions', 'error_budget_status', 'reliability_roadmap', 'trade_off_decisions'],
  },
  {
    id: 'capacity-planning-council',
    name: 'Capacity Planning Council',
    category: 'operations',
    purpose: 'Infrastructure capacity planning and scaling decisions. Growth forecasting, cost optimization.',
    leadAgent: 'devops-engineer',
    whenToUse: 'Capacity planning, scaling decisions, cost optimization, growth events',
    defaultAgents: ['devops-engineer', 'sre-lead', 'architect', 'engineering-manager'],
    optionalAgents: ['data-engineer', 'cto'],
    maxDeliberationRounds: 6,
    standards: ['Capacity Planning', 'Cloud Cost Optimization'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Plan for growth. Optimize costs. Maintain headroom.',
    toneKeywords: ['forecasted', 'optimized', 'scalable', 'cost-aware'],
    outputFormat: ['capacity_forecast', 'scaling_plan', 'cost_analysis', 'recommendations'],
  },
  {
    id: 'post-incident-review',
    name: 'Post-Incident Review',
    category: 'operations',
    purpose: 'Blameless post-incident review and learning. Root cause analysis, action items, prevention.',
    leadAgent: 'sre-lead',
    whenToUse: 'After incidents, near-misses, system failures',
    defaultAgents: ['sre-lead', 'engineering-manager', 'devops-engineer'],
    optionalAgents: ['security-engineer', 'architect'],
    maxDeliberationRounds: 6,
    standards: ['Blameless Post-Mortems', 'SRE Practices'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Learn without blame. Prevent recurrence. Share knowledge.',
    toneKeywords: ['blameless', 'learning', 'preventive', 'actionable'],
    outputFormat: ['incident_timeline', 'root_cause_analysis', 'action_items', 'lessons_learned'],
  },
];

// =============================================================================
// SPECIALIZED MODES
// =============================================================================

export const SPECIALIZED_TECHNOLOGY_MODES: TechnologyCouncilMode[] = [
  {
    id: 'ml-model-review',
    name: 'ML Model Review',
    category: 'specialized',
    purpose: 'ML model deployment review and governance. Model performance, bias, monitoring.',
    leadAgent: 'ml-engineer',
    whenToUse: 'Model deployment, performance reviews, bias assessment, model updates',
    defaultAgents: ['ml-engineer', 'data-engineer', 'security-engineer'],
    optionalAgents: ['architect', 'compliance-engineer'],
    maxDeliberationRounds: 8,
    standards: ['ML Ops', 'Model Cards', 'AI Ethics'],
    securityGate: true,
    auditTrailRequired: true,
    primeDirective: 'Deploy responsible ML. Monitor performance. Detect drift and bias.',
    toneKeywords: ['responsible', 'monitored', 'fair', 'performant'],
    outputFormat: ['model_card', 'performance_metrics', 'bias_assessment', 'monitoring_plan'],
  },
  {
    id: 'platform-roadmap-council',
    name: 'Platform Roadmap Council',
    category: 'specialized',
    purpose: 'Platform strategy and developer experience roadmap. API evolution, DX improvements.',
    leadAgent: 'platform-architect',
    whenToUse: 'Platform planning, API strategy, developer experience initiatives',
    defaultAgents: ['platform-architect', 'cto', 'product-manager', 'technical-writer'],
    optionalAgents: ['architect', 'frontend-lead'],
    maxDeliberationRounds: 8,
    standards: ['Platform Strategy', 'Developer Experience'],
    securityGate: false,
    auditTrailRequired: true,
    primeDirective: 'Build platforms that developers love and that scale.',
    toneKeywords: ['developer-first', 'scalable', 'extensible', 'documented'],
    outputFormat: ['platform_roadmap', 'api_evolution_plan', 'dx_improvements', 'ecosystem_strategy'],
  },
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_TECHNOLOGY_MODES: TechnologyCouncilMode[] = [
  ...MAJOR_TECHNOLOGY_MODES,
  ...ARCHITECTURE_MODES,
  ...DELIVERY_MODES,
  ...SECURITY_TECHNOLOGY_MODES,
  ...OPERATIONS_TECHNOLOGY_MODES,
  ...SPECIALIZED_TECHNOLOGY_MODES,
];

export const TECHNOLOGY_MODE_MAP: Map<string, TechnologyCouncilMode> = new Map(
  ALL_TECHNOLOGY_MODES.map(mode => [mode.id, mode])
);

export function getTechnologyMode(modeId: string): TechnologyCouncilMode | undefined {
  return TECHNOLOGY_MODE_MAP.get(modeId);
}

export function getTechnologyModesByCategory(category: TechnologyModeCategory): TechnologyCouncilMode[] {
  return ALL_TECHNOLOGY_MODES.filter(mode => mode.category === category);
}

export const TECHNOLOGY_MODE_STATS = {
  total: ALL_TECHNOLOGY_MODES.length,
  byCategory: {
    major: MAJOR_TECHNOLOGY_MODES.length,
    architecture: ARCHITECTURE_MODES.length,
    delivery: DELIVERY_MODES.length,
    security: SECURITY_TECHNOLOGY_MODES.length,
    operations: OPERATIONS_TECHNOLOGY_MODES.length,
    specialized: SPECIALIZED_TECHNOLOGY_MODES.length,
  },
};
