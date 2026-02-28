// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * ComplianceDashboardService
 * 
 * Real-time compliance status tracking with:
 * - Framework coverage mapping (SOC2, ISO27001, GDPR, HIPAA, etc.)
 * - Control attestation status
 * - Gap analysis
 * - Audit readiness scoring
 * - Evidence collection tracking
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { TestEvidenceLedgerService, LedgerEntry } from './TestEvidenceLedgerService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  authority: string;
  
  // Framework structure
  domains: ComplianceDomain[];
  totalControls: number;
  
  // Applicability
  industries: string[];
  regions: string[];
  mandatory: boolean;
  
  // Audit info
  certificationBody?: string;
  auditFrequency?: string;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
}

export interface ComplianceDomain {
  id: string;
  name: string;
  description: string;
  controls: ComplianceControl[];
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Requirements
  requirement: string;
  guidance?: string;
  
  // Testing
  testable: boolean;
  automatable: boolean;
  testFrequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  
  // Mapping
  relatedControls?: string[];
  evidenceTypes: string[];
}

export interface ControlAttestation {
  controlId: string;
  frameworkId: string;
  
  // Status
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_tested' | 'not_applicable';
  confidence: number;
  
  // Evidence
  evidenceIds: string[];
  evidenceCount: number;
  lastTestedAt?: Date;
  lastPassedAt?: Date;
  
  // History
  statusHistory: {
    timestamp: Date;
    status: ControlAttestation['status'];
    changedBy: string;
    reason?: string;
  }[];
  
  // Notes
  notes?: string;
  exceptions?: string;
  remediationPlan?: string;
  remediationDueDate?: Date;
}

export interface ComplianceScore {
  frameworkId: string;
  frameworkName: string;
  
  // Overall
  overallScore: number;
  overallStatus: 'compliant' | 'at_risk' | 'non_compliant';
  
  // Breakdown
  totalControls: number;
  compliantControls: number;
  partialControls: number;
  nonCompliantControls: number;
  notTestedControls: number;
  notApplicableControls: number;
  
  // By domain
  domainScores: {
    domainId: string;
    domainName: string;
    score: number;
    status: string;
  }[];
  
  // Trends
  trend: 'improving' | 'stable' | 'declining';
  previousScore?: number;
  scoreChange?: number;
  
  // Audit readiness
  auditReadiness: number;
  criticalGaps: number;
  
  calculatedAt: Date;
}

export interface GapAnalysis {
  frameworkId: string;
  analyzedAt: Date;
  
  // Gaps
  gaps: ComplianceGap[];
  totalGaps: number;
  criticalGaps: number;
  highGaps: number;
  mediumGaps: number;
  lowGaps: number;
  
  // Recommendations
  recommendations: Recommendation[];
  estimatedRemediationEffort: string;
}

export interface ComplianceGap {
  controlId: string;
  controlName: string;
  domainId: string;
  
  severity: 'critical' | 'high' | 'medium' | 'low';
  gapType: 'missing_control' | 'insufficient_evidence' | 'failed_test' | 'outdated_test' | 'policy_gap';
  description: string;
  
  // Impact
  riskImpact: string;
  businessImpact: string;
  
  // Remediation
  remediationSteps: string[];
  estimatedEffort: string;
  priority: number;
}

export interface Recommendation {
  id: string;
  priority: number;
  category: 'immediate' | 'short_term' | 'long_term';
  
  title: string;
  description: string;
  affectedControls: string[];
  
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  
  steps: string[];
}

// =============================================================================
// PREDEFINED FRAMEWORKS
// =============================================================================

const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'soc2-type2',
    name: 'SOC 2 Type II',
    version: '2017',
    description: 'Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, Privacy',
    authority: 'AICPA',
    domains: [
      {
        id: 'cc',
        name: 'Common Criteria',
        description: 'Control environment, communication, risk assessment, monitoring, control activities',
        controls: [
          { id: 'CC1.1', name: 'COSO Principle 1', description: 'Commitment to integrity and ethical values', category: 'Control Environment', requirement: 'Demonstrate commitment to integrity', testable: true, automatable: false, testFrequency: 'annual', evidenceTypes: ['policy', 'training'] },
          { id: 'CC1.2', name: 'COSO Principle 2', description: 'Board independence and oversight', category: 'Control Environment', requirement: 'Board exercises oversight', testable: true, automatable: false, testFrequency: 'annual', evidenceTypes: ['meeting_minutes', 'charter'] },
          { id: 'CC6.1', name: 'Logical Access', description: 'Logical access security controls', category: 'Logical and Physical Access Controls', requirement: 'Implement logical access controls', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['test_result', 'config'] },
          { id: 'CC6.6', name: 'Security Events', description: 'Security event logging and monitoring', category: 'Logical and Physical Access Controls', requirement: 'Log and monitor security events', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['logs', 'alerts'] },
          { id: 'CC7.2', name: 'System Monitoring', description: 'System components monitored for anomalies', category: 'System Operations', requirement: 'Monitor for anomalies', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['monitoring', 'alerts'] },
        ],
      },
    ],
    totalControls: 5,
    industries: ['technology', 'saas', 'cloud'],
    regions: ['global'],
    mandatory: false,
    auditFrequency: 'annual',
  },
  {
    id: 'iso27001',
    name: 'ISO 27001:2022',
    version: '2022',
    description: 'Information Security Management System',
    authority: 'ISO',
    domains: [
      {
        id: 'a5',
        name: 'Organizational Controls',
        description: 'Policies, roles, responsibilities',
        controls: [
          { id: 'A.5.1', name: 'Policies for information security', description: 'Information security policy and topic-specific policies', category: 'Organizational', requirement: 'Define and approve information security policies', testable: true, automatable: false, testFrequency: 'annual', evidenceTypes: ['policy'] },
          { id: 'A.5.2', name: 'Information security roles', description: 'Defined and allocated roles', category: 'Organizational', requirement: 'Define information security roles', testable: true, automatable: false, testFrequency: 'annual', evidenceTypes: ['org_chart', 'job_descriptions'] },
        ],
      },
      {
        id: 'a8',
        name: 'Technological Controls',
        description: 'Technical security controls',
        controls: [
          { id: 'A.8.2', name: 'Privileged access rights', description: 'Privileged access management', category: 'Access Control', requirement: 'Restrict and manage privileged access', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['test_result', 'config'] },
          { id: 'A.8.15', name: 'Logging', description: 'Logs recording activities', category: 'Logging', requirement: 'Record activities, exceptions, faults', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['logs', 'config'] },
          { id: 'A.8.16', name: 'Monitoring activities', description: 'Networks, systems monitored', category: 'Monitoring', requirement: 'Monitor for anomalous behavior', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['monitoring', 'alerts'] },
        ],
      },
    ],
    totalControls: 5,
    industries: ['all'],
    regions: ['global'],
    mandatory: false,
    certificationBody: 'Accredited Certification Body',
    auditFrequency: 'annual',
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    version: '2018',
    description: 'General Data Protection Regulation',
    authority: 'European Union',
    domains: [
      {
        id: 'principles',
        name: 'Data Processing Principles',
        description: 'Core principles for processing personal data',
        controls: [
          { id: 'GDPR.5.1a', name: 'Lawfulness', description: 'Processing must be lawful', category: 'Principles', requirement: 'Establish lawful basis for processing', testable: true, automatable: false, testFrequency: 'quarterly', evidenceTypes: ['policy', 'consent_records'] },
          { id: 'GDPR.5.1b', name: 'Purpose limitation', description: 'Specified, explicit purposes', category: 'Principles', requirement: 'Document purposes for processing', testable: true, automatable: false, testFrequency: 'quarterly', evidenceTypes: ['ropa', 'privacy_notice'] },
          { id: 'GDPR.5.1f', name: 'Integrity and confidentiality', description: 'Appropriate security measures', category: 'Security', requirement: 'Implement appropriate security', testable: true, automatable: true, testFrequency: 'continuous', evidenceTypes: ['test_result', 'config'] },
        ],
      },
      {
        id: 'rights',
        name: 'Data Subject Rights',
        description: 'Rights of individuals',
        controls: [
          { id: 'GDPR.15', name: 'Right of access', description: 'Data subject access requests', category: 'Rights', requirement: 'Enable data subject access', testable: true, automatable: true, testFrequency: 'monthly', evidenceTypes: ['process', 'logs'] },
          { id: 'GDPR.17', name: 'Right to erasure', description: 'Right to be forgotten', category: 'Rights', requirement: 'Enable data erasure', testable: true, automatable: true, testFrequency: 'monthly', evidenceTypes: ['process', 'logs'] },
        ],
      },
    ],
    totalControls: 5,
    industries: ['all'],
    regions: ['eu', 'eea'],
    mandatory: true,
    auditFrequency: 'annual',
  },
];

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

export class ComplianceDashboardService extends EventEmitter {
  private static instance: ComplianceDashboardService;
  
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private attestations: Map<string, ControlAttestation> = new Map();
  private scores: Map<string, ComplianceScore> = new Map();
  
  private ledgerService: TestEvidenceLedgerService;

  private constructor() {
    super();
    this.ledgerService = TestEvidenceLedgerService.getInstance();
    this.initializeFrameworks();
    
    logger.info('[ComplianceDashboard] Service initialized - Compliance tracking ready');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): ComplianceDashboardService {
    if (!ComplianceDashboardService.instance) {
      ComplianceDashboardService.instance = new ComplianceDashboardService();
    }
    return ComplianceDashboardService.instance;
  }

  private initializeFrameworks(): void {
    for (const framework of FRAMEWORKS) {
      this.frameworks.set(framework.id, framework);
      
      // Initialize attestations for each control
      for (const domain of framework.domains) {
        for (const control of domain.controls) {
          const key = `${framework.id}:${control.id}`;
          this.attestations.set(key, {
            controlId: control.id,
            frameworkId: framework.id,
            status: 'not_tested',
            confidence: 0,
            evidenceIds: [],
            evidenceCount: 0,
            statusHistory: [],
          });
        }
      }
    }
  }

  // ===========================================================================
  // FRAMEWORK MANAGEMENT
  // ===========================================================================

  getFramework(frameworkId: string): ComplianceFramework | undefined {
    return this.frameworks.get(frameworkId);
  }

  getFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values());
  }

  getApplicableFrameworks(params: {
    industry?: string;
    region?: string;
  }): ComplianceFramework[] {
    let frameworks = Array.from(this.frameworks.values());
    
    if (params.industry) {
      frameworks = frameworks.filter(f => 
        f.industries.includes('all') || f.industries.includes(params.industry!)
      );
    }
    
    if (params.region) {
      frameworks = frameworks.filter(f => 
        f.regions.includes('global') || f.regions.includes(params.region!)
      );
    }
    
    return frameworks;
  }

  // ===========================================================================
  // ATTESTATION MANAGEMENT
  // ===========================================================================

  async updateAttestation(params: {
    frameworkId: string;
    controlId: string;
    status: ControlAttestation['status'];
    evidenceIds?: string[];
    notes?: string;
    changedBy: string;
  }): Promise<ControlAttestation> {
    const key = `${params.frameworkId}:${params.controlId}`;
    let attestation = this.attestations.get(key);
    
    if (!attestation) {
      attestation = {
        controlId: params.controlId,
        frameworkId: params.frameworkId,
        status: 'not_tested',
        confidence: 0,
        evidenceIds: [],
        evidenceCount: 0,
        statusHistory: [],
      };
    }
    
    // Update status
    const previousStatus = attestation.status;
    attestation.status = params.status;
    attestation.lastTestedAt = new Date();
    
    if (params.status === 'compliant') {
      attestation.lastPassedAt = new Date();
      attestation.confidence = 100;
    } else if (params.status === 'partial') {
      attestation.confidence = 50;
    } else if (params.status === 'non_compliant') {
      attestation.confidence = 0;
    }
    
    // Update evidence
    if (params.evidenceIds) {
      attestation.evidenceIds = [...new Set([...attestation.evidenceIds, ...params.evidenceIds])];
      attestation.evidenceCount = attestation.evidenceIds.length;
    }
    
    if (params.notes) {
      attestation.notes = params.notes;
    }
    
    // Add to history
    attestation.statusHistory.push({
      timestamp: new Date(),
      status: params.status,
      changedBy: params.changedBy,
      reason: previousStatus !== params.status ? `Changed from ${previousStatus}` : 'Re-attested',
    });
    
    this.attestations.set(key, attestation);
    
    // Recalculate scores
    await this.calculateScore(params.frameworkId);
    
    this.emit('attestation:updated', attestation);
    return attestation;
  }

  async attestFromEvidence(frameworkId: string): Promise<void> {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) return;
    
    const entries = this.ledgerService.getEntries();
    
    for (const domain of framework.domains) {
      for (const control of domain.controls) {
        // Find evidence entries that map to this control
        const relevantEntries = entries.filter(e => 
          e.execution.complianceFrameworks.includes(frameworkId) &&
          e.execution.securityControls.includes(control.id)
        );
        
        if (relevantEntries.length === 0) continue;
        
        // Determine status based on test results
        const passed = relevantEntries.filter(e => e.execution.status === 'passed').length;
        const total = relevantEntries.length;
        
        let status: ControlAttestation['status'];
        if (passed === total) status = 'compliant';
        else if (passed === 0) status = 'non_compliant';
        else status = 'partial';
        
        await this.updateAttestation({
          frameworkId,
          controlId: control.id,
          status,
          evidenceIds: relevantEntries.map(e => e.id),
          changedBy: 'auto-attestation',
        });
      }
    }
  }

  getAttestation(frameworkId: string, controlId: string): ControlAttestation | undefined {
    return this.attestations.get(`${frameworkId}:${controlId}`);
  }

  getAttestations(frameworkId: string): ControlAttestation[] {
    return Array.from(this.attestations.values())
      .filter(a => a.frameworkId === frameworkId);
  }

  // ===========================================================================
  // SCORING
  // ===========================================================================

  async calculateScore(frameworkId: string): Promise<ComplianceScore> {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`);
    }
    
    const attestations = this.getAttestations(frameworkId);
    
    // Count by status
    const compliant = attestations.filter(a => a.status === 'compliant').length;
    const partial = attestations.filter(a => a.status === 'partial').length;
    const nonCompliant = attestations.filter(a => a.status === 'non_compliant').length;
    const notTested = attestations.filter(a => a.status === 'not_tested').length;
    const notApplicable = attestations.filter(a => a.status === 'not_applicable').length;
    
    const applicableControls = framework.totalControls - notApplicable;
    const overallScore = applicableControls > 0
      ? Math.round(((compliant + (partial * 0.5)) / applicableControls) * 100)
      : 0;
    
    // Determine overall status
    let overallStatus: ComplianceScore['overallStatus'];
    if (overallScore >= 90) overallStatus = 'compliant';
    else if (overallScore >= 70) overallStatus = 'at_risk';
    else overallStatus = 'non_compliant';
    
    // Calculate domain scores
    const domainScores = framework.domains.map(domain => {
      const domainAttestations = attestations.filter(a => 
        domain.controls.some(c => c.id === a.controlId)
      );
      
      const domainCompliant = domainAttestations.filter(a => a.status === 'compliant').length;
      const domainTotal = domain.controls.length;
      const score = domainTotal > 0 ? Math.round((domainCompliant / domainTotal) * 100) : 0;
      
      return {
        domainId: domain.id,
        domainName: domain.name,
        score,
        status: score >= 90 ? 'compliant' : score >= 70 ? 'at_risk' : 'non_compliant',
      };
    });
    
    // Get previous score for trend
    const previousScore = this.scores.get(frameworkId);
    let trend: ComplianceScore['trend'] = 'stable';
    let scoreChange = 0;
    
    if (previousScore) {
      scoreChange = overallScore - previousScore.overallScore;
      if (scoreChange > 5) trend = 'improving';
      else if (scoreChange < -5) trend = 'declining';
    }
    
    // Calculate audit readiness
    const auditReadiness = Math.round(
      (attestations.filter(a => a.evidenceCount > 0).length / attestations.length) * 100
    );
    
    // Count critical gaps
    const criticalGaps = nonCompliant;
    
    const score: ComplianceScore = {
      frameworkId,
      frameworkName: framework.name,
      overallScore,
      overallStatus,
      totalControls: framework.totalControls,
      compliantControls: compliant,
      partialControls: partial,
      nonCompliantControls: nonCompliant,
      notTestedControls: notTested,
      notApplicableControls: notApplicable,
      domainScores,
      trend,
      previousScore: previousScore?.overallScore,
      scoreChange,
      auditReadiness,
      criticalGaps,
      calculatedAt: new Date(),
    };
    
    this.scores.set(frameworkId, score);
    this.emit('score:calculated', score);
    
    return score;
  }

  getScore(frameworkId: string): ComplianceScore | undefined {
    return this.scores.get(frameworkId);
  }

  async getAllScores(): Promise<ComplianceScore[]> {
    const scores: ComplianceScore[] = [];
    
    for (const frameworkId of this.frameworks.keys()) {
      const score = await this.calculateScore(frameworkId);
      scores.push(score);
    }
    
    return scores;
  }

  // ===========================================================================
  // GAP ANALYSIS
  // ===========================================================================

  async analyzeGaps(frameworkId: string): Promise<GapAnalysis> {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`);
    }
    
    const attestations = this.getAttestations(frameworkId);
    const gaps: ComplianceGap[] = [];
    
    for (const domain of framework.domains) {
      for (const control of domain.controls) {
        const attestation = attestations.find(a => a.controlId === control.id);
        
        if (!attestation || attestation.status === 'compliant' || attestation.status === 'not_applicable') {
          continue;
        }
        
        let severity: ComplianceGap['severity'];
        let gapType: ComplianceGap['gapType'];
        
        if (attestation.status === 'not_tested') {
          severity = 'medium';
          gapType = attestation.evidenceCount === 0 ? 'missing_control' : 'insufficient_evidence';
        } else if (attestation.status === 'non_compliant') {
          severity = 'critical';
          gapType = 'failed_test';
        } else {
          severity = 'high';
          gapType = 'insufficient_evidence';
        }
        
        // Check if test is outdated
        if (attestation.lastTestedAt) {
          const daysSinceTest = (Date.now() - attestation.lastTestedAt.getTime()) / (1000 * 60 * 60 * 24);
          const frequencyDays = this.getFrequencyDays(control.testFrequency);
          
          if (daysSinceTest > frequencyDays * 1.5) {
            gapType = 'outdated_test';
            severity = severity === 'critical' ? 'critical' : 'high';
          }
        }
        
        gaps.push({
          controlId: control.id,
          controlName: control.name,
          domainId: domain.id,
          severity,
          gapType,
          description: `Control ${control.id} - ${control.name} is ${attestation.status}`,
          riskImpact: this.assessRiskImpact(severity),
          businessImpact: this.assessBusinessImpact(framework.mandatory, severity),
          remediationSteps: this.generateRemediationSteps(control, gapType),
          estimatedEffort: this.estimateEffort(gapType),
          priority: this.calculatePriority(severity, framework.mandatory),
        });
      }
    }
    
    // Sort by priority
    gaps.sort((a, b) => a.priority - b.priority);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(gaps, framework);
    
    const analysis: GapAnalysis = {
      frameworkId,
      analyzedAt: new Date(),
      gaps,
      totalGaps: gaps.length,
      criticalGaps: gaps.filter(g => g.severity === 'critical').length,
      highGaps: gaps.filter(g => g.severity === 'high').length,
      mediumGaps: gaps.filter(g => g.severity === 'medium').length,
      lowGaps: gaps.filter(g => g.severity === 'low').length,
      recommendations,
      estimatedRemediationEffort: this.calculateTotalEffort(gaps),
    };
    
    this.emit('gaps:analyzed', analysis);
    return analysis;
  }

  private getFrequencyDays(frequency: string): number {
    switch (frequency) {
      case 'continuous': return 1;
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'quarterly': return 90;
      case 'annual': return 365;
      default: return 365;
    }
  }

  private assessRiskImpact(severity: ComplianceGap['severity']): string {
    switch (severity) {
      case 'critical': return 'Immediate security risk; potential data breach exposure';
      case 'high': return 'Significant risk; compliance violation likely';
      case 'medium': return 'Moderate risk; may fail audit';
      case 'low': return 'Minor risk; improvement opportunity';
    }
  }

  private assessBusinessImpact(mandatory: boolean, severity: ComplianceGap['severity']): string {
    if (mandatory && severity === 'critical') {
      return 'Potential regulatory fines and enforcement actions';
    } else if (mandatory) {
      return 'Risk of regulatory scrutiny and remediation orders';
    } else if (severity === 'critical') {
      return 'May lose customer trust and business opportunities';
    }
    return 'May impact competitive positioning';
  }

  private generateRemediationSteps(control: ComplianceControl, gapType: ComplianceGap['gapType']): string[] {
    const steps: string[] = [];
    
    switch (gapType) {
      case 'missing_control':
        steps.push(`Implement control: ${control.name}`);
        steps.push(`Document the control implementation`);
        steps.push(`Create evidence collection process`);
        steps.push(`Schedule initial testing`);
        break;
      case 'insufficient_evidence':
        steps.push(`Review current evidence for ${control.name}`);
        steps.push(`Identify additional evidence sources`);
        steps.push(`Implement automated evidence collection`);
        steps.push(`Re-run compliance tests`);
        break;
      case 'failed_test':
        steps.push(`Analyze test failure root cause`);
        steps.push(`Implement corrective actions`);
        steps.push(`Update control configuration`);
        steps.push(`Re-test control`);
        break;
      case 'outdated_test':
        steps.push(`Schedule immediate re-testing`);
        steps.push(`Review test frequency requirements`);
        steps.push(`Set up automated testing schedule`);
        break;
      case 'policy_gap':
        steps.push(`Review and update relevant policies`);
        steps.push(`Obtain policy approval`);
        steps.push(`Communicate policy changes`);
        steps.push(`Implement policy controls`);
        break;
    }
    
    return steps;
  }

  private estimateEffort(gapType: ComplianceGap['gapType']): string {
    switch (gapType) {
      case 'missing_control': return '2-4 weeks';
      case 'insufficient_evidence': return '1-2 weeks';
      case 'failed_test': return '1-3 weeks';
      case 'outdated_test': return '1-2 days';
      case 'policy_gap': return '2-4 weeks';
      default: return '1-2 weeks';
    }
  }

  private calculatePriority(severity: ComplianceGap['severity'], mandatory: boolean): number {
    let priority = 0;
    
    switch (severity) {
      case 'critical': priority = 1; break;
      case 'high': priority = 2; break;
      case 'medium': priority = 3; break;
      case 'low': priority = 4; break;
    }
    
    if (mandatory) priority -= 0.5;
    
    return priority;
  }

  private generateRecommendations(gaps: ComplianceGap[], framework: ComplianceFramework): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Group gaps by type
    const byType = new Map<string, ComplianceGap[]>();
    for (const gap of gaps) {
      if (!byType.has(gap.gapType)) {
        byType.set(gap.gapType, []);
      }
      byType.get(gap.gapType)!.push(gap);
    }
    
    // Generate recommendations
    let priority = 1;
    
    // Critical gaps first
    const criticalGaps = gaps.filter(g => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push({
        id: `rec-${crypto.randomUUID().slice(0, 8)}`,
        priority: priority++,
        category: 'immediate',
        title: 'Address Critical Compliance Gaps',
        description: `${criticalGaps.length} critical gaps require immediate attention`,
        affectedControls: criticalGaps.map(g => g.controlId),
        effort: 'high',
        impact: 'high',
        steps: [
          'Prioritize critical gaps for immediate remediation',
          'Assign dedicated resources',
          'Implement temporary compensating controls if needed',
          'Track progress daily until resolved',
        ],
      });
    }
    
    // Missing controls
    const missingControls = byType.get('missing_control') || [];
    if (missingControls.length > 0) {
      recommendations.push({
        id: `rec-${crypto.randomUUID().slice(0, 8)}`,
        priority: priority++,
        category: 'short_term',
        title: 'Implement Missing Controls',
        description: `${missingControls.length} controls need to be implemented`,
        affectedControls: missingControls.map(g => g.controlId),
        effort: 'high',
        impact: 'high',
        steps: [
          'Review control requirements',
          'Design implementation plan',
          'Implement controls with evidence collection',
          'Test and validate',
        ],
      });
    }
    
    // Automate testing
    const outdatedTests = byType.get('outdated_test') || [];
    if (outdatedTests.length > 0) {
      recommendations.push({
        id: `rec-${crypto.randomUUID().slice(0, 8)}`,
        priority: priority++,
        category: 'short_term',
        title: 'Automate Compliance Testing',
        description: `${outdatedTests.length} tests are outdated - implement automation`,
        affectedControls: outdatedTests.map(g => g.controlId),
        effort: 'medium',
        impact: 'medium',
        steps: [
          'Identify automatable controls',
          'Implement automated test scripts',
          'Schedule continuous testing',
          'Set up alerting for failures',
        ],
      });
    }
    
    return recommendations;
  }

  private calculateTotalEffort(gaps: ComplianceGap[]): string {
    let totalWeeks = 0;
    
    for (const gap of gaps) {
      const effort = gap.estimatedEffort;
      const match = effort.match(/(\d+)-(\d+)\s*(day|week)/);
      if (match) {
        const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
        if (match[3] === 'day') {
          totalWeeks += avg / 5;
        } else {
          totalWeeks += avg;
        }
      }
    }
    
    if (totalWeeks < 4) return `${Math.ceil(totalWeeks)} weeks`;
    return `${Math.ceil(totalWeeks / 4)} months`;
  }

  // ===========================================================================
  // DASHBOARD DATA
  // ===========================================================================

  async getDashboardData(): Promise<{
    frameworks: ComplianceFramework[];
    scores: ComplianceScore[];
    recentAttestations: ControlAttestation[];
    criticalGaps: ComplianceGap[];
    auditReadiness: number;
  }> {
    const frameworks = this.getFrameworks();
    const scores = await this.getAllScores();
    
    // Get recent attestations
    const allAttestations = Array.from(this.attestations.values());
    const recentAttestations = allAttestations
      .filter(a => a.lastTestedAt)
      .sort((a, b) => b.lastTestedAt!.getTime() - a.lastTestedAt!.getTime())
      .slice(0, 10);
    
    // Get critical gaps across all frameworks
    const allGaps: ComplianceGap[] = [];
    for (const framework of frameworks) {
      const analysis = await this.analyzeGaps(framework.id);
      allGaps.push(...analysis.gaps.filter(g => g.severity === 'critical'));
    }
    
    // Calculate overall audit readiness
    const auditReadiness = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.auditReadiness, 0) / scores.length)
      : 0;
    
    return {
      frameworks,
      scores,
      recentAttestations,
      criticalGaps: allGaps,
      auditReadiness,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'ComplianceDashboard', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.frameworks.has(d.id)) this.frameworks.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'ComplianceDashboard', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.attestations.has(d.id)) this.attestations.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'ComplianceDashboard', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.scores.has(d.id)) this.scores.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[ComplianceDashboardService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[ComplianceDashboardService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export default ComplianceDashboardService;
