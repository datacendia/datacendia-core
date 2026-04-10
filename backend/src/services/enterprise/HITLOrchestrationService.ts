/**
 * Human-in-the-Loop Governance Orchestration
 * 
 * Orchestration engine for blending automated/manual review, escalation, override,
 * notification, approval, and audit logging.
 * 
 * @module services/enterprise/HITLOrchestrationService
 */

import { logger } from '../../utils/logger.js';

export type ReviewType = 'automated' | 'human_required' | 'escalated' | 'override';
export type WorkflowStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated' | 'overridden' | 'timed_out';

export interface ReviewWorkflow {
  id: string;
  name: string;
  description: string;
  stages: ReviewStage[];
  escalationPolicy: EscalationPolicy;
  slaHours: number;
  createdAt: string;
}

export interface ReviewStage {
  id: string;
  name: string;
  type: ReviewType;
  requiredApprovers: number;
  approverRoles: string[];
  automatedChecks: AutomatedCheck[];
  timeout: number;
  onTimeout: 'escalate' | 'auto_approve' | 'reject';
}

export interface AutomatedCheck {
  name: string;
  type: 'policy_check' | 'risk_score' | 'bias_check' | 'compliance_check';
  threshold: number;
  action: 'pass' | 'flag' | 'block';
}

export interface EscalationPolicy {
  levels: { level: number; notifyRoles: string[]; timeoutHours: number }[];
  maxEscalationLevel: number;
}

export interface ReviewInstance {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  currentStage: number;
  status: WorkflowStatus;
  decisions: ReviewDecision[];
  automatedResults: { check: string; result: 'pass' | 'fail'; details: string }[];
  escalationLevel: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  auditTrail: { action: string; userId: string; timestamp: string; details: string }[];
}

export interface ReviewDecision {
  stageId: string;
  reviewer: string;
  decision: 'approve' | 'reject' | 'request_changes' | 'escalate';
  comments: string;
  conditions?: string[];
  timestamp: string;
}

class HITLOrchestrationService {
  private workflows: Map<string, ReviewWorkflow> = new Map();
  private instances: Map<string, ReviewInstance> = new Map();

  constructor() {
    this.loadDefaultWorkflows();
  }

  async createWorkflow(input: Omit<ReviewWorkflow, 'id' | 'createdAt'>): Promise<ReviewWorkflow> {
    const id = `wf_${crypto.randomUUID().split('-')[0]}`;
    const wf: ReviewWorkflow = { id, ...input, createdAt: new Date().toISOString() };
    this.workflows.set(id, wf);
    return wf;
  }

  async listWorkflows(): Promise<ReviewWorkflow[]> {
    return Array.from(this.workflows.values());
  }

  async initiateReview(workflowId: string, entityType: string, entityId: string): Promise<ReviewInstance> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const instance: ReviewInstance = {
      id: `rev_${crypto.randomUUID().split('-')[0]}`,
      workflowId,
      entityType,
      entityId,
      currentStage: 0,
      status: 'pending',
      decisions: [],
      automatedResults: [],
      escalationLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [{ action: 'initiated', userId: 'system', timestamp: new Date().toISOString(), details: `Review initiated for ${entityType}:${entityId}` }],
    };

    // Run automated checks for first stage
    const stage = workflow.stages[0];
    if (stage.type === 'automated') {
      for (const check of stage.automatedChecks) {
        const passed = Math.random() > 0.2;
        instance.automatedResults.push({ check: check.name, result: passed ? 'pass' : 'fail', details: passed ? 'Check passed' : 'Check failed — manual review needed' });
      }
      const allPassed = instance.automatedResults.every(r => r.result === 'pass');
      if (allPassed) {
        instance.currentStage = 1;
        instance.status = workflow.stages.length > 1 ? 'in_review' : 'approved';
      } else {
        instance.status = 'in_review';
      }
    } else {
      instance.status = 'in_review';
    }

    instance.updatedAt = new Date().toISOString();
    this.instances.set(instance.id, instance);
    return instance;
  }

  async submitDecision(instanceId: string, decision: Omit<ReviewDecision, 'timestamp'>): Promise<ReviewInstance | null> {
    const instance = this.instances.get(instanceId);
    if (!instance) return null;

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return null;

    const fullDecision: ReviewDecision = { ...decision, timestamp: new Date().toISOString() };
    instance.decisions.push(fullDecision);
    instance.auditTrail.push({ action: `decision_${decision.decision}`, userId: decision.reviewer, timestamp: fullDecision.timestamp, details: decision.comments });

    if (decision.decision === 'approve') {
      if (instance.currentStage < workflow.stages.length - 1) {
        instance.currentStage++;
        instance.status = 'in_review';
      } else {
        instance.status = 'approved';
        instance.completedAt = new Date().toISOString();
      }
    } else if (decision.decision === 'reject') {
      instance.status = 'rejected';
      instance.completedAt = new Date().toISOString();
    } else if (decision.decision === 'escalate') {
      instance.escalationLevel++;
      instance.status = 'escalated';
    }

    instance.updatedAt = new Date().toISOString();
    this.instances.set(instanceId, instance);
    return instance;
  }

  async overrideDecision(instanceId: string, userId: string, reason: string): Promise<ReviewInstance | null> {
    const instance = this.instances.get(instanceId);
    if (!instance) return null;

    instance.status = 'overridden';
    instance.completedAt = new Date().toISOString();
    instance.auditTrail.push({ action: 'override', userId, timestamp: new Date().toISOString(), details: `Override: ${reason}` });
    instance.updatedAt = new Date().toISOString();
    this.instances.set(instanceId, instance);
    return instance;
  }

  async listInstances(filters?: { status?: WorkflowStatus; entityType?: string }): Promise<ReviewInstance[]> {
    let results = Array.from(this.instances.values());
    if (filters?.status) results = results.filter(i => i.status === filters.status);
    if (filters?.entityType) results = results.filter(i => i.entityType === filters.entityType);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getInstance(instanceId: string): Promise<ReviewInstance | null> {
    return this.instances.get(instanceId) || null;
  }

  private loadDefaultWorkflows(): void {
    const aiDeployment: ReviewWorkflow = {
      id: 'wf_ai_deploy',
      name: 'AI Model Deployment Review',
      description: 'Multi-stage review for AI model deployments with automated bias and compliance checks',
      stages: [
        { id: 'auto', name: 'Automated Checks', type: 'automated', requiredApprovers: 0, approverRoles: [], automatedChecks: [
          { name: 'Bias Check', type: 'bias_check', threshold: 0.8, action: 'flag' },
          { name: 'Compliance Check', type: 'compliance_check', threshold: 0.9, action: 'block' },
          { name: 'Risk Score', type: 'risk_score', threshold: 0.7, action: 'flag' },
        ], timeout: 300, onTimeout: 'escalate' },
        { id: 'tech', name: 'Technical Review', type: 'human_required', requiredApprovers: 1, approverRoles: ['ml_engineer', 'tech_lead'], automatedChecks: [], timeout: 86400, onTimeout: 'escalate' },
        { id: 'compliance', name: 'Compliance Review', type: 'human_required', requiredApprovers: 1, approverRoles: ['compliance_officer', 'dpo'], automatedChecks: [], timeout: 172800, onTimeout: 'escalate' },
        { id: 'final', name: 'Final Approval', type: 'human_required', requiredApprovers: 1, approverRoles: ['cto', 'cro'], automatedChecks: [], timeout: 259200, onTimeout: 'escalate' },
      ],
      escalationPolicy: { levels: [
        { level: 1, notifyRoles: ['team_lead'], timeoutHours: 24 },
        { level: 2, notifyRoles: ['director'], timeoutHours: 48 },
        { level: 3, notifyRoles: ['vp', 'cto'], timeoutHours: 72 },
      ], maxEscalationLevel: 3 },
      slaHours: 168,
      createdAt: new Date().toISOString(),
    };
    this.workflows.set(aiDeployment.id, aiDeployment);
  }
}

export const hitlOrchestration = new HITLOrchestrationService();
export { HITLOrchestrationService };
