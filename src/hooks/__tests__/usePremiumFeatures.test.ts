// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// PREMIUM FEATURES HOOK TESTS
// Unit tests for usePremiumFeatures.ts
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePremiumFeatures } from '../usePremiumFeatures';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock premiumFeatures data (pillar-based 3-tier architecture)
vi.mock('../../data/premiumFeatures', () => ({
  PREMIUM_FEATURES: [
    { id: 'the-council', name: 'THE COUNCIL' },
    { id: 'decide', name: 'DECIDE' },
    { id: 'dcii', name: 'DCII' },
    { id: 'stress-test', name: 'STRESS TEST' },
    { id: 'comply', name: 'COMPLY' },
    { id: 'verticals', name: 'VERTICALS' },
    { id: 'api-access', name: 'API Access' },
    { id: 'team-collaboration', name: 'Team Collaboration' },
  ],
  PREMIUM_BUNDLES: [
    {
      id: 'foundation-bundle',
      name: 'Foundation Bundle',
      includedFeatures: ['the-council', 'decide', 'dcii'],
    },
    {
      id: 'enterprise-bundle',
      name: 'Enterprise Bundle',
      includedFeatures: ['stress-test', 'comply', 'api-access', 'team-collaboration'],
    },
  ],
  getFeatureById: vi.fn((id: string) => {
    const features: Record<string, any> = {
      'the-council': { id: 'the-council', name: 'THE COUNCIL', price: 50000 },
      'decide': { id: 'decide', name: 'DECIDE', price: 50000 },
      'dcii': { id: 'dcii', name: 'DCII', price: 50000 },
      'stress-test': { id: 'stress-test', name: 'STRESS TEST', price: 75000 },
      'comply': { id: 'comply', name: 'COMPLY', price: 75000 },
      'verticals': { id: 'verticals', name: 'VERTICALS', price: 100000 },
      'api-access': { id: 'api-access', name: 'API Access', price: 25000 },
      'team-collaboration': { id: 'team-collaboration', name: 'Team Collaboration', price: 15000 },
    };
    return features[id];
  }),
  getBundleById: vi.fn((id: string) => {
    const bundles: Record<string, any> = {
      'foundation-bundle': {
        id: 'foundation-bundle',
        name: 'Foundation Bundle',
        includedFeatures: ['the-council', 'decide', 'dcii'],
      },
      'enterprise-bundle': {
        id: 'enterprise-bundle',
        name: 'Enterprise Bundle',
        includedFeatures: ['stress-test', 'comply', 'api-access', 'team-collaboration'],
      },
    };
    return bundles[id];
  }),
}));

// =============================================================================
// TESTS
// =============================================================================

describe('usePremiumFeatures', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty purchased features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toEqual([]);
      expect(result.current.purchasedBundles).toEqual([]);
    });

    it('should load state from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['the-council'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toContain('the-council');
    });

    it('should handle invalid localStorage data', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toEqual([]);
    });
  });

  describe('hasFeature', () => {
    it('should return true for purchased feature', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['the-council'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('the-council')).toBe(true);
    });

    it('should return false for unpurchased feature', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('the-council')).toBe(false);
    });

    it('should return true for feature included in purchased bundle', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: [],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('stress-test')).toBe(true);
      expect(result.current.hasFeature('api-access')).toBe(true);
    });
  });

  describe('hasAgentAccess', () => {
    it('should return true for non-premium agents', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-strategist')).toBe(true);
    });

    it('should return false for premium agent without feature', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-cfo')).toBe(false);
    });

    it('should return true for premium agent with feature', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['the-council'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-cfo')).toBe(true);
    });
  });

  describe('getAgentRequiredFeature', () => {
    it('should return undefined for non-premium agent', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.getAgentRequiredFeature('agent-strategist')).toBeUndefined();
    });

    it('should return feature for premium agent', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      const feature = result.current.getAgentRequiredFeature('agent-cfo');
      expect(feature?.id).toBe('the-council');
    });
  });

  describe('purchaseFeature', () => {
    it('should add feature to purchased list', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('the-council');
      });

      expect(result.current.purchasedFeatures).toContain('the-council');
    });

    it('should not duplicate features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('the-council');
        result.current.purchaseFeature('the-council');
      });

      expect(result.current.purchasedFeatures.filter((f) => f === 'the-council')).toHaveLength(
        1
      );
    });

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('the-council');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('purchaseBundle', () => {
    it('should add bundle and its features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseBundle('enterprise-bundle');
      });

      expect(result.current.purchasedBundles).toContain('enterprise-bundle');
      expect(result.current.purchasedFeatures).toContain('stress-test');
      expect(result.current.purchasedFeatures).toContain('api-access');
      expect(result.current.purchasedFeatures).toContain('team-collaboration');
    });

    it('should handle invalid bundle gracefully', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseBundle('invalid-bundle');
      });

      expect(result.current.purchasedBundles).not.toContain('invalid-bundle');
    });
  });

  describe('getUnlockedFeatures', () => {
    it('should return all unlocked features', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['verticals'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      const unlocked = result.current.getUnlockedFeatures();
      expect(unlocked).toContain('verticals');
      expect(unlocked).toContain('stress-test');
      expect(unlocked).toContain('api-access');
    });

    it('should not have duplicates', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['stress-test'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      const unlocked = result.current.getUnlockedFeatures();
      expect(unlocked.filter((f) => f === 'stress-test')).toHaveLength(1);
    });
  });

  describe('canCreateCustomAgents', () => {
    it('should return false without agent-builder', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.canCreateCustomAgents()).toBe(false);
    });

    it('should return true with agent-builder', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['agent-builder'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.canCreateCustomAgents()).toBe(true);
    });
  });

  describe('hasApiAccess', () => {
    it('should return false without api-access', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasApiAccess()).toBe(false);
    });

    it('should return true with api-access', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['api-access'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasApiAccess()).toBe(true);
    });
  });

  describe('hasTeamFeatures', () => {
    it('should return false without team features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasTeamFeatures()).toBe(false);
    });

    it('should return true with team-collaboration', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['team-collaboration'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasTeamFeatures()).toBe(true);
    });
  });

  describe('resetPurchases', () => {
    it('should clear all purchases', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['the-council', 'api-access'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.resetPurchases();
      });

      expect(result.current.purchasedFeatures).toEqual([]);
      expect(result.current.purchasedBundles).toEqual([]);
    });
  });

  describe('unlockAll', () => {
    it('should unlock all features and bundles', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.unlockAll();
      });

      expect(result.current.purchasedFeatures.length).toBeGreaterThan(0);
      expect(result.current.purchasedBundles.length).toBeGreaterThan(0);
    });
  });
});
