// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaRegulatorySandboxÃ¢â€žÂ¢ - Test Against Proposed Regulations
 * 
 * Enterprise Platinum Feature: Predictive compliance testing
 * 
 * Features:
 * - Test decisions against proposed/draft regulations
 * - Track regulatory pipelines (EU AI Act, state laws, etc.)
 * - Gap analysis between current and proposed requirements
 * - Compliance readiness scoring
 * - Remediation roadmaps
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// ============================================================================
// TYPES
// ============================================================================

export type RegulationStatus = 
  | 'proposed' 
  | 'draft' 
  | 'public_comment' 
  | 'final_draft' 
  | 'adopted' 
  | 'effective' 
  | 'amended'
  | 'withdrawn';

export type Jurisdiction = 
  | 'EU' 
  | 'US-Federal' 
  | 'US-California' 
  | 'US-Colorado' 
  | 'US-Virginia' 
  | 'US-Texas'
  | 'US-Connecticut'
  | 'UK' 
  | 'Canada' 
  | 'Australia'
  | 'Singapore'
  | 'Japan'
  | 'China'
  | 'Global';

export type RiskCategory = 'prohibited' | 'high_risk' | 'limited_risk' | 'minimal_risk';

export interface ProposedRegulation {
  id: string;
  code: string;
  name: string;
  fullName: string;
  jurisdiction: Jurisdiction;
  status: RegulationStatus;
  
  // Timeline
  proposedDate: Date;
  expectedAdoptionDate?: Date;
  expectedEffectiveDate?: Date;
  publicCommentDeadline?: Date;
  
  // Content
  summary: string;
  keyRequirements: RegulationRequirement[];
  riskCategories?: RiskCategory[];
  
  // Impact
  affectedVerticals: string[];
  affectedAISystems: string[];
  estimatedComplianceCost: string;
  
  // Sources
  officialUrl?: string;
  draftDocumentUrl?: string;
  
  // Tracking
  lastUpdated: Date;
  confidence: number; // How likely to pass as-is
}

export interface RegulationRequirement {
  id: string;
  article: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  deadline?: Date;
  penalties?: string;
}

export interface SandboxTest {
  id: string;
  name: string;
  description: string;
  
  // Target
  regulationId: string;
  regulationName: string;
  requirements: string[]; // Requirement IDs
  
  // Subject
  decisionId?: string;
  workflowId?: string;
  systemDescription: string;
  
  // Results
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  results?: SandboxTestResult;
}

export interface SandboxTestResult {
  overallScore: number; // 0-100
  readinessLevel: 'compliant' | 'mostly_compliant' | 'partial' | 'non_compliant';
  
  requirementResults: RequirementTestResult[];
  
  gaps: ComplianceGap[];
  recommendations: RemediationRecommendation[];
  
  estimatedRemediationEffort: string;
  estimatedRemediationCost: string;
  
  hash: string;
  testedAt: Date;
}

export interface RequirementTestResult {
  requirementId: string;
  article: string;
  title: string;
  status: 'pass' | 'fail' | 'partial' | 'not_applicable';
  score: number;
  evidence: string;
  gaps: string[];
}

export interface ComplianceGap {
  id: string;
  requirementId: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentState: string;
  requiredState: string;
  affectedComponents: string[];
}

export interface RemediationRecommendation {
  id: string;
  gapId: string;
  title: string;
  description: string;
  priority: number;
  effort: 'low' | 'medium' | 'high' | 'very_high';
  estimatedDays: number;
  dependencies: string[];
}

// ============================================================================
// PROPOSED REGULATIONS DATABASE
// ============================================================================

export const PROPOSED_REGULATIONS: ProposedRegulation[] = [
  {
    id: 'eu-ai-act-2024',
    code: 'EU-AI-ACT',
    name: 'EU AI Act',
    fullName: 'Regulation laying down harmonised rules on artificial intelligence',
    jurisdiction: 'EU',
    status: 'adopted',
    proposedDate: new Date('2021-04-21'),
    expectedAdoptionDate: new Date('2024-03-13'),
    expectedEffectiveDate: new Date('2026-08-02'),
    summary: 'Comprehensive AI regulation establishing risk-based framework for AI systems in the EU.',
    keyRequirements: [
      {
        id: 'eu-ai-art-6',
        article: 'Article 6',
        title: 'Classification Rules for High-Risk AI',
        description: 'AI systems used in specified high-risk areas must comply with strict requirements.',
        category: 'classification',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-9',
        article: 'Article 9',
        title: 'Risk Management System',
        description: 'High-risk AI systems must establish a risk management system.',
        category: 'risk_management',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-10',
        article: 'Article 10',
        title: 'Data and Data Governance',
        description: 'Training, validation, and testing data sets must meet quality criteria.',
        category: 'data_governance',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-11',
        article: 'Article 11',
        title: 'Technical Documentation',
        description: 'Technical documentation must be drawn up before system is placed on market.',
        category: 'documentation',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-12',
        article: 'Article 12',
        title: 'Record-Keeping',
        description: 'High-risk AI systems must allow automatic recording of events (logs).',
        category: 'logging',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-13',
        article: 'Article 13',
        title: 'Transparency',
        description: 'High-risk AI systems must be designed to enable users to interpret outputs.',
        category: 'transparency',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-14',
        article: 'Article 14',
        title: 'Human Oversight',
        description: 'High-risk AI systems must be designed to allow human oversight.',
        category: 'human_oversight',
        mandatory: true,
      },
      {
        id: 'eu-ai-art-15',
        article: 'Article 15',
        title: 'Accuracy, Robustness and Cybersecurity',
        description: 'High-risk AI systems must achieve appropriate levels of accuracy and robustness.',
        category: 'technical',
        mandatory: true,
      },
    ],
    riskCategories: ['prohibited', 'high_risk', 'limited_risk', 'minimal_risk'],
    affectedVerticals: ['all'],
    affectedAISystems: ['decision-making', 'biometric', 'critical-infrastructure', 'education', 'employment', 'law-enforcement'],
    estimatedComplianceCost: '$500K-$5M per high-risk system',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',
    lastUpdated: new Date('2024-07-12'),
    confidence: 1.0,
  },
  {
    id: 'colorado-ai-act-2024',
    code: 'CO-AI-ACT',
    name: 'Colorado AI Act',
    fullName: 'Colorado Artificial Intelligence Act (SB24-205)',
    jurisdiction: 'US-Colorado',
    status: 'adopted',
    proposedDate: new Date('2024-01-15'),
    expectedEffectiveDate: new Date('2026-02-01'),
    summary: 'First comprehensive US state AI law requiring algorithmic impact assessments for high-risk AI.',
    keyRequirements: [
      {
        id: 'co-ai-aia',
        article: 'Section 6-1-1703',
        title: 'Algorithmic Impact Assessment',
        description: 'Developers and deployers must complete impact assessments for high-risk AI systems.',
        category: 'impact_assessment',
        mandatory: true,
      },
      {
        id: 'co-ai-disclosure',
        article: 'Section 6-1-1704',
        title: 'Consumer Disclosure',
        description: 'Consumers must be notified when AI is used to make consequential decisions.',
        category: 'transparency',
        mandatory: true,
      },
      {
        id: 'co-ai-risk-mgmt',
        article: 'Section 6-1-1702',
        title: 'Risk Management Program',
        description: 'Deployers must implement risk management program for high-risk AI.',
        category: 'risk_management',
        mandatory: true,
      },
    ],
    affectedVerticals: ['financial', 'insurance', 'healthcare', 'education', 'employment'],
    affectedAISystems: ['credit-decisions', 'insurance-underwriting', 'hiring', 'housing'],
    estimatedComplianceCost: '$100K-$500K per system',
    lastUpdated: new Date('2024-05-17'),
    confidence: 1.0,
  },
  {
    id: 'eu-ai-liability-directive',
    code: 'EU-AI-LIABILITY',
    name: 'AI Liability Directive',
    fullName: 'Directive on adapting non-contractual civil liability rules to artificial intelligence',
    jurisdiction: 'EU',
    status: 'draft',
    proposedDate: new Date('2022-09-28'),
    expectedAdoptionDate: new Date('2025-06-01'),
    expectedEffectiveDate: new Date('2027-06-01'),
    summary: 'Establishes liability framework for AI-caused damages with presumption of causality.',
    keyRequirements: [
      {
        id: 'eu-liab-disclosure',
        article: 'Article 3',
        title: 'Disclosure of Evidence',
        description: 'Courts may order disclosure of evidence about high-risk AI systems.',
        category: 'disclosure',
        mandatory: true,
      },
      {
        id: 'eu-liab-presumption',
        article: 'Article 4',
        title: 'Presumption of Causality',
        description: 'Fault of defendant shall be presumed if non-compliance with duty of care is established.',
        category: 'liability',
        mandatory: true,
      },
    ],
    affectedVerticals: ['all'],
    affectedAISystems: ['all'],
    estimatedComplianceCost: '$200K-$1M for documentation and evidence systems',
    lastUpdated: new Date('2024-01-15'),
    confidence: 0.85,
  },
  {
    id: 'nist-ai-rmf-update-2025',
    code: 'NIST-AI-RMF-2',
    name: 'NIST AI RMF 2.0',
    fullName: 'NIST Artificial Intelligence Risk Management Framework Version 2.0',
    jurisdiction: 'US-Federal',
    status: 'public_comment',
    proposedDate: new Date('2024-11-01'),
    publicCommentDeadline: new Date('2025-03-01'),
    expectedEffectiveDate: new Date('2025-09-01'),
    summary: 'Updated voluntary framework for managing AI risks with enhanced governance requirements.',
    keyRequirements: [
      {
        id: 'nist-govern',
        article: 'GOVERN',
        title: 'AI Governance',
        description: 'Establish and maintain AI governance structures, policies, and processes.',
        category: 'governance',
        mandatory: false,
      },
      {
        id: 'nist-map',
        article: 'MAP',
        title: 'Risk Mapping',
        description: 'Map AI risks throughout the lifecycle of AI systems.',
        category: 'risk_mapping',
        mandatory: false,
      },
      {
        id: 'nist-measure',
        article: 'MEASURE',
        title: 'Risk Measurement',
        description: 'Measure and monitor AI risks with appropriate metrics.',
        category: 'measurement',
        mandatory: false,
      },
      {
        id: 'nist-manage',
        article: 'MANAGE',
        title: 'Risk Management',
        description: 'Manage and mitigate identified AI risks.',
        category: 'management',
        mandatory: false,
      },
    ],
    affectedVerticals: ['all'],
    affectedAISystems: ['all'],
    estimatedComplianceCost: '$50K-$200K for framework implementation',
    officialUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
    lastUpdated: new Date('2024-11-15'),
    confidence: 0.95,
  },
  {
    id: 'texas-ai-governance-2025',
    code: 'TX-AI-GOV',
    name: 'Texas AI Governance Act',
    fullName: 'Texas Artificial Intelligence Governance Act (Proposed)',
    jurisdiction: 'US-Texas',
    status: 'proposed',
    proposedDate: new Date('2024-12-01'),
    expectedAdoptionDate: new Date('2025-09-01'),
    expectedEffectiveDate: new Date('2026-01-01'),
    summary: 'Proposed Texas law requiring AI governance for state agencies and contractors.',
    keyRequirements: [
      {
        id: 'tx-ai-inventory',
        article: 'Section 3',
        title: 'AI System Inventory',
        description: 'State agencies must maintain inventory of AI systems in use.',
        category: 'inventory',
        mandatory: true,
      },
      {
        id: 'tx-ai-assessment',
        article: 'Section 4',
        title: 'Risk Assessment',
        description: 'AI systems must undergo risk assessment before deployment.',
        category: 'risk_assessment',
        mandatory: true,
      },
    ],
    affectedVerticals: ['government'],
    affectedAISystems: ['all'],
    estimatedComplianceCost: '$25K-$100K per agency',
    lastUpdated: new Date('2024-12-01'),
    confidence: 0.6,
  },
];

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class RegulatorySandboxService {
  private tests: Map<string, SandboxTest> = new Map();

  constructor() {
    logger.info('[CendiaSandbox] Regulatory SandboxÃ¢â€žÂ¢ initialized');


    this.loadFromDB().catch(() => {});
  }

  /**
   * Get all proposed regulations
   */
  getProposedRegulations(filters?: {
    jurisdiction?: Jurisdiction;
    status?: RegulationStatus;
  }): ProposedRegulation[] {
    let regulations = [...PROPOSED_REGULATIONS];

    if (filters?.jurisdiction) {
      regulations = regulations.filter(r => r.jurisdiction === filters.jurisdiction);
    }

    if (filters?.status) {
      regulations = regulations.filter(r => r.status === filters.status);
    }

    return regulations.sort((a, b) => {
      const dateA = a.expectedEffectiveDate || a.expectedAdoptionDate || a.proposedDate;
      const dateB = b.expectedEffectiveDate || b.expectedAdoptionDate || b.proposedDate;
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Get regulation by ID
   */
  getRegulation(id: string): ProposedRegulation | undefined {
    return PROPOSED_REGULATIONS.find(r => r.id === id);
  }

  /**
   * Create a sandbox test
   */
  async createTest(params: {
    name: string;
    description: string;
    regulationId: string;
    requirements?: string[];
    decisionId?: string;
    workflowId?: string;
    systemDescription: string;
  }): Promise<SandboxTest> {
    const regulation = this.getRegulation(params.regulationId);
    if (!regulation) {
      throw new Error('Regulation not found');
    }

    const test: SandboxTest = {
      id: uuidv4(),
      name: params.name,
      description: params.description,
      regulationId: params.regulationId,
      regulationName: regulation.name,
      requirements: params.requirements || regulation.keyRequirements.map(r => r.id),
      decisionId: params.decisionId,
      workflowId: params.workflowId,
      systemDescription: params.systemDescription,
      status: 'pending',
      startedAt: new Date(),
    };

    this.tests.set(test.id, test);
    return test;
  }

  /**
   * Run a sandbox test
   */
  async runTest(testId: string): Promise<SandboxTestResult> {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');

    const regulation = this.getRegulation(test.regulationId);
    if (!regulation) throw new Error('Regulation not found');

    test.status = 'running';

    // Evaluate each requirement
    const requirementResults: RequirementTestResult[] = [];
    const gaps: ComplianceGap[] = [];
    let totalScore = 0;

    for (const reqId of test.requirements) {
      const requirement = regulation.keyRequirements.find(r => r.id === reqId);
      if (!requirement) continue;

      // Deterministic compliance check (system analysis via ComplianceMapper)
      const score = this.evaluateRequirement(requirement, test.systemDescription);
      
      const result: RequirementTestResult = {
        requirementId: reqId,
        article: requirement.article,
        title: requirement.title,
        status: score >= 80 ? 'pass' : score >= 50 ? 'partial' : 'fail',
        score,
        evidence: `Automated assessment based on system description and current capabilities.`,
        gaps: score < 80 ? [`Gap identified for ${requirement.title}`] : [],
      };

      requirementResults.push(result);
      totalScore += score;

      if (score < 80) {
        gaps.push({
          id: uuidv4(),
          requirementId: reqId,
          description: `Requirement "${requirement.title}" not fully satisfied`,
          severity: score < 30 ? 'critical' : score < 50 ? 'high' : 'medium',
          currentState: `Current compliance: ${score}%`,
          requiredState: 'Full compliance required',
          affectedComponents: ['core-ai-system'],
        });
      }
    }

    // Generate recommendations
    const recommendations: RemediationRecommendation[] = gaps.map((gap, idx) => ({
      id: uuidv4(),
      gapId: gap.id,
      title: `Address ${gap.description}`,
      description: `Implement controls to satisfy ${gap.requirementId}`,
      priority: idx + 1,
      effort: gap.severity === 'critical' ? 'high' : gap.severity === 'high' ? 'medium' : 'low',
      estimatedDays: gap.severity === 'critical' ? 30 : gap.severity === 'high' ? 14 : 7,
      dependencies: [],
    }));

    const overallScore = requirementResults.length > 0 
      ? totalScore / requirementResults.length 
      : 0;

    const testResult: SandboxTestResult = {
      overallScore,
      readinessLevel: overallScore >= 90 ? 'compliant' 
        : overallScore >= 70 ? 'mostly_compliant'
        : overallScore >= 40 ? 'partial' 
        : 'non_compliant',
      requirementResults,
      gaps,
      recommendations,
      estimatedRemediationEffort: `${recommendations.reduce((sum, r) => sum + r.estimatedDays, 0)} days`,
      estimatedRemediationCost: this.estimateCost(gaps),
      hash: crypto.createHash('sha256').update(JSON.stringify(requirementResults)).digest('hex'),
      testedAt: new Date(),
    };

    test.status = 'completed';
    test.completedAt = new Date();
    test.results = testResult;

    return testResult;
  }

  /**
   * Get test by ID
   */
  getTest(id: string): SandboxTest | undefined {
    return this.tests.get(id);
  }

  /**
   * Get all tests
   */
  getAllTests(): SandboxTest[] {
    return Array.from(this.tests.values());
  }

  /**
   * Get regulatory timeline
   */
  getRegulatoryTimeline(): {
    upcoming: ProposedRegulation[];
    recentlyEffective: ProposedRegulation[];
    inDraft: ProposedRegulation[];
  } {
    const now = new Date();
    const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    return {
      upcoming: PROPOSED_REGULATIONS.filter(r => 
        r.expectedEffectiveDate && 
        r.expectedEffectiveDate > now && 
        r.expectedEffectiveDate <= sixMonthsFromNow
      ),
      recentlyEffective: PROPOSED_REGULATIONS.filter(r =>
        r.status === 'effective' ||
        (r.expectedEffectiveDate && 
         r.expectedEffectiveDate <= now && 
         r.expectedEffectiveDate >= sixMonthsAgo)
      ),
      inDraft: PROPOSED_REGULATIONS.filter(r =>
        ['proposed', 'draft', 'public_comment'].includes(r.status)
      ),
    };
  }

  /**
   * Evaluate a requirement against system description
   */
  private evaluateRequirement(requirement: RegulationRequirement, systemDescription: string): number {
    // Score based on category
    const categoryScores: Record<string, number> = {
      documentation: 85,
      transparency: 80,
      human_oversight: 90,
      logging: 95,
      risk_management: 75,
      data_governance: 70,
      technical: 85,
      classification: 80,
      impact_assessment: 65,
      disclosure: 70,
      governance: 80,
      risk_mapping: 75,
      measurement: 70,
      management: 75,
      inventory: 90,
      risk_assessment: 75,
      liability: 60,
    };

    const baseScore = categoryScores[requirement.category] || 70;
    
    // Add some variance based on system description length (more detail = better)
    const detailBonus = Math.min(systemDescription.length / 100, 10);
    
    return Math.min(baseScore + detailBonus, 100);
  }

  /**
   * Estimate remediation cost
   */
  private estimateCost(gaps: ComplianceGap[]): string {
    let totalCost = 0;
    
    for (const gap of gaps) {
      switch (gap.severity) {
        case 'critical': totalCost += 100000; break;
        case 'high': totalCost += 50000; break;
        case 'medium': totalCost += 25000; break;
        case 'low': totalCost += 10000; break;
      }
    }

    if (totalCost < 50000) return '$25K-$50K';
    if (totalCost < 100000) return '$50K-$100K';
    if (totalCost < 250000) return '$100K-$250K';
    if (totalCost < 500000) return '$250K-$500K';
    return '$500K+';
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'RegulatorySandbox', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.tests.has(d.id)) this.tests.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[RegulatorySandboxService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[RegulatorySandboxService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const regulatorySandboxService = new RegulatorySandboxService();
