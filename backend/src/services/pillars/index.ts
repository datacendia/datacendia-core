// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PILLAR SERVICES INDEX
// The 8 Foundational Data Layers for Enterprise Platinum Intelligence
// =============================================================================

export * from './HelmService.js';
export * from './LineageService.js';
export * from './PredictService.js';
export * from './FlowService.js';
export * from './HealthService.js';
export * from './GuardService.js';
export * from './EthicsService.js';
export * from './AgentsService.js';

import { helmService } from './HelmService.js';
import { lineageService } from './LineageService.js';
import { predictService } from './PredictService.js';
import { flowService } from './FlowService.js';
import { healthService } from './HealthService.js';
import { guardService } from './GuardService.js';
import { ethicsService } from './EthicsService.js';
import { agentsService } from './AgentsService.js';

import { logger } from '../../utils/logger.js';
// =============================================================================
// PILLAR SERVICES FACADE
// =============================================================================

export const pillarServices = {
  helm: helmService,
  lineage: lineageService,
  predict: predictService,
  flow: flowService,
  health: healthService,
  guard: guardService,
  ethics: ethicsService,
  agents: agentsService,
};

/**
 * Initialize all pillar services for an organization
 */
export async function initializePillarsForOrg(organizationId: string): Promise<void> {
  logger.info(`Initializing pillars for organization: ${organizationId}`);
  
  // Check if data already seeded
  const hasMetrics = await helmService.hasMetricsForOrg(organizationId);
  const hasAgents = await agentsService.hasAgentsForOrg(organizationId);

  logger.info(`Pillars initialized for organization: ${organizationId}`);
}

export default pillarServices;
