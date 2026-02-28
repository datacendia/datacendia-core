// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAWATCHâ„¢ - THE SENTRY
// Competitor & Market Surveillance
// Real-time monitoring of competitors, market trends, and threats
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Competitor {
  id: string;
  name: string;
  website: string;
  category: 'direct' | 'adjacent' | 'potential';
  products: string[];
  pricing?: { tier: string; price: number }[];
  strengths: string[];
  weaknesses: string[];
  lastUpdated: Date;
}

export interface MarketSignal {
  id: string;
  type: 'news' | 'social' | 'patent' | 'job_posting' | 'funding' | 'product_launch' | 'regulation';
  source: string;
  title: string;
  content: string;
  url?: string;
  relevance: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative' | 'threat' | 'opportunity';
  competitors: string[]; // Related competitor IDs
  keywords: string[];
  detectedAt: Date;
  processed: boolean;
}

export interface ThreatAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'competitive_launch' | 'market_shift' | 'regulatory' | 'funding_threat' | 'talent_drain';
  title: string;
  description: string;
  source: MarketSignal[];
  suggestedResponse: string;
  deadline?: Date;
  createdAt: Date;
  acknowledgedAt?: Date;
}

export interface IntelligenceReport {
  period: 'daily' | 'weekly' | 'monthly';
  generatedAt: Date;
  summary: string;
  topSignals: MarketSignal[];
  competitorUpdates: { competitor: string; update: string }[];
  threats: ThreatAlert[];
  opportunities: { description: string; urgency: string }[];
  recommendations: string[];
}

export interface WatchConfig {
  keywords: string[];
  competitors: string[];
  sources: string[];
  alertThreshold: number; // 0-100 relevance to trigger alert
}

// =============================================================================
// DEFAULT WATCH CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: WatchConfig = {
  keywords: [
    'Sovereign AI', 'AI Council', 'Enterprise AI', 'Decision Intelligence',
    'AI Governance', 'Corporate AI', 'Executive AI', 'AI C-Suite',
    'Palantir', 'AI Ethics', 'Autonomous Business', 'AI Strategy',
  ],
  competitors: [
    'Palantir', 'C3.ai', 'DataRobot', 'H2O.ai', 'Databricks',
    'Microsoft Copilot', 'Google Duet', 'Salesforce Einstein',
    'IBM Watson', 'Anthropic', 'OpenAI Enterprise',
  ],
  sources: [
    'techcrunch.com', 'reuters.com', 'bloomberg.com', 'wsj.com',
    'linkedin.com', 'twitter.com', 'patents.google.com', 'sec.gov',
  ],
  alertThreshold: 70,
};

// =============================================================================
// CENDIAWATCH SERVICE
// =============================================================================

class CendiaWatchService {
  private config: WatchConfig = DEFAULT_CONFIG;
  private competitors: Map<string, Competitor> = new Map();
  private signals: MarketSignal[] = [];
  private alerts: ThreatAlert[] = [];

  constructor() {
    // Initialize known competitors
    this.initializeCompetitors();


    this.loadFromDB().catch(() => {});
  }

  private initializeCompetitors(): void {
    const knownCompetitors: Competitor[] = [
      {
        id: 'palantir',
        name: 'Palantir Technologies',
        website: 'palantir.com',
        category: 'direct',
        products: ['Foundry', 'Gotham', 'Apollo', 'AIP'],
        pricing: [{ tier: 'Enterprise', price: 1000000 }],
        strengths: ['Government contracts', 'Data integration', 'Brand recognition'],
        weaknesses: ['Expensive', 'Complex implementation', 'Negative PR'],
        lastUpdated: new Date(),
      },
      {
        id: 'c3ai',
        name: 'C3.ai',
        website: 'c3.ai',
        category: 'direct',
        products: ['C3 AI Platform', 'C3 Generative AI'],
        pricing: [{ tier: 'Enterprise', price: 500000 }],
        strengths: ['AI/ML focus', 'Industry solutions'],
        weaknesses: ['Stock performance', 'Narrow use cases'],
        lastUpdated: new Date(),
      },
      {
        id: 'microsoft-copilot',
        name: 'Microsoft Copilot',
        website: 'microsoft.com',
        category: 'adjacent',
        products: ['Copilot for Microsoft 365', 'Copilot Studio'],
        pricing: [{ tier: 'Per User', price: 30 }],
        strengths: ['Distribution', 'Integration', 'Brand trust'],
        weaknesses: ['Generic', 'Not strategic', 'Privacy concerns'],
        lastUpdated: new Date(),
      },
      {
        id: 'salesforce-einstein',
        name: 'Salesforce Einstein',
        website: 'salesforce.com',
        category: 'adjacent',
        products: ['Einstein GPT', 'Einstein Analytics'],
        pricing: [{ tier: 'Enterprise', price: 150000 }],
        strengths: ['CRM integration', 'Existing customer base'],
        weaknesses: ['CRM-centric', 'Not for strategic decisions'],
        lastUpdated: new Date(),
      },
    ];

    for (const comp of knownCompetitors) {
      this.competitors.set(comp.id, comp);
    }
  }

  // ---------------------------------------------------------------------------
  // SIGNAL INGESTION
  // ---------------------------------------------------------------------------

  async ingestSignal(signal: Omit<MarketSignal, 'id' | 'relevance' | 'sentiment' | 'competitors' | 'keywords' | 'detectedAt' | 'processed'>): Promise<MarketSignal> {
    const prompt = `Analyze this market signal for Datacendia (AI Executive Council platform):

Type: ${signal.type}
Source: ${signal.source}
Title: ${signal.title}
Content: ${signal.content}

Our competitors: ${this.config.competitors.join(', ')}
Our keywords: ${this.config.keywords.join(', ')}

Output JSON:
{
  "relevance": 0-100,
  "sentiment": "positive|neutral|negative|threat|opportunity",
  "competitors": ["names of any mentioned competitors"],
  "keywords": ["relevant keywords found"],
  "summary": "1-sentence summary for founder"
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const processedSignal: MarketSignal = {
        id: `sig-${Date.now()}`,
        ...signal,
        relevance: analysis.relevance || 50,
        sentiment: analysis.sentiment || 'neutral',
        competitors: analysis.competitors || [],
        keywords: analysis.keywords || [],
        detectedAt: new Date(),
        processed: true,
      };

      this.signals.push(processedSignal);

      // Check if we should generate an alert
      if (processedSignal.relevance >= this.config.alertThreshold) {
        await this.generateAlert(processedSignal);
      }

      logger.info(`CendiaWatch: Ingested signal ${processedSignal.id} (relevance: ${processedSignal.relevance})`);
      return processedSignal;
    } catch (error) {
      logger.error('Signal analysis failed:', error);
      const fallbackSignal: MarketSignal = {
        id: `sig-${Date.now()}`,
        ...signal,
        relevance: 50,
        sentiment: 'neutral',
        competitors: [],
        keywords: [],
        detectedAt: new Date(),
        processed: false,
      };
      this.signals.push(fallbackSignal);
      return fallbackSignal;
    }
  }

  // ---------------------------------------------------------------------------
  // ALERT GENERATION
  // ---------------------------------------------------------------------------

  private async generateAlert(signal: MarketSignal): Promise<void> {
    let severity: ThreatAlert['severity'] = 'low';
    let type: ThreatAlert['type'] = 'market_shift';

    // Determine severity and type
    if (signal.sentiment === 'threat') {
      severity = signal.relevance > 90 ? 'critical' : 'high';
    } else if (signal.sentiment === 'negative') {
      severity = 'medium';
    }

    if (signal.type === 'product_launch' && signal.competitors.length > 0) {
      type = 'competitive_launch';
      severity = 'high';
    } else if (signal.type === 'funding') {
      type = 'funding_threat';
    } else if (signal.type === 'regulation') {
      type = 'regulatory';
    }

    const prompt = `Generate a strategic response for this competitive alert:

Signal: ${signal.title}
Type: ${type}
Competitors: ${signal.competitors.join(', ')}

What should Datacendia do? Be specific and actionable.`;

    let suggestedResponse = 'Monitor situation and prepare response.';
    try {
      suggestedResponse = await ollama.generate(prompt, { model: 'llama3.2:3b' });
    } catch (error) {
      // Use default response
    }

    const alert: ThreatAlert = {
      id: `alert-${Date.now()}`,
      severity,
      type,
      title: signal.title,
      description: signal.content,
      source: [signal],
      suggestedResponse,
      createdAt: new Date(),
    };

    this.alerts.push(alert);
    logger.warn(`CendiaWatch: Generated ${severity} alert - ${alert.title}`);
  }

  // ---------------------------------------------------------------------------
  // INTELLIGENCE REPORTS
  // ---------------------------------------------------------------------------

  async generateReport(period: 'daily' | 'weekly' | 'monthly'): Promise<IntelligenceReport> {
    const periodMs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    }[period];

    const cutoff = new Date(Date.now() - periodMs);
    const recentSignals = this.signals.filter(s => s.detectedAt > cutoff);
    const recentAlerts = this.alerts.filter(a => a.createdAt > cutoff);

    // Generate summary
    const prompt = `Summarize these market signals for an AI Enterprise founder:

${recentSignals.slice(0, 10).map(s => `- ${s.title} (${s.sentiment})`).join('\n')}

Alerts: ${recentAlerts.length}

Write a 2-paragraph executive summary.`;

    let summary = 'Market conditions stable. No critical threats detected.';
    try {
      summary = await ollama.generate(prompt, {});
    } catch (error) {
      // Use default summary
    }

    // Competitor updates
    const competitorUpdates = this.config.competitors
      .map(comp => {
        const compSignals = recentSignals.filter(s => 
          s.competitors.some(c => c.toLowerCase().includes(comp.toLowerCase()))
        );
        if (compSignals.length === 0) return null;
        return {
          competitor: comp,
          update: compSignals.map(s => s.title).join('; '),
        };
      })
      .filter(Boolean) as { competitor: string; update: string }[];

    // Opportunities
    const opportunities = recentSignals
      .filter(s => s.sentiment === 'opportunity')
      .map(s => ({
        description: s.title,
        urgency: s.relevance > 80 ? 'high' : 'medium',
      }));

    return {
      period,
      generatedAt: new Date(),
      summary,
      topSignals: recentSignals.sort((a, b) => b.relevance - a.relevance).slice(0, 5),
      competitorUpdates,
      threats: recentAlerts.filter(a => a.severity === 'high' || a.severity === 'critical'),
      opportunities,
      recommendations: [
        'Continue monitoring competitor product launches',
        'Track regulatory developments in AI governance',
      ],
    };
  }

  // ---------------------------------------------------------------------------
  // RADAR - Real-time Scanning
  // ---------------------------------------------------------------------------

  async scanForKeyword(keyword: string): Promise<MarketSignal[]> {
    // Uses deterministic computation; ROADMAP: news/social APIs
    // For now, return cached signals matching the keyword
    return this.signals.filter(s => 
      s.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
      s.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async scanCompetitor(competitorName: string): Promise<{
    competitor: Competitor | undefined;
    recentSignals: MarketSignal[];
    threatLevel: 'low' | 'medium' | 'high';
  }> {
    const competitor = Array.from(this.competitors.values())
      .find(c => c.name.toLowerCase().includes(competitorName.toLowerCase()));

    const recentSignals = this.signals.filter(s =>
      s.competitors.some(c => c.toLowerCase().includes(competitorName.toLowerCase()))
    );

    const threatSignals = recentSignals.filter(s => s.sentiment === 'threat');
    let threatLevel: 'low' | 'medium' | 'high' = 'low';
    if (threatSignals.length > 3) threatLevel = 'high';
    else if (threatSignals.length > 0) threatLevel = 'medium';

    return { competitor, recentSignals, threatLevel };
  }

  // ---------------------------------------------------------------------------
  // COMPETITOR MANAGEMENT
  // ---------------------------------------------------------------------------

  addCompetitor(competitor: Omit<Competitor, 'id' | 'lastUpdated'>): Competitor {
    const comp: Competitor = {
      id: `comp-${Date.now()}`,
      ...competitor,
      lastUpdated: new Date(),
    };
    this.competitors.set(comp.id, comp);
    this.config.competitors.push(comp.name);
    return comp;
  }

  getCompetitors(): Competitor[] {
    return Array.from(this.competitors.values());
  }

  // ---------------------------------------------------------------------------
  // ALERTS MANAGEMENT
  // ---------------------------------------------------------------------------

  getAlerts(acknowledged?: boolean): ThreatAlert[] {
    let alerts = this.alerts;
    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => (a.acknowledgedAt !== undefined) === acknowledged);
    }
    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledgedAt = new Date();
      logger.info(`CendiaWatch: Acknowledged alert ${alertId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // QUICK ALERTS FOR DASHBOARD
  // ---------------------------------------------------------------------------

  getCriticalAlert(): string | null {
    const critical = this.alerts.find(a => 
      a.severity === 'critical' && !a.acknowledgedAt
    );

    if (critical) {
      return `ðŸš¨ WATCH ALERT: ${critical.title}. ${critical.suggestedResponse}`;
    }

    const high = this.alerts.filter(a => 
      a.severity === 'high' && !a.acknowledgedAt
    );

    if (high.length > 0) {
      return `âš ï¸ WATCH: ${high.length} high-priority alerts require attention.`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------------

  updateConfig(config: Partial<WatchConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('CendiaWatch: Configuration updated');
  }

  getConfig(): WatchConfig {
    return { ...this.config };
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    competitorsTracked: number;
    activeAlerts: number;
    criticalAlerts: number;
    signalsProcessed: number;
    totalSignals: number;
  } {
    const alerts = this.getAlerts(false);
    const critical = alerts.filter(a => a.severity === 'critical' && !a.acknowledgedAt);

    return {
      competitorsTracked: this.competitors.size,
      activeAlerts: alerts.filter(a => !a.acknowledgedAt).length,
      criticalAlerts: critical.length,
      signalsProcessed: this.signals.filter(s => s.processed).length,
      totalSignals: this.signals.length,
    };
  }


  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Market Intelligence Dashboard */
  getMarketIntelligenceDashboard(): {
    overview: { totalSignals: number; processedSignals: number; unprocessedSignals: number; competitorsTracked: number; activeAlerts: number; criticalAlerts: number; highAlerts: number; avgRelevance: number; signalsLast7Days: number; signalsLast30Days: number };
    signalsByType: Array<{ type: string; count: number; pctOfTotal: number; avgRelevance: number; threatCount: number; opportunityCount: number }>;
    signalsBySentiment: Array<{ sentiment: string; count: number; pctOfTotal: number; avgRelevance: number }>;
    alertsSeverityBreakdown: Array<{ severity: string; count: number; acknowledged: number; unacknowledged: number; avgResponseHours: number }>;
    topKeywords: Array<{ keyword: string; count: number; avgRelevance: number; sentiment: string }>;
    competitorMentions: Array<{ competitor: string; mentions: number; avgRelevance: number; dominantSentiment: string; latestSignalDate: Date | null }>;
    recentHighImpactSignals: Array<{ id: string; title: string; type: string; relevance: number; sentiment: string; competitors: string[]; detectedAt: Date }>;
    insights: string[];
  } {
    const signals = this.signals;
    const alerts = this.alerts;
    const total = signals.length || 1;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const processed = signals.filter(s => s.processed);
    const unprocessed = signals.filter(s => !s.processed);
    const avgRelevance = signals.length > 0
      ? Math.round(signals.reduce((s, sig) => s + sig.relevance, 0) / signals.length)
      : 0;

    const unacknowledgedAlerts = alerts.filter(a => !a.acknowledgedAt);
    const criticalAlerts = unacknowledgedAlerts.filter(a => a.severity === 'critical');
    const highAlerts = unacknowledgedAlerts.filter(a => a.severity === 'high');

    // Signals by type
    const types: MarketSignal['type'][] = ['news', 'social', 'patent', 'job_posting', 'funding', 'product_launch', 'regulation'];
    const signalsByType = types.map(type => {
      const typeSignals = signals.filter(s => s.type === type);
      const avgRel = typeSignals.length > 0
        ? Math.round(typeSignals.reduce((s, sig) => s + sig.relevance, 0) / typeSignals.length)
        : 0;
      return {
        type,
        count: typeSignals.length,
        pctOfTotal: Math.round((typeSignals.length / total) * 100),
        avgRelevance: avgRel,
        threatCount: typeSignals.filter(s => s.sentiment === 'threat').length,
        opportunityCount: typeSignals.filter(s => s.sentiment === 'opportunity').length,
      };
    }).filter(t => t.count > 0);

    // Signals by sentiment
    const sentiments: MarketSignal['sentiment'][] = ['positive', 'neutral', 'negative', 'threat', 'opportunity'];
    const signalsBySentiment = sentiments.map(sentiment => {
      const sentSignals = signals.filter(s => s.sentiment === sentiment);
      return {
        sentiment,
        count: sentSignals.length,
        pctOfTotal: Math.round((sentSignals.length / total) * 100),
        avgRelevance: sentSignals.length > 0 ? Math.round(sentSignals.reduce((s, sig) => s + sig.relevance, 0) / sentSignals.length) : 0,
      };
    }).filter(s => s.count > 0);

    // Alerts severity breakdown
    const severities: ThreatAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
    const alertsSeverityBreakdown = severities.map(severity => {
      const sevAlerts = alerts.filter(a => a.severity === severity);
      const acked = sevAlerts.filter(a => a.acknowledgedAt);
      const responseTimes = acked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
      return {
        severity,
        count: sevAlerts.length,
        acknowledged: acked.length,
        unacknowledged: sevAlerts.length - acked.length,
        avgResponseHours: responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length * 10) / 10 : 0,
      };
    }).filter(s => s.count > 0);

    // Top keywords
    const keywordMap = new Map<string, { count: number; totalRelevance: number; sentiments: string[] }>();
    signals.forEach(s => {
      s.keywords.forEach(kw => {
        const existing = keywordMap.get(kw) || { count: 0, totalRelevance: 0, sentiments: [] };
        existing.count++;
        existing.totalRelevance += s.relevance;
        existing.sentiments.push(s.sentiment);
        keywordMap.set(kw, existing);
      });
    });
    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, data]) => {
        const posSent = data.sentiments.filter(s => s === 'positive' || s === 'opportunity').length;
        const negSent = data.sentiments.filter(s => s === 'negative' || s === 'threat').length;
        return {
          keyword,
          count: data.count,
          avgRelevance: Math.round(data.totalRelevance / data.count),
          sentiment: posSent > negSent ? 'positive' : negSent > posSent ? 'negative' : 'neutral',
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Competitor mentions
    const competitorMentionMap = new Map<string, MarketSignal[]>();
    signals.forEach(s => {
      s.competitors.forEach(c => {
        const arr = competitorMentionMap.get(c) || [];
        arr.push(s);
        competitorMentionMap.set(c, arr);
      });
    });
    const competitorMentions = Array.from(competitorMentionMap.entries())
      .map(([competitor, compSignals]) => {
        const avgRel = Math.round(compSignals.reduce((s, sig) => s + sig.relevance, 0) / compSignals.length);
        const threatCount = compSignals.filter(s => s.sentiment === 'threat' || s.sentiment === 'negative').length;
        const oppCount = compSignals.filter(s => s.sentiment === 'opportunity' || s.sentiment === 'positive').length;
        const latestDate = compSignals.length > 0
          ? new Date(Math.max(...compSignals.map(s => s.detectedAt.getTime())))
          : null;
        return {
          competitor,
          mentions: compSignals.length,
          avgRelevance: avgRel,
          dominantSentiment: threatCount > oppCount ? 'threat' : oppCount > threatCount ? 'opportunity' : 'neutral',
          latestSignalDate: latestDate,
        };
      })
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);

    // Recent high-impact signals
    const recentHighImpactSignals = [...signals]
      .filter(s => s.relevance >= 60)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, 10)
      .map(s => ({
        id: s.id, title: s.title, type: s.type, relevance: s.relevance,
        sentiment: s.sentiment, competitors: s.competitors, detectedAt: s.detectedAt,
      }));

    // Insights
    const insights: string[] = [];
    if (criticalAlerts.length > 0) insights.push(`${criticalAlerts.length} CRITICAL alert(s) unacknowledged â€” immediate attention required`);
    if (highAlerts.length > 0) insights.push(`${highAlerts.length} high-severity alert(s) pending â€” review and respond within 24 hours`);
    const threatSignals = signals.filter(s => s.sentiment === 'threat' && s.detectedAt.getTime() > sevenDaysAgo);
    if (threatSignals.length > 0) insights.push(`${threatSignals.length} threat signal(s) detected this week â€” evaluate competitive response`);
    const opportunities = signals.filter(s => s.sentiment === 'opportunity' && s.detectedAt.getTime() > sevenDaysAgo);
    if (opportunities.length > 0) insights.push(`${opportunities.length} opportunity signal(s) identified â€” prioritize for strategic action`);
    if (unprocessed.length > 0) insights.push(`${unprocessed.length} unprocessed signal(s) in queue â€” run analysis pipeline`);
    if (insights.length === 0) insights.push('Market intelligence operations are healthy â€” continue monitoring cadence');

    return {
      overview: {
        totalSignals: signals.length, processedSignals: processed.length, unprocessedSignals: unprocessed.length,
        competitorsTracked: this.competitors.size, activeAlerts: unacknowledgedAlerts.length,
        criticalAlerts: criticalAlerts.length, highAlerts: highAlerts.length, avgRelevance,
        signalsLast7Days: signals.filter(s => s.detectedAt.getTime() > sevenDaysAgo).length,
        signalsLast30Days: signals.filter(s => s.detectedAt.getTime() > thirtyDaysAgo).length,
      },
      signalsByType,
      signalsBySentiment,
      alertsSeverityBreakdown,
      topKeywords,
      competitorMentions,
      recentHighImpactSignals,
      insights,
    };
  }

  /** 10/10: Competitor Landscape Analytics */
  async getCompetitorLandscapeAnalytics(): Promise<{
    landscapeOverview: { totalCompetitors: number; directCount: number; adjacentCount: number; potentialCount: number; avgThreatLevel: number; mostActiveCompetitor: string };
    competitorProfiles: Array<{ id: string; name: string; category: string; products: string[]; strengthCount: number; weaknessCount: number; signalCount: number; threatLevel: string; recentActivity: string; pricingRange: string }>;
    threatMatrix: Array<{ competitor: string; threatScore: number; signalVolume: number; sentimentScore: number; recentLaunches: number; fundingActivity: boolean; talentMovement: boolean; recommendation: string }>;
    marketPositioning: Array<{ competitor: string; segment: string; pricePoint: string; differentiation: string; overlapWithUs: string }>;
    competitorMovements: Array<{ competitor: string; movement: string; date: Date; impact: string; ourResponse: string }>;
    aiStrategicAnalysis: { summary: string; biggestThreat: string; biggestOpportunity: string; blindSpots: string[]; recommendations: string[] };
    insights: string[];
  }> {
    const competitors = Array.from(this.competitors.values());
    const signals = this.signals;
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const direct = competitors.filter(c => c.category === 'direct');
    const adjacent = competitors.filter(c => c.category === 'adjacent');
    const potential = competitors.filter(c => c.category === 'potential');

    // Build competitor profiles with signal data
    const competitorProfiles = competitors.map(comp => {
      const compSignals = signals.filter(s =>
        s.competitors.some(c => c.toLowerCase().includes(comp.name.toLowerCase()))
      );
      const threatSignals = compSignals.filter(s => s.sentiment === 'threat' || s.sentiment === 'negative');
      const threatLevel = threatSignals.length > 5 ? 'high' : threatSignals.length > 2 ? 'medium' : 'low';
      const recentSignals = compSignals.filter(s => s.detectedAt.getTime() > thirtyDaysAgo);
      const pricingRange = comp.pricing && comp.pricing.length > 0
        ? `$${Math.min(...comp.pricing.map(p => p.price)).toLocaleString()} - $${Math.max(...comp.pricing.map(p => p.price)).toLocaleString()}`
        : 'Unknown';

      return {
        id: comp.id, name: comp.name, category: comp.category,
        products: comp.products, strengthCount: comp.strengths.length,
        weaknessCount: comp.weaknesses.length, signalCount: compSignals.length,
        threatLevel, recentActivity: recentSignals.length > 0 ? recentSignals[0].title : 'No recent activity',
        pricingRange,
      };
    });

    // Threat matrix
    const threatMatrix = competitors.map(comp => {
      const compSignals = signals.filter(s =>
        s.competitors.some(c => c.toLowerCase().includes(comp.name.toLowerCase()))
      );
      const threatSigs = compSignals.filter(s => s.sentiment === 'threat' || s.sentiment === 'negative');
      const posSigs = compSignals.filter(s => s.sentiment === 'positive' || s.sentiment === 'opportunity');
      const sentimentScore = compSignals.length > 0
        ? Math.round(((posSigs.length - threatSigs.length) / compSignals.length + 1) * 50)
        : 50;
      const threatScore = Math.min(100, Math.round(
        (threatSigs.length * 15) +
        (comp.category === 'direct' ? 30 : comp.category === 'adjacent' ? 15 : 5) +
        (compSignals.filter(s => s.type === 'product_launch').length * 20)
      ));
      const launches = compSignals.filter(s => s.type === 'product_launch' && s.detectedAt.getTime() > thirtyDaysAgo);
      const fundingActivity = compSignals.some(s => s.type === 'funding' && s.detectedAt.getTime() > thirtyDaysAgo);
      const talentMovement = compSignals.some(s => s.type === 'job_posting' && s.detectedAt.getTime() > thirtyDaysAgo);

      let recommendation = 'Monitor quarterly';
      if (threatScore > 70) recommendation = 'Activate competitive response plan';
      else if (threatScore > 40) recommendation = 'Increase monitoring frequency';

      return {
        competitor: comp.name, threatScore, signalVolume: compSignals.length,
        sentimentScore, recentLaunches: launches.length, fundingActivity, talentMovement,
        recommendation,
      };
    }).sort((a, b) => b.threatScore - a.threatScore);

    // Market positioning
    const marketPositioning = competitors.map(comp => {
      const segment = comp.category === 'direct' ? 'Enterprise AI Decision Platform' : comp.category === 'adjacent' ? 'Adjacent AI/Analytics' : 'Emerging Competitor';
      const pricePoint = comp.pricing?.[0] ? `$${comp.pricing[0].price.toLocaleString()}/${comp.pricing[0].tier}` : 'Unknown';
      const differentiation = comp.strengths[0] || 'Not analyzed';
      const overlapPct = comp.category === 'direct' ? 'High (70-90%)' : comp.category === 'adjacent' ? 'Medium (30-50%)' : 'Low (<20%)';
      return { competitor: comp.name, segment, pricePoint, differentiation, overlapWithUs: overlapPct };
    });

    // Competitor movements (from recent signals)
    const competitorMovements = signals
      .filter(s => s.competitors.length > 0 && s.detectedAt.getTime() > thirtyDaysAgo)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, 10)
      .map(s => ({
        competitor: s.competitors[0] || 'Unknown',
        movement: s.title,
        date: s.detectedAt,
        impact: s.relevance > 80 ? 'high' : s.relevance > 50 ? 'medium' : 'low',
        ourResponse: s.sentiment === 'threat' ? 'Counter-strategy needed' : s.sentiment === 'opportunity' ? 'Exploit opening' : 'Monitor',
      }));

    // Most active competitor
    const competitorSignalCounts = new Map<string, number>();
    signals.forEach(s => {
      s.competitors.forEach(c => {
        competitorSignalCounts.set(c, (competitorSignalCounts.get(c) || 0) + 1);
      });
    });
    const mostActiveCompetitor = Array.from(competitorSignalCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None detected';

    const avgThreatLevel = threatMatrix.length > 0
      ? Math.round(threatMatrix.reduce((s, t) => s + t.threatScore, 0) / threatMatrix.length)
      : 0;

    // AI strategic analysis
    let aiStrategicAnalysis = {
      summary: `${competitors.length} competitors tracked across ${direct.length} direct, ${adjacent.length} adjacent, and ${potential.length} potential categories`,
      biggestThreat: threatMatrix[0]?.competitor || 'No threats detected',
      biggestOpportunity: 'Differentiate through sovereign AI architecture and council-based decision framework',
      blindSpots: ['Emerging startups in AI governance space', 'Open-source alternatives gaining traction'],
      recommendations: ['Increase monitoring of direct competitors', 'Track patent filings in AI decision space'],
    };

    if (competitors.length > 0) {
      try {
        const prompt = `As CendiaWatch Competitive Intelligence AI, analyze this competitive landscape for Datacendia (Sovereign AI Executive Council platform):

Competitors: ${competitors.map(c => `${c.name} (${c.category}): strengths=[${c.strengths.join(',')}], weaknesses=[${c.weaknesses.join(',')}]`).join('\n')}
Signal Summary: ${signals.length} total signals, ${signals.filter(s => s.sentiment === 'threat').length} threats, ${signals.filter(s => s.sentiment === 'opportunity').length} opportunities
Top Threat: ${threatMatrix[0]?.competitor || 'None'} (score: ${threatMatrix[0]?.threatScore || 0})

Output JSON:
{
  "summary": "2-sentence competitive landscape summary",
  "biggestThreat": "single biggest competitive threat",
  "biggestOpportunity": "single biggest competitive opportunity for Datacendia",
  "blindSpots": ["blind spot 1", "blind spot 2"],
  "recommendations": ["strategic recommendation 1", "strategic recommendation 2", "strategic recommendation 3"]
}`;

        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
        if (parsed.summary) aiStrategicAnalysis = parsed;
      } catch (error) {
        logger.warn('CendiaWatch: AI strategic analysis fallback');
      }
    }

    // Insights
    const insights: string[] = [];
    const highThreatComps = threatMatrix.filter(t => t.threatScore > 70);
    if (highThreatComps.length > 0) insights.push(`${highThreatComps.length} competitor(s) at high threat level â€” activate defensive positioning`);
    const recentLaunches = signals.filter(s => s.type === 'product_launch' && s.detectedAt.getTime() > thirtyDaysAgo);
    if (recentLaunches.length > 0) insights.push(`${recentLaunches.length} competitive product launch(es) in last 30 days â€” assess feature overlap`);
    const fundingSignals = signals.filter(s => s.type === 'funding' && s.detectedAt.getTime() > thirtyDaysAgo);
    if (fundingSignals.length > 0) insights.push(`${fundingSignals.length} competitor funding event(s) detected â€” anticipate increased competitive pressure`);
    if (direct.length === 0) insights.push('No direct competitors tracked â€” expand competitive monitoring scope');
    if (insights.length === 0) insights.push('Competitive landscape is stable â€” maintain monitoring cadence');

    return {
      landscapeOverview: {
        totalCompetitors: competitors.length, directCount: direct.length,
        adjacentCount: adjacent.length, potentialCount: potential.length,
        avgThreatLevel, mostActiveCompetitor,
      },
      competitorProfiles,
      threatMatrix,
      marketPositioning,
      competitorMovements,
      aiStrategicAnalysis,
      insights,
    };
  }

  /** 10/10: Signal Pattern Intelligence */
  getSignalPatternIntelligence(): {
    patternOverview: { totalSignals: number; avgPerDay: number; avgRelevance: number; threatRatio: number; opportunityRatio: number; processingRate: number };
    volumeTrends: { last7Days: number; last30Days: number; trend: 'rising' | 'stable' | 'declining'; peakDay: string; peakHour: number };
    sourceDistribution: Array<{ source: string; count: number; pctOfTotal: number; avgRelevance: number; topSentiment: string }>;
    typeCorrelations: Array<{ type: string; avgRelevance: number; threatPct: number; opportunityPct: number; alertConversionRate: number }>;
    keywordClusters: Array<{ cluster: string; keywords: string[]; signalCount: number; avgRelevance: number; trendDirection: string }>;
    temporalPatterns: Array<{ period: string; signalCount: number; avgRelevance: number; dominantType: string; dominantSentiment: string }>;
    signalVelocity: Array<{ period: string; count: number; avgRelevance: number }>;
    insights: string[];
  } {
    const signals = this.signals;
    const total = signals.length || 1;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const avgRelevance = signals.length > 0
      ? Math.round(signals.reduce((s, sig) => s + sig.relevance, 0) / signals.length)
      : 0;
    const threatSignals = signals.filter(s => s.sentiment === 'threat');
    const oppSignals = signals.filter(s => s.sentiment === 'opportunity');
    const processed = signals.filter(s => s.processed);

    // Volume trends
    const last7Days = signals.filter(s => s.detectedAt.getTime() > sevenDaysAgo).length;
    const last30Days = signals.filter(s => s.detectedAt.getTime() > thirtyDaysAgo).length;
    const avgPerDay = last30Days > 0 ? Math.round((last30Days / 30) * 10) / 10 : 0;
    const olderWeekly = (last30Days - last7Days) / 3.3;
    let trend: 'rising' | 'stable' | 'declining' = 'stable';
    if (last7Days > olderWeekly * 1.3) trend = 'rising';
    else if (last7Days < olderWeekly * 0.7 && olderWeekly > 0) trend = 'declining';

    // Peak day and hour
    const dayMap: Record<string, number> = {};
    const hourMap: Record<number, number> = {};
    signals.forEach(s => {
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][s.detectedAt.getDay()];
      dayMap[day] = (dayMap[day] || 0) + 1;
      const hour = s.detectedAt.getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });
    const peakDay = Object.entries(dayMap).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
    const peakHour = Object.entries(hourMap).sort(([, a], [, b]) => b - a)[0]?.[0]
      ? parseInt(Object.entries(hourMap).sort(([, a], [, b]) => b - a)[0][0])
      : 9;

    // Source distribution
    const sourceMap = new Map<string, MarketSignal[]>();
    signals.forEach(s => {
      const arr = sourceMap.get(s.source) || [];
      arr.push(s);
      sourceMap.set(s.source, arr);
    });
    const sourceDistribution = Array.from(sourceMap.entries())
      .map(([source, srcSignals]) => {
        const avgRel = Math.round(srcSignals.reduce((s, sig) => s + sig.relevance, 0) / srcSignals.length);
        const sentimentCounts: Record<string, number> = {};
        srcSignals.forEach(s => { sentimentCounts[s.sentiment] = (sentimentCounts[s.sentiment] || 0) + 1; });
        const topSentiment = Object.entries(sentimentCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
        return {
          source, count: srcSignals.length,
          pctOfTotal: Math.round((srcSignals.length / total) * 100),
          avgRelevance: avgRel, topSentiment,
        };
      })
      .sort((a, b) => b.count - a.count);

    // Type correlations
    const types: MarketSignal['type'][] = ['news', 'social', 'patent', 'job_posting', 'funding', 'product_launch', 'regulation'];
    const typeCorrelations = types.map(type => {
      const typeSignals = signals.filter(s => s.type === type);
      if (typeSignals.length === 0) return null;
      const avgRel = Math.round(typeSignals.reduce((s, sig) => s + sig.relevance, 0) / typeSignals.length);
      const threats = typeSignals.filter(s => s.sentiment === 'threat').length;
      const opps = typeSignals.filter(s => s.sentiment === 'opportunity').length;
      const alertsFromType = this.alerts.filter(a => a.source.some(src => src.type === type)).length;
      return {
        type, avgRelevance: avgRel,
        threatPct: Math.round((threats / typeSignals.length) * 100),
        opportunityPct: Math.round((opps / typeSignals.length) * 100),
        alertConversionRate: Math.round((alertsFromType / typeSignals.length) * 100),
      };
    }).filter(Boolean) as Array<{ type: string; avgRelevance: number; threatPct: number; opportunityPct: number; alertConversionRate: number }>;

    // Keyword clusters
    const keywordCoOccurrence = new Map<string, Set<string>>();
    const keywordSignalCount = new Map<string, number>();
    const keywordRelevance = new Map<string, number[]>();
    signals.forEach(s => {
      s.keywords.forEach(kw => {
        keywordSignalCount.set(kw, (keywordSignalCount.get(kw) || 0) + 1);
        const relArr = keywordRelevance.get(kw) || [];
        relArr.push(s.relevance);
        keywordRelevance.set(kw, relArr);
        const coSet = keywordCoOccurrence.get(kw) || new Set<string>();
        s.keywords.forEach(kw2 => { if (kw2 !== kw) coSet.add(kw2); });
        keywordCoOccurrence.set(kw, coSet);
      });
    });

    // Group keywords into clusters based on co-occurrence
    const clustered = new Set<string>();
    const keywordClusters: Array<{ cluster: string; keywords: string[]; signalCount: number; avgRelevance: number; trendDirection: string }> = [];
    const sortedKeywords = Array.from(keywordSignalCount.entries()).sort(([, a], [, b]) => b - a);

    for (const [kw] of sortedKeywords) {
      if (clustered.has(kw)) continue;
      const coOccurring = keywordCoOccurrence.get(kw) || new Set();
      const clusterKws = [kw, ...Array.from(coOccurring).filter(k => !clustered.has(k)).slice(0, 3)];
      clusterKws.forEach(k => clustered.add(k));
      const clusterSignalCount = clusterKws.reduce((sum, k) => sum + (keywordSignalCount.get(k) || 0), 0);
      const clusterRelArr = clusterKws.flatMap(k => keywordRelevance.get(k) || []);
      const avgRel = clusterRelArr.length > 0 ? Math.round(clusterRelArr.reduce((a, b) => a + b, 0) / clusterRelArr.length) : 0;
      keywordClusters.push({
        cluster: kw, keywords: clusterKws, signalCount: clusterSignalCount,
        avgRelevance: avgRel, trendDirection: 'stable',
      });
      if (keywordClusters.length >= 10) break;
    }

    // Temporal patterns (by week for last 4 weeks)
    const temporalPatterns: Array<{ period: string; signalCount: number; avgRelevance: number; dominantType: string; dominantSentiment: string }> = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = now - (i + 1) * 7 * 24 * 60 * 60 * 1000;
      const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
      const weekSignals = signals.filter(s => s.detectedAt.getTime() > weekStart && s.detectedAt.getTime() <= weekEnd);
      if (weekSignals.length === 0) continue;
      const weekAvgRel = Math.round(weekSignals.reduce((s, sig) => s + sig.relevance, 0) / weekSignals.length);
      const typeCounts: Record<string, number> = {};
      const sentCounts: Record<string, number> = {};
      weekSignals.forEach(s => {
        typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
        sentCounts[s.sentiment] = (sentCounts[s.sentiment] || 0) + 1;
      });
      const domType = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const domSent = Object.entries(sentCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
      temporalPatterns.push({
        period: `Week -${i + 1}`, signalCount: weekSignals.length, avgRelevance: weekAvgRel,
        dominantType: domType, dominantSentiment: domSent,
      });
    }

    // Signal velocity (daily for last 7 days)
    const signalVelocity: Array<{ period: string; count: number; avgRelevance: number }> = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = now - (i + 1) * 24 * 60 * 60 * 1000;
      const dayEnd = now - i * 24 * 60 * 60 * 1000;
      const daySignals = signals.filter(s => s.detectedAt.getTime() > dayStart && s.detectedAt.getTime() <= dayEnd);
      const dayAvgRel = daySignals.length > 0 ? Math.round(daySignals.reduce((s, sig) => s + sig.relevance, 0) / daySignals.length) : 0;
      signalVelocity.push({ period: `Day -${i + 1}`, count: daySignals.length, avgRelevance: dayAvgRel });
    }

    // Insights
    const insights: string[] = [];
    if (trend === 'rising') insights.push('Signal volume is rising â€” market activity is intensifying, increase monitoring frequency');
    if (trend === 'declining') insights.push('Signal volume is declining â€” verify data sources are still active');
    const highThreatTypes = typeCorrelations.filter(t => t.threatPct > 50);
    if (highThreatTypes.length > 0) insights.push(`Signal type(s) ${highThreatTypes.map(t => t.type).join(', ')} have >50% threat ratio â€” focus analysis on these channels`);
    const highConversion = typeCorrelations.filter(t => t.alertConversionRate > 30);
    if (highConversion.length > 0) insights.push(`Signal type(s) ${highConversion.map(t => t.type).join(', ')} have high alert conversion â€” these are most actionable`);
    if (processed.length < signals.length * 0.8 && signals.length > 0) insights.push(`Only ${Math.round((processed.length / signals.length) * 100)}% of signals processed â€” clear processing backlog`);
    if (insights.length === 0) insights.push('Signal patterns are nominal â€” intelligence pipeline operating normally');

    return {
      patternOverview: {
        totalSignals: signals.length, avgPerDay,
        avgRelevance, threatRatio: signals.length > 0 ? Math.round((threatSignals.length / signals.length) * 100) : 0,
        opportunityRatio: signals.length > 0 ? Math.round((oppSignals.length / signals.length) * 100) : 0,
        processingRate: signals.length > 0 ? Math.round((processed.length / signals.length) * 100) : 100,
      },
      volumeTrends: { last7Days, last30Days, trend, peakDay, peakHour },
      sourceDistribution,
      typeCorrelations,
      keywordClusters,
      temporalPatterns,
      signalVelocity,
      insights,
    };
  }

  /** 10/10: Threat Response Effectiveness */
  getThreatResponseEffectiveness(): {
    responseOverview: { totalAlerts: number; acknowledged: number; unacknowledged: number; avgResponseHours: number; medianResponseHours: number; criticalResponseHours: number; responseRate: number };
    responseBySeverity: Array<{ severity: string; total: number; acknowledged: number; avgResponseHours: number; unacknowledgedCount: number; oldestUnacknowledgedHours: number }>;
    responseByType: Array<{ type: string; total: number; avgResponseHours: number; acknowledgementRate: number; avgRelevance: number }>;
    responseTimeline: Array<{ period: string; alertsCreated: number; alertsAcknowledged: number; avgResponseHours: number }>;
    escalationAnalysis: { totalEscalations: number; criticalEscalations: number; avgEscalationResponseHours: number; escalationsByType: Array<{ type: string; count: number }> };
    alertSourceQuality: Array<{ sourceType: string; alertsGenerated: number; avgRelevance: number; falsePositiveEstimate: number; actionableRate: number }>;
    recommendations: Array<{ area: string; issue: string; recommendation: string; priority: string }>;
    insights: string[];
  } {
    const alerts = this.alerts;
    const signals = this.signals;
    const now = Date.now();

    const acknowledged = alerts.filter(a => a.acknowledgedAt);
    const unacknowledged = alerts.filter(a => !a.acknowledgedAt);

    // Response times in hours
    const responseTimes = acknowledged.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
    const avgResponseHours = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length * 10) / 10
      : 0;
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const medianResponseHours = sortedTimes.length > 0
      ? Math.round(sortedTimes[Math.floor(sortedTimes.length / 2)] * 10) / 10
      : 0;

    // Critical response time
    const criticalAcked = acknowledged.filter(a => a.severity === 'critical');
    const criticalTimes = criticalAcked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
    const criticalResponseHours = criticalTimes.length > 0
      ? Math.round(criticalTimes.reduce((a, b) => a + b, 0) / criticalTimes.length * 10) / 10
      : 0;

    const responseRate = alerts.length > 0
      ? Math.round((acknowledged.length / alerts.length) * 100)
      : 100;

    // Response by severity
    const severities: ThreatAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
    const responseBySeverity = severities.map(severity => {
      const sevAlerts = alerts.filter(a => a.severity === severity);
      const sevAcked = sevAlerts.filter(a => a.acknowledgedAt);
      const sevTimes = sevAcked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
      const sevUnacked = sevAlerts.filter(a => !a.acknowledgedAt);
      const oldestUnacked = sevUnacked.length > 0
        ? Math.round((now - Math.min(...sevUnacked.map(a => a.createdAt.getTime()))) / 3600000 * 10) / 10
        : 0;
      return {
        severity, total: sevAlerts.length, acknowledged: sevAcked.length,
        avgResponseHours: sevTimes.length > 0 ? Math.round(sevTimes.reduce((a, b) => a + b, 0) / sevTimes.length * 10) / 10 : 0,
        unacknowledgedCount: sevUnacked.length, oldestUnacknowledgedHours: oldestUnacked,
      };
    }).filter(s => s.total > 0);

    // Response by type
    const alertTypes: ThreatAlert['type'][] = ['competitive_launch', 'market_shift', 'regulatory', 'funding_threat', 'talent_drain'];
    const responseByType = alertTypes.map(type => {
      const typeAlerts = alerts.filter(a => a.type === type);
      if (typeAlerts.length === 0) return null;
      const typeAcked = typeAlerts.filter(a => a.acknowledgedAt);
      const typeTimes = typeAcked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
      const avgRel = typeAlerts.reduce((s, a) => s + a.source.reduce((ss, sig) => ss + sig.relevance, 0) / (a.source.length || 1), 0) / typeAlerts.length;
      return {
        type, total: typeAlerts.length,
        avgResponseHours: typeTimes.length > 0 ? Math.round(typeTimes.reduce((a, b) => a + b, 0) / typeTimes.length * 10) / 10 : 0,
        acknowledgementRate: Math.round((typeAcked.length / typeAlerts.length) * 100),
        avgRelevance: Math.round(avgRel),
      };
    }).filter(Boolean) as Array<{ type: string; total: number; avgResponseHours: number; acknowledgementRate: number; avgRelevance: number }>;

    // Response timeline (weekly for last 4 weeks)
    const responseTimeline: Array<{ period: string; alertsCreated: number; alertsAcknowledged: number; avgResponseHours: number }> = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = now - (i + 1) * 7 * 24 * 60 * 60 * 1000;
      const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
      const weekAlerts = alerts.filter(a => a.createdAt.getTime() > weekStart && a.createdAt.getTime() <= weekEnd);
      const weekAcked = weekAlerts.filter(a => a.acknowledgedAt);
      const weekTimes = weekAcked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
      responseTimeline.push({
        period: `Week -${i + 1}`, alertsCreated: weekAlerts.length, alertsAcknowledged: weekAcked.length,
        avgResponseHours: weekTimes.length > 0 ? Math.round(weekTimes.reduce((a, b) => a + b, 0) / weekTimes.length * 10) / 10 : 0,
      });
    }

    // Escalation analysis
    const escalations = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    const criticalEscalations = alerts.filter(a => a.severity === 'critical');
    const escAcked = escalations.filter(a => a.acknowledgedAt);
    const escTimes = escAcked.map(a => (a.acknowledgedAt!.getTime() - a.createdAt.getTime()) / 3600000);
    const escalationsByType = alertTypes
      .map(type => ({ type, count: escalations.filter(a => a.type === type).length }))
      .filter(e => e.count > 0);

    // Alert source quality
    const signalTypes: MarketSignal['type'][] = ['news', 'social', 'patent', 'job_posting', 'funding', 'product_launch', 'regulation'];
    const alertSourceQuality = signalTypes.map(type => {
      const typeSignals = signals.filter(s => s.type === type);
      if (typeSignals.length === 0) return null;
      const alertsFromType = alerts.filter(a => a.source.some(s => s.type === type));
      const avgRel = Math.round(typeSignals.reduce((s, sig) => s + sig.relevance, 0) / typeSignals.length);
      const lowRelevanceAlerts = alertsFromType.filter(a => a.source.every(s => s.relevance < 50));
      return {
        sourceType: type, alertsGenerated: alertsFromType.length, avgRelevance: avgRel,
        falsePositiveEstimate: alertsFromType.length > 0 ? Math.round((lowRelevanceAlerts.length / alertsFromType.length) * 100) : 0,
        actionableRate: alertsFromType.length > 0 ? Math.round(((alertsFromType.length - lowRelevanceAlerts.length) / alertsFromType.length) * 100) : 100,
      };
    }).filter(Boolean) as Array<{ sourceType: string; alertsGenerated: number; avgRelevance: number; falsePositiveEstimate: number; actionableRate: number }>;

    // Recommendations
    const recommendations: Array<{ area: string; issue: string; recommendation: string; priority: string }> = [];
    if (unacknowledged.filter(a => a.severity === 'critical').length > 0) {
      recommendations.push({ area: 'Critical Response', issue: 'Unacknowledged critical alerts', recommendation: 'Establish <1 hour SLA for critical alerts with automatic escalation', priority: 'urgent' });
    }
    if (avgResponseHours > 24) {
      recommendations.push({ area: 'Response Time', issue: 'Slow average response time', recommendation: 'Implement real-time alert notifications via Slack/email', priority: 'high' });
    }
    if (responseRate < 80) {
      recommendations.push({ area: 'Response Coverage', issue: `Only ${responseRate}% of alerts acknowledged`, recommendation: 'Review alert thresholds â€” reduce noise to improve response quality', priority: 'high' });
    }
    const highFPSources = alertSourceQuality.filter(s => s.falsePositiveEstimate > 40);
    if (highFPSources.length > 0) {
      recommendations.push({ area: 'Signal Quality', issue: `High false positive rate from ${highFPSources.map(s => s.sourceType).join(', ')}`, recommendation: 'Tune relevance thresholds for these signal types', priority: 'medium' });
    }
    if (recommendations.length === 0) {
      recommendations.push({ area: 'Operations', issue: 'No critical issues detected', recommendation: 'Maintain current threat response protocols', priority: 'low' });
    }

    // Insights
    const insights: string[] = [];
    const staleCritical = unacknowledged.filter(a => a.severity === 'critical' && (now - a.createdAt.getTime()) > 24 * 3600000);
    if (staleCritical.length > 0) insights.push(`${staleCritical.length} critical alert(s) unacknowledged for >24 hours â€” escalate immediately`);
    if (avgResponseHours > 12 && alerts.length > 0) insights.push(`Average response time is ${avgResponseHours} hours â€” target <4 hours for competitive advantage`);
    if (responseRate < 70 && alerts.length > 0) insights.push(`Response rate is ${responseRate}% â€” alert fatigue may be reducing effectiveness`);
    const competitiveLaunches = alerts.filter(a => a.type === 'competitive_launch' && !a.acknowledgedAt);
    if (competitiveLaunches.length > 0) insights.push(`${competitiveLaunches.length} competitive launch alert(s) need response â€” mobilize product/marketing teams`);
    if (insights.length === 0) insights.push('Threat response operations are performing within acceptable parameters');

    return {
      responseOverview: {
        totalAlerts: alerts.length, acknowledged: acknowledged.length,
        unacknowledged: unacknowledged.length, avgResponseHours, medianResponseHours,
        criticalResponseHours, responseRate,
      },
      responseBySeverity,
      responseByType,
      responseTimeline,
      escalationAnalysis: {
        totalEscalations: escalations.length, criticalEscalations: criticalEscalations.length,
        avgEscalationResponseHours: escTimes.length > 0 ? Math.round(escTimes.reduce((a, b) => a + b, 0) / escTimes.length * 10) / 10 : 0,
        escalationsByType,
      },
      alertSourceQuality,
      recommendations,
      insights,
    };
  }

  /** 10/10: Market Trend Forecasting & Early Warning */
  async getMarketTrendForecast(): Promise<{
    forecastOverview: { totalTrendsIdentified: number; emergingThreats: number; emergingOpportunities: number; forecastConfidence: number; dataPointsAnalyzed: number; forecastHorizonDays: number };
    emergingTrends: Array<{ trend: string; direction: 'accelerating' | 'stable' | 'decelerating'; signalCount: number; relevanceTrajectory: number[]; competitorsInvolved: string[]; riskLevel: 'low' | 'medium' | 'high' | 'critical'; firstDetected: string; projectedImpact: string }>;
    competitorTrajectories: Array<{ competitor: string; category: string; activityTrend: 'increasing' | 'stable' | 'decreasing'; signalVelocity: number; recentMoves: string[]; predictedNextMove: string; threatTrajectory: 'escalating' | 'stable' | 'diminishing' }>;
    marketShiftIndicators: Array<{ indicator: string; strength: number; direction: 'bullish' | 'bearish' | 'neutral'; signals: number; description: string }>;
    earlyWarnings: Array<{ warning: string; severity: 'watch' | 'advisory' | 'alert' | 'critical'; confidence: number; triggerSignals: number; recommendedAction: string; timeToImpact: string }>;
    keywordMomentum: Array<{ keyword: string; currentVolume: number; previousVolume: number; momentum: number; associatedCompetitors: string[]; sentimentShift: string }>;
    aiForecast: { marketOutlook: string; topThreats: string[]; topOpportunities: string[]; strategicRecommendations: string[]; confidenceLevel: number } | null;
    insights: string[];
  }> {
    const signals = this.signals;
    const competitors = Array.from(this.competitors.values());
    const alerts = this.alerts;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // --- Emerging Trends ---
    // Group signals by keyword clusters and detect acceleration
    const keywordTimeline = new Map<string, { recent: number; older: number; relevances: number[]; competitors: Set<string> }>();
    signals.forEach(s => {
      s.keywords.forEach(kw => {
        const entry = keywordTimeline.get(kw) || { recent: 0, older: 0, relevances: [], competitors: new Set<string>() };
        if (s.detectedAt.getTime() > fourteenDaysAgo) entry.recent++;
        else entry.older++;
        entry.relevances.push(s.relevance);
        s.competitors.forEach(c => entry.competitors.add(c));
        keywordTimeline.set(kw, entry);
      });
    });

    const emergingTrends = Array.from(keywordTimeline.entries())
      .filter(([, data]) => data.recent + data.older >= 2)
      .map(([keyword, data]) => {
        const total = data.recent + data.older;
        const olderNormalized = data.older / 2; // normalize to same 14-day window
        let direction: 'accelerating' | 'stable' | 'decelerating' = 'stable';
        if (data.recent > olderNormalized * 1.5) direction = 'accelerating';
        else if (data.recent < olderNormalized * 0.5 && olderNormalized > 0) direction = 'decelerating';
        const avgRelevance = Math.round(data.relevances.reduce((a, b) => a + b, 0) / data.relevances.length);
        const threatSignals = signals.filter(s => s.keywords.includes(keyword) && s.sentiment === 'threat').length;
        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (threatSignals > 3 || (direction === 'accelerating' && avgRelevance > 80)) riskLevel = 'critical';
        else if (threatSignals > 1 || avgRelevance > 70) riskLevel = 'high';
        else if (threatSignals > 0 || avgRelevance > 50) riskLevel = 'medium';

        // Relevance trajectory (split into 4 periods)
        const periods = [0, 1, 2, 3].map(i => {
          const pStart = now - (i + 1) * 7 * 24 * 60 * 60 * 1000;
          const pEnd = now - i * 7 * 24 * 60 * 60 * 1000;
          const periodSignals = signals.filter(s => s.keywords.includes(keyword) && s.detectedAt.getTime() > pStart && s.detectedAt.getTime() <= pEnd);
          return periodSignals.length > 0 ? Math.round(periodSignals.reduce((s2, sig) => s2 + sig.relevance, 0) / periodSignals.length) : 0;
        }).reverse();

        const firstSignal = signals.filter(s => s.keywords.includes(keyword)).sort((a, b) => a.detectedAt.getTime() - b.detectedAt.getTime())[0];
        return {
          trend: keyword, direction, signalCount: total, relevanceTrajectory: periods,
          competitorsInvolved: Array.from(data.competitors).slice(0, 5),
          riskLevel, firstDetected: firstSignal?.detectedAt.toISOString().split('T')[0] || 'unknown',
          projectedImpact: direction === 'accelerating' && riskLevel !== 'low'
            ? 'High â€” expect market disruption within 30-60 days'
            : direction === 'accelerating' ? 'Moderate â€” growing market interest'
            : direction === 'decelerating' ? 'Low â€” trend losing momentum' : 'Steady â€” monitor for changes',
        };
      })
      .sort((a, b) => {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel] || b.signalCount - a.signalCount;
      })
      .slice(0, 15);

    // --- Competitor Trajectories ---
    const competitorTrajectories = competitors.map(comp => {
      const compSignals = signals.filter(s => s.competitors.includes(comp.id) || s.competitors.includes(comp.name));
      const recentSignals = compSignals.filter(s => s.detectedAt.getTime() > fourteenDaysAgo);
      const olderSignals = compSignals.filter(s => s.detectedAt.getTime() <= fourteenDaysAgo && s.detectedAt.getTime() > thirtyDaysAgo);
      const olderNorm = olderSignals.length / 2.3; // normalize 16-day window to 14-day
      let activityTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (recentSignals.length > olderNorm * 1.4) activityTrend = 'increasing';
      else if (recentSignals.length < olderNorm * 0.6 && olderNorm > 0) activityTrend = 'decreasing';

      const recentMoves = recentSignals
        .filter(s => s.type === 'product_launch' || s.type === 'funding' || s.type === 'patent')
        .map(s => `${s.type}: ${s.title}`)
        .slice(0, 3);

      const compAlerts = alerts.filter(a => a.source.some(s => s.competitors.includes(comp.id) || s.competitors.includes(comp.name)));
      const recentAlerts = compAlerts.filter(a => a.createdAt.getTime() > fourteenDaysAgo);
      const olderAlerts = compAlerts.filter(a => a.createdAt.getTime() <= fourteenDaysAgo && a.createdAt.getTime() > thirtyDaysAgo);
      let threatTrajectory: 'escalating' | 'stable' | 'diminishing' = 'stable';
      if (recentAlerts.length > olderAlerts.length) threatTrajectory = 'escalating';
      else if (recentAlerts.length < olderAlerts.length && olderAlerts.length > 0) threatTrajectory = 'diminishing';

      const dominantType = recentSignals.length > 0
        ? (() => {
            const typeCounts: Record<string, number> = {};
            recentSignals.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1; });
            return Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
          })()
        : 'unknown';

      const predictedNextMove = activityTrend === 'increasing' && dominantType === 'product_launch'
        ? 'Likely to announce new product/feature within 30 days'
        : activityTrend === 'increasing' && dominantType === 'funding'
        ? 'Likely pursuing aggressive expansion post-funding'
        : activityTrend === 'increasing' && dominantType === 'job_posting'
        ? 'Scaling team â€” expect capability expansion in 60-90 days'
        : activityTrend === 'decreasing'
        ? 'Reduced market activity â€” possible internal restructuring or pivot'
        : 'Maintaining steady market presence â€” no major shifts expected';

      return {
        competitor: comp.name, category: comp.category, activityTrend,
        signalVelocity: Math.round((recentSignals.length / 14) * 10) / 10,
        recentMoves, predictedNextMove, threatTrajectory,
      };
    }).sort((a, b) => b.signalVelocity - a.signalVelocity);

    // --- Market Shift Indicators ---
    const indicatorChecks = [
      {
        indicator: 'Funding Activity',
        filter: (s: MarketSignal) => s.type === 'funding',
        bullish: 'High funding = market confidence',
        bearish: 'Low funding = market contraction',
      },
      {
        indicator: 'Product Launch Velocity',
        filter: (s: MarketSignal) => s.type === 'product_launch',
        bullish: 'Accelerating launches = expanding market',
        bearish: 'Slowing launches = market saturation',
      },
      {
        indicator: 'Regulatory Pressure',
        filter: (s: MarketSignal) => s.type === 'regulation',
        bullish: 'Low regulation = market freedom',
        bearish: 'Increasing regulation = compliance burden',
      },
      {
        indicator: 'Talent Movement',
        filter: (s: MarketSignal) => s.type === 'job_posting',
        bullish: 'Active hiring = growth confidence',
        bearish: 'Hiring freezes = market uncertainty',
      },
      {
        indicator: 'Patent Activity',
        filter: (s: MarketSignal) => s.type === 'patent',
        bullish: 'Patent filings indicate innovation investment',
        bearish: 'Declining patents = reduced R&D investment',
      },
    ];

    const marketShiftIndicators = indicatorChecks.map(check => {
      const matchSignals = signals.filter(check.filter);
      const recentCount = matchSignals.filter(s => s.detectedAt.getTime() > fourteenDaysAgo).length;
      const olderCount = matchSignals.filter(s => s.detectedAt.getTime() <= fourteenDaysAgo && s.detectedAt.getTime() > thirtyDaysAgo).length;
      const olderNorm = olderCount / 1.14; // normalize to 14-day window
      let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      let strength = 50;
      if (recentCount > olderNorm * 1.3) { direction = 'bullish'; strength = Math.min(100, 50 + Math.round((recentCount - olderNorm) * 10)); }
      else if (recentCount < olderNorm * 0.7 && olderNorm > 0) { direction = 'bearish'; strength = Math.max(0, 50 - Math.round((olderNorm - recentCount) * 10)); }
      return {
        indicator: check.indicator, strength, direction, signals: matchSignals.length,
        description: direction === 'bullish' ? check.bullish : direction === 'bearish' ? check.bearish : 'Stable â€” no significant shift detected',
      };
    });

    // --- Early Warnings ---
    const earlyWarnings: Array<{ warning: string; severity: 'watch' | 'advisory' | 'alert' | 'critical'; confidence: number; triggerSignals: number; recommendedAction: string; timeToImpact: string }> = [];

    const acceleratingThreats = emergingTrends.filter(t => t.direction === 'accelerating' && (t.riskLevel === 'high' || t.riskLevel === 'critical'));
    acceleratingThreats.forEach(t => {
      earlyWarnings.push({
        warning: `Accelerating threat trend: "${t.trend}" with ${t.signalCount} signals across ${t.competitorsInvolved.length} competitor(s)`,
        severity: t.riskLevel === 'critical' ? 'critical' : 'alert',
        confidence: Math.min(95, 50 + t.signalCount * 5),
        triggerSignals: t.signalCount,
        recommendedAction: `Conduct deep-dive analysis on "${t.trend}" â€” prepare competitive response playbook`,
        timeToImpact: '30-60 days',
      });
    });

    const escalatingCompetitors = competitorTrajectories.filter(c => c.threatTrajectory === 'escalating' && c.activityTrend === 'increasing');
    escalatingCompetitors.forEach(c => {
      earlyWarnings.push({
        warning: `Competitor "${c.competitor}" showing escalating threat with increasing activity (${c.signalVelocity} signals/day)`,
        severity: 'alert',
        confidence: Math.min(90, 50 + Math.round(c.signalVelocity * 20)),
        triggerSignals: Math.round(c.signalVelocity * 14),
        recommendedAction: `Monitor "${c.competitor}" closely â€” ${c.predictedNextMove}`,
        timeToImpact: '30-90 days',
      });
    });

    const bearishIndicators = marketShiftIndicators.filter(i => i.direction === 'bearish' && i.strength < 35);
    bearishIndicators.forEach(i => {
      earlyWarnings.push({
        warning: `Market shift indicator "${i.indicator}" trending bearish (strength: ${i.strength})`,
        severity: 'advisory',
        confidence: Math.min(80, 40 + i.signals * 3),
        triggerSignals: i.signals,
        recommendedAction: `Review exposure to ${i.indicator.toLowerCase()} risk â€” consider defensive positioning`,
        timeToImpact: '60-120 days',
      });
    });

    const unackedCritical = alerts.filter(a => a.severity === 'critical' && !a.acknowledgedAt);
    if (unackedCritical.length > 0) {
      earlyWarnings.push({
        warning: `${unackedCritical.length} unacknowledged critical alert(s) â€” response degradation risk`,
        severity: 'critical',
        confidence: 95,
        triggerSignals: unackedCritical.length,
        recommendedAction: 'Immediately triage and acknowledge all critical alerts',
        timeToImpact: 'Immediate',
      });
    }

    if (earlyWarnings.length === 0) {
      earlyWarnings.push({
        warning: 'No early warnings â€” competitive landscape is stable',
        severity: 'watch',
        confidence: 70,
        triggerSignals: 0,
        recommendedAction: 'Maintain current monitoring cadence',
        timeToImpact: 'N/A',
      });
    }

    earlyWarnings.sort((a, b) => {
      const sevOrder = { critical: 4, alert: 3, advisory: 2, watch: 1 };
      return sevOrder[b.severity] - sevOrder[a.severity];
    });

    // --- Keyword Momentum ---
    const keywordMomentum = Array.from(keywordTimeline.entries())
      .map(([keyword, data]) => {
        const olderNorm = data.older / 2;
        const momentum = olderNorm > 0 ? Math.round(((data.recent - olderNorm) / olderNorm) * 100) : data.recent > 0 ? 100 : 0;
        const kwSignals = signals.filter(s => s.keywords.includes(keyword));
        const recentSentiments = kwSignals.filter(s => s.detectedAt.getTime() > fourteenDaysAgo).map(s => s.sentiment);
        const olderSentiments = kwSignals.filter(s => s.detectedAt.getTime() <= fourteenDaysAgo).map(s => s.sentiment);
        const recentThreatPct = recentSentiments.length > 0 ? recentSentiments.filter(s => s === 'threat').length / recentSentiments.length : 0;
        const olderThreatPct = olderSentiments.length > 0 ? olderSentiments.filter(s => s === 'threat').length / olderSentiments.length : 0;
        let sentimentShift = 'stable';
        if (recentThreatPct > olderThreatPct + 0.2) sentimentShift = 'deteriorating';
        else if (recentThreatPct < olderThreatPct - 0.2) sentimentShift = 'improving';

        return {
          keyword, currentVolume: data.recent, previousVolume: Math.round(data.older / 2 * 10) / 10,
          momentum, associatedCompetitors: Array.from(data.competitors).slice(0, 3), sentimentShift,
        };
      })
      .filter(k => k.currentVolume + k.previousVolume > 0)
      .sort((a, b) => Math.abs(b.momentum) - Math.abs(a.momentum))
      .slice(0, 12);

    // --- AI Forecast ---
    let aiForecast: { marketOutlook: string; topThreats: string[]; topOpportunities: string[]; strategicRecommendations: string[]; confidenceLevel: number } | null = null;

    if (signals.length > 0) {
      try {
        const trendSummary = emergingTrends.slice(0, 5).map(t => `"${t.trend}" (${t.direction}, risk=${t.riskLevel})`).join(', ');
        const compSummary = competitorTrajectories.slice(0, 5).map(c => `${c.competitor}: ${c.activityTrend}, threat=${c.threatTrajectory}`).join('; ');
        const warningSummary = earlyWarnings.filter(w => w.severity !== 'watch').map(w => w.warning).join('; ');
        const shiftSummary = marketShiftIndicators.map(i => `${i.indicator}: ${i.direction} (strength ${i.strength})`).join('; ');

        const prompt = `You are a competitive intelligence analyst for Datacendia, an AI Executive Council platform.
Based on the following market intelligence data, provide a strategic market forecast.

Emerging Trends: ${trendSummary || 'None identified'}
Competitor Activity: ${compSummary || 'No data'}
Early Warnings: ${warningSummary || 'None'}
Market Indicators: ${shiftSummary}
Data Points Analyzed: ${signals.length} signals, ${alerts.length} alerts, ${competitors.length} competitors

Output JSON:
{
  "marketOutlook": "2-3 sentence market outlook for next 90 days",
  "topThreats": ["threat 1", "threat 2", "threat 3"],
  "topOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "strategicRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "confidenceLevel": 0-100
}`;

        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
        if (parsed.marketOutlook) aiForecast = parsed;
      } catch (error) {
        logger.warn('CendiaWatch: AI market forecast fallback');
      }
    }

    // --- Insights ---
    const insights: string[] = [];
    const criticalWarnings = earlyWarnings.filter(w => w.severity === 'critical' || w.severity === 'alert');
    if (criticalWarnings.length > 0) insights.push(`${criticalWarnings.length} active early warning(s) require immediate attention`);
    const accelTrends = emergingTrends.filter(t => t.direction === 'accelerating');
    if (accelTrends.length > 0) insights.push(`${accelTrends.length} trend(s) accelerating â€” market dynamics are shifting`);
    const escalatingComps = competitorTrajectories.filter(c => c.threatTrajectory === 'escalating');
    if (escalatingComps.length > 0) insights.push(`${escalatingComps.length} competitor(s) with escalating threat trajectory â€” activate competitive playbooks`);
    const bullishIndicators = marketShiftIndicators.filter(i => i.direction === 'bullish');
    if (bullishIndicators.length >= 3) insights.push('Market conditions are broadly bullish â€” favorable environment for aggressive positioning');
    const bearishCount = marketShiftIndicators.filter(i => i.direction === 'bearish').length;
    if (bearishCount >= 3) insights.push('Multiple bearish market indicators â€” consider defensive strategy and cost optimization');
    const hotKeywords = keywordMomentum.filter(k => k.momentum > 50 && k.sentimentShift === 'deteriorating');
    if (hotKeywords.length > 0) insights.push(`Keywords "${hotKeywords.map(k => k.keyword).join('", "')}" gaining momentum with deteriorating sentiment â€” investigate root cause`);
    if (insights.length === 0) insights.push('Market forecast is stable â€” no significant disruptions predicted in the near term');

    return {
      forecastOverview: {
        totalTrendsIdentified: emergingTrends.length,
        emergingThreats: emergingTrends.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').length,
        emergingOpportunities: signals.filter(s => s.sentiment === 'opportunity' && s.detectedAt.getTime() > fourteenDaysAgo).length,
        forecastConfidence: aiForecast?.confidenceLevel || (signals.length > 10 ? 70 : signals.length > 0 ? 50 : 30),
        dataPointsAnalyzed: signals.length + alerts.length,
        forecastHorizonDays: 90,
      },
      emergingTrends,
      competitorTrajectories,
      marketShiftIndicators,
      earlyWarnings,
      keywordMomentum,
      aiForecast,
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaWatch', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.competitors.has(d.id)) this.competitors.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaWatchService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaWatchService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaWatch',
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
      service: 'CendiaWatch',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaWatchService = new CendiaWatchService();
export default cendiaWatchService;
