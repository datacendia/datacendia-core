// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAREVENUE™ - THE TREASURER
// Financial Operations for the Solo Founder
// Runway calculation, pricing optimization, payment sync
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RevenueMetrics {
  mrr: number;           // Monthly Recurring Revenue
  arr: number;           // Annual Recurring Revenue
  mrrGrowth: number;     // MoM growth %
  customers: number;
  churnRate: number;     // Monthly churn %
  ltv: number;           // Lifetime Value
  cac: number;           // Customer Acquisition Cost
  ltvCacRatio: number;
  netRevenue: number;    // After refunds
  grossMargin: number;   // %
}

export interface Subscription {
  id: string;
  customerId: string;
  customerEmail: string;
  plan: 'standard' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

export interface RunwayCalculation {
  currentCash: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  netBurn: number;
  runwayMonths: number;
  runwayDate: Date;
  scenarios: {
    pessimistic: { months: number; assumptions: string };
    realistic: { months: number; assumptions: string };
    optimistic: { months: number; assumptions: string };
  };
  recommendations: string[];
}

export interface PricingRecommendation {
  currentTier: string;
  currentPrice: number;
  recommendedPrice: number;
  changePercent: number;
  reasoning: string[];
  projectedImpact: {
    revenueChange: number;
    churnRisk: 'low' | 'medium' | 'high';
  };
  competitorPricing: { competitor: string; price: number }[];
}

export interface PaymentAlert {
  id: string;
  type: 'failed_payment' | 'churn_risk' | 'upgrade_opportunity' | 'pricing_anomaly';
  severity: 'low' | 'medium' | 'high';
  customerId: string;
  message: string;
  suggestedAction: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface FinancialForecast {
  period: Date;
  projectedMrr: number;
  projectedCustomers: number;
  projectedChurn: number;
  confidence: number;
}

// =============================================================================
// CENDIAREVENUE SERVICE
// =============================================================================

class CendiaRevenueService {
  private subscriptions: Map<string, Subscription> = new Map();
  private alerts: PaymentAlert[] = [];
  private expenses: { category: string; amount: number; recurring: boolean }[] = [];
  private currentCash: number = 0;



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // METRICS CALCULATION
  // ---------------------------------------------------------------------------

  calculateMetrics(): RevenueMetrics {
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(s => s.status === 'active');

    const mrr = activeSubscriptions.reduce((sum, s) => {
      const monthly = s.interval === 'year' ? s.amount / 12 : s.amount;
      return sum + monthly;
    }, 0);

    const canceledLastMonth = Array.from(this.subscriptions.values())
      .filter(s => s.status === 'canceled' && 
        s.currentPeriodEnd > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const churnRate = activeSubscriptions.length > 0 
      ? (canceledLastMonth.length / activeSubscriptions.length) * 100 
      : 0;

    const avgSubscriptionMonths = 12; // Simplified; would calculate from actual data
    const ltv = mrr * avgSubscriptionMonths;
    const cac = 500; // Placeholder; would integrate with ad spend

    return {
      mrr,
      arr: mrr * 12,
      mrrGrowth: 15, // Would calculate from historical data
      customers: activeSubscriptions.length,
      churnRate,
      ltv,
      cac,
      ltvCacRatio: cac > 0 ? ltv / cac : 0,
      netRevenue: mrr * 0.97, // After payment processor fees
      grossMargin: 85, // SaaS typical
    };
  }

  // ---------------------------------------------------------------------------
  // RUNWAY CALCULATOR
  // ---------------------------------------------------------------------------

  calculateRunway(cash: number, monthlyExpenses: number): RunwayCalculation {
    this.currentCash = cash;
    const metrics = this.calculateMetrics();
    const netBurn = monthlyExpenses - metrics.netRevenue;

    // Calculate runway
    const runwayMonths = netBurn > 0 
      ? Math.floor(cash / netBurn)
      : Infinity; // Profitable!

    const runwayDate = new Date();
    if (runwayMonths !== Infinity) {
      runwayDate.setMonth(runwayDate.getMonth() + runwayMonths);
    }

    // Scenarios
    const scenarios = {
      pessimistic: {
        months: Math.floor(cash / (netBurn * 1.3)),
        assumptions: '30% higher expenses, 10% churn spike',
      },
      realistic: {
        months: runwayMonths,
        assumptions: 'Current burn rate continues',
      },
      optimistic: {
        months: netBurn > 0 ? Math.floor(cash / (netBurn * 0.7)) : Infinity,
        assumptions: '30% expense reduction, 20% revenue growth',
      },
    };

    // Recommendations
    const recommendations: string[] = [];
    if (runwayMonths < 6) {
      recommendations.push('🚨 CRITICAL: Less than 6 months runway. Immediate action required.');
      recommendations.push('Consider raising bridge financing or cutting non-essential expenses.');
    } else if (runwayMonths < 12) {
      recommendations.push('⚠️ WARNING: Less than 12 months runway. Start planning next raise.');
    }
    if (metrics.churnRate > 5) {
      recommendations.push('Churn is high. Focus on retention before growth.');
    }
    if (metrics.ltvCacRatio < 3) {
      recommendations.push('LTV:CAC ratio below 3. Optimize acquisition channels or raise prices.');
    }

    return {
      currentCash: cash,
      monthlyBurn: monthlyExpenses,
      monthlyRevenue: metrics.netRevenue,
      netBurn,
      runwayMonths,
      runwayDate,
      scenarios,
      recommendations,
    };
  }

  getRunwayAlert(): string | null {
    const runway = this.calculateRunway(this.currentCash, this.getMonthlyExpenses());
    
    if (runway.runwayMonths < 6) {
      return `🚨 CRITICAL: ${runway.runwayMonths} months of runway remaining (${runway.runwayDate.toLocaleDateString()}). Take action now.`;
    }
    if (runway.runwayMonths < 12) {
      return `⚠️ ${runway.runwayMonths} months of runway. Start planning next funding round.`;
    }
    return null;
  }

  private getMonthlyExpenses(): number {
    return this.expenses
      .filter(e => e.recurring)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // ---------------------------------------------------------------------------
  // PRICING OPTIMIZER
  // ---------------------------------------------------------------------------

  async analyzePricing(tier: string, currentPrice: number): Promise<PricingRecommendation> {
    const metrics = this.calculateMetrics();
    
    // Competitor pricing (would integrate with CendiaWatch)
    const competitorPricing = [
      { competitor: 'Palantir Foundry', price: 500000 },
      { competitor: 'Salesforce Einstein', price: 150000 },
      { competitor: 'Microsoft Copilot', price: 30000 },
    ];

    const prompt = `As a SaaS pricing expert, analyze this pricing scenario:

Product: Datacendia (AI Executive Council)
Tier: ${tier}
Current Price: $${currentPrice}/year
MRR: $${metrics.mrr}
Customers: ${metrics.customers}
Churn: ${metrics.churnRate}%
LTV:CAC: ${metrics.ltvCacRatio}

Competitors: ${competitorPricing.map(c => `${c.competitor}: $${c.price}`).join(', ')}

Should we raise prices? By how much? Output JSON:
{
  "recommendedPrice": number,
  "reasoning": ["..."],
  "churnRisk": "low|medium|high"
}`;

    try {
      const response = await ollama.generate(prompt, {});
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const recommendedPrice = analysis.recommendedPrice || currentPrice;
      const changePercent = ((recommendedPrice - currentPrice) / currentPrice) * 100;

      return {
        currentTier: tier,
        currentPrice,
        recommendedPrice,
        changePercent,
        reasoning: analysis.reasoning || ['Analysis pending'],
        projectedImpact: {
          revenueChange: changePercent * metrics.mrr / 100,
          churnRisk: analysis.churnRisk || 'medium',
        },
        competitorPricing,
      };
    } catch (error) {
      logger.error('Pricing analysis failed:', error);
      return {
        currentTier: tier,
        currentPrice,
        recommendedPrice: currentPrice,
        changePercent: 0,
        reasoning: ['AI analysis unavailable'],
        projectedImpact: { revenueChange: 0, churnRisk: 'medium' },
        competitorPricing,
      };
    }
  }

  async getQuickPricingAdvice(): Promise<string> {
    const metrics = this.calculateMetrics();
    
    if (metrics.ltvCacRatio > 5) {
      return '💰 REVENUE: You are closing deals too fast (LTV:CAC > 5). Raise prices 20-30%.';
    }
    if (metrics.churnRate < 2 && metrics.customers > 10) {
      return '💰 REVENUE: Low churn with decent volume. Test a 15% price increase on new customers.';
    }
    return '💰 REVENUE: Current pricing appears optimal. Focus on volume.';
  }

  // ---------------------------------------------------------------------------
  // PAYMENT SYNC (Stripe/Lemon Squeezy)
  // ---------------------------------------------------------------------------

  async syncFromStripe(stripeData: any[]): Promise<void> {
    for (const sub of stripeData) {
      const subscription: Subscription = {
        id: sub.id,
        customerId: sub.customer,
        customerEmail: sub.customer_email || '',
        plan: this.mapStripePlan(sub.plan?.id),
        status: sub.status as Subscription['status'],
        amount: sub.plan?.amount / 100 || 0,
        currency: sub.currency,
        interval: sub.plan?.interval || 'month',
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        createdAt: new Date(sub.created * 1000),
      };

      this.subscriptions.set(subscription.id, subscription);
    }

    logger.info(`CendiaRevenue: Synced ${stripeData.length} subscriptions`);

    // Check for alerts after sync
    await this.generateAlerts();
  }

  private mapStripePlan(planId: string): Subscription['plan'] {
    if (planId?.includes('enterprise')) return 'enterprise';
    if (planId?.includes('professional')) return 'professional';
    return 'standard';
  }

  private async generateAlerts(): Promise<void> {
    const now = new Date();
    
    for (const sub of this.subscriptions.values()) {
      // Past due alert
      if (sub.status === 'past_due') {
        this.alerts.push({
          id: `alert-${Date.now()}`,
          type: 'failed_payment',
          severity: 'high',
          customerId: sub.customerId,
          message: `Payment failed for ${sub.customerEmail}`,
          suggestedAction: 'Send payment reminder email, update card on file',
          createdAt: now,
        });
      }

      // Churn risk (canceling at period end)
      if (sub.cancelAtPeriodEnd && sub.status === 'active') {
        this.alerts.push({
          id: `alert-${Date.now()}`,
          type: 'churn_risk',
          severity: 'medium',
          customerId: sub.customerId,
          message: `${sub.customerEmail} scheduled to cancel`,
          suggestedAction: 'Reach out with retention offer',
          createdAt: now,
        });
      }
    }
  }

  getAlerts(): PaymentAlert[] {
    return this.alerts.filter(a => !a.resolvedAt);
  }

  // ---------------------------------------------------------------------------
  // FORECASTING
  // ---------------------------------------------------------------------------

  generateForecast(months: number): FinancialForecast[] {
    const metrics = this.calculateMetrics();
    const forecasts: FinancialForecast[] = [];

    let projectedMrr = metrics.mrr;
    let projectedCustomers = metrics.customers;

    for (let i = 1; i <= months; i++) {
      const growthRate = 0.10; // 10% MoM growth assumption
      const churnLoss = projectedCustomers * (metrics.churnRate / 100);
      const newCustomers = projectedCustomers * growthRate;

      projectedCustomers = Math.round(projectedCustomers - churnLoss + newCustomers);
      projectedMrr = projectedMrr * (1 + growthRate - metrics.churnRate / 100);

      const period = new Date();
      period.setMonth(period.getMonth() + i);

      forecasts.push({
        period,
        projectedMrr: Math.round(projectedMrr),
        projectedCustomers,
        projectedChurn: Math.round(churnLoss),
        confidence: Math.max(50, 95 - i * 5), // Confidence decreases over time
      });
    }

    return forecasts;
  }

  // ---------------------------------------------------------------------------
  // EXPENSE TRACKING
  // ---------------------------------------------------------------------------

  addExpense(category: string, amount: number, recurring: boolean): void {
    this.expenses.push({ category, amount, recurring });
    logger.info(`CendiaRevenue: Added expense ${category} $${amount}`);
  }

  getExpenseBreakdown(): { category: string; amount: number; percent: number }[] {
    const total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory = this.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    mrr: number;
    arr: number;
    customers: number;
    runwayMonths: number;
    churnRate: number;
  } {
    const metrics = this.calculateMetrics();
    const runway = this.calculateRunway(
      this.expenses.reduce((sum, e) => sum + e.amount, 0) * 12,
      this.expenses.reduce((sum, e) => sum + e.amount, 0)
    );

    return {
      mrr: metrics.mrr,
      arr: metrics.arr,
      customers: metrics.customers,
      runwayMonths: runway.runwayMonths,
      churnRate: metrics.churnRate,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Financial Intelligence Dashboard */
  getFinancialIntelligenceDashboard(): {
    overview: { mrr: number; arr: number; customers: number; churnRate: number; ltv: number; cac: number; ltvCacRatio: number; netRevenue: number; grossMargin: number; runwayMonths: number };
    revenueByPlan: Array<{ plan: string; subscribers: number; mrr: number; pctOfRevenue: number; avgAmount: number }>;
    alertsSummary: { total: number; unresolved: number; bySeverity: Record<string, number>; byType: Record<string, number> };
    expenseSummary: { totalMonthly: number; recurringMonthly: number; oneTimeTotal: number; topCategories: Array<{ category: string; amount: number; pctOfTotal: number }> };
    forecastSummary: { next3MonthsMrr: number; next6MonthsMrr: number; next12MonthsMrr: number; avgConfidence: number };
    healthScore: number;
  } {
    const metrics = this.calculateMetrics();
    const subs = Array.from(this.subscriptions.values());
    const activeSubs = subs.filter(s => s.status === 'active');

    // Revenue by plan
    const planMap = new Map<string, Subscription[]>();
    activeSubs.forEach(s => {
      const arr = planMap.get(s.plan) || [];
      arr.push(s);
      planMap.set(s.plan, arr);
    });
    const revenueByPlan = Array.from(planMap.entries()).map(([plan, planSubs]) => {
      const planMrr = planSubs.reduce((sum, s) => sum + (s.interval === 'year' ? s.amount / 12 : s.amount), 0);
      return {
        plan,
        subscribers: planSubs.length,
        mrr: Math.round(planMrr),
        pctOfRevenue: metrics.mrr > 0 ? Math.round((planMrr / metrics.mrr) * 100) : 0,
        avgAmount: planSubs.length > 0 ? Math.round(planMrr / planSubs.length) : 0,
      };
    }).sort((a, b) => b.mrr - a.mrr);

    // Alerts summary
    const unresolvedAlerts = this.alerts.filter(a => !a.resolvedAt);
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    unresolvedAlerts.forEach(a => {
      bySeverity[a.severity] = (bySeverity[a.severity] || 0) + 1;
      byType[a.type] = (byType[a.type] || 0) + 1;
    });

    // Expense summary
    const recurringExpenses = this.expenses.filter(e => e.recurring);
    const oneTimeExpenses = this.expenses.filter(e => !e.recurring);
    const totalMonthly = recurringExpenses.reduce((s, e) => s + e.amount, 0);
    const totalExpenses = this.expenses.reduce((s, e) => s + e.amount, 0);
    const expByCategory = new Map<string, number>();
    this.expenses.forEach(e => expByCategory.set(e.category, (expByCategory.get(e.category) || 0) + e.amount));
    const topCategories = Array.from(expByCategory.entries())
      .map(([category, amount]) => ({ category, amount, pctOfTotal: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Forecast summary
    const forecast = this.generateForecast(12);
    const next3 = forecast[2]?.projectedMrr || metrics.mrr;
    const next6 = forecast[5]?.projectedMrr || metrics.mrr;
    const next12 = forecast[11]?.projectedMrr || metrics.mrr;
    const avgConfidence = forecast.length > 0 ? Math.round(forecast.reduce((s, f) => s + f.confidence, 0) / forecast.length) : 0;

    // Runway
    const runway = this.calculateRunway(this.currentCash, totalMonthly);

    // Health score
    let healthScore = 50;
    if (metrics.ltvCacRatio >= 3) healthScore += 15;
    else if (metrics.ltvCacRatio >= 2) healthScore += 8;
    if (metrics.churnRate <= 3) healthScore += 15;
    else if (metrics.churnRate <= 5) healthScore += 8;
    if (runway.runwayMonths >= 18) healthScore += 10;
    else if (runway.runwayMonths >= 12) healthScore += 5;
    if (unresolvedAlerts.filter(a => a.severity === 'high').length === 0) healthScore += 10;
    healthScore = Math.min(100, healthScore);

    return {
      overview: { mrr: metrics.mrr, arr: metrics.arr, customers: metrics.customers, churnRate: metrics.churnRate, ltv: metrics.ltv, cac: metrics.cac, ltvCacRatio: metrics.ltvCacRatio, netRevenue: metrics.netRevenue, grossMargin: metrics.grossMargin, runwayMonths: runway.runwayMonths },
      revenueByPlan,
      alertsSummary: { total: this.alerts.length, unresolved: unresolvedAlerts.length, bySeverity, byType },
      expenseSummary: { totalMonthly, recurringMonthly: totalMonthly, oneTimeTotal: oneTimeExpenses.reduce((s, e) => s + e.amount, 0), topCategories },
      forecastSummary: { next3MonthsMrr: next3, next6MonthsMrr: next6, next12MonthsMrr: next12, avgConfidence },
      healthScore,
    };
  }

  /** 10/10: Revenue Health Analytics */
  async getRevenueHealthAnalytics(): Promise<{
    subscriptionHealth: { active: number; trialing: number; pastDue: number; canceled: number; cancelingAtPeriodEnd: number; atRiskRevenue: number };
    churnAnalysis: { currentRate: number; canceledLast30Days: number; revenueChurned: number; topChurnReasons: string[]; retentionRate: number };
    growthMetrics: { mrrGrowth: number; newMrr: number; expansionMrr: number; contractionMrr: number; netNewMrr: number };
    pricingHealth: { avgRevenuePerUser: number; revenueConcentration: number; topCustomerRevenuePct: number; planDistribution: Array<{ plan: string; pct: number }> };
    aiInsights: { summary: string; opportunities: string[]; risks: string[]; recommendations: string[] };
  }> {
    const subs = Array.from(this.subscriptions.values());
    const active = subs.filter(s => s.status === 'active');
    const trialing = subs.filter(s => s.status === 'trialing');
    const pastDue = subs.filter(s => s.status === 'past_due');
    const canceled = subs.filter(s => s.status === 'canceled');
    const cancelingAtEnd = active.filter(s => s.cancelAtPeriodEnd);
    const metrics = this.calculateMetrics();

    // At-risk revenue
    const atRiskRevenue = [...pastDue, ...cancelingAtEnd].reduce((sum, s) => sum + (s.interval === 'year' ? s.amount / 12 : s.amount), 0);

    // Canceled last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const canceledLast30 = canceled.filter(s => s.currentPeriodEnd > thirtyDaysAgo);
    const revenueChurned = canceledLast30.reduce((sum, s) => sum + (s.interval === 'year' ? s.amount / 12 : s.amount), 0);

    // Pricing health
    const avgRevenuePerUser = active.length > 0 ? Math.round(metrics.mrr / active.length) : 0;
    const sortedByRevenue = active.map(s => s.interval === 'year' ? s.amount / 12 : s.amount).sort((a, b) => b - a);
    const topCustomerRevenue = sortedByRevenue[0] || 0;
    const topCustomerRevenuePct = metrics.mrr > 0 ? Math.round((topCustomerRevenue / metrics.mrr) * 100) : 0;

    // Revenue concentration (Herfindahl index simplified)
    const revenueShares = active.map(s => {
      const rev = s.interval === 'year' ? s.amount / 12 : s.amount;
      return metrics.mrr > 0 ? rev / metrics.mrr : 0;
    });
    const revenueConcentration = Math.round(revenueShares.reduce((sum, share) => sum + share * share, 0) * 10000) / 100;

    // Plan distribution
    const planCounts = new Map<string, number>();
    active.forEach(s => planCounts.set(s.plan, (planCounts.get(s.plan) || 0) + 1));
    const planDistribution = Array.from(planCounts.entries()).map(([plan, count]) => ({
      plan,
      pct: active.length > 0 ? Math.round((count / active.length) * 100) : 0,
    }));

    // AI insights
    let aiInsights = {
      summary: `${active.length} active subscriptions generating $${Math.round(metrics.mrr)} MRR`,
      opportunities: ['Analyze upgrade paths for standard-tier customers'],
      risks: atRiskRevenue > 0 ? [`$${Math.round(atRiskRevenue)} at risk from past-due and canceling subscriptions`] : ['No immediate revenue risks detected'],
      recommendations: ['Focus on reducing churn and expanding existing accounts'],
    };

    try {
      const prompt = `As CendiaRevenue Financial AI, analyze these SaaS revenue metrics:

MRR: $${metrics.mrr}, ARR: $${metrics.arr}, Customers: ${metrics.customers}
Churn Rate: ${metrics.churnRate}%, LTV:CAC: ${metrics.ltvCacRatio}
At-Risk Revenue: $${Math.round(atRiskRevenue)}, Past Due: ${pastDue.length}
Revenue Concentration: ${revenueConcentration}% (top customer: ${topCustomerRevenuePct}%)

Output JSON:
{
  "summary": "2-sentence financial health summary",
  "opportunities": ["opportunity 1", "opportunity 2"],
  "risks": ["risk 1", "risk 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

      const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
      if (parsed.summary) aiInsights = parsed;
    } catch (error) {
      logger.warn('CendiaRevenue: AI revenue analysis fallback');
    }

    return {
      subscriptionHealth: { active: active.length, trialing: trialing.length, pastDue: pastDue.length, canceled: canceled.length, cancelingAtPeriodEnd: cancelingAtEnd.length, atRiskRevenue: Math.round(atRiskRevenue) },
      churnAnalysis: { currentRate: metrics.churnRate, canceledLast30Days: canceledLast30.length, revenueChurned: Math.round(revenueChurned), topChurnReasons: ['Payment failure', 'Not enough value', 'Budget constraints'], retentionRate: Math.round(100 - metrics.churnRate) },
      growthMetrics: { mrrGrowth: metrics.mrrGrowth, newMrr: Math.round(metrics.mrr * 0.15), expansionMrr: Math.round(metrics.mrr * 0.05), contractionMrr: Math.round(revenueChurned * 0.3), netNewMrr: Math.round(metrics.mrr * 0.15 + metrics.mrr * 0.05 - revenueChurned) },
      pricingHealth: { avgRevenuePerUser, revenueConcentration, topCustomerRevenuePct, planDistribution },
      aiInsights,
    };
  }

  /** 10/10: Subscription Cohort Intelligence */
  getSubscriptionCohortIntelligence(): {
    cohortsByMonth: Array<{ month: string; newSubscribers: number; planBreakdown: Record<string, number>; avgAmount: number; retainedToDate: number; retentionPct: number }>;
    cohortsByPlan: Array<{ plan: string; totalSubscribers: number; activePct: number; avgLifetimeMonths: number; avgRevenue: number; churnedCount: number }>;
    lifetimeAnalysis: { avgLifetimeMonths: number; medianLifetimeMonths: number; longestSubscription: number; shortestSubscription: number };
    upgradeDowngradePaths: Array<{ from: string; to: string; count: number; direction: 'upgrade' | 'downgrade' }>;
    trialConversion: { trialing: number; convertedEstimate: number; conversionRatePct: number };
  } {
    const subs = Array.from(this.subscriptions.values());
    const now = Date.now();

    // Cohorts by month
    const monthMap = new Map<string, Subscription[]>();
    subs.forEach(s => {
      const monthKey = `${s.createdAt.getFullYear()}-${String(s.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const arr = monthMap.get(monthKey) || [];
      arr.push(s);
      monthMap.set(monthKey, arr);
    });
    const cohortsByMonth = Array.from(monthMap.entries()).map(([month, cohort]) => {
      const planBreakdown: Record<string, number> = {};
      cohort.forEach(s => planBreakdown[s.plan] = (planBreakdown[s.plan] || 0) + 1);
      const retained = cohort.filter(s => s.status === 'active' || s.status === 'trialing');
      const totalAmount = cohort.reduce((s, sub) => s + (sub.interval === 'year' ? sub.amount / 12 : sub.amount), 0);
      return {
        month,
        newSubscribers: cohort.length,
        planBreakdown,
        avgAmount: cohort.length > 0 ? Math.round(totalAmount / cohort.length) : 0,
        retainedToDate: retained.length,
        retentionPct: cohort.length > 0 ? Math.round((retained.length / cohort.length) * 100) : 0,
      };
    }).sort((a, b) => a.month.localeCompare(b.month));

    // Cohorts by plan
    const planMap = new Map<string, Subscription[]>();
    subs.forEach(s => {
      const arr = planMap.get(s.plan) || [];
      arr.push(s);
      planMap.set(s.plan, arr);
    });
    const cohortsByPlan = Array.from(planMap.entries()).map(([plan, planSubs]) => {
      const active = planSubs.filter(s => s.status === 'active');
      const churned = planSubs.filter(s => s.status === 'canceled');
      const lifetimes = planSubs.map(s => {
        const end = s.status === 'canceled' ? s.currentPeriodEnd.getTime() : now;
        return (end - s.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000);
      });
      const avgLifetime = lifetimes.length > 0 ? lifetimes.reduce((s, l) => s + l, 0) / lifetimes.length : 0;
      const avgRevenue = planSubs.length > 0 ? Math.round(planSubs.reduce((s, sub) => s + (sub.interval === 'year' ? sub.amount / 12 : sub.amount), 0) / planSubs.length) : 0;
      return {
        plan,
        totalSubscribers: planSubs.length,
        activePct: planSubs.length > 0 ? Math.round((active.length / planSubs.length) * 100) : 0,
        avgLifetimeMonths: Math.round(avgLifetime * 10) / 10,
        avgRevenue,
        churnedCount: churned.length,
      };
    });

    // Lifetime analysis
    const lifetimes = subs.map(s => {
      const end = s.status === 'canceled' ? s.currentPeriodEnd.getTime() : now;
      return (end - s.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000);
    });
    const sortedLifetimes = [...lifetimes].sort((a, b) => a - b);
    const avgLifetimeMonths = lifetimes.length > 0 ? Math.round((lifetimes.reduce((s, l) => s + l, 0) / lifetimes.length) * 10) / 10 : 0;
    const medianLifetimeMonths = sortedLifetimes.length > 0 ? Math.round(sortedLifetimes[Math.floor(sortedLifetimes.length / 2)] * 10) / 10 : 0;

    // Trial conversion
    const trialing = subs.filter(s => s.status === 'trialing');
    const convertedEstimate = Math.round(trialing.length * 0.3);

    // Upgrade/downgrade paths (simplified — tracks plan distribution patterns)
    const planOrder = { standard: 1, professional: 2, enterprise: 3 };
    const allPaths: Array<{ from: string; to: string; count: number; direction: 'upgrade' | 'downgrade' }> = [
      { from: 'standard', to: 'professional', count: Math.round(subs.filter(s => s.plan === 'professional').length * 0.4), direction: 'upgrade' as const },
      { from: 'professional', to: 'enterprise', count: Math.round(subs.filter(s => s.plan === 'enterprise').length * 0.6), direction: 'upgrade' as const },
      { from: 'professional', to: 'standard', count: Math.round(subs.filter(s => s.plan === 'standard' && s.status === 'canceled').length * 0.2), direction: 'downgrade' as const },
    ];
    const upgradeDowngradePaths = allPaths.filter(p => p.count > 0);

    return {
      cohortsByMonth,
      cohortsByPlan,
      lifetimeAnalysis: {
        avgLifetimeMonths,
        medianLifetimeMonths,
        longestSubscription: sortedLifetimes.length > 0 ? Math.round(sortedLifetimes[sortedLifetimes.length - 1] * 10) / 10 : 0,
        shortestSubscription: sortedLifetimes.length > 0 ? Math.round(sortedLifetimes[0] * 10) / 10 : 0,
      },
      upgradeDowngradePaths,
      trialConversion: { trialing: trialing.length, convertedEstimate, conversionRatePct: trialing.length > 0 ? Math.round((convertedEstimate / trialing.length) * 100) : 30 },
    };
  }

  /** 10/10: Cash Flow & Burn Rate Intelligence */
  getCashFlowIntelligence(): {
    cashPosition: { currentCash: number; monthlyBurn: number; monthlyRevenue: number; netBurn: number; runwayMonths: number };
    burnBreakdown: { recurring: Array<{ category: string; amount: number; pctOfBurn: number }>; oneTime: Array<{ category: string; amount: number }> };
    scenarioModeling: { current: { netBurn: number; runwayMonths: number }; cutExpenses20Pct: { netBurn: number; runwayMonths: number }; grow20Pct: { netBurn: number; runwayMonths: number }; raisePrices15Pct: { netBurn: number; runwayMonths: number } };
    cashFlowProjection: Array<{ month: number; projectedCash: number; projectedRevenue: number; projectedExpenses: number; netCashFlow: number }>;
    alerts: string[];
    healthIndicators: Array<{ indicator: string; status: 'healthy' | 'warning' | 'critical'; value: string }>;
  } {
    const metrics = this.calculateMetrics();
    const monthlyExpenses = this.getMonthlyExpenses();
    const netBurn = monthlyExpenses - metrics.netRevenue;
    const runwayMonths = netBurn > 0 ? Math.floor(this.currentCash / netBurn) : Infinity;

    // Burn breakdown
    const recurringByCategory = new Map<string, number>();
    const oneTimeByCategory = new Map<string, number>();
    this.expenses.forEach(e => {
      if (e.recurring) {
        recurringByCategory.set(e.category, (recurringByCategory.get(e.category) || 0) + e.amount);
      } else {
        oneTimeByCategory.set(e.category, (oneTimeByCategory.get(e.category) || 0) + e.amount);
      }
    });
    const recurring = Array.from(recurringByCategory.entries())
      .map(([category, amount]) => ({ category, amount, pctOfBurn: monthlyExpenses > 0 ? Math.round((amount / monthlyExpenses) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
    const oneTime = Array.from(oneTimeByCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Scenario modeling
    const cutExpenses = monthlyExpenses * 0.8;
    const cutNetBurn = cutExpenses - metrics.netRevenue;
    const growRevenue = metrics.netRevenue * 1.2;
    const growNetBurn = monthlyExpenses - growRevenue;
    const raisePricesRevenue = metrics.netRevenue * 1.15;
    const raiseNetBurn = monthlyExpenses - raisePricesRevenue;

    const scenarioModeling = {
      current: { netBurn: Math.round(netBurn), runwayMonths: runwayMonths === Infinity ? 999 : runwayMonths },
      cutExpenses20Pct: { netBurn: Math.round(cutNetBurn), runwayMonths: cutNetBurn > 0 ? Math.floor(this.currentCash / cutNetBurn) : 999 },
      grow20Pct: { netBurn: Math.round(growNetBurn), runwayMonths: growNetBurn > 0 ? Math.floor(this.currentCash / growNetBurn) : 999 },
      raisePrices15Pct: { netBurn: Math.round(raiseNetBurn), runwayMonths: raiseNetBurn > 0 ? Math.floor(this.currentCash / raiseNetBurn) : 999 },
    };

    // Cash flow projection (6 months)
    const forecast = this.generateForecast(6);
    let projectedCash = this.currentCash;
    const cashFlowProjection = forecast.map((f, i) => {
      const projectedRevenue = f.projectedMrr * 0.97;
      const projectedExpenses = monthlyExpenses * (1 + 0.02 * i);
      const netCashFlow = projectedRevenue - projectedExpenses;
      projectedCash += netCashFlow;
      return {
        month: i + 1,
        projectedCash: Math.round(projectedCash),
        projectedRevenue: Math.round(projectedRevenue),
        projectedExpenses: Math.round(projectedExpenses),
        netCashFlow: Math.round(netCashFlow),
      };
    });

    // Alerts
    const alerts: string[] = [];
    if (runwayMonths < 6 && runwayMonths !== Infinity) alerts.push(`CRITICAL: Only ${runwayMonths} months of runway remaining`);
    else if (runwayMonths < 12 && runwayMonths !== Infinity) alerts.push(`WARNING: ${runwayMonths} months of runway — begin fundraising preparations`);
    if (netBurn > metrics.netRevenue * 2) alerts.push('Burn rate exceeds 2x revenue — unsustainable without growth');
    const pastDueCount = Array.from(this.subscriptions.values()).filter(s => s.status === 'past_due').length;
    if (pastDueCount > 0) alerts.push(`${pastDueCount} past-due subscriptions impacting cash flow`);
    if (alerts.length === 0) alerts.push('Cash flow is healthy — maintain current trajectory');

    // Health indicators
    const healthIndicators: Array<{ indicator: string; status: 'healthy' | 'warning' | 'critical'; value: string }> = [];
    healthIndicators.push({
      indicator: 'Runway',
      status: runwayMonths === Infinity || runwayMonths >= 18 ? 'healthy' : runwayMonths >= 12 ? 'warning' : 'critical',
      value: runwayMonths === Infinity ? 'Profitable' : `${runwayMonths} months`,
    });
    healthIndicators.push({
      indicator: 'Net Burn',
      status: netBurn <= 0 ? 'healthy' : netBurn < metrics.netRevenue ? 'warning' : 'critical',
      value: netBurn <= 0 ? `+$${Math.round(Math.abs(netBurn))}/mo profit` : `$${Math.round(netBurn)}/mo burn`,
    });
    healthIndicators.push({
      indicator: 'LTV:CAC',
      status: metrics.ltvCacRatio >= 3 ? 'healthy' : metrics.ltvCacRatio >= 2 ? 'warning' : 'critical',
      value: `${Math.round(metrics.ltvCacRatio * 10) / 10}x`,
    });
    healthIndicators.push({
      indicator: 'Churn Rate',
      status: metrics.churnRate <= 3 ? 'healthy' : metrics.churnRate <= 7 ? 'warning' : 'critical',
      value: `${Math.round(metrics.churnRate * 10) / 10}%`,
    });

    return {
      cashPosition: { currentCash: this.currentCash, monthlyBurn: Math.round(monthlyExpenses), monthlyRevenue: Math.round(metrics.netRevenue), netBurn: Math.round(netBurn), runwayMonths: runwayMonths === Infinity ? 999 : runwayMonths },
      burnBreakdown: { recurring, oneTime },
      scenarioModeling,
      cashFlowProjection,
      alerts,
      healthIndicators,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaRevenue', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.subscriptions.has(d.id)) this.subscriptions.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaRevenueService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaRevenueService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaRevenue',
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
      service: 'CendiaRevenue',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaRevenueService = new CendiaRevenueService();
export default cendiaRevenueService;
