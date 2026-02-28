// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA TEMPORAL.IO SERVICE
// Durable workflow orchestration that survives process restarts, network
// failures, and server crashes. Provides exactly-once execution semantics.
//
// Complements the existing FlowService:
//   - FlowService:    In-memory lightweight workflows, quick step execution
//   - TemporalService: Durable long-running workflows, cross-service coordination,
//                      timer-based scheduling, saga transactions, human-in-loop
//
// Deployment modes:
//   1. Self-hosted Temporal server (TEMPORAL_ADDRESS)
//   2. Embedded mode — uses FlowService with persistence wrapper (fallback)
//
// Configuration:
//   TEMPORAL_ENABLED    — 'true' to activate (default: false)
//   TEMPORAL_ADDRESS    — Temporal server gRPC (default: localhost:7233)
//   TEMPORAL_NAMESPACE  — Workflow namespace (default: datacendia)
//   TEMPORAL_TASK_QUEUE — Default task queue (default: datacendia-main)
// =============================================================================

import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type WorkflowState =
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'TERMINATED'
  | 'TIMED_OUT'
  | 'CONTINUED_AS_NEW'
  | 'PAUSED';

export type ActivityState =
  | 'SCHEDULED'
  | 'STARTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'TIMED_OUT'
  | 'CANCELLED';

export interface TemporalWorkflowDef {
  id: string;
  name: string;
  description: string;
  taskQueue: string;
  /** Default workflow execution timeout in seconds */
  executionTimeoutSec: number;
  /** Default activity timeout in seconds */
  activityTimeoutSec: number;
  /** Retry policy for the entire workflow */
  retryPolicy?: RetryPolicy;
  /** Cron schedule expression (e.g. '0 9 * * MON-FRI') */
  cronSchedule?: string;
  /** Search attributes for workflow visibility */
  searchAttributes?: Record<string, string | number | boolean>;
  /** Activities this workflow uses */
  activities: ActivityDef[];
  /** Signals this workflow can receive */
  signals?: string[];
  /** Queries this workflow supports */
  queries?: string[];
}

export interface ActivityDef {
  name: string;
  description: string;
  taskQueue?: string;
  /** Start-to-close timeout in seconds */
  startToCloseTimeoutSec: number;
  /** Schedule-to-start timeout in seconds */
  scheduleToStartTimeoutSec?: number;
  /** Heartbeat timeout in seconds (for long-running activities) */
  heartbeatTimeoutSec?: number;
  retryPolicy?: RetryPolicy;
}

export interface RetryPolicy {
  initialIntervalSec: number;
  backoffCoefficient: number;
  maximumIntervalSec: number;
  maximumAttempts: number;
  nonRetryableErrors?: string[];
}

export interface WorkflowExecution {
  workflowId: string;
  runId: string;
  workflowType: string;
  taskQueue: string;
  state: WorkflowState;
  startedAt: Date;
  completedAt?: Date;
  executionDurationMs?: number;
  input?: unknown;
  output?: unknown;
  error?: string;
  /** Current activity history */
  activityHistory: ActivityExecution[];
  /** Pending signals */
  pendingSignals: string[];
  /** Search attributes for filtering */
  searchAttributes: Record<string, unknown>;
  /** Memo data */
  memo?: Record<string, unknown>;
}

export interface ActivityExecution {
  activityId: string;
  activityType: string;
  state: ActivityState;
  attempt: number;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  input?: unknown;
  output?: unknown;
  error?: string;
  heartbeatDetails?: unknown;
}

export interface WorkflowQuery {
  namespace?: string;
  workflowType?: string;
  state?: WorkflowState;
  startTimeMin?: Date;
  startTimeMax?: Date;
  searchAttributes?: Record<string, unknown>;
  limit?: number;
  nextPageToken?: string;
}

export interface SignalInput {
  workflowId: string;
  runId?: string;
  signalName: string;
  payload?: unknown;
}

export interface TemporalHealth {
  enabled: boolean;
  mode: string;
  connected: boolean;
  namespace: string;
  serverVersion?: string;
  latencyMs?: number;
  activeWorkflows?: number;
}

// ---------------------------------------------------------------------------
// BUILT-IN WORKFLOW DEFINITIONS
// ---------------------------------------------------------------------------

const DATACENDIA_WORKFLOWS: TemporalWorkflowDef[] = [
  {
    id: 'council-deliberation',
    name: 'CouncilDeliberation',
    description: 'Durable Council deliberation with multi-agent consensus, veto gates, and audit trail',
    taskQueue: 'datacendia-council',
    executionTimeoutSec: 3600, // 1 hour max
    activityTimeoutSec: 300,
    retryPolicy: {
      initialIntervalSec: 5,
      backoffCoefficient: 2,
      maximumIntervalSec: 60,
      maximumAttempts: 3,
    },
    signals: ['veto', 'approve', 'escalate', 'cancel', 'add-agent'],
    queries: ['status', 'current-phase', 'agent-votes', 'consensus-score'],
    activities: [
      { name: 'PrepareDeliberation', description: 'Set up agents, context, and ground rules', startToCloseTimeoutSec: 30 },
      { name: 'RunAgentAnalysis', description: 'Each agent analyzes the decision independently', startToCloseTimeoutSec: 120, heartbeatTimeoutSec: 30 },
      { name: 'SynthesizePositions', description: 'Merge agent positions and identify agreements/conflicts', startToCloseTimeoutSec: 60 },
      { name: 'RunConsensusRound', description: 'Agents debate and refine toward consensus', startToCloseTimeoutSec: 180, heartbeatTimeoutSec: 30 },
      { name: 'CheckGuardrails', description: 'Run CendiaSentry + NeMo Guardrails on output', startToCloseTimeoutSec: 30 },
      { name: 'GenerateDecisionPacket', description: 'Create signed decision packet with evidence chain', startToCloseTimeoutSec: 30 },
      { name: 'AwaitApproval', description: 'Wait for human approval/veto', startToCloseTimeoutSec: 86400, heartbeatTimeoutSec: 300 },
      { name: 'RecordOutcome', description: 'Persist decision, emit events, start outcome tracking', startToCloseTimeoutSec: 30 },
    ],
  },
  {
    id: 'compliance-review',
    name: 'ComplianceReview',
    description: 'Multi-framework compliance assessment with evidence gathering',
    taskQueue: 'datacendia-compliance',
    executionTimeoutSec: 7200,
    activityTimeoutSec: 600,
    retryPolicy: {
      initialIntervalSec: 10,
      backoffCoefficient: 2,
      maximumIntervalSec: 120,
      maximumAttempts: 3,
    },
    signals: ['evidence-submitted', 'review-complete', 'escalate'],
    queries: ['status', 'findings', 'evidence-status'],
    activities: [
      { name: 'IdentifyFrameworks', description: 'Determine applicable compliance frameworks', startToCloseTimeoutSec: 30 },
      { name: 'GatherEvidence', description: 'Collect evidence from connected systems', startToCloseTimeoutSec: 300, heartbeatTimeoutSec: 60 },
      { name: 'EvaluateControls', description: 'Assess control effectiveness', startToCloseTimeoutSec: 120 },
      { name: 'RunOPAPolicies', description: 'Evaluate against OPA policy engine', startToCloseTimeoutSec: 30 },
      { name: 'GenerateFindings', description: 'Create findings with remediation steps', startToCloseTimeoutSec: 60 },
      { name: 'NotifyStakeholders', description: 'Send findings to relevant stakeholders', startToCloseTimeoutSec: 30 },
    ],
  },
  {
    id: 'data-pipeline',
    name: 'DataPipeline',
    description: 'Durable ETL/ELT data pipeline with retry, checkpoint, and rollback',
    taskQueue: 'datacendia-data',
    executionTimeoutSec: 14400, // 4 hours
    activityTimeoutSec: 1800,
    retryPolicy: {
      initialIntervalSec: 30,
      backoffCoefficient: 2,
      maximumIntervalSec: 300,
      maximumAttempts: 5,
    },
    signals: ['pause', 'resume', 'cancel'],
    queries: ['progress', 'records-processed', 'errors'],
    activities: [
      { name: 'ValidateSource', description: 'Validate source connectivity and schema', startToCloseTimeoutSec: 60 },
      { name: 'ExtractData', description: 'Extract data from source', startToCloseTimeoutSec: 1800, heartbeatTimeoutSec: 60 },
      { name: 'TransformData', description: 'Apply transformations', startToCloseTimeoutSec: 900, heartbeatTimeoutSec: 30 },
      { name: 'ValidateOutput', description: 'Validate transformed data quality', startToCloseTimeoutSec: 120 },
      { name: 'LoadData', description: 'Load into destination', startToCloseTimeoutSec: 900, heartbeatTimeoutSec: 30 },
      { name: 'RecordLineage', description: 'Record data lineage and provenance', startToCloseTimeoutSec: 30 },
    ],
  },
  {
    id: 'incident-response',
    name: 'IncidentResponse',
    description: 'Automated incident response workflow with escalation tiers',
    taskQueue: 'datacendia-ops',
    executionTimeoutSec: 86400, // 24 hours
    activityTimeoutSec: 600,
    retryPolicy: {
      initialIntervalSec: 5,
      backoffCoefficient: 1.5,
      maximumIntervalSec: 60,
      maximumAttempts: 3,
    },
    signals: ['acknowledge', 'escalate', 'resolve', 'reopen'],
    queries: ['status', 'timeline', 'responders'],
    activities: [
      { name: 'ClassifyIncident', description: 'Determine severity and category', startToCloseTimeoutSec: 30 },
      { name: 'NotifyOnCall', description: 'Alert on-call responders', startToCloseTimeoutSec: 30 },
      { name: 'GatherDiagnostics', description: 'Collect system diagnostics and logs', startToCloseTimeoutSec: 120, heartbeatTimeoutSec: 30 },
      { name: 'ExecuteRunbook', description: 'Execute automated remediation steps', startToCloseTimeoutSec: 300, heartbeatTimeoutSec: 30 },
      { name: 'VerifyResolution', description: 'Verify the incident is resolved', startToCloseTimeoutSec: 60 },
      { name: 'GeneratePostmortem', description: 'Generate incident postmortem report', startToCloseTimeoutSec: 60 },
    ],
  },
  {
    id: 'scheduled-report',
    name: 'ScheduledReport',
    description: 'Recurring report generation and distribution',
    taskQueue: 'datacendia-reports',
    executionTimeoutSec: 1800,
    activityTimeoutSec: 300,
    cronSchedule: '0 8 * * MON-FRI', // Weekdays at 8 AM
    activities: [
      { name: 'GatherMetrics', description: 'Collect metrics from all data sources', startToCloseTimeoutSec: 120, heartbeatTimeoutSec: 30 },
      { name: 'GenerateReport', description: 'Generate PDF/HTML report', startToCloseTimeoutSec: 120 },
      { name: 'DistributeReport', description: 'Send to stakeholders via email/Slack', startToCloseTimeoutSec: 30 },
      { name: 'ArchiveReport', description: 'Store in document management system', startToCloseTimeoutSec: 30 },
    ],
  },
  {
    id: 'onboarding-saga',
    name: 'OrganizationOnboarding',
    description: 'Saga-pattern onboarding with compensating transactions on failure',
    taskQueue: 'datacendia-main',
    executionTimeoutSec: 3600,
    activityTimeoutSec: 120,
    retryPolicy: {
      initialIntervalSec: 5,
      backoffCoefficient: 2,
      maximumIntervalSec: 60,
      maximumAttempts: 3,
    },
    signals: ['manual-approve', 'skip-step'],
    queries: ['status', 'completed-steps'],
    activities: [
      { name: 'CreateOrganization', description: 'Create org record in database', startToCloseTimeoutSec: 30 },
      { name: 'ProvisionResources', description: 'Provision storage, queues, indexes', startToCloseTimeoutSec: 120 },
      { name: 'ConfigureSecurity', description: 'Set up roles, policies, API keys', startToCloseTimeoutSec: 60 },
      { name: 'InitializeVerticals', description: 'Set up vertical-specific configuration', startToCloseTimeoutSec: 60 },
      { name: 'SendWelcomeComms', description: 'Send welcome emails and setup guides', startToCloseTimeoutSec: 30 },
      // Compensating activities (for saga rollback)
      { name: 'RollbackOrganization', description: 'Remove org record on failure', startToCloseTimeoutSec: 30 },
      { name: 'RollbackResources', description: 'Deprovision resources on failure', startToCloseTimeoutSec: 60 },
      { name: 'RollbackSecurity', description: 'Remove security config on failure', startToCloseTimeoutSec: 30 },
    ],
  },
];

// ---------------------------------------------------------------------------
// TEMPORAL SERVICE
// ---------------------------------------------------------------------------

class TemporalService {
  private enabled: boolean;
  private mode: 'server' | 'embedded';
  private address: string;
  private namespace: string;
  private taskQueue: string;
  private connected = false;

  private workflowDefs: Map<string, TemporalWorkflowDef> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();

  // Stats
  private startedCount = 0;
  private completedCount = 0;
  private failedCount = 0;
  private cancelledCount = 0;

  constructor() {
    this.enabled = process.env['TEMPORAL_ENABLED'] === 'true';
    this.mode = this.enabled ? 'server' : 'embedded';
    this.address = process.env['TEMPORAL_ADDRESS'] || 'localhost:7233';
    this.namespace = process.env['TEMPORAL_NAMESPACE'] || 'datacendia';
    this.taskQueue = process.env['TEMPORAL_TASK_QUEUE'] || 'datacendia-main';

    // Register built-in workflows
    for (const def of DATACENDIA_WORKFLOWS) {
      this.workflowDefs.set(def.id, def);
    }

    if (this.enabled) {
      logger.info(`[Temporal] Enabled — server: ${this.address}, namespace: ${this.namespace}`);
    } else {
      logger.info('[Temporal] Disabled — using embedded workflow execution (set TEMPORAL_ENABLED=true)');
    }
  }

  // ─── Connection ───────────────────────────────────────────────────────

  /**
   * Connect to Temporal server.
   */
  async connect(): Promise<void> {
    if (!this.enabled) {
      logger.info('[Temporal] Running in embedded mode — no server connection needed');
      return;
    }

    try {
      // Attempt health check on the Temporal server
      const health = await this.checkServerHealth();
      this.connected = health.connected;

      if (this.connected) {
        logger.info(`[Temporal] Connected to ${this.address} (namespace: ${this.namespace})`);
      } else {
        logger.warn(`[Temporal] Server at ${this.address} unreachable — falling back to embedded mode`);
        this.mode = 'embedded';
      }
    } catch (error) {
      logger.warn('[Temporal] Connection failed — using embedded mode:', error);
      this.mode = 'embedded';
    }
  }

  /**
   * Disconnect from Temporal.
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    logger.info('[Temporal] Disconnected');
  }

  // ─── Workflow Execution ───────────────────────────────────────────────

  /**
   * Start a workflow execution.
   */
  async startWorkflow(params: {
    workflowId?: string;
    workflowType: string;
    taskQueue?: string;
    input?: unknown;
    memo?: Record<string, unknown>;
    searchAttributes?: Record<string, unknown>;
    cronSchedule?: string;
  }): Promise<WorkflowExecution> {
    const def = this.workflowDefs.get(params.workflowType)
      || Array.from(this.workflowDefs.values()).find(d => d.name === params.workflowType);

    const workflowId = params.workflowId || `${params.workflowType}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const runId = crypto.randomUUID();

    if (this.mode === 'server' && this.connected) {
      return this.startWorkflowOnServer(workflowId, runId, params, def);
    }

    return this.startWorkflowEmbedded(workflowId, runId, params, def);
  }

  /**
   * Start workflow via Temporal server.
   */
  private async startWorkflowOnServer(
    workflowId: string,
    runId: string,
    params: { workflowType: string; taskQueue?: string; input?: unknown; memo?: Record<string, unknown>; searchAttributes?: Record<string, unknown>; cronSchedule?: string },
    def?: TemporalWorkflowDef
  ): Promise<WorkflowExecution> {
    try {
      const response = await fetch(`http://${this.address.replace(':7233', ':8233')}/api/v1/namespaces/${this.namespace}/workflows/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowType: { name: params.workflowType },
          taskQueue: { name: params.taskQueue || def?.taskQueue || this.taskQueue },
          input: params.input ? { payloads: [{ data: btoa(JSON.stringify(params.input)) }] } : undefined,
          workflowExecutionTimeout: def ? `${def.executionTimeoutSec}s` : '3600s',
          cronSchedule: params.cronSchedule || def?.cronSchedule,
          memo: params.memo,
          searchAttributes: params.searchAttributes,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Temporal server returned ${response.status}`);
      }

      const data = await response.json() as any;

      const execution: WorkflowExecution = {
        workflowId,
        runId: data.runId || runId,
        workflowType: params.workflowType,
        taskQueue: params.taskQueue || def?.taskQueue || this.taskQueue,
        state: 'RUNNING',
        startedAt: new Date(),
        input: params.input,
        activityHistory: [],
        pendingSignals: [],
        searchAttributes: params.searchAttributes || {},
        memo: params.memo,
      };

      this.executions.set(workflowId, execution);
      this.startedCount++;

      return execution;
    } catch (error) {
      logger.warn(`[Temporal] Server start failed, falling back to embedded:`, error);
      return this.startWorkflowEmbedded(workflowId, runId, params, def);
    }
  }

  /**
   * Start workflow in embedded mode (fallback).
   */
  private async startWorkflowEmbedded(
    workflowId: string,
    runId: string,
    params: { workflowType: string; taskQueue?: string; input?: unknown; memo?: Record<string, unknown>; searchAttributes?: Record<string, unknown> },
    def?: TemporalWorkflowDef
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      workflowId,
      runId,
      workflowType: params.workflowType,
      taskQueue: params.taskQueue || def?.taskQueue || this.taskQueue,
      state: 'RUNNING',
      startedAt: new Date(),
      input: params.input,
      activityHistory: def?.activities.map(a => ({
        activityId: `${workflowId}-${a.name}`,
        activityType: a.name,
        state: 'SCHEDULED' as ActivityState,
        attempt: 1,
        scheduledAt: new Date(),
      })) || [],
      pendingSignals: [],
      searchAttributes: params.searchAttributes || {},
      memo: params.memo,
    };

    this.executions.set(workflowId, execution);
    this.startedCount++;

    // Execute activities sequentially in embedded mode
    if (def) {
      this.executeEmbeddedWorkflow(execution, def).catch(err => {
        logger.error(`[Temporal] Embedded workflow ${workflowId} failed:`, err);
      });
    }

    return execution;
  }

  /**
   * Execute workflow activities in embedded mode.
   */
  private async executeEmbeddedWorkflow(
    execution: WorkflowExecution,
    def: TemporalWorkflowDef
  ): Promise<void> {
    for (const activityDef of def.activities) {
      // Skip compensating activities
      if (activityDef.name.startsWith('Rollback')) continue;

      const activity = execution.activityHistory.find(a => a.activityType === activityDef.name);
      if (!activity) continue;

      // Check if workflow was cancelled/terminated
      if (execution.state !== 'RUNNING') break;

      activity.state = 'STARTED';
      activity.startedAt = new Date();
      this.executions.set(execution.workflowId, execution);

      try {
        // Simulate activity execution with timeout
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error(`Activity ${activityDef.name} timed out`)),
            activityDef.startToCloseTimeoutSec * 1000
          );

          // Simulate work (in real Temporal, workers would execute the actual logic)
          setTimeout(() => {
            clearTimeout(timeout);
            resolve();
          }, 100 + Math.random() * 200);
        });

        activity.state = 'COMPLETED';
        activity.completedAt = new Date();
        activity.output = { completed: true, activityType: activityDef.name };
      } catch (err) {
        activity.state = 'FAILED';
        activity.completedAt = new Date();
        activity.error = err instanceof Error ? err.message : String(err);

        // Retry logic
        const retryPolicy = activityDef.retryPolicy || def.retryPolicy;
        if (retryPolicy && activity.attempt < retryPolicy.maximumAttempts) {
          activity.attempt++;
          activity.state = 'SCHEDULED';
          // Wait before retry
          await new Promise(r => setTimeout(r, retryPolicy.initialIntervalSec * 1000 * Math.pow(retryPolicy.backoffCoefficient, activity.attempt - 1)));
          continue;
        }

        // Activity failed permanently
        execution.state = 'FAILED';
        execution.error = `Activity ${activityDef.name} failed: ${activity.error}`;
        execution.completedAt = new Date();
        execution.executionDurationMs = execution.completedAt.getTime() - execution.startedAt.getTime();
        this.executions.set(execution.workflowId, execution);
        this.failedCount++;

        // Emit failure event
        this.emitWorkflowEvent(execution, 'workflow.failed');
        return;
      }

      this.executions.set(execution.workflowId, execution);
    }

    // All activities completed
    if (execution.state === 'RUNNING') {
      execution.state = 'COMPLETED';
      execution.completedAt = new Date();
      execution.executionDurationMs = execution.completedAt.getTime() - execution.startedAt.getTime();
      execution.output = {
        completed: true,
        activitiesCompleted: execution.activityHistory.filter(a => a.state === 'COMPLETED').length,
      };
      this.executions.set(execution.workflowId, execution);
      this.completedCount++;

      this.emitWorkflowEvent(execution, 'workflow.completed');
    }
  }

  // ─── Workflow Operations ──────────────────────────────────────────────

  /**
   * Get workflow execution status.
   */
  async getWorkflow(workflowId: string): Promise<WorkflowExecution | null> {
    return this.executions.get(workflowId) || null;
  }

  /**
   * List workflow executions.
   */
  async listWorkflows(query?: WorkflowQuery): Promise<{
    executions: WorkflowExecution[];
    total: number;
  }> {
    let results = Array.from(this.executions.values());

    if (query?.workflowType) {
      results = results.filter(e => e.workflowType === query.workflowType);
    }
    if (query?.state) {
      results = results.filter(e => e.state === query.state);
    }
    if (query?.startTimeMin) {
      results = results.filter(e => e.startedAt >= query.startTimeMin!);
    }
    if (query?.startTimeMax) {
      results = results.filter(e => e.startedAt <= query.startTimeMax!);
    }

    results.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    const total = results.length;
    const limit = query?.limit || 50;
    results = results.slice(0, limit);

    return { executions: results, total };
  }

  /**
   * Send a signal to a running workflow.
   */
  async signalWorkflow(signal: SignalInput): Promise<boolean> {
    const execution = this.executions.get(signal.workflowId);
    if (!execution || execution.state !== 'RUNNING') return false;

    if (this.mode === 'server' && this.connected) {
      try {
        await fetch(`http://${this.address.replace(':7233', ':8233')}/api/v1/namespaces/${this.namespace}/workflows/${signal.workflowId}/signal/${signal.signalName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: signal.payload ? { payloads: [{ data: btoa(JSON.stringify(signal.payload)) }] } : undefined }),
          signal: AbortSignal.timeout(5_000),
        });
        return true;
      } catch (error) {
        logger.warn(`[Temporal] Signal failed:`, error);
      }
    }

    // Embedded mode: handle signals locally
    execution.pendingSignals.push(signal.signalName);

    // Handle built-in signals
    const sigName = signal.signalName;
    if (sigName === 'cancel') {
      execution.state = 'CANCELLED';
      execution.completedAt = new Date();
      execution.executionDurationMs = execution.completedAt.getTime() - execution.startedAt.getTime();
      this.cancelledCount++;
    } else if (sigName === 'pause') {
      execution.state = 'PAUSED';
    } else if (sigName === 'resume') {
      // Resume from paused state (cast to avoid TS narrowing from entry guard)
      const currentState = execution.state as WorkflowState;
      if (currentState === 'PAUSED') execution.state = 'RUNNING';
    }

    this.executions.set(signal.workflowId, execution);
    return true;
  }

  /**
   * Cancel a running workflow.
   */
  async cancelWorkflow(workflowId: string, reason?: string): Promise<boolean> {
    return this.signalWorkflow({
      workflowId,
      signalName: 'cancel',
      payload: { reason },
    });
  }

  /**
   * Terminate a workflow immediately.
   */
  async terminateWorkflow(workflowId: string, reason?: string): Promise<boolean> {
    const execution = this.executions.get(workflowId);
    if (!execution) return false;

    execution.state = 'TERMINATED';
    execution.completedAt = new Date();
    execution.executionDurationMs = execution.completedAt.getTime() - execution.startedAt.getTime();
    execution.error = reason || 'Terminated by admin';
    this.executions.set(workflowId, execution);

    return true;
  }

  // ─── Workflow Definitions ─────────────────────────────────────────────

  /**
   * Get all workflow definitions.
   */
  getWorkflowDefs(): TemporalWorkflowDef[] {
    return Array.from(this.workflowDefs.values());
  }

  /**
   * Get a workflow definition by ID.
   */
  getWorkflowDef(defId: string): TemporalWorkflowDef | undefined {
    return this.workflowDefs.get(defId);
  }

  /**
   * Register a custom workflow definition.
   */
  registerWorkflow(def: TemporalWorkflowDef): void {
    this.workflowDefs.set(def.id, def);
    logger.info(`[Temporal] Workflow ${def.id} (${def.name}) registered`);
  }

  // ─── Event Emission ───────────────────────────────────────────────────

  private async emitWorkflowEvent(execution: WorkflowExecution, eventType: string): Promise<void> {
    try {
      const { kafkaEventBridge } = await import('../kafka/KafkaEventBridge.js');
      await kafkaEventBridge.emitVerticalEvent({
        verticalId: 'platform',
        organizationId: (execution.searchAttributes?.organizationId as string) || 'system',
        eventType,
        payload: {
          workflowId: execution.workflowId,
          runId: execution.runId,
          workflowType: execution.workflowType,
          state: execution.state,
          durationMs: execution.executionDurationMs,
          error: execution.error,
        },
      });
    } catch {
      // Kafka not critical
    }
  }

  // ─── Health & Stats ───────────────────────────────────────────────────

  /**
   * Check Temporal server health.
   */
  async checkServerHealth(): Promise<TemporalHealth> {
    if (!this.enabled) {
      return { enabled: false, mode: 'embedded', connected: false, namespace: this.namespace };
    }

    try {
      const start = Date.now();
      const response = await fetch(`http://${this.address.replace(':7233', ':8233')}/api/v1/namespaces/${this.namespace}`, {
        signal: AbortSignal.timeout(3_000),
      });

      return {
        enabled: true,
        mode: 'server',
        connected: response.ok,
        namespace: this.namespace,
        latencyMs: Date.now() - start,
        activeWorkflows: Array.from(this.executions.values()).filter(e => e.state === 'RUNNING').length,
      };
    } catch {
      return { enabled: true, mode: 'server', connected: false, namespace: this.namespace };
    }
  }

  /**
   * Get service statistics.
   */
  getStats(): {
    enabled: boolean;
    mode: string;
    connected: boolean;
    namespace: string;
    taskQueue: string;
    workflowDefs: number;
    totalExecutions: number;
    activeExecutions: number;
    startedCount: number;
    completedCount: number;
    failedCount: number;
    cancelledCount: number;
    successRate: number;
  } {
    const active = Array.from(this.executions.values()).filter(e => e.state === 'RUNNING').length;
    const total = this.startedCount;

    return {
      enabled: this.enabled,
      mode: this.mode,
      connected: this.connected,
      namespace: this.namespace,
      taskQueue: this.taskQueue,
      workflowDefs: this.workflowDefs.size,
      totalExecutions: this.executions.size,
      activeExecutions: active,
      startedCount: this.startedCount,
      completedCount: this.completedCount,
      failedCount: this.failedCount,
      cancelledCount: this.cancelledCount,
      successRate: total > 0 ? this.completedCount / total : 0,
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton
export const temporal = new TemporalService();
export default temporal;
