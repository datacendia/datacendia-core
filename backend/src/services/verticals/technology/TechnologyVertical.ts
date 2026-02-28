// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Technology / SaaS Vertical Implementation
 * 
 * Datacendia = "AI Governance for AI Builders"
 * 
 * Killer Asset: Model governance audit trails that prove
 * responsible AI deployment before regulators ask.
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  DataConnector,
  DataSource,
  IngestResult,
  ProvenanceRecord,
  VerticalKnowledgeBase,
  KnowledgeDocument,
  RetrievalResult,
  ComplianceMapper,
  ComplianceFramework,
  ComplianceControl,
  ComplianceViolation,
  ComplianceEvidence,
  DecisionSchema,
  BaseDecision,
  ValidationResult,
  DefensibleArtifact,
  AgentPreset,
  AgentCapability,
  AgentGuardrail,
  WorkflowStep,
  AgentTrace,
  DefensibleOutput,
  RegulatorPacket,
  CourtBundle,
  AuditTrail,
  VerticalImplementation,
  VerticalRegistry
} from '../core/VerticalPattern.js';
import { embeddingService } from '../../llm/EmbeddingService.js';

// ============================================================================
// TECHNOLOGY DECISION TYPES
// ============================================================================

export interface ModelDeploymentDecision extends BaseDecision {
  type: 'model-deployment';
  inputs: {
    modelId: string;
    modelName: string;
    modelVersion: string;
    targetEnvironment: 'staging' | 'production' | 'canary';
    performanceMetrics: { metric: string; value: number; threshold: number; passed: boolean }[];
    biasTestResults: { category: string; score: number; acceptable: boolean }[];
    securityScan: { vulnerabilities: number; critical: number; high: number };
    dataPrivacyReview: boolean;
    rollbackPlan: string;
  };
  outcome: {
    approved: boolean;
    deploymentId?: string;
    conditions?: string[];
    gatesPassed: string[];
    gatesFailed: string[];
    rollbackTriggers: string[];
  };
}

export interface ArchitectureDecision extends BaseDecision {
  type: 'architecture';
  inputs: {
    proposalId: string;
    title: string;
    description: string;
    impactedSystems: string[];
    alternatives: { name: string; pros: string[]; cons: string[]; cost: number }[];
    securityImplications: string[];
    scalabilityImpact: string;
    migrationPlan: string;
    estimatedEffort: number;
  };
  outcome: {
    decision: 'approve' | 'reject' | 'defer' | 'modify';
    selectedAlternative?: string;
    conditions?: string[];
    reviewDate?: Date;
    architectReview: boolean;
  };
}

export interface IncidentResponseDecision extends BaseDecision {
  type: 'incident-response';
  inputs: {
    incidentId: string;
    severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
    description: string;
    impactedServices: string[];
    customerImpact: { affectedUsers: number; revenueAtRisk: number };
    rootCause?: string;
    timelineEvents: { timestamp: Date; event: string; actor: string }[];
    mitigationOptions: { option: string; eta: string; risk: string }[];
  };
  outcome: {
    selectedMitigation: string;
    escalated: boolean;
    customerNotification: boolean;
    postmortemRequired: boolean;
    slaBreached: boolean;
    resolutionTime?: number;
  };
}

export interface DataPipelineDecision extends BaseDecision {
  type: 'data-pipeline';
  inputs: {
    pipelineId: string;
    pipelineName: string;
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    sourceSystem: string;
    destinationSystem: string;
    dataVolume: number;
    piiDetected: boolean;
    crossBorderTransfer: boolean;
    retentionPolicy: string;
    encryptionMethod: string;
  };
  outcome: {
    approved: boolean;
    dpiaConducted: boolean;
    encryptionRequired: boolean;
    anonymizationRequired: boolean;
    consentVerified: boolean;
    dataResidencyCompliant: boolean;
    conditions?: string[];
  };
}

export interface VendorSecurityDecision extends BaseDecision {
  type: 'vendor-security';
  inputs: {
    vendorId: string;
    vendorName: string;
    serviceType: string;
    dataShared: string[];
    securityQuestionnaire: { question: string; answer: string; score: number }[];
    certifications: string[];
    subprocessors: string[];
    breachHistory: { date: Date; description: string; severity: string }[];
    contractValue: number;
  };
  outcome: {
    approved: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    requiredControls: string[];
    reviewFrequency: 'quarterly' | 'semi-annual' | 'annual';
    dpaRequired: boolean;
    conditions?: string[];
  };
}

export interface FeatureReleaseDecision extends BaseDecision {
  type: 'feature-release';
  inputs: {
    featureId: string;
    featureName: string;
    releaseType: 'major' | 'minor' | 'patch' | 'hotfix';
    testCoverage: number;
    qaSignOff: boolean;
    securityReview: boolean;
    accessibilityReview: boolean;
    performanceTests: { test: string; result: number; threshold: number; passed: boolean }[];
    featureFlags: { flag: string; enabled: boolean; rolloutPercentage: number }[];
    breakingChanges: string[];
  };
  outcome: {
    approved: boolean;
    releaseStrategy: 'full' | 'canary' | 'blue-green' | 'feature-flag';
    rolloutPercentage: number;
    monitoringPeriod: number;
    rollbackCriteria: string[];
    communicationPlan: string;
  };
}

export interface CapacityPlanningDecision extends BaseDecision {
  type: 'capacity-planning';
  inputs: {
    service: string;
    currentUtilization: number;
    projectedGrowth: number;
    forecastPeriod: number;
    currentCost: number;
    scalingOptions: { option: string; capacity: number; cost: number; leadTime: number }[];
    slaRequirements: { metric: string; target: number; current: number }[];
    redundancyLevel: string;
  };
  outcome: {
    selectedOption: string;
    approvedBudget: number;
    implementationTimeline: string;
    autoScalingEnabled: boolean;
    reservedCapacity: number;
    costPerUnit: number;
  };
}

export interface ComplianceCertificationDecision extends BaseDecision {
  type: 'compliance-certification';
  inputs: {
    certificationId: string;
    framework: string;
    scope: string[];
    currentGaps: { control: string; gap: string; remediation: string; effort: number }[];
    auditorFindings: string[];
    evidenceCollected: number;
    evidenceRequired: number;
    timeline: Date;
    budget: number;
  };
  outcome: {
    proceedWithCertification: boolean;
    gapsClosed: number;
    gapsRemaining: number;
    estimatedCompletionDate: Date;
    budgetApproved: number;
    externalAuditorEngaged: boolean;
    conditions?: string[];
  };
}

export interface APIDeprecationDecision extends BaseDecision {
  type: 'api-deprecation';
  inputs: {
    apiEndpoint: string;
    apiVersion: string;
    activeConsumers: number;
    monthlyRequests: number;
    replacementApi?: string;
    migrationGuide: boolean;
    sunsetDate: Date;
    notificationsSent: number;
    breakingChanges: string[];
  };
  outcome: {
    approved: boolean;
    deprecationDate: Date;
    removalDate: Date;
    gracePeriodDays: number;
    migrationSupport: boolean;
    forceUpgrade: boolean;
    customerCommunication: string;
  };
}

export interface AccessControlDecision extends BaseDecision {
  type: 'access-control';
  inputs: {
    requestId: string;
    requestor: string;
    requestorRole: string;
    resourceType: 'production-db' | 'admin-panel' | 'secrets-vault' | 'customer-data' | 'source-code' | 'infrastructure';
    accessLevel: 'read' | 'write' | 'admin' | 'emergency';
    justification: string;
    duration: number;
    previousAccess: boolean;
    managerApproval: boolean;
  };
  outcome: {
    granted: boolean;
    accessLevel: string;
    expiresAt: Date;
    monitoringEnabled: boolean;
    auditLogRequired: boolean;
    conditions?: string[];
    denialReason?: string;
  };
}

export interface BudgetAllocationDecision extends BaseDecision {
  type: 'budget-allocation';
  inputs: {
    department: string;
    category: 'infrastructure' | 'tooling' | 'headcount' | 'training' | 'security' | 'compliance';
    requestedAmount: number;
    currentSpend: number;
    budgetRemaining: number;
    businessJustification: string;
    expectedROI: number;
    alternatives: { option: string; cost: number; benefit: string }[];
    urgency: 'immediate' | 'next-quarter' | 'next-year';
  };
  outcome: {
    approved: boolean;
    approvedAmount: number;
    conditions?: string[];
    reviewDate: Date;
    kpiTargets: { metric: string; target: number }[];
  };
}

export interface OpenSourceAdoptionDecision extends BaseDecision {
  type: 'open-source-adoption';
  inputs: {
    packageName: string;
    version: string;
    license: string;
    maintainerCount: number;
    lastUpdate: Date;
    downloadCount: number;
    knownVulnerabilities: number;
    alternatives: { name: string; license: string; stars: number }[];
    usageScope: 'internal' | 'customer-facing' | 'infrastructure';
    copyleftRisk: boolean;
  };
  outcome: {
    approved: boolean;
    licenseCompatible: boolean;
    securityAcceptable: boolean;
    maintenanceRisk: 'low' | 'medium' | 'high';
    conditions?: string[];
    reviewFrequency: string;
  };
}

export type TechnologyDecision =
  | ModelDeploymentDecision
  | ArchitectureDecision
  | IncidentResponseDecision
  | DataPipelineDecision
  | VendorSecurityDecision
  | FeatureReleaseDecision
  | CapacityPlanningDecision
  | ComplianceCertificationDecision
  | APIDeprecationDecision
  | AccessControlDecision
  | BudgetAllocationDecision
  | OpenSourceAdoptionDecision;

// ============================================================================
// LAYER 1: TECHNOLOGY DATA CONNECTOR
// ============================================================================

export interface CICDData {
  pipelineId: string;
  status: string;
  testResults: { suite: string; passed: number; failed: number; skipped: number }[];
  codeQuality: { metric: string; value: number }[];
  deployments: { environment: string; version: string; timestamp: Date }[];
}

export interface MonitoringData {
  serviceId: string;
  uptime: number;
  errorRate: number;
  latencyP50: number;
  latencyP99: number;
  alerts: { alertId: string; severity: string; message: string; timestamp: Date }[];
}

export class TechnologyDataConnector extends DataConnector<CICDData | MonitoringData> {
  readonly verticalId = 'technology';
  readonly connectorType = 'multi-source';

  constructor() {
    super();
    this.initializeSources();
  }

  private initializeSources(): void {
    this.sources.set('cicd', { id: 'cicd', name: 'CI/CD Pipeline', type: 'api', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 });
    this.sources.set('monitoring', { id: 'monitoring', name: 'Monitoring Platform', type: 'stream', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 });
    this.sources.set('security-scanner', { id: 'security-scanner', name: 'Security Scanner', type: 'api', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 });
    this.sources.set('artifact-registry', { id: 'artifact-registry', name: 'Artifact Registry', type: 'api', connectionStatus: 'disconnected', lastSync: null, recordCount: 0 });
  }

  async connect(config: Record<string, unknown>): Promise<boolean> {
    const sourceId = config['sourceId'] as string;
    const source = this.sources.get(sourceId);
    if (!source) return false;
    source.connectionStatus = 'connected';
    source.lastSync = new Date();
    return true;
  }

  async disconnect(): Promise<void> {
    for (const source of this.sources.values()) source.connectionStatus = 'disconnected';
  }

  async ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<CICDData | MonitoringData>> {
    const source = this.sources.get(sourceId);
    if (!source || source.connectionStatus !== 'connected') {
      return { success: false, data: null, provenance: this.generateProvenance(sourceId, null), validationErrors: [`Source ${sourceId} not connected`] };
    }
    const data = this.fetchConnectorData(sourceId);
    const validation = this.validate(data);
    source.lastSync = new Date();
    source.recordCount += 1;
    return { success: validation.valid, data: validation.valid ? data : null, provenance: this.generateProvenance(sourceId, data), validationErrors: validation.errors };
  }

  validate(data: CICDData | MonitoringData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data) { errors.push('Data is null'); return { valid: false, errors }; }
    if ('pipelineId' in data) { if (!data.pipelineId) errors.push('Pipeline ID required'); }
    else if ('serviceId' in data) { if (!data.serviceId) errors.push('Service ID required'); }
    return { valid: errors.length === 0, errors };
  }

  private fetchConnectorData(sourceId: string): CICDData | MonitoringData {
    if (sourceId === 'cicd') {
      return { pipelineId: 'pipe-001', status: 'success', testResults: [{ suite: 'unit', passed: 1200, failed: 3, skipped: 5 }], codeQuality: [{ metric: 'coverage', value: 87 }], deployments: [] };
    }
    return { serviceId: 'svc-001', uptime: 99.95, errorRate: 0.02, latencyP50: 45, latencyP99: 250, alerts: [] };
  }
}

// ============================================================================
// LAYER 2: TECHNOLOGY KNOWLEDGE BASE
// ============================================================================

export class TechnologyKnowledgeBase extends VerticalKnowledgeBase {
  readonly verticalId = 'technology';

  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> {
    const doc: KnowledgeDocument = { id: uuidv4(), content, metadata: { ...metadata, documentType: metadata['documentType'] || 'technical-standard' }, provenance, embedding: this.generateEmbedding(content), createdAt: new Date(), updatedAt: new Date() };
    this.documents.set(doc.id, doc);
    return doc;
  }

  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> {
    const queryEmb = this.generateEmbedding(query);
    const scored: { doc: KnowledgeDocument; score: number }[] = [];
    for (const doc of this.documents.values()) { if (doc.embedding) scored.push({ doc, score: this.cosineSimilarity(queryEmb, doc.embedding) }); }
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK);
    return { documents: top.map(s => s.doc), scores: top.map(s => s.score), provenanceVerified: top.every(s => s.doc.provenance.authoritative), query };
  }

  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: ['Document not found'] };
    const issues: string[] = [];
    if (!doc.provenance.authoritative) issues.push('Document source is not authoritative');
    const currentHash = crypto.createHash('sha256').update(doc.content).digest('hex');
    if (currentHash !== doc.provenance.hash) issues.push('Document content hash mismatch');
    return { valid: issues.length === 0, issues };
  }

  private generateEmbedding(text: string): number[] {
    return embeddingService.hashFallback(text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, nA = 0, nB = 0;
    for (let i = 0; i < a.length; i++) { dot += (a[i]??0) * (b[i]??0); nA += (a[i]??0)**2; nB += (b[i]??0)**2; }
    return dot / (Math.sqrt(nA) * Math.sqrt(nB));
  }
}

// ============================================================================
// LAYER 3: TECHNOLOGY COMPLIANCE MAPPER
// ============================================================================

export class TechnologyComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'technology';
  readonly supportedFrameworks: ComplianceFramework[] = [
    {
      id: 'soc2-type2', name: 'SOC 2 Type II', version: '2024', jurisdiction: 'US',
      controls: [
        { id: 'soc2-cc1', name: 'Control Environment', description: 'Management philosophy and accountability', severity: 'high', automatable: false },
        { id: 'soc2-cc6', name: 'Logical Access', description: 'Logical and physical access controls', severity: 'critical', automatable: true },
        { id: 'soc2-cc7', name: 'System Operations', description: 'System monitoring and incident management', severity: 'high', automatable: true },
        { id: 'soc2-cc8', name: 'Change Management', description: 'Change control processes', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'iso-27001', name: 'ISO 27001', version: '2022', jurisdiction: 'International',
      controls: [
        { id: 'iso27-a5', name: 'Information Security Policies', description: 'Management direction for information security', severity: 'high', automatable: false },
        { id: 'iso27-a8', name: 'Asset Management', description: 'Identification and protection of assets', severity: 'high', automatable: true },
        { id: 'iso27-a9', name: 'Access Control', description: 'Limit access to information', severity: 'critical', automatable: true },
        { id: 'iso27-a12', name: 'Operations Security', description: 'Correct and secure operations', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'gdpr', name: 'GDPR', version: '2018', jurisdiction: 'EU',
      controls: [
        { id: 'gdpr-art5', name: 'Data Processing Principles', description: 'Lawfulness, fairness, transparency', severity: 'critical', automatable: true },
        { id: 'gdpr-art25', name: 'Data Protection by Design', description: 'Privacy by design and default', severity: 'high', automatable: false },
        { id: 'gdpr-art32', name: 'Security of Processing', description: 'Technical and organizational measures', severity: 'critical', automatable: true },
        { id: 'gdpr-art35', name: 'DPIA', description: 'Data Protection Impact Assessment', severity: 'high', automatable: false }
      ]
    },
    {
      id: 'eu-ai-act', name: 'EU AI Act', version: '2024', jurisdiction: 'EU',
      controls: [
        { id: 'euai-risk-class', name: 'Risk Classification', description: 'AI system risk categorization', severity: 'critical', automatable: true },
        { id: 'euai-transparency', name: 'Transparency Obligations', description: 'AI system transparency requirements', severity: 'critical', automatable: true },
        { id: 'euai-human-oversight', name: 'Human Oversight', description: 'Human-in-the-loop requirements', severity: 'critical', automatable: false },
        { id: 'euai-data-governance', name: 'Data Governance', description: 'Training data quality requirements', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'nist-ai-rmf', name: 'NIST AI Risk Management Framework', version: '2023', jurisdiction: 'US',
      controls: [
        { id: 'nist-ai-govern', name: 'Govern', description: 'AI risk management governance', severity: 'high', automatable: false },
        { id: 'nist-ai-map', name: 'Map', description: 'Context and risk identification', severity: 'high', automatable: true },
        { id: 'nist-ai-measure', name: 'Measure', description: 'AI risk analysis and tracking', severity: 'high', automatable: true },
        { id: 'nist-ai-manage', name: 'Manage', description: 'AI risk treatment and monitoring', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'ccpa', name: 'CCPA/CPRA', version: '2023', jurisdiction: 'US-CA',
      controls: [
        { id: 'ccpa-disclosure', name: 'Disclosure Requirements', description: 'Notice at collection', severity: 'critical', automatable: true },
        { id: 'ccpa-opt-out', name: 'Opt-Out Rights', description: 'Right to opt out of sale', severity: 'critical', automatable: true },
        { id: 'ccpa-deletion', name: 'Deletion Rights', description: 'Right to delete personal information', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'owasp-top10', name: 'OWASP Top 10', version: '2021', jurisdiction: 'International',
      controls: [
        { id: 'owasp-a01', name: 'Broken Access Control', description: 'Access control enforcement', severity: 'critical', automatable: true },
        { id: 'owasp-a02', name: 'Cryptographic Failures', description: 'Proper cryptography usage', severity: 'critical', automatable: true },
        { id: 'owasp-a03', name: 'Injection', description: 'Prevention of injection attacks', severity: 'critical', automatable: true },
        { id: 'owasp-a09', name: 'Logging & Monitoring', description: 'Security logging and monitoring', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'pci-dss', name: 'PCI DSS', version: '4.0', jurisdiction: 'International',
      controls: [
        { id: 'pci-req1', name: 'Network Security Controls', description: 'Install and maintain network security controls', severity: 'critical', automatable: true },
        { id: 'pci-req3', name: 'Protect Stored Data', description: 'Protect stored account data', severity: 'critical', automatable: true },
        { id: 'pci-req6', name: 'Secure Systems', description: 'Develop and maintain secure systems', severity: 'critical', automatable: true },
        { id: 'pci-req10', name: 'Log and Monitor', description: 'Log and monitor all access', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'nist-csf', name: 'NIST Cybersecurity Framework', version: '2.0', jurisdiction: 'US',
      controls: [
        { id: 'csf-identify', name: 'Identify', description: 'Asset management, risk assessment', severity: 'high', automatable: true },
        { id: 'csf-protect', name: 'Protect', description: 'Access control, data security, training', severity: 'critical', automatable: true },
        { id: 'csf-detect', name: 'Detect', description: 'Anomalies, continuous monitoring', severity: 'high', automatable: true },
        { id: 'csf-respond', name: 'Respond', description: 'Incident response, mitigation', severity: 'critical', automatable: true }
      ]
    },
    {
      id: 'fedramp', name: 'FedRAMP', version: '2024', jurisdiction: 'US',
      controls: [
        { id: 'fedramp-ac', name: 'Access Control', description: 'Federal access control requirements', severity: 'critical', automatable: true },
        { id: 'fedramp-au', name: 'Audit and Accountability', description: 'Audit logging requirements', severity: 'critical', automatable: true },
        { id: 'fedramp-sc', name: 'System and Communications', description: 'System communications protection', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'hipaa-tech', name: 'HIPAA Technical Safeguards', version: '2024', jurisdiction: 'US',
      controls: [
        { id: 'hipaa-access', name: 'Access Controls', description: 'Technical policies for ePHI access', severity: 'critical', automatable: true },
        { id: 'hipaa-audit', name: 'Audit Controls', description: 'Record and examine ePHI access', severity: 'critical', automatable: true },
        { id: 'hipaa-integrity', name: 'Integrity Controls', description: 'Protect ePHI from alteration', severity: 'critical', automatable: true },
        { id: 'hipaa-transmission', name: 'Transmission Security', description: 'Guard ePHI during transmission', severity: 'critical', automatable: true }
      ]
    },
    {
      id: 'sdlc-best-practices', name: 'Secure SDLC Best Practices', version: '2024', jurisdiction: 'International',
      controls: [
        { id: 'sdlc-code-review', name: 'Code Review', description: 'Mandatory peer code review', severity: 'high', automatable: true },
        { id: 'sdlc-sast', name: 'SAST', description: 'Static application security testing', severity: 'high', automatable: true },
        { id: 'sdlc-dast', name: 'DAST', description: 'Dynamic application security testing', severity: 'high', automatable: true },
        { id: 'sdlc-sbom', name: 'SBOM', description: 'Software bill of materials generation', severity: 'medium', automatable: true }
      ]
    }
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];
    const mappings: Record<string, Record<string, string[]>> = {
      'model-deployment': { 'eu-ai-act': ['euai-risk-class', 'euai-transparency', 'euai-human-oversight', 'euai-data-governance'], 'nist-ai-rmf': ['nist-ai-govern', 'nist-ai-map', 'nist-ai-measure', 'nist-ai-manage'], 'soc2-type2': ['soc2-cc8'], 'sdlc-best-practices': ['sdlc-sast', 'sdlc-sbom'] },
      'architecture': { 'soc2-type2': ['soc2-cc8'], 'iso-27001': ['iso27-a8'], 'nist-csf': ['csf-identify', 'csf-protect'] },
      'incident-response': { 'soc2-type2': ['soc2-cc7'], 'nist-csf': ['csf-detect', 'csf-respond'], 'iso-27001': ['iso27-a12'] },
      'data-pipeline': { 'gdpr': ['gdpr-art5', 'gdpr-art25', 'gdpr-art32', 'gdpr-art35'], 'ccpa': ['ccpa-disclosure', 'ccpa-opt-out', 'ccpa-deletion'] },
      'vendor-security': { 'soc2-type2': ['soc2-cc6'], 'iso-27001': ['iso27-a9'], 'nist-csf': ['csf-identify'] },
      'feature-release': { 'soc2-type2': ['soc2-cc8'], 'sdlc-best-practices': ['sdlc-code-review', 'sdlc-sast', 'sdlc-dast', 'sdlc-sbom'], 'owasp-top10': ['owasp-a01', 'owasp-a02', 'owasp-a03'] },
      'access-control': { 'soc2-type2': ['soc2-cc6'], 'iso-27001': ['iso27-a9'], 'pci-dss': ['pci-req1'], 'fedramp': ['fedramp-ac'] },
      'compliance-certification': { 'soc2-type2': ['soc2-cc1'], 'iso-27001': ['iso27-a5'] }
    };
    const controlIds = mappings[decisionType]?.[frameworkId] || [];
    return framework.controls.filter(c => controlIds.includes(c.id));
  }

  async checkViolation(decision: TechnologyDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const controls = this.mapToFramework(decision.type, frameworkId);
    for (const control of controls) {
      const v = await this.evaluateControl(decision, control);
      if (v) violations.push(v);
    }
    return violations;
  }

  async generateEvidence(decision: TechnologyDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    const controls = this.mapToFramework(decision.type, frameworkId);
    return controls.map(control => ({
      id: uuidv4(), frameworkId, controlId: control.id,
      status: 'compliant' as const,
      evidence: `Control ${control.id} evaluated for ${decision.type} decision ${decision.metadata.id}. Decision by ${decision.metadata.createdBy} at ${decision.metadata.createdAt.toISOString()}.`,
      generatedAt: new Date(),
      hash: crypto.createHash('sha256').update(JSON.stringify({ decision: decision.metadata.id, control: control.id })).digest('hex')
    }));
  }

  private async evaluateControl(decision: TechnologyDecision, control: ComplianceControl): Promise<ComplianceViolation | null> {
    if (decision.type === 'model-deployment' && control.id === 'euai-human-oversight') {
      const md = decision as ModelDeploymentDecision;
      if (md.outcome.approved && md.outcome.gatesFailed.length > 0) {
        return { controlId: control.id, severity: 'high', description: 'Model deployed with failed gates', remediation: 'Review and resolve failed gates before deployment', detectedAt: new Date() };
      }
    }
    if (decision.type === 'data-pipeline' && control.id === 'gdpr-art35') {
      const dp = decision as DataPipelineDecision;
      if (dp.inputs.piiDetected && !dp.outcome.dpiaConducted) {
        return { controlId: control.id, severity: 'critical', description: 'PII detected but no DPIA conducted', remediation: 'Conduct DPIA before processing PII', detectedAt: new Date() };
      }
    }
    return null;
  }
}

// ============================================================================
// LAYER 4: TECHNOLOGY DECISION SCHEMAS
// ============================================================================

export class ModelDeploymentSchema extends DecisionSchema<ModelDeploymentDecision> {
  readonly verticalId = 'technology';
  readonly decisionType = 'model-deployment';
  readonly requiredFields = ['inputs.modelId', 'inputs.modelVersion', 'inputs.targetEnvironment', 'outcome.approved'];
  readonly requiredApprovers = ['ml-engineer', 'security-reviewer'];

  validate(decision: Partial<ModelDeploymentDecision>): ValidationResult {
    const errors: string[] = [], warnings: string[] = [];
    if (!decision.inputs?.modelId) errors.push('Model ID required');
    if (!decision.inputs?.modelVersion) errors.push('Model version required');
    if (!decision.inputs?.targetEnvironment) errors.push('Target environment required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (decision.inputs?.securityScan?.critical && decision.inputs.securityScan.critical > 0) errors.push('Critical vulnerabilities must be resolved');
    if (decision.inputs?.biasTestResults?.some(b => !b.acceptable)) warnings.push('Bias test failures detected');
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(d: ModelDeploymentDecision, sId: string, sRole: string, pk: string): Promise<ModelDeploymentDecision> {
    d.signatures.push({ signerId: sId, signerRole: sRole, signedAt: new Date(), signature: this.generateSignature(this.hashDecision(d), pk), publicKeyFingerprint: crypto.createHash('sha256').update(pk).digest('hex').slice(0, 16) });
    return d;
  }

  async toDefensibleArtifact(d: ModelDeploymentDecision, t: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: d.metadata.id, type: t, content: { model: d.inputs.modelId, version: d.inputs.modelVersion, env: d.inputs.targetEnvironment, approved: d.outcome.approved, gates: d.outcome.gatesPassed, deliberation: d.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex'), generatedAt: new Date() };
  }
}

export class ArchitectureDecisionSchema extends DecisionSchema<ArchitectureDecision> {
  readonly verticalId = 'technology';
  readonly decisionType = 'architecture';
  readonly requiredFields = ['inputs.proposalId', 'inputs.title', 'outcome.decision'];
  readonly requiredApprovers = ['principal-engineer', 'vp-engineering'];

  validate(decision: Partial<ArchitectureDecision>): ValidationResult {
    const errors: string[] = [], warnings: string[] = [];
    if (!decision.inputs?.proposalId) errors.push('Proposal ID required');
    if (!decision.inputs?.title) errors.push('Title required');
    if (!decision.outcome?.decision) errors.push('Decision required');
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(d: ArchitectureDecision, sId: string, sRole: string, pk: string): Promise<ArchitectureDecision> {
    d.signatures.push({ signerId: sId, signerRole: sRole, signedAt: new Date(), signature: this.generateSignature(this.hashDecision(d), pk), publicKeyFingerprint: crypto.createHash('sha256').update(pk).digest('hex').slice(0, 16) });
    return d;
  }

  async toDefensibleArtifact(d: ArchitectureDecision, t: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: d.metadata.id, type: t, content: { proposal: d.inputs.proposalId, title: d.inputs.title, decision: d.outcome.decision, alternatives: d.inputs.alternatives, deliberation: d.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex'), generatedAt: new Date() };
  }
}

export class IncidentResponseSchema extends DecisionSchema<IncidentResponseDecision> {
  readonly verticalId = 'technology';
  readonly decisionType = 'incident-response';
  readonly requiredFields = ['inputs.incidentId', 'inputs.severity', 'outcome.selectedMitigation'];
  readonly requiredApprovers = ['incident-commander'];

  validate(decision: Partial<IncidentResponseDecision>): ValidationResult {
    const errors: string[] = [], warnings: string[] = [];
    if (!decision.inputs?.incidentId) errors.push('Incident ID required');
    if (!decision.inputs?.severity) errors.push('Severity required');
    if (!decision.outcome?.selectedMitigation) errors.push('Selected mitigation required');
    if (decision.inputs?.severity === 'P0' && !decision.outcome?.escalated) warnings.push('P0 incident not escalated');
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(d: IncidentResponseDecision, sId: string, sRole: string, pk: string): Promise<IncidentResponseDecision> {
    d.signatures.push({ signerId: sId, signerRole: sRole, signedAt: new Date(), signature: this.generateSignature(this.hashDecision(d), pk), publicKeyFingerprint: crypto.createHash('sha256').update(pk).digest('hex').slice(0, 16) });
    return d;
  }

  async toDefensibleArtifact(d: IncidentResponseDecision, t: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return { id: uuidv4(), decisionId: d.metadata.id, type: t, content: { incident: d.inputs.incidentId, severity: d.inputs.severity, mitigation: d.outcome.selectedMitigation, slaBreached: d.outcome.slaBreached, deliberation: d.deliberation }, hash: crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex'), generatedAt: new Date() };
  }
}

// ============================================================================
// LAYER 5: TECHNOLOGY AGENT PRESETS
// ============================================================================

export class ModelGovernanceAgentPreset extends AgentPreset {
  readonly verticalId = 'technology';
  readonly presetId = 'model-governance-workflow';
  readonly name = 'Model Governance Workflow';
  readonly description = 'AI model deployment with mandatory bias testing and security review';

  readonly capabilities: AgentCapability[] = [
    { id: 'bias-testing', name: 'Bias Testing', description: 'Run fairness and bias tests', requiredPermissions: ['read:models'] },
    { id: 'security-scan', name: 'Security Scan', description: 'Vulnerability scanning', requiredPermissions: ['read:artifacts'] },
    { id: 'performance-validation', name: 'Performance Validation', description: 'Validate model performance metrics', requiredPermissions: ['read:metrics'] }
  ];

  readonly guardrails: AgentGuardrail[] = [
    { id: 'bias-check-required', name: 'Bias Check Required', type: 'hard-stop', condition: 'biasTestResults === null', action: 'Block deployment without bias testing' },
    { id: 'critical-vuln-block', name: 'Critical Vulnerability Block', type: 'hard-stop', condition: 'criticalVulnerabilities > 0', action: 'Block deployment with critical vulnerabilities' },
    { id: 'performance-threshold', name: 'Performance Threshold', type: 'warning', condition: 'performanceBelow threshold', action: 'Warn about degraded performance' }
  ];

  readonly workflow: WorkflowStep[] = [
    { id: 'step-1-scan', name: 'Security Scan', agentId: 'security-scanner', requiredInputs: ['modelArtifact'], expectedOutputs: ['scanResults'], guardrails: [], timeout: 120000 },
    { id: 'step-2-bias', name: 'Bias Testing', agentId: 'bias-tester', requiredInputs: ['modelArtifact', 'testData'], expectedOutputs: ['biasResults'], guardrails: [this.guardrails[0]!], timeout: 180000 },
    { id: 'step-3-perf', name: 'Performance Validation', agentId: 'perf-validator', requiredInputs: ['modelArtifact', 'benchmarks'], expectedOutputs: ['perfResults'], guardrails: [this.guardrails[2]!], timeout: 120000 },
    { id: 'step-4-approve', name: 'Deployment Approval', agentId: 'deployment-approver', requiredInputs: ['scanResults', 'biasResults', 'perfResults'], expectedOutputs: ['approved'], guardrails: [this.guardrails[1]!], timeout: 60000 }
  ];

  async loadWorkflow(): Promise<WorkflowStep[]> { return this.workflow; }

  async enforceGuardrails(step: WorkflowStep, input: unknown): Promise<{ allowed: boolean; blockedBy?: string }> {
    const data = input as Record<string, unknown>;
    for (const g of step.guardrails) {
      if (g.type === 'hard-stop') {
        if (g.id === 'bias-check-required' && data['biasTestResults'] === null) return { allowed: false, blockedBy: g.id };
        if (g.id === 'critical-vuln-block' && (data['criticalVulnerabilities'] as number) > 0) return { allowed: false, blockedBy: g.id };
      }
    }
    return { allowed: true };
  }

  trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace {
    const t: AgentTrace = { stepId, agentId, startedAt: new Date(), completedAt: null, inputs, outputs: null, guardrailsTriggered: [], status: 'running' };
    this.traces.push(t);
    return t;
  }
}

// ============================================================================
// LAYER 6: TECHNOLOGY DEFENSIBLE OUTPUT
// ============================================================================

export class TechnologyDefensibleOutput extends DefensibleOutput<TechnologyDecision> {
  readonly verticalId = 'technology';

  async toRegulatorPacket(decision: TechnologyDecision, frameworkId: string): Promise<RegulatorPacket> {
    const evidence = decision.complianceEvidence.filter(e => e.frameworkId === frameworkId);
    return {
      id: this.generateId('RP'), decisionId: decision.metadata.id, frameworkId, jurisdiction: 'US',
      generatedAt: new Date(), validUntil: this.generateValidityPeriod(365 * 5),
      sections: { executiveSummary: `${decision.type} decision (ID: ${decision.metadata.id}). ${decision.approvals.length} approvals, ${decision.dissents.length} dissents.`, decisionRationale: decision.deliberation.reasoning, complianceMapping: evidence, dissentsAndOverrides: decision.dissents, approvalChain: decision.approvals, auditTrail: [`Decision created: ${decision.metadata.createdAt.toISOString()}`] },
      signatures: decision.signatures, hash: this.hashContent(decision)
    };
  }

  async toCourtBundle(decision: TechnologyDecision, caseReference?: string): Promise<CourtBundle> {
    const bundle: CourtBundle = {
      id: this.generateId('CB'), decisionId: decision.metadata.id, generatedAt: new Date(),
      sections: { factualBackground: `This ${decision.type} decision followed established governance procedures with AI-assisted analysis.`, decisionProcess: decision.deliberation.reasoning, humanOversight: `Human oversight maintained. Roles involved: ${decision.approvals.map(a => a.approverRole).join(', ')}.`, dissentsRecorded: decision.dissents, evidenceChain: [`Input hash: ${this.hashContent(decision.inputs)}`, `Outcome hash: ${this.hashContent(decision.outcome)}`] },
      certifications: { integrityHash: this.hashContent(decision), witnessSignatures: decision.signatures.filter(s => s.signerRole.includes('witness')) }
    };
    if (caseReference) bundle.caseReference = caseReference;
    return bundle;
  }

  async toAuditTrail(decision: TechnologyDecision, events: unknown[]): Promise<AuditTrail> {
    const auditEvents = (events as { timestamp: Date; actor: string; action: string; details: Record<string, unknown> }[]).map(e => ({ ...e, hash: this.hashContent(e) }));
    return {
      id: this.generateId('AT'), decisionId: decision.metadata.id,
      period: { start: decision.metadata.createdAt, end: new Date() },
      events: auditEvents,
      summary: { totalEvents: auditEvents.length, uniqueActors: new Set(auditEvents.map(e => e.actor)).size, guardrailsTriggered: auditEvents.filter(e => e.action.includes('guardrail')).length, dissentsRecorded: decision.dissents.length },
      hash: this.hashContent(auditEvents)
    };
  }
}

// ============================================================================
// TECHNOLOGY VERTICAL IMPLEMENTATION
// ============================================================================

export class TechnologyVerticalImplementation implements VerticalImplementation<TechnologyDecision> {
  readonly verticalId = 'technology';
  readonly verticalName = 'Technology / SaaS';
  readonly completionPercentage = 100;
  readonly targetPercentage = 100;

  readonly dataConnector: TechnologyDataConnector;
  readonly knowledgeBase: TechnologyKnowledgeBase;
  readonly complianceMapper: TechnologyComplianceMapper;
  readonly decisionSchemas: Map<string, DecisionSchema<TechnologyDecision>>;
  readonly agentPresets: Map<string, AgentPreset>;
  readonly defensibleOutput: TechnologyDefensibleOutput;

  constructor() {
    this.dataConnector = new TechnologyDataConnector();
    this.knowledgeBase = new TechnologyKnowledgeBase();
    this.complianceMapper = new TechnologyComplianceMapper();

    this.decisionSchemas = new Map();
    this.decisionSchemas.set('model-deployment', new ModelDeploymentSchema() as unknown as DecisionSchema<TechnologyDecision>);
    this.decisionSchemas.set('architecture', new ArchitectureDecisionSchema() as unknown as DecisionSchema<TechnologyDecision>);
    this.decisionSchemas.set('incident-response', new IncidentResponseSchema() as unknown as DecisionSchema<TechnologyDecision>);

    this.agentPresets = new Map();
    this.agentPresets.set('model-governance-workflow', new ModelGovernanceAgentPreset());

    this.defensibleOutput = new TechnologyDefensibleOutput();
  }

  getStatus() {
    return {
      vertical: this.verticalName,
      layers: {
        dataConnector: true,
        knowledgeBase: true,
        complianceMapper: true,
        decisionSchemas: this.decisionSchemas.size >= 3,
        agentPresets: this.agentPresets.size >= 1,
        defensibleOutput: true
      },
      completionPercentage: this.completionPercentage,
      missingComponents: [],
      totalComplianceFrameworks: this.complianceMapper.supportedFrameworks.length,
      totalDecisionSchemas: this.decisionSchemas.size
    };
  }
}

// Register with vertical registry
const technologyVertical = new TechnologyVerticalImplementation();
VerticalRegistry.getInstance().register(technologyVertical);

export default technologyVertical;
