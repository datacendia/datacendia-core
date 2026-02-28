// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * USE DEMO DATA HOOK
 * =============================================================================
 * Provides demo scenario data to components when demo mode is active.
 * Components can use this hook to get pre-loaded realistic data for demos.
 */

import { useMemo } from 'react';
import { useDemoMode } from '../contexts/DemoModeContext';
import {
  DEMO_SCENARIOS,
  DemoScenarioKey,
  COUNCIL_DEMO_SCENARIO,
  CHRONOS_DEMO_SCENARIO,
  CASCADE_DEMO_SCENARIO,
  OVERSIGHT_DEMO_SCENARIO,
  CRUCIBLE_DEMO_SCENARIO,
  GUARD_DEMO_SCENARIO,
  GNOSIS_DEMO_SCENARIO,
  OMNITRANSLATE_DEMO_SCENARIO,
  APOTHEOSIS_DEMO_SCENARIO,
  DISSENT_DEMO_SCENARIO,
  WITNESS_DEMO_SCENARIO
} from '../data/demoScenarios';

// =============================================================================
// TYPES
// =============================================================================

export interface UseDemoDataOptions {
  scenario?: DemoScenarioKey;
  autoActivate?: boolean; // Auto-activate demo data when demo mode is on
}

export interface UseDemoDataResult<T> {
  isDemoMode: boolean;
  demoData: T | null;
  isLoading: boolean;
  scenarioName: string | null;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Generic hook to get demo data for any scenario
 */
export function useDemoData<T = unknown>(
  scenario: DemoScenarioKey
): UseDemoDataResult<T> {
  const { isActive, currentDemo } = useDemoMode();

  const demoData = useMemo(() => {
    if (!isActive) {return null;}
    return DEMO_SCENARIOS[scenario] as T;
  }, [isActive, scenario]);

  return {
    isDemoMode: isActive,
    demoData,
    isLoading: false,
    scenarioName: currentDemo?.name || null
  };
}

/**
 * Hook for Council demo data
 */
export function useCouncilDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    deliberation: isActive ? COUNCIL_DEMO_SCENARIO : null,
    agents: isActive ? COUNCIL_DEMO_SCENARIO.agents : [],
    dissents: isActive ? COUNCIL_DEMO_SCENARIO.dissents : [],
    conditions: isActive ? COUNCIL_DEMO_SCENARIO.conditions : []
  }), [isActive]);
}

/**
 * Hook for Chronos demo data
 */
export function useChronosDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    organization: isActive ? CHRONOS_DEMO_SCENARIO.organization : null,
    pivotalMoments: isActive ? CHRONOS_DEMO_SCENARIO.pivotalMoments : [],
    patterns: isActive ? CHRONOS_DEMO_SCENARIO.patterns : [],
    totalDecisions: isActive ? CHRONOS_DEMO_SCENARIO.totalDecisions : 0,
    pivotalIdentified: isActive ? CHRONOS_DEMO_SCENARIO.pivotalIdentified : 0
  }), [isActive]);
}

/**
 * Hook for Cascade demo data
 */
export function useCascadeDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    organization: isActive ? CASCADE_DEMO_SCENARIO.organization : null,
    proposedChange: isActive ? CASCADE_DEMO_SCENARIO.proposedChange : null,
    rippleEffects: isActive ? CASCADE_DEMO_SCENARIO.rippleEffects : [],
    hiddenCosts: isActive ? CASCADE_DEMO_SCENARIO.hiddenCosts : null,
    netAnalysis: isActive ? CASCADE_DEMO_SCENARIO.netAnalysis : null,
    alternatives: isActive ? CASCADE_DEMO_SCENARIO.alternatives : [],
    recommendation: isActive ? CASCADE_DEMO_SCENARIO.recommendation : null
  }), [isActive]);
}

/**
 * Hook for Oversight demo data
 */
export function useOversightDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    organization: isActive ? OVERSIGHT_DEMO_SCENARIO.organization : null,
    auditContext: isActive ? OVERSIGHT_DEMO_SCENARIO.auditContext : null,
    compliancePosture: isActive ? OVERSIGHT_DEMO_SCENARIO.compliancePosture : null,
    controlStatus: isActive ? OVERSIGHT_DEMO_SCENARIO.controlStatus : [],
    evidencePackage: isActive ? OVERSIGHT_DEMO_SCENARIO.evidencePackage : null
  }), [isActive]);
}

/**
 * Hook for Crucible demo data
 */
export function useCrucibleDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    targetSystem: isActive ? CRUCIBLE_DEMO_SCENARIO.targetSystem : null,
    testSuite: isActive ? CRUCIBLE_DEMO_SCENARIO.testSuite : null,
    vulnerabilities: isActive ? CRUCIBLE_DEMO_SCENARIO.vulnerabilities : [],
    summary: isActive ? CRUCIBLE_DEMO_SCENARIO.summary : null
  }), [isActive]);
}

/**
 * Hook for Guard demo data
 */
export function useGuardDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    organization: isActive ? GUARD_DEMO_SCENARIO.organization : null,
    threats: isActive ? GUARD_DEMO_SCENARIO.threats : [],
    summary: isActive ? GUARD_DEMO_SCENARIO.summary : null
  }), [isActive]);
}

/**
 * Hook for Gnosis demo data
 */
export function useGnosisDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    matter: isActive ? GNOSIS_DEMO_SCENARIO.matter : null,
    documentUpload: isActive ? GNOSIS_DEMO_SCENARIO.documentUpload : null,
    processingResults: isActive ? GNOSIS_DEMO_SCENARIO.processingResults : null,
    sampleQueries: isActive ? GNOSIS_DEMO_SCENARIO.sampleQueries : [],
    keyFindings: isActive ? GNOSIS_DEMO_SCENARIO.keyFindings : []
  }), [isActive]);
}

/**
 * Hook for OmniTranslate demo data
 */
export function useOmniTranslateDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    request: isActive ? OMNITRANSLATE_DEMO_SCENARIO.request : null,
    sourceDocument: isActive ? OMNITRANSLATE_DEMO_SCENARIO.sourceDocument : null,
    translations: isActive ? OMNITRANSLATE_DEMO_SCENARIO.translations : [],
    summary: isActive ? OMNITRANSLATE_DEMO_SCENARIO.summary : null
  }), [isActive]);
}

/**
 * Hook for Apotheosis demo data
 */
export function useApotheosisDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    nightlyRun: isActive ? APOTHEOSIS_DEMO_SCENARIO.nightlyRun : null,
    attackCategories: isActive ? APOTHEOSIS_DEMO_SCENARIO.attackCategories : [],
    vulnerabilities: isActive ? APOTHEOSIS_DEMO_SCENARIO.vulnerabilities : [],
    trend: isActive ? APOTHEOSIS_DEMO_SCENARIO.trend : []
  }), [isActive]);
}

/**
 * Hook for Dissent demo data
 */
export function useDissentDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    originalDecision: isActive ? DISSENT_DEMO_SCENARIO.originalDecision : null,
    dissentFiling: isActive ? DISSENT_DEMO_SCENARIO.dissentFiling : null,
    arguments: isActive ? DISSENT_DEMO_SCENARIO.arguments : [],
    outcomeTracking: isActive ? DISSENT_DEMO_SCENARIO.outcomeTracking : null,
    vindication: isActive ? DISSENT_DEMO_SCENARIO.vindication : null
  }), [isActive]);
}

/**
 * Hook for Witness demo data
 */
export function useWitnessDemoData() {
  const { isActive } = useDemoMode();
  
  return useMemo(() => ({
    isDemoMode: isActive,
    regulatorRequest: isActive ? WITNESS_DEMO_SCENARIO.regulatorRequest : null,
    decisionRecord: isActive ? WITNESS_DEMO_SCENARIO.decisionRecord : null,
    agents: isActive ? WITNESS_DEMO_SCENARIO.agents : [],
    cryptographicProof: isActive ? WITNESS_DEMO_SCENARIO.cryptographicProof : null,
    exportPackage: isActive ? WITNESS_DEMO_SCENARIO.exportPackage : null
  }), [isActive]);
}

// =============================================================================
// EXPORT
// =============================================================================

export default useDemoData;
