// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO SCENARIO DATA
 * =============================================================================
 * Pre-loaded realistic scenarios for platform demonstrations.
 * Each scenario contains data that populates the UI components.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface DemoAgent {
  id: string;
  name: string;
  role: string;
  vote: 'SUPPORT' | 'OPPOSE' | 'SUPPORT_WITH_CONDITIONS' | 'ABSTAIN';
  confidence: number;
  reasoning: string;
  keyPoints: string[];
}

export interface DemoDeliberation {
  id: string;
  question: string;
  context: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_APPROVAL';
  outcome?: string;
  agents: DemoAgent[];
  dissents: DemoDissent[];
  conditions: string[];
  startedAt: string;
  completedAt?: string;
}

export interface DemoDissent {
  agentId: string;
  agentName: string;
  position: string;
  reasoning: string;
  acknowledged: boolean;
}

export interface DemoRippleEffect {
  order: number;
  category: string;
  effect: string;
  probability: number;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  financialImpact?: number;
  description: string;
}

export interface DemoPivotalMoment {
  rank: number;
  date: string;
  title: string;
  department: string;
  decisionMaker: string;
  originalChoice: string;
  alternativeConsidered: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  impactScore: number;
  consequences: string[];
  counterfactual: string;
  lessonsLearned: string;
}

export interface DemoComplianceControl {
  id: string;
  control: string;
  framework: string;
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  evidence: string;
  lastTested: string;
  remediation?: string;
}

export interface DemoVulnerability {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  attackVector: string;
  description: string;
  status: 'AUTO_PATCHED' | 'ESCALATED' | 'PENDING';
  patchDeployed?: string;
}

export interface DemoTranslation {
  language: string;
  code: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
  quality: number;
  time: string;
  reviewer: string;
}

export interface DemoThreat {
  id: string;
  type: string;
  action: 'BLOCK' | 'ALLOW' | 'REDACT' | 'FLAG';
  scores: {
    toxicity: number;
    injection: number;
    pii: number;
    jailbreak: number;
  };
  reason?: string;
  latency: string;
}

export interface DemoDocument {
  id: string;
  title: string;
  type: string;
  pages: number;
  extractedEntities: number;
}

// =============================================================================
// COUNCIL SCENARIO: Cyber Insurance Market Entry
// =============================================================================

export const COUNCIL_DEMO_SCENARIO: DemoDeliberation = {
  id: 'dlb-demo-council-001',
  question: 'Should Apex Insurance enter the cyber insurance market with a $50M initial underwriting capacity?',
  context: 'Apex Insurance (regional P&C carrier, $2.1B GWP) is evaluating entry into the cyber insurance market. The cyber market is growing 25% annually but loss ratios have been volatile (60-120% over past 5 years). Apex has no current cyber expertise but could acquire talent or partner with an MGA.',
  status: 'COMPLETED',
  outcome: 'CONDITIONAL_APPROVAL',
  startedAt: '2026-01-04T09:00:00Z',
  completedAt: '2026-01-04T09:47:22Z',
  agents: [
    {
      id: 'agent-strategist',
      name: 'Strategic Advisor',
      role: 'Strategist',
      vote: 'SUPPORT_WITH_CONDITIONS',
      confidence: 0.78,
      reasoning: 'Cyber insurance is a strategic growth opportunity, but timing and execution are critical. Market is maturing and early movers have established positions.',
      keyPoints: [
        'Cyber market growing 25% annually vs 3% for traditional P&C',
        'Late entry means competing against established players',
        'MGA partnership reduces execution risk',
        'Recommend phased entry starting with SMB segment'
      ]
    },
    {
      id: 'agent-cfo',
      name: 'CFO Analyst',
      role: 'CFO',
      vote: 'SUPPORT_WITH_CONDITIONS',
      confidence: 0.72,
      reasoning: 'Financial projections show break-even in Year 3 under base case, but significant downside risk if loss ratios spike.',
      keyPoints: [
        '$50M capacity requires $15M in capital allocation',
        'Expected combined ratio: 95% (base), 115% (stress)',
        'Break-even: Year 3 (base), Year 5 (stress)',
        'Recommend starting with $25M capacity to limit exposure'
      ]
    },
    {
      id: 'agent-risk',
      name: 'Risk Officer',
      role: 'Risk',
      vote: 'OPPOSE',
      confidence: 0.81,
      reasoning: 'Cyber risk is fundamentally different from traditional P&C. Correlation risk is high - a single systemic event could trigger claims across the entire book.',
      keyPoints: [
        'Aggregation risk: Single ransomware variant could hit 40% of book',
        'No actuarial history - pricing is speculative',
        'Reinsurance market for cyber is thin and expensive',
        'Recommend waiting 2-3 years for market to stabilize'
      ]
    },
    {
      id: 'agent-legal',
      name: 'Legal Counsel',
      role: 'Legal',
      vote: 'SUPPORT_WITH_CONDITIONS',
      confidence: 0.85,
      reasoning: 'Legal framework for cyber insurance is evolving. Policy language must be precise to avoid coverage disputes.',
      keyPoints: [
        'War exclusion language critical after NotPetya litigation',
        'State regulatory requirements vary significantly',
        'OFAC sanctions compliance for ransomware payments',
        'Recommend external counsel review of all policy forms'
      ]
    },
    {
      id: 'agent-redteam',
      name: 'Red Team',
      role: 'Red Team',
      vote: 'SUPPORT_WITH_CONDITIONS',
      confidence: 0.68,
      reasoning: 'Stress-tested worst-case scenarios. The $50M capacity could be wiped out by a single systemic event, but probability is low.',
      keyPoints: [
        'Worst case: $47M loss from systemic ransomware event (2% probability)',
        'Moderate case: $28M loss from targeted attacks (15% probability)',
        'Base case: $8M loss from normal claims (83% probability)',
        'Recommend catastrophe reinsurance before launch'
      ]
    },
    {
      id: 'agent-arbiter',
      name: 'Arbiter',
      role: 'Arbiter',
      vote: 'SUPPORT_WITH_CONDITIONS',
      confidence: 0.76,
      reasoning: 'Synthesizing all perspectives: Entry is strategically sound but execution risk is high. Recommend phased approach with risk controls.',
      keyPoints: [
        'APPROVE with conditions: Start at $25M capacity, not $50M',
        'Require MGA partnership for underwriting expertise',
        'Secure catastrophe reinsurance before binding first policy',
        'Quarterly loss ratio reviews with automatic pause at 100%'
      ]
    }
  ],
  dissents: [
    {
      agentId: 'agent-risk',
      agentName: 'Risk Officer',
      position: 'Recommended waiting 2-3 years for market stabilization',
      reasoning: 'Aggregation risk and lack of actuarial history make this a speculative bet, not an underwriting decision.',
      acknowledged: true
    }
  ],
  conditions: [
    'Reduce initial capacity from $50M to $25M',
    'Secure MGA partnership with established cyber underwriter',
    'Obtain catastrophe reinsurance covering 80% of capacity',
    'Implement quarterly loss ratio reviews with automatic pause trigger at 100%',
    'External legal review of all policy forms before launch'
  ]
};

// =============================================================================
// CHRONOS SCENARIO: Hospital System Timeline Analysis
// =============================================================================

export const CHRONOS_DEMO_SCENARIO = {
  organization: {
    name: 'Mercy Regional Health System',
    type: 'Healthcare',
    hospitals: 5,
    employees: 12000,
    analysisRange: '2021-01-01 to 2025-12-31'
  },
  totalDecisions: 2847,
  pivotalIdentified: 23,
  pivotalMoments: [
    {
      rank: 1,
      date: '2022-03-15',
      title: 'Epic EHR Implementation Decision',
      department: 'IT',
      decisionMaker: 'CIO Sarah Chen',
      originalChoice: 'Proceed with Epic implementation despite 18-month timeline concerns',
      alternativeConsidered: 'Delay 6 months for better preparation',
      impact: 'Critical' as const,
      impactScore: 0.94,
      consequences: [
        '$350M investment over 3 years',
        '18% productivity drop during transition (6 months)',
        'Now: 23% improvement in clinical efficiency',
        'Enabled telehealth expansion during COVID surge'
      ],
      counterfactual: 'Delay would have left us on legacy system during COVID peak. Estimated $15M in additional costs, potential patient safety issues.',
      lessonsLearned: 'Large technology transitions require executive air cover and realistic timeline buffers.'
    },
    {
      rank: 2,
      date: '2021-06-22',
      title: 'Ambulatory Surgery Center Acquisition',
      department: 'Strategy',
      decisionMaker: 'CEO Michael Torres',
      originalChoice: 'Acquire Westside ASC for $45M',
      alternativeConsidered: 'Build new ASC from ground up (estimated $60M, 3 years)',
      impact: 'High' as const,
      impactScore: 0.87,
      consequences: [
        'Immediate $12M annual revenue addition',
        'Captured outpatient surgery market before competitors',
        'Integration challenges with existing surgical staff',
        'Now: $28M annual revenue, 22% margin'
      ],
      counterfactual: 'Building new would have missed the market window. Competitor acquired similar facility 8 months later.',
      lessonsLearned: 'Speed to market can outweigh cost optimization in competitive healthcare markets.'
    },
    {
      rank: 3,
      date: '2023-09-08',
      title: 'Nursing Staff Retention Program',
      department: 'HR',
      decisionMaker: 'CHRO Patricia Williams',
      originalChoice: 'Implement 15% wage increase plus flexible scheduling',
      alternativeConsidered: 'Standard 3% annual increase',
      impact: 'High' as const,
      impactScore: 0.82,
      consequences: [
        '$22M annual cost increase',
        'Turnover dropped from 34% to 12%',
        'Avoided estimated $8M in agency nursing costs',
        'Patient satisfaction scores up 18 points'
      ],
      counterfactual: 'Without intervention, projected 45% turnover by 2024. Would have required $35M in agency staffing.',
      lessonsLearned: 'Proactive retention investment beats reactive recruitment costs.'
    },
    {
      rank: 4,
      date: '2022-11-30',
      title: 'Telehealth Platform Selection',
      department: 'Digital Health',
      decisionMaker: 'CMO Dr. James Liu',
      originalChoice: 'Partner with Teladoc for enterprise telehealth',
      alternativeConsidered: 'Build proprietary platform',
      impact: 'Medium' as const,
      impactScore: 0.71,
      consequences: [
        '$6M annual licensing cost',
        'Launched in 90 days vs estimated 18 months for build',
        'Now handling 45,000 virtual visits per month',
        'Limited customization frustrating some specialties'
      ],
      counterfactual: 'Building in-house would have delayed launch past COVID telehealth adoption window. Estimated $25M in lost revenue.',
      lessonsLearned: 'Buy vs build decisions should weight time-to-market heavily in fast-moving markets.'
    },
    {
      rank: 5,
      date: '2024-02-14',
      title: 'Oncology Service Line Expansion',
      department: 'Clinical Operations',
      decisionMaker: 'COO David Okonkwo',
      originalChoice: 'Expand oncology with 3 new physicians and linear accelerator',
      alternativeConsidered: 'Maintain current capacity, refer complex cases',
      impact: 'Medium' as const,
      impactScore: 0.68,
      consequences: [
        '$18M capital investment',
        'Reduced oncology referrals out by 67%',
        'Attracted 2 additional oncologists organically',
        'Now: Regional oncology destination, $15M incremental revenue'
      ],
      counterfactual: 'Without expansion, would have lost oncology market share to competitor who expanded 6 months later.',
      lessonsLearned: 'Clinical service line investments create flywheel effects for talent and patient acquisition.'
    }
  ] as DemoPivotalMoment[],
  patterns: [
    { pattern: 'Speed over perfection', occurrences: 4, successRate: 0.85, description: 'Decisions prioritizing speed to market outperformed delayed optimization' },
    { pattern: 'Proactive investment', occurrences: 3, successRate: 0.92, description: 'Investing ahead of problems beat reactive spending' },
    { pattern: 'Buy vs Build', occurrences: 2, successRate: 0.78, description: 'Acquisition and partnership decisions generally outperformed build decisions' },
    { pattern: 'Talent retention', occurrences: 2, successRate: 0.88, description: 'Above-market compensation decisions showed strong ROI' }
  ]
};

// =============================================================================
// CASCADE SCENARIO: Plant Closure Analysis
// =============================================================================

export const CASCADE_DEMO_SCENARIO = {
  organization: {
    name: 'Midwest Manufacturing Corp',
    industry: 'Industrial Equipment',
    employees: 4200,
    plants: 6,
    annualRevenue: 890000000
  },
  proposedChange: {
    changeId: 'CAS-2026-0104-001',
    title: 'Closure of Springfield Plant',
    type: 'Facility Closure',
    proposedBy: 'CFO',
    targetDate: '2026-06-30',
    rationale: 'Springfield plant operating at 47% capacity. Consolidation to remaining 5 plants projected to save $12M annually.',
    affectedEmployees: 340,
    estimatedSavings: 12000000
  },
  rippleEffects: [
    { order: 1, category: 'Workforce', effect: '340 employees displaced', probability: 1.0, impact: 'High' as const, financialImpact: -8500000, description: 'Severance, outplacement, unemployment costs' },
    { order: 1, category: 'Operations', effect: 'Production capacity reduced 18%', probability: 1.0, impact: 'Medium' as const, financialImpact: 0, description: 'Must redistribute to other plants' },
    { order: 1, category: 'Real Estate', effect: 'Springfield facility vacant', probability: 1.0, impact: 'Low' as const, financialImpact: -2400000, description: 'Carrying costs until sale, estimated 18 months' },
    { order: 2, category: 'Supply Chain', effect: '3 local suppliers lose primary customer', probability: 0.95, impact: 'Medium' as const, financialImpact: 0, description: 'May affect supplier viability and pricing' },
    { order: 2, category: 'Workforce', effect: 'Key engineers relocate to competitors', probability: 0.72, impact: 'High' as const, financialImpact: -1800000, description: 'Loss of institutional knowledge, recruitment costs' },
    { order: 2, category: 'Customer', effect: 'Regional customers concerned about service', probability: 0.68, impact: 'Medium' as const, financialImpact: -3200000, description: 'Potential loss of 4 accounts representing $3.2M revenue' },
    { order: 2, category: 'Operations', effect: 'Other plants require overtime during transition', probability: 0.88, impact: 'Medium' as const, financialImpact: -1400000, description: '6-month overtime surge at receiving plants' },
    { order: 3, category: 'Community', effect: 'Springfield tax base reduced', probability: 0.90, impact: 'Low' as const, financialImpact: 0, description: 'May affect future community relations and permits' },
    { order: 3, category: 'Reputation', effect: 'Negative press coverage', probability: 0.65, impact: 'Medium' as const, financialImpact: -500000, description: 'PR management and potential customer perception impact' },
    { order: 3, category: 'Workforce', effect: 'Morale impact at remaining plants', probability: 0.78, impact: 'Medium' as const, financialImpact: -900000, description: 'Productivity dip, increased turnover at other locations' },
    { order: 4, category: 'Strategic', effect: 'Reduced geographic diversification', probability: 1.0, impact: 'Medium' as const, financialImpact: 0, description: 'Concentration risk if remaining plants face issues' },
    { order: 4, category: 'Talent', effect: 'Harder to recruit in Midwest region', probability: 0.55, impact: 'Low' as const, financialImpact: -600000, description: 'Reputation as employer affected regionally' },
    { order: 4, category: 'Customer', effect: 'Competitors target displaced accounts', probability: 0.72, impact: 'High' as const, financialImpact: -4500000, description: 'Aggressive competitor moves during transition' }
  ] as DemoRippleEffect[],
  hiddenCosts: {
    severanceAndOutplacement: 8500000,
    facilityCarryingCosts: 2400000,
    knowledgeLoss: 1800000,
    customerAttrition: 3200000,
    overtimeSurge: 1400000,
    prAndReputation: 500000,
    moraleImpact: 900000,
    legalCompliance: 200000,
    recruitmentImpact: 600000,
    competitorPoaching: 4500000,
    total: 24000000
  },
  netAnalysis: {
    projectedSavings: 12000000,
    hiddenCosts: 24000000,
    netFirstYear: -12000000,
    breakEvenYear: 'Year 3 (if no further attrition)',
    riskAdjustedNPV: -8500000
  },
  alternatives: [
    { option: 'Partial Closure', description: 'Reduce Springfield to 1 shift, retain 120 employees', savings: 7200000, hiddenCosts: 8000000, netImpact: -800000, risk: 'Medium' },
    { option: 'Product Line Shift', description: 'Retool Springfield for new product line', savings: 0, hiddenCosts: 15000000, netImpact: 'Depends on new product success', risk: 'High' },
    { option: 'Automation Investment', description: 'Invest $8M in automation, reduce headcount by 40%', savings: 5800000, hiddenCosts: 4200000, netImpact: 1600000, risk: 'Low' },
    { option: 'Status Quo + Efficiency', description: 'Lean initiative targeting 15% cost reduction', savings: 4500000, hiddenCosts: 1200000, netImpact: 3300000, risk: 'Low' }
  ],
  recommendation: {
    action: 'DO NOT PROCEED',
    alternative: 'Status Quo + Efficiency',
    reasoning: 'The $12M in projected savings is real, but $24M in hidden costs were not visible in the original analysis. The lean initiative yields $3.3M net positive with low risk and no workforce displacement.'
  }
};

// =============================================================================
// OVERSIGHT SCENARIO: HIPAA Audit Response
// =============================================================================

export const OVERSIGHT_DEMO_SCENARIO = {
  organization: {
    name: 'Regional Medical Center',
    type: 'Healthcare Provider',
    beds: 450,
    employees: 3200,
    patientsAnnual: 125000,
    frameworks: ['HIPAA', 'HITECH', 'State Privacy Laws', 'Joint Commission']
  },
  auditContext: {
    auditId: 'HHS-OCR-2026-0104',
    auditor: 'HHS Office for Civil Rights',
    type: 'Compliance Review',
    notice: '48 hours',
    scope: [
      'Access controls and authentication',
      'Audit logging and monitoring',
      'Data encryption (at rest and in transit)',
      'Business associate agreements',
      'Incident response procedures',
      'Employee training records'
    ]
  },
  compliancePosture: {
    overallScore: 0.94,
    lastAssessment: '2026-01-03',
    frameworks: [
      { name: 'HIPAA Security Rule', score: 0.96, controls: 54, compliant: 52, gaps: 2 },
      { name: 'HIPAA Privacy Rule', score: 0.93, controls: 42, compliant: 39, gaps: 3 },
      { name: 'HITECH Act', score: 0.95, controls: 28, compliant: 27, gaps: 1 },
      { name: 'State Privacy Laws', score: 0.91, controls: 35, compliant: 32, gaps: 3 }
    ]
  },
  controlStatus: [
    { id: 'AC-001', control: 'Unique User Identification', framework: 'HIPAA 164.312(a)(2)(i)', status: 'COMPLIANT' as const, evidence: 'All 3,200 users have unique IDs. No shared accounts.', lastTested: '2026-01-02' },
    { id: 'AC-002', control: 'Automatic Logoff', framework: 'HIPAA 164.312(a)(2)(iii)', status: 'COMPLIANT' as const, evidence: '15-minute timeout enforced via GPO. Compliance rate: 100%', lastTested: '2026-01-03' },
    { id: 'AC-003', control: 'Encryption at Rest', framework: 'HIPAA 164.312(a)(2)(iv)', status: 'COMPLIANT' as const, evidence: 'AES-256 encryption on all PHI databases. Key rotation: quarterly', lastTested: '2026-01-01' },
    { id: 'AU-001', control: 'Audit Controls', framework: 'HIPAA 164.312(b)', status: 'COMPLIANT' as const, evidence: 'All PHI access logged. 7-year retention. Tamper-evident storage', lastTested: '2026-01-03' },
    { id: 'AU-002', control: 'Audit Log Review', framework: 'HIPAA 164.308(a)(1)(ii)(D)', status: 'WARNING' as const, evidence: 'Weekly reviews documented. 2 reviews delayed in December (holiday staffing)', lastTested: '2026-01-02', remediation: 'Implemented automated anomaly detection to supplement manual review' },
    { id: 'TR-001', control: 'Security Awareness Training', framework: 'HIPAA 164.308(a)(5)', status: 'COMPLIANT' as const, evidence: 'Annual training completed by 98.7% of workforce. 42 employees pending (new hires)', lastTested: '2026-01-03' },
    { id: 'BA-001', control: 'Business Associate Agreements', framework: 'HIPAA 164.308(b)(1)', status: 'WARNING' as const, evidence: '127 BAAs on file. 3 pending renewal (due dates: Jan 15, Jan 22, Feb 1)', lastTested: '2026-01-02', remediation: 'Renewal reminders sent. Legal review in progress' }
  ] as DemoComplianceControl[],
  evidencePackage: {
    packageId: 'EVD-2026-0104-HIPAA',
    generatedAt: '2026-01-04T10:15:00Z',
    contents: [
      { document: 'Compliance_Posture_Summary.pdf', pages: 12 },
      { document: 'Control_Evidence_Matrix.xlsx', pages: 8 },
      { document: 'Audit_Logs_Sample_30Days.csv', records: 2847000 },
      { document: 'Training_Completion_Report.pdf', pages: 45 },
      { document: 'BAA_Inventory.pdf', pages: 23 },
      { document: 'Incident_Response_Log.pdf', pages: 8 },
      { document: 'Risk_Assessment_2025.pdf', pages: 67 },
      { document: 'Policy_Library.pdf', pages: 124 }
    ],
    totalPages: 287,
    generationTime: '4 minutes 23 seconds'
  }
};

// =============================================================================
// CRUCIBLE SCENARIO: AI Loan System Testing
// =============================================================================

export const CRUCIBLE_DEMO_SCENARIO = {
  targetSystem: {
    name: 'LoanIQ - AI Loan Approval System',
    version: '2.1.0',
    model: 'Custom XGBoost + LLM Explainer',
    purpose: 'Automated loan decisioning for personal loans up to $50,000',
    expectedVolume: '15,000 applications per day',
    goLiveDate: '2026-02-01'
  },
  testSuite: {
    suiteId: 'CRU-2026-0104-001',
    duration: '6 hours 32 minutes',
    totalTests: 2847,
    categories: [
      { name: 'Adversarial Inputs', tests: 450, description: 'Malformed, edge case, and attack inputs' },
      { name: 'Bias Detection', tests: 680, description: 'Protected class fairness testing' },
      { name: 'Robustness', tests: 520, description: 'Input perturbation and stability' },
      { name: 'Explainability', tests: 340, description: 'Reasoning consistency and clarity' },
      { name: 'Regulatory Compliance', tests: 410, description: 'ECOA, FCRA, state law requirements' },
      { name: 'Security', tests: 447, description: 'Model extraction, inversion, evasion' }
    ]
  },
  vulnerabilities: [
    { id: 'VULN-001', type: 'Unicode Normalization', severity: 'Medium' as const, attackVector: 'Cyrillic characters bypass input validation', description: 'System accepted input without normalization', status: 'PENDING' as const },
    { id: 'VULN-002', type: 'Zip Code Redlining', severity: 'High' as const, attackVector: 'Approval rates by zip code demographics', description: '4.2% lower approval rate for majority-minority zip codes', status: 'PENDING' as const },
    { id: 'VULN-003', type: 'SSI/SSDI Discrimination', severity: 'High' as const, attackVector: 'SSI/SSDI income weighted at 0.7x employment income', description: 'ECOA requires equal treatment of public assistance income', status: 'PENDING' as const },
    { id: 'VULN-004', type: 'State Usury Violation', severity: 'Critical' as const, attackVector: 'APR offers exceeding state caps in AR, MT, NE', description: 'Pricing engine not enforcing state-specific limits', status: 'PENDING' as const },
    { id: 'VULN-005', type: 'Feature Order Sensitivity', severity: 'Medium' as const, attackVector: 'Reordered input features change decisions', description: 'Decision changed in 2.3% of cases with reordered features', status: 'PENDING' as const },
    { id: 'VULN-006', type: 'Counterfactual Inconsistency', severity: 'Medium' as const, attackVector: 'What-if explanations not achievable', description: 'In 12% of cases, stated counterfactual did not flip decision', status: 'PENDING' as const },
    { id: 'VULN-007', type: 'Adversarial Examples', severity: 'Medium' as const, attackVector: 'Gradient-based adversarial perturbations', description: '12 adversarial examples found that flip decisions', status: 'PENDING' as const }
  ] as DemoVulnerability[],
  summary: {
    passRate: 0.9975,
    critical: 1,
    high: 2,
    medium: 4,
    low: 0,
    launchBlockers: 3,
    recommendation: 'DO NOT LAUNCH - 3 critical/high issues must be resolved'
  }
};

// =============================================================================
// GUARD SCENARIO: Real-Time AI Safety
// =============================================================================

export const GUARD_DEMO_SCENARIO = {
  organization: {
    name: 'SecureBank Financial',
    industry: 'Financial Services',
    dailyQueries: 10000,
    complianceFrameworks: ['SOC 2', 'PCI-DSS', 'GDPR', 'CCPA']
  },
  threats: [
    { id: 'req-001', type: 'Normal Query', action: 'ALLOW' as const, scores: { toxicity: 0.02, injection: 0.05, pii: 0.15, jailbreak: 0.01 }, latency: '12ms' },
    { id: 'req-002', type: 'Jailbreak Attempt', action: 'BLOCK' as const, scores: { toxicity: 0.15, injection: 0.94, pii: 0.08, jailbreak: 0.97 }, reason: 'DAN pattern + instruction override detected', latency: '18ms' },
    { id: 'req-003', type: 'PII Exposure', action: 'REDACT' as const, scores: { toxicity: 0.01, injection: 0.03, pii: 0.98, jailbreak: 0.02 }, reason: 'SSN detected and redacted', latency: '15ms' },
    { id: 'req-004', type: 'Normal Query', action: 'ALLOW' as const, scores: { toxicity: 0.01, injection: 0.02, pii: 0.05, jailbreak: 0.01 }, latency: '11ms' },
    { id: 'req-005', type: 'Toxic Content', action: 'FLAG' as const, scores: { toxicity: 0.82, injection: 0.04, pii: 0.02, jailbreak: 0.03 }, reason: 'Customer frustration - escalate to human', latency: '14ms' },
    { id: 'req-006', type: 'Prompt Injection', action: 'BLOCK' as const, scores: { toxicity: 0.05, injection: 0.96, pii: 0.12, jailbreak: 0.45 }, reason: 'System prompt injection via code block', latency: '16ms' },
    { id: 'req-007', type: 'Normal Query', action: 'ALLOW' as const, scores: { toxicity: 0.01, injection: 0.01, pii: 0.03, jailbreak: 0.01 }, latency: '10ms' },
    { id: 'req-008', type: 'PII Exposure', action: 'REDACT' as const, scores: { toxicity: 0.01, injection: 0.02, pii: 0.99, jailbreak: 0.01 }, reason: 'Email + DOB detected and redacted', latency: '19ms' },
    { id: 'req-009', type: 'Code Injection', action: 'BLOCK' as const, scores: { toxicity: 0.08, injection: 0.99, pii: 0.01, jailbreak: 0.35 }, reason: 'Malicious shell command detected', latency: '13ms' },
    { id: 'req-010', type: 'Normal Query', action: 'ALLOW' as const, scores: { toxicity: 0.01, injection: 0.01, pii: 0.02, jailbreak: 0.01 }, latency: '9ms' }
  ] as DemoThreat[],
  summary: {
    totalRequests: 10,
    allowed: 4,
    blocked: 3,
    redacted: 2,
    flagged: 1,
    avgLatency: 14,
    incidentsCreated: 3
  }
};

// =============================================================================
// GNOSIS SCENARIO: M&A Document Intelligence
// =============================================================================

export const GNOSIS_DEMO_SCENARIO = {
  matter: {
    name: 'Project Falcon - TechStart Acquisition',
    client: 'Morrison & Associates LLP',
    deadline: '2026-01-15'
  },
  documentUpload: {
    totalDocuments: 47,
    totalPages: 2847,
    totalSizeMB: 847,
    formats: { PDF: 32, DOCX: 8, XLSX: 5, PPTX: 2 },
    categories: {
      'Financial Statements': 12,
      'Contracts & Agreements': 15,
      'Corporate Records': 8,
      'IP Documentation': 6,
      'Employment Records': 4,
      'Regulatory Filings': 2
    }
  },
  processingResults: {
    textChunks: 12384,
    entities: 847,
    crossReferences: 156,
    processingTime: '3 minutes 21 seconds'
  },
  sampleQueries: [
    {
      query: "What is TechStart's current annual recurring revenue?",
      answer: "According to the Q3 2025 Financial Summary (page 12), TechStart's ARR is $2.4M as of September 30, 2025, representing 34% YoY growth.",
      sources: [
        { doc: 'TechStart_Financial_Summary_Q3_2025.pdf', page: 12, relevance: 0.94 },
        { doc: 'Revenue_Recognition_Schedule.xlsx', page: 1, relevance: 0.87 }
      ],
      latency: '1.2s'
    },
    {
      query: 'Are there any change of control provisions in existing contracts?',
      answer: 'Yes, 3 contracts contain change of control provisions: (1) AWS Enterprise Agreement requires 60-day notice, (2) Salesforce MSA allows termination within 30 days of acquisition, (3) Key employee agreements trigger accelerated vesting.',
      sources: [
        { doc: 'AWS_Enterprise_Agreement_2024.pdf', page: 8, relevance: 0.96 },
        { doc: 'Salesforce_MSA_2023.pdf', page: 15, relevance: 0.92 },
        { doc: 'Executive_Employment_Agreements.pdf', page: 4, relevance: 0.89 }
      ],
      latency: '2.1s'
    },
    {
      query: 'What intellectual property does TechStart own?',
      answer: 'TechStart owns: (1) 3 US patents for cloud synchronization technology, (2) TechStart and CloudSync registered trademarks, (3) Proprietary codebase (~450K lines), (4) 2 pending patent applications.',
      sources: [
        { doc: 'IP_Portfolio_Summary.pdf', page: 1, relevance: 0.98 },
        { doc: 'Patent_Assignments.pdf', page: 3, relevance: 0.91 }
      ],
      latency: '1.8s'
    }
  ],
  keyFindings: [
    { category: 'Financial', finding: 'Revenue concentration risk: Top 3 customers = 67% of ARR', severity: 'medium' as const, source: 'Revenue_By_Customer.xlsx' },
    { category: 'Legal', finding: 'Change of control triggers in 3 material contracts', severity: 'high' as const, source: 'Contract_Summary.pdf' },
    { category: 'IP', finding: '2 patents expire within 5 years of acquisition', severity: 'medium' as const, source: 'IP_Portfolio_Summary.pdf' },
    { category: 'HR', finding: 'CTO has competing offer, retention risk flagged', severity: 'high' as const, source: 'HR_Risk_Assessment.pdf' },
    { category: 'Compliance', finding: 'SOC 2 Type II certification expires March 2026', severity: 'low' as const, source: 'Compliance_Calendar.xlsx' }
  ]
};

// =============================================================================
// OMNITRANSLATE SCENARIO: Drug Safety Alert
// =============================================================================

export const OMNITRANSLATE_DEMO_SCENARIO = {
  request: {
    requestId: 'OT-2026-0104-URGENT',
    type: 'Drug Safety Alert',
    priority: 'CRITICAL',
    deadline: '2 hours',
    sourceLanguage: 'English',
    targetLanguages: 15,
    wordCount: 847
  },
  sourceDocument: {
    title: 'URGENT: Safety Alert - CardioMax-500 Dosing Update',
    contentPreview: 'Healthcare providers should immediately review dosing guidelines for CardioMax-500. New clinical data indicates increased cardiac risk at doses exceeding 400mg daily in patients over 65 years of age...'
  },
  translations: [
    { language: 'Spanish', code: 'es', status: 'COMPLETE' as const, quality: 0.98, time: '4m 12s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'Chinese', code: 'zh', status: 'COMPLETE' as const, quality: 0.96, time: '5m 34s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'Japanese', code: 'ja', status: 'COMPLETE' as const, quality: 0.97, time: '5m 08s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'German', code: 'de', status: 'COMPLETE' as const, quality: 0.99, time: '3m 45s', reviewer: 'Auto-QA' },
    { language: 'French', code: 'fr', status: 'COMPLETE' as const, quality: 0.98, time: '3m 52s', reviewer: 'Auto-QA' },
    { language: 'Portuguese', code: 'pt', status: 'COMPLETE' as const, quality: 0.97, time: '4m 01s', reviewer: 'Auto-QA' },
    { language: 'Italian', code: 'it', status: 'COMPLETE' as const, quality: 0.98, time: '3m 38s', reviewer: 'Auto-QA' },
    { language: 'Korean', code: 'ko', status: 'COMPLETE' as const, quality: 0.96, time: '4m 55s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'Arabic', code: 'ar', status: 'COMPLETE' as const, quality: 0.95, time: '5m 22s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'Russian', code: 'ru', status: 'COMPLETE' as const, quality: 0.97, time: '4m 18s', reviewer: 'Auto-QA' },
    { language: 'Hindi', code: 'hi', status: 'COMPLETE' as const, quality: 0.94, time: '5m 45s', reviewer: 'Auto-QA + Human Spot Check' },
    { language: 'Dutch', code: 'nl', status: 'COMPLETE' as const, quality: 0.98, time: '3m 32s', reviewer: 'Auto-QA' },
    { language: 'Polish', code: 'pl', status: 'COMPLETE' as const, quality: 0.97, time: '4m 05s', reviewer: 'Auto-QA' },
    { language: 'Turkish', code: 'tr', status: 'COMPLETE' as const, quality: 0.96, time: '4m 28s', reviewer: 'Auto-QA' },
    { language: 'Thai', code: 'th', status: 'COMPLETE' as const, quality: 0.94, time: '5m 38s', reviewer: 'Auto-QA + Human Spot Check' }
  ] as DemoTranslation[],
  summary: {
    totalLanguages: 15,
    averageQuality: 0.967,
    totalTime: '67 minutes',
    deadline: '2 hours',
    status: 'COMPLETED AHEAD OF SCHEDULE'
  }
};

// =============================================================================
// APOTHEOSIS SCENARIO: Nightly Red Team
// =============================================================================

export const APOTHEOSIS_DEMO_SCENARIO = {
  nightlyRun: {
    runId: 'APO-2026-0104-NIGHTLY',
    startTime: '2026-01-04T02:00:00Z',
    endTime: '2026-01-04T04:23:17Z',
    duration: '2 hours 23 minutes',
    attacksAttempted: 1247,
    vulnerabilitiesFound: 3,
    autoPatchesDeployed: 2,
    humanEscalations: 1
  },
  attackCategories: [
    { category: 'Prompt Injection', attacks: 312, successful: 1, blocked: 311 },
    { category: 'Jailbreak Attempts', attacks: 245, successful: 0, blocked: 245 },
    { category: 'Data Extraction', attacks: 198, successful: 1, blocked: 197 },
    { category: 'Role Manipulation', attacks: 167, successful: 0, blocked: 167 },
    { category: 'Context Overflow', attacks: 156, successful: 1, blocked: 155 },
    { category: 'Encoding Bypass', attacks: 169, successful: 0, blocked: 169 }
  ],
  vulnerabilities: [
    { id: 'VULN-001', type: 'Base64 Prompt Injection', severity: 'High' as const, attackVector: 'Base64-encoded instruction injection', description: 'Attacker can embed base64-encoded system prompts that bypass input sanitization', status: 'AUTO_PATCHED' as const, patchDeployed: '2026-01-04T03:15:22Z' },
    { id: 'VULN-002', type: 'Document Metadata Injection', severity: 'Medium' as const, attackVector: 'Indirect prompt injection via PDF metadata', description: 'Malicious instructions in PDF metadata fields processed by document extractor', status: 'AUTO_PATCHED' as const, patchDeployed: '2026-01-04T03:42:08Z' },
    { id: 'VULN-003', type: 'Context Overflow Attack', severity: 'Critical' as const, attackVector: 'Token exhaustion causing context truncation', description: 'Extremely long inputs can push system prompt out of context window', status: 'ESCALATED' as const }
  ] as DemoVulnerability[],
  trend: [
    { date: '2025-10-04', attacks: 1100, vulnerabilities: 8, patchRate: 0.75 },
    { date: '2025-11-04', attacks: 1180, vulnerabilities: 5, patchRate: 0.80 },
    { date: '2025-12-04', attacks: 1220, vulnerabilities: 4, patchRate: 0.85 },
    { date: '2026-01-04', attacks: 1247, vulnerabilities: 3, patchRate: 0.92 }
  ]
};

// =============================================================================
// DISSENT SCENARIO: Vendor Contract Dissent
// =============================================================================

export const DISSENT_DEMO_SCENARIO = {
  originalDecision: {
    decisionId: 'dlb-2025-0915-vendor-001',
    title: 'CloudMatrix Vendor Contract Approval',
    date: '2025-09-15',
    outcome: 'APPROVED',
    value: 4500000,
    councilVote: '5-1 in favor'
  },
  dissentFiling: {
    dissentId: 'DIS-2025-0915-001',
    filedBy: 'Anonymous (Protected)',
    filedDate: '2025-09-15T16:45:00Z',
    position: 'OPPOSE',
    prediction: 'Contract will result in significant cost overruns and service failures within 18 months'
  },
  arguments: [
    'CloudMatrix has lost 2 major customers in the past 6 months due to reliability issues',
    'Their pricing is 23% above comparable vendors with better track records',
    'Financial statements show concerning debt-to-equity ratio of 3.2',
    'No contractual SLA guarantees for uptime - only "best effort" language',
    'Key technical staff have departed in recent months'
  ],
  outcomeTracking: {
    trackingPeriod: '18 months',
    checkpoints: [
      { date: '2025-12-15', status: 'COMPLETED', finding: 'First service outage - 4 hours downtime' },
      { date: '2026-03-15', status: 'COMPLETED', finding: 'Second outage - 8 hours. SLA dispute initiated' },
      { date: '2026-06-15', status: 'COMPLETED', finding: 'CloudMatrix announces restructuring' },
      { date: '2026-09-15', status: 'PENDING', finding: 'Contract renewal decision point' }
    ],
    currentStatus: 'DISSENT VALIDATED',
    actualOutcome: 'CloudMatrix filed for bankruptcy protection. Contract terminated early with $1.2M in sunk costs.'
  },
  vindication: {
    originalPrediction: 'Cost overruns and service failures within 18 months',
    actualOutcome: 'Vendor bankruptcy, $1.2M loss, 3 major outages',
    accuracy: 0.92,
    policyChanges: [
      'Added mandatory financial health score to vendor evaluation',
      'Increased reference check requirements from 3 to 5',
      'Created SLA template with minimum uptime requirements'
    ]
  }
};

// =============================================================================
// WITNESS SCENARIO: Regulatory Audit Response
// =============================================================================

export const WITNESS_DEMO_SCENARIO = {
  regulatorRequest: {
    requestId: 'REG-2026-0104-FDA-001',
    regulator: 'FDA - Office of Regulatory Affairs',
    requestDate: '2026-01-04',
    deadline: '5 business days',
    targetDecisionId: 'dlb-2025-0715-clinical-001',
    targetDecisionTitle: 'Phase III Clinical Trial Continuation Decision',
    targetDecisionDate: '2025-07-15'
  },
  decisionRecord: {
    decisionId: 'dlb-2025-0715-clinical-001',
    title: 'Phase III Clinical Trial Continuation Decision',
    outcome: 'CONTINUE_WITH_MODIFICATIONS',
    context: 'Review of interim safety data from Phase III trial of CardioMax-2 showing unexpected cardiac events in 3 patients (0.8% of cohort).'
  },
  agents: [
    { role: 'Clinical Strategist', vote: 'CONTINUE_WITH_MODIFICATIONS', confidence: 0.82, reasoning: 'Event rate within acceptable range for this patient population. Enhanced monitoring protocol addresses safety concerns.' },
    { role: 'Safety Analyst', vote: 'PAUSE_FOR_REVIEW', confidence: 0.71, reasoning: 'Cardiac events warrant deeper analysis. Recommend 30-day pause to review all adverse event data.' },
    { role: 'Regulatory Compliance', vote: 'CONTINUE_WITH_MODIFICATIONS', confidence: 0.88, reasoning: 'FDA guidance allows continuation with enhanced monitoring. Protocol amendment required within 14 days.' },
    { role: 'Red Team', vote: 'CONTINUE_WITH_MODIFICATIONS', confidence: 0.75, reasoning: 'Stress-tested worst-case scenarios. Risk acceptable with proposed mitigations.' },
    { role: 'Ethics Officer', vote: 'CONTINUE_WITH_MODIFICATIONS', confidence: 0.79, reasoning: 'Patient benefit outweighs risk with enhanced consent and monitoring.' },
    { role: 'Arbiter', vote: 'CONTINUE_WITH_MODIFICATIONS', confidence: 0.84, reasoning: 'Consensus achieved on modified continuation. Safety Analyst dissent noted and addressed in protocol.' }
  ],
  cryptographicProof: {
    merkleRoot: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    signature: 'RSA-PSS:MGYCMQCNp8...',
    signedAt: '2025-07-15T16:05:00Z',
    keyId: 'cendia-signing-key-2025',
    verified: true
  },
  exportPackage: {
    packageId: 'exp-2026-0104-001',
    format: 'PDF/A-3 + JSON',
    totalPages: 131,
    totalSizeMB: 12.4,
    generationTime: '< 30 seconds'
  }
};

// =============================================================================
// EXPORT ALL SCENARIOS
// =============================================================================

export const DEMO_SCENARIOS = {
  council: COUNCIL_DEMO_SCENARIO,
  chronos: CHRONOS_DEMO_SCENARIO,
  cascade: CASCADE_DEMO_SCENARIO,
  oversight: OVERSIGHT_DEMO_SCENARIO,
  crucible: CRUCIBLE_DEMO_SCENARIO,
  guard: GUARD_DEMO_SCENARIO,
  gnosis: GNOSIS_DEMO_SCENARIO,
  omnitranslate: OMNITRANSLATE_DEMO_SCENARIO,
  apotheosis: APOTHEOSIS_DEMO_SCENARIO,
  dissent: DISSENT_DEMO_SCENARIO,
  witness: WITNESS_DEMO_SCENARIO
};

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS;
