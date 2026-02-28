// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Universal Vertical Pattern
 * 
 * The 6-layer architecture that every vertical must implement.
 * Legal is at 100% - everything else copies this pattern.
 * 
 * Datacendia is not an AI platform. It is decision infrastructure.
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { persistServiceRecord } from '../../../utils/servicePersistence.js';

// ============================================================================
// LAYER 1: DATA CONNECTOR
// ============================================================================

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'stream' | 'webhook';
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSync: Date | null;
  recordCount: number;
}

export interface ProvenanceRecord {
  sourceId: string;
  sourceName: string;
  retrievedAt: Date;
  hash: string;
  version: string;
  authoritative: boolean;
}

export interface IngestResult<T> {
  success: boolean;
  data: T | null;
  provenance: ProvenanceRecord;
  validationErrors: string[];
}

export abstract class DataConnector<T> {
  abstract readonly verticalId: string;
  abstract readonly connectorType: string;
  
  protected sources: Map<string, DataSource> = new Map();

  abstract connect(config: Record<string, unknown>): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<T>>;
  abstract validate(data: T): { valid: boolean; errors: string[] };
  
  protected generateProvenance(sourceId: string, data: unknown): ProvenanceRecord {
    const source = this.sources.get(sourceId);
    return {
      sourceId,
      sourceName: source?.name || 'unknown',
      retrievedAt: new Date(),
      hash: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      version: '1.0',
      authoritative: source?.type === 'api' || source?.type === 'database'
    };
  }

  getConnectedSources(): DataSource[] {
    return Array.from(this.sources.values()).filter(s => s.connectionStatus === 'connected');
  }

  getSourceStatus(sourceId: string): DataSource | undefined {
    return this.sources.get(sourceId);
  }
}

// ============================================================================
// LAYER 2: VERTICAL KNOWLEDGE BASE
// ============================================================================

export interface KnowledgeDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  provenance: ProvenanceRecord;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RetrievalResult {
  documents: KnowledgeDocument[];
  scores: number[];
  provenanceVerified: boolean;
  query: string;
}

export abstract class VerticalKnowledgeBase {
  abstract readonly verticalId: string;
  
  protected documents: Map<string, KnowledgeDocument> = new Map();

  abstract embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument>;
  abstract retrieve(query: string, topK?: number): Promise<RetrievalResult>;
  abstract enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }>;
  
  async verifyAllProvenance(): Promise<{ total: number; valid: number; invalid: string[] }> {
    const invalid: string[] = [];
    for (const [id, _doc] of this.documents) {
      const result = await this.enforceProvenance(id);
      if (!result.valid) {
        invalid.push(id);
      }
    }
    return {
      total: this.documents.size,
      valid: this.documents.size - invalid.length,
      invalid
    };
  }

  getDocumentCount(): number {
    return this.documents.size;
  }
}

// ============================================================================
// LAYER 3: COMPLIANCE & LIABILITY MAPPING
// ============================================================================

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  jurisdiction: string;
  controls: ComplianceControl[];
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  automatable: boolean;
}

export interface ComplianceViolation {
  controlId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediation: string;
  detectedAt: Date;
}

export interface ComplianceEvidence {
  id: string;
  frameworkId: string;
  controlId: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  evidence: string;
  generatedAt: Date;
  hash: string;
}

export abstract class ComplianceMapper {
  abstract readonly verticalId: string;
  abstract readonly supportedFrameworks: ComplianceFramework[];

  abstract mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[];
  abstract checkViolation(decision: unknown, frameworkId: string): Promise<ComplianceViolation[]>;
  abstract generateEvidence(decision: unknown, frameworkId: string): Promise<ComplianceEvidence[]>;

  getFramework(frameworkId: string): ComplianceFramework | undefined {
    return this.supportedFrameworks.find(f => f.id === frameworkId);
  }

  listFrameworks(): { id: string; name: string; controlCount: number }[] {
    return this.supportedFrameworks.map(f => ({
      id: f.id,
      name: f.name,
      controlCount: f.controls.length
    }));
  }
}

// ============================================================================
// LAYER 4: DECISION SCHEMA
// ============================================================================

export interface DecisionMetadata {
  id: string;
  type: string;
  verticalId: string;
  createdAt: Date;
  createdBy: string;
  organizationId: string;
}

export interface DecisionSignature {
  signerId: string;
  signerRole: string;
  signedAt: Date;
  signature: string;
  publicKeyFingerprint: string;
}

export interface DecisionDissent {
  dissenterId: string;
  dissenterRole: string;
  reason: string;
  filedAt: Date;
  acknowledged: boolean;
}

export interface DecisionApproval {
  approverId: string;
  approverRole: string;
  approvedAt: Date;
  conditions?: string[];
}

export interface BaseDecision {
  metadata: DecisionMetadata;
  inputs: Record<string, unknown>;
  deliberation: {
    reasoning: string;
    alternatives: string[];
    riskAssessment: string;
  };
  outcome: unknown;
  signatures: DecisionSignature[];
  dissents: DecisionDissent[];
  approvals: DecisionApproval[];
  complianceEvidence: ComplianceEvidence[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  requiredFields: string[];
}

export interface DefensibleArtifact {
  id: string;
  decisionId: string;
  type: 'regulator' | 'court' | 'audit' | 'internal';
  content: Record<string, unknown>;
  hash: string;
  generatedAt: Date;
  expiresAt?: Date;
}

export abstract class DecisionSchema<T extends BaseDecision> {
  abstract readonly verticalId: string;
  abstract readonly decisionType: string;
  abstract readonly requiredFields: string[];
  abstract readonly requiredApprovers: string[];

  abstract validate(decision: Partial<T>): ValidationResult;
  abstract sign(decision: T, signerId: string, signerRole: string, privateKey: string): Promise<T>;
  abstract toDefensibleArtifact(decision: T, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact>;

  protected hashDecision(decision: T): string {
    const normalized = JSON.stringify(decision, Object.keys(decision).sort());
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  protected generateSignature(data: string, privateKey: string): string {
    // Asymmetric signing via crypto.sign with RSA/ECDSA keys when configured
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    try {
      return sign.sign(privateKey, 'hex');
    } catch {
      // Fallback for testing
      return crypto.createHmac('sha256', privateKey).update(data).digest('hex');
    }
  }

  hasRequiredApprovals(decision: T): boolean {
    const approverRoles = decision.approvals.map(a => a.approverRole);
    return this.requiredApprovers.every(role => approverRoles.includes(role));
  }
}

// ============================================================================
// LAYER 5: AGENT PRESET
// ============================================================================

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  requiredPermissions: string[];
}

export interface AgentGuardrail {
  id: string;
  name: string;
  type: 'hard-stop' | 'warning' | 'audit-only';
  condition: string;
  action: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agentId: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  guardrails: AgentGuardrail[];
  timeout: number;
}

export interface AgentTrace {
  stepId: string;
  agentId: string;
  startedAt: Date;
  completedAt: Date | null;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown> | null;
  guardrailsTriggered: string[];
  status: 'running' | 'completed' | 'failed' | 'blocked';
}

export abstract class AgentPreset {
  abstract readonly verticalId: string;
  abstract readonly presetId: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly capabilities: AgentCapability[];
  abstract readonly guardrails: AgentGuardrail[];
  abstract readonly workflow: WorkflowStep[];

  protected traces: AgentTrace[] = [];

  abstract loadWorkflow(context: Record<string, unknown>): Promise<WorkflowStep[]>;
  abstract enforceGuardrails(step: WorkflowStep, input: unknown): Promise<{ allowed: boolean; blockedBy?: string }>;
  abstract trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace;

  getTraces(): AgentTrace[] {
    return [...this.traces];
  }

  completeTrace(stepId: string, outputs: Record<string, unknown>, guardrailsTriggered: string[]): void {
    const trace = this.traces.find(t => t.stepId === stepId && t.status === 'running');
    if (trace) {
      trace.completedAt = new Date();
      trace.outputs = outputs;
      trace.guardrailsTriggered = guardrailsTriggered;
      trace.status = guardrailsTriggered.some(g => 
        this.guardrails.find(gr => gr.id === g)?.type === 'hard-stop'
      ) ? 'blocked' : 'completed';
    }
  }

  getWorkflowProgress(): { total: number; completed: number; blocked: number } {
    return {
      total: this.workflow.length,
      completed: this.traces.filter(t => t.status === 'completed').length,
      blocked: this.traces.filter(t => t.status === 'blocked').length
    };
  }
}

// ============================================================================
// LAYER 6: DEFENSIBLE OUTPUT
// ============================================================================

export interface RegulatorPacket {
  id: string;
  decisionId: string;
  frameworkId: string;
  jurisdiction: string;
  generatedAt: Date;
  validUntil: Date;
  sections: {
    executiveSummary: string;
    decisionRationale: string;
    complianceMapping: ComplianceEvidence[];
    dissentsAndOverrides: DecisionDissent[];
    approvalChain: DecisionApproval[];
    auditTrail: string[];
  };
  signatures: DecisionSignature[];
  hash: string;
}

export interface CourtBundle {
  id: string;
  decisionId: string;
  caseReference?: string;
  generatedAt: Date;
  sections: {
    factualBackground: string;
    decisionProcess: string;
    humanOversight: string;
    dissentsRecorded: DecisionDissent[];
    evidenceChain: string[];
  };
  certifications: {
    integrityHash: string;
    timestampAuthority?: string;
    witnessSignatures: DecisionSignature[];
  };
}

export interface AuditTrail {
  id: string;
  decisionId: string;
  period: { start: Date; end: Date };
  events: {
    timestamp: Date;
    actor: string;
    action: string;
    details: Record<string, unknown>;
    hash: string;
  }[];
  summary: {
    totalEvents: number;
    uniqueActors: number;
    guardrailsTriggered: number;
    dissentsRecorded: number;
  };
  hash: string;
}

export abstract class DefensibleOutput<T extends BaseDecision> {
  abstract readonly verticalId: string;

  abstract toRegulatorPacket(decision: T, frameworkId: string): Promise<RegulatorPacket>;
  abstract toCourtBundle(decision: T, caseReference?: string): Promise<CourtBundle>;
  abstract toAuditTrail(decision: T, events: unknown[]): Promise<AuditTrail>;

  protected generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${uuidv4().slice(0, 8)}`;
  }

  protected hashContent(content: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
  }

  protected generateValidityPeriod(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}

// ============================================================================
// VERTICAL IMPLEMENTATION INTERFACE
// ============================================================================

export interface VerticalImplementation<T extends BaseDecision> {
  readonly verticalId: string;
  readonly verticalName: string;
  readonly completionPercentage: number;
  readonly targetPercentage: number;
  
  readonly dataConnector: DataConnector<unknown>;
  readonly knowledgeBase: VerticalKnowledgeBase;
  readonly complianceMapper: ComplianceMapper;
  readonly decisionSchemas: Map<string, DecisionSchema<T>>;
  readonly agentPresets: Map<string, AgentPreset>;
  readonly defensibleOutput: DefensibleOutput<T>;

  getStatus(): {
    vertical: string;
    layers: {
      dataConnector: boolean;
      knowledgeBase: boolean;
      complianceMapper: boolean;
      decisionSchemas: boolean;
      agentPresets: boolean;
      defensibleOutput: boolean;
    };
    completionPercentage: number;
    missingComponents: string[];
  };
}

// ============================================================================
// VERTICAL REGISTRY
// ============================================================================

export class VerticalRegistry {
  private static instance: VerticalRegistry;
  private verticals: Map<string, VerticalImplementation<BaseDecision>> = new Map();

  static getInstance(): VerticalRegistry {
    if (!VerticalRegistry.instance) {
      VerticalRegistry.instance = new VerticalRegistry();
    }
    return VerticalRegistry.instance;
  }

  register<T extends BaseDecision>(vertical: VerticalImplementation<T>): void {
    this.verticals.set(vertical.verticalId, vertical as VerticalImplementation<BaseDecision>);
    persistServiceRecord({ serviceName: 'VerticalRegistry', recordType: 'vertical_registered', referenceId: vertical.verticalId, data: { verticalId: vertical.verticalId, registeredAt: new Date() } });
  }

  get(verticalId: string): VerticalImplementation<BaseDecision> | undefined {
    return this.verticals.get(verticalId);
  }

  list(): { id: string; name: string; completion: number; target: number }[] {
    return Array.from(this.verticals.values()).map(v => ({
      id: v.verticalId,
      name: v.verticalName,
      completion: v.completionPercentage,
      target: v.targetPercentage
    }));
  }

  getCompletionMatrix(): Record<string, { current: number; target: number; layers: Record<string, boolean> }> {
    const matrix: Record<string, { current: number; target: number; layers: Record<string, boolean> }> = {};
    for (const [id, vertical] of this.verticals) {
      const status = vertical.getStatus();
      matrix[id] = {
        current: status.completionPercentage,
        target: vertical.targetPercentage,
        layers: status.layers
      };
    }
    return matrix;
  }
}

export default VerticalRegistry;
