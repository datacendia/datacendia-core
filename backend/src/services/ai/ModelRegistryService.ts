/**
 * AI Model Lifecycle & Registry
 * 
 * Central registry for all AI/ML models with versioning, approval workflows,
 * lineage tracking, and integration with explainability/bias audit tools.
 * 
 * @module services/ai/ModelRegistryService
 */

import { logger } from '../../utils/logger.js';
import { generateId, now, sr_create, sr_get, sr_update, sr_list } from '../enterprise/_base.js';

// =============================================================================
// TYPES
// =============================================================================

export type ModelStatus = 'registered' | 'testing' | 'pending_approval' | 'approved' | 'deployed' | 'deprecated' | 'retired';
export type ModelType = 'classification' | 'regression' | 'generation' | 'embedding' | 'multi_modal' | 'reinforcement' | 'other';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  version: string;
  status: ModelStatus;
  owner: string;
  team: string;
  provider: string;
  framework: string;
  tags: string[];
  metrics: ModelMetrics;
  lineage: ModelLineage;
  deployments: ModelDeployment[];
  approvals: ModelApproval[];
  biasAudit?: BiasAuditResult;
  explainability?: ExplainabilityReport;
  riskAssessment?: ModelRiskAssessment;
  createdAt: string;
  updatedAt: string;
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  latencyP50Ms?: number;
  latencyP99Ms?: number;
  throughput?: number;
  costPerInference?: number;
  customMetrics: Record<string, number>;
}

export interface ModelLineage {
  datasetIds: string[];
  datasetVersions: string[];
  trainingConfig: Record<string, any>;
  parentModelId?: string;
  codeCommit?: string;
  codeRepository?: string;
  trainingStarted?: string;
  trainingCompleted?: string;
  trainingDuration?: number;
  evaluationResults: { metric: string; value: number; threshold: number; passed: boolean }[];
}

export interface ModelDeployment {
  id: string;
  environment: 'development' | 'staging' | 'production';
  endpoint?: string;
  deployedBy: string;
  deployedAt: string;
  status: 'active' | 'inactive' | 'failed';
  trafficPercent: number;
  config: Record<string, any>;
}

export interface ModelApproval {
  id: string;
  stage: 'technical_review' | 'bias_review' | 'compliance_review' | 'business_review' | 'final_approval';
  status: 'pending' | 'approved' | 'rejected' | 'revisions_requested';
  reviewer: string;
  reviewedAt?: string;
  comments: string;
  conditions?: string[];
}

export interface BiasAuditResult {
  auditDate: string;
  auditor: string;
  overallScore: number;
  protectedAttributes: { attribute: string; disparateImpact: number; equalOpportunityDiff: number; passed: boolean }[];
  recommendations: string[];
  nextAuditDate: string;
}

export interface ExplainabilityReport {
  method: 'shap' | 'lime' | 'counterfactual' | 'attention' | 'integrated_gradients';
  globalFeatureImportance: { feature: string; importance: number }[];
  sampleExplanations: { inputId: string; prediction: any; topFeatures: { feature: string; contribution: number }[] }[];
  interpretabilityScore: number;
  generatedAt: string;
}

export interface ModelRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiActClassification: 'minimal' | 'limited' | 'high_risk' | 'unacceptable';
  dataPrivacyRisk: 'low' | 'medium' | 'high';
  fairnessRisk: 'low' | 'medium' | 'high';
  securityRisk: 'low' | 'medium' | 'high';
  mitigations: string[];
  assessedBy: string;
  assessedAt: string;
}

export interface ModelVersionDiff {
  fromVersion: string;
  toVersion: string;
  metricsChanges: { metric: string; from: number; to: number; changePercent: number }[];
  configChanges: { field: string; from: any; to: any }[];
  lineageChanges: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class ModelRegistryService {
  private SN = 'ModelRegistry';

  async registerModel(input: {
    name: string;
    description: string;
    type: ModelType;
    version: string;
    owner: string;
    team: string;
    provider: string;
    framework: string;
    tags?: string[];
    metrics?: Partial<ModelMetrics>;
    lineage?: Partial<ModelLineage>;
  }): Promise<AIModel> {
    const id = generateId();
    const model: AIModel & { id: string } = {
      id,
      name: input.name,
      description: input.description,
      type: input.type,
      version: input.version,
      status: 'registered',
      owner: input.owner,
      team: input.team,
      provider: input.provider,
      framework: input.framework,
      tags: input.tags || [],
      metrics: { customMetrics: {}, ...input.metrics },
      lineage: { datasetIds: [], datasetVersions: [], trainingConfig: {}, evaluationResults: [], ...input.lineage },
      deployments: [],
      approvals: this.createDefaultApprovalPipeline(),
      createdAt: now(),
      updatedAt: now(),
    };

    await sr_create(this.SN, 'model', model);
    await this.addAudit(id, 'registered', input.owner, { version: input.version });
    logger.info(`[ModelRegistry] Model registered: ${id} (${input.name} v${input.version})`);
    return model;
  }

  async getModel(modelId: string): Promise<AIModel | null> {
    return await sr_get<AIModel>(this.SN, 'model', modelId) || null;
  }

  async listModels(filters?: { status?: ModelStatus; type?: ModelType; team?: string; query?: string }): Promise<AIModel[]> {
    let results = await sr_list<AIModel>(this.SN, 'model');
    if (filters?.status) results = results.filter((m: any) => m.status === filters.status);
    if (filters?.type) results = results.filter((m: any) => m.type === filters.type);
    if (filters?.team) results = results.filter((m: any) => m.team === filters.team);
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter((m: any) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return results;
  }

  async updateModelVersion(modelId: string, newVersion: string, metrics: Partial<ModelMetrics>, userId: string): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;

    const oldVersion = model.version;
    const updated: AIModel & { id: string } = {
      ...model,
      id: modelId,
      version: newVersion,
      metrics: { ...model.metrics, ...metrics },
      status: 'registered',
      approvals: this.createDefaultApprovalPipeline(),
      updatedAt: now(),
    };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'version_updated', userId, { from: oldVersion, to: newVersion });
    return updated;
  }

  async submitForApproval(modelId: string, userId: string): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;

    const updated: AIModel & { id: string } = { ...model, id: modelId, status: 'pending_approval', updatedAt: now() };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'submitted_for_approval', userId, {});
    return updated;
  }

  async reviewApproval(modelId: string, stage: ModelApproval['stage'], status: 'approved' | 'rejected' | 'revisions_requested', reviewer: string, comments: string): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;

    const approval = model.approvals.find(a => a.stage === stage);
    if (!approval) return null;

    approval.status = status;
    approval.reviewer = reviewer;
    approval.reviewedAt = now();
    approval.comments = comments;

    const allApproved = model.approvals.every(a => a.status === 'approved');
    const anyRejected = model.approvals.some(a => a.status === 'rejected');

    const updated: AIModel & { id: string } = {
      ...model,
      id: modelId,
      status: allApproved ? 'approved' : anyRejected ? 'registered' : model.status,
      updatedAt: now(),
    };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, `approval_${status}`, reviewer, { stage, comments });
    return updated;
  }

  async deployModel(modelId: string, deployment: Omit<ModelDeployment, 'id' | 'status'>): Promise<ModelDeployment | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model || model.status !== 'approved') return null;

    const dep: ModelDeployment = { id: generateId(), ...deployment, status: 'active' };
    const updated: AIModel & { id: string } = {
      ...model,
      id: modelId,
      deployments: [...model.deployments, dep],
      status: 'deployed',
      updatedAt: now(),
    };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'deployed', deployment.deployedBy, { environment: deployment.environment });
    return dep;
  }

  async deprecateModel(modelId: string, userId: string): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;

    const updated: AIModel & { id: string } = {
      ...model,
      id: modelId,
      status: 'deprecated',
      deployments: model.deployments.map(d => ({ ...d, status: 'inactive' as const })),
      updatedAt: now(),
    };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'deprecated', userId, {});
    return updated;
  }

  async addBiasAudit(modelId: string, audit: BiasAuditResult): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;
    const updated: AIModel & { id: string } = { ...model, id: modelId, biasAudit: audit, updatedAt: now() };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'bias_audit', audit.auditor, { overallScore: audit.overallScore });
    return updated;
  }

  async addExplainabilityReport(modelId: string, report: ExplainabilityReport): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;
    const updated: AIModel & { id: string } = { ...model, id: modelId, explainability: report, updatedAt: now() };
    await sr_update(this.SN, 'model', modelId, updated);
    return updated;
  }

  async addRiskAssessment(modelId: string, assessment: ModelRiskAssessment): Promise<AIModel | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;
    const updated: AIModel & { id: string } = { ...model, id: modelId, riskAssessment: assessment, updatedAt: now() };
    await sr_update(this.SN, 'model', modelId, updated);
    await this.addAudit(modelId, 'risk_assessed', assessment.assessedBy, { riskLevel: assessment.riskLevel, aiActClassification: assessment.aiActClassification });
    return updated;
  }

  async getModelLineage(modelId: string): Promise<{ model: AIModel; parentChain: AIModel[] } | null> {
    const model = await sr_get<AIModel>(this.SN, 'model', modelId);
    if (!model) return null;

    const parentChain: AIModel[] = [];
    let current = model;
    while (current.lineage.parentModelId) {
      const parent = await sr_get<AIModel>(this.SN, 'model', current.lineage.parentModelId);
      if (!parent) break;
      parentChain.push(parent);
      current = parent;
    }

    return { model, parentChain };
  }

  async getAuditLog(modelId?: string): Promise<{ modelId: string; action: string; userId: string; timestamp: string; details: Record<string, any> }[]> {
    const all = await sr_list<any>(this.SN, 'audit');
    if (modelId) return all.filter((e: any) => e.modelId === modelId);
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // ---------------------------------------------------------------------------
  // PRIVATE
  // ---------------------------------------------------------------------------

  private createDefaultApprovalPipeline(): ModelApproval[] {
    const stages: ModelApproval['stage'][] = ['technical_review', 'bias_review', 'compliance_review', 'business_review', 'final_approval'];
    return stages.map(stage => ({
      id: generateId(),
      stage,
      status: 'pending' as const,
      reviewer: '',
      comments: '',
    }));
  }

  private async addAudit(modelId: string, action: string, userId: string, details: Record<string, any>): Promise<void> {
    const entry: { id: string; modelId: string; action: string; userId: string; timestamp: string; details: Record<string, any> } = {
      id: generateId(), modelId, action, userId, timestamp: now(), details,
    };
    await sr_create(this.SN, 'audit', entry);
  }
}

export const modelRegistry = new ModelRegistryService();
export { ModelRegistryService };
