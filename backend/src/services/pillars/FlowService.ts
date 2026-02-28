// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - THE FLOW SERVICE
// Workflow Automation - Business process automation
// Enterprise Platinum Intelligence - PostgreSQL Ready
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

const prisma = new PrismaClient();
// Note: FlowService uses runtime storage for workflow execution state
// Workflow definitions should be persisted via API, not seed data

// =============================================================================
// TYPES
// =============================================================================

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived';
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'awaiting_approval';
export type TriggerType = 'manual' | 'schedule' | 'event' | 'api' | 'condition';
export type StepType = 'action' | 'condition' | 'loop' | 'parallel' | 'approval' | 'delay' | 'webhook';

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  executionCount: number;
  successRate: number;
  avgDuration: number; // seconds
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  config: Record<string, unknown>;
  nextSteps?: string[];
  onError?: 'stop' | 'continue' | 'retry';
  retryCount?: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  organizationId: string;
  status: ExecutionStatus;
  triggeredBy: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  stepResults: StepResult[];
  error?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

export interface StepResult {
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  output?: unknown;
  error?: string;
}

export interface PendingApproval {
  id: string;
  executionId: string;
  workflowName: string;
  stepName: string;
  requestedBy: string;
  requestedAt: Date;
  approvers: string[];
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: string;
  decidedAt?: Date;
  reason?: string;
}

// =============================================================================
// THE FLOW SERVICE
// =============================================================================

export class FlowService extends BaseService {
  private workflowsStore: Map<string, Workflow> = new Map();
  private executionsStore: Map<string, WorkflowExecution> = new Map();
  private approvalsStore: Map<string, PendingApproval> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'flow-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });


    this.loadFromDB().catch(() => {});
  }

  async initialize(): Promise<void> {
    this.logger.info('The Flow service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Flow service shutting down...');
    this.workflowsStore.clear();
    this.executionsStore.clear();
    this.approvalsStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        activeWorkflows: Array.from(this.workflowsStore.values()).filter(w => w.status === 'active').length,
        runningExecutions: Array.from(this.executionsStore.values()).filter(e => e.status === 'running').length,
        pendingApprovals: Array.from(this.approvalsStore.values()).filter(a => a.status === 'pending').length,
      },
    };
  }

  // ===========================================================================
  // WORKFLOW MANAGEMENT
  // ===========================================================================

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successRate' | 'avgDuration'>): Promise<Workflow> {
    const id = `wf-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;

    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 100,
      avgDuration: 0,
    };

    this.workflowsStore.set(id, newWorkflow);
    return newWorkflow;
  }

  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    return this.workflowsStore.get(workflowId) || null;
  }

  async getWorkflows(organizationId: string, status?: WorkflowStatus): Promise<Workflow[]> {
    const workflows = Array.from(this.workflowsStore.values())
      .filter(w => w.organizationId === organizationId);
    return status ? workflows.filter(w => w.status === status) : workflows;
  }

  async updateWorkflowStatus(workflowId: string, status: WorkflowStatus): Promise<Workflow | null> {
    const workflow = this.workflowsStore.get(workflowId);
    if (!workflow) return null;

    workflow.status = status;
    workflow.updatedAt = new Date();
    this.workflowsStore.set(workflowId, workflow);
    return workflow;
  }

  // ===========================================================================
  // EXECUTION
  // ===========================================================================

  async executeWorkflow(workflowId: string, triggeredBy: string, input?: Record<string, unknown>): Promise<WorkflowExecution> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    if (workflow.status !== 'active') throw new Error('Workflow is not active');

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId,
      workflowName: workflow.name,
      organizationId: workflow.organizationId,
      status: 'running',
      triggeredBy,
      startedAt: new Date(),
      stepResults: workflow.steps.map(s => ({
        stepId: s.id,
        stepName: s.name,
        status: 'pending' as const,
      })),
      input,
    };

    this.executionsStore.set(execution.id, execution);

    // Deterministic execution (workflow engine orchestrated via service layer)
    this.runWorkflowSteps(execution, workflow);

    return execution;
  }

  private async runWorkflowSteps(execution: WorkflowExecution, workflow: Workflow): Promise<void> {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const context: Record<string, unknown> = { ...(execution.input || {}) };

    for (const stepResult of execution.stepResults) {
      if (stepResult.status === 'success' || stepResult.status === 'skipped') continue;

      stepResult.status = 'running';
      stepResult.startedAt = new Date();
      this.executionsStore.set(execution.id, execution);

      const step = workflow.steps.find(s => s.id === stepResult.stepId);
      if (!step) {
        stepResult.status = 'failed';
        stepResult.error = 'Step definition not found';
        stepResult.completedAt = new Date();
        continue;
      }

      try {
        const output = await this.executeStep(step, context, execution, workflow);
        
        if (output === '__AWAITING_APPROVAL__') {
          return; // Paused for approval
        }

        stepResult.status = output === '__SKIPPED__' ? 'skipped' : 'success';
        stepResult.completedAt = new Date();
        stepResult.output = output;

        // Store step output in context for downstream steps
        if (output && typeof output === 'object') {
          context[step.id] = output;
        }
      } catch (err: unknown) {
        stepResult.status = 'failed';
        stepResult.completedAt = new Date();
        stepResult.error = err instanceof Error ? err.message : String(err);

        // Handle error policy
        if (step.onError === 'continue') {
          continue;
        } else if (step.onError === 'retry' && (step.retryCount || 0) > 0) {
          let retried = false;
          for (let attempt = 1; attempt <= (step.retryCount || 1); attempt++) {
            await sleep(1000 * attempt); // Exponential backoff
            try {
              const retryOutput = await this.executeStep(step, context, execution, workflow);
              stepResult.status = 'success';
              stepResult.output = retryOutput;
              stepResult.error = undefined;
              retried = true;
              break;
            } catch { /* retry next */ }
          }
          if (retried) continue;
        }

        // Default: stop
        execution.status = 'failed';
        execution.error = `Step "${stepResult.stepName}" failed: ${stepResult.error}`;
        execution.completedAt = new Date();
        execution.duration = (execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000;
        this.executionsStore.set(execution.id, execution);
        this.updateWorkflowStats(workflow);
        return;
      }

      this.executionsStore.set(execution.id, execution);
    }

    execution.status = 'success';
    execution.completedAt = new Date();
    execution.duration = (execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000;
    execution.output = { completed: true, context };
    this.executionsStore.set(execution.id, execution);
    this.updateWorkflowStats(workflow);
  }

  // ===========================================================================
  // STEP TYPE EXECUTION ENGINE
  // ===========================================================================

  private async executeStep(
    step: WorkflowStep,
    context: Record<string, unknown>,
    execution: WorkflowExecution,
    workflow: Workflow,
  ): Promise<unknown> {
    switch (step.type) {
      case 'action':
        return this.executeActionStep(step, context);

      case 'condition':
        return this.executeConditionStep(step, context);

      case 'loop':
        return this.executeLoopStep(step, context);

      case 'parallel':
        return this.executeParallelStep(step, context);

      case 'delay':
        return this.executeDelayStep(step);

      case 'webhook':
        return this.executeWebhookStep(step, context);

      case 'approval':
        return this.executeApprovalStep(step, execution, workflow);

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeActionStep(step: WorkflowStep, context: Record<string, unknown>): Promise<unknown> {
    const actionType = step.config.action as string;
    const params = step.config.params as Record<string, unknown> || {};

    // Resolve template variables from context
    const resolved = this.resolveTemplateVars(params, context);

    switch (actionType) {
      case 'log':
        this.logger.info(`[Flow Action] ${resolved.message || 'Step executed'}`);
        return { logged: true, message: resolved.message };

      case 'set_variable':
        return { [resolved.name as string]: resolved.value };

      case 'transform':
        return this.applyTransform(resolved, context);

      case 'notify':
        return { notified: true, recipient: resolved.recipient, message: resolved.message };

      case 'http_request':
        // Placeholder for real HTTP calls (would use fetch in production)
        return { status: 200, body: {}, url: resolved.url };

      default:
        return { action: actionType, params: resolved, executed: true };
    }
  }

  private async executeConditionStep(step: WorkflowStep, context: Record<string, unknown>): Promise<unknown> {
    const field = step.config.field as string;
    const operator = step.config.operator as string;
    const value = step.config.value;
    const thenBranch = step.config.then as string;
    const elseBranch = step.config.else as string;

    // Resolve field value from context (supports dot notation)
    const fieldValue = this.resolveContextPath(context, field);
    let conditionMet = false;

    switch (operator) {
      case 'eq': case '==': conditionMet = fieldValue === value; break;
      case 'ne': case '!=': conditionMet = fieldValue !== value; break;
      case 'gt': case '>': conditionMet = Number(fieldValue) > Number(value); break;
      case 'gte': case '>=': conditionMet = Number(fieldValue) >= Number(value); break;
      case 'lt': case '<': conditionMet = Number(fieldValue) < Number(value); break;
      case 'lte': case '<=': conditionMet = Number(fieldValue) <= Number(value); break;
      case 'contains': conditionMet = String(fieldValue).includes(String(value)); break;
      case 'exists': conditionMet = fieldValue !== undefined && fieldValue !== null; break;
      case 'truthy': conditionMet = !!fieldValue; break;
      case 'in': conditionMet = Array.isArray(value) && value.includes(fieldValue); break;
      default: conditionMet = !!fieldValue;
    }

    return {
      conditionMet,
      field,
      operator,
      actualValue: fieldValue,
      expectedValue: value,
      branch: conditionMet ? (thenBranch || 'true') : (elseBranch || 'false'),
    };
  }

  private async executeLoopStep(step: WorkflowStep, context: Record<string, unknown>): Promise<unknown> {
    const collection = step.config.collection as string;
    const itemVar = (step.config.itemVariable as string) || 'item';
    const maxIterations = (step.config.maxIterations as number) || 1000;
    const bodyAction = step.config.body as Record<string, unknown>;

    const items = this.resolveContextPath(context, collection);
    if (!Array.isArray(items)) {
      return { error: `Collection "${collection}" is not an array`, iterations: 0 };
    }

    const results: unknown[] = [];
    const limit = Math.min(items.length, maxIterations);

    for (let i = 0; i < limit; i++) {
      const iterContext = { ...context, [itemVar]: items[i], __index: i, __length: items.length };
      
      if (bodyAction) {
        results.push(this.resolveTemplateVars(bodyAction, iterContext));
      } else {
        results.push({ index: i, item: items[i] });
      }
    }

    return { iterations: results.length, results, truncated: items.length > maxIterations };
  }

  private async executeParallelStep(step: WorkflowStep, context: Record<string, unknown>): Promise<unknown> {
    const branches = step.config.branches as Array<{ name: string; action: Record<string, unknown> }>;
    if (!Array.isArray(branches) || branches.length === 0) {
      return { error: 'No branches defined for parallel step' };
    }

    const results = await Promise.allSettled(
      branches.map(async (branch) => {
        const resolved = this.resolveTemplateVars(branch.action || {}, context);
        return { name: branch.name, output: resolved, status: 'success' };
      })
    );

    return {
      branches: results.map((r, i) => ({
        name: branches[i].name,
        status: r.status === 'fulfilled' ? 'success' : 'failed',
        output: r.status === 'fulfilled' ? r.value : (r as PromiseRejectedResult).reason?.message,
      })),
      allSucceeded: results.every(r => r.status === 'fulfilled'),
    };
  }

  private async executeDelayStep(step: WorkflowStep): Promise<unknown> {
    const durationMs = (step.config.durationMs as number) || 1000;
    const maxDelay = 300000; // 5 min max
    const actual = Math.min(durationMs, maxDelay);

    await new Promise(resolve => setTimeout(resolve, actual));

    return { delayed: true, requestedMs: durationMs, actualMs: actual };
  }

  private async executeWebhookStep(step: WorkflowStep, context: Record<string, unknown>): Promise<unknown> {
    const url = step.config.url as string;
    const method = (step.config.method as string) || 'POST';
    const headers = (step.config.headers as Record<string, string>) || {};
    const body = step.config.body as Record<string, unknown>;

    const resolvedBody = body ? this.resolveTemplateVars(body, context) : {};

    // In production, this would use fetch/axios
    this.logger.info(`[Flow Webhook] ${method} ${url}`);
    return {
      webhook: true,
      url,
      method,
      headers: Object.keys(headers),
      bodySize: JSON.stringify(resolvedBody).length,
      sentAt: new Date(),
    };
  }

  private async executeApprovalStep(
    step: WorkflowStep,
    execution: WorkflowExecution,
    workflow: Workflow,
  ): Promise<unknown> {
    execution.status = 'awaiting_approval';

    const approval: PendingApproval = {
      id: `approval-${Date.now()}`,
      executionId: execution.id,
      workflowName: workflow.name,
      stepName: step.name,
      requestedBy: execution.triggeredBy,
      requestedAt: new Date(),
      approvers: (step.config.approvers as string[]) || ['admin'],
      status: 'pending',
    };

    this.approvalsStore.set(approval.id, approval);
    this.executionsStore.set(execution.id, execution);
    return '__AWAITING_APPROVAL__';
  }

  // ===========================================================================
  // TEMPLATE & CONTEXT UTILITIES
  // ===========================================================================

  private resolveTemplateVars(obj: Record<string, unknown>, context: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const path = value.slice(2, -2).trim();
        result[key] = this.resolveContextPath(context, path);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.resolveTemplateVars(value as Record<string, unknown>, context);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private resolveContextPath(context: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = context;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  private applyTransform(params: Record<string, unknown>, context: Record<string, unknown>): unknown {
    const transformType = params.type as string;
    const input = this.resolveContextPath(context, params.input as string);

    switch (transformType) {
      case 'uppercase': return { result: String(input).toUpperCase() };
      case 'lowercase': return { result: String(input).toLowerCase() };
      case 'parse_json': return { result: typeof input === 'string' ? JSON.parse(input) : input };
      case 'stringify': return { result: JSON.stringify(input) };
      case 'math': {
        const op = params.operation as string;
        const a = Number(input);
        const b = Number(params.operand);
        switch (op) {
          case 'add': return { result: a + b };
          case 'subtract': return { result: a - b };
          case 'multiply': return { result: a * b };
          case 'divide': return { result: b !== 0 ? a / b : 0 };
          default: return { result: a };
        }
      }
      default: return { result: input };
    }
  }

  private updateWorkflowStats(workflow: Workflow): void {
    const executions = Array.from(this.executionsStore.values())
      .filter(e => e.workflowId === workflow.id && e.status !== 'running');
    
    workflow.executionCount = executions.length;
    workflow.successRate = executions.length > 0
      ? (executions.filter(e => e.status === 'success').length / executions.length) * 100
      : 100;
    workflow.avgDuration = executions.length > 0
      ? executions.reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length
      : 0;
    
    this.workflowsStore.set(workflow.id, workflow);
  }

  async getExecution(executionId: string): Promise<WorkflowExecution | null> {
    return this.executionsStore.get(executionId) || null;
  }

  async getExecutions(organizationId: string, limit: number = 50): Promise<WorkflowExecution[]> {
    return Array.from(this.executionsStore.values())
      .filter(e => e.organizationId === organizationId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  // ===========================================================================
  // APPROVALS
  // ===========================================================================

  async getPendingApprovals(organizationId: string): Promise<PendingApproval[]> {
    const orgExecutions = new Set(
      Array.from(this.executionsStore.values())
        .filter(e => e.organizationId === organizationId)
        .map(e => e.id)
    );

    return Array.from(this.approvalsStore.values())
      .filter(a => orgExecutions.has(a.executionId) && a.status === 'pending');
  }

  async processApproval(approvalId: string, approved: boolean, decidedBy: string, reason?: string): Promise<PendingApproval> {
    const approval = this.approvalsStore.get(approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.status = approved ? 'approved' : 'rejected';
    approval.decidedBy = decidedBy;
    approval.decidedAt = new Date();
    approval.reason = reason;
    this.approvalsStore.set(approvalId, approval);

    // Resume or fail execution
    const execution = this.executionsStore.get(approval.executionId);
    if (execution) {
      if (approved) {
        const workflow = await this.getWorkflow(execution.workflowId);
        if (workflow) {
          execution.status = 'running';
          // Continue execution from approval step
          this.runWorkflowSteps(execution, workflow);
        }
      } else {
        execution.status = 'cancelled';
        execution.completedAt = new Date();
        execution.error = `Approval rejected: ${reason || 'No reason provided'}`;
        this.executionsStore.set(execution.id, execution);
      }
    }

    return approval;
  }

  // ===========================================================================
  // STATS
  // ===========================================================================

  async getFlowStats(organizationId: string): Promise<{
    activeWorkflows: number;
    executionsToday: number;
    successRate: number;
    avgDuration: number;
    pendingApprovals: number;
  }> {
    const workflows = await this.getWorkflows(organizationId, 'active');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const executions = Array.from(this.executionsStore.values())
      .filter(e => e.organizationId === organizationId);
    const todayExecutions = executions.filter(e => e.startedAt >= today);
    const completedExecutions = executions.filter(e => e.status !== 'running' && e.status !== 'pending');

    return {
      activeWorkflows: workflows.length,
      executionsToday: todayExecutions.length,
      successRate: completedExecutions.length > 0
        ? (completedExecutions.filter(e => e.status === 'success').length / completedExecutions.length) * 100
        : 100,
      avgDuration: completedExecutions.length > 0
        ? completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) / completedExecutions.length
        : 0,
      pendingApprovals: (await this.getPendingApprovals(organizationId)).length,
    };
  }

  // No seed method - Enterprise Platinum standard
  // Workflows are created through real API operations

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getWorkflowStats(organizationId: string): Promise<any> {
    const workflows = await this.getWorkflows(organizationId);
    const executions = await this.getExecutions(organizationId);
    
    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(e => e.status === 'success').length,
      failedExecutions: executions.filter(e => e.status === 'failed').length,
      runningExecutions: executions.filter(e => e.status === 'running').length,
      avgDuration: executions.length > 0 
        ? executions.reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length 
        : 0,
    };
  }

  // ===========================================================================
  // DASHBOARD & HEALTH (Service-level)
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    workflows: { total: number; active: number; paused: number; draft: number; archived: number };
    executions: { total: number; running: number; success: number; failed: number; cancelled: number; awaitingApproval: number };
    performance: { successRate: number; avgDuration: number; executionsToday: number };
    approvals: { pending: number; approved: number; rejected: number };
    stepTypeUsage: Record<string, number>;
    recentExecutions: Array<{ id: string; workflowName: string; status: string; startedAt: Date; duration: number | undefined }>;
    insights: string[];
  }> {
    const workflows = Array.from(this.workflowsStore.values());
    const executions = Array.from(this.executionsStore.values());
    const approvals = Array.from(this.approvalsStore.values());
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const completed = executions.filter(e => e.status !== 'running' && e.status !== 'pending');

    const stepTypeUsage: Record<string, number> = {};
    for (const w of workflows) {
      for (const s of w.steps) {
        stepTypeUsage[s.type] = (stepTypeUsage[s.type] || 0) + 1;
      }
    }

    const recentExecutions = executions
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 10)
      .map(e => ({ id: e.id, workflowName: e.workflowName, status: e.status, startedAt: e.startedAt, duration: e.duration }));

    const insights: string[] = [];
    const failedRecent = executions.filter(e => e.status === 'failed' && e.startedAt >= today).length;
    if (failedRecent > 0) insights.push(`${failedRecent} workflow execution(s) failed today`);
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    if (pendingApprovals > 0) insights.push(`${pendingApprovals} approval(s) awaiting decision`);
    const lowSuccess = workflows.filter(w => w.successRate < 80 && w.executionCount > 0);
    if (lowSuccess.length > 0) insights.push(`${lowSuccess.length} workflow(s) with success rate below 80%`);
    if (insights.length === 0) insights.push('All workflows operating normally');

    return {
      serviceName: 'Flow',
      status: executions.some(e => e.status === 'running') ? 'executing' : 'idle',
      workflows: {
        total: workflows.length,
        active: workflows.filter(w => w.status === 'active').length,
        paused: workflows.filter(w => w.status === 'paused').length,
        draft: workflows.filter(w => w.status === 'draft').length,
        archived: workflows.filter(w => w.status === 'archived').length,
      },
      executions: {
        total: executions.length,
        running: executions.filter(e => e.status === 'running').length,
        success: executions.filter(e => e.status === 'success').length,
        failed: executions.filter(e => e.status === 'failed').length,
        cancelled: executions.filter(e => e.status === 'cancelled').length,
        awaitingApproval: executions.filter(e => e.status === 'awaiting_approval').length,
      },
      performance: {
        successRate: completed.length > 0
          ? Math.round((completed.filter(e => e.status === 'success').length / completed.length) * 100)
          : 100,
        avgDuration: completed.length > 0
          ? Math.round(completed.reduce((sum, e) => sum + (e.duration || 0), 0) / completed.length * 100) / 100
          : 0,
        executionsToday: executions.filter(e => e.startedAt >= today).length,
      },
      approvals: {
        pending: pendingApprovals,
        approved: approvals.filter(a => a.status === 'approved').length,
        rejected: approvals.filter(a => a.status === 'rejected').length,
      },
      stepTypeUsage,
      recentExecutions,
      insights,
    };
  }

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'Flow',
      timestamp: new Date(),
      details: {
        uptime: process.uptime(),
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576),
        workflows: this.workflowsStore.size,
        executions: this.executionsStore.size,
        pendingApprovals: Array.from(this.approvalsStore.values()).filter(a => a.status === 'pending').length,
      },
    };
  }

  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Flow', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.workflowsStore.has(d.id)) this.workflowsStore.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'Flow', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.executionsStore.has(d.id)) this.executionsStore.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'Flow', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.approvalsStore.has(d.id)) this.approvalsStore.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) this.logger.info(`[FlowService] Restored ${restored} records from database`);


    } catch (err) {


      this.logger.warn(`[FlowService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const flowService = new FlowService();
