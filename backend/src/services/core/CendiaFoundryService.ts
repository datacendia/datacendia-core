// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAFOUNDRY™ - THE ARCHITECT
// Product Management & R&D Intelligence
// Prioritizes features, tracks technical debt, guides development
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'enterprise' | 'premium' | 'infrastructure' | 'experiment';
  status: 'backlog' | 'planned' | 'in_progress' | 'testing' | 'shipped';
  priority: number; // 1-100
  effort: 'xs' | 's' | 'm' | 'l' | 'xl';
  impact: 'low' | 'medium' | 'high' | 'critical';
  demandSignal: number; // 0-100 based on user feedback
  dependencies: string[];
  assignee?: string;
  dueDate?: Date;
  completedDate?: Date;
}

export interface TechnicalDebt {
  id: string;
  file: string;
  type: 'complexity' | 'duplication' | 'outdated' | 'security' | 'performance' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  estimatedHours: number;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface UserFeedback {
  id: string;
  source: 'support' | 'survey' | 'interview' | 'analytics' | 'social';
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  featureRequest?: string;
  painPoint?: string;
  createdAt: Date;
}

export interface FeatureRecommendation {
  featureId: string;
  featureName: string;
  score: number;
  reasoning: string[];
  demandSignals: {
    feedbackMentions: number;
    competitorHas: boolean;
    marketTrend: 'growing' | 'stable' | 'declining';
  };
  buildRecommendation: 'build_now' | 'plan_next' | 'monitor' | 'deprioritize';
}

export interface CodeHealthReport {
  overallScore: number; // 0-100
  technicalDebt: TechnicalDebt[];
  hotspots: { file: string; issues: number; recommendation: string }[];
  recommendations: string[];
  blockers: string[]; // Things that must be fixed before adding features
}

// =============================================================================
// CENDIAFOUNDRY SERVICE
// =============================================================================

class CendiaFoundryService {
  private roadmap: Map<string, RoadmapItem> = new Map();
  private technicalDebt: Map<string, TechnicalDebt> = new Map();
  private feedback: UserFeedback[] = [];
  private twentyYearVision: string[] = [
    'Year 1-2: Establish AI Executive Council as category leader',
    'Year 3-5: Expand to full enterprise operations platform',
    'Year 6-10: Become the standard corporate operating system',
    'Year 11-15: Autonomous enterprise management',
    'Year 16-20: Human-AI organizational symbiosis',
  ];



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // FEATURE PRIORITIZATION
  // ---------------------------------------------------------------------------

  async prioritizeFeatures(): Promise<FeatureRecommendation[]> {
    const features = Array.from(this.roadmap.values())
      .filter(f => f.status === 'backlog' || f.status === 'planned');

    const recommendations: FeatureRecommendation[] = [];

    for (const feature of features) {
      // Calculate demand signal from feedback
      const feedbackMentions = this.feedback.filter(
        f => f.featureRequest?.toLowerCase().includes(feature.name.toLowerCase()) ||
             f.content.toLowerCase().includes(feature.name.toLowerCase())
      ).length;

      // Calculate priority score
      const impactScore = { low: 25, medium: 50, high: 75, critical: 100 }[feature.impact];
      const effortPenalty = { xs: 0, s: 5, m: 15, l: 30, xl: 50 }[feature.effort];
      const demandBonus = Math.min(feedbackMentions * 5, 30);
      
      const score = Math.min(100, impactScore - effortPenalty + demandBonus + feature.demandSignal * 0.2);

      let buildRecommendation: FeatureRecommendation['buildRecommendation'];
      if (score >= 75) buildRecommendation = 'build_now';
      else if (score >= 50) buildRecommendation = 'plan_next';
      else if (score >= 30) buildRecommendation = 'monitor';
      else buildRecommendation = 'deprioritize';

      recommendations.push({
        featureId: feature.id,
        featureName: feature.name,
        score,
        reasoning: [
          `Impact: ${feature.impact} (${impactScore} pts)`,
          `Effort: ${feature.effort} (-${effortPenalty} pts)`,
          `Demand: ${feedbackMentions} mentions (+${demandBonus} pts)`,
        ],
        demandSignals: {
          feedbackMentions,
          competitorHas: false, // Would integrate with CendiaWatch
          marketTrend: 'growing',
        },
        buildRecommendation,
      });
    }

    // Sort by score
    return recommendations.sort((a, b) => b.score - a.score);
  }

  async getNextFeatureRecommendation(): Promise<string> {
    const priorities = await this.prioritizeFeatures();
    const top = priorities[0];

    if (!top) {
      return 'No features in backlog. Time to brainstorm!';
    }

    const prompt = `As the Product Architect for Datacendia (AI Executive Council platform), explain why "${top.featureName}" should be built next.

Score: ${top.score}/100
Reasoning: ${top.reasoning.join(', ')}
Demand: ${top.demandSignals.feedbackMentions} user mentions

Write a 2-sentence recommendation for the founder.`;

    try {
      return await ollama.generate(prompt, { model: 'llama3.2:3b' });
    } catch (error) {
      return `Build ${top.featureName} next. Score: ${top.score}/100. ${top.reasoning[0]}.`;
    }
  }

  // ---------------------------------------------------------------------------
  // TECHNICAL DEBT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeCodeHealth(codebaseSummary: string): Promise<CodeHealthReport> {
    const prompt = `Analyze this codebase summary for technical debt:

${codebaseSummary}

Identify:
1. High-complexity areas that need refactoring
2. Potential performance bottlenecks
3. Security concerns
4. Documentation gaps

Output JSON: {
  "score": 0-100,
  "issues": [{ "file": "...", "type": "...", "severity": "...", "description": "...", "recommendation": "..." }],
  "blockers": ["..."]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwq:32b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const debts: TechnicalDebt[] = (analysis.issues || []).map((issue: any, i: number) => ({
        id: `debt-${Date.now()}-${i}`,
        file: issue.file || 'unknown',
        type: issue.type || 'complexity',
        severity: issue.severity || 'medium',
        description: issue.description || '',
        recommendation: issue.recommendation || '',
        estimatedHours: issue.hours || 4,
        createdAt: new Date(),
      }));

      // Store debts
      debts.forEach(d => this.technicalDebt.set(d.id, d));

      return {
        overallScore: analysis.score || 70,
        technicalDebt: debts,
        hotspots: debts
          .reduce((acc: any[], d) => {
            const existing = acc.find(h => h.file === d.file);
            if (existing) {
              existing.issues++;
            } else {
              acc.push({ file: d.file, issues: 1, recommendation: d.recommendation });
            }
            return acc;
          }, [])
          .sort((a, b) => b.issues - a.issues),
        recommendations: debts.map(d => d.recommendation).filter(Boolean),
        blockers: analysis.blockers || [],
      };
    } catch (error) {
      logger.error('Code health analysis failed:', error);
      return {
        overallScore: 70,
        technicalDebt: [],
        hotspots: [],
        recommendations: ['Unable to analyze - check AI connection'],
        blockers: [],
      };
    }
  }

  getNagMessage(): string | null {
    const criticalDebt = Array.from(this.technicalDebt.values())
      .filter(d => d.severity === 'critical' && !d.resolvedAt);

    if (criticalDebt.length > 0) {
      return `⚠️ FOUNDRY NAG: ${criticalDebt.length} critical technical debt items. Fix "${criticalDebt[0].file}" before adding more features.`;
    }

    const highDebt = Array.from(this.technicalDebt.values())
      .filter(d => d.severity === 'high' && !d.resolvedAt);

    if (highDebt.length >= 5) {
      return `🔧 FOUNDRY NAG: ${highDebt.length} high-severity debt items accumulating. Consider a refactoring sprint.`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // FEEDBACK MANAGEMENT
  // ---------------------------------------------------------------------------

  async ingestFeedback(feedback: Omit<UserFeedback, 'id' | 'createdAt' | 'sentiment' | 'category'>): Promise<UserFeedback> {
    // Analyze sentiment and categorize
    const prompt = `Analyze this user feedback for Datacendia:

"${feedback.content}"

Output JSON: {
  "sentiment": "positive|neutral|negative",
  "category": "feature_request|bug_report|praise|complaint|question",
  "featureRequest": "extracted feature name or null",
  "painPoint": "extracted pain point or null"
}`;

    try {
      const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const processed: UserFeedback = {
        id: `fb-${Date.now()}`,
        ...feedback,
        sentiment: analysis.sentiment || 'neutral',
        category: analysis.category || 'other',
        featureRequest: analysis.featureRequest,
        painPoint: analysis.painPoint,
        createdAt: new Date(),
      };

      this.feedback.push(processed);
      logger.info(`CendiaFoundry: Ingested feedback ${processed.id}`);

      return processed;
    } catch (error) {
      const processed: UserFeedback = {
        id: `fb-${Date.now()}`,
        ...feedback,
        sentiment: 'neutral',
        category: 'other',
        createdAt: new Date(),
      };
      this.feedback.push(processed);
      return processed;
    }
  }

  getFeedbackSummary(): {
    total: number;
    bySentiment: Record<string, number>;
    topRequests: string[];
    topPainPoints: string[];
  } {
    const bySentiment = this.feedback.reduce((acc, f) => {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requests = this.feedback
      .filter(f => f.featureRequest)
      .map(f => f.featureRequest!)
      .reduce((acc, r) => {
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const painPoints = this.feedback
      .filter(f => f.painPoint)
      .map(f => f.painPoint!)
      .reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total: this.feedback.length,
      bySentiment,
      topRequests: Object.entries(requests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([r]) => r),
      topPainPoints: Object.entries(painPoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([p]) => p),
    };
  }

  // ---------------------------------------------------------------------------
  // ROADMAP MANAGEMENT
  // ---------------------------------------------------------------------------

  addToRoadmap(item: Omit<RoadmapItem, 'id'>): RoadmapItem {
    const roadmapItem: RoadmapItem = {
      id: `road-${Date.now()}`,
      ...item,
    };
    this.roadmap.set(roadmapItem.id, roadmapItem);
    return roadmapItem;
  }

  getRoadmap(): RoadmapItem[] {
    return Array.from(this.roadmap.values())
      .sort((a, b) => b.priority - a.priority);
  }

  getVision(): string[] {
    return this.twentyYearVision;
  }

  async alignWithVision(featureName: string): Promise<{
    aligned: boolean;
    phase: string;
    reasoning: string;
  }> {
    const prompt = `Does "${featureName}" align with Datacendia's 20-year vision?

Vision:
${this.twentyYearVision.join('\n')}

Output JSON: { "aligned": true/false, "phase": "Year X-Y", "reasoning": "..." }`;

    try {
      const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
      return JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (error) {
      return { aligned: true, phase: 'Year 1-2', reasoning: 'Analysis unavailable' };
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    backlogItems: number;
    inProgressItems: number;
    shippedItems: number;
    technicalDebtCount: number;
    avgPriority: number;
  } {
    const items = Array.from(this.roadmap.values());
    const backlog = items.filter(i => i.status === 'backlog');
    const inProgress = items.filter(i => i.status === 'in_progress');
    const shipped = items.filter(i => i.status === 'shipped');
    
    const totalPriority = items.reduce((sum, i) => sum + i.priority, 0);

    return {
      backlogItems: backlog.length,
      inProgressItems: inProgress.length,
      shippedItems: shipped.length,
      technicalDebtCount: this.technicalDebt.size,
      avgPriority: items.length > 0 ? Math.round(totalPriority / items.length) : 0,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Product Intelligence Dashboard */
  getProductIntelligenceDashboard(): {
    overview: { totalRoadmapItems: number; backlog: number; planned: number; inProgress: number; testing: number; shipped: number; technicalDebtItems: number; unresolvedDebt: number; feedbackCount: number };
    roadmapByCategory: Array<{ category: string; count: number; pctOfTotal: number; avgPriority: number; shipped: number }>;
    roadmapByImpact: Array<{ impact: string; count: number; pctOfTotal: number; avgEffort: string }>;
    debtSeverityDistribution: Array<{ severity: string; count: number; pctOfTotal: number; estimatedHours: number }>;
    feedbackInsights: { total: number; positive: number; neutral: number; negative: number; sentimentScore: number; topCategories: Array<{ category: string; count: number }> };
    visionAlignment: { phases: string[]; currentPhase: string };
    healthScore: number;
  } {
    const items = Array.from(this.roadmap.values());
    const debts = Array.from(this.technicalDebt.values());
    const unresolvedDebt = debts.filter(d => !d.resolvedAt);

    const backlog = items.filter(i => i.status === 'backlog');
    const planned = items.filter(i => i.status === 'planned');
    const inProgress = items.filter(i => i.status === 'in_progress');
    const testing = items.filter(i => i.status === 'testing');
    const shipped = items.filter(i => i.status === 'shipped');

    // Roadmap by category
    const categoryMap = new Map<string, RoadmapItem[]>();
    items.forEach(i => {
      const arr = categoryMap.get(i.category) || [];
      arr.push(i);
      categoryMap.set(i.category, arr);
    });
    const roadmapByCategory = Array.from(categoryMap.entries()).map(([category, catItems]) => ({
      category,
      count: catItems.length,
      pctOfTotal: items.length > 0 ? Math.round((catItems.length / items.length) * 100) : 0,
      avgPriority: catItems.length > 0 ? Math.round(catItems.reduce((s, i) => s + i.priority, 0) / catItems.length) : 0,
      shipped: catItems.filter(i => i.status === 'shipped').length,
    })).sort((a, b) => b.count - a.count);

    // Roadmap by impact
    const impactMap = new Map<string, RoadmapItem[]>();
    items.forEach(i => {
      const arr = impactMap.get(i.impact) || [];
      arr.push(i);
      impactMap.set(i.impact, arr);
    });
    const effortOrder = { xs: 1, s: 2, m: 3, l: 4, xl: 5 };
    const roadmapByImpact = Array.from(impactMap.entries()).map(([impact, impItems]) => {
      const avgEffortNum = impItems.length > 0
        ? impItems.reduce((s, i) => s + effortOrder[i.effort], 0) / impItems.length
        : 0;
      const avgEffort = avgEffortNum <= 1.5 ? 'xs' : avgEffortNum <= 2.5 ? 's' : avgEffortNum <= 3.5 ? 'm' : avgEffortNum <= 4.5 ? 'l' : 'xl';
      return {
        impact,
        count: impItems.length,
        pctOfTotal: items.length > 0 ? Math.round((impItems.length / items.length) * 100) : 0,
        avgEffort,
      };
    }).sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.impact as keyof typeof order] || 0) - (order[a.impact as keyof typeof order] || 0);
    });

    // Debt severity distribution
    const severityMap = new Map<string, TechnicalDebt[]>();
    unresolvedDebt.forEach(d => {
      const arr = severityMap.get(d.severity) || [];
      arr.push(d);
      severityMap.set(d.severity, arr);
    });
    const debtSeverityDistribution = Array.from(severityMap.entries()).map(([severity, sevDebts]) => ({
      severity,
      count: sevDebts.length,
      pctOfTotal: unresolvedDebt.length > 0 ? Math.round((sevDebts.length / unresolvedDebt.length) * 100) : 0,
      estimatedHours: sevDebts.reduce((s, d) => s + d.estimatedHours, 0),
    })).sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.severity as keyof typeof order] || 0) - (order[a.severity as keyof typeof order] || 0);
    });

    // Feedback insights
    const posFeedback = this.feedback.filter(f => f.sentiment === 'positive');
    const neuFeedback = this.feedback.filter(f => f.sentiment === 'neutral');
    const negFeedback = this.feedback.filter(f => f.sentiment === 'negative');
    const sentimentScore = this.feedback.length > 0
      ? Math.round(((posFeedback.length * 100 + neuFeedback.length * 50) / this.feedback.length))
      : 50;
    const catCount = new Map<string, number>();
    this.feedback.forEach(f => catCount.set(f.category, (catCount.get(f.category) || 0) + 1));
    const topCategories = Array.from(catCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Health score: penalize for unresolved debt and negative feedback
    const debtPenalty = Math.min(unresolvedDebt.length * 3, 30);
    const negPenalty = this.feedback.length > 0 ? Math.round((negFeedback.length / this.feedback.length) * 20) : 0;
    const shippingBonus = items.length > 0 ? Math.round((shipped.length / items.length) * 20) : 0;
    const healthScore = Math.max(0, Math.min(100, 70 + shippingBonus - debtPenalty - negPenalty));

    return {
      overview: {
        totalRoadmapItems: items.length,
        backlog: backlog.length,
        planned: planned.length,
        inProgress: inProgress.length,
        testing: testing.length,
        shipped: shipped.length,
        technicalDebtItems: debts.length,
        unresolvedDebt: unresolvedDebt.length,
        feedbackCount: this.feedback.length,
      },
      roadmapByCategory,
      roadmapByImpact,
      debtSeverityDistribution,
      feedbackInsights: {
        total: this.feedback.length,
        positive: posFeedback.length,
        neutral: neuFeedback.length,
        negative: negFeedback.length,
        sentimentScore,
        topCategories,
      },
      visionAlignment: {
        phases: this.twentyYearVision,
        currentPhase: this.twentyYearVision[0] || 'Not set',
      },
      healthScore,
    };
  }

  /** 10/10: Technical Debt Intelligence */
  getTechnicalDebtIntelligence(): {
    summary: { totalItems: number; unresolved: number; resolved: number; totalEstimatedHours: number; criticalCount: number; highCount: number; avgAgeHours: number };
    debtByType: Array<{ type: string; count: number; pctOfTotal: number; estimatedHours: number; criticalPct: number }>;
    hotspotFiles: Array<{ file: string; issueCount: number; totalHours: number; worstSeverity: string; types: string[] }>;
    resolutionRate: { resolved: number; total: number; ratePct: number; avgResolutionTimeHours: number };
    roiAnalysis: Array<{ debtId: string; file: string; type: string; severity: string; estimatedHours: number; impactScore: number; roiPriority: number }>;
    recommendations: string[];
  } {
    const debts = Array.from(this.technicalDebt.values());
    const unresolved = debts.filter(d => !d.resolvedAt);
    const resolved = debts.filter(d => d.resolvedAt);
    const now = Date.now();

    // Debt by type
    const typeMap = new Map<string, TechnicalDebt[]>();
    unresolved.forEach(d => {
      const arr = typeMap.get(d.type) || [];
      arr.push(d);
      typeMap.set(d.type, arr);
    });
    const debtByType = Array.from(typeMap.entries()).map(([type, typeDebts]) => ({
      type,
      count: typeDebts.length,
      pctOfTotal: unresolved.length > 0 ? Math.round((typeDebts.length / unresolved.length) * 100) : 0,
      estimatedHours: typeDebts.reduce((s, d) => s + d.estimatedHours, 0),
      criticalPct: typeDebts.length > 0 ? Math.round((typeDebts.filter(d => d.severity === 'critical').length / typeDebts.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Hotspot files
    const fileMap = new Map<string, TechnicalDebt[]>();
    unresolved.forEach(d => {
      const arr = fileMap.get(d.file) || [];
      arr.push(d);
      fileMap.set(d.file, arr);
    });
    const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
    const hotspotFiles = Array.from(fileMap.entries()).map(([file, fileDebts]) => ({
      file,
      issueCount: fileDebts.length,
      totalHours: fileDebts.reduce((s, d) => s + d.estimatedHours, 0),
      worstSeverity: fileDebts.reduce((worst, d) =>
        (severityRank[d.severity] || 0) > (severityRank[worst as keyof typeof severityRank] || 0) ? d.severity : worst
      , 'low'),
      types: [...new Set(fileDebts.map(d => d.type))],
    })).sort((a, b) => b.issueCount - a.issueCount).slice(0, 10);

    // Resolution rate
    const avgResolutionTimeHours = resolved.length > 0
      ? Math.round(resolved.reduce((s, d) => s + (d.resolvedAt!.getTime() - d.createdAt.getTime()) / 3600000, 0) / resolved.length)
      : 0;

    // ROI analysis: prioritize by severity and effort
    const roiAnalysis = unresolved.map(d => {
      const impactScore = severityRank[d.severity] || 1;
      const roiPriority = d.estimatedHours > 0 ? Math.round((impactScore * 25) / d.estimatedHours * 10) : impactScore * 25;
      return {
        debtId: d.id,
        file: d.file,
        type: d.type,
        severity: d.severity,
        estimatedHours: d.estimatedHours,
        impactScore: impactScore * 25,
        roiPriority,
      };
    }).sort((a, b) => b.roiPriority - a.roiPriority).slice(0, 15);

    // Avg age
    const avgAgeHours = unresolved.length > 0
      ? Math.round(unresolved.reduce((s, d) => s + (now - d.createdAt.getTime()) / 3600000, 0) / unresolved.length)
      : 0;

    // Recommendations
    const recommendations: string[] = [];
    const criticalCount = unresolved.filter(d => d.severity === 'critical').length;
    const highCount = unresolved.filter(d => d.severity === 'high').length;
    if (criticalCount > 0) recommendations.push(`Address ${criticalCount} critical debt items immediately before shipping new features`);
    if (highCount >= 5) recommendations.push(`Schedule a refactoring sprint to tackle ${highCount} high-severity items`);
    if (hotspotFiles.length > 0 && hotspotFiles[0].issueCount >= 3) recommendations.push(`Focus on ${hotspotFiles[0].file} — ${hotspotFiles[0].issueCount} issues concentrated in one file`);
    const securityDebts = unresolved.filter(d => d.type === 'security');
    if (securityDebts.length > 0) recommendations.push(`Prioritize ${securityDebts.length} security-related debt items for compliance`);
    if (unresolved.length === 0) recommendations.push('Technical debt is clean — maintain vigilance with regular code reviews');

    return {
      summary: {
        totalItems: debts.length,
        unresolved: unresolved.length,
        resolved: resolved.length,
        totalEstimatedHours: unresolved.reduce((s, d) => s + d.estimatedHours, 0),
        criticalCount,
        highCount,
        avgAgeHours,
      },
      debtByType,
      hotspotFiles,
      resolutionRate: {
        resolved: resolved.length,
        total: debts.length,
        ratePct: debts.length > 0 ? Math.round((resolved.length / debts.length) * 100) : 0,
        avgResolutionTimeHours,
      },
      roiAnalysis,
      recommendations,
    };
  }

  /** 10/10: Feature Demand Intelligence */
  async getFeatureDemandIntelligence(): Promise<{
    demandSignals: Array<{ featureName: string; mentions: number; sources: string[]; sentiment: string; demandScore: number; trend: string }>;
    feedbackClusters: Array<{ theme: string; feedbackCount: number; avgSentiment: string; topRequests: string[]; topPainPoints: string[] }>;
    competitiveGaps: Array<{ feature: string; priority: number; marketTrend: string; recommendation: string }>;
    aiInsights: { summary: string; topOpportunity: string; biggestRisk: string; recommendations: string[] };
  }> {
    const items = Array.from(this.roadmap.values());
    const feedbackSummary = this.getFeedbackSummary();

    // Demand signals from feedback
    const featureMentions = new Map<string, { mentions: number; sources: Set<string>; sentiments: string[] }>();
    items.forEach(feature => {
      const mentions = this.feedback.filter(
        f => f.featureRequest?.toLowerCase().includes(feature.name.toLowerCase()) ||
             f.content.toLowerCase().includes(feature.name.toLowerCase())
      );
      if (mentions.length > 0 || feature.demandSignal > 0) {
        featureMentions.set(feature.name, {
          mentions: mentions.length,
          sources: new Set(mentions.map(m => m.source)),
          sentiments: mentions.map(m => m.sentiment),
        });
      }
    });

    const demandSignals = Array.from(featureMentions.entries()).map(([featureName, data]) => {
      const posCount = data.sentiments.filter(s => s === 'positive').length;
      const negCount = data.sentiments.filter(s => s === 'negative').length;
      const avgSentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';
      const demandScore = Math.min(100, data.mentions * 10 + data.sources.size * 5);
      return {
        featureName,
        mentions: data.mentions,
        sources: Array.from(data.sources),
        sentiment: avgSentiment,
        demandScore,
        trend: demandScore > 50 ? 'rising' : demandScore > 20 ? 'stable' : 'low',
      };
    }).sort((a, b) => b.demandScore - a.demandScore);

    // Feedback clusters by category
    const catMap = new Map<string, UserFeedback[]>();
    this.feedback.forEach(f => {
      const arr = catMap.get(f.category) || [];
      arr.push(f);
      catMap.set(f.category, arr);
    });
    const feedbackClusters = Array.from(catMap.entries()).map(([theme, clustFeedback]) => {
      const posCount = clustFeedback.filter(f => f.sentiment === 'positive').length;
      const negCount = clustFeedback.filter(f => f.sentiment === 'negative').length;
      const avgSentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';
      const requests = clustFeedback.filter(f => f.featureRequest).map(f => f.featureRequest!);
      const pains = clustFeedback.filter(f => f.painPoint).map(f => f.painPoint!);
      return {
        theme,
        feedbackCount: clustFeedback.length,
        avgSentiment,
        topRequests: [...new Set(requests)].slice(0, 3),
        topPainPoints: [...new Set(pains)].slice(0, 3),
      };
    }).sort((a, b) => b.feedbackCount - a.feedbackCount);

    // Competitive gaps: features in backlog with high demand
    const competitiveGaps = items
      .filter(i => i.status === 'backlog' || i.status === 'planned')
      .map(i => ({
        feature: i.name,
        priority: i.priority,
        marketTrend: i.demandSignal > 60 ? 'growing' : i.demandSignal > 30 ? 'stable' : 'declining',
        recommendation: i.priority >= 75 ? 'Build immediately' : i.priority >= 50 ? 'Schedule for next sprint' : 'Monitor and reassess',
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    // AI insights
    let aiInsights = {
      summary: `${this.feedback.length} feedback signals analyzed across ${feedbackClusters.length} categories`,
      topOpportunity: demandSignals[0]?.featureName || 'No clear demand signal detected',
      biggestRisk: feedbackSummary.topPainPoints[0] || 'No critical pain points identified',
      recommendations: ['Continue monitoring feedback channels', 'Prioritize high-demand features'],
    };

    if (this.feedback.length > 0) {
      try {
        const prompt = `As CendiaFoundry Product Intelligence AI, analyze these product signals:

Feedback Summary: ${JSON.stringify(feedbackSummary)}
Top Demand Signals: ${JSON.stringify(demandSignals.slice(0, 5))}
Competitive Gaps: ${JSON.stringify(competitiveGaps.slice(0, 5))}
Roadmap Items: ${items.length} total, ${items.filter(i => i.status === 'shipped').length} shipped

Output JSON:
{
  "summary": "2-sentence market position summary",
  "topOpportunity": "single biggest product opportunity",
  "biggestRisk": "single biggest product risk",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
}`;

        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
        if (parsed.summary) aiInsights = parsed;
      } catch (error) {
        logger.warn('CendiaFoundry: AI demand analysis fallback');
      }
    }

    return { demandSignals, feedbackClusters, competitiveGaps, aiInsights };
  }

  /** 10/10: R&D Velocity & Health Tracker */
  getRnDVelocityTracker(): {
    velocity: { totalShipped: number; totalInProgress: number; totalTesting: number; completionRate: number; avgPriorityShipped: number; avgPriorityBacklog: number };
    effortDistribution: Array<{ effort: string; count: number; pctOfTotal: number; shippedCount: number; shippedPct: number }>;
    dependencyAnalysis: { totalDependencies: number; blockedItems: number; avgDependenciesPerItem: number; mostDependedOn: Array<{ itemId: string; itemName: string; dependentCount: number }> };
    categoryVelocity: Array<{ category: string; total: number; shipped: number; velocityPct: number; avgPriority: number }>;
    debtVelocityImpact: { unresolvedDebtHours: number; estimatedVelocityDrag: number; recommendedSprintAllocation: number };
    healthIndicators: Array<{ indicator: string; status: 'healthy' | 'warning' | 'critical'; detail: string }>;
  } {
    const items = Array.from(this.roadmap.values());
    const shipped = items.filter(i => i.status === 'shipped');
    const inProgress = items.filter(i => i.status === 'in_progress');
    const testing = items.filter(i => i.status === 'testing');
    const debts = Array.from(this.technicalDebt.values()).filter(d => !d.resolvedAt);

    const completionRate = items.length > 0 ? Math.round((shipped.length / items.length) * 100) : 0;
    const avgPriorityShipped = shipped.length > 0 ? Math.round(shipped.reduce((s, i) => s + i.priority, 0) / shipped.length) : 0;
    const backlogItems = items.filter(i => i.status === 'backlog');
    const avgPriorityBacklog = backlogItems.length > 0 ? Math.round(backlogItems.reduce((s, i) => s + i.priority, 0) / backlogItems.length) : 0;

    // Effort distribution
    const effortMap = new Map<string, RoadmapItem[]>();
    items.forEach(i => {
      const arr = effortMap.get(i.effort) || [];
      arr.push(i);
      effortMap.set(i.effort, arr);
    });
    const effortDistribution = ['xs', 's', 'm', 'l', 'xl'].map(effort => {
      const effItems = effortMap.get(effort) || [];
      const effShipped = effItems.filter(i => i.status === 'shipped');
      return {
        effort,
        count: effItems.length,
        pctOfTotal: items.length > 0 ? Math.round((effItems.length / items.length) * 100) : 0,
        shippedCount: effShipped.length,
        shippedPct: effItems.length > 0 ? Math.round((effShipped.length / effItems.length) * 100) : 0,
      };
    });

    // Dependency analysis
    const depCounts = new Map<string, number>();
    items.forEach(i => {
      i.dependencies.forEach(dep => depCounts.set(dep, (depCounts.get(dep) || 0) + 1));
    });
    const totalDependencies = items.reduce((s, i) => s + i.dependencies.length, 0);
    const blockedItems = items.filter(i =>
      i.dependencies.some(dep => {
        const depItem = this.roadmap.get(dep);
        return depItem && depItem.status !== 'shipped';
      })
    ).length;
    const mostDependedOn = Array.from(depCounts.entries())
      .map(([itemId, dependentCount]) => ({
        itemId,
        itemName: this.roadmap.get(itemId)?.name || itemId,
        dependentCount,
      }))
      .sort((a, b) => b.dependentCount - a.dependentCount)
      .slice(0, 5);

    // Category velocity
    const catMap = new Map<string, RoadmapItem[]>();
    items.forEach(i => {
      const arr = catMap.get(i.category) || [];
      arr.push(i);
      catMap.set(i.category, arr);
    });
    const categoryVelocity = Array.from(catMap.entries()).map(([category, catItems]) => ({
      category,
      total: catItems.length,
      shipped: catItems.filter(i => i.status === 'shipped').length,
      velocityPct: catItems.length > 0 ? Math.round((catItems.filter(i => i.status === 'shipped').length / catItems.length) * 100) : 0,
      avgPriority: catItems.length > 0 ? Math.round(catItems.reduce((s, i) => s + i.priority, 0) / catItems.length) : 0,
    })).sort((a, b) => b.velocityPct - a.velocityPct);

    // Debt velocity impact
    const unresolvedDebtHours = debts.reduce((s, d) => s + d.estimatedHours, 0);
    const estimatedVelocityDrag = Math.min(50, Math.round(unresolvedDebtHours / 10));
    const recommendedSprintAllocation = debts.length > 0 ? Math.min(40, Math.max(10, Math.round(unresolvedDebtHours / items.length))) : 0;

    // Health indicators
    const healthIndicators: Array<{ indicator: string; status: 'healthy' | 'warning' | 'critical'; detail: string }> = [];

    const criticalDebt = debts.filter(d => d.severity === 'critical').length;
    healthIndicators.push({
      indicator: 'Critical Debt',
      status: criticalDebt === 0 ? 'healthy' : criticalDebt <= 2 ? 'warning' : 'critical',
      detail: criticalDebt === 0 ? 'No critical debt' : `${criticalDebt} critical items require immediate attention`,
    });

    healthIndicators.push({
      indicator: 'Completion Rate',
      status: completionRate >= 40 ? 'healthy' : completionRate >= 20 ? 'warning' : 'critical',
      detail: `${completionRate}% of roadmap items shipped`,
    });

    healthIndicators.push({
      indicator: 'Velocity Drag',
      status: estimatedVelocityDrag < 10 ? 'healthy' : estimatedVelocityDrag < 25 ? 'warning' : 'critical',
      detail: `Estimated ${estimatedVelocityDrag}% velocity reduction from debt`,
    });

    healthIndicators.push({
      indicator: 'Blocked Items',
      status: blockedItems === 0 ? 'healthy' : blockedItems <= 3 ? 'warning' : 'critical',
      detail: blockedItems === 0 ? 'No blocked items' : `${blockedItems} items waiting on dependencies`,
    });

    healthIndicators.push({
      indicator: 'WIP Balance',
      status: inProgress.length <= 3 ? 'healthy' : inProgress.length <= 6 ? 'warning' : 'critical',
      detail: `${inProgress.length} items in progress, ${testing.length} in testing`,
    });

    return {
      velocity: { totalShipped: shipped.length, totalInProgress: inProgress.length, totalTesting: testing.length, completionRate, avgPriorityShipped, avgPriorityBacklog },
      effortDistribution,
      dependencyAnalysis: { totalDependencies, blockedItems, avgDependenciesPerItem: items.length > 0 ? Math.round((totalDependencies / items.length) * 10) / 10 : 0, mostDependedOn },
      categoryVelocity,
      debtVelocityImpact: { unresolvedDebtHours, estimatedVelocityDrag, recommendedSprintAllocation },
      healthIndicators,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaFoundry', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.roadmap.has(d.id)) this.roadmap.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaFoundry', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.technicalDebt.has(d.id)) this.technicalDebt.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaFoundryService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaFoundryService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaFoundry',
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
      service: 'CendiaFoundry',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaFoundryService = new CendiaFoundryService();
export default cendiaFoundryService;
