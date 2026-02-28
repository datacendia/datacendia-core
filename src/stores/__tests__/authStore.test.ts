// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Auth Store Tests
 *
 * Tests for the Zustand auth store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';

// Mock fetch
global.fetch = vi.fn();

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'analyst' as const,
        organizationId: 'org-123',
      };

      useAuthStore.getState().setUser(mockUser);
      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear authentication when user is null', () => {
      // First set a user
      useAuthStore.getState().setUser({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'analyst' as const,
        organizationId: 'org-123',
      });

      // Then clear
      useAuthStore.getState().setUser(null);
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setTokens', () => {
    it('should set access token', () => {
      useAuthStore.getState().setTokens('access-token-123');
      const state = useAuthStore.getState();

      expect(state.token).toBe('access-token-123');
    });

    it('should set both tokens when refresh token provided', () => {
      useAuthStore.getState().setTokens('access-token-123', 'refresh-token-456');
      const state = useAuthStore.getState();

      expect(state.token).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-456');
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);

      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useAuthStore.getState().setError('Something went wrong');
      expect(useAuthStore.getState().error).toBe('Something went wrong');
    });

    it('should clear error when null', () => {
      useAuthStore.getState().setError('Error');
      useAuthStore.getState().setError(null);
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      useAuthStore.getState().setError('Error');
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear all auth state', () => {
      // Set up authenticated state
      useAuthStore.setState({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'analyst' as const,
          organizationId: 'org-123',
        },
        token: 'token-123',
        refreshToken: 'refresh-123',
        isAuthenticated: true,
        error: 'some error',
        lastActivity: Date.now(),
      });

      useAuthStore.getState().logout();
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastActivity).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user properties', () => {
      useAuthStore.getState().setUser({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'analyst' as const,
        organizationId: 'org-123',
      });

      useAuthStore.getState().updateUser({ firstName: 'Updated' });
      const state = useAuthStore.getState();

      expect(state.user?.firstName).toBe('Updated');
      expect(state.user?.lastName).toBe('User');
    });

    it('should not update if no user exists', () => {
      useAuthStore.getState().updateUser({ firstName: 'Updated' });
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('checkPermission', () => {
    it('should return true for admin role', () => {
      useAuthStore.getState().setUser({
        id: 'user-123',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
        organizationId: 'org-123',
      });

      expect(useAuthStore.getState().checkPermission('any-permission')).toBe(true);
    });

    it('should return false when not authenticated', () => {
      expect(useAuthStore.getState().checkPermission('some-permission')).toBe(false);
    });

    it('should check explicit permissions for non-admin users', () => {
      useAuthStore.getState().setUser({
        id: 'user-123',
        email: 'analyst@example.com',
        firstName: 'Analyst',
        lastName: 'User',
        role: 'analyst' as const,
        organizationId: 'org-123',
        permissions: ['read:decisions', 'write:decisions'],
      });

      expect(useAuthStore.getState().checkPermission('read:decisions')).toBe(true);
      expect(useAuthStore.getState().checkPermission('delete:all')).toBe(false);
    });
  });

  describe('touchActivity', () => {
    it('should update lastActivity timestamp', () => {
      const before = Date.now();
      useAuthStore.getState().touchActivity();
      const after = Date.now();

      const lastActivity = useAuthStore.getState().lastActivity;
      expect(lastActivity).toBeGreaterThanOrEqual(before);
      expect(lastActivity).toBeLessThanOrEqual(after);
    });
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        token: 'access-token-123',
        refreshToken: 'refresh-token-456',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'analyst',
          organizationId: 'org-123',
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await useAuthStore.getState().login('test@example.com', 'password');
      const state = useAuthStore.getState();

      expect(result).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('test@example.com');
      expect(state.token).toBe('access-token-123');
      expect(state.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      const result = await useAuthStore.getState().login('test@example.com', 'wrong-password');
      const state = useAuthStore.getState();

      expect(result).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
    });
  });
});
