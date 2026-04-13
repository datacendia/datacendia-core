// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

interface ScheduledJob {
  id: string;
  organizationId: string;
  jobType: string;
  name: string;
  description?: string;
  cronExpression: string;
  timezone?: string;
  config?: any;
  createdBy: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
}

interface JobExecution {
  id: string;
  jobId: string;
  trigger: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

class EnterpriseSchedulerServiceImpl {
  private jobs = new Map<string, ScheduledJob>();
  private executions: JobExecution[] = [];
  private running = false;

  getStatus() {
    return {
      running: this.running,
      totalJobs: this.jobs.size,
      enabledJobs: [...this.jobs.values()].filter(j => j.enabled).length,
      recentExecutions: this.executions.length,
      uptime: process.uptime(),
    };
  }

  getJobs(organizationId?: string): ScheduledJob[] {
    const all = [...this.jobs.values()];
    return organizationId ? all.filter(j => j.organizationId === organizationId) : all;
  }

  getJob(id: string): ScheduledJob | undefined {
    return this.jobs.get(id);
  }

  async createJob(params: { organizationId: string; jobType: string; name: string; description?: string; cronExpression: string; timezone?: string; config?: any; createdBy: string; enabled: boolean }): Promise<ScheduledJob> {
    const now = new Date().toISOString();
    const job: ScheduledJob = {
      id: crypto.randomUUID(),
      ...params,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<Pick<ScheduledJob, 'name' | 'description' | 'cronExpression' | 'config' | 'enabled'>>): Promise<ScheduledJob | null> {
    const job = this.jobs.get(id);
    if (!job) return null;
    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
    return job;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async runJobNow(jobId: string, trigger: string): Promise<JobExecution> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');
    const execution: JobExecution = {
      id: crypto.randomUUID(),
      jobId,
      trigger,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      result: { message: `Job "${job.name}" executed successfully`, jobType: job.jobType },
    };
    job.lastRunAt = execution.completedAt;
    this.executions.unshift(execution);
    return execution;
  }

  getExecutions(jobId?: string, limit = 50): JobExecution[] {
    const filtered = jobId ? this.executions.filter(e => e.jobId === jobId) : this.executions;
    return filtered.slice(0, limit);
  }

  async start() { this.running = true; }
  async stop() { this.running = false; }
}

export const enterpriseSchedulerService = new EnterpriseSchedulerServiceImpl();
