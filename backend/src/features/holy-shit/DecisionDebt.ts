// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - DECISION DEBT DASHBOARD
// Real-time visibility into organizational decision bottlenecks
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import { prisma } from '../../config/database.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface DecisionDebtRequest {
  organizationId: string;
  userId: string;
  tier: SubscriptionTier;
  filters?: DecisionFilters;
}

export interface DecisionFilters {
  department?: string;
  owner?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'pending' | 'blocked' | 'deferred' | 'escalated';
  dateRange?: { start: Date; end: Date };
  minDaysStuck?: number;
}

export interface PendingDecision {
  id: string;
  title: string;
  description: string;
  department: string;
  owner: string;
  ownerEmail: string;
  createdAt: Date;
  dueDate?: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'blocked' | 'deferred' | 'escalated';
  daysStuck: number;
  estimatedDailyCost: number;
  totalCostAccrued: number;
  blockedBy: Blocker[];
  dependsOn: string[]; // Decision IDs
  blocks: string[]; // Decision IDs this decision blocks
  stakeholders: string[];
  lastActivity: Date;
  activityLog: ActivityEntry[];
}

export interface Blocker {
  id: string;
  type: 'person' | 'department' | 'external' | 'information' | 'approval' | 'budget' | 'decision';
  name: string;
  reason: string;
  blockedSince: Date;
  estimatedResolution?: Date;
  escalationLevel: number; // 0-3
}

export interface ActivityEntry {
  timestamp: Date;
  actor: string;
  action: string;
  details?: string;
}

export interface BlockerAnalysis {
  blockerId: string;
  blockerName: string;
  blockerType: string;
  decisionsBlocked: number;
  totalCostImpact: number;
  avgDaysBlocking: number;
  pattern: string;
  recommendation: string;
}

export interface DependencyNode {
  decisionId: string;
  decisionTitle: string;
  daysStuck: number;
  costPerDay: number;
  dependsOn: string[];
  blocks: string[];
  criticalPath: boolean;
}

export interface DecisionDebtDashboard {
  organizationId: string;
  generatedAt: Date;
  
  // Summary metrics
  summary: {
    totalPendingDecisions: number;
    totalBlockedDecisions: number;
    averageDaysStuck: number;
    dailyCost: number;
    weeklyCost: number;
    monthlyCost: number;
    annualProjectedLoss: number;
    debtScore: DebtScore;
  };

  // Decisions list
  decisions: PendingDecision[];
  
  // Blocker analysis
  topBlockers: BlockerAnalysis[];
  
  // Dependency map
  dependencyGraph: DependencyNode[];
  criticalPath: string[]; // Chain of decisions that are bottlenecking
  
  // Trends
  trends: {
    decisionsAddedLast7Days: number;
    decisionsResolvedLast7Days: number;
    avgResolutionTime: number;
    costTrend: 'increasing' | 'stable' | 'decreasing';
    debtTrend: 'worsening' | 'stable' | 'improving';
  };
  
  // Recommendations
  recommendations: Recommendation[];
}

export interface DebtScore {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  label: string;
  color: string;
}

export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  targetDecisions: string[];
  estimatedSavings: number;
  effort: 'low' | 'medium' | 'high';
}

// =============================================================================
// DECISION DEBT SERVICE
// =============================================================================

export class DecisionDebtService extends BaseService {
  private decisionCache: Map<string, PendingDecision[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'decision-debt',
      version: '1.0.0',
      dependencies: ['database'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('Decision Debt service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Decision Debt service shutting down...');
    this.decisionCache.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { cachedOrganizations: this.decisionCache.size },
    };
  }

  // ---------------------------------------------------------------------------
  // FEATURE ACCESS CHECK
  // ---------------------------------------------------------------------------

  checkAccess(tier: SubscriptionTier, organizationId: string): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'decisionDebtDashboard')) {
      return {
        allowed: false,
        reason: `Decision Debt Dashboard requires ${featureGating.getUpgradeTierForFeature('decisionDebtDashboard')} tier or higher.`,
      };
    }
    return { allowed: true };
  }

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD GENERATION
  // ---------------------------------------------------------------------------

  async generateDashboard(request: DecisionDebtRequest): Promise<DecisionDebtDashboard> {
    const startTime = Date.now();

    // Check feature access
    const access = this.checkAccess(request.tier, request.organizationId);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    this.logger.info(`Generating Decision Debt Dashboard for org: ${request.organizationId}`);

    // Fetch pending decisions
    const decisions = await this.fetchPendingDecisions(request.organizationId, request.filters);
    
    // Calculate summary metrics
    const summary = this.calculateSummary(decisions);
    
    // Analyze blockers
    const topBlockers = this.analyzeBlockers(decisions);
    
    // Build dependency graph
    const { dependencyGraph, criticalPath } = this.buildDependencyGraph(decisions);
    
    // Calculate trends
    const trends = await this.calculateTrends(request.organizationId);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(decisions, topBlockers, summary);

    const dashboard: DecisionDebtDashboard = {
      organizationId: request.organizationId,
      generatedAt: new Date(),
      summary,
      decisions,
      topBlockers,
      dependencyGraph,
      criticalPath,
      trends,
      recommendations,
    };

    this.recordMetric('dashboard_generation_ms', Date.now() - startTime);
    this.incrementCounter('dashboards_generated', 1);

    return dashboard;
  }

  // ---------------------------------------------------------------------------
  // DECISION FETCHING
  // ---------------------------------------------------------------------------

  private async fetchPendingDecisions(
    organizationId: string,
    filters?: DecisionFilters
  ): Promise<PendingDecision[]> {
    // Query real decisions from database, fall back to simulated data if none exist
    try {
      const where: any = {
        organization_id: organizationId,
        status: { in: ['PENDING', 'BLOCKED', 'DEFERRED'] },
      };
      if (filters?.department) where.department = filters.department;
      if (filters?.priority) where.priority = filters.priority.toUpperCase();

      const dbDecisions = await prisma.decisions.findMany({
        where,
        orderBy: { created_at: 'asc' },
        take: 100,
      });

      if (dbDecisions.length > 0) {
        return dbDecisions.map(d => this.mapDatabaseDecision(d));
      }
    } catch {
      // Database query failed — fall back to simulated data
    }

    return this.getSimulatedDecisions(organizationId);
  }

  private mapDatabaseDecision(d: any): PendingDecision {
    const now = new Date();
    const createdAt = new Date(d.createdAt);
    const daysStuck = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      id: d.id,
      title: d.title,
      description: d.description || '',
      department: d.department || 'General',
      owner: d.ownerName || 'Unassigned',
      ownerEmail: d.ownerEmail || '',
      createdAt,
      dueDate: d.dueDate ? new Date(d.dueDate) : undefined,
      priority: (d.priority?.toLowerCase() || 'medium') as 'critical' | 'high' | 'medium' | 'low',
      status: (d.status?.toLowerCase() || 'pending') as 'pending' | 'blocked' | 'deferred' | 'escalated',
      daysStuck,
      estimatedDailyCost: d.dailyCost || this.estimateDailyCost(d.priority),
      totalCostAccrued: (d.dailyCost || this.estimateDailyCost(d.priority)) * daysStuck,
      blockedBy: (d.blockers || []).map((b: any) => ({
        id: b.id,
        type: b.type?.toLowerCase() || 'person',
        name: b.name,
        reason: b.reason || '',
        blockedSince: new Date(b.blockedSince || d.createdAt),
        escalationLevel: b.escalationLevel || 0,
      })),
      dependsOn: (d.dependencies || []).filter((dep: any) => dep.type === 'DEPENDS_ON').map((dep: any) => dep.targetId),
      blocks: (d.dependencies || []).filter((dep: any) => dep.type === 'BLOCKS').map((dep: any) => dep.targetId),
      stakeholders: d.stakeholders || [],
      lastActivity: d.activities?.[0]?.timestamp ? new Date(d.activities[0].timestamp) : createdAt,
      activityLog: (d.activities || []).map((a: any) => ({
        timestamp: new Date(a.timestamp),
        actor: a.actor,
        action: a.action,
        details: a.details,
      })),
    };
  }

  private estimateDailyCost(priority: string): number {
    const costs: Record<string, number> = {
      critical: 5000,
      high: 2000,
      medium: 800,
      low: 200,
    };
    return costs[priority?.toLowerCase()] || 800;
  }

  private getSimulatedDecisions(organizationId: string): PendingDecision[] {
    // Deterministic demo decisions generated when no real data exists
    const now = new Date();
    
    return [
      {
        id: 'dec-1',
        title: 'Cloud Migration Strategy',
        description: 'Decide on cloud provider and migration timeline',
        department: 'Engineering',
        owner: 'VP Engineering',
        ownerEmail: 'vp.eng@company.com',
        createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        priority: 'critical',
        status: 'blocked',
        daysStuck: 21,
        estimatedDailyCost: 5000,
        totalCostAccrued: 105000,
        blockedBy: [
          {
            id: 'b1',
            type: 'approval',
            name: 'Budget Committee',
            reason: 'Waiting for Q1 budget approval',
            blockedSince: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
            escalationLevel: 2,
          },
        ],
        dependsOn: [],
        blocks: ['dec-2', 'dec-3'],
        stakeholders: ['CTO', 'CFO', 'CISO'],
        lastActivity: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        activityLog: [],
      },
      {
        id: 'dec-2',
        title: 'Hiring Plan Q2',
        description: 'Approve headcount for Q2 engineering expansion',
        department: 'HR',
        owner: 'VP HR',
        ownerEmail: 'vp.hr@company.com',
        createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'blocked',
        daysStuck: 18,
        estimatedDailyCost: 2000,
        totalCostAccrued: 36000,
        blockedBy: [
          {
            id: 'b2',
            type: 'decision',
            name: 'Cloud Migration Strategy',
            reason: 'Need to know cloud architecture before hiring',
            blockedSince: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
            escalationLevel: 1,
          },
        ],
        dependsOn: ['dec-1'],
        blocks: ['dec-4'],
        stakeholders: ['CEO', 'CFO', 'VP Engineering'],
        lastActivity: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        activityLog: [],
      },
      {
        id: 'dec-3',
        title: 'Q3 Product Roadmap',
        description: 'Finalize product priorities for Q3',
        department: 'Product',
        owner: 'VP Product',
        ownerEmail: 'vp.product@company.com',
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        daysStuck: 15,
        estimatedDailyCost: 3000,
        totalCostAccrued: 45000,
        blockedBy: [],
        dependsOn: ['dec-1'],
        blocks: [],
        stakeholders: ['CEO', 'CTO', 'VP Sales'],
        lastActivity: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        activityLog: [],
      },
      {
        id: 'dec-4',
        title: 'Series C Timeline',
        description: 'Determine fundraising timeline and targets',
        department: 'Finance',
        owner: 'CFO',
        ownerEmail: 'cfo@company.com',
        createdAt: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000),
        priority: 'critical',
        status: 'deferred',
        daysStuck: 34,
        estimatedDailyCost: 8000,
        totalCostAccrued: 272000,
        blockedBy: [
          {
            id: 'b3',
            type: 'person',
            name: 'Legal Review',
            reason: 'Contract negotiations with potential investors',
            blockedSince: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            escalationLevel: 0,
          },
        ],
        dependsOn: ['dec-2'],
        blocks: [],
        stakeholders: ['CEO', 'Board'],
        lastActivity: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        activityLog: [],
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // ANALYSIS FUNCTIONS
  // ---------------------------------------------------------------------------

  private calculateSummary(decisions: PendingDecision[]): DecisionDebtDashboard['summary'] {
    const totalPending = decisions.length;
    const totalBlocked = decisions.filter(d => d.status === 'blocked').length;
    const avgDays = decisions.reduce((sum, d) => sum + d.daysStuck, 0) / (totalPending || 1);
    const dailyCost = decisions.reduce((sum, d) => sum + d.estimatedDailyCost, 0);
    
    return {
      totalPendingDecisions: totalPending,
      totalBlockedDecisions: totalBlocked,
      averageDaysStuck: Math.round(avgDays * 10) / 10,
      dailyCost,
      weeklyCost: dailyCost * 7,
      monthlyCost: dailyCost * 30,
      annualProjectedLoss: dailyCost * 365,
      debtScore: this.calculateDebtScore(totalPending, avgDays, dailyCost),
    };
  }

  private calculateDebtScore(total: number, avgDays: number, dailyCost: number): DebtScore {
    // Score based on number of decisions, how long they're stuck, and cost
    const decisionScore = Math.max(0, 100 - total * 5);
    const daysScore = Math.max(0, 100 - avgDays * 3);
    const costScore = Math.max(0, 100 - dailyCost / 500);
    
    const score = Math.round((decisionScore + daysScore + costScore) / 3);
    
    if (score >= 90) return { grade: 'A', score, label: 'Excellent', color: '#22c55e' };
    if (score >= 75) return { grade: 'B', score, label: 'Good', color: '#84cc16' };
    if (score >= 60) return { grade: 'C', score, label: 'Needs Attention', color: '#eab308' };
    if (score >= 40) return { grade: 'D', score, label: 'Danger', color: '#f97316' };
    return { grade: 'F', score, label: 'Critical', color: '#ef4444' };
  }

  private analyzeBlockers(decisions: PendingDecision[]): BlockerAnalysis[] {
    const blockerMap = new Map<string, {
      name: string;
      type: string;
      decisions: PendingDecision[];
      totalDays: number;
    }>();

    for (const decision of decisions) {
      for (const blocker of decision.blockedBy) {
        const key = `${blocker.type}-${blocker.name}`;
        const existing = blockerMap.get(key) || {
          name: blocker.name,
          type: blocker.type,
          decisions: [],
          totalDays: 0,
        };
        existing.decisions.push(decision);
        existing.totalDays += decision.daysStuck;
        blockerMap.set(key, existing);
      }
    }

    return Array.from(blockerMap.entries())
      .map(([id, data]) => ({
        blockerId: id,
        blockerName: data.name,
        blockerType: data.type,
        decisionsBlocked: data.decisions.length,
        totalCostImpact: data.decisions.reduce((sum, d) => sum + d.totalCostAccrued, 0),
        avgDaysBlocking: Math.round(data.totalDays / data.decisions.length),
        pattern: data.decisions.length >= 3 ? 'Chronic blocker' : 'Temporary',
        recommendation: this.getBlockerRecommendation(data.type, data.decisions.length),
      }))
      .sort((a, b) => b.totalCostImpact - a.totalCostImpact)
      .slice(0, 10);
  }

  private getBlockerRecommendation(type: string, count: number): string {
    const recommendations: Record<string, string> = {
      person: count >= 3 
        ? 'Escalate to leadership. Consider delegation or process change.'
        : 'Schedule direct conversation to unblock.',
      department: 'Establish cross-functional working group.',
      approval: 'Fast-track approval process or delegate authority.',
      budget: 'Escalate to finance leadership for expedited review.',
      external: 'Assign dedicated owner to manage external dependency.',
      information: 'Conduct rapid discovery session to gather needed data.',
    };
    return recommendations[type] || 'Review and address blocker.';
  }

  private buildDependencyGraph(decisions: PendingDecision[]): {
    dependencyGraph: DependencyNode[];
    criticalPath: string[];
  } {
    const graph: DependencyNode[] = decisions.map(d => ({
      decisionId: d.id,
      decisionTitle: d.title,
      daysStuck: d.daysStuck,
      costPerDay: d.estimatedDailyCost,
      dependsOn: d.dependsOn,
      blocks: d.blocks,
      criticalPath: false,
    }));

    // Find critical path (longest chain of blocked decisions)
    const criticalPath = this.findCriticalPath(graph);
    
    // Mark critical path nodes
    for (const node of graph) {
      node.criticalPath = criticalPath.includes(node.decisionId);
    }

    return { dependencyGraph: graph, criticalPath };
  }

  private findCriticalPath(graph: DependencyNode[]): string[] {
    const nodeMap = new Map(graph.map(n => [n.decisionId, n]));
    let longestPath: string[] = [];

    const dfs = (nodeId: string, path: string[]): void => {
      const node = nodeMap.get(nodeId);
      if (!node) return;

      const currentPath = [...path, nodeId];
      if (currentPath.length > longestPath.length) {
        longestPath = currentPath;
      }

      for (const blockedId of node.blocks) {
        dfs(blockedId, currentPath);
      }
    };

    // Start from nodes with no dependencies
    const rootNodes = graph.filter(n => n.dependsOn.length === 0);
    for (const root of rootNodes) {
      dfs(root.decisionId, []);
    }

    return longestPath;
  }

  private async calculateTrends(organizationId: string): Promise<DecisionDebtDashboard['trends']> {
    // This would normally query historical data
    return {
      decisionsAddedLast7Days: 3,
      decisionsResolvedLast7Days: 1,
      avgResolutionTime: 12.5,
      costTrend: 'increasing',
      debtTrend: 'worsening',
    };
  }

  private generateRecommendations(
    decisions: PendingDecision[],
    blockers: BlockerAnalysis[],
    summary: DecisionDebtDashboard['summary']
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical path recommendation
    const criticalDecisions = decisions.filter(d => d.priority === 'critical' && d.daysStuck > 14);
    if (criticalDecisions.length > 0) {
      recommendations.push({
        id: 'rec-1',
        priority: 'critical',
        title: 'Unblock Critical Decisions',
        description: `${criticalDecisions.length} critical decision(s) have been stuck for over 2 weeks.`,
        expectedImpact: `Reduce daily cost by $${criticalDecisions.reduce((s, d) => s + d.estimatedDailyCost, 0).toLocaleString()}`,
        targetDecisions: criticalDecisions.map(d => d.id),
        estimatedSavings: criticalDecisions.reduce((s, d) => s + d.estimatedDailyCost * 30, 0),
        effort: 'high',
      });
    }

    // Top blocker recommendation
    if (blockers.length > 0 && blockers[0].decisionsBlocked >= 2) {
      recommendations.push({
        id: 'rec-2',
        priority: 'high',
        title: `Address Top Blocker: ${blockers[0].blockerName}`,
        description: `This ${blockers[0].blockerType} is blocking ${blockers[0].decisionsBlocked} decisions.`,
        expectedImpact: `Unblock ${blockers[0].decisionsBlocked} decisions immediately`,
        targetDecisions: decisions.filter(d => 
          d.blockedBy.some(b => `${b.type}-${b.name}` === blockers[0].blockerId)
        ).map(d => d.id),
        estimatedSavings: blockers[0].totalCostImpact,
        effort: 'medium',
      });
    }

    // Process improvement recommendation
    if (summary.averageDaysStuck > 10) {
      recommendations.push({
        id: 'rec-3',
        priority: 'medium',
        title: 'Implement Decision SLAs',
        description: 'Decisions are taking an average of ${summary.averageDaysStuck} days. Implement time-based escalation.',
        expectedImpact: 'Reduce average decision time by 50%',
        targetDecisions: [],
        estimatedSavings: summary.dailyCost * 15,
        effort: 'low',
      });
    }

    return recommendations;
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  async createDecision(organizationId: string, data: Partial<PendingDecision>): Promise<PendingDecision> {
    const decision: PendingDecision = {
      id: `dec-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      title: data.title || 'Untitled Decision',
      description: data.description || '',
      department: data.department || 'General',
      owner: data.owner || 'Unassigned',
      ownerEmail: data.ownerEmail || '',
      createdAt: new Date(),
      priority: data.priority || 'medium',
      status: 'pending',
      daysStuck: 0,
      estimatedDailyCost: data.estimatedDailyCost || 800,
      totalCostAccrued: 0,
      blockedBy: [],
      dependsOn: data.dependsOn || [],
      blocks: data.blocks || [],
      stakeholders: data.stakeholders || [],
      lastActivity: new Date(),
      activityLog: [{
        timestamp: new Date(),
        actor: data.owner || 'System',
        action: 'Decision created',
      }],
    };

    // Add to cache
    const cached = this.decisionCache.get(organizationId) || [];
    cached.push(decision);
    this.decisionCache.set(organizationId, cached);

    return decision;
  }

  async resolveDecision(organizationId: string, decisionId: string, resolution: string): Promise<void> {
    const cached = this.decisionCache.get(organizationId) || [];
    const index = cached.findIndex(d => d.id === decisionId);
    if (index !== -1) {
      cached.splice(index, 1);
      this.decisionCache.set(organizationId, cached);
    }
    
    this.incrementCounter('decisions_resolved', 1);
  }
}

// Export singleton
export const decisionDebtService = new DecisionDebtService();
