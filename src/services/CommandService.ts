// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCommand™ Frontend Service
 * 
 * Vertical-specific AI command interface client
 */

import { api } from '@/lib/api/client';

export type VerticalId = 
  | 'financial'
  | 'legal'
  | 'healthcare'
  | 'government'
  | 'defense'
  | 'energy'
  | 'insurance'
  | 'manufacturing'
  | 'retail'
  | 'telecom'
  | 'aerospace'
  | 'pharma'
  | 'education'
  | 'realestate'
  | 'media';

export interface VerticalSummary {
  id: string;
  name: string;
  description: string;
  quickActionCount: number;
  primaryAgents: string[];
  complianceFrameworks: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: string;
  category: string;
  requiredRole?: string;
  estimatedTime?: string;
  agentsInvolved: string[];
  complianceFrameworks: string[];
}

export interface VerticalConfig {
  id: string;
  name: string;
  description: string;
  primaryAgents: string[];
  complianceFrameworks: string[];
  quickActions: QuickAction[];
}

export interface CommandIntent {
  action: 'query' | 'analyze' | 'review' | 'generate' | 'compare' | 'validate' | 'export' | 'monitor';
  subject: string;
  parameters: Record<string, any>;
  confidence: number;
  suggestedAgents: string[];
  relevantFrameworks: string[];
}

export interface CommandExecution {
  id: string;
  command: string;
  intent: CommandIntent;
  verticalId: VerticalId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  councilDeliberationId?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface CommandSuggestion {
  command: string;
  description: string;
  relevance: number;
  category: string;
}

export interface CommandContext {
  verticalId: VerticalId;
  userId: string;
  organizationId: string;
  sessionId: string;
  previousCommands?: CommandExecution[];
  activeDocuments?: string[];
  userRole?: string;
}

class CommandService {
  private baseUrl = '/api/v1/command';

  /**
   * Get all available verticals
   */
  async getVerticals(): Promise<VerticalSummary[]> {
    const response = await api.get<any>(
      `${this.baseUrl}/verticals`
    );
    return response.data.data;
  }

  /**
   * Get vertical configuration
   */
  async getVerticalConfig(verticalId: VerticalId): Promise<VerticalConfig> {
    const response = await api.get<any>(
      `${this.baseUrl}/verticals/${verticalId}`
    );
    return response.data.data;
  }

  /**
   * Get quick actions for a vertical
   */
  async getQuickActions(verticalId: VerticalId, category?: string): Promise<QuickAction[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await api.get<any>(
      `${this.baseUrl}/verticals/${verticalId}/quick-actions${params}`
    );
    return response.data.data;
  }

  /**
   * Parse a command to understand intent
   */
  async parseCommand(command: string, context: CommandContext): Promise<{ command: string; intent: CommandIntent }> {
    const response = await api.post<any>(
      `${this.baseUrl}/parse`,
      { command, context }
    );
    return response.data.data;
  }

  /**
   * Execute a command
   */
  async executeCommand(command: string, context: CommandContext): Promise<CommandExecution> {
    const response = await api.post<any>(
      `${this.baseUrl}/execute`,
      { command, context }
    );
    return response.data.data;
  }

  /**
   * Get command suggestions
   */
  async getSuggestions(partialCommand: string, context: CommandContext): Promise<CommandSuggestion[]> {
    const response = await api.post<any>(
      `${this.baseUrl}/suggest`,
      { partialCommand, context }
    );
    return response.data.data;
  }

  /**
   * Get execution history
   */
  async getHistory(verticalId: VerticalId, limit?: number): Promise<CommandExecution[]> {
    const params = limit ? `?verticalId=${verticalId}&limit=${limit}` : `?verticalId=${verticalId}`;
    const response = await api.get<any>(
      `${this.baseUrl}/history${params}`
    );
    return response.data.data;
  }

  /**
   * Get specific execution
   */
  async getExecution(id: string): Promise<CommandExecution> {
    const response = await api.get<any>(
      `${this.baseUrl}/execution/${id}`
    );
    return response.data.data;
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<{ service: string; status: string; verticalCount: number }> {
    const response = await api.get<any>(
      `${this.baseUrl}/health`
    );
    return {
      service: response.data.service,
      status: response.data.status,
      verticalCount: response.data.verticalCount,
    };
  }
}

export const commandService = new CommandService();
