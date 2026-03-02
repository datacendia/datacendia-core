/**
 * Feature — Index
 *
 * Feature module implementing a specific platform capability.
 *
 * @exports WORKFLOW_INTEGRATION, HOLY_SHIT_FEATURES
 * @module features/holy-shit/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - HOLY SHIT FEATURES
// The 5 features that close deals
// Updated: December 2024 - Integrated with 312 workflow scenarios
// =============================================================================

// Feature exports
export * from './PreMortem.js';
export * from './GhostBoard.js';
export * from './DecisionDebt.js';
export * from './LiveDemoMode.js';
export * from './RegulatoryAbsorb.js';

// Service singletons
export { preMortemService } from './PreMortem.js';
export { ghostBoardService } from './GhostBoard.js';
export { decisionDebtService } from './DecisionDebt.js';
export { liveDemoModeService } from './LiveDemoMode.js';
export { regulatoryAbsorbService } from './RegulatoryAbsorb.js';

// Workflow scenario integration - 312 pre-built enterprise workflows
// See: backend/src/data/WORKFLOW-REFERENCE.md for complete listing
export const WORKFLOW_INTEGRATION = {
  totalScenarios: 312,
  scenariosByFeature: {
    preMortem: ['WF-032', 'WF-280', 'WF-282'], // Butterfly Effect, Cascade Analysis
    ghostBoard: ['WF-007', 'WF-019', 'WF-021', 'WF-095'], // Board prep, Investor defense
    decisionDebt: ['WF-147', 'WF-250', 'WF-309'], // Roadmap, Decision Intelligence
    liveDemo: ['WF-262', 'WF-267', 'WF-308'], // Real-time execution workflows
    regulatoryAbsorb: ['WF-015', 'WF-076', 'WF-106', 'WF-248', 'WF-281'], // Compliance workflows
  },
  councilModes: 12,
  categories: 45,
};

// Feature metadata
export const HOLY_SHIT_FEATURES = {
  preMortem: {
    id: 'preMortem',
    name: 'The Pre-Mortem',
    icon: '💀',
    tagline: 'Before you decide, let me show you every way this could fail.',
    minimumTier: 'foundation',
    closeRateImpact: 5,
  },
  ghostBoard: {
    id: 'ghostBoard',
    name: 'The Ghost Board',
    icon: '👻',
    tagline: 'Rehearse your board meeting with AI directors before the real one.',
    minimumTier: 'foundation',
    closeRateImpact: 5,
  },
  decisionDebtDashboard: {
    id: 'decisionDebtDashboard',
    name: 'Decision Debt Dashboard',
    icon: '📊',
    tagline: 'See every decision that\'s stuck, who\'s blocking it, and what it\'s costing you per day.',
    minimumTier: 'foundation',
    closeRateImpact: 4,
  },
  liveDemoMode: {
    id: 'liveDemoMode',
    name: 'Live Demo Mode',
    icon: '⚡',
    tagline: 'Let\'s connect to YOUR data right now and run a real deliberation.',
    minimumTier: 'foundation',
    closeRateImpact: 5,
  },
  regulatoryInstantAbsorb: {
    id: 'regulatoryInstantAbsorb',
    name: 'Regulatory Instant-Absorb',
    icon: '📜',
    tagline: 'Drop in any regulation. The Council knows it in 60 seconds.',
    minimumTier: 'foundation',
    closeRateImpact: 4,
  },
};
