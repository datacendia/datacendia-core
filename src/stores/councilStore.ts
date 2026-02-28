// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Council Store - AI Council deliberation state management
 *
 * Manages deliberation sessions, agent responses, and council queries.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface DeliberationMessage {
  id: string;
  agentId: string;
  agentName: string;
  phase: string;
  content: string;
  confidence?: number;
  sources?: Array<{
    type: string;
    title: string;
    url?: string;
  }>;
  timestamp: Date;
}

export interface Deliberation {
  id: string;
  organizationId: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  currentPhase?: string;
  progress: number;
  messages: DeliberationMessage[];
  decision?: {
    outcome: string;
    confidence: number;
    rationale: string;
    dissents?: Array<{
      agentId: string;
      agentName: string;
      reason: string;
    }>;
  };
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface CouncilState {
  // State
  agents: Agent[];
  activeDeliberation: Deliberation | null;
  deliberationHistory: Deliberation[];
  isLoading: boolean;
  isDeliberating: boolean;
  error: string | null;

  // Filters
  selectedAgents: string[];
  deliberationMode: 'consensus' | 'debate' | 'advisory' | 'voting';

  // Actions
  setAgents: (agents: Agent[]) => void;
  selectAgent: (agentId: string) => void;
  deselectAgent: (agentId: string) => void;
  setSelectedAgents: (agentIds: string[]) => void;
  setDeliberationMode: (mode: 'consensus' | 'debate' | 'advisory' | 'voting') => void;

  startDeliberation: (
    question: string,
    context?: Record<string, unknown>
  ) => Promise<string | null>;
  cancelDeliberation: (id: string) => void;
  addMessage: (message: DeliberationMessage) => void;
  updateDeliberationStatus: (
    status: Deliberation['status'],
    phase?: string,
    progress?: number
  ) => void;
  setDecision: (decision: Deliberation['decision']) => void;

  loadDeliberation: (id: string) => Promise<void>;
  loadHistory: (limit?: number) => Promise<void>;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function councilApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth')
    ? JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token
    : null;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error?.message || 'Request failed');
  }

  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useCouncilStore = create<CouncilState>()(
  immer((set, get) => ({
    // Initial State
    agents: [],
    activeDeliberation: null,
    deliberationHistory: [],
    isLoading: false,
    isDeliberating: false,
    error: null,
    selectedAgents: [],
    deliberationMode: 'consensus',

    // Agent Actions
    setAgents: (agents) =>
      set((state) => {
        state.agents = agents;
      }),

    selectAgent: (agentId) =>
      set((state) => {
        if (!state.selectedAgents.includes(agentId)) {
          state.selectedAgents.push(agentId);
        }
      }),

    deselectAgent: (agentId) =>
      set((state) => {
        state.selectedAgents = state.selectedAgents.filter((id: string) => id !== agentId);
      }),

    setSelectedAgents: (agentIds) =>
      set((state) => {
        state.selectedAgents = agentIds;
      }),

    setDeliberationMode: (mode) =>
      set((state) => {
        state.deliberationMode = mode;
      }),

    // Deliberation Actions
    startDeliberation: async (question, context) => {
      const { selectedAgents, deliberationMode } = get();

      set((state) => {
        state.isLoading = true;
        state.isDeliberating = true;
        state.error = null;
      });

      try {
        const response = await councilApi<{ deliberation: Deliberation }>(
          '/council/deliberations',
          {
            method: 'POST',
            body: JSON.stringify({
              question,
              context,
              config: {
                mode: deliberationMode,
                requiredAgents: selectedAgents.length > 0 ? selectedAgents : undefined,
              },
            }),
          }
        );

        set((state) => {
          state.activeDeliberation = {
            ...response.deliberation,
            messages: [],
            createdAt: new Date(),
          };
          state.isLoading = false;
        });

        return response.deliberation.id;
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to start deliberation';
          state.isLoading = false;
          state.isDeliberating = false;
        });
        return null;
      }
    },

    cancelDeliberation: (id) => {
      councilApi(`/council/deliberations/${id}/cancel`, { method: 'POST' }).catch(() => {});

      set((state) => {
        if (state.activeDeliberation?.id === id) {
          state.activeDeliberation.status = 'cancelled';
          state.isDeliberating = false;
        }
      });
    },

    addMessage: (message) =>
      set((state) => {
        if (state.activeDeliberation) {
          state.activeDeliberation.messages.push(message);
        }
      }),

    updateDeliberationStatus: (status, phase, progress) =>
      set((state) => {
        if (state.activeDeliberation) {
          state.activeDeliberation.status = status;
          if (phase !== undefined) {
            state.activeDeliberation.currentPhase = phase;
          }
          if (progress !== undefined) {
            state.activeDeliberation.progress = progress;
          }
          if (status === 'completed' || status === 'failed' || status === 'cancelled') {
            state.isDeliberating = false;
            state.activeDeliberation.completedAt = new Date();
          }
        }
      }),

    setDecision: (decision) =>
      set((state) => {
        if (state.activeDeliberation) {
          state.activeDeliberation.decision = decision;
          state.activeDeliberation.status = 'completed';
          state.activeDeliberation.completedAt = new Date();
          state.isDeliberating = false;
        }
      }),

    loadDeliberation: async (id) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await councilApi<{ deliberation: Deliberation }>(
          `/council/deliberations/${id}`
        );

        set((state) => {
          state.activeDeliberation = response.deliberation;
          state.isLoading = false;
          state.isDeliberating = response.deliberation.status === 'in_progress';
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to load deliberation';
          state.isLoading = false;
        });
      }
    },

    loadHistory: async (limit = 20) => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        const response = await councilApi<{ deliberations: Deliberation[] }>(
          `/council/deliberations?limit=${limit}`
        );

        set((state) => {
          state.deliberationHistory = response.deliberations;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to load history';
          state.isLoading = false;
        });
      }
    },

    // Utility Actions
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

    reset: () =>
      set((state) => {
        state.activeDeliberation = null;
        state.isDeliberating = false;
        state.error = null;
        state.selectedAgents = [];
      }),
  }))
);

// =============================================================================
// SELECTORS
// =============================================================================

export const selectAgents = (state: CouncilState) => state.agents;
export const selectActiveDeliberation = (state: CouncilState) => state.activeDeliberation;
export const selectIsDeliberating = (state: CouncilState) => state.isDeliberating;
export const selectDeliberationMessages = (state: CouncilState) =>
  state.activeDeliberation?.messages ?? [];
