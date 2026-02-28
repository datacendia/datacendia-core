// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AUTH CONTEXT
// Enterprise-grade authentication state management
// =============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenManager, onAuthChange } from '../lib/api/client';
import { authApi } from '../lib/api/services/auth';
import type { User } from '../lib/api/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
  inviteCode?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data) {
            setState({
              user: response.data as User,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          } else {
            // Token invalid, clear it
            tokenManager.clearTokens();
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          }
        } catch {
          tokenManager.clearTokens();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      }
    };

    initAuth();

    // Listen for auth changes (e.g., from other tabs)
    const unsubscribe = onAuthChange((isAuthenticated) => {
      if (!isAuthenticated) {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    });

    return unsubscribe;
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        // Fetch user details
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setState({
            user: userResponse.data as User,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
          return true;
        }
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error?.message || 'Login failed',
      }));
      return false;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        organizationName: data.organizationName,
      });

      if (response.success && response.data) {
        // Fetch user details
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setState({
            user: userResponse.data as User,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
          return true;
        }
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error?.message || 'Registration failed',
      }));
      return false;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors, clear local state anyway
    }

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!tokenManager.isAuthenticated()) {
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data as User,
        }));
      }
    } catch {
      // Silently fail, user data will remain stale
    }
  }, []);

  // Update user locally (optimistic update)
  const updateUser = useCallback((updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Permission check - role-based for now
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!state.user) {
        return false;
      }
      // Owners, Admins and Super Admins have all permissions
      if (state.user.role === 'OWNER' || state.user.role === 'ADMIN' || state.user.role === 'SUPER_ADMIN') {
        return true;
      }
      // Role-based permission mapping
      const rolePermissions: Record<string, string[]> = {
        OWNER: ['*'],
        SUPER_ADMIN: ['*'],
        ADMIN: ['*'],
        ANALYST: ['read', 'write', 'analyze', 'council', 'graph', 'pulse', 'lens', 'bridge'],
        VIEWER: ['read', 'council'],
      };
      return (
        rolePermissions[state.user.role]?.includes(permission) ||
        rolePermissions[state.user.role]?.includes('*') ||
        false
      );
    },
    [state.user]
  );

  // Role check
  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!state.user) {
        return false;
      }
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(state.user.role);
    },
    [state.user]
  );

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// HOOKS
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function usePermissions() {
  const { hasPermission, hasRole } = useAuth();
  return { hasPermission, hasRole };
}

export default AuthContext;
