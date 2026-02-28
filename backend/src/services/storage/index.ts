// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// STORAGE SERVICES INDEX
// =============================================================================
// Unified exports for all sovereign storage services
// =============================================================================

export { agentQueueService, QUEUE_NAMES, JOB_PRIORITY } from '../queue/AgentQueueService';
export type {
  AgentDeliberationJob,
  CouncilSessionJob,
  DocumentProcessingJob,
  EmbeddingGenerationJob,
  AuditLoggingJob,
  WorkflowExecutionJob,
  QueueStats,
} from '../queue/AgentQueueService';

export { druidService, DRUID_DATASOURCES } from './DruidService';
export type {
  AuditEvent,
  DecisionEvent,
  AgentMetric,
  SystemTelemetry,
  DruidQueryResult,
} from './DruidService';

export { minioService, BUCKETS } from './MinioService';
export type {
  FileMetadata,
  UploadResult,
  DownloadResult,
} from './MinioService';

export { vectorService } from './VectorService';
export type {
  VectorSearchResult,
  DocumentChunk,
  DecisionContext,
  AgentMemoryEntry,
} from './VectorService';

// =============================================================================
// INITIALIZATION HELPER
// =============================================================================

import { agentQueueService } from '../queue/AgentQueueService';
import { druidService } from './DruidService';
import { minioService } from './MinioService';
import { vectorService } from './VectorService';

import { logger } from '../../utils/logger.js';
/**
 * Initialize all sovereign storage services
 */
export async function initializeSovereignServices(): Promise<void> {
  logger.info('[Sovereign] Initializing storage services...');

  try {
    // Initialize in parallel where possible
    await Promise.all([
      agentQueueService.initialize(),
      minioService.initialize(),
      vectorService.initialize(),
    ]);

    // Druid checks its own availability
    await druidService.checkAvailability();

    logger.info('[Sovereign] All storage services initialized successfully');
  } catch (error) {
    console.error('[Sovereign] Failed to initialize some services:', error);
    // Don't throw - allow app to start with partial functionality
  }
}

/**
 * Graceful shutdown of all services
 */
export async function shutdownSovereignServices(): Promise<void> {
  logger.info('[Sovereign] Shutting down storage services...');

  try {
    await agentQueueService.shutdown();
    logger.info('[Sovereign] All storage services shut down');
  } catch (error) {
    console.error('[Sovereign] Error during shutdown:', error);
  }
}
