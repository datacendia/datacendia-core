// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - VERTICAL AI AGENTS FRONTEND SERVICE
// Enterprise Platinum Standard - Full Frontend Integration
// =============================================================================

import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export interface VerticalAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  specializations: string[];
  icon: string;
  status: 'active' | 'processing' | 'idle' | 'maintenance';
  model: string;
  temperature: number;
  systemPrompt: string;
}

export interface VerticalAgentConfig {
  verticalId: string;
  verticalName: string;
  agents: VerticalAgent[];
}

export interface AgentActivity {
  id: string;
  agentId: string;
  verticalId: string;
  action: string;
  result?: string;
  timestamp: Date;
  duration: number;
  success: boolean;
}

export interface AgentMetrics {
  agentId: string;
  decisionsToday: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: Date;
}

export interface VerticalMetrics {
  totalAgents: number;
  activeAgents: number;
  totalDecisionsToday: number;
  avgResponseTime: number;
  avgSuccessRate: number;
}

export interface GlobalMetrics {
  totalVerticals: number;
  totalAgents: number;
  totalDecisionsToday: number;
  topAgents: { agentId: string; name: string; decisions: number }[];
}

// =============================================================================
// API SERVICE
// =============================================================================

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

class VerticalAgentsApiService {
  private baseUrl = '/vertical-agents';

  // ===========================================================================
  // VERTICAL QUERIES
  // ===========================================================================

  async getAllVerticals(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(`${this.baseUrl}/verticals`);
    return response.data?.data ?? [];
  }

  async getVerticalConfig(verticalId: string): Promise<VerticalAgentConfig | null> {
    try {
      const response = await api.get<ApiResponse<VerticalAgentConfig>>(`${this.baseUrl}/verticals/${verticalId}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Error fetching vertical config:', error);
      return null;
    }
  }

  async getAgentsForVertical(verticalId: string): Promise<VerticalAgent[]> {
    const response = await api.get<ApiResponse<VerticalAgent[]>>(`${this.baseUrl}/verticals/${verticalId}/agents`);
    return response.data?.data ?? [];
  }

  async getVerticalMetrics(verticalId: string): Promise<VerticalMetrics> {
    const response = await api.get<ApiResponse<VerticalMetrics>>(`${this.baseUrl}/verticals/${verticalId}/metrics`);
    return response.data?.data ?? { totalAgents: 0, activeAgents: 0, totalDecisionsToday: 0, avgResponseTime: 0, avgSuccessRate: 0 };
  }

  // ===========================================================================
  // AGENT QUERIES
  // ===========================================================================

  async getAllAgents(): Promise<{ verticalId: string; agents: VerticalAgent[] }[]> {
    const response = await api.get<ApiResponse<{ verticalId: string; agents: VerticalAgent[] }[]>>(`${this.baseUrl}/agents`);
    return response.data?.data ?? [];
  }

  async searchAgents(query: string): Promise<VerticalAgent[]> {
    const response = await api.get<ApiResponse<VerticalAgent[]>>(`${this.baseUrl}/agents/search?q=${encodeURIComponent(query)}`);
    return response.data?.data ?? [];
  }

  async getAgent(agentId: string): Promise<VerticalAgent | null> {
    try {
      const response = await api.get<ApiResponse<VerticalAgent>>(`${this.baseUrl}/agents/${agentId}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  async getAgentMetrics(agentId: string): Promise<AgentMetrics | null> {
    try {
      const response = await api.get<ApiResponse<AgentMetrics>>(`${this.baseUrl}/agents/${agentId}/metrics`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      return null;
    }
  }

  async getAgentActivity(agentId: string, limit: number = 50): Promise<AgentActivity[]> {
    const response = await api.get<ApiResponse<AgentActivity[]>>(`${this.baseUrl}/agents/${agentId}/activity?limit=${limit}`);
    return response.data?.data ?? [];
  }

  // ===========================================================================
  // GLOBAL METRICS & ACTIVITY
  // ===========================================================================

  async getGlobalMetrics(): Promise<GlobalMetrics> {
    const response = await api.get<ApiResponse<GlobalMetrics>>(`${this.baseUrl}/metrics`);
    return response.data?.data ?? { totalVerticals: 0, totalAgents: 0, totalDecisionsToday: 0, topAgents: [] };
  }

  async getRecentActivity(limit: number = 50): Promise<AgentActivity[]> {
    const response = await api.get<ApiResponse<AgentActivity[]>>(`${this.baseUrl}/activity?limit=${limit}`);
    return response.data?.data ?? [];
  }

  async recordActivity(activity: {
    agentId: string;
    verticalId: string;
    action: string;
    result?: string;
    duration?: number;
    success?: boolean;
  }): Promise<AgentActivity> {
    const response = await api.post<ApiResponse<AgentActivity>>(`${this.baseUrl}/activity`, activity);
    return response.data?.data as AgentActivity;
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async healthCheck(): Promise<{ status: string; details: Record<string, unknown> }> {
    const response = await api.get<ApiResponse<{ status: string; details: Record<string, unknown> }>>(`${this.baseUrl}/health`);
    return response.data?.data ?? { status: 'unknown', details: {} };
  }
}

// Export singleton instance
export const verticalAgentsApi = new VerticalAgentsApiService();

// =============================================================================
// REACT HOOKS (for convenience)
// Requires @tanstack/react-query to be installed
// =============================================================================

// @ts-ignore - Optional dependency
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useVerticals = () => {
  return useQuery({
    queryKey: ['verticals'],
    queryFn: () => verticalAgentsApi.getAllVerticals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVerticalConfig = (verticalId: string) => {
  return useQuery({
    queryKey: ['vertical-config', verticalId],
    queryFn: () => verticalAgentsApi.getVerticalConfig(verticalId),
    enabled: !!verticalId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVerticalAgents = (verticalId: string) => {
  return useQuery({
    queryKey: ['vertical-agents', verticalId],
    queryFn: () => verticalAgentsApi.getAgentsForVertical(verticalId),
    enabled: !!verticalId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVerticalMetrics = (verticalId: string) => {
  return useQuery({
    queryKey: ['vertical-metrics', verticalId],
    queryFn: () => verticalAgentsApi.getVerticalMetrics(verticalId),
    enabled: !!verticalId,
    staleTime: 30 * 1000, // 30 seconds for metrics
  });
};

export const useAllAgents = () => {
  return useQuery({
    queryKey: ['all-agents'],
    queryFn: () => verticalAgentsApi.getAllAgents(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAgentSearch = (query: string) => {
  return useQuery({
    queryKey: ['agent-search', query],
    queryFn: () => verticalAgentsApi.searchAgents(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
};

export const useAgent = (agentId: string) => {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => verticalAgentsApi.getAgent(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAgentMetrics = (agentId: string) => {
  return useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: () => verticalAgentsApi.getAgentMetrics(agentId),
    enabled: !!agentId,
    staleTime: 30 * 1000,
  });
};

export const useAgentActivity = (agentId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['agent-activity', agentId, limit],
    queryFn: () => verticalAgentsApi.getAgentActivity(agentId, limit),
    enabled: !!agentId,
    staleTime: 10 * 1000, // 10 seconds for activity
  });
};

export const useGlobalMetrics = () => {
  return useQuery({
    queryKey: ['global-metrics'],
    queryFn: () => verticalAgentsApi.getGlobalMetrics(),
    staleTime: 30 * 1000,
  });
};

export const useRecentActivity = (limit: number = 50) => {
  return useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: () => verticalAgentsApi.getRecentActivity(limit),
    staleTime: 10 * 1000,
  });
};

export const useRecordActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (activity: {
      agentId: string;
      verticalId: string;
      action: string;
      result?: string;
      duration?: number;
      success?: boolean;
    }) => verticalAgentsApi.recordActivity(activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] });
      queryClient.invalidateQueries({ queryKey: ['agent-activity'] });
      queryClient.invalidateQueries({ queryKey: ['agent-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['global-metrics'] });
    },
  });
};
