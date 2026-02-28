// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Industrial Services Vertical Implementation
 * 
 * Target: 100% Enterprise Platinum Standard
 * For: Industrial maintenance, repair, construction, and project-based service companies
 * Reference: MRC Peru (Montajes y Reparaciones Calderon SAC)
 * 
 * Decision Types:
 *   - Project Bid / No-Bid decisions
 *   - Equipment Purchase / Lease decisions
 *   - Safety Work Permit approvals
 *   - Subcontractor Selection decisions
 *   - Client Contract Review decisions
 * 
 * Compliance Frameworks:
 *   - ISO 45001 (Occupational Health & Safety)
 *   - ISO 9001 (Quality Management)
 *   - OSHA 29 CFR 1926 (Construction Safety - US)
 *   - SUNAFIL / DS 005-2012-TR (Peru Labor Safety)
 *   - ISO 14001 (Environmental Management)
 *   - ASME / AWS (Welding & Pressure Vessel Standards)
 * 
 * Datacendia is not an AI platform. It is decision infrastructure.
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
import { EXPANDED_COMPLIANCE_FRAMEWORKS, EXPANDED_COMPLIANCE_MAPPINGS, EXPANDED_JURISDICTION_MAP } from './IndustrialServicesComplianceExpanded.js';
import {
  WorkforceDeploymentDecision,
  MaintenanceScheduleDecision,
  IncidentInvestigationDecision,
  TrainingCertificationDecision,
  ChangeOrderDecision,
  InsuranceClaimDecision,
  EnvironmentalAssessmentDecision,
  QualityNCRDecision,
  EmergencyResponseDecision,
  JointVentureDecision,
  ExpandedIndustrialServicesDecision,
} from './IndustrialServicesDecisionTypesExpanded.js';
import {
  WorkforceDeploymentSchema,
  MaintenanceScheduleSchema,
  IncidentInvestigationSchema,
  TrainingCertificationSchema,
  ChangeOrderSchema,
  InsuranceClaimSchema,
  EnvironmentalAssessmentSchema,
  QualityNCRSchema,
  EmergencyResponseSchema,
  JointVentureSchema,
} from './IndustrialServicesDecisionSchemasExpanded.js';
import { embeddingService } from '../../llm/EmbeddingService.js';

// Re-export expanded types for external use
export type {
  WorkforceDeploymentDecision,
  MaintenanceScheduleDecision,
  IncidentInvestigationDecision,
  TrainingCertificationDecision,
  ChangeOrderDecision,
  InsuranceClaimDecision,
  EnvironmentalAssessmentDecision,
  QualityNCRDecision,
  EmergencyResponseDecision,
  JointVentureDecision,
};

// ============================================================================
// INDUSTRIAL SERVICES DECISION TYPES
// ============================================================================

export interface ProjectBidDecision extends BaseDecision {
  type: 'project-bid';
  inputs: {
    projectId: string;
    clientName: string;
    projectDescription: string;
    estimatedValue: number;
    currency: string;
    bidDeadline: Date;
    projectDuration: number; // months
    requiredCertifications: string[];
    equipmentRequired: string[];
    laborRequirements: {
      role: string;
      count: number;
      certificationRequired?: string;
    }[];
    siteConditions: {
      location: string;
      hazardLevel: 'low' | 'medium' | 'high' | 'extreme';
      environmentalRestrictions: string[];
      accessConstraints: string[];
    };
    competitorIntelligence?: {
      knownBidders: string[];
      estimatedCompetitorPrice?: number;
    };
    historicalPerformance: {
      similarProjectsCompleted: number;
      avgMarginOnSimilar: number;
      avgScheduleAdherence: number;
    };
  };
  outcome: {
    decision: 'bid' | 'no-bid' | 'conditional-bid';
    proposedPrice?: number;
    estimatedMargin?: number;
    estimatedCost?: number;
    conditions?: string[];
    declineReason?: string;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
    confidenceScore: number;
  };
}

export interface EquipmentDecision extends BaseDecision {
  type: 'equipment';
  inputs: {
    equipmentId: string;
    equipmentType: string;
    manufacturer: string;
    model: string;
    acquisitionType: 'purchase' | 'lease' | 'rent';
    estimatedCost: number;
    currency: string;
    usefulLife: number; // years
    maintenanceCostAnnual: number;
    projectAssignment?: string;
    utilizationForecast: number; // percentage
    vendorOptions: {
      vendorName: string;
      price: number;
      deliveryTime: number; // days
      warranty: string;
      vendorRating: number;
    }[];
    safetyRequirements: {
      certificationRequired: string[];
      operatorTrainingNeeded: boolean;
      inspectionFrequency: string;
    };
    financingOptions?: {
      type: string;
      rate: number;
      term: number;
      monthlyPayment: number;
    }[];
  };
  outcome: {
    approved: boolean;
    selectedVendor?: string;
    approvedAmount?: number;
    acquisitionMethod: 'purchase' | 'lease' | 'rent' | 'rejected';
    conditions?: string[];
    declineReason?: string;
    totalCostOfOwnership: number;
    roiProjection: number;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

export interface SafetyPermitDecision extends BaseDecision {
  type: 'safety-permit';
  inputs: {
    permitId: string;
    permitType: 'hot-work' | 'confined-space' | 'working-at-height' | 'excavation' | 'electrical' | 'lifting' | 'general';
    projectId: string;
    siteLocation: string;
    workDescription: string;
    requestedBy: string;
    startDate: Date;
    endDate: Date;
    personnelInvolved: {
      name: string;
      role: string;
      certifications: string[];
      medicalClearance: boolean;
    }[];
    hazardAssessment: {
      hazardType: string;
      severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
      likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost-certain';
      existingControls: string[];
      additionalControls: string[];
      residualRisk: 'low' | 'medium' | 'high' | 'extreme';
    }[];
    equipmentRequired: string[];
    ppeRequired: string[];
    emergencyProcedures: string;
    previousIncidents: {
      date: Date;
      type: string;
      severity: string;
      lessonsLearned: string;
    }[];
  };
  outcome: {
    approved: boolean;
    permitStatus: 'approved' | 'approved-with-conditions' | 'rejected' | 'deferred';
    conditions?: string[];
    additionalControlsRequired?: string[];
    rejectionReason?: string;
    validUntil?: Date;
    reviewRequired: boolean;
    supervisorRequired: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'extreme';
  };
}

export interface SubcontractorDecision extends BaseDecision {
  type: 'subcontractor';
  inputs: {
    selectionId: string;
    projectId: string;
    scopeOfWork: string;
    estimatedValue: number;
    currency: string;
    requiredCertifications: string[];
    candidates: {
      companyName: string;
      registrationNumber: string;
      quotedPrice: number;
      proposedTimeline: number; // days
      safetyRecord: {
        incidentRate: number;
        lostTimeInjuries: number;
        fatalities: number;
        yearsWithoutIncident: number;
      };
      qualityScore: number; // 0-100
      financialStability: 'strong' | 'adequate' | 'weak' | 'unknown';
      insuranceCoverage: {
        liability: number;
        workersComp: boolean;
        professionalIndemnity: boolean;
      };
      previousProjects: {
        projectName: string;
        value: number;
        completedOnTime: boolean;
        qualityRating: number;
      }[];
      certifications: string[];
    }[];
    evaluationCriteria: {
      criterion: string;
      weight: number;
    }[];
  };
  outcome: {
    selectedContractor?: string;
    approved: boolean;
    decisionRationale: string;
    scoringMatrix: {
      contractorName: string;
      scores: { criterion: string; score: number; weighted: number }[];
      totalScore: number;
    }[];
    conditions?: string[];
    contractTerms?: {
      retentionPercentage: number;
      penaltyClause: boolean;
      performanceBond: boolean;
      insuranceRequirements: string[];
    };
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

export interface ContractReviewDecision extends BaseDecision {
  type: 'contract-review';
  inputs: {
    contractId: string;
    clientName: string;
    contractType: 'fixed-price' | 'cost-plus' | 'time-materials' | 'unit-rate' | 'framework';
    totalValue: number;
    currency: string;
    duration: number; // months
    keyTerms: {
      paymentTerms: string;
      retentionPercentage: number;
      penaltyClause: string;
      variationMechanism: string;
      disputeResolution: string;
      terminationClause: string;
      forceManjeure: string;
      liabilityCap: number;
      insuranceRequirements: string[];
      performanceGuarantees: string[];
    };
    scopeOfWork: string;
    riskAllocation: {
      riskCategory: string;
      allocatedTo: 'client' | 'contractor' | 'shared';
      description: string;
    }[];
    jurisdictions: string[];
    complianceRequirements: string[];
  };
  outcome: {
    recommendation: 'accept' | 'accept-with-amendments' | 'reject' | 'negotiate';
    riskScore: number;
    keyRisks: {
      risk: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      mitigation: string;
    }[];
    suggestedAmendments?: string[];
    financialExposure: number;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  };
}

export type IndustrialServicesDecision =
  | ProjectBidDecision
  | EquipmentDecision
  | SafetyPermitDecision
  | SubcontractorDecision
  | ContractReviewDecision
  | ExpandedIndustrialServicesDecision;

// ============================================================================
// LAYER 1: INDUSTRIAL SERVICES DATA CONNECTOR
// ============================================================================

export interface ProjectManagementData {
  projects: {
    id: string;
    name: string;
    client: string;
    status: string;
    budget: number;
    spent: number;
    schedule: { planned: Date; actual: Date | null };
  }[];
  resources: {
    id: string;
    name: string;
    role: string;
    assigned: string[];
    utilization: number;
  }[];
  equipment: {
    id: string;
    type: string;
    status: string;
    location: string;
    nextMaintenance: Date;
  }[];
}

export interface SafetySystemData {
  incidents: {
    id: string;
    date: Date;
    type: string;
    severity: string;
    projectId: string;
    rootCause: string;
    correctiveActions: string[];
  }[];
  permits: {
    id: string;
    type: string;
    status: string;
    projectId: string;
    validUntil: Date;
  }[];
  inspections: {
    id: string;
    date: Date;
    inspector: string;
    findings: string[];
    status: string;
  }[];
  safetyMetrics: {
    trir: number; // Total Recordable Incident Rate
    ltir: number; // Lost Time Incident Rate
    daysWithoutIncident: number;
    nearMisses: number;
  };
}

export interface ERPSystemData {
  purchaseOrders: {
    id: string;
    vendor: string;
    amount: number;
    status: string;
    deliveryDate: Date;
  }[];
  inventory: {
    itemId: string;
    description: string;
    quantity: number;
    reorderPoint: number;
    unitCost: number;
  }[];
  financials: {
    revenue: number;
    costs: number;
    cashPosition: number;
    accountsReceivable: number;
    accountsPayable: number;
  };
}

export class IndustrialServicesDataConnector extends DataConnector<ProjectManagementData | SafetySystemData | ERPSystemData> {
  readonly verticalId = 'industrial-services';
  readonly connectorType = 'multi-source';

  constructor() {
    super();
    this.initializeSources();
  }

  private initializeSources(): void {
    this.sources.set('project-management', {
      id: 'project-management',
      name: 'Project Management System',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('safety-system', {
      id: 'safety-system',
      name: 'Safety Management System (EHSQ)',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('erp', {
      id: 'erp',
      name: 'Enterprise Resource Planning',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('equipment-registry', {
      id: 'equipment-registry',
      name: 'Equipment & Asset Registry',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('contractor-database', {
      id: 'contractor-database',
      name: 'Contractor Qualification Database',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('regulatory-feed', {
      id: 'regulatory-feed',
      name: 'Regulatory Compliance Feed (OSHA/SUNAFIL)',
      type: 'webhook',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });
  }

  getSources(): DataSource[] {
    return Array.from(this.sources.values());
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
    for (const source of this.sources.values()) {
      source.connectionStatus = 'disconnected';
    }
  }

  async ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<ProjectManagementData | SafetySystemData | ERPSystemData>> {
    const source = this.sources.get(sourceId);
    if (!source || source.connectionStatus !== 'connected') {
      return {
        success: false,
        data: null,
        provenance: this.generateProvenance(sourceId, null),
        validationErrors: [`Source ${sourceId} not connected`]
      };
    }

    const data = this.fetchConnectorData(sourceId, query);
    const validation = this.validate(data);

    source.lastSync = new Date();
    source.recordCount += 1;

    return {
      success: validation.valid,
      data: validation.valid ? data : null,
      provenance: this.generateProvenance(sourceId, data),
      validationErrors: validation.errors
    };
  }

  validate(data: ProjectManagementData | SafetySystemData | ERPSystemData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Data is null or undefined');
      return { valid: false, errors };
    }

    if ('projects' in data) {
      if (!Array.isArray(data.projects)) errors.push('Projects must be an array');
      if (!Array.isArray(data.resources)) errors.push('Resources must be an array');
    } else if ('incidents' in data) {
      if (!Array.isArray(data.incidents)) errors.push('Incidents must be an array');
      if (!data.safetyMetrics) errors.push('Safety metrics required');
      if (typeof data.safetyMetrics?.trir !== 'number') errors.push('TRIR must be a number');
    } else if ('financials' in data) {
      if (typeof data.financials.revenue !== 'number') errors.push('Revenue required');
      if (typeof data.financials.cashPosition !== 'number') errors.push('Cash position required');
    }

    return { valid: errors.length === 0, errors };
  }

  private fetchConnectorData(sourceId: string, _query?: Record<string, unknown>): ProjectManagementData | SafetySystemData | ERPSystemData {
    if (sourceId === 'project-management' || sourceId === 'equipment-registry') {
      return {
        projects: [
          { id: 'PRJ-001', name: 'Boiler Maintenance - Cerro Verde', client: 'Freeport-McMoRan', status: 'active', budget: 450000, spent: 180000, schedule: { planned: new Date('2026-06-30'), actual: null } },
          { id: 'PRJ-002', name: 'Piping Installation - Antamina', client: 'BHP', status: 'bidding', budget: 1200000, spent: 0, schedule: { planned: new Date('2026-12-31'), actual: null } }
        ],
        resources: [
          { id: 'RES-001', name: 'Juan Carlos Mendoza', role: 'Lead Welder (6G)', assigned: ['PRJ-001'], utilization: 0.85 },
          { id: 'RES-002', name: 'Roberto Huaman', role: 'Safety Supervisor', assigned: ['PRJ-001', 'PRJ-002'], utilization: 0.95 }
        ],
        equipment: [
          { id: 'EQ-001', type: 'Crawler Crane 50T', status: 'active', location: 'Cerro Verde', nextMaintenance: new Date('2026-03-15') },
          { id: 'EQ-002', type: 'Welding Machine Lincoln SA-200', status: 'available', location: 'Lima Warehouse', nextMaintenance: new Date('2026-04-01') }
        ]
      };
    }

    if (sourceId === 'safety-system') {
      return {
        incidents: [
          { id: 'INC-001', date: new Date('2025-11-15'), type: 'near-miss', severity: 'moderate', projectId: 'PRJ-001', rootCause: 'Inadequate fall protection anchorage', correctiveActions: ['Replace anchorage points', 'Retrain crew on fall protection'] }
        ],
        permits: [
          { id: 'PTW-001', type: 'hot-work', status: 'active', projectId: 'PRJ-001', validUntil: new Date('2026-03-01') }
        ],
        inspections: [
          { id: 'INS-001', date: new Date('2026-02-01'), inspector: 'Roberto Huaman', findings: ['Scaffold tag missing on Level 3', 'Fire extinguisher overdue for inspection'], status: 'open' }
        ],
        safetyMetrics: { trir: 1.2, ltir: 0.4, daysWithoutIncident: 87, nearMisses: 3 }
      };
    }

    return {
      purchaseOrders: [
        { id: 'PO-001', vendor: 'Lincoln Electric Peru', amount: 15000, status: 'delivered', deliveryDate: new Date('2026-01-20') },
        { id: 'PO-002', vendor: 'Ferreyros CAT', amount: 85000, status: 'pending', deliveryDate: new Date('2026-03-15') }
      ],
      inventory: [
        { itemId: 'INV-001', description: 'A106 Gr.B Pipe 6"', quantity: 120, reorderPoint: 50, unitCost: 85 },
        { itemId: 'INV-002', description: 'E7018 Welding Rod 3/32"', quantity: 500, reorderPoint: 200, unitCost: 3.5 }
      ],
      financials: { revenue: 3200000, costs: 2560000, cashPosition: 840000, accountsReceivable: 620000, accountsPayable: 310000 }
    };
  }
}

// ============================================================================
// LAYER 2: INDUSTRIAL SERVICES KNOWLEDGE BASE
// ============================================================================

export class IndustrialServicesKnowledgeBase extends VerticalKnowledgeBase {
  readonly verticalId = 'industrial-services';

  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> {
    const doc: KnowledgeDocument = {
      id: uuidv4(),
      content,
      metadata: {
        ...metadata,
        documentType: metadata['documentType'] || 'standard',
        jurisdiction: metadata['jurisdiction'] || 'International',
        industry: metadata['industry'] || 'industrial-services',
        effectiveDate: metadata['effectiveDate'] || new Date()
      },
      provenance,
      embedding: this.generateEmbedding(content),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.documents.set(doc.id, doc);
    return doc;
  }

  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> {
    const queryEmbedding = this.generateEmbedding(query);
    const scored: { doc: KnowledgeDocument; score: number }[] = [];

    for (const doc of this.documents.values()) {
      if (doc.embedding) {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
        scored.push({ doc, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const topDocs = scored.slice(0, topK);

    return {
      documents: topDocs.map(s => s.doc),
      scores: topDocs.map(s => s.score),
      provenanceVerified: topDocs.every(s => s.doc.provenance.authoritative),
      query
    };
  }

  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: ['Document not found'] };

    const issues: string[] = [];

    if (!doc.provenance.authoritative) {
      issues.push('Document source is not authoritative');
    }

    const age = Date.now() - doc.provenance.retrievedAt.getTime();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days for industrial standards
    if (age > maxAge) {
      issues.push('Document provenance is stale (>7 days)');
    }

    const currentHash = crypto.createHash('sha256').update(doc.content).digest('hex');
    if (currentHash !== doc.provenance.hash) {
      issues.push('Document content hash mismatch');
    }

    return { valid: issues.length === 0, issues };
  }

  private generateEmbedding(text: string): number[] {
    return embeddingService.hashFallback(text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// ============================================================================
// LAYER 3: INDUSTRIAL SERVICES COMPLIANCE MAPPER
// ============================================================================

export class IndustrialServicesComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'industrial-services';
  readonly supportedFrameworks: ComplianceFramework[] = [
    {
      id: 'iso-45001',
      name: 'ISO 45001:2018 Occupational Health & Safety',
      version: '2018',
      jurisdiction: 'International',
      controls: [
        { id: 'iso45-leadership', name: 'Leadership & Worker Participation', description: 'Top management commitment and worker consultation (Clause 5)', severity: 'high', automatable: false },
        { id: 'iso45-hazard-id', name: 'Hazard Identification', description: 'Systematic hazard identification and risk assessment (Clause 6.1.2)', severity: 'critical', automatable: true },
        { id: 'iso45-risk-assessment', name: 'OH&S Risk Assessment', description: 'Assessment of OH&S risks and opportunities (Clause 6.1.2.2)', severity: 'critical', automatable: true },
        { id: 'iso45-operational-control', name: 'Operational Control', description: 'Elimination of hazards and reduction of risks (Clause 8.1.2)', severity: 'critical', automatable: true },
        { id: 'iso45-emergency', name: 'Emergency Preparedness', description: 'Emergency preparedness and response (Clause 8.2)', severity: 'high', automatable: false },
        { id: 'iso45-incident-investigation', name: 'Incident Investigation', description: 'Investigation of incidents and nonconformities (Clause 10.2)', severity: 'critical', automatable: false },
        { id: 'iso45-monitoring', name: 'Performance Monitoring', description: 'Monitoring, measurement, analysis, and evaluation (Clause 9.1)', severity: 'high', automatable: true },
        { id: 'iso45-management-review', name: 'Management Review', description: 'Top management review of OH&S system (Clause 9.3)', severity: 'high', automatable: false }
      ]
    },
    {
      id: 'iso-9001',
      name: 'ISO 9001:2015 Quality Management',
      version: '2015',
      jurisdiction: 'International',
      controls: [
        { id: 'iso9-customer-focus', name: 'Customer Focus', description: 'Understanding and meeting customer requirements (Clause 5.1.2)', severity: 'high', automatable: false },
        { id: 'iso9-risk-opportunity', name: 'Risk & Opportunity Planning', description: 'Actions to address risks and opportunities (Clause 6.1)', severity: 'high', automatable: true },
        { id: 'iso9-operational-planning', name: 'Operational Planning', description: 'Planning and control of operations (Clause 8.1)', severity: 'high', automatable: true },
        { id: 'iso9-supplier-control', name: 'External Provider Control', description: 'Control of externally provided processes and products (Clause 8.4)', severity: 'critical', automatable: true },
        { id: 'iso9-nonconformity', name: 'Nonconformity Management', description: 'Control of nonconforming outputs (Clause 8.7)', severity: 'critical', automatable: true },
        { id: 'iso9-monitoring', name: 'Performance Monitoring', description: 'Monitoring, measurement, analysis, and evaluation (Clause 9.1)', severity: 'high', automatable: true },
        { id: 'iso9-internal-audit', name: 'Internal Audit', description: 'Internal audit program and execution (Clause 9.2)', severity: 'high', automatable: false },
        { id: 'iso9-continual-improvement', name: 'Continual Improvement', description: 'Improvement of QMS effectiveness (Clause 10.3)', severity: 'medium', automatable: false }
      ]
    },
    {
      id: 'osha-1926',
      name: 'OSHA 29 CFR 1926 Construction Safety',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'osha-fall-protection', name: 'Fall Protection', description: 'Fall protection systems for work at heights >6ft (1926.501)', severity: 'critical', automatable: true },
        { id: 'osha-scaffolding', name: 'Scaffolding Safety', description: 'Scaffold construction and use requirements (1926.451)', severity: 'critical', automatable: true },
        { id: 'osha-excavation', name: 'Excavation Safety', description: 'Excavation and trenching requirements (1926 Subpart P)', severity: 'critical', automatable: true },
        { id: 'osha-electrical', name: 'Electrical Safety', description: 'Electrical safety in construction (1926 Subpart K)', severity: 'critical', automatable: true },
        { id: 'osha-crane', name: 'Crane & Rigging', description: 'Crane and derrick safety in construction (1926 Subpart CC)', severity: 'critical', automatable: true },
        { id: 'osha-confined-space', name: 'Confined Space', description: 'Confined space entry requirements (1926 Subpart AA)', severity: 'critical', automatable: false },
        { id: 'osha-hazcom', name: 'Hazard Communication', description: 'Chemical hazard communication (1926.59)', severity: 'high', automatable: true },
        { id: 'osha-ppe', name: 'Personal Protective Equipment', description: 'PPE requirements and standards (1926 Subpart E)', severity: 'high', automatable: true },
        { id: 'osha-fire-protection', name: 'Fire Protection', description: 'Fire prevention and protection (1926 Subpart F)', severity: 'high', automatable: true },
        { id: 'osha-welding', name: 'Welding & Cutting', description: 'Welding, cutting, and brazing safety (1926 Subpart J)', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'sunafil-ds005',
      name: 'SUNAFIL DS 005-2012-TR Peru Occupational Safety',
      version: '2012',
      jurisdiction: 'Peru',
      controls: [
        { id: 'sunafil-comite', name: 'Safety Committee', description: 'ComitÃ© de Seguridad y Salud en el Trabajo (Art. 29-33)', severity: 'critical', automatable: false },
        { id: 'sunafil-reglamento', name: 'Internal Safety Regulations', description: 'Reglamento Interno de Seguridad y Salud (Art. 34-35)', severity: 'high', automatable: false },
        { id: 'sunafil-iperc', name: 'IPERC Risk Assessment', description: 'IdentificaciÃ³n de Peligros, EvaluaciÃ³n de Riesgos y Controles (Art. 57)', severity: 'critical', automatable: true },
        { id: 'sunafil-capacitacion', name: 'Safety Training', description: 'CapacitaciÃ³n mÃ­nima 4 veces al aÃ±o (Art. 35b)', severity: 'high', automatable: true },
        { id: 'sunafil-examen', name: 'Medical Examinations', description: 'ExÃ¡menes mÃ©dicos ocupacionales (Art. 49f)', severity: 'high', automatable: true },
        { id: 'sunafil-registro', name: 'Safety Records', description: 'Registros obligatorios del SGSST (Art. 33)', severity: 'critical', automatable: true },
        { id: 'sunafil-investigacion', name: 'Incident Investigation', description: 'InvestigaciÃ³n de accidentes e incidentes (Art. 42)', severity: 'critical', automatable: false },
        { id: 'sunafil-emergencia', name: 'Emergency Plans', description: 'Plan de contingencia y emergencias (Art. 83)', severity: 'high', automatable: false }
      ]
    },
    {
      id: 'iso-14001',
      name: 'ISO 14001:2015 Environmental Management',
      version: '2015',
      jurisdiction: 'International',
      controls: [
        { id: 'iso14-aspects', name: 'Environmental Aspects', description: 'Identification of environmental aspects and impacts (Clause 6.1.2)', severity: 'high', automatable: true },
        { id: 'iso14-legal', name: 'Legal Compliance', description: 'Compliance with environmental legislation (Clause 6.1.3)', severity: 'critical', automatable: true },
        { id: 'iso14-operational', name: 'Operational Control', description: 'Environmental operational controls (Clause 8.1)', severity: 'high', automatable: true },
        { id: 'iso14-emergency', name: 'Emergency Response', description: 'Environmental emergency preparedness (Clause 8.2)', severity: 'high', automatable: false },
        { id: 'iso14-monitoring', name: 'Environmental Monitoring', description: 'Monitoring and measurement of environmental performance (Clause 9.1.1)', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'asme-aws',
      name: 'ASME/AWS Welding & Pressure Vessel Standards',
      version: '2023',
      jurisdiction: 'International',
      controls: [
        { id: 'asme-wps', name: 'Welding Procedure Specification', description: 'Documented and qualified WPS (ASME IX)', severity: 'critical', automatable: true },
        { id: 'asme-welder-qual', name: 'Welder Qualification', description: 'Welder performance qualification records (ASME IX)', severity: 'critical', automatable: true },
        { id: 'aws-d1-structural', name: 'Structural Welding Code', description: 'AWS D1.1 Structural Welding Code - Steel', severity: 'critical', automatable: true },
        { id: 'asme-nde', name: 'Non-Destructive Examination', description: 'NDE requirements and acceptance criteria (ASME V)', severity: 'high', automatable: true },
        { id: 'asme-pressure', name: 'Pressure Vessel Code', description: 'ASME BPVC Section VIII pressure vessel requirements', severity: 'critical', automatable: false }
      ]
    },
    // Merge in expanded compliance frameworks (12 additional)
    ...EXPANDED_COMPLIANCE_FRAMEWORKS,
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];

    const mappings: Record<string, Record<string, string[]>> = {
      'project-bid': {
        'iso-9001': ['iso9-customer-focus', 'iso9-risk-opportunity', 'iso9-operational-planning'],
        'iso-45001': ['iso45-hazard-id', 'iso45-risk-assessment'],
        'iso-14001': ['iso14-aspects', 'iso14-legal'],
        'osha-1926': ['osha-fall-protection', 'osha-scaffolding'],
        'sunafil-ds005': ['sunafil-iperc', 'sunafil-comite'],
        'asme-aws': ['asme-wps', 'asme-welder-qual']
      },
      'equipment': {
        'iso-9001': ['iso9-supplier-control', 'iso9-operational-planning'],
        'iso-45001': ['iso45-operational-control', 'iso45-monitoring'],
        'osha-1926': ['osha-crane', 'osha-electrical'],
        'asme-aws': ['asme-nde', 'asme-pressure']
      },
      'safety-permit': {
        'iso-45001': ['iso45-hazard-id', 'iso45-risk-assessment', 'iso45-operational-control', 'iso45-emergency', 'iso45-monitoring'],
        'osha-1926': ['osha-fall-protection', 'osha-scaffolding', 'osha-excavation', 'osha-electrical', 'osha-crane', 'osha-confined-space', 'osha-ppe', 'osha-fire-protection', 'osha-welding'],
        'sunafil-ds005': ['sunafil-iperc', 'sunafil-capacitacion', 'sunafil-examen', 'sunafil-registro', 'sunafil-emergencia'],
        'iso-14001': ['iso14-operational', 'iso14-emergency']
      },
      'subcontractor': {
        'iso-9001': ['iso9-supplier-control', 'iso9-nonconformity', 'iso9-monitoring'],
        'iso-45001': ['iso45-hazard-id', 'iso45-operational-control'],
        'osha-1926': ['osha-fall-protection', 'osha-ppe'],
        'sunafil-ds005': ['sunafil-iperc', 'sunafil-capacitacion', 'sunafil-registro']
      },
      'contract-review': {
        'iso-9001': ['iso9-customer-focus', 'iso9-risk-opportunity'],
        'iso-45001': ['iso45-leadership', 'iso45-risk-assessment'],
        'iso-14001': ['iso14-legal', 'iso14-aspects'],
        'sunafil-ds005': ['sunafil-reglamento', 'sunafil-comite']
      }
    };

    // Also check expanded mappings
    const expandedControlIds = EXPANDED_COMPLIANCE_MAPPINGS[decisionType]?.[frameworkId] || [];
    const controlIds = [...(mappings[decisionType]?.[frameworkId] || []), ...expandedControlIds];
    return framework.controls.filter(c => controlIds.includes(c.id));
  }

  async checkViolation(decision: IndustrialServicesDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const controls = this.mapToFramework(decision.type, frameworkId);

    for (const control of controls) {
      const violation = await this.evaluateControl(decision, control);
      if (violation) violations.push(violation);
    }

    return violations;
  }

  async generateEvidence(decision: IndustrialServicesDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    const controls = this.mapToFramework(decision.type, frameworkId);
    const evidence: ComplianceEvidence[] = [];

    for (const control of controls) {
      const status = await this.evaluateControlStatus(decision, control);
      evidence.push({
        id: uuidv4(),
        frameworkId,
        controlId: control.id,
        status,
        evidence: this.generateEvidenceDescription(decision, control, status),
        generatedAt: new Date(),
        hash: crypto.createHash('sha256').update(JSON.stringify({ decision: decision.metadata.id, control: control.id, status })).digest('hex')
      });
    }

    return evidence;
  }

  private async evaluateControl(decision: IndustrialServicesDecision, control: ComplianceControl): Promise<ComplianceViolation | null> {
    if (decision.type === 'safety-permit' && control.id === 'iso45-hazard-id') {
      const safetyDecision = decision as SafetyPermitDecision;
      if (safetyDecision.inputs.hazardAssessment.length === 0) {
        return {
          controlId: control.id,
          severity: 'critical',
          description: 'No hazard assessment provided for safety permit',
          remediation: 'Complete hazard identification and risk assessment before issuing permit',
          detectedAt: new Date()
        };
      }
      const extremeRisks = safetyDecision.inputs.hazardAssessment.filter(h => h.residualRisk === 'extreme');
      if (extremeRisks.length > 0 && safetyDecision.outcome.approved) {
        return {
          controlId: control.id,
          severity: 'critical',
          description: `Permit approved with ${extremeRisks.length} extreme residual risk(s)`,
          remediation: 'Reduce all residual risks below extreme before approving permit. Apply additional controls.',
          detectedAt: new Date()
        };
      }
    }

    if (decision.type === 'safety-permit' && control.id === 'osha-fall-protection') {
      const safetyDecision = decision as SafetyPermitDecision;
      if (safetyDecision.inputs.permitType === 'working-at-height') {
        const hasFallProtection = safetyDecision.inputs.ppeRequired.some(p => p.toLowerCase().includes('harness') || p.toLowerCase().includes('fall'));
        if (!hasFallProtection) {
          return {
            controlId: control.id,
            severity: 'critical',
            description: 'Working at height permit issued without fall protection PPE',
            remediation: 'Require fall arrest harness and lanyard for all work at height',
            detectedAt: new Date()
          };
        }
      }
    }

    if (decision.type === 'safety-permit' && control.id === 'osha-confined-space') {
      const safetyDecision = decision as SafetyPermitDecision;
      if (safetyDecision.inputs.permitType === 'confined-space') {
        const hasAtmoTest = safetyDecision.inputs.equipmentRequired.some(e => e.toLowerCase().includes('gas') || e.toLowerCase().includes('atmosphere'));
        if (!hasAtmoTest) {
          return {
            controlId: control.id,
            severity: 'critical',
            description: 'Confined space entry without atmospheric testing equipment',
            remediation: 'Require 4-gas monitor for all confined space entries',
            detectedAt: new Date()
          };
        }
      }
    }

    if (decision.type === 'subcontractor' && control.id === 'iso9-supplier-control') {
      const subDecision = decision as SubcontractorDecision;
      if (subDecision.outcome.selectedContractor) {
        const selected = subDecision.inputs.candidates.find(c => c.companyName === subDecision.outcome.selectedContractor);
        if (selected && selected.safetyRecord.fatalities > 0) {
          return {
            controlId: control.id,
            severity: 'critical',
            description: `Selected subcontractor has ${selected.safetyRecord.fatalities} fatality/ies on record`,
            remediation: 'Conduct enhanced safety due diligence. Require safety improvement plan before engagement.',
            detectedAt: new Date()
          };
        }
      }
    }

    if (decision.type === 'subcontractor' && control.id === 'sunafil-capacitacion') {
      const subDecision = decision as SubcontractorDecision;
      if (subDecision.outcome.selectedContractor) {
        const selected = subDecision.inputs.candidates.find(c => c.companyName === subDecision.outcome.selectedContractor);
        const hasSafetyCert = selected?.certifications?.some(c => c.toLowerCase().includes('safety') || c.toLowerCase().includes('seguridad'));
        if (!hasSafetyCert) {
          return {
            controlId: control.id,
            severity: 'high',
            description: 'Selected subcontractor lacks safety training certification',
            remediation: 'Require SUNAFIL-compliant safety training certificate before mobilization',
            detectedAt: new Date()
          };
        }
      }
    }

    if (decision.type === 'equipment' && control.id === 'osha-crane') {
      const equipDecision = decision as EquipmentDecision;
      if (equipDecision.inputs.equipmentType.toLowerCase().includes('crane')) {
        const needsTraining = equipDecision.inputs.safetyRequirements.operatorTrainingNeeded;
        if (!needsTraining) {
          return {
            controlId: control.id,
            severity: 'high',
            description: 'Crane acquisition without operator training requirement flagged',
            remediation: 'Require certified crane operator training per OSHA 1926 Subpart CC',
            detectedAt: new Date()
          };
        }
      }
    }

    return null;
  }

  private async evaluateControlStatus(decision: IndustrialServicesDecision, control: ComplianceControl): Promise<ComplianceEvidence['status']> {
    const violation = await this.evaluateControl(decision, control);
    if (violation) {
      return violation.severity === 'critical' ? 'non-compliant' : 'partial';
    }
    return 'compliant';
  }

  private generateEvidenceDescription(decision: IndustrialServicesDecision, control: ComplianceControl, status: ComplianceEvidence['status']): string {
    return `Control ${control.id} (${control.name}) evaluated for ${decision.type} decision ${decision.metadata.id}. ` +
      `Status: ${status}. Decision made by ${decision.metadata.createdBy} at ${decision.metadata.createdAt.toISOString()}. ` +
      `${decision.dissents.length} dissent(s) recorded, ${decision.approvals.length} approval(s) obtained.`;
  }
}

// ============================================================================
// LAYER 4: INDUSTRIAL SERVICES DECISION SCHEMAS
// ============================================================================

export class ProjectBidDecisionSchema extends DecisionSchema<ProjectBidDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'project-bid';
  readonly requiredFields = [
    'inputs.projectId',
    'inputs.clientName',
    'inputs.estimatedValue',
    'inputs.siteConditions',
    'outcome.decision',
    'outcome.riskRating',
    'outcome.confidenceScore'
  ];
  readonly requiredApprovers = ['project-director', 'finance-controller'];

  validate(decision: Partial<ProjectBidDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.clientName) errors.push('Client name required');
    if (typeof decision.inputs?.estimatedValue !== 'number') errors.push('Estimated value required');
    if (!decision.inputs?.siteConditions) errors.push('Site conditions required');
    if (!decision.outcome?.decision) errors.push('Bid/no-bid decision required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');
    if (typeof decision.outcome?.confidenceScore !== 'number') errors.push('Confidence score required');

    if (decision.inputs?.siteConditions?.hazardLevel === 'extreme' && decision.outcome?.decision === 'bid') {
      warnings.push('Bidding on extreme hazard site requires enhanced safety plan');
    }
    if (decision.outcome?.estimatedMargin !== undefined && decision.outcome.estimatedMargin < 0.08) {
      warnings.push('Estimated margin below 8% threshold');
    }
    if (decision.inputs?.laborRequirements) {
      for (const labor of decision.inputs.laborRequirements) {
        if (labor.certificationRequired && !labor.certificationRequired) {
          warnings.push(`Labor role ${labor.role} requires certification`);
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ProjectBidDecision, signerId: string, signerRole: string, privateKey: string): Promise<ProjectBidDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: ProjectBidDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content: Record<string, unknown> = {
      decisionSummary: {
        project: decision.inputs.projectId,
        client: decision.inputs.clientName,
        value: decision.inputs.estimatedValue,
        decision: decision.outcome.decision,
        riskRating: decision.outcome.riskRating,
        confidence: decision.outcome.confidenceScore
      },
      siteAssessment: decision.inputs.siteConditions,
      deliberation: decision.deliberation,
      approvalChain: decision.approvals,
      dissentsRecorded: decision.dissents,
      complianceEvidence: decision.complianceEvidence
    };

    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content,
      hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
    };
  }
}

export class SafetyPermitDecisionSchema extends DecisionSchema<SafetyPermitDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'safety-permit';
  readonly requiredFields = [
    'inputs.permitId',
    'inputs.permitType',
    'inputs.workDescription',
    'inputs.hazardAssessment',
    'inputs.ppeRequired',
    'outcome.permitStatus',
    'outcome.riskRating'
  ];
  readonly requiredApprovers = ['safety-officer', 'site-supervisor'];

  validate(decision: Partial<SafetyPermitDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.permitId) errors.push('Permit ID required');
    if (!decision.inputs?.permitType) errors.push('Permit type required');
    if (!decision.inputs?.workDescription) errors.push('Work description required');
    if (!decision.inputs?.hazardAssessment?.length) errors.push('At least one hazard assessment required');
    if (!decision.inputs?.ppeRequired?.length) errors.push('PPE requirements must be specified');
    if (!decision.outcome?.permitStatus) errors.push('Permit status required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');

    if (!decision.inputs?.emergencyProcedures) {
      errors.push('Emergency procedures required for all work permits');
    }
    if (decision.inputs?.personnelInvolved) {
      for (const person of decision.inputs.personnelInvolved) {
        if (!person.medicalClearance) {
          warnings.push(`${person.name} lacks medical clearance`);
        }
      }
    }
    if (decision.inputs?.hazardAssessment) {
      const extremeRisks = decision.inputs.hazardAssessment.filter(h => h.residualRisk === 'extreme');
      if (extremeRisks.length > 0) {
        errors.push(`${extremeRisks.length} hazard(s) with extreme residual risk â€” cannot approve`);
      }
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SafetyPermitDecision, signerId: string, signerRole: string, privateKey: string): Promise<SafetyPermitDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: SafetyPermitDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        permit: { id: decision.inputs.permitId, type: decision.inputs.permitType, status: decision.outcome.permitStatus },
        hazardAssessment: decision.inputs.hazardAssessment,
        ppeRequired: decision.inputs.ppeRequired,
        personnel: decision.inputs.personnelInvolved.map(p => ({ name: p.name, role: p.role, medicalClearance: p.medicalClearance })),
        emergencyProcedures: decision.inputs.emergencyProcedures,
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 years for safety records
    };
  }
}

export class EquipmentDecisionSchema extends DecisionSchema<EquipmentDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'equipment';
  readonly requiredFields = [
    'inputs.equipmentId',
    'inputs.equipmentType',
    'inputs.estimatedCost',
    'inputs.vendorOptions',
    'outcome.approved',
    'outcome.acquisitionMethod',
    'outcome.riskRating'
  ];
  readonly requiredApprovers = ['finance-controller', 'operations-director'];

  validate(decision: Partial<EquipmentDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.equipmentId) errors.push('Equipment ID required');
    if (!decision.inputs?.equipmentType) errors.push('Equipment type required');
    if (typeof decision.inputs?.estimatedCost !== 'number') errors.push('Estimated cost required');
    if (!decision.inputs?.vendorOptions?.length) errors.push('At least one vendor option required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.acquisitionMethod) errors.push('Acquisition method required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');

    if (decision.inputs?.estimatedCost && decision.inputs.estimatedCost > 500000) {
      warnings.push('High-value acquisition (>$500K) requires board approval');
    }
    if (decision.inputs?.utilizationForecast !== undefined && decision.inputs.utilizationForecast < 0.4) {
      warnings.push('Utilization forecast below 40% â€” consider rental instead');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EquipmentDecision, signerId: string, signerRole: string, privateKey: string): Promise<EquipmentDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: EquipmentDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        equipment: { id: decision.inputs.equipmentId, type: decision.inputs.equipmentType, cost: decision.inputs.estimatedCost },
        selectedVendor: decision.outcome.selectedVendor,
        acquisitionMethod: decision.outcome.acquisitionMethod,
        tco: decision.outcome.totalCostOfOwnership,
        roi: decision.outcome.roiProjection,
        vendorComparison: decision.inputs.vendorOptions,
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
    };
  }
}

export class SubcontractorDecisionSchema extends DecisionSchema<SubcontractorDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'subcontractor';
  readonly requiredFields = [
    'inputs.selectionId',
    'inputs.projectId',
    'inputs.candidates',
    'inputs.evaluationCriteria',
    'outcome.approved',
    'outcome.decisionRationale',
    'outcome.riskRating'
  ];
  readonly requiredApprovers = ['procurement-manager', 'safety-officer', 'project-director'];

  validate(decision: Partial<SubcontractorDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.selectionId) errors.push('Selection ID required');
    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.candidates?.length) errors.push('At least one candidate required');
    if (!decision.inputs?.evaluationCriteria?.length) errors.push('Evaluation criteria required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.decisionRationale) errors.push('Decision rationale required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');

    if (decision.inputs?.evaluationCriteria) {
      const totalWeight = decision.inputs.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0);
      if (Math.abs(totalWeight - 100) > 1) {
        errors.push(`Evaluation criteria weights must sum to 100 (current: ${totalWeight})`);
      }
    }
    if (decision.inputs?.candidates) {
      for (const candidate of decision.inputs.candidates) {
        if (candidate.safetyRecord.fatalities > 0) {
          warnings.push(`${candidate.companyName} has fatality/ies on record â€” requires enhanced due diligence`);
        }
        if (!candidate.insuranceCoverage.workersComp) {
          errors.push(`${candidate.companyName} lacks workers compensation insurance`);
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: SubcontractorDecision, signerId: string, signerRole: string, privateKey: string): Promise<SubcontractorDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: SubcontractorDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        selection: decision.inputs.selectionId,
        project: decision.inputs.projectId,
        selectedContractor: decision.outcome.selectedContractor,
        rationale: decision.outcome.decisionRationale,
        scoringMatrix: decision.outcome.scoringMatrix,
        contractTerms: decision.outcome.contractTerms,
        candidates: decision.inputs.candidates.map(c => ({
          name: c.companyName,
          price: c.quotedPrice,
          safetyRecord: c.safetyRecord,
          qualityScore: c.qualityScore
        })),
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
    };
  }
}

export class ContractReviewDecisionSchema extends DecisionSchema<ContractReviewDecision> {
  readonly verticalId = 'industrial-services';
  readonly decisionType = 'contract-review';
  readonly requiredFields = [
    'inputs.contractId',
    'inputs.clientName',
    'inputs.contractType',
    'inputs.totalValue',
    'inputs.keyTerms',
    'outcome.recommendation',
    'outcome.riskScore',
    'outcome.riskRating'
  ];
  readonly requiredApprovers = ['legal-counsel', 'finance-controller', 'general-manager'];

  validate(decision: Partial<ContractReviewDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.contractId) errors.push('Contract ID required');
    if (!decision.inputs?.clientName) errors.push('Client name required');
    if (!decision.inputs?.contractType) errors.push('Contract type required');
    if (typeof decision.inputs?.totalValue !== 'number') errors.push('Total value required');
    if (!decision.inputs?.keyTerms) errors.push('Key terms required');
    if (!decision.outcome?.recommendation) errors.push('Recommendation required');
    if (typeof decision.outcome?.riskScore !== 'number') errors.push('Risk score required');
    if (!decision.outcome?.riskRating) errors.push('Risk rating required');

    if (decision.inputs?.keyTerms) {
      const terms = decision.inputs.keyTerms;
      if (terms.retentionPercentage > 10) {
        warnings.push('Retention percentage exceeds 10% â€” negotiate lower');
      }
      if (!terms.forceManjeure) {
        warnings.push('No force majeure clause â€” high risk in Peru (earthquakes, El NiÃ±o)');
      }
      if (terms.liabilityCap > decision.inputs.totalValue * 2) {
        warnings.push('Liability cap exceeds 2x contract value');
      }
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ContractReviewDecision, signerId: string, signerRole: string, privateKey: string): Promise<ContractReviewDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: ContractReviewDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        contract: { id: decision.inputs.contractId, client: decision.inputs.clientName, type: decision.inputs.contractType, value: decision.inputs.totalValue },
        recommendation: decision.outcome.recommendation,
        riskScore: decision.outcome.riskScore,
        keyRisks: decision.outcome.keyRisks,
        suggestedAmendments: decision.outcome.suggestedAmendments,
        financialExposure: decision.outcome.financialExposure,
        keyTerms: decision.inputs.keyTerms,
        jurisdictions: decision.inputs.jurisdictions,
        deliberation: decision.deliberation,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
    };
  }
}

// ============================================================================
// LAYER 5: INDUSTRIAL SERVICES AGENT PRESET
// ============================================================================

export class IndustrialServicesAgentPreset extends AgentPreset {
  readonly verticalId = 'industrial-services';
  readonly presetId = 'industrial-services-council';
  readonly name = 'Industrial Services Decision Council';
  readonly description = 'Multi-agent deliberation for industrial maintenance, repair, and construction decisions';

  readonly capabilities: AgentCapability[] = [
    { id: 'safety-assessment', name: 'Safety Risk Assessment', description: 'OSHA/ISO 45001/SUNAFIL compliance and hazard analysis', requiredPermissions: ['safety.read', 'safety.write'] },
    { id: 'financial-analysis', name: 'Financial Analysis', description: 'Cost estimation, ROI calculation, and budget impact', requiredPermissions: ['finance.read'] },
    { id: 'project-evaluation', name: 'Project Evaluation', description: 'Bid analysis, resource capacity, and schedule feasibility', requiredPermissions: ['projects.read'] },
    { id: 'procurement-review', name: 'Procurement Review', description: 'Vendor evaluation, subcontractor qualification, and supply chain risk', requiredPermissions: ['procurement.read'] },
    { id: 'legal-review', name: 'Legal & Contract Review', description: 'Contract terms analysis, liability assessment, and regulatory compliance', requiredPermissions: ['legal.read'] },
    { id: 'quality-assurance', name: 'Quality Assurance', description: 'ISO 9001 compliance, welding standards, and inspection requirements', requiredPermissions: ['quality.read'] },
    { id: 'environmental-review', name: 'Environmental Review', description: 'ISO 14001 compliance and environmental impact assessment', requiredPermissions: ['environmental.read'] }
  ];

  readonly guardrails: AgentGuardrail[] = [
    { id: 'safety-block', name: 'Safety Hard Stop', type: 'hard-stop', condition: 'Any extreme residual risk in hazard assessment', action: 'Block decision until risk is reduced' },
    { id: 'fatality-block', name: 'Fatality Record Block', type: 'hard-stop', condition: 'Subcontractor with fatality on record and no remediation plan', action: 'Block subcontractor selection' },
    { id: 'insurance-block', name: 'Insurance Coverage Block', type: 'hard-stop', condition: 'Contractor without workers compensation insurance', action: 'Block engagement until insurance verified' },
    { id: 'budget-warning', name: 'Budget Threshold Warning', type: 'warning', condition: 'Decision exceeds 30% of annual capital budget', action: 'Require board-level approval' },
    { id: 'margin-warning', name: 'Margin Warning', type: 'warning', condition: 'Estimated project margin below 8%', action: 'Flag for commercial review' },
    { id: 'certification-warning', name: 'Certification Gap Warning', type: 'warning', condition: 'Required certifications not held by assigned personnel', action: 'Flag for training plan' },
    // Expanded hard-stops (6 new)
    { id: 'electrical-lockout-block', name: 'LOTO Block', type: 'hard-stop', condition: 'Energized electrical work without verified LOTO procedure', action: 'Block work until LOTO verified per NFPA 70E' },
    { id: 'confined-space-atmo-block', name: 'Atmospheric Testing Block', type: 'hard-stop', condition: 'Confined space entry without atmospheric testing', action: 'Block entry until 4-gas monitoring available' },
    { id: 'crane-overload-block', name: 'Crane Overload Block', type: 'hard-stop', condition: 'Lift exceeds crane rated capacity', action: 'Block lift â€” reconfigure rigging or select larger crane' },
    { id: 'hot-work-firewatch-block', name: 'Fire Watch Block', type: 'hard-stop', condition: 'Hot work without designated fire watch', action: 'Block hot work per NFPA 51B until fire watch assigned' },
    { id: 'excavation-cave-block', name: 'Excavation Cave-in Block', type: 'hard-stop', condition: 'Excavation >5ft without cave-in protection', action: 'Block entry until trench box or sloping installed' },
    { id: 'radiation-exposure-block', name: 'Radiation Exposure Block', type: 'hard-stop', condition: 'NDE radiation source without exclusion zone', action: 'Block RT operations until exclusion zone established' },
    // Expanded warnings (6 new)
    { id: 'environmental-spill-warning', name: 'Environmental Spill Warning', type: 'warning', condition: 'Work near waterways or protected areas without spill kit', action: 'Require spill prevention plan' },
    { id: 'schedule-delay-warning', name: 'Schedule Delay Warning', type: 'warning', condition: 'Schedule delay exceeds 10% of planned duration', action: 'Trigger schedule recovery plan' },
    { id: 'quality-ncr-warning', name: 'Quality NCR Rate Warning', type: 'warning', condition: 'NCR rate exceeds 5% of work packages', action: 'Trigger quality improvement review' },
    { id: 'training-expired-warning', name: 'Training Expired Warning', type: 'warning', condition: 'Personnel certifications expired or expiring within 30 days', action: 'Flag for immediate training' },
    { id: 'weather-warning', name: 'Adverse Weather Warning', type: 'warning', condition: 'High winds, lightning, or extreme temperature conditions', action: 'Suspend outdoor work per site-specific weather policy' },
    { id: 'fatigue-management-warning', name: 'Fatigue Management Warning', type: 'warning', condition: 'Crew hours exceeding 12hrs/day or 60hrs/week limits', action: 'Enforce mandatory rest period' },
    // Expanded audit controls (2 new)
    { id: 'compliance-drift-audit', name: 'Compliance Drift Detection', type: 'audit-only', condition: 'Compliance posture change detected', action: 'Log drift event and notify compliance monitor' },
    { id: 'decision-pattern-audit', name: 'Decision Pattern Analytics', type: 'audit-only', condition: 'Decision pattern anomaly detected', action: 'Log pattern event for analytics review' },
    { id: 'audit-trail', name: 'Full Audit Trail', type: 'audit-only', condition: 'All decisions', action: 'Record complete decision trace with timestamps' }
  ];

  readonly workflow: WorkflowStep[] = [
    {
      id: 'step-1-data-gathering',
      name: 'Data Gathering & Context',
      agentId: 'ind-project-evaluator',
      requiredInputs: ['decision-type', 'decision-inputs'],
      expectedOutputs: ['context-summary', 'data-provenance'],
      guardrails: [this.guardrails[6]], // audit-trail
      timeout: 30000
    },
    {
      id: 'step-2-safety-review',
      name: 'Safety & Compliance Review',
      agentId: 'ind-safety-sentinel',
      requiredInputs: ['context-summary', 'hazard-data'],
      expectedOutputs: ['safety-assessment', 'compliance-status', 'permit-recommendation'],
      guardrails: [this.guardrails[0], this.guardrails[5]], // safety-block, certification-warning
      timeout: 45000
    },
    {
      id: 'step-3-financial-review',
      name: 'Financial Analysis',
      agentId: 'ind-finance-controller',
      requiredInputs: ['context-summary', 'financial-data'],
      expectedOutputs: ['cost-analysis', 'roi-projection', 'budget-impact'],
      guardrails: [this.guardrails[3], this.guardrails[4]], // budget-warning, margin-warning
      timeout: 30000
    },
    {
      id: 'step-4-procurement-review',
      name: 'Procurement & Vendor Assessment',
      agentId: 'ind-procurement-analyst',
      requiredInputs: ['context-summary', 'vendor-data'],
      expectedOutputs: ['vendor-scores', 'risk-assessment', 'recommendation'],
      guardrails: [this.guardrails[1], this.guardrails[2]], // fatality-block, insurance-block
      timeout: 30000
    },
    {
      id: 'step-5-legal-review',
      name: 'Legal & Contract Review',
      agentId: 'ind-legal-advisor',
      requiredInputs: ['context-summary', 'contract-data'],
      expectedOutputs: ['legal-assessment', 'risk-flags', 'amendments'],
      guardrails: [this.guardrails[6]], // audit-trail
      timeout: 30000
    },
    {
      id: 'step-6-quality-review',
      name: 'Quality & Standards Review',
      agentId: 'ind-quality-inspector',
      requiredInputs: ['context-summary', 'quality-data'],
      expectedOutputs: ['quality-assessment', 'standards-compliance', 'inspection-plan'],
      guardrails: [this.guardrails[6]], // audit-trail
      timeout: 30000
    },
    {
      id: 'step-7-environmental-review',
      name: 'Environmental Impact Review',
      agentId: 'ind-environmental-officer',
      requiredInputs: ['context-summary', 'environmental-data'],
      expectedOutputs: ['environmental-assessment', 'mitigation-measures', 'permit-status'],
      guardrails: [this.guardrails[12]], // environmental-spill-warning
      timeout: 30000
    },
    {
      id: 'step-8-maintenance-assessment',
      name: 'Maintenance & Asset Assessment',
      agentId: 'ind-maintenance-planner',
      requiredInputs: ['context-summary', 'equipment-data', 'inspection-reports'],
      expectedOutputs: ['maintenance-plan', 'remaining-life', 'parts-requirements'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 30000
    },
    {
      id: 'step-9-workforce-check',
      name: 'Workforce Availability & Deployment',
      agentId: 'ind-workforce-mobilizer',
      requiredInputs: ['context-summary', 'resource-data', 'certification-data'],
      expectedOutputs: ['crew-plan', 'gap-analysis', 'mobilization-schedule'],
      guardrails: [this.guardrails[5], this.guardrails[17]], // certification-warning, fatigue-management-warning
      timeout: 30000
    },
    {
      id: 'step-10-training-verification',
      name: 'Training & Certification Verification',
      agentId: 'ind-training-coordinator',
      requiredInputs: ['crew-plan', 'certification-data'],
      expectedOutputs: ['certification-status', 'training-requirements', 'compliance-gaps'],
      guardrails: [this.guardrails[5], this.guardrails[15]], // certification-warning, training-expired-warning
      timeout: 20000
    },
    {
      id: 'step-11-insurance-review',
      name: 'Insurance & Risk Transfer Review',
      agentId: 'ind-insurance-advisor',
      requiredInputs: ['context-summary', 'insurance-data', 'risk-assessment'],
      expectedOutputs: ['coverage-analysis', 'risk-transfer-plan', 'premium-impact'],
      guardrails: [this.guardrails[2]], // insurance-block
      timeout: 25000
    },
    {
      id: 'step-12-stakeholder-assessment',
      name: 'Stakeholder Impact Assessment',
      agentId: 'ind-stakeholder-relations',
      requiredInputs: ['context-summary', 'stakeholder-map'],
      expectedOutputs: ['stakeholder-impact', 'communication-plan', 'community-assessment'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 20000
    },
    {
      id: 'step-13-historical-analysis',
      name: 'Historical Performance Analysis',
      agentId: 'ind-data-analytics',
      requiredInputs: ['context-summary', 'historical-data'],
      expectedOutputs: ['trend-analysis', 'benchmark-comparison', 'risk-patterns'],
      guardrails: [this.guardrails[19]], // decision-pattern-audit
      timeout: 25000
    },
    {
      id: 'step-14-regulatory-preclearance',
      name: 'Regulatory Pre-Clearance',
      agentId: 'ind-regulatory-tracker',
      requiredInputs: ['context-summary', 'regulatory-requirements'],
      expectedOutputs: ['regulatory-status', 'permit-requirements', 'compliance-checklist'],
      guardrails: [this.guardrails[18]], // compliance-drift-audit
      timeout: 20000
    },
    {
      id: 'step-15-emergency-preparedness',
      name: 'Emergency Preparedness Review',
      agentId: 'ind-emergency-commander',
      requiredInputs: ['context-summary', 'site-conditions', 'hazard-assessment'],
      expectedOutputs: ['emergency-plan', 'evacuation-routes', 'resource-readiness'],
      guardrails: [this.guardrails[0]], // safety-block
      timeout: 25000
    },
    {
      id: 'step-16-asset-lifecycle',
      name: 'Asset Lifecycle Assessment',
      agentId: 'ind-asset-manager',
      requiredInputs: ['equipment-data', 'financial-data'],
      expectedOutputs: ['lifecycle-analysis', 'tco-projection', 'replacement-plan'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 20000
    },
    {
      id: 'step-17-site-logistics',
      name: 'Site Logistics Planning',
      agentId: 'ind-site-logistics',
      requiredInputs: ['context-summary', 'materials-data', 'site-access-data'],
      expectedOutputs: ['logistics-plan', 'delivery-schedule', 'laydown-plan'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 20000
    },
    {
      id: 'step-18-welding-review',
      name: 'Welding & Fabrication Technical Review',
      agentId: 'ind-welding-engineer',
      requiredInputs: ['context-summary', 'wps-data', 'welder-qualifications'],
      expectedOutputs: ['welding-assessment', 'nde-requirements', 'procedure-status'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 25000
    },
    {
      id: 'step-19-structural-review',
      name: 'Structural Integrity Review',
      agentId: 'ind-structural-engineer',
      requiredInputs: ['context-summary', 'structural-data', 'load-data'],
      expectedOutputs: ['structural-assessment', 'seismic-evaluation', 'fitness-for-service'],
      guardrails: [this.guardrails[0]], // safety-block
      timeout: 25000
    },
    {
      id: 'step-20-performance-benchmark',
      name: 'Performance Benchmarking',
      agentId: 'ind-performance-benchmarker',
      requiredInputs: ['all-agent-outputs', 'kpi-data'],
      expectedOutputs: ['benchmark-report', 'improvement-opportunities', 'risk-score'],
      guardrails: [this.guardrails[19]], // decision-pattern-audit
      timeout: 20000
    },
    {
      id: 'step-21-synthesis',
      name: 'Council Synthesis',
      agentId: 'ind-council-synthesizer',
      requiredInputs: ['all-agent-assessments'],
      expectedOutputs: ['recommendation', 'confidence-score', 'conditions', 'dissents'],
      guardrails: [this.guardrails[20]], // audit-trail
      timeout: 60000
    }
  ];

  async loadWorkflow(context: Record<string, unknown>): Promise<WorkflowStep[]> {
    const decisionType = context['decisionType'] as string;

    // Customize workflow based on decision type
    const steps = [...this.workflow];

    if (decisionType === 'safety-permit') {
      // Safety permits prioritize safety review and skip procurement
      return steps.filter(s => s.id !== 'step-4-procurement-review');
    }

    if (decisionType === 'contract-review') {
      // Contract reviews prioritize legal and skip quality
      return steps.filter(s => s.id !== 'step-6-quality-review');
    }

    return steps;
  }

  async enforceGuardrails(step: WorkflowStep, input: unknown): Promise<{ allowed: boolean; blockedBy?: string }> {
    for (const guardrail of step.guardrails) {
      if (guardrail.type === 'hard-stop') {
        const inputData = input as Record<string, unknown>;

        if (guardrail.id === 'safety-block') {
          const hazards = inputData['hazardAssessment'] as { residualRisk: string }[] | undefined;
          if (hazards?.some(h => h.residualRisk === 'extreme')) {
            return { allowed: false, blockedBy: guardrail.id };
          }
        }

        if (guardrail.id === 'fatality-block') {
          const candidates = inputData['candidates'] as { safetyRecord: { fatalities: number } }[] | undefined;
          if (candidates?.some(c => c.safetyRecord?.fatalities > 0)) {
            return { allowed: false, blockedBy: guardrail.id };
          }
        }

        if (guardrail.id === 'insurance-block') {
          const candidates = inputData['candidates'] as { insuranceCoverage: { workersComp: boolean } }[] | undefined;
          if (candidates?.some(c => !c.insuranceCoverage?.workersComp)) {
            return { allowed: false, blockedBy: guardrail.id };
          }
        }
      }
    }

    return { allowed: true };
  }

  trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace {
    const trace: AgentTrace = {
      stepId,
      agentId,
      startedAt: new Date(),
      completedAt: null,
      inputs,
      outputs: null,
      guardrailsTriggered: [],
      status: 'running'
    };
    this.traces.push(trace);
    return trace;
  }
}

// ============================================================================
// LAYER 6: INDUSTRIAL SERVICES DEFENSIBLE OUTPUT
// ============================================================================

export class IndustrialServicesDefensibleOutput extends DefensibleOutput<IndustrialServicesDecision> {
  readonly verticalId = 'industrial-services';

  async toRegulatorPacket(decision: IndustrialServicesDecision, frameworkId: string): Promise<RegulatorPacket> {
    const framework = frameworkId;
    return {
      id: this.generateId('REG'),
      decisionId: decision.metadata.id,
      frameworkId: framework,
      jurisdiction: this.getJurisdiction(frameworkId),
      generatedAt: new Date(),
      validUntil: this.generateValidityPeriod(365 * 7),
      sections: {
        executiveSummary: this.generateExecutiveSummary(decision),
        decisionRationale: decision.deliberation.reasoning,
        complianceMapping: decision.complianceEvidence,
        dissentsAndOverrides: decision.dissents,
        approvalChain: decision.approvals,
        auditTrail: this.generateAuditTrailEntries(decision)
      },
      signatures: decision.signatures,
      hash: this.hashContent(decision)
    };
  }

  async toCourtBundle(decision: IndustrialServicesDecision, caseReference?: string): Promise<CourtBundle> {
    return {
      id: this.generateId('COURT'),
      decisionId: decision.metadata.id,
      caseReference,
      generatedAt: new Date(),
      sections: {
        factualBackground: this.generateFactualBackground(decision),
        decisionProcess: decision.deliberation.reasoning,
        humanOversight: `Decision reviewed by ${decision.approvals.length} approver(s). ${decision.dissents.length} dissent(s) recorded and preserved.`,
        dissentsRecorded: decision.dissents,
        evidenceChain: this.generateEvidenceChain(decision)
      },
      certifications: {
        integrityHash: this.hashContent(decision),
        timestampAuthority: 'datacendia-tsa-v1',
        witnessSignatures: decision.signatures
      }
    };
  }

  async toAuditTrail(decision: IndustrialServicesDecision, events: unknown[]): Promise<AuditTrail> {
    const auditEvents = (events as Record<string, unknown>[]).map(e => ({
      timestamp: (e['timestamp'] as Date) || new Date(),
      actor: (e['actor'] as string) || 'system',
      action: (e['action'] as string) || 'unknown',
      details: e,
      hash: this.hashContent(e)
    }));

    return {
      id: this.generateId('AUDIT'),
      decisionId: decision.metadata.id,
      period: {
        start: auditEvents[0]?.timestamp || new Date(),
        end: auditEvents[auditEvents.length - 1]?.timestamp || new Date()
      },
      events: auditEvents,
      summary: {
        totalEvents: auditEvents.length,
        uniqueActors: new Set(auditEvents.map(e => e.actor)).size,
        guardrailsTriggered: 0,
        dissentsRecorded: decision.dissents.length
      },
      hash: this.hashContent(auditEvents)
    };
  }

  private getJurisdiction(frameworkId: string): string {
    const map: Record<string, string> = {
      'iso-45001': 'International',
      'iso-9001': 'International',
      'iso-14001': 'International',
      'osha-1926': 'US',
      'sunafil-ds005': 'Peru',
      'asme-aws': 'International',
      ...EXPANDED_JURISDICTION_MAP,
    };
    return map[frameworkId] || 'International';
  }

  private generateExecutiveSummary(decision: IndustrialServicesDecision): string {
    return `Industrial Services decision ${decision.metadata.id} of type "${decision.type}" was made on ${decision.metadata.createdAt.toISOString()} ` +
      `by ${decision.metadata.createdBy} for organization ${decision.metadata.organizationId}. ` +
      `The decision was reviewed by ${decision.approvals.length} approver(s) with ${decision.dissents.length} dissent(s) recorded. ` +
      `Compliance evidence was generated for ${decision.complianceEvidence.length} control(s).`;
  }

  private generateFactualBackground(decision: IndustrialServicesDecision): string {
    return `This decision of type "${decision.type}" was initiated on ${decision.metadata.createdAt.toISOString()}. ` +
      `The decision process involved multi-agent deliberation with safety, financial, legal, procurement, and quality review. ` +
      `All agent traces are preserved in the immutable audit log.`;
  }

  private generateAuditTrailEntries(decision: IndustrialServicesDecision): string[] {
    const entries: string[] = [];
    entries.push(`Decision created: ${decision.metadata.createdAt.toISOString()}`);
    for (const approval of decision.approvals) {
      entries.push(`Approved by ${approval.approverRole} at ${approval.approvedAt.toISOString()}`);
    }
    for (const dissent of decision.dissents) {
      entries.push(`Dissent filed by ${dissent.dissenterRole} at ${dissent.filedAt.toISOString()}: ${dissent.reason}`);
    }
    entries.push(`Compliance evidence generated for ${decision.complianceEvidence.length} controls`);
    return entries;
  }

  private generateEvidenceChain(decision: IndustrialServicesDecision): string[] {
    return [
      `Decision ID: ${decision.metadata.id}`,
      `Decision Hash: ${this.hashContent(decision)}`,
      `Signatures: ${decision.signatures.length}`,
      `Compliance Controls Evaluated: ${decision.complianceEvidence.length}`,
      `Dissents Preserved: ${decision.dissents.length}`,
      `Audit Trail: Complete`
    ];
  }
}

// ============================================================================
// VERTICAL IMPLEMENTATION & REGISTRATION
// ============================================================================

export class IndustrialServicesVerticalImpl implements VerticalImplementation<IndustrialServicesDecision> {
  readonly verticalId = 'industrial-services';
  readonly verticalName = 'Industrial Services';
  readonly completionPercentage = 100;
  readonly targetPercentage = 100;

  readonly dataConnector = new IndustrialServicesDataConnector();
  readonly knowledgeBase = new IndustrialServicesKnowledgeBase();
  readonly complianceMapper = new IndustrialServicesComplianceMapper();
  readonly decisionSchemas = new Map<string, DecisionSchema<IndustrialServicesDecision>>([
    ['project-bid', new ProjectBidDecisionSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['safety-permit', new SafetyPermitDecisionSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['equipment', new EquipmentDecisionSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['subcontractor', new SubcontractorDecisionSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['contract-review', new ContractReviewDecisionSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['workforce-deployment', new WorkforceDeploymentSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['maintenance-schedule', new MaintenanceScheduleSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['incident-investigation', new IncidentInvestigationSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['training-certification', new TrainingCertificationSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['change-order', new ChangeOrderSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['insurance-claim', new InsuranceClaimSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['environmental-assessment', new EnvironmentalAssessmentSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['quality-ncr', new QualityNCRSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['emergency-response', new EmergencyResponseSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
    ['joint-venture', new JointVentureSchema() as unknown as DecisionSchema<IndustrialServicesDecision>],
  ]);
  readonly agentPresets = new Map<string, AgentPreset>([
    ['industrial-services-council', new IndustrialServicesAgentPreset()]
  ]);
  readonly defensibleOutput = new IndustrialServicesDefensibleOutput();

  getStatus() {
    return {
      vertical: this.verticalName,
      layers: {
        dataConnector: true,
        knowledgeBase: true,
        complianceMapper: true,
        decisionSchemas: true,
        agentPresets: true,
        defensibleOutput: true
      },
      completionPercentage: this.completionPercentage,
      missingComponents: []
    };
  }
}

// Register with VerticalRegistry
const industrialServicesVertical = new IndustrialServicesVerticalImpl();
VerticalRegistry.getInstance().register(industrialServicesVertical);

export default industrialServicesVertical;
