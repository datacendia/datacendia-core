// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - THE AGENTS SERVICE
// AI Agent Management - Configure and monitor AI agents (The Pantheon)
// Enterprise Platinum Intelligence - PostgreSQL Ready
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type AgentStatus = 'online' | 'busy' | 'offline' | 'error';
export type AgentRole = 'chief' | 'cfo' | 'coo' | 'ciso' | 'cmo' | 'cro' | 'cdo' | 'risk' | 'legal' | 'hr' | 'strategy' | 'custom';

export interface AIAgent {
  id: string;
  code: string;
  name: string;
  displayName: string;
  role: AgentRole;
  description: string;
  icon: string;
  model: string;
  systemPrompt: string;
  capabilities: string[];
  status: AgentStatus;
  organizationId: string;
  createdAt: Date;
  lastActiveAt?: Date;
  queriesTotal: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
}

export interface AgentInteraction {
  id: string;
  agentId: string;
  organizationId: string;
  userId: string;
  query: string;
  response: string;
  responseTime: number;
  rating?: number;
  feedback?: string;
  createdAt: Date;
}

export interface AgentConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  contextWindow: number;
  specializations: string[];
}

export interface AgentStats {
  totalAgents: number;
  onlineAgents: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
  topAgents: { name: string; queries: number }[];
}

// Agent definitions are created through API calls - no default agents
// Users create agents via the Agents management interface

// =============================================================================
// THE AGENTS SERVICE
// =============================================================================

export class AgentsService extends BaseService {
  private agentsStore: Map<string, AIAgent> = new Map();
  private interactionsStore: Map<string, AgentInteraction[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'agents-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });


    this.loadFromDB().catch(() => {});
  }

  async initialize(): Promise<void> {
    this.logger.info('The Agents service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Agents service shutting down...');
    this.agentsStore.clear();
    this.interactionsStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const agents = Array.from(this.agentsStore.values());
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        totalAgents: agents.length,
        onlineAgents: agents.filter(a => a.status === 'online').length,
      },
    };
  }

  // ===========================================================================
  // AGENT MANAGEMENT
  // ===========================================================================

  async createAgent(agent: Omit<AIAgent, 'id' | 'createdAt' | 'queriesTotal' | 'queriesToday' | 'avgResponseTime' | 'satisfaction'>): Promise<AIAgent> {
    const id = `agent-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;

    const newAgent: AIAgent = {
      ...agent,
      id,
      createdAt: new Date(),
      queriesTotal: 0,
      queriesToday: 0,
      avgResponseTime: 0,
      satisfaction: 5.0,
    };

    this.agentsStore.set(id, newAgent);
    return newAgent;
  }

  async getAgent(agentId: string): Promise<AIAgent | null> {
    return this.agentsStore.get(agentId) || null;
  }

  async getAgentByCode(organizationId: string, code: string): Promise<AIAgent | null> {
    const agents = Array.from(this.agentsStore.values());
    return agents.find(a => a.organizationId === organizationId && a.code === code) || null;
  }

  async getAgents(organizationId: string): Promise<AIAgent[]> {
    return Array.from(this.agentsStore.values())
      .filter(a => a.organizationId === organizationId);
  }

  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<AIAgent | null> {
    const agent = this.agentsStore.get(agentId);
    if (!agent) return null;
    agent.status = status;
    if (status === 'online') agent.lastActiveAt = new Date();
    this.agentsStore.set(agentId, agent);
    return agent;
  }

  async updateAgentConfig(agentId: string, updates: Partial<AIAgent>): Promise<AIAgent | null> {
    const agent = this.agentsStore.get(agentId);
    if (!agent) return null;
    
    const updated = { ...agent, ...updates };
    this.agentsStore.set(agentId, updated);
    return updated;
  }

  // ===========================================================================
  // INTERACTIONS
  // ===========================================================================

  async recordInteraction(interaction: Omit<AgentInteraction, 'id' | 'createdAt'>): Promise<AgentInteraction> {
    const newInteraction: AgentInteraction = {
      ...interaction,
      id: `int-${Date.now()}`,
      createdAt: new Date(),
    };

    const interactions = this.interactionsStore.get(interaction.agentId) || [];
    interactions.push(newInteraction);
    if (interactions.length > 1000) interactions.shift(); // Keep last 1000
    this.interactionsStore.set(interaction.agentId, interactions);

    // Update agent stats
    const agent = this.agentsStore.get(interaction.agentId);
    if (agent) {
      agent.queriesTotal++;
      agent.queriesToday++;
      agent.lastActiveAt = new Date();
      
      // Update average response time
      const recentInteractions = interactions.slice(-100);
      agent.avgResponseTime = recentInteractions.reduce((sum, i) => sum + i.responseTime, 0) / recentInteractions.length;
      
      // Update satisfaction from ratings
      const ratedInteractions = recentInteractions.filter(i => i.rating !== undefined);
      if (ratedInteractions.length > 0) {
        agent.satisfaction = ratedInteractions.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInteractions.length;
      }
      
      this.agentsStore.set(interaction.agentId, agent);
    }

    return newInteraction;
  }

  async getInteractions(agentId: string, limit: number = 50): Promise<AgentInteraction[]> {
    const interactions = this.interactionsStore.get(agentId) || [];
    return interactions.slice(-limit).reverse();
  }

  async rateInteraction(interactionId: string, rating: number, feedback?: string): Promise<AgentInteraction | null> {
    for (const [agentId, interactions] of this.interactionsStore.entries()) {
      const interaction = interactions.find(i => i.id === interactionId);
      if (interaction) {
        interaction.rating = rating;
        interaction.feedback = feedback;
        this.interactionsStore.set(agentId, interactions);
        
        // Update agent satisfaction
        const agent = this.agentsStore.get(agentId);
        if (agent) {
          const ratedInteractions = interactions.filter(i => i.rating !== undefined);
          agent.satisfaction = ratedInteractions.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInteractions.length;
          this.agentsStore.set(agentId, agent);
        }
        
        return interaction;
      }
    }
    return null;
  }

  // ===========================================================================
  // STATS
  // ===========================================================================

  async getAgentStats(organizationId: string): Promise<AgentStats> {
    const agents = await this.getAgents(organizationId);
    
    const queriesToday = agents.reduce((sum, a) => sum + a.queriesToday, 0);
    const totalQueries = agents.reduce((sum, a) => sum + a.queriesTotal, 0);
    const avgResponseTime = agents.length > 0
      ? agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length
      : 0;
    const satisfaction = agents.length > 0
      ? agents.reduce((sum, a) => sum + a.satisfaction, 0) / agents.length
      : 5.0;

    const topAgents = agents
      .sort((a, b) => b.queriesToday - a.queriesToday)
      .slice(0, 5)
      .map(a => ({ name: a.displayName, queries: a.queriesToday }));

    return {
      totalAgents: agents.length,
      onlineAgents: agents.filter(a => a.status === 'online').length,
      queriesToday,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      satisfaction: Math.round(satisfaction * 10) / 10,
      topAgents,
    };
  }

  async resetDailyCounters(): Promise<void> {
    for (const agent of this.agentsStore.values()) {
      agent.queriesToday = 0;
    }
    this.logger.info('Reset daily query counters for all agents');
  }

  // No seed method - Enterprise Platinum standard
  // Agents are created through real API operations

  async hasAgentsForOrg(organizationId: string): Promise<boolean> {
    const agents = await this.getAgents(organizationId);
    return agents.length > 0;
  }

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getAgentPerformance(organizationId: string): Promise<any> {
    const agents = await this.getAgents(organizationId);
    const activeAgents = agents.filter(a => a.status === 'online');
    
    return {
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      totalQueries: agents.reduce((sum, a) => sum + a.queriesTotal, 0),
      queriesToday: agents.reduce((sum, a) => sum + a.queriesToday, 0),
      avgResponseTime: agents.length > 0 
        ? agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length 
        : 0,
      avgSatisfaction: agents.length > 0
        ? agents.reduce((sum, a) => sum + a.satisfaction, 0) / agents.length
        : 0,
    };
  }

  async getDeliberations(organizationId: string): Promise<any[]> {
    // Return deliberations from database
    const deliberations = await prisma.deliberations.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    // Provide a backward-compatible camelCase view while preserving all original fields
    return deliberations.map((d: any) => ({
      ...d,
      organizationId: d.organization_id,
      createdAt: d.created_at,
    }));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Agents', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agentsStore.has(d.id)) this.agentsStore.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'Agents', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.interactionsStore.has(d.id)) this.interactionsStore.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) this.logger.info(`[AgentsService] Restored ${restored} records from database`);


    } catch (err) {


      this.logger.warn(`[AgentsService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const agentsService = new AgentsService();
