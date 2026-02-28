// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FEATURE FLAGS TESTS
// Unit tests for featureFlags.ts
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  getAllFeatureFlags,
  useFeatureFlag,
  openUnleashDashboard,
} from '../featureFlags';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.open
const mockWindowOpen = vi.fn();
global.window = { open: mockWindowOpen } as any;

// =============================================================================
// FEATURE FLAGS CONSTANTS TESTS
// =============================================================================

describe('FEATURE_FLAGS', () => {
  it('should have council mode flags', () => {
    expect(FEATURE_FLAGS.WAR_ROOM_MODE).toBe('council-war-room-mode');
    expect(FEATURE_FLAGS.AGGRESSIVE_AGENTS).toBe('council-aggressive-agents');
  });

  it('should have enterprise feature flags', () => {
    expect(FEATURE_FLAGS.CHRONOS_ERP_INTEGRATION).toBe('chronos-erp-integration');
    expect(FEATURE_FLAGS.GNOSIS_RAG_ENABLED).toBe('gnosis-rag-enabled');
    expect(FEATURE_FLAGS.CRUCIBLE_MONTE_CARLO).toBe('crucible-monte-carlo');
  });

  it('should have security feature flags', () => {
    expect(FEATURE_FLAGS.ZERO_KNOWLEDGE_PROOFS).toBe('security-zk-proofs');
    expect(FEATURE_FLAGS.REGULATOR_MODE).toBe('security-regulator-mode');
  });

  it('should have experimental feature flags', () => {
    expect(FEATURE_FLAGS.AI_SELF_IMPROVEMENT).toBe('experimental-apotheosis');
    expect(FEATURE_FLAGS.DISSENT_PROTECTION).toBe('experimental-dissent');
  });

  it('should have all expected flags', () => {
    expect(Object.keys(FEATURE_FLAGS)).toHaveLength(9);
  });
});

// =============================================================================
// isFeatureEnabled TESTS
// Note: Module-level cache makes some tests difficult - testing API call format
// =============================================================================

describe('isFeatureEnabled', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetch with correct URL format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enabled: true }),
    });

    await isFeatureEnabled(FEATURE_FLAGS.GNOSIS_RAG_ENABLED);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/client/features/'),
      expect.any(Object)
    );
  });

  it('should include authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enabled: true }),
    });

    await isFeatureEnabled(FEATURE_FLAGS.CRUCIBLE_MONTE_CARLO);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should return boolean value', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enabled: true }),
    });

    const result = await isFeatureEnabled(FEATURE_FLAGS.CHRONOS_ERP_INTEGRATION);
    expect(typeof result).toBe('boolean');
  });
});

// =============================================================================
// getAllFeatureFlags TESTS
// =============================================================================

describe('getAllFeatureFlags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return object with all flag keys', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          features: [],
        }),
    });

    const result = await getAllFeatureFlags();

    // Should have all flag keys
    expect(Object.keys(result).length).toBe(Object.keys(FEATURE_FLAGS).length);
  });

  it('should handle network error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getAllFeatureFlags();

    // Should have all flag keys even on error
    expect(Object.keys(result)).toHaveLength(Object.keys(FEATURE_FLAGS).length);
  });
});

// =============================================================================
// useFeatureFlag TESTS
// =============================================================================

describe('useFeatureFlag', () => {
  it('should return true by default (simple version)', () => {
    const result = useFeatureFlag(FEATURE_FLAGS.WAR_ROOM_MODE);
    expect(result).toBe(true);
  });
});

// =============================================================================
// openUnleashDashboard TESTS
// =============================================================================

describe('openUnleashDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open Unleash dashboard in new tab', () => {
    openUnleashDashboard();

    expect(mockWindowOpen).toHaveBeenCalledWith('http://localhost:4242', '_blank');
  });
});
