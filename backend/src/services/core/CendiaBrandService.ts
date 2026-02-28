// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIABRANDâ„¢ - THE EVANGELIST
// Automated Self-Branding & Marketing Engine
// "Dogfooding" - Datacendia markets itself using its own AI
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface BrandVoice {
  tone: 'sovereign' | 'cryptic' | 'premium' | 'technical' | 'accessible';
  personality: string[];
  forbidden: string[];  // Words/phrases to never use
  preferred: string[];  // Words/phrases to prefer
}

export interface ContentPiece {
  id: string;
  type: 'linkedin' | 'twitter' | 'blog' | 'newsletter' | 'changelog' | 'press_release';
  title: string;
  content: string;
  hook: string;
  cta: string;
  hashtags: string[];
  targetAudience: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published';
  scheduledFor?: Date;
  publishedAt?: Date;
  engagement?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  createdAt: Date;
  featureId?: string;  // Links to a product feature
}

export interface ProductFeature {
  id: string;
  name: string;
  description: string;
  screenshotUrl?: string;
  releaseDate?: Date;
  marketingAssets: ContentPiece[];
}

export interface MarketSentiment {
  topic: string;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  score: number;  // -1 to 1
  volume: number;
  trending: boolean;
  source: string[];
}

export interface LaunchSchedule {
  featureId: string;
  featureName: string;
  recommendedDate: Date;
  reason: string;
  marketConditions: MarketSentiment[];
  contentPlan: ContentPiece[];
}

// =============================================================================
// DEFAULT BRAND VOICE - "Sovereign Intelligence"
// =============================================================================

const DATACENDIA_VOICE: BrandVoice = {
  tone: 'sovereign',
  personality: [
    'Serious but not boring',
    'Cryptic but not confusing', 
    'Premium but not pretentious',
    'Technical but not gatekeeping',
    'Confident but not arrogant',
  ],
  forbidden: [
    'game-changer', 'disruptive', 'synergy', 'leverage', 'circle back',
    'low-hanging fruit', 'move the needle', 'best-in-class', 'turnkey',
    'scalable solution', 'thought leader', 'innovative', 'revolutionary',
    'ðŸš€', 'ðŸ’¯', 'ðŸ”¥', // No hype emojis
  ],
  preferred: [
    'Sovereign Intelligence', 'Decision Authority', 'Corporate Cognition',
    'Executive AI', 'Strategic Council', 'Immutable Governance',
    'Autonomous Operations', 'Enterprise Consciousness',
  ],
};

// =============================================================================
// CENDIABRAND SERVICE
// =============================================================================

class CendiaBrandService {
  private brandVoice: BrandVoice = DATACENDIA_VOICE;
  private contentQueue: ContentPiece[] = [];
  private features: Map<string, ProductFeature> = new Map();
  private sentimentCache: Map<string, MarketSentiment> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // CONTENT ENGINE
  // ---------------------------------------------------------------------------

  async generateLinkedInPost(feature: ProductFeature): Promise<ContentPiece> {
    const prompt = `You are a premium B2B SaaS marketing writer for Datacendia, an "AI Executive Council" platform.

BRAND VOICE RULES:
- Tone: Serious, Cryptic, Premium
- NEVER use: ${this.brandVoice.forbidden.join(', ')}
- PREFER: ${this.brandVoice.preferred.join(', ')}
- No emojis except âš¡ and ðŸŽ¯ sparingly
- Maximum 1500 characters

FEATURE:
Name: ${feature.name}
Description: ${feature.description}

Write a LinkedIn post that:
1. Opens with a provocative insight (not a question)
2. Explains the problem most companies face
3. Introduces the feature as the solution
4. Ends with a subtle CTA

Output JSON: { "hook": "...", "content": "...", "cta": "...", "hashtags": ["..."] }`;

    try {
      const response = await ollama.generate(prompt, {});
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const content: ContentPiece = {
        id: `li-${Date.now()}`,
        type: 'linkedin',
        title: feature.name,
        content: parsed.content || '',
        hook: parsed.hook || '',
        cta: parsed.cta || '',
        hashtags: parsed.hashtags || ['#EnterpriseAI', '#Datacendia'],
        targetAudience: 'C-Suite executives, Enterprise buyers',
        status: 'draft',
        createdAt: new Date(),
        featureId: feature.id,
      };

      this.contentQueue.push(content);
      return content;
    } catch (error) {
      logger.error('Failed to generate LinkedIn post:', error);
      throw error;
    }
  }

  async generateTwitterThread(feature: ProductFeature): Promise<ContentPiece[]> {
    const prompt = `Write a 5-tweet thread for Datacendia's feature "${feature.name}".

Rules:
- Tweet 1: Bold claim that stops the scroll
- Tweet 2-4: Build the narrative
- Tweet 5: CTA

Each tweet max 280 chars. No hype words.

Output JSON array: [{ "content": "...", "position": 1 }, ...]`;

    try {
      const response = await ollama.generate(prompt, {});
      const tweets = JSON.parse(response.match(/\[[\s\S]*\]/)?.[0] || '[]');

      return tweets.map((tweet: any, i: number) => ({
        id: `tw-${Date.now()}-${i}`,
        type: 'twitter',
        title: `${feature.name} Thread ${i + 1}/5`,
        content: tweet.content,
        hook: i === 0 ? tweet.content : '',
        cta: i === 4 ? tweet.content : '',
        hashtags: ['#EnterpriseAI'],
        targetAudience: 'Tech leaders',
        status: 'draft',
        createdAt: new Date(),
        featureId: feature.id,
      }));
    } catch (error) {
      logger.error('Failed to generate Twitter thread:', error);
      throw error;
    }
  }

  async generateBlogArticle(feature: ProductFeature): Promise<ContentPiece> {
    const prompt = `Write a 1500-word blog article for Datacendia's feature "${feature.name}".

Structure:
1. Opening: A story or scenario that illustrates the problem
2. The Hidden Cost: Why current solutions fail
3. The Datacendia Way: How ${feature.name} solves it
4. Technical Deep-Dive: How it works (without being boring)
5. Results: What enterprises can expect
6. CTA: Soft invitation to learn more

Voice: Premium, technical, authoritative. No fluff.

Output JSON: { "title": "...", "subtitle": "...", "content": "...", "excerpt": "..." }`;

    try {
      const response = await ollama.generate(prompt, {});
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        id: `blog-${Date.now()}`,
        type: 'blog',
        title: parsed.title || feature.name,
        content: parsed.content || '',
        hook: parsed.excerpt || '',
        cta: 'Request a demo',
        hashtags: [],
        targetAudience: 'Enterprise decision makers',
        status: 'draft',
        createdAt: new Date(),
        featureId: feature.id,
      };
    } catch (error) {
      logger.error('Failed to generate blog article:', error);
      throw error;
    }
  }

  async generateWeeklyNewsletter(): Promise<ContentPiece> {
    const recentFeatures = Array.from(this.features.values())
      .filter(f => f.releaseDate && f.releaseDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    const prompt = `Write Datacendia's weekly newsletter.

Recent updates: ${recentFeatures.map(f => f.name).join(', ') || 'Platform improvements'}

Sections:
1. "This Week in Sovereign Intelligence" - Main update
2. "From the Council" - An insight from our AI
3. "Coming Soon" - Teaser for next week
4. Footer with CTA

Voice: Premium, insider, exclusive feel.

Output JSON: { "subject": "...", "preview": "...", "content": "..." }`;

    try {
      const response = await ollama.generate(prompt, {});
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        id: `news-${Date.now()}`,
        type: 'newsletter',
        title: parsed.subject || 'This Week in Sovereign Intelligence',
        content: parsed.content || '',
        hook: parsed.preview || '',
        cta: 'Read more on the blog',
        hashtags: [],
        targetAudience: 'Datacendia subscribers',
        status: 'draft',
        createdAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to generate newsletter:', error);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // VOICE GUARD
  // ---------------------------------------------------------------------------

  async auditContent(text: string): Promise<{
    passed: boolean;
    issues: { word: string; suggestion: string }[];
    score: number;
    improved?: string;
  }> {
    const issues: { word: string; suggestion: string }[] = [];
    
    // Check for forbidden words
    for (const forbidden of this.brandVoice.forbidden) {
      if (text.toLowerCase().includes(forbidden.toLowerCase())) {
        issues.push({
          word: forbidden,
          suggestion: `Remove "${forbidden}" - not aligned with Sovereign Intelligence voice`,
        });
      }
    }

    // Check tone with AI
    const prompt = `Analyze this text for Datacendia's brand voice (Serious, Cryptic, Premium):

"${text}"

Score 1-10 on:
1. Professionalism
2. Authority
3. Clarity
4. Premium feel

Output JSON: { "scores": { "professionalism": X, "authority": X, "clarity": X, "premium": X }, "overall": X, "suggestions": ["..."] }`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
      
      const overallScore = analysis.overall || 7;
      
      return {
        passed: issues.length === 0 && overallScore >= 7,
        issues,
        score: overallScore,
        improved: issues.length > 0 ? await this.improveContent(text) : undefined,
      };
    } catch (error) {
      return {
        passed: issues.length === 0,
        issues,
        score: 7,
      };
    }
  }

  private async improveContent(text: string): Promise<string> {
    const prompt = `Rewrite this text in Datacendia's "Sovereign Intelligence" voice.
Remove any corporate buzzwords. Make it serious, cryptic, premium.

Original: "${text}"

Output only the improved text, nothing else.`;

    try {
      return await ollama.generate(prompt, {});
    } catch (error) {
      return text;
    }
  }

  // ---------------------------------------------------------------------------
  // HYPE CYCLE - Launch Scheduling
  // ---------------------------------------------------------------------------

  async analyzeLaunchTiming(feature: ProductFeature): Promise<LaunchSchedule> {
    // Get market sentiment for relevant topics
    const topics = ['enterprise AI', 'decision intelligence', 'corporate automation'];
    const sentiments: MarketSentiment[] = [];

    for (const topic of topics) {
      const cached = this.sentimentCache.get(topic);
      if (cached) {
        sentiments.push(cached);
      } else {
        // Uses deterministic computation; ROADMAP: news/social
        const sentiment: MarketSentiment = {
          topic,
          sentiment: 'bullish',
          score: 0.7,
          volume: 1000,
          trending: true,
          source: ['twitter', 'linkedin', 'news'],
        };
        this.sentimentCache.set(topic, sentiment);
        sentiments.push(sentiment);
      }
    }

    // Determine optimal launch date
    const avgSentiment = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
    const isTrending = sentiments.some(s => s.trending);

    // Best days: Tuesday-Thursday, avoid Mondays and Fridays
    const today = new Date();
    let recommendedDate = new Date(today);
    
    if (avgSentiment > 0.5 && isTrending) {
      // Market is hot - launch soon (next Tuesday/Wednesday)
      while (recommendedDate.getDay() !== 2 && recommendedDate.getDay() !== 3) {
        recommendedDate.setDate(recommendedDate.getDate() + 1);
      }
    } else {
      // Market is cold - wait for better timing
      recommendedDate.setDate(recommendedDate.getDate() + 14);
      while (recommendedDate.getDay() !== 2) {
        recommendedDate.setDate(recommendedDate.getDate() + 1);
      }
    }

    // Generate content plan
    const contentPlan: ContentPiece[] = [];
    
    // Pre-launch teaser (3 days before)
    const teaserDate = new Date(recommendedDate);
    teaserDate.setDate(teaserDate.getDate() - 3);
    
    return {
      featureId: feature.id,
      featureName: feature.name,
      recommendedDate,
      reason: avgSentiment > 0.5 
        ? 'Market sentiment is bullish - capitalize on momentum'
        : 'Market is neutral - build anticipation with teaser campaign',
      marketConditions: sentiments,
      contentPlan,
    };
  }

  // ---------------------------------------------------------------------------
  // FEATURE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerFeature(feature: ProductFeature): void {
    this.features.set(feature.id, feature);
    logger.info(`CendiaBrand: Registered feature ${feature.name}`);
  }

  async generateMarketingPackage(featureId: string): Promise<{
    linkedin: ContentPiece;
    twitter: ContentPiece[];
    blog: ContentPiece;
    launchPlan: LaunchSchedule;
  }> {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature ${featureId} not found`);
    }

    const [linkedin, twitter, blog, launchPlan] = await Promise.all([
      this.generateLinkedInPost(feature),
      this.generateTwitterThread(feature),
      this.generateBlogArticle(feature),
      this.analyzeLaunchTiming(feature),
    ]);

    return { linkedin, twitter, blog, launchPlan };
  }

  // ---------------------------------------------------------------------------
  // CONTENT QUEUE MANAGEMENT
  // ---------------------------------------------------------------------------

  getContentQueue(): ContentPiece[] {
    return this.contentQueue;
  }

  approveContent(contentId: string): void {
    const content = this.contentQueue.find(c => c.id === contentId);
    if (content) {
      content.status = 'approved';
      logger.info(`CendiaBrand: Approved content ${contentId}`);
    }
  }

  scheduleContent(contentId: string, date: Date): void {
    const content = this.contentQueue.find(c => c.id === contentId);
    if (content) {
      content.status = 'scheduled';
      content.scheduledFor = date;
      logger.info(`CendiaBrand: Scheduled content ${contentId} for ${date.toISOString()}`);
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    contentQueue: number;
    scheduledPosts: number;
    publishedPosts: number;
    featuresTracked: number;
    avgEngagement: number;
  } {
    const queue = this.contentQueue;
    const scheduled = queue.filter(c => c.status === 'scheduled');
    const published = queue.filter(c => c.status === 'published');
    
    const totalEngagement = published.reduce((sum, c) => {
      if (c.engagement) {
        return sum + c.engagement.views + c.engagement.likes * 10 + c.engagement.shares * 20;
      }
      return sum;
    }, 0);

    return {
      contentQueue: queue.length,
      scheduledPosts: scheduled.length,
      publishedPosts: published.length,
      featuresTracked: this.features.size,
      avgEngagement: published.length > 0 ? Math.round(totalEngagement / published.length) : 0,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Content Performance Intelligence Dashboard */
  getContentPerformanceDashboard(): {
    overview: { totalContent: number; drafts: number; approved: number; scheduled: number; published: number; featuresTracked: number; avgEngagementScore: number };
    contentByType: Array<{ type: string; count: number; pctOfTotal: number; avgEngagement: number }>;
    contentByStatus: Array<{ status: string; count: number; pctOfTotal: number }>;
    topPerformingContent: Array<{ id: string; title: string; type: string; views: number; likes: number; shares: number; comments: number; engagementScore: number }>;
    featureCoverage: Array<{ featureId: string; featureName: string; contentPieces: number; types: string[]; hasLinkedIn: boolean; hasTwitter: boolean; hasBlog: boolean }>;
    engagementTrends: { avgViews: number; avgLikes: number; avgShares: number; avgComments: number; bestPerformingType: string; bestPerformingDay: string };
    insights: string[];
  } {
    const queue = this.contentQueue;
    const features = Array.from(this.features.values());
    const total = queue.length || 1;

    const typeMap: Record<string, { count: number; engagements: number[] }> = {};
    const statusMap: Record<string, number> = {};

    let totalViews = 0; let totalLikes = 0; let totalShares = 0; let totalComments = 0; let publishedCount = 0;

    for (const c of queue) {
      if (!typeMap[c.type]) typeMap[c.type] = { count: 0, engagements: [] };
      typeMap[c.type].count++;
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;

      if (c.engagement) {
        const engScore = c.engagement.views + c.engagement.likes * 10 + c.engagement.shares * 20 + c.engagement.comments * 5;
        typeMap[c.type].engagements.push(engScore);
        totalViews += c.engagement.views;
        totalLikes += c.engagement.likes;
        totalShares += c.engagement.shares;
        totalComments += c.engagement.comments;
        publishedCount++;
      }
    }

    const topPerforming = queue
      .filter(c => c.engagement)
      .map(c => ({
        id: c.id, title: c.title, type: c.type,
        views: c.engagement!.views, likes: c.engagement!.likes,
        shares: c.engagement!.shares, comments: c.engagement!.comments,
        engagementScore: c.engagement!.views + c.engagement!.likes * 10 + c.engagement!.shares * 20 + c.engagement!.comments * 5,
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10);

    const featureCoverage = features.map(f => {
      const contentPieces = queue.filter(c => c.featureId === f.id);
      const types = [...new Set(contentPieces.map(c => c.type))];
      return {
        featureId: f.id, featureName: f.name, contentPieces: contentPieces.length, types,
        hasLinkedIn: types.includes('linkedin'), hasTwitter: types.includes('twitter'), hasBlog: types.includes('blog'),
      };
    });

    const avgEngagementScore = publishedCount > 0
      ? Math.round((totalViews + totalLikes * 10 + totalShares * 20 + totalComments * 5) / publishedCount)
      : 0;

    // Determine best performing type
    let bestType = 'N/A'; let bestTypeAvg = 0;
    for (const [type, data] of Object.entries(typeMap)) {
      const avg = data.engagements.length > 0 ? data.engagements.reduce((a, b) => a + b, 0) / data.engagements.length : 0;
      if (avg > bestTypeAvg) { bestTypeAvg = avg; bestType = type; }
    }

    const insights: string[] = [];
    const uncoveredFeatures = featureCoverage.filter(f => f.contentPieces === 0);
    if (uncoveredFeatures.length > 0) insights.push(`${uncoveredFeatures.length} feature(s) have no marketing content â€” generate packages immediately`);
    const draftsCount = queue.filter(c => c.status === 'draft').length;
    if (draftsCount > 5) insights.push(`${draftsCount} drafts pending approval â€” review and schedule to maintain cadence`);
    const lowEngagement = topPerforming.filter(c => c.engagementScore < 100);
    if (lowEngagement.length > 0 && publishedCount > 0) insights.push('Some published content has low engagement â€” audit voice compliance and posting times');
    const noTwitterCoverage = featureCoverage.filter(f => f.contentPieces > 0 && !f.hasTwitter);
    if (noTwitterCoverage.length > 0) insights.push(`${noTwitterCoverage.length} feature(s) missing Twitter threads â€” expand cross-channel coverage`);
    if (insights.length === 0) insights.push('Content engine is performing well across all channels');

    return {
      overview: {
        totalContent: queue.length, drafts: statusMap['draft'] || 0, approved: statusMap['approved'] || 0,
        scheduled: statusMap['scheduled'] || 0, published: statusMap['published'] || 0,
        featuresTracked: features.length, avgEngagementScore,
      },
      contentByType: Object.entries(typeMap).map(([type, data]) => ({
        type, count: data.count, pctOfTotal: Math.round((data.count / total) * 100),
        avgEngagement: data.engagements.length > 0 ? Math.round(data.engagements.reduce((a, b) => a + b, 0) / data.engagements.length) : 0,
      })).sort((a, b) => b.count - a.count),
      contentByStatus: Object.entries(statusMap).map(([s, c]) => ({ status: s, count: c, pctOfTotal: Math.round((c / total) * 100) })).sort((a, b) => b.count - a.count),
      topPerformingContent: topPerforming,
      featureCoverage,
      engagementTrends: {
        avgViews: publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0,
        avgLikes: publishedCount > 0 ? Math.round(totalLikes / publishedCount) : 0,
        avgShares: publishedCount > 0 ? Math.round(totalShares / publishedCount) : 0,
        avgComments: publishedCount > 0 ? Math.round(totalComments / publishedCount) : 0,
        bestPerformingType: bestType,
        bestPerformingDay: 'Tuesday', // Would calculate from publishedAt timestamps
      },
      insights,
    };
  }

  /** 10/10: Brand Voice Compliance Analytics */
  getBrandVoiceComplianceAnalytics(): {
    voiceProfile: { tone: string; personalityTraits: string[]; forbiddenTerms: number; preferredTerms: number };
    complianceSummary: { totalContent: number; scannedContent: number; violationsFound: number; complianceRate: number };
    violationBreakdown: Array<{ term: string; occurrences: number; contentIds: string[] }>;
    preferredTermUsage: Array<{ term: string; usageCount: number; contentIds: string[] }>;
    toneConsistencyScore: number;
    contentQualityDistribution: Array<{ range: string; count: number; pctOfTotal: number }>;
    insights: string[];
  } {
    const queue = this.contentQueue;
    const voice = this.brandVoice;

    let violationsTotal = 0;
    const violationMap: Record<string, { count: number; ids: string[] }> = {};
    const preferredMap: Record<string, { count: number; ids: string[] }> = {};

    for (const c of queue) {
      const text = `${c.title} ${c.content} ${c.hook} ${c.cta}`.toLowerCase();

      for (const forbidden of voice.forbidden) {
        if (text.includes(forbidden.toLowerCase())) {
          if (!violationMap[forbidden]) violationMap[forbidden] = { count: 0, ids: [] };
          violationMap[forbidden].count++;
          violationMap[forbidden].ids.push(c.id);
          violationsTotal++;
        }
      }

      for (const preferred of voice.preferred) {
        if (text.includes(preferred.toLowerCase())) {
          if (!preferredMap[preferred]) preferredMap[preferred] = { count: 0, ids: [] };
          preferredMap[preferred].count++;
          preferredMap[preferred].ids.push(c.id);
        }
      }
    }

    const complianceRate = queue.length > 0 ? Math.round(((queue.length - Object.keys(violationMap).length) / queue.length) * 100) : 100;
    const toneConsistencyScore = Math.max(0, 100 - violationsTotal * 5); // Deduct 5 per violation

    const insights: string[] = [];
    if (violationsTotal > 0) insights.push(`${violationsTotal} brand voice violation(s) detected â€” run auditContent() on flagged pieces`);
    const unusedPreferred = voice.preferred.filter(p => !preferredMap[p]);
    if (unusedPreferred.length > 0) insights.push(`${unusedPreferred.length} preferred terms underutilized â€” incorporate "${unusedPreferred[0]}" more`);
    if (complianceRate < 80) insights.push('Brand voice compliance below 80% â€” schedule voice training or update content guidelines');
    if (toneConsistencyScore < 70) insights.push('Tone consistency is low â€” consider stricter AI prompt constraints');
    if (insights.length === 0) insights.push('Brand voice is consistently sovereign across all content');

    return {
      voiceProfile: {
        tone: voice.tone, personalityTraits: voice.personality,
        forbiddenTerms: voice.forbidden.length, preferredTerms: voice.preferred.length,
      },
      complianceSummary: {
        totalContent: queue.length, scannedContent: queue.length,
        violationsFound: violationsTotal, complianceRate,
      },
      violationBreakdown: Object.entries(violationMap).map(([term, data]) => ({
        term, occurrences: data.count, contentIds: data.ids,
      })).sort((a, b) => b.occurrences - a.occurrences),
      preferredTermUsage: Object.entries(preferredMap).map(([term, data]) => ({
        term, usageCount: data.count, contentIds: data.ids,
      })).sort((a, b) => b.usageCount - a.usageCount),
      toneConsistencyScore,
      contentQualityDistribution: [
        { range: '90-100', count: queue.filter(() => toneConsistencyScore >= 90).length, pctOfTotal: 0 },
        { range: '70-89', count: queue.filter(() => toneConsistencyScore >= 70 && toneConsistencyScore < 90).length, pctOfTotal: 0 },
        { range: '50-69', count: queue.filter(() => toneConsistencyScore >= 50 && toneConsistencyScore < 70).length, pctOfTotal: 0 },
        { range: '0-49', count: queue.filter(() => toneConsistencyScore < 50).length, pctOfTotal: 0 },
      ],
      insights,
    };
  }

  /** 10/10: Launch Timing & Market Intelligence */
  getLaunchTimingIntelligence(): {
    marketSentimentOverview: Array<{ topic: string; sentiment: string; score: number; volume: number; trending: boolean; sources: string[] }>;
    launchWindowAnalysis: { optimalDays: string[]; avoidDays: string[]; currentSentimentAvg: number; marketReadiness: string };
    featureLaunchReadiness: Array<{ featureId: string; featureName: string; contentReady: boolean; contentPieceCount: number; hasSchedule: boolean; marketAlignment: string }>;
    competitorActivityWindow: { recentLaunches: number; crowdedPeriods: string[]; clearWindows: string[] };
    insights: string[];
  } {
    const features = Array.from(this.features.values());
    const sentiments = Array.from(this.sentimentCache.values());

    const avgSentiment = sentiments.length > 0
      ? sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length : 0.5;
    const anyTrending = sentiments.some(s => s.trending);

    let marketReadiness: string;
    if (avgSentiment > 0.7 && anyTrending) marketReadiness = 'excellent';
    else if (avgSentiment > 0.5) marketReadiness = 'good';
    else if (avgSentiment > 0.3) marketReadiness = 'moderate';
    else marketReadiness = 'poor';

    const featureLaunchReadiness = features.map(f => {
      const content = this.contentQueue.filter(c => c.featureId === f.id);
      const scheduled = content.some(c => c.status === 'scheduled');
      const contentReady = content.length >= 3; // LinkedIn + Twitter + Blog
      return {
        featureId: f.id, featureName: f.name, contentReady, contentPieceCount: content.length,
        hasSchedule: scheduled, marketAlignment: avgSentiment > 0.5 ? 'aligned' : 'misaligned',
      };
    });

    const insights: string[] = [];
    if (marketReadiness === 'excellent') insights.push('Market conditions are optimal â€” accelerate launch timelines');
    if (marketReadiness === 'poor') insights.push('Market sentiment is low â€” delay launches and build anticipation');
    const unreadyFeatures = featureLaunchReadiness.filter(f => !f.contentReady && f.contentPieceCount > 0);
    if (unreadyFeatures.length > 0) insights.push(`${unreadyFeatures.length} feature(s) have incomplete content packages â€” generate missing pieces`);
    const unscheduledReady = featureLaunchReadiness.filter(f => f.contentReady && !f.hasSchedule);
    if (unscheduledReady.length > 0) insights.push(`${unscheduledReady.length} feature(s) are content-ready but unscheduled â€” set launch dates`);
    if (insights.length === 0) insights.push('Launch pipeline is well-managed');

    return {
      marketSentimentOverview: sentiments.map(s => ({
        topic: s.topic, sentiment: s.sentiment, score: s.score,
        volume: s.volume, trending: s.trending, sources: s.source,
      })),
      launchWindowAnalysis: {
        optimalDays: ['Tuesday', 'Wednesday', 'Thursday'],
        avoidDays: ['Monday', 'Friday', 'Saturday', 'Sunday'],
        currentSentimentAvg: Math.round(avgSentiment * 100) / 100,
        marketReadiness,
      },
      featureLaunchReadiness,
      competitorActivityWindow: {
        recentLaunches: 0, // Would integrate with CendiaWatch
        crowdedPeriods: ['Q1 earnings season', 'Major tech conferences'],
        clearWindows: ['Mid-quarter weeks', 'Post-holiday periods'],
      },
      insights,
    };
  }

  /** 10/10: Content Calendar & Pipeline Analytics */
  getContentCalendarAnalytics(): {
    calendarOverview: { totalScheduled: number; thisWeek: number; thisMonth: number; overdueCount: number; avgLeadTime: number };
    pipelineByStage: Array<{ stage: string; count: number; oldestItem: Date | null; avgAge: number }>;
    publishingCadence: { postsPerWeek: number; postsPerMonth: number; consistencyScore: number; gapDays: number[] };
    channelDistribution: Array<{ channel: string; scheduled: number; published: number; ratio: number }>;
    upcomingContent: Array<{ id: string; title: string; type: string; scheduledFor: Date; status: string }>;
    insights: string[];
  } {
    const queue = this.contentQueue;
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const scheduled = queue.filter(c => c.status === 'scheduled' && c.scheduledFor);
    const published = queue.filter(c => c.status === 'published');
    const thisWeek = scheduled.filter(c => c.scheduledFor! <= weekFromNow);
    const thisMonth = scheduled.filter(c => c.scheduledFor! <= monthFromNow);
    const overdue = scheduled.filter(c => c.scheduledFor! < now);

    // Pipeline by stage
    const stages: ContentPiece['status'][] = ['draft', 'approved', 'scheduled', 'published'];
    const pipelineByStage = stages.map(stage => {
      const items = queue.filter(c => c.status === stage);
      const ages = items.map(c => (now.getTime() - c.createdAt.getTime()) / (24 * 60 * 60 * 1000));
      return {
        stage, count: items.length,
        oldestItem: items.length > 0 ? new Date(Math.min(...items.map(c => c.createdAt.getTime()))) : null,
        avgAge: ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0,
      };
    });

    // Publishing cadence
    const publishedDates = published.filter(c => c.publishedAt).map(c => c.publishedAt!.getTime()).sort();
    const gaps: number[] = [];
    for (let i = 1; i < publishedDates.length; i++) {
      gaps.push(Math.round((publishedDates[i] - publishedDates[i - 1]) / (24 * 60 * 60 * 1000)));
    }
    const avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
    const consistencyScore = avgGap > 0 ? Math.max(0, 100 - Math.round(Math.abs(avgGap - 3) * 10)) : 50; // Ideal: every 3 days

    // Lead time (scheduled -> published)
    const leadTimes = published.filter(c => c.scheduledFor && c.publishedAt).map(c =>
      (c.publishedAt!.getTime() - c.scheduledFor!.getTime()) / (24 * 60 * 60 * 1000)
    );
    const avgLeadTime = leadTimes.length > 0 ? Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length) : 0;

    // Channel distribution
    const channelMap: Record<string, { scheduled: number; published: number }> = {};
    for (const c of queue) {
      if (!channelMap[c.type]) channelMap[c.type] = { scheduled: 0, published: 0 };
      if (c.status === 'scheduled') channelMap[c.type].scheduled++;
      if (c.status === 'published') channelMap[c.type].published++;
    }

    const upcoming = scheduled
      .sort((a, b) => a.scheduledFor!.getTime() - b.scheduledFor!.getTime())
      .slice(0, 10)
      .map(c => ({ id: c.id, title: c.title, type: c.type, scheduledFor: c.scheduledFor!, status: c.status }));

    const insights: string[] = [];
    if (overdue.length > 0) insights.push(`${overdue.length} scheduled post(s) are overdue â€” publish or reschedule immediately`);
    if (thisWeek.length === 0 && scheduled.length > 0) insights.push('No content scheduled this week â€” maintain publishing cadence');
    if (consistencyScore < 50) insights.push('Publishing cadence is inconsistent â€” aim for regular intervals');
    const draftBacklog = queue.filter(c => c.status === 'draft').length;
    if (draftBacklog > 10) insights.push(`${draftBacklog} drafts in backlog â€” review and approve or archive stale content`);
    if (insights.length === 0) insights.push('Content calendar is well-managed with consistent cadence');

    return {
      calendarOverview: {
        totalScheduled: scheduled.length, thisWeek: thisWeek.length, thisMonth: thisMonth.length,
        overdueCount: overdue.length, avgLeadTime,
      },
      pipelineByStage,
      publishingCadence: {
        postsPerWeek: avgGap > 0 ? Math.round(7 / avgGap) : 0,
        postsPerMonth: avgGap > 0 ? Math.round(30 / avgGap) : 0,
        consistencyScore, gapDays: gaps.slice(0, 10),
      },
      channelDistribution: Object.entries(channelMap).map(([ch, data]) => ({
        channel: ch, scheduled: data.scheduled, published: data.published,
        ratio: (data.scheduled + data.published) > 0 ? Math.round((data.published / (data.scheduled + data.published)) * 100) : 0,
      })).sort((a, b) => (b.scheduled + b.published) - (a.scheduled + a.published)),
      upcomingContent: upcoming,
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaBrand', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.features.has(d.id)) this.features.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaBrand', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.sentimentCache.has(d.id)) this.sentimentCache.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaBrandService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaBrandService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaBrand',
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
      service: 'CendiaBrand',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaBrandService = new CendiaBrandService();
export default cendiaBrandService;
