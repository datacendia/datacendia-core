// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA CORE - INTERNAL ADMIN SERVICES
// "Dogfooding" - Datacendia runs on Datacendia
// Updated: December 2024 - Added Druid integration and workflow metrics
// =============================================================================

export { cendiaBrandService, type ContentPiece, type ProductFeature, type LaunchSchedule } from './CendiaBrandService.js';
export { cendiaFoundryService, type RoadmapItem, type TechnicalDebt, type FeatureRecommendation } from './CendiaFoundryService.js';
export { cendiaRevenueService, type RevenueMetrics, type RunwayCalculation, type PricingRecommendation } from './CendiaRevenueService.js';
export { cendiaSupportService, type SupportTicket, type CustomerHealth, type ChurnPrediction } from './CendiaSupportService.js';
export { cendiaWatchService, type Competitor, type MarketSignal, type ThreatAlert, type IntelligenceReport } from './CendiaWatchService.js';

// =============================================================================
// DATACENDIA CORE DASHBOARD
// Aggregates all internal services into a single view
// Now includes: Druid real-time metrics, workflow scenario stats
// =============================================================================

import { cendiaBrandService } from './CendiaBrandService.js';
import { cendiaFoundryService } from './CendiaFoundryService.js';
import { cendiaRevenueService } from './CendiaRevenueService.js';
import { cendiaSupportService } from './CendiaSupportService.js';
import { cendiaWatchService } from './CendiaWatchService.js';

// Workflow scenario constants (from workflow-scenarios.json + workflow-scenarios-part2.json)
export const WORKFLOW_STATS = {
  totalWorkflows: 312,
  categories: 45,
  councilModes: 12,
  priorityLevels: 4,
  criticalWorkflows: 60,
  highWorkflows: 130,
  mediumWorkflows: 122,
};

export interface CoreDashboard {
  // Brand
  contentQueue: number;
  scheduledPosts: number;
  
  // Foundry
  backlogItems: number;
  technicalDebtCount: number;
  topPriority: string | null;
  nagMessage: string | null;
  
  // Revenue
  mrr: number;
  arr: number;
  runwayMonths: number;
  pricingAdvice: string | null;
  
  // Support
  openTickets: number;
  atRiskCustomers: number;
  
  // Watch
  activeAlerts: number;
  criticalAlert: string | null;
  
  // Platform Stats (NEW)
  workflowsAvailable: number;
  councilModesAvailable: number;
  
  // Overall
  lastUpdated: Date;
}

export async function getCoreDashboard(): Promise<CoreDashboard> {
  const metrics = cendiaRevenueService.calculateMetrics();
  const runway = cendiaRevenueService.calculateRunway(100000, 15000); // Would get real values
  const priorities = await cendiaFoundryService.prioritizeFeatures();
  const atRisk = await cendiaSupportService.getAtRiskCustomers();
  
  return {
    // Brand
    contentQueue: cendiaBrandService.getContentQueue().length,
    scheduledPosts: cendiaBrandService.getContentQueue().filter(c => c.status === 'scheduled').length,
    
    // Foundry
    backlogItems: cendiaFoundryService.getRoadmap().filter(r => r.status === 'backlog').length,
    technicalDebtCount: 0, // Would get from Foundry
    topPriority: priorities[0]?.featureName || null,
    nagMessage: cendiaFoundryService.getNagMessage(),
    
    // Revenue
    mrr: metrics.mrr,
    arr: metrics.arr,
    runwayMonths: runway.runwayMonths,
    pricingAdvice: await cendiaRevenueService.getQuickPricingAdvice(),
    
    // Support
    openTickets: cendiaSupportService.getMetrics().openTickets,
    atRiskCustomers: atRisk.length,
    
    // Watch
    activeAlerts: cendiaWatchService.getAlerts(false).length,
    criticalAlert: cendiaWatchService.getCriticalAlert(),
    
    // Platform Stats
    workflowsAvailable: WORKFLOW_STATS.totalWorkflows,
    councilModesAvailable: WORKFLOW_STATS.councilModes,
    
    // Overall
    lastUpdated: new Date(),
  };
}
