// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrossJurisdiction™ - Multi-Jurisdiction Compliance Engine
 * 
 * Enterprise Platinum Feature: Navigate conflicting global regulations
 * 
 * Features:
 * - Multi-jurisdiction conflict detection
 * - Regulatory harmonization recommendations
 * - Data residency compliance
 * - Cross-border transfer assessment
 * - Jurisdiction-specific rule engines
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// ============================================================================
// TYPES
// ============================================================================

export type Jurisdiction = 
  | 'US_FEDERAL'
  | 'US_CALIFORNIA'
  | 'US_COLORADO'
  | 'US_VIRGINIA'
  | 'US_CONNECTICUT'
  | 'EU'
  | 'UK'
  | 'GERMANY'
  | 'FRANCE'
  | 'CANADA'
  | 'BRAZIL'
  | 'JAPAN'
  | 'SOUTH_KOREA'
  | 'CHINA'
  | 'SINGAPORE'
  | 'AUSTRALIA'
  | 'INDIA';

export type ConflictSeverity = 'blocking' | 'major' | 'minor' | 'informational';
export type ResolutionStrategy = 'strictest' | 'origin' | 'destination' | 'custom' | 'exemption';

export interface JurisdictionProfile {
  id: Jurisdiction;
  name: string;
  region: string;
  dataProtectionLaw: string;
  aiRegulation?: string;
  adequacyDecisions: Jurisdiction[];
  transferMechanisms: string[];
  dataLocalization: boolean;
  crossBorderRestrictions: string[];
}

export interface RegulatoryConflict {
  id: string;
  jurisdictions: Jurisdiction[];
  topic: string;
  description: string;
  severity: ConflictSeverity;
  requirements: Record<Jurisdiction, string>;
  recommendation: string;
  resolutionStrategy: ResolutionStrategy;
  legalBasis?: string;
}

export interface CrossBorderAssessment {
  id: string;
  sourceJurisdiction: Jurisdiction;
  destinationJurisdiction: Jurisdiction;
  dataTypes: string[];
  transferMechanism?: string;
  adequacyStatus: 'adequate' | 'conditional' | 'restricted' | 'prohibited';
  requiredSafeguards: string[];
  conflicts: RegulatoryConflict[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  assessedAt: Date;
}

export interface ComplianceMatrix {
  id: string;
  organizationId: string;
  jurisdictions: Jurisdiction[];
  requirements: JurisdictionRequirement[];
  conflicts: RegulatoryConflict[];
  harmonizedApproach: HarmonizedRequirement[];
  generatedAt: Date;
}

export interface JurisdictionRequirement {
  jurisdiction: Jurisdiction;
  topic: string;
  requirement: string;
  mandatory: boolean;
  deadline?: Date;
  penalty?: string;
}

export interface HarmonizedRequirement {
  topic: string;
  harmonizedApproach: string;
  jurisdictionsCovered: Jurisdiction[];
  strategy: ResolutionStrategy;
  notes: string;
}

export interface DataResidencyRule {
  jurisdiction: Jurisdiction;
  dataType: string;
  requirement: 'local_only' | 'local_primary' | 'no_restriction' | 'conditional';
  conditions?: string[];
  exceptions?: string[];
}

// ============================================================================
// JURISDICTION PROFILES
// ============================================================================

const JURISDICTION_PROFILES: Record<Jurisdiction, JurisdictionProfile> = {
  'US_FEDERAL': {
    id: 'US_FEDERAL',
    name: 'United States (Federal)',
    region: 'North America',
    dataProtectionLaw: 'Sectoral (HIPAA, GLBA, COPPA, etc.)',
    adequacyDecisions: [],
    transferMechanisms: ['SCCs', 'BCRs', 'Consent'],
    dataLocalization: false,
    crossBorderRestrictions: ['Government data may have restrictions'],
  },
  'US_CALIFORNIA': {
    id: 'US_CALIFORNIA',
    name: 'California, USA',
    region: 'North America',
    dataProtectionLaw: 'CCPA/CPRA',
    aiRegulation: 'AB 2013 (AI transparency)',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'US_COLORADO': {
    id: 'US_COLORADO',
    name: 'Colorado, USA',
    region: 'North America',
    dataProtectionLaw: 'CPA',
    aiRegulation: 'Colorado AI Act (2024)',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'US_VIRGINIA': {
    id: 'US_VIRGINIA',
    name: 'Virginia, USA',
    region: 'North America',
    dataProtectionLaw: 'VCDPA',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'US_CONNECTICUT': {
    id: 'US_CONNECTICUT',
    name: 'Connecticut, USA',
    region: 'North America',
    dataProtectionLaw: 'CTDPA',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'EU': {
    id: 'EU',
    name: 'European Union',
    region: 'Europe',
    dataProtectionLaw: 'GDPR',
    aiRegulation: 'EU AI Act',
    adequacyDecisions: ['UK', 'JAPAN', 'SOUTH_KOREA', 'CANADA'],
    transferMechanisms: ['Adequacy', 'SCCs', 'BCRs', 'Consent'],
    dataLocalization: false,
    crossBorderRestrictions: ['Transfers to non-adequate countries require safeguards'],
  },
  'UK': {
    id: 'UK',
    name: 'United Kingdom',
    region: 'Europe',
    dataProtectionLaw: 'UK GDPR / Data Protection Act 2018',
    adequacyDecisions: ['EU'],
    transferMechanisms: ['Adequacy', 'IDTAs', 'SCCs', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'GERMANY': {
    id: 'GERMANY',
    name: 'Germany',
    region: 'Europe',
    dataProtectionLaw: 'GDPR + BDSG',
    aiRegulation: 'EU AI Act',
    adequacyDecisions: ['UK', 'JAPAN', 'SOUTH_KOREA', 'CANADA'],
    transferMechanisms: ['Adequacy', 'SCCs', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: ['Stricter interpretation of GDPR'],
  },
  'FRANCE': {
    id: 'FRANCE',
    name: 'France',
    region: 'Europe',
    dataProtectionLaw: 'GDPR + Loi Informatique',
    aiRegulation: 'EU AI Act',
    adequacyDecisions: ['UK', 'JAPAN', 'SOUTH_KOREA', 'CANADA'],
    transferMechanisms: ['Adequacy', 'SCCs', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'CANADA': {
    id: 'CANADA',
    name: 'Canada',
    region: 'North America',
    dataProtectionLaw: 'PIPEDA',
    aiRegulation: 'AIDA (proposed)',
    adequacyDecisions: ['EU'],
    transferMechanisms: ['Consent', 'Contract', 'Adequacy (from EU)'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'BRAZIL': {
    id: 'BRAZIL',
    name: 'Brazil',
    region: 'South America',
    dataProtectionLaw: 'LGPD',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'SCCs', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: ['Must ensure adequate protection'],
  },
  'JAPAN': {
    id: 'JAPAN',
    name: 'Japan',
    region: 'Asia Pacific',
    dataProtectionLaw: 'APPI',
    adequacyDecisions: ['EU', 'UK'],
    transferMechanisms: ['Adequacy', 'Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'SOUTH_KOREA': {
    id: 'SOUTH_KOREA',
    name: 'South Korea',
    region: 'Asia Pacific',
    dataProtectionLaw: 'PIPA',
    adequacyDecisions: ['EU'],
    transferMechanisms: ['Adequacy', 'Consent', 'Contract'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'CHINA': {
    id: 'CHINA',
    name: 'China',
    region: 'Asia Pacific',
    dataProtectionLaw: 'PIPL',
    aiRegulation: 'AI regulations (multiple)',
    adequacyDecisions: [],
    transferMechanisms: ['Security Assessment', 'SCCs', 'Certification'],
    dataLocalization: true,
    crossBorderRestrictions: ['Government security review required', 'Critical data localization'],
  },
  'SINGAPORE': {
    id: 'SINGAPORE',
    name: 'Singapore',
    region: 'Asia Pacific',
    dataProtectionLaw: 'PDPA',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: [],
  },
  'AUSTRALIA': {
    id: 'AUSTRALIA',
    name: 'Australia',
    region: 'Asia Pacific',
    dataProtectionLaw: 'Privacy Act 1988',
    adequacyDecisions: [],
    transferMechanisms: ['Consent', 'Contract', 'BCRs'],
    dataLocalization: false,
    crossBorderRestrictions: ['Reasonable steps to ensure compliance'],
  },
  'INDIA': {
    id: 'INDIA',
    name: 'India',
    region: 'Asia Pacific',
    dataProtectionLaw: 'DPDP Act 2023',
    adequacyDecisions: [],
    transferMechanisms: ['Government-approved countries', 'Contract'],
    dataLocalization: true,
    crossBorderRestrictions: ['Critical personal data localization', 'Government whitelist'],
  },
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class CrossJurisdictionEngineService {
  private assessments: Map<string, CrossBorderAssessment> = new Map();
  private matrices: Map<string, ComplianceMatrix> = new Map();
  private conflicts: Map<string, RegulatoryConflict> = new Map();

  constructor() {
    this.initializeCommonConflicts();
    logger.info('[CendiaJurisdiction] Cross-Jurisdiction Engine™ initialized');


    this.loadFromDB().catch(() => {});
  }

  /**
   * Initialize common regulatory conflicts
   */
  private initializeCommonConflicts(): void {
    const commonConflicts: Omit<RegulatoryConflict, 'id'>[] = [
      {
        jurisdictions: ['EU', 'US_FEDERAL'],
        topic: 'Data Transfer Mechanism',
        description: 'GDPR requires adequate protection for transfers to US',
        severity: 'major',
        requirements: {
          'EU': 'Must use SCCs, BCRs, or other approved mechanism',
          'US_FEDERAL': 'No federal adequacy framework',
        } as Record<Jurisdiction, string>,
        recommendation: 'Implement EU-approved Standard Contractual Clauses with supplementary measures',
        resolutionStrategy: 'strictest',
      },
      {
        jurisdictions: ['EU', 'CHINA'],
        topic: 'Cross-Border Data Transfer',
        description: 'Both jurisdictions have strict transfer requirements',
        severity: 'blocking',
        requirements: {
          'EU': 'GDPR transfer restrictions apply',
          'CHINA': 'PIPL requires security assessment for outbound transfers',
        } as Record<Jurisdiction, string>,
        recommendation: 'Conduct dual compliance assessment and implement both SCCs and PIPL security review',
        resolutionStrategy: 'strictest',
      },
      {
        jurisdictions: ['US_CALIFORNIA', 'EU'],
        topic: 'Consumer Rights',
        description: 'Different scope of data subject rights',
        severity: 'minor',
        requirements: {
          'US_CALIFORNIA': 'Right to know, delete, opt-out of sale',
          'EU': 'Broader rights including portability, restriction, objection',
        } as Record<Jurisdiction, string>,
        recommendation: 'Implement full GDPR rights scope to cover both jurisdictions',
        resolutionStrategy: 'strictest',
      },
      {
        jurisdictions: ['EU', 'US_COLORADO'],
        topic: 'AI System Requirements',
        description: 'Both have AI-specific regulations',
        severity: 'major',
        requirements: {
          'EU': 'EU AI Act risk classification and conformity assessment',
          'US_COLORADO': 'Colorado AI Act deployer obligations',
        } as Record<Jurisdiction, string>,
        recommendation: 'Implement EU AI Act requirements which are generally stricter',
        resolutionStrategy: 'strictest',
      },
    ];

    for (const conflict of commonConflicts) {
      const id = uuidv4();
      this.conflicts.set(id, { ...conflict, id });
    }
  }

  /**
   * Get all jurisdiction profiles
   */
  getJurisdictionProfiles(): JurisdictionProfile[] {
    return Object.values(JURISDICTION_PROFILES);
  }

  /**
   * Get specific jurisdiction profile
   */
  getJurisdictionProfile(jurisdiction: Jurisdiction): JurisdictionProfile | undefined {
    return JURISDICTION_PROFILES[jurisdiction];
  }

  /**
   * Assess cross-border data transfer
   */
  async assessCrossBorderTransfer(params: {
    sourceJurisdiction: Jurisdiction;
    destinationJurisdiction: Jurisdiction;
    dataTypes: string[];
  }): Promise<CrossBorderAssessment> {
    const source = JURISDICTION_PROFILES[params.sourceJurisdiction];
    const destination = JURISDICTION_PROFILES[params.destinationJurisdiction];

    if (!source || !destination) {
      throw new Error('Invalid jurisdiction');
    }

    // Check adequacy
    const hasAdequacy = source.adequacyDecisions.includes(params.destinationJurisdiction);
    
    // Find applicable conflicts
    const applicableConflicts = Array.from(this.conflicts.values()).filter(c =>
      c.jurisdictions.includes(params.sourceJurisdiction) &&
      c.jurisdictions.includes(params.destinationJurisdiction)
    );

    // Determine adequacy status
    let adequacyStatus: CrossBorderAssessment['adequacyStatus'];
    let riskLevel: CrossBorderAssessment['riskLevel'];
    
    if (hasAdequacy) {
      adequacyStatus = 'adequate';
      riskLevel = 'low';
    } else if (destination.dataLocalization) {
      adequacyStatus = 'restricted';
      riskLevel = 'critical';
    } else if (applicableConflicts.some(c => c.severity === 'blocking')) {
      adequacyStatus = 'restricted';
      riskLevel = 'high';
    } else {
      adequacyStatus = 'conditional';
      riskLevel = 'medium';
    }

    // Determine required safeguards
    const requiredSafeguards: string[] = [];
    if (!hasAdequacy) {
      requiredSafeguards.push('Standard Contractual Clauses (SCCs)');
      requiredSafeguards.push('Transfer Impact Assessment');
    }
    if (destination.dataLocalization) {
      requiredSafeguards.push('Data localization compliance');
      requiredSafeguards.push('Government security assessment');
    }
    if (params.dataTypes.includes('sensitive') || params.dataTypes.includes('health')) {
      requiredSafeguards.push('Enhanced encryption');
      requiredSafeguards.push('Pseudonymization');
    }

    const assessment: CrossBorderAssessment = {
      id: uuidv4(),
      sourceJurisdiction: params.sourceJurisdiction,
      destinationJurisdiction: params.destinationJurisdiction,
      dataTypes: params.dataTypes,
      transferMechanism: hasAdequacy ? 'Adequacy Decision' : 'SCCs with Supplementary Measures',
      adequacyStatus,
      requiredSafeguards,
      conflicts: applicableConflicts,
      riskLevel,
      recommendation: this.generateTransferRecommendation(adequacyStatus, riskLevel),
      assessedAt: new Date(),
    };

    this.assessments.set(assessment.id, assessment);
    persistServiceRecord({ serviceName: 'CrossJurisdiction', recordType: 'assessment', referenceId: assessment.id, data: assessment });
    logger.info(`Cross-border assessment: ${params.sourceJurisdiction} -> ${params.destinationJurisdiction}: ${adequacyStatus}`);
    
    return assessment;
  }

  /**
   * Generate compliance matrix for multiple jurisdictions
   */
  async generateComplianceMatrix(params: {
    organizationId: string;
    jurisdictions: Jurisdiction[];
  }): Promise<ComplianceMatrix> {
    const requirements: JurisdictionRequirement[] = [];
    const applicableConflicts: RegulatoryConflict[] = [];

    // Gather requirements for each jurisdiction
    for (const jurisdiction of params.jurisdictions) {
      const profile = JURISDICTION_PROFILES[jurisdiction];
      if (!profile) continue;

      requirements.push({
        jurisdiction,
        topic: 'Data Protection Law',
        requirement: `Comply with ${profile.dataProtectionLaw}`,
        mandatory: true,
      });

      if (profile.aiRegulation) {
        requirements.push({
          jurisdiction,
          topic: 'AI Regulation',
          requirement: `Comply with ${profile.aiRegulation}`,
          mandatory: true,
        });
      }

      if (profile.dataLocalization) {
        requirements.push({
          jurisdiction,
          topic: 'Data Localization',
          requirement: 'Store designated data within jurisdiction',
          mandatory: true,
        });
      }
    }

    // Find conflicts between jurisdictions
    for (const conflict of this.conflicts.values()) {
      const hasOverlap = conflict.jurisdictions.every(j => params.jurisdictions.includes(j));
      if (hasOverlap) {
        applicableConflicts.push(conflict);
      }
    }

    // Generate harmonized approach
    const harmonized = this.harmonizeRequirements(requirements, applicableConflicts);

    const matrix: ComplianceMatrix = {
      id: uuidv4(),
      organizationId: params.organizationId,
      jurisdictions: params.jurisdictions,
      requirements,
      conflicts: applicableConflicts,
      harmonizedApproach: harmonized,
      generatedAt: new Date(),
    };

    this.matrices.set(matrix.id, matrix);
    logger.info(`Compliance matrix generated for ${params.jurisdictions.length} jurisdictions`);
    
    return matrix;
  }

  /**
   * Detect conflicts between jurisdictions
   */
  detectConflicts(jurisdictions: Jurisdiction[]): RegulatoryConflict[] {
    return Array.from(this.conflicts.values()).filter(c =>
      c.jurisdictions.some(j => jurisdictions.includes(j))
    );
  }

  /**
   * Get data residency rules
   */
  getDataResidencyRules(jurisdictions: Jurisdiction[]): DataResidencyRule[] {
    const rules: DataResidencyRule[] = [];

    for (const jurisdiction of jurisdictions) {
      const profile = JURISDICTION_PROFILES[jurisdiction];
      if (!profile) continue;

      if (profile.dataLocalization) {
        rules.push({
          jurisdiction,
          dataType: 'personal_data',
          requirement: 'local_primary',
          conditions: profile.crossBorderRestrictions,
        });
        rules.push({
          jurisdiction,
          dataType: 'critical_data',
          requirement: 'local_only',
          conditions: ['Government-classified or critical infrastructure data'],
        });
      } else {
        rules.push({
          jurisdiction,
          dataType: 'personal_data',
          requirement: 'no_restriction',
          conditions: ['Must use approved transfer mechanisms'],
        });
      }
    }

    return rules;
  }

  /**
   * Get assessment by ID
   */
  getAssessment(id: string): CrossBorderAssessment | undefined {
    return this.assessments.get(id);
  }

  /**
   * Get matrix by ID
   */
  getMatrix(id: string): ComplianceMatrix | undefined {
    return this.matrices.get(id);
  }

  /**
   * List all assessments
   */
  listAssessments(): CrossBorderAssessment[] {
    return Array.from(this.assessments.values())
      .sort((a, b) => b.assessedAt.getTime() - a.assessedAt.getTime());
  }

  // Helper methods
  private generateTransferRecommendation(adequacy: string, risk: string): string {
    if (adequacy === 'adequate') {
      return 'Transfer permitted under adequacy decision. Document the legal basis.';
    }
    if (risk === 'critical') {
      return 'Transfer highly restricted. Consider data localization or restructuring data flows.';
    }
    if (risk === 'high') {
      return 'Implement comprehensive safeguards including SCCs, encryption, and transfer impact assessment.';
    }
    return 'Implement standard contractual clauses and conduct transfer impact assessment.';
  }

  private harmonizeRequirements(
    requirements: JurisdictionRequirement[],
    conflicts: RegulatoryConflict[]
  ): HarmonizedRequirement[] {
    const topicGroups = new Map<string, JurisdictionRequirement[]>();
    
    for (const req of requirements) {
      const existing = topicGroups.get(req.topic) || [];
      existing.push(req);
      topicGroups.set(req.topic, existing);
    }

    const harmonized: HarmonizedRequirement[] = [];

    for (const [topic, reqs] of topicGroups) {
      const jurisdictionsCovered = reqs.map(r => r.jurisdiction);
      const relatedConflict = conflicts.find(c => c.topic.includes(topic));

      harmonized.push({
        topic,
        harmonizedApproach: relatedConflict?.recommendation || `Apply strictest requirement from: ${reqs.map(r => r.requirement).join(', ')}`,
        jurisdictionsCovered,
        strategy: relatedConflict?.resolutionStrategy || 'strictest',
        notes: relatedConflict?.description || '',
      });
    }

    return harmonized;
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CrossJurisdiction', recordType: 'assessment', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.assessments.has(d.id)) this.assessments.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CrossJurisdiction', recordType: 'assessment', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.matrices.has(d.id)) this.matrices.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CrossJurisdiction', recordType: 'assessment', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.conflicts.has(d.id)) this.conflicts.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[CrossJurisdictionEngineService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CrossJurisdictionEngineService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const crossJurisdictionEngineService = new CrossJurisdictionEngineService();
