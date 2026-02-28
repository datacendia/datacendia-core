// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * EU AI Act Compliance Engine
 * 
 * Implements genuine compliance checks per Regulation (EU) 2024/1689
 * (the "AI Act"), which entered into force 1 August 2024.
 * 
 * Key timelines:
 * - 2 Feb 2025: Prohibited AI practices (Title II) apply
 * - 2 Aug 2025: GPAI model obligations (Chapter V) apply
 * - 2 Aug 2026: High-risk AI system obligations (Title III, Chapter 2-5) apply
 * - 2 Aug 2027: High-risk AI in Annex I (existing EU legislation) apply
 * 
 * Banking-specific focus:
 * - Credit scoring AI → High-risk (Annex III, Area 5(b))
 * - Fraud detection → High-risk (Annex III, Area 5(b))
 * - AML/KYC screening → High-risk (Annex III, Area 5(b))
 * - Insurance pricing → High-risk (Annex III, Area 5(b))
 * - HR/recruitment AI → High-risk (Annex III, Area 4)
 * - Customer service chatbots → Limited risk (transparency obligations)
 * 
 * All article references are to Regulation (EU) 2024/1689 unless noted.
 */

import crypto from 'crypto';
import { logger } from '../../../utils/logger.js';

// =============================================================================
// TYPES — AI System Classification
// =============================================================================

/** Risk category per Title I Art. 6 and Annex III */
export type AIRiskLevel = 'unacceptable' | 'high' | 'limited' | 'minimal';

/** Annex III areas relevant to banking — Art. 6(2) */
export type AnnexIIIArea =
  | 'biometric-identification'      // Area 1 — remote biometric ID in public spaces
  | 'critical-infrastructure'       // Area 2
  | 'education-vocational'          // Area 3
  | 'employment-workers'            // Area 4 — recruitment, performance, termination
  | 'essential-services'            // Area 5 — CREDIT SCORING, insurance, public benefits
  | 'law-enforcement'               // Area 6
  | 'migration-asylum'              // Area 7
  | 'justice-democracy'             // Area 8
  ;

/** Conformity assessment route — Art. 43 */
export type ConformityRoute = 'self-assessment' | 'third-party' | 'notified-body';

/** AI system registration for the EU database — Art. 49 */
export interface AISystemRegistration {
  id: string;
  systemName: string;
  provider: string;
  deployer: string;
  purpose: string;
  riskLevel: AIRiskLevel;
  annexIIIArea?: AnnexIIIArea;
  registeredAt: Date;
  euDatabaseId?: string; // Art. 71 — EU database registration number
}

// =============================================================================
// TYPES — AI System Inventory (what the bank actually uses)
// =============================================================================

export interface AISystemDescriptor {
  id: string;
  name: string;
  version: string;
  description: string;
  provider: 'internal' | 'third-party';
  providerName: string;
  deploymentDate: Date;
  lastUpdated: Date;

  // Classification inputs
  purpose: string;
  domain: BankingAIDomain;
  usesPersonalData: boolean;
  usesSpecialCategoryData: boolean; // Art. 9 GDPR — race, health, etc.
  affectsNaturalPersons: boolean;
  isAutonomous: boolean;            // Makes decisions without human review
  outputType: 'recommendation' | 'decision' | 'score' | 'classification' | 'generation';

  // Technical characteristics
  modelType: string;                // e.g. "XGBoost", "Neural Network", "LLM"
  trainingDataSize: number;
  trainingDataSources: string[];
  performanceMetrics: Record<string, number>; // e.g. { accuracy: 0.92, auc: 0.87 }
  biasMetrics?: Record<string, number>;

  // Operational
  monthlyInferences: number;
  averageLatencyMs: number;
  humanOversightLevel: HumanOversightLevel;
  fallbackProcess: string;          // What happens when AI fails
}

export type BankingAIDomain =
  | 'credit-scoring'
  | 'credit-decisioning'
  | 'fraud-detection'
  | 'aml-screening'
  | 'kyc-verification'
  | 'insurance-pricing'
  | 'insurance-claims'
  | 'market-risk'
  | 'algorithmic-trading'
  | 'customer-service-chatbot'
  | 'document-processing'
  | 'hr-recruitment'
  | 'hr-performance'
  | 'marketing-personalisation'
  | 'collections'
  | 'regulatory-reporting'
  | 'internal-audit'
  | 'other'
  ;

/** Art. 14 — Human oversight levels */
export type HumanOversightLevel =
  | 'human-in-the-loop'      // Human approves every decision
  | 'human-on-the-loop'      // Human can intervene/override
  | 'human-over-the-loop'    // Human monitors aggregate outcomes
  | 'fully-autonomous'        // No human involvement (prohibited for high-risk in banking)
  ;

// =============================================================================
// TYPES — Compliance Assessment Results
// =============================================================================

export interface AIActClassificationResult {
  systemId: string;
  systemName: string;
  riskLevel: AIRiskLevel;
  annexIIIArea?: AnnexIIIArea;
  classificationRationale: string[];
  applicableArticles: string[];
  obligations: AIActObligation[];
  deadline: Date;                    // When obligations must be met
  timestamp: Date;
  hash: string;
}

export interface AIActObligation {
  id: string;
  article: string;
  title: string;
  description: string;
  category: ObligationCategory;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  evidence?: string;
  dueDate: Date;
}

export type ObligationCategory =
  | 'risk-management'        // Art. 9
  | 'data-governance'        // Art. 10
  | 'technical-documentation'// Art. 11
  | 'record-keeping'         // Art. 12
  | 'transparency'           // Art. 13
  | 'human-oversight'        // Art. 14
  | 'accuracy-robustness'    // Art. 15
  | 'conformity-assessment'  // Art. 43
  | 'registration'           // Art. 49
  | 'post-market-monitoring' // Art. 72
  | 'incident-reporting'     // Art. 73
  | 'fria'                   // Art. 27 — Fundamental Rights Impact Assessment
  ;

export interface FRIAResult {
  systemId: string;
  systemName: string;
  assessmentDate: Date;
  assessor: string;

  // Art. 27(1) — assessment categories
  processDescription: string;
  intendedPurpose: string;
  deploymentScope: {
    geographicScope: string;
    temporalScope: string;
    affectedPersons: string;
    estimatedAffectedCount: number;
  };

  // Art. 27(2) — fundamental rights assessed
  rightsAssessment: FundamentalRightAssessment[];

  // Art. 27(3) — risk mitigation
  mitigationMeasures: MitigationMeasure[];

  // Outcome
  overallRiskScore: number;          // 0-100
  recommendation: 'proceed' | 'proceed-with-conditions' | 'halt' | 'redesign';
  conditions?: string[];
  nextReviewDate: Date;
  hash: string;
}

export interface FundamentalRightAssessment {
  right: FundamentalRight;
  charterArticle: string;           // EU Charter of Fundamental Rights article
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  impact: string;
  affectedGroups: string[];
  likelihoodScore: number;          // 1-5
  severityScore: number;            // 1-5
  riskScore: number;                // likelihood × severity (1-25)
  justification: string;
}

export type FundamentalRight =
  | 'human-dignity'                 // Charter Art. 1
  | 'non-discrimination'            // Charter Art. 21
  | 'gender-equality'               // Charter Art. 23
  | 'personal-data-protection'      // Charter Art. 8
  | 'private-life'                  // Charter Art. 7
  | 'freedom-expression'            // Charter Art. 11
  | 'right-to-property'             // Charter Art. 17
  | 'social-security'               // Charter Art. 34
  | 'consumer-protection'           // Charter Art. 38
  | 'effective-remedy'              // Charter Art. 47
  | 'fair-trial'                    // Charter Art. 47
  | 'childrens-rights'              // Charter Art. 24
  ;

export interface MitigationMeasure {
  id: string;
  rightAddressed: FundamentalRight;
  measure: string;
  implementationStatus: 'implemented' | 'planned' | 'under-review';
  effectivenessRating: 'high' | 'medium' | 'low';
  responsiblePerson: string;
  deadline: Date;
}

// =============================================================================
// TYPES — Technical Documentation (Art. 11)
// =============================================================================

export interface TechnicalDocumentation {
  systemId: string;
  // Annex IV requirements
  generalDescription: {
    intendedPurpose: string;
    provider: string;
    versionHistory: { version: string; date: Date; changes: string }[];
    interactionWithOtherSystems: string[];
    hardwareRequirements: string;
  };
  riskManagementSystem: {
    identifiedRisks: { risk: string; likelihood: number; severity: number; mitigation: string }[];
    residualRisks: string[];
    testingMethodology: string;
    validationResults: string;
  };
  dataGovernance: {
    trainingDataDescription: string;
    dataPreparation: string;
    biasExamination: string;
    dataGaps: string[];
    dataQualityMetrics: Record<string, number>;
  };
  designSpecifications: {
    architecture: string;
    algorithmDescription: string;
    keyDesignChoices: string[];
    tradeoffs: string[];
  };
  monitoringPlan: {
    performanceMetrics: string[];
    monitoringFrequency: string;
    driftDetectionMethod: string;
    retrainingTriggers: string[];
  };
  completeness: number; // 0-100
  lastUpdated: Date;
  hash: string;
}

// =============================================================================
// DOMAIN CLASSIFICATION MAP
// =============================================================================

/**
 * Maps banking AI domains to their EU AI Act risk classification.
 * Based on Annex III and recitals 37-48 of Regulation (EU) 2024/1689.
 */
const BANKING_DOMAIN_CLASSIFICATION: Record<BankingAIDomain, {
  riskLevel: AIRiskLevel;
  annexIIIArea?: AnnexIIIArea;
  rationale: string;
  articles: string[];
}> = {
  'credit-scoring': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'Annex III, Area 5(b): AI systems used to evaluate creditworthiness of natural persons. Directly affects access to essential financial services.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)', 'Recital 37'],
  },
  'credit-decisioning': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'Annex III, Area 5(b): AI systems used to make credit decisions. Autonomous credit decisions on natural persons are high-risk.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)'],
  },
  'fraud-detection': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'AI systems that may block access to financial services (account freezing, transaction blocking) are high-risk per Annex III Area 5(b).',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)'],
  },
  'aml-screening': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'AML screening can result in account closure or transaction blocking, directly affecting access to essential services.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)', 'Annex III Area 6(a)'],
  },
  'kyc-verification': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'KYC decisions gate access to financial services. Biometric ID components may trigger Area 1.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)', 'Annex III Area 1'],
  },
  'insurance-pricing': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'Annex III, Area 5(b): AI used for risk assessment and pricing in life and health insurance.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)'],
  },
  'insurance-claims': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'AI-driven claims decisions directly affect individuals\' access to insurance benefits.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)'],
  },
  'market-risk': {
    riskLevel: 'limited',
    rationale: 'Internal risk management AI does not directly affect natural persons. Transparency obligations apply.',
    articles: ['Art. 50'],
  },
  'algorithmic-trading': {
    riskLevel: 'limited',
    rationale: 'Algorithmic trading systems do not make decisions about natural persons. Subject to MiFID II/MAR separately.',
    articles: ['Art. 50'],
  },
  'customer-service-chatbot': {
    riskLevel: 'limited',
    rationale: 'Art. 50(1): AI systems interacting with natural persons must disclose they are AI. No high-risk classification unless decisions are made.',
    articles: ['Art. 50(1)'],
  },
  'document-processing': {
    riskLevel: 'minimal',
    rationale: 'Document OCR/extraction is minimal risk unless it involves decision-making about natural persons.',
    articles: ['Recital 30'],
  },
  'hr-recruitment': {
    riskLevel: 'high',
    annexIIIArea: 'employment-workers',
    rationale: 'Annex III, Area 4(a): AI systems used for recruitment, screening, or filtering of candidates.',
    articles: ['Art. 6(2)', 'Annex III Area 4(a)'],
  },
  'hr-performance': {
    riskLevel: 'high',
    annexIIIArea: 'employment-workers',
    rationale: 'Annex III, Area 4(b): AI systems used to make decisions affecting terms of work relationships.',
    articles: ['Art. 6(2)', 'Annex III Area 4(b)'],
  },
  'marketing-personalisation': {
    riskLevel: 'limited',
    rationale: 'Personalisation AI is limited risk. Must disclose AI involvement per Art. 50. May be high-risk if it restricts access to services.',
    articles: ['Art. 50'],
  },
  'collections': {
    riskLevel: 'high',
    annexIIIArea: 'essential-services',
    rationale: 'Collections AI can affect access to essential services and involves assessment of natural persons\' financial situation.',
    articles: ['Art. 6(2)', 'Annex III Area 5(b)'],
  },
  'regulatory-reporting': {
    riskLevel: 'minimal',
    rationale: 'Internal regulatory reporting AI does not make decisions about natural persons.',
    articles: ['Recital 30'],
  },
  'internal-audit': {
    riskLevel: 'minimal',
    rationale: 'Internal audit AI is minimal risk — does not directly affect natural persons.',
    articles: ['Recital 30'],
  },
  'other': {
    riskLevel: 'limited',
    rationale: 'Unclassified AI system. Manual classification required based on specific use case and whether it affects natural persons.',
    articles: ['Art. 6'],
  },
};

// =============================================================================
// HIGH-RISK OBLIGATIONS — Art. 8-15 + Art. 27, 43, 49, 72, 73
// =============================================================================

function generateHighRiskObligations(system: AISystemDescriptor, dueDate: Date): AIActObligation[] {
  return [
    {
      id: `${system.id}-rms`,
      article: 'Art. 9',
      title: 'Risk Management System',
      description: 'Establish, implement, document and maintain a risk management system throughout the AI system lifecycle. Must include: identification/analysis of known and foreseeable risks, estimation/evaluation of risks, adoption of risk management measures, testing procedures.',
      category: 'risk-management',
      priority: 'critical',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-dg`,
      article: 'Art. 10',
      title: 'Data and Data Governance',
      description: 'Training, validation and testing data sets shall be subject to data governance practices: relevant design choices, data collection processes, data preparation (annotation, labelling, cleaning, enrichment), formulation of assumptions, assessment of availability/quantity/suitability, examination for possible biases, identification of data gaps.',
      category: 'data-governance',
      priority: 'critical',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-td`,
      article: 'Art. 11',
      title: 'Technical Documentation',
      description: 'Draw up technical documentation per Annex IV before placing on market. Must be kept up-to-date. Includes: general description, risk management, data governance, design specifications, monitoring plan, applicable standards.',
      category: 'technical-documentation',
      priority: 'critical',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-rk`,
      article: 'Art. 12',
      title: 'Record-Keeping (Logging)',
      description: 'High-risk AI systems shall technically allow for automatic recording of events (logs) throughout the lifetime. Logging must include: period of use, reference database, input data, identification of natural persons involved in verification of results.',
      category: 'record-keeping',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-tr`,
      article: 'Art. 13',
      title: 'Transparency and Provision of Information to Deployers',
      description: 'Design and develop to ensure operation is sufficiently transparent to enable deployers to interpret output and use appropriately. Must include: characteristics, capabilities and limitations of performance; known/foreseeable circumstances of misuse; technical measures for human oversight; computational/hardware resources needed.',
      category: 'transparency',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-ho`,
      article: 'Art. 14',
      title: 'Human Oversight',
      description: 'Designed and developed so they can be effectively overseen by natural persons during use. Measures must enable the individuals to whom human oversight is assigned to: fully understand the capabilities and limitations, properly monitor operation, remain aware of automation bias, correctly interpret output, decide not to use or disregard/reverse output, intervene on operation or interrupt through a "stop" button.',
      category: 'human-oversight',
      priority: 'critical',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-ar`,
      article: 'Art. 15',
      title: 'Accuracy, Robustness and Cybersecurity',
      description: 'Designed and developed to achieve appropriate level of accuracy, robustness and cybersecurity. Performance must remain consistent. Must be resilient to errors, faults, inconsistencies, and attempts by unauthorised third parties to alter use or performance through adversarial attacks.',
      category: 'accuracy-robustness',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-ca`,
      article: 'Art. 43',
      title: 'Conformity Assessment',
      description: 'Before placing on market, high-risk AI systems in Annex III undergo conformity assessment. For financial services (Area 5), self-assessment (internal control) under Annex VI is permitted if provider applies harmonised standards. Otherwise, third-party assessment required.',
      category: 'conformity-assessment',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-reg`,
      article: 'Art. 49',
      title: 'EU Database Registration',
      description: 'Before placing on market or putting into service, the provider (or authorised representative) shall register the high-risk AI system in the EU database referred to in Art. 71.',
      category: 'registration',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-fria`,
      article: 'Art. 27',
      title: 'Fundamental Rights Impact Assessment (FRIA)',
      description: 'Deployers of high-risk AI systems referred to in Art. 6(2) that are bodies governed by public law, or private entities providing public services, AND deployers of high-risk AI systems in Annex III Area 5(b) (credit institutions) shall perform an assessment of the impact on fundamental rights before putting into service.',
      category: 'fria',
      priority: 'critical',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-pmm`,
      article: 'Art. 72',
      title: 'Post-Market Monitoring',
      description: 'Providers shall establish and document a post-market monitoring system proportionate to the nature of the AI system. The system shall actively and systematically collect, document, and analyse relevant data provided by deployers or collected through other sources.',
      category: 'post-market-monitoring',
      priority: 'medium',
      status: 'not-assessed',
      dueDate,
    },
    {
      id: `${system.id}-sir`,
      article: 'Art. 73',
      title: 'Serious Incident Reporting',
      description: 'Providers of high-risk AI systems shall report any serious incident to market surveillance authorities within 15 days (72 hours for widespread infringement). Serious incidents include those presenting a risk to health/safety/fundamental rights, causing death or serious damage to health/property/environment.',
      category: 'incident-reporting',
      priority: 'high',
      status: 'not-assessed',
      dueDate,
    },
  ];
}

// =============================================================================
// FUNDAMENTAL RIGHTS FOR BANKING FRIA
// =============================================================================

const BANKING_FUNDAMENTAL_RIGHTS: {
  right: FundamentalRight;
  charterArticle: string;
  bankingRelevance: string;
}[] = [
  {
    right: 'non-discrimination',
    charterArticle: 'Art. 21',
    bankingRelevance: 'Credit scoring and lending decisions must not discriminate on grounds of sex, race, colour, ethnic or social origin, genetic features, language, religion, political opinion, disability, age, or sexual orientation.',
  },
  {
    right: 'personal-data-protection',
    charterArticle: 'Art. 8',
    bankingRelevance: 'AI systems process personal and financial data. Must comply with GDPR and ensure data minimisation, purpose limitation, and data subject rights.',
  },
  {
    right: 'private-life',
    charterArticle: 'Art. 7',
    bankingRelevance: 'Financial profiling and monitoring of banking behaviour can intrude on private life. Proportionality required.',
  },
  {
    right: 'human-dignity',
    charterArticle: 'Art. 1',
    bankingRelevance: 'Automated decisions about creditworthiness must respect human dignity. No social scoring. Individuals must not be reduced to a data point.',
  },
  {
    right: 'right-to-property',
    charterArticle: 'Art. 17',
    bankingRelevance: 'AI-driven account freezing, collections, or asset seizure decisions directly affect property rights.',
  },
  {
    right: 'consumer-protection',
    charterArticle: 'Art. 38',
    bankingRelevance: 'Banking AI must ensure a high level of consumer protection. Pricing algorithms must be fair and transparent.',
  },
  {
    right: 'effective-remedy',
    charterArticle: 'Art. 47',
    bankingRelevance: 'Individuals must have access to meaningful explanation and effective remedy when AI-assisted decisions adversely affect them.',
  },
  {
    right: 'gender-equality',
    charterArticle: 'Art. 23',
    bankingRelevance: 'Credit scoring must not result in gender-based disparities. Gender pay gap data must not leak into credit decisions.',
  },
  {
    right: 'social-security',
    charterArticle: 'Art. 34',
    bankingRelevance: 'Access to financial services is increasingly essential. AI gatekeeping must not undermine social security or financial inclusion.',
  },
];

// =============================================================================
// ENGINE
// =============================================================================

export class EUAIActEngine {

  // ---------------------------------------------------------------------------
  // RISK CLASSIFICATION — Art. 6 + Annex III
  // ---------------------------------------------------------------------------

  /**
   * Classify an AI system per Art. 6 and Annex III.
   * Returns the risk level, applicable articles, and obligations.
   */
  classifySystem(system: AISystemDescriptor): AIActClassificationResult {
    const domainConfig = BANKING_DOMAIN_CLASSIFICATION[system.domain];
    let riskLevel = domainConfig.riskLevel;
    const rationale: string[] = [domainConfig.rationale];
    const articles: string[] = [...domainConfig.articles];

    // Art. 6(3) exception: if AI system performs narrow procedural task,
    // improves result of previously completed human activity,
    // detects decision-making patterns without replacing human assessment,
    // or performs preparatory task — it MAY be downgraded.
    // However, for banking credit scoring this exception does NOT apply
    // per Recital 37 which explicitly includes creditworthiness assessment.

    // Check for prohibited practices — Art. 5
    if (this.isProhibited(system)) {
      riskLevel = 'unacceptable';
      rationale.push('System matches prohibited AI practice under Art. 5.');
      articles.push('Art. 5');
    }

    // Upgrade to high-risk if system is autonomous and affects natural persons
    if (riskLevel === 'limited' && system.isAutonomous && system.affectsNaturalPersons) {
      riskLevel = 'high';
      rationale.push('System is autonomous and directly affects natural persons — upgraded to high-risk per Art. 6(1).');
      articles.push('Art. 6(1)');
    }

    // Generate obligations based on risk level
    const dueDate = new Date('2026-08-02'); // Art. 113(1) — Annex III high-risk deadline
    const obligations = riskLevel === 'high'
      ? generateHighRiskObligations(system, dueDate)
      : riskLevel === 'limited'
        ? this.generateLimitedRiskObligations(system, dueDate)
        : [];

    const content = { systemId: system.id, riskLevel, articles };
    const hash = crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');

    return {
      systemId: system.id,
      systemName: system.name,
      riskLevel,
      annexIIIArea: domainConfig.annexIIIArea,
      classificationRationale: rationale,
      applicableArticles: articles,
      obligations,
      deadline: dueDate,
      timestamp: new Date(),
      hash,
    };
  }

  // ---------------------------------------------------------------------------
  // PROHIBITED PRACTICES CHECK — Art. 5
  // ---------------------------------------------------------------------------

  /**
   * Check if an AI system falls under prohibited practices (Art. 5).
   * In banking context, the main risks are:
   * - Social scoring (Art. 5(1)(c))
   * - Exploitation of vulnerabilities (Art. 5(1)(b))
   * - Subliminal manipulation (Art. 5(1)(a))
   */
  isProhibited(system: AISystemDescriptor): boolean {
    // Art. 5(1)(c): Social scoring — using AI to evaluate trustworthiness
    // based on social behaviour or personality characteristics, leading to
    // detrimental treatment disproportionate to severity
    if (system.domain === 'credit-scoring' && system.usesSpecialCategoryData) {
      // Using special category data (race, religion, health) for credit scoring
      // could constitute prohibited social scoring if it leads to
      // unjustified detrimental treatment in unrelated contexts
      // Note: Using such data for credit scoring is NOT per se prohibited,
      // but the system must be carefully assessed
      logger.warn(`[EUAIAct] System ${system.id}: Uses special category data for credit scoring — review for Art. 5(1)(c) social scoring prohibition`);
    }

    // Art. 5(1)(b): Exploiting vulnerabilities of specific groups
    // (age, disability, social/economic situation)
    // Banking AI targeting financially vulnerable persons could trigger this

    return false; // Conservative: flag but don't auto-prohibit
  }

  // ---------------------------------------------------------------------------
  // FUNDAMENTAL RIGHTS IMPACT ASSESSMENT — Art. 27
  // ---------------------------------------------------------------------------

  /**
   * Conduct a Fundamental Rights Impact Assessment per Art. 27.
   * Required for credit institutions deploying Annex III Area 5(b) AI systems.
   * 
   * This is a structured assessment — the actual risk scores must be
   * determined by human assessors. The engine provides the framework
   * and calculates aggregate risk scores.
   */
  conductFRIA(
    system: AISystemDescriptor,
    assessor: string,
    rightsAssessments: FundamentalRightAssessment[],
    mitigationMeasures: MitigationMeasure[]
  ): FRIAResult {
    // Calculate overall risk score — weighted average of individual right scores
    // Normalised to 0-100 scale (25 = max individual score × 4 = 100)
    const maxPossibleScore = 25; // 5 × 5
    const avgRiskScore = rightsAssessments.length > 0
      ? rightsAssessments.reduce((sum, r) => sum + r.riskScore, 0) / rightsAssessments.length
      : 0;
    const overallRiskScore = (avgRiskScore / maxPossibleScore) * 100;

    // Determine recommendation based on risk score and mitigation effectiveness
    const highRiskRights = rightsAssessments.filter(r => r.riskLevel === 'high');
    const unmitigatedHighRisks = highRiskRights.filter(hr =>
      !mitigationMeasures.some(m =>
        m.rightAddressed === hr.right &&
        m.implementationStatus === 'implemented' &&
        m.effectivenessRating === 'high'
      )
    );

    let recommendation: FRIAResult['recommendation'];
    const conditions: string[] = [];

    if (overallRiskScore >= 80 || unmitigatedHighRisks.length >= 3) {
      recommendation = 'halt';
      conditions.push('Unacceptable level of fundamental rights risk. System must be redesigned before deployment.');
    } else if (overallRiskScore >= 60 || unmitigatedHighRisks.length >= 2) {
      recommendation = 'redesign';
      conditions.push('Significant fundamental rights risks require design changes before deployment.');
      unmitigatedHighRisks.forEach(r => {
        conditions.push(`Address high risk to ${r.right} (Charter ${r.charterArticle})`);
      });
    } else if (overallRiskScore >= 30 || unmitigatedHighRisks.length >= 1) {
      recommendation = 'proceed-with-conditions';
      unmitigatedHighRisks.forEach(r => {
        conditions.push(`Implement effective mitigation for ${r.right} before full deployment`);
      });
      conditions.push('Mandatory review after 6 months of operation');
    } else {
      recommendation = 'proceed';
    }

    // Next review: minimum annually, sooner if high risk
    const nextReview = new Date();
    nextReview.setMonth(nextReview.getMonth() + (overallRiskScore >= 50 ? 6 : 12));

    const content = { systemId: system.id, overallRiskScore, recommendation };
    const hash = crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');

    return {
      systemId: system.id,
      systemName: system.name,
      assessmentDate: new Date(),
      assessor,
      processDescription: `Fundamental Rights Impact Assessment for ${system.name} conducted per Art. 27 of Regulation (EU) 2024/1689. Assessment covers ${rightsAssessments.length} fundamental rights from the EU Charter of Fundamental Rights.`,
      intendedPurpose: system.purpose,
      deploymentScope: {
        geographicScope: 'European Economic Area',
        temporalScope: 'Ongoing — continuous deployment',
        affectedPersons: this.getAffectedPersonsDescription(system),
        estimatedAffectedCount: system.monthlyInferences * 12,
      },
      rightsAssessment: rightsAssessments,
      mitigationMeasures,
      overallRiskScore,
      recommendation,
      conditions: conditions.length > 0 ? conditions : undefined,
      nextReviewDate: nextReview,
      hash,
    };
  }

  /**
   * Generate a pre-populated FRIA template for a banking AI system.
   * Assessors must review and adjust scores — this provides the framework only.
   */
  generateFRIATemplate(system: AISystemDescriptor): {
    rights: FundamentalRightAssessment[];
    suggestedMitigations: MitigationMeasure[];
  } {
    const rights: FundamentalRightAssessment[] = BANKING_FUNDAMENTAL_RIGHTS.map(r => ({
      right: r.right,
      charterArticle: r.charterArticle,
      riskLevel: 'medium' as const,   // Default — assessor must override
      impact: r.bankingRelevance,
      affectedGroups: this.getAffectedGroups(system, r.right),
      likelihoodScore: 3,              // Default midpoint — assessor must override
      severityScore: 3,                // Default midpoint — assessor must override
      riskScore: 9,                    // 3 × 3 — assessor must override
      justification: 'Pending human assessor review. This template score must be replaced with a justified assessment.',
    }));

    const suggestedMitigations: MitigationMeasure[] = [
      {
        id: `${system.id}-mit-bias`,
        rightAddressed: 'non-discrimination',
        measure: 'Implement statistical parity and disparate impact testing across protected characteristics. Test quarterly.',
        implementationStatus: 'planned',
        effectivenessRating: 'high',
        responsiblePerson: 'Chief Data Officer',
        deadline: new Date('2026-08-02'),
      },
      {
        id: `${system.id}-mit-explain`,
        rightAddressed: 'effective-remedy',
        measure: 'Implement model explainability (SHAP/LIME) and provide natural-language explanations for adverse decisions per GDPR Art. 22.',
        implementationStatus: 'planned',
        effectivenessRating: 'high',
        responsiblePerson: 'Head of AI/ML',
        deadline: new Date('2026-08-02'),
      },
      {
        id: `${system.id}-mit-human`,
        rightAddressed: 'human-dignity',
        measure: 'Ensure human-in-the-loop review for all adverse automated decisions. No fully autonomous denials of service.',
        implementationStatus: 'planned',
        effectivenessRating: 'high',
        responsiblePerson: 'Chief Risk Officer',
        deadline: new Date('2026-08-02'),
      },
      {
        id: `${system.id}-mit-privacy`,
        rightAddressed: 'personal-data-protection',
        measure: 'Conduct DPIA per GDPR Art. 35. Apply data minimisation. Implement differential privacy where feasible.',
        implementationStatus: 'planned',
        effectivenessRating: 'medium',
        responsiblePerson: 'Data Protection Officer',
        deadline: new Date('2026-08-02'),
      },
      {
        id: `${system.id}-mit-appeal`,
        rightAddressed: 'effective-remedy',
        measure: 'Establish formal appeals process for AI-assisted decisions. Human review within 5 business days.',
        implementationStatus: 'planned',
        effectivenessRating: 'high',
        responsiblePerson: 'Head of Complaints',
        deadline: new Date('2026-08-02'),
      },
    ];

    return { rights, suggestedMitigations };
  }

  // ---------------------------------------------------------------------------
  // TECHNICAL DOCUMENTATION COMPLETENESS — Art. 11 + Annex IV
  // ---------------------------------------------------------------------------

  /**
   * Assess completeness of technical documentation per Annex IV.
   * Returns a score (0-100) and list of missing/incomplete sections.
   */
  assessDocumentation(doc: TechnicalDocumentation): {
    completeness: number;
    missing: string[];
    recommendations: string[];
  } {
    const checks: { field: string; label: string; check: () => boolean }[] = [
      { field: 'generalDescription.intendedPurpose', label: 'Intended purpose (Annex IV, 1(a))', check: () => !!doc.generalDescription.intendedPurpose },
      { field: 'generalDescription.provider', label: 'Provider identification (Annex IV, 1(b))', check: () => !!doc.generalDescription.provider },
      { field: 'generalDescription.versionHistory', label: 'Version history (Annex IV, 1(c))', check: () => doc.generalDescription.versionHistory.length > 0 },
      { field: 'generalDescription.interactionWithOtherSystems', label: 'System interactions (Annex IV, 1(d))', check: () => doc.generalDescription.interactionWithOtherSystems.length > 0 },
      { field: 'generalDescription.hardwareRequirements', label: 'Hardware requirements (Annex IV, 1(e))', check: () => !!doc.generalDescription.hardwareRequirements },
      { field: 'riskManagementSystem.identifiedRisks', label: 'Risk identification (Annex IV, 2(a))', check: () => doc.riskManagementSystem.identifiedRisks.length > 0 },
      { field: 'riskManagementSystem.residualRisks', label: 'Residual risks (Annex IV, 2(b))', check: () => doc.riskManagementSystem.residualRisks.length > 0 },
      { field: 'riskManagementSystem.testingMethodology', label: 'Testing methodology (Annex IV, 2(c))', check: () => !!doc.riskManagementSystem.testingMethodology },
      { field: 'riskManagementSystem.validationResults', label: 'Validation results (Annex IV, 2(d))', check: () => !!doc.riskManagementSystem.validationResults },
      { field: 'dataGovernance.trainingDataDescription', label: 'Training data description (Annex IV, 3(a))', check: () => !!doc.dataGovernance.trainingDataDescription },
      { field: 'dataGovernance.dataPreparation', label: 'Data preparation methods (Annex IV, 3(b))', check: () => !!doc.dataGovernance.dataPreparation },
      { field: 'dataGovernance.biasExamination', label: 'Bias examination (Annex IV, 3(c))', check: () => !!doc.dataGovernance.biasExamination },
      { field: 'dataGovernance.dataGaps', label: 'Data gaps identified (Annex IV, 3(d))', check: () => doc.dataGovernance.dataGaps.length > 0 },
      { field: 'designSpecifications.architecture', label: 'System architecture (Annex IV, 4(a))', check: () => !!doc.designSpecifications.architecture },
      { field: 'designSpecifications.algorithmDescription', label: 'Algorithm description (Annex IV, 4(b))', check: () => !!doc.designSpecifications.algorithmDescription },
      { field: 'designSpecifications.keyDesignChoices', label: 'Key design choices (Annex IV, 4(c))', check: () => doc.designSpecifications.keyDesignChoices.length > 0 },
      { field: 'monitoringPlan.performanceMetrics', label: 'Performance metrics (Annex IV, 5(a))', check: () => doc.monitoringPlan.performanceMetrics.length > 0 },
      { field: 'monitoringPlan.monitoringFrequency', label: 'Monitoring frequency (Annex IV, 5(b))', check: () => !!doc.monitoringPlan.monitoringFrequency },
      { field: 'monitoringPlan.driftDetectionMethod', label: 'Drift detection (Annex IV, 5(c))', check: () => !!doc.monitoringPlan.driftDetectionMethod },
      { field: 'monitoringPlan.retrainingTriggers', label: 'Retraining triggers (Annex IV, 5(d))', check: () => doc.monitoringPlan.retrainingTriggers.length > 0 },
    ];

    const missing: string[] = [];
    let passCount = 0;

    for (const check of checks) {
      if (check.check()) {
        passCount++;
      } else {
        missing.push(check.label);
      }
    }

    const completeness = Math.round((passCount / checks.length) * 100);

    const recommendations: string[] = [];
    if (completeness < 100) {
      recommendations.push(`Technical documentation is ${completeness}% complete. ${missing.length} sections require attention before conformity assessment.`);
    }
    if (missing.some(m => m.includes('bias'))) {
      recommendations.push('Bias examination is mandatory for high-risk AI in banking. Conduct disparate impact analysis across protected characteristics.');
    }
    if (missing.some(m => m.includes('Validation'))) {
      recommendations.push('Validation results must demonstrate the system meets accuracy requirements per Art. 15. Include test set performance metrics.');
    }

    return { completeness, missing, recommendations };
  }

  // ---------------------------------------------------------------------------
  // COMPLIANCE DASHBOARD SUMMARY
  // ---------------------------------------------------------------------------

  /**
   * Generate a full compliance summary across all AI systems in a bank's inventory.
   */
  generateComplianceSummary(systems: AISystemDescriptor[]): {
    totalSystems: number;
    byRiskLevel: Record<AIRiskLevel, number>;
    highRiskSystems: AIActClassificationResult[];
    overallComplianceScore: number;
    criticalGaps: string[];
    nextDeadline: Date;
    timestamp: Date;
    hash: string;
  } {
    const classifications = systems.map(s => this.classifySystem(s));

    const byRiskLevel: Record<AIRiskLevel, number> = {
      unacceptable: 0,
      high: 0,
      limited: 0,
      minimal: 0,
    };

    for (const c of classifications) {
      byRiskLevel[c.riskLevel]++;
    }

    const highRiskSystems = classifications.filter(c => c.riskLevel === 'high');

    // Calculate overall compliance: % of high-risk obligations that are compliant
    let totalObligations = 0;
    let compliantObligations = 0;
    const criticalGaps: string[] = [];

    for (const sys of highRiskSystems) {
      for (const obl of sys.obligations) {
        totalObligations++;
        if (obl.status === 'compliant') compliantObligations++;
        if (obl.status === 'non-compliant' && obl.priority === 'critical') {
          criticalGaps.push(`${sys.systemName}: ${obl.title} (${obl.article}) — Non-compliant`);
        }
      }
    }

    const overallComplianceScore = totalObligations > 0
      ? Math.round((compliantObligations / totalObligations) * 100)
      : 100;

    if (byRiskLevel.unacceptable > 0) {
      criticalGaps.unshift(`${byRiskLevel.unacceptable} AI system(s) classified as UNACCEPTABLE RISK — must be immediately discontinued per Art. 5`);
    }

    const content = { totalSystems: systems.length, byRiskLevel, overallComplianceScore };
    const hash = crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');

    return {
      totalSystems: systems.length,
      byRiskLevel,
      highRiskSystems,
      overallComplianceScore,
      criticalGaps,
      nextDeadline: new Date('2026-08-02'), // Annex III high-risk deadline
      timestamp: new Date(),
      hash,
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private generateLimitedRiskObligations(system: AISystemDescriptor, dueDate: Date): AIActObligation[] {
    return [
      {
        id: `${system.id}-transparency`,
        article: 'Art. 50(1)',
        title: 'Transparency — AI Interaction Disclosure',
        description: 'Persons interacting with the AI system must be informed that they are interacting with an AI system, unless this is obvious from the circumstances and context of use.',
        category: 'transparency',
        priority: 'high',
        status: 'not-assessed',
        dueDate,
      },
      {
        id: `${system.id}-content-marking`,
        article: 'Art. 50(2)',
        title: 'AI-Generated Content Marking',
        description: 'AI-generated or manipulated content (text, audio, image, video) must be marked as artificially generated or manipulated in a machine-readable format.',
        category: 'transparency',
        priority: 'medium',
        status: 'not-assessed',
        dueDate,
      },
    ];
  }

  private getAffectedPersonsDescription(system: AISystemDescriptor): string {
    const descriptions: Record<string, string> = {
      'credit-scoring': 'Natural persons applying for credit products (loans, mortgages, credit cards)',
      'credit-decisioning': 'Natural persons subject to automated credit decisions',
      'fraud-detection': 'Account holders and transaction initiators',
      'aml-screening': 'Account holders, beneficiaries, and transaction counterparties',
      'kyc-verification': 'New and existing customers subject to identity verification',
      'insurance-pricing': 'Insurance applicants and policyholders',
      'collections': 'Debtors and guarantors subject to collection proceedings',
      'hr-recruitment': 'Job applicants and candidates',
      'hr-performance': 'Employees subject to performance evaluation',
    };
    return descriptions[system.domain] || 'Natural persons interacting with or affected by the AI system';
  }

  private getAffectedGroups(system: AISystemDescriptor, right: FundamentalRight): string[] {
    const baseGroups = ['All customers'];
    if (right === 'non-discrimination') {
      return ['Ethnic minorities', 'Women', 'Elderly persons', 'Persons with disabilities', 'Low-income persons'];
    }
    if (right === 'social-security') {
      return ['Financially vulnerable persons', 'Low-income persons', 'Persons in debt'];
    }
    if (right === 'childrens-rights') {
      return ['Minors with bank accounts', 'Young adults (18-25)'];
    }
    return baseGroups;
  }
}

export const euAIActEngine = new EUAIActEngine();
export default euAIActEngine;
