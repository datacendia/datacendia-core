// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AGENT QUEUE SERVICE - BullMQ Job Queue for Agent Orchestration
// =============================================================================
// Prevents system crashes by organizing agent "thinking" into a queue.
// When multiple agents need to deliberate, BullMQ ensures they wait their turn.
// Powers: CendiaCouncil™ deliberation, CendiaFlow™ workflows
// =============================================================================

import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { config } from '../../config/index.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

function attachRedisEventHandlers(client: Redis, label: string) {
  client.on('error', (err) => {
    console.error(`[AgentQueue] ${label} Redis error:`, err);
  });

  client.on('close', () => {
    console.warn(`[AgentQueue] ${label} Redis connection closed`);
  });
}

function createBullMqRedisConnection(label: string): Redis {
  const redisUrl = config.redisUrl || process.env.REDIS_URL;

  const baseOptions = {
    maxRetriesPerRequest: null as null,
    enableReadyCheck: true,
    lazyConnect: true,
  };

  const client = redisUrl
    ? new Redis(redisUrl, baseOptions)
    : new Redis({
        ...baseOptions,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      });

  attachRedisEventHandlers(client, label);

  const originalDuplicate = client.duplicate.bind(client);
  (client as any).duplicate = (...args: any[]) => {
    const dup = originalDuplicate(...args);
    attachRedisEventHandlers(dup, `${label} (duplicate)`);
    return dup;
  };

  return client;
}

// Queue names
export const QUEUE_NAMES = {
  AGENT_DELIBERATION: 'agent-deliberation',
  COUNCIL_SESSION: 'council-session',
  DOCUMENT_PROCESSING: 'document-processing',
  EMBEDDING_GENERATION: 'embedding-generation',
  AUDIT_LOGGING: 'audit-logging',
  WORKFLOW_EXECUTION: 'workflow-execution',
  ALERT_PROCESSING: 'alert-processing',
} as const;

// Job priorities (lower = higher priority)
export const JOB_PRIORITY = {
  CRITICAL: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4,
  BACKGROUND: 5,
} as const;

// Job types
export interface AgentDeliberationJob {
  type: 'deliberation';
  organizationId: string;
  sessionId: string;
  agentId: string;
  agentRole: string;
  prompt: string;
  context: Record<string, any>;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface CouncilSessionJob {
  type: 'council-session';
  organizationId: string;
  sessionId: string;
  question: string;
  agents: string[];
  mode: 'standard' | 'war-room' | 'consensus';
  context?: Record<string, any>;
}

export interface DocumentProcessingJob {
  type: 'document-processing';
  organizationId: string;
  documentId: string;
  filePath: string;
  mimeType: string;
  extractText?: boolean;
  generateEmbeddings?: boolean;
}

export interface EmbeddingGenerationJob {
  type: 'embedding-generation';
  organizationId: string;
  contentId: string;
  contentType: 'document' | 'decision' | 'memory';
  content: string;
  metadata?: Record<string, any>;
}

export interface AuditLoggingJob {
  type: 'audit-logging';
  organizationId: string;
  eventType: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface WorkflowExecutionJob {
  type: 'workflow-execution';
  organizationId: string;
  workflowId: string;
  triggerId: string;
  triggerType: 'manual' | 'scheduled' | 'event';
  inputData: Record<string, any>;
}

export type QueueJob = 
  | AgentDeliberationJob 
  | CouncilSessionJob 
  | DocumentProcessingJob 
  | EmbeddingGenerationJob 
  | AuditLoggingJob
  | WorkflowExecutionJob;

// Queue statistics
export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

class AgentQueueService extends EventEmitter {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private queueEvents: Map<string, QueueEvents> = new Map();
  private isInitialized = false;
  private isEnabled = false;
  private connection: Redis | null = null;



  constructor() {
    super();
    this.loadFromDB().catch(() => {});
  }


  /**
   * Initialize all queues
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('[AgentQueue] Initializing BullMQ queues...');

    const timeout = <T>(ms: number, promise: Promise<T>, name: string) =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${name} timeout`)), ms)),
      ]);

    const connection = createBullMqRedisConnection('BullMQ');
    try {
      await timeout(1500, connection.connect(), 'Redis connect');
      await timeout(1500, connection.ping(), 'Redis ping');
    } catch (err) {
      console.warn('[AgentQueue] Redis unavailable; BullMQ queues disabled:', err);
      try {
        connection.disconnect();
      } catch {}
      this.isInitialized = true;
      this.isEnabled = false;
      this.connection = null;
      return;
    }

    this.connection = connection;

    // Create queues
    for (const [name, queueName] of Object.entries(QUEUE_NAMES)) {
      const queue = new Queue(queueName, { connection });
      this.queues.set(queueName, queue);

      // Create queue events for monitoring
      const events = new QueueEvents(queueName, { connection });
      this.queueEvents.set(queueName, events);

      // Set up event listeners
      events.on('completed', ({ jobId, returnvalue }) => {
        this.emit('job:completed', { queue: queueName, jobId, result: returnvalue });
      });

      events.on('failed', ({ jobId, failedReason }) => {
        this.emit('job:failed', { queue: queueName, jobId, error: failedReason });
        console.error(`[AgentQueue] Job ${jobId} failed in ${queueName}:`, failedReason);
      });

      events.on('progress', ({ jobId, data }) => {
        this.emit('job:progress', { queue: queueName, jobId, progress: data });
      });

      logger.info(`[AgentQueue] Created queue: ${queueName}`);
    }

    this.isInitialized = true;
    this.isEnabled = true;
    logger.info('[AgentQueue] All queues initialized');
  }

  /**
   * Add a job to the agent deliberation queue
   */
  async addAgentDeliberation(
    job: Omit<AgentDeliberationJob, 'type'>,
    options?: { priority?: number; delay?: number }
  ): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.AGENT_DELIBERATION);
    if (!queue) throw new Error('Agent deliberation queue not initialized');

    const fullJob: AgentDeliberationJob = { type: 'deliberation', ...job };
    
    return queue.add('deliberation', fullJob, {
      priority: options?.priority ?? JOB_PRIORITY.NORMAL,
      delay: options?.delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        age: 3600, // Keep for 1 hour
        count: 1000,
      },
      removeOnFail: {
        age: 86400, // Keep failed jobs for 24 hours
      },
    });
  }

  /**
   * Add a Council session to the queue
   */
  async addCouncilSession(
    job: Omit<CouncilSessionJob, 'type'>,
    options?: { priority?: number }
  ): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.COUNCIL_SESSION);
    if (!queue) throw new Error('Council session queue not initialized');

    const fullJob: CouncilSessionJob = { type: 'council-session', ...job };

    return queue.add('council', fullJob, {
      priority: options?.priority ?? JOB_PRIORITY.HIGH,
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
    });
  }

  /**
   * Add a document processing job
   */
  async addDocumentProcessing(
    job: Omit<DocumentProcessingJob, 'type'>,
    options?: { priority?: number }
  ): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.DOCUMENT_PROCESSING);
    if (!queue) throw new Error('Document processing queue not initialized');

    const fullJob: DocumentProcessingJob = { type: 'document-processing', ...job };

    return queue.add('process-document', fullJob, {
      priority: options?.priority ?? JOB_PRIORITY.NORMAL,
      attempts: 3,
    });
  }

  /**
   * Add an embedding generation job
   */
  async addEmbeddingGeneration(
    job: Omit<EmbeddingGenerationJob, 'type'>,
    options?: { priority?: number }
  ): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.EMBEDDING_GENERATION);
    if (!queue) throw new Error('Embedding generation queue not initialized');

    const fullJob: EmbeddingGenerationJob = { type: 'embedding-generation', ...job };

    return queue.add('generate-embedding', fullJob, {
      priority: options?.priority ?? JOB_PRIORITY.LOW,
      attempts: 3,
    });
  }

  /**
   * Add an audit logging job (fire-and-forget)
   */
  async addAuditLog(job: Omit<AuditLoggingJob, 'type'>): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.AUDIT_LOGGING);
    if (!queue) throw new Error('Audit logging queue not initialized');

    const fullJob: AuditLoggingJob = { type: 'audit-logging', ...job };

    return queue.add('audit', fullJob, {
      priority: JOB_PRIORITY.BACKGROUND,
      attempts: 5,
      removeOnComplete: true,
    });
  }

  /**
   * Add a workflow execution job
   */
  async addWorkflowExecution(
    job: Omit<WorkflowExecutionJob, 'type'>,
    options?: { priority?: number; delay?: number }
  ): Promise<Job> {
    const queue = this.queues.get(QUEUE_NAMES.WORKFLOW_EXECUTION);
    if (!queue) throw new Error('Workflow execution queue not initialized');

    const fullJob: WorkflowExecutionJob = { type: 'workflow-execution', ...job };

    return queue.add('workflow', fullJob, {
      priority: options?.priority ?? JOB_PRIORITY.NORMAL,
      delay: options?.delay,
      attempts: 3,
    });
  }

  /**
   * Register a worker for a specific queue
   */
  registerWorker(
    queueName: string,
    processor: (job: Job) => Promise<any>,
    options?: { concurrency?: number }
  ): Worker {
    if (!this.isEnabled || !this.connection) {
      throw new Error('BullMQ is disabled (Redis unavailable)');
    }

    const worker = new Worker(queueName, processor, {
      connection: this.connection,
      concurrency: options?.concurrency ?? 1, // Default to 1 for AI workloads
      limiter: {
        max: 10,
        duration: 1000, // 10 jobs per second max
      },
    });

    worker.on('completed', (job) => {
      logger.info(`[AgentQueue] Job ${job.id} completed in ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[AgentQueue] Job ${job?.id} failed in ${queueName}:`, err.message);
    });

    worker.on('error', (err) => {
      console.error(`[AgentQueue] Worker error in ${queueName}:`, err);
    });

    this.workers.set(queueName, worker);
    logger.info(`[AgentQueue] Worker registered for ${queueName}`);

    return worker;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string): Promise<QueueStats> {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats(): Promise<Record<string, QueueStats>> {
    const stats: Record<string, QueueStats> = {};

    for (const queueName of Object.values(QUEUE_NAMES)) {
      stats[queueName] = await this.getQueueStats(queueName);
    }

    return stats;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);
    await queue.pause();
    logger.info(`[AgentQueue] Queue ${queueName} paused`);
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);
    await queue.resume();
    logger.info(`[AgentQueue] Queue ${queueName} resumed`);
  }

  /**
   * Clean up old jobs
   */
  async cleanQueue(queueName: string, gracePeriod: number = 3600000): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);

    await queue.clean(gracePeriod, 1000, 'completed');
    await queue.clean(gracePeriod * 24, 1000, 'failed');
    logger.info(`[AgentQueue] Queue ${queueName} cleaned`);
  }

  /**
   * Shutdown all queues gracefully
   */
  async shutdown(): Promise<void> {
    logger.info('[AgentQueue] Shutting down...');

    // Close workers first
    for (const [name, worker] of this.workers) {
      await worker.close();
      logger.info(`[AgentQueue] Worker ${name} closed`);
    }

    // Close queue events
    for (const [name, events] of this.queueEvents) {
      await events.close();
    }

    // Close queues
    for (const [name, queue] of this.queues) {
      await queue.close();
      logger.info(`[AgentQueue] Queue ${name} closed`);
    }

    if (this.connection) {
      try {
        await this.connection.quit();
      } catch {
        try {
          this.connection.disconnect();
        } catch {}
      }
      this.connection = null;
    }

    this.isInitialized = false;
    this.isEnabled = false;
    logger.info('[AgentQueue] Shutdown complete');
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'AgentQueue', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.queues.has(d.id)) this.queues.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'AgentQueue', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.workers.has(d.id)) this.workers.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'AgentQueue', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.queueEvents.has(d.id)) this.queueEvents.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[AgentQueueService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[AgentQueueService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Singleton instance
export const agentQueueService = new AgentQueueService();

export default agentQueueService;
