/**
 * Workflow Persistence Service
 *
 * CRUD operations for workflow definitions using localStorage.
 * Supports create, read, update, delete, list, duplicate, and run logging.
 *
 * @exports WorkflowPersistenceService
 * @module services/WorkflowPersistenceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import type { Workflow, WorkflowListItem, WorkflowRunLog } from '../types/workflow';

const STORAGE_PREFIX = 'datacendia_workflow_';
const LIST_KEY = `${STORAGE_PREFIX}list`;
const RUN_LOG_KEY = `${STORAGE_PREFIX}run_logs`;

function generateId(): string {
  return `wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getList(): WorkflowListItem[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(list: WorkflowListItem[]): void {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

function toListItem(w: Workflow): WorkflowListItem {
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    stepCount: w.steps.length,
    status: w.status,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
    lastRunAt: w.lastRunAt,
    runCount: w.runCount,
    tags: w.tags,
  };
}

export const WorkflowPersistenceService = {
  // ── List ─────────────────────────────────────────────────────────────────
  listWorkflows(): WorkflowListItem[] {
    return getList().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // ── Get ──────────────────────────────────────────────────────────────────
  getWorkflow(id: string): Workflow | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // ── Create ───────────────────────────────────────────────────────────────
  createWorkflow(partial?: Partial<Workflow>): Workflow {
    const now = new Date().toISOString();
    const workflow: Workflow = {
      id: generateId(),
      name: partial?.name || 'Untitled Workflow',
      description: partial?.description || '',
      steps: partial?.steps || [],
      connections: partial?.connections || [],
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      status: 'draft',
      tags: partial?.tags || [],
    };
    localStorage.setItem(`${STORAGE_PREFIX}${workflow.id}`, JSON.stringify(workflow));
    const list = getList();
    list.push(toListItem(workflow));
    saveList(list);
    return workflow;
  },

  // ── Update ───────────────────────────────────────────────────────────────
  updateWorkflow(workflow: Workflow): Workflow {
    workflow.updatedAt = new Date().toISOString();
    if (workflow.steps.length > 0 && workflow.status === 'draft') {
      workflow.status = 'ready';
    }
    localStorage.setItem(`${STORAGE_PREFIX}${workflow.id}`, JSON.stringify(workflow));
    const list = getList();
    const idx = list.findIndex(w => w.id === workflow.id);
    if (idx >= 0) {
      list[idx] = toListItem(workflow);
    } else {
      list.push(toListItem(workflow));
    }
    saveList(list);
    return workflow;
  },

  // ── Delete ───────────────────────────────────────────────────────────────
  deleteWorkflow(id: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    const list = getList().filter(w => w.id !== id);
    saveList(list);
  },

  // ── Duplicate ────────────────────────────────────────────────────────────
  duplicateWorkflow(id: string): Workflow | null {
    const original = this.getWorkflow(id);
    if (!original) return null;
    const now = new Date().toISOString();
    const copy: Workflow = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      lastRunAt: undefined,
      runCount: 0,
      status: 'draft',
      steps: original.steps.map(s => ({ ...s, id: `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, status: 'idle', result: undefined })),
    };
    // Remap connection step IDs
    const idMap = new Map<string, string>();
    original.steps.forEach((s, i) => idMap.set(s.id, copy.steps[i]!.id));
    copy.connections = original.connections.map(c => ({
      ...c,
      id: `conn-${Math.random().toString(36).slice(2, 8)}`,
      fromStepId: idMap.get(c.fromStepId) || c.fromStepId,
      toStepId: idMap.get(c.toStepId) || c.toStepId,
    }));
    localStorage.setItem(`${STORAGE_PREFIX}${copy.id}`, JSON.stringify(copy));
    const list = getList();
    list.push(toListItem(copy));
    saveList(list);
    return copy;
  },

  // ── Run Logging ──────────────────────────────────────────────────────────
  logRun(log: WorkflowRunLog): void {
    try {
      const raw = localStorage.getItem(RUN_LOG_KEY);
      const logs: WorkflowRunLog[] = raw ? JSON.parse(raw) : [];
      logs.unshift(log);
      // Keep last 100 runs
      if (logs.length > 100) logs.length = 100;
      localStorage.setItem(RUN_LOG_KEY, JSON.stringify(logs));
    } catch { /* storage full — skip */ }
  },

  getRunLogs(workflowId?: string): WorkflowRunLog[] {
    try {
      const raw = localStorage.getItem(RUN_LOG_KEY);
      const logs: WorkflowRunLog[] = raw ? JSON.parse(raw) : [];
      return workflowId ? logs.filter(l => l.workflowId === workflowId) : logs;
    } catch {
      return [];
    }
  },

  // ── Export / Import ──────────────────────────────────────────────────────
  exportWorkflow(id: string): string | null {
    const workflow = this.getWorkflow(id);
    return workflow ? JSON.stringify(workflow, null, 2) : null;
  },

  importWorkflow(json: string): Workflow | null {
    try {
      const parsed = JSON.parse(json) as Workflow;
      parsed.id = generateId();
      parsed.createdAt = new Date().toISOString();
      parsed.updatedAt = new Date().toISOString();
      parsed.runCount = 0;
      parsed.lastRunAt = undefined;
      localStorage.setItem(`${STORAGE_PREFIX}${parsed.id}`, JSON.stringify(parsed));
      const list = getList();
      list.push(toListItem(parsed));
      saveList(list);
      return parsed;
    } catch {
      return null;
    }
  },
};
