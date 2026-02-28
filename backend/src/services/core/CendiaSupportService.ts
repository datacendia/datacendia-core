// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIASUPPORT™ - THE CARETAKER
// Automated Customer Success
// Ticket triage, churn prediction, proactive outreach
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SupportTicket {
  id: string;
  customerId: string;
  customerEmail: string;
  subject: string;
  content: string;
  category: 'bug' | 'question' | 'feature_request' | 'complaint' | 'billing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment: 'positive' | 'neutral' | 'negative' | 'angry';
  status: 'new' | 'triaged' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  assignedTo?: string;
  draftResponse?: string;
  githubIssue?: string;
  createdAt: Date;
  resolvedAt?: Date;
  firstResponseAt?: Date;
  tags: string[];
}

export interface CustomerHealth {
  customerId: string;
  email: string;
  healthScore: number; // 0-100
  riskLevel: 'healthy' | 'at_risk' | 'critical';
  signals: {
    lastLogin: Date | null;
    loginFrequency: number; // per week
    featureUsage: number; // % of features used
    supportTickets: number;
    ticketSentiment: string;
    paymentHistory: 'good' | 'issues' | 'past_due';
  };
  recommendations: string[];
  predictedChurnDate?: Date;
}

export interface TriageResult {
  ticket: SupportTicket;
  autoActions: {
    createGithubIssue: boolean;
    draftResponse: boolean;
    escalate: boolean;
    notifyFounder: boolean;
  };
  suggestedResponse: string;
}

export interface ChurnPrediction {
  customerId: string;
  probability: number; // 0-1
  daysUntilChurn: number;
  reasons: string[];
  interventions: string[];
}

// =============================================================================
// CENDIASUPPORT SERVICE
// =============================================================================

class CendiaSupportService {
  private tickets: Map<string, SupportTicket> = new Map();
  private customerActivity: Map<string, { lastLogin: Date; logins: Date[]; features: Set<string> }> = new Map();
  private responseTemplates: Map<string, string> = new Map([
    ['greeting', 'Thank you for reaching out to Datacendia Support.'],
    ['bug_ack', 'We have identified this as a bug and created an internal tracking issue.'],
    ['feature_ack', 'Thank you for the feature suggestion. We have added it to our roadmap consideration.'],
    ['resolution', 'This issue has been resolved. Please let us know if you have any other questions.'],
  ]);



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // TICKET TRIAGE
  // ---------------------------------------------------------------------------

  async triageTicket(email: Omit<SupportTicket, 'id' | 'category' | 'priority' | 'sentiment' | 'status' | 'createdAt' | 'tags'>): Promise<TriageResult> {
    const prompt = `Analyze this support email for Datacendia (AI Executive Council platform):

From: ${email.customerEmail}
Subject: ${email.subject}
Content: ${email.content}

Classify:
1. Category: bug, question, feature_request, complaint, billing, other
2. Priority: low, medium, high, urgent
3. Sentiment: positive, neutral, negative, angry
4. Tags: relevant keywords
5. Is this a technical bug that needs a GitHub issue?
6. Draft a helpful response

Output JSON:
{
  "category": "...",
  "priority": "...",
  "sentiment": "...",
  "tags": ["..."],
  "isGithubBug": true/false,
  "suggestedResponse": "..."
}`;

    try {
      const response = await ollama.generate(prompt, {});
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const ticket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        customerId: email.customerId,
        customerEmail: email.customerEmail,
        subject: email.subject,
        content: email.content,
        category: analysis.category || 'other',
        priority: analysis.priority || 'medium',
        sentiment: analysis.sentiment || 'neutral',
        status: 'triaged',
        draftResponse: analysis.suggestedResponse,
        createdAt: new Date(),
        tags: analysis.tags || [],
      };

      this.tickets.set(ticket.id, ticket);

      const autoActions = {
        createGithubIssue: analysis.isGithubBug && analysis.category === 'bug',
        draftResponse: true,
        escalate: analysis.sentiment === 'angry' || analysis.priority === 'urgent',
        notifyFounder: analysis.sentiment === 'angry' || analysis.category === 'complaint',
      };

      logger.info(`CendiaSupport: Triaged ticket ${ticket.id} as ${ticket.category}/${ticket.priority}`);

      return {
        ticket,
        autoActions,
        suggestedResponse: analysis.suggestedResponse || this.generateFallbackResponse(ticket),
      };
    } catch (error) {
      logger.error('Ticket triage failed:', error);
      
      // Fallback triage
      const ticket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        customerId: email.customerId,
        customerEmail: email.customerEmail,
        subject: email.subject,
        content: email.content,
        category: 'other',
        priority: 'medium',
        sentiment: 'neutral',
        status: 'new',
        createdAt: new Date(),
        tags: [],
      };

      this.tickets.set(ticket.id, ticket);

      return {
        ticket,
        autoActions: { createGithubIssue: false, draftResponse: false, escalate: false, notifyFounder: false },
        suggestedResponse: this.generateFallbackResponse(ticket),
      };
    }
  }

  private generateFallbackResponse(ticket: SupportTicket): string {
    const greeting = this.responseTemplates.get('greeting')!;
    
    switch (ticket.category) {
      case 'bug':
        return `${greeting}\n\n${this.responseTemplates.get('bug_ack')}\n\nWe are investigating and will update you shortly.`;
      case 'feature_request':
        return `${greeting}\n\n${this.responseTemplates.get('feature_ack')}\n\nWe appreciate your input!`;
      case 'billing':
        return `${greeting}\n\nFor billing inquiries, I am reviewing your account now and will respond within 24 hours.`;
      default:
        return `${greeting}\n\nI am reviewing your message and will respond shortly.`;
    }
  }

  // ---------------------------------------------------------------------------
  // CHURN PREDICTION
  // ---------------------------------------------------------------------------

  async predictChurn(customerId: string): Promise<ChurnPrediction> {
    const activity = this.customerActivity.get(customerId);
    const recentTickets = Array.from(this.tickets.values())
      .filter(t => t.customerId === customerId);

    // Calculate signals
    const daysSinceLogin = activity?.lastLogin 
      ? Math.floor((Date.now() - activity.lastLogin.getTime()) / (24 * 60 * 60 * 1000))
      : 30;

    const negativeTickets = recentTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
    const recentLogins = activity?.logins.filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;

    // Calculate churn probability
    let probability = 0;
    const reasons: string[] = [];

    if (daysSinceLogin > 7) {
      probability += 0.3;
      reasons.push(`No login for ${daysSinceLogin} days`);
    }
    if (daysSinceLogin > 14) {
      probability += 0.2;
    }
    if (negativeTickets > 0) {
      probability += 0.2 * negativeTickets;
      reasons.push(`${negativeTickets} negative support interactions`);
    }
    if (recentLogins < 2) {
      probability += 0.1;
      reasons.push('Low engagement this week');
    }

    probability = Math.min(probability, 1);

    // Generate interventions
    const interventions: string[] = [];
    if (daysSinceLogin > 3) {
      interventions.push('Send "We miss you" email with new feature highlights');
    }
    if (negativeTickets > 0) {
      interventions.push('Schedule CEO check-in call');
    }
    if (probability > 0.5) {
      interventions.push('Offer discount or extended trial');
      interventions.push('Assign dedicated success manager');
    }

    return {
      customerId,
      probability,
      daysUntilChurn: probability > 0 ? Math.round(30 * (1 - probability)) : 180,
      reasons,
      interventions,
    };
  }

  async getAtRiskCustomers(): Promise<ChurnPrediction[]> {
    const customers = Array.from(this.customerActivity.keys());
    const predictions: ChurnPrediction[] = [];

    for (const customerId of customers) {
      const prediction = await this.predictChurn(customerId);
      if (prediction.probability > 0.3) {
        predictions.push(prediction);
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER HEALTH
  // ---------------------------------------------------------------------------

  async getCustomerHealth(customerId: string): Promise<CustomerHealth> {
    const activity = this.customerActivity.get(customerId);
    const tickets = Array.from(this.tickets.values())
      .filter(t => t.customerId === customerId);

    const recentLogins = activity?.logins
      .filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0;

    const avgSentiment = tickets.length > 0
      ? tickets.filter(t => t.sentiment === 'positive').length / tickets.length
      : 0.5;

    // Calculate health score
    let healthScore = 70; // Base score
    
    if (recentLogins >= 5) healthScore += 15;
    else if (recentLogins === 0) healthScore -= 20;
    
    if (avgSentiment > 0.6) healthScore += 10;
    else if (avgSentiment < 0.3) healthScore -= 15;

    healthScore = Math.max(0, Math.min(100, healthScore));

    let riskLevel: CustomerHealth['riskLevel'] = 'healthy';
    if (healthScore < 40) riskLevel = 'critical';
    else if (healthScore < 60) riskLevel = 'at_risk';

    const recommendations: string[] = [];
    if (healthScore < 60) {
      recommendations.push('Schedule check-in call');
    }
    if (recentLogins < 2) {
      recommendations.push('Send engagement email with tips');
    }

    return {
      customerId,
      email: tickets[0]?.customerEmail || 'unknown',
      healthScore,
      riskLevel,
      signals: {
        lastLogin: activity?.lastLogin || null,
        loginFrequency: recentLogins,
        featureUsage: (activity?.features.size || 0) / 20 * 100, // Assume 20 features
        supportTickets: tickets.length,
        ticketSentiment: avgSentiment > 0.5 ? 'positive' : 'negative',
        paymentHistory: 'good',
      },
      recommendations,
    };
  }

  // ---------------------------------------------------------------------------
  // ACTIVITY TRACKING
  // ---------------------------------------------------------------------------

  recordLogin(customerId: string): void {
    const existing = this.customerActivity.get(customerId) || {
      lastLogin: new Date(),
      logins: [],
      features: new Set(),
    };

    existing.lastLogin = new Date();
    existing.logins.push(new Date());
    
    // Keep only last 30 days of logins
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    existing.logins = existing.logins.filter(l => l > thirtyDaysAgo);

    this.customerActivity.set(customerId, existing);
  }

  recordFeatureUsage(customerId: string, featureId: string): void {
    const existing = this.customerActivity.get(customerId);
    if (existing) {
      existing.features.add(featureId);
    }
  }

  // ---------------------------------------------------------------------------
  // TICKET MANAGEMENT
  // ---------------------------------------------------------------------------

  getTickets(filters?: { status?: string; priority?: string; customerId?: string }): SupportTicket[] {
    let tickets = Array.from(this.tickets.values());

    if (filters?.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }
    if (filters?.customerId) {
      tickets = tickets.filter(t => t.customerId === filters.customerId);
    }

    return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  resolveTicket(ticketId: string, resolution: string): void {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.resolvedAt = new Date();
      logger.info(`CendiaSupport: Resolved ticket ${ticketId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    openTickets: number;
    avgResolutionTime: number;
    avgFirstResponseTime: number;
    satisfactionScore: number;
    ticketsByCategory: Record<string, number>;
  } {
    const tickets = Array.from(this.tickets.values());
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, t) => {
          const time = t.resolvedAt ? t.resolvedAt.getTime() - t.createdAt.getTime() : 0;
          return sum + time;
        }, 0) / resolved.length / (60 * 60 * 1000) // Convert to hours
      : 0;

    const ticketsByCategory = tickets.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      openTickets: tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length,
      avgResolutionTime,
      avgFirstResponseTime: 2, // Hours - would calculate from actual data
      satisfactionScore: 85, // Would integrate with CSAT surveys
      ticketsByCategory,
    };
  }


  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Customer Success Intelligence Dashboard */
  getCustomerSuccessDashboard(): {
    overview: { totalTickets: number; openTickets: number; resolvedTickets: number; avgResolutionHours: number; avgFirstResponseHours: number; customersTracked: number; atRiskCustomers: number; healthyCustomers: number };
    ticketsByPriority: Array<{ priority: string; count: number; pctOfTotal: number; avgResolutionHours: number }>;
    ticketsByCategory: Array<{ category: string; count: number; pctOfTotal: number; openCount: number; avgSentiment: string }>;
    sentimentDistribution: Array<{ sentiment: string; count: number; pctOfTotal: number }>;
    resolutionEfficiency: { resolvedCount: number; avgHours: number; medianHours: number; under1Hour: number; under4Hours: number; under24Hours: number; over24Hours: number };
    customerHealthOverview: { totalCustomers: number; healthy: number; atRisk: number; critical: number; avgHealthScore: number; avgLoginFrequency: number; avgFeatureUsage: number };
    insights: string[];
  } {
    const tickets = Array.from(this.tickets.values());
    const total = tickets.length || 1;
    const open = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

    // Resolution times in hours
    const resolutionTimes = resolved
      .filter(t => t.resolvedAt)
      .map(t => (t.resolvedAt!.getTime() - t.createdAt.getTime()) / 3600000);
    const avgResolutionHours = resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length * 10) / 10
      : 0;
    const sortedTimes = [...resolutionTimes].sort((a, b) => a - b);
    const medianHours = sortedTimes.length > 0
      ? Math.round(sortedTimes[Math.floor(sortedTimes.length / 2)] * 10) / 10
      : 0;

    // First response times
    const firstResponseTimes = tickets
      .filter(t => t.firstResponseAt)
      .map(t => (t.firstResponseAt!.getTime() - t.createdAt.getTime()) / 3600000);
    const avgFirstResponseHours = firstResponseTimes.length > 0
      ? Math.round(firstResponseTimes.reduce((a, b) => a + b, 0) / firstResponseTimes.length * 10) / 10
      : 2;

    // Tickets by priority
    const priorities: SupportTicket['priority'][] = ['urgent', 'high', 'medium', 'low'];
    const ticketsByPriority = priorities.map(priority => {
      const pTickets = tickets.filter(t => t.priority === priority);
      const pResolved = pTickets.filter(t => t.resolvedAt);
      const pTimes = pResolved.map(t => (t.resolvedAt!.getTime() - t.createdAt.getTime()) / 3600000);
      return {
        priority,
        count: pTickets.length,
        pctOfTotal: Math.round((pTickets.length / total) * 100),
        avgResolutionHours: pTimes.length > 0 ? Math.round(pTimes.reduce((a, b) => a + b, 0) / pTimes.length * 10) / 10 : 0,
      };
    });

    // Tickets by category
    const categories: SupportTicket['category'][] = ['bug', 'question', 'feature_request', 'complaint', 'billing', 'other'];
    const ticketsByCategory = categories.map(category => {
      const cTickets = tickets.filter(t => t.category === category);
      const cOpen = cTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
      const posSent = cTickets.filter(t => t.sentiment === 'positive').length;
      const negSent = cTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
      const avgSentiment = posSent > negSent ? 'positive' : negSent > posSent ? 'negative' : 'neutral';
      return {
        category,
        count: cTickets.length,
        pctOfTotal: Math.round((cTickets.length / total) * 100),
        openCount: cOpen.length,
        avgSentiment,
      };
    }).filter(c => c.count > 0);

    // Sentiment distribution
    const sentiments: SupportTicket['sentiment'][] = ['positive', 'neutral', 'negative', 'angry'];
    const sentimentDistribution = sentiments.map(sentiment => ({
      sentiment,
      count: tickets.filter(t => t.sentiment === sentiment).length,
      pctOfTotal: Math.round((tickets.filter(t => t.sentiment === sentiment).length / total) * 100),
    })).filter(s => s.count > 0);

    // Resolution efficiency buckets
    const under1Hour = resolutionTimes.filter(t => t < 1).length;
    const under4Hours = resolutionTimes.filter(t => t >= 1 && t < 4).length;
    const under24Hours = resolutionTimes.filter(t => t >= 4 && t < 24).length;
    const over24Hours = resolutionTimes.filter(t => t >= 24).length;

    // Customer health overview
    const customers = Array.from(this.customerActivity.entries());
    let totalHealth = 0;
    let healthyCount = 0;
    let atRiskCount = 0;
    let criticalCount = 0;
    let totalLoginFreq = 0;
    let totalFeatureUsage = 0;

    for (const [custId, activity] of customers) {
      const recentLogins = activity.logins.filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      const custTickets = tickets.filter(t => t.customerId === custId);
      const avgSentiment = custTickets.length > 0
        ? custTickets.filter(t => t.sentiment === 'positive').length / custTickets.length
        : 0.5;
      let healthScore = 70;
      if (recentLogins >= 5) healthScore += 15;
      else if (recentLogins === 0) healthScore -= 20;
      if (avgSentiment > 0.6) healthScore += 10;
      else if (avgSentiment < 0.3) healthScore -= 15;
      healthScore = Math.max(0, Math.min(100, healthScore));

      totalHealth += healthScore;
      totalLoginFreq += recentLogins;
      totalFeatureUsage += (activity.features.size / 20) * 100;
      if (healthScore >= 60) healthyCount++;
      else if (healthScore >= 40) atRiskCount++;
      else criticalCount++;
    }

    const customerCount = customers.length || 1;

    // Insights
    const insights: string[] = [];
    const urgentOpen = open.filter(t => t.priority === 'urgent').length;
    if (urgentOpen > 0) insights.push(`${urgentOpen} urgent ticket(s) still open — assign and resolve immediately`);
    const angryTickets = tickets.filter(t => t.sentiment === 'angry' && t.status !== 'resolved' && t.status !== 'closed').length;
    if (angryTickets > 0) insights.push(`${angryTickets} ticket(s) from angry customers — escalate to founder for personal outreach`);
    if (criticalCount > 0) insights.push(`${criticalCount} customer(s) in critical health — trigger churn intervention playbook`);
    if (avgResolutionHours > 24) insights.push('Average resolution time exceeds 24 hours — consider hiring or automating tier-1 responses');
    const bugBacklog = tickets.filter(t => t.category === 'bug' && t.status !== 'resolved' && t.status !== 'closed').length;
    if (bugBacklog > 5) insights.push(`${bugBacklog} unresolved bug reports — sync with CendiaFoundry to prioritize fixes`);
    if (insights.length === 0) insights.push('Customer success operations are healthy across all dimensions');

    return {
      overview: {
        totalTickets: tickets.length, openTickets: open.length, resolvedTickets: resolved.length,
        avgResolutionHours, avgFirstResponseHours, customersTracked: customers.length,
        atRiskCustomers: atRiskCount + criticalCount, healthyCustomers: healthyCount,
      },
      ticketsByPriority,
      ticketsByCategory,
      sentimentDistribution,
      resolutionEfficiency: {
        resolvedCount: resolved.length, avgHours: avgResolutionHours, medianHours,
        under1Hour, under4Hours, under24Hours, over24Hours,
      },
      customerHealthOverview: {
        totalCustomers: customers.length, healthy: healthyCount, atRisk: atRiskCount, critical: criticalCount,
        avgHealthScore: Math.round(totalHealth / customerCount),
        avgLoginFrequency: Math.round((totalLoginFreq / customerCount) * 10) / 10,
        avgFeatureUsage: Math.round(totalFeatureUsage / customerCount),
      },
      insights,
    };
  }

  /** 10/10: Ticket Intelligence Analytics */
  async getTicketIntelligenceAnalytics(): Promise<{
    volumeTrends: { last7Days: number; last30Days: number; avgPerDay: number; peakDay: string; peakHour: number };
    categoryTrends: Array<{ category: string; recentCount: number; trend: 'rising' | 'stable' | 'declining'; avgResolutionHours: number; escalationRate: number }>;
    repeatOffenders: Array<{ customerId: string; email: string; ticketCount: number; avgSentiment: string; topCategory: string; lastTicketDate: Date }>;
    tagAnalysis: Array<{ tag: string; count: number; avgPriority: string; avgSentiment: string }>;
    aiInsights: { summary: string; topIssue: string; biggestRisk: string; recommendations: string[] };
  }> {
    const tickets = Array.from(this.tickets.values());
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const last7Days = tickets.filter(t => t.createdAt.getTime() > sevenDaysAgo).length;
    const last30Days = tickets.filter(t => t.createdAt.getTime() > thirtyDaysAgo).length;
    const avgPerDay = last30Days > 0 ? Math.round((last30Days / 30) * 10) / 10 : 0;

    // Peak day analysis
    const dayMap: Record<string, number> = {};
    const hourMap: Record<number, number> = {};
    tickets.forEach(t => {
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][t.createdAt.getDay()];
      dayMap[day] = (dayMap[day] || 0) + 1;
      const hour = t.createdAt.getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });
    const peakDay = Object.entries(dayMap).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
    const peakHour = Object.entries(hourMap).sort(([, a], [, b]) => b - a)[0]?.[0] ? parseInt(Object.entries(hourMap).sort(([, a], [, b]) => b - a)[0][0]) : 9;

    // Category trends
    const categories: SupportTicket['category'][] = ['bug', 'question', 'feature_request', 'complaint', 'billing', 'other'];
    const categoryTrends = categories.map(category => {
      const catTickets = tickets.filter(t => t.category === category);
      const recentCount = catTickets.filter(t => t.createdAt.getTime() > sevenDaysAgo).length;
      const olderCount = catTickets.filter(t => t.createdAt.getTime() <= sevenDaysAgo && t.createdAt.getTime() > thirtyDaysAgo).length;
      const weeklyOlder = olderCount / 3.3; // ~23 days / 7
      let trend: 'rising' | 'stable' | 'declining' = 'stable';
      if (recentCount > weeklyOlder * 1.3) trend = 'rising';
      else if (recentCount < weeklyOlder * 0.7 && weeklyOlder > 0) trend = 'declining';

      const resolved = catTickets.filter(t => t.resolvedAt);
      const avgRes = resolved.length > 0
        ? Math.round(resolved.reduce((s, t) => s + (t.resolvedAt!.getTime() - t.createdAt.getTime()) / 3600000, 0) / resolved.length * 10) / 10
        : 0;
      const escalated = catTickets.filter(t => t.sentiment === 'angry' || t.priority === 'urgent').length;

      return {
        category,
        recentCount,
        trend,
        avgResolutionHours: avgRes,
        escalationRate: catTickets.length > 0 ? Math.round((escalated / catTickets.length) * 100) : 0,
      };
    }).filter(c => c.recentCount > 0 || tickets.some(t => t.category === c.category));

    // Repeat offenders
    const customerTicketMap = new Map<string, SupportTicket[]>();
    tickets.forEach(t => {
      const arr = customerTicketMap.get(t.customerId) || [];
      arr.push(t);
      customerTicketMap.set(t.customerId, arr);
    });
    const repeatOffenders = Array.from(customerTicketMap.entries())
      .filter(([, tix]) => tix.length >= 2)
      .map(([customerId, tix]) => {
        const posSent = tix.filter(t => t.sentiment === 'positive').length;
        const negSent = tix.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
        const catCounts: Record<string, number> = {};
        tix.forEach(t => catCounts[t.category] = (catCounts[t.category] || 0) + 1);
        const topCategory = Object.entries(catCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'other';
        return {
          customerId,
          email: tix[0].customerEmail,
          ticketCount: tix.length,
          avgSentiment: posSent > negSent ? 'positive' : negSent > posSent ? 'negative' : 'neutral',
          topCategory,
          lastTicketDate: new Date(Math.max(...tix.map(t => t.createdAt.getTime()))),
        };
      })
      .sort((a, b) => b.ticketCount - a.ticketCount)
      .slice(0, 10);

    // Tag analysis
    const tagMap = new Map<string, SupportTicket[]>();
    tickets.forEach(t => {
      t.tags.forEach(tag => {
        const arr = tagMap.get(tag) || [];
        arr.push(t);
        tagMap.set(tag, arr);
      });
    });
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const tagAnalysis = Array.from(tagMap.entries()).map(([tag, tagTickets]) => {
      const avgPriorityNum = tagTickets.reduce((s, t) => s + (priorityOrder[t.priority] || 2), 0) / tagTickets.length;
      const avgPriority = avgPriorityNum >= 3.5 ? 'urgent' : avgPriorityNum >= 2.5 ? 'high' : avgPriorityNum >= 1.5 ? 'medium' : 'low';
      const posSent = tagTickets.filter(t => t.sentiment === 'positive').length;
      const negSent = tagTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
      return {
        tag,
        count: tagTickets.length,
        avgPriority,
        avgSentiment: posSent > negSent ? 'positive' : negSent > posSent ? 'negative' : 'neutral',
      };
    }).sort((a, b) => b.count - a.count).slice(0, 15);

    // AI insights
    let aiInsights = {
      summary: `${tickets.length} tickets analyzed across ${categories.filter(c => tickets.some(t => t.category === c)).length} categories`,
      topIssue: categoryTrends.sort((a, b) => b.recentCount - a.recentCount)[0]?.category || 'No tickets',
      biggestRisk: repeatOffenders[0] ? `Customer ${repeatOffenders[0].email} has ${repeatOffenders[0].ticketCount} tickets with ${repeatOffenders[0].avgSentiment} sentiment` : 'No repeat issues detected',
      recommendations: ['Monitor ticket volume trends weekly', 'Automate tier-1 responses for common questions'],
    };

    if (tickets.length > 0) {
      try {
        const prompt = `As CendiaSupport Customer Intelligence AI, analyze these support patterns:

Ticket Volume: ${tickets.length} total, ${last7Days} last 7 days, avg ${avgPerDay}/day
Category Breakdown: ${JSON.stringify(categoryTrends.slice(0, 5))}
Repeat Customers: ${repeatOffenders.length} customers with 2+ tickets
Sentiment: ${JSON.stringify(tickets.reduce((acc, t) => { acc[t.sentiment] = (acc[t.sentiment] || 0) + 1; return acc; }, {} as Record<string, number>))}

Output JSON:
{
  "summary": "2-sentence support health summary",
  "topIssue": "single biggest support issue",
  "biggestRisk": "single biggest customer risk",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
}`;

        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
        if (parsed.summary) aiInsights = parsed;
      } catch (error) {
        logger.warn('CendiaSupport: AI ticket intelligence fallback');
      }
    }

    return {
      volumeTrends: { last7Days, last30Days, avgPerDay, peakDay, peakHour },
      categoryTrends,
      repeatOffenders,
      tagAnalysis,
      aiInsights,
    };
  }

  /** 10/10: Churn Risk Intelligence */
  getChurnRiskIntelligence(): {
    riskOverview: { totalCustomers: number; healthyCount: number; atRiskCount: number; criticalCount: number; avgChurnProbability: number; estimatedRevenueAtRisk: number };
    riskBySignal: Array<{ signal: string; affectedCustomers: number; avgImpact: number; trend: string }>;
    customerRiskMatrix: Array<{ customerId: string; email: string; healthScore: number; riskLevel: string; daysSinceLogin: number; ticketCount: number; negativeTickets: number; loginFrequency: number; featureUsagePct: number; interventionUrgency: string }>;
    interventionPlaybook: Array<{ riskLevel: string; trigger: string; action: string; timeline: string; owner: string }>;
    retentionMetrics: { avgHealthScore: number; avgLoginFrequency: number; avgFeatureUsage: number; customersWithNoLoginWeek: number; customersWithNegativeSentiment: number };
    insights: string[];
  } {
    const tickets = Array.from(this.tickets.values());
    const customers = Array.from(this.customerActivity.entries());

    let healthyCount = 0;
    let atRiskCount = 0;
    let criticalCount = 0;
    let totalChurnProb = 0;
    let totalHealth = 0;
    let totalLoginFreq = 0;
    let totalFeatureUsage = 0;
    let noLoginWeekCount = 0;
    let negSentimentCount = 0;

    const customerRiskMatrix: Array<{
      customerId: string; email: string; healthScore: number; riskLevel: string;
      daysSinceLogin: number; ticketCount: number; negativeTickets: number;
      loginFrequency: number; featureUsagePct: number; interventionUrgency: string;
    }> = [];

    const signalCounts = {
      noRecentLogin: 0,
      lowFeatureUsage: 0,
      negativeSentiment: 0,
      multipleTickets: 0,
      urgentTickets: 0,
    };

    for (const [custId, activity] of customers) {
      const recentLogins = activity.logins.filter(l => l > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      const daysSinceLogin = activity.lastLogin
        ? Math.floor((Date.now() - activity.lastLogin.getTime()) / (24 * 60 * 60 * 1000))
        : 30;
      const custTickets = tickets.filter(t => t.customerId === custId);
      const negativeTickets = custTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;
      const featureUsagePct = Math.round((activity.features.size / 20) * 100);

      // Calculate health score
      let healthScore = 70;
      if (recentLogins >= 5) healthScore += 15;
      else if (recentLogins === 0) healthScore -= 20;
      const avgSentiment = custTickets.length > 0
        ? custTickets.filter(t => t.sentiment === 'positive').length / custTickets.length
        : 0.5;
      if (avgSentiment > 0.6) healthScore += 10;
      else if (avgSentiment < 0.3) healthScore -= 15;
      healthScore = Math.max(0, Math.min(100, healthScore));

      // Calculate churn probability
      let churnProb = 0;
      if (daysSinceLogin > 7) churnProb += 0.3;
      if (daysSinceLogin > 14) churnProb += 0.2;
      if (negativeTickets > 0) churnProb += 0.2 * negativeTickets;
      if (recentLogins < 2) churnProb += 0.1;
      churnProb = Math.min(churnProb, 1);

      let riskLevel = 'healthy';
      if (healthScore < 40) { riskLevel = 'critical'; criticalCount++; }
      else if (healthScore < 60) { riskLevel = 'at_risk'; atRiskCount++; }
      else { healthyCount++; }

      const interventionUrgency = riskLevel === 'critical' ? 'immediate' : riskLevel === 'at_risk' ? 'this_week' : 'monitor';

      // Track signals
      if (daysSinceLogin > 7) signalCounts.noRecentLogin++;
      if (featureUsagePct < 30) signalCounts.lowFeatureUsage++;
      if (negativeTickets > 0) { signalCounts.negativeSentiment++; negSentimentCount++; }
      if (custTickets.length >= 3) signalCounts.multipleTickets++;
      if (custTickets.some(t => t.priority === 'urgent')) signalCounts.urgentTickets++;
      if (recentLogins === 0) noLoginWeekCount++;

      totalChurnProb += churnProb;
      totalHealth += healthScore;
      totalLoginFreq += recentLogins;
      totalFeatureUsage += featureUsagePct;

      const email = custTickets[0]?.customerEmail || 'unknown';
      customerRiskMatrix.push({
        customerId: custId, email, healthScore, riskLevel,
        daysSinceLogin, ticketCount: custTickets.length, negativeTickets,
        loginFrequency: recentLogins, featureUsagePct, interventionUrgency,
      });
    }

    customerRiskMatrix.sort((a, b) => a.healthScore - b.healthScore);
    const customerCount = customers.length || 1;

    const riskBySignal = [
      { signal: 'No login in 7+ days', affectedCustomers: signalCounts.noRecentLogin, avgImpact: 30, trend: signalCounts.noRecentLogin > customerCount * 0.3 ? 'worsening' : 'stable' },
      { signal: 'Low feature usage (<30%)', affectedCustomers: signalCounts.lowFeatureUsage, avgImpact: 20, trend: 'stable' },
      { signal: 'Negative ticket sentiment', affectedCustomers: signalCounts.negativeSentiment, avgImpact: 25, trend: signalCounts.negativeSentiment > 3 ? 'worsening' : 'stable' },
      { signal: 'Multiple support tickets (3+)', affectedCustomers: signalCounts.multipleTickets, avgImpact: 15, trend: 'stable' },
      { signal: 'Urgent ticket filed', affectedCustomers: signalCounts.urgentTickets, avgImpact: 35, trend: signalCounts.urgentTickets > 2 ? 'worsening' : 'stable' },
    ].filter(s => s.affectedCustomers > 0);

    const interventionPlaybook = [
      { riskLevel: 'critical', trigger: 'Health score < 40', action: 'CEO personal outreach call + offer concession', timeline: 'Within 24 hours', owner: 'Founder' },
      { riskLevel: 'critical', trigger: 'No login 14+ days', action: 'Send personalized reactivation email with new feature highlights', timeline: 'Immediate', owner: 'CendiaSupport' },
      { riskLevel: 'at_risk', trigger: 'Health score 40-60', action: 'Schedule customer success check-in', timeline: 'Within 3 days', owner: 'Success Manager' },
      { riskLevel: 'at_risk', trigger: 'Negative sentiment spike', action: 'Review all open tickets and expedite resolution', timeline: 'Within 48 hours', owner: 'Support Lead' },
      { riskLevel: 'monitor', trigger: 'Feature usage < 30%', action: 'Send targeted onboarding guide for unused features', timeline: 'Weekly digest', owner: 'CendiaBrand' },
    ];

    // Estimated revenue at risk (assume $500/mo per at-risk customer)
    const estimatedRevenueAtRisk = (atRiskCount * 500) + (criticalCount * 500);

    const insights: string[] = [];
    if (criticalCount > 0) insights.push(`${criticalCount} customer(s) in critical health — activate immediate intervention playbook`);
    if (signalCounts.noRecentLogin > customerCount * 0.3 && customers.length > 0) insights.push(`${Math.round((signalCounts.noRecentLogin / customerCount) * 100)}% of customers haven't logged in this week — engagement campaign needed`);
    if (signalCounts.negativeSentiment > 2) insights.push(`${signalCounts.negativeSentiment} customers have negative support interactions — review and resolve before churn`);
    if (estimatedRevenueAtRisk > 0) insights.push(`Estimated $${estimatedRevenueAtRisk.toLocaleString()}/mo revenue at risk from churn`);
    if (insights.length === 0) insights.push('Customer retention is strong — maintain proactive engagement cadence');

    return {
      riskOverview: {
        totalCustomers: customers.length, healthyCount, atRiskCount, criticalCount,
        avgChurnProbability: Math.round((totalChurnProb / customerCount) * 100) / 100,
        estimatedRevenueAtRisk,
      },
      riskBySignal,
      customerRiskMatrix: customerRiskMatrix.slice(0, 20),
      interventionPlaybook,
      retentionMetrics: {
        avgHealthScore: Math.round(totalHealth / customerCount),
        avgLoginFrequency: Math.round((totalLoginFreq / customerCount) * 10) / 10,
        avgFeatureUsage: Math.round(totalFeatureUsage / customerCount),
        customersWithNoLoginWeek: noLoginWeekCount,
        customersWithNegativeSentiment: negSentimentCount,
      },
      insights,
    };
  }

  /** 10/10: Customer Engagement Analytics */
  getCustomerEngagementAnalytics(): {
    engagementOverview: { totalCustomers: number; activeThisWeek: number; activeThisMonth: number; dormant: number; avgSessionsPerWeek: number; avgFeaturesUsed: number; engagementScore: number };
    activityDistribution: Array<{ bucket: string; count: number; pctOfTotal: number }>;
    featureAdoption: Array<{ featureId: string; adoptionCount: number; adoptionPct: number }>;
    engagementCohorts: Array<{ cohort: string; count: number; avgLoginFrequency: number; avgFeatureUsage: number; avgHealthScore: number; trend: string }>;
    topEngagedCustomers: Array<{ customerId: string; email: string; loginFrequency: number; featuresUsed: number; healthScore: number; ticketSentiment: string }>;
    disengagementRisks: Array<{ customerId: string; email: string; daysSinceLogin: number; featureUsagePct: number; lastActivity: Date | null; suggestedAction: string }>;
    insights: string[];
  } {
    const tickets = Array.from(this.tickets.values());
    const customers = Array.from(this.customerActivity.entries());
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const customerCount = customers.length || 1;

    let activeThisWeek = 0;
    let activeThisMonth = 0;
    let dormant = 0;
    let totalSessions = 0;
    let totalFeaturesUsed = 0;

    // Feature adoption tracking
    const featureUsageMap = new Map<string, number>();

    const customerData: Array<{
      customerId: string; email: string; loginFrequency: number; featuresUsed: number;
      healthScore: number; daysSinceLogin: number; lastActivity: Date | null; ticketSentiment: string;
    }> = [];

    for (const [custId, activity] of customers) {
      const weekLogins = activity.logins.filter(l => l.getTime() > weekAgo).length;
      const monthLogins = activity.logins.filter(l => l.getTime() > monthAgo).length;
      const daysSinceLogin = activity.lastLogin
        ? Math.floor((now - activity.lastLogin.getTime()) / (24 * 60 * 60 * 1000))
        : 30;

      if (weekLogins > 0) activeThisWeek++;
      if (monthLogins > 0) activeThisMonth++;
      if (daysSinceLogin > 14) dormant++;

      totalSessions += weekLogins;
      totalFeaturesUsed += activity.features.size;

      activity.features.forEach(f => {
        featureUsageMap.set(f, (featureUsageMap.get(f) || 0) + 1);
      });

      // Calculate health score
      const custTickets = tickets.filter(t => t.customerId === custId);
      const avgSentiment = custTickets.length > 0
        ? custTickets.filter(t => t.sentiment === 'positive').length / custTickets.length
        : 0.5;
      let healthScore = 70;
      if (weekLogins >= 5) healthScore += 15;
      else if (weekLogins === 0) healthScore -= 20;
      if (avgSentiment > 0.6) healthScore += 10;
      else if (avgSentiment < 0.3) healthScore -= 15;
      healthScore = Math.max(0, Math.min(100, healthScore));

      const posSent = custTickets.filter(t => t.sentiment === 'positive').length;
      const negSent = custTickets.filter(t => t.sentiment === 'negative' || t.sentiment === 'angry').length;

      customerData.push({
        customerId: custId,
        email: custTickets[0]?.customerEmail || 'unknown',
        loginFrequency: weekLogins,
        featuresUsed: activity.features.size,
        healthScore,
        daysSinceLogin,
        lastActivity: activity.lastLogin,
        ticketSentiment: posSent > negSent ? 'positive' : negSent > posSent ? 'negative' : 'neutral',
      });
    }

    // Activity distribution
    const activityBuckets = [
      { bucket: 'Power Users (5+/week)', min: 5, max: Infinity },
      { bucket: 'Active (3-4/week)', min: 3, max: 4 },
      { bucket: 'Casual (1-2/week)', min: 1, max: 2 },
      { bucket: 'Dormant (0/week)', min: 0, max: 0 },
    ];
    const activityDistribution = activityBuckets.map(b => {
      const count = customerData.filter(c => c.loginFrequency >= b.min && c.loginFrequency <= b.max).length;
      return { bucket: b.bucket, count, pctOfTotal: Math.round((count / customerCount) * 100) };
    });

    // Feature adoption
    const featureAdoption = Array.from(featureUsageMap.entries())
      .map(([featureId, adoptionCount]) => ({
        featureId,
        adoptionCount,
        adoptionPct: Math.round((adoptionCount / customerCount) * 100),
      }))
      .sort((a, b) => b.adoptionCount - a.adoptionCount);

    // Engagement cohorts
    const engagementCohorts = [
      { cohort: 'Champions', filter: (c: typeof customerData[0]) => c.healthScore >= 80 && c.loginFrequency >= 5 },
      { cohort: 'Engaged', filter: (c: typeof customerData[0]) => c.healthScore >= 60 && c.loginFrequency >= 3 },
      { cohort: 'Moderate', filter: (c: typeof customerData[0]) => c.healthScore >= 40 && c.loginFrequency >= 1 },
      { cohort: 'At Risk', filter: (c: typeof customerData[0]) => c.healthScore < 40 || c.loginFrequency === 0 },
    ].map(cohort => {
      const members = customerData.filter(cohort.filter);
      return {
        cohort: cohort.cohort,
        count: members.length,
        avgLoginFrequency: members.length > 0 ? Math.round(members.reduce((s, c) => s + c.loginFrequency, 0) / members.length * 10) / 10 : 0,
        avgFeatureUsage: members.length > 0 ? Math.round(members.reduce((s, c) => s + c.featuresUsed, 0) / members.length * 10) / 10 : 0,
        avgHealthScore: members.length > 0 ? Math.round(members.reduce((s, c) => s + c.healthScore, 0) / members.length) : 0,
        trend: 'stable' as string,
      };
    });

    // Top engaged customers
    const topEngagedCustomers = [...customerData]
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 10)
      .map(c => ({
        customerId: c.customerId, email: c.email, loginFrequency: c.loginFrequency,
        featuresUsed: c.featuresUsed, healthScore: c.healthScore, ticketSentiment: c.ticketSentiment,
      }));

    // Disengagement risks
    const disengagementRisks = [...customerData]
      .filter(c => c.daysSinceLogin > 7 || c.loginFrequency === 0)
      .sort((a, b) => b.daysSinceLogin - a.daysSinceLogin)
      .slice(0, 10)
      .map(c => ({
        customerId: c.customerId, email: c.email, daysSinceLogin: c.daysSinceLogin,
        featureUsagePct: Math.round((c.featuresUsed / 20) * 100), lastActivity: c.lastActivity,
        suggestedAction: c.daysSinceLogin > 14 ? 'Send win-back campaign' : c.daysSinceLogin > 7 ? 'Send engagement nudge' : 'Monitor closely',
      }));

    const engagementScore = Math.round(
      ((activeThisWeek / customerCount) * 40) +
      ((totalFeaturesUsed / (customerCount * 20)) * 30) +
      ((1 - dormant / customerCount) * 30)
    );

    const insights: string[] = [];
    if (dormant > 0) insights.push(`${dormant} dormant customer(s) — activate re-engagement campaign via CendiaBrand`);
    const lowAdoption = featureAdoption.filter(f => f.adoptionPct < 20);
    if (lowAdoption.length > 0) insights.push(`${lowAdoption.length} feature(s) have <20% adoption — create targeted onboarding content`);
    const champions = engagementCohorts.find(c => c.cohort === 'Champions');
    if (champions && champions.count > 0) insights.push(`${champions.count} champion customer(s) identified — leverage for testimonials and referrals`);
    if (activeThisWeek < customerCount * 0.5 && customers.length > 0) insights.push('Less than 50% of customers active this week — review product stickiness');
    if (insights.length === 0) insights.push('Customer engagement is strong across all cohorts');

    return {
      engagementOverview: {
        totalCustomers: customers.length, activeThisWeek, activeThisMonth, dormant,
        avgSessionsPerWeek: Math.round((totalSessions / customerCount) * 10) / 10,
        avgFeaturesUsed: Math.round((totalFeaturesUsed / customerCount) * 10) / 10,
        engagementScore: Math.max(0, Math.min(100, engagementScore)),
      },
      activityDistribution,
      featureAdoption,
      engagementCohorts,
      topEngagedCustomers,
      disengagementRisks,
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaSupport', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.tickets.has(d.id)) this.tickets.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaSupport', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.responseTemplates.has(d.id)) this.responseTemplates.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaSupportService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaSupportService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaSupport',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaSupport',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaSupportService = new CendiaSupportService();
export default cendiaSupportService;
