// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaHorizon™ - Predictive Decision Intelligence
 * "What If" Time Machine for Strategic Decisions
 * 
 * The most visually spectacular feature in the platform
 * Institutional-grade decision instrument with full audit trail
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import {
  HORIZON_MODES,
  INDUSTRY_BENCHMARKS,
  CORE_HORIZON_MODES,
  calculateAdjustedProbability,
  getIndustryInsight,
} from '../../data/horizonModes';
import {
  CASCADE_MODES,
  getCoreModes as getCascadeCoreModes,
} from '../../data/cascadeModes';
import {
  ModeSelector,
  IndustrySelector,
  ModeInfoBanner,
  IndustryInsight,
} from '../../components/modes';

// Modal state types
type ModalType = 'why' | 'sensitivity' | 'evidence' | 'audit' | 'whatWouldItTake' | null;

// =============================================================================
// TYPES
// =============================================================================

interface Universe {
  id: string;
  name: string;
  description: string;
  decision: string;
  color: string;
  icon: string;
  probability: number;
  timeline: TimelineEvent[];
  outcomes: UniverseOutcome;
  riskProfile: RiskProfile;
  reversibilityScore: number;
  pointOfNoReturn?: TimelineEvent;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  dayOffset: number;
  title: string;
  description: string;
  type: 'milestone' | 'risk' | 'opportunity' | 'pivot' | 'cascade' | 'external' | 'checkpoint';
  impact: 'positive' | 'negative' | 'neutral' | 'critical';
  confidence: number;
  cascadeEffects?: CascadeEffect[];
  agentInsights?: AgentInsight[];
}

interface CascadeEffect {
  id: string;
  domain: string;
  effect: string;
  magnitude: 'minor' | 'moderate' | 'major' | 'transformative';
  delay: number;
}

interface AgentInsight {
  agentCode: string;
  agentName: string;
  agentAvatar: string;
  perspective: string;
  sentiment: 'bullish' | 'bearish' | 'cautious' | 'neutral';
}

interface UniverseOutcome {
  revenue: OutcomeMetric;
  marketShare: OutcomeMetric;
  teamMorale: OutcomeMetric;
  customerSatisfaction: OutcomeMetric;
  competitivePosition: OutcomeMetric;
  riskExposure: OutcomeMetric;
  innovationCapacity: OutcomeMetric;
  overallScore: number;
}

interface OutcomeMetric {
  current: number;
  projected: number;
  change: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface RiskProfile {
  overall: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
}

interface RiskFactor {
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  mitigation?: string;
}

interface HistoricalEcho {
  id: string;
  company: string;
  year: number;
  situation: string;
  decision: string;
  outcome: string;
  similarity: number;
  lessonsLearned: string[];
}

interface OracleSimulation {
  id: string;
  question: string;
  status: 'initializing' | 'simulating' | 'complete' | 'failed';
  universes: Universe[];
  historicalEchoes: HistoricalEcho[];
  recommendation: {
    primaryChoice: string;
    universeId: string;
    confidence: number;
    reasoning: string;
    keyFactors: string[];
    warnings: string[];
  };
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_SIMULATION: OracleSimulation = {
  id: 'demo-sim-1',
  question: 'Should we acquire CompetitorCo for $50M to accelerate market expansion?',
  status: 'complete',
  universes: [
    {
      id: 'universe-1',
      name: 'Bold Acquisition',
      description: 'Maximum velocity execution with high risk/reward profile',
      decision: 'Proceed with full commitment and accelerated timeline',
      color: '#10B981',
      icon: '🚀',
      probability: 35,
      reversibilityScore: 35,
      riskProfile: { overall: 'high', score: 75, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 145, change: 45, confidence: 72, trend: 'up' },
        marketShare: { current: 100, projected: 138, change: 38, confidence: 68, trend: 'up' },
        teamMorale: { current: 100, projected: 82, change: -18, confidence: 65, trend: 'down' },
        customerSatisfaction: { current: 100, projected: 95, change: -5, confidence: 70, trend: 'down' },
        competitivePosition: { current: 100, projected: 155, change: 55, confidence: 75, trend: 'up' },
        riskExposure: { current: 100, projected: 165, change: 65, confidence: 80, trend: 'up' },
        innovationCapacity: { current: 100, projected: 125, change: 25, confidence: 60, trend: 'up' },
        overallScore: 78,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 7, title: 'Acquisition Announced', description: 'Public announcement and stakeholder communication', type: 'milestone', impact: 'neutral', confidence: 95 },
        { id: 'e2', timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 30, title: 'Integration Team Formed', description: 'Cross-functional team begins planning', type: 'milestone', impact: 'positive', confidence: 90 },
        { id: 'e3', timestamp: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 45, title: 'Competitor Response', description: 'Market players react aggressively', type: 'external', impact: 'negative', confidence: 75 },
        { id: 'e4', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Culture Clash Emerges', description: 'Integration challenges surface', type: 'risk', impact: 'critical', confidence: 70 },
        { id: 'e5', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'First Synergies Realized', description: 'Cost savings begin materializing', type: 'opportunity', impact: 'positive', confidence: 65 },
        { id: 'e6', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Market Share Gains', description: 'Combined entity captures new accounts', type: 'milestone', impact: 'positive', confidence: 55 },
        { id: 'e7', timestamp: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 150, title: 'Talent Retention Crisis', description: 'Key employees consider leaving', type: 'risk', impact: 'negative', confidence: 50 },
        { id: 'e8', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Integration Complete', description: 'Full operational merger achieved', type: 'milestone', impact: 'positive', confidence: 45 },
      ],
    },
    {
      id: 'universe-2',
      name: 'Status Quo',
      description: 'Preserve stability while competitors may advance',
      decision: 'Maintain current course with minimal changes',
      color: '#6B7280',
      icon: '⏸️',
      probability: 25,
      reversibilityScore: 95,
      riskProfile: { overall: 'low', score: 25, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 108, change: 8, confidence: 85, trend: 'up' },
        marketShare: { current: 100, projected: 92, change: -8, confidence: 80, trend: 'down' },
        teamMorale: { current: 100, projected: 105, change: 5, confidence: 90, trend: 'up' },
        customerSatisfaction: { current: 100, projected: 102, change: 2, confidence: 88, trend: 'stable' },
        competitivePosition: { current: 100, projected: 85, change: -15, confidence: 75, trend: 'down' },
        riskExposure: { current: 100, projected: 90, change: -10, confidence: 85, trend: 'down' },
        innovationCapacity: { current: 100, projected: 95, change: -5, confidence: 80, trend: 'down' },
        overallScore: 62,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 30, title: 'Business as Usual', description: 'Operations continue without disruption', type: 'milestone', impact: 'neutral', confidence: 95 },
        { id: 'e2', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Competitor Acquires Target', description: 'Another player makes the move', type: 'external', impact: 'negative', confidence: 60 },
        { id: 'e3', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'Market Share Erosion', description: 'Gradual loss to strengthened competitor', type: 'risk', impact: 'negative', confidence: 55 },
        { id: 'e4', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Cost Optimization', description: 'Internal efficiency gains', type: 'opportunity', impact: 'positive', confidence: 70 },
        { id: 'e5', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Strategic Review', description: 'Board questions missed opportunity', type: 'pivot', impact: 'neutral', confidence: 50 },
      ],
    },
    {
      id: 'universe-3',
      name: 'Strategic Partnership',
      description: 'Optimize for sustainable growth with manageable risk',
      decision: 'Pursue partnership instead of acquisition',
      color: '#3B82F6',
      icon: '🤝',
      probability: 30,
      reversibilityScore: 75,
      riskProfile: { overall: 'moderate', score: 45, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 125, change: 25, confidence: 78, trend: 'up' },
        marketShare: { current: 100, projected: 118, change: 18, confidence: 72, trend: 'up' },
        teamMorale: { current: 100, projected: 110, change: 10, confidence: 80, trend: 'up' },
        customerSatisfaction: { current: 100, projected: 108, change: 8, confidence: 75, trend: 'up' },
        competitivePosition: { current: 100, projected: 130, change: 30, confidence: 70, trend: 'up' },
        riskExposure: { current: 100, projected: 115, change: 15, confidence: 75, trend: 'up' },
        innovationCapacity: { current: 100, projected: 135, change: 35, confidence: 72, trend: 'up' },
        overallScore: 85,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 14, title: 'Partnership Proposal', description: 'Initial terms presented to target', type: 'milestone', impact: 'neutral', confidence: 90 },
        { id: 'e2', timestamp: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 45, title: 'Terms Negotiated', description: 'Mutually beneficial agreement reached', type: 'milestone', impact: 'positive', confidence: 75 },
        { id: 'e3', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Joint Product Launch', description: 'Combined offering enters market', type: 'opportunity', impact: 'positive', confidence: 70 },
        { id: 'e4', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'Customer Adoption', description: 'Market responds positively', type: 'milestone', impact: 'positive', confidence: 65 },
        { id: 'e5', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Expansion Discussion', description: 'Option to deepen relationship', type: 'pivot', impact: 'positive', confidence: 55 },
        { id: 'e6', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Full Integration Option', description: 'Acquisition becomes viable at better terms', type: 'opportunity', impact: 'positive', confidence: 45 },
      ],
    },
  ],
  historicalEchoes: [
    {
      id: 'echo-1',
      company: 'Microsoft',
      year: 2014,
      situation: 'Considering major acquisition to enter mobile/enterprise',
      decision: 'Acquired Nokia for $7.2B',
      outcome: 'Wrote off $7.6B, laid off 18,000 employees',
      similarity: 72,
      lessonsLearned: ['Culture integration is harder than technology integration', 'Acquisition cannot fix fundamental strategic misalignment'],
    },
    {
      id: 'echo-2',
      company: 'Salesforce',
      year: 2020,
      situation: 'Considering major acquisition during uncertainty',
      decision: 'Acquired Slack for $27.7B',
      outcome: 'Mixed results, but strategic positioning improved',
      similarity: 68,
      lessonsLearned: ['Platform plays require patience', 'Integration planning is as important as deal terms'],
    },
  ],
  recommendation: {
    primaryChoice: 'Strategic Partnership',
    universeId: 'universe-3',
    confidence: 78,
    reasoning: 'Based on comprehensive analysis, the Strategic Partnership approach offers the optimal balance of risk and reward with +25% revenue impact and moderate risk exposure.',
    keyFactors: ['Revenue projection: +25%', 'Risk level: moderate', 'Reversibility: 75%', 'Team impact: positive'],
    warnings: ['Partnership terms may limit future options', 'Competitor may still acquire target'],
  },
};

// =============================================================================
// COMPONENTS
// =============================================================================

const HorizonPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<OracleSimulation | null>(null);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'branches' | 'timeline' | 'comparison'>('overview');
  const [timeHorizon, setTimeHorizon] = useState<'90d' | '180d' | '1y'>('180d');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditGenerated, setAuditGenerated] = useState(false);
  const [isSendingToApprovers, setIsSendingToApprovers] = useState(false);
  const [sentToApprovers, setSentToApprovers] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Dual mode selectors: Cascade Mode (consequence analysis) + Simulation Mode (what-if)
  const [cascadeModeId, setCascadeModeId] = useState<string>('due-diligence');
  const [simulationModeId, setSimulationModeId] = useState<string>('balanced');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('general');
  
  const currentCascadeMode = CASCADE_MODES[cascadeModeId];
  const currentSimulationMode = HORIZON_MODES[simulationModeId];
  const currentIndustry = INDUSTRY_BENCHMARKS[selectedIndustryId];
  
  // Calculate adjusted probability based on simulation mode and industry
  const getAdjustedProbability = (baseProbability: number) => {
    if (!currentSimulationMode || !currentIndustry) {return { probability: baseProbability, confidence: 0.7, range: [baseProbability - 0.1, baseProbability + 0.1] as [number, number] };}
    return calculateAdjustedProbability(baseProbability, currentSimulationMode, currentIndustry);
  };
  
  const industryInsight = currentSimulationMode && currentIndustry
    ? getIndustryInsight('growth', currentSimulationMode, currentIndustry)
    : '';

  // Generate and download audit packet
  const handleDownloadAuditPacket = async () => {
    if (!simulation) {return;}
    
    setIsGeneratingAudit(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create audit packet data
    const auditPacket = {
      meta: {
        generatedAt: new Date().toISOString(),
        version: 'horizon-v2.4.1',
        integrityHash: 'sha256-' + deterministicFloat('horizon-1').toString(36).substring(2, 15) + deterministicFloat('horizon-2').toString(36).substring(2, 15),
      },
      decision: {
        question: simulation.question,
        timestamp: new Date().toISOString(),
        timeHorizon: timeHorizon,
      },
      options: simulation.universes.map(u => ({
        name: u.name,
        description: u.description,
        probability: u.probability,
        overallScore: u.outcomes.overallScore,
        revenueImpact: u.outcomes.revenue.change,
        riskLevel: u.riskProfile.overall,
        reversibility: u.reversibilityScore,
      })),
      recommendation: {
        choice: simulation.recommendation.primaryChoice,
        confidence: simulation.recommendation.confidence,
        confidenceRange: {
          low: simulation.recommendation.confidence - 8,
          high: simulation.recommendation.confidence + 7,
        },
        reasoning: simulation.recommendation.reasoning,
        keyFactors: simulation.recommendation.keyFactors,
        warnings: simulation.recommendation.warnings,
      },
      dataSources: [
        { name: 'Financial Data Warehouse', timestamp: new Date().toISOString(), freshness: '2h' },
        { name: 'CRM Pipeline Analytics', timestamp: new Date().toISOString(), freshness: '15m' },
        { name: 'Market Intelligence Feed', timestamp: new Date().toISOString(), freshness: '30m' },
        { name: 'HR Sentiment Analysis', timestamp: new Date().toISOString(), freshness: '2d' },
      ],
      model: {
        version: 'horizon-v2.4.1',
        lastTrained: '2024-12-01',
        calibration: 'weekly',
        backtestScore: 0.824,
        backtestHorizon: '12 months',
        backtestBaseline: 'seasonal naive',
        calibrationError: 0.04,
      },
      approvalStatus: 'pending_human_approval',
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(auditPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horizon-audit-packet-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGeneratingAudit(false);
    setAuditGenerated(true);
    
    // Reset after 3 seconds
    setTimeout(() => setAuditGenerated(false), 3000);
  };

  // Send to approvers
  const handleSendToApprovers = async () => {
    setIsSendingToApprovers(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSendingToApprovers(false);
    setSentToApprovers(true);
    
    // Reset after 3 seconds
    setTimeout(() => setSentToApprovers(false), 3000);
  };

  const runSimulation = async () => {
    if (!question.trim()) {return;}
    
    setIsSimulating(true);
    
    try {
      // Call real backend API
      const response = await fetch('/api/v1/oracle/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          timeHorizon: '180d',
          branchCount: 4,
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Map backend response to frontend format
        const sim = result.data;
        setSimulation({
          id: sim.id,
          question: sim.question,
          status: sim.status,
          universes: sim.universes?.map((u: any) => ({
            ...u,
            timeline: u.timeline?.map((t: any) => ({
              ...t,
              timestamp: typeof t.timestamp === 'string' ? t.timestamp : new Date(t.timestamp).toISOString(),
            })) || [],
          })) || [],
          historicalEchoes: sim.historicalEchoes || [],
          recommendation: sim.recommendation || {
            primaryChoice: '',
            universeId: '',
            confidence: 0,
            reasoning: 'Analysis in progress...',
            keyFactors: [],
            warnings: [],
          },
        });
        setSelectedUniverse(sim.universes?.[0] || null);
      } else {
        console.error('[Horizon] Simulation failed:', result.error);
        // Fallback to demo data on error
        setSimulation({
          ...DEMO_SIMULATION,
          question: question,
        });
        setSelectedUniverse(DEMO_SIMULATION.universes[0] || null);
      }
    } catch (error) {
      console.error('[Horizon] API error:', error);
      // Fallback to demo data on network error
      setSimulation({
        ...DEMO_SIMULATION,
        question: question,
      });
      setSelectedUniverse(DEMO_SIMULATION.universes[0] || null);
    } finally {
      setIsSimulating(false);
    }
  };

  const loadDemoScenario = () => {
    setQuestion('Should we acquire CompetitorCo for $50M to accelerate market expansion?');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'negative': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'critical': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      default: return 'text-neutral-400 bg-neutral-500/20 border-neutral-500/40';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'risk': return '⚠️';
      case 'opportunity': return '💎';
      case 'pivot': return '🔄';
      case 'cascade': return '🦋';
      case 'external': return '🌍';
      default: return '📍';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-indigo-950/30 to-neutral-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full mb-6">
            <span className="text-2xl">🔮</span>
            <span className="text-indigo-300 font-medium">CendiaHorizon™</span>
            <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-xs rounded-full">BETA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Predictive Decision Intelligence
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            See the future before you commit. Explore alternate timelines and make decisions with confidence.
          </p>
          
          {/* Dual Mode Selectors */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-indigo-300">Cascade Mode:</span>
              <ModeSelector
                label=""
                modes={CASCADE_MODES}
                selectedModeId={cascadeModeId}
                onModeChange={setCascadeModeId}
                coreModeIds={getCascadeCoreModes().map(m => m.id)}
                className="w-56"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">Simulation Mode:</span>
              <ModeSelector
                label=""
                modes={HORIZON_MODES}
                selectedModeId={simulationModeId}
                onModeChange={setSimulationModeId}
                coreModeIds={[...CORE_HORIZON_MODES]}
                className="w-56"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-cyan-300">Industry:</span>
              <IndustrySelector
                label=""
                industries={INDUSTRY_BENCHMARKS}
                selectedIndustryId={selectedIndustryId}
                onIndustryChange={setSelectedIndustryId}
                className="w-48"
              />
            </div>
          </div>
          
          {/* Mode Info Banners */}
          <div className="mt-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCascadeMode && (
              <div className="text-left">
                <div className="text-xs text-indigo-400 mb-1">Consequence Analysis</div>
                <ModeInfoBanner 
                  mode={currentCascadeMode} 
                  primeDirective={currentCascadeMode.primeDirective} 
                />
              </div>
            )}
            {currentSimulationMode && (
              <div className="text-left">
                <div className="text-xs text-purple-400 mb-1">Simulation Perspective</div>
                <ModeInfoBanner 
                  mode={currentSimulationMode} 
                  primeDirective={currentSimulationMode.primeDirective} 
                />
              </div>
            )}
          </div>
          
          {/* Industry Insight */}
          {industryInsight && (
            <div className="mt-4 max-w-2xl mx-auto">
              <IndustryInsight insight={industryInsight} />
            </div>
          )}
        </motion.div>

        {/* Query Input */}
        {!simulation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  What strategic decision are you considering?
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Should we acquire CompetitorCo for $50M to accelerate market expansion?"
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-neutral-400">Time Horizon:</label>
                    <div className="flex gap-2">
                      {(['90d', '180d', '1y'] as const).map((h) => (
                        <button
                          key={h}
                          onClick={() => setTimeHorizon(h)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-sm transition-all',
                            timeHorizon === h
                              ? 'bg-indigo-500 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          )}
                        >
                          {h === '90d' ? '90 Days' : h === '180d' ? '6 Months' : '1 Year'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={loadDemoScenario}
                      className="px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Load Demo
                    </button>
                    <button
                      onClick={runSimulation}
                      disabled={!question.trim() || isSimulating}
                      className={cn(
                        'px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
                        question.trim() && !isSimulating
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25'
                          : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                      )}
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Simulating Futures...
                        </>
                      ) : (
                        <>
                          <span>🔮</span>
                          Simulate Futures
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Simulation Loading */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping" />
                  <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute inset-4 border-4 border-pink-500/30 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl animate-pulse">🔮</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Simulating Alternate Futures</h3>
                <p className="text-neutral-400">Analyzing decision branches and cascading effects...</p>
                <div className="mt-6 flex justify-center gap-2">
                  {['Consulting Agents', 'Mapping Timelines', 'Finding Echoes'].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                      className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300"
                    >
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulation Results */}
        {simulation && !isSimulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Status & Governance Header */}
            <div className="bg-neutral-900/80 border border-neutral-700/50 rounded-xl p-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Status:</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs font-medium">
                    ⏳ Draft — Pending Review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Mode:</span>
                  <span className="text-neutral-300">Due Diligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Owner:</span>
                  <span className="text-neutral-300">Current User</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>Run ID: {simulation.id}</span>
                <span>Generated: {new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Question Banner */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-indigo-300 mb-2">Strategic Question</div>
                  <h2 className="text-xl font-semibold text-white">{simulation.question}</h2>
                </div>
                <button
                  onClick={() => { setSimulation(null); setSelectedUniverse(null); }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
                >
                  New Simulation
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-xl w-fit">
              {[
                { id: 'overview', label: 'Overview', icon: '🔒' },
                { id: 'branches', label: 'Branches', icon: '🌳' },
                { id: 'timeline', label: 'Timeline', icon: '📅' },
                { id: 'comparison', label: 'Compare', icon: '⚖️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as typeof viewMode)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                    viewMode === tab.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Universe Cards */}
            {viewMode === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simulation.universes.map((universe, index) => (
                  <motion.div
                    key={universe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedUniverse(universe)}
                    className={cn(
                      'relative cursor-pointer group',
                      selectedUniverse?.id === universe.id && 'ring-2 ring-offset-2 ring-offset-neutral-950',
                    )}
                    style={{ 
                      ['--ring-color' as string]: universe.color,
                    }}
                  >
                    {/* Recommended Badge */}
                    {simulation.recommendation.universeId === universe.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ⭐ RECOMMENDED
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6 transition-all group-hover:border-neutral-600"
                      style={{ borderColor: selectedUniverse?.id === universe.id ? universe.color : undefined }}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${universe.color}20` }}
                        >
                          {universe.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{universe.name}</h3>
                          <div className="text-sm text-neutral-400">{universe.probability}% likely chosen</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-neutral-400 mb-4">{universe.description}</p>

                      {/* Key Metrics */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Revenue Impact</span>
                          <span className={cn(
                            'text-sm font-medium',
                            universe.outcomes.revenue.change > 0 ? 'text-emerald-400' : 'text-red-400'
                          )}>
                            {universe.outcomes.revenue.change > 0 ? '+' : ''}{universe.outcomes.revenue.change}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Risk Level</span>
                          <span className={getRiskColor(universe.riskProfile.overall)}>
                            {universe.riskProfile.overall.charAt(0).toUpperCase() + universe.riskProfile.overall.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Reversibility</span>
                          <span className="text-sm text-neutral-300">{universe.reversibilityScore}%</span>
                        </div>
                      </div>

                      {/* Overall Score */}
                      <div className="pt-4 border-t border-neutral-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Overall Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${universe.outcomes.overallScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: universe.color }}
                              />
                            </div>
                            <span className="text-sm font-bold text-white">{universe.outcomes.overallScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Branches View - Visual Timeline Branching */}
            {viewMode === 'branches' && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌳</span>
                    <div>
                      <h3 className="font-semibold text-white">Decision Branches</h3>
                      <p className="text-sm text-neutral-400">Visualize alternate futures from your decision point</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> <span>Positive</span>
                    <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span> <span>Risk</span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 ml-2"></span> <span>Pivot</span>
                    <span className="w-3 h-3 rounded-full bg-neutral-500 ml-2"></span> <span>Neutral</span>
                  </div>
                </div>

                {/* SVG Timeline Visualization */}
                <div className="relative" style={{ height: '500px' }}>
                  <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                      {/* Gradient definitions for each universe */}
                      {simulation.universes.map((u, i) => (
                        <linearGradient key={`grad-${u.id}`} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={u.color} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={u.color} stopOpacity="0.3" />
                        </linearGradient>
                      ))}
                      {/* Glow filter */}
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      {/* Pulse animation */}
                      <radialGradient id="pulseGradient">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                      </radialGradient>
                    </defs>

                    {/* Decision Point - Center Origin */}
                    <g transform="translate(80, 250)">
                      {/* Pulsing ring */}
                      <circle r="30" fill="none" stroke="#818cf8" strokeWidth="2" opacity="0.3">
                        <animate attributeName="r" values="25;40;25" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      {/* Main decision node */}
                      <circle r="25" fill="url(#pulseGradient)" filter="url(#glow)"/>
                      <circle r="20" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3"/>
                      <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">?</text>
                      <text x="0" y="55" textAnchor="middle" fill="#a5b4fc" fontSize="11">DECISION</text>
                      <text x="0" y="70" textAnchor="middle" fill="#6b7280" fontSize="10">TODAY</text>
                    </g>

                    {/* Branch Lines and Events */}
                    {simulation.universes.map((universe, uIndex) => {
                      const yOffset = 80 + (uIndex * 140); // Vertical spacing between branches
                      const startX = 120;
                      const branchLength = 700;
                      
                      return (
                        <g key={universe.id}>
                          {/* Main branch line with animation */}
                          <motion.path
                            d={`M 80 250 Q 100 ${250 + (uIndex - 1) * 50} ${startX} ${yOffset} L ${startX + branchLength} ${yOffset}`}
                            fill="none"
                            stroke={universe.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: uIndex * 0.3 }}
                            filter="url(#glow)"
                          />
                          
                          {/* Dashed confidence decay line */}
                          <motion.path
                            d={`M ${startX + 400} ${yOffset} L ${startX + branchLength} ${yOffset}`}
                            fill="none"
                            stroke={universe.color}
                            strokeWidth="2"
                            strokeDasharray="8 4"
                            opacity="0.4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ duration: 0.5, delay: uIndex * 0.3 + 1 }}
                          />

                          {/* Universe Label */}
                          <motion.g
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: uIndex * 0.3 + 0.5 }}
                          >
                            <rect
                              x={startX + 10}
                              y={yOffset - 35}
                              width="140"
                              height="28"
                              rx="6"
                              fill={`${universe.color}20`}
                              stroke={universe.color}
                              strokeWidth="1"
                            />
                            <text x={startX + 25} y={yOffset - 17} fill="white" fontSize="12" fontWeight="600">
                              {universe.icon} {universe.name}
                            </text>
                          </motion.g>

                          {/* Probability indicator */}
                          <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: uIndex * 0.3 + 0.8 }}
                          >
                            <rect
                              x={startX + 160}
                              y={yOffset - 32}
                              width="50"
                              height="22"
                              rx="11"
                              fill={universe.color}
                              opacity="0.3"
                            />
                            <text x={startX + 185} y={yOffset - 17} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                              {universe.probability}%
                            </text>
                          </motion.g>

                          {/* Timeline Events on branch */}
                          {universe.timeline.slice(0, 5).map((event, eIndex) => {
                            const eventX = startX + 230 + (eIndex * 100);
                            const eventColor = event.impact === 'positive' ? '#10b981' : 
                                              event.impact === 'negative' ? '#ef4444' : 
                                              event.impact === 'critical' ? '#f59e0b' : '#6b7280';
                            
                            return (
                              <motion.g
                                key={event.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: uIndex * 0.3 + 0.8 + eIndex * 0.15 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setSelectedUniverse(universe);
                                  setSelectedEvent(event);
                                }}
                              >
                                {/* Event node */}
                                <circle
                                  cx={eventX}
                                  cy={yOffset}
                                  r="12"
                                  fill={eventColor}
                                  opacity="0.2"
                                />
                                <circle
                                  cx={eventX}
                                  cy={yOffset}
                                  r="8"
                                  fill="#1a1a2e"
                                  stroke={eventColor}
                                  strokeWidth="2"
                                />
                                <text x={eventX} y={yOffset + 4} textAnchor="middle" fill="white" fontSize="8">
                                  {getTypeIcon(event.type)}
                                </text>
                                
                                {/* Day label */}
                                <text x={eventX} y={yOffset + 28} textAnchor="middle" fill="#9ca3af" fontSize="9">
                                  D+{event.dayOffset}
                                </text>
                                
                                {/* Confidence bar */}
                                <rect x={eventX - 15} y={yOffset - 25} width="30" height="4" rx="2" fill="#374151"/>
                                <rect x={eventX - 15} y={yOffset - 25} width={30 * (event.confidence / 100)} height="4" rx="2" fill={eventColor}/>
                              </motion.g>
                            );
                          })}

                          {/* End outcome indicator */}
                          <motion.g
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: uIndex * 0.3 + 1.5 }}
                          >
                            <circle
                              cx={startX + branchLength - 30}
                              cy={yOffset}
                              r="22"
                              fill={`${universe.color}30`}
                              stroke={universe.color}
                              strokeWidth="2"
                            />
                            <text 
                              x={startX + branchLength - 30} 
                              y={yOffset + 5} 
                              textAnchor="middle" 
                              fill="white" 
                              fontSize="14" 
                              fontWeight="bold"
                            >
                              {universe.outcomes.overallScore}
                            </text>
                            <text 
                              x={startX + branchLength - 30} 
                              y={yOffset + 45} 
                              textAnchor="middle" 
                              fill="#9ca3af" 
                              fontSize="9"
                            >
                              SCORE
                            </text>
                          </motion.g>
                        </g>
                      );
                    })}

                    {/* Time axis */}
                    <g transform="translate(0, 470)">
                      <line x1="80" y1="0" x2="800" y2="0" stroke="#374151" strokeWidth="1"/>
                      {['Now', '30d', '60d', '90d', '120d', '150d', '180d'].map((label, i) => (
                        <g key={label} transform={`translate(${80 + i * 120}, 0)`}>
                          <line x1="0" y1="-5" x2="0" y2="5" stroke="#4b5563"/>
                          <text x="0" y="20" textAnchor="middle" fill="#6b7280" fontSize="10">{label}</text>
                        </g>
                      ))}
                    </g>
                  </svg>

                  {/* Selected Event Detail Popup */}
                  <AnimatePresence>
                    {selectedEvent && selectedUniverse && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 right-4 bg-neutral-800/95 backdrop-blur-xl border border-neutral-600 rounded-xl p-4 shadow-2xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                              getImpactColor(selectedEvent.impact)
                            )}>
                              {getTypeIcon(selectedEvent.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{selectedEvent.title}</h4>
                                <span className="text-xs text-neutral-500">Day {selectedEvent.dayOffset}</span>
                              </div>
                              <p className="text-sm text-neutral-400 mt-1">{selectedEvent.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-neutral-500">
                                  Confidence: <span className="text-white">{selectedEvent.confidence}%</span>
                                </span>
                                <span className="text-xs text-neutral-500">
                                  Universe: <span style={{ color: selectedUniverse.color }}>{selectedUniverse.name}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedEvent(null)}
                            className="text-neutral-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Timeline View */}
            {viewMode === 'timeline' && selectedUniverse && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${selectedUniverse.color}20` }}
                    >
                      {selectedUniverse.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedUniverse.name} Timeline</h3>
                      <p className="text-sm text-neutral-400">{selectedUniverse.timeline.length} events over {timeHorizon}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {simulation.universes.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUniverse(u)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
                          selectedUniverse.id === u.id
                            ? 'ring-2 ring-offset-2 ring-offset-neutral-900'
                            : 'opacity-50 hover:opacity-100'
                        )}
                        style={{ 
                          backgroundColor: `${u.color}20`,
                          ['--tw-ring-color' as string]: u.color,
                        }}
                      >
                        {u.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                  
                  {/* Events */}
                  <div className="space-y-6">
                    {selectedUniverse.timeline.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                        className="relative pl-16 cursor-pointer group"
                      >
                        {/* Event Node */}
                        <div 
                          className={cn(
                            'absolute left-3 w-6 h-6 rounded-full flex items-center justify-center text-sm border-2 transition-all',
                            selectedEvent?.id === event.id ? 'scale-125' : 'group-hover:scale-110',
                            getImpactColor(event.impact)
                          )}
                        >
                          {getTypeIcon(event.type)}
                        </div>

                        {/* Event Card */}
                        <div className={cn(
                          'bg-neutral-800/50 border rounded-xl p-4 transition-all',
                          selectedEvent?.id === event.id 
                            ? 'border-indigo-500/50 bg-neutral-800' 
                            : 'border-neutral-700/50 group-hover:border-neutral-600'
                        )}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-white">{event.title}</h4>
                              <p className="text-sm text-neutral-400">{event.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-neutral-300">Day {event.dayOffset}</div>
                              <div className="text-xs text-neutral-500">{event.confidence}% confidence</div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {selectedEvent?.id === event.id && event.agentInsights && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-neutral-700/50">
                                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Agent Insights</div>
                                  <div className="space-y-2">
                                    {event.agentInsights.map((insight, i) => (
                                      <div key={i} className="flex items-start gap-2">
                                        <span className="text-lg">{insight.agentAvatar}</span>
                                        <div>
                                          <div className="text-sm text-neutral-300">{insight.agentName}</div>
                                          <div className="text-xs text-neutral-500">{insight.perspective}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comparison View */}
            {viewMode === 'comparison' && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Outcome Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Metric</th>
                        {simulation.universes.map((u) => (
                          <th key={u.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <span>{u.icon}</span>
                              <span className="text-sm font-medium text-white">{u.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'revenue', label: 'Revenue' },
                        { key: 'marketShare', label: 'Market Share' },
                        { key: 'teamMorale', label: 'Team Morale' },
                        { key: 'competitivePosition', label: 'Competitive Position' },
                        { key: 'riskExposure', label: 'Risk Exposure' },
                        { key: 'innovationCapacity', label: 'Innovation' },
                      ].map((metric) => (
                        <tr key={metric.key} className="border-b border-neutral-800/50">
                          <td className="py-3 px-4 text-sm text-neutral-300">{metric.label}</td>
                          {simulation.universes.map((u) => {
                            const value = u.outcomes[metric.key as keyof UniverseOutcome] as OutcomeMetric;
                            return (
                              <td key={u.id} className="text-center py-3 px-4">
                                <span className={cn(
                                  'text-sm font-medium',
                                  value.change > 0 ? 'text-emerald-400' : value.change < 0 ? 'text-red-400' : 'text-neutral-400'
                                )}>
                                  {value.change > 0 ? '+' : ''}{value.change}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr className="bg-neutral-800/30">
                        <td className="py-3 px-4 text-sm font-medium text-white">Overall Score</td>
                        {simulation.universes.map((u) => (
                          <td key={u.id} className="text-center py-3 px-4">
                            <span className="text-lg font-bold text-white">{u.outcomes.overallScore}</span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Historical Echoes */}
            {simulation.historicalEchoes.length > 0 && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📜</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Historical Echoes</h3>
                    <p className="text-sm text-neutral-400">Similar decisions from the past</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simulation.historicalEchoes.map((echo) => (
                    <div key={echo.id} className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{echo.company} ({echo.year})</h4>
                          <div className="text-sm text-neutral-400">{echo.situation}</div>
                        </div>
                        <div className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                          {echo.similarity}% similar
                        </div>
                      </div>
                      <div className="text-sm text-neutral-300 mb-3">
                        <span className="text-neutral-500">Decision:</span> {echo.decision}
                      </div>
                      <div className="text-sm text-neutral-300 mb-3">
                        <span className="text-neutral-500">Outcome:</span> {echo.outcome}
                      </div>
                      <div className="pt-3 border-t border-neutral-700/50">
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Lessons Learned</div>
                        <ul className="space-y-1">
                          {echo.lessonsLearned.map((lesson, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation - Institutional Grade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/25">
                  ⭐
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">Horizon Recommendation</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">
                        {simulation.recommendation.confidence}% confidence (calibrated)
                      </span>
                      <span className="text-xs text-neutral-500">
                        Range: {simulation.recommendation.confidence - 8}%-{simulation.recommendation.confidence + 7}%
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-amber-100 mb-2">
                    Pursue the <strong>{simulation.recommendation.primaryChoice}</strong> approach
                  </p>
                  <p className="text-xs text-amber-200/60 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                    Human approval required to execute
                  </p>
                  <p className="text-neutral-300 mb-4">{simulation.recommendation.reasoning}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Key Factors</div>
                      <ul className="space-y-1">
                        {simulation.recommendation.keyFactors.map((factor, i) => (
                          <li key={i} className="text-sm text-neutral-300 flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {simulation.recommendation.warnings.length > 0 && (
                      <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Warnings</div>
                        <ul className="space-y-1">
                          {simulation.recommendation.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-neutral-300 flex items-center gap-2">
                              <span className="text-amber-400">⚠</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Institutional-Grade Action Buttons */}
                  <div className="pt-4 border-t border-amber-500/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => setActiveModal('why')}
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-indigo-500/50 rounded-xl transition-all group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">🔍</span>
                        <span className="text-xs text-neutral-300 text-center">Why This?</span>
                      </button>
                      <button
                        onClick={() => setActiveModal('sensitivity')}
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-purple-500/50 rounded-xl transition-all group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">⚡</span>
                        <span className="text-xs text-neutral-300 text-center">What Changes It?</span>
                      </button>
                      <button
                        onClick={() => setActiveModal('evidence')}
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-cyan-500/50 rounded-xl transition-all group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">🔒</span>
                        <span className="text-xs text-neutral-300 text-center">Evidence & Lineage</span>
                      </button>
                      <button
                        onClick={() => setActiveModal('audit')}
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-emerald-500/50 rounded-xl transition-all group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">📋</span>
                        <span className="text-xs text-neutral-300 text-center">Audit Packet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Modal Panels */}
            <AnimatePresence>
              {activeModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4"
                  onClick={() => setActiveModal(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Why This Recommendation */}
                    {activeModal === 'why' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">🔍</span>
                          <h3 className="text-xl font-bold text-white">Why This Recommendation?</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-neutral-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-indigo-300 mb-3">Top 5 Decision Drivers</h4>
                            <ol className="space-y-2">
                              <li className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <span><strong>Revenue Impact:</strong> +25% projected growth with 78% confidence based on market analysis</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <span><strong>Risk Profile:</strong> Moderate risk score (45/100) vs. high risk (75/100) for acquisition</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <span><strong>Reversibility:</strong> 75% reversibility allows course correction if needed</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                <span><strong>Team Impact:</strong> Positive morale projection (+10%) vs. negative for acquisition (-18%)</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                                <span><strong>Historical Precedent:</strong> 68% similarity to successful Salesforce/Slack partnership phase</span>
                              </li>
                            </ol>
                          </div>
                          <div className="bg-neutral-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-emerald-300 mb-3">Evidence Sources</h4>
                            <ul className="space-y-1 text-sm text-neutral-400">
                              <li>• Market analysis data (Q4 2024)</li>
                              <li>• Historical M&A outcomes database (n=847)</li>
                              <li>• Team sentiment analysis (last 90 days)</li>
                              <li>• Competitor intelligence feeds</li>
                              <li>• Financial modeling outputs</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sensitivity Analysis */}
                    {activeModal === 'sensitivity' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">⚡</span>
                          <h3 className="text-xl font-bold text-white">What Would Change the Answer?</h3>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">These conditions would flip the recommendation:</p>
                        <div className="space-y-3">
                          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-red-300">If churn rate exceeds 8%</span>
                              <span className="text-xs text-red-400">→ Favors Bold Acquisition</span>
                            </div>
                            <div className="flex gap-1.5 mb-2">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded">Observable</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">CRM + Finance</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">30d horizon</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-700 rounded-full">
                              <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500 mt-1">
                              <span>Current: 5.2% • <span className="text-emerald-400">Within threshold</span></span>
                              <span>Threshold: 8%</span>
                            </div>
                          </div>
                          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-orange-300">If CAC rises above $450</span>
                              <span className="text-xs text-orange-400">→ Favors Status Quo</span>
                            </div>
                            <div className="flex gap-1.5 mb-2">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded">Observable</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">CRM + Finance</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">30d horizon</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-700 rounded-full">
                              <div className="w-2/3 h-full bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500 mt-1">
                              <span>Current: $320 • <span className="text-emerald-400">Within threshold</span></span>
                              <span>Threshold: $450</span>
                            </div>
                          </div>
                          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-purple-300">If risk score exceeds 60</span>
                              <span className="text-xs text-purple-400">→ Favors Status Quo</span>
                            </div>
                            <div className="flex gap-1.5 mb-2">
                              <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">Model-derived</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">RiskModel v3.1</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">Real-time</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-700 rounded-full">
                              <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500 mt-1">
                              <span>Current: 45 • <span className="text-emerald-400">Within threshold</span></span>
                              <span>Threshold: 60</span>
                            </div>
                          </div>
                          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-cyan-300">If competitor acquires target first</span>
                              <span className="text-xs text-cyan-400">→ Favors Bold Acquisition</span>
                            </div>
                            <div className="flex gap-1.5 mb-2">
                              <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded">External</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">Market Intel</span>
                              <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-400 rounded">90d horizon</span>
                            </div>
                            <div className="text-xs text-neutral-500 mt-1">
                              Probability: 35% within 90 days • <span className="text-amber-400">Approaching threshold</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evidence & Lineage */}
                    {activeModal === 'evidence' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">🔒</span>
                          <h3 className="text-xl font-bold text-white">Evidence & Data Lineage</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-neutral-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-cyan-300 mb-3">Data Sources</h4>
                            <div className="space-y-2">
                              {[
                                { name: 'Financial Data Warehouse', freshness: '2h ago', policy: '≤24h', status: 'fresh' },
                                { name: 'CRM Pipeline Analytics', freshness: '15m ago', policy: '≤6h', status: 'fresh' },
                                { name: 'Market Intelligence Feed', freshness: '30m ago', policy: '≤1h', status: 'fresh' },
                                { name: 'HR Sentiment Analysis', freshness: '2d ago', policy: '≤7d', status: 'fresh' },
                              ].map((source, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-1">
                                  <span className="text-neutral-300">{source.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-500">{source.freshness}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      source.status === 'fresh' 
                                        ? 'bg-emerald-500/20 text-emerald-300' 
                                        : 'bg-amber-500/20 text-amber-300'
                                    }`}>
                                      {source.status === 'fresh' ? '✓ Within policy' : '⚠ Stale'}
                                    </span>
                                    <span className="text-xs text-neutral-600">(TTL: {source.policy})</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-neutral-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-purple-300 mb-3">Model Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-neutral-500">Model Version:</span>
                                <span className="text-neutral-300 ml-2">horizon-v2.4.1</span>
                              </div>
                              <div>
                                <span className="text-neutral-500">Last Trained:</span>
                                <span className="text-neutral-300 ml-2">2024-12-01</span>
                              </div>
                              <div>
                                <span className="text-neutral-500">Calibration:</span>
                                <span className="text-neutral-300 ml-2">Weekly</span>
                              </div>
                              <div className="relative group">
                                <span className="text-neutral-500">Backtest Score (12mo):</span>
                                <span className="text-neutral-300 ml-2">82.4%</span>
                                <span className="ml-1 text-neutral-500 cursor-help">ⓘ</span>
                                <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                  <strong className="text-white">Backtest Score</strong> = % of periods where prediction was within ±10% tolerance vs actual, across 52 weekly periods. Baseline: seasonal naive forecast.
                                </div>
                              </div>
                              <div>
                                <span className="text-neutral-500">Calibration Error (ECE):</span>
                                <span className="text-neutral-300 ml-2">0.04</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-neutral-800/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-emerald-300 mb-3">Transform Pipeline</h4>
                            <div className="flex items-center gap-2 text-xs text-neutral-400 overflow-x-auto pb-2">
                              <span className="px-2 py-1 bg-neutral-700 rounded">Raw Data</span>
                              <span>→</span>
                              <span className="px-2 py-1 bg-neutral-700 rounded">Cleansing</span>
                              <span>→</span>
                              <span className="px-2 py-1 bg-neutral-700 rounded">Feature Eng.</span>
                              <span>→</span>
                              <span className="px-2 py-1 bg-neutral-700 rounded">Simulation</span>
                              <span>→</span>
                              <span className="px-2 py-1 bg-emerald-700 rounded">Output</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audit Packet */}
                    {activeModal === 'audit' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">📋</span>
                          <h3 className="text-xl font-bold text-white">Generate Audit Packet</h3>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">
                          Export a cryptographically signed bundle containing all decision artifacts.
                        </p>
                        <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
                          <h4 className="text-sm font-medium text-amber-300 mb-3">Packet Contents</h4>
                          <ul className="space-y-2 text-sm text-neutral-300">
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              Decision question and context
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              All options considered with scores
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              Recommendation rationale
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              Data sources and timestamps
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              Model version and parameters
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              SHA-256 integrity hash
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              Ed25519 digital signature
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span>
                              manifest.json + verification instructions
                            </li>
                          </ul>
                          <div className="mt-3 pt-3 border-t border-neutral-700">
                            <p className="text-xs text-neutral-400 mb-2">Signature verification:</p>
                            <code className="block text-xs bg-neutral-900 p-2 rounded text-cyan-300 font-mono">
                              datacendia verify packet.zip --key customer.pub
                            </code>
                            <p className="text-xs text-neutral-500 mt-2">
                              Signed with: Customer key (KMS/HSM) • Algorithm: Ed25519
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={handleDownloadAuditPacket}
                            disabled={isGeneratingAudit}
                            className={cn(
                              "flex-1 px-4 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2",
                              auditGenerated 
                                ? "bg-emerald-500 text-white" 
                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600",
                              isGeneratingAudit && "opacity-70 cursor-wait"
                            )}
                          >
                            {isGeneratingAudit ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Generating...
                              </>
                            ) : auditGenerated ? (
                              <>
                                <span>✓</span>
                                Downloaded!
                              </>
                            ) : (
                              "Download PDF + JSON Bundle"
                            )}
                          </button>
                          <button 
                            onClick={handleSendToApprovers}
                            disabled={isSendingToApprovers}
                            className={cn(
                              "px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2",
                              sentToApprovers 
                                ? "bg-emerald-500 text-white" 
                                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600",
                              isSendingToApprovers && "opacity-70 cursor-wait"
                            )}
                          >
                            {isSendingToApprovers ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Sending...
                              </>
                            ) : sentToApprovers ? (
                              <>
                                <span>✓</span>
                                Sent!
                              </>
                            ) : (
                              "Send to Approvers"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HorizonPage;
