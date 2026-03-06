/**
 * Feature — Pre Mortem
 *
 * Feature module implementing a specific platform capability.
 *
 * @exports PreMortemService, PREMORTEM_AGENTS, preMortemService, PreMortemRequest, FailureMode, Mitigation, PreMortemResult, PreMortemRecommendation
 * @module features/holy-shit/PreMortem
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PRE-MORTEM FEATURE
// AI-powered failure analysis before decisions are made
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { eventBus } from '../../core/events/EventBus.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import { getErrorMessage } from '../../utils/errors.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PreMortemRequest {
  organizationId: string;
  userId: string;
  decision: string;
  context?: string;
  timeframe?: string;
  budget?: number;
  stakeholders?: string[];
  selectedAgents?: string[]; // Agent IDs to use (defaults to ['cfo', 'ciso', 'pessimist'])
  tier: SubscriptionTier;
}

export interface FailureMode {
  id: string;
  rank: number;
  title: string;
  description: string;
  probability: number; // 0-100
  costImpact: number; // Dollar amount
  category: FailureCategory;
  triggers: string[];
  earlyWarnings: string[];
  mitigations: Mitigation[];
  dependencies: string[];
  timeline: string;
}

export type FailureCategory = 
  | 'operational'
  | 'financial'
  | 'regulatory'
  | 'market'
  | 'technical'
  | 'people'
  | 'strategic'
  | 'external';

export interface Mitigation {
  id: string;
  action: string;
  cost: number;
  effectiveness: number; // 0-100
  timeToImplement: string;
  owner?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface PreMortemResult {
  id: string;
  decision: string;
  analyzedAt: Date;
  failureModes: FailureMode[];
  totalRiskWeightedExposure: number;
  overallRiskScore: number; // 0-100
  recommendation: PreMortemRecommendation;
  executiveSummary: string;
  topMitigations: Mitigation[];
  decisionMatrix: DecisionMatrix;
  agentAnalyses: AgentAnalysis[];
}

export interface PreMortemRecommendation {
  action: 'proceed' | 'proceed_with_caution' | 'delay' | 'abort';
  reasoning: string;
  conditions: string[];
  alternativeOptions: string[];
}

export interface DecisionMatrix {
  proceedScore: number;
  riskAdjustedReturn: number;
  confidenceLevel: number;
  dataQuality: 'high' | 'medium' | 'low';
}

export interface AgentAnalysis {
  agentId: string;
  agentName: string;
  agentRole: string;
  perspective: string;
  concerns: string[];
  supportingFactors: string[];
  riskAssessment: number; // 0-100
  recommendation: string;
}

// =============================================================================
// PRE-MORTEM AGENT PROMPTS
// =============================================================================

const PREMORTEM_SYSTEM_PROMPT = `You are a Pre-Mortem Analysis Expert. Your role is to imagine that a decision has ALREADY FAILED and work backward to explain exactly why it failed.

You must analyze from multiple failure perspectives:
1. OPERATIONAL - Process failures, resource constraints, execution gaps
2. FINANCIAL - Cash flow issues, budget overruns, ROI failures
3. REGULATORY - Compliance failures, legal challenges, policy violations
4. MARKET - Competitive responses, market shifts, customer rejection
5. TECHNICAL - Technology failures, integration issues, scalability problems
6. PEOPLE - Talent gaps, cultural resistance, leadership failures
7. STRATEGIC - Wrong timing, wrong approach, wrong assumptions
8. EXTERNAL - Economic changes, geopolitical events, force majeure

For each failure mode, you MUST provide:
- Probability (0-100%)
- Cost Impact (specific dollar amount)
- Early warning signs
- Specific mitigation actions

Be brutally honest. Your job is to find problems BEFORE they happen.`;

export const PREMORTEM_AGENTS = {
  cfo: {
    id: 'cfo',
    name: 'CFO Agent',
    role: 'Chief Financial Officer',
    icon: '??',
    color: '#10B981',
    description: 'Financial risk analysis, ROI, cash flow',
    prompt: `Analyze this decision from a CFO perspective. Focus on:
- Cash flow implications and timing
- ROI calculations and assumptions
- Financial risks and exposures
- Budget impacts and opportunity costs
- Investor/board financial concerns`,
  },
  coo: {
    id: 'coo',
    name: 'COO Agent',
    role: 'Chief Operating Officer',
    icon: '??',
    color: '#F59E0B',
    description: 'Operations, capacity, execution',
    prompt: `Analyze this decision from a COO perspective. Focus on:
- Operational capacity and resource requirements
- Process changes and disruption
- Timeline feasibility
- Cross-functional dependencies
- Execution risks`,
  },
  cro: {
    id: 'cro',
    name: 'CRO Agent',
    role: 'Chief Revenue Officer',
    icon: '??',
    color: '#8B5CF6',
    description: 'Revenue impact, sales, market position',
    prompt: `Analyze this decision from a CRO perspective. Focus on:
- Revenue impact and timing
- Customer acquisition/retention risks
- Sales team capacity and readiness
- Market positioning effects
- Competitive dynamics`,
  },
  ciso: {
    id: 'ciso',
    name: 'CISO Agent',
    role: 'Chief Information Security Officer',
    icon: '??',
    color: '#EF4444',
    description: 'Security, compliance, data protection',
    prompt: `Analyze this decision from a CISO perspective. Focus on:
- Security and compliance risks
- Regulatory implications
- Data protection concerns
- Third-party risk
- Liability exposure`,
  },
  cto: {
    id: 'cto',
    name: 'CTO Agent',
    role: 'Chief Technology Officer',
    icon: '??',
    color: '#06B6D4',
    description: 'Technology feasibility, scalability, integration',
    prompt: `Analyze this decision from a CTO perspective. Focus on:
- Technical feasibility and complexity
- Scalability concerns
- Integration challenges
- Technical debt implications
- Innovation opportunities and risks`,
  },
  legal: {
    id: 'legal',
    name: 'Legal Agent',
    role: 'General Counsel',
    icon: '??',
    color: '#6366F1',
    description: 'Legal risks, contracts, liability',
    prompt: `Analyze this decision from a Legal perspective. Focus on:
- Legal and regulatory compliance
- Contract risks and obligations
- Intellectual property concerns
- Liability exposure
- Litigation risks`,
  },
  hr: {
    id: 'hr',
    name: 'HR Agent',
    role: 'Chief People Officer',
    icon: '??',
    color: '#EC4899',
    description: 'People, culture, talent risks',
    prompt: `Analyze this decision from an HR perspective. Focus on:
- Talent requirements and availability
- Cultural impact and change management
- Employee retention risks
- Training and development needs
- Organizational restructuring implications`,
  },
  market: {
    id: 'market',
    name: 'Market Agent',
    role: 'Market Analyst',
    icon: '??',
    color: '#14B8A6',
    description: 'Market dynamics, competition, trends',
    prompt: `Analyze this decision from a Market perspective. Focus on:
- Competitive landscape changes
- Market timing risks
- Customer behavior predictions
- Industry trend alignment
- Geographic/demographic factors`,
  },
  customer: {
    id: 'customer',
    name: 'Customer Agent',
    role: 'Voice of Customer',
    icon: '??',
    color: '#F97316',
    description: 'Customer impact, satisfaction, adoption',
    prompt: `Analyze this decision from a Customer perspective. Focus on:
- Customer experience impact
- Adoption barriers and friction
- Customer satisfaction risks
- Support and service implications
- Customer retention/churn risks`,
  },
  strategist: {
    id: 'strategist',
    name: 'Strategy Agent',
    role: 'Chief Strategy Officer',
    icon: '??',
    color: '#3B82F6',
    description: 'Strategic alignment, long-term impact',
    prompt: `Analyze this decision from a Strategy perspective. Focus on:
- Strategic alignment
- Long-term implications
- Market timing
- Competitive moats
- Alternative approaches`,
  },
  pessimist: {
    id: 'pessimist',
    name: "Devil's Advocate",
    role: 'Critical Analyst',
    icon: '??',
    color: '#991B1B',
    description: 'Finds every possible way this could fail',
    prompt: `You are the Devil's Advocate. Your job is to find EVERY possible way this decision could fail. 
Be skeptical of optimistic assumptions. Challenge the data. Question the timing. 
Find the hidden risks that others miss.`,
  },
};

// =============================================================================
// PRE-MORTEM SERVICE
// =============================================================================

export class PreMortemService extends BaseService {
  private ollamaEndpoint: string;
  private analysisHistory: Map<string, PreMortemResult[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'pre-mortem',
      version: '1.0.0',
      dependencies: ['council'],
      ...config,
    });
    this.ollamaEndpoint = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Pre-Mortem service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Pre-Mortem service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/tags`);
      return {
        status: response.ok ? 'healthy' : 'degraded',
        lastCheck: new Date(),
        latency: Date.now() - start,
        details: { ollama: response.ok ? 'connected' : 'error' },
      };
    } catch {
      return {
        status: 'degraded',
        lastCheck: new Date(),
        latency: Date.now() - start,
        errors: ['Ollama not reachable'],
      };
    }
  }

  // ---------------------------------------------------------------------------
  // FEATURE ACCESS CHECK
  // ---------------------------------------------------------------------------

  checkAccess(tier: SubscriptionTier, organizationId: string): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'preMortem')) {
      return {
        allowed: false,
        reason: `Pre-Mortem analysis requires ${featureGating.getUpgradeTierForFeature('preMortem')} tier or higher.`,
      };
    }
    return { allowed: true };
  }

  // ---------------------------------------------------------------------------
  // MAIN ANALYSIS FUNCTION
  // ---------------------------------------------------------------------------

  async analyze(request: PreMortemRequest): Promise<PreMortemResult> {
    const startTime = Date.now();

    // Check feature access
    const access = this.checkAccess(request.tier, request.organizationId);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    // Check usage limits
    const currentUsage = this.getMonthlyUsage(request.organizationId);
    if (!featureGating.isWithinLimit(request.tier, 'preMortemAnalysesPerMonth', currentUsage)) {
      throw new Error('Monthly Pre-Mortem analysis limit reached. Please upgrade your plan.');
    }

    this.logger.info(`Starting Pre-Mortem analysis for: ${request.decision}`);

    // Emit event
    eventBus.publish(eventBus.createEvent('pre-mortem', 'analysis.started', {
      organizationId: request.organizationId,
      decision: request.decision,
    }));

    try {
      // Run parallel agent analyses
      const agentAnalyses = await this.runAgentAnalyses(request);
      
      // Synthesize failure modes
      const failureModes = await this.synthesizeFailureModes(request, agentAnalyses);
      
      // Calculate risk metrics
      const totalExposure = failureModes.reduce(
        (sum, fm) => sum + (fm.probability / 100) * fm.costImpact,
        0
      );
      
      const overallRiskScore = this.calculateOverallRisk(failureModes);
      
      // Generate recommendation
      const recommendation = this.generateRecommendation(failureModes, overallRiskScore);
      
      // Create decision matrix
      const decisionMatrix = this.createDecisionMatrix(failureModes, request);
      
      // Generate executive summary
      const executiveSummary = await this.generateExecutiveSummary(
        request.decision,
        failureModes,
        recommendation
      );
      
      // Extract top mitigations
      const topMitigations = this.extractTopMitigations(failureModes);

      const result: PreMortemResult = {
        id: `pm-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
        decision: request.decision,
        analyzedAt: new Date(),
        failureModes,
        totalRiskWeightedExposure: Math.round(totalExposure),
        overallRiskScore,
        recommendation,
        executiveSummary,
        topMitigations,
        decisionMatrix,
        agentAnalyses,
      };

      // Store in history
      this.storeAnalysis(request.organizationId, result);

      // Emit completion event
      eventBus.publish(eventBus.createEvent('pre-mortem', 'analysis.completed', {
        organizationId: request.organizationId,
        resultId: result.id,
        duration: Date.now() - startTime,
        failureModeCount: failureModes.length,
        riskScore: overallRiskScore,
      }));

      this.recordMetric('analysis_duration_ms', Date.now() - startTime);
      this.incrementCounter('analyses_completed', 1);

      return result;
    } catch (error) {
      this.incrementCounter('analyses_failed', 1);
      eventBus.publish(eventBus.createEvent('pre-mortem', 'analysis.failed', {
        organizationId: request.organizationId,
        error: error instanceof Error ? getErrorMessage(error) : 'Unknown error',
      }));
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // AGENT ANALYSIS
  // ---------------------------------------------------------------------------

  private async runAgentAnalyses(request: PreMortemRequest): Promise<AgentAnalysis[]> {
    // Use selected agents or default to 3 core agents for speed
    const defaultAgents = ['cfo', 'ciso', 'pessimist'];
    const agentIds = request.selectedAgents?.length ? request.selectedAgents : defaultAgents;
    
    // Filter to valid agent IDs
    const validAgentIds = agentIds.filter(id => id in PREMORTEM_AGENTS);
    
    const analyses = await Promise.all(
      validAgentIds.map(agentKey => this.runSingleAgentAnalysis(agentKey, request))
    );

    return analyses;
  }

  private async runSingleAgentAnalysis(
    agentKey: string,
    request: PreMortemRequest
  ): Promise<AgentAnalysis> {
    const agent = PREMORTEM_AGENTS[agentKey as keyof typeof PREMORTEM_AGENTS];
    
    const prompt = `${agent.prompt}

DECISION TO ANALYZE:
"${request.decision}"

${request.context ? `ADDITIONAL CONTEXT:\n${request.context}` : ''}
${request.timeframe ? `TIMEFRAME: ${request.timeframe}` : ''}
${request.budget ? `BUDGET: $${request.budget.toLocaleString()}` : ''}

Provide your analysis in the following JSON format:
{
  "perspective": "Your high-level perspective on this decision",
  "concerns": ["List of specific concerns"],
  "supportingFactors": ["Factors that support proceeding"],
  "riskAssessment": 0-100,
  "recommendation": "Your recommendation"
}`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt: `${PREMORTEM_SYSTEM_PROMPT}\n\n${prompt}`,
          stream: false,
          format: 'json',
        }),
      });

      const data = await response.json() as { response: string };
      const parsed = JSON.parse(data.response);

      return {
        agentId: agentKey,
        agentName: agent.name,
        agentRole: agent.role,
        perspective: parsed.perspective || '',
        concerns: parsed.concerns || [],
        supportingFactors: parsed.supportingFactors || [],
        riskAssessment: parsed.riskAssessment || 50,
        recommendation: parsed.recommendation || '',
      };
    } catch (error: unknown) {
      this.logger.error(`Agent ${agentKey} analysis failed:`, error as Error);
      return {
        agentId: agentKey,
        agentName: agent.name,
        agentRole: agent.role,
        perspective: 'Analysis unavailable',
        concerns: [],
        supportingFactors: [],
        riskAssessment: 50,
        recommendation: 'Unable to provide recommendation',
      };
    }
  }

  // ---------------------------------------------------------------------------
  // FAILURE MODE SYNTHESIS
  // ---------------------------------------------------------------------------

  private async synthesizeFailureModes(
    request: PreMortemRequest,
    agentAnalyses: AgentAnalysis[]
  ): Promise<FailureMode[]> {
    const allConcerns = agentAnalyses.flatMap(a => a.concerns);
    const budget = request.budget || 1000000; // Default $1M if not provided
    
    const prompt = `Based on the following concerns from multiple expert agents, synthesize the TOP 7 failure modes for this decision:

DECISION: "${request.decision}"
TOTAL BUDGET/INVESTMENT: $${budget.toLocaleString()}
${request.timeframe ? `TIMEFRAME: ${request.timeframe}` : ''}

AGENT CONCERNS:
${allConcerns.map((c, i) => `${i + 1}. ${c}`).join('\n')}

IMPORTANT: Calculate costImpact as a PERCENTAGE of the total budget ($${budget.toLocaleString()}).
- If a failure could cause 50% loss, costImpact = ${Math.round(budget * 0.5)}
- If a failure could cause 20% loss, costImpact = ${Math.round(budget * 0.2)}
- Be specific with dollar amounts based on the budget provided.

For each failure mode, provide in JSON format:
{
  "failureModes": [
    {
      "rank": 1,
      "title": "Short title",
      "description": "Detailed description",
      "probability": 0-100,
      "impactPercent": 0-100,
      "costImpact": dollar_amount_based_on_budget,
      "category": "operational|financial|regulatory|market|technical|people|strategic|external",
      "triggers": ["What triggers this failure"],
      "earlyWarnings": ["Early warning signs"],
      "mitigations": [
        {
          "action": "Specific action",
          "cost": dollar_amount,
          "effectiveness": 0-100,
          "timeToImplement": "1 week",
          "priority": "critical|high|medium|low"
        }
      ],
      "dependencies": ["Other decisions/outcomes this depends on"],
      "timeline": "When this failure would occur"
    }
  ]
}`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt: `${PREMORTEM_SYSTEM_PROMPT}\n\n${prompt}`,
          stream: false,
          format: 'json',
        }),
      });

      const data = await response.json() as { response: string };
      const parsed = JSON.parse(data.response);
      
      return (parsed.failureModes || []).map((fm: any, idx: number) => {
        const probability = Math.min(100, Math.max(0, fm.probability || 50));
        
        // Calculate cost impact - use LLM's value if valid, otherwise calculate from budget
        let costImpact = fm.costImpact || 0;
        if (costImpact < 100) {
          // LLM likely returned 0 or a tiny number - calculate based on impact percent and budget
          const impactPercent = fm.impactPercent || this.estimateImpactPercent(fm.category, probability);
          costImpact = Math.round(budget * (impactPercent / 100));
        }

        return {
          id: `fm-${Date.now()}-${idx}`,
          rank: fm.rank || idx + 1,
          title: fm.title || `Failure Mode ${idx + 1}`,
          description: fm.description || '',
          probability,
          costImpact,
          category: fm.category || 'operational',
          triggers: fm.triggers || [],
          earlyWarnings: fm.earlyWarnings || [],
          mitigations: (fm.mitigations || []).map((m: any, mIdx: number) => ({
            id: `mit-${Date.now()}-${idx}-${mIdx}`,
            action: m.action || '',
            cost: m.cost || 0,
            effectiveness: m.effectiveness || 50,
            timeToImplement: m.timeToImplement || 'Unknown',
            priority: m.priority || 'medium',
          })),
          dependencies: fm.dependencies || [],
          timeline: fm.timeline || 'Unknown',
        };
      });
    } catch (error: unknown) {
      this.logger.error('Failed to synthesize failure modes:', error as Error);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // CALCULATIONS & RECOMMENDATIONS
  // ---------------------------------------------------------------------------

  /**
   * Estimate impact percentage based on failure category and probability
   * Used as fallback when LLM doesn't provide specific cost impact
   */
  private estimateImpactPercent(category: string, probability: number): number {
    // Base impact by category (as % of budget that could be lost)
    const categoryImpact: Record<string, number> = {
      financial: 60,      // Financial failures tend to have highest direct cost
      operational: 40,    // Operations can cause significant delays/costs
      strategic: 50,      // Strategic failures can be costly long-term
      regulatory: 45,     // Compliance failures = fines + remediation
      market: 35,         // Market issues affect revenue
      technical: 30,      // Tech issues require fixes + delays
      people: 25,         // People issues are costly but often recoverable
      external: 40,       // External factors vary widely
    };

    const baseImpact = categoryImpact[category] || 30;
    
    // Scale by probability - higher probability failures often have lower individual impact
    // (catastrophic failures are rare, common failures are smaller)
    const probabilityMultiplier = probability > 70 ? 0.6 : probability > 50 ? 0.8 : 1.0;
    
    return Math.round(baseImpact * probabilityMultiplier);
  }

  private calculateOverallRisk(failureModes: FailureMode[]): number {
    if (failureModes.length === 0) return 0;
    
    // Weighted average of top 3 failure modes
    const top3 = failureModes.slice(0, 3);
    const weights = [0.5, 0.3, 0.2];
    
    const weightedSum = top3.reduce((sum, fm, idx) => {
      return sum + (fm.probability * (weights[idx] || 0.1));
    }, 0);
    
    return Math.round(weightedSum);
  }

  private generateRecommendation(
    failureModes: FailureMode[],
    overallRisk: number
  ): PreMortemRecommendation {
    let action: PreMortemRecommendation['action'];
    let reasoning: string;
    const conditions: string[] = [];
    const alternatives: string[] = [];

    if (overallRisk < 25) {
      action = 'proceed';
      reasoning = 'Risk assessment indicates acceptable risk levels. Proceed with standard monitoring.';
    } else if (overallRisk < 50) {
      action = 'proceed_with_caution';
      reasoning = 'Moderate risks identified. Proceed with recommended mitigations in place.';
      
      // Add conditions from top failure modes
      failureModes.slice(0, 3).forEach(fm => {
        if (fm.mitigations.length > 0) {
          conditions.push(`Implement mitigation: ${fm.mitigations[0].action}`);
        }
      });
    } else if (overallRisk < 75) {
      action = 'delay';
      reasoning = 'Significant risks identified. Recommend delaying until key mitigations are in place.';
      
      failureModes.filter(fm => fm.probability > 50).forEach(fm => {
        conditions.push(`Address: ${fm.title}`);
      });
      
      alternatives.push('Consider phased approach');
      alternatives.push('Evaluate smaller pilot first');
    } else {
      action = 'abort';
      reasoning = 'Critical risk levels detected. Fundamental issues with this decision.';
      
      alternatives.push('Reconsider core assumptions');
      alternatives.push('Explore alternative strategies');
      alternatives.push('Conduct deeper analysis before proceeding');
    }

    return { action, reasoning, conditions, alternativeOptions: alternatives };
  }

  private createDecisionMatrix(
    failureModes: FailureMode[],
    request: PreMortemRequest
  ): DecisionMatrix {
    const avgProbability = failureModes.reduce((sum, fm) => sum + fm.probability, 0) / (failureModes.length || 1);
    const proceedScore = 100 - avgProbability;
    
    const totalMitigationCost = failureModes.reduce((sum, fm) => 
      sum + fm.mitigations.reduce((mSum, m) => mSum + m.cost, 0), 0
    );
    
    const totalRiskExposure = failureModes.reduce(
      (sum, fm) => sum + (fm.probability / 100) * fm.costImpact, 0
    );
    
    const riskAdjustedReturn = request.budget 
      ? ((request.budget - totalMitigationCost - totalRiskExposure) / request.budget) * 100
      : proceedScore;

    return {
      proceedScore: Math.round(proceedScore),
      riskAdjustedReturn: Math.round(riskAdjustedReturn),
      confidenceLevel: failureModes.length >= 5 ? 85 : failureModes.length >= 3 ? 70 : 50,
      dataQuality: request.context ? 'high' : request.stakeholders?.length ? 'medium' : 'low',
    };
  }

  private async generateExecutiveSummary(
    decision: string,
    failureModes: FailureMode[],
    recommendation: PreMortemRecommendation
  ): Promise<string> {
    const topRisks = failureModes.slice(0, 3);
    const totalExposure = failureModes.reduce(
      (sum, fm) => sum + (fm.probability / 100) * fm.costImpact, 0
    );

    return `PRE-MORTEM ANALYSIS: ${decision}

RISK SUMMARY: ${failureModes.length} failure modes identified with total risk-weighted exposure of $${Math.round(totalExposure).toLocaleString()}.

TOP RISKS:
${topRisks.map((r, i) => `${i + 1}. ${r.title} (${r.probability}% probability, $${r.costImpact.toLocaleString()} impact)`).join('\n')}

RECOMMENDATION: ${recommendation.action.toUpperCase().replace('_', ' ')}
${recommendation.reasoning}

${recommendation.conditions.length > 0 ? `CONDITIONS:\n${recommendation.conditions.map(c => `â€¢ ${c}`).join('\n')}` : ''}`;
  }

  private extractTopMitigations(failureModes: FailureMode[]): Mitigation[] {
    const allMitigations = failureModes
      .flatMap(fm => fm.mitigations)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    return allMitigations.slice(0, 5);
  }

  // ---------------------------------------------------------------------------
  // USAGE TRACKING
  // ---------------------------------------------------------------------------

  private getMonthlyUsage(organizationId: string): number {
    const history = this.analysisHistory.get(organizationId) || [];
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    return history.filter(h => h.analyzedAt >= thisMonth).length;
  }

  private storeAnalysis(organizationId: string, result: PreMortemResult): void {
    const history = this.analysisHistory.get(organizationId) || [];
    history.push(result);
    this.analysisHistory.set(organizationId, history);
  }

  getAnalysisHistory(organizationId: string): PreMortemResult[] {
    return this.analysisHistory.get(organizationId) || [];
  }

  getAnalysisById(organizationId: string, analysisId: string): PreMortemResult | null {
    const history = this.analysisHistory.get(organizationId) || [];
    return history.find(h => h.id === analysisId) || null;
  }
}

// Export singleton
export const preMortemService = new PreMortemService();
