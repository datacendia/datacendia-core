// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA FEATURE FLAGS - Powered by Unleash
// Toggle features dynamically without redeploying
// =============================================================================

const UNLEASH_URL = import.meta.env.VITE_UNLEASH_URL || 'http://localhost:4242/api';
const UNLEASH_TOKEN = import.meta.env.VITE_UNLEASH_TOKEN || '';

// Feature flag definitions
export const FEATURE_FLAGS = {
  // Council Modes
  WAR_ROOM_MODE: 'council-war-room-mode',
  AGGRESSIVE_AGENTS: 'council-aggressive-agents',

  // Enterprise Features
  CHRONOS_ERP_INTEGRATION: 'chronos-erp-integration',
  GNOSIS_RAG_ENABLED: 'gnosis-rag-enabled',
  CRUCIBLE_MONTE_CARLO: 'crucible-monte-carlo',

  // Security Features
  ZERO_KNOWLEDGE_PROOFS: 'security-zk-proofs',
  REGULATOR_MODE: 'security-regulator-mode',

  // Experimental
  AI_SELF_IMPROVEMENT: 'experimental-apotheosis',
  DISSENT_PROTECTION: 'experimental-dissent',
} as const;

type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

// Cache for feature flag values
const flagCache: Map<string, { value: boolean; timestamp: number }> = new Map();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Check if a feature flag is enabled
 */
export async function isFeatureEnabled(flag: FeatureFlag): Promise<boolean> {
  // Check cache first
  const cached = flagCache.get(flag);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  try {
    const response = await fetch(`${UNLEASH_URL}/client/features/${flag}`, {
      headers: {
        Authorization: UNLEASH_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[FeatureFlags] Failed to fetch flag ${flag}, using default`);
      return false;
    }

    const data = await response.json();
    const enabled = data.enabled ?? false;

    // Update cache
    flagCache.set(flag, { value: enabled, timestamp: Date.now() });

    return enabled;
  } catch (error) {
    console.warn(`[FeatureFlags] Error fetching flag ${flag}:`, error);
    return false;
  }
}

/**
 * Get all feature flags at once
 */
export async function getAllFeatureFlags(): Promise<Record<FeatureFlag, boolean>> {
  const flags: Record<string, boolean> = {};

  try {
    const response = await fetch(`${UNLEASH_URL}/client/features`, {
      headers: {
        Authorization: UNLEASH_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      for (const feature of data.features || []) {
        flags[feature.name] = feature.enabled ?? false;
        flagCache.set(feature.name, { value: feature.enabled, timestamp: Date.now() });
      }
    }
  } catch (error) {
    console.warn('[FeatureFlags] Error fetching all flags:', error);
  }

  // Return with defaults for any missing flags
  return Object.fromEntries(
    Object.values(FEATURE_FLAGS).map((flag) => [flag, flags[flag] ?? false])
  ) as Record<FeatureFlag, boolean>;
}

/**
 * React hook for feature flags (simple version)
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  // For now, return true by default - in production, this would use React state
  // and the async isFeatureEnabled function
  return true;
}

/**
 * Open the Unleash dashboard
 */
export function openUnleashDashboard(): void {
  window.open('http://localhost:4242', '_blank');
}
