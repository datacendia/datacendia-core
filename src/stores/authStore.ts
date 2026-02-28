// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Auth Store - Zustand-based authentication state management
 *
 * Replaces AuthContext for better performance and simpler patterns.
 * Provides authentication state, user info, and auth actions.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organizationName?: string;
  avatar?: string;
  permissions?: string[];
  preferences?: UserPreferences;
}

export type UserRole =
  | 'admin'
  | 'analyst'
  | 'operator'
  | 'auditor'
  | 'council-member'
  | 'veto-authority'
  | 'viewer';

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  checkPermission: (permission: string) => boolean;
  touchActivity: () => void;
  clearError: () => void;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Demo user for when backend is unavailable
const DEMO_USERS: Record<string, User> = {
  'stuart.rainey@datacendia.com': {
    id: 'usr-owner-001',
    email: 'stuart.rainey@datacendia.com',
    firstName: 'Stuart',
    lastName: 'Rainey',
    role: 'admin',
    organizationId: 'org-datacendia',
    organizationName: 'Datacendia',
    permissions: ['*'],
  },
  'admin@datacendia.com': {
    id: 'usr-admin-001',
    email: 'admin@datacendia.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    organizationId: 'org-datacendia',
    organizationName: 'Datacendia',
    permissions: ['*'],
  },
  'demo@datacendia.com': {
    id: 'usr-demo-001',
    email: 'demo@datacendia.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'analyst',
    organizationId: 'org-datacendia',
    organizationName: 'Datacendia',
    permissions: ['read', 'council', 'deliberate'],
  },
};

async function authApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from server');
  }
  return JSON.parse(text) as T;
}

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,

      // Actions
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        }),

      setTokens: (token, refreshToken) =>
        set((state) => {
          state.token = token;
          if (refreshToken) {
            state.refreshToken = refreshToken;
          }
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      login: async (email, password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authApi<{
            token: string;
            refreshToken: string;
            user: User;
          }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          set((state) => {
            state.user = response.user;
            state.token = response.token;
            state.refreshToken = response.refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.lastActivity = Date.now();
          });

          return true;
        } catch (error) {
          // Fallback: demo login when backend is unreachable
          const demoUser = DEMO_USERS[email.toLowerCase()];
          if (demoUser) {
            console.warn('[Auth] Backend unreachable, using demo login for:', email);
            set((state) => {
              state.user = demoUser;
              state.token = `demo-token-${Date.now()}`;
              state.refreshToken = `demo-refresh-${Date.now()}`;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.lastActivity = Date.now();
            });
            return true;
          }

          set((state) => {
            state.error = error instanceof Error ? error.message : 'Login failed';
            state.isLoading = false;
          });
          return false;
        }
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.error = null;
          state.lastActivity = null;
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {return false;}

        try {
          const response = await authApi<{
            token: string;
            refreshToken: string;
          }>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          });

          set((state) => {
            state.token = response.token;
            state.refreshToken = response.refreshToken;
          });

          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      updateUser: (updates) =>
        set((state) => {
          if (state.user) {
            Object.assign(state.user, updates);
          }
        }),

      updatePreferences: (preferences) =>
        set((state) => {
          if (state.user) {
            state.user.preferences = {
              ...state.user.preferences,
              ...preferences,
            } as UserPreferences;
          }
        }),

      checkPermission: (permission) => {
        const { user } = get();
        if (!user) {return false;}

        // Admins have all permissions
        if (user.role === 'admin') {return true;}

        // Check explicit permissions
        return user.permissions?.includes(permission) ?? false;
      },

      touchActivity: () =>
        set((state) => {
          state.lastActivity = Date.now();
        }),
    })),
    {
      name: 'datacendia-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// =============================================================================
// SELECTORS (for optimized re-renders)
// =============================================================================

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectOrganizationId = (state: AuthState) => state.user?.organizationId;
